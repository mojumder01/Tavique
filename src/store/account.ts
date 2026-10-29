import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeStorage } from "./storage";

export interface DemoAddress {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AccountState {
  /** Demo session — NOT authentication. Only a display name is persisted. */
  name: string | null;
  addresses: DemoAddress[];
  signIn: (name: string) => void;
  signOut: () => void;
  saveAddress: (address: DemoAddress) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const sampleAddresses: DemoAddress[] = [
  { id: "addr-1", label: "Home", name: "Alex Morgan", line1: "48 Mercer Street, Apt 3", city: "New York, NY", postalCode: "10013", country: "United States", isDefault: true },
  { id: "addr-2", label: "Studio", name: "Alex Morgan", line1: "210 Kent Avenue", city: "Brooklyn, NY", postalCode: "11249", country: "United States", isDefault: false },
];

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      name: null,
      addresses: sampleAddresses,
      signIn: (name) => set({ name: name.trim().split(/\s+/)[0] || "there" }),
      signOut: () => set({ name: null, addresses: sampleAddresses }),
      saveAddress: (address) =>
        set((s) => {
          const exists = s.addresses.some((a) => a.id === address.id);
          let next = exists ? s.addresses.map((a) => (a.id === address.id ? address : a)) : [...s.addresses, address];
          if (address.isDefault) next = next.map((a) => ({ ...a, isDefault: a.id === address.id }));
          return { addresses: next };
        }),
      removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      setDefaultAddress: (id) => set((s) => ({ addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })) })),
    }),
    // Addresses stay in memory for the session only; just the display name is persisted.
    { name: "tavique-account", version: 1, storage: safeStorage, skipHydration: true, partialize: (s) => ({ name: s.name }) },
  ),
);
