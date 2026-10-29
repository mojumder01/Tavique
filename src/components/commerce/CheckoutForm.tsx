"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Info, Lock, ShoppingBag, Wand2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, describedBy, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { commerceConfig } from "@/config/commerce.config";
import { siteConfig } from "@/config/site.config";
import { useCartTotals } from "@/hooks/useCartTotals";
import { checkoutSchema, demoCheckoutValues, type CheckoutValues } from "@/lib/checkout-schema";
import { formatMoney } from "@/lib/money";
import { createOrderReference, priceCart } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import type { CartTotals } from "@/types/commerce";
import { DiscountCodeForm } from "./DiscountCodeForm";
import { ShippingMethodPicker } from "./ShippingMethodPicker";
import { TotalsRows } from "./TotalsRows";

type Prefix = "shipping" | "billing";

function AddressFields({ prefix, register, errors }: { prefix: Prefix; register: UseFormRegister<CheckoutValues>; errors: FieldErrors<CheckoutValues> }) {
  const e = (errors[prefix] ?? {}) as Partial<Record<string, { message?: string }>>;
  const id = (f: string) => `${prefix}-${f}`;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id={id("firstName")} label="First name" error={e.firstName?.message}>
        <Input id={id("firstName")} autoComplete={`${prefix} given-name`} {...describedBy(id("firstName"), e.firstName?.message)} {...register(`${prefix}.firstName`)} />
      </Field>
      <Field id={id("lastName")} label="Last name" error={e.lastName?.message}>
        <Input id={id("lastName")} autoComplete={`${prefix} family-name`} {...describedBy(id("lastName"), e.lastName?.message)} {...register(`${prefix}.lastName`)} />
      </Field>
      <Field id={id("address1")} label="Address" error={e.address1?.message} className="sm:col-span-2">
        <Input id={id("address1")} autoComplete={`${prefix} address-line1`} {...describedBy(id("address1"), e.address1?.message)} {...register(`${prefix}.address1`)} />
      </Field>
      <Field id={id("address2")} label="Apartment, suite, etc." optional error={e.address2?.message} className="sm:col-span-2">
        <Input id={id("address2")} autoComplete={`${prefix} address-line2`} {...register(`${prefix}.address2`)} />
      </Field>
      <Field id={id("city")} label="City" error={e.city?.message}>
        <Input id={id("city")} autoComplete={`${prefix} address-level2`} {...describedBy(id("city"), e.city?.message)} {...register(`${prefix}.city`)} />
      </Field>
      <Field id={id("postalCode")} label="Postal code" error={e.postalCode?.message}>
        <Input id={id("postalCode")} autoComplete={`${prefix} postal-code`} {...describedBy(id("postalCode"), e.postalCode?.message)} {...register(`${prefix}.postalCode`)} />
      </Field>
      <Field id={id("country")} label="Country" error={e.country?.message} className="sm:col-span-2">
        <Select id={id("country")} autoComplete={`${prefix} country-name`} {...describedBy(id("country"), e.country?.message)} {...register(`${prefix}.country`)}>
          {commerceConfig.countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </Field>
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`checkout-step-${step}`} className="border-b border-line pb-8">
      <h2 id={`checkout-step-${step}`} className="mb-5 flex items-center gap-3 text-lg font-medium">
        <span className="flex size-7 items-center justify-center rounded-full bg-fg text-xs text-bg" aria-hidden>
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function OrderLines({ totals }: { totals: CartTotals }) {
  return (
    <ul className="space-y-4">
      {totals.lines.map((l) => (
        <li key={l.key} className="flex items-center gap-3 text-sm">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-card bg-muted">
            <Image src={l.image} alt={l.imageAlt} fill sizes="64px" className="object-cover" />
            <span className="absolute -top-0 -right-0 flex size-5 items-center justify-center rounded-bl-md bg-fg text-[10px] font-semibold text-bg" aria-label={`Quantity ${l.quantity}`}>
              {l.quantity}
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{l.title}</span>
            {l.options.length > 0 && <span className="block truncate text-xs text-fg-muted">{l.options.map((o) => o.label).join(" · ")}</span>}
            {l.issue && <span className="block text-xs text-sale">{l.issue === "quantity-reduced" ? "Quantity reduced to available stock" : "Unavailable"}</span>}
          </span>
          <span className="tabular-nums">{l.lineTotal ? formatMoney(l.lineTotal) : "—"}</span>
        </li>
      ))}
    </ul>
  );
}

const errorList = (errors: FieldErrors<CheckoutValues>) => {
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const m = (node as { message?: unknown }).message;
    if (typeof m === "string") out.push(m);
    else Object.values(node).forEach(walk);
  };
  walk(errors);
  return [...new Set(out)];
};

/** Demo checkout: validates, re-checks the cart against the catalogue, then records a local demo order. */
export function CheckoutForm({ continueHref }: { continueHref: string }) {
  const router = useRouter();
  const { totals, hydrated } = useCartTotals();
  const { byId } = useCatalog();
  const clear = useCart((s) => s.clear);
  const addOrder = useOrders((s) => s.add);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { billingSame: true, payment: "card", shipping: { country: "United States" }, billing: { country: "United States" } },
  });
  const billingSame = useWatch({ control, name: "billingSame" });
  const payment = useWatch({ control, name: "payment" });
  const errs = submitted ? errorList(errors) : [];

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-12" role="status" aria-label="Loading checkout">
        <Skeleton className="h-[40rem] lg:col-span-7" />
        <Skeleton className="h-96 lg:col-span-5" />
      </div>
    );
  }
  if (totals.lines.length === 0) {
    return (
      <EmptyState icon={<ShoppingBag />} title="Your bag is empty" body="Add something you love, then come back to check out.">
        <ButtonLink href={continueHref}>Continue shopping</ButtonLink>
      </EmptyState>
    );
  }

  const onValid = async (values: CheckoutValues) => {
    setFormError(null);
    // Re-price from the catalogue at the moment of submission (never trust earlier client state).
    const { lines, discountCode, shippingMethodId } = useCart.getState();
    const fresh = priceCart(lines, { getProduct: (id) => byId.get(id), discountCode, shippingMethodId });
    if (fresh.itemCount === 0) return setFormError("Your bag is empty.");
    if (fresh.lines.some((l) => l.issue === "unavailable" || l.issue === "invalid-options")) return setFormError("Some items are no longer available. Please review your bag.");

    await new Promise((r) => setTimeout(r, 900)); // simulated processing
    const reference = createOrderReference();
    addOrder({
      reference,
      createdAt: new Date().toISOString(),
      firstName: values.shipping.firstName.trim(),
      city: values.shipping.city.trim(),
      paymentMethod: commerceConfig.paymentMethods.find((p) => p.id === values.payment)?.label ?? values.payment,
      shippingMethod: `${fresh.shippingMethod.label} — ${fresh.shippingMethod.description}`,
      lines: fresh.lines.filter((l) => l.lineTotal > 0).map(({ title, brand, image, imageAlt, options, quantity, lineTotal, slug }) => ({ title, brand, image, imageAlt, options, quantity, lineTotal, slug })),
      subtotal: fresh.subtotal,
      discount: fresh.discount,
      shipping: fresh.shipping,
      tax: fresh.tax,
      total: fresh.total,
      discountCode: fresh.discount > 0 ? fresh.discountCode : undefined,
    });
    router.push(`/order-confirmation?ref=${encodeURIComponent(reference)}`);
    clear(); // only after the simulated order succeeded
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        setSubmitted(true);
        void handleSubmit(onValid, () => requestAnimationFrame(() => summaryRef.current?.focus()))(e);
      }}
      className="grid gap-10 lg:grid-cols-12 lg:gap-14"
    >
      <div className="space-y-8 lg:col-span-7">
        {siteConfig.demoMode && (
          <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <strong className="font-medium">Demo checkout.</strong> No payment is taken and nothing is sent — a local demo order is created instead.
              </span>
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => reset(demoCheckoutValues)}>
              <Wand2 className="size-3.5" aria-hidden /> Fill demo details
            </Button>
          </div>
        )}

        {errs.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-card border border-sale/40 bg-sale/5 p-4 text-sm focus:outline-none">
            <p className="font-medium text-sale">Please fix {errs.length === 1 ? "1 problem" : `${errs.length} problems`} to continue:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sale">
              {errs.slice(0, 8).map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <Section step={1} title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="email" label="Email" error={errors.email?.message} hint="For your order confirmation (not sent in the demo).">
              <Input id="email" type="email" autoComplete="email" {...describedBy("email", errors.email?.message, true)} {...register("email")} />
            </Field>
            <Field id="phone" label="Phone" error={errors.phone?.message} hint="For delivery updates.">
              <Input id="phone" type="tel" autoComplete="tel" {...describedBy("phone", errors.phone?.message, true)} {...register("phone")} />
            </Field>
          </div>
        </Section>

        <Section step={2} title="Shipping address">
          <AddressFields prefix="shipping" register={register} errors={errors} />
        </Section>

        <Section step={3} title="Delivery">
          <ShippingMethodPicker totals={totals} legend="Choose a delivery method" name="checkout-shipping" />
        </Section>

        <Section step={4} title="Billing">
          <Checkbox label="Billing address is the same as shipping" {...register("billingSame")} />
          {!billingSame && (
            <div className="mt-5">
              <AddressFields prefix="billing" register={register} errors={errors} />
            </div>
          )}
        </Section>

        <Section step={5} title="Payment">
          <fieldset aria-describedby={errors.payment ? "payment-error" : undefined}>
            <legend className="sr-only">Payment method</legend>
            <div className="space-y-2">
              {commerceConfig.paymentMethods.map((m) => (
                <label key={m.id} className={cn("flex cursor-pointer items-start gap-3 rounded-input border px-4 py-3.5 text-sm", payment === m.id ? "border-fg bg-surface" : "border-line hover:border-fg/50")}>
                  <input type="radio" value={m.id} className="mt-0.5 size-4 accent-[var(--c-primary)]" {...register("payment")} />
                  <span>
                    <span className="block font-medium">{m.label}</span>
                    <span className="mt-0.5 block text-xs text-fg-muted">{m.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.payment && (
              <p id="payment-error" role="alert" className="mt-2 text-xs text-sale">
                {errors.payment.message}
              </p>
            )}
          </fieldset>
          {payment === "card" && (
            <div className="mt-4 flex items-start gap-3 rounded-card bg-muted p-4 text-xs leading-relaxed text-fg-muted">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-fg" aria-hidden />
              <p>Card fields are intentionally not included. In production, card details must be collected by a PCI-compliant provider&apos;s secure hosted fields and confirmed by your server — never stored in this app or the browser.</p>
            </div>
          )}
          <Field id="notes" label="Order notes" optional error={errors.notes?.message} className="mt-6">
            <Textarea id="notes" rows={3} {...register("notes")} />
          </Field>
        </Section>

        {formError && (
          <p role="alert" className="rounded-card border border-sale/40 bg-sale/5 p-4 text-sm text-sale">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          <Lock className="size-4" aria-hidden />
          {isSubmitting ? "Placing demo order…" : `Place demo order · ${formatMoney(totals.total)}`}
        </Button>
        <p className="text-center text-xs text-fg-muted">By placing a demo order you agree that no real purchase is made.</p>
      </div>

      <aside aria-labelledby="checkout-summary" className="lg:col-span-5">
        <div className="space-y-6 rounded-card border border-line bg-surface p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 id="checkout-summary" className="heading text-2xl">
            Order summary
          </h2>
          <OrderLines totals={totals} />
          <DiscountCodeForm totals={totals} />
          <TotalsRows totals={totals} />
        </div>
      </aside>
    </form>
  );
}
