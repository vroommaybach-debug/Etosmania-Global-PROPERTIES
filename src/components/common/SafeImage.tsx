import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

const FALLBACK_LUXURY_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80';

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || FALLBACK_LUXURY_IMAGE);
  const [hasFailedTwice, setHasFailedTwice] = useState(false);

  const handleError = () => {
    if (imgSrc !== FALLBACK_LUXURY_IMAGE) {
      setImgSrc(FALLBACK_LUXURY_IMAGE);
    } else {
      setHasFailedTwice(true);
    }
  };

  if (hasFailedTwice) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#07142B] to-[#0F295A] text-white p-6 text-center ${className}`}
      >
        <Building2 className="w-10 h-10 text-[#FACC15] mb-2 opacity-85" />
        <span className="text-xs font-mono-tech uppercase tracking-widest text-[#FACC15]">
          {fallbackText || alt || 'Etosmania Global Properties'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt || 'Etosmania Global Properties'}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
