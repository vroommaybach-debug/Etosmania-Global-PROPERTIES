import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex?: number;
  initialIndex?: number;
  onSelectIndex?: (index: number) => void;
  title?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  initialIndex = 0,
  onSelectIndex,
  title,
}) => {
  const [internalIndex, setInternalIndex] = useState(initialIndex);

  useEffect(() => {
    setInternalIndex(currentIndex ?? initialIndex);
  }, [currentIndex, initialIndex, isOpen]);

  const activeIndex = currentIndex !== undefined ? currentIndex : internalIndex;

  const handleSelect = (idx: number) => {
    setInternalIndex(idx);
    if (onSelectIndex) onSelectIndex(idx);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        handleSelect((activeIndex + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        handleSelect((activeIndex - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className="fixed inset-0 z-[100] bg-[#120721]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white pb-3">
        <div>
          {title && <h3 className="text-sm font-serif font-bold truncate max-w-md">{title}</h3>}
          <span className="text-xs font-mono text-[#F59E0B]">
            Image {activeIndex + 1} of {images.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          aria-label="Close image lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Frame */}
      <div className="relative flex-1 flex items-center justify-center max-h-[75vh]">
        <SafeImage
          src={images[activeIndex]}
          alt={title ? `${title} photo ${activeIndex + 1}` : 'Property photo'}
          containerClassName="w-full h-full max-w-5xl rounded-xl border border-[#D4AF37]/30"
          className="object-contain max-h-[75vh]"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => handleSelect((activeIndex - 1 + images.length) % images.length)}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-[#18062C]/80 text-white hover:bg-[#3B0764] border border-[#D4AF37]/40 transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => handleSelect((activeIndex + 1) % images.length)}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-[#18062C]/80 text-white hover:bg-[#3B0764] border border-[#D4AF37]/40 transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      <div className="pt-4 flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={img + idx}
            type="button"
            onClick={() => handleSelect(idx)}
            className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
              activeIndex === idx
                ? 'border-[#D4AF37] scale-105 opacity-100'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <SafeImage
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              containerClassName="w-full h-full"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
