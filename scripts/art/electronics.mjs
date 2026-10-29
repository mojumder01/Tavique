// Electronics & Gadgets objects. Origin is the visual centre unless noted.
import { linear, radial, cylinder, symPath, roundedRect, uid, shade, rng, text, blurFilter, blob } from "./lib.mjs";

const metalGrad = (id, c, dir = { x1: 0, y1: 0, x2: 1, y2: 1 }) =>
  linear(id, [[0, shade(c, 0.45)], [0.35, c], [0.5, shade(c, -0.12)], [0.62, shade(c, 0.1)], [1, shade(c, -0.25)]], dir);

/** Abstract wallpaper used on every screen, clipped to a rounded rectangle. */
export function screen(x, y, w, h, r, { a = "#1f3b73", b = "#0d1424", c = "#5fa8ff", seed = 4 } = {}) {
  const clip = uid("scr");
  const g = uid("sg");
  const f = uid("sf");
  const gl = uid("gl");
  const rand = rng(seed);
  let blobs = "";
  for (let i = 0; i < 3; i++) {
    blobs += `<path d="${blob(x + w * (0.25 + rand() * 0.5), y + h * (0.3 + rand() * 0.5), w * (0.35 + rand() * 0.25), h * (0.14 + rand() * 0.12), { seed: seed * 7 + i, jitter: 0.3 })}" fill="${i === 1 ? a : c}" opacity="${0.55 + rand() * 0.35}"/>`;
  }
  return `<defs><clipPath id="${clip}"><path d="${roundedRect(x, y, w, h, r)}"/></clipPath>
      ${linear(g, [[0, b], [1, shade(a, -0.3)]], { x1: 0, y1: 0, x2: 0.3, y2: 1 })}${blurFilter(f, Math.max(w, h) * 0.05)}
      ${linear(gl, [[0, "#fff", 0.14], [0.4, "#fff", 0.02], [1, "#fff", 0]], { x1: 0, y1: 0, x2: 1, y2: 1 })}</defs>
    <g clip-path="url(#${clip})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${g})"/><g filter="url(#${f})">${blobs}</g>
    <path d="M${x},${y} L${x + w * 0.55},${y} L${x},${y + h * 0.45} Z" fill="url(#${gl})"/></g>`;
}

export function phoneFront({ frame = "#3b3e44", wall = {}, w = 340, h = 700 } = {}) {
  const m = uid("pm");
  const x = -w / 2;
  const y = -h / 2;
  return `<defs>${metalGrad(m, frame)}</defs>
    <rect x="${x - 4}" y="${y + 150}" width="6" height="70" rx="3" fill="${shade(frame, -0.2)}"/>
    <rect x="${-x - 2}" y="${y + 190}" width="6" height="110" rx="3" fill="${shade(frame, -0.2)}"/>
    <path d="${roundedRect(x, y, w, h, 56)}" fill="url(#${m})"/>
    <path d="${roundedRect(x + 6, y + 6, w - 12, h - 12, 50)}" fill="#08090b"/>
    ${screen(x + 16, y + 16, w - 32, h - 32, 42, wall)}
    <rect x="-46" y="${y + 34}" width="92" height="26" rx="13" fill="#050607"/>
    ${text("9:41", { x: x + 62, y: y + 54, size: 17, fill: "#fff", weight: 500 })}
    ${text("Thursday, 12 June", { y: y + 150, size: 20, fill: "#fff", weight: 400, opacity: 0.85 })}
    ${text("10:28", { y: y + 230, size: 84, fill: "#fff", weight: 300 })}
    <rect x="-60" y="${h / 2 - 32}" width="120" height="6" rx="3" fill="#fff" opacity="0.8"/>`;
}

export function phoneBack({ body = "#3b3e44", lenses = 3, w = 340, h = 700, logo = "arcline" } = {}) {
  const m = uid("pm");
  const bg = uid("pb");
  const x = -w / 2;
  const y = -h / 2;
  const lens = (cx, cy, r) => {
    const lg = uid("le");
    return `<defs>${radial(lg, [[0, "#3a4a63"], [0.35, "#0b0e14"], [1, "#000"]], { cx: 0.35, cy: 0.35, r: 0.7 })}</defs>
      <circle cx="${cx}" cy="${cy}" r="${r + 9}" fill="${shade(body, -0.25)}"/><circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="${shade(body, 0.35)}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${lg})"/><circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.18}" fill="#fff" opacity="0.5"/>`;
  };
  const pos = lenses === 3 ? [[x + 70, y + 72], [x + 70, y + 152], [x + 140, y + 112]] : [[x + 70, y + 72], [x + 70, y + 150]];
  return `<defs>${metalGrad(m, body)}${linear(bg, [[0, shade(body, 0.12)], [0.6, body], [1, shade(body, -0.1)]], { x1: 0, y1: 0, x2: 1, y2: 1 })}</defs>
    <path d="${roundedRect(x, y, w, h, 56)}" fill="url(#${m})"/>
    <path d="${roundedRect(x + 7, y + 7, w - 14, h - 14, 50)}" fill="url(#${bg})"/>
    <path d="${roundedRect(x + 24, y + 24, lenses === 3 ? 172 : 104, 182, 40)}" fill="${shade(body, 0.08)}" stroke="${shade(body, -0.15)}" stroke-width="2"/>
    ${pos.map(([cx, cy]) => lens(cx, cy, 26)).join("")}
    <circle cx="${x + (lenses === 3 ? 150 : 104)}" cy="${y + 48}" r="9" fill="#f3e6c8"/>
    ${text(logo, { y: y + h * 0.6, size: 26, fill: shade(body, -0.22), weight: 500, ls: 2 })}`;
}

export function laptop({ lid = "#c9ccd1", wall = {}, w = 860, h = 540 } = {}) {
  const m = uid("lm");
  const b = uid("lb");
  const x = -w / 2;
  const y = -h;
  return `<defs>${metalGrad(m, lid)}${linear(b, [[0, shade(lid, 0.2)], [0.5, lid], [1, shade(lid, -0.3)]], { x1: 0, y1: 0, x2: 0, y2: 1 })}</defs>
    <path d="${roundedRect(x, y, w, h, 26)}" fill="url(#${m})"/>
    <path d="${roundedRect(x + 8, y + 8, w - 16, h - 12, 20)}" fill="#07080a"/>
    ${screen(x + 24, y + 26, w - 48, h - 52, 8, wall)}
    <circle cx="0" cy="${y + 15}" r="4" fill="#1d2230"/>
    <path d="M${x - 40},0 L${-x + 40},0 L${-x + 64},22 C${-x + 66},30 ${-x + 60},34 ${-x + 50},34 L${x - 50},34 C${x - 60},34 ${x - 66},30 ${x - 64},22 Z" fill="url(#${b})"/>
    <path d="M-70,0 L70,0 L64,10 C62,13 58,14 54,14 L-54,14 C-58,14 -62,13 -64,10 Z" fill="${shade(lid, -0.2)}"/>
    <rect x="${x - 40}" y="-3" width="${w + 80}" height="4" fill="${shade(lid, -0.45)}" opacity="0.6"/>`;
}

export function headphones({ color = "#2f3238", cushion = null, accent = "#9aa3ad" } = {}) {
  const cg = uid("hc");
  const cu = cushion ?? shade(color, -0.35);
  const band = `M-236,60 C-250,-180 -140,-330 0,-332 C140,-330 250,-180 236,60`;
  return `<defs>${cylinder(cg, color, { lo: -0.4, hi: 0.3 })}</defs>
    <path d="${band}" fill="none" stroke="${shade(color, -0.1)}" stroke-width="46" stroke-linecap="round"/>
    <path d="${band}" fill="none" stroke="${shade(color, 0.2)}" stroke-width="8" stroke-linecap="round" opacity="0.5" transform="translate(-6 -10)"/>
    <path d="M-206,40 C-216,-150 -120,-290 0,-292 C120,-290 216,-150 206,40" fill="none" stroke="${cu}" stroke-width="26" stroke-linecap="round"/>
    ${[-1, 1].map((s) => `<rect x="${s * 236 - 7}" y="20" width="14" height="80" rx="6" fill="${accent}"/>`).join("")}
    ${[-1, 1]
      .map(
        (s) => `<g transform="translate(${s * 250} 210)">
          <ellipse cx="${-s * 34}" cy="0" rx="58" ry="132" fill="${cu}"/>
          <ellipse cx="0" cy="0" rx="74" ry="140" fill="url(#${cg})"/>
          <ellipse cx="${s * 8}" cy="0" rx="52" ry="112" fill="${shade(color, 0.06)}" opacity="0.7"/>
          <path d="M${s * -30},-110 C${s * 10},-60 ${s * 10},60 ${s * -30},110" fill="none" stroke="#fff" stroke-width="4" opacity="0.18"/>
        </g>`,
      )
      .join("")}`;
}

export function earbuds({ color = "#f2f2f0" } = {}) {
  const cg = uid("ec");
  const bud = (cx, cy, flip) => {
    const bg = uid("bd");
    return `<defs>${radial(bg, [[0, shade(color, 0.25)], [0.7, color], [1, shade(color, -0.25)]], { cx: 0.38, cy: 0.35, r: 0.7 })}</defs>
      <g transform="translate(${cx} ${cy}) scale(${flip} 1)">
        <ellipse cx="38" cy="-6" rx="30" ry="24" fill="${shade(color, -0.22)}"/>
        <circle r="62" fill="url(#${bg})"/>
        <circle cx="-14" cy="-10" r="24" fill="${shade(color, -0.06)}" stroke="${shade(color, -0.15)}" stroke-width="2"/>
        <circle cx="-22" cy="-22" r="10" fill="#fff" opacity="0.6"/>
      </g>`;
  };
  return `<defs>${radial(cg, [[0, shade(color, 0.2)], [0.75, color], [1, shade(color, -0.2)]], { cx: 0.35, cy: 0.3, r: 0.8 })}</defs>
    <path d="${roundedRect(-190, -150, 380, 250, 120)}" fill="url(#${cg})"/>
    <path d="M-190,-40 L190,-40" stroke="${shade(color, -0.2)}" stroke-width="3"/>
    <circle cx="0" cy="20" r="6" fill="#7ad08a"/>
    ${bud(-120, 160, 1)}${bud(120, 160, -1)}`;
}

export function smartwatch({ caseColor = "#2e3136", band = "#3d4250", ringA = "#4f8cff", ringB = "#5dd39e" } = {}) {
  const m = uid("wm");
  const bg = uid("wb");
  const arc = (r, frac, color, wdt) => {
    const a = frac * Math.PI * 2;
    const x = Math.sin(a) * r;
    const y = -Math.cos(a) * r;
    return `<circle r="${r}" fill="none" stroke="${color}" stroke-width="${wdt}" opacity="0.22"/><path d="M0,${-r} A${r},${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x},${y}" fill="none" stroke="${color}" stroke-width="${wdt}" stroke-linecap="round"/>`;
  };
  return `<defs>${metalGrad(m, caseColor)}${cylinder(bg, band, { lo: -0.28, hi: 0.2 })}</defs>
    <path d="M-110,-170 L-104,-470 Q0,-486 104,-470 L110,-170 Z" fill="url(#${bg})"/>
    <path d="M-110,170 L-104,480 Q0,496 104,480 L110,170 Z" fill="url(#${bg})"/>
    ${[300, 350, 400].map((y) => `<circle cx="0" cy="${y}" r="7" fill="${shade(band, -0.4)}"/>`).join("")}
    <rect x="148" y="-70" width="20" height="62" rx="8" fill="${shade(caseColor, 0.2)}"/>
    <rect x="150" y="10" width="12" height="70" rx="5" fill="${shade(caseColor, -0.1)}"/>
    <path d="${roundedRect(-154, -190, 308, 380, 76)}" fill="url(#${m})"/>
    <path d="${roundedRect(-138, -174, 276, 348, 62)}" fill="#050608"/>
    <g transform="translate(0 -18)">${arc(96, 0.72, ringA, 20)}${arc(70, 0.48, ringB, 20)}</g>
    ${text("10:09", { y: 138, size: 40, fill: "#fff", weight: 400 })}
    <path d="M-120,-150 Q-60,-176 40,-168" fill="none" stroke="#fff" stroke-width="6" opacity="0.12"/>`;
}

export function roundWatch({ caseColor = "#c9ccd1", band = "#d5cbbd", accent = "#ff8a3d" } = {}) {
  const m = uid("rm");
  const bg = uid("rb");
  let ticks = "";
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const big = i % 5 === 0;
    ticks += `<path d="M${Math.sin(a) * 150},${-Math.cos(a) * 150} L${Math.sin(a) * (big ? 136 : 142)},${-Math.cos(a) * (big ? 136 : 142)}" stroke="${shade(caseColor, -0.5)}" stroke-width="${big ? 4 : 2}"/>`;
  }
  return `<defs>${metalGrad(m, caseColor)}${cylinder(bg, band, { lo: -0.25, hi: 0.18 })}</defs>
    <path d="M-96,-140 L-92,-470 Q0,-484 92,-470 L96,-140 Z" fill="url(#${bg})"/>
    <path d="M-96,140 L-92,480 Q0,494 92,480 L96,140 Z" fill="url(#${bg})"/>
    <rect x="160" y="-50" width="22" height="40" rx="8" fill="${shade(caseColor, -0.1)}"/><rect x="160" y="14" width="22" height="40" rx="8" fill="${shade(caseColor, -0.1)}"/>
    <circle r="168" fill="url(#${m})"/>
    <circle r="156" fill="${shade(caseColor, 0.25)}"/>${ticks}
    <circle r="128" fill="#050608"/>
    <path d="M-84,40 A92,92 0 1 1 84,40" fill="none" stroke="#2a2d33" stroke-width="12" stroke-linecap="round"/>
    <path d="M-84,40 A92,92 0 0 1 40,-82" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round"/>
    ${text("8,432", { y: 6, size: 40, fill: "#fff", weight: 400 })}
    ${text("STEPS", { y: 36, size: 14, fill: "#9aa0a8", ls: 3 })}`;
}

export function speaker({ color = "#2f3a4a", top = null } = {}) {
  const cg = uid("sp");
  const p = uid("mesh");
  const clip = uid("sc");
  const tc = top ?? shade(color, -0.15);
  const body = `M-150,-430 L150,-430 L150,-20 C150,8 80,20 0,20 C-80,20 -150,8 -150,-20 Z`;
  return `<defs>${cylinder(cg, color, { lo: -0.45, hi: 0.25 })}
      <pattern id="${p}" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.6" fill="#000" opacity="0.28"/></pattern>
      <clipPath id="${clip}"><path d="${body}"/></clipPath></defs>
    <path d="${body}" fill="url(#${cg})"/>
    <g clip-path="url(#${clip})"><rect x="-160" y="-420" width="320" height="440" fill="url(#${p})"/></g>
    <ellipse cx="0" cy="-430" rx="150" ry="30" fill="${tc}"/>
    <ellipse cx="0" cy="-432" rx="132" ry="24" fill="${shade(tc, 0.1)}"/>
    ${[-50, 0, 50].map((x) => `<circle cx="${x}" cy="-432" r="9" fill="${shade(tc, -0.3)}"/>`).join("")}
    <path d="M-150,-30 C-150,0 -80,12 0,12 C80,12 150,0 150,-30 L150,-20 C150,8 80,20 0,20 C-80,20 -150,8 -150,-20 Z" fill="${shade(color, -0.4)}"/>
    <rect x="-34" y="-250" width="68" height="20" rx="10" fill="${shade(color, 0.25)}" opacity="0.8"/>`;
}

export function smartDisplay({ fabric = "#d8d4cc", frame = "#f4f3f0", wall = {} } = {}) {
  const cg = uid("sd");
  const p = uid("fb");
  return `<defs>${linear(cg, [[0, shade(fabric, 0.12)], [1, shade(fabric, -0.18)]], { x1: 0, y1: 0, x2: 0, y2: 1 })}
      <pattern id="${p}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="none"/><path d="M0,4 H8 M4,0 V8" stroke="#000" stroke-width="1" opacity="0.07"/></pattern></defs>
    <path d="M-250,-4 C-250,-60 -200,-110 -150,-110 L150,-110 C200,-110 250,-60 250,-4 Z" fill="url(#${cg})"/>
    <path d="M-250,-4 C-250,-60 -200,-110 -150,-110 L150,-110 C200,-110 250,-60 250,-4 Z" fill="url(#${p})"/>
    <g transform="rotate(-6 0 -260)">
      <path d="${roundedRect(-310, -470, 620, 400, 30)}" fill="${frame}"/>
      ${screen(-288, -448, 576, 356, 12, wall)}
      ${text("21°", { x: -250, y: -330, size: 64, fill: "#fff", weight: 300, anchor: "start" })}
      ${text("Living room · Lights on", { x: -250, y: -290, size: 20, fill: "#fff", weight: 400, anchor: "start", opacity: 0.85 })}
      <circle cx="210" cy="-370" r="34" fill="#ffd27a" opacity="0.92"/>
    </g>`;
}

export function controller({ color = "#f1f1ef", accent = "#2f3238" } = {}) {
  const body = symPath([0, -150], [
    { to: [170, -156] },
    { c1: [250, -156], c2: [300, -104], to: [312, -20] },
    { c1: [332, 90], c2: [344, 210], to: [292, 256] },
    { c1: [250, 296], c2: [190, 264], to: [160, 184] },
    { c1: [132, 122], c2: [80, 112], to: [0, 112] },
  ]);
  const bg = uid("cb");
  const stick = (x, y) => {
    const sg = uid("st");
    return `<defs>${radial(sg, [[0, shade(accent, 0.3)], [0.8, accent], [1, shade(accent, -0.4)]], { cx: 0.4, cy: 0.35 })}</defs><circle cx="${x}" cy="${y}" r="56" fill="${shade(color, -0.18)}"/><circle cx="${x}" cy="${y}" r="44" fill="url(#${sg})"/><circle cx="${x}" cy="${y}" r="30" fill="none" stroke="${shade(accent, 0.25)}" stroke-width="2" opacity="0.6"/>`;
  };
  return `<defs>${radial(bg, [[0, shade(color, 0.12)], [0.7, color], [1, shade(color, -0.22)]], { cx: 0.4, cy: 0.3, r: 0.8 })}</defs>
    <path d="M-250,-150 C-220,-176 -160,-180 -120,-166 L-110,-150 L-260,-140 Z M250,-150 C220,-176 160,-180 120,-166 L110,-150 L260,-140 Z" fill="${shade(accent, 0.1)}"/>
    <path d="${body}" fill="url(#${bg})"/>
    <path d="M-200,-86 h30 v-30 h28 v30 h30 v28 h-30 v30 h-28 v-30 h-30 Z" fill="${accent}" transform="translate(0 30)"/>
    ${[[200, -96], [244, -52], [200, -8], [156, -52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="21" fill="${accent}"/><circle cx="${x - 5}" cy="${y - 6}" r="7" fill="#fff" opacity="0.18"/>`).join("")}
    ${stick(-100, 80)}${stick(100, 80)}
    <rect x="-56" y="-70" width="34" height="16" rx="8" fill="${shade(color, -0.25)}"/><rect x="22" y="-70" width="34" height="16" rx="8" fill="${shade(color, -0.25)}"/>
    <circle cx="0" cy="-108" r="20" fill="${shade(color, -0.12)}"/><circle cx="0" cy="-108" r="12" fill="${accent}"/>`;
}

export function handheld({ color = "#2d3036", accent = "#4f8cff", wall = {} } = {}) {
  const bg = uid("hh");
  return `<defs>${linear(bg, [[0, shade(color, 0.16)], [1, shade(color, -0.2)]], { x1: 0, y1: 0, x2: 0, y2: 1 })}</defs>
    <path d="${roundedRect(-470, -200, 940, 400, 150)}" fill="url(#${bg})"/>
    <path d="${roundedRect(-300, -170, 600, 340, 22)}" fill="#07080a"/>
    ${screen(-286, -156, 572, 312, 12, wall)}
    ${[[-380, -60], [380, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="46" fill="${shade(color, -0.35)}"/><circle cx="${x}" cy="${y}" r="34" fill="${shade(color, 0.12)}"/>`).join("")}
    <path d="M-406,40 h20 v-20 h20 v20 h20 v20 h-20 v20 h-20 v-20 h-20 Z" fill="${shade(color, -0.4)}" transform="translate(14 22)"/>
    ${[[380, -110], [412, -78], [380, -46], [348, -78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${accent}"/>`).join("")}`;
}

export function tablet({ frame = "#bfc3c9", wall = {} } = {}) {
  const m = uid("tm");
  const pen = uid("pn");
  return `<defs>${metalGrad(m, frame)}${linear(pen, [[0, "#ffffff"], [0.5, "#eceef0"], [1, "#c4c8ce"]], { x1: 0, y1: 0, x2: 0, y2: 1 })}</defs>
    <path d="${roundedRect(-330, -450, 660, 900, 44)}" fill="url(#${m})"/>
    <path d="${roundedRect(-320, -440, 640, 880, 36)}" fill="#07080a"/>
    ${screen(-302, -422, 604, 844, 22, wall)}
    <g transform="translate(250 330) rotate(-38)"><rect x="-300" y="-13" width="560" height="26" rx="13" fill="url(#${pen})"/><path d="M260,-13 L310,0 L260,13 Z" fill="#d9dcdf"/><path d="M296,-4 L310,0 L296,4 Z" fill="#555"/></g>`;
}

export function keyboard({ color = "#e9e8e4", keys = "#f6f5f2", accent = "#4f8cff" } = {}) {
  const cg = uid("kc");
  let out = "";
  const rows = 5;
  const cols = 14;
  const kw = 70;
  const gap = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let w = kw;
      if (r === 4 && c === 5) w = kw * 5 + gap * 4;
      if (r === 4 && c > 5 && c < 10) continue;
      const x = -540 + c * (kw + gap);
      const y = -190 + r * (kw + gap);
      const isAccent = (r === 0 && c === 0) || (r === 2 && c === 13);
      const fill = isAccent ? accent : r === 4 && c !== 5 ? shade(keys, -0.12) : keys;
      out += `<path d="${roundedRect(x, y, w, kw, 12)}" fill="${shade(fill, -0.18)}"/><path d="${roundedRect(x + 5, y + 3, w - 10, kw - 14, 10)}" fill="${fill}"/>`;
    }
  }
  return `<defs>${linear(cg, [[0, shade(color, 0.08)], [1, shade(color, -0.12)]], { x1: 0, y1: 0, x2: 0, y2: 1 })}</defs>
    <path d="${roundedRect(-570, -220, 1110, 420, 34)}" fill="url(#${cg})"/>${out}`;
}

export function powerBank({ color = "#2f3238" } = {}) {
  const bg = uid("pb");
  return `<defs>${linear(bg, [[0, shade(color, 0.22)], [0.5, color], [1, shade(color, -0.25)]], { x1: 0, y1: 0, x2: 1, y2: 0 })}</defs>
    <path d="M140,200 C300,260 360,120 300,40 C240,-40 330,-160 420,-130" fill="none" stroke="${shade(color, -0.1)}" stroke-width="22" stroke-linecap="round"/>
    <path d="M140,200 C300,260 360,120 300,40 C240,-40 330,-160 420,-130" fill="none" stroke="${shade(color, 0.3)}" stroke-width="22" stroke-dasharray="4 10" opacity="0.5"/>
    <rect x="404" y="-152" width="60" height="40" rx="8" fill="${shade(color, 0.15)}" transform="rotate(-18 434 -132)"/>
    <path d="${roundedRect(-170, -290, 340, 580, 52)}" fill="url(#${bg})"/>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${-36 + i * 24}" cy="200" r="6" fill="${i < 3 ? "#5fd38a" : shade(color, 0.25)}"/>`).join("")}
    <rect x="-40" y="-276" width="80" height="12" rx="6" fill="${shade(color, -0.5)}"/>
    ${text("20 000 mAh", { y: -150, size: 22, fill: shade(color, 0.45), ls: 2, weight: 400 })}`;
}

export function robotVacuum({ color = "#f2f2f0", accent = "#2f3238" } = {}) {
  const sg = uid("rv");
  return `<defs>${linear(sg, [[0, shade(color, -0.05)], [0.5, shade(color, -0.2)], [1, shade(color, -0.35)]], { x1: 0, y1: 0, x2: 1, y2: 0 })}</defs>
    <path d="M-330,0 L-330,70 C-330,140 -180,180 0,180 C180,180 330,140 330,70 L330,0 Z" fill="url(#${sg})"/>
    <path d="M-330,60 C-330,130 -180,168 0,168 C180,168 330,130 330,60" fill="none" stroke="${accent}" stroke-width="6" opacity="0.5"/>
    <ellipse cx="0" cy="0" rx="330" ry="120" fill="${color}"/>
    <ellipse cx="0" cy="0" rx="312" ry="110" fill="${shade(color, 0.05)}" stroke="${shade(color, -0.12)}" stroke-width="2"/>
    <path d="M-80,-60 L80,-60 L80,-20 C80,0 40,10 0,10 C-40,10 -80,0 -80,-20 Z" fill="${shade(accent, 0.1)}"/>
    <ellipse cx="0" cy="-60" rx="80" ry="28" fill="${accent}"/>
    <ellipse cx="0" cy="-62" rx="56" ry="18" fill="${shade(accent, 0.18)}"/>
    <ellipse cx="0" cy="60" rx="34" ry="12" fill="${shade(color, -0.15)}"/><circle cx="0" cy="58" r="4" fill="#5fd38a"/>`;
}
