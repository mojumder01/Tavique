import { ArrowUpRight, Compass } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { enabledStores, storeConfigs } from "@/config/stores";
import { siteConfig } from "@/config/site.config";
import { storeHome } from "@/lib/routes";

/**
 * Global 404. Deliberately neutral and static: reading the storefront cookie here would make
 * every route in the app render dynamically, because this boundary is part of each route's tree.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="page flex h-20 items-center">
        <Link href="/" className="font-display text-3xl tracking-tight">
          {siteConfig.name}
        </Link>
      </header>
      <main id="main" className="page flex flex-1 flex-col items-center justify-center py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-fg-muted">
          <Compass className="size-6" aria-hidden />
        </span>
        <p className="eyebrow mt-6">Error 404</p>
        <h1 className="heading mt-3 text-4xl md:text-6xl">This page has wandered off</h1>
        <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-fg-muted">The page you&apos;re looking for doesn&apos;t exist or has moved. Pick a storefront or search the catalogue.</p>
        <ul className="mt-10 grid grid-cols-1 w-full max-w-2xl gap-3 sm:grid-cols-3">
          {enabledStores.map((id) => (
            <li key={id}>
              <Link href={storeHome(id)} className="flex items-center justify-between rounded-card border border-line bg-surface px-4 py-4 text-left text-sm transition-colors hover:border-fg">
                {storeConfigs[id].label}
                <ArrowUpRight className="size-4 shrink-0" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href="/search" variant="outline" className="mt-8">
          Search products
        </ButtonLink>
      </main>
    </div>
  );
}
