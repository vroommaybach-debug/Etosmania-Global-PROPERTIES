import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Lock,
  MessageCircle,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { EtosmaniaLogo } from '../common/BahamsLogo';
import { OFFICE_DETAILS, ETOSMANIA_CREED } from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { getWhatsAppUrl, getGeneralWhatsAppMessage } from '../../utils/whatsapp';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { landingConfig, services } = useData();
  const { openInspectionModal } = useUI();

  return (
    <footer className="bg-[#120721] text-purple-100/80 border-t border-purple-900/60 pb-24 lg:pb-0">
      {/* Top Sovereign Gold Callout Strip */}
      <div className="border-b border-purple-900/60 bg-gradient-to-r from-[#1E0938] via-[#2E1065] to-[#1E0938]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-[#F59E0B] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Wealth &amp; Real Estate Concierge</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Ready to Acquire Verified Land, Houses, or Co-Ownership Equity?
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => openInspectionModal()}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-[#F59E0B]" />
              <span>Schedule Private Viewing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-purple-900/50">
          {/* Column 1: Brand, Mission & Core Values */}
          <div className="lg:col-span-4 space-y-5">
            <EtosmaniaLogo variant="light" />
            <p className="text-sm leading-relaxed text-purple-200/80 max-w-sm">
              {ETOSMANIA_CREED.mission}
            </p>
            <div className="pt-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] mb-2">
                Our Core Values
              </p>
              <p className="text-xs font-medium text-purple-100">
                Integrity · Professionalism · Customer Service · Continuous Learning
              </p>
            </div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-purple-950/70 border border-purple-800/60 text-xs text-purple-200">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Verified C of O &amp; Governor’s Consent Mandates</span>
            </div>
          </div>

          {/* Column 2: Sitelinks & Subpages */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties" className="hover:text-[#F59E0B] transition-colors">
                  Land &amp; Houses
                </Link>
              </li>
              <li>
                <Link to="/co-ownership" className="hover:text-[#F59E0B] transition-colors">
                  Co-Ownership Hub
                </Link>
              </li>
              <li>
                <Link to="/developments" className="hover:text-[#F59E0B] transition-colors">
                  Estate Developments
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#F59E0B] transition-colors">
                  8 Core Pillars
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F59E0B] transition-colors">
                  Corporate Creed
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F59E0B] transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: All 8 Core Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Our Core Services
            </h4>
            <ul className="space-y-2 text-sm">
              {services.slice(0, 8).map((svc) => (
                <li key={svc.id}>
                  <Link
                    to={svc.id === 'co-ownership' ? '/co-ownership' : `/services#${svc.id}`}
                    className="hover:text-[#F59E0B] transition-colors"
                  >
                    • {svc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Official Corporate Contact Details (No Raw Phone Numbers Exposed) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Corporate Headquarters
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-1" />
                <span className="text-purple-100/90">{landingConfig.contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <a
                  href={`mailto:${landingConfig.contactEmail}`}
                  className="hover:text-[#F59E0B] transition-colors break-all text-xs font-mono"
                >
                  {landingConfig.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span className="text-xs text-purple-300/75">{OFFICE_DETAILS.hours}</span>
              </li>
              <li className="pt-1">
                <a
                  href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-[#D4AF37]/40 text-xs font-semibold text-[#F59E0B] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Launch WhatsApp Concierge</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal, June Studio Signature & Sitemap Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-purple-300/70">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <p>© {currentYear} {OFFICE_DETAILS.companyName}. All rights reserved.</p>
            <span className="hidden sm:inline text-purple-700">|</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-[#D4AF37]/40 text-[#F59E0B] font-mono text-[11px] font-semibold tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Imagined by June Studio</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F59E0B] transition-colors inline-flex items-center gap-1"
            >
              <span>Google Sitemap</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <Link to="/about" className="hover:text-[#F59E0B] transition-colors">
              Corporate Creed
            </Link>
            <Link
              to="/admin"
              className="hover:text-[#F59E0B] transition-colors inline-flex items-center gap-1 text-purple-200"
            >
              <Lock className="w-3 h-3" />
              <span>CMS Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
