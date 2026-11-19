// Pictures for the shape, solid, symmetry, area and perimeter skills of Kindergarten to grade 3 (g0–g3.mjs).
// Big, simple figures built from the toolkit in ../figs.mjs: flat shapes with their sides or corners counted,
// solids with hidden edges dashed and one group of faces, edges or corners lit up at a time, slides, flips and
// turns on a grid, fold lines, squares to count, and picture choices ("Which picture …? Tap A, B, C or D").
import * as G from '../figs.mjs';
import { mc, num, St } from '../kit.mjs';

const R1 = (x) => Math.round(x * 10) / 10;
const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
const away = (p, c, d) => { const v = [p[0] - c[0], p[1] - c[1]], l = Math.hypot(v[0], v[1]) || 1; return [p[0] + (v[0] / l) * d, p[1] + (v[1] / l) * d]; };
export const art = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
export const an = (w) => `${art(w)} ${w}`;
export const cap = (s) => s[0].toUpperCase() + s.slice(1);
export const LETTERS = ['A', 'B', 'C', 'D'];

// ───────── flat shapes ─────────
// model corners (y up) of each named polygon
export const FLAT = {
  triangle: [[0, 0], [8, 0], [4, 6.9]],
  square: [[0, 0], [6, 0], [6, 6], [0, 6]],
  rectangle: [[0, 0], [10, 0], [10, 5], [0, 5]],
  rhombus: [[4, 0], [8, 5], [4, 10], [0, 5]],
  trapezoid: [[0, 0], [10, 0], [7.5, 5], [2.5, 5]],
  parallelogram: [[0, 0], [7, 0], [9.5, 4.5], [2.5, 4.5]],
  pentagon: G.regular(5),
  hexagon: G.regular(6),
  octagon: G.regular(8),
  kite: [[4, 0], [8, 6], [4, 9], [0, 6]],
  'right triangle': [[0, 0], [8, 0], [0, 6]],
  'long triangle': [[0, 0], [10, 0], [7, 4]],
};
FLAT.diamond = FLAT.rhombus;
export const SIDES = { circle: 0, oval: 0, triangle: 3, 'right triangle': 3, 'long triangle': 3, square: 4, rectangle: 4, rhombus: 4, diamond: 4, trapezoid: 4, parallelogram: 4, kite: 4, pentagon: 5, hexagon: 6, octagon: 8 };
const turn = (pts, deg, sx = 1) => {
  const c = cen(pts), a = (deg * Math.PI) / 180;
  return pts.map(([x, y]) => { const u = (x - c[0]) * sx, v = y - c[1]; return [R1(c[0] + u * Math.cos(a) - v * Math.sin(a)), R1(c[1] + u * Math.sin(a) + v * Math.cos(a))]; });
};
const size = (o, W = 300, H = 220) => ({ W: o.W ?? (o.small ? 160 : W), H: o.H ?? (o.small ? 130 : H), pad: o.pad ?? (o.small ? 20 : 40) });

// flatFig(name, { rot, sx, count: 'sides' | 'corners', fill, tone, sides, right, ticks, small, fold: [p, q] (model) })
export function flatFig(name, o = {}) {
  if (name === 'circle' || name === 'oval') return roundFig(name, o);
  const pts = turn(o.pts ?? FLAT[name], o.rot ?? 0, o.sx ?? 1), n = pts.length, { W, H, pad } = size(o);
  const f = G.polygonFig({ pts, sides: o.sides, right: o.right, ticks: o.ticks, par: o.par, angles: o.angles, hl: o.fill ? 'fill' : o.hl, W, H, pad });
  if (o.tone) f.items[0].t = o.tone;
  const F = G.frame(pts, { W, H, pad }), S = pts.map(F.m), c = cen(S);
  if (o.count === 'sides') for (let j = 0; j < n; j++) { const a = S[j], b = S[(j + 1) % n]; f.items.push(G.line(a, b, 'hlline'), G.sideLabel(a, b, j + 1, S, 'hl', 15)); }
  if (o.count === 'corners') S.forEach((p, i) => f.items.push(G.dot(p, 'hl'), G.text(away(p, c, 17), i + 1, 'hl', { size: 15 })));
  if (o.fold) f.items.push(G.line(F.m(o.fold[0]), F.m(o.fold[1]), 'aux'));
  for (const L of o.folds ?? []) f.items.push(G.line(F.m(L[0]), F.m(L[1]), 'aux'));
  return f;
}
function roundFig(name, o) {
  const { W, H, pad } = size(o), C = [W / 2, H / 2], ry = H / 2 - pad + 6, rx = name === 'circle' ? ry : Math.min(W / 2 - pad + 6, ry * 1.6);
  const t = o.fill ? 'hl' : o.tone ?? 'fig';
  const items = [name === 'circle' ? G.circle(C, ry, t) : { k: 'path', d: `M${R1(C[0] - rx)} ${R1(C[1])}A${R1(rx)} ${R1(ry)} 0 1 0 ${R1(C[0] + rx)} ${R1(C[1])}A${R1(rx)} ${R1(ry)} 0 1 0 ${R1(C[0] - rx)} ${R1(C[1])}Z`, t }];
  if (o.count === 'curve' || o.hl === 'curve') items.push({ k: 'path', d: `M${R1(C[0] - rx)} ${R1(C[1])}A${R1(rx)} ${R1(ry)} 0 1 0 ${R1(C[0] + rx)} ${R1(C[1])}A${R1(rx)} ${R1(ry)} 0 1 0 ${R1(C[0] - rx)} ${R1(C[1])}`, t: 'hlline' });
  if (o.fold) { const ang = (o.fold * Math.PI) / 180; items.push(G.line([C[0] - (rx + 12) * Math.cos(ang), C[1] - (ry + 12) * Math.sin(ang)], [C[0] + (rx + 12) * Math.cos(ang), C[1] + (ry + 12) * Math.sin(ang)], 'aux')); }
  return G.fig(items, W, H);
}
// a row of small flat shapes in one picture (for counting shapes)
export function placeShapes(list, W, H, extra = []) {
  const items = [];
  for (const { name, at: [cx, cy], s = 52, t = 'fig', rot = 0 } of list) {
    if (name === 'circle') { items.push(G.circle([cx, cy], s / 2, t)); continue; }
    const pts = turn(FLAT[name], rot), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), k = s / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    const c = [(Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...ys) + Math.min(...ys)) / 2];
    items.push(G.poly(pts.map(([x, y]) => [cx + (x - c[0]) * k, cy - (y - c[1]) * k]), t));
  }
  return G.fig([...items, ...extra], W, H);
}
export function shapeRow(names, o = {}) {
  const u = 70, W = names.length * u + 20, H = 100;
  return placeShapes(names.map((name, i) => ({ name, at: [10 + u * i + u / 2, 44], t: o.hl?.includes(i) ? 'hl' : 'fig', rot: o.rot?.[i] ?? 0 })), W, H,
    names.map((_, i) => (o.numbers?.[i] ? G.text([10 + u * i + u / 2, H - 12], o.numbers[i], 'hl', { size: 15 }) : null)).filter(Boolean));
}

// ───────── picture choices: "Which picture …?" with A, B, C, D under the pictures ─────────
// right and wrongs are figures; steps(letter) gives the worked steps. lead: a figure shown first (captioned leadCap)
export function picChoice(r, right, wrongs, { q, steps, lead = null, leadCap = 'This one', ...extra }) {
  const all = r.shuffle([{ f: right, ok: true }, ...wrongs.slice(0, 3).map((f) => ({ f }))]);
  const k = all.findIndex((x) => x.ok), L = LETTERS[k];
  const figs = all.map((x) => x.f), captions = all.map((_, i) => LETTERS[i]);
  return { kind: 'mc', choices: captions, a: k, q, visual: { type: 'figs', figs: lead ? [lead, ...figs] : figs, captions: lead ? [leadCap, ...captions] : captions }, steps: typeof steps === 'function' ? steps(L) : steps, ...extra };
}
export const figs = (list, captions) => ({ type: 'figs', figs: list, captions });

// ───────── solids with flat faces, drawn in the same oblique view as figs.mjs ─────────
const DX = 0.42, DY = 0.3, VIEW = [-DX, -DY, 1];
const proj = ([x, y, z]) => [x + z * DX, y + z * DY];
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const box = (l, h, w) => ({ V: [[0, 0, 0], [l, 0, 0], [l, h, 0], [0, h, 0], [0, 0, w], [l, 0, w], [l, h, w], [0, h, w]], F: [[0, 1, 2, 3], [4, 5, 6, 7], [3, 2, 6, 7], [0, 1, 5, 4], [0, 3, 7, 4], [1, 2, 6, 5]] });
const prism3 = (a, h, d) => ({ V: [[0, 0, 0], [a, 0, 0], [a / 2, h, 0], [0, 0, d], [a, 0, d], [a / 2, h, d]], F: [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]] });
const pyr4 = (a, h) => ({ V: [[0, 0, 0], [a, 0, 0], [a, 0, a], [0, 0, a], [a / 2, h, a / 2]], F: [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]] });
const pyr3 = (a, h) => ({ V: [[0, 0, 0], [a, 0, 0], [a * 0.15, 0, a * 1.1], [a * 0.4, h, a * 0.37]], F: [[0, 1, 2], [0, 1, 3], [1, 2, 3], [2, 0, 3]] });
// how to count each solid's faces, edges and vertices, a group at a time
const byY = (V, y) => V.map((p, i) => [p, i]).filter(([p]) => Math.abs(p[1] - y) < 1e-9).map(([, i]) => i);
export const SOLIDS = {
  cube: () => box(4, 4, 4),
  'rectangular prism': () => box(6, 3.4, 3.6),
  'triangular prism': () => prism3(5, 4, 6),
  'square pyramid': () => pyr4(5, 5),
  'triangular pyramid': () => pyr3(5.4, 5),
};
SOLIDS['square-based pyramid'] = SOLIDS['square pyramid'];
export const FEV = { cube: [6, 12, 8], 'rectangular prism': [6, 12, 8], 'triangular prism': [5, 9, 6], 'square pyramid': [5, 8, 5], 'square-based pyramid': [5, 8, 5], 'triangular pyramid': [4, 6, 4] };
const edgesOf = (F) => { const s = new Map(); for (const f of F) f.forEach((a, i) => { const b = f[(i + 1) % f.length], k = a < b ? `${a},${b}` : `${b},${a}`; s.set(k, [Math.min(a, b), Math.max(a, b)]); }); return [...s.values()]; };

// solidFig(name, { hlFaces: [i], hlEdges: [[a, b]], dots: [i], numbers: true, small, tone: 'hl' | 'hl2' })
export function solidFig(name, o = {}) {
  if (name === 'cylinder' || name === 'cone' || name === 'sphere') return curvedFig(name, o);
  const S = SOLIDS[name](), { V, F } = S, { W, H, pad } = size(o, 280, 220);
  const fr = G.frame(V.map(proj), { W, H, pad }), P = V.map((v) => fr.m(proj(v)));
  const mid = [V.reduce((s, p) => s + p[0], 0) / V.length, V.reduce((s, p) => s + p[1], 0) / V.length, V.reduce((s, p) => s + p[2], 0) / V.length];
  const normals = F.map((f) => { let n = cross(sub3(V[f[1]], V[f[0]]), sub3(V[f[2]], V[f[0]])); const fc = f.reduce((s, i) => [s[0] + V[i][0] / f.length, s[1] + V[i][1] / f.length, s[2] + V[i][2] / f.length], [0, 0, 0]); if (dot3(n, sub3(fc, mid)) < 0) n = n.map((x) => -x); const l = Math.hypot(...n); return n.map((x) => x / l); });
  const vis = normals.map((n) => dot3(n, VIEW) < -1e-9);
  const hlF = new Set(o.hlFaces ?? []), items = [];
  const E = edgesOf(F), faceHas = (e) => F.map((f, i) => [f, i]).filter(([f]) => f.includes(e[0]) && f.includes(e[1]) && (Math.abs(f.indexOf(e[0]) - f.indexOf(e[1])) === 1 || Math.abs(f.indexOf(e[0]) - f.indexOf(e[1])) === f.length - 1)).map(([, i]) => i);
  F.forEach((f, i) => { if (!vis[i]) return; const n = normals[i]; items.push(G.poly(f.map((k) => P[k]), hlF.has(i) ? o.tone ?? 'hl' : n[1] > 0.5 ? 'top' : n[2] < -0.5 ? 'front' : 'side')); });
  for (const e of E) if (!faceHas(e).some((i) => vis[i])) items.push(G.line(P[e[0]], P[e[1]], 'hidden'));
  F.forEach((f, i) => { if (!vis[i] && hlF.has(i)) items.push(G.poly(f.map((k) => P[k]), 'aux')); });
  for (const e of o.hlEdges ?? []) { const seen = faceHas(e).some((i) => vis[i]); items.push(G.line(P[e[0]], P[e[1]], seen ? 'hlline' : 'aux')); }
  const c2 = cen(P);
  (o.dots ?? []).forEach((k, j) => { items.push(G.dot(P[k], 'hl'), G.circle(P[k], 5, 'hl')); if (o.numbers) items.push(G.text(away(P[k], c2, 16), j + 1, 'hl', { size: 14 })); });
  if (o.numbers && o.hlEdges) o.hlEdges.forEach((e, j) => { const m = [(P[e[0]][0] + P[e[1]][0]) / 2, (P[e[0]][1] + P[e[1]][1]) / 2]; items.push(G.text(away(m, c2, 13), j + 1, 'hl', { size: 13 })); });
  return G.fig(items, W, H);
}
// the parts of a flat-faced solid in counting groups: [{ say, faces | edges | dots }]
export function solidGroups(name, what) {
  const { V, F } = SOLIDS[name](), E = edgesOf(F), ys = [...new Set(V.map((p) => p[1]))].sort((a, b) => a - b);
  const top = ys[ys.length - 1], pyramid = /pyramid/.test(name), tri = name === 'triangular prism';
  if (what === 'vertices') {
    if (tri) return [{ say: 'the front end', dots: [0, 1, 2] }, { say: 'the back end', dots: [3, 4, 5] }];
    if (pyramid) return [{ say: 'around the base', dots: byY(V, 0) }, { say: 'at the top', dots: byY(V, top) }];
    return [{ say: 'on the top', dots: byY(V, top) }, { say: 'on the bottom', dots: byY(V, 0) }];
  }
  if (what === 'edges') {
    const onY = (y) => E.filter(([a, b]) => Math.abs(V[a][1] - y) < 1e-9 && Math.abs(V[b][1] - y) < 1e-9);
    if (tri) { const z = (e, d) => Math.abs(V[e[0]][2] - d) < 1e-9 && Math.abs(V[e[1]][2] - d) < 1e-9, D = V[3][2]; return [{ say: 'around the front end', edges: E.filter((e) => z(e, 0)) }, { say: 'around the back end', edges: E.filter((e) => z(e, D)) }, { say: 'joining the two ends', edges: E.filter((e) => !z(e, 0) && !z(e, D)) }]; }
    if (pyramid) return [{ say: 'around the base', edges: onY(0) }, { say: 'going up to the top', edges: E.filter(([a, b]) => V[a][1] === top || V[b][1] === top) }];
    return [{ say: 'around the top', edges: onY(top) }, { say: 'around the bottom', edges: onY(0) }, { say: 'going up the sides', edges: E.filter(([a, b]) => V[a][1] !== V[b][1]) }];
  }
  const flatY = (f, y) => f.every((k) => Math.abs(V[k][1] - y) < 1e-9);
  if (tri) return [{ say: 'the 2 triangle ends', faces: [0, 1] }, { say: 'the 3 rectangles around the sides', faces: [2, 3, 4] }];
  if (pyramid) return [{ say: `the ${name === 'square pyramid' || name === 'square-based pyramid' ? 'square' : 'triangle'} base at the bottom`, faces: F.map((f, i) => (flatY(f, 0) ? i : -1)).filter((i) => i >= 0) }, { say: 'the triangles that meet at the top', faces: F.map((f, i) => (flatY(f, 0) ? -1 : i)).filter((i) => i >= 0) }];
  return [{ say: 'the top and the bottom', faces: [2, 3] }, { say: 'the front and the back', faces: [0, 1] }, { say: 'the left and the right', faces: [4, 5] }];
}
// curved solids from figs.mjs, without the radius line (young learners do not need it)
function curvedFig(name, o) {
  const { W, H, pad } = size(o, 260, 220);
  if (name === 'sphere') {
    const R = Math.min(W, H) / 2 - pad + 4, C = [W / 2, H / 2], ry = R * 0.3, L = `${R1(C[0] - R)} ${R1(C[1])}`, Rr = `${R1(C[0] + R)} ${R1(C[1])}`;
    return G.fig([G.circle(C, R, o.hl === 'curve' ? 'hl2' : 'side'), G.path(`M${L}A${R1(R)} ${R1(ry)} 0 0 1 ${Rr}`, 'hidden'), G.path(`M${L}A${R1(R)} ${R1(ry)} 0 0 0 ${Rr}`, 'ink')], W, H);
  }
  const f = name === 'cylinder' ? G.cylinderFig({ r: 3, h: o.tall ? 6 : 4.2, hl: o.hl, W, H, pad }) : G.coneFig({ r: 3, h: 5, hl: o.hl, W, H, pad });
  f.items = f.items.filter((it) => !(it.t === 'aux' || it.k === 'dot'));
  return f;
}
export const ALL_SOLIDS = ['cube', 'rectangular prism', 'triangular prism', 'square pyramid', 'triangular pyramid', 'cylinder', 'cone', 'sphere'];

// ───────── a square grid with shapes on it (slides, flips, turns, congruent shapes, area) ─────────
// gridFig({ cols, rows, u, shapes: [{ pts, t }], lines: [{ a, b, t }], dots: [p], cells: [{ x, y, t, s }] }) — grid units, y up
export function gridFig(o) {
  const u = o.u ?? 26, pad = o.pad ?? 14, W = o.cols * u + 2 * pad, H = o.rows * u + 2 * pad;
  const m = ([x, y]) => [pad + x * u, pad + (o.rows - y) * u], items = [];
  if (o.grid !== false) { for (let i = 0; i <= o.cols; i++) items.push(G.line(m([i, 0]), m([i, o.rows]), 'grid')); for (let j = 0; j <= o.rows; j++) items.push(G.line(m([0, j]), m([o.cols, j]), 'grid')); }
  for (const c of o.cells ?? []) { items.push(G.poly([[c.x, c.y], [c.x + 1, c.y], [c.x + 1, c.y + 1], [c.x, c.y + 1]].map(m), c.t ?? 'fig')); if (c.s != null) items.push(G.text(m([c.x + 0.5, c.y + 0.5]), c.s, c.t === 'hl' ? 'hl' : c.t === 'hl2' ? 'hl2' : 'ink', { size: 12 })); }
  for (const s of o.shapes ?? []) items.push(G.poly(s.pts.map(m), s.t ?? 'fig'));
  for (const L of o.lines ?? []) items.push(G.line(m(L.a), m(L.b), L.t ?? 'aux'));
  for (const p of o.dots ?? []) items.push(G.dot(m(p), 'hl'), G.circle(m(p), 5, 'hl'));
  for (const t of o.texts ?? []) items.push(G.text(m(t.at), t.s, t.t ?? 'ink', { size: t.size ?? 13 }));
  return G.fig(items, W, H);
}
// an F-like shape (looks different after a flip or a turn), at (x, y)
export const FSHAPE = [[0, 0], [1, 0], [1, 2], [2, 2], [2, 3], [1, 3], [1, 4], [3, 4], [3, 5], [0, 5]].map(([x, y]) => [x, y]);
const at = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
// moveFig(kind) — the blue shape and where it went (pink): 'slide' | 'flip' | 'turn'
export function moveFig(kind, o = {}) {
  const src = at(FSHAPE, 1, 0), u = o.u ?? 24;
  if (kind === 'slide') { const dx = o.dx ?? 5, dy = o.dy ?? 0; return gridFig({ cols: 10, rows: 6, u, shapes: [{ pts: src }, { pts: at(src, dx, dy), t: 'hl' }] }); }
  if (kind === 'flip') return gridFig({ cols: 10, rows: 6, u, shapes: [{ pts: src }, { pts: src.map(([x, y]) => [10 - x, y]), t: 'hl' }], lines: [{ a: [5, -0.3], b: [5, 6.3], t: o.hlLine ? 'hlline' : 'aux' }] });
  // a quarter turn clockwise about the corner (4, 0), which is marked with a dot
  return gridFig({ cols: 10, rows: 6, u, shapes: [{ pts: src }, { pts: src.map(([x, y]) => [4 + y, 4 - x]), t: 'hl' }], dots: [[4, 0]] });
}
// a letter, big, with an optional dashed fold line down the middle
export function letterFig(ch, { fold = false, small = false } = {}) {
  const W = small ? 120 : 200, H = small ? 120 : 180, items = [G.text([W / 2, H / 2 + 4], ch, 'ink', { size: small ? 84 : 130 })];
  if (fold) items.push(G.line([W / 2, 8], [W / 2, H - 8], 'aux'));
  return G.fig(items, W, H);
}

// ───────── flat shapes counted in squares (area) and with labelled sides (perimeter) ─────────
// areaFig(rows of cells: [[x, y]], { hlRow: k, label rows }) — unit squares, row k lit up
export function areaFig(cells, o = {}) {
  const cols = Math.max(...cells.map((c) => c[0])) + 1, rows = Math.max(...cells.map((c) => c[1])) + 1;
  const done = o.done ?? -1;
  return gridFig({ cols: cols + (o.counts ? 1 : 0), rows, u: o.u ?? Math.min(34, 260 / cols, 200 / rows), grid: false,
    cells: cells.map(([x, y]) => ({ x, y, t: o.tone ? o.tone(x, y) : o.hlRow === rows - 1 - y || (o.done != null && rows - 1 - y <= done) ? ((rows - 1 - y) % 2 ? 'hl2' : 'hl') : 'fig', s: o.numbers ? o.numbers(x, y) : null })),
    texts: o.counts ? o.counts.map((s, k) => (s == null ? null : { at: [cols + 0.5, rows - 1 - k + 0.5], s, t: k % 2 ? 'hl2' : 'hl', size: 14 })).filter(Boolean) : [] });
}
export const rectCells = (w, h) => { const out = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out.push([x, y]); return out; };

// an open shape: the outline of a polygon with a gap in its last side
export function openFig(name, o = {}) {
  const pts = FLAT[name], { W, H, pad } = size(o), F = G.frame(pts, { W, H, pad }), S = pts.map(F.m), a = S[S.length - 1], b = S[0];
  return G.fig([G.poly([...S, [a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45]], 'ink', { open: true })], W, H);
}
// a shape with one curved side (half a circle)
export function halfMoonFig(o = {}) {
  const { W, H } = size(o), r = Math.min(W / 2, H) * 0.62, x = W / 2 - r * 0.5, y = H / 2;
  return G.fig([G.path(`M${R1(x)} ${R1(y - r)}A${R1(r)} ${R1(r)} 0 0 1 ${R1(x)} ${R1(y + r)}Z`, 'fig')], W, H);
}
// a triangle drawn from its three sides a (bottom), b (right), c (left)
export const triFromSides = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return [[0, 0], [a, 0], [R1(x), R1(Math.sqrt(Math.max(0.01, c * c - x * x)))]]; };
// a triangle drawn from its two bottom angles (degrees)
export const triFromAngles = (A, B) => {
  if (A === 90) return [[0, 0], [10, 0], [0, R1(10 * Math.tan((B * Math.PI) / 180))]];
  if (B === 90) return [[0, 0], [10, 0], [10, R1(10 * Math.tan((A * Math.PI) / 180))]];
  const ta = Math.tan((A * Math.PI) / 180), tb = Math.tan((B * Math.PI) / 180), x = (10 * tb) / (ta + tb);
  return [[0, 0], [10, 0], [R1(x), R1(x * ta)]];
};
// the fold lines of a shape: through the centre and each listed point, both ways
const ext = (c, p, k) => [R1(c[0] + (p[0] - c[0]) * k), R1(c[1] + (p[1] - c[1]) * k)];
const midP = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
export const foldLines = (pts, through) => { const c = cen(pts); return through.map((p) => [ext(c, p, 1.3), ext(c, p, -1.3)]); };
export const regLines = (pts) => { const n = pts.length, mids = pts.map((p, i) => midP(p, pts[(i + 1) % n])); return foldLines(pts, n % 2 ? pts : [...pts.slice(0, n / 2), ...mids.slice(0, n / 2)]); };
// a solid's edges that are hidden (dashed) in our view
export function hiddenEdges(name) {
  const { V, F } = SOLIDS[name](), mid = [0, 1, 2].map((k) => V.reduce((s, p) => s + p[k], 0) / V.length);
  const vis = F.map((f) => { let n = cross(sub3(V[f[1]], V[f[0]]), sub3(V[f[2]], V[f[0]])); const fc = [0, 1, 2].map((k) => f.reduce((s, i) => s + V[i][k], 0) / f.length); if (dot3(n, sub3(fc, mid)) < 0) n = n.map((x) => -x); return dot3(n, VIEW) < -1e-9; });
  return edgesOf(F).filter((e) => !F.some((f, i) => vis[i] && f.includes(e[0]) && f.includes(e[1]) && [1, f.length - 1].includes(Math.abs(f.indexOf(e[0]) - f.indexOf(e[1])))));
}
// nets, drawn small enough to sit side by side
export function triPyrNet() { return G.polygonFig({ pts: [[0, 0], [10, 0], [5, 8.66]], regions: [[[0, 0], [5, 0], [2.5, 4.33]], [[5, 0], [10, 0], [7.5, 4.33]], [[2.5, 4.33], [7.5, 4.33], [5, 8.66]], [[5, 0], [7.5, 4.33], [2.5, 4.33]]].map((p, i) => ({ pts: p, t: i === 3 ? 'top' : 'front' })), W: 220, H: 200, pad: 24 }); }
export function netOf(name, k = 0) {
  if (name === 'cube') return G.netFig({ cells: G.CUBE_NETS[k % G.CUBE_NETS.length] });
  if (name === 'rectangular prism') return G.boxNet({ l: 6, w: 3, h: 4 });
  if (name === 'square pyramid' || name === 'square-based pyramid') return G.pyramidNet();
  if (name === 'triangular prism') return G.triPrismNet();
  if (name === 'triangular pyramid') return triPyrNet();
  if (name === 'cylinder') return G.cylinderNet();
  return G.coneNet();
}

// ═════════════════════════════ question makers ═════════════════════════════
const seq = (n) => Array.from({ length: n }, (_, i) => i + 1).join(', ');
const others = (r, pool, right, k = 3, not = []) => r.shuffle(pool.filter((x) => x !== right && !not.includes(x))).slice(0, k);
const isFlat = (n) => !!FLAT[n] || n === 'circle' || n === 'oval';
// a small picture of a named flat shape or solid (or a figure passed straight through)
export const sm = (n, o = {}) => (typeof n !== 'string' ? n : isFlat(n) ? flatFig(n, { small: true, ...o }) : solidFig(n, { small: true, ...o }));
export const bigFig = (n, o = {}) => (isFlat(n) ? flatFig(n, o) : solidFig(n, o));
const choose = (r, right, wrongs, q, steps, extra = {}) => picChoice(r, sm(right), wrongs.map((w) => sm(w)), { q, steps, ...extra });
// names a shape must never be offered as wrong, because they are also true (a square is also a rectangle)
const ALSO = { square: ['rectangle', 'rhombus', 'diamond', 'kite', 'parallelogram', 'trapezoid', 'quadrilateral'], circle: ['oval'], rectangle: ['parallelogram', 'trapezoid', 'quadrilateral'], rhombus: ['parallelogram', 'kite', 'trapezoid', 'quadrilateral'], diamond: ['parallelogram', 'kite', 'trapezoid'], cube: ['rectangular prism'], parallelogram: ['trapezoid', 'quadrilateral'], trapezoid: ['quadrilateral'], kite: ['quadrilateral'] };
const wrongNames = (r, pool, right, k = 3) => others(r, pool, right, k, ALSO[right] ?? []);
const showWhy = (n, o = {}) => (SIDES[n] ? flatFig(n, { ...o, count: 'sides' }) : flatFig(n, { ...o, count: 'curve' }));
const WHY = {
  circle: 'It is round. It has no corners.', oval: 'It is round but stretched, like an egg.', square: 'It has 4 sides, all the same length, and 4 square corners.',
  triangle: 'It has 3 sides and 3 corners.', rectangle: 'It has 4 sides: 2 long and 2 short, and 4 square corners.', hexagon: 'It has 6 sides and 6 corners.',
  pentagon: 'It has 5 sides and 5 corners.', octagon: 'It has 8 sides and 8 corners.', rhombus: 'It has 4 sides, all the same length, but no square corners.', diamond: 'It has 4 sides, all the same length. It stands on a corner.',
};
// count the sides or corners of a flat shape, with the count drawn on it
const countFlat = (n, what, o = {}) => {
  const k = SIDES[n], one = what === 'sides' ? 'side' : 'corner';
  if (!k) return [St(`${cap(an(n))} is round. It has no straight sides and no corners.`, flatFig(n, { ...o, count: 'curve' })), `So ${an(n)} has 0 ${what}.`];
  return [St(`Touch each ${one} once as you count.`, flatFig(n, { ...o, count: what === 'sides' ? 'sides' : 'corners' })), `Count: ${seq(k)}.`, `So the ${n} has ${k} ${what}.`];
};
// count the faces, edges or vertices of a solid, one group at a time
const PART = { faces: 'faces', edges: 'edges', vertices: 'corners (vertices)' };
export function countSolid(name, what, word = what) {
  const gs = solidGroups(name, what), parts = gs.map((g) => (g.faces ?? g.edges ?? g.dots).length), n = parts.reduce((a, b) => a + b, 0);
  return { n, steps: [
    ...gs.map((g, i) => St(what === 'faces' ? `Count ${g.say}: ${parts[i]}.` : `Count the ${PART[what]} ${g.say}: ${parts[i]}.`, solidFig(name, { hlFaces: g.faces, hlEdges: g.edges, dots: g.dots, numbers: true }))),
    `${parts.join(' + ')} = ${n}.`, `So ${an(name)} has ${n} ${word}.`] };
}
// every face, edge or vertex of a solid lit up at once
const allParts = (x, what) => solidGroups(x, what).reduce((o, g) => ({ hlFaces: [...o.hlFaces, ...(g.faces ?? [])], hlEdges: [...o.hlEdges, ...(g.edges ?? [])], dots: [...o.dots, ...(g.dots ?? [])] }), { hlFaces: [], hlEdges: [], dots: [] });
export const L = (text, visual) => (visual ? { text, visual } : text);

// ───── Kindergarten ─────
const K_FLAT = ['circle', 'square', 'triangle', 'rectangle', 'hexagon', 'oval'];
const TAP = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'oval'];
export function kShapes2d(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const s = r.pick(K_FLAT), rot = SIDES[s] ? r.pick([0, 0, 12, -12]) : 0;
    return mc(r, s, wrongNames(r, K_FLAT, s), { q: 'What is the name of this shape?', visual: flatFig(s, { rot }), steps: [St(WHY[s], showWhy(s, { rot })), `So it is ${an(s)}.`] });
  }
  if (v === 1) { const s = r.pick(['circle', 'square', 'triangle', 'rectangle']); return mc(r, s, wrongNames(r, TAP, s), { q: `Tap the ${s}.`, shapeChoices: true, steps: [St(WHY[s], showWhy(s)), `That is the ${s}.`] }); }
  if (v === 2) {
    const s = r.pick(['triangle', 'square', 'hexagon']), k = SIDES[s];
    return choose(r, s, others(r, ['triangle', 'square', 'hexagon', 'circle'], s), `Which shape has ${k} straight sides?`, (Lt) => ['Count the straight sides of each shape.', St(`The ${s} has ${k} sides: ${seq(k)}.`, flatFig(s, { count: 'sides' })), `So the answer is ${Lt}.`]);
  }
  if (v === 3) {
    const tri = r.bool(), odd = tri ? r.pick(['square', 'circle', 'rectangle', 'hexagon']) : r.pick(['triangle', 'circle', 'hexagon']);
    const same = tri ? [sm('triangle', { rot: r.pick([0, 180, 30]) }), sm('right triangle'), sm('long triangle', { rot: r.pick([0, 20]) })] : [sm('rectangle'), sm('rectangle', { rot: 90 }), sm('rectangle', { sx: 0.7 })];
    const t = tri ? 'triangle' : 'rectangle';
    return picChoice(r, sm(odd), same, { q: `Three of these are ${t}s. Which one is NOT ${an(t)}?`, steps: (Lt) => [tri ? 'A triangle has 3 sides. Big or small, turned or not, it is still a triangle.' : 'A rectangle has 4 sides and 4 square corners. Turned or not, it is still a rectangle.', St(`Picture ${Lt} is ${an(odd)}.`, flatFig(odd)), `So ${Lt} is not ${an(t)}.`] });
  }
  if (v === 4) {
    const yes = r.bool(), shown = yes ? r.pick(['triangle', 'right triangle', 'long triangle']) : r.pick(['square', 'hexagon', 'rectangle', 'pentagon']), rot = r.pick([0, 25, 160, 200]);
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'Is this shape a triangle?', visual: flatFig(shown, { rot }), steps: [St(`Count its sides: ${seq(SIDES[shown])}.`, flatFig(shown, { rot, count: 'sides' })), yes ? 'It has 3 sides, so it is a triangle. Yes!' : `It has ${SIDES[shown]} sides, not 3. So the answer is no.`] });
  }
  if (v === 5) {
    const t = r.pick(['circle', 'triangle', 'square']), names = Array.from({ length: 6 }, () => r.pick(['circle', 'triangle', 'square']));
    if (!names.includes(t)) names[r.int(0, 5)] = t;
    const idx = names.map((x, i) => (x === t ? i : -1)).filter((i) => i >= 0), n = idx.length, nums = names.map((x, i) => (x === t ? String(idx.indexOf(i) + 1) : null));
    return num(n, [St(`Find each ${t}.`, shapeRow(names, { hl: idx, numbers: nums })), `Count them: ${seq(n)}.`, `So there ${n === 1 ? 'is 1' : `are ${n}`} ${t}${n === 1 ? '' : 's'}.`], { q: `How many ${t}s are in this row?`, visual: shapeRow(names), expr: `${n}` });
  }
  const [s, rot] = r.pick([['square', 45], ['triangle', 180], ['rectangle', 90], ['hexagon', 30]]);
  return mc(r, s, wrongNames(r, ['circle', 'square', 'triangle', 'rectangle', 'hexagon'], s), { q: 'This shape has been turned. What shape is it?', visual: flatFig(s, { rot }), steps: ['Turning a shape does not change it.', St(`Count its sides: ${seq(SIDES[s])}.`, flatFig(s, { rot, count: 'sides' })), `So it is still ${an(s)}.`] });
}
const K_SIDES = ['triangle', 'square', 'rectangle', 'diamond', 'hexagon'];
export function kShapeSides(r) {
  const v = r.int(0, 6);
  if (v === 0 || v === 1) {
    const s = r.pick(K_SIDES), what = v === 0 ? 'sides' : 'corners', k = SIDES[s];
    return num(k, countFlat(s, what), { q: `How many ${what} does this shape have?`, visual: flatFig(s), expr: `${k}` });
  }
  if (v === 2) { const curved = r.pick(['circle', 'oval']); return mc(r, curved, others(r, ['square', 'triangle', 'rectangle', 'diamond'], curved, 2), { q: 'Which shape has a curved edge?', shapeChoices: true, steps: [St('Run your finger around the edge. A curved edge bends all the way round.', flatFig(curved, { count: 'curve' })), `The ${curved} is curved.`] }); }
  if (v === 3) {
    const [a, b] = r.shuffle(['triangle', 'square', 'hexagon']), more = r.bool(), right = (more ? SIDES[a] > SIDES[b] : SIDES[a] < SIDES[b]) ? a : b;
    return picChoice(r, sm(right), [sm(right === a ? b : a)], { q: `Which shape has ${more ? 'more' : 'fewer'} sides?`, steps: (Lt) => [St(`The ${a} has ${SIDES[a]} sides.`, flatFig(a, { count: 'sides' })), St(`The ${b} has ${SIDES[b]} sides.`, flatFig(b, { count: 'sides' })), `So the ${right}, ${Lt}, has ${more ? 'more' : 'fewer'} sides.`] });
  }
  if (v === 4) { const c = r.pick(['circle', 'oval']); return choose(r, c, others(r, ['triangle', 'square', 'hexagon', 'rectangle'], c), 'Which shape has no corners?', (Lt) => [St(`The ${c} is round. No two sides meet, so there are no corners.`, flatFig(c, { count: 'curve' })), `So ${Lt} has no corners.`]); }
  if (v === 5) { const s = r.pick(['square', 'rectangle', 'diamond']); return choose(r, s, ['triangle', 'hexagon', 'circle'], 'Which shape has exactly 4 corners?', (Lt) => [St(`Count the corners of the ${s}: 1, 2, 3, 4.`, flatFig(s, { count: 'corners' })), `So the answer is ${Lt}.`]); }
  const s = r.pick(K_SIDES), k = SIDES[s];
  return num(k, [St('Where two sides meet, there is a corner.', flatFig(s, { count: 'corners' })), `Count the corners: ${seq(k)}.`, `There are as many corners as sides: ${k}.`], { q: `This shape has ${k} sides. How many corners does it have?`, visual: flatFig(s, { count: 'sides' }), expr: `${k}` });
}
// fold lines: [shape, line (model points) or angle for round shapes, makes matching halves?]
const FOLDS = [
  ['square', [[3, -1], [3, 7]], true], ['square', [[-1, 3], [7, 3]], true], ['square', [[-0.8, -0.8], [6.8, 6.8]], true],
  ['rectangle', [[5, -1], [5, 6]], true], ['rectangle', [[-1, 2.5], [11, 2.5]], true], ['rectangle', [[-0.6, -0.3], [10.6, 5.3]], false],
  ['triangle', [[4, -1], [4, 7.9]], true], ['triangle', [[2.4, -1], [2.4, 7.9]], false],
  ['hexagon', [[0, -5.8], [0, 5.8]], true], ['hexagon', [[2, -5.8], [2, 5.8]], false],
  ['trapezoid', [[5, -1], [5, 6]], true], ['trapezoid', [[-1, 2.5], [11, 2.5]], false],
  ['rhombus', [[4, -1], [4, 11]], true], ['rhombus', [[-1, 5], [9, 5]], true], ['long triangle', [[5, -1], [5, 5]], false],
  ['circle', 60, true], ['oval', 0, true], ['oval', 90, true], ['oval', 35, false],
];
const foldPic = ([s, f], small) => flatFig(s, { fold: f, small });
const SYM_L = ['A', 'H', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y'], NOSYM_L = ['F', 'G', 'J', 'L', 'N', 'P', 'R', 'S', 'Z'];
const HALVES = [
  ['triangle', [[0, 0], [4, 0], [0, 6.9]], [[-4, 0], [4, 0], [0, 6.9]]], ['square', [[0, 0], [3, 0], [3, 6], [0, 6]], [[-3, 0], [3, 0], [3, 6], [-3, 6]]],
  ['hexagon', [[0, -4.33], [2.5, -4.33], [5, 0], [2.5, 4.33], [0, 4.33]], G.regular(6)], ['circle', Array.from({ length: 13 }, (_, i) => [R1(5 * Math.cos(((i * 15 - 90) * Math.PI) / 180)), R1(5 * Math.sin(((i * 15 - 90) * Math.PI) / 180))]), null],
];
export function symmetry(r) {
  const v = r.int(0, 5);
  if (v === 0) {
    const yes = r.pick(SYM_L), no = r.shuffle(NOSYM_L).slice(0, 3);
    return picChoice(r, letterFig(yes, { fold: true, small: true }), no.map((c) => letterFig(c, { fold: true, small: true })), { q: 'Fold each letter on the dashed line. Which letter has two halves that match?', steps: (Lt) => ['Look at both sides of each dashed line.', St(`The two halves of ${yes} are the same, like in a mirror.`, letterFig(yes, { fold: true })), `So the answer is ${Lt}: the letter ${yes}.`] });
  }
  if (v === 1 || v === 2) {
    const F = r.pick(FOLDS), right = F[2] ? 'Yes' : 'No';
    if (v === 1) return mc(r, right, [F[2] ? 'No' : 'Yes'], { q: 'Fold this shape on the dashed line. Do the two halves match?', visual: foldPic(F), steps: ['Picture folding one half over onto the other.', F[2] ? 'Each part on one side has a matching part on the other side. They match: yes.' : 'The two sides are not the same shape, so they do not match: no.'] });
    const good = r.pick(FOLDS.filter((f) => f[2])), bad = r.shuffle(FOLDS.filter((f) => !f[2] && f[0] !== good[0])).slice(0, 3);
    return picChoice(r, foldPic(good, true), bad.map((f) => foldPic(f, true)), { q: 'In which picture does the dashed line make two matching halves?', steps: (Lt) => ['A fold line that works makes one half land exactly on the other.', St(`In ${Lt}, the halves of the ${good[0]} match.`, foldPic(good)), `So the answer is ${Lt}.`] });
  }
  if (v === 3) {
    const [s, half, whole] = r.pick(HALVES), ys = half.map((p) => p[1]), fold = [[0, Math.min(...ys) - 1], [0, Math.max(...ys) + 1]];
    return mc(r, s, others(r, ['triangle', 'square', 'hexagon', 'circle'], s), { q: 'This is half of a shape. The dashed line is a fold. Open it up. What is the whole shape?', visual: flatFig('half', { pts: half, fold }), steps: ['The other half is the same, flipped over the fold line.', St(`Together they make ${an(s)}.`, whole ? flatFig(s, { pts: whole, fold }) : flatFig('circle', { fold: 90 })), `So the whole shape is ${an(s)}.`] });
  }
  if (v === 4) {
    const yes = r.bool(), c = yes ? r.pick(SYM_L) : r.pick(NOSYM_L);
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'Fold this letter on the dashed line. Do the two halves match?', visual: letterFig(c, { fold: true }), steps: ['Compare the left half with the right half.', yes ? `Both halves of ${c} are the same. Yes, they match.` : `The halves of ${c} are not the same. No, they do not match.`] });
  }
  const sym = r.bool(0.55), right = sym ? 'Yes' : 'No', s = sym ? r.pick(['square', 'rectangle', 'triangle', 'hexagon', 'circle', 'rhombus']) : r.pick(['long triangle', 'parallelogram']);
  const F = FOLDS.find((f) => f[0] === s && f[2]);
  return mc(r, right, [sym ? 'No' : 'Yes'], { q: 'Can this shape be folded so the two halves match exactly?', visual: flatFig(s), steps: [sym ? St('Yes: fold it on this line and one half lands on the other.', foldPic(F)) : 'Its sides are all different, so no fold makes two matching halves.', `So the answer is ${right}.`] });
}
// solids for the youngest
const K_SOLIDS = ['sphere', 'cube', 'cone', 'cylinder'];
const SOLID_HL = { cube: { hlFaces: [0, 2, 5] }, cone: { hl: ['base'] }, cylinder: { hl: ['base', 'top'] }, sphere: { hl: 'curve' }, 'rectangular prism': { hlFaces: [0, 2, 5] }, 'square pyramid': { hlFaces: [1, 2] }, 'square-based pyramid': { hlFaces: [1, 2] }, 'triangular prism': { hlFaces: [0] }, 'triangular pyramid': { hlFaces: [1] } };
const CLUE = {
  sphere: 'It is round all over, like a ball. It has no flat faces.', cube: 'It has 6 flat faces. Every face is a square.', cone: 'It has one flat circle at the bottom and a point at the top.',
  cylinder: 'It has 2 flat circles, one on the top and one on the bottom, and a curved side.', 'rectangular prism': 'It has 6 flat faces that are rectangles, like a box.',
  'square pyramid': 'It has a square at the bottom and 4 triangles that meet at a point.', 'triangular prism': 'It has 2 triangle ends and 3 rectangles around the sides.', 'triangular pyramid': 'It has 4 faces, and every face is a triangle.',
};
CLUE['square-based pyramid'] = CLUE['square pyramid'];
const OBJ3 = { sphere: ['a ball', 'an orange', 'a globe'], cube: ['a dice', 'an ice cube', 'a toy block'], cone: ['an ice cream cone', 'a party hat', 'a traffic pylon'], cylinder: ['a soup can', 'a drum', 'a candle'], 'rectangular prism': ['a cereal box', 'a brick', 'a book'], 'square pyramid': ['a pyramid in Egypt', 'a tent with a square floor'], 'triangular prism': ['a tent with a triangle front', 'a box with triangle ends'] };
const OBJ2 = { circle: ['a pizza', 'a clock face', 'a coin'], square: ['a sticky note', 'a square cracker'], triangle: ['a yield sign', 'a slice of pizza'], rectangle: ['a door', 'a sheet of paper', 'a book cover'] };
export function kSolidsName(r) {
  const v = r.int(0, 5);
  if (v === 0) { const s = r.pick(K_SOLIDS); return mc(r, s, others(r, K_SOLIDS, s), { q: 'What is the name of this solid shape?', visual: solidFig(s), steps: [St(CLUE[s], solidFig(s, SOLID_HL[s])), `So it is ${an(s)}.`] }); }
  if (v === 1) { const s = r.pick(K_SOLIDS); return choose(r, s, others(r, K_SOLIDS, s), `Which solid shape am I? ${CLUE[s]}`, (Lt) => [CLUE[s], St(`That is ${an(s)}.`, solidFig(s, SOLID_HL[s])), `So the answer is ${Lt}.`]); }
  if (v === 2) {
    const flat = r.bool(), s = flat ? r.pick(['circle', 'square', 'triangle', 'rectangle']) : r.pick(K_SOLIDS), right = flat ? 'flat' : 'solid';
    return mc(r, right, [flat ? 'solid' : 'flat'], { q: 'Is this a flat shape or a solid shape?', visual: bigFig(s), steps: [flat ? 'A flat shape lies flat on paper. You cannot pick it up.' : 'A solid shape takes up space. You can pick it up and turn it around.', `It is ${an(s)}, so it is ${right}.`] });
  }
  if (v === 3) { const s = r.pick(K_SOLIDS); return choose(r, s, others(r, K_SOLIDS, s), `Which picture shows ${an(s)}?`, (Lt) => [CLUE[s], St(`Picture ${Lt} is ${an(s)}.`, solidFig(s, SOLID_HL[s])), `So the answer is ${Lt}.`]); }
  if (v === 4) {
    const wantFlat = r.bool(), right = wantFlat ? r.pick(['circle', 'square', 'triangle']) : r.pick(K_SOLIDS), wr = wantFlat ? others(r, K_SOLIDS, '') : others(r, ['circle', 'square', 'triangle', 'rectangle'], '');
    return choose(r, right, wr, `Which one is a ${wantFlat ? 'flat' : 'solid'} shape?`, (Lt) => [wantFlat ? 'Flat shapes lie flat, like a drawing. Solid shapes take up space.' : 'Solid shapes take up space, like things you can hold. Flat shapes are like drawings.', St(`Picture ${Lt} is ${an(right)}: a ${wantFlat ? 'flat' : 'solid'} shape.`, bigFig(right)), `So the answer is ${Lt}.`]);
  }
  const s = r.pick(K_SOLIDS), thing = r.pick(OBJ3[s]);
  return choose(r, s, others(r, K_SOLIDS, s), `Which solid shape is ${thing} like?`, (Lt) => [`Think about the shape of ${thing}.`, St(`It is like ${an(s)}.`, solidFig(s)), `So the answer is ${Lt}.`]);
}
export function kSolidsFaces(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const [s, f, o] = r.pick([['cube', 'square', { hlFaces: [0] }], ['cylinder', 'circle', { hl: ['top'] }], ['cone', 'circle', { hl: ['base'] }], ['rectangular prism', 'rectangle', { hlFaces: [0] }]]);
    return mc(r, f, others(r, ['circle', 'square', 'triangle', 'rectangle'], f, 3, ALSO[f] ?? []), { q: `You trace around the pink flat face of this ${s}. Which shape do you draw?`, visual: solidFig(s, o), shapeChoices: true, steps: [St(`The pink face is flat. Its edge is ${f === 'circle' ? 'round' : f === 'square' ? '4 equal sides' : '2 long sides and 2 short sides'}.`, solidFig(s, o)), `So you draw ${an(f)}.`] });
  }
  if (v === 1) {
    const [qq, right, wr, why] = r.pick([['can roll but cannot stack', 'sphere', ['cube', 'rectangular prism', 'cylinder'], 'A sphere is curved all over: it rolls, but nothing sits on top of it.'], ['can stack but cannot roll', 'cube', ['sphere', 'cylinder', 'cone'], 'A cube has only flat faces: it stacks, but it cannot roll.'], ['can roll and can also stack', 'cylinder', ['sphere', 'cube', 'rectangular prism'], 'A cylinder has a curved side to roll on and flat ends to stack.']]);
    return choose(r, right, wr, `Which solid ${qq}?`, (Lt) => [St(why, solidFig(right, SOLID_HL[right])), `So the answer is ${Lt}.`]);
  }
  if (v === 2) {
    const s = r.pick(['cube', 'cylinder', 'cone', 'sphere']);
    if (s === 'cube') { const { n, steps } = countSolid('cube', 'faces', 'flat faces'); return num(n, steps, { q: 'How many flat faces does this cube have?', visual: solidFig('cube'), expr: `${n}` }); }
    const n = { cylinder: 2, cone: 1, sphere: 0 }[s];
    return num(n, [St({ cylinder: 'A cylinder has a flat circle on the top and one on the bottom. Its side is curved.', cone: 'A cone has one flat circle at the bottom. The rest is curved.', sphere: 'A sphere is curved all over.' }[s], solidFig(s, SOLID_HL[s])), `So ${an(s)} has ${n} flat ${n === 1 ? 'face' : 'faces'}.`], { q: `How many flat faces does this ${s} have?`, visual: solidFig(s), expr: `${n}` });
  }
  if (v === 3) return choose(r, 'cone', ['cylinder', 'sphere'], 'Which solid has a point at the top?', (Lt) => [St('The cone gets thinner and thinner, up to a point.', solidFig('cone')), `So the answer is ${Lt}.`]);
  if (v === 4) { const right = r.pick(['sphere', 'cylinder']); return choose(r, right, ['cube', 'rectangular prism', 'triangular prism'], 'Which solid can roll?', (Lt) => [St(`The ${right} has a curved part, so it can roll.`, solidFig(right, SOLID_HL[right])), 'The others have only flat faces, so they slide instead.', `So the answer is ${Lt}.`]); }
  if (v === 5) return choose(r, 'sphere', others(r, ['cube', 'cylinder', 'cone', 'rectangular prism'], ''), 'Which solid has no flat faces at all?', (Lt) => [St('A sphere is curved all over, like a ball.', solidFig('sphere', { hl: 'curve' })), `So the answer is ${Lt}.`]);
  const s = r.pick(['sphere', 'cylinder', 'cone', 'cube', 'rectangular prism']), rolls = s === 'sphere' || s === 'cylinder' || s === 'cone';
  return mc(r, rolls ? 'Yes' : 'No', [rolls ? 'No' : 'Yes'], { q: 'Can this solid roll?', visual: solidFig(s), steps: [St(rolls ? `The ${s} has a curved part to roll on.` : `The ${s} has only flat faces. It slides, but it does not roll.`, solidFig(s, SOLID_HL[s])), `So the answer is ${rolls ? 'Yes' : 'No'}.`] });
}
// a little scene of flat shapes: one on top of another, one beside them
const shapeH = (n, sz) => { if (n === 'circle') return sz; const p = FLAT[n], xs = p.map((q) => q[0]), ys = p.map((q) => q[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys); return (sz * h) / Math.max(w, h); };
const stackFig = (top, bottom, side, hl) => { const F = 226, hb = shapeH(bottom, 104), ht = shapeH(top, 80), hs = shapeH(side, 96);
  return placeShapes([{ name: bottom, at: [100, F - hb / 2], s: 104, t: hl === bottom ? 'hl' : 'fig' }, { name: top, at: [100, F - hb - ht / 2], s: 80, t: hl === top ? 'hl' : 'fig' }, { name: side, at: [225, F - hs / 2], s: 96 }], 290, 240, [G.line([24, F], [280, F], 'ink')]); };
export function kShapesReal(r) {
  const v = r.int(0, 5);
  if (v === 0) { const [thing, s] = r.pick([['a pizza', 'circle'], ['a door', 'rectangle'], ['a sandwich cut in half from corner to corner', 'triangle'], ['a clock face', 'circle'], ['a yield sign', 'triangle'], ['a sheet of paper', 'rectangle'], ['a sticky note', 'square'], ['a cracker with 4 equal sides', 'square']]); return mc(r, s, wrongNames(r, ['circle', 'square', 'triangle', 'rectangle'], s), { q: `Which flat shape looks like ${thing}?`, shapeChoices: true, steps: [`Think about the outline of ${thing}.`, St(`It is ${an(s)}.`, flatFig(s)), `So tap the ${s}.`] }); }
  if (v === 1) { const s = r.pick(K_SOLIDS), thing = r.pick(OBJ3[s]); return choose(r, s, others(r, K_SOLIDS, s), `Which solid shape is ${thing} like?`, (Lt) => [`Think about the shape of ${thing}.`, St(`It is like ${an(s)}.`, solidFig(s)), `So the answer is ${Lt}.`]); }
  if (v === 2) { const s = r.pick(K_SOLIDS), right = r.pick(OBJ3[s]), wr = others(r, K_SOLIDS, s).map((x) => r.pick(OBJ3[x])); return mc(r, right, wr, { q: 'Which thing has this shape?', visual: solidFig(s), steps: [St(`This solid is ${an(s)}.`, solidFig(s, SOLID_HL[s])), `${cap(right)} is shaped like ${an(s)}.`] }); }
  if (v === 3) { const s = r.pick(Object.keys(OBJ2)), right = r.pick(OBJ2[s]), wr = others(r, Object.keys(OBJ2), s, 3, ALSO[s] ?? []).map((x) => r.pick(OBJ2[x])); return mc(r, right, wr, { q: 'Which thing has this flat shape?', visual: flatFig(s), steps: [St(`This shape is ${an(s)}.`, showWhy(s)), `${cap(right)} is shaped like ${an(s)}.`] }); }
  const [a, b, c] = r.shuffle(['circle', 'square', 'triangle', 'rectangle']);
  if (v === 4) {
    const askBelow = r.bool(), right = askBelow ? b : a;
    return mc(r, right, [askBelow ? a : b, c], { q: `Which shape is ${askBelow ? `under the ${a}` : `on top of the ${b}`}?`, visual: stackFig(a, b, c), shapeChoices: true, steps: [St(`The ${a} sits on top of the ${b}. The ${c} is beside them.`, stackFig(a, b, c, right)), `So the answer is the ${right}.`] });
  }
  const pos = r.pick(['in the middle', 'on the left', 'on the right']), right = pos === 'in the middle' ? b : pos === 'on the left' ? a : c;
  return mc(r, right, [a, b, c].filter((x) => x !== right), { q: `Which shape is ${pos}?`, visual: shapeRow([a, b, c]), shapeChoices: true, steps: [St(`From left to right: ${a}, ${b}, ${c}.`, shapeRow([a, b, c], { hl: [[a, b, c].indexOf(right)] })), `So the ${right} is ${pos}.`] });
}

// ───── Grade 1 ─────
const SH1 = ['triangle', 'square', 'rectangle', 'rhombus', 'circle', 'pentagon', 'hexagon', 'octagon'];
const ODD_HEX = [[0, 0], [5, 0], [8, 3], [6, 7], [1, 7], [-2, 3]];
export function g1ShapeSides(r) {
  const v = r.int(0, 6), s = r.pick(SH1);
  if (v === 0) return mc(r, s, wrongNames(r, SH1, s), { q: 'What is the name of this shape?', visual: flatFig(s), steps: [St(WHY[s], showWhy(s)), `It is ${an(s)}.`] });
  if (v === 1 || v === 2) {
    const k = SIDES[s], st = countFlat(s, v === 1 ? 'sides' : 'corners');
    if (v === 2) st[st.length - 1] = `So the ${s} has ${k} vertices.`;
    return num(k, st, { q: `How many ${v === 1 ? 'sides' : 'vertices'} does this shape have?${v === 2 ? ' (A vertex is a corner.)' : ''}`, visual: flatFig(s), expr: `${k}` });
  }
  if (v === 3) {
    const [a, b] = r.shuffle(['triangle', 'square', 'pentagon', 'hexagon', 'octagon']).slice(0, 2), more = r.bool(), right = (more ? SIDES[a] > SIDES[b] : SIDES[a] < SIDES[b]) ? a : b;
    return picChoice(r, sm(right), [sm(right === a ? b : a)], { q: `Which shape has ${more ? 'more' : 'fewer'} sides?`, steps: (Lt) => [St(`The ${a} has ${SIDES[a]} sides.`, flatFig(a, { count: 'sides' })), St(`The ${b} has ${SIDES[b]} sides.`, flatFig(b, { count: 'sides' })), `So the ${right}, ${Lt}, has ${more ? 'more' : 'fewer'} sides.`] });
  }
  if (v === 4) { const t = r.pick(['triangle', 'pentagon', 'hexagon', 'octagon']), k = SIDES[t]; return choose(r, t, others(r, ['triangle', 'square', 'pentagon', 'hexagon', 'octagon', 'circle'], t), `Which shape has ${k} sides?`, (Lt) => ['Count the sides of each shape.', St(`The ${t} has ${k}: ${seq(k)}.`, flatFig(t, { count: 'sides' })), `So the answer is ${Lt}.`]); }
  if (v === 5) {
    const [a, b] = r.shuffle(['triangle', 'square', 'pentagon', 'hexagon']).slice(0, 2), n = SIDES[a] + SIDES[b];
    return num(n, [St(`The ${a} has ${SIDES[a]} sides.`, flatFig(a, { count: 'sides' })), St(`The ${b} has ${SIDES[b]} sides.`, flatFig(b, { count: 'sides' })), `${SIDES[a]} + ${SIDES[b]} = ${n}.`, `So there are ${n} sides in all.`], { q: 'How many sides do these two shapes have in all?', visual: figs([sm(a), sm(b)], [a, b]), expr: `${SIDES[a]}+${SIDES[b]}` });
  }
  const t = r.pick(['triangle', 'square', 'hexagon']), k = SIDES[t], right = k === 3 ? 'right triangle' : k === 4 ? r.pick(['rectangle', 'trapezoid', 'rhombus']) : 'hexagon';
  const rightFig = (o) => (k === 6 ? flatFig('hexagon', { pts: ODD_HEX, ...o }) : flatFig(right, o));
  const pool = ['triangle', 'square', 'pentagon', 'hexagon', 'octagon', 'circle'].filter((x) => SIDES[x] !== k);
  return picChoice(r, rightFig({ small: true }), others(r, pool, '').map((x) => sm(x)), { q: `Which shape has the same number of sides as the ${t}?`, lead: flatFig(t, { small: true, tone: 'hl2' }), leadCap: `The ${t}`, steps: (Lt) => [St(`The ${t} has ${k} sides.`, flatFig(t, { count: 'sides' })), St(`Shape ${Lt} also has ${k} sides.`, rightFig({ count: 'sides' })), `So the answer is ${Lt}.`] });
}
const MARKS = { square: { right: [0, 1, 2, 3], ticks: [1, 1, 1, 1] }, rectangle: { right: [0, 1, 2, 3], ticks: [1, 2, 1, 2] }, rhombus: { ticks: [1, 1, 1, 1] } };
const ATTR = { square: 'It has 4 equal sides and 4 square corners.', rectangle: 'It has 4 square corners, with 2 long sides and 2 short sides.', triangle: 'It has 3 sides and 3 vertices.', rhombus: 'It has 4 equal sides but no square corners.', circle: 'It is round, with no sides and no vertices.', pentagon: 'It has 5 sides and 5 vertices.', hexagon: 'It has 6 sides and 6 vertices.' };
const RIDDLES = [
  ['I have 4 equal sides and 4 square corners. What am I?', 'square', ['rhombus', 'triangle', 'circle']], ['I have 3 sides and 3 vertices. What am I?', 'triangle', ['square', 'circle', 'pentagon']],
  ['I have no sides and no vertices. What am I?', 'circle', ['triangle', 'square', 'hexagon']], ['I have 4 equal sides but no square corners. What am I?', 'rhombus', ['square', 'triangle', 'hexagon']],
  ['I have 4 square corners, 2 long sides and 2 short sides. What am I?', 'rectangle', ['square', 'rhombus', 'triangle']], ['I have 6 sides and 6 vertices. What am I?', 'hexagon', ['pentagon', 'octagon', 'square']],
  ['I have 5 sides and 5 vertices. What am I?', 'pentagon', ['hexagon', 'square', 'triangle']],
];
export function g1ShapeAttr(r) {
  const v = r.int(0, 6);
  if (v === 0) { const [q, a, w] = r.pick(RIDDLES); return choose(r, a, w, q, (Lt) => ['Check the number of sides, then the corners.', St(`${ATTR[a]} That is ${an(a)}.`, MARKS[a] ? flatFig(a, MARKS[a]) : showWhy(a)), `So the answer is ${Lt}.`]); }
  if (v === 1) { const name = r.pick(Object.keys(ATTR)); return mc(r, ATTR[name], others(r, Object.keys(ATTR), name).map((x) => ATTR[x]), { q: 'Which is true about this shape?', visual: flatFig(name), steps: [St(`This shape is ${an(name)}.${MARKS[name] ? ' Small squares mark square corners; ticks mark equal sides.' : ''}`, MARKS[name] ? flatFig(name, MARKS[name]) : showWhy(name)), ATTR[name]] }); }
  if (v === 2) { const s = r.pick(['triangle', 'square', 'rectangle', 'pentagon', 'hexagon']), open = r.bool(); return mc(r, open ? 'open' : 'closed', [open ? 'closed' : 'open'], { q: 'Is this shape open or closed?', visual: open ? openFig(s) : flatFig(s, { tone: 'paper' }), steps: ['Trace around the edge with your finger. A closed shape has no gaps.', open ? 'There is a gap where the sides do not meet, so it is open.' : 'All the sides join up with no gap, so it is closed.'] }); }
  if (v === 3) {
    const wantClosed = r.bool(), [a, b, c, d] = r.shuffle(['triangle', 'square', 'rectangle', 'pentagon', 'hexagon']);
    const right = wantClosed ? flatFig(a, { small: true, tone: 'paper' }) : openFig(a, { small: true }), wr = [b, c, d].map((x) => (wantClosed ? openFig(x, { small: true }) : flatFig(x, { small: true, tone: 'paper' })));
    return picChoice(r, right, wr, { q: `Which shape is ${wantClosed ? 'closed' : 'open'}?`, steps: (Lt) => ['A closed shape has no gaps. An open shape has a gap where the sides do not meet.', St(`Shape ${Lt} ${wantClosed ? 'has no gap' : 'has a gap'}.`, wantClosed ? flatFig(a, { tone: 'paper' }) : openFig(a)), `So the answer is ${Lt}.`] });
  }
  if (v === 4) {
    const fours = r.shuffle(['square', 'rectangle', 'rhombus', 'trapezoid']).slice(0, 3), odd = r.pick(['triangle', 'circle', 'pentagon', 'hexagon']);
    return choose(r, odd, fours, 'Which shape does not belong?', (Lt) => [St('Three shapes have 4 sides each.', figs(fours.map((x) => sm(x, { count: 'sides' })), fours)), St(`The ${odd} ${SIDES[odd] ? `has ${SIDES[odd]} sides` : 'has no sides'}.`, showWhy(odd)), `So ${Lt} does not belong.`]);
  }
  if (v === 5) { const s = r.pick(['square', 'rectangle']); return choose(r, s, ['rhombus', 'trapezoid', 'parallelogram'], 'Which shape has 4 square corners?', (Lt) => ['A square corner looks like the corner of a page.', St(`Shape ${Lt}, the ${s}, has 4 square corners.`, flatFig(s, { right: [0, 1, 2, 3] })), `So the answer is ${Lt}.`]); }
  const [s, ticks] = r.pick([['square', [1, 1, 1, 1]], ['rhombus', [1, 1, 1, 1]], ['triangle', [1, 1, 1]]]);
  return choose(r, s, ['rectangle', 'long triangle', 'trapezoid'], 'Which shape has all its sides the same length?', (Lt) => ['Compare the sides of each shape.', St(`All the sides of the ${s} match. The ticks show equal sides.`, flatFig(s, { ticks })), `So the answer is ${Lt}.`]);
}
// shapes put together, with the joins dashed
const COMPOSE = [
  ['Two squares are pushed together.', 'rectangle', () => flatFig('rectangle', { pts: [[0, 0], [12, 0], [12, 6], [0, 6]], folds: [[[6, 0], [6, 6]]] })],
  ['Six triangles are pushed together.', 'hexagon', () => flatFig('hexagon', { folds: G.regular(6).map((p) => [[0, 0], p]) })],
  ['Two half circles are pushed together.', 'circle', () => flatFig('circle', { fold: 90 })],
  ['Two triangles are pushed together.', 'square', () => flatFig('square', { folds: [[[0, 0], [6, 6]]] })],
  ['Four small squares are pushed together.', 'square', () => flatFig('square', { folds: [[[3, 0], [3, 6]], [[0, 3], [6, 3]]] })],
];
export function composeQ(r) { const [d, a, f] = r.pick(COMPOSE); return mc(r, a, wrongNames(r, ['rectangle', 'hexagon', 'circle', 'square', 'triangle'], a), { q: `${d} The dashed lines show where they meet. What shape do they make?`, visual: f(), steps: [St('Look at the outside edge of the whole picture.', f()), `Together they make ${an(a)}.`] }); }
// congruent shapes on a grid: the same shape, a wider one, a taller one, a different one
const CONG = { rect: [[0, 0], [3, 0], [3, 2], [0, 2]], L: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]], tri: [[0, 0], [3, 0], [0, 2]], sq: [[0, 0], [2, 0], [2, 2], [0, 2]] };
const wider = (p) => p.map(([x, y]) => [x > 0.5 ? x + 1 : x, y]), taller = (p) => p.map(([x, y]) => [x, y > 0.5 ? y + 1 : y]);
const rot90 = (p) => { const q = p.map(([x, y]) => [y, -x]), mx = Math.min(...q.map((a) => a[0])), my = Math.min(...q.map((a) => a[1])); return q.map(([x, y]) => [x - mx, y - my]); };
const onGrid = (p, t = 'fig') => { const w = Math.max(...p.map((a) => a[0])), h = Math.max(...p.map((a) => a[1])), dx = Math.floor((6 - w) / 2), dy = Math.floor((5 - h) / 2); return gridFig({ cols: 6, rows: 5, u: 22, shapes: [{ pts: p.map(([x, y]) => [x + dx, y + dy]), t }] }); };
export function congruent(r, turnIt = false) {
  const k = r.pick(Object.keys(CONG)), P = CONG[k], turned = turnIt && r.bool(), same = turned ? rot90(P) : P, diff = CONG[r.pick(Object.keys(CONG).filter((x) => x !== k))];
  return picChoice(r, onGrid(same), [onGrid(wider(P)), onGrid(taller(P)), onGrid(diff)], { q: 'Which shape is congruent to the pink shape (the same shape and the same size)?', lead: onGrid(P, 'hl'), leadCap: 'Pink shape', steps: (Lt) => ['Congruent shapes have the same shape and the same size. Count the squares along each side.', St(`Shape ${Lt} matches the pink shape exactly${turned ? ', just turned' : ''}.`, onGrid(same, 'hl')), 'The others are wider, taller or a different shape.', `So the answer is ${Lt}.`] });
}
const MOVE_DESC = { slide: 'It moved to a new place. It still faces the same way.', flip: 'It flipped over the dashed line, like a mirror image.', turn: 'It turned around the dot, a quarter of the way round.' };
export function moveName(r, names = { slide: 'slide', flip: 'flip', turn: 'turn' }) {
  const k = r.pick(['slide', 'flip', 'turn']);
  return mc(r, names[k], Object.values(names).filter((x) => x !== names[k]), { q: 'The blue shape moved to where the pink shape is. What kind of move was it?', visual: moveFig(k), steps: ['Slide: same way round, new place. Flip: a mirror image. Turn: it spins around a point.', St(MOVE_DESC[k], moveFig(k, { hlLine: true })), `So it was a ${names[k]}.`] });
}
export function movePick(r, names = { slide: 'slide', flip: 'flip', turn: 'turn' }) {
  const k = r.pick(['slide', 'flip', 'turn']);
  return picChoice(r, moveFig(k, { u: 14 }), ['slide', 'flip', 'turn'].filter((x) => x !== k).map((x) => moveFig(x, { u: 14 })), { q: `Which picture shows a ${names[k]}? (The blue shape moves to the pink shape.)`, steps: (Lt) => ['Slide: same way round, new place. Flip: a mirror image. Turn: it spins around a point.', St(`In ${Lt}: ${MOVE_DESC[k].toLowerCase()}`, moveFig(k, { hlLine: true })), `So the answer is ${Lt}.`] });
}
export function foldYesNo(r) {
  const F = r.pick(FOLDS), right = F[2] ? 'Yes' : 'No';
  return mc(r, right, [F[2] ? 'No' : 'Yes'], { q: 'Is the dashed line a line of symmetry? (Fold on it: do the two halves match?)', visual: foldPic(F), steps: ['Picture folding one half over onto the other.', F[2] ? 'The halves match exactly, so yes: it is a line of symmetry.' : 'The halves do not match, so no: it is not a line of symmetry.'] });
}
export function letterSym(r) { const yes = r.pick(SYM_L), no = r.shuffle(NOSYM_L).slice(0, 3); return picChoice(r, letterFig(yes, { small: true }), no.map((c) => letterFig(c, { small: true })), { q: 'Which letter has a line of symmetry? (It folds into two matching halves.)', steps: (Lt) => ['Picture a fold line down the middle of each letter.', St(`Fold ${yes} down the middle: both halves match.`, letterFig(yes, { fold: true })), `So the answer is ${Lt}.`] }); }
export function g1ShapeWorld(r) {
  const v = r.int(0, 5);
  if (v === 0) {
    const [obj, s] = r.pick([['the face of a coin', 'circle'], ['a door', 'rectangle'], ['a yield sign', 'triangle'], ['a stop sign', 'octagon'], ['the face of a round clock', 'circle'], ['a sheet of paper', 'rectangle'], ['a square floor tile', 'square'], ['a honeycomb cell', 'hexagon'], ['a slice of pizza', 'triangle'], ['a chessboard', 'square']]);
    return choose(r, s, wrongNames(r, ['circle', 'square', 'rectangle', 'triangle', 'hexagon', 'octagon'], s), `Which shape is ${obj}?`, (Lt) => ['Think of its outline.', St(`${cap(obj)} is shaped like ${an(s)}.`, flatFig(s)), `So the answer is ${Lt}.`]);
  }
  if (v === 1) return letterSym(r);
  if (v === 2) return moveName(r);
  if (v === 3) return composeQ(r);
  if (v === 4) return congruent(r);
  return foldYesNo(r);
}
const SOL1 = ['cube', 'rectangular prism', 'cylinder', 'cone', 'sphere', 'square pyramid', 'triangular prism'];
export function solidName(r, pool = SOL1) {
  const v = r.int(0, 5), s = r.pick(pool);
  if (v === 0) return mc(r, s, wrongNames(r, pool, s), { q: 'What is the name of this solid?', visual: solidFig(s), steps: [St(CLUE[s], solidFig(s, SOLID_HL[s])), `It is ${an(s)}.`] });
  if (v === 1 && OBJ3[s]) { const thing = r.pick(OBJ3[s]); return choose(r, s, wrongNames(r, pool, s), `${cap(thing)} is shaped like which solid?`, (Lt) => ['Think of the whole object, not just one face.', St(`${cap(thing)} is shaped like ${an(s)}.`, solidFig(s)), `So the answer is ${Lt}.`]); }
  if (v <= 2) return choose(r, s, wrongNames(r, pool, s), `Which solid am I? ${CLUE[s]}`, (Lt) => [St(CLUE[s], solidFig(s, SOLID_HL[s])), `That is ${an(s)}, picture ${Lt}.`]);
  if (v === 3) {
    const wantFlat = r.bool(), right = wantFlat ? r.pick(['circle', 'square', 'triangle', 'rectangle']) : s, wr = wantFlat ? others(r, pool, '') : others(r, ['circle', 'square', 'triangle', 'rectangle', 'hexagon'], '');
    return choose(r, right, wr, `Which one is ${wantFlat ? 'a flat (two-dimensional)' : 'a solid (three-dimensional)'} shape?`, (Lt) => ['Flat shapes are like drawings. Solid shapes take up space and can be picked up.', St(`${cap(an(right))} is ${wantFlat ? 'flat' : 'solid'}.`, bigFig(right)), `So the answer is ${Lt}.`]);
  }
  if (v === 4) return choose(r, s, wrongNames(r, pool, s), `Which picture shows ${an(s)}?`, (Lt) => [CLUE[s], St(`Picture ${Lt} is ${an(s)}.`, solidFig(s, SOLID_HL[s])), `So the answer is ${Lt}.`]);
  const list = r.shuffle([...r.shuffle(pool).slice(0, r.int(1, 3)), ...r.shuffle(['circle', 'square', 'triangle', 'rectangle', 'hexagon'])].slice(0, 4));
  const n = list.filter((x) => !isFlat(x)).length;
  if (!n) return solidName(r, pool);
  return num(n, [St('Solid shapes take up space. Flat shapes are like drawings.', figs(list.map((x) => sm(x, isFlat(x) ? {} : { hlFaces: [0, 1, 2, 3, 4, 5], hl: ['top', 'base', 'curve'] })), list.map((x) => (isFlat(x) ? 'flat' : 'solid')))), `Count the solids: ${seq(n)}.`, `So ${n} of them ${n === 1 ? 'is a solid' : 'are solids'}.`], { q: 'How many of these are solid shapes?', visual: figs(list.map((x) => sm(x)), ['1', '2', '3', '4']), expr: `${n}` });
}
const FEV_SOL = ['cube', 'rectangular prism', 'square pyramid', 'triangular prism'];
export function solidCount(r, pool = FEV_SOL, word = 'vertices') {
  const v = r.int(0, 5);
  if (v <= 2) {
    const s = r.pick(pool), what = ['faces', 'edges', 'vertices'][v], { n, steps } = countSolid(s, what, what === 'vertices' ? word : what);
    return num(n, steps, { q: `How many ${what === 'vertices' ? word : what} does this ${s} have?${what === 'vertices' && word === 'vertices' ? ' (A vertex is a corner.)' : ''}`, visual: solidFig(s), expr: `${n}` });
  }
  if (v === 3) {
    const [s, n] = r.pick([['cylinder', 2], ['cone', 1], ['sphere', 0]]);
    return num(n, [St({ cylinder: 'A cylinder has a flat circle on the top and one on the bottom.', cone: 'A cone has one flat circle at the bottom.', sphere: 'A sphere is curved all over.' }[s], solidFig(s, SOLID_HL[s])), `So ${an(s)} has ${n} flat ${n === 1 ? 'face' : 'faces'}.`], { q: `How many flat faces does this ${s} have?`, visual: solidFig(s), expr: `${n}` });
  }
  const k = r.int(0, 2), what = ['faces', 'edges', 'vertices'][k], word2 = what === 'vertices' ? word : what;
  if (v === 4) {
    let [a, b] = r.shuffle(pool).slice(0, 2);
    if (FEV[a][k] === FEV[b][k]) b = pool.find((x) => FEV[x][k] !== FEV[a][k]);
    if (!b) return solidCount(r, pool, word);
    const right = FEV[a][k] > FEV[b][k] ? a : b;
    return picChoice(r, sm(right), [sm(right === a ? b : a)], { q: `Which solid has more ${word2}?`, steps: (Lt) => [St(`The ${a} has ${FEV[a][k]} ${word2}.`, solidFig(a, allParts(a, what))), St(`The ${b} has ${FEV[b][k]} ${word2}.`, solidFig(b, allParts(b, what))), `So the ${right}, ${Lt}, has more.`] });
  }
  const s = r.pick(pool), n = FEV[s][k], wr = pool.filter((x) => FEV[x][k] !== n);
  if (!wr.length) return solidCount(r, pool, word);
  return choose(r, s, r.shuffle(wr).slice(0, 3), `Which solid has exactly ${n} ${word2}?`, (Lt) => [`Count the ${word2} of each solid.`, St(`The ${s} has ${n}.`, solidFig(s, { ...allParts(s, what), numbers: what !== 'faces' })), `So the answer is ${Lt}.`]);
}
export function g1SolidAttr(r) {
  const v = r.int(0, 5);
  if (v === 0) {
    const [s, f, o] = r.pick([['cylinder', 'circle', { hl: ['top'] }], ['cube', 'square', { hlFaces: [0] }], ['cone', 'circle', { hl: ['base'] }], ['square pyramid', 'triangle', { hlFaces: [1] }], ['triangular prism', 'triangle', { hlFaces: [0] }], ['rectangular prism', 'rectangle', { hlFaces: [0] }], ['triangular prism', 'rectangle', { hlFaces: [3] }]]);
    return mc(r, f, others(r, ['circle', 'square', 'triangle', 'rectangle'], f, 3, ALSO[f] ?? []), { q: `If you trace around the pink face of this ${s}, what shape do you draw?`, visual: solidFig(s, o), shapeChoices: true, steps: [St('The pink face is flat. Look at its outline.', solidFig(s, o)), `Tracing it makes ${an(f)}.`] });
  }
  if (v === 1) { const [q, a, w] = r.pick([['Which solid can roll but cannot be stacked?', 'sphere', ['cube', 'rectangular prism', 'cylinder']], ['Which solid can roll and can also be stacked?', 'cylinder', ['sphere', 'cube', 'square pyramid']], ['Which solid can be stacked and slide, but cannot roll?', 'cube', ['sphere', 'cylinder', 'cone']]]); return choose(r, a, w, q, (Lt) => [St('Curved parts roll. Flat faces stack and slide.', solidFig(a, SOLID_HL[a])), `The answer is ${an(a)}, picture ${Lt}.`]); }
  if (v === 2) {
    const [q, a, f] = r.pick([['These 2 cubes are stuck together side by side. What solid do they make?', 'rectangular prism', () => G.boxFig({ l: 2, w: 1, h: 1, cubes: true })], ['These 8 small cubes are stuck together in 2 layers of 4. What solid do they make?', 'cube', () => G.boxFig({ l: 2, w: 2, h: 2, cubes: true })], ['These 3 cubes are stuck together in a row. What solid do they make?', 'rectangular prism', () => G.boxFig({ l: 3, w: 1, h: 1, cubes: true })]]);
    return mc(r, a, wrongNames(r, ['cube', 'rectangular prism', 'sphere', 'cone', 'cylinder'], a), { q, visual: f(), steps: [St('Look at the outside of the whole solid.', f()), a === 'cube' ? 'It is as long as it is wide and tall, with square faces: a cube.' : 'It is longer than it is tall, like a box: a rectangular prism.'] });
  }
  if (v === 3) return choose(r, 'square pyramid', ['cube', 'cylinder', 'sphere'], 'Which solid has triangle faces?', (Lt) => [St('The square pyramid has 4 triangle faces that meet at the top.', solidFig('square pyramid', { hlFaces: [1, 2, 3, 4] })), `So the answer is ${Lt}.`]);
  if (v === 4) return choose(r, r.pick(['cylinder', 'cone']), ['cube', 'square pyramid', 'triangular prism'], 'Which solid could you trace to draw a circle?', (Lt) => ['Look for a flat face that is round.', St('The pink flat face of a cylinder or a cone is a circle.', figs([solidFig('cylinder', { hl: ['top'], small: true }), solidFig('cone', { hl: ['base'], small: true })], ['cylinder', 'cone'])), `So the answer is ${Lt}.`]);
  const s = r.pick(['sphere', 'cylinder', 'cone', 'cube', 'square pyramid', 'rectangular prism']), flat = s !== 'sphere';
  return mc(r, flat ? 'Yes' : 'No', [flat ? 'No' : 'Yes'], { q: 'Does this solid have any flat faces?', visual: solidFig(s), steps: [St(flat ? 'The pink parts are flat faces.' : 'A sphere is curved all over.', solidFig(s, SOLID_HL[s])), `So the answer is ${flat ? 'Yes' : 'No'}.`] });
}
// area by counting squares
const rowCounts = (w, h) => Array.from({ length: h }, (_, k) => String(w * (k + 1)));
export function areaCount(r, grade = 1) {
  const v = r.int(0, 5);
  if (v === 0) {
    const rows = r.int(2, grade >= 3 ? 6 : 4), cols = r.int(2, grade >= 3 ? 8 : 5), A = rows * cols, cells = rectCells(cols, rows);
    return num(A, [St(`Row 1 has ${cols} squares.`, areaFig(cells, { hlRow: 0 })), St(`There are ${rows} rows of ${cols}. Count on by ${cols} for each row.`, areaFig(cells, { done: rows - 1, counts: rowCounts(cols, rows) })), grade >= 2 ? `${rows} × ${cols} = ${A}.` : `Count by rows: ${Array.from({ length: rows }, (_, k) => cols * (k + 1)).join(', ')}.`, `So ${A} squares cover the rectangle.`], { q: `How many squares cover this rectangle?${grade >= 2 ? ' (This is its area, in square units.)' : ''}`, visual: areaFig(cells), expr: `${rows}*${cols}` });
  }
  if (v === 1) {
    const w = r.int(3, 6), h = r.int(3, 5), w2 = r.int(1, w - 1), h1 = r.int(1, h - 1), A = w * h1 + w2 * (h - h1);
    const cells = rectCells(w, h).filter(([x, y]) => y < h1 || x < w2);
    return num(A, [St(`The bottom part has ${h1} ${h1 === 1 ? 'row' : 'rows'} of ${w}: ${w * h1} squares.`, areaFig(cells, { tone: (x, y) => (y < h1 ? 'hl' : 'fig') })), St(`The top part has ${h - h1} ${h - h1 === 1 ? 'row' : 'rows'} of ${w2}: ${w2 * (h - h1)} ${w2 * (h - h1) === 1 ? 'square' : 'squares'}.`, areaFig(cells, { tone: (x, y) => (y < h1 ? 'hl' : 'hl2') })), `${w * h1} + ${w2 * (h - h1)} = ${A}.`, `So ${A} squares cover the shape.`], { q: 'Each small square is 1 unit. How many squares cover this shape?', visual: areaFig(cells), expr: `${w}*${h1}+${w2}*${h - h1}` });
  }
  if (v === 2) {
    const opts = [[1, 4], [2, 3], [2, 4], [3, 3], [2, 5], [3, 4], [2, 6], [4, 4], [3, 5]], [R, C] = r.pick(opts), A = R * C;
    const wr = r.shuffle(opts.filter(([x, y]) => x * y !== A)).slice(0, 3);
    return picChoice(r, areaFig(rectCells(C, R), { u: 22 }), wr.map(([x, y]) => areaFig(rectCells(y, x), { u: 22 })), { q: `Which rectangle is covered by exactly ${A} squares?`, steps: (Lt) => ['Count the squares in each rectangle, row by row.', St(`Rectangle ${Lt} has ${R} ${R === 1 ? 'row' : 'rows'} of ${C}: ${A} squares.`, areaFig(rectCells(C, R), { done: R - 1, counts: rowCounts(C, R) })), `So the answer is ${Lt}.`] });
  }
  if (v === 3) {
    const a = [r.int(2, 4), r.int(2, 4)], b = [r.int(2, 5), r.int(1, 4)];
    if (a[0] * a[1] === b[0] * b[1]) b[0] += 1;
    const [big, small] = a[0] * a[1] > b[0] * b[1] ? [a, b] : [b, a];
    return picChoice(r, areaFig(rectCells(...big), { u: 22 }), [areaFig(rectCells(...small), { u: 22 })], { q: 'Which rectangle is covered by more squares?', steps: (Lt) => [St(`One rectangle has ${big[1]} ${big[1] === 1 ? 'row' : 'rows'} of ${big[0]}: ${big[0] * big[1]} squares.`, areaFig(rectCells(...big), { done: big[1], counts: rowCounts(big[0], big[1]) })), St(`The other has ${small[1]} ${small[1] === 1 ? 'row' : 'rows'} of ${small[0]}: ${small[0] * small[1]} squares.`, areaFig(rectCells(...small), { done: small[1], counts: rowCounts(small[0], small[1]) })), `${big[0] * big[1]} is more, so the answer is ${Lt}.`] });
  }
  if (v === 4) {
    const w = r.int(3, 5), h = r.int(2, 4), cells = rectCells(w, h), filled = r.int(Math.ceil((w * h) / 3), w * h - 2), left = w * h - filled;
    const done = new Set(r.shuffle(cells.map((c) => c.join(','))).slice(0, filled)), tone = (x, y) => (done.has(`${x},${y}`) ? 'shade' : 'paper');
    const order = cells.filter(([x, y]) => !done.has(`${x},${y}`)).sort((p, q) => q[1] - p[1] || p[0] - q[0]).map((c) => c.join(','));
    return num(left, [St('Find the white squares that are still empty.', areaFig(cells, { tone })), St(`Count them: ${seq(left)}.`, areaFig(cells, { tone: (x, y) => (done.has(`${x},${y}`) ? 'shade' : 'hl'), numbers: (x, y) => (done.has(`${x},${y}`) ? null : String(order.indexOf(`${x},${y}`) + 1)) })), `So ${left} more ${left === 1 ? 'tile is' : 'tiles are'} needed.`], { q: 'Green tiles cover part of this rectangle. How many more tiles are needed to cover all of it?', visual: areaFig(cells, { tone }), expr: `${w * h}-${filled}` });
  }
  const shapes = [[[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [0, 2]], [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2]]];
  const cells = r.pick(shapes), n = cells.length, order = [...cells].sort((p, q) => q[1] - p[1] || p[0] - q[0]).map((c) => c.join(','));
  return num(n, [St('Touch each square once and count.', areaFig(cells, { tone: () => 'hl', numbers: (x, y) => String(order.indexOf(`${x},${y}`) + 1) })), `Count: ${seq(n)}.`, `So ${n} squares cover the shape.`], { q: 'How many squares cover this shape?', visual: areaFig(cells), expr: `${n}` });
}

// ───── Grade 2 ─────
const POLY2 = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'octagon', 'circle', 'oval'];
const IRR = { triangle: [[0, 0], [9, 1], [3, 6]], quadrilateral: [[0, 0], [8, 1], [7, 6], [1, 4]], pentagon: [[0, 0], [6, 0], [7, 4], [3, 7], [-1, 4]], hexagon: ODD_HEX, octagon: [[0, 0], [3, -1], [6, 0], [7, 3], [6, 6], [3, 7], [0, 6], [-1, 3]] };
const NSIDES = { triangle: 3, quadrilateral: 4, pentagon: 5, hexagon: 6, octagon: 8 };
const irrFig = (n, o = {}) => flatFig(n, { pts: IRR[n], ...o });
export function g2Shapes2d(r) {
  const v = r.int(0, 6);
  if (v === 0) { const s = r.pick(POLY2); return mc(r, s, wrongNames(r, POLY2, s), { q: 'What is the name of this shape?', visual: flatFig(s), steps: [St(WHY[s], showWhy(s)), `It is ${an(s)}.`] }); }
  if (v === 1) {
    const s = r.pick(['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'octagon']), what = r.pick(['sides', 'vertices']), k = SIDES[s], st = countFlat(s, what === 'sides' ? 'sides' : 'corners');
    st[st.length - 1] = `So the ${s} has ${k} ${what}.`;
    return num(k, st, { q: `How many ${what} does this shape have?`, visual: flatFig(s), expr: `${k}` });
  }
  if (v === 2) { const t = r.pick(['triangle', 'square', 'pentagon', 'hexagon', 'octagon']), k = SIDES[t]; return choose(r, t, others(r, ['triangle', 'square', 'pentagon', 'hexagon', 'octagon'], t), `Which shape has exactly ${k} sides?`, (Lt) => ['Count the sides of each shape.', St(`The ${t} has ${k} sides: ${seq(k)}.`, flatFig(t, { count: 'sides' })), `So the answer is ${Lt}.`]); }
  if (v === 3) {
    const [a, b] = r.shuffle(['triangle', 'square', 'pentagon', 'hexagon', 'octagon']).slice(0, 2), more = r.bool(), right = (more ? SIDES[a] > SIDES[b] : SIDES[a] < SIDES[b]) ? a : b;
    return picChoice(r, sm(right), [sm(right === a ? b : a)], { q: `Which shape has ${more ? 'more' : 'fewer'} vertices?`, steps: (Lt) => [St(`The ${a} has ${SIDES[a]} vertices.`, flatFig(a, { count: 'corners' })), St(`The ${b} has ${SIDES[b]} vertices.`, flatFig(b, { count: 'corners' })), `So the ${right}, ${Lt}, has ${more ? 'more' : 'fewer'}.`] });
  }
  if (v === 4) {
    const s = r.pick(['triangle', 'pentagon', 'hexagon', 'octagon']), k = NSIDES[s];
    return mc(r, s, others(r, ['triangle', 'pentagon', 'hexagon', 'octagon'], s), { q: 'The sides of this shape are not all the same length. Count its sides. What is its name?', visual: irrFig(s), steps: [St(`Count the sides: ${seq(k)}.`, irrFig(s, { count: 'sides' })), `Any shape with ${k} straight sides is ${an(s)}, so it is ${an(s)}.`] });
  }
  const [a, b] = r.shuffle(['triangle', 'square', 'pentagon', 'hexagon', 'octagon']).slice(0, 2);
  if (v === 5) { const n = SIDES[a] + SIDES[b]; return num(n, [St(`The ${a} has ${SIDES[a]} sides.`, flatFig(a, { count: 'sides' })), St(`The ${b} has ${SIDES[b]} sides.`, flatFig(b, { count: 'sides' })), `${SIDES[a]} + ${SIDES[b]} = ${n}.`, `So there are ${n} sides in all.`], { q: 'How many sides do these two shapes have in all?', visual: figs([sm(a), sm(b)], [a, b]), expr: `${SIDES[a]}+${SIDES[b]}` }); }
  const big = SIDES[a] > SIDES[b] ? a : b, small = big === a ? b : a, d = SIDES[big] - SIDES[small];
  return num(d, [St(`The ${big} has ${SIDES[big]} sides.`, flatFig(big, { count: 'sides' })), St(`The ${small} has ${SIDES[small]} sides.`, flatFig(small, { count: 'sides' })), `${SIDES[big]} − ${SIDES[small]} = ${d}.`, `So the ${big} has ${d} more sides.`], { q: `How many more sides does the ${big} have than the ${small}?`, visual: figs([sm(big), sm(small)], [big, small]), expr: `${SIDES[big]}-${SIDES[small]}` });
}
export function g2ShapeMoves(r) {
  const v = r.int(0, 5);
  return [moveName, letterSym, (q) => congruent(q, true), composeQ, foldYesNo, movePick][v](r);
}
const SOL2 = ['cube', 'rectangular prism', 'triangular prism', 'square pyramid', 'triangular pyramid'];
const PINK = [['cube', { hlFaces: [0] }, 'square'], ['rectangular prism', { hlFaces: [0] }, 'rectangle'], ['triangular prism', { hlFaces: [0] }, 'triangle'], ['triangular prism', { hlFaces: [3] }, 'rectangle'], ['square pyramid', { hlFaces: [1] }, 'triangle'], ['square pyramid', { hlFaces: [0] }, 'square'], ['triangular pyramid', { hlFaces: [1] }, 'triangle'], ['cylinder', { hl: ['top'] }, 'circle'], ['cone', { hl: ['base'] }, 'circle']];
export function pinkFace(r, rename = (s) => s) {
  const [s, o, f] = r.pick(PINK), hidden = s === 'square pyramid' && o.hlFaces[0] === 0;
  return mc(r, f, others(r, ['circle', 'square', 'triangle', 'rectangle'], f, 3, ALSO[f] ?? []), { q: `What flat shape is the pink face of this ${rename(s)}?${hidden ? ' (It is the base, at the bottom.)' : ''}`, visual: solidFig(s, o), steps: [St(hidden ? 'The dashed pink outline is the base, underneath.' : 'Look at the outline of the pink face.', solidFig(s, o)), `It is ${an(f)}.`] });
}
export function g2Shapes3d(r) {
  const v = r.int(0, 3);
  if (v <= 1) return solidCount(r, SOL2);
  if (v === 2) return pinkFace(r);
  return solidName(r, [...SOL2, 'cylinder', 'cone', 'sphere']);
}
const NET_SOL = ['cube', 'rectangular prism', 'square pyramid', 'triangular prism', 'triangular pyramid', 'cylinder', 'cone'];
const NET_SAY = { cube: '6 squares, all the same size', 'rectangular prism': '6 rectangles, in 3 matching pairs', 'square pyramid': '1 square and 4 triangles', 'square-based pyramid': '1 square and 4 triangles', 'triangular prism': '2 triangles and 3 rectangles', 'triangular pyramid': '4 triangles', cylinder: '2 circles and a rectangle', cone: '1 circle and a curved fan shape' };
export function netQ(r, rename = (s) => s, v = r.int(0, 2)) {
  if (v === 0) {
    const s = r.pick(NET_SOL), net = netOf(s, r.int(0, 10));
    return mc(r, rename(s), others(r, NET_SOL, s, 3, ALSO[s] ?? []).map(rename), { q: 'This net is folded up. What solid does it make?', visual: net, steps: [St(`The net has ${NET_SAY[s]}. Each piece becomes one face.`, net), St(`Folded up, they make ${an(rename(s))}.`, solidFig(s)), `So the answer is ${an(rename(s))}.`] });
  }
  if (v === 1) {
    const k = r.int(0, 10), bad = r.shuffle(G.NOT_CUBE_NETS).slice(0, 3);
    return picChoice(r, G.netFig({ cells: G.CUBE_NETS[k] }), bad.map((c) => G.netFig({ cells: c })), { q: 'Each picture has 6 squares. Which one folds up into a cube?', steps: (Lt) => ['A cube has 6 faces: top, bottom, front, back, left and right. Each square must become a different face.', St(`Fold up net ${Lt}: every square lands on its own face.`, G.netFig({ cells: G.CUBE_NETS[k], hl: [0, 1, 2, 3, 4, 5] })), 'In the other pictures, two squares land on the same face, so a face is left open.', `So the answer is ${Lt}.`] });
  }
  const s = r.pick(NET_SOL), wr = others(r, NET_SOL, s, 3, ALSO[s] ?? []);
  return choose(r, s, wr, 'Which solid does this net fold into?', (Lt) => [St(`The net has ${NET_SAY[s]}.`, netOf(s)), St(`Those are the faces of ${an(rename(s))}.`, solidFig(s)), `So the answer is ${Lt}.`], { lead: netOf(s), leadCap: 'The net' });
}
export function g2SolidsReal(r) {
  const v = r.int(0, 5);
  if (v === 0) { const s = r.pick(['sphere', 'cylinder', 'cone', 'cube', 'rectangular prism', 'square pyramid', 'triangular prism']), thing = r.pick(OBJ3[s]); return choose(r, s, wrongNames(r, ['sphere', 'cylinder', 'cone', 'cube', 'rectangular prism', 'square pyramid', 'triangular prism'], s), `Which solid is ${thing} most like?`, (Lt) => [`Think about the shape of ${thing}.`, St(`It is most like ${an(s)}.`, solidFig(s)), `So the answer is ${Lt}.`]); }
  if (v === 1) return pinkFace(r);
  if (v === 2) return netQ(r, undefined, 0);
  if (v === 3) return netQ(r, undefined, 1);
  if (v === 4) return netQ(r, undefined, 2);
  const s = r.pick(Object.keys(OBJ3)), right = r.pick(OBJ3[s]), wr = others(r, Object.keys(OBJ3), s, 3, ALSO[s] ?? []).map((x) => r.pick(OBJ3[x]));
  return mc(r, right, wr, { q: 'Which thing is shaped like this solid?', visual: solidFig(s), steps: [St(`This solid is ${an(s)}.`, solidFig(s, SOLID_HL[s])), `${cap(right)} is shaped like ${an(s)}.`] });
}
// rectangles drawn in proportion (never too thin), with labelled sides
export const rectFig = (l, w, o = {}) => { const [a, b] = G.squash([l, w], 0.42, 0.85); return flatFig('rectangle', { pts: [[0, 0], [a * 10, 0], [a * 10, b * 10], [0, b * 10]], ...o }); };
const sidesHl = (...js) => js.map((j) => ({ side: j }));
export function rectPerimeter(r, u = 'cm', l = r.int(3, 12), w = r.int(2, 9), word = '') {
  if (l === w) l += 1;
  const P = 2 * (l + w), lab = [`${l} ${u}`, `${w} ${u}`, `${l} ${u}`, `${w} ${u}`];
  return num(P, [St(`Perimeter is the distance all the way around. Add the two long sides: ${l} + ${l} = ${2 * l}.`, rectFig(l, w, { sides: lab, hl: sidesHl(0, 2) })), St(`Add the two short sides: ${w} + ${w} = ${2 * w}.`, rectFig(l, w, { sides: lab, hl: sidesHl(1, 3) })), `${2 * l} + ${2 * w} = ${P}.`, `So the perimeter is ${P} ${u}.`], { q: word || `What is the perimeter of this rectangle, in ${u}?`, visual: rectFig(l, w, { sides: lab }), expr: `2*(${l}+${w})` });
}
export function triPerimeter(r, u = 'cm') {
  const a = r.int(4, 10), b = r.int(3, 9), c = r.int(Math.max(Math.abs(a - b) + 2, 3), Math.min(a + b - 2, 12)), P = a + b + c, pts = triFromSides(a, b, c), lab = [`${a} ${u}`, `${b} ${u}`, `${c} ${u}`];
  return num(P, [St(`Add the three sides: ${a} + ${b} + ${c}.`, flatFig('triangle', { pts, sides: lab, hl: sidesHl(0, 1, 2) })), `${a} + ${b} + ${c} = ${P}.`, `So the perimeter is ${P} ${u}.`], { q: `What is the perimeter of this triangle, in ${u}?`, visual: flatFig('triangle', { pts, sides: lab }), expr: `${a}+${b}+${c}` });
}
// the perimeter of a rectangle of squares, counted along its edges
function gridPerimeter(r) {
  const w = r.int(2, 6), h = r.int(2, 4), P = 2 * (w + h), u = 30;
  const base = (o) => gridFig({ cols: w, rows: h, u, pad: 30, cells: rectCells(w, h).map(([x, y]) => ({ x, y })), ...o });
  const edge = [[[0, 0], [w, 0]], [[w, 0], [w, h]], [[w, h], [0, h]], [[0, h], [0, 0]]];
  return num(P, [St(`The top and the bottom are ${w} units each.`, base({ lines: [{ a: edge[0][0], b: edge[0][1], t: 'hlline' }, { a: edge[2][0], b: edge[2][1], t: 'hlline' }], texts: [{ at: [w / 2, -0.55], s: w, t: 'hl' }, { at: [w / 2, h + 0.55], s: w, t: 'hl' }] })), St(`The two sides are ${h} units each.`, base({ lines: [{ a: edge[1][0], b: edge[1][1], t: 'hlline' }, { a: edge[3][0], b: edge[3][1], t: 'hlline' }], texts: [{ at: [w + 0.55, h / 2], s: h, t: 'hl' }, { at: [-0.55, h / 2], s: h, t: 'hl' }] })), `${w} + ${h} + ${w} + ${h} = ${P}.`, `So the perimeter is ${P} units.`], { q: 'Each small square has sides 1 unit long. What is the perimeter of the whole rectangle, in units?', visual: base({}), expr: `2*(${w}+${h})` });
}
export function g2PerimArea(r) {
  const v = r.int(0, 6);
  if (v === 0) return rectPerimeter(r, 'cm', r.int(2, 9), r.int(2, 8));
  if (v === 1) return triPerimeter(r);
  if (v === 2) { const it = areaCount(r, 2); return it; }
  if (v === 3) { const l = r.int(3, 12), w = r.int(2, l - 1), nm = r.pick(['Amina', 'Yusuf', 'Maya', 'Liam', 'Noor', 'Omar']); return rectPerimeter(r, 'm', l, w, `${nm}'s garden is a rectangle ${l} m long and ${w} m wide. How many metres of fence go all the way around it?`); }
  if (v === 4) return gridPerimeter(r);
  if (v === 5) {
    const s = r.int(2, 9), P = 4 * s, lab = [`${s} cm`, '', '', ''];
    return num(P, [St('The ticks show that all 4 sides are the same length.', flatFig('square', { sides: [`${s} cm`, `${s} cm`, `${s} cm`, `${s} cm`], ticks: [1, 1, 1, 1], hl: sidesHl(0, 1, 2, 3) })), `${s} + ${s} + ${s} + ${s} = ${P}.`, `So the perimeter is ${P} cm.`], { q: 'All the sides of this square are the same length. What is its perimeter, in cm?', visual: flatFig('square', { sides: lab, ticks: [1, 1, 1, 1] }), expr: `4*${s}` });
  }
  const A = r.pick([6, 8, 10, 12, 15, 16, 18, 20]), divs = [2, 3, 4, 5].filter((d) => A % d === 0 && A / d <= 8), d = r.pick(divs), c = A / d;
  const wr = [[d, c + 1], [d + 1, c], [Math.max(1, d - 1), c - 1]].filter(([p, q]) => p * q !== A);
  return picChoice(r, areaFig(rectCells(c, d), { u: 18 }), wr.map(([p, q]) => areaFig(rectCells(q, p), { u: 18 })), { q: `Which rectangle has an area of ${A} squares?`, steps: (Lt) => ['Area = number of rows × squares in each row.', St(`Rectangle ${Lt} has ${d} rows of ${c}: ${d} × ${c} = ${A}.`, areaFig(rectCells(c, d), { done: d, counts: rowCounts(c, d) })), `So the answer is ${Lt}.`] });
}

// ───── Grade 3 ─────
const PNAME = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 8: 'octagon' };
const regFig = (k, o = {}) => flatFig(PNAME[k], { pts: G.regular(k), ...o });
export function g3Polygons(r) {
  const v = r.int(0, 6), k = r.pick([3, 4, 5, 6, 8]);
  if (v === 0) {
    const part = r.pick(['sides', 'vertices']), irr = r.bool(), f = (o) => (irr ? irrFig(PNAME[k], o) : regFig(k, o));
    return num(k, [St(`Count the ${part} one by one around the shape.`, f({ count: part === 'sides' ? 'sides' : 'corners' })), `There are ${k} ${part}: ${seq(k)}.`, `So the answer is ${k}.`], { q: `How many ${part} does this polygon have?`, visual: f({}), expr: String(k) });
  }
  if (v === 1) return mc(r, PNAME[k], others(r, Object.values(PNAME), PNAME[k]), { q: 'What is the name of this polygon?', visual: regFig(k), steps: [St(`It has ${k} sides.`, regFig(k, { count: 'sides' })), `A polygon with ${k} sides is ${an(PNAME[k])}.`] });
  if (v === 2) {
    const kind = r.pick(['poly', 'curve', 'open']), fig = kind === 'poly' ? irrFig(PNAME[k]) : kind === 'open' ? openFig(r.pick(['pentagon', 'square', 'triangle'])) : r.pick([() => flatFig('circle'), () => flatFig('oval'), () => halfMoonFig()])();
    return mc(r, kind === 'poly' ? 'Yes' : 'No', [kind === 'poly' ? 'No' : 'Yes'], { q: 'Is this shape a polygon?', visual: fig, steps: ['A polygon is closed and has only straight sides.', kind === 'poly' ? `This shape is closed with ${k} straight sides, so yes, it is a polygon.` : kind === 'open' ? 'This shape has a gap: it is not closed. So no, it is not a polygon.' : 'This shape has a curved side. So no, it is not a polygon.'] });
  }
  if (v === 3) {
    const [a, b] = r.shuffle([3, 4, 5, 6, 8]).slice(0, 2), big = Math.max(a, b), small = Math.min(a, b);
    return num(big - small, [St(`${cap(an(PNAME[big]))} has ${big} sides.`, regFig(big, { count: 'sides' })), St(`${cap(an(PNAME[small]))} has ${small} sides.`, regFig(small, { count: 'sides' })), `${big} − ${small} = ${big - small}.`, `So the answer is ${big - small}.`], { q: `How many more sides does the ${PNAME[big]} have than the ${PNAME[small]}?`, visual: figs([regFig(big, { small: true }), regFig(small, { small: true })], [PNAME[big], PNAME[small]]), expr: `${big}-${small}` });
  }
  if (v === 4) {
    const notQ = r.bool(), polys = r.shuffle([3, 5, 6, 8]).slice(0, 3).map((x) => irrFig(PNAME[x], { small: true })), nons = [flatFig('circle', { small: true }), openFig('pentagon', { small: true }), halfMoonFig({ small: true })];
    if (notQ) { const odd = r.pick(nons); return picChoice(r, odd, polys, { q: 'Which shape is NOT a polygon?', steps: (Lt) => ['A polygon is closed and all its sides are straight.', St(`Shape ${Lt} has a curve or a gap.`, odd), `So ${Lt} is not a polygon.`] }); }
    const right = irrFig(PNAME[k], { small: true });
    return picChoice(r, right, nons, { q: 'Which shape is a polygon?', steps: (Lt) => ['A polygon is closed and all its sides are straight.', St(`Shape ${Lt} is closed, with ${k} straight sides.`, irrFig(PNAME[k], { count: 'sides' })), `So the answer is ${Lt}.`] });
  }
  if (v === 5) { const s = r.pick(['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'octagon']), n = NSIDES[s]; return mc(r, s, others(r, ['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'octagon'], s), { q: 'The sides of this polygon are different lengths. What is its name?', visual: irrFig(s), steps: [St(`Count the sides: ${seq(n)}.`, irrFig(s, { count: 'sides' })), `Every polygon with ${n} sides is ${an(s)}, so it is ${an(s)}.`] }); }
  const odd = r.pick(['pentagon', 'triangle', 'hexagon']), quads = [sm('trapezoid'), sm('kite'), flatFig('quadrilateral', { pts: IRR.quadrilateral, small: true }), sm('parallelogram')];
  return picChoice(r, irrFig(odd, { small: true }), r.shuffle(quads).slice(0, 3), { q: 'Which shape is NOT a quadrilateral?', steps: (Lt) => ['A quadrilateral is any polygon with 4 sides.', St(`Shape ${Lt} has ${NSIDES[odd]} sides.`, irrFig(odd, { count: 'sides' })), `So ${Lt} is not a quadrilateral.`] });
}
const Q3 = {
  square: { pts: [[0, 0], [5, 0], [5, 5], [0, 5]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], par: [1, 2, 1, 2], why: '4 equal sides and 4 right angles' },
  rectangle: { pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], par: [1, 2, 1, 2], why: '4 right angles, but the sides are not all equal' },
  rhombus: { pts: [[0, 0], [5, 0], [8, 4], [3, 4]], ticks: [1, 1, 1, 1], par: [1, 2, 1, 2], why: '4 equal sides, but no right angles' },
  parallelogram: { pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], ticks: [1, 2, 1, 2], par: [1, 2, 1, 2], why: '2 pairs of parallel sides, but no right angles and the sides are not all equal' },
  trapezoid: { pts: [[0, 0], [9, 0], [6.5, 4], [2, 4]], par: [1, 0, 1, 0], why: 'exactly 1 pair of parallel sides' },
  kite: { pts: FLAT.kite, ticks: [1, 2, 2, 1], why: 'two pairs of equal sides next to each other' },
};
const qFig = (name, marks = true, o = {}) => { const Q = Q3[name]; return flatFig(name, { pts: Q.pts, ...(marks ? { ticks: Q.ticks, right: Q.right, par: Q.par } : {}), ...o }); };
const IS_A = { square: ['square'], rectangle: ['rectangle', 'square'], rhombus: ['rhombus', 'square'], parallelogram: ['parallelogram', 'rhombus', 'rectangle', 'square'], trapezoid: ['trapezoid', 'parallelogram', 'rhombus', 'rectangle', 'square'], kite: ['kite', 'rhombus', 'square'] };
export function g3TriQuad(r) {
  const v = r.int(0, 5);
  if (v === 0) {
    const name = r.pick(['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid']), wrong = { square: ['trapezoid', 'pentagon', 'triangle'], rectangle: ['rhombus', 'kite', 'triangle'], rhombus: ['rectangle', 'pentagon', 'triangle'], parallelogram: ['rectangle', 'square', 'rhombus'], trapezoid: ['rectangle', 'square', 'rhombus'] }[name];
    return mc(r, name, wrong, { q: 'Read the marks: ticks show equal sides, arrows show parallel sides, small squares show right angles. What is the best name for this quadrilateral?', visual: qFig(name), steps: [St(`It has ${Q3[name].why}.`, qFig(name)), `So the best name is ${name}.`] });
  }
  if (v === 1) {
    const kind = r.pick(['equilateral', 'isosceles', 'scalene']), s = r.int(4, 9);
    const sd = kind === 'isosceles' ? [s, s + 2, s + 2] : kind === 'scalene' ? [s + 2, s + 1, s] : [s, s, s], pts = triFromSides(...sd), lab = sd.map((x) => `${x} cm`), tk = kind === 'isosceles' ? [0, 1, 1] : kind === 'equilateral' ? [1, 1, 1] : [0, 0, 0];
    return mc(r, kind, ['equilateral', 'isosceles', 'scalene'].filter((x) => x !== kind), { q: 'What kind of triangle is this, by its sides?', visual: flatFig('triangle', { pts, sides: lab }), steps: [St(`The sides are ${lab.join(', ')}.`, flatFig('triangle', { pts, sides: lab, ticks: tk })), kind === 'equilateral' ? 'All three sides are equal: equilateral.' : kind === 'isosceles' ? 'Exactly two sides are equal: isosceles.' : 'No sides are equal: scalene.'] });
  }
  if (v === 2) {
    const kind = r.pick(['acute', 'right', 'obtuse']);
    let a, b; if (kind === 'right') { a = 90; b = r.int(4, 13) * 5; } else if (kind === 'obtuse') { a = r.int(20, 28) * 5; b = r.int(3, Math.min(8, (165 - a) / 5)) * 5; } else { a = r.int(10, 16) * 5; b = r.int(Math.max(10, (105 - a) / 5), 16) * 5; }
    const c = 180 - a - b, pts = triFromAngles(a, b), labs = [a, b, c].map((x) => (x === 90 ? '' : `${x}°`)), rt = [a, b, c].map((x, i) => (x === 90 ? i : -1)).filter((i) => i >= 0);
    return mc(r, kind, ['acute', 'right', 'obtuse'].filter((x) => x !== kind), { q: `A triangle has angles of ${a}°, ${b}° and ${c}°. What kind of triangle is it?`, visual: flatFig('triangle', { pts, angles: labs, right: rt }), steps: ['Right: one angle is 90°. Obtuse: one angle is more than 90°. Acute: all angles are less than 90°.', St(kind === 'right' ? 'One angle is 90°: the small square marks it.' : kind === 'obtuse' ? `${Math.max(a, b, c)}° is more than 90°.` : 'Every angle is less than 90°.', flatFig('triangle', { pts, angles: labs, right: rt, hl: kind === 'acute' ? [{ angle: 0 }, { angle: 1 }, { angle: 2 }] : [{ angle: [a, b, c].indexOf(Math.max(a, b, c)) }] })), `So it is ${an(kind)} triangle.`] });
  }
  if (v === 3) {
    const name = r.pick(['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid']), ask = name === 'rhombus' || name === 'parallelogram' || name === 'trapezoid' || r.bool() ? 'parallel' : 'right', ans = ask === 'parallel' ? (name === 'trapezoid' ? 1 : 2) : 4;
    const marked = flatFig(name, { pts: Q3[name].pts, ...(ask === 'parallel' ? { par: Q3[name].par } : { right: Q3[name].right }) });
    return num(ans, [St(ask === 'parallel' ? 'Matching arrows show sides that are parallel: they never meet.' : 'Small squares mark the right angles.', marked), ask === 'parallel' ? `The ${name} has ${ans} ${ans === 1 ? 'pair' : 'pairs'} of parallel sides.` : `Every corner is a right angle: ${ans}.`, `So the answer is ${ans}.`], { q: ask === 'parallel' ? `How many pairs of parallel sides does this ${name} have?` : `How many right angles does this ${name} have?`, visual: qFig(name, false), expr: String(ans) });
  }
  if (v === 4) {
    const right = r.pick(['rhombus', 'rectangle', 'parallelogram', 'trapezoid', 'square']), pool = ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite'].filter((x) => !IS_A[right].includes(x));
    const wr = r.shuffle(pool).slice(0, 3).map((x) => qFig(x, true, { small: true })), extra = wr.length < 3 ? [sm('triangle'), sm('pentagon')].slice(0, 3 - wr.length) : [];
    return picChoice(r, qFig(right, true, { small: true }), [...wr, ...extra], { q: `Which shape is ${an(right)}? Read the marks on the sides and corners.`, steps: (Lt) => [`${cap(an(right))} has ${Q3[right].why}.`, St(`Shape ${Lt} has those marks.`, qFig(right)), `So the answer is ${Lt}.`] });
  }
  const right = flatFig('right triangle', { small: true, right: [0] }), wr = [flatFig('triangle', { small: true }), flatFig('triangle', { pts: triFromAngles(25, 30), small: true }), flatFig('triangle', { pts: triFromAngles(70, 55), small: true })];
  return picChoice(r, right, wr, { q: 'Which triangle is a right triangle?', steps: (Lt) => ['A right triangle has one square corner: a right angle, 90°.', St(`Triangle ${Lt} has a square corner, marked with a small square.`, flatFig('right triangle', { right: [0] })), `So the answer is ${Lt}.`] });
}
const SYMS = [
  ['square', FLAT.square, (p) => regLines(p)], ['rectangle', FLAT.rectangle, (p) => foldLines(p, [[5, 0], [10, 2.5]])], ['equilateral triangle', FLAT.triangle, (p) => regLines(p)],
  ['regular hexagon', FLAT.hexagon, (p) => regLines(p)], ['rhombus', FLAT.rhombus, (p) => foldLines(p, [p[0], p[1]])], ['isosceles triangle', [[0, 0], [6, 0], [3, 7]], () => [[[3, -1], [3, 8]]]],
  ['scalene triangle', FLAT['long triangle'], () => []], ['regular pentagon', FLAT.pentagon, (p) => regLines(p)],
];
export function g3Transform(r) {
  const names = { slide: 'slide (translation)', flip: 'flip (reflection)', turn: 'turn (rotation)' }, v = r.int(0, 6);
  if (v === 0) return moveName(r, names);
  if (v === 1) {
    const [name, pts, lf] = r.pick(SYMS), lines = lf(pts), n = lines.length;
    return num(n, [St(n ? 'Each dashed line folds the shape into two matching halves.' : 'Try folding it across, down and corner to corner: the halves never match.', flatFig('x', { pts, folds: lines })), n ? `Count the fold lines: ${seq(n)}.` : 'There are no fold lines that work: 0.', `So the ${name} has ${n} ${n === 1 ? 'line' : 'lines'} of symmetry.`], { q: `How many lines of symmetry does this ${name} have?`, visual: flatFig('x', { pts }), expr: String(n) });
  }
  if (v === 2) return letterSym(r);
  if (v === 3) return congruent(r, true);
  if (v === 4) return movePick(r, names);
  if (v === 5) return foldYesNo(r);
  const dx = r.int(4, 6), src = FSHAPE.map(([x, y]) => [x + 1, y]), pic = (o = {}) => gridFig({ cols: 10, rows: 6, u: 24, shapes: [{ pts: src }, { pts: src.map(([x, y]) => [x + dx, y]), t: 'hl' }], ...o });
  return num(dx, [St('Pick one corner of the blue shape. Find the same corner on the pink shape.', pic({ dots: [[1, 0], [1 + dx, 0]] })), St(`Count the squares between them: ${seq(dx)}.`, pic({ dots: [[1, 0], [1 + dx, 0]], lines: [{ a: [1, 0], b: [1 + dx, 0], t: 'hlline' }] })), `So the shape slid ${dx} squares to the right.`], { q: 'The blue shape slid to where the pink shape is. How many squares to the right did it move?', visual: pic(), expr: String(dx) });
}
const SOL3 = ['cube', 'rectangular prism', 'triangular prism', 'square-based pyramid', 'triangular pyramid'];
const ALL3 = [...SOL3, 'cylinder', 'cone', 'sphere'];
const DESC3 = [['6 square faces that are all the same size', 'cube'], ['6 rectangle faces, not all squares', 'rectangular prism'], ['2 triangle faces and 3 rectangle faces', 'triangular prism'], ['a square base and 4 triangle faces that meet at a point', 'square-based pyramid'], ['2 flat circle faces and one curved surface', 'cylinder'], ['1 flat circle face, a curved surface and a point at the top', 'cone'], ['only a curved surface, like a ball', 'sphere'], ['4 faces that are all triangles', 'triangular pyramid']];
const OBJ3b = [['a soup can', 'cylinder'], ['a basketball', 'sphere'], ['a number cube from a board game', 'cube'], ['an ice cream cone', 'cone'], ['a cereal box', 'rectangular prism'], ['a party hat', 'cone'], ['a roll of paper towels', 'cylinder'], ['a globe', 'sphere'], ['a tent with triangle ends', 'triangular prism']];
export function g3Solids(r) {
  const v = r.int(0, 5);
  if (v === 0) { const [d, ans] = r.pick(DESC3); return mc(r, ans, wrongNames(r, ALL3, ans), { q: `Which 3-D shape has ${d}?`, steps: [`Picture a shape with ${d}.`, St(`That is ${an(ans)}.`, solidFig(ans, SOLID_HL[ans])), `So the answer is ${an(ans)}.`] }); }
  if (v === 1) { const [obj, ans] = r.pick(OBJ3b); return mc(r, ans, wrongNames(r, ALL3, ans), { q: `What 3-D shape is ${obj} most like?`, steps: [`Think about the faces and curves of ${obj}.`, St(`It is shaped like ${an(ans)}.`, solidFig(ans)), `So the answer is ${an(ans)}.`] }); }
  if (v === 2) { const s = r.pick(ALL3); return mc(r, s, wrongNames(r, ALL3, s), { q: 'What is the name of this 3-D shape?', visual: solidFig(s), steps: [St(CLUE[s], solidFig(s, SOLID_HL[s])), `It is ${an(s)}.`] }); }
  if (v === 3) { const s = r.pick(['square-based pyramid', 'triangular pyramid']); return choose(r, s, others(r, ['cube', 'triangular prism', 'cone', 'cylinder', 'rectangular prism'], ''), 'Which of these 3-D shapes is a pyramid?', (Lt) => ['A pyramid has one base, and all its other faces are triangles that meet at one point.', St(`Shape ${Lt} is ${an(s)}.`, solidFig(s, allParts(s, 'faces'))), `So the answer is ${Lt}.`]); }
  if (v === 4) { const s = r.pick(['cube', 'rectangular prism', 'triangular prism']); return choose(r, s, others(r, ['square-based pyramid', 'triangular pyramid', 'cone', 'sphere'], ''), 'Which of these 3-D shapes is a prism?', (Lt) => ['A prism has two matching ends joined by rectangles.', St(`Shape ${Lt} is ${an(s)}: its matching ends are pink.`, solidFig(s, { hlFaces: s === 'triangular prism' ? [0, 1] : [0, 1] })), `So the answer is ${Lt}.`]); }
  const [d, s] = r.pick([['a curved surface and exactly 1 flat face', 'cone'], ['a curved surface and exactly 2 flat faces', 'cylinder'], ['no flat faces at all', 'sphere']]);
  return choose(r, s, others(r, ['cone', 'cylinder', 'sphere', 'cube', 'square-based pyramid'], s), `Which 3-D shape has ${d}?`, (Lt) => [St(CLUE[s], solidFig(s, SOLID_HL[s])), `So the answer is ${Lt}.`]);
}
const rn3 = (s) => (s === 'square pyramid' ? 'square-based pyramid' : s);
export function g3SolidParts(r) {
  const v = r.int(0, 5);
  if (v === 0) {
    const s = r.pick(SOL3), what = r.pick(['faces', 'edges', 'vertices']), { n, steps } = countSolid(s, what);
    return num(n, steps, { q: `How many ${what} does this ${s} have?`, visual: solidFig(s), expr: String(n) });
  }
  if (v === 1) return netQ(r, rn3, 0);
  if (v === 2) return netQ(r, rn3, 1);
  if (v === 3) {
    const s = r.pick(SOL3), hid = hiddenEdges(s), seeQ = r.bool(), n = seeQ ? FEV[s][1] - hid.length : hid.length;
    return num(n, [St('Dashed lines are edges at the back that we cannot see.', solidFig(s, { hlEdges: hid, numbers: true })), seeQ ? `The ${s} has ${FEV[s][1]} edges and ${hid.length} are hidden: ${FEV[s][1]} − ${hid.length} = ${n}.` : `Count the dashed edges: ${seq(n)}.`, `So ${n} edges ${seeQ ? 'can be seen' : 'are hidden'}.`], { q: seeQ ? `How many edges of this ${s} can you see? (Do not count the dashed ones.)` : `Dashed lines show hidden edges. How many edges of this ${s} are hidden?`, visual: solidFig(s), expr: String(n) });
  }
  if (v === 4) return netQ(r, rn3, 2);
  return solidCount(r, SOL3);
}
// perimeter with missing sides and other polygons
export function g3Perim(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const k = r.pick([3, 4, 5, 6]), sides = Array.from({ length: k }, () => r.int(2, 12)), P = sides.reduce((a, b) => a + b, 0), lab = sides.map((s) => `${s} cm`);
    return num(P, [St(`Add all ${k} sides: ${sides.join(' + ')}.`, regFig(k, { sides: lab, hl: sidesHl(...sides.map((_, i) => i)) })), `${sides.join(' + ')} = ${P}.`, `So the perimeter is ${P} cm.`], { q: 'What is the perimeter of this shape, in centimetres? (It is not drawn to scale.)', visual: regFig(k, { sides: lab }), expr: sides.join('+') });
  }
  if (v === 1) {
    const l = r.int(4, 15), w = r.int(2, Math.min(12, l - 1)), P = 2 * (l + w), lab = [`${l} m`, '? m', '', ''];
    return num(w, [St(`The two lengths: ${l} + ${l} = ${2 * l}.`, rectFig(l, w, { sides: lab, hl: sidesHl(0, 2) })), St(`That leaves ${P} − ${2 * l} = ${2 * w} m for the two widths.`, rectFig(l, w, { sides: lab, hl: sidesHl(1, 3) })), `${2 * w} ÷ 2 = ${w}.`, `So the width is ${w} m.`], { q: `This rectangle has a perimeter of ${P} m. What is its width, in metres?`, unit: 'm', visual: rectFig(l, w, { sides: lab }), expr: `(${P}-2*${l})/2` });
  }
  if (v === 2) {
    const W = r.int(5, 9), H = r.int(5, 9), w2 = r.int(2, W - 2), h1 = r.int(2, H - 2), sides = [W, h1, W - w2, H - h1, w2, H], P = 2 * (W + H), pts = [[0, 0], [W, 0], [W, h1], [w2, h1], [w2, H], [0, H]], lab = sides.map((x) => `${x} m`);
    return num(P, [St(`Add every side, going around: ${sides.join(' + ')}.`, flatFig('L', { pts, sides: lab, right: [0, 1, 2, 4, 5], hl: sidesHl(0, 1, 2, 3, 4, 5) })), `${sides.join(' + ')} = ${P}.`, `So the perimeter is ${P} m.`], { q: 'What is the perimeter of this shape, in metres? (All the corners are square corners.)', visual: flatFig('L', { pts, sides: lab, right: [0, 1, 2, 4, 5] }), expr: sides.join('+') });
  }
  if (v === 3) { const l = r.int(5, 20), w = r.int(2, Math.min(15, l - 1)), nm = r.pick(['Amina', 'Yusuf', 'Maya', 'Liam', 'Noor', 'Omar', 'Chloe']); return rectPerimeter(r, 'm', l, w, `${nm} puts a fence around a garden ${l} m long and ${w} m wide. How many metres of fence are needed?`); }
  if (v === 4) {
    const s = r.int(2, 15), lab = ['? cm', '', '', ''];
    return num(s, [St('A square has 4 equal sides (the ticks show this).', flatFig('square', { sides: lab, ticks: [1, 1, 1, 1], hl: sidesHl(0, 1, 2, 3) })), `${4 * s} ÷ 4 = ${s}.`, `So each side is ${s} cm.`], { q: `This square has a perimeter of ${4 * s} cm. How long is each side, in centimetres?`, visual: flatFig('square', { sides: lab, ticks: [1, 1, 1, 1] }), expr: `${4 * s}/4` });
  }
  if (v === 5) {
    const a = r.int(5, 10), b = r.int(4, 9), c = r.int(Math.max(Math.abs(a - b) + 2, 3), Math.min(a + b - 2, 12)), P = a + b + c, pts = triFromSides(a, b, c), lab = [`${a} cm`, `${b} cm`, '? cm'];
    return num(c, [St(`Add the two sides you know: ${a} + ${b} = ${a + b}.`, flatFig('triangle', { pts, sides: lab, hl: sidesHl(0, 1) })), St(`Take that from the perimeter: ${P} − ${a + b} = ${c}.`, flatFig('triangle', { pts, sides: lab, hl: sidesHl(2) })), `So the missing side is ${c} cm.`], { q: `This triangle has a perimeter of ${P} cm. How long is the missing side, in centimetres?`, visual: flatFig('triangle', { pts, sides: lab }), expr: `${P}-${a}-${b}` });
  }
  return gridPerimeter(r);
}
export function g3Area(r) {
  const v = r.int(0, 6);
  if (v === 0) return areaCount(r, 3);
  if (v === 1) {
    const l = r.int(2, 10), w = r.int(2, 9), lab = [`${l} cm`, '? cm', '', ''];
    return num(w, [St(`Area = length × width, so ${l} × ? = ${l * w}.`, rectFig(l, w, { sides: lab, hl: sidesHl(0) })), `${l * w} ÷ ${l} = ${w}, because ${l} × ${w} = ${l * w}.`, `So the missing side is ${w} cm.`], { q: `This rectangle has an area of ${l * w} square centimetres. How long is the missing side, in centimetres?`, visual: rectFig(l, w, { sides: lab }), expr: `${l * w}/${l}` });
  }
  if (v === 2) {
    const W = r.int(4, 8), H = r.int(4, 7), w2 = r.int(1, W - 2), h1 = r.int(1, H - 2), A = W * h1 + w2 * (H - h1), cells = rectCells(W, H).filter(([x, y]) => y < h1 || x < w2);
    return num(A, [St(`Split the shape into two rectangles. The bottom one is ${W} × ${h1} = ${W * h1}.`, areaFig(cells, { tone: (x, y) => (y < h1 ? 'hl' : 'fig') })), St(`The top one is ${w2} × ${H - h1} = ${w2 * (H - h1)}.`, areaFig(cells, { tone: (x, y) => (y < h1 ? 'hl' : 'hl2') })), `Add: ${W * h1} + ${w2 * (H - h1)} = ${A}.`, `So the area is ${A} square units.`], { q: 'Count or split: what is the area of this shape, in square units?', visual: areaFig(cells), expr: `${W}*${h1}+${w2}*${H - h1}` });
  }
  if (v === 3) {
    const l = r.int(3, 9), w = r.int(2, 8), A = l * w, wr = [[l + 1, w], [l, w + 2], [l + w, 2]].filter(([p, q]) => p * q !== A);
    return picChoice(r, rectFig(l, w, { small: true, sides: [`${l} cm`, `${w} cm`, '', ''] }), wr.map(([p, q]) => rectFig(p, q, { small: true, sides: [`${p} cm`, `${q} cm`, '', ''] })), { q: `Which rectangle has an area of ${A} square centimetres?`, steps: (Lt) => ['Multiply length × width for each rectangle.', St(`Rectangle ${Lt}: ${l} × ${w} = ${A}.`, rectFig(l, w, { sides: [`${l} cm`, `${w} cm`, '', ''], fill: true })), `So the answer is ${Lt}.`] });
  }
  if (v === 4) {
    const l = r.int(3, 8), w = r.int(2, 5), A = l * w, lab = [`${l} cm`, `${w} cm`, '', ''];
    return num(A, [St(`Picture 1 cm squares covering it: ${w} rows of ${l}.`, areaFig(rectCells(l, w), { done: w, counts: rowCounts(l, w) })), `${l} × ${w} = ${A}.`, `So the area is ${A} square centimetres.`], { q: 'What is the area of this rectangle, in square centimetres?', visual: rectFig(l, w, { sides: lab, right: [0, 1, 2, 3] }), expr: `${l}*${w}` });
  }
  if (v === 5) {
    const s = r.int(2, 9), lab = [`${s} cm`, '', '', ''];
    return num(s * s, [St(`All 4 sides of a square are ${s} cm, so it is ${s} rows of ${s} squares.`, areaFig(rectCells(s, s), { done: s, counts: rowCounts(s, s) })), `${s} × ${s} = ${s * s}.`, `So the area is ${s * s} square centimetres.`], { q: 'What is the area of this square, in square centimetres?', visual: flatFig('square', { sides: lab, ticks: [1, 1, 1, 1] }), expr: `${s}*${s}` });
  }
  const a = [r.int(3, 6), r.int(2, 5)], b = [r.int(3, 7), r.int(2, 4)];
  if (a[0] * a[1] === b[0] * b[1]) b[0] += 1;
  const [big, small] = a[0] * a[1] > b[0] * b[1] ? [a, b] : [b, a];
  return picChoice(r, rectFig(...big, { small: true, sides: [`${big[0]} m`, `${big[1]} m`, '', ''] }), [rectFig(...small, { small: true, sides: [`${small[0]} m`, `${small[1]} m`, '', ''] })], { q: 'Which garden has the bigger area?', steps: (Lt) => [`One garden: ${big[0]} × ${big[1]} = ${big[0] * big[1]} m².`, `The other: ${small[0]} × ${small[1]} = ${small[0] * small[1]} m².`, St(`${big[0] * big[1]} is bigger.`, rectFig(...big, { sides: [`${big[0]} m`, `${big[1]} m`, '', ''], fill: true })), `So the answer is ${Lt}.`] });
}
export function g3Volume(r) {
  const v = r.int(0, 5), l = r.int(2, 5), w = r.int(2, 4), h = r.int(1, 4), V = l * w * h;
  const box = (o = {}) => G.boxFig({ l, w, h, cubes: true, ...o }), layer = () => G.boxFig({ l, w, h: 1, cubes: true, hl: 'top' });
  if (v === 0) return num(V, [St(`One layer has ${l} × ${w} = ${l * w} cubes.`, layer()), St(`There ${h === 1 ? 'is 1 layer' : `are ${h} layers`}.`, box({ hl: 'height' })), `${l * w} × ${h} = ${V}.`, `So the volume is ${V} cubic units.`], { q: 'How many unit cubes make this box? (Count the hidden ones too.)', visual: box(), expr: `${l}*${w}*${h}` });
  if (v === 1) return num(V, [St(`One layer is ${l} long and ${w} wide: ${l} × ${w} = ${l * w} cubes.`, layer()), St(`${h} ${h === 1 ? 'layer' : 'layers'} high: ${l * w} × ${h} = ${V}.`, box({ hl: 'height' })), `So the volume is ${V} cubic units.`], { q: `A box is ${l} cubes long, ${w} cubes wide and ${h} cube${h === 1 ? '' : 's'} high. How many unit cubes fill it?`, expr: `${l}*${w}*${h}` });
  if (v === 2) return num(V, [St(`Each layer has ${l} × ${w} = ${l * w} cubes.`, areaFig(rectCells(l, w), { done: w, counts: rowCounts(l, w) })), St(`${l * w} × ${h} = ${V}.`, box()), `So there are ${V} cubes.`], { q: `A stack has ${h} layer${h === 1 ? '' : 's'}. Each layer is this grid, with one cube on each square. What is the volume, in cubes?`, visual: areaFig(rectCells(l, w)), expr: `${l * w}*${h}` });
  if (v === 3) {
    let b2 = [r.int(2, 5), r.int(2, 4), r.int(1, 3)]; if (b2[0] * b2[1] * b2[2] === V) b2 = [b2[0] + 1, b2[1], b2[2]];
    const V2 = b2[0] * b2[1] * b2[2], A = G.boxFig({ l, w, h, cubes: true, W: 160, H: 140, pad: 18 }), B = G.boxFig({ l: b2[0], w: b2[1], h: b2[2], cubes: true, W: 160, H: 140, pad: 18 });
    const [right, wrong] = V > V2 ? [A, B] : [B, A];
    return picChoice(r, right, [wrong], { q: 'Which box is made of more unit cubes?', steps: (Lt) => [`One box: ${l} × ${w} × ${h} = ${V} cubes.`, `The other: ${b2[0]} × ${b2[1]} × ${b2[2]} = ${V2} cubes.`, `${Math.max(V, V2)} is more, so the answer is ${Lt}.`] });
  }
  if (v === 4) { const hh = Math.max(2, h); return num(hh, [St(`One layer has ${l} × ${w} = ${l * w} cubes.`, layer()), `${l * w * hh} ÷ ${l * w} = ${hh}.`, `So there are ${hh} layers.`], { q: `A box holds ${l * w * hh} unit cubes. Each layer has ${l} × ${w} cubes, like the picture. How many layers are there?`, visual: layer(), expr: `${l * w * hh}/${l * w}` }); }
  return num(l * w, [St('Look at the top layer.', box({ hl: 'top' })), `It is ${l} cubes long and ${w} cubes wide: ${l} × ${w} = ${l * w}.`, `So each layer has ${l * w} cubes.`], { q: 'How many cubes are in one layer of this box?', visual: box(), expr: `${l}*${w}` });
}

// ═════════════════════════════ lessons: key ideas with pictures ═════════════════════════════
const row = (names, o = {}) => figs(names.map((n) => sm(n, o)), names);
export const LESSONS = {
  '0-shapes2d': [
    L('A circle is round. It has no corners.', flatFig('circle', { count: 'curve' })),
    L('A triangle has 3 sides and 3 corners.', flatFig('triangle', { count: 'sides' })),
    L('A square has 4 sides, all the same. A rectangle has 2 long sides and 2 short sides.', row(['square', 'rectangle'])),
    L('A hexagon has 6 sides. An oval is round but stretched, like an egg.', row(['hexagon', 'oval'])),
    L('Turning a shape does not change its name. This is still a square.', flatFig('square', { rot: 45 })),
  ],
  '0-shape-sides': [
    L('A side is a straight edge. Count each side once.', flatFig('square', { count: 'sides' })),
    L('A corner is where two sides meet. A triangle has 3 corners.', flatFig('triangle', { count: 'corners' })),
    L('A shape has as many corners as sides. A hexagon has 6 of each.', flatFig('hexagon', { count: 'corners' })),
    L('A circle has a curved edge and no corners.', flatFig('circle', { count: 'curve' })),
  ],
  '0-symmetry': [
    L('Some shapes fold so the two halves match exactly.', flatFig('triangle', { fold: [[4, -1], [4, 7.9]] })),
    L('The fold line is called a line of symmetry.', flatFig('rectangle', { fold: [[5, -1], [5, 6]] })),
    L('Letters can have one too. A folds down the middle. F does not.', figs([letterFig('A', { fold: true, small: true }), letterFig('F', { fold: true, small: true })], ['matches', 'does not match'])),
    L('A fold in the wrong place makes halves that do not match.', flatFig('rectangle', { fold: [[-0.6, -0.3], [10.6, 5.3]] })),
  ],
  '0-solids-name': [
    L('Solid shapes are not flat: you can hold them.', row(['sphere', 'cube', 'cone', 'cylinder'])),
    L('A sphere is round all over, like a ball.', solidFig('sphere')),
    L('A cube has 6 flat faces. Each face is a square, like a dice.', solidFig('cube', { hlFaces: [0, 2, 5] })),
    L('A cone has a flat circle at the bottom and a point at the top.', solidFig('cone', { hl: ['base'] })),
    L('A cylinder has 2 flat circles and a curved side, like a can.', solidFig('cylinder', { hl: ['base', 'top'] })),
  ],
  '0-solids-faces': [
    L('A face is a flat part of a solid. Trace a face and you draw a flat shape.', solidFig('cube', { hlFaces: [0] })),
    L('A cylinder has 2 flat faces: circles. Its side is curved.', solidFig('cylinder', { hl: ['base', 'top'] })),
    L('Curved parts let a solid roll. A sphere rolls any way.', solidFig('sphere', { hl: 'curve' })),
    L('Flat faces let a solid stack. A cube stacks, but it cannot roll.', G.boxFig({ l: 1, w: 1, h: 2, cubes: true })),
  ],
  '0-shapes-real': [
    L('Look for shapes in things you see every day. A pizza is a circle; a door is a rectangle.', row(['circle', 'rectangle'])),
    L('A can is like a cylinder, a ball is like a sphere, and a party hat is like a cone.', row(['cylinder', 'sphere', 'cone'])),
    L('Position words tell where a shape is: on top of, under, beside.', stackFig('circle', 'square', 'triangle')),
    L('Left, middle and right tell where things are in a row.', shapeRow(['triangle', 'circle', 'square'], { hl: [1] })),
  ],
  '1-shape-sides': [
    L('A side is a straight line on the edge of a shape. Count each side once.', flatFig('pentagon', { count: 'sides' })),
    L('A vertex is a corner, where two sides meet. Vertices is more than one vertex.', flatFig('square', { count: 'corners' })),
    L('Triangle 3, square 4, pentagon 5, hexagon 6, octagon 8.', row(['triangle', 'square', 'pentagon', 'hexagon', 'octagon'])),
    L('A circle has no sides and no vertices.', flatFig('circle', { count: 'curve' })),
  ],
  '1-shape-attr': [
    L('Look at the sides: how many, and are they equal? Ticks show equal sides.', flatFig('rhombus', { ticks: [1, 1, 1, 1] })),
    L('Look at the corners. A small square marks a square corner.', flatFig('rectangle', { right: [0, 1, 2, 3] })),
    L('A square has both: 4 equal sides and 4 square corners.', flatFig('square', MARKS.square)),
    L('A closed shape has no gaps. An open shape has a gap.', figs([flatFig('pentagon', { small: true, tone: 'paper' }), openFig('pentagon', { small: true })], ['closed', 'open'])),
  ],
  '1-shape-world': [
    L('Flat shapes are all around us: a stop sign is an octagon, a coin is a circle.', row(['octagon', 'circle'])),
    L('A line of symmetry folds a shape into two matching halves.', flatFig('hexagon', { fold: [[0, -5.8], [0, 5.8]] })),
    L('Shapes can slide (move), flip (mirror image) or turn (spin around a point).', figs([moveFig('slide', { u: 14 }), moveFig('flip', { u: 14 }), moveFig('turn', { u: 14 })], ['slide', 'flip', 'turn'])),
    L('Small shapes can be put together to make a bigger shape: two squares make a rectangle.', COMPOSE[0][2]()),
  ],
  '1-solid-name': [
    L('Solid shapes are three-dimensional: they take up space.', row(['cube', 'rectangular prism', 'cylinder', 'cone'])),
    L('More solids: sphere, square pyramid and triangular prism.', row(['sphere', 'square pyramid', 'triangular prism'])),
    L('Flat shapes are two-dimensional, like drawings: circle, square, triangle.', row(['circle', 'square', 'triangle'])),
    L('Dashed lines show the edges at the back that we cannot see.', solidFig('cube')),
  ],
  '1-solid-count': [
    L('A face is a flat surface. A cube has 6 faces; 3 of them are hidden at the back.', solidFig('cube', { hlFaces: [0, 2, 5] })),
    L('An edge is where two faces meet. A cube has 12 edges.', solidFig('cube', allParts('cube', 'edges'))),
    L('A vertex is a corner. A cube has 8 vertices.', solidFig('cube', { dots: [0, 1, 2, 3, 4, 5, 6, 7] })),
    L('Count in groups so you do not miss any: 4 edges on top, 4 on the bottom, 4 going up.', solidFig('cube', { hlEdges: solidGroups('cube', 'edges')[0].edges, numbers: true })),
  ],
  '1-solid-attr': [
    L('Trace a flat face of a solid to see a flat shape: a cylinder end makes a circle.', solidFig('cylinder', { hl: ['top'] })),
    L('A square pyramid has a square base and triangle faces.', solidFig('square pyramid', { hlFaces: [1, 2, 3, 4] })),
    L('Curved solids can roll. Solids with flat faces can stack and slide.', row(['sphere', 'cylinder', 'cube'])),
    L('Solids can be put together: 2 cubes side by side make a rectangular prism.', G.boxFig({ l: 2, w: 1, h: 1, cubes: true })),
  ],
  '1-area': [
    L('Area is how many squares cover a shape, with no gaps and no overlaps.', areaFig(rectCells(4, 3))),
    L('Count the squares row by row: 4, 8, 12.', areaFig(rectCells(4, 3), { done: 2, counts: rowCounts(4, 3) })),
    L('For other shapes, count each part and add.', areaFig(rectCells(4, 3).filter(([x, y]) => y < 1 || x < 2), { tone: (x, y) => (y < 1 ? 'hl' : 'hl2') })),
  ],
  '2-shapes-2d': [
    L('A side is a straight edge. A vertex is a corner where two sides meet.', flatFig('pentagon', { count: 'corners' })),
    L('Triangle 3 sides, square and rectangle 4, pentagon 5, hexagon 6, octagon 8.', row(['triangle', 'square', 'pentagon', 'hexagon', 'octagon'])),
    L('The sides do not have to be equal: any shape with 6 straight sides is a hexagon.', irrFig('hexagon', { count: 'sides' })),
    L('Circles and ovals are curved, so they have no sides and no vertices.', row(['circle', 'oval'])),
  ],
  '2-shape-moves': [
    L('A slide moves a shape to a new place. It still faces the same way.', moveFig('slide')),
    L('A flip makes a mirror image over a line.', moveFig('flip')),
    L('A turn spins a shape around a point.', moveFig('turn')),
    L('A line of symmetry cuts a shape into two matching halves.', flatFig('trapezoid', { fold: [[5, -1], [5, 6]] })),
    L('Congruent shapes have the same size and the same shape, even when turned.', figs([onGrid(CONG.L, 'hl'), onGrid(rot90(CONG.L))], ['', 'congruent'])),
  ],
  '2-shapes-3d': [
    L('A face is a flat surface. A triangular prism has 2 triangles and 3 rectangles: 5 faces.', solidFig('triangular prism', { hlFaces: [0, 1] })),
    L('An edge is where two faces meet.', solidFig('triangular prism', allParts('triangular prism', 'edges'))),
    L('A vertex is a corner. A square pyramid has 4 around the base and 1 at the top.', solidFig('square pyramid', { dots: [0, 1, 2, 3, 4], numbers: true })),
    L('A cube has 6 faces, 12 edges and 8 vertices.', solidFig('cube', { dots: [0, 1, 2, 3, 4, 5, 6, 7] })),
  ],
  '2-solids-real': [
    L('Many things around us are solids: a ball is a sphere and a soup can is a cylinder.', row(['sphere', 'cylinder'])),
    L('A net is a flat pattern that folds up into a solid.', G.netFig({ cells: G.CUBE_NETS[5] })),
    L('Each piece of a net becomes one face: 1 square and 4 triangles make a square pyramid.', figs([G.pyramidNet(), solidFig('square pyramid', { small: true })], ['net', 'square pyramid'])),
    L('A cylinder net has 2 circles and a rectangle that rolls into the curved side.', G.cylinderNet()),
  ],
  '2-perimeter-area': [
    L('Perimeter is the distance all the way around: add every side.', rectFig(6, 3, { sides: ['6 cm', '3 cm', '6 cm', '3 cm'], hl: sidesHl(0, 1, 2, 3) })),
    L('A rectangle has two long sides and two short sides: 6 + 3 + 6 + 3 = 18 cm.', rectFig(6, 3, { sides: ['6 cm', '3 cm', '6 cm', '3 cm'], hl: sidesHl(0, 2) })),
    L('Area is how many squares cover a shape. Count row by row.', areaFig(rectCells(5, 3), { done: 2, counts: rowCounts(5, 3) })),
    'Perimeter is measured in units like cm or m. Area is measured in squares.',
  ],
  '3-polygons': [
    L('A polygon is a closed shape with straight sides only.', row(['triangle', 'pentagon', 'hexagon'])),
    L('Not polygons: a shape with a curve, or a shape with a gap.', figs([flatFig('circle', { small: true }), halfMoonFig({ small: true }), openFig('pentagon', { small: true })], ['curved', 'curved side', 'open'])),
    L('Triangle 3 sides, quadrilateral 4, pentagon 5, hexagon 6, octagon 8.', figs([3, 4, 5, 6, 8].map((k) => regFig(k, { small: true })), [3, 4, 5, 6, 8].map((k) => PNAME[k]))),
    L('The name comes from the number of sides, even when the sides are different lengths.', irrFig('pentagon', { count: 'sides' })),
  ],
  '3-triquad': [
    L('Marks tell you facts: ticks for equal sides, arrows for parallel sides, small squares for right angles.', qFig('parallelogram')),
    L('Square: 4 equal sides and 4 right angles. Rectangle: 4 right angles.', figs([qFig('square', true, { small: true }), qFig('rectangle', true, { small: true })], ['square', 'rectangle'])),
    L('Rhombus: 4 equal sides. Parallelogram: 2 pairs of parallel sides. Trapezoid: 1 pair.', figs(['rhombus', 'parallelogram', 'trapezoid'].map((x) => qFig(x, true, { small: true })), ['rhombus', 'parallelogram', 'trapezoid'])),
    L('Triangles by sides: equilateral (3 equal), isosceles (2 equal), scalene (none equal).', figs([flatFig('triangle', { small: true, ticks: [1, 1, 1] }), flatFig('triangle', { pts: triFromSides(5, 7, 7), small: true, ticks: [0, 1, 1] }), flatFig('long triangle', { small: true })], ['equilateral', 'isosceles', 'scalene'])),
    L('Triangles by angles: right (one 90° angle), obtuse (one angle over 90°), acute (all under 90°).', figs([flatFig('right triangle', { small: true, right: [0] }), flatFig('triangle', { pts: triFromAngles(25, 30), small: true }), flatFig('triangle', { small: true })], ['right', 'obtuse', 'acute'])),
  ],
  '3-transform': [
    L('A slide (translation) moves a shape without turning it.', moveFig('slide')),
    L('A flip (reflection) makes a mirror image over a line.', moveFig('flip')),
    L('A turn (rotation) spins a shape around a point.', moveFig('turn')),
    L('A line of symmetry folds a shape into two matching halves. A square has 4.', flatFig('x', { pts: FLAT.square, folds: regLines(FLAT.square) })),
    L('Congruent shapes have the same size and the same shape.', figs([onGrid(CONG.tri, 'hl'), onGrid(rot90(CONG.tri))], ['', 'congruent'])),
  ],
  '3-solids': [
    L('Prisms have two matching ends joined by rectangles.', figs([solidFig('triangular prism', { small: true, hlFaces: [0, 1] }), solidFig('rectangular prism', { small: true, hlFaces: [0, 1] })], ['triangular prism', 'rectangular prism'])),
    L('Pyramids have one base and triangle faces that meet at a point.', figs([solidFig('square pyramid', { small: true, hlFaces: [1, 2, 3, 4] }), solidFig('triangular pyramid', { small: true, hlFaces: [1, 2, 3] })], ['square-based pyramid', 'triangular pyramid'])),
    L('Cylinders, cones and spheres have curved surfaces.', row(['cylinder', 'cone', 'sphere'])),
    L('Dashed lines are the hidden edges at the back.', solidFig('cube')),
  ],
  '3-solidparts': [
    L('A face is a flat surface.', solidFig('triangular prism', { hlFaces: [0, 1] })),
    L('An edge is where two faces meet.', solidFig('cube', allParts('cube', 'edges'))),
    L('A vertex is a corner where edges meet.', solidFig('square pyramid', { dots: [0, 1, 2, 3, 4] })),
    L('A net is a flat pattern that folds into a 3-D shape: one piece for each face.', figs([G.netFig({ cells: G.CUBE_NETS[3] }), G.triPrismNet()], ['cube', 'triangular prism'])),
  ],
  '3-perim2': [
    L('Perimeter is the distance all the way around: add every side.', flatFig('pentagon', { sides: ['4 cm', '5 cm', '3 cm', '6 cm', '4 cm'], hl: sidesHl(0, 1, 2, 3, 4) })),
    L('A rectangle: 2 lengths + 2 widths.', rectFig(8, 3, { sides: ['8 m', '3 m', '8 m', '3 m'], hl: sidesHl(0, 2) })),
    L('If you know the perimeter, subtract the sides you know to find the missing one.', flatFig('triangle', { pts: triFromSides(7, 6, 5), sides: ['7 cm', '6 cm', '? cm'], hl: sidesHl(2) })),
    L('A square has 4 equal sides, so one side = perimeter ÷ 4.', flatFig('square', { ticks: [1, 1, 1, 1] })),
  ],
  '3-area2': [
    L('Area counts the unit squares inside a shape.', areaFig(rectCells(5, 3))),
    L('For a rectangle, multiply: 3 rows of 5 = 3 × 5 = 15 square units.', areaFig(rectCells(5, 3), { done: 2, counts: rowCounts(5, 3) })),
    L('Split other shapes into rectangles and add their areas.', areaFig(rectCells(5, 4).filter(([x, y]) => y < 2 || x < 2), { tone: (x, y) => (y < 2 ? 'hl' : 'hl2') })),
    L('If you know the area and one side, divide to find the other side.', rectFig(6, 4, { sides: ['6 cm', '? cm', '', ''] })),
  ],
  '3-volume': [
    L('Volume is how many unit cubes fill a box.', G.boxFig({ l: 4, w: 3, h: 2, cubes: true })),
    L('Count one layer first: 4 × 3 = 12 cubes.', G.boxFig({ l: 4, w: 3, h: 1, cubes: true, hl: 'top' })),
    L('Then multiply by the number of layers: 12 × 2 = 24 cubes.', G.boxFig({ l: 4, w: 3, h: 2, cubes: true, hl: 'height' })),
  ],
};
