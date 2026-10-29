import type { Category, StoreId } from "@/types/catalog";

// Categories with a `rule` are virtual collections; the rest match products by membership.
export const categories: Category[] = [
  // Fashion & Lifestyle
  { slug: "new-arrivals", niche: "fashion", name: "New Arrivals", description: "The latest pieces from the studio — considered layers, fresh silhouettes and seasonal colour.", image: "/images/fashion/categories/new-arrivals.webp", rule: { type: "newest", limit: 8 } },
  { slug: "womens", niche: "fashion", name: "Women's", description: "Fluid tailoring, bias-cut silk and coats designed to be lived in.", image: "/images/fashion/categories/womens.webp" },
  { slug: "mens", niche: "fashion", name: "Men's", description: "Relaxed tailoring, garment-dyed shirting and outerwear built for years of wear.", image: "/images/fashion/categories/mens.webp" },
  { slug: "footwear", niche: "fashion", name: "Footwear", description: "Resoleable sneakers, boots and loafers made in Portugal and Spain.", image: "/images/fashion/categories/footwear.webp" },
  { slug: "bags", niche: "fashion", name: "Bags", description: "Vegetable-tanned leather bags that develop a patina over time.", image: "/images/fashion/categories/bags.webp" },
  { slug: "accessories", niche: "fashion", name: "Accessories", description: "Cashmere, eyewear and timepieces to finish every look.", image: "/images/fashion/categories/accessories.webp" },
  { slug: "sale", niche: "fashion", name: "Sale", description: "Final pieces from past seasons at reduced prices, while sizes last.", image: "/images/fashion/categories/sale.webp", rule: { type: "sale" } },
  { slug: "shop-fashion", niche: "fashion", name: "Shop All", description: "Every piece in the Tavique fashion collection.", image: "/images/fashion/rack.webp", rule: { type: "all" } },

  // Electronics & Gadgets
  { slug: "smartphones", niche: "electronics", name: "Smartphones", description: "Flagship cameras, all-day batteries and displays that shine outdoors.", image: "/images/electronics/categories/smartphones.webp" },
  { slug: "laptops", niche: "electronics", name: "Laptops & Tablets", description: "Ultralight notebooks, pro machines and tablets for work and play.", image: "/images/electronics/categories/laptops.webp" },
  { slug: "audio", niche: "electronics", name: "Audio", description: "Noise-cancelling headphones, earbuds and speakers tuned for detail.", image: "/images/electronics/categories/audio.webp" },
  { slug: "smartwatches", niche: "electronics", name: "Smartwatches", description: "Health, fitness and notifications on your wrist.", image: "/images/electronics/categories/smartwatches.webp" },
  { slug: "gaming", niche: "electronics", name: "Gaming", description: "Handheld PCs, controllers and gear for every setup.", image: "/images/electronics/categories/gaming.webp" },
  { slug: "tech-accessories", niche: "electronics", name: "Accessories", description: "Keyboards, power banks and the essentials that keep you going.", image: "/images/electronics/categories/tech-accessories.webp" },
  { slug: "home-electronics", niche: "electronics", name: "Smart Home", description: "Smart displays, robot vacuums and connected home essentials.", image: "/images/electronics/categories/home-electronics.webp" },
  { slug: "deals", niche: "electronics", name: "Deals", description: "Limited-time prices on bestselling tech.", image: "/images/electronics/promo.webp", rule: { type: "sale" } },
  { slug: "new-releases", niche: "electronics", name: "New Releases", description: "Just landed — the newest devices in store.", image: "/images/electronics/hero.webp", rule: { type: "newest", limit: 6 } },
  { slug: "shop-electronics", niche: "electronics", name: "All Electronics", description: "Every device and accessory in the store.", image: "/images/electronics/compare.webp", rule: { type: "all" } },

  // Beauty & Personal Care
  { slug: "skincare", niche: "beauty", name: "Skincare", description: "Effective, gentle formulas for healthy, balanced skin.", image: "/images/beauty/categories/skincare.webp" },
  { slug: "makeup", niche: "beauty", name: "Makeup", description: "Skin-first colour that looks like you, only fresher.", image: "/images/beauty/categories/makeup.webp" },
  { slug: "haircare", niche: "beauty", name: "Haircare", description: "Repair, shine and strength for every hair type.", image: "/images/beauty/categories/haircare.webp" },
  { slug: "fragrance", niche: "beauty", name: "Fragrance", description: "Modern scents with natural character.", image: "/images/beauty/categories/fragrance.webp" },
  { slug: "body-care", niche: "beauty", name: "Body Care", description: "Lotions, mists and creams for soft, comfortable skin.", image: "/images/beauty/categories/body-care.webp" },
  { slug: "personal-care", niche: "beauty", name: "Personal Care", description: "Everyday essentials made gentler.", image: "/images/beauty/categories/personal-care.webp" },
  { slug: "bestsellers", niche: "beauty", name: "Bestsellers", description: "Our community's most-loved formulas.", image: "/images/beauty/routine.webp", rule: { type: "badge", badge: "bestseller" } },
  { slug: "shop-beauty", niche: "beauty", name: "All Beauty", description: "Every formula across skincare, makeup, hair, body and fragrance.", image: "/images/beauty/routine.webp", rule: { type: "all" } },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));
export const getCategory = (slug: string) => bySlug.get(slug);
export const getCategoriesByStore = (store: StoreId) => categories.filter((c) => c.niche === store);
