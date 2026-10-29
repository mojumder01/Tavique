import Link from "next/link";
import { storeHome } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { StoreId } from "@/types/catalog";
import type { StoreConfig } from "@/types/store";

export function Logo({ store, logo, className }: { store: StoreId; logo: StoreConfig["logo"]; className?: string }) {
  return (
    <Link href={storeHome(store)} className={cn("inline-flex shrink-0 items-baseline gap-1.5 text-fg", className)}>
      {logo.style === "serif-caps" && <span className="font-display text-[1.25rem] leading-none font-medium tracking-[0.24em] sm:text-[1.45rem] sm:tracking-[0.28em]">{logo.wordmark}</span>}
      {logo.style === "sans" && (
        <>
          <span className="font-display text-[1.45rem] leading-none font-bold tracking-[-0.04em]">{logo.wordmark}</span>
          {logo.suffix && " "}
          {logo.suffix && <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] leading-none font-semibold tracking-wide text-primary-fg uppercase">{logo.suffix}</span>}
        </>
      )}
      {logo.style === "serif" && (
        <>
          <span className="font-display text-[1.5rem] leading-none tracking-[-0.01em] sm:text-[1.7rem]">{logo.wordmark}</span>
          {logo.suffix && " "}
          {logo.suffix && <span className="hidden text-[10px] leading-none font-medium tracking-[0.3em] text-fg-muted uppercase xs:inline">{logo.suffix}</span>}
        </>
      )}
      <span className="sr-only"> home</span>
    </Link>
  );
}
