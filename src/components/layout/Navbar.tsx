import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { BahamsLogo } from '../common/BahamsLogo';
import { useData } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { openInspectionModal } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Land & Houses', path: '/properties' },
    { name: 'Co-Ownership', path: '/co-ownership', badge: 'Hot' },
    { name: 'Services', path: '/services' },
    { name: 'Developments', path: '/developments' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full overflow-x-clip transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(7,20,43,0.08)] border-b border-slate-200/90'
          : 'bg-white border-b border-slate-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 lg:gap-6">
        {/* Left: Brand Wordmark (Acts as Home Link) */}
        <Link
          to="/"
          className="shrink-0 min-w-0 focus:outline-none"
          aria-label="Etosmania Global Properties — Home"
          title="Return to Home"
        >
          <BahamsLogo variant="dark" className="w-8 h-8 sm:w-10 sm:h-10" />
        </Link>

        {/* Center: Cleanly Spaced Single-Line Navigation */}
        <nav
          className="hidden lg:flex items-center justify-center gap-1 xl:gap-2.5 flex-1 min-w-0"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 xl:px-3.5 py-2 rounded-xl text-[13px] xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 inline-flex items-center gap-1.5 ${
                  active
                    ? 'text-[#07142B] bg-[#FACC15] font-bold shadow-2xs'
                    : 'text-[#07142B]/80 hover:text-[#07142B] hover:bg-slate-100/85'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] leading-none font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                      active
                        ? 'bg-[#07142B] text-[#FACC15]'
                        : 'bg-[#0A1D42] text-[#FACC15]'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Single Primary Action CTA on Desktop (No WhatsApp button in top navbar) */}
        <div className="hidden lg:flex items-center shrink-0">
          <button
            type="button"
            onClick={() => openInspectionModal()}
            className="inline-flex items-center justify-center gap-2 px-4 xl:px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap text-[#07142B] bg-[#FACC15] hover:bg-[#EAB308] border border-[#EAB308] transition-all cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#07142B] shrink-0" />
            <span>Book Inspection</span>
          </button>
        </div>

        {/* Tablet / Mobile Controls (< lg) — Cleanly positioned inside viewport */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            type="button"
            onClick={() => openInspectionModal()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap bg-[#FACC15] text-[#07142B]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Tour</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#0A1D42] text-[#FACC15] hover:bg-[#07142B] transition-colors cursor-pointer shadow-xs"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-2xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    active
                      ? 'bg-[#0A1D42] text-[#FACC15]'
                      : 'text-[#07142B] hover:bg-slate-100'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[#FACC15] text-[#07142B]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openInspectionModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-[#FACC15] text-[#07142B] shadow-xs"
            >
              <Calendar className="w-4 h-4 text-[#07142B]" />
              <span>Book Site or Video Inspection</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 px-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0A1D42]" />
              Verified Real Estate Gold
            </span>
            <Link to="/admin" className="text-[#0A1D42] font-semibold hover:underline">
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
