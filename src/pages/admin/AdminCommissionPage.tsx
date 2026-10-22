import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CommissionSetting } from '../../types';
import { Percent, Check, Sparkles, ShieldCheck, DollarSign } from 'lucide-react';

export const AdminCommissionPage: React.FC = () => {
  const [commission, setCommission] = useState<CommissionSetting | null>(null);
  const [platformPercent, setPlatformPercent] = useState<number>(20);
  const [minFee, setMinFee] = useState<number>(500);
  const [logisticsPercent, setLogisticsPercent] = useState<number>(10);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.getCommissionSetting();
      if (res.commission) {
        setCommission(res.commission);
        setPlatformPercent(res.commission.platformCommissionPercent);
        setMinFee(res.commission.minPlatformFee);
        setLogisticsPercent(res.commission.logisticsCommissionPercent);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await api.updateCommissionSetting({
        platformCommissionPercent: Number(platformPercent),
        minPlatformFee: Number(minFee),
        logisticsCommissionPercent: Number(logisticsPercent),
      });

      if (res.commission) {
        setCommission(res.commission);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
          <Percent className="w-3.5 h-3.5" /> Marketplace Take-Rate Economics
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Commission & Platform Fees
        </h1>
        <p className="text-xs text-slate-500">
          Configure the StoreFlex revenue take-rate. All subsequent bookings and owner payouts dynamically adapt to these settings without restart.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs">
        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Commission settings saved to database successfully!</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Storage Booking Take-Rate (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="5"
                max="50"
                step="1"
                required
                value={platformPercent}
                onChange={(e) => setPlatformPercent(Number(e.target.value))}
                className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-purple-700"
              />
              <span className="text-slate-500 text-xs">% of gross storage rent deducted from host</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Default: 20%. Example: on a ₹20,000 booking, host receives ₹16,000 and StoreFlex retains ₹4,000.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Minimum Platform Fee per Booking (₹)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="100"
                max="5000"
                step="50"
                required
                value={minFee}
                onChange={(e) => setMinFee(Number(e.target.value))}
                className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900"
              />
              <span className="text-slate-500 text-xs">Floor fee for micro-leases under 100 sq ft</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Logistics Dispatch Commission (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="30"
                step="1"
                required
                value={logisticsPercent}
                onChange={(e) => setLogisticsPercent(Number(e.target.value))}
                className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900"
              />
              <span className="text-slate-500 text-xs">% on transport fare dispatches</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Example Preview */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-slate-600">
          <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Simulated Payout on ₹20,000 Gross Booking:</p>
          <div className="flex justify-between text-xs">
            <span>Customer Total Paid:</span>
            <span className="font-semibold text-slate-800">₹20,000</span>
          </div>
          <div className="flex justify-between text-xs text-purple-700 font-bold">
            <span>StoreFlex Commission ({platformPercent}%):</span>
            <span>₹{Math.max(minFee, (20000 * platformPercent) / 100).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs text-emerald-700 font-bold border-t border-slate-200 pt-1.5">
            <span>Host Net Payout:</span>
            <span>₹{(20000 - Math.max(minFee, (20000 * platformPercent) / 100)).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-xs disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Updating...' : 'Save Commission Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
