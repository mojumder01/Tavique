import type { ProductImage, StoreId, VariantGroup, VariantOption } from "@/types/catalog";

/** Path to a demo product image in /public/images/<niche>/products. */
export const img = (niche: StoreId, file: string, alt: string): ProductImage => ({
  src: `/images/${niche}/products/${file}.webp`,
  alt,
});

type ColourInput = [value: string, label: string, swatch: string, extra?: Partial<VariantOption>];

/**
 * A colour/shade group whose options each switch the gallery to `<slug>-<value>.webp`.
 * Pass `withImages: false` when the colours have no dedicated imagery.
 */
export function swatches(
  niche: StoreId,
  slug: string,
  colours: ColourInput[],
  { id = "color", name = "Colour", withImages = true }: { id?: string; name?: string; withImages?: boolean } = {},
): VariantGroup {
  return {
    id,
    name,
    display: "swatch",
    options: colours.map(([value, label, swatch, extra]) => ({
      value,
      label,
      swatch,
      ...(withImages ? { image: `/images/${niche}/products/${slug}-${value}.webp` } : {}),
      ...extra,
    })),
  };
}

type PillInput = string | [value: string, extra: Partial<VariantOption> & { label?: string }];

export function pills(id: string, name: string, values: PillInput[]): VariantGroup {
  return {
    id,
    name,
    display: "pill",
    options: values.map((v) => {
      if (typeof v === "string") return { value: v.toLowerCase().replace(/\s+/g, "-"), label: v };
      const [label, extra] = v;
      return { value: label.toLowerCase().replace(/\s+/g, "-"), label: extra.label ?? label, ...extra };
    }),
  };
}

/**
 * Gallery for a product with colour variants: first colour, the alternate shot (used as the
 * card hover image), then the remaining colours.
 */
export function colourGallery(niche: StoreId, slug: string, title: string, colours: ColourInput[], altLabel: string): ProductImage[] {
  const [first, ...rest] = colours.map(([value, label]) => img(niche, `${slug}-${value}`, `${title} in ${label}`));
  return [...(first ? [first] : []), img(niche, `${slug}-alt`, altLabel), ...rest];
}
