import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Property, VerificationStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Building2,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Eye,
  Clock,
  MapPin,
  FileText,
  User as UserIcon,
} from 'lucide-react';

export const AdminPropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [auditNotes, setAuditNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProperties({ onlyVerified: false });
      setProperties(res.properties || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAction = async (propertyId: string, status: 'verified' | 'rejected' | 'suspended', notes: string) => {
    setIsUpdating(true);
    try {
      await api.verifyProperty(propertyId, status, notes);
      setSelectedProperty(null);
      loadProperties();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = properties.filter(p => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return p.verificationStatus === 'pending' || p.verificationStatus === 'under_review';
    return p.verificationStatus === statusFilter;
  });

  const pendingCount = properties.filter(p => p.verificationStatus === 'pending' || p.verificationStatus === 'under_review').length;

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Trust & Safety Audit
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Property Verification Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit warehouse title deeds, fire NOC documents, CCTV installations, and approve spaces for the public marketplace.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({properties.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending Action ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              statusFilter === 'verified' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verified
          </button>
        </div>
      </div>

      {/* Property Queue Table (#27) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Property & Type</th>
                <th className="py-3 px-4">Owner / Host</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">Loading verification queue...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">No properties found in this filter.</td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{p.propertyType} • ₹{p.pricePerSqFt}/sq ft</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{p.ownerName}</span>
                      <span className="text-[10px] text-slate-400">{p.ownerPhone || 'Owner Account'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">{p.city}</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">{p.address}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {p.totalArea.toLocaleString('en-IN')} sq ft
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={p.verificationStatus} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedProperty(p);
                            setAuditNotes(p.verificationNotes || 'Commercial title deeds & fire NOC verified by StoreFlex Field Officer.');
                          }}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Audit & Review
                        </button>

                        {p.verificationStatus !== 'verified' && (
                          <button
                            onClick={() => handleVerifyAction(p.id, 'verified', 'Approved by Operations Admin')}
                            title="Quick Approve"
                            className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
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

      {/* Verification Audit Detail Modal (#27) */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Facility Verification Audit</h3>
              </div>
              <button onClick={() => setSelectedProperty(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.name}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedProperty.name}</h4>
                  <p className="text-[11px] text-slate-500">{selectedProperty.address}, {selectedProperty.city}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Owner Contact</span>
                  <p className="font-bold text-slate-900">{selectedProperty.ownerName}</p>
                  <p className="text-slate-500">{selectedProperty.ownerPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Area & Height</span>
                  <p className="font-bold text-slate-900">{selectedProperty.totalArea} sq ft</p>
                  <p className="text-slate-500">{selectedProperty.ceilingHeight} ft ceiling • {selectedProperty.floor}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Declared Facilities</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedProperty.facilities.map(f => (
                    <span key={f} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Inspector Verification Notes / Public Certificate Note
                </label>
                <textarea
                  rows={3}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between gap-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleVerifyAction(selectedProperty.id, 'rejected', auditNotes)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Reject Listing
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleVerifyAction(selectedProperty.id, 'suspended', auditNotes)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Suspend Listing
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleVerifyAction(selectedProperty.id, 'verified', auditNotes)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Verify & Approve Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
