import React, { useState, useEffect } from 'react';
import { Property, Booking } from '../../types';
import { api } from '../../services/api';
import { StorageCard } from '../../components/storage/StorageCard';
import { BookingModal } from '../../components/storage/BookingModal';
import { computeStorageMatch } from '../../utils/matching';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Package,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  X,
  Warehouse,
  LayoutGrid,
  Map as MapIcon,
  Compass,
  Navigation,
} from 'lucide-react';

interface StorageMarketplaceProps {
  onNavigate: (path: string) => void;
  onSelectProperty?: (property: Property) => void;
}

export const StorageMarketplace: React.FC<StorageMarketplaceProps> = ({ onNavigate, onSelectProperty }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);

  // Search parameters
  const [targetCity, setTargetCity] = useState<string>('All');
  const [requiredArea, setRequiredArea] = useState<number>(200);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [productCategory, setProductCategory] = useState<string>('Electronics');
  const [maxBudget, setMaxBudget] = useState<number>(0); // 0 = no limit

  // Advanced Filters
  const [selectedStorageType, setSelectedStorageType] = useState<string>('All');
  const [requiredFacilities, setRequiredFacilities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);

  // Booking Modal
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [targetCity]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await api.getProperties({
        city: targetCity !== 'All' ? targetCity : undefined,
        onlyVerified: true, // Rule #44: Only verified properties appear publicly
      });
      setProperties(res.properties || []);
    } catch (err) {
      console.error('Failed to load marketplace properties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFacility = (facility: string) => {
    setRequiredFacilities(prev =>
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  // Filter & calculate match scores
  const matchedList = properties
    .filter(prop => {
      // Storage type filter
      if (selectedStorageType !== 'All' && prop.storageType !== selectedStorageType) return false;
      // Min rating
      if (minRating > 0 && prop.rating < minRating) return false;
      // Facilities filter
      if (requiredFacilities.length > 0) {
        const hasAll = requiredFacilities.every(rf =>
          prop.facilities.some(pf => pf.toLowerCase().includes(rf.toLowerCase()))
        );
        if (!hasAll) return false;
      }
      return true;
    })
    .map(prop => {
      const match = computeStorageMatch(
        {
          targetCity: targetCity !== 'All' ? targetCity : prop.city,
          requiredAreaSqFt: requiredArea,
          durationMonths,
          productCategory,
          maxBudgetPerMonth: maxBudget > 0 ? maxBudget : undefined,
          requiredFacilities,
          minRating,
        },
        {
          id: prop.id,
          name: prop.name,
          city: prop.city,
          availableArea: prop.availableArea,
          totalArea: prop.totalArea,
          pricePerSqFt: prop.pricePerSqFt,
          minDurationMonths: prop.minDurationMonths,
          allowedCategories: prop.allowedCategories,
          facilities: prop.facilities,
          rating: prop.rating,
          reviewCount: prop.reviewCount,
          isVerified: prop.verificationStatus === 'verified',
        }
      );

      return {
        property: prop,
        matchResult: match,
      };
    })
    // Sort highest match score first
    .sort((a, b) => b.matchResult.score - a.matchResult.score);

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200/60">
                Verified Storage Marketplace
              </span>
              <span className="text-xs text-slate-400">Delhi NCR & Western UP</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Find On-Demand Business Storage
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse verified warehouses with flexible capacity, 100% digital leases, and transparent per-sq-ft pricing.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/business/storage-calculator')}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Need help sizing? Try Smart Calculator
          </button>
        </div>

        {/* Search Bar Inputs (#10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Location */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" /> City / Cluster
            </label>
            <select
              value={targetCity}
              onChange={(e) => setTargetCity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="All">All Cities (NCR & UP)</option>
              <option value="Meerut">Meerut</option>
              <option value="Ghaziabad">Ghaziabad</option>
              <option value="Noida">Noida</option>
              <option value="Delhi">Delhi</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Faridabad">Faridabad</option>
            </select>
          </div>

          {/* Required Area */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Warehouse className="w-3.5 h-3.5 text-indigo-500" /> Required Area
            </label>
            <select
              value={requiredArea}
              onChange={(e) => setRequiredArea(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value={100}>100 Sq Ft (Small)</option>
              <option value={200}>200 Sq Ft (Recommended)</option>
              <option value={350}>350 Sq Ft (Medium)</option>
              <option value={500}>500 Sq Ft (Large)</option>
              <option value={1000}>1,000+ Sq Ft (Enterprise)</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Duration
            </label>
            <select
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value={1}>1 Month (Flexible)</option>
              <option value={2}>2 Months</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months (Annual)</option>
            </select>
          </div>

          {/* Product Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-indigo-500" /> Product Category
            </label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="Electronics">Electronics</option>
              <option value="FMCG">FMCG & Groceries</option>
              <option value="Garments">Garments & Textiles</option>
              <option value="Packaging">Packaging Materials</option>
              <option value="Furniture">Furniture & Decor</option>
              <option value="General goods">General Goods</option>
            </select>
          </div>

          {/* Filter button */}
          <div className="flex items-end">
            <button
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              More Filters {requiredFacilities.length > 0 && `(${requiredFacilities.length})`}
            </button>
          </div>
        </div>

        {/* Expandable Filters Tray */}
        {showFiltersModal && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 pt-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Warehouse Safety & Amenities Filter</span>
              <button
                onClick={() => {
                  setRequiredFacilities([]);
                  setSelectedStorageType('All');
                  setMinRating(0);
                }}
                className="text-[11px] text-indigo-600 hover:underline"
              >
                Reset Filters
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {['CCTV', 'Security', 'Loading Dock', 'Parking', 'Fire Safety', '24/7 Access', 'Climate Control'].map(fac => (
                <button
                  key={fac}
                  onClick={() => toggleFacility(fac)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    requiredFacilities.includes(fac)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {fac}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count, Match Engine status & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong>{matchedList.length} verified facilities</strong> matching your criteria
          </span>
          <span className="text-slate-400 hidden md:inline">
            • Ranked by multi-factor proximity & compatibility
          </span>
        </div>

        {/* View Mode Toggle (#4: MAPS_KEY optional, interactive mock map state) */}
        <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Grid View
          </button>
          <button
            onClick={() => {
              setViewMode('map');
              if (!selectedMapProperty && matchedList.length > 0) {
                setSelectedMapProperty(matchedList[0].property);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'map'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-indigo-600" />
            Map View (NCR Clusters)
          </button>
        </div>
      </div>

      {/* Map View or Grid View */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Map Status Bar */}
          <div className="p-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">Delhi-NCR Regional Logistics Map</span>
              <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                MAPS_KEY Demo Grid Active
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Select a warehouse node to inspect real-time capacity and route access
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Visual Interactive SVG Map Canvas */}
            <div className="lg:col-span-8 bg-slate-950 p-6 relative flex flex-col justify-between overflow-hidden">
              {/* Background Map Grid & Roads */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
              
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Major Expressways connecting nodes */}
                <path d="M 120 180 Q 280 240 450 260 T 700 200" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 4" />
                <path d="M 450 80 L 450 420" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" />
                <path d="M 200 380 Q 380 320 620 380" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" />
              </svg>

              {/* Expressways Label */}
              <div className="relative z-10 flex flex-wrap gap-2 text-[10px]">
                <span className="bg-slate-900/90 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/30 font-medium">
                  🛣️ Delhi-Meerut Expressway (NE-3)
                </span>
                <span className="bg-slate-900/90 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30 font-medium">
                  🛣️ Eastern Peripheral Expressway (EPE)
                </span>
                <span className="bg-slate-900/90 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30 font-medium">
                  🛣️ Yamuna Expressway / NH-48 Corridor
                </span>
              </div>

              {/* Warehouse Nodes Plotting on NCR Grid */}
              <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {properties.map((prop) => {
                  const isSelected = selectedMapProperty?.id === prop.id;
                  return (
                    <div
                      key={prop.id}
                      onClick={() => setSelectedMapProperty(prop)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left group ${
                        isSelected
                          ? 'bg-indigo-950/90 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-102 ring-2 ring-indigo-400'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {prop.city}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-2 truncate group-hover:text-indigo-300">
                        {prop.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{prop.address}</p>
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold">{prop.availableArea} sq ft</span>
                        <span className="text-slate-300 font-bold">₹{prop.pricePerSqFt}/sqft</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer Info */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-900">
                <span>Coordinates: Delhi-NCR Multi-City Hubs (28.61° N, 77.20° E)</span>
                <span className="text-emerald-400 font-semibold">● 100% Verified Warehouses</span>
              </div>
            </div>

            {/* Selected Property Details Panel */}
            <div className="lg:col-span-4 p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between text-left space-y-4">
              {selectedMapProperty ? (
                <div className="space-y-4">
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                    <img
                      src={selectedMapProperty.images[0]}
                      alt={selectedMapProperty.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {selectedMapProperty.city} Hub
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-indigo-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                      ₹{selectedMapProperty.pricePerSqFt} / sq ft
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Verified Commercial Facility
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {selectedMapProperty.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedMapProperty.address}, {selectedMapProperty.city} - {selectedMapProperty.pincode}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Available Space</span>
                      <p className="text-sm font-black text-emerald-600">{selectedMapProperty.availableArea} sq ft</p>
                      <span className="text-[10px] text-slate-400">Total: {selectedMapProperty.totalArea} sq ft</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Clear Height</span>
                      <p className="text-sm font-black text-slate-800">{selectedMapProperty.ceilingHeight} Feet</p>
                      <span className="text-[10px] text-slate-400">{selectedMapProperty.storageType}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Key Amenities</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedMapProperty.facilities.slice(0, 4).map(f => (
                        <span key={f} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded-md border border-indigo-100">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setBookingProperty(selectedMapProperty)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Book Capacity at This Location
                    </button>
                    <button
                      onClick={() => setDetailProperty(selectedMapProperty)}
                      className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-300 transition-colors"
                    >
                      View Full Specifications & Audit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs">
                  Click any marker on the map to inspect warehouse details.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Property Cards Grid */
        isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading verified properties...</div>
        ) : matchedList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Warehouse className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No storage found matching this filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your required area or clearing some amenity filters to see more available spaces.
            </p>
            <button
              onClick={() => {
                setTargetCity('All');
                setRequiredFacilities([]);
                setSelectedStorageType('All');
              }}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedList.map(({ property, matchResult }) => (
              <StorageCard
                key={property.id}
                property={property}
                matchScore={matchResult.score}
                isBestMatch={matchResult.isBestMatch}
                matchHighlights={matchResult.matchHighlights}
                onSelect={(p) => setDetailProperty(p)}
                onBookNow={(p) => setBookingProperty(p)}
              />
            ))}
          </div>
        )
      )}


      {/* Booking Modal */}
      {bookingProperty && (
        <BookingModal
          property={bookingProperty}
          initialArea={requiredArea}
          initialDuration={durationMonths}
          onClose={() => setBookingProperty(null)}
          onBookingSuccess={(b) => {
            setBookingProperty(null);
            fetchProperties(); // update capacity live
            onNavigate('/business/dashboard');
          }}
        />
      )}

      {/* Detail Modal (#11) */}
      {detailProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="relative aspect-16/9 bg-slate-100 shrink-0">
              <img
                src={detailProperty.images[0]}
                alt={detailProperty.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailProperty(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-lg">
                <span className="text-xl font-black">₹{detailProperty.pricePerSqFt}</span>
                <span className="text-xs text-slate-300"> / sq ft / month</span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Facility
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      {detailProperty.propertyType}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{detailProperty.name}</h2>
                  <p className="text-slate-500 mt-0.5">{detailProperty.address}, {detailProperty.city} - {detailProperty.pincode}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Available Now</span>
                  <p className="text-xl font-black text-emerald-600">{detailProperty.availableArea} sq ft</p>
                  <span className="text-[10px] text-slate-400">Total: {detailProperty.totalArea} sq ft</span>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Ceiling Height</span>
                  <p className="font-bold text-slate-800">{detailProperty.ceilingHeight} Feet</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Floor Type</span>
                  <p className="font-bold text-slate-800">{detailProperty.floor}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Storage Type</span>
                  <p className="font-bold text-slate-800">{detailProperty.storageType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Access Hours</span>
                  <p className="font-bold text-slate-800">{detailProperty.accessHours}</p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">Facility Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailProperty.facilities.map(f => (
                    <span key={f} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-lg border border-indigo-100">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allowed Goods */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">Permitted Product Categories</h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailProperty.allowedCategories.map(cat => (
                    <span key={cat} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-medium rounded-lg">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verification Audit Note */}
              {detailProperty.verificationNotes && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <strong>Verification Audit:</strong> {detailProperty.verificationNotes}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Pricing Rate</span>
                <p className="text-base font-bold text-slate-900">₹{detailProperty.pricePerSqFt} / sq ft / month</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailProperty(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const p = detailProperty;
                    setDetailProperty(null);
                    setBookingProperty(p);
                  }}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Proceed to Book Space
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
