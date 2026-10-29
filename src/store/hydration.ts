import { useSyncExternalStore } from "react";
import { useAccount } from "./account";
import { useCart } from "./cart";
import { useHistory } from "./history";
import { useOrders } from "./orders";
import { useWishlist } from "./wishlist";

let hydrated = false;
const listeners = new Set<() => void>();

/** Loads persisted stores from localStorage. Called once on the client after mount. */
export async function hydrateStores() {
  if (hydrated) return;
  await Promise.all([useCart, useWishlist, useHistory, useOrders, useAccount].map((s) => s.persist.rehydrate()));
  hydrated = true;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** False during SSR and the first client render, so persisted values never cause hydration mismatches. */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false,
  );
