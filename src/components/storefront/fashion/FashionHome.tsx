import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fashionConfig } from "@/config/stores/fashion.config";
import { getCategory } from "@/data/categories";
import { getProductsBySlugs, summariesFor, toSummary } from "@/data/products";
import { productsInCategory } from "@/lib/collections";
import { categoryHref } from "@/lib/routes";
import { CategoryTile } from "../shared/CategoryTile";
import { HeroBanner } from "../shared/HeroBanner";
import { Marquee } from "../shared/Marquee";
import { NewsletterSection } from "../shared/NewsletterSection";
import { TestimonialCard } from "../shared/TestimonialCard";

export function FashionHome() {
  const config = fashionConfig;
  const { home } = config;
  const all = summariesFor("fashion");
  const newest = productsInCategory(getCategory("new-arrivals")!, all);
  const bestSellers = getProductsBySlugs(config.bestSellers).map(toSummary).slice(0, 4);
  const featured = getProductsBySlugs(home.featuredCollection.products).map(toSummary);
  const titles = Object.fromEntries(all.map((p) => [p.slug, p.title]));

  const sections: Record<(typeof home.sections)[number], React.ReactNode> = {
    hero: (
      <section key="hero" className="page pt-6 pb-16 md:pt-10 md:pb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-muted lg:col-span-6 lg:aspect-auto lg:min-h-[44rem]">
            <Image src={home.hero.image} alt={home.hero.imageAlt} fill preload sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center lg:col-span-6">
            <span aria-hidden className="mb-8 block h-px w-24 bg-fg/40" />
            <p className="eyebrow">{home.hero.eyebrow}</p>
            <h1 className="heading mt-5 text-[clamp(2.9rem,6.4vw,6.25rem)] leading-[0.98]">{home.hero.title}</h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted">{home.hero.body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={home.hero.cta.href} size="lg">
                {home.hero.cta.label} <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              {home.hero.secondaryCta && (
                <ButtonLink href={home.hero.secondaryCta.href} size="lg" variant="outline">
                  {home.hero.secondaryCta.label}
                </ButtonLink>
              )}
            </div>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {home.hero.highlights.map((h, i) => (
                <div key={h.title} className="grid grid-cols-[7.5rem_1fr] overflow-hidden rounded-card border border-line bg-surface">
                  <div className="relative min-h-36 bg-muted">
                    <Image src={h.image} alt={h.imageAlt} fill sizes="120px" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-accent tabular-nums">0{i + 1}</p>
                    <p className="heading mt-2 text-lg">{h.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{h.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    categories: (
      <section key="categories" className="page pb-20 md:pb-28" aria-labelledby="fa-cat-title">
        <SectionHeading id="fa-cat-title" eyebrow="Shop by category" title="Find your next essential" action={{ label: "Shop all", href: categoryHref("shop-fashion") }} />
        <ul className="relative no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:px-0">
          {home.categoryTiles.map((slug) => {
            const c = getCategory(slug);
            if (!c) return null;
            return (
              <li key={slug} className="reveal w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-auto">
                <CategoryTile href={categoryHref(slug)} name={c.name} image={c.image} />
              </li>
            );
          })}
        </ul>
      </section>
    ),
    newArrivals: (
      <section key="newArrivals" className="page pb-20 md:pb-28" aria-labelledby="fa-new-title">
        <SectionHeading id="fa-new-title" eyebrow="Just in" title="New arrivals" description="Fresh silhouettes and seasonal colour, in small runs." action={{ label: "View all", href: categoryHref("new-arrivals") }} className="md:mb-0" />
        <ProductCarousel products={newest} card={config.productCard} label="New arrivals" />
      </section>
    ),
    marquee: <Marquee key="marquee" items={home.marquee} className="mb-20 md:mb-28" />,
    bestSellers: (
      <section key="bestSellers" className="page pb-20 md:pb-28" aria-labelledby="fa-best-title">
        <SectionHeading id="fa-best-title" eyebrow="Most loved" title="Best sellers" align="center" />
        <ProductGrid products={bestSellers} card={config.productCard} />
        <div className="mt-12 flex justify-center">
          <ButtonLink href={categoryHref("shop-fashion")} variant="outline">
            Shop all best sellers
          </ButtonLink>
        </div>
      </section>
    ),
    featuredCollection: (
      <section key="featuredCollection" className="bg-surface py-20 md:py-28" aria-labelledby="fa-feat-title">
        <div className="page grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-card bg-muted lg:col-span-6">
            <Image src={home.featuredCollection.image} alt={home.featuredCollection.imageAlt} fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="eyebrow">{home.featuredCollection.eyebrow}</p>
            <h2 id="fa-feat-title" className="heading mt-4 text-5xl md:text-6xl">
              {home.featuredCollection.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-fg-muted">{home.featuredCollection.body}</p>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8">
              {featured.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} style="editorial" aspect="3/4" sizes="(min-width: 1024px) 22vw, 45vw" className="w-full" />
                </li>
              ))}
            </ul>
            <ButtonLink href={home.featuredCollection.cta.href} className="mt-10 self-start" variant="outline">
              {home.featuredCollection.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="page py-20 md:py-32" aria-labelledby="fa-story-title">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:col-start-2">
            <p className="eyebrow">{home.story.eyebrow}</p>
            <h2 id="fa-story-title" className="heading mt-4 text-5xl italic md:text-6xl">
              {home.story.title}
            </h2>
            {home.story.body.map((p) => (
              <p key={p.slice(0, 20)} className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted">
                {p}
              </p>
            ))}
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {home.story.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="heading block text-4xl">{s.value}</span>
                    <span className="mt-1 block text-xs tracking-wide text-fg-muted">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <ButtonLink href={home.story.cta.href} variant="link" className="mt-8">
              {home.story.cta.label}
            </ButtonLink>
          </div>
          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-card bg-muted lg:col-span-5 lg:col-start-8">
            <Image src={home.story.image} alt={home.story.imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
    ),
    campaign: (
      <HeroBanner
        key="campaign"
        eyebrow={home.campaign.eyebrow}
        title={home.campaign.title}
        body={home.campaign.body}
        image={home.campaign.image}
        imageAlt={home.campaign.imageAlt}
        cta={home.campaign.cta}
        className="h-[34rem] md:h-[40rem]"
      />
    ),
    reviews: (
      <section key="reviews" className="page py-20 md:py-28" aria-labelledby="fa-rev-title">
        <SectionHeading id="fa-rev-title" eyebrow="In their words" title="Worn and loved" align="center" />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
          {home.testimonials.map((t) => (
            <div key={t.author} className="reveal border-t border-line pt-8">
              <TestimonialCard t={t} variant="quote" productTitle={t.product ? titles[t.product] : undefined} />
            </div>
          ))}
        </div>
      </section>
    ),
    newsletter: <NewsletterSection key="newsletter" store="fashion" title={config.newsletter.title} body={config.newsletter.body} className="border-t border-line bg-muted/60" />,
  };

  return <>{home.sections.map((id) => sections[id])}</>;
}
