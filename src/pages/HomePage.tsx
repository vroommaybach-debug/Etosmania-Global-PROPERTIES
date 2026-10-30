import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Home,
  Users,
  Building2,
  Briefcase,
  KeyRound,
  Compass,
  ArrowRight,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Sparkles,
  Award,
  Coins,
  ChevronDown,
  Maximize2,
  Layout,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';
import { HeroStyleMode } from '../types';
import {
  ETOSMANIA_CREED,
  OFFICE_DETAILS,
  WHY_ETOSMANIA_POINTS,
} from '../data/mockData';
import { PropertyCard } from '../components/property/PropertyCard';
import { ProjectCard } from '../components/development/ProjectCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { AfrocentricPattern } from '../components/common/AfrocentricPattern';
import { SafeImage } from '../components/common/SafeImage';
import { formatNairaCompact } from '../utils/formatters';
import { getWhatsAppUrl, getGeneralWhatsAppMessage } from '../utils/whatsapp';

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  TrendingUp,
  Home,
  Users,
  Building2,
  Briefcase,
  KeyRound,
  Compass,
};

export const HomePage: React.FC = () => {
  const {
    properties,
    developments,
    coOwnershipProjects,
    services,
    testimonials,
    landingConfig,
    updateLandingConfig,
  } = useData();
  const { openInspectionModal } = useUI();
  const navigate = useNavigate();

  // Hero Layout Mode ('full-bleed' where wordings sit on full-screen image, or 'split' picture-in-picture)
  const [heroMode, setHeroMode] = useState<HeroStyleMode>(
    landingConfig.heroStyle || 'full-bleed'
  );

  useEffect(() => {
    if (landingConfig.heroStyle) {
      setHeroMode(landingConfig.heroStyle);
    }
  }, [landingConfig.heroStyle]);

  const handleToggleHeroMode = (mode: HeroStyleMode) => {
    setHeroMode(mode);
    updateLandingConfig({ heroStyle: mode });
  };

  // Hero Search State
  const [searchIntent, setSearchIntent] = useState<
    'all' | 'land' | 'residential' | 'commercial' | 'co-ownership'
  >('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<string>('all');

  // Featured Property Tab State
  const [activePortfolioTab, setActivePortfolioTab] = useState<
    'all' | 'houses' | 'land' | 'commercial'
  >('all');

  // Interactive 8-Service Pillar State
  const [activeServiceId, setActiveServiceId] = useState<string>(
    services[0]?.id || 'consultancy'
  );
  const activeService =
    services.find((s) => s.id === activeServiceId) || services[0];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchIntent === 'co-ownership') {
      navigate('/co-ownership');
      return;
    }
    const params = new URLSearchParams();
    if (searchIntent !== 'all') params.set('category', searchIntent);
    if (selectedLocation !== 'All') params.set('location', selectedLocation);
    if (maxBudget !== 'all') params.set('maxPrice', maxBudget);
    navigate(`/properties?${params.toString()}`);
  };

  const filteredFeaturedProperties = properties.filter((prop) => {
    if (activePortfolioTab === 'houses') {
      return ['Villa', 'Penthouse', 'Duplex', 'Terrace', 'Apartment'].includes(prop.type);
    }
    if (activePortfolioTab === 'land') {
      return prop.type === 'Land';
    }
    if (activePortfolioTab === 'commercial') {
      return prop.type === 'Commercial';
    }
    return true;
  });

  return (
    <div className="bg-[#FAF9FC] text-[#120721]">
      {/* 1. INTERNATIONAL ARCHITECTURAL HERO — SUPPORTS BOTH FULL-BLEED IMAGE & SPLIT FRAME */}
      <section className="relative min-h-[90vh] pt-28 pb-16 lg:pt-32 lg:pb-24 flex flex-col justify-between overflow-hidden bg-[#120721] text-white">
        {/* Background Layer for Full-Bleed Mode vs Split Mode */}
        {heroMode === 'full-bleed' ? (
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={landingConfig.heroImage}
              alt="Etosmania Luxury Real Estate Architecture"
              className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            />
            {/* Multi-layered Sovereign Purple & Obsidian Scrim so Typography Reads with Razor Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#120721]/95 via-[#18062C]/85 to-[#120721]/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120721] via-transparent to-[#120721]/50" />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#120721] via-[#240B46] to-[#3B0764]" />
            <AfrocentricPattern variant="gold" className="absolute inset-0 opacity-[0.05]" />
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* Top Utility Row: Subtle International Tag + Hero Layout Style Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-[#F59E0B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{landingConfig.heroTagline || 'Lagos · Private Wealth & Real Estate'}</span>
            </div>

            {/* Live Hero Style Switcher (Full Image vs Split Picture-in-Picture) */}
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-black/35 backdrop-blur-md border border-white/15 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => handleToggleHeroMode('full-bleed')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  heroMode === 'full-bleed'
                    ? 'bg-[#D4AF37] text-[#120721] font-bold'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Full Image Hero</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleHeroMode('split')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  heroMode === 'split'
                    ? 'bg-[#D4AF37] text-[#120721] font-bold'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <Layout className="w-3 h-3" />
                <span>Split Frame</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Typography Column (Expands wider in Full-Bleed mode) */}
            <div
              className={`${
                heroMode === 'full-bleed' ? 'lg:col-span-9' : 'lg:col-span-7'
              } space-y-6`}
            >
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight leading-[1.03]">
                Real Estate{' '}
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#FDE68A] to-[#F59E0B] bg-clip-text text-transparent">
                  Gold
                </span>{' '}
                <span className="block text-white mt-1.5 text-3xl sm:text-5xl lg:text-[54px] font-bold">
                  You Are Looking For.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-purple-100/90 leading-relaxed max-w-2xl">
                {landingConfig.heroSubheadline}
              </p>

              {/* Streamlined International CTAs (Zero Exposed Phone Numbers) */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-xl hover:opacity-95 transition-all whitespace-nowrap"
                >
                  <span>Explore Land &amp; Houses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/co-ownership"
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-[#D4AF37]/50 font-semibold text-xs uppercase tracking-wider backdrop-blur-md transition-all whitespace-nowrap"
                >
                  <Users className="w-4 h-4 text-[#F59E0B]" />
                  <span>Co-Ownership From ₦5M</span>
                </Link>

                <a
                  href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>

              {/* Clean 4-Metric Bar */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/15 max-w-3xl">
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#F59E0B]">
                    {landingConfig.stats.totalVolume}
                  </p>
                  <span className="text-xs text-purple-200/80">Integrated Divisions</span>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-white">
                    {landingConfig.stats.verifiedAssets}
                  </p>
                  <span className="text-xs text-purple-200/80">Verified Titles</span>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#F59E0B]">₦5M Entry</p>
                  <span className="text-xs text-purple-200/80">Fractional Equity</span>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-white">Ajah · Lekki</p>
                  <span className="text-xs text-purple-200/80">10B Thomas Estate HQ</span>
                </div>
              </div>
            </div>

            {/* Right Column: Picture-in-Picture Architectural Card (Only in 'split' mode) */}
            {heroMode === 'split' && (
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl aspect-[4/4.2] bg-[#18062C]">
                    <SafeImage
                      src={landingConfig.heroImage}
                      alt="Etosmania Global Properties Flagship Luxury Duplex"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120721]/90 via-[#120721]/25 to-transparent" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-md bg-[#120721]/85 text-[#F59E0B] border border-[#D4AF37]/50 text-[11px] font-mono uppercase tracking-wider font-semibold">
                        Thomas Estate, Ajah
                      </span>
                      <span className="px-3 py-1 rounded-md bg-emerald-700/90 text-white text-[11px] font-mono font-semibold">
                        Governor’s Consent
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <p className="text-xs font-mono uppercase tracking-widest text-[#F59E0B]">
                        Flagship Mandate · EGP-101
                      </p>
                      <h2 className="font-serif text-2xl font-bold mt-0.5">
                        The Sovereign Gold 5-Bed Detached Duplex
                      </h2>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-mono text-2xl font-extrabold text-[#F59E0B]">
                          ₦185,000,000
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            openInspectionModal({
                              title: 'The Sovereign Gold 5-Bedroom Detached Duplex',
                              location: 'Thomas Estate, Ajah, Lekki',
                              id: 'EGP-101',
                            })
                          }
                          className="px-4 py-2 rounded-lg bg-white text-[#120721] font-bold text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-colors cursor-pointer"
                        >
                          Book Viewing
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Streamlined International Property & Co-Ownership Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-12 bg-white/95 backdrop-blur-md text-[#120721] rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#D4AF37]/50"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
              <div className="lg:col-span-3">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Mandate Category
                </label>
                <select
                  value={searchIntent}
                  onChange={(e) => setSearchIntent(e.target.value as typeof searchIntent)}
                  className="w-full px-3.5 py-3 rounded-xl border border-purple-200 bg-[#FAF9FC] text-xs sm:text-sm font-semibold text-[#120721] focus:outline-none focus:border-[#3B0764]"
                >
                  <option value="all">All Verified Properties</option>
                  <option value="land">Sales of Land (C of O Plots)</option>
                  <option value="residential">Residential Houses &amp; Duplexes</option>
                  <option value="commercial">Commercial Properties</option>
                  <option value="co-ownership">Real Estate Co-Ownership Slots</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Preferred Corridor
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#4C1D95] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-purple-200 bg-[#FAF9FC] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3B0764]"
                  >
                    <option value="All">All Lagos Corridors</option>
                    <option value="Lekki Phase 1">Ajah / Thomas Estate / Lekki</option>
                    <option value="Ibeju-Lekki">Ibeju-Lekki Growth Axis</option>
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Ikoyi">Old Ikoyi Waterfront</option>
                    <option value="Eko Atlantic">Eko Atlantic City</option>
                    <option value="Ikeja GRA">Ikeja GRA</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Capital Budget
                </label>
                <select
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-purple-200 bg-[#FAF9FC] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#3B0764]"
                >
                  <option value="all">Any Capital Range</option>
                  <option value="50000000">Up to ₦50M (Land &amp; Co-Ownership)</option>
                  <option value="150000000">Up to ₦150M (Plots &amp; Terraces)</option>
                  <option value="300000000">Up to ₦300M (Detached Duplexes)</option>
                  <option value="1500000000">₦300M – ₦1.5B+ (Commercial &amp; Villas)</option>
                </select>
              </div>

              <div className="lg:col-span-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#3B0764] hover:bg-[#4C1D95] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-4 h-4 text-[#F59E0B]" />
                  <span>
                    {searchIntent === 'co-ownership' ? 'Simulate Slots' : 'Find Mandate'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 2. OUR 8 CORE REAL ESTATE PILLARS — MOBILE INLINE ACCORDION + DESKTOP MASTER-DETAIL */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            subtitle="Our 8 Core Real Estate Pillars"
            title="Complete Real Estate Solutions Under One Sovereign Roof"
            description="Tap any pillar below to inspect our scope of work, deliverables, and direct advisory desk."
          />
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#3B0764] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#4C1D95] transition-colors shrink-0 self-start lg:self-auto whitespace-nowrap"
          >
            <span>Explore Full Service Suite</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </Link>
        </div>

        {/* MOBILE & TABLET VIEW (< lg): Inline Accordion so selecting any number expands immediately in place! */}
        <div className="lg:hidden space-y-3">
          {services.map((service, index) => {
            const IconComponent = SERVICE_ICONS[service.iconName] || ShieldCheck;
            const isSelected = service.id === activeService?.id;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isSelected
                    ? 'bg-[#18062C] text-white border-[#D4AF37] shadow-xl'
                    : 'bg-white text-[#120721] border-purple-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveServiceId(service.id)}
                  className="w-full text-left px-4 py-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#120721]'
                          : 'bg-purple-50 text-[#4C1D95]'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-base truncate">{service.title}</p>
                      <span
                        className={`text-[11px] font-mono block truncate ${
                          isSelected ? 'text-[#F59E0B]' : 'text-slate-500'
                        }`}
                      >
                        {service.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <IconComponent
                      className={`w-4 h-4 ${
                        isSelected ? 'text-[#F59E0B]' : 'text-slate-400'
                      }`}
                    />
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isSelected ? 'rotate-180 text-[#F59E0B]' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>

                {/* Inline Expanded Content on Mobile */}
                {isSelected && (
                  <div className="px-4 pb-5 pt-2 border-t border-white/10 space-y-4 animate-in fade-in duration-200">
                    <p className="text-xs font-semibold text-[#F59E0B]">{service.tagline}</p>
                    <p className="text-xs text-purple-100/90 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                        Key Deliverables
                      </span>
                      {service.deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                          <span className="text-xs text-purple-100">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                      <a
                        href={getWhatsAppUrl(
                          service.whatsappMessage || getGeneralWhatsAppMessage()
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message {service.title} Desk</span>
                      </a>
                      <Link
                        to={
                          service.id === 'co-ownership'
                            ? '/co-ownership'
                            : `/services#${service.id}`
                        }
                        className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg bg-white/10 text-white text-xs font-semibold uppercase tracking-wider"
                      >
                        <span>{service.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DESKTOP VIEW (lg+): Side-by-Side Master-Detail Interactive Explorer */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 grid grid-cols-1 gap-2.5">
            {services.map((service, index) => {
              const IconComponent = SERVICE_ICONS[service.iconName] || ShieldCheck;
              const isSelected = service.id === activeService?.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveServiceId(service.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2E1065] text-white border-[#D4AF37] shadow-md'
                      : 'bg-white text-[#120721] border-purple-100 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#120721]'
                          : 'bg-purple-50 text-[#4C1D95]'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-base truncate">{service.title}</p>
                      <span
                        className={`text-[11px] font-mono block truncate ${
                          isSelected ? 'text-purple-200' : 'text-slate-500'
                        }`}
                      >
                        {service.category}
                      </span>
                    </div>
                  </div>
                  <IconComponent
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-[#F59E0B]' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {activeService && (
            <div className="lg:col-span-7 bg-gradient-to-br from-[#18062C] via-[#2E1065] to-[#120721] text-white rounded-2xl p-10 border border-[#D4AF37]/40 shadow-xl flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-4">
                  <span className="px-3 py-1 rounded bg-white/10 text-[#F59E0B] font-mono text-xs uppercase tracking-wider">
                    {activeService.category}
                  </span>
                  <span className="text-xs font-mono text-purple-200">
                    Etosmania Specialist Desk
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-4xl font-bold text-white mb-2">
                    {activeService.title}
                  </h3>
                  <p className="text-base font-medium text-[#F59E0B]">
                    {activeService.tagline}
                  </p>
                </div>

                <p className="text-base text-purple-100/90 leading-relaxed">
                  {activeService.description}
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-3">
                    Key Client Deliverables
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {activeService.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                        <span className="text-xs text-purple-100 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-white/15 flex flex-wrap items-center gap-3">
                <a
                  href={getWhatsAppUrl(
                    activeService.whatsappMessage || getGeneralWhatsAppMessage()
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message {activeService.title} Desk</span>
                </a>

                <Link
                  to={
                    activeService.id === 'co-ownership'
                      ? '/co-ownership'
                      : activeService.id === 'land-houses' ||
                        activeService.id === 'residential-sales' ||
                        activeService.id === 'commercial-properties'
                      ? '/properties'
                      : `/services#${activeService.id}`
                  }
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs uppercase tracking-wider transition-all whitespace-nowrap"
                >
                  <span>{activeService.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <AfrocentricPattern variant="divider" />

      {/* 3. CURATED LAND, RESIDENTIAL HOUSES & COMMERCIAL MANDATES */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeading
            subtitle="Verified Portfolio"
            title="Sales of Land, Luxury Houses & Commercial Properties"
            description="Every mandate is physically inspected and verified at the Lagos State Land Registry."
          />

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Listings' },
              { id: 'houses', label: 'Residential Houses' },
              { id: 'land', label: 'Verified Land Plots' },
              { id: 'commercial', label: 'Commercial Assets' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePortfolioTab(tab.id as typeof activePortfolioTab)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activePortfolioTab === tab.id
                    ? 'bg-[#3B0764] text-[#F59E0B] shadow-sm'
                    : 'bg-white text-slate-600 border border-purple-100 hover:border-purple-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeaturedProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#3B0764] hover:bg-[#4C1D95] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            <span>Explore Full Catalog ({properties.length} Verified Mandates)</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </Link>
        </div>
      </section>

      {/* 4. REAL ESTATE CO-OWNERSHIP SPOTLIGHT */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#18062C] via-[#2E1065] to-[#120721] text-white border-y border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <SectionHeading
              light
              subtitle="Fractional Real Estate Wealth"
              title="Co-Own Prime Lagos Properties from ₦5M Per Slot"
              description="Pool capital with vetted investors to acquire high-yield duplexes, corporate short-lets, and commercial land banks with legal SPV protection."
            />
            <Link
              to="/co-ownership"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all shrink-0 self-start lg:self-auto whitespace-nowrap"
            >
              <Coins className="w-4 h-4" />
              <span>Launch Co-Ownership Calculator</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coOwnershipProjects.slice(0, 4).map((pool) => (
              <div
                key={pool.id}
                className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/15 hover:border-[#D4AF37] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 relative overflow-hidden">
                    <SafeImage
                      src={pool.image}
                      alt={pool.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120721] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#120721]/90 text-[#F59E0B] font-mono text-[10px] uppercase font-bold border border-[#D4AF37]/40">
                      {pool.availableSlots} Slots Left
                    </span>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-mono uppercase text-purple-200 block">
                        Slot Entry Price
                      </span>
                      <p className="font-mono text-xl font-bold text-[#F59E0B]">
                        {formatNairaCompact(pool.pricePerSlot)}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block">
                      {pool.assetType}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white line-clamp-2">
                      {pool.title}
                    </h3>
                    <p className="text-xs font-mono text-emerald-400">
                      {pool.projectedAnnualYieldPct > 0
                        ? `${pool.projectedAnnualYieldPct}% Annual Yield + ${pool.projectedCapitalGrowthPct}% Growth`
                        : `${pool.projectedCapitalGrowthPct}% Projected Annual Appreciation`}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to="/co-ownership"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-[#120721] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>Simulate Returns</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MISSION, VISION & CORE VALUES CREED */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          subtitle="Our Corporate Charter"
          title="Built on Integrity, Professionalism & Community-Centered Development"
          description="Our mission, vision, and four core values guide every land allocation, residential handover, and investment portfolio we manage."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative bg-white rounded-2xl p-8 sm:p-10 border-2 border-[#3B0764] shadow-md">
            <span className="inline-block px-5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-serif font-extrabold text-sm uppercase tracking-wider mb-5 shadow-sm">
              Our Mission
            </span>
            <p className="font-serif text-xl sm:text-2xl text-[#120721] leading-relaxed font-semibold">
              “{ETOSMANIA_CREED.mission}”
            </p>
          </div>

          <div className="relative bg-white rounded-2xl p-8 sm:p-10 border-2 border-[#3B0764] shadow-md">
            <span className="inline-block px-5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-serif font-extrabold text-sm uppercase tracking-wider mb-5 shadow-sm">
              Our Vision
            </span>
            <p className="font-serif text-xl sm:text-2xl text-[#120721] leading-relaxed font-semibold">
              “{ETOSMANIA_CREED.vision}”
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ETOSMANIA_CREED.coreValues.map((val, idx) => (
            <div
              key={val.title}
              className="bg-white rounded-2xl p-6 border border-purple-100 hover:border-[#D4AF37] transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#5B21B6] font-bold">
                  Core Value 0{idx + 1}
                </span>
                <Award className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#120721] mb-2">{val.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SIGNATURE DEVELOPMENTS */}
      <section className="py-16 sm:py-24 bg-white border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <SectionHeading
              subtitle="Master-Planned Communities"
              title="Signature Estates & Serviced Land Developments"
              description="Explore our ongoing residential courts in Ajah–Lekki, serviced C of O land estates in Ibeju-Lekki, and Grade-A commercial towers in Victoria Island."
            />
            <Link
              to="/developments"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3B0764] hover:text-[#4C1D95] shrink-0"
            >
              <span>View All Developments</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>

          <div className="space-y-8">
            {developments.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY ETOSMANIA + CLIENT TESTIMONIALS */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <SectionHeading
              subtitle="The Etosmania Advantage"
              title="Why Global & Local Investors Choose Us"
              description="Whether acquiring your first plot of land in Ibeju-Lekki, moving into a 5-bedroom duplex in Ajah, or building a diaspora rental portfolio, we protect your capital at every step."
            />

            <div className="space-y-4 pt-2">
              {WHY_ETOSMANIA_POINTS.map((pt) => (
                <div
                  key={pt.number}
                  className="p-5 rounded-xl bg-white border border-purple-100 flex items-start gap-4"
                >
                  <span className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-[#3B0764] text-[#F59E0B] shrink-0">
                    {pt.number}
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#120721]">{pt.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {pt.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {testimonials.map((t) => (
                <blockquote
                  key={t.id}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4"
                >
                  <p className="font-serif text-base sm:text-lg text-[#120721] italic leading-relaxed">
                    “{t.quote}”
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-purple-50">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.author}
                        className="w-11 h-11 rounded-full object-cover border border-[#D4AF37]"
                      />
                      <div>
                        <cite className="not-italic font-serif font-bold text-sm text-[#120721] block">
                          {t.author}
                        </cite>
                        <span className="text-xs text-slate-500">
                          {t.role} · {t.location}
                        </span>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block text-[11px] font-mono text-[#4C1D95] bg-purple-50 px-3 py-1 rounded-md">
                      {t.propertyPurchased}
                    </span>
                  </div>
                </blockquote>
              ))}
            </div>

            {/* Direct Thomas Estate Ajah HQ Visit Banner (No exposed phone numbers) */}
            <div className="bg-gradient-to-r from-[#2E1065] to-[#3B0764] text-white rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] block">
                  Corporate Headquarters
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  10B Thomas Estate, Ajah, Lekki, Lagos State
                </h3>
                <p className="text-xs text-purple-200">{OFFICE_DETAILS.email}</p>
              </div>
              <div className="flex flex-wrap gap-2.5 shrink-0">
                <a
                  href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#D4AF37] text-[#120721] font-bold text-xs uppercase tracking-wider whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>
                <button
                  type="button"
                  onClick={() => openInspectionModal()}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 text-[#F59E0B]" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
