import { beforeEach, describe, expect, it } from "vitest";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

describe("cart store", () => {
  beforeEach(() => useCart.setState({ lines: [], discountCode: null }));

  it("merges identical selections and caps to stock", () => {
    const { add } = useCart.getState();
    expect(add({ productId: "p", options: { size: "m" }, quantity: 2, max: 3 })).toBe(2);
    expect(add({ productId: "p", options: { size: "m" }, quantity: 5, max: 3 })).toBe(1);
    expect(add({ productId: "p", options: { size: "m" }, max: 3 })).toBe(0);
    expect(useCart.getState().lines).toHaveLength(1);
    expect(useCart.getState().lines[0]?.quantity).toBe(3);
  });

  it("keeps different options as separate lines", () => {
    const { add } = useCart.getState();
    add({ productId: "p", options: { size: "m" }, max: 5 });
    add({ productId: "p", options: { size: "l" }, max: 5 });
    expect(useCart.getState().lines).toHaveLength(2);
  });

  it("updates quantity, removes at zero and clears codes on clear()", () => {
    const { add, setQuantity, applyCode, clear } = useCart.getState();
    add({ productId: "p", options: {}, max: 5 });
    const key = useCart.getState().lines[0]!.key;
    setQuantity(key, 9, 4);
    expect(useCart.getState().lines[0]?.quantity).toBe(4);
    setQuantity(key, 0, 4);
    expect(useCart.getState().lines).toHaveLength(0);
    applyCode(" welcome10 ");
    expect(useCart.getState().discountCode).toBe("WELCOME10");
    clear();
    expect(useCart.getState().discountCode).toBeNull();
  });

  it("changing options merges into an existing matching line", () => {
    const { add, changeOptions } = useCart.getState();
    add({ productId: "p", options: { size: "m" }, quantity: 1, max: 5 });
    add({ productId: "p", options: { size: "l" }, quantity: 2, max: 5 });
    const key = useCart.getState().lines[0]!.key;
    changeOptions(key, { size: "l" }, 5);
    expect(useCart.getState().lines).toEqual([expect.objectContaining({ options: { size: "l" }, quantity: 3 })]);
  });
});

describe("wishlist store", () => {
  it("toggles items", () => {
    const { toggle } = useWishlist.getState();
    expect(toggle("a")).toBe(true);
    expect(useWishlist.getState().has("a")).toBe(true);
    expect(toggle("a")).toBe(false);
    expect(useWishlist.getState().ids).toEqual([]);
  });
});
