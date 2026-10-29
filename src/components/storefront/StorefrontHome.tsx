import { notFound, permanentRedirect } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { enabledStores, getStoreConfig } from "@/config/stores";
import { siteConfig } from "@/config/site.config";
import { storeHome } from "@/lib/routes";
import type { StoreId } from "@/types/catalog";
import type { Metadata } from "next";
import { BeautyHome } from "./beauty/BeautyHome";
import { ElectronicsHome } from "./electronics/ElectronicsHome";
import { FashionHome } from "./fashion/FashionHome";

const homes = { fashion: FashionHome, electronics: ElectronicsHome, beauty: BeautyHome } satisfies Record<StoreId, () => React.ReactNode>;

/**
 * A storefront's homepage. Homepages render their own newsletter section, so the footer one is hidden.
 * `isSiteHome` is set by `/`; the storefront's own route then redirects there to avoid duplicate pages.
 */
export function StorefrontHome({ store, isSiteHome = false }: { store: StoreId; isSiteHome?: boolean }) {
  if (!enabledStores.includes(store)) notFound();
  if (!isSiteHome && siteConfig.home === store) permanentRedirect("/");
  const Home = homes[store];
  return (
    <StoreShell store={store} footerNewsletter={false}>
      <Home />
    </StoreShell>
  );
}

export function storefrontMetadata(store: StoreId): Metadata {
  const config = getStoreConfig(store);
  const title = `${siteConfig.name} — ${config.label}`;
  return {
    title: { absolute: title },
    description: config.description,
    alternates: { canonical: storeHome(store) },
    openGraph: { title, description: config.description, url: storeHome(store), images: [{ url: config.home.hero.image, alt: config.home.hero.imageAlt }] },
  };
}
