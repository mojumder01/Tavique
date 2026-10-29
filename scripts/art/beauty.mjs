// Beauty & Personal Care objects. Origin is the bottom-centre (where the object meets the surface).
import { linear, radial, cylinder, roundedRect, uid, shade, rng, text, blurFilter, blob, mix } from "./lib.mjs";

const label = (brand, sub, { x = 0, y, size = 22, color = "#6b5146", vertical = false, subSize = 10 } = {}) =>
  vertical
    ? `<g transform="translate(${x} ${y}) rotate(-90)">${text(brand, { size, fill: color, ls: size * 0.28, weight: 400 })}${sub ? text(sub, { y: size * 0.9, size: subSize, fill: color, ls: 2, weight: 400, opacity: 0.8 }) : ""}</g>`
    : `${text(brand, { x, y, size, fill: color, ls: size * 0.28, weight: 400 })}${sub ? text(sub, { x, y: y + size * 0.95, size: subSize, fill: color, ls: 2, weight: 400, opacity: 0.8 }) : ""}`;

/** Translucent glass body with an inner liquid fill. */
function glass(d, inner, { tint = "#e9dccb", liquid = null, level = 0.75, box }) {
  const g = uid("gl");
  const clip = uid("gc");
  const liq = uid("lq");
  const [x, y, w, h] = box;
  return `<defs>${cylinder(g, tint, { lo: -0.2, hi: 0.5 })}<clipPath id="${clip}"><path d="${inner}"/></clipPath>
      ${liquid ? cylinder(liq, liquid, { lo: -0.3, hi: 0.25, spec: false }) : ""}</defs>
    <path d="${d}" fill="url(#${g})" opacity="0.92"/>
    ${liquid ? `<g clip-path="url(#${clip})"><rect x="${x}" y="${y + h * (1 - level)}" width="${w}" height="${h * level}" fill="url(#${liq})" opacity="0.9"/></g>` : ""}
    <path d="M${x + w * 0.2},${y + 14} L${x + w * 0.2},${y + h - 14}" stroke="#fff" stroke-width="${w * 0.07}" stroke-linecap="round" opacity="0.38"/>`;
}

export function dropper({ tint = "#c58a4b", liquid = "#d99a3d", bulb = "#efe8df", labelColor = "#f4ede3", brand = "TAVIQUE", sub = "VITAMIN C SERUM", w = 180, h = 300 } = {}) {
  const x = -w / 2;
  const body = roundedRect(x, -h, w, h, 26);
  const bg = uid("bb");
  return `<defs>${cylinder(bg, bulb, { lo: -0.25, hi: 0.3 })}</defs>
    ${glass(body, roundedRect(x + 10, -h + 10, w - 20, h - 20, 20), { tint, liquid, level: 0.7, box: [x, -h, w, h] })}
    <rect x="-36" y="${-h - 34}" width="72" height="40" rx="6" fill="${shade(tint, -0.2)}"/>
    <path d="${roundedRect(-54, -h - 96, 108, 66, 10)}" fill="url(#${bg})"/>
    <path d="M-38,${-h - 96} C-40,${-h - 170} 40,${-h - 170} 38,${-h - 96} Z" fill="url(#${bg})"/>
    <rect x="${x + 14}" y="${-h * 0.62}" width="${w - 28}" height="${h * 0.36}" rx="4" fill="${labelColor}"/>
    ${label(brand, sub, { y: -h * 0.47, size: Math.round(w * 0.11), color: "#6b5146", subSize: Math.round(w * 0.055) })}`;
}

export function jar({ color = "#f1ebe3", lid = "#e4d7c8", brand = "TAVIQUE", sub = "BARRIER CREAM" } = {}) {
  const b = uid("jb");
  const l = uid("jl");
  return `<defs>${cylinder(b, color, { lo: -0.2, hi: 0.25 })}${cylinder(l, lid, { lo: -0.28, hi: 0.3 })}</defs>
    <path d="${roundedRect(-180, -190, 360, 190, 34)}" fill="url(#${b})"/>
    <path d="${roundedRect(-190, -284, 380, 104, 22)}" fill="url(#${l})"/>
    ${Array.from({ length: 30 }, (_, i) => `<path d="M${-176 + i * 12.2},-272 V-194" stroke="${shade(lid, -0.12)}" stroke-width="2" opacity="0.5"/>`).join("")}
    ${label(brand, sub, { y: -102, size: 30, color: "#6b5146", subSize: 13 })}`;
}

export function pumpBottle({ color = "#f3eee8", pump = "#e9e1d6", brand = "TAVIQUE", sub = "SOFT FOAMING CLEANSER", w = 190, h = 520, labelColor = "#b07f6a" } = {}) {
  const b = uid("pb");
  const p = uid("pp");
  const x = -w / 2;
  return `<defs>${cylinder(b, color, { lo: -0.18, hi: 0.22 })}${cylinder(p, pump, { lo: -0.25, hi: 0.3 })}</defs>
    <path d="M-36,${-h - 30} L-30,${-h - 100} L-112,${-h - 96} C-120,${-h - 96} -124,${-h - 104} -118,${-h - 110} L-28,${-h - 124} L28,${-h - 124} L30,${-h - 30} Z" fill="url(#${p})"/>
    <path d="${roundedRect(-48, -h - 36, 96, 52, 10)}" fill="url(#${p})"/>
    <path d="${roundedRect(x, -h, w, h, w * 0.24)}" fill="url(#${b})"/>
    ${label(brand, null, { x: 14, y: -h * 0.52, size: Math.round(w * 0.3), color: labelColor, vertical: true })}
    ${text(sub, { x: 0, y: -48, size: 11, fill: labelColor, ls: 2, opacity: 0.85 })}`;
}

export function tallBottle({ tint = "#efe7dc", liquid = "#e7c9b3", cap = "#cbb59e", brand = "SOLA", sub = "BALANCING TONER" } = {}) {
  const c = uid("tc");
  return `<defs>${cylinder(c, cap, { lo: -0.3, hi: 0.3 })}</defs>
    ${glass(roundedRect(-100, -480, 200, 480, 30), roundedRect(-88, -468, 176, 456, 24), { tint, liquid, level: 0.82, box: [-100, -480, 200, 480] })}
    <rect x="-40" y="-512" width="80" height="40" fill="${shade(tint, -0.15)}"/>
    <path d="${roundedRect(-56, -630, 112, 124, 14)}" fill="url(#${c})"/>
    <rect x="-82" y="-300" width="164" height="150" rx="4" fill="#f8f4ee" opacity="0.92"/>
    ${label(brand, sub, { y: -240, size: 30, color: "#6b5146", subSize: 11 })}`;
}

export function tube({ color = "#f2ece4", cap = "#d9c6b2", brand = "TAVIQUE", sub = "MINERAL SPF 40", labelColor = "#a8775f", w = 190, h = 520 } = {}) {
  const b = uid("tb");
  const c = uid("tc");
  const body = `M${-w * 0.42},${-110} L${-w / 2 - 14},${-h} L${w / 2 + 14},${-h} L${w * 0.42},${-110} Z`;
  return `<defs>${cylinder(b, color, { lo: -0.2, hi: 0.24 })}${cylinder(c, cap, { lo: -0.3, hi: 0.3 })}</defs>
    <path d="${roundedRect(-w * 0.42, -116, w * 0.84, 116, 14)}" fill="url(#${c})"/>
    <path d="${body}" fill="url(#${b})"/>
    <rect x="${-w / 2 - 14}" y="${-h - 6}" width="${w + 28}" height="34" fill="${shade(color, -0.05)}"/>
    ${Array.from({ length: 16 }, (_, i) => `<path d="M${-w / 2 - 6 + i * ((w + 12) / 15)},${-h - 4} V${-h + 24}" stroke="${shade(color, -0.15)}" stroke-width="2"/>`).join("")}
    ${label(brand, null, { x: 10, y: -h * 0.56, size: Math.round(w * 0.24), color: labelColor, vertical: true })}
    ${text(sub, { y: -150, size: 12, fill: labelColor, ls: 2 })}`;
}

export function multiStick({ body = "#efe9e0", shadeColor = "#e37f6e", metal = "#c9ccd0", brand = "TAVIQUE" } = {}) {
  const b = uid("mb");
  const m = uid("mm");
  const s = uid("ms");
  return `<defs>${cylinder(b, body, { lo: -0.2, hi: 0.24 })}${cylinder(m, metal, { lo: -0.45, hi: 0.55 })}${cylinder(s, shadeColor, { lo: -0.25, hi: 0.15, spec: false })}</defs>
    <path d="M-56,-420 L56,-420 L56,-476 C30,-498 -30,-506 -56,-492 Z" fill="url(#${s})"/>
    <path d="${roundedRect(-64, -424, 128, 54, 4)}" fill="url(#${m})"/>
    <path d="${roundedRect(-64, -372, 128, 372, 10)}" fill="url(#${b})"/>
    ${label(brand, null, { x: 12, y: -190, size: 40, color: "#5e4a40", vertical: true })}`;
}

export function lipstick({ caseColor = "#d8c8b3", shadeColor = "#9b4f55", inner = "#cfb07a" } = {}) {
  const c = uid("lc");
  const g = uid("lg");
  const s = uid("ls");
  return `<defs>${cylinder(c, caseColor, { lo: -0.28, hi: 0.3 })}${cylinder(g, inner, { lo: -0.4, hi: 0.5 })}${cylinder(s, shadeColor, { lo: -0.3, hi: 0.2, spec: false })}</defs>
    <path d="M-40,-330 L40,-330 L40,-388 C20,-420 -10,-430 -40,-420 Z" fill="url(#${s})"/>
    <path d="${roundedRect(-48, -334, 96, 76, 4)}" fill="url(#${g})"/>
    <path d="${roundedRect(-58, -262, 116, 262, 8)}" fill="url(#${c})"/>
    <rect x="-58" y="-150" width="116" height="3" fill="${shade(caseColor, -0.2)}"/>
    ${label("TAVIQUE", null, { x: 10, y: -80, size: 20, color: "#6b5146", vertical: true })}`;
}

export function compact({ caseColor = "#e8ddd1", shadeColor = "#e7a19a", brand = "TAVIQUE" } = {}) {
  const c = uid("cc");
  const m = uid("cm");
  const p = uid("cp");
  const clip = uid("cl");
  return `<defs>${linear(c, [[0, shade(caseColor, 0.1)], [1, shade(caseColor, -0.18)]], { x1: 0, y1: 0, x2: 0, y2: 1 })}
      ${linear(m, [[0, "#f6f3ef"], [0.45, "#c9c4bd"], [0.55, "#e9e5df"], [1, "#a9a39b"]], { x1: 0, y1: 0, x2: 1, y2: 1 })}
      ${radial(p, [[0, shade(shadeColor, 0.15)], [1, shade(shadeColor, -0.12)]], { cx: 0.4, cy: 0.35 })}
      <clipPath id="${clip}"><ellipse cx="0" cy="-70" rx="150" ry="58"/></clipPath></defs>
    <ellipse cx="0" cy="-330" rx="200" ry="200" fill="url(#${c})" transform="scale(1 1)"/>
    <ellipse cx="0" cy="-330" rx="176" ry="176" fill="url(#${m})"/>
    <path d="M-200,-70 L-200,-30 C-200,10 -110,30 0,30 C110,30 200,10 200,-30 L200,-70 Z" fill="${shade(caseColor, -0.15)}"/>
    <ellipse cx="0" cy="-70" rx="200" ry="80" fill="url(#${c})"/>
    <ellipse cx="0" cy="-70" rx="150" ry="58" fill="url(#${p})"/>
    <g clip-path="url(#${clip})" opacity="0.25">${Array.from({ length: 14 }, (_, i) => `<path d="M${-160 + i * 24},-140 L${-120 + i * 24},0" stroke="#fff" stroke-width="3"/>`).join("")}</g>
    ${text(brand, { y: -320, size: 26, fill: "#8d7e70", ls: 8, weight: 400, opacity: 0.8 })}`;
}

export function perfume({ glassTint = "#efe6da", liquid = "#e6c79a", cap = "#b9946a", brand = "MARÉ", sub = "EAU DE PARFUM" } = {}) {
  const cg = uid("pc");
  return `<defs>${cylinder(cg, cap, { lo: -0.35, hi: 0.35 })}</defs>
    ${glass(roundedRect(-170, -380, 340, 380, 36), roundedRect(-142, -352, 284, 300, 22), { tint: glassTint, liquid, level: 0.86, box: [-170, -380, 340, 380] })}
    <rect x="-150" y="-36" width="300" height="20" rx="8" fill="#fff" opacity="0.35"/>
    <rect x="-36" y="-412" width="72" height="36" fill="${shade(glassTint, -0.15)}"/>
    <path d="${roundedRect(-74, -540, 148, 132, 14)}" fill="url(#${cg})"/>
    <rect x="-90" y="-240" width="180" height="96" rx="2" fill="#f8f4ee" opacity="0.95"/>
    ${label(brand, sub, { y: -196, size: 32, color: "#5e4a40", subSize: 11 })}`;
}

export function mist({ tint = "#eef0ec", liquid = "#d7e2d4", cap = "#e9e5df", brand = "SOLA", sub = "BODY MIST" } = {}) {
  const cg = uid("mc");
  return `<defs>${cylinder(cg, cap, { lo: -0.2, hi: 0.35 })}</defs>
    ${glass(roundedRect(-90, -470, 180, 470, 34), roundedRect(-78, -458, 156, 446, 28), { tint, liquid, level: 0.8, box: [-90, -470, 180, 470] })}
    <rect x="-30" y="-500" width="60" height="34" fill="${shade(tint, -0.2)}"/>
    <path d="${roundedRect(-62, -640, 124, 144, 50)}" fill="url(#${cg})" opacity="0.92"/>
    <rect x="-70" y="-300" width="140" height="130" rx="3" fill="#f8f4ee" opacity="0.92"/>
    ${label(brand, sub, { y: -248, size: 26, color: "#5e4a40", subSize: 10 })}`;
}

export function stick({ color = "#ece6dd", cap = "#d9cbbb", brand = "AUREL", sub = "NATURAL DEODORANT" } = {}) {
  const b = uid("sb");
  const c = uid("sc");
  return `<defs>${cylinder(b, color, { lo: -0.22, hi: 0.25 })}${cylinder(c, cap, { lo: -0.3, hi: 0.3 })}</defs>
    <path d="${roundedRect(-96, -300, 192, 300, 44)}" fill="url(#${b})"/>
    <path d="${roundedRect(-100, -440, 200, 150, 60)}" fill="url(#${c})"/>
    <rect x="-100" y="-298" width="200" height="4" fill="${shade(cap, -0.2)}"/>
    ${label(brand, sub, { y: -170, size: 30, color: "#6b5146", subSize: 10 })}`;
}

/** Smear of product, like a swatch on paper. */
export function smear(cx, cy, rx, ry, color, { seed = 3, rotate = -20, crumbs = 26 } = {}) {
  const rand = rng(seed);
  const g = uid("sm");
  let bits = "";
  for (let i = 0; i < crumbs; i++) {
    const a = rand() * Math.PI * 2;
    const r = 0.85 + rand() * 0.35;
    bits += `<path d="${blob(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, 4 + rand() * 12, 3 + rand() * 9, { seed: seed * 31 + i, jitter: 0.4, points: 7 })}" fill="${shade(color, (rand() - 0.5) * 0.2)}"/>`;
  }
  return `<defs>${radial(g, [[0, shade(color, 0.12)], [0.7, color], [1, shade(color, -0.15)]], { cx: 0.45, cy: 0.4, r: 0.6 })}</defs>
    <g transform="rotate(${rotate} ${cx} ${cy})">
      <path d="${blob(cx, cy, rx, ry, { seed, jitter: 0.16, points: 16 })}" fill="url(#${g})"/>
      ${bits}
      <path d="${blob(cx - rx * 0.15, cy - ry * 0.2, rx * 0.5, ry * 0.2, { seed: seed + 2, jitter: 0.2 })}" fill="#fff" opacity="0.18"/>
    </g>`;
}

/** Hard-edged sunlight shadow: the silhouette, skewed and offset across the surface. */
export function hardShadow(content, { dx = 60, dy = 0, skewX = -40, sy = 0.35, opacity = 0.2, blur = 4, color = "#5a4636" } = {}) {
  const f = uid("hs");
  return `<defs><filter id="${f}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feFlood flood-color="${color}"/><feComposite in2="SourceAlpha" operator="in"/><feGaussianBlur stdDeviation="${blur}"/></filter></defs>
    <g opacity="${opacity}" filter="url(#${f})" transform="translate(${dx} ${dy}) skewX(${skewX}) scale(1 ${sy})">${content}</g>`;
}

export function droplets(w, h, { color = "#ffffff", seed = 5, count = 40 } = {}) {
  const rand = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 6 + rand() * 30;
    const g = uid("dp");
    out += `<defs>${radial(g, [[0, color, 0.05], [0.7, color, 0.25], [1, "#000", 0.12]], { cx: 0.6, cy: 0.65 })}</defs>
      <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * (0.85 + rand() * 0.2)}" fill="url(#${g})"/>
      <ellipse cx="${x - r * 0.35}" cy="${y - r * 0.35}" rx="${r * 0.22}" ry="${r * 0.16}" fill="#fff" opacity="0.8"/>`;
  }
  return out;
}

export function cream(cx, cy, r, color = "#f3ece2", seed = 4) {
  const rand = rng(seed);
  let swirl = "";
  for (let i = 0; i < 6; i++) {
    const rr = r * (1 - i * 0.15);
    swirl += `<path d="${blob(cx + (rand() - 0.5) * 20, cy + (rand() - 0.5) * 20 - i * 8, rr, rr * 0.62, { seed: seed + i, jitter: 0.1, points: 12 })}" fill="${shade(color, i * 0.025)}" stroke="${shade(color, -0.1)}" stroke-width="2" opacity="0.98"/>`;
  }
  return swirl;
}

export function leaf(x, y, len, angle, color = "#7d8a6a") {
  const g = uid("lf");
  return `<defs>${linear(g, [[0, shade(color, 0.15)], [1, shade(color, -0.2)]], { x1: 0, y1: 0, x2: 1, y2: 1 })}</defs>
    <g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0,0 C${len * 0.3},${-len * 0.18} ${len * 0.7},${-len * 0.16} ${len},0 C${len * 0.7},${len * 0.16} ${len * 0.3},${len * 0.18} 0,0 Z" fill="url(#${g})"/>
    <path d="M0,0 L${len * 0.96},0" stroke="${shade(color, 0.25)}" stroke-width="3" opacity="0.6"/></g>`;
}
export { mix, blurFilter };

export function mascara({ color = "#2a2523", band = "#c9ab7c", brand = "TAVIQUE" } = {}) {
  const b = uid("mc");
  const g = uid("mg");
  return `<defs>${cylinder(b, color, { lo: -0.4, hi: 0.35 })}${cylinder(g, band, { lo: -0.4, hi: 0.5 })}</defs>
    <path d="${roundedRect(-46, -560, 92, 560, 44)}" fill="url(#${b})"/>
    <rect x="-46" y="-330" width="92" height="16" fill="url(#${g})"/>
    ${label(brand, null, { x: 8, y: -160, size: 26, color: shade(band, 0.2), vertical: true })}`;
}

export function flipBottle({ color = "#e9e2d8", cap = "#cdbba7", brand = "AUREL", sub = "REPAIR SHAMPOO", w = 220, h = 560, labelColor = "#6b5146" } = {}) {
  const b = uid("fb");
  const c = uid("fc");
  const x = -w / 2;
  return `<defs>${cylinder(b, color, { lo: -0.2, hi: 0.22 })}${cylinder(c, cap, { lo: -0.3, hi: 0.3 })}</defs>
    <path d="${roundedRect(x, -h, w, h, w * 0.22)}" fill="url(#${b})"/>
    <path d="${roundedRect(x + 22, -h - 70, w - 44, 84, 22)}" fill="url(#${c})"/>
    <rect x="${x + 22}" y="${-h - 34}" width="${w - 44}" height="3" fill="${shade(cap, -0.25)}"/>
    ${label(brand, sub, { y: -h * 0.5, size: Math.round(w * 0.15), color: labelColor, subSize: 11 })}`;
}
