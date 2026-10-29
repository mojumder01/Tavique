import { siteConfig } from "@/config/site.config";
import { STORE_IDS, type StoreId } from "@/types/catalog";
import type { StoreConfig } from "@/types/store";
import { beautyConfig } from "./beauty.config";
import { electronicsConfig } from "./electronics.config";
import { fashionConfig } from "./fashion.config";

export const storeConfigs = {
  fashion: fashionConfig,
  electronics: electronicsConfig,
  beauty: beautyConfig,
} satisfies { [K in StoreId]: StoreConfig<K> };

export function getStoreConfig<T extends StoreId>(id: T): (typeof storeConfigs)[T] {
  return storeConfigs[id];
}

export const enabledStores: StoreId[] = STORE_IDS.filter((id) => (siteConfig.enabledStores as readonly StoreId[]).includes(id));

export function isStoreId(value: unknown): value is StoreId {
  return typeof value === "string" && (STORE_IDS as readonly string[]).includes(value);
}

/** Storefront for shared pages before a visitor picks one — siteConfig.defaultStore, or the first enabled store. */
export const defaultStore: StoreId = enabledStores.includes(siteConfig.defaultStore) ? siteConfig.defaultStore : (enabledStores[0] ?? siteConfig.defaultStore);
