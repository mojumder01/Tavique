import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductDescriptionCard } from "@/components/product/pdp/ProductDescriptionCard";
import { ProductDetails } from "@/components/product/pdp/ProductDetails";
import { ProductReviews } from "@/components/product/pdp/ProductReviews";
import { ProductSpecsCard } from "@/components/product/pdp/ProductSpecsCard";
import { SuggestedProducts } from "@/components/product/pdp/SuggestedProducts";
import { ProductView, type ProductViewData } from "@/components/product/pdp/ProductView";
import { RecentlyViewed } from "@/components/product/pdp/RecentlyViewed";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { enabledStores, getStoreConfig } from "@/config/stores";
import { getCategory } from "@/data/categories";
import { getProductBySlug, products, summariesFor } from "@/data/products";
import { categoryHref, productHref, storeHome } from "@/lib/routes";
import { productJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

// Only the slugs from generateStaticParams exist; anything else is a 404.
export const dynamicParams = false;

const aspects = { "3/4": "aspect-[3/4]", "4/5": "aspect-[4/5]", "1/1": "aspect-square" } as const;

export function generateStaticParams() {
  return products.filter((p) => enabledStores.includes(p.niche)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return {};
  const description = product.description.length > 155 ? `${product.description.slice(0, 152).trimEnd()}…` : product.description;
  return {
    title: `${product.title} — ${product.brand}`,
    description,
    alternates: { canonical: productHref(product.slug) },
    openGraph: { type: "website", title: product.title, description, url: productHref(product.slug), images: product.images.slice(0, 1).map((i) => ({ url: i.src, alt: i.alt })) },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProductBySlug((await params).slug);
  if (!product || !enabledStores.includes(product.niche)) notFound();
  const config = getStoreConfig(product.niche);
  const category = getCategory(product.categories[0] ?? "");
  const pool = summariesFor(product.niche).filter((p) => p.id !== product.id);
  const related = [...pool.filter((p) => p.categories.some((c) => product.categories.includes(c))), ...pool.filter((p) => !p.categories.some((c) => product.categories.includes(c)))];
  const suggested = related.slice(0, 4);
  const more = related.slice(4, 12);

  const view: ProductViewData = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    subtitle: product.subtitle,
    brand: product.brand,
    niche: product.niche,
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images: product.images,
    variants: product.variants ?? [],
    badges: product.badges ?? [],
    sizeGuide: product.fashion?.sizeGuide,
    fit: product.fashion?.fit,
    warranty: product.electronics?.warranty,
  };

  return (
    <StoreShell store={product.niche}>
      <JsonLd data={productJsonLd(product)} />
      <div className="page pt-6 pb-16 md:pt-8 md:pb-24">
        <Breadcrumbs
          className="mb-6"
          items={[{ label: "Home", href: storeHome(product.niche) }, ...(category ? [{ label: category.name, href: categoryHref(category.slug) }] : []), { label: product.title }]}
        />
        <ProductView
          product={view}
          aspect={aspects[config.productCard.aspect]}
          details={<ProductDetails product={product} />}
          below={
            <>
              <ProductDescriptionCard product={product} />
              {product.specifications && product.specifications.length > 0 && <ProductSpecsCard groups={product.specifications} title={product.electronics ? "Technical specifications" : "Specifications"} />}
              <ProductReviews product={product} />
              <SuggestedProducts products={suggested} title={product.niche === "fashion" ? "Complete the look" : "You may also like"} />
            </>
          }
        />
      </div>
      {more.length >= 3 && (
        <section aria-labelledby="related-title" className="page pb-20">
          <SectionHeading id="related-title" title={category ? `More from ${category.name}` : "More to explore"} titleClassName="text-2xl md:text-3xl" className="md:mb-0" />
          <ProductCarousel products={more} card={config.productCard} label="More products" />
        </section>
      )}
      <RecentlyViewed excludeId={product.id} card={config.productCard} />
    </StoreShell>
  );
}
