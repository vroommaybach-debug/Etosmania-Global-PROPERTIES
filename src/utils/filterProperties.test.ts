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

test('filters by Lagos corridors: Egbeda, Akowonjo, and Agbara', () => {
  const egbeda = filterProperties(PROPERTIES_DATA, { ...defaultFilter, location: 'Egbeda' });
  assert.equal(egbeda.length, 1);
  assert.equal(egbeda[0].id, 'EGP-109');

  const akowonjo = filterProperties(PROPERTIES_DATA, { ...defaultFilter, location: 'Akowonjo' });
  assert.equal(akowonjo.length, 1);
  assert.equal(akowonjo[0].id, 'EGP-110');

  const agbara = filterProperties(PROPERTIES_DATA, { ...defaultFilter, location: 'Agbara' });
  assert.equal(agbara.length, 1);
  assert.equal(agbara[0].id, 'EGP-111');
});

test('filters by minimum 5 bedrooms', () => {
  const result = filterProperties(PROPERTIES_DATA, { ...defaultFilter, bedrooms: 5 });
  assert.ok(result.length >= 1);
  assert.ok(result.every((p) => p.bedrooms >= 5));
});

test('sorts by price ascending and descending', () => {
  const asc = filterProperties(PROPERTIES_DATA, { ...defaultFilter, sortBy: 'price-asc' });
  assert.ok(asc[0].price <= asc[asc.length - 1].price);

  const desc = filterProperties(PROPERTIES_DATA, { ...defaultFilter, sortBy: 'price-desc' });
  assert.ok(desc[0].price >= desc[desc.length - 1].price);
});
