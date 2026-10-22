import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { LogisticsOrder, Booking } from '../../types';
import { calculateLogisticsQuote } from '../../utils/pricing';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Truck,
  Plus,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Package,
  ArrowRight,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';

export const LogisticsPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);

  // Form inputs
  const [pickupAddress, setPickupAddress] = useState<string>('Shop 14, Sadar Bazar, Meerut, UP');
  const [dropAddress, setDropAddress] = useState<string>('Meerut Central Logistics Hub, Unit MER-04-B17');
  const [inventoryDetails, setInventoryDetails] = useState<string>('40 Cartons of Consumer Electronics');
  const [itemCount, setItemCount] = useState<number>(40);
  const [vehicleType, setVehicleType] = useState<'E-Loader' | 'Tata Ace' | 'Bolero Maxi Truck' | '14ft Canter'>('Tata Ace');
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState<number>(14);
  const [preferredDate, setPreferredDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('10:00 AM - 1:00 PM');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) return;
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [logRes, bRes] = await Promise.all([
        api.getLogistics(user?.id),
        api.getBookings({ businessId: user?.id }),
      ]);
      setOrders(logRes.orders || []);
      setBookings(bRes.bookings || []);
      if (bRes.bookings && bRes.bookings.length > 0) {
        setDropAddress(`${bRes.bookings[0].propertyName}, Unit ${bRes.bookings[0].unitCode}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const quote = calculateLogisticsQuote(vehicleType, estimatedDistanceKm, itemCount);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      await api.createLogisticsOrder({
        businessId: user.id,
        businessName: user.companyName || user.name,
        businessPhone: user.phone,
        pickupAddress,
        dropAddress,
        inventoryDetails,
        itemCount,
        vehicleType,
        estimatedDistanceKm,
        preferredDate,
        preferredTimeSlot,
      });

      setShowRequestModal(false);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
            StoreFlex First-Mile & Last-Mile
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Logistics & Transport
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Doorstep inventory pickup and warehouse transfer with transparent fixed km rates and verified commercial tempo drivers.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Request Pickup / Delivery
        </button>
      </div>

      {/* Fleet Showcase Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {[
          { type: 'E-Loader', cap: 'Up to 100 cartons', fare: '₹450 base + ₹18/km' },
          { type: 'Tata Ace', cap: 'Up to 250 cartons (750kg)', fare: '₹750 base + ₹26/km' },
          { type: 'Bolero Maxi Truck', cap: 'Up to 500 cartons (1.2T)', fare: '₹1,200 base + ₹34/km' },
          { type: '14ft Canter', cap: 'Up to 1,200 cartons (3.5T)', fare: '₹2,200 base + ₹48/km' },
        ].map(fleet => (
          <div key={fleet.type} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">{fleet.type}</span>
            <span className="text-[11px] text-slate-500 block">{fleet.cap}</span>
            <span className="text-[10px] font-semibold text-indigo-600 block pt-1">{fleet.fare}</span>
          </div>
        ))}
      </div>

      {/* Orders List (#18) */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Truck className="w-4 h-4 text-indigo-600" /> Active & Past Logistics Dispatches ({orders.length})
        </h3>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading logistics dispatches...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
            <Truck className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No logistics requests yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Need stock moved from your shop to your storage bay? Book an on-demand commercial vehicle anytime.
            </p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
            >
              Request First Pickup
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {order.orderNumber}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{order.estimatedCost.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">PICKUP ADDRESS</span>
                      <p className="font-medium text-slate-800">{order.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">DROP LOCATION</span>
                      <p className="font-medium text-slate-800">{order.dropAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vehicle</span>
                    <strong className="text-slate-800">{order.vehicleType}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cargo</span>
                    <strong className="text-slate-800">{order.itemCount} Units</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date & Slot</span>
                    <strong className="text-slate-800">{order.preferredDate}</strong>
                  </div>
                </div>

                {order.driverName && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Driver: <strong>{order.driverName}</strong></span>
                    </div>
                    {order.driverPhone && (
                      <span className="font-mono text-emerald-700 flex items-center gap-1 font-bold">
                        <Phone className="w-3 h-3" /> {order.driverPhone}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Pickup Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" /> Book Doorstep Inventory Transport
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pickup Address (Shop / Factory)</label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Storage Unit</label>
                <input
                  type="text"
                  required
                  value={dropAddress}
                  onChange={(e) => setDropAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e: any) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="E-Loader">E-Loader (Small)</option>
                    <option value="Tata Ace">Tata Ace (Popular)</option>
                    <option value="Bolero Maxi Truck">Bolero Maxi Truck</option>
                    <option value="14ft Canter">14ft Canter (Bulk)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Distance (KM)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={estimatedDistanceKm}
                    onChange={(e) => setEstimatedDistanceKm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Carton Count</label>
                  <input
                    type="number"
                    min="1"
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cargo Description</label>
                <input
                  type="text"
                  value={inventoryDetails}
                  onChange={(e) => setInventoryDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Instant Quote Calculation Breakdown (#18) */}
              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs space-y-1.5 text-indigo-950">
                <span className="font-bold text-[11px] uppercase tracking-wider text-indigo-700">Calculated Transport Quote</span>
                <div className="flex justify-between text-[11px]">
                  <span>Base Vehicle Fare:</span>
                  <span>₹{quote.baseFare}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Distance Fare ({quote.distanceKm} km × ₹{quote.distanceFare / quote.distanceKm}/km):</span>
                  <span>₹{quote.distanceFare}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Handling & Loading Allowance ({quote.itemCount} items):</span>
                  <span>₹{quote.handlingFee}</span>
                </div>
                <div className="pt-1.5 border-t border-indigo-200 flex justify-between font-bold text-sm text-indigo-900">
                  <span>Total Estimated Fare:</span>
                  <span className="text-base text-indigo-700">₹{quote.totalFare.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'Requesting...' : 'Confirm Logistics Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
