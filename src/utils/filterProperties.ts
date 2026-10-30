import { Property } from '../types';

export interface FilterState {
  category?: 'all' | 'land' | 'residential' | 'commercial' | 'co-ownership';
  location: string;
  type: string;
  bedrooms: string | number;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
  searchQuery: string;
}

/**
 * Pure client-side filtering and sorting for Etosmania Global Properties listings
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
          !['Villa', 'Penthouse', 'Duplex', 'Terrace', 'Apartment'].includes(property.type)
        ) {
          return false;
        }
        if (filter.category === 'co-ownership' && !property.coOwnershipEligible) return false;
      }

      // Location filter
      if (
        filter.location &&
        filter.location !== 'all' &&
        filter.location !== 'All' &&
        property.location !== filter.location
      ) {
        return false;
      }

      // Property type filter
      if (
        filter.type &&
        filter.type !== 'all' &&
        filter.type !== 'All' &&
        property.type.toLowerCase() !== filter.type.toLowerCase()
      ) {
        return false;
      }

      // Bedrooms filter
      if (filter.bedrooms !== 'all' && filter.bedrooms !== 'All') {
        const targetBeds = Number(filter.bedrooms);
        if (targetBeds === 5) {
          if (property.bedrooms < 5) return false;
        } else if (property.bedrooms !== targetBeds) {
          return false;
        }
      }

      // Price range
      if (filter.minPrice > 0 && property.price < filter.minPrice) {
        return false;
      }
      if (filter.maxPrice > 0 && property.price > filter.maxPrice) {
        return false;
      }

      // Text search query
      if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase().trim();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesAddress = property.address.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        const matchesHighlights = (property.highlights || []).some((h) =>
          h.toLowerCase().includes(query)
        );
        const matchesAmenities = (property.amenities || []).some((a) =>
          a.toLowerCase().includes(query)
        );
        const matchesId = property.id.toLowerCase().includes(query);

        if (
          !matchesTitle &&
          !matchesAddress &&
          !matchesLocation &&
          !matchesHighlights &&
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
