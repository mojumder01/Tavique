"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { VariantSelector } from "@/components/ui/VariantSelector";
import { useAddToCart } from "@/hooks/useAddToCart";
import { productHref } from "@/lib/routes";
import { defaultSelection, resolveVariant } from "@/lib/variants";
import { useUI } from "@/store/ui";
import type { ProductSummary } from "@/types/catalog";
import type { SelectedOptions } from "@/types/commerce";

/** Body of the dialog. Keyed by product, so its state starts fresh for every product opened. */
function QuickAddContent({ product, onDone }: { product: ProductSummary; onDone: () => void }) {
  const addToCart = useAddToCart();
  const [selection, setSelection] = useState<SelectedOptions>(() => defaultSelection(product, { fillSwatches: true }));
  const [quantity, setQuantity] = useState(1);
  const [invalid, setInvalid] = useState<string[]>([]);
  const v = resolveVariant(product, selection);
  const maxQty = Math.max(1, Math.min(10, v.stock));
  const qty = Math.min(quantity, maxQty);

  return (
    <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:p-6">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-muted">
        <Image src={v.image ?? product.images[0]?.src ?? ""} alt={product.images[0]?.alt ?? product.title} fill sizes="(min-width: 640px) 320px, 90vw" className="object-cover" />
      </div>
      <div className="flex flex-col">
        <p className="text-xs text-fg-muted">{product.brand}</p>
        <p className="heading mt-1 pr-8 text-2xl">{product.title}</p>
        <PriceDisplay price={v.price} originalPrice={v.originalPrice} className="mt-2" />
        <div className="mt-6">
          <VariantSelector
            product={product}
            selection={selection}
            invalidGroups={invalid}
            compact
            onChange={(g, value) => {
              setSelection((s) => ({ ...s, [g]: value }));
              setInvalid((i) => i.filter((x) => x !== g));
            }}
          />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <QuantitySelector value={qty} onChange={setQuantity} max={maxQty} />
          <Button
            className="flex-1"
            disabled={v.complete && v.stock <= 0}
            onClick={() => {
              const result = addToCart(product, selection, qty);
              if (!result.ok && result.reason === "missing") setInvalid(result.missing);
              else if (result.ok) onDone();
            }}
          >
            {v.complete && v.stock <= 0 ? "Sold out" : "Add to bag"}
          </Button>
        </div>
        {v.complete && v.stock > 0 && v.stock <= 3 && <p className="mt-3 text-sm text-sale">Only {v.stock} left in this option.</p>}
        <Link href={productHref(product.slug)} onClick={onDone} className="mt-6 text-sm underline underline-offset-4">
          View full details
        </Link>
      </div>
    </div>
  );
}

export function QuickAddDialog() {
  const slug = useUI((s) => s.quickAdd);
  const setQuickAdd = useUI((s) => s.setQuickAdd);
  const { bySlug } = useCatalog();
  const product = slug ? bySlug.get(slug) : undefined;
  const close = () => setQuickAdd(null);

  return (
    <Modal open={Boolean(product)} onClose={close} title={product ? `Add ${product.title}` : "Quick add"} hideTitle size="lg">
      {product && <QuickAddContent key={product.slug} product={product} onDone={close} />}
    </Modal>
  );
}
