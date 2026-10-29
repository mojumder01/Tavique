"use client";

import { Tag, X } from "lucide-react";
import { useId, useState } from "react";
import { commerceConfig } from "@/config/commerce.config";
import { siteConfig } from "@/config/site.config";
import { checkDiscount } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import type { CartTotals } from "@/types/commerce";

/** Apply/remove a discount code. Validity is re-checked against the cart on every render. */
export function DiscountCodeForm({ totals }: { totals: CartTotals }) {
  const applied = useCart((s) => s.discountCode);
  const applyCode = useCart((s) => s.applyCode);
  const removeCode = useCart((s) => s.removeCode);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const appliedValid = applied ? checkDiscount(applied, totals.lines).ok : false;

  if (applied) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3 rounded-input border border-line bg-muted/60 px-3 py-2.5 text-sm">
          <span className="flex items-center gap-2">
            <Tag className="size-4" aria-hidden />
            <span className="font-medium">{applied}</span>
          </span>
          <button type="button" onClick={removeCode} className="inline-flex items-center gap-1 text-xs underline underline-offset-4">
            <X className="size-3" aria-hidden /> Remove<span className="sr-only"> code {applied}</span>
          </button>
        </div>
        <p role="status" className={cn("text-xs", appliedValid ? "text-success" : "text-sale")}>
          {appliedValid ? `Applied: ${totals.discountMessage}` : totals.discountMessage}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const value = code.trim();
        if (!value) return setError("Enter a discount code.");
        const check = checkDiscount(value, totals.lines);
        if (!check.ok) return setError(check.message);
        setError(null);
        setCode("");
        applyCode(value);
      }}
      noValidate
    >
      <label htmlFor={id} className="text-sm font-medium">
        Discount code
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id={id}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          className="h-10 min-w-0 flex-1 rounded-input border border-line bg-surface px-3 text-sm uppercase placeholder:normal-case focus:border-fg focus:outline-none aria-[invalid=true]:border-sale"
          placeholder="Enter code"
        />
        <button type="submit" className="btn-type h-10 shrink-0 rounded-btn border border-fg px-4 hover:bg-fg hover:text-bg">
          Apply
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-sale">
          {error}
        </p>
      ) : (
        siteConfig.demoMode && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-fg-muted">
            Demo codes: {commerceConfig.discountCodes.map((d) => d.code).join(", ")}
          </p>
        )
      )}
    </form>
  );
}
