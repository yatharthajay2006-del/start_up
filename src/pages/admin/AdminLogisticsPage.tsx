import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { LogisticsOrder, LogisticsStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  User,
  CheckCircle,
  X,
} from 'lucide-react';

export const AdminLogisticsPage: React.FC = () => {
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<LogisticsOrder | null>(null);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [newStatus, setNewStatus] = useState<LogisticsStatus>('Assigned');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.getLogistics();
      setOrders(res.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      await api.updateLogisticsOrder(editingOrder.id, {
        status: newStatus,
        driverName: driverName || editingOrder.driverName,
        driverPhone: driverPhone || editingOrder.driverPhone,
      });

      setEditingOrder(null);
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Fleet Operations
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Logistics & Transport Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage commercial vehicle pickup requests, assign tempo drivers, and update first-mile delivery statuses.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Business Merchant</th>
                <th className="py-3 px-4">Vehicle & Cargo</th>
                <th className="py-3 px-4">Pickup & Drop</th>
                <th className="py-3 px-4 text-right">Fare (₹)</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">No logistics orders placed.</td>
                </tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {o.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{o.businessName}</span>
                      <span className="text-[10px] text-slate-400">{o.businessPhone}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{o.vehicleType}</span>
                      <span className="text-[10px] text-slate-500">{o.itemCount} items • {o.estimatedDistanceKm} km</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">From: {o.pickupAddress}</span>
                      <span className="text-[10px] text-slate-700 block truncate max-w-[150px] font-medium">To: {o.dropAddress}</span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ₹{o.estimatedCost.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {o.driverName ? (
                        <div>
                          <span className="font-bold text-slate-800 block">{o.driverName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{o.driverPhone}</span>
                        </div>
                      ) : (
                        <span className="text-amber-600 text-[11px] font-medium">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={o.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setEditingOrder(o);
                          setDriverName(o.driverName || 'Suresh Yadav (Tata Ace)');
                          setDriverPhone(o.driverPhone || '+91 98912 33445');
                          setNewStatus(o.status);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-[11px] transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Assign Driver & Update Tracking</h3>
              <button onClick={() => setEditingOrder(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Requested">Requested</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Driver Name & Vehicle Reg</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Driver Phone Number</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
