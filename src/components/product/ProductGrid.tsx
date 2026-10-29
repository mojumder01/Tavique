import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types/catalog";
import type { StoreConfig } from "@/types/store";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, card, columns = 4, priorityCount = 0, className }: { products: ProductSummary[]; card: StoreConfig["productCard"]; columns?: 3 | 4; priorityCount?: number; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5", columns === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3", card.style === "tech" && "gap-y-5", className)}>
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} style={card.style} aspect={card.aspect} priority={i < priorityCount} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
