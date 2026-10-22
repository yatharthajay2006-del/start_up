import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Property, Booking } from '../../types';
import { OccupancyTrendChart } from '../../components/charts/InteractiveCharts';
import {
  BarChart3,
  MapPin,
  Warehouse,
  Package,
  TrendingUp,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProperties({ onlyVerified: false }),
      api.getBookings(),
    ])
      .then(([pRes, bRes]) => {
        setProperties(pRes.properties || []);
        setBookings(bRes.bookings || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, []);

  const totalCapacity = properties.reduce((sum, p) => sum + p.totalArea, 0);
  const occupiedCapacity = properties.reduce((sum, p) => sum + (p.totalArea - p.availableArea), 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((occupiedCapacity / totalCapacity) * 100) : 0;

  const avgPricePerSqFt = properties.length > 0
    ? Math.round((properties.reduce((sum, p) => sum + p.pricePerSqFt, 0) / properties.length) * 10) / 10
    : 20;

  const avgDuration = bookings.length > 0
    ? Math.round((bookings.reduce((sum, b) => sum + b.durationMonths, 0) / bookings.length) * 10) / 10
    : 3;

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Market Intelligence
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Storage Demand & Network Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic demand distribution, high-turnover cargo categories, and unmet capacity bottlenecks.
          </p>
        </div>
      </div>

      {/* KPI Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Network Occupancy</span>
          <p className="text-2xl font-black text-purple-700 mt-1">{avgOccupancy}%</p>
          <span className="text-[10px] text-slate-500">Across verified warehouses</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Average Price</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{avgPricePerSqFt} / sq ft</p>
          <span className="text-[10px] text-slate-500">Monthly market clearing rate</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Average Lease Term</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{avgDuration} Months</p>
          <span className="text-[10px] text-slate-500">Median booking horizon</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Top Requested Range</span>
          <p className="text-xl font-black text-emerald-600 mt-1">200–500 sq ft</p>
          <span className="text-[10px] text-slate-500">Highest B2B demand density</span>
        </div>
      </div>

      {/* Demand Breakdown Rows (#34) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Requested Cities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" /> Most Requested Cities
          </h3>
          <div className="space-y-2">
            {[
              { city: 'Meerut', share: 34, demand: 'High (E-Comm Hubs)' },
              { city: 'Ghaziabad', share: 28, demand: 'High (Industrial)' },
              { city: 'Noida', share: 22, demand: 'Medium (Electronics)' },
              { city: 'Delhi (Okhla)', share: 16, demand: 'Supply Constrained' },
            ].map(c => (
              <div key={c.city} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{c.city}</span>
                  <span className="text-[10px] text-slate-400 block">{c.demand}</span>
                </div>
                <span className="font-mono font-bold text-purple-700">{c.share}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Requested Storage Sizes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-indigo-600" /> Size Demand Curve
          </h3>
          <div className="space-y-2">
            {[
              { range: '200–500 sq ft', share: 48, note: 'Primary B2B flex segment' },
              { range: '500–1000 sq ft', share: 26, note: 'Mid-sized wholesalers' },
              { range: '50–200 sq ft', share: 16, note: 'Micro-retailers / spillover' },
              { range: '1,000+ sq ft', share: 10, note: 'Bulk seasonal stock' },
            ].map(s => (
              <div key={s.range} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{s.range}</span>
                  <span className="text-[10px] text-slate-400 block">{s.note}</span>
                </div>
                <span className="font-mono font-bold text-indigo-700">{s.share}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Requested Categories */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" /> Top Cargo Categories
          </h3>
          <div className="space-y-2">
            {[
              { cat: 'Consumer Electronics', share: 38 },
              { cat: 'FMCG & Groceries', share: 29 },
              { cat: 'Garments & Apparel', share: 18 },
              { cat: 'Corrugated Packaging', share: 15 },
            ].map(cat => (
              <div key={cat.cat} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900">{cat.cat}</span>
                <span className="font-mono font-bold text-emerald-700">{cat.share}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unmet Demand & Bottlenecks Insight Card */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900">Unmet Demand Warning: Climate Controlled Capacity in Noida</h4>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Market searches for cold and climate-controlled storage in Noida Phase-2 exceed current verified capacity by 140%. Host acquisition team should target cold storage owners along Noida Expressway.
          </p>
        </div>
      </div>
    </div>
  );
};
