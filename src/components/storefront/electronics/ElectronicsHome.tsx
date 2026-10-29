import { ArrowRight, Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/commerce/SearchBar";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { RatingStars } from "@/components/ui/RatingStars";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { electronicsConfig } from "@/config/stores/electronics.config";
import { getCategory } from "@/data/categories";
import { getProductBySlug, getProductsBySlugs, summariesFor, toSummary } from "@/data/products";
import { productsInCategory } from "@/lib/collections";
import { formatPrice } from "@/lib/money";
import { categoryHref, productHref, searchHref } from "@/lib/routes";
import type { Product } from "@/types/catalog";
import { HeroBanner } from "../shared/HeroBanner";
import { NewsletterSection } from "../shared/NewsletterSection";
import { TestimonialCard } from "../shared/TestimonialCard";

const trustIcons = { truck: Truck, shield: ShieldCheck, rotate: RotateCcw, lock: Lock };

const specValue = (p: Product, label: string) => p.specifications?.flatMap((g) => g.items).find((i) => i.label === label)?.value ?? "—";

export function ElectronicsHome() {
  const config = electronicsConfig;
  const { home } = config;
  const all = summariesFor("electronics");
  const spotlight = getProductBySlug(home.hero.spotlight);
  const bestSellers = getProductsBySlugs(config.bestSellers).map(toSummary).slice(0, 8);
  const deals = getProductsBySlugs(home.deals.products).map(toSummary);
  const releases = productsInCategory(getCategory("new-releases")!, all);
  const compare = getProductsBySlugs(home.compare.products);
  const titles = Object.fromEntries(all.map((p) => [p.slug, p.title]));
  const categoryCount = (slug: string) => all.filter((p) => p.categories.includes(slug)).length;
  // Summary line derived from the catalogue's own rating data (no invented figures).
  const reviewTotal = all.reduce((n, p) => n + p.reviewCount, 0);
  const reviewAverage = all.reduce((n, p) => n + p.rating * p.reviewCount, 0) / Math.max(1, reviewTotal);

  const sections: Record<(typeof home.sections)[number], React.ReactNode> = {
    hero: (
      <section key="hero" className="page pt-8 pb-12 md:pt-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex min-w-0 flex-col justify-center rounded-card border border-line bg-surface p-5 sm:p-10 lg:col-span-7 lg:p-14">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-fg-muted">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              {home.hero.eyebrow}
            </p>
            <h1 className="heading mt-6 text-[clamp(2.4rem,4.8vw,4.25rem)] leading-[1.02]">{home.hero.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">{home.hero.body}</p>
            <SearchBar store="electronics" placeholder={config.search.placeholder} popular={config.search.popular} variant="hero" className="mt-8 max-w-xl" />
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-fg-muted">Popular:</span>
              {home.hero.popularSearches.map((t) => (
                <Link key={t} href={searchHref(t)} className="rounded-full border border-line px-3 py-1 text-[0.8125rem] transition-colors hover:border-fg">
                  {t}
                </Link>
              ))}
            </div>
          </div>
          {spotlight && (
            <div className="relative flex min-h-[30rem] flex-col overflow-hidden rounded-card bg-[#14171c] text-white lg:col-span-5">
              <Image src={home.hero.image} alt={home.hero.imageAlt} fill preload sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              <div className="relative mt-auto bg-gradient-to-t from-black/85 via-black/55 to-transparent p-6 pt-24 sm:p-8 sm:pt-28">
                <p className="text-xs font-medium tracking-wide text-white/70 uppercase">Spotlight</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{spotlight.title}</p>
                <p className="mt-1 text-sm text-white/75">{spotlight.subtitle}</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-white/80">
                    From <span className="text-lg font-semibold text-white">{formatPrice(spotlight.price)}</span>
                  </p>
                  <ButtonLink href={productHref(spotlight.slug)} variant="inverse" size="sm">
                    Shop now <ArrowRight className="size-4" aria-hidden />
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    ),
    trust: (
      <section key="trust" aria-label="Why shop with us" className="page pb-16">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-4">
          {home.trust.map((t) => {
            const Icon = trustIcons[t.icon];
            return (
              <li key={t.title} className="flex items-center gap-3 bg-surface p-4 sm:p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.title}</span>
                  <span className="block text-xs text-fg-muted">{t.body}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    ),
    categories: (
      <section key="categories" className="page pb-20" aria-labelledby="el-cat-title">
        <SectionHeading id="el-cat-title" title="Shop by category" action={{ label: "All products", href: categoryHref("shop-electronics") }} titleClassName="text-2xl md:text-3xl" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {config.categories
            .map((slug) => getCategory(slug))
            .filter((c) => c && !c.rule)
            .map((c) => (
              <li key={c!.slug}>
                <Link href={categoryHref(c!.slug)} className="group block rounded-card border border-line bg-surface p-3 transition hover:-translate-y-0.5 hover:border-fg/30 hover:shadow-[0_14px_30px_-20px_rgb(0_0_0/0.35)]">
                  <span className="relative block aspect-square overflow-hidden rounded-[calc(var(--r-card)-4px)] bg-muted">
                    <Image src={c!.image} alt="" fill sizes="(min-width: 1024px) 13vw, 45vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </span>
                  <span className="mt-3 block text-sm font-semibold">{c!.name}</span>
                  <span className="block text-xs text-fg-muted">{categoryCount(c!.slug)} products</span>
                </Link>
              </li>
            ))}
        </ul>
      </section>
    ),
    bestSellers: (
      <section key="bestSellers" className="page pb-20" aria-labelledby="el-best-title">
        <SectionHeading id="el-best-title" eyebrow="Top rated by customers" title="Best-selling gadgets" action={{ label: "View all", href: categoryHref("shop-electronics") }} />
        <ProductGrid products={bestSellers} card={config.productCard} />
      </section>
    ),
    deals: (
      <section key="deals" className="mb-20 bg-[#101318] py-16 text-white md:py-20" aria-labelledby="el-deals-title">
        <div className="page">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#ff8a7a] uppercase">Limited time</p>
              <h2 id="el-deals-title" className="heading mt-2 text-3xl md:text-4xl">
                {home.deals.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm text-white/70">{home.deals.body}</p>
            </div>
            <Link href={categoryHref("deals")} className="inline-flex items-center gap-2 text-sm font-medium text-white underline-offset-4 hover:underline">
              See all deals <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="text-fg">
            <ProductCarousel products={deals} card={config.productCard} label="Deals" className="[&_button[aria-label^='Previous']]:border-white/20 [&_button[aria-label^='Next']]:border-white/20" />
          </div>
        </div>
      </section>
    ),
    newReleases: (
      <section key="newReleases" className="page pb-20" aria-labelledby="el-new-title">
        <SectionHeading id="el-new-title" eyebrow="Just landed" title="New releases" action={{ label: "All new releases", href: categoryHref("new-releases") }} className="md:mb-0" />
        <ProductCarousel products={releases} card={config.productCard} label="New releases" />
      </section>
    ),
    brands: (
      <section key="brands" className="page pb-20" aria-labelledby="el-brands-title">
        <SectionHeading id="el-brands-title" title="Featured brands" titleClassName="text-2xl md:text-3xl" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {home.brands.map((b) => (
            <li key={b.name}>
              <Link href={b.href} className="flex h-28 flex-col items-center justify-center rounded-card border border-line bg-surface px-3 text-center transition hover:border-fg/40">
                <span className="text-xl font-bold tracking-[-0.03em]">{b.name}</span>
                <span className="mt-1 text-xs text-fg-muted">{b.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    ),
    compare: (
      <section key="compare" className="page pb-20" aria-labelledby="el-compare-title">
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="p-6 sm:p-10 lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">{home.compare.eyebrow}</p>
              <h2 id="el-compare-title" className="heading mt-3 text-3xl md:text-4xl">
                {home.compare.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{home.compare.body}</p>
              <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[calc(var(--r-card)-4px)] bg-muted">
                <Image src={home.compare.image} alt={home.compare.imageAlt} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
              </div>
            </div>
            <div className="relative overflow-x-auto border-t border-line lg:col-span-8 lg:border-t-0 lg:border-l">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <caption className="sr-only">Specification comparison</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="w-36 p-5 text-xs font-medium text-fg-muted">
                      Model
                    </th>
                    {compare.map((p) => (
                      <th key={p.id} scope="col" className="p-5 align-bottom">
                        <Link href={productHref(p.slug)} className="font-semibold hover:underline">
                          {p.title}
                        </Link>
                        <div className="mt-1 font-normal">
                          <PriceDisplay price={p.price} originalPrice={p.originalPrice} size="sm" />
                        </div>
                        <div className="mt-1 font-normal">
                          <RatingStars rating={p.rating} count={p.reviewCount} size={11} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {home.compare.rows.map((row) => (
                    <tr key={row.key} className="border-b border-line last:border-0">
                      <th scope="row" className="p-5 text-xs font-medium text-fg-muted">
                        {row.label}
                      </th>
                      {compare.map((p) => (
                        <td key={p.id} className="p-5 align-top leading-relaxed">
                          {specValue(p, row.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td />
                    {compare.map((p) => (
                      <td key={p.id} className="p-5">
                        <ButtonLink href={productHref(p.slug)} size="sm" variant="outline">
                          View details
                        </ButtonLink>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <HeroBanner
          eyebrow={home.promo.eyebrow}
          title={home.promo.title}
          body={home.promo.body}
          image={home.promo.image}
          imageAlt={home.promo.imageAlt}
          cta={home.promo.cta}
          className="mt-6 h-[22rem] rounded-card md:h-[24rem] [&_.page]:px-6 sm:[&_.page]:px-10"
          imageClassName="object-[70%_50%]"
        />
      </section>
    ),
    reviews: (
      <section key="reviews" className="page pb-20" aria-labelledby="el-rev-title">
        <SectionHeading id="el-rev-title" eyebrow={`${reviewAverage.toFixed(1)} average from ${reviewTotal.toLocaleString("en-US")} product reviews`} title="What customers say" titleClassName="text-2xl md:text-3xl" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {home.testimonials.map((t) => (
            <TestimonialCard key={t.author} t={t} productTitle={t.product ? titles[t.product] : undefined} />
          ))}
        </div>
      </section>
    ),
    newsletter: (
      <div key="newsletter" className="page pb-20">
        <NewsletterSection store="electronics" title={config.newsletter.title} body={config.newsletter.body} align="split" className="rounded-card border border-line bg-surface px-2 py-12 md:px-6 md:py-14" />
      </div>
    ),
  };

  return <>{home.sections.map((id) => sections[id])}</>;
}
