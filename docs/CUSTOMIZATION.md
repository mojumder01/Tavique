# Customization

Most changes are made in typed config and data files. Because TypeScript checks them, a typo or a missing field fails `npm run typecheck` before it can ship.

| What | Where |
| --- | --- |
| Site name, home route, enabled stores, contact details | `src/config/site.config.ts` |
| Tax, shipping methods, discount codes, payment options, countries | `src/config/commerce.config.ts` |
| A storefront's theme, header, navigation, footer, filters, homepage | `src/config/stores/<store>.config.ts` |
| Products | `src/data/products/<store>.ts` |
| Categories and collections | `src/data/categories.ts` |
| FAQ content | `src/data/content.ts` |
| About, contact, shipping and returns copy | `src/app/<route>/page.tsx` |
| Images | `public/images/<store>/…` |

## 1. Brand and site settings

`src/config/site.config.ts`:

```ts
export const siteConfig = {
  name: "Tavique",              // used in page titles, the footer and JSON-LD
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  home: "showcase",             // "showcase" | "fashion" | "electronics" | "beauty"
  defaultStore: "fashion",      // theme for shared pages before a visitor picks a store
  enabledStores: ["fashion", "electronics", "beauty"],
  showStoreSwitcher: true,      // demo control in the announcement bar, menus and footer
  demoMode: true,               // shows "demo" notices on checkout, discount codes and forms
  locale: "en-US",
  currency: "USD",
  contact: { email, phone, address, hours },
};
```

The logo is text-based (`logo` in each store config), so a new name needs no artwork. To use an image logo instead, edit `src/components/layout/Logo.tsx` and keep the visible name in the link's accessible text.

Replace `src/app/icon.svg` (favicon) and `public/images/og/tavique.jpg` (default social image, 1200×630).

## 2. Single-store setup

To sell in one niche only:

```ts
home: "fashion",
enabledStores: ["fashion"],
showStoreSwitcher: false,
```

After that:

- `/` renders the Fashion homepage, and `/fashion` permanently redirects to `/`.
- Electronics and Beauty storefronts, categories and products return 404. They're left out of the build, the sitemap and search results.
- Shared pages (cart, checkout, FAQ…) always use the Fashion theme.

Once you're happy, you can delete the unused store's config, products, categories, homepage component and images. TypeScript will point you to every reference.

## 3. Colours, fonts and shape

Each store's `theme` drives every component through CSS variables, so there are no hard-coded colours to hunt down:

```ts
theme: {
  light: {
    background, surface, muted,            // page, cards/panels, subtle fills
    foreground, foregroundMuted, border,   // text and dividers
    primary, primaryForeground,            // primary buttons
    accent, accentForeground,              // links, highlights, focus details
    sale, saleForeground,                  // sale prices and badges
    success,
    announcementBackground, announcementForeground,
  },
  dark: { … },                             // optional; providing it enables the theme toggle
  fonts: { display: "bodoni", body: "jost" },
  radius: { card: "0px", button: "0px", input: "0px" },
  button: { textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 500 },
  heading: { fontWeight: 400, letterSpacing: "-0.015em" },
}
```

**Check contrast after changing colours.** The shipped palettes pass WCAG 2.2 AA. Keep normal text, including `foregroundMuted`, `accent` and `sale` used as text, at **4.5:1** or more against `background` and `surface`. Large text and icons need 3:1.

**Fonts.** The available keys are `bodoni`, `jost`, `geist`, `geistMono`, `newsreader` and `figtree`. They're self-hosted by `next/font` with no runtime requests to Google. To add one:

1. Import it in `src/lib/fonts.ts` and add it to `fontVariables`.
2. Add a stack to `fontStacks`.
3. Add its key to `FontKey` in `src/types/store.ts`.

Only the fonts a page uses are downloaded.

## 4. Header, navigation and footer

| Setting | Options |
| --- | --- |
| `header.layout` | `"centered"` (logo centred, Fashion), `"search"` (search bar in the header, Electronics), `"classic"` (logo left, nav centre, Beauty) |
| `header.sticky` | `true` or `false` |
| `announcements` | rotating messages with an optional link; visitors can pause the rotation |
| `nav` | top-level links; add `mega: { columns, feature }` for a mega menu (desktop) or accordion (mobile) |
| `footer.columns` | link columns; the newsletter signup, contact details and storefront switcher are added automatically |

Every link should point to a real route. Category links use `/category/<slug>`, and filtered links like `/category/shop-electronics?brand=Arcline` or `?price=0-200` work too.

## 5. Homepage sections

Each store's `home.sections` sets the order of its homepage sections. Remove an id to hide that section, or reorder the array to move it. Section content (hero copy, images, featured product slugs, testimonials) sits next to it in the same `home` object.

| Store | Section ids |
| --- | --- |
| Fashion | `hero`, `categories`, `newArrivals`, `marquee`, `bestSellers`, `featuredCollection`, `story`, `campaign`, `reviews`, `newsletter` |
| Electronics | `hero`, `trust`, `categories`, `bestSellers`, `deals`, `newReleases`, `brands`, `compare`, `reviews`, `newsletter` |
| Beauty | `hero`, `concerns`, `bestSellers`, `newArrivals`, `routine`, `spotlight`, `reviews`, `journal`, `newsletter` |

Product lists such as `bestSellers`, `deals.products` and `featuredCollection.products` reference product **slugs**. The Electronics comparison table reads its rows from each product's `specifications` by label (`rows: [{ label: "Display", key: "Screen" }]`).

## 6. Products

Products live in `src/data/products/<store>.ts` and follow the `Product` type in `src/types/catalog.ts`:

```ts
{
  id: "fa-wool-overcoat",            // stable, unique
  slug: "wool-cashmere-overcoat",    // the URL: /product/wool-cashmere-overcoat
  title: "Wool-Cashmere Overcoat",
  subtitle: "Single-breasted, knee length",
  description: "…",
  niche: "fashion",
  categories: ["mens", "womens"],    // first one is used for breadcrumbs
  brand: "Tavique Atelier",
  price: 340,
  originalPrice: 420,                // optional: shows as a sale
  images: [img("fashion", "wool-overcoat-camel", "Camel overcoat, front view"), …],
  rating: 4.8, reviewCount: 214,
  stock: 18,
  badges: ["bestseller"],            // "new" | "bestseller" | "limited" | "eco" | "exclusive"
  variants: [swatches(…), pills("size", "Size", ["XS", "S", "M", "L", "XL"])],
  highlights: ["…"],
  specifications: [{ title: "Display", items: [{ label: "Screen", value: "6.7in OLED" }] }],
  attributes: { material: ["Wool"], fit: ["Relaxed"] },   // powers attr:* filters
  tags: ["coat", "winter"],          // extra search terms
  createdAt: "2026-09-02",           // drives "Newest" sorting and new-arrival collections
  fashion: { fit, material, care, sizeGuide: "apparel" },  // or electronics / beauty details
  reviews: [{ id, author, rating, title, body, date, verified, meta }],
}
```

**Variants.** Each option can set its own `stock` (0 means sold out), `priceDelta` (for example `+100` for 512 GB) and `image`, which switches the gallery when the option is picked. Helpers in `src/data/products/helpers.ts` keep this short:

- `swatches(niche, slug, colours)` creates colour or shade swatches whose images follow `<slug>-<value>.webp`.
- `pills(id, name, values)` creates sizes, storage, volume and similar options.
- `colourGallery(…)` builds a gallery whose second image becomes the card hover image.

**Prices.** Cart and checkout totals are always recalculated from this data, so prices can't be changed from the browser. Use whole currency units. The money helpers calculate in integer cents.

## 7. Categories and collections

`src/data/categories.ts`:

```ts
{ slug: "womens", niche: "fashion", name: "Women's", description: "…", image: "/images/fashion/categories/womens.webp" }
```

A product appears in a category when its `categories` array includes that slug. A **virtual collection** adds a `rule` instead:

```ts
rule: { type: "all" }                          // every product in the store
rule: { type: "newest", limit: 8 }
rule: { type: "sale" }                         // products with originalPrice
rule: { type: "badge", badge: "bestseller" }
```

To show a category in the store's tiles and menus, add its slug to the store's `categories` list.

**Filters** are chosen per store in `filters`:

- `category`, `brand`, `price`, `rating`, `availability`
- `option:<variantGroupId>`, for example `option:size` or `option:storage`
- `attr:<attributeKey>`, for example `attr:material` or `attr:skinType`

Set human-readable names for `option:` and `attr:` facets in `facetLabels`. Facet values come from the products themselves, so new materials or shades appear automatically.

## 8. Images

All demo artwork is original and owned by the project, so you can ship it as is (see [CREDITS.md](CREDITS.md)). To use your own photography:

1. Drop files into `public/images/<store>/…` with the same names, or update the paths in the data.
2. Keep each type's aspect ratio for the best crop:

   | Image | Shipped size | Ratio |
   | --- | --- | --- |
   | Fashion products | 1200×1600 | 3:4 |
   | Electronics products | 1400×1400 | 1:1 |
   | Beauty products | 1200×1500 | 4:5 |
   | Category tiles | 900×1200 | 3:4 |

   `next/image` serves AVIF and WebP at the right size for each device.
3. Write a meaningful `alt` for every product image.
4. For remote images (a CDN, Shopify or Cloudinary), add the host to `images.remotePatterns` in `next.config.ts`.

### Regenerating the demo art in your colours

The illustrations are drawn by code in `scripts/art/`, so you can recolour or restyle them:

```bash
npm i -D playwright
```

```bash
npx playwright install chromium
```

```bash
npm run art -- fashion --sheet
```

The filter (`fashion`, `products`, `hero`…) limits which files are re-rendered. `--sheet` also writes a contact sheet to `scripts/art/out/`.

## 9. Commerce rules

`src/config/commerce.config.ts`:

- `shippingMethods`: label, delivery estimate, price and an optional `freeOver` threshold. The cart's free-shipping progress bar reads the threshold from here.
- `discountCodes`: `percent`, `fixed` or `shipping` types, with optional `minSubtotal` and `niche` (codes that only apply to one store's products).
- `taxRate`: a flat estimate for the demo. Real tax must be calculated server-side.
- `paymentMethods` and `countries` for the checkout form.

## 10. Forms and integrations

The newsletter and contact forms stay in clearly labelled demo mode until you set an endpoint in `.env.local`:

```bash
NEXT_PUBLIC_NEWSLETTER_ENDPOINT=https://…   # receives POST { email, store }
NEXT_PUBLIC_CONTACT_ENDPOINT=https://…      # receives POST { name, email, topic, order, message, store }
```

Any JSON endpoint works, for example Formspree, a serverless function or your email provider's API proxy. Never put secret API keys in `NEXT_PUBLIC_` variables, because they're visible in the browser. Call secret-key APIs from a Route Handler or Server Action instead.

## 11. Adding a fourth storefront (advanced)

1. Add the id to `STORE_IDS` in `src/types/catalog.ts`.
2. Define its homepage content type in `src/types/store.ts` and add it to `HomeContentMap`.
3. Create `src/config/stores/<id>.config.ts` and register it in `src/config/stores/index.ts`.
4. Create a homepage component in `src/components/storefront/<id>/` and add it to `homes` in `StorefrontHome.tsx`.
5. Add `src/app/<id>/page.tsx` (copy `src/app/fashion/page.tsx`).
6. Add products to `src/data/products/` and categories to `categories.ts`, plus a preview in `Showcase.tsx`.

`npm run typecheck` lists anything still missing, because every per-store map is typed as `Record<StoreId, …>`.
