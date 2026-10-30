import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowUpRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import { DevelopmentProject } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { getWhatsAppUrl } from '../../utils/whatsapp';

interface ProjectCardProps {
  project: DevelopmentProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row">
      {/* Left Image */}
      <div className="lg:w-5/12 relative min-h-[280px] lg:min-h-full overflow-hidden bg-slate-100">
        <SafeImage
          src={project.heroImage}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#07142B] text-[#FACC15] border border-[#FACC15]/40">
            {project.status}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 bg-[#07142B]/95 backdrop-blur-md p-3.5 rounded-xl border border-white/15 text-white">
          <p className="text-[10px] font-mono-tech uppercase tracking-widest text-[#FACC15]">
            Starting Entry Price
          </p>
          <p className="font-mono-tech text-lg font-bold">{project.startingPrice}</p>
        </div>
      </div>

      {/* Right Content */}
      <div className="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#0A1D42]">
              <MapPin className="w-3.5 h-3.5 text-[#EAB308]" />
              {project.location}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono-tech">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Delivery: {project.completionDate}
            </span>
          </div>

          <Link to={`/developments/${project.id}`}>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#07142B] group-hover:text-[#1D4ED8] transition-colors">
              {project.name}
            </h3>
          </Link>

          <p className="text-sm font-semibold text-[#0A1D42]">{project.tagline}</p>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {project.highlights.slice(0, 4).map((hl, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0A1D42] shrink-0 mt-0.5" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs">
            <span className="text-slate-500">Allocation Availability: </span>
            <span className="font-mono-tech font-bold text-[#07142B]">
              {project.availableUnits} of {project.totalUnits} Units Left
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to={`/developments/${project.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] border border-[#EAB308] transition-colors"
            >
              <span>Explore Estate</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppUrl(
                `Hello Etosmania Global Properties, I would like to receive the brochure and payment plan for *${project.name}* (${project.location}).`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0A1D42] hover:bg-[#07142B] text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Request Brochure</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
