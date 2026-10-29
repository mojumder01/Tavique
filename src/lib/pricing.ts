import { commerceConfig } from "@/config/commerce.config";
import type { StoreId } from "@/types/catalog";
import type { CartLine, CartTotals, DiscountRule, LineIssue, PricedLine, ShippingMethod } from "@/types/commerce";
import { formatMoney, toCents } from "./money";
import { resolveVariant, type VariantProduct } from "./variants";

export interface PricingProduct extends VariantProduct {
  slug: string;
  title: string;
  brand: string;
  niche: StoreId;
}

export interface PricingOptions {
  getProduct: (id: string) => PricingProduct | undefined;
  discountCode?: string | null;
  shippingMethodId?: string;
  discountRules?: readonly DiscountRule[];
  shippingMethods?: readonly ShippingMethod[];
  taxRate?: number;
  maxQuantityPerLine?: number;
}

export type DiscountCheck = { ok: true; rule: DiscountRule; amount: number; freeShipping: boolean; message: string } | { ok: false; message: string };

/** Validates a code against the current cart. Amounts are integer cents. */
export function checkDiscount(code: string, lines: Pick<PricedLine, "lineTotal" | "niche">[], rules: readonly DiscountRule[] = commerceConfig.discountCodes): DiscountCheck {
  const normalized = code.trim().toUpperCase();
  const rule = rules.find((r) => r.code === normalized);
  if (!rule) return { ok: false, message: `"${code.trim()}" isn't a valid code.` };
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  if (rule.minSubtotal && subtotal < toCents(rule.minSubtotal)) {
    return { ok: false, message: `${rule.code} needs a subtotal of ${formatMoney(toCents(rule.minSubtotal), { compact: true })} or more.` };
  }
  switch (rule.type) {
    case "percent": {
      const eligible = rule.niche ? lines.filter((l) => l.niche === rule.niche).reduce((s, l) => s + l.lineTotal, 0) : subtotal;
      if (eligible === 0) return { ok: false, message: `${rule.code} applies to ${rule.niche} products only.` };
      return { ok: true, rule, amount: Math.round((eligible * rule.value) / 100), freeShipping: false, message: rule.description };
    }
    case "fixed":
      return { ok: true, rule, amount: Math.min(toCents(rule.value), subtotal), freeShipping: false, message: rule.description };
    case "shipping":
      return { ok: true, rule, amount: 0, freeShipping: true, message: rule.description };
  }
}

/**
 * Prices a cart from scratch using catalogue data. Nothing price-related is read from the
 * persisted cart, so tampering with localStorage cannot change what a line costs.
 */
export function priceCart(lines: CartLine[], opts: PricingOptions): CartTotals {
  const methods = opts.shippingMethods ?? commerceConfig.shippingMethods;
  const maxPerLine = opts.maxQuantityPerLine ?? commerceConfig.maxQuantityPerLine;
  const taxRate = opts.taxRate ?? commerceConfig.taxRate;
  const priced: PricedLine[] = [];

  for (const line of lines) {
    const product = opts.getProduct(line.productId);
    if (!product) continue;
    const v = resolveVariant(product, line.options);
    const available = Math.min(v.stock, maxPerLine);
    let issue: LineIssue | undefined;
    let quantity = Math.max(1, Math.floor(line.quantity) || 1);
    if (!v.complete) issue = "invalid-options";
    else if (available <= 0) issue = "unavailable";
    else if (quantity > available) {
      quantity = available;
      issue = "quantity-reduced";
    }
    const sellable = issue !== "invalid-options" && issue !== "unavailable";
    const unitPrice = toCents(v.price);
    priced.push({
      key: line.key,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      niche: product.niche,
      image: v.image ?? product.images[0]?.src ?? "",
      imageAlt: product.images[0]?.alt ?? product.title,
      options: v.labels,
      unitPrice,
      unitOriginalPrice: v.originalPrice != null ? toCents(v.originalPrice) : undefined,
      quantity: sellable ? quantity : line.quantity,
      available: Math.max(0, available),
      lineTotal: sellable ? unitPrice * quantity : 0,
      issue,
    });
  }

  const subtotal = priced.reduce((s, l) => s + l.lineTotal, 0);
  const itemCount = priced.reduce((s, l) => s + (l.lineTotal > 0 ? l.quantity : 0), 0);

  let discount = 0;
  let discountMessage: string | undefined;
  let freeShippingCode = false;
  if (opts.discountCode) {
    const check = checkDiscount(opts.discountCode, priced, opts.discountRules);
    discountMessage = check.message;
    if (check.ok) {
      discount = check.amount;
      freeShippingCode = check.freeShipping;
    }
  }

  const method = methods.find((m) => m.id === opts.shippingMethodId) ?? methods[0];
  if (!method) throw new Error("At least one shipping method must be configured.");
  const afterDiscount = subtotal - discount;
  const standard = methods.find((m) => m.freeOver != null);
  const qualifiesFree = method.freeOver != null && afterDiscount >= toCents(method.freeOver);
  const shipping = itemCount === 0 || qualifiesFree || (freeShippingCode && method.id === methods[0]?.id) ? 0 : toCents(method.price);
  const tax = Math.round(afterDiscount * taxRate);
  const freeShippingRemaining = standard?.freeOver != null && !freeShippingCode ? Math.max(0, toCents(standard.freeOver) - afterDiscount) : 0;

  return {
    lines: priced,
    itemCount,
    subtotal,
    discount,
    discountCode: opts.discountCode ?? undefined,
    discountMessage,
    shipping,
    shippingMethod: method,
    tax,
    total: afterDiscount + shipping + tax,
    freeShippingRemaining,
  };
}

/** Demo order references look like "TQ-7K2M-49QX". Not cryptographically meaningful. */
export function createOrderReference(random: () => number = Math.random, now = Date.now()) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = (n: number) => Array.from({ length: n }, () => alphabet[Math.floor(random() * alphabet.length)]).join("");
  return `TQ-${now.toString(36).slice(-4).toUpperCase()}-${pick(4)}`;
}
