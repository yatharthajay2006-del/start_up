import test from 'node:test';
import assert from 'node:assert/strict';
import { computeStorageMatch } from './matching.ts';

test('computeStorageMatch gives high score for strong match', () => {
  const criteria = {
    targetCity: 'Meerut',
    requiredAreaSqFt: 250,
    maxBudgetPerMonth: 6000,
    durationMonths: 3,
    productCategory: 'Electronics',
    requiredFacilities: ['CCTV', 'Security', 'Loading Dock'],
    minRating: 4,
  };

  const candidate = {
    id: 'prop-1',
    name: 'Meerut Central Logistics Hub',
    city: 'Meerut',
    availableArea: 1800,
    totalArea: 5000,
    pricePerSqFt: 18, // 250 * 18 = 4500 (under 6000)
    minDurationMonths: 1,
    allowedCategories: ['Electronics', 'FMCG', 'Garments'],
    facilities: ['CCTV', 'Security', 'Loading Dock', 'Fire Safety', '24/7 Access'],
    rating: 4.8,
    reviewCount: 38,
    isVerified: true,
  };

  const match = computeStorageMatch(criteria, candidate);
  assert.ok(match.score >= 90);
  assert.equal(match.isBestMatch, true);
  assert.ok(match.matchHighlights.length > 0);
});

test('computeStorageMatch penalizes mismatch in city and category', () => {
  const criteria = {
    targetCity: 'Delhi',
    requiredAreaSqFt: 500,
    durationMonths: 6,
    productCategory: 'Perishable Goods',
  };

  const candidate = {
    id: 'prop-2',
    name: 'Meerut Godown',
    city: 'Meerut',
    availableArea: 200, // Insufficient capacity (< 500)
    totalArea: 1000,
    pricePerSqFt: 25,
    minDurationMonths: 1,
    allowedCategories: ['FMCG', 'Garments'], // Perishable Goods not allowed
    facilities: ['CCTV'],
    rating: 3.5,
    reviewCount: 4,
    isVerified: false,
  };

  const match = computeStorageMatch(criteria, candidate);
  assert.ok(match.score < 60);
  assert.equal(match.isBestMatch, false);
});
