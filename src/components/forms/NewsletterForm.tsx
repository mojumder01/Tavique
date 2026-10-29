"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import type { StoreId } from "@/types/catalog";

const schema = z.object({ email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address") });
type Values = z.infer<typeof schema>;

/**
 * Newsletter sign-up. Posts to NEXT_PUBLIC_NEWSLETTER_ENDPOINT when configured; otherwise it
 * validates the address and says plainly that nothing was sent (demo mode).
 */
export function NewsletterForm({ store, tone = "default", id = "newsletter" }: { store: StoreId; tone?: "default" | "inverse"; id?: string }) {
  const [status, setStatus] = useState<"idle" | "sent" | "demo" | "error">("idle");
  const { register, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(schema) });
  const endpoint = siteConfig.integrations.newsletterEndpoint;

  const onSubmit = async ({ email }: Values) => {
    if (!endpoint) {
      setStatus("demo");
      reset();
      return;
    }
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, store }) });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) reset();
    } catch {
      setStatus("error");
    }
  };

  const error = formState.errors.email?.message;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <div className={cn("flex items-stretch gap-2 border-b pb-1", tone === "inverse" ? "border-current/40" : "border-fg/40")}>
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : status !== "idle" ? `${id}-status` : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent text-[0.9375rem] placeholder:text-current/60 focus:outline-none"
          {...register("email")}
        />
        <button type="submit" disabled={formState.isSubmitting} className="btn-type shrink-0 px-2 underline-offset-4 hover:underline disabled:opacity-60">
          {formState.isSubmitting ? "Sending…" : "Subscribe"}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs font-medium">
          {error}
        </p>
      )}
      <p id={`${id}-status`} role="status" className="mt-2 min-h-4 text-xs opacity-80">
        {status === "sent" && "Thanks — you're on the list."}
        {status === "demo" && "Demo mode: your email was validated but not sent anywhere. Connect a provider via NEXT_PUBLIC_NEWSLETTER_ENDPOINT."}
        {status === "error" && "Something went wrong. Please try again in a moment."}
      </p>
    </form>
  );
}
