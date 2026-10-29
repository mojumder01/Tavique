"use client";

import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoreConfig } from "@/types/store";
import type { StoreId } from "@/types/catalog";
import { StoreSwitcher } from "./StoreSwitcher";

/** Rotating announcements. Rotation pauses on hover/focus and has a visible pause control (WCAG 2.2.2). */
export function AnnouncementBar({ items, store, showSwitcher }: { items: StoreConfig["announcements"]; store: StoreId; showSwitcher: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const rotating = items.length > 1 && !paused && !hovering;

  useEffect(() => {
    if (!rotating) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => window.clearInterval(id);
  }, [rotating, items.length]);

  if (!items.length) return null;
  const item = items[index] ?? items[0]!;
  return (
    <aside aria-label="Announcements" className="bg-announce text-announce-fg" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onFocus={() => setHovering(true)} onBlur={() => setHovering(false)}>
      <div className="page flex h-9 items-center justify-between gap-3 text-xs">
        <div className="hidden w-40 lg:block" aria-hidden />
        <p className="min-w-0 flex-1 truncate text-center tracking-wide" aria-live={rotating ? "off" : "polite"}>
          {item.text}
          {item.href && (
            <>
              {" "}
              <Link href={item.href} className="ml-1 font-medium underline underline-offset-4">
                {item.linkLabel ?? "Learn more"}
              </Link>
            </>
          )}
        </p>
        <div className="flex w-auto items-center justify-end gap-1 lg:w-40">
          {items.length > 1 && (
            <button type="button" onClick={() => setPaused((p) => !p)} className="inline-flex size-7 items-center justify-center rounded-full opacity-80 hover:bg-white/10 hover:opacity-100" aria-label={paused ? "Resume announcements" : "Pause announcements"}>
              {paused ? <Play className="size-3" aria-hidden /> : <Pause className="size-3" aria-hidden />}
            </button>
          )}
          {showSwitcher && <StoreSwitcher current={store} className="hidden lg:block" />}
        </div>
      </div>
    </aside>
  );
}
