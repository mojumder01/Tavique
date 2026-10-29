import { create } from "zustand";
import { persist } from "zustand/middleware";
import { commerceConfig } from "@/config/commerce.config";
import { lineKey } from "@/lib/variants";
import { clamp } from "@/lib/utils";
import type { CartLine, SelectedOptions } from "@/types/commerce";
import { safeStorage } from "./storage";

interface AddInput {
  productId: string;
  options: SelectedOptions;
  quantity?: number;
  /** Available stock for this selection; the line is capped to it. */
  max: number;
}

interface CartState {
  lines: CartLine[];
  discountCode: string | null;
  shippingMethodId: string;
  /** Returns the quantity actually added (0 when already at the limit). */
  add: (input: AddInput) => number;
  setQuantity: (key: string, quantity: number, max: number) => void;
  changeOptions: (key: string, options: SelectedOptions, max: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  applyCode: (code: string) => void;
  removeCode: () => void;
  setShippingMethod: (id: string) => void;
}

const limit = (max: number) => Math.max(0, Math.min(max, commerceConfig.maxQuantityPerLine));

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      discountCode: null,
      shippingMethodId: commerceConfig.shippingMethods[0]?.id ?? "standard",
      add: ({ productId, options, quantity = 1, max }) => {
        const key = lineKey(productId, options);
        const cap = limit(max);
        const existing = get().lines.find((l) => l.key === key);
        const current = existing?.quantity ?? 0;
        const next = clamp(current + quantity, 0, cap);
        const added = next - current;
        if (added <= 0) return 0;
        set((s) => ({
          lines: existing ? s.lines.map((l) => (l.key === key ? { ...l, quantity: next } : l)) : [...s.lines, { key, productId, options, quantity: next }],
        }));
        return added;
      },
      setQuantity: (key, quantity, max) =>
        set((s) => ({
          lines: quantity <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, quantity: clamp(Math.floor(quantity), 1, Math.max(1, limit(max))) } : l)),
        })),
      changeOptions: (key, options, max) =>
        set((s) => {
          const line = s.lines.find((l) => l.key === key);
          if (!line) return s;
          const nextKey = lineKey(line.productId, options);
          if (nextKey === key) return s;
          const target = s.lines.find((l) => l.key === nextKey);
          const others = s.lines.filter((l) => l.key !== key && l.key !== nextKey);
          const quantity = clamp(line.quantity + (target?.quantity ?? 0), 1, Math.max(1, limit(max)));
          const merged: CartLine = { key: nextKey, productId: line.productId, options, quantity };
          const index = s.lines.findIndex((l) => l.key === key);
          others.splice(Math.min(index, others.length), 0, merged);
          return { lines: others };
        }),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [], discountCode: null }),
      applyCode: (code) => set({ discountCode: code.trim().toUpperCase() || null }),
      removeCode: () => set({ discountCode: null }),
      setShippingMethod: (id) => set({ shippingMethodId: id }),
    }),
    { name: "tavique-cart", version: 1, storage: safeStorage, skipHydration: true },
  ),
);
