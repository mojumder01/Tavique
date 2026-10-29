"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Heart, Info, LogOut, MapPin, Package, Pencil, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, describedBy, Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { commerceConfig } from "@/config/commerce.config";
import { addressSchema } from "@/lib/checkout-schema";
import { formatMoney } from "@/lib/money";
import { cn, localId } from "@/lib/utils";
import { useAccount, type DemoAddress } from "@/store/account";
import { useHydrated } from "@/store/hydration";
import { useOrders } from "@/store/orders";
import { useWishlist } from "@/store/wishlist";

const email = z.string().trim().min(1, "Enter your email address").pipe(z.email("Enter a valid email address"));
const signInSchema = z.object({ email, password: z.string().min(8, "Passwords are at least 8 characters") });
const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(60),
    email,
    password: z.string().min(8, "Use at least 8 characters").regex(/[0-9]/, "Include at least one number"),
    confirm: z.string(),
    terms: z.literal(true, { message: "Please accept the terms to continue" }),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

function PasswordInput({ id, error, ...props }: React.ComponentProps<"input"> & { id: string; error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} className="pr-12" {...describedBy(id, error)} {...props} />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-1.5 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-fg-muted hover:bg-muted hover:text-fg" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
        {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

function DemoNotice() {
  return (
    <p className="flex items-start gap-2.5 rounded-card border border-line bg-surface p-4 text-sm">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        <strong className="font-medium">Demo account.</strong> There is no real authentication: credentials are validated in the browser and discarded. Only a display name is remembered on this device. Connect an auth provider (e.g. Auth.js, Clerk, Supabase Auth) before storing customer data.
      </span>
    </p>
  );
}

function SignInForm({ onDone }: { onDone: (name: string) => void }) {
  const { register, handleSubmit, formState } = useForm<z.infer<typeof signInSchema>>({ resolver: zodResolver(signInSchema) });
  const e = formState.errors;
  return (
    <form noValidate onSubmit={handleSubmit((v) => onDone(v.email.split("@")[0] ?? "there"))} className="space-y-4">
      <Field id="si-email" label="Email" error={e.email?.message}>
        <Input id="si-email" type="email" autoComplete="email" {...describedBy("si-email", e.email?.message)} {...register("email")} />
      </Field>
      <Field id="si-password" label="Password" error={e.password?.message}>
        <PasswordInput id="si-password" autoComplete="current-password" error={e.password?.message} {...register("password")} />
      </Field>
      <Button type="submit" className="w-full" size="lg">
        Sign in (demo)
      </Button>
    </form>
  );
}

function RegisterForm({ onDone }: { onDone: (name: string) => void }) {
  const { register, handleSubmit, formState } = useForm<z.input<typeof registerSchema>>({ resolver: zodResolver(registerSchema) });
  const e = formState.errors;
  return (
    <form noValidate onSubmit={handleSubmit((v) => onDone(v.name))} className="space-y-4">
      <Field id="rg-name" label="Full name" error={e.name?.message}>
        <Input id="rg-name" autoComplete="name" {...describedBy("rg-name", e.name?.message)} {...register("name")} />
      </Field>
      <Field id="rg-email" label="Email" error={e.email?.message}>
        <Input id="rg-email" type="email" autoComplete="email" {...describedBy("rg-email", e.email?.message)} {...register("email")} />
      </Field>
      <Field id="rg-password" label="Password" error={e.password?.message} hint="At least 8 characters, including a number.">
        <PasswordInput id="rg-password" autoComplete="new-password" error={e.password?.message} {...register("password")} />
      </Field>
      <Field id="rg-confirm" label="Confirm password" error={e.confirm?.message}>
        <PasswordInput id="rg-confirm" autoComplete="new-password" error={e.confirm?.message} {...register("confirm")} />
      </Field>
      <div>
        <Checkbox label="I agree to the demo terms and privacy notice" aria-invalid={e.terms ? true : undefined} {...register("terms")} />
        {e.terms && (
          <p role="alert" className="mt-1.5 text-xs text-sale">
            {e.terms.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" size="lg">
        Create account (demo)
      </Button>
    </form>
  );
}

const addressFormSchema = addressSchema.extend({ label: z.string().trim().min(1, "Give this address a name").max(30), isDefault: z.boolean() });
type AddressForm = z.input<typeof addressFormSchema>;

function AddressDialog({ address, onClose }: { address: DemoAddress | null | "new"; onClose: () => void }) {
  const save = useAccount((s) => s.saveAddress);
  const editing = address && address !== "new" ? address : null;
  const [first = "", ...rest] = editing?.name.split(" ") ?? [];
  const { register, handleSubmit, formState } = useForm<AddressForm>({
    resolver: zodResolver(addressFormSchema),
    values: editing
      ? { label: editing.label, firstName: first, lastName: rest.join(" "), address1: editing.line1, city: editing.city, postalCode: editing.postalCode, country: editing.country, isDefault: editing.isDefault }
      : { label: "", firstName: "", lastName: "", address1: "", city: "", postalCode: "", country: "United States", isDefault: false },
  });
  const e = formState.errors;
  return (
    <Modal open={address !== null} onClose={onClose} title={editing ? "Edit address" : "Add address"} description="Saved for this browser session only (demo)." size="lg">
      <form
        noValidate
        className="grid gap-4 p-5 sm:grid-cols-2"
        onSubmit={handleSubmit((v) => {
          save({ id: editing?.id ?? localId("addr"), label: v.label, name: `${v.firstName} ${v.lastName}`.trim(), line1: [v.address1, v.address2].filter(Boolean).join(", "), city: v.city, postalCode: v.postalCode, country: v.country, isDefault: v.isDefault });
          onClose();
        })}
      >
        <Field id="ad-label" label="Label" error={e.label?.message} className="sm:col-span-2">
          <Input id="ad-label" placeholder="Home, Work…" {...describedBy("ad-label", e.label?.message)} {...register("label")} />
        </Field>
        <Field id="ad-first" label="First name" error={e.firstName?.message}>
          <Input id="ad-first" {...describedBy("ad-first", e.firstName?.message)} {...register("firstName")} />
        </Field>
        <Field id="ad-last" label="Last name" error={e.lastName?.message}>
          <Input id="ad-last" {...describedBy("ad-last", e.lastName?.message)} {...register("lastName")} />
        </Field>
        <Field id="ad-line1" label="Address" error={e.address1?.message} className="sm:col-span-2">
          <Input id="ad-line1" {...describedBy("ad-line1", e.address1?.message)} {...register("address1")} />
        </Field>
        <Field id="ad-city" label="City" error={e.city?.message}>
          <Input id="ad-city" {...describedBy("ad-city", e.city?.message)} {...register("city")} />
        </Field>
        <Field id="ad-postal" label="Postal code" error={e.postalCode?.message}>
          <Input id="ad-postal" {...describedBy("ad-postal", e.postalCode?.message)} {...register("postalCode")} />
        </Field>
        <Field id="ad-country" label="Country" error={e.country?.message} className="sm:col-span-2">
          <Select id="ad-country" {...register("country")}>
            {commerceConfig.countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Checkbox label="Make this my default address" className="sm:col-span-2" {...register("isDefault")} />
        <div className="flex justify-end gap-3 sm:col-span-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save address</Button>
        </div>
      </form>
    </Modal>
  );
}

const sampleOrders = [
  { reference: "TQ-SMPL-4821", date: "2026-09-14", status: "Delivered", total: 41800, items: 2 },
  { reference: "TQ-SMPL-3907", date: "2026-07-02", status: "Delivered", total: 14500, items: 1 },
];
const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

function Dashboard({ name }: { name: string }) {
  const [tab, setTab] = useState<"overview" | "orders" | "addresses">("overview");
  const signOut = useAccount((s) => s.signOut);
  const addresses = useAccount((s) => s.addresses);
  const removeAddress = useAccount((s) => s.removeAddress);
  const setDefault = useAccount((s) => s.setDefaultAddress);
  const orders = useOrders((s) => s.orders);
  const saved = useWishlist((s) => s.ids.length);
  const [editing, setEditing] = useState<DemoAddress | null | "new">(null);
  const tabsId = useId();

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ] as const;

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
      <nav aria-label="Account">
        <div role="tablist" aria-orientation="vertical" className="flex gap-1 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`${tabsId}-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`${tabsId}-${t.id}-panel`}
              onClick={() => setTab(t.id)}
              className={cn("flex items-center gap-2.5 rounded-input px-3 py-2.5 text-left text-sm whitespace-nowrap", tab === t.id ? "bg-fg text-bg" : "hover:bg-muted")}
            >
              <t.icon className="size-4" aria-hidden /> {t.label}
            </button>
          ))}
          <Link href="/wishlist" className="flex items-center gap-2.5 rounded-input px-3 py-2.5 text-sm whitespace-nowrap hover:bg-muted">
            <Heart className="size-4" aria-hidden /> Wishlist ({saved})
          </Link>
          <button type="button" onClick={signOut} className="flex items-center gap-2.5 rounded-input px-3 py-2.5 text-left text-sm whitespace-nowrap hover:bg-muted">
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </div>
      </nav>

      <div role="tabpanel" id={`${tabsId}-${tab}-panel`} aria-labelledby={`${tabsId}-${tab}`} className="min-w-0">
        {tab === "overview" && (
          <div className="space-y-6">
            <h2 className="heading text-3xl">Welcome back, {name}.</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Demo orders", value: orders.length },
                { label: "Saved items", value: saved },
                { label: "Addresses", value: addresses.length },
              ].map((s) => (
                <div key={s.label} className="rounded-card border border-line bg-surface p-5">
                  <p className="heading text-4xl">{s.value}</p>
                  <p className="mt-1 text-sm text-fg-muted">{s.label}</p>
                </div>
              ))}
            </div>
            {orders[0] && (
              <div className="rounded-card border border-line bg-surface p-5">
                <p className="eyebrow">Latest demo order</p>
                <p className="mt-2 font-medium">
                  {orders[0].reference} · {formatMoney(orders[0].total)}
                </p>
                <Link href={`/order-confirmation?ref=${encodeURIComponent(orders[0].reference)}`} className="mt-2 inline-block text-sm underline underline-offset-4">
                  View confirmation
                </Link>
              </div>
            )}
            <DemoNotice />
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h2 className="heading text-3xl">Order history</h2>
            <div className="mt-6 overflow-x-auto rounded-card border border-line bg-surface">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <caption className="sr-only">Your orders</caption>
                <thead className="border-b border-line text-xs text-fg-muted">
                  <tr>
                    <th scope="col" className="p-4 font-medium">
                      Order
                    </th>
                    <th scope="col" className="p-4 font-medium">
                      Date
                    </th>
                    <th scope="col" className="p-4 font-medium">
                      Status
                    </th>
                    <th scope="col" className="p-4 text-right font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.reference} className="border-b border-line">
                      <td className="p-4">
                        <Link href={`/order-confirmation?ref=${encodeURIComponent(o.reference)}`} className="font-mono underline underline-offset-4">
                          {o.reference}
                        </Link>
                        <span className="block text-xs text-fg-muted">{o.lines.reduce((n, l) => n + l.quantity, 0)} items</span>
                      </td>
                      <td className="p-4">{dateFmt.format(new Date(o.createdAt))}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs">Demo — placed</span>
                      </td>
                      <td className="p-4 text-right tabular-nums">{formatMoney(o.total)}</td>
                    </tr>
                  ))}
                  {sampleOrders.map((o) => (
                    <tr key={o.reference} className="border-b border-line last:border-0">
                      <td className="p-4">
                        <span className="font-mono">{o.reference}</span>
                        <span className="block text-xs text-fg-muted">
                          {o.items} {o.items === 1 ? "item" : "items"} · sample data
                        </span>
                      </td>
                      <td className="p-4">{dateFmt.format(new Date(o.date))}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs text-success">{o.status}</span>
                      </td>
                      <td className="p-4 text-right tabular-nums">{formatMoney(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-fg-muted">Orders marked “sample data” are illustrative. Real order history requires a backend.</p>
          </div>
        )}

        {tab === "addresses" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="heading text-3xl">Addresses</h2>
              <Button size="sm" variant="outline" onClick={() => setEditing("new")}>
                <Plus className="size-4" aria-hidden /> Add address
              </Button>
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {addresses.map((a) => (
                <li key={a.id} className="flex flex-col rounded-card border border-line bg-surface p-5 text-sm">
                  <p className="flex items-center gap-2 font-medium">
                    {a.label}
                    {a.isDefault && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-normal">Default</span>}
                  </p>
                  <address className="mt-2 leading-relaxed text-fg-muted not-italic">
                    {a.name}
                    <br />
                    {a.line1}
                    <br />
                    {a.city} {a.postalCode}
                    <br />
                    {a.country}
                  </address>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    <button type="button" onClick={() => setEditing(a)} className="inline-flex items-center gap-1 underline underline-offset-4">
                      <Pencil className="size-3" aria-hidden /> Edit<span className="sr-only"> {a.label}</span>
                    </button>
                    {!a.isDefault && (
                      <button type="button" onClick={() => setDefault(a.id)} className="underline underline-offset-4">
                        Set as default<span className="sr-only"> ({a.label})</span>
                      </button>
                    )}
                    <button type="button" onClick={() => removeAddress(a.id)} className="inline-flex items-center gap-1 text-sale underline underline-offset-4">
                      <Trash2 className="size-3" aria-hidden /> Remove<span className="sr-only"> {a.label}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {addresses.length === 0 && <p className="mt-6 text-sm text-fg-muted">No saved addresses yet.</p>}
            <p className="mt-4 text-xs text-fg-muted">Addresses are kept in memory for this session only and are never written to storage in the demo.</p>
            <AddressDialog address={editing} onClose={() => setEditing(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Demo account area: sign in / register forms, then a dashboard with orders and addresses. */
export function AccountView({ continueHref }: { continueHref: string }) {
  const hydrated = useHydrated();
  const name = useAccount((s) => s.name);
  const signIn = useAccount((s) => s.signIn);
  const [mode, setMode] = useState<"signin" | "register">("signin");

  if (!hydrated) return <Skeleton className="h-96" />;
  if (name) return <Dashboard name={name} />;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="max-w-md">
        <div role="tablist" aria-label="Account access" className="mb-8 flex gap-6 border-b border-line">
          {(["signin", "register"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={cn("-mb-px border-b-2 pb-3 text-sm font-medium", mode === m ? "border-fg" : "border-transparent text-fg-muted hover:text-fg")}>
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
        {mode === "signin" ? <SignInForm onDone={signIn} /> : <RegisterForm onDone={signIn} />}
        <div className="mt-6">
          <DemoNotice />
        </div>
      </div>
      <div className="relative hidden overflow-hidden rounded-card bg-muted lg:block">
        <Image src="/images/fashion/story.webp" alt="" fill sizes="45vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8 text-white">
          <p className="heading text-3xl">Track orders, save addresses and keep your wishlist in one place.</p>
          <ButtonLink href={continueHref} variant="inverse" className="mt-5">
            Continue shopping
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
