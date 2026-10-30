import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SafeImage } from '../components/common/SafeImage';
import { SEOHead } from '../components/common/SEOHead';
import { buildDevelopmentDetailSEO } from '../utils/seoMetadata';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { developments, openInspectionModal } = useData();

  const project = developments.find((d) => d.id === id);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif-luxury text-3xl font-bold text-[#07142B] mb-2">
          Estate Development Not Found
        </h2>
        <Link
          to="/developments"
          className="mt-4 px-6 py-3 rounded-xl bg-[#0A1D42] text-white font-bold text-xs uppercase tracking-wider"
        >
          Back to Developments
        </Link>
      </div>
    );
  }

  const seoConfig = buildDevelopmentDetailSEO(project);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <SEOHead config={seoConfig} />

      <div className="bg-[#07142B] text-white py-6 border-b-2 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/developments"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FACC15] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Developments</span>
          </Link>
          <span className="font-mono-tech text-xs text-blue-200">{project.id}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-200 shadow-xl">
          <SafeImage
            src={project.heroImage}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07142B]/95 via-[#07142B]/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <span className="inline-block w-fit px-3 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-mono-tech text-xs font-extrabold uppercase tracking-wider mb-3">
              {project.status} Development
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold">{project.name}</h1>
            <p className="text-blue-100 text-sm sm:text-base mt-1">{project.tagline}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pb-4 border-b border-slate-100">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#0A1D42]">
                <MapPin className="w-4 h-4 text-[#EAB308]" />
                {project.location}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono-tech">
                <Calendar className="w-4 h-4 text-[#0A1D42]" />
                Delivery: {project.completionDate}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono-tech text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                {project.availableUnits} of {project.totalUnits} Units Available
              </span>
            </div>

            <div>
              <h2 className="font-serif-luxury text-2xl font-bold text-[#07142B] mb-3">
                Masterplan &amp; Community Overview
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#07142B] mb-4">
                Estate Highlights &amp; Infrastructure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0A1D42] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Strip */}
            {project.gallery.length > 0 && (
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#07142B] mb-4">
                  Architectural &amp; Site Progress Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      <SafeImage
                        src={img}
                        alt={`${project.name} gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#0A1D42]/20 shadow-xl sticky top-28 space-y-6">
              <div>
                <p className="text-xs font-mono-tech uppercase tracking-widest text-slate-400">
                  Starting Allocation Price
                </p>
                <p className="font-mono-tech text-2xl font-bold text-[#0A1D42] mt-1">
                  {project.startingPrice}
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={getWhatsAppUrl(
                    `Hello Etosmania Global Properties, I would like to request the subscription form and payment plan for *${project.name}* (${project.location}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Request Subscription Pack</span>
                </a>

                <button
                  onClick={() => openInspectionModal({ id: project.id, title: project.name })}
                  className="w-full py-4 px-5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#07142B]" />
                  <span>Book Site Inspection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
