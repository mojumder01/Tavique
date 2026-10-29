# Tavique: a multi-store e-commerce template

Tavique is a premium e-commerce template built with Next.js, TypeScript and Tailwind CSS. It ships three storefronts on one codebase:

| Storefront | Route | Character |
| --- | --- | --- |
| **Fashion & Lifestyle** | `/fashion` | Editorial luxury: Bodoni Moda and Jost, warm neutrals, campaign layouts, centred header |
| **Electronics & Gadgets** | `/electronics` | Search-first and technical: Geist, graphite and blue, spec comparisons, light and dark themes |
| **Beauty & Personal Care** | `/beauty` | Soft and refined: Newsreader and Figtree, cream and blush, concern tiles and routines |

All three share one component library, one cart, one checkout and 49 demo products. Each store has its own config file for theme, navigation, homepage sections, filters and copy. You can launch one storefront or all three.

> **Demo template.** Checkout, sign-in and order history are simulated in the browser. No payment is taken and no card details are collected. See [docs/FEATURES.md](docs/FEATURES.md) for what works today and what needs a backend.

## Requirements

- **Node.js 20.9 or newer** (tested on 22 LTS)
- npm 10+ (or pnpm / yarn / bun)

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. By default `/` shows the template showcase. Set `home` in `src/config/site.config.ts` to open a storefront at `/` instead.

> If `npm install` stops with `Cannot read properties of null (reading 'edgesOut')`, you've hit a bug in npm 10.9. Run `npx npm@11 install` or upgrade npm. See [Troubleshooting](docs/TROUBLESHOOTING.md).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Production build (pre-renders 95 pages) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` in strict mode |
| `npm test` | Unit tests with Vitest (pricing, discounts, variants, filters, search, cart) |
| `npm run check` | Typecheck, lint and test in one go |
| `npm run art` | Re-render the demo artwork (optional, needs Playwright; see Customization) |
| `npm run screenshots` | Capture the marketplace screenshot set from a running server (optional, needs Playwright) |

## Stack

Next.js 16 (App Router, React 19), TypeScript (strict), Tailwind CSS 4, Motion, Zustand, React Hook Form with Zod, Lucide icons, `next/image` and `next/font`. All demo data is local and typed, so there is no database or API to set up.

## Project structure

```
src/
  app/                 Routes (App Router), sitemap, robots, manifest, error pages
  components/
    ui/                Buttons, fields, modal/drawer, badges, rating, price, accordion…
    layout/            Store shell, headers, mega menu, mobile nav, footer, theme
    product/           Cards, grid, carousel, quick add, product page (pdp/)
    commerce/          Search, filters, listing, cart, checkout, wishlist, account
    storefront/        Fashion / Electronics / Beauty homepages, shared sections, showcase
    forms/             Newsletter and contact forms
  config/              site.config.ts, commerce.config.ts, stores/*.config.ts
  data/                Products, categories, FAQ content
  lib/                 Pricing, variants, filters, search, SEO helpers, utils
  store/               Zustand stores (cart, wishlist, orders, history, account, UI)
  hooks/               useCartTotals, useAddToCart, useDebounced
  types/               Catalog, store config and commerce types
public/images/         Original demo artwork (WebP), safe to ship or replace
scripts/art/           Generator for the demo artwork
tests/                 Vitest unit tests
docs/                  Customization, routes, features, deployment, credits…
```

## Documentation

- [Customization](docs/CUSTOMIZATION.md): brand, colours, fonts, products, categories, images, single-store setup
- [Routes and components](docs/ROUTES-AND-COMPONENTS.md): every page and the main building blocks
- [Features and demo limitations](docs/FEATURES.md): what's functional, what's simulated, demo discount codes
- [Deployment](docs/DEPLOYMENT.md): Vercel, Node servers, Docker, environment variables
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Credits and licences](docs/CREDITS.md)
- [Screenshot plan](docs/SCREENSHOTS.md) and [marketplace listing](docs/MARKETPLACE.md)
- [Changelog](CHANGELOG.md)

## Licence

See [LICENSE.md](LICENSE.md). Third-party licences are listed in [docs/CREDITS.md](docs/CREDITS.md).
