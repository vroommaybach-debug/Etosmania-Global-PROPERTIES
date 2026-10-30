import React from 'react';

interface AfrocentricPatternProps {
  variant?: 'light' | 'dark' | 'gold' | 'divider';
  className?: string;
}

export const AfrocentricPattern: React.FC<AfrocentricPatternProps> = ({
  variant = 'gold',
  className = '',
}) => {
  if (variant === 'divider') {
    return (
      <div className={`w-full overflow-hidden py-3 flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
        <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#4C1D95]/40" />
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <span className="w-2 h-2 rotate-45 border border-[#D4AF37] bg-[#3B0764]" />
          <span className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37]" />
          <span className="w-2 h-2 rotate-45 border border-[#D4AF37] bg-[#3B0764]" />
        </div>
        <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent via-[#D4AF37]/50 to-[#4C1D95]/40" />
      </div>
    );
  }

  const strokeColor =
    variant === 'light'
      ? '#FFFFFF'
      : variant === 'dark'
      ? '#3B0764'
      : '#D4AF37';

  return (
    <div className={`pointer-events-none select-none overflow-hidden ${className}`} aria-hidden="true">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={`etosmania-geo-${variant}`}
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 4 L60 32 L32 60 L4 32 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1"
            />
            <path
              d="M32 16 L48 32 L32 48 L16 32 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.75"
            />
            <circle cx="32" cy="32" r="2.5" fill={strokeColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#etosmania-geo-${variant})`} />
      </svg>
    </div>
  );
};
