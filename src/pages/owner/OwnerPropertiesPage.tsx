import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Property } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Building2,
  Plus,
  ShieldCheck,
  Clock,
  Warehouse,
  CheckCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface OwnerPropertiesPageProps {
  onNavigate: (path: string) => void;
}

export const OwnerPropertiesPage: React.FC<OwnerPropertiesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;
    loadProperties();
  }, [user?.id]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProperties({ onlyVerified: false });
      const ownerProps = res.properties.filter(p => p.ownerId === user?.id);
      setProperties(ownerProps);
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
            Property Assets
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            My Storage Facilities
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage warehouse listings, monitor verification audits, and configure square-foot rental rates.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/owner/properties/new')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Facility
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading facilities...</div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No properties listed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Monetize your empty commercial floor or godown. Submit property details for StoreFlex verification.
          </p>
          <button
            onClick={() => onNavigate('/owner/properties/new')}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
          >
            List Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => {
            const occupied = p.totalArea - p.availableArea;
            const occPercent = Math.round((occupied / p.totalArea) * 100);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={p.verificationStatus} size="sm" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                      ₹{p.pricePerSqFt} / sq ft
                    </div>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h4>
                      <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {p.city} • {p.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Total</span>
                        <strong className="text-slate-800">{p.totalArea} sq ft</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Available</span>
                        <strong className="text-emerald-600">{p.availableArea} sq ft</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Occupied</span>
                        <strong className="text-slate-800">{occPercent}%</strong>
                      </div>
                    </div>

                    {p.verificationStatus === 'pending' && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>Submitted for verification. Visible to businesses once approved by Admin.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-500">
                    {p.facilities.slice(0, 3).map(f => (
                      <span key={f} className="bg-slate-100 px-1.5 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
