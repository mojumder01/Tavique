import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./storage";

interface HistoryState {
  viewed: string[];
  searches: string[];
  addViewed: (id: string) => void;
  addSearch: (term: string) => void;
  clearSearches: () => void;
}

/** Recently viewed products and recent search terms. */
export const useHistory = create<HistoryState>()(
  persist(
    (set) => ({
      viewed: [],
      searches: [],
      addViewed: (id) => set((s) => ({ viewed: [id, ...s.viewed.filter((x) => x !== id)].slice(0, 12) })),
      addSearch: (term) => {
        const t = term.trim().slice(0, 60);
        if (!t) return;
        set((s) => ({ searches: [t, ...s.searches.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 6) }));
      },
      clearSearches: () => set({ searches: [] }),
    }),
    { name: "tavique-history", version: 1, storage: safeStorage, skipHydration: true },
  ),
);
