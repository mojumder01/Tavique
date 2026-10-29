"use client";

import { useEffect } from "react";
import { basePath, STORE_COOKIE } from "@/lib/static-export";
import type { StoreId } from "@/types/catalog";

/** Remembers the storefront being browsed so shared pages (cart, FAQ…) keep its look. */
export function RememberStore({ store }: { store: StoreId }) {
  useEffect(() => {
    document.cookie = `${STORE_COOKIE}=${store}; path=${basePath || "/"}; max-age=31536000; samesite=lax`;
  }, [store]);
  return null;
}
