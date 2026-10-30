import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  MessageCircle,
  PhoneCall,
  ArrowLeft,
  Bookmark,
  Users,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';
import { SafeImage } from '../components/common/SafeImage';
import { LightboxModal } from '../components/gallery/LightboxModal';
import {
  formatNaira,
  formatNairaCompact,
  formatNumberWithCommas,
} from '../utils/formatters';
import {
  getWhatsAppUrl,
  getPropertyWhatsAppMessage,
  getCoOwnershipWhatsAppMessage,
} from '../utils/whatsapp';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties } = useData();
  const { openInspectionModal, savedIds, toggleSavedProperty } = useUI();

  const property = properties.find(
    (p) => p.slug === id || p.id.toLowerCase() === (id || '').toLowerCase()
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Payment Plan Simulator State
  const [depositPct, setDepositPct] = useState(30);
  const [months, setMonths] = useState(6);

  if (!property) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FAF9FC] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#120721] mb-2">
          Property Dossier Not Found
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          This property may have been recently allocated or moved. Browse our active catalog below.
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#3B0764] text-white text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </Link>
      </div>
    );
  }

  const isSaved = savedIds.includes(property.id);
  const initialDeposit = Math.round(property.price * (depositPct / 100));
  const balanceAmount = property.price - initialDeposit;
  const monthlyInstallment = months > 0 ? Math.round(balanceAmount / months) : 0;

  const whatsappUrl = getWhatsAppUrl(
    getPropertyWhatsAppMessage({
      title: property.title,
      location: property.location,
      id: property.id,
      priceFormatted: formatNaira(property.price),
    })
  );

  const coOwnWhatsappUrl = property.pricePerSlot
    ? getWhatsAppUrl(
        getCoOwnershipWhatsAppMessage({
          projectTitle: property.title,
          slots: 1,
          investmentAmount: formatNairaCompact(property.pricePerSlot),
        })
      )
    : whatsappUrl;

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#3B0764] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property &amp; Land Catalog</span>
          </Link>

          <button
            type="button"
            onClick={() => toggleSavedProperty(property.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#D4AF37] text-[#120721] border-[#D4AF37]'
                : 'bg-white text-slate-700 border-purple-200 hover:border-[#3B0764]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#120721]' : ''}`} />
            <span>{isSaved ? 'Saved in Shortlist' : 'Save to Shortlist'}</span>
          </button>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          <div
            onClick={() => setLightboxOpen(true)}
            className="lg:col-span-8 relative h-[360px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#18062C] cursor-pointer group border border-purple-200"
          >
            <SafeImage
              src={property.images[activeImageIdx] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded bg-[#18062C]/90 text-[#F59E0B] font-mono text-xs font-semibold border border-[#D4AF37]/40">
                {property.titleDocument}
              </span>
              <span className="px-3 py-1 rounded bg-emerald-700/90 text-white font-mono text-xs font-semibold">
                {property.status}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded bg-[#120721]/80 text-white text-xs font-mono">
              Click to Enlarge ({property.images.length} Photos)
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-3">
            {property.images.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative h-28 lg:h-[144px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIdx === idx
                    ? 'border-[#D4AF37] shadow-md'
                    : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <SafeImage src={img} alt={`${property.title} view ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Columns: Dossier Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500">
                <span className="inline-flex items-center gap-1.5 text-[#4C1D95] font-semibold">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  {property.address}
                </span>
                <span>Mandate Ref: {property.id}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#120721]">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-baseline justify-between gap-4 pt-2 border-t border-purple-100">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 block">
                    Outright Acquisition Price
                  </span>
                  <p className="font-mono text-3xl font-extrabold text-[#3B0764]">
                    {formatNaira(property.price)}
                  </p>
                </div>

                {property.coOwnershipEligible && property.pricePerSlot && (
                  <div className="p-3 rounded-xl bg-purple-50 border border-[#D4AF37]/50">
                    <span className="text-[10px] font-mono uppercase text-[#5B21B6] block">
                      Co-Ownership Option Available
                    </span>
                    <p className="font-mono text-lg font-bold text-[#3B0764]">
                      {formatNairaCompact(property.pricePerSlot)} / Slot
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs font-mono text-slate-600 pt-2">
                {property.type} ·{' '}
                {property.bedrooms > 0 ? `${property.bedrooms} Bedrooms · ` : ''}
                {property.bathrooms > 0 ? `${property.bathrooms} Bathrooms · ` : ''}
                {formatNumberWithCommas(property.sqm)} SQM · {property.titleDocument}
              </p>
            </div>

            {/* Description & Highlights */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#120721] mb-3">
                  Executive Overview
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="border-t border-purple-100 pt-6">
                <h3 className="font-serif text-xl font-bold text-[#120721] mb-4">
                  Key Investment &amp; Architectural Highlights
                </h3>
                <ul className="space-y-2.5">
                  {property.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#4C1D95] shrink-0 mt-1" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-purple-100 pt-6">
                <h3 className="font-serif text-xl font-bold text-[#120721] mb-4">
                  Estate Infrastructure &amp; Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#FAF9FC] border border-purple-100 text-xs font-medium text-[#2E1065] flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Structured Installment Payment Simulator */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B21B6] font-semibold block">
                    Flexible Payment Structuring
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#120721]">
                    Installment Payment Plan Simulator
                  </h3>
                </div>
                <Calculator className="w-6 h-6 text-[#D4AF37]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span>Initial Deposit Percentage</span>
                    <span className="font-bold text-[#3B0764]">{depositPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    step={10}
                    value={depositPct}
                    onChange={(e) => setDepositPct(Number(e.target.value))}
                    className="w-full accent-[#3B0764] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span>Installment Tenor</span>
                    <span className="font-bold text-[#3B0764]">{months} Months</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={12}
                    step={3}
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#18062C] text-white">
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-300 block">
                    Initial Deposit ({depositPct}%)
                  </span>
                  <p className="font-mono text-lg font-bold text-[#F59E0B]">
                    {formatNairaCompact(initialDeposit)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-300 block">
                    Balance Spread
                  </span>
                  <p className="font-mono text-lg font-bold text-white">
                    {formatNairaCompact(balanceAmount)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-300 block">
                    Monthly Payment ({months} mo)
                  </span>
                  <p className="font-mono text-lg font-bold text-emerald-400">
                    {formatNairaCompact(monthlyInstallment)} / mo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Sticky Acquisition & Co-Ownership Desk */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="bg-gradient-to-br from-[#18062C] via-[#2E1065] to-[#120721] text-white rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-xl space-y-6">
              <div className="flex items-center gap-3.5 border-b border-white/15 pb-5">
                <img
                  src={property.agent.image}
                  alt={property.agent.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F59E0B] block">
                    Lead Mandate Advisor
                  </span>
                  <h3 className="font-serif text-lg font-bold">{property.agent.name}</h3>
                  <p className="text-xs text-purple-200">{property.agent.role}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    openInspectionModal({
                      title: property.title,
                      location: property.location,
                      id: property.id,
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Physical or Live Video Viewing</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>

                {property.coOwnershipEligible && property.pricePerSlot && (
                  <a
                    href={coOwnWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F59E0B] border border-[#D4AF37]/40 font-semibold text-xs uppercase tracking-wider transition-all"
                  >
                    <Users className="w-4 h-4" />
                    <span>
                      Reserve Co-Ownership Slot ({formatNairaCompact(property.pricePerSlot)})
                    </span>
                  </a>
                )}
              </div>

              <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-xs text-purple-200 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Etosmania Title Assurance</span>
                </p>
                <p>
                  Complete survey charting and {property.titleDocument} verification dossier
                  available for inspection at 10B Thomas Estate, Ajah, Lekki.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LightboxModal
        images={property.images}
        initialIndex={activeImageIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={property.title}
      />
    </div>
  );
};
