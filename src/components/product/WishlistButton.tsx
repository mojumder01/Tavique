"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/store/hydration";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";

export function WishlistButton({ productId, title, className, variant = "icon" }: { productId: string; title: string; className?: string; variant?: "icon" | "button" }) {
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.ids.includes(productId)) && hydrated;
  const toggle = useWishlist((s) => s.toggle);
  const toast = useUI((s) => s.toast);
  const onClick = () => {
    const now = toggle(productId);
    toast(now ? { title: "Saved to wishlist", description: title, tone: "success", action: { label: "View wishlist", href: "/wishlist" } } : { title: "Removed from wishlist", description: title });
  };
  if (variant === "button") {
    return (
      <button type="button" onClick={onClick} aria-pressed={saved} className={cn("btn-type inline-flex h-12 items-center justify-center gap-2 rounded-btn border border-line px-5 hover:border-fg", className)}>
        <Heart className={cn("size-4", saved && "fill-current")} aria-hidden />
        {saved ? "Saved" : "Save"}
        <span className="sr-only"> {title} to wishlist</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      title={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn("inline-flex size-9 items-center justify-center rounded-full bg-surface/90 text-fg shadow-sm backdrop-blur transition hover:scale-105 hover:bg-surface", className)}
    >
      <Heart className={cn("size-4 transition-colors", saved && "fill-sale text-sale")} aria-hidden />
    </button>
  );
}
