"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/store";

/** Top-level navigation. Items with a `mega` config open a full-width panel on hover, click or keyboard. */
export function DesktopNavigation({ items, align = "left", tone = "default", className }: { items: NavItem[]; align?: "left" | "center"; tone?: "default" | "caps"; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const pathname = usePathname();
  const baseId = useId();

  useEffect(() => setOpenIndex(null), [pathname]);
  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggers.current[openIndex]?.focus();
        setOpenIndex(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex]);

  const schedule = (i: number | null, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenIndex(i), delay);
  };

  const linkClass = cn("inline-flex h-10 items-center gap-1 whitespace-nowrap px-2.5 text-fg transition-colors hover:text-fg-muted", tone === "caps" ? "text-[0.75rem] font-medium tracking-[0.14em] uppercase" : "text-sm");

  return (
    <nav aria-label="Main" className={cn("relative", className)} onMouseLeave={() => schedule(null, 160)}>
      <ul className={cn("flex flex-wrap items-center gap-x-1", align === "center" && "justify-center")}>
        {items.map((item, i) => {
          const active = pathname === item.href.split("?")[0];
          if (!item.mega) {
            return (
              <li key={item.label} onMouseEnter={() => schedule(null, 80)}>
                <Link href={item.href} className={cn(linkClass, item.label === "Sale" || item.label === "Deals" ? "text-sale hover:text-sale/80" : "")} aria-current={active ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          }
          const panelId = `${baseId}-panel-${i}`;
          const open = openIndex === i;
          return (
            <li key={item.label} onMouseEnter={() => schedule(i, 120)}>
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className={linkClass}
              >
                {item.label}
                <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
              </button>
              <div id={panelId} hidden={!open} className="fixed inset-x-0 z-40 mt-px border-y border-line bg-bg shadow-[0_24px_40px_-24px_rgb(0_0_0/0.25)]" onMouseEnter={() => schedule(i, 0)}>
                <div className="page grid grid-cols-12 gap-8 py-10">
                  <div className="col-span-8 grid grid-cols-3 gap-8">
                    {item.mega.columns.map((col) => (
                      <div key={col.title}>
                        <p className="eyebrow mb-4">{col.title}</p>
                        <ul className="space-y-2.5">
                          {col.links.map((l) => (
                            <li key={l.label}>
                              <Link href={l.href} className="text-[0.9375rem] text-fg underline-offset-4 hover:underline">
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-3 border-t border-line pt-5">
                      <Link href={item.href} className="text-sm font-medium underline underline-offset-4">
                        View all {item.label === "Shop" || item.label === "Shop All" ? "products" : item.label.toLowerCase()}
                      </Link>
                    </div>
                  </div>
                  {item.mega.feature && (
                    <Link href={item.mega.feature.href} className="group col-span-4 grid grid-cols-2 items-center gap-5 rounded-card bg-surface p-3">
                      <span className="relative aspect-[4/5] overflow-hidden rounded-card bg-muted">
                        <Image src={item.mega.feature.image} alt="" fill sizes="220px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </span>
                      <span>
                        <span className="heading block text-2xl">{item.mega.feature.title}</span>
                        <span className="mt-2 block text-sm text-fg-muted">{item.mega.feature.caption}</span>
                        <span className="mt-4 inline-block text-sm font-medium underline underline-offset-4">Shop now</span>
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
