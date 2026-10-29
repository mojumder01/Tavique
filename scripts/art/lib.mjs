// Shared drawing helpers for the Tavique demo artwork.
// Every image is composed from these primitives as SVG, then rasterised by generate.mjs.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const fontDir = fileURLToPath(new URL("./fonts/", import.meta.url));
const embed = (file) => readFileSync(fontDir + file).toString("base64");
const FONT_CSS = `@font-face{font-family:Jost;src:url(data:font/woff2;base64,${embed("jost.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Bodoni;src:url(data:font/woff2;base64,${embed("bodoni.woff2")}) format("woff2");font-weight:400 900}`;

/* ---------- colour ---------- */
export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}
export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
}
/** amt > 0 lightens toward white, amt < 0 darkens toward black. */
export function shade(c, amt) {
  return amt >= 0 ? mix(c, "#ffffff", amt) : mix(c, "#000000", -amt);
}

/* ---------- deterministic randomness ---------- */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let counter = 0;
export const uid = (prefix = "g") => `${prefix}${++counter}`;
export const r2 = (n) => Math.round(n * 100) / 100;

/* ---------- gradients & filters ---------- */
export function linear(id, stops, { x1 = 0, y1 = 0, x2 = 1, y2 = 0, units = "objectBoundingBox" } = {}) {
  const s = stops
    .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
    .join("");
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="${units}">${s}</linearGradient>`;
}
export function radial(id, stops, { cx = 0.5, cy = 0.5, r = 0.5, fx, fy, units = "objectBoundingBox" } = {}) {
  const s = stops
    .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
    .join("");
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${fx != null ? `fx="${fx}" fy="${fy}"` : ""} gradientUnits="${units}">${s}</radialGradient>`;
}
/** Horizontal gradient that reads as a lit cylinder (light from the left). */
export function cylinder(id, base, { lo = -0.32, hi = 0.38, spec = true } = {}) {
  const stops = [
    [0, shade(base, lo)],
    [0.1, shade(base, lo * 0.45)],
    [0.26, base],
    [0.36, shade(base, hi * 0.7)],
    [0.42, shade(base, spec ? hi : hi * 0.6)],
    [0.5, shade(base, hi * 0.45)],
    [0.72, base],
    [0.9, shade(base, lo * 0.55)],
    [1, shade(base, lo)],
  ];
  return linear(id, stops);
}
export function blurFilter(id, sd, extra = "") {
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd}"/>${extra}</filter>`;
}

/* ---------- document ---------- */
export function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>${FONT_CSS}</style>${body}</svg>`;
}
export function place(content, { x = 0, y = 0, s = 1, r = 0, sx, sy } = {}) {
  const scale = sx != null ? `scale(${sx} ${sy ?? sx})` : `scale(${s})`;
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r}) ${scale}">${content}</g>`;
}
export function text(str, { x = 0, y = 0, size = 20, family = "Jost", weight = 500, fill = "#222", ls = 0, anchor = "middle", rotate = 0, opacity = 1, style = "normal" }) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" letter-spacing="${ls}" text-anchor="${anchor}" fill="${fill}" opacity="${opacity}" ${rotate ? `transform="rotate(${rotate} ${x} ${y})"` : ""}>${str}</text>`;
}

/* ---------- paths ---------- */
const fmt = (p) => `${r2(p[0])},${r2(p[1])}`;
const neg = (p) => [-p[0], p[1]];
/**
 * Build a closed, left/right symmetric path. `start` sits on the centre line (x = 0),
 * `segs` trace the right-hand side down to a point on the centre line.
 * Each seg is { to, c1?, c2? } (cubic when control points are given).
 */
export function symPath(start, segs) {
  let d = `M${fmt(start)}`;
  for (const s of segs) d += s.c1 ? ` C${fmt(s.c1)} ${fmt(s.c2)} ${fmt(s.to)}` : ` L${fmt(s.to)}`;
  const pts = [start, ...segs.map((s) => s.to)];
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i];
    const target = neg(pts[i]);
    d += s.c1 ? ` C${fmt(neg(s.c2))} ${fmt(neg(s.c1))} ${fmt(target)}` : ` L${fmt(target)}`;
  }
  return d + " Z";
}
export function roundedRect(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  return `M${x + rr},${y} H${x + w - rr} A${rr},${rr} 0 0 1 ${x + w},${y + rr} V${y + h - rr} A${rr},${rr} 0 0 1 ${x + w - rr},${y + h} H${x + rr} A${rr},${rr} 0 0 1 ${x},${y + h - rr} V${y + rr} A${rr},${rr} 0 0 1 ${x + rr},${y} Z`;
}
/** Organic closed blob around (cx, cy) — used for swatches and smears. */
export function blob(cx, cy, rx, ry, { seed = 1, points = 14, jitter = 0.18 } = {}) {
  const rand = rng(seed);
  const pts = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const k = 1 + (rand() - 0.5) * 2 * jitter;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  // Catmull-Rom → cubic Bézier for a smooth outline
  let d = `M${fmt(pts[0])}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p3 = pts[(i + 2) % pts.length];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
  }
  return d + " Z";
}

/* ---------- scene building blocks ---------- */
/**
 * Seamless studio backdrop. `floor` adds a cyclorama sweep that starts at `horizon` (0–1).
 * `windows` draws soft diagonal window-light shadows across the wall for an editorial feel.
 */
export function backdrop(w, h, { wall, floor, horizon = 0.74, light = 0.42, lightX = 0.28, lightY = 0.12, windows = null, vignette = 0.1, grainAmt = 0 } = {}) {
  const g = uid("bg");
  const l = uid("lt");
  const v = uid("vg");
  const stops = floor
    ? [
        [0, shade(wall, 0.07)],
        [Math.max(0, horizon - 0.08), wall],
        [Math.min(1, horizon + 0.04), shade(floor, -0.05)],
        [1, shade(floor, 0.05)],
      ]
    : [
        [0, shade(wall, 0.06)],
        [1, shade(wall, -0.05)],
      ];
  let out = `<defs>${linear(g, stops, { x1: 0, y1: 0, x2: 0, y2: 1 })}
    ${radial(l, [[0, "#ffffff", light], [1, "#ffffff", 0]], { cx: lightX, cy: lightY, r: 0.85 })}
    ${radial(v, [[0.55, "#000000", 0], [1, "#000000", vignette]], { cx: 0.5, cy: 0.48, r: 0.75 })}</defs>
    <rect width="${w}" height="${h}" fill="url(#${g})"/>
    <rect width="${w}" height="${h}" fill="url(#${l})"/>`;
  if (windows) out += windowLight(w, h, windows);
  out += `<rect width="${w}" height="${h}" fill="url(#${v})"/>`;
  if (grainAmt) out += grain(w, h, grainAmt);
  return out;
}
/** Diagonal bars of shadow, like sun through window mullions. */
export function windowLight(w, h, { color = "#3b2a1d", opacity = 0.09, angle = -28, x = 0.55, bars = 3, gap = 0.16, width = 0.11, blur = 14 } = {}) {
  const f = uid("wl");
  let bodies = "";
  for (let i = 0; i < bars; i++) {
    const bx = (x + i * gap) * w;
    bodies += `<rect x="${bx}" y="${-h}" width="${width * w}" height="${h * 3}"/>`;
  }
  // the shadow frame: bars + a horizontal transom
  bodies += `<rect x="${(x - 0.05) * w}" y="${h * 0.38}" width="${(bars * gap + 0.2) * w}" height="${0.035 * h}"/>`;
  return `<defs>${blurFilter(f, blur)}</defs><g filter="url(#${f})" fill="${color}" opacity="${opacity}" transform="rotate(${angle} ${w / 2} ${h / 2})">${bodies}</g>`;
}
export function grain(w, h, amount = 0.05) {
  const f = uid("gr");
  return `<defs><filter id="${f}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 ${amount}"/></feComponentTransfer></filter></defs><rect width="${w}" height="${h}" filter="url(#${f})"/>`;
}
/** Soft contact shadow under an object (ellipse + wider ambient shadow). */
export function contactShadow(cx, cy, rx, { ry = rx * 0.12, opacity = 0.32, color = "#1d1610", blur = null } = {}) {
  const f1 = uid("cs");
  const f2 = uid("cs");
  return `<defs>${blurFilter(f1, blur ?? rx * 0.06)}${blurFilter(f2, rx * 0.22)}</defs>
    <ellipse cx="${cx}" cy="${cy + ry * 0.6}" rx="${rx * 1.25}" ry="${ry * 2.4}" fill="${color}" opacity="${opacity * 0.45}" filter="url(#${f2})"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}" filter="url(#${f1})"/>`;
}
/** Shadow cast on the wall behind a hanging object: the same silhouette, offset and blurred. */
export function wallShadow(content, { dx = 34, dy = 26, blur = 18, opacity = 0.22, color = "#2a1f16" } = {}) {
  const f = uid("ws");
  return `<defs><filter id="${f}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feFlood flood-color="${color}"/><feComposite in2="SourceAlpha" operator="in"/><feGaussianBlur stdDeviation="${blur}"/></filter></defs>
    <g transform="translate(${dx} ${dy})" filter="url(#${f})" opacity="${opacity}">${content}</g>`;
}
/** A clipped overlay that adds volume to a flat silhouette. */
export function volume(clipD, { side = 0.24, top = 0.06, bottom = 0.14, lightSide = "left" } = {}) {
  const c = uid("cl");
  const h = uid("vh");
  const v = uid("vv");
  const hs =
    lightSide === "left"
      ? [[0, "#000", side], [0.22, "#000", 0.02], [0.4, "#fff", 0.07], [0.68, "#000", 0.03], [1, "#000", side * 1.1]]
      : [[0, "#000", side * 1.1], [0.32, "#000", 0.03], [0.6, "#fff", 0.07], [0.78, "#000", 0.02], [1, "#000", side]];
  return `<defs><clipPath id="${c}"><path d="${clipD}"/></clipPath>
    ${linear(h, hs)}${linear(v, [[0, "#fff", top], [0.5, "#fff", 0], [1, "#000", bottom]], { x1: 0, y1: 0, x2: 0, y2: 1 })}</defs>
    <g clip-path="url(#${c})"><path d="${clipD}" fill="url(#${h})"/><path d="${clipD}" fill="url(#${v})"/></g>`;
}
/** Blurred stroke used for fabric folds and creases. */
export function fold(d, { color = "#000", opacity = 0.14, width = 10, blur = 5, clip = null } = {}) {
  const f = uid("fd");
  const c = clip ? uid("fc") : null;
  return `<defs>${blurFilter(f, blur)}${clip ? `<clipPath id="${c}"><path d="${clip}"/></clipPath>` : ""}</defs>
    <g ${clip ? `clip-path="url(#${c})"` : ""}><path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${opacity}" filter="url(#${f})"/></g>`;
}
