"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/catalog";
import type { StoreConfig } from "@/types/store";
import { ProductCard } from "./ProductCard";

/** Horizontally scrolling row with scroll-snap and previous/next controls. */
export function ProductCarousel({ products, card, label, className }: { products: ProductSummary[]; card: StoreConfig["productCard"]; label: string; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  const btn = "inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-fg transition hover:border-fg disabled:opacity-30";

  return (
    <div role="group" aria-roledescription="carousel" aria-label={label} className={cn("relative", className)}>
      <div className="mb-5 hidden justify-end gap-2 md:flex">
        <button type="button" className={btn} onClick={() => scroll(-1)} disabled={edges.start} aria-label={`Previous ${label}`}>
          <ArrowLeft className="size-4" aria-hidden />
        </button>
        <button type="button" className={btn} onClick={() => scroll(1)} disabled={edges.end} aria-label={`Next ${label}`}>
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
      <ul ref={ref} className="relative no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-5 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0">
        {products.map((p) => (
          <li key={p.id} className="flex w-[68%] shrink-0 snap-start xs:w-[46%] md:w-[31%] xl:w-[23.5%]">
            <ProductCard product={p} style={card.style} aspect={card.aspect} className="w-full" sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 66vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
