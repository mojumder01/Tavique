# Changelog

All notable changes to Tavique are documented here. The project follows [Semantic Versioning](https://semver.org).

## 1.0.0 (2026-10-29)

First release.

### Storefronts

- Fashion & Lifestyle, Electronics & Gadgets and Beauty & Personal Care storefronts, each with its own theme, header layout, navigation, product-card style and homepage
- Template showcase page, configurable as the site home
- Single-store mode: disabled stores are left out of the build, sitemap and search, and the chosen store can serve `/`

### Commerce

- Category and collection listings with URL-synced filters, chips, counts, sorting and load more
- Search combobox with suggestions, recent and popular searches, and a results page
- Product pages with gallery and zoom, variant-aware stock, price and imagery, size guide, details, specifications, reviews, suggested and recently viewed products
- Quick add, cart drawer and bag page with in-place option changes
- Discount codes, shipping methods, free-shipping progress and a tax estimate; totals re-priced from the catalogue in integer cents
- Demo checkout with validation and error summary, order confirmation, wishlist and demo account

### Content and SEO

- About, Contact, FAQ, Shipping & Returns, 404 and error pages
- Metadata, Open Graph, canonical URLs, sitemap, robots and web manifest
- Product, BreadcrumbList and FAQPage structured data

### Quality

- WCAG 2.2 AA target: axe-core audit with 0 violations across pages, overlays and dark mode
- Responsive from 360 px to 1440 px+
- Strict TypeScript, ESLint and 40 Vitest unit tests
- 191 original demo illustrations and their generator
- Screenshot capture script for marketplace previews
- Documentation: customization, routes and components, features, deployment, troubleshooting, credits, marketplace copy
