import React, { useState } from 'react';
import {
  Boxes,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Search,
  Building,
  CheckCircle2,
  DollarSign,
  Truck,
  Warehouse,
  ChevronRight,
  Calculator,
  Lock,
  Layers,
  Sparkles,
  Award,
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
} from 'lucide-react';
import { estimateStorageNeeds } from '../utils/calculator';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Mini interactive calculator for the Smart Storage teaser
  const [calcQuantity, setCalcQuantity] = useState<number>(500);
  const [calcCategory, setCalcCategory] = useState<'fmcg' | 'electronics' | 'garments'>('fmcg');

  const estimation = estimateStorageNeeds({
    category: calcCategory,
    unitType: 'standard_carton',
    quantity: calcQuantity,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>On-Demand Business Storage Infrastructure</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Grow your inventory <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
                  without expanding
                </span>{' '}
                your premises.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Find verified storage space for your business. Rent only the space you need, for as long as you need it.
                No long leases, no giant deposits, zero wasted capacity.
              </p>

              {/* Tagline highlight */}
              <div className="inline-block p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700">
                Tagline: <span className="font-extrabold text-indigo-700 font-serif italic text-sm">“Jitni jagah chahiye, utni hi rent karo.”</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/business/storage')}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Find Storage
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/owner/properties/new')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center gap-2"
                >
                  <Building className="w-4 h-4 text-emerald-600" />
                  List Your Space
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Verified Properties
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" /> Flexible 1 to 12 Month Tenancy
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" /> Delhi NCR, Meerut & UP Industrial Hubs
                </span>
              </div>
            </div>

            {/* Right Hero Visual: Conceptual Marketplace & Live Dashboard Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 space-y-4">
                {/* Header preview */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      SF
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">StoreFlex Live Marketplace</p>
                      <p className="text-[10px] text-slate-500">Real-time capacity in Delhi NCR</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 14 Spaces Ready
                  </span>
                </div>

                {/* Sample interactive listing card */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                        ★ 96% Match
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">Meerut Central Logistics Hub</h4>
                      <p className="text-[11px] text-slate-500">Partapur Industrial Area, Delhi Road</p>
                    </div>
                    <span className="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-200">
                      4.8 ★
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block">Available Flex Space</span>
                      <strong className="text-emerald-700 text-sm">3,200 sq ft</strong>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block">Starting Rate</span>
                      <strong className="text-slate-900 text-sm">₹18 / sq ft</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500 text-[11px]">Example: 200 sq ft for 3 mo:</span>
                    <strong className="text-indigo-600 font-bold">₹10,800 total</strong>
                  </div>
                </div>

                {/* Micro metric badges */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-left">
                    <span className="text-[10px] font-semibold text-indigo-600 uppercase">Avg Cost Savings</span>
                    <p className="text-base font-extrabold text-indigo-950">62% Less</p>
                    <span className="text-[10px] text-slate-500">vs full warehouse lease</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-left">
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase">Owner Utilization</span>
                    <p className="text-base font-extrabold text-emerald-950">+₹48,000</p>
                    <span className="text-[10px] text-slate-500">Avg monthly passive yield</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              The Critical Growth Bottleneck
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              “Your sales are growing. Your shop isn't.”
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Small and medium businesses frequently have huge customer demand to stock more inventory, but their shop or godown is completely choked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Limited Shop Space</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Floor space in commercial retail markets like Chandni Chowk, Sadar Bazar, or Meerut Market costs ₹150+ / sq ft. Storing bulk cartons there is financial suicide.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Expensive Full Warehouses</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traditional warehouse operators only lease entire buildings of 5,000 to 20,000 sq ft. If you only need 300 sq ft, you are locked out or pay for unused air.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Long-term Commitments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commercial landlords demand 3 to 5 year lock-in agreements and 6 months of frozen security deposit, choking working capital during seasonal sales spikes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900">Unused Capacity Next Door</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meanwhile, dozens of warehouses and commercial properties in Sahibabad, Okhla, and Partapur sit 40% empty with zero monetization. StoreFlex bridges this gap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW STOREFLEX WORKS */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              How StoreFlex Works
            </h2>
            <p className="text-sm text-slate-600">
              From finding storage to loading your goods, streamlined for Indian commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs relative text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tell Us What You Need</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your required area (e.g. 200 sq ft), product category, preferred city, and duration. Use our Smart Calculator if you only know carton quantities.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs relative text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Choose Verified Storage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare verified properties by price (₹/sq ft), CCTV safety, loading docks, and ratings. Review pricing transparently and sign the digital agreement online.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs relative text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Store and Manage Inventory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get an instant QR gate pass for your allocated unit. Track stock inward/outward digitally in your dashboard, and arrange doorstep pickup via StoreFlex Logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR BUSINESSES & FOR SPACE OWNERS SPLIT */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* For Businesses */}
          <div id="for-businesses" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-left">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                For Retailers, Wholesalers & E-Commerce
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Unlock flexible inventory capacity on your terms.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Flexible Storage Sizes</h4>
                    <p className="text-[11px] text-slate-500">Rent as small as 50 sq ft or up to 5,000 sq ft.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Verified Facilities</h4>
                    <p className="text-[11px] text-slate-500">Audited for fire NOC, CCTV, and physical safety.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Transparent Pricing</h4>
                    <p className="text-[11px] text-slate-500">Pay only ₹/sq ft per month. No hidden broker fees.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Inventory Tracking</h4>
                    <p className="text-[11px] text-slate-500">Digital SKU counts, low stock alerts, gate passes.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/business/storage')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-2"
              >
                Find Storage Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
                alt="Storage facility"
                className="w-full h-72 object-cover rounded-xl shadow-md"
              />
            </div>
          </div>

          {/* For Space Owners */}
          <div id="for-owners" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80"
                alt="Warehouse property"
                className="w-full h-72 object-cover rounded-xl shadow-md"
              />
            </div>

            <div className="space-y-5 text-left order-1 lg:order-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                For Warehouse & Property Owners
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Turn your unused storage capacity into steady monthly revenue.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Monetize Vacant Space</h4>
                    <p className="text-[11px] text-slate-500">Earn ₹16–₹24/sq ft/month on capacity that sat empty.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Verified Business Tenants</h4>
                    <p className="text-[11px] text-slate-500">Every merchant is KYC verified with GST & PAN.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Occupancy Tracking</h4>
                    <p className="text-[11px] text-slate-500">Real-time portal to monitor bay allocation & bookings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Automated Monthly Payouts</h4>
                    <p className="text-[11px] text-slate-500">StoreFlex collects payments and disburses directly.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/owner/properties/new')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-2"
              >
                List Your Space <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SMART STORAGE ESTIMATOR TEASER */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" /> AI-Assisted Storage Estimation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Not sure how many square feet you need?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Don't guess. Our rule-based volumetric estimation engine calculates stacking heights, pallet dimensions, and aisle handling allowances to give you the exact recommended space.
              </p>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                <p className="font-semibold text-white">Example Calculation:</p>
                <p className="text-slate-300">
                  500 standard cartons (18"×12"×12") with 4-level stacking + 25% aisle allowance
                  ➔ <strong className="text-emerald-400 font-bold">~240 sq ft recommended</strong>.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/business/storage-calculator')}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-indigo-600" />
                Launch Full Storage Calculator
              </button>
            </div>

            {/* Interactive Mini Demo */}
            <div className="lg:col-span-6 bg-slate-800 rounded-2xl p-6 border border-slate-700 text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-bold text-slate-300 uppercase">Live Estimator Widget</span>
                <span className="text-[11px] text-amber-400 font-medium">Demo Mode</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Inventory Volume: <strong className="text-white">{calcQuantity} Cartons</strong>
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Recommended Area</span>
                  <p className="text-2xl font-black text-emerald-400">{estimation.recommendedStorageSqFt} sq ft</p>
                  <span className="text-[10px] text-slate-400">Includes aisle & handling</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Monthly Cost</span>
                  <p className="text-xl font-black text-white">
                    ₹{estimation.estimatedMonthlyCostMin.toLocaleString('en-IN')} - ₹{estimation.estimatedMonthlyCostMax.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-slate-400">At regional average rate</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Tip: {estimation.spaceEfficiencyTip}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & SAFETY */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Integrity & Compliance
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Trust & Safety First
            </h2>
            <p className="text-sm text-slate-600">
              Every facility and business on StoreFlex undergoes strict verification before transacting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">KYC & Document Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All business tenants and property hosts submit Aadhaar, PAN, GSTIN, and ownership deed for verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
              <Warehouse className="w-7 h-7 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Physical Property Audit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Properties are vetted for fire extinguishers, water leakage, CCTV camera coverage, and gate access protocols.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
              <FileText className="w-7 h-7 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900">Digital Legal Agreements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard electronic commercial storage contracts binding lessor and lessee with clear deposit refund rules.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center max-w-2xl mx-auto">
            <strong>Transparency Notice:</strong> StoreFlex does not make false insurance claims. Cargo insurance partnerships are designated as <em>Planned Integration (Phase 3)</em> on our roadmap.
          </div>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section id="roadmap" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Startup Vision & Evolution
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Product Roadmap
            </h2>
            <p className="text-sm text-slate-600">
              How StoreFlex is building the next-generation warehousing network for India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-5 bg-white rounded-2xl border-2 border-indigo-600 shadow-sm text-left space-y-2 relative">
              <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Phase 1 • Live MVP
              </span>
              <h3 className="font-bold text-sm text-slate-900">Storage Marketplace</h3>
              <p className="text-[11px] text-slate-600">
                Property listing, admin verification, booking engine, capacity allocation, mock payments.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Phase 2 • Built In
              </span>
              <h3 className="font-bold text-sm text-slate-900">Inventory & Logistics</h3>
              <p className="text-[11px] text-slate-600">
                Digital SKU ledger, QR unit tags, movement audit log, vehicle pickup quotes.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Phase 3 • Coming Soon
              </span>
              <h3 className="font-bold text-sm text-slate-900">Insurance & Razorpay</h3>
              <p className="text-[11px] text-slate-600">
                Integrated cargo transit insurance, live Razorpay route splitting, automated e-invoicing.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Phase 4 • Planned
              </span>
              <h3 className="font-bold text-sm text-slate-900">AI Demand Forecasting</h3>
              <p className="text-[11px] text-slate-600">
                Predictive seasonal stocking recommendations, dynamic surge pricing for space hosts.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 text-left space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Phase 5 • Planned
              </span>
              <h3 className="font-bold text-sm text-slate-900">Pan-India Network</h3>
              <p className="text-[11px] text-slate-600">
                Expansion across Mumbai, Bengaluru, Chennai, Kolkata, and 50 Tier-2 commercial clusters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                <Boxes className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight">
                Store<span className="text-indigo-400">Flex</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              On-demand storage infrastructure for growing businesses in India. Rent only what you need, when you need it.
            </p>
            <p className="text-slate-500 text-[11px]">
              © {new Date().getFullYear()} StoreFlex Technologies Pvt Ltd. All rights reserved.
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Platform</p>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onNavigate('/business/storage')} className="hover:text-white">Find Storage</button></li>
              <li><button onClick={() => onNavigate('/business/storage-calculator')} className="hover:text-white">Storage Calculator</button></li>
              <li><button onClick={() => onNavigate('/#how-it-works')} className="hover:text-white">How It Works</button></li>
              <li><button onClick={() => onNavigate('/roadmap')} className="hover:text-white">Product Roadmap</button></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">User Portals</p>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onNavigate('/business/dashboard')} className="hover:text-white">Businessman Portal</button></li>
              <li><button onClick={() => onNavigate('/owner/dashboard')} className="hover:text-white">Space Owner Portal</button></li>
              <li><button onClick={() => onNavigate('/admin/dashboard')} className="hover:text-white">Admin Operations</button></li>
              <li><button onClick={() => onNavigate('/login')} className="hover:text-white">Sign In / Demo Login</button></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">Legal & Safety</p>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-slate-400">Property KYC Standard</span></li>
              <li><span className="text-slate-400">Digital Agreements</span></li>
              <li><span className="text-slate-400">Terms of Service</span></li>
              <li><span className="text-slate-400">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
