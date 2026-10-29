"use client";

import { useCallback } from "react";
import { resolveVariant, type VariantProduct } from "@/lib/variants";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import type { SelectedOptions } from "@/types/commerce";

export type AddResult = { ok: true; added: number } | { ok: false; reason: "missing"; missing: string[] } | { ok: false; reason: "sold-out" | "limit" };

/** Validates the selection against stock, adds to the bag and confirms (drawer + live announcement). */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const lines = useCart((s) => s.lines);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const toast = useUI((s) => s.toast);

  return useCallback(
    (product: VariantProduct & { title: string }, selection: SelectedOptions, quantity = 1, { openCart = true }: { openCart?: boolean } = {}): AddResult => {
      const v = resolveVariant(product, selection);
      if (!v.complete) return { ok: false, reason: "missing", missing: v.missing };
      if (v.stock <= 0) {
        toast({ title: "Sold out", description: "This option is currently unavailable.", tone: "error" });
        return { ok: false, reason: "sold-out" };
      }
      const added = add({ productId: product.id, options: selection, quantity, max: v.stock });
      if (added === 0) {
        toast({ title: "Maximum quantity reached", description: `You already have all ${Math.min(v.stock, 10)} available in your bag.`, tone: "error", action: { label: "View bag", href: "/cart" } });
        return { ok: false, reason: "limit" };
      }
      const detail = v.labels.map((l) => l.label).join(" · ");
      const message = `${added < quantity ? `Added ${added} (all remaining stock)` : "Added to your bag"}: ${product.title}${detail ? ` — ${detail}` : ""}`;
      // The drawer shows the confirmation itself (content behind a modal is inert, so a toast there may not be announced).
      if (openCart) setCartOpen(true, message);
      else toast({ title: added < quantity ? `Added ${added} — that's all we have` : "Added to your bag", description: `${product.title}${detail ? ` — ${detail}` : ""}`, tone: "success", action: { label: "View bag", href: "/cart" } });
      return { ok: true, added };
    },
    // `lines` keeps the callback fresh for limit messages after storage hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [add, setCartOpen, toast, lines],
  );
}
