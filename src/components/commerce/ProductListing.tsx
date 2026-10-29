"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { activeFilterCount, applyFilters, emptyFilters, parseFilters, serializeFilters, SORT_OPTIONS, type FilterState, type SortKey } from "@/lib/filters";
import { formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/catalog";
import type { FilterKey, StoreConfig } from "@/types/store";
import { ProductFilters } from "./ProductFilters";

interface Props {
  items: ProductSummary[];
  facets: readonly FilterKey[];
  labels: Record<string, string>;
  categoryNames: Record<string, string>;
  card: StoreConfig["productCard"];
  pageSize?: number;
  emptyHref: string;
  emptyLabel?: string;
  /** Keep the incoming order (e.g. search relevance) for the default sort. */
  relevance?: boolean;
}

export function SortDropdown({ value, onChange, defaultLabel }: { value: SortKey; onChange: (v: SortKey) => void; defaultLabel?: string }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-fg-muted sm:inline">Sort by</span>
      <span className="sr-only sm:hidden">Sort by</span>
      <span className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value as SortKey)} className="h-10 appearance-none rounded-input border border-line bg-surface pr-9 pl-3 text-sm text-fg hover:border-fg/50">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value === "featured" && defaultLabel ? defaultLabel : o.label}
            </option>
          ))}
        </select>
        <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-fg-muted">
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
    </label>
  );
}

/** Filterable, sortable, paginated product listing. All state lives in the URL so views can be shared. */
export function ProductListing({ items, facets, labels, categoryNames, card, pageSize = 12, emptyHref, emptyLabel = "Browse everything", relevance = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState(false);

  const urlState = useMemo(() => parseFilters(new URLSearchParams(params.toString()), facets), [params, facets]);
  const urlPage = Math.max(1, Number(params.get("page")) || 1);
  // The URL is the source of truth; the optimistic copy makes controls respond before navigation settles.
  const [{ state, page }, setOptimistic] = useOptimistic({ state: urlState, page: urlPage });
  const results = useMemo(() => {
    const filtered = applyFilters(items, state);
    if (!relevance || state.sort !== "featured") return filtered;
    const keep = new Set(filtered.map((p) => p.id));
    return items.filter((p) => keep.has(p.id));
  }, [items, state, relevance]);
  const visible = results.slice(0, page * pageSize);
  const active = activeFilterCount(state);

  const push = (next: FilterState, nextPage?: number) => {
    const sp = serializeFilters(next, new URLSearchParams(params.toString()));
    if (nextPage && nextPage > 1) sp.set("page", String(nextPage));
    const qs = sp.toString();
    startTransition(() => {
      setOptimistic({ state: next, page: nextPage ?? 1 });
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const chips: { label: string; remove: () => FilterState }[] = [];
  state.categories.forEach((c) => chips.push({ label: categoryNames[c] ?? c, remove: () => ({ ...state, categories: state.categories.filter((x) => x !== c) }) }));
  state.brands.forEach((b) => chips.push({ label: b, remove: () => ({ ...state, brands: state.brands.filter((x) => x !== b) }) }));
  if (state.price.min != null || state.price.max != null)
    chips.push({ label: state.price.min != null && state.price.max != null ? `${formatPrice(state.price.min)}–${formatPrice(state.price.max)}` : state.price.max != null ? `Under ${formatPrice(state.price.max)}` : `From ${formatPrice(state.price.min!)}`, remove: () => ({ ...state, price: {} }) });
  if (state.rating) chips.push({ label: `${state.rating}★ & up`, remove: () => ({ ...state, rating: undefined }) });
  if (state.inStock) chips.push({ label: "In stock", remove: () => ({ ...state, inStock: false }) });
  for (const [group, values] of Object.entries(state.options)) {
    for (const v of values) {
      const option = items.flatMap((p) => p.variants).find((g) => g.id === group)?.options.find((o) => o.value === v);
      chips.push({ label: option?.label.split(" — ")[0] ?? v, remove: () => ({ ...state, options: { ...state.options, [group]: values.filter((x) => x !== v) } }) });
    }
  }
  for (const [attr, values] of Object.entries(state.attrs)) values.forEach((v) => chips.push({ label: v, remove: () => ({ ...state, attrs: { ...state.attrs, [attr]: values.filter((x) => x !== v) } }) }));

  const clearAll = () => push({ ...emptyFilters(), sort: state.sort });
  const filters = <ProductFilters items={items} state={state} facets={facets} labels={labels} categoryNames={categoryNames} onChange={(next) => push(next)} />;

  return (
    <div className="lg:grid lg:grid-cols-[15.5rem_1fr] lg:gap-10 xl:grid-cols-[17rem_1fr]">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 pb-6">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="text-sm font-semibold">Filters</h2>
            {active > 0 && (
              <button type="button" onClick={clearAll} className="text-xs underline underline-offset-4">
                Clear all
              </button>
            )}
          </div>
          {filters}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-fg-muted" aria-live="polite">
            {results.length === 0 ? "No products" : `Showing ${visible.length} of ${results.length} ${results.length === 1 ? "product" : "products"}`}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setDrawer(true)} aria-haspopup="dialog">
              <SlidersHorizontal className="size-4" aria-hidden /> Filters{active ? ` (${active})` : ""}
            </Button>
            <SortDropdown value={state.sort} onChange={(sort) => push({ ...state, sort })} defaultLabel={relevance ? "Relevance" : undefined} />
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4" aria-label="Active filters">
            {chips.map((chip) => (
              <button key={chip.label} type="button" onClick={() => push(chip.remove())} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1.5 pr-2.5 pl-3 text-xs hover:border-fg">
                {chip.label}
                <X className="size-3" aria-hidden />
                <span className="sr-only">Remove filter</span>
              </button>
            ))}
            <button type="button" onClick={clearAll} className="ml-1 text-xs font-medium underline underline-offset-4">
              Clear all
            </button>
          </div>
        )}

        <div className={cn("pt-8 transition-opacity", pending && "opacity-60")}>
          {results.length === 0 ? (
            <EmptyState title="No products match" body="Try removing a filter or widening the price range.">
              {active > 0 && <Button onClick={clearAll}>Clear all filters</Button>}
              <ButtonLink href={emptyHref} variant="outline">
                {emptyLabel}
              </ButtonLink>
            </EmptyState>
          ) : (
            <>
              <ProductGrid products={visible} card={card} columns={3} priorityCount={3} />
              {visible.length < results.length && (
                <div className="mt-14 flex flex-col items-center gap-3">
                  <p className="text-xs text-fg-muted">
                    You&apos;ve viewed {visible.length} of {results.length}
                  </p>
                  <div className="h-0.5 w-48 overflow-hidden rounded-full bg-muted" aria-hidden>
                    <div className="h-full bg-fg" style={{ width: `${(visible.length / results.length) * 100}%` }} />
                  </div>
                  <Button variant="outline" onClick={() => push(state, page + 1)} loading={pending}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Filters"
        placement="left"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={clearAll} disabled={!active}>
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setDrawer(false)}>
              Show {results.length}
            </Button>
          </div>
        }
      >
        <div className="px-5 pb-6">{filters}</div>
      </Modal>
    </div>
  );
}
