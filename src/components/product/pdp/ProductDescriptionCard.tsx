import { CheckCircle2 } from "lucide-react";
import type { Product } from "@/types/catalog";

/** Left-column card: full description, highlights and niche-specific key facts. */
export function ProductDescriptionCard({ product }: { product: Product }) {
  const { fashion, electronics, beauty } = product;
  const facts: { label: string; value: string }[] = fashion
    ? [
        { label: "Material", value: fashion.material },
        { label: "Fit", value: fashion.fit },
        ...(fashion.origin ? [{ label: "Origin", value: fashion.origin }] : []),
      ]
    : electronics
      ? [{ label: "Warranty", value: electronics.warranty }]
      : beauty
        ? [
            { label: "Suitable for", value: beauty.suitableFor.join(", ") },
            ...(product.attributes?.formulation?.length ? [{ label: "Formulation", value: product.attributes.formulation.join(" · ") }] : []),
          ]
        : [];
  const chips = electronics?.keySpecs ?? beauty?.keyIngredients.map((k) => k.name) ?? [];

  return (
    <section aria-labelledby="description-title" className="rounded-card border border-line bg-surface p-6 md:p-8">
      <h2 id="description-title" className="heading text-2xl md:text-3xl">
        Description
      </h2>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">{product.description}</p>

      {chips.length > 0 && (
        <div className="mt-5">
          <p className="sr-only">{electronics ? "Key specs" : "Key ingredients"}</p>
          <ul className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <li key={c} className="rounded-full border border-line bg-bg px-3 py-1 text-xs">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.highlights && product.highlights.length > 0 && (
        <>
          <h3 className="mt-7 text-sm font-semibold">Highlights</h3>
          <ul className="mt-3 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </>
      )}

      {facts.length > 0 && (
        <dl className="mt-7 grid gap-x-6 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-semibold tracking-[0.12em] uppercase">{f.label}</dt>
              <dd className="mt-1 leading-relaxed text-fg-muted">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
