import React from 'react';
import { Property } from '../../types';
import { ShieldCheck, Star, MapPin, Warehouse, CheckCircle, ArrowRight } from 'lucide-react';

interface StorageCardProps {
  property: Property;
  matchScore?: number;
  isBestMatch?: boolean;
  matchHighlights?: string[];
  onSelect: (property: Property) => void;
  onBookNow: (property: Property) => void;
}

export const StorageCard: React.FC<StorageCardProps> = ({
  property,
  matchScore,
  isBestMatch,
  matchHighlights,
  onSelect,
  onBookNow,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between">
      <div>
        {/* Image & Badges Header */}
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
          <img
            src={property.images[0] || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'}
            alt={property.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            {property.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Facility
              </span>
            )}
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              {property.propertyType}
            </span>
          </div>

          {/* Match Score Badge */}
          {matchScore !== undefined && (
            <div className="absolute top-3 right-3">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs ${
                  isBestMatch
                    ? 'bg-amber-400 text-slate-900 border border-amber-300'
                    : 'bg-white/90 text-indigo-700 border border-indigo-200'
                }`}
              >
                {isBestMatch ? '★ Best Match' : 'Match'}: {matchScore}%
              </span>
            </div>
          )}

          {/* Price overlay at bottom */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg">
            <span className="text-base font-extrabold text-white">₹{property.pricePerSqFt}</span>
            <span className="text-[10px] text-slate-300"> / sq ft / month</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Title & Location */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                {property.name}
              </h4>
              {property.rating > 0 && (
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0 ml-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{property.rating}</span>
                  <span className="text-slate-400 text-[10px] font-normal">({property.reviewCount})</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{property.address}, {property.city} - {property.pincode}</span>
            </p>
          </div>

          {/* Capacity stats */}
          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Available Space</p>
              <p className="font-bold text-emerald-600 text-sm">{property.availableArea.toLocaleString('en-IN')} sq ft</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Capacity</p>
              <p className="font-bold text-slate-700 text-sm">{property.totalArea.toLocaleString('en-IN')} sq ft</p>
            </div>
          </div>

          {/* Match Highlights if present */}
          {matchHighlights && matchHighlights.length > 0 && (
            <div className="space-y-1 pt-1">
              {matchHighlights.slice(0, 2).map((h, i) => (
                <p key={i} className="text-[11px] text-indigo-700 flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span className="truncate">{h}</span>
                </p>
              ))}
            </div>
          )}

          {/* Facilities tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {property.facilities.slice(0, 3).map((f) => (
              <span key={f} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                {f}
              </span>
            ))}
            {property.facilities.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium px-1">
                +{property.facilities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelect(property)}
          className="w-full py-2 px-3 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onBookNow(property)}
          className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1"
        >
          Book Space <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
