import { svg, place, backdrop, contactShadow, radial, uid, grain } from "./lib.mjs";
import * as E from "./electronics.mjs";

const S = 1400;
export const WP = {
  blue: { a: "#2b59c3", b: "#0b1020", c: "#6fb1ff", seed: 4 },
  violet: { a: "#5b3fd1", b: "#0e0b1f", c: "#c07bff", seed: 9 },
  teal: { a: "#0f7c86", b: "#06161a", c: "#5ee0c7", seed: 6 },
  ember: { a: "#c9573a", b: "#1b0d0a", c: "#ffb36b", seed: 3 },
};

const light = (body, { w = S, h = S, wall = "#eef0f3", horizon = 0.74 } = {}) => svg(w, h, backdrop(w, h, { wall, floor: "#e2e5ea", horizon, light: 0.5, vignette: 0.06 }) + body);
const dark = (body, { w = S, h = S, glowX = 0.62, glowY = 0.42, glow = "#3d7bff" } = {}) => {
  const g = uid("glow");
  return svg(
    w,
    h,
    backdrop(w, h, { wall: "#1c1f25", floor: "#14161a", horizon: 0.76, light: 0.08, vignette: 0.35 }) +
      `<defs>${radial(g, [[0, glow, 0.38], [0.5, glow, 0.08], [1, glow, 0]], { cx: glowX, cy: glowY, r: 0.55 })}</defs><rect width="${w}" height="${h}" fill="url(#${g})"/>` +
      body +
      grain(w, h, 0.05),
  );
};
/** Object floating above the floor with a soft shadow beneath it. */
const float = (content, { x = S / 2, y = S / 2, s = 1, r = 0, shadowY = S * 0.86, rx = 300, op = 0.22 } = {}) =>
  contactShadow(x, shadowY, rx, { opacity: op, ry: rx * 0.08 }) + place(content, { x, y, s, r });

const products = [];
const add = (slug, variants, draw, alt) => {
  variants.forEach(([suffix, opts], i) => {
    products.push({ file: `electronics/products/${slug}${suffix ? "-" + suffix : ""}.webp`, w: S, h: S, svg: () => light(draw(opts)) });
    if (i === 0) products.push({ file: `electronics/products/${slug}-alt.webp`, w: S, h: S, svg: () => dark(alt(opts)) });
  });
};

const phonePair = (lenses, wall) => (o) =>
  float(E.phoneBack({ body: o.body, lenses }), { x: 560, y: 650, s: 1.18, r: -9, rx: 210 }) + place(E.phoneFront({ frame: o.body, wall }), { x: 860, y: 690, s: 1.18, r: 7 });
add("arcline-one-pro", [["graphite", { body: "#3b3e44" }], ["silver", { body: "#d5d7da" }], ["glacier", { body: "#a9bfd4" }]], phonePair(3, WP.blue), (o) => place(E.phoneBack({ body: o.body, lenses: 3 }), { x: 700, y: 700, s: 1.55, r: -12 }));
add("arcline-one-lite", [["midnight", { body: "#262a31" }], ["sand", { body: "#d8cfc2" }], ["mint", { body: "#b9d8cb" }]], phonePair(2, WP.teal), (o) => place(E.phoneFront({ frame: o.body, wall: WP.teal }), { x: 700, y: 700, s: 1.55, r: 10 }));
add("kestrel-book-14", [["silver", { lid: "#c9ccd1" }], ["space", { lid: "#55585e" }]], (o) => contactShadow(700, 1000, 480, { opacity: 0.25 }) + place(E.laptop({ lid: o.lid, wall: WP.violet }), { x: 700, y: 980, s: 1.25 }), (o) => place(E.laptop({ lid: o.lid, wall: WP.violet }), { x: 700, y: 1000, s: 1.4 }));
add("kestrel-book-16-pro", [["", { lid: "#3d4046" }]], (o) => contactShadow(700, 1000, 520, { opacity: 0.25 }) + place(E.laptop({ lid: o.lid, wall: WP.ember, w: 940, h: 580 }), { x: 700, y: 980, s: 1.2 }), (o) => place(E.laptop({ lid: o.lid, wall: WP.ember, w: 940, h: 580 }), { x: 700, y: 1000, s: 1.3 }));
add("halden-aura", [["obsidian", { color: "#2f3238" }], ["sand", { color: "#d6cdbf", cushion: "#bfb4a3", accent: "#b9b2a6" }], ["ocean", { color: "#34507a" }]], (o) => float(E.headphones(o), { y: 640, s: 1.45, rx: 330 }), (o) => place(E.headphones(o), { x: 700, y: 680, s: 1.75 }));
add("halden-pods", [["white", { color: "#f2f2f0" }], ["black", { color: "#2c2e33" }]], (o) => float(E.earbuds(o), { y: 680, s: 1.7, rx: 300 }), (o) => place(E.earbuds(o), { x: 700, y: 700, s: 2.1, r: -8 }));
add("orbis-watch-s2", [["midnight", { caseColor: "#2e3136", band: "#3d4250" }], ["silver", { caseColor: "#cfd2d6", band: "#6d8fb8", ringA: "#ff6b5b", ringB: "#ffd166" }]], (o) => float(E.smartwatch(o), { y: 680, s: 1.15, rx: 200 }), (o) => place(E.smartwatch(o), { x: 700, y: 700, s: 1.35, r: -10 }));
add("orbis-run", [["sand", { caseColor: "#c9ccd1", band: "#d5cbbd", accent: "#ff8a3d" }], ["graphite", { caseColor: "#44474d", band: "#2b2e33", accent: "#4f8cff" }]], (o) => float(E.roundWatch(o), { y: 680, s: 1.15, rx: 200 }), (o) => place(E.roundWatch(o), { x: 700, y: 700, s: 1.35, r: 10 }));
add("voltara-boom", [["ocean", { color: "#2f3a4a" }], ["coral", { color: "#d8735a" }], ["sage", { color: "#8fa596" }]], (o) => contactShadow(700, 1060, 220, { opacity: 0.32 }) + place(E.speaker(o), { x: 700, y: 1060, s: 1.6 }), (o) => place(E.speaker(o), { x: 700, y: 1120, s: 1.75 }));
add("orbis-home-hub", [["chalk", { fabric: "#d8d4cc", frame: "#f4f3f0", wall: WP.ember }], ["charcoal", { fabric: "#55585e", frame: "#2a2c30", wall: WP.blue }]], (o) => contactShadow(700, 1000, 330, { opacity: 0.28 }) + place(E.smartDisplay(o), { x: 700, y: 1000, s: 1.4 }), (o) => place(E.smartDisplay(o), { x: 700, y: 1060, s: 1.55 }));
add("kestrel-pad-11", [["silver", { frame: "#c3c7cd", wall: WP.violet }], ["space", { frame: "#55585e", wall: WP.blue }]], (o) => float(E.tablet(o), { y: 660, s: 1.1, rx: 300 }), (o) => place(E.tablet(o), { x: 700, y: 700, s: 1.25, r: -14 }));
add("nova-controller", [["white", { color: "#f1f1ef", accent: "#2f3238" }], ["graphite", { color: "#33363c", accent: "#9aa3ad" }]], (o) => float(E.controller(o), { y: 680, s: 1.55, rx: 320 }), (o) => place(E.controller(o), { x: 700, y: 700, s: 1.8, r: -10 }));
add("nova-handheld", [["", { color: "#2d3036", accent: "#4f8cff", wall: WP.violet }]], (o) => float(E.handheld(o), { y: 680, s: 1.25, rx: 520 }), (o) => place(E.handheld(o), { x: 700, y: 700, s: 1.3, r: -8 }));
add("arcline-keys", [["chalk", { color: "#e9e8e4", keys: "#f6f5f2", accent: "#4f8cff" }], ["graphite", { color: "#2f3238", keys: "#44474d", accent: "#ff8a3d" }]], (o) => float(E.keyboard(o), { y: 690, s: 1.08, rx: 560, op: 0.18 }), (o) => place(E.keyboard(o), { x: 700, y: 700, s: 1.15, r: -12 }));
add("voltara-power-20k", [["", { color: "#2f3238" }]], (o) => float(E.powerBank(o), { x: 640, y: 660, s: 1.25, rx: 220 }), (o) => place(E.powerBank(o), { x: 620, y: 700, s: 1.4, r: -10 }));
add("orbis-clean-s8", [["white", { color: "#f2f2f0", accent: "#2f3238" }], ["black", { color: "#2c2e33", accent: "#9aa3ad" }]], (o) => contactShadow(700, 900, 420, { opacity: 0.3 }) + place(E.robotVacuum(o), { x: 700, y: 760, s: 1.5 }), (o) => place(E.robotVacuum(o), { x: 700, y: 760, s: 1.7 }));

const tile = (name, body) => ({ file: `electronics/categories/${name}.webp`, w: 800, h: 800, svg: () => light(body, { w: 800, h: 800, wall: "#f0f2f5" }) });
const categories = [
  tile("smartphones", place(E.phoneBack({ body: "#a9bfd4", lenses: 3 }), { x: 320, y: 400, s: 0.78, r: -10 }) + place(E.phoneFront({ frame: "#3b3e44", wall: WP.blue }), { x: 490, y: 420, s: 0.78, r: 8 })),
  tile("laptops", contactShadow(400, 640, 300, { opacity: 0.22 }) + place(E.laptop({ lid: "#c9ccd1", wall: WP.violet }), { x: 400, y: 620, s: 0.78 })),
  tile("audio", place(E.headphones({ color: "#2f3238" }), { x: 400, y: 380, s: 0.95 })),
  tile("smartwatches", place(E.smartwatch({ caseColor: "#2e3136", band: "#3d4250" }), { x: 300, y: 400, s: 0.68, r: -8 }) + place(E.roundWatch({ caseColor: "#c9ccd1", band: "#d5cbbd" }), { x: 520, y: 410, s: 0.62, r: 10 })),
  tile("gaming", place(E.controller({ color: "#f1f1ef", accent: "#2f3238" }), { x: 400, y: 420, s: 0.95, r: -6 })),
  tile("tech-accessories", place(E.keyboard({ color: "#e9e8e4", keys: "#f6f5f2" }), { x: 400, y: 400, s: 0.6, r: -10 })),
  tile("home-electronics", contactShadow(400, 560, 260, { opacity: 0.25 }) + place(E.robotVacuum({ color: "#f2f2f0" }), { x: 400, y: 470, s: 0.9 })),
];

const campaign = [
  {
    file: "electronics/hero.webp",
    w: 1600,
    h: 1200,
    svg: () =>
      dark(
        place(E.phoneBack({ body: "#a9bfd4", lenses: 3 }), { x: 690, y: 560, s: 1.15, r: -11 }) +
          place(E.phoneFront({ frame: "#a9bfd4", wall: WP.blue }), { x: 990, y: 600, s: 1.15, r: 6 }) +
          place(E.earbuds({ color: "#f2f2f0" }), { x: 330, y: 900, s: 0.75, r: -8 }) +
          place(E.smartwatch({ caseColor: "#2e3136", band: "#3d4250" }), { x: 1330, y: 820, s: 0.6, r: 14 }),
        { w: 1600, h: 1200, glowX: 0.6, glowY: 0.45 },
      ),
  },
  {
    file: "electronics/compare.webp",
    w: 1600,
    h: 1000,
    svg: () =>
      light(contactShadow(500, 760, 330, { opacity: 0.22 }) + place(E.laptop({ lid: "#c9ccd1", wall: WP.violet }), { x: 500, y: 740, s: 0.82 }) + contactShadow(1110, 770, 380, { opacity: 0.22 }) + place(E.laptop({ lid: "#3d4046", wall: WP.ember, w: 940, h: 580 }), { x: 1110, y: 750, s: 0.86 }), { w: 1600, h: 1000 }),
  },
  { file: "electronics/promo.webp", w: 2400, h: 1000, svg: () => dark(place(E.headphones({ color: "#d6cdbf", cushion: "#bfb4a3", accent: "#b9b2a6" }), { x: 1700, y: 470, s: 1.25, r: -12 }) + place(E.earbuds({ color: "#2c2e33" }), { x: 2140, y: 760, s: 0.6, r: 10 }), { w: 2400, h: 1000, glowX: 0.7, glowY: 0.5, glow: "#ff8a3d" }) },
  { file: "electronics/gaming.webp", w: 1200, h: 900, svg: () => dark(place(E.handheld({ color: "#2d3036", accent: "#4f8cff", wall: WP.violet }), { x: 600, y: 420, s: 0.95, r: -6 }) + place(E.controller({ color: "#f1f1ef", accent: "#2f3238" }), { x: 820, y: 700, s: 0.7, r: 12 }), { w: 1200, h: 900, glow: "#8a5cff" }) },
];

export default [...products, ...categories, ...campaign];
