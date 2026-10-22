import React from 'react';
import { Layers, CheckCircle2, Clock, Sparkles, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

interface RoadmapPageProps {
  onNavigate: (path: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate }) => {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'On-Demand Storage Marketplace',
      status: 'Live MVP',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Core B2B storage marketplace enabling businesses to discover, compare, and rent flexible capacity by the square foot.',
      features: [
        'Verified property marketplace across Meerut, Ghaziabad, Noida, Delhi',
        'Transparent ₹/sq ft per month dynamic pricing engine',
        'Full-stack booking engine with capacity reservation & release math',
        'Digital IT Act-compliant storage lease agreements',
        'Admin property verification audit queue',
      ],
    },
    {
      phase: 'Phase 2',
      title: 'Inventory Ledger & First-Mile Logistics',
      status: 'Live MVP',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Turnkey storage operations with digital cargo tracking, unit QR passes, and doorstep commercial vehicle dispatch.',
      features: [
        'Digital SKU ledger with real-time inward & dispatch history',
        'Bay-level QR codes & barcode inspection tags (e.g. MER-04-B17)',
        'Low-stock threshold triggers & balance audits',
        'Doorstep transport quotes (Tata Ace, E-Loader, Bolero Maxi, 14ft Canter)',
        'Dispute arbitration system with multi-party resolution threads',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Commercial Cargo Insurance & Live Razorpay Route',
      status: 'Planned Integration',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Partnering with licensed general insurers for micro-cargo coverage and automated escrow settlement.',
      features: [
        'Per-day transit and storage casualty insurance options',
        'Production Razorpay Route integration for instant host commission split',
        'Automated GST E-way bill generation & monthly reconciliation',
        'Automated WhatsApp notifications for bay access logs',
      ],
    },
    {
      phase: 'Phase 4',
      title: 'AI Storage Estimator & Predictive Demand Forecasting',
      status: 'Planned Integration',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Machine learning intelligence to forecast seasonal stocking requirements for festival rushes (Diwali, Eid, Wedding seasons).',
      features: [
        'AI camera bay utilization & volumetric fill-level scanning',
        'Predictive demand analytics to advise space hosts on optimal pricing',
        'Smart inventory rebalancing across multiple satellite hubs',
      ],
    },
    {
      phase: 'Phase 5',
      title: 'Pan-India Multi-City Storage Network',
      status: 'Planned',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      description: 'Scaling StoreFlex across 50 industrial clusters and Tier-2 trading towns across India.',
      features: [
        'Expansion to Mumbai-Bhiwandi, Bengaluru, Surat, Ahmedabad, and Chennai',
        'Sub-leasing & micro-fulfillment contracts for D2C brands',
        'StoreFlex Cold Chain network for perishable agricultural trade',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left py-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
          <Layers className="w-3.5 h-3.5" /> Product Vision
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          StoreFlex Product Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Our phased technological roadmap transforming India's fragmented warehousing landscape into an agile, on-demand infrastructure network.
        </p>
      </div>

      <div className="space-y-6">
        {phases.map((p, idx) => (
          <div
            key={p.phase}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4 hover:border-slate-300 transition-all text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {p.phase}
                </span>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${p.badgeClass}`}>
                {p.status}
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed text-xs">{p.description}</p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Milestone Capabilities</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-indigo-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base">Ready to test the live StoreFlex MVP?</h4>
          <p className="text-xs text-indigo-200 mt-0.5">Explore available storage in Meerut and Delhi NCR right now.</p>
        </div>
        <button
          onClick={() => onNavigate('/business/storage')}
          className="px-5 py-2.5 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Explore Storage Marketplace
        </button>
      </div>
    </div>
  );
};
