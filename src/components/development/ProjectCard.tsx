import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, TrendingUp, Calendar, MessageCircle } from 'lucide-react';
import { DevelopmentProject } from '../../types';
import { formatNairaCompact } from '../../utils/formatters';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { SafeImage } from '../common/SafeImage';

interface ProjectCardProps {
  project: DevelopmentProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const whatsappLink = getWhatsAppUrl(
    `Hello Etosmania Global Properties, I am interested in "${project.name}" (${project.location}) starting from ${formatNairaCompact(
      project.startingPrice
    )}. Please share the brochure and payment plan.`
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-purple-100 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
      {/* Left Image Column */}
      <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full overflow-hidden bg-[#18062C]">
        <SafeImage
          src={project.heroImage}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120721]/85 via-transparent to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider font-semibold bg-[#18062C]/90 text-[#F59E0B] border border-[#D4AF37]/40 backdrop-blur-md">
            {project.status}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="text-[11px] font-mono uppercase tracking-widest text-purple-200 block">
            Entry Price From
          </span>
          <p className="font-mono text-2xl font-bold text-[#F59E0B]">
            {formatNairaCompact(project.startingPrice)}
          </p>
        </div>
      </div>

      {/* Right Details Column */}
      <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 mb-2">
            <span className="inline-flex items-center gap-1 text-[#4C1D95] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              {project.location}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Delivery: {project.completionDate}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              {project.yieldEstimate}
            </span>
          </div>

          <Link to={`/developments/${project.slug}`}>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#120721] group-hover:text-[#4C1D95] transition-colors mb-2">
              {project.name}
            </h3>
          </Link>

          <p className="text-sm font-medium text-[#5B21B6] mb-3">{project.tagline}</p>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-5">
            {project.overview}
          </p>

          {/* Inline Features Summary */}
          <p className="text-xs font-mono text-slate-500 py-3 border-y border-purple-100">
            {project.availableUnits} of {project.totalUnits} Units Available ·{' '}
            {project.features.slice(0, 3).join(' · ')}
          </p>
        </div>

        <div className="pt-5 flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/developments/${project.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            <span>Explore Masterplan & Floor Plans</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Allocation Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
};
