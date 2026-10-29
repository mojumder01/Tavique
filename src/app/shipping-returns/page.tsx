import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import { StoreShell } from "@/components/layout/StoreShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { commerceConfig } from "@/config/commerce.config";
import { getActiveStore } from "@/lib/active-store";
import { formatPrice } from "@/lib/money";
import { storeHome } from "@/lib/routes";

export const metadata: Metadata = { title: "Shipping & Returns", description: "Delivery options and costs, our 30-day returns policy and electronics warranty.", alternates: { canonical: "/shipping-returns" } };

export default async function ShippingReturnsPage() {
  const store = await getActiveStore();
  return (
    <StoreShell store={store}>
      <div className="page pt-6 pb-24 md:pt-8">
        <Breadcrumbs items={[{ label: "Home", href: storeHome(store) }, { label: "Shipping & Returns" }]} />
        <h1 className="heading mt-8 max-w-3xl text-4xl md:text-6xl">Shipping, returns & warranty</h1>
        <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-fg-muted">Clear, fair policies — shown here as demo content you can edit in this page and in <code className="font-mono text-xs">src/config/commerce.config.ts</code>.</p>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="lg:col-span-3">
            <ul className="space-y-2 text-sm lg:sticky lg:top-28">
              <li>
                <a href="#shipping" className="underline-offset-4 hover:underline">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#returns" className="underline-offset-4 hover:underline">
                  Returns
                </a>
              </li>
              <li>
                <a href="#warranty" className="underline-offset-4 hover:underline">
                  Warranty & repairs
                </a>
              </li>
            </ul>
          </nav>
          <div className="space-y-16 lg:col-span-9">
            <section id="shipping" aria-labelledby="shipping-title" className="scroll-mt-28">
              <h2 id="shipping-title" className="heading flex items-center gap-3 text-3xl">
                <Truck className="size-6" aria-hidden /> Shipping
              </h2>
              <div className="relative mt-6 overflow-x-auto rounded-card border border-line bg-surface">
                <table className="w-full min-w-[30rem] text-left text-sm">
                  <caption className="sr-only">Shipping methods and costs</caption>
                  <thead className="border-b border-line text-xs text-fg-muted">
                    <tr>
                      <th scope="col" className="p-4 font-medium">
                        Method
                      </th>
                      <th scope="col" className="p-4 font-medium">
                        Delivery time
                      </th>
                      <th scope="col" className="p-4 font-medium">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {commerceConfig.shippingMethods.map((m) => (
                      <tr key={m.id} className="border-b border-line last:border-0">
                        <th scope="row" className="p-4 font-medium">
                          {m.label}
                        </th>
                        <td className="p-4 text-fg-muted">{m.description}</td>
                        <td className="p-4">
                          {formatPrice(m.price, false)}
                          {"freeOver" in m && m.freeOver ? <span className="block text-xs text-success">Free over {formatPrice(m.freeOver)}</span> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">Orders placed before 2pm on business days are dispatched the same day. You&apos;ll receive tracking details by email once your parcel ships (live stores only).</p>
            </section>

            <section id="returns" aria-labelledby="returns-title" className="scroll-mt-28">
              <h2 id="returns-title" className="heading flex items-center gap-3 text-3xl">
                <RotateCcw className="size-6" aria-hidden /> Returns
              </h2>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-fg-muted">
                <li>Free returns within 30 days of delivery on full-price and sale items.</li>
                <li>Items must be unused, with tags attached and in original packaging.</li>
                <li>For hygiene reasons, opened beauty and personal-care products can&apos;t be returned unless faulty.</li>
                <li>Refunds are issued to the original payment method within 5–7 business days of receipt.</li>
              </ul>
            </section>

            <section id="warranty" aria-labelledby="warranty-title" className="scroll-mt-28">
              <h2 id="warranty-title" className="heading flex items-center gap-3 text-3xl">
                <ShieldCheck className="size-6" aria-hidden /> Warranty & repairs
              </h2>
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-fg-muted">Electronics include a 2-year limited warranty covering manufacturing defects. Leather goods and footwear can be repaired or resoled through our partner workshops; outerwear carries a 2-year craftsmanship guarantee. Contact us with your order reference to start a claim.</p>
            </section>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
