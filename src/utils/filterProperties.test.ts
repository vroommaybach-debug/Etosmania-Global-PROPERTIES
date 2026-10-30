import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProperties, FilterState } from './filterProperties.ts';
import { PROPERTIES_DATA } from '../data/mockData.ts';

const defaultFilter: FilterState = {
  category: 'all',
  location: 'all',
  type: 'all',
  bedrooms: 'all',
  minPrice: 0,
  maxPrice: 0,
  sortBy: 'newest',
  searchQuery: '',
};

test('filters by category (land only)', () => {
  const result = filterProperties(PROPERTIES_DATA, { ...defaultFilter, category: 'land' });
  assert.ok(result.length >= 2);
  assert.ok(result.every((p) => p.type === 'Land'));
});

test('filters by location (Ikoyi only)', () => {
  const result = filterProperties(PROPERTIES_DATA, { ...defaultFilter, location: 'Ikoyi' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'EGP-105');
});

test('filters by minimum 5 bedrooms', () => {
  const result = filterProperties(PROPERTIES_DATA, { ...defaultFilter, bedrooms: 5 });
  assert.ok(result.length >= 2);
  assert.ok(result.every((p) => p.bedrooms >= 5));
});

test('sorts by price ascending and descending', () => {
  const asc = filterProperties(PROPERTIES_DATA, { ...defaultFilter, sortBy: 'price-asc' });
  assert.ok(asc[0].price <= asc[asc.length - 1].price);

  const desc = filterProperties(PROPERTIES_DATA, { ...defaultFilter, sortBy: 'price-desc' });
  assert.ok(desc[0].price >= desc[desc.length - 1].price);
});
