import { describe, expect, it } from "vitest";
import { defaultSelection, isOptionAvailable, lineKey, needsSelection, resolveVariant } from "@/lib/variants";
import { getProductBySlug } from "@/data/products";

const phone = getProductBySlug("arcline-one-pro")!;

describe("variants", () => {
  it("reports missing groups until every choice is made", () => {
    const r = resolveVariant(phone, { color: "graphite" });
    expect(r.complete).toBe(false);
    expect(r.missing).toEqual(["storage"]);
  });

  it("applies price deltas and option images", () => {
    const r = resolveVariant(phone, { color: "glacier", storage: "256-gb" });
    expect(r.complete).toBe(true);
    expect(r.price).toBe(phone.price + 100);
    expect(r.image).toContain("arcline-one-pro-glacier");
  });

  it("treats unknown groups or values as invalid", () => {
    expect(resolveVariant(phone, { color: "pink", storage: "128-gb" }).invalid).toBe(true);
    expect(resolveVariant(phone, { colour: "graphite" }).invalid).toBe(true);
  });

  it("knows which options are sold out", () => {
    expect(isOptionAvailable(phone, "storage", "512-gb", { color: "graphite" })).toBe(false);
    expect(isOptionAvailable(phone, "storage", "128-gb", { color: "graphite" })).toBe(true);
  });

  it("builds order-independent line keys", () => {
    expect(lineKey("p", { b: "2", a: "1" })).toBe(lineKey("p", { a: "1", b: "2" }));
    expect(lineKey("p", {})).toBe("p");
  });

  it("can pre-fill the first in-stock option", () => {
    const sel = defaultSelection(phone, { fillAll: true });
    expect(sel).toEqual({ color: "graphite", storage: "128-gb" });
    expect(needsSelection(phone)).toBe(true);
  });
});
