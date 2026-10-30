import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Sovereign Real Estate Gold',
  '/properties': 'Verified Land, Houses & Commercial Assets',
  '/co-ownership': 'Real Estate Co-Ownership & Fractional Wealth',
  '/developments': 'Signature Estates & Master Developments',
  '/services': '8 Core Real Estate & Investment Pillars',
  '/about': 'Our Mission, Vision & Corporate Creed',
  '/contact': '10B Thomas Estate, Ajah — Private Concierge',
  '/admin': 'Executive Management Console',
};

export const PageLoader: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(12);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setProgress(14);

    // Deliberate, artistic pacing so visitors appreciate the twin-gable gold crest art
    const initialDuration = 2100;
    const routeDuration = 1250;
    const totalDuration = isInitial ? initialDuration : routeDuration;

    const step1 = window.setTimeout(() => setProgress(38), Math.round(totalDuration * 0.22));
    const step2 = window.setTimeout(() => setProgress(68), Math.round(totalDuration * 0.52));
    const step3 = window.setTimeout(() => setProgress(92), Math.round(totalDuration * 0.8));
    const done = window.setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
      setIsInitial(false);
    }, totalDuration);

    return () => {
      window.clearTimeout(step1);
      window.clearTimeout(step2);
      window.clearTimeout(step3);
      window.clearTimeout(done);
    };
  }, [location.pathname]);

  if (!isLoading) return null;

  const baseRoute = location.pathname.startsWith('/properties/')
    ? '/properties'
    : location.pathname.startsWith('/developments/')
    ? '/developments'
    : location.pathname;

  const subtitle = ROUTE_LABELS[baseRoute] || 'Etosmania Global Properties';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#120721] text-white transition-opacity duration-500 overflow-hidden"
    >
      {/* Top golden progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-purple-950/80 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FDE68A] to-[#F59E0B] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Subtle Ambient Radial Glow Behind the Crest */}
      <div
        className="absolute w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Central Architectural Twin-Gable Crest Art */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md">
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer rotating diamond frame */}
          <div className="w-28 h-28 rounded-3xl border border-[#D4AF37]/35 rotate-45 absolute transition-transform duration-1000" />
          <div className="w-28 h-28 rounded-3xl border border-purple-500/25 -rotate-12 absolute" />

          {/* Main Emblem Vault */}
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#3B0764] via-[#240B46] to-[#120721] border-2 border-[#D4AF37]/80 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              className="w-14 h-14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Primary Twin-Gable Architectural Rooflines */}
              <path
                d="M7 31L24 15L41 31"
                stroke="#D4AF37"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M26 33L42 19L57 33"
                stroke="#F59E0B"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Vertical Architectural Pillars */}
              <path
                d="M13 30V48H51V32"
                stroke="#F8FAFC"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Illuminated Gold Window Panes */}
              <rect x="19.5" y="32" width="4.5" height="4.5" rx="0.8" fill="#D4AF37" />
              <rect x="26" y="32" width="4.5" height="4.5" rx="0.8" fill="#FDE68A" />
              <rect x="19.5" y="38.5" width="4.5" height="4.5" rx="0.8" fill="#FDE68A" />
              <rect x="26" y="38.5" width="4.5" height="4.5" rx="0.8" fill="#D4AF37" />
              {/* East Wing Window */}
              <rect x="37.5" y="35" width="6" height="6" rx="1" fill="#F59E0B" />
              {/* Foundation Plinth */}
              <path d="M8 48H56" stroke="#D4AF37" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <p className="text-[10px] font-mono uppercase tracking-[0.34em] text-[#D4AF37] mb-2">
          Etosmania Global Properties
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          Real Estate Gold
        </h2>
        <p className="text-xs font-medium text-purple-200/80 mb-7 tracking-wide">{subtitle}</p>

        {/* Fine Gold Progress Track + Percentage */}
        <div className="w-60 h-1.5 rounded-full bg-white/10 overflow-hidden mb-3 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FDE68A] to-[#F59E0B] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-purple-300/70">
          <span>{progress}%</span>
          <span>·</span>
          <span>Lagos, Nigeria</span>
          <span>·</span>
          <button
            type="button"
            onClick={() => setIsLoading(false)}
            className="text-[#F59E0B] hover:underline cursor-pointer whitespace-nowrap"
          >
            Skip Intro
          </button>
        </div>
      </div>
    </div>
  );
};
