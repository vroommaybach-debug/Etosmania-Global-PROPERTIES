import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Trash2,
  Edit3,
  MessageCircle,
  RotateCcw,
  Save,
  Lock,
  LogOut,
  Layers,
  Settings,
  Inbox,
  Users,
  Briefcase,
  Upload,
  Camera,
  Link as LinkIcon,
  X,
  Check,
  Sparkles,
  Maximize2,
  Layout,
  Image as ImageIcon,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Property,
  LocationArea,
  PropertyType,
  PropertyStatus,
  CoOwnershipProject,
  DevelopmentProject,
  ServiceItem,
  HeroStyleMode,
} from '../types';
import { formatNairaCompact } from '../utils/formatters';
import { SafeImage } from '../components/common/SafeImage';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  verifyAdminGatePassword,
  isAdminSessionUnlocked,
  setAdminSessionUnlocked,
  DEFAULT_ADMIN_GATE_SECRET,
} from '../utils/adminAuth';
import {
  processUploadedImageFile,
  normalizeExternalImageUrl,
  detectImageSourceType,
} from '../utils/imageUpload';

type AdminTab =
  | 'properties'
  | 'co-ownership'
  | 'developments'
  | 'services'
  | 'landing'
  | 'enquiries';

const CURATED_PRESETS = [
  {
    label: 'Thomas Estate Luxury Duplex',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
  },
  {
    label: 'Contemporary Terrace Court',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  },
  {
    label: 'Victoria Island Corporate Tower',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
  },
  {
    label: 'Ibeju-Lekki Serviced Land Plot',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
  },
  {
    label: 'Waterfront Sky Apartment',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
  },
  {
    label: 'Old Ikoyi Sovereign Villa',
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85',
  },
];

interface MediaUploadManagerProps {
  images: string[];
  onChange: (nextImages: string[]) => void;
  multiple?: boolean;
  label?: string;
}

/**
 * Universal Media Uploader supporting:
 * 1. Device File Upload (JPG, PNG, WEBP, HEIC)
 * 2. Direct Camera Capture (Native Mobile Camera + Live WebRTC Camera Viewfinder Modal)
 * 3. External Image Links (Google Drive, Dropbox, Pinterest, Direct URLs)
 * 4. Curated Architectural Presets
 */
const MediaUploadManager: React.FC<MediaUploadManagerProps> = ({
  images,
  onChange,
  multiple = true,
  label = 'Property Photos (Upload, Camera, or Link)',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [linkInput, setLinkInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [liveCameraOpen, setLiveCameraOpen] = useState(false);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setLiveCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const appendOrReplaceImages = (newUrls: string[]) => {
    const valid = newUrls.filter(Boolean);
    if (valid.length === 0) return;
    if (multiple) {
      onChange([...images, ...valid]);
    } else {
      onChange([valid[0]]);
    }
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    setUploadStatus('Optimizing photo(s)...');
    try {
      const processed: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const dataUrl = await processUploadedImageFile(fileList[i]);
        processed.push(dataUrl);
      }
      appendOrReplaceImages(processed);
      setUploadStatus(`✓ Added ${processed.length} photo(s)`);
    } catch (err) {
      setUploadStatus(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const normalized = normalizeExternalImageUrl(linkInput.trim());
    if (normalized) {
      appendOrReplaceImages([normalized]);
      setUploadStatus(`✓ Added ${detectImageSourceType(normalized)}`);
      setLinkInput('');
    }
  };

  const startLiveCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraInputRef.current?.click();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setLiveCameraOpen(true);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch {
      // Fallback to native file/camera input if camera permission declined or unavailable
      cameraInputRef.current?.click();
    }
  };

  const snapPhotoFromStream = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
      appendOrReplaceImages([dataUrl]);
      setUploadStatus('✓ Captured photo from camera');
    }
    stopCameraStream();
  };

  const removeImageAt = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const makePrimaryImage = (idx: number) => {
    if (idx === 0) return;
    const target = images[idx];
    const rest = images.filter((_, i) => i !== idx);
    onChange([target, ...rest]);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#FAF9FC] border border-purple-200/80">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#2E1065] flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
          <span>{label}</span>
        </label>
        {uploadStatus && (
          <span className="text-[11px] font-mono text-emerald-700 font-semibold">
            {uploadStatus}
          </span>
        )}
      </div>

      {/* Action Buttons: Upload File, Take Camera Photo */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-white hover:bg-purple-50 border border-purple-200 text-xs font-semibold text-[#3B0764] transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{isUploading ? 'Processing...' : 'Upload Photo(s)'}</span>
        </button>

        <button
          type="button"
          onClick={startLiveCamera}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Take Camera Photo</span>
        </button>

        {/* Hidden Native Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFilesSelected}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFilesSelected}
          className="hidden"
        />
      </div>

      {/* Live Camera Viewfinder Modal */}
      {liveCameraOpen && (
        <div className="p-3 rounded-xl bg-[#120721] text-white space-y-3 border border-[#D4AF37]">
          <div className="flex items-center justify-between text-xs font-mono text-[#F59E0B]">
            <span>Live Camera Capture</span>
            <button
              type="button"
              onClick={stopCameraStream}
              className="text-purple-200 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-48 object-cover rounded-lg bg-black"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={snapPhotoFromStream}
              className="flex-1 py-2.5 rounded-lg bg-[#D4AF37] text-[#120721] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Snap Photo
            </button>
            <button
              type="button"
              onClick={stopCameraStream}
              className="px-4 py-2.5 rounded-lg bg-white/10 text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Paste Image URL / Google Drive / Dropbox Link */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="Paste image link (Web URL, Google Drive, Dropbox)..."
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-purple-200 text-xs focus:outline-none focus:border-[#3B0764]"
          />
        </div>
        <button
          type="button"
          onClick={handleAddLink}
          className="px-3.5 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-[#3B0764] font-bold text-xs cursor-pointer shrink-0"
        >
          Add Link
        </button>
      </div>

      {/* Quick Preset Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-[10px] font-mono text-slate-400 shrink-0">Presets:</span>
        {CURATED_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => appendOrReplaceImages([preset.url])}
            className="px-2 py-1 rounded bg-white border border-purple-100 hover:border-[#D4AF37] text-[10px] text-slate-600 whitespace-nowrap cursor-pointer"
          >
            + {preset.label}
          </button>
        ))}
      </div>

      {/* Current Images Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`relative group h-20 rounded-lg overflow-hidden border-2 ${
                idx === 0 ? 'border-[#D4AF37]' : 'border-purple-200'
              }`}
            >
              <SafeImage src={imgUrl} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#120721]/85 text-[#F59E0B] font-mono text-[9px] font-bold">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {multiple && idx > 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimaryImage(idx)}
                    title="Set as Primary Cover"
                    className="px-1.5 py-1 rounded bg-[#D4AF37] text-[#120721] text-[9px] font-bold cursor-pointer"
                  >
                    Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImageAt(idx)}
                  title="Remove Photo"
                  className="p-1 rounded bg-red-600 text-white cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminPage: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isAdminSessionUnlocked());
  const [passwordInput, setPasswordInput] = useState('');
  const [gateError, setGateError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('properties');
  const [toastMsg, setToastMsg] = useState('');

  const {
    properties,
    developments,
    coOwnershipProjects,
    services,
    enquiries,
    landingConfig,
    addProperty,
    updateProperty,
    deleteProperty,
    addDevelopment,
    updateDevelopment,
    deleteDevelopment,
    addCoOwnershipProject,
    updateCoOwnershipProject,
    deleteCoOwnershipProject,
    addService,
    updateService,
    deleteService,
    updateEnquiryStatus,
    deleteEnquiry,
    updateLandingConfig,
    resetToDefaults,
  } = useData();

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(''), 3000);
  };

  // ============================================================================
  // 1. PROPERTY CREATE / EDIT STATE
  // ============================================================================
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propTitle, setPropTitle] = useState('');
  const [propPrice, setPropPrice] = useState(145000000);
  const [propLocation, setPropLocation] = useState<LocationArea>('Lekki Phase 1');
  const [propAddress, setPropAddress] = useState('Thomas Estate, Ajah, Lekki, Lagos');
  const [propType, setPropType] = useState<PropertyType>('Duplex');
  const [propStatus, setPropStatus] = useState<PropertyStatus>('Available');
  const [propBeds, setPropBeds] = useState(4);
  const [propBaths, setPropBaths] = useState(5);
  const [propSqm, setPropSqm] = useState(420);
  const [propTitleDoc, setPropTitleDoc] = useState("Governor's Consent");
  const [propCoOwn, setPropCoOwn] = useState(true);
  const [propSlotPrice, setPropSlotPrice] = useState(14500000);
  const [propDesc, setPropDesc] = useState(
    'Verified mandate by Etosmania Global Properties Investment Limited.'
  );
  const [propHighlightsText, setPropHighlightsText] = useState(
    '100% Verified Root of Title\nPrime Gated Enclave with 24/7 Security\nImmediate Physical or Video Inspection Available'
  );
  const [propAmenitiesText, setPropAmenitiesText] = useState(
    '24/7 Security, Fitted Kitchen, Treated Water, Smart Locks, En-suite BQ'
  );
  const [propImages, setPropImages] = useState<string[]>([CURATED_PRESETS[0].url]);

  const startEditingProperty = (p: Property) => {
    setEditingPropertyId(p.id);
    setPropTitle(p.title);
    setPropPrice(p.price);
    setPropLocation(p.location);
    setPropAddress(p.address);
    setPropType(p.type);
    setPropStatus(p.status);
    setPropBeds(p.bedrooms);
    setPropBaths(p.bathrooms);
    setPropSqm(p.sqm);
    setPropTitleDoc(p.titleDocument);
    setPropCoOwn(Boolean(p.coOwnershipEligible));
    setPropSlotPrice(p.pricePerSlot || Math.round(p.price / 10));
    setPropDesc(p.description);
    setPropHighlightsText((p.highlights || []).join('\n'));
    setPropAmenitiesText((p.amenities || []).join(', '));
    setPropImages(p.images?.length ? p.images : [CURATED_PRESETS[0].url]);
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  const resetPropertyForm = () => {
    setEditingPropertyId(null);
    setPropTitle('');
    setPropPrice(145000000);
    setPropLocation('Lekki Phase 1');
    setPropAddress('Thomas Estate, Ajah, Lekki, Lagos');
    setPropType('Duplex');
    setPropStatus('Available');
    setPropBeds(4);
    setPropBaths(5);
    setPropSqm(420);
    setPropTitleDoc("Governor's Consent");
    setPropCoOwn(true);
    setPropSlotPrice(14500000);
    setPropDesc('Verified mandate by Etosmania Global Properties Investment Limited.');
    setPropImages([CURATED_PRESETS[0].url]);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim()) return;

    const highlights = propHighlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const amenities = propAmenitiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalImages = propImages.length > 0 ? propImages : [CURATED_PRESETS[0].url];

    if (editingPropertyId) {
      updateProperty(editingPropertyId, {
        title: propTitle.trim(),
        price: Number(propPrice),
        location: propLocation,
        address: propAddress,
        bedrooms: Number(propBeds),
        bathrooms: Number(propBaths),
        sqm: Number(propSqm),
        type: propType,
        status: propStatus,
        coOwnershipEligible: propCoOwn,
        pricePerSlot: propCoOwn ? Number(propSlotPrice) : undefined,
        titleDocument: propTitleDoc,
        description: propDesc,
        highlights,
        amenities,
        images: finalImages,
      });
      triggerToast(`Updated property "${propTitle.trim()}"`);
      resetPropertyForm();
    } else {
      addProperty({
        title: propTitle.trim(),
        price: Number(propPrice),
        location: propLocation,
        address: propAddress,
        bedrooms: Number(propBeds),
        bathrooms: Number(propBaths),
        sqm: Number(propSqm),
        type: propType,
        status: propStatus,
        featured: true,
        coOwnershipEligible: propCoOwn,
        pricePerSlot: propCoOwn ? Number(propSlotPrice) : undefined,
        titleDocument: propTitleDoc,
        CompletionQuarter: 'Ready Now',
        description: propDesc,
        highlights,
        amenities,
        images: finalImages,
        agent: {
          name: 'Etosmania Advisory Desk',
          role: 'Senior Mandate Officer',
          phone: '+234 913 845 3949',
          image:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        },
        coordinates: { lat: 6.4698, lng: 3.5852 },
      });
      triggerToast(`Created new property "${propTitle.trim()}"`);
      resetPropertyForm();
    }
  };

  // ============================================================================
  // 2. CO-OWNERSHIP CREATE / EDIT STATE
  // ============================================================================
  const [editingCoOwnId, setEditingCoOwnId] = useState<string | null>(null);
  const [coTitle, setCoTitle] = useState('');
  const [coLocation, setCoLocation] = useState<LocationArea>('Lekki Phase 1');
  const [coAddress, setCoAddress] = useState('Thomas Estate Axis, Ajah–Lekki, Lagos');
  const [coAssetType, setCoAssetType] =
    useState<CoOwnershipProject['assetType']>('Residential Duplex Pool');
  const [coTotalVal, setCoTotalVal] = useState(240000000);
  const [coSlotPrice, setCoSlotPrice] = useState(12000000);
  const [coTotalSlots, setCoTotalSlots] = useState(20);
  const [coAvailableSlots, setCoAvailableSlots] = useState(8);
  const [coYieldPct, setCoYieldPct] = useState(17.5);
  const [coGrowthPct, setCoGrowthPct] = useState(24);
  const [coHoldYears, setCoHoldYears] = useState(3);
  const [coPayoutFreq, setCoPayoutFreq] =
    useState<CoOwnershipProject['payoutFrequency']>('Bi-Annual');
  const [coTitleDoc, setCoTitleDoc] = useState("Governor's Consent");
  const [coLegal, setCoLegal] = useState('Registered SPV Deed of Co-Ownership & Trustee Certificate');
  const [coSummary, setCoSummary] = useState('');
  const [coHighlightsText, setCoHighlightsText] = useState(
    'Fully managed tenant placement and maintenance\nAudited rental distributions direct to co-owners'
  );
  const [coImages, setCoImages] = useState<string[]>([CURATED_PRESETS[1].url]);

  const startEditingCoOwn = (pool: CoOwnershipProject) => {
    setEditingCoOwnId(pool.id);
    setCoTitle(pool.title);
    setCoLocation(pool.location);
    setCoAddress(pool.address);
    setCoAssetType(pool.assetType);
    setCoTotalVal(pool.totalValuation);
    setCoSlotPrice(pool.pricePerSlot);
    setCoTotalSlots(pool.totalSlots);
    setCoAvailableSlots(pool.availableSlots);
    setCoYieldPct(pool.projectedAnnualYieldPct);
    setCoGrowthPct(pool.projectedCapitalGrowthPct);
    setCoHoldYears(pool.holdPeriodYears);
    setCoPayoutFreq(pool.payoutFrequency);
    setCoTitleDoc(pool.titleDocument);
    setCoLegal(pool.legalStructure);
    setCoSummary(pool.summary);
    setCoHighlightsText((pool.highlights || []).join('\n'));
    setCoImages([pool.image]);
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  const resetCoOwnForm = () => {
    setEditingCoOwnId(null);
    setCoTitle('');
    setCoTotalVal(240000000);
    setCoSlotPrice(12000000);
    setCoTotalSlots(20);
    setCoAvailableSlots(8);
    setCoSummary('');
    setCoImages([CURATED_PRESETS[1].url]);
  };

  const handleSaveCoOwn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coTitle.trim()) return;
    const payload = {
      title: coTitle.trim(),
      location: coLocation,
      address: coAddress,
      assetType: coAssetType,
      totalValuation: Number(coTotalVal),
      pricePerSlot: Number(coSlotPrice),
      totalSlots: Number(coTotalSlots),
      availableSlots: Number(coAvailableSlots),
      minSlots: 1,
      projectedAnnualYieldPct: Number(coYieldPct),
      projectedCapitalGrowthPct: Number(coGrowthPct),
      holdPeriodYears: Number(coHoldYears),
      payoutFrequency: coPayoutFreq,
      titleDocument: coTitleDoc,
      legalStructure: coLegal,
      image: coImages[0] || CURATED_PRESETS[1].url,
      summary:
        coSummary ||
        'Fractional co-ownership syndicate managed by Etosmania Global Properties.',
      highlights: coHighlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingCoOwnId) {
      updateCoOwnershipProject(editingCoOwnId, payload);
      triggerToast(`Updated Co-Ownership pool "${coTitle.trim()}"`);
    } else {
      addCoOwnershipProject(payload);
      triggerToast(`Created Co-Ownership pool "${coTitle.trim()}"`);
    }
    resetCoOwnForm();
  };

  // ============================================================================
  // 3. DEVELOPMENT CREATE / EDIT STATE
  // ============================================================================
  const [editingDevId, setEditingDevId] = useState<string | null>(null);
  const [devName, setDevName] = useState('');
  const [devTagline, setDevTagline] = useState('');
  const [devLocation, setDevLocation] = useState<LocationArea>('Lekki Phase 1');
  const [devStatus, setDevStatus] =
    useState<DevelopmentProject['status']>('Under Construction');
  const [devCompletion, setDevCompletion] = useState('Q4 2026');
  const [devStartPrice, setDevStartPrice] = useState(95000000);
  const [devTotalUnits, setDevTotalUnits] = useState(32);
  const [devAvailUnits, setDevAvailUnits] = useState(12);
  const [devYield, setDevYield] = useState('18.5% p.a.');
  const [devOverview, setDevOverview] = useState('');
  const [devConcept, setDevConcept] = useState(
    'Contemporary tropical architecture with solar-hybrid microgrid.'
  );
  const [devFeaturesText, setDevFeaturesText] = useState(
    '24/7 Access Control\nTreated Water Plant\nPaved Estate Boulevard\nCo-Ownership Eligible'
  );
  const [devImages, setDevImages] = useState<string[]>([CURATED_PRESETS[1].url]);

  const startEditingDev = (d: DevelopmentProject) => {
    setEditingDevId(d.id);
    setDevName(d.name);
    setDevTagline(d.tagline);
    setDevLocation(d.location);
    setDevStatus(d.status);
    setDevCompletion(d.completionDate);
    setDevStartPrice(d.startingPrice);
    setDevTotalUnits(d.totalUnits);
    setDevAvailUnits(d.availableUnits);
    setDevYield(d.yieldEstimate);
    setDevOverview(d.overview);
    setDevConcept(d.architecturalConcept);
    setDevFeaturesText((d.features || []).join('\n'));
    setDevImages([d.heroImage, ...(d.gallery || [])]);
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  const resetDevForm = () => {
    setEditingDevId(null);
    setDevName('');
    setDevTagline('');
    setDevStartPrice(95000000);
    setDevOverview('');
    setDevImages([CURATED_PRESETS[1].url]);
  };

  const handleSaveDev = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devName.trim()) return;
    const features = devFeaturesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const heroImage = devImages[0] || CURATED_PRESETS[1].url;

    if (editingDevId) {
      updateDevelopment(editingDevId, {
        name: devName.trim(),
        tagline: devTagline,
        location: devLocation,
        status: devStatus,
        completionDate: devCompletion,
        startingPrice: Number(devStartPrice),
        totalUnits: Number(devTotalUnits),
        availableUnits: Number(devAvailUnits),
        yieldEstimate: devYield,
        heroImage,
        gallery: devImages,
        overview: devOverview,
        architecturalConcept: devConcept,
        features,
      });
      triggerToast(`Updated development "${devName.trim()}"`);
    } else {
      addDevelopment({
        name: devName.trim(),
        tagline: devTagline || 'Master-Planned Community by Etosmania Global Properties',
        location: devLocation,
        status: devStatus,
        completionDate: devCompletion,
        startingPrice: Number(devStartPrice),
        totalUnits: Number(devTotalUnits),
        availableUnits: Number(devAvailUnits),
        yieldEstimate: devYield,
        heroImage,
        gallery: devImages,
        overview:
          devOverview ||
          'Sustainable community-centered estate development by Etosmania Global Properties.',
        architecturalConcept: devConcept,
        features,
        milestones: [
          {
            stage: 'Title Verification & Perimeter Fencing',
            date: 'Completed',
            completed: true,
            description: 'Verified root of title and perimeter gatehouse completed.',
          },
          {
            stage: 'Infrastructure & Superstructure',
            date: devCompletion,
            completed: false,
            description: 'Ongoing civil and structural works.',
          },
        ],
        floorPlans: [
          {
            id: `FP-${Date.now()}`,
            name: 'Standard Unit / Plot Allocation',
            bedrooms: 4,
            sqm: 350,
            priceFrom: formatNairaCompact(Number(devStartPrice)),
            features: ['Verified Title', 'Flexible Payment Plan'],
          },
        ],
      });
      triggerToast(`Created development "${devName.trim()}"`);
    }
    resetDevForm();
  };

  // ============================================================================
  // 4. SERVICES CREATE / EDIT STATE
  // ============================================================================
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [svcTitle, setSvcTitle] = useState('');
  const [svcCategory, setSvcCategory] =
    useState<ServiceItem['category']>('Advisory & Consulting');
  const [svcTagline, setSvcTagline] = useState('');
  const [svcDesc, setSvcDesc] = useState('');
  const [svcDeliverablesText, setSvcDeliverablesText] = useState('');
  const [svcCtaText, setSvcCtaText] = useState('Book Consultation');
  const [svcWhatsappMsg, setSvcWhatsappMsg] = useState('');

  const startEditingService = (s: ServiceItem) => {
    setEditingServiceId(s.id);
    setSvcTitle(s.title);
    setSvcCategory(s.category);
    setSvcTagline(s.tagline);
    setSvcDesc(s.description);
    setSvcDeliverablesText((s.deliverables || []).join('\n'));
    setSvcCtaText(s.ctaText);
    setSvcWhatsappMsg(s.whatsappMessage || '');
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setSvcTitle('');
    setSvcTagline('');
    setSvcDesc('');
    setSvcDeliverablesText('');
    setSvcCtaText('Book Consultation');
    setSvcWhatsappMsg('');
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!svcTitle.trim()) return;
    const deliverables = svcDeliverablesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingServiceId) {
      updateService(editingServiceId, {
        title: svcTitle.trim(),
        category: svcCategory,
        tagline: svcTagline,
        description: svcDesc,
        deliverables,
        ctaText: svcCtaText,
        whatsappMessage: svcWhatsappMsg,
      });
      triggerToast(`Updated service pillar "${svcTitle.trim()}"`);
    } else {
      addService({
        title: svcTitle.trim(),
        category: svcCategory,
        tagline: svcTagline,
        description: svcDesc,
        deliverables,
        iconName: 'ShieldCheck',
        ctaText: svcCtaText,
        whatsappMessage: svcWhatsappMsg,
      });
      triggerToast(`Added service pillar "${svcTitle.trim()}"`);
    }
    resetServiceForm();
  };

  // ============================================================================
  // 5. HERO & LANDING CONFIG CMS STATE
  // ============================================================================
  const [heroStyle, setHeroStyle] = useState<HeroStyleMode>(
    landingConfig.heroStyle || 'full-bleed'
  );
  const [heroTagline, setHeroTagline] = useState(landingConfig.heroTagline);
  const [heroHeadline, setHeroHeadline] = useState(landingConfig.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(landingConfig.heroSubheadline);
  const [heroImages, setHeroImages] = useState<string[]>([landingConfig.heroImage]);
  const [announcementBanner, setAnnouncementBanner] = useState(landingConfig.announcementBanner);
  const [contactAddress, setContactAddress] = useState(landingConfig.contactAddress);
  const [contactEmail, setContactEmail] = useState(landingConfig.contactEmail);

  const handleSaveLanding = (e: React.FormEvent) => {
    e.preventDefault();
    updateLandingConfig({
      heroStyle,
      heroTagline,
      heroHeadline,
      heroSubheadline,
      heroImage: heroImages[0] || landingConfig.heroImage,
      announcementBanner,
      contactAddress,
      contactEmail,
    });
    triggerToast('Saved Hero Style & Global CMS Settings');
  };

  // Auth Gate Handlers
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminGatePassword(passwordInput)) {
      setAdminSessionUnlocked(true);
      setIsUnlocked(true);
      setGateError('');
    } else {
      setGateError('Invalid passcode. Default passcode: ' + DEFAULT_ADMIN_GATE_SECRET);
    }
  };

  const handleLogout = () => {
    setAdminSessionUnlocked(false);
    setIsUnlocked(false);
    setPasswordInput('');
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#120721] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#1E0938] rounded-2xl p-8 border border-[#D4AF37]/40 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#3B0764] border border-[#D4AF37] flex items-center justify-center text-[#F59E0B]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F59E0B] block">
                Etosmania Global Properties
              </span>
              <h1 className="font-serif text-2xl font-bold">Executive CMS Portal</h1>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-purple-200 mb-1.5">
                Enter Executive Passcode
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter passcode (e.g. Etosmania@2026)"
                className="w-full px-4 py-3 rounded-lg bg-[#120721] border border-purple-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
              {gateError && <p className="text-xs text-amber-400 mt-2">{gateError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Unlock Full-Site CMS
            </button>
          </form>

          <p className="text-[11px] font-mono text-purple-300/70 text-center">
            Passcode: <strong className="text-[#F59E0B]">{DEFAULT_ADMIN_GATE_SECRET}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-24">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 rounded-xl bg-[#18062C] text-[#F59E0B] border border-[#D4AF37] shadow-2xl text-xs font-mono font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <section className="bg-[#18062C] text-white py-10 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] block">
              Full-Website Content Management System
            </span>
            <h1 className="font-serif text-3xl font-bold mt-0.5">
              Manage &amp; Edit Every Category of the Website
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                resetToDefaults();
                triggerToast('Restored default Etosmania catalog');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-purple-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs font-semibold text-white cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock CMS</span>
            </button>
          </div>
        </div>
      </section>

      {/* Category Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-purple-200 pb-4">
          {[
            { id: 'properties', label: `Properties (${properties.length})`, icon: Building2 },
            {
              id: 'co-ownership',
              label: `Co-Ownership Pools (${coOwnershipProjects.length})`,
              icon: Users,
            },
            { id: 'developments', label: `Developments (${developments.length})`, icon: Layers },
            { id: 'services', label: `Core Pillars (${services.length})`, icon: Briefcase },
            { id: 'landing', label: 'Hero Style & Global CMS', icon: Settings },
            { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: Inbox },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as AdminTab)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === id
                  ? 'bg-[#3B0764] text-[#F59E0B] shadow-sm'
                  : 'bg-white text-slate-600 border border-purple-100 hover:border-purple-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* =================================================================== */}
        {/* TAB 1: PROPERTIES (CREATE + EDIT + UPLOAD/CAMERA/LINK)              */}
        {/* =================================================================== */}
        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveProperty}
              className="lg:col-span-5 bg-white rounded-2xl p-6 border border-purple-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h2 className="font-serif text-xl font-bold text-[#120721] flex items-center gap-2">
                  {editingPropertyId ? (
                    <>
                      <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                      <span>Edit Property ({editingPropertyId})</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-[#4C1D95]" />
                      <span>Add New Property / Land</span>
                    </>
                  )}
                </h2>
                {editingPropertyId && (
                  <button
                    type="button"
                    onClick={resetPropertyForm}
                    className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="e.g., 5-Bedroom Detached Duplex in Thomas Estate, Ajah"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (NGN) *
                  </label>
                  <input
                    type="number"
                    required
                    value={propPrice}
                    onChange={(e) => setPropPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category / Type
                  </label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Duplex">Duplex</option>
                    <option value="Terrace">Terrace</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Land">Serviced Land</option>
                    <option value="Commercial">Commercial Property</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corridor
                  </label>
                  <select
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value as LocationArea)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Lekki Phase 1">Ajah / Lekki Phase 1</option>
                    <option value="Ibeju-Lekki">Ibeju-Lekki</option>
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Ikoyi">Ikoyi</option>
                    <option value="Eko Atlantic">Eko Atlantic</option>
                    <option value="Ikeja GRA">Ikeja GRA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability Status
                  </label>
                  <select
                    value={propStatus}
                    onChange={(e) => setPropStatus(e.target.value as PropertyStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Off-Plan">Off-Plan</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street / Estate Address
                  </label>
                  <input
                    type="text"
                    value={propAddress}
                    onChange={(e) => setPropAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title Document
                  </label>
                  <input
                    type="text"
                    value={propTitleDoc}
                    onChange={(e) => setPropTitleDoc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Beds</label>
                  <input
                    type="number"
                    value={propBeds}
                    onChange={(e) => setPropBeds(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Baths</label>
                  <input
                    type="number"
                    value={propBaths}
                    onChange={(e) => setPropBaths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SQM</label>
                  <input
                    type="number"
                    value={propSqm}
                    onChange={(e) => setPropSqm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-100">
                <label className="text-xs font-semibold text-[#2E1065] flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propCoOwn}
                    onChange={(e) => setPropCoOwn(e.target.checked)}
                  />
                  <span>Co-Ownership Eligible</span>
                </label>
                {propCoOwn && (
                  <input
                    type="number"
                    value={propSlotPrice}
                    onChange={(e) => setPropSlotPrice(Number(e.target.value))}
                    className="w-36 px-2.5 py-1 rounded border border-purple-200 text-xs font-mono bg-white"
                    placeholder="Price per Slot"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Executive Description
                </label>
                <textarea
                  rows={3}
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={propHighlightsText}
                  onChange={(e) => setPropHighlightsText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <MediaUploadManager
                images={propImages}
                onChange={setPropImages}
                multiple={true}
                label="Property Gallery (Upload, Camera, or Link)"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#F59E0B]" />
                <span>
                  {editingPropertyId ? 'Save Changes to Property' : 'Publish New Property'}
                </span>
              </button>
            </form>

            {/* Right: Properties List with Edit & Delete */}
            <div className="lg:col-span-7 space-y-3">
              {properties.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white rounded-xl p-4 border transition-all flex items-center justify-between gap-4 ${
                    editingPropertyId === p.id
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                      : 'border-purple-100'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <SafeImage
                      src={p.images[0]}
                      alt={p.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#5B21B6] block">
                        {p.id} · {p.location} · {p.type} · {p.status}
                      </span>
                      <Link
                        to={`/properties/${p.slug}`}
                        className="font-serif font-bold text-sm text-[#120721] hover:text-[#3B0764] truncate block"
                      >
                        {p.title}
                      </Link>
                      <span className="font-mono text-xs font-bold text-[#3B0764]">
                        {formatNairaCompact(p.price)}
                        {p.coOwnershipEligible && p.pricePerSlot
                          ? ` · Slot: ${formatNairaCompact(p.pricePerSlot)}`
                          : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditingProperty(p)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-50 hover:bg-[#3B0764] text-[#3B0764] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteProperty(p.id);
                        triggerToast(`Deleted ${p.title}`);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: CO-OWNERSHIP SYNDICATES (CREATE + EDIT + UPLOAD/CAMERA/LINK) */}
        {/* =================================================================== */}
        {activeTab === 'co-ownership' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveCoOwn}
              className="lg:col-span-5 bg-white rounded-2xl p-6 border border-purple-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h2 className="font-serif text-xl font-bold text-[#120721] flex items-center gap-2">
                  {editingCoOwnId ? (
                    <>
                      <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                      <span>Edit Syndicate ({editingCoOwnId})</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-[#4C1D95]" />
                      <span>Add Co-Ownership Pool</span>
                    </>
                  )}
                </h2>
                {editingCoOwnId && (
                  <button
                    type="button"
                    onClick={resetCoOwnForm}
                    className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pool / Syndicate Title *
                </label>
                <input
                  type="text"
                  required
                  value={coTitle}
                  onChange={(e) => setCoTitle(e.target.value)}
                  placeholder="e.g., Thomas Estate Sovereign Duplex Pool"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price Per Slot (NGN) *
                  </label>
                  <input
                    type="number"
                    required
                    value={coSlotPrice}
                    onChange={(e) => setCoSlotPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Valuation (NGN)
                  </label>
                  <input
                    type="number"
                    value={coTotalVal}
                    onChange={(e) => setCoTotalVal(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Slots
                  </label>
                  <input
                    type="number"
                    value={coTotalSlots}
                    onChange={(e) => setCoTotalSlots(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Available Slots
                  </label>
                  <input
                    type="number"
                    value={coAvailableSlots}
                    onChange={(e) => setCoAvailableSlots(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Yield %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={coYieldPct}
                    onChange={(e) => setCoYieldPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Growth % p.a.
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={coGrowthPct}
                    onChange={(e) => setCoGrowthPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hold (Yrs)
                  </label>
                  <input
                    type="number"
                    value={coHoldYears}
                    onChange={(e) => setCoHoldYears(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={2}
                  value={coSummary}
                  onChange={(e) => setCoSummary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <MediaUploadManager
                images={coImages}
                onChange={setCoImages}
                multiple={false}
                label="Pool Cover Photo (Upload, Camera, or Link)"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#F59E0B]" />
                <span>
                  {editingCoOwnId ? 'Save Co-Ownership Changes' : 'Publish Co-Ownership Pool'}
                </span>
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {coOwnershipProjects.map((pool) => (
                <div
                  key={pool.id}
                  className={`bg-white rounded-xl p-4 border flex items-center justify-between gap-4 ${
                    editingCoOwnId === pool.id
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                      : 'border-purple-100'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <SafeImage
                      src={pool.image}
                      alt={pool.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#5B21B6] block">
                        {pool.id} · {pool.assetType}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-[#120721] truncate">
                        {pool.title}
                      </h3>
                      <span className="font-mono text-xs font-bold text-[#3B0764]">
                        {formatNairaCompact(pool.pricePerSlot)} / slot · {pool.availableSlots}/
                        {pool.totalSlots} open
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditingCoOwn(pool)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-50 hover:bg-[#3B0764] text-[#3B0764] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteCoOwnershipProject(pool.id);
                        triggerToast(`Removed ${pool.title}`);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: DEVELOPMENTS (CREATE + EDIT + UPLOAD/CAMERA/LINK)            */}
        {/* =================================================================== */}
        {activeTab === 'developments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveDev}
              className="lg:col-span-5 bg-white rounded-2xl p-6 border border-purple-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h2 className="font-serif text-xl font-bold text-[#120721] flex items-center gap-2">
                  {editingDevId ? (
                    <>
                      <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                      <span>Edit Development ({editingDevId})</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-[#4C1D95]" />
                      <span>Add Estate Development</span>
                    </>
                  )}
                </h2>
                {editingDevId && (
                  <button
                    type="button"
                    onClick={resetDevForm}
                    className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Development Name *
                </label>
                <input
                  type="text"
                  required
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder="e.g., Etosmania Gold Crest Courts, Ajah"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={devTagline}
                  onChange={(e) => setDevTagline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Starting Price (NGN)
                  </label>
                  <input
                    type="number"
                    value={devStartPrice}
                    onChange={(e) => setDevStartPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={devStatus}
                    onChange={(e) =>
                      setDevStatus(e.target.value as DevelopmentProject['status'])
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Pre-Launch">Pre-Launch</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="text"
                    value={devCompletion}
                    onChange={(e) => setDevCompletion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Avail Units
                  </label>
                  <input
                    type="number"
                    value={devAvailUnits}
                    onChange={(e) => setDevAvailUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Yield Est.
                  </label>
                  <input
                    type="text"
                    value={devYield}
                    onChange={(e) => setDevYield(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Masterplan Overview
                </label>
                <textarea
                  rows={3}
                  value={devOverview}
                  onChange={(e) => setDevOverview(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <MediaUploadManager
                images={devImages}
                onChange={setDevImages}
                multiple={true}
                label="Development Photos (Upload, Camera, or Link)"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#F59E0B]" />
                <span>
                  {editingDevId ? 'Save Development Changes' : 'Publish New Development'}
                </span>
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {developments.map((dev) => (
                <div
                  key={dev.id}
                  className={`bg-white rounded-xl p-4 border flex items-center justify-between gap-4 ${
                    editingDevId === dev.id
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                      : 'border-purple-100'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <SafeImage
                      src={dev.heroImage}
                      alt={dev.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#5B21B6] block">
                        {dev.id} · {dev.location} · {dev.status}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-[#120721] truncate">
                        {dev.name}
                      </h3>
                      <span className="font-mono text-xs font-bold text-[#3B0764]">
                        From {formatNairaCompact(dev.startingPrice)} · {dev.availableUnits}/
                        {dev.totalUnits} avail
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditingDev(dev)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-50 hover:bg-[#3B0764] text-[#3B0764] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteDevelopment(dev.id);
                        triggerToast(`Deleted ${dev.name}`);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: 8 CORE SERVICES (CREATE + EDIT + DELETE)                     */}
        {/* =================================================================== */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleSaveService}
              className="lg:col-span-5 bg-white rounded-2xl p-6 border border-purple-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <h2 className="font-serif text-xl font-bold text-[#120721] flex items-center gap-2">
                  {editingServiceId ? (
                    <>
                      <Edit3 className="w-5 h-5 text-[#D4AF37]" />
                      <span>Edit Service Pillar</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-[#4C1D95]" />
                      <span>Add Service Pillar</span>
                    </>
                  )}
                </h2>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={resetServiceForm}
                    className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Pillar Title *
                </label>
                <input
                  type="text"
                  required
                  value={svcTitle}
                  onChange={(e) => setSvcTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={svcCategory}
                  onChange={(e) =>
                    setSvcCategory(e.target.value as ServiceItem['category'])
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="Advisory & Consulting">Advisory &amp; Consulting</option>
                  <option value="Sales & Acquisition">Sales &amp; Acquisition</option>
                  <option value="Wealth & Co-Ownership">Wealth &amp; Co-Ownership</option>
                  <option value="Asset Management">Asset Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={svcTagline}
                  onChange={(e) => setSvcTagline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={svcDesc}
                  onChange={(e) => setSvcDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={svcDeliverablesText}
                  onChange={(e) => setSvcDeliverablesText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-[#F59E0B]" />
                <span>{editingServiceId ? 'Save Pillar Changes' : 'Add Service Pillar'}</span>
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {services.map((svc, idx) => (
                <div
                  key={svc.id}
                  className={`bg-white rounded-xl p-4 border flex items-center justify-between gap-4 ${
                    editingServiceId === svc.id
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                      : 'border-purple-100'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-[#5B21B6] block">
                      Pillar 0{idx + 1} · {svc.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#120721]">{svc.title}</h3>
                    <p className="text-xs text-slate-500 truncate">{svc.tagline}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditingService(svc)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-50 hover:bg-[#3B0764] text-[#3B0764] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteService(svc.id);
                        triggerToast(`Removed ${svc.title}`);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: HERO STYLE & GLOBAL CMS                                      */}
        {/* =================================================================== */}
        {activeTab === 'landing' && (
          <form
            onSubmit={handleSaveLanding}
            className="max-w-3xl bg-white rounded-2xl p-6 sm:p-8 border border-purple-200 shadow-sm space-y-6"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#5B21B6] font-bold block">
                Homepage Visual Architecture
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#120721]">
                Hero Layout Style &amp; Global Content CMS
              </h2>
            </div>

            {/* Hero Layout Mode Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Choose Homepage Hero Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setHeroStyle('full-bleed')}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    heroStyle === 'full-bleed'
                      ? 'bg-[#2E1065] text-white border-[#D4AF37] shadow-md'
                      : 'bg-[#FAF9FC] text-[#120721] border-purple-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm">
                      Full-Screen Image Hero (Words on Image)
                    </span>
                    <Maximize2 className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <p
                    className={`text-xs ${
                      heroStyle === 'full-bleed' ? 'text-purple-200' : 'text-slate-500'
                    }`}
                  >
                    Architectural photograph fills the entire hero background with words overlaid.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroStyle('split')}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    heroStyle === 'split'
                      ? 'bg-[#2E1065] text-white border-[#D4AF37] shadow-md'
                      : 'bg-[#FAF9FC] text-[#120721] border-purple-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm">
                      Split Picture-in-Picture Frame
                    </span>
                    <Layout className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <p
                    className={`text-xs ${
                      heroStyle === 'split' ? 'text-purple-200' : 'text-slate-500'
                    }`}
                  >
                    Headline on the left column with a gold-rimmed architectural showcase card on
                    the right.
                  </p>
                </button>
              </div>
            </div>

            <MediaUploadManager
              images={heroImages}
              onChange={setHeroImages}
              multiple={false}
              label="Hero Background / Showcase Photo (Upload, Camera, or Link)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtle Top Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hero Subheadline
              </label>
              <textarea
                rows={3}
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headquarters Address
                </label>
                <input
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#F59E0B]" />
              <span>Save Hero Style &amp; Global Settings</span>
            </button>
          </form>
        )}

        {/* =================================================================== */}
        {/* TAB 6: CLIENT ENQUIRIES                                             */}
        {/* =================================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-xl p-5 border border-purple-100 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-[#5B21B6] font-bold">
                      {enq.id} · {enq.type}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#120721]">{enq.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={enq.status}
                      onChange={(e) =>
                        updateEnquiryStatus(enq.id, e.target.value as typeof enq.status)
                      }
                      className="px-3 py-1.5 rounded-lg border border-purple-200 text-xs font-semibold bg-[#FAF9FC]"
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteEnquiry(enq.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">{enq.message}</p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-50 text-xs font-mono text-slate-500">
                  <span>
                    {enq.name} · {enq.phone} · {enq.email}
                  </span>
                  <a
                    href={getWhatsAppUrl(
                      `Hello ${enq.name}, following up from Etosmania Global Properties regarding "${enq.subject}".`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Reply on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
