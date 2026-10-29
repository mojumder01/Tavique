import { describe, expect, it } from "vitest";
import { searchProducts, suggest, tokenize } from "@/lib/search";
import { productSummaries } from "@/data/products";
import { categories } from "@/data/categories";

const names = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

describe("search", () => {
  it("normalises plurals, accents and stop words", () => {
    expect(tokenize("The Boots")).toEqual(["boot"]);
    expect(tokenize("Maré")).toEqual(["mare"]);
  });

  it("matches titles, brands, categories and tags", () => {
    expect(searchProducts("overcoat", productSummaries, names)[0]?.slug).toBe("wool-cashmere-overcoat");
    expect(searchProducts("halden", productSummaries, names).every((p) => p.brand === "Halden Audio")).toBe(true);
    expect(searchProducts("smartwatches", productSummaries, names).length).toBeGreaterThanOrEqual(2);
    expect(searchProducts("noise cancelling", productSummaries, names).map((p) => p.slug)).toContain("halden-aura-anc-headphones");
  });

  it("requires every term to match", () => {
    expect(searchProducts("leather tote", productSummaries, names).map((p) => p.slug)).toEqual(["structured-leather-tote"]);
    expect(searchProducts("leather headphones", productSummaries, names)).toEqual([]);
  });

  it("handles prefixes and unicode hyphens", () => {
    expect(searchProducts("headph", productSummaries, names).length).toBeGreaterThan(0);
    expect(searchProducts("wi-fi", productSummaries, names).length).toBeGreaterThan(0);
  });

  it("returns empty for blank queries", () => expect(searchProducts("   ", productSummaries, names)).toEqual([]));

  it("suggests products, categories and brands", () => {
    const s = suggest("audio", productSummaries, categories);
    expect(s.categories.map((c) => c.slug)).toContain("audio");
    expect(s.brands).toContain("Halden Audio");
  });
});
