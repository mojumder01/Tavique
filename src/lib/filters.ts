import type { ProductSummary } from "@/types/catalog";
import type { FilterKey } from "@/types/store";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export interface FilterState {
  categories: string[];
  brands: string[];
  price: { min?: number; max?: number };
  rating?: number;
  inStock: boolean;
  /** Variant option facets keyed by group id, e.g. { color: ["camel"] } */
  options: Record<string, string[]>;
  /** Attribute facets keyed by attribute name, e.g. { material: ["Wool"] } */
  attrs: Record<string, string[]>;
  sort: SortKey;
}

export const emptyFilters = (): FilterState => ({ categories: [], brands: [], price: {}, inStock: false, options: {}, attrs: {}, sort: "featured" });

const list = (v: string | null) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
const isSort = (v: string | null): v is SortKey => SORT_OPTIONS.some((o) => o.value === v);
const facetParam = (key: FilterKey) => key.split(":")[1] ?? key;

/** Reads filter state from URL search params, using the storefront's configured facets. */
export function parseFilters(params: URLSearchParams, facets: readonly FilterKey[]): FilterState {
  const state = emptyFilters();
  state.categories = list(params.get("category"));
  state.brands = list(params.get("brand"));
  const [min, max] = (params.get("price") ?? "").split("-");
  const minN = Number(min);
  const maxN = Number(max);
  if (min && Number.isFinite(minN)) state.price.min = minN;
  if (max && Number.isFinite(maxN)) state.price.max = maxN;
  const rating = Number(params.get("rating"));
  if (rating >= 1 && rating <= 5) state.rating = rating;
  state.inStock = params.get("stock") === "in";
  const sort = params.get("sort");
  if (isSort(sort)) state.sort = sort;
  for (const key of facets) {
    const name = facetParam(key);
    if (key.startsWith("option:")) {
      const values = list(params.get(name));
      if (values.length) state.options[name] = values;
    } else if (key.startsWith("attr:")) {
      const values = list(params.get(name));
      if (values.length) state.attrs[name] = values;
    }
  }
  return state;
}

/** Writes filter state back to search params, preserving unrelated params such as `q`. */
export function serializeFilters(state: FilterState, base?: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams(base);
  for (const k of ["category", "brand", "price", "rating", "stock", "sort", "page", ...Object.keys(state.options), ...Object.keys(state.attrs)]) params.delete(k);
  const set = (k: string, v: string[]) => v.length && params.set(k, v.join(","));
  set("category", state.categories);
  set("brand", state.brands);
  if (state.price.min != null || state.price.max != null) params.set("price", `${state.price.min ?? ""}-${state.price.max ?? ""}`);
  if (state.rating) params.set("rating", String(state.rating));
  if (state.inStock) params.set("stock", "in");
  for (const [k, v] of Object.entries(state.options)) set(k, v);
  for (const [k, v] of Object.entries(state.attrs)) set(k, v);
  if (state.sort !== "featured") params.set("sort", state.sort);
  return params;
}

/** Removes facet params that aren't configured for this storefront (keeps the URL honest). */
export function clearFacetParams(params: URLSearchParams, facets: readonly FilterKey[]) {
  const next = new URLSearchParams(params);
  for (const key of facets) next.delete(facetParam(key));
  return next;
}

const optionValues = (p: ProductSummary, group: string) => p.variants.find((g) => g.id === group)?.options.map((o) => o.value) ?? [];
const intersects = (a: string[], b: string[]) => a.some((x) => b.includes(x));

type Exclude = "category" | "brand" | "price" | "rating" | "stock" | `option:${string}` | `attr:${string}` | null;

/** Applies every active filter except `skip` (used to compute facet counts). */
function matches(p: ProductSummary, s: FilterState, skip: Exclude = null) {
  if (skip !== "category" && s.categories.length && !intersects(p.categories, s.categories)) return false;
  if (skip !== "brand" && s.brands.length && !s.brands.includes(p.brand)) return false;
  if (skip !== "price" && s.price.min != null && p.price < s.price.min) return false;
  if (skip !== "price" && s.price.max != null && p.price > s.price.max) return false;
  if (skip !== "rating" && s.rating && p.rating < s.rating) return false;
  if (skip !== "stock" && s.inStock && p.stock <= 0) return false;
  for (const [group, values] of Object.entries(s.options)) {
    if (skip === `option:${group}` || !values.length) continue;
    if (!intersects(optionValues(p, group), values)) return false;
  }
  for (const [attr, values] of Object.entries(s.attrs)) {
    if (skip === `attr:${attr}` || !values.length) continue;
    if (!intersects(p.attributes[attr] ?? [], values)) return false;
  }
  return true;
}

export function sortProducts(items: ProductSummary[], sort: SortKey): ProductSummary[] {
  const out = [...items];
  const popularity = (p: ProductSummary) => (p.featured ? 2 : 0) + (p.badges.includes("bestseller") ? 1 : 0) + (p.rating * Math.log10(p.reviewCount + 1)) / 10;
  switch (sort) {
    case "newest":
      return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "rating":
      return out.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    default:
      return out.sort((a, b) => popularity(b) - popularity(a));
  }
}

export const applyFilters = (items: ProductSummary[], state: FilterState) => sortProducts(items.filter((p) => matches(p, state)), state.sort);

export interface FacetValue {
  value: string;
  label: string;
  count: number;
  swatch?: string;
}

/** Values (with counts given the other active filters) for one facet. */
export function facetValues(items: ProductSummary[], state: FilterState, key: FilterKey, categoryNames: Record<string, string> = {}): FacetValue[] {
  const values = new Map<string, FacetValue>();
  const bump = (value: string, label: string, swatch?: string) => {
    const v = values.get(value) ?? { value, label, count: 0, swatch };
    v.count += 1;
    values.set(value, v);
  };
  const skip: Exclude = key === "category" || key === "brand" ? key : key === "availability" ? "stock" : key.startsWith("option:") || key.startsWith("attr:") ? (key as Exclude) : null;
  const pool = items.filter((p) => matches(p, state, skip));

  for (const p of pool) {
    if (key === "category") p.categories.forEach((c) => categoryNames[c] && bump(c, categoryNames[c]));
    else if (key === "brand") bump(p.brand, p.brand);
    else if (key.startsWith("option:")) {
      const group = p.variants.find((g) => g.id === facetParam(key));
      group?.options.forEach((o) => bump(o.value, o.label.split(" — ")[0] ?? o.label, o.swatch));
    } else if (key.startsWith("attr:")) (p.attributes[facetParam(key)] ?? []).forEach((v) => bump(v, v));
  }
  const out = [...values.values()];
  // Keep sizes and storage in their natural order; sort everything else alphabetically.
  return key.startsWith("option:") ? out : out.sort((a, b) => a.label.localeCompare(b.label));
}

/** Number of matching products for the "In stock only" toggle. */
export const inStockCount = (items: ProductSummary[], state: FilterState) => items.filter((p) => matches(p, state, "stock") && p.stock > 0).length;

export function activeFilterCount(s: FilterState) {
  return (
    s.categories.length +
    s.brands.length +
    (s.price.min != null || s.price.max != null ? 1 : 0) +
    (s.rating ? 1 : 0) +
    (s.inStock ? 1 : 0) +
    Object.values(s.options).reduce((n, v) => n + v.length, 0) +
    Object.values(s.attrs).reduce((n, v) => n + v.length, 0)
  );
}

export function priceBounds(items: ProductSummary[]) {
  if (!items.length) return { min: 0, max: 0 };
  const prices = items.map((p) => p.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}
