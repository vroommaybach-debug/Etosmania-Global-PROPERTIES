import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, MessageCircle, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PropertyCard } from '../components/property/PropertyCard';
import { filterProperties } from '../utils/filterProperties';
import { getWhatsAppUrl } from '../utils/whatsapp';

const CORRIDOR_PILLS = [
  'All',
  'Ajah',
  'Lekki',
  'Egbeda',
  'Akowonjo',
  'Agbara',
  'Ibeju-Lekki',
  'Epe',
  'Victoria Island',
  'Ikoyi',
  'Ikeja GRA',
];

export const PropertiesPage: React.FC = () => {
  const { properties } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');
  const [priceRange, setPriceRange] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');

  useEffect(() => {
    const qSearch = searchParams.get('search');
    const qType = searchParams.get('type');
    const qLoc = searchParams.get('location');
    if (qSearch !== null) setSearchQuery(qSearch);
    if (qType !== null) setSelectedType(qType);
    if (qLoc !== null) setSelectedLocation(qLoc);
  }, [searchParams]);

  const filteredProperties = useMemo(() => {
    return filterProperties(properties, {
      searchQuery,
      selectedType,
      selectedLocation,
      priceRange,
      bedrooms,
    });
  }, [properties, searchQuery, selectedType, selectedLocation, priceRange, bedrooms]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedLocation('All');
    setPriceRange('All');
    setBedrooms('All');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Page Header */}
      <section className="bg-[#07142B] text-white py-14 lg:py-20 border-b-4 border-[#FACC15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-[#07142B] font-mono-tech text-xs font-extrabold uppercase tracking-widest mb-3">
            Verified Portfolio Catalog
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight">
            Sales of Land, Residential Homes &amp; Commercial Properties
          </h1>
          <p className="text-blue-100/85 text-base sm:text-lg max-w-2xl mt-3">
            Every property listed by Etosmania Global Properties Investment Limited across Ajah, Lekki, Egbeda, Akowonjo, Agbara, and Ibeju-Lekki is backed by verified survey charting and clean title.
          </p>

          {/* Quick Corridor Filter Strip */}
          <div className="mt-7 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-mono-tech uppercase tracking-wider text-[#FACC15] flex items-center gap-1 shrink-0 mr-1">
              <MapPin className="w-3.5 h-3.5" />
              Corridors:
            </span>
            {CORRIDOR_PILLS.map((area) => {
              const active = selectedLocation === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSelectedLocation(area)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#FACC15] text-[#07142B] shadow-md'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                  }`}
                >
                  {area === 'All' ? 'All Lagos Corridors' : area}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Filter Console */}
        <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-[#FACC15] mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A1D42]">
              <SlidersHorizontal className="w-4 h-4 text-[#EAB308]" />
              <span>Filter Verified Properties ({filteredProperties.length} Found)</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0A1D42] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, ID, Egbeda, Agbara..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0A1D42]"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#0A1D42]"
            >
              <option value="All">All Categories</option>
              <option value="Residential">Residential Homes</option>
              <option value="Land">Titled Land Plots</option>
              <option value="Co-Ownership">Co-Ownership Slots</option>
              <option value="Commercial">Commercial Properties</option>
              <option value="Investment">Investment Assets</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#0A1D42]"
            >
              <option value="All">All Lagos Corridors</option>
              <option value="Ajah">Ajah / Thomas Estate</option>
              <option value="Lekki">Lekki Phase 1 / Chevron</option>
              <option value="Egbeda">Egbeda</option>
              <option value="Akowonjo">Akowonjo</option>
              <option value="Agbara">Agbara</option>
              <option value="Ibeju-Lekki">Ibeju-Lekki</option>
              <option value="Epe">Epe</option>
              <option value="Victoria Island">Victoria Island</option>
              <option value="Ikoyi">Ikoyi</option>
              <option value="Ikeja GRA">Ikeja GRA</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#0A1D42]"
            >
              <option value="All">Any Budget Range</option>
              <option value="under-50m">Under ₦50 Million</option>
              <option value="50m-150m">₦50M – ₦150 Million</option>
              <option value="150m-300m">₦150M – ₦300 Million</option>
              <option value="above-300m">Above ₦300 Million</option>
            </select>

            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#0A1D42]"
            >
              <option value="All">Any Bedrooms / Land</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#07142B]">
              No Matching Properties Found
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              We have off-market land plots, duplexes, and commercial buildings across Ajah, Lekki, Egbeda, Akowonjo, and Agbara. Reset your filters or message our desk on WhatsApp for a custom list.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-xl bg-[#FACC15] text-[#07142B] font-bold text-xs uppercase tracking-wider"
              >
                Reset All Filters
              </button>
              <a
                href={getWhatsAppUrl(
                  'Hello Etosmania Global Properties, I am looking for a specific property specification in Lagos. Please share available off-market options.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0A1D42] text-white font-bold text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Request Custom Property List</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
