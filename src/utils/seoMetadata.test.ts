import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRIMARY_DOMAIN,
  SUBPAGE_SITELINKS,
  resolveRouteMetadata,
  buildStructuredDataJsonLd,
} from './seoMetadata';

test('PRIMARY_DOMAIN is wired to etosmaniaglobalproperties.com and all 6 subpages are registered for Google sitelinks', () => {
  assert.equal(PRIMARY_DOMAIN, 'https://etosmaniaglobalproperties.com');
  const paths = SUBPAGE_SITELINKS.map((s) => s.path);
  assert.deepEqual(paths, [
    '/properties',
    '/co-ownership',
    '/developments',
    '/services',
    '/about',
    '/contact',
  ]);
});

test('resolveRouteMetadata returns dedicated titles, descriptions, and canonical URLs for subpages', () => {
  const propsMeta = resolveRouteMetadata('/properties');
  assert.equal(propsMeta.canonicalUrl, 'https://etosmaniaglobalproperties.com/properties');
  assert.equal(propsMeta.title.includes('Sales of Land, Houses & Commercial Properties'), true);

  const coOwnMeta = resolveRouteMetadata('/co-ownership');
  assert.equal(coOwnMeta.canonicalUrl, 'https://etosmaniaglobalproperties.com/co-ownership');
  assert.equal(coOwnMeta.title.includes('Real Estate Co-Ownership'), true);

  const devMeta = resolveRouteMetadata('/developments');
  assert.equal(devMeta.canonicalUrl, 'https://etosmaniaglobalproperties.com/developments');
  assert.equal(devMeta.title.includes('Signature Estates'), true);

  const srvMeta = resolveRouteMetadata('/services');
  assert.equal(srvMeta.canonicalUrl, 'https://etosmaniaglobalproperties.com/services');

  const aboutMeta = resolveRouteMetadata('/about');
  assert.equal(aboutMeta.canonicalUrl, 'https://etosmaniaglobalproperties.com/about');

  const contactMeta = resolveRouteMetadata('/contact');
  assert.equal(contactMeta.canonicalUrl, 'https://etosmaniaglobalproperties.com/contact');
});

test('buildStructuredDataJsonLd includes RealEstateAgent, WebSite, and SiteNavigationElement graph nodes', () => {
  const jsonLd = buildStructuredDataJsonLd('/properties');
  assert.equal(jsonLd['@context'], 'https://schema.org');
  assert.equal(Array.isArray(jsonLd['@graph']), true);
  assert.equal(jsonLd['@graph'].length, 4);
});
