import React from 'react';
import { FileText, X, Printer, ShieldCheck } from 'lucide-react';
import { DigitalAgreement } from '../../types';

interface DigitalAgreementModalProps {
  agreement: DigitalAgreement;
  onClose: () => void;
}

export const DigitalAgreementModal: React.FC<DigitalAgreementModalProps> = ({ agreement, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Digital Storage Agreement</h3>
              <p className="text-xs text-slate-500">Ref: {agreement.agreementNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legal Agreement Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto">
          {/* Header Badge */}
          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-2.5 text-indigo-900">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="font-bold">StoreFlex Standard B2B Flexible Storage Contract</p>
              <p className="text-[11px] text-indigo-700">Executed electronically under IT Act, 2000 & Indian Contract Act, 1872</p>
            </div>
          </div>

          {/* Party details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LESSEE / BUSINESS</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{agreement.businessName}</p>
              <p className="text-slate-500 mt-1">GSTIN: {agreement.businessGstin}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LESSOR / HOST</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{agreement.ownerName}</p>
              <p className="text-slate-500 mt-1">Facilitator: StoreFlex Platform Pvt Ltd</p>
            </div>
          </div>

          {/* Premises Details */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Demised Storage Unit</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-slate-600">
              <div>
                <span className="block text-[10px] text-slate-400">Property</span>
                <span className="font-semibold text-slate-800">{agreement.propertyName}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Allocated Area</span>
                <span className="font-semibold text-slate-800">{agreement.areaSqFt} Sq Ft</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Unit Tag</span>
                <span className="font-semibold text-indigo-600 font-mono">{agreement.unitCode}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Monthly Rent</span>
                <span className="font-semibold text-slate-800">₹{agreement.monthlyRent.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <strong>Location:</strong> {agreement.propertyAddress}
            </p>
          </div>

          {/* Tenancy Duration */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Commencement</span>
              <p className="font-semibold text-slate-900">{new Date(agreement.startDate).toLocaleDateString()}</p>
            </div>
            <div className="text-center font-bold text-slate-400 text-sm">➔</div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Expiry Date</span>
              <p className="font-semibold text-slate-900">{new Date(agreement.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Security Deposit</span>
              <p className="font-semibold text-emerald-700">₹{agreement.deposit.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Core Terms */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Storage Terms & Conditions</h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-600 text-[11px]">
              {agreement.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ol>
          </div>

          {/* Cancellation */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
            <strong>Deposit & Cancellation: </strong>
            {agreement.cancellationPolicy}
          </div>

          {/* Digital Signature timestamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Accepted via StoreFlex Portal</span>
            <span>Digitally Timestamped: {new Date(agreement.termsAcceptedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
