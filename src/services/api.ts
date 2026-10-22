import {
  User,
  Property,
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
  CommissionSetting,
} from '../types';

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: async (email: string, password?: string): Promise<{ success: boolean; user: User }> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  register: async (data: {
    name: string;
    email: string;
    phone: string;
    role: string;
    password?: string;
    companyName?: string;
  }): Promise<{ success: boolean; user: User }> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  quickSwitchUser: async (role: 'business' | 'owner' | 'admin'): Promise<{ success: boolean; user: User }> => {
    const res = await fetch(`${BASE_URL}/auth/quick-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return handleResponse(res);
  },

  // Properties
  getProperties: async (params?: {
    city?: string;
    category?: string;
    minArea?: number;
    maxPrice?: number;
    onlyVerified?: boolean;
  }): Promise<{ success: boolean; properties: Property[]; count: number }> => {
    const query = new URLSearchParams();
    if (params?.city) query.set('city', params.city);
    if (params?.category) query.set('category', params.category);
    if (params?.minArea) query.set('minArea', params.minArea.toString());
    if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
    if (params?.onlyVerified !== undefined) query.set('onlyVerified', params.onlyVerified.toString());

    const res = await fetch(`${BASE_URL}/properties?${query.toString()}`);
    return handleResponse(res);
  },

  getPropertyById: async (id: string): Promise<{
    success: boolean;
    property: Property;
    reviews: Review[];
    storageUnits: any[];
  }> => {
    const res = await fetch(`${BASE_URL}/properties/${id}`);
    return handleResponse(res);
  },

  createProperty: async (propertyData: Partial<Property>): Promise<{ success: boolean; property: Property }> => {
    const res = await fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData),
    });
    return handleResponse(res);
  },

  verifyProperty: async (
    id: string,
    status: 'verified' | 'rejected' | 'suspended',
    notes?: string,
    rejectionReason?: string
  ): Promise<{ success: boolean; property: Property }> => {
    const res = await fetch(`${BASE_URL}/properties/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes, rejectionReason }),
    });
    return handleResponse(res);
  },

  // Bookings
  getBookings: async (params?: {
    businessId?: string;
    ownerId?: string;
  }): Promise<{ success: boolean; bookings: Booking[] }> => {
    const query = new URLSearchParams();
    if (params?.businessId) query.set('businessId', params.businessId);
    if (params?.ownerId) query.set('ownerId', params.ownerId);

    const res = await fetch(`${BASE_URL}/bookings?${query.toString()}`);
    return handleResponse(res);
  },

  getBookingById: async (id: string): Promise<{
    success: boolean;
    booking: Booking;
    agreement?: any;
    invoice?: Invoice;
    payment?: Payment;
  }> => {
    const res = await fetch(`${BASE_URL}/bookings/${id}`);
    return handleResponse(res);
  },

  createBooking: async (bookingData: any): Promise<{ success: boolean; booking: Booking }> => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(res);
  },

  cancelBooking: async (id: string): Promise<{ success: boolean; booking: Booking }> => {
    const res = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  // Inventory
  getInventory: async (businessId?: string): Promise<{ success: boolean; items: InventoryItem[] }> => {
    const query = businessId ? `?businessId=${businessId}` : '';
    const res = await fetch(`${BASE_URL}/inventory${query}`);
    return handleResponse(res);
  },

  addInventoryItem: async (item: Partial<InventoryItem>): Promise<{ success: boolean; item: InventoryItem }> => {
    const res = await fetch(`${BASE_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return handleResponse(res);
  },

  updateInventoryItem: async (id: string, updates: Partial<InventoryItem>): Promise<{ success: boolean; item: InventoryItem }> => {
    const res = await fetch(`${BASE_URL}/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  deleteInventoryItem: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE_URL}/inventory/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  recordInventoryMovement: async (data: {
    inventoryItemId: string;
    businessId: string;
    movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    notes?: string;
  }): Promise<{ success: boolean; movement: InventoryMovement; updatedItem: InventoryItem }> => {
    const res = await fetch(`${BASE_URL}/inventory/movement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  getInventoryMovements: async (businessId?: string): Promise<{ success: boolean; movements: InventoryMovement[] }> => {
    const query = businessId ? `?businessId=${businessId}` : '';
    const res = await fetch(`${BASE_URL}/inventory/movements${query}`);
    return handleResponse(res);
  },

  // Logistics
  getLogistics: async (businessId?: string): Promise<{ success: boolean; orders: LogisticsOrder[] }> => {
    const query = businessId ? `?businessId=${businessId}` : '';
    const res = await fetch(`${BASE_URL}/logistics${query}`);
    return handleResponse(res);
  },

  getLogisticsQuote: async (data: { vehicleType: string; distanceKm: number; itemCount: number }) => {
    const res = await fetch(`${BASE_URL}/logistics/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  createLogisticsOrder: async (data: Partial<LogisticsOrder>): Promise<{ success: boolean; order: LogisticsOrder }> => {
    const res = await fetch(`${BASE_URL}/logistics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateLogisticsOrder: async (id: string, updates: Partial<LogisticsOrder>): Promise<{ success: boolean; order: LogisticsOrder }> => {
    const res = await fetch(`${BASE_URL}/logistics/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  // Disputes
  getDisputes: async (userId?: string): Promise<{ success: boolean; disputes: Dispute[] }> => {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${BASE_URL}/disputes${query}`);
    return handleResponse(res);
  },

  createDispute: async (data: Partial<Dispute>): Promise<{ success: boolean; dispute: Dispute }> => {
    const res = await fetch(`${BASE_URL}/disputes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  addDisputeMessage: async (id: string, data: { senderId: string; senderName: string; senderRole: string; message: string }) => {
    const res = await fetch(`${BASE_URL}/disputes/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  resolveDispute: async (id: string, resolution: string, status = 'Resolved') => {
    const res = await fetch(`${BASE_URL}/disputes/${id}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution, status }),
    });
    return handleResponse(res);
  },

  // Reviews
  getReviews: async (propertyId?: string): Promise<{ success: boolean; reviews: Review[] }> => {
    const query = propertyId ? `?propertyId=${propertyId}` : '';
    const res = await fetch(`${BASE_URL}/reviews${query}`);
    return handleResponse(res);
  },

  addReview: async (reviewData: Partial<Review>): Promise<{ success: boolean; review: Review }> => {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    return handleResponse(res);
  },

  // Commission & Financials
  getCommissionSetting: async (): Promise<{ success: boolean; commission: CommissionSetting }> => {
    const res = await fetch(`${BASE_URL}/commission`);
    return handleResponse(res);
  },

  updateCommissionSetting: async (data: Partial<CommissionSetting>): Promise<{ success: boolean; commission: CommissionSetting }> => {
    const res = await fetch(`${BASE_URL}/commission`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  getPayments: async (businessId?: string): Promise<{ success: boolean; payments: Payment[] }> => {
    const query = businessId ? `?businessId=${businessId}` : '';
    const res = await fetch(`${BASE_URL}/payments${query}`);
    return handleResponse(res);
  },

  getInvoices: async (businessId?: string): Promise<{ success: boolean; invoices: Invoice[] }> => {
    const query = businessId ? `?businessId=${businessId}` : '';
    const res = await fetch(`${BASE_URL}/invoices${query}`);
    return handleResponse(res);
  },

  getPayouts: async (ownerId?: string): Promise<{ success: boolean; payouts: Payout[] }> => {
    const query = ownerId ? `?ownerId=${ownerId}` : '';
    const res = await fetch(`${BASE_URL}/payouts${query}`);
    return handleResponse(res);
  },

  // Notifications
  getNotifications: async (userId?: string): Promise<{ success: boolean; notifications: AppNotification[] }> => {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${BASE_URL}/notifications${query}`);
    return handleResponse(res);
  },

  markNotificationRead: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return handleResponse(res);
  },

  // Admin
  getAdminStats: async (): Promise<{ success: boolean; stats: any }> => {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return handleResponse(res);
  },

  getAdminUsers: async (): Promise<{ success: boolean; users: User[] }> => {
    const res = await fetch(`${BASE_URL}/admin/users`);
    return handleResponse(res);
  },

  updateUserKyc: async (id: string, kycStatus: string): Promise<{ success: boolean; user: User }> => {
    const res = await fetch(`${BASE_URL}/admin/users/${id}/kyc`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kycStatus }),
    });
    return handleResponse(res);
  },

  resetDemoSeed: async (): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${BASE_URL}/admin/reset-seed`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  // System & Mock Services (Zero-Configuration MVP Mode)
  getSystemConfig: async (): Promise<{
    success: boolean;
    isDemoMode: boolean;
    services: Record<string, { configured: boolean; mode: string; status: string; description: string }>;
  }> => {
    const res = await fetch(`${BASE_URL}/system/config`);
    return handleResponse(res);
  },

  uploadFile: async (payload: {
    fileName: string;
    fileType?: string;
    fileSize?: number;
    category?: string;
  }): Promise<{
    success: boolean;
    fileId: string;
    fileName: string;
    fileUrl: string;
    storageProvider: string;
    message: string;
  }> => {
    const res = await fetch(`${BASE_URL}/storage/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  sendNotificationEmail: async (payload: {
    recipientEmail: string;
    recipientId?: string;
    subject: string;
    body?: string;
    templateType?: string;
    link?: string;
  }): Promise<{
    success: boolean;
    sentVia: string;
    message: string;
    notificationId: string;
  }> => {
    const res = await fetch(`${BASE_URL}/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  getMapsConfig: async (): Promise<{
    success: boolean;
    isMock: boolean;
    provider: string;
    defaultCenter: { lat: number; lng: number; zoom: number };
    clusters: Array<{
      id: string;
      name: string;
      city: string;
      state: string;
      lat: number;
      lng: number;
      warehouseCount: number;
      avgRatePerSqFt: number;
    }>;
  }> => {
    const res = await fetch(`${BASE_URL}/maps/config`);
    return handleResponse(res);
  },

  getAiRecommendation: async (payload: {
    city?: string;
    category?: string;
    requiredAreaSqFt?: number;
    budgetPerSqFt?: number;
  }): Promise<{
    success: boolean;
    engine: string;
    summary: string;
    topRecommendation: any;
    insights: string[];
  }> => {
    const res = await fetch(`${BASE_URL}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  processMockPayment: async (payload: {
    bookingId?: string;
    amount: number;
    paymentMethod?: string;
  }): Promise<{
    success: boolean;
    transactionId: string;
    amount: number;
    status: string;
    paymentMethod: string;
    timestamp: string;
    receiptUrl: string;
    message: string;
  }> => {
    const res = await fetch(`${BASE_URL}/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};

