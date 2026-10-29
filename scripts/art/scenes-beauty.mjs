import { svg, place, backdrop, contactShadow, shade, grain, rng, blob, uid, radial, linear } from "./lib.mjs";
import * as B from "./beauty.mjs";

const W = 1200;
const H = 1500;
export const SURF = { cream: "#f3ece4", blush: "#ecdcd3", sand: "#e8dccd", stone: "#e2dad0", rose: "#e6cfc8", sage: "#dfe2d6" };
export const SHADES = {
  multi: [["dew", "#e37f6e"], ["tenderly", "#c96f72"], ["sunkissed", "#e0915b"], ["berry", "#9e4a5a"]],
  lip: [["nude", "#b9776a"], ["rosewood", "#9b4f55"], ["red-clay", "#b5473a"], ["mauve", "#9a6577"]],
  tint: [["fair", "#ecd0b8"], ["light", "#dcb08e"], ["medium", "#bf8a62"], ["deep", "#8a5a3c"]],
  blush: [["petal", "#e7a19a"], ["apricot", "#e9a27a"], ["plum", "#b06d7b"]],
};
const windowsSoft = { opacity: 0.07, angle: -32, x: 0.62, bars: 3, gap: 0.14, width: 0.08, blur: 6, color: "#6d5241" };

/** Product standing on a warm surface with a hard sunlight shadow raking to the right. */
function stand(content, { surface = SURF.cream, s = 1.3, base = 1230, cx = W / 2, rx = 150, extra = "", w = W, h = H } = {}) {
  const obj = place(content, { x: cx, y: base, s });
  return svg(
    w,
    h,
    backdrop(w, h, { wall: surface, floor: shade(surface, -0.04), horizon: base / h - 0.03, light: 0.5, windows: windowsSoft, vignette: 0.06 }) +
      extra +
      place(B.hardShadow(content, { dx: 0, skewX: -52, sy: 0.32, opacity: 0.16 }), { x: cx, y: base, s }) +
      contactShadow(cx, base, rx * s, { opacity: 0.28, ry: 10 }) +
      obj,
  );
}

const products = [];
const add = (slug, variants, sceneFn, altFn) => {
  variants.forEach(([suffix, opts], i) => {
    products.push({ file: `beauty/products/${slug}${suffix ? "-" + suffix : ""}.webp`, w: W, h: H, svg: () => sceneFn(opts) });
    if (i === 0) products.push({ file: `beauty/products/${slug}-alt.webp`, w: W, h: H, svg: () => altFn(opts) });
  });
};
const creamSwatch = (x, y, r, c, seed) => B.cream(x, y, r, c, seed);

add("vitamin-c-serum", [["", {}]], () => stand(B.dropper(), { s: 1.95, rx: 100 }), () => stand(B.dropper(), { surface: SURF.sand, s: 2.1, base: 1380, cx: 520, rx: 100, extra: B.droplets(W, H * 0.6, { seed: 3, count: 26 }) }));
add("barrier-cream", [["", {}]], () => stand(B.jar(), { s: 1.45, rx: 200 }), () => stand(B.jar(), { surface: SURF.blush, s: 1.5, base: 1300, cx: 470, rx: 200, extra: creamSwatch(900, 1150, 170, "#f6efe6", 7) }));
add("soft-foaming-cleanser", [["", {}]], () => stand(B.pumpBottle(), { s: 1.45, rx: 110 }), () => stand(B.pumpBottle(), { surface: SURF.stone, s: 1.6, base: 1400, cx: 560, rx: 110, extra: B.droplets(W, H * 0.55, { seed: 11, count: 30 }) }));
add("balancing-toner", [["", {}]], () => stand(B.tallBottle(), { s: 1.45, rx: 110 }), () => stand(B.tallBottle(), { surface: SURF.sage, s: 1.6, base: 1420, cx: 520, rx: 110, extra: B.leaf(820, 900, 380, -40) + B.leaf(860, 1000, 300, -10, "#8b9a74") }));
add("mineral-spf-40", [["", {}]], () => stand(B.tube(), { s: 1.45, rx: 90 }), () => stand(B.tube(), { surface: SURF.sand, s: 1.6, base: 1420, cx: 500, rx: 90, extra: creamSwatch(880, 1160, 140, "#fbf6ef", 3) }));
add(
  "multi-stick",
  SHADES.multi.map(([k, c]) => [k, { c }]),
  ({ c }) => stand(B.multiStick({ shadeColor: c }), { s: 1.55, cx: 470, rx: 70, extra: B.smear(850, 1150, 190, 110, c, { seed: 5, rotate: -18 }) }),
  ({ c }) => stand(B.multiStick({ shadeColor: c }), { surface: SURF.blush, s: 2.0, base: 1460, cx: 760, rx: 70, extra: B.smear(380, 1000, 260, 150, c, { seed: 8, rotate: 24 }) }),
);
add(
  "satin-lipstick",
  SHADES.lip.map(([k, c]) => [k, { c }]),
  ({ c }) => stand(B.lipstick({ shadeColor: c }), { s: 1.9, cx: 480, rx: 66, extra: B.smear(850, 1160, 170, 70, c, { seed: 12, rotate: -12, crumbs: 10 }) }),
  ({ c }) => stand(B.lipstick({ shadeColor: c }), { surface: SURF.rose, s: 2.4, base: 1420, cx: 700, rx: 66, extra: B.smear(330, 960, 220, 80, c, { seed: 14, rotate: 30, crumbs: 8 }) }),
);
add(
  "skin-tint-serum",
  SHADES.tint.map(([k, c]) => [k, { c }]),
  ({ c }) => stand(B.dropper({ tint: "#f1ece6", liquid: c, sub: "SKIN TINT SPF 30" }), { s: 1.55, cx: 500, rx: 100, extra: B.smear(860, 1160, 150, 60, c, { seed: 21, rotate: -8, crumbs: 6 }) }),
  ({ c }) => stand(B.dropper({ tint: "#f1ece6", liquid: c, sub: "SKIN TINT SPF 30" }), { surface: SURF.sand, s: 2.0, base: 1400, cx: 700, rx: 100, extra: B.smear(330, 900, 200, 80, c, { seed: 22, rotate: 28, crumbs: 6 }) }),
);
add("volumizing-mascara", [["", {}]], () => stand(B.mascara(), { s: 1.6, rx: 50 }), () => stand(B.mascara(), { surface: SURF.rose, s: 2.0, base: 1440, cx: 640, rx: 50 }));
add(
  "cheek-blush",
  SHADES.blush.map(([k, c]) => [k, { c }]),
  ({ c }) => stand(B.compact({ shadeColor: c }), { s: 1.5, base: 1180, rx: 200 }),
  ({ c }) => stand(B.compact({ shadeColor: c }), { surface: SURF.blush, s: 1.7, base: 1300, cx: 520, rx: 200, extra: B.smear(930, 1120, 140, 60, c, { seed: 31, rotate: -14, crumbs: 30 }) }),
);
add("santal-eau-de-parfum", [["", {}]], () => stand(B.perfume(), { s: 1.45, rx: 180 }), () => stand(B.perfume(), { surface: SURF.stone, s: 1.6, base: 1300, cx: 520, rx: 180, extra: B.leaf(860, 640, 340, 60, "#9a8c6c") + B.leaf(900, 720, 280, 100, "#8b7e60") }));
add("botanical-body-mist", [["", {}]], () => stand(B.mist(), { s: 1.5, rx: 90 }), () => stand(B.mist(), { surface: SURF.sage, s: 1.7, base: 1420, cx: 560, rx: 90, extra: B.droplets(W, H * 0.5, { seed: 17, count: 34 }) }));
add("repair-shampoo", [["", {}]], () => stand(B.flipBottle(), { s: 1.45, rx: 110 }), () => stand(B.flipBottle(), { surface: SURF.sand, s: 1.6, base: 1420, cx: 520, rx: 110, extra: creamSwatch(900, 1200, 140, "#f2e6d8", 9) }));
add("nourishing-hair-oil", [["", {}]], () => stand(B.dropper({ w: 150, h: 360, brand: "AUREL", sub: "HAIR OIL", tint: "#b8813f", liquid: "#e0a648" }), { s: 1.55, rx: 80 }), () => stand(B.dropper({ w: 150, h: 360, brand: "AUREL", sub: "HAIR OIL", tint: "#b8813f", liquid: "#e0a648" }), { surface: SURF.stone, s: 2.0, base: 1420, cx: 600, rx: 80, extra: B.droplets(W, H * 0.6, { seed: 41, count: 22, color: "#f0c26b" }) }));
add("silk-body-lotion", [["", {}]], () => stand(B.pumpBottle({ w: 230, h: 480, brand: "SOLA", sub: "SILK BODY LOTION", color: "#efe7dc", labelColor: "#8b6e5c" }), { s: 1.45, rx: 130 }), () => stand(B.pumpBottle({ w: 230, h: 480, brand: "SOLA", sub: "SILK BODY LOTION", color: "#efe7dc", labelColor: "#8b6e5c" }), { surface: SURF.blush, s: 1.6, base: 1420, cx: 520, rx: 130, extra: creamSwatch(910, 1220, 140, "#f8f1e8", 13) }));
add("hand-cream", [["", {}]], () => stand(B.tube({ w: 150, h: 420, brand: "AUREL", sub: "HAND CREAM", cap: "#b9a28a", labelColor: "#7c6252" }), { s: 1.6, rx: 70 }), () => stand(B.tube({ w: 150, h: 420, brand: "AUREL", sub: "HAND CREAM", cap: "#b9a28a", labelColor: "#7c6252" }), { surface: SURF.rose, s: 1.9, base: 1420, cx: 520, rx: 70, extra: creamSwatch(900, 1230, 120, "#f7efe6", 17) }));
add("natural-deodorant", [["", {}]], () => stand(B.stick(), { s: 1.5, rx: 110 }), () => stand(B.stick(), { surface: SURF.sage, s: 1.7, base: 1380, cx: 560, rx: 110, extra: B.leaf(860, 900, 320, -30, "#8b9a74") }));

/* ---------------- campaign & editorial ---------------- */
const shadowBars = (w, h, op = 0.08) => `<g opacity="${op}" fill="#6d5241">${Array.from({ length: 4 }, (_, i) => `<rect x="${w * (0.5 + i * 0.12)}" y="${-h}" width="${w * 0.04}" height="${h * 3}" transform="rotate(-30 ${w / 2} ${h / 2})"/>`).join("")}</g>`;
function lying(content, x, y, s, r) {
  return place(B.hardShadow(content, { dx: 46, dy: 30, skewX: 0, sy: 1, opacity: 0.22, blur: 10 }), { x, y, s, r }) + place(content, { x, y, s, r });
}
const hero = () => {
  const w = 2400;
  const h = 1300;
  return svg(
    w,
    h,
    backdrop(w, h, { wall: "#f4f2ef", light: 0.6, vignette: 0.05 }) +
      B.smear(1740, 700, 270, 130, "#d36f6a", { seed: 4, rotate: 34, crumbs: 34 }) +
      B.smear(1930, 1130, 300, 150, "#e8603f", { seed: 7, rotate: 30, crumbs: 40 }) +
      lying(B.multiStick({ shadeColor: "#d36f6a" }), 960, 110, 1.7, 128) +
      lying(B.multiStick({ shadeColor: "#e8603f" }), 1160, 520, 1.7, 130) +
      grain(w, h, 0.03),
  );
};
const concern = (name, body, bg) => ({ file: `beauty/concerns/${name}.webp`, w: 800, h: 1000, svg: () => svg(800, 1000, `<rect width="800" height="1000" fill="${bg}"/>` + body + shadowBars(800, 1000, 0.05) + grain(800, 1000, 0.05)) });
const citrus = (cx, cy, r) => {
  let seg = "";
  for (let i = 0; i < 10; i++) {
    const a1 = (i / 10) * Math.PI * 2;
    const a2 = ((i + 1) / 10) * Math.PI * 2;
    const rr = r * 0.82;
    seg += `<path d="M${cx},${cy} L${cx + Math.cos(a1 + 0.05) * rr},${cy + Math.sin(a1 + 0.05) * rr} A${rr},${rr} 0 0 1 ${cx + Math.cos(a2 - 0.05) * rr},${cy + Math.sin(a2 - 0.05) * rr} Z" fill="#f4b04e" opacity="0.92"/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f0a23a"/><circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="#fbe8c5"/>${seg}<circle cx="${cx}" cy="${cy}" r="${r * 0.08}" fill="#fbe8c5"/>`;
};
const granules = (w, h, seed, color) => {
  const rand = rng(seed);
  let out = "";
  for (let i = 0; i < 180; i++) out += `<circle cx="${rand() * w}" cy="${rand() * h}" r="${2 + rand() * 6}" fill="${shade(color, (rand() - 0.5) * 0.3)}" opacity="${0.6 + rand() * 0.4}"/>`;
  return out;
};
const concerns = [
  concern("hydration", B.droplets(800, 1000, { seed: 2, count: 60 }), "#d9e3e6"),
  concern("brightening", citrus(330, 420, 230) + citrus(620, 760, 170), "#f6e6cf"),
  concern("fine-lines", B.cream(400, 520, 300, "#f6efe6", 21), "#eaded3"),
  concern("blemishes", `<path d="${blob(400, 500, 330, 300, { seed: 9, jitter: 0.1 })}" fill="#b9bfae"/>` + granules(800, 1000, 3, "#9aa38c"), "#dfe2d6"),
  concern("sensitivity", B.leaf(120, 760, 620, -48, "#86a07b") + B.leaf(200, 900, 560, -30, "#9bb58e") + B.leaf(80, 580, 500, -62, "#7a9470"), "#e7ece1"),
  concern("dullness", granules(800, 1000, 7, "#c99c78") + B.smear(400, 520, 240, 160, "#f2d9c4", { seed: 3, crumbs: 18 }), "#f1e3d6"),
];
const editorial = [
  { file: "beauty/hero.webp", w: 2400, h: 1300, svg: hero },
  { file: "beauty/new-feature.webp", w: 1200, h: 1500, svg: () => stand(B.pumpBottle(), { surface: "#efe7df", s: 2.0, base: 1480, rx: 110, extra: B.droplets(W, H * 0.6, { seed: 31, count: 40 }) }) },
  { file: "beauty/spotlight.webp", w: 1600, h: 1100, svg: () => stand(B.dropper(), { w: 1600, h: 1100, surface: "#eae2d6", s: 1.15, base: 900, cx: 620, rx: 100, extra: B.leaf(1050, 420, 520, 150, "#8b9a74") + B.leaf(1160, 520, 440, 170, "#7d8a6a") + B.leaf(1000, 300, 380, 120, "#9aaa84") + place(B.hardShadow(B.jar(), { skewX: -52, sy: 0.32, opacity: 0.16 }), { x: 920, y: 900, s: 0.95 }) + contactShadow(920, 900, 190, { opacity: 0.26, ry: 10 }) + place(B.jar(), { x: 920, y: 900, s: 0.95 }) }) },
  { file: "beauty/routine.webp", w: 1600, h: 900, svg: () => svg(1600, 900, backdrop(1600, 900, { wall: "#efe6dc", floor: "#e5d9cb", horizon: 0.74, windows: windowsSoft }) + [[B.pumpBottle(), 330, 0.78], [B.tallBottle(), 620, 0.78], [B.dropper(), 900, 1.0], [B.jar(), 1180, 0.82], [B.tube(), 1420, 0.8]].map(([c, x, s]) => contactShadow(x, 790, 90 * s * 1.3, { opacity: 0.26, ry: 8 }) + place(c, { x, y: 790, s })).join("")) },
  { file: "beauty/journal-swatches.webp", w: 1200, h: 900, svg: () => svg(1200, 900, `<rect width="1200" height="900" fill="#f4efe9"/>` + SHADES.multi.map(([, c], i) => B.smear(240 + i * 240, 450 + (i % 2 ? 40 : -40), 110, 60, c, { seed: 40 + i, rotate: -30 })).join("") + grain(1200, 900, 0.04)) },
  { file: "beauty/journal-oil.webp", w: 1200, h: 900, svg: () => svg(1200, 900, `<rect width="1200" height="900" fill="#e9c47f"/>` + B.droplets(1200, 900, { seed: 51, count: 50, color: "#fff4d6" }) + grain(1200, 900, 0.05)) },
  { file: "beauty/journal-ritual.webp", w: 1200, h: 900, svg: () => stand(B.jar(), { w: 1200, h: 900, surface: "#ecdcd3", s: 1.0, base: 740, cx: 420, rx: 200, extra: B.cream(860, 640, 170, "#f7efe6", 5) }) },
];
const cat = (name, items, surface) => ({
  file: `beauty/categories/${name}.webp`,
  w: 900,
  h: 1100,
  svg: () => svg(900, 1100, backdrop(900, 1100, { wall: surface, floor: shade(surface, -0.04), horizon: 0.8, light: 0.5, windows: windowsSoft }) + items.map(([c, x, s]) => place(B.hardShadow(c, { skewX: -52, sy: 0.32, opacity: 0.15 }), { x, y: 930, s }) + contactShadow(x, 930, 90 * s * 1.4, { opacity: 0.26, ry: 8 }) + place(c, { x, y: 930, s })).join("")),
});
const categories = [
  cat("skincare", [[B.pumpBottle(), 250, 0.95], [B.dropper(), 470, 1.25], [B.jar(), 680, 0.85]], SURF.cream),
  cat("makeup", [[B.lipstick({ shadeColor: "#9b4f55" }), 240, 1.25], [B.multiStick({ shadeColor: "#e37f6e" }), 440, 1.15], [B.mascara(), 640, 1.1]], SURF.blush),
  cat("haircare", [[B.flipBottle(), 330, 1.05], [B.dropper({ w: 150, h: 360, brand: "AUREL", sub: "HAIR OIL", tint: "#b8813f", liquid: "#e0a648" }), 600, 1.15]], SURF.sand),
  cat("fragrance", [[B.perfume(), 360, 1.1], [B.mist(), 670, 0.95]], SURF.stone),
  cat("body-care", [[B.pumpBottle({ w: 230, h: 480, brand: "SOLA", sub: "SILK BODY LOTION", color: "#efe7dc", labelColor: "#8b6e5c" }), 330, 1.05], [B.tube({ w: 150, h: 420, brand: "AUREL", sub: "HAND CREAM", cap: "#b9a28a", labelColor: "#7c6252" }), 610, 1.1]], SURF.rose),
  cat("personal-care", [[B.stick(), 330, 1.2], [B.tube({ w: 150, h: 420, brand: "AUREL", sub: "HAND CREAM", cap: "#b9a28a", labelColor: "#7c6252" }), 600, 1.1]], SURF.sage),
];

// unused helpers kept tree-shake friendly for future scenes
void uid; void radial; void linear;

export default [...products, ...concerns, ...editorial, ...categories];
