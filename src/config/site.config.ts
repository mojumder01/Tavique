import type { StoreId } from "@/types/catalog";

export type HomeRoute = StoreId | "showcase";

/**
 * Global settings. Storefront-specific settings live in ./stores/*.config.ts.
 */
export const siteConfig = {
  name: "Tavique",
  description: "Tavique is a premium multi-store commerce template with fashion, electronics and beauty storefronts.",
  /** Used for canonical URLs, the sitemap and Open Graph tags. Set NEXT_PUBLIC_SITE_URL in production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /**
   * What the `/` route renders:
   *  - "showcase" — the template landing page that previews all three storefronts
   *  - "fashion" | "electronics" | "beauty" — that storefront's homepage
   */
  home: "showcase" as HomeRoute,
  /** Storefront used for shared pages (cart, checkout, FAQ…) before a visitor picks one. */
  defaultStore: "fashion" as StoreId,
  /** Storefronts that are live. Remove ids to run a single-niche store. */
  enabledStores: ["fashion", "electronics", "beauty"] as StoreId[],
  /** Show the "Storefront" switcher in the announcement bar and menus (demo only). */
  showStoreSwitcher: true,
  /** Shows "demo" notices on checkout, account and forms. Keep true until real integrations are connected. */
  demoMode: true,
  locale: "en-US",
  currency: "USD",
  contact: {
    email: "hello@tavique.example",
    phone: "+1 (555) 014-2040",
    address: "48 Mercer Street, New York, NY 10013",
    hours: "Mon–Fri, 9am–6pm ET",
  },
  /** Optional integrations — see .env.example. Empty values keep forms in demo mode. */
  integrations: {
    newsletterEndpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT ?? "",
    contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
  },
} as const;
