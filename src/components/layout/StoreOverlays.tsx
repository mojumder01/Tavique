"use client";

import { CartDrawer } from "@/components/commerce/CartDrawer";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";
import { QuickAddDialog } from "@/components/product/QuickAddDialog";
import { Toaster } from "@/components/ui/Toaster";
import type { StoreId } from "@/types/catalog";

/** Store-scoped dialogs; rendered inside the storefront wrapper so they inherit its theme. */
export function StoreOverlays({ store, searchPlaceholder, popular }: { store: StoreId; searchPlaceholder: string; popular: string[] }) {
  return (
    <>
      <CartDrawer store={store} />
      <QuickAddDialog />
      <SearchOverlay store={store} placeholder={searchPlaceholder} popular={popular} />
      <Toaster />
    </>
  );
}
