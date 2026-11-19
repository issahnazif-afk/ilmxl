// Grade 8 geometry and measurement, taught with pictures (the pattern of geo10.mjs): every question has its figure,
// the worked steps light up the part each step uses, and LESSONS gives each skill its key ideas with diagrams.
// Used by g8.mjs. `cyl` and LESSONS.cyl are ready for 8-cyl (which lives in skills.mjs).
import { num, mc, St, dec, frac, neg } from '../kit.mjs';
import * as G from '../figs.mjs';

// ── small helpers ──
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mulv = (a, k) => [a[0] * k, a[1] * k];
const unit = (a) => mulv(a, 1 / (Math.hypot(a[0], a[1]) || 1));
const cen = (pts) => mulv(pts.reduce(add, [0, 0]), 1 / pts.length);
const rad = (d) => (d * Math.PI) / 180;
const dir = (d) => [Math.cos(rad(d)), Math.sin(rad(d))];
const art = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
const lin = (k, c) => `${k === 1 ? '' : k}x${c > 0 ? ` + ${c}` : c < 0 ? ` − ${-c}` : ''}`;
const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]; };
const shift = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
const scale = (pts, k) => pts.map(([x, y]) => [x * k, y * k]);
// put p2 to the right of p1 (gap in model units), centred on it or standing on the same bottom line
const placeRight = (p1, p2, gap = 2, bottom = false) => { const [, x1, a0, a1] = bbox(p1), [x2, , b0, b1] = bbox(p2); return shift(p2, x1 + gap - x2, bottom ? a0 - b0 : (a0 + a1) / 2 - (b0 + b1) / 2); };
const disp = (a, b) => { const [x, y] = G.squash([a, b], 0.4, 0.8); return [x * 10, y * 10]; };
const NG = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
const P2 = (x) => dec(x, 2);
const kx = (k) => (k === 1 ? 'x' : `${k}x`);   // 3x, but x rather than 1x

// a triangle with angles A (at corner 0) and B (at corner 1), base along the bottom
export const triFromAngles = (A, B, s = 10) => { const C = 180 - A - B, L = (s * Math.sin(rad(B))) / Math.sin(rad(C)); return [[0, 0], [s, 0], [L * Math.cos(rad(A)), L * Math.sin(rad(A))]]; };
// a triangle with sides c (corner 0 → 1), a (1 → 2), b (2 → 0)
export const triFromSides = (a, b, c) => { const x = (b * b + c * c - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0, b * b - x * x))]]; };

// several polygons in one picture, on one scale (so similar figures look similar):
//   polys: [{ pts (model, y up), t, names, sides, ticks, par, right, arcN (arcs per corner, for equal angles), angles,
//   hlSides, hlAngles, caption, label }], segs: [{ a, b, t }], notes: [{ at, s, t }]
export function multiFig(polys, { W = 340, H = 210, pad = 32, segs = [], notes = [], dots = [], box = [] } = {}) {
  const F = G.frame([...polys.flatMap((p) => p.pts), ...segs.flatMap((s) => [s.a, s.b]), ...box], { W, H, pad });
  const items = [];
  for (const p of polys) {
    const s = p.pts.map(F.m), n = s.length, c = cen(s), nx = (i) => s[(i + 1) % n], pv = (i) => s[(i + n - 1) % n];
    items.push(G.poly(s, p.t ?? 'fig'));
    (p.hlSides ?? []).forEach((j) => items.push(G.line(s[j], nx(j), 'hlline')));
    (p.ticks ?? []).forEach((k, j) => { if (k) items.push(...G.ticks(s[j], nx(j), k)); });
    (p.par ?? []).forEach((k, j) => { if (k) items.push(...G.parArrows(s[j], nx(j), k)); });
    (p.right ?? []).forEach((i) => items.push(G.rightMark(s[i], pv(i), nx(i))));
    (p.arcN ?? []).forEach((k, i) => { for (let q = 0; q < (k || 0); q++) items.push(...G.angleArc(s[i], pv(i), nx(i), '', 14 + 5 * q)); });
    (p.angles ?? []).forEach((lab, i) => { if (lab) items.push(...G.angleArc(s[i], pv(i), nx(i), lab, 20, (p.hlAngles ?? []).includes(i) ? 'hlline' : 'mark')); });
    (p.sides ?? []).forEach((lab, j) => items.push(G.sideLabel(s[j], nx(j), lab, s, (p.hlSides ?? []).includes(j) ? 'hl' : 'ink')));
    (p.names ?? []).forEach((nm, i) => { if (nm) items.push(G.text(add(s[i], mulv(unit(sub(s[i], c)), 13)), nm, 'muted', { size: 13 })); });
    if (p.caption) items.push(G.text([c[0], bbox(s)[2] - 15], p.caption, p.capT ?? 'muted', { size: 13 }));
    if (p.label) items.push(G.text(c, p.label, p.labelT ?? 'ink'));
  }
  for (const sg of segs) items.push(G.line(F.m(sg.a), F.m(sg.b), sg.t ?? 'aux'));
  for (const d of dots) items.push(G.dot(F.m(d), 'ink'));
  for (const nt of notes) items.push(G.text(F.m(nt.at), nt.s, nt.t ?? 'ink', nt.size ? { size: nt.size } : {}));
  return G.fig(items, W, H);
}

// a coordinate grid with shapes and points on it: shapes: [{ pts, t, names }], points: [{ at, s, t }], segs: [{ a, b, t }]
export function gridFig({ lo = -6, hi = 6, ylo = lo, yhi = hi, shapes = [], points = [], segs = [], size = 250 } = {}) {
  const pad = 16, n = Math.max(hi - lo, yhi - ylo), u = (size - 2 * pad) / n;
  const W = 2 * pad + (hi - lo) * u, H = 2 * pad + (yhi - ylo) * u;
  const X = (x) => pad + (x - lo) * u, Y = (y) => H - pad - (y - ylo) * u, M = ([x, y]) => [X(x), Y(y)];
  const items = [];
  for (let k = lo; k <= hi; k++) if (k !== 0) items.push(G.line([X(k), Y(ylo)], [X(k), Y(yhi)], 'grid'));
  for (let k = ylo; k <= yhi; k++) if (k !== 0) items.push(G.line([X(lo), Y(k)], [X(hi), Y(k)], 'grid'));
  const ax = lo <= 0 && hi >= 0, ay = ylo <= 0 && yhi >= 0;
  if (ax) items.push({ ...G.line([X(0), Y(ylo)], [X(0), Y(yhi)], 'ink') });
  if (ay) items.push(G.line([X(lo), Y(0)], [X(hi), Y(0)], 'ink'));
  const step = n > 12 ? 2 : 1, y0 = ay ? Y(0) : Y(ylo), x0 = ax ? X(0) : X(lo);
  for (let k = lo; k <= hi; k++) if (k && k % step === 0) items.push(G.text([X(k), y0 + 9], neg(k), 'muted', { size: 9 }));
  for (let k = ylo; k <= yhi; k++) if (k && k % step === 0) items.push(G.text([x0 - 8, Y(k)], neg(k), 'muted', { size: 9 }));
  for (const sg of segs) items.push(G.line(M(sg.a), M(sg.b), sg.t ?? 'aux'));
  for (const s of shapes) {
    const sp = s.pts.map(M), c = cen(sp);
    items.push(G.poly(sp, s.t ?? 'fig'));
    (s.names ?? []).forEach((nm, i) => { if (nm) items.push(G.text(add(sp[i], mulv(unit(sub(sp[i], c)), 11)), nm, s.t === 'hl' ? 'hl' : s.t === 'hl2' ? 'hl2' : 'ink', { size: 12 })); });
    if (s.label) items.push(G.text(c, s.label, s.t === 'hl' ? 'hl' : s.t === 'hl2' ? 'hl2' : 'ink', { size: 13 }));
  }
  for (const p of points) { items.push(G.dot(M(p.at), p.t ?? 'ink')); if (p.s) items.push(G.text(add(M(p.at), [10, -10]), p.s, p.t ?? 'ink', { size: 12 })); }
  return G.fig(items, W, H);
}

// rays from one corner (directions in degrees, counter-clockwise from east) with angle arcs: arcs [[i, j, label, hl]]
const arcR = (d, lab = '') => (d < 25 ? 58 : d < 40 ? 44 : 32) + (String(lab).length > 4 ? 10 : 0);
export function raysFig({ rays, arcs = [], right = [], names = [], vname = '', W = 300, H = 190 }) {
  const ends = rays.map((d) => mulv(dir(d), 10));
  const F = G.frame([[0, 0], ...ends], { W, H, pad: 34 });
  const V = F.m([0, 0]), E = ends.map(F.m);
  const items = E.map((e) => G.line(V, e, 'ink'));
  for (const [i, j] of right) items.push(G.rightMark(V, E[i], E[j], 13));
  for (const [i, j, lab, hl, rr] of arcs) { let d = Math.abs(rays[j] - rays[i]) % 360; if (d > 180) d = 360 - d; items.push(...G.angleArc(V, E[i], E[j], lab ?? '', rr ?? arcR(d, lab ?? ''), hl ? 'hlline' : 'mark')); }
  names.forEach((nm, i) => { if (nm) items.push(G.text(add(E[i], mulv(unit(sub(E[i], V)), 12)), nm, 'muted', { size: 13 })); });
  items.push(G.dot(V));
  if (vname) { const out = unit(mulv(E.reduce((s, e) => add(s, unit(sub(e, V))), [0, 0]), -1)); items.push(G.text(add(V, mulv(out, 14)), vname, 'muted', { size: 13 })); }
  return G.fig(items, W, H);
}

// ═════════ 8-anglepairs ═════════
export function anglePairs(r) {
  const v = r.int(0, 9);
  if (v === 0) {
    const a = r.int(12, 78), x = 90 - a;
    const pic = (lab, hl) => raysFig({ rays: [0, a, 90], right: [[0, 2]], arcs: [[0, 1, `${a}°`, hl], [1, 2, lab, hl]] });
    return num(x, [
      St('The two angles fill a right angle (the small square), so they are complementary: they add to 90°.', pic('x', true)),
      St(`x = 90° − ${a}° = ${x}°.`, pic(`${x}°`)),
      St(`So the angle marked x is ${x}°.`),
    ], { q: 'The two angles together make a right angle. What is the angle marked x?', visual: pic('x'), unit: '°', expr: `90-${a}` });
  }
  if (v === 1) {
    const b = r.int(20, 160), x = 180 - b;
    const pic = (lab, hl) => raysFig({ rays: [0, b, 180], arcs: [[0, 1, `${b}°`, hl], [1, 2, lab, hl]] });
    return num(x, [
      St('The two angles sit side by side on a straight line, so they are supplementary: they add to 180°.', pic('x', true)),
      St(`x = 180° − ${b}° = ${x}°.`, pic(`${x}°`)),
      St(`So the angle marked x is ${x}°.`),
    ], { q: 'The angles sit on a straight line. What is the angle marked x?', visual: pic('x'), unit: '°', expr: `180-${b}` });
  }
  if (v === 2 || v === 3) {
    const b = r.int(25, 155), across = v === 2, ans = across ? b : 180 - b;
    const pic = (lab, hl) => raysFig({ rays: [0, b, 180, 180 + b], arcs: across ? [[0, 1, `${b}°`, hl], [2, 3, lab, hl]] : [[0, 1, `${b}°`, hl], [1, 2, lab, hl]] });
    return num(ans, across ? [
      St('Two straight lines cross. The angles across from each other are vertical angles, and vertical angles are equal.', pic('x', true)),
      St(`So x is the same as ${b}°.`, pic(`${b}°`)),
      St(`So the angle marked x is ${ans}°.`),
    ] : [
      St(`The angle marked y and the ${b}° angle sit side by side on one straight line, so they add to 180°.`, pic('y', true)),
      St(`y = 180° − ${b}° = ${ans}°.`, pic(`${ans}°`)),
      St(`So the angle marked y is ${ans}°.`),
    ], { q: `Two straight lines cross. What is the angle marked ${across ? 'x' : 'y'}?`, visual: pic(across ? 'x' : 'y'), unit: '°', expr: String(ans) });
  }
  if (v === 4) {
    let k, x, c, g = 0;
    do { k = r.pick([2, 3, 4]); x = r.int(5, 20); c = 90 - (k + 1) * x; } while ((c < 2 || k * x < 12 || x + c < 12) && g++ < 50);
    if (c < 2) return anglePairs(r);
    const pic = (show, hl) => raysFig({ rays: [0, k * x, 90], right: [[0, 2]], arcs: [[0, 1, show ? `${k * x}°` : `${k}x°`, hl], [1, 2, show ? `${x + c}°` : `(x + ${c})°`, hl]] });
    return num(x, [
      St(`The angles make a right angle, so they add to 90°: ${k}x + (x + ${c}) = 90.`, pic(false, true)),
      St(`Collect the x terms: ${k + 1}x + ${c} = 90, so ${k + 1}x = ${90 - c}.`),
      St(`x = ${90 - c} ÷ ${k + 1} = ${x}. Check: ${k * x}° + ${x + c}° = 90°.`, pic(true)),
      St(`So x = ${x}.`),
    ], { q: 'These two angles make a right angle. Find x.', visual: pic(false), unit: 'x =', expr: `(90-${c})/${k + 1}` });
  }
  if (v === 5) {
    let p, q, x, c, e, A, g = 0;
    do { p = r.int(2, 4); q = r.int(1, 3); x = r.int(8, 30); c = r.int(-10, 20); A = p * x + c; e = 180 - A - q * x; } while ((A < 25 || A > 155 || Math.abs(e) > 40) && g++ < 80);
    if (A < 25 || A > 155 || Math.abs(e) > 40) return anglePairs(r);
    const B = q * x + e;
    const pic = (show, hl) => raysFig({ rays: [0, A, 180], arcs: [[0, 1, show ? `${A}°` : `(${lin(p, c)})°`, hl], [1, 2, show ? `${B}°` : `(${lin(q, e)})°`, hl]] });
    return num(x, [
      St(`The angles are on a straight line, so they add to 180°: (${lin(p, c)}) + (${lin(q, e)}) = 180.`, pic(false, true)),
      St(`Collect like terms: ${lin(p + q, c + e)} = 180, so ${p + q}x = ${180 - c - e}.`),
      St(`x = ${180 - c - e} ÷ ${p + q} = ${x}. Check: ${A}° + ${B}° = 180°.`, pic(true)),
      St(`So x = ${x}.`),
    ], { q: 'These two angles sit on a straight line. Find x.', visual: pic(false), unit: 'x =', expr: `(180-(${c})-(${e}))/${p + q}` });
  }
  if (v === 6) {
    let p, q, x, c, d, A, g = 0;
    do { p = r.int(2, 6); q = r.int(1, p - 1); x = r.int(4, 25); A = r.int(35, 145); c = A - p * x; d = A - q * x; } while ((Math.abs(c) > 60 || Math.abs(d) > 120 || Math.abs(A - 90) < 12) && g++ < 80);
    const pic = (show, hl) => raysFig({ rays: [0, A, 180, 180 + A], arcs: [[0, 1, show ? `${A}°` : `(${lin(p, c)})°`, hl], [2, 3, show ? `${A}°` : `(${lin(q, d)})°`, hl]] });
    return num(x, [
      St('The marked angles are across from each other where two lines cross: vertical angles, so they are equal.', pic(false, true)),
      St(`${lin(p, c)} = ${lin(q, d)}, so ${kx(p - q)} = ${d - c}.`),
      St(`x = ${d - c} ÷ ${p - q} = ${x}. Each angle is ${A}°.`, pic(true)),
      St(`So x = ${x}.`),
    ], { q: 'Two straight lines cross. Find x.', visual: pic(false), unit: 'x =', expr: `(${d}-(${c}))/${p - q}` });
  }
  if (v === 7) {
    const kinds = ['complementary angles', 'supplementary angles', 'vertical angles', 'none of these'], right = r.pick(kinds);
    let pic, why;
    if (right === 'complementary angles') { const a = r.int(20, 70); pic = raysFig({ rays: [0, a, 90], right: [[0, 2]], arcs: [[0, 1, `${a}°`], [1, 2, `${90 - a}°`]] }); why = `They sit side by side and fill a right angle: ${a}° + ${90 - a}° = 90°.`; }
    else if (right === 'supplementary angles') { const b = r.int(30, 150); pic = raysFig({ rays: [0, b, 180], arcs: [[0, 1, `${b}°`], [1, 2, `${180 - b}°`]] }); why = `They sit side by side on a straight line: ${b}° + ${180 - b}° = 180°.`; }
    else if (right === 'vertical angles') { const b = r.int(30, 150); pic = raysFig({ rays: [0, b, 180, 180 + b], arcs: [[0, 1, `${b}°`], [2, 3, `${b}°`]] }); why = 'Two straight lines cross, and the angles are across from each other.'; }
    else { let a, c; do { a = r.int(20, 75); c = r.int(20, 75); } while (Math.abs(a + c - 90) < 15); pic = raysFig({ rays: [0, a, a + c], arcs: [[0, 1, `${a}°`], [1, 2, `${c}°`]] }); why = `They add to ${a + c}°, not 90° or 180°, and they are not across from each other where two lines cross.`; }
    return mc(r, right, kinds.filter((k) => k !== right), { q: 'Which best describes the two marked angles?', visual: pic, steps: [St('Complementary: add to 90°. Supplementary: add to 180°. Vertical: across from each other where two lines cross.'), St(why, pic), St(`So they are ${right === 'none of these' ? 'none of these' : right}.`)] });
  }
  if (v === 8) {
    let a, b, x; do { a = r.int(25, 100); b = r.int(25, 100); x = 180 - a - b; } while (x < 25);
    const pic = (lab, hl) => raysFig({ rays: [0, a, a + b, 180], arcs: [[0, 1, `${a}°`, hl], [1, 2, `${b}°`, hl], [2, 3, lab, hl]] });
    return num(x, [
      St('All three angles sit on one straight line, so together they make 180°.', pic('x', true)),
      St(`x = 180° − ${a}° − ${b}° = ${x}°.`, pic(`${x}°`)),
      St(`So the angle marked x is ${x}°.`),
    ], { q: 'The three angles sit on a straight line. What is the angle marked x?', visual: pic('x'), unit: '°', expr: `180-${a}-${b}` });
  }
  let a, b, c, x; do { a = r.int(50, 150); b = r.int(50, 150); c = r.int(50, 150); x = 360 - a - b - c; } while (x < 40 || x > 170);
  const pic = (lab, hl) => raysFig({ rays: [0, a, a + b, a + b + c], arcs: [[0, 1, `${a}°`, hl], [1, 2, `${b}°`, hl], [2, 3, `${c}°`, hl], [3, 0, lab, hl]], H: 220 });
  return num(x, [
    St('The angles go all the way round one point: a full turn, 360°.', pic('x', true)),
    St(`x = 360° − ${a}° − ${b}° − ${c}° = ${x}°.`, pic(`${x}°`)),
    St(`So the angle marked x is ${x}°.`),
  ], { q: 'The angles fill the whole turn around a point. What is the angle marked x?', visual: pic('x'), unit: '°', expr: `360-${a}-${b}-${c}` });
}

// ═════════ 8-transversal ═════════
const angAt = (k, a) => ([1, 3, 5, 7].includes(k) ? a : 180 - a);   // angle number k when angle 1 is a
const TPAIRS = { 'corresponding angles': [[1, 5], [2, 6], [3, 7], [4, 8]], 'alternate interior angles': [[3, 5], [4, 6]], 'alternate exterior angles': [[1, 7], [2, 8]], 'same-side interior angles': [[4, 5], [3, 6]], 'vertical angles': [[1, 3], [2, 4], [5, 7], [6, 8]] };
const TWHY = { 'corresponding angles': 'They sit in the same corner at each crossing.', 'alternate interior angles': 'They are between the parallel lines, on opposite sides of the transversal.', 'alternate exterior angles': 'They are outside the parallel lines, on opposite sides of the transversal.', 'same-side interior angles': 'They are between the parallel lines, on the same side of the transversal.', 'vertical angles': 'They are across from each other at the same crossing.' };
const tDeg = (r) => { let d; do d = r.int(40, 140); while (Math.abs(d - 90) < 15); return d; };
const segFig = (labels, hl) => {
  const A = [30, 70], M = [150, 70], B = [270, 70];
  return G.fig([G.line(A, B, 'ink'), ...(hl ? [G.line(A, M, 'hlline'), G.line(M, B, 'hlline')] : []), ...G.ticks(A, M, 1), ...G.ticks(M, B, 1), G.dot(A), G.dot(M), G.dot(B),
    G.text([30, 48], 'A', 'muted', { size: 13 }), G.text([150, 48], 'M', 'muted', { size: 13 }), G.text([270, 48], 'B', 'muted', { size: 13 }),
    G.text([90, 92], labels[0], hl ? 'hl' : 'ink'), G.text([210, 92], labels[1], hl ? 'hl' : 'ink'), ...(labels[2] ? [G.text([150, 118], labels[2], 'ink')] : [])], 300, labels[2] ? 132 : 110);
};
export function transversal(r) {
  const v = r.int(0, 7), deg = tDeg(r);
  if (v === 0) {
    const kinds = Object.keys(TPAIRS), right = r.pick(kinds), [i, j] = r.pick(TPAIRS[right]);
    const pic = (hl) => G.transversalFig({ deg, labels: { [i]: 'p', [j]: 'q' }, hl: hl ? [i, j] : [] });
    return mc(r, right, r.shuffle(kinds.filter((k) => k !== right)).slice(0, 3), { q: 'A transversal crosses two parallel lines (the arrows). What kind of angle pair are p and q?', visual: pic(false), steps: [
      St('Look at where each angle sits: above or below each parallel line, and left or right of the transversal.', pic(true)),
      St(TWHY[right]),
      St(`So p and q are ${right}.`)] });
  }
  if (v === 1) {
    const kind = r.pick(Object.keys(TPAIRS)), [i, j] = r.pick(TPAIRS[kind]), A = angAt(i, deg), ans = angAt(j, deg), ss = kind === 'same-side interior angles';
    const pic = (lab, hl) => G.transversalFig({ deg, labels: { [i]: `${A}°`, [j]: lab }, hl: hl ? [i, j] : [] });
    return num(ans, [
      St(`${TWHY[kind]} So they are ${kind}.`, pic('x', true)),
      St(ss ? `Same-side interior angles add to 180°: x = 180° − ${A}° = ${ans}°.` : `${kind[0].toUpperCase() + kind.slice(1)} are equal, so x = ${ans}°.`, pic(`${ans}°`)),
      St(`So the angle marked x is ${ans}°.`),
    ], { q: 'The two lines with arrows are parallel. What is the angle marked x?', visual: pic('x'), unit: '°', expr: ss ? `180-${A}` : String(A) });
  }
  if (v === 2) {
    const k = r.int(2, 8), ans = angAt(k, deg), same = ans === deg;
    const labs = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map((n) => [n, String(n)]));
    const pic = (hl) => G.transversalFig({ deg, labels: labs, hl });
    return num(ans, [
      St(`Angles 1, 3, 5 and 7 are all equal (vertical and corresponding angles), so each is ${deg}°.`, pic([1, 3, 5, 7])),
      St(`Angles 2, 4, 6 and 8 sit on a straight line next to them, so each is 180° − ${deg}° = ${180 - deg}°.`, pic([2, 4, 6, 8])),
      St(`Angle ${k} is in the ${same ? 'first' : 'second'} group, so ∠${k} = ${ans}°.`),
    ], { q: `The two lines with arrows are parallel and ∠1 = ${deg}°. What is ∠${k}?`, visual: pic([]), unit: '°', expr: String(ans) });
  }
  if (v === 3 || v === 4) {
    const ss = v === 4, kind = ss ? 'same-side interior angles' : r.pick(['corresponding angles', 'alternate interior angles', 'alternate exterior angles']), [i, j] = r.pick(TPAIRS[kind]);
    let p, q, x, c, d, g = 0;
    do { p = r.int(2, 5); q = r.int(1, ss ? 3 : p - 1); x = r.int(5, 25); c = r.int(-15, 25); const Ai = p * x + c, Aj = ss ? 180 - Ai : Ai; d = Aj - q * x; } while ((p * x + c < 40 || p * x + c > 140 || Math.abs(p * x + c - 90) < 15 || Math.abs(d) > 90 || (!ss && p === q)) && g++ < 100);
    const Ai = p * x + c, Aj = q * x + d; if (Ai < 40 || Ai > 140 || Math.abs(Ai - 90) < 15) return transversal(r);
    const dg = [1, 3, 5, 7].includes(i) ? Ai : 180 - Ai;
    const pic = (show, hl) => G.transversalFig({ deg: dg, labels: { [i]: show ? `${Ai}°` : 'p', [j]: show ? `${Aj}°` : 'q' }, hl: hl ? [i, j] : [] });
    return num(x, [
      St(`${TWHY[kind]} So p and q are ${kind}, which ${ss ? 'add to 180°' : 'are equal'}.`, pic(false, true)),
      St(ss ? `(${lin(p, c)}) + (${lin(q, d)}) = 180, so ${p + q}x ${c + d < 0 ? '−' : '+'} ${Math.abs(c + d)} = 180 and ${p + q}x = ${180 - c - d}.` : `${lin(p, c)} = ${lin(q, d)}, so ${kx(p - q)} = ${d - c}.`),
      St(`x = ${ss ? 180 - c - d : d - c} ÷ ${ss ? p + q : p - q} = ${x}. The angles are ${Ai}° and ${Aj}°.`, pic(true)),
      St(`So x = ${x}.`),
    ], { q: `The two lines with arrows are parallel. ∠p = (${lin(p, c)})° and ∠q = (${lin(q, d)})°. Find x.`, visual: pic(false), unit: 'x =', expr: ss ? `(180-(${c})-(${d}))/${p + q}` : `(${d}-(${c}))/${p - q}` });
  }
  if (v === 5) {
    if (r.bool()) {
      const m = r.int(3, 30);
      return num(2 * m, [St('M is the midpoint, so it cuts AB into two equal parts (the tick marks).', segFig([`${m} cm`, '?'], true)), St(`AB = AM + MB = ${m} + ${m} = ${2 * m}.`), St(`So AB is ${2 * m} cm long.`)], { q: `M is the midpoint of segment AB, and AM = ${m} cm. How long is AB, in cm?`, visual: segFig([`${m} cm`, '?']), unit: 'cm', expr: `2*${m}` });
    }
    let p, q, x, c, d, g = 0;
    do { p = r.int(2, 6); q = r.int(1, p - 1); x = r.int(2, 12); c = r.int(1, 20); d = (p - q) * x + c; } while (d < 1 && g++ < 30);
    return num(x, [
      St('A midpoint cuts the segment into two equal parts, so AM = MB.', segFig([lin(p, c), lin(q, d)], true)),
      St(`${lin(p, c)} = ${lin(q, d)}, so ${kx(p - q)} = ${d - c}.`),
      St(`x = ${d - c} ÷ ${p - q} = ${x}. Each half is ${p * x + c}.`),
      St(`So x = ${x}.`),
    ], { q: `M is the midpoint of AB. AM = ${lin(p, c)} and MB = ${lin(q, d)}. Find x.`, visual: segFig([lin(p, c), lin(q, d)]), unit: 'x =', expr: `(${d}-${c})/${p - q}` });
  }
  if (v === 6) {
    const half = r.int(15, 80), whole = 2 * half;
    const pic = (lab, hl) => raysFig({ rays: [0, half, whole], names: ['C', 'D', 'A'], vname: 'B', arcs: [[1, 2, lab, hl], [0, 1, hl ? lab : '', hl], [0, 2, `${whole}°`, false, 62]] });
    return num(half, [
      St('A bisector cuts an angle into two equal angles: ∠ABD = ∠DBC.', pic('?', true)),
      St(`Each half is ${whole}° ÷ 2 = ${half}°.`, pic(`${half}°`)),
      St(`So ∠ABD = ${half}°.`),
    ], { q: `Ray BD bisects ∠ABC, which measures ${whole}°. What is ∠ABD?`, visual: pic('?'), unit: '°', expr: `${whole}/2` });
  }
  let p, q, x, c, d, g = 0;
  do { p = r.int(2, 5); q = r.int(1, p - 1); x = r.int(4, 20); c = r.int(-10, 15); d = (p - q) * x + c; } while ((p * x + c < 18 || p * x + c > 75) && g++ < 80);
  if (p * x + c < 18 || p * x + c > 75) return transversal(r);
  const h = p * x + c;
  const pic = (show, hl) => raysFig({ rays: [0, h, 2 * h], names: ['C', 'D', 'A'], vname: 'B', arcs: [[1, 2, show ? `${h}°` : `(${lin(p, c)})°`, hl], [0, 1, show ? `${h}°` : `(${lin(q, d)})°`, hl]], H: 210 });
  return num(x, [
    St('BD bisects ∠ABC, so the two parts are equal: ∠ABD = ∠DBC.', pic(false, true)),
    St(`${lin(p, c)} = ${lin(q, d)}, so ${kx(p - q)} = ${d - c}.`),
    St(`x = ${d - c} ÷ ${p - q} = ${x}. Each part is ${h}°.`, pic(true)),
    St(`So x = ${x}.`),
  ], { q: 'Ray BD bisects ∠ABC. Find x.', visual: pic(false), unit: 'x =', expr: `(${d}-(${c}))/${p - q}` });
}

// ═════════ 8-classify2d ═════════
const QUADS = {
  square: { pts: [[0, 0], [5, 0], [5, 5], [0, 5]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], say: 'four equal sides and four right angles' },
  rectangle: { pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], say: 'four right angles, with opposite sides equal but not all four equal' },
  rhombus: { pts: [[0, 0], [5, 0], [8, 4], [3, 4]], ticks: [1, 1, 1, 1], say: 'four equal sides but no right angles' },
  parallelogram: { pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], par: [1, 2, 1, 2], ticks: [1, 2, 1, 2], say: 'two pairs of parallel sides, no right angles, and sides not all equal' },
  trapezoid: { pts: [[0, 0], [9, 0], [6.5, 4], [2, 4]], par: [1, 0, 1, 0], say: 'exactly one pair of parallel sides' },
  kite: { pts: [[0, 3], [3, 0], [9, 3], [3, 6]], ticks: [1, 2, 2, 1], say: 'two pairs of equal sides next to each other, and no parallel sides' },
};
const wobble = (n, k = 0.16) => G.regular(n).map(([x, y], i) => [x * (1 + k * Math.sin(i * 2.3 + n)), y * (1 + k * 0.8 * Math.cos(i * 1.9 + n))]);
export function classify2d(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const n = r.int(3, 10), pts = wobble(n), right = NG[n];
    return mc(r, right, r.shuffle(Object.values(NG).filter((x) => x !== right && x !== 'dodecagon')).slice(0, 3), { q: 'Count the sides. What is this polygon called?', visual: G.polygonFig({ pts }), steps: [St(`Count the sides (or the corners): there are ${n}.`, G.polygonFig({ pts, names: pts.map((_, i) => String(i + 1)) })), St(`A polygon with ${n} sides is ${art(right)} ${right}.`)] });
  }
  if (v === 1) {
    const kind = r.pick(['acute', 'right', 'obtuse']), A = kind === 'right' ? 90 : kind === 'obtuse' ? r.int(95, 140) : r.int(50, 85);
    let B; do B = r.int(20, Math.min(85, 180 - A - 20)); while (kind === 'acute' && 180 - A - B >= 90);
    const C = 180 - A - B, ang = r.shuffle([A, B, C]), pts = triFromAngles(ang[0], ang[1]), big = Math.max(A, B, C);
    const right = `${kind} triangle`, k = ang.indexOf(big);
    const pic = (hl) => G.polygonFig({ pts, angles: ang.map((x) => `${x}°`), right: big === 90 ? [k] : [], hl: hl ? [{ angle: k }] : null });
    return mc(r, right, ['acute triangle', 'right triangle', 'obtuse triangle'].filter((x) => x !== right), { q: 'Classify this triangle by its angles.', visual: pic(false), steps: [
      St(`Look at the largest angle: ${big}°.`, pic(true)),
      St(big === 90 ? 'It is exactly 90°, a right angle, so this is a right triangle.' : big > 90 ? 'It is more than 90°, so this is an obtuse triangle.' : 'Even the largest angle is less than 90°, so all three are acute: an acute triangle.'),
      St(`So it is ${art(kind)} ${right}.`)] });
  }
  if (v === 2) {
    const kind = r.pick(['equilateral', 'isosceles', 'scalene']), s = r.int(4, 12);
    const sides = kind === 'equilateral' ? [s, s, s] : kind === 'isosceles' ? r.shuffle([s, s, r.pick([s - 2, s + 3, Math.round(s * 1.5)])]) : r.shuffle([s, s + 2, s + 4]);
    const [c, a, b] = sides, pts = triFromSides(a, b, c);
    const tk = kind === 'equilateral' ? [1, 1, 1] : kind === 'isosceles' ? sides.map((x, i) => (sides.filter((y) => y === x).length === 2 ? 1 : 0)) : [1, 2, 3];
    const pic = (marks) => G.polygonFig({ pts, sides: sides.map((x) => `${x} cm`), ticks: marks ? tk : null });
    const right = `${kind} triangle`;
    return mc(r, right, ['equilateral triangle', 'isosceles triangle', 'scalene triangle'].filter((x) => x !== right), { q: 'Classify this triangle by its sides.', visual: pic(false), steps: [
      St(`Compare the three sides: ${sides.join(' cm, ')} cm. Tick marks show which are equal.`, pic(true)),
      St(kind === 'equilateral' ? 'All three sides are equal.' : kind === 'isosceles' ? 'Exactly two sides are equal.' : 'No two sides are equal.'),
      St(`So it is ${art(kind)} ${right}.`)] });
  }
  if (v === 3) {
    const right = r.pick(Object.keys(QUADS)), Q = QUADS[right];
    return mc(r, right, r.shuffle(Object.keys(QUADS).filter((x) => x !== right)).slice(0, 3), { q: 'Read the marks on the sides and corners. What is the best name for this quadrilateral?', visual: G.polygonFig(Q), steps: [
      St('Tick marks show equal sides, arrows show parallel sides, and a small square shows a right angle.', G.polygonFig(Q)), St(`This one has ${Q.say}.`), St(`So it is ${art(right)} ${right}.`)] });
  }
  if (v === 4) {
    const names = r.shuffle(Object.keys(QUADS)).slice(0, 4), want = names[0], order = r.shuffle(names), L = ['A', 'B', 'C', 'D'], k = order.indexOf(want);
    const pic = (hl) => ({ type: 'figs', figs: order.map((nm, i) => G.polygonFig({ ...QUADS[nm], hl: hl && i === k ? 'fill' : null })), captions: L });
    return mc(r, L[k], L.filter((_, i) => i !== k), { q: `Which picture shows ${art(want)} ${want}?`, visual: pic(false), steps: [St(`${art(want)[0].toUpperCase() + art(want).slice(1)} ${want} has ${QUADS[want].say}.`), St(`Check the marks on each shape. Only picture ${L[k]} matches.`, pic(true)), St(`So the answer is ${L[k]}.`)] });
  }
  if (v === 5) {
    const ns = r.shuffle([5, 6, 7, 8]), bad = r.int(0, 3), L = ['A', 'B', 'C', 'D'];
    const shapes = ns.map((n, i) => { const p = wobble(n, 0.1); if (i === bad) { const j = r.int(0, n - 1); p[j] = mulv(p[j], 0.12); } return p; });
    const pic = (hl) => ({ type: 'figs', figs: shapes.map((pts, i) => G.polygonFig({ pts, hl: hl && i === bad ? 'fill' : null })), captions: L });
    return mc(r, L[bad], L.filter((_, i) => i !== bad), { q: 'A concave polygon has a "dent": one corner points inwards. Which polygon is concave?', visual: pic(false), steps: [St('In a convex polygon every corner points outwards and every angle is less than 180°. A concave one has an angle more than 180°.'), St(`Picture ${L[bad]} has a corner pushed in.`, pic(true)), St(`So the answer is ${L[bad]}.`)] });
  }
  const Q = [['4 equal sides and 4 right angles', 'square'], ['4 right angles, but the sides are not all equal', 'rectangle'], ['4 equal sides, but no right angles', 'rhombus'], ['exactly one pair of parallel sides', 'trapezoid'], ['two pairs of parallel sides, no right angles, sides not all equal', 'parallelogram'], ['two pairs of equal sides next to each other, and no parallel sides', 'kite']];
  const [desc, right] = r.pick(Q);
  return mc(r, right, r.shuffle(Q.map((q) => q[1]).filter((x) => x !== right)).slice(0, 3), { q: `A quadrilateral has ${desc}. What is the best name for it?`, steps: [St(`Match the clues: ${desc}.`), St(`That is ${art(right)} ${right}.`, G.polygonFig(QUADS[right]))] });
}

// ═════════ 8-triangleangles ═════════
export function triangleAngles(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const A = r.int(30, 95), B = r.int(30, 145 - A), C = 180 - A - B, pts = triFromAngles(A, B);
    const pic = (lab, hl) => G.polygonFig({ pts, angles: [`${A}°`, `${B}°`, lab], hl: hl ? [{ angle: 0 }, { angle: 1 }] : null });
    return num(C, [
      St('The three angles of any triangle add to 180°.', pic('x', true)),
      St(`The two you know: ${A}° + ${B}° = ${A + B}°. So x = 180° − ${A + B}° = ${C}°.`, pic(`${C}°`)),
      St(`So the missing angle is ${C}°.`),
    ], { q: 'What is the angle marked x in this triangle?', visual: pic('x'), unit: '°', expr: `180-${A}-${B}` });
  }
  if (v === 1) {
    const rs = r.pick([[1, 2, 3], [2, 3, 4], [1, 1, 2], [1, 2, 6], [2, 3, 5], [3, 4, 5], [1, 3, 5], [4, 5, 9], [2, 3, 7]]), tot = rs.reduce((a, b) => a + b, 0), k = 180 / tot, ask = r.int(0, 2);
    const angs = rs.map((x) => x * k), pts = triFromAngles(angs[0], angs[1]), word = ['smallest', 'middle', 'largest'][ask];
    const pic = (show) => G.polygonFig({ pts, angles: rs.map((x, i) => (show ? `${angs[i]}°` : `${x === 1 ? '' : x}x`)), right: show ? [] : [], hl: show ? [{ angle: ask }] : null });
    return num(angs[ask], [
      St(`The angles are ${rs.map((x) => `${x === 1 ? '' : x}x`).join(', ')}. They add to 180°: ${tot}x = 180.`, pic(false)),
      St(`x = 180 ÷ ${tot} = ${k}.`),
      St(`The ${word} angle is ${rs[ask] === 1 ? 'x' : `${rs[ask]}x`} = ${rs[ask]} × ${k} = ${angs[ask]}°.`, pic(true)),
      St(`So the ${word} angle is ${angs[ask]}°.`),
    ], { q: `The angles of this triangle are in the ratio ${rs.join(' : ')}. What is the ${word} angle, in degrees?`, visual: pic(false), unit: '°', expr: `180/${tot}*${rs[ask]}` });
  }
  if (v === 2 || v === 3) {
    const A = r.int(25, 80), B = r.int(25, 80), e = A + B, pts = triFromAngles(A, B), rev = v === 3;
    const pic = (labs, hl) => G.polygonFig({ pts, angles: [labs[0], labs[1], ''], ext: 2, extLabel: labs[2], hl });
    if (rev) return num(B, [
      St('An exterior angle equals the sum of the two inside angles that are not next to it.', pic([`${A}°`, 'x', `${e}°`], ['ext', { angle: 0 }, { angle: 1 }])),
      St(`${A}° + x = ${e}°, so x = ${e}° − ${A}° = ${B}°.`, pic([`${A}°`, `${B}°`, `${e}°`])),
      St(`So x = ${B}°.`),
    ], { q: 'One side of the triangle is extended. What is the angle marked x?', visual: pic([`${A}°`, 'x', `${e}°`]), unit: '°', expr: `${e}-${A}` });
    return num(e, [
      St('The exterior angle and the third inside angle sit on a straight line, and all three inside angles add to 180°. So the exterior angle equals the two far-away inside angles added.', pic([`${A}°`, `${B}°`, 'x'], ['ext', { angle: 0 }, { angle: 1 }])),
      St(`x = ${A}° + ${B}° = ${e}°.`, pic([`${A}°`, `${B}°`, `${e}°`])),
      St(`So the exterior angle x is ${e}°.`),
    ], { q: 'One side of the triangle is extended. What is the exterior angle marked x?', visual: pic([`${A}°`, `${B}°`, 'x']), unit: '°', expr: `${A}+${B}` });
  }
  if (v === 4 || v === 5) {
    const top = 2 * r.int(10, 65), base = (180 - top) / 2, pts = triFromAngles(base, base), giveTop = v === 4;
    const pic = (labs, hl) => G.polygonFig({ pts, ticks: [0, 1, 1], angles: labs, hl });
    if (giveTop) return num(base, [
      St('The tick marks show two equal sides, so this is an isosceles triangle: the two base angles are equal.', pic(['x', 'x', `${top}°`], [{ angle: 0 }, { angle: 1 }])),
      St(`The base angles share 180° − ${top}° = ${180 - top}°, so each is ${180 - top}° ÷ 2 = ${base}°.`, pic([`${base}°`, `${base}°`, `${top}°`])),
      St(`So x = ${base}°.`),
    ], { q: 'This triangle is isosceles. What is each base angle x?', visual: pic(['x', '', `${top}°`]), unit: '°', expr: `(180-${top})/2` });
    return num(top, [
      St('Two equal sides (the ticks) mean the two base angles are equal: both are ' + `${base}°.`, pic([`${base}°`, `${base}°`, 'x'], [{ angle: 0 }, { angle: 1 }])),
      St(`x = 180° − ${base}° − ${base}° = ${top}°.`, pic([`${base}°`, `${base}°`, `${top}°`])),
      St(`So the top angle x is ${top}°.`),
    ], { q: 'This triangle is isosceles. What is the top angle x?', visual: pic([`${base}°`, '', 'x']), unit: '°', expr: `180-2*${base}` });
  }
  if (v === 6) {
    const a = r.int(25, 65), b = 90 - a, pts = triFromAngles(90, a);
    const pic = (lab, hl) => G.polygonFig({ pts, right: [0], angles: ['', `${a}°`, lab], hl: hl ? [{ angle: 1 }, { angle: 2 }] : null });
    return num(b, [
      St('The square marks a right angle, 90°. The other two angles share the remaining 180° − 90° = 90°.', pic('x', true)),
      St(`x = 90° − ${a}° = ${b}°.`, pic(`${b}°`)),
      St(`So x = ${b}°.`),
    ], { q: 'This is a right triangle. What is the angle marked x?', visual: pic('x'), unit: '°', expr: `90-${a}` });
  }
  const forms = r.pick([[1, 2], [1, 3], [2, 3], [2, 2], [1, 4]]);
  let x, c, g = 0; do { x = r.int(12, 40); c = 180 - (forms[0] + forms[1] + 1) * x; } while ((x + c < 15 || c === 0 || Math.abs(c) > 60) && g++ < 80);
  if (x + c < 15 || c === 0 || Math.abs(c) > 60) return triangleAngles(r);
  const angs = [forms[0] * x, forms[1] * x, x + c], labs = [`${forms[0] === 1 ? '' : forms[0]}x`, `${forms[1]}x`, `x ${c > 0 ? '+' : '−'} ${Math.abs(c)}`], pts = triFromAngles(angs[0], angs[1]);
  const pic = (show) => G.polygonFig({ pts, angles: show ? angs.map((a) => `${a}°`) : labs.map((l) => `${l}°`.replace(/^(x [+−] \d+)°$/, '($1)°')) });
  const s = forms[0] + forms[1] + 1;
  return num(x, [
    St(`The three angles add to 180°: ${labs[0]} + ${labs[1]} + (${labs[2]}) = 180.`, pic(false)),
    St(`Collect like terms: ${s}x ${c > 0 ? '+' : '−'} ${Math.abs(c)} = 180, so ${s}x = ${180 - c}.`),
    St(`x = ${180 - c} ÷ ${s} = ${x}. The angles are ${angs.join('°, ')}°.`, pic(true)),
    St(`So x = ${x}.`),
  ], { q: 'Find x in this triangle.', visual: pic(false), unit: 'x =', expr: `(180-(${c}))/${s}` });
}

// ═════════ 8-polyangles ═════════
const circlePart = (part) => {
  const C = [120, 100], R = 72, p = (d) => [C[0] + R * Math.cos(rad(d)), C[1] - R * Math.sin(rad(d))];
  const items = [G.circle(C, R, 'fig'), G.dot(C)];
  if (part === 'radius') items.push(G.line(C, p(-35), 'hlline'), G.dot(p(-35)));
  if (part === 'diameter') items.push(G.line(p(200), p(20), 'hlline'), G.dot(p(200)), G.dot(p(20)));
  if (part === 'chord') items.push(G.line(p(205), p(320), 'hlline'), G.dot(p(205)), G.dot(p(320)));
  if (part === 'arc') items.push(G.path(`M${p(30).map((x) => Math.round(x * 10) / 10).join(' ')}A${R} ${R} 0 0 0 ${p(115).map((x) => Math.round(x * 10) / 10).join(' ')}`, 'hlline'), G.dot(p(30)), G.dot(p(115)));
  items.push(G.text([C[0] - 10, C[1] + 13], 'O', 'muted', { size: 12 }));
  return G.fig(items, 240, 200);
};
const centralFig = (angs, labs, hl) => {
  const C = [130, 110], R = 80, p = (d) => [C[0] + R * Math.cos(rad(d)), C[1] - R * Math.sin(rad(d))];
  const dirs = [0, angs[0], angs[0] + angs[1]];
  const items = [G.circle(C, R, 'fig'), ...dirs.map((d) => G.line(C, p(d), 'ink'))];
  dirs.forEach((d, i) => items.push(...G.angleArc(C, p(d), p(dirs[(i + 1) % 3]), labs[i], 26, hl?.includes(i) ? 'hlline' : 'mark')));
  items.push(G.dot(C));
  return G.fig(items, 260, 220);
};
export function polyAngles(r) {
  const v = r.int(0, 7);
  if (v === 0 || v === 7) {
    const n = v === 0 ? 4 : r.pick([5, 6]), sum = (n - 2) * 180;
    let angs, x, g = 0;
    do { angs = Array.from({ length: n - 1 }, () => r.int(n === 4 ? 14 : 18, n === 4 ? 26 : 32) * 5); x = sum - angs.reduce((a, b) => a + b, 0); } while ((x < 55 || x > 170) && g++ < 200);
    if (x < 55 || x > 170) return polyAngles(r);
    const k = r.int(0, n - 1), labels = []; let j = 0;
    for (let i = 0; i < n; i++) labels.push(i === k ? 'x' : `${angs[j++]}°`);
    const pts = wobble(n, 0.15), known = angs.reduce((a, b) => a + b, 0);
    return num(x, [
      St(n === 4 ? 'A diagonal cuts a quadrilateral into 2 triangles, so its angles add to 2 × 180° = 360°.' : `A ${NG[n]} can be cut into ${n - 2} triangles, so its angles add to (${n} − 2) × 180° = ${sum}°.`, G.triangulated(pts)),
      St(`Add the angles you know: ${angs.join(' + ')} = ${known}°.`, G.polygonFig({ pts, angles: labels, hl: labels.map((l, i) => (l === 'x' ? null : { angle: i })).filter(Boolean) })),
      St(`x = ${sum}° − ${known}° = ${x}°.`),
      St(`So x = ${x}°.`),
    ], { q: `Find the angle x in this ${NG[n]}. (The figure is not drawn to scale.)`, visual: G.polygonFig({ pts, angles: labels }), unit: '°', expr: `${sum}-${known}` });
  }
  if (v === 1) {
    const n = r.int(5, 10), sum = (n - 2) * 180, pts = wobble(n, 0.1);
    return num(sum, [
      St(`Draw every diagonal from one corner. They cut the ${NG[n]} into ${n} − 2 = ${n - 2} triangles.`, G.triangulated(pts)),
      St(`Each triangle has 180°: ${n - 2} × 180° = ${sum}°.`),
      St(`So the interior angles add to ${sum}°.`),
    ], { q: `What do the interior angles of this ${NG[n]} add up to, in degrees?`, visual: G.polygonFig({ pts }), unit: '°', expr: `(${n}-2)*180` });
  }
  if (v === 2) {
    const m = r.pick([5, 6, 8, 9, 10, 12]), each = ((m - 2) * 180) / m;
    const pic = (lab) => G.polygonFig({ pts: G.regular(m), ticks: Array(m).fill(1), angles: [lab] });
    return num(each, [
      St(`The angles of ${art(NG[m])} ${NG[m]} add to (${m} − 2) × 180° = ${(m - 2) * 180}°.`, G.triangulated(G.regular(m))),
      St(`It is regular, so all ${m} angles are equal: ${(m - 2) * 180}° ÷ ${m} = ${each}°.`, pic(`${each}°`)),
      St(`So each interior angle is ${each}°.`),
    ], { q: `This is a regular ${NG[m]}: all sides and angles are equal. What is each interior angle, in degrees?`, visual: pic('?'), unit: '°', expr: `(${m}-2)*180/${m}` });
  }
  if (v === 3) {
    const WHAT = { radius: 'a segment from the centre O to the circle', diameter: 'a segment through the centre with both ends on the circle', chord: 'a segment with both ends on the circle (not through the centre)', arc: 'a part of the circle itself, between two points' };
    const right = r.pick(Object.keys(WHAT)), pic = circlePart(right);
    return mc(r, right, Object.keys(WHAT).filter((x) => x !== right), { q: 'O is the centre of the circle. What is the highlighted part called?', visual: pic, steps: [St(`The highlighted part is ${WHAT[right]}.`, pic), St(`That is called ${art(right)} ${right}.`)] });
  }
  if (v === 4) {
    let a, b, c; do { a = r.int(7, 16) * 10 + r.pick([0, 5]); b = r.int(7, 16) * 10 + r.pick([0, 5]); c = 360 - a - b; } while (c < 50 || c > 170);
    return num(c, [
      St('The three central angles go all the way round the centre, so they add to 360°.', centralFig([a, b], [`${a}°`, `${b}°`, 'x'], [0, 1])),
      St(`x = 360° − ${a}° − ${b}° = ${c}°.`, centralFig([a, b], [`${a}°`, `${b}°`, `${c}°`], [2])),
      St(`So the third central angle (and its arc) is ${c}°.`),
    ], { q: 'Three radii split this circle into three parts. What is the central angle x?', visual: centralFig([a, b], [`${a}°`, `${b}°`, 'x']), unit: '°', expr: `360-${a}-${b}` });
  }
  if (v === 5) {
    const n = r.pick([5, 6, 8, 9, 10, 12]);
    const pic = (hl, lab = '?') => G.polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), ext: 1, extLabel: lab, hl });
    return num(360 / n, [
      St('An exterior angle is between one side and the next side extended. Walking once round any polygon, you turn through all the exterior angles: 360°.', pic('ext')),
      St(`A regular ${NG[n]} has ${n} equal exterior angles: 360° ÷ ${n} = ${360 / n}°.`, pic(null, `${360 / n}°`)),
      St(`So each exterior angle is ${360 / n}°.`),
    ], { q: `One side of this regular ${NG[n]} is extended. What is the exterior angle marked ?, in degrees?`, visual: pic(), unit: '°', expr: `360/${n}` });
  }
  const n = r.int(5, 12), sum = (n - 2) * 180;
  return num(n, [St('The angle sum is (n − 2) × 180°: one triangle for each side, minus 2.', G.triangulated(G.regular(Math.min(n, 8)))), St(`n − 2 = ${sum} ÷ 180 = ${n - 2}, so n = ${n - 2} + 2 = ${n}.`), St(`So the polygon has ${n} sides.`)], { q: `The interior angles of a polygon add up to ${sum}°. How many sides does it have?`, expr: `${sum}/180+2` });
}

// ═════════ 8-transid ═════════
const SCALENE = [[[0, 0], [3, 0], [0, 2]], [[0, 0], [3, 0], [1, 2]], [[0, 0], [2, 0], [3, 2]], [[0, 0], [3, 0], [2, 3]], [[0, 0], [4, 0], [1, 2]]];
const MOVES = {
  'reflection in the x-axis': { f: ([x, y]) => [x, -y], why: 'x stays the same and y changes sign: the shape flips over the x-axis.' },
  'reflection in the y-axis': { f: ([x, y]) => [-x, y], why: 'y stays the same and x changes sign: the shape flips over the y-axis.' },
  'rotation of 180° about the origin': { f: ([x, y]) => [-x, -y], why: 'both x and y change sign: the shape turns half way round the origin.' },
  'rotation of 90° clockwise about the origin': { f: ([x, y]) => [y, -x], why: '(x, y) becomes (y, −x): the shape turns a quarter turn clockwise about the origin.' },
  'rotation of 90° counterclockwise about the origin': { f: ([x, y]) => [-y, x], why: '(x, y) becomes (−y, x): the shape turns a quarter turn counterclockwise about the origin.' },
};
const inGrid = (pts, m = 6) => pts.every(([x, y]) => Math.abs(x) <= m && Math.abs(y) <= m);
const ABC = ['A', 'B', 'C'], ABC2 = ["A'", "B'", "C'"];
const SYM = [
  ['a square', () => ({ pts: G.regular(4), ticks: [1, 1, 1, 1], right: [0, 1, 2, 3] }), [0, 0], [90, 135, 180, 225], 4],
  ['an equilateral triangle', () => ({ pts: G.regular(3), ticks: [1, 1, 1] }), [0, 0], [90, 150, 210], 3],
  ['a regular pentagon', () => ({ pts: G.regular(5), ticks: Array(5).fill(1) }), [0, 0], [90, 126, 162, 198, 234], 5],
  ['a regular hexagon', () => ({ pts: G.regular(6), ticks: Array(6).fill(1) }), [0, 0], [90, 120, 150, 180, 210, 240], 6],
  ['a regular octagon', () => ({ pts: G.regular(8), ticks: Array(8).fill(1) }), [0, 0], [90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5], 8],
  ['a rectangle', () => ({ pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3] }), [4, 2.25], [0, 90], 2],
  ['a rhombus', () => ({ pts: [[0, 3], [4, 0], [8, 3], [4, 6]], ticks: [1, 1, 1, 1] }), [4, 3], [0, 90], 2],
  ['a parallelogram', () => ({ pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], par: [1, 2, 1, 2] }), [4.75, 2], [], 2],
  ['an isosceles triangle', () => ({ pts: [[0, 0], [6, 0], [3, 7]], ticks: [0, 1, 1] }), [3, 3], [90], 1],
  ['a kite', () => ({ pts: [[0, 3], [3, 0], [9, 3], [3, 6]], ticks: [1, 2, 2, 1] }), [4.5, 3], [0], 1],
  ['an isosceles trapezoid', () => ({ pts: [[0, 0], [10, 0], [7.5, 4], [2.5, 4]], par: [1, 0, 1, 0], ticks: [0, 1, 0, 1] }), [5, 2], [90], 1],
  ['a scalene triangle', () => ({ pts: [[0, 0], [7, 0], [2, 4]] }), [3, 2], [], 1],
];
const symFig = ([, mk, c, axes], show) => {
  const o = mk(), [x0, x1, y0, y1] = bbox(o.pts), L = Math.max(x1 - x0, y1 - y0) * 0.72;
  const cuts = show ? axes.map((d) => [add(c, mulv(dir(d), L)), sub(c, mulv(dir(d), L))]) : [];
  return G.polygonFig({ ...o, cuts, extra: cuts.flat() });
};
export function transId(r) {
  const v = r.int(0, 6);
  if (v === 0 || v === 1) {
    // a triangle and its image on the grid: name the move (v 0), or describe the slide (v 1)
    let P, Q, right, why, g = 0;
    do {
      const S = r.pick(SCALENE), ox = r.int(1, 2), oy = r.int(1, 2); P = shift(S, ox, oy);
      if (v === 0 && r.bool(0.75)) { right = r.pick(Object.keys(MOVES)); Q = P.map(MOVES[right].f); why = MOVES[right].why; }
      else { const dx = r.nonzero(-7, 3), dy = r.nonzero(-7, 3); Q = shift(P, dx, dy); right = v === 0 ? 'translation' : `${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}`; why = `every corner moves ${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}: the shape slides without turning or flipping.`; P.dx = dx; P.dy = dy; }
    } while ((!inGrid(Q) || Math.abs(Q[0][0] - P[0][0]) + Math.abs(Q[0][1] - P[0][1]) < 3) && g++ < 60);
    if (!inGrid(Q)) return transId(r);
    const pic = (names) => gridFig({ shapes: [{ pts: P, t: 'fig', names: names ? ABC : null, label: names ? '' : 'A' }, { pts: Q, t: 'hl', names: names ? ABC2 : null, label: names ? '' : 'B' }] });
    if (v === 1) {
      const dx = P.dx, dy = P.dy, w = (a, b) => `${Math.abs(a)} ${a > 0 ? 'right' : 'left'} and ${Math.abs(b)} ${b > 0 ? 'up' : 'down'}`;
      return mc(r, right, [w(dy, dx), w(-dx, -dy), w(dx, -dy), w(-dx, dy)].filter((x) => x !== right), { q: 'Triangle A slides to triangle B. How far does it move?', visual: pic(false), steps: [
        St(`Follow one corner: A ${pt(...P[0])} goes to A' ${pt(...Q[0])}.`, pic(true)),
        St(`x changes by ${neg(dx)} and y changes by ${neg(dy)}, so ${why}`),
        St(`So it moves ${right}.`)] });
    }
    return mc(r, right, r.shuffle(['translation', ...Object.keys(MOVES)].filter((k) => k !== right)).slice(0, 3), { q: 'Triangle A is moved to triangle B. Which transformation is this?', visual: pic(false), steps: [
      St(`Follow each corner: ${P.map((p, i) => `${ABC[i]} ${pt(...p)} → ${ABC2[i]} ${pt(...Q[i])}`).join(', ')}.`, pic(true)),
      St(`Every corner follows the same rule: ${why}`),
      St(`So it is ${art(right)} ${right}.`)] });
  }
  if (v === 2) {
    // which mirror line?
    const LINES = [['the x-axis', 'h', 0], ['the y-axis', 'v', 0], ['the line x = 1', 'v', 1], ['the line x = −1', 'v', -1], ['the line y = 1', 'h', 1], ['the line y = −1', 'h', -1]];
    const [right, o, k] = r.pick(LINES), refl = ([x, y]) => (o === 'v' ? [2 * k - x, y] : [x, 2 * k - y]);
    let P, Q, g = 0;
    do { const S = r.pick(SCALENE); P = shift(S, r.int(-5, 3), r.int(-5, 3)); Q = P.map(refl); } while ((!inGrid(P) || !inGrid(Q) || !P.every(([x, y]) => (o === 'v' ? x > k : y > k)) && !P.every(([x, y]) => (o === 'v' ? x < k : y < k))) && g++ < 200);
    if (!inGrid(P) || !inGrid(Q)) return transId(r);
    const line = o === 'v' ? { a: [k, -6], b: [k, 6], t: 'hlline' } : { a: [-6, k], b: [6, k], t: 'hlline' };
    const pic = (show) => gridFig({ shapes: [{ pts: P, t: 'fig', label: show ? '' : 'A', names: show ? ABC : null }, { pts: Q, t: 'hl', label: show ? '' : 'B', names: show ? ABC2 : null }], segs: show ? [line] : [] });
    return mc(r, right, r.shuffle(LINES.map((l) => l[0]).filter((x) => x !== right)).slice(0, 3), { q: 'Triangle A is reflected to make triangle B. What is the mirror line?', visual: pic(false), steps: [
      St(`In a reflection, each corner and its image are the same distance from the mirror line, on opposite sides. A ${pt(...P[0])} and A' ${pt(...Q[0])} are ${o === 'v' ? 'level, so the mirror line is up and down' : 'one above the other, so the mirror line goes across'}.`),
      St(`Halfway between them is ${o === 'v' ? `x = ${neg(k)}` : `y = ${neg(k)}`}.`, pic(true)),
      St(`So the mirror line is ${right}.`)] });
  }
  if (v === 3) {
    const R3 = ['rotation of 180° about the origin', 'rotation of 90° clockwise about the origin', 'rotation of 90° counterclockwise about the origin'], right = r.pick(R3);
    const P = shift(r.pick(SCALENE), r.int(1, 2), r.int(1, 2)), Q = P.map(MOVES[right].f);
    const pic = (show) => gridFig({ shapes: [{ pts: P, t: 'fig', label: show ? '' : 'A', names: show ? ABC : null }, { pts: Q, t: 'hl', label: show ? '' : 'B', names: show ? ABC2 : null }], segs: show ? [{ a: [0, 0], b: P[0], t: 'aux' }, { a: [0, 0], b: Q[0], t: 'aux' }] : [] });
    return mc(r, right.replace(' about the origin', ''), R3.filter((x) => x !== right).map((x) => x.replace(' about the origin', '')), { q: 'Triangle A is turned about the origin (0, 0) to make triangle B. Which rotation is it?', visual: pic(false), steps: [
      St(`Join the origin to A ${pt(...P[0])} and to A' ${pt(...Q[0])}. The angle between the two dashed lines is the turn.`, pic(true)),
      St(`The rule is ${MOVES[right].why}`),
      St(`So it is a ${right.replace(' about the origin', '')}.`)] });
  }
  const S = r.pick(SYM), [name, , , axes, rot] = S;
  if (v === 4) {
    const n = axes.length;
    return num(n, [
      St(n ? 'A line of symmetry folds the shape so the two halves match exactly. Try every fold.' : 'Try every fold: none of them makes the two halves match exactly.', symFig(S, false)),
      St(n ? `The dashed lines are the folds that work: there ${n === 1 ? 'is 1' : `are ${n}`}.` : 'Even the folds through corners or across the middle leave the halves different.', symFig(S, true)),
      St(`So ${name} has ${n} line${n === 1 ? '' : 's'} of symmetry.`),
    ], { q: `How many lines of symmetry does this shape (${name}) have?`, visual: symFig(S, false), expr: String(n) });
  }
  if (v === 5) return num(rot, [
    St('Turn the shape about its centre. Count how many times it looks exactly the same during one full turn (the start counts once).', symFig(S, false)),
    St(rot === 1 ? 'It only matches itself after the full turn.' : `It matches itself every ${360 / rot}°: ${rot} times in a full turn.`),
    St(`So the order of rotational symmetry is ${rot}.`),
  ], { q: `What is the order of rotational symmetry of this shape (${name})?`, visual: symFig(S, false), expr: String(rot) });
  // which shape has exactly n lines of symmetry?
  const pool = r.shuffle(SYM), chosen = []; for (const s of pool) if (!chosen.some((c) => c[3].length === s[3].length)) chosen.push(s);
  const four = chosen.slice(0, 4), want = four[0], order = r.shuffle(four), L = ['A', 'B', 'C', 'D'], k = order.indexOf(want), n = want[3].length;
  return mc(r, L[k], L.filter((_, i) => i !== k), { q: `Which shape has exactly ${n} line${n === 1 ? '' : 's'} of symmetry?`, visual: { type: 'figs', figs: order.map((s) => symFig(s, false)), captions: L }, steps: [
    St('Look for the folds that make the two halves match. The dashed lines show them.', { type: 'figs', figs: order.map((s) => symFig(s, true)), captions: order.map((s, i) => `${L[i]}: ${s[3].length}`) }),
    St(`Shape ${L[k]} (${want[0]}) has ${n}.`),
    St(`So the answer is ${L[k]}.`)] });
}

// ═════════ 8-congruent ═════════
const MOVE2 = { rot: ([x, y]) => [-x, -y], flip: ([x, y]) => [-x, y], turn: ([x, y]) => [-y, x], slide: ([x, y]) => [x, y] };
export function congruent(r) {
  const v = r.int(0, 6), L = r.shuffle(['A', 'B', 'C']), M = ['D', 'E', 'F'], name1 = L.join(''), match = (s) => M[L.indexOf(s)];
  let a0, a1, a2; do { a0 = r.int(35, 80); a1 = r.int(35, 85); a2 = 180 - a0 - a1; } while (a2 < 30 || a0 === a1 || a1 === a2 || a0 === a2);
  const angs = [a0, a1, a2], T1 = triFromAngles(a0, a1, 6), T2 = placeRight(T1, T1.map(MOVE2[r.pick(['rot', 'flip', 'turn'])]), 3.6);
  const pair = (o1 = {}, o2 = {}) => multiFig([{ pts: T1, names: L, ...o1 }, { pts: T2, names: M, t: 'hl2', ...o2 }]);
  const sideOf = (p, q) => { const i = L.indexOf(p), j = L.indexOf(q); return j === (i + 1) % 3 ? i : j; };
  if (v === 0) {
    const [p, q] = r.shuffle(['A', 'B', 'C']).slice(0, 2), right = match(p) + match(q), j = sideOf(p, q);
    return mc(r, right, ['DE', 'EF', 'DF', 'ED', 'FE', 'FD'].filter((x) => x !== right && x !== [...right].reverse().join('')).slice(0, 3), { q: `△${name1} ≅ △DEF. Which side matches side ${p}${q}?`, visual: pair(), steps: [
      St(`The letters match in order: ${L.map((l, i) => `${l} ↔ ${M[i]}`).join(', ')}.`, pair({ ticks: [1, 2, 3] }, { ticks: [1, 2, 3] })),
      St(`${p} ↔ ${match(p)} and ${q} ↔ ${match(q)}, so ${p}${q} matches ${right}.`, pair({ hlSides: [j] }, { hlSides: [j] })),
      St(`So the answer is ${right}.`)] });
  }
  if (v === 1) {
    const vtx = r.pick(['A', 'B', 'C']), i = L.indexOf(vtx), deg = angs[i];
    const pic = (lab, hl) => pair({ angles: [0, 1, 2].map((k) => (k === i ? `${deg}°` : '')), hlAngles: hl ? [i] : [] }, { angles: [0, 1, 2].map((k) => (k === i ? lab : '')), hlAngles: hl ? [i] : [] });
    return num(deg, [
      St(`△${name1} ≅ △DEF: the letters match in order, so ∠${vtx} ↔ ∠${match(vtx)}.`, pic('?', true)),
      St('Matching angles of congruent figures are equal.', pic(`${deg}°`)),
      St(`So ∠${match(vtx)} = ${deg}°.`),
    ], { q: `△${name1} ≅ △DEF and ∠${vtx} = ${deg}°. What is ∠${match(vtx)}?`, visual: pic('?'), unit: '°', expr: String(deg) });
  }
  if (v === 2 || v === 3) {
    const [p, q] = r.shuffle(['A', 'B', 'C']).slice(0, 2), j = sideOf(p, q);
    if (v === 2) {
      const len = r.int(3, 25), pic = (lab, hl) => pair({ sides: [0, 1, 2].map((k) => (k === j ? `${len} cm` : '')), hlSides: hl ? [j] : [] }, { sides: [0, 1, 2].map((k) => (k === j ? lab : '')), hlSides: hl ? [j] : [] });
      return num(len, [St(`${p}${q} matches ${match(p)}${match(q)}: the letters match in order.`, pic('?', true)), St('Matching sides of congruent figures are equal.', pic(`${len} cm`)), St(`So ${match(p)}${match(q)} = ${len} cm.`)], { q: `△${name1} ≅ △DEF and ${p}${q} = ${len} cm. How long is ${match(p)}${match(q)}, in cm?`, visual: pic('?'), unit: 'cm', expr: String(len) });
    }
    const x = r.int(2, 9), m = r.int(2, 5), c = r.nonzero(-3, 9), len = m * x + c;
    if (len < 4) return congruent(r);
    const pic = (show, hl) => pair({ sides: [0, 1, 2].map((k) => (k === j ? `${len} cm` : '')), hlSides: hl ? [j] : [] }, { sides: [0, 1, 2].map((k) => (k === j ? (show ? `${len} cm` : `(${lin(m, c)}) cm`) : '')), hlSides: hl ? [j] : [] });
    return num(x, [
      St(`${p}${q} and ${match(p)}${match(q)} are matching sides, so they are equal: ${lin(m, c)} = ${len}.`, pic(false, true)),
      St(`${m}x = ${len} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${len - c}, so x = ${len - c} ÷ ${m} = ${x}.`),
      St(`Check: ${m} × ${x} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${len}. So x = ${x}.`, pic(true)),
    ], { q: `△${name1} ≅ △DEF. Find x.`, visual: pic(false), unit: 'x =', expr: `(${len}-(${c}))/${m}` });
  }
  if (v === 4) {
    const right = r.pick(['a dilation by a scale factor of 3', 'a dilation by a scale factor of 1/2']);
    return mc(r, right, ['a translation', 'a reflection', 'a rotation of 90°'], { q: 'Which move does NOT always give a figure congruent to the original?', steps: [St('Translations (slides), reflections (flips) and rotations (turns) keep the size and shape.'), St(`${right[0].toUpperCase() + right.slice(1)} changes the size, so the image is not congruent.`, multiFig([{ pts: T1 }, { pts: placeRight(T1, scale(T1, right.includes('3') ? 1.8 : 0.5), 2, true), t: 'hl' }]))] });
  }
  // pictures: which pair is not congruent (v 5), which shape matches P (v 6)
  const Lt = ['A', 'B', 'C', 'D'], base = r.pick([[[0, 0], [4, 0], [5, 3], [1, 2.5]], [[0, 0], [5, 0], [1.5, 3]], [[0, 0], [4, 0], [4, 2], [1.5, 3.5]]]);
  if (v === 5) {
    const moves = r.shuffle(['rot', 'flip', 'turn', 'slide']), bad = r.int(0, 3), k = r.pick([1.5, 0.6]);
    const figs = moves.map((m, i) => { const img = base.map(MOVE2[m]); return multiFig([{ pts: base }, { pts: placeRight(base, i === bad ? scale(img, k) : img, 1.5, true), t: 'hl2' }], { W: 260, H: 150, pad: 18 }); });
    return mc(r, Lt[bad], Lt.filter((_, i) => i !== bad), { q: 'In which picture are the two shapes NOT congruent?', visual: { type: 'figs', figs, captions: Lt }, steps: [St('Congruent shapes have exactly the same size and shape; one may be slid, flipped or turned.'), St(`In picture ${Lt[bad]} the second shape is ${k > 1 ? 'bigger' : 'smaller'}: its sides are a different length.`), St(`So the answer is ${Lt[bad]}.`)] });
  }
  const opts = r.shuffle(['good', 'big', 'stretch', 'bent']), k = opts.indexOf('good'), mv = MOVE2[r.pick(['rot', 'flip', 'turn'])];
  const make = (kind) => { const p = base.map(mv); if (kind === 'big') return scale(p, 1.35); if (kind === 'stretch') return p.map(([x, y]) => [x * 1.35, y]); if (kind === 'bent') return p.map((q, i) => (i === 1 ? [q[0] + 0.9, q[1] + 0.7] : q)); return p; };
  const one = (p, t) => { const [x0, x1, y0, y1] = bbox(p); return multiFig([{ pts: shift(p, -(x0 + x1) / 2, -(y0 + y1) / 2), t }], { W: 200, H: 170, pad: 14, box: [[-3.6, -3], [3.6, 3]] }); };
  const pic = { type: 'figs', figs: [one(base, 'fig'), ...opts.map((o) => one(make(o), 'hl2'))], captions: ['P', ...Lt] };
  return mc(r, Lt[k], Lt.filter((_, i) => i !== k), { q: 'Which shape is congruent to shape P? All the shapes are drawn to the same scale.', visual: pic, steps: [St('A congruent shape has the same side lengths and the same angles. It may be turned or flipped.'), St('The others are stretched, enlarged or have a corner moved.'), St(`Only shape ${Lt[k]} is P moved without changing its size or shape. So the answer is ${Lt[k]}.`)] });
}

// ═════════ 8-dilation ═════════
const kStr = (k) => (k === 0.5 ? '1/2' : String(k));
export function dilation(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const k = r.pick([2, 3, 0.5]), lim = k === 3 ? 2 : 3, x = (k === 0.5 ? 2 : 1) * r.nonzero(-lim, lim), y = (k === 0.5 ? 2 : 1) * r.nonzero(-lim, lim), ans = [x * k, y * k];
    const m = Math.max(6, ...[x, y, ...ans].map(Math.abs)) + 1, lo = -m, hi = m;
    const pic = (show) => gridFig({ lo, hi, points: [{ at: [x, y], s: 'P' }, ...(show ? [{ at: ans, s: "P'", t: 'hl' }] : [])], segs: show ? [{ a: [0, 0], b: Math.abs(ans[0]) > Math.abs(x) ? ans : [x, y], t: 'aux' }] : [] });
    return mc(r, pt(...ans), [pt(x + k, y + k), pt(x * k, y), pt(y * k, x * k), pt(x, y * k)].filter((p) => p !== pt(...ans)), { q: `Point P ${pt(x, y)} is dilated about the origin by a scale factor of ${kStr(k)}. Where is P'?`, visual: pic(false), steps: [
      St(`A dilation about the origin multiplies both coordinates by the scale factor, ${kStr(k)}.`),
      St(`${neg(x)} × ${kStr(k)} = ${neg(ans[0])} and ${neg(y)} × ${kStr(k)} = ${neg(ans[1])}. P' lies on the same line from the origin, ${k > 1 ? `${k} times as far out` : 'half as far out'}.`, pic(true)),
      St(`So P' is at ${pt(...ans)}.`)] });
  }
  if (v === 1 || v === 6) {
    const [p, q] = r.pick([[2, 1], [3, 1], [1, 2], [3, 2], [2, 3], [5, 2]]), a = q * r.int(2, 5), b = q * r.int(1, 4) + (r.bool() ? q : 0), A = (a * p) / q, B = (b * p) / q;
    const big = p > q, polys = (labs, hl) => { const s = [[0, 0], [a, 0], [a, b], [0, b]], t = scale(s, p / q); return multiFig([{ pts: s, sides: labs[0], right: [0], caption: 'old' }, { pts: placeRight(s, t, Math.max(a, A) * 0.35, true), t: 'hl2', sides: labs[1], right: [0], hlSides: hl ? [0] : [], caption: 'new' }]); };
    if (v === 6) return num(dec(B), [
      St(`The scale factor is new length ÷ old length: ${dec(A)} ÷ ${a} = ${frac(p, q)}.`, polys([[`${a} cm`, `${b} cm`], [`${dec(A)} cm`, '?']], true)),
      St(`Every length is multiplied by ${frac(p, q)}: ${b} × ${frac(p, q)} = ${dec(B)}.`),
      St(`So the new side is ${dec(B)} cm.`, polys([[`${a} cm`, `${b} cm`], [`${dec(A)} cm`, `${dec(B)} cm`]])),
    ], { q: 'The rectangle is dilated. What is the missing length, in cm?', visual: polys([[`${a} cm`, `${b} cm`], [`${dec(A)} cm`, '?']]), unit: 'cm', expr: `${b}*${A}/${a}` });
    return num(frac(p, q), [
      St('Scale factor = new length ÷ old length. Use a pair of matching sides.', polys([[`${a} cm`, ''], [`${dec(A)} cm`, '']], true)),
      St(`${dec(A)} ÷ ${a} = ${frac(p, q)}.`),
      St(`So the scale factor is ${frac(p, q)}${big ? '' : ' (less than 1, so the image is smaller)'}.`),
    ], { q: 'The old rectangle is dilated to make the new one. What is the scale factor?', visual: polys([[`${a} cm`, ''], [`${dec(A)} cm`, '']]), expr: `${A}/${a}` });
  }
  if (v === 2) {
    const sim = r.bool(), k = r.int(2, 3), a = r.int(2, 5), b = a + r.int(1, 3), B2 = sim ? b * k : b * k + r.pick([-2, 2, 3]);
    const pic = multiFig([{ pts: [[0, 0], [b, 0], [b, a], [0, a]], sides: [`${b} cm`, `${a} cm`], right: [0], caption: 'A' }, { pts: placeRight([[0, 0], [b, 0]], [[0, 0], [B2, 0], [B2, a * k], [0, a * k]], b * 0.4, true), t: 'hl2', sides: [`${B2} cm`, `${a * k} cm`], right: [0], caption: 'B' }]);
    return mc(r, sim ? 'Yes, they are similar' : 'No, they are not similar', [sim ? 'No, they are not similar' : 'Yes, they are similar'], { q: 'Is rectangle B a dilation of rectangle A? (Are they similar?)', visual: pic, steps: [
      St(`Compare matching sides: ${a * k} ÷ ${a} = ${k} and ${B2} ÷ ${b} = ${dec(B2 / b, 2)}.`, pic),
      St(sim ? 'Both sides grew by the same factor, so B is a dilation of A: they are similar.' : 'The two factors are different, so B is stretched, not dilated: they are not similar.')] });
  }
  if (v === 3 || v === 4) {
    const k = r.pick([2, 3, 0.5]), S = r.pick(SCALENE.filter((s) => bbox(s)[1] <= 3)), P = k === 0.5 ? shift(scale(S, 2), 2, 2) : shift(S, 1, 1), Q = scale(P, k);
    const m = Math.max(...[...P, ...Q].flat()) + 1, hi = Math.max(6, Math.ceil(m));
    const pic = (show, names) => gridFig({ lo: 0, hi, shapes: [{ pts: P, t: 'fig', names: names ? ABC : null, label: names ? '' : 'A' }, { pts: Q, t: 'hl', names: names ? ABC2 : null, label: names ? '' : 'B' }], segs: show ? P.map((p, i) => ({ a: [0, 0], b: k > 1 ? Q[i] : p, t: 'aux' })) : [] });
    if (v === 3) {
      const old = P[1][0] - P[0][0], nw = Q[1][0] - Q[0][0];
      return num(kStr(k), [
        St(`Measure a matching pair of sides on the grid. The bottom side of A is ${old} units; on B it is ${nw} units.`, pic(false, true)),
        St(`Scale factor = new ÷ old = ${nw} ÷ ${old} = ${kStr(k)}.`, pic(true, true)),
        St(`So the scale factor is ${kStr(k)}.`)], { q: 'Triangle A is dilated about the origin to make triangle B. What is the scale factor?', visual: pic(false, false), expr: String(k) });
    }
    const i = r.int(0, 2), ans = Q[i], nm = ABC[i];
    return mc(r, pt(...ans), [pt(P[i][0] + k, P[i][1] + k), pt(ans[0], P[i][1]), pt(ans[1], ans[0]), pt(P[i][0] * k + 1, ans[1])].filter((x) => x !== pt(...ans)), { q: `Triangle ABC is dilated about the origin by a scale factor of ${kStr(k)}. Where is ${nm}'?`, visual: gridFig({ lo: 0, hi, shapes: [{ pts: P, names: ABC }] }), steps: [
      St(`${nm} is at ${pt(...P[i])}. Multiply both coordinates by ${kStr(k)}.`),
      St(`${P[i][0]} × ${kStr(k)} = ${ans[0]} and ${P[i][1]} × ${kStr(k)} = ${ans[1]}.`, pic(true, true)),
      St(`So ${nm}' is at ${pt(...ans)}.`)] });
  }
  const k = r.int(2, 3), a = r.int(2, 5), b = r.int(2, 4), A = a * b, s = [[0, 0], [a, 0], [a, b], [0, b]];
  const pic = (show) => multiFig([{ pts: s, sides: [`${a} cm`, `${b} cm`], caption: `A = ${A} cm²` }, { pts: placeRight(s, scale(s, k), a * 0.5, true), t: 'hl2', sides: [`${a * k} cm`, `${b * k} cm`], label: show ? `${A * k * k} cm²` : '?', caption: `scale factor ${k}` }], { H: 230 });
  return num(A * k * k, [
    St(`Each length is multiplied by ${k}. The area uses two lengths, so it is multiplied by ${k} × ${k} = ${k * k}.`, pic(false)),
    St(`${A} × ${k * k} = ${A * k * k}. Check: ${a * k} × ${b * k} = ${A * k * k}.`, pic(true)),
    St(`So the new area is ${A * k * k} cm².`),
  ], { q: `A rectangle with area ${A} cm² is dilated by a scale factor of ${k}. What is the area of the image, in cm²?`, visual: pic(false), unit: 'cm²', expr: `${A}*${k}**2` });
}

// ═════════ 8-similar ═════════
export function similar(r) {
  const v = r.int(0, 5);
  if (v === 0) {
    const a = r.int(3, 9), b = r.int(4, 12), k = r.pick([2, 3, 1.5, 2.5]), A = a * k, B = b * k, th = r.int(55, 80);
    const T = [[0, 0], [a, 0], mulv(dir(th), b)], T2 = placeRight(T, scale(T, k), a * 0.5, true);
    const pic = (lab, hl) => multiFig([{ pts: T, sides: [`${a}`, '', `${b}`], hlSides: hl ? [0] : [] }, { pts: T2, t: 'hl2', sides: [`${dec(A)}`, '', lab], hlSides: hl ? [0] : [] }]);
    return num(dec(B), [
      St(`The triangles are similar, so the big one is the small one scaled up. Matching sides: ${a} and ${dec(A)}. Scale factor = ${dec(A)} ÷ ${a} = ${k}.`, pic('x', true)),
      St(`Multiply the matching side by the scale factor: x = ${b} × ${k} = ${dec(B)}.`, pic(dec(B))),
      St(`So x = ${dec(B)} cm.`),
    ], { q: 'These triangles are similar. What is the length x, in cm? (Lengths are in cm.)', visual: pic('x'), unit: 'cm', expr: `${b}*${A}/${a}` });
  }
  if (v === 1) {
    const d = r.int(60, 115), k = r.pick([1.5, 2, 2.5]), P0 = mulv(dir(d), 4), quad = [P0, [0, 0], [6, 0], add(P0, [4.2, 0.8])];
    const big = placeRight(quad, scale(quad, k), 2, true);
    const pic = (lab, hl) => multiFig([{ pts: quad, names: ['P', 'Q', 'R', 'S'], angles: ['', `${d}°`, '', ''], hlAngles: hl ? [1] : [] }, { pts: big, t: 'hl2', names: ['W', 'X', 'Y', 'Z'], angles: ['', lab, '', ''], hlAngles: hl ? [1] : [] }]);
    return num(d, [
      St(`PQRS ~ WXYZ: the letters match in order, so ∠Q matches ∠X.`, pic('?', true)),
      St('A dilation changes lengths, not angles: matching angles of similar figures are equal.', pic(`${d}°`)),
      St(`So ∠X = ${d}°.`),
    ], { q: `Quadrilateral PQRS is similar to WXYZ, with a scale factor of ${k}. What is ∠X, in degrees?`, visual: pic('?'), unit: '°', expr: String(d) });
  }
  if (v === 2) {
    const A = r.int(35, 80), B = r.int(35, 85), sim = r.bool(), B2 = sim ? B : B + r.pick([-12, -8, 9, 14]);
    if (180 - A - B < 20 || 180 - A - B2 < 20) return similar(r);
    const T1 = triFromAngles(A, B, 5), T2 = triFromAngles(A, B2, 8), two = (l1, l2) => ({ type: 'figs', figs: [G.polygonFig({ pts: T1, angles: l1 }), G.polygonFig({ pts: T2, angles: l2 })], captions: ['1', '2'] });
    const pic = two([`${A}°`, `${B}°`, ''], [`${A}°`, `${B2}°`, '']);
    const C = 180 - A - B, C2 = 180 - A - B2;
    return mc(r, sim ? 'Yes' : 'No', [sim ? 'No' : 'Yes'], { q: 'Are these two triangles similar?', visual: pic, steps: [
      St(`Find each third angle: 180° − ${A}° − ${B}° = ${C}° and 180° − ${A}° − ${B2}° = ${C2}°.`, two([`${A}°`, `${B}°`, `${C}°`], [`${A}°`, `${B2}°`, `${C2}°`])),
      St(sim ? 'All three angles match, so the triangles are similar (one is a scaled copy of the other).' : 'The angles do not match, so the triangles are not similar.'),
      St(`So the answer is ${sim ? 'Yes' : 'No'}.`)] });
  }
  if (v === 3) {
    const h = r.pick([1, 2, 3]), s = r.pick([2, 3, 4, 5].filter((x) => x !== h)), m = r.int(3, 8), H = h * m, Sh = s * m;
    const p1 = [[0, 0], [s, 0], [0, h]], p2 = placeRight(p1, scale(p1, 2.4), s * 0.6, true);
    const pic = (lab, hl) => multiFig([{ pts: p1, sides: [`${s} m`, '', `${h} m`], right: [0], caption: 'pole' }, { pts: p2, t: 'hl2', sides: [`${Sh} m`, '', lab], right: [0], hlSides: hl ? [2] : [], caption: 'tree' }], { H: 230 });
    return num(H, [
      St(`At the same time of day the sun makes similar triangles: height ÷ shadow is the same for both. Scale factor = ${Sh} ÷ ${s} = ${m}.`, pic('h', true)),
      St(`h = ${h} × ${m} = ${H}.`, pic(`${H} m`)),
      St(`So the tree is ${H} m tall.`),
    ], { q: `A ${h} m pole casts a ${s} m shadow. At the same time a tree casts a ${Sh} m shadow. How tall is the tree, in m? (Not drawn to scale.)`, visual: pic('h'), unit: 'm', expr: `${h}*${Sh}/${s}` });
  }
  if (v === 4) {
    const sides = r.pick([[3, 4, 5], [4, 5, 6], [5, 6, 8], [4, 6, 7], [3, 5, 7]]), k = r.pick([2, 1.5, 2.5]), P = sides.reduce((a, b) => a + b, 0), T = triFromSides(sides[1], sides[2], sides[0]), T2 = placeRight(T, scale(T, k), 2, true);
    const pic = (lab) => multiFig([{ pts: T, sides: sides.map(String) }, { pts: T2, t: 'hl2', sides: [dec(sides[0] * k), '', ''], label: lab }]);
    return num(dec(P * k), [
      St(`Scale factor: ${dec(sides[0] * k)} ÷ ${sides[0]} = ${k}.`, pic('')),
      St(`Every side is multiplied by ${k}, so the perimeter is too. Small perimeter: ${sides.join(' + ')} = ${P}. Large: ${P} × ${k} = ${dec(P * k)}.`),
      St(`So the large triangle's perimeter is ${dec(P * k)} cm.`),
    ], { q: 'These triangles are similar (lengths in cm). What is the perimeter of the large one, in cm?', visual: pic(''), unit: 'cm', expr: `${P}*${k}` });
  }
  const k = r.pick([2, 3]), w = r.int(2, 6), l = w + r.int(1, 5), W = w * k, Lg = l * k;
  const s = [[0, 0], [l, 0], [l, w], [0, w]], pic = (lab) => multiFig([{ pts: s, sides: [lab, `${w} m`], right: [0] }, { pts: placeRight(s, scale(s, k), 2, true), t: 'hl2', sides: [`${Lg} m`, `${W} m`], right: [0] }]);
  return num(l, [
    St(`Matching sides: ${W} on the large one and ${w} on the small one. Scale factor = ${W} ÷ ${w} = ${k}.`, pic('x')),
    St(`Going from large to small, divide by ${k}: x = ${Lg} ÷ ${k} = ${l}.`, pic(`${l} m`)),
    St(`So x = ${l} m.`),
  ], { q: 'These rectangles are similar. What is the length x, in m?', visual: pic('x'), unit: 'm', expr: `${Lg}/${k}` });
}

// ═════════ 8-pythapply ═════════
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29]];
const rtri = (a, b, labs, hl = []) => G.polygonFig({ pts: [[0, 0], [a, 0], [0, b]], right: [0], sides: labs, hl: hl.map((j) => ({ side: j })) });
export function pythApply(r) {
  const v = r.int(0, 8), [a, b, c] = r.pick(TRIPLES);
  if (v === 0) {
    const yes = r.bool(), C = yes ? c : c + r.pick([-1, 1]), pic = G.polygonFig({ pts: triFromSides(b, C, a), sides: [`${a}`, `${b}`, `${C}`] });
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: `A triangle has sides ${a}, ${b} and ${C}. Is it a right triangle?`, visual: pic, steps: [
      St('Use the converse of the Pythagorean theorem: if a² + b² = c² with c the longest side, there is a right angle.', pic),
      St(`${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}, and ${C}² = ${C * C}.`),
      St(yes ? 'They are equal, so yes, it is a right triangle.' : 'They are not equal, so no, it is not a right triangle.')] });
  }
  if (v === 1) {
    const pic = (lab, hl) => G.polygonFig({ pts: [[0, 0], [a, 0], [0, b]], right: [0], sides: [`${a} m`, `${c} m`, lab], hl: hl ? [{ side: 1 }] : null, extra: [[-0.12 * b, b * 1.1]], cuts: [[[0, 0], [0, b * 1.12]]] });
    return num(b, [
      St(`The wall, the ground and the ladder make a right triangle. The ladder is the hypotenuse (opposite the right angle): ${c}² = ${a}² + h².`, pic('h', true)),
      St(`h² = ${c * c} − ${a * a} = ${b * b}, so h = √${b * b} = ${b}.`, pic(`${b} m`)),
      St(`So the ladder reaches ${b} m up the wall.`),
    ], { q: `A ${c} m ladder leans against a wall. Its foot is ${a} m from the wall. How high up the wall does it reach, in m?`, visual: pic('h'), unit: 'm', expr: `Math.sqrt(${c}**2-${a}**2)` });
  }
  if (v === 2) return num(a + b + c, [
    St(`First find the hypotenuse: √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = √${c * c} = ${c}.`, rtri(a, b, [`${a} cm`, `${c} cm`, `${b} cm`], [1])),
    St(`Perimeter = ${a} + ${b} + ${c}.`),
    St(`So the perimeter is ${a + b + c} cm.`),
  ], { q: 'What is the perimeter of this right triangle, in cm?', visual: rtri(a, b, [`${a} cm`, '', `${b} cm`]), unit: 'cm', expr: `${a}+${b}+Math.hypot(${a},${b})` });
  if (v === 3) {
    const pic = (lab, hl) => G.polygonFig({ pts: [[0, 0], [b, 0], [b, a], [0, a]], right: [0, 1, 2, 3], sides: [`${b} m`, `${a} m`, '', ''], diag: [[0, 2, hl ? 'hlline' : 'aux']], notes: [{ at: [b * 0.42, a * 0.62], s: lab, t: hl ? 'hl' : 'ink' }] });
    return num(c, [
      St(`The diagonal cuts the rectangle into two right triangles with legs ${b} and ${a}.`, pic('d', true)),
      St(`d² = ${b}² + ${a}² = ${b * b} + ${a * a} = ${c * c}, so d = √${c * c} = ${c}.`),
      St(`So the path is ${c} m long.`, pic(`${c} m`)),
    ], { q: `A rectangular field is ${b} m by ${a} m. How long is the path straight across from corner to corner, in m?`, visual: pic('d'), unit: 'm', expr: `Math.hypot(${a},${b})` });
  }
  if (v === 4) return num(c, [
    St('The hypotenuse c is the longest side, across from the right angle. a² + b² = c².', rtri(a, b, [`${a}`, 'c', `${b}`], [1])),
    St(`c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}.`),
    St(`c = √${c * c} = ${c}. So the hypotenuse is ${c}.`),
  ], { q: 'Find the length of the hypotenuse c.', visual: rtri(a, b, [`${a}`, 'c', `${b}`]), unit: 'c =', expr: `Math.hypot(${a},${b})` });
  if (v === 5) return num(a, [
    St(`The hypotenuse is ${c}, across from the right angle, so ${c}² = x² + ${b}².`, rtri(a, b, ['x', `${c}`, `${b}`], [1])),
    St(`x² = ${c * c} − ${b * b} = ${a * a}.`),
    St(`x = √${a * a} = ${a}. So x = ${a}.`),
  ], { q: 'Find the missing side x of this right triangle.', visual: rtri(a, b, ['x', `${c}`, `${b}`]), unit: 'x =', expr: `Math.sqrt(${c}**2-${b}**2)` });
  if (v === 6) {
    const [p, q, d] = r.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]]), sx = r.int(-5, 5 - p), sy = r.int(-5, 5 - q), A = [sx, sy], B = [sx + p, sy + q];
    const pic = (show) => gridFig({ lo: -6, hi: 6, points: [{ at: A, s: 'A' }, { at: B, s: 'B' }], segs: [{ a: A, b: B, t: show ? 'hlline' : 'ink' }, ...(show ? [{ a: A, b: [B[0], A[1]], t: 'aux' }, { a: [B[0], A[1]], b: B, t: 'aux' }] : [])] });
    return num(d, [
      St(`Draw a right triangle under AB: across ${p}, up ${q}.`, pic(true)),
      St(`AB² = ${p}² + ${q}² = ${p * p + q * q}.`),
      St(`AB = √${p * p + q * q} = ${d}. So the distance is ${d} units.`),
    ], { q: `How far apart are A ${pt(...A)} and B ${pt(...B)}?`, visual: pic(false), unit: 'units', expr: `Math.hypot(${p},${q})` });
  }
  if (v === 7) {
    const [hb, h, s] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [4, 3, 5], [12, 5, 13]]);
    const pic = (lab, hl) => G.polygonFig({ pts: [[0, 0], [2 * hb, 0], [hb, h]], ticks: [0, 1, 1], sides: [`${2 * hb} cm`, `${s} cm`, `${s} cm`], height: { from: 2, side: 0, label: lab }, hl: hl ? ['height'] : null });
    return num(h, [
      St(`The height of an isosceles triangle cuts the base in half: ${2 * hb} ÷ 2 = ${hb}. It makes a right triangle with hypotenuse ${s}.`, pic('h', true)),
      St(`h² = ${s}² − ${hb}² = ${s * s} − ${hb * hb} = ${h * h}, so h = ${h}.`),
      St(`So the height is ${h} cm.`, pic(`${h} cm`)),
    ], { q: 'This triangle is isosceles. What is its height h, in cm?', visual: pic('h'), unit: 'cm', expr: `Math.sqrt(${s}**2-${hb}**2)` });
  }
  let p, q; do { p = r.int(2, 12); q = r.int(2, 12); } while (Number.isInteger(Math.hypot(p, q)));
  const c2 = p * p + q * q, ans = dec(Math.round(Math.sqrt(c2) * 10) / 10);
  return num(ans, [
    St(`c² = ${p}² + ${q}² = ${p * p} + ${q * q} = ${c2}.`, rtri(p, q, [`${p} cm`, 'c', `${q} cm`], [1])),
    St(`c = √${c2} ≈ ${dec(Math.sqrt(c2), 3)}.`),
    St(`To the nearest tenth, c ≈ ${ans} cm.`),
  ], { q: 'Find the hypotenuse c, in cm. Round to the nearest tenth.', visual: rtri(p, q, [`${p} cm`, 'c', `${q} cm`]), unit: 'cm', tol: 0.05001, expr: `Math.hypot(${p},${q})` });
}

// ═════════ 8-solids ═════════
const SOLIDS8 = {
  cube: [6, 12, 8, () => G.boxFig({ l: 4, w: 4, h: 4 })],
  'rectangular prism': [6, 12, 8, () => G.boxFig({ l: 7, w: 3, h: 4 })],
  'triangular prism': [5, 9, 6, () => G.prismFig({ base: [[0, 0], [5, 0], [2, 4]], depth: 6 })],
  'square pyramid': [5, 8, 5, () => G.pyramidFig({ a: 5, h: 6 })],
  'triangular pyramid': [4, 6, 4, () => G.pyramidFig({ a: 5, h: 6, tri: true })],
  'pentagonal prism': [7, 15, 10, () => G.prismFig({ base: G.regular(5, 3), depth: 5 })],
  'hexagonal prism': [8, 18, 12, () => G.prismFig({ base: G.regular(6, 3), depth: 5 })],
};
const viewFig = (kind) => {
  const items = [], c = [70, 60];
  if (kind === 'circle' || kind === 'circdot') { items.push(G.circle(c, 40, 'front')); if (kind === 'circdot') items.push(G.dot(c)); }
  if (kind === 'rect' || kind === 'ridge') { items.push(G.poly([[20, 30], [120, 30], [120, 90], [20, 90]], 'front')); if (kind === 'ridge') items.push(G.line([20, 60], [120, 60], 'ink')); }
  if (kind === 'square' || kind === 'sqx') { items.push(G.poly([[35, 25], [105, 25], [105, 95], [35, 95]], 'front')); if (kind === 'sqx') items.push(G.line([35, 25], [105, 95], 'ink'), G.line([105, 25], [35, 95], 'ink')); }
  if (kind === 'tri') items.push(G.poly([[25, 95], [115, 95], [70, 22]], 'front'));
  if (kind === 'tallrect') items.push(G.poly([[40, 18], [100, 18], [100, 102], [40, 102]], 'front'));
  return G.fig(items, 140, 120);
};
const VIEWS = [['circle', 'tallrect', 'cylinder'], ['circdot', 'tri', 'cone'], ['square', 'square', 'cube'], ['sqx', 'tri', 'square pyramid'], ['circle', 'circle', 'sphere'], ['ridge', 'tri', 'triangular prism']];
const VIEWPIC = { cylinder: () => G.cylinderFig({ r: 3, h: 6 }), cone: () => G.coneFig({ r: 3, h: 6 }), cube: () => G.boxFig({ l: 4, w: 4, h: 4 }), 'square pyramid': () => G.pyramidFig({ a: 5, h: 6 }), sphere: () => G.sphereFig(), 'triangular prism': () => G.prismFig({ base: [[0, 0], [5, 0], [2.5, 3.5]], depth: 6 }) };
const NETS = [['cube', () => G.netFig({ cells: G.CUBE_NETS[5] }), '6 equal squares'], ['rectangular prism', () => G.boxNet({ l: 6, w: 3, h: 4 }), '6 rectangles in 3 matching pairs'], ['cylinder', () => G.cylinderNet(), '2 equal circles and a rectangle'], ['square pyramid', () => G.pyramidNet(), '1 square and 4 triangles'], ['triangular prism', () => G.triPrismNet(), '2 triangles and 3 rectangles'], ['cone', () => G.coneNet(), 'a circle and a sector (a slice of a bigger circle)']];
export function solids(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const name = r.pick(Object.keys(SOLIDS8)), [F, E, V, mk] = SOLIDS8[name], ask = r.int(0, 2), ans = [F, E, V][ask], w = ['faces', 'edges', 'vertices'][ask], pic = mk();
    const prism = name.includes('prism') || name === 'cube', n = { cube: 4, 'rectangular prism': 4, 'triangular prism': 3, 'square pyramid': 4, 'triangular pyramid': 3, 'pentagonal prism': 5, 'hexagonal prism': 6 }[name];
    const why = prism ? { faces: `${n} faces round the side + 2 bases = ${F}.`, edges: `${n} edges round each base (2 × ${n}) + ${n} joining them = ${E}.`, vertices: `${n} corners on each base: 2 × ${n} = ${V}.` }[w] : { faces: `${n} triangles + 1 base = ${F}.`, edges: `${n} round the base + ${n} up to the top = ${E}.`, vertices: `${n} round the base + 1 at the top = ${V}.` }[w];
    return num(ans, [St(`This is ${art(name)} ${name}: its base has ${n} sides. Dashed edges are at the back, hidden from view: count them too.`, pic), St(why), St(`So it has ${ans} ${w}.`)], { q: `How many ${w} does this ${name} have?`, visual: pic, expr: String(ans) });
  }
  if (v === 1) {
    const [right, f, d] = r.pick(NETS), pic = f();
    return mc(r, right, r.shuffle(NETS.map((x) => x[0]).filter((x) => x !== right)).slice(0, 3), { q: 'This net is folded up along its edges. What solid does it make?', visual: pic, steps: [St(`Each piece of a net becomes one face of the solid. This net has ${d}.`, pic), St(`They fold into ${art(right)} ${right}.`, VIEWPIC[right]?.() ?? SOLIDS8[right]?.[3]())] });
  }
  if (v === 2) {
    const [top, front, right] = r.pick(VIEWS), pic = { type: 'figs', figs: [viewFig(top), viewFig(front)], captions: ['Top view', 'Front view'] };
    return mc(r, right, r.shuffle(VIEWS.map((x) => x[2]).filter((x) => x !== right)).slice(0, 3), { q: 'These are the views of a solid from the top and from the front. What is the solid?', visual: pic, steps: [St('Imagine looking straight down on each solid, then straight at its front.', pic), St(`Only ${art(right)} ${right} looks like this from both sides.`, VIEWPIC[right]()), St(`So it is ${art(right)} ${right}.`)] });
  }
  if (v === 3) {
    const k = r.pick([2, 3, 1.5]), h = r.int(4, 12), w = r.int(2, 8), l = r.int(3, 9);
    const pic = (lab) => ({ type: 'figs', figs: [G.boxFig({ l, w, h, labels: ['', `${w} cm`, `${h} cm`] }), G.boxFig({ l, w, h, labels: ['', lab, `${dec(h * k)} cm`], hl: lab === '?' ? null : ['width'] })], captions: ['small', 'large'] });
    return num(dec(w * k), [St(`Similar solids grow by the same scale factor in every direction. Heights: ${dec(h * k)} ÷ ${h} = ${k}.`, pic('?')), St(`Width: ${w} × ${k} = ${dec(w * k)}.`, pic(`${dec(w * k)} cm`)), St(`So the large box is ${dec(w * k)} cm wide.`)], { q: 'These two boxes are similar (not drawn to scale). How wide is the large one, in cm?', visual: pic('?'), unit: 'cm', expr: `${w}*${h * k}/${h}` });
  }
  if (v === 4) {
    const n = r.pick([3, 4, 5, 6, 8]), F = n + 2, V = 2 * n, E = 3 * n, ask = r.pick(['E', 'F', 'V']);
    const given = { E: `${F} faces and ${V} vertices`, F: `${V} vertices and ${E} edges`, V: `${F} faces and ${E} edges` }[ask], ans = { E, F, V }[ask], word = { E: 'edges', F: 'faces', V: 'vertices' }[ask];
    const pic = n === 4 ? G.boxFig({ l: 6, w: 3, h: 4 }) : G.prismFig({ base: G.regular(n, 3), depth: 5 });
    return num(ans, [St(`For any solid with flat faces, Euler's formula says F + V − E = 2. For example this ${{ 3: 'triangular prism', 4: 'box', 5: 'pentagonal prism', 6: 'hexagonal prism', 8: 'octagonal prism' }[n]}: ${F} + ${V} − ${E} = 2.`, pic), St(ask === 'E' ? `${F} + ${V} − E = 2, so E = ${F + V} − 2 = ${E}.` : ask === 'F' ? `F + ${V} − ${E} = 2, so F = 2 + ${E} − ${V} = ${F}.` : `${F} + V − ${E} = 2, so V = 2 + ${E} − ${F} = ${V}.`), St(`So it has ${ans} ${word}.`)], { q: `A solid has ${given}. Use Euler's formula to find the number of ${word}.`, expr: String(ans) });
  }
  if (v === 5) {
    const X = [['box', 'across', 'rectangle', 'a box, cut parallel to its base'], ['cube', 'down', 'square', 'a cube, cut parallel to a face'], ['cylinder', 'across', 'circle', 'a cylinder, cut parallel to its bases'], ['cylinder', 'down', 'rectangle', 'a cylinder, cut straight down through its centre'], ['cone', 'down', 'triangle', 'a cone, cut straight down through its tip'], ['pyramid', 'across', 'square', 'a square pyramid, cut parallel to its base'], ['sphere', 'across', 'circle', 'a sphere, cut through its centre']];
    const [solid, cut, right, desc] = r.pick(X), pic = G.sliceFig({ solid, cut });
    return mc(r, right, ['square', 'circle', 'rectangle', 'triangle'].filter((x) => x !== right), { q: `The yellow plane slices ${desc}. What shape is the cross-section?`, visual: pic, steps: [St('A cross-section is the flat face you would see if you cut along the plane and looked straight at the cut.', pic), St(`Here the cut face is ${art(right)} ${right}.`)] });
  }
  if (v === 6) {
    const good = r.pick(G.CUBE_NETS), bad = r.shuffle(G.NOT_CUBE_NETS).slice(0, 3), all = r.shuffle([good, ...bad]), k = all.indexOf(good), L = ['A', 'B', 'C', 'D'];
    return mc(r, L[k], L.filter((_, i) => i !== k), { q: 'Each net has 6 squares. Which one folds into a cube?', visual: { type: 'figs', figs: all.map((cells) => G.netFig({ cells })), captions: L }, steps: [
      St('Fold each net in your mind, keeping one square as the bottom. Watch for squares that would land on the same face.'),
      St('Nets that never work: a row of 5 or more squares, a 2 × 2 block, or two squares folding onto the same side.', { type: 'figs', figs: all.map((cells, i) => G.netFig({ cells, hl: i === k ? [0, 1, 2, 3, 4, 5] : [] })), captions: L }),
      St(`Only net ${L[k]} gives every square its own face. So the answer is ${L[k]}.`)] });
  }
  const all = { ...Object.fromEntries(Object.entries(SOLIDS8).map(([k, x]) => [k, x[3]])), cylinder: VIEWPIC.cylinder, cone: VIEWPIC.cone, sphere: VIEWPIC.sphere };
  const right = r.pick(Object.keys(all)), pic = all[right]();
  return mc(r, right, r.shuffle(Object.keys(all).filter((x) => x !== right && !(right === 'cube' && x === 'rectangular prism') && !(right === 'rectangular prism' && x === 'cube'))).slice(0, 3), { q: 'What is the name of this solid?', visual: pic, steps: [St('Look at the bases (the faces at the ends or the bottom), and at what joins them.', pic), St(`So it is ${art(right)} ${right}.`)] });
}

// ═════════ 8-areas ═════════
export function areas(r) {
  const v = r.int(0, 7), u = r.pick(['m', 'cm']);
  if (v === 0 || v === 1 || v === 6) {
    const tri = v !== 0, b = r.int(4, 16), h = r.int(3, 12), A = tri ? (b * h) / 2 : b * h, [B, H] = disp(b, h), off = H * r.pick([0.3, 0.45, 0.6]);
    const pts = tri ? [[0, 0], [B, 0], [B * r.pick([0.25, 0.4, 0.7]), H]] : [[0, 0], [B, 0], [B + off, H], [off, H]];
    const pic = (hl, hLab = `${h} ${u}`) => G.polygonFig({ pts, sides: [`${b} ${u}`], base: 0, height: { from: tri ? 2 : 3, side: 0, label: hLab }, par: tri ? null : [1, 2, 1, 2], hl });
    if (v === 6) return num(h, [
      St(`A = base × height ÷ 2, so base × height = 2 × ${dec(A)} = ${b * h}.`, pic(['base'], 'h')),
      St(`h = ${b * h} ÷ ${b} = ${h}.`, pic(['height'], `${h} ${u}`)),
      St(`So the height is ${h} ${u}.`),
    ], { q: `This triangle has an area of ${dec(A)} ${u}². What is its height h, in ${u}?`, visual: pic(null, 'h'), unit: u, expr: `2*${A}/${b}` });
    return num(dec(A), [
      St(tri ? 'A triangle is half of a parallelogram with the same base and height: A = base × height ÷ 2. The height is the dashed line at right angles to the base.' : 'Cut the triangle off one end of the parallelogram and slide it to the other: it becomes a rectangle. So A = base × height, using the dashed height, not the slanted side.', pic(['base', 'height'])),
      St(tri ? `A = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = ${dec(A)}.` : `A = ${b} × ${h} = ${A}.`),
      St(`So the area is ${dec(A)} ${u}².`),
    ], { q: `What is the area of this ${tri ? 'triangle' : 'parallelogram'}, in ${u}²?`, visual: pic(null), unit: `${u}²`, expr: tri ? `${b}*${h}/2` : `${b}*${h}` });
  }
  if (v === 2) {
    const b = r.int(6, 18), a = r.int(2, b - 2), h = r.int(2, 10), A = ((a + b) * h) / 2, [B, H] = disp(b, h), Lx = ((b - a) / b) * B * r.pick([0.3, 0.5, 0.7]);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [Lx + (a / b) * B, H], [Lx, H]], sides: [`${b} ${u}`, '', `${a} ${u}`, ''], height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 0, 1, 0], hl });
    return num(dec(A), [
      St(`The parallel sides are ${a} and ${b}. Add them: ${a} + ${b} = ${a + b}.`, pic([{ side: 0 }, { side: 2 }])),
      St(`Multiply by the height and halve: A = (${a} + ${b}) × ${h} ÷ 2 = ${a + b} × ${h} ÷ 2 = ${dec(A)}.`, pic(['height'])),
      St(`So the area is ${dec(A)} ${u}².`),
    ], { q: `What is the area of this trapezoid, in ${u}²?`, visual: pic(null), unit: `${u}²`, expr: `(${a}+${b})/2*${h}` });
  }
  if (v === 3) {
    const n = r.int(4, 6), sides = Array.from({ length: n }, () => r.int(3, 20)), P = sides.reduce((x, y) => x + y, 0), pts = wobble(n, 0.18);
    const pic = (hl) => G.polygonFig({ pts, sides: sides.map((s) => `${s} ${u}`), hl: hl ? sides.map((_, j) => ({ side: j })) : null });
    return num(P, [St('Perimeter is the distance all the way around: add every side.', pic(true)), St(`${sides.join(' + ')} = ${P}.`), St(`So the perimeter is ${P} ${u}.`)], { q: `What is the perimeter of this ${NG[n]}, in ${u}? (Not drawn to scale.)`, visual: pic(false), unit: u, expr: sides.join('+') });
  }
  if (v === 4) {
    const L = r.int(8, 20), W = r.int(6, 14), s = r.int(2, Math.min(L, W) - 3), x0 = r.int(1, L - s - 1), y0 = r.int(1, W - s - 1);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [L, 0], [L, W], [0, W]], holes: [[[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]]], shade: true, sides: [`${L} m`, `${W} m`, '', ''], notes: [{ at: [x0 + s / 2, y0 + s / 2], s: `${s} × ${s}`, t: hl ? 'hl' : 'ink' }] });
    return num(L * W - s * s, [
      St(`The whole yard: ${L} × ${W} = ${L * W} m².`, pic(false)),
      St(`Take away the square pool: ${s} × ${s} = ${s * s} m². ${L * W} − ${s * s} = ${L * W - s * s}.`, pic(true)),
      St(`So ${L * W - s * s} m² of the yard is not pool.`),
    ], { q: `A ${L} m by ${W} m yard has a ${s} m by ${s} m square pool. What area of the yard (green) is not pool, in m²?`, visual: pic(false), unit: 'm²', expr: `${L}*${W}-${s}*${s}` });
  }
  if (v === 5) {
    const k = r.pick([2, 3]), a = r.int(2, 5), b = r.int(2, 4), A = a * b, area = r.bool(), Pm = 2 * (a + b), s = [[0, 0], [a, 0], [a, b], [0, b]];
    const pic = (lab) => multiFig([{ pts: s, sides: [`${a} cm`, `${b} cm`], label: area ? `${A} cm²` : '', caption: area ? '' : `P = ${Pm} cm` }, { pts: placeRight(s, scale(s, k), a * 0.5, true), t: 'hl2', sides: [`${a * k} cm`, `${b * k} cm`], label: area ? lab : '', caption: area ? '' : `P = ${lab}` }]);
    const ans = area ? A * k * k : Pm * k;
    return num(ans, [
      St(area ? `Every length is ${k} times as long. Area uses two lengths, so it is multiplied by ${k} × ${k} = ${k * k}.` : `Every length is ${k} times as long, so the distance around is ${k} times as long too.`, pic('?')),
      St(area ? `${A} × ${k * k} = ${ans}. Check: ${a * k} × ${b * k} = ${ans}.` : `${Pm} × ${k} = ${ans}.`, pic(area ? `${ans} cm²` : `${ans} cm`)),
      St(`So the new ${area ? 'area' : 'perimeter'} is ${ans} ${area ? 'cm²' : 'cm'}.`),
    ], { q: `Every side of the small rectangle is made ${k} times as long. What is the new ${area ? 'area, in cm²' : 'perimeter, in cm'}?`, visual: pic('?'), unit: area ? 'cm²' : 'cm', expr: area ? `${A}*${k}**2` : `${Pm}*${k}` });
  }
  const l = r.int(4, 20), w = r.int(2, l), P = 2 * (l + w), [Ld, Wd] = disp(l, w);
  const pic = (lab, hl) => G.polygonFig({ pts: [[0, 0], [Ld, 0], [Ld, Wd], [0, Wd]], right: [0, 1, 2, 3], sides: [`${l} ${u}`, lab, '', ''], hl: hl ? [{ side: 1 }] : null });
  return num(w, [
    St(`The perimeter goes round two lengths and two widths: ${l} + ${l} + w + w = ${P}.`, pic('w', true)),
    St(`2w = ${P} − ${2 * l} = ${2 * w}, so w = ${w}.`, pic(`${w} ${u}`)),
    St(`So the width is ${w} ${u}.`),
  ], { q: `This rectangle has a perimeter of ${P} ${u}. What is its width w, in ${u}?`, visual: pic('w'), unit: u, expr: `(${P}-2*${l})/2` });
}

// ═════════ 8-circles ═════════
const arcPts = (R, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => mulv(dir(a0 + ((a1 - a0) * i) / n), R));
const partFig = (half, lab, hl) => {
  const R = 5;
  if (half) { const pts = [[-R, 0], [R, 0], ...arcPts(R, 0, 180).slice(1, -1)]; return G.polygonFig({ pts, sides: [lab], hl: hl === 'fill' ? 'fill' : hl === 'curve' ? pts.map((_, j) => ({ side: j })) : null }); }
  const pts = [[0, 0], [R, 0], ...arcPts(R, 0, 90).slice(1, -1), [0, R]];
  return G.polygonFig({ pts, sides: [lab], right: [0], hl: hl === 'fill' ? 'fill' : hl === 'curve' ? pts.map((_, j) => ({ side: j })).slice(1, -1) : null });
};
export function circles(r) {
  const v = r.int(0, 6), rad = r.int(2, 15);
  if (v === 0 || v === 1) {
    const useD = r.bool(), area = v === 1, val = area ? 3.14 * rad * rad : 2 * 3.14 * rad, ans = P2(val);
    const pic = (hl) => G.circleFig({ show: useD ? 'diameter' : 'radius', r: `${rad} cm`, d: `${2 * rad} cm`, hl });
    return num(ans, [
      St(useD ? `The diameter goes all the way across the centre. The radius is half of it: ${2 * rad} ÷ 2 = ${rad} cm.` : `The radius goes from the centre to the edge: ${rad} cm.`, pic(useD ? 'diameter' : 'radius')),
      St(area ? `A = π × r² ≈ 3.14 × ${rad}² = 3.14 × ${rad * rad} = ${ans}.` : `C = 2 × π × r ≈ 2 × 3.14 × ${rad} = ${ans}.`, pic(area ? 'fill' : null)),
      St(`So the ${area ? `area is ${ans} cm²` : `circumference is ${ans} cm`}.`),
    ], { q: `Using π ≈ 3.14, what is the ${area ? 'area' : 'circumference'} of this circle? Round to the nearest hundredth.`, visual: pic(null), unit: area ? 'cm²' : 'cm', tol: 0.01, expr: area ? `3.14*${rad}**2` : `2*3.14*${rad}` });
  }
  if (v === 2) {
    const d = r.int(50, 80), turns = r.int(10, 100), dist = (3.14 * d * turns) / 100, pic = G.circleFig({ show: 'diameter', d: `${d} cm` });
    return num(P2(dist), [St(`In one turn the wheel rolls its circumference: π × d ≈ 3.14 × ${d} = ${P2(3.14 * d)} cm.`, pic), St(`${turns} turns: ${P2(3.14 * d)} × ${turns} = ${P2(3.14 * d * turns)} cm, and ÷ 100 to change to metres: ${P2(dist)} m.`), St(`So the bike travels ${P2(dist)} m.`)], { q: `This bike wheel has a diameter of ${d} cm. How many metres does the bike travel when the wheel turns ${turns} times? (π ≈ 3.14; round to the nearest hundredth)`, visual: pic, unit: 'm', tol: 0.01, expr: `3.14*${d}*${turns}/100` });
  }
  if (v === 3 || v === 4) {
    const half = r.bool(), part = half ? 2 : 4, name = half ? 'semicircle' : 'quarter circle', lab = half ? `${2 * rad} cm` : `${rad} cm`;
    if (v === 3) {
      const A = (3.14 * rad * rad) / part;
      return num(P2(A), [
        St(half ? `The straight side is the diameter, ${2 * rad} cm, so the radius is ${rad} cm.` : `The two straight sides are radii: r = ${rad} cm.`, partFig(half, lab)),
        St(`A whole circle would be 3.14 × ${rad}² = ${P2(3.14 * rad * rad)} cm². ${half ? 'Half' : 'A quarter'} of it: ÷ ${part} = ${P2(A)}.`, partFig(half, lab, 'fill')),
        St(`So the area is ${P2(A)} cm².`),
      ], { q: `Using π ≈ 3.14, what is the area of this ${name}? Round to the nearest hundredth.`, visual: partFig(half, lab), unit: 'cm²', tol: 0.01, expr: `3.14*${rad}**2/${part}` });
    }
    const curve = (2 * 3.14 * rad) / part, P = curve + 2 * rad;
    return num(P2(P), [
      St(`The curved part is ${half ? 'half' : 'a quarter'} of the circumference: 2 × 3.14 × ${rad} ÷ ${part} = ${P2(curve)} cm.`, partFig(half, lab, 'curve')),
      St(half ? `Add the straight side, the diameter: ${P2(curve)} + ${2 * rad} = ${P2(P)}.` : `Add the two straight radii: ${P2(curve)} + ${rad} + ${rad} = ${P2(P)}.`),
      St(`So the perimeter is ${P2(P)} cm.`),
    ], { q: `Using π ≈ 3.14, what is the perimeter of this ${name} (curved part plus straight sides)? Round to the nearest hundredth.`, visual: partFig(half, lab), unit: 'cm', tol: 0.01, expr: `2*3.14*${rad}/${part}+2*${rad}` });
  }
  if (v === 5) {
    const C = P2(2 * 3.14 * rad), d = r.bool();
    const pic = (show) => G.circleFig({ show: d ? 'diameter' : 'radius', r: show ? `${rad} cm` : 'r', d: show ? `${2 * rad} cm` : 'd' });
    return num(d ? 2 * rad : rad, [
      St(`C = π × d, so d = C ÷ π ≈ ${C} ÷ 3.14 = ${2 * rad}.`, pic(false)),
      St(d ? `So the diameter is ${2 * rad} cm.` : `The radius is half the diameter: ${2 * rad} ÷ 2 = ${rad}.`, pic(true)),
      St(d ? `d = ${2 * rad} cm.` : `So the radius is ${rad} cm.`),
    ], { q: `A circle has a circumference of ${C} cm. Using π ≈ 3.14, what is its ${d ? 'diameter d' : 'radius r'}, in cm?`, visual: pic(false), unit: 'cm', tol: 0.01, expr: d ? `${C}/3.14` : `${C}/3.14/2` });
  }
  const R = r.int(4, 12), s = r.int(1, R - 2), A = 3.14 * (R * R - s * s);
  const ring = (hl) => { const C = [130, 110], RR = 84, rr = (RR * s) / R; return G.fig([G.circle(C, RR, hl === 'big' ? 'hl' : 'shade'), G.circle(C, rr, 'paper'), G.line(C, [C[0] + RR * 0.8, C[1] - RR * 0.6], 'aux'), G.line(C, [C[0] - rr, C[1]], 'aux'), G.dot(C), G.text([C[0] + RR * 0.48, C[1] - RR * 0.36 - 12], `${R} cm`, 'ink'), G.text([C[0] - rr / 2, C[1] + 13], `${s}`, 'ink', { size: 12 })], 260, 220); };
  return num(P2(A), [
    St(`The ring is the big circle with the small circle taken away. Big circle: 3.14 × ${R}² = ${P2(3.14 * R * R)} cm².`, ring('big')),
    St(`Small circle: 3.14 × ${s}² = ${P2(3.14 * s * s)} cm². Ring: ${P2(3.14 * R * R)} − ${P2(3.14 * s * s)} = ${P2(A)}.`, ring()),
    St(`So the shaded ring has area ${P2(A)} cm².`),
  ], { q: `The circles have the same centre, with radii ${R} cm and ${s} cm. Using π ≈ 3.14, what is the area of the green ring? Round to the nearest hundredth.`, visual: ring(), unit: 'cm²', tol: 0.01, expr: `3.14*(${R}**2-${s}**2)` });
}

// ═════════ 8-compound ═════════
export function compound(r) {
  const v = r.int(0, 6), w = 2 * r.int(2, 5), L = r.int(5, 12);
  if (v === 0 || v === 5) {
    const both = v === 5, rad = w / 2, [Ld, Wd] = disp(L, w), Rd = Wd / 2;
    const right = arcPts(Rd, -90, 90).map(([x, y]) => [Ld + x, Wd / 2 + y]), left = arcPts(Rd, 90, 270).map(([x, y]) => [x, Wd / 2 + y]);
    const pts = both ? [[0, 0], [Ld, 0], ...right.slice(1, -1), [Ld, Wd], [0, Wd], ...left.slice(1, -1)] : [[0, 0], [Ld, 0], ...right.slice(1, -1), [Ld, Wd], [0, Wd]];
    const n = pts.length, rectR = { pts: [[0, 0], [Ld, 0], [Ld, Wd], [0, Wd]], t: 'hl' };
    const base = { pts, cuts: [[[Ld, 0], [Ld, Wd]], ...(both ? [[[0, 0], [0, Wd]]] : [])], sides: Array.from({ length: n }, (_, j) => (j === 0 ? `${L} m` : !both && j === n - 1 ? `${w} m` : '')), extra: both ? [] : [[Ld + Rd + 0.3, 0]], notes: both ? [{ at: [Ld - 1.3, Wd / 2], s: `${w} m` }] : [] };
    const semi = (3.14 * rad * rad) / 2, Aset = both ? L * w + 3.14 * rad * rad : L * w + semi;
    const reg2 = both ? [{ pts: right, t: 'hl2' }, { pts: left, t: 'hl2' }] : [{ pts: right, t: 'hl2' }];
    return num(P2(Aset), [
      St(`Split the shape into a ${L} m by ${w} m rectangle and ${both ? 'two semicircles' : 'a semicircle'}. Rectangle: ${L} × ${w} = ${L * w} m².`, G.polygonFig({ ...base, regions: [rectR] })),
      St(both ? `The two semicircles make one whole circle of diameter ${w}, radius ${rad}: 3.14 × ${rad}² = ${P2(3.14 * rad * rad)} m².` : `The semicircle has diameter ${w}, so radius ${rad}: 3.14 × ${rad}² ÷ 2 = ${P2(semi)} m².`, G.polygonFig({ ...base, regions: reg2 })),
      St(`Total: ${L * w} + ${P2(both ? 3.14 * rad * rad : semi)} = ${P2(Aset)}.`),
      St(`So the area is ${P2(Aset)} m².`),
    ], { q: both ? `A running track is a ${L} m by ${w} m rectangle with a semicircle on each ${w} m end. Using π ≈ 3.14, what area does it enclose? Round to the nearest hundredth.` : `A garden is a ${L} m by ${w} m rectangle with a semicircle on one ${w} m end. Using π ≈ 3.14, what is its area? Round to the nearest hundredth.`, visual: G.polygonFig(base), unit: 'm²', tol: 0.01, expr: both ? `${L}*${w}+3.14*${rad}**2` : `${L}*${w}+3.14*${rad}**2/2` });
  }
  if (v === 1) {
    const h = r.int(2, 8), A = L * w + (L * h) / 2, [Ld, Wd] = disp(L, w + h), Hd = (Wd * w) / (w + h);
    const pts = [[0, 0], [Ld, 0], [Ld, Hd], [Ld / 2, Wd], [0, Hd]];
    const pic = (regs) => G.polygonFig({ pts, sides: [`${L} m`, `${w} m`], cuts: [[[0, Hd], [Ld, Hd]]], regions: regs, extra: [[Ld / 2, Hd]], notes: regs.length ? [] : [{ at: [Ld / 2 + 0.6, (Hd + Wd) / 2 - 0.1], s: `${h} m` }] });
    return num(dec(A), [
      St(`Split it into a rectangle and a triangle. Rectangle: ${L} × ${w} = ${L * w} m².`, pic([{ pts: [[0, 0], [Ld, 0], [Ld, Hd], [0, Hd]], t: 'hl', label: `${L * w}` }])),
      St(`Triangle roof: base ${L}, height ${h}: ${L} × ${h} ÷ 2 = ${dec((L * h) / 2)} m².`, pic([{ pts: [[0, Hd], [Ld, Hd], [Ld / 2, Wd]], t: 'hl2', label: dec((L * h) / 2) }])),
      St(`Total: ${L * w} + ${dec((L * h) / 2)} = ${dec(A)}.`),
      St(`So the area of the front is ${dec(A)} m².`),
    ], { q: `The front of a shed is a ${L} m wide, ${w} m tall rectangle with a triangle roof ${h} m tall on top. What is the area of the front, in m²?`, visual: pic([]), unit: 'm²', tol: 0.01, expr: `${L}*${w}+${L}*${h}/2` });
  }
  if (v === 2) {
    const s = r.int(4, 12), Q = (3.14 * s * s) / 4, A = s * s - Q, arc = arcPts(10, 0, 90);
    const pic = (hl) => G.polygonFig({ pts: [[10, 0], [10, 10], [0, 10], ...arc.slice(1, -1).reverse()], shade: true, sides: [`${s} cm`, `${s} cm`], extra: [[0, 0]], regions: hl ? [{ pts: [[0, 0], ...arc], t: 'hl2' }] : [], cuts: [[[0, 0], [10, 0]], [[0, 0], [0, 10]]] });
    return num(P2(A), [
      St(`The whole square tile: ${s} × ${s} = ${s * s} cm².`, pic(false)),
      St(`The quarter circle cut out has radius ${s}: 3.14 × ${s}² ÷ 4 = ${P2(Q)} cm².`, pic(true)),
      St(`Left over: ${s * s} − ${P2(Q)} = ${P2(A)}.`),
      St(`So ${P2(A)} cm² of the tile is left (the green part).`),
    ], { q: `A quarter circle of radius ${s} cm, centred on one corner, is cut out of a square tile with ${s} cm sides. Using π ≈ 3.14, what area is left (green)? Round to the nearest hundredth.`, visual: pic(false), unit: 'cm²', tol: 0.01, expr: `${s}**2-3.14*${s}**2/4` });
  }
  if (v === 3) {
    const W = r.int(6, 12), H = r.int(6, 12), a = r.int(2, H - 3), c = r.int(2, W - 3), A1 = W * a, A2 = c * (H - a), A = A1 + A2;
    const pts = [[0, 0], [W, 0], [W, a], [c, a], [c, H], [0, H]], base = { pts, sides: [`${W} m`, `${a} m`, '', '', `${c} m`, `${H} m`], right: [0, 1, 2, 4, 5] };
    return num(A, [
      St('Split the shape into two rectangles with a line across.', G.polygonFig({ ...base, cuts: [[[0, a], [c, a]]] })),
      St(`Bottom: ${W} × ${a} = ${A1} m². Top: ${c} × (${H} − ${a}) = ${c} × ${H - a} = ${A2} m².`, G.polygonFig({ ...base, regions: [{ pts: [[0, 0], [W, 0], [W, a], [0, a]], t: 'hl', label: `${A1}` }, { pts: [[0, a], [c, a], [c, H], [0, H]], t: 'hl2', label: `${A2}` }], cuts: [[[0, a], [c, a]]] })),
      St(`${A1} + ${A2} = ${A}.`),
      St(`So the area is ${A} m².`),
    ], { q: 'What is the area of this shape, in m²? (All corners are right angles.)', visual: G.polygonFig(base), unit: 'm²', expr: `${W}*${a}+${c}*(${H}-${a})` });
  }
  if (v === 4) {
    const W = r.int(8, 20), H = r.int(6, 15), b = r.int(1, 3), A = W * H - (W - 2 * b) * (H - 2 * b);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [W, 0], [W, H], [0, H]], holes: [[[b, b], [W - b, b], [W - b, H - b], [b, H - b]]], shade: true, sides: [`${W} cm`, `${H} cm`, '', ''], notes: [{ at: [W / 2, H / 2], s: `${W - 2 * b} × ${H - 2 * b}`, t: hl ? 'hl' : 'ink' }] });
    return num(A, [
      St(`The whole frame and picture together: ${W} × ${H} = ${W * H} cm².`, pic(false)),
      St(`The opening is ${b} cm in from each edge, so it is ${W} − ${2 * b} = ${W - 2 * b} by ${H} − ${2 * b} = ${H - 2 * b}: ${(W - 2 * b) * (H - 2 * b)} cm².`, pic(true)),
      St(`Frame: ${W * H} − ${(W - 2 * b) * (H - 2 * b)} = ${A}.`),
      St(`So the frame (green) has area ${A} cm².`),
    ], { q: `A picture frame is ${W} cm by ${H} cm and ${b} cm wide all round. What is the area of the frame (green), in cm²?`, visual: pic(false), unit: 'cm²', expr: `${W}*${H}-(${W}-2*${b})*(${H}-2*${b})` });
  }
  const W = r.int(8, 16), H = r.int(6, 12), p = r.int(2, W - 4), q = r.int(2, H - 3), A = W * H - (p * q) / 2;
  const pts = [[0, 0], [W, 0], [W, H - q], [W - p, H], [0, H]];
  const pic = (hl) => G.polygonFig({ pts, sides: [`${W} m`, `${H - q} m`, '', `${W - p} m`, `${H} m`], right: [0, 1, 4], regions: hl ? [{ pts: [[W - p, H], [W, H], [W, H - q]], t: 'hl2' }] : [], extra: [[W, H]], cuts: hl ? [[[W - p, H], [W, H]], [[W, H], [W, H - q]]] : [] });
  return num(dec(A), [
    St(`Complete the rectangle: ${W} × ${H} = ${W * H} m².`, pic(true)),
    St(`The missing corner is a right triangle with legs ${W} − ${W - p} = ${p} and ${H} − ${H - q} = ${q}: ${p} × ${q} ÷ 2 = ${dec((p * q) / 2)} m².`),
    St(`${W * H} − ${dec((p * q) / 2)} = ${dec(A)}.`),
    St(`So the area is ${dec(A)} m².`),
  ], { q: 'A corner is cut off a rectangle. What is the area of this shape, in m²?', visual: pic(false), unit: 'm²', tol: 0.01, expr: `${W}*${H}-${p}*${q}/2` });
}

// ═════════ 8-volume ═════════
export function volume(r) {
  const v = r.int(0, 6), l = r.int(2, 12), w = r.int(2, 10), h = r.int(2, 10);
  if (v === 0 || v === 4) {
    const V = l * w * h, find = v === 4;
    const pic = (hl, lab = true) => G.boxFig({ l, w, h, labels: [`${l} cm`, `${w} cm`, lab ? `${h} cm` : 'h'], hl });
    if (find) return num(h, [St(`V = base area × height. The base is ${l} × ${w} = ${l * w} cm².`, pic('base', false)), St(`h = ${V} ÷ ${l * w} = ${h}.`, pic('height', false)), St(`So the height is ${h} cm.`)], { q: `This box has a volume of ${V} cm³. What is its height h, in cm?`, visual: pic(null, false), unit: 'cm', expr: `${V}/(${l}*${w})` });
    return num(V, [
      St(`Volume = base area × height. The base is ${l} × ${w} = ${l * w} cm²: that many cubes cover the bottom in one layer.`, pic(['base', 'length', 'width'])),
      St(`The height says how many layers: ${l * w} × ${h} = ${V}.`, pic(['height'])),
      St(`So the volume is ${V} cm³.`),
    ], { q: 'What is the volume of this box, in cm³?', visual: pic(null), unit: 'cm³', expr: `${l}*${w}*${h}` });
  }
  if (v === 1) {
    const b = 2 * r.int(1, 6), th = r.int(2, 9), len = r.int(3, 15), B = (b * th) / 2, [Bd, Hd] = disp(b, th);
    const pic = (hl) => G.prismFig({ base: [[0, 0], [Bd, 0], [Bd * 0.35, Hd]], depth: Math.max(Bd, Hd) * 0.9, sides: [`${b} cm`, '', ''], height: { from: 2, side: 0, label: `${th} cm` }, depthLabel: `${len} cm`, hl });
    return num(B * len, [
      St(`A prism has the same triangle all along it. The base is that triangle: ${b} × ${th} ÷ 2 = ${B} cm².`, pic(['base'])),
      St(`Multiply by the length of the prism: ${B} × ${len} = ${B * len}.`, pic(['depth'])),
      St(`So the volume is ${B * len} cm³.`),
    ], { q: 'What is the volume of this triangular prism, in cm³?', visual: pic(null), unit: 'cm³', expr: `${b}*${th}/2*${len}` });
  }
  if (v === 2) {
    const l2 = r.int(1, l - 1 || 1), h2 = r.int(2, 8), V1 = l * w * h, V2 = l2 * w * h2;
    if (l2 >= l) return volume(r);
    const [a, b2] = disp(l, h + h2), sc = a / l, hh = (b2 * h) / (h + h2), hh2 = b2 - hh, ll2 = l2 * sc;
    const base = [[0, 0], [a, 0], [a, hh], [ll2, hh], [ll2, hh + hh2], [0, hh + hh2]], D = Math.max(3, Math.min(8, w * sc));
    const pic = (hl) => G.prismFig({ base, depth: D, sides: [`${l} m`, `${h} m`, '', `${h2} m`, `${l2} m`, ''], depthLabel: `${w} m`, hl });
    return num(V1 + V2, [
      St(`Split the building into two boxes, both ${w} m deep. Bottom box: ${l} × ${w} × ${h} = ${V1} m³.`, G.boxFig({ l, w, h, labels: [`${l} m`, `${w} m`, `${h} m`], hl: 'front' })),
      St(`Top box: ${l2} × ${w} × ${h2} = ${V2} m³.`, G.boxFig({ l: l2, w, h: h2, labels: [`${l2} m`, `${w} m`, `${h2} m`], hl: 'front' })),
      St(`Add them: ${V1} + ${V2} = ${V1 + V2}.`),
      St(`So the total volume is ${V1 + V2} m³.`),
    ], { q: `This building is a box with a smaller box on top. What is its total volume, in m³?`, visual: pic(null), unit: 'm³', expr: `${l}*${w}*${h}+${l2}*${w}*${h2}` });
  }
  if (v === 3) {
    const L = r.int(4, 12) * 10, W = r.int(3, 6) * 10, H = r.int(3, 6) * 10, V = L * W * H;
    const pic = G.boxFig({ l: L, w: W, h: H, labels: [`${L} cm`, `${W} cm`, `${H} cm`] });
    return num(V / 1000, [St(`Volume: ${L} × ${W} × ${H} = ${V.toLocaleString('en-CA')} cm³.`, pic), St('1000 cm³ = 1 L, so divide by 1000.'), St(`${V.toLocaleString('en-CA')} ÷ 1000 = ${V / 1000}, so the tank holds ${V / 1000} L.`)], { q: 'How many litres of water does this aquarium hold when full?', visual: pic, unit: 'L', expr: `${L}*${W}*${H}/1000` });
  }
  if (v === 5) {
    const a = r.int(2, 5), b = r.int(2, 4), c = r.int(2, 4), V = a * b * c, pic = (hl) => G.boxFig({ l: a, w: b, h: c, cubes: true, hl });
    return num(V, [
      St(`Count the cubes in the bottom layer: ${a} along the front and ${b} going back, so ${a} × ${b} = ${a * b}.`, pic('base')),
      St(`There are ${c} layers: ${a * b} × ${c} = ${V}.`, pic('height')),
      St(`So the volume is ${V} cm³ (${V} cubes).`),
    ], { q: 'This solid is built from 1 cm cubes, with no gaps inside. What is its volume, in cm³?', visual: pic(null), unit: 'cm³', expr: `${a}*${b}*${c}` });
  }
  const n = r.pick([5, 6, 8]), B = r.int(10, 60), H = r.int(3, 15);
  const pic = (hl) => G.prismFig({ base: G.regular(n, 3), depth: 5, depthLabel: `${H} cm`, hl });
  return num(B * H, [
    St(`Any prism: V = base area × height. The base (the ${NG[n]} at the end) has area ${B} cm².`, pic(['base'])),
    St(`The height (length) of the prism is ${H} cm: ${B} × ${H} = ${B * H}.`, pic(['depth'])),
    St(`So the volume is ${B * H} cm³.`),
  ], { q: `The ${NG[n]} at the end of this prism has an area of ${B} cm². What is the volume of the prism, in cm³?`, visual: pic(null), unit: 'cm³', expr: `${B}*${H}` });
}

// ═════════ 8-surface ═════════
export function surface(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const l = r.int(2, 12), w = r.int(2, 10), h = r.int(2, 10), SA = 2 * (l * w + l * h + w * h), net = (hl) => G.boxNet({ l, w, h, labels: [`${l}`, `${w}`, `${h}`], hl });
    return num(SA, [
      St('Unfold the box into its net: six rectangles in three matching pairs.', net(null)),
      St(`Top and bottom: 2 × ${l} × ${w} = ${2 * l * w}.`, net('tb')),
      St(`Front and back: 2 × ${l} × ${h} = ${2 * l * h}.`, net('fb')),
      St(`The two ends: 2 × ${w} × ${h} = ${2 * w * h}.`, net('lr')),
      St(`Add them: ${2 * l * w} + ${2 * l * h} + ${2 * w * h} = ${SA}.`),
      St(`So the surface area is ${SA} cm².`),
    ], { q: 'What is the surface area of this box, in cm²?', visual: G.boxFig({ l, w, h, labels: [`${l} cm`, `${w} cm`, `${h} cm`] }), unit: 'cm²', expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` });
  }
  if (v === 1 || v === 6) {
    const rad = r.int(1, 8), h = r.int(2, 15), circ = 2 * 3.14 * rad * rad, side = 2 * 3.14 * rad * h, SA = circ + side, net = (hl) => G.cylinderNet({ labels: [`${rad}`, `${h}`, '2πr'], hl });
    const can = G.cylinderFig({ r: rad, h, labels: [`${rad} cm`, `${h} cm`] });
    if (v === 6) return num(P2(side), [
      St('The label wraps round the curved side. Unrolled, it is a rectangle: its length is the circumference, 2πr, and its width is the height.', net('rect')),
      St(`2 × 3.14 × ${rad} × ${h} = ${P2(side)}.`),
      St(`So the label is ${P2(side)} cm².`),
    ], { q: `A paper label covers the curved side of this can (not the top or bottom). Using π ≈ 3.14, what is the area of the label, in cm²?`, visual: can, unit: 'cm²', tol: 0.01, expr: `2*3.14*${rad}*${h}` });
    return num(P2(SA), [
      St('Unfold the cylinder: two circles and a rectangle. The rectangle wraps round the circle, so its length is the circumference, 2πr.', net(null)),
      St(`The two circles: 2 × 3.14 × ${rad}² = ${P2(circ)}.`, net('circles')),
      St(`The rectangle: 2 × 3.14 × ${rad} × ${h} = ${P2(side)}.`, net('rect')),
      St(`Total: ${P2(circ)} + ${P2(side)} = ${P2(SA)}.`),
      St(`So the surface area is ${P2(SA)} cm².`),
    ], { q: 'Using π ≈ 3.14, what is the surface area of this cylinder, in cm²? Round to the nearest hundredth.', visual: can, unit: 'cm²', tol: 0.01, expr: `2*3.14*${rad}**2+2*3.14*${rad}*${h}` });
  }
  if (v === 2) {
    const b = r.int(2, 12), s = r.int(3, 15), SA = b * b + 2 * b * s;
    return num(SA, [
      St('Unfold the pyramid: a square base and four equal triangles.', G.pyramidNet({ labels: [`${b}`, `${s}`] })),
      St(`Base: ${b} × ${b} = ${b * b}.`, G.pyramidNet({ labels: [`${b}`, `${s}`], hl: 'base' })),
      St(`Each triangle has base ${b} and height ${s} (the slant height): ${b} × ${s} ÷ 2 = ${(b * s) / 2}. Four of them: ${2 * b * s}.`, G.pyramidNet({ labels: [`${b}`, `${s}`], hl: 'faces' })),
      St(`${b * b} + ${2 * b * s} = ${SA}.`),
      St(`So the surface area is ${SA} cm².`),
    ], { q: 'What is the surface area of this square pyramid, in cm²? (The slant height is the height of each triangle face.)', visual: G.pyramidFig({ a: b, h: s, labels: [`${b} cm`, '', `${s} cm`] }), unit: 'cm²', expr: `${b}**2+2*${b}*${s}` });
  }
  if (v === 3) {
    const k = r.pick([2, 3]), vol = r.bool(), x = r.int(5, 40), ans = vol ? x * k ** 3 : x * k * k, pic = G.similarBoxes({ k, labels1: ['1', '', ''], labels2: [`${k}`, '', ''] });
    return num(ans, [
      St(`Every length is ${k} times as long. ${vol ? `Volume uses three lengths, so it is multiplied by ${k}³ = ${k ** 3}` : `Area uses two lengths, so surface area is multiplied by ${k}² = ${k * k}`}.`, pic),
      St(`${x} × ${vol ? k ** 3 : k * k} = ${ans}.`),
      St(`So the large box has ${vol ? 'volume' : 'surface area'} ${ans} ${vol ? 'cm³' : 'cm²'}.`),
    ], { q: `Two box shapes are similar: each edge of the large one is ${k} times as long. The small one has ${vol ? `volume ${x} cm³` : `surface area ${x} cm²`}. What is the ${vol ? 'volume' : 'surface area'} of the large one?`, visual: pic, unit: vol ? 'cm³' : 'cm²', expr: vol ? `${x}*${k}**3` : `${x}*${k}**2` });
  }
  if (v === 4) {
    const a = r.int(2, 15), S = 6 * a * a;
    return num(S, [St(`A cube has 6 faces, all squares of side ${a}.`, G.netFig({ cells: G.CUBE_NETS[5] })), St(`Each face: ${a} × ${a} = ${a * a}. Six faces: 6 × ${a * a} = ${S}.`, G.netFig({ cells: G.CUBE_NETS[5], hl: [0, 1, 2, 3, 4, 5] })), St(`So the surface area is ${S} cm².`)], { q: 'What is the surface area of this cube, in cm²?', visual: G.boxFig({ l: a, w: a, h: a, labels: [`${a} cm`, '', ''] }), unit: 'cm²', expr: `6*${a}**2` });
  }
  const [p, q, s] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]), L = r.int(4, 15), tri = (p * q) / 2, rects = (p + q + s) * L, S = 2 * tri + rects, [Pd, Qd] = disp(p, q);
  const pic = (hl) => G.prismFig({ base: [[0, 0], [Pd, 0], [0, Qd]], depth: Math.max(Pd, Qd), sides: [`${p}`, `${s}`, `${q}`], depthLabel: `${L}`, hl });
  return num(S, [
    St(`The two triangle ends are right triangles with legs ${p} and ${q}: each is ${p} × ${q} ÷ 2 = ${tri}, so both are ${2 * tri}.`, pic(['base'])),
    St(`The three rectangles are each ${L} long and as wide as a side of the triangle: (${p} + ${q} + ${s}) × ${L} = ${rects}.`, pic(['sides'])),
    St(`${2 * tri} + ${rects} = ${S}.`),
    St(`So the surface area is ${S} cm².`),
  ], { q: 'This prism has right-triangle ends (lengths in cm). What is its surface area, in cm²?', visual: pic(null), unit: 'cm²', expr: `${p}*${q}+(${p}+${q}+${s})*${L}` });
}

// ═════════ 8-cyl (volume of a cylinder; skills.mjs can use cyl and LESSONS.cyl) ═════════
export function cyl(r) {
  const v = r.int(0, 5), rad = r.int(1, 8), h = r.int(2, 15), base = 3.14 * rad * rad, V = base * h;
  const pic = (hl, labs = [`${rad} cm`, `${h} cm`]) => G.cylinderFig({ r: rad, h, labels: labs, hl });
  if (v === 0 || v === 1) {
    const useD = v === 1;
    return num(P2(V), [
      St(useD ? `The diameter is ${2 * rad} cm, so the radius is ${rad} cm. The base is a circle: 3.14 × ${rad}² = ${P2(base)} cm².` : `The base is a circle: π × r² ≈ 3.14 × ${rad}² = ${P2(base)} cm².`, pic(['base', 'radius'])),
      St(`V = base area × height = ${P2(base)} × ${h} = ${P2(V)}.`, pic(['height'])),
      St(`So the volume is ${P2(V)} cm³.`),
    ], { q: `Using π ≈ 3.14, what is the volume of this cylinder, in cm³?`, visual: pic(null, [useD ? `d = ${2 * rad} cm` : `${rad} cm`, `${h} cm`]), unit: 'cm³', tol: 0.01, expr: `3.14*${rad}**2*${h}` });
  }
  if (v === 2) return num(h, [
    St(`V = base area × h. The base: 3.14 × ${rad}² = ${P2(base)} cm².`, pic(['base'], [`${rad} cm`, 'h'])),
    St(`h = ${P2(V)} ÷ ${P2(base)} = ${h}.`, pic(['height'])),
    St(`So the height is ${h} cm.`),
  ], { q: `This cylinder has a volume of ${P2(V)} cm³. Using π ≈ 3.14, what is its height h, in cm?`, visual: pic(null, [`${rad} cm`, 'h']), unit: 'cm', tol: 0.01, expr: `${V}/(3.14*${rad}**2)` });
  if (v === 3) {
    const R = r.int(3, 10) * 2, H = r.int(5, 20) * 2, Vc = 3.14 * R * R * H, L = Vc / 1000;
    const p2 = G.cylinderFig({ r: R, h: H, labels: [`${R} cm`, `${H} cm`] });
    return num(P2(L), [St(`V = 3.14 × ${R}² × ${H} = ${P2(Vc)} cm³.`, p2), St('1000 cm³ = 1 L, so divide by 1000.'), St(`${P2(Vc)} ÷ 1000 = ${P2(L)}, so it holds ${P2(L)} L.`)], { q: 'How many litres does this cylindrical tank hold? (π ≈ 3.14; round to the nearest hundredth)', visual: p2, unit: 'L', tol: 0.01, expr: `3.14*${R}**2*${H}/1000` });
  }
  if (v === 4) {
    let r2, h2; do { r2 = r.int(1, 8); h2 = r.int(2, 15); } while (r2 * r2 * h2 === rad * rad * h);
    const V2 = 3.14 * r2 * r2 * h2, right = V > V2 ? 'A' : 'B';
    const pic2 = { type: 'figs', figs: [G.cylinderFig({ r: rad, h, labels: [`${rad} cm`, `${h} cm`] }), G.cylinderFig({ r: r2, h: h2, labels: [`${r2} cm`, `${h2} cm`] })], captions: ['A', 'B'] };
    return mc(r, right, [right === 'A' ? 'B' : 'A', 'They hold the same'], { q: 'Which cylinder holds more? (Not drawn to scale.)', visual: pic2, steps: [St(`A: 3.14 × ${rad}² × ${h} = ${P2(V)} cm³.`), St(`B: 3.14 × ${r2}² × ${h2} = ${P2(V2)} cm³.`), St(`So cylinder ${right} holds more.`)] });
  }
  const B = r.int(10, 80);
  return num(B * h, [St(`Every cylinder: V = base area × height. The base area is given: ${B} cm².`, pic(['base'], ['', `${h} cm`])), St(`${B} × ${h} = ${B * h}.`, pic(['height'], ['', `${h} cm`])), St(`So the volume is ${B * h} cm³.`)], { q: `The base of this cylinder has an area of ${B} cm². What is its volume, in cm³?`, visual: pic(null, ['', `${h} cm`]), unit: 'cm³', expr: `${B}*${h}` });
}

// ───────── the lessons: key ideas on the board, each with its picture ─────────
const Lx = (text, visual) => ({ text, visual });
const tri0 = triFromAngles(50, 70);
export const LESSONS = {
  anglePairs: [
    Lx('Complementary angles add to 90°: together they fill a right angle (the small square).', raysFig({ rays: [0, 35, 90], right: [[0, 2]], arcs: [[0, 1, '35°'], [1, 2, '55°']] })),
    Lx('Supplementary angles add to 180°: side by side they make a straight line.', raysFig({ rays: [0, 130, 180], arcs: [[0, 1, '130°'], [1, 2, '50°']] })),
    Lx('Where two lines cross, the angles across from each other (vertical angles) are equal, and the ones side by side add to 180°.', raysFig({ rays: [0, 60, 180, 240], arcs: [[0, 1, '60°'], [2, 3, '60°'], [1, 2, '120°']] })),
    Lx('All the angles around a point add to 360°. With letters, write an equation from the rule, then solve it.', raysFig({ rays: [0, 100, 210, 290], arcs: [[0, 1, '100°'], [1, 2, '110°'], [2, 3, '80°'], [3, 0, '70°']], H: 210 })),
  ],
  transversal: [
    Lx('A transversal crosses two parallel lines (marked with arrows) and makes 8 angles: 4 at each crossing.', G.transversalFig({ deg: 60, labels: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8' } })),
    Lx('Corresponding angles sit in the same corner at each crossing: they are equal.', G.transversalFig({ deg: 60, labels: { 1: '60°', 5: '60°' }, hl: [1, 5] })),
    Lx('Alternate interior angles (between the lines, opposite sides of the transversal) are equal. Alternate exterior angles are equal too.', G.transversalFig({ deg: 60, labels: { 3: '60°', 5: '60°' }, hl: [3, 5] })),
    Lx('Same-side interior angles (between the lines, same side) add to 180°.', G.transversalFig({ deg: 60, labels: { 4: '120°', 5: '60°' }, hl: [4, 5] })),
    Lx('A bisector cuts an angle or a segment into two equal parts. A midpoint cuts a segment in half.', segFig(['7 cm', '7 cm'], true)),
  ],
  classify2d: [
    Lx('A polygon is named by its number of sides: triangle 3, quadrilateral 4, pentagon 5, hexagon 6, heptagon 7, octagon 8, nonagon 9, decagon 10.', { type: 'figs', figs: [G.polygonFig({ pts: wobble(5) }), G.polygonFig({ pts: wobble(6) }), G.polygonFig({ pts: wobble(8) })], captions: ['pentagon', 'hexagon', 'octagon'] }),
    Lx('Triangles by sides: equilateral (3 equal), isosceles (2 equal), scalene (none equal). Tick marks show equal sides.', { type: 'figs', figs: [G.polygonFig({ pts: triFromSides(5, 5, 5), ticks: [1, 1, 1] }), G.polygonFig({ pts: triFromSides(6, 6, 4), ticks: [0, 1, 1] }), G.polygonFig({ pts: triFromSides(4, 6, 7), ticks: [1, 2, 3] })], captions: ['equilateral', 'isosceles', 'scalene'] }),
    Lx('Triangles by angles: acute (all under 90°), right (one 90°), obtuse (one over 90°).', { type: 'figs', figs: [G.polygonFig({ pts: triFromAngles(60, 70) }), G.polygonFig({ pts: triFromAngles(90, 35), right: [0] }), G.polygonFig({ pts: triFromAngles(120, 25), angles: ['120°'] })], captions: ['acute', 'right', 'obtuse'] }),
    Lx('Quadrilaterals: read the marks. Arrows show parallel sides, ticks equal sides, squares right angles.', { type: 'figs', figs: ['parallelogram', 'rhombus', 'trapezoid', 'kite'].map((k) => G.polygonFig(QUADS[k])), captions: ['parallelogram', 'rhombus', 'trapezoid', 'kite'] }),
  ],
  triangleAngles: [
    Lx('The three angles of every triangle add to 180°. Tear off the corners and they make a straight line.', G.polygonFig({ pts: tri0, angles: ['50°', '70°', '60°'] })),
    Lx('To find a missing angle: add the angles you know and take the total away from 180°.', G.polygonFig({ pts: tri0, angles: ['50°', '70°', 'x'], hl: [{ angle: 0 }, { angle: 1 }] })),
    Lx('An exterior angle equals the sum of the two far-away inside angles: here 50° + 70° = 120°.', G.polygonFig({ pts: tri0, angles: ['50°', '70°', ''], ext: 2, extLabel: '120°', hl: ['ext'] })),
    Lx('An isosceles triangle has two equal sides and two equal base angles.', G.polygonFig({ pts: triFromAngles(65, 65), ticks: [0, 1, 1], angles: ['65°', '65°', '50°'] })),
  ],
  polyAngles: [
    Lx('The diagonals from one corner cut a polygon with n sides into n − 2 triangles, so its angles add to (n − 2) × 180°.', G.triangulated(G.regular(6))),
    Lx('A quadrilateral makes 2 triangles: its angles add to 360°.', G.polygonFig({ pts: wobble(4, 0.15), angles: ['', '', '', ''], diag: [[0, 2]] })),
    Lx('In a regular polygon every angle is the same: (n − 2) × 180° ÷ n. A regular hexagon: 720° ÷ 6 = 120°.', G.polygonFig({ pts: G.regular(6), ticks: Array(6).fill(1), angles: ['120°'] })),
    Lx('The exterior angles of any polygon add to 360°.', G.polygonFig({ pts: G.regular(5), ext: 1, extLabel: '72°', angles: ['', '108°'] })),
    Lx('Circle words: radius (centre to edge), diameter (across through the centre), chord, arc. The central angles round the centre add to 360°.', centralFig([120, 140], ['120°', '140°', '100°'])),
  ],
  transId: [
    Lx('A translation slides every point the same distance in the same direction.', gridFig({ shapes: [{ pts: [[1, 1], [4, 1], [2, 3]], label: 'A' }, { pts: [[-4, -3], [-1, -3], [-3, -1]], t: 'hl', label: 'B' }] })),
    Lx('A reflection flips a shape over a mirror line: each point and its image are the same distance from the line.', gridFig({ shapes: [{ pts: [[1, 1], [4, 1], [2, 3]], label: 'A' }, { pts: [[-1, 1], [-4, 1], [-2, 3]], t: 'hl', label: 'B' }], segs: [{ a: [0, -6], b: [0, 6], t: 'hlline' }] })),
    Lx('A rotation turns a shape about a point. 180° about the origin: (x, y) → (−x, −y).', gridFig({ shapes: [{ pts: [[1, 1], [4, 1], [2, 3]], label: 'A' }, { pts: [[-1, -1], [-4, -1], [-2, -3]], t: 'hl', label: 'B' }], segs: [{ a: [0, 0], b: [4, 1] }, { a: [0, 0], b: [-4, -1] }] })),
    Lx('A line of symmetry folds a shape onto itself. A regular polygon with n sides has n of them.', symFig(SYM[3], true)),
  ],
  congruent: [
    Lx('Congruent figures have the same size and shape: one can be slid, flipped or turned onto the other.', multiFig([{ pts: tri0, names: ['A', 'B', 'C'], ticks: [1, 2, 3] }, { pts: placeRight(tri0, tri0.map(([x, y]) => [-x, y]), 6), t: 'hl2', names: ['D', 'E', 'F'], ticks: [1, 2, 3] }])),
    Lx('In △ABC ≅ △DEF the letters match in order: A ↔ D, B ↔ E, C ↔ F. So AB = DE, BC = EF and CA = FD.', multiFig([{ pts: tri0, names: ['A', 'B', 'C'], hlSides: [0] }, { pts: placeRight(tri0, tri0.map(([x, y]) => [-x, y]), 6), t: 'hl2', names: ['D', 'E', 'F'], hlSides: [0] }])),
    Lx('Matching angles are equal too: ∠A = ∠D, ∠B = ∠E, ∠C = ∠F.', multiFig([{ pts: tri0, names: ['A', 'B', 'C'], angles: ['50°'] }, { pts: placeRight(tri0, tri0.map(([x, y]) => [-x, y]), 6), t: 'hl2', names: ['D', 'E', 'F'], angles: ['50°'] }])),
    Lx('A dilation changes the size, so the image is not congruent (it is similar).'),
  ],
  dilation: [
    Lx('A dilation about the origin with scale factor k sends (x, y) to (kx, ky): every point moves along its line from the origin.', gridFig({ lo: 0, hi: 8, shapes: [{ pts: [[1, 1], [3, 1], [1, 2]], label: '' }, { pts: [[2, 2], [6, 2], [2, 4]], t: 'hl', label: '' }], segs: [{ a: [0, 0], b: [6, 2] }, { a: [0, 0], b: [2, 4] }] })),
    Lx('Scale factor = new length ÷ old length. k > 1 enlarges; k between 0 and 1 shrinks.', multiFig([{ pts: [[0, 0], [3, 0], [3, 2], [0, 2]], sides: ['3', '2'], caption: 'old' }, { pts: placeRight([[0, 0], [3, 0]], [[0, 0], [6, 0], [6, 4], [0, 4]], 1.5, true), t: 'hl2', sides: ['6', '4'], caption: 'new, k = 2' }])),
    Lx('Angles stay the same and every length is multiplied by k, so the image is similar to the original. Areas are multiplied by k².'),
  ],
  similar: [
    Lx('Similar figures have the same shape: matching angles are equal and matching sides are in the same ratio.', multiFig([{ pts: tri0, angles: ['50°', '70°', ''] }, { pts: placeRight(tri0, scale(tri0, 1.6), 2, true), t: 'hl2', angles: ['50°', '70°', ''] }])),
    Lx('Find the scale factor from one pair of matching sides, then multiply (small → large) or divide (large → small).', multiFig([{ pts: [[0, 0], [4, 0], [1.4, 3]], sides: ['4', '', '3'] }, { pts: placeRight([[0, 0], [4, 0], [1.4, 3]], [[0, 0], [8, 0], [2.8, 6]], 2, true), t: 'hl2', sides: ['8', '', 'x = 6'], hlSides: [0] }])),
    Lx('Shadows: at the same time of day, height ÷ shadow is the same for everything, so the triangles are similar.', multiFig([{ pts: [[0, 0], [2, 0], [0, 1.5]], right: [0], caption: 'pole' }, { pts: placeRight([[0, 0], [2, 0]], [[0, 0], [8, 0], [0, 6]], 2, true), t: 'hl2', right: [0], caption: 'tree' }])),
  ],
  pythApply: [
    Lx('In a right triangle the side across from the right angle is the hypotenuse c, the longest side. a² + b² = c².', rtri(3, 4, ['a', 'c', 'b'], [1])),
    Lx('To find the hypotenuse: add the squares of the legs, then take the square root. 3² + 4² = 25, so c = 5.', rtri(3, 4, ['3', '5', '4'], [1])),
    Lx('To find a leg: subtract. 13² − 5² = 169 − 25 = 144, so the leg is 12.', rtri(5, 12, ['5', '13', '12'])),
    Lx('Look for hidden right triangles: a ladder against a wall, the diagonal of a rectangle, a distance on a grid.', G.polygonFig({ pts: [[0, 0], [8, 0], [8, 6], [0, 6]], right: [0, 1, 2, 3], sides: ['8', '6'], diag: [[0, 2, 'hlline']] })),
    Lx('The converse: if a² + b² = c², the triangle has a right angle.'),
  ],
  solids: [
    Lx('Faces are flat surfaces, edges are where two faces meet, vertices are corners. Dashed edges are hidden at the back.', G.boxFig({ l: 6, w: 3, h: 4 })),
    Lx('A prism has two matching bases joined by rectangles. A pyramid has one base and triangles meeting at a point.', { type: 'figs', figs: [G.prismFig({ base: [[0, 0], [5, 0], [2, 4]], depth: 6 }), G.pyramidFig({ a: 5, h: 6 })], captions: ['prism', 'pyramid'] }),
    Lx('A net is the solid unfolded flat: every face appears once.', { type: 'figs', figs: [G.netFig({ cells: G.CUBE_NETS[5] }), G.cylinderNet()], captions: ['cube', 'cylinder'] }),
    Lx('Views: what you see from the top and from the front. A cylinder looks like a circle from the top and a rectangle from the front.', { type: 'figs', figs: [viewFig('circle'), viewFig('tallrect'), G.cylinderFig({ r: 3, h: 6 })], captions: ['top', 'front', 'cylinder'] }),
    Lx('Euler’s formula for solids with flat faces: F + V − E = 2.'),
  ],
  areas: [
    Lx('Parallelogram: A = base × height. The height is at right angles to the base, never the slanted side.', G.polygonFig({ pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], sides: ['b'], base: 0, height: { from: 3, side: 0, label: 'h' }, hl: ['base', 'height'] })),
    Lx('Triangle: A = base × height ÷ 2, because two copies make a parallelogram.', G.polygonFig({ pts: [[0, 0], [8, 0], [2.5, 5]], sides: ['b'], base: 0, height: { from: 2, side: 0, label: 'h' }, hl: ['base', 'height'] })),
    Lx('Trapezoid: A = (a + b) ÷ 2 × h, where a and b are the parallel sides.', G.polygonFig({ pts: [[0, 0], [9, 0], [7, 4], [2, 4]], sides: ['b', '', 'a', ''], height: { from: 3, side: 0, label: 'h' }, par: [1, 0, 1, 0] })),
    Lx('Perimeter is the distance all the way round: add every side.', G.polygonFig({ pts: wobble(5, 0.15), sides: ['5', '7', '4', '6', '5'] })),
    Lx('If every length is multiplied by k, the perimeter is multiplied by k and the area by k².', multiFig([{ pts: [[0, 0], [2, 0], [2, 1], [0, 1]], label: '2' }, { pts: placeRight([[0, 0], [2, 0]], [[0, 0], [4, 0], [4, 2], [0, 2]], 1, true), t: 'hl2', label: '8' }])),
  ],
  circles: [
    Lx('The radius goes from the centre to the circle; the diameter goes all the way across: d = 2r.', G.circleFig({ show: 'both', r: 'r', d: 'd' })),
    Lx('Circumference (the distance round): C = 2 × π × r = π × d. Use π ≈ 3.14.', G.circleFig({ show: 'radius', r: 'r', hl: 'radius' })),
    Lx('Area: A = π × r².', G.circleFig({ show: 'radius', r: 'r', hl: 'fill' })),
    Lx('A semicircle is half a circle and a quarter circle is a quarter. For the perimeter, add the straight sides to the curved part.', { type: 'figs', figs: [partFig(true, 'd', 'fill'), partFig(false, 'r', 'curve')], captions: ['semicircle', 'quarter circle'] }),
  ],
  compound: [
    Lx('Split a compound figure into shapes you know, and add their areas.', G.polygonFig({ pts: [[0, 0], [8, 0], [8, 3], [3, 3], [3, 7], [0, 7]], regions: [{ pts: [[0, 0], [8, 0], [8, 3], [0, 3]], t: 'hl', label: '24' }, { pts: [[0, 3], [3, 3], [3, 7], [0, 7]], t: 'hl2', label: '12' }], cuts: [[[0, 3], [3, 3]]] })),
    Lx('Or start with a big shape and take away the part that is missing.', G.polygonFig({ pts: [[0, 0], [12, 0], [12, 8], [0, 8]], holes: [[[3, 2], [8, 2], [8, 5], [3, 5]]], shade: true, sides: ['12', '8', '', ''] })),
    Lx('Curved parts are usually semicircles or quarter circles: find the whole circle, then halve or quarter it.', G.polygonFig({ pts: [[0, 0], [8, 0], ...arcPts(2.5, -90, 90).slice(1, -1).map(([x, y]) => [8 + x, 2.5 + y]), [8, 5], [0, 5]], regions: [{ pts: arcPts(2.5, -90, 90).map(([x, y]) => [8 + x, 2.5 + y]), t: 'hl2' }], cuts: [[[8, 0], [8, 5]]] })),
  ],
  volume: [
    Lx('Volume is the space inside, in cubic units: how many unit cubes fill it.', G.boxFig({ l: 4, w: 3, h: 2, cubes: true })),
    Lx('Prism: V = base area × height. The base area is one layer; the height is how many layers.', G.boxFig({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'], hl: ['base', 'height'] })),
    Lx('A triangular prism: the base is the triangle at the end. V = (b × h ÷ 2) × length.', G.prismFig({ base: [[0, 0], [6, 0], [2, 4]], depth: 6, sides: ['b', '', ''], height: { from: 2, side: 0, label: 'h' }, depthLabel: 'length', hl: ['base'] })),
    Lx('Compound solids: split into boxes, find each volume, and add. 1000 cm³ = 1 L.'),
  ],
  surface: [
    Lx('Surface area is the total area of all the faces. Unfold the solid into its net and add the area of every piece.', G.boxNet({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'] })),
    Lx('Box: SA = 2lw + 2lh + 2wh (three matching pairs of rectangles).', G.boxNet({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'], hl: 'tb' })),
    Lx('Cylinder: two circles and a rectangle whose length is the circumference: SA = 2πr² + 2πrh.', G.cylinderNet({ labels: ['r', 'h', '2πr'], hl: 'rect' })),
    Lx('Square pyramid: the square base plus four triangles, each with the slant height as its height.', G.pyramidNet({ labels: ['b', 's'], hl: 'faces' })),
    Lx('Similar solids with scale factor k: surface areas multiply by k², volumes by k³.', G.similarBoxes({ k: 2 })),
  ],
  cyl: [
    Lx('A cylinder is a prism with a circle for its base: V = base area × height.', G.cylinderFig({ r: 3, h: 5, labels: ['r', 'h'], hl: ['base'] })),
    Lx('The base is a circle, area π × r², so V = π × r² × h. Use π ≈ 3.14.', G.cylinderFig({ r: 3, h: 5, labels: ['r', 'h'], hl: ['radius', 'height'] })),
    Lx('If you are given the diameter, halve it to get the radius first. 1000 cm³ = 1 L.', G.circleFig({ show: 'both', r: 'r', d: 'd' })),
  ],
};
