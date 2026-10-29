import "server-only";
import { cookies } from "next/headers";
import { defaultStore, enabledStores, isStoreId } from "@/config/stores";
import { STORE_COOKIE } from "@/lib/static-export";
import type { StoreId } from "@/types/catalog";

/** The storefront a visitor last browsed — used to theme shared pages like cart and FAQ. */
export async function getActiveStore(): Promise<StoreId> {
  const value = (await cookies()).get(STORE_COOKIE)?.value;
  return isStoreId(value) && enabledStores.includes(value) ? value : defaultStore;
}
