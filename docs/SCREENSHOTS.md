# Screenshot plan

The full marketplace set can be captured automatically, so screenshots always match the current build.

```bash
npm i -D playwright
```

```bash
npx playwright install chromium
```

```bash
npm run build && npm start
```

Then, in a second terminal:

```bash
npm run screenshots
```

Images are written to `screenshots/` (git-ignored) at 2× pixel density with reduced motion. Use `--only=<name>` to re-capture a subset (for example `--only=mobile`) and `--url=` to point at another server.

## The set

| # | File | Viewport | What it shows | Use it for |
| --- | --- | --- | --- | --- |
| 01 | `01-showcase` | 1440 | Template landing page with the three storefronts | Main preview / cover |
| 02 | `02-fashion-home` | 1440 | Editorial hero with "Material First" and "Cut with Purpose" tiles | Fashion hero |
| 03 | `03-fashion-home-full` | 1440, full page | Every Fashion homepage section | Long preview |
| 04 | `04-electronics-home` | 1440 | Search-first hero, spotlight product, trust bar | Electronics hero |
| 05 | `05-electronics-dark` | 1440 | Same page in the dark theme | Dark mode |
| 06 | `06-beauty-home` | 1440 | Soft hero with taupe call to action | Beauty hero |
| 07 | `07-beauty-home-full` | 1440, full page | Concerns, bestsellers, routine, spotlight, journal | Long preview |
| 08 | `08-fashion-mega-menu` | 1440 | Mega menu with feature card | Navigation |
| 09 | `09-listing-filters` | 1440 | Women's listing with a material filter chip | Filters |
| 10 | `10-electronics-listing` | 1440 | All electronics sorted by rating; tech cards with key specs | Listing variant |
| 11 | `11-pdp-fashion` | 1440 | Gallery, swatches, sizes, sticky purchase panel | Product page |
| 12 | `12-pdp-electronics` | 1440 | Storage and colour variants with price changes | Product page variant |
| 13 | `13-pdp-beauty` | 1440 | Shade picker for a multi-stick | Product page variant |
| 14 | `14-search-overlay` | 1440 | Search with live suggestions | Search |
| 15 | `15-cart-drawer` | 1440 | Bag drawer with free-shipping progress | Cart |
| 16 | `16-cart-page` | 1440 | Full bag with discount code and order summary | Cart |
| 17 | `17-checkout-errors` | 1440 | Validation error summary with field errors | Form UX and accessibility |
| 18 | `18-order-confirmation` | 1440 | Demo order confirmation | Checkout flow |
| 19–21 | `19-mobile-*` to `21-mobile-*` | 390 | Each storefront homepage on a phone | Responsive |
| 22 | `22-mobile-menu` | 390 | Mobile navigation drawer | Responsive |
| 23 | `23-mobile-filters` | 390 | Filter drawer with counts | Responsive |
| 24 | `24-mobile-pdp` | 390 | Product page on a phone | Responsive |

## Suggested marketplace layout

1. **Cover (590×300 or 1200×630):** crop `01-showcase`, or compose `02`, `04` and `06` side by side with the "Three storefronts. One considered system." headline.
2. **Gallery order:** 02 → 04 → 06 → 11 → 09 → 15 → 17 → 05 → 19–21 (composited as three phones) → 14.
3. **Live demo link:** deploy with `home: "showcase"` and `showStoreSwitcher: true` so reviewers can explore all three stores.
4. Every image shows original demo artwork and fictional brands, so the set is safe to publish.
