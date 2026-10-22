/**
 * Rule-Based Smart Storage Matching Engine
 * Multi-factor weighted compatibility evaluation between business storage requirements
 * and property capabilities.
 *
 * Weight Distribution:
 * - Location / City Proximity: 30%
 * - Price & Budget Alignment: 20%
 * - Capacity / Area Fit: 20%
 * - Required Facilities: 15%
 * - Product Category Compatibility: 10%
 * - Verified Quality & Rating: 5%
 */

export interface MatchCriteria {
  targetCity: string;
  requiredAreaSqFt: number;
  maxBudgetPerMonth?: number;
  durationMonths: number;
  productCategory: string;
  requiredFacilities?: string[];
  minRating?: number;
}

export interface MatchCandidate {
  id: string;
  name: string;
  city: string;
  availableArea: number;
  totalArea: number;
  pricePerSqFt: number;
  minDurationMonths: number;
  allowedCategories: string[];
  facilities: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export interface MatchResult {
  score: number; // 0 to 100
  breakdown: {
    locationScore: number;
    priceScore: number;
    capacityScore: number;
    facilitiesScore: number;
    categoryScore: number;
    qualityScore: number;
  };
  isBestMatch: boolean;
  matchHighlights: string[];
}

export function computeStorageMatch(criteria: MatchCriteria, candidate: MatchCandidate): MatchResult {
  const highlights: string[] = [];

  // 1. Location match (30 points)
  let locationScore = 0;
  if (candidate.city.toLowerCase() === criteria.targetCity.toLowerCase()) {
    locationScore = 30;
    highlights.push(`Direct city match in ${candidate.city}`);
  } else {
    // Neighboring NCR/UP region partial match
    locationScore = 15;
  }

  // 2. Capacity match (20 points)
  let capacityScore = 0;
  if (candidate.availableArea >= criteria.requiredAreaSqFt) {
    const ratio = criteria.requiredAreaSqFt / candidate.availableArea;
    // Ideal if required area is 20%-80% of available capacity
    if (ratio >= 0.1 && ratio <= 0.9) {
      capacityScore = 20;
      highlights.push(`Optimal capacity (${candidate.availableArea} sq ft available)`);
    } else {
      capacityScore = 16;
    }
  } else {
    // Insufficient capacity penalty
    capacityScore = Math.max(0, Math.round((candidate.availableArea / criteria.requiredAreaSqFt) * 10));
  }

  // 3. Price & Budget match (20 points)
  let priceScore = 20;
  const estimatedMonthlyCost = candidate.pricePerSqFt * criteria.requiredAreaSqFt;
  if (criteria.maxBudgetPerMonth && criteria.maxBudgetPerMonth > 0) {
    if (estimatedMonthlyCost <= criteria.maxBudgetPerMonth) {
      priceScore = 20;
      highlights.push(`Within monthly budget (₹${estimatedMonthlyCost.toLocaleString('en-IN')})`);
    } else {
      const overBudgetRatio = estimatedMonthlyCost / criteria.maxBudgetPerMonth;
      if (overBudgetRatio <= 1.2) {
        priceScore = 12; // slightly over
      } else {
        priceScore = 4;  // heavily over
      }
    }
  } else {
    // If no budget specified, score based on market average competitiveness (< ₹20/sqft = full points)
    if (candidate.pricePerSqFt <= 18) {
      priceScore = 20;
      highlights.push(`Competitive pricing at ₹${candidate.pricePerSqFt}/sq ft`);
    } else if (candidate.pricePerSqFt <= 25) {
      priceScore = 16;
    } else {
      priceScore = 12;
    }
  }

  // 4. Facilities match (15 points)
  let facilitiesScore = 15;
  if (criteria.requiredFacilities && criteria.requiredFacilities.length > 0) {
    const matchedCount = criteria.requiredFacilities.filter(rf =>
      candidate.facilities.some(cf => cf.toLowerCase() === rf.toLowerCase())
    ).length;
    const ratio = matchedCount / criteria.requiredFacilities.length;
    facilitiesScore = Math.round(ratio * 15);
    if (matchedCount === criteria.requiredFacilities.length) {
      highlights.push('100% required facilities matched');
    }
  } else {
    // High-spec bonus
    const specCount = candidate.facilities.length;
    facilitiesScore = Math.min(15, 8 + Math.round(specCount * 1.5));
  }

  // 5. Product category compatibility (10 points)
  let categoryScore = 0;
  const isCategorySupported = candidate.allowedCategories.some(
    cat => cat.toLowerCase() === criteria.productCategory.toLowerCase() || cat.toLowerCase() === 'all'
  );
  if (isCategorySupported) {
    categoryScore = 10;
    highlights.push(`Approved for ${criteria.productCategory}`);
  } else {
    categoryScore = 2; // restricted or not explicitly listed
  }

  // 6. Quality & Rating (5 points)
  let qualityScore = 0;
  if (candidate.isVerified) qualityScore += 2;
  if (candidate.rating >= 4.5) {
    qualityScore += 3;
    highlights.push(`Top-rated facility (${candidate.rating}★)`);
  } else if (candidate.rating >= 4.0) {
    qualityScore += 2;
  } else {
    qualityScore += 1;
  }

  const rawScore = locationScore + capacityScore + priceScore + facilitiesScore + categoryScore + qualityScore;
  const score = Math.min(100, Math.max(0, rawScore));

  return {
    score,
    breakdown: {
      locationScore,
      priceScore,
      capacityScore,
      facilitiesScore,
      categoryScore,
      qualityScore,
    },
    isBestMatch: score >= 88,
    matchHighlights: highlights.slice(0, 3),
  };
}
