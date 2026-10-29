import type { Metadata } from "next";
import { Showcase } from "@/components/storefront/showcase/Showcase";
import { StorefrontHome, storefrontMetadata } from "@/components/storefront/StorefrontHome";
import { siteConfig } from "@/config/site.config";

// `/` is configurable in src/config/site.config.ts (`home`).
export const metadata: Metadata =
  siteConfig.home === "showcase"
    ? { title: { absolute: `${siteConfig.name} — Multi-store commerce template` }, description: siteConfig.description, alternates: { canonical: "/" } }
    : { ...storefrontMetadata(siteConfig.home), alternates: { canonical: "/" } };

export default function Home() {
  return siteConfig.home === "showcase" ? <Showcase /> : <StorefrontHome store={siteConfig.home} isSiteHome />;
}
