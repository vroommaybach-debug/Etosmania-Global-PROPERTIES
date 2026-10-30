import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, MessageCircle, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/development/ProjectCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { getWhatsAppUrl, getGeneralWhatsAppMessage } from '../utils/whatsapp';

export const DevelopmentsPage: React.FC = () => {
  const { developments } = useData();

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#120721] via-[#2E1065] to-[#3B0764] text-white py-16 sm:py-24 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white/10 border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-[0.2em] text-[#F59E0B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sustainable Community-Centered Development</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              Signature <span className="text-[#F59E0B]">Estates &amp; Projects</span>
            </h1>
            <p className="text-base sm:text-lg text-purple-100/90 leading-relaxed">
              Aligned with our vision to become Nigeria’s most trusted and innovative real estate
              developer, explore our residential duplex courts in Ajah–Lekki, serviced C of O land
              estates in Ibeju-Lekki, and commercial suites in Victoria Island.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-lg whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Estate Brochure on WhatsApp</span>
              </a>
              <Link
                to="/co-ownership"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
              >
                <Users className="w-4 h-4 text-[#F59E0B]" />
                <span>Co-Own Development Slots</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeading
          subtitle="Active Masterplans"
          title="Ongoing Residential, Land & Commercial Developments"
          description="Select any estate development below to inspect floor plans, plot sizes, construction milestones, and payment schedules."
        />

        <div className="space-y-8">
          {developments.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};
