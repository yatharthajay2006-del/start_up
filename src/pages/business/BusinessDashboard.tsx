import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Booking, InventoryItem, Payment, Invoice } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QRCodeView } from '../../components/common/QRCodeView';
import { DigitalAgreementModal } from '../../components/storage/DigitalAgreementModal';
import {
  Warehouse,
  Boxes,
  CreditCard,
  Calendar,
  AlertTriangle,
  Search,
  Plus,
  Truck,
  Download,
  QrCode,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface BusinessDashboardProps {
  onNavigate: (path: string) => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedUnitForQr, setSelectedUnitForQr] = useState<Booking | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<any | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);

    Promise.all([
      api.getBookings({ businessId: user.id }),
      api.getInventory(user.id),
      api.getPayments(user.id),
      api.getInvoices(user.id),
    ])
      .then(([bRes, iRes, pRes, invRes]) => {
        setBookings(bRes.bookings || []);
        setInventory(iRes.items || []);
        setPayments(pRes.payments || []);
        setInvoices(invRes.invoices || []);
      })
      .catch((err) => console.error('Dashboard data load error:', err))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const activeBookings = bookings.filter((b) => b.status === 'Active' || b.status === 'Confirmed');
  const totalSpaceUsed = activeBookings.reduce((sum, b) => sum + b.areaSqFt, 0);
  const monthlyCost = activeBookings.reduce((sum, b) => sum + b.monthlyRate * b.areaSqFt, 0);
  const totalUnits = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const lowStockItems = inventory.filter((i) => i.lowStockThreshold && i.quantity <= i.lowStockThreshold);

  const nearestExpiry = activeBookings[0] ? new Date(activeBookings[0].endDate).toLocaleDateString() : 'None';

  const handleViewAgreement = async (bookingId: string) => {
    try {
      const res = await api.getBookingById(bookingId);
      if (res.agreement) {
        setSelectedAgreement(res.agreement);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Search CTA */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-700/50">
            {user?.companyName || 'Business Portal'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {user?.name || 'Partner'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Manage your on-demand storage units, track warehouse stock movements, and book additional flexible capacity across Delhi NCR.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('/business/storage')}
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              Find More Storage
            </button>
            <button
              onClick={() => onNavigate('/business/storage-calculator')}
              className="px-4 py-2 bg-indigo-700/80 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl border border-indigo-500/50 transition-colors flex items-center gap-1.5"
            >
              Storage Calculator
            </button>
          </div>
        </div>

        {/* Ambient background warehouse graphic */}
        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none hidden sm:block">
          <Warehouse className="w-56 h-56" />
        </div>
      </div>

      {/* 5 KPI Stat Cards (#9) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Active Storage"
          value={`${activeBookings.length} Hub${activeBookings.length === 1 ? '' : 's'}`}
          subtitle="Contracted units"
          icon={Warehouse}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Total Space Used"
          value={`${totalSpaceUsed.toLocaleString('en-IN')} sq ft`}
          subtitle="Usable floor space"
          icon={Boxes}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Monthly Cost"
          value={`₹${monthlyCost.toLocaleString('en-IN')}`}
          subtitle="Base rent per month"
          icon={CreditCard}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Inventory Items"
          value={`${inventory.length} SKUs`}
          subtitle={`${totalUnits} total units`}
          icon={Boxes}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Upcoming Expiry"
          value={nearestExpiry}
          subtitle="Earliest renewal date"
          icon={Calendar}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Quick Actions Bar (#9) */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <button
            onClick={() => onNavigate('/business/storage')}
            className="p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-indigo-600" />
            Find Storage
          </button>
          <button
            onClick={() => onNavigate('/business/inventory')}
            className="p-3 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            Add Inventory
          </button>
          <button
            onClick={() => onNavigate('/business/logistics')}
            className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:text-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-blue-600" />
            Arrange Pickup
          </button>
          <button
            onClick={() => onNavigate('/business/payments')}
            className="p-3 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:text-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-purple-600" />
            View Payments
          </button>
          <button
            onClick={() => onNavigate('/business/payments')}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2 col-span-2 sm:col-span-1"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Download Invoices
          </button>
        </div>
      </div>

      {/* Main Section: My Storage & Inventory Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Storage Units */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-indigo-600" /> My Contracted Storage
            </h3>
            <button
              onClick={() => onNavigate('/business/storage')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Browse More <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <Warehouse className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Active Storage Units Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Discover verified warehousing in Meerut, Ghaziabad, Noida, and Delhi with flexible 1-month lock-in.
              </p>
              <button
                onClick={() => onNavigate('/business/storage')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-xs"
              >
                Find Storage Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                          {b.unitCode}
                        </span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mt-1.5">{b.propertyName}</h4>
                      <p className="text-xs text-slate-500">{b.propertyAddress}, {b.propertyCity}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</span>
                      <p className="text-base font-extrabold text-slate-900">
                        ₹{(b.monthlyRate * b.areaSqFt).toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-slate-400">₹{b.monthlyRate}/sq ft</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Allocated Area</span>
                      <strong className="text-slate-800">{b.areaSqFt} Sq Ft</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Duration</span>
                      <strong className="text-slate-800">{b.durationMonths} Months</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Expires</span>
                      <strong className="text-slate-800">{new Date(b.endDate).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => setSelectedUnitForQr(b)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                      Digital Gate Pass & QR
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewAgreement(b.id)}
                        className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Agreement
                      </button>
                      <button
                        onClick={() => onNavigate('/business/inventory')}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        Manage Stock
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Inventory Summary & Alerts (#9) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-600" /> Inventory Summary
            </h3>
            <button
              onClick={() => onNavigate('/business/inventory')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Full Inventory <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            {/* Counts summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total SKUs</span>
                <p className="text-xl font-black text-slate-900">{inventory.length}</p>
                <span className="text-[10px] text-slate-500">Active product catalog</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Units</span>
                <p className="text-xl font-black text-indigo-600">{totalUnits.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-slate-500">Cartons, boxes & bales</span>
              </div>
            </div>

            {/* Low stock warning */}
            {lowStockItems.length > 0 && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Low Stock Alert ({lowStockItems.length} SKU)</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  {lowStockItems[0].productName} has only {lowStockItems[0].quantity} {lowStockItems[0].unit} left in storage.
                </p>
              </div>
            )}

            {/* Recent SKUs list */}
            <div className="space-y-2 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Storage Bay Stocks</p>
              {inventory.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-500">{item.sku}</span>
                    <p className="font-bold text-slate-900 line-clamp-1">{item.productName}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-slate-900">{item.quantity} {item.unit}</p>
                    <span className="text-[10px] text-slate-400">₹{item.totalValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('/business/inventory')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Add / Inward New Stock
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {selectedUnitForQr && (
        <QRCodeView
          unitCode={selectedUnitForQr.unitCode}
          propertyName={selectedUnitForQr.propertyName}
          areaSqFt={selectedUnitForQr.areaSqFt}
          inventory={inventory}
          onClose={() => setSelectedUnitForQr(null)}
        />
      )}

      {/* Agreement Modal */}
      {selectedAgreement && (
        <DigitalAgreementModal
          agreement={selectedAgreement}
          onClose={() => setSelectedAgreement(null)}
        />
      )}
    </div>
  );
};
