import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Users,
  Sparkles,
  CheckCircle2,
  Compass,
  TrendingUp,
  Home,
  Building,
  Briefcase,
  Award,
  Calendar,
  ChevronRight,
  ChevronDown,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  ETOSMANIA_CONTACT,
  TESTIMONIALS,
  LAGOS_CORRIDOR_HIGHLIGHTS,
} from '../data/mockData';
import { PropertyCard } from '../components/property/PropertyCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { SafeImage } from '../components/common/SafeImage';
import { AfrocentricPattern } from '../components/common/AfrocentricPattern';
import { getWhatsAppUrl, getCoOwnershipWhatsAppUrl } from '../utils/whatsapp';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass,
  TrendingUp,
  Home,
  Users,
  Building,
  Briefcase,
  ShieldCheck,
  Award,
};

export const HomePage: React.FC = () => {
  const {
    properties,
    services,
    coOwnershipAssets,
    siteConfig,
    updateSiteConfig,
    openInspectionModal,
  } = useData();
  const navigate = useNavigate();

  // Hero Filter Bar State
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Interactive 8-Service Explorer State
  const [activeServiceIndex, setActiveServiceIndex] = useState<number>(0);

  // Interactive Co-Ownership Slot Simulator State
  const [slotCount, setSlotCount] = useState<number>(2);
  const baseSlotPriceMillions = 9; // ₦9M per slot
  const projectedYieldPercent = 19.5;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedType !== 'All') params.set('type', selectedType);
    if (selectedArea !== 'All') params.set('location', selectedArea);
    if (searchKeyword.trim()) params.set('search', searchKeyword.trim());
    navigate(`/properties?${params.toString()}`);
  };

  const toggleHeroStyle = () => {
    const nextStyle = siteConfig.heroStyle === 'full-bleed' ? 'split' : 'full-bleed';
    updateSiteConfig({ ...siteConfig, heroStyle: nextStyle });
  };

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);
  const activeService = services[activeServiceIndex] || services[0];
  const isFullBleed = siteConfig.heroStyle !== 'split';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =====================================================================
          1. HERO SECTION — SUPPORTS FULL-BLEED IMAGE OR SPLIT PICTURE-IN-PICTURE
      ====================================================================== */}
      <section className="relative bg-[#07142B] text-white overflow-hidden pt-8 pb-20 lg:py-24 border-b-4 border-[#FACC15]">
        {isFullBleed ? (
          /* Full-Bleed Architectural Hero Backdrop */
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={siteConfig.heroImage}
              alt="Etosmania Global Properties Luxury Residence"
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07142B]/95 via-[#0A1D42]/85 to-[#07142B]/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07142B] via-transparent to-[#07142B]/50" />
          </div>
        ) : (
          <>
            <AfrocentricPattern className="absolute inset-0" opacity={0.05} />
            <div className="absolute inset-0 royal-gradient-bg pointer-events-none" />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Hero Mode Switcher Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FACC15] text-[#07142B] font-extrabold text-[11px] uppercase tracking-[0.2em] shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#07142B]" />
              <span>{siteConfig.heroBadge || 'Real Estate Gold • Lagos, Nigeria'}</span>
            </div>

            <button
              type="button"
              onClick={toggleHeroStyle}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-[#FACC15]/40 text-[11px] font-mono-tech text-[#FACC15] backdrop-blur-md transition-all cursor-pointer"
              title="Switch between Full-Bleed Hero and Picture-in-Picture Split View"
            >
              {isFullBleed ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>Switch to Split Hero</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>Switch to Full-Image Hero</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy & Search Console */}
            <div className={`${isFullBleed ? 'lg:col-span-8' : 'lg:col-span-7'} space-y-6`}>
              <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-[66px] font-bold tracking-tight leading-[1.04]">
                {siteConfig.heroTitleLine1}{' '}
                <span className="gold-gradient-text block mt-1">
                  {siteConfig.heroTitleHighlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-blue-50/95 max-w-2xl leading-relaxed font-normal">
                {siteConfig.heroSubtitle}
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] font-extrabold text-sm uppercase tracking-wider shadow-xl transition-all"
                >
                  <span>Explore Portfolio</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/co-ownership"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-blue-50 text-[#07142B] font-extrabold text-sm uppercase tracking-wider transition-all shadow-md"
                >
                  <Users className="w-4 h-4 text-[#0A1D42]" />
                  <span>Co-Ownership Slots</span>
                </Link>

                <a
                  href={getWhatsAppUrl(
                    'Hello Etosmania Global Properties, I am visiting your website and would like to inquire about Real Estate Gold opportunities in Lagos.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{siteConfig.whatsappCtaLabel || 'Chat on WhatsApp'}</span>
                </a>
              </div>

              {/* Clean 3-Metric Trust Strip */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/15 max-w-xl">
                <div>
                  <p className="font-mono-tech text-xl sm:text-2xl font-bold text-[#FACC15]">
                    100% Title
                  </p>
                  <p className="text-xs text-blue-100/80 mt-0.5">
                    C of O &amp; Governor&apos;s Consent
                  </p>
                </div>
                <div>
                  <p className="font-mono-tech text-xl sm:text-2xl font-bold text-white">
                    ₦5M Entry
                  </p>
                  <p className="text-xs text-blue-100/80 mt-0.5">
                    Fractional Co-Ownership
                  </p>
                </div>
                <div>
                  <p className="font-mono-tech text-xl sm:text-2xl font-bold text-[#FACC15]">
                    6+ Corridors
                  </p>
                  <p className="text-xs text-blue-100/80 mt-0.5">
                    Island &amp; Mainland Lagos
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Split Picture-in-Picture OR Floating Glass Card */}
            {!isFullBleed ? (
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative rounded-3xl p-2 bg-gradient-to-br from-[#FACC15] via-[#EAB308] to-[#0A1D42] shadow-2xl">
                    <div className="rounded-[20px] overflow-hidden aspect-[4/4.3] relative bg-[#07142B]">
                      <SafeImage
                        src={siteConfig.heroImage}
                        alt="Luxury Contemporary Duplex in Lagos by Etosmania Global Properties"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07142B]/90 via-transparent to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#07142B]/90 backdrop-blur-md border border-[#FACC15]/40">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#FACC15] block">
                              Featured Signature Asset
                            </span>
                            <h2 className="font-serif-luxury text-lg font-bold text-white">
                              The Sovereign Gold Villa, Ajah
                            </h2>
                          </div>
                          <span className="font-mono-tech text-sm font-bold px-3 py-1.5 rounded-lg bg-[#FACC15] text-[#07142B]">
                            ₦165M
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Overlapping Picture-in-Picture Card */}
                  <div className="hidden sm:block absolute -top-6 -right-6 w-44 rounded-2xl p-1.5 bg-white shadow-2xl border-2 border-[#FACC15]">
                    <div className="rounded-xl overflow-hidden aspect-[4/3]">
                      <SafeImage
                        src={siteConfig.heroSecondaryImage}
                        alt="Modern Terrace Residence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 text-[#07142B]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#0A1D42]">
                        Co-Ownership Open
                      </p>
                      <p className="text-xs font-extrabold truncate">19.5% Annual Yield</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-4 hidden lg:flex flex-col justify-end">
                <div className="p-6 rounded-3xl bg-[#07142B]/85 backdrop-blur-xl border border-[#FACC15]/40 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#FACC15] text-[#07142B] font-mono-tech text-[10px] font-extrabold uppercase tracking-widest">
                      Featured Mandate
                    </span>
                    <span className="text-xs font-mono-tech text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Title
                    </span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl font-bold text-white leading-snug">
                    Island &amp; Mainland Luxury Residences
                  </h2>
                  <p className="text-xs text-blue-100/85 leading-relaxed">
                    Inspect our verified duplexes, commercial plazas, and dry serviced plots across Ajah, Lekki, Egbeda, Akowonjo &amp; Agbara.
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-white/15">
                    <div>
                      <p className="text-[10px] font-mono-tech uppercase text-blue-200/70">
                        Entry From
                      </p>
                      <p className="font-mono-tech text-xl font-bold text-[#FACC15]">
                        ₦18.5M – ₦195M
                      </p>
                    </div>
                    <button
                      onClick={() => openInspectionModal()}
                      className="px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] text-xs font-extrabold transition-all cursor-pointer"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Property Filter Bar */}
          <div className="mt-12 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-[#FACC15]">
            <form
              onSubmit={handleHeroSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center"
            >
              <div className="lg:col-span-4">
                <label className="block text-[10px] font-mono-tech uppercase tracking-wider text-slate-500 mb-1">
                  Search Keyword or Estate
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#0A1D42] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Try 'Egbeda', 'Akowonjo', 'Agbara', 'Ajah'..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#0A1D42]"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[10px] font-mono-tech uppercase tracking-wider text-slate-500 mb-1">
                  Property Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:border-[#0A1D42]"
                >
                  <option value="All">All Property Categories</option>
                  <option value="Residential">Residential Homes &amp; Duplexes</option>
                  <option value="Land">Verified Dry Land Plots</option>
                  <option value="Co-Ownership">Real Estate Co-Ownership</option>
                  <option value="Commercial">Commercial Properties</option>
                  <option value="Investment">High-Yield Investment</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[10px] font-mono-tech uppercase tracking-wider text-slate-500 mb-1">
                  Lagos Corridor
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#0A1D42] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:border-[#0A1D42]"
                  >
                    <option value="All">All Lagos Corridors</option>
                    <option value="Ajah">Ajah / Thomas Estate</option>
                    <option value="Lekki">Lekki Phase 1 &amp; Chevron</option>
                    <option value="Egbeda">Egbeda (Mainland Prime)</option>
                    <option value="Akowonjo">Akowonjo (Shasha–Dopemu Axis)</option>
                    <option value="Agbara">Agbara (Industrial &amp; Residential)</option>
                    <option value="Ibeju-Lekki">Ibeju-Lekki (C of O Land)</option>
                    <option value="Epe">Epe Land Banking</option>
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Ikoyi">Ikoyi</option>
                    <option value="Ikeja GRA">Ikeja GRA</option>
                  </select>
                </div>
              </div>

              <div className="lg:col-span-2 pt-2 sm:pt-5">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-[#FACC15] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. STRATEGIC LAGOS CORRIDORS (AJAH, LEKKI, EGBEDA, AKOWONJO, AGBARA)
      ====================================================================== */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <SectionHeading
              subtitle="Island & Mainland Coverage"
              title="Strategic Lagos Real Estate Corridors."
              description="From our headquarters in Thomas Estate, Ajah to high-demand residential and commercial hubs in Egbeda, Akowonjo, Agbara, and Lekki."
            />
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0"
            >
              <span>View All Corridors</span>
              <ArrowUpRight className="w-4 h-4 text-[#FACC15]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LAGOS_CORRIDOR_HIGHLIGHTS.map((corridor) => {
              const count = properties.filter((p) => p.area === corridor.area).length;
              return (
                <Link
                  key={corridor.area}
                  to={`/properties?location=${encodeURIComponent(corridor.area)}`}
                  className="group p-6 rounded-2xl bg-[#F8FAFC] hover:bg-[#07142B] border border-slate-200 hover:border-[#FACC15] transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono-tech font-extrabold uppercase tracking-wider bg-[#FACC15] text-[#07142B]">
                        {corridor.tag}
                      </span>
                      <span className="text-xs font-mono-tech font-bold text-[#0A1D42] group-hover:text-[#FACC15]">
                        {count > 0 ? `${count} Active Listing${count > 1 ? 's' : ''}` : 'Available'}
                      </span>
                    </div>

                    <h3 className="font-serif-luxury text-2xl font-bold text-[#07142B] group-hover:text-white flex items-center justify-between">
                      <span>{corridor.area}</span>
                      <ArrowUpRight className="w-5 h-5 text-[#0A1D42] group-hover:text-[#FACC15] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs font-semibold text-[#1D4ED8] group-hover:text-[#FACC15] mt-0.5">
                      {corridor.zone}
                    </p>
                    <p className="text-sm text-slate-600 group-hover:text-blue-100/85 mt-3 leading-relaxed">
                      {corridor.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200/80 group-hover:border-white/15 flex items-center justify-between text-xs font-bold text-[#0A1D42] group-hover:text-[#FACC15]">
                    <span>Explore {corridor.area} Portfolio</span>
                    <span>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. INTERACTIVE 8-PILLAR SERVICES EXPLORER
             Mobile-First Accordion + Desktop Interactive Split View
      ====================================================================== */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeading
            subtitle="What You Are Looking For"
            title="8 Core Real Estate Pillars Under One Roof."
            description="Every service offered by Etosmania Global Properties Investment Limited is structured to protect your capital, verify your title, and multiply your real estate wealth."
          />
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0A1D42] hover:text-[#1D4ED8] shrink-0"
          >
            <span>View Full Services Breakdown</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* MOBILE & TABLET INLINE ACCORDION (< lg) */}
        <div className="lg:hidden space-y-3">
          {services.map((service, idx) => {
            const IconComponent = ICON_MAP[service.iconName] || Compass;
            const isActive = idx === activeServiceIndex;
            return (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isActive
                    ? 'bg-[#07142B] text-white border-[#FACC15] shadow-xl'
                    : 'bg-white text-[#07142B] border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveServiceIndex(idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-[#FACC15] text-[#07142B]'
                          : 'bg-blue-50 text-[#0A1D42]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-mono-tech uppercase tracking-widest block ${
                          isActive ? 'text-[#FACC15]' : 'text-slate-400'
                        }`}
                      >
                        Pillar {service.number}
                      </span>
                      <h3 className="font-bold text-base leading-snug">{service.title}</h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isActive ? 'rotate-180 text-[#FACC15]' : 'text-slate-400'
                    }`}
                  />
                </button>

                {isActive && (
                  <div className="px-4 pb-5 pt-2 border-t border-white/10 space-y-4 animate-in fade-in duration-200">
                    <p className="text-sm text-blue-100/90 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-2 bg-white/[0.06] p-3.5 rounded-xl border border-white/10">
                      <p className="text-[10px] font-mono-tech uppercase tracking-widest text-[#FACC15] font-bold">
                        Key Client Deliverables:
                      </p>
                      {service.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-white/90">
                          <CheckCircle2 className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <a
                        href={getWhatsAppUrl(service.whatsappPrompt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>{service.ctaText}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => openInspectionModal({ id: service.id, title: service.title })}
                        className="py-3 px-4 rounded-xl bg-[#FACC15] text-[#07142B] font-bold text-xs"
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DESKTOP INTERACTIVE SPLIT VIEW (>= lg) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Selector Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
            {services.map((service, idx) => {
              const IconComponent = ICON_MAP[service.iconName] || Compass;
              const isActive = idx === activeServiceIndex;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveServiceIndex(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    isActive
                      ? 'bg-[#0A1D42] text-white border-[#0A1D42] shadow-xl scale-[1.01]'
                      : 'bg-white text-[#07142B] border-slate-200/90 hover:border-[#0A1D42]/40 hover:bg-blue-50/40'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#FACC15] text-[#07142B]'
                        : 'bg-blue-50 text-[#0A1D42]'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono-tech text-[11px] font-bold ${
                          isActive ? 'text-[#FACC15]' : 'text-slate-400'
                        }`}
                      >
                        {service.number}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-[#FACC15] translate-x-0.5' : 'text-slate-300'
                        }`}
                      />
                    </div>
                    <h3 className="font-bold text-base mt-0.5 leading-snug">{service.title}</h3>
                    <p
                      className={`text-xs mt-1 line-clamp-2 ${
                        isActive ? 'text-blue-100/85' : 'text-slate-500'
                      }`}
                    >
                      {service.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Service Spotlight Panel */}
          {activeService && (
            <div className="lg:col-span-5 bg-[#07142B] text-white rounded-3xl p-8 border-2 border-[#FACC15] shadow-2xl sticky top-28 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-mono-tech text-xs font-extrabold uppercase tracking-widest">
                  Pillar {activeService.number} of 0{services.length}
                </span>
                <span className="text-xs text-[#FACC15] font-mono-tech">
                  Etosmania Global Desk
                </span>
              </div>

              <div>
                <h3 className="font-serif-luxury text-3xl font-bold text-white">
                  {activeService.title}
                </h3>
                <p className="text-sm text-blue-100/85 mt-3 leading-relaxed">
                  {activeService.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <p className="text-xs font-mono-tech uppercase tracking-widest text-[#FACC15] font-bold">
                  Key Client Deliverables:
                </p>
                {activeService.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-blue-50">
                    <CheckCircle2 className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={getWhatsAppUrl(activeService.whatsappPrompt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{activeService.ctaText}</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    openInspectionModal({
                      id: activeService.id,
                      title: activeService.title,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#07142B]" />
                  <span>Book Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          4. FEATURED PROPERTIES CATALOG
      ====================================================================== */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              subtitle="Verified Real Estate Gold"
              title="Featured Land, Luxury Homes & Commercial Assets."
              description="Every listing is vetted for clean title (C of O or Governor’s Consent) and available for physical inspection across Ajah, Lekki, Egbeda, Akowonjo, Agbara, and Ibeju-Lekki."
            />

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>View All {properties.length} Properties</span>
                <ArrowUpRight className="w-4 h-4 text-[#FACC15]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. REAL ESTATE CO-OWNERSHIP SPOTLIGHT & INTERACTIVE CALCULATOR
      ====================================================================== */}
      <section className="py-20 lg:py-24 bg-[#07142B] text-white relative overflow-hidden">
        <AfrocentricPattern className="absolute inset-0" opacity={0.04} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description & Pool Cards */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                light
                subtitle="Fractional Wealth Vehicle"
                title="Real Estate Co-Ownership: Co-Invest in Prime Assets."
                description="You don’t need ₦180M to own high-yield real estate in Ajah, Lekki, Egbeda, or Akowonjo. Subscribe to legally documented Co-Ownership slots, earn audited rental dividends, and share in capital appreciation."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {coOwnershipAssets.slice(0, 2).map((asset) => (
                  <div
                    key={asset.id}
                    className="p-5 rounded-2xl bg-white/[0.06] border border-white/15 hover:border-[#FACC15] transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tech uppercase tracking-wider text-[#FACC15]">
                        <span>{asset.id}</span>
                        <span className="px-2 py-0.5 rounded bg-[#FACC15]/20 text-[#FACC15] font-bold">
                          {asset.availableSlots} of {asset.totalSlots} Slots Left
                        </span>
                      </div>
                      <h4 className="font-serif-luxury text-lg font-bold text-white mt-2">
                        {asset.title}
                      </h4>
                      <p className="text-xs text-blue-200/80 mt-1">{asset.location}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-blue-200/70 uppercase">Entry Per Slot</p>
                        <p className="font-mono-tech text-base font-bold text-[#FACC15]">
                          {asset.pricePerSlot}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-blue-200/70 uppercase">Target Return</p>
                        <p className="font-mono-tech text-xs font-bold text-emerald-300">
                          {asset.projectedYield}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/co-ownership"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] font-extrabold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Explore All Co-Ownership Pools</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Co-Ownership Return Calculator */}
            <div className="lg:col-span-5">
              <div className="bg-white text-[#07142B] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#FACC15] space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#07142B] font-extrabold bg-[#FACC15] px-2.5 py-1 rounded">
                      Interactive Simulator
                    </span>
                    <h3 className="font-serif-luxury text-2xl font-bold mt-2">
                      Co-Ownership Return Estimator
                    </h3>
                  </div>
                  <Users className="w-8 h-8 text-[#0A1D42]" />
                </div>

                {/* Slot Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Select Number of Slots:</span>
                    <span className="font-mono-tech text-base text-[#0A1D42]">
                      {slotCount} {slotCount === 1 ? 'Slot' : 'Slots'} ({slotCount * 5}% Equity)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    value={slotCount}
                    onChange={(e) => setSlotCount(Number(e.target.value))}
                    className="w-full accent-[#0A1D42] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-tech text-slate-400">
                    <span>1 Slot (₦9M)</span>
                    <span>3 Slots (₦27M)</span>
                    <span>6 Slots (₦54M)</span>
                  </div>
                </div>

                {/* Output Breakdown */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Capital Commitment:</span>
                    <span className="font-mono-tech font-bold text-[#07142B] text-lg">
                      ₦{(slotCount * baseSlotPriceMillions).toLocaleString()},000,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Est. Annual Rental Dividend (19.5%):</span>
                    <span className="font-mono-tech font-bold text-emerald-700">
                      +₦
                      {(
                        slotCount *
                        baseSlotPriceMillions *
                        (projectedYieldPercent / 100)
                      ).toFixed(2)}
                      M / yr
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-slate-200 pt-2.5">
                    <span className="font-bold text-[#07142B]">Projected 24-Month Value:</span>
                    <span className="font-mono-tech font-extrabold text-[#0A1D42] text-lg">
                      ₦{(slotCount * baseSlotPriceMillions * 1.38).toFixed(1)}M
                    </span>
                  </div>
                </div>

                <a
                  href={getCoOwnershipWhatsAppUrl({
                    title: 'The Gold Crest Short-Let Residence Pool',
                    slots: slotCount,
                    pricePerSlot: '₦9,000,000',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#FACC15]" />
                  <span>Reserve {slotCount} Co-Ownership {slotCount === 1 ? 'Slot' : 'Slots'} on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. MISSION, VISION & CORE VALUES (FROM ETOSMANIA BLUE/YELLOW BANNER)
      ====================================================================== */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          alignment="center"
          subtitle="Our Institutional Foundation"
          title="Built on Integrity, Driven by Sustainable Community Value."
          description="Inspired by our founding mandate at 10b Thomas Estate, Ajah, Lekki, Lagos State."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#0A1D42]/15 shadow-lg relative overflow-hidden">
            <div className="inline-block px-4 py-1.5 rounded-lg bg-[#FACC15] text-[#07142B] font-serif-luxury font-bold text-sm uppercase tracking-wider mb-5">
              Our Mission
            </div>
            <p className="font-serif-luxury text-xl text-[#07142B] leading-relaxed font-medium">
              &ldquo;{siteConfig.missionStatement}&rdquo;
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-[#07142B] text-white rounded-3xl p-8 border-2 border-[#FACC15] shadow-xl relative overflow-hidden">
            <div className="inline-block px-4 py-1.5 rounded-lg bg-[#FACC15] text-[#07142B] font-serif-luxury font-bold text-sm uppercase tracking-wider mb-5">
              Our Vision
            </div>
            <p className="font-serif-luxury text-xl text-white leading-relaxed font-medium">
              &ldquo;{siteConfig.visionStatement}&rdquo;
            </p>
          </div>

          {/* Core Values Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#0A1D42]/15 shadow-lg flex flex-col justify-between">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-lg bg-[#0A1D42] text-[#FACC15] font-serif-luxury font-bold text-sm uppercase tracking-wider mb-5">
                Core Values
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(siteConfig.coreValues || ['Integrity', 'Professionalism', 'Customer Service', 'Continuous Learning']).map((val) => (
                  <div
                    key={val}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#EAB308] shrink-0" />
                    <span className="font-bold text-sm text-[#07142B]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. CLIENT TESTIMONIALS
      ====================================================================== */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            alignment="center"
            subtitle="Verified Client Stories"
            title="Trusted by Lagos Families & Global Diaspora Investors."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 flex flex-col justify-between space-y-5"
              >
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-slate-200/70">
                  <p className="font-bold text-sm text-[#07142B]">{item.author}</p>
                  <p className="text-xs text-[#0A1D42] font-semibold">{item.role}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
