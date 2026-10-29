import type { Metadata } from "next";
import Link from "next/link";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqGroups } from "@/data/content";
import { renderForActiveStore } from "@/lib/render-for-store";
import { storeHome } from "@/lib/routes";
import type { StoreId } from "@/types/catalog";

export const metadata: Metadata = { title: "FAQ", description: "Answers about orders, payment, shipping, returns and warranty.", alternates: { canonical: "/faq" } };

export default async function FAQPage() {
  return renderForActiveStore(renderFAQPage);
}

function renderFAQPage(store: StoreId) {
  return (
    <StoreShell store={store}>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqGroups.flatMap((g) => g.items).map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })) }} />
      <div className="page pt-6 pb-24 md:pt-8">
        <Breadcrumbs items={[{ label: "Home", href: storeHome(store) }, { label: "FAQ" }]} />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h1 className="heading text-4xl md:text-6xl">How can we help?</h1>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-fg-muted">Quick answers to common questions. Can&apos;t find what you need?</p>
            <Link href="/contact" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
              Contact our team
            </Link>
          </div>
          <div className="space-y-12 lg:col-span-8">
            {faqGroups.map((g) => (
              <section key={g.title} aria-labelledby={`faq-${g.title}`}>
                <h2 id={`faq-${g.title}`} className="eyebrow mb-4">
                  {g.title}
                </h2>
                <FAQAccordion items={g.items} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
