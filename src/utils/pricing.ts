/**
 * Pure pricing and commission calculation logic for StoreFlex
 */

export interface PricingBreakdown {
  areaSqFt: number;
  ratePerSqFtPerMonth: number;
  durationMonths: number;
  baseStorageCost: number;
  platformFeePercent: number;
  platformFee: number;
  depositAmount: number;
  subtotal: number;
  taxGst: number;
  totalCustomerPayable: number;
  ownerGrossEarnings: number;
  ownerNetPayout: number;
}

export function calculateBookingPrice(params: {
  areaSqFt: number;
  ratePerSqFtPerMonth: number;
  durationMonths: number;
  platformFeePercent?: number; // e.g. 20%
  minPlatformFee?: number;     // e.g. 500 INR
  depositMonths?: number;      // e.g. 1 month deposit
  taxRatePercent?: number;     // e.g. 18% GST on platform fee
}): PricingBreakdown {
  const {
    areaSqFt,
    ratePerSqFtPerMonth,
    durationMonths,
    platformFeePercent = 20,
    minPlatformFee = 500,
    depositMonths = 1,
    taxRatePercent = 18,
  } = params;

  if (areaSqFt <= 0) throw new Error('Area must be greater than 0');
  if (durationMonths <= 0) throw new Error('Duration must be greater than 0');
  if (ratePerSqFtPerMonth <= 0) throw new Error('Rate must be greater than 0');

  // Base storage rent: area * monthly rate * duration
  const baseStorageCost = Math.round(areaSqFt * ratePerSqFtPerMonth * durationMonths);

  // Platform commission
  const calculatedFee = Math.round((baseStorageCost * platformFeePercent) / 100);
  const platformFee = Math.max(calculatedFee, minPlatformFee);

  // Refundable security deposit (usually 1 month base rent)
  const depositAmount = Math.round(areaSqFt * ratePerSqFtPerMonth * depositMonths);

  // GST on platform fee only (standard Indian marketplace compliance)
  const taxGst = Math.round((platformFee * taxRatePercent) / 100);

  const subtotal = baseStorageCost + depositAmount;
  const totalCustomerPayable = subtotal + taxGst;

  // Space owner receives base rent minus platform fee
  const ownerGrossEarnings = baseStorageCost;
  const ownerNetPayout = Math.max(0, baseStorageCost - platformFee);

  return {
    areaSqFt,
    ratePerSqFtPerMonth,
    durationMonths,
    baseStorageCost,
    platformFeePercent,
    platformFee,
    depositAmount,
    subtotal,
    taxGst,
    totalCustomerPayable,
    ownerGrossEarnings,
    ownerNetPayout,
  };
}

/**
 * Logistics pricing calculation
 * Formula: Base vehicle cost + per KM rate + handling fee based on volume
 */
export interface LogisticsQuote {
  vehicleType: 'E-Loader' | 'Tata Ace' | 'Bolero Maxi Truck' | '14ft Canter';
  distanceKm: number;
  itemCount: number;
  baseFare: number;
  distanceFare: number;
  handlingFee: number;
  totalFare: number;
  estimatedHours: number;
}

export function calculateLogisticsQuote(
  vehicleType: 'E-Loader' | 'Tata Ace' | 'Bolero Maxi Truck' | '14ft Canter',
  distanceKm: number,
  itemCount: number
): LogisticsQuote {
  const vehicleConfig = {
    'E-Loader': { base: 450, perKm: 18, capacityCartons: 100, speedKmH: 25 },
    'Tata Ace': { base: 750, perKm: 26, capacityCartons: 250, speedKmH: 30 },
    'Bolero Maxi Truck': { base: 1200, perKm: 34, capacityCartons: 500, speedKmH: 35 },
    '14ft Canter': { base: 2200, perKm: 48, capacityCartons: 1200, speedKmH: 30 },
  };

  const cfg = vehicleConfig[vehicleType] || vehicleConfig['Tata Ace'];
  const baseFare = cfg.base;
  const distanceFare = Math.round(Math.max(1, distanceKm) * cfg.perKm);
  const handlingFee = Math.round(Math.max(1, itemCount) * 2.5); // ₹2.5 per item handling
  const totalFare = baseFare + distanceFare + handlingFee;
  const estimatedHours = Math.max(1, Math.round((distanceKm / cfg.speedKmH) * 10) / 10 + 0.5);

  return {
    vehicleType,
    distanceKm,
    itemCount,
    baseFare,
    distanceFare,
    handlingFee,
    totalFare,
    estimatedHours,
  };
}
