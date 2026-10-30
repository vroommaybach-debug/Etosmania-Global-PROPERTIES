import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Calendar,
  ArrowLeft,
  Expand,
  Users,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SafeImage } from '../components/common/SafeImage';
import { LightboxModal } from '../components/gallery/LightboxModal';
import { SEOHead } from '../components/common/SEOHead';
import { buildPropertyDetailSEO } from '../utils/seoMetadata';
import { getPropertyWhatsAppUrl } from '../utils/whatsapp';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, openInspectionModal } = useData();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const property = properties.find((p) => p.id === id || p.slug === id);

  if (!property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif-luxury text-3xl font-bold text-[#07142B] mb-2">
          Property Listing Not Found
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          The property you are looking for may have been sold or reallocated.
        </p>
        <Link
          to="/properties"
          className="px-6 py-3 rounded-xl bg-[#0A1D42] text-white font-bold text-xs uppercase tracking-wider"
        >
          Back to All Properties
        </Link>
      </div>
    );
  }

  const seoConfig = buildPropertyDetailSEO(property);
  const isLand = property.type === 'Land';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <SEOHead config={seoConfig} />

      {/* Top Breadcrumb Bar */}
      <div className="bg-[#07142B] text-white py-6 border-b-2 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FACC15] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Properties Catalog</span>
          </Link>
          <span className="font-mono-tech text-xs text-blue-200">
            Reference ID: <strong className="text-[#FACC15]">{property.id}</strong> • Corridor: <strong className="text-white">{property.area}</strong>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          <div
            onClick={() => {
              setPhotoIndex(0);
              setLightboxOpen(true);
            }}
            className="lg:col-span-8 relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-200 cursor-pointer group"
          >
            <SafeImage
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button
              type="button"
              className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-[#07142B]/85 text-[#FACC15] text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs border border-[#FACC15]/40"
            >
              <Expand className="w-3.5 h-3.5" />
              <span>View Full Gallery ({property.images.length})</span>
            </button>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {(property.images.slice(1, 3).length > 0
              ? property.images.slice(1, 3)
              : [property.images[0], property.images[0]]
            ).map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setPhotoIndex(i + 1 < property.images.length ? i + 1 : 0);
                  setLightboxOpen(true);
                }}
                className="relative aspect-[16/9] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden bg-slate-200 cursor-pointer group"
              >
                <SafeImage
                  src={img}
                  alt={`${property.title} view ${i + 2}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content + Sticky Inquiry Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#0A1D42] text-[#FACC15]">
                  {property.type}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#FACC15] text-[#07142B]">
                  {property.area} Corridor
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{property.status}</span>
                </span>
              </div>

              <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#07142B]">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-[#0A1D42] shrink-0" />
                <span>{property.location}</span>
              </div>

              {/* Key Specifications */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
                {!isLand ? (
                  <>
                    <div>
                      <p className="text-[11px] uppercase text-slate-400 font-semibold">Bedrooms</p>
                      <p className="font-mono-tech text-lg font-bold text-[#07142B] flex items-center gap-1.5 mt-0.5">
                        <BedDouble className="w-4 h-4 text-[#0A1D42]" />
                        {property.bedrooms} En-Suite
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-slate-400 font-semibold">Bathrooms</p>
                      <p className="font-mono-tech text-lg font-bold text-[#07142B] flex items-center gap-1.5 mt-0.5">
                        <Bath className="w-4 h-4 text-[#0A1D42]" />
                        {property.bathrooms} Baths
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <p className="text-[11px] uppercase text-slate-400 font-semibold">
                      Land Topology &amp; Title
                    </p>
                    <p className="text-base font-bold text-[#07142B] mt-0.5">
                      100% Dry Table Land • Verified Survey &amp; C of O
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] uppercase text-slate-400 font-semibold">Total Area</p>
                  <p className="font-mono-tech text-lg font-bold text-[#07142B] flex items-center gap-1.5 mt-0.5">
                    <Maximize2 className="w-4 h-4 text-[#0A1D42]" />
                    {property.sqm} SQM
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#07142B] mb-2">
                  Executive Overview
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Co-Ownership Box if applicable */}
              {property.coOwnershipDetails && (
                <div className="p-6 rounded-2xl bg-[#07142B] text-white border-2 border-[#FACC15] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech uppercase tracking-widest text-[#FACC15] font-bold flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      Fractional Co-Ownership Syndicate
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-[#FACC15] text-[#07142B] text-xs font-mono-tech font-bold">
                      {property.coOwnershipDetails.slotsAvailable} of{' '}
                      {property.coOwnershipDetails.slotsTotal} Slots Open
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <p className="text-[10px] uppercase text-blue-200/70">Price Per Slot</p>
                      <p className="font-mono-tech text-base font-bold text-[#FACC15]">
                        {property.coOwnershipDetails.pricePerSlot}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-blue-200/70">Projected Yield</p>
                      <p className="font-mono-tech text-base font-bold text-emerald-300">
                        {property.coOwnershipDetails.projectedAnnualYield}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-blue-200/70">Hold Horizon</p>
                      <p className="font-mono-tech text-base font-bold text-white">
                        {property.coOwnershipDetails.holdPeriod}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Amenities & Title Highlights */}
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#07142B] mb-4">
                  Title &amp; Infrastructure Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0A1D42] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Action Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#0A1D42]/20 shadow-xl sticky top-28 space-y-6">
              <div className="pb-5 border-b border-slate-100">
                <p className="text-xs font-mono-tech uppercase tracking-widest text-slate-400">
                  Verified Acquisition Price
                </p>
                <p className="font-mono-tech text-3xl font-bold text-[#0A1D42] mt-1">
                  {property.priceFormatted}
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  ✓ Flexible Milestone Payment Plans Available
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={getPropertyWhatsAppUrl({
                    id: property.id,
                    title: property.title,
                    location: property.location,
                    priceFormatted: property.priceFormatted,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Inquire on WhatsApp</span>
                </a>

                <button
                  onClick={() =>
                    openInspectionModal({ id: property.id, title: property.title })
                  }
                  className="w-full py-4 px-5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#07142B]" />
                  <span>Schedule Physical / Video Tour</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs space-y-2">
                <p className="font-bold text-[#07142B]">Etosmania Title Guarantee</p>
                <p className="text-slate-600 leading-relaxed">
                  All survey coordinates, C of O / Governor&apos;s Consent documents are available
                  for verification at our Head Office: <strong>10b Thomas Estate, Ajah, Lekki</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LightboxModal
        images={property.images}
        currentIndex={photoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setPhotoIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
        }
        onNext={() =>
          setPhotoIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
        }
        title={property.title}
      />
    </div>
  );
};
