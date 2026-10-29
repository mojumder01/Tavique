import type { ProductImage, VariantGroup, VariantOption } from "@/types/catalog";
import type { SelectedOptions } from "@/types/commerce";

/** The fields variant logic needs — satisfied by both Product and ProductSummary. */
export interface VariantProduct {
  id: string;
  price: number;
  originalPrice?: number;
  stock: number;
  variants?: VariantGroup[];
  images: ProductImage[];
}

export interface ResolvedVariant {
  /** Every group has a valid selection. */
  complete: boolean;
  /** Group ids that still need a choice. */
  missing: string[];
  /** A selection references a group or value that doesn't exist. */
  invalid: boolean;
  price: number;
  originalPrice?: number;
  stock: number;
  image?: string;
  labels: { group: string; label: string }[];
}

const optionStock = (product: VariantProduct, option?: VariantOption) => Math.min(product.stock, option?.stock ?? Number.POSITIVE_INFINITY);

export function resolveVariant(product: VariantProduct, selection: SelectedOptions): ResolvedVariant {
  const groups = product.variants ?? [];
  const known = new Set(groups.map((g) => g.id));
  let invalid = Object.keys(selection).some((k) => !known.has(k));
  const missing: string[] = [];
  const labels: ResolvedVariant["labels"] = [];
  let delta = 0;
  let stock = product.stock;
  let image: string | undefined;

  for (const group of groups) {
    const value = selection[group.id];
    if (!value) {
      missing.push(group.id);
      continue;
    }
    const option = group.options.find((o) => o.value === value);
    if (!option) {
      invalid = true;
      continue;
    }
    delta += option.priceDelta ?? 0;
    stock = Math.min(stock, optionStock(product, option));
    if (option.image && !image) image = option.image;
    labels.push({ group: group.name, label: option.label });
  }

  return {
    complete: !invalid && missing.length === 0,
    missing,
    invalid,
    price: product.price + delta,
    originalPrice: product.originalPrice != null ? product.originalPrice + delta : undefined,
    stock: Math.max(0, stock),
    image,
    labels,
  };
}

/** Is this option purchasable given the other current selections? */
export function isOptionAvailable(product: VariantProduct, groupId: string, value: string, selection: SelectedOptions) {
  return resolveVariant(product, { ...selection, [groupId]: value }).stock > 0;
}

/**
 * Pre-selects groups with a single option. `fillSwatches` also picks the first in-stock colour/shade
 * (matching the image the shopper is looking at); `fillAll` fills every group.
 */
export function defaultSelection(product: VariantProduct, { fillAll = false, fillSwatches = false }: { fillAll?: boolean; fillSwatches?: boolean } = {}): SelectedOptions {
  const selection: SelectedOptions = {};
  for (const group of product.variants ?? []) {
    if (group.options.length === 1 || fillAll || (fillSwatches && group.display === "swatch")) {
      const first = group.options.find((o) => optionStock(product, o) > 0) ?? group.options[0];
      if (first) selection[group.id] = first.value;
    }
  }
  return selection;
}

/** Stable identity for a cart line: same product + same options = same line. */
export function lineKey(productId: string, options: SelectedOptions) {
  const parts = Object.keys(options)
    .sort()
    .map((k) => `${k}=${options[k]}`);
  return parts.length ? `${productId}::${parts.join("|")}` : productId;
}

/** True when the product needs the shopper to choose something before adding to cart. */
export const needsSelection = (product: VariantProduct) => (product.variants ?? []).some((g) => g.options.length > 1);
