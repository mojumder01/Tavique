"use client";

import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { enabledStores, storeConfigs } from "@/config/stores";
import { storeHome } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { StoreId } from "@/types/catalog";

/** Demo control for jumping between the three storefronts. Disable with siteConfig.showStoreSwitcher. */
export function StoreSwitcher({ current, className, variant = "menu" }: { current: StoreId; className?: string; variant?: "menu" | "list" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (enabledStores.length < 2) return null;

  if (variant === "list") {
    return (
      <nav aria-label="Storefronts" className={className}>
        <p className="eyebrow mb-3">Storefront</p>
        <ul className="grid gap-1">
          {enabledStores.map((id) => (
            <li key={id}>
              <Link href={storeHome(id)} aria-current={id === current ? "page" : undefined} className={cn("flex items-center justify-between rounded-input px-3 py-2.5 text-sm hover:bg-muted", id === current && "bg-muted font-medium")}>
                {storeConfigs[id].label}
                {id === current && <Check className="size-4" aria-hidden />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={menuId} className="inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-xs opacity-90 hover:bg-white/10 hover:opacity-100">
        <span className="sr-only">Storefront: </span>
        {storeConfigs[current].label.split(" & ")[0]}
        <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <ul id={menuId} className="absolute top-full right-0 z-50 mt-1 w-56 rounded-card border border-line bg-surface p-1.5 text-fg shadow-xl">
          {enabledStores.map((id) => (
            <li key={id}>
              <Link href={storeHome(id)} onClick={() => setOpen(false)} aria-current={id === current ? "page" : undefined} className="flex items-center justify-between rounded-input px-3 py-2 text-sm hover:bg-muted">
                {storeConfigs[id].label}
                {id === current && <Check className="size-4" aria-hidden />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
