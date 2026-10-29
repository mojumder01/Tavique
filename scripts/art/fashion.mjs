// Fashion & Lifestyle objects. Hanging garments use the hanger hook (0,0) as origin;
// floor objects (shoes, bags, hats) use their bottom-centre as origin.
import { linear, radial, cylinder, symPath, roundedRect, volume, fold, uid, shade, mix, rng, text, blurFilter, contactShadow } from "./lib.mjs";

export function hanger(wood = "#b38b62") {
  const g = uid("wood");
  return `<defs>${linear(g, [[0, shade(wood, 0.18)], [0.5, wood], [1, shade(wood, -0.25)]], { x1: 0, y1: 0, x2: 0, y2: 1 })}</defs>
    <path d="M0,40 L0,22 C0,8 -16,2 -20,14" fill="none" stroke="#8e8e8e" stroke-width="6" stroke-linecap="round"/>
    <path d="M-186,104 C-120,74 -48,58 0,56 C48,58 120,74 186,104" fill="none" stroke="url(#${g})" stroke-width="20" stroke-linecap="round"/>
    <rect x="-7" y="38" width="14" height="22" rx="4" fill="#9c9c9c"/>`;
}

const buttons = (pts, color, r = 9) =>
  pts
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${shade(color, -0.25)}"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.25}" r="${r * 0.55}" fill="${shade(color, 0.12)}" opacity="0.7"/>`)
    .join("");
const stitch = (d, color, op = 0.45) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="7 6" opacity="${op}"/>`;
const mirrorD = (d) => d.replace(/(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/g, (_, x, __, y) => `${-parseFloat(x)},${y}`);
const both = (d, fn) => fn(d) + fn(mirrorD(d));

/* ---------------- outerwear ---------------- */
export function coat({ color = "#b8946a", lining = null, length = 915 } = {}) {
  const k = length / 915;
  const y = (v) => 70 + (v - 70) * k;
  const body = symPath([0, 76], [
    { to: [44, 70] },
    { c1: [84, 76], c2: [128, 88], to: [163, 104] },
    { c1: [182, 150], c2: [192, 250], to: [198, 340] },
    { c1: [204, 430], c2: [207, 510], to: [210, 585] },
    { to: [150, 594] },
    { to: [153, 600] },
    { c1: [160, y(700)], c2: [166, y(820)], to: [172, y(905)] },
    { c1: [110, y(913)], c2: [50, y(915)], to: [0, y(915)] },
  ]);
  const vNeck = `M-44,66 C-30,170 -18,280 -6,372 L6,372 C18,280 30,170 44,66 Q0,86 -44,66 Z`;
  const lapel = `M44,66 L84,94 L98,150 L86,158 L116,186 C94,252 48,322 6,372 C18,280 30,170 44,66 Z`;
  const inside = lining ?? shade(color, -0.42);
  return `<path d="${body}" fill="${color}"/>
    ${volume(body)}
    ${fold("M120,380 C125,520 135,700 140," + y(890), { clip: body })}
    ${fold("M-120,380 C-125,520 -135,700 -140," + y(890), { clip: body })}
    ${fold("M58,500 C64,640 70,780 82," + y(900), { clip: body, opacity: 0.09 })}
    ${fold("M-58,500 C-64,640 -70,780 -82," + y(900), { clip: body, opacity: 0.09 })}
    ${both("M128,232 C138,350 146,470 150,594", (d) => fold(d, { clip: body, opacity: 0.32, width: 12, blur: 6 }) + `<path d="${d}" fill="none" stroke="${shade(color, -0.3)}" stroke-width="2" opacity="0.6"/>`)}
    <path d="${vNeck}" fill="${inside}"/>
    ${both(lapel, (d) => `<path d="${d}" fill="${shade(color, 0.04)}"/>${fold(d, { opacity: 0.18, width: 8, blur: 4 })}<path d="${d}" fill="none" stroke="${shade(color, -0.28)}" stroke-width="2.2" opacity="0.7"/>`)}
    <path d="M6,372 L6,${y(912)}" stroke="${shade(color, -0.35)}" stroke-width="2.5"/>
    ${fold(`M0,380 L0,${y(905)}`, { opacity: 0.22, width: 8, blur: 4, clip: body })}
    ${buttons([[22, 420], [22, 540], [22, 660]].map(([a, b]) => [a, y(b)]), color, 10)}
    ${both(`M58,${y(640)} L148,${y(634)} L149,${y(662)} L59,${y(668)} Z`, (d) => `<path d="${d}" fill="${shade(color, 0.03)}"/><path d="${d}" fill="none" stroke="${shade(color, -0.3)}" stroke-width="2" opacity="0.7"/>`)}
    <path d="M-172,${y(903)} C-110,${y(911)} 110,${y(911)} 172,${y(903)}" stroke="${shade(color, -0.3)}" stroke-width="3" fill="none" opacity="0.5"/>`;
}

export function trench({ color = "#c9b391" } = {}) {
  const body = symPath([0, 76], [
    { to: [46, 70] },
    { c1: [86, 76], c2: [130, 88], to: [166, 104] },
    { c1: [186, 150], c2: [196, 250], to: [202, 340] },
    { c1: [208, 430], c2: [211, 510], to: [214, 585] },
    { to: [152, 594] },
    { to: [155, 600] },
    { c1: [170, 700], c2: [186, 820], to: [204, 920] },
    { c1: [130, 930], c2: [60, 932], to: [0, 932] },
  ]);
  const dark = shade(color, -0.3);
  const collar = `M46,64 L96,90 L118,168 L92,176 L120,206 C98,262 52,320 10,360 C22,270 34,160 46,64 Z`;
  const flap = `M46,70 L166,104 C176,150 178,200 176,250 L70,240 C60,190 54,130 46,70 Z`;
  return `<path d="${body}" fill="${color}"/>
    ${volume(body)}
    ${both(flap, (d) => `<path d="${d}" fill="${shade(color, 0.03)}"/>${fold(d.replace(/ Z$/, ""), { opacity: 0.16, width: 6, blur: 3 })}`)}
    ${both("M130,232 C140,350 148,470 152,594", (d) => fold(d, { clip: body, opacity: 0.3, width: 12, blur: 6 }) + `<path d="${d}" fill="none" stroke="${dark}" stroke-width="2" opacity="0.5"/>`)}
    ${both("M118,560 C130,700 150,820 168,920", (d) => fold(d, { clip: body, opacity: 0.12 }))}
    <path d="M-46,64 C-34,160 -22,270 -10,360 L10,360 C22,270 34,160 46,64 Q0,84 -46,64 Z" fill="${shade(color, -0.45)}"/>
    ${both(collar, (d) => `<path d="${d}" fill="${shade(color, 0.05)}"/><path d="${d}" fill="none" stroke="${dark}" stroke-width="2.2" opacity="0.7"/>`)}
    <path d="M60,360 L60,930" stroke="${dark}" stroke-width="2.5" opacity="0.8"/>
    ${fold("M56,360 L56,930", { clip: body, opacity: 0.25, width: 8, blur: 4 })}
    ${buttons([[-40, 390], [40, 390], [-40, 560], [40, 560], [-40, 650], [40, 650]], color, 10)}
    <path d="M-196,460 C-100,470 100,470 196,460 L198,500 C100,510 -100,510 -198,500 Z" fill="${shade(color, 0.02)}"/>
    ${fold("M-196,500 C-100,510 100,510 196,500", { opacity: 0.3, width: 8, blur: 4 })}
    <rect x="96" y="458" width="46" height="46" rx="6" fill="none" stroke="${shade(color, -0.5)}" stroke-width="5"/>
    <path d="M118,481 L176,481" stroke="${shade(color, -0.5)}" stroke-width="4"/>
    ${both("M70,78 L150,100 L146,118 L68,96 Z", (d) => `<path d="${d}" fill="${shade(color, 0.06)}" stroke="${dark}" stroke-width="1.5" opacity="0.9"/>`)}
    ${both("M156,520 L212,516 L213,540 L156,546 Z", (d) => `<path d="${d}" fill="${shade(color, 0.04)}" stroke="${dark}" stroke-width="1.5"/>`)}
    ${stitch("M-198,468 C-100,478 100,478 198,468", dark)}
    ${stitch("M-198,492 C-100,502 100,502 198,492", dark)}`;
}

export function overshirt({ color = "#e6dccb", length = 600 } = {}) {
  const body = symPath([0, 66], [
    { to: [40, 62] },
    { c1: [84, 68], c2: [132, 84], to: [170, 104] },
    { c1: [188, 150], c2: [198, 240], to: [202, 320] },
    { c1: [206, 400], c2: [208, 480], to: [212, 560] },
    { to: [154, 568] },
    { to: [156, 572] },
    { c1: [158, 590], c2: [160, length - 10], to: [162, length] },
    { c1: [110, length + 4], c2: [50, length + 6], to: [0, length + 6] },
  ]);
  const dark = shade(color, -0.25);
  const collar = `M10,58 L46,56 L104,86 L84,152 L30,96 Z`;
  return `<path d="${body}" fill="${color}"/>
    ${volume(body, { side: 0.18 })}
    ${both("M128,230 C138,330 146,450 154,568", (d) => fold(d, { clip: body, opacity: 0.26, width: 12, blur: 6 }) + `<path d="${d}" fill="none" stroke="${dark}" stroke-width="1.6" opacity="0.6"/>`)}
    ${both("M92,300 C98,420 104,500 110," + length, (d) => fold(d, { clip: body, opacity: 0.1 }))}
    <path d="M-30,60 Q0,74 30,60 L18,96 Q0,104 -18,96 Z" fill="${shade(color, -0.35)}"/>
    ${both(collar, (d) => `<path d="${d}" fill="${shade(color, 0.05)}"/>${fold(d, { opacity: 0.15, width: 6, blur: 3 })}<path d="${d}" fill="none" stroke="${dark}" stroke-width="1.8" opacity="0.8"/>`)}
    <rect x="-16" y="98" width="32" height="${length - 92}" fill="${shade(color, 0.04)}"/>
    <path d="M16,98 L16,${length + 4}" stroke="${dark}" stroke-width="1.8" opacity="0.8"/>
    ${fold(`M18,100 L18,${length}`, { opacity: 0.16, width: 6, blur: 3, clip: body })}
    ${buttons([150, 230, 310, 390, 470].map((b) => [0, b]), shade(color, -0.05), 8)}
    ${both("M52,196 L128,192 L128,268 L54,272 Z", (d) => `<path d="${d}" fill="${shade(color, 0.02)}" stroke="${dark}" stroke-width="1.6"/>`)}
    ${both("M48,186 L132,180 L132,214 L50,220 Z", (d) => `<path d="${d}" fill="${shade(color, 0.06)}" stroke="${dark}" stroke-width="1.6"/>${fold("M50,222 L132,216", { opacity: 0.2, width: 5, blur: 3 })}`)}
    ${buttons([[91, 204], [-91, 204]], shade(color, -0.05), 6)}
    ${both("M156,528 L212,524", (d) => `<path d="${d}" stroke="${dark}" stroke-width="2" opacity="0.6"/>`)}`;
}

export function shirt({ color = "#f1eee8", stripe = null } = {}) {
  const body = symPath([0, 64], [
    { to: [36, 60] },
    { c1: [80, 66], c2: [128, 82], to: [160, 100] },
    { c1: [176, 140], c2: [184, 220], to: [188, 300] },
    { c1: [192, 380], c2: [194, 460], to: [196, 540] },
    { to: [148, 548] },
    { to: [148, 552] },
    { c1: [150, 580], c2: [152, 600], to: [154, 612] },
    { c1: [120, 640], c2: [60, 664], to: [0, 668] },
  ]);
  const dark = shade(color, -0.22);
  const rand = rng(11);
  let slub = "";
  for (let i = 0; i < 70; i++) {
    const yy = 70 + rand() * 600;
    const xx = -190 + rand() * 360;
    slub += `<path d="M${xx},${yy} h${20 + rand() * 50}" stroke="${shade(color, rand() > 0.5 ? -0.12 : 0.2)}" stroke-width="1.4" opacity="0.5"/>`;
  }
  const clip = uid("sc");
  let stripes = "";
  if (stripe) for (let x = -220; x < 220; x += 18) stripes += `<rect x="${x}" y="40" width="5" height="680" fill="${stripe}" opacity="0.5"/>`;
  return `<path d="${body}" fill="${color}"/>
    <defs><clipPath id="${clip}"><path d="${body}"/></clipPath></defs><g clip-path="url(#${clip})">${slub}${stripes}</g>
    ${volume(body, { side: 0.16 })}
    ${both("M122,226 C132,320 140,440 148,548", (d) => fold(d, { clip: body, opacity: 0.22, width: 12, blur: 6 }) + `<path d="${d}" fill="none" stroke="${dark}" stroke-width="1.4" opacity="0.6"/>`)}
    ${both("M70,260 C76,380 80,500 86,640", (d) => fold(d, { clip: body, opacity: 0.08 }))}
    ${both("M150,500 L196,496 L197,540 L150,546 Z", (d) => `<path d="${d}" fill="${shade(color, 0.03)}" stroke="${dark}" stroke-width="1.4"/>`)}
    <path d="M-26,58 Q0,70 26,58 L14,92 Q0,98 -14,92 Z" fill="${shade(color, -0.3)}"/>
    ${both("M8,56 L40,54 L92,82 L70,140 L24,92 Z", (d) => `<path d="${d}" fill="${shade(color, 0.04)}"/>${fold(d, { opacity: 0.12, width: 5, blur: 3 })}<path d="${d}" fill="none" stroke="${dark}" stroke-width="1.5" opacity="0.8"/>`)}
    <path d="M12,94 L12,664" stroke="${dark}" stroke-width="1.4" opacity="0.8"/>
    <path d="M-12,94 L-12,664" stroke="${dark}" stroke-width="1" opacity="0.35"/>
    ${[140, 220, 300, 380, 460, 540].map((b) => `<circle cx="0" cy="${b}" r="5.5" fill="${shade(color, -0.12)}"/><circle cx="-1" cy="${b - 1}" r="3" fill="${shade(color, 0.3)}"/>`).join("")}
    <path d="M-120,180 L-62,178 L-60,250 Q-90,262 -120,250 Z" fill="none" stroke="${dark}" stroke-width="1.4" opacity="0.8"/>`;
}

export function knit({ color = "#e7dfd1" } = {}) {
  const body = symPath([0, 92], [
    { c1: [30, 92], c2: [50, 80], to: [58, 66] },
    { c1: [100, 74], c2: [160, 90], to: [196, 124] },
    { c1: [214, 200], c2: [222, 300], to: [226, 400] },
    { c1: [228, 460], c2: [230, 510], to: [228, 556] },
    { to: [176, 562] },
    { c1: [176, 540], c2: [172, 520], to: [170, 510] },
    { c1: [172, 530], c2: [174, 550], to: [176, 580] },
    { c1: [120, 586], c2: [60, 588], to: [0, 588] },
  ]);
  const dark = shade(color, -0.22);
  const p = uid("rib");
  const clip = uid("kc");
  return `<defs><pattern id="${p}" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="${color}"/><path d="M3,0 V12 M9,0 V12" stroke="${shade(color, -0.07)}" stroke-width="3"/><path d="M6,0 V12" stroke="${shade(color, 0.08)}" stroke-width="2"/></pattern><clipPath id="${clip}"><path d="${body}"/></clipPath></defs>
    <path d="${body}" fill="url(#${p})"/>
    <g clip-path="url(#${clip})">
      <rect x="-240" y="540" width="480" height="60" fill="${shade(color, -0.04)}"/>
      ${Array.from({ length: 40 }, (_, i) => `<path d="M${-234 + i * 12},540 V600" stroke="${shade(color, -0.14)}" stroke-width="3"/>`).join("")}
    </g>
    ${both("M176,512 L228,508 L230,556 L176,562 Z", (d) => `<path d="${d}" fill="${shade(color, -0.05)}"/>`)}
    ${both("M182,516 V560 M194,514 V558 M206,512 V558 M218,511 V557", (d) => `<path d="${d}" stroke="${shade(color, -0.16)}" stroke-width="2.5"/>`)}
    ${volume(body, { side: 0.2 })}
    ${both("M150,200 C160,320 166,420 172,520", (d) => fold(d, { clip: body, opacity: 0.32, width: 16, blur: 8 }))}
    ${both("M80,200 C86,320 90,440 96,560", (d) => fold(d, { clip: body, opacity: 0.08, width: 18, blur: 9 }))}
    <path d="M-58,66 C-50,80 -30,92 0,92 C30,92 50,80 58,66 C40,58 20,56 0,56 C-20,56 -40,58 -58,66 Z" fill="${shade(color, -0.4)}"/>
    <path d="M-62,64 C-52,86 -30,100 0,100 C30,100 52,86 62,64" fill="none" stroke="${shade(color, -0.06)}" stroke-width="16"/>
    ${Array.from({ length: 22 }, (_, i) => {
      const t = i / 21;
      const a = Math.PI * (1 - t);
      const x = Math.cos(a) * 60;
      const yy = 82 + Math.sin(a) * 16;
      return `<path d="M${x},${yy - 7} L${x * 1.04},${yy + 7}" stroke="${shade(color, -0.18)}" stroke-width="2"/>`;
    }).join("")}
    <path d="M-170,512 C-90,520 90,520 170,512" stroke="${dark}" stroke-width="2" fill="none" opacity="0.35"/>`;
}

export function slipDress({ color = "#d8c2a2" } = {}) {
  const body = symPath([0, 262], [
    { to: [70, 186] },
    { to: [98, 194] },
    { c1: [102, 252], c2: [94, 300], to: [88, 340] },
    { c1: [120, 500], c2: [182, 720], to: [228, 905] },
    { c1: [150, 925], c2: [70, 930], to: [0, 930] },
  ]);
  const clip = uid("dc");
  const sheen = [
    ["M40,360 C60,520 70,700 80,920", 0.22, "#fff"],
    ["M-30,360 C-50,540 -70,720 -90,925", 0.18, "#fff"],
    ["M120,560 C140,700 160,820 176,915", 0.14, "#fff"],
    ["M10,360 C16,560 20,740 22,925", 0.16, "#000"],
    ["M80,420 C100,600 120,760 132,918", 0.14, "#000"],
    ["M-80,420 C-110,600 -136,760 -150,918", 0.18, "#000"],
  ];
  return `<path d="M-70,188 L-118,98 M70,188 L118,98" stroke="${shade(color, -0.2)}" stroke-width="5" stroke-linecap="round"/>
    <path d="${body}" fill="${color}"/>
    <defs><clipPath id="${clip}"><path d="${body}"/></clipPath></defs>
    ${volume(body, { side: 0.26 })}
    <g clip-path="url(#${clip})">${sheen.map(([d, o, c]) => fold(d, { color: c, opacity: o, width: 18, blur: 10 })).join("")}</g>
    <path d="M-98,194 L-70,186 L0,262 L70,186 L98,194" fill="none" stroke="${shade(color, -0.25)}" stroke-width="3"/>
    <path d="M-88,340 C-40,348 40,348 88,340" fill="none" stroke="${shade(color, -0.18)}" stroke-width="2" opacity="0.6"/>`;
}

export function trousers({ color = "#8b7a66" } = {}) {
  const legs = symPath([0, 118], [
    { to: [132, 118] },
    { c1: [136, 350], c2: [130, 600], to: [120, 910] },
    { to: [16, 910] },
    { c1: [14, 700], c2: [10, 500], to: [0, 360] },
  ]);
  const dark = shade(color, -0.3);
  return `<path d="M-160,40 L160,40" stroke="#9a9a9a" stroke-width="10" stroke-linecap="round"/>
    <path d="M0,40 L0,18 C0,4 -16,-2 -20,10" fill="none" stroke="#8e8e8e" stroke-width="6" stroke-linecap="round"/>
    <path d="${legs}" fill="${color}"/>
    ${volume(legs, { side: 0.2 })}
    ${both("M68,120 L68,905", (d) => fold(d, { clip: legs, color: "#fff", opacity: 0.12, width: 10, blur: 4 }) + fold(d.replace("68,", "74,").replace("L68", "L74"), { clip: legs, opacity: 0.18, width: 8, blur: 4 }))}
    ${both("M16,380 C14,600 15,760 16,905", (d) => fold(d, { clip: legs, opacity: 0.26, width: 10, blur: 5 }))}
    <rect x="-134" y="78" width="268" height="42" fill="${shade(color, 0.02)}"/>
    ${fold("M-134,122 L134,122", { opacity: 0.3, width: 6, blur: 3 })}
    ${[-110, -50, 50, 110].map((x) => `<rect x="${x - 7}" y="76" width="14" height="48" rx="3" fill="${shade(color, 0.05)}" stroke="${dark}" stroke-width="1.2"/>`).join("")}
    <circle cx="0" cy="98" r="7" fill="${shade(color, -0.35)}"/>
    <path d="M0,120 C16,200 16,280 4,340" fill="none" stroke="${dark}" stroke-width="2"/>
    ${both("M44,122 L46,210 M56,122 L60,190", (d) => `<path d="${d}" stroke="${dark}" stroke-width="1.6" opacity="0.7"/>`)}
    ${both("M100,124 L124,232", (d) => `<path d="${d}" stroke="${dark}" stroke-width="2" opacity="0.8"/>`)}
    <rect x="-154" y="58" width="22" height="40" rx="4" fill="#a2a2a2"/><rect x="132" y="58" width="22" height="40" rx="4" fill="#a2a2a2"/>`;
}

/* ---------------- footwear ---------------- */
export function sneaker({ upper = "#f3f1ec", sole = "#ece7dc", accent = "#c9b79b" } = {}) {
  const solePath = `M-258,-6 C-262,-30 -258,-48 -250,-54 L200,-54 C240,-54 266,-46 272,-32 C276,-16 268,-2 250,0 L-240,0 C-250,0 -256,-2 -258,-6 Z`;
  const up = `M-250,-54 C-258,-110 -254,-160 -236,-196 C-214,-206 -190,-200 -170,-184 C-146,-166 -110,-168 -86,-186 C-70,-210 -44,-220 -28,-208 L70,-142 C130,-120 190,-98 236,-82 C262,-74 272,-62 270,-54 Z`;
  const dark = shade(upper, -0.28);
  let laces = "";
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const x = -36 + t * 100;
    const y = -196 + t * 62;
    laces += `<path d="M${x + 9},${y - 13} L${x - 7},${y + 11}" stroke="${shade(upper, -0.2)}" stroke-width="7" stroke-linecap="round"/><circle cx="${x - 12}" cy="${y + 16}" r="3.6" fill="${dark}"/>`;
  }
  return `<path d="${up}" fill="${upper}"/>${volume(up, { side: 0.12, top: 0.1, bottom: 0.16 })}
    <path d="M-28,-208 C-10,-196 30,-170 70,-142 C40,-150 0,-170 -40,-196 Z" fill="${shade(upper, -0.06)}"/>
    <path d="M-236,-196 C-214,-206 -190,-200 -170,-184 C-158,-160 -168,-110 -196,-66 L-250,-62 C-258,-110 -254,-160 -236,-196 Z" fill="${accent}" opacity="0.9"/>
    <path d="M-246,-150 C-250,-182 -240,-198 -224,-200 L-218,-160 Z" fill="${shade(accent, -0.18)}"/>
    <path d="M60,-136 C120,-112 190,-96 236,-80 C252,-74 262,-66 266,-58 C200,-66 120,-72 50,-74 Z" fill="${shade(upper, -0.04)}"/>
    ${stitch("M-238,-64 C-100,-66 100,-66 258,-60", dark, 0.45)}
    ${stitch("M50,-78 C120,-78 200,-70 258,-60", dark, 0.35)}
    ${laces}
    <path d="${solePath}" fill="${sole}"/>
    ${volume(solePath, { side: 0.08, top: 0.2, bottom: 0.12 })}
    <path d="M-256,-22 C-100,-20 100,-20 270,-24" stroke="${shade(sole, -0.14)}" stroke-width="2.5" fill="none"/>`;
}

export function chelseaBoot({ color = "#5b3f2c" } = {}) {
  const sole = `M-252,0 L-150,0 L-146,-20 L230,-20 C252,-20 264,-26 264,-34 L264,-44 L-252,-50 Z`;
  const up = `M-252,-50 L-248,-360 C-246,-372 -238,-378 -226,-378 L-92,-378 C-84,-378 -80,-372 -80,-362 C-78,-280 -60,-200 -20,-150 C40,-110 140,-92 220,-74 C256,-66 266,-52 262,-42 Z`;
  return `<path d="${up}" fill="${color}"/>${volume(up, { side: 0.22, top: 0.1, bottom: 0.2 })}
    ${fold("M120,-96 C170,-90 210,-80 244,-66", { color: "#fff", opacity: 0.22, width: 10, blur: 6 })}
    ${fold("M-230,-340 C-232,-240 -232,-150 -234,-70", { color: "#fff", opacity: 0.12, width: 14, blur: 8 })}
    <path d="M-206,-378 L-122,-378 L-146,-226 C-154,-212 -168,-212 -176,-226 Z" fill="${shade(color, -0.4)}"/>
    ${Array.from({ length: 7 }, (_, i) => `<path d="M${-200 + i * 12},-376 L${-176 + i * 4},-232" stroke="${shade(color, -0.2)}" stroke-width="2"/>`).join("")}
    <path d="M-248,-372 C-262,-404 -250,-424 -230,-414 L-224,-378" fill="none" stroke="${shade(color, -0.25)}" stroke-width="10"/>
    ${stitch("M-246,-62 C-60,-62 120,-60 256,-50", shade(color, 0.3), 0.5)}
    <path d="${sole}" fill="#2a221d"/>
    <path d="M-252,-36 L262,-36" stroke="#4a3b31" stroke-width="2"/>`;
}

export function loafer({ color = "#3e2a20" } = {}) {
  const sole = `M-254,0 L-160,0 L-156,-16 L238,-16 C254,-16 264,-22 264,-28 L264,-36 L-254,-40 Z`;
  const up = `M-252,-36 C-258,-80 -250,-118 -236,-132 C-200,-120 -140,-110 -90,-114 C-40,-118 10,-136 40,-150 C110,-150 180,-110 236,-72 C260,-60 266,-46 262,-36 Z`;
  return `<path d="${up}" fill="${color}"/>${volume(up, { side: 0.2, top: 0.12, bottom: 0.22 })}
    <path d="M-236,-132 C-200,-120 -140,-110 -90,-114 C-40,-118 10,-136 40,-150 L36,-140 C6,-126 -40,-108 -92,-104 C-140,-100 -200,-110 -236,-122 Z" fill="${shade(color, -0.45)}"/>
    ${fold("M70,-140 C130,-128 190,-100 236,-70", { color: "#fff", opacity: 0.3, width: 10, blur: 5 })}
    <path d="M14,-150 C60,-152 120,-130 150,-112 L146,-96 C110,-116 60,-134 12,-134 Z" fill="${shade(color, 0.05)}" stroke="${shade(color, -0.4)}" stroke-width="2"/>
    <rect x="66" y="-140" width="40" height="9" rx="4.5" transform="rotate(16 86 -136)" fill="${shade(color, -0.55)}"/>
    ${stitch("M40,-150 C100,-148 160,-120 214,-84", shade(color, 0.35), 0.55)}
    <path d="${sole}" fill="${shade(color, -0.35)}"/>`;
}

/* ---------------- bags ---------------- */
export function tote({ color = "#9a6a43" } = {}) {
  const body = symPath([0, -430], [{ to: [205, -430] }, { to: [238, -36] }, { c1: [241, -12], c2: [232, 0], to: [210, 0] }, { to: [0, 0] }]);
  const h1 = uid("hd");
  const dark = shade(color, -0.3);
  return `<defs>${linear(h1, [[0, shade(color, 0.12)], [1, shade(color, -0.2)]], { x1: 0, y1: 0, x2: 1, y2: 1 })}</defs>
    <path d="M-110,-428 C-110,-580 110,-580 110,-428" fill="none" stroke="${shade(color, -0.35)}" stroke-width="22"/>
    <path d="${body}" fill="${color}"/>${volume(body, { side: 0.22, top: 0.12, bottom: 0.18 })}
    <path d="M180,-430 L205,-430 L238,-36 C240,-20 236,-8 226,-4 Z" fill="${shade(color, -0.2)}"/>
    <path d="M-205,-430 L205,-430 L207,-400 L-207,-400 Z" fill="${shade(color, 0.06)}"/>
    ${stitch("M-200,-412 L200,-412", shade(color, 0.4), 0.6)}
    ${stitch("M-196,-392 L-226,-30", shade(color, 0.4), 0.4)}
    <path d="M-128,-424 C-128,-610 128,-610 128,-424" fill="none" stroke="url(#${h1})" stroke-width="26" stroke-linecap="round"/>
    ${fold("M-118,-440 C-114,-590 114,-590 118,-440", { color: "#fff", opacity: 0.2, width: 6, blur: 3 })}
    ${[-128, 128].map((x) => `<rect x="${x - 22}" y="-430" width="44" height="66" rx="6" fill="${shade(color, -0.06)}" stroke="${dark}" stroke-width="2"/><circle cx="${x}" cy="-390" r="6" fill="#c7a76a"/>`).join("")}`;
}

export function crossbody({ color = "#d7c7b0", hardware = "#c9a45c" } = {}) {
  const body = roundedRect(-180, -250, 360, 250, 44);
  const flap = `M-180,-206 C-180,-240 -160,-250 -130,-250 L130,-250 C160,-250 180,-240 180,-206 L180,-120 C120,-66 -120,-66 -180,-120 Z`;
  const metal = uid("mt");
  return `<defs>${linear(metal, [[0, shade(hardware, 0.35)], [0.5, hardware], [1, shade(hardware, -0.3)]], { x1: 0, y1: 0, x2: 1, y2: 1 })}</defs>
    <path d="M-160,-236 C-210,-560 210,-560 160,-236" fill="none" stroke="${shade(color, -0.12)}" stroke-width="16"/>
    <path d="${body}" fill="${color}"/>${volume(body, { side: 0.18, top: 0.1, bottom: 0.2 })}
    ${fold("M-176,-118 C-120,-64 120,-64 176,-118", { opacity: 0.35, width: 12, blur: 7 })}
    <path d="${flap}" fill="${shade(color, 0.04)}"/>${volume(flap, { side: 0.14, top: 0.14, bottom: 0.06 })}
    ${stitch("M-166,-200 C-166,-230 -150,-236 -126,-236 L126,-236 C150,-236 166,-230 166,-200 L166,-128 C110,-82 -110,-82 -166,-128 Z", shade(color, -0.3), 0.5)}
    <rect x="-28" y="-112" width="56" height="34" rx="9" fill="url(#${metal})"/>
    <rect x="-16" y="-102" width="32" height="14" rx="5" fill="${shade(hardware, -0.4)}" opacity="0.5"/>
    ${[-160, 160].map((x) => `<rect x="${x - 10}" y="-252" width="20" height="26" rx="4" fill="url(#${metal})"/>`).join("")}`;
}

/* ---------------- accessories ---------------- */
export function sunglasses({ frame = "#3a2a20", tortoise = true, lens = "#2b2420" } = {}) {
  const pat = uid("tt");
  const rand = rng(21);
  let spots = "";
  for (let i = 0; i < 26; i++) spots += `<ellipse cx="${rand() * 60}" cy="${rand() * 60}" rx="${3 + rand() * 9}" ry="${2 + rand() * 6}" fill="${mix(frame, "#b0743a", 0.35 + rand() * 0.4)}" opacity="${0.5 + rand() * 0.5}"/>`;
  const paint = tortoise ? `url(#${pat})` : frame;
  const lg = uid("ln");
  const shine = uid("sh");
  const lensL = roundedRect(-238, -72, 196, 144, 62);
  const lensR = roundedRect(42, -72, 196, 144, 62);
  return `<defs><pattern id="${pat}" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="${frame}"/>${spots}</pattern>
      ${linear(lg, [[0, lens, 0.96], [1, shade(lens, 0.3), 0.86]], { x1: 0, y1: 0, x2: 0, y2: 1 })}
      ${linear(shine, [[0, "#fff", 0], [0.45, "#fff", 0.28], [0.55, "#fff", 0.05], [1, "#fff", 0]], { x1: 0, y1: 0, x2: 1, y2: 1 })}</defs>
    <path d="M-246,-56 L-292,-46 M246,-56 L292,-46" stroke="${frame}" stroke-width="12" stroke-linecap="round"/>
    <path d="${lensL}" fill="url(#${lg})"/><path d="${lensR}" fill="url(#${lg})"/>
    <path d="${lensL}" fill="url(#${shine})"/><path d="${lensR}" fill="url(#${shine})"/>
    <path d="${lensL}" fill="none" stroke="${paint}" stroke-width="20"/><path d="${lensR}" fill="none" stroke="${paint}" stroke-width="20"/>
    <path d="M-44,-42 C-26,-66 26,-66 44,-42" fill="none" stroke="${paint}" stroke-width="18"/>
    <path d="M-230,-76 C-160,-86 -90,-84 -46,-72" fill="none" stroke="#fff" stroke-width="3" opacity="0.25"/>
    <path d="M46,-72 C90,-84 160,-86 230,-76" fill="none" stroke="#fff" stroke-width="3" opacity="0.25"/>`;
}

export function watch({ caseColor = "#c9c6c0", dial = "#f4efe6", strap = "#6b4a33", index = "#2b2622" } = {}) {
  const metal = uid("mt");
  const dg = uid("dl");
  const sg = uid("st");
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const big = i % 3 === 0;
    const r1 = big ? 78 : 86;
    ticks += `<path d="M${Math.sin(a) * r1},${-Math.cos(a) * r1} L${Math.sin(a) * 98},${-Math.cos(a) * 98}" stroke="${index}" stroke-width="${big ? 5 : 3}" stroke-linecap="round"/>`;
  }
  const hand = (deg, len, w) => `<path d="M0,10 L0,${-len}" stroke="${index}" stroke-width="${w}" stroke-linecap="round" transform="rotate(${deg})"/>`;
  return `<defs>${linear(metal, [[0, shade(caseColor, 0.4)], [0.45, caseColor], [0.55, shade(caseColor, -0.15)], [1, shade(caseColor, 0.25)]], { x1: 0, y1: 0, x2: 1, y2: 1 })}
      ${radial(dg, [[0, shade(dial, 0.08)], [1, shade(dial, -0.08)]], { cx: 0.4, cy: 0.35, r: 0.7 })}
      ${cylinder(sg, strap, { lo: -0.3, hi: 0.15 })}</defs>
    <path d="M-56,-100 L-52,-440 Q0,-450 52,-440 L56,-100 Z" fill="url(#${sg})"/>
    <path d="M-56,100 L-52,470 Q0,482 52,470 L56,100 Z" fill="url(#${sg})"/>
    ${stitch("M-44,-120 L-41,-430", shade(strap, 0.35), 0.55)}${stitch("M44,-120 L41,-430", shade(strap, 0.35), 0.55)}
    ${stitch("M-44,120 L-41,460", shade(strap, 0.35), 0.55)}${stitch("M44,120 L41,460", shade(strap, 0.35), 0.55)}
    ${[300, 340, 380, 420].map((y) => `<circle cx="0" cy="${y}" r="6" fill="${shade(strap, -0.5)}"/>`).join("")}
    <rect x="-60" y="-432" width="120" height="34" rx="8" fill="none" stroke="url(#${metal})" stroke-width="7"/>
    ${[-1, 1].map((s) => `<rect x="${s > 0 ? 44 : -70}" y="-136" width="26" height="40" rx="6" fill="url(#${metal})"/><rect x="${s > 0 ? 44 : -70}" y="96" width="26" height="40" rx="6" fill="url(#${metal})"/>`).join("")}
    <rect x="124" y="-14" width="24" height="28" rx="5" fill="url(#${metal})"/>
    <circle r="130" fill="url(#${metal})"/>
    <circle r="116" fill="${shade(caseColor, -0.2)}"/>
    <circle r="110" fill="url(#${dg})"/>
    ${ticks}
    ${text("TAVIQUE", { y: -36, size: 13, fill: index, ls: 3, weight: 500 })}
    ${hand(-60, 56, 8)}${hand(60, 88, 6)}${`<path d="M0,22 L0,-96" stroke="#b5835a" stroke-width="2" transform="rotate(150)"/>`}
    <circle r="8" fill="${index}"/><circle r="3" fill="${caseColor}"/>
    <path d="M-80,-70 A110,110 0 0 1 40,-104" fill="none" stroke="#fff" stroke-width="10" opacity="0.18"/>`;
}

export function scarf({ color = "#b9a68c", check = "#8f7b63" } = {}) {
  const front = `M-118,0 L118,0 C128,200 124,420 118,600 L-118,612 C-124,420 -128,200 -118,0 Z`;
  const back = `M-40,0 L150,0 C158,180 160,380 156,540 L-36,548 C-40,380 -42,180 -40,0 Z`;
  const p = uid("ck");
  const clip = uid("sc");
  const wood = uid("wd");
  let fringe = "";
  for (let x = -114; x <= 114; x += 7) fringe += `<path d="M${x},${604 - (x + 114) * 0.05} q3,30 -1,56" stroke="${shade(color, -0.05)}" stroke-width="3.2" fill="none"/>`;
  return `<defs><pattern id="${p}" width="96" height="96" patternUnits="userSpaceOnUse"><rect width="96" height="96" fill="${color}"/><rect x="0" y="40" width="96" height="16" fill="${check}" opacity="0.35"/><rect x="40" y="0" width="16" height="96" fill="${check}" opacity="0.35"/><rect x="0" y="88" width="96" height="3" fill="${shade(color, 0.3)}" opacity="0.5"/></pattern>
      <clipPath id="${clip}"><path d="${front}"/></clipPath>
      ${linear(wood, [[0, "#c9a57c"], [0.5, "#a77e57"], [1, "#7c5a3d"]], { x1: 0, y1: 0, x2: 0, y2: 1 })}</defs>
    <path d="${back}" fill="${shade(color, -0.18)}"/>${volume(back, { side: 0.3 })}
    <path d="${front}" fill="url(#${p})"/>${volume(front, { side: 0.22 })}
    ${fold("M-40,40 C-46,200 -50,400 -56,590", { clip: front, opacity: 0.24, width: 18, blur: 10 })}
    ${fold("M50,40 C56,220 58,420 60,600", { clip: front, opacity: 0.18, width: 18, blur: 10 })}
    ${fold("M10,40 C10,220 8,420 6,600", { clip: front, color: "#fff", opacity: 0.16, width: 22, blur: 12 })}
    ${fringe}
    <rect x="-270" y="-12" width="540" height="24" rx="12" fill="url(#${wood})"/>`;
}

export function fedora({ color = "#6f5a46", band = "#2c241e" } = {}) {
  const brim = `M-300,-40 C-300,-10 -200,10 0,10 C200,10 300,-10 300,-40 C300,-64 200,-82 0,-82 C-200,-82 -300,-64 -300,-40 Z`;
  const crown = `M-165,-70 C-172,-160 -160,-260 -120,-300 C-80,-330 -30,-322 0,-298 C30,-322 80,-330 120,-300 C160,-260 172,-160 165,-70 Z`;
  return `<path d="${brim}" fill="${shade(color, -0.08)}"/>${volume(brim, { side: 0.2, top: 0.15, bottom: 0.2 })}
    <path d="M-300,-40 C-300,-64 -200,-82 0,-82 C200,-82 300,-64 300,-40 C250,-58 150,-66 0,-66 C-150,-66 -250,-58 -300,-40 Z" fill="${shade(color, 0.1)}"/>
    <path d="${crown}" fill="${color}"/>${volume(crown, { side: 0.26, top: 0.12, bottom: 0.08 })}
    ${fold("M0,-296 C-4,-260 -2,-230 0,-200", { opacity: 0.35, width: 10, blur: 6 })}
    ${fold("M-90,-300 C-110,-250 -120,-180 -118,-110", { opacity: 0.18, width: 14, blur: 8 })}
    <path d="M-168,-122 C-100,-110 100,-110 168,-122 L166,-70 C100,-60 -100,-60 -166,-70 Z" fill="${band}"/>
    ${fold("M-166,-118 C-100,-106 100,-106 166,-118", { color: "#fff", opacity: 0.18, width: 4, blur: 2 })}
    <path d="M120,-118 L150,-104 L120,-84 Z" fill="${shade(band, 0.12)}"/>`;
}

/* ---------------- scene helpers ---------------- */
export function rail(x1, x2, y, color = "#2e2a26") {
  const g = uid("rl");
  return `<defs>${linear(g, [[0, shade(color, 0.4)], [0.5, color], [1, shade(color, -0.3)]], { x1: 0, y1: 0, x2: 0, y2: 1 })}</defs>
    <rect x="${x1}" y="${y - 7}" width="${x2 - x1}" height="14" rx="7" fill="url(#${g})"/>`;
}
export function plinth(cx, top, w, h, color = "#d9cfc1") {
  const g = uid("pl");
  return `<defs>${linear(g, [[0, shade(color, 0.08)], [1, shade(color, -0.08)]], { x1: 0, y1: 0, x2: 1, y2: 0 })}</defs>
    <rect x="${cx - w / 2}" y="${top}" width="${w}" height="${h}" fill="url(#${g})"/>
    <rect x="${cx - w / 2}" y="${top}" width="${w}" height="6" fill="${shade(color, 0.18)}"/>
    ${contactShadow(cx, top + h, w * 0.55, { opacity: 0.25 })}`;
}
export { contactShadow, blurFilter };
