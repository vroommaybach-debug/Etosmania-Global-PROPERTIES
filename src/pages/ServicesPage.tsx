import React from 'react';
import {
  Compass,
  TrendingUp,
  Home,
  Users,
  Building,
  Briefcase,
  ShieldCheck,
  Award,
  CheckCircle2,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import {HOW_IT_WORKS_STEPS } from '../data/mockData';
import { SectionHeading } from '../components/common/SectionHeading';
import { useData } from '../context/DataContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass,
  TrendingUp,
  Home,
  Users,
  Building,
  Briefcase,
  ShieldCheck,
  Award,
};

export const ServicesPage: React.FC = () => {
  const { openInspectionModal, services } = useData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Hero */}
      <section className="bg-[#07142B] text-white py-16 lg:py-24 border-b-4 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-mono-tech text-xs font-extrabold uppercase tracking-widest mb-3">
            Real Estate Gold You Are Looking For
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl">
            Our {services.length} Core Real Estate &amp; Investment Services.
          </h1>
          <p className="text-blue-100/85 text-base sm:text-lg max-w-2xl mt-4 leading-relaxed">
            Whether you are acquiring dry titled land, moving into a family duplex in Ajah, Lekki, Egbeda, or Akowonjo, co-owning high-yield properties, or delegating property management, Etosmania Global Properties delivers institutional excellence.
          </p>
        </div>
      </section>

      {/* Services Detailed Cards */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {services.map((service) => {
          const IconComponent = ICON_MAP[service.iconName] || Compass;

          return (
            <div
              id={service.id}
              key={service.id}
              className="scroll-mt-28 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#0A1D42]/30 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1D42] text-[#FACC15] flex items-center justify-center shadow-md">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono-tech font-bold uppercase tracking-widest text-[#0A1D42]">
                      Service Pillar {service.number}
                    </span>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#07142B]">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={getWhatsAppUrl(service.whatsappPrompt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{service.ctaText} on WhatsApp</span>
                  </a>

                  <button
                    onClick={() =>
                      openInspectionModal({ id: service.id, title: service.title })
                    }
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] font-bold text-xs uppercase tracking-wider border border-[#EAB308] cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#07142B]" />
                    <span>Schedule Consultation</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 space-y-3">
                <p className="text-xs font-mono-tech uppercase tracking-widest text-[#0A1D42] font-bold">
                  What Is Included:
                </p>
                {service.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* How It Works Process */}
      <section className="py-16 bg-[#07142B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            light
            alignment="center"
            subtitle="Seamless Execution"
            title="How Our Acquisition & Advisory Process Works."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white/[0.06] border border-white/15 space-y-3"
              >
                <span className="font-mono-tech text-2xl font-bold text-[#FACC15]">
                  {item.step}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-white">{item.title}</h3>
                <p className="text-xs text-blue-100/85 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
