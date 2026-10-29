import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/commerce/OrderConfirmation";
import { StoreShell } from "@/components/layout/StoreShell";
import { Skeleton } from "@/components/ui/Skeleton";
import { getActiveStore } from "@/lib/active-store";
import { storeHome } from "@/lib/routes";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false, follow: false } };

export default async function OrderConfirmationPage() {
  const store = await getActiveStore();
  return (
    <StoreShell store={store} footerNewsletter={false}>
      <div className="page py-16 md:py-24">
        <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-3xl" />}>
          <OrderConfirmation continueHref={storeHome(store)} />
        </Suspense>
      </div>
    </StoreShell>
  );
}
