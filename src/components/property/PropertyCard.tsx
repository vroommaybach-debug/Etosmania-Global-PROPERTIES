import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ArrowUpRight,
  Bookmark,
  MessageCircle,
  Calendar,
  Users,
} from 'lucide-react';
import { Property, CurrencyCode } from '../../types';
import { formatPriceByCurrency, formatNumberWithCommas } from '../../utils/formatters';
import { getWhatsAppUrl, getPropertyWhatsAppMessage } from '../../utils/whatsapp';
import { useUI } from '../../context/UIContext';
import { SafeImage } from '../common/SafeImage';

interface PropertyCardProps {
  property: Property;
  currency?: CurrencyCode;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, currency = 'NGN' }) => {
  const { openInspectionModal, savedIds, toggleSavedProperty } = useUI();
  const isSaved = savedIds.includes(property.id);

  const whatsappUrl = getWhatsAppUrl(
    getPropertyWhatsAppMessage({
      title: property.title,
      location: property.location,
      id: property.id,
      priceFormatted: formatPriceByCurrency(property.price, 'NGN'),
    })
  );

  // Build concise inline metadata string with middot separators (Zero-Pill Discipline)
  const specsList: string[] = [property.type];
  if (property.bedrooms > 0) {
    specsList.push(`${property.bedrooms} Beds`);
  }
  if (property.bathrooms > 0) {
    specsList.push(`${property.bathrooms} Baths`);
  }
  specsList.push(`${formatNumberWithCommas(property.sqm)} SQM`);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-purple-100/90 hover:border-[#D4AF37] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-[#1E0938]">
          <Link to={`/properties/${property.slug}`} className="block w-full h-full">
            <SafeImage
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120721]/85 via-[#120721]/20 to-transparent" />
          </Link>

          {/* Top Bar: Single Title Document Label & Bookmark Button */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider font-semibold bg-[#18062C]/90 text-[#F59E0B] backdrop-blur-md border border-[#D4AF37]/40">
              {property.titleDocument}
            </span>

            <button
              type="button"
              onClick={() => toggleSavedProperty(property.id)}
              aria-label={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
              className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#D4AF37] text-[#120721] shadow-md'
                  : 'bg-[#120721]/60 text-white hover:bg-[#3B0764]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#120721]' : ''}`} />
            </button>
          </div>

          {/* Bottom Image Overlay: Price & Co-Ownership availability */}
          <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2 pointer-events-none">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200/90 block">
                {property.status === 'Off-Plan' ? 'Off-Plan Guide Price' : 'Outright Guide Price'}
              </span>
              <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                {formatPriceByCurrency(property.price, currency)}
              </p>
            </div>

            {property.coOwnershipEligible && property.pricePerSlot && (
              <Link
                to="/co-ownership"
                className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#D4AF37] text-[#120721] text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#F59E0B] transition-colors"
              >
                <Users className="w-3 h-3" />
                <span>Slot: {formatPriceByCurrency(property.pricePerSlot, currency)}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Content Body — Capped at 4 clean data points */}
        <div className="p-5 sm:p-6">
          {/* 1. Location & Asset ID */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#4C1D95]">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">{property.address}</span>
            </span>
            <span className="font-mono text-[11px] text-slate-400 shrink-0 ml-2">{property.id}</span>
          </div>

          {/* 2. Property Title */}
          <Link to={`/properties/${property.slug}`}>
            <h3 className="font-serif text-xl font-bold text-[#120721] group-hover:text-[#4C1D95] transition-colors line-clamp-2 leading-snug mb-3">
              {property.title}
            </h3>
          </Link>

          {/* 3. Unboxed Inline Specs with Middot Separators */}
          <p className="text-xs font-mono text-slate-600 pt-3 border-t border-purple-100">
            {specsList.join(' · ')}
          </p>
        </div>
      </div>

      {/* Action Footer with Direct WhatsApp & Booking CTAs */}
      <div className="px-5 sm:px-6 pb-5 pt-1 grid grid-cols-3 gap-2">
        <Link
          to={`/properties/${property.slug}`}
          className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-lg bg-[#FAF9FC] hover:bg-purple-50 text-[#2E1065] border border-purple-200/80 text-xs font-semibold transition-colors whitespace-nowrap"
        >
          <span>Dossier</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() =>
            openInspectionModal({
              title: property.title,
              location: property.location,
              id: property.id,
            })
          }
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Inspect</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </article>
  );
};
