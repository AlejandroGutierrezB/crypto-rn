import { formatCurrency, formatNumber } from './formater';

describe('formatCurrency', () => {
  it('should format currency values correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1.2K');
    expect(formatCurrency(1000000)).toBe('$1M');
    expect(formatCurrency(1500)).toBe('$1.5K');
  });

  it('should handle different currencies', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€1.2K');
    expect(formatCurrency(1234.56, 'GBP')).toBe('£1.2K');
  });

  it('should handle undefined values', () => {
    expect(formatCurrency(undefined)).toBe('N/A');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should use default currency when invalid currency is provided', () => {
    expect(formatCurrency(1234.56, 'INVALID')).toBe('$1.2K');
    expect(formatCurrency(1234.56, 'LINK')).toBe('$1.2K');
  });
});

describe('formatNumber', () => {
  it('should format numbers correctly', () => {
    expect(formatNumber(1234.56)).toBe('1.23K');
    expect(formatNumber(1000000)).toBe('1M');
    expect(formatNumber(1500)).toBe('1.5K');
  });

  it('should handle undefined values', () => {
    expect(formatNumber(undefined)).toBe('N/A');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should respect maximum fraction digits', () => {
    expect(formatNumber(1234.5678)).toBe('1.23K');
  });
});
