export type UserRole = 'business' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  companyName?: string;
  createdAt: string;
}

export interface BusinessProfile {
  userId: string;
  companyName: string;
  gstin?: string;
  city: string;
  industry: string;
  address?: string;
}

export interface OwnerProfile {
  userId: string;
  companyName: string;
  bankAccountNumber?: string;
  ifsc?: string;
  upiId?: string;
  verified: boolean;
}

export type PropertyType = 'Warehouse' | 'Godown' | 'Basement Commercial' | 'Industrial Shed' | 'Cold Storage' | 'Fulfillment Center';
export type StorageType = 'Ambient' | 'Climate Controlled' | 'Heavy Duty' | 'Open Yard' | 'High Ceiling';
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  name: string;
  propertyType: PropertyType;
  address: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  totalArea: number;
  availableArea: number;
  ceilingHeight: number; // in ft
  floor: string; // Ground floor, 1st floor, etc.
  storageType: StorageType;
  accessHours: string; // e.g. "8:00 AM - 9:00 PM" or "24/7 Access"
  pricePerSqFt: number; // INR per sq ft / month
  minDurationMonths: number;
  depositMonths: number;
  allowedCategories: string[];
  facilities: string[];
  images: string[];
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  rejectionReason?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StorageUnit {
  id: string;
  propertyId: string;
  propertyName: string;
  unitCode: string; // e.g. "MER-04-B17"
  floor: string;
  areaSqFt: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  heightFt: number;
  currentBookingId?: string;
}

export type BookingStatus =
  | 'Pending'
  | 'Payment Pending'
  | 'Confirmed'
  | 'Active'
  | 'Expiring Soon'
  | 'Expired'
  | 'Cancelled'
  | 'Disputed';

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. "SF-2026-000123"
  businessId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  ownerId: string;
  ownerName: string;
  storageUnitId: string;
  unitCode: string;
  areaSqFt: number;
  durationMonths: number;
  startDate: string;
  endDate: string;
  monthlyRate: number;
  totalStorageAmount: number;
  platformFeePercent: number;
  platformFee: number;
  depositAmount: number;
  taxGst: number;
  totalAmount: number;
  ownerGrossEarnings: number;
  ownerNetPayout: number;
  status: BookingStatus;
  inventorySummary: string;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';

export interface InventoryItem {
  id: string;
  businessId: string;
  storageUnitId: string;
  unitCode: string;
  propertyId: string;
  propertyName: string;
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string; // 'Cartons', 'Boxes', 'Pallets', 'Units', 'Bags'
  unitValue: number;
  totalValue: number;
  dateReceived: string;
  notes?: string;
  lowStockThreshold?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  inventoryItemId: string;
  businessId: string;
  sku: string;
  productName: string;
  movementType: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  notes: string;
  timestamp: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  bookingNumber: string;
  businessId: string;
  businessName: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod: 'UPI' | 'NetBanking' | 'Debit Card' | 'NEFT/RTGS' | 'Mock Gateway';
  transactionRef: string;
  isMock: boolean;
  paidAt?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-SF-2026-081"
  bookingId: string;
  bookingNumber: string;
  businessId: string;
  businessName: string;
  businessGstin?: string;
  propertyId: string;
  propertyName: string;
  storageAreaSqFt: number;
  durationMonths: number;
  baseStorageAmount: number;
  platformFee: number;
  depositAmount: number;
  taxGst: number;
  totalAmount: number;
  status: 'Paid' | 'Pending';
  dueDate: string;
  issuedAt: string;
}

export interface Payout {
  id: string;
  payoutNumber: string;
  ownerId: string;
  ownerName: string;
  bookingId: string;
  bookingNumber: string;
  propertyName: string;
  totalRevenue: number;
  commissionDeducted: number;
  netPayout: number;
  status: 'Pending' | 'Processed' | 'In Escrow';
  bankAccountMasked?: string;
  referenceId: string;
  processedAt?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  propertyName: string;
  bookingId: string;
  businessId: string;
  businessName: string;
  rating: number; // 1-5
  cleanlinessRating: number;
  securityRating: number;
  accessibilityRating: number;
  accuracyRating: number;
  comment: string;
  isModerated: boolean;
  createdAt: string;
}

export type DisputeCategory =
  | 'Damage'
  | 'Missing inventory'
  | 'Access issue'
  | 'Payment issue'
  | 'Property issue'
  | 'Other';

export interface DisputeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
}

export interface Dispute {
  id: string;
  disputeNumber: string; // e.g. "DSP-2026-0042"
  bookingId: string;
  bookingNumber: string;
  propertyId: string;
  propertyName: string;
  businessId: string;
  businessName: string;
  ownerId: string;
  ownerName: string;
  category: DisputeCategory;
  title: string;
  description: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected';
  resolution?: string;
  messages: DisputeMessage[];
  createdAt: string;
  updatedAt: string;
}

export type LogisticsVehicleType = 'E-Loader' | 'Tata Ace' | 'Bolero Maxi Truck' | '14ft Canter';
export type LogisticsStatus = 'Requested' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

export interface LogisticsOrder {
  id: string;
  orderNumber: string; // e.g. "LOG-2026-789"
  businessId: string;
  businessName: string;
  businessPhone: string;
  bookingId?: string;
  propertyName?: string;
  pickupAddress: string;
  dropAddress: string;
  inventoryDetails: string;
  itemCount: number;
  vehicleType: LogisticsVehicleType;
  estimatedDistanceKm: number;
  estimatedCost: number;
  preferredDate: string;
  preferredTimeSlot: string;
  status: LogisticsStatus;
  driverName?: string;
  driverPhone?: string;
  trackingUpdates?: { time: string; status: string; note: string }[];
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'inventory' | 'verification' | 'dispute' | 'payout' | 'logistics' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DigitalAgreement {
  id: string;
  agreementNumber: string; // e.g. "AGR-SF-2026-012"
  bookingId: string;
  bookingNumber: string;
  businessName: string;
  businessGstin: string;
  ownerName: string;
  propertyName: string;
  propertyAddress: string;
  areaSqFt: number;
  unitCode: string;
  monthlyRent: number;
  deposit: number;
  startDate: string;
  endDate: string;
  rules: string[];
  cancellationPolicy: string;
  termsAcceptedAt: string;
}

export interface CommissionSetting {
  id: string;
  platformCommissionPercent: number; // default 20%
  minPlatformFee: number;            // default 500 INR
  logisticsCommissionPercent: number;// default 10%
  taxGstPercent: number;             // default 18%
  updatedAt: string;
}
