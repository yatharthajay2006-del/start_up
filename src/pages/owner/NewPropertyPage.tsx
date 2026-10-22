import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PropertyType, StorageType } from '../../types';
import {
  Building2,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Upload,
  Info,
  Sparkles,
  Camera,
} from 'lucide-react';

interface NewPropertyPageProps {
  onNavigate: (path: string) => void;
}

export const NewPropertyPage: React.FC<NewPropertyPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiNote, setAiNote] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
  ]);

  // Form states
  const [name, setName] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Warehouse');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Meerut');
  const [pincode, setPincode] = useState('250001');
  const [totalArea, setTotalArea] = useState<number>(3000);
  const [ceilingHeight, setCeilingHeight] = useState<number>(18);
  const [floor, setFloor] = useState('Ground Floor RCC');
  const [storageType, setStorageType] = useState<StorageType>('Ambient');
  const [accessHours, setAccessHours] = useState('24/7 Access with Security Check');
  const [pricePerSqFt, setPricePerSqFt] = useState<number>(18);
  const [minDurationMonths, setMinDurationMonths] = useState<number>(1);
  const [depositMonths, setDepositMonths] = useState<number>(1);
  const [allowedCategories, setAllowedCategories] = useState<string[]>([
    'Electronics',
    'FMCG',
    'Garments',
    'Packaging',
    'General goods',
  ]);
  const [facilities, setFacilities] = useState<string[]>([
    'CCTV',
    'Security 24/7',
    'Loading Dock',
    'Heavy Vehicle Parking',
    'Fire Safety',
  ]);

  const handleSimulateUpload = async () => {
    setIsUploading(true);
    try {
      const res = await api.uploadFile({
        fileName: `wh_inspect_${Date.now()}.jpg`,
        fileType: 'image/jpeg',
        category: 'property_photo',
      });
      setUploadedPhotos(prev => [...prev, res.fileUrl]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateAiDescription = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await api.getAiRecommendation({
        city,
        category: allowedCategories[0] || 'General goods',
        requiredAreaSqFt: Number(totalArea),
        budgetPerSqFt: Number(pricePerSqFt),
      });
      setAiNote(
        `StoreFlex Smart Listing Analysis: High-efficiency ${ceilingHeight}ft clear-height space with ${floor} in ${city}. Proximity to major transport corridors ensures seamless freight movement for ${allowedCategories.join(', ')}.`
      );
    } catch {
      setAiNote(`High-efficiency ${ceilingHeight}ft clear-height facility situated in ${city}.`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setAllowedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleFacility = (fac: string) => {
    setFacilities(prev =>
      prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !name || !address) return;

    setIsSubmitting(true);
    try {
      await api.createProperty({
        ownerId: user.id,
        ownerName: user.name,
        ownerPhone: user.phone,
        name,
        propertyType,
        address,
        city,
        pincode,
        totalArea: Number(totalArea),
        availableArea: Number(totalArea),
        ceilingHeight: Number(ceilingHeight),
        floor,
        storageType,
        accessHours,
        pricePerSqFt: Number(pricePerSqFt),
        minDurationMonths: Number(minDurationMonths),
        depositMonths: Number(depositMonths),
        allowedCategories,
        facilities,
        images: uploadedPhotos.length > 0 ? uploadedPhotos : [
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
        ],
        verificationNotes: aiNote ? `AI Listing Spec: ${aiNote}` : undefined,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Property Submitted for Verification!</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your listing has been submitted to the StoreFlex operations team. Once KYC and structural audit are reviewed, your space will become live in the public marketplace.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => onNavigate('/owner/properties')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Go to My Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('/owner/properties')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900">List New Commercial Storage Facility</h1>
          <p className="text-xs text-slate-500">Submit your property details for StoreFlex field verification</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs">
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            1. Property Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Property Name / Hub Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Partapur Industrial Logistics Park"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e: any) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Warehouse">Warehouse</option>
                <option value="Godown">Godown</option>
                <option value="Basement Commercial">Basement Commercial</option>
                <option value="Industrial Shed">Industrial Shed</option>
                <option value="Cold Storage">Cold Storage</option>
                <option value="Fulfillment Center">Fulfillment Center</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Street Address</label>
            <input
              type="text"
              required
              placeholder="e.g. Plot 12B, Site 4 Industrial Area, Near Ring Road"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Meerut">Meerut</option>
                <option value="Ghaziabad">Ghaziabad</option>
                <option value="Noida">Noida</option>
                <option value="Delhi">Delhi</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Faridabad">Faridabad</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Physical Specs */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            2. Dimensions & Physical Specifications
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Capacity (Sq Ft)</label>
              <input
                type="number"
                min="100"
                required
                value={totalArea}
                onChange={(e) => setTotalArea(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ceiling Height (Feet)</label>
              <input
                type="number"
                min="8"
                required
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Floor Type</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Storage Type</label>
              <select
                value={storageType}
                onChange={(e: any) => setStorageType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Ambient">Ambient</option>
                <option value="Climate Controlled">Climate Controlled</option>
                <option value="Heavy Duty">Heavy Duty</option>
                <option value="Open Yard">Open Yard</option>
                <option value="High Ceiling">High Ceiling</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Access Hours</label>
              <input
                type="text"
                value={accessHours}
                onChange={(e) => setAccessHours(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Pricing (#20) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            3. Rental Rates & Commercial Terms
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rate (₹ / Sq Ft / Month)</label>
              <input
                type="number"
                min="5"
                required
                value={pricePerSqFt}
                onChange={(e) => setPricePerSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Lock-in (Months)</label>
              <input
                type="number"
                min="1"
                required
                value={minDurationMonths}
                onChange={(e) => setMinDurationMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deposit (Months Rent)</label>
              <input
                type="number"
                min="0"
                max="3"
                value={depositMonths}
                onChange={(e) => setDepositMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Facilities Multiselect */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">4. Amenities & Safety Features</h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'CCTV',
              'Security 24/7',
              'Loading Dock',
              'Heavy Vehicle Parking',
              'Fire Safety',
              'Power Backup',
              'Forklift on demand',
              'Climate Control',
              'Goods Lift',
            ].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFacility(f)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  facilities.includes(f)
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Photos & Document Upload (#5: STORAGE_KEY optional, local/mock storage) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">5. Warehouse Photos & Documentation</h3>
              <p className="text-[11px] text-slate-500">
                MVP Demo uses local/mock storage — STORAGE_KEY is optional.
              </p>
            </div>
            <button
              type="button"
              disabled={isUploading}
              onClick={handleSimulateUpload}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {isUploading ? 'Uploading...' : 'Add Property Photo'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {uploadedPhotos.map((url, i) => (
              <div key={i} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  {i === 0 ? 'Primary' : `Slot ${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. AI Listing Assistant (#7: AI_API_KEY optional, deterministic mock) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                6. AI Listing Optimizer
              </h3>
              <p className="text-[11px] text-slate-500">
                Deterministic smart spec generation (AI_API_KEY optional).
              </p>
            </div>
            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={handleGenerateAiDescription}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGeneratingAi ? 'Analyzing...' : 'Generate AI Spec'}
            </button>
          </div>

          {aiNote && (
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-purple-900 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-600">Generated Spec Summary</span>
              <p className="text-[11px] leading-relaxed">{aiNote}</p>
            </div>
          )}
        </div>

        {/* Verification Note */}
        <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 text-indigo-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            By submitting, your listing enters the Admin Verification Queue. A StoreFlex field officer verifies commercial registry and fire safety NOC before making it publicly bookable.
          </p>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/owner/properties')}
            className="px-5 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting Property...' : 'Submit for Verification'}
          </button>
        </div>
      </form>
    </div>
  );
};
