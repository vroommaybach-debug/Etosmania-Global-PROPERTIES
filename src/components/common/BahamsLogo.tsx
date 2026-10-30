import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
  variant?: 'dark' | 'light';
}

export const BahamsLogo: React.FC<LogoProps> = ({
  className = 'w-10 h-10',
  showText = true,
  showTagline = true,
  variant = 'dark',
}) => {
  const isLight = variant === 'light';

  return (
    <div className="inline-flex items-center gap-3 select-none group shrink-0 whitespace-nowrap">
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} transition-transform duration-300 group-hover:scale-105`}
        >
          {/* Royal Dark Blue Monogram Shield */}
          <rect
            width="64"
            height="64"
            rx="14"
            fill={isLight ? '#07142B' : '#0A1D42'}
          />
          <rect
            x="3"
            y="3"
            width="58"
            height="58"
            rx="11"
            stroke="url(#etosGoldGrad)"
            strokeWidth="1.6"
            strokeOpacity="0.85"
          />

          {/* Twin Architectural Roofs (Inspired by Etosmania Banner Crest in Royal Blue, White & Yellow) */}
          <path
            d="M12 31L26 17L40 31"
            stroke="#38BDF8"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M26 31L40 17L52 29"
            stroke="url(#etosGoldGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Structural Residence Frame */}
          <path
            d="M17 29V46H47V28"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lit Gold Windows */}
          <rect x="23" y="32" width="4.5" height="4.5" rx="1" fill="#FACC15" />
          <rect x="29.5" y="32" width="4.5" height="4.5" rx="1" fill="#FACC15" />
          <rect x="23" y="38.5" width="4.5" height="4.5" rx="1" fill="#38BDF8" />
          <rect x="29.5" y="38.5" width="4.5" height="4.5" rx="1" fill="#FACC15" />

          {/* Gold Plinth */}
          <path
            d="M11 46H53"
            stroke="url(#etosGoldGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient
              id="etosGoldGrad"
              x1="8"
              y1="12"
              x2="56"
              y2="54"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FEF08A" />
              <stop offset="0.5" stopColor="#FACC15" />
              <stop offset="1" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className={`font-serif-luxury text-base sm:text-xl font-bold tracking-tight ${
                isLight ? 'text-white' : 'text-[#07142B]'
              }`}
            >
              ETOSMANIA
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#FACC15] text-[#07142B] border border-[#EAB308]">
              GLOBAL
            </span>
          </div>
          {showTagline && (
            <span
              className={`text-[8px] sm:text-[9px] font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase mt-1 ${
                isLight ? 'text-[#FACC15]' : 'text-[#0A1D42]'
              }`}
            >
              Properties Investment Ltd
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const EtosmaniaLogo = BahamsLogo;
export default BahamsLogo;
