import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  MessageCircle,
  Calendar,
  Award,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SectionHeading } from '../components/common/SectionHeading';
import { SafeImage } from '../components/common/SafeImage';
import { getCoOwnershipWhatsAppUrl, getWhatsAppUrl } from '../utils/whatsapp';

export const CoOwnershipPage: React.FC = () => {
  const { openInspectionModal, coOwnershipAssets } = useData();
  const [selectedAssetId, setSelectedAssetId] = useState(
    coOwnershipAssets[0]?.id || 'EGP-CO-01'
  );
  const [slots, setSlots] = useState(2);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Hero Banner */}
      <section className="bg-[#07142B] text-white py-16 lg:py-24 border-b-4 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FACC15] text-[#07142B] font-extrabold text-xs uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              <span>Etosmania Fractional Wealth Hub</span>
            </div>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold tracking-tight leading-[1.06]">
              Real Estate Co-Ownership: Own Prime Lagos Assets Together.
            </h1>
            <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed">
              Co-invest in high-yield short-let residences, executive apartments, and commercial land across Ajah, Lekki, Egbeda, and Akowonjo without needing 100% of the capital upfront. Backed by registered trust deeds, C of O titles, and audited rental dividends.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={getWhatsAppUrl(
                  'Hello Etosmania Global Properties, I would like to receive the Co-Ownership Syndicate Prospectus.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Request Co-Ownership Prospectus</span>
              </a>
              <button
                onClick={() =>
                  openInspectionModal({
                    id: 'CO-OWNERSHIP',
                    title: 'Real Estate Co-Ownership Briefing',
                  })
                }
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#07142B] font-extrabold text-xs uppercase tracking-wider cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#07142B]" />
                <span>Book Co-Ownership Briefing</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Co-Ownership Pools */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Open Syndicates"
          title="Current Co-Ownership Property Pools."
          description="Select your preferred asset pool across Ajah, Lekki, Akowonjo, or Egbeda, choose the number of fractional slots you wish to acquire, and reserve directly with our investment desk."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {coOwnershipAssets.map((asset) => {
            const progressPercent = Math.round(
              ((asset.totalSlots - asset.availableSlots) / asset.totalSlots) * 100
            );

            return (
              <div
                key={asset.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#0A1D42]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <SafeImage
                      src={asset.image}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#07142B] text-[#FACC15] border border-[#FACC15]/40">
                        {asset.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-[#07142B]/95 backdrop-blur-xs p-3 rounded-xl text-white flex items-center justify-between border border-white/15">
                      <div>
                        <p className="text-[10px] uppercase text-[#FACC15] font-mono-tech">
                          Price Per Slot
                        </p>
                        <p className="font-mono-tech text-lg font-bold">{asset.pricePerSlot}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-blue-200/70 font-mono-tech">
                          Asset Valuation
                        </p>
                        <p className="font-mono-tech text-sm font-semibold">{asset.totalValue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-[#0A1D42]">{asset.location}</p>
                      <h3 className="font-serif-luxury text-xl font-bold text-[#07142B] mt-1">
                        {asset.title}
                      </h3>
                    </div>

                    {/* Subscription Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono-tech">
                        <span className="text-slate-500">{progressPercent}% Subscribed</span>
                        <span className="font-bold text-[#0A1D42]">
                          {asset.availableSlots} of {asset.totalSlots} Slots Left
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#0A1D42] to-[#FACC15]"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/70 text-xs">
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">Projected Return</p>
                        <p className="font-bold text-emerald-700 mt-0.5">{asset.projectedYield}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">Hold Horizon</p>
                        <p className="font-bold text-[#07142B] mt-0.5">{asset.minimumHold}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      {asset.highlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-[#0A1D42] shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={getCoOwnershipWhatsAppUrl({
                      title: asset.title,
                      slots: 1,
                      pricePerSlot: asset.pricePerSlot,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setSelectedAssetId(asset.id);
                      setSlots(1);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#0A1D42] hover:bg-[#07142B] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#FACC15]" />
                    <span>Subscribe to Slot on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* How Legal Protection Works */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
          <h3 className="font-serif-luxury text-2xl font-bold text-[#07142B] mb-6">
            How Your Co-Ownership Equity Is Legally Protected
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <ShieldCheck className="w-7 h-7 text-[#0A1D42]" />
              <h4 className="font-bold text-base text-[#07142B]">
                1. Registered Co-Ownership Deed
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every slot subscriber receives a legally executed Deed of Co-Ownership and Slot
                Allocation Certificate specifying their exact percentage equity in the underlying
                property.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <TrendingUp className="w-7 h-7 text-[#EAB308]" />
              <h4 className="font-bold text-base text-[#07142B]">
                2. Audited Rental Distributions
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our in-house Property Management team manages tenants, power, and maintenance,
                distributing net rental income directly to co-owners’ bank accounts.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <Award className="w-7 h-7 text-[#0A1D42]" />
              <h4 className="font-bold text-base text-[#07142B]">
                3. Seamless Slot Transfer &amp; Exit
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need liquidity? You can resell your slot to existing pool members or through
                Etosmania’s secondary investor desk at current market valuation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
