import type { Category, ProductSummary } from "@/types/catalog";

type Collectable = Pick<ProductSummary, "niche" | "categories" | "createdAt" | "originalPrice" | "price" | "badges">;

/** Products belonging to a category — by membership, or by rule for virtual collections. */
export function productsInCategory<T extends Collectable>(category: Category, items: T[]): T[] {
  const pool = items.filter((p) => p.niche === category.niche);
  const rule = category.rule;
  if (!rule) return pool.filter((p) => p.categories.includes(category.slug));
  switch (rule.type) {
    case "all":
      return pool;
    case "sale":
      return pool.filter((p) => p.originalPrice != null && p.originalPrice > p.price);
    case "badge":
      return pool.filter((p) => p.badges.includes(rule.badge));
    case "newest":
      return [...pool].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, rule.limit);
  }
}
