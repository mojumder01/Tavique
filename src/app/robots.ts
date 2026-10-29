import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

// Plain files, so they also work in a static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/account", "/wishlist", "/order-confirmation", "/search"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
