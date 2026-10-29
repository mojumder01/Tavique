import Link from "next/link";
import { RatingStars } from "@/components/ui/RatingStars";
import { productHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/store";

/** Store-level testimonial. Copy comes from config and is demo content — replace with genuine reviews. */
export function TestimonialCard({ t, variant = "card", productTitle }: { t: Testimonial; variant?: "card" | "quote"; productTitle?: string }) {
  return (
    <figure className={cn("flex h-full flex-col", variant === "card" && "rounded-card border border-line bg-surface p-6")}>
      <RatingStars rating={t.rating} size={variant === "quote" ? 14 : 13} />
      <blockquote className={cn("mt-4 flex-1", variant === "quote" ? "heading text-2xl leading-snug md:text-[1.75rem]" : "text-[0.9375rem] leading-relaxed")}>
        <p>“{t.quote}”</p>
      </blockquote>
      <figcaption className="mt-6 text-sm">
        <span className="font-medium">{t.author}</span>
        <span className="text-fg-muted"> · {t.meta}</span>
        {t.product && productTitle && (
          <Link href={productHref(t.product)} className="mt-1 block text-xs text-fg-muted underline underline-offset-4 hover:text-fg">
            {productTitle}
          </Link>
        )}
      </figcaption>
    </figure>
  );
}
