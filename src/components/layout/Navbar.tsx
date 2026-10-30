import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Calendar,
  Trash2,
  ArrowRight,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
import { EtosmaniaLogo } from '../common/BahamsLogo';
import { useUI } from '../../context/UIContext';
import { useData } from '../../context/DataContext';
import { formatNairaCompact } from '../../utils/formatters';
import { getWhatsAppUrl, getGeneralWhatsAppMessage } from '../../utils/whatsapp';

// Strict 5 top-level navigation links for the 3-Zone Top Bar Contract
const NAV_LINKS = [
  { name: 'Properties', path: '/properties' },
  { name: 'Co-Ownership', path: '/co-ownership' },
  { name: 'Developments', path: '/developments' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
];

const MOBILE_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Land & Houses', path: '/properties' },
  { name: 'Real Estate Co-Ownership', path: '/co-ownership' },
  { name: 'Estate Developments', path: '/developments' },
  { name: 'Our 8 Core Pillars', path: '/services' },
  { name: 'About Etosmania', path: '/about' },
  { name: 'Contact & Ajah Office', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    openInspectionModal,
    savedIds,
    toggleSavedProperty,
    clearSavedProperties,
    isSavedDrawerOpen,
    closeSavedDrawer,
  } = useUI();
  const { properties } = useData();
  const location = useLocation();

  const savedProperties = properties.filter((p) => savedIds.includes(p.id));
  const isHome = location.pathname === '/';
  const useLightHeader = isHome && !isScrolled && !mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    closeSavedDrawer();
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHome
            ? 'bg-[#18062C]/95 backdrop-blur-md border-b border-purple-800/40 py-3.5 shadow-lg'
            : 'bg-gradient-to-b from-[#120721]/90 via-[#120721]/50 to-transparent py-5'
        }`}
      >
        {/* Strict 1-Row, 3-Zone Top Bar Contract: [Zone 1: Brand] — [Zone 2: 5 Nav Links] — [Zone 3: 1 Primary CTA] */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Identity */}
          <Link
            to="/"
            aria-label="Etosmania Global Properties Home"
            className="focus:outline-none shrink-0"
          >
            <EtosmaniaLogo variant="light" />
          </Link>

          {/* Zone 2: Primary Navigation (Max 5 items, single line) */}
          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-8"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors relative py-1 whitespace-nowrap ${
                    isActive
                      ? 'text-[#F59E0B] font-semibold'
                      : useLightHeader
                      ? 'text-white/90 hover:text-[#F59E0B]'
                      : 'text-purple-100/90 hover:text-[#F59E0B]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action Button */}
          <div className="hidden lg:flex items-center shrink-0">
            <button
              type="button"
              onClick={() => openInspectionModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#D4AF37] text-[#120721] shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Inspection</span>
            </button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#18062C] border-b border-purple-800/60 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 pt-3 pb-6 space-y-1.5">
              {MOBILE_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#3B0764] text-[#F59E0B] font-semibold border border-[#D4AF37]/30'
                        : 'text-purple-100 hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-4 mt-4 border-t border-purple-800/50 flex flex-col gap-2.5">
                <a
                  href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-700/95 text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openInspectionModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] shadow-md whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Private Viewing</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Saved Properties Shortlist Drawer */}
      {isSavedDrawerOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div
            className="fixed inset-0 bg-[#120721]/75 backdrop-blur-sm"
            onClick={closeSavedDrawer}
          />
          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="p-6 bg-[#1E0938] text-white flex items-center justify-between border-b border-purple-800/40">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
                <div>
                  <h3 className="font-serif text-lg font-bold">Saved Portfolio Shortlist</h3>
                  <p className="text-xs text-purple-200/80">
                    {savedProperties.length}{' '}
                    {savedProperties.length === 1 ? 'property' : 'properties'} bookmarked
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeSavedDrawer}
                className="p-2 rounded-lg bg-white/10 text-purple-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {savedProperties.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-3 text-[#5B21B6]">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900 mb-1">
                    No Saved Properties Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                    Click the bookmark icon on any land plot, duplex, or commercial asset to build
                    your personal comparison list.
                  </p>
                  <Link
                    to="/properties"
                    onClick={closeSavedDrawer}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B0764] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#4C1D95]"
                  >
                    <span>Explore Properties</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                savedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="flex gap-3.5 p-3 rounded-xl border border-purple-100 bg-[#FAF9FC] hover:border-[#D4AF37]/60 transition-all group"
                  >
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B21B6] block">
                        {prop.location} · {prop.type}
                      </span>
                      <Link
                        to={`/properties/${prop.slug}`}
                        onClick={closeSavedDrawer}
                        className="font-serif font-bold text-slate-900 text-sm hover:text-[#4C1D95] line-clamp-1 block"
                      >
                        {prop.title}
                      </Link>
                      <p className="font-mono text-xs font-bold text-[#3B0764] mt-1">
                        {formatNairaCompact(prop.price)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Link
                          to={`/properties/${prop.slug}`}
                          onClick={closeSavedDrawer}
                          className="text-[11px] font-semibold text-[#5B21B6] hover:underline flex items-center gap-1"
                        >
                          <span>View Dossier</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleSavedProperty(prop.id)}
                          aria-label="Remove from saved"
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {savedProperties.length > 0 && (
              <div className="p-6 bg-[#FAF9FC] border-t border-purple-100 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    closeSavedDrawer();
                    openInspectionModal({
                      title: `Shortlist Tour (${savedProperties.length} Properties)`,
                      location: savedProperties.map((p) => p.location).join(', '),
                      id: savedProperties.map((p) => p.id).join(', '),
                    });
                  }}
                  className="w-full py-3 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Book Inspection for All ({savedProperties.length})
                </button>
                <button
                  type="button"
                  onClick={clearSavedProperties}
                  className="w-full py-2 text-xs text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                >
                  Clear Shortlist
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
