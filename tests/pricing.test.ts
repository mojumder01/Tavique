import { describe, expect, it } from "vitest";
import { checkDiscount, createOrderReference, priceCart, type PricingProduct } from "@/lib/pricing";
import type { CartLine } from "@/types/commerce";

const coat: PricingProduct = {
  id: "coat",
  slug: "coat",
  title: "Coat",
  brand: "Tavique",
  niche: "fashion",
  price: 100,
  originalPrice: 120,
  stock: 5,
  images: [{ src: "/coat.webp", alt: "Coat" }],
  variants: [
    { id: "size", name: "Size", display: "pill", options: [{ value: "s", label: "S" }, { value: "m", label: "M", stock: 2 }, { value: "l", label: "L", stock: 0 }] },
    { id: "color", name: "Colour", display: "swatch", options: [{ value: "camel", label: "Camel", image: "/camel.webp" }, { value: "black", label: "Black", priceDelta: 10 }] },
  ],
};
const serum: PricingProduct = { id: "serum", slug: "serum", title: "Serum", brand: "Skin", niche: "beauty", price: 40, stock: 50, images: [{ src: "/s.webp", alt: "Serum" }] };
const catalogue = new Map([coat, serum].map((p) => [p.id, p]));
const getProduct = (id: string) => catalogue.get(id);
const line = (productId: string, options: Record<string, string>, quantity: number): CartLine => ({ key: `${productId}-${JSON.stringify(options)}`, productId, options, quantity });

describe("priceCart", () => {
  it("prices lines from the catalogue in cents, including option price deltas", () => {
    const t = priceCart([line("coat", { size: "s", color: "black" }, 2), line("serum", {}, 1)], { getProduct });
    expect(t.lines[0]?.unitPrice).toBe(11000);
    expect(t.lines[0]?.unitOriginalPrice).toBe(13000);
    expect(t.subtotal).toBe(26000);
    expect(t.itemCount).toBe(3);
  });

  it("ignores products that no longer exist", () => {
    const t = priceCart([line("ghost", {}, 1), line("serum", {}, 1)], { getProduct });
    expect(t.lines).toHaveLength(1);
    expect(t.subtotal).toBe(4000);
  });

  it("caps quantities to option stock and flags the change", () => {
    const t = priceCart([line("coat", { size: "m", color: "camel" }, 4)], { getProduct });
    expect(t.lines[0]?.quantity).toBe(2);
    expect(t.lines[0]?.issue).toBe("quantity-reduced");
    expect(t.lines[0]?.image).toBe("/camel.webp");
  });

  it("excludes sold-out and incomplete selections from totals", () => {
    const t = priceCart([line("coat", { size: "l", color: "camel" }, 1), line("coat", { size: "s" }, 1)], { getProduct });
    expect(t.lines.map((l) => l.issue)).toEqual(["unavailable", "invalid-options"]);
    expect(t.subtotal).toBe(0);
    expect(t.shipping).toBe(0);
  });

  it("charges shipping below the free threshold and waives it above", () => {
    expect(priceCart([line("serum", {}, 1)], { getProduct }).shipping).toBe(800);
    expect(priceCart([line("serum", {}, 4)], { getProduct }).shipping).toBe(0);
    expect(priceCart([line("serum", {}, 1)], { getProduct }).freeShippingRemaining).toBe(11000);
  });

  it("adds estimated tax on the discounted subtotal and totals correctly", () => {
    const t = priceCart([line("serum", {}, 1)], { getProduct, discountCode: "WELCOME10", taxRate: 0.1 });
    expect(t.discount).toBe(400);
    expect(t.tax).toBe(360);
    expect(t.total).toBe(4000 - 400 + 800 + 360);
  });

  it("uses the selected shipping method", () => {
    const t = priceCart([line("serum", {}, 4)], { getProduct, shippingMethodId: "express" });
    expect(t.shippingMethod.id).toBe("express");
    expect(t.shipping).toBe(1800);
  });
});

describe("checkDiscount", () => {
  const lines = [
    { lineTotal: 10000, niche: "fashion" as const },
    { lineTotal: 4000, niche: "beauty" as const },
  ];
  it("rejects unknown codes", () => expect(checkDiscount("NOPE", lines).ok).toBe(false));
  it("is case-insensitive", () => expect(checkDiscount("welcome10", lines)).toMatchObject({ ok: true, amount: 1400 }));
  it("enforces minimum subtotals", () => {
    expect(checkDiscount("TAVIQUE25", lines).ok).toBe(false);
    expect(checkDiscount("TAVIQUE25", [...lines, { lineTotal: 1000, niche: "fashion" }])).toMatchObject({ ok: true, amount: 2500 });
  });
  it("limits niche codes to matching items", () => {
    expect(checkDiscount("GLOW15", lines)).toMatchObject({ ok: true, amount: 600 });
    expect(checkDiscount("GLOW15", [{ lineTotal: 5000, niche: "fashion" }]).ok).toBe(false);
  });
  it("FREESHIP waives standard shipping in priceCart", () => {
    const t = priceCart([line("serum", {}, 2)], { getProduct, discountCode: "FREESHIP" });
    expect(t.shipping).toBe(0);
    expect(t.discount).toBe(0);
  });
});

describe("createOrderReference", () => {
  it("produces a readable demo reference", () => {
    expect(createOrderReference(() => 0.5, 1_800_000_000_000)).toMatch(/^TQ-[0-9A-Z]{4}-[A-Z2-9]{4}$/);
  });
});
