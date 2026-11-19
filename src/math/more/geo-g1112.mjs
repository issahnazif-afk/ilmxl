// Grades 11 and 12 geometry and trigonometry, taught with pictures: angles in standard position, the unit circle,
// right triangles marked from θ, Sine/Cosine Law triangles, sectors, vectors and conics on a grid, congruence and
// similarity markings. Figure builders first (composed from the primitives in src/math/figs.mjs), then the
// generators and lessons used by g11.mjs and g12.mjs. Every builder returns { type: 'fig', w, h, items }.
import { num, mc, txt, St, dec, frac, neg, simplify, sgn, par } from '../kit.mjs';
import * as G from '../figs.mjs';

const { fig, line, text, path, circle, dot, poly, angleArc, rightMark, polygonFig } = G;
export const RAD = Math.PI / 180;
const R1 = (x) => Math.round(x * 10) / 10;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]) || 1;
const unit = (a) => mul(a, 1 / len(a));
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const has = (hl, k) => hl === k || (Array.isArray(hl) && hl.includes(k));
const L = (text, visual) => (visual ? { text, visual } : text);

// ── arrows and turns ──
export const head = (a, b, t = 'ink', s = 10) => { const u = unit(sub(b, a)), n = [-u[1], u[0]]; return poly([add(sub(b, mul(u, s)), mul(n, s * 0.5)), b, sub(sub(b, mul(u, s)), mul(n, s * 0.5))], t, { open: true }); };
export const arrow = (a, b, t = 'ink', s = 10) => [line(a, b, t), head(a, b, t, s)];
// the turn from the positive x-axis through deg (anticlockwise when positive) around O on screen; past one full turn
// it spirals outward so every turn shows
function turn(O, deg, r0 = 20, t = 'mark', tip = true) {
  const big = Math.abs(deg) > 360, n = Math.max(6, Math.ceil(Math.abs(deg) / 5)), pts = [];
  for (let i = 0; i <= n; i++) { const d = (deg * i) / n, rr = r0 + (big ? (10 * Math.abs(d)) / 360 : 0); pts.push([O[0] + rr * Math.cos(d * RAD), O[1] - rr * Math.sin(d * RAD)]); }
  return [poly(pts, t, { open: true }), tip && Math.abs(deg) > 12 ? head(pts[n - 1], pts[n], t, 8) : null];
}
const at = (O, deg, rr) => [O[0] + rr * Math.cos(deg * RAD), O[1] - rr * Math.sin(deg * RAD)];
const anchorFor = (u) => (u[0] > 0.35 ? 'start' : u[0] < -0.35 ? 'end' : 'middle');

// ── shift and place figures side by side ──
const shiftD = (d, dx, dy) => d.replace(/([MLA])([^MLAZ]*)/g, (m, c, args) => {
  const v = args.trim().split(/[\s,]+/).map(Number);
  if (c === 'A') { for (let i = 5; i < v.length; i += 7) { v[i] = R1(v[i] + dx); v[i + 1] = R1(v[i + 1] + dy); } } else for (let i = 0; i + 1 < v.length; i += 2) { v[i] = R1(v[i] + dx); v[i + 1] = R1(v[i + 1] + dy); }
  return c + v.join(' ');
});
const shiftItem = (it, dx, dy) => {
  const T = (p) => [R1(p[0] + dx), R1(p[1] + dy)], o = { ...it };
  if (o.pts) o.pts = o.pts.map(T); if (o.a) o.a = T(o.a); if (o.b) o.b = T(o.b); if (o.at) o.at = T(o.at); if (o.c) o.c = T(o.c); if (o.d) o.d = shiftD(o.d, dx, dy);
  return o;
};
// figures in a row, bottoms lined up
export function beside(figs, gap = 6) {
  const H = Math.max(...figs.map((f) => f.h)), items = []; let x = 0;
  for (const f of figs) { items.push(...f.items.map((it) => shiftItem(it, x, H - f.h))); x += f.w + gap; }
  return fig(items, x - gap, H);
}
// polygonFig, plus more items drawn with the same model → screen map
export function polyPlus(o, more) {
  const f = polygonFig(o), F = G.frame([...o.pts, ...(o.extra ?? [])], { W: o.W ?? 300, H: o.H ?? 220, pad: o.pad ?? 38 });
  f.items.push(...[more(F.m, F.s)].flat(2).filter(Boolean));
  return f;
}
// polygonFig drawn at a given scale (screen units per model unit), so similar shapes keep their true sizes
export function scaled(o, s, pad = 38) {
  const xs = o.pts.map((p) => p[0]), ys = o.pts.map((p) => p[1]);
  return polygonFig({ ...o, W: 2 * pad + s * (Math.max(...xs) - Math.min(...xs)), H: 2 * pad + s * (Math.max(...ys) - Math.min(...ys)), pad });
}
// a triangle with tick marks (equal sides), 1–3 arcs (equal angles) and right-angle boxes
export function marked(pts, { ticks = [], arcs = [], right = [], sides, names, angles, hl, W = 220, H = 180 } = {}) {
  return polyPlus({ pts, ticks, right, sides, names, angles, hl, W, H, pad: 30 }, (m) => {
    const P = pts.map(m), n = P.length, out = [];
    arcs.forEach((k, i) => { for (let j = 0; j < (k || 0); j++) out.push(angleArc(P[i], P[(i + n - 1) % n], P[(i + 1) % n], '', 16 + 5 * j)); });
    return out;
  });
}

// ── an angle in standard position ──
// angleFig({ deg, label, ref (label of the reference angle), drop (dashed line to the x-axis), pt (label at the
//   arm's end), hl: 'arm' | 'turn' | 'ref', quads: true, rad: true (axis names in radians), turn: false })
export function angleFig(o) {
  const W = o.W ?? 270, H = o.H ?? 250, O = [W / 2, H / 2], R = o.R ?? 88, hl = o.hl ?? [], items = [];
  items.push(line([O[0] - R - 16, O[1]], [O[0] + R + 16, O[1]], 'grid'), line([O[0], O[1] + R + 16], [O[0], O[1] - R - 16], 'grid'), line(O, [O[0] + R, O[1]], 'ink'));
  if (o.axes !== false) {
    const nm = o.rad ? ['0', 'π/2', 'π', '3π/2'] : ['0°', '90°', '180°', '270°'];
    items.push(text([O[0] + R + 14, O[1] - 11], nm[0], 'muted', { size: 11 }), text([O[0] + 8, O[1] - R - 12], nm[1], 'muted', { size: 11, anchor: 'start' }),
      text([O[0] - R - 14, O[1] - 11], nm[2], 'muted', { size: 11 }), text([O[0] + 8, O[1] + R + 12], nm[3], 'muted', { size: 11, anchor: 'start' }));
  }
  if (o.quads) ['I', 'II', 'III', 'IV'].forEach((q, i) => items.push(text([O[0] + (i === 0 || i === 3 ? 1 : -1) * (R + 2), O[1] + (i < 2 ? -1 : 1) * (R + 2)], q, has(o.hlQuad, i) ? 'hl' : 'muted', { size: 15 })));
  if (o.deg == null) return fig(items, W, H);
  const E = at(O, o.deg, R), nd = ((o.deg % 360) + 360) % 360;
  if (o.turn !== false) {
    items.push(...turn(O, o.deg, 20, has(hl, 'turn') ? 'hlline' : 'mark'));
    const lab = o.label ?? `${neg(o.deg)}°`;
    if (lab) {
      if (Math.abs(o.deg) <= 360 && Math.abs(o.deg) >= 25) { const u = [Math.cos((o.deg / 2) * RAD), -Math.sin((o.deg / 2) * RAD)]; items.push(text(add(O, mul(u, 36 + lab.length * 2.2)), lab, 'hl', { size: 13 })); }
      else items.push(text([8, 14], `θ = ${lab}`, 'hl', { anchor: 'start', size: 13 }));
    }
  }
  if (o.drop) items.push(line(E, [E[0], O[1]], 'aux'));
  if (o.ref != null) { const ax = nd > 90 && nd < 270 ? [O[0] - R, O[1]] : [O[0] + R, O[1]]; items.push(...angleArc(O, E, ax, o.ref, 40, has(hl, 'ref') ? 'hlline' : 'hl2')); }
  items.push(line(O, E, has(hl, 'arm') ? 'hlline' : 'ink'), o.arrow ? head(O, E, has(hl, 'arm') ? 'hlline' : 'ink', 12) : dot(E));
  if (o.armLabel) items.push(text(add(mid(O, E), mul(at([0, 0], o.deg + 90, 1), 14)), o.armLabel, has(hl, 'arm') ? 'hl' : 'ink', { size: 13 }));
  if (o.comps) { const F = [E[0], O[1]]; items.push(line(O, F, has(hl, 'x') ? 'hlline' : 'aux'), line(F, E, has(hl, 'y') ? 'hlline' : 'aux')); }
  if (o.pt) { const u = unit(sub(E, O)); items.push(text(add(E, [u[0] * 12, u[1] * 12 - 4]), o.pt, 'ink', { anchor: anchorFor(u), size: 13 })); }
  return fig(items, W, H);
}

// ── the unit circle ──
// unitFig({ pts: [{ deg, label, t: 'hl' | 'hl2' | 'ink', arc: label | true }], tri: { deg, hl: 'x' | 'y', x, y },
//   hline: { y, label }, vline: { x, label }, quads, sign: { quad, on } })
export function unitFig(o = {}) {
  const W = o.W ?? 360, H = o.H ?? 260, O = [W / 2, H / 2], R = o.R ?? 92, items = [];
  if (o.half) {
    const a0 = o.half[0], a1 = o.half[1], p0 = at(O, a0, R), p1 = at(O, a1, R);
    items.push(path(`M${O.map(R1).join(' ')}L${p0.map(R1).join(' ')}A${R} ${R} 0 0 0 ${p1.map(R1).join(' ')}Z`, 'hlsoft'));
  }
  items.push(circle(O, R, o.half ? 'ink' : 'top'), line([O[0] - R - 20, O[1]], [O[0] + R + 20, O[1]], 'grid'), line([O[0], O[1] + R + 20], [O[0], O[1] - R - 20], 'grid'));
  items.push(text([O[0] + R + 9, O[1] + 11], '1', 'muted', { size: 11 }), text([O[0] - R - 11, O[1] + 11], '−1', 'muted', { size: 11 }), text([O[0] + 9, O[1] - R - 9], '1', 'muted', { size: 11 }), text([O[0] + 12, O[1] + R + 10], '−1', 'muted', { size: 11 }));
  if (o.quads) ['I', 'II', 'III', 'IV'].forEach((q, i) => items.push(text([O[0] + (i === 0 || i === 3 ? 1 : -1) * R * 0.98, O[1] + (i < 2 ? -1 : 1) * R * 0.98], q, has(o.hlQuad, i) ? 'hl' : 'muted', { size: 15 })));
  if (o.hline) { const Y = O[1] - o.hline.y * R; items.push(line([O[0] - R - 24, Y], [O[0] + R + 24, Y], 'aux')); if (o.hline.label) items.push(text([6, Y - 11], o.hline.label, 'hl', { anchor: 'start', size: 12 })); }
  if (o.vline) { const X = O[0] + o.vline.x * R; items.push(line([X, O[1] + R + 22], [X, O[1] - R - 22], 'aux')); if (o.vline.label) items.push(text([X + 6, 10], o.vline.label, 'hl', { anchor: 'start', size: 12 })); }
  if (o.tri) {
    const E = at(O, o.tri.deg, R), F = [E[0], O[1]], up = E[1] < O[1], right = E[0] > O[0];
    items.push(line(O, F, has(o.tri.hl, 'x') ? 'hlline' : 'aux'), line(F, E, has(o.tri.hl, 'y') ? 'hlline' : 'aux'));
    if (Math.abs(E[0] - O[0]) > 12 && Math.abs(E[1] - O[1]) > 12) items.push(rightMark(F, O, E, 7));
    if (o.tri.x) items.push(text([(O[0] + F[0]) / 2, O[1] + (up ? 13 : -13)], o.tri.x, has(o.tri.hl, 'x') ? 'hl' : 'ink', { size: 12 }));
    if (o.tri.y) items.push(text([F[0] + (right ? 8 : -8), (F[1] + E[1]) / 2], o.tri.y, has(o.tri.hl, 'y') ? 'hl' : 'ink', { size: 12, anchor: right ? 'start' : 'end' }));
  }
  (o.pts ?? []).forEach((p, k) => {
    const t = p.t ?? 'ink', E = at(O, p.deg, R), u = unit(sub(E, O));
    if (p.arc) { items.push(...turn(O, p.deg, 18 + 8 * k, t === 'ink' ? 'mark' : t === 'hl' ? 'hlline' : 'hl2')); if (p.arc !== true) { const m = [Math.cos((p.deg / 2) * RAD), -Math.sin((p.deg / 2) * RAD)]; items.push(text(add(O, mul(m, 34 + 8 * k + p.arc.length * 2)), p.arc, t === 'hl2' ? 'hl2' : 'hl', { size: 12 })); } }
    items.push(line(O, E, t === 'hl' ? 'hlline' : t), dot(E, t === 'ink' ? 'ink' : t === 'hl2' ? 'hl2' : 'hl'));
    if (p.label) items.push(text(add(E, [u[0] * 10, u[1] * 10 + (Math.abs(u[0]) > 0.35 ? (u[1] < 0 ? -4 : 4) : u[1] < 0 ? -4 : 6)]), p.label, t === 'hl2' ? 'hl2' : t === 'hl' ? 'hl' : 'ink', { anchor: anchorFor(u), size: 13 }));
  });
  items.push(dot(O));
  return fig(items, W, H);
}

// ── right triangles, marked from the angle θ ──
// rtTri({ deg (θ, drawn true between 26° and 64°), adj, opp, hyp (labels), ang (label at θ), top (label at the
//   other acute angle), hl: 'adj' | 'opp' | 'hyp' | 'ang' | 'top', flip: θ at the bottom right, names })
export const drawnDeg = (d) => Math.min(64, Math.max(26, d));
export const toScale = (d) => Math.abs(drawnDeg(d) - d) < 1.5;
export function rtTri(o) {
  const d = drawnDeg(o.deg ?? 37), c = Math.cos(d * RAD), s = Math.sin(d * RAD);
  const pts = o.flip ? [[c, 0], [0, 0], [0, s]] : [[0, 0], [c, 0], [c, s]];
  const map = { adj: { side: 0 }, opp: { side: 1 }, hyp: { side: 2 }, ang: { angle: 0 }, top: { angle: 2 } };
  const hl = [].concat(o.hl ?? []).map((h) => map[h] ?? h);
  return polygonFig({ pts, sides: [o.adj ?? '', o.opp ?? '', o.hyp ?? ''], angles: [o.ang ?? '', '', o.top ?? ''], right: [1], names: o.names, hl, W: o.W, H: o.H });
}
// a right triangle from its legs (true shape when the legs are not too different; squashed otherwise)
export function legsTri(a, b, o = {}) {
  const deg = Math.atan2(b, a) / RAD;
  return rtTri({ ...o, deg });
}

// ── any triangle ABC, drawn true from its angles ──
// triFig({ A, B (degrees), sides: { a, b, c }, angs: { A, B, C }, hl: ['a', 'B', …], names, flip })
export function triPts(A, B) {
  const C = 180 - A - B, c = Math.sin(C * RAD), b = Math.sin(B * RAD);
  return [[0, 0], [c, 0], [b * Math.cos(A * RAD), b * Math.sin(A * RAD)]];
}
export function triFig(o) {
  let pts = triPts(o.A, o.B);
  if (o.flip) pts = pts.map(([x, y]) => [-x, y]);
  const s = o.sides ?? {}, g = o.angs ?? {}, map = { c: { side: 0 }, a: { side: 1 }, b: { side: 2 }, A: { angle: 0 }, B: { angle: 1 }, C: { angle: 2 } };
  const hl = [].concat(o.hl ?? []).map((h) => map[h] ?? h);
  return polygonFig({ pts, sides: [s.c ?? '', s.a ?? '', s.b ?? ''], angles: [g.A ?? '', g.B ?? '', g.C ?? ''], names: o.names ?? ['A', 'B', 'C'], hl, W: o.W ?? 300, H: o.H ?? 220 });
}
// the angles (degrees) of a triangle from its sides a, b, c
export const anglesOf = (a, b, c) => { const A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) / RAD, B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / RAD; return [A, B, 180 - A - B]; };

// ── a coordinate grid; draw(m, u) adds items in model coordinates (m maps a model point to the screen) ──
export function gridFig(o) {
  const [x0, x1] = o.x, [y0, y1] = o.y, pad = o.pad ?? 22, span = Math.max(x1 - x0, y1 - y0);
  const u = Math.min(((o.W ?? 270) - 2 * pad) / (x1 - x0), ((o.H ?? 270) - 2 * pad) / (y1 - y0));
  const W = 2 * pad + u * (x1 - x0), H = 2 * pad + u * (y1 - y0);
  const m = ([x, y]) => [pad + (x - x0) * u, pad + (y1 - y) * u];
  const items = [], every = span > 24 ? 2 : 1, step = o.step ?? (span > 24 ? 5 : span > 12 ? 2 : 1);
  for (let x = Math.ceil(x0); x <= x1; x++) if (x % every === 0 && x !== 0) items.push(line(m([x, y0]), m([x, y1]), 'grid'));
  for (let y = Math.ceil(y0); y <= y1; y++) if (y % every === 0 && y !== 0) items.push(line(m([x0, y]), m([x1, y]), 'grid'));
  const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
  if (y0 <= 0 && y1 >= 0) items.push(line(m([x0, 0]), m([x1, 0]), 'ink'));
  if (x0 <= 0 && x1 >= 0) items.push(line(m([0, y0]), m([0, y1]), 'ink'));
  if (o.ticks !== false) {
    for (let x = Math.ceil(x0); x <= x1; x++) if (x && x % step === 0) items.push(text(add(m([x, ax]), [0, 10]), neg(x), 'muted', { size: 10 }));
    for (let y = Math.ceil(y0); y <= y1; y++) if (y && y % step === 0) items.push(text(add(m([ay, y]), [-5, 0]), neg(y), 'muted', { size: 10, anchor: 'end' }));
  }
  items.push(text(add(m([x1, ax]), [-6, -10]), o.xName ?? 'x', 'muted', { size: 12 }), text(add(m([ay, y1]), [10, 6]), o.yName ?? 'y', 'muted', { size: 12 }));
  if (o.draw) items.push(...[o.draw(m, u)].flat(3).filter(Boolean));
  return fig(items, W, H);
}
// a square window around some points, always showing the origin
export function window(points, margin = 1, min = 6) {
  const xs = [0, ...points.map((p) => p[0])], ys = [0, ...points.map((p) => p[1])];
  let x0 = Math.min(...xs) - margin, x1 = Math.max(...xs) + margin, y0 = Math.min(...ys) - margin, y1 = Math.max(...ys) + margin;
  const span = Math.max(x1 - x0, y1 - y0, min);
  const gx = span - (x1 - x0), gy = span - (y1 - y0);
  x0 -= Math.floor(gx / 2); x1 += Math.ceil(gx / 2); y0 -= Math.floor(gy / 2); y1 += Math.ceil(gy / 2);
  return { x: [x0, x1], y: [y0, y1] };
}
// a vector on a grid: an arrow from p to q, with a label beside its middle
export const vecOn = (m, p, q, t = 'hlline', label = '', side = 1) => {
  const a = m(p), b = m(q), n = unit([b[1] - a[1], a[0] - b[0]]);
  return [...arrow(a, b, t, 11), label ? text(add(mid(a, b), mul(n, 14 * side)), label, t === 'hl2' ? 'hl2' : t === 'ink' ? 'ink' : 'hl', { size: 13 }) : null];
};
// y = f(x) across the window, broken where it leaves it
export const curveOn = (m, f, [x0, x1], [y0, y1], t = 'hlline', n = 120) => {
  const out = []; let run = [];
  for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n, y = f(x); if (Number.isFinite(y) && y >= y0 - 1e-9 && y <= y1 + 1e-9) run.push(m([x, y])); else { if (run.length > 1) out.push(poly(run, t, { open: true })); run = []; } }
  if (run.length > 1) out.push(poly(run, t, { open: true }));
  return out;
};

// ── a sector of a circle in standard position ──
// sectorFig({ deg, r (label), s (arc label), th (angle label), hl: 'arc' | 'radius' | 'angle' | 'fill' })
export function sectorFig(o) {
  const W = o.W ?? 270, H = o.H ?? 230, O = [W / 2, H / 2 + 4], R = o.R ?? 82, d = o.deg, hl = o.hl ?? [];
  const P0 = at(O, 0, R), P1 = at(O, d, R), big = d > 180 ? 1 : 0;
  const items = [circle(O, R, 'top'), path(`M${O.map(R1).join(' ')}L${P0.map(R1).join(' ')}A${R} ${R} 0 ${big} 0 ${P1.map(R1).join(' ')}Z`, has(hl, 'fill') ? 'hl' : 'hl2')];
  items.push(path(`M${P0.map(R1).join(' ')}A${R} ${R} 0 ${big} 0 ${P1.map(R1).join(' ')}`, has(hl, 'arc') ? 'hlline' : 'ink'));
  items.push(line(O, P0, has(hl, 'radius') ? 'hlline' : 'ink'), line(O, P1, 'ink'), dot(O));
  items.push(...turn(O, d, 20, has(hl, 'angle') ? 'hlline' : 'mark', false));
  if (o.r) items.push(text([O[0] + R / 2, O[1] + 13], o.r, has(hl, 'radius') ? 'hl' : 'ink', { size: 13 }));
  if (o.th) { const u = [Math.cos((d / 2) * RAD), -Math.sin((d / 2) * RAD)]; items.push(text(add(O, mul(u, d < 50 ? 50 + o.th.length * 2 : 36 + o.th.length * 2)), o.th, 'hl', { size: 13 })); }
  if (o.s) { const u = [Math.cos((d / 2) * RAD), -Math.sin((d / 2) * RAD)]; items.push(text(add(O, mul(u, R + 12)), o.s, has(hl, 'arc') ? 'hl' : 'ink', { size: 13, anchor: anchorFor(u) })); }
  return fig(items, W, H);
}

// ════════════════════════ grade 11 ════════════════════════
export const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
export const TRIG_DEF = { sin: ['opposite', 'hypotenuse'], cos: ['adjacent', 'hypotenuse'], tan: ['opposite', 'adjacent'], csc: ['hypotenuse', 'opposite'], sec: ['hypotenuse', 'adjacent'], cot: ['adjacent', 'opposite'] };
export const SPECIAL = { sin: { 30: '1/2', 45: '√2/2', 60: '√3/2' }, cos: { 30: '√3/2', 45: '√2/2', 60: '1/2' }, tan: { 30: '√3/3', 45: '1', 60: '√3' }, csc: { 30: '2', 45: '√2', 60: '2√3/3' }, sec: { 30: '2√3/3', 45: '√2', 60: '2' }, cot: { 30: '√3', 45: '1', 60: '√3/3' } };
const SHORT = { opposite: 'opp', adjacent: 'adj', hypotenuse: 'hyp' };
const QN = ['I', 'II', 'III', 'IV'];
const norm = (d) => ((d % 360) + 360) % 360;
const refOf = (n) => [n, 180 - n, n - 180, 360 - n][Math.floor(n / 90)];
const refHow = (n) => [`${n}°`, `180° − ${n}°`, `${n}° − 180°`, `360° − ${n}°`][Math.floor(n / 90)];
const NS = ' (The figure is not drawn to scale.)';
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const art = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
// two lengths for drawing: their true ratio when it is readable, otherwise squashed (then say "not drawn to scale")
const dims = (a, b, max = 3.2) => { const k = Math.max(a, b) / Math.min(a, b); if (k <= max) return [a, b, true]; const [x, y] = G.squash([a, b], 0.4, 0.75); return [x * 10, y * 10, false]; };

// ───────── 11. angles in standard position ─────────
export function angles(r) {
  const v = r.int(0, 6);
  let th = r.int(-720, 720); while (th % 90 === 0) th = r.int(-720, 720);
  const n = norm(th), q = Math.floor(n / 90), Q = QN[q], ref = refOf(n), k = Math.round((n - th) / 360);
  const reduce = th === n ? St(`${th}° is already between 0° and 360°.`, angleFig({ deg: th, quads: true }))
    : St(`${k < 0 ? 'Subtract' : 'Add'} 360° ${Math.abs(k) === 1 ? 'once' : `${Math.abs(k)} times`}: ${neg(th)}° ${k > 0 ? '+' : '−'} ${Math.abs(k) * 360}° = ${n}°. Whole turns end in the same place.`, angleFig({ deg: th, quads: true, hl: 'turn' }));
  if (v === 0) return mc(r, `Quadrant ${Q}`, QN.map((x) => `Quadrant ${x}`), { q: `In standard position an angle starts on the positive x-axis and turns anticlockwise (clockwise if negative). In which quadrant does the terminal arm of ${neg(th)}° lie?`, visual: angleFig({ quads: true }),
    steps: [reduce, St(`${n}° is between ${q * 90}° and ${q * 90 + 90}°, so the arm is in Quadrant ${Q}.`, angleFig({ deg: n, quads: true, hlQuad: q, hl: 'arm' }))] });
  if (v === 1) return num(n, [St('Coterminal angles share the same terminal arm: they differ by whole turns of 360°.', angleFig({ deg: th, quads: true })), reduce, St(`So the coterminal angle is ${n}°.`, angleFig({ deg: n, hl: 'arm' }))], { q: `Find the angle between 0° and 360° that is coterminal with ${neg(th)}°.`, visual: angleFig({ deg: th, quads: true }), expr: `((${th}%360)+360)%360` });
  if (v === 2) return num(ref, [...(th === n ? [] : [reduce]), St(`${n}° is in Quadrant ${Q}. The reference angle is the acute angle between the terminal arm and the x-axis: ${refHow(n)} = ${ref}°.`, angleFig({ deg: n, quads: true, ref: `${ref}°`, hl: 'ref', drop: true })), St(`So the reference angle is ${ref}°.`)], { q: `What is the reference angle of ${neg(th)}°?`, visual: angleFig({ deg: th, quads: true }), expr: `(()=>{const n=((${th}%360)+360)%360;return [n,180-n,n-180,360-n][Math.floor(n/90)]})()` });
  if (v === 3) {
    const kk = r.pick([-2, -1, 1, 2]), right = `${neg(th + 360 * kk)}°`;
    return mc(r, right, [`${neg(th + 180)}°`, `${neg(-th)}°`, `${neg(th + 90)}°`], { q: `Which angle is coterminal with ${neg(th)}°?`, visual: angleFig({ deg: th, quads: true }),
      steps: [St('Coterminal angles end on the same terminal arm, so they differ by a multiple of 360°.', angleFig({ deg: th })), St(`${neg(th)}° ${kk > 0 ? '+' : '−'} ${Math.abs(kk) * 360}° = ${right}: the same arm after ${Math.abs(kk)} more turn${Math.abs(kk) > 1 ? 's' : ''}.`, angleFig({ deg: th + 360 * kk, hl: 'turn' }))] });
  }
  if (v === 4) {
    const qq = r.int(0, 3), rf = r.int(2, 16) * 5, t = [rf, 180 - rf, 180 + rf, 360 - rf][qq];
    const how = [`θ = ${rf}°`, `θ = 180° − ${rf}°`, `θ = 180° + ${rf}°`, `θ = 360° − ${rf}°`][qq];
    return num(t, [St(`The arm is in Quadrant ${QN[qq]}, ${rf}° from the ${qq === 0 || qq === 3 ? 'positive' : 'negative'} x-axis.`, angleFig({ deg: t, label: 'θ', ref: `${rf}°`, quads: true, hlQuad: qq, hl: 'ref' })), St(`Measure from the positive x-axis: ${how} = ${t}°.`, angleFig({ deg: t, label: `${t}°`, ref: `${rf}°`, hl: 'turn' })), St(`So θ = ${t}°.`)],
      { q: 'The terminal arm of θ makes the marked angle with the x-axis. What is θ, between 0° and 360°?', unit: 'θ =', visual: angleFig({ deg: t, label: 'θ', ref: `${rf}°`, quads: true }), expr: `${t}` });
  }
  if (v === 5) return num(n - 360, [...(th === n ? [] : [reduce]), St(`Turning the other way (clockwise) to the same arm: ${n}° − 360° = ${n - 360}°.`, angleFig({ deg: n - 360, quads: true, hl: 'turn' })), St(`So the negative coterminal angle is ${neg(n - 360)}°.`)], { q: `Find the coterminal angle of ${neg(th)}° that is between −360° and 0°.`, visual: angleFig({ deg: th, quads: true }), expr: `((${th}%360)+360)%360-360` });
  const right = `${n}° + 360°k`;
  return mc(r, right, [`${n}° + 180°k`, `${n}° + 90°k`, `${neg(-th)}° + 360°k`], { q: `Which expression gives every angle coterminal with ${neg(th)}°? (k is any integer.)`, visual: angleFig({ deg: th, quads: true }),
    steps: [reduce, St(`Every coterminal angle is ${n}° plus some whole number of full turns: ${right}.`, angleFig({ deg: n + 360, hl: 'turn' }))] });
}

// ───────── 11. right triangles ─────────
export function righttri(r) {
  const v = r.int(0, 7), u = r.pick(['cm', 'm', 'mm']);
  if (v <= 1) {
    const [p, q, h] = r.pick(TRIPLES), k = r.int(1, 3), sw = r.bool(), a = (sw ? p : q) * k, b = (sw ? q : p) * k, c = h * k, deg = Math.atan2(a, b) / RAD, note = toScale(deg) ? '' : NS;
    if (v === 0) {
      const pic = (hl) => rtTri({ deg, adj: `${b} ${u}`, opp: `${a} ${u}`, hyp: 'c', hl });
      return num(c, [St(`The hypotenuse c is the longest side, across from the right angle. The two legs are ${a} and ${b}.`, pic(['adj', 'opp'])), St(`c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}.`, pic('hyp')), St(`c = √${c * c} = ${c}.`), St(`So the hypotenuse is ${c} ${u}.`)], { q: `Find the length of the hypotenuse c, in ${u}.${note}`, unit: 'c =', visual: pic(), expr: `Math.hypot(${a},${b})` });
    }
    const pic = (hl) => rtTri({ deg, adj: `${b} ${u}`, opp: 'x', hyp: `${c} ${u}`, hl });
    return num(a, [St(`The hypotenuse is ${c}, across from the right angle. x is a leg, so x² + ${b}² = ${c}².`, pic(['hyp'])), St(`x² = ${c}² − ${b}² = ${c * c} − ${b * b} = ${a * a}.`, pic('opp')), St(`x = √${a * a} = ${a}.`), St(`So the missing leg is ${a} ${u}.`)], { q: `Find the length of the leg x, in ${u}.${note}`, unit: 'x =', visual: pic(), expr: `Math.sqrt(${c}**2-${b}**2)` });
  }
  if (v === 2) {
    let a, b, c; if (r.bool(0.35)) { const [p, q, h] = r.pick(TRIPLES), k = r.int(1, 2); [a, b, c] = [p * k, q * k, h * k]; if (a > b) [a, b] = [b, a]; } else { a = r.int(4, 12); b = r.int(a, 15); c = r.int(b + 1, a + b - 1); }
    const s = a * a + b * b, right = c * c === s ? 'Right' : c * c > s ? 'Obtuse' : 'Acute', [A, B, C] = anglesOf(a, b, c);
    return mc(r, right, ['Acute', 'Right', 'Obtuse'], { q: `A triangle has sides ${a}, ${b} and ${c}. Is it acute, right or obtuse?`,
      steps: [St(`The biggest angle is across from the longest side, ${c}. Compare ${c}² with ${a}² + ${b}².`), St(`${c}² = ${c * c} and ${a}² + ${b}² = ${a * a} + ${b * b} = ${s}.`), St(`${c * c} ${c * c === s ? '=' : c * c > s ? '>' : '<'} ${s}: the angle across from ${c} is ${c * c === s ? 'exactly 90°' : c * c > s ? 'more than 90°' : 'less than 90°'}, so the triangle is ${right.toLowerCase()}.`, triFig({ A, B, sides: { a: `${a}`, b: `${b}`, c: `${c}` }, angs: { C: c * c === s ? '90°' : `≈ ${Math.round(C)}°` }, hl: ['c', 'C'] }))] });
  }
  if (v === 3) {
    const n = r.int(2, 12), hyp = r.bool(), pic = (hl, x) => rtTri({ deg: 45, adj: hyp ? `${n}` : 'x', opp: hyp ? `${n}` : 'x', hyp: hyp ? 'x' : `${n}√2`, ang: '45°', top: '45°', hl });
    const key = St('A 45-45-90 triangle has two equal legs. Its sides are in the ratio 1 : 1 : √2.', rtTri({ deg: 45, adj: '1', opp: '1', hyp: '√2', ang: '45°', top: '45°' }));
    if (hyp) return mc(r, `${n}√2`, [`${n}√3`, `${2 * n}`, `${n}`], { q: 'This 45-45-90 triangle has legs of the length shown. How long is the hypotenuse x?', visual: pic(), steps: [key, St(`The hypotenuse is √2 times a leg: ${n} × √2 = ${n}√2.`, pic('hyp'))] });
    return num(n, [key, St(`Each leg is the hypotenuse divided by √2: ${n}√2 ÷ √2 = ${n}.`, pic(['adj', 'opp'])), St(`So each leg is ${n}.`)], { q: 'This 45-45-90 triangle has the hypotenuse shown. How long is each leg x?', unit: 'x =', visual: pic() });
  }
  if (v === 4) {
    const s = r.int(2, 12), ask = r.int(0, 2), key = St('In a 30-60-90 triangle the sides are 1 (across from 30°), √3 (across from 60°) and 2 (the hypotenuse).', rtTri({ deg: 30, opp: '1', adj: '√3', hyp: '2', ang: '30°', top: '60°' }));
    const pic = (hl) => rtTri({ deg: 30, opp: ask === 2 ? 'x' : `${s}`, adj: ask === 1 ? 'x' : '', hyp: ask === 0 ? 'x' : ask === 2 ? `${2 * s}` : '', ang: '30°', top: '60°', hl });
    if (ask === 0) return num(2 * s, [key, St(`The hypotenuse is twice the short leg: 2 × ${s} = ${2 * s}.`, pic(['opp', 'hyp'])), St(`So x = ${2 * s}.`)], { q: 'In this 30-60-90 triangle, how long is the hypotenuse x?', unit: 'x =', visual: pic(), expr: `2*${s}` });
    if (ask === 2) return num(s, [key, St(`The short leg (across from 30°) is half the hypotenuse: ${2 * s} ÷ 2 = ${s}.`, pic(['opp', 'hyp'])), St(`So x = ${s}.`)], { q: 'In this 30-60-90 triangle, how long is the short leg x?', unit: 'x =', visual: pic(), expr: `${2 * s}/2` });
    return mc(r, `${s}√3`, [`${s}√2`, `${2 * s}`, `${s * 3}`], { q: 'In this 30-60-90 triangle, how long is the long leg x (across from 60°)?', visual: pic(), steps: [key, St(`The long leg is √3 times the short leg: ${s} × √3 = ${s}√3.`, pic(['opp', 'adj']))] });
  }
  if (v === 5) {
    const [p, q, h] = r.pick(TRIPLES.slice(0, 3)), k = r.int(1, 4), a = p * k, b = q * k, c = h * k, [W, H, ok] = dims(b, a);
    const base = { pts: [[0, 0], [W, 0], [W, H], [0, H]], sides: [`${b} m`, `${a} m`, '', ''], right: [0, 1, 2, 3] };
    return num(c, [St('The diagonal cuts the rectangle into two right triangles. The diagonal is the hypotenuse.', G.polygonFig({ ...base, regions: [{ pts: [[0, 0], [W, 0], [W, H]], t: 'hl' }], diag: [[0, 2, 'hlline']] })), St(`d² = ${b}² + ${a}² = ${b * b} + ${a * a} = ${c * c}.`), St(`d = √${c * c} = ${c}.`), St(`So the path is ${c} m long.`)],
      { q: `A rectangular park is ${b} m long and ${a} m wide. A path runs straight across it from corner to corner. How long is the path, in m?${ok ? '' : NS}`, visual: G.polygonFig({ ...base, diag: [[0, 2, 'aux']], notes: [{ at: [W / 2 - W * 0.06, H / 2 + H * 0.12], s: 'd', t: 'hl' }] }), expr: `Math.hypot(${a},${b})` });
  }
  if (v === 6) {
    const [p, q, h] = r.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]), sx = r.bool() ? 1 : -1, sy = r.bool() ? 1 : -1;
    const x1 = sx > 0 ? r.int(-6, 6 - p) : r.int(-6 + p, 6), y1 = sy > 0 ? r.int(-6, 6 - q) : r.int(-6 + q, 6), x2 = x1 + sx * p, y2 = y1 + sy * q, A = [x1, y1], B = [x2, y2], C = [x2, y1];
    const wnd = window([A, B], 2), pic = (legs) => gridFig({ ...wnd, draw: (m) => [legs ? [line(m(A), m(C), 'hlline'), line(m(C), m(B), 'hlline'), text(add(mid(m(A), m(C)), [0, sy > 0 ? 12 : -12]), `${p}`, 'hl', { size: 13 }), text(add(mid(m(C), m(B)), [sx > 0 ? 12 : -12, 0]), `${q}`, 'hl', { size: 13 })] : null, line(m(A), m(B), legs ? 'aux' : 'ink'), dot(m(A), 'hl'), dot(m(B), 'hl'), text(add(m(A), [-10, sy > 0 ? 10 : -10]), 'A', 'ink', { size: 13 }), text(add(m(B), [10, sy > 0 ? -10 : 10]), 'B', 'ink', { size: 13 })] });
    return num(h, [St(`Draw a right triangle with AB as its hypotenuse. Across, from x = ${neg(x1)} to x = ${neg(x2)}: ${p} units. Up or down, from y = ${neg(y1)} to y = ${neg(y2)}: ${q} units.`, pic(true)), St(`AB² = ${p}² + ${q}² = ${p * p + q * q}.`), St(`AB = √${h * h} = ${h}.`), St(`So the distance AB is ${h} units.`)],
      { q: `A is ${`(${neg(x1)}, ${neg(y1)})`} and B is ${`(${neg(x2)}, ${neg(y2)})`}. How far apart are A and B?`, visual: pic(false), expr: `Math.hypot(${x2 - x1},${y2 - y1})` });
  }
  const [p, q, h] = r.pick(TRIPLES.slice(0, 3)), k = r.int(1, 2), L = h * k, up = q * k, out = p * k, deg = Math.atan2(up, out) / RAD;
  const pic = (hl) => rtTri({ deg, adj: 'x', opp: `${up} m`, hyp: `${L} m`, hl });
  return num(out, [St(`The ladder is the hypotenuse (${L} m). The wall height (${up} m) and the distance x along the ground are the legs.`, pic('hyp')), St(`x² = ${L}² − ${up}² = ${L * L} − ${up * up} = ${out * out}.`, pic('adj')), St(`x = √${out * out} = ${out}.`), St(`So the foot of the ladder is ${out} m from the wall.`)],
    { q: `A ${L} m ladder leans against a wall and reaches ${up} m up it. How far from the wall is the foot of the ladder, in m?${toScale(deg) ? '' : NS}`, unit: 'x =', visual: pic(), expr: `Math.sqrt(${L}**2-${up}**2)` });
}

// ───────── 11. the six trig ratios ─────────
const special = (d, hl) => (d === 45 ? rtTri({ deg: 45, adj: '1', opp: '1', hyp: '√2', ang: '45°', top: '45°', hl }) : d === 30 ? rtTri({ deg: 30, adj: '√3', opp: '1', hyp: '2', ang: '30°', top: '60°', hl }) : rtTri({ deg: 60, adj: '1', opp: '√3', hyp: '2', ang: '60°', top: '30°', hl }));
export function trigratio(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const [p, q, h] = r.pick(TRIPLES), k = r.int(1, 2), sw = r.bool(), a = (sw ? p : q) * k, b = (sw ? q : p) * k, c = h * k, f = r.pick(Object.keys(TRIG_DEF)), side = { opposite: b, adjacent: a, hypotenuse: c }, [top, bot] = TRIG_DEF[f], deg = Math.atan2(b, a) / RAD;
    const pic = (hl) => rtTri({ deg, adj: `${a}`, opp: `${b}`, hyp: `${c}`, ang: 'θ', hl });
    const ans = frac(side[top], side[bot]);
    return num(ans, [St(`Name the sides from θ: the opposite side (${b}) is across from θ, the adjacent side (${a}) touches θ, and the hypotenuse (${c}) is across from the right angle.`, pic(['ang', 'opp', 'adj'])), St(`${f} θ = ${top} ÷ ${bot} = ${side[top]}/${side[bot]}.`, pic([SHORT[top], SHORT[bot]])), St(`In lowest terms, ${f} θ = ${ans}.`)],
      { q: `What is ${f} θ in this right triangle? Give a fraction.${toScale(deg) ? '' : NS}`, visual: pic(), expr: `${side[top]}/${side[bot]}` });
  }
  if (v === 1) {
    const f = r.pick(Object.keys(SPECIAL)), d = r.pick([30, 45, 60]), right = SPECIAL[f][d], [top, bot] = TRIG_DEF[f];
    const pool = r.shuffle(['1/2', '√2/2', '√3/2', '1', '√3', '√3/3', '2', '2√3/3', '√2'].filter((x) => x !== right));
    return mc(r, right, pool.slice(0, 3), { q: `What is the exact value of ${f} ${d}°?`, visual: special(d),
      steps: [St(d === 45 ? 'Use the 45-45-90 triangle with sides 1, 1 and √2.' : 'Use the 30-60-90 triangle: 1 across from 30°, √3 across from 60°, and 2 for the hypotenuse.', special(d, 'ang')), St(`From the ${d}° angle, ${f} = ${top} ÷ ${bot}.`, special(d, [SHORT[top], SHORT[bot]])), St(`So ${f} ${d}° = ${right}.`)] });
  }
  if (v === 2) {
    const f = r.pick(['sin', 'cos', 'tan', 'csc', 'sec', 'cot']), d = r.int(5, 85), v2 = { sin: Math.sin, cos: Math.cos, tan: Math.tan, csc: (x) => 1 / Math.sin(x), sec: (x) => 1 / Math.cos(x), cot: (x) => 1 / Math.tan(x) }[f](d * RAD), ans = dec(v2, 4);
    const base = { csc: 'sin', sec: 'cos', cot: 'tan' }[f];
    return num(ans, [St('Make sure the calculator is in degree mode.'), base ? St(`${f} is the reciprocal of ${base}: ${f} ${d}° = 1 ÷ ${base} ${d}°.`) : St(`Key in ${f} ${d}.`), St(`${f} ${d}° ≈ ${ans}.`)], { q: `Use a calculator: find ${f} ${d}°, rounded to 4 decimal places.`, tol: 0.00006, expr: base ? `1/Math.${base}(${d}*Math.PI/180)` : `Math.${f}(${d}*Math.PI/180)` });
  }
  if (v === 3) {
    const at0 = r.bool(), names = at0 ? ['A', 'C', 'B'] : ['B', 'C', 'A'], X = names[0], what = r.pick(['opposite', 'adjacent', 'hypotenuse']), deg = r.int(30, 60);
    const seg = [names[0] + names[1], names[1] + names[2], names[2] + names[0]].map((s) => s.split('').sort().join(''));
    const right = seg[{ adjacent: 0, opposite: 1, hypotenuse: 2 }[what]];
    const pic = (hl) => rtTri({ deg, ang: 'θ', names, hl });
    return mc(r, right, seg.filter((s) => s !== right), { q: `In right triangle ABC, the right angle is at C and θ is at ${X}. Which side is the ${what}${what === 'hypotenuse' ? '' : ' side for θ'}?`, visual: pic(),
      steps: [St(what === 'hypotenuse' ? 'The hypotenuse is always across from the right angle.' : what === 'opposite' ? `The opposite side is across from θ: it does not touch ${X}.` : `The adjacent side touches θ at ${X} but is not the hypotenuse.`, pic('ang')), St(`So it is ${right}.`, pic(SHORT[what]))] });
  }
  if (v === 4) {
    const [p, q, h] = r.pick(TRIPLES.slice(0, 4)), sw = r.bool(), o = sw ? p : q, a = sw ? q : p, side = { opposite: o, adjacent: a, hypotenuse: h };
    const g = r.pick(['sin', 'cos', 'tan']), fs = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot'].filter((x) => x !== g), f = r.pick(fs), [gt, gb] = TRIG_DEF[g], miss = ['opposite', 'adjacent', 'hypotenuse'].find((x) => x !== gt && x !== gb), [top, bot] = TRIG_DEF[f], deg = Math.atan2(o, a) / RAD;
    const lab = (w) => (w === miss ? '?' : `${side[w]}`);
    const pic = (hl) => rtTri({ deg, opp: lab('opposite'), adj: lab('adjacent'), hyp: lab('hypotenuse'), ang: 'θ', hl });
    const how = miss === 'hypotenuse' ? `? = √(${o}² + ${a}²) = √${h * h} = ${h}` : `? = √(${h}² − ${side[miss === 'opposite' ? 'adjacent' : 'opposite']}²) = √${side[miss] ** 2} = ${side[miss]}`;
    return num(frac(side[top], side[bot]), [St(`${g} θ = ${gt} ÷ ${gb} = ${side[gt]}/${side[gb]}, so draw a right triangle with ${gt} ${side[gt]} and ${gb} ${side[gb]}.`, pic([SHORT[gt], SHORT[gb]])), St(`Find the third side with Pythagoras: ${how}.`, pic(SHORT[miss])), St(`${f} θ = ${top} ÷ ${bot} = ${side[top]}/${side[bot]}.`), St(`So ${f} θ = ${frac(side[top], side[bot])}.`)],
      { q: `θ is acute and ${g} θ = ${side[gt]}/${side[gb]}. Find ${f} θ as a fraction.`, visual: pic(), expr: `${side[top]}/${side[bot]}` });
  }
  if (v === 5) {
    const d = r.int(26, 64), n = r.int(4, 30), pair = r.pick([['opposite', 'hypotenuse', 'sin'], ['adjacent', 'hypotenuse', 'cos'], ['opposite', 'adjacent', 'tan']]), xIs = r.int(0, 1), [s1, s2, f] = pair, xw = pair[xIs], kw = pair[1 - xIs];
    const lab = (w) => (w === xw ? 'x' : w === kw ? `${n}` : '');
    const pic = (hl) => rtTri({ deg: d, opp: lab('opposite'), adj: lab('adjacent'), hyp: lab('hypotenuse'), ang: `${d}°`, hl });
    const top = s1 === xw ? 'x' : `${n}`, bot = s2 === xw ? 'x' : `${n}`, right = `${f} ${d}° = ${top}/${bot}`;
    const other = { sin: ['cos', 'tan'], cos: ['sin', 'tan'], tan: ['sin', 'cos'] }[f];
    return mc(r, right, [`${other[0]} ${d}° = ${top}/${bot}`, `${other[1]} ${d}° = ${top}/${bot}`, `${f} ${d}° = ${bot}/${top}`], { q: 'Which equation is true for this triangle?', visual: pic(),
      steps: [St(`From the ${d}° angle, x is the ${xw} and ${n} is the ${kw}.`, pic(['ang', SHORT[xw], SHORT[kw]])), St(`The ratio with the ${s1} over the ${s2} is ${f}, so ${right}.`)] });
  }
  const f = r.pick(['sin', 'cos', 'tan']), val = f === 'tan' ? r.int(10, 300) / 100 : r.int(10, 95) / 100, A = { sin: Math.asin, cos: Math.acos, tan: Math.atan }[f](val) / RAD, ans = Math.round(A);
  return num(ans, [St(`Undo ${f} with the inverse: A = ${f}⁻¹(${val}).`), St(`A ≈ ${A.toFixed(2)}°, which rounds to ${ans}°.`)], { q: `${f} A = ${val}, and A is acute. Find A to the nearest degree.`, tol: 0.51, expr: `Math.a${f}(${val})*180/Math.PI` });
}

// ───────── 11. solving right triangles and trig equations ─────────
const TRIG_EQ = [['sin x = 1/2', 'sin', '1/2', 0.5, [30, 150]], ['cos x = 1/2', 'cos', '1/2', 0.5, [60, 300]], ['tan x = 1', 'tan', '1', 1, [45, 225]], ['sin x = −1/2', 'sin', '−1/2', -0.5, [210, 330]], ['cos x = −√3/2', 'cos', '−√3/2', -Math.sqrt(3) / 2, [150, 210]], ['sin x = √2/2', 'sin', '√2/2', Math.SQRT1_2, [45, 135]], ['tan x = −1', 'tan', '−1', -1, [135, 315]], ['cos x = 0', 'cos', '0', 0, [90, 270]], ['sin x = √3/2', 'sin', '√3/2', Math.sqrt(3) / 2, [60, 120]], ['cos x = −1/2', 'cos', '−1/2', -0.5, [120, 240]], ['tan x = √3', 'tan', '√3', Math.sqrt(3), [60, 240]]];
// the unit-circle picture of f(x) = val: the line y = val (sin) or x = val (cos), and the solutions as arms
export const eqCircle = (f, valS, val, sols, lab = (d) => `${d}°`) => unitFig({ hline: f === 'sin' ? { y: val, label: `y = ${valS}` } : null, vline: f === 'cos' ? { x: val, label: `x = ${valS}` } : null, pts: (sols ?? []).map((d, i) => ({ deg: d, label: lab(d), t: i % 2 ? 'hl2' : 'hl' })) });
export const eqSteps = (f, valS, val, sols, unitS = (d) => `${d}°`) => {
  const ref = refOf(norm(sols[0]));
  return [
    f === 'tan' ? St('tan x = y ÷ x is the slope of the terminal arm. Arms on the same line through the centre have the same tan.', eqCircle(f, valS, val, [sols[0]], unitS))
      : St(`On the unit circle, ${f} x is the ${f === 'sin' ? 'y' : 'x'}-coordinate. Draw the line ${f === 'sin' ? 'y' : 'x'} = ${valS}.`, eqCircle(f, valS, val)),
    St(`It meets the circle in ${sols.length === 1 ? 'one point' : 'two points'}${val === 0 || sols.length === 1 ? '' : `, each with reference angle ${ref}°`}: ${sols.map(unitS).join(' and ')}.`, eqCircle(f, valS, val, sols, unitS)),
    St(`So x = ${sols.map(unitS).join(' or x = ')}.`),
  ];
};
function depFig({ a, h, d, hl }) {
  const dd = 10, hd = 10 * Math.tan(drawnDeg(a) * RAD), B = [0, 0], F = [dd, 0], T = [dd, hd];
  return polyPlus({ pts: [B, F, T], sides: [d, h, ''], right: [1], angles: [has(hl, 'boat') ? `${a}°` : '', '', ''], extra: [[0, hd]], hl: [].concat(has(hl, 'boat') ? [{ angle: 0 }] : [], has(hl, 'h') ? [{ side: 1 }] : [], has(hl, 'd') ? [{ side: 0 }] : []) },
    (m) => [line(m([0, hd]), m(T), 'aux'), angleArc(m(T), m([0, hd]), m(B), `${a}°`, 26, has(hl, 'top') ? 'hlline' : 'mark'), text(add(m(B), [0, 16]), 'boat', 'muted', { size: 12 })]);
}
export function trigsolve(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const th = r.int(26, 64), H = r.int(5, 30), opp = r.bool(), f = opp ? 'sin' : 'cos', val = opp ? Math.sin(th * RAD) : Math.cos(th * RAD), ans = dec(H * val, 1);
    const pic = (hl) => rtTri({ deg: th, hyp: `${H} cm`, opp: opp ? 'x' : '', adj: opp ? '' : 'x', ang: `${th}°`, hl });
    return num(ans, [St(`From the ${th}° angle, x is the ${opp ? 'opposite' : 'adjacent'} side and ${H} cm is the hypotenuse. ${f} links them: ${f} ${th}° = x ÷ ${H}.`, pic(['ang', opp ? 'opp' : 'adj', 'hyp'])), St(`x = ${H} × ${f} ${th}° = ${H} × ${dec(val, 4)}.`), St(`x ≈ ${ans} cm, to 1 decimal place.`)],
      { q: 'Find x in this right triangle, in cm. Round to 1 decimal place.', unit: 'x =', visual: pic(), tol: 0.051, expr: `${H}*Math.${f}(${th}*Math.PI/180)` });
  }
  if (v === 1 || v === 7) {
    const tanQ = v === 1;
    let o, a, h; if (tanQ) { a = r.int(3, 20); o = r.int(Math.ceil(a / 2), Math.min(2 * a, 24)); } else { h = r.int(8, 30); a = r.int(Math.ceil(h * 0.46), Math.floor(h * 0.88)); }
    const A = (tanQ ? Math.atan(o / a) : Math.acos(a / h)) / RAD, ans = Math.round(A);
    const pic = (hl) => rtTri({ deg: A, adj: `${a} cm`, opp: tanQ ? `${o} cm` : '', hyp: tanQ ? '' : `${h} cm`, ang: 'θ', hl });
    return num(ans, [St(tanQ ? `The sides you know are opposite (${o}) and adjacent (${a}) to θ, so use tan: tan θ = ${o}/${a}.` : `The sides you know are adjacent (${a}) to θ and the hypotenuse (${h}), so use cos: cos θ = ${a}/${h}.`, pic(tanQ ? ['opp', 'adj'] : ['adj', 'hyp'])), St(`θ = ${tanQ ? 'tan' : 'cos'}⁻¹(${tanQ ? `${o}/${a}` : `${a}/${h}`}) ≈ ${A.toFixed(2)}°.`, pic('ang')), St(`So θ ≈ ${ans}° to the nearest degree.`)],
      { q: 'Find the angle θ to the nearest degree.', unit: 'θ =', visual: pic(), tol: 0.51, expr: tanQ ? `Math.atan(${o}/${a})*180/Math.PI` : `Math.acos(${a}/${h})*180/Math.PI` });
  }
  if (v === 2) {
    const L = r.int(3, 9), th = r.int(55, 80), val = Math.sin(th * RAD), ans = dec(L * val, 1);
    const pic = (hl) => rtTri({ deg: th, hyp: `${L} m`, opp: 'h', ang: `${th}°`, hl });
    return num(ans, [St(`The ladder is the hypotenuse (${L} m). The height h up the wall is opposite the ${th}° angle, so use sin.`, pic(['hyp', 'opp', 'ang'])), St(`h = ${L} × sin ${th}° = ${L} × ${dec(val, 4)}.`), St(`h ≈ ${ans} m.`)],
      { q: `A ${L} m ladder leans against a wall, making a ${th}° angle with the ground. How high up the wall does it reach, in m? Round to 1 decimal place.${toScale(th) ? '' : NS}`, unit: 'h =', visual: pic(), tol: 0.051, expr: `${L}*Math.sin(${th}*Math.PI/180)` });
  }
  if (v === 3) {
    const d = r.int(20, 80), th = r.int(15, 60), val = Math.tan(th * RAD), ans = dec(d * val, 1);
    const pic = (hl) => rtTri({ deg: th, adj: `${d} m`, opp: 'h', ang: `${th}°`, hl });
    return num(ans, [St(`The tower's height h is opposite the angle of elevation; the ${d} m along the ground is adjacent. Use tan.`, pic(['opp', 'adj', 'ang'])), St(`h = ${d} × tan ${th}° = ${d} × ${dec(val, 4)}.`), St(`h ≈ ${ans} m.`)],
      { q: `From ${d} m away on level ground, the angle of elevation to the top of a tower is ${th}°. How tall is the tower, in m? Round to 1 decimal place.${toScale(th) ? '' : NS}`, unit: 'h =', visual: pic(), tol: 0.051, expr: `${d}*Math.tan(${th}*Math.PI/180)` });
  }
  if (v === 4) {
    const o = r.int(10, 60), th = r.int(26, 64), val = Math.sin(th * RAD), ans = dec(o / val, 1);
    const pic = (hl) => rtTri({ deg: th, opp: `${o} m`, hyp: 'L', ang: `${th}°`, hl });
    return num(ans, [St(`The string is the hypotenuse L. The kite's height (${o} m) is opposite the ${th}° angle, so sin ${th}° = ${o} ÷ L.`, pic(['opp', 'hyp', 'ang'])), St(`L = ${o} ÷ sin ${th}° = ${o} ÷ ${dec(val, 4)}.`), St(`L ≈ ${ans} m.`)],
      { q: `A kite flies ${o} m above the ground. Its string makes a ${th}° angle with the ground. How long is the string, in m? Round to 1 decimal place.`, unit: 'L =', visual: pic(), tol: 0.051, expr: `${o}/Math.sin(${th}*Math.PI/180)` });
  }
  if (v === 5) {
    const h = r.int(20, 120), a = r.int(26, 64), val = Math.tan(a * RAD), ans = dec(h / val, 1);
    return num(ans, [St(`The angle of depression is measured down from the horizontal at the top. The horizontal is parallel to the ground, so the angle at the boat is also ${a}° (alternate angles).`, depFig({ a, h: `${h} m`, d: 'd', hl: ['top', 'boat'] })), St(`At the boat, the cliff (${h} m) is opposite and d is adjacent: tan ${a}° = ${h} ÷ d.`, depFig({ a, h: `${h} m`, d: 'd', hl: ['boat', 'h', 'd'] })), St(`d = ${h} ÷ tan ${a}° = ${h} ÷ ${dec(val, 4)}.`), St(`d ≈ ${ans} m.`)],
      { q: `From the top of a ${h} m cliff, the angle of depression to a boat is ${a}°. How far is the boat from the foot of the cliff, in m? Round to 1 decimal place.`, unit: 'd =', visual: depFig({ a, h: `${h} m`, d: 'd' }), tol: 0.051, expr: `${h}/Math.tan(${a}*Math.PI/180)` });
  }
  const [eq, f, valS, val, sols] = r.pick(TRIG_EQ);
  return txt(`x = ${sols[0]}° or x = ${sols[1]}°`, eqSteps(f, valS, val, sols), { q: `Solve ${eq} for 0° ≤ x < 360°. Give both angles.`, numbers: sols });
}

// ───────── 11. Sine Law, Cosine Law and area ─────────
export function triglaws(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const A = r.int(30, 80), B = r.int(30, 80), a = r.int(5, 20), val = (a * Math.sin(B * RAD)) / Math.sin(A * RAD), ans = dec(val, 1);
    const pic = (hl) => triFig({ A, B, sides: { a: `${a} cm`, b: 'b' }, angs: { A: `${A}°`, B: `${B}°` }, hl });
    return num(ans, [St(`Side a is across from ∠A and side b is across from ∠B. The pair a = ${a} and ∠A = ${A}° is complete, so use the Sine Law.`, pic(['a', 'A'])), St(`b / sin ${B}° = ${a} / sin ${A}°.`, pic(['b', 'B'])), St(`b = ${a} × sin ${B}° ÷ sin ${A}° ≈ ${ans}.`), St(`So b ≈ ${ans} cm.`)],
      { q: 'Find side b, in cm. Round to 1 decimal place.', unit: 'b =', visual: pic(), tol: 0.051, expr: `${a}*Math.sin(${B}*Math.PI/180)/Math.sin(${A}*Math.PI/180)` });
  }
  if (v === 1 || v === 3) {
    const a = r.int(5, 20), b = r.int(Math.max(4, Math.ceil(a / 2.5)), Math.min(20, Math.floor(a * 2.5))), C = r.int(25, 130), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * RAD)), [A, B] = anglesOf(a, b, c);
    const pic = (hl, cl) => triFig({ A, B, sides: { a: `${a} cm`, b: `${b} cm`, c: cl }, angs: { C: `${C}°` }, hl });
    if (v === 1) {
      const ans = dec(c, 1);
      return num(ans, [St(`You know two sides and the angle between them (∠C = ${C}°), so use the Cosine Law for the side across from it.`, pic(['a', 'b', 'C'], 'c')), St(`c² = ${a}² + ${b}² − 2(${a})(${b}) cos ${C}° ≈ ${dec(c * c, 2)}.`, pic('c', 'c')), St(`c = √${dec(c * c, 2)} ≈ ${ans}.`), St(`So c ≈ ${ans} cm.`)],
        { q: 'Find side c, in cm. Round to 1 decimal place.', unit: 'c =', visual: pic(null, 'c'), tol: 0.051, expr: `Math.sqrt(${a}**2+${b}**2-2*${a}*${b}*Math.cos(${C}*Math.PI/180))` });
    }
    const val = 0.5 * a * b * Math.sin(C * RAD), ans = dec(val, 1);
    return num(ans, [St(`Two sides and the angle between them: Area = ½ab sin C.`, pic(['a', 'b', 'C'])), St(`Area = ½ × ${a} × ${b} × sin ${C}° = ${dec(0.5 * a * b, 2)} × ${dec(Math.sin(C * RAD), 4)}.`), St(`Area ≈ ${ans} cm².`)],
      { q: 'Find the area of this triangle, in cm². Round to 1 decimal place.', visual: pic(), tol: 0.051, expr: `0.5*${a}*${b}*Math.sin(${C}*Math.PI/180)` });
  }
  if (v === 2) {
    let a, b, c; do { a = r.int(4, 15); b = r.int(4, 15); c = r.int(Math.max(a, b) + 1, a + b - 1); } while (c <= Math.max(a, b) || c >= a + b);
    const [A, B, C] = anglesOf(a, b, c), cosC = (a * a + b * b - c * c) / (2 * a * b), ans = Math.round(C);
    const pic = (hl) => triFig({ A, B, sides: { a: `${a}`, b: `${b}`, c: `${c}` }, angs: { C: '?' }, hl });
    return num(ans, [St('You know all three sides, so use the Cosine Law, rearranged for the angle: cos C = (a² + b² − c²) ÷ 2ab.', pic(['c', 'C'])), St(`cos C = (${a * a} + ${b * b} − ${c * c}) ÷ ${2 * a * b} = ${frac(a * a + b * b - c * c, 2 * a * b)} ≈ ${dec(cosC, 4)}.`), St(`C = cos⁻¹(${dec(cosC, 4)}) ≈ ${C.toFixed(2)}°.`), St(`So ∠C ≈ ${ans}°.`)],
      { q: 'Find ∠C to the nearest degree.', unit: '∠C =', visual: pic(), tol: 0.51, expr: `Math.acos((${a}**2+${b}**2-${c}**2)/(2*${a}*${b}))*180/Math.PI` });
  }
  if (v === 4) {
    const A = r.int(30, 80), a = r.int(10, 25), b = r.int(4, a - 1), sB = (b * Math.sin(A * RAD)) / a, B = Math.asin(sB) / RAD, ans = Math.round(B);
    const pic = (hl) => triFig({ A, B, sides: { a: `${a}`, b: `${b}` }, angs: { A: `${A}°`, B: '?' }, hl });
    return num(ans, [St(`The pair a = ${a} and ∠A = ${A}° is complete. Use the Sine Law with b = ${b}: sin B / ${b} = sin ${A}° / ${a}.`, pic(['a', 'A', 'b'])), St(`sin B = ${b} × sin ${A}° ÷ ${a} ≈ ${dec(sB, 4)}. B is smaller than A because b < a, so B is acute.`, pic('B')), St(`B = sin⁻¹(${dec(sB, 4)}) ≈ ${B.toFixed(2)}°.`), St(`So ∠B ≈ ${ans}°.`)],
      { q: 'Find ∠B to the nearest degree.', unit: '∠B =', visual: pic(), tol: 0.51, expr: `Math.asin(${b}*Math.sin(${A}*Math.PI/180)/${a})*180/Math.PI` });
  }
  if (v === 5) {
    const A = r.int(35, 75), B = r.int(35, 75), C = 180 - A - B, k = r.int(10, 18) / Math.sin(Math.max(A, B, C) * RAD), sd = (d) => String(Math.round(k * Math.sin(d * RAD)));
    const kind = r.pick(['AAS', 'SSA', 'SAS', 'SSS']), law = kind === 'SAS' || kind === 'SSS' ? 'Cosine Law' : 'Sine Law';
    const set = { AAS: { sides: { a: sd(A), b: 'x' }, angs: { A: `${A}°`, B: `${B}°` } }, SSA: { sides: { a: sd(A), b: sd(B) }, angs: { A: `${A}°`, B: 'x' } }, SAS: { sides: { a: sd(A), b: sd(B), c: 'x' }, angs: { C: `${C}°` } }, SSS: { sides: { a: sd(A), b: sd(B), c: sd(C) }, angs: { C: 'x' } } }[kind];
    const why = { AAS: 'You know a side and the angle across from it (a and ∠A), plus ∠B across from x: a complete pair, so the Sine Law.', SSA: 'You know a and ∠A (a complete pair) and side b across from x: the Sine Law.', SAS: 'You know two sides and the angle between them, and x is across from that angle: the Cosine Law.', SSS: 'You know all three sides and want an angle: the Cosine Law.' }[kind];
    return mc(r, law, ['Sine Law', 'Cosine Law', 'Pythagorean theorem'], { q: 'Which law should you use to find x in this triangle (it has no right angle)?', visual: triFig({ A, B, ...set }),
      steps: [St('The Sine Law needs a complete pair: a side and the angle across from it. Otherwise use the Cosine Law.', triFig({ A, B, ...set, hl: kind === 'SAS' || kind === 'SSS' ? ['a', 'b', 'c', 'C'] : ['a', 'A'] })), St(why), St(`So use the ${law}.`)] });
  }
  if (v === 6) {
    const p = r.int(6, 20) * 10, q = r.int(6, 20) * 10, R = r.int(30, 120), c = Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(R * RAD)), [A, B] = anglesOf(q, p, c), ans = dec(c, 1);
    const pic = (hl) => triFig({ A, B, names: ['P', 'Q', 'R'], sides: { a: `${q} m`, b: `${p} m`, c: 'PQ' }, angs: { C: `${R}°` }, hl });
    return num(ans, [St(`PQ is across from the ${R}° angle at R, between the sides ${p} m and ${q} m: use the Cosine Law.`, pic(['a', 'b', 'C'])), St(`PQ² = ${p}² + ${q}² − 2(${p})(${q}) cos ${R}° ≈ ${dec(c * c, 1)}.`, pic('c')), St(`PQ = √${dec(c * c, 1)} ≈ ${ans}.`), St(`So the lake is about ${ans} m across.`)],
      { q: `To measure across a lake from P to Q, a surveyor stands at R. RP = ${p} m, RQ = ${q} m and ∠PRQ = ${R}°. How far is it from P to Q, in m? Round to 1 decimal place.`, unit: 'PQ =', visual: pic(), tol: 0.051, expr: `Math.sqrt(${p}**2+${q}**2-2*${p}*${q}*Math.cos(${R}*Math.PI/180))` });
  }
  const A = r.int(30, 75), B = r.int(30, 75), C = 180 - A - B, c = r.int(6, 20), val = (c * Math.sin(A * RAD)) / Math.sin(C * RAD), ans = dec(val, 1);
  const pic = (hl, cl) => triFig({ A, B, sides: { c: `${c} cm`, a: 'a' }, angs: { A: `${A}°`, B: `${B}°`, C: cl }, hl });
  return num(ans, [St(`The angles add to 180°, so ∠C = 180° − ${A}° − ${B}° = ${C}°. Now c and ∠C are a complete pair.`, pic(['c', 'C'], `${C}°`)), St(`Sine Law: a / sin ${A}° = ${c} / sin ${C}°.`, pic(['a', 'A'], `${C}°`)), St(`a = ${c} × sin ${A}° ÷ sin ${C}° ≈ ${ans}.`), St(`So a ≈ ${ans} cm.`)],
    { q: 'Find side a, in cm. Round to 1 decimal place.', unit: 'a =', visual: pic(null, ''), tol: 0.051, expr: `${c}*Math.sin(${A}*Math.PI/180)/Math.sin(${C}*Math.PI/180)` });
}

// ───────── 11. polygons and quadrilaterals ─────────
export const PNAME = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
export const QUADS = {
  Square: { pts: [[0, 0], [5, 0], [5, 5], [0, 5]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], say: 'four equal sides (one tick on each) and four right angles' },
  Rectangle: { pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], say: 'four right angles, with opposite sides equal but not all four equal' },
  Rhombus: { pts: [[0, 0], [5, 0], [8, 4], [3, 4]], ticks: [1, 1, 1, 1], say: 'four equal sides but no right angles' },
  Parallelogram: { pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], par: [1, 2, 1, 2], ticks: [1, 2, 1, 2], say: 'two pairs of parallel sides (arrows), opposite sides equal, and no right angles' },
  Trapezoid: { pts: [[0, 0], [9, 0], [6.5, 4], [2, 4]], par: [1, 0, 1, 0], say: 'exactly one pair of parallel sides (the arrows)' },
  Kite: { pts: [[0, 3], [3, 0], [9, 3], [3, 6]], ticks: [1, 2, 2, 1], say: 'two pairs of equal sides next to each other, and no parallel sides' },
};
const wobble = (n, s = 1) => G.regular(n).map(([px, py], i) => [px * (1 + 0.16 * s * Math.sin(i * 2.1 + n)), py * (1 + 0.13 * s * Math.cos(i * 1.7))]);
export function polygons(r) {
  const v = r.int(0, 9);
  if (v === 0) {
    const n = r.pick([5, 6, 7, 8, 9, 10, 12]), right = PNAME[n], pts = wobble(n, r.bool() ? 1 : 0);
    return mc(r, right, r.shuffle(Object.values(PNAME).filter((x) => x !== right && x !== 'triangle')).slice(0, 3), { q: 'What is this polygon called?', visual: G.polygonFig({ pts }),
      steps: [St(`Count the sides: ${n}.`, G.polygonFig({ pts, sides: pts.map((_, i) => `${i + 1}`) })), St(`A polygon with ${n} sides is ${art(right)} ${right}.`)] });
  }
  if (v === 1) {
    const n = r.pick([5, 6, 7, 8, 9, 10, 12]), sum = (n - 2) * 180, cut = G.triangulated(G.regular(n));
    return num(sum, [St(`Draw every diagonal from one corner. They cut the ${PNAME[n]} into ${n} − 2 = ${n - 2} triangles.`, cut), St(`Each triangle has 180°: ${n - 2} × 180° = ${sum}°.`), St(`So the interior angles add to ${sum}°.`)], { q: `What do the interior angles of ${art(PNAME[n])} ${PNAME[n]} (${n} sides) add up to, in degrees?`, visual: G.polygonFig({ pts: wobble(n) }), expr: `(${n}-2)*180` });
  }
  if (v === 2) {
    const n = r.pick([5, 6, 8, 9, 10, 12]), sum = (n - 2) * 180, each = sum / n, pic = (lab) => G.polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), angles: [lab] });
    return num(each, [St(`The angles add to (${n} − 2) × 180° = ${sum}°.`, G.triangulated(G.regular(n))), St(`A regular ${PNAME[n]} has ${n} equal angles: ${sum}° ÷ ${n} = ${each}°.`, pic(`${each}°`)), St(`So each interior angle is ${each}°.`)], { q: `This is a regular ${PNAME[n]}. What is each interior angle, in degrees?`, visual: pic('?'), expr: `(${n}-2)*180/${n}` });
  }
  if (v === 3) {
    const n = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), e = 360 / n, i = 180 - e;
    return num(n, [St(`Interior and exterior angles make a straight line: the exterior angle is 180° − ${i}° = ${e}°.`, G.anglePairFig({ kind: 'supp', deg: Math.min(80, e), labels: [`${e}°`, `${i}°`] })), St(`The exterior angles of any polygon add to 360°: n = 360 ÷ ${e} = ${n}.`), St(`So the polygon has ${n} sides.`)], { q: `Each interior angle of a regular polygon is ${i}°. How many sides does it have?`, expr: `360/(180-${i})` });
  }
  if (v === 4) {
    const n = r.pick([5, 6, 8, 9, 10, 12]), e = 360 / n, pic = (hl) => G.polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), ext: 1, extLabel: '?', hl });
    return num(e, [St('An exterior angle is between one side and the next side extended. Walking once round the polygon you turn through every exterior angle: 360° in all.', pic('ext')), St(`${n} equal exterior angles: 360° ÷ ${n} = ${e}°.`), St(`So each exterior angle is ${e}°.`)], { q: `This regular ${PNAME[n]} has one side extended. What is the exterior angle marked ?, in degrees?`, visual: pic(), expr: `360/${n}` });
  }
  if (v === 5) {
    const right = r.pick(Object.keys(QUADS)), Q = QUADS[right];
    return mc(r, right, r.shuffle(Object.keys(QUADS).filter((x) => x !== right)).slice(0, 3), { q: 'Read the marks on the sides and corners. What is the most exact name for this quadrilateral?', visual: G.polygonFig(Q),
      steps: [St('Ticks show equal sides, arrows show parallel sides, and a small square shows a right angle.', G.polygonFig(Q)), St(`This one has ${Q.say}.`), St(`So it is ${art(right)} ${right.toLowerCase()}.`)] });
  }
  if (v === 6 || v === 7) {
    const a = r.pick([r.int(8, 17) * 5, r.int(19, 28) * 5]), D = [3.4 * Math.cos(a * RAD), 3.4 * Math.sin(a * RAD)], pts = [[0, 0], [6, 0], [6 + D[0], D[1]], D], names = ['A', 'B', 'C', 'D'];
    if (v === 6) {
      const opp = r.bool(), val = opp ? a : 180 - a, k = opp ? 2 : 1;
      const pic = (lab, hl) => G.polygonFig({ pts, names, par: [1, 2, 1, 2], angles: [`${a}°`, k === 1 ? lab : '', k === 2 ? lab : '', ''], hl });
      return num(val, [St(opp ? 'Opposite angles of a parallelogram are equal.' : 'Next-door angles of a parallelogram are same-side interior angles between parallel sides, so they add to 180°.', pic('?', [{ angle: 0 }, { angle: k }])), St(opp ? `∠C = ∠A = ${val}°.` : `∠B = 180° − ${a}° = ${val}°.`, pic(`${val}°`, [{ angle: k }])), St(`So ∠${names[k]} = ${val}°.`)],
        { q: `ABCD is a parallelogram. What is ∠${names[k]}, in degrees?`, unit: `∠${names[k]} =`, visual: pic('?'), expr: opp ? `${a}` : `180-${a}` });
    }
    const d = r.int(4, 20) * 2, cen = [(6 + D[0]) / 2, D[1] / 2];
    const pic = (hl) => polyPlus({ pts, names, par: [1, 2, 1, 2], diag: [[0, 2, hl ? 'aux' : 'aux'], [1, 3, 'aux']] }, (m) => [text(add(m(cen), [0, -14]), 'E', 'muted', { size: 13 }), hl ? line(m([0, 0]), m(cen), 'hlline') : null, hl ? text(add(mid(m([0, 0]), m(cen)), [-4, -12]), '?', 'hl') : null]);
    return num(d / 2, [St('The diagonals of a parallelogram bisect each other: E is the midpoint of AC.', pic(true)), St(`AE = AC ÷ 2 = ${d} ÷ 2 = ${d / 2}.`), St(`So AE = ${d / 2} cm.`)], { q: `In parallelogram ABCD the diagonals meet at E. Diagonal AC is ${d} cm long. How long is AE, in cm?`, unit: 'AE =', visual: pic(false), expr: `${d}/2` });
  }
  if (v === 8) {
    const n = r.pick([4, 5, 5, 6]), sum = (n - 2) * 180;
    let angs, x, guard = 0;
    do { angs = Array.from({ length: n - 1 }, () => r.int(14, 34) * 5); x = sum - angs.reduce((p, q) => p + q, 0); } while ((x < 60 || x > 175) && guard++ < 200);
    if (x < 60 || x > 175) { angs = n === 4 ? [80, 95, 110] : n === 5 ? [100, 110, 115, 120] : [110, 115, 120, 125, 130]; x = sum - angs.reduce((p, q) => p + q, 0); }
    const k = r.int(0, n - 1), labels = []; let j = 0;
    for (let i = 0; i < n; i++) labels.push(i === k ? 'x' : `${angs[j++]}°`);
    const pts = wobble(n), known = angs.reduce((p, q) => p + q, 0);
    return num(x, [St(`A ${PNAME[n]} has ${n} sides, so its angles add to (${n} − 2) × 180° = ${sum}°.`, G.triangulated(pts)), St(`Add the angles you know: ${angs.join(' + ')} = ${known}°.`, G.polygonFig({ pts, angles: labels, hl: labels.map((l, i) => (l === 'x' ? null : { angle: i })).filter(Boolean) })), St(`x = ${sum} − ${known} = ${x}.`), St(`So x = ${x}°.`)],
      { q: `Find the angle x in this ${PNAME[n]}.${NS}`, unit: 'x =', visual: G.polygonFig({ pts, angles: labels }), expr: `${sum}-${known}` });
  }
  const n = r.pick([5, 6, 7, 8]), concave = r.bool(), k = r.int(0, n - 1), pts = G.regular(n).map((p, i) => (concave && i === k ? [p[0] * 0.22, p[1] * 0.22] : p));
  const right = concave ? 'Concave' : 'Convex';
  return mc(r, right, ['Convex', 'Concave'], { q: 'Is this polygon convex or concave?', visual: G.polygonFig({ pts }),
    steps: [St('A convex polygon has every interior angle less than 180°: no corner points inward. A concave polygon has a dent, an interior angle more than 180°.', G.polygonFig({ pts, hl: concave ? [{ side: (k + n - 1) % n }, { side: k }] : [] })), St(concave ? 'One corner points inward (the highlighted dent), so the polygon is concave.' : 'Every corner points outward, so the polygon is convex.')] });
}

// ───────── 11. area and perimeter ─────────
export function area2d(r) {
  const v = r.int(0, 8), u = r.pick(['cm', 'm']);
  if (v === 0) {
    const b = r.int(4, 20), h = r.int(3, 15), A = (b * h) / 2, [B, H, ok] = dims(b, h), apex = B * (0.2 + r.next() * 0.6);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [apex, H]], sides: [`${b} ${u}`, '', ''], base: 0, height: { from: 2, side: 0, label: `${h} ${u}` }, hl });
    return num(dec(A), [St('Two copies of a triangle make a parallelogram, so A = base × height ÷ 2. The height is the dashed line at right angles to the base.', pic(['base', 'height'])), St(`A = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = ${dec(A)}.`), St(`So the area is ${dec(A)} ${u}².`)], { q: `What is the area of this triangle, in ${u}²?${ok ? '' : NS}`, visual: pic(), expr: `${b}*${h}/2` });
  }
  if (v === 1) {
    const b = r.int(8, 20), a = r.int(3, b - 2), h = r.int(3, 12), A = ((a + b) * h) / 2, [B, H, ok] = dims(b, h), Lx = ((b - a) / b) * B * r.pick([0.3, 0.5, 0.7]);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [Lx + (a / b) * B, H], [Lx, H]], sides: [`${b} ${u}`, '', `${a} ${u}`, ''], height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 0, 1, 0], hl });
    return num(dec(A), [St(`Add the parallel sides: ${a} + ${b} = ${a + b}.`, pic([{ side: 0 }, { side: 2 }])), St(`Multiply by the height and halve: A = (a + b) × h ÷ 2 = ${a + b} × ${h} ÷ 2 = ${dec(A)}.`, pic(['height'])), St(`So the area is ${dec(A)} ${u}².`)], { q: `What is the area of this trapezoid, in ${u}²?${ok ? '' : NS}`, visual: pic(), expr: `(${a}+${b})*${h}/2` });
  }
  if (v === 2) {
    const b = r.int(5, 18), h = r.int(3, 12), off = r.int(2, 6), s = Math.round(Math.hypot(off, h) * 10) / 10, [B, H, ok] = dims(b, h), O = (off / b) * B;
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [B + O, H], [O, H]], sides: [`${b} ${u}`, `${dec(s)} ${u}`, '', ''], base: 0, height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 2, 1, 2], hl });
    return num(b * h, [St('Cut a triangle off one end and slide it to the other: the parallelogram becomes a rectangle, so A = base × height.', pic(['base', 'height'])), St(`Use the height at right angles to the base (${h}), not the slanted side (${dec(s)}): A = ${b} × ${h} = ${b * h}.`), St(`So the area is ${b * h} ${u}².`)], { q: `What is the area of this parallelogram, in ${u}²?${ok ? '' : NS}`, visual: pic(), expr: `${b}*${h}` });
  }
  if (v === 3) {
    const rr = r.int(2, 15), useD = r.bool(), area = r.bool(), val = area ? Math.PI * rr * rr : 2 * Math.PI * rr, ans = dec(val, 1);
    const pic = (hl) => G.circleFig({ show: useD ? 'diameter' : 'radius', r: `${rr} ${u}`, d: `${2 * rr} ${u}`, hl });
    return num(ans, [St(useD ? `The radius is half the diameter: ${2 * rr} ÷ 2 = ${rr} ${u}.` : `The radius goes from the centre to the edge: ${rr} ${u}.`, pic(useD ? 'diameter' : 'radius')), St(area ? `A = πr² = π × ${rr}² = ${rr * rr}π ≈ ${ans}.` : `C = 2πr = 2 × π × ${rr} = ${2 * rr}π ≈ ${ans}.`, pic(area ? 'fill' : null)), St(`So the ${area ? `area is about ${ans} ${u}²` : `circumference is about ${ans} ${u}`}.`)],
      { q: `Find the ${area ? `area of this circle, in ${u}²` : `circumference of this circle, in ${u}`}. Round to 1 decimal place.`, visual: pic(), tol: 0.051, expr: area ? `Math.PI*${rr}**2` : `2*Math.PI*${rr}` });
  }
  if (v === 4) {
    const x1 = r.int(-5, 1), y1 = r.int(-5, 1), x2 = x1 + r.int(2, 6), y2 = y1 + r.int(2, 6), w = x2 - x1, h = y2 - y1, tri = r.bool(), ax = r.int(x1, x2);
    const P = tri ? [[x1, y1], [x2, y1], [ax, y2]] : [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], wnd = window(P, 1);
    const pic = (hl) => gridFig({ ...wnd, draw: (m) => [poly(P.map(m), 'hl2'), hl ? [line(m([x1, y1]), m([x2, y1]), 'hlline'), tri ? line(m([ax, y1]), m([ax, y2]), 'hlline') : line(m([x2, y1]), m([x2, y2]), 'hlline'), text(add(m([(x1 + x2) / 2, y1]), [0, 12]), `${w}`, 'hl', { size: 13 }), text(add(m([tri ? ax : x2, (y1 + y2) / 2]), [12, 0]), `${h}`, 'hl', { size: 13 })] : null, P.map((p) => dot(m(p), 'hl'))] });
    const per = !tri && r.bool(), val = tri ? w * h / 2 : per ? 2 * (w + h) : w * h;
    const vs = P.map(([x, y]) => `(${neg(x)}, ${neg(y)})`).join(', ');
    return num(dec(val), [St(`Count squares: the base runs from x = ${neg(x1)} to x = ${neg(x2)}, which is ${w} units. The ${tri ? 'height' : 'side'} runs from y = ${neg(y1)} to y = ${neg(y2)}, which is ${h} units.`, pic(true)), St(tri ? `Area = ${w} × ${h} ÷ 2 = ${dec(val)}.` : per ? `Perimeter = 2 × (${w} + ${h}) = ${val}.` : `Area = ${w} × ${h} = ${val}.`), St(`So the ${per ? 'perimeter' : 'area'} is ${dec(val)} ${per ? 'units' : 'square units'}.`)],
      { q: `A ${tri ? 'triangle' : 'rectangle'} has vertices ${vs}. What is its ${per ? 'perimeter' : 'area'}?`, visual: pic(false), expr: tri ? `${w}*${h}/2` : per ? `2*(${w}+${h})` : `${w}*${h}` });
  }
  if (v === 5) {
    const a = r.int(6, 12), b = r.int(5, 10), c = r.int(2, Math.min(a, b) - 3), per = r.bool(), val = per ? 2 * (a + b) : a * b - c * c;
    const pts = [[0, 0], [a, 0], [a, b - c], [a - c, b - c], [a - c, b], [0, b]], base = { pts, sides: [`${a} ${u}`, '', `${c} ${u}`, `${c} ${u}`, '', `${b} ${u}`], right: [0, 1, 2, 4, 5] };
    if (per) return num(val, [St('Push the two inner edges of the notch back out: they make up the missing corner exactly, so the perimeter is the same as the whole rectangle.', G.polygonFig({ ...base, cuts: [[[a - c, b], [a, b]], [[a, b - c], [a, b]]] })), St(`Perimeter = 2 × (${a} + ${b}) = ${val}.`), St(`So the perimeter is ${val} ${u}.`)], { q: `A ${c} ${u} square has been cut from one corner of this ${a} ${u} by ${b} ${u} rectangle. What is the perimeter of the shape, in ${u}?`, visual: G.polygonFig(base), expr: `2*(${a}+${b})` });
    return num(val, [St(`The whole rectangle: ${a} × ${b} = ${a * b} ${u}².`, G.polygonFig({ ...base, cuts: [[[a - c, b], [a, b]], [[a, b - c], [a, b]]], regions: [{ pts: [[0, 0], [a, 0], [a, b], [0, b]], t: 'hl' }] })), St(`Take away the ${c} × ${c} = ${c * c} ${u}² square: ${a * b} − ${c * c} = ${val}.`, G.polygonFig({ ...base, regions: [{ pts: [[a - c, b - c], [a, b - c], [a, b], [a - c, b]], t: 'hl2' }] })), St(`So the area is ${val} ${u}².`)],
      { q: `A ${c} ${u} square has been cut from one corner of this ${a} ${u} by ${b} ${u} rectangle. What is the area of the shape, in ${u}²?`, visual: G.polygonFig(base), expr: `${a}*${b}-${c}**2` });
  }
  if (v === 6) {
    const rr = r.int(2, 10), cA = Math.PI * rr * rr, val = 4 * rr * rr - cA, ans = dec(val, 1);
    return num(ans, [St(`The circle fits exactly, so the square's side is the diameter, ${2 * rr}. Square: ${2 * rr}² = ${4 * rr * rr} ${u}².`, G.circleFig({ square: true, shade: 'outside', show: 'diameter', d: `${2 * rr} ${u}` })), St(`Circle: π × ${rr}² ≈ ${dec(cA, 2)} ${u}².`, G.circleFig({ square: true, show: 'radius', r: `${rr}`, hl: ['fill', 'radius'] })), St(`Shaded = ${4 * rr * rr} − ${dec(cA, 2)} ≈ ${ans}.`), St(`So the shaded area is about ${ans} ${u}².`)],
      { q: `A circle of radius ${rr} ${u} fits exactly inside a square. Find the shaded area, in ${u}². Round to 1 decimal place.`, visual: G.circleFig({ square: true, shade: 'outside', show: 'radius', r: `${rr} ${u}` }), tol: 0.051, expr: `4*${rr}**2-Math.PI*${rr}**2` });
  }
  if (v === 7) {
    const k = r.pick([2, 3]), s = r.int(2, 6), A = r.int(2, 30), per = r.bool(), val = per ? A * k : A * k * k, shape = [[0, 0], [4, 0], [1.2, 2.6]];
    const pair = beside([scaled({ pts: shape, sides: [`${s} ${u}`, '', ''], notes: [{ at: [1.75, 0.9], s: per ? `P = ${A}` : `A = ${A}`, t: 'hl2' }] }, 150 / (4 * k), 30), scaled({ pts: shape.map(([x, y]) => [x * k, y * k]), sides: [`${s * k} ${u}`, '', ''], notes: [{ at: [1.75 * k, 0.9 * k], s: '?', t: 'hl' }] }, 150 / (4 * k), 30)], 4);
    return num(val, [St(`Matching sides: ${s * k} ÷ ${s} = ${k}. The scale factor is ${k}.`, pair), St(per ? `Perimeters are lengths, so they scale by ${k}: ${A} × ${k} = ${val}.` : `Areas scale by the square of the scale factor: ${k}² = ${k * k}. ${A} × ${k * k} = ${val}.`), St(`So the larger ${per ? 'perimeter' : 'area'} is ${val} ${per ? u : u + '²'}.`)],
      { q: `These two triangles are similar. The smaller one has ${per ? `perimeter ${A} ${u}` : `area ${A} ${u}²`}. What is the ${per ? `perimeter of the larger one, in ${u}` : `area of the larger one, in ${u}²`}?`, visual: pair, expr: per ? `${A}*${s * k}/${s}` : `${A}*(${s * k}/${s})**2` });
  }
  const rr = r.int(3, 12), d = r.pick([30, 45, 60, 72, 90, 120, 135, 150, 210, 240, 270]), val = (d / 360) * Math.PI * rr * rr, ans = dec(val, 1);
  return num(ans, [St(`The sector is ${d}/360 = ${frac(d, 360)} of the whole circle.`, sectorFig({ deg: d, r: `${rr} ${u}`, th: `${d}°`, hl: 'angle' })), St(`Whole circle: π × ${rr}² = ${rr * rr}π. Sector: ${frac(d, 360)} × ${rr * rr}π ≈ ${ans}.`, sectorFig({ deg: d, r: `${rr} ${u}`, th: `${d}°`, hl: 'fill' })), St(`So the sector's area is about ${ans} ${u}².`)],
    { q: `Find the area of the shaded sector, in ${u}². Round to 1 decimal place.`, visual: sectorFig({ deg: d, r: `${rr} ${u}`, th: `${d}°` }), tol: 0.051, expr: `${d}/360*Math.PI*${rr}**2` });
}

// ───────── 11. solids: parts, nets, cross-sections ─────────
const BASES = { 3: 'triangular', 4: 'rectangular', 5: 'pentagonal', 6: 'hexagonal', 8: 'octagonal' };
const solidPic = (n, prism, hl) => (prism ? (n === 4 ? G.boxFig({ l: 6, w: 3, h: 4, hl }) : G.prismFig({ base: G.regular(n, 3), depth: 4, hl })) : G.pyramidFig({ a: 5, h: 6, tri: n === 3, hl }));
export function solids(r) {
  const v = r.int(0, 6), pickWrong = (right, pool) => r.shuffle(pool.filter((x) => x !== right)).slice(0, 3);
  if (v === 0) {
    const prism = r.bool(), n = prism ? r.pick([3, 4, 5, 6, 8]) : r.pick([3, 4]), ask = r.int(0, 2), F = prism ? n + 2 : n + 1, E = prism ? 3 * n : 2 * n, V = prism ? 2 * n : n + 1, val = [F, E, V][ask], what = ['faces', 'edges', 'vertices'][ask];
    const nm = `${!prism && n === 4 ? "square" : BASES[n]} ${prism ? "prism" : "pyramid"}`, how = prism
      ? [`2 bases + ${n} rectangles = ${F} faces.`, `${n} edges on each base + ${n} joining them = ${E} edges.`, `${n} corners on each base: 2 × ${n} = ${V} vertices.`][ask]
      : [`1 base + ${n} triangles = ${F} faces.`, `${n} edges round the base + ${n} up to the apex = ${E} edges.`, `${n} corners on the base + the apex = ${V} vertices.`][ask];
    return num(val, [St(prism ? `A prism has two matching ${PNAME[n] ?? 'polygon'} bases joined by rectangles. Dashed edges are hidden at the back.` : `A pyramid has one ${PNAME[n]} base and triangles meeting at the apex.`, solidPic(n, prism, prism ? 'base' : 'base')), St(how), St(`So it has ${val} ${what}.`)],
      { q: `This is ${art(nm)} ${nm}. How many ${what} does it have?`, visual: solidPic(n, prism), expr: `${val}` });
  }
  if (v === 1) {
    const n = r.pick([3, 4, 5, 6, 8]), prism = r.bool(), F = prism ? n + 2 : n + 1, E = prism ? 3 * n : 2 * n, V = prism ? 2 * n : n + 1, ask = r.int(0, 2), val = [F, E, V][ask];
    const known = [['faces', F], ['edges', E], ['vertices', V]].filter((_, i) => i !== ask).map(([w, x]) => `${x} ${w}`).join(' and ');
    return num(val, [St('Euler’s formula for any solid with flat faces: F + V − E = 2. A cube checks it: 6 + 8 − 12 = 2.', G.boxFig({ l: 4, w: 4, h: 4 })), St(ask === 0 ? `F = 2 − V + E = 2 − ${V} + ${E} = ${val}.` : ask === 1 ? `E = F + V − 2 = ${F} + ${V} − 2 = ${val}.` : `V = 2 − F + E = 2 − ${F} + ${E} = ${val}.`), St(`So it has ${val} ${['faces', 'edges', 'vertices'][ask]}.`)],
      { q: `A polyhedron has ${known}. How many ${['faces', 'edges', 'vertices'][ask]} does it have?`, expr: ask === 1 ? `${F}+${V}-2` : ask === 0 ? `2-${V}+${E}` : `2-${F}+${E}` });
  }
  if (v === 2) {
    const [solid, cut, right, say] = r.pick([['box', 'across', 'Rectangle', 'A box cut parallel to its base'], ['cube', 'down', 'Square', 'A cube cut parallel to a face'], ['cylinder', 'across', 'Circle', 'A cylinder cut parallel to its base'], ['cylinder', 'down', 'Rectangle', 'A cylinder cut straight down through its axis'], ['cone', 'across', 'Circle', 'A cone cut parallel to its base'], ['cone', 'down', 'Triangle', 'A cone cut straight down through its apex'], ['pyramid', 'across', 'Square', 'A square pyramid cut parallel to its base'], ['pyramid', 'down', 'Triangle', 'A square pyramid cut down through its apex'], ['sphere', 'across', 'Circle', 'A sphere cut by any flat plane']]);
    return mc(r, right, pickWrong(right, ['Circle', 'Rectangle', 'Triangle', 'Square']), { q: 'The yellow plane slices through the solid. What shape is the cross-section?', visual: G.sliceFig({ solid, cut }), steps: [St('The cross-section is the flat face the cut leaves behind: trace the edge of the yellow shape.', G.sliceFig({ solid, cut })), St(`${say}: the cut face is ${art(right)} ${right.toLowerCase()}.`)] });
  }
  if (v === 3) {
    const k = r.int(0, 2), right = ['Cylinder', 'Cone', 'Sphere'][k];
    const shape = k === 0 ? { pts: [[0, 0], [3, 0], [3, 5], [0, 5]], right: [0, 1, 2, 3], cuts: [[[0, -1], [0, 6]]] } : k === 1 ? { pts: [[0, 0], [3, 0], [0, 5]], right: [0], cuts: [[[0, -1], [0, 6]]] } : { pts: Array.from({ length: 19 }, (_, i) => [3 * Math.sin((i * Math.PI) / 18), 3 * Math.cos((i * Math.PI) / 18)]), cuts: [[[0, -4], [0, 4]]] };
    const solidF = [G.cylinderFig({ r: 3, h: 5 }), G.coneFig({ r: 3, h: 5 }), G.sphereFig({})][k];
    return mc(r, right, pickWrong(right, ['Cylinder', 'Cone', 'Sphere', 'Cube']), { q: `This ${['rectangle', 'right triangle', 'semicircle'][k]} spins all the way round the dashed line. What solid does it sweep out?`, visual: G.polygonFig(shape),
      steps: [St(`Each point of the shape traces a circle round the dashed line, so the ${['far side makes a curved wall of the same height', 'slanted side makes a curved surface coming to a point', 'curved edge makes a round ball'][k]}.`, G.polygonFig(shape)), St(`It sweeps out a ${right.toLowerCase()}.`, solidF)] });
  }
  if (v === 4) {
    const opts = [['Cube', G.netFig({ cells: r.pick(G.CUBE_NETS) }), '6 equal squares'], ['Cylinder', G.cylinderNet(), '2 circles and a rectangle'], ['Square pyramid', G.pyramidNet(), '1 square and 4 triangles'], ['Triangular prism', G.triPrismNet(), '2 triangles and 3 rectangles'], ['Cone', G.coneNet(), 'a circle and a sector of a larger circle'], ['Rectangular prism', G.boxNet({ l: 6, w: 3, h: 4 }), '3 pairs of matching rectangles']];
    const [right, net, say] = r.pick(opts);
    return mc(r, right, pickWrong(right, opts.map((o) => o[0])), { q: 'What solid does this net fold into?', visual: net, steps: [St(`The net is made of ${say}.`, net), St(`Folded up, those are the faces of ${art(right)} ${right.toLowerCase()}.`)] });
  }
  if (v === 5) {
    const good = r.pick(G.CUBE_NETS), bad = r.shuffle(G.NOT_CUBE_NETS).slice(0, 3), order = r.shuffle([good, ...bad]), L4 = ['A', 'B', 'C', 'D'], right = L4[order.indexOf(good)];
    const pics = { type: 'figs', figs: order.map((c) => G.netFig({ cells: c })), captions: L4 };
    return mc(r, right, L4, { q: 'Which net folds into a cube?', visual: pics, steps: [St('Pick one square as the bottom and fold the others up. A cube net needs every square to land on a different face: no two may overlap, and no more than 4 may sit in a row.', pics), St(`Only net ${right} folds up with no overlap and no gap.`, G.netFig({ cells: good, hl: [0] }))] });
  }
  const opts = [['Cylinder', G.cylinderFig({ r: 3, h: 6 })], ['Cone', G.coneFig({ r: 3, h: 6 })], ['Sphere', G.sphereFig({})], ['Square pyramid', G.pyramidFig({ a: 5, h: 6 })], ['Triangular prism', G.prismFig({ base: [[0, 0], [5, 0], [2, 4]], depth: 6 })], ['Hexagonal prism', G.prismFig({ base: G.regular(6, 3), depth: 5 })], ['Triangular pyramid', G.pyramidFig({ a: 5, h: 6, tri: true })]];
  const [right, pic] = r.pick(opts);
  const say = { Cylinder: 'two circular bases joined by a curved surface', Cone: 'one circular base and a curved surface up to a point', Sphere: 'one curved surface, every point the same distance from the centre', 'Square pyramid': 'a square base and four triangles meeting at a point', 'Triangular prism': 'two triangle bases joined by three rectangles', 'Hexagonal prism': 'two hexagon bases joined by six rectangles', 'Triangular pyramid': 'a triangle base and three triangles meeting at a point' }[right];
  return mc(r, right, pickWrong(right, opts.map((o) => o[0])), { q: 'What is the name of this solid?', visual: pic, steps: [St(`Look at the bases and the sides: it has ${say}.`, pic), St(`So it is ${art(right)} ${right.toLowerCase()}.`)] });
}

// ───────── 11. surface area and volume ─────────
export function volume(r) {
  const v = r.int(0, 10), u = 'cm';
  if (v === 0) {
    const a = r.int(2, 12), b = r.int(2, 9), h = r.int(2, 15), L = [`${a} cm`, `${b} cm`, `${h} cm`], pic = (hl) => G.boxFig({ l: a, w: b, h, labels: L, hl });
    return num(a * b * h, [St(`The base is a ${a} × ${b} rectangle: ${a * b} cm². That is one layer.`, pic(['base', 'length', 'width'])), St(`Stack ${h} layers: V = ${a * b} × ${h} = ${a * b * h}.`, pic(['height'])), St(`So the volume is ${a * b * h} cm³.`)], { q: 'Find the volume of this rectangular prism, in cm³.', visual: pic(), expr: `${a}*${b}*${h}` });
  }
  if (v >= 1 && v <= 4) {
    const a = r.int(2, 12), h = r.int(3, 15);
    if (v === 1) { const B = Math.PI * a * a, ans = dec(B * h, 1), pic = (hl) => G.cylinderFig({ r: a, h, labels: [`${a} cm`, `${h} cm`], hl });
      return num(ans, [St(`The base is a circle: π × ${a}² = ${a * a}π cm².`, pic(['base', 'radius'])), St(`V = base × height = ${a * a}π × ${h} = ${a * a * h}π ≈ ${ans}.`, pic(['height'])), St(`So the volume is about ${ans} cm³.`)], { q: 'Find the volume of this cylinder, in cm³. Round to 1 decimal place.', visual: pic(), tol: 0.051, expr: `Math.PI*${a}**2*${h}` }); }
    if (v === 2) { const ans = dec((Math.PI * a * a * h) / 3, 1), pic = (hl) => G.coneFig({ r: a, h, labels: [`${a} cm`, `${h} cm`, ''], hl });
      return num(ans, [St(`A cone holds one third of the cylinder around it: V = ⅓ × base × height. The base is π × ${a}² = ${a * a}π.`, pic(['base', 'radius'])), St(`V = ⅓ × ${a * a}π × ${h} = ${dec((a * a * h) / 3, 3)}π ≈ ${ans}.`, pic(['height'])), St(`So the volume is about ${ans} cm³.`)], { q: 'Find the volume of this cone, in cm³. Round to 1 decimal place.', visual: pic(), tol: 0.051, expr: `Math.PI*${a}**2*${h}/3` }); }
    if (v === 3) { const val = (a * a * h) / 3, ans = dec(val, 1), pic = (hl) => G.pyramidFig({ a, h, labels: [`${a} cm`, `${h} cm`, ''], hl });
      return num(ans, [St(`A pyramid holds one third of the prism around it: V = ⅓ × base × height. The base is ${a} × ${a} = ${a * a} cm².`, pic('base')), St(`V = ⅓ × ${a * a} × ${h} = ${dec(val, 3)}.`, pic('height')), St(`So the volume is ${Number.isInteger(val) ? '' : 'about '}${ans} cm³.`)], { q: 'Find the volume of this square pyramid, in cm³. Round to 1 decimal place if needed.', visual: pic(), tol: 0.051, expr: `${a}**2*${h}/3` }); }
    const ans = dec((4 / 3) * Math.PI * a ** 3, 1), pic = (hl) => G.sphereFig({ labels: [`${a} cm`], hl });
    return num(ans, [St(`The radius is ${a} cm. V = 4/3 × π × r³.`, pic('radius')), St(`V = 4/3 × π × ${a}³ = 4/3 × π × ${a ** 3} ≈ ${ans}.`), St(`So the volume is about ${ans} cm³.`)], { q: 'Find the volume of this sphere, in cm³. Round to 1 decimal place.', visual: pic(), tol: 0.051, expr: `4/3*Math.PI*${a}**3` });
  }
  if (v === 5) {
    const a = r.int(2, 12), b = r.int(2, 9), h = r.int(2, 12), val = 2 * (a * b + a * h + b * h), L = [`${a}`, `${b}`, `${h}`], net = (hl) => G.boxNet({ l: a, w: b, h, labels: L, hl });
    return num(val, [St(`Unfold the box: its net has three pairs of matching rectangles. Top and bottom: 2 × ${a} × ${b} = ${2 * a * b}.`, net('tb')), St(`Front and back: 2 × ${a} × ${h} = ${2 * a * h}.`, net('fb')), St(`The two ends: 2 × ${b} × ${h} = ${2 * b * h}.`, net('lr')), St(`SA = ${2 * a * b} + ${2 * a * h} + ${2 * b * h} = ${val}.`), St(`So the surface area is ${val} cm².`)],
      { q: `Find the surface area of a rectangular prism ${a} cm by ${b} cm by ${h} cm, in cm².`, visual: G.boxFig({ l: a, w: b, h, labels: [`${a} cm`, `${b} cm`, `${h} cm`] }), expr: `2*(${a}*${b}+${a}*${h}+${b}*${h})` });
  }
  if (v === 6) {
    const a = r.int(2, 10), h = r.int(3, 15), ends = 2 * Math.PI * a * a, side = 2 * Math.PI * a * h, ans = dec(ends + side, 1), net = (hl) => G.cylinderNet({ labels: [`${a}`, `${h}`, '2πr'], hl });
    return num(ans, [St(`Unfold the cylinder: two circles and a rectangle. The circles: 2 × π × ${a}² = ${2 * a * a}π.`, net('circles')), St(`The rectangle wraps round, so its length is the circumference 2π × ${a}: area = 2π × ${a} × ${h} = ${2 * a * h}π.`, net('rect')), St(`SA = ${2 * a * a}π + ${2 * a * h}π = ${2 * a * a + 2 * a * h}π ≈ ${ans}.`), St(`So the surface area is about ${ans} cm².`)],
      { q: 'Find the surface area of this cylinder, in cm². Round to 1 decimal place.', visual: G.cylinderFig({ r: a, h, labels: [`${a} cm`, `${h} cm`] }), tol: 0.051, expr: `2*Math.PI*${a}**2+2*Math.PI*${a}*${h}` });
  }
  if (v === 7) {
    const a = r.int(2, 12), l = r.int(a, a + 10), val = a * a + 2 * a * l, net = (hl) => G.pyramidNet({ labels: [`${a} cm`, `${l} cm`], hl });
    return num(val, [St(`Unfold the pyramid: a square base and four triangles. Base: ${a}² = ${a * a}.`, net('base')), St(`Each triangle: ½ × ${a} × ${l} = ${dec((a * l) / 2)}. Four of them: ${2 * a * l}.`, net('faces')), St(`SA = ${a * a} + ${2 * a * l} = ${val}.`), St(`So the surface area is ${val} cm².`)],
      { q: `A square pyramid has base edges ${a} cm and slant height ${l} cm. Find its surface area, in cm².`, visual: G.pyramidFig({ a, h: l, labels: [`${a} cm`, '', `${l} cm`] }), expr: `${a}**2+2*${a}*${l}` });
  }
  if (v === 8) {
    const a = r.int(2, 12), ans = dec(4 * Math.PI * a * a, 1);
    return num(ans, [St(`A sphere's surface is exactly 4 circles of the same radius: SA = 4πr².`, G.sphereFig({ labels: [`${a} cm`], hl: 'radius' })), St(`SA = 4 × π × ${a}² = ${4 * a * a}π ≈ ${ans}.`), St(`So the surface area is about ${ans} cm².`)], { q: 'Find the surface area of this sphere, in cm². Round to 1 decimal place.', visual: G.sphereFig({ labels: [`${a} cm`] }), tol: 0.051, expr: `4*Math.PI*${a}**2` });
  }
  if (v === 9) {
    const k = r.pick([2, 3]), small = r.int(2, 5), vol = r.bool(), A = r.int(5, 60), val = vol ? A * k ** 3 : A * k * k, pic = G.similarBoxes({ k, labels1: ['', '', `${small} cm`], labels2: ['', '', `${small * k} cm`] });
    return num(val, [St(`Matching heights: ${small * k} ÷ ${small} = ${k}, so the scale factor is ${k}.`, pic), St(vol ? `Volumes scale by k³ = ${k}³ = ${k ** 3}: ${A} × ${k ** 3} = ${val}.` : `Surface areas scale by k² = ${k}² = ${k * k}: ${A} × ${k * k} = ${val}.`), St(`So the larger one has ${vol ? 'volume' : 'surface area'} ${val} ${vol ? 'cm³' : 'cm²'}.`)],
      { q: `These two boxes are similar. The smaller one has ${vol ? `volume ${A} cm³` : `surface area ${A} cm²`}. What is the ${vol ? 'volume (cm³)' : 'surface area (cm²)'} of the larger one?`, visual: pic, expr: vol ? `${A}*(${small * k}/${small})**3` : `${A}*(${small * k}/${small})**2` });
  }
  const b = r.int(3, 12), th = r.int(2, 10), d = r.int(4, 15), B = (b * th) / 2, val = B * d, ax = r.pick([0.3, 0.5, 0.7]);
  const pic = (hl) => G.prismFig({ base: [[0, 0], [b, 0], [b * ax, th]], depth: Math.max(3, Math.min(8, d * 0.6)), sides: [`${b} cm`, '', ''], height: { from: 2, side: 0, label: `${th} cm` }, depthLabel: `${d} cm`, hl });
  return num(dec(val), [St(`The base is the triangle at the end: ½ × ${b} × ${th} = ${dec(B)} cm².`, pic('base')), St(`V = base area × length = ${dec(B)} × ${d} = ${dec(val)}.`, pic('depth')), St(`So the volume is ${dec(val)} cm³.`)], { q: 'Find the volume of this triangular prism, in cm³.', visual: pic(), expr: `${b}*${th}/2*${d}` });
}

// ───────── 11. congruent triangles ─────────
const TRI2 = ['DEF', 'PQR', 'XYZ', 'LMN'];
const CONG = [['All three pairs of sides are equal.', 'SSS'], ['Two pairs of sides are equal, and so are the angles between them.', 'SAS'], ['Two pairs of angles are equal, and so are the sides between them.', 'ASA'], ['Two pairs of angles are equal, and a pair of sides that are not between those angles are equal.', 'AAS'], ['Both are right triangles with equal hypotenuses and one pair of equal legs.', 'HL'], ['All three pairs of angles are equal, but no side lengths are known.', 'Not enough information'], ['Two pairs of sides are equal, and a pair of angles that are not between those sides are equal.', 'Not enough information']];
const T0 = [[0, 0], [6, 0], [2, 4]];
const pairOf = (n1, n2, o = {}, pts = T0) => beside([marked(pts, { ...o, names: n1.split('') }), marked(pts.map(([x, y]) => [-x, y]), { ...o, names: n2.split('') })], 14);
const MARKS = {
  SSS: { ticks: [1, 2, 3] }, SAS: { ticks: [1, 0, 2], arcs: [1] }, ASA: { ticks: [1], arcs: [1, 2] }, AAS: { ticks: [0, 1], arcs: [1, 2] },
  HL: { ticks: [0, 2, 1], right: [0], rt: true }, SSA: { ticks: [1, 2], arcs: [1] }, AAA: { arcs: [1, 2, 3] },
};
const RT0 = [[0, 0], [5, 0], [0, 3.6]];
export function congruent(r) {
  const v = r.int(0, 7), T2 = r.pick(TRI2), perm = r.shuffle([0, 1, 2]), A = 'ABC', s1 = perm.map((i) => A[i]).join(''), s2 = perm.map((i) => T2[i]).join(''), map = (ch) => T2[A.indexOf(ch)];
  const pair = (o) => pairOf(A, T2, o);
  const matchStep = St(`Match the letters in order: ${s1.split('').map((c, k) => `${c} ↔ ${s2[k]}`).join(', ')}. In the picture, matching corners sit in matching places.`, pair({ arcs: [1, 2, 3] }));
  if (v === 0) {
    const [i, j] = r.shuffle([0, 1, 2]).slice(0, 2), side = A[i] + A[j], right = map(A[i]) + map(A[j]);
    const others = [[0, 1], [1, 2], [0, 2]].filter(([x, y]) => !((x === i && y === j) || (x === j && y === i))).map(([x, y]) => T2[x] + T2[y]);
    const sideIdx = (p, q) => ({ '01': 0, '10': 0, '12': 1, '21': 1, '02': 2, '20': 2 }[`${p}${q}`]), hlS = { side: sideIdx(i, j) };
    return mc(r, right, others, { q: `△${s1} ≅ △${s2}. Which side matches ${side}?`, visual: pair({}), steps: [matchStep, St(`${side[0]} ↔ ${right[0]} and ${side[1]} ↔ ${right[1]}, so ${side} matches ${right}.`, pairOf(A, T2, { hl: [hlS] }))] });
  }
  if (v === 1) {
    const ch = r.pick(A.split('')), right = `∠${map(ch)}`, k = A.indexOf(ch);
    return mc(r, right, T2.split('').filter((c) => c !== map(ch)).map((c) => `∠${c}`), { q: `△${s1} ≅ △${s2}. Which angle matches ∠${ch}?`, visual: pair({}), steps: [matchStep, St(`So ∠${ch} matches ${right}.`, pairOf(A, T2, { arcs: [k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0] }))] });
  }
  if (v === 2) {
    const x0 = r.int(2, 12), a = r.int(2, 5), b = r.int(-5, 9), val = a * x0 + b, exprS = `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`.replace(/ [+−] 0$/, '');
    const pic = (hl) => beside([marked(T0, { names: A.split(''), sides: [exprS, '', ''], hl }), marked(T0.map(([x, y]) => [-x, y]), { names: T2.split(''), sides: [`${val}`, '', ''], hl })], 14);
    return num(x0, [St(`AB matches ${T2[0]}${T2[1]}, and matching sides of congruent triangles are equal: ${exprS} = ${val}.`, pic([{ side: 0 }])), St(`${a}x = ${val} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${val - b}, so x = ${val - b} ÷ ${a} = ${x0}.`), St(`So x = ${x0}.`)],
      { q: `△ABC ≅ △${T2}. Find x.`, unit: 'x =', visual: pic(), expr: `(${val}-(${b}))/${a}` });
  }
  if (v === 3) {
    const kind = r.pick(Object.keys(MARKS)), M = MARKS[kind], right = kind === 'SSA' || kind === 'AAA' ? 'Not enough information' : kind;
    const pic = beside([marked(M.rt ? RT0 : T0, M), marked((M.rt ? RT0 : T0).map(([x, y]) => [-x, y]), M)], 14);
    const say = { SSS: 'three pairs of equal sides', SAS: 'two pairs of equal sides with the equal angles between them', ASA: 'two pairs of equal angles with the equal sides between them', AAS: 'two pairs of equal angles and a pair of equal sides that are not between them', HL: 'right triangles with equal hypotenuses and a pair of equal legs', SSA: 'two sides and an angle that is not between them (SSA)', AAA: 'only angles (AAA), with no sides' }[kind];
    return mc(r, right, r.shuffle(['SSS', 'SAS', 'ASA', 'AAS', 'HL', 'Not enough information'].filter((x) => x !== right)).slice(0, 3), { q: 'Matching marks show equal parts. Which rule proves these triangles are congruent?', visual: pic,
      steps: [St('Ticks show equal sides; arcs show equal angles; a square shows a right angle. Read what is equal and where it sits.', pic), St(`They have ${say}.`), St(right === 'Not enough information' ? `${kind} does not prove congruence: not enough information.` : `That is the ${right} rule.`)] });
  }
  if (v === 4) {
    const [d, right] = r.pick(CONG);
    return mc(r, right, r.shuffle([...new Set(CONG.map((x) => x[1]))].filter((x) => x !== right)).slice(0, 3), { q: `Two triangles have this in common: ${d} Which rule proves they are congruent?`,
      steps: [St('Look at what is known and where the angles sit compared with the sides.'), St(right === 'Not enough information' ? 'That pattern (SSA or AAA) does not prove congruence: not enough information.' : `That is the ${right} rule.`)] });
  }
  if (v === 5 || v === 6) {
    const vert = v === 5 ? r.int(10, 80) * 2 : null, base = v === 6 ? r.int(20, 85) : (180 - vert) / 2, top = 180 - 2 * base;
    const bd = Math.min(70, Math.max(25, base)), pts = [[0, 0], [8, 0], [4, 4 * Math.tan(bd * RAD)]], ns = Math.abs(bd - base) > 1.5 ? NS : '';
    const pic = (lab, hl) => G.polygonFig({ pts, ticks: [0, 1, 1], angles: v === 5 ? [lab, '', `${top}°`] : [`${base}°`, '', lab], hl });
    if (v === 5) return num(base, [St('The two equal sides (ticks) mean the base angles are equal.', pic('x', [{ side: 1 }, { side: 2 }])), St(`The angles add to 180°: 2x + ${top}° = 180°, so x = (180° − ${top}°) ÷ 2 = ${base}°.`, pic(`${base}°`, [{ angle: 0 }])), St(`So each base angle is ${base}°.`)],
      { q: `This triangle is isosceles. Find the base angle x, in degrees.${ns}`, unit: 'x =', visual: pic('x'), expr: `(180-${top})/2` });
    return num(top, [St(`The two equal sides (ticks) mean the base angles are equal: both are ${base}°.`, pic('x', [{ angle: 0 }])), St(`The angles add to 180°: x = 180° − 2 × ${base}° = ${top}°.`, pic(`${top}°`, [{ angle: 2 }])), St(`So the vertex angle is ${top}°.`)],
      { q: `This triangle is isosceles. Find the vertex angle x, in degrees.${ns}`, unit: 'x =', visual: pic('x'), expr: `180-2*${base}` });
  }
  const a1 = r.int(35, 70), a2 = r.int(35, Math.min(70, 125 - a1)), a3 = 180 - a1 - a2, pts = triPts(a1, a2), ask = r.int(0, 2), val = [a1, a2, a3][ask];
  const left = marked(pts, { names: A.split(''), angles: [`${a1}°`, `${a2}°`, ''] }), right = (lab) => marked(pts.map(([x, y]) => [-x, y]), { names: T2.split(''), angles: [ask === 0 ? lab : '', ask === 1 ? lab : '', ask === 2 ? lab : ''] });
  return num(val, [St(`△ABC ≅ △${T2}, so ∠${T2[ask]} matches ∠${A[ask]}.`, beside([left, right('?')], 14)), ...(ask === 2 ? [St(`∠C = 180° − ${a1}° − ${a2}° = ${a3}°.`)] : []), St(`Matching angles are equal: ∠${T2[ask]} = ${val}°.`, beside([left, right(`${val}°`)], 14)), St(`So ∠${T2[ask]} = ${val}°.`)],
    { q: `△ABC ≅ △${T2}. What is ∠${T2[ask]}, in degrees?`, unit: `∠${T2[ask]} =`, visual: beside([left, right('?')], 14), expr: `${val}` });
}

// ───────── 11. angle reasons ─────────
const REASONS = [['∠1 and ∠2 are opposite each other where two lines cross. Why is ∠1 = ∠2?', 'Vertical angles are equal', () => G.anglePairFig({ kind: 'vert', deg: 50, labels: ['1', '2'] })], ['∠1 and ∠2 sit side by side on a straight line. Why do they add to 180°?', 'Angles on a straight line add to 180°', () => G.anglePairFig({ kind: 'supp', deg: 55, labels: ['1', '2'] })], ['Two parallel lines are cut by a transversal. ∠1 and ∠2 are between the parallel lines, on opposite sides of the transversal. Why is ∠1 = ∠2?', 'Alternate interior angles are equal', () => G.transversalFig({ deg: 60, labels: { 3: '1', 5: '2' } })], ['Two parallel lines are cut by a transversal. ∠1 and ∠2 are in matching positions at the two crossings. Why is ∠1 = ∠2?', 'Corresponding angles are equal', () => G.transversalFig({ deg: 60, labels: { 1: '1', 5: '2' } })], ['Two parallel lines are cut by a transversal. ∠1 and ∠2 are between the parallel lines, on the same side of the transversal. Why do they add to 180°?', 'Same-side interior angles add to 180°', () => G.transversalFig({ deg: 60, labels: { 4: '1', 5: '2' } })], ['In △ABC, AB = AC. Why is ∠B = ∠C?', 'Base angles of an isosceles triangle are equal', () => G.polygonFig({ pts: [[0, 0], [8, 0], [4, 5]], names: ['B', 'C', 'A'], ticks: [0, 1, 1], angles: ['∠B', '∠C', ''] })]];
// the angle at position k (1–8) of transversalFig, when the angle at position 1 is d
const posAngle = (k, d) => (k % 2 ? d : 180 - d);
export function angleproof(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const a = r.int(25, 155), vert = r.bool(), val = vert ? a : 180 - a;
    if (vert) {
      const pic2 = (lab, hl) => crossPair(a, `${a}°`, lab, hl);
      return num(val, [St('Vertical angles are opposite each other where two lines cross. They are equal.', pic2('x', [0, 1])), St(`So x = ${val}°.`, pic2(`${val}°`, [1]))], { q: 'Two lines cross. Find x, in degrees.', unit: 'x =', visual: pic2('x'), expr: `${a}` });
    }
    const pic = (lab, hl) => G.anglePairFig({ kind: 'supp', deg: 180 - a, labels: [lab, `${a}°`], hl });
    return num(val, [St('The two angles sit side by side on a straight line, so they add to 180°.', pic('x', [0, 1])), St(`x = 180° − ${a}° = ${val}°.`, pic(`${val}°`, [0])), St(`So x = ${val}°.`)], { q: 'Find x, in degrees.', unit: 'x =', visual: pic('x'), expr: `180-${a}` });
  }
  if (v === 1 || v === 4) {
    const PAIRS = { corresponding: [[1, 5], [2, 6], [3, 7], [4, 8]], 'alternate interior': [[3, 5], [4, 6]], 'same-side interior': [[3, 6], [4, 5]], 'alternate exterior': [[1, 7], [2, 8]] };
    const rel = r.pick(Object.keys(PAIRS)), [p, q] = r.shuffle(r.pick(PAIRS[rel])), a = r.int(25, 155), d = p % 2 ? a : 180 - a, val = posAngle(q, d);
    const pic = (lab, hl = []) => G.transversalFig({ deg: d, labels: { [p]: `${a}°`, [q]: lab }, hl });
    const rule = rel === 'same-side interior' ? 'Same-side interior angles add to 180°' : `${cap(rel)} angles are equal`;
    if (v === 1) return num(val, [St(`The two marked angles are ${rel} angles: ${rel === 'corresponding' ? 'in matching positions at the two crossings' : rel === 'alternate interior' ? 'between the parallel lines, on opposite sides of the transversal' : rel === 'alternate exterior' ? 'outside the parallel lines, on opposite sides of the transversal' : 'between the parallel lines, on the same side of the transversal'}.`, pic('x', [p, q])), St(rel === 'same-side interior' ? `${rule}: x = 180° − ${a}° = ${val}°.` : `${rule}: x = ${val}°.`, pic(`${val}°`, [q])), St(`So x = ${val}°.`)],
      { q: 'The two lines with arrows are parallel. Find x, in degrees.', unit: 'x =', visual: pic('x'), expr: `${val}` });
    const kk = r.pick([1, 2, 3, 4, 5, 6, 7, 8].filter((k) => k !== p)), vk = posAngle(kk, d), lab = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map((k) => [k, k === p ? `${a}°` : `${k}`]));
    const pic8 = (hl) => G.transversalFig({ deg: d, labels: lab, hl });
    return num(vk, [St(`Angles in the same kind of position — both acute or both obtuse here — are equal; an acute angle and an obtuse angle add to 180°.`, pic8([p, kk])), St(vk === a ? `∠${kk} is the same kind of angle as the ${a}° angle, so ∠${kk} = ${a}°.` : `∠${kk} and the ${a}° angle add to 180°: ∠${kk} = 180° − ${a}° = ${vk}°.`), St(`So ∠${kk} = ${vk}°.`)],
      { q: `The lines with arrows are parallel. One angle is ${a}°. What is ∠${kk}, in degrees?`, unit: `∠${kk} =`, visual: pic8(), expr: `${vk}` });
  }
  if (v === 2) {
    const [d, right, picF] = r.pick(REASONS);
    return mc(r, right, r.shuffle(REASONS.map((x) => x[1]).filter((x) => x !== right)).slice(0, 3), { q: d, visual: picF(), steps: [St('Look at where the two angles sit.', picF()), St(`Reason: ${right}.`)] });
  }
  if (v === 3) {
    const x0 = r.int(5, 25), p = r.int(2, 4), q = p + r.int(1, 3), c1 = r.int(5, 40), c2 = (p - q) * x0 + c1, ang = p * x0 + c1, kind = r.pick(['vertical angles', 'alternate interior angles', 'corresponding angles']);
    if (ang >= 175 || ang <= 5) return angleproof(r);
    const e1 = `(${p}x ${c1 < 0 ? '−' : '+'} ${Math.abs(c1)})°`, e2 = `(${q}x ${c2 < 0 ? '−' : '+'} ${Math.abs(c2)})°`.replace(' + 0)', ')');
    const pic = (hl) => (kind === 'vertical angles' ? crossPair(ang, e1, e2, hl) :G.transversalFig({ deg: ang <= 90 ? ang : 180 - ang, labels: kind === 'corresponding angles' ? (ang <= 90 ? { 1: e1, 5: e2 } : { 2: e1, 6: e2 }) : ang <= 90 ? { 3: e1, 5: e2 } : { 4: e1, 6: e2 }, hl }));
    return num(x0, [St(`${cap(kind)}${kind === 'vertical angles' ? '' : ' between parallel lines'} are equal: ${e1.slice(1, -2)} = ${e2.slice(1, -2)}.`, pic()), St(`${c1 - c2} = ${q - p}x, so x = ${x0}.`), St(`So x = ${x0}; each angle is ${ang}°.`)],
      { q: `Find x. ${kind === 'vertical angles' ? 'The two lines cross.' : 'The lines with arrows are parallel.'}`, unit: 'x =', visual: pic(), expr: `(${c1}-(${c2}))/(${q}-${p})` });
  }
  if (v === 5) {
    const a = r.int(15, 75), val = 90 - a, pic = (lab, hl) => G.anglePairFig({ kind: 'comp', deg: a, labels: [`${a}°`, lab], hl });
    return num(val, [St('The square mark shows a right angle: the two angles together make 90°.', pic('x', [0, 1])), St(`x = 90° − ${a}° = ${val}°.`, pic(`${val}°`, [1])), St(`So x = ${val}°.`)], { q: 'Find x, in degrees.', unit: 'x =', visual: pic('x'), expr: `90-${a}` });
  }
  const a = r.int(40, 80), same = r.bool(), b = same ? a : a + r.pick([-4, -3, -2, 2, 3, 4]);
  return mc(r, same ? 'Yes' : 'No', [same ? 'No' : 'Yes'], { q: `A transversal crosses two lines. ∠1 = ${a}° and ∠5 = ${b}° are corresponding angles. Are the two lines parallel?${NS}`, visual: G.transversalFig({ deg: 60, labels: { 1: `${a}°`, 5: `${b}°` }, parallel: false }),
    steps: [St('Lines are parallel exactly when corresponding angles are equal (the converse of the corresponding angles rule).', G.transversalFig({ deg: 60, labels: { 1: '∠1', 5: '∠5' }, hl: [1, 5], parallel: false })), St(same ? `${a}° = ${b}°, so yes, the lines are parallel.` : `${a}° ≠ ${b}°, so no, the lines are not parallel.`)] });
}
// two lines crossing at their true angle; the angle a (labelled lab1) and the one opposite it (lab2) are marked.
// hl: 0 for the first, 1 for the second
export function crossPair(a, lab1, lab2, hl = []) {
  const W = 300, H = 200, V = [150, 100], t = a <= 90 ? a : 180 - a, Ln = Math.min(115, 82 / Math.sin(t * RAD)), ray = (d) => at(V, d, Ln);
  // a ≤ 90: a sits between the rays at 0° and t (right); otherwise a is the angle above, between t and 180°
  const [p1, q1, p2, q2] = a <= 90 ? [0, t, 180, 180 + t] : [t, 180, 180 + t, 360];
  return fig([line(ray(180), ray(0), 'ink'), line(ray(180 + t), ray(t), 'ink'),
    ...angleArc(V, ray(p1), ray(q1), lab1, 26, has(hl, 0) ? 'hlline' : 'mark'), ...angleArc(V, ray(p2), ray(q2), lab2, 26, has(hl, 1) ? 'hlline' : 'mark')], W, H);
}

// ───────── 11. triangles: angles, sides and segments ─────────
// a triangle drawn true from its three sides; labels and ticks are given for sides [AB, BC, CA]
const sssFig = (ab, bc, ca, o = {}) => { const [A, B] = anglesOf(bc, ca, ab); return marked(triPts(A, B), { names: ['A', 'B', 'C'], ...o }); };
const SEGS = ['Median', 'Altitude', 'Angle bisector', 'Perpendicular bisector'];
function segFig(kind, hl) {
  const A = [0, 0], B = [8, 0], C = [2.6, 5], t = hl ? 'hlline' : 'ink';
  if (kind === 'Median') return polyPlus({ pts: [A, [4, 0], B, C], ticks: [1, 1, 0, 0], names: ['A', '', 'B', 'C'] }, (m) => line(m(C), m([4, 0]), t));
  if (kind === 'Altitude') return polyPlus({ pts: [A, B, C], names: ['A', 'B', 'C'] }, (m) => [line(m(C), m([2.6, 0]), t), rightMark(m([2.6, 0]), m(B), m(C), 9)]);
  if (kind === 'Angle bisector') {
    // the bisector from A meets BC where the ray at half of angle A crosses it
    const h = Math.atan2(C[1], C[0]) / 2, d = [Math.cos(h), Math.sin(h)], e = sub(C, B), den = d[0] * e[1] - d[1] * e[0], tt = (B[0] * e[1] - B[1] * e[0]) / den, end = mul(d, tt);
    return polyPlus({ pts: [A, B, C], names: ['A', 'B', 'C'] }, (m) => [line(m(A), m(end), t), angleArc(m(A), m(B), m(end), '', 30), angleArc(m(A), m(end), m(C), '', 30)]);
  }
  return polyPlus({ pts: [A, [4, 0], B, C], ticks: [1, 1, 0, 0], names: ['A', '', 'B', 'C'], extra: [[4, 4.2]] }, (m) => [line(m([4, 0]), m([4, 4.2]), t), rightMark(m([4, 0]), m(B), m([4, 4.2]), 9)]);
}
export function triangles(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const k = r.int(0, 2), a = r.int(4, 12), s = [[a, a, a], [a, a, a + r.pick([-2, -1, 1, 2, 3])], [a, a + 1, a + 2]][k], sh = r.shuffle(s), right = ['Equilateral', 'Isosceles', 'Scalene'][k];
    const eq = sh.map((x) => sh.filter((y) => y === x).length > 1 ? 1 : 0);
    return mc(r, right, ['Equilateral', 'Isosceles', 'Scalene'], { q: 'Classify this triangle by its sides.', visual: sssFig(...sh, { sides: sh.map((x) => `${x} cm`) }),
      steps: [St('Equilateral: all three sides equal. Isosceles: exactly two equal. Scalene: none equal.', sssFig(...sh, { sides: sh.map((x) => `${x} cm`), ticks: eq })), St(`${['All three sides are equal', 'Exactly two sides are equal', 'No two sides are equal'][k]}, so it is ${right.toLowerCase()}.`)] });
  }
  if (v === 1 || v === 2) {
    const A = r.int(20, 80), B = r.pick([r.int(20, 150 - A), 90 - A]), C = 180 - A - B, pic = (lab, hl) => triFig({ A, B, angs: { A: `${A}°`, B: `${B}°`, C: lab }, hl });
    if (v === 2) return num(C, [St('The three angles of a triangle add to 180°.', pic('x', ['A', 'B'])), St(`x = 180° − ${A}° − ${B}° = ${C}°.`, pic(`${C}°`, ['C'])), St(`So x = ${C}°.`)], { q: 'Find the missing angle x, in degrees.', unit: 'x =', visual: pic('x'), expr: `180-${A}-${B}` });
    const big = Math.max(A, B, C), right = big === 90 ? 'Right' : big > 90 ? 'Obtuse' : 'Acute';
    return mc(r, right, ['Acute', 'Right', 'Obtuse'], { q: 'Classify this triangle by its angles.', visual: pic('?'), steps: [St(`The third angle is 180° − ${A}° − ${B}° = ${C}°.`, pic(`${C}°`, ['C'])), St(`The largest angle is ${big}°, so the triangle is ${right.toLowerCase()}${big === 90 ? '' : big > 90 ? ' (one angle over 90°)' : ' (all angles under 90°)'}.`)] });
  }
  if (v === 3) {
    const A = r.int(25, 85), B = r.int(25, 150 - A), pts = triPts(A, B), pic = (lab, hl) => G.polygonFig({ pts, angles: [`${A}°`, `${B}°`, ''], ext: 2, extLabel: lab, names: ['A', 'B', 'C'], hl });
    return num(A + B, [St('An exterior angle and the interior angle next to it make 180°, and so do all three interior angles. So the exterior angle equals the two far interior angles added.', pic('x', [{ angle: 0 }, { angle: 1 }, 'ext'])), St(`x = ${A}° + ${B}° = ${A + B}°.`, pic(`${A + B}°`, ['ext'])), St(`So x = ${A + B}°.`)],
      { q: 'One side of the triangle is extended. Find the exterior angle x, in degrees.', unit: 'x =', visual: pic('x'), expr: `${A}+${B}` });
  }
  if (v === 4) {
    const mm = r.int(3, 20), half = r.bool(), Bp = [0, 0], Cp = [8, 0], Ap = [3, 5], E = mid(Cp, Ap), D = mid(Ap, Bp);
    const pic = (bc, de, hl) => polyPlus({ pts: [Bp, Cp, E, Ap, D], names: ['B', 'C', 'E', 'A', 'D'], ticks: [0, 1, 1, 2, 2], par: [1, 0, 0, 0, 0], sides: [bc, '', '', '', ''], diag: [[4, 2, hl ? 'hlline' : 'ink']], hl: hl ? [{ side: 0 }] : [] }, (m) => [...G.parArrows(m(D), m(E), 1), text(add(mid(m(D), m(E)), [0, -12]), de, hl ? 'hl' : 'ink')]);
    const key = 'D and E are midpoints (the ticks), so DE is a midsegment: it is parallel to BC and half as long.';
    return half ? num(mm, [St(key, pic(`${2 * mm} cm`, 'DE', true)), St(`DE = ${2 * mm} ÷ 2 = ${mm}.`), St(`So DE = ${mm} cm.`)], { q: 'D and E are the midpoints of AB and AC. How long is DE, in cm?', unit: 'DE =', visual: pic(`${2 * mm} cm`, '?'), expr: `${2 * mm}/2` })
      : num(2 * mm, [St(key, pic('BC', `${mm} cm`, true)), St(`BC is twice DE: 2 × ${mm} = ${2 * mm}.`), St(`So BC = ${2 * mm} cm.`)], { q: 'D and E are the midpoints of AB and AC. How long is BC, in cm?', unit: 'BC =', visual: pic('?', `${mm} cm`), expr: `2*${mm}` });
  }
  if (v === 5) {
    const a = r.int(3, 15), b = r.int(3, 15), big = r.bool(), val = big ? a + b - 1 : Math.abs(a - b) + 1;
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [7, 0], [2.4, 4]], sides: ['x', `${b} cm`, `${a} cm`], hl });
    return num(val, [St(`Any two sides must add to more than the third. So x < ${a} + ${b} = ${a + b}, and x must be more than the difference, ${Math.abs(a - b)}.`, pic([{ side: 0 }])), St(`${Math.abs(a - b)} < x < ${a + b}. The ${big ? 'greatest' : 'least'} whole number in that range is ${val}.`), St(`So x = ${val} cm.`)],
      { q: `Two sides of a triangle are ${a} cm and ${b} cm. What is the ${big ? 'greatest' : 'least'} whole-number length the third side x can have?${NS}`, unit: 'x =', visual: pic(), expr: big ? `${a}+${b}-1` : `Math.abs(${a}-${b})+1` });
  }
  if (v === 6) {
    let s; do { s = [r.int(4, 15), r.int(4, 15), r.int(4, 15)]; } while (new Set(s).size < 3 || Math.max(...s) * 2 >= s[0] + s[1] + s[2] || Math.max(...s) > 1.8 * Math.min(...s));
    const [ab, bc, ca] = s, i = s.indexOf(Math.max(...s)), right = ['∠C', '∠A', '∠B'][i];
    return mc(r, right, ['∠A', '∠B', '∠C'], { q: 'Which angle of this triangle is the largest?', visual: sssFig(ab, bc, ca, { sides: [`${ab}`, `${bc}`, `${ca}`] }),
      steps: [St(`The longest side is ${['AB', 'BC', 'CA'][i]} = ${Math.max(...s)}.`, sssFig(ab, bc, ca, { sides: [`${ab}`, `${bc}`, `${ca}`], hl: [{ side: i }] })), St(`The largest angle is across from the longest side: ${right}.`, sssFig(ab, bc, ca, { sides: [`${ab}`, `${bc}`, `${ca}`], hl: [{ side: i }, { angle: (i + 2) % 3 }], angles: ['', '', ''].map((_, k) => (k === (i + 2) % 3 ? 'largest' : '')) }))] });
  }
  const right = r.pick(SEGS), say = { Median: 'goes from a corner to the midpoint of the opposite side (the ticks show the two equal halves)', Altitude: 'goes from a corner and meets the opposite side at a right angle', 'Angle bisector': 'cuts the angle at a corner into two equal angles (the matching arcs)', 'Perpendicular bisector': 'passes through the midpoint of a side at a right angle to it' }[right];
  return mc(r, right, SEGS, { q: 'What is the name of the segment drawn inside this triangle?', visual: segFig(right), steps: [St(`Read the marks: the segment ${say}.`, segFig(right, true)), St(`That is ${art(right)} ${right.toLowerCase()}.`)] });
}

// ───────── 11. similar figures ─────────
// a triangle with sides AB = c, BC = a, CA = b in real units (model coordinates)
const cen = (P) => [P.reduce((t, p) => t + p[0], 0) / P.length, P.reduce((t, p) => t + p[1], 0) / P.length];
const widthOf = (P) => Math.max(...P.map((p) => p[0])) - Math.min(...P.map((p) => p[0]));
const realTri = (a, b, c) => { const [A, B] = anglesOf(a, b, c), k = c / Math.sin((180 - A - B) * RAD); return triPts(A, B).map(([x, y]) => [x * k, y * k]); };
const okTri = (a, b, c) => a + b > c && a + c > b && b + c > a && Math.min(...anglesOf(a, b, c)) > 22;
export function similar(r) {
  const v = r.int(0, 6);
  if (v === 0 || v === 4) {
    const [p, q] = r.pick([[2, 1], [3, 1], [3, 2], [5, 2], [4, 3], [3, 4], [2, 3], [1, 2]]);
    let AB, BC, CA, guard = 0; do { const uu = r.int(1, 5); AB = q * uu; BC = q * r.int(1, 6); CA = r.int(2, 12); } while (!okTri(BC, CA, AB) && guard++ < 200);
    if (!okTri(BC, CA, AB)) { AB = 4 * q; BC = 5 * q; CA = 6; }
    const DE = (AB * p) / q, EF = (BC * p) / q, P1 = realTri(BC, CA, AB), P2 = P1.map(([x, y]) => [(x * p) / q, (y * p) / q]), s = 150 / Math.max(widthOf(P1), widthOf(P2));
    const pair = (lab, hl) => beside([scaled({ pts: P1, names: ['A', 'B', 'C'], sides: [`${AB}`, `${BC}`, ''], hl }, s), scaled({ pts: P2, names: ['D', 'E', 'F'], sides: [`${dec(DE)}`, lab, ''], hl }, s)], 8);
    if (v === 4) return num(frac(p, q), [St(`AB matches DE: both run from the first corner to the second.`, pair('', [{ side: 0 }])), St(`Scale factor = DE ÷ AB = ${dec(DE)} ÷ ${AB} = ${frac(p, q)}.`), St(`So the scale factor is ${frac(p, q)}.`)], { q: '△ABC ~ △DEF. What is the scale factor from △ABC to △DEF? (A fraction is fine.)', visual: pair(''), expr: `${DE}/${AB}` });
    return num(dec(EF), [St(`Matching sides: AB ↔ DE. Scale factor = DE ÷ AB = ${dec(DE)} ÷ ${AB} = ${frac(p, q)}.`, pair('x', [{ side: 0 }])), St(`EF matches BC, so EF = ${BC} × ${frac(p, q)} = ${dec(EF)}.`, pair('x', [{ side: 1 }])), St(`So x = ${dec(EF)}.`)], { q: '△ABC ~ △DEF. Find x.', unit: 'x =', visual: pair('x'), expr: `${BC}*${DE}/${AB}` });
  }
  if (v === 1) {
    const h = r.pick([1.5, 1.6, 1.7, 1.8]), s = r.int(2, 4), S = r.int(6, 30), val = (h * S) / s, ans = dec(val, 1);
    const tri = (w, hh, wl, hl2, sc, hl) => scaled({ pts: [[0, 0], [w, 0], [w, hh]], right: [1], sides: [wl, hl2, ''], hl }, sc);
    const pair = (lab, hl) => beside([tri(s, h, `${s} m`, `${h} m`, 34, hl), tri(S, (h * S) / s, `${S} m`, lab, 120 / Math.max(S, (h * S) / s), hl)], 10);
    return num(ans, [St('The sun hits the person and the tree at the same angle, so the two triangles are similar: height ÷ shadow is the same for both.', pair('h', [{ side: 1 }, { side: 0 }])), St(`h ÷ ${S} = ${h} ÷ ${s}, so h = ${h} × ${S} ÷ ${s} = ${dec(val, 3)}.`), St(`So the tree is about ${ans} m tall.`)],
      { q: `A person ${h} m tall casts a ${s} m shadow. At the same time a tree casts a ${S} m shadow. How tall is the tree, in m? Round to 1 decimal place.${NS}`, unit: 'h =', visual: pair('h'), tol: 0.051, expr: `${h}*${S}/${s}` });
  }
  if (v === 2 || v === 5) {
    const k = r.pick([2, 3, 1.5]), shape = r.pick([[[0, 0], [6, 0], [6, 3], [2, 5], [0, 3]], [[0, 0], [7, 0], [5, 4], [1, 4]], [[0, 0], [5, 0], [6, 3], [2, 4]]]), n = shape.length;
    const side = (P, i) => Math.hypot(P[(i + 1) % n][0] - P[i][0], P[(i + 1) % n][1] - P[i][1]);
    const sm = r.int(2, 6) * 2, base0 = side(shape, 0), unitK = sm / base0, S1 = shape.map(([x, y]) => [x * unitK, y * unitK]), S2 = S1.map(([x, y]) => [x * k, y * k]), sc = 130 / (Math.max(...S2.map((z) => z[0])));
    if (v === 2) {
      const P = r.int(8, 40), up = r.bool(), val = up ? P * k : P;
      const pair = beside([scaled({ pts: S1, sides: [`${sm} cm`], notes: [{ at: cen(S1), s: up ? `P = ${P}` : '?', t: 'hl2' }] }, sc), scaled({ pts: S2, sides: [`${dec(sm * k)} cm`], notes: [{ at: cen(S2), s: up ? '?' : `P = ${dec(P * k)}`, t: 'hl' }] }, sc)], 8);
      return num(dec(val), [St(`Matching sides: ${dec(sm * k)} ÷ ${sm} = ${k}. The scale factor is ${k}.`, pair), St(up ? `A perimeter is a length, so it scales by ${k} too: ${P} × ${k} = ${dec(val)}.` : `A perimeter is a length, so divide by ${k}: ${dec(P * k)} ÷ ${k} = ${dec(val)}.`), St(`So the ${up ? 'larger' : 'smaller'} perimeter is ${dec(val)} cm.`)],
        { q: `These polygons are similar. Find the perimeter of the ${up ? 'larger' : 'smaller'} one, in cm.`, visual: pair, expr: up ? `${P}*${k}` : `${dec(P * k)}/${k}` });
    }
    const j = r.int(1, n - 1), sj = side(S1, j), sjL = dec(Math.round(sj * 2) / 2), val = dec(Number(sjL) * k);
    const lab1 = S1.map((_, i) => (i === 0 ? `${sm}` : i === j ? `${sjL}` : '')), lab2 = S2.map((_, i) => (i === 0 ? `${dec(sm * k)}` : i === j ? 'x' : ''));
    const pair = (hl) => beside([scaled({ pts: S1, sides: lab1, hl }, sc), scaled({ pts: S2, sides: lab2, hl }, sc)], 8);
    return num(val, [St(`The bottom sides match: scale factor = ${dec(sm * k)} ÷ ${sm} = ${k}.`, pair([{ side: 0 }])), St(`x matches the side of ${sjL}: x = ${sjL} × ${k} = ${val}.`, pair([{ side: j }])), St(`So x = ${val}.`)],
      { q: `These two shapes are similar. Find x.${Math.abs(Number(sjL) - sj) > 0.05 ? NS : ''}`, unit: 'x =', visual: pair(), expr: `${sjL}*${k}` });
  }
  if (v === 3) {
    const a = r.int(2, 8), b = r.int(a + 1, 12), k = r.pick([2, 3, 1.5]), sim = r.bool(), c = a * k, d = sim ? b * k : b * k + r.pick([1, 2, -1]);
    const sc = 140 / Math.max(b, d), rect = (w, h) => scaled({ pts: [[0, 0], [w, 0], [w, h], [0, h]], right: [0, 1, 2, 3], sides: [`${dec(w)}`, `${dec(h)}`, '', ''] }, sc, 30);
    const pic = beside([rect(b, a), rect(d, c)], 10);
    return mc(r, sim ? 'Yes' : 'No', [sim ? 'No' : 'Yes'], { q: 'Are these two rectangles similar?', visual: pic,
      steps: [St(`Similar rectangles have matching sides in the same ratio. Long sides: ${dec(d)} ÷ ${b} = ${dec(d / b, 3)}. Short sides: ${dec(c)} ÷ ${a} = ${dec(c / a, 3)}.`, pic), St(sim ? 'The ratios are equal, so yes, they are similar.' : 'The ratios are different, so no, they are not similar.')] });
  }
  const h1 = r.pick([1.5, 1.6, 1.7, 1.8]), d1 = r.int(2, 4), d2 = r.int(10, 40), H = (h1 * d2) / d1, ans = dec(H, 1);
  const pic = (hl) => polyPlus({ pts: [[0, 0], [3, 0], [0, 2.4]], right: [0], sides: [`${d1} m`, '', `${h1} m`], hl: hl ? [{ side: 0 }, { side: 2 }] : [], extra: [[12, 0], [12, 7.2]] }, (m) => [poly([m([3, 0]), m([12, 0]), m([12, 7.2])], 'fig'), rightMark(m([12, 0]), m([3, 0]), m([12, 7.2])), text(add(m([7.5, 0]), [0, 14]), `${d2} m`, hl ? 'hl' : 'ink'), text(add(m([12, 3.6]), [16, 0]), 'h', hl ? 'hl' : 'ink'), angleArc(m([3, 0]), m([0, 0]), m([0, 2.4]), '', 18), angleArc(m([3, 0]), m([12, 0]), m([12, 7.2]), '', 18), text(add(m([3, 0]), [0, 30]), 'mirror', 'muted', { size: 11 })]);
  return num(ans, [St('Light bounces off a mirror at equal angles (the arcs), and both triangles have a right angle, so they are similar (AA).', pic(false)), St(`Matching sides: h ÷ ${d2} = ${h1} ÷ ${d1}.`, pic(true)), St(`h = ${h1} × ${d2} ÷ ${d1} ≈ ${ans}.`), St(`So the building is about ${ans} m tall.`)],
    { q: `A mirror lies on the ground ${d1} m from a person whose eyes are ${h1} m up, and ${d2} m from a building. The person sees the top of the building in the mirror. How tall is the building, in m? Round to 1 decimal place.${NS}`, unit: 'h =', visual: pic(false), tol: 0.051, expr: `${h1}*${d2}/${d1}` });
}
const SIMRULE = [['AA', 'Two pairs of angles are equal.'], ['SSS similarity', 'All three pairs of sides are in the same ratio.'], ['SAS similarity', 'Two pairs of sides are in the same ratio, and the angles between them are equal.'], ['Not enough information', 'One pair of angles is equal.']];
export function similar2(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const [p, q] = r.pick([[2, 1], [3, 1], [3, 2], [4, 3], [5, 2]]), A = q * q * r.int(1, 8), val = (A * p * p) / (q * q), shape = realTri(5, 6, 7);
    const pair = beside([scaled({ pts: shape, sides: [`${q * 3} cm`, '', ''], notes: [{ at: cen(shape), s: `${A} cm²`, t: 'hl2' }] }, (22 * q) / p, 30), scaled({ pts: shape, sides: [`${p * 3} cm`, '', ''], notes: [{ at: cen(shape), s: '?', t: 'hl' }] }, 22, 30)], 8);
    return num(val, [St(`Matching sides ${p * 3} and ${q * 3}: the scale factor is ${frac(p, q)}.`, pair), St(`Areas scale by the square of it: (${frac(p, q)})² = ${frac(p * p, q * q)}.`), St(`${A} × ${frac(p * p, q * q)} = ${val}.`), St(`So the larger area is ${val} cm².`)],
      { q: `These triangles are similar. The smaller has area ${A} cm². What is the area of the larger, in cm²?`, visual: pair, expr: `${A}*(${p * 3}/${q * 3})**2` });
  }
  if (v === 1 || v === 4) {
    const p = r.int(1, 5), q = r.int(1, 5), m = r.int(1, 3), n = r.int(1, 3), AD = m * p, DB = m * q, AE = n * p, EC = n * q;
    const Bp = [0, 0], Cp = [9, 0], Ap = [3.2, 6], t = p / (p + q), D = add(Ap, mul(sub(Bp, Ap), t)), E = add(Ap, mul(sub(Cp, Ap), t));
    if (v === 1) {
      const pic = (lab, hl) => polyPlus({ pts: [Bp, Cp, E, Ap, D], names: ['B', 'C', 'E', 'A', 'D'], sides: ['', lab, `${AE}`, `${AD}`, `${DB}`], par: [1, 0, 0, 0, 0], diag: [[4, 2, 'ink']], hl }, (mm) => G.parArrows(mm(D), mm(E), 1));
      return num(EC, [St(`DE ∥ BC, so DE cuts the two sides in the same ratio: AD/DB = AE/EC.`, pic('x', [{ side: 3 }, { side: 4 }])), St(`${AD}/${DB} = ${AE}/x, so x = ${AE} × ${DB} ÷ ${AD} = ${EC}.`, pic('x', [{ side: 1 }, { side: 2 }])), St(`So EC = ${EC}.`)], { q: 'DE is parallel to BC. Find x.', unit: 'x =', visual: pic('x'), expr: `${AE}*${DB}/${AD}` });
    }
    const BC = (p + q) * r.int(1, 3), DE = (BC * p) / (p + q), AB = AD + DB;
    const pic = (lab, hl) => polyPlus({ pts: [Bp, Cp, E, Ap, D], names: ['B', 'C', 'E', 'A', 'D'], sides: [`${BC}`, '', '', `${AD}`, `${DB}`], par: [1, 0, 0, 0, 0], diag: [[4, 2, hl ? 'hlline' : 'ink']], hl: hl ? [{ side: 0 }] : [] }, (mm) => [...G.parArrows(mm(D), mm(E), 1), text(add(mid(mm(D), mm(E)), [0, -12]), lab, hl ? 'hl' : 'ink')]);
    return num(dec(DE), [St(`DE ∥ BC, so △ADE ~ △ABC (they share ∠A, and corresponding angles are equal).`, pic('x', true)), St(`Scale factor = AD ÷ AB = ${AD} ÷ (${AD} + ${DB}) = ${frac(AD, AB)}.`), St(`x = ${BC} × ${frac(AD, AB)} = ${dec(DE)}.`), St(`So DE = ${dec(DE)}.`)], { q: 'DE is parallel to BC. Find x = DE.', unit: 'x =', visual: pic('x', false), expr: `${BC}*${AD}/${AB}` });
  }
  if (v === 2) {
    const [right, d] = r.pick(SIMRULE), A = 48, B = 62, P1 = triPts(A, B).map(([x, y]) => [x * 6, y * 6]), P2 = P1.map(([x, y]) => [x * 1.5, y * 1.5]);
    const sl = [0, 1, 2].map((i) => dec(Math.hypot(...sub(P1[(i + 1) % 3], P1[i])), 1)), big = (x) => (x ? dec(Number(x) * 1.5, 2) : '');
    const L1 = { AA: { angles: ['48°', '62°', ''] }, 'SSS similarity': { sides: sl }, 'SAS similarity': { sides: [sl[0], '', sl[2]], angles: ['48°', '', ''] }, 'Not enough information': { angles: ['48°', '', ''] } }[right];
    const L2 = { ...L1, sides: L1.sides?.map(big) };
    const pic = beside([scaled({ pts: P1, ...L1 }, 20, 30), scaled({ pts: P2, ...L2 }, 20, 30)], 8);
    return mc(r, right, SIMRULE.map((x) => x[0]), { q: 'Which rule shows that these two triangles are similar?', visual: pic, steps: [St('Check the angles first, then the ratios of the sides.', pic), St(`${d} ${right === 'Not enough information' ? 'One angle alone is not enough: not enough information.' : `That is ${right}.`}`)] });
  }
  if (v === 3) {
    const r1 = r.int(1, 6); let r2 = r.int(2, 9); while (r2 === r1) r2 = r.int(2, 9); const area = r.bool();
    const pic = beside([G.circleFig({ r: `${r1} cm`, W: 70 + 14 * r1, H: 70 + 14 * r1 }), G.circleFig({ r: `${r2} cm`, W: 70 + 14 * r2, H: 70 + 14 * r2 })], 8);
    return num(frac(area ? r1 * r1 : r1, area ? r2 * r2 : r2), [St(`All circles are similar. The scale factor is the ratio of the radii: ${r1}/${r2}.`, pic), St(area ? `Areas scale by its square: (${frac(r1, r2)})² = ${frac(r1 * r1, r2 * r2)}.` : `Circumferences are lengths, so their ratio is ${frac(r1, r2)}.`), St(`So the ratio is ${frac(area ? r1 * r1 : r1, area ? r2 * r2 : r2)}.`)],
      { q: `What is the ratio of the ${area ? 'areas' : 'circumferences'} of these two circles (first : second), as a fraction?`, visual: pic, expr: area ? `${r1 * r1}/${r2 * r2}` : `${r1}/${r2}` });
  }
  if (v === 5) {
    const [p, q] = r.pick([[2, 1], [3, 1], [3, 2], [5, 2], [5, 3], [4, 3]]), s = q * r.int(1, 5), A1 = q * q * r.int(1, 6), A2 = (A1 * p * p) / (q * q), val = (s * p) / q, shape = realTri(6, 5, 7);
    const pair = beside([scaled({ pts: shape, sides: [`${s} cm`, '', ''], notes: [{ at: cen(shape), s: `${A1} cm²`, t: 'hl2' }] }, (22 * q) / p, 30), scaled({ pts: shape, sides: ['x', '', ''], notes: [{ at: cen(shape), s: `${A2} cm²`, t: 'hl' }] }, 22, 30)], 8);
    return num(val, [St(`Areas scale by k²: k² = ${A2} ÷ ${A1} = ${frac(p * p, q * q)}.`, pair), St(`So k = √(${frac(p * p, q * q)}) = ${frac(p, q)}.`), St(`x = ${s} × ${frac(p, q)} = ${val}.`), St(`So x = ${val} cm.`)], { q: 'These triangles are similar, with the areas shown. Find x, in cm.', unit: 'x =', visual: pair, expr: `${s}*Math.sqrt(${A2}/${A1})` });
  }
  const [p, q] = r.pick([[1, 4], [4, 9], [9, 16], [2, 8], [3, 12], [8, 18], [4, 16], [16, 25], [1, 9]]), h = Math.sqrt(p * q);
  const pic = (hl, lab) => polyPlus({ pts: [[0, 0], [p + q, 0], [p, h]], right: [2], height: { from: 2, side: 0, label: lab }, names: ['A', 'B', 'C'], hl }, (m) => [text(add(m([p / 2, 0]), [0, 13]), `${p}`, 'ink', { size: 13 }), text(add(m([p + q / 2, 0]), [0, 13]), `${q}`, 'ink', { size: 13 })]);
  return num(h, [St('The altitude to the hypotenuse makes two smaller right triangles, each similar to the whole one.', pic(['height'], 'h')), St(`So h is the geometric mean of the two parts: h² = ${p} × ${q} = ${p * q}.`), St(`h = √${p * q} = ${h}.`), St(`So h = ${h}.`)], { q: 'The altitude h meets the hypotenuse of right triangle ABC, cutting it into the two parts shown. Find h.', unit: 'h =', visual: pic(null, 'h'), expr: `Math.sqrt(${p}*${q})` });
}

// ───────── grade 11 lessons: key ideas, each with its picture ─────────
export const LESSONS11 = {
  angles: [
    L('An angle in standard position starts on the positive x-axis (the initial arm) and turns to its terminal arm: anticlockwise for a positive angle, clockwise for a negative one.', angleFig({ deg: 130, quads: true })),
    L('The axes split the plane into Quadrants I to IV, anticlockwise from the top right. Quadrant II is from 90° to 180°.', angleFig({ deg: 200, quads: true, hlQuad: 2 })),
    L('Coterminal angles share the same terminal arm. They differ by whole turns: 45°, 405° and −315° all end in the same place.', { type: 'figs', figs: [angleFig({ deg: 45 }), angleFig({ deg: 405 }), angleFig({ deg: -315 })], captions: ['45°', '405°', '−315°'] }),
    L('The reference angle is the acute angle between the terminal arm and the x-axis. For 150° it is 180° − 150° = 30°.', angleFig({ deg: 150, ref: '30°', drop: true, hl: 'ref' })),
  ],
  righttri: [
    L('In a right triangle the hypotenuse c is across from the right angle and is the longest side. Pythagoras: a² + b² = c².', rtTri({ deg: 37, adj: 'b', opp: 'a', hyp: 'c', hl: 'hyp' })),
    L('To find a leg, subtract: a² = c² − b².', rtTri({ deg: 37, adj: '4', opp: 'a', hyp: '5', hl: 'opp' })),
    L('Compare c² with a² + b² for the longest side c: equal means right, bigger means obtuse, smaller means acute.', triFig({ A: 30, B: 40, sides: { a: 'a', b: 'b', c: 'c' }, angs: { C: '110°' }, hl: ['c', 'C'] })),
    L('Special triangles: 45-45-90 has sides 1, 1, √2. 30-60-90 has sides 1, √3, 2 (the short leg is across from 30°).', { type: 'figs', figs: [special(45), special(30)], captions: ['45-45-90', '30-60-90'] }),
  ],
  trigratio: [
    L('Name the sides from the angle θ: the opposite side is across from θ, the adjacent side touches θ, and the hypotenuse is across from the right angle.', rtTri({ deg: 37, opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse', ang: 'θ', hl: 'ang' })),
    L('SOH CAH TOA: sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent. Here sin θ = 3/5.', rtTri({ deg: 36.87, opp: '3', adj: '4', hyp: '5', ang: 'θ', hl: ['opp', 'hyp'] })),
    L('csc, sec and cot are the reciprocals: csc θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ. Here sec θ = 5/4.', rtTri({ deg: 36.87, opp: '3', adj: '4', hyp: '5', ang: 'θ', hl: ['adj', 'hyp'] })),
    L('Exact values come from the special triangles: sin 30° = 1/2, cos 30° = √3/2, tan 45° = 1.', { type: 'figs', figs: [special(30, ['opp', 'hyp']), special(45, ['opp', 'adj'])], captions: ['sin 30° = 1/2', 'tan 45° = 1'] }),
  ],
  trigsolve: [
    L('To find a side: choose the ratio that links the side you know to the side you want, then solve. Here x = 10 sin 40°.', rtTri({ deg: 40, hyp: '10', opp: 'x', ang: '40°', hl: ['opp', 'hyp'] })),
    L('To find an angle: use the inverse ratio. tan θ = 5/8, so θ = tan⁻¹(5/8) ≈ 32°.', rtTri({ deg: 32, opp: '5', adj: '8', ang: 'θ', hl: 'ang' })),
    L('The angle of elevation is measured up from the horizontal; the angle of depression is measured down. They are equal, as alternate angles.', depFig({ a: 35, h: 'h', d: 'd', hl: ['top', 'boat'] })),
    L('Trig equations: on the unit circle sin x is the y-coordinate. sin x = 1/2 where the line y = 1/2 meets the circle: x = 30° or 150°.', eqCircle('sin', '1/2', 0.5, [30, 150])),
  ],
  triglaws: [
    L('Label a triangle so each side is across from the angle with the same letter: a across from A, b across from B, c across from C.', triFig({ A: 50, B: 65, sides: { a: 'a', b: 'b', c: 'c' }, angs: { A: 'A', B: 'B', C: 'C' } })),
    L('Sine Law: a/sin A = b/sin B = c/sin C. Use it when you know a complete pair (a side and its opposite angle).', triFig({ A: 50, B: 65, sides: { a: '12', b: 'b' }, angs: { A: '50°', B: '65°' }, hl: ['a', 'A'] })),
    L('Cosine Law: c² = a² + b² − 2ab cos C. Use it for two sides and the angle between them, or for all three sides.', triFig({ A: 45, B: 60, sides: { a: '9', b: '7', c: 'c' }, angs: { C: '75°' }, hl: ['a', 'b', 'C'] })),
    L('Area = ½ab sin C, with C the angle between sides a and b.', triFig({ A: 45, B: 60, sides: { a: 'a', b: 'b' }, angs: { C: 'C' }, hl: ['a', 'b', 'C'] })),
  ],
  polygons: [
    L('A polygon is named by its number of sides: pentagon 5, hexagon 6, octagon 8, decagon 10.', G.polygonFig({ pts: G.regular(6), sides: ['1', '2', '3', '4', '5', '6'] })),
    L('Diagonals from one corner cut an n-gon into n − 2 triangles, so its interior angles add to (n − 2) × 180°.', G.triangulated(G.regular(6))),
    L('In a regular polygon all angles are equal. The exterior angles always add to 360°, so each is 360° ÷ n.', G.polygonFig({ pts: G.regular(5), ticks: [1, 1, 1, 1, 1], ext: 1, extLabel: '72°', angles: ['', '108°'] })),
    L('Parallelogram: opposite sides parallel and equal, opposite angles equal, next-door angles add to 180°, diagonals bisect each other.', G.polygonFig({ ...QUADS.Parallelogram, diag: [[0, 2], [1, 3]] })),
    L('Marks name the quadrilateral: ticks for equal sides, arrows for parallel sides, squares for right angles.', { type: 'figs', figs: [G.polygonFig(QUADS.Rhombus), G.polygonFig(QUADS.Trapezoid), G.polygonFig(QUADS.Kite)], captions: ['Rhombus', 'Trapezoid', 'Kite'] }),
  ],
  area2d: [
    L('Triangle: A = base × height ÷ 2. The height is at right angles to the base.', G.polygonFig({ pts: [[0, 0], [8, 0], [2.5, 5]], sides: ['b', '', ''], base: 0, height: { from: 2, side: 0, label: 'h' }, hl: ['base', 'height'] })),
    L('Trapezoid: A = (a + b) × h ÷ 2, where a and b are the parallel sides.', G.polygonFig({ pts: [[0, 0], [9, 0], [7, 4], [2, 4]], sides: ['b', '', 'a', ''], height: { from: 3, side: 0, label: 'h' }, par: [1, 0, 1, 0] })),
    L('Circle: A = πr² and C = 2πr. A sector with angle θ is θ/360 of the circle.', sectorFig({ deg: 120, r: 'r', th: '120°' })),
    L('Similar figures with scale factor k: lengths and perimeters scale by k, areas by k².', beside([scaled({ pts: [[0, 0], [4, 0], [1.2, 2.6]], sides: ['2', '', ''] }, 26, 30), scaled({ pts: [[0, 0], [8, 0], [2.4, 5.2]], sides: ['4', '', ''] }, 26, 30)], 4)),
  ],
  solids: [
    L('Faces are flat surfaces, edges are where two faces meet, vertices are corners. Dashed edges are hidden at the back.', G.prismFig({ base: G.regular(5, 3), depth: 4 })),
    L('A prism with an n-sided base has n + 2 faces, 3n edges and 2n vertices. Euler: F + V − E = 2.', G.boxFig({ l: 6, w: 3, h: 4 })),
    L('A net is the solid unfolded flat.', { type: 'figs', figs: [G.netFig({ cells: G.CUBE_NETS[5] }), G.pyramidNet(), G.cylinderNet()], captions: ['Cube', 'Square pyramid', 'Cylinder'] }),
    L('A cross-section is the face a flat cut leaves behind.', { type: 'figs', figs: [G.sliceFig({ solid: 'cone', cut: 'across' }), G.sliceFig({ solid: 'cone', cut: 'down' })], captions: ['Circle', 'Triangle'] }),
  ],
  volume: [
    L('Prism or cylinder: V = base area × height (layers of the base stacked up).', G.boxFig({ l: 4, w: 3, h: 2, cubes: true })),
    L('Pyramid or cone: V = ⅓ × base area × height.', { type: 'figs', figs: [G.pyramidFig({ a: 5, h: 6, labels: ['', 'h', ''] }), G.coneFig({ r: 3, h: 6, labels: ['r', 'h', ''] })], captions: ['Pyramid', 'Cone'] }),
    L('Surface area: unfold the solid into its net and add up every face.', G.cylinderNet({ labels: ['r', 'h', '2πr'], hl: 'rect' })),
    L('Sphere: V = 4/3 πr³ and SA = 4πr².', G.sphereFig({ labels: ['r'], hl: 'radius' })),
    L('Similar solids with scale factor k: surface areas scale by k², volumes by k³.', G.similarBoxes({ k: 2 })),
  ],
  congruent: [
    L('Congruent triangles are exact copies. In △ABC ≅ △DEF the letters match in order: A ↔ D, B ↔ E, C ↔ F.', pairOf('ABC', 'DEF', { ticks: [1, 2, 3], arcs: [1, 2, 3] })),
    L('SSS and SAS: three pairs of equal sides, or two sides with the angle between them.', beside([pairOf('ABC', 'DEF', MARKS.SSS)], 0)),
    L('ASA and AAS: two angles and a side. HL: right triangles with equal hypotenuses and one equal leg.', pairOf('ABC', 'DEF', MARKS.ASA)),
    L('SSA and AAA do not prove congruence: triangles with those parts can still be different sizes or shapes.', pairOf('ABC', 'DEF', MARKS.SSA)),
  ],
  angleproof: [
    L('Vertical angles (opposite at a crossing) are equal. Angles on a straight line add to 180°.', crossPair(55, '55°', '55°')),
    L('Parallel lines cut by a transversal: corresponding angles are equal.', G.transversalFig({ deg: 60, labels: { 1: '60°', 5: '60°' }, hl: [1, 5] })),
    L('Alternate interior angles are equal; same-side interior angles add to 180°.', G.transversalFig({ deg: 60, labels: { 3: '60°', 5: '60°', 6: '120°' }, hl: [3, 5] })),
    L('At a right angle the two parts are complementary: they add to 90°.', G.anglePairFig({ kind: 'comp', deg: 35, labels: ['35°', '55°'] })),
  ],
  triangles: [
    L('The angles of a triangle add to 180°. An exterior angle equals the two far interior angles added.', G.polygonFig({ pts: triPts(50, 60), angles: ['50°', '60°', ''], ext: 2, extLabel: '110°' })),
    L('Any two sides must add to more than the third side.', G.polygonFig({ pts: [[0, 0], [7, 0], [2.4, 4]], sides: ['c', 'a', 'b'] })),
    L('A midsegment joins the midpoints of two sides: it is parallel to the third side and half as long.', polyPlus({ pts: [[0, 0], [8, 0], [5.5, 2.5], [3, 5], [1.5, 2.5]], ticks: [0, 1, 1, 2, 2], diag: [[4, 2, 'hlline']], sides: ['10', '', '', '', ''] }, (m) => text(add(mid(m([1.5, 2.5]), m([5.5, 2.5])), [0, -12]), '5', 'hl'))),
    L('Segments in a triangle: a median goes to a midpoint, an altitude meets a side at a right angle, an angle bisector halves an angle.', { type: 'figs', figs: [segFig('Median', true), segFig('Altitude', true), segFig('Angle bisector', true)], captions: ['Median', 'Altitude', 'Angle bisector'] }),
  ],
  similar: [
    L('Similar figures have the same shape: equal angles and matching sides in the same ratio.', beside([scaled({ pts: realTri(5, 6, 7), names: ['A', 'B', 'C'], sides: ['7', '5', '6'] }, 16), scaled({ pts: realTri(10, 12, 14), names: ['D', 'E', 'F'], sides: ['14', '10', '12'] }, 16)], 8)),
    L('The scale factor is a matching side of the new figure divided by the old one: 14 ÷ 7 = 2. Multiply any side by it.', beside([scaled({ pts: realTri(5, 6, 7), sides: ['7', '', ''], hl: [{ side: 0 }] }, 16), scaled({ pts: realTri(10, 12, 14), sides: ['14', '', ''], hl: [{ side: 0 }] }, 16)], 8)),
    L('Indirect measurement: at the same moment, height ÷ shadow is the same for a person and a tree.', beside([scaled({ pts: [[0, 0], [2, 0], [2, 1.6]], right: [1], sides: ['2 m', '1.6 m', ''] }, 34), scaled({ pts: [[0, 0], [8, 0], [8, 6.4]], right: [1], sides: ['8 m', 'h', ''] }, 15)], 10)),
  ],
  similar2: [
    L('Triangles are similar by AA (two equal angles), SSS similarity (all sides in one ratio) or SAS similarity.', beside([scaled({ pts: triPts(48, 62).map(([x, y]) => [x * 6, y * 6]), angles: ['48°', '62°', ''] }, 30), scaled({ pts: triPts(48, 62).map(([x, y]) => [x * 9, y * 9]), angles: ['48°', '62°', ''] }, 30)], 8)),
    L('With scale factor k, areas scale by k². Twice as long means four times the area.', beside([scaled({ pts: realTri(5, 6, 7), notes: [{ at: cen(realTri(5, 6, 7)), s: 'A', t: 'hl2' }] }, 17, 30), scaled({ pts: realTri(5, 6, 7), notes: [{ at: cen(realTri(5, 6, 7)), s: '4A', t: 'hl' }] }, 34, 30)], 8)),
    L('A line parallel to one side cuts the other two sides in the same ratio: AD/DB = AE/EC.', polyPlus({ pts: [[0, 0], [9, 0], [6.1, 3], [3.2, 6], [1.6, 3]], names: ['B', 'C', 'E', 'A', 'D'], par: [1, 0, 0, 0, 0], diag: [[4, 2, 'hlline']] }, (m) => G.parArrows(m([1.6, 3]), m([6.1, 3]), 1))),
  ],
};

// ════════════════════════ grade 12 ════════════════════════
export const piS = (n, d) => { const [a, b] = simplify(n, d); if (a === 0) return '0'; return `${a < 0 ? '−' : ''}${Math.abs(a) === 1 ? '' : Math.abs(a)}π${b === 1 ? '' : '/' + b}`; };
const radOf = (deg) => piS(deg, 180);
const fm = (s) => String(s).replace(/^-/, '−');
const MAG = { sin: { 0: '0', 30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1' }, cos: { 0: '1', 30: '√3/2', 45: '√2/2', 60: '1/2', 90: '0' }, tan: { 0: '0', 30: '√3/3', 45: '1', 60: '√3' } };
// the exact value of sin, cos or tan at a multiple of 30° or 45°
export const exact = (f, deg) => { const n = norm(deg), m = MAG[f][refOf(n)]; if (m === '0') return '0'; const v = { sin: Math.sin, cos: Math.cos, tan: Math.tan }[f](n * RAD); return v < 0 ? `−${m}` : m; };
const flip = (s) => (s === '0' ? '0' : s.startsWith('−') ? s.slice(1) : `−${s}`);
const coords = (d) => `(${exact('cos', d)}, ${exact('sin', d)})`;
const SPEC = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
const where = (n) => (n % 90 === 0 ? `on the ${['positive x', 'positive y', 'negative x', 'negative y'][n / 90]}-axis` : `in Quadrant ${QN[Math.floor(n / 90)]}`);

// ───────── 12. radians, arc length and reference angles ─────────
export function radians(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const deg = r.pick([30, 45, 60, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330]), right = radOf(deg);
    return mc(r, right, [piS(deg, 360), piS(180, deg), piS(deg, 90)].filter((x) => x !== right), { q: `Convert ${deg}° to radians.`, visual: angleFig({ deg }),
      steps: [St('A half turn is 180°, which is π radians. So multiply degrees by π/180.', angleFig({ deg: 180, label: '180° = π', hl: 'turn' })), St(`${deg} × π/180 = ${right}.`, angleFig({ deg, rad: true, label: right, hl: 'turn' }))] });
  }
  if (v === 1) {
    const d = r.pick([2, 3, 4, 6, 12]), n = r.int(1, 2 * d), deg = (180 * n) / d;
    return num(deg, [St('π radians is a half turn, 180°. Replace π with 180°.', angleFig({ deg: 180, rad: true, label: 'π = 180°', hl: 'turn' })), St(`${piS(n, d)} = ${n} × 180° ÷ ${d} = ${dec(deg)}°.`, angleFig({ deg, label: `${dec(deg)}°`, hl: 'turn' })), St(`So ${piS(n, d)} is ${dec(deg)}°.`)], { q: `Convert ${piS(n, d)} radians to degrees.`, visual: angleFig({ deg, rad: true, label: piS(n, d) }), expr: `${n}*180/${d}` });
  }
  if (v === 2 || v === 5 || v === 6) {
    const rr = r.int(2, 20), dpi = v === 2 && r.bool(), th = dpi ? null : r.int(5, 30) / 10, [n, d] = dpi ? r.pick([[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6], [1, 2]]) : [0, 0], ang = dpi ? (n * Math.PI) / d : th, thS = dpi ? piS(n, d) : `${th}`, deg = ang / RAD;
    if (v === 2) {
      const s = rr * ang, ans = dec(s, 1), pic = (hl) => sectorFig({ deg, r: `${rr} cm`, th: thS, s: 's', hl });
      return num(ans, [St('Arc length s = rθ with θ in radians: one radian of turn sweeps one radius of arc.', pic(['radius', 'angle'])), St(`s = ${rr} × ${thS} ≈ ${ans}.`, pic('arc')), St(`So the arc is about ${ans} cm long.`)], { q: `Find the arc length s, in cm. The angle is in radians. Round to 1 decimal place.`, unit: 's =', visual: pic(), tol: 0.051, expr: `${rr}*${dpi ? `${n}*Math.PI/${d}` : th}` });
    }
    if (v === 5) {
      const s = dec(rr * th), pic = (hl) => sectorFig({ deg, r: `${rr} cm`, th: 'θ', s: `${s} cm`, hl });
      return num(dec(th), [St('s = rθ, so θ = s ÷ r: how many radii fit along the arc.', pic(['arc', 'radius'])), St(`θ = ${s} ÷ ${rr} = ${dec(th)}.`, pic('angle')), St(`So θ = ${dec(th)} radians.`)], { q: 'Find the central angle θ, in radians.', unit: 'θ =', visual: pic(), expr: `${s}/${rr}` });
    }
    const A = 0.5 * rr * rr * th, ans = dec(A, 1), pic = (hl) => sectorFig({ deg, r: `${rr} cm`, th: thS, hl });
    return num(ans, [St(`A sector is the fraction θ/(2π) of the circle, so its area is θ/(2π) × πr² = ½r²θ (θ in radians).`, pic(['angle', 'radius'])), St(`A = ½ × ${rr}² × ${thS} = ${dec(rr * rr / 2)} × ${thS} ≈ ${ans}.`, pic('fill')), St(`So the sector's area is about ${ans} cm².`)], { q: 'Find the area of this sector, in cm². The angle is in radians. Round to 1 decimal place.', visual: pic(), tol: 0.051, expr: `0.5*${rr}**2*${th}` });
  }
  if (v === 3) {
    const [n, d] = r.pick([[2, 3], [3, 4], [5, 6], [7, 6], [5, 4], [4, 3], [5, 3], [7, 4], [11, 6]]), x = n / d, rd = x < 1 ? 1 - x : x < 1.5 ? x - 1 : 2 - x, right = piS(Math.round(rd * d), d), deg = (180 * n) / d, Q = x < 1 ? 'II' : x < 1.5 ? 'III' : 'IV';
    const how = x < 1 ? `π − ${piS(n, d)}` : x < 1.5 ? `${piS(n, d)} − π` : `2π − ${piS(n, d)}`;
    return mc(r, right, ['π/6', 'π/4', 'π/3', 'π/2'].filter((s) => s !== right), { q: `What is the reference angle of ${piS(n, d)}?`, visual: angleFig({ deg, rad: true, label: piS(n, d), quads: true }),
      steps: [St(`${piS(n, d)} is in Quadrant ${Q}.`, angleFig({ deg, rad: true, label: piS(n, d), quads: true, hlQuad: ['', 'II', 'III', 'IV'].indexOf(Q) })), St(`The reference angle is its distance to the x-axis: ${how} = ${right}.`, angleFig({ deg, rad: true, label: piS(n, d), ref: right, drop: true, hl: 'ref' }))] });
  }
  const deg = r.pick([120, 135, 150, 210, 225, 240, 300, 315, 330]), f = r.pick(['sin', 'cos', 'tan']), q = Math.floor(deg / 90), ref = refOf(deg), mag = SPECIAL[f][ref], right = exact(f, deg), pos = !right.startsWith('−');
  const pool = ['1/2', '√2/2', '√3/2', '1', '√3', '√3/3'].flatMap((x) => [x, `−${x}`]).filter((x) => x !== right && x !== flip(right));
  return mc(r, right, [flip(right), ...r.shuffle(pool).slice(0, 2)], { q: `What is the exact value of ${f} ${deg}°?`, visual: unitFig({ pts: [{ deg, label: 'P', arc: `${deg}°` }], quads: true }),
    steps: [St(`${deg}° is in Quadrant ${QN[q]}, with reference angle ${ref}°.`, unitFig({ pts: [{ deg, label: 'P', arc: `${deg}°` }], quads: true, hlQuad: q, tri: { deg, x: 'x', y: 'y' } })), St(`At P, ${f === 'sin' ? 'y' : f === 'cos' ? 'x' : 'y ÷ x'} is ${pos ? 'positive' : 'negative'}, so ${f} ${deg}° is ${pos ? 'positive' : 'negative'}.`, unitFig({ pts: [{ deg, label: coords(deg) }], tri: { deg, hl: f === 'sin' ? 'y' : f === 'cos' ? 'x' : ['x', 'y'] } })), St(`${f} ${ref}° = ${mag}, so ${f} ${deg}° = ${right}.`)] });
}

// ───────── 12. the unit circle ─────────
export function unitCircle(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const deg = r.pick([...SPEC, 0, 90, 180, 270]), f = r.pick(['sin', 'cos']), g = f === 'sin' ? 'cos' : 'sin', rad = radOf(deg), right = exact(f, deg);
    const pool = ['0', '1', '1/2', '√2/2', '√3/2'].flatMap((x) => [x, flip(x)]).filter((x) => x !== right && x !== flip(right) && x !== exact(g, deg));
    return mc(r, right, [flip(right), exact(g, deg), ...r.shuffle(pool)].filter((x) => x !== right).slice(0, 3), { q: `P is at angle θ = ${rad} on the unit circle. What is ${f} θ?`, visual: unitFig({ pts: [{ deg, label: 'P', arc: rad }] }),
      steps: [St(`${rad} = ${deg}°, ${where(deg)}.`, unitFig({ pts: [{ deg, label: 'P', arc: `${deg}°` }], tri: { deg, x: 'cos θ', y: 'sin θ' } })), St(`On the unit circle P = (cos θ, sin θ) = ${coords(deg)}.`, unitFig({ pts: [{ deg, label: coords(deg) }], tri: { deg, hl: f === 'sin' ? 'y' : 'x' } })), St(`So ${f}(${rad}) = ${right}.`)] });
  }
  if (v === 1 || v === 5) {
    const deg = r.pick(SPEC), rad = radOf(deg), ref = refOf(deg);
    if (v === 1) {
      const right = rad, wr = [ref, 180 - ref, 180 + ref, 360 - ref].filter((d) => d !== deg).map(radOf);
      return mc(r, right, wr, { q: 'Point P is on the unit circle. Which angle θ, between 0 and 2π, has its terminal arm through P?', visual: unitFig({ pts: [{ deg, label: coords(deg) }], quads: true }),
        steps: [St(`P is in Quadrant ${QN[Math.floor(deg / 90)]}. Its coordinates show a reference angle of ${radOf(ref)} (${ref}°).`, unitFig({ pts: [{ deg, label: coords(deg) }], quads: true, hlQuad: Math.floor(deg / 90), tri: { deg } })), St(`Measured from the positive x-axis, θ = ${deg}° = ${right}.`, unitFig({ pts: [{ deg, label: right, arc: true, t: 'hl' }] }))] });
    }
    const right = coords(deg), c = exact('cos', deg), s = exact('sin', deg);
    return mc(r, right, [`(${s}, ${c})`, `(${flip(c)}, ${s})`, `(${c}, ${flip(s)})`, `(${flip(c)}, ${flip(s)})`].filter((x) => x !== right), { q: `θ = ${rad}. What are the coordinates of P on the unit circle?`, visual: unitFig({ pts: [{ deg, label: 'P', arc: rad }] }),
      steps: [St(`${rad} = ${deg}°, in Quadrant ${QN[Math.floor(deg / 90)]}, reference angle ${ref}°: the sizes are cos ${ref}° = ${MAG.cos[ref]} and sin ${ref}° = ${MAG.sin[ref]}.`, unitFig({ pts: [{ deg, label: 'P', arc: rad }], tri: { deg, x: 'x', y: 'y' } })), St(`Signs from the quadrant: x is ${c.startsWith('−') ? 'negative' : 'positive'} and y is ${s.startsWith('−') ? 'negative' : 'positive'}. P = ${right}.`, unitFig({ pts: [{ deg, label: right }], tri: { deg, hl: ['x', 'y'] } }))] });
  }
  if (v === 2) {
    const [a, b, h] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]]), sx = r.bool() ? 1 : -1, sy = r.bool() ? 1 : -1, X = sx * a, Y = sy * b, deg = Math.atan2(Y, X) / RAD;
    const f = r.pick(['sin', 'cos', 'tan', 'csc', 'sec', 'cot']), [nn, dd] = { sin: [Y, h], cos: [X, h], tan: [Y, X], csc: [h, Y], sec: [h, X], cot: [X, Y] }[f], ans = frac(nn, dd);
    const xs = fm(frac(X, h)), ys = fm(frac(Y, h)), how = { sin: 'y', cos: 'x', tan: 'y ÷ x', csc: '1 ÷ y', sec: '1 ÷ x', cot: 'x ÷ y' }[f];
    return num(ans, [St(`On the unit circle, x = cos θ and y = sin θ. Here x = ${xs} and y = ${ys}.`, unitFig({ pts: [{ deg, label: `(${xs}, ${ys})` }], tri: { deg, x: xs, y: ys, hl: ['x', 'y'] } })), St(`${f} θ = ${how} = ${fm(ans)}.`), St(`So ${f} θ = ${fm(ans)}.`)],
      { q: `The terminal arm of θ meets the unit circle at P(${xs}, ${ys}). Find ${f} θ as a fraction.`, visual: unitFig({ pts: [{ deg, label: `P(${xs}, ${ys})`, arc: 'θ' }] }), expr: `${nn}/${dd}` });
  }
  if (v === 3) {
    const q = r.int(0, 3), deg = q * 90 + r.pick([25, 40, 55]), f = r.pick(['sin', 'cos', 'tan']), x = q === 0 || q === 3, y = q <= 1, val = f === 'sin' ? y : f === 'cos' ? x : x === y, right = val ? 'Positive' : 'Negative';
    return mc(r, right, ['Positive', 'Negative'], { q: `The terminal arm of θ is in Quadrant ${QN[q]}. Is ${f} θ positive or negative?`, visual: unitFig({ quads: true, hlQuad: q, pts: [{ deg, label: 'P' }] }),
      steps: [St(`In Quadrant ${QN[q]}, x is ${x ? 'positive' : 'negative'} and y is ${y ? 'positive' : 'negative'}.`, unitFig({ quads: true, hlQuad: q, pts: [{ deg, label: `(${x ? '+' : '−'}, ${y ? '+' : '−'})` }], tri: { deg, hl: ['x', 'y'] } })), St(`${f} θ = ${f === 'sin' ? 'y' : f === 'cos' ? 'x' : 'y ÷ x'}, so it is ${right.toLowerCase()}.`)] });
  }
  if (v === 4) {
    const deg = r.pick([0, 90, 180, 270]), f = deg % 180 === 0 ? r.pick(['sin', 'cos', 'tan']) : r.pick(['sin', 'cos']), ans = { sin: Math.round(Math.sin(deg * RAD)), cos: Math.round(Math.cos(deg * RAD)), tan: 0 }[f], rad = radOf(deg);
    return num(ans, [St(`${rad} = ${deg}° ends ${where(deg)}, at ${coords(deg)}.`, unitFig({ pts: [{ deg, label: coords(deg), arc: deg ? rad : '' }] })), St(`${f} = ${f === 'sin' ? 'y' : f === 'cos' ? 'x' : 'y ÷ x'} = ${neg(ans)}.`), St(`So ${f}(${rad}) = ${neg(ans)}.`)], { q: `Use the unit circle: what is ${f}(${rad})?`, visual: unitFig({ pts: [] }), expr: `${ans}` });
  }
  const deg = r.pick(SPEC), rad = radOf(deg), right = exact('tan', deg), ref = refOf(deg);
  return mc(r, right, [flip(right), MAG.tan[ref === 30 ? 60 : ref === 60 ? 30 : 30], flip(MAG.tan[ref === 30 ? 60 : 30])].filter((x) => x !== right), { q: `What is the exact value of tan(${rad})?`, visual: unitFig({ pts: [{ deg, label: 'P', arc: rad }] }),
    steps: [St(`At ${rad} (${deg}°), P = ${coords(deg)}.`, unitFig({ pts: [{ deg, label: coords(deg) }], tri: { deg, hl: ['x', 'y'] } })), St(`tan θ = y ÷ x = ${exact('sin', deg)} ÷ ${exact('cos', deg)} = ${right}.`)] });
}

// ───────── 12. solve triangles ─────────
function ssaFig({ A, b, a, show }) {
  const C = [b * Math.cos(A * RAD), b * Math.sin(A * RAD)], h = C[1], d = a > h ? Math.sqrt(a * a - h * h) : 0, X = Math.max(C[0] + d, b) + 2;
  const F = G.frame([[0, 0], [X, 0], C, ...(show ? [[C[0] - a, C[1]], [C[0] + a, C[1]], [C[0], C[1] - a]] : [])], { W: 320, H: 230, pad: 30 }), m = F.m, O = m([0, 0]);
  const items = [line(O, m([X, 0]), 'ink'), line(O, m(C), 'ink'), ...angleArc(O, m([X, 0]), m(C), `${A}°`, 26), G.sideLabel(O, m(C), `b = ${b}`, m([X * 0.6, 0])), text(add(O, [-8, 10]), 'A', 'muted', { size: 13 }), text(add(m(C), [0, -12]), 'C', 'muted', { size: 13 }), dot(m(C))];
  if (show) {
    items.push(line(m(C), m([C[0], 0]), 'aux'), text(add(mid(m(C), m([C[0], 0])), [-14, 0]), 'h', 'hl'), path(`M${m([C[0] - a, C[1]]).map(R1).join(' ')}A${R1(a * F.s)} ${R1(a * F.s)} 0 0 0 ${m([C[0] + a, C[1]]).map(R1).join(' ')}`, 'aux'));
    for (const x of [C[0] - d, C[0] + d]) if (a > h && x > 0.01) items.push(dot(m([x, 0]), 'hl'), line(m(C), m([x, 0]), 'hlline'));
    items.push(text(add(m(C), [14, -8]), `a = ${a}`, 'hl', { anchor: 'start' }));
  } else items.push(text(add(m(C), [14, 4]), `a = ${a}`, 'hl', { anchor: 'start' }));
  return fig(items, F.W, F.H);
}
export function trisolve(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const th = r.int(26, 64), a = r.int(4, 30), val = Math.tan(th * RAD), ans = dec(a * val, 1), pic = (hl) => rtTri({ deg: th, adj: `${a} cm`, opp: 'x', ang: `${th}°`, hl });
    return num(ans, [St(`From the ${th}° angle, x is opposite and ${a} cm is adjacent: tan ${th}° = x ÷ ${a}.`, pic(['opp', 'adj', 'ang'])), St(`x = ${a} × tan ${th}° = ${a} × ${dec(val, 4)}.`), St(`x ≈ ${ans} cm.`)], { q: 'Find x, in cm. Round to 1 decimal place.', unit: 'x =', visual: pic(), tol: 0.051, expr: `${a}*Math.tan(${th}*Math.PI/180)` });
  }
  if (v === 1) {
    const h = r.int(8, 30), o = r.int(Math.ceil(h * 0.45), Math.floor(h * 0.89)), A = Math.asin(o / h) / RAD, ans = Math.round(A), pic = (hl) => rtTri({ deg: A, opp: `${o} cm`, hyp: `${h} cm`, ang: 'θ', hl });
    return num(ans, [St(`The opposite side and the hypotenuse are known, so use sin: sin θ = ${o}/${h}.`, pic(['opp', 'hyp'])), St(`θ = sin⁻¹(${o}/${h}) ≈ ${A.toFixed(2)}°.`, pic('ang')), St(`So θ ≈ ${ans}°.`)], { q: 'Find θ to the nearest degree.', unit: 'θ =', visual: pic(), tol: 0.51, expr: `Math.asin(${o}/${h})*180/Math.PI` });
  }
  if (v === 2) return triglaws(r.int(0, 1) ? { ...r, int: (lo, hi) => (lo === 0 && hi === 7 ? 4 : r.int(lo, hi)) } : { ...r, int: (lo, hi) => (lo === 0 && hi === 7 ? 7 : r.int(lo, hi)) });
  if (v === 3) return triglaws({ ...r, int: (lo, hi) => (lo === 0 && hi === 7 ? r.pick([1, 2, 3]) : r.int(lo, hi)) });
  if (v === 4) {
    let a, b, c, guard = 0; do { a = r.int(4, 15); b = r.int(4, 15); c = r.int(4, 15); } while ((a + b <= c || a + c <= b || b + c <= a || Math.min(...anglesOf(a, b, c)) < 20) && guard++ < 300);
    if (guard >= 300) [a, b, c] = [7, 8, 9];
    const s = (a + b + c) / 2, val = Math.sqrt(s * (s - a) * (s - b) * (s - c)), ans = dec(val, 1), [A, B] = anglesOf(a, b, c), pic = triFig({ A, B, sides: { a: `${a}`, b: `${b}`, c: `${c}` } });
    return num(ans, [St(`Heron's formula needs only the three sides. First the semi-perimeter: s = (${a} + ${b} + ${c}) ÷ 2 = ${dec(s)}.`, pic), St(`Area = √(s(s − a)(s − b)(s − c)) = √(${dec(s)} × ${dec(s - a)} × ${dec(s - b)} × ${dec(s - c)}) = √${dec(s * (s - a) * (s - b) * (s - c), 4)}.`), St(`Area ≈ ${ans} cm².`)],
      { q: `Use Heron's formula to find the area of this triangle (sides in cm), in cm². Round to 1 decimal place.`, visual: pic, tol: 0.051, expr: `Math.sqrt(${s}*(${s}-${a})*(${s}-${b})*(${s}-${c}))` });
  }
  if (v === 5) {
    let A, b, a, h, kind, guard = 0;
    do { A = r.int(25, 60); b = r.int(8, 20); h = b * Math.sin(A * RAD); kind = r.int(0, 2); const lo = [Math.max(2, Math.ceil(h * 0.5)), b, Math.ceil(h + 0.4)][kind], hi = [Math.floor(h - 0.4), b + 6, b - 1][kind]; a = lo <= hi ? r.int(lo, hi) : null; } while (a == null && guard++ < 100);
    if (a == null) { A = 30; b = 12; a = 8; h = 6; kind = 2; }
    const right = ['No triangle', 'One triangle', 'Two triangles'][kind];
    return mc(r, right, ['No triangle', 'One triangle', 'Two triangles'], { q: `In △ABC, ∠A = ${A}°, b = ${b} and a = ${a}. Side a hangs from C and must reach the bottom line. How many triangles are possible?`, visual: ssaFig({ A, b, a }),
      steps: [St(`The shortest distance from C to the bottom line is the height h = b sin A = ${b} × sin ${A}° ≈ ${dec(h, 2)}.`, ssaFig({ A, b, a, show: true })),
        St(kind === 0 ? `a = ${a} is shorter than h ≈ ${dec(h, 2)}: the swing of a never reaches the line.` : kind === 2 ? `h ≈ ${dec(h, 2)} < a = ${a} < b = ${b}: the swing of a crosses the line at two points, both to the right of A.` : `a = ${a} is at least b = ${b}: the swing crosses the line once to the right of A (the other crossing is behind A).`),
        St(`So there ${kind === 1 ? 'is' : 'are'} ${right.toLowerCase().replace('no triangle', 'no triangles')}.`)] });
  }
  const p = r.int(5, 30), q = r.int(5, 30), R = r.int(30, 130), c = Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(R * RAD)), [A, B] = anglesOf(q, p, c), ans = dec(c, 1);
  const pic = (hl) => triFig({ A, B, names: ['S', 'T', 'P'], sides: { a: `${q} km`, b: `${p} km`, c: 'd' }, angs: { C: `${R}°` }, hl });
  return num(ans, [St(`The ships and the port make a triangle. The ${R}° angle at the port is between the sides ${p} km and ${q} km, so use the Cosine Law.`, pic(['a', 'b', 'C'])), St(`d² = ${p}² + ${q}² − 2(${p})(${q}) cos ${R}° ≈ ${dec(c * c, 2)}.`, pic('c')), St(`d = √${dec(c * c, 2)} ≈ ${ans}.`), St(`So the ships are about ${ans} km apart.`)],
    { q: `Two ships leave port P. Ship S sails ${p} km and ship T sails ${q} km, on courses ${R}° apart. How far apart are they, in km? Round to 1 decimal place.`, unit: 'd =', visual: pic(), tol: 0.051, expr: `Math.sqrt(${p}**2+${q}**2-2*${p}*${q}*Math.cos(${R}*Math.PI/180))` });
}

// ───────── 12. inverse trig and trig equations ─────────
const INV = [['sin⁻¹(1/2)', 30, 'sin', '1/2', 0.5], ['sin⁻¹(−1/2)', -30, 'sin', '−1/2', -0.5], ['cos⁻¹(1/2)', 60, 'cos', '1/2', 0.5], ['cos⁻¹(−1/2)', 120, 'cos', '−1/2', -0.5], ['tan⁻¹(1)', 45, 'tan', '1', 1], ['tan⁻¹(−1)', -45, 'tan', '−1', -1], ['sin⁻¹(√3/2)', 60, 'sin', '√3/2', Math.sqrt(3) / 2], ['cos⁻¹(0)', 90, 'cos', '0', 0], ['tan⁻¹(√3)', 60, 'tan', '√3', Math.sqrt(3)], ['cos⁻¹(−√2/2)', 135, 'cos', '−√2/2', -Math.SQRT1_2], ['sin⁻¹(1)', 90, 'sin', '1', 1]];
const LINEQ = [['2 sin x − 1 = 0', 'sin', '1/2', 0.5, [30, 150]], ['2 cos x + 1 = 0', 'cos', '−1/2', -0.5, [120, 240]], ['tan x − 1 = 0', 'tan', '1', 1, [45, 225]], ['2 sin x + √3 = 0', 'sin', '−√3/2', -Math.sqrt(3) / 2, [240, 300]], ['√2 cos x − 1 = 0', 'cos', '√2/2', Math.SQRT1_2, [45, 315]], ['2 cos x − √3 = 0', 'cos', '√3/2', Math.sqrt(3) / 2, [30, 330]], ['sin x + 1 = 0', 'sin', '−1', -1, [270]], ['√3 tan x + 1 = 0', 'tan', '−√3/3', -Math.sqrt(3) / 3, [150, 330]]];
const RADEQ = [['sin x = 1/2', 'sin', '1/2', 0.5, [30, 150], ['π/3 and 2π/3', 'π/6 and 7π/6', 'π/6 and 11π/6']], ['cos x = 1/2', 'cos', '1/2', 0.5, [60, 300], ['π/6 and 11π/6', 'π/3 and 2π/3', 'π/3 and 4π/3']], ['tan x = 1', 'tan', '1', 1, [45, 225], ['π/4 and 3π/4', 'π/4 and 7π/4', '3π/4 and 7π/4']], ['sin x = −√2/2', 'sin', '−√2/2', -Math.SQRT1_2, [225, 315], ['3π/4 and 5π/4', 'π/4 and 3π/4', '5π/4 and 3π/4']], ['cos x = −√3/2', 'cos', '−√3/2', -Math.sqrt(3) / 2, [150, 210], ['π/6 and 11π/6', '2π/3 and 4π/3', '5π/6 and 11π/6']]];
const QT = [['2sin²x − sin x − 1 = 0', '(2 sin x + 1)(sin x − 1) = 0', 'sin x = −1/2 or sin x = 1', [90, 210, 330]], ['2cos²x − cos x − 1 = 0', '(2 cos x + 1)(cos x − 1) = 0', 'cos x = −1/2 or cos x = 1', [0, 120, 240]], ['2sin²x − 1 = 0', 'sin²x = 1/2', 'sin x = √2/2 or sin x = −√2/2', [45, 135, 225, 315]], ['cos²x − cos x = 0', 'cos x (cos x − 1) = 0', 'cos x = 0 or cos x = 1', [0, 90, 270]], ['2sin²x + sin x = 0', 'sin x (2 sin x + 1) = 0', 'sin x = 0 or sin x = −1/2', [0, 180, 210, 330]], ['tan²x − 1 = 0', '(tan x − 1)(tan x + 1) = 0', 'tan x = 1 or tan x = −1', [45, 135, 225, 315]]];
export function trigeq(r) {
  const v = r.int(0, 5);
  if (v === 0) {
    const [e, val, f, valS, x] = r.pick(INV), half = f === 'cos' ? [0, 180] : [-90, 90], rng = f === 'cos' ? '0° to 180° (the top half)' : f === 'sin' ? '−90° to 90° (the right half)' : 'between −90° and 90° (the right half)';
    const pic = (pts) => unitFig({ half, hline: f === 'sin' ? { y: x, label: `y = ${valS}` } : null, vline: f === 'cos' ? { x, label: `x = ${valS}` } : null, pts });
    return num(val, [St(`${f}⁻¹ gives just one angle, from ${rng}: the shaded part of the circle.`, pic([])), St(`In that part, the point with ${f === 'sin' ? 'y' : f === 'cos' ? 'x' : 'y ÷ x'} = ${valS} is at ${neg(val)}°.`, pic([{ deg: val, label: `${neg(val)}°`, t: 'hl', arc: true }])), St(`So ${e} = ${neg(val)}°.`)], { q: `Find ${e} in degrees.`, expr: `${val}` });
  }
  if (v === 1) {
    const [e, f, valS, val, s] = r.pick(LINEQ);
    return txt(`x = ${s.join('°, ')}°`, [St(`Get ${f} x alone: ${f} x = ${valS}.`), ...eqSteps(f, valS, val, s)], { q: `Solve ${e} for 0° ≤ x < 360°. Give every solution.`, numbers: s });
  }
  if (v === 2) {
    const [e, f, valS, val, degs, w] = r.pick(RADEQ), right = degs.map(radOf).join(' and ');
    return mc(r, right, w, { q: `Solve ${e} for 0 ≤ x < 2π.`, steps: [...eqSteps(f, valS, val, degs, radOf).slice(0, 2), St(`x = ${right}.`)] });
  }
  if (v === 3) {
    const sinE = r.bool(), f = sinE ? 'sin' : 'cos', x = r.int(10, 90) / 100, A = (sinE ? Math.asin(x) : Math.acos(x)) / RAD, s = [Math.round(A), Math.round(sinE ? 180 - A : 360 - A)];
    return txt(`x = ${s[0]}° or x = ${s[1]}°`, [St(`${f}⁻¹(${x}) ≈ ${A.toFixed(2)}°: one solution, in Quadrant I.`, eqCircle(f, `${x}`, x, [s[0]])), St(`${f} is also positive in Quadrant ${sinE ? 'II' : 'IV'}: ${sinE ? '180°' : '360°'} − ${A.toFixed(2)}° ≈ ${s[1]}°. The line meets the circle twice.`, eqCircle(f, `${x}`, x, s)), St(`x ≈ ${s[0]}° or x ≈ ${s[1]}°.`)],
      { q: `Solve ${f} x = ${x} for 0° ≤ x < 360°. Round each angle to the nearest degree.`, numbers: s });
  }
  if (v === 4) {
    const f = r.pick(['sin', 'cos']), x = r.pick([-1.2, -1, -0.6, -0.3, 0, 0.4, 0.8, 1, 1.2]), cnt = Math.abs(x) > 1 ? 0 : Math.abs(x) === 1 ? 1 : 2;
    const a = Math.abs(x) <= 1 ? (f === 'sin' ? Math.asin(x) : Math.acos(x)) / RAD : 0, sols = cnt === 0 ? [] : cnt === 1 ? [norm(Math.round(a))] : (f === 'sin' ? [a, 180 - a] : [a, 360 - a]).map((d) => norm(Math.round(d)));
    const xs = fm(x);
    return mc(r, String(cnt), ['0', '1', '2', '4'], { q: `How many solutions does ${f} x = ${xs} have for 0° ≤ x < 360°?`, visual: eqCircle(f, xs, x),
      steps: [St(`Each solution is a point where the line ${f === 'sin' ? 'y' : 'x'} = ${xs} meets the unit circle.`, eqCircle(f, xs, x, sols)), St(cnt === 0 ? `The line misses the circle (${f} is never more than 1 or less than −1): 0 solutions.` : cnt === 1 ? 'The line just touches the circle: 1 solution.' : 'The line cuts the circle twice: 2 solutions.')] });
  }
  const [e, fac, split, s] = r.pick(QT);
  return txt(`x = ${s.join('°, ')}°`, [St(`Treat it as a quadratic and factor: ${fac}.`), St(`So ${split}.`), St(`Find each angle on the unit circle: ${s.join('°, ')}°.`, unitFig({ pts: s.map((d, i) => ({ deg: d, label: `${d}°`, t: i % 2 ? 'hl2' : 'hl' })) })), St(`x = ${s.join('°, ')}°.`)], { q: `Solve ${e} for 0° ≤ x < 360°. Give every solution.`, numbers: s });
}

// ───────── 12. circles and parabolas ─────────
const pt2 = (x, y) => `(${neg(x)}, ${neg(y)})`;
export function circleGraph(h, k, rr, { radius = true, centre = true, P = null, hl = [] } = {}) {
  const wnd = window([[h - rr, k - rr], [h + rr, k + rr], ...(P ? [P] : [])], 1);
  return gridFig({ ...wnd, draw: (m, u) => [circle(m([h, k]), rr * u, 'hl2'), radius ? [line(m([h, k]), m([h + rr, k]), has(hl, 'r') ? 'hlline' : 'aux'), text(add(mid(m([h, k]), m([h + rr, k])), [0, -10]), 'r', has(hl, 'r') ? 'hl' : 'ink', { size: 13 })] : null, dot(m([h, k]), 'hl'), centre ? text(add(m([h, k]), [0, 13]), pt2(h, k), has(hl, 'c') ? 'hl' : 'ink', { size: 12 }) : null, P ? [line(m([h, k]), m(P), 'hlline'), dot(m(P), 'ink'), text(add(m(P), [10, -10]), 'P', 'ink', { size: 13 })] : null] });
}
export function parabolaGraph(p, up, hl = []) {
  const f = (t) => (t * t) / (4 * p), lim = [-8, 8];
  return gridFig({ x: lim, y: lim, draw: (m) => [
    up ? curveOn(m, f, lim, lim, 'hlline') : curveOn(([a, b]) => m([b, a]), f, lim, lim, 'hlline'),
    up ? line(m([-8, -p]), m([8, -p]), 'aux') : line(m([-p, -8]), m([-p, 8]), 'aux'),
    text(up ? add(m([-8, -p]), [4, -p > 0 ? -10 : 10]) : add(m([-p, 8]), [-p > 0 ? 6 : -6, 8]), `${up ? 'y' : 'x'} = ${neg(-p)}`, has(hl, 'd') ? 'hl' : 'ink', { size: 12, anchor: up ? 'start' : -p > 0 ? 'start' : 'end' }),
    dot(m(up ? [0, p] : [p, 0]), 'hl'), text(add(m(up ? [0, p] : [p, 0]), [12, -10]), 'F', has(hl, 'f') ? 'hl' : 'ink', { size: 13 }), dot(m([0, 0]), 'ink')] });
}
export function circles(r) {
  const v = r.int(0, 7), h = r.int(-6, 6), k = r.int(-6, 6), rr = r.int(1, 9), sq = (x, c) => (c === 0 ? `${x}²` : `(${x} ${sgn(-c)})²`), std = `${sq('x', h)} + ${sq('y', k)} = ${rr * rr}`;
  const key = St('A circle is every point at distance r from its centre (h, k): (x − h)² + (y − k)² = r².', circleGraph(h, k, rr, { hl: ['c', 'r'] }));
  if (v === 0) return num(rr, [key, St(`The right side is r² = ${rr * rr}, so r = √${rr * rr} = ${rr}.`, circleGraph(h, k, rr, { hl: 'r' })), St(`So the radius is ${rr}.`)], { q: `What is the radius of the circle ${std}?`, expr: `Math.sqrt(${rr * rr})` });
  if (v === 1) {
    const right = pt2(h, k);
    return mc(r, right, [pt2(-h, -k), pt2(h, -k), pt2(k, h), pt2(h + 1, k)].filter((x) => x !== right), { q: `What is the centre of the circle ${std}?`, steps: [key, St(`(x ${sgn(-h)}) means h = ${neg(h)}; (y ${sgn(-k)}) means k = ${neg(k)}. Watch the signs: the centre is ${right}.`.replace('(x + 0)', 'x').replace('(y + 0)', 'y'), circleGraph(h, k, rr, { hl: 'c' }))] });
  }
  if (v === 2) {
    return mc(r, std, [`${sq('x', -h)} + ${sq('y', -k)} = ${rr * rr}`, `${sq('x', h)} + ${sq('y', k)} = ${rr}`, `${sq('x', k)} + ${sq('y', h)} = ${rr * rr}`, `${sq('x', h)} + ${sq('y', k)} = ${rr * rr + 1}`].filter((x) => x !== std), { q: `Which is the equation of the circle with centre ${pt2(h, k)} and radius ${rr}?`, visual: circleGraph(h, k, rr),
      steps: [key, St(`Put h = ${neg(h)}, k = ${neg(k)} and r² = ${rr * rr}: ${std}.`)] });
  }
  if (v === 3) {
    const D = -2 * h, E = -2 * k, F = h * h + k * k - rr * rr, gen = `x² + y²${D ? ` ${sgn(D)}x` : ''}${E ? ` ${sgn(E)}y` : ''}${F ? ` ${sgn(F)}` : ''} = 0`;
    return num(rr, [St(`Group the x terms and the y terms, and complete the square for each: ${sq('x', h)} + ${sq('y', k)} = ${neg(-F)} + ${h * h} + ${k * k}.`), St(`So ${std}: the centre is ${pt2(h, k)} and r² = ${rr * rr}.`, circleGraph(h, k, rr, { hl: ['c', 'r'] })), St(`r = √${rr * rr} = ${rr}.`)], { q: `Find the radius of the circle ${gen}.`, expr: `Math.sqrt(${h * h}+${k * k}-(${F}))` });
  }
  if (v === 6) {
    const H = r.int(-4, 4), K = r.int(-4, 4), R = r.int(2, 5), right = `${sq('x', H)} + ${sq('y', K)} = ${R * R}`;
    return mc(r, right, [`${sq('x', -H)} + ${sq('y', -K)} = ${R * R}`, `${sq('x', H)} + ${sq('y', K)} = ${R}`, `${sq('x', K)} + ${sq('y', H)} = ${R * R}`, `${sq('x', H)} + ${sq('y', K)} = ${(R + 1) ** 2}`].filter((x) => x !== right), { q: 'Which equation matches this circle?', visual: circleGraph(H, K, R, { radius: false, centre: false }),
      steps: [St(`Read the centre from the grid: ${pt2(H, K)}. Count from the centre to the edge: r = ${R}.`, circleGraph(H, K, R, { hl: ['c', 'r'] })), St(`(x − h)² + (y − k)² = r² gives ${right}.`)] });
  }
  if (v === 7) {
    const H = r.int(-4, 4), K = r.int(-4, 4), kind = r.int(0, 2), [dx, dy] = kind === 1 ? r.pick([[3, 4], [-3, 4], [4, -3], [-4, -3], [5, 0], [0, -5]]) : kind === 0 ? r.pick([[1, 2], [-2, 3], [3, -1], [0, 4], [-3, -3], [2, 2]]) : r.pick([[4, 4], [-5, 2], [3, 5], [-6, 0], [4, -4], [2, -5]]);
    const P = [H + dx, K + dy], d2 = dx * dx + dy * dy, right = d2 < 25 ? 'Inside' : d2 === 25 ? 'On the circle' : 'Outside', eq = `${sq('x', H)} + ${sq('y', K)} = 25`;
    return mc(r, right, ['Inside', 'On the circle', 'Outside'], { q: `Is the point P${pt2(...P)} inside, on or outside the circle ${eq}?`,
      steps: [St(`Put P into the left side: (${neg(P[0])} − ${par(H)})² + (${neg(P[1])} − ${par(K)})² = ${dx * dx} + ${dy * dy} = ${d2}. That is the squared distance from the centre.`, circleGraph(H, K, 5, { P })), St(`Compare with r² = 25: ${d2} ${d2 < 25 ? '<' : d2 === 25 ? '=' : '>'} 25, so P is ${right.toLowerCase()}.`)] });
  }
  const p = r.nonzero(-4, 4), up = r.bool(), eq = up ? `x² = ${4 * p}y` : `y² = ${4 * p}x`;
  const pkey = St(`${up ? 'x² = 4py' : 'y² = 4px'} has its vertex at (0, 0), focus F at ${up ? '(0, p)' : '(p, 0)'} and directrix ${up ? 'y' : 'x'} = −p. Every point is as far from F as from the directrix.`, parabolaGraph(p, up, ['f', 'd']));
  if (v === 4) { const right = up ? pt2(0, p) : pt2(p, 0); return mc(r, right, [up ? pt2(0, -p) : pt2(-p, 0), up ? pt2(p, 0) : pt2(0, p), up ? pt2(0, 4 * p) : pt2(4 * p, 0)], { q: `Where is the focus of the parabola ${eq}?`, steps: [pkey, St(`${4 * p} = 4p, so p = ${neg(p)}. The focus is ${right}.`, parabolaGraph(p, up, 'f'))] }); }
  return num(-p, [pkey, St(`${4 * p} = 4p, so p = ${neg(p)}.`), St(`The directrix is ${up ? 'y' : 'x'} = −p = ${neg(-p)}.`, parabolaGraph(p, up, 'd'))], { q: `The directrix of the parabola ${eq} is ${up ? 'y' : 'x'} = ?`, visual: parabolaGraph(p, up), expr: `-(${4 * p})/4` });
}

// ───────── 12. vectors on a grid ─────────
const vec = (...c) => `⟨${c.map((x) => fm(x)).join(', ')}⟩`;
const vgrid = (pts, draw) => gridFig({ ...window(pts, 1), draw });
const comps = (m, p, q, hl = []) => { const c = [q[0], p[1]]; return [line(m(p), m(c), has(hl, 'x') ? 'hlline' : 'aux'), line(m(c), m(q), has(hl, 'y') ? 'hlline' : 'aux'), text(add(mid(m(p), m(c)), [0, q[1] >= p[1] ? 12 : -12]), fm(q[0] - p[0]), has(hl, 'x') ? 'hl' : 'ink', { size: 12 }), text(add(mid(m(c), m(q)), [q[0] >= p[0] ? 12 : -12, 0]), fm(q[1] - p[1]), has(hl, 'y') ? 'hl' : 'ink', { size: 12 })]; };
export function vectors(r) {
  const v = r.int(0, 4);
  if (v === 0) {
    const [p, q, h] = r.pick(TRIPLES.slice(0, 3)), k = r.int(1, 2), s1 = r.bool() ? 1 : -1, s2 = r.bool() ? 1 : -1, a = s1 * p * (h > 13 ? 1 : k), b = s2 * q * (h > 13 ? 1 : k), mag = Math.hypot(a, b), O = [0, 0], T = [a, b];
    return num(mag, [St(`The vector is the hypotenuse of a right triangle with legs ${Math.abs(a)} and ${Math.abs(b)}.`, vgrid([O, T], (m) => [comps(m, O, T, ['x', 'y']), vecOn(m, O, T, 'hlline', 'v')])), St(`|v| = √(${a * a} + ${b * b}) = √${a * a + b * b} = ${mag}.`), St(`So |v| = ${mag}.`)], { q: `Find the magnitude of v = ${vec(a, b)}.`, visual: vgrid([O, T], (m) => vecOn(m, O, T, 'hlline', 'v')), expr: `Math.hypot(${a},${b})` });
  }
  if (v === 1) {
    const a = r.nonzero(-7, 7), b = r.nonzero(-7, 7), A = ((Math.atan2(b, a) / RAD) + 360) % 360, ans = Math.round(A), ref = Math.atan(Math.abs(b / a)) / RAD, O = [0, 0], T = [a, b], Q = a > 0 ? (b > 0 ? 'I' : 'IV') : b > 0 ? 'II' : 'III';
    const how = { I: `θ = ${ref.toFixed(2)}°`, II: `θ = 180° − ${ref.toFixed(2)}°`, III: `θ = 180° + ${ref.toFixed(2)}°`, IV: `θ = 360° − ${ref.toFixed(2)}°` }[Q];
    return num(ans, [St(`The vector points into Quadrant ${Q}. Its angle with the x-axis has tan = ${Math.abs(b)}/${Math.abs(a)}, so it is tan⁻¹(${Math.abs(b)}/${Math.abs(a)}) ≈ ${ref.toFixed(2)}°.`, vgrid([O, T], (m) => [comps(m, O, T, ['x', 'y']), vecOn(m, O, T, 'hlline', '')])), St(`Measured from the positive x-axis: ${how} ≈ ${A.toFixed(2)}°.`, vgrid([O, T], (m) => [...turn(m(O), A, 18, 'mark'), vecOn(m, O, T, 'hlline', '')])), St(`So θ ≈ ${ans}°.`)],
      { q: `Find the direction angle of ${vec(a, b)}, from 0° to 360°, to the nearest degree.`, unit: 'θ =', visual: vgrid([O, T], (m) => vecOn(m, O, T, 'hlline', '')), tol: 0.51, expr: `((Math.atan2(${b},${a})*180/Math.PI)+360)%360` });
  }
  if (v === 2 || v === 4) {
    const P = [r.int(-5, 5), r.int(-5, 5)], u = r.nonzero(-5, 5), w = r.nonzero(-5, 5), Q2 = [P[0] + u, P[1] + w], right = vec(u, w);
    const wr = [vec(w, u), vec(-u, -w), vec(Q2[0], Q2[1]), vec(u + 1, w)].filter((x) => x !== right);
    const lab = (m) => [text(add(m(P), [-10, 10]), 'A', 'ink', { size: 13 }), text(add(m(Q2), [10, -10]), 'B', 'ink', { size: 13 })];
    if (v === 2) return mc(r, right, wr, { q: `A vector starts at A${pt2(...P)} and ends at B${pt2(...Q2)}. What is its component form?`, steps: [St('Subtract start from end: ⟨x₂ − x₁, y₂ − y₁⟩. On the grid that is the run across and the rise up.', vgrid([P, Q2], (m) => [comps(m, P, Q2, ['x', 'y']), vecOn(m, P, Q2, 'hlline', ''), lab(m)])), St(`⟨${neg(Q2[0])} − ${par(P[0])}, ${neg(Q2[1])} − ${par(P[1])}⟩ = ${right}.`)] });
    return mc(r, right, wr, { q: 'What is the component form of the vector drawn from A to B?', visual: vgrid([P, Q2], (m) => [vecOn(m, P, Q2, 'hlline', ''), lab(m)]), steps: [St(`Count from A to B: ${Math.abs(u)} ${u > 0 ? 'right' : 'left'} and ${Math.abs(w)} ${w > 0 ? 'up' : 'down'}.`, vgrid([P, Q2], (m) => [comps(m, P, Q2, ['x', 'y']), vecOn(m, P, Q2, 'hlline', ''), lab(m)])), St(`Right and up are positive, left and down negative: ${right}.`)] });
  }
  const mg = r.int(3, 20), th = r.int(10, 350), xc = r.bool(), val = xc ? mg * Math.cos(th * RAD) : mg * Math.sin(th * RAD), ans = dec(val, 1);
  const pic = (hl) => angleFig({ deg: th, arrow: true, armLabel: `${mg}`, comps: !!hl, hl, quads: true });
  return num(ans, [St(`Drop the vector onto the axes: the x-component is |v| cos θ and the y-component is |v| sin θ.`, pic(xc ? ['x'] : ['y'])), St(`${xc ? 'x' : 'y'} = ${mg} × ${xc ? 'cos' : 'sin'} ${th}° = ${mg} × ${dec(xc ? Math.cos(th * RAD) : Math.sin(th * RAD), 4)}.`), St(`≈ ${fm(ans)}.`)], { q: `A vector has magnitude ${mg} and direction angle ${th}°. Find its ${xc ? 'x' : 'y'}-component, rounded to 1 decimal place.`, visual: pic(), tol: 0.051, expr: `${mg}*Math.${xc ? 'cos' : 'sin'}(${th}*Math.PI/180)` });
}
export function vecops(r) {
  const v = r.int(0, 5), a = r.int(-6, 6), b = r.int(-6, 6), c = r.int(-6, 6), d = r.int(-6, 6), O = [0, 0];
  const tipToTail = (u, w, lab2 = 'v') => { const U = u, S = [u[0] + w[0], u[1] + w[1]]; return vgrid([O, U, S], (m) => [vecOn(m, O, U, 'hlline', 'u'), vecOn(m, U, S, 'hl2', lab2), vecOn(m, O, S, 'ink', '', -1)]); };
  if (v === 0) {
    const sub = r.bool(), right = vec(sub ? a - c : a + c, sub ? b - d : b + d);
    return mc(r, right, [vec(sub ? a + c : a - c, sub ? b + d : b - d), vec(sub ? a - c : a + c, sub ? b + d : b - d), vec(a * c, b * d), vec((sub ? a - c : a + c) + 1, sub ? b - d : b + d)].filter((x) => x !== right), { q: `u = ${vec(a, b)} and v = ${vec(c, d)}. ${sub ? 'Find u − v.' : 'Find u + v.'}`,
      steps: [St(sub ? `u − v = u + (−v): put −v = ${vec(-c, -d)} at the tip of u. The blue arrow from the start to the end is the answer.` : 'Put v at the tip of u (tip to tail). The blue arrow from the start of u to the end of v is u + v.', tipToTail([a, b], sub ? [-c, -d] : [c, d], sub ? '−v' : 'v')), St(`${sub ? 'Subtract' : 'Add'} matching components: ${right}.`)] });
  }
  if (v === 1) {
    const p = r.nonzero(-3, 3), q = r.nonzero(-3, 3), right = vec(p * a + q * c, p * b + q * d), coef = (x) => (x === 1 ? '' : x === -1 ? '−' : neg(x));
    return mc(r, right, [vec(p * a - q * c, p * b - q * d), vec(p * a + q * c, p * b - q * d), vec((p + q) * a, (p + q) * b), vec(p * a + q * c + 1, p * b + q * d)].filter((x) => x !== right), { q: `u = ${vec(a, b)} and v = ${vec(c, d)}. Find ${coef(p)}u ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}v.`, steps: [St(`Multiply each vector by its number: ${coef(p)}u = ${vec(p * a, p * b)} and ${coef(q)}v = ${vec(q * c, q * d)}.`), St(`Add matching components: ${right}.`)] });
  }
  if (v === 2) {
    const [p, q, h] = r.pick(TRIPLES), s1 = r.bool() ? 1 : -1, s2 = r.bool() ? 1 : -1, right = vec(frac(s1 * p, h), frac(s2 * q, h));
    return mc(r, right, [vec(frac(s2 * q, h), frac(s1 * p, h)), vec(frac(s1 * p, p + q), frac(s2 * q, p + q)), vec(frac(-s1 * p, h), frac(-s2 * q, h))], { q: `Find the unit vector in the direction of ${vec(s1 * p, s2 * q)}.`, steps: [St(`A unit vector has length 1 and the same direction. First |v| = √(${p * p} + ${q * q}) = ${h}.`), St(`Divide each component by ${h}: ${right}.`)] });
  }
  if (v === 3) {
    const [p, q, h] = r.pick(TRIPLES.slice(0, 2)), k = r.nonzero(-3, 3), V = [p, q], KV = [k * p, k * q];
    return num(Math.abs(k) * h, [St(`|v| = √(${p * p} + ${q * q}) = ${h}.`, vgrid([O, V, KV], (m) => [vecOn(m, O, KV, 'hl2', `${fm(k)}v`, -1), vecOn(m, O, V, 'hlline', 'v')])), St(`Multiplying by ${fm(k)} makes it ${Math.abs(k)} times as long${k < 0 ? ' and turns it round' : ''}: |${fm(k)}v| = ${Math.abs(k)} × ${h} = ${Math.abs(k) * h}.`), St(`So |${fm(k)}v| = ${Math.abs(k) * h}.`)], { q: `v = ${vec(p, q)}. What is the magnitude of ${fm(k)}v?`, expr: `Math.abs(${k})*Math.hypot(${p},${q})` });
  }
  if (v === 4) {
    const sx = a + c, sy = b + d, mag = Math.hypot(sx, sy), ans = dec(mag, 2);
    return num(ans, [St(`Add tip to tail: u + v = ${vec(sx, sy)}.`, tipToTail([a, b], [c, d])), St(`|u + v| = √(${sx * sx} + ${sy * sy}) ≈ ${ans}.`), St(`So |u + v| ≈ ${ans}.`)], { q: `u = ${vec(a, b)} and v = ${vec(c, d)}. Find |u + v|, rounded to 2 decimal places.`, tol: 0.006, expr: `Math.hypot(${a}+(${c}),${b}+(${d}))` });
  }
  const A2 = r.nonzero(-4, 4), B2 = r.nonzero(-4, 4), C2 = r.nonzero(-4, 4), D2 = r.nonzero(-4, 4), right = vec(A2 + C2, B2 + D2), U = [A2, B2], S = [A2 + C2, B2 + D2];
  const pic = vgrid([O, U, S], (m) => [vecOn(m, O, U, 'hlline', 'u'), vecOn(m, U, S, 'hl2', 'v')]);
  return mc(r, right, [vec(A2 - C2, B2 - D2), vec(B2 + D2, A2 + C2), vec(A2 + C2 + 1, B2 + D2), vec(-(A2 + C2), -(B2 + D2))].filter((x) => x !== right), { q: 'Vector v is drawn at the tip of u. What is u + v?', visual: pic,
    steps: [St(`Read each one: u = ${vec(A2, B2)} and v = ${vec(C2, D2)}.`, vgrid([O, U, S], (m) => [comps(m, O, U), comps(m, U, S), vecOn(m, O, U, 'hlline', 'u'), vecOn(m, U, S, 'hl2', 'v')])), St(`The resultant goes from the start of u to the tip of v: ${right}.`, vgrid([O, U, S], (m) => [vecOn(m, O, U, 'hlline', 'u'), vecOn(m, U, S, 'hl2', 'v'), vecOn(m, O, S, 'ink', 'u + v', -1)]))] });
}

// ───────── grade 12 lessons ─────────
export const LESSONS12 = {
  radians: [
    L('A radian is the angle that sweeps an arc as long as the radius. A full turn is 2π radians, so 180° = π.', sectorFig({ deg: 57.3, r: 'r', s: 'r', th: '1 rad', hl: ['arc', 'radius'] })),
    L('Degrees to radians: multiply by π/180. Radians to degrees: replace π with 180°.', angleFig({ deg: 120, rad: true, label: '2π/3 = 120°' })),
    L('Arc length s = rθ and sector area A = ½r²θ, with θ in radians.', sectorFig({ deg: 100, r: 'r', th: 'θ', s: 's = rθ', hl: 'arc' })),
    L('The reference angle is the acute angle to the x-axis; it gives the size of a ratio, and the quadrant gives its sign.', angleFig({ deg: 225, rad: true, label: '5π/4', ref: 'π/4', drop: true, quads: true, hl: 'ref' })),
  ],
  unit: [
    L('The unit circle has radius 1. The point at angle θ is (cos θ, sin θ).', unitFig({ pts: [{ deg: 40, label: '(cos θ, sin θ)', arc: 'θ' }], tri: { deg: 40, x: 'cos θ', y: 'sin θ' } })),
    L('The first-quadrant values: π/6 → (√3/2, 1/2), π/4 → (√2/2, √2/2), π/3 → (1/2, √3/2).', unitFig({ pts: [{ deg: 30, label: '(√3/2, 1/2)' }, { deg: 60, label: '(1/2, √3/2)', t: 'hl2' }] })),
    L('Every other special angle reflects one of these: only the signs change. 5π/6 is the reflection of π/6.', unitFig({ pts: [{ deg: 30, label: '(√3/2, 1/2)' }, { deg: 150, label: '(−√3/2, 1/2)', t: 'hl' }] })),
    L('Signs by quadrant: all positive in I, sin in II, tan in III, cos in IV.', unitFig({ quads: true, pts: [{ deg: 45, label: '(+, +)' }, { deg: 135, label: '(−, +)' }, { deg: 225, label: '(−, −)' }, { deg: 315, label: '(+, −)' }] })),
  ],
  trisolve: [
    L('Right triangles: SOH CAH TOA, and inverse ratios for angles.', rtTri({ deg: 35, adj: '12', opp: 'x', ang: '35°', hl: ['opp', 'adj'] })),
    L('Other triangles: the Sine Law with a complete pair, the Cosine Law for SAS or SSS.', triFig({ A: 50, B: 65, sides: { a: 'a', b: 'b', c: 'c' }, angs: { A: 'A', B: 'B', C: 'C' } })),
    L("Heron's formula: with s half the perimeter, Area = √(s(s − a)(s − b)(s − c)).", triFig({ A: 50, B: 65, sides: { a: '7', b: '8', c: '9' } })),
    L('The ambiguous case (SSA): swing side a from C. It may miss the line, touch it, or cross it twice.', ssaFig({ A: 35, b: 12, a: 8, show: true })),
  ],
  trigeq: [
    L('sin⁻¹ and tan⁻¹ give an angle from −90° to 90° (right half); cos⁻¹ from 0° to 180° (top half).', { type: 'figs', figs: [unitFig({ half: [-90, 90] }), unitFig({ half: [0, 180] })], captions: ['sin⁻¹, tan⁻¹', 'cos⁻¹'] }),
    L('To solve sin x = k, draw the line y = k: each crossing with the unit circle is a solution.', eqCircle('sin', '1/2', 0.5, [30, 150])),
    L('For cos x = k draw the line x = k.', eqCircle('cos', '−1/2', -0.5, [120, 240])),
    L('Quadratic in sin x or cos x: factor first, then solve each simpler equation.', unitFig({ pts: [90, 210, 330].map((d, i) => ({ deg: d, label: `${d}°`, t: i % 2 ? 'hl2' : 'hl' })) })),
  ],
  circle: [
    L('A circle with centre (h, k) and radius r: (x − h)² + (y − k)² = r².', circleGraph(2, -1, 4, { hl: ['c', 'r'] })),
    L('Watch the signs: (x + 3)² means h = −3.', circleGraph(-3, 2, 3, { hl: 'c' })),
    L('General form x² + y² + Dx + Ey + F = 0: complete the square in x and in y to find the centre and radius.'),
    L('x² = 4py: a parabola with vertex (0, 0), focus (0, p) and directrix y = −p.', parabolaGraph(2, true, ['f', 'd'])),
  ],
  vec: [
    L('A vector has a size (magnitude) and a direction. ⟨a, b⟩ means a across and b up.', vgrid([[0, 0], [4, 3]], (m) => [comps(m, [0, 0], [4, 3], ['x', 'y']), vecOn(m, [0, 0], [4, 3], 'hlline', 'v')])),
    L('Magnitude: |⟨a, b⟩| = √(a² + b²), by Pythagoras. Here √(16 + 9) = 5.', vgrid([[0, 0], [4, 3]], (m) => [comps(m, [0, 0], [4, 3]), vecOn(m, [0, 0], [4, 3], 'hlline', '5')])),
    L('From A to B: subtract the start from the end, ⟨x₂ − x₁, y₂ − y₁⟩.', vgrid([[-2, 1], [3, 4]], (m) => [comps(m, [-2, 1], [3, 4]), vecOn(m, [-2, 1], [3, 4], 'hlline', '')])),
    L('From magnitude m and direction θ: ⟨m cos θ, m sin θ⟩.', angleFig({ deg: 35, arrow: true, armLabel: 'm', label: 'θ', comps: true })),
  ],
  vecops: [
    L('Add vectors tip to tail: the resultant goes from the start of the first to the tip of the last. In components, add.', vgrid([[0, 0], [3, 1], [4, 5]], (m) => [vecOn(m, [0, 0], [3, 1], 'hlline', 'u'), vecOn(m, [3, 1], [4, 5], 'hl2', 'v'), vecOn(m, [0, 0], [4, 5], 'ink', 'u + v', -1)])),
    L('u − v = u + (−v): −v is v turned round.', vgrid([[0, 0], [3, 1], [2, -3]], (m) => [vecOn(m, [0, 0], [3, 1], 'hlline', 'u'), vecOn(m, [3, 1], [2, -3], 'hl2', '−v'), vecOn(m, [0, 0], [2, -3], 'ink', 'u − v', -1)])),
    L('kv stretches v by k (and turns it round if k is negative). A unit vector is v ÷ |v|.', vgrid([[0, 0], [4, 2], [-2, -1]], (m) => [vecOn(m, [0, 0], [4, 2], 'hl2', '2v', -1), vecOn(m, [0, 0], [2, 1], 'hlline', 'v'), vecOn(m, [0, 0], [-2, -1], 'ink', '−v')])),
  ],
};
