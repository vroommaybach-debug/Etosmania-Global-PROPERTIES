import React from 'react';

interface PatternProps {
  className?: string;
  opacity?: number;
}

export const AfrocentricPattern: React.FC<PatternProps> = ({
  className = '',
  opacity = 0.04,
}) => {
  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="etosmania-geo-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 0L60 30L30 60L0 30Z"
              fill="none"
              stroke="#FACC15"
              strokeWidth="1.2"
            />
            <circle cx="30" cy="30" r="4" fill="none" stroke="#38BDF8" strokeWidth="1.2" />
            <path
              d="M15 15L45 15L45 45L15 45Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#etosmania-geo-grid)" />
      </svg>
    </div>
  );
};
