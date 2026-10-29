# Routes and components

## Routes

Pages are pre-rendered at build time unless marked *dynamic*. Dynamic pages read the storefront cookie so shared pages (cart, FAQ…) match the store the visitor last browsed.

| Route | Page | Rendering | Notes |
| --- | --- | --- | --- |
| `/` | Showcase or a storefront homepage | static | Set by `siteConfig.home` |
| `/fashion` | Fashion homepage | static | 404 if disabled; redirects to `/` when it is the home |
| `/electronics` | Electronics homepage | static | Same as above |
| `/beauty` | Beauty homepage | static | Same as above |
| `/category/[slug]` | Category or collection listing | static (27) | Filters, sort, load more, all URL-synced |
| `/product/[slug]` | Product page | static (49) | Gallery, variants, details, reviews, suggestions |
| `/search?q=` | Search results | dynamic | Every enabled store; same filters as listings; `noindex` |
| `/cart` | Bag | dynamic | Edit options and quantities, discount codes, shipping estimate; `noindex` |
| `/checkout` | Checkout (demo) | dynamic | Validated form; no card fields; `noindex` |
| `/order-confirmation?ref=` | Order confirmation (demo) | dynamic | Reads the demo order saved in this browser; `noindex` |
| `/wishlist` | Wishlist | dynamic | Move to bag, remove; `noindex` |
| `/account` | Account (demo) | dynamic | Demo sign-in, order history, addresses; `noindex` |
| `/about` | About | dynamic | |
| `/contact` | Contact | dynamic | Contact form (demo, or posts to your endpoint) |
| `/faq` | FAQ | dynamic | Accordion with `FAQPage` structured data |
| `/shipping-returns` | Shipping, returns and warranty | dynamic | Anchors `#shipping`, `#returns` and `#warranty` |
| *(any unknown path)* | 404 | static | Links back to each enabled storefront |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | SEO and PWA metadata | static | Built from config and data |

### Listing URL parameters

Listings and search write their state to the URL, so filtered views can be shared, bookmarked and linked from navigation:

| Parameter | Example | Meaning |
| --- | --- | --- |
| `category` | `?category=womens,bags` | Category filter (comma-separated) |
| `brand` | `?brand=Arcline` | Brand filter |
| `price` | `?price=0-200` | Price range (either end may be empty) |
| `rating` | `?rating=4` | Minimum rating |
| `stock` | `?stock=in` | In stock only |
| `<option>` | `?size=m&color=camel` | Variant facets (`option:*` filters) |
| `<attribute>` | `?material=wool` | Attribute facets (`attr:*` filters) |
| `sort` | `?sort=price-asc` | `featured`, `newest`, `price-asc`, `price-desc`, `rating` |
| `page` | `?page=2` | Number of pages loaded by "Load more" |
| `q` | `/search?q=linen` | Search query |

## Components

### `components/ui`: primitives

| Component | Purpose |
| --- | --- |
| `Button`, `ButtonLink`, `IconButton`, `CountBadge` | Variants `primary`, `accent`, `outline`, `ghost`, `inverse`, `link`; sizes; loading state; icon buttons always have an accessible label |
| `Field`, `Input`, `Select`, `Textarea`, `Checkbox` | Labelled form controls with hint and error text wired up via `aria-describedby` |
| `Modal` | Native `<dialog>` modal and side drawer: focus trap, Escape to close, scroll lock, focus return |
| `Badge` | Sale, new, bestseller and similar product badges |
| `PriceDisplay` | Current, struck-through and "from" prices, with screen-reader wording |
| `RatingStars` | Star rating with a text equivalent |
| `QuantitySelector` | Stepper and input clamped to stock |
| `VariantSelector` | Swatches and pills for any variant group, showing sold-out and low-stock states |
| `Breadcrumbs` | Breadcrumb trail with `BreadcrumbList` JSON-LD |
| `FAQAccordion` | Animated accordion, with reduced-motion support |
| `SectionHeading`, `EmptyState`, `Skeleton`, `SmartImage`, `Toaster`, `JsonLd` | Supporting pieces |

### `components/layout`: site shell

| Component | Purpose |
| --- | --- |
| `StoreShell` | Wraps a page in a store's theme, header, footer and overlays |
| `StoreTheme` | Writes the store's palette, fonts and radii as CSS variables |
| `SiteHeader` | Three layouts: `centered`, `search` and `classic` |
| `DesktopNavigation` | Top navigation with keyboard-accessible mega menus |
| `MobileNavigation` | Drawer menu with accordion sub-menus |
| `AnnouncementBar` | Rotating messages with a pause control |
| `SiteFooter` | Link columns, newsletter signup, contact details |
| `StoreSwitcher`, `ThemeToggle`, `Logo` | Demo store switcher, light/dark toggle, text logo |
| `StoreOverlays` | Cart drawer, search overlay, quick add and toasts |
| `Providers`, `CatalogProvider`, `RememberStore` | Store hydration, client catalogue and active-store cookie |

### `components/product`

| Component | Purpose |
| --- | --- |
| `ProductCard` | Three styles: `editorial` (hover image and quick add), `tech` (key specs) and `beauty` (shade dots, full-width add) |
| `ProductGrid`, `ProductCarousel` | Responsive grid; scroll-snap carousel with buttons |
| `QuickAddDialog` | Choose options and add to bag without leaving the page |
| `WishlistButton` | Save or remove, with `aria-pressed` and a toast confirmation |
| `pdp/ProductView` | Product page layout: gallery, sticky purchase panel, content cards |
| `pdp/ProductGallery` | Thumbnails, keyboard arrows, zoom dialog, follows the selected colour |
| `pdp/ProductDetails` | Accordions: fit and care, in the box and warranty, ingredients and how to use, shipping |
| `pdp/ProductDescriptionCard`, `pdp/ProductSpecsCard`, `pdp/ProductReviews` | Description, grouped specifications, rating summary and review list |
| `pdp/SuggestedProducts`, `pdp/RecentlyViewed` | "Complete your look" or related products, and recently viewed items |
| `pdp/SizeGuide` | Apparel and footwear size tables in a dialog |

### `components/commerce`

| Component | Purpose |
| --- | --- |
| `SearchBar`, `SearchOverlay`, `SearchResults` | Combobox with suggestions and recent searches; overlay; full results page |
| `ProductListing`, `ProductFilters`, `CategoryHeader` | Listing with optimistic URL-synced filters, chips, sort and load more |
| `CartDrawer`, `CartView`, `CartItem` | Drawer and full bag page; option changes in place; stock caps |
| `DiscountCodeForm`, `FreeShippingProgress`, `ShippingMethodPicker`, `TotalsRows` | Order summary building blocks |
| `CheckoutForm` | Contact, shipping, billing, delivery method and payment choice, with an error summary and a "fill demo details" button |
| `OrderConfirmation`, `WishlistView`, `AccountView` | Post-order, wishlist and demo account pages |

### `components/storefront`

| Component | Purpose |
| --- | --- |
| `fashion/FashionHome` | Editorial hero with material tiles, category arches, marquee, collection, story, campaign |
| `electronics/ElectronicsHome` | Search hero, trust bar, deals band, brand grid, spec comparison table |
| `beauty/BeautyHome`, `RoutineBuilder`, `JournalCards` | Concern tiles, routine builder that adds the full routine to the bag, journal articles in dialogs |
| `shared/*` | `HeroBanner`, `CategoryTile`, `Marquee`, `TestimonialCard`, `NewsletterSection` |
| `showcase/Showcase` | Template landing page that previews the storefronts |
| `StorefrontHome` | Picks the homepage for a store and its metadata |

## Logic (`src/lib`) and state (`src/store`)

| Module | Responsibility |
| --- | --- |
| `lib/pricing.ts` | `priceCart` re-prices the cart from the catalogue in integer cents (discounts, shipping, tax); `checkDiscount`; order references |
| `lib/variants.ts` | Resolve selected options to price, stock and image; sold-out logic; default selection |
| `lib/filters.ts` | Parse and serialize URL filters; facets and counts; sorting |
| `lib/search.ts` | Accent-insensitive weighted search over title, brand, category, tags and options |
| `lib/collections.ts` | Category membership and virtual collection rules |
| `lib/structured-data.ts` | `Product` (with `AggregateRating` and `Offer`) and breadcrumb JSON-LD |
| `lib/checkout-schema.ts` | Zod schema for the checkout form |
| `store/cart.ts` | Cart lines (product id, options, quantity) and discount code; persisted |
| `store/wishlist.ts`, `store/history.ts` | Wishlist and recently viewed items or searches; persisted |
| `store/orders.ts` | Demo orders for confirmation and history (first name and city only) |
| `store/account.ts` | Demo session (display name only is persisted) |
| `store/ui.ts` | Drawer, overlay and toast state (not persisted) |
