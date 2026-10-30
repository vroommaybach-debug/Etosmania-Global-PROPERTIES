import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  resolveRouteMetadata,
  buildStructuredDataJsonLd,
  PRIMARY_DOMAIN,
  PageSEOConfig,
} from '../../utils/seoMetadata';
import { formatNairaCompact } from '../../utils/formatters';

function upsertMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  let el = document.head.querySelector(
    `meta[${attrName}="${attrValue}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLinkTag(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

interface SEOHeadProps {
  config?: PageSEOConfig;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ config }) => {
  const { pathname } = useLocation();
  const { properties, developments } = useData();

  useEffect(() => {
    const baseMeta = resolveRouteMetadata(pathname);
    let title = config?.title || baseMeta.title;
    let description = config?.description || baseMeta.description;
    let ogImage = config?.ogImage || baseMeta.ogImage;

    if (!config && pathname.startsWith('/properties/')) {
      const propId = pathname.replace('/properties/', '').trim();
      const prop = properties.find(
        (p) => p.id.toLowerCase() === propId.toLowerCase() || p.slug === propId
      );
      if (prop) {
        title = `${prop.title} in ${prop.area} (${formatNairaCompact(
          prop.price
        )}) | Etosmania Global Properties`;
        description = `${prop.bedrooms > 0 ? `${prop.bedrooms} Bed ` : ''}${
          prop.title
        } at ${prop.location}. ${prop.sqm} sqm. Listed at ${formatNairaCompact(
          prop.price
        )} by Etosmania Global Properties Investment Limited.`;
        if (prop.images?.[0] && !prop.images[0].startsWith('data:')) {
          ogImage = prop.images[0];
        }
      }
    }

    if (!config && pathname.startsWith('/developments/')) {
      const devId = pathname.replace('/developments/', '').trim();
      const dev = developments.find(
        (d) => d.id.toLowerCase() === devId.toLowerCase()
      );
      if (dev) {
        title = `${dev.name} (${dev.location}) – From ${dev.startingPrice} | Etosmania Global Properties`;
        description = `${dev.name} in ${dev.location}, Lagos (${dev.status}). ${dev.tagline}.`;
        if (dev.heroImage && !dev.heroImage.startsWith('data:')) {
          ogImage = dev.heroImage;
        }
      }
    }

    document.title = title;

    upsertMetaTag('name', 'description', description);
    upsertMetaTag('name', 'keywords', config?.keywords || baseMeta.keywords);
    upsertMetaTag('name', 'author', 'Etosmania Global Properties Investment Limited');
    upsertMetaTag('property', 'og:title', title);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:type', config?.ogType || baseMeta.ogType);
    upsertMetaTag('property', 'og:url', baseMeta.canonicalUrl);
    upsertMetaTag('property', 'og:image', ogImage);
    upsertMetaTag('property', 'og:site_name', 'Etosmania Global Properties');
    upsertMetaTag('property', 'og:locale', 'en_NG');
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', title);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('name', 'twitter:image', ogImage);
    upsertMetaTag('name', 'application-name', 'Etosmania Global Properties');
    upsertMetaTag('name', 'apple-mobile-web-app-title', 'Etosmania Properties');
    upsertMetaTag('name', 'theme-color', '#07142B');

    upsertLinkTag('canonical', baseMeta.canonicalUrl);

    const jsonLd = buildStructuredDataJsonLd(pathname);
    let scriptEl = document.getElementById('etosmania-jsonld') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'etosmania-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify({
      ...jsonLd,
      url: PRIMARY_DOMAIN,
    });
  }, [pathname, properties, developments, config]);

  return null;
};
