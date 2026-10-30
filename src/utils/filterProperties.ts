import { Property } from '../types';

export interface FilterState {
  category?: 'all' | 'land' | 'residential' | 'commercial' | 'co-ownership';
  location?: string;
  selectedLocation?: string;
  type?: string;
  selectedType?: string;
  bedrooms?: string | number;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc';
  searchQuery?: string;
}

/**
 * Pure client-side filtering and sorting for Etosmania Global Properties listings
 * across Ajah, Lekki, Egbeda, Akowonjo, Agbara, Ibeju-Lekki, Epe, VI, Ikoyi & Ikeja GRA.
 */
export function filterProperties(properties: Property[], filter: FilterState): Property[] {
  return properties
    .filter((property) => {
      // Category filter
      if (filter.category && filter.category !== 'all') {
        if (filter.category === 'land' && property.type !== 'Land') return false;
        if (filter.category === 'commercial' && property.type !== 'Commercial') return false;
        if (
          filter.category === 'residential' &&
          !['Residential', 'Villa', 'Penthouse', 'Duplex', 'Terrace', 'Apartment'].includes(
            property.type
          )
        ) {
          return false;
        }
        if (
          filter.category === 'co-ownership' &&
          property.type !== 'Co-Ownership' &&
          !property.coOwnershipDetails
        ) {
          return false;
        }
      }

      // Location / Corridor filter (matches area primarily)
      const locFilter = filter.selectedLocation || filter.location;
      if (locFilter && locFilter !== 'all' && locFilter !== 'All') {
        const targetLoc = locFilter.toLowerCase();
        const matchesArea = property.area
          ? property.area.toLowerCase() === targetLoc
          : (property.location || '').toLowerCase() === targetLoc;
        if (!matchesArea) {
          return false;
        }
      }

      // Property type filter
      const typeFilter = filter.selectedType || filter.type;
      if (
        typeFilter &&
        typeFilter !== 'all' &&
        typeFilter !== 'All' &&
        property.type.toLowerCase() !== typeFilter.toLowerCase()
      ) {
        return false;
      }

      // Bedrooms filter
      if (
        filter.bedrooms !== undefined &&
        filter.bedrooms !== 'all' &&
        filter.bedrooms !== 'All'
      ) {
        const targetBeds = Number(filter.bedrooms);
        if (!isNaN(targetBeds) && targetBeds > 0) {
          if (property.bedrooms < targetBeds) return false;
        }
      }

      // Explicit numeric min/max price range
      if (filter.minPrice && filter.minPrice > 0 && property.price < filter.minPrice) {
        return false;
      }
      if (filter.maxPrice && filter.maxPrice > 0 && property.price > filter.maxPrice) {
        return false;
      }

      // Named price range bucket
      if (filter.priceRange && filter.priceRange !== 'All') {
        if (filter.priceRange === 'under-50m' && property.price >= 50_000_000) return false;
        if (
          filter.priceRange === '50m-150m' &&
          (property.price < 50_000_000 || property.price > 150_000_000)
        ) {
          return false;
        }
        if (
          filter.priceRange === '150m-300m' &&
          (property.price < 150_000_000 || property.price > 300_000_000)
        ) {
          return false;
        }
        if (filter.priceRange === 'above-300m' && property.price <= 300_000_000) return false;
      }

      // Text search query
      if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase().trim();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesArea = (property.area || '').toLowerCase().includes(query);
        const matchesLocation = (property.location || '').toLowerCase().includes(query);
        const matchesDesc = (property.description || '').toLowerCase().includes(query);
        const matchesAmenities = (property.amenities || []).some((a) =>
          a.toLowerCase().includes(query)
        );
        const matchesId = property.id.toLowerCase().includes(query);

        if (
          !matchesTitle &&
          !matchesArea &&
          !matchesLocation &&
          !matchesDesc &&
          !matchesAmenities &&
          !matchesId
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (filter.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filter.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return a.id.localeCompare(b.id);
    });
}
