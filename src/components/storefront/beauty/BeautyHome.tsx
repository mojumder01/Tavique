import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { beautyConfig } from "@/config/stores/beauty.config";
import { getProductsBySlugs, summariesFor, toSummary } from "@/data/products";
import { categoryHref } from "@/lib/routes";
import { CategoryTile } from "../shared/CategoryTile";
import { NewsletterSection } from "../shared/NewsletterSection";
import { TestimonialCard } from "../shared/TestimonialCard";
import { JournalCards } from "./JournalCards";
import { RoutineBuilder } from "./RoutineBuilder";

export function BeautyHome() {
  const config = beautyConfig;
  const { home } = config;
  const titles = Object.fromEntries(summariesFor("beauty").map((p) => [p.slug, p.title]));
  const bestSellers = getProductsBySlugs(config.bestSellers).map(toSummary).slice(0, 4);
  const newArrivals = getProductsBySlugs(home.newArrivals.products).map(toSummary);

  const sections: Record<(typeof home.sections)[number], React.ReactNode> = {
    hero: (
      <section key="hero" className="relative isolate">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-auto lg:h-[min(46rem,80vh)]">
          <Image src={home.hero.image} alt={home.hero.imageAlt} fill preload sizes="100vw" className="-z-10 object-cover object-[78%_50%] lg:object-center" />
        </div>
        <div className="page lg:absolute lg:inset-0 lg:flex lg:items-center">
          <div className="max-w-md py-10 lg:py-0">
            <h1 className="heading text-[clamp(2.6rem,4.6vw,4.4rem)] leading-[1.02] font-light">{home.hero.title}</h1>
            <p className="mt-4 text-sm font-medium tracking-[0.12em] text-fg uppercase">{home.hero.eyebrow}</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">{home.hero.body}</p>
            <ButtonLink href={home.hero.cta.href} className="mt-8" size="lg">
              {home.hero.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    ),
    concerns: (
      <section key="concerns" className="page py-20 md:py-24" aria-labelledby="be-concern-title">
        <SectionHeading id="be-concern-title" title="Shop by concern" align="center" description="Formulas grouped by what your skin needs most right now." />
        <ul className="grid grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-6">
          {home.concerns.map((c) => (
            <li key={c.label} className="reveal">
              <CategoryTile href={c.href} name={c.label} image={c.image} variant="arch" aspect="aspect-[4/5]" sizes="(min-width: 1024px) 15vw, 30vw" />
            </li>
          ))}
        </ul>
      </section>
    ),
    bestSellers: (
      <section key="bestSellers" className="page pb-20 md:pb-24" aria-labelledby="be-best-title">
        <div className="mb-8 border-b border-line pb-5 md:flex md:items-end md:justify-between">
          <div>
            <h2 id="be-best-title" className="heading text-4xl md:text-5xl">
              Bestsellers
            </h2>
            <p className="mt-2 text-sm font-medium tracking-[0.12em] uppercase">Our community&apos;s most-loved formulas</p>
          </div>
          <ButtonLink href={categoryHref("bestsellers")} variant="link" className="mt-4 md:mt-0">
            Shop all bestsellers
          </ButtonLink>
        </div>
        <ProductGrid products={bestSellers} card={config.productCard} />
      </section>
    ),
    newArrivals: (
      <section key="newArrivals" className="page pb-20 md:pb-28" aria-labelledby="be-new-title">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-6">
          <div className="reveal relative aspect-[4/5] overflow-hidden bg-muted lg:aspect-auto">
            <Image src={home.newArrivals.image} alt={home.newArrivals.imageAlt} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h2 id="be-new-title" className="heading text-4xl md:text-5xl">
              {home.newArrivals.title}
            </h2>
            <p className="mt-3 text-sm font-medium tracking-[0.12em] uppercase">{home.newArrivals.body}</p>
            <hr className="my-6 border-line" />
            <ul className="grid flex-1 grid-cols-2 gap-4">
              {newArrivals.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} style="beauty" aspect="4/5" sizes="(min-width: 1024px) 23vw, 45vw" className="w-full" />
                </li>
              ))}
            </ul>
            <ButtonLink href={home.newArrivals.cta.href} variant="link" className="mt-6 self-start">
              {home.newArrivals.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    ),
    routine: (
      <section key="routine" className="bg-muted/70 py-20 md:py-28" aria-labelledby="be-routine-title">
        <div className="page">
          <SectionHeading id="be-routine-title" eyebrow="Featured routine" title={home.routine.title} description={home.routine.body} align="center" />
          <RoutineBuilder steps={home.routine.steps} />
        </div>
      </section>
    ),
    spotlight: (
      <section key="spotlight" className="page py-20 md:py-28" aria-labelledby="be-spot-title">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="reveal relative aspect-[16/11] overflow-hidden rounded-card bg-muted lg:col-span-7">
            <Image src={home.spotlight.image} alt={home.spotlight.imageAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow">{home.spotlight.eyebrow}</p>
            <h2 id="be-spot-title" className="heading mt-4 text-4xl italic md:text-5xl">
              {home.spotlight.title}
            </h2>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-fg-muted">{home.spotlight.body}</p>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {home.spotlight.ingredients.map((i) => (
                <div key={i.name} className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="font-medium">{i.name}</dt>
                  <dd className="text-right text-sm text-fg-muted">{i.note}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink href={home.spotlight.cta.href} className="mt-8">
              {home.spotlight.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    ),
    reviews: (
      <section key="reviews" className="border-y border-line bg-surface py-20 md:py-24" aria-labelledby="be-rev-title">
        <div className="page">
          <SectionHeading id="be-rev-title" title="Real skin, real results" align="center" />
          <div className="grid gap-6 md:grid-cols-3">
            {home.testimonials.map((t) => (
              <TestimonialCard key={t.author} t={t} productTitle={t.product ? titles[t.product] : undefined} />
            ))}
          </div>
        </div>
      </section>
    ),
    journal: (
      <section key="journal" className="page py-20 md:py-28" aria-labelledby="be-journal-title">
        <SectionHeading id="be-journal-title" eyebrow="The Edit" title="Beauty tips from our formulators" />
        <JournalCards articles={home.journal} />
      </section>
    ),
    newsletter: <NewsletterSection key="newsletter" store="beauty" title={config.newsletter.title} body={config.newsletter.body} className="bg-announce text-announce-fg [&_p]:text-announce-fg/80" />,
  };

  return <>{home.sections.map((id) => sections[id])}</>;
}
