import { ArrowUpRight, Boxes, Gauge, Layers, Palette, Search, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { enabledStores, storeConfigs } from "@/config/stores";
import { siteConfig } from "@/config/site.config";
import { products } from "@/data/products";
import { storeHome } from "@/lib/routes";

const previews = {
  fashion: { image: "/images/fashion/hero.webp", note: "Editorial luxury — Bodoni & Jost, warm neutrals, campaign layouts." },
  electronics: { image: "/images/electronics/hero.webp", note: "Search-first and technical — Geist, graphite & blue, light/dark." },
  beauty: { image: "/images/beauty/hero.webp", note: "Soft and refined — Newsreader & Figtree, cream & blush, routines." },
} as const;

const features = [
  { icon: Layers, title: "17 routes, fully linked", body: "Storefronts, listings, product pages, search, cart, checkout, wishlist, account and content pages." },
  { icon: Search, title: "Search, filters & sorting", body: "Client-side search with suggestions; URL-synced filters, facets and load more." },
  { icon: ShoppingBag, title: "Cart that can't be tampered with", body: "Totals are re-priced from the catalogue on every render, with discount codes and shipping rules." },
  { icon: Boxes, title: "Variant-aware products", body: "Sizes, colours, storage and shades with per-option stock, prices and imagery." },
  { icon: Palette, title: "Config-driven theming", body: "Palette, fonts, radii, navigation and homepage sections live in one config file per store." },
  { icon: ShieldCheck, title: "Accessible by default", body: "Native dialogs, keyboard-friendly menus, visible focus, labelled controls and reduced-motion support." },
  { icon: Gauge, title: "Fast & SEO-ready", body: "Static product pages, optimised images, metadata, sitemap and Product/Breadcrumb structured data." },
  { icon: Sparkles, title: "Original demo artwork", body: "191 project-owned illustrations — ship them, recolour them or swap in your photography." },
];

export function Showcase() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="page flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-3xl tracking-tight">
          {siteConfig.name}
        </Link>
        <nav aria-label="Storefront demos">
          <ul className="flex items-center gap-1 text-sm">
            {enabledStores.map((id) => (
              <li key={id} className="hidden sm:block">
                <Link href={storeHome(id)} className="rounded-full px-3 py-2 hover:bg-muted">
                  {storeConfigs[id].label.split(" & ")[0]}
                </Link>
              </li>
            ))}
            <li>
              <Link href="#demos" className="ml-2 rounded-full bg-primary px-4 py-2 text-primary-fg hover:opacity-90">
                View demos
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main">
        <section className="page pt-12 pb-16 text-center md:pt-20 md:pb-24">
          <p className="eyebrow">Next.js · TypeScript · Tailwind CSS</p>
          <h1 className="heading mx-auto mt-6 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.98]">Three storefronts. One considered system.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
            {siteConfig.name} is a premium e-commerce template with distinct Fashion, Electronics and Beauty experiences — sharing one component library, one cart and {products.length} demo products.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="#demos" className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-medium text-primary-fg hover:opacity-90">
              Explore the storefronts
            </Link>
            <Link href={storeHome("fashion")} className="inline-flex h-12 items-center rounded-full border border-fg/70 px-7 text-sm font-medium hover:bg-fg hover:text-bg">
              Open Fashion demo
            </Link>
          </div>
        </section>

        <section id="demos" aria-label="Storefront demos" className="page scroll-mt-6 pb-24">
          <ul className="grid gap-6 lg:grid-cols-3">
            {enabledStores.map((id, i) => {
              const c = storeConfigs[id];
              return (
                <li key={id}>
                  <Link href={storeHome(id)} className="group block overflow-hidden rounded-card border border-line bg-surface">
                    <span className="relative block aspect-[4/5] overflow-hidden bg-muted">
                      <Image src={previews[id].image} alt={`${c.label} storefront preview`} fill preload={i === 0} sizes="(min-width: 1024px) 31vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    </span>
                    <span className="flex items-start justify-between gap-4 p-6">
                      <span>
                        <span className="heading block text-2xl">{c.label}</span>
                        <span className="mt-2 block text-sm leading-relaxed text-fg-muted">{previews[id].note}</span>
                      </span>
                      <ArrowUpRight className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="features-title" className="border-y border-line bg-surface py-20 md:py-28">
          <div className="page">
            <h2 id="features-title" className="heading max-w-2xl text-4xl md:text-5xl">
              Everything a real store needs — and honest about what&apos;s a demo.
            </h2>
            <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <li key={f.title}>
                  <f.icon className="size-6 text-accent" aria-hidden />
                  <h3 className="mt-4 font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="config-title" className="page grid gap-10 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="config-title" className="heading text-4xl md:text-5xl">
              Launch one storefront — or all three.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-fg-muted">
              Pick what the home page shows, which storefronts are live, and edit brand colours, fonts, navigation and homepage sections from typed config files. No component rewrites required.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-card bg-[#1d1b19] p-6 font-mono text-[13px] leading-relaxed text-[#ece6dd]">
            <code>{`// src/config/site.config.ts
export const siteConfig = {
  name: "Tavique",
  home: "fashion",          // or "electronics" | "beauty" | "showcase"
  enabledStores: ["fashion"],
  showStoreSwitcher: false,
  currency: "USD",
};`}</code>
          </pre>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="page flex flex-col gap-2 py-8 text-sm text-fg-muted sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Demo content — no real orders or payments are processed.
          </p>
          <p>
            <Link href="/about" className="underline-offset-4 hover:underline">
              About
            </Link>{" "}
            ·{" "}
            <Link href="/faq" className="underline-offset-4 hover:underline">
              FAQ
            </Link>{" "}
            ·{" "}
            <Link href="/contact" className="underline-offset-4 hover:underline">
              Contact
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
