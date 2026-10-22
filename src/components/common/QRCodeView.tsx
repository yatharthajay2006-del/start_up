import React, { useState } from 'react';
import { QrCode, X, Check, Copy, ExternalLink, PackageCheck, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { InventoryItem, InventoryMovement } from '../../types';

interface QRCodeViewProps {
  unitCode: string;
  propertyName: string;
  areaSqFt: number;
  inventory?: InventoryItem[];
  movements?: InventoryMovement[];
  onClose: () => void;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  unitCode,
  propertyName,
  areaSqFt,
  inventory = [],
  movements = [],
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'inventory' | 'movements'>('qr');

  const unitInventory = inventory.filter(i => i.unitCode === unitCode || !i.unitCode);
  const unitMovements = movements.filter(m => m.sku);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://storeflex.in/unit/${unitCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Unit Pass & Tag: {unitCode}</h3>
              <p className="text-xs text-slate-500">{propertyName} • {areaSqFt} sq ft</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'qr'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            QR Physical Tag
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" /> Stock ({unitInventory.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'movements'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Log ({unitMovements.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Generated QR Code Graphic */}
              <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-sm inline-block">
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 100 100"
                  className="mx-auto"
                >
                  {/* Decorative QR Pattern */}
                  <rect width="100" height="100" fill="white" />
                  {/* Corner targets */}
                  <rect x="5" y="5" width="26" height="26" fill="black" />
                  <rect x="8" y="8" width="20" height="20" fill="white" />
                  <rect x="11" y="11" width="14" height="14" fill="black" />

                  <rect x="69" y="5" width="26" height="26" fill="black" />
                  <rect x="72" y="8" width="20" height="20" fill="white" />
                  <rect x="75" y="11" width="14" height="14" fill="black" />

                  <rect x="5" y="69" width="26" height="26" fill="black" />
                  <rect x="8" y="72" width="20" height="20" fill="white" />
                  <rect x="11" y="75" width="14" height="14" fill="black" />

                  {/* Data matrix dots simulation */}
                  <rect x="36" y="8" width="8" height="8" fill="black" />
                  <rect x="48" y="14" width="6" height="6" fill="black" />
                  <rect x="58" y="6" width="6" height="6" fill="black" />
                  <rect x="38" y="24" width="8" height="8" fill="black" />
                  <rect x="50" y="28" width="8" height="8" fill="black" />

                  <rect x="8" y="38" width="6" height="6" fill="black" />
                  <rect x="18" y="44" width="8" height="8" fill="black" />
                  <rect x="28" y="36" width="6" height="6" fill="black" />

                  <rect x="38" y="40" width="24" height="20" rx="4" fill="#4f46e5" />
                  <text x="50" y="53" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">SF</text>

                  <rect x="68" y="36" width="8" height="8" fill="black" />
                  <rect x="80" y="44" width="12" height="6" fill="black" />
                  <rect x="72" y="56" width="8" height="8" fill="black" />

                  <rect x="36" y="68" width="8" height="8" fill="black" />
                  <rect x="48" y="74" width="6" height="6" fill="black" />
                  <rect x="58" y="82" width="10" height="8" fill="black" />
                  <rect x="74" y="72" width="6" height="6" fill="black" />
                  <rect x="84" y="80" width="8" height="8" fill="black" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 tracking-wide font-mono">{unitCode}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scan at security gate or bay entrance for digital access and stock audit.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full pt-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2 px-3 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Link Copied!' : 'Copy Digital Pass'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs"
                >
                  Print Unit Label
                </button>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {unitInventory.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No inventory assigned to this unit yet.</p>
              ) : (
                unitInventory.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-indigo-600">{item.sku}</span>
                      <p className="font-semibold text-slate-900">{item.productName}</p>
                      <p className="text-slate-500 text-[11px]">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">{item.quantity} {item.unit}</p>
                      <p className="text-[11px] text-slate-500">₹{item.totalValue.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {unitMovements.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No gate movements logged yet.</p>
              ) : (
                unitMovements.map(m => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${m.movementType === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {m.movementType === 'IN' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{m.productName}</p>
                        <p className="text-[10px] text-slate-500">{m.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${m.movementType === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {m.movementType === 'IN' ? '+' : '-'}{m.quantity}
                      </span>
                      <p className="text-[10px] text-slate-400">{new Date(m.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
