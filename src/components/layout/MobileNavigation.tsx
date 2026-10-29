"use client";

import { ChevronDown, Heart, Mail, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { StoreId } from "@/types/catalog";
import type { NavItem } from "@/types/store";
import { StoreSwitcher } from "./StoreSwitcher";

/** Slide-out drawer for small screens. Mega-menu items become accessible disclosures. */
export function MobileNavigation({ open, onClose, items, store, showSwitcher }: { open: boolean; onClose: () => void; items: NavItem[]; store: StoreId; showSwitcher: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  useEffect(() => onClose(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal open={open} onClose={onClose} title="Menu" placement="left">
      <nav aria-label="Mobile" className="px-2 py-3">
        <ul>
          {items.map((item) => {
            if (!item.mega) {
              return (
                <li key={item.label}>
                  <Link href={item.href} className={cn("flex h-12 items-center rounded-input px-3 text-base hover:bg-muted", (item.label === "Sale" || item.label === "Deals") && "text-sale")}>
                    {item.label}
                  </Link>
                </li>
              );
            }
            const isOpen = expanded === item.label;
            const id = `m-${item.label.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <li key={item.label}>
                <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setExpanded(isOpen ? null : item.label)} className="flex h-12 w-full items-center justify-between rounded-input px-3 text-base hover:bg-muted">
                  {item.label}
                  <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
                </button>
                <div id={id} hidden={!isOpen} className="mb-2 ml-3 border-l border-line pl-3">
                  {item.mega.columns.map((col) => (
                    <div key={col.title} className="py-2">
                      <p className="eyebrow mb-1 px-2">{col.title}</p>
                      <ul>
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <Link href={l.href} className="flex h-10 items-center rounded-input px-2 text-[0.9375rem] text-fg hover:bg-muted">
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 grid gap-1 border-t border-line px-1 pt-4">
          <Link href="/account" className="flex h-11 items-center gap-3 rounded-input px-2 text-sm hover:bg-muted">
            <User className="size-4" aria-hidden /> Account
          </Link>
          <Link href="/wishlist" className="flex h-11 items-center gap-3 rounded-input px-2 text-sm hover:bg-muted">
            <Heart className="size-4" aria-hidden /> Wishlist
          </Link>
          <Link href="/contact" className="flex h-11 items-center gap-3 rounded-input px-2 text-sm hover:bg-muted">
            <Mail className="size-4" aria-hidden /> Contact us
          </Link>
        </div>
        {showSwitcher && <StoreSwitcher current={store} variant="list" className="mt-4 border-t border-line px-1 pt-5" />}
      </nav>
    </Modal>
  );
}
