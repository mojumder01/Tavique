import type { MetadataRoute } from "next";
import { enabledStores } from "@/config/stores";
import { siteConfig } from "@/config/site.config";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { categoryHref, productHref } from "@/lib/routes";

// Plain files, so they also work in a static export.
export const dynamic = "force-static";

/** Public, indexable pages only (cart, checkout, account, search and wishlist are excluded). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const stores = enabledStores.filter((s) => siteConfig.home !== s).map((s) => ({ url: url(`/${s}`), changeFrequency: "weekly" as const, priority: 0.9 }));
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    ...stores,
    ...categories.filter((c) => enabledStores.includes(c.niche)).map((c) => ({ url: url(categoryHref(c.slug)), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.filter((p) => enabledStores.includes(p.niche)).map((p) => ({ url: url(productHref(p.slug)), lastModified: new Date(p.createdAt), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...["/about", "/contact", "/faq", "/shipping-returns"].map((p) => ({ url: url(p), changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
