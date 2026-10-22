import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Property, Booking } from '../../types';
import { OccupancyTrendChart, MonthlyEarningsBarChart, DonutUtilizationChart } from '../../components/charts/InteractiveCharts';
import { BarChart3, TrendingUp, Warehouse, Calendar, Clock } from 'lucide-react';

export const OwnerAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);

    Promise.all([
      api.getProperties({ onlyVerified: false }),
      api.getBookings({ ownerId: user.id }),
    ])
      .then(([pRes, bRes]) => {
        const ownerProps = pRes.properties.filter(p => p.ownerId === user.id);
        setProperties(ownerProps);
        setBookings(bRes.bookings || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const totalCapacity = properties.reduce((sum, p) => sum + p.totalArea, 0);
  const availableSpace = properties.reduce((sum, p) => sum + p.availableArea, 0);
  const occupiedSpace = Math.max(0, totalCapacity - availableSpace);
  const occupancyPercent = totalCapacity > 0 ? Math.round((occupiedSpace / totalCapacity) * 100) : 0;

  const avgDurationMonths = bookings.length > 0
    ? Math.round((bookings.reduce((sum, b) => sum + b.durationMonths, 0) / bookings.length) * 10) / 10
    : 3;

  const avgSqFtPerBooking = bookings.length > 0
    ? Math.round(bookings.reduce((sum, b) => sum + b.areaSqFt, 0) / bookings.length)
    : 250;

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Yield & Performance
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Host Portfolio Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate warehouse fill rates, square-foot revenue yields, and tenant booking durations.
          </p>
        </div>
      </div>

      {/* KPI Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Overall Occupancy</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{occupancyPercent}%</p>
          <span className="text-[10px] text-slate-500">{occupiedSpace.toLocaleString('en-IN')} / {totalCapacity.toLocaleString('en-IN')} sq ft</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Booking Size</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{avgSqFtPerBooking} sq ft</p>
          <span className="text-[10px] text-slate-500">Per tenant agreement</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Lease Length</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{avgDurationMonths} Months</p>
          <span className="text-[10px] text-slate-500">Customer retention rate</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Revenue Yield / Sq Ft</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₹18.4 / mo</p>
          <span className="text-[10px] text-slate-500">Gross across active bays</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Monthly Historical Occupancy (%)</h3>
            <p className="text-[11px] text-slate-500">Trends reflecting festive stocking surges in NCR</p>
          </div>
          <OccupancyTrendChart color="#059669" />
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Current Usable Floor Capacity</h3>
            <p className="text-[11px] text-slate-500">Available vs leased square footage</p>
          </div>
          <DonutUtilizationChart occupiedSqFt={occupiedSpace} totalSqFt={totalCapacity} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Monthly Revenue Yields (Gross vs Net)</h3>
          <p className="text-[11px] text-slate-500">Reflecting 20% platform commission retained by StoreFlex</p>
        </div>
        <MonthlyEarningsBarChart />
      </div>
    </div>
  );
};
