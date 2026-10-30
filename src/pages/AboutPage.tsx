import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  ETOSMANIA_CONTACT,
  CORE_VALUES_LIST,
  WHY_ETOSMANIA_POINTS,
  LAGOS_CORRIDOR_HIGHLIGHTS,
} from '../data/mockData';
import { SectionHeading } from '../components/common/SectionHeading';
import { SafeImage } from '../components/common/SafeImage';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { useData } from '../context/DataContext';

export const AboutPage: React.FC = () => {
  const { siteConfig } = useData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Hero */}
      <section className="bg-[#07142B] text-white py-16 lg:py-24 border-b-4 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-mono-tech text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About {ETOSMANIA_CONTACT.businessName}</span>
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold tracking-tight leading-[1.06]">
              Transforming Dreams Into Reality Through Real Estate Gold.
            </h1>
            <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed">
              Headquartered at {siteConfig.headOfficeAddress || ETOSMANIA_CONTACT.address}, Etosmania Global Properties Investment Limited is a premier Nigerian real estate development, investment, co-ownership, and advisory company operating across Ajah, Lekki, Egbeda, Akowonjo, Agbara, and Ibeju-Lekki.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Split */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-8 border-2 border-[#0A1D42]/15 shadow-lg space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-serif-luxury font-bold text-xs uppercase tracking-widest">
                Our Mission
              </span>
              <p className="font-serif-luxury text-2xl text-[#07142B] leading-relaxed font-semibold">
                &ldquo;{siteConfig.missionStatement}&rdquo;
              </p>
            </div>

            <div className="bg-[#07142B] text-white rounded-3xl p-8 border-2 border-[#FACC15] shadow-xl space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-serif-luxury font-bold text-xs uppercase tracking-widest">
                Our Vision
              </span>
              <p className="font-serif-luxury text-2xl text-white leading-relaxed font-semibold">
                &ldquo;{siteConfig.visionStatement}&rdquo;
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border-4 border-[#FACC15] shadow-2xl bg-white p-3">
              <SafeImage
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85"
                alt="Etosmania Global Properties Luxury Architecture"
                className="w-full h-[420px] object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Values */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            alignment="center"
            subtitle="What Guides Every Transaction"
            title="Our 4 Pillars of Corporate Character."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES_LIST.map((val, idx) => (
              <div
                key={val.title}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-3"
              >
                <span className="font-mono-tech text-xs font-bold px-2.5 py-1 rounded bg-[#0A1D42] text-[#FACC15]">
                  0{idx + 1}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#07142B]">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Lagos Corridors */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Our Geographic Footprint"
          title="Serving Lagos Island & Mainland Growth Corridors."
          description="We combine deep local intelligence across Ajah, Lekki, Egbeda, Akowonjo, Agbara, and Ibeju-Lekki with institutional title due diligence."
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LAGOS_CORRIDOR_HIGHLIGHTS.map((item) => (
            <div
              key={item.area}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
            >
              <span className="px-2.5 py-0.5 rounded bg-[#FACC15] text-[#07142B] font-mono-tech text-[10px] font-extrabold uppercase tracking-wider">
                {item.zone}
              </span>
              <h3 className="font-serif-luxury text-xl font-bold text-[#07142B] pt-1">
                {item.area} Corridor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Etosmania */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <SectionHeading
              subtitle="The Etosmania Advantage"
              title="Why Discerning Buyers Choose Etosmania Global."
            />
            <div className="space-y-4">
              {WHY_ETOSMANIA_POINTS.map((pt) => (
                <div
                  key={pt.title}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#0A1D42] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-base text-[#07142B]">{pt.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">{pt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office Card */}
          <div className="bg-[#07142B] text-white rounded-3xl p-8 sm:p-10 border-2 border-[#FACC15] space-y-6">
            <ShieldCheck className="w-10 h-10 text-[#FACC15]" />
            <h3 className="font-serif-luxury text-3xl font-bold">
              Visit Our Corporate Headquarters in Ajah, Lekki
            </h3>
            <p className="text-sm text-blue-100/85 leading-relaxed">
              We welcome clients, legal representatives, and family offices to inspect property
              dossiers, survey charts, and co-ownership trust deeds in person.
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-[#FACC15] font-bold">
                <MapPin className="w-4 h-4" />
                <span>{siteConfig.headOfficeAddress || ETOSMANIA_CONTACT.address}</span>
              </p>
              <p className="text-xs text-blue-100/80">
                Email: {siteConfig.contactEmail || ETOSMANIA_CONTACT.email}
              </p>
            </div>
            <a
              href={getWhatsAppUrl(
                'Hello Etosmania Global Properties, I would like to schedule an office visit at 10b Thomas Estate, Ajah.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Schedule Office Visit via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
