import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DemoOrder } from "@/types/commerce";
import { safeStorage } from "./storage";

interface OrdersState {
  orders: DemoOrder[];
  add: (order: DemoOrder) => void;
}

/**
 * Demo orders, stored locally so the confirmation page and account history work without a backend.
 * Only a first name and city are kept — no email, phone, street address or payment data.
 */
export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      add: (order) => set((s) => ({ orders: [order, ...s.orders].slice(0, 20) })),
    }),
    { name: "tavique-orders", version: 1, storage: safeStorage, skipHydration: true },
  ),
);
