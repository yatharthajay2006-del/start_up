import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Property, Booking, Payout } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { OccupancyTrendChart, DonutUtilizationChart } from '../../components/charts/InteractiveCharts';
import {
  Building2,
  Boxes,
  TrendingUp,
  Percent,
  CalendarCheck,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
  Warehouse,
} from 'lucide-react';

interface OwnerDashboardProps {
  onNavigate: (path: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);

    Promise.all([
      api.getProperties({ onlyVerified: false }),
      api.getBookings({ ownerId: user.id }),
      api.getPayouts(user.id),
    ])
      .then(([pRes, bRes, poRes]) => {
        // filter properties belonging to this owner
        const ownerProps = pRes.properties.filter(p => p.ownerId === user.id);
        setProperties(ownerProps);
        setBookings(bRes.bookings || []);
        setPayouts(poRes.payouts || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const totalCapacity = properties.reduce((sum, p) => sum + p.totalArea, 0);
  const availableSpace = properties.reduce((sum, p) => sum + p.availableArea, 0);
  const occupiedSpace = Math.max(0, totalCapacity - availableSpace);
  const occupancyPercent = totalCapacity > 0 ? Math.round((occupiedSpace / totalCapacity) * 100) : 0;
  const monthlyEarnings = bookings
    .filter(b => b.status === 'Active' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.ownerNetPayout, 0);

  const pendingProperties = properties.filter(p => p.verificationStatus === 'pending' || p.verificationStatus === 'under_review').length;

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-700/50">
            Warehouse Host Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Owner'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Track real-time bay utilization, review tenant bookings, and monitor verified commercial listings.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/owner/properties/new')}
          className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          List New Property
        </button>
      </div>

      {/* 6 Key Stat Cards (#19) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Properties"
          value={properties.length}
          subtitle="Listed facilities"
          icon={Building2}
          iconBgColor="bg-slate-50"
          iconColor="text-slate-700"
        />
        <StatCard
          title="Total Capacity"
          value={`${totalCapacity.toLocaleString('en-IN')} sq ft`}
          subtitle="Gross area"
          icon={Warehouse}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Occupied Space"
          value={`${occupiedSpace.toLocaleString('en-IN')} sq ft`}
          subtitle="Earning revenue"
          icon={Boxes}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Available Space"
          value={`${availableSpace.toLocaleString('en-IN')} sq ft`}
          subtitle="Ready to book"
          icon={Boxes}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyPercent}%`}
          subtitle="Capacity utilization"
          icon={Percent}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Net Earnings"
          value={`₹${monthlyEarnings.toLocaleString('en-IN')}`}
          subtitle="Active contract payouts"
          icon={TrendingUp}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Analytics & Donut Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Occupancy Trend */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Occupancy Trend (% Capacity Used)</h3>
              <p className="text-[11px] text-slate-500">Trailing 6-month historical utilization</p>
            </div>
            <button
              onClick={() => onNavigate('/owner/analytics')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <OccupancyTrendChart color="#059669" />
        </div>

        {/* Right: Real-time Space Utilization Donut */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Current Capacity Split</h3>
            <p className="text-[11px] text-slate-500">Live occupied vs available floor space</p>
          </div>
          <DonutUtilizationChart occupiedSqFt={occupiedSpace} totalSqFt={totalCapacity} />
        </div>
      </div>

      {/* Properties & Bookings Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties Overview */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> My Properties ({properties.length})
            </h3>
            <button
              onClick={() => onNavigate('/owner/properties')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              Manage All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {properties.map(p => (
              <div key={p.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{p.name}</h4>
                    <StatusBadge status={p.verificationStatus} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.city} • ₹{p.pricePerSqFt}/sq ft/mo</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Occupancy</span>
                  <p className="font-black text-slate-900 text-sm">
                    {Math.round(((p.totalArea - p.availableArea) / p.totalArea) * 100)}%
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium">{p.availableArea} sq ft left</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tenant Bookings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-indigo-600" /> Tenant Bookings ({bookings.length})
            </h3>
            <button
              onClick={() => onNavigate('/owner/bookings')}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-center py-8 text-slate-400 text-xs">No bookings received yet.</p>
            ) : (
              bookings.slice(0, 3).map(b => (
                <div key={b.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{b.businessName}</span>
                      <span className="text-[10px] font-mono text-indigo-600 ml-2">{b.bookingNumber}</span>
                    </div>
                    <StatusBadge status={b.status} size="sm" />
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>{b.areaSqFt} sq ft • {b.durationMonths} months</span>
                    <span className="font-bold text-emerald-700">Net: ₹{b.ownerNetPayout.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
