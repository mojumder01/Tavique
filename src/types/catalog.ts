export const STORE_IDS = ["fashion", "electronics", "beauty"] as const;
export type StoreId = (typeof STORE_IDS)[number];

export interface ProductImage {
  src: string;
  alt: string;
}

export interface VariantOption {
  /** Stable value stored in the cart, e.g. "camel". */
  value: string;
  label: string;
  /** Hex colour for swatch-style groups. */
  swatch?: string;
  /** Added to the product's base price (and original price) when selected. */
  priceDelta?: number;
  /** Demo stock for this option. Falls back to the product's stock when omitted. */
  stock?: number;
  /** Image shown when this option is selected (must also appear in `images`). */
  image?: string;
}

export interface VariantGroup {
  /** e.g. "color", "size", "storage", "shade", "volume" */
  id: string;
  name: string;
  display: "swatch" | "pill";
  options: VariantOption[];
}

export type ProductBadge = "new" | "bestseller" | "limited" | "eco" | "exclusive";

export interface Specification {
  label: string;
  value: string;
}

export interface SpecGroup {
  title: string;
  items: Specification[];
}

export interface FashionDetails {
  fit: string;
  material: string;
  care: string[];
  sizeGuide?: "apparel" | "footwear";
  origin?: string;
}

export interface ElectronicsDetails {
  warranty: string;
  inTheBox: string[];
  /** Short spec highlights shown on product cards. */
  keySpecs: string[];
}

export interface BeautyDetails {
  ingredients: string;
  keyIngredients: { name: string; benefit: string }[];
  howToUse: string[];
  suitableFor: string[];
  claims?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  /** ISO date */
  date: string;
  verified: boolean;
  /** Context such as "Size bought: M" or "Combination skin". */
  meta?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  niche: StoreId;
  /** Category slugs. The first one is the primary category used for breadcrumbs. */
  categories: string[];
  brand: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  /** Demo stock level used to cap quantities. */
  stock: number;
  badges?: ProductBadge[];
  variants?: VariantGroup[];
  highlights?: string[];
  specifications?: SpecGroup[];
  /** Extra filterable facets, e.g. { material: ["Wool"], skinType: ["Dry"] } */
  attributes?: Record<string, string[]>;
  /** Extra search terms. */
  tags?: string[];
  featured?: boolean;
  /** ISO date the product was added — drives "Newest" sorting. */
  createdAt: string;
  fashion?: FashionDetails;
  electronics?: ElectronicsDetails;
  beauty?: BeautyDetails;
  reviews?: Review[];
}

/** The lightweight product shape shared with client components (search, cart, cards). */
export interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  brand: string;
  niche: StoreId;
  categories: string[];
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  stock: number;
  badges: ProductBadge[];
  variants: VariantGroup[];
  attributes: Record<string, string[]>;
  tags: string[];
  featured: boolean;
  createdAt: string;
  keySpecs: string[];
}

export type CollectionRule =
  | { type: "all" }
  | { type: "newest"; limit: number }
  | { type: "sale" }
  | { type: "badge"; badge: ProductBadge };

export interface Category {
  slug: string;
  niche: StoreId;
  name: string;
  description: string;
  image: string;
  /** Virtual collections select products by rule instead of membership. */
  rule?: CollectionRule;
}
