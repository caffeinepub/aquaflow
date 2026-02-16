/**
 * Format a number as AED currency
 * @param amount - The amount to format
 * @returns Formatted string with AED prefix
 */
export function formatAED(amount: number): string {
  return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/**
 * Format a rate per bottle in AED
 * @param rate - The rate per bottle
 * @returns Formatted string like "@ AED 50/bottle"
 */
export function formatAEDRate(rate: number): string {
  return `@ ${formatAED(rate)}/bottle`;
}
