import { Router, Request, Response } from 'express';
import { db } from './db.js';
import { calculateBookingPrice, calculateLogisticsQuote } from '../utils/pricing.js';

export const apiRouter = Router();

// Helper for error responses
const sendError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ success: false, error: message });
};

// ================= AUTH ROUTES =================
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) return sendError(res, 400, 'Email is required');

  const user = db.getUserByEmail(email);
  if (!user) {
    return sendError(res, 401, 'No account found with this email. Try demo accounts or register.');
  }

  if (password && user.password && user.password !== password) {
    return sendError(res, 401, 'Invalid password');
  }

  return res.json({ success: true, user });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role, password, companyName } = req.body;
  if (!name || !email || !role) {
    return sendError(res, 400, 'Name, email, and role are required');
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return sendError(res, 400, 'An account with this email already exists');
  }

  const newUser = db.createUser({
    id: `usr_${Date.now()}`,
    name,
    email,
    phone: phone || '+91 98000 00000',
    role,
    password: password || 'StoreFlex@2026',
    companyName: companyName || `${name}'s Enterprises`,
    kycStatus: 'pending',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, user: newUser });
});

apiRouter.post('/auth/quick-switch', (req: Request, res: Response) => {
  const { role } = req.body;
  const targetEmail = role === 'admin'
    ? 'admin@storeflex.demo'
    : role === 'owner'
    ? 'owner@storeflex.demo'
    : 'business@storeflex.demo';

  const user = db.getUserByEmail(targetEmail);
  if (!user) return sendError(res, 404, 'Demo user not found');
  return res.json({ success: true, user });
});

// ================= PROPERTY ROUTES =================
apiRouter.get('/properties', (req: Request, res: Response) => {
  const { city, category, minArea, maxPrice, onlyVerified } = req.query;
  const verifiedOnly = onlyVerified !== 'false';
  let list = db.getProperties(verifiedOnly);

  if (city && typeof city === 'string' && city !== 'All') {
    list = list.filter(p => p.city.toLowerCase() === city.toLowerCase());
  }

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter(p =>
      p.allowedCategories.some(c => c.toLowerCase() === category.toLowerCase() || c.toLowerCase() === 'general goods')
    );
  }

  if (minArea && !isNaN(Number(minArea))) {
    list = list.filter(p => p.availableArea >= Number(minArea));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    list = list.filter(p => p.pricePerSqFt <= Number(maxPrice));
  }

  return res.json({ success: true, count: list.length, properties: list });
});

apiRouter.get('/properties/:id', (req: Request, res: Response) => {
  const prop = db.getPropertyById(req.params.id);
  if (!prop) return sendError(res, 404, 'Property not found');
  const reviews = db.getReviews(prop.id);
  const units = db.getDb().storageUnits.filter(u => u.propertyId === prop.id);
  return res.json({ success: true, property: prop, reviews, storageUnits: units });
});

apiRouter.post('/properties', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.name || !body.ownerId || !body.totalArea || !body.pricePerSqFt) {
    return sendError(res, 400, 'Missing required property information');
  }

  const newProp = db.createProperty({
    id: `prop_${Date.now()}`,
    ownerId: body.ownerId,
    ownerName: body.ownerName || 'Space Owner',
    ownerPhone: body.ownerPhone || '+91 98000 00000',
    name: body.name,
    propertyType: body.propertyType || 'Warehouse',
    address: body.address || 'Industrial Area',
    city: body.city || 'Meerut',
    pincode: body.pincode || '250001',
    lat: body.lat || 28.9845,
    lng: body.lng || 77.7064,
    totalArea: Number(body.totalArea),
    availableArea: Number(body.totalArea),
    ceilingHeight: Number(body.ceilingHeight || 16),
    floor: body.floor || 'Ground Floor',
    storageType: body.storageType || 'Ambient',
    accessHours: body.accessHours || '8:00 AM - 8:00 PM',
    pricePerSqFt: Number(body.pricePerSqFt),
    minDurationMonths: Number(body.minDurationMonths || 1),
    depositMonths: Number(body.depositMonths || 1),
    allowedCategories: body.allowedCategories || ['FMCG', 'Garments', 'General goods'],
    facilities: body.facilities || ['CCTV', 'Security', 'Loading Area'],
    images: body.images && body.images.length > 0
      ? body.images
      : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'],
    verificationStatus: 'pending', // Requires admin verification
    verificationNotes: 'Newly submitted listing. Verification documents attached.',
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, property: newProp });
});

apiRouter.patch('/properties/:id/verify', (req: Request, res: Response) => {
  const { status, notes, rejectionReason } = req.body;
  if (!status) return sendError(res, 400, 'Status is required');

  const updated = db.updateProperty(req.params.id, {
    verificationStatus: status,
    verificationNotes: notes,
    rejectionReason,
  });

  if (!updated) return sendError(res, 404, 'Property not found');

  // Notify owner
  db.addNotification({
    id: `notif_${Date.now()}`,
    userId: updated.ownerId,
    title: `Property Verification: ${status.toUpperCase()}`,
    message: `Your property "${updated.name}" has been marked as ${status}.`,
    type: 'verification',
    link: '/owner/properties',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return res.json({ success: true, property: updated });
});

// ================= BOOKING ROUTES =================
apiRouter.get('/bookings', (req: Request, res: Response) => {
  const { businessId, ownerId } = req.query;
  let bookings = db.getBookings();

  if (businessId && typeof businessId === 'string') {
    bookings = bookings.filter(b => b.businessId === businessId);
  }
  if (ownerId && typeof ownerId === 'string') {
    bookings = bookings.filter(b => b.ownerId === ownerId);
  }

  return res.json({ success: true, bookings });
});

apiRouter.get('/bookings/:id', (req: Request, res: Response) => {
  const booking = db.getBookingById(req.params.id);
  if (!booking) return sendError(res, 404, 'Booking not found');

  const agreement = db.getAgreements(booking.id)[0];
  const invoice = db.getInvoices().find(i => i.bookingId === booking.id);
  const payment = db.getPayments().find(p => p.bookingId === booking.id);

  return res.json({ success: true, booking, agreement, invoice, payment });
});

apiRouter.post('/bookings', (req: Request, res: Response) => {
  try {
    const {
      businessId,
      businessName,
      businessEmail,
      businessPhone,
      propertyId,
      areaSqFt,
      durationMonths,
      startDate,
      inventorySummary,
      termsAccepted,
    } = req.body;

    if (!propertyId || !businessId || !areaSqFt || !durationMonths) {
      return sendError(res, 400, 'Missing required booking parameters');
    }

    const prop = db.getPropertyById(propertyId);
    if (!prop) return sendError(res, 404, 'Property not found');

    const commissionCfg = db.getCommissionSetting();
    const pricing = calculateBookingPrice({
      areaSqFt: Number(areaSqFt),
      ratePerSqFtPerMonth: prop.pricePerSqFt,
      durationMonths: Number(durationMonths),
      platformFeePercent: commissionCfg.platformCommissionPercent,
      minPlatformFee: commissionCfg.minPlatformFee,
      depositMonths: prop.depositMonths || 1,
    });

    const start = new Date(startDate || Date.now());
    const end = new Date(start);
    end.setMonth(end.getMonth() + Number(durationMonths));

    const unitCode = `${prop.city.slice(0, 3).toUpperCase()}-0${Math.floor(Math.random() * 8) + 1}-B${Math.floor(10 + Math.random() * 90)}`;

    const newBooking = db.createBooking({
      businessId,
      businessName: businessName || 'Business Enterprise',
      businessEmail: businessEmail || 'business@storeflex.demo',
      businessPhone: businessPhone || '+91 98000 00000',
      propertyId: prop.id,
      propertyName: prop.name,
      propertyAddress: prop.address,
      propertyCity: prop.city,
      ownerId: prop.ownerId,
      ownerName: prop.ownerName,
      storageUnitId: `unit_${Date.now()}`,
      unitCode,
      areaSqFt: Number(areaSqFt),
      durationMonths: Number(durationMonths),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      monthlyRate: prop.pricePerSqFt,
      totalStorageAmount: pricing.baseStorageCost,
      platformFeePercent: pricing.platformFeePercent,
      platformFee: pricing.platformFee,
      depositAmount: pricing.depositAmount,
      taxGst: pricing.taxGst,
      totalAmount: pricing.totalCustomerPayable,
      ownerGrossEarnings: pricing.ownerGrossEarnings,
      ownerNetPayout: pricing.ownerNetPayout,
      status: 'Active',
      inventorySummary: inventorySummary || 'Standard commercial merchandise',
      termsAccepted: Boolean(termsAccepted),
    });

    return res.status(201).json({ success: true, booking: newBooking });
  } catch (err: any) {
    return sendError(res, 400, err.message || 'Failed to create booking');
  }
});

apiRouter.post('/bookings/:id/cancel', (req: Request, res: Response) => {
  const cancelled = db.cancelBooking(req.params.id);
  if (!cancelled) return sendError(res, 404, 'Booking not found');
  return res.json({ success: true, booking: cancelled });
});

// ================= INVENTORY ROUTES =================
apiRouter.get('/inventory', (req: Request, res: Response) => {
  const { businessId } = req.query;
  const items = db.getInventory(typeof businessId === 'string' ? businessId : undefined);
  return res.json({ success: true, items });
});

apiRouter.post('/inventory', (req: Request, res: Response) => {
  const { businessId, storageUnitId, unitCode, propertyId, propertyName, sku, productName, category, quantity, unit, unitValue, notes } = req.body;
  if (!businessId || !productName || !quantity) {
    return sendError(res, 400, 'businessId, productName, and quantity are required');
  }

  const item = db.addInventoryItem({
    id: `inv_${Date.now()}`,
    businessId,
    storageUnitId: storageUnitId || 'unit_mer_b17',
    unitCode: unitCode || 'MER-04-B17',
    propertyId: propertyId || 'prop_meerut_1',
    propertyName: propertyName || 'Meerut Central Logistics Hub',
    sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
    productName,
    category: category || 'General goods',
    quantity: Number(quantity),
    unit: unit || 'Cartons',
    unitValue: Number(unitValue || 500),
    totalValue: Number(quantity) * Number(unitValue || 500),
    dateReceived: new Date().toISOString(),
    notes,
    lowStockThreshold: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, item });
});

apiRouter.patch('/inventory/:id', (req: Request, res: Response) => {
  const updated = db.updateInventoryItem(req.params.id, req.body);
  if (!updated) return sendError(res, 404, 'Item not found');
  return res.json({ success: true, item: updated });
});

apiRouter.delete('/inventory/:id', (req: Request, res: Response) => {
  const ok = db.deleteInventoryItem(req.params.id);
  if (!ok) return sendError(res, 404, 'Item not found');
  return res.json({ success: true });
});

apiRouter.post('/inventory/movement', (req: Request, res: Response) => {
  const { inventoryItemId, businessId, movementType, quantity, notes } = req.body;
  const item = db.getInventory().find(i => i.id === inventoryItemId);
  if (!item) return sendError(res, 404, 'Inventory item not found');

  const qty = Number(quantity);
  const prev = item.quantity;
  let newQty = prev;

  if (movementType === 'IN') newQty += qty;
  else if (movementType === 'OUT') {
    if (prev < qty) return sendError(res, 400, `Cannot dispatch ${qty}. Only ${prev} in stock.`);
    newQty -= qty;
  } else if (movementType === 'ADJUSTMENT') {
    newQty = qty;
  }

  const movement = db.recordInventoryMovement({
    id: `mov_${Date.now()}`,
    inventoryItemId,
    businessId,
    sku: item.sku,
    productName: item.productName,
    movementType,
    quantity: qty,
    previousQuantity: prev,
    newQuantity: newQty,
    notes: notes || `Stock ${movementType}`,
    timestamp: new Date().toISOString(),
  });

  return res.json({ success: true, movement, updatedItem: item });
});

apiRouter.get('/inventory/movements', (req: Request, res: Response) => {
  const { businessId } = req.query;
  const movements = db.getInventoryMovements(typeof businessId === 'string' ? businessId : undefined);
  return res.json({ success: true, movements });
});

// ================= LOGISTICS ROUTES =================
apiRouter.get('/logistics', (req: Request, res: Response) => {
  const { businessId } = req.query;
  const orders = db.getLogisticsOrders(typeof businessId === 'string' ? businessId : undefined);
  return res.json({ success: true, orders });
});

apiRouter.post('/logistics/quote', (req: Request, res: Response) => {
  const { vehicleType, distanceKm, itemCount } = req.body;
  const quote = calculateLogisticsQuote(vehicleType || 'Tata Ace', Number(distanceKm || 15), Number(itemCount || 50));
  return res.json({ success: true, quote });
});

apiRouter.post('/logistics', (req: Request, res: Response) => {
  const {
    businessId,
    businessName,
    businessPhone,
    bookingId,
    propertyName,
    pickupAddress,
    dropAddress,
    inventoryDetails,
    itemCount,
    vehicleType,
    estimatedDistanceKm,
    preferredDate,
    preferredTimeSlot,
  } = req.body;

  const quote = calculateLogisticsQuote(
    vehicleType || 'Tata Ace',
    Number(estimatedDistanceKm || 15),
    Number(itemCount || 30)
  );

  const order = db.createLogisticsOrder({
    id: `log_${Date.now()}`,
    orderNumber: `LOG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    businessId,
    businessName: businessName || 'Sharma Retail',
    businessPhone: businessPhone || '+91 98101 23456',
    bookingId,
    propertyName,
    pickupAddress,
    dropAddress,
    inventoryDetails: inventoryDetails || 'Commercial inventory items',
    itemCount: Number(itemCount || 30),
    vehicleType: vehicleType || 'Tata Ace',
    estimatedDistanceKm: Number(estimatedDistanceKm || 15),
    estimatedCost: quote.totalFare,
    preferredDate: preferredDate || new Date().toISOString().slice(0, 10),
    preferredTimeSlot: preferredTimeSlot || '10:00 AM - 1:00 PM',
    status: 'Requested',
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, order });
});

apiRouter.patch('/logistics/:id', (req: Request, res: Response) => {
  const updated = db.updateLogisticsOrder(req.params.id, req.body);
  if (!updated) return sendError(res, 404, 'Logistics order not found');
  return res.json({ success: true, order: updated });
});

// ================= DISPUTE ROUTES =================
apiRouter.get('/disputes', (req: Request, res: Response) => {
  const { userId } = req.query;
  const disputes = db.getDisputes(typeof userId === 'string' ? userId : undefined);
  return res.json({ success: true, disputes });
});

apiRouter.post('/disputes', (req: Request, res: Response) => {
  const {
    bookingId,
    bookingNumber,
    propertyId,
    propertyName,
    businessId,
    businessName,
    ownerId,
    ownerName,
    category,
    title,
    description,
  } = req.body;

  if (!title || !description || !category) {
    return sendError(res, 400, 'Title, description, and category are required');
  }

  const dispute = db.createDispute({
    id: `dsp_${Date.now()}`,
    disputeNumber: `DSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    bookingId,
    bookingNumber: bookingNumber || 'SF-2026-000123',
    propertyId,
    propertyName: propertyName || 'StoreFlex Facility',
    businessId,
    businessName: businessName || 'Business',
    ownerId: ownerId || 'usr_owner_1',
    ownerName: ownerName || 'Space Owner',
    category,
    title,
    description,
    status: 'Open',
    messages: [
      {
        id: `msg_${Date.now()}`,
        senderId: businessId,
        senderName: businessName || 'Business',
        senderRole: 'business',
        message: description,
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, dispute });
});

apiRouter.post('/disputes/:id/messages', (req: Request, res: Response) => {
  const { senderId, senderName, senderRole, message } = req.body;
  const dispute = db.getDisputes().find(d => d.id === req.params.id);
  if (!dispute) return sendError(res, 404, 'Dispute not found');

  dispute.messages.push({
    id: `msg_${Date.now()}`,
    senderId,
    senderName,
    senderRole,
    message,
    timestamp: new Date().toISOString(),
  });
  dispute.updatedAt = new Date().toISOString();
  db.getDb(); // trigger save
  return res.json({ success: true, dispute });
});

apiRouter.patch('/disputes/:id/resolve', (req: Request, res: Response) => {
  const { status, resolution } = req.body;
  const updated = db.updateDispute(req.params.id, {
    status: status || 'Resolved',
    resolution,
  });
  if (!updated) return sendError(res, 404, 'Dispute not found');
  return res.json({ success: true, dispute: updated });
});

// ================= REVIEWS ROUTES =================
apiRouter.get('/reviews', (req: Request, res: Response) => {
  const { propertyId } = req.query;
  const reviews = db.getReviews(typeof propertyId === 'string' ? propertyId : undefined);
  return res.json({ success: true, reviews });
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  const { propertyId, propertyName, bookingId, businessId, businessName, rating, cleanlinessRating, securityRating, accessibilityRating, accuracyRating, comment } = req.body;
  if (!propertyId || !rating) return sendError(res, 400, 'Property and rating are required');

  const review = db.addReview({
    id: `rev_${Date.now()}`,
    propertyId,
    propertyName: propertyName || 'Facility',
    bookingId: bookingId || `bk_${Date.now()}`,
    businessId: businessId || 'usr_business_1',
    businessName: businessName || 'Verified Merchant',
    rating: Number(rating),
    cleanlinessRating: Number(cleanlinessRating || rating),
    securityRating: Number(securityRating || rating),
    accessibilityRating: Number(accessibilityRating || rating),
    accuracyRating: Number(accuracyRating || rating),
    comment: comment || 'Smooth storage experience.',
    isModerated: true,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, review });
});

// ================= COMMISSION SETTINGS =================
apiRouter.get('/commission', (_req: Request, res: Response) => {
  return res.json({ success: true, commission: db.getCommissionSetting() });
});

apiRouter.put('/commission', (req: Request, res: Response) => {
  const { platformCommissionPercent, minPlatformFee, logisticsCommissionPercent } = req.body;
  const updated = db.updateCommissionSetting({
    platformCommissionPercent: Number(platformCommissionPercent || 20),
    minPlatformFee: Number(minPlatformFee || 500),
    logisticsCommissionPercent: Number(logisticsCommissionPercent || 10),
  });
  return res.json({ success: true, commission: updated });
});

// ================= PAYMENTS, INVOICES, PAYOUTS =================
apiRouter.get('/payments', (req: Request, res: Response) => {
  const { businessId } = req.query;
  const payments = db.getPayments(typeof businessId === 'string' ? businessId : undefined);
  return res.json({ success: true, payments });
});

apiRouter.get('/invoices', (req: Request, res: Response) => {
  const { businessId } = req.query;
  const invoices = db.getInvoices(typeof businessId === 'string' ? businessId : undefined);
  return res.json({ success: true, invoices });
});

apiRouter.get('/payouts', (req: Request, res: Response) => {
  const { ownerId } = req.query;
  const payouts = db.getPayouts(typeof ownerId === 'string' ? ownerId : undefined);
  return res.json({ success: true, payouts });
});

// ================= NOTIFICATIONS =================
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const { userId } = req.query;
  const notifs = db.getNotifications(typeof userId === 'string' ? userId : undefined);
  return res.json({ success: true, notifications: notifs });
});

apiRouter.patch('/notifications/:id/read', (req: Request, res: Response) => {
  db.markNotificationAsRead(req.params.id);
  return res.json({ success: true });
});

// ================= ADMIN & ANALYTICS =================
apiRouter.get('/admin/stats', (_req: Request, res: Response) => {
  const raw = db.getDb();
  const totalBusinesses = raw.users.filter(u => u.role === 'business').length;
  const totalOwners = raw.users.filter(u => u.role === 'owner').length;
  const totalProperties = raw.properties.length;
  const verifiedProperties = raw.properties.filter(p => p.verificationStatus === 'verified').length;
  const pendingVerification = raw.properties.filter(p => p.verificationStatus === 'pending' || p.verificationStatus === 'under_review').length;
  const activeBookings = raw.bookings.filter(b => b.status === 'Active' || b.status === 'Confirmed').length;
  
  const totalCapacity = raw.properties.reduce((sum, p) => sum + p.totalArea, 0);
  const availableCapacity = raw.properties.reduce((sum, p) => sum + p.availableArea, 0);
  const occupiedCapacity = totalCapacity - availableCapacity;
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedCapacity / totalCapacity) * 100) : 0;

  const gmv = raw.bookings.reduce((sum, b) => sum + b.totalStorageAmount, 0);
  const platformRevenue = raw.bookings.reduce((sum, b) => sum + b.platformFee, 0);
  const openDisputes = raw.disputes.filter(d => d.status === 'Open' || d.status === 'Under Review').length;

  return res.json({
    success: true,
    stats: {
      totalBusinesses,
      totalOwners,
      totalProperties,
      verifiedProperties,
      pendingVerification,
      activeBookings,
      totalCapacity,
      occupiedCapacity,
      availableCapacity,
      occupancyRate,
      gmv,
      platformRevenue,
      openDisputes,
    },
  });
});

apiRouter.get('/admin/users', (_req: Request, res: Response) => {
  return res.json({ success: true, users: db.getUsers() });
});

apiRouter.patch('/admin/users/:id/kyc', (req: Request, res: Response) => {
  const { kycStatus } = req.body;
  const user = db.updateUser(req.params.id, { kycStatus });
  if (!user) return sendError(res, 404, 'User not found');
  return res.json({ success: true, user });
});

apiRouter.post('/admin/reset-seed', (_req: Request, res: Response) => {
  const fresh = db.resetToDefaultSeed();
  return res.json({ success: true, message: 'Database reset to initial Indian demo dataset', fresh });
});

// ================= SYSTEM CONFIG & MVP DEMO STATUS =================
apiRouter.get('/system/config', (_req: Request, res: Response) => {
  const dbUrl = process.env.DATABASE_URL;
  const authSecret = process.env.AUTH_SECRET;
  const paymentKey = process.env.PAYMENT_KEY;
  const mapsKey = process.env.MAPS_KEY;
  const storageKey = process.env.STORAGE_KEY;
  const emailKey = process.env.EMAIL_KEY;
  const aiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

  return res.json({
    success: true,
    isDemoMode: true,
    services: {
      database: {
        configured: Boolean(dbUrl),
        mode: dbUrl ? 'external_postgres' : 'mock_in_memory_json',
        status: 'operational',
        description: 'Persistent JSON database (.storeflex-data.json) active with full NCR warehouse seed.',
      },
      auth: {
        configured: Boolean(authSecret),
        mode: authSecret ? 'jwt_production' : 'demo_seeded_users',
        status: 'operational',
        description: 'Demo authentication active with 3 pre-seeded Indian business and admin personas.',
      },
      payments: {
        configured: Boolean(paymentKey),
        mode: paymentKey ? 'razorpay_live' : 'mock_payments_simulator',
        status: 'operational',
        description: 'Mock Razorpay payment gateway enabled. Instant instant tokenization and receipts.',
      },
      maps: {
        configured: Boolean(mapsKey),
        mode: mapsKey ? 'google_maps_platform' : 'mock_regional_grid',
        status: 'operational',
        description: 'Delhi-NCR regional warehouse grid with distance matrices and coordinate mapping.',
      },
      storage: {
        configured: Boolean(storageKey),
        mode: storageKey ? 's3_gcs_cloud' : 'mock_local_storage',
        status: 'operational',
        description: 'Local and mock asset storage enabled for property photos and commercial documents.',
      },
      email: {
        configured: Boolean(emailKey),
        mode: emailKey ? 'smtp_resend' : 'in_app_notification_system',
        status: 'operational',
        description: 'Transactional notifications dispatched directly to in-app notification center.',
      },
      ai: {
        configured: Boolean(aiKey),
        mode: aiKey ? 'gemini_ai_live' : 'deterministic_mock_engine',
        status: 'operational',
        description: 'Smart AI matching engine with deterministic NCR capacity and carton sizing algorithms.',
      },
    },
  });
});

// ================= STORAGE (MOCK / LOCAL STORAGE) =================
apiRouter.post('/storage/upload', (req: Request, res: Response) => {
  const { fileName, fileType, fileSize, category } = req.body;
  const timestamp = Date.now();
  const safeName = (fileName || 'document.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Choose sensible default sample images for properties or documents
  const mockWarehouseImages = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
  ];
  const selectedImage = mockWarehouseImages[timestamp % mockWarehouseImages.length];

  return res.json({
    success: true,
    fileId: `file_${timestamp}`,
    fileName: safeName,
    fileUrl: category === 'property_photo' ? selectedImage : `/uploads/mock/${safeName}`,
    fileSize: fileSize || 1024 * 250,
    fileType: fileType || 'image/jpeg',
    storageProvider: process.env.STORAGE_KEY ? 'cloud_s3' : 'mock_local_storage',
    message: 'File stored successfully in MVP local storage.',
  });
});

// ================= EMAIL / NOTIFICATION DISPATCHER =================
apiRouter.post('/email/send', (req: Request, res: Response) => {
  const { recipientEmail, recipientId, subject, body, templateType, link } = req.body;
  if (!recipientEmail || !subject) {
    return sendError(res, 400, 'recipientEmail and subject are required');
  }

  // Look up user if recipientId wasn't passed directly
  let targetUser = recipientId ? db.getUserById(recipientId) : db.getUserByEmail(recipientEmail);
  const targetId = targetUser?.id || recipientId || 'usr_business_1';

  // Inject directly into the in-app notification system (#6)
  const notification = db.createNotification({
    userId: targetId,
    title: subject,
    message: body || `Notification sent to ${recipientEmail}`,
    type: (templateType as any) || 'booking',
    link: link || '/notifications',
  });

  return res.json({
    success: true,
    sentVia: process.env.EMAIL_KEY ? 'smtp_resend' : 'in_app_notification_system',
    message: `Message dispatched successfully to ${recipientEmail} and logged in in-app notification center.`,
    notificationId: notification.id,
  });
});

// ================= MAPS & LOCATION CLUSTERS =================
apiRouter.get('/maps/config', (_req: Request, res: Response) => {
  const clusters = [
    { id: 'meerut', name: 'Meerut Logistic Corridor', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, warehouseCount: 2, avgRatePerSqFt: 18 },
    { id: 'ghaziabad', name: 'Ghaziabad Industrial Area', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, warehouseCount: 2, avgRatePerSqFt: 21 },
    { id: 'noida', name: 'Noida Phase II & Expressways', city: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, warehouseCount: 1, avgRatePerSqFt: 26 },
    { id: 'delhi_okhla', name: 'Delhi Okhla & South Hub', city: 'Delhi', state: 'Delhi', lat: 28.5355, lng: 77.2750, warehouseCount: 1, avgRatePerSqFt: 32 },
    { id: 'gurugram', name: 'Gurugram Manesar Expressway', city: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, warehouseCount: 1, avgRatePerSqFt: 30 },
    { id: 'kundli', name: 'Kundli / GT Road Corridor', city: 'Kundli', state: 'Haryana', lat: 28.8787, lng: 77.1265, warehouseCount: 1, avgRatePerSqFt: 19 },
  ];

  return res.json({
    success: true,
    isMock: !Boolean(process.env.MAPS_KEY),
    provider: process.env.MAPS_KEY ? 'google_maps' : 'mock_ncr_grid',
    defaultCenter: { lat: 28.6139, lng: 77.2090, zoom: 10 },
    clusters,
  });
});

// ================= AI MATCHING & RECOMMENDATIONS =================
apiRouter.post('/ai/recommend', (req: Request, res: Response) => {
  const { city, category, requiredAreaSqFt, budgetPerSqFt } = req.body;
  const rawProperties = db.getProperties(true);

  let filtered = rawProperties;
  if (city && city !== 'All') {
    filtered = filtered.filter(p => p.city.toLowerCase() === city.toLowerCase());
  }
  if (filtered.length === 0) filtered = rawProperties;

  const topMatch = filtered[0];

  return res.json({
    success: true,
    engine: (process.env.AI_API_KEY || process.env.GEMINI_API_KEY) ? 'gemini_live' : 'deterministic_mock_engine',
    summary: `Based on your request for ${requiredAreaSqFt || 200} sq ft for ${category || 'goods'} in ${city || 'Delhi NCR'}, we evaluated ${rawProperties.length} verified commercial facilities.`,
    topRecommendation: topMatch ? {
      propertyId: topMatch.id,
      name: topMatch.name,
      city: topMatch.city,
      matchScore: 96,
      reason: `Optimal ceiling height (${topMatch.ceilingHeight}ft) with 24/7 security and verified fire safety audit.`,
      monthlyEstimate: (Number(requiredAreaSqFt) || 200) * topMatch.pricePerSqFt,
    } : null,
    insights: [
      'Multi-tier stacking can save up to 22% of total required floor area.',
      'Facilities near Delhi-Meerut Expressway have average 15-minute logistics transit times.',
      'Flexible month-to-month contracts reduce seasonal holding costs by 35%.',
    ],
  });
});

// ================= MOCK PAYMENT GATEWAY =================
apiRouter.post('/payments/process', (req: Request, res: Response) => {
  const { bookingId, amount, paymentMethod } = req.body;
  const timestamp = Date.now();
  const mockTxnId = `pay_mock_${timestamp}_${Math.floor(1000 + Math.random() * 9000)}`;

  let booking: any = null;
  if (bookingId) {
    booking = db.getBookingById(bookingId);
  }

  return res.json({
    success: true,
    transactionId: mockTxnId,
    amount: amount || booking?.totalAmount || 5000,
    status: 'Captured',
    paymentMethod: paymentMethod || 'UPI (Google Pay / PhonePe)',
    timestamp: new Date().toISOString(),
    isMock: !Boolean(process.env.PAYMENT_KEY),
    receiptUrl: `/receipts/${mockTxnId}.pdf`,
    message: 'Payment simulated successfully with zero external API key requirements.',
  });
});

