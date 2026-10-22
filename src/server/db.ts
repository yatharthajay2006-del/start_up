import fs from 'fs';
import path from 'path';
import type {
  User,
  Property,
  StorageUnit,
  Booking,
  InventoryItem,
  InventoryMovement,
  Payment,
  Invoice,
  Payout,
  Review,
  Dispute,
  LogisticsOrder,
  AppNotification,
  DigitalAgreement,
  CommissionSetting,
} from '../types/index.ts';

export interface DatabaseSchema {
  users: User[];
  properties: Property[];
  storageUnits: StorageUnit[];
  bookings: Booking[];
  inventoryItems: InventoryItem[];
  inventoryMovements: InventoryMovement[];
  payments: Payment[];
  invoices: Invoice[];
  payouts: Payout[];
  reviews: Review[];
  disputes: Dispute[];
  logisticsOrders: LogisticsOrder[];
  notifications: AppNotification[];
  agreements: DigitalAgreement[];
  commissionSetting: CommissionSetting;
}

const DB_FILE_PATH = path.resolve(process.cwd(), '.storeflex-data.json');

// Initial seed data generator
function getInitialSeedData(): DatabaseSchema {
  const users: User[] = [
    {
      id: 'usr_business_1',
      name: 'Rajesh Sharma',
      email: 'business@storeflex.demo',
      phone: '+91 98101 23456',
      role: 'business',
      password: 'StoreFlex@2026',
      companyName: 'Sharma Retail & Electronics',
      kycStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-10T09:00:00Z',
    },
    {
      id: 'usr_owner_1',
      name: 'Vikram Malhotra',
      email: 'owner@storeflex.demo',
      phone: '+91 98765 43210',
      role: 'owner',
      password: 'StoreFlex@2026',
      companyName: 'Malhotra Logistics & Warehousing',
      kycStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-07-15T11:30:00Z',
    },
    {
      id: 'usr_owner_2',
      name: 'Anil Tyagi',
      email: 'anil.tyagi@godownhub.in',
      phone: '+91 99270 55432',
      role: 'owner',
      password: 'StoreFlex@2026',
      companyName: 'NCR Cold Storage & Logistics',
      kycStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-07-20T10:00:00Z',
    },
    {
      id: 'usr_admin_1',
      name: 'StoreFlex Admin',
      email: 'admin@storeflex.demo',
      phone: '+91 11 4050 9000',
      role: 'admin',
      password: 'StoreFlex@2026',
      companyName: 'StoreFlex Operations India',
      kycStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-06-01T08:00:00Z',
    },
  ];

  const properties: Property[] = [
    {
      id: 'prop_meerut_1',
      ownerId: 'usr_owner_1',
      ownerName: 'Vikram Malhotra',
      ownerPhone: '+91 98765 43210',
      name: 'Meerut Central Logistics Hub',
      propertyType: 'Warehouse',
      address: 'Plot 42, Partapur Industrial Area, Delhi Road',
      city: 'Meerut',
      pincode: '250103',
      lat: 28.9432,
      lng: 77.6744,
      totalArea: 5000,
      availableArea: 3200, // 1800 booked
      ceilingHeight: 18,
      floor: 'Ground Floor RCC',
      storageType: 'Ambient',
      accessHours: '24/7 Access with Security Check',
      pricePerSqFt: 18,
      minDurationMonths: 1,
      depositMonths: 1,
      allowedCategories: ['Electronics', 'FMCG', 'Garments', 'Packaging', 'General goods'],
      facilities: ['CCTV', 'Security 24/7', 'Loading Dock', 'Heavy Vehicle Parking', 'Fire Hydrant & Extinguishers', 'Forklift on demand', 'Power Backup'],
      images: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: 'verified',
      verificationNotes: 'KYC & commercial registry verified. Fire NOC valid until 2028.',
      rating: 4.8,
      reviewCount: 24,
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'prop_ghaziabad_1',
      ownerId: 'usr_owner_1',
      ownerName: 'Vikram Malhotra',
      ownerPhone: '+91 98765 43210',
      name: 'Sahibabad Commercial Godown',
      propertyType: 'Godown',
      address: 'Site 4 Industrial Area, Near Anand Vihar Border',
      city: 'Ghaziabad',
      pincode: '201010',
      lat: 28.6692,
      lng: 77.3538,
      totalArea: 4000,
      availableArea: 2500,
      ceilingHeight: 16,
      floor: 'Ground Floor with Ramp',
      storageType: 'Ambient',
      accessHours: '6:00 AM - 10:00 PM',
      pricePerSqFt: 22,
      minDurationMonths: 2,
      depositMonths: 1,
      allowedCategories: ['Garments', 'FMCG', 'Packaging', 'Furniture', 'Electronics'],
      facilities: ['CCTV', 'Loading Ramp', 'Security Guard', 'Goods Lift', 'Wide Road Access'],
      images: [
        'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: 'verified',
      verificationNotes: 'Full physical audit completed by StoreFlex Field Officer.',
      rating: 4.6,
      reviewCount: 19,
      createdAt: '2026-08-05T12:00:00Z',
      updatedAt: '2026-08-05T12:00:00Z',
    },
    {
      id: 'prop_noida_1',
      ownerId: 'usr_owner_2',
      ownerName: 'Anil Tyagi',
      ownerPhone: '+91 99270 55432',
      name: 'Noida Phase-2 E-Commerce Hub',
      propertyType: 'Fulfillment Center',
      address: 'Sector 83, Phase-2 Hosiery Complex',
      city: 'Noida',
      pincode: '201305',
      lat: 28.5126,
      lng: 77.391,
      totalArea: 6500,
      availableArea: 4800,
      ceilingHeight: 22,
      floor: 'Level 1 with Heavy Freight Elevator',
      storageType: 'Climate Controlled',
      accessHours: '24/7 Access',
      pricePerSqFt: 26,
      minDurationMonths: 1,
      depositMonths: 1,
      allowedCategories: ['Electronics', 'Cosmetics & FMCG', 'Garments', 'General goods'],
      facilities: ['Climate Control 22°C', 'Automated CCTV', 'Dock Leveler', 'Fire Sprinkler Grid', 'Pallet Racking Included', 'Biometric Entry'],
      images: [
        'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: 'verified',
      verificationNotes: 'Grade-A warehouse certification verified.',
      rating: 4.9,
      reviewCount: 32,
      createdAt: '2026-08-10T14:00:00Z',
      updatedAt: '2026-08-10T14:00:00Z',
    },
    {
      id: 'prop_delhi_1',
      ownerId: 'usr_owner_2',
      ownerName: 'Anil Tyagi',
      ownerPhone: '+91 99270 55432',
      name: 'Okhla Phase-3 Flexi Storage',
      propertyType: 'Basement Commercial',
      address: 'Near Modi Mill Flyover, Okhla Industrial Area',
      city: 'Delhi',
      pincode: '110020',
      lat: 28.5448,
      lng: 77.2726,
      totalArea: 3000,
      availableArea: 1900,
      ceilingHeight: 14,
      floor: 'Basement with Dedicated Vehicle Ramp',
      storageType: 'Ambient',
      accessHours: '8:00 AM - 9:00 PM',
      pricePerSqFt: 28,
      minDurationMonths: 1,
      depositMonths: 1,
      allowedCategories: ['Garments', 'Footwear', 'Packaging', 'General goods'],
      facilities: ['CCTV', 'Vehicle Ramp', '24/7 Security', 'Moisture Proof Flooring', 'Goods Lift'],
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: 'verified',
      verificationNotes: 'DDA commercial permit & structural certificate audited.',
      rating: 4.5,
      reviewCount: 15,
      createdAt: '2026-08-12T09:00:00Z',
      updatedAt: '2026-08-12T09:00:00Z',
    },
    {
      id: 'prop_gurugram_1',
      ownerId: 'usr_owner_1',
      ownerName: 'Vikram Malhotra',
      ownerPhone: '+91 98765 43210',
      name: 'Manesar Logistics Park Unit B',
      propertyType: 'Industrial Shed',
      address: 'Sector 8, IMT Manesar',
      city: 'Gurugram',
      pincode: '122051',
      lat: 28.3588,
      lng: 76.9412,
      totalArea: 8000,
      availableArea: 6000,
      ceilingHeight: 24,
      floor: 'Laser Screed Industrial Flooring',
      storageType: 'Heavy Duty',
      accessHours: '24/7 Access',
      pricePerSqFt: 21,
      minDurationMonths: 3,
      depositMonths: 2,
      allowedCategories: ['Furniture', 'Automotive Parts', 'Electronics', 'Packaging', 'General goods'],
      facilities: ['Heavy Stacking Floor 5T/sqm', 'Multiple Docks', 'CCTV 360', 'Trailer Turning Radius', 'Weighbridge'],
      images: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: 'verified',
      verificationNotes: 'HSVP allotment papers verified.',
      rating: 4.7,
      reviewCount: 28,
      createdAt: '2026-08-15T11:00:00Z',
      updatedAt: '2026-08-15T11:00:00Z',
    },
    {
      id: 'prop_faridabad_1',
      ownerId: 'usr_owner_2',
      ownerName: 'Anil Tyagi',
      ownerPhone: '+91 99270 55432',
      name: 'Mathura Road Industrial Depot',
      propertyType: 'Warehouse',
      address: 'Plot 18, Sector 6, Mathura Road',
      city: 'Faridabad',
      pincode: '121006',
      lat: 28.3845,
      lng: 77.3142,
      totalArea: 3500,
      availableArea: 2800,
      ceilingHeight: 15,
      floor: 'Ground Floor',
      storageType: 'Ambient',
      accessHours: '7:00 AM - 9:00 PM',
      pricePerSqFt: 19,
      minDurationMonths: 1,
      depositMonths: 1,
      allowedCategories: ['Hardware & Tools', 'FMCG', 'Garments', 'General goods'],
      facilities: ['CCTV', 'Security', 'Unloading Bay', 'Power Backup'],
      images: [
        'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: 'verified',
      verificationNotes: 'Approved after verification visit.',
      rating: 4.4,
      reviewCount: 11,
      createdAt: '2026-08-20T16:00:00Z',
      updatedAt: '2026-08-20T16:00:00Z',
    },
    // Pending verification property for Admin queue
    {
      id: 'prop_pending_1',
      ownerId: 'usr_owner_1',
      ownerName: 'Vikram Malhotra',
      ownerPhone: '+91 98765 43210',
      name: 'Modinagar Bypass Flex Shed',
      propertyType: 'Industrial Shed',
      address: 'National Highway 58, Near Railway Crossing',
      city: 'Meerut',
      pincode: '201204',
      lat: 28.8354,
      lng: 77.5812,
      totalArea: 4500,
      availableArea: 4500,
      ceilingHeight: 20,
      floor: 'Reinforced Concrete Ground',
      storageType: 'Open Yard',
      accessHours: '24/7 Access',
      pricePerSqFt: 14,
      minDurationMonths: 1,
      depositMonths: 1,
      allowedCategories: ['Agricultural Equipment', 'Ceramics & Tiles', 'Packaging', 'General goods'],
      facilities: ['Wide Gate', 'Night Floodlights', 'Perimeter Boundary Wall', 'Security Cabin'],
      images: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: 'pending',
      verificationNotes: 'Owner submitted property deed and electricity bill. Awaiting physical inspector report.',
      rating: 0,
      reviewCount: 0,
      createdAt: '2026-10-18T14:30:00Z',
      updatedAt: '2026-10-18T14:30:00Z',
    },
    {
      id: 'prop_pending_2',
      ownerId: 'usr_owner_2',
      ownerName: 'Anil Tyagi',
      ownerPhone: '+91 99270 55432',
      name: 'Greater Noida EcoTech Godown',
      propertyType: 'Warehouse',
      address: 'EcoTech 3, Near Knowledge Park',
      city: 'Noida',
      pincode: '201306',
      lat: 28.5312,
      lng: 77.4891,
      totalArea: 5500,
      availableArea: 5500,
      ceilingHeight: 18,
      floor: 'Ground Floor',
      storageType: 'Ambient',
      accessHours: '8:00 AM - 8:00 PM',
      pricePerSqFt: 20,
      minDurationMonths: 1,
      depositMonths: 1,
      allowedCategories: ['Electronics', 'Furniture', 'Packaging'],
      facilities: ['CCTV', 'Security', 'Loading Area'],
      images: [
        'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
      ],
      verificationStatus: 'under_review',
      verificationNotes: 'Under review by Admin team. Ownership docs verified.',
      rating: 0,
      reviewCount: 0,
      createdAt: '2026-10-19T08:00:00Z',
      updatedAt: '2026-10-19T08:00:00Z',
    },
  ];

  const storageUnits: StorageUnit[] = [
    {
      id: 'unit_mer_b17',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      unitCode: 'MER-04-B17',
      floor: 'Ground Floor Bay B',
      areaSqFt: 250,
      status: 'occupied',
      heightFt: 18,
      currentBookingId: 'bk_2026_001',
    },
    {
      id: 'unit_mer_b18',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      unitCode: 'MER-04-B18',
      floor: 'Ground Floor Bay B',
      areaSqFt: 500,
      status: 'available',
      heightFt: 18,
    },
    {
      id: 'unit_mer_b19',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      unitCode: 'MER-04-B19',
      floor: 'Ground Floor Bay B',
      areaSqFt: 750,
      status: 'available',
      heightFt: 18,
    },
    {
      id: 'unit_gzb_a04',
      propertyId: 'prop_ghaziabad_1',
      propertyName: 'Sahibabad Commercial Godown',
      unitCode: 'GZB-01-A04',
      floor: 'Ground Floor Section A',
      areaSqFt: 300,
      status: 'available',
      heightFt: 16,
    },
    {
      id: 'unit_noi_c09',
      propertyId: 'prop_noida_1',
      propertyName: 'Noida Phase-2 E-Commerce Hub',
      unitCode: 'NOI-03-C09',
      floor: 'Level 1 Climate Zone',
      areaSqFt: 400,
      status: 'available',
      heightFt: 22,
    },
    {
      id: 'unit_del_d02',
      propertyId: 'prop_delhi_1',
      propertyName: 'Okhla Phase-3 Flexi Storage',
      unitCode: 'DEL-02-D02',
      floor: 'Basement Bay 2',
      areaSqFt: 200,
      status: 'available',
      heightFt: 14,
    },
  ];

  const bookings: Booking[] = [
    {
      id: 'bk_2026_001',
      bookingNumber: 'SF-2026-000123',
      businessId: 'usr_business_1',
      businessName: 'Sharma Retail & Electronics',
      businessEmail: 'business@storeflex.demo',
      businessPhone: '+91 98101 23456',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      propertyAddress: 'Plot 42, Partapur Industrial Area, Delhi Road',
      propertyCity: 'Meerut',
      ownerId: 'usr_owner_1',
      ownerName: 'Vikram Malhotra',
      storageUnitId: 'unit_mer_b17',
      unitCode: 'MER-04-B17',
      areaSqFt: 250,
      durationMonths: 3,
      startDate: '2026-09-01T00:00:00Z',
      endDate: '2026-12-01T00:00:00Z',
      monthlyRate: 18,
      totalStorageAmount: 13500, // 250 * 18 * 3
      platformFeePercent: 20,
      platformFee: 2700,
      depositAmount: 4500,
      taxGst: 486, // 18% of platform fee
      totalAmount: 18486,
      ownerGrossEarnings: 13500,
      ownerNetPayout: 10800,
      status: 'Active',
      inventorySummary: 'Consumer Electronics & LED TV accessories',
      termsAccepted: true,
      createdAt: '2026-08-28T10:15:00Z',
      updatedAt: '2026-08-28T10:15:00Z',
    },
  ];

  const inventoryItems: InventoryItem[] = [
    {
      id: 'inv_1',
      businessId: 'usr_business_1',
      storageUnitId: 'unit_mer_b17',
      unitCode: 'MER-04-B17',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      sku: 'SKU-ELC-104',
      productName: 'Smart LED TV 43-inch Master Cartons',
      category: 'Electronics',
      quantity: 85,
      unit: 'Cartons',
      unitValue: 14500,
      totalValue: 1232500,
      dateReceived: '2026-09-02T11:00:00Z',
      notes: 'Fragile. Upright stacking max 3 levels.',
      lowStockThreshold: 15,
      createdAt: '2026-09-02T11:00:00Z',
      updatedAt: '2026-09-02T11:00:00Z',
    },
    {
      id: 'inv_2',
      businessId: 'usr_business_1',
      storageUnitId: 'unit_mer_b17',
      unitCode: 'MER-04-B17',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      sku: 'SKU-ELC-209',
      productName: 'Surge Protector Power Strips (Pack of 5)',
      category: 'Electronics',
      quantity: 320,
      unit: 'Boxes',
      unitValue: 650,
      totalValue: 208000,
      dateReceived: '2026-09-05T14:30:00Z',
      notes: 'High turnover fast-moving accessory',
      lowStockThreshold: 50,
      createdAt: '2026-09-05T14:30:00Z',
      updatedAt: '2026-09-05T14:30:00Z',
    },
    {
      id: 'inv_3',
      businessId: 'usr_business_1',
      storageUnitId: 'unit_mer_b17',
      unitCode: 'MER-04-B17',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      sku: 'SKU-TEX-501',
      productName: 'Branded Microfiber Dust Covers',
      category: 'Packaging',
      quantity: 12,
      unit: 'Bales',
      unitValue: 2200,
      totalValue: 26400,
      dateReceived: '2026-09-10T09:00:00Z',
      notes: 'Low stock warning triggered',
      lowStockThreshold: 20,
      createdAt: '2026-09-10T09:00:00Z',
      updatedAt: '2026-09-10T09:00:00Z',
    },
  ];

  const inventoryMovements: InventoryMovement[] = [
    {
      id: 'mov_1',
      inventoryItemId: 'inv_1',
      businessId: 'usr_business_1',
      sku: 'SKU-ELC-104',
      productName: 'Smart LED TV 43-inch Master Cartons',
      movementType: 'IN',
      quantity: 100,
      previousQuantity: 0,
      newQuantity: 100,
      notes: 'Initial consignment inward from factory in Noida',
      timestamp: '2026-09-02T11:00:00Z',
    },
    {
      id: 'mov_2',
      inventoryItemId: 'inv_1',
      businessId: 'usr_business_1',
      sku: 'SKU-ELC-104',
      productName: 'Smart LED TV 43-inch Master Cartons',
      movementType: 'OUT',
      quantity: 15,
      previousQuantity: 100,
      newQuantity: 85,
      notes: 'Dispatched for festival sales order #SF-ORD-991',
      timestamp: '2026-09-28T16:00:00Z',
    },
  ];

  const payments: Payment[] = [
    {
      id: 'pay_001',
      bookingId: 'bk_2026_001',
      bookingNumber: 'SF-2026-000123',
      businessId: 'usr_business_1',
      businessName: 'Sharma Retail & Electronics',
      amount: 18486,
      currency: 'INR',
      status: 'Paid',
      paymentMethod: 'UPI',
      transactionRef: 'UPI/20260828/998124801/SF',
      isMock: true,
      paidAt: '2026-08-28T10:18:00Z',
      createdAt: '2026-08-28T10:15:00Z',
    },
  ];

  const invoices: Invoice[] = [
    {
      id: 'inv_sf_081',
      invoiceNumber: 'INV-SF-2026-081',
      bookingId: 'bk_2026_001',
      bookingNumber: 'SF-2026-000123',
      businessId: 'usr_business_1',
      businessName: 'Sharma Retail & Electronics',
      businessGstin: '07AAAAA0000A1Z5',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      storageAreaSqFt: 250,
      durationMonths: 3,
      baseStorageAmount: 13500,
      platformFee: 2700,
      depositAmount: 4500,
      taxGst: 486,
      totalAmount: 18486,
      status: 'Paid',
      dueDate: '2026-08-28T00:00:00Z',
      issuedAt: '2026-08-28T10:18:00Z',
    },
  ];

  const payouts: Payout[] = [
    {
      id: 'payout_001',
      payoutNumber: 'PO-2026-0044',
      ownerId: 'usr_owner_1',
      ownerName: 'Vikram Malhotra',
      bookingId: 'bk_2026_001',
      bookingNumber: 'SF-2026-000123',
      propertyName: 'Meerut Central Logistics Hub',
      totalRevenue: 13500,
      commissionDeducted: 2700,
      netPayout: 10800,
      status: 'Pending',
      bankAccountMasked: 'HDFC Bank •••• 9821',
      referenceId: 'REF-PO-PENDING-01',
      createdAt: '2026-08-28T10:20:00Z',
    },
  ];

  const reviews: Review[] = [
    {
      id: 'rev_1',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      bookingId: 'bk_2026_001',
      businessId: 'usr_business_1',
      businessName: 'Sharma Retail & Electronics',
      rating: 5,
      cleanlinessRating: 5,
      securityRating: 5,
      accessibilityRating: 4,
      accuracyRating: 5,
      comment: 'Excellent facility with easy 24/7 access and great security guards. Saved us more than ₹35,000 compared to leasing a whole warehouse!',
      isModerated: true,
      createdAt: '2026-09-15T15:00:00Z',
    },
  ];

  const disputes: Dispute[] = [
    {
      id: 'dsp_001',
      disputeNumber: 'DSP-2026-0019',
      bookingId: 'bk_2026_001',
      bookingNumber: 'SF-2026-000123',
      propertyId: 'prop_meerut_1',
      propertyName: 'Meerut Central Logistics Hub',
      businessId: 'usr_business_1',
      businessName: 'Sharma Retail & Electronics',
      ownerId: 'usr_owner_1',
      ownerName: 'Vikram Malhotra',
      category: 'Access issue',
      title: 'Night Gate Delay after 11 PM',
      description: 'Our dispatch tempo was delayed by 30 minutes at the entry gate due to shift handover.',
      status: 'Resolved',
      resolution: 'Facility manager updated night guard protocol. Pre-alert phone number shared for fast gate pass.',
      messages: [
        {
          id: 'msg_1',
          senderId: 'usr_business_1',
          senderName: 'Rajesh Sharma',
          senderRole: 'business',
          message: 'Tempo driver was kept waiting for 30 mins at Gate 2 yesterday at 11:15 PM.',
          timestamp: '2026-09-16T09:00:00Z',
        },
        {
          id: 'msg_2',
          senderId: 'usr_owner_1',
          senderName: 'Vikram Malhotra',
          senderRole: 'owner',
          message: 'Apologies Rajesh ji. The guard was doing a safety patrol. We have now provided direct supervisor hotline for instant gate opening.',
          timestamp: '2026-09-16T11:30:00Z',
        },
        {
          id: 'msg_3',
          senderId: 'usr_admin_1',
          senderName: 'StoreFlex Admin',
          senderRole: 'admin',
          message: 'Both parties agreed on resolution. Dispute marked resolved.',
          timestamp: '2026-09-16T14:00:00Z',
        },
      ],
      createdAt: '2026-09-16T09:00:00Z',
      updatedAt: '2026-09-16T14:00:00Z',
    },
  ];

  const logisticsOrders: LogisticsOrder[] = [
    {
      id: 'log_001',
      orderNumber: 'LOG-2026-0881',
      businessId: 'usr_business_1',
      businessName: 'Sharma Retail & Electronics',
      businessPhone: '+91 98101 23456',
      bookingId: 'bk_2026_001',
      propertyName: 'Meerut Central Logistics Hub',
      pickupAddress: 'Shop 14, Main Market, Sadar Bazar, Meerut',
      dropAddress: 'Meerut Central Logistics Hub, Unit MER-04-B17',
      inventoryDetails: '35 Cartons of Accessories & Display Stands',
      itemCount: 35,
      vehicleType: 'Tata Ace',
      estimatedDistanceKm: 14,
      estimatedCost: 1201, // 750 + (14 * 26) + (35 * 2.5) = 750 + 364 + 87.5 = 1201.5
      preferredDate: '2026-10-22',
      preferredTimeSlot: '10:00 AM - 1:00 PM',
      status: 'Assigned',
      driverName: 'Suresh Yadav',
      driverPhone: '+91 98912 33445',
      trackingUpdates: [
        { time: '10:00 AM', status: 'Assigned', note: 'Driver Suresh Yadav assigned Tata Ace UP-15-BT-4019' },
      ],
      createdAt: '2026-10-19T10:00:00Z',
    },
  ];

  const notifications: AppNotification[] = [
    {
      id: 'notif_1',
      userId: 'usr_business_1',
      title: 'Booking Active: SF-2026-000123',
      message: 'Your 250 sq ft storage unit MER-04-B17 at Meerut Central Logistics Hub is active.',
      type: 'booking',
      link: '/business/dashboard',
      isRead: false,
      createdAt: '2026-08-28T10:18:00Z',
    },
    {
      id: 'notif_2',
      userId: 'usr_owner_1',
      title: 'New Booking Revenue: ₹10,800 Net',
      message: 'Sharma Retail & Electronics booked 250 sq ft for 3 months at Meerut Central.',
      type: 'payout',
      link: '/owner/earnings',
      isRead: false,
      createdAt: '2026-08-28T10:18:00Z',
    },
    {
      id: 'notif_3',
      userId: 'usr_admin_1',
      title: 'New Property Verification Request',
      message: 'Vikram Malhotra submitted "Modinagar Bypass Flex Shed" (4,500 sq ft) for verification.',
      type: 'verification',
      link: '/admin/properties',
      isRead: false,
      createdAt: '2026-10-18T14:30:00Z',
    },
  ];

  const agreements: DigitalAgreement[] = [
    {
      id: 'agr_001',
      agreementNumber: 'AGR-SF-2026-000123',
      bookingId: 'bk_2026_001',
      bookingNumber: 'SF-2026-000123',
      businessName: 'Sharma Retail & Electronics',
      businessGstin: '07AAAAA0000A1Z5',
      ownerName: 'Vikram Malhotra (Malhotra Logistics & Warehousing)',
      propertyName: 'Meerut Central Logistics Hub',
      propertyAddress: 'Plot 42, Partapur Industrial Area, Delhi Road, Meerut, UP - 250103',
      areaSqFt: 250,
      unitCode: 'MER-04-B17',
      monthlyRent: 4500,
      deposit: 4500,
      startDate: '2026-09-01',
      endDate: '2026-12-01',
      rules: [
        'Storage premises shall be strictly utilized for permitted non-hazardous goods.',
        'Lessee agrees to abide by standard security checks, gate entry logs, and fire protocols.',
        'Sub-leasing or hazardous substance storage is strictly prohibited.',
        'Mutual 15-day notice required for extension or premature cancellation.',
      ],
      cancellationPolicy: 'Refundable security deposit returned within 48 hours of unit clearance and mutual inspection.',
      termsAcceptedAt: '2026-08-28T10:15:00Z',
    },
  ];

  const commissionSetting: CommissionSetting = {
    id: 'comm_default',
    platformCommissionPercent: 20,
    minPlatformFee: 500,
    logisticsCommissionPercent: 10,
    taxGstPercent: 18,
    updatedAt: '2026-08-01T00:00:00Z',
  };

  return {
    users,
    properties,
    storageUnits,
    bookings,
    inventoryItems,
    inventoryMovements,
    payments,
    invoices,
    payouts,
    reviews,
    disputes,
    logisticsOrders,
    notifications,
    agreements,
    commissionSetting,
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read database file, seeding fresh data:', e);
    }
    const initial = getInitialSeedData();
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave: DatabaseSchema = this.data) {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public getDb(): DatabaseSchema {
    return this.data;
  }

  public resetToDefaultSeed(): DatabaseSchema {
    this.data = getInitialSeedData();
    this.saveData(this.data);
    return this.data;
  }

  // --- User Operations ---
  public getUsers() { return this.data.users; }
  public getUserById(id: string) { return this.data.users.find(u => u.id === id); }
  public getUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }
  public createUser(user: User): User {
    this.data.users.push(user);
    this.saveData();
    return user;
  }
  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveData();
    return this.data.users[idx];
  }

  // --- Property Operations ---
  public getProperties(onlyVerified = false): Property[] {
    if (onlyVerified) {
      return this.data.properties.filter(p => p.verificationStatus === 'verified');
    }
    return this.data.properties;
  }
  public getPropertyById(id: string): Property | undefined {
    return this.data.properties.find(p => p.id === id);
  }
  public createProperty(property: Property): Property {
    this.data.properties.unshift(property);
    // Create an associated storage unit code automatically
    const unitCode = `${property.city.slice(0, 3).toUpperCase()}-0${Math.floor(Math.random() * 8) + 1}-A01`;
    const unit: StorageUnit = {
      id: `unit_${Date.now()}`,
      propertyId: property.id,
      propertyName: property.name,
      unitCode,
      floor: property.floor,
      areaSqFt: property.totalArea,
      status: 'available',
      heightFt: property.ceilingHeight,
    };
    this.data.storageUnits.push(unit);
    // Notify admin
    this.addNotification({
      id: `notif_${Date.now()}`,
      userId: 'usr_admin_1',
      title: 'New Property Submitted for Verification',
      message: `${property.ownerName} submitted "${property.name}" in ${property.city}.`,
      type: 'verification',
      link: '/admin/properties',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    this.saveData();
    return property;
  }
  public updateProperty(id: string, updates: Partial<Property>): Property | null {
    const idx = this.data.properties.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.properties[idx] = { ...this.data.properties[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveData();
    return this.data.properties[idx];
  }

  // --- Booking & Capacity Operations ---
  public getBookings() { return this.data.bookings; }
  public getBookingById(id: string) { return this.data.bookings.find(b => b.id === id); }
  
  public createBooking(bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>): Booking {
    const property = this.getPropertyById(bookingData.propertyId);
    if (!property) throw new Error('Property not found');
    if (property.verificationStatus !== 'verified') {
      throw new Error('Only verified properties can be booked');
    }
    if (property.availableArea < bookingData.areaSqFt) {
      throw new Error(`Insufficient available capacity. Only ${property.availableArea} sq ft available.`);
    }

    const bookingId = `bk_${Date.now()}`;
    const bookingNumber = `SF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();

    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      bookingNumber,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Deduct available capacity from property
    property.availableArea -= bookingData.areaSqFt;
    property.updatedAt = nowIso;

    this.data.bookings.unshift(newBooking);

    // Create Payment Record (Mock Payment Mode as requested in #17 and #54)
    const paymentId = `pay_${Date.now()}`;
    const payment: Payment = {
      id: paymentId,
      bookingId,
      bookingNumber,
      businessId: newBooking.businessId,
      businessName: newBooking.businessName,
      amount: newBooking.totalAmount,
      currency: 'INR',
      status: 'Paid',
      paymentMethod: 'UPI',
      transactionRef: `UPI/${Date.now()}/STOREFLEX`,
      isMock: true,
      paidAt: nowIso,
      createdAt: nowIso,
    };
    this.data.payments.unshift(payment);

    // Create Invoice Record
    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-SF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      bookingId,
      bookingNumber,
      businessId: newBooking.businessId,
      businessName: newBooking.businessName,
      propertyId: newBooking.propertyId,
      propertyName: newBooking.propertyName,
      storageAreaSqFt: newBooking.areaSqFt,
      durationMonths: newBooking.durationMonths,
      baseStorageAmount: newBooking.totalStorageAmount,
      platformFee: newBooking.platformFee,
      depositAmount: newBooking.depositAmount,
      taxGst: newBooking.taxGst,
      totalAmount: newBooking.totalAmount,
      status: 'Paid',
      dueDate: nowIso,
      issuedAt: nowIso,
    };
    this.data.invoices.unshift(invoice);

    // Create Payout Record for Space Owner
    const payout: Payout = {
      id: `po_${Date.now()}`,
      payoutNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ownerId: newBooking.ownerId,
      ownerName: newBooking.ownerName,
      bookingId,
      bookingNumber,
      propertyName: newBooking.propertyName,
      totalRevenue: newBooking.totalStorageAmount,
      commissionDeducted: newBooking.platformFee,
      netPayout: newBooking.ownerNetPayout,
      status: 'Pending',
      bankAccountMasked: 'HDFC Bank •••• 9821',
      referenceId: `REF-${bookingNumber}`,
      createdAt: nowIso,
    };
    this.data.payouts.unshift(payout);

    // Create Digital Agreement Record (#14)
    const agreement: DigitalAgreement = {
      id: `agr_${Date.now()}`,
      agreementNumber: `AGR-${bookingNumber}`,
      bookingId,
      bookingNumber,
      businessName: newBooking.businessName,
      businessGstin: '07AAAAA0000A1Z5',
      ownerName: newBooking.ownerName,
      propertyName: newBooking.propertyName,
      propertyAddress: newBooking.propertyAddress,
      areaSqFt: newBooking.areaSqFt,
      unitCode: newBooking.unitCode || `${property.city.slice(0, 3).toUpperCase()}-01`,
      monthlyRent: Math.round(newBooking.totalStorageAmount / newBooking.durationMonths),
      deposit: newBooking.depositAmount,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      rules: [
        'Storage space shall be used exclusively for declared commercial merchandise.',
        'Access permitted during designated property access hours.',
        'Hazardous, toxic, flammable or contraband items strictly barred.',
        'Lessee responsible for insurance of personal cargo.',
      ],
      cancellationPolicy: 'Refundable security deposit settled within 48h following unit checkout inspection.',
      termsAcceptedAt: nowIso,
    };
    this.data.agreements.unshift(agreement);

    // Add Notifications
    this.addNotification({
      id: `notif_${Date.now()}_b`,
      userId: newBooking.businessId,
      title: `Booking Confirmed: ${bookingNumber}`,
      message: `Your booking for ${newBooking.areaSqFt} sq ft at ${newBooking.propertyName} is confirmed.`,
      type: 'booking',
      link: '/business/dashboard',
      isRead: false,
      createdAt: nowIso,
    });

    this.addNotification({
      id: `notif_${Date.now()}_o`,
      userId: newBooking.ownerId,
      title: `New Booking: ${bookingNumber}`,
      message: `${newBooking.businessName} booked ${newBooking.areaSqFt} sq ft for ${newBooking.durationMonths} months.`,
      type: 'booking',
      link: '/owner/bookings',
      isRead: false,
      createdAt: nowIso,
    });

    this.saveData();
    return newBooking;
  }

  public cancelBooking(bookingId: string, reason = 'Cancelled by user'): Booking | null {
    const booking = this.getBookingById(bookingId);
    if (!booking) return null;
    if (booking.status === 'Cancelled') return booking;

    const property = this.getPropertyById(booking.propertyId);
    if (property) {
      // Release capacity back to property (#44 rule: Expired bookings release capacity)
      property.availableArea = Math.min(property.totalArea, property.availableArea + booking.areaSqFt);
      property.updatedAt = new Date().toISOString();
    }

    booking.status = 'Cancelled';
    booking.updatedAt = new Date().toISOString();

    this.addNotification({
      id: `notif_${Date.now()}`,
      userId: booking.businessId,
      title: `Booking Cancelled: ${booking.bookingNumber}`,
      message: `Your booking was cancelled. Released ${booking.areaSqFt} sq ft.`,
      type: 'booking',
      link: '/business/dashboard',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveData();
    return booking;
  }

  // --- Inventory Operations ---
  public getInventory(businessId?: string): InventoryItem[] {
    if (businessId) {
      return this.data.inventoryItems.filter(i => i.businessId === businessId);
    }
    return this.data.inventoryItems;
  }
  public addInventoryItem(item: InventoryItem): InventoryItem {
    this.data.inventoryItems.unshift(item);
    // Record automatic IN movement
    const movement: InventoryMovement = {
      id: `mov_${Date.now()}`,
      inventoryItemId: item.id,
      businessId: item.businessId,
      sku: item.sku,
      productName: item.productName,
      movementType: 'IN',
      quantity: item.quantity,
      previousQuantity: 0,
      newQuantity: item.quantity,
      notes: item.notes || 'Initial inventory inward receipt',
      timestamp: new Date().toISOString(),
    };
    this.data.inventoryMovements.unshift(movement);
    this.saveData();
    return item;
  }
  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const idx = this.data.inventoryItems.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.data.inventoryItems[idx] = { ...this.data.inventoryItems[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveData();
    return this.data.inventoryItems[idx];
  }
  public deleteInventoryItem(id: string): boolean {
    const idx = this.data.inventoryItems.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.data.inventoryItems.splice(idx, 1);
    this.saveData();
    return true;
  }
  public recordInventoryMovement(movement: InventoryMovement): InventoryMovement {
    this.data.inventoryMovements.unshift(movement);
    const item = this.data.inventoryItems.find(i => i.id === movement.inventoryItemId);
    if (item) {
      item.quantity = movement.newQuantity;
      item.totalValue = item.quantity * item.unitValue;
      item.updatedAt = new Date().toISOString();
    }
    this.saveData();
    return movement;
  }
  public getInventoryMovements(businessId?: string): InventoryMovement[] {
    if (businessId) {
      return this.data.inventoryMovements.filter(m => m.businessId === businessId);
    }
    return this.data.inventoryMovements;
  }

  // --- Logistics Operations ---
  public getLogisticsOrders(businessId?: string): LogisticsOrder[] {
    if (businessId) {
      return this.data.logisticsOrders.filter(l => l.businessId === businessId);
    }
    return this.data.logisticsOrders;
  }
  public createLogisticsOrder(order: LogisticsOrder): LogisticsOrder {
    this.data.logisticsOrders.unshift(order);
    this.addNotification({
      id: `notif_${Date.now()}`,
      userId: 'usr_admin_1',
      title: 'New Logistics Request',
      message: `${order.businessName} requested ${order.vehicleType} pickup for ${order.itemCount} items.`,
      type: 'logistics',
      link: '/admin/logistics',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    this.saveData();
    return order;
  }
  public updateLogisticsOrder(id: string, updates: Partial<LogisticsOrder>): LogisticsOrder | null {
    const idx = this.data.logisticsOrders.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.data.logisticsOrders[idx] = { ...this.data.logisticsOrders[idx], ...updates };
    this.saveData();
    return this.data.logisticsOrders[idx];
  }

  // --- Dispute Operations ---
  public getDisputes(userId?: string): Dispute[] {
    if (userId) {
      return this.data.disputes.filter(d => d.businessId === userId || d.ownerId === userId);
    }
    return this.data.disputes;
  }
  public createDispute(dispute: Dispute): Dispute {
    this.data.disputes.unshift(dispute);
    this.addNotification({
      id: `notif_${Date.now()}`,
      userId: 'usr_admin_1',
      title: `Dispute Raised: ${dispute.disputeNumber}`,
      message: `${dispute.businessName} raised ${dispute.category} dispute for ${dispute.propertyName}.`,
      type: 'dispute',
      link: '/admin/disputes',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    this.saveData();
    return dispute;
  }
  public updateDispute(id: string, updates: Partial<Dispute>): Dispute | null {
    const idx = this.data.disputes.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.disputes[idx] = { ...this.data.disputes[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveData();
    return this.data.disputes[idx];
  }

  // --- Reviews Operations ---
  public getReviews(propertyId?: string): Review[] {
    if (propertyId) {
      return this.data.reviews.filter(r => r.propertyId === propertyId);
    }
    return this.data.reviews;
  }
  public addReview(review: Review): Review {
    this.data.reviews.unshift(review);
    const property = this.getPropertyById(review.propertyId);
    if (property) {
      const propReviews = this.data.reviews.filter(r => r.propertyId === review.propertyId);
      const avgRating = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
      property.rating = Math.round(avgRating * 10) / 10;
      property.reviewCount = propReviews.length;
    }
    this.saveData();
    return review;
  }

  // --- Commission Operations ---
  public getCommissionSetting(): CommissionSetting {
    return this.data.commissionSetting;
  }
  public updateCommissionSetting(updates: Partial<CommissionSetting>): CommissionSetting {
    this.data.commissionSetting = {
      ...this.data.commissionSetting,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.commissionSetting;
  }

  // --- Notifications Operations ---
  public getNotifications(userId?: string): AppNotification[] {
    if (userId) {
      return this.data.notifications.filter(n => n.userId === userId);
    }
    return this.data.notifications;
  }
  public addNotification(notif: AppNotification) {
    this.data.notifications.unshift(notif);
    this.saveData();
    return notif;
  }
  public createNotification(data: { userId: string; title: string; message: string; type: any; link?: string }): AppNotification {
    const notif: AppNotification = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.addNotification(notif);
    return notif;
  }
  public markNotificationAsRead(id: string) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveData();
    }
  }

  // --- Financials Operations ---
  public getPayments(businessId?: string): Payment[] {
    if (businessId) {
      return this.data.payments.filter(p => p.businessId === businessId);
    }
    return this.data.payments;
  }
  public getInvoices(businessId?: string): Invoice[] {
    if (businessId) {
      return this.data.invoices.filter(i => i.businessId === businessId);
    }
    return this.data.invoices;
  }
  public getPayouts(ownerId?: string): Payout[] {
    if (ownerId) {
      return this.data.payouts.filter(p => p.ownerId === ownerId);
    }
    return this.data.payouts;
  }
  public getAgreements(bookingId?: string): DigitalAgreement[] {
    if (bookingId) {
      return this.data.agreements.filter(a => a.bookingId === bookingId);
    }
    return this.data.agreements;
  }
}

export const db = new DatabaseManager();
