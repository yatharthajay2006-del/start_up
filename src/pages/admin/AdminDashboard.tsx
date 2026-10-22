import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatCard } from '../../components/common/StatCard';
import { OccupancyTrendChart, MonthlyEarningsBarChart } from '../../components/charts/InteractiveCharts';
import {
  Users,
  Building2,
  CalendarCheck,
  Warehouse,
  TrendingUp,
  Percent,
  ShieldAlert,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminStats();
      setStats(res.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-700/50">
            StoreFlex Operations Headquarters
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Marketplace Control Center
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
            Live pan-NCR property audit queue, capacity supply/demand metrics, platform take-rate revenue, and dispute moderation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/properties')}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Clock className="w-4 h-4" />
            Verification Queue ({stats?.pendingVerification || 0})
          </button>
        </div>
      </div>

      {/* 12 Core Operations Metrics (#25) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Businesses"
          value={stats?.totalBusinesses || 0}
          subtitle="Active merchants"
          icon={Users}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Space Hosts"
          value={stats?.totalOwners || 0}
          subtitle="Property owners"
          icon={Building2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Properties"
          value={`${stats?.verifiedProperties || 0} / ${stats?.totalProperties || 0}`}
          subtitle="Verified vs total"
          icon={Building2}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Leases"
          value={stats?.activeBookings || 0}
          subtitle="Contracted units"
          icon={CalendarCheck}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Capacity"
          value={`${(stats?.totalCapacity || 0).toLocaleString('en-IN')} sq ft`}
          subtitle="Network footprint"
          icon={Warehouse}
          iconBgColor="bg-slate-50"
          iconColor="text-slate-700"
        />
        <StatCard
          title="Occupancy"
          value={`${stats?.occupancyRate || 0}%`}
          subtitle="Capacity utilization"
          icon={Percent}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Financial Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Platform GMV</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            ₹{(stats?.gmv || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500">Gross transaction volume</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Platform Revenue (Commission)</span>
          <p className="text-2xl font-black text-purple-700 mt-1">
            ₹{(stats?.platformRevenue || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500">Net StoreFlex revenue</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Pending Audits</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {stats?.pendingVerification || 0} Facilities
          </p>
          <span className="text-[10px] text-slate-500">Awaiting field audit</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Open Disputes</span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {stats?.openDisputes || 0} Tickets
          </p>
          <span className="text-[10px] text-slate-500">Requires resolution</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Platform Occupancy Across Cities</h3>
              <p className="text-[11px] text-slate-500">Aggregate capacity utilization rate</p>
            </div>
            <button
              onClick={() => onNavigate('/admin/analytics')}
              className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1"
            >
              Demand Insights <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <OccupancyTrendChart color="#9333ea" />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Gross Marketplace Volume vs Commission</h3>
              <p className="text-[11px] text-slate-500">20% commission retention</p>
            </div>
            <button
              onClick={() => onNavigate('/admin/settings/commission')}
              className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1"
            >
              Commission Settings <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <MonthlyEarningsBarChart />
        </div>
      </div>

      {/* Quick Nav Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <button
          onClick={() => onNavigate('/admin/properties')}
          className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs text-left space-y-1 transition-colors"
        >
          <span className="font-bold text-slate-900 block text-sm">Property Verification</span>
          <p className="text-slate-500">Review KYC docs, approve or reject host listings.</p>
        </button>

        <button
          onClick={() => onNavigate('/admin/users')}
          className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs text-left space-y-1 transition-colors"
        >
          <span className="font-bold text-slate-900 block text-sm">User & KYC Audits</span>
          <p className="text-slate-500">Activate or suspend accounts and verify business identities.</p>
        </button>

        <button
          onClick={() => onNavigate('/admin/disputes')}
          className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs text-left space-y-1 transition-colors"
        >
          <span className="font-bold text-slate-900 block text-sm">Dispute Resolutions</span>
          <p className="text-slate-500">Arbitrate access issues, damage, and security deposit returns.</p>
        </button>

        <button
          onClick={() => onNavigate('/admin/settings/commission')}
          className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-2xs text-left space-y-1 transition-colors"
        >
          <span className="font-bold text-slate-900 block text-sm">Take-Rate Settings</span>
          <p className="text-slate-500">Adjust dynamic platform commission % and minimum fees.</p>
        </button>
      </div>
    </div>
  );
};
