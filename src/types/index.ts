export type PropertyType = 'Villa' | 'Penthouse' | 'Duplex' | 'Terrace' | 'Apartment' | 'Land' | 'Commercial';

export type LocationArea = 'Ikoyi' | 'Victoria Island' | 'Lekki Phase 1' | 'Eko Atlantic' | 'Banana Island' | 'Ibeju-Lekki' | 'Ikeja GRA';

export type PropertyStatus = 'Available' | 'Sold' | 'Off-Plan';

export type CurrencyCode = 'NGN' | 'USD' | 'GBP';

export interface Property {
  id: string;
  title: string;
  slug: string;
  price: number; // Base price in NGN
  location: LocationArea;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  plotSizeSqm?: number;
  type: PropertyType;
  status: PropertyStatus;
  featured?: boolean;
  coOwnershipEligible?: boolean;
  pricePerSlot?: number;
  titleDocument: string; // e.g., "Governor's Consent", "C of O"
  CompletionQuarter?: string;
  description: string;
  highlights: string[];
  amenities: string[];
  images: string[];
  videoUrl?: string;
  agent: {
    name: string;
    role: string;
    phone: string;
    image: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface CoOwnershipProject {
  id: string;
  title: string;
  slug: string;
  location: LocationArea;
  address: string;
  assetType: 'Residential Duplex Pool' | 'Short-Let Apartment Syndicate' | 'Commercial Corporate Suite' | 'Strategic Land Bank';
  totalValuation: number;
  pricePerSlot: number;
  totalSlots: number;
  availableSlots: number;
  minSlots: number;
  projectedAnnualYieldPct: number;
  projectedCapitalGrowthPct: number;
  holdPeriodYears: number;
  payoutFrequency: 'Quarterly' | 'Bi-Annual' | 'Annual Exit';
  titleDocument: string;
  legalStructure: string;
  image: string;
  summary: string;
  highlights: string[];
}

export interface DevelopmentMilestone {
  stage: string;
  date: string;
  completed: boolean;
  description: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  bedrooms: number;
  sqm: number;
  priceFrom: string;
  features: string[];
}

export interface DevelopmentProject {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  location: LocationArea;
  status: 'Pre-Launch' | 'Under Construction' | 'Ready to Move' | 'Sold Out';
  completionDate: string;
  startingPrice: number;
  totalUnits: number;
  availableUnits: number;
  yieldEstimate: string;
  heroImage: string;
  gallery: string[];
  overview: string;
  architecturalConcept: string;
  features: string[];
  milestones: DevelopmentMilestone[];
  floorPlans: FloorPlan[];
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  category: 'Advisory & Consulting' | 'Sales & Acquisition' | 'Wealth & Co-Ownership' | 'Asset Management';
  description: string;
  deliverables: string[];
  iconName: string;
  ctaText: string;
  whatsappMessage?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  propertyPurchased: string;
  avatar: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  credentials: string;
  image: string;
  linkedin?: string;
}

export interface EnquiryRecord {
  id: string;
  type: 'General' | 'Inspection' | 'Service' | 'Development' | 'Valuation';
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'New' | 'In Progress' | 'Closed';
  meta?: Record<string, string>;
}

export type HeroStyleMode = 'full-bleed' | 'split';

export interface LandingPageConfig {
  heroStyle?: HeroStyleMode;
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  announcementBanner: string;
  showAnnouncement: boolean;
  stats: {
    yearsExperience: string;
    totalVolume: string;
    verifiedAssets: string;
    diasporaSatisfaction: string;
  };
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactAddress: string;
}
