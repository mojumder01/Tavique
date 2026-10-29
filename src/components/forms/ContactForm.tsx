"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { describedBy, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { siteConfig } from "@/config/site.config";
import type { StoreId } from "@/types/catalog";

const topics = ["Order or delivery", "Product question", "Returns & refunds", "Warranty claim", "Something else"] as const;
const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().min(1, "Enter your email address").pipe(z.email("Enter a valid email address")),
  topic: z.enum(topics, { message: "Choose a topic" }),
  order: z
    .string()
    .trim()
    .max(20)
    .regex(/^$|^[A-Z0-9-]{6,20}$/i, "Order references look like TQ-XXXX-XXXX")
    .optional(),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(1000, "Keep it under 1,000 characters"),
  website: z.string().max(0).optional(), // honeypot — must stay empty
});
type Values = z.input<typeof schema>;

/**
 * Contact form. Posts JSON to NEXT_PUBLIC_CONTACT_ENDPOINT (e.g. a Formspree URL) when configured;
 * otherwise it validates and clearly reports that nothing was sent.
 */
export function ContactForm({ store }: { store: StoreId }) {
  const [status, setStatus] = useState<"idle" | "sent" | "demo" | "error">("idle");
  const { register, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { topic: topics[0] } });
  const e = formState.errors;
  const endpoint = siteConfig.integrations.contactEndpoint;

  const onSubmit = async (v: Values) => {
    if (v.website) return; // bot
    if (!endpoint) {
      setStatus("demo");
      reset();
      return;
    }
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name: v.name, email: v.email, topic: v.topic, order: v.order, message: v.message, store }) });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent" || status === "demo") {
    return (
      <div role="status" className="rounded-card border border-line bg-surface p-8">
        <CheckCircle2 className="size-8 text-success" aria-hidden />
        <h2 className="heading mt-4 text-2xl">{status === "sent" ? "Message sent" : "Message validated (demo)"}</h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          {status === "sent" ? "Thanks — we'll reply within one business day." : "Demo mode: your message passed validation but was not sent anywhere. Set NEXT_PUBLIC_CONTACT_ENDPOINT to deliver messages."}
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
      <Field id="c-name" label="Name" error={e.name?.message}>
        <Input id="c-name" autoComplete="name" {...describedBy("c-name", e.name?.message)} {...register("name")} />
      </Field>
      <Field id="c-email" label="Email" error={e.email?.message}>
        <Input id="c-email" type="email" autoComplete="email" {...describedBy("c-email", e.email?.message)} {...register("email")} />
      </Field>
      <Field id="c-topic" label="Topic" error={e.topic?.message}>
        <Select id="c-topic" {...register("topic")}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field id="c-order" label="Order reference" optional error={e.order?.message}>
        <Input id="c-order" placeholder="TQ-XXXX-XXXX" {...describedBy("c-order", e.order?.message)} {...register("order")} />
      </Field>
      <Field id="c-message" label="Message" error={e.message?.message} className="sm:col-span-2">
        <Textarea id="c-message" rows={6} {...describedBy("c-message", e.message?.message)} {...register("message")} />
      </Field>
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="c-website">Leave this field empty</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-sale sm:col-span-2">
          We couldn&apos;t send your message. Please try again or email us directly.
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" loading={formState.isSubmitting}>
          Send message
        </Button>
      </div>
    </form>
  );
}
