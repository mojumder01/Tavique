import { formatMoney } from "@/lib/money";

export function FreeShippingProgress({ remaining, threshold }: { remaining: number; threshold: number }) {
  const pct = Math.min(100, Math.round(((threshold - remaining) / threshold) * 100));
  return (
    <div>
      <p className="text-sm" aria-live="polite">
        {remaining > 0 ? (
          <>
            You're <strong className="font-semibold">{formatMoney(remaining)}</strong> away from free standard shipping.
          </>
        ) : (
          <>You've unlocked free standard shipping.</>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-full rounded-full bg-success transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
