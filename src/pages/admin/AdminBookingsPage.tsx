import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DigitalAgreementModal } from '../../components/storage/DigitalAgreementModal';
import {
  CalendarCheck,
  Search,
  FileText,
  Warehouse,
  User,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAgreement, setSelectedAgreement] = useState<any | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const res = await api.getBookings();
      setBookings(res.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInspectAgreement = async (bookingId: string) => {
    try {
      const res = await api.getBookingById(bookingId);
      if (res.agreement) setSelectedAgreement(res.agreement);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Admin action: cancel this booking and release storage capacity back to property?')) {
      await api.cancelBooking(bookingId);
      loadBookings();
    }
  };

  const filtered = bookings.filter(b => {
    if (statusFilter === 'All') return true;
    return b.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Booking Master Registry
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            All Storage Leases & Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit contracted capacity, inspect executed digital agreements, and oversee capacity releases.
          </p>
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
        >
          <option value="All">All Statuses ({bookings.length})</option>
          <option value="Active">Active</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Tenant Business</th>
                <th className="py-3 px-4">Host / Facility</th>
                <th className="py-3 px-4">Capacity & Rate</th>
                <th className="py-3 px-4">Term</th>
                <th className="py-3 px-4 text-right">GMV (Rent)</th>
                <th className="py-3 px-4 text-right">Commission</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">Loading bookings...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">No bookings found.</td>
                </tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {b.bookingNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{b.businessName}</span>
                      <span className="text-[10px] text-slate-400">{b.businessEmail}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{b.propertyName}</span>
                      <span className="font-mono text-[10px] text-slate-500">Unit: {b.unitCode}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <span className="font-bold text-slate-900 block">{b.areaSqFt} Sq Ft</span>
                      <span className="text-[10px] text-slate-400">₹{b.monthlyRate}/sq ft</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {b.durationMonths} Mo ({new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()})
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      ₹{b.totalStorageAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-purple-700">
                      ₹{b.platformFee.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={b.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleInspectAgreement(b.id)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Inspect Digital Agreement"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {b.status === 'Active' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Cancel Booking & Release Capacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAgreement && (
        <DigitalAgreementModal
          agreement={selectedAgreement}
          onClose={() => setSelectedAgreement(null)}
        />
      )}
    </div>
  );
};
