import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Payment, Invoice } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  CreditCard,
  Download,
  FileText,
  Printer,
  Sparkles,
  CheckCircle,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setIsLoading(true);
    Promise.all([
      api.getPayments(user.id),
      api.getInvoices(user.id),
    ])
      .then(([pRes, invRes]) => {
        setPayments(pRes.payments || []);
        setInvoices(invRes.invoices || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
            Billing & Compliance
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Payments & Tax Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View transaction receipts, GST tax invoices, refundable deposits, and monthly rental statements.
          </p>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo Mock Gateway active for instant testing.</span>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Paid Storage Volume</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Tax Invoices</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{invoices.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Refundable Deposits Held</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            ₹{invoices.reduce((sum, inv) => sum + inv.depositAmount, 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Invoices List (#17) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" /> Issued Tax Invoices
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Facility & Area</th>
                <th className="py-3 px-4">Issued Date</th>
                <th className="py-3 px-4 text-right">Base Storage</th>
                <th className="py-3 px-4 text-right">Total (Incl GST & Deposit)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">Loading invoices...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">No invoices generated yet.</td>
                </tr>
              ) : (
                invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {inv.bookingNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{inv.propertyName}</span>
                      <span className="text-[10px] text-slate-400">{inv.storageAreaSqFt} sq ft • {inv.durationMonths} mo</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(inv.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      ₹{inv.baseStorageAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] flex items-center gap-1 mx-auto transition-colors"
                      >
                        <FileText className="w-3 h-3 text-indigo-600" /> View & Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Transactions Log (#17) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Transactions
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-700">
                    {p.transactionRef}
                  </td>
                  <td className="py-3 px-4 font-mono text-indigo-600">
                    {p.bookingNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {p.paymentMethod} {p.isMock && '(Demo)'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Tax Invoice: {selectedInvoice.invoiceNumber}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-black text-slate-900">StoreFlex Platform Pvt Ltd</h2>
                  <p className="text-[11px] text-slate-500">GSTIN: 07AABCS1429M1ZQ • Delhi NCR</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                  <p className="font-bold text-emerald-600 text-sm">{selectedInvoice.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Billed To</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedInvoice.businessName}</p>
                  <p className="text-[11px] text-slate-500">GSTIN: {selectedInvoice.businessGstin || '07AAAAA0000A1Z5'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Facility Service</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedInvoice.propertyName}</p>
                  <p className="text-[11px] text-slate-500">{selectedInvoice.storageAreaSqFt} sq ft for {selectedInvoice.durationMonths} months</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span>Base Warehouse Rent ({selectedInvoice.durationMonths} Months):</span>
                  <span className="font-semibold text-slate-900">₹{selectedInvoice.baseStorageAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>StoreFlex Platform Fee (20%):</span>
                  <span className="font-semibold text-slate-900">₹{selectedInvoice.platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-semibold text-slate-900">₹{selectedInvoice.depositAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% on platform facilitation):</span>
                  <span className="font-semibold text-slate-900">₹{selectedInvoice.taxGst.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-indigo-600">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 text-center">
                This is a computer-generated tax invoice issued in accordance with GST Rule 46.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
