/**
 * Format a number as currency
 * @param amount The amount to format
 * @returns Formatted string with dollar sign and 2 decimal places
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
