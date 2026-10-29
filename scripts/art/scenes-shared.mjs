import { svg, place, backdrop, contactShadow, text, wallShadow } from "./lib.mjs";
import * as F from "./fashion.mjs";
import * as E from "./electronics.mjs";
import * as B from "./beauty.mjs";
import { WP } from "./scenes-electronics.mjs";

// 1200×630 Open Graph card: one panel per storefront under the Tavique wordmark.
const og = () => {
  const w = 1200;
  const h = 630;
  const panel = (x, wall, body) => `<g transform="translate(${x} 0)"><svg width="400" height="${h}" viewBox="0 0 400 ${h}">${backdrop(400, h, { wall, floor: wall, horizon: 0.86, vignette: 0.05 })}${body}</svg></g>`;
  return svg(
    w,
    h,
    panel(0, "#e2d8ca", wallShadow(place(F.hanger() + F.coat({ color: "#b8946a" }), { x: 200, y: 130, s: 0.48 }), { dx: 14, dy: 10, blur: 10, opacity: 0.2 }) + place(F.hanger() + F.coat({ color: "#b8946a" }), { x: 200, y: 130, s: 0.48 })) +
      panel(400, "#eef0f3", place(E.phoneBack({ body: "#a9bfd4", lenses: 3 }), { x: 170, y: 380, s: 0.48, r: -9 }) + place(E.phoneFront({ frame: "#3b3e44", wall: WP.blue }), { x: 250, y: 395, s: 0.48, r: 7 })) +
      panel(800, "#f3ece4", contactShadow(200, 560, 70, { opacity: 0.25, ry: 6 }) + place(B.multiStick({ shadeColor: "#e37f6e" }), { x: 200, y: 560, s: 0.62 }) + B.smear(300, 560, 70, 30, "#e37f6e", { seed: 2, crumbs: 10 })) +
      `<rect x="0" y="0" width="${w}" height="150" fill="#1f1c1a" opacity="0.88"/>` +
      text("Tavique", { x: 600, y: 98, size: 74, family: "Bodoni", weight: 500, fill: "#f6f1ea", ls: 1 }) +
      text("FASHION · ELECTRONICS · BEAUTY", { x: 600, y: 132, size: 15, fill: "#d9cfc2", ls: 6, weight: 400 }),
  );
};

export default [{ file: "og/tavique.jpg", w: 1200, h: 630, svg: og }];
