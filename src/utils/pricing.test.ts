import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBookingPrice, calculateLogisticsQuote } from './pricing.ts';

test('calculateBookingPrice: 200 sq ft for 3 months at ₹18/sqft', () => {
  const result = calculateBookingPrice({
    areaSqFt: 200,
    ratePerSqFtPerMonth: 18,
    durationMonths: 3,
    platformFeePercent: 20,
    minPlatformFee: 500,
    depositMonths: 1,
  });

  // Base storage: 200 * 18 * 3 = 10800
  assert.equal(result.baseStorageCost, 10800);
  // Platform fee: 20% of 10800 = 2160
  assert.equal(result.platformFee, 2160);
  // Deposit: 1 month = 200 * 18 = 3600
  assert.equal(result.depositAmount, 3600);
  // Owner net payout = 10800 - 2160 = 8640
  assert.equal(result.ownerNetPayout, 8640);
  // Total payable must be greater than base storage
  assert.ok(result.totalCustomerPayable > 10800);
});

test('calculateBookingPrice respects minimum platform fee', () => {
  const result = calculateBookingPrice({
    areaSqFt: 20,
    ratePerSqFtPerMonth: 10,
    durationMonths: 1,
    platformFeePercent: 10,
    minPlatformFee: 500,
  });

  // 20 * 10 * 1 = 200. 10% of 200 is 20, but minPlatformFee is 500
  assert.equal(result.baseStorageCost, 200);
  assert.equal(result.platformFee, 500);
});

test('calculateLogisticsQuote generates deterministic fare for Tata Ace', () => {
  const quote = calculateLogisticsQuote('Tata Ace', 20, 100);
  assert.equal(quote.vehicleType, 'Tata Ace');
  assert.equal(quote.baseFare, 750);
  assert.equal(quote.distanceFare, 20 * 26);
  assert.equal(quote.handlingFee, 250); // 100 * 2.5
  assert.equal(quote.totalFare, 750 + 520 + 250);
});
