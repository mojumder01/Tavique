"use client";

import { Clock, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { useDebounced } from "@/hooks/useDebounced";
import { formatPrice } from "@/lib/money";
import { categoryHref, productHref, searchHref } from "@/lib/routes";
import { suggest } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useHistory } from "@/store/history";
import { useHydrated } from "@/store/hydration";
import type { StoreId } from "@/types/catalog";

interface Option {
  id: string;
  href: string;
  label: string;
  kind: "product" | "category" | "brand" | "recent" | "popular" | "all";
  meta?: string;
  image?: string;
}

interface Props {
  store: StoreId;
  placeholder: string;
  popular: string[];
  autoFocus?: boolean;
  onNavigate?: () => void;
  variant?: "header" | "overlay" | "hero";
  className?: string;
}

/**
 * Search combobox: debounced suggestions (products, categories, brands), recent and popular
 * searches, full keyboard support via aria-activedescendant, and submit → /search?q=.
 */
export function SearchBar({ store, placeholder, popular, autoFocus, onNavigate, variant = "header", className }: Props) {
  const router = useRouter();
  const { products, categories } = useCatalog();
  const hydrated = useHydrated();
  const recent = useHistory((s) => s.searches);
  const addSearch = useHistory((s) => s.addSearch);
  const clearSearches = useHistory((s) => s.clearSearches);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounced(query, 140);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Suggest from the current storefront first; other storefronts still appear on the results page.
  const pool = useMemo(() => products.filter((p) => p.niche === store), [products, store]);
  const storeCategories = useMemo(() => categories.filter((c) => c.niche === store), [categories, store]);

  const options: Option[] = useMemo(() => {
    const q = debounced.trim();
    if (!q) {
      const recentOpts: Option[] = (hydrated ? recent : []).map((t) => ({ id: `r-${t}`, href: searchHref(t), label: t, kind: "recent" }));
      const popularOpts: Option[] = popular.filter((p) => !recent.includes(p)).map((t) => ({ id: `p-${t}`, href: searchHref(t), label: t, kind: "popular" }));
      return [...recentOpts, ...popularOpts];
    }
    const s = suggest(q, pool, storeCategories, 5);
    return [
      ...s.products.map((p) => ({ id: `pr-${p.id}`, href: productHref(p.slug), label: p.title, kind: "product" as const, meta: `${p.brand} · ${formatPrice(p.price)}`, image: p.images[0]?.src })),
      ...s.categories.map((c) => ({ id: `c-${c.slug}`, href: categoryHref(c.slug), label: c.name, kind: "category" as const, meta: "Category" })),
      ...s.brands.map((b) => ({ id: `b-${b}`, href: `${searchHref(b)}`, label: b, kind: "brand" as const, meta: "Brand" })),
      { id: "all", href: searchHref(q), label: `See all results for “${q}”`, kind: "all" as const },
    ];
  }, [debounced, pool, storeCategories, popular, recent, hydrated]);

  const go = (href: string, term?: string) => {
    if (term) addSearch(term);
    setOpen(false);
    setActive(-1);
    onNavigate?.();
    router.push(href);
  };

  const submit = () => {
    const q = query.trim();
    if (!q) return inputRef.current?.focus();
    go(searchHref(q), q);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[active];
      if (open && opt) go(opt.href, opt.kind === "recent" || opt.kind === "popular" ? opt.label : opt.kind === "all" ? query.trim() : undefined);
      else submit();
    } else if (e.key === "Escape") {
      if (query) setQuery("");
      else setOpen(false);
    }
  };

  const showList = open && options.length > 0;
  const hasQuery = debounced.trim().length > 0;
  const noResults = hasQuery && options.length === 1;

  return (
    <div className={cn("relative", className)}>
      <form
        role="search"
        aria-label={variant === "hero" ? "Product search" : variant === "overlay" ? "Search the store" : "Site search"}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={cn(
          "flex items-center gap-2 border border-line bg-surface transition-colors focus-within:border-fg",
          variant === "hero" ? "h-14 rounded-btn pr-1.5 pl-5 shadow-sm" : variant === "overlay" ? "h-14 rounded-input px-4" : "h-11 rounded-input px-3.5",
        )}
      >
        <Search className="size-[1.1rem] shrink-0 text-fg-muted" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 && options[active] ? `${listId}-${active}` : undefined}
          aria-label="Search products"
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-[0.9375rem] text-fg placeholder:text-fg-muted/80 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => (setQuery(""), inputRef.current?.focus())} className="rounded-full p-1 text-fg-muted hover:bg-muted hover:text-fg" aria-label="Clear search">
            <X className="size-4" aria-hidden />
          </button>
        )}
        {variant === "hero" && (
          <button type="submit" className="btn-type inline-flex h-11 items-center rounded-btn bg-primary px-5 text-primary-fg hover:opacity-90">
            Search
          </button>
        )}
      </form>

      {showList && (
        <div className={cn("z-50 mt-2 overflow-hidden rounded-card border border-line bg-surface text-fg shadow-[0_20px_50px_-20px_rgb(0_0_0/0.3)]", variant === "overlay" ? "relative" : "absolute inset-x-0 top-full")}>
          {!hasQuery && (
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <p className="eyebrow">{hydrated && recent.length ? "Recent & popular" : "Popular searches"}</p>
              {hydrated && recent.length > 0 && (
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={clearSearches} className="text-xs text-fg-muted underline underline-offset-4 hover:text-fg">
                  Clear recent
                </button>
              )}
            </div>
          )}
          <ul id={listId} role="listbox" aria-label="Search suggestions" className="max-h-[60vh] overflow-y-auto p-1.5">
            {options.map((opt, i) => (
              <li
                key={opt.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(opt.href, opt.kind === "recent" || opt.kind === "popular" ? opt.label : opt.kind === "all" ? query.trim() : undefined)}
                className={cn("flex cursor-pointer items-center gap-3 rounded-input px-2.5 py-2 text-sm", i === active && "bg-muted", opt.kind === "all" && "mt-1 border-t border-line pt-3 font-medium")}
              >
                {opt.kind === "product" && opt.image ? (
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-[calc(var(--r-card)/2)] bg-muted">
                    <Image src={opt.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                ) : opt.kind === "recent" ? (
                  <Clock className="size-4 shrink-0 text-fg-muted" aria-hidden />
                ) : opt.kind !== "all" ? (
                  <Search className="size-4 shrink-0 text-fg-muted" aria-hidden />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{opt.label}</span>
                  {opt.meta && <span className="block truncate text-xs text-fg-muted">{opt.meta}</span>}
                </span>
              </li>
            ))}
          </ul>
          {noResults && <p className="px-4 pb-3 text-sm text-fg-muted">No quick matches — press Enter to search everything.</p>}
        </div>
      )}
    </div>
  );
}
