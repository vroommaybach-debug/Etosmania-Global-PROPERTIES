import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

interface LightboxModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  title?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
  title,
}) => {
  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07142B]/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-between text-white mb-4">
        <div>
          <p className="text-xs font-mono-tech uppercase tracking-widest text-[#FACC15]">
            Gallery View ({currentIndex + 1} / {images.length})
          </p>
          {title && <h4 className="font-serif-luxury text-lg font-bold">{title}</h4>}
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative w-full max-w-5xl aspect-[16/10] bg-black/50 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
        <SafeImage
          src={images[currentIndex]}
          alt={`${title || 'Property'} image ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 w-11 h-11 rounded-full bg-[#07142B]/80 hover:bg-[#0A1D42] text-white flex items-center justify-center border border-[#FACC15]/40 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 w-11 h-11 rounded-full bg-[#07142B]/80 hover:bg-[#0A1D42] text-white flex items-center justify-center border border-[#FACC15]/40 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
