const formatCurrency = (amount: number | undefined, currency= 'USD', locale = 'en-US') => {
  if (!amount) return 'N/A';
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

const formatNumber = (amount: number | undefined, locale = 'en-US') => {
  if (!amount) return 'N/A';
  try {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(amount);
} catch {
  return formatCurrency(amount)
}
};

export { formatCurrency, formatNumber };