import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  showTagline?: boolean;
}

/**
 * Custom SVG Architectural Twin-Gable Roofline Crest & Wordmark
 * for Etosmania Global Properties Investment Limited
 * Inspired directly by the twin-gable emblem on the official Etosmania banner.
 */
export const EtosmaniaLogo: React.FC<LogoProps> = ({
  variant = 'dark',
  className = '',
  showTagline = true,
}) => {
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Twin-Gable Sovereign Purple & Gold Emblem */}
      <div
        className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md ${
          isLight
            ? 'bg-gradient-to-br from-[#4C1D95] to-[#1E0938] border border-[#D4AF37]/60'
            : 'bg-gradient-to-br from-[#3B0764] to-[#1E0938] border border-[#D4AF37]/70'
        }`}
      >
        <svg
          viewBox="0 0 64 64"
          className="w-8 h-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Left main gable roof */}
          <path
            d="M7 31L24 16L41 31"
            stroke="#D4AF37"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right twin gable roof */}
          <path
            d="M27 33L42 20L57 33"
            stroke="#F59E0B"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Architectural vertical walls */}
          <path
            d="M13 30V48H51V32"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left residence window grid */}
          <rect x="19" y="32" width="4.5" height="4.5" rx="0.8" fill="#D4AF37" />
          <rect x="25.5" y="32" width="4.5" height="4.5" rx="0.8" fill="#D4AF37" />
          <rect x="19" y="38.5" width="4.5" height="4.5" rx="0.8" fill="#D4AF37" />
          <rect x="25.5" y="38.5" width="4.5" height="4.5" rx="0.8" fill="#D4AF37" />
          {/* Right residence gold window */}
          <rect x="37.5" y="35.5" width="5.5" height="5.5" rx="1" fill="#F59E0B" />
          {/* Gold plinth foundation */}
          <path d="M8 48H56" stroke="#D4AF37" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-serif font-extrabold text-lg sm:text-xl tracking-tight ${
              isLight ? 'text-white' : 'text-[#2E1065]'
            }`}
          >
            ETOSMANIA
          </span>
          <span className="font-sans font-bold text-[10px] sm:text-xs tracking-[0.16em] uppercase text-[#D4AF37]">
            GLOBAL
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[9px] font-mono uppercase tracking-[0.18em] mt-0.5 ${
              isLight ? 'text-purple-200/85' : 'text-slate-600'
            }`}
          >
            Properties Investment Ltd
          </span>
        )}
      </div>
    </div>
  );
};

// Keep BahamsLogo export alias so any existing import continues working seamlessly
export const BahamsLogo = EtosmaniaLogo;
export default EtosmaniaLogo;
