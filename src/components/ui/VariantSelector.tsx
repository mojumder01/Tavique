"use client";

import { isOptionAvailable, type VariantProduct } from "@/lib/variants";
import { cn } from "@/lib/utils";
import type { SelectedOptions } from "@/types/commerce";

interface Props {
  product: VariantProduct;
  selection: SelectedOptions;
  onChange: (groupId: string, value: string) => void;
  /** Group ids that failed validation (shown with an error message). */
  invalidGroups?: string[];
  /** Rendered next to a group's legend, e.g. a size-guide button. */
  groupAction?: (groupId: string) => React.ReactNode;
  compact?: boolean;
}

/**
 * Radio-group based option picker. Sold-out options stay focusable for screen-reader context
 * but can't be chosen; their state is conveyed with text and a strike-through, not colour alone.
 */
export function VariantSelector({ product, selection, onChange, invalidGroups = [], groupAction, compact }: Props) {
  return (
    <div className={cn("flex flex-col", compact ? "gap-4" : "gap-6")}>
      {(product.variants ?? []).map((group) => {
        const selected = group.options.find((o) => o.value === selection[group.id]);
        const invalid = invalidGroups.includes(group.id);
        return (
          <fieldset key={group.id} aria-describedby={invalid ? `${product.id}-${group.id}-error` : undefined}>
            <div className="mb-2.5 flex items-center justify-between gap-4">
              <legend className="text-sm text-fg-muted">
                {group.name}: <span className="font-medium text-fg">{selected?.label ?? "Select"}</span>
              </legend>
              {groupAction?.(group.id)}
            </div>
            <div className={cn("flex flex-wrap", group.display === "swatch" ? "gap-2.5" : "gap-2")}>
              {group.options.map((option) => {
                const available = isOptionAvailable(product, group.id, option.value, selection);
                const checked = selection[group.id] === option.value;
                const id = `${product.id}-${group.id}-${option.value}`;
                return (
                  <label
                    key={option.value}
                    htmlFor={id}
                    title={available ? option.label : `${option.label} — sold out`}
                    className={cn(
                      "relative inline-flex items-center justify-center transition-[box-shadow,border-color,background-color] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg",
                      group.display === "swatch"
                        ? cn("size-9 rounded-full p-[3px] ring-1 ring-line", checked && "ring-2 ring-fg")
                        : cn("h-10 min-w-12 rounded-input border px-3.5 text-sm", checked ? "border-fg bg-fg text-bg" : "border-line bg-surface hover:border-fg/60"),
                      !available && "cursor-not-allowed",
                    )}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`${product.id}-${group.id}`}
                      value={option.value}
                      checked={checked}
                      aria-disabled={!available || undefined}
                      onChange={() => available && onChange(group.id, option.value)}
                      onClick={(e) => !available && e.preventDefault()}
                      className="sr-only"
                    />
                    {group.display === "swatch" ? (
                      <span className="relative block size-full rounded-full border border-black/10" style={{ background: option.swatch }}>
                        {!available && <span aria-hidden className="absolute top-1/2 left-1/2 h-px w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-fg" />}
                      </span>
                    ) : (
                      <span className={cn(!available && "text-fg-muted line-through decoration-1")}>{option.label}</span>
                    )}
                    <span className="sr-only">
                      {group.display === "swatch" ? option.label : ""}
                      {!available ? " (sold out)" : ""}
                    </span>
                  </label>
                );
              })}
            </div>
            {invalid && (
              <p id={`${product.id}-${group.id}-error`} role="alert" className="mt-2 text-sm font-medium text-sale">
                Please select a {group.name.toLowerCase()}.
              </p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
