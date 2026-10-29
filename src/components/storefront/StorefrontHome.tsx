import { StoreShell } from "@/components/layout/StoreShell";
import { getStoreConfig } from "@/config/stores";
import { siteConfig } from "@/config/site.config";
import { storeHome } from "@/lib/routes";
import type { StoreId } from "@/types/catalog";
import type { Metadata } from "next";
import { BeautyHome } from "./beauty/BeautyHome";
import { ElectronicsHome } from "./electronics/ElectronicsHome";
import { FashionHome } from "./fashion/FashionHome";

const homes = { fashion: FashionHome, electronics: ElectronicsHome, beauty: BeautyHome } satisfies Record<StoreId, () => React.ReactNode>;

/** A storefront's homepage. Homepages render their own newsletter section, so the footer one is hidden. */
export function StorefrontHome({ store }: { store: StoreId }) {
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
