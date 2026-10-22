/**
 * Smart Storage Calculator Engine
 * Calculates volumetric storage requirements, stacking factors, aisle/handling overhead,
 * and estimated monthly budget range.
 */

export interface StorageEstimationInput {
  category: 'fmcg' | 'electronics' | 'garments' | 'furniture' | 'packaging' | 'general';
  unitType: 'standard_carton' | 'large_box' | 'wooden_crate' | 'pallet' | 'custom';
  quantity: number;
  customDimensions?: {
    lengthInches: number;
    widthInches: number;
    heightInches: number;
  };
  maxStackingLevels?: number;
  aisleAllowancePercent?: number; // e.g., 25% for walkway & handling
  specialHandling?: {
    temperatureSensitive?: boolean;
    fragileStackingLimit?: boolean;
    palletJackNeeded?: boolean;
  };
  targetCityAverageRate?: number; // default ₹18-22 / sqft
}

export interface StorageEstimationResult {
  totalUnitCount: number;
  singleUnitVolumeCuFt: number;
  totalGrossVolumeCuFt: number;
  effectiveStackingLevels: number;
  footprintAreaSqFt: number;
  handlingAisleAllowanceSqFt: number;
  recommendedStorageSqFt: number;
  suggestedUnitCategory: 'Small (50-150 sq ft)' | 'Medium (150-400 sq ft)' | 'Large (400-1000 sq ft)' | 'Enterprise (1000+ sq ft)';
  estimatedMonthlyCostMin: number;
  estimatedMonthlyCostMax: number;
  spaceEfficiencyTip: string;
}

// Standard preset dimensions in inches (L x W x H)
const PRESET_DIMENSIONS: Record<string, { l: number; w: number; h: number; defaultStack: number }> = {
  standard_carton: { l: 18, w: 12, h: 12, defaultStack: 4 }, // 1.5 cu ft
  large_box: { l: 24, w: 18, h: 18, defaultStack: 3 },       // 4.5 cu ft
  wooden_crate: { l: 36, w: 30, h: 30, defaultStack: 2 },    // 18.75 cu ft
  pallet: { l: 48, w: 40, h: 48, defaultStack: 2 },          // 53.3 cu ft
  custom: { l: 16, w: 14, h: 12, defaultStack: 3 },
};

export function estimateStorageNeeds(input: StorageEstimationInput): StorageEstimationResult {
  const quantity = Math.max(1, input.quantity || 1);
  const dims = input.customDimensions && input.unitType === 'custom'
    ? {
        l: Math.max(1, input.customDimensions.lengthInches),
        w: Math.max(1, input.customDimensions.widthInches),
        h: Math.max(1, input.customDimensions.heightInches),
        defaultStack: 3,
      }
    : PRESET_DIMENSIONS[input.unitType] || PRESET_DIMENSIONS.standard_carton;

  // Single unit volume in cubic feet: (L * W * H) / 1728
  const singleUnitVolumeCuFt = Math.round(((dims.l * dims.w * dims.h) / 1728) * 100) / 100;
  const totalGrossVolumeCuFt = Math.round(singleUnitVolumeCuFt * quantity * 10) / 10;

  // Determine stacking factor based on user input or category constraints
  let maxStack = input.maxStackingLevels || dims.defaultStack;
  if (input.specialHandling?.fragileStackingLimit) {
    maxStack = Math.min(maxStack, 2);
  }
  if (input.category === 'furniture') {
    maxStack = Math.min(maxStack, 2);
  }
  const effectiveStackingLevels = Math.max(1, maxStack);

  // Floor footprint for 1 unit in sq ft: (L * W) / 144
  const singleUnitFootprintSqFt = (dims.l * dims.w) / 144;
  // Total units on the floor = ceil(quantity / stacking levels)
  const floorUnitsCount = Math.ceil(quantity / effectiveStackingLevels);
  const rawFootprintSqFt = Math.round(floorUnitsCount * singleUnitFootprintSqFt);

  // Aisle & material handling clearance (standard warehousing requires 20% to 35% for access)
  let aislePercent = input.aisleAllowancePercent ?? 25;
  if (input.specialHandling?.palletJackNeeded) {
    aislePercent = Math.max(aislePercent, 35);
  }
  const handlingAisleAllowanceSqFt = Math.round((rawFootprintSqFt * aislePercent) / 100);

  // Recommended usable storage area (rounded up to nearest 10 sq ft)
  const totalCalculatedArea = rawFootprintSqFt + handlingAisleAllowanceSqFt;
  const recommendedStorageSqFt = Math.max(50, Math.ceil(totalCalculatedArea / 10) * 10);

  // Categorize size
  let suggestedUnitCategory: StorageEstimationResult['suggestedUnitCategory'] = 'Small (50-150 sq ft)';
  if (recommendedStorageSqFt > 1000) {
    suggestedUnitCategory = 'Enterprise (1000+ sq ft)';
  } else if (recommendedStorageSqFt > 400) {
    suggestedUnitCategory = 'Large (400-1000 sq ft)';
  } else if (recommendedStorageSqFt > 150) {
    suggestedUnitCategory = 'Medium (150-400 sq ft)';
  }

  // Cost estimates based on regional rate (average ₹18/sqft - ₹24/sqft)
  const avgRate = input.targetCityAverageRate || 18;
  const estimatedMonthlyCostMin = Math.round(recommendedStorageSqFt * (avgRate * 0.9));
  const estimatedMonthlyCostMax = Math.round(recommendedStorageSqFt * (avgRate * 1.25));

  // Dynamic suggestion tip
  let spaceEfficiencyTip = 'Stacking up to 4 layers will reduce your floor footprint by 75%.';
  if (input.category === 'garments') {
    spaceEfficiencyTip = 'Hanger racks and bin shelves can increase volumetric density by 40%.';
  } else if (input.category === 'fmcg') {
    spaceEfficiencyTip = 'Ensure FIFO (First-In-First-Out) aisle width for smooth dispatch and inventory turns.';
  } else if (input.specialHandling?.temperatureSensitive) {
    spaceEfficiencyTip = 'Select a facility with climate control and 24/7 power backup to prevent spoilage.';
  }

  return {
    totalUnitCount: quantity,
    singleUnitVolumeCuFt,
    totalGrossVolumeCuFt,
    effectiveStackingLevels,
    footprintAreaSqFt: rawFootprintSqFt,
    handlingAisleAllowanceSqFt,
    recommendedStorageSqFt,
    suggestedUnitCategory,
    estimatedMonthlyCostMin,
    estimatedMonthlyCostMax,
    spaceEfficiencyTip,
  };
}
