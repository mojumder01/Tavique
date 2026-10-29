import type { Metadata } from "next";
import { WishlistView } from "@/components/commerce/WishlistView";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { renderForActiveStore } from "@/lib/render-for-store";
import { storeHome } from "@/lib/routes";
import type { StoreId } from "@/types/catalog";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: true }, alternates: { canonical: "/wishlist" } };

export default async function WishlistPage() {
  return renderForActiveStore(renderWishlistPage);
}

function renderWishlistPage(store: StoreId) {
  return (
    <StoreShell store={store}>
      <div className="page pt-6 pb-24 md:pt-8">
        <Breadcrumbs items={[{ label: "Home", href: storeHome(store) }, { label: "Wishlist" }]} />
        <h1 className="heading mt-6 mb-8 text-4xl md:text-5xl">Wishlist</h1>
        <WishlistView continueHref={storeHome(store)} />
      </div>
    </StoreShell>
  );
}
