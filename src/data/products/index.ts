import type { Product, ProductSummary, StoreId } from "@/types/catalog";
import { beautyProducts } from "./beauty";
import { electronicsProducts } from "./electronics";
import { fashionProducts } from "./fashion";

export const products: Product[] = [...fashionProducts, ...electronicsProducts, ...beautyProducts];

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byId = new Map(products.map((p) => [p.id, p]));

export const getProductBySlug = (slug: string) => bySlug.get(slug);
export const getProductById = (id: string) => byId.get(id);
export const getProductsByStore = (store: StoreId) => products.filter((p) => p.niche === store);
export const getProductsBySlugs = (slugs: string[]) => slugs.map((s) => bySlug.get(s)).filter((p): p is Product => Boolean(p));

/** Strips long-form content so the catalogue can be shared with client components cheaply. */
export function toSummary(p: Product): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    brand: p.brand,
    niche: p.niche,
    categories: p.categories,
    price: p.price,
    originalPrice: p.originalPrice,
    images: p.images.slice(0, 2),
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    badges: p.badges ?? [],
    variants: p.variants ?? [],
    attributes: p.attributes ?? {},
    tags: p.tags ?? [],
    featured: p.featured ?? false,
    createdAt: p.createdAt,
    keySpecs: p.electronics?.keySpecs ?? [],
  };
}

export const productSummaries: ProductSummary[] = products.map(toSummary);
export const summariesFor = (store: StoreId) => productSummaries.filter((p) => p.niche === store);
