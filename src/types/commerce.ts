import type { StoreId } from "./catalog";

export type SelectedOptions = Record<string, string>;

/** What the browser persists. Prices are never stored — they are always re-derived from the catalog. */
export interface CartLine {
  key: string;
  productId: string;
  options: SelectedOptions;
  quantity: number;
}

export type DiscountRule =
  | { code: string; type: "percent"; value: number; description: string; minSubtotal?: number; niche?: StoreId }
  | { code: string; type: "fixed"; value: number; description: string; minSubtotal?: number }
  | { code: string; type: "shipping"; description: string; minSubtotal?: number };

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  price: number;
  /** Subtotal (after discounts) at or above which this method is free. */
  freeOver?: number;
}

export type LineIssue = "unavailable" | "invalid-options" | "quantity-reduced";

export interface PricedLine {
  key: string;
  productId: string;
  slug: string;
  title: string;
  brand: string;
  niche: StoreId;
  image: string;
  imageAlt: string;
  options: { group: string; label: string }[];
  /** All money values are integer cents. */
  unitPrice: number;
  unitOriginalPrice?: number;
  quantity: number;
  available: number;
  lineTotal: number;
  issue?: LineIssue;
}

export interface CartTotals {
  lines: PricedLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  discountCode?: string;
  discountMessage?: string;
  shipping: number;
  shippingMethod: ShippingMethod;
  tax: number;
  total: number;
  /** Cents still needed for free standard shipping (0 when already free). */
  freeShippingRemaining: number;
}

export interface DemoOrder {
  reference: string;
  createdAt: string;
  firstName: string;
  city: string;
  paymentMethod: string;
  shippingMethod: string;
  lines: Pick<PricedLine, "title" | "brand" | "image" | "imageAlt" | "options" | "quantity" | "lineTotal" | "slug">[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  discountCode?: string;
}
