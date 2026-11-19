// Grade 6 geometry and measurement, taught with pictures (the pattern of geo10.mjs): every question that a picture
// helps has its figure, the worked steps light up the part being used, and each skill's lesson is a few key ideas
// with labelled diagrams. Used by g6.mjs (and 6-tri in skills.mjs can use `tri6` and `TRI_LESSON`).
// Builders here are composed from the primitives of ../figs.mjs: rays round a point, a protractor, a clock,
// thermometers, a squared grid, and convex solids drawn with their hidden edges dashed.
import { num, mc, St, dec, comma, neg, par } from '../kit.mjs';
import * as G from '../figs.mjs';

const rad = (d) => (d * Math.PI) / 180;
const R1 = (x) => Math.round(x * 10) / 10;
const art = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const low = (s) => s.toLowerCase();
const range = (n) => Array.from({ length: n }, (_, i) => i);
const ABCD = ['A', 'B', 'C', 'D'];
// display lengths in proportion, but never too thin to read
const disp = (a, b) => { const [x, y] = G.squash([a, b], 0.4, 0.8); return [x * 10, y * 10]; };
const sum = (xs) => xs.reduce((a, b) => a + b, 0);

// ═════════════ picture builders ═════════════

// rays from one point. rays: directions in degrees (0 = right, counter-clockwise) or { d, t, len };
// arcs: { a, b, label, hl, r, square } marks the angle turning counter-clockwise from direction a to direction b
export function rayFig({ rays = [], arcs = [], W = 300, H = 200, V, len = 100 }) {
  const C = V ?? [W / 2, H / 2];
  const at = (d, r = len) => [C[0] + r * Math.cos(rad(d)), C[1] - r * Math.sin(rad(d))];
  const items = [];
  for (const ry of rays) { const o = typeof ry === 'number' ? { d: ry } : ry; items.push(G.line(C, at(o.d, o.len ?? len), o.t ?? 'ink')); }
  for (const a of arcs) {
    const r = a.r ?? 30, span = a.b - a.a;
    if (a.square) items.push(G.rightMark(C, at(a.a), at(a.b), 15));
    else { const p1 = at(a.a, r).map(R1), p2 = at(a.b, r).map(R1); items.push(G.path(`M${p1.join(' ')}A${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${p2.join(' ')}`, a.hl ? 'hlline' : 'mark')); }
    if (a.label) items.push(G.text(at((a.a + a.b) / 2, (a.square ? 22 : r) + 13 + String(a.label).length * 2.5), a.label, a.hl ? 'hl' : a.tone ?? 'ink'));
  }
  items.push(G.dot(C));
  return G.fig(items, W, H);
}

// a protractor (one scale, 0° on the right) with rays at a° and b°
export function protractorFig(a, b, { hl = false, label = '' } = {}) {
  const W = 300, H = 178, C = [150, 156], R = 118;
  const at = (d, r) => [C[0] + r * Math.cos(rad(d)), C[1] - r * Math.sin(rad(d))];
  const items = [G.path(`M${C[0] - R} ${C[1]}A${R} ${R} 0 0 1 ${C[0] + R} ${C[1]}Z`, 'top')];
  for (let d = 0; d <= 180; d += 5) items.push(G.line(at(d, R), at(d, R - (d % 10 ? 6 : d % 20 ? 10 : 14)), 'grid'));
  for (let d = 0; d <= 180; d += 20) items.push(G.text(at(d, R - 25), d, 'muted', { size: 10 }));
  items.push(G.line(at(a, 0), at(a, R + 16), hl ? 'hlline' : 'ink'), G.line(at(b, 0), at(b, R + 16), hl ? 'hlline' : 'ink'));
  const lo = Math.min(a, b), hi = Math.max(a, b), r = 30, p1 = at(lo, r).map(R1), p2 = at(hi, r).map(R1);
  items.push(G.path(`M${p1.join(' ')}A${r} ${r} 0 0 0 ${p2.join(' ')}`, 'mark'));
  if (label) items.push(G.text(at((lo + hi) / 2, 52), label, 'hl'));
  items.push(G.dot(C));
  return G.fig(items, W, H);
}

// a clock face with the minute hand on 12 and the hour hand on h; arc: label for the smaller angle between them
export function clockFig(h, { arc = '', hl = false } = {}) {
  const W = 230, H = 230, C = [115, 115], R = 92;
  const at = (k, r) => [C[0] + r * Math.cos(rad(90 - 30 * k)), C[1] - r * Math.sin(rad(90 - 30 * k))];
  const items = [G.circle(C, R, 'top')];
  for (let k = 1; k <= 12; k++) items.push(G.line(at(k, R), at(k, R - 7), 'ink'), G.text(at(k, R - 19), k, 'muted', { size: 12 }));
  items.push(G.line(C, at(12, R - 30), 'ink'), G.line(C, at(h, R - 46), hl ? 'hlline' : 'ink'));
  if (arc) {
    const k = h <= 6 ? h : 12 - h, a = h <= 6 ? 90 - 30 * h : 90, b = a + 30 * k, r = 26;
    const p = (d) => [C[0] + r * Math.cos(rad(d)), C[1] - r * Math.sin(rad(d))].map(R1);
    items.push(G.path(`M${p(a).join(' ')}A${r} ${r} 0 0 0 ${p(b).join(' ')}`, 'mark'));
    const m = (a + b) / 2; items.push(G.text([C[0] + 46 * Math.cos(rad(m)), C[1] - 46 * Math.sin(rad(m))], arc, 'hl'));
  }
  items.push(G.dot(C));
  return G.fig(items, W, H);
}

// a circle with a sector of deg° shaded and its angle at the centre marked (works past 180° too)
export function sectorFig(deg, label = '') {
  const W = 260, H = 220, C = [130, 110], R = 80, at = (d, r) => [C[0] + r * Math.cos(rad(d)), C[1] - r * Math.sin(rad(d))].map(R1);
  const big = deg > 180 ? 1 : 0, items = [G.circle(C, R, 'fig')];
  items.push(G.path(`M${C.join(' ')}L${at(0, R).join(' ')}A${R} ${R} 0 ${big} 0 ${at(deg, R).join(' ')}Z`, 'hl'));
  items.push(G.path(`M${at(0, 22).join(' ')}A22 22 0 ${big} 0 ${at(deg, 22).join(' ')}`, 'mark'));
  if (label) items.push(G.text(at(deg / 2, 44), label, 'hl'));
  items.push(G.dot(C));
  return G.fig(items, W, H);
}
// thermometers side by side, each filled to its value (°C); names under them
export function thermoFig(vals, { lo = -30, hi = 40, names = [], hl = [] } = {}) {
  const n = vals.length, W = n > 1 ? 290 : 170, H = 270, top = 22, bot = 206;
  const y = (v) => bot - ((v - lo) / (hi - lo)) * (bot - top);
  const items = [];
  vals.forEach((v, i) => {
    const cx = n > 1 ? 95 + i * 125 : 100;
    items.push(G.poly([[cx - 8, top - 10], [cx + 8, top - 10], [cx + 8, bot + 8], [cx - 8, bot + 8]], 'paper'));
    items.push(G.circle([cx, bot + 22], 15, hl.includes(i) ? 'hl' : 'cut'));
    items.push(G.poly([[cx - 4, y(v)], [cx + 4, y(v)], [cx + 4, bot + 12], [cx - 4, bot + 12]], hl.includes(i) ? 'hl' : 'cut'));
    for (let t = lo; t <= hi; t += 2) items.push(G.line([cx - 8, y(t)], [cx - 8 - (t % 10 ? 6 : 13), y(t)], 'grid'));
    for (let t = lo; t <= hi; t += 10) items.push(G.text([cx - 38, y(t)], neg(t), t === 0 ? 'ink' : 'muted', { size: 11 }));
    if (names[i]) items.push(G.text([cx, bot + 52], names[i], 'ink', { size: 13 }));
  });
  return G.fig(items, W, H);
}

// a squared grid (model units = squares, y up) with shapes on it; grid lines are drawn over the shapes so the
// squares can be counted. shapes: [{ pts, t, label }], lines: [{ a, b, t }], notes: [{ at, s, t }], dots: [{ at, t }]
export function gridFig({ cols, rows, shapes = [], lines = [], notes = [], dots = [], W = 300, H = 220, pad = 14 }) {
  const u = Math.min((W - 2 * pad) / cols, (H - 2 * pad) / rows), w = cols * u + 2 * pad, h = rows * u + 2 * pad;
  const m = ([x, y]) => [pad + x * u, h - pad - y * u];
  const items = [];
  for (const s of shapes) items.push(G.poly(s.pts.map(m), s.t ?? 'fig'));
  for (let i = 0; i <= cols; i++) items.push(G.line(m([i, 0]), m([i, rows]), 'grid'));
  for (let j = 0; j <= rows; j++) items.push(G.line(m([0, j]), m([cols, j]), 'grid'));
  for (const s of shapes) items.push(G.poly([...s.pts, s.pts[0]].map(m), s.t === 'hl' ? 'hlline' : 'ink', { open: true }));
  for (const s of shapes) if (s.label) { const c = s.pts.reduce((a, p) => [a[0] + p[0] / s.pts.length, a[1] + p[1] / s.pts.length], [0, 0]); items.push(G.text(m(s.at ?? c), s.label, s.lt ?? 'ink')); }
  for (const l of lines) items.push(G.line(m(l.a), m(l.b), l.t ?? 'aux'));
  for (const d of dots) items.push(G.dot(m(d.at), d.t ?? 'hl'));
  for (const t of notes) items.push(G.text(m(t.at), t.s, t.t ?? 'ink', t.size ? { size: t.size } : {}));
  return G.fig(items, R1(w), R1(h));
}

// ── convex solids in the same oblique view as figs.mjs (depth goes up and to the right), hidden edges dashed ──
const DX = 0.42, DY = 0.3;
const proj = ([x, y, z]) => [x + z * DX, y + z * DY];
const s3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const c3 = (ps) => [0, 1, 2].map((k) => sum(ps.map((p) => p[k])) / ps.length);
// solidFig({ V: [[x, y, z]], F: [[vertex indices]], hl: { faces: [i], edges: true, verts: true } })
export function solidFig({ V, F, hl = {}, W = 260, H = 210, pad = 30 }) {
  const fr = G.frame(V.map(proj), { W, H, pad });
  const S = V.map((p) => fr.m(proj(p))), mid = c3(V), view = [-DX, -DY, 1];
  const faces = F.map((f) => {
    let n = cr(s3(V[f[1]], V[f[0]]), s3(V[f[2]], V[f[0]]));
    if (dt(n, s3(c3(f.map((i) => V[i])), mid)) < 0) n = n.map((x) => -x);
    const L = Math.hypot(...n) || 1; n = n.map((x) => x / L);
    return { f, n, vis: dt(n, view) < -1e-9 };
  });
  const edges = new Map();
  faces.forEach((fc) => fc.f.forEach((i, k) => { const j = fc.f[(k + 1) % fc.f.length], key = Math.min(i, j) + '-' + Math.max(i, j); const e = edges.get(key) ?? { i, j, vis: false }; e.vis ||= fc.vis; edges.set(key, e); }));
  const hf = hl.faces ?? [];
  const items = [];
  faces.forEach((fc, k) => { if (fc.vis) items.push(G.poly(fc.f.map((i) => S[i]), hf.includes(k) ? 'hl' : fc.n[1] > 0.6 ? 'top' : fc.n[0] > 0.45 ? 'side' : 'front')); });
  faces.forEach((fc, k) => { if (!fc.vis && hf.includes(k)) items.push(G.poly(fc.f.map((i) => S[i]), 'hlsoft')); });
  for (const e of edges.values()) if (!e.vis) items.push(G.line(S[e.i], S[e.j], hl.edges ? 'aux' : 'hidden'));
  if (hl.edges) for (const e of edges.values()) if (e.vis) items.push(G.line(S[e.i], S[e.j], 'hlline'));
  if (hl.verts) S.forEach((p) => items.push(G.dot(p, 'hl')));
  return G.fig(items, W, H);
}
export const box3 = (l, w, h) => ({ V: [[0, 0, 0], [l, 0, 0], [l, h, 0], [0, h, 0], [0, 0, w], [l, 0, w], [l, h, w], [0, h, w]], F: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]] });
// a prism lying with its base (end face, model y up) at the front: faces 0 and 1 are the bases
export const prism3 = (base, D) => { const n = base.length; return { V: [...base.map(([x, y]) => [x, y, 0]), ...base.map(([x, y]) => [x, y, D])], F: [range(n), range(n).map((i) => n + i), ...range(n).map((i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i])] }; };
// a pyramid standing on a regular n-gon: face 0 is the base
export const pyr3 = (n, h = 1.5) => { const st = -Math.PI / 2 - Math.PI / n; const B = range(n).map((i) => [Math.cos(st + (2 * Math.PI * i) / n), 0, Math.sin(st + (2 * Math.PI * i) / n)]); return { V: [...B, [0, h, 0]], F: [range(n), ...range(n).map((i) => [i, (i + 1) % n, n])] }; };
const solid = (o, hl, size) => solidFig({ ...o, hl, ...(size ?? {}) });

// polygon helpers
const triFromAngles = (A, B) => { const C = 180 - A - B, b = Math.sin(rad(B)) / Math.sin(rad(C)); return [[0, 0], [1, 0], [b * Math.cos(rad(A)), b * Math.sin(rad(A))]]; };
const triFromSides = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return [[0, 0], [a, 0], [x, Math.sqrt(Math.max(0, c * c - x * x))]]; };
// a convex quadrilateral with these angles at vertices 0–3 (sum 360°), drawn to scale; null if none looks good
function quadFromAngles(angs) {
  const th = [0]; for (let i = 1; i < 4; i++) th.push(th[i - 1] + 180 - angs[i]);
  const u = th.map((t) => [Math.cos(rad(t)), Math.sin(rad(t))]);
  for (const L1 of [1, 0.85, 1.2, 0.7, 1.4, 0.6, 1.7]) {
    const rx = -(u[0][0] + L1 * u[1][0]), ry = -(u[0][1] + L1 * u[1][1]), det = u[2][0] * u[3][1] - u[3][0] * u[2][1];
    if (Math.abs(det) < 1e-6) continue;
    const L2 = (rx * u[3][1] - u[3][0] * ry) / det, L3 = (u[2][0] * ry - rx * u[2][1]) / det;
    if (L2 < 0.45 || L2 > 2.2 || L3 < 0.45 || L3 > 2.2) continue;
    const p1 = [1, 0], p2 = [1 + L1 * u[1][0], L1 * u[1][1]], p3 = [p2[0] + L2 * u[2][0], p2[1] + L2 * u[2][1]];
    return [[0, 0], p1, p2, p3];
  }
  return null;
}
const wobble = (n, k = 0) => G.regular(n).map(([x, y], i) => [x * (1 + 0.15 * Math.sin(i * 2.3 + k)), y * (1 + 0.12 * Math.cos(i * 1.9 + k))]);
const reflectPt = (p, a, b) => { const d = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...d), u = [d[0] / L, d[1] / L], v = [p[0] - a[0], p[1] - a[1]], k = v[0] * u[0] + v[1] * u[1]; return [2 * (a[0] + u[0] * k) - p[0], 2 * (a[1] + u[1] * k) - p[1]]; };

// ═════════════ 6-angles: measure and classify angles ═════════════
const ANGT = (d) => (d < 90 ? 'Acute' : d === 90 ? 'Right' : d < 180 ? 'Obtuse' : d === 180 ? 'Straight' : 'Reflex');
const ANGSAY = { Acute: 'less than 90°', Right: 'exactly 90°', Obtuse: 'between 90° and 180°', Straight: 'exactly 180°', Reflex: 'more than 180°' };
// one angle of d°, first ray turned rot° from flat; ref adds a dashed right angle to compare with
export function angPic(d, label = '', { rot = 0, ref = false, hl = false } = {}) {
  const big = d > 180, V = big ? [150, 108] : d > 100 ? [150, 150] : [95, 160];
  const arcs = d === 90 && !hl ? [{ a: rot, b: rot + 90, square: true, label }] : [{ a: rot, b: rot + d, label, r: big ? 24 : 32, hl }];
  return rayFig({ rays: [rot, rot + d, ...(ref ? [{ d: rot + 90, t: 'aux', len: 70 }] : [])], arcs, V, len: big ? 88 : 118, W: 300, H: big ? 216 : 180 });
}
export function angles6(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const d = r.pick([r.int(2, 8) * 10, 90, r.int(10, 17) * 10, 180, r.int(21, 33) * 10]), t = ANGT(d), rot = d <= 150 ? r.pick([0, 0, 10, 20]) : 0;
    return mc(r, t, ['Acute', 'Right', 'Obtuse', 'Straight', 'Reflex'].filter((x) => x !== t).slice(0, 3), { q: `This angle measures ${d}°. What type of angle is it?`, visual: angPic(d, `${d}°`, { rot }),
      steps: [St('Compare the angle with a right angle (the dashed line, 90°) and with a straight line (180°).', angPic(d, `${d}°`, { rot, ref: true })), St(`${d}° is ${ANGSAY[t]}, so it is ${art(t)} ${low(t)} angle.`)] });
  }
  if (v === 1) {
    const d = r.pick([30, 45, 60, 120, 135, 150]), wrongs = [30, 60, 90, 120, 150, 45, 135].filter((x) => Math.abs(x - d) >= 30);
    return mc(r, `${d}°`, r.shuffle(wrongs).slice(0, 3).map((x) => `${x}°`), { q: 'Which is the best estimate of the size of this angle?', visual: angPic(d),
      steps: [St(`Compare with a right angle (the dashed line, 90°): this angle is ${d < 90 ? 'smaller' : 'bigger'}${d < 90 ? (d < 45 ? ', less than half of it' : d === 45 ? ', exactly half of it' : ', more than half of it') : d > 135 ? ', nearly a straight line' : ''}.`, angPic(d, '', { ref: true })), St(`So the best estimate is ${d}°.`, angPic(d, `${d}°`))] });
  }
  if (v === 2 || v === 3) {
    const a = v === 2 ? 0 : r.int(1, 8) * 10, b = v === 2 ? r.int(3, 34) * 5 : Math.min(180, a + r.int(3, 12) * 10), d = b - a;
    const steps = v === 2
      ? [St('The centre of the protractor is on the vertex, and one ray lies on 0°.', protractorFig(a, b)), St(`Follow the other ray out to the scale. Count the small marks (5° each) past the last number: it crosses at ${d}°.`, protractorFig(a, b, { hl: true })), St(`So the angle measures ${d}°.`, protractorFig(a, b, { label: `${d}°` }))]
      : [St(`Neither ray is on 0°, so read both: one ray crosses at ${a}° and the other at ${b}°.`, protractorFig(a, b, { hl: true })), St(`The angle is the difference: ${b} − ${a} = ${d}.`, protractorFig(a, b, { label: `${d}°` })), St(`So the angle measures ${d}°.`)];
    return num(d, steps, { q: v === 2 ? 'Read the protractor. How many degrees is the angle?' : 'Read the protractor. How many degrees is the angle between the two rays?', unit: '°', visual: protractorFig(a, b), expr: `${b}-${a}` });
  }
  if (v === 4) {
    const [n, d, what] = r.pick([[1, 4, 'a quarter turn'], [1, 2, 'a half turn'], [3, 4, 'three-quarters of a turn'], [1, 3, 'a third of a turn'], [2, 3, 'two-thirds of a turn'], [1, 6, 'a sixth of a turn'], [1, 8, 'an eighth of a turn'], [3, 8, 'three-eighths of a turn']]);
    const deg = (360 * n) / d;
    return num(deg, [St('A full turn, all the way round, is 360°.', G.circleFig({ show: 'radius', hl: 'fill' })), St(`${n}/${d} of a turn is ${n}/${d} of 360°: 360 ÷ ${d} × ${n} = ${deg}.`, sectorFig(deg, `${deg}°`)), St(`So the angle is ${deg}°.`)],
      { q: `The shaded part of the circle is ${what}. How many degrees is the angle at the centre?`, unit: '°', visual: sectorFig(deg, '?'), expr: `360*${n}/${d}` });
  }
  if (v === 5) {
    const d = r.int(4, 16) * 10, x = 360 - d;
    const pic = (show) => rayFig({ rays: [0, d], arcs: [{ a: 0, b: d, label: `${d}°`, r: 24 }, { a: d, b: 360, label: show ? `${x}°` : '?', r: 40, hl: show }], V: [150, 108], len: 88, H: 216 });
    return num(x, [St('All the way round a point is a full turn: 360°. The marked angle and the reflex angle together make the full turn.', pic(false)), St(`Reflex angle = 360 − ${d} = ${x}.`, pic(true)), St(`So the reflex angle is ${x}°.`)],
      { q: `One angle between these rays is ${d}°. What is the reflex angle marked ?, in degrees?`, unit: '°', visual: pic(false), expr: `360-${d}` });
  }
  const h = r.pick([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]), k = h <= 6 ? h : 12 - h, ans = 30 * k;
  return num(ans, [St('A full turn is 360°, and the 12 numbers split the clock into 12 equal parts: 360 ÷ 12 = 30° for each part.', clockFig(h)), St(`The hands are ${k} part${k > 1 ? 's' : ''} apart: ${k} × 30° = ${ans}°.`, clockFig(h, { arc: `${ans}°`, hl: true })), St(`So the angle is ${ans}°.`)],
    { q: `What is the smaller angle between the hands of a clock at ${h}:00, in degrees?`, unit: '°', visual: clockFig(h, { arc: '?' }), expr: `30*${k}` });
}
export const ANGLES_LESSON = [
  { text: 'An angle is the amount of turn between two rays that start at the same point, the vertex. We measure angles in degrees (°).', visual: angPic(50, '50°') },
  { text: 'A right angle is a square corner: exactly 90°. An acute angle is smaller than 90°; an obtuse angle is between 90° and 180°.', visual: { type: 'figs', figs: [angPic(40, '40°'), angPic(90, '90°'), angPic(130, '130°')], captions: ['Acute', 'Right', 'Obtuse'] } },
  { text: 'A straight angle is 180°. A reflex angle is more than 180°. A full turn is 360°.', visual: rayFig({ rays: [0, 120], arcs: [{ a: 120, b: 360, label: '240°', r: 34, hl: true }], V: [150, 108], len: 88, H: 216 }) },
  { text: 'To measure, put the protractor\'s centre on the vertex and one ray on 0°. Read the scale where the other ray crosses it.', visual: protractorFig(0, 65, { label: '65°' }) },
];

// ═════════════ 6-anglepairs ═════════════
const crossPic = (a, labels, hlk = []) => rayFig({ rays: [0, a, 180, 180 + a], arcs: [[0, a], [a, 180], [180, 180 + a], [180 + a, 360]].map(([p, q], k) => (labels[k] ? { a: p, b: q, label: labels[k], r: 26 + (k % 2) * 6, hl: hlk.includes(k) } : null)).filter(Boolean), V: [150, 108], len: 96, H: 216 });
export function anglePairs6(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const a = r.int(3, 15) * 5 + r.pick([0, 0, 2]), x = 90 - a;
    const pic = (show, hl) => rayFig({ rays: [0, a, 90], arcs: [{ a: 0, b: 90, square: true }, { a: 0, b: a, label: `${a}°`, r: 40 }, { a, b: 90, label: show ? `${x}°` : 'x', r: 56, hl }], V: [80, 172], len: 140, W: 300, H: 200 });
    return num(x, [St('The two angles fill a right angle (the square corner), so they add to 90°. They are complementary.', pic(false, true)), St(`x = 90° − ${a}° = ${x}°.`, pic(true, true)), St(`So x = ${x}°.`)], { q: 'Find the angle x.', unit: 'x =', visual: pic(false), expr: `90-${a}` });
  }
  if (v === 1) {
    const a = r.int(4, 32) * 5, left = r.bool(), x = 180 - a, known = left ? x : a;
    const lab = (show) => (left ? [show ? `${a}°` : 'x', `${x}°`] : [`${a}°`, show ? `${x}°` : 'x']);
    const pic = (show, hl) => rayFig({ rays: [0, 180, a], arcs: [{ a: 0, b: a, label: lab(show)[0], r: 30, hl: hl && left }, { a, b: 180, label: lab(show)[1], r: 40, hl: hl && !left }], V: [150, 150], len: 125, H: 180 });
    const ans = left ? a : x;
    return num(ans, [St('The two angles sit together on a straight line, so they add to 180°. They are supplementary.', pic(false, true)), St(`x = 180° − ${known}° = ${ans}°.`, pic(true, true)), St(`So x = ${ans}°.`)], { q: 'Find the angle x.', unit: 'x =', visual: pic(false), expr: `180-${known}` });
  }
  if (v === 2 || v === 3) {
    const a = r.pick([r.int(5, 16) * 5, r.int(20, 31) * 5]), opp = v === 2, ans = opp ? a : 180 - a;
    const labels = (show) => [`${a}°`, opp ? '' : show ? `${ans}°` : 'x', opp ? (show ? `${ans}°` : 'x') : '', ''];
    const hk = opp ? [0, 2] : [0, 1];
    return num(ans, opp
      ? [St('Where two lines cross, the angles opposite each other are vertical angles. Vertical angles are equal.', crossPic(a, labels(false), hk)), St(`x is opposite the ${a}° angle, so x = ${a}°.`, crossPic(a, labels(true), hk)), St(`So x = ${ans}°.`)]
      : [St('x and the angle next to it lie on one straight line, so they add to 180°.', crossPic(a, labels(false), hk)), St(`x = 180° − ${a}° = ${ans}°.`, crossPic(a, labels(true), hk)), St(`So x = ${ans}°.`)],
    { q: 'Two straight lines cross. Find the angle x.', unit: 'x =', visual: crossPic(a, labels(false)), expr: opp ? String(a) : `180-${a}` });
  }
  if (v === 4) {
    let p, q, s, x, guard = 0;
    do { p = r.int(8, 26) * 5; q = r.int(8, 26) * 5; s = r.int(8, 26) * 5; x = 360 - p - q - s; } while ((x < 40 || x > 150) && guard++ < 100);
    if (x < 40 || x > 150) { p = 100; q = 80; s = 110; x = 70; }
    const pic = (show) => rayFig({ rays: [0, p, p + q, p + q + s], arcs: [{ a: 0, b: p, label: `${p}°`, r: 28 }, { a: p, b: p + q, label: `${q}°`, r: 28 }, { a: p + q, b: p + q + s, label: `${s}°`, r: 28 }, { a: p + q + s, b: 360, label: show ? `${x}°` : 'x', r: 34, hl: show }], V: [150, 108], len: 92, H: 216 });
    return num(x, [St('The angles all the way round a point make a full turn, so they add to 360°.', pic(false)), St(`Add the angles you know: ${p} + ${q} + ${s} = ${p + q + s}. Then x = 360 − ${p + q + s} = ${x}.`, pic(true)), St(`So x = ${x}°.`)], { q: 'Find the angle x around the point.', unit: 'x =', visual: pic(false), expr: `360-${p}-${q}-${s}` });
  }
  if (v === 5) {
    const a = r.int(5, 14) * 5, b = r.int(5, 14) * 5, x = 180 - a - b;
    const pic = (show) => rayFig({ rays: [0, 180, a, a + x], arcs: [{ a: 0, b: a, label: `${a}°`, r: 30 }, { a, b: a + x, label: show ? `${x}°` : 'x', r: 42, hl: show }, { a: a + x, b: 180, label: `${b}°`, r: 30 }], V: [150, 150], len: 125, H: 180 });
    return num(x, [St('The three angles fill a straight line, so they add to 180°.', pic(false)), St(`x = 180 − ${a} − ${b} = ${x}.`, pic(true)), St(`So x = ${x}°.`)], { q: 'The three angles are on a straight line. Find x.', unit: 'x =', visual: pic(false), expr: `180-${a}-${b}` });
  }
  if (v === 6) {
    const k = r.int(0, 2), a = r.pick([25, 35, 40, 55, 65, 110, 125, 140]);
    const right = ['Complementary', 'Supplementary', 'Vertical'][k];
    const pic = k === 0 ? rayFig({ rays: [0, Math.min(a, 70), 90], arcs: [{ a: 0, b: 90, square: true }, { a: 0, b: Math.min(a, 70), label: '1', r: 40 }, { a: Math.min(a, 70), b: 90, label: '2', r: 56 }], V: [80, 172], len: 140, H: 200 })
      : k === 1 ? rayFig({ rays: [0, 180, a], arcs: [{ a: 0, b: a, label: '1', r: 30 }, { a, b: 180, label: '2', r: 40 }], V: [150, 150], len: 125, H: 180 })
        : crossPic(a, ['1', '', '2', '']);
    const why = ['Angles 1 and 2 fill a right angle, so they add to 90°: complementary.', 'Angles 1 and 2 sit on a straight line, so they add to 180°: supplementary.', 'Angles 1 and 2 are opposite each other where two lines cross: vertical angles, which are equal.'][k];
    return mc(r, right, ['Complementary', 'Supplementary', 'Vertical'], { q: 'What kind of angle pair are angles 1 and 2?', visual: pic, steps: [St(why, pic), St(`So they are ${low(right)} angles.`)] });
  }
  const comp = r.bool(), a = comp ? r.int(5, 85) : r.int(10, 170), ans = (comp ? 90 : 180) - a;
  const pic = comp ? rayFig({ rays: [0, Math.max(12, Math.min(a, 78)), 90], arcs: [{ a: 0, b: 90, square: true }, { a: 0, b: Math.max(12, Math.min(a, 78)), label: `${a}°`, r: 40 }, { a: Math.max(12, Math.min(a, 78)), b: 90, label: `${ans}°`, r: 56, hl: true }], V: [80, 172], len: 140, H: 200 })
    : rayFig({ rays: [0, 180, a], arcs: [{ a: 0, b: a, label: `${a}°`, r: 30 }, { a, b: 180, label: `${ans}°`, r: 40, hl: true }], V: [150, 150], len: 125, H: 180 });
  return num(ans, [St(comp ? 'The complement of an angle is the angle that makes 90° with it.' : 'The supplement of an angle is the angle that makes 180° with it.'), St(`${comp ? 90 : 180} − ${a} = ${ans}.`, pic), St(`So the ${comp ? 'complement' : 'supplement'} is ${ans}°.`)],
    { q: `What is the ${comp ? 'complement' : 'supplement'} of a ${a}° angle?`, unit: '°', expr: `${comp ? 90 : 180}-${a}` });
}
export const ANGLEPAIRS_LESSON = [
  { text: 'Complementary angles add to 90°: together they make a right angle.', visual: rayFig({ rays: [0, 35, 90], arcs: [{ a: 0, b: 90, square: true }, { a: 0, b: 35, label: '35°', r: 40 }, { a: 35, b: 90, label: '55°', r: 56, hl: true }], V: [80, 172], len: 140, H: 200 }) },
  { text: 'Supplementary angles add to 180°: together they make a straight line.', visual: rayFig({ rays: [0, 180, 60], arcs: [{ a: 0, b: 60, label: '60°', r: 30 }, { a: 60, b: 180, label: '120°', r: 40, hl: true }], V: [150, 150], len: 125, H: 180 }) },
  { text: 'Where two lines cross, the opposite (vertical) angles are equal. Angles side by side on a line (adjacent) add to 180°.', visual: crossPic(50, ['50°', '130°', '50°', '130°'], [0, 2]) },
  { text: 'The angles all the way round a point add to 360°.', visual: rayFig({ rays: [0, 100, 190, 290], arcs: [{ a: 0, b: 100, label: '100°', r: 28 }, { a: 100, b: 190, label: '90°', r: 28 }, { a: 190, b: 290, label: '100°', r: 28 }, { a: 290, b: 360, label: '70°', r: 34 }], V: [150, 108], len: 92, H: 216 }) },
];

// ═════════════ 6-polygons ═════════════
const PNAME = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon' };
const QUADS = {
  Square: { pts: [[0, 0], [5, 0], [5, 5], [0, 5]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], say: '4 equal sides (one tick on each) and 4 right angles' },
  Rectangle: { pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], say: '4 right angles, but only the opposite sides are equal' },
  Rhombus: { pts: [[0, 0], [5, 0], [8, 4], [3, 4]], ticks: [1, 1, 1, 1], say: '4 equal sides but no right angles' },
  Parallelogram: { pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], par: [1, 2, 1, 2], ticks: [1, 2, 1, 2], say: '2 pairs of parallel sides (the arrows), no right angles, and the sides not all equal' },
  Trapezoid: { pts: [[0, 0], [9, 0], [6.5, 4], [2, 4]], par: [1, 0, 1, 0], say: 'exactly 1 pair of parallel sides (the arrows)' },
  Kite: { pts: [[0, 3], [3, 0], [9, 3], [3, 6]], ticks: [1, 2, 2, 1], say: '2 pairs of equal sides next to each other, and no parallel sides' },
};
const circPart = (k, hl = true) => {
  const f = G.circleFig({ show: k === 'Radius' ? 'radius' : k === 'Diameter' ? 'diameter' : 'none', hl: hl ? low(k) : null, centre: 'O' });
  if (k === 'Chord') f.items.push(G.line([130 + 80 * Math.cos(rad(200)), 110 - 80 * Math.sin(rad(200))], [130 + 80 * Math.cos(rad(115)), 110 - 80 * Math.sin(rad(115))], hl ? 'hlline' : 'ink'));
  if (k === 'Circumference') f.items.push(G.circle([130, 110], 80, 'hlline'));
  return f;
};
export function polygons6(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const n = r.int(3, 10), pts = r.bool(0.4) ? G.regular(n) : wobble(n, r.int(0, 5)), right = PNAME[n];
    return mc(r, right, r.shuffle(Object.values(PNAME).filter((x) => x !== right)).slice(0, 3), { q: 'Count the sides. What is the name of this polygon?', visual: G.polygonFig({ pts }),
      steps: [St(`Number the corners as you count: there are ${n} sides (and ${n} corners).`, G.polygonFig({ pts, names: pts.map((_, i) => String(i + 1)) })), St(`A polygon with ${n} sides is ${art(right)} ${low(right)}.`)] });
  }
  if (v === 1) {
    const k = r.int(0, 2), a = r.int(5, 11);
    const sides = k === 0 ? [a, a, a] : k === 1 ? [a + r.pick([-3, -2, 2, 3, 4]), a, a] : [a + r.int(1, 3), a - 1, a];
    const pts = triFromSides(...sides), right = ['Equilateral', 'Isosceles', 'Scalene'][k];
    const labs = sides.map((s) => `${s} cm`), tk = sides.map((s) => sides.filter((t) => t === s).length > 1 ? (k === 0 ? 1 : 1) : 0);
    return mc(r, right, ['Equilateral', 'Isosceles', 'Scalene'], { q: 'Classify this triangle by its sides.', visual: G.polygonFig({ pts, sides: labs }),
      steps: [St('Equilateral: all 3 sides equal. Isosceles: exactly 2 sides equal. Scalene: no sides equal.'), St(k === 0 ? 'All three sides are the same length (the ticks show equal sides).' : k === 1 ? 'Exactly two sides are the same length (the ticks show them).' : 'All three sides are different lengths.', G.polygonFig({ pts, sides: labs, ticks: tk })), St(`So it is ${art(right)} ${low(right)} triangle.`)] });
  }
  if (v === 2) {
    const k = r.int(0, 2);
    let angs;
    if (k === 0) { const A = r.int(10, 16) * 5, B = r.int(Math.max(7, Math.ceil((95 - A) / 5)), Math.min(17, Math.floor((155 - A) / 5))) * 5; angs = [A, B, 180 - A - B]; }
    else if (k === 1) { const B = r.int(5, 13) * 5; angs = [90, B, 90 - B]; }
    else { const O = r.int(20, 26) * 5, B = r.int(5, Math.floor((155 - O) / 5)) * 5; angs = [O, B, 180 - O - B]; }
    const order = r.shuffle([0, 1, 2]), A = order.map((i) => angs[i]);
    const pts = triFromAngles(A[0], A[1]), right = ['Acute', 'Right', 'Obtuse'][k];
    const ri = A.indexOf(90), labs = A.map((x) => (x === 90 ? '' : `${x}°`));
    const big = A.indexOf(Math.max(...A));
    return mc(r, right, ['Acute', 'Right', 'Obtuse'], { q: 'Classify this triangle by its angles.', visual: G.polygonFig({ pts, angles: labs, right: ri >= 0 ? [ri] : [] }),
      steps: [St('Look at the biggest angle. All angles less than 90°: acute. One angle exactly 90°: right. One angle more than 90°: obtuse.', G.polygonFig({ pts, angles: labs, right: ri >= 0 ? [ri] : [], hl: [{ angle: big }] })), St(`The biggest angle is ${Math.max(...A)}°, so it is ${art(right)} ${low(right)} triangle.`)] });
  }
  if (v === 3) {
    const right = r.pick(Object.keys(QUADS)), Q = QUADS[right];
    const wrongs = r.shuffle(Object.keys(QUADS).filter((x) => x !== right)).slice(0, 3);
    return mc(r, right, wrongs, { q: 'Read the marks on the sides and corners. What is the most specific name for this quadrilateral?', visual: G.polygonFig(Q),
      steps: [St('Tick marks show equal sides, arrows show parallel sides, and a small square shows a right angle.', G.polygonFig(Q)), St(`This one has ${Q.say}.`), St(`So its most specific name is ${low(right)}.`)] });
  }
  if (v === 4) {
    const right = r.pick(['Radius', 'Diameter', 'Chord', 'Circumference']);
    const say = { Radius: 'goes from the centre O to the circle', Diameter: 'goes right across the circle through the centre O', Chord: 'joins two points on the circle but does not go through the centre', Circumference: 'is the whole way round the circle' }[right];
    return mc(r, right, ['Radius', 'Diameter', 'Chord', 'Circumference'], { q: 'O is the centre. What is the name of the highlighted part of the circle?', visual: circPart(right),
      steps: [St('Radius: centre to the circle. Diameter: across through the centre. Chord: across, but not through the centre. Circumference: the distance all round.'), St(`The highlighted part ${say}.`, circPart(right)), St(`So it is the ${low(right)}.`)] });
  }
  if (v === 5) {
    const rd = r.int(2, 30), toD = r.bool();
    const pic = (hl) => G.circleFig({ show: toD ? 'radius' : 'diameter', r: `${rd} cm`, d: `${2 * rd} cm`, hl });
    const both = G.circleFig({ show: 'both', r: `${rd}`, d: `${2 * rd} cm`, hl: [toD ? 'diameter' : 'radius'] });
    return toD
      ? num(2 * rd, [St('The diameter goes across the circle through the centre, so it is two radii long.', both), St(`2 × ${rd} = ${2 * rd}.`), St(`So the diameter is ${2 * rd} cm.`)], { q: 'The radius of this circle is shown. What is its diameter, in cm?', visual: pic('radius'), expr: `2*${rd}` })
      : num(rd, [St('The radius goes from the centre to the circle: half of the diameter.', G.circleFig({ show: 'both', d: `${2 * rd} cm`, hl: 'radius' })), St(`${2 * rd} ÷ 2 = ${rd}.`), St(`So the radius is ${rd} cm.`)], { q: 'The diameter of this circle is shown. What is its radius, in cm?', visual: pic('diameter'), expr: `${2 * rd}/2` });
  }
  if (v === 6) {
    const ns = r.shuffle([3, 4, 5, 6, 7, 8]).slice(0, 4), t = r.int(0, 3), name = PNAME[ns[t]];
    const figs = ns.map((n, i) => G.polygonFig({ pts: i % 2 ? G.regular(n) : wobble(n, i), W: 150, H: 130, pad: 14 }));
    return mc(r, ABCD[t], ABCD.filter((x, i) => i !== t), { q: `Which picture shows ${art(name)} ${low(name)}?`, visual: { type: 'figs', figs, captions: ABCD },
      steps: [St(`${art(name)[0].toUpperCase() + art(name).slice(1)} ${low(name)} has ${ns[t]} sides. Count the sides of each shape: ${ns.map((n, i) => `${ABCD[i]} has ${n}`).join(', ')}.`), St(`So picture ${ABCD[t]} shows the ${low(name)}.`, figs[t])] });
  }
  const k = r.int(0, 6);
  const S = [
    { pts: G.regular(3), ticks: [1, 1, 1], angles: ['60°', '60°', '60°'], reg: true, say: 'all 3 sides are equal and all 3 angles are 60°' },
    { pts: [[0, 0], [5, 0], [5, 5], [0, 5]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], reg: true, say: 'all 4 sides are equal and all 4 angles are right angles' },
    { pts: G.regular(5), ticks: [1, 1, 1, 1, 1], angles: ['108°', '108°', '108°', '108°', '108°'], reg: true, say: 'all 5 sides are equal and all 5 angles are 108°' },
    { pts: G.regular(6), ticks: [1, 1, 1, 1, 1, 1], angles: ['120°', '', '120°', '', '120°', ''], arcs: [1, 3, 5], reg: true, say: 'all 6 sides are equal and all 6 angles are 120°' },
    { pts: [[0, 0], [5, 0], [5 + 5 * Math.cos(rad(70)), 5 * Math.sin(rad(70))], [5 * Math.cos(rad(70)), 5 * Math.sin(rad(70))]], ticks: [1, 1, 1, 1], angles: ['70°', '110°', '70°', '110°'], reg: false, say: 'the sides are all equal, but the angles are not (70° and 110°)' },
    { pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], reg: false, say: 'the angles are all equal, but the sides are not (the long sides and short sides have different ticks)' },
    { pts: [[0, 0], [6, 0], [7.5, 3], [3, 6], [-1.5, 3]], sides: ['6 cm', '3 cm', '6 cm', '6 cm', '3 cm'], reg: false, say: 'the sides are not all the same length' },
  ][k];
  const { reg, say, ...o } = S, right = reg ? 'Regular' : 'Not regular';
  return mc(r, right, ['Regular', 'Not regular'], { q: 'A regular polygon has all its sides equal and all its angles equal. Is this polygon regular? (Ticks show equal sides.)', visual: G.polygonFig(o),
    steps: [St('Check the sides, then check the angles. Both must all be equal.', G.polygonFig(o)), St(`Here ${say}.`), St(`So it is ${reg ? 'regular' : 'not regular'}.`)] });
}
export const POLYGONS_LESSON = [
  { text: 'A polygon is a closed shape with straight sides. It is named by its number of sides: 5 sides is a pentagon, 6 a hexagon, 8 an octagon.', visual: { type: 'figs', figs: [5, 6, 8].map((n) => G.polygonFig({ pts: G.regular(n), W: 150, H: 130, pad: 14 })), captions: ['Pentagon', 'Hexagon', 'Octagon'] } },
  { text: 'Triangles by sides: equilateral (3 equal), isosceles (2 equal), scalene (none equal). Ticks mark equal sides.', visual: { type: 'figs', figs: [G.polygonFig({ pts: G.regular(3), ticks: [1, 1, 1], W: 150, H: 130, pad: 18 }), G.polygonFig({ pts: [[0, 0], [4, 0], [2, 5]], ticks: [0, 1, 1], W: 150, H: 130, pad: 18 }), G.polygonFig({ pts: [[0, 0], [6, 0], [1.5, 4]], W: 150, H: 130, pad: 18 })], captions: ['Equilateral', 'Isosceles', 'Scalene'] } },
  { text: 'Triangles by angles: acute (all less than 90°), right (one 90°), obtuse (one more than 90°).', visual: { type: 'figs', figs: [G.polygonFig({ pts: triFromAngles(60, 70), arcs: [0, 1, 2], W: 150, H: 130, pad: 18 }), G.polygonFig({ pts: triFromAngles(90, 35), right: [0], W: 150, H: 130, pad: 18 }), G.polygonFig({ pts: triFromAngles(120, 25), angles: ['120°', '', ''], W: 150, H: 130, pad: 18 })], captions: ['Acute', 'Right', 'Obtuse'] } },
  { text: 'Quadrilaterals: a square has 4 equal sides and 4 right angles; a rectangle has 4 right angles; a rhombus has 4 equal sides; a parallelogram has 2 pairs of parallel sides; a trapezoid has exactly 1 pair.', visual: { type: 'figs', figs: ['Square', 'Rectangle', 'Rhombus', 'Parallelogram', 'Trapezoid'].map((k) => G.polygonFig({ ...QUADS[k], W: 150, H: 120, pad: 16 })), captions: ['Square', 'Rectangle', 'Rhombus', 'Parallelogram', 'Trapezoid'] } },
  { text: 'In a circle, the radius goes from the centre to the edge, and the diameter goes across through the centre: diameter = 2 × radius.', visual: G.circleFig({ show: 'both', r: 'radius', d: 'diameter' }) },
];

// ═════════════ 6-anglesum: angles in polygons ═════════════
export function angleSum6(r) {
  const v = r.int(0, 7);
  if (v === 0 || v === 1) {
    let A, B, C;
    if (v === 0) { A = r.int(7, 18) * 5; B = r.int(7, Math.floor((145 - A) / 5)) * 5; C = 180 - A - B; }
    else { A = 90; B = r.int(6, 12) * 5 + r.pick([0, 0, 2]); C = 90 - B; }
    const order = r.shuffle([0, 1, 2]), angs = [A, B, C], ang = order.map((i) => angs[i]), miss = order.indexOf(2);
    const pts = triFromAngles(ang[0], ang[1]);
    const labs = (show) => ang.map((x, i) => (i === miss ? (show ? `${x}°` : 'x') : x === 90 ? '' : `${x}°`));
    const rt = ang.indexOf(90) >= 0 && ang.indexOf(90) !== miss ? [ang.indexOf(90)] : [];
    const known = ang.filter((_, i) => i !== miss);
    const pic = (show, hl) => G.polygonFig({ pts, angles: labs(show), right: rt, hl });
    return num(C, [
      St('The three angles of any triangle add to 180°.', pic(false, [0, 1, 2].filter((i) => i !== miss).map((i) => ({ angle: i })))),
      St(`x = 180 − ${known[0]} − ${known[1]} = ${C}.`, pic(true, [{ angle: miss }])),
      St(`So x = ${C}°.`),
    ], { q: v === 1 ? 'This is a right triangle (the square marks the right angle). Find the angle x.' : 'Find the angle x in this triangle.', unit: 'x =', visual: pic(false), expr: `180-${known[0]}-${known[1]}` });
  }
  if (v === 2) {
    const apexGiven = r.bool(), apex = r.int(15, 50) * 2, base = (180 - apex) / 2;
    const pts = triFromAngles(base, base);
    const labs = (show) => (apexGiven ? [show ? `${base}°` : 'x', show ? `${base}°` : '', `${apex}°`] : [`${base}°`, `${base}°`, show ? `${apex}°` : 'x']);
    const pic = (show, hl) => G.polygonFig({ pts, ticks: [0, 1, 1], angles: labs(show), arcs: apexGiven && !show ? [1] : [], hl });
    return apexGiven
      ? num(base, [St('The two ticked sides are equal, so the triangle is isosceles and its two base angles are equal.', pic(false, [{ angle: 0 }, { angle: 1 }])), St(`The base angles share 180° − ${apex}° = ${180 - apex}°, so each is ${180 - apex} ÷ 2 = ${base}°.`, pic(true)), St(`So x = ${base}°.`)], { q: 'This triangle is isosceles (the ticks show equal sides). Find the angle x.', unit: 'x =', visual: pic(false), expr: `(180-${apex})/2` })
      : num(apex, [St('The two ticked sides are equal, so the two base angles are equal: both are ' + `${base}°.`, pic(false, [{ angle: 0 }, { angle: 1 }])), St(`x = 180 − ${base} − ${base} = ${apex}.`, pic(true)), St(`So x = ${apex}°.`)], { q: 'This triangle is isosceles (the ticks show equal sides). Find the angle x.', unit: 'x =', visual: pic(false), expr: `180-2*${base}` });
  }
  if (v === 3) {
    let angs, pts, guard = 0;
    do { const a = r.int(12, 28) * 5, b = r.int(12, 28) * 5, c = r.int(12, 28) * 5; angs = [a, b, c, 360 - a - b - c]; pts = angs[3] >= 50 && angs[3] <= 150 ? quadFromAngles(angs) : null; } while (!pts && guard++ < 60);
    const scale = !!pts;
    if (!pts) { angs = [80, 100, 70, 110]; pts = [[0, 0], [8, 0], [9, 5], [1, 6]]; }
    const miss = r.int(0, 3), x = angs[miss], known = angs.filter((_, i) => i !== miss);
    const labs = (show) => angs.map((a, i) => (i === miss ? (show ? `${a}°` : 'x') : `${a}°`));
    const pic = (show, hl) => G.polygonFig({ pts, angles: labs(show), hl });
    return num(x, [
      St('A diagonal splits a quadrilateral into 2 triangles, so its angles add to 2 × 180° = 360°.', G.polygonFig({ pts, angles: labs(false), diag: [[0, 2, 'aux']] })),
      St(`Add the angles you know: ${known.join(' + ')} = ${sum(known)}. x = 360 − ${sum(known)} = ${x}.`, pic(true, [{ angle: miss }])),
      St(`So x = ${x}°.`),
    ], { q: `Find the angle x in this quadrilateral.${scale ? '' : ' (The figure is not drawn to scale.)'}`, unit: 'x =', visual: pic(false), expr: `360-${known.join('-')}` });
  }
  const n = r.pick([5, 6, 8, 9, 10, 12]), nm = low(PNAME[n] ?? '12-sided polygon'), total = (n - 2) * 180;
  const cut = G.triangulated(G.regular(n));
  if (v === 4) return num(total, [St(`Draw every diagonal from one corner. They cut the ${nm} into ${n} − 2 = ${n - 2} triangles.`, cut), St(`Each triangle has 180°: ${n - 2} × 180 = ${total}.`), St(`So the angles add to ${total}°.`)], { q: `What do the interior angles of ${art(nm)} ${nm} add up to, in degrees?`, unit: '°', visual: G.polygonFig({ pts: wobble(n, 1) }), expr: `(${n}-2)*180` });
  if (v === 5) {
    const m = r.pick([5, 6, 8, 9, 10, 12]), nm2 = low(PNAME[m] ?? '12-sided polygon'), t2 = (m - 2) * 180, each = t2 / m;
    const pic = (show) => G.polygonFig({ pts: G.regular(m), ticks: Array(m).fill(1), angles: [show ? `${each}°` : '?'] });
    return num(each, [St(`The angles add to (${m} − 2) × 180 = ${t2}°.`, G.triangulated(G.regular(m))), St(`A regular ${nm2} has ${m} equal angles: ${t2} ÷ ${m} = ${each}.`, pic(true)), St(`So each angle is ${each}°.`)], { q: `This is a regular ${nm2}: all its sides and angles are equal. What is each interior angle, in degrees?`, unit: '°', visual: pic(false), expr: `(${m}-2)*180/${m}` });
  }
  if (v === 6) {
    const pic = (hl, lab) => G.polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), ext: 1, extLabel: lab, hl });
    return num(360 / n, [St('An exterior angle is the turn between one side and the next side extended. Walking once round the shape you turn through every exterior angle: 360° in all.', pic('ext', '?')), St(`A regular ${nm} has ${n} equal exterior angles: 360 ÷ ${n} = ${360 / n}.`, pic('ext', `${360 / n}°`)), St(`So each exterior angle is ${360 / n}°.`)], { q: `This regular ${nm} has one side extended. What is the exterior angle marked ?, in degrees?`, unit: '°', visual: pic(null, '?'), expr: `360/${n}` });
  }
  // a missing angle in a pentagon (not drawn to scale)
  let angs, x, guard = 0;
  do { angs = range(4).map(() => r.int(18, 30) * 5); x = 540 - sum(angs); } while ((x < 70 || x > 170) && guard++ < 200);
  if (x < 70 || x > 170) { angs = [100, 110, 105, 115]; x = 110; }
  const k = r.int(0, 4), labs = []; let j = 0;
  for (let i = 0; i < 5; i++) labs.push(i === k ? 'x' : `${angs[j++]}°`);
  const pts = wobble(5, 2);
  return num(x, [St('A pentagon splits into 3 triangles from one corner, so its angles add to 3 × 180° = 540°.', G.triangulated(pts)), St(`Add the angles you know: ${angs.join(' + ')} = ${sum(angs)}. x = 540 − ${sum(angs)} = ${x}.`, G.polygonFig({ pts, angles: labs, hl: [{ angle: k }] })), St(`So x = ${x}°.`)],
    { q: 'Find the angle x in this pentagon. (The figure is not drawn to scale.)', unit: 'x =', visual: G.polygonFig({ pts, angles: labs }), expr: `540-${sum(angs)}` });
}
export const ANGLESUM_LESSON = [
  { text: 'The angles of any triangle add to 180°. Tear off the three corners and they fit together on a straight line.', visual: G.polygonFig({ pts: triFromAngles(55, 70), angles: ['55°', '70°', '55°'] }) },
  { text: 'A quadrilateral splits into 2 triangles, so its angles add to 2 × 180° = 360°.', visual: G.triangulated([[0, 0], [8, 0], [9, 5], [2, 6]]) },
  { text: 'A polygon with n sides splits into n − 2 triangles from one corner, so its angles add to (n − 2) × 180°. A hexagon: 4 × 180° = 720°.', visual: G.triangulated(G.regular(6)) },
  { text: 'In a regular polygon every angle is the same: divide the total by the number of angles. Each exterior angle is 360° ÷ n.', visual: G.polygonFig({ pts: G.regular(6), ticks: Array(6).fill(1), angles: ['120°'], ext: 1, extLabel: '60°' }) },
];

// ═════════════ 6-symmetry: symmetry and transformations ═════════════
const regAxes = (n) => { const st = -Math.PI / 2 - Math.PI / n; return range(n).map((k) => { const t = st + (Math.PI * k) / n, u = [6.3 * Math.cos(t), 6.3 * Math.sin(t)]; return [[-u[0], -u[1]], u]; }); };
const SYM = [
  { name: 'square', pts: [[-4, -4], [4, -4], [4, 4], [-4, 4]], axes: [[[-5.6, 0], [5.6, 0]], [[0, -5.6], [0, 5.6]], [[-5.2, -5.2], [5.2, 5.2]], [[-5.2, 5.2], [5.2, -5.2]]], right: [0, 1, 2, 3], ticks: [1, 1, 1, 1] },
  { name: 'rectangle', pts: [[-5, -3], [5, -3], [5, 3], [-5, 3]], axes: [[[-6.5, 0], [6.5, 0]], [[0, -4.5], [0, 4.5]]], right: [0, 1, 2, 3], wrong: [[[-6, -3.6], [6, 3.6]]] },
  { name: 'equilateral triangle', pts: G.regular(3), axes: regAxes(3), ticks: [1, 1, 1] },
  { name: 'isosceles triangle', pts: [[-3, -3], [3, -3], [0, 5]], axes: [[[0, -4.5], [0, 6.5]]], ticks: [0, 1, 1], wrong: [[[-4.5, 0], [4.5, 0]]] },
  { name: 'scalene triangle', pts: [[-4, -3], [4, -3], [-1.5, 4]], axes: [], wrong: [[[-1.5, -4.5], [-1.5, 5.5]]] },
  { name: 'regular pentagon', pts: G.regular(5), axes: regAxes(5), ticks: Array(5).fill(1) },
  { name: 'regular hexagon', pts: G.regular(6), axes: regAxes(6), ticks: Array(6).fill(1) },
  { name: 'regular octagon', pts: G.regular(8), axes: regAxes(8), ticks: Array(8).fill(1) },
  { name: 'rhombus', pts: [[-5, 0], [0, -3], [5, 0], [0, 3]], axes: [[[-6.5, 0], [6.5, 0]], [[0, -4.5], [0, 4.5]]], ticks: [1, 1, 1, 1] },
  { name: 'parallelogram', pts: [[-5, -2.5], [2, -2.5], [5, 2.5], [-2, 2.5]], axes: [], wrong: [[[0, -4], [0, 4]], [[-6.5, 0], [6.5, 0]]] },
  { name: 'kite', pts: [[-3, 0], [0, -2.5], [6, 0], [0, 2.5]], axes: [[[-4.5, 0], [7.5, 0]]], ticks: [1, 2, 2, 1], wrong: [[[0, -4], [0, 4]]] },
  { name: 'isosceles trapezoid', pts: [[-5, -2.5], [5, -2.5], [2.5, 2.5], [-2.5, 2.5]], axes: [[[0, -4], [0, 4]]], par: [1, 0, 1, 0], wrong: [[[-6.5, 0], [6.5, 0]]] },
];
const symPic = (s, lines = [], extra = {}) => G.polygonFig({ pts: s.pts, right: s.right, ticks: s.ticks, par: s.par, cuts: lines, extra: lines.flat(), ...extra });
// asymmetric shapes for moves on a grid
const TSHAPES = [[[0, 0], [1, 0], [1, 2], [2, 2], [2, 3], [0, 3]], [[0, 0], [3, 0], [0, 2]], [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]], [[0, 0], [2, 0], [2, 1], [1, 2], [0, 2]]];
const bbox = (pts) => [Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
const mv = (pts, f) => pts.map(f);
function makeMove(r, kind, cols = 13, rows = 7) {
  const sh = r.pick(TSHAPES), [w, h] = bbox(sh);
  if (kind === 0) {
    const x0 = r.int(0, 2), y0 = r.int(0, rows - h), dx = r.int(w + 1, cols - w - x0), dy = r.int(-y0, rows - h - y0);
    return { A: mv(sh, ([x, y]) => [x + x0, y + y0]), B: mv(sh, ([x, y]) => [x + x0 + dx, y + y0 + dy]), dx, dy };
  }
  if (kind === 1) {
    const x0 = r.int(0, 2), y0 = r.int(0, rows - h), m = x0 + w + r.int(1, 2);
    return { A: mv(sh, ([x, y]) => [x + x0, y + y0]), B: mv(sh, ([x, y]) => [2 * m - x - x0, y + y0]), m };
  }
  const x0 = r.int(0, 2), y0 = r.int(0, rows - h), g = r.int(1, 3), e = r.int(-y0, rows - h - y0);
  const cx2 = 2 * x0 + 2 * w + g, cy2 = 2 * y0 + h + e;
  return { A: mv(sh, ([x, y]) => [x + x0, y + y0]), B: mv(sh, ([x, y]) => [cx2 - x - x0, cy2 - y - y0]), c: [cx2 / 2, cy2 / 2] };
}
const movePic = (M, kind, show = false, cols = 13, rows = 7) => {
  const lines = [], dots = [], notes = [{ at: [M.A[0][0] + 0.45, M.A[0][1] + 0.5], s: 'A', t: 'muted', size: 12 }, { at: [M.B[0][0] + (kind === 0 ? 0.45 : -0.45), M.B[0][1] + (kind === 2 ? -0.5 : 0.5)], s: 'B', t: 'muted', size: 12 }];
  if (show && kind === 0) { lines.push({ a: M.A[0], b: M.B[0], t: 'hlline' }); dots.push({ at: M.A[0] }, { at: M.B[0] }); }
  if (show && kind === 1) { lines.push({ a: [M.m, 0], b: [M.m, rows], t: 'aux' }); dots.push({ at: M.A[1] }, { at: M.B[1] }); }
  if (show && kind === 2) { lines.push({ a: M.A[1], b: M.B[1], t: 'aux' }); dots.push({ at: M.c, t: 'ink' }, { at: M.A[1] }, { at: M.B[1] }); }
  return gridFig({ cols, rows, shapes: [{ pts: M.A, t: 'fig' }, { pts: M.B, t: 'hl2' }], lines, dots, notes });
};
export function symmetry6(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const s = r.pick(SYM), n = s.axes.length;
    return num(n, [St('A line of symmetry folds the shape onto itself: the two halves match exactly. Try every way to fold it.'), St(n ? `The dashed lines are the folds that work: there ${n === 1 ? 'is 1' : `are ${n}`}.` : 'No fold makes the two halves match, not even across the middle or a diagonal.', symPic(s, s.axes)), St(`So ${art(s.name)} ${s.name} has ${n} line${n === 1 ? '' : 's'} of symmetry.`)],
      { q: `How many lines of symmetry does this ${s.name} have?`, visual: symPic(s), expr: String(n) });
  }
  if (v === 1) {
    const s = r.pick(SYM.filter((x) => x.wrong || x.axes.length)), useTrue = s.axes.length && (!s.wrong || r.bool()), L = useTrue ? r.pick(s.axes) : r.pick(s.wrong);
    const img = s.pts.map((p) => reflectPt(p, L[0], L[1])), right = useTrue ? 'Yes' : 'No';
    return mc(r, right, ['Yes', 'No'], { q: `Is the dashed line a line of symmetry of this ${s.name}?`, visual: symPic(s, [L]),
      steps: [St('Fold the shape along the dashed line. The highlighted outline shows where each corner lands.', symPic(s, [L], { regions: [{ pts: img, t: 'hlline' }], extra: [...L, ...img] })), St(useTrue ? 'The folded shape lands exactly on itself.' : 'The folded shape does not land on itself: the halves do not match.'), St(`So the answer is ${right.toLowerCase()}.`)] });
  }
  if (v === 2) {
    const k = r.int(0, 2), M = makeMove(r, k), right = ['Translation', 'Reflection', 'Rotation'][k];
    const why = ['Shape B is the same way round as A, just slid to a new place: a translation.', 'B is a mirror image of A: it is flipped over the dashed line. That is a reflection.', 'B is A turned half way round (180°) about the dot: every point goes through the dot to the other side. That is a rotation.'][k];
    return mc(r, right, ['Translation', 'Reflection', 'Rotation'], { q: 'Shape A was moved to shape B. Which transformation was it?', visual: movePic(M, k),
      steps: [St('A translation slides, a reflection flips over a line, and a rotation turns about a point.'), St(why, movePic(M, k, true)), St(`So it is a ${low(right)}.`)] });
  }
  if (v === 3) {
    const M = makeMove(r, 0), askX = M.dy === 0 || r.bool(0.6), ans = askX ? M.dx : Math.abs(M.dy), dir = askX ? 'right' : M.dy > 0 ? 'up' : 'down';
    return num(ans, [St('Pick one corner of A and find the same corner of B.', movePic(M, 0, true)), St(`Count the squares: the corner moves ${M.dx} right and ${Math.abs(M.dy)} ${M.dy >= 0 ? 'up' : 'down'}.`), St(`So the shape slid ${ans} units ${dir}.`)],
      { q: `Shape A slid to shape B (a translation). How many units ${dir} did it move?`, visual: movePic(M, 0), expr: String(ans) });
  }
  if (v === 4) {
    const sh = r.pick(TSHAPES), [w, h] = bbox(sh), x0 = r.int(0, 1), y0 = r.int(0, 5 - h), m = x0 + w + 1;
    const A = mv(sh, ([x, y]) => [x + x0, y + y0]), lo = 2 * m - x0 - w;
    const cands = [mv(sh, ([x, y]) => [2 * m - x - x0, y + y0]), mv(sh, ([x, y]) => [x + lo, y + y0]), mv(sh, ([x, y]) => [x + lo, h - y + y0]), mv(sh, ([x, y]) => [2 * m - x - x0, h - y + y0])];
    const order = r.shuffle([0, 1, 2, 3]), t = order.indexOf(0);
    const pic = (B, hl) => gridFig({ cols: 9, rows: 5, shapes: [{ pts: A }, { pts: B, t: hl ? 'hl' : 'hl2' }], lines: [{ a: [m, 0], b: [m, 5] }], W: 170, H: 110, pad: 8 });
    return mc(r, ABCD[t], ABCD.filter((_, i) => i !== t), { q: 'Which picture shows the reflection of the shape in the dashed mirror line?', visual: { type: 'figs', figs: order.map((i) => pic(cands[i])), captions: ABCD },
      steps: [St('In a reflection each point lands the same distance from the mirror, on the other side. The image is flipped: what was nearest the mirror stays nearest it.'), St(`Picture ${ABCD[t]} is flipped over the line. The others are slid or turned.`, pic(cands[0], true)), St(`So the answer is ${ABCD[t]}.`)] });
  }
  if (v === 5) {
    let pick, guard = 0;
    do { pick = r.shuffle(SYM).slice(0, 4); } while (new Set(pick.map((s) => s.axes.length)).size < 4 && guard++ < 100);
    if (new Set(pick.map((s) => s.axes.length)).size < 4) pick = [SYM[0], SYM[1], SYM[3], SYM[4]];
    const t = r.int(0, 3), n = pick[t].axes.length;
    return mc(r, ABCD[t], ABCD.filter((_, i) => i !== t), { q: `Which shape has exactly ${n} line${n === 1 ? '' : 's'} of symmetry?`, visual: { type: 'figs', figs: pick.map((s) => symPic(s, [], { W: 150, H: 130, pad: 18 })), captions: ABCD },
      steps: [St(`Count the lines of symmetry of each shape: ${pick.map((s, i) => `${ABCD[i]} has ${s.axes.length}`).join(', ')}.`, { type: 'figs', figs: pick.map((s) => symPic(s, s.axes, { W: 150, H: 130, pad: 18 })), captions: ABCD }), St(`So the answer is ${ABCD[t]}, the ${pick[t].name}.`)] });
  }
  const x = r.int(1, 5), y = r.int(1, 5), x2 = r.int(1, 5), y2 = x2 === x ? (y % 5) + 1 : r.int(1, 5), k = r.int(0, 2);
  const dx = r.int(1, 4), dy = r.nonzero(-3, 3);
  const map = [([a, b]) => [a + dx, b + dy], ([a, b]) => [-a, b], ([a, b]) => [-a, -b]][k], right = ['Translation', 'Reflection', 'Rotation'][k];
  const pt = (a, b) => `(${neg(a)}, ${neg(b)})`;
  const P = [x, y], Q = [x2, y2], P2 = map(P), Q2 = map(Q);
  const vis = { type: 'plane', points: [[...P, 'P'], [...Q, 'Q'], [...P2, 'P′'], [...Q2, 'Q′']], range: 9 };
  return mc(r, right, ['Translation', 'Reflection', 'Rotation'], { q: `A shape is moved so that P${pt(...P)} goes to P′${pt(...P2)} and Q${pt(...Q)} goes to Q′${pt(...Q2)}. Which transformation is it?`, visual: vis,
    steps: [St(k === 0 ? `Every point moves the same way: ${dx} right and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}.` : k === 1 ? 'Each x-coordinate changes sign and y stays the same: a flip over the y-axis.' : 'Both coordinates change sign: a half turn (180°) about the origin.', vis), St(`So it is a ${low(right)}.`)] });
}
export const SYMMETRY_LESSON = [
  { text: 'A line of symmetry folds a shape into two halves that match exactly. A rectangle has 2; its diagonals are not lines of symmetry.', visual: symPic(SYM[1], SYM[1].axes) },
  { text: 'A regular polygon has as many lines of symmetry as it has sides: a regular hexagon has 6.', visual: symPic(SYM[6], SYM[6].axes) },
  { text: 'A translation slides a shape: every point moves the same distance in the same direction.', visual: movePic({ A: TSHAPES[0].map(([x, y]) => [x + 1, y + 1]), B: TSHAPES[0].map(([x, y]) => [x + 7, y + 3]), dx: 6, dy: 2 }, 0, true) },
  { text: 'A reflection flips a shape over a mirror line: each point ends up the same distance away on the other side.', visual: movePic({ A: TSHAPES[0].map(([x, y]) => [x + 1, y + 2]), B: TSHAPES[0].map(([x, y]) => [9 - x, y + 2]), m: 5 }, 1, true) },
  { text: 'A rotation turns a shape about a point. In a half turn (180°) each point goes through the centre to the other side.', visual: movePic({ A: TSHAPES[0].map(([x, y]) => [x + 1, y + 1]), B: TSHAPES[0].map(([x, y]) => [9 - x, 5 - y]), c: [5, 3] }, 2, true) },
];

// ═════════════ 6-solids: solids, nets and views ═════════════
const PRISMN = { 3: 'triangular', 4: 'rectangular', 5: 'pentagonal', 6: 'hexagonal', 8: 'octagonal' };
const SOLIDS = {
  'Cube': (hl) => solid(box3(1, 1, 1), hl),
  'Rectangular prism': (hl) => solid(box3(1.7, 0.9, 1), hl),
  'Triangular prism': (hl) => solid(prism3([[0, 0], [1.3, 0], [0.65, 1.05]], 2), hl),
  'Pentagonal prism': (hl) => solid(prism3(G.regular(5, 0.75), 1.6), hl),
  'Hexagonal prism': (hl) => solid(prism3(G.regular(6, 0.75), 1.6), hl),
  'Square pyramid': (hl) => solid(pyr3(4, 1.6), hl),
  'Triangular pyramid': (hl) => solid(pyr3(3, 1.5), hl),
  'Hexagonal pyramid': (hl) => solid(pyr3(6, 1.5), hl),
  'Cylinder': (hl) => G.cylinderFig({ r: 1, h: 1.8, hl: hl?.curved ? 'side' : hl?.top ? 'top' : null }),
  'Cone': (hl) => G.coneFig({ r: 1, h: 2.4, hl: hl?.base ? 'base' : null }),
  'Sphere': () => G.sphereFig({}),
};
const CURVED = ['Cylinder', 'Cone', 'Sphere'];
const triPyrNet = (hl) => { const T = G.regular(3, 5), m = (i, j) => [(T[i][0] + T[j][0]) / 2, (T[i][1] + T[j][1]) / 2]; return G.polygonFig({ pts: T, regions: [{ pts: [m(0, 1), m(1, 2), m(2, 0)], t: hl ? 'hl' : 'top' }, { pts: [T[0], m(0, 1), m(2, 0)], t: 'front' }, { pts: [T[1], m(1, 2), m(0, 1)], t: 'front' }, { pts: [T[2], m(2, 0), m(1, 2)], t: 'front' }] }); };
// which cells of a 6-square arrangement land on the same face of a cube when folded (see figs.foldsToCube)
function foldClash(cells) {
  const key = (c) => c.join(','), at = new Map(cells.map((c, i) => [key(c), i])), face = new Map();
  const roll = { E: (f) => ({ U: f.W, D: f.E, E: f.U, W: f.D, N: f.N, S: f.S }), W: (f) => ({ U: f.E, D: f.W, W: f.U, E: f.D, N: f.N, S: f.S }), N: (f) => ({ U: f.S, D: f.N, N: f.U, S: f.D, E: f.E, W: f.W }), S: (f) => ({ U: f.N, D: f.S, S: f.U, N: f.D, E: f.E, W: f.W }) };
  const q = [[cells[0], { U: 'U', D: 'D', N: 'N', S: 'S', E: 'E', W: 'W' }]]; face.set(0, 'D');
  while (q.length) {
    const [[c, rr], f] = q.shift();
    for (const [dir, dc, dr] of [['E', 1, 0], ['W', -1, 0], ['N', 0, -1], ['S', 0, 1]]) { const i = at.get(key([c + dc, rr + dr])); if (i == null || face.has(i)) continue; const g = roll[dir](f); face.set(i, g.D); q.push([[c + dc, rr + dr], g]); }
  }
  for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) if (face.get(i) === face.get(j)) return [i, j];
  return [];
}
export function solids6(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const n = r.pick([3, 4, 5, 6]), prism = r.bool(), what = r.pick(['faces', 'edges', 'vertices']);
    const name = `${PRISMN[n]} ${prism ? 'prism' : 'pyramid'}`;
    const o = prism ? (n === 4 ? box3(1.7, 0.9, 1) : prism3(G.regular(n, 0.75), 1.7)) : pyr3(n, 1.6);
    const ans = prism ? { faces: n + 2, edges: 3 * n, vertices: 2 * n }[what] : { faces: n + 1, edges: 2 * n, vertices: n + 1 }[what];
    const baseFaces = prism ? (n === 4 ? [4, 5] : [0, 1]) : [0];
    const steps = what === 'faces'
      ? [St(prism ? `A prism has 2 matching bases (highlighted). Here each base has ${n} sides.` : `A pyramid has 1 base (highlighted). Here it has ${n} sides. Dashed lines are edges at the back.`, solid(o, { faces: baseFaces })), St(prism ? `Each side of the base makes one side face: ${n} side faces. 2 + ${n} = ${ans}.` : `Each side of the base makes one triangle face: ${n} triangles. 1 + ${n} = ${ans}.`, solid(o, { faces: range(o.F.length).filter((i) => !baseFaces.includes(i)) })), St(`So a ${name} has ${ans} faces.`)]
      : what === 'edges'
        ? [St('Edges are where two faces meet. Count the hidden (dashed) ones too.', solid(o, { edges: true })), St(prism ? `${n} edges round each base, plus ${n} joining them: ${n} + ${n} + ${n} = ${ans}.` : `${n} edges round the base, plus ${n} going up to the top: ${n} + ${n} = ${ans}.`), St(`So a ${name} has ${ans} edges.`)]
        : [St('Vertices are the corners, where edges meet. Count the hidden ones too.', solid(o, { verts: true })), St(prism ? `${n} corners on each base: ${n} × 2 = ${ans}.` : `${n} corners on the base, plus 1 at the top: ${n} + 1 = ${ans}.`), St(`So a ${name} has ${ans} vertices.`)];
    return num(ans, steps, { q: `This is a ${name}. How many ${what} does it have?`, visual: solid(o), expr: String(ans) });
  }
  if (v === 1) {
    const right = r.pick(Object.keys(SOLIDS));
    const wrongs = r.shuffle(Object.keys(SOLIDS).filter((x) => x !== right && !(right === 'Cube' && x === 'Rectangular prism'))).slice(0, 3);
    const say = { 'Cube': '6 square faces, all the same size', 'Rectangular prism': '6 rectangle faces; the two ends match', 'Triangular prism': 'two matching triangle bases joined by rectangles', 'Pentagonal prism': 'two matching pentagon bases joined by rectangles', 'Hexagonal prism': 'two matching hexagon bases joined by rectangles', 'Square pyramid': 'a square base and 4 triangles meeting at a point', 'Triangular pyramid': 'a triangle base and 3 more triangles meeting at a point', 'Hexagonal pyramid': 'a hexagon base and 6 triangles meeting at a point', 'Cylinder': 'two circle bases and a curved surface', 'Cone': 'one circle base and a curved surface that comes to a point', 'Sphere': 'one curved surface, like a ball' }[right];
    return mc(r, right, wrongs, { q: 'What is the name of this solid?', visual: SOLIDS[right](), steps: [St(`Look at the faces. This solid has ${say}.`, SOLIDS[right]()), St(`So it is ${art(right)} ${low(right)}.`)] });
  }
  if (v === 2) {
    const NETS = {
      'Cube': () => G.netFig({ cells: r.pick(G.CUBE_NETS) }), 'Rectangular prism': () => G.boxNet({ l: 5, w: 2, h: 3 }), 'Triangular prism': () => G.triPrismNet({}),
      'Square pyramid': () => G.pyramidNet({}), 'Triangular pyramid': () => triPyrNet(), 'Cylinder': () => G.cylinderNet({}), 'Cone': () => G.coneNet({}),
    };
    const say = { 'Cube': '6 equal squares', 'Rectangular prism': '6 rectangles in matching pairs', 'Triangular prism': '2 triangles and 3 rectangles', 'Square pyramid': '1 square and 4 triangles', 'Triangular pyramid': '4 triangles', 'Cylinder': '2 circles and a rectangle that rolls into a tube', 'Cone': 'a circle and a curved piece (a sector) that rolls into a point' };
    const right = r.pick(Object.keys(NETS)), pic = NETS[right]();
    const wrongs = r.shuffle(Object.keys(NETS).filter((x) => x !== right && !(right === 'Cube' && x === 'Rectangular prism'))).slice(0, 3);
    return mc(r, right, wrongs, { q: 'This net is folded up. Which solid does it make?', visual: pic, steps: [St(`A net shows every face, opened out flat. This one has ${say[right]}.`, pic), St(`These fold into ${art(right)} ${low(right)}.`, SOLIDS[right]())] });
  }
  if (v === 3) {
    const yes = r.bool(), cells = yes ? r.pick(G.CUBE_NETS) : r.pick(G.NOT_CUBE_NETS), right = yes ? 'Yes' : 'No';
    const clash = yes ? [] : foldClash(cells);
    return mc(r, right, ['Yes', 'No'], { q: 'Can these 6 squares be folded into a cube?', visual: G.netFig({ cells }),
      steps: [St('Pick one square to be the bottom and fold the others up around it. Each square must become a different face of the cube.'), St(yes ? 'Every square finds its own face, and all 6 faces are covered.' : clash.length ? 'The two highlighted squares would fold onto the same face, so one face of the cube is left open.' : 'Some squares would overlap, so one face of the cube is left open.', G.netFig({ cells, hl: clash })), St(`So the answer is ${right.toLowerCase()}.`)] });
  }
  if (v === 4) {
    const V4 = [
      ['Cylinder', 'top', 'Circle', ['Rectangle', 'Triangle', 'Square'], 'the flat circle on top'], ['Cylinder', 'front', 'Rectangle', ['Circle', 'Triangle', 'Pentagon'], 'the straight sides and flat ends: a rectangle'],
      ['Cone', 'top', 'Circle', ['Triangle', 'Square', 'Rectangle'], 'the round base (with the point in the middle)'], ['Cone', 'front', 'Triangle', ['Circle', 'Square', 'Rectangle'], 'the sloping sides meeting at the point'],
      ['Square pyramid', 'top', 'Square', ['Circle', 'Triangle', 'Pentagon'], 'the square base, with lines to the point in the middle'], ['Square pyramid', 'front', 'Triangle', ['Square', 'Circle', 'Rectangle'], 'one triangle face'],
      ['Cube', 'top', 'Square', ['Triangle', 'Circle', 'Pentagon'], 'one square face'], ['Rectangular prism', 'top', 'Rectangle', ['Triangle', 'Circle', 'Pentagon'], 'the rectangle on top'],
      ['Triangular prism', 'front', 'Triangle', ['Rectangle', 'Circle', 'Square'], 'the triangle at the end'], ['Sphere', 'top', 'Circle', ['Square', 'Triangle', 'Rectangle'], 'a circle, from every side'],
    ];
    const [s, side, right, wrongs, see] = r.pick(V4);
    const hlo = side === 'top' ? (s === 'Cylinder' ? { top: true } : s === 'Cone' ? { base: true } : s === 'Cube' || s === 'Rectangular prism' ? { faces: [3] } : s === 'Square pyramid' ? { faces: [0] } : null) : s === 'Triangular prism' ? { faces: [0] } : s === 'Square pyramid' ? { faces: [1] } : s === 'Cylinder' ? { curved: true } : null;
    return mc(r, right, wrongs, { q: `What shape do you see when you look at this ${low(s)} from the ${side === 'top' ? 'top (straight down)' : 'front'}?`, visual: SOLIDS[s](),
      steps: [St(`Imagine your eye ${side === 'top' ? 'straight above the solid, looking down' : 'level with the solid, looking straight at the front'}.`, SOLIDS[s](hlo)), St(`You see ${see}.`), St(`So the ${side} view is ${art(right)} ${low(right)}.`)] });
  }
  if (v === 5) {
    const curved = r.pick(CURVED), flats = r.shuffle(Object.keys(SOLIDS).filter((x) => !CURVED.includes(x))).slice(0, 3), all = r.shuffle([curved, ...flats]), t = all.indexOf(curved);
    return mc(r, ABCD[t], ABCD.filter((_, i) => i !== t), { q: 'A polyhedron has only flat faces that are polygons. Which solid is NOT a polyhedron?', visual: { type: 'figs', figs: all.map((s) => SOLIDS[s]()), captions: ABCD },
      steps: [St(`${all.filter((s) => s !== curved).map((s) => `${ABCD[all.indexOf(s)]} (${low(s)})`).join(', ')} have only flat faces with straight edges.`), St(`${ABCD[t]} is ${art(curved)} ${low(curved)}: it has a curved surface, so it is not a polyhedron.`, SOLIDS[curved]({ curved: true }))] });
  }
  const D = [['6 square faces, all the same size', 'Cube'], ['2 triangle bases and 3 rectangle faces', 'Triangular prism'], ['a square base and 4 triangle faces that meet at a point', 'Square pyramid'], ['2 circle bases and one curved surface', 'Cylinder'], ['one circle base and a curved surface that comes to a point', 'Cone'], ['one curved surface and no edges or vertices', 'Sphere'], ['2 hexagon bases and 6 rectangle faces', 'Hexagonal prism'], ['4 triangle faces', 'Triangular pyramid']];
  const [d, right] = r.pick(D);
  return mc(r, right, r.shuffle(D.map((x) => x[1]).filter((x) => x !== right)).slice(0, 3), { q: `Which solid has ${d}?`, steps: [St('Picture each solid and count its faces.'), St(`${art(right)[0].toUpperCase() + art(right).slice(1)} ${low(right)} has ${d}.`, SOLIDS[right]()), St(`So it is ${art(right)} ${low(right)}.`)] });
}
export const SOLIDS_LESSON = [
  { text: 'A polyhedron is a solid with flat faces that are polygons. Faces meet at edges; edges meet at vertices (corners). Dashed lines show edges at the back.', visual: solid(box3(1.7, 0.9, 1), { verts: true }) },
  { text: 'A prism has two matching bases joined by rectangles. It is named after its base: this is a pentagonal prism.', visual: solid(prism3(G.regular(5, 0.75), 1.6), { faces: [0, 1] }) },
  { text: 'A pyramid has one base and triangle faces that meet at a point: this is a square pyramid.', visual: solid(pyr3(4, 1.6), { faces: [0] }) },
  { text: 'Cylinders, cones and spheres have curved surfaces, so they are not polyhedra.', visual: { type: 'figs', figs: [SOLIDS.Cylinder(), SOLIDS.Cone(), SOLIDS.Sphere()], captions: ['Cylinder', 'Cone', 'Sphere'] } },
  { text: 'A net is a solid opened out flat: it shows every face. Six squares like this fold into a cube.', visual: G.netFig({ cells: G.CUBE_NETS[5] }) },
];

// ═════════════ 6-perimeter: perimeter and area of rectangles and grid shapes ═════════════
export function perimeter6(r) {
  const v = r.int(0, 7), u = r.pick(['cm', 'm']);
  if (v === 0) {
    const n = r.int(3, 6), sides = range(n).map(() => r.int(3, 15)), pts = wobble(n, r.int(0, 4)), P = sum(sides);
    const labs = sides.map((s) => `${s} ${u}`);
    return num(P, [St('Perimeter is the distance all the way round. Go round the shape and add every side.', G.polygonFig({ pts, sides: labs, hl: range(n).map((j) => ({ side: j })) })), St(`${sides.join(' + ')} = ${P}.`), St(`So the perimeter is ${P} ${u}.`)],
      { q: `What is the perimeter of this shape, in ${u}? (It is not drawn to scale.)`, visual: G.polygonFig({ pts, sides: labs }), expr: sides.join('+') });
  }
  if (v === 1) {
    const W = r.int(6, 12), H = r.int(6, 12), a = r.int(2, H - 3), c = r.int(2, W - 3), P = 2 * (W + H);
    const pts = [[0, 0], [W, 0], [W, a], [c, a], [c, H], [0, H]];
    const pic = (s) => G.polygonFig({ pts, sides: [`${W} m`, `${a} m`, s === 'x' || s === 'all' ? `${W - c} m` : 'x', s === 'y' || s === 'all' ? `${H - a} m` : 'y', `${c} m`, `${H} m`], right: [0, 1, 2, 4, 5], hl: s === 'x' ? [{ side: 2 }, { side: 0 }, { side: 4 }] : s === 'y' ? [{ side: 3 }, { side: 5 }, { side: 1 }] : null });
    return num(P, [St(`Find the missing sides first. Across: the bottom (${W} m) equals the top (${c} m) plus x, so x = ${W} − ${c} = ${W - c} m.`, pic('x')), St(`Up: the left side (${H} m) equals ${a} m plus y, so y = ${H} − ${a} = ${H - a} m.`, pic('y')), St(`Add all six sides: ${W} + ${a} + ${W - c} + ${H - a} + ${c} + ${H} = ${P}.`, pic('all')), St(`So the perimeter is ${P} m.`)],
      { q: 'What is the perimeter of this shape, in m? (All corners are right angles.)', visual: pic(''), expr: `2*(${W}+${H})` });
  }
  if (v === 2) {
    const w = r.int(2, 8), h = r.int(2, 6), area = r.bool(), cols = w + 2, rows = h + 2, R = [[1, 1], [1 + w, 1], [1 + w, 1 + h], [1, 1 + h]];
    const pic = (show) => gridFig({ cols, rows, shapes: [{ pts: R, t: show && area ? 'hl' : 'fig' }], notes: show ? [{ at: [1 + w / 2, 0.45], s: `${w}`, t: 'hl' }, { at: [0.45, 1 + h / 2], s: `${h}`, t: 'hl' }] : [] });
    return num(area ? w * h : 2 * (w + h), area
      ? [St(`Each square is 1 square unit. The rectangle is ${w} squares across and ${h} rows up.`, pic(true)), St(`${h} rows of ${w}: ${w} × ${h} = ${w * h}.`), St(`So the area is ${w * h} square units.`)]
      : [St(`Count the unit lengths along each side: ${w} across and ${h} up.`, pic(true)), St(`${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}.`), St(`So the perimeter is ${2 * (w + h)} units.`)],
    { q: `Each square on the grid is 1 unit long. What is the ${area ? 'area, in square units,' : 'perimeter, in units,'} of the rectangle?`, visual: pic(false), expr: area ? `${w}*${h}` : `2*(${w}+${h})` });
  }
  if (v === 3) {
    const l = r.int(4, 15), w = r.int(2, Math.min(12, l)), [L, Wd] = disp(l, w);
    const pic = (show, hl) => G.polygonFig({ pts: [[0, 0], [L, 0], [L, Wd], [0, Wd]], sides: [`${l} m`, show ? `${w} m` : '?', '', ''], right: [0, 1, 2, 3], notes: [{ at: [L / 2, Wd / 2], s: `${l * w} m²`, t: 'hl' }], hl });
    return num(2 * (l + w), [St(`Area = length × width, so the width is ${l * w} ÷ ${l} = ${w} m.`, pic(true, [{ side: 1 }])), St(`Perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)}.`), St(`So the perimeter is ${2 * (l + w)} m.`)],
      { q: `This rectangle has an area of ${l * w} m² and a length of ${l} m. What is its perimeter, in m?`, visual: pic(false), expr: `2*(${l}+${l * w}/${l})` });
  }
  if (v === 4) {
    const P = r.int(8, 15) * 2, half = P / 2, a1 = r.int(1, Math.floor(half / 2) - 2), a2 = Math.floor(half / 2), ask = r.bool();
    const rect = (a, b) => { const [Bx, Ay] = disp(b, a); return G.polygonFig({ pts: [[0, 0], [Bx, 0], [Bx, Ay], [0, Ay]], sides: [`${b} m`, `${a} m`, '', ''], right: [0, 1, 2, 3], W: 160, H: 130, pad: 24 }); };
    const flip = r.bool(), A = flip ? [a2, half - a2] : [a1, half - a1], B = flip ? [a1, half - a1] : [a2, half - a2];
    const bigger = A[0] * A[1] > B[0] * B[1] ? 'A' : 'B', right = ask ? bigger : bigger === 'A' ? 'B' : 'A';
    return mc(r, right, ['A', 'B'], { q: `Both rectangles have a perimeter of ${P} m. Which one has the ${ask ? 'greater' : 'smaller'} area?`, visual: { type: 'figs', figs: [rect(...A), rect(...B)], captions: ['A', 'B'] },
      steps: [St(`A: ${A[0]} × ${A[1]} = ${A[0] * A[1]} m². B: ${B[0]} × ${B[1]} = ${B[0] * B[1]} m².`), St(`With the same perimeter, the shape closer to a square has more area. So the answer is ${right}.`)] });
  }
  if (v === 5) {
    const n = r.pick([3, 4, 5, 6, 8]), s = r.int(2, 15), nm = low(PNAME[n] === 'Quadrilateral' ? 'square' : PNAME[n]);
    const pic = (hl) => G.polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), sides: [`${s} ${u}`], hl });
    return num(n * s, [St(`The ticks show that all ${n} sides are equal, so each side is ${s} ${u}.`, pic(range(n).map((j) => ({ side: j })))), St(`${n} × ${s} = ${n * s}.`), St(`So the perimeter is ${n * s} ${u}.`)],
      { q: `This ${n === 4 ? "" : "regular "}${nm} has sides of ${s} ${u}. What is its perimeter, in ${u}?`, visual: pic(null), expr: `${n}*${s}` });
  }
  if (v === 6) {
    const n = r.int(3, 5), sides = range(n).map(() => r.int(3, 14)), k = r.int(0, n - 1), P = sum(sides), pts = wobble(n, 3);
    const labs = (show) => sides.map((s, i) => (i === k && !show ? '?' : `${s} cm`));
    const others = sides.filter((_, i) => i !== k);
    return num(sides[k], [St(`The perimeter is all the sides added: ${others.join(' + ')} + ? = ${P}.`), St(`The known sides make ${sum(others)}. ? = ${P} − ${sum(others)} = ${sides[k]}.`, G.polygonFig({ pts, sides: labs(true), hl: [{ side: k }] })), St(`So the missing side is ${sides[k]} cm.`)],
      { q: `The perimeter of this shape is ${P} cm. How long is the side marked ?, in cm? (It is not drawn to scale.)`, visual: G.polygonFig({ pts, sides: labs(false) }), expr: `${P}-${sum(others)}` });
  }
  // a compound shape on a grid: count squares (area) or unit lengths (perimeter)
  const W = r.int(4, 7), H = r.int(3, 5), a = r.int(1, H - 1), c = r.int(1, W - 1), area = r.bool();
  const pts = [[1, 1], [1 + W, 1], [1 + W, 1 + a], [1 + c, 1 + a], [1 + c, 1 + H], [1, 1 + H]];
  const A = W * a + c * (H - a), P = 2 * (W + H);
  const pic = (show) => gridFig({ cols: W + 2, rows: H + 2, shapes: show && area ? [{ pts: [[1, 1], [1 + W, 1], [1 + W, 1 + a], [1, 1 + a]], t: 'hl', label: `${W * a}`, lt: 'hl' }, { pts: [[1, 1 + a], [1 + c, 1 + a], [1 + c, 1 + H], [1, 1 + H]], t: 'hl2', label: `${c * (H - a)}`, lt: 'hl2' }] : [{ pts, t: show ? 'hl' : 'fig' }] });
  return num(area ? A : P, area
    ? [St(`Split the shape into two rectangles: ${W} × ${a} = ${W * a} squares and ${c} × ${H - a} = ${c * (H - a)} squares.`, pic(true)), St(`${W * a} + ${c * (H - a)} = ${A}.`), St(`So the area is ${A} square units.`)]
    : [St('Walk round the edge and count every unit length.', pic(true)), St(`${W} + ${a} + ${W - c} + ${H - a} + ${c} + ${H} = ${P}.`), St(`So the perimeter is ${P} units.`)],
  { q: `Each square on the grid is 1 unit long. What is the ${area ? 'area, in square units,' : 'perimeter, in units,'} of the shape?`, visual: pic(false), expr: area ? `${W}*${a}+${c}*${H - a}` : `2*(${W}+${H})` });
}
export const PERIMETER_LESSON = [
  { text: 'Perimeter is the distance all the way round a shape: add the lengths of all its sides.', visual: G.polygonFig({ pts: [[0, 0], [7, 0], [8, 4], [2, 5]], sides: ['7 cm', '4 cm', '6 cm', '5 cm'], hl: [{ side: 0 }, { side: 1 }, { side: 2 }, { side: 3 }] }) },
  { text: 'Area is the space inside, measured in squares. A rectangle 5 squares across and 3 rows up has 3 × 5 = 15 squares.', visual: gridFig({ cols: 7, rows: 5, shapes: [{ pts: [[1, 1], [6, 1], [6, 4], [1, 4]], t: 'hl' }], notes: [{ at: [3.5, 0.45], s: '5', t: 'hl' }, { at: [0.45, 2.5], s: '3', t: 'hl' }] }) },
  { text: 'Rectangle: area = length × width, perimeter = 2 × (length + width).', visual: G.polygonFig({ pts: [[0, 0], [8, 0], [8, 4], [0, 4]], sides: ['8 m', '4 m', '', ''], right: [0, 1, 2, 3], notes: [{ at: [4, 2], s: 'A = 32 m²', t: 'hl' }] }) },
  { text: 'For a shape with only right angles, find the missing sides first: the opposite sides together must be the same length.', visual: G.polygonFig({ pts: [[0, 0], [9, 0], [9, 3], [4, 3], [4, 7], [0, 7]], sides: ['9 m', '3 m', '5 m', '4 m', '4 m', '7 m'], right: [0, 1, 2, 4, 5], hl: [{ side: 2 }, { side: 3 }] }) },
];

// ═════════════ 6-areaquad: parallelograms, trapezoids and rhombuses ═════════════
export function areaQuad6(r) {
  const v = r.int(0, 5), u = r.pick(['cm', 'm']);
  if (v === 0 || v === 3) {
    const b = r.int(4, 16), h = r.int(3, 10), off = r.int(2, 5), s = R1(Math.hypot(off, h)), [B, H] = disp(b, h), O = (off / b) * B;
    const pts = [[0, 0], [B, 0], [B + O, H], [O, H]];
    if (v === 3) {
      const pic = (show, hl) => G.polygonFig({ pts, sides: [`${b} ${u}`, '', '', ''], base: 0, par: [1, 2, 1, 2], height: { from: 3, side: 0, label: show ? `${h} ${u}` : 'h' }, notes: [{ at: [(B + O) * 0.64, H * 0.32], s: `${b * h} ${u}²`, t: 'hl2' }], hl });
      return num(h, [St(`Area = base × height, so ${b} × h = ${b * h}.`, pic(false, ['base'])), St(`h = ${b * h} ÷ ${b} = ${h}.`, pic(true, ['height'])), St(`So the height is ${h} ${u}.`)],
        { q: `This parallelogram has an area of ${b * h} ${u}² and a base of ${b} ${u}. What is its height h, in ${u}?`, visual: pic(false), expr: `${b * h}/${b}` });
    }
    const pic = (hl) => G.polygonFig({ pts, sides: [`${b} ${u}`, `${dec(s)} ${u}`, '', ''], base: 0, par: [1, 2, 1, 2], height: { from: 3, side: 0, label: `${h} ${u}` }, hl });
    const cut = G.polygonFig({ pts, regions: [{ pts: [[0, 0], [O, 0], [O, H]], t: 'hl' }, { pts: [[B, 0], [B + O, 0], [B + O, H]], t: 'hl' }], extra: [[B + O, 0]], cuts: [[[O, 0], [O, H]], [[B, 0], [B + O, 0]]] });
    return num(b * h, [
      St('Cut the triangle off one end and slide it to the other end: the parallelogram becomes a rectangle with the same base and height.', cut),
      St(`So A = base × height. Use the height at right angles to the base (${h} ${u}), not the slanted side (${dec(s)} ${u}): ${b} × ${h} = ${b * h}.`, pic(['base', 'height'])),
      St(`So the area is ${b * h} ${u}².`),
    ], { q: `What is the area of this parallelogram, in ${u}²?`, visual: pic(), expr: `${b}*${h}` });
  }
  if (v === 1 || v === 5) {
    const b = r.int(8, 18), a = r.int(3, b - 2), h = r.int(3, 10) * (v === 5 ? 2 : 1) / (v === 5 ? 2 : 1), A = ((a + b) * h) / 2, [B, H] = disp(b, h), L = ((b - a) / b) * B * r.pick([0.3, 0.5, 0.7]);
    const pts = [[0, 0], [B, 0], [L + (a / b) * B, H], [L, H]];
    if (v === 5) {
      const pic = (show, hl) => G.polygonFig({ pts, sides: [`${b} ${u}`, '', show ? `${a} ${u}` : '?', ''], height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 0, 1, 0], notes: [{ at: [B * 0.62, H * 0.32], s: `${dec(A)} ${u}²`, t: 'hl2' }], hl });
      return num(a, [St(`A = (a + b) × h ÷ 2, so a + b = 2 × A ÷ h = 2 × ${dec(A)} ÷ ${h} = ${a + b}.`, pic(false, ['height'])), St(`The missing side is ${a + b} − ${b} = ${a}.`, pic(true, [{ side: 2 }])), St(`So the side marked ? is ${a} ${u}.`)],
        { q: `This trapezoid has an area of ${dec(A)} ${u}². What is the length of the side marked ?, in ${u}?`, visual: pic(false), expr: `2*${A}/${h}-${b}` });
    }
    const pic = (hl) => G.polygonFig({ pts, sides: [`${b} ${u}`, '', `${a} ${u}`, ''], height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 0, 1, 0], hl });
    return num(dec(A), [
      St(`The two parallel sides (the arrows) are ${a} ${u} and ${b} ${u}. Add them: ${a} + ${b} = ${a + b}.`, pic([{ side: 0 }, { side: 2 }])),
      St(`Two copies of the trapezoid make a parallelogram with base ${a + b}, so take half: A = (${a} + ${b}) × ${h} ÷ 2 = ${dec(A)}.`, pic(['height'])),
      St(`So the area is ${dec(A)} ${u}².`),
    ], { q: `What is the area of this trapezoid, in ${u}²?`, visual: pic(), expr: `(${a}+${b})*${h}/2` });
  }
  if (v === 2) {
    const p = r.int(2, 9) * 2, q = r.int(2, 9) * 2, A = (p * q) / 2, [P2, Q2] = disp(p, q);
    const pts = [[0, Q2 / 2], [P2 / 2, 0], [P2, Q2 / 2], [P2 / 2, Q2]];
    const pic = (hl, box) => G.polygonFig({ pts, ticks: [1, 1, 1, 1], diag: [[0, 2, hl ? 'hlline' : 'aux'], [1, 3, hl ? 'hlline' : 'aux']], regions: box ? [{ pts: [[0, 0], [P2, 0], [P2, Q2], [0, Q2]], t: 'hl2' }, { pts, t: 'hl' }] : [], extra: [[0, 0], [P2, Q2]], notes: [{ at: [P2 * 0.27, Q2 / 2 + Q2 * 0.07], s: `${p} ${u}` }, { at: [P2 / 2 + P2 * 0.09, Q2 * 0.75], s: `${q} ${u}` }] });
    return num(A, [
      St(`Draw a rectangle round the rhombus: it is ${p} by ${q}, the lengths of the two diagonals.`, pic(false, true)),
      St(`The rhombus fills exactly half of that rectangle, so A = ${p} × ${q} ÷ 2 = ${A}.`, pic(true)),
      St(`So the area is ${A} ${u}².`),
    ], { q: `The diagonals of this rhombus are ${p} ${u} and ${q} ${u}. What is its area, in ${u}²?`, visual: pic(false), expr: `${p}*${q}/2` });
  }
  // a parallelogram on a grid
  const b = r.int(3, 7), h = r.int(2, 5), s = r.int(1, 3), cols = b + s + 2, rows = h + 2;
  const pts = [[1, 1], [1 + b, 1], [1 + b + s, 1 + h], [1 + s, 1 + h]];
  const pic = (show) => gridFig({ cols, rows, shapes: [{ pts, t: 'fig' }], lines: show ? [{ a: [1, 1], b: [1 + b, 1], t: 'hlline' }, { a: [1 + s, 1], b: [1 + s, 1 + h], t: 'hlline' }] : [], notes: show ? [{ at: [1 + b / 2, 0.45], s: `${b}`, t: 'hl' }, { at: [1 + s + 0.4, 1 + h / 2], s: `${h}`, t: 'hl' }] : [] });
  return num(b * h, [St(`Count along the bottom: the base is ${b} units. Count straight up (not along the slanted side): the height is ${h} units.`, pic(true)), St(`A = base × height = ${b} × ${h} = ${b * h}.`), St(`So the area is ${b * h} square units.`)],
    { q: 'Each square is 1 unit long. What is the area of the parallelogram, in square units?', visual: pic(false), expr: `${b}*${h}` });
}
export const AREAQUAD_LESSON = [
  { text: 'A parallelogram can be cut and rearranged into a rectangle, so A = base × height. The height is at right angles to the base, not the slanted side.', visual: G.polygonFig({ pts: [[0, 0], [7, 0], [9, 4], [2, 4]], sides: ['7 cm', '', '', ''], par: [1, 2, 1, 2], height: { from: 3, side: 0, label: '4 cm' }, hl: ['height'] }) },
  { text: 'A trapezoid has two parallel sides a and b. A = (a + b) × h ÷ 2.', visual: G.polygonFig({ pts: [[0, 0], [9, 0], [6.5, 4], [2, 4]], sides: ['b', '', 'a', ''], par: [1, 0, 1, 0], height: { from: 3, side: 0, label: 'h' } }) },
  { text: 'A rhombus fills half of the rectangle drawn round its diagonals: A = d₁ × d₂ ÷ 2.', visual: G.polygonFig({ pts: [[0, 3], [4, 0], [8, 3], [4, 6]], ticks: [1, 1, 1, 1], diag: [[0, 2, 'hlline'], [1, 3, 'hlline']], regions: [{ pts: [[0, 0], [8, 0], [8, 6], [0, 6]], t: 'hl2' }, { pts: [[0, 3], [4, 0], [8, 3], [4, 6]], t: 'hl' }] }) },
];

// ═════════════ 6-tri: area of a triangle ═════════════
export function tri6(r) {
  const v = r.int(0, 6), u = r.pick(['cm', 'm']);
  if (v <= 1 || v === 3 || v === 4) {
    const b = r.int(4, 18), h = r.int(3, 14), obtuse = v === 1, A = (b * h) / 2, [B, H] = disp(b, h), apex = obtuse ? B * 1.35 : B * (0.2 + r.next() * 0.35);
    const pic = (hl, hb, hh) => G.polygonFig({ pts: [[0, 0], [B, 0], [apex, H]], sides: [hb ? 'b' : `${b} ${u}`, '', ''], base: 0, height: { from: 2, side: 0, label: hh ? 'h' : `${h} ${u}` }, hl });
    const half = G.polygonFig({ pts: [[0, 0], [B, 0], [apex, H]], regions: [{ pts: obtuse ? [[0, 0], [B, 0], [B + (apex - B), H], [apex - B, H]] : [[0, 0], [B, 0], [B, H], [0, H]], t: 'hl2' }, { pts: [[0, 0], [B, 0], [apex, H]], t: 'hl' }], extra: [[0, H], [apex - B, H]] });
    if (v === 3) return num(h, [St(`A = base × height ÷ 2, so base × height = 2 × ${dec(A)} = ${b * h}.`, pic(['base'], false, true)), St(`h = ${b * h} ÷ ${b} = ${h}.`, pic(['height'], false, true)), St(`So the height is ${h} ${u}.`)], { q: `This triangle has an area of ${dec(A)} ${u}² and a base of ${b} ${u}. What is its height h, in ${u}?`, visual: pic(null, false, true), expr: `2*${A}/${b}` });
    if (v === 4) return num(b, [St(`A = base × height ÷ 2, so base × height = 2 × ${dec(A)} = ${b * h}.`, pic(['height'], true, false)), St(`b = ${b * h} ÷ ${h} = ${b}.`, pic(['base'], true, false)), St(`So the base is ${b} ${u}.`)], { q: `This triangle has an area of ${dec(A)} ${u}² and a height of ${h} ${u}. What is its base b, in ${u}?`, visual: pic(null, true, false), expr: `2*${A}/${h}` });
    return num(dec(A), [
      St(`A triangle is half of a ${obtuse ? 'parallelogram' : 'rectangle'} with the same base and height.`, half),
      St(`The height is the dashed line at right angles to the base${obtuse ? ', here outside the triangle' : ''}: ${h} ${u}. A = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = ${dec(A)}.`, pic(['base', 'height'])),
      St(`So the area is ${dec(A)} ${u}².`),
    ], { q: `What is the area of this triangle, in ${u}²?`, visual: pic(), expr: `${b}*${h}/2` });
  }
  if (v === 2) {
    const [p, q, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 6, 10], [12, 5, 13], [12, 9, 15], [8, 15, 17]]), A = (p * q) / 2, [B, H] = disp(p, q);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [0, H]], sides: [`${p} ${u}`, `${c} ${u}`, `${q} ${u}`], right: [0], hl });
    return num(A, [St('In a right triangle the two sides at the right angle are a base and a height. The longest side is not the height.', pic([{ side: 0 }, { side: 2 }])), St(`A = ${p} × ${q} ÷ 2 = ${p * q} ÷ 2 = ${A}.`), St(`So the area is ${A} ${u}².`)],
      { q: `What is the area of this right triangle, in ${u}²?`, visual: pic(), expr: `${p}*${q}/2` });
  }
  if (v === 5) {
    const b = r.int(3, 7), h = r.int(3, 6), k = r.int(0, b + 1), A = (b * h) / 2, cols = Math.max(b, k) + 2, rows = h + 2, pts = [[1, 1], [1 + b, 1], [1 + k, 1 + h]];
    const pic = (show) => gridFig({ cols, rows, shapes: [{ pts, t: 'fig' }], lines: show ? [{ a: [1, 1], b: [1 + b, 1], t: 'hlline' }, { a: [1 + k, 1], b: [1 + k, 1 + h], t: 'aux' }] : [], notes: show ? [{ at: [1 + b / 2, 0.45], s: `${b}`, t: 'hl' }, { at: [1 + k + 0.4, 1 + h / 2], s: `${h}`, t: 'hl' }] : [] });
    return num(dec(A), [St(`Count the base along the bottom: ${b} units. Count the height straight up from the base to the top corner: ${h} units.`, pic(true)), St(`A = ${b} × ${h} ÷ 2 = ${dec(A)}.`), St(`So the area is ${dec(A)} square units.`)],
      { q: 'Each square is 1 unit long. What is the area of the triangle, in square units?', visual: pic(false), expr: `${b}*${h}/2` });
  }
  const L = r.int(4, 14), W = r.int(3, 10), [Lx, Wy] = disp(L, W), top = Lx * (0.2 + r.next() * 0.6);
  const pic = (hl) => G.polygonFig({ pts: [[0, 0], [Lx, 0], [Lx, Wy], [0, Wy]], sides: [`${L} ${u}`, `${W} ${u}`, '', ''], right: [0, 1, 2, 3], regions: [{ pts: [[0, 0], [Lx, 0], [top, Wy]], t: hl ? 'hl' : 'shade' }] });
  return num(dec((L * W) / 2), [St(`The triangle has the same base (${L} ${u}) and height (${W} ${u}) as the rectangle.`, pic(true)), St(`So its area is half of the rectangle: ${L} × ${W} ÷ 2 = ${dec((L * W) / 2)}.`), St(`So the shaded area is ${dec((L * W) / 2)} ${u}².`)],
    { q: `What is the area of the shaded triangle inside this rectangle, in ${u}²?`, visual: pic(false), expr: `${L}*${W}/2` });
}
export const TRI_LESSON = [
  { text: 'A triangle is half of a rectangle with the same base and height.', visual: G.polygonFig({ pts: [[0, 0], [8, 0], [8, 5], [0, 5]], right: [0, 1, 2, 3], regions: [{ pts: [[0, 0], [8, 0], [3, 5]], t: 'hl' }] }) },
  { text: 'So the area of a triangle = base × height ÷ 2. The height is the dashed line at right angles to the base.', visual: G.polygonFig({ pts: [[0, 0], [8, 0], [2.5, 5]], sides: ['8 cm', '', ''], base: 0, height: { from: 2, side: 0, label: '5 cm' }, hl: ['base', 'height'] }) },
  { text: 'In an obtuse triangle the height can fall outside the triangle: extend the base to meet it.', visual: G.polygonFig({ pts: [[0, 0], [5, 0], [8, 4]], sides: ['5 m', '', ''], height: { from: 2, side: 0, label: '4 m' }, hl: ['height'] }) },
];

// ═════════════ 6-areacomp: compound shapes ═════════════
export function areaComp6(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const W = r.int(6, 12), H = r.int(6, 12), a = r.int(2, H - 3), c = r.int(2, W - 3), A1 = W * a, A2 = c * (H - a), A = A1 + A2;
    const pts = [[0, 0], [W, 0], [W, a], [c, a], [c, H], [0, H]], base = { pts, sides: [`${W} m`, `${a} m`, '', '', `${c} m`, `${H} m`], right: [0, 1, 2, 4, 5] };
    return num(A, [
      St(`Draw a line across to split the shape into two rectangles. The top one is ${H} − ${a} = ${H - a} m tall.`, G.polygonFig({ ...base, cuts: [[[0, a], [c, a]]] })),
      St(`Bottom: ${W} × ${a} = ${A1} m². Top: ${c} × ${H - a} = ${A2} m².`, G.polygonFig({ ...base, regions: [{ pts: [[0, 0], [W, 0], [W, a], [0, a]], t: 'hl', label: `${A1}` }, { pts: [[0, a], [c, a], [c, H], [0, H]], t: 'hl2', label: `${A2}` }], cuts: [[[0, a], [c, a]]] })),
      St(`Add them: ${A1} + ${A2} = ${A}.`),
      St(`So the area is ${A} m².`),
    ], { q: 'What is the area of this shape, in m²? (All corners are right angles.)', visual: G.polygonFig(base), expr: `${W}*${a}+${c}*(${H}-${a})` });
  }
  if (v === 1 || v === 2) {
    const frame = v === 1;
    const w = frame ? r.int(4, 12) : r.int(1, 3), h = frame ? r.int(4, 10) : r.int(1, 2), W = frame ? w + 2 * r.int(1, 3) : r.int(5, 10), H = frame ? h + 2 * ((W - w) / 2) : r.int(3, 4);
    const x0 = (W - w) / 2, y0 = (H - h) / 2;
    const u = frame ? 'cm' : 'm';
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [W, 0], [W, H], [0, H]], holes: [[[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]]], shade: true, sides: [`${W} ${u}`, `${H} ${u}`, '', ''], notes: [{ at: [x0 + w / 2, y0 + h / 2], s: `${w} × ${h}`, t: hl === 'in' ? 'hl' : 'ink' }] });
    const what = frame ? ['frame', 'photo'] : ['wall', 'window'];
    return num(W * H - w * h, [
      St(`Find the area of the whole ${what[0]} first: ${W} × ${H} = ${W * H} ${u}².`, pic('out')),
      St(`Take away the ${what[1]}: ${w} × ${h} = ${w * h} ${u}². ${W * H} − ${w * h} = ${W * H - w * h}.`, pic('in')),
      St(`So the ${frame ? 'frame' : 'wall to paint'} is ${W * H - w * h} ${u}².`),
    ], { q: frame ? `A ${w} cm by ${h} cm photo sits in a ${W} cm by ${H} cm frame. What is the area of the frame around the photo (shaded), in cm²?` : `A wall ${W} m long and ${H} m high has a ${w} m by ${h} m window. How many square metres of wall (shaded) need paint?`, visual: pic(), expr: `${W}*${H}-${w}*${h}` });
  }
  if (v === 3) {
    const W = r.int(8, 14), H = r.int(5, 10), n = r.int(2, W - 4), d = r.int(2, H - 2), x0 = r.int(1, W - n - 1);
    const pts = [[0, 0], [W, 0], [W, H], [x0 + n, H], [x0 + n, H - d], [x0, H - d], [x0, H], [0, H]];
    const base = { pts, sides: [`${W} m`, `${H} m`, '', `${d} m`, `${n} m`, '', '', ''], right: [0, 1, 2, 7] };
    return num(W * H - n * d, [
      St(`Fill in the gap to make a whole rectangle: ${W} × ${H} = ${W * H} m².`, G.polygonFig({ ...base, extra: [[x0, H], [x0 + n, H]], cuts: [[[x0, H], [x0 + n, H]]] })),
      St(`The gap is ${n} × ${d} = ${n * d} m². Take it away: ${W * H} − ${n * d} = ${W * H - n * d}.`, G.polygonFig({ ...base, regions: [{ pts: [[x0, H - d], [x0 + n, H - d], [x0 + n, H], [x0, H]], t: 'hl' }], extra: [[x0, H]] })),
      St(`So the area is ${W * H - n * d} m².`),
    ], { q: 'What is the area of this shape, in m²? (All corners are right angles.)', visual: G.polygonFig(base), expr: `${W}*${H}-${n}*${d}` });
  }
  if (v === 4) {
    const W = r.int(3, 8) * 2, h1 = r.int(3, 8), h2 = r.int(2, 6), R = W * h1, T = (W * h2) / 2;
    const pts = [[0, 0], [W, 0], [W, h1], [W / 2, h1 + h2], [0, h1]];
    const pic = (hl) => G.polygonFig({ pts, sides: [`${W} m`, `${h1} m`, '', '', ''], right: [0, 1], cuts: [[[0, h1], [W, h1]], [[W / 2, h1], [W / 2, h1 + h2]]], notes: [{ at: [W * 0.58, h1 + h2 * 0.4], s: `${h2} m`, t: 'ink' }], regions: hl ? [{ pts: [[0, 0], [W, 0], [W, h1], [0, h1]], t: 'hl', label: `${R}` }, { pts: [[0, h1], [W, h1], [W / 2, h1 + h2]], t: 'hl2' }] : [] });
    return num(dec(R + T), [
      St(`Split the shape into a rectangle and a triangle (the roof). Rectangle: ${W} × ${h1} = ${R} m².`, pic(true)),
      St(`Triangle: base ${W} m, height ${h2} m. ${W} × ${h2} ÷ 2 = ${dec(T)} m².`),
      St(`Add them: ${R} + ${dec(T)} = ${dec(R + T)}.`),
      St(`So the area is ${dec(R + T)} m².`),
    ], { q: 'This house shape is a rectangle with a triangle on top. What is its area, in m²?', visual: pic(false), expr: `${W}*${h1}+${W}*${h2}/2` });
  }
  if (v === 5) {
    const L = r.int(5, 14), W = r.int(3, 9), p = r.int(1, 2), OL = L + 2 * p, OW = W + 2 * p;
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [OL, 0], [OL, OW], [0, OW]], holes: [[[p, p], [p + L, p], [p + L, p + W], [p, p + W]]], shade: true, notes: [{ at: [p + L / 2, p + W / 2], s: `garden ${L} × ${W}` }, { at: [OL / 2, p / 2], s: `${p} m`, t: 'hl' }], sides: hl ? [`${OL} m`, `${OW} m`, '', ''] : [] });
    return num(OL * OW - L * W, [
      St(`The path adds ${p} m on every side. Outside: ${L} + ${p} + ${p} = ${OL} m long and ${W} + ${p} + ${p} = ${OW} m wide.`, pic(true)),
      St(`Outside area: ${OL} × ${OW} = ${OL * OW} m². Garden: ${L} × ${W} = ${L * W} m². Path: ${OL * OW} − ${L * W} = ${OL * OW - L * W}.`),
      St(`So the path covers ${OL * OW - L * W} m².`),
    ], { q: `A ${L} m by ${W} m garden has a path ${p} m wide all the way round it (shaded). What is the area of the path, in m²?`, visual: pic(false), expr: `(${L}+2*${p})*(${W}+2*${p})-${L}*${W}` });
  }
  const W = r.int(7, 14), H = r.int(5, 10), a = r.int(2, W - 3), b = r.int(2, H - 2) - (r.bool() ? 0 : 0);
  const pts = [[0, 0], [W, 0], [W, H - b], [W - a, H], [0, H]], cut = (a * b) / 2;
  const base = { pts, sides: [`${W} cm`, `${H - b} cm`, '', `${W - a} cm`, `${H} cm`], right: [0, 1, 4], extra: [[W, H]] };
  return num(dec(W * H - cut), [
    St(`Complete the rectangle: ${W} × ${H} = ${W * H} cm². The missing corner is a right triangle.`, G.polygonFig({ ...base, cuts: [[[W, H - b], [W, H]], [[W, H], [W - a, H]]] })),
    St(`Its sides are ${W} − ${W - a} = ${a} cm and ${H} − ${H - b} = ${b} cm, so its area is ${a} × ${b} ÷ 2 = ${dec(cut)} cm².`, G.polygonFig({ ...base, regions: [{ pts: [[W, H - b], [W, H], [W - a, H]], t: 'hl' }] })),
    St(`${W * H} − ${dec(cut)} = ${dec(W * H - cut)}.`),
    St(`So the area is ${dec(W * H - cut)} cm².`),
  ], { q: 'A corner was cut off a rectangle to make this shape. What is its area, in cm²?', visual: G.polygonFig(base), expr: `${W}*${H}-${a}*${b}/2` });
}
export const AREACOMP_LESSON = [
  { text: 'To find the area of a compound shape, split it into rectangles, find each area, then add.', visual: G.polygonFig({ pts: [[0, 0], [9, 0], [9, 3], [4, 3], [4, 7], [0, 7]], sides: ['9 m', '3 m', '', '', '4 m', '7 m'], right: [0, 1, 2, 4, 5], regions: [{ pts: [[0, 0], [9, 0], [9, 3], [0, 3]], t: 'hl', label: '27' }, { pts: [[0, 3], [4, 3], [4, 7], [0, 7]], t: 'hl2', label: '16' }], cuts: [[[0, 3], [4, 3]]] }) },
  { text: 'Or complete a bigger rectangle and subtract the part that is missing.', visual: G.polygonFig({ pts: [[0, 0], [10, 0], [10, 6], [7, 6], [7, 3], [3, 3], [3, 6], [0, 6]], right: [0, 1, 2, 7], regions: [{ pts: [[3, 3], [7, 3], [7, 6], [3, 6]], t: 'hl' }], extra: [[3, 6]] }) },
  { text: 'For a border, like a frame or a path, subtract the inside area from the outside area.', visual: G.polygonFig({ pts: [[0, 0], [10, 0], [10, 7], [0, 7]], holes: [[[2, 2], [8, 2], [8, 5], [2, 5]]], shade: true, sides: ['10 cm', '7 cm', '', ''], notes: [{ at: [5, 3.5], s: '6 × 3' }] }) },
  { text: 'A shape can also be a rectangle and a triangle: add the rectangle\'s area and half of base × height for the triangle.', visual: G.polygonFig({ pts: [[0, 0], [8, 0], [8, 5], [4, 8], [0, 5]], sides: ['8 m', '5 m', '', '', ''], right: [0, 1], cuts: [[[0, 5], [8, 5]]], regions: [{ pts: [[0, 5], [8, 5], [4, 8]], t: 'hl2' }] }) },
];

// ═════════════ 6-surface: surface area ═════════════
export function surface6(r) {
  const v = r.int(0, 5);
  if (v === 0 || v === 5) {
    const s = r.int(2, 12), F = s * s;
    const pic = G.boxFig({ l: s, w: s, h: s, labels: [`${s} cm`, `${s} cm`, `${s} cm`] });
    if (v === 5) return num(s, [St('A cube has 6 equal square faces, so one face is the total ÷ 6.', G.netFig({ cells: G.CUBE_NETS[5], hl: [1] })), St(`${6 * F} ÷ 6 = ${F}, and ${s} × ${s} = ${F}, so each edge is ${s} cm.`), St(`So the edge is ${s} cm.`)], { q: `A cube has a surface area of ${6 * F} cm². How long is each edge, in cm?`, visual: G.boxFig({ l: 1, w: 1, h: 1, labels: ['?', '', ''] }), expr: `Math.sqrt(${6 * F}/6)` });
    return num(6 * F, [St('Open the cube out into its net: 6 equal squares.', G.netFig({ cells: G.CUBE_NETS[5] })), St(`Each face is ${s} × ${s} = ${F} cm². There are 6: 6 × ${F} = ${6 * F}.`, G.netFig({ cells: G.CUBE_NETS[5], hl: range(6) })), St(`So the surface area is ${6 * F} cm².`)], { q: 'What is the surface area of this cube, in cm²?', visual: pic, expr: `6*${s}**2` });
  }
  if (v === 1 || v === 4) {
    let l = r.int(3, 12), w = r.int(2, 9), h = r.int(2, 9); if (l === w) l += 1;
    const S = 2 * (l * w + l * h + w * h), net = (hl) => G.boxNet({ l, w, h, labels: [`${l}`, `${w}`, `${h}`], hl });
    const steps = [
      St(`The box has 3 pairs of matching faces. Top and bottom: 2 × ${l} × ${w} = ${2 * l * w}.`, net('tb')),
      St(`Front and back: 2 × ${l} × ${h} = ${2 * l * h}.`, net('fb')),
      St(`Left and right ends: 2 × ${w} × ${h} = ${2 * w * h}.`, net('lr')),
      St(`Add: ${2 * l * w} + ${2 * l * h} + ${2 * w * h} = ${S}.`),
      St(`So the surface area is ${S} cm².`),
    ];
    return num(S, steps, v === 1
      ? { q: 'What is the surface area of this box, in cm²?', visual: G.boxFig({ l, w, h, labels: [`${l} cm`, `${w} cm`, `${h} cm`] }), expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` }
      : { q: 'This net folds into a box. The lengths are in cm. What is the surface area of the box, in cm²?', visual: net(null), expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` });
  }
  if (v === 2) {
    const k = r.int(1, 3), a = 3 * k, b = 4 * k, c = 5 * k, L = r.int(4, 12), S = a * b + (a + b + c) * L;
    const end = [[0, 0], [b, 0], [0, a]];
    return num(S, [
      St(`The two ends are right triangles: 2 × (${b} × ${a} ÷ 2) = ${a * b} cm².`, G.prismFig({ base: end, depth: 5, sides: [`${b} cm`, `${c} cm`, `${a} cm`], depthLabel: `${L} cm`, hl: 'base' })),
      St(`The three rectangles are all ${L} cm long. Their widths are the sides of the triangle: (${a} + ${b} + ${c}) × ${L} = ${(a + b + c) * L} cm².`, G.triPrismNet({ hl: 'rects' })),
      St(`Total: ${a * b} + ${(a + b + c) * L} = ${S}.`),
      St(`So the surface area is ${S} cm².`),
    ], { q: 'What is the surface area of this triangular prism, in cm²?', visual: G.prismFig({ base: end, depth: 5, sides: [`${b} cm`, `${c} cm`, `${a} cm`], depthLabel: `${L} cm` }), expr: `${a}*${b}+(${a}+${b}+${c})*${L}` });
  }
  const s = r.int(2, 10), l = r.int(3, 12), S = s * s + 2 * s * l;
  return num(S, [
    St(`The square base: ${s} × ${s} = ${s * s} cm².`, G.pyramidNet({ labels: [`${s} cm`, `${l} cm`], hl: 'base' })),
    St(`Four triangles, each with base ${s} and height ${l}: 4 × (${s} × ${l} ÷ 2) = ${2 * s * l} cm².`, G.pyramidNet({ labels: [`${s} cm`, `${l} cm`], hl: 'faces' })),
    St(`Total: ${s * s} + ${2 * s * l} = ${S}.`),
    St(`So the surface area is ${S} cm².`),
  ], { q: 'This square pyramid has a base edge and a slant height (the height of each triangle) as shown. What is its surface area, in cm²?', visual: G.pyramidFig({ a: s, h: l, labels: [`${s} cm`, '', `${l} cm`] }), expr: `${s}*${s}+4*${s}*${l}/2` });
}
export const SURFACE_LESSON = [
  { text: 'Surface area is the total area of all the faces. Open the solid out into a net to see every face.', visual: G.boxNet({ l: 6, w: 3, h: 4, labels: ['6', '3', '4'] }) },
  { text: 'A box has 3 pairs of matching faces: SA = 2 × (l × w + l × h + w × h).', visual: G.boxNet({ l: 6, w: 3, h: 4, labels: ['6', '3', '4'], hl: 'fb' }) },
  { text: 'A cube has 6 equal squares: SA = 6 × s².', visual: G.netFig({ cells: G.CUBE_NETS[5], hl: range(6) }) },
  { text: 'A square pyramid has a square base and 4 equal triangles: SA = s² + 4 × (s × slant height ÷ 2).', visual: G.pyramidNet({ labels: ['s', 'slant'], hl: 'faces' }) },
];

// ═════════════ 6-volume6: volume of prisms ═════════════
export function volume6(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const l = r.int(2, 12), w = r.int(2, 9), h = r.int(2, 10) + (r.bool(0.3) ? 0.5 : 0), V = l * w * h;
    const pic = (hl) => G.boxFig({ l, w, h, labels: [`${l} cm`, `${w} cm`, `${dec(h)} cm`], hl });
    return num(dec(V), [St(`The base is ${l} × ${w} = ${l * w} cm²: that many cubes cover the bottom.`, pic(['length', 'width'])), St(`Stack the layers up the height: V = ${l * w} × ${dec(h)} = ${dec(V)}.`, pic('height')), St(`So the volume is ${dec(V)} cm³.`)],
      { q: 'What is the volume of this rectangular prism, in cm³?', visual: pic(), expr: `${l}*${w}*${h}` });
  }
  if (v === 1 || v === 2) {
    const s = r.int(2, 10), lab = (q) => G.boxFig({ l: 1, w: 1, h: 1, labels: [q, q, q] });
    return v === 1
      ? num(s ** 3, [St(`Every edge of a cube is the same: ${s} m. V = s × s × s.`, G.boxFig({ l: 1, w: 1, h: 1, labels: [`${s} m`, `${s} m`, `${s} m`], hl: ['length', 'width'] })), St(`${s} × ${s} × ${s} = ${s * s} × ${s} = ${s ** 3}.`), St(`So the volume is ${s ** 3} m³.`)], { q: 'What is the volume of this cube, in m³?', visual: lab(`${s} m`), expr: `${s}**3` })
      : num(s, [St(`V = s × s × s, so look for a number that, used 3 times, makes ${s ** 3}.`, lab('s')), St(`${s} × ${s} × ${s} = ${s ** 3}.`), St(`So each edge is ${s} m.`)], { q: `This cube has a volume of ${s ** 3} m³. How long is each edge s, in m?`, visual: lab('s'), expr: `Math.round(${s ** 3}**(1/3))` });
  }
  if (v === 3) {
    const b = r.int(3, 10), h = 2 * r.int(1, 5), L = r.int(3, 12), A = (b * h) / 2, V = A * L;
    const pts = [[0, 0], [b, 0], [b * r.pick([0.3, 0.5, 0.7]), h]];
    const pic = (hl) => G.prismFig({ base: pts, depth: Math.max(3, Math.min(8, L * 0.7)), sides: [`${b} cm`, '', ''], height: { from: 2, side: 0, label: `${h} cm` }, depthLabel: `${L} cm`, hl });
    return num(V, [St(`The base of this prism is the triangle at the end: ${b} × ${h} ÷ 2 = ${A} cm².`, pic('base')), St(`Volume = base area × length = ${A} × ${L} = ${V}.`, pic('depth')), St(`So the volume is ${V} cm³.`)],
      { q: 'What is the volume of this triangular prism, in cm³?', visual: pic(), expr: `${b}*${h}/2*${L}` });
  }
  if (v === 4) {
    const l = r.int(2, 6), w = r.int(2, 4), h = r.int(2, 4);
    const pic = (hl) => G.boxFig({ l, w, h, cubes: true, hl });
    return num(l * w * h, [St(`Count the bottom layer: ${l} cubes along and ${w} cubes back, so ${l} × ${w} = ${l * w} cubes.`, pic(['length', 'width'])), St(`There are ${h} layers: ${l * w} × ${h} = ${l * w * h}.`, pic('height')), St(`So the box holds ${l * w * h} unit cubes.`)],
      { q: 'This box is filled with unit cubes. How many cubes are there, including the ones you cannot see?', visual: pic(), expr: `${l}*${w}*${h}` });
  }
  if (v === 5) {
    const l = r.int(2, 12), w = r.int(2, 8), h = r.int(2, 10), V = l * w * h;
    const pic = (hl, show) => G.boxFig({ l, w, h, labels: [`${l} m`, `${w} m`, show ? `${h} m` : 'h'], hl });
    return num(h, [St(`V = base area × height. The base is ${l} × ${w} = ${l * w} m².`, pic(['length', 'width'])), St(`h = ${V} ÷ ${l * w} = ${h}.`, pic('height', true)), St(`So the height is ${h} m.`)],
      { q: `This box has a volume of ${V} m³. What is its height h, in m?`, visual: pic(null), expr: `${V}/(${l}*${w})` });
  }
  if (v === 6) {
    const n = r.pick([5, 6, 8]), B = r.int(6, 40), h = r.int(3, 15), nm = { 5: 'pentagonal', 6: 'hexagonal', 8: 'octagonal' }[n];
    const pic = (hl) => G.prismFig({ base: G.regular(n, 3), depth: 6, depthLabel: `${h} cm`, hl });
    return num(B * h, [St(`For any prism, V = area of the base × its length. The base here is the ${nm.replace('al', '')} at the end, with area ${B} cm².`, pic('base')), St(`V = ${B} × ${h} = ${B * h}.`, pic('depth')), St(`So the volume is ${B * h} cm³.`)],
      { q: `The base of this ${nm} prism has an area of ${B} cm², and the prism is ${h} cm long. What is its volume, in cm³?`, visual: pic(), expr: `${B}*${h}` });
  }
  const dims = range(3).map(() => r.pick([1, 1.5, 2, 2.5])), [l, w, h] = dims, n = dims.map((d) => d * 2);
  const pic = (hl) => G.boxFig({ l: n[0], w: n[1], h: n[2], cubes: true, labels: dims.map((d) => `${dec(d)} cm`), hl });
  return num(n[0] * n[1] * n[2], [St(`Each small cube has edges of 1/2 cm, so 2 of them fit along every 1 cm. Along the box: ${dec(l)} × 2 = ${n[0]}, back: ${dec(w)} × 2 = ${n[1]}, up: ${dec(h)} × 2 = ${n[2]}.`, pic(['length', 'width'])), St(`${n[0]} × ${n[1]} × ${n[2]} = ${n[0] * n[1] * n[2]}.`), St(`So ${n[0] * n[1] * n[2]} small cubes fill the box.`)],
    { q: `How many cubes with edges of 1/2 cm fill this box?`, visual: pic(), expr: `${l * 2}*${w * 2}*${h * 2}` });
}
export const VOLUME_LESSON = [
  { text: 'Volume is the space inside a solid, counted in unit cubes. This box has 4 × 3 = 12 cubes in each layer and 2 layers: 24 cubes.', visual: G.boxFig({ l: 4, w: 3, h: 2, cubes: true, hl: ['length', 'width'] }) },
  { text: 'Rectangular prism: V = length × width × height (the base area times the height).', visual: G.boxFig({ l: 8, w: 3, h: 5, labels: ['8 cm', '3 cm', '5 cm'], hl: ['length', 'width', 'height'] }) },
  { text: 'Any prism: V = area of the base × length. For a triangular prism the base is the triangle at the end.', visual: G.prismFig({ base: [[0, 0], [6, 0], [2, 4]], depth: 7, sides: ['6 cm', '', ''], height: { from: 2, side: 0, label: '4 cm' }, depthLabel: '10 cm', hl: ['length', 'width'] }) },
  { text: 'A cube has all edges equal: V = s × s × s = s³.', visual: G.boxFig({ l: 3, w: 3, h: 3, cubes: true, labels: ['3', '3', '3'] }) },
];

// ═════════════ 6-unitsarea: area, volume, capacity and temperature ═════════════
const sqM = (hl) => gridFig({ cols: 10, rows: 10, shapes: [{ pts: [[0, 0], [10, 0], [10, 10], [0, 10]], t: 'top' }, ...(hl ? [{ pts: [[0, 9], [1, 9], [1, 10], [0, 10]], t: 'hl' }] : [])], notes: [{ at: [5, -0.9], s: '1 m = 100 cm' }, { at: [-1, 5], s: '1 m' }, ...(hl ? [{ at: [2.6, 9.5], s: '10 cm', t: 'hl', size: 12 }] : [])], W: 270, H: 250, pad: 36 });
export function unitsArea6(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const a = r.int(2, 9) + (r.bool(0.3) ? 0.5 : 0), toCm = r.bool(), c = a * 10000;
    const steps0 = [St('1 m = 100 cm, so a square metre is 100 cm by 100 cm. Each small square here is 10 cm by 10 cm = 100 cm², and there are 100 of them.', sqM(true)), St('So 1 m² = 100 × 100 = 10,000 cm².')];
    return toCm
      ? num(c, [...steps0, St(`${dec(a)} × 10,000 = ${comma(c)}.`), St(`So ${dec(a)} m² = ${comma(c)} cm².`)], { q: `${dec(a)} m² = ? cm²`, visual: sqM(false), expr: `${a}*10000` })
      : num(dec(a), [...steps0, St(`${comma(c)} ÷ 10,000 = ${dec(a)}.`), St(`So ${comma(c)} cm² = ${dec(a)} m².`)], { q: `${comma(c)} cm² = ? m²`, visual: sqM(false), expr: `${c}/10000` });
  }
  if (v === 1) {
    const a = r.int(2, 9) / (r.bool() ? 1 : 2);
    const cube = (hl) => G.boxFig({ l: 10, w: 10, h: 10, cubes: true, labels: ['1 m', '1 m', '1 m'], hl });
    return num(a * 1000, [St('A cube 1 m on each side holds 10 × 10 × 10 = 1000 small cubes 10 cm on each side, and each small cube holds exactly 1 litre. So 1 m³ = 1000 L.', cube('base')), St(`${dec(a)} × 1000 = ${comma(a * 1000)}.`), St(`So ${dec(a)} m³ = ${comma(a * 1000)} L.`)],
      { q: `A tank holds ${dec(a)} m³ of water. How many litres is that?`, visual: cube(null), expr: `${a}*1000` });
  }
  if (v === 2) {
    const l = r.pick([10, 20, 25, 30]), w = r.pick([10, 12, 20]), h = r.int(1, 6) * 5, V = l * w * h;
    const pic = (hl) => G.boxFig({ l, w, h, labels: [`${l} cm`, `${w} cm`, `${h} cm`], hl });
    return num(dec(V / 1000), [St(`Volume = ${l} × ${w} × ${h} = ${comma(V)} cm³.`, pic(['length', 'width', 'height'])), St(`1 cm³ holds 1 mL, so it holds ${comma(V)} mL. 1 L = 1000 mL: ${comma(V)} ÷ 1000 = ${dec(V / 1000)}.`), St(`So it holds ${dec(V / 1000)} L.`)],
      { q: 'How many litres does this box hold when full?', visual: pic(), expr: `${V}/1000` });
  }
  if (v === 3) {
    const [what, right, wrongs] = r.pick([['a hot summer day in Toronto', 30, [5, 75, -10]], ['a cold winter day in Winnipeg', -25, [10, 25, -90]], ['a cup of hot chocolate', 70, [7, 200, -5]], ['the inside of a fridge', 4, [40, -40, 24]], ['a comfortable classroom', 21, [2, 51, -21]], ['a snowy day', -6, [16, 36, -60]]]);
    const fmt = (t) => `${neg(t)} °C`;
    return mc(r, fmt(right), wrongs.map(fmt), { q: `Which is the most reasonable temperature for ${what}?`,
      steps: [St('Water freezes at 0 °C and boils at 100 °C. A warm room is about 20 °C; below zero is freezing.', thermoFig([right], { lo: -30, hi: 80 })), St(`So the most reasonable is ${fmt(right)}.`)] });
  }
  if (v === 4) {
    const t = r.int(-12, 18) * 2;
    return num(t, [St('Each small mark is 2 °C, and the numbers go up by 10. Find the top of the liquid.', thermoFig([t], { hl: [0] })), St(t < 0 ? `It is below 0, so the temperature is negative: ${neg(t)} °C.` : `Count up from the number below it: ${t} °C.`), St(`So the thermometer shows ${neg(t)} °C.`)],
      { q: 'What temperature does the thermometer show, in °C?', unit: '°C', visual: thermoFig([t]), expr: String(t) });
  }
  if (v === 5 || v === 6) {
    const a = r.int(-12, 5) * 2, b = a + r.int(2, 12) * 2, [c1, c2] = r.shuffle(['Iqaluit', 'Regina', 'Halifax', 'Calgary', 'Quebec City', 'Whitehorse']), swap = r.bool();
    const vals = swap ? [b, a] : [a, b], names = swap ? ['Afternoon', 'Morning'] : ['Morning', 'Afternoon'];
    if (v === 6) {
      const tv = swap ? [b, a] : [a, b], cn = swap ? [c2, c1] : [c1, c2];
      return mc(r, c1, [c2], { q: `The thermometers show the temperature in ${cn[0]} and in ${cn[1]}. Which city is colder?`, visual: thermoFig(tv, { names: cn }),
        steps: [St(`${c1}: ${neg(a)} °C. ${c2}: ${neg(b)} °C. The lower the liquid, the colder.`, thermoFig(tv, { names: cn, hl: [swap ? 1 : 0] })), St(`${neg(a)} is less than ${neg(b)}, so ${c1} is colder.`)] });
    }
    return num(b - a, [St(`Morning: ${neg(a)} °C. Afternoon: ${neg(b)} °C.`, thermoFig(vals, { names, hl: [0, 1] })), St(`Count up from ${neg(a)} to ${neg(b)}${a < 0 && b > 0 ? `: ${-a} up to 0, then ${b} more` : ''}. ${neg(b)} − ${par(a)} = ${b - a}.`), St(`So it rose by ${b - a} degrees.`)],
      { q: 'The thermometers show the temperature in the morning and in the afternoon. By how many degrees did it rise?', unit: '°C', visual: thermoFig(vals, { names }), expr: `${b}-(${a})` });
  }
  const [what, right, wrongs, why] = r.pick([
    ['the area of a classroom floor', 'm²', ['cm²', 'm³', 'mL'], 'it is a flat surface, and big'], ['the area of a postage stamp', 'cm²', ['m²', 'cm³', 'km²'], 'it is a small flat surface'],
    ['the volume of a juice box', 'cm³', ['m³', 'cm²', 'km'], 'it is a small space inside a solid'], ['the volume of a swimming pool', 'm³', ['cm³', 'm²', 'mL'], 'it is a big space inside a solid'],
    ['the amount of water in a bathtub', 'L', ['mL', 'cm²', 'm'], 'it is a large amount of liquid'], ['the amount of medicine in a spoon', 'mL', ['L', 'm³', 'cm²'], 'it is a tiny amount of liquid'],
  ]);
  const area = right.includes('²'), pic = area ? gridFig({ cols: 6, rows: 4, shapes: [{ pts: [[1, 1], [5, 1], [5, 3], [1, 3]], t: 'hl' }] }) : G.boxFig({ l: 4, w: 3, h: 2, cubes: true });
  return mc(r, right, wrongs, { q: `Which unit is best for measuring ${what}?`, steps: [St('Area (a flat surface) uses square units like cm² or m². Volume (space inside) uses cubic units like cm³ or m³. Liquids use L or mL.', pic), St(`Here ${why}, so use ${right}.`)] });
}
export const UNITSAREA_LESSON = [
  { text: 'A square metre is 100 cm by 100 cm, so 1 m² = 100 × 100 = 10,000 cm².', visual: sqM(true) },
  { text: 'A cubic metre is 1000 cubes of 10 cm by 10 cm by 10 cm, and each one holds 1 litre: 1 m³ = 1000 L.', visual: G.boxFig({ l: 10, w: 10, h: 10, cubes: true, labels: ['1 m', '1 m', '1 m'] }) },
  { text: 'A 1 cm cube holds exactly 1 mL, so a box of 2,000 cm³ holds 2,000 mL = 2 L.', visual: G.boxFig({ l: 20, w: 10, h: 10, labels: ['20 cm', '10 cm', '10 cm'] }) },
  { text: 'On the Celsius scale water freezes at 0 °C. Temperatures below zero are negative and colder: −8 °C is colder than −2 °C.', visual: thermoFig([-8, -2], { names: ['−8 °C', '−2 °C'], hl: [0] }) },
];
