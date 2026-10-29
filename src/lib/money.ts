import { siteConfig } from "@/config/site.config";

/** Converts a major-unit price (e.g. 12.5) to integer cents to avoid floating-point drift. */
export const toCents = (amount: number) => Math.round(amount * 100);

const formatters = new Map<string, Intl.NumberFormat>();

/** Formats integer cents, e.g. 12900 → "$129.00" (or "$129" when `compact` and whole). */
export function formatMoney(cents: number, { compact = false, currency = siteConfig.currency, locale = siteConfig.locale }: { compact?: boolean; currency?: string; locale?: string } = {}) {
  const whole = cents % 100 === 0;
  const key = `${locale}|${currency}|${compact && whole}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: compact && whole ? 0 : 2, maximumFractionDigits: 2 });
    formatters.set(key, f);
  }
  return f.format(cents / 100);
}

/** Formats a major-unit catalogue price. */
export const formatPrice = (amount: number, compact = true) => formatMoney(toCents(amount), { compact });

export const discountPercent = (price: number, originalPrice?: number) =>
  originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
