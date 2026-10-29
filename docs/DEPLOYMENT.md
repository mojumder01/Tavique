# Deployment

Tavique is a standard Next.js app with no database or required secrets, so it deploys anywhere Next.js runs.

## Before you deploy

1. Set `NEXT_PUBLIC_SITE_URL` to your production URL. It's used for canonical URLs, the sitemap, `robots.txt` and Open Graph tags.
2. Choose your `home`, `enabledStores` and `showStoreSwitcher` in `src/config/site.config.ts`.
3. Run the checks and a production build locally:

   ```bash
   npm run check
   ```

   ```bash
   npm run build
   ```

## Vercel (recommended)

1. Push the project to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository. The framework is detected automatically.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (and the optional form endpoints).
4. Deploy. Every push to the default branch redeploys; pull requests get preview URLs.

Because `NEXT_PUBLIC_` variables are inlined at build time, **redeploy after changing them**.

## Netlify

Import the repository. Netlify's Next.js runtime is applied automatically. Use `npm run build` as the build command and set the same environment variables.

## GitHub Pages (static export)

GitHub Pages and other static hosts serve plain files, so the store is built as a static export:

1. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to the default branch. `.github/workflows/deploy-pages.yml` runs the checks, builds the export and publishes it to `https://<user>.github.io/<repo>/`.

To build the same export locally (the files land in `out/`):

```bash
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/<repo> NEXT_PUBLIC_SITE_URL=https://<user>.github.io/<repo> npm run build
```

What changes in a static export:

- **Shared pages** (cart, checkout, FAQ, account…) are pre-rendered for every enabled storefront, and the browser shows the one the visitor last browsed. On a server, the store comes from a cookie instead.
- **Images** are served as they are (`src/lib/image-loader.ts`), without resizing or AVIF/WebP conversion.
- **Security headers** in `next.config.ts` aren't sent, because static hosts don't run Next.js. Set them on the host if it supports it.
- `robots.txt` is only read at a domain's root, so it has no effect under `/<repo>/`.

## Any Node.js server

```bash
npm ci
```

```bash
npm run build
```

```bash
PORT=3000 npm start
```

Run it behind a reverse proxy (Nginx, Caddy) with HTTPS. Use a process manager such as PM2 or systemd to keep it running.

## Docker

Set `output: "standalone"` in `next.config.ts`, then use a multi-stage image:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://shop.example.com -t tavique .
```

```bash
docker run -p 3000:3000 tavique
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public URL for canonical links, sitemap and social tags |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | Optional | POST endpoint for newsletter signups |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Optional | POST endpoint for the contact form |

Never put secret keys in `NEXT_PUBLIC_` variables, because they ship to the browser. Keep secrets (payment keys, API tokens) in non-public variables used only by Route Handlers or Server Actions.

## After deploying

- Open `/sitemap.xml` and `/robots.txt` and check they use your domain.
- Submit the sitemap in Google Search Console.
- Test a product page with Google's Rich Results Test to confirm the Product and Breadcrumb structured data.
- Keep `demoMode: true` until real payments, orders and accounts are connected.
- Add a Content Security Policy that matches the services you integrate. The template ships baseline security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) in `next.config.ts`.
