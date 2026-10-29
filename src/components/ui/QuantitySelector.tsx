"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { clamp, cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

/** − / input / + stepper. Typed values are clamped on blur; buttons disable at the limits. */
export function QuantitySelector({ value, onChange, min = 1, max, label = "Quantity", size = "md", className }: Props) {
  // Free text is only kept while the field is being edited; otherwise the prop is shown.
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft == null) return;
    const n = Number.parseInt(draft, 10);
    const next = Number.isFinite(n) ? clamp(n, min, Math.max(min, max)) : value;
    setDraft(null);
    if (next !== value) onChange(next);
  };
  const btn = "inline-flex h-full items-center justify-center text-fg transition-colors hover:bg-muted disabled:opacity-35";
  return (
    <div role="group" aria-label={label} className={cn("inline-flex items-stretch rounded-input border border-line bg-surface", size === "sm" ? "h-9" : "h-11", className)}>
      <button type="button" className={cn(btn, size === "sm" ? "w-8" : "w-11")} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`}>
        <Minus className="size-3.5" aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={draft ?? String(value)}
        aria-label={label}
        onFocus={() => setDraft(String(value))}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className={cn("w-10 bg-transparent text-center text-sm font-medium tabular-nums focus:outline-none", size === "sm" && "w-8")}
      />
      <button type="button" className={cn(btn, size === "sm" ? "w-8" : "w-11")} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`}>
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
