import React, { useState } from 'react';
import { Property, Booking } from '../../types';
import { calculateBookingPrice } from '../../utils/pricing';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  QrCode,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

interface BookingModalProps {
  property: Property;
  initialArea?: number;
  initialDuration?: number;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  property,
  initialArea = 200,
  initialDuration = 3,
  onClose,
  onBookingSuccess,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [areaSqFt, setAreaSqFt] = useState<number>(Math.min(initialArea, property.availableArea));
  const [durationMonths, setDurationMonths] = useState<number>(initialDuration);
  const [productCategory, setProductCategory] = useState<string>(property.allowedCategories[0] || 'General goods');
  const [inventoryDescription, setInventoryDescription] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NetBanking' | 'Debit Card'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Dynamic pricing calculation
  const pricing = calculateBookingPrice({
    areaSqFt: Math.max(10, areaSqFt),
    ratePerSqFtPerMonth: property.pricePerSqFt,
    durationMonths: Math.max(1, durationMonths),
    platformFeePercent: 20,
    minPlatformFee: 500,
    depositMonths: property.depositMonths || 1,
  });

  const handleNext = () => {
    setError(null);
    if (step === 1 && areaSqFt > property.availableArea) {
      setError(`Cannot exceed available capacity of ${property.availableArea} sq ft`);
      return;
    }
    if (step === 1 && areaSqFt < 20) {
      setError('Minimum booking area is 20 sq ft');
      return;
    }
    if (step === 5 && !termsAccepted) {
      setError('Please read and accept the StoreFlex Digital Storage Terms');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleProcessPayment = async () => {
    if (!user) {
      setError('You must be logged in to book storage');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.createBooking({
        businessId: user.id,
        businessName: user.companyName || user.name,
        businessEmail: user.email,
        businessPhone: user.phone,
        propertyId: property.id,
        areaSqFt,
        durationMonths,
        startDate: new Date().toISOString(),
        inventorySummary: `${productCategory}: ${inventoryDescription || 'Commercial storage inventory'}`,
        termsAccepted: true,
      });

      if (res.booking) {
        setConfirmedBooking(res.booking);
        setStep(7); // Jump to confirmation
        onBookingSuccess(res.booking);
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in">
        {/* Header with Steps */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Step {step} of 7
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {step === 1 && 'Select Storage Capacity'}
                {step === 2 && 'Select Booking Duration'}
                {step === 3 && 'Inventory Goods Details'}
                {step === 4 && 'Pricing & Fees Breakdown'}
                {step === 5 && 'StoreFlex Storage Terms'}
                {step === 6 && 'Complete Mock Payment'}
                {step === 7 && 'Booking Confirmed!'}
              </h3>
            </div>
            {step < 7 && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="m-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Area */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{property.name}</p>
                  <p className="text-slate-500">{property.city} • ₹{property.pricePerSqFt}/sq ft/month</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Available Space</span>
                  <p className="font-bold text-emerald-600 text-sm">{property.availableArea} sq ft</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Required Storage Area (Sq Ft)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max={property.availableArea}
                    step="25"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(Number(e.target.value))}
                    className="flex-1 accent-indigo-600"
                  />
                  <div className="w-24">
                    <input
                      type="number"
                      min="20"
                      max={property.availableArea}
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 text-center"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Min: 50 sq ft</span>
                  <span>Max: {property.availableArea} sq ft</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
                <span>Monthly Rent at ₹{property.pricePerSqFt}/sq ft:</span>
                <span className="font-bold text-sm">₹{(areaSqFt * property.pricePerSqFt).toLocaleString('en-IN')}/mo</span>
              </div>
            </div>
          )}

          {/* STEP 2: Duration */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Storage Duration (Months)
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[1, 2, 3, 6].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMonths(m)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        durationMonths === m
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-base font-bold">{m}</p>
                      <p className="text-[10px] text-slate-500">Month{m > 1 ? 's' : ''}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Commencement:</span>
                  <span className="font-semibold text-slate-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Expiry Date:</span>
                  <span className="font-semibold text-slate-900">
                    {(() => {
                      const d = new Date();
                      d.setMonth(d.getMonth() + durationMonths);
                      return d.toLocaleDateString();
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Inventory Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Product Category
                </label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                >
                  {property.allowedCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Only categories permitted by warehouse safety compliance are selectable.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Goods Description & Handling Notes
                </label>
                <textarea
                  rows={3}
                  value={inventoryDescription}
                  onChange={(e) => setInventoryDescription(e.target.value)}
                  placeholder="e.g., 200 cartons of cotton apparel, palletized with plastic wrap."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Pricing Review */}
          {step === 4 && (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between text-slate-600">
                  <span>Storage Rent ({areaSqFt} sq ft × ₹{property.pricePerSqFt} × {durationMonths} mo):</span>
                  <span className="font-medium text-slate-900">₹{pricing.baseStorageCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Fee ({pricing.platformFeePercent}%):</span>
                  <span className="font-medium text-slate-900">₹{pricing.platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Refundable Security Deposit (1 mo):</span>
                  <span className="font-medium text-slate-900">₹{pricing.depositAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST on Platform Services (18%):</span>
                  <span className="font-medium text-slate-900">₹{pricing.taxGst.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Amount Payable:</span>
                  <span className="text-indigo-600 text-base">₹{pricing.totalCustomerPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Owner will receive net ₹{pricing.ownerNetPayout.toLocaleString('en-IN')} after platform commission.
              </p>
            </div>
          )}

          {/* STEP 5: Terms Acceptance */}
          {step === 5 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto space-y-2 text-slate-600 text-[11px] leading-relaxed">
                <p className="font-bold text-slate-800">StoreFlex Standard Storage Lease Terms</p>
                <p>1. The storage space will be utilized only for approved commercial merchandise.</p>
                <p>2. Prohibited goods include hazardous chemicals, inflammable fuels, explosives, and contraband.</p>
                <p>3. Tenant must adhere to facility entry logs, CCTV surveillance rules, and fire protocols.</p>
                <p>4. Security deposit is refundable within 48 hours of vacating the unit in original clean condition.</p>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 accent-indigo-600"
                />
                <span className="text-xs text-slate-800 font-medium">
                  I accept the digital storage terms, facility guidelines, and cancellation policies.
                </span>
              </label>
            </div>
          )}

          {/* STEP 6: Mock Payment */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Razorpay Test Sandbox:</strong> Demo mock payment mode active. No actual bank card will be charged.
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Payment Method</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['UPI', 'NetBanking', 'Debit Card'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2.5 rounded-lg border text-center font-medium transition-colors ${
                        paymentMethod === m
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Total Charge:</span>
                  <span className="text-base font-bold text-slate-900">
                    ₹{pricing.totalCustomerPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Confirmation */}
          {step === 7 && confirmedBooking && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">Storage Booked Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your reservation is active. Capacity allocated at {property.name}.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking ID:</span>
                  <span className="font-mono font-bold text-indigo-600">{confirmedBooking.bookingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allocated Unit:</span>
                  <span className="font-mono font-bold text-slate-800">{confirmedBooking.unitCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage Space:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.areaSqFt} Sq Ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">Active (Paid)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs transition-colors"
              >
                Go to My Storage Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step < 7 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleProcessPayment}
                className="px-6 py-2.5 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {isSubmitting ? 'Authorizing Mock Payment...' : `Pay ₹${pricing.totalCustomerPayable.toLocaleString('en-IN')}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
