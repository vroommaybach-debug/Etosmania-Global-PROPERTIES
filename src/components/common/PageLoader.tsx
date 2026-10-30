import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BahamsLogo } from './BahamsLogo';

const PAGE_LABELS: Record<string, string> = {
  '/': 'Real Estate Gold • Ajah • Lekki • Egbeda • Akowonjo • Agbara',
  '/properties': 'Verified Land, Residential & Commercial Portfolio',
  '/co-ownership': 'Fractional Real Estate Co-Ownership & Wealth Hub',
  '/services': 'Our 8 Core Real Estate & Advisory Services',
  '/developments': 'Sustainable Community-Centered Estate Developments',
  '/about': 'Mission, Vision & Core Values — Etosmania Global',
  '/contact': '10b Thomas Estate, Ajah, Lekki • Advisory Concierge',
  '/admin': 'Executive Inventory & Operations Portal',
};

export const PageLoader: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(14);

  useEffect(() => {
    setIsLoading(true);
    setProgress(18);

    const t1 = setTimeout(() => setProgress(46), 300);
    const t2 = setTimeout(() => setProgress(78), 680);
    const t3 = setTimeout(() => setProgress(100), 1050);
    const t4 = setTimeout(() => {
      setIsLoading(false);
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [location.pathname]);

  const currentLabel =
    PAGE_LABELS[location.pathname] ||
    (location.pathname.startsWith('/properties/')
      ? 'Loading Verified Property Dossier...'
      : location.pathname.startsWith('/developments/')
      ? 'Loading Estate Masterplan...'
      : 'Etosmania Global Properties Investment Limited');

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="etosmania-page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-between bg-[#07142B] text-white px-6 py-10 pointer-events-auto overflow-hidden"
        >
          {/* Ambient Royal Blue & Gold Architectural Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-45"
            style={{
              background:
                'radial-gradient(circle at 50% 35%, rgba(250, 204, 21, 0.16) 0%, rgba(15, 41, 90, 0.65) 45%, rgba(7, 20, 43, 0.98) 100%)',
            }}
          />

          {/* Top Bar */}
          <div className="relative z-10 w-full max-w-6xl flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-[0.22em] text-blue-200/80">
            <span>ETOSMANIA GLOBAL PROPERTIES</span>
            <span className="text-[#FACC15] font-semibold">REAL ESTATE GOLD</span>
          </div>

          {/* Center Architectural Crest & Animated Progress */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mb-6 p-5 rounded-3xl bg-white/[0.05] border border-[#FACC15]/30 shadow-2xl backdrop-blur-md"
            >
              <BahamsLogo variant="light" className="w-14 h-14" showText={false} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2"
            >
              Etosmania Global Properties
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.35 }}
              className="text-xs sm:text-sm text-[#FACC15] font-medium tracking-wide mb-7"
            >
              {currentLabel}
            </motion.p>

            {/* Gold Shimmer Progress Bar */}
            <div className="w-64 sm:w-72 h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px] border border-white/15">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] via-[#FACC15] to-[#FEF08A]"
                initial={{ width: '15%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              />
            </div>

            <div className="mt-3 flex items-center gap-2 text-[10px] font-mono-tech uppercase tracking-[0.25em] text-blue-200/70">
              <span> integrity • professionalism • value </span>
              <span className="text-[#FACC15] font-bold">{progress}%</span>
            </div>
          </div>

          {/* Bottom Address Footer */}
          <div className="relative z-10 text-center text-[11px] text-blue-200/70 tracking-wider">
            Ajah • Lekki • Egbeda • Akowonjo • Agbara • Lagos State
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
