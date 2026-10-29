"use client";

import { useEffect } from "react";
import type { StoreId } from "@/types/catalog";

/** Remembers the storefront being browsed so shared pages (cart, FAQ…) keep its look. */
export function RememberStore({ store }: { store: StoreId }) {
  useEffect(() => {
    document.cookie = `tavique-store=${store}; path=/; max-age=31536000; samesite=lax`;
  }, [store]);
  return null;
}
