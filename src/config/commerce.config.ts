import type { DiscountRule, ShippingMethod } from "@/types/commerce";

/**
 * Demo commerce rules. Totals are recalculated from the product catalogue on every render,
 * so editing prices in the browser has no effect. A production store must repeat these
 * calculations on a trusted server (or in its commerce platform) before taking payment.
 */
export const commerceConfig = {
  /** Shown as an estimate only. Real tax depends on the destination and must be calculated server-side. */
  taxRate: 0.08,
  taxLabel: "Estimated tax",
  /** Upper bound for a single cart line, regardless of stock. */
  maxQuantityPerLine: 10,
  shippingMethods: [
    { id: "standard", label: "Standard", description: "3–5 business days", price: 8, freeOver: 150 },
    { id: "express", label: "Express", description: "1–2 business days", price: 18 },
    { id: "next-day", label: "Next day", description: "Order by 2pm for next-day delivery", price: 28 },
  ] satisfies ShippingMethod[],
  /** Sample codes for the demo — documented in docs/FEATURES.md. */
  discountCodes: [
    { code: "WELCOME10", type: "percent", value: 10, description: "10% off your order" },
    { code: "TAVIQUE25", type: "fixed", value: 25, minSubtotal: 150, description: "$25 off orders of $150 or more" },
    { code: "FREESHIP", type: "shipping", minSubtotal: 50, description: "Free standard shipping on orders of $50 or more" },
    { code: "GLOW15", type: "percent", value: 15, niche: "beauty", description: "15% off beauty products" },
  ] satisfies DiscountRule[],
  paymentMethods: [
    { id: "card", label: "Credit or debit card", description: "Demo only — no card details are collected. Connect Stripe, Adyen or similar for real payments." },
    { id: "paypal", label: "PayPal", description: "Demo only — you will not be redirected." },
    { id: "cod", label: "Cash on delivery", description: "Pay the courier when your order arrives." },
  ],
  countries: ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Netherlands", "Bangladesh"],
} as const;
