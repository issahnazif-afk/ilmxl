// Grades 4 and 5 geometry and measurement, taught with pictures (the way geo10.mjs does it for grade 10): every
// question about shapes, angles, lines, symmetry, solids, area, perimeter or volume shows its figure, and the worked
// steps light up the part being used. g4.mjs and g5.mjs call these generators; LESSONS holds the key ideas, each with
// its picture. angles4 and volume5 (with LESSONS.angles4 / LESSONS.volume5) are written for the "4-angles" and
// "5-volume" skills that live in skills.mjs.
import { mc, num, St, dec } from '../kit.mjs';
import * as G from '../figs.mjs';

const { fig, poly, line, text, path, circle, dot, rightMark } = G;
const PI = Math.PI, rad = (d) => (d * PI) / 180, R1 = (x) => Math.round(x * 10) / 10;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], mulv = (a, k) => [a[0] * k, a[1] * k];
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const unitv = (a) => mulv(a, 1 / (Math.hypot(a[0], a[1]) || 1));
const S2 = (p) => `${R1(p[0])} ${R1(p[1])}`;
const dirv = (deg) => [Math.cos(rad(deg)), -Math.sin(rad(deg))];          // a screen direction (y down), deg anticlockwise
const art = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const L4 = ['A', 'B', 'C', 'D'];
const yesNo = (r, yes, extra) => mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], extra);
// "which picture…" questions: the choices are the picture letters, in order
const letters = (k, n, extra) => ({ kind: 'mc', choices: L4.slice(0, n), a: k, ...extra });
const figs = (list, captions = L4) => ({ type: 'figs', figs: list, captions: captions.slice(0, list.length) });
// display lengths in proportion, but never too thin to read
const disp = (a, b, lo = 0.42) => { const [x, y] = G.squash([a, b], lo, 0.8); return [x * 10, y * 10]; };
const rectPts = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];

// ───────── picture builders (composed from the primitives in figs.mjs) ─────────
const arrowHead = (tip, d, t = 'ink', s = 9) => { const n = [d[1], -d[0]], b = sub(tip, mulv(d, s)); return poly([add(b, mulv(n, s * 0.6)), tip, sub(b, mulv(n, s * 0.6))], t, { open: true }); };
// an arc round V from direction a0 to a1 (degrees, anticlockwise)
function arc(V, r, a0, a1, t = 'mark') {
  const p = (a) => S2(add(V, mulv(dirv(a), r)));
  if (a1 - a0 >= 359.9) return [path(`M${p(a0)}A${r} ${r} 0 1 0 ${p(a0 + 180)}A${r} ${r} 0 1 0 ${p(a0 + 359.5)}`, t)];
  return [path(`M${p(a0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${p(a1)}`, t)];
}
// centre a set of points (relative to a vertex at 0,0) in a picture
function place(rel, pad = 26, minW = 180, minH = 100) {
  const xs = rel.map((p) => p[0]), ys = rel.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const W = Math.max(minW, x1 - x0 + 2 * pad), H = Math.max(minH, y1 - y0 + 2 * pad);
  return { V: [W / 2 - (x0 + x1) / 2, H / 2 - (y0 + y1) / 2], W: R1(W), H: R1(H) };
}

// one angle: two rays from a vertex. o: rot (direction of the first ray), label, hl (the arc), ref (a dashed right
// angle to compare with), R (ray length)
export function angleFig(deg, o = {}) {
  const R = o.R ?? 95, rot = o.rot ?? 0, r = o.r ?? (deg < 45 ? 40 : 26), lab = o.label ?? '';
  const labAt = mulv(dirv(rot + deg / 2), r + 16 + String(lab).length * 2.5);
  const rel = [[0, 0], mulv(dirv(rot), R), mulv(dirv(rot + deg), R), ...(lab ? [labAt] : [])];
  if (deg > 180) for (let a = rot; a <= rot + deg; a += 20) rel.push(mulv(dirv(a), r + 6));
  if (o.ref) rel.push(mulv(dirv(rot + 90), R * 0.8));
  const { V, W, H } = place(rel, o.pad ?? 24, o.minW ?? 170, o.minH ?? 96);
  const A = add(V, rel[1]), B = add(V, rel[2]);
  const items = [line(V, A, 'ink'), line(V, B, 'ink')];
  if (o.ref && deg !== 90) { const F = add(V, mulv(dirv(rot + 90), R * 0.8)); items.push(line(V, F, 'aux'), rightMark(V, A, F, 12)); }
  if (deg === 90) items.push(rightMark(V, A, B, 14));
  else items.push(...arc(V, r, rot, rot + deg, o.hl ? 'hlline' : 'mark'));
  if (lab) items.push(text(add(V, labAt), lab, 'hl'));
  items.push(dot(V));
  return fig(items, W, H);
}

// a turn: the part of a full turn shaded, with an arrow round the outside
export function turnFig(deg, o = {}) {
  const C = [100, 92], R = 64, items = [circle(C, R, 'top')];
  if (deg >= 360) items.push(circle(C, R, 'hl'));
  else items.push(path(`M${S2(C)}L${S2(add(C, [R, 0]))}A${R} ${R} 0 ${deg > 180 ? 1 : 0} 0 ${S2(add(C, mulv(dirv(deg), R)))}Z`, 'hl'));
  items.push(line(C, add(C, [R, 0]), 'ink'), line(C, add(C, mulv(dirv(deg), R)), 'ink'));
  const ra = R + 13, end = Math.min(deg, 348);
  items.push(...arc(C, ra, 4, end, 'mark'), arrowHead(add(C, mulv(dirv(end), ra)), dirv(end + 90), 'mark'));
  if (o.label) items.push(text(add(C, mulv(dirv(deg >= 360 ? 90 : deg / 2), R * 0.55)), o.label, 'ink'));
  items.push(dot(C));
  return fig(items, 200, 184);
}

// a protractor with one ray on 0 and the other at deg; small marks every `step` degrees, numbers every 20°
export function protractorFig(deg, o = {}) {
  const C = [160, 156], R = 128, step = o.step ?? 10, items = [path(`M${S2([C[0] - R, C[1]])}A${R} ${R} 0 0 1 ${S2([C[0] + R, C[1]])}Z`, 'top')];
  for (let a = 0; a <= 180; a += step) {
    const d = dirv(a), long = a % 20 === 0 ? 14 : a % 10 === 0 ? 10 : 6;
    items.push(line(add(C, mulv(d, R)), add(C, mulv(d, R - long)), 'grid'));
    if (a % 20 === 0) items.push(text(add(C, mulv(d, R - 27)), a, 'muted', { size: 11 }));
  }
  items.push(line(C, add(C, [R + 14, 0]), o.hl === 'base' ? 'hlline' : 'ink'), line(C, add(C, mulv(dirv(deg), R + 14)), o.hl === 'ray' ? 'hlline' : 'ink'));
  items.push(...arc(C, 30, 0, deg, 'mark'), dot(C));
  if (o.hl === 'ray') items.push(dot(add(C, mulv(dirv(deg), R)), 'hl'));
  return fig(items, 320, 176);
}

// lines, rays, segments, angles, and pairs of lines (parallel, perpendicular, intersecting)
export function linesFig(kind, o = {}) {
  const W = 260, H = 150, C = [130, 75], tilt = o.tilt ?? 0, d = dirv(tilt), n = [d[1], -d[0]];
  const up = n[1] <= 0 ? n : mulv(n, -1);
  const at = (k, off = [0, 0]) => add(add(C, mulv(d, k)), off);
  const name = (p, s) => [dot(p), text(add(p, mulv(up, 15)), s, 'muted', { size: 13 })];
  const both = (p, q, t = 'ink') => [line(p, q, t), arrowHead(q, unitv(sub(q, p)), t), arrowHead(p, unitv(sub(p, q)), t)];
  let items;
  if (kind === 'line') items = [...both(at(-110), at(110)), ...name(at(-50), 'A'), ...name(at(50), 'B')];
  else if (kind === 'ray') items = [line(at(-100), at(110), 'ink'), arrowHead(at(110), d), ...name(at(-100), 'A'), ...name(at(30), 'B')];
  else if (kind === 'segment') items = [line(at(-95), at(95), 'ink'), ...name(at(-95), 'A'), ...name(at(95), 'B')];
  else if (kind === 'parallel') items = [...both(at(-110, mulv(n, 28)), at(110, mulv(n, 28))), ...both(at(-110, mulv(n, -28)), at(110, mulv(n, -28)))];
  else if (kind === 'perp') { const e = dirv(tilt + 90); items = [...both(at(-110), at(110)), ...both(add(C, mulv(e, -62)), add(C, mulv(e, 62))), rightMark(C, at(20), add(C, mulv(e, 20)), 12)]; }
  else if (kind === 'intersect') { const e = dirv(tilt + (o.cross ?? 55)); items = [...both(at(-110), at(110)), ...both(add(C, mulv(e, -64)), add(C, mulv(e, 64)))]; }
  else {
    const V = add(C, [-70, 25]), e1 = dirv(tilt * 0.5), e2 = dirv(tilt * 0.5 + 50);
    items = [line(V, add(V, mulv(e1, 165)), 'ink'), arrowHead(add(V, mulv(e1, 165)), e1), line(V, add(V, mulv(e2, 105)), 'ink'), arrowHead(add(V, mulv(e2, 105)), e2), ...name(V, 'A')];
  }
  return fig(items, W, H);
}

// several rays from one point, with the angles between them marked: parts are degrees, anticlockwise from `rot`
export function raysFig(parts, labels = [], o = {}) {
  const R = o.R ?? 92, rot = o.rot ?? 0, hl = o.hl ?? [];
  const bounds = [rot]; for (const p of parts) bounds.push(bounds.at(-1) + p);
  const total = bounds.at(-1) - rot, radius = (i) => (parts.length > 2 ? 26 + (i % 2) * 12 : 30);
  const labAt = (i) => mulv(dirv(bounds[i] + parts[i] / 2), radius(i) + 17 + String(labels[i] ?? '').length * 2.5);
  const rays = total >= 359.9 ? bounds.slice(0, -1) : bounds;
  const rel = [[0, 0], ...rays.map((b) => mulv(dirv(b), R)), ...parts.map((_, i) => labAt(i))];
  if (o.whole) rel.push(mulv(dirv(rot + total / 2), 82));
  const { V, W, H } = place(rel, 22, 170, 100);
  const items = rays.map((b) => line(V, add(V, mulv(dirv(b), R)), 'ink'));
  parts.forEach((p, i) => {
    const t = hl.includes(i) ? 'hlline' : 'mark';
    if (p === 90 && !labels[i]) items.push(rightMark(V, add(V, dirv(bounds[i])), add(V, dirv(bounds[i + 1])), 13));
    else items.push(...arc(V, radius(i), bounds[i], bounds[i + 1], t));
    if (labels[i]) items.push(text(add(V, labAt(i)), labels[i], hl.includes(i) ? 'hl' : 'ink'));
  });
  if (o.whole) { items.push(...arc(V, 62, rot, rot + total, hl.includes('whole') ? 'hlline' : 'aux')); items.push(text(add(V, mulv(dirv(rot + total / 2), 78)), o.whole, 'hl')); }
  items.push(dot(V));
  return fig(items, W, H);
}

// squared paper: cells [[x, y, tone]], polys [{ pts, t, sides, label }], lines [{ a, b, t }], notes [{ at, s, t }],
// dots [{ at, s, t }], arrows [{ a, b }], axes (numbers along the edges). Model coordinates, y up.
export function gridFig(o) {
  const { cols, rows } = o, pad = o.axes ? 30 : 14;
  const s = Math.min(o.maxS ?? 30, ((o.Wmax ?? 330) - 2 * pad) / cols, ((o.Hmax ?? 250) - 2 * pad) / rows);
  const W = R1(cols * s + 2 * pad), H = R1(rows * s + 2 * pad);
  const m = ([x, y]) => [pad + x * s, pad + (rows - y) * s];
  const items = [];
  for (const [x, y, t] of o.cells ?? []) items.push(poly([[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]].map(m), t ?? 'fig'));
  for (const p of o.polys ?? []) items.push(poly(p.pts.map(m), p.t ?? 'fig'));
  for (let x = 0; x <= cols; x++) items.push(line(m([x, 0]), m([x, rows]), 'grid'));
  for (let y = 0; y <= rows; y++) items.push(line(m([0, y]), m([cols, y]), 'grid'));
  for (const p of o.polys ?? []) {
    const sp = p.pts.map(m);
    items.push(poly(sp, p.t === 'hl' ? 'hlline' : 'ink'));
    (p.sides ?? []).forEach((lab, j) => items.push(G.sideLabel(sp[j], sp[(j + 1) % sp.length], lab, sp, p.hlSides?.includes(j) ? 'hl' : 'ink')));
    for (const j of p.hlSides ?? []) items.push(line(sp[j], sp[(j + 1) % sp.length], 'hlline'));
  }
  for (const l of o.lines ?? []) items.push(line(m(l.a), m(l.b), l.t ?? 'aux'));
  for (const a of o.arrows ?? []) { const A = m(a.a), B = m(a.b); items.push(line(A, B, 'mark'), arrowHead(B, unitv(sub(B, A)), 'mark')); }
  for (const d of o.dots ?? []) { items.push(dot(m(d.at), d.t ?? 'ink')); if (d.s) items.push(text(add(m(d.at), [12, -11]), d.s, d.t === 'hl' ? 'hl' : 'ink', { size: 13 })); }
  for (const t of o.notes ?? []) items.push(text(m(t.at), t.s, t.t ?? 'ink', t.size ? { size: t.size } : {}));
  if (o.axes) {
    for (let x = 0; x <= cols; x++) items.push(text(add(m([x, 0]), [0, 14]), x, 'muted', { size: 11 }));
    for (let y = 1; y <= rows; y++) items.push(text(add(m([0, y]), [-13, 0]), y, 'muted', { size: 11 }));
  }
  return fig(items, W, H);
}

// a solid built of unit cubes at [x, y, z] (x right, y up, z going back), drawn back to front
export function cubesFig(cubes, o = {}) {
  const DX = 0.42, DY = 0.3, pr = ([x, y, z]) => [x + z * DX, y + z * DY];
  const key = (x, y, z) => `${x},${y},${z}`, has = new Set(cubes.map((c) => key(...c)));
  const corners = cubes.flatMap(([x, y, z]) => [[x, y, z], [x + 1, y, z], [x, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1], [x + 1, y, z + 1]].map(pr));
  const F = G.frame(corners, { W: o.W ?? 250, H: o.H ?? 190, pad: o.pad ?? 20, maxScale: o.maxScale ?? 44 });
  const m = (p) => F.m(pr(p)), hl = o.hl ?? (() => false), items = [];
  const order = cubes.map((c, i) => [c, i]).sort(([a], [b]) => b[2] - a[2] || a[1] - b[1] || a[0] - b[0]);
  for (const [[x, y, z], i] of order) {
    const h = hl([x, y, z], i);
    if (!has.has(key(x, y, z - 1))) items.push(poly([m([x, y, z]), m([x + 1, y, z]), m([x + 1, y + 1, z]), m([x, y + 1, z])], h ? 'hl' : 'front'));
    if (!has.has(key(x, y + 1, z))) items.push(poly([m([x, y + 1, z]), m([x + 1, y + 1, z]), m([x + 1, y + 1, z + 1]), m([x, y + 1, z + 1])], h ? 'hl' : 'top'));
    if (!has.has(key(x + 1, y, z))) items.push(poly([m([x + 1, y, z]), m([x + 1, y, z + 1]), m([x + 1, y + 1, z + 1]), m([x + 1, y + 1, z])], h ? 'hl' : 'side'));
  }
  return fig(items, F.W, F.H);
}
const boxCubes = (l, w, h, x0 = 0) => { const out = []; for (let x = 0; x < l; x++) for (let y = 0; y < h; y++) for (let z = 0; z < w; z++) out.push([x + x0, y, z]); return out; };

// small pictures of the pattern shapes
const SHN = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
function shapeIcon(name, [x, y], s = 13) {
  if (name === 'circle') return circle([x, y], s, 'hl2');
  if (name === 'square') return poly([[x - s, y - s], [x + s, y - s], [x + s, y + s], [x - s, y + s]], 'fig');
  if (name === 'triangle') return poly([[x, y - s * 1.1], [x + s * 1.1, y + s * 0.9], [x - s * 1.1, y + s * 0.9]], 'side');
  if (name === 'diamond') return poly([[x, y - s * 1.2], [x + s * 0.8, y], [x, y + s * 1.2], [x - s * 0.8, y]], 'shade');
  if (name === 'star') return poly(Array.from({ length: 10 }, (_, i) => add([x, y], mulv(dirv(90 + i * 36), i % 2 ? s * 0.5 : s * 1.2))), 'cut');
  const B = [x, y + s], Lp = [x - s, y - s * 0.15], M = [x, y - s * 0.45], Rp = [x + s, y - s * 0.15], rr = R1(s * 0.53);
  return path(`M${S2(B)}L${S2(Lp)}A${rr} ${rr} 0 0 1 ${S2(M)}A${rr} ${rr} 0 0 1 ${S2(Rp)}Z`, 'hl');
}
// a row of shapes ('?' for a missing one); o.groups = core length (alternate blocks are tinted), o.hl = indexes to box
export function patternFig(seq, o = {}) {
  const per = o.perRow ?? 8, sp = 40, rows = Math.ceil(seq.length / per);
  const W = Math.min(seq.length, per) * sp + 16, H = rows * (sp + 16) + 4;
  const at = (i) => [8 + (i % per) * sp + sp / 2, 6 + Math.floor(i / per) * (sp + 16) + sp / 2];
  const items = [];
  seq.forEach((s, i) => {
    const c = at(i), box = [[c[0] - 19, c[1] - 19], [c[0] + 19, c[1] - 19], [c[0] + 19, c[1] + 19], [c[0] - 19, c[1] + 19]];
    if (o.groups && Math.floor(i / o.groups) % 2 === 1) items.push(poly(box, 'hlsoft'));
    if (o.hl?.includes(i)) items.push(poly(box, 'hlline'));
    if (s === '?') items.push(poly(box.map((p) => add(p, mulv(sub(c, p), 0.2))), 'hidden'), text(c, '?', 'hl', { size: 18 }));
    else items.push(shapeIcon(s, c));
    if (o.numbers !== false) items.push(text([c[0], c[1] + 27], i + 1, 'muted', { size: 10 }));
  });
  return fig(items, W, H);
}
// a growing pattern: figure i has a row of s squares and (i − 1) more rows of k squares; the newest row lit up
export function growFig(s, k, n = 3, o = {}) {
  const q = 18, items = []; let x = 12;
  const rowsMax = n, H = rowsMax * q + 40;
  for (let i = 1; i <= n; i++) {
    const w = Math.max(s, k) * q, base = H - 26;
    const sq = (cx, cy, t) => poly([[cx, cy], [cx + q, cy], [cx + q, cy - q], [cx, cy - q]], t);
    for (let j = 0; j < s; j++) items.push(sq(x + j * q, base, 'fig'));
    for (let rr = 1; rr < i; rr++) for (let j = 0; j < k; j++) items.push(sq(x + j * q, base - rr * q, o.hl && rr === i - 1 ? 'hl' : 'top'));
    items.push(text([x + w / 2, H - 10], o.names?.[i - 1] ?? `Figure ${i}`, 'muted', { size: 11 }));
    x += w + 26;
  }
  return fig(items, x - 14, H);
}

// a triangle with sides a (from corner 1 to 2), b (corner 2 to 0) and base c (corner 0 to 1), to scale
const triSides = (a, b, c) => { const x = (b * b - a * a + c * c) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0.01, b * b - x * x))]]; };
// a triangle with angle A at corner 0 and B at corner 1, to scale
const triAngles = (A, B, c = 6) => { const b = (c * Math.sin(rad(B))) / Math.sin(rad(A + B)); return [[0, 0], [c, 0], [b * Math.cos(rad(A)), b * Math.sin(rad(A))]]; };
// a polygon with n corners, its corners pulled in or out a little (still one closed shape)
const jag = (r, n, k = 0.4) => G.regular(n).map(([x, y]) => { const s = 1 - k / 2 + k * r.next(); return [x * s, y * s]; });
const NG = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
const triPyrNet = (hl) => { const A = [30, 186], B = [230, 186], C = [130, 13], ab = mid(A, B), bc = mid(B, C), ca = mid(C, A); return fig([poly([A, ab, ca], hl ? 'hl2' : 'front'), poly([ab, B, bc], hl ? 'hl2' : 'front'), poly([ca, bc, C], hl ? 'hl2' : 'front'), poly([ab, bc, ca], 'top')], 260, 200); };
const NONPOLY = {
  circle: [() => fig([circle([90, 75], 52, 'fig')], 180, 150), 'It is round: it has no straight sides'],
  oval: [() => fig([{ k: 'path', d: 'M28 75A62 40 0 1 0 152 75A62 40 0 1 0 28 75Z', t: 'fig' }], 180, 150), 'Its edge is curved, not straight'],
  semicircle: [() => fig([path('M28 108A62 62 0 0 1 152 108Z', 'fig')], 180, 150), 'One side is curved'],
  open: [() => { const p = G.regular(5, 55).map(([x, y]) => [90 + x, 80 - y]); return fig([poly(p, 'ink', { open: true })], 180, 150); }, 'It is not closed: there is a gap'],
  heart: [() => fig([shapeIcon('heart', [90, 78], 48)], 180, 150), 'Its top edges are curved'],
};
const polyPic = (pts, o = {}) => G.polygonFig({ pts, W: 180, H: 150, pad: 26, ...o });

// ───────── lines and angles (4-lines, 5-angles) ─────────
const ANGT = (d) => (d < 90 ? 'Acute' : d === 90 ? 'Right' : d < 180 ? 'Obtuse' : 'Straight');
const TURNS = [[1, 4], [1, 2], [3, 4], [1, 3], [2, 3], [1, 6], [1, 8], [1, 12], [1, 10], [1, 5]];
const FRAC_OF = { 90: '1/4', 180: '1/2', 270: '3/4', 360: '1 (a full turn)', 120: '1/3', 60: '1/6', 45: '1/8', 30: '1/12' };
const anglePick = (r, g) => r.pick([r.int(2, 8) * 10 + (g === 5 ? r.pick([0, 5]) : 0), 90, r.int(10, 17) * 10, 180]);
export function linesAngles(r, g = 4) {
  const v = r.int(0, g === 4 ? 7 : 8);
  if (v === 0) {
    const deg = anglePick(r, g), t = ANGT(deg), rot = r.pick([0, 0, 10, 25, 200, 330]);
    const pic = (o) => angleFig(deg, { rot, ...o });
    return mc(r, t, ['Acute', 'Right', 'Obtuse', 'Straight'].filter((x) => x !== t), { q: 'What kind of angle is this?', visual: pic(), steps: [
      St(deg === 90 ? 'The small square in the corner marks a right angle, a square corner.' : 'Compare it with a right angle: the dashed line makes a square corner (90°) with the first ray.', pic(deg === 90 ? { hl: true } : { ref: true, hl: true })),
      St(deg < 90 ? 'The opening is smaller than the square corner, so the angle is less than 90°.' : deg === 90 ? 'So the angle is exactly 90°.' : deg < 180 ? 'The opening is wider than the square corner, but the rays do not make a straight line: between 90° and 180°.' : 'The two rays point in opposite directions and make one straight line: 180°.'),
      St(`So it is ${art(t)} ${t.toLowerCase()} angle.`)] });
  }
  if (v === 1) {
    const big = r.bool(), degs = r.shuffle([r.int(2, 4) * 10, r.int(6, 9) * 10, r.int(11, 13) * 10, r.int(15, 17) * 10]);
    const best = big ? Math.max(...degs) : Math.min(...degs), k = degs.indexOf(best);
    const pics = (lab) => figs(degs.map((d) => angleFig(d, { R: 70, label: lab ? `${d}°` : '', hl: lab && d === best, minW: 150 })));
    return letters(k, 4, { q: `Which angle is the ${big ? 'largest' : 'smallest'}? (Look at how wide each opening is, not how long the rays are.)`, visual: pics(false), steps: [
      St('The size of an angle is how far one ray turns away from the other. Long or short rays do not change it.'),
      St(`Measured, they are ${degs.map((d, i) => `${L4[i]} ${d}°`).join(', ')}.`, pics(true)),
      St(`So angle ${L4[k]} is the ${big ? 'largest' : 'smallest'}.`)] });
  }
  if (v === 2) {
    const K = g === 5 ? ['line', 'ray', 'segment', 'angle'] : ['line', 'ray', 'segment'], kind = r.pick(K), tilt = r.int(-12, 12);
    const N = { line: 'Line', ray: 'Ray', segment: 'Line segment', angle: 'Angle' }[kind];
    const why = { line: 'Arrows at both ends: it goes on forever both ways, with no endpoints.', ray: 'One endpoint (the dot at A) and an arrow at the other end: it goes on forever one way.', segment: 'A dot at each end: two endpoints, so it stops at both ends.', angle: 'Two rays that start at the same endpoint, A.' }[kind];
    return mc(r, N, ['Line', 'Ray', 'Line segment', 'Angle'].filter((x) => x !== N), { q: 'What is this called?', visual: linesFig(kind, { tilt }), steps: [St('Look at the ends: an arrow means it keeps going, a dot is an endpoint.', linesFig(kind, { tilt })), St(why), St(`So it is ${art(N)} ${N.toLowerCase()}.`)] });
  }
  if (v === 3) {
    const kind = r.pick(['parallel', 'perp', 'intersect']), tilt = r.int(-12, 12), cross = r.pick([40, 55, 125, 140]);
    const N = { parallel: 'Parallel', perp: 'Perpendicular', intersect: 'Intersecting (not perpendicular)' }[kind];
    const why = { parallel: 'The lines stay the same distance apart, so they never meet.', perp: 'They cross, and the small square shows a right angle (90°).', intersect: 'They cross, but the angles are not right angles.' }[kind];
    return mc(r, N, ['Parallel', 'Perpendicular', 'Intersecting (not perpendicular)'].filter((x) => x !== N), { q: 'How are these two lines related?', visual: linesFig(kind, { tilt, cross }), steps: [St('Parallel lines never meet. Perpendicular lines cross at a right angle. Other lines that cross are intersecting.'), St(why, linesFig(kind, { tilt, cross })), St(`So they are ${N.toLowerCase()}.`)] });
  }
  if (v === 4) {
    const [n, d] = r.pick(TURNS), deg = (360 * n) / d;
    return num(deg, [St('A full turn is 360°.', turnFig(360)), St(`${n}/${d} of a turn: 360 ÷ ${d} = ${360 / d}${n > 1 ? `, and ${360 / d} × ${n} = ${deg}` : ''}.`, turnFig(deg, { label: `${deg}°` })), St(`So the angle is ${deg}°.`)], { q: `The shaded part shows a turn of ${n}/${d} of a full circle. How many degrees is that?`, visual: turnFig(deg), expr: `360*${n}/${d}` });
  }
  if (v === 5) {
    const deg = r.pick(g === 4 ? [90, 180, 270, 360] : [90, 180, 270, 360, 120, 60, 45, 30]), right = FRAC_OF[deg];
    const how = deg === 360 ? 'It is the whole circle.' : deg === 270 ? '270 is 3 lots of 90, and 90° is a quarter turn: 3 quarters.' : `360 ÷ ${deg} = ${360 / deg}, so ${deg}° is one of ${360 / deg} equal parts.`;
    return mc(r, right, r.shuffle(Object.values(FRAC_OF).filter((x) => x !== right)).slice(0, 3), { q: `A wheel turns ${deg}°, as shaded. What fraction of a full turn is that?`, visual: turnFig(deg, { label: `${deg}°` }), steps: [St('A full turn is 360°.', turnFig(360)), St(how), St(`So ${deg}° is ${right} of a full turn.`)] });
  }
  if (v === 6) {
    const deg = g === 4 ? r.int(1, 17) * 10 : r.int(2, 34) * 5, step = g === 4 ? 10 : 5;
    return num(deg, [
      St('The centre of the protractor sits on the corner of the angle, and one ray lies along 0.', protractorFig(deg, { step, hl: 'base' })),
      St(`Follow the other ray out to the numbers. The numbers go up by 20°, and each small mark is ${step}°. It crosses at ${deg}.`, protractorFig(deg, { step, hl: 'ray' })),
      St(`So the angle measures ${deg}°.`)], { q: 'Read the protractor. How many degrees is the angle?', visual: protractorFig(deg, { step }), expr: String(deg) });
  }
  if (v === 7) {
    const deg = r.int(2, 16) * 10, cand = [deg - 70, deg - 40, deg + 40, deg + 70, 180 - deg].filter((x) => x >= 10 && x <= 175 && Math.abs(x - deg) >= 30);
    const wrong = [...new Set(r.shuffle(cand))].slice(0, 3), rot = r.pick([0, 15, 340]);
    return mc(r, `${deg}°`, wrong.map((x) => `${x}°`), { q: 'About how many degrees is this angle?', visual: angleFig(deg, { rot }), steps: [
      St(deg === 90 ? 'The small square shows a right angle.' : `Compare with a right angle (90°, dashed). This angle is ${deg < 90 ? 'smaller' : 'bigger'}.`, angleFig(deg, { rot, ref: true, hl: true })),
      St(`${deg < 90 ? 'Less than 90°' : deg === 90 ? 'Exactly 90°' : 'More than 90° but less than 180°'}: the choice that fits best is ${deg}°.`, angleFig(deg, { rot, label: `${deg}°` })),
      St(`So the angle is about ${deg}°.`)] });
  }
  return missingAngle(r, r.pick(['supp', 'comp', 'point']));
}

// a missing angle: on a straight line, in a right angle, or round a point
function missingAngle(r, kind) {
  if (kind === 'supp') {
    const a = r.int(4, 32) * 5;
    const pic = (show, hl) => G.anglePairFig({ kind: 'supp', deg: a, labels: [`${a}°`, show ? `${180 - a}°` : '?'], hl });
    return num(180 - a, [St('The two angles sit together on a straight line, and a straight angle is 180°.', pic(false, [0, 1])), St(`? = 180° − ${a}° = ${180 - a}°.`, pic(true, [1])), St(`So the missing angle is ${180 - a}°.`)], { q: 'The two angles make a straight line. What is the angle marked ?, in degrees?', visual: pic(false), expr: `180-${a}` });
  }
  if (kind === 'comp') {
    const a = r.int(3, 15) * 5;
    const pic = (show, hl) => G.anglePairFig({ kind: 'comp', deg: a, labels: [`${a}°`, show ? `${90 - a}°` : '?'], hl });
    return num(90 - a, [St('The small square shows that the two angles together make a right angle: 90°.', pic(false, [0, 1])), St(`? = 90° − ${a}° = ${90 - a}°.`, pic(true, [1])), St(`So the missing angle is ${90 - a}°.`)], { q: 'The two angles together make a right angle. What is the angle marked ?, in degrees?', visual: pic(false), expr: `90-${a}` });
  }
  let a, b, c; do { a = r.int(8, 20) * 10; b = r.int(6, 16) * 10; c = 360 - a - b; } while (c < 50 || c > 200);
  const rot = r.pick([0, 20]), pic = (show, hl) => raysFig([a, b, c], [`${a}°`, `${b}°`, show ? `${c}°` : '?'], { rot, hl });
  return num(c, [St('The angles go all the way round the point: one full turn, 360°.', pic(false, [0, 1, 2])), St(`Add the two you know: ${a} + ${b} = ${a + b}. Then 360 − ${a + b} = ${c}.`, pic(true, [2])), St(`So the missing angle is ${c}°.`)], { q: 'These angles fit together round a point. What is the angle marked ?, in degrees?', visual: pic(false), expr: `360-${a}-${b}` });
}

// 4-angles: angles that fit together, measured and added
export function angles4(r) {
  const v = r.int(0, 6);
  if (v <= 1) return missingAngle(r, v === 0 ? 'supp' : 'comp');
  if (v === 2) {
    const a = r.int(2, 9) * 10, b = r.int(2, 8) * 10, rot = r.pick([0, 10]);
    const pic = (show, hl) => raysFig([a, b], [`${a}°`, `${b}°`], { rot, whole: show ? `${a + b}°` : '?', hl });
    return num(a + b, [St('The whole angle is made of the two smaller angles next to each other.', pic(false, [0, 1])), St(`Add them: ${a}° + ${b}° = ${a + b}°.`, pic(true, ['whole'])), St(`So the whole angle is ${a + b}°.`)], { q: 'Two angles sit side by side. What is the whole angle marked ?, in degrees?', visual: pic(false), expr: `${a}+${b}` });
  }
  if (v === 3) {
    const a = r.int(2, 9) * 10, b = r.int(2, 8) * 10;
    const pic = (show, hl) => raysFig([a, b], [`${a}°`, show ? `${b}°` : '?'], { whole: `${a + b}°`, hl });
    return num(b, [St(`The whole angle is ${a + b}°, and it is made of ${a}° and the missing part.`, pic(false, ['whole'])), St(`? = ${a + b}° − ${a}° = ${b}°.`, pic(true, [1])), St(`So the missing angle is ${b}°.`)], { q: `The whole angle is ${a + b}°. What is the angle marked ?, in degrees?`, visual: pic(false), expr: `${a + b}-${a}` });
  }
  if (v === 4) return missingAngle(r, 'point');
  if (v === 5) {
    const deg = r.int(1, 17) * 10;
    return num(deg, [St('Put the centre on the corner and one ray along 0.', protractorFig(deg, { hl: 'base' })), St(`Read where the other ray crosses the numbers, counting the small 10° marks: ${deg}.`, protractorFig(deg, { hl: 'ray' })), St(`So the angle is ${deg}°.`)], { q: 'Read the protractor. How many degrees is the angle?', visual: protractorFig(deg), expr: String(deg) });
  }
  const a = r.int(2, 4) * 10, b = r.int(2, 7 - a / 10) * 10, c = 90 - a - b;
  const pic = (show, hl) => raysFig([a, b, c], [`${a}°`, `${b}°`, show ? `${c}°` : '?'], { hl });
  return num(c, [St('Three angles fill a right angle, so they add to 90°.', pic(false, [0, 1, 2])), St(`? = 90 − ${a} − ${b} = ${c}.`, pic(true, [2])), St(`So the missing angle is ${c}°.`)], { q: 'Three angles fill a right angle. What is the angle marked ?, in degrees?', visual: pic(false), expr: `90-${a}-${b}` });
}

// ───────── polygons (4-polygons, 5-polygons) ─────────
const PNAMES = Object.values(NG).map(cap);
const numbered = (pts) => pts.map((_, i) => String(i + 1));
export function polygons(r, g = 4) {
  const v = r.int(0, 7), n = r.int(3, g === 4 ? 8 : 10), nm = NG[n];
  if (v === 0) {
    const pts = jag(r, n, 0.35);
    const wrongs = [n - 1, n + 1, n + 2, n - 2].filter((k) => NG[k]).map((k) => cap(NG[k]));
    return mc(r, cap(nm), wrongs, { q: 'Count the sides. What is the name of this polygon?', visual: polyPic(pts), steps: [St(`Count the sides, going round: there are ${n}.`, polyPic(pts, { names: numbered(pts) })), St(`A polygon with ${n} sides is ${art(nm)} ${nm}.`), St(`So it is ${art(nm)} ${nm}.`)] });
  }
  if (v === 1) {
    const pts = jag(r, n, 0.45), what = r.pick(['sides', 'vertices (corners)']);
    return num(n, [St(`Put a number on each ${what === 'sides' ? 'corner as you go round; there is one side between each pair of corners' : 'corner as you go round'}.`, polyPic(pts, { names: numbered(pts) })), St(`The last number is ${n}, so there are ${n} ${what.split(' ')[0]}.`), St(`So the polygon has ${n} ${what.split(' ')[0]}.`)], { q: `How many ${what} does this polygon have?`, visual: polyPic(pts), expr: String(n) });
  }
  if (v === 2) {
    const yes = r.bool(), kind = r.pick(Object.keys(NONPOLY)), pts = jag(r, n, 0.4), pic = yes ? polyPic(pts) : NONPOLY[kind][0]();
    return yesNo(r, yes, { q: 'Is this shape a polygon?', visual: pic, steps: [St('A polygon is a closed shape made only of straight sides.'), St(yes ? `It is closed and all ${n} sides are straight.` : `${NONPOLY[kind][1]}.`, pic), St(`So the answer is ${yes ? 'yes' : 'no'}.`)] });
  }
  if (v === 3) {
    const not = r.bool(), ks = r.shuffle(Object.keys(NONPOLY)), nn = r.shuffle([3, 4, 5, 6, 7, 8]);
    const list = not ? [{ f: NONPOLY[ks[0]][0](), ok: true, why: NONPOLY[ks[0]][1] }, ...[0, 1, 2].map((i) => ({ f: polyPic(jag(r, nn[i], 0.35)) }))]
      : [{ f: polyPic(jag(r, nn[0], 0.35)), ok: true }, ...[0, 1, 2].map((i) => ({ f: NONPOLY[ks[i]][0](), why: NONPOLY[ks[i]][1] }))];
    const all = r.shuffle(list), k = all.findIndex((x) => x.ok);
    return letters(k, 4, { q: `Which shape is ${not ? 'NOT ' : ''}a polygon?`, visual: figs(all.map((x) => x.f)), steps: [
      St('A polygon is closed, and every side is a straight line segment.'),
      St(not ? `Shape ${L4[k]}: ${all[k].why.toLowerCase()}. The others are closed with straight sides.` : `The others fail: ${all.filter((x) => !x.ok).map((x) => x.why.toLowerCase()).join('; ')}.`, figs(all.map((x) => x.f))),
      St(`So the answer is ${L4[k]}.`)] });
  }
  if (v === 4) {
    const reg = r.bool(), m = r.int(3, 8), pts = reg ? G.regular(m) : (m === 4 ? [[0, 0], [7, 0], [7, 4], [0, 4]] : jag(r, m, 0.7).map(([x, y]) => [x * 1.5, y]));
    const right = reg ? 'Regular' : 'Irregular';
    const marked = polyPic(pts, reg ? { ticks: Array(m).fill(1), arcs: pts.map((_, i) => i) } : {});
    return mc(r, right, [reg ? 'Irregular' : 'Regular'], { q: 'Is this polygon regular or irregular?', visual: polyPic(pts), steps: [St('A regular polygon has all its sides equal and all its angles equal.'), St(reg ? 'Every side is the same length (one tick each) and every angle is the same size.' : m === 4 ? 'Its angles are all right angles, but two sides are long and two are short: the sides are not all equal.' : 'Its sides are different lengths, and its corners are different sizes.', marked), St(`So it is ${reg ? 'regular' : 'irregular'}.`)] });
  }
  if (v === 5) {
    const opts = r.shuffle([3, 4, 5, 6, 7, 8].filter((k) => k !== n)).slice(0, 3), all = r.shuffle([n, ...opts]), k = all.indexOf(n);
    const shapes = all.map((m) => jag(r, m, 0.3));
    return letters(k, 4, { q: `Which shape is ${art(nm)} ${nm}?`, visual: figs(shapes.map((p) => polyPic(p))), steps: [St(`${cap(art(nm))} ${nm} has ${n} sides. Count the sides of each shape.`), St(`They have ${all.map((m, i) => `${L4[i]} ${m}`).join(', ')} sides.`, figs(shapes.map((p, i) => polyPic(p, { names: numbered(p), shade: i === k })))), St(`So shape ${L4[k]} is the ${nm}.`)] });
  }
  if (v === 6 && g === 5) {
    const rd = r.int(2, 25), toD = r.bool();
    const pic = (hl) => G.circleFig({ show: toD ? 'radius' : 'diameter', r: `${rd} cm`, d: `${2 * rd} cm`, centre: 'O', hl });
    return toD
      ? num(2 * rd, [St('The radius goes from the centre O to the edge.', pic('radius')), St(`The diameter goes right across through the centre: two radii, 2 × ${rd} = ${2 * rd}.`, G.circleFig({ show: 'both', r: `${rd} cm`, d: '?', centre: 'O', hl: 'diameter' })), St(`So the diameter is ${2 * rd} cm.`)], { q: 'What is the diameter of this circle, in centimetres?', visual: pic(), expr: `2*${rd}` })
      : num(rd, [St('The diameter goes right across the circle through the centre O.', pic('diameter')), St(`The radius is half of it: ${2 * rd} ÷ 2 = ${rd}.`, G.circleFig({ show: 'both', r: '?', d: `${2 * rd} cm`, centre: 'O', hl: 'radius' })), St(`So the radius is ${rd} cm.`)], { q: 'What is the radius of this circle, in centimetres?', visual: pic(), expr: `${2 * rd}/2` });
  }
  if (v === 7 && g === 5) {
    const P = r.pick(['Radius', 'Diameter', 'Chord']);
    const pic = P === 'Radius' ? G.circleFig({ show: 'radius', centre: 'O', hl: 'radius' }) : P === 'Diameter' ? G.circleFig({ show: 'diameter', centre: 'O', hl: 'diameter' }) : G.circleFig({ show: 'none', centre: 'O', chord: [200, 320] });
    const why = { Radius: 'It goes from the centre O to the edge of the circle.', Diameter: 'It goes from edge to edge, straight through the centre O.', Chord: 'It joins two points on the edge but does not pass through the centre.' }[P];
    return mc(r, P, ['Radius', 'Diameter', 'Chord', 'Centre'].filter((x) => x !== P), { q: 'What is the name of the line segment drawn in this circle?', visual: pic, steps: [St('Radius: centre to edge. Diameter: edge to edge through the centre. Chord: edge to edge, missing the centre.'), St(why, pic), St(`So it is a ${P.toLowerCase()}.`)] });
  }
  if (v === 6) {
    // congruent shapes on squared paper
    const a = r.int(2, 4), b = r.int(a + 1, 5), kind = r.int(0, 2), [c, d] = kind === 0 ? [b, a] : kind === 1 ? [a, b] : r.pick([[a, b + 1], [a + 1, b]]);
    const yes = kind < 2, gf = (hl) => gridFig({ cols: 13, rows: 7, polys: [{ pts: rectPts(a, b).map(([x, y]) => [x + 1, y + 1]), t: hl ? 'hl2' : 'fig' }, { pts: rectPts(c, d).map(([x, y]) => [x + 7, y + 1]), t: hl ? 'hl' : 'fig' }], notes: [{ at: [1 + a / 2, b + 1.5], s: 'A', t: 'muted' }, { at: [7 + c / 2, d + 1.5], s: 'B', t: 'muted' }] });
    return yesNo(r, yes, { q: 'Are rectangles A and B congruent (the same size and the same shape)?', visual: gf(false), steps: [St('Congruent shapes match exactly when you slide, flip or turn one onto the other. Count the squares along each side.'), St(`A is ${a} by ${b}. B is ${c} by ${d}.${kind === 0 ? ' B is just A turned on its side.' : ''}`, gf(true)), St(yes ? 'The sides match, so yes, they are congruent.' : 'One pair of sides does not match, so no, they are not congruent.')] });
  }
  // a riddle, with the picture in the answer
  const pts = G.regular(n);
  return mc(r, cap(nm), [n === 3 ? 'Quadrilateral' : cap(NG[n - 1]), cap(NG[n + 1] ?? 'triangle'), 'Circle'], { q: `I am a polygon with ${n} straight sides and ${n} corners. What am I?`, steps: [St(`${n} sides means ${art(nm)} ${nm}.`, polyPic(pts, { names: numbered(pts) })), St(`So I am ${art(nm)} ${nm}.`)] });
}

// ───────── triangles ─────────
const TRI = {
  equilateral: { pts: G.regular(3), ticks: [1, 1, 1] },
  isosceles: { pts: [[0, 0], [5, 0], [2.5, 6.2]], ticks: [0, 1, 1] },
  scalene: { pts: [[0, 0], [7, 0], [2, 4]], ticks: [1, 2, 3] },
  right: { pts: [[0, 0], [6, 0], [0, 4.5]], right: [0] },
  obtuse: { pts: [[0, 0], [5, 0], [8.5, 3.2]], arcs: [1] },
  acute: { pts: [[0, 0], [6, 0], [2.5, 4.6]] },
};
const BOTH = {
  'Right isosceles': { pts: [[0, 0], [5, 0], [0, 5]], ticks: [1, 0, 1], right: [0] },
  'Right scalene': { pts: [[0, 0], [7, 0], [0, 4]], ticks: [1, 2, 3], right: [0] },
  'Obtuse isosceles': { pts: [[0, 0], [8, 0], [4, 2]], ticks: [0, 1, 1], arcs: [2] },
  'Obtuse scalene': { pts: [[0, 0], [5, 0], [8.5, 3.2]], ticks: [1, 2, 3], arcs: [1] },
  'Acute isosceles': { pts: [[0, 0], [4.5, 0], [2.25, 6]], ticks: [0, 1, 1] },
  'Acute scalene': { pts: [[0, 0], [6, 0], [2.5, 4.6]], ticks: [1, 2, 3] },
};
const triPic = (o, extra = {}) => G.polygonFig({ ...o, ...extra });
const SIDES3 = ['Equilateral', 'Isosceles', 'Scalene'], ANG3 = ['Acute', 'Right', 'Obtuse'];
function anglesOf(r, k) {
  let A, B;
  if (k === 1) { A = 90; B = r.int(5, 13) * 5; } else if (k === 2) { A = r.int(22, 28) * 5; B = r.int(4, Math.min(10, (180 - A - 20) / 5)) * 5; }
  else { do { A = r.int(10, 16) * 5; B = r.int(10, 16) * 5; } while (180 - A - B >= 90 || 180 - A - B < 35); }
  return [A, B, 180 - A - B];
}
export function triangles(r, g = 4) {
  const v = r.int(0, g === 4 ? 5 : 7);
  if (v === 0) {
    const k = r.int(0, 2), a = r.int(4, 10); let s;
    if (k === 0) s = [a, a, a]; else if (k === 1) { let b = r.int(3, Math.min(14, 2 * a - 2)); if (b === a) b = a - 1; s = [a, a, b]; } else { const b = r.int(a + 1, a + 4); s = [a, b, r.int(b + 1, a + b - 2)]; }
    const [p, q, c] = r.shuffle(s), pts = triSides(p, q, c), labs = [`${c} cm`, `${p} cm`, `${q} cm`], right = SIDES3[k];
    const eq = [c, p, q], tk = eq.map((x) => (k === 2 ? 0 : eq.filter((y) => y === x).length > 1 ? 1 : 0));
    return mc(r, right, SIDES3.filter((x) => x !== right), { q: 'Classify this triangle by its sides.', visual: triPic({ pts, sides: labs }), steps: [
      St('By sides: equilateral has 3 equal sides, isosceles has 2, scalene has none.'),
      St(`The sides are ${s.join(' cm, ')} cm. ${k === 0 ? 'All three are equal.' : k === 1 ? 'Exactly two are equal (marked with ticks).' : 'No two are equal.'}`, triPic({ pts, sides: labs, ticks: tk, hl: tk.map((t, j) => (t ? { side: j } : null)).filter(Boolean) })),
      St(`So it is ${art(right)} ${right.toLowerCase()} triangle.`)] });
  }
  if (v === 1) {
    const right = r.pick(SIDES3), T = TRI[right.toLowerCase()];
    return mc(r, right, SIDES3.filter((x) => x !== right), { q: 'Read the tick marks. Classify this triangle by its sides.', visual: triPic(T), steps: [
      St('Sides with the same number of ticks are equal.', triPic(T, { hl: T.ticks.map((t, j) => (t === 1 ? { side: j } : null)).filter(Boolean) })),
      St(right === 'Equilateral' ? 'All three sides have one tick: all equal.' : right === 'Isosceles' ? 'Two sides have one tick: exactly two are equal.' : 'Each side has a different number of ticks: no sides are equal.'),
      St(`So it is ${art(right)} ${right.toLowerCase()} triangle.`)] });
  }
  if (v === 2) {
    const k = r.int(0, 2), [A, B, C] = anglesOf(r, k), pts = triAngles(A, B), right = ANG3[k];
    const labs = [k === 1 ? '' : `${A}°`, `${B}°`, `${C}°`], pic = (hl) => triPic({ pts, angles: labs, right: k === 1 ? [0] : [], hl });
    return mc(r, right, ANG3.filter((x) => x !== right), { q: 'Classify this triangle by its angles.', visual: pic(), steps: [
      St('By angles: acute has all three angles less than 90°, right has one 90° angle, obtuse has one angle more than 90°.'),
      St(k === 1 ? 'The small square marks a right angle, 90°.' : k === 2 ? `The biggest angle is ${A}°, which is more than 90°.` : `The biggest angle is ${Math.max(A, B, C)}°, which is less than 90°, so all three are.`, pic(k === 1 ? [] : [{ angle: [A, B, C].indexOf(Math.max(A, B, C)) }])),
      St(`So it is ${art(right)} ${right.toLowerCase()} triangle.`)] });
  }
  if (v === 3) {
    const right = r.pick(ANG3), T = TRI[right.toLowerCase()], big = right === 'Right' ? 0 : right === 'Obtuse' ? 1 : null;
    return mc(r, right, ANG3.filter((x) => x !== right), { q: 'Look at the corners. Classify this triangle by its angles.', visual: triPic({ pts: T.pts, right: T.right }), steps: [
      St('Compare each corner with a square corner (90°).'),
      St(right === 'Right' ? 'One corner has the small square: a right angle.' : right === 'Obtuse' ? 'One corner opens wider than a square corner: it is more than 90°.' : 'Every corner is narrower than a square corner.', triPic({ pts: T.pts, right: T.right, arcs: right === 'Acute' ? [0, 1, 2] : big === 1 ? [1] : [] })),
      St(`So it is ${art(right)} ${right.toLowerCase()} triangle.`)] });
  }
  if (v === 4) {
    const ask = r.pick(['right', 'obtuse', 'equilateral', 'scalene']);
    const others = { right: ['acute', 'obtuse', 'equilateral'], obtuse: ['acute', 'right', 'equilateral'], equilateral: ['isosceles', 'scalene', 'Right isosceles'], scalene: ['isosceles', 'equilateral', 'Right isosceles'] }[ask];
    const get = (k) => TRI[k] ?? BOTH[k], all = r.shuffle([ask, ...others]), k = all.indexOf(ask);
    const why = { right: 'it has a right angle (the small square)', obtuse: 'one corner is wider than a right angle', equilateral: 'all three sides have the same tick', scalene: 'its sides all have different ticks, so none are equal' }[ask];
    return letters(k, 4, { q: `Which triangle is ${art(ask)} ${ask} triangle?`, visual: figs(all.map((x) => triPic(get(x), { W: 170, H: 140, pad: 24 }))), steps: [
      St(ask === 'right' || ask === 'obtuse' ? 'Look at the biggest corner of each triangle and compare it with a right angle.' : 'Read the tick marks: sides with the same ticks are equal.'),
      St(`Triangle ${L4[k]}: ${why}.`, figs(all.map((x, i) => triPic(get(x), { W: 170, H: 140, pad: 24, hl: i === k ? 'fill' : null })))),
      St(`So the answer is ${L4[k]}.`)] });
  }
  if (v === 5 && g === 4) {
    const a = r.int(4, 12), b = r.int(3, 2 * a - 2), P = 2 * a + b, pts = triSides(a, a, b);
    const pic = (hl, show) => triPic({ pts, sides: [show ? `${b} cm` : '? cm', `${a} cm`, `${a} cm`], ticks: [0, 1, 1], hl });
    return num(b, [St(`The ticks show the two equal sides: ${a} cm each, so together ${a} + ${a} = ${2 * a} cm.`, pic([{ side: 1 }, { side: 2 }])), St(`The perimeter is ${P} cm, so the base is ${P} − ${2 * a} = ${b} cm.`, pic([{ side: 0 }], true)), St(`So the base is ${b} cm.`)], { q: `This isosceles triangle has a perimeter of ${P} cm. How long is its base, marked ?, in cm?`, visual: pic(), expr: `${P}-2*${a}` });
  }
  if (v === 5) {
    const apex = r.int(10, 70) * 2, base = (180 - apex) / 2, askBase = r.bool(), pts = triAngles(base, base);
    const pic = (show, hl) => triPic({ pts, ticks: [0, 1, 1], angles: askBase ? [show ? `${base}°` : '?', '', `${apex}°`] : [`${base}°`, '', show ? `${apex}°` : '?'], arcs: [1], hl });
    return askBase
      ? num(base, [St('The ticks show two equal sides, so the two angles at the bottom (opposite them) are equal too.', pic(false, [{ angle: 0 }, { angle: 1 }])), St(`The angles add to 180°: 180 − ${apex} = ${180 - apex}, shared equally: ${180 - apex} ÷ 2 = ${base}.`, pic(true, [{ angle: 0 }])), St(`So the angle marked ? is ${base}°.`)], { q: 'This isosceles triangle has its top angle marked. What is the angle marked ?, in degrees?', visual: pic(false), expr: `(180-${apex})/2` })
      : num(apex, [St('The ticks show two equal sides, so the two bottom angles are equal: both are ' + base + '°.', pic(false, [{ angle: 0 }, { angle: 1 }])), St(`The angles add to 180°: 180 − ${base} − ${base} = ${apex}.`, pic(true, [{ angle: 2 }])), St(`So the angle marked ? is ${apex}°.`)], { q: 'In this isosceles triangle one bottom angle is marked. What is the top angle, marked ?, in degrees?', visual: pic(false), expr: `180-2*${base}` });
  }
  if (v === 6) {
    const k = r.int(0, 2), [A, B, C] = anglesOf(r, k), pts = triAngles(A, B);
    const pic = (show, hl) => triPic({ pts, angles: [k === 1 ? '' : `${A}°`, `${B}°`, show ? `${C}°` : '?'], right: k === 1 ? [0] : [], hl });
    return num(C, [St(`The three angles of any triangle add up to 180°.${k === 1 ? ' The small square is 90°.' : ''}`, pic(false, [{ angle: 0 }, { angle: 1 }])), St(`? = 180 − ${A} − ${B} = ${C}.`, pic(true, [{ angle: 2 }])), St(`So the angle marked ? is ${C}°.`)], { q: 'What is the angle marked ?, in degrees?', visual: pic(false), expr: `180-${A}-${B}` });
  }
  const names = Object.keys(BOTH), right = r.pick(names), [an, sd] = right.split(' ');
  const wrongs = r.shuffle([...ANG3.filter((x) => x !== an).map((x) => `${x} ${sd}`), `${an} ${sd === 'isosceles' ? 'scalene' : 'isosceles'}`, `${an} equilateral`]).slice(0, 3);
  return mc(r, right, wrongs, { q: 'Give this triangle both names: by its angles and by its sides.', visual: triPic(BOTH[right]), steps: [
    St(`Angles: ${an === 'Right' ? 'the small square is a right angle' : an === 'Obtuse' ? 'one corner is wider than a right angle' : 'all three corners are smaller than a right angle'}, so it is ${an.toLowerCase()}.`, triPic(BOTH[right], { arcs: an === 'Acute' ? [0, 1, 2] : BOTH[right].arcs })),
    St(`Sides: ${sd === 'isosceles' ? 'two sides have the same tick, so two are equal' : 'every side has different ticks, so none are equal'}: ${sd}.`, triPic(BOTH[right], { hl: (BOTH[right].ticks ?? []).map((t, j) => (t === 1 ? { side: j } : null)).filter(Boolean) })),
    St(`So it is ${art(right)} ${right.toLowerCase()} triangle.`)] });
}

// ───────── quadrilaterals ─────────
const QM = {
  Square: { pts: [[0, 0], [5, 0], [5, 5], [0, 5]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], say: 'four equal sides and four right angles' },
  Rectangle: { pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], say: 'four right angles, with only the opposite sides equal' },
  Rhombus: { pts: [[0, 0], [5, 0], [8, 4], [3, 4]], ticks: [1, 1, 1, 1], say: 'four equal sides but no right angles' },
  Parallelogram: { pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], par: [1, 2, 1, 2], ticks: [1, 2, 1, 2], say: 'two pairs of parallel sides, no right angles, and not all sides equal' },
  Trapezoid: { pts: [[0, 0], [9, 0], [6.5, 4], [2, 4]], par: [1, 0, 1, 0], say: 'exactly one pair of parallel sides' },
  Kite: { pts: [[0, 3], [3, 0], [9, 3], [3, 6]], ticks: [1, 2, 2, 1], say: 'two pairs of equal sides next to each other, and no parallel sides' },
};
const QG = {   // on squared paper: [points, pairs of parallel sides, right angles, why]
  Square: [[[1, 1], [5, 1], [5, 5], [1, 5]], 2, 4, '4 squares along every side and square corners'],
  Rectangle: [[[1, 1], [8, 1], [8, 4], [1, 4]], 2, 4, 'square corners; the sides are 7 and 3 squares long'],
  Rhombus: [[[4, 0], [6, 3], [4, 6], [2, 3]], 2, 0, 'each side goes 2 across and 3 up or down, so all four are equal, but the corners are not square'],
  Parallelogram: [[[1, 1], [6, 1], [8, 4], [3, 4]], 2, 0, 'the top and bottom are parallel, the slanted sides lean the same way, and no corner is square'],
  Trapezoid: [[[1, 1], [8, 1], [6, 4], [3, 4]], 1, 0, 'only the top and bottom are parallel'],
  'Right trapezoid': [[[1, 1], [8, 1], [5, 4], [1, 4]], 1, 2, 'only the top and bottom are parallel, with two square corners on the left'],
  Kite: [[[4, 0], [6, 4], [4, 6], [2, 4]], 0, 0, 'two short sides on top and two long sides below, and no sides parallel'],
};
const qgrid = (k, o = {}) => gridFig({ cols: 9, rows: 7, polys: [{ pts: QG[k][0], t: o.t ?? 'fig', hlSides: o.hlSides }], maxS: 26, Wmax: o.W ?? 260, Hmax: o.H ?? 210 });
const qpic = (k, o = {}) => G.polygonFig({ ...QM[k], ...o });
const STATES = [['Every square is a rectangle.', true, ['Square', 'Rectangle'], 'A square has four right angles, which is all a rectangle needs.'], ['Every square is a rhombus.', true, ['Square', 'Rhombus'], 'A square has four equal sides, which is all a rhombus needs.'], ['Every rectangle is a parallelogram.', true, ['Rectangle', 'Parallelogram'], 'A rectangle has two pairs of parallel sides.'], ['A rhombus is a parallelogram.', true, ['Rhombus', 'Parallelogram'], 'A rhombus has two pairs of parallel sides.'], ['Every rhombus is a square.', false, ['Rhombus', 'Square'], 'A rhombus need not have right angles.'], ['Every rectangle is a square.', false, ['Rectangle', 'Square'], 'A rectangle need not have four equal sides.'], ['Every parallelogram is a rectangle.', false, ['Parallelogram', 'Rectangle'], 'A parallelogram need not have right angles.'], ['A trapezoid has two pairs of parallel sides.', false, ['Trapezoid', 'Parallelogram'], 'A trapezoid has exactly one pair.']];
export function quads(r, g = 4) {
  const v = r.int(0, g === 4 ? 6 : 7), names = Object.keys(QM);
  if (v === 0) {
    const k = r.pick(names);
    return mc(r, k, r.shuffle(names.filter((x) => x !== k)).slice(0, 3), { q: 'Read the marks on the sides and corners. What is the best name for this quadrilateral?', visual: qpic(k), steps: [St('Ticks show equal sides, arrows show parallel sides, and a small square shows a right angle.', qpic(k, { hl: 'fill' })), St(`This one has ${QM[k].say}.`), St(`So it is ${art(k)} ${k.toLowerCase()}.`)] });
  }
  if (v === 1) {
    const k = r.pick(['Square', 'Rectangle', 'Rhombus', 'Parallelogram', 'Trapezoid', 'Kite']);
    return mc(r, k, r.shuffle(names.filter((x) => x !== k)).slice(0, 3), { q: 'Use the squares on the grid. What is the best name for this quadrilateral?', visual: qgrid(k), steps: [St('Count squares to compare the sides, and look for square corners and parallel sides.'), St(`It has ${QG[k][3]}.`, qgrid(k, { t: 'hl2' })), St(`So it is ${art(k)} ${k.toLowerCase()}.`)] });
  }
  if (v === 2) {
    const k = r.pick(Object.keys(QG)), p = QG[k][1], hs = p === 2 ? [0, 1, 2, 3] : p === 1 ? [0, 2] : [];
    return num(p, [St('Parallel sides point the same way and never meet, like the lines on the grid.'), St(p ? `${p === 2 ? 'Top and bottom are parallel, and so are the two other sides' : 'Only the top and bottom are parallel'}.` : 'No two sides point the same way.', qgrid(k, { hlSides: hs })), St(`So it has ${p} pair${p === 1 ? '' : 's'} of parallel sides.`)], { q: 'How many pairs of parallel sides does this quadrilateral have?', visual: qgrid(k), expr: String(p) });
  }
  if (v === 3) {
    const k = r.pick(Object.keys(QG)), n = QG[k][2];
    return num(n, [St('A right angle is a square corner, like the corners of the grid squares.'), St(n === 4 ? 'All four corners are square.' : n === 2 ? 'The two corners on the left are square; the other two are not.' : 'None of the corners is square: they are all wider or narrower.', qgrid(k, { t: 'hl2' })), St(`So it has ${n} right angle${n === 1 ? '' : 's'}.`)], { q: 'How many right angles does this quadrilateral have?', visual: qgrid(k), expr: String(n) });
  }
  if (v === 4) {
    const [s, t, [p, q2], why] = r.pick(STATES);
    return mc(r, t ? 'True' : 'False', [t ? 'False' : 'True'], { q: `True or false? ${s}`, steps: [St('Compare what each shape must have.', figs([qpic(p, { W: 200, H: 150 }), qpic(q2, { W: 200, H: 150 })], [p, q2])), St(why), St(`So it is ${t ? 'true' : 'false'}.`)] });
  }
  if (v === 5) {
    const ask = r.pick(['Rhombus', 'Trapezoid', 'Rectangle', 'Parallelogram', 'Kite']), all = r.shuffle([ask, ...r.shuffle(names.filter((x) => x !== ask && !(ask === 'Rhombus' && x === 'Square') && !(ask === 'Rectangle' && x === 'Square') && !(ask === 'Parallelogram' && ['Square', 'Rectangle', 'Rhombus'].includes(x)))).slice(0, 3)]), k = all.indexOf(ask);
    return letters(k, all.length, { q: `Read the marks. Which shape is ${art(ask)} ${ask.toLowerCase()}?`, visual: figs(all.map((x) => qpic(x, { W: 180, H: 140 }))), steps: [St(`${cap(art(ask))} ${ask.toLowerCase()} has ${QM[ask].say}.`), St(`Only shape ${L4[k]} has those marks.`, figs(all.map((x, i) => qpic(x, { W: 180, H: 140, hl: i === k ? 'fill' : null })))), St(`So the answer is ${L4[k]}.`)] });
  }
  if (v === 6) {
    const k = r.pick(['Rectangle', 'Parallelogram', 'Rhombus', 'Square']), a = r.int(3, 15), b = k === 'Rhombus' || k === 'Square' ? a : r.int(2, 12);
    const askSide = r.pick([2, 3]), known = askSide === 2 ? a : b, labs = [`${a} cm`, k === 'Rhombus' || k === 'Square' ? '' : `${b} cm`, '', ''];
    labs[askSide] = '? cm';
    const [da, db] = disp(a, b), pts = k === 'Rectangle' ? rectPts(da, db) : k === 'Parallelogram' ? [[0, 0], [da, 0], [da + db * 0.5, db * 0.87], [db * 0.5, db * 0.87]] : QM[k].pts, base = { pts, ticks: QM[k].ticks, right: QM[k].right, par: QM[k].par };
    return num(known, [St(`In ${art(k)} ${k.toLowerCase()} opposite sides are equal${k === 'Rhombus' || k === 'Square' ? ', and here all four sides are equal (one tick each)' : ''}.`, G.polygonFig({ ...base, sides: labs, hl: [{ side: askSide }, { side: askSide - 2 }] })), St(`The side marked ? matches the side opposite it: ${known} cm.`), St(`So the side marked ? is ${known} cm.`)], { q: `This is ${art(k)} ${k.toLowerCase()}. How long is the side marked ?, in cm?`, visual: G.polygonFig({ ...base, sides: labs }), expr: String(known) });
  }
  let a, b, c, d; do { a = r.int(12, 26) * 5; b = r.int(12, 26) * 5; c = r.int(12, 26) * 5; d = 360 - a - b - c; } while (d < 55 || d > 150);
  const pts = [[0, 0], [8, 0], [9, 5], [1.5, 4.2]], pic = (show, hl) => G.polygonFig({ pts, angles: [`${a}°`, `${b}°`, `${c}°`, show ? `${d}°` : '?'], hl });
  return num(d, [St('A quadrilateral can be cut into two triangles, so its four angles add to 2 × 180° = 360°.', G.polygonFig({ pts, diag: [[0, 2]], regions: [{ pts: [pts[0], pts[1], pts[2]], t: 'hl' }, { pts: [pts[0], pts[2], pts[3]], t: 'hl2' }] })), St(`Add the three you know: ${a} + ${b} + ${c} = ${a + b + c}. Then 360 − ${a + b + c} = ${d}.`, pic(true, [{ angle: 3 }])), St(`So the angle marked ? is ${d}°.`)], { q: 'Find the angle marked ? in this quadrilateral. (Not drawn to scale.)', visual: pic(false), expr: `360-${a}-${b}-${c}` });
}

// ───────── symmetry and transformations ─────────
const regLines = (n) => { const st = -90 - 180 / n, s = new Set(); for (let i = 0; i < n; i++) for (const a of [st + (360 * i) / n, st + (360 * i) / n + 180 / n]) s.add(Math.round((((a % 180) + 180) % 180) * 10) / 10); return [...s]; };
const SYMS = [
  { n: 'square', pts: rectPts(4, 4), c: [2, 2], lines: [0, 90, 45, 135], rot: 4, wrong: [] },
  { n: 'rectangle', pts: rectPts(6, 3.4), c: [3, 1.7], lines: [0, 90], rot: 2, wrong: [(Math.atan2(3.4, 6) * 180) / PI] },
  { n: 'equilateral triangle', pts: G.regular(3), c: [0, 0], lines: regLines(3), rot: 3, wrong: [] },
  { n: 'regular pentagon', pts: G.regular(5), c: [0, 0], lines: regLines(5), rot: 5, wrong: [] },
  { n: 'regular hexagon', pts: G.regular(6), c: [0, 0], lines: regLines(6), rot: 6, wrong: [] },
  { n: 'regular octagon', pts: G.regular(8), c: [0, 0], lines: regLines(8), rot: 8, wrong: [] },
  { n: 'isosceles triangle', pts: [[0, 0], [5, 0], [2.5, 6.5]], c: [2.5, 2.4], lines: [90], rot: 1, wrong: [0] },
  { n: 'rhombus', pts: [[0, 3.5], [2, 0], [4, 3.5], [2, 7]], c: [2, 3.5], lines: [0, 90], rot: 2, wrong: [60.3] },
  { n: 'kite', pts: [[2, 0], [4, 4], [2, 7], [0, 4]], c: [2, 4], lines: [90], rot: 1, wrong: [0] },
  { n: 'trapezoid', pts: [[0, 0], [7, 0], [5, 3.5], [2, 3.5]], c: [3.5, 1.75], lines: [90], rot: 1, wrong: [0] },
  { n: 'parallelogram', pts: [[0, 0], [5, 0], [7, 3.5], [2, 3.5]], c: [3.5, 1.75], lines: [], rot: 2, wrong: [0, 90] },
  { n: 'scalene triangle', pts: [[0, 0], [7, 0], [2, 4]], c: [3, 1.6], lines: [], rot: 1, wrong: [90] },
];
const symSeg = (sh, deg) => { const L = Math.max(...sh.pts.map((p) => Math.hypot(p[0] - sh.c[0], p[1] - sh.c[1]))) * 1.22, d = [Math.cos(rad(deg)), Math.sin(rad(deg))]; return [sub(sh.c, mulv(d, L)), add(sh.c, mulv(d, L))]; };
const symPic = (sh, degs, o = {}) => { const segs = degs.map((d) => symSeg(sh, d)); return G.polygonFig({ pts: sh.pts, cuts: segs, extra: segs.flat(), W: o.W ?? 220, H: o.H ?? 190, pad: 20, hl: o.hl }); };
// chiral shapes on squared paper (no line or turn makes them match themselves), for slides, flips and turns
const CHIRAL = [[[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 3], [0, 3]]];
const shiftP = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
const boxOf = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), x1: Math.max(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), y1: Math.max(...pts.map((p) => p[1])) });
const toCorner = (pts, x, y) => { const b = boxOf(pts); return shiftP(pts, x - b.x0, y - b.y0); };
function moveShapes(r, kind, rows = 7) {
  const base = r.pick(CHIRAL), A = shiftP(base, 1, r.int(1, rows - 4));
  let B, c = null, dx = 0, dy = 0;
  if (kind === 'Translation') { dx = r.int(5, 7); dy = r.int(-1, 1); if (boxOf(A).y0 + dy < 1 || boxOf(A).y1 + dy > rows - 1) dy = 0; B = shiftP(A, dx, dy); }
  else if (kind === 'Reflection') { c = r.pick([5, 5.5, 6]); B = A.map(([x, y]) => [2 * c - x, y]); }
  else { const turned = r.bool() ? A.map(([x, y]) => [-x, -y]) : A.map(([x, y]) => [y, -x]); const b = boxOf(turned); B = toCorner(turned, 7, r.int(1, rows - 1 - (b.y1 - b.y0))); }
  return { A, B, c, dx, dy };
}
const moveGrid = (M, o = {}) => {
  const lab = (P, s) => { const b = boxOf(P); return { at: [(b.x0 + b.x1) / 2, b.y1 + 0.5], s, t: 'muted' }; };
  return gridFig({ cols: 12, rows: 7, polys: [{ pts: M.A, t: 'fig' }, { pts: M.B, t: o.hlB ? 'hl' : 'hl2' }], notes: [lab(M.A, 'A'), lab(M.B, 'B')], lines: o.mirror && M.c != null ? [{ a: [M.c, 0], b: [M.c, 7] }] : [], arrows: o.arrow ? [{ a: M.A[0], b: M.B[0] }] : [], dots: o.arrow ? [{ at: M.A[0] }, { at: M.B[0], t: 'hl' }] : [] });
};
const LETTERS_Y = ['A', 'H', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y'], LETTERS_N = ['F', 'G', 'J', 'L', 'N', 'P', 'R', 'S', 'Z'];
const letterFig = (ch, hl) => fig([...(hl ? [line([45, 6], [45, 86], 'aux')] : []), text([45, 48], ch, hl ? 'hl' : 'ink', { size: 60 })], 90, 92);
export function symmetry(r, g = 4) {
  const v = r.int(0, g === 4 ? 6 : 9);
  if (v === 0) {
    const sh = r.pick(SYMS), k = sh.lines.length;
    return num(k, [St('A line of symmetry folds the shape into two halves that match exactly.'), St(k ? `Here ${k === 1 ? 'is the only fold line that works' : `are all ${k} fold lines that work`}.` : 'Try folding it every way: the halves never match.', symPic(sh, sh.lines)), St(`So the ${sh.n} has ${k} line${k === 1 ? '' : 's'} of symmetry.`)], { q: `How many lines of symmetry does this ${sh.n} have?`, visual: symPic(sh, []), expr: String(k) });
  }
  if (v === 1) {
    const yes = r.bool(), pool = SYMS.filter((s) => (yes ? s.lines.length : s.wrong.length)), sh = r.pick(pool), deg = r.pick(yes ? sh.lines : sh.wrong);
    return yesNo(r, yes, { q: `Is the dashed line a line of symmetry of this ${sh.n}?`, visual: symPic(sh, [deg]), steps: [St('Imagine folding the shape along the dashed line. Do the two halves land exactly on each other?', symPic(sh, [deg], { hl: 'fill' })), St(yes ? 'Each corner lands on a matching corner on the other side.' : sh.n === 'rectangle' ? 'Folding along a diagonal, the corners do not land on each other: the halves stick out.' : 'The two halves are different shapes, so they do not match.'), St(`So the answer is ${yes ? 'yes' : 'no'}.`)] });
  }
  if (v === 2) {
    const right = r.pick(LETTERS_Y), all = r.shuffle([right, ...r.shuffle(LETTERS_N).slice(0, 3)]), k = all.indexOf(right);
    return letters(k, 4, { q: 'Which letter has a line of symmetry going straight up and down?', visual: figs(all.map((ch) => letterFig(ch))), steps: [St('Imagine folding each letter down the middle, top to bottom.'), St(`Only ${right} folds into two matching halves.`, figs(all.map((ch, i) => letterFig(ch, i === k)))), St(`So the answer is ${L4[k]}.`)] });
  }
  if (v === 3) {
    const cells = [], c = 5;
    for (const x of [2, 3, 4]) { if (x < 4 && r.bool(0.3)) continue; const y0 = r.int(0, 2), y1 = r.int(y0, Math.min(4, y0 + 3)); for (let y = y0; y <= y1; y++) cells.push([x, y + 1]); }
    const n = cells.length, mirror = cells.map(([x, y]) => [2 * c - x - 1, y, 'hl2']);
    const gf = (show) => gridFig({ cols: 10, rows: 7, cells: [...cells.map(([x, y]) => [x, y, 'fig']), ...(show ? mirror : [])], lines: [{ a: [c, 0], b: [c, 7] }], maxS: 28 });
    return num(2 * n, [St('The dashed line is a line of symmetry, so every square has a partner the same distance away on the other side.', gf(true)), St(`The half that is drawn has ${n} squares, and the other half has ${n} too: ${n} + ${n} = ${2 * n}.`), St(`So the whole shape covers ${2 * n} squares.`)], { q: 'Half of a shape is drawn. The dashed line is its line of symmetry. How many squares will the whole shape cover?', visual: gf(false), expr: `2*${n}` });
  }
  if (v === 4) {
    const sh = r.pick(SYMS), [tname, parts] = r.pick([['a quarter turn (90°)', 4], ['a half turn (180°)', 2], ['a third of a turn (120°)', 3]]), yes = sh.rot % parts === 0;
    const pic = G.polygonFig({ pts: sh.pts, extra: [], W: 200, H: 170, notes: [{ at: sh.c, s: '•' }] });
    return yesNo(r, yes, { q: `This ${sh.n} is turned ${tname} about its centre (the dot). Does it look exactly the same?`, visual: pic, steps: [St(`Turn the ${sh.n} a full turn about its centre and count how many times it looks the same: ${sh.rot}.`, pic), St(yes ? `${cap(tname)} is one of those positions (${parts} of them make a full turn, and ${sh.rot} ÷ ${parts} has no remainder).` : `${cap(tname)} is not one of those positions.`), St(`So the answer is ${yes ? 'yes' : 'no'}.`)] });
  }
  if (v === 5) {
    const kind = r.pick(['Translation', 'Reflection', 'Rotation']), M = moveShapes(r, kind);
    const why = { Translation: 'Every corner of A moved the same distance in the same direction, and B faces the same way: a slide.', Reflection: 'B is the mirror image of A in the dashed line: a flip.', Rotation: 'B is A turned round to face a different way, not flipped over: a turn.' }[kind];
    return mc(r, kind, ['Translation', 'Reflection', 'Rotation'].filter((x) => x !== kind), { q: 'Shape A moves to shape B. Which move is it: a slide (translation), a flip (reflection) or a turn (rotation)?', visual: moveGrid(M), steps: [St('Slide = translation, flip = reflection, turn = rotation. Compare which way the shapes face.'), St(why, moveGrid(M, { mirror: true, arrow: kind === 'Translation', hlB: true })), St(`So it is a ${kind.toLowerCase()}.`)] });
  }
  if (v === 6) {
    const M = moveShapes(r, 'Translation'), up = M.dy > 0 ? `${M.dy} up` : M.dy < 0 ? `${-M.dy} down` : '';
    return num(M.dx, [St('Pick one corner of A and find the matching corner of B.', moveGrid(M, { arrow: true, hlB: true })), St(`Count the squares across from one to the other: ${M.dx}${up ? `, and ${up}` : ''}.`), St(`So the shape slid ${M.dx} units to the right.`)], { q: 'Shape A slides to shape B. How many units to the right did it slide?', visual: moveGrid(M), expr: String(M.dx) });
  }
  if (v === 7) {
    const sh = r.pick(SYMS.filter((s) => s.rot > 1 || r.bool(0.2))), k = sh.rot;
    return num(k, [St('Turn the shape about its centre. Count the positions in one full turn where it looks exactly the same as at the start.'), St(k > 1 ? `It matches itself every ${dec(360 / k)}°: ${k} times in a full turn.` : 'It only looks the same after a full turn.', symPic(sh, sh.lines.length === k ? sh.lines : [])), St(`So its order of rotational symmetry is ${k}.`)], { q: `What is the order of rotational symmetry of this ${sh.n}?`, visual: symPic(sh, []), expr: String(k) });
  }
  if (v === 8) {
    const x = r.int(1, 5), y = r.int(4, 8), a = r.int(1, 4), b = r.int(1, 3), down = r.bool(), ny = down ? y - b : Math.min(10, y + b), bb = Math.abs(ny - y), right = `(${x + a}, ${ny})`;
    const gf = (show) => gridFig({ cols: 10, rows: 10, axes: true, maxS: 22, dots: [{ at: [x, y], s: 'P' }, ...(show ? [{ at: [x + a, ny], s: "P'", t: 'hl' }] : [])], arrows: show ? [{ a: [x, y], b: [x + a, y] }, ...(bb ? [{ a: [x + a, y], b: [x + a, ny] }] : [])] : [] });
    const wrongs = [`(${x + a}, ${down ? y + b : y - b})`, `(${Math.abs(x - a)}, ${ny})`, `(${ny}, ${x + a})`, `(${x + b}, ${down ? y - a : y + a})`].filter((s) => s !== right);
    return mc(r, right, wrongs, { q: `Point P is translated ${a} unit${a > 1 ? 's' : ''} right and ${bb} unit${bb === 1 ? '' : 's'} ${down ? 'down' : 'up'}. Where does it end up?`, visual: gf(false), steps: [St(`P is at (${x}, ${y}). Moving right adds to the first number: ${x} + ${a} = ${x + a}.`), St(`Moving ${down ? 'down subtracts from' : 'up adds to'} the second number: ${y} ${down ? '−' : '+'} ${bb} = ${ny}.`, gf(true)), St(`So it ends up at ${right}.`)] });
  }
  const a = r.int(2, 4), b = r.int(a + 1, 5), kind = r.int(0, 2), [c, d] = kind === 0 ? [b, a] : kind === 1 ? [a, b] : r.pick([[a, b + 1], [a + 1, b]]), yes = kind < 2;
  const gf = (hl) => gridFig({ cols: 13, rows: 7, polys: [{ pts: shiftP(rectPts(a, b), 1, 1), t: hl ? 'hl2' : 'fig' }, { pts: shiftP(rectPts(c, d), 7, 1), t: hl ? 'hl' : 'fig' }], notes: [{ at: [1 + a / 2, b + 1.5], s: 'A', t: 'muted' }, { at: [7 + c / 2, d + 1.5], s: 'B', t: 'muted' }] });
  return yesNo(r, yes, { q: 'Are rectangles A and B congruent?', visual: gf(false), steps: [St('Congruent figures have the same size and shape: one fits exactly on the other after a slide, flip or turn.'), St(`A is ${a} by ${b}; B is ${c} by ${d}.${kind === 0 ? ' B is A turned on its side.' : ''}`, gf(true)), St(yes ? 'They match, so yes.' : 'The sides do not match, so no.')] });
}

// ───────── solids ─────────
const SOLID = {
  cube: { fev: [6, 12, 8], pic: () => G.boxFig({ l: 4, w: 4, h: 4 }), faces: 'squares', count: { squares: 6 }, why: ['6 square faces: top, bottom, front, back, left and right', '4 edges round the top, 4 round the bottom and 4 going up: 12', '4 corners on top and 4 on the bottom: 8'] },
  'rectangular prism': { fev: [6, 12, 8], pic: () => G.boxFig({ l: 7, w: 3, h: 4 }), faces: 'rectangles', count: { rectangles: 6 }, why: ['6 rectangle faces in 3 matching pairs', '4 edges round the top, 4 round the bottom and 4 going up: 12', '4 corners on top and 4 on the bottom: 8'] },
  'triangular prism': { fev: [5, 9, 6], pic: () => G.prismFig({ base: [[0, 0], [5, 0], [2.5, 4]], depth: 6 }), faces: 'triangles and rectangles', count: { triangles: 2, rectangles: 3 }, why: ['2 triangles at the ends and 3 rectangles round the sides: 5', '3 edges round each triangle (6) and 3 joining them: 9', '3 corners on each triangle: 6'] },
  'square pyramid': { fev: [5, 8, 5], pic: () => G.pyramidFig({ a: 5, h: 6 }), faces: 'a square and triangles', count: { triangles: 4, squares: 1 }, why: ['1 square base and 4 triangles: 5', '4 edges round the base and 4 going up to the top: 8', '4 corners on the base and 1 at the top: 5'] },
  'triangular pyramid': { fev: [4, 6, 4], pic: () => G.pyramidFig({ a: 5, h: 6, tri: true }), faces: 'triangles', count: { triangles: 4 }, why: ['a triangle base and 3 triangles round it: 4', '3 edges round the base and 3 going up to the top: 6', '3 corners on the base and 1 at the top: 4'] },
  'pentagonal prism': { fev: [7, 15, 10], pic: () => G.prismFig({ base: G.regular(5, 3), depth: 5 }), faces: 'pentagons and rectangles', count: { pentagons: 2, rectangles: 5 }, why: ['2 pentagons and 5 rectangles: 7', '5 edges round each pentagon (10) and 5 joining them: 15', '5 corners on each pentagon: 10'] },
  'hexagonal prism': { fev: [8, 18, 12], pic: () => G.prismFig({ base: G.regular(6, 3), depth: 5 }), faces: 'hexagons and rectangles', count: { hexagons: 2, rectangles: 6 }, why: ['2 hexagons and 6 rectangles: 8', '6 edges round each hexagon (12) and 6 joining them: 18', '6 corners on each hexagon: 12'] },
};
const CURVED = { cylinder: () => G.cylinderFig({ r: 3, h: 5 }), cone: () => G.coneFig({ r: 3, h: 5 }), sphere: () => G.sphereFig() };
const solidPic = (n) => (SOLID[n] ? SOLID[n].pic() : CURVED[n]());
const NETS = { cube: ['6 squares', () => G.netFig({ cells: G.CUBE_NETS[5] })], 'rectangular prism': ['6 rectangles in 3 matching pairs', () => G.boxNet({ l: 6, w: 3, h: 4 })], 'triangular prism': ['2 triangles and 3 rectangles', () => G.triPrismNet()], 'square pyramid': ['1 square and 4 triangles', () => G.pyramidNet()], 'triangular pyramid': ['4 triangles', () => triPyrNet()], cylinder: ['2 circles and a rectangle', () => G.cylinderNet()], cone: ['a circle and a curved slice of a bigger circle', () => G.coneNet()] };
const OBJECTS = [['a ball', 'sphere'], ['a soup can', 'cylinder'], ['an ice cream cone', 'cone'], ['a number cube (a die)', 'cube'], ['a cereal box', 'rectangular prism'], ['a pup tent', 'triangular prism'], ['the pyramids of Egypt', 'square pyramid']];
export function solids(r, g = 4) {
  const v = r.int(0, g === 4 ? 6 : 8), flat = Object.keys(SOLID).filter((s) => g === 5 || !/pent|hex/.test(s)), all = [...flat, 'cylinder', 'cone', 'sphere'];
  if (v === 0) {
    const s = r.pick(flat), k = r.int(0, 2), what = ['faces', 'edges', 'vertices'][k], n = SOLID[s].fev[k];
    return num(n, [St(`This is ${art(s)} ${s}. ${['A face is a flat surface', 'An edge is where two faces meet', 'A vertex is a corner where edges meet'][k]}. Dashed edges are at the back: count them too.`, solidPic(s)), St(`${cap(SOLID[s].why[k])}.`), St(`So it has ${n} ${what}.`)], { q: `How many ${what} does this ${s} have?`, visual: solidPic(s), expr: String(n) });
  }
  if (v === 1) {
    const s = r.pick(all), say = SOLID[s] ? `its faces are ${SOLID[s].faces}` : { cylinder: 'two equal circles joined by a curved surface', cone: 'one circle and a curved surface that comes to a point', sphere: 'one curved surface, like a ball' }[s];
    return mc(r, cap(s), r.shuffle(all.filter((x) => x !== s)).slice(0, 3).map(cap), { q: 'What is the name of this 3D figure?', visual: solidPic(s), steps: [St(`Look at its faces: ${say}.`, solidPic(s)), St(`So it is ${art(s)} ${s}.`)] });
  }
  if (v === 2) {
    const s = r.pick(Object.keys(NETS)), [d, f] = NETS[s];
    return mc(r, cap(s), r.shuffle(Object.keys(NETS).filter((x) => x !== s)).slice(0, 3).map(cap), { q: 'This net is folded up along its edges. What 3D figure does it make?', visual: f(), steps: [St(`Each piece of a net becomes one face. This net has ${d}.`, f()), St(`Folded up, they make ${art(s)} ${s}.`, solidPic(s)), St(`So it is ${art(s)} ${s}.`)] });
  }
  if (v === 3) {
    const good = r.pick(G.CUBE_NETS), bad = r.shuffle(G.NOT_CUBE_NETS).slice(0, 3), list = r.shuffle([good, ...bad]), k = list.indexOf(good);
    return letters(k, 4, { q: 'Each net has 6 squares. Which one folds into a cube?', visual: figs(list.map((cells) => G.netFig({ cells }))), steps: [St('Fold each net in your mind, keeping one square as the bottom. Two squares must never land on the same face.'), St('Nets that never work: a row of 5 or more squares, a 2 × 2 block of squares, or two squares folding onto the same side.', figs(list.map((cells, i) => G.netFig({ cells, hl: i === k ? [0, 1, 2, 3, 4, 5] : [] })))), St(`Only net ${L4[k]} gives every square its own face. So the answer is ${L4[k]}.`)] });
  }
  if (v === 4) {
    const D = [['6 square faces that are all the same', 'cube'], ['2 circle faces and a curved surface', 'cylinder'], ['1 circle face, a curved surface and one point at the top', 'cone'], ['a curved surface with no flat faces, no edges and no vertices', 'sphere'], ['a square base and 4 triangle faces that meet at a point', 'square pyramid'], ['2 triangle faces and 3 rectangle faces', 'triangular prism'], ['6 rectangle faces', 'rectangular prism']], [d, s] = r.pick(D);
    return mc(r, cap(s), r.shuffle(D.map((x) => x[1]).filter((x) => x !== s)).slice(0, 3).map(cap), { q: `Which 3D figure has ${d}?`, steps: [St('Match the faces to the figure.'), St(`${cap(d)}: that is ${art(s)} ${s}.`, solidPic(s)), St(`So it is ${art(s)} ${s}.`)] });
  }
  if (v === 5) {
    const [t, s] = r.pick(OBJECTS);
    return mc(r, cap(s), r.shuffle(OBJECTS.map((x) => x[1]).filter((x) => x !== s)).slice(0, 3).map(cap), { q: `Which 3D figure has the shape of ${t}?`, steps: [St(`Think about the faces of ${t}: flat or curved, and what shape.`), St(`${cap(t)} has the shape of ${art(s)} ${s}.`, solidPic(s)), St(`So it is ${art(s)} ${s}.`)] });
  }
  if (v === 6) {
    const s = r.pick(flat.filter((x) => Object.keys(SOLID[x].count).length > 1 || r.bool(0.3))), [shape, n] = r.pick(Object.entries(SOLID[s].count));
    return num(n, [St(`Look at every face of the ${s}, including the ones at the back (dashed edges).`, solidPic(s)), St(`Its faces are ${Object.entries(SOLID[s].count).map(([k, c]) => `${c} ${c === 1 ? k.replace(/s$/, '') : k}`).join(' and ')}.`), St(`So ${n} of its faces ${n === 1 ? 'is a' : 'are'} ${n === 1 ? shape.replace(/s$/, '') : shape}.`)], { q: `How many faces of this ${s} are ${shape}?`, visual: solidPic(s), expr: String(n) });
  }
  if (v === 7) {
    const len = r.int(3, 5), hs = Array.from({ length: len }, () => r.int(1, 3)), deep = r.bool(), cubes = [];
    hs.forEach((h, x) => { for (let y = 0; y < h; y++) { cubes.push([x, y, 0]); if (deep) cubes.push([x, y, 1]); } });
    const tot = cubes.length, per = hs.reduce((a, b) => a + b, 0);
    return num(tot, [St(`Count the stacks along the front, from left to right: ${hs.join(' + ')} = ${per} cubes.`, cubesFig(cubes, { hl: ([, , z]) => z === 0 })), ...(deep ? [St(`Every stack has a matching stack behind it, so double: ${per} × 2 = ${tot}.`, cubesFig(cubes, { hl: ([, , z]) => z === 1 }))] : []), St(`So there are ${tot} cubes.`)], { q: `How many cubes are in this solid? ${deep ? 'It is 2 cubes deep, and every stack' : 'Every stack'} goes all the way down to the table.`, visual: cubesFig(cubes), expr: String(tot) });
  }
  const s = r.pick(flat), right = SOLID[s].faces;
  const wrongs = [...new Set(Object.values(SOLID).map((x) => x.faces))].filter((x) => x !== right && !(s === 'cube' && x === 'rectangles') && !(s === 'rectangular prism' && x === 'squares'));
  return mc(r, cap(right), r.shuffle(wrongs).slice(0, 3).map(cap), { q: `What shapes are the faces of this ${s}?`, visual: solidPic(s), steps: [St(`Look at each flat face, front and back.`, solidPic(s)), St(`${cap(SOLID[s].why[0])}.`), St(`So its faces are ${right}.`)] });
}

// ───────── perimeter (4-perimeter, 5-perim) ─────────
const rectPic = (L, W, u, o = {}) => { const [x, y] = disp(L, W); return G.polygonFig({ pts: rectPts(x, y), sides: o.sides ?? [`${L} ${u}`, `${W} ${u}`, '', ''], right: [0, 1, 2, 3], hl: o.hl, regions: o.regions, notes: o.notes, W: o.W, H: o.H }); };
const Lpts = (W, H, a, c) => [[0, 0], [W, 0], [W, a], [c, a], [c, H], [0, H]];
const gridRect = (L, W, o = {}) => gridFig({ cols: L + 2, rows: W + 2, cells: o.cells, polys: o.noPoly ? [] : [{ pts: shiftP(rectPts(L, W), 1, 1), t: o.t ?? 'fig', hlSides: o.hlSides }], maxS: 26 });
export function perimeter(r, g = 4) {
  const v = r.int(0, 7), u = r.pick(['cm', 'm']);
  if (v === 0) {
    const n = r.int(3, 6), pts = jag(r, n, 0.3), sides = pts.map(() => (g === 4 ? r.int(2, 15) : r.int(11, 99) / 10)), P = dec(sides.reduce((a, b) => a + b, 0));
    const pic = (hl) => G.polygonFig({ pts, sides: sides.map((s) => `${s} ${u}`), hl });
    return num(P, [St('Perimeter is the distance all the way round: add every side.', pic(pts.map((_, j) => ({ side: j })))), St(`${sides.join(' + ')} = ${P}.`), St(`So the perimeter is ${P} ${u}.`)], { q: `What is the perimeter of this shape, in ${u}? (Not drawn to scale.)`, visual: pic(), expr: sides.join('+') });
  }
  if (v === 1) {
    const L = r.int(2, 8), W = r.int(1, 5), P = 2 * (L + W);
    return num(P, [St(`Count the unit lengths along each side: ${L} along the bottom and top, ${W} up each side.`, gridRect(L, W, { hlSides: [0, 1, 2, 3] })), St(`${L} + ${W} + ${L} + ${W} = ${P}.`), St(`So the perimeter is ${P} units.`)], { q: 'Each grid square is 1 unit long. What is the perimeter of the rectangle, in units?', visual: gridRect(L, W), expr: `2*(${L}+${W})` });
  }
  if (v === 2) {
    const L = r.int(3, g === 4 ? 25 : 40), W = r.int(2, g === 4 ? 15 : 30), P = 2 * (L + W);
    return num(P, [St('A rectangle has two lengths and two widths: opposite sides are equal.', rectPic(L, W, u, { sides: [`${L} ${u}`, `${W} ${u}`, `${L} ${u}`, `${W} ${u}`], hl: [{ side: 0 }, { side: 2 }] })), St(`2 × ${L} + 2 × ${W} = ${2 * L} + ${2 * W} = ${P}.`), St(`So the perimeter is ${P} ${u}.`)], { q: `What is the perimeter of this rectangle, in ${u}?`, visual: rectPic(L, W, u), expr: `2*(${L}+${W})` });
  }
  if (v === 3) {
    const L = r.int(4, 30), W = r.int(2, 20), P = 2 * (L + W), sides = [`${L} ${u}`, `w`, '', ''];
    return num(W, [St(`The two lengths together: 2 × ${L} = ${2 * L} ${u}.`, rectPic(L, W, u, { sides: [`${L} ${u}`, 'w', `${L} ${u}`, 'w'], hl: [{ side: 0 }, { side: 2 }] })), St(`The two widths share the rest: ${P} − ${2 * L} = ${2 * W}, and ${2 * W} ÷ 2 = ${W}.`, rectPic(L, W, u, { sides: [`${L} ${u}`, 'w', `${L} ${u}`, 'w'], hl: [{ side: 1 }, { side: 3 }] })), St(`So the width is ${W} ${u}.`)], { q: `This rectangle has a perimeter of ${P} ${u}. What is its width w, in ${u}?`, visual: rectPic(L, W, u, { sides }), expr: `(${P}-2*${L})/2` });
  }
  if (v === 4) {
    const a = r.int(3, 12), b = r.int(3, 12), c = r.int(Math.abs(a - b) + 2, a + b - 2), P = a + b + c, pts = triSides(a, b, c);
    const pic = (hl, show) => G.polygonFig({ pts, sides: [show ? `${c} ${u}` : `? ${u}`, `${a} ${u}`, `${b} ${u}`], hl });
    return num(c, [St(`Add the two sides you know: ${a} + ${b} = ${a + b}.`, pic([{ side: 1 }, { side: 2 }])), St(`The third side is the rest of the perimeter: ${P} − ${a + b} = ${c}.`, pic([{ side: 0 }], true)), St(`So the missing side is ${c} ${u}.`)], { q: `This triangle has a perimeter of ${P} ${u}. How long is the side marked ?, in ${u}?`, visual: pic(), expr: `${P}-${a}-${b}` });
  }
  if (v === 5) {
    const n = r.int(3, 8), s = g === 4 ? r.int(2, 12) : r.int(11, 60) / 10, P = dec(n * s), pts = G.regular(n);
    const pic = (hl) => G.polygonFig({ pts, ticks: Array(n).fill(1), sides: [`${s} ${u}`], hl });
    return num(P, [St(`This is a regular ${NG[n]}: the ticks show that all ${n} sides are equal, ${s} ${u} each.`, pic(pts.map((_, j) => ({ side: j })))), St(`${n} × ${s} = ${P}.`), St(`So the perimeter is ${P} ${u}.`)], { q: `All the sides of this ${NG[n]} are equal. What is its perimeter, in ${u}?`, visual: pic(), expr: `${n}*${s}` });
  }
  if (v === 6) {
    const W = r.int(6, 14), H = r.int(6, 14), a = r.int(2, H - 3), c = r.int(2, W - 3), P = 2 * (W + H), pts = Lpts(W, H, a, c);
    const pic = (show) => G.polygonFig({ pts, sides: [`${W} ${u}`, `${a} ${u}`, show === 'x' || show === 'all' ? `${W - c} ${u}` : 'x', show === 'y' || show === 'all' ? `${H - a} ${u}` : 'y', `${c} ${u}`, `${H} ${u}`], right: [0, 1, 2, 4, 5], hl: show === 'x' ? [{ side: 2 }, { side: 4 }, { side: 0 }] : show === 'y' ? [{ side: 3 }, { side: 1 }, { side: 5 }] : null });
    return num(P, [St(`Find the missing sides first. Across: the bottom (${W}) is the top (${c}) plus x, so x = ${W} − ${c} = ${W - c}.`, pic('x')), St(`Up: the left side (${H}) is ${a} plus y, so y = ${H} − ${a} = ${H - a}.`, pic('y')), St(`Add all six sides: ${W} + ${a} + ${W - c} + ${H - a} + ${c} + ${H} = ${P}.`, pic('all')), St(`So the perimeter is ${P} ${u}.`)], { q: `All the corners of this shape are right angles. What is its perimeter, in ${u}?`, visual: pic(''), expr: `2*(${W}+${H})` });
  }
  if (r.bool()) {
    const s = r.int(2, 25), P = 4 * s;
    return num(s, [St('A square has 4 equal sides (one tick each).', G.polygonFig({ pts: rectPts(4, 4), ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], sides: ['s', 's', 's', 's'], hl: [0, 1, 2, 3].map((side) => ({ side })) })), St(`So each side is ${P} ÷ 4 = ${s}.`), St(`So each side is ${s} ${u}.`)], { q: `This square has a perimeter of ${P} ${u}. How long is each side, in ${u}?`, visual: G.polygonFig({ pts: rectPts(4, 4), ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], sides: ['s', '', '', ''] }), expr: `${P}/4` });
  }
  const w = r.int(3, 7), h = r.int(3, 6), cw = r.int(1, w - 2), ch = r.int(1, h - 2), pts = shiftP(Lpts(w, h, h - ch, w - cw), 1, 1), P = 2 * (w + h);
  return num(P, [St('Walk round the outside, counting the unit lengths along each side.', gridFig({ cols: w + 2, rows: h + 2, polys: [{ pts, t: 'fig', hlSides: [0, 1, 2, 3, 4, 5] }], maxS: 26 })), St(`${w} + ${h - ch} + ${cw} + ${ch} + ${w - cw} + ${h} = ${P}.`), St(`So the perimeter is ${P} units.`)], { q: 'Each grid square is 1 unit long. What is the perimeter of this shape, in units?', visual: gridFig({ cols: w + 2, rows: h + 2, polys: [{ pts }], maxS: 26 }), expr: String(P) });
}

// ───────── area (4-area, 5-area) ─────────
const cellsOf = (x0, y0, w, h, t) => { const out = []; for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) out.push([x0 + x, y0 + y, t]); return out; };
export function area(r, g = 4) {
  const v = r.int(0, g === 4 ? 6 : 8), u = r.pick(['cm', 'm']);
  if (v === 0) {
    const rows = r.int(2, 6), cols = r.int(2, 9), A = rows * cols;
    const gf = (hlRow) => gridFig({ cols: cols + 2, rows: rows + 2, cells: cellsOf(1, 1, cols, rows, 'fig').map((c) => (hlRow && c[1] === 1 ? [c[0], c[1], 'hl'] : c)), maxS: 26 });
    return num(A, [St(`The bottom row has ${cols} squares.`, gf(true)), St(`There are ${rows} rows like it: ${rows} × ${cols} = ${A}.`), St(`So the area is ${A} square units.`)], { q: 'Each small square is 1 square unit. What is the area of the rectangle, in square units?', visual: gf(false), expr: `${rows}*${cols}` });
  }
  if (v === 1) {
    const L = r.int(3, g === 4 ? 25 : 40), W = r.int(2, 15), A = L * W;
    return num(A, [St(`Area = length × width: ${W} rows of ${L} unit squares would cover it.`, rectPic(L, W, u, { hl: 'fill' })), St(`${L} × ${W} = ${A}.`), St(`So the area is ${A} ${u}².`)], { q: `What is the area of this rectangle, in square ${u === 'cm' ? 'centimetres' : 'metres'} (${u}²)?`, visual: rectPic(L, W, u), expr: `${L}*${W}` });
  }
  if (v === 2) {
    const L = r.int(3, 20), W = r.int(2, 12), A = L * W;
    return num(W, [St(`Area = length × width, so ${L} × w = ${A}.`, rectPic(L, W, u, { sides: [`${L} ${u}`, 'w', '', ''], notes: [], hl: [{ side: 0 }] })), St(`w = ${A} ÷ ${L} = ${W}.`, rectPic(L, W, u, { sides: [`${L} ${u}`, `${W} ${u}`, '', ''], hl: [{ side: 1 }] })), St(`So the width is ${W} ${u}.`)], { q: `This rectangle has an area of ${A} ${u}². What is its width w, in ${u}?`, visual: rectPic(L, W, u, { sides: [`${L} ${u}`, 'w', '', ''] }), expr: `${A}/${L}` });
  }
  if (v === 3) {
    const W = r.int(5, 12), H = r.int(5, 12), a = r.int(2, H - 3), c = r.int(2, W - 3), pts = Lpts(W, H, a, c), A1 = W * a, A2 = c * (H - a), A = A1 + A2;
    const base = { pts, sides: [`${W} ${u}`, `${a} ${u}`, `${W - c} ${u}`, `${H - a} ${u}`, `${c} ${u}`, `${H} ${u}`], right: [0, 1, 2, 4, 5] };
    return num(A, [
      St('Cut the shape into two rectangles with a line across.', G.polygonFig({ ...base, cuts: [[[0, a], [c, a]]] })),
      St(`Bottom rectangle: ${W} × ${a} = ${A1}. Top rectangle: ${c} × ${H - a} = ${A2}.`, G.polygonFig({ ...base, regions: [{ pts: rectPts(W, a), t: 'hl', label: `${A1}` }, { pts: [[0, a], [c, a], [c, H], [0, H]], t: 'hl2', label: `${A2}` }], cuts: [[[0, a], [c, a]]] })),
      St(`Add them: ${A1} + ${A2} = ${A}.`), St(`So the area is ${A} ${u}².`)], { q: `All the corners of this shape are right angles. What is its area, in ${u}²?`, visual: G.polygonFig(base), expr: `${W}*${a}+${c}*${H - a}` });
  }
  if (v === 4) {
    const A = r.pick([12, 16, 18, 20, 24, 30, 36]), fs = []; for (let x = 2; x * x <= A; x++) if (A % x === 0) fs.push(x);
    const x = r.pick(fs), y = A / x, wr = [[x, y + 1], [x + 1, y + 1], [x + 1, y - 1], [x - 1, y + 2], [y + 1, x], [x + 2, y]].filter(([p, q]) => p > 0 && q > 0 && p * q !== A);
    const opts = r.shuffle([[x, y], ...r.shuffle(wr).slice(0, 3)]), k = opts.findIndex(([p, q]) => p * q === A);
    const pics = (lab) => figs(opts.map(([p, q], i) => rectPic(p, q, 'm', { W: 170, H: 130, notes: [], hl: lab && i === k ? 'fill' : null })));
    return letters(k, 4, { q: `Which rectangle has an area of ${A} m²?`, visual: pics(false), steps: [St('Area = length × width. Multiply the sides of each rectangle.'), St(`The areas are ${opts.map(([p, q], i) => `${L4[i]}: ${p} × ${q} = ${p * q}`).join(', ')}.`, pics(true)), St(`So rectangle ${L4[k]} has an area of ${A} m².`)] });
  }
  if (v === 5 && g === 4) {
    const w = r.int(3, 6), h = r.int(2, 4), bw = r.int(1, w - 1), bh = r.int(1, 3), bx = r.int(0, w - bw), A = w * h + bw * bh;
    const gf = (show) => gridFig({ cols: w + 2, rows: h + bh + 2, cells: [...cellsOf(1, 1, w, h, show ? 'hl' : 'fig'), ...cellsOf(1 + bx, 1 + h, bw, bh, show ? 'hl2' : 'fig')], maxS: 26 });
    return num(A, [St(`Count in parts. The bottom part is ${h} rows of ${w}: ${w * h} squares.`, gf(true)), St(`The part on top is ${bh} row${bh > 1 ? 's' : ''} of ${bw}: ${bw * bh} squares. ${w * h} + ${bw * bh} = ${A}.`), St(`So the area is ${A} square units.`)], { q: 'Each small square is 1 square unit. What is the area of this shape, in square units?', visual: gf(false), expr: `${w * h}+${bw * bh}` });
  }
  if (v === 6 && g === 4) {
    const s = r.int(2, 12), back = r.bool();
    const pic = (lab, hl) => G.polygonFig({ pts: rectPts(4, 4), ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], sides: [lab, '', '', ''], hl, notes: back ? [{ at: [2, 2], s: `${s * s} ${u}²` }] : [] });
    return back
      ? num(s, [St(`A square has equal sides, so side × side = ${s * s}.`, pic('?', 'fill')), St(`Which number times itself is ${s * s}? ${s} × ${s} = ${s * s}.`), St(`So each side is ${s} ${u}.`)], { q: `This square has an area of ${s * s} ${u}². How long is each side, in ${u}?`, visual: pic('?'), expr: `Math.sqrt(${s * s})` })
      : num(s * s, [St('All four sides of a square are equal (one tick each), so its length and width are both ' + s + ` ${u}.`, pic(`${s} ${u}`, [{ side: 0 }])), St(`Area = ${s} × ${s} = ${s * s}.`, pic(`${s} ${u}`, 'fill')), St(`So the area is ${s * s} ${u}².`)], { q: `What is the area of this square, in ${u}²?`, visual: pic(`${s} ${u}`), expr: `${s}*${s}` });
  }
  if (v === 5) {
    const b = r.int(4, 18), h = r.int(3, 12), off = r.int(2, 5), sl = Math.round(Math.hypot(off, h) * 10) / 10, [B, H] = disp(b, h), O = (off / b) * B;
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [B + O, H], [O, H]], sides: [`${b} ${u}`, `${dec(sl)} ${u}`, '', ''], base: 0, height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 2, 1, 2], hl });
    return num(b * h, [St('Cut the triangle off one end and slide it to the other end: the parallelogram becomes a rectangle with the same base and height.', pic(['base', 'height'])), St(`So A = base × height. Use the height at right angles to the base (${h} ${u}), not the slanted side: ${b} × ${h} = ${b * h}.`), St(`So the area is ${b * h} ${u}².`)], { q: `What is the area of this parallelogram, in ${u}²?`, visual: pic(), expr: `${b}*${h}` });
  }
  if (v === 6) {
    const b = r.int(2, 10) * 2, h = r.int(3, 12), A = (b * h) / 2, [B, H] = disp(b, h), ap = B * r.pick([0.25, 0.5, 0.7]);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [ap, H]], sides: [`${b} ${u}`, '', ''], base: 0, height: { from: 2, side: 0, label: `${h} ${u}` }, hl });
    const box = G.polygonFig({ pts: [[0, 0], [B, 0], [B, H], [0, H]], regions: [{ pts: [[0, 0], [B, 0], [ap, H]], t: 'hl' }], cuts: [[[ap, 0], [ap, H]]] });
    return num(A, [St('A triangle is half of the rectangle around it, with the same base and height.', box), St(`A = base × height ÷ 2 = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = ${A}.`, pic(['base', 'height'])), St(`So the area is ${A} ${u}².`)], { q: `What is the area of this triangle, in ${u}²?`, visual: pic(), expr: `${b}*${h}/2` });
  }
  if (v === 7) {
    const l = r.int(3, 9), w = r.int(2, 7), c = r.int(8, 40), A = l * w;
    return num(A * c, [St(`The carpet covers the whole floor, so find the area: ${l} × ${w} = ${A} m².`, rectPic(l, w, 'm', { hl: 'fill' })), St(`Each square metre costs $${c}: ${A} × $${c} = $${A * c}.`), St(`So the carpet costs $${A * c}.`)], { q: `A room's floor is ${l} m by ${w} m. Carpet costs $${c} for each square metre. How many dollars does it cost to carpet the floor?`, visual: rectPic(l, w, 'm'), expr: `${l}*${w}*${c}` });
  }
  const a = r.int(2, 8), b = r.int(2, 6), A = (a * b) / 2, tri = [[1, 1], [1 + a, 1], [1, 1 + b]];
  const gf = (show) => gridFig({ cols: a + 2, rows: b + 2, polys: [...(show ? [{ pts: shiftP(rectPts(a, b), 1, 1), t: 'hl2' }] : []), { pts: tri, t: show ? 'hl' : 'fig' }], maxS: 26 });
  return num(dec(A), [St(`The triangle is half of a rectangle ${a} squares long and ${b} squares high.`, gf(true)), St(`The rectangle is ${a} × ${b} = ${a * b} squares, and half of that is ${a * b} ÷ 2 = ${dec(A)}.`), St(`So the area of the triangle is ${dec(A)} square units.`)], { q: 'Each small square is 1 square unit. What is the area of the triangle, in square units?', visual: gf(false), expr: `${a}*${b}/2` });
}

// ───────── area and perimeter problems, and volume (4-areaword) ─────────
export function areaWord(r, name = 'Amina') {
  const v = r.int(0, 6);
  if (v === 0 || v === 1) {
    const L = r.int(4, 20), W = r.int(3, 15), fence = v === 0;
    return fence
      ? num(2 * (L + W), [St('A fence goes all the way round the garden, so find the perimeter.', rectPic(L, W, 'm', { sides: [`${L} m`, `${W} m`, `${L} m`, `${W} m`], hl: [0, 1, 2, 3].map((side) => ({ side })) })), St(`2 × ${L} + 2 × ${W} = ${2 * L} + ${2 * W} = ${2 * (L + W)}.`), St(`So ${name} needs ${2 * (L + W)} m of fence.`)], { q: `${name}'s garden is a rectangle. How many metres of fence go all the way round it?`, visual: rectPic(L, W, 'm'), expr: `2*(${L}+${W})` })
      : num(L * W, [St('Grass seed covers the whole garden, so find the area.', rectPic(L, W, 'm', { hl: 'fill' })), St(`${L} × ${W} = ${L * W}.`), St(`So ${L * W} m² of grass seed is needed.`)], { q: `${name}'s garden is a rectangle. How many square metres of grass seed cover it?`, visual: rectPic(L, W, 'm'), expr: `${L}*${W}` });
  }
  if (v === 2) {
    const P = 2 * r.int(8, 15), half = P / 2, a = r.int(1, Math.floor(half / 2) - 1), b = Math.floor(half / 2);
    const A1 = a * (half - a), A2 = b * (half - b), big = A1 > A2 ? 'A' : 'B';
    const pics = (lab) => figs([rectPic(half - a, a, 'm', { W: 190, H: 140, notes: [], hl: lab && big === 'A' ? 'fill' : null }), rectPic(half - b, b, 'm', { W: 190, H: 140, hl: lab && big === 'B' ? 'fill' : null })]);
    return mc(r, big, [big === 'A' ? 'B' : 'A', 'They have the same area'], { q: `Rectangles A and B both have a perimeter of ${P} m. Which has the greater area?`, visual: pics(false), steps: [St(`Check the perimeters: 2 × (${half - a} + ${a}) = ${P} and 2 × (${half - b} + ${b}) = ${P}.`), St(`Areas: A is ${half - a} × ${a} = ${A1} m², B is ${half - b} × ${b} = ${A2} m².`, pics(true)), St(`So ${big} has the greater area. (With the same perimeter, the closer to a square, the bigger the area.)`)] });
  }
  if (v === 3) {
    const l = r.int(2, 5), w = r.int(2, 4), h = r.int(2, 4), V = l * w * h;
    const pic = (hl) => G.boxFig({ l, w, h, cubes: true, hl });
    return num(V, [St(`The bottom layer is ${l} cubes along the front and ${w} going back: ${l} × ${w} = ${l * w} cubes.`, pic('base')), St(`There are ${h} layers: ${l * w} × ${h} = ${V}.`, pic('height')), St(`So ${V} cubes fill the box.`)], { q: 'This box is filled with unit cubes, with no gaps. How many cubes fill it?', visual: pic(), expr: `${l}*${w}*${h}` });
  }
  if (v === 4) {
    const len = r.int(3, 5), hs = Array.from({ length: len }, (_, i) => Math.min(4, 1 + Math.floor((i * r.int(2, 3)) / 2))), cubes = [];
    hs.forEach((h, x) => { for (let y = 0; y < h; y++) cubes.push([x, y, 0]); });
    const tot = cubes.length;
    return num(tot, [St('Count one stack at a time, from left to right.', cubesFig(cubes, { hl: ([x]) => x % 2 === 0 })), St(`${hs.join(' + ')} = ${tot}.`), St(`So the solid is made of ${tot} cubes.`)], { q: 'How many unit cubes make this solid? Every stack stands on the table.', visual: cubesFig(cubes), expr: hs.join('+') });
  }
  if (v === 5) {
    const L = r.int(5, 9), W = r.int(3, 6), done = r.int(1, W - 1), left = L * W - done * L;
    const gf = (show) => gridFig({ cols: L, rows: W, cells: [...cellsOf(0, 0, L, done, 'fig'), ...(show ? cellsOf(0, done, L, W - done, 'hl') : [])], polys: [{ pts: rectPts(L, W), t: 'ink' }], maxS: 26 });
    return num(left, [St(`The floor is ${L} tiles long and ${W} tiles wide: ${L} × ${W} = ${L * W} tiles in all.`, gf(true)), St(`${done} row${done > 1 ? 's' : ''} of ${L} ${done > 1 ? 'are' : 'is'} laid: ${done * L} tiles. ${L * W} − ${done * L} = ${left}.`), St(`So ${left} more tiles are needed.`)], { q: `${name} is covering a floor with square tiles. The blue tiles are already laid. How many more tiles are needed to cover the floor?`, visual: gf(false), expr: `${L * W}-${done * L}` });
  }
  const s = r.int(3, 12), A = s * s;
  const pic = (lab, hl) => G.polygonFig({ pts: rectPts(4, 4), ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], sides: [lab, '', '', ''], notes: [{ at: [2, 2], s: `${A} m²` }], hl });
  return num(4 * s, [St(`A square has equal sides, so side × side = ${A}. ${s} × ${s} = ${A}, so each side is ${s} m.`, pic(`${s} m`, [{ side: 0 }])), St(`The fence goes round all 4 sides: 4 × ${s} = ${4 * s}.`, pic(`${s} m`, [0, 1, 2, 3].map((side) => ({ side })))), St(`So ${4 * s} m of fence is needed.`)], { q: `A square garden has an area of ${A} m². How many metres of fence go all the way round it?`, visual: pic(''), expr: `4*Math.sqrt(${A})` });
}

// ───────── volume (5-volume) and volume and surface area (5-surface) ─────────
const boxPic = (l, w, h, u, o = {}) => G.boxFig({ l, w, h, labels: o.labels ?? [`${l} ${u}`, `${w} ${u}`, `${h} ${u}`], hl: o.hl });
function compoundVolume(r, u) {
  const W = r.int(5, 10), H = r.int(4, 9), a = r.int(2, H - 2), c = r.int(2, W - 2), D = r.int(2, 8), pts = Lpts(W, H, a, c), V1 = W * a * D, V2 = c * (H - a) * D, V = V1 + V2;
  const pic = G.prismFig({ base: pts, depth: Math.min(6, Math.max(1.5, D * 0.6)), sides: [`${W} ${u}`, `${a} ${u}`, '', `${H - a} ${u}`, `${c} ${u}`, ''], depthLabel: `${D} ${u}` });
  const face = (hl) => G.polygonFig({ pts, sides: [`${W}`, `${a}`, '', `${H - a}`, `${c}`, ''], cuts: [[[0, a], [c, a]]], regions: hl ? [{ pts: rectPts(W, a), t: 'hl', label: 'bottom' }, { pts: [[0, a], [c, a], [c, H], [0, H]], t: 'hl2', label: 'top' }] : [] });
  return num(V, [St('Split the solid into two boxes with a cut across the step.', face(true)), St(`Bottom box: ${W} × ${a} × ${D} = ${V1} ${u}³.`), St(`Top box: ${c} × ${H - a} × ${D} = ${V2} ${u}³.`), St(`Add them: ${V1} + ${V2} = ${V}.`), St(`So the volume is ${V} ${u}³.`)], { q: `This solid is made of two boxes and is ${D} ${u} deep. What is its volume, in ${u}³?`, visual: pic, expr: `${W}*${a}*${D}+${c}*${H - a}*${D}` });
}
export function volume5(r) {
  const v = r.int(0, 6), u = r.pick(['cm', 'm']);
  if (v === 0) {
    const l = r.int(2, 5), w = r.int(2, 4), h = r.int(2, 4), V = l * w * h, pic = (hl) => G.boxFig({ l, w, h, cubes: true, hl });
    return num(V, [St(`Count the bottom layer: ${l} cubes along the front and ${w} going back, so ${l} × ${w} = ${l * w}.`, pic('base')), St(`There are ${h} layers: ${l * w} × ${h} = ${V}.`, pic('height')), St(`So the volume is ${V} cubic units.`)], { q: 'This box is built from unit cubes, with no gaps. What is its volume, in cubic units?', visual: pic(), expr: `${l}*${w}*${h}` });
  }
  if (v === 1) {
    const l = r.int(2, 12), w = r.int(2, 9), h = r.int(2, 10), V = l * w * h;
    return num(V, [St(`The base is the bottom face: ${l} × ${w} = ${l * w} ${u}². That many cubes cover the bottom in one layer.`, boxPic(l, w, h, u, { hl: ['base', 'length', 'width'] })), St(`The height says how many layers: ${l * w} × ${h} = ${V}.`, boxPic(l, w, h, u, { hl: ['height'] })), St(`So the volume is ${V} ${u}³.`)], { q: `What is the volume of this box, in ${u}³?`, visual: boxPic(l, w, h, u), expr: `${l}*${w}*${h}` });
  }
  if (v === 2) return compoundVolume(r, u);
  if (v === 3) {
    const l = r.int(2, 10), w = r.int(2, 8), h = r.int(2, 9), V = l * w * h, labs = [`${l} ${u}`, `${w} ${u}`, 'h'];
    return num(h, [St(`Volume = base × height. The base is ${l} × ${w} = ${l * w} ${u}².`, boxPic(l, w, h, u, { labels: labs, hl: 'base' })), St(`So h = ${V} ÷ ${l * w} = ${h}.`, boxPic(l, w, h, u, { labels: labs, hl: 'height' })), St(`So the height is ${h} ${u}.`)], { q: `This box has a volume of ${V} ${u}³. What is its height h, in ${u}?`, visual: boxPic(l, w, h, u, { labels: labs }), expr: `${V}/(${l}*${w})` });
  }
  if (v === 4) {
    const s = r.int(2, 12);
    return num(s ** 3, [St(`A cube has the same length, width and height: ${s} ${u}.`, boxPic(s, s, s, u, { labels: [`${s} ${u}`, '', ''], hl: ['length', 'width', 'height'] })), St(`V = ${s} × ${s} × ${s} = ${s * s} × ${s} = ${s ** 3}.`), St(`So the volume is ${s ** 3} ${u}³.`)], { q: `Each edge of this cube is ${s} ${u}. What is its volume, in ${u}³?`, visual: boxPic(s, s, s, u, { labels: [`${s} ${u}`, '', ''] }), expr: `${s}**3` });
  }
  if (v === 5) {
    const l1 = r.int(2, 4), l2 = r.int(1, 3), w = r.int(1, 3), h1 = r.int(2, 4), h2 = r.int(1, h1 - 1), cubes = [...boxCubes(l1, w, h1), ...boxCubes(l2, w, h2, l1)], V = cubes.length;
    return num(V, [St(`Split it into two boxes. The tall part: ${l1} × ${w} × ${h1} = ${l1 * w * h1} cubes.`, cubesFig(cubes, { hl: ([x]) => x < l1 })), St(`The low part: ${l2} × ${w} × ${h2} = ${l2 * w * h2} cubes. ${l1 * w * h1} + ${l2 * w * h2} = ${V}.`, cubesFig(cubes, { hl: ([x]) => x >= l1 })), St(`So the volume is ${V} cubic units.`)], { q: `This solid is built from unit cubes, ${w} cube${w > 1 ? 's' : ''} deep, with no gaps inside. What is its volume, in cubic units?`, visual: cubesFig(cubes), expr: `${l1}*${w}*${h1}+${l2}*${w}*${h2}` });
  }
  const a = [r.int(2, 6), r.int(2, 5), r.int(2, 6)], b = [r.int(2, 6), r.int(2, 5), r.int(2, 6)], Va = a[0] * a[1] * a[2], Vb = b[0] * b[1] * b[2];
  if (Va === Vb) return volume5(r);
  const big = Va > Vb ? 'A' : 'B', pics = figs([boxPic(...a, 'cm', {}), boxPic(...b, 'cm', {})]);
  return mc(r, big, [big === 'A' ? 'B' : 'A', 'They hold the same'], { q: 'Which box holds more: which has the greater volume?', visual: pics, steps: [St('Volume = length × width × height. Work out each one.'), St(`A: ${a.join(' × ')} = ${Va} cm³. B: ${b.join(' × ')} = ${Vb} cm³.`, pics), St(`So box ${big} has the greater volume.`)] });
}
export function surface5(r) {
  const v = r.int(0, 7), u = r.pick(['cm', 'm']);
  if (v === 0) {
    const l = r.int(2, 10), w = r.int(2, 8), h = r.int(2, 8), S = 2 * (l * w + l * h + w * h), L = [`${l}`, `${w}`, `${h}`], net = (hl) => G.boxNet({ l, w, h, labels: L, hl });
    return num(S, [St('Unfold the box into its net: 6 rectangles in 3 matching pairs.', net(null)), St(`Top and bottom: 2 × ${l} × ${w} = ${2 * l * w}.`, net('tb')), St(`Front and back: 2 × ${l} × ${h} = ${2 * l * h}.`, net('fb')), St(`The two ends: 2 × ${w} × ${h} = ${2 * w * h}.`, net('lr')), St(`Add them: ${2 * l * w} + ${2 * l * h} + ${2 * w * h} = ${S}.`), St(`So the surface area is ${S} ${u}².`)], { q: `What is the surface area of this box, in ${u}²?`, visual: boxPic(l, w, h, u), expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` });
  }
  if (v === 1) {
    const s = r.int(2, 12), S = 6 * s * s;
    return num(S, [St(`A cube has 6 faces, all squares ${s} ${u} by ${s} ${u}.`, G.netFig({ cells: G.CUBE_NETS[5] })), St(`Each face is ${s} × ${s} = ${s * s}. Six faces: 6 × ${s * s} = ${S}.`, G.netFig({ cells: G.CUBE_NETS[5], hl: [0, 1, 2, 3, 4, 5] })), St(`So the surface area is ${S} ${u}².`)], { q: `Each edge of this cube is ${s} ${u}. What is its surface area, in ${u}²?`, visual: boxPic(s, s, s, u, { labels: [`${s} ${u}`, '', ''] }), expr: `6*${s}**2` });
  }
  if (v === 2) return compoundVolume(r, u);
  if (v === 3) {
    const l = r.int(2, 5), w = r.int(2, 4), h = r.int(2, 4), V = l * w * h, pic = (hl) => G.boxFig({ l, w, h, cubes: true, hl });
    return num(V, [St(`One layer is ${l} × ${w} = ${l * w} cubes.`, pic('base')), St(`There are ${h} layers: ${l * w} × ${h} = ${V}.`, pic('height')), St(`So the volume is ${V} cubic units.`)], { q: 'This box is filled with unit cubes. How many cubes are in it?', visual: pic(), expr: `${l}*${w}*${h}` });
  }
  if (v === 4) {
    const l = r.int(2, 12), w = r.int(2, 9), h = r.int(2, 10), V = l * w * h;
    return num(V, [St(`Volume = length × width × height. The base is ${l} × ${w} = ${l * w} ${u}².`, boxPic(l, w, h, u, { hl: ['base', 'length', 'width'] })), St(`${l * w} × ${h} = ${V}.`, boxPic(l, w, h, u, { hl: ['height'] })), St(`So the volume is ${V} ${u}³.`)], { q: `What is the volume of this box, in ${u}³?`, visual: boxPic(l, w, h, u), expr: `${l}*${w}*${h}` });
  }
  if (v === 5) {
    const l = r.int(2, 10), w = r.int(2, 8), h = r.int(2, 9), V = l * w * h, labs = [`${l} ${u}`, 'w', `${h} ${u}`];
    return num(w, [St(`Volume = length × width × height, so ${l} × w × ${h} = ${V}.`, boxPic(l, w, h, u, { labels: labs, hl: ['length', 'height'] })), St(`${l} × ${h} = ${l * h}, so w = ${V} ÷ ${l * h} = ${w}.`, boxPic(l, w, h, u, { labels: labs, hl: 'width' })), St(`So the width is ${w} ${u}.`)], { q: `This box has a volume of ${V} ${u}³. What is its width w, in ${u}?`, visual: boxPic(l, w, h, u, { labels: labs }), expr: `${V}/(${l}*${h})` });
  }
  if (v === 6) {
    const l = r.int(2, 4), w = r.int(1, 3), h = r.int(1, 3), S = 2 * (l * w + l * h + w * h), pic = (hl) => G.boxFig({ l, w, h, cubes: true, hl });
    return num(S, [St(`Count the squares on each face. The front has ${l} × ${h} = ${l * h}, and so does the back: ${2 * l * h}.`, pic('front')), St(`The top has ${l} × ${w} = ${l * w}, and so does the bottom: ${2 * l * w}.`, pic('top')), St(`Each end has ${w} × ${h} = ${w * h}, two ends: ${2 * w * h}.`, pic('right')), St(`${2 * l * h} + ${2 * l * w} + ${2 * w * h} = ${S}.`), St(`So the surface area is ${S} square units.`)], { q: 'This box is built from unit cubes. Its surface is covered with unit squares, all six faces including the bottom. How many unit squares cover it?', visual: pic(), expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` });
  }
  const l = r.int(2, 6), w = r.int(2, 5), h = r.int(2, 6), S = 2 * (l * w + l * h + w * h), net = (hl) => G.boxNet({ l, w, h, labels: [`${l}`, `${w}`, `${h}`], hl });
  return num(S, [St('Each pair of matching rectangles in the net is shaded in turn.', net('tb')), St(`2 × ${l} × ${w} + 2 × ${l} × ${h} + 2 × ${w} × ${h} = ${2 * l * w} + ${2 * l * h} + ${2 * w * h}.`, net('fb')), St(`That makes ${S}.`, net('lr')), St(`So the box made from this net has a surface area of ${S} ${u}².`)], { q: `This net folds into a box (lengths in ${u}). What is the surface area of the box, in ${u}²?`, visual: net(null), expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` });
}

// ───────── shape patterns (4-shapepat, 5-pat-shapes) ─────────
export function shapePat(r) {
  const v = r.int(0, 6);
  let core = r.shuffle(SHN).slice(0, r.int(2, 4));
  if (core.length === 2 && r.bool(0.35)) core = r.bool() ? [core[0], core[0], core[1]] : [core[0], core[1], core[1]];
  const L = core.length, seqOf = (n) => Array.from({ length: n }, (_, i) => core[i % L]);
  const wrongShapes = (right) => r.shuffle([...new Set([...core.filter((x) => x !== right), ...SHN.filter((x) => x !== right)])]).slice(0, 3);
  if (v === 0) {
    const n = r.int(L + 2, 2 * L + 2), seq = seqOf(n), right = core[n % L];
    return mc(r, cap(right), wrongShapes(right).map(cap), { q: 'What shape comes next in the pattern?', visual: patternFig([...seq, '?'], { numbers: false }), steps: [St(`Find the part that repeats: ${core.join(', ')}. The tinted blocks show it again and again.`, patternFig(seq, { groups: L, numbers: false })), St(`After ${seq.at(-1)} comes ${right}.`, patternFig([...seq, right], { groups: L, hl: [n], numbers: false })), St(`So the next shape is ${art(right)} ${right}.`)] });
  }
  if (v === 1) {
    const pos = r.int(10, 30), right = core[(pos - 1) % L], rem = pos % L;
    return mc(r, cap(right), wrongShapes(right).map(cap), { q: `This pattern keeps repeating. What is shape number ${pos}?`, visual: patternFig(seqOf(2 * L)), steps: [St(`The core has ${L} shapes: ${core.join(', ')}.`, patternFig(seqOf(2 * L), { groups: L })), St(`${pos} ÷ ${L} = ${Math.floor(pos / L)} R ${rem}: ${Math.floor(pos / L)} whole cores, then ${rem ? `${rem} more shape${rem > 1 ? 's' : ''}` : 'nothing more, so it is the last shape of a core'}.`), St(`So shape ${pos} is ${art(right)} ${right}.`, patternFig(core, { hl: [(pos - 1) % L] }))] });
  }
  if (v === 2) {
    const n = 2 * L + r.int(1, L), seq = seqOf(n), j = r.int(L, n - 2), right = seq[j], shown = seq.map((x, i) => (i === j ? '?' : x));
    return mc(r, cap(right), wrongShapes(right).map(cap), { q: 'One shape in this repeating pattern is hidden. What is the missing shape?', visual: patternFig(shown, { numbers: false }), steps: [St(`The part that repeats is ${core.join(', ')}.`, patternFig(shown, { groups: L, numbers: false })), St(`The hidden shape is number ${j + 1}, in the same place in its block as shape ${(j % L) + 1}: ${right}.`, patternFig(seq, { groups: L, hl: [j % L, j], numbers: false })), St(`So the missing shape is ${art(right)} ${right}.`)] });
  }
  if (v === 3) {
    const target = r.pick(core), inCore = core.filter((x) => x === target).length, k = r.int(3, 6), rem = r.int(0, L - 1), N = k * L + rem, extra = core.slice(0, rem).filter((x) => x === target).length, ans = k * inCore + extra;
    return num(ans, [St(`Each block of ${L} shapes has ${inCore} ${target}${inCore > 1 ? 's' : ''}.`, patternFig(seqOf(2 * L), { groups: L, hl: seqOf(2 * L).map((x, i) => (x === target ? i : -1)).filter((i) => i >= 0) })), St(`${N} shapes make ${k} whole blocks${rem ? ` and ${rem} more` : ''}: ${k} × ${inCore} = ${k * inCore}${rem ? `, plus ${extra} in the extra ${rem}` : ''}.`), St(`So there are ${ans} ${target}s in the first ${N} shapes.`)], { q: `This pattern keeps repeating. How many ${target}s are in the first ${N} shapes?`, visual: patternFig(seqOf(2 * L)), expr: `${k}*${inCore}+${extra}` });
  }
  const s = r.int(2, 5), k = r.int(2, 4);
  if (v === 4) {
    const n = r.int(5, 10), t = s + (n - 1) * k;
    return num(t, [St(`Figure 1 has ${s} squares. Each new figure adds a new row of ${k} (lit up).`, growFig(s, k, 3, { hl: true })), St(`Figure ${n} has ${n - 1} rows added: ${s} + ${n - 1} × ${k} = ${s} + ${(n - 1) * k} = ${t}.`), St(`So figure ${n} has ${t} squares.`)], { q: `The pattern keeps growing the same way. How many squares will figure ${n} have?`, visual: growFig(s, k), expr: `${s}+${n - 1}*${k}` });
  }
  if (v === 5) {
    return num(s + 3 * k, [St(`Count the figures: ${s}, ${s + k}, ${s + 2 * k}. Each one adds ${k} squares (lit up).`, growFig(s, k, 3, { hl: true })), St(`Figure 4 adds ${k} more: ${s + 2 * k} + ${k} = ${s + 3 * k}.`, growFig(s, k, 4, { hl: true })), St(`So figure 4 has ${s + 3 * k} squares.`)], { q: 'The pattern keeps growing the same way. How many squares will figure 4 have?', visual: growFig(s, k), expr: `${s}+3*${k}` });
  }
  const right = core.join(', '), outside = SHN.filter((x) => !core.includes(x));
  const bad = [[...core.slice(0, -1), outside[0]], [...core, outside[1]], L >= 3 ? core.slice(0, -1) : [core[0], core[0], core[1]].join() === core.join() ? [core[0], core[1], core[1]] : [core[0], core[0], core[1]]].map((c) => c.join(', ')).filter((x) => x !== right);
  return mc(r, right, bad, { q: 'Which group of shapes repeats to make this pattern?', visual: patternFig(seqOf(L * 2 + 1)), steps: [St('Look for the shortest group that starts the pattern and then comes again and again.'), St(`${cap(right)}, then ${right} again.`, patternFig(seqOf(L * 2 + 1), { groups: L })), St(`So the repeating group is ${right}.`)] });
}

// ───────── the lessons: key ideas on the board, each with its picture ─────────
const Lk = (text, visual) => ({ text, visual });
const sampleGrid = (L, W) => gridFig({ cols: L + 2, rows: W + 2, cells: cellsOf(1, 1, L, W, 'fig'), maxS: 24 });
const ANGLE_KINDS = figs([angleFig(50, { R: 70, label: '50°', minW: 140 }), angleFig(90, { R: 70, minW: 140 }), angleFig(130, { R: 70, label: '130°', minW: 140 }), angleFig(180, { R: 70, label: '180°', minW: 140 })], ['Acute', 'Right', 'Obtuse', 'Straight']);
const LINE_KINDS = figs([linesFig('line'), linesFig('ray'), linesFig('segment')], ['Line', 'Ray', 'Line segment']);
const PAIRS = figs([linesFig('parallel'), linesFig('perp'), linesFig('intersect')], ['Parallel', 'Perpendicular', 'Intersecting']);
const TRI_SIDES = figs([triPic(TRI.equilateral, { W: 160, H: 130 }), triPic(TRI.isosceles, { W: 160, H: 130 }), triPic(TRI.scalene, { W: 160, H: 130 })], SIDES3);
const TRI_ANGLES = figs([triPic({ pts: TRI.acute.pts, arcs: [0, 1, 2] }, { W: 160, H: 130 }), triPic(TRI.right, { W: 160, H: 130 }), triPic(TRI.obtuse, { W: 160, H: 130 })], ANG3);
const QUAD_MARKS = figs(['Square', 'Rectangle', 'Rhombus'].map((k) => qpic(k, { W: 170, H: 130 })), ['Square', 'Rectangle', 'Rhombus']);
const QUAD_MORE = figs(['Parallelogram', 'Trapezoid', 'Kite'].map((k) => qpic(k, { W: 170, H: 130 })), ['Parallelogram', 'Trapezoid', 'Kite']);
const MOVES = (() => { const r0 = { int: (a) => a, pick: (a) => a[0], bool: () => false }; return figs(['Translation', 'Reflection', 'Rotation'].map((k) => moveGrid(moveShapes(r0, k), { mirror: true, arrow: k === 'Translation' }))); })();
MOVES.captions = ['Slide (translation)', 'Flip (reflection)', 'Turn (rotation)'];
const PARTS = figs([G.boxFig({ l: 6, w: 3, h: 4 }), G.prismFig({ base: [[0, 0], [5, 0], [2.5, 4]], depth: 6 }), G.pyramidFig({ a: 5, h: 6 })], ['Rectangular prism', 'Triangular prism', 'Square pyramid']);
const CURVES = figs([CURVED.cylinder(), CURVED.cone(), CURVED.sphere()], ['Cylinder', 'Cone', 'Sphere']);
const POLYS = figs([3, 4, 5, 6, 8].map((n) => polyPic(G.regular(n), { W: 130, H: 120 })), ['Triangle 3', 'Quadrilateral 4', 'Pentagon 5', 'Hexagon 6', 'Octagon 8']);
const NOTP = figs([NONPOLY.circle[0](), NONPOLY.open[0](), NONPOLY.semicircle[0]()], ['Curved', 'Not closed', 'A curved side']);
const LSH = Lpts(8, 7, 3, 3);
export const LESSONS = {
  shapepat: [
    Lk('A repeating pattern has a core: a group of shapes that comes again and again. The tinted blocks show the core.', patternFig(['circle', 'square', 'triangle', 'circle', 'square', 'triangle', 'circle', 'square'], { groups: 3 })),
    Lk('To find what comes next, find the core and keep going round it.', patternFig(['star', 'heart', 'star', 'heart', 'star', '?'], { numbers: false })),
    Lk('To find shape number 20, divide by the size of the core. 20 ÷ 3 = 6 R 2, so it is the 2nd shape of the core.', patternFig(['circle', 'square', 'triangle'], { hl: [1] })),
    Lk('A growing pattern adds the same amount each time. Here each figure adds a row of 3 squares: 2, 5, 8, …', growFig(2, 3, 3, { hl: true })),
  ],
  lines: [
    Lk('A line goes on forever both ways. A ray has one endpoint. A line segment has two endpoints.', LINE_KINDS),
    Lk('Angles are named by size: acute is less than 90°, right is exactly 90°, obtuse is between 90° and 180°, straight is 180°.', ANGLE_KINDS),
    Lk('Parallel lines never meet. Perpendicular lines meet at a right angle (the small square).', PAIRS),
    Lk('A full turn is 360°, so a half turn is 180° and a quarter turn is 90°.', figs([turnFig(90, { label: '90°' }), turnFig(180, { label: '180°' }), turnFig(360, { label: '360°' })], ['Quarter turn', 'Half turn', 'Full turn'])),
    Lk('A protractor measures angles: centre on the corner, one ray on 0, read where the other ray crosses.', protractorFig(60, { hl: 'ray' })),
  ],
  angles4: [
    Lk('Angles that make a straight line add to 180°.', G.anglePairFig({ kind: 'supp', deg: 60, labels: ['60°', '120°'] })),
    Lk('Angles that fill a right angle add to 90°.', G.anglePairFig({ kind: 'comp', deg: 35, labels: ['35°', '55°'] })),
    Lk('Angles next to each other add up to the whole angle: 40° + 30° = 70°.', raysFig([40, 30], ['40°', '30°'], { whole: '70°' })),
    Lk('Angles all the way round a point add to 360°, one full turn.', raysFig([120, 140, 100], ['120°', '140°', '100°'])),
    Lk('A protractor measures angles: centre on the corner, one ray on 0, read where the other ray crosses.', protractorFig(110, { hl: 'ray' })),
  ],
  polygons: [
    Lk('A polygon is a closed shape made only of straight sides. The name tells how many sides it has.', POLYS),
    Lk('These are not polygons: a curved edge, a gap, or a curved side.', NOTP),
    Lk('A regular polygon has all sides equal and all angles equal. The ticks show the equal sides.', figs([polyPic(G.regular(6), { ticks: Array(6).fill(1), W: 160, H: 140 }), polyPic([[0, 0], [7, 0], [8, 3], [3, 5], [-1, 3]], { W: 160, H: 140 })], ['Regular', 'Irregular'])),
    Lk('Congruent shapes have the same size and the same shape, even if one is turned.', gridFig({ cols: 13, rows: 7, polys: [{ pts: shiftP(rectPts(2, 4), 1, 1) }, { pts: shiftP(rectPts(4, 2), 7, 1), t: 'hl2' }] })),
  ],
  polygons5: [
    Lk('A polygon is a closed shape made only of straight sides. The name tells how many sides it has.', POLYS),
    Lk('These are not polygons: a curved edge, a gap, or a curved side.', NOTP),
    Lk('A regular polygon has all sides equal and all angles equal.', figs([polyPic(G.regular(6), { ticks: Array(6).fill(1), W: 160, H: 140 }), polyPic([[0, 0], [7, 0], [8, 3], [3, 5], [-1, 3]], { W: 160, H: 140 })], ['Regular', 'Irregular'])),
    Lk('In a circle, the radius goes from the centre to the edge. The diameter goes right across through the centre: diameter = 2 × radius.', G.circleFig({ show: 'both', r: 'r', d: 'd = 2r', centre: 'O' })),
    Lk('A chord joins two points on the circle; the diameter is the longest chord.', G.circleFig({ show: 'none', centre: 'O', chord: [200, 320] })),
  ],
  triangles: [
    Lk('By sides: equilateral has 3 equal sides, isosceles has 2, scalene has none. Ticks mark the equal sides.', TRI_SIDES),
    Lk('By angles: acute has three angles less than 90°, right has one 90° angle, obtuse has one angle more than 90°.', TRI_ANGLES),
    Lk('Every triangle can have two names, one from its sides and one from its angles: this is a right isosceles triangle.', triPic(BOTH['Right isosceles'])),
  ],
  triangles5: [
    Lk('By sides: equilateral has 3 equal sides, isosceles has 2, scalene has none. Ticks mark the equal sides.', TRI_SIDES),
    Lk('By angles: acute has three angles less than 90°, right has one 90° angle, obtuse has one angle more than 90°.', TRI_ANGLES),
    Lk('The three angles of any triangle add up to 180°: 50° + 60° + 70° = 180°.', triPic({ pts: triAngles(50, 60), angles: ['50°', '60°', '70°'] })),
    Lk('In an isosceles triangle, the two angles opposite the equal sides are equal.', triPic({ pts: triAngles(70, 70), ticks: [0, 1, 1], angles: ['70°', '70°', '40°'] })),
  ],
  quads: [
    Lk('Marks tell you the facts: ticks for equal sides, arrows for parallel sides, a small square for a right angle.', qpic('Parallelogram')),
    Lk('A square has 4 equal sides and 4 right angles. A rectangle has 4 right angles. A rhombus has 4 equal sides.', QUAD_MARKS),
    Lk('A parallelogram has 2 pairs of parallel sides. A trapezoid has exactly 1 pair. A kite has 2 pairs of equal sides next to each other.', QUAD_MORE),
    Lk('So every square is also a rectangle and a rhombus, and all three are parallelograms.'),
  ],
  quads5: [
    Lk('Marks tell you the facts: ticks for equal sides, arrows for parallel sides, a small square for a right angle.', qpic('Parallelogram')),
    Lk('A square has 4 equal sides and 4 right angles. A rectangle has 4 right angles. A rhombus has 4 equal sides.', QUAD_MARKS),
    Lk('A parallelogram has 2 pairs of parallel sides. A trapezoid has exactly 1 pair. A kite has 2 pairs of equal sides next to each other.', QUAD_MORE),
    Lk('The four angles of any quadrilateral add to 360°: a diagonal cuts it into two triangles of 180°.', G.polygonFig({ pts: [[0, 0], [8, 0], [9, 5], [1.5, 4.2]], diag: [[0, 2]], regions: [{ pts: [[0, 0], [8, 0], [9, 5]], t: 'hl' }, { pts: [[0, 0], [9, 5], [1.5, 4.2]], t: 'hl2' }] })),
  ],
  symmetry: [
    Lk('A line of symmetry folds a shape into two halves that match exactly. A rectangle has 2.', symPic(SYMS[1], SYMS[1].lines)),
    Lk('A diagonal is NOT a line of symmetry of a rectangle: the halves do not land on each other.', symPic(SYMS[1], SYMS[1].wrong)),
    Lk('Regular polygons have as many lines of symmetry as sides: a regular hexagon has 6.', symPic(SYMS[4], SYMS[4].lines)),
    Lk('A slide is a translation, a flip is a reflection, and a turn is a rotation. The shape keeps its size and shape.', MOVES),
  ],
  symmetry5: [
    Lk('A line of symmetry folds a shape into two halves that match exactly. A rectangle has 2.', symPic(SYMS[1], SYMS[1].lines)),
    Lk('Rotational symmetry: turn the shape about its centre. A square looks the same 4 times in a full turn, so its order is 4.', symPic(SYMS[0], SYMS[0].lines)),
    Lk('A slide is a translation, a flip is a reflection, and a turn is a rotation.', MOVES),
    Lk('To translate a point, add to x to move right and to y to move up: (2, 3) moved 4 right and 2 up is (6, 5).', gridFig({ cols: 8, rows: 7, axes: true, maxS: 22, dots: [{ at: [2, 3], s: 'P' }, { at: [6, 5], s: "P'", t: 'hl' }], arrows: [{ a: [2, 3], b: [6, 3] }, { a: [6, 3], b: [6, 5] }] })),
    Lk('Congruent figures have the same size and shape. Slides, flips and turns make congruent figures.'),
  ],
  solids: [
    Lk('A face is a flat surface, an edge is where two faces meet, and a vertex is a corner. Dashed edges are at the back.', G.boxFig({ l: 6, w: 3, h: 4 })),
    Lk('Prisms have two matching ends joined by rectangles. Pyramids have one base and triangles meeting at a point.', PARTS),
    Lk('Some solids have curved surfaces.', CURVES),
    Lk('A net is a solid unfolded flat: each piece becomes one face.', figs([G.netFig({ cells: G.CUBE_NETS[5] }), G.triPrismNet(), G.pyramidNet()], ['Cube', 'Triangular prism', 'Square pyramid'])),
  ],
  perimeter: [
    Lk('Perimeter is the distance all the way round a shape: add every side.', G.polygonFig({ pts: [[0, 0], [7, 0], [8, 4], [2, 5]], sides: ['7 cm', '4 cm', '6 cm', '5 cm'], hl: [0, 1, 2, 3].map((side) => ({ side })) })),
    Lk('A rectangle has two lengths and two widths: P = 2 × length + 2 × width.', rectPic(8, 3, 'm', { sides: ['8 m', '3 m', '8 m', '3 m'] })),
    Lk('On squared paper, count the unit lengths round the outside.', gridRect(5, 3, { hlSides: [0, 1, 2, 3] })),
    Lk('If all the corners are right angles, find a missing side by taking the short sides from the long side across from it.', G.polygonFig({ pts: LSH, sides: ['8 m', '3 m', 'x = 5 m', '4 m', '3 m', '7 m'], right: [0, 1, 2, 4, 5], hl: [{ side: 2 }] })),
  ],
  area: [
    Lk('Area is the number of unit squares that cover a shape, measured in square units like cm² and m².', sampleGrid(5, 3)),
    Lk('Rectangle: area = length × width. 3 rows of 5 squares is 3 × 5 = 15.', rectPic(5, 3, 'cm', { hl: 'fill' })),
    Lk('Split an odd shape into rectangles and add their areas.', G.polygonFig({ pts: LSH, regions: [{ pts: rectPts(8, 3), t: 'hl', label: '24' }, { pts: [[0, 3], [3, 3], [3, 7], [0, 7]], t: 'hl2', label: '12' }], cuts: [[[0, 3], [3, 3]]] })),
    Lk('A square has equal sides, so its area is side × side.', G.polygonFig({ pts: rectPts(4, 4), ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], sides: ['6 m'], notes: [{ at: [2, 2], s: '36 m²' }] })),
  ],
  area5: [
    Lk('Rectangle: area = length × width, in square units.', rectPic(6, 4, 'cm', { hl: 'fill' })),
    Lk('Parallelogram: cut a triangle off one end and move it to the other: a rectangle. So area = base × height, using the height at right angles to the base.', G.polygonFig({ pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], sides: ['base', '', '', ''], base: 0, height: { from: 3, side: 0, label: 'height' }, hl: ['base', 'height'] })),
    Lk('Triangle: half of a rectangle with the same base and height. Area = base × height ÷ 2.', G.polygonFig({ pts: [[0, 0], [8, 0], [8, 5], [0, 5]], regions: [{ pts: [[0, 0], [8, 0], [3, 5]], t: 'hl' }], cuts: [[[3, 0], [3, 5]]] })),
    Lk('Split a shape with right angles into rectangles and add their areas.', G.polygonFig({ pts: LSH, regions: [{ pts: rectPts(8, 3), t: 'hl', label: '24' }, { pts: [[0, 3], [3, 3], [3, 7], [0, 7]], t: 'hl2', label: '12' }], cuts: [[[0, 3], [3, 3]]] })),
  ],
  areaword: [
    Lk('Fencing and borders go round a shape: that is perimeter. Carpet, grass and tiles cover it: that is area.', figs([rectPic(6, 4, 'm', { hl: [0, 1, 2, 3].map((side) => ({ side })), W: 180, H: 140 }), rectPic(6, 4, 'm', { hl: 'fill', W: 180, H: 140 })], ['Perimeter: fence', 'Area: grass'])),
    Lk('Two rectangles can have the same perimeter but different areas. The closer to a square, the bigger the area.', figs([rectPic(9, 1, 'm', { W: 180, H: 140 }), rectPic(5, 5, 'm', { W: 180, H: 140 })], ['P = 20 m, A = 9 m²', 'P = 20 m, A = 25 m²'])),
    Lk('Volume is how many unit cubes fill a solid. A box: one layer of length × width cubes, times the number of layers.', G.boxFig({ l: 4, w: 3, h: 2, cubes: true, hl: 'base' })),
  ],
  volume: [
    Lk('Volume is the space inside a solid: how many unit cubes fill it, in cubic units like cm³.', G.boxFig({ l: 4, w: 3, h: 2, cubes: true })),
    Lk('The bottom layer has length × width cubes. The height is the number of layers. So V = length × width × height.', G.boxFig({ l: 6, w: 3, h: 4, labels: ['length', 'width', 'height'], hl: ['base', 'height'] })),
    Lk('A cube has equal edges: V = edge × edge × edge.', G.boxFig({ l: 3, w: 3, h: 3, cubes: true })),
    Lk('A solid made of two boxes: find each volume and add.', cubesFig([...boxCubes(3, 2, 3), ...boxCubes(2, 2, 1, 3)], { hl: ([x]) => x < 3 })),
  ],
  surface: [
    Lk('Volume of a box = length × width × height, in cubic units.', G.boxFig({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'], hl: ['base', 'height'] })),
    Lk('Surface area is the total area of all the faces. Unfold the box into its net: 6 rectangles in 3 matching pairs.', G.boxNet({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'] })),
    Lk('SA = 2 × (l × w) + 2 × (l × h) + 2 × (w × h): top and bottom, front and back, and the two ends.', G.boxNet({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'], hl: 'tb' })),
    Lk('A cube has 6 equal square faces: SA = 6 × edge × edge.', G.netFig({ cells: G.CUBE_NETS[5], hl: [0, 1, 2, 3, 4, 5] })),
  ],
};
