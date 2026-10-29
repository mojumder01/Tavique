import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-input border border-line bg-surface px-3.5 text-[0.9375rem] text-fg placeholder:text-fg-muted/80 transition-colors hover:border-fg/40 focus:border-fg focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 aria-[invalid=true]:border-sale disabled:opacity-60";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint + error, wired together with ids for screen readers. */
export function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
        {optional && <span className="ml-1 font-normal text-fg-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-xs font-medium text-sale">
          <span aria-hidden>!</span> {error}
        </p>
      )}
    </div>
  );
}

/** aria props that link a control to its Field's hint/error text. */
export const describedBy = (id: string, error?: string, hint?: boolean) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClass, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(inputClass, "min-h-32 py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(inputClass, "h-11 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-muted">
        <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

export function Checkbox({ label, className, ...props }: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-sm text-fg", className)}>
      <input type="checkbox" className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--c-primary)]" {...props} />
      <span>{label}</span>
    </label>
  );
}
