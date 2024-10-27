export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_CURRENCY = 'USD';

export const formatCurrency = (amount: number | undefined, currency= DEFAULT_CURRENCY, locale = DEFAULT_LOCALE): string => {
  if (amount === undefined) return 'N/A';
  try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
    notation: 'compact',
    currency: currency
  }).format(amount);
} catch {
  return formatCurrency(amount)
}
};

export const formatNumber = (amount: number | undefined, locale = DEFAULT_LOCALE): string => {
  if (amount === undefined) return 'N/A';
  try {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return formatCurrency(amount)
  }
};
