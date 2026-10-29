#!/usr/bin/env node
// Captures the marketplace screenshot set described in docs/SCREENSHOTS.md.
//
//   npm run build && npm start              # in one terminal
//   npm run screenshots                     # in another
//   npm run screenshots -- --url=http://localhost:4000 --only=fashion
//
// Requires Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`).
// Images are written to ./screenshots (git-ignored).
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outDir = join(root, "screenshots");
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const base = (arg("url") ?? "http://localhost:3000").replace(/\/$/, "");
const only = arg("only");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    ({ chromium } = createRequire(import.meta.url)("playwright"));
  } catch {
    console.error("Playwright is required: npm i -D playwright && npx playwright install chromium");
    process.exit(1);
  }
}

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

/** Puts one item in the bag so cart, checkout and confirmation shots have content. */
async function addCoat(page) {
  await page.goto(`${base}/product/wool-cashmere-overcoat`, { waitUntil: "networkidle" });
  await page.locator("label[title='M']").first().click();
  await page.getByRole("button", { name: /^Add to bag/ }).first().click();
  await page.waitForTimeout(500);
}

const shots = [
  { name: "01-showcase", path: "/" },
  { name: "02-fashion-home", path: "/fashion" },
  { name: "03-fashion-home-full", path: "/fashion", fullPage: true },
  { name: "04-electronics-home", path: "/electronics" },
  {
    name: "05-electronics-dark",
    path: "/electronics",
    run: async (page) => {
      await page.getByRole("button", { name: /Switch to dark theme/ }).click();
      await page.waitForTimeout(300);
    },
  },
  { name: "06-beauty-home", path: "/beauty" },
  { name: "07-beauty-home-full", path: "/beauty", fullPage: true },
  {
    name: "08-fashion-mega-menu",
    path: "/fashion",
    run: async (page) => {
      await page.getByRole("button", { name: "Shop", exact: true }).click();
      await page.waitForTimeout(300);
    },
  },
  { name: "09-listing-filters", path: "/category/womens?material=wool" },
  { name: "10-electronics-listing", path: "/category/shop-electronics?sort=rating" },
  { name: "11-pdp-fashion", path: "/product/wool-cashmere-overcoat" },
  { name: "12-pdp-electronics", path: "/product/arcline-one-pro" },
  { name: "13-pdp-beauty", path: "/product/multi-stick-cheek-lip" },
  {
    name: "14-search-overlay",
    path: "/fashion",
    run: async (page) => {
      await page.getByRole("button", { name: "Search" }).first().click();
      await page.keyboard.type("linen");
      await page.waitForTimeout(500);
    },
  },
  { name: "15-cart-drawer", path: null, run: addCoat },
  {
    name: "16-cart-page",
    path: null,
    run: async (page) => {
      await addCoat(page);
      await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
    },
  },
  {
    name: "17-checkout-errors",
    path: null,
    run: async (page) => {
      await addCoat(page);
      await page.goto(`${base}/checkout`, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: /^Place demo order/ }).click();
      await page.waitForTimeout(400);
    },
  },
  {
    name: "18-order-confirmation",
    path: null,
    run: async (page) => {
      await addCoat(page);
      await page.goto(`${base}/checkout`, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: /Fill demo details/ }).click();
      await page.getByRole("button", { name: /^Place demo order/ }).click();
      await page.waitForURL(/order-confirmation/);
      await page.waitForLoadState("networkidle");
    },
  },
  { name: "19-mobile-fashion", path: "/fashion", viewport: mobile },
  { name: "20-mobile-electronics", path: "/electronics", viewport: mobile },
  { name: "21-mobile-beauty", path: "/beauty", viewport: mobile },
  {
    name: "22-mobile-menu",
    path: "/beauty",
    viewport: mobile,
    run: async (page) => {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.waitForTimeout(300);
    },
  },
  {
    name: "23-mobile-filters",
    path: "/category/shop-beauty",
    viewport: mobile,
    run: async (page) => {
      await page.getByRole("button", { name: /^Filters/ }).click();
      await page.waitForTimeout(300);
    },
  },
  { name: "24-mobile-pdp", path: "/product/arcline-one-pro", viewport: mobile },
];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
let failed = 0;
for (const shot of shots) {
  if (only && !shot.name.includes(only)) continue;
  // A fresh context per shot keeps the bag, theme and storefront cookie independent.
  const context = await browser.newContext({ viewport: shot.viewport ?? desktop, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    if (shot.path) await page.goto(base + shot.path, { waitUntil: "networkidle" });
    await shot.run?.(page);
    await page.screenshot({ path: join(outDir, `${shot.name}.png`), fullPage: Boolean(shot.fullPage) });
    console.log(`ok   ${shot.name}`);
  } catch (error) {
    failed++;
    console.error(`fail ${shot.name}: ${error.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
}
await browser.close();
console.log(`\nSaved to ${outDir}`);
process.exit(failed ? 1 : 0);
