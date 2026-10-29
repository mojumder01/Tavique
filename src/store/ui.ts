import { create } from "zustand";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
  action?: { label: string; href: string };
}

interface UIState {
  cartOpen: boolean;
  /** Confirmation shown at the top of the bag drawer after an add. */
  lastAdded: string | null;
  searchOpen: boolean;
  /** Slug of the product shown in the quick-add dialog. */
  quickAdd: string | null;
  toasts: Toast[];
  setCartOpen: (open: boolean, lastAdded?: string | null) => void;
  setSearchOpen: (open: boolean) => void;
  setQuickAdd: (slug: string | null) => void;
  toast: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useUI = create<UIState>()((set, get) => ({
  cartOpen: false,
  lastAdded: null,
  searchOpen: false,
  quickAdd: null,
  toasts: [],
  setCartOpen: (cartOpen, lastAdded = null) => set({ cartOpen, lastAdded }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setQuickAdd: (quickAdd) => set({ quickAdd }),
  toast: (t) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
    setTimeout(() => get().dismiss(id), 5000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
