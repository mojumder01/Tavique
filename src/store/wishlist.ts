import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./storage";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      /** Returns true when the product is now saved. */
      toggle: (id) => {
        const saved = get().ids.includes(id);
        set((s) => ({ ids: saved ? s.ids.filter((x) => x !== id) : [id, ...s.ids] }));
        return !saved;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "tavique-wishlist", version: 1, storage: safeStorage, skipHydration: true },
  ),
);
