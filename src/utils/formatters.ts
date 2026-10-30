/**
 * Formatting helpers for Etosmania Global Properties Investment Limited
 */
import { CurrencyCode } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

export function formatNaira(amount: number, isRent: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₦0';
  }
  const formatted = amount.toLocaleString('en-NG', {
    maximumFractionDigits: 0,
  });
  return `₦${formatted}${isRent ? '/yr' : ''}`;
}

export function formatCompactNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₦0';
  }
  if (amount >= 1_000_000_000) {
    const val = (amount / 1_000_000_000).toFixed(amount % 1_000_000_000 === 0 ? 0 : 1);
    return `₦${val}B`;
  }
  if (amount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1);
    return `₦${val}M`;
  }
  if (amount >= 1_000) {
    const val = (amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 0);
    return `₦${val}K`;
  }
  return `₦${amount}`;
}

// Alias used across components
export const formatNairaCompact = formatCompactNaira;

export function formatPriceByCurrency(amountInNgn: number, currency: CurrencyCode = 'NGN'): string {
  if (currency === 'NGN') {
    return formatCompactNaira(amountInNgn);
  }
  const rateObj = CURRENCY_RATES[currency] || CURRENCY_RATES.NGN;
  const converted = Math.round(amountInNgn * rateObj.rate);
  return `${rateObj.symbol}${converted.toLocaleString('en-US')}`;
}

export function formatNumberWithCommas(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return num.toLocaleString('en-NG');
}

export function formatBeds(count: number): string {
  if (count === 0) return 'Studio';
  return `${count} ${count === 1 ? 'Bed' : 'Beds'}`;
}

export function formatBaths(count: number): string {
  return `${count} ${count === 1 ? 'Bath' : 'Baths'}`;
}

export function formatSqm(sqm: number): string {
  if (!sqm) return 'N/A';
  return `${sqm.toLocaleString('en-NG')} sqm`;
}
