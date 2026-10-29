import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { commerceConfig } from "@/config/commerce.config";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/types/catalog";

function Item({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[0.9375rem] font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pb-6 text-sm leading-relaxed text-fg-muted">{children}</div>
    </details>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-1.5 pl-5">
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

/** Compact, niche-aware detail accordions for the purchase column (native <details>, no JS needed). */
export function ProductDetails({ product }: { product: Product }) {
  const { fashion, electronics, beauty } = product;
  return (
    <div className="border-t border-line">
      {fashion && (
        <>
          <Item title="Fit & material">
            <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-2">
              <dt className="text-fg">Fit</dt>
              <dd>{fashion.fit}</dd>
              <dt className="text-fg">Material</dt>
              <dd>{fashion.material}</dd>
              {fashion.origin && (
                <>
                  <dt className="text-fg">Origin</dt>
                  <dd>{fashion.origin}</dd>
                </>
              )}
            </dl>
          </Item>
          <Item title="Care">
            <List items={fashion.care} />
          </Item>
        </>
      )}

      {electronics && (
        <>
          <Item title="What's in the box">
            <List items={electronics.inTheBox} />
          </Item>
          <Item title="Warranty">
            <p>{electronics.warranty}</p>
            <p className="mt-2">Register your device after purchase to extend coverage. Warranty terms shown are demo content.</p>
          </Item>
        </>
      )}

      {beauty && (
        <>
          <Item title="Key ingredients">
            <dl className="space-y-3">
              {beauty.keyIngredients.map((k) => (
                <div key={k.name}>
                  <dt className="font-medium text-fg">{k.name}</dt>
                  <dd>{k.benefit}</dd>
                </div>
              ))}
            </dl>
          </Item>
          <Item title="How to use">
            <ol className="list-decimal space-y-1.5 pl-5">
              {beauty.howToUse.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Item>
          <Item title="Full ingredients">
            <p>{beauty.ingredients}</p>
            <p className="mt-3 text-xs">Ingredient lists are illustrative demo content and may not reflect a real formula.</p>
          </Item>
          {beauty.claims && beauty.claims.length > 0 && (
            <Item title="Claims & notes">
              <List items={beauty.claims} />
            </Item>
          )}
        </>
      )}

      <Item title="Delivery & returns">
        <ul className="space-y-1.5">
          {commerceConfig.shippingMethods.map((m) => (
            <li key={m.id}>
              <span className="text-fg">{m.label}</span> — {m.description}, {formatPrice(m.price)}
              {"freeOver" in m && m.freeOver ? ` (free over ${formatPrice(m.freeOver)})` : ""}
            </li>
          ))}
        </ul>
        <p className="mt-3">Free returns within 30 days on unused items in original packaging.</p>
      </Item>
    </div>
  );
}
