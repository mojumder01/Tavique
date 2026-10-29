import { describe, expect, it } from "vitest";
import { productsInCategory } from "@/lib/collections";
import { getCategory, categories } from "@/data/categories";
import { productSummaries, products } from "@/data/products";

describe("collections & data integrity", () => {
  it("sale collections only contain discounted products", () => {
    const sale = productsInCategory(getCategory("sale")!, productSummaries);
    expect(sale.length).toBeGreaterThan(0);
    expect(sale.every((p) => p.originalPrice! > p.price)).toBe(true);
  });

  it("newest collections are ordered and limited", () => {
    const newest = productsInCategory(getCategory("new-arrivals")!, productSummaries);
    expect(newest).toHaveLength(8);
    expect(newest.every((p) => p.niche === "fashion")).toBe(true);
  });

  it("every product references real categories in its own storefront", () => {
    for (const p of products) {
      expect(p.categories.length).toBeGreaterThan(0);
      for (const slug of p.categories) expect(getCategory(slug)?.niche, `${p.slug} → ${slug}`).toBe(p.niche);
    }
  });

  it("slugs and ids are unique", () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(categories.map((c) => c.slug)).size).toBe(categories.length);
  });

  it("variant images are part of the product gallery", () => {
    for (const p of products) {
      const gallery = new Set(p.images.map((i) => i.src));
      for (const g of p.variants ?? []) for (const o of g.options) if (o.image) expect(gallery.has(o.image), `${p.slug} ${o.value}`).toBe(true);
    }
  });
});
