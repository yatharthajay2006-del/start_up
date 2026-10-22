import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Payout, Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MonthlyEarningsBarChart } from '../../components/charts/InteractiveCharts';
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  Percent,
  Download,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const OwnerEarningsPage: React.FC = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);

    Promise.all([
      api.getPayouts(user.id),
      api.getBookings({ ownerId: user.id }),
    ])
      .then(([pRes, bRes]) => {
        setPayouts(pRes.payouts || []);
        setBookings(bRes.bookings || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const totalGrossRevenue = bookings.reduce((sum, b) => sum + b.totalStorageAmount, 0);
  const totalCommissionDeducted = bookings.reduce((sum, b) => sum + b.platformFee, 0);
  const totalNetPayout = bookings.reduce((sum, b) => sum + b.ownerNetPayout, 0);
  const pendingPayout = payouts.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.netPayout, 0);

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Financial Settlement
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Earnings & Monthly Payouts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent commission accounting, rental remittances, and direct bank settlement records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Beneficiary:</span>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
            HDFC Bank •••• 9821
          </span>
        </div>
      </div>

      {/* Financial Split Summary Cards (#23) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Gross Revenue</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{totalGrossRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500">Customer booking volume</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Platform Commission (20%)</span>
          <p className="text-2xl font-black text-rose-600 mt-1">-₹{totalCommissionDeducted.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500">StoreFlex marketplace fee</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Net Owner Payout</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalNetPayout.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500">Payable after commission</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Settlement</span>
          <p className="text-2xl font-black text-amber-600 mt-1">₹{pendingPayout.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500">Processing on 1st of month</span>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Monthly Earnings vs Platform Commission</h3>
          <p className="text-[11px] text-slate-500">Gross revenue vs net disbursable funds over time</p>
        </div>
        <MonthlyEarningsBarChart />
      </div>

      {/* Payout Records Table (#23) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Disbursed & Pending Payout Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Payout Ref</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Facility Name</th>
                <th className="py-3 px-4 text-right">Gross Rent</th>
                <th className="py-3 px-4 text-right">Commission</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
                <th className="py-3 px-4">Account Target</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map(po => (
                <tr key={po.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {po.payoutNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indigo-600">
                    {po.bookingNumber}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {po.propertyName}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600">
                    ₹{po.totalRevenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-600">
                    -₹{po.commissionDeducted.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-700 text-sm">
                    ₹{po.netPayout.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {po.bankAccountMasked || 'HDFC Bank •••• 9821'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={po.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
