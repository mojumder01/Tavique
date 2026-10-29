import type { Metadata } from "next";
import Image from "next/image";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { enabledStores, storeConfigs } from "@/config/stores";
import { siteConfig } from "@/config/site.config";
import { renderForActiveStore } from "@/lib/render-for-store";
import { storeHome } from "@/lib/routes";
import type { StoreId } from "@/types/catalog";

export const metadata: Metadata = { title: "About", description: `The story behind ${siteConfig.name}: considered products, honest information and fewer, better things.`, alternates: { canonical: "/about" } };

const values = [
  { title: "Fewer, better things", body: "We choose a small range of products we'd use ourselves, and explain exactly why." },
  { title: "Honest information", body: "Clear specs, real ingredient lists and fit notes — so you can decide with confidence." },
  { title: "Made to last", body: "Natural materials, repairable construction and long warranties, wherever possible." },
];

export default async function AboutPage() {
  return renderForActiveStore(renderAboutPage);
}

function renderAboutPage(store: StoreId) {
  const config = storeConfigs[store];
  return (
    <StoreShell store={store}>
      <div className="page pt-6 md:pt-8">
        <Breadcrumbs items={[{ label: "Home", href: storeHome(store) }, { label: "About" }]} />
      </div>
      <section className="page grid grid-cols-1 gap-10 py-12 md:py-20 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <p className="eyebrow">Our story</p>
          <h1 className="heading mt-4 text-5xl md:text-7xl">Considered by design.</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted">
            {siteConfig.name} began with a simple idea: shopping online should feel as considered as the products themselves. Across fashion, technology and beauty, we curate less and explain more.
          </p>
          <p className="mt-4 max-w-lg text-sm text-fg-muted">This page is demo content — tell your own brand story here.</p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-muted lg:col-span-5 lg:col-start-8">
          <Image src={config.home.hero.image} alt={config.home.hero.imageAlt} fill preload sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </section>
      <section aria-labelledby="values-title" className="border-y border-line bg-surface py-16 md:py-24">
        <div className="page">
          <h2 id="values-title" className="heading text-3xl md:text-4xl">
            What we believe
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
            {values.map((v, i) => (
              <li key={v.title}>
                <p className="text-sm text-fg-muted tabular-nums">0{i + 1}</p>
                <h3 className="heading mt-3 text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="stores-title" className="page py-16 md:py-24">
        <h2 id="stores-title" className="heading text-3xl md:text-4xl">
          Our storefronts
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {enabledStores.map((id) => (
            <li key={id} className="rounded-card border border-line bg-surface p-6">
              <h3 className="heading text-2xl">{storeConfigs[id].label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{storeConfigs[id].tagline}.</p>
              <ButtonLink href={storeHome(id)} variant="link" className="mt-4">
                Visit {storeConfigs[id].label.split(" & ")[0]}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </section>
    </StoreShell>
  );
}
