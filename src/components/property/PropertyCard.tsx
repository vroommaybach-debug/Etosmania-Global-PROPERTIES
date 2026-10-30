import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  MessageCircle,
  ArrowUpRight,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { Property } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { getPropertyWhatsAppUrl } from '../../utils/whatsapp';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const isLand = property.type === 'Land';
  const isCoOwnership = property.type === 'Co-Ownership' || !!property.coOwnershipDetails;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#0A1D42]/30 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Link to={`/properties/${property.id}`} className="block w-full h-full">
          <SafeImage
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#07142B]/95 text-[#FACC15] backdrop-blur-xs border border-[#FACC15]/40">
            {property.type}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#FACC15] text-[#07142B] shadow-xs">
            {property.area}
          </span>
          {isCoOwnership && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white text-[#07142B] shadow-xs flex items-center gap-1">
              <Users className="w-3 h-3 text-[#0A1D42]" />
              <span>Co-Ownership</span>
            </span>
          )}
        </div>

        {/* Top Right Reference ID */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-white font-mono-tech text-[10px] font-medium">
            {property.id}
          </span>
        </div>

        {/* Bottom Price Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#07142B]/95 via-[#07142B]/65 to-transparent p-4 pt-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-[#FACC15]">
              {isCoOwnership ? 'Fractional Entry Price' : 'Verified Price'}
            </p>
            <p className="font-mono-tech text-xl font-bold text-white tracking-tight">
              {property.priceFormatted}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3" />
            <span>{property.status}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0A1D42] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <Link to={`/properties/${property.id}`}>
            <h3 className="font-serif-luxury text-lg font-bold text-[#07142B] group-hover:text-[#1D4ED8] transition-colors line-clamp-2 leading-snug">
              {property.title}
            </h3>
          </Link>
        </div>

        <div>
          {/* Specs Strip */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 font-medium">
            {!isLand ? (
              <>
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-[#0A1D42]" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-[#0A1D42]" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </>
            ) : (
              <div className="col-span-2 flex items-center gap-1.5 text-[#07142B] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#EAB308]" />
                <span>Dry Titled Land (C of O)</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 justify-end font-mono-tech">
              <Maximize2 className="w-3.5 h-3.5 text-[#0A1D42]" />
              <span>{property.sqm} SQM</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3.5 grid grid-cols-2 gap-2.5">
            <Link
              to={`/properties/${property.id}`}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-[#07142B] bg-[#FACC15] hover:bg-[#EAB308] border border-[#EAB308] transition-colors"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href={getPropertyWhatsAppUrl({
                id: property.id,
                title: property.title,
                location: property.location,
                priceFormatted: property.priceFormatted,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#0A1D42] hover:bg-[#07142B] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Inquire</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
