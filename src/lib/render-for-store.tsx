import "server-only";
import type { ReactNode } from "react";
import { ActiveStoreSwitch } from "@/components/layout/ActiveStoreSwitch";
import { defaultStore, enabledStores } from "@/config/stores";
import { isStaticExport } from "@/lib/static-export";
import type { StoreId } from "@/types/catalog";
import { getActiveStore } from "./active-store";

/**
 * Renders a shared page (cart, FAQ…) in the storefront the visitor last browsed.
 * On a server the store comes from the cookie. In a static export there is no request,
 * so every enabled storefront is pre-rendered and the browser shows the matching one.
 */
export async function renderForActiveStore(render: (store: StoreId) => ReactNode): Promise<ReactNode> {
  if (!isStaticExport) return render(await getActiveStore());
  const variants = Object.fromEntries(enabledStores.map((store) => [store, render(store)])) as Partial<Record<StoreId, ReactNode>>;
  return <ActiveStoreSwitch fallback={defaultStore} variants={variants} />;
}
