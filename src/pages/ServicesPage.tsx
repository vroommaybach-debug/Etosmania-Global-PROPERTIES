import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Home,
  Users,
  Building2,
  Briefcase,
  KeyRound,
  Compass,
  CheckCircle2,
  MessageCircle,
  Calendar,
  Calculator,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/mockData';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIContext';
import { SectionHeading } from '../components/common/SectionHeading';
import { formatNairaCompact } from '../utils/formatters';
import { getWhatsAppUrl, getGeneralWhatsAppMessage } from '../utils/whatsapp';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  TrendingUp,
  Home,
  Users,
  Building2,
  Briefcase,
  KeyRound,
  Compass,
};

export const ServicesPage: React.FC = () => {
  const { openInspectionModal } = useUI();
  const { services } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Interactive Tool 1: Property Management & Rental Yield Calculator
  const [assetValue, setAssetValue] = useState<number>(165000000);
  const [rentalStrategy, setRentalStrategy] = useState<'annual' | 'shortlet' | 'commercial'>('annual');
  const [unitsCount, setUnitsCount] = useState<number>(1);

  // Interactive Tool 2: Lagos Title Perfection & Closing Cost Estimator
  const [purchasePrice, setPurchasePrice] = useState<number>(120000000);
  const [propertyCategory, setPropertyCategory] = useState<'land' | 'house'>('house');

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const grossYieldRate =
    rentalStrategy === 'shortlet' ? 0.21 : rentalStrategy === 'commercial' ? 0.185 : 0.125;
  const grossAnnualRent = Math.round(assetValue * grossYieldRate * unitsCount);
  const managementFee = Math.round(grossAnnualRent * 0.1);
  const netLandlordPayout = grossAnnualRent - managementFee;

  const legalDeedFee = Math.round(purchasePrice * 0.05);
  const surveyFee = propertyCategory === 'land' ? 2000000 : 1500000;
  const consentPerfectionEst = Math.round(purchasePrice * 0.035);
  const totalClosingAcquisition = purchasePrice + legalDeedFee + surveyFee + consentPerfectionEst;

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#120721] via-[#2E1065] to-[#3B0764] text-white py-16 sm:py-24 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white/10 border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-[0.2em] text-[#F59E0B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Etosmania Global Properties · Core Pillars</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              Comprehensive <span className="text-[#F59E0B]">Real Estate Gold</span> Services
            </h1>
            <p className="text-base sm:text-lg text-purple-100/90 leading-relaxed">
              From Real Estate Consultancy, Sales of Land and Houses, and Co-ownership to
              Commercial Properties and Full-Lifecycle Property Management—discover how our
              specialized divisions build and protect your wealth in Lagos.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#120721] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Advisory Concierge</span>
              </a>
              <button
                type="button"
                onClick={() => openInspectionModal()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-[#F59E0B]" />
                <span>Schedule Private Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Core Services Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeading
            subtitle="Our Specialized Divisions"
            title="Select a Service Division to Engage Our Team"
            description="Every service below features direct WhatsApp connection to our specialist desk at 10B Thomas Estate, Ajah, Lekki."
          />

          <div className="flex flex-wrap gap-2">
            {[
              'All',
              'Advisory & Consulting',
              'Sales & Acquisition',
              'Wealth & Co-Ownership',
              'Asset Management',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#3B0764] text-[#F59E0B] shadow-sm'
                    : 'bg-white text-slate-600 border border-purple-100 hover:border-purple-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map((service, idx) => {
            const IconComponent = ICON_MAP[service.iconName] || ShieldCheck;
            const whatsappHref = getWhatsAppUrl(
              service.whatsappMessage || getGeneralWhatsAppMessage()
            );

            return (
              <article
                id={service.id}
                key={service.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B0764] to-[#1E0938] text-[#F59E0B] flex items-center justify-center border border-[#D4AF37]/50">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-md bg-purple-50 text-[#4C1D95] font-mono text-xs font-semibold">
                      0{idx + 1} · {service.category}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-[#120721] mb-1.5">
                    {service.title}
                  </h2>
                  <p className="text-sm font-semibold text-[#5B21B6] mb-3">{service.tagline}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="border-t border-purple-100 pt-4 mb-6">
                    <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3">
                      Scope &amp; Deliverables
                    </h3>
                    <ul className="space-y-2">
                      {service.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#4C1D95] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#3B0764] hover:bg-[#4C1D95] text-white text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#F59E0B]" />
                    <span>Message on WhatsApp</span>
                  </a>

                  {service.id === 'co-ownership' ? (
                    <Link
                      to="/co-ownership"
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#F59E0B] text-[#120721] text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                    >
                      <span>Co-Ownership Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openInspectionModal({
                          title: `Service Consultation: ${service.title}`,
                          location: '10B Thomas Estate, Ajah / Virtual',
                          id: service.id.toUpperCase(),
                        })
                      }
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg border border-purple-200 hover:border-[#D4AF37] text-[#2E1065] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{service.ctaText}</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Interactive Property Management & Title Closing Calculators */}
      <section className="py-16 sm:py-24 bg-white border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Interactive Advisory Tools"
            title="Property Management Yield & Closing Cost Calculators"
            description="Estimate your annual net landlord cashflow under Etosmania Property Management or calculate statutory Lagos land/house perfection fees."
          />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#FAF9FC] rounded-2xl p-6 sm:p-8 border border-purple-100 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B21B6] font-semibold block">
                    Landlord Cashflow Tool
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#120721]">
                    Property Management Net Income Estimator
                  </h3>
                </div>
                <KeyRound className="w-6 h-6 text-[#D4AF37]" />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-600">Estimated Property Market Value</span>
                    <span className="font-bold text-[#3B0764]">{formatNairaCompact(assetValue)}</span>
                  </div>
                  <input
                    type="range"
                    min={45000000}
                    max={800000000}
                    step={5000000}
                    value={assetValue}
                    onChange={(e) => setAssetValue(Number(e.target.value))}
                    className="w-full accent-[#3B0764] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-2">
                    Lease / Management Strategy
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'annual', label: 'Annual Lease (12.5%)' },
                      { id: 'commercial', label: 'Commercial (18.5%)' },
                      { id: 'shortlet', label: 'Short-Let (21%)' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setRentalStrategy(st.id as typeof rentalStrategy)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          rentalStrategy === st.id
                            ? 'bg-[#3B0764] text-[#F59E0B]'
                            : 'bg-white text-slate-600 border border-purple-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-600">Number of Rental Units</span>
                    <span className="font-bold text-[#3B0764]">{unitsCount} Unit(s)</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={unitsCount}
                    onChange={(e) => setUnitsCount(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#18062C] text-white space-y-2.5">
                <div className="flex justify-between text-xs text-purple-200">
                  <span>Projected Gross Annual Rent</span>
                  <span className="font-mono font-semibold">{formatNairaCompact(grossAnnualRent)}</span>
                </div>
                <div className="flex justify-between text-xs text-purple-200">
                  <span>Etosmania Full-Service Management (10%)</span>
                  <span className="font-mono text-purple-300">-{formatNairaCompact(managementFee)}</span>
                </div>
                <div className="pt-2.5 border-t border-white/15 flex items-baseline justify-between">
                  <span className="text-xs font-mono uppercase text-[#F59E0B]">
                    Net Annual Landlord Remittance
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#F59E0B]">
                    {formatNairaCompact(netLandlordPayout)} / yr
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9FC] rounded-2xl p-6 sm:p-8 border border-purple-100 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B21B6] font-semibold block">
                    Consultancy &amp; Conveyancing Tool
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#120721]">
                    Title Documentation &amp; Closing Estimator
                  </h3>
                </div>
                <Calculator className="w-6 h-6 text-[#D4AF37]" />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-slate-600">Base Property or Land Price</span>
                    <span className="font-bold text-[#3B0764]">{formatNairaCompact(purchasePrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={20000000}
                    max={600000000}
                    step={5000000}
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full accent-[#3B0764] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-500 mb-2">
                    Asset Classification
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPropertyCategory('house')}
                      className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        propertyCategory === 'house'
                          ? 'bg-[#3B0764] text-[#F59E0B]'
                          : 'bg-white text-slate-600 border border-purple-100'
                      }`}
                    >
                      Built Residential / Commercial
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropertyCategory('land')}
                      className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        propertyCategory === 'land'
                          ? 'bg-[#3B0764] text-[#F59E0B]'
                          : 'bg-white text-slate-600 border border-purple-100'
                      }`}
                    >
                      Serviced Land Plot (C of O)
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#18062C] text-white space-y-2.5">
                <div className="flex justify-between text-xs text-purple-200">
                  <span>Deed of Assignment &amp; Legal Documentation (5%)</span>
                  <span className="font-mono">{formatNairaCompact(legalDeedFee)}</span>
                </div>
                <div className="flex justify-between text-xs text-purple-200">
                  <span>Registered Survey Plan &amp; Charting</span>
                  <span className="font-mono">{formatNairaCompact(surveyFee)}</span>
                </div>
                <div className="flex justify-between text-xs text-purple-200">
                  <span>Estimated Governor’s Consent / Perfection Reserve</span>
                  <span className="font-mono">{formatNairaCompact(consentPerfectionEst)}</span>
                </div>
                <div className="pt-2.5 border-t border-white/15 flex items-baseline justify-between">
                  <span className="text-xs font-mono uppercase text-[#F59E0B]">
                    Total All-In Acquisition Estimate
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#F59E0B]">
                    {formatNairaCompact(totalClosingAcquisition)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Execution Protocol */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          subtitle="Seamless Execution"
          title="How We Deliver Your Real Estate Mandate"
        />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS_STEPS.map((s) => (
            <div
              key={s.step}
              className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-3"
            >
              <span className="inline-block px-3 py-1 rounded bg-[#3B0764] text-[#F59E0B] font-mono text-xs font-bold">
                Step {s.step}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#120721]">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
