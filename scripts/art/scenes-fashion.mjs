import { svg, place, backdrop, wallShadow, contactShadow, shade, grain, uid, linear, blurFilter, rng } from "./lib.mjs";
import * as F from "./fashion.mjs";

const W = 1200;
const H = 1600;
export const WALLS = { warm: "#ebe5dc", sand: "#ddd2c3", stone: "#d2c8ba", greige: "#cdc6bb", blush: "#e8ddd4", ink: "#2b2826" };
const win = { opacity: 0.1, angle: -26, x: 0.5, bars: 3, gap: 0.15, width: 0.1, blur: 16 };

/** A garment hanging from its hanger, centred, with a soft wall shadow. */
function hanging(content, { wall = WALLS.warm, s = 1.3, top = 170, cx = W / 2, windows = win, w = W, h = H } = {}) {
  const g = place(content, { x: cx, y: top, s });
  return svg(w, h, backdrop(w, h, { wall, windows, vignette: 0.1 }) + wallShadow(g, { dx: 40, dy: 30, blur: 22, opacity: 0.2 }) + g);
}
/** An object resting on the floor of a cyclorama. */
function grounded(content, { wall = WALLS.sand, floor, s = 1.5, base = 1180, cx = W / 2, rx = 360, w = W, h = H, windows = null } = {}) {
  return svg(
    w,
    h,
    backdrop(w, h, { wall, floor: floor ?? shade(wall, -0.06), horizon: base / h - 0.02, windows, vignette: 0.1 }) +
      contactShadow(cx, base, rx * s * 0.62, { opacity: 0.3 }) +
      place(content, { x: cx, y: base, s }),
  );
}
/** Close, cropped "detail" view on a contrasting wall. */
const detail = (content, { wall, s = 2.3, top = -40, cx = W / 2 + 60 }) => hanging(content, { wall, s, top, cx, windows: { ...win, opacity: 0.13, x: 0.2 } });

const pair = (draw, opts, dark = -0.12) =>
  place(draw({ ...opts, ...Object.fromEntries(Object.entries(opts).map(([k, v]) => [k, shade(v, dark)])) }), { x: 120, y: -46, s: 0.94 }) + draw(opts);

const products = [];
const add = (slug, variants, drawFn, sceneFn, altFn) => {
  variants.forEach(([suffix, opts, wall], i) => {
    const file = `fashion/products/${slug}${suffix ? "-" + suffix : ""}.webp`;
    products.push({ file, w: W, h: H, svg: () => sceneFn(drawFn(opts), wall) });
    if (i === 0) products.push({ file: `fashion/products/${slug}-alt.webp`, w: W, h: H, svg: () => altFn(drawFn(opts), wall) });
  });
};

const hang = (wall) => (c, w2) => hanging(F.hanger() + c, { wall: w2 ?? wall });
const hangAlt = (wall, s = 2.3, top = -40, cx = W / 2 + 60) => (c) => detail(F.hanger() + c, { wall, s, top, cx });

add("wool-overcoat", [["camel", { color: "#b8946a" }, WALLS.warm], ["charcoal", { color: "#45413d" }, WALLS.sand], ["oat", { color: "#d6c9b3" }, WALLS.stone]], F.coat, (c, w) => hanging(F.hanger() + c, { wall: w, s: 1.36, top: 150 }), hangAlt(WALLS.stone, 2.4, -60));
add("belted-trench", [["stone", { color: "#c9b391" }, WALLS.warm], ["black", { color: "#2d2b29" }, WALLS.sand]], F.trench, (c, w) => hanging(F.hanger() + c, { wall: w, s: 1.34, top: 140 }), hangAlt(WALLS.greige, 2.2, -10));
add("cotton-overshirt", [["ivory", { color: "#e4d9c6" }, WALLS.stone], ["olive", { color: "#7c7a5b" }, WALLS.warm]], F.overshirt, (c, w) => hanging(F.hanger() + c, { wall: w, s: 1.62, top: 230 }), hangAlt(WALLS.sand, 2.6, 40));
add("linen-shirt", [["white", { color: "#f4f2ed" }, WALLS.sand], ["sky", { color: "#e8edf1", stripe: "#9fb4c9" }, WALLS.warm], ["sand", { color: "#e1d4bf" }, WALLS.stone]], F.shirt, (c, w) => hanging(F.hanger() + c, { wall: w, s: 1.62, top: 230 }), hangAlt(WALLS.greige, 2.7, 40));
add("merino-crewneck", [["cream", { color: "#e9e1d3" }, WALLS.stone], ["charcoal", { color: "#58544f" }, WALLS.warm], ["moss", { color: "#8b8a6a" }, WALLS.sand]], F.knit, (c, w) => hanging(F.hanger() + c, { wall: w, s: 1.58, top: 250 }), hangAlt(WALLS.blush, 2.5, 60));
add("silk-slip-dress", [["champagne", { color: "#d9c3a3" }, WALLS.blush], ["black", { color: "#272523" }, WALLS.warm], ["sage", { color: "#a7ac94" }, WALLS.stone]], F.slipDress, (c, w) => hanging(F.hanger() + c, { wall: w, s: 1.36, top: 120 }), hangAlt(WALLS.sand, 2.3, -120));
add("pleated-trousers", [["taupe", { color: "#8b7a66" }, WALLS.warm], ["black", { color: "#2c2a28" }, WALLS.stone], ["navy", { color: "#30384a" }, WALLS.sand]], F.trousers, (c, w) => hanging(c, { wall: w, s: 1.36, top: 140 }), (c) => detail(c, { wall: WALLS.blush, s: 2.3, top: 40 }));

const groundedProduct = (s, base, rx, wall) => (c, w) => grounded(c, { wall: w ?? wall, s, base, rx });
const groundedAlt = (s, base, rx, wall) => (c) => grounded(c, { wall, s, base, rx, windows: { ...win, opacity: 0.12 }, cx: W / 2 + 80 });

add("leather-tote", [["cognac", { color: "#9a6a43" }, WALLS.warm], ["black", { color: "#2b2623" }, WALLS.sand], ["bone", { color: "#d9cebe" }, WALLS.stone]], F.tote, groundedProduct(1.55, 1250, 250), groundedAlt(2.3, 1500, 250, WALLS.greige));
add("mini-crossbody", [["sand", { color: "#d6c5ad" }, WALLS.stone], ["black", { color: "#2a2624" }, WALLS.warm]], F.crossbody, groundedProduct(1.8, 1220, 190), groundedAlt(2.7, 1420, 190, WALLS.blush));
add("court-sneaker", [["white", { upper: "#f4f2ee", sole: "#ebe6dc", accent: "#c8b598" }, WALLS.sand], ["sand", { upper: "#e3d6c2", sole: "#f1ede6", accent: "#8f7558" }, WALLS.warm]], (o) => pair(F.sneaker, o), groundedProduct(1.6, 1120, 290), groundedAlt(2.4, 1150, 290, WALLS.stone));
add("chelsea-boot", [["brown", { color: "#5d412d" }, WALLS.warm], ["black", { color: "#292523" }, WALLS.stone]], (o) => pair(F.chelseaBoot, o), groundedProduct(1.55, 1180, 290), groundedAlt(2.3, 1250, 290, WALLS.sand));
add("penny-loafer", [["espresso", { color: "#3f2b21" }, WALLS.sand], ["black", { color: "#262321" }, WALLS.warm]], (o) => pair(F.loafer, o), groundedProduct(1.65, 1080, 290), groundedAlt(2.5, 1100, 290, WALLS.blush));
add("tortoise-sunglasses", [["tortoise", { frame: "#3a2a20", tortoise: true }, WALLS.blush], ["black", { frame: "#1f1d1c", tortoise: false }, WALLS.stone]], F.sunglasses, (c, w) => hanging(c, { wall: w, s: 1.6, top: 780 }), (c) => detail(c, { wall: WALLS.sand, s: 2.6, top: 820, cx: W / 2 + 140 }));
add("heritage-watch", [["steel", { caseColor: "#cbc8c2", dial: "#f3eee4", strap: "#6b4a33" }, WALLS.stone], ["gold", { caseColor: "#cfb07a", dial: "#22201e", strap: "#2b2522", index: "#e9dcc2" }, WALLS.warm]], F.watch, (c, w) => hanging(c, { wall: w, s: 1.45, top: 800 }), (c) => detail(c, { wall: WALLS.greige, s: 2.6, top: 820, cx: W / 2 + 40 }));
add("cashmere-scarf", [["oat", { color: "#c2b099", check: "#8f7b63" }, WALLS.warm], ["charcoal", { color: "#55514c", check: "#2c2a28" }, WALLS.stone]], F.scarf, (c, w) => hanging(c, { wall: w, s: 1.7, top: 300 }), (c) => detail(c, { wall: WALLS.blush, s: 2.8, top: 120 }));
add("wool-fedora", [["", { color: "#6f5a46" }, WALLS.sand]], F.fedora, groundedProduct(1.55, 1100, 300), groundedAlt(2.4, 1150, 300, WALLS.warm));

/* ---------------- campaign & category imagery ---------------- */
function drape({ w, h, color = "#d9cdbb", seed = 3 }) {
  const rand = rng(seed);
  const f = uid("dr");
  let ridges = "";
  for (let i = 0; i < 9; i++) {
    const x = -200 + i * (w + 400) / 8 + rand() * 60;
    const bend = 120 + rand() * 160;
    const d = `M${x},-100 C${x + bend},${h * 0.3} ${x - bend},${h * 0.65} ${x + bend * 0.4},${h + 100}`;
    ridges += `<path d="${d}" stroke="#000" stroke-width="${70 + rand() * 60}" opacity="${0.12 + rand() * 0.12}" fill="none"/>`;
    ridges += `<path d="M${x + 60},-100 C${x + 60 + bend},${h * 0.3} ${x + 60 - bend},${h * 0.65} ${x + 60 + bend * 0.4},${h + 100}" stroke="#fff" stroke-width="${30 + rand() * 30}" opacity="${0.16 + rand() * 0.1}" fill="none"/>`;
  }
  return svg(w, h, `<defs>${blurFilter(f, 34)}</defs><rect width="${w}" height="${h}" fill="${color}"/><g filter="url(#${f})">${ridges}</g>${grain(w, h, 0.09)}`);
}

function rack({ w, h, tones, wall = WALLS.stone, y = 160, spacing = 150, s = 1.1, draw = F.overshirt, windows = win }) {
  const total = (tones.length - 1) * spacing * s;
  const x0 = w / 2 - total / 2;
  let garments = "";
  tones.forEach((color, i) => {
    garments += place(F.hanger() + draw({ color }), { x: x0 + i * spacing * s, y: y + 30, s });
  });
  const content = F.rail(-40, w + 40, y + 40) + garments;
  return svg(w, h, backdrop(w, h, { wall, windows, vignette: 0.12 }) + wallShadow(garments, { dx: 50, dy: 30, blur: 26, opacity: 0.22 }) + content + grain(w, h, 0.05));
}

const campaign = [
  { file: "fashion/hero.webp", w: 1400, h: 1750, svg: () => hanging(F.hanger() + F.overshirt({ color: "#e3d8c5" }), { w: 1400, h: 1750, wall: "#d8cbb8", s: 1.9, top: 260, cx: 700, windows: { ...win, opacity: 0.16, x: 0.12, bars: 4, gap: 0.17, width: 0.12 } }) },
  { file: "fashion/material.webp", w: 900, h: 900, svg: () => drape({ w: 900, h: 900 }) },
  { file: "fashion/rack.webp", w: 1200, h: 1000, svg: () => rack({ w: 1200, h: 1000, tones: ["#e7ddcc", "#d4c4ab", "#b99c78", "#8f7356", "#e1d6c4", "#c7b394"], s: 1.05, spacing: 170 }) },
  { file: "fashion/campaign.webp", w: 2400, h: 1100, svg: () => rack({ w: 2400, h: 1100, wall: "#cbbfae", y: 90, tones: ["#e6dccb", "#cbb595", "#9a7b5b", "#4a4440", "#d8c8b0", "#b8946a", "#e9e1d3", "#7c7a5b", "#c9b391"], s: 1.08, spacing: 230, draw: F.coat, windows: { ...win, opacity: 0.16, x: 0.25, bars: 5, gap: 0.12 } }) },
  { file: "fashion/story.webp", w: 1200, h: 1500, svg: () => rack({ w: 1200, h: 1500, wall: WALLS.sand, tones: ["#e9e1d3", "#cfc3b0", "#8b8a6a"], y: 220, s: 1.45, spacing: 210, draw: F.knit }) },
  { file: "fashion/lookbook.webp", w: 1200, h: 1500, svg: () => svg(1200, 1500, backdrop(1200, 1500, { wall: "#cfc3b2", floor: "#bdb09d", horizon: 0.8, windows: { ...win, opacity: 0.12 } }) + wallShadow(place(F.hanger() + F.coat({ color: "#45413d" }), { x: 520, y: 70, s: 1.28 }), { dx: 40, dy: 30, blur: 24, opacity: 0.22 }) + place(F.hanger() + F.coat({ color: "#45413d" }), { x: 520, y: 70, s: 1.28 }) + place(F.scarf({ color: "#c2b099", check: "#8f7b63" }), { x: 520, y: 210, s: 0.62 }) + contactShadow(930, 1330, 230, { opacity: 0.3 }) + place(F.chelseaBoot({ color: "#5d412d" }), { x: 930, y: 1330, s: 0.82 })) },
];

const tile = (file, body, wall = WALLS.warm) => ({ file: `fashion/categories/${file}.webp`, w: 900, h: 1200, svg: () => svg(900, 1200, backdrop(900, 1200, { wall, floor: shade(wall, -0.07), horizon: 0.82, windows: { ...win, opacity: 0.09 } }) + body) });
const hangAt = (draw, opts, x, y, s) => wallShadow(place(F.hanger() + draw(opts), { x, y, s }), { dx: 30, dy: 24, blur: 20, opacity: 0.2 }) + place(F.hanger() + draw(opts), { x, y, s });
const categories = [
  tile("mens", hangAt(F.coat, { color: "#45413d" }, 560, 90, 1.02) + hangAt(F.shirt, { color: "#f4f2ed" }, 360, 170, 1.0), WALLS.sand),
  tile("womens", hangAt(F.trench, { color: "#c9b391" }, 330, 80, 0.98) + hangAt(F.slipDress, { color: "#d9c3a3" }, 590, 110, 0.98), WALLS.blush),
  tile("footwear", contactShadow(450, 690, 330, { opacity: 0.28 }) + place(F.chelseaBoot({ color: "#5d412d" }), { x: 450, y: 690, s: 1.05 }) + contactShadow(450, 1010, 330, { opacity: 0.28 }) + place(F.loafer({ color: "#3f2b21" }), { x: 450, y: 1010, s: 1.05 }), WALLS.stone),
  tile("bags", contactShadow(330, 1000, 250, { opacity: 0.3 }) + place(F.tote({ color: "#9a6a43" }), { x: 330, y: 1000, s: 0.95 }) + contactShadow(650, 1000, 190, { opacity: 0.3 }) + place(F.crossbody({ color: "#d6c5ad" }), { x: 650, y: 1000, s: 0.9 }), WALLS.warm),
  tile("accessories", wallShadow(place(F.scarf({ color: "#c2b099", check: "#8f7b63" }), { x: 250, y: 150, s: 0.95 }), { dx: 30, dy: 24, blur: 20, opacity: 0.2 }) + place(F.scarf({ color: "#c2b099", check: "#8f7b63" }), { x: 250, y: 150, s: 0.95 }) + wallShadow(place(F.watch({ caseColor: "#cbc8c2", dial: "#f3eee4", strap: "#6b4a33" }), { x: 640, y: 520, s: 0.68 }), { dx: 24, dy: 20, blur: 16, opacity: 0.2 }) + place(F.watch({ caseColor: "#cbc8c2", dial: "#f3eee4", strap: "#6b4a33" }), { x: 640, y: 520, s: 0.68 }) + contactShadow(560, 1010, 230, { opacity: 0.25 }) + place(F.sunglasses({ frame: "#3a2a20" }), { x: 560, y: 960, s: 0.72 }), WALLS.greige),
  tile("new-arrivals", place(`<g>${F.rail(-60, 960, 120)}</g>`, {}) + [["#e7ddcc", 210], ["#b99c78", 450], ["#8f7356", 690]].map(([c, x]) => place(F.hanger() + F.overshirt({ color: c }), { x, y: 150, s: 0.95 })).join(""), WALLS.stone),
  tile("sale", hangAt(F.knit, { color: "#8b8a6a" }, 450, 200, 1.2), WALLS.sand),
];

export default [...products, ...campaign, ...categories];
