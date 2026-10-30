import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Mail,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import {
  OFFICE_DETAILS,
  ETOSMANIA_CREED,
  TEAM_MEMBERS,
} from '../data/mockData';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';
import { SectionHeading } from '../components/common/SectionHeading';
import { SafeImage } from '../components/common/SafeImage';
import { getWhatsAppUrl, getGeneralWhatsAppMessage } from '../utils/whatsapp';

export const AboutPage: React.FC = () => {
  const { openInspectionModal } = useUI();
  const { services } = useData();

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#120721] via-[#2E1065] to-[#3B0764] text-white py-16 sm:py-24 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white/10 border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-[0.2em] text-[#F59E0B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Corporate Profile &amp; Creed</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
                {OFFICE_DETAILS.companyName}
              </h1>
              <p className="text-xl font-serif font-semibold text-[#F59E0B]">
                “{ETOSMANIA_CREED.slogan}”
              </p>
              <p className="text-base text-purple-100/90 leading-relaxed max-w-2xl">
                Headquartered at <strong>10B Thomas Estate, Ajah, Lekki, Lagos State</strong>,
                Etosmania Global Properties Investment Limited is a full-service real estate
                development, investment, consultancy, and property management institution dedicated
                to delivering verified residential and commercial wealth across Nigeria.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openInspectionModal()}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Visit to Ajah HQ</span>
                </button>
                <a
                  href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* International Architectural Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/50 shadow-2xl">
                <div className="rounded-xl overflow-hidden border border-white/15 bg-[#120721] aspect-[4/3] relative">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"
                    alt="Etosmania Global Properties Architectural Excellence"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120721]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[#F59E0B]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>100% Verified Titles</span>
                    </span>
                    <span className="font-mono text-purple-200">10B Thomas Estate, Ajah</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exact Mission, Vision & Core Values Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          subtitle="Our Guiding Mandate"
          title="Mission, Vision & Core Values"
          description="Every property we develop, verify, co-own, or manage is anchored on our foundational promises to clients at home and in the diaspora."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 sm:p-10 border-2 border-[#3B0764] shadow-md">
            <span className="inline-block px-5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-serif font-extrabold text-sm uppercase tracking-wider mb-4">
              Our Mission
            </span>
            <p className="font-serif text-xl sm:text-2xl font-semibold text-[#120721] leading-relaxed">
              “{ETOSMANIA_CREED.mission}”
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 sm:p-10 border-2 border-[#3B0764] shadow-md">
            <span className="inline-block px-5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-serif font-extrabold text-sm uppercase tracking-wider mb-4">
              Our Vision
            </span>
            <p className="font-serif text-xl sm:text-2xl font-semibold text-[#120721] leading-relaxed">
              “{ETOSMANIA_CREED.vision}”
            </p>
          </div>
        </div>

        {/* 4 Core Values */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ETOSMANIA_CREED.coreValues.map((value, i) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm hover:border-[#D4AF37] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded bg-[#3B0764] text-[#F59E0B] font-mono text-xs font-bold">
                  0{i + 1}
                </span>
                <Award className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#120721] mb-2">{value.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Complete 8 Services Summary Matrix */}
      <section className="py-16 bg-white border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="What We Do"
            title="Our 8 Core Real Estate & Investment Practice Areas"
          />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, idx) => (
              <Link
                key={service.id}
                to={service.id === 'co-ownership' ? '/co-ownership' : `/services#${service.id}`}
                className="group p-5 rounded-xl bg-[#FAF9FC] border border-purple-100 hover:border-[#D4AF37] hover:bg-purple-50/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-[#5B21B6] font-bold block mb-1">
                    Pillar 0{idx + 1}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#120721] group-hover:text-[#3B0764] mb-1.5">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{service.tagline}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3B0764] mt-4">
                  <span>Explore Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Leadership & Advisory Desks */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Leadership & Governance"
          title="Dedicated Advisory Desks at Thomas Estate, Ajah"
          description="Our multidisciplinary team combines real estate development, property law, land surveying, and facility operations."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-sm"
            >
              <div className="h-64 overflow-hidden bg-[#18062C]">
                <SafeImage
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B21B6] font-semibold block">
                  {member.role}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#120721]">{member.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
                <p className="text-[11px] font-mono text-slate-400 pt-2 border-t border-purple-50">
                  {member.credentials}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Contact Card (No Exposed Phone Numbers) */}
        <div className="mt-14 bg-gradient-to-r from-[#18062C] via-[#2E1065] to-[#3B0764] text-white rounded-2xl p-8 sm:p-10 border border-[#D4AF37]/50 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F59E0B] block">
              Verified Corporate Headquarters
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Visit Us at 10B Thomas Estate, Ajah, Lekki, Lagos State
            </h3>
            <div className="flex flex-wrap gap-6 pt-2 text-xs sm:text-sm text-purple-100">
              <span className="inline-flex items-center gap-2 font-mono">
                <Mail className="w-4 h-4 text-[#F59E0B]" />
                {OFFICE_DETAILS.email}
              </span>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-lg bg-[#D4AF37] text-[#120721] font-bold text-xs uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message on WhatsApp</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider"
            >
              <span>Directions &amp; Contact Desk</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
