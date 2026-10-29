import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { basePath } from "@/lib/static-export";

// Plain files, so they also work in a static export.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#f6f4f1",
    theme_color: "#1d1b19",
    icons: [{ src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" }],
  };
}
