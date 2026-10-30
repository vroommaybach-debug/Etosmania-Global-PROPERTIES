import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Building2,
  Calendar,
  Mail,
  RotateCcw,
  Lock,
  CheckCircle2,
  Edit3,
  Upload,
  Camera,
  Link as LinkIcon,
  Save,
  X,
  Briefcase,
  Users,
  Settings,
  Layers,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { verifyAdminPasscode } from '../utils/adminAuth';
import {
  LocationArea,
  PropertyType,
  Property,
  DevelopmentProject,
  ServiceItem,
  CoOwnershipAsset,
} from '../types';
import { compressImageFileToDataUrl, isValidImageSource } from '../utils/imageUpload';
import { SafeImage } from '../components/common/SafeImage';

type AdminTab =
  | 'properties'
  | 'developments'
  | 'coownership'
  | 'services'
  | 'cms'
  | 'leads';

export const AdminPage: React.FC = () => {
  const {
    properties,
    developments,
    services,
    coOwnershipAssets,
    siteConfig,
    bookings,
    inquiries,
    addProperty,
    updateProperty,
    deleteProperty,
    addDevelopment,
    updateDevelopment,
    deleteDevelopment,
    addService,
    updateService,
    deleteService,
    addCoOwnershipAsset,
    updateCoOwnershipAsset,
    deleteCoOwnershipAsset,
    updateSiteConfig,
    updateBookingStatus,
    resetDemoData,
  } = useData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('properties');
  const [statusBanner, setStatusBanner] = useState<string>('');

  // =========================================================================
  // 1. PROPERTY EDITOR STATE (CREATE OR EDIT)
  // =========================================================================
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propTitle, setPropTitle] = useState('');
  const [propPrice, setPropPrice] = useState('');
  const [propLocation, setPropLocation] = useState('Thomas Estate, Ajah, Lekki, Lagos');
  const [propArea, setPropArea] = useState<LocationArea>('Ajah');
  const [propType, setPropType] = useState<PropertyType>('Residential');
  const [propBeds, setPropBeds] = useState('4');
  const [propBaths, setPropBaths] = useState('5');
  const [propSqm, setPropSqm] = useState('500');
  const [propDesc, setPropDesc] = useState('');
  const [propImages, setPropImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // =========================================================================
  // 2. DEVELOPMENT EDITOR STATE
  // =========================================================================
  const [editingDevId, setEditingDevId] = useState<string | null>(null);
  const [devName, setDevName] = useState('');
  const [devTagline, setDevTagline] = useState('');
  const [devLocation, setDevLocation] = useState('Ajah, Lekki, Lagos');
  const [devStartingPrice, setDevStartingPrice] = useState('₦88,000,000');
  const [devCompletion, setDevCompletion] = useState('Q4 2025');
  const [devStatus, setDevStatus] = useState<'Ongoing' | 'Completed' | 'Upcoming'>('Ongoing');
  const [devTotalUnits, setDevTotalUnits] = useState('24');
  const [devAvailableUnits, setDevAvailableUnits] = useState('8');
  const [devHeroImage, setDevHeroImage] = useState(
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85'
  );
  const [devDesc, setDevDesc] = useState('');

  // =========================================================================
  // 3. CO-OWNERSHIP EDITOR STATE
  // =========================================================================
  const [editingCoId, setEditingCoId] = useState<string | null>(null);
  const [coTitle, setCoTitle] = useState('');
  const [coLocation, setCoLocation] = useState('Thomas Estate Corridor, Ajah, Lekki');
  const [coTotalValue, setCoTotalValue] = useState('₦180,000,000');
  const [coPricePerSlot, setCoPricePerSlot] = useState('₦9,000,000');
  const [coTotalSlots, setCoTotalSlots] = useState('20');
  const [coAvailableSlots, setCoAvailableSlots] = useState('6');
  const [coProjectedYield, setCoProjectedYield] = useState('19.5% p.a. Rental Yield');
  const [coMinimumHold, setCoMinimumHold] = useState('18 Months');
  const [coImage, setCoImage] = useState(
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85'
  );

  // =========================================================================
  // 4. SERVICE PILLAR EDITOR STATE
  // =========================================================================
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvNumber, setSrvNumber] = useState('09');
  const [srvTitle, setSrvTitle] = useState('');
  const [srvShortDesc, setSrvShortDesc] = useState('');
  const [srvDescription, setSrvDescription] = useState('');
  const [srvCtaText, setSrvCtaText] = useState('Consult an Advisor');

  // =========================================================================
  // 5. SITE & HERO CMS STATE
  // =========================================================================
  const [cmsConfig, setCmsConfig] = useState(siteConfig);

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(''), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPasscode(passcode)) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Hint: ETOSMANIA2025');
    }
  };

  // Image Upload / Camera / Link Handlers
  const handleFileOrCameraUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccessUrl: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const compressedDataUrl = await compressImageFileToDataUrl(file);
      onSuccessUrl(compressedDataUrl);
      showToast('Photo uploaded & optimized!');
    } catch (err) {
      console.error(err);
      showToast('Could not process image file.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!isValidImageSource(newImageUrl)) return;
    setPropImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Property Submit (Add or Update)
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(propPrice.replace(/[^0-9]/g, '')) || 50000000;
    const cleanedImages =
      propImages.length > 0
        ? propImages
        : [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
          ];

    if (editingPropertyId) {
      const existing = properties.find((p) => p.id === editingPropertyId);
      if (existing) {
        await updateProperty({
          ...existing,
          title: propTitle,
          price: numericPrice,
          priceFormatted: `₦${numericPrice.toLocaleString()}`,
          location: propLocation,
          area: propArea,
          type: propType,
          bedrooms: Number(propBeds) || 0,
          bathrooms: Number(propBaths) || 0,
          sqm: Number(propSqm) || 500,
          description: propDesc,
          images: cleanedImages,
        });
        showToast(`Updated property ${editingPropertyId}`);
      }
    } else {
      await addProperty({
        title: propTitle,
        price: numericPrice,
        priceFormatted: `₦${numericPrice.toLocaleString()}`,
        location: propLocation,
        area: propArea,
        type: propType,
        status: 'Available',
        bedrooms: Number(propBeds) || 0,
        bathrooms: Number(propBaths) || 0,
        sqm: Number(propSqm) || 500,
        featured: true,
        isNew: true,
        description:
          propDesc ||
          'Verified property with clean title offered by Etosmania Global Properties Investment Limited.',
        amenities: [
          'Governor’s Consent / C of O Verified',
          '24/7 Estate Security',
          'Paved Road Network',
          'Instant Allocation',
        ],
        images: cleanedImages,
        coordinates: { lat: 6.4698, lng: 3.5852 },
        agent: {
          name: 'Etosmania Advisory Desk',
          role: 'Senior Property Consultant',
          phone: '+234 913 845 3949',
          whatsapp: '2349138453949',
          avatar:
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        },
      });
      showToast('Published new property listing!');
    }

    resetPropertyForm();
  };

  const startEditProperty = (p: Property) => {
    setEditingPropertyId(p.id);
    setPropTitle(p.title);
    setPropPrice(String(p.price));
    setPropLocation(p.location);
    setPropArea(p.area);
    setPropType(p.type);
    setPropBeds(String(p.bedrooms));
    setPropBaths(String(p.bathrooms));
    setPropSqm(String(p.sqm));
    setPropDesc(p.description);
    setPropImages(p.images || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPropertyForm = () => {
    setEditingPropertyId(null);
    setPropTitle('');
    setPropPrice('');
    setPropLocation('Thomas Estate, Ajah, Lekki, Lagos');
    setPropArea('Ajah');
    setPropType('Residential');
    setPropBeds('4');
    setPropBaths('5');
    setPropSqm('500');
    setPropDesc('');
    setPropImages([
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
    ]);
  };

  // Development Submit
  const handleSaveDevelopment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDevId) {
      const existing = developments.find((d) => d.id === editingDevId);
      if (existing) {
        await updateDevelopment({
          ...existing,
          name: devName,
          tagline: devTagline,
          location: devLocation,
          startingPrice: devStartingPrice,
          completionDate: devCompletion,
          status: devStatus,
          totalUnits: Number(devTotalUnits) || 20,
          availableUnits: Number(devAvailableUnits) || 5,
          heroImage: devHeroImage,
          description: devDesc,
        });
        showToast(`Updated development ${editingDevId}`);
      }
    } else {
      await addDevelopment({
        name: devName,
        tagline: devTagline || 'Sustainable Community-Centered Estate',
        location: devLocation,
        startingPrice: devStartingPrice,
        completionDate: devCompletion,
        status: devStatus,
        totalUnits: Number(devTotalUnits) || 20,
        availableUnits: Number(devAvailableUnits) || 5,
        heroImage: devHeroImage,
        gallery: [devHeroImage],
        description: devDesc,
        highlights: [
          'Governor’s Consent / C of O Verified',
          'Flexible 6–12 Months Milestone Payment Plan',
          'Paved Roads, Solar Street Lighting & 24/7 Security',
        ],
      });
      showToast('Added new Estate Development!');
    }
    setEditingDevId(null);
    setDevName('');
    setDevTagline('');
    setDevDesc('');
  };

  const startEditDev = (d: DevelopmentProject) => {
    setEditingDevId(d.id);
    setDevName(d.name);
    setDevTagline(d.tagline);
    setDevLocation(d.location);
    setDevStartingPrice(d.startingPrice);
    setDevCompletion(d.completionDate);
    setDevStatus(d.status);
    setDevTotalUnits(String(d.totalUnits));
    setDevAvailableUnits(String(d.availableUnits));
    setDevHeroImage(d.heroImage);
    setDevDesc(d.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Co-Ownership Submit
  const handleSaveCoOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoId) {
      const existing = coOwnershipAssets.find((c) => c.id === editingCoId);
      if (existing) {
        await updateCoOwnershipAsset({
          ...existing,
          title: coTitle,
          location: coLocation,
          totalValue: coTotalValue,
          pricePerSlot: coPricePerSlot,
          totalSlots: Number(coTotalSlots) || 20,
          availableSlots: Number(coAvailableSlots) || 5,
          projectedYield: coProjectedYield,
          minimumHold: coMinimumHold,
          image: coImage,
        });
        showToast(`Updated Co-Ownership Pool ${editingCoId}`);
      }
    } else {
      await addCoOwnershipAsset({
        title: coTitle,
        location: coLocation,
        totalValue: coTotalValue,
        pricePerSlot: coPricePerSlot,
        totalSlots: Number(coTotalSlots) || 20,
        availableSlots: Number(coAvailableSlots) || 5,
        projectedYield: coProjectedYield,
        appreciationTarget: '+32% in 24 Months',
        minimumHold: coMinimumHold,
        status: 'Open for Subscription',
        image: coImage,
        highlights: [
          'Registered Co-Ownership Deed & Slot Certificate',
          'Audited Rental Dividend Payouts',
          'Managed 100% by Etosmania Property Management',
        ],
      });
      showToast('Added new Co-Ownership Asset Pool!');
    }
    setEditingCoId(null);
    setCoTitle('');
  };

  const startEditCo = (c: CoOwnershipAsset) => {
    setEditingCoId(c.id);
    setCoTitle(c.title);
    setCoLocation(c.location);
    setCoTotalValue(c.totalValue);
    setCoPricePerSlot(c.pricePerSlot);
    setCoTotalSlots(String(c.totalSlots));
    setCoAvailableSlots(String(c.availableSlots));
    setCoProjectedYield(c.projectedYield);
    setCoMinimumHold(c.minimumHold);
    setCoImage(c.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Service Submit
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceId) {
      const existing = services.find((s) => s.id === editingServiceId);
      if (existing) {
        await updateService({
          ...existing,
          number: srvNumber,
          title: srvTitle,
          shortDesc: srvShortDesc,
          description: srvDescription,
          ctaText: srvCtaText,
        });
        showToast(`Updated Service Pillar: ${srvTitle}`);
      }
    } else {
      await addService({
        number: srvNumber,
        title: srvTitle,
        shortDesc: srvShortDesc,
        description: srvDescription,
        iconName: 'Compass',
        deliverables: [
          'Verified Documentation & Advisory',
          'Dedicated Relationship Officer',
          'Milestone Reporting',
        ],
        ctaText: srvCtaText,
        whatsappPrompt: `Hello Etosmania Global Properties, I would like to inquire about ${srvTitle}.`,
      });
      showToast(`Added Service Pillar: ${srvTitle}`);
    }
    setEditingServiceId(null);
    setSrvTitle('');
    setSrvShortDesc('');
    setSrvDescription('');
  };

  const startEditService = (s: ServiceItem) => {
    setEditingServiceId(s.id);
    setSrvNumber(s.number);
    setSrvTitle(s.title);
    setSrvShortDesc(s.shortDesc);
    setSrvDescription(s.description);
    setSrvCtaText(s.ctaText);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSiteConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteConfig(cmsConfig);
    showToast('Saved Global Website & Hero Settings!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F8FAFC]">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1D42] text-[#FACC15] flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif-luxury text-2xl font-bold text-[#07142B]">
              Etosmania Executive CMS Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your executive passcode to manage properties, co-ownership pools, developments,
              services, hero styles, and client inquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Executive Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (ETOSMANIA2025)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
              />
              {authError && <p className="text-xs text-red-600 mt-1.5 font-medium">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-[#FACC15] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Unlock CMS Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-[#07142B] text-white py-10 border-b-4 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#FACC15]">
              Full-Website Content Management System
            </span>
            <h1 className="font-serif-luxury text-3xl font-bold mt-1">
              Etosmania Global Properties CMS
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {statusBanner && (
              <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {statusBanner}
              </span>
            )}
            <button
              onClick={resetDemoData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Reset Default Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {[
            {
              id: 'properties',
              label: `Properties (${properties.length})`,
              icon: Building2,
            },
            {
              id: 'coownership',
              label: `Co-Ownership (${coOwnershipAssets.length})`,
              icon: Users,
            },
            {
              id: 'developments',
              label: `Developments (${developments.length})`,
              icon: Layers,
            },
            {
              id: 'services',
              label: `Services (${services.length})`,
              icon: Briefcase,
            },
            {
              id: 'cms',
              label: 'Hero & Site Settings',
              icon: Settings,
            },
            {
              id: 'leads',
              label: `Bookings & Leads (${bookings.length + inquiries.length})`,
              icon: Calendar,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0A1D42] text-[#FACC15] shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =====================================================================
            TAB 1: PROPERTIES MANAGER (ADD, EDIT, DELETE, UPLOAD, CAMERA, LINK)
        ====================================================================== */}
        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveProperty}
              className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 h-fit"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-xl font-bold text-[#07142B] flex items-center gap-2">
                  {editingPropertyId ? (
                    <>
                      <Edit3 className="w-5 h-5 text-[#EAB308]" />
                      <span>Edit Property ({editingPropertyId})</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-[#0A1D42]" />
                      <span>Add New Property / Land</span>
                    </>
                  )}
                </h3>
                {editingPropertyId && (
                  <button
                    type="button"
                    onClick={resetPropertyForm}
                    className="text-xs font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="e.g. 4-Bedroom Detached Duplex in Egbeda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price in NGN (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={propPrice}
                    onChange={(e) => setPropPrice(e.target.value)}
                    placeholder="115000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value as PropertyType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Land">Land</option>
                    <option value="Co-Ownership">Co-Ownership</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lagos Corridor
                  </label>
                  <select
                    value={propArea}
                    onChange={(e) => setPropArea(e.target.value as LocationArea)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="Ajah">Ajah</option>
                    <option value="Lekki">Lekki</option>
                    <option value="Egbeda">Egbeda</option>
                    <option value="Akowonjo">Akowonjo</option>
                    <option value="Agbara">Agbara</option>
                    <option value="Ibeju-Lekki">Ibeju-Lekki</option>
                    <option value="Epe">Epe</option>
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Ikoyi">Ikoyi</option>
                    <option value="Ikeja GRA">Ikeja GRA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Size (SQM)
                  </label>
                  <input
                    type="number"
                    value={propSqm}
                    onChange={(e) => setPropSqm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={propBeds}
                    onChange={(e) => setPropBeds(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={propBaths}
                    onChange={(e) => setPropBaths(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Address / Axis *
                </label>
                <input
                  type="text"
                  required
                  value={propLocation}
                  onChange={(e) => setPropLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              {/* Multi-Source Photo Manager: File Upload, Camera Capture, or Image URL */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-[#07142B]">
                  Property Photos (Upload File, Take Camera Photo, or Paste Link)
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {/* Hidden File Upload Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileOrCameraUpload(e, (url) =>
                        setPropImages((prev) => [url, ...prev])
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#0A1D42] text-xs font-bold text-[#07142B] cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#0A1D42]" />
                    <span>{isUploadingImage ? 'Optimizing...' : 'Upload Photo'}</span>
                  </button>

                  {/* Hidden Camera Capture Input */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) =>
                      handleFileOrCameraUpload(e, (url) =>
                        setPropImages((prev) => [url, ...prev])
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-[#0A1D42] text-xs font-bold text-[#07142B] cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#EAB308]" />
                    <span>Take Camera Photo</span>
                  </button>
                </div>

                {/* Add Image Link */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 rounded-xl bg-[#0A1D42] text-[#FACC15] text-xs font-bold cursor-pointer"
                  >
                    Add Link
                  </button>
                </div>

                {/* Thumbnails Preview */}
                {propImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {propImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-white"
                      >
                        <SafeImage
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPropImages((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#07142B]/85 text-[#FACC15] text-[9px] font-bold">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  placeholder="Highlight title documents, infrastructure, and investment potential..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-[#FACC15] font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>
                  {editingPropertyId ? 'Save Property Changes' : 'Publish Property Listing'}
                </span>
              </button>
            </form>

            {/* Existing Properties List with Edit & Delete */}
            <div className="lg:col-span-7 space-y-3">
              {properties.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <SafeImage
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded bg-[#FACC15] text-[#07142B]">
                          {p.id}
                        </span>
                        <span className="text-xs font-semibold text-[#0A1D42]">{p.type}</span>
                        <span className="text-xs font-bold text-slate-500">• {p.area}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#07142B] truncate mt-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono-tech">{p.priceFormatted}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEditProperty(p)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[#0A1D42] bg-blue-50 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteProperty(p.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      aria-label="Delete property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: CO-OWNERSHIP SYNDICATES MANAGER
        ====================================================================== */}
        {activeTab === 'coownership' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveCoOwnership}
              className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 h-fit"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-xl font-bold text-[#07142B]">
                  {editingCoId ? `Edit Pool (${editingCoId})` : 'Add Co-Ownership Pool'}
                </h3>
                {editingCoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCoId(null);
                      setCoTitle('');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pool Title *</label>
                <input
                  type="text"
                  required
                  value={coTitle}
                  onChange={(e) => setCoTitle(e.target.value)}
                  placeholder="e.g. Akowonjo–Egbeda Executive Rental Pool"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={coLocation}
                  onChange={(e) => setCoLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price Per Slot *
                  </label>
                  <input
                    type="text"
                    required
                    value={coPricePerSlot}
                    onChange={(e) => setCoPricePerSlot(e.target.value)}
                    placeholder="₦9,000,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Asset Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={coTotalValue}
                    onChange={(e) => setCoTotalValue(e.target.value)}
                    placeholder="₦180,000,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Slots
                  </label>
                  <input
                    type="number"
                    value={coTotalSlots}
                    onChange={(e) => setCoTotalSlots(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Slots
                  </label>
                  <input
                    type="number"
                    value={coAvailableSlots}
                    onChange={(e) => setCoAvailableSlots(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Projected Yield
                  </label>
                  <input
                    type="text"
                    value={coProjectedYield}
                    onChange={(e) => setCoProjectedYield(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum Hold
                  </label>
                  <input
                    type="text"
                    value={coMinimumHold}
                    onChange={(e) => setCoMinimumHold(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coImage}
                    onChange={(e) => setCoImage(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-blue-50 text-[#0A1D42] text-xs font-bold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileOrCameraUpload(e, (url) => setCoImage(url))}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-[#FACC15] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {editingCoId ? 'Save Co-Ownership Changes' : 'Publish Co-Ownership Pool'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {coOwnershipAssets.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <SafeImage src={c.image} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded bg-[#FACC15] text-[#07142B]">
                        {c.id}
                      </span>
                      <h4 className="font-bold text-sm text-[#07142B] truncate mt-1">{c.title}</h4>
                      <p className="text-xs text-slate-500">
                        {c.pricePerSlot} / Slot • {c.availableSlots} of {c.totalSlots} Open
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEditCo(c)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[#0A1D42] bg-blue-50 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteCoOwnershipAsset(c.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: ESTATE DEVELOPMENTS MANAGER
        ====================================================================== */}
        {activeTab === 'developments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveDevelopment}
              className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 h-fit"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-xl font-bold text-[#07142B]">
                  {editingDevId ? `Edit Estate (${editingDevId})` : 'Add Estate Development'}
                </h3>
                {editingDevId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDevId(null);
                      setDevName('');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estate Name *</label>
                <input
                  type="text"
                  required
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  placeholder="e.g. Etosmania Gold Crest Courts"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline *</label>
                <input
                  type="text"
                  required
                  value={devTagline}
                  onChange={(e) => setDevTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={devLocation}
                    onChange={(e) => setDevLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Starting Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={devStartingPrice}
                    onChange={(e) => setDevStartingPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={devStatus}
                    onChange={(e) =>
                      setDevStatus(e.target.value as 'Ongoing' | 'Completed' | 'Upcoming')
                    }
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Units</label>
                  <input
                    type="number"
                    value={devTotalUnits}
                    onChange={(e) => setDevTotalUnits(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Units Left</label>
                  <input
                    type="number"
                    value={devAvailableUnits}
                    onChange={(e) => setDevAvailableUnits(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hero Image (URL or Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={devHeroImage}
                    onChange={(e) => setDevHeroImage(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-blue-50 text-[#0A1D42] text-xs font-bold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileOrCameraUpload(e, (url) => setDevHeroImage(url))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={devDesc}
                  onChange={(e) => setDevDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-[#FACC15] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {editingDevId ? 'Save Development Changes' : 'Publish Development'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {developments.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <SafeImage
                        src={d.heroImage}
                        alt={d.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded bg-[#FACC15] text-[#07142B]">
                        {d.id} • {d.status}
                      </span>
                      <h4 className="font-bold text-sm text-[#07142B] truncate mt-1">{d.name}</h4>
                      <p className="text-xs text-slate-500">{d.startingPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEditDev(d)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[#0A1D42] bg-blue-50 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteDevelopment(d.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: SERVICES PILLARS MANAGER
        ====================================================================== */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveService}
              className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 h-fit"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif-luxury text-xl font-bold text-[#07142B]">
                  {editingServiceId ? 'Edit Service Pillar' : 'Add Service Pillar'}
                </h3>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingServiceId(null);
                      setSrvTitle('');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Number</label>
                  <input
                    type="text"
                    value={srvNumber}
                    onChange={(e) => setSrvNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={srvTitle}
                    onChange={(e) => setSrvTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Summary *
                </label>
                <input
                  type="text"
                  required
                  value={srvShortDesc}
                  onChange={(e) => setSrvShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={srvDescription}
                  onChange={(e) => setSrvDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={srvCtaText}
                  onChange={(e) => setSrvCtaText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-[#FACC15] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {editingServiceId ? 'Update Service Pillar' : 'Add Service Pillar'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded bg-[#FACC15] text-[#07142B]">
                      Pillar {s.number}
                    </span>
                    <h4 className="font-bold text-sm text-[#07142B] mt-1">{s.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{s.shortDesc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEditService(s)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[#0A1D42] bg-blue-50 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteService(s.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: GLOBAL WEBSITE & HERO STYLE CMS
        ====================================================================== */}
        {activeTab === 'cms' && (
          <form
            onSubmit={handleSaveSiteConfig}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl"
          >
            <div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#07142B]">
                Hero Layout &amp; Global Website Content Editor
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Switch between a Full-Bleed Architectural Image Hero and the Picture-in-Picture
                Split Hero, or customize your headlines, Mission, Vision, and office details.
              </p>
            </div>

            {/* Hero Layout Mode Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Landing Page Hero Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCmsConfig({ ...cmsConfig, heroStyle: 'full-bleed' })}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    cmsConfig.heroStyle === 'full-bleed'
                      ? 'bg-[#0A1D42] text-white border-[#0A1D42] shadow-md'
                      : 'bg-slate-50 text-[#07142B] border-slate-200'
                  }`}
                >
                  <p className="font-bold text-sm">Full-Bleed Image Hero (Words on Image)</p>
                  <p
                    className={`text-xs mt-1 ${
                      cmsConfig.heroStyle === 'full-bleed'
                        ? 'text-blue-100/80'
                        : 'text-slate-500'
                    }`}
                  >
                    Immersive full-screen luxury residence backdrop with typography overlaid.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCmsConfig({ ...cmsConfig, heroStyle: 'split' })}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    cmsConfig.heroStyle === 'split'
                      ? 'bg-[#0A1D42] text-white border-[#0A1D42] shadow-md'
                      : 'bg-slate-50 text-[#07142B] border-slate-200'
                  }`}
                >
                  <p className="font-bold text-sm">Picture-in-Picture Split Hero</p>
                  <p
                    className={`text-xs mt-1 ${
                      cmsConfig.heroStyle === 'split' ? 'text-blue-100/80' : 'text-slate-500'
                    }`}
                  >
                    Left editorial headline with dual framed architectural showcase cards on right.
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hero Top Badge
                </label>
                <input
                  type="text"
                  value={cmsConfig.heroBadge}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, heroBadge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hero Headline Line 1
                </label>
                <input
                  type="text"
                  value={cmsConfig.heroTitleLine1}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, heroTitleLine1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Gold Highlight Line
              </label>
              <input
                type="text"
                value={cmsConfig.heroTitleHighlight}
                onChange={(e) =>
                  setCmsConfig({ ...cmsConfig, heroTitleHighlight: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={cmsConfig.heroSubtitle}
                onChange={(e) => setCmsConfig({ ...cmsConfig, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Primary Image (Upload, Camera, or Link)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cmsConfig.heroImage}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, heroImage: e.target.value })}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <label className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#0A1D42] text-xs font-bold cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileOrCameraUpload(e, (url) =>
                        setCmsConfig({ ...cmsConfig, heroImage: url })
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={cmsConfig.missionStatement}
                  onChange={(e) =>
                    setCmsConfig({ ...cmsConfig, missionStatement: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={3}
                  value={cmsConfig.visionStatement}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, visionStatement: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Head Office Address
                </label>
                <input
                  type="text"
                  value={cmsConfig.headOfficeAddress}
                  onChange={(e) =>
                    setCmsConfig({ ...cmsConfig, headOfficeAddress: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={cmsConfig.contactEmail}
                  onChange={(e) => setCmsConfig({ ...cmsConfig, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3.5 px-6 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-[#FACC15] font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Global Website Settings</span>
            </button>
          </form>
        )}

        {/* =====================================================================
            TAB 6: BOOKINGS & INQUIRIES
        ====================================================================== */}
        {activeTab === 'leads' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-xl font-bold text-[#07142B]">
                Inspection Bookings ({bookings.length})
              </h3>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-sm text-slate-500 border border-slate-200">
                  No inspection bookings logged yet.
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-xs font-bold text-[#0A1D42]">
                        {b.id} • {b.inspectionType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700">
                        {b.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-[#07142B]">{b.clientName}</h4>
                    <p className="text-xs text-slate-600">
                      Property: <strong>{b.propertyTitle}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Date: {b.preferredDate} at {b.preferredTime} • Tel: {b.clientPhone}
                    </p>
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                        className="px-3 py-1.5 rounded-lg bg-[#0A1D42] text-[#FACC15] text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Confirmed</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-serif-luxury text-xl font-bold text-[#07142B]">
                Direct Advisory Inquiries ({inquiries.length})
              </h3>
              {inquiries.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-sm text-slate-500 border border-slate-200">
                  No contact inquiries submitted yet.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2"
                  >
                    <span className="font-mono-tech text-xs font-bold text-[#0A1D42]">
                      {inq.id} • {inq.serviceCategory} ({inq.budgetRange})
                    </span>
                    <h4 className="font-bold text-base text-[#07142B]">{inq.fullName}</h4>
                    <p className="text-xs text-slate-500">
                      {inq.email} • {inq.phone}
                    </p>
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                      {inq.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
