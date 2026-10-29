import type { Metadata } from "next";
import { AccountView } from "@/components/commerce/AccountView";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { renderForActiveStore } from "@/lib/render-for-store";
import { storeHome } from "@/lib/routes";
import type { StoreId } from "@/types/catalog";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: true }, alternates: { canonical: "/account" } };

export default async function AccountPage() {
  return renderForActiveStore(renderAccountPage);
}

function renderAccountPage(store: StoreId) {
  return (
    <StoreShell store={store}>
      <div className="page pt-6 pb-24 md:pt-8">
        <Breadcrumbs items={[{ label: "Home", href: storeHome(store) }, { label: "Account" }]} />
        <h1 className="heading mt-6 mb-10 text-4xl md:text-5xl">Your account</h1>
        <AccountView continueHref={storeHome(store)} />
      </div>
    </StoreShell>
  );
}
