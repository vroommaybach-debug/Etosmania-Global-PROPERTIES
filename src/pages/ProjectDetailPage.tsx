import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';
import { SafeImage } from '../components/common/SafeImage';
import { formatNairaCompact } from '../utils/formatters';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { developments } = useData();
  const { openInspectionModal } = useUI();

  const project = developments.find(
    (d) => d.slug === id || d.id.toLowerCase() === (id || '').toLowerCase()
  );

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#FAF9FC] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#120721] mb-3">
          Development Project Not Found
        </h1>
        <Link
          to="/developments"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#3B0764] text-white text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Developments</span>
        </Link>
      </div>
    );
  }

  const whatsappUrl = getWhatsAppUrl(
    `Hello Etosmania Global Properties, I would like to receive the masterplan brochure, floor plans, and payment schedule for *${project.name}* (${project.location}).`
  );

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[500px] bg-[#18062C] overflow-hidden">
        <SafeImage
          src={project.heroImage}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120721] via-[#120721]/55 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-white">
          <Link
            to="/developments"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#F59E0B] hover:underline mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Etosmania Developments</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-2">
            <span className="px-3 py-1 rounded bg-[#D4AF37] text-[#120721] font-bold uppercase">
              {project.status}
            </span>
            <span className="inline-flex items-center gap-1 text-purple-200">
              <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
              {project.location}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-purple-200">
              <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
              Delivery: {project.completionDate}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              {project.yieldEstimate}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold">{project.name}</h1>
          <p className="text-sm sm:text-lg text-purple-200 mt-1 max-w-2xl">{project.tagline}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#120721]">Masterplan Overview</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {project.overview}
            </p>
            <div className="pt-4 border-t border-purple-100">
              <h3 className="font-serif text-lg font-bold text-[#3B0764] mb-1">
                Architectural &amp; Engineering Concept
              </h3>
              <p className="text-sm text-slate-600">{project.architecturalConcept}</p>
            </div>
          </div>

          {/* Available Floor Plans & Plot Configurations */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 space-y-5">
            <h2 className="font-serif text-2xl font-bold text-[#120721]">
              Available Units, Plots &amp; Pricing
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {project.floorPlans.map((fp) => (
                <div
                  key={fp.id}
                  className="p-5 rounded-xl bg-[#FAF9FC] border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#120721]">{fp.name}</h3>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      {fp.sqm} SQM {fp.bedrooms > 0 ? `· ${fp.bedrooms} Bedrooms` : '· Serviced Plot'}
                    </p>
                    <p className="text-xs text-[#4C1D95] mt-2">{fp.features.join(' · ')}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Starting Price
                    </span>
                    <p className="font-mono text-xl font-bold text-[#3B0764]">{fp.priceFrom}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 space-y-5">
            <h2 className="font-serif text-2xl font-bold text-[#120721]">
              Project Delivery Milestones
            </h2>
            <div className="space-y-4">
              {project.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FAF9FC] border border-purple-100 flex items-start gap-3.5"
                >
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      m.completed ? 'text-emerald-600' : 'text-[#D4AF37]'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[#120721]">{m.stage}</h4>
                      <span className="text-xs font-mono text-[#5B21B6] bg-purple-100 px-2 py-0.5 rounded">
                        {m.date}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-6">
          <div className="bg-gradient-to-br from-[#18062C] via-[#2E1065] to-[#120721] text-white rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-xl space-y-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] block">
                Entry Allocation Price
              </span>
              <p className="font-mono text-3xl font-extrabold text-white mt-1">
                {formatNairaCompact(project.startingPrice)}
              </p>
              <span className="text-xs text-purple-200">
                {project.availableUnits} of {project.totalUnits} units/plots remaining
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  openInspectionModal({
                    title: `Development Site Tour: ${project.name}`,
                    location: project.location,
                    id: project.id,
                  })
                }
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Book Site Inspection
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Allocation Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
