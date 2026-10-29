"use client";

import { CheckCircle2, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatMoney } from "@/lib/money";
import { productHref } from "@/lib/routes";
import { useHydrated } from "@/store/hydration";
import { useOrders } from "@/store/orders";

const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" });

/** Shows a demo order created by the checkout. Nothing here comes from a payment provider. */
export function OrderConfirmation({ continueHref }: { continueHref: string }) {
  const ref = useSearchParams().get("ref") ?? "";
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.reference === ref));

  if (!hydrated) return <Skeleton className="mx-auto h-96 max-w-3xl" />;
  if (!order) {
    return (
      <EmptyState icon={<PackageSearch />} title="We couldn't find that demo order" body="Demo orders are stored in this browser only. Place a new demo order from your bag to see a confirmation.">
        <ButtonLink href={continueHref}>Continue shopping</ButtonLink>
        <ButtonLink href="/account" variant="outline">
          View account
        </ButtonLink>
      </EmptyState>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
        <p className="eyebrow mt-6">Demo order placed</p>
        <h1 className="heading mt-3 text-4xl md:text-5xl">Thank you, {order.firstName}.</h1>
        <p className="mx-auto mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-fg-muted">
          Your demo order <strong className="font-semibold text-fg">{order.reference}</strong> was recorded on {dateFmt.format(new Date(order.createdAt))}. This is a template demonstration — no payment was taken and no email was sent.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 rounded-card border border-line bg-surface p-6 sm:grid-cols-3">
        <div>
          <p className="eyebrow">Delivery</p>
          <p className="mt-2 text-sm">{order.shippingMethod}</p>
          <p className="text-sm text-fg-muted">To {order.city}</p>
        </div>
        <div>
          <p className="eyebrow">Payment</p>
          <p className="mt-2 text-sm">{order.paymentMethod}</p>
          <p className="text-sm text-fg-muted">Not charged (demo)</p>
        </div>
        <div>
          <p className="eyebrow">Reference</p>
          <p className="mt-2 font-mono text-sm">{order.reference}</p>
        </div>
      </div>

      <section aria-labelledby="order-items" className="mt-8 rounded-card border border-line bg-surface p-6">
        <h2 id="order-items" className="heading text-2xl">
          Order summary
        </h2>
        <ul className="mt-5 divide-y divide-line">
          {order.lines.map((l, i) => (
            <li key={`${l.slug}-${i}`} className="flex items-center gap-4 py-4 text-sm">
              <Link href={productHref(l.slug)} className="relative size-16 shrink-0 overflow-hidden rounded-card bg-muted">
                <Image src={l.image} alt={l.imageAlt} fill sizes="64px" className="object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={productHref(l.slug)} className="font-medium hover:underline">
                  {l.title}
                </Link>
                <p className="text-xs text-fg-muted">
                  {[...l.options.map((o) => o.label), `Qty ${l.quantity}`].join(" · ")}
                </p>
              </div>
              <span className="tabular-nums">{formatMoney(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          {[
            ["Subtotal", formatMoney(order.subtotal)],
            ...(order.discount ? [[`Discount (${order.discountCode})`, `−${formatMoney(order.discount)}`]] : []),
            ["Shipping", order.shipping ? formatMoney(order.shipping) : "Free"],
            ["Estimated tax", formatMoney(order.tax)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-fg-muted">{k}</dt>
              <dd className="tabular-nums">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatMoney(order.total)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href={continueHref}>Continue shopping</ButtonLink>
        <ButtonLink href="/account" variant="outline">
          View order history
        </ButtonLink>
      </div>
    </div>
  );
}
