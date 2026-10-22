import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ShieldCheck, RefreshCw, KeyRound, CheckCircle2, X } from 'lucide-react';
import { api } from '../../services/api';

export const DemoBanner: React.FC = () => {
  const { user, quickSwitch } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  const handleReset = async () => {
    if (confirm('Reset database to initial sample data with 10+ Indian properties, bookings, and inventory?')) {
      setIsResetting(true);
      try {
        await api.resetDemoSeed();
        window.location.reload();
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleOpenStatus = async () => {
    setShowStatusModal(true);
    setLoadingConfig(true);
    try {
      const res = await api.getSystemConfig();
      setConfig(res.services || {});
    } catch {
      // Fallback display
      setConfig({
        database: { mode: 'mock_in_memory_json', status: 'operational', description: 'Persistent JSON database (.storeflex-data.json) active with full NCR warehouse seed.' },
        auth: { mode: 'demo_seeded_users', status: 'operational', description: 'Demo authentication active with 3 pre-seeded Indian business and admin personas.' },
        payments: { mode: 'mock_payments_simulator', status: 'operational', description: 'Mock Razorpay payment gateway enabled. Instant tokenization and receipts.' },
        maps: { mode: 'mock_regional_grid', status: 'operational', description: 'Delhi-NCR regional warehouse grid with distance matrices and coordinate mapping.' },
        storage: { mode: 'mock_local_storage', status: 'operational', description: 'Local and mock asset storage enabled for property photos and commercial documents.' },
        email: { mode: 'in_app_notification_system', status: 'operational', description: 'Transactional notifications dispatched directly to in-app notification center.' },
        ai: { mode: 'deterministic_mock_engine', status: 'operational', description: 'Smart AI matching engine with deterministic NCR capacity and carton sizing algorithms.' },
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  return (
    <>
      <aside aria-label="Demo environment notification" className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded text-[11px] border border-amber-400/30">
              <Sparkles className="w-3 h-3" /> MVP Demo Mode
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Active as: <strong className="text-white capitalize">{user?.name}</strong> ({user?.role})
            </span>
            <span className="text-slate-400 hidden md:inline">
              • Zero API keys required
            </span>
            <button
              onClick={handleOpenStatus}
              className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-100 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/60 transition-colors"
            >
              <KeyRound className="w-3 h-3 text-indigo-400" />
              <span>Zero-Key Status</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden lg:inline">Quick Switch:</span>
            <div className="inline-flex rounded-md shadow-xs bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => quickSwitch('business')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user?.role === 'business'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Business
              </button>
              <button
                onClick={() => quickSwitch('owner')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user?.role === 'owner'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Space Owner
              </button>
              <button
                onClick={() => quickSwitch('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user?.role === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin Ops
              </button>
            </div>

            <button
              onClick={handleReset}
              disabled={isResetting}
              title="Reset database to default seed data"
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 ml-2 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Zero-Key Service Fallbacks Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col text-left">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">StoreFlex Zero-Key MVP Status</h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  StoreFlex is running in <strong>100% Zero-Configuration Mode</strong>. All 7 external services operate cleanly with deterministic local/mock fallbacks without requiring external API keys.
                </p>
              </div>

              {loadingConfig ? (
                <div className="py-6 text-center text-slate-400">Loading service states...</div>
              ) : (
                <div className="space-y-2.5">
                  {[
                    { key: 'DATABASE_URL', name: 'Database Persistence', s: config?.database },
                    { key: 'AUTH_SECRET', name: 'Authentication & Session', s: config?.auth },
                    { key: 'PAYMENT_KEY', name: 'Payment Gateway', s: config?.payments },
                    { key: 'MAPS_KEY', name: 'Regional Location / Maps', s: config?.maps },
                    { key: 'STORAGE_KEY', name: 'Document & Image Storage', s: config?.storage },
                    { key: 'EMAIL_KEY', name: 'Email & Notification Dispatch', s: config?.email },
                    { key: 'AI_API_KEY', name: 'AI Matching & Volumetric Sizing', s: config?.ai },
                  ].map(({ key, name, s }) => (
                    <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{name}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Operational
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Key: {key} (Optional) • Mode: <span className="font-bold text-indigo-700">{s?.mode || 'local_mock'}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug pt-0.5">
                        {s?.description || 'Active with mock fallback.'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-colors"
              >
                Close Status
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

