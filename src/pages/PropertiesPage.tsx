import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  RotateCcw,
  Sparkles,
  Users,
  MessageCircle,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { CurrencyCode } from '../types';
import { PropertyCard } from '../components/property/PropertyCard';
import { filterProperties, FilterState } from '../utils/filterProperties';
import { getWhatsAppUrl, getGeneralWhatsAppMessage } from '../utils/whatsapp';

export const PropertiesPage: React.FC = () => {
  const { properties } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory =
    (searchParams.get('category') as FilterState['category']) || 'all';
  const initialLocation = searchParams.get('location') || 'all';
  const initialMaxPrice = Number(searchParams.get('maxPrice')) || 0;

  const [category, setCategory] = useState<FilterState['category']>(initialCategory);
  const [location, setLocation] = useState<string>(initialLocation);
  const [propertyType, setPropertyType] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyCode>('NGN');

  const filteredProperties = useMemo(() => {
    return filterProperties(properties, {
      category,
      location,
      type: propertyType,
      bedrooms,
      minPrice: 0,
      maxPrice,
      sortBy,
      searchQuery,
    });
  }, [properties, category, location, propertyType, bedrooms, maxPrice, sortBy, searchQuery]);

  const handleReset = () => {
    setCategory('all');
    setLocation('all');
    setPropertyType('all');
    setBedrooms('all');
    setMaxPrice(0);
    setSortBy('newest');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAF9FC] min-h-screen pt-24 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#120721] via-[#2E1065] to-[#3B0764] text-white py-16 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-[0.2em] text-[#F59E0B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Land · Houses · Commercial · Co-Ownership</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight">
                Real Estate <span className="text-[#F59E0B]">Gold</span> Catalog
              </h1>
              <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
                Browse 100% verified C of O and Governor’s Consent land plots, finished duplexes in
                Thomas Estate Ajah &amp; Lekki, and commercial buildings across Lagos.
              </p>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/15 self-start lg:self-auto">
              <span className="text-xs font-mono text-purple-200 px-2">Display Currency:</span>
              {(['NGN', 'USD', 'GBP'] as CurrencyCode[]).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrency(cur)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    currency === cur
                      ? 'bg-[#D4AF37] text-[#120721]'
                      : 'text-purple-100 hover:bg-white/10'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-lg space-y-4">
          {/* Category Quick Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-100">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Mandates' },
                { id: 'land', label: 'Sales of Land' },
                { id: 'residential', label: 'Residential Houses' },
                { id: 'commercial', label: 'Commercial Properties' },
                { id: 'co-ownership', label: 'Co-Ownership Eligible' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategory(tab.id as FilterState['category'])}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    category === tab.id
                      ? 'bg-[#3B0764] text-[#F59E0B] shadow-sm'
                      : 'bg-[#FAF9FC] text-slate-600 border border-purple-100 hover:border-purple-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link
              to="/co-ownership"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4C1D95] hover:underline whitespace-nowrap"
            >
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Open Co-Ownership Simulator →</span>
            </Link>
          </div>

          {/* Search & Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Thomas Estate, Ajah, Lekki, C of O, Duplex..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-purple-200 text-xs sm:text-sm focus:outline-none focus:border-[#3B0764]"
              />
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#3B0764]"
            >
              <option value="all">All Locations</option>
              <option value="Lekki Phase 1">Ajah / Thomas Estate / Lekki</option>
              <option value="Ibeju-Lekki">Ibeju-Lekki</option>
              <option value="Victoria Island">Victoria Island</option>
              <option value="Ikoyi">Ikoyi</option>
              <option value="Eko Atlantic">Eko Atlantic</option>
              <option value="Ikeja GRA">Ikeja GRA</option>
            </select>

            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#3B0764]"
            >
              <option value="all">All Asset Types</option>
              <option value="Duplex">Duplex</option>
              <option value="Terrace">Terrace</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Land">Serviced Land</option>
              <option value="Commercial">Commercial Plaza</option>
            </select>

            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="px-3 py-2.5 rounded-lg border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#3B0764]"
            >
              <option value={0}>Any Max Price</option>
              <option value={50000000}>Up to ₦50M</option>
              <option value={150000000}>Up to ₦150M</option>
              <option value={300000000}>Up to ₦300M</option>
              <option value={800000000}>Up to ₦800M</option>
            </select>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FilterState['sortBy'])}
                className="flex-1 px-3 py-2.5 rounded-lg border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#3B0764]"
              >
                <option value="newest">Featured First</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
              <button
                type="button"
                onClick={handleReset}
                title="Reset Filters"
                className="p-2.5 rounded-lg border border-purple-200 text-slate-600 hover:text-[#3B0764] hover:bg-purple-50 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-mono text-slate-600">
            Showing <strong className="text-[#3B0764]">{filteredProperties.length}</strong> verified
            mandate(s)
          </p>
          <a
            href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Request Off-Market Mandate via WhatsApp</span>
          </a>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#120721]">
              No Exact Matches in Current Filter
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Reset your search filters or contact our acquisitions desk at{' '}
              <strong>10B Thomas Estate, Ajah</strong> for private off-market plots and houses.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-lg bg-[#3B0764] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Reset All Filters
              </button>
              <a
                href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} currency={currency} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
