import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { BahamsLogo } from '../common/BahamsLogo';
import { ETOSMANIA_CONTACT } from '../../data/mockData';
import { SUBPAGE_SITELINKS } from '../../utils/seoMetadata';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { services, siteConfig } = useData();

  return (
    <footer className="bg-[#07142B] text-white border-t-4 border-[#FACC15] pb-24 lg:pb-0">
      {/* Top Callout Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#07142B] via-[#0A1D42] to-[#07142B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FACC15]/15 border border-[#FACC15]/40 text-[#FACC15] text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Estate Gold You Are Looking For</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to Own Verified Land, Luxury Homes, or Co-Ownership Slots?
            </h3>
            <p className="text-blue-100/80 text-sm mt-1">
              Visit our Head Office at {siteConfig.headOfficeAddress || ETOSMANIA_CONTACT.address} or connect on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={getWhatsAppUrl(
                'Hello Etosmania Global Properties, I want to start my real estate acquisition journey.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm shadow-lg transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Message on WhatsApp</span>
            </a>
            <Link
              to="/co-ownership"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] font-bold text-sm transition-all"
            >
              <span>Explore Co-Ownership</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand, Mission & Vision */}
          <div className="lg:col-span-4 space-y-5">
            <BahamsLogo variant="light" />
            <p className="text-sm text-blue-100/80 leading-relaxed">
              <strong className="text-[#FACC15]">Our Mission:</strong>{' '}
              {siteConfig.missionStatement}
            </p>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              <strong className="text-[#FACC15]">Our Vision:</strong>{' '}
              {siteConfig.visionStatement}
            </p>
            <div className="pt-1">
              <p className="text-[11px] font-mono-tech uppercase tracking-widest text-[#FACC15] mb-2">
                Core Values
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(siteConfig.coreValues || ['Integrity', 'Professionalism', 'Customer Service', 'Continuous Learning']).map((val) => (
                  <span
                    key={val}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/10 text-blue-50 border border-white/15"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: 8 Core Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#FACC15] font-bold">
              Our 8 Core Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services#${service.id}`}
                    className="text-blue-100/80 hover:text-[#FACC15] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>{service.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Subpages & Lagos Corridors */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#FACC15] font-bold">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SUBPAGE_SITELINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-blue-100/80 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-blue-200/70 hover:text-[#FACC15] transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Executive CMS Portal</span>
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-[10px] font-mono-tech uppercase tracking-widest text-[#FACC15] mb-2">
                Active Lagos Corridors
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Ajah', 'Lekki', 'Egbeda', 'Akowonjo', 'Agbara', 'Ibeju-Lekki'].map((corridor) => (
                  <Link
                    key={corridor}
                    to={`/properties?location=${encodeURIComponent(corridor)}`}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/10 hover:bg-[#FACC15] hover:text-[#07142B] text-blue-100 transition-colors"
                  >
                    {corridor}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 4: Official Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#FACC15] font-bold">
              Headquarters &amp; Desk
            </h4>

            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FACC15] shrink-0 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-blue-200/70 font-semibold">
                    Office Address
                  </p>
                  <p className="text-white font-medium">
                    {siteConfig.headOfficeAddress || ETOSMANIA_CONTACT.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-blue-200/70 font-semibold">
                    Instant WhatsApp Concierge
                  </p>
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#FACC15] font-bold hover:underline mt-0.5"
                  >
                    <span>Start WhatsApp Chat</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#FACC15] shrink-0 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-blue-200/70 font-semibold">
                    Official Email
                  </p>
                  <a
                    href={`mailto:${siteConfig.contactEmail || ETOSMANIA_CONTACT.email}`}
                    className="text-white hover:text-[#FACC15] break-all transition-colors"
                  >
                    {siteConfig.contactEmail || ETOSMANIA_CONTACT.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/75">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} {ETOSMANIA_CONTACT.businessName}. All Rights Reserved.
            </p>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="text-[#FACC15] font-semibold tracking-wide">
              Imagined by June Studio
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#FACC15]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Titles (C of O &amp; Governor&apos;s Consent)</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
