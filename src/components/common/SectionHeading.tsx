import React from 'react';

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  description?: string;
  alignment?: 'left' | 'center';
  light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  description,
  alignment = 'left',
  light = false,
}) => {
  const isCenter = alignment === 'center';

  return (
    <div className={`max-w-3xl ${isCenter ? 'mx-auto text-center' : ''}`}>
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-[0.2em] mb-4 ${
          light
            ? 'bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/40'
            : 'bg-[#0A1D42] text-[#FACC15] border border-[#0A1D42]'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
        <span>{subtitle}</span>
      </div>

      <h2
        className={`font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] ${
          light ? 'text-white' : 'text-[#07142B]'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            light ? 'text-blue-100/85' : 'text-slate-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
