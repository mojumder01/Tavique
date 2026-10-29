import type { StoreId } from "./catalog";

export type FontKey = "bodoni" | "jost" | "geist" | "geistMono" | "newsreader" | "figtree";

export interface NavLink {
  label: string;
  href: string;
}

export interface MegaMenu {
  columns: { title: string; links: NavLink[] }[];
  feature?: { title: string; caption: string; image: string; href: string };
}

export interface NavItem extends NavLink {
  mega?: MegaMenu;
}

/** Colour tokens. Every value is any valid CSS colour. */
export interface Palette {
  background: string;
  surface: string;
  muted: string;
  foreground: string;
  foregroundMuted: string;
  border: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  sale: string;
  success: string;
  announcementBackground: string;
  announcementForeground: string;
}

export interface StoreTheme {
  light: Palette;
  /** Provide only when a dark theme suits the storefront. Enables the theme toggle. */
  dark?: Palette;
  fonts: { display: FontKey; body: FontKey; mono?: FontKey };
  radius: { card: string; button: string; input: string };
  button: { textTransform: "uppercase" | "none"; letterSpacing: string; fontWeight: number };
  heading: { fontWeight: number; letterSpacing: string; textTransform?: "uppercase" | "none" };
}

export type FilterKey = "category" | "price" | "brand" | "rating" | "availability" | `option:${string}` | `attr:${string}`;

export interface Testimonial {
  quote: string;
  author: string;
  meta: string;
  rating: number;
  /** Optional product slug the review refers to. */
  product?: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  cta: NavLink;
  secondaryCta?: NavLink;
}

export interface FashionHome {
  sections: ("hero" | "categories" | "newArrivals" | "marquee" | "bestSellers" | "featuredCollection" | "story" | "campaign" | "reviews" | "newsletter")[];
  hero: HeroContent & { highlights: { title: string; body: string; image: string; imageAlt: string }[] };
  categoryTiles: string[];
  marquee: string[];
  featuredCollection: { eyebrow: string; title: string; body: string; image: string; imageAlt: string; products: string[]; cta: NavLink };
  story: { eyebrow: string; title: string; body: string[]; image: string; imageAlt: string; stats: { value: string; label: string }[]; cta: NavLink };
  campaign: { eyebrow: string; title: string; body: string; image: string; imageAlt: string; cta: NavLink };
  testimonials: Testimonial[];
}

export interface ElectronicsHome {
  sections: ("hero" | "trust" | "categories" | "bestSellers" | "deals" | "newReleases" | "brands" | "compare" | "reviews" | "newsletter")[];
  hero: HeroContent & { spotlight: string; popularSearches: string[] };
  trust: { title: string; body: string; icon: "truck" | "shield" | "rotate" | "lock" }[];
  deals: { title: string; body: string; products: string[] };
  brands: { name: string; tagline: string; href: string }[];
  compare: { eyebrow: string; title: string; body: string; image: string; imageAlt: string; products: string[]; rows: { label: string; key: string }[] };
  promo: { eyebrow: string; title: string; body: string; image: string; imageAlt: string; cta: NavLink };
  testimonials: Testimonial[];
}

export interface BeautyHome {
  sections: ("hero" | "concerns" | "bestSellers" | "newArrivals" | "routine" | "spotlight" | "reviews" | "journal" | "newsletter")[];
  hero: HeroContent;
  concerns: { label: string; image: string; href: string }[];
  newArrivals: { title: string; body: string; image: string; imageAlt: string; products: string[]; cta: NavLink };
  routine: { title: string; body: string; image: string; imageAlt: string; steps: { step: string; product: string; note: string }[] };
  spotlight: { eyebrow: string; title: string; body: string; image: string; imageAlt: string; ingredients: { name: string; note: string }[]; cta: NavLink };
  journal: { id: string; title: string; excerpt: string; body: string[]; image: string; imageAlt: string; readTime: string }[];
  testimonials: Testimonial[];
}

interface HomeContentMap {
  fashion: FashionHome;
  electronics: ElectronicsHome;
  beauty: BeautyHome;
}

export interface StoreConfig<T extends StoreId = StoreId> {
  id: T;
  name: string;
  /** Shown in the storefront switcher. */
  label: string;
  tagline: string;
  description: string;
  logo: { wordmark: string; suffix?: string; style: "serif-caps" | "sans" | "serif" };
  theme: StoreTheme;
  header: { layout: "classic" | "search" | "centered"; sticky: boolean };
  announcements: { text: string; href?: string; linkLabel?: string }[];
  nav: NavItem[];
  footer: { blurb: string; columns: { title: string; links: NavLink[] }[] };
  /** Category slugs belonging to this storefront, in display order. */
  categories: string[];
  /** Filters offered on listing pages, in display order. */
  filters: FilterKey[];
  /** Human labels for `attr:` / `option:` facets. */
  facetLabels: Record<string, string>;
  productCard: { aspect: "3/4" | "4/5" | "1/1"; style: "editorial" | "tech" | "beauty" };
  search: { placeholder: string; popular: string[] };
  newsletter: { title: string; body: string };
  bestSellers: string[];
  home: HomeContentMap[T];
}
