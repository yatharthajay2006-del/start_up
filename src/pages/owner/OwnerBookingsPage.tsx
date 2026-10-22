import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CalendarCheck,
  Building,
  User as UserIcon,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Warehouse,
} from 'lucide-react';

export const OwnerBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    loadBookings();
  }, [user?.id]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBookings({ ownerId: user?.id });
      setBookings(res.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Tenant Management
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Storage Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View active reservations, tenant business profiles, allocated units, and net payout terms.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Business Tenant</th>
                <th className="py-3 px-4">Facility & Unit</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Gross Rent</th>
                <th className="py-3 px-4 text-right">Commission</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">No bookings received yet.</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {b.bookingNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{b.businessName}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {b.businessEmail}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{b.propertyName}</span>
                      <span className="font-mono text-[10px] text-slate-500">Unit: {b.unitCode} ({b.areaSqFt} sq ft)</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="font-semibold text-slate-800 block">{b.durationMonths} Months</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-600">
                      ₹{b.totalStorageAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-right text-rose-600 font-medium">
                      -₹{b.platformFee.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700 text-sm">
                      ₹{b.ownerNetPayout.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
