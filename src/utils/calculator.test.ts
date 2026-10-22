import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateStorageNeeds } from './calculator.ts';

test('estimateStorageNeeds: 500 standard cartons yields ~240-260 sq ft', () => {
  const result = estimateStorageNeeds({
    category: 'fmcg',
    unitType: 'standard_carton',
    quantity: 500,
    maxStackingLevels: 4,
    aisleAllowancePercent: 25,
  });

  // 500 cartons / 4 levels = 125 cartons on floor
  // 1 carton footprint = (18 * 12) / 144 = 1.5 sq ft
  // Raw footprint = 125 * 1.5 = 187.5 ~ 188 sq ft
  // Aisle allowance 25% of 188 = 47 sq ft
  // Total ~ 235 sq ft, rounded up to nearest 10 = 240 sq ft
  assert.ok(result.recommendedStorageSqFt >= 230 && result.recommendedStorageSqFt <= 260);
  assert.equal(result.suggestedUnitCategory, 'Medium (150-400 sq ft)');
  assert.ok(result.estimatedMonthlyCostMin > 3500);
  assert.ok(result.estimatedMonthlyCostMax < 7000);
});

test('estimateStorageNeeds respects fragile stacking limit', () => {
  const result = estimateStorageNeeds({
    category: 'electronics',
    unitType: 'large_box',
    quantity: 100,
    maxStackingLevels: 5,
    specialHandling: {
      fragileStackingLimit: true, // Should cap at 2
    },
  });

  assert.equal(result.effectiveStackingLevels, 2);
});
