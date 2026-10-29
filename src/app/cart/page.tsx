import type { Metadata } from "next";
import { CartView } from "@/components/commerce/CartView";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getStoreConfig } from "@/config/stores";
import { getProductsBySlugs, toSummary } from "@/data/products";
import { getActiveStore } from "@/lib/active-store";
import { storeHome } from "@/lib/routes";

export const metadata: Metadata = { title: "Your bag", robots: { index: false, follow: true }, alternates: { canonical: "/cart" } };

export default async function CartPage() {
  const store = await getActiveStore();
  const config = getStoreConfig(store);
  const suggestions = getProductsBySlugs(config.bestSellers).slice(0, 4).map(toSummary);
  return (
    <StoreShell store={store}>
      <div className="page pt-6 pb-24 md:pt-8">
        <Breadcrumbs items={[{ label: "Home", href: storeHome(store) }, { label: "Bag" }]} />
        <h1 className="heading mt-6 mb-8 text-4xl md:text-5xl">Your bag</h1>
        <CartView continueHref={storeHome(store)} suggestions={suggestions} card={config.productCard} />
      </div>
    </StoreShell>
  );
}
