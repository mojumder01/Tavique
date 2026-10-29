import { describe, expect, it } from "vitest";
import { activeFilterCount, applyFilters, facetValues, parseFilters, serializeFilters, sortProducts } from "@/lib/filters";
import { summariesFor } from "@/data/products";
import { fashionConfig } from "@/config/stores/fashion.config";

const items = summariesFor("fashion");
const facets = fashionConfig.filters;

describe("filters", () => {
  it("round-trips state through URL params and keeps unrelated params", () => {
    const params = new URLSearchParams("q=coat&material=Wool,Cashmere&price=100-300&sort=price-asc&stock=in&color=camel");
    const state = parseFilters(params, facets);
    expect(state.attrs.material).toEqual(["Wool", "Cashmere"]);
    expect(state.price).toEqual({ min: 100, max: 300 });
    expect(state.options.color).toEqual(["camel"]);
    expect(activeFilterCount(state)).toBe(5);
    const out = serializeFilters(state, params);
    expect(out.get("q")).toBe("coat");
    expect(out.get("material")).toBe("Wool,Cashmere");
  });

  it("ignores facets that aren't configured", () => {
    const state = parseFilters(new URLSearchParams("connectivity=5G"), facets);
    expect(state.attrs).toEqual({});
  });

  it("filters by attribute, price and option", () => {
    const state = parseFilters(new URLSearchParams("material=Leather&price=-200"), facets);
    const result = applyFilters(items, state);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.attributes.material?.includes("Leather") && p.price <= 200)).toBe(true);
  });

  it("sorts by price and recency", () => {
    const asc = sortProducts(items, "price-asc").map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const newest = sortProducts(items, "newest");
    expect(newest[0]!.createdAt >= newest[newest.length - 1]!.createdAt).toBe(true);
  });

  it("computes facet counts that ignore the facet's own selection", () => {
    const state = parseFilters(new URLSearchParams("material=Silk"), facets);
    const materials = facetValues(items, state, "attr:material");
    expect(materials.find((m) => m.value === "Wool")?.count).toBeGreaterThan(0);
    expect(materials.find((m) => m.value === "Silk")?.count).toBe(1);
  });
});
