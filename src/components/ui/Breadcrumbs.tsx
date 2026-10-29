import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail with matching BreadcrumbList structured data. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-fg-muted", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="underline-offset-4 hover:text-fg hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-fg")}>
                  {item.label}
                </span>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
          })),
        }}
      />
    </nav>
  );
}
