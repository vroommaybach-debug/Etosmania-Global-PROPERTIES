import { Property, DevelopmentProject } from '../types';

export const PRIMARY_DOMAIN = 'https://etosmaniaglobalproperties.com';
export const SITE_URL = PRIMARY_DOMAIN;
export const SITE_NAME = 'Etosmania Global Properties Investment Limited';
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85';

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage: string;
  keywords: string;
  breadcrumbName: string;
}

export interface PageSEOConfig {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string;
  breadcrumbs: { name: string; path: string }[];
  jsonLd?: Record<string, unknown>[];
}

export const SUBPAGE_SITELINKS = [
  {
    name: 'Land, Residential & Commercial Properties',
    path: '/properties',
    url: `${PRIMARY_DOMAIN}/properties`,
    description:
      'Browse verified land plots, luxury residential duplexes, detached houses, and commercial properties in Ajah, Lekki, Egbeda, Akowonjo, Agbara, and Ibeju-Lekki.',
  },
  {
    name: 'Real Estate Co-Ownership & Wealth Hub',
    path: '/co-ownership',
    url: `${PRIMARY_DOMAIN}/co-ownership`,
    description:
      'Co-own high-yield residential and commercial properties in Lagos with structured fractional slots, legal deeds, and annual rental dividends.',
  },
  {
    name: 'Signature Estates & Developments',
    path: '/developments',
    url: `${PRIMARY_DOMAIN}/developments`,
    description:
      'Explore sustainable community-centered residential and commercial developments across Ajah, Lekki, Egbeda, Akowonjo, and Agbara.',
  },
  {
    name: 'Our 8 Core Real Estate Services',
    path: '/services',
    url: `${PRIMARY_DOMAIN}/services`,
    description:
      'Real Estate Consultancy, Real Estate Investment, Sales of Land and Houses, Co-ownership, Residential Sales, Commercial Properties, Property Management, and Investment Consulting.',
  },
  {
    name: 'About Etosmania Global Properties',
    path: '/about',
    url: `${PRIMARY_DOMAIN}/about`,
    description:
      'Learn about Etosmania Global Properties Investment Limited, our Mission, Vision, and Core Values (Integrity, Professionalism, Customer Service, Continuous Learning) at 10B Thomas Estate, Ajah.',
  },
  {
    name: 'Contact & WhatsApp Concierge',
    path: '/contact',
    url: `${PRIMARY_DOMAIN}/contact`,
    description:
      'Visit Etosmania Global Properties at 10B Thomas Estate, Ajah, Lekki, Lagos State or connect via our instant WhatsApp Concierge.',
  },
];

export function resolveRouteMetadata(pathname: string): RouteMetadata {
  const cleanPath = (pathname || '/').split('?')[0].replace(/\/+$/, '') || '/';
  const canonicalUrl = `${PRIMARY_DOMAIN}${cleanPath === '/' ? '' : cleanPath}`;

  if (cleanPath === '/properties') {
    return {
      title: 'Sales of Land, Houses & Commercial Properties in Lagos | Etosmania Global Properties',
      description:
        'Explore verified dry land plots, luxury residential houses, and commercial properties in Ajah, Lekki, Egbeda, Akowonjo, Agbara, Victoria Island, Ikoyi, and Ibeju-Lekki.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      keywords:
        'Sales of Land and Houses Lagos, Thomas Estate Ajah properties, Egbeda properties, Akowonjo properties, Agbara land, Lekki duplexes for sale, Etosmania Global Properties',
      breadcrumbName: 'Properties & Land',
    };
  }

  if (cleanPath.startsWith('/properties/')) {
    const refId = cleanPath.replace('/properties/', '').toUpperCase();
    return {
      title: `Property Mandate ${refId} | Real Estate Gold Lagos | Etosmania Global Properties`,
      description: `View full specifications, title verification status, Naira pricing, and inspection scheduling for Lagos property listing ${refId} by Etosmania Global Properties Investment Limited.`,
      canonicalUrl,
      ogType: 'article',
      ogImage: DEFAULT_OG_IMAGE,
      keywords: `Lagos property ${refId}, Etosmania Global Properties listing, verified land and houses Lagos`,
      breadcrumbName: `Property ${refId}`,
    };
  }

  if (cleanPath === '/co-ownership') {
    return {
      title: 'Real Estate Co-Ownership & Fractional Investment in Lagos | Etosmania Global Properties',
      description:
        'Build wealth through verified Real Estate Co-ownership in Lagos. Co-own prime residential duplexes, short-let apartments, and commercial land in Ajah, Lekki, Akowonjo & Egbeda.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      keywords:
        'Real Estate Co-ownership Lagos, fractional property investment Nigeria, Etosmania Global Properties co-ownership, real estate investment consulting',
      breadcrumbName: 'Co-Ownership Hub',
    };
  }

  if (cleanPath === '/developments') {
    return {
      title: 'Signature Estates & Community-Centered Developments | Etosmania Global Properties',
      description:
        'Invest in sustainable community-centered residential and commercial developments across Ajah, Lekki, Egbeda, Akowonjo, Agbara, and Ibeju-Lekki with flexible payment plans.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      keywords:
        'Off-plan developments Lagos, Thomas Estate Ajah developments, Egbeda Akowonjo Agbara estates, Etosmania Global Properties developments',
      breadcrumbName: 'Developments',
    };
  }

  if (cleanPath.startsWith('/developments/')) {
    const devId = cleanPath.replace('/developments/', '').toUpperCase();
    return {
      title: `Development Project ${devId} | Sustainable Lagos Estates | Etosmania Global Properties`,
      description: `Explore unit configurations, milestone payment schedules, and investment projections for development ${devId} by Etosmania Global Properties Investment Limited.`,
      canonicalUrl,
      ogType: 'article',
      ogImage: DEFAULT_OG_IMAGE,
      keywords: `Lagos development ${devId}, off-plan investment Lagos, Etosmania Global Properties`,
      breadcrumbName: `Development ${devId}`,
    };
  }

  if (cleanPath === '/services') {
    return {
      title: 'Real Estate Consultancy, Investment, Co-Ownership & Management | Etosmania Global Properties',
      description:
        'Our 8 Core Services: Real Estate Consultancy, Real Estate Investment, Sales of Land and Houses, Real Estate Co-ownership, Residential Sales, Commercial Properties, Property Management, and Investment Consulting.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      keywords:
        'Real Estate Consultancy Lagos, Real Estate Investment Nigeria, Property Management Ajah Lekki Egbeda Akowonjo, Investment Consulting Lagos',
      breadcrumbName: 'Our 8 Services',
    };
  }

  if (cleanPath === '/about') {
    return {
      title: 'About Etosmania Global Properties Investment Limited | Mission, Vision & Core Values',
      description:
        'Headquartered at 10B Thomas Estate, Ajah, Lekki, Lagos State. Driven by Integrity, Professionalism, Customer Service, and Continuous Learning to deliver Real Estate Gold.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      keywords:
        'About Etosmania Global Properties Investment Limited, 10B Thomas Estate Ajah Lekki, trusted real estate developer Nigeria',
      breadcrumbName: 'About Us',
    };
  }

  if (cleanPath === '/contact') {
    return {
      title: 'Contact Etosmania Global Properties | 10B Thomas Estate, Ajah, Lekki, Lagos',
      description:
        'Visit Etosmania Global Properties Investment Limited at 10B Thomas Estate, Ajah, Lekki, Lagos State. Email etosmaniaproperties@gmail.com or connect via our WhatsApp Concierge.',
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      keywords:
        'Contact Etosmania Global Properties, 10B Thomas Estate Ajah Lekki Lagos, etosmaniaproperties@gmail.com',
      breadcrumbName: 'Contact Advisory',
    };
  }

  if (cleanPath.startsWith('/admin')) {
    return {
      title: 'Executive Operations Portal | Etosmania Global Properties',
      description: 'Restricted operations management portal for Etosmania Global Properties Investment Limited.',
      canonicalUrl: `${PRIMARY_DOMAIN}/admin`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      keywords: 'Etosmania Global Properties operations',
      breadcrumbName: 'Operations',
    };
  }

  return {
    title: 'Etosmania Global Properties - Premier Lagos Real Estate & Developments',
    description:
      'Etosmania Global Properties Investment Limited (Real Estate Gold) at 10B Thomas Estate, Ajah, Lekki, Lagos. Serving Ajah, Lekki, Egbeda, Akowonjo, Agbara, and greater Lagos.',
    canonicalUrl: PRIMARY_DOMAIN,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    keywords:
      'Etosmania Global Properties, Real Estate Gold, 10B Thomas Estate Ajah Lekki, Egbeda, Akowonjo, Agbara, Sales of Land and Houses, Real Estate Co-ownership',
    breadcrumbName: 'Home',
  };
}

export function buildStructuredDataJsonLd(pathname: string) {
  const meta = resolveRouteMetadata(pathname);
  const cleanPath = (pathname || '/').split('?')[0].replace(/\/+$/, '') || '/';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        '@id': `${PRIMARY_DOMAIN}/#organization`,
        name: 'Etosmania Global Properties',
        legalName: 'Etosmania Global Properties Investment Limited',
        slogan: 'Real Estate Gold You Are Looking For',
        url: PRIMARY_DOMAIN,
        logo: `${PRIMARY_DOMAIN}/favicon.svg`,
        image: meta.ogImage,
        description:
          'World-class residential and commercial real estate developer and investment consultancy in Lagos, Nigeria specializing in Sales of Land and Houses, Real Estate Co-ownership, Property Management, and Investment Consulting.',
        telephone: '+234-913-845-3949',
        email: 'etosmaniaproperties@gmail.com',
        priceRange: '₦₦₦₦',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '10B Thomas Estate, Ajah, Lekki',
          addressLocality: 'Lekki',
          addressRegion: 'Lagos State',
          postalCode: '106104',
          addressCountry: 'NG',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 6.4698,
          longitude: 3.5852,
        },
        areaServed: [
          { '@type': 'City', name: 'Ajah & Thomas Estate, Lekki, Lagos' },
          { '@type': 'City', name: 'Lekki Phase 1, Lagos' },
          { '@type': 'City', name: 'Egbeda, Lagos' },
          { '@type': 'City', name: 'Akowonjo, Lagos' },
          { '@type': 'City', name: 'Agbara, Lagos Corridor' },
          { '@type': 'City', name: 'Victoria Island, Lagos' },
          { '@type': 'City', name: 'Ikoyi, Lagos' },
          { '@type': 'City', name: 'Ibeju-Lekki, Lagos' },
          { '@type': 'City', name: 'Ikeja GRA, Lagos' },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${PRIMARY_DOMAIN}/#website`,
        url: PRIMARY_DOMAIN,
        name: 'Etosmania Global Properties Investment Limited',
        publisher: {
          '@id': `${PRIMARY_DOMAIN}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${PRIMARY_DOMAIN}/properties?location={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${PRIMARY_DOMAIN}/#sitelinks`,
        name: 'Etosmania Global Properties Main Navigation & Sitelinks',
        itemListElement: SUBPAGE_SITELINKS.map((item, idx) => ({
          '@type': 'SiteNavigationElement',
          position: idx + 1,
          name: item.name,
          description: item.description,
          url: item.url,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${meta.canonicalUrl}#breadcrumb`,
        itemListElement:
          cleanPath === '/'
            ? [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: PRIMARY_DOMAIN,
                },
              ]
            : [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: PRIMARY_DOMAIN,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: meta.breadcrumbName,
                  item: meta.canonicalUrl,
                },
              ],
      },
    ],
  };
}

export function buildPropertyDetailSEO(property: Property): PageSEOConfig {
  const canonicalPath = `/properties/${property.id}`;
  const image = property.images?.[0] || DEFAULT_OG_IMAGE;

  return {
    title: `${property.title} (${property.priceFormatted}) | Etosmania Global Properties`,
    description: `${property.title} in ${property.location}. ${property.priceFormatted} • ${property.sqm} sqm • ${property.type}. Verified title by Etosmania Global Properties Investment Limited.`,
    canonicalPath,
    ogType: 'article',
    ogImage: image,
    keywords: `${property.title}, ${property.area} real estate, ${property.type} in Lagos, Etosmania Global Properties`,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Land & Properties', path: '/properties' },
      { name: property.title, path: canonicalPath },
    ],
  };
}

export function buildDevelopmentDetailSEO(project: DevelopmentProject): PageSEOConfig {
  const canonicalPath = `/developments/${project.id}`;

  return {
    title: `${project.name} — ${project.location} | Etosmania Global Properties`,
    description: `${project.name}: ${project.tagline}. Starting at ${project.startingPrice} in ${project.location}. Completion: ${project.completionDate}.`,
    canonicalPath,
    ogType: 'article',
    ogImage: project.heroImage || DEFAULT_OG_IMAGE,
    keywords: `${project.name}, ${project.location}, Etosmania Global Properties estates, Real Estate Gold Lagos`,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Developments', path: '/developments' },
      { name: project.name, path: canonicalPath },
    ],
  };
}
