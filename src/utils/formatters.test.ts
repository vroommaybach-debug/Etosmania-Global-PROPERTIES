import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNaira, formatCompactNaira, formatBeds, formatBaths, formatSqm } from './formatters.ts';

test('formatNaira formats for sales with symbol and commas', () => {
  assert.equal(formatNaira(85000000), '₦85,000,000');
  assert.equal(formatNaira(1200000), '₦1,200,000');
});

test('formatNaira appends /yr for rentals', () => {
  assert.equal(formatNaira(4500000, true), '₦4,500,000/yr');
});

test('formatCompactNaira formats millions and billions', () => {
  assert.equal(formatCompactNaira(85000000), '₦85M');
  assert.equal(formatCompactNaira(1200000000), '₦1.2B');
  assert.equal(formatCompactNaira(500000), '₦500K');
});

test('formatBeds and formatBaths handle plurals and studio', () => {
  assert.equal(formatBeds(0), 'Studio');
  assert.equal(formatBeds(1), '1 Bed');
  assert.equal(formatBeds(4), '4 Beds');
  assert.equal(formatBaths(1), '1 Bath');
  assert.equal(formatBaths(3), '3 Baths');
});

test('formatSqm returns formatted square meters', () => {
  assert.equal(formatSqm(450), '450 sqm');
  assert.equal(formatSqm(1250), '1,250 sqm');
});
