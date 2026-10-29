# Features and demo limitations

Tavique is a **front-end template with a working demo flow**. All browsing, filtering, cart and checkout interactions are real code, but nothing is sent to a payment provider or a database. This page lists exactly what is functional and what you need to connect before going live.

## Status at a glance

| Area | Status | Notes |
| --- | --- | --- |
| Three storefronts with distinct themes and homepages | ✅ Functional | Config-driven; enable one, two or three |
| Navigation, mega menus, mobile menu | ✅ Functional | Keyboard and screen-reader accessible |
| Category and collection listings | ✅ Functional | Filters, chips, sort, load more, URL-synced |
| Search with suggestions | ✅ Functional | Client-side over the local catalogue |
| Product pages | ✅ Functional | Variants with per-option stock, price and imagery; gallery zoom; size guide |
| Quick add from cards | ✅ Functional | Validates required options |
| Cart drawer and bag page | ✅ Functional | Change options, quantities and removals; stock caps |
| Discount codes | ✅ Functional (demo rules) | Defined in `commerce.config.ts` |
| Shipping methods and free-shipping threshold | ✅ Functional (demo rules) | |
| Tax | ⚠️ Estimate | Flat 8% preview; real tax must be calculated server-side |
| Checkout form and validation | ✅ Functional | React Hook Form + Zod, error summary, accessible errors |
| Payment | 🔶 **Demo only** | No card fields, no payment taken; connect Stripe, Adyen, PayPal… |
| Order placement and confirmation | 🔶 **Demo only** | Stored in this browser only; no emails are sent |
| Wishlist and recently viewed | ✅ Functional | Saved in this browser |
| Account sign-in and registration | 🔶 **Demo only** | Not authentication; validates the form and stores a display name |
| Order history and addresses | 🔶 **Demo only** | Demo orders from this browser; addresses last for the session only |
| Newsletter and contact forms | 🔶 Demo, or connect an endpoint | Set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` / `NEXT_PUBLIC_CONTACT_ENDPOINT` |
| Reviews | 🔶 Demo content | Fictional sample reviews; connect a reviews provider for real ones |
| Inventory | 🔶 Demo data | Stock levels come from the data files |
| Light and dark theme | ✅ Functional | Electronics (`dark` palette); respects system preference |
| SEO: metadata, Open Graph, sitemap, robots, JSON-LD | ✅ Functional | Product, BreadcrumbList and FAQPage structured data |
| Accessibility (WCAG 2.2 AA target) | ✅ Audited | See "Accessibility" below |

Every demo-only feature says so on screen while `siteConfig.demoMode` is `true`. Turn it off only after you've connected real services.

## Demo discount codes

| Code | Effect | Conditions |
| --- | --- | --- |
| `WELCOME10` | 10% off | None |
| `TAVIQUE25` | $25 off | Subtotal of $150 or more |
| `FREESHIP` | Free standard shipping | Subtotal of $50 or more |
| `GLOW15` | 15% off beauty products | Beauty items in the bag |

Codes are case-insensitive. They're re-checked whenever the bag changes, and an ineligible code explains why it doesn't apply.

## Shipping (demo rules)

| Method | Price | Delivery |
| --- | --- | --- |
| Standard | $8, **free over $150** | 3–5 business days |
| Express | $18 | 1–2 business days |
| Next day | $28 | Order by 2pm |

## How pricing stays trustworthy

The cart stores only **product ids, chosen options, quantities and a discount code**, never prices. Totals are recalculated from the catalogue in integer cents on every render (`priceCart` in `src/lib/pricing.ts`), so editing `localStorage` or the page cannot change what something costs. Quantities are capped by the stock of the selected option.

> **In production** you must repeat this calculation on a trusted server, or let your commerce platform do it, when creating the payment. The browser is never the source of truth for prices, discounts, tax or stock.

## What is stored in the browser

| Key | Contents |
| --- | --- |
| `tavique-cart` | Product ids, option values, quantities, discount code |
| `tavique-wishlist` | Product ids |
| `tavique-history` | Up to 12 recently viewed product ids and 6 recent search terms |
| `tavique-orders` | Up to 20 demo orders: reference, date, **first name and city only**, items and totals |
| `tavique-account` | Demo display name |
| `tavique-theme` | `light` or `dark` |
| `tavique-store` cookie | Last storefront visited (theme for shared pages) |

No email address, phone number, street address, password or payment details are ever written to storage. The checkout form doesn't render card number, expiry or CVC fields. Storage failures (private browsing, blocked storage) fall back to memory without errors.

## Going live: what to connect

1. **Products and inventory.** Replace the local data with your commerce platform or CMS (Shopify Storefront API, Medusa, Saleor, commercetools, Sanity…). The `Product` type is the contract the UI expects.
2. **Payments.** Create the payment on the server from server-side prices, for example with Stripe Checkout or Payment Element. Never collect raw card data in your own form.
3. **Orders and email.** Persist orders in your platform or database and send confirmations from the server.
4. **Accounts.** Use a real auth provider (Auth.js, Clerk, Supabase Auth, your platform's customer accounts).
5. **Tax and shipping.** Use your platform's or a tax service's calculation (Stripe Tax, Avalara, TaxJar…).
6. **Forms.** Set the endpoint variables, or switch the forms to Server Actions.
7. **Legal pages.** Add your own privacy policy, terms and returns policy; the shipped copy is sample content.

## Accessibility

- Semantic landmarks, one `h1` per page, skip link, visible focus styles
- Native `<dialog>` for modals and drawers: focus trap, Escape, focus return
- Mega menus, carousels, galleries, variant pickers and the search combobox work by keyboard
- Form fields have labels, hints and errors linked with `aria-describedby`; checkout has an error summary
- Live regions for bag updates, toasts and result counts
- Sale and struck-through prices have screen-reader wording; star ratings have text equivalents
- `prefers-reduced-motion` turns off marquees, reveals and transitions
- Colour contrast meets AA in every store and theme

**Verified** with axe-core (0 violations) on every route, plus overlays (mega menu, quick add, cart drawer, search, mobile menu, filter drawer) and the dark theme. Layout checked at 360, 390, 768, 1024, 1280 and 1440 px wide.

## Performance and SEO

- 95 pages pre-rendered at build time; product and category pages are static
- `next/image` with AVIF/WebP, responsive `sizes` and preloading for the LCP image
- Fonts self-hosted through `next/font`; each page downloads only its store's families
- Server components by default; only interactive pieces ship JavaScript
- Per-page titles, descriptions, canonical URLs and Open Graph images
- `noindex` on search, cart, checkout, account, wishlist and confirmation pages
- Sitemap and robots built from the enabled stores
