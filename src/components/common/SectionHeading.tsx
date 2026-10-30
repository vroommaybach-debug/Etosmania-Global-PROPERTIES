import React from 'react';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}) => {
  return (
    <div
      className={`max-w-3xl ${
        align === 'center' ? 'mx-auto text-center' : 'text-left'
      } ${className}`}
    >
      {subtitle && (
        <div
          className={`inline-flex items-center gap-2.5 mb-3 ${
            align === 'center' ? 'justify-center' : 'justify-start'
          }`}
        >
          <span className="w-6 h-0.5 bg-[#D4AF37] rounded-full" />
          <span
            className={`text-xs font-mono uppercase tracking-[0.22em] font-semibold ${
              light ? 'text-[#F59E0B]' : 'text-[#5B21B6]'
            }`}
          >
            {subtitle}
          </span>
          {align === 'center' && <span className="w-6 h-0.5 bg-[#D4AF37] rounded-full" />}
        </div>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.12] ${
          light ? 'text-white' : 'text-[#120721]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            light ? 'text-purple-100/80' : 'text-slate-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
