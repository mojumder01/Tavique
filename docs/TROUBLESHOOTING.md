# Troubleshooting

### `npm install` fails with `Cannot read properties of null (reading 'edgesOut')`

This is a bug in npm 10.9's dependency resolver, triggered by the test tooling. Use npm 11 for the install:

```bash
npx npm@11 install
```

Or upgrade npm globally with `npm i -g npm@latest`. `npm ci` with the committed lockfile works on npm 10.

### `Error: Node.js version … is not supported`

Next.js 16 needs **Node 20.9 or newer**. Check with `node -v`, then upgrade (for example `nvm install --lts`).

### Hydration warnings or a stale page after editing in `npm run dev`

Hot reload can occasionally keep an outdated module after big refactors. Stop the dev server, delete the dev cache and restart:

```bash
rm -rf .next
```

```bash
npm run dev
```

Browser extensions that rewrite the page (translators, password managers, dark-mode extensions) can also cause hydration warnings. Try a private window to rule them out.

### My edits to prices in the browser don't change the total

This is by design. Totals are recalculated from the product data on every render, so only `src/data/products/*.ts` controls prices. See [FEATURES.md](FEATURES.md#how-pricing-stays-trustworthy).

### The cart, wishlist or orders are empty after switching browsers

Demo data lives in the visitor's own browser storage (see [FEATURES.md](FEATURES.md#what-is-stored-in-the-browser)). Connect a backend to sync it across devices.

### A storefront or product returns 404

Check that its store id is listed in `siteConfig.enabledStores`. Disabled stores are left out of the build on purpose. If you added a product or category, check the slug is unique and restart the dev server.

### Images from my CDN don't load: `hostname is not configured`

Add the host to `images.remotePatterns` in `next.config.ts`:

```ts
remotePatterns: [{ protocol: "https", hostname: "cdn.example.com" }],
```

### A `quality` value on `next/image` is ignored or rejected

Next.js 16 only serves the qualities listed in `images.qualities` in `next.config.ts` (Tavique allows `75` and `90`). Add the value you need to that list.

### A new font key doesn't type-check

Add the key in three places: `FontKey` in `src/types/store.ts`, `fontStacks` in `src/lib/fonts.ts`, and the `next/font` import with `fontVariables`. See [CUSTOMIZATION.md](CUSTOMIZATION.md#3-colours-fonts-and-shape).

### `npm run art` says Playwright is required

The artwork generator is optional (the rendered images are committed). To use it:

```bash
npm i -D playwright
```

```bash
npx playwright install chromium
```

### The newsletter or contact form says "demo"

Set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` or `NEXT_PUBLIC_CONTACT_ENDPOINT` in `.env.local` and restart the server. `NEXT_PUBLIC_` variables are inlined at build time, so redeploy after changing them in production.

### Canonical URLs, the sitemap or Open Graph tags point to localhost

Set `NEXT_PUBLIC_SITE_URL` to your production URL (for example `https://shop.example.com`) and rebuild.

### ESLint complains about `setState` in an effect or `Date.now()` during render

Tavique follows the React Compiler lint rules shipped with `eslint-config-next`. Derive values during render, use a `key` to reset component state, or move impure calls into event handlers. The existing components show each pattern.
