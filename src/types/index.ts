export type PropertyType = 'Residential' | 'Commercial' | 'Land' | 'Co-Ownership' | 'Investment';
export type PropertyStatus = 'Available' | 'Reserved' | 'Sold' | 'Under Construction' | 'Co-Ownership Open';
export type LocationArea =
  | 'Ajah'
  | 'Lekki'
  | 'Egbeda'
  | 'Akowonjo'
  | 'Agbara'
  | 'Ikoyi'
  | 'Victoria Island'
  | 'Ikeja GRA'
  | 'Epe'
  | 'Ibeju-Lekki'
  | 'Abuja';

export type CurrencyCode = 'NGN' | 'USD' | 'GBP';

export interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  priceFormatted: string;
  location: string;
  area: LocationArea;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  featured?: boolean;
  isNew?: boolean;
  description: string;
  amenities: string[];
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: {
    name: string;
    role: string;
    phone: string;
    whatsapp: string;
    avatar: string;
  };
  createdAt: string;
  coOwnershipDetails?: {
    slotsTotal: number;
    slotsAvailable: number;
    pricePerSlot: string;
    projectedAnnualYield: string;
    holdPeriod: string;
  };
}

export interface DevelopmentProject {
  id: string;
  name: string;
  tagline: string;
  location: string;
  completionDate: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  startingPrice: string;
  totalUnits: number;
  availableUnits: number;
  description: string;
  highlights: string[];
  heroImage: string;
  gallery: string[];
  brochureUrl?: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  description: string;
  iconName: string;
  deliverables: string[];
  ctaText: string;
  whatsappPrompt: string;
}

export interface CoOwnershipAsset {
  id: string;
  title: string;
  location: string;
  totalValue: string;
  pricePerSlot: string;
  totalSlots: number;
  availableSlots: number;
  projectedYield: string;
  appreciationTarget: string;
  minimumHold: string;
  status: 'Open for Subscription' | '85% Subscribed' | 'Fully Subscribed';
  image: string;
  highlights: string[];
}

export interface SiteConfig {
  heroStyle: 'full-bleed' | 'split';
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  heroSecondaryImage: string;
  missionStatement: string;
  visionStatement: string;
  coreValues: string[];
  headOfficeAddress: string;
  contactEmail: string;
  whatsappCtaLabel: string;
}

export interface InspectionBooking {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  inspectionType: 'In-Person' | 'Virtual Video Tour' | 'Co-Ownership Briefing';
  notes?: string;
  createdAt: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  budgetRange?: string;
  serviceCategory?: string;
  createdAt: string;
}
