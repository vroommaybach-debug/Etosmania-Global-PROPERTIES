import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import {
  normalizeExternalImageUrl,
  buildProxyFallbackImageUrl,
} from '../../utils/imageUpload';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Etosmania Global Properties Listing',
  className = '',
  containerClassName = '',
  fallbackTitle,
  ...props
}) => {
  const normalizedInitialSrc = normalizeExternalImageUrl(src || '');
  const [activeSrc, setActiveSrc] = useState<string>(normalizedInitialSrc);
  const [triedProxy, setTriedProxy] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const nextNormalized = normalizeExternalImageUrl(src || '');
    setActiveSrc(nextNormalized);
    setTriedProxy(false);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleImageError = () => {
    if (!triedProxy && activeSrc) {
      const proxyUrl = buildProxyFallbackImageUrl(activeSrc);
      if (proxyUrl && proxyUrl !== activeSrc) {
        setTriedProxy(true);
        setActiveSrc(proxyUrl);
        return;
      }
    }
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden bg-[#1E0938] ${containerClassName}`}>
      {!hasError && activeSrc ? (
        <>
          <img
            src={activeSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            {...props}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#2E1065]/40 animate-pulse flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[#D4AF37]/50" />
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#2E1065] via-[#3B0764] to-[#120721] text-white">
          <Building2 className="w-10 h-10 mb-2 text-[#D4AF37]" />
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[#F59E0B] text-center line-clamp-1">
            {fallbackTitle || 'Etosmania Global Properties'}
          </span>
          <span className="text-[11px] text-purple-200/75 mt-0.5">Real Estate Gold · Verified Mandate</span>
        </div>
      )}
    </div>
  );
};
