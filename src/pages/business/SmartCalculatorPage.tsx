import React, { useState } from 'react';
import { estimateStorageNeeds, StorageEstimationInput } from '../../utils/calculator';
import {
  Calculator,
  Boxes,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  ShieldAlert,
  Search,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';

interface SmartCalculatorPageProps {
  onNavigate: (path: string) => void;
}

export const SmartCalculatorPage: React.FC<SmartCalculatorPageProps> = ({ onNavigate }) => {
  const [category, setCategory] = useState<StorageEstimationInput['category']>('fmcg');
  const [unitType, setUnitType] = useState<StorageEstimationInput['unitType']>('standard_carton');
  const [quantity, setQuantity] = useState<number>(500);
  const [customL, setCustomL] = useState<number>(18);
  const [customW, setCustomW] = useState<number>(12);
  const [customH, setCustomH] = useState<number>(12);
  const [stackingLevels, setStackingLevels] = useState<number>(4);
  const [aisleAllowance, setAisleAllowance] = useState<number>(25);

  // Special Handling
  const [fragileLimit, setFragileLimit] = useState<boolean>(false);
  const [palletJackNeeded, setPalletJackNeeded] = useState<boolean>(false);
  const [temperatureSensitive, setTemperatureSensitive] = useState<boolean>(false);

  const result = estimateStorageNeeds({
    category,
    unitType,
    quantity,
    customDimensions: {
      lengthInches: customL,
      widthInches: customW,
      heightInches: customH,
    },
    maxStackingLevels: stackingLevels,
    aisleAllowancePercent: aisleAllowance,
    specialHandling: {
      fragileStackingLimit: fragileLimit,
      palletJackNeeded,
      temperatureSensitive,
    },
    targetCityAverageRate: 18,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" /> Rule-Based Volumetric Estimation Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Storage Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Estimate exactly how much floor space you need based on cartons, pallet geometry, vertical stacking, and forklift/aisle clearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form (Left Column) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5 text-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Inventory Specifications
          </h3>

          {/* Product Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Product Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'fmcg', label: 'FMCG & Food' },
                  { id: 'electronics', label: 'Electronics' },
                  { id: 'garments', label: 'Garments' },
                  { id: 'furniture', label: 'Furniture' },
                  { id: 'packaging', label: 'Packaging' },
                  { id: 'general', label: 'General Goods' },
                ] as const
              ).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                    category === cat.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Type */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Packaging Unit Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  { id: 'standard_carton', label: 'Standard Carton (18×12×12")' },
                  { id: 'large_box', label: 'Large Master Box (24×18×18")' },
                  { id: 'wooden_crate', label: 'Wooden Crate (36×30×30")' },
                  { id: 'pallet', label: 'Industrial Pallet (48×40×48")' },
                  { id: 'custom', label: 'Custom Dimensions' },
                ] as const
              ).map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setUnitType(t.id)}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                    unitType === t.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dimensions if selected */}
          {unitType === 'custom' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-semibold text-slate-700">Enter Single Box Dimensions (Inches)</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400">Length (in)</span>
                  <input
                    type="number"
                    value={customL}
                    onChange={(e) => setCustomL(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Width (in)</span>
                  <input
                    type="number"
                    value={customW}
                    onChange={(e) => setCustomW(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Height (in)</span>
                  <input
                    type="number"
                    value={customH}
                    onChange={(e) => setCustomH(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quantity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-700">Total Quantity to Store</label>
              <span className="font-bold text-indigo-600 text-sm">{quantity.toLocaleString('en-IN')} units</span>
            </div>
            <input
              type="range"
              min="20"
              max="3000"
              step="20"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>20 units</span>
              <span>1,500 units</span>
              <span>3,000+ units</span>
            </div>
          </div>

          {/* Stacking & Handling Overhead */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vertical Stacking</label>
              <select
                value={stackingLevels}
                onChange={(e) => setStackingLevels(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value={1}>1 Level (No stacking)</option>
                <option value={2}>2 Levels</option>
                <option value={3}>3 Levels</option>
                <option value={4}>4 Levels (Standard cartons)</option>
                <option value={5}>5 Levels (Lightweight)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Aisle / Handling Allowance</label>
              <select
                value={aisleAllowance}
                onChange={(e) => setAisleAllowance(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value={15}>15% (Dense storage)</option>
                <option value={25}>25% (Standard walkway)</option>
                <option value={35}>35% (Pallet jack & trolley)</option>
              </select>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="block font-semibold text-slate-700">Special Handling Constraints</span>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fragileLimit}
                  onChange={(e) => setFragileLimit(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                <span>Fragile items (Cap vertical stacking to max 2 levels)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={palletJackNeeded}
                  onChange={(e) => setPalletJackNeeded(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                <span>Heavy pallet jack access needed (Expands aisle allowance to 35%)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={temperatureSensitive}
                  onChange={(e) => setTemperatureSensitive(e.target.checked)}
                  className="rounded text-indigo-600 accent-indigo-600"
                />
                <span>Temperature controlled storage required (22°C ambient)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Estimation Output Card (Right Column) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Calculated Estimate
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Demo Engine
              </span>
            </div>

            {/* Main recommendation */}
            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Recommended Storage Area</span>
              <p className="text-4xl font-black text-emerald-400 tracking-tight">
                {result.recommendedStorageSqFt} <span className="text-lg font-bold text-slate-300">sq ft</span>
              </p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full">
                {result.suggestedUnitCategory}
              </span>
            </div>

            {/* Cost range */}
            <div className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Monthly Budget Range</span>
              <p className="text-xl font-bold text-white">
                ₹{result.estimatedMonthlyCostMin.toLocaleString('en-IN')} – ₹{result.estimatedMonthlyCostMax.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-400">Based on NCR regional warehouse averages (₹16–₹22/sq ft)</p>
            </div>

            {/* Volumetric details breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Single Unit Volume:</span>
                <span className="text-white font-mono">{result.singleUnitVolumeCuFt} cu ft</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Gross Cargo Volume:</span>
                <span className="text-white font-mono">{result.totalGrossVolumeCuFt} cu ft</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Raw Floor Footprint:</span>
                <span className="text-white font-mono">{result.footprintAreaSqFt} sq ft</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Aisle & Material Clearance:</span>
                <span className="text-white font-mono">+{result.handlingAisleAllowanceSqFt} sq ft</span>
              </div>
            </div>

            {/* Space efficiency tip */}
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>{result.spaceEfficiencyTip}</span>
            </div>

            {/* CTA to find units matching this exact sq ft */}
            <button
              onClick={() => onNavigate('/business/storage')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Find Verified Spaces for ~{result.recommendedStorageSqFt} Sq Ft
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Disclaimer as required by #12 */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Disclaimer:</strong> This calculator provides geometric planning estimations based on standard packing practices. It does not replace structural load assessments or certified warehouse fire safety compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
