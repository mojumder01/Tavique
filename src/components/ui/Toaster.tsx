"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

/** Polite live region for confirmations ("Added to bag") and errors. */
export function Toaster() {
  const toasts = useUI((s) => s.toasts);
  const dismiss = useUI((s) => s.dismiss);
  return (
    <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border border-line bg-surface p-4 text-sm text-fg shadow-[0_12px_40px_-12px_rgb(0_0_0/0.25)] motion-safe:animate-[toast-in_.25s_ease-out]"
        >
          {t.tone === "error" ? <AlertCircle className="mt-0.5 size-5 shrink-0 text-sale" aria-hidden /> : <CheckCircle2 className={cn("mt-0.5 size-5 shrink-0", t.tone === "success" ? "text-success" : "text-fg")} aria-hidden />}
          <div className="min-w-0 flex-1">
            <p className="font-medium">{t.title}</p>
            {t.description && <p className="mt-0.5 text-fg-muted">{t.description}</p>}
            {t.action && (
              <Link href={t.action.href} onClick={() => dismiss(t.id)} className="mt-2 inline-block font-medium underline underline-offset-4">
                {t.action.label}
              </Link>
            )}
          </div>
          <button type="button" onClick={() => dismiss(t.id)} className="-m-1 rounded-full p-1 text-fg-muted hover:bg-muted hover:text-fg" aria-label="Dismiss notification">
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
