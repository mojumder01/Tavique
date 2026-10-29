import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getStoreConfig } from "@/config/stores";
import { getCategory } from "@/data/categories";
import { categoryHref, storeHome } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/catalog";

/** Listing header: breadcrumbs, title, description, optional image and sibling-category chips. */
export function CategoryHeader({ category, count }: { category: Category; count: number }) {
  const config = getStoreConfig(category.niche);
  const siblings = config.categories.map((s) => getCategory(s)).filter((c): c is Category => Boolean(c));
  const withImage = config.productCard.style !== "tech";
  return (
    <header className="page pt-6 pb-8 md:pt-8">
      <Breadcrumbs items={[{ label: "Home", href: storeHome(category.niche) }, { label: category.name }]} />
      <div className={cn("mt-6 grid gap-8", withImage && "md:grid-cols-12 md:items-center")}>
        <div className={cn(withImage && "md:col-span-6 lg:col-span-5")}>
          <h1 className="heading text-4xl md:text-6xl">{category.name}</h1>
          <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted">{category.description}</p>
          <p className="mt-3 text-xs text-fg-muted">{count} products</p>
        </div>
        {withImage && (
          <div className="relative hidden aspect-[16/8] overflow-hidden rounded-card bg-muted md:col-span-6 md:block lg:col-span-7">
            <Image src={category.image} alt="" fill preload sizes="(min-width: 1024px) 55vw, 50vw" className="object-cover" />
          </div>
        )}
      </div>
      <nav aria-label={`${config.label} categories`} className="no-scrollbar -mx-4 mt-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          {siblings.map((c) => (
            <li key={c.slug}>
              <Link
                href={categoryHref(c.slug)}
                aria-current={c.slug === category.slug ? "page" : undefined}
                className={cn("inline-flex h-9 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors", c.slug === category.slug ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
