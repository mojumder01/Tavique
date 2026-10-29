"use client";

import { Modal } from "@/components/ui/Modal";
import { useUI } from "@/store/ui";
import type { StoreId } from "@/types/catalog";
import { SearchBar } from "./SearchBar";

export function SearchOverlay({ store, placeholder, popular }: { store: StoreId; placeholder: string; popular: string[] }) {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Search" size="lg" className="mt-[8vh] mb-auto overflow-visible">
      <div className="p-5 pb-6">{open && <SearchBar store={store} placeholder={placeholder} popular={popular} autoFocus variant="overlay" onNavigate={() => setOpen(false)} />}</div>
    </Modal>
  );
}
