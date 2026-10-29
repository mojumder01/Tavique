import type { ReactNode } from "react";
import { getStoreConfig } from "@/config/stores";
import { siteConfig } from "@/config/site.config";
import type { StoreId } from "@/types/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { RememberStore } from "./RememberStore";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { StoreOverlays } from "./StoreOverlays";
import { StoreTheme } from "./StoreTheme";

/**
 * Wraps a page in a storefront: theme tokens, announcement bar, header, footer and overlays.
 * Only the small, serialisable slices of config each client component needs are passed down.
 */
export function StoreShell({ store, children, footerNewsletter = true }: { store: StoreId; children: ReactNode; footerNewsletter?: boolean }) {
  const config = getStoreConfig(store);
  return (
    <div data-store={store} className="flex min-h-dvh flex-col bg-bg font-sans text-fg">
      <StoreTheme config={config} />
      <RememberStore store={store} />
      <a href="#main" className="sr-only z-[70] rounded-btn bg-primary px-4 py-2 text-primary-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <AnnouncementBar items={config.announcements} store={store} showSwitcher={siteConfig.showStoreSwitcher} />
      <SiteHeader
        store={store}
        logo={config.logo}
        layout={config.header.layout}
        sticky={config.header.sticky}
        nav={config.nav}
        search={config.search}
        hasDarkTheme={Boolean(config.theme.dark)}
        showSwitcher={siteConfig.showStoreSwitcher}
      />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter config={config} newsletter={footerNewsletter} />
      <StoreOverlays store={store} searchPlaceholder={config.search.placeholder} popular={config.search.popular} />
    </div>
  );
}
