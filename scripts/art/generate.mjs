#!/usr/bin/env node
// Renders the Tavique demo artwork (original, project-owned illustrations) to /public/images.
//
//   npm run art                 # render everything
//   npm run art -- fashion      # only files whose path contains "fashion"
//   npm run art -- --sheet      # also write a contact sheet to scripts/art/out/
//
// Requires Playwright with Chromium (`npm i -D playwright && npx playwright install chromium`)
// and sharp (installed with Next.js). Buyers never need to run this — the rendered
// images are committed. It exists so the art can be regenerated in new brand colours.
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import fashion from "./scenes-fashion.mjs";
import electronics from "./scenes-electronics.mjs";
import beauty from "./scenes-beauty.mjs";
import shared from "./scenes-shared.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const outDir = join(root, "public", "images");
const args = process.argv.slice(2);
const filters = args.filter((a) => !a.startsWith("--"));
const wantSheet = args.includes("--sheet");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    // Falls back to a globally installed Playwright (resolved through NODE_PATH).
    ({ chromium } = createRequire(import.meta.url)("playwright"));
  } catch {
    chromium = null;
  }
}
if (!chromium) {
  console.error("Playwright is required: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const all = [...fashion, ...electronics, ...beauty, ...shared];
const items = filters.length ? all.filter((i) => filters.some((f) => i.file.includes(f))) : all;
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const thumbs = [];
let bytes = 0;

for (const item of items) {
  await page.setViewportSize({ width: item.w, height: item.h });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${item.svg()}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: item.w, height: item.h }, type: "png" });
  const dest = join(outDir, item.file);
  mkdirSync(dirname(dest), { recursive: true });
  const isJpg = item.file.endsWith(".jpg");
  const buf = isJpg ? await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer() : await sharp(png).webp({ quality: 80, effort: 5 }).toBuffer();
  writeFileSync(dest, buf);
  bytes += buf.length;
  if (wantSheet) thumbs.push({ file: item.file, png });
  process.stdout.write(`✓ ${item.file} (${Math.round(buf.length / 1024)} KB)\n`);
}
await browser.close();
console.log(`\n${items.length} images, ${(bytes / 1024 / 1024).toFixed(1)} MB total`);

if (wantSheet && thumbs.length) {
  const cell = 300;
  const cols = 6;
  const rows = Math.ceil(thumbs.length / cols);
  const composites = await Promise.all(
    thumbs.map(async (t, i) => ({
      input: await sharp(t.png).resize(cell, cell, { fit: "contain", background: "#ffffff" }).png().toBuffer(),
      left: (i % cols) * cell,
      top: Math.floor(i / cols) * cell,
    })),
  );
  const sheetDir = join(root, "scripts", "art", "out");
  mkdirSync(sheetDir, { recursive: true });
  await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: "#ffffff" } })
    .composite(composites)
    .png()
    .toFile(join(sheetDir, `sheet-${filters.join("-") || "all"}.png`));
  console.log(`contact sheet → scripts/art/out/sheet-${filters.join("-") || "all"}.png`);
}
