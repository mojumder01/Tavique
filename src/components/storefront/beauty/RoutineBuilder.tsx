"use client";

import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/money";
import { productHref } from "@/lib/routes";
import { defaultSelection, resolveVariant } from "@/lib/variants";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

/** Four-step routine with a single "add all" action. Each product uses its first in-stock options. */
export function RoutineBuilder({ steps }: { steps: { step: string; product: string; note: string }[] }) {
  const { bySlug } = useCatalog();
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const toast = useUI((s) => s.toast);
  const items = steps.map((s) => ({ ...s, p: bySlug.get(s.product) })).filter((s) => s.p);
  const total = items.reduce((n, s) => n + resolveVariant(s.p!, defaultSelection(s.p!, { fillAll: true })).price, 0);

  const addAll = () => {
    let added = 0;
    for (const { p } of items) {
      const selection = defaultSelection(p!, { fillAll: true });
      const v = resolveVariant(p!, selection);
      if (v.complete && v.stock > 0) added += add({ productId: p!.id, options: selection, quantity: 1, max: v.stock }) > 0 ? 1 : 0;
    }
    if (added) setCartOpen(true, `Added ${added} routine ${added === 1 ? "product" : "products"} to your bag`);
    else toast({ title: "Routine already in your bag", tone: "error", action: { label: "View bag", href: "/cart" } });
  };

  return (
    <div>
      <ol className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map(({ step, note, p }, i) => (
          <li key={step} className="flex flex-col">
            <Link href={productHref(p!.slug)} className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-muted">
              <Image src={p!.images[0]?.src ?? ""} alt={p!.images[0]?.alt ?? p!.title} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <span className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full bg-bg text-sm font-semibold">{i + 1}</span>
            </Link>
            <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-accent uppercase">{step}</p>
            <Link href={productHref(p!.slug)} className="mt-1 text-[0.9375rem] font-medium hover:underline">
              {p!.title}
            </Link>
            <p className="mt-1 text-sm text-fg-muted">{note}</p>
            <p className="mt-2 text-sm tabular-nums">{formatPrice(p!.price)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-col items-center gap-2">
        <Button size="lg" onClick={addAll}>
          Add full routine · {formatPrice(total)}
        </Button>
        <p className="text-xs text-fg-muted">Adds each product in its first available size or shade.</p>
      </div>
    </div>
  );
}
