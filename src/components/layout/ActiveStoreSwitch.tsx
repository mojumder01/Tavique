"use client";

import { type ReactNode, useState, useSyncExternalStore } from "react";
import { STORE_COOKIE } from "@/lib/static-export";
import type { StoreId } from "@/types/catalog";

const subscribe = () => () => {};

function cookieStore(): string | undefined {
  return document.cookie.match(new RegExp(`(?:^|; )${STORE_COOKIE}=([a-z]+)`))?.[1];
}

/**
 * Static export only: shows the pre-rendered storefront that matches the visitor's last-browsed
 * store. The server HTML holds the default store; the CSS in globals.css hides it until hydration
 * when the cookie names another store, so there is no flash of the wrong theme.
 */
export function ActiveStoreSwitch({ fallback, variants }: { fallback: StoreId; variants: Partial<Record<StoreId, ReactNode>> }) {
  // Read once on mount, before the default storefront's RememberStore can overwrite the cookie.
  const [saved] = useState(() => (typeof document === "undefined" ? undefined : cookieStore()));
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const store = hydrated && saved && saved in variants ? (saved as StoreId) : fallback;
  return <div data-store-switch={store}>{variants[store]}</div>;
}
