"use client";

import { ChevronDown, Star } from "lucide-react";
import { useId, useState } from "react";
import { facetValues, inStockCount, priceBounds, type FilterState } from "@/lib/filters";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/catalog";
import type { FilterKey } from "@/types/store";

interface Props {
  items: ProductSummary[];
  state: FilterState;
  facets: readonly FilterKey[];
  labels: Record<string, string>;
  categoryNames: Record<string, string>;
  onChange: (next: FilterState) => void;
}

const defaultLabels: Record<string, string> = { category: "Category", brand: "Brand", price: "Price", rating: "Rating", availability: "Availability" };

function Section({ title, count, children, defaultOpen = true }: { title: string; count?: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line py-4">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left text-sm font-medium">
          <span>
            {title}
            {count ? <span className="ml-1.5 text-fg-muted">({count})</span> : null}
          </span>
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pt-3">
        {children}
      </div>
    </div>
  );
}

function CheckList({ name, values, selected, onToggle, swatches }: { name: string; values: { value: string; label: string; count: number; swatch?: string }[]; selected: string[]; onToggle: (v: string) => void; swatches?: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? values : values.slice(0, 8);
  if (!values.length) return <p className="text-sm text-fg-muted">No options for the current results.</p>;
  return (
    <fieldset>
      <legend className="sr-only">{name}</legend>
      <ul className={cn("space-y-2", swatches && "grid grid-cols-2 gap-x-3 space-y-0 gap-y-2")}>
        {visible.map((v) => {
          const checked = selected.includes(v.value);
          return (
            <li key={v.value}>
              <label className={cn("flex items-center gap-2.5 text-sm", v.count === 0 && !checked && "opacity-50")}>
                <input type="checkbox" checked={checked} onChange={() => onToggle(v.value)} className="size-4 shrink-0 accent-[var(--c-primary)]" />
                {swatches && v.swatch && <span aria-hidden className="size-4 shrink-0 rounded-full border border-black/15" style={{ background: v.swatch }} />}
                <span className="min-w-0 flex-1 truncate">{v.label}</span>
                <span className="text-xs text-fg-muted tabular-nums">{v.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {values.length > 8 && (
        <button type="button" onClick={() => setShowAll((s) => !s)} className="mt-3 text-xs font-medium underline underline-offset-4">
          {showAll ? "Show fewer" : `Show all ${values.length}`}
        </button>
      )}
    </fieldset>
  );
}

export function PriceRangeFilter({ items, value, onChange }: { items: ProductSummary[]; value: FilterState["price"]; onChange: (v: FilterState["price"]) => void }) {
  const bounds = priceBounds(items);
  const [min, setMin] = useState(value.min?.toString() ?? "");
  const [max, setMax] = useState(value.max?.toString() ?? "");
  const id = useId();
  // Quick "Under $X" chips at roughly a third and two thirds of this listing's price range.
  const nice = (v: number) => {
    const unit = v >= 1000 ? 250 : v >= 200 ? 50 : 10;
    return Math.max(unit, Math.round(v / unit) * unit);
  };
  const presets = [...new Set([0.34, 0.67].map((t) => nice(bounds.min + (bounds.max - bounds.min) * t)))].filter((p) => p > bounds.min && p < bounds.max);
  const apply = () => {
    const lo = min === "" ? undefined : Math.max(0, Number(min));
    const hi = max === "" ? undefined : Math.max(0, Number(max));
    onChange(lo != null && hi != null && lo > hi ? { min: hi, max: lo } : { min: lo, max: hi });
  };
  return (
    <div>
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        <label className="flex-1 text-xs text-fg-muted" htmlFor={`${id}-min`}>
          Min
          <input id={`${id}-min`} type="number" inputMode="numeric" min={0} placeholder={String(bounds.min)} value={min} onChange={(e) => setMin(e.target.value)} onBlur={apply} className="mt-1 h-9 w-full rounded-input border border-line bg-surface px-2.5 text-sm text-fg" />
        </label>
        <span className="pb-2 text-fg-muted" aria-hidden>
          –
        </span>
        <label className="flex-1 text-xs text-fg-muted" htmlFor={`${id}-max`}>
          Max
          <input id={`${id}-max`} type="number" inputMode="numeric" min={0} placeholder={String(bounds.max)} value={max} onChange={(e) => setMax(e.target.value)} onBlur={apply} className="mt-1 h-9 w-full rounded-input border border-line bg-surface px-2.5 text-sm text-fg" />
        </label>
      </form>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button key={p} type="button" onClick={() => onChange({ max: p })} aria-pressed={value.max === p && value.min == null} className={cn("rounded-full border px-2.5 py-1 text-xs", value.max === p && value.min == null ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}>
            Under {formatPrice(p)}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Facet sidebar. Every control writes back to FilterState, which the listing syncs to the URL. */
export function ProductFilters({ items, state, facets, labels, categoryNames, onChange }: Props) {
  const label = (k: string) => labels[k] ?? defaultLabels[k] ?? k;
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div>
      {facets.map((key) => {
        if (key === "price")
          return (
            <Section key={key} title={label(key)} count={state.price.min != null || state.price.max != null ? 1 : 0}>
              <PriceRangeFilter key={`${state.price.min ?? ""}-${state.price.max ?? ""}`} items={items} value={state.price} onChange={(price) => onChange({ ...state, price })} />
            </Section>
          );
        if (key === "rating")
          return (
            <Section key={key} title={label(key)} count={state.rating ? 1 : 0} defaultOpen={false}>
              <fieldset>
                <legend className="sr-only">Minimum rating</legend>
                <div className="space-y-2">
                  {[4.5, 4, 3].map((r) => (
                    <label key={r} className="flex items-center gap-2.5 text-sm">
                      <input type="radio" name="rating" checked={state.rating === r} onChange={() => onChange({ ...state, rating: r })} className="size-4 accent-[var(--c-primary)]" />
                      <Star className="size-3.5 fill-current" aria-hidden /> {r} & up
                    </label>
                  ))}
                  {state.rating && (
                    <button type="button" onClick={() => onChange({ ...state, rating: undefined })} className="text-xs underline underline-offset-4">
                      Any rating
                    </button>
                  )}
                </div>
              </fieldset>
            </Section>
          );
        if (key === "availability")
          return (
            <Section key={key} title={label(key)} count={state.inStock ? 1 : 0} defaultOpen={false}>
              <label className="flex items-center gap-2.5 text-sm">
                <input type="checkbox" checked={state.inStock} onChange={(e) => onChange({ ...state, inStock: e.target.checked })} className="size-4 accent-[var(--c-primary)]" />
                <span className="flex-1">In stock only</span>
                <span className="text-xs text-fg-muted tabular-nums">{inStockCount(items, state)}</span>
              </label>
            </Section>
          );

        const values = facetValues(items, state, key, categoryNames);
        if (key === "category") {
          if (values.length < 2 && !state.categories.length) return null;
          return (
            <Section key={key} title={label(key)} count={state.categories.length}>
              <CheckList name={label(key)} values={values} selected={state.categories} onToggle={(v) => onChange({ ...state, categories: toggle(state.categories, v) })} />
            </Section>
          );
        }
        if (key === "brand") {
          if (values.length < 2 && !state.brands.length) return null;
          return (
            <Section key={key} title={label(key)} count={state.brands.length}>
              <CheckList name={label(key)} values={values} selected={state.brands} onToggle={(v) => onChange({ ...state, brands: toggle(state.brands, v) })} />
            </Section>
          );
        }
        const [kind, name = ""] = key.split(":");
        const bucket = kind === "option" ? state.options : state.attrs;
        const selected = bucket[name] ?? [];
        if (!values.length && !selected.length) return null;
        return (
          <Section key={key} title={label(key)} count={selected.length} defaultOpen={selected.length > 0 || facets.indexOf(key) < 5}>
            <CheckList
              name={label(key)}
              values={values}
              selected={selected}
              swatches={values.some((v) => v.swatch)}
              onToggle={(v) => {
                const nextValues = toggle(selected, v);
                const next = { ...bucket, [name]: nextValues };
                if (!nextValues.length) delete next[name];
                onChange(kind === "option" ? { ...state, options: next } : { ...state, attrs: next });
              }}
            />
          </Section>
        );
      })}
    </div>
  );
}
