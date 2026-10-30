import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Calendar,
  ArrowRight,
  MapPin,
  Coins,
  Sparkles,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { SafeImage } from '../components/common/SafeImage';
import { formatNairaCompact } from '../utils/formatters';
import { getWhatsAppUrl, getCoOwnershipWhatsAppMessage } from '../utils/whatsapp';

export const CoOwnershipPage: React.FC = () => {
  const { properties, coOwnershipProjects } = useData();
  const { openInspectionModal } = useUI();

  const [selectedSyndicateId, setSelectedSyndicateId] = useState<string>(
    coOwnershipProjects[0]?.id || 'EGP-CO-01'
  );
  const [slotCount, setSlotCount] = useState<number>(2);
  const [holdYears, setHoldYears] = useState<number>(3);

  const selectedProject =
    coOwnershipProjects.find((p) => p.id === selectedSyndicateId) || coOwnershipProjects[0];

  if (!selectedProject) return null;

  const totalCapital = selectedProject.pricePerSlot * slotCount;
  const ownershipSharePct = ((slotCount / selectedProject.totalSlots) * 100).toFixed(1);
  const annualRentalDividend = Math.round(
    totalCapital * (selectedProject.projectedAnnualYieldPct / 100)
  );
  const totalRentalOverHold = annualRentalDividend * holdYears;
  const projectedAssetExitValue = Math.round(
    totalCapital * Math.pow(1 + selectedProject.projectedCapitalGrowthPct / 100, holdYears)
  );
  const totalProjectedWealth = projectedAssetExitValue + totalRentalOverHold;
  const netGain = totalProjectedWealth - totalCapital;

  const coOwnEligibleProperties = properties.filter((p) => p.coOwnershipEligible);

  const simulatorWhatsAppUrl = getWhatsAppUrl(
    getCoOwnershipWhatsAppMessage({
      projectTitle: selectedProject.title,
      slots: slotCount,
      investmentAmount: formatNairaCompact(totalCapital),
      projectedReturn: formatNairaCompact(totalProjectedWealth),
    })
  );

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#120721] via-[#2E1065] to-[#3B0764] text-white py-16 sm:py-24 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white/10 border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-[0.2em] text-[#F59E0B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fractional Wealth · Etosmania Core Pillar</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
                Real Estate <span className="text-[#F59E0B]">Co-Ownership</span> &amp; Fractional Equity
              </h1>

              <p className="text-base sm:text-lg text-purple-100/90 leading-relaxed max-w-2xl">
                Co-own verified duplexes in Thomas Estate Ajah, corporate short-lets in Lekki Phase
                1, commercial suites in Victoria Island, or C of O land banks in Ibeju-Lekki—backed
                by registered SPV Deeds and audited dividend payouts.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#co-ownership-simulator"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all whitespace-nowrap"
                >
                  <Coins className="w-4 h-4" />
                  <span>Calculate Co-Ownership Dividend</span>
                </a>
                <a
                  href={simulatorWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reserve Slot on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/40 space-y-6">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] block">
                      Entry Threshold
                    </span>
                    <p className="font-mono text-3xl font-bold text-white">From ₦5,000,000</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-[#D4AF37] text-[#120721] font-mono text-xs font-bold uppercase">
                    SPV Protected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#120721]/60 border border-purple-700/40">
                    <span className="text-[11px] font-mono uppercase text-purple-300 block">
                      Target Rental Yield
                    </span>
                    <p className="font-mono text-2xl font-bold text-[#F59E0B] mt-1">16.5% – 21.8%</p>
                    <span className="text-[11px] text-purple-200/75">Per Annum Cashflow</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#120721]/60 border border-purple-700/40">
                    <span className="text-[11px] font-mono uppercase text-purple-300 block">
                      Capital Growth
                    </span>
                    <p className="font-mono text-2xl font-bold text-emerald-400 mt-1">20% – 38.5%</p>
                    <span className="text-[11px] text-purple-200/75">Annual Appreciation</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-purple-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Registered Deed of Co-Ownership &amp; Fractional Title Certificate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>100% Managed by Etosmania Property Management Division</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Structured Secondary Slot Resale or Buy-Back Exit Window</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Co-Ownership Slot & Dividend Simulator */}
      <section id="co-ownership-simulator" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Interactive Wealth Calculator"
          title="Simulate Your Co-Ownership Equity & Dividend Payouts"
          description="Select one of our active Lagos co-ownership syndicates, choose the number of slots you wish to acquire, and preview your projected rental income and capital growth."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-md space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#4C1D95] font-semibold mb-3">
                1. Choose Active Co-Ownership Pool
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coOwnershipProjects.map((pool) => {
                  const active = pool.id === selectedProject.id;
                  return (
                    <button
                      key={pool.id}
                      type="button"
                      onClick={() => {
                        setSelectedSyndicateId(pool.id);
                        setSlotCount(1);
                        setHoldYears(pool.holdPeriodYears);
                      }}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#2E1065] text-white border-[#D4AF37] shadow-md'
                          : 'bg-[#FAF9FC] text-[#120721] border-purple-100 hover:border-purple-300'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider block ${
                          active ? 'text-[#F59E0B]' : 'text-[#5B21B6]'
                        }`}
                      >
                        {pool.assetType}
                      </span>
                      <p className="font-serif font-bold text-sm mt-0.5 line-clamp-1">
                        {pool.title}
                      </p>
                      <p
                        className={`font-mono text-xs mt-1.5 font-semibold ${
                          active ? 'text-purple-200' : 'text-slate-600'
                        }`}
                      >
                        {formatNairaCompact(pool.pricePerSlot)} / slot · {pool.availableSlots} slots left
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#4C1D95] font-semibold">
                  2. Number of Slots to Acquire
                </label>
                <span className="font-mono text-sm font-bold text-[#3B0764] bg-purple-100 px-3 py-1 rounded-md">
                  {slotCount} {slotCount === 1 ? 'Slot' : 'Slots'} ({ownershipSharePct}% Equity)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={Math.max(1, Math.min(10, selectedProject.availableSlots))}
                value={slotCount}
                onChange={(e) => setSlotCount(Number(e.target.value))}
                className="w-full accent-[#4C1D95] cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#4C1D95] font-semibold">
                  3. Investment Holding Horizon
                </label>
                <span className="font-mono text-sm font-bold text-[#3B0764] bg-purple-100 px-3 py-1 rounded-md">
                  {holdYears} {holdYears === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={holdYears}
                onChange={(e) => setHoldYears(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#4C1D95] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-[#120721] block mb-0.5">
                  Legal Instrument: {selectedProject.legalStructure}
                </strong>
                Root of Title: <strong>{selectedProject.titleDocument}</strong>. Payout Schedule:{' '}
                <strong>{selectedProject.payoutFrequency}</strong>.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-[#18062C] via-[#2E1065] to-[#120721] text-white rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-xl space-y-6">
            <div className="border-b border-white/15 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#F59E0B] block">
                Projected Co-Ownership Ledger
              </span>
              <h3 className="font-serif text-xl font-bold mt-1">{selectedProject.title}</h3>
              <p className="text-xs text-purple-200 mt-0.5">{selectedProject.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-mono uppercase text-purple-300 block">
                  Your Capital Commitment
                </span>
                <p className="font-mono text-2xl font-bold text-white mt-1">
                  {formatNairaCompact(totalCapital)}
                </p>
                <span className="text-[11px] text-purple-300">
                  {slotCount} × {formatNairaCompact(selectedProject.pricePerSlot)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-mono uppercase text-purple-300 block">
                  Annual Cash Dividend
                </span>
                <p className="font-mono text-2xl font-bold text-[#F59E0B] mt-1">
                  {selectedProject.projectedAnnualYieldPct > 0
                    ? formatNairaCompact(annualRentalDividend)
                    : 'Capital Growth Pool'}
                </p>
                <span className="text-[11px] text-purple-300">
                  {selectedProject.projectedAnnualYieldPct}% p.a. ({selectedProject.payoutFrequency})
                </span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#120721]/90 border border-[#D4AF37]/40 space-y-3">
              <div className="flex items-center justify-between text-xs text-purple-200">
                <span>Cumulative Rental Payouts ({holdYears} yrs)</span>
                <span className="font-mono font-semibold text-white">
                  {formatNairaCompact(totalRentalOverHold)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-purple-200">
                <span>
                  Projected Equity Value ({selectedProject.projectedCapitalGrowthPct}% p.a.)
                </span>
                <span className="font-mono font-semibold text-white">
                  {formatNairaCompact(projectedAssetExitValue)}
                </span>
              </div>
              <div className="pt-3 border-t border-white/15 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#F59E0B] block">
                    Total Projected Wealth Value
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">
                    Net Gain: +{formatNairaCompact(netGain)}
                  </span>
                </div>
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F59E0B]">
                  {formatNairaCompact(totalProjectedWealth)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={simulatorWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reserve {slotCount} {slotCount === 1 ? 'Slot' : 'Slots'} on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() =>
                  openInspectionModal({
                    title: `${selectedProject.title} (${slotCount} Co-Ownership Slots)`,
                    location: selectedProject.location,
                    id: selectedProject.id,
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#F59E0B]" />
                <span>Book Co-Ownership Deed Review</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Co-Ownership Syndicate Cards */}
      <section className="py-16 bg-white border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Open Co-Ownership Syndicates"
            title="Verified Lagos Assets Open for Fractional Subscription"
            description="Every pool is backed by physical brick-and-mortar property or C of O land charted by Etosmania Global Properties."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {coOwnershipProjects.map((pool) => {
              const progressPct = Math.round(
                ((pool.totalSlots - pool.availableSlots) / pool.totalSlots) * 100
              );
              const poolWhatsApp = getWhatsAppUrl(
                getCoOwnershipWhatsAppMessage({
                  projectTitle: pool.title,
                  slots: 1,
                  investmentAmount: formatNairaCompact(pool.pricePerSlot),
                })
              );

              return (
                <article
                  key={pool.id}
                  className="bg-[#FAF9FC] rounded-2xl overflow-hidden border border-purple-100 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-64 overflow-hidden bg-[#18062C]">
                      <SafeImage
                        src={pool.image}
                        alt={pool.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#120721]/90 via-[#120721]/30 to-transparent" />
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 rounded bg-[#18062C]/90 text-[#F59E0B] border border-[#D4AF37]/40 text-xs font-mono font-semibold">
                          {pool.assetType}
                        </span>
                        <span className="px-3 py-1 rounded bg-emerald-700/90 text-white text-xs font-mono font-semibold">
                          {pool.availableSlots} of {pool.totalSlots} Slots Open
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-200 block">
                            Price Per Co-Ownership Slot
                          </span>
                          <p className="font-mono text-2xl font-bold text-[#F59E0B]">
                            {formatNairaCompact(pool.pricePerSlot)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono uppercase text-purple-200 block">
                            Total Asset Valuation
                          </span>
                          <p className="font-mono text-sm font-semibold">
                            {formatNairaCompact(pool.totalValuation)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span className="inline-flex items-center gap-1 text-[#4C1D95] font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {pool.address}
                        </span>
                        <span>{pool.titleDocument}</span>
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#120721]">{pool.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{pool.summary}</p>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-600">Syndicate Subscription Status</span>
                          <span className="font-bold text-[#3B0764]">{progressPct}% Subscribed</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#3B0764] to-[#D4AF37]"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <ul className="space-y-1.5 pt-2">
                        {pool.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4C1D95] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex flex-wrap items-center gap-3">
                    <a
                      href={poolWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 text-[#F59E0B]" />
                      <span>Subscribe via WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        openInspectionModal({
                          title: `Co-Ownership: ${pool.title}`,
                          location: pool.location,
                          id: pool.id,
                        })
                      }
                      className="py-3 px-4 rounded-lg border border-purple-200 hover:border-[#D4AF37] text-[#2E1065] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Inspect Asset
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Individual Properties Eligible for Co-Ownership */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeading
            subtitle="Direct Property Co-Ownership"
            title="Individual Listings Eligible for Fractional Acquisition"
            description="Browse eligible duplexes, commercial buildings, and land plots below."
          />
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3B0764] hover:text-[#4C1D95] shrink-0"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coOwnEligibleProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
};
