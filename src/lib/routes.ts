import { siteConfig } from "@/config/site.config";
import type { StoreId } from "@/types/catalog";

/** Homepage URL for a storefront — "/" when it's configured as the site home. */
export const storeHome = (store: StoreId) => (siteConfig.home === store ? "/" : `/${store}`);
export const productHref = (slug: string) => `/product/${slug}`;
export const categoryHref = (slug: string) => `/category/${slug}`;
export const searchHref = (q: string) => `/search?q=${encodeURIComponent(q)}`;
