import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { cn } from "@/lib/utils";
import type { StoreId } from "@/types/catalog";

export function NewsletterSection({ store, title, body, className, align = "center" }: { store: StoreId; title: string; body: string; className?: string; align?: "center" | "split" }) {
  return (
    <section aria-labelledby={`${store}-newsletter-title`} className={cn("py-20 md:py-28", className)}>
      <div className={cn("page", align === "center" ? "flex flex-col items-center text-center" : "grid gap-8 md:grid-cols-2 md:items-end")}>
        <div className={cn(align === "center" && "max-w-xl")}>
          <h2 id={`${store}-newsletter-title`} className="heading text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">{body}</p>
        </div>
        <div className={cn("w-full", align === "center" ? "mt-8 max-w-md" : "")}>
          <NewsletterForm store={store} id={`${store}-newsletter`} />
        </div>
      </div>
    </section>
  );
}
