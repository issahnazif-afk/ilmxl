// Grade 7 geometry and measurement, taught with pictures (the pattern of geo10.mjs): every question that a picture
// helps has its figure, the worked steps light up the part being used, and the lessons are key ideas with labelled
// diagrams. Used by g7.mjs (lines and angles, polygons, constructions, solids, area, circles, volume, surface area,
// transformations, congruence, similarity). Figures are drawn to scale unless the question says otherwise.
import { num, mc, St, dec, frac, neg } from '../kit.mjs';
import * as G from '../figs.mjs';

const { fig, line, text, path, circle, dot, poly, frame, angleArc, rightMark, ticks, parArrows, sideLabel, polygonFig } = G;

// ── small helpers ──
const R1 = (x) => Math.round(x * 10) / 10;
const rad = (d) => (d * Math.PI) / 180;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mulv = (a, k) => [a[0] * k, a[1] * k];
const unit = (a) => mulv(a, 1 / (Math.hypot(a[0], a[1]) || 1));
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const cen = (pts) => mulv(pts.reduce(add, [0, 0]), 1 / pts.length);
const dir = (deg) => [Math.cos(rad(deg)), Math.sin(rad(deg))];        // model direction (y up)
const an = (w) => (/^(8|11(?!\d)|18(?!\d)|[aeiou])/i.test(String(w)) ? 'an' : 'a');
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const ex = (a, b) => (b === 0 ? `${a === 1 ? '' : a}x` : `${a === 1 ? '' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`);   // ax + b
const L = (text, visual) => (visual ? { text, visual } : { text });
const D2 = (x) => dec(x, 2);
const PI_TOL = { tol: 0.01 };
const LET = ['A', 'B', 'C', 'D'];

// a "which picture…?" question: the right figure among wrong ones, captioned A, B, C, D
function pickFig(r, q, right, wrongs, steps, extra = {}) {
  const all = r.shuffle([right, ...wrongs].slice(0, 4)), i = all.indexOf(right), caps = LET.slice(0, all.length);
  return { kind: 'mc', q, choices: caps, a: i, visual: { type: 'figs', figs: all, captions: caps }, steps: typeof steps === 'function' ? steps(caps[i]) : steps, ...extra };
}
// an arrowhead at `tip`, pointing away from `from`
const arrow = (tip, from, t = 'ink') => { const d = unit(sub(tip, from)), n = [d[1], -d[0]]; return poly([add(sub(tip, mulv(d, 10)), mulv(n, 6)), tip, sub(sub(tip, mulv(d, 10)), mulv(n, 6))], t, { open: true }); };
// an arc of a circle in screen coordinates, angles in degrees measured the maths way (counterclockwise, y up)
const arcD = (C, R, t1, t2, t = 'aux') => { const p = (a) => [R1(C[0] + R * Math.cos(rad(a))), R1(C[1] - R * Math.sin(rad(a)))]; return path(`M${p(t1).join(' ')}A${R1(R)} ${R1(R)} 0 ${t2 - t1 > 180 ? 1 : 0} 0 ${p(t2).join(' ')}`, t); };
// a name beside a point, pushed away from `from`
const nameAt = (p, from, s, t = 'muted', d = 14) => text(add(p, mulv(unit(sub(p, from)), d)), s, t, { size: 13 });

// several polygons in one picture, all at the same scale (similar or congruent figures, enlargements)
//   shapes: [{ pts (model, y up), sides, names, angles, ticks, right, t, hl: [side j], cap }]
export function multiPoly(shapes, { W = 320, H = 210, pad = 34, notes = [] } = {}) {
  const F = frame(shapes.flatMap((s) => s.pts), { W, H, pad });
  const items = [];
  for (const s of shapes) {
    const p = s.pts.map(F.m), c = cen(p), n = p.length;
    items.push(poly(p, s.t ?? 'fig'));
    (s.hl ?? []).forEach((j) => items.push(line(p[j], p[(j + 1) % n], 'hlline')));
    (s.ticks ?? []).forEach((k, j) => { if (k) items.push(...ticks(p[j], p[(j + 1) % n], k)); });
    (s.right ?? []).forEach((i) => items.push(rightMark(p[i], p[(i + n - 1) % n], p[(i + 1) % n], 9)));
    (s.angles ?? []).forEach((a, i) => { if (a != null && a !== '') items.push(...angleArc(p[i], p[(i + n - 1) % n], p[(i + 1) % n], a, 18, (s.hlAngles ?? []).includes(i) ? 'hlline' : 'mark')); });
    (s.sides ?? []).forEach((lab, j) => items.push(sideLabel(p[j], p[(j + 1) % n], lab, p, (s.hl ?? []).includes(j) ? 'hl' : 'ink', 13)));
    (s.names ?? []).forEach((nm, i) => { if (nm) items.push(nameAt(p[i], c, nm)); });
    if (s.cap) { const ys = p.map((q) => q[1]); items.push(text([c[0], Math.max(...ys) + 18], s.cap, 'muted', { size: 12 })); }
  }
  for (const t of notes) items.push(text(F.m(t.at), t.s, t.t ?? 'ink'));
  return fig(items, W, H);
}

// a triangle with the given angles at A (left) and B (right), base AB = 10 (model)
const triPts = (A, B) => { const C = 180 - A - B, b = (10 * Math.sin(rad(B))) / Math.sin(rad(C)); return [[0, 0], [10, 0], [b * Math.cos(rad(A)), b * Math.sin(rad(A))]]; };
// a quadrilateral with angles a, b, c, d in order (counterclockwise from the bottom left), drawn to scale; null if
// no tidy one is found
function quadPts(angs, r) {
  for (let k = 0; k < 30; k++) {
    const s0 = 6 + r.next() * 4, s1 = 4 + r.next() * 4;
    const h = [0, 180 - angs[1]]; h.push(h[1] + 180 - angs[2]); h.push(h[2] + 180 - angs[3]);
    const u = h.map(dir);
    // s2 u2 + s3 u3 = −(s0 u0 + s1 u1)
    const rx = -(s0 * u[0][0] + s1 * u[1][0]), ry = -(s0 * u[0][1] + s1 * u[1][1]);
    const det = u[2][0] * u[3][1] - u[3][0] * u[2][1];
    if (Math.abs(det) < 1e-6) continue;
    const s2 = (rx * u[3][1] - u[3][0] * ry) / det, s3 = (u[2][0] * ry - rx * u[2][1]) / det;
    const all = [s0, s1, s2, s3];
    if (Math.min(...all) < 0.45 * Math.max(...all)) continue;
    const pts = [[0, 0]]; for (let i = 0; i < 3; i++) pts.push(add(pts[i], mulv(u[i], all[i])));
    return pts;
  }
  return null;
}

// ───────── lines, rays and angles ─────────
// one angle ∠ABC, drawn to scale: deg between ray BA and ray BC, the whole thing turned by rot
export function angleFig({ deg, rot = 0, label = '', names = null, hl = false, W = 260, H = 180 }) {
  const V = [0, 0], A = dir(rot), C = dir(rot + deg);
  const F = frame([V, A, C, mulv(dir(rot + deg / 2), 0.3)], { W, H, pad: 40 });
  const v = F.m(V), a = F.m(A), c = F.m(C);
  const items = [line(v, a, 'ink'), line(v, c, 'ink'), dot(v)];
  if (deg === 90) { items.push(rightMark(v, a, c, 14)); if (label) items.push(text(add(v, mulv(unit(add(unit(sub(a, v)), unit(sub(c, v)))), 36)), label, 'hl')); }
  else items.push(...angleArc(v, a, c, label, deg > 150 ? 26 : 24, hl ? 'hlline' : 'mark'));
  if (names) { items.push(dot(a), dot(c), nameAt(a, v, names[0]), nameAt(v, mid(a, c), names[1]), nameAt(c, v, names[2])); }
  return fig(items, W, H);
}
// a line, a ray or a segment through P and Q
export function linearFig(kind, [p, q] = ['P', 'Q'], rot = 0) {
  const W = 260, H = 140, c = [130, 72], d = [Math.cos(rad(rot)), -Math.sin(rad(rot))], at = (t) => add(c, mulv(d, t));
  const P = at(-60), Q = at(60), n = [d[1], -d[0]], items = [];
  if (kind === 'line') items.push(line(at(-110), at(110)), arrow(at(-110), c), arrow(at(110), c));
  else if (kind === 'ray') items.push(line(P, at(110)), arrow(at(110), c));
  else items.push(line(P, Q));
  items.push(dot(P), dot(Q), text(add(P, mulv(n, -16)), p, 'muted', { size: 13 }), text(add(Q, mulv(n, -16)), q, 'muted', { size: 13 }));
  return fig(items, W, H);
}
// two lines: parallel, perpendicular, or just crossing
export function twoLinesFig(kind, rot = 0) {
  const W = 240, H = 170, c = [120, 85], d1 = [Math.cos(rad(rot)), -Math.sin(rad(rot))], items = [];
  if (kind === 'parallel') {
    const n = [d1[1], -d1[0]], c1 = add(c, mulv(n, 32)), c2 = sub(c, mulv(n, 32));
    for (const cc of [c1, c2]) items.push(line(sub(cc, mulv(d1, 95)), add(cc, mulv(d1, 95))), arrow(add(cc, mulv(d1, 95)), cc), arrow(sub(cc, mulv(d1, 95)), cc), ...parArrows(sub(cc, mulv(d1, 40)), add(cc, mulv(d1, 0))));
  } else {
    const a2 = rot + (kind === 'perpendicular' ? 90 : 52), d2 = [Math.cos(rad(a2)), -Math.sin(rad(a2))];
    for (const d of [d1, d2]) items.push(line(sub(c, mulv(d, 80)), add(c, mulv(d, 80))), arrow(add(c, mulv(d, 80)), c), arrow(sub(c, mulv(d, 80)), c));
    if (kind === 'perpendicular') items.push(rightMark(c, add(c, d1), add(c, d2), 12));
  }
  return fig(items, W, H);
}
// rays from one point: the angles between ray k and ray k+1 (degrees, model directions from `start`), each labelled
//   base: 'line' draws a straight line under them, 'right' marks the outer right angle
export function raysFig({ parts, start = 0, labels = [], hl = [], base = null, ticks: tk = [], W = 280, H = 180 }) {
  const dirs = [start]; parts.forEach((p) => dirs.push(dirs[dirs.length - 1] + p));
  const total = dirs[dirs.length - 1] - start;
  const full = total >= 359.9, model = [[0, 0], ...dirs.map(dir)];
  if (full) model.push(...[0, 90, 180, 270].map(dir)); else if (base === 'line') model.push(dir(0), dir(90), dir(180));
  const F = frame(model, { W, H, pad: 30 }), V = F.m([0, 0]);
  const end = (a) => F.m(dir(a)), items = [];
  const rays = full ? dirs.slice(0, -1) : dirs;
  const rr = (k, p) => (p < 35 ? 44 : 24) + (k % (full ? 3 : 2)) * 10;
  for (const a of rays) items.push(line(V, end(a), 'ink'), arrow(end(a), V));
  parts.forEach((p, k) => {
    const A = end(dirs[k]), B = end(dirs[k + 1]), on = hl.includes(k) ? 'hlline' : 'mark';
    if (Math.abs(p - 90) < 0.01 && labels[k] === '') items.push(rightMark(V, A, B, 12));
    else items.push(...angleArc(V, A, B, labels[k] ?? '', rr(k, p), on));
    if (tk[k]) { const m = dir(dirs[k] + p / 2), at = add(V, mulv(unit(sub(F.m(m), V)), rr(k, p))); const nrm = unit(sub(at, V)); items.push(line(sub(at, mulv(nrm, 5)), add(at, mulv(nrm, 5)), 'mark')); }
  });
  if (base === 'right') items.push(rightMark(V, end(dirs[0]), end(dirs[dirs.length - 1]), 12));
  items.push(dot(V));
  return fig(items, W, H);
}
// two lines crossing at V: angles 0..3 counterclockwise starting between direction rot and rot + a
export function crossFig({ a, rot = 0, labels = [], hl = [], W = 280, H = 190 }) {
  const ds = [rot, rot + a, rot + 180, rot + 180 + a];
  const F = frame([[0, 0], ...ds.map(dir)], { W, H, pad: 26 }), V = F.m([0, 0]), end = (t) => F.m(dir(t));
  const items = [line(end(ds[0]), end(ds[2])), line(end(ds[1]), end(ds[3])), dot(V)];
  for (let k = 0; k < 4; k++) if (labels[k] != null && labels[k] !== '') items.push(...angleArc(V, end(ds[k]), end(ds[(k + 1) % 4]), labels[k], 22 + (k % 2) * 6, hl.includes(k) ? 'hlline' : 'mark'));
  return fig(items, W, H);
}

const KINDS = ['acute', 'right', 'obtuse', 'straight'];
const kindOf = (d) => (d < 90 ? 'acute' : d === 90 ? 'right' : d < 180 ? 'obtuse' : 'straight');
const kindWhy = { acute: 'less than 90°', right: 'exactly 90°, a square corner', obtuse: 'between 90° and 180°', straight: 'exactly 180°, a straight line' };
export function angles(r) {
  const v = r.int(0, 7), rot = r.pick([0, 0, 10, 20, -15, 35]);
  if (v === 0) {
    const deg = r.pick([r.int(3, 16) * 5, 90, r.int(19, 34) * 5, 180]), kind = kindOf(deg);
    const pic = (hl) => angleFig({ deg, rot: deg === 180 ? 0 : rot, label: `${deg}°`, hl });
    return mc(r, kind, KINDS.filter((k) => k !== kind), { q: `This angle measures ${deg}°. What kind of angle is it?`, visual: pic(false), steps: [
      St('Compare it with a right angle (90°, a square corner) and a straight angle (180°, a straight line).', pic(true)),
      St(`${deg}° is ${kindWhy[kind]}, so it is ${an(kind)} ${kind} angle.`)] });
  }
  if (v === 1) {
    const want = r.pick(KINDS), degOf = { acute: r.int(5, 15) * 5, right: 90, obtuse: r.int(20, 32) * 5, straight: 180 };
    const figs = Object.fromEntries(KINDS.map((k) => [k, angleFig({ deg: degOf[k], rot: k === 'straight' ? 0 : r.pick([0, 15, -10]), W: 200, H: 150 })]));
    return pickFig(r, `Which picture shows ${an(want)} ${want} angle?`, figs[want], KINDS.filter((k) => k !== want).map((k) => figs[k]), (c) => [
      St('Acute is smaller than a square corner, right is exactly a square corner, obtuse is wider than a square corner but not flat, and straight is a flat line.'),
      St(`Picture ${c} is ${kindWhy[want]}, so picture ${c} shows the ${want} angle.`, figs[want])]);
  }
  if (v === 2) {
    // estimate: the angle drawn to scale, no label
    const deg = r.int(2, 17) * 10, far = [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170].filter((x) => Math.abs(x - deg) >= 40);
    const pic = (lab) => angleFig({ deg, rot, label: lab });
    return mc(r, `${deg}°`, r.shuffle(far).slice(0, 3).map((x) => `${x}°`), { q: 'This angle is drawn accurately. Which measure is it closest to?', visual: pic(''), steps: [
      St(`Compare it with a right angle (90°). It is ${deg < 90 ? 'smaller than' : deg === 90 ? 'exactly' : 'wider than'} a square corner${deg < 90 ? (deg <= 40 ? ', less than half of one' : ', more than half of one') : deg === 90 ? '' : (deg >= 140 ? ', nearly flat' : '')}.`),
      St(`The only choice that fits is ${deg}°.`, pic(`${deg}°`))] });
  }
  if (v === 3) {
    const want = r.pick(['line', 'ray', 'segment']), nm = { line: 'a line', ray: 'a ray', segment: 'a line segment' }, rr = r.pick([0, 10, -12, 20]);
    const figs = Object.fromEntries(['line', 'ray', 'segment'].map((k) => [k, linearFig(k, ['P', 'Q'], rr)]));
    return pickFig(r, `Which picture shows ${nm[want]}?`, figs[want], ['line', 'ray', 'segment'].filter((k) => k !== want).map((k) => figs[k]), (c) => [
      St('An arrowhead means it goes on forever that way. A line has arrows at both ends, a ray has one endpoint and one arrow, and a segment has two endpoints.'),
      St(`Picture ${c} has ${want === 'line' ? 'arrows at both ends' : want === 'ray' ? 'one endpoint and one arrow' : 'two endpoints and no arrows'}, so it is ${nm[want]}.`, figs[want])]);
  }
  if (v === 4) {
    // name a ray: the endpoint comes first
    const [p, q] = r.pick([['P', 'Q'], ['A', 'B'], ['M', 'N'], ['R', 'S']]), kind = r.pick(['ray', 'ray', 'segment', 'line']), rr = r.pick([0, 10, -12]);
    const right = `${kind} ${p}${q}`, wrong = kind === 'ray' ? [`ray ${q}${p}`, `segment ${p}${q}`, `line ${p}${q}`] : kind === 'segment' ? [`ray ${p}${q}`, `ray ${q}${p}`, `line ${p}${q}`] : [`ray ${p}${q}`, `segment ${p}${q}`, `ray ${q}${p}`];
    return mc(r, right, wrong, { q: 'What is the name of this figure?', visual: linearFig(kind, [p, q], rr), steps: [
      St(kind === 'ray' ? `It has one endpoint, ${p}, and goes on forever through ${q}: a ray. A ray is named with its endpoint first.` : kind === 'segment' ? `It stops at both ${p} and ${q}: a segment.` : `It goes on forever both ways through ${p} and ${q}: a line.`),
      St(`So it is ${right}.`)] });
  }
  if (v === 5) {
    const kind = r.pick(['parallel', 'perpendicular', 'intersecting']), right = kind === 'intersecting' ? 'intersecting, but not perpendicular' : kind;
    return mc(r, right, ['parallel', 'perpendicular', 'intersecting, but not perpendicular'].filter((x) => x !== right), { q: 'How are these two lines related?', visual: twoLinesFig(kind, r.pick([0, 15, -20, 30])), steps: [
      St('Parallel lines never meet (arrow marks show they are parallel). Perpendicular lines meet at a right angle (a small square). Other lines that cross are just intersecting.'),
      St(`These lines ${kind === 'parallel' ? 'never meet' : kind === 'perpendicular' ? 'meet at a right angle' : 'cross, but not at a right angle'}, so they are ${right}.`)] });
  }
  if (v === 6) {
    // fraction of a turn, shown as part of a circle
    const k = r.pick([3, 4, 5, 6, 8, 9, 10, 12]), deg = 360 / k;
    const pic = (lab) => raysFig({ parts: [deg], start: rot, labels: [lab], W: 220, H: 170 });
    return num(deg, [St('A full turn, all the way round, is 360°.'), St(`1/${k} of it: 360 ÷ ${k} = ${deg}.`, pic(`${deg}°`)), St(`So the angle is ${deg}°.`)], { q: `An angle is 1/${k} of a full turn. How many degrees is it?`, visual: pic('?'), unit: '°', expr: `360/${k}` });
  }
  // naming an angle: the vertex is the middle letter
  const deg = r.int(5, 30) * 5, [a, b, c] = r.pick([['A', 'B', 'C'], ['P', 'Q', 'R'], ['X', 'Y', 'Z'], ['D', 'E', 'F']]);
  return mc(r, `∠${c}${b}${a}`, [`∠${b}${a}${c}`, `∠${a}${c}${b}`, `∠${b}${c}${a}`], { q: `This angle is ∠${a}${b}${c}. Which is another name for it?`, visual: angleFig({ deg, rot, names: [a, b, c] }), steps: [
    St(`The vertex, where the two rays meet, is ${b}. It must be the middle letter.`, angleFig({ deg, rot, names: [a, b, c], hl: true })),
    St(`The outer letters can swap, so ∠${c}${b}${a} names the same angle.`)] });
}

// ───────── angle pairs ─────────
export function anglePairs(r) {
  const v = r.int(0, 7), rot = r.pick([0, 0, 10, -10, 20]);
  if (v === 0) {
    const sup = r.bool(), a = sup ? r.int(5, 31) * 5 : r.int(3, 15) * 5, T = sup ? 180 : 90;
    const pic = (lab, hl) => raysFig({ parts: [a, T - a], start: sup ? 0 : rot, labels: [`${a}°`, lab], hl: hl ? [1] : [], base: sup ? 'line' : 'right' });
    return num(T - a, [
      St(sup ? 'The two angles sit together on a straight line, so they are supplementary: they add to 180°.' : 'The two angles fill a right angle (the square mark), so they are complementary: they add to 90°.', pic('x', false)),
      St(`x = ${T} − ${a} = ${T - a}.`, pic(`${T - a}°`, true)),
      St(`So x = ${T - a}°.`)], { q: 'Find the angle x.', visual: pic('x'), unit: 'x =', expr: `${T}-${a}` });
  }
  if (v === 1) {
    const a = r.int(7, 29) * 5, vert = r.bool(), k = vert ? 2 : r.pick([1, 3]);
    const pic = (lab) => { const l = ['', '', '', '']; l[0] = `${a}°`; l[k] = lab; return crossFig({ a, rot, labels: l, hl: lab === 'y' ? [] : [k] }); };
    return num(vert ? a : 180 - a, vert ? [
      St('The marked angles are opposite each other where the lines cross: vertical angles. Vertical angles are equal.', pic('y')),
      St(`y = ${a}.`, pic(`${a}°`)), St(`So y = ${a}°.`)] : [
      St('These two angles sit side by side on one straight line, so they add to 180°.', pic('y')),
      St(`y = 180 − ${a} = ${180 - a}.`, pic(`${180 - a}°`)), St(`So y = ${180 - a}°.`)], { q: 'Two straight lines cross. Find the angle y.', visual: pic('y'), unit: 'y =', expr: vert ? `${a}` : `180-${a}` });
  }
  if (v === 2) {
    // name the pair from the picture
    const kind = r.pick(['vertical angles', 'a linear pair', 'complementary angles']);
    let pic;
    if (kind === 'vertical angles') pic = crossFig({ a: r.int(8, 28) * 5, rot, labels: ['1', '', '2', ''] });
    else if (kind === 'a linear pair') pic = crossFig({ a: r.int(8, 28) * 5, rot, labels: ['1', '2', '', ''] });
    else { const a = r.int(5, 13) * 5; pic = raysFig({ parts: [a, 90 - a], start: rot, labels: ['1', '2'], base: 'right' }); }
    return mc(r, kind, ['vertical angles', 'a linear pair', 'complementary angles'].filter((x) => x !== kind), { q: 'What kind of angle pair are ∠1 and ∠2?', visual: pic, steps: [
      St('Vertical angles are opposite each other where two lines cross. A linear pair sits side by side on a straight line (they add to 180°). Complementary angles add to 90°.'),
      St(kind === 'vertical angles' ? '∠1 and ∠2 are opposite each other at the crossing, so they are vertical angles.' : kind === 'a linear pair' ? '∠1 and ∠2 share a side and together make a straight line, so they are a linear pair.' : '∠1 and ∠2 together fill the right angle, so they are complementary angles.')] });
  }
  if (v === 3) {
    const a = 2 * r.int(12, 80);
    const pic = (labs, hl) => raysFig({ parts: [a / 2, a / 2], start: rot, labels: labs, hl, ticks: [1, 1] });
    return num(a / 2, [
      St('Ray BD bisects ∠ABC: it cuts it into two equal angles (the matching marks).', pic(['?', ''], [])),
      St(`${a} ÷ 2 = ${a / 2}.`, pic([`${a / 2}°`, `${a / 2}°`], [0, 1])), St(`So ∠ABD = ${a / 2}°.`)], { q: `Ray BD bisects ∠ABC, which measures ${a}°. What is the measure of ∠ABD?`, visual: pic(['?', ''], []), unit: '°', expr: `${a}/2` });
  }
  if (v === 4) {
    // three angles around a point, or on a straight line
    const full = r.bool(), T = full ? 360 : 180;
    let p; do { p = full ? [r.int(10, 26) * 5, r.int(10, 26) * 5] : [r.int(5, 14) * 5, r.int(5, 14) * 5]; } while (T - p[0] - p[1] < (full ? 50 : 25) || T - p[0] - p[1] > (full ? 170 : 110));
    const x = T - p[0] - p[1];
    const P = (lab, hl) => raysFig({ parts: [p[0], x, p[1]], start: full ? rot : 0, labels: [`${p[0]}°`, lab, `${p[1]}°`], hl, base: full ? null : 'line' });
    return num(x, [
      St(full ? 'The angles all the way round a point make a full turn: they add to 360°.' : 'The angles on one side of a straight line add to 180°.', P('x', [])),
      St(`x = ${T} − ${p[0]} − ${p[1]} = ${x}.`, P(`${x}°`, [1])), St(`So x = ${x}°.`)], { q: full ? 'Three angles fill the space all the way round a point. Find x.' : 'Three angles sit together on a straight line. Find x.', visual: P('x', []), unit: 'x =', expr: `${T}-${p[0]}-${p[1]}` });
  }
  if (v === 5) {
    let a, b, c, d, x, T; do { T = r.pick([90, 180]); x = r.int(5, 30); a = r.int(1, 4); c = r.int(1, 4); b = r.int(-10, 30); d = T - (a + c) * x - b; } while (d < -20 || d > 60 || a * x + b < 15 || c * x + d < 15);
    const A1 = a * x + b, A2 = c * x + d;
    const pic = (l1, l2, hl) => raysFig({ parts: [A1, A2], start: T === 90 ? rot : 0, labels: [l1, l2], hl, base: T === 90 ? 'right' : 'line' });
    return num(x, [
      St(`${T === 90 ? 'The two angles fill a right angle, so they add to 90°' : 'The two angles make a straight line, so they add to 180°'}: (${ex(a, b)}) + (${ex(c, d)}) = ${T}.`, pic('a', 'b', [0, 1])),
      St(`Combine like terms: ${ex(a + c, b + d)} = ${T}, so ${a + c}x = ${T - b - d}.`),
      St(`x = ${T - b - d} ÷ ${a + c} = ${x}. Check: the angles are ${A1}° and ${A2}°, which add to ${T}°.`, pic(`${A1}°`, `${A2}°`, [])),
      St(`So x = ${x}.`)], { q: `∠a = (${ex(a, b)})° and ∠b = (${ex(c, d)})°. Find x.`, visual: pic('a', 'b', []), unit: 'x =', expr: `(${T}-(${b})-(${d}))/${a + c}` });
  }
  if (v === 6) {
    // vertical angles with expressions
    let a, b, c, d, x; do { x = r.int(4, 20); a = r.int(2, 6); c = r.int(1, 5); b = r.int(-15, 30); d = a * x + b - c * x; } while (a <= c || a * x + b < 30 || a * x + b > 150 || Math.abs(d) > 60);
    const ang = a * x + b, pic = (l1, l2, hl) => crossFig({ a: ang, rot, labels: [l1, '', l2, ''], hl });
    return num(x, [
      St('The two marked angles are vertical angles, so they are equal.', pic('a', 'b', [0, 2])),
      St(`${ex(a, b)} = ${ex(c, d)}. Take ${c}x from both sides: ${ex(a - c, b)} = ${d}.`),
      St(`${a - c}x = ${d - b}, so x = ${d - b} ÷ ${a - c} = ${x}. Each angle is ${ang}°.`, pic(`${ang}°`, `${ang}°`, [])),
      St(`So x = ${x}.`)], { q: `Two straight lines cross. ∠a = (${ex(a, b)})° and ∠b = (${ex(c, d)})°. Find x.`, visual: pic('a', 'b', []), unit: 'x =', expr: `(${d}-(${b}))/(${a}-${c})` });
  }
  const sup = r.bool(), a = sup ? r.int(5, 31) * 5 : r.int(3, 15) * 5, T = sup ? 180 : 90;
  return num(T - a, [
    St(`${sup ? 'Supplementary angles make a straight line together: they add to 180°' : 'Complementary angles make a right angle together: they add to 90°'}.`, raysFig({ parts: [a, T - a], start: 0, labels: [`${a}°`, '?'], hl: [1], base: sup ? 'line' : 'right' })),
    St(`${T} − ${a} = ${T - a}.`), St(`So the ${sup ? 'supplement' : 'complement'} is ${T - a}°.`)], { q: `What is the ${sup ? 'supplement' : 'complement'} of ${an(a)} ${a}° angle?`, visual: raysFig({ parts: [a, T - a], start: 0, labels: [`${a}°`, '?'], base: sup ? 'line' : 'right' }), unit: '°', expr: `${T}-${a}` });
}

// ───────── parallel lines and a transversal ─────────
const transversalFig = G.transversalFig;
// the angle at position k (1–8): odd positions equal deg, even ones 180 − deg
const tv = (k, deg) => (k % 2 ? deg : 180 - deg);
function tRelation(i, j) {
  if (i > j) [i, j] = [j, i];
  if ((i <= 4) === (j <= 4)) return Math.abs(i - j) === 2 ? 'vertical angles' : 'a linear pair';
  const a = i, b = j - 4;
  if (a === b) return 'corresponding angles';
  return { 31: 'alternate interior angles', 42: 'alternate interior angles', 32: 'co-interior angles', 41: 'co-interior angles', 13: 'alternate exterior angles', 24: 'alternate exterior angles' }[`${a}${b}`] ?? null;
}
const T_WHY = {
  'corresponding angles': 'are in the same position at the two crossings, so they are corresponding angles: equal when the lines are parallel.',
  'alternate interior angles': 'are both between the parallel lines, on opposite sides of the transversal: alternate interior angles, which are equal.',
  'alternate exterior angles': 'are both outside the parallel lines, on opposite sides of the transversal: alternate exterior angles, which are equal.',
  'co-interior angles': 'are both between the parallel lines, on the same side of the transversal: co-interior angles, which add to 180°.',
  'vertical angles': 'are opposite each other at one crossing: vertical angles, which are equal.',
  'a linear pair': 'sit side by side on one straight line: a linear pair, which adds to 180°.',
};
const T_PAIRS = [[1, 5], [2, 6], [3, 7], [4, 8], [3, 5], [4, 6], [3, 6], [4, 5], [1, 7], [2, 8], [1, 3], [2, 4], [5, 7], [6, 8], [1, 2], [5, 8]];
export function transversal(r) {
  const v = r.int(0, 6);
  let deg = r.int(8, 28) * 5; if (deg >= 80 && deg <= 100) deg = r.pick([55, 65, 115, 125]);
  if (v === 0) {
    const [i, j] = r.pick(T_PAIRS.slice(0, 10)), rel = tRelation(i, j), labels = { [i]: String(i), [j]: String(j) };
    return mc(r, rel, ['corresponding angles', 'alternate interior angles', 'alternate exterior angles', 'co-interior angles'].filter((x) => x !== rel), { q: `The arrows show the two lines are parallel. What kind of angle pair are ∠${i} and ∠${j}?`, visual: transversalFig({ deg, labels }), steps: [
      St('Interior means between the parallel lines; exterior means outside them. Alternate means on opposite sides of the transversal (the slanted line).', transversalFig({ deg, labels, hl: [i, j] })),
      St(`∠${i} and ∠${j} ${T_WHY[rel]}`)] });
  }
  if (v === 1 || v === 2) {
    const [i, j] = r.pick(T_PAIRS), rel = tRelation(i, j), same = tv(i, deg) === tv(j, deg), ans = tv(j, deg);
    const pic = (lab, hl) => transversalFig({ deg, labels: { [i]: `${tv(i, deg)}°`, [j]: lab }, hl });
    return num(ans, [
      St(`The ${tv(i, deg)}° angle and x ${T_WHY[rel]}`, pic('x', [i, j])),
      St(same ? `x = ${ans}.` : `x = 180 − ${tv(i, deg)} = ${ans}.`, pic(`${ans}°`, [j])),
      St(`So x = ${ans}°.`)], { q: 'The two lines with arrows are parallel. Find the angle x.', visual: pic('x', []), unit: 'x =', expr: same ? `${ans}` : `180-${tv(i, deg)}` });
  }
  if (v === 3) {
    // corresponding, alternate interior or alternate exterior angles with expressions: they are equal
    let a, b, c, d, x; do { x = r.int(5, 25); a = r.int(2, 6); c = r.int(1, 5); b = r.int(-20, 40); d = a * x + b - c * x; } while (a <= c || a * x + b < 35 || a * x + b > 145 || (a * x + b >= 80 && a * x + b <= 100) || Math.abs(d) > 80);
    const ang = a * x + b, [i, j] = r.pick([[1, 5], [2, 6], [3, 5], [4, 6], [1, 7], [3, 7]]), rel = tRelation(i, j);
    const dd = i % 2 ? ang : 180 - ang;
    const pic = (l1, l2, hl) => transversalFig({ deg: dd, labels: { [i]: l1, [j]: l2 }, hl });
    return num(x, [
      St(`The two marked angles ${T_WHY[rel]}`, pic('a', 'b', [i, j])),
      St(`So ${ex(a, b)} = ${ex(c, d)}. Take ${c}x from both sides: ${ex(a - c, b)} = ${d}, so ${a - c}x = ${d - b}.`),
      St(`x = ${d - b} ÷ ${a - c} = ${x}. Each angle is ${ang}°.`, pic(`${ang}°`, `${ang}°`, [])),
      St(`So x = ${x}.`)], { q: `The two lines with arrows are parallel. ∠a = (${ex(a, b)})° and ∠b = (${ex(c, d)})°. Find x.`, visual: pic('a', 'b', []), unit: 'x =', expr: `(${d}-(${b}))/(${a}-${c})` });
  }
  if (v === 4) {
    // co-interior angles with expressions: they add to 180°
    let a, b, c, d, x; do { x = r.int(5, 25); a = r.int(1, 5); c = r.int(1, 5); b = r.int(-10, 40); d = 180 - (a + c) * x - b; } while (a * x + b < 40 || c * x + d < 40 || Math.abs(a * x + b - 90) < 10 || Math.abs(d) > 80);
    const A1 = a * x + b, [i, j] = r.pick([[3, 6], [4, 5]]), dd = i % 2 ? A1 : 180 - A1;
    const pic = (l1, l2, hl) => transversalFig({ deg: dd, labels: { [i]: l1, [j]: l2 }, hl });
    return num(x, [
      St(`The two marked angles ${T_WHY['co-interior angles']}`, pic('a', 'b', [i, j])),
      St(`(${ex(a, b)}) + (${ex(c, d)}) = 180, so ${ex(a + c, b + d)} = 180 and ${a + c}x = ${180 - b - d}.`),
      St(`x = ${180 - b - d} ÷ ${a + c} = ${x}. The angles are ${A1}° and ${180 - A1}°.`, pic(`${A1}°`, `${180 - A1}°`, [])),
      St(`So x = ${x}.`)], { q: `The two lines with arrows are parallel. ∠a = (${ex(a, b)})° and ∠b = (${ex(c, d)})°. Find x.`, visual: pic('a', 'b', []), unit: 'x =', expr: `(180-(${b})-(${d}))/${a + c}` });
  }
  if (v === 5) {
    // which angle must equal ∠k?
    const k = r.int(1, 8), lab = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map((n) => [n, String(n)]));
    const eq = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => n !== k && n % 2 === k % 2 && tRelation(k, n) && tRelation(k, n) !== 'co-interior angles');
    const right = r.pick(eq), wrongs = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8].filter((n) => n % 2 !== k % 2)).slice(0, 3);
    return mc(r, `∠${right}`, wrongs.map((n) => `∠${n}`), { q: `The lines with arrows are parallel. Which angle must be equal to ∠${k}?`, visual: transversalFig({ deg, labels: lab }), steps: [
      St('With parallel lines the angles come in just two sizes: ∠1, ∠3, ∠5 and ∠7 are all equal, and ∠2, ∠4, ∠6 and ∠8 are all equal (the other size).', transversalFig({ deg, labels: lab, hl: k % 2 ? [1, 3, 5, 7] : [2, 4, 6, 8] })),
      St(`∠${k} and ∠${right} are ${tRelation(k, right)}, so ∠${right} = ∠${k}.`, transversalFig({ deg, labels: lab, hl: [k, right] }))] });
  }
  // are the lines parallel? the marked angles equal or not
  const [i, j] = r.pick([[1, 5], [2, 6], [3, 5], [4, 6]]), yes = r.bool(), a1 = tv(i, deg), a2 = yes ? a1 : a1 + r.pick([-6, -4, 3, 5]), rel = tRelation(i, j);
  const labels = { [i]: `${a1}°`, [j]: `${a2}°` };
  return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'A line crosses two other lines. Are those two lines parallel? (The figure is not drawn to scale.)', visual: transversalFig({ deg, labels, parallel: false }), steps: [
    St(`The marked angles are ${rel}. The two lines are parallel exactly when ${rel} are equal.`, transversalFig({ deg, labels, hl: [i, j], parallel: false })),
    St(yes ? `${a1}° = ${a2}°, so yes, the lines are parallel.` : `${a1}° ≠ ${a2}°, so no, the lines are not parallel.`)] });
}

// ───────── polygons ─────────
const PN = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
// a triangle from its three sides (model): c along the bottom
const triSides = (a, b, c) => { const x = (b * b + c * c - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0.01, b * b - x * x))]]; };
// an irregular polygon: the corners of a regular one pushed in and out a little
const wobble = (n, r) => G.regular(n).map(([x, y]) => { const k = 0.82 + r.next() * 0.3; return [x * k, y * k]; });
const QUADS = {
  square: { pts: [[0, 0], [5, 0], [5, 5], [0, 5]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], say: 'four equal sides (one tick on each) and four right angles' },
  rectangle: { pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], say: 'four right angles, with opposite sides equal but not all four equal' },
  rhombus: { pts: [[0, 0], [5, 0], [8, 4], [3, 4]], ticks: [1, 1, 1, 1], say: 'four equal sides but no right angles' },
  parallelogram: { pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], par: [1, 2, 1, 2], ticks: [1, 2, 1, 2], say: 'two pairs of parallel sides (the arrows) and no right angles, with sides that are not all equal' },
  trapezoid: { pts: [[0, 0], [9, 0], [6.5, 4], [2, 4]], par: [1, 0, 1, 0], say: 'exactly one pair of parallel sides (the arrows)' },
  kite: { pts: [[0, 3], [3, 0], [9, 3], [3, 6]], ticks: [1, 2, 2, 1], say: 'two pairs of equal sides next to each other, and no parallel sides' },
};
export function polygons(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const n = r.pick([3, 4, 5, 6, 7, 8, 9, 10]), right = PN[n], reg = r.bool();
    const pts = reg ? G.regular(n) : wobble(n, r);
    return mc(r, right, r.shuffle(Object.values(PN).filter((x) => x !== right && x !== 'dodecagon')).slice(0, 3), { q: 'What is the name of this polygon?', visual: polygonFig({ pts }), steps: [
      St(`Count the sides (or the corners): ${n}.`, polygonFig({ pts, names: pts.map((_, i) => String(i + 1)) })),
      St(`A polygon with ${n} sides is ${an(right)} ${right}.`)] });
  }
  if (v === 1) {
    const s = r.int(5, 12), kind = r.pick(['equilateral', 'isosceles', 'scalene']);
    let pts, sides, tk;
    if (kind === 'equilateral') { pts = triSides(s, s, s); sides = [`${s} cm`, `${s} cm`, `${s} cm`]; tk = [1, 1, 1]; }
    else if (kind === 'isosceles') { const b = s + r.pick([-3, -2, 1, 2, 3]); pts = triSides(s, s, b); sides = [`${b} cm`, `${s} cm`, `${s} cm`]; tk = [0, 1, 1]; }
    else { const b = s + 1, c = s + r.int(2, 3); pts = triSides(s, b, c); sides = [`${c} cm`, `${s} cm`, `${b} cm`]; tk = [0, 0, 0]; }
    return mc(r, kind, ['equilateral', 'isosceles', 'scalene'].filter((k) => k !== kind), { q: 'Classify this triangle by its sides.', visual: polygonFig({ pts, sides }), steps: [
      St('Equilateral: all 3 sides equal. Isosceles: exactly 2 equal. Scalene: no sides equal. Tick marks show the equal sides.', polygonFig({ pts, sides, ticks: tk })),
      St(`Here ${kind === 'equilateral' ? 'all 3 sides are equal' : kind === 'isosceles' ? 'exactly 2 sides are equal' : 'no two sides are equal'}, so it is ${kind}.`)] });
  }
  if (v === 2) {
    const kind = r.pick(['acute', 'right', 'obtuse']);
    let A, B;
    do { if (kind === 'right') { A = 90; B = r.int(5, 12) * 5; } else if (kind === 'obtuse') { A = r.int(20, 26) * 5; B = r.int(4, 8) * 5; } else { A = r.int(10, 17) * 5; B = r.int(10, 17) * 5; } } while (180 - A - B < 20 || (kind === 'acute' && 180 - A - B >= 90));
    const C = 180 - A - B, sh = r.int(0, 2), angs = [A, B, C], order = [sh, (sh + 1) % 3, (sh + 2) % 3].map((k) => angs[k]);
    const pts = triPts(order[0], order[1]), big = Math.max(A, B, C), bi = order.indexOf(big);
    const labs = order.map((x) => `${x}°`);
    return mc(r, kind, ['acute', 'right', 'obtuse'].filter((k) => k !== kind), { q: 'Classify this triangle by its angles.', visual: polygonFig({ pts, angles: labs, right: [] }), steps: [
      St('Look at the largest angle. Acute: all angles less than 90°. Right: one angle is 90°. Obtuse: one angle is more than 90°.', polygonFig({ pts, angles: labs, hl: [{ angle: bi }] })),
      St(`The largest angle is ${big}°, ${kind === 'acute' ? 'less than 90°' : kind === 'right' ? 'exactly 90°' : 'more than 90°'}, so it is ${an(kind)} ${kind} triangle.`)] });
  }
  if (v === 3) {
    const right = r.pick(Object.keys(QUADS)), Q = QUADS[right];
    return mc(r, right, r.shuffle(Object.keys(QUADS).filter((x) => x !== right)).slice(0, 3), { q: 'Read the marks on the sides and corners. What is the most specific name for this quadrilateral?', visual: polygonFig(Q), steps: [
      St('Tick marks show equal sides, arrows show parallel sides, and a small square shows a right angle.', polygonFig(Q)),
      St(`This one has ${Q.say}, so it is ${an(right)} ${right}.`)] });
  }
  if (v === 4) {
    const [q, right] = r.pick([['Which quadrilateral has exactly one pair of parallel sides?', 'trapezoid'], ['Which quadrilateral has four equal sides and four right angles?', 'square'], ['Which quadrilateral has four right angles, with opposite sides equal but not all four equal?', 'rectangle'], ['Which quadrilateral has four equal sides but no right angles?', 'rhombus'], ['Which quadrilateral has two pairs of equal sides next to each other and no parallel sides?', 'kite']]);
    return mc(r, right, r.shuffle(['square', 'rectangle', 'rhombus', 'trapezoid', 'kite'].filter((x) => x !== right)).slice(0, 3), { q, steps: [
      St('Check the sides, the parallel pairs and the angles one at a time.'),
      St(`That is ${an(right)} ${right}: it has ${QUADS[right].say}.`, polygonFig(QUADS[right]))] });
  }
  if (v === 5) {
    // which is a polygon? closed, straight sides, sides that do not cross
    const yes = polygonFig({ pts: wobble(r.pick([5, 6]), r), W: 200, H: 150 });
    const open = fig([poly([[30, 110], [70, 30], [130, 40], [170, 110], [110, 125]], 'ink', { open: true })], 200, 150);
    const curve = fig([path('M40 115L160 115L160 60A60 45 0 0 0 40 60Z', 'fig')], 200, 150);
    const cross = fig([poly([[40, 30], [160, 120], [160, 30], [40, 120]], 'fig')], 200, 150);
    return pickFig(r, 'Which figure is a polygon?', yes, [open, curve, cross], (c) => [
      St('A polygon is a closed flat shape made only of straight sides that meet just at their ends, without crossing.'),
      St(`One figure is not closed, one has a curved side, and one has sides that cross. Figure ${c} is the polygon.`, yes)]);
  }
  // which is a regular polygon? all sides equal AND all angles equal
  const n = r.pick([5, 6, 8]), reg = polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), arcs: Array.from({ length: n }, (_, i) => i), W: 200, H: 160 });
  const rhom = polygonFig({ pts: QUADS.rhombus.pts, ticks: [1, 1, 1, 1], W: 200, H: 160 });
  const rect = polygonFig({ pts: QUADS.rectangle.pts, right: [0, 1, 2, 3], ticks: [1, 2, 1, 2], W: 200, H: 160 });
  const irr = polygonFig({ pts: wobble(n, r), W: 200, H: 160 });
  return pickFig(r, 'Which figure is a regular polygon?', reg, [rhom, rect, irr], (c) => [
    St('A regular polygon has all its sides equal and all its angles equal.'),
    St(`The rhombus has equal sides but unequal angles, and the rectangle has equal angles but unequal sides. Figure ${c} has both, so it is regular.`, reg)]);
}

// ───────── angles in polygons and circles ─────────
// a circle cut into n equal slices from the centre, slice 0 highlighted
function slicesFig(n, label, hl = true) {
  const W = 240, H = 210, C = [120, 105], R = 80, items = [circle(C, R, 'fig')];
  const p = (k) => [C[0] + R * Math.cos(rad((360 * k) / n)), C[1] - R * Math.sin(rad((360 * k) / n))];
  items.push(path(`M${C.join(' ')}L${p(0).map(R1).join(' ')}A${R} ${R} 0 0 0 ${p(1).map(R1).join(' ')}Z`, hl ? 'hl' : 'fig'));
  for (let k = 0; k < n; k++) items.push(line(C, p(k), 'ink'));
  items.push(...angleArc(C, p(0), p(1), label, n > 8 ? 30 : 22, 'mark'), dot(C));
  return fig(items, W, H);
}
// a circle with one part highlighted: radius, diameter, chord or arc
export function circlePartFig(kind) {
  const W = 230, H = 210, C = [115, 105], R = 78, at = (d) => [C[0] + R * Math.cos(rad(d)), C[1] - R * Math.sin(rad(d))];
  const items = [circle(C, R, 'fig'), dot(C), text([C[0] - 4, C[1] + 14], 'O', 'muted', { size: 12 })];
  if (kind === 'radius') items.push(line(C, at(35), 'hlline'), dot(at(35)));
  else if (kind === 'diameter') items.push(line(at(200), at(20), 'hlline'), dot(at(200)), dot(at(20)));
  else if (kind === 'chord') items.push(line(at(200), at(305), 'hlline'), dot(at(200)), dot(at(305)));
  else items.push(arcD(C, R, 20, 100, 'hlline'), dot(at(20)), dot(at(100)));
  return fig(items, W, H);
}
export function polyAngles(r) {
  const v = r.int(0, 8);
  if (v === 0) {
    let A, B; do { A = r.int(5, 23) * 5; B = r.int(5, 23) * 5; } while (180 - A - B < 25);
    const C = 180 - A - B, pts = triPts(A, B), pic = (lab, hl) => polygonFig({ pts, angles: [`${A}°`, `${B}°`, lab], hl });
    return num(C, [
      St('The three angles of any triangle add to 180°.', pic('x', [{ angle: 0 }, { angle: 1 }])),
      St(`x = 180 − ${A} − ${B} = ${C}.`, pic(`${C}°`, [{ angle: 2 }])),
      St(`So x = ${C}°.`)], { q: 'Find the missing angle x in this triangle.', visual: pic('x'), unit: 'x =', expr: `180-${A}-${B}` });
  }
  if (v === 1) {
    const n = r.pick([5, 6, 7, 8, 9, 10, 12]), sum = (n - 2) * 180, cut = G.triangulated(G.regular(n));
    return num(sum, [
      St(`Draw every diagonal from one corner. They cut the ${PN[n]} into ${n} − 2 = ${n - 2} triangles.`, cut),
      St(`Each triangle has 180°: ${n - 2} × 180 = ${sum}.`),
      St(`So the angles add to ${sum}°.`)], { q: `What is the sum of the interior angles of ${an(PN[n])} ${PN[n]} (${n} sides)?`, visual: polygonFig({ pts: wobble(n, r) }), unit: '°', expr: `(${n}-2)*180` });
  }
  if (v === 2) {
    const n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]), sum = (n - 2) * 180, each = sum / n;
    const pic = (lab, hl) => polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), angles: [lab], hl });
    return num(each, [
      St(`The angles of ${an(PN[n])} ${PN[n]} add to (${n} − 2) × 180 = ${sum}°.`, G.triangulated(G.regular(n))),
      St(`In a regular ${PN[n]} all ${n} angles are equal: ${sum} ÷ ${n} = ${each}.`, pic(`${each}°`, [{ angle: 0 }])),
      St(`So each angle is ${each}°.`)], { q: `This is a regular ${PN[n]}: all sides and angles are equal. What is each interior angle?`, visual: pic('?'), unit: '°', expr: `(${n}-2)*180/${n}` });
  }
  if (v === 3) {
    let a, b, c, d, pts = null, guard = 0;
    do { a = r.int(12, 26) * 5; b = r.int(12, 26) * 5; c = r.int(12, 26) * 5; d = 360 - a - b - c; if (d >= 50 && d <= 150) pts = quadPts([a, b, c, d], r); } while (!pts && guard++ < 60);
    if (!pts) { a = 80; b = 100; c = 85; d = 95; pts = quadPts([a, b, c, d], r) ?? [[0, 0], [8, 0], [8, 5], [0, 5]]; }
    const ok = pts.length === 4 && Math.abs(360 - a - b - c - d) < 1e-9;
    const pic = (lab, hl) => polygonFig({ pts, angles: [`${a}°`, `${b}°`, `${c}°`, lab], hl });
    return num(d, [
      St('A diagonal cuts any quadrilateral into 2 triangles, so its angles add to 2 × 180° = 360°.', polygonFig({ pts, diag: [[0, 2]], angles: [`${a}°`, `${b}°`, `${c}°`, 'x'] })),
      St(`x = 360 − ${a} − ${b} − ${c} = ${d}.`, pic(`${d}°`, [{ angle: 3 }])),
      St(`So x = ${d}°.`)], { q: `Find the missing angle x in this quadrilateral.${ok ? '' : ' (Not drawn to scale.)'}`, visual: pic('x'), unit: 'x =', expr: `360-${a}-${b}-${c}` });
  }
  if (v === 4) {
    const n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]);
    return num(360 / n, [
      St('All the angles at the centre together make a full turn: 360°.', slicesFig(n, '', false)),
      St(`The ${n} slices are equal: 360 ÷ ${n} = ${360 / n}.`, slicesFig(n, `${360 / n}°`)),
      St(`So each central angle is ${360 / n}°.`)], { q: `A circle is cut into ${n} equal slices from its centre. What is the angle of each slice at the centre?`, visual: slicesFig(n, '?'), unit: '°', expr: `360/${n}` });
  }
  if (v === 5) {
    const right = r.pick(['radius', 'diameter', 'chord', 'arc']);
    return mc(r, right, ['radius', 'diameter', 'chord', 'arc'].filter((x) => x !== right), { q: 'O is the centre of the circle. What is the highlighted part called?', visual: circlePartFig(right), steps: [
      St('Radius: from the centre to the circle. Diameter: across the circle through the centre. Chord: from one point on the circle to another, not always through the centre. Arc: a piece of the curve itself.', { type: 'figs', figs: ['radius', 'diameter', 'chord', 'arc'].map(circlePartFig), captions: ['radius', 'diameter', 'chord', 'arc'] }),
      St(`So the highlighted part is ${an(right)} ${right}.`)] });
  }
  if (v === 6) {
    // isosceles triangle: base angles are equal
    const apexGiven = r.bool();
    let apex, base; do { base = r.int(6, 17) * 5; apex = 180 - 2 * base; } while (apex < 20);
    const pts = triPts(base, base), pic = (labs, hl) => polygonFig({ pts, ticks: [0, 1, 1], angles: labs, hl });
    if (apexGiven) return num(base, [
      St('Two sides are equal (the ticks), so the two angles at the base are equal too.', pic(['x', 'x', `${apex}°`], [{ angle: 0 }, { angle: 1 }])),
      St(`The angles add to 180°: x + x = 180 − ${apex} = ${180 - apex}, so x = ${180 - apex} ÷ 2 = ${base}.`),
      St(`So x = ${base}°.`)], { q: 'This triangle is isosceles. Find x.', visual: pic(['x', '', `${apex}°`]), unit: 'x =', expr: `(180-${apex})/2` });
    return num(apex, [
      St('Two sides are equal (the ticks), so the two angles at the base are equal: both are ' + base + '°.', pic([`${base}°`, `${base}°`, 'x'], [{ angle: 0 }, { angle: 1 }])),
      St(`x = 180 − ${base} − ${base} = ${apex}.`),
      St(`So x = ${apex}°.`)], { q: 'This triangle is isosceles. Find x.', visual: pic([`${base}°`, '', 'x']), unit: 'x =', expr: `180-2*${base}` });
  }
  if (v === 7) {
    // the exterior angle of a triangle equals the two far-away interior angles together
    let A, C; do { A = r.int(6, 16) * 5; C = r.int(6, 16) * 5; } while (180 - A - C < 30 || 180 - A - C > 120);
    const B = 180 - A - C, pts = triPts(A, B);
    // vertex order for polygonFig: 0 = A, 1 = B, 2 = top; ext at B extends side A→B
    const pic = (lab, hl) => polygonFig({ pts, angles: [`${A}°`, '', `${C}°`], ext: 1, extLabel: lab, hl });
    return num(A + C, [
      St('The exterior angle and the angle inside at that corner make a straight line, so they add to 180°. The three inside angles also add to 180°.', pic('x', ['ext'])),
      St(`So the exterior angle equals the two far-away inside angles together: x = ${A} + ${C} = ${A + C}.`, pic(`${A + C}°`, [{ angle: 0 }, { angle: 2 }])),
      St(`So x = ${A + C}°.`)], { q: 'One side of this triangle is extended. Find the exterior angle x.', visual: pic('x'), unit: 'x =', expr: `${A}+${C}` });
  }
  // a missing angle in a pentagon or hexagon (not drawn to scale)
  const n = r.pick([5, 6]), sum = (n - 2) * 180;
  let angs, x, guard = 0;
  do { angs = Array.from({ length: n - 1 }, () => r.int(18, 32) * 5); x = sum - angs.reduce((p, q) => p + q, 0); } while ((x < 70 || x > 170) && guard++ < 200);
  if (x < 70 || x > 170) { angs = Array(n - 1).fill(sum / n); x = sum / n; }
  const known = angs.reduce((p, q) => p + q, 0), labs = [...angs.map((t) => `${t}°`), 'x'], pts = wobble(n, r);
  return num(x, [
    St(`${cap(an(PN[n]))} ${PN[n]} cuts into ${n - 2} triangles, so its angles add to (${n} − 2) × 180 = ${sum}°.`, G.triangulated(pts)),
    St(`Add the angles you know: ${angs.join(' + ')} = ${known}.`, polygonFig({ pts, angles: labs, hl: angs.map((_, i) => ({ angle: i })) })),
    St(`x = ${sum} − ${known} = ${x}.`),
    St(`So x = ${x}°.`)], { q: `Find the angle x in this ${PN[n]}. (Not drawn to scale.)`, visual: polygonFig({ pts, angles: labs }), unit: 'x =', expr: `${sum}-${known}` });
}

// ───────── constructions (compass and straightedge) ─────────
// perpendicular bisector of AB: stage 0 the segment, 1 the arcs, 2 the line through the crossings and the midpoint M
export function perpBisFig(stage = 2, { labels = {}, P = false } = {}) {
  const W = 300, H = 230, A = [80, 130], B = [220, 130], R = 95, h = Math.sqrt(R * R - 70 * 70), X1 = [150, 130 - h], X2 = [150, 130 + h];
  const items = [line(A, B, 'ink'), dot(A), dot(B), text([A[0] - 14, A[1] + 4], 'A', 'muted', { size: 13 }), text([B[0] + 14, B[1] + 4], 'B', 'muted', { size: 13 })];
  if (stage >= 1) items.push(arcD(A, R, -58, 58, 'aux'), arcD(B, R, 122, 238, 'aux'), dot(X1), dot(X2));
  if (stage >= 2) items.push(line([150, 130 - h - 22], [150, 130 + h + 22], 'hlline'), rightMark([150, 130], A, X1, 10), dot([150, 130]), text([162, 144], 'M', 'muted', { size: 13 }), ...ticks(A, [150, 130], 1), ...ticks([150, 130], B, 1));
  if (P) { const p = [150, 130 - h - 8]; items.push(line(A, p, 'aux'), line(B, p, 'aux'), dot(p), text([p[0] + 14, p[1] - 6], 'P', 'muted', { size: 13 })); if (labels.PA) items.push(sideLabel(A, p, labels.PA, [150, 130], 'ink')); if (labels.PB) items.push(sideLabel(B, p, labels.PB, [150, 130], labels.PB === '?' ? 'hl' : 'ink')); }
  if (labels.AB) items.push(text([150 - 40, 148], labels.AB, 'ink'));
  if (labels.AM) items.push(text([115, 116], labels.AM, 'hl'));
  return fig(items, W, H);
}
// angle bisector of ∠ABC (vertex B at the bottom left), opening deg
export function angleBisFig(deg, stage = 2, labels = {}) {
  const W = 290, H = 220, V = [58, 180], Lr = 210, e = (a, d) => [V[0] + d * Math.cos(rad(a)), V[1] - d * Math.sin(rad(a))];
  const hh = deg / 2, r0 = 80, P = e(0, r0), Q = e(deg, r0), rho = r0 * Math.sin(rad(hh)) + 30;
  const t = r0 * Math.cos(rad(hh)) + Math.sqrt(rho * rho - (r0 * Math.sin(rad(hh))) ** 2), X = e(hh, t);
  const items = [line(V, e(0, Lr), 'ink'), line(V, e(deg, Lr), 'ink'), dot(V), text([V[0] - 10, V[1] + 10], 'B', 'muted', { size: 13 }), text(add(e(0, Lr), [0, 14]), 'A', 'muted', { size: 13 }), text(add(e(deg, Lr), [-12, -4]), 'C', 'muted', { size: 13 })];
  if (stage >= 1) {
    items.push(arcD(V, r0, -8, deg + 8, 'aux'), dot(P), dot(Q));
    const aP = (Math.atan2(-(X[1] - P[1]), X[0] - P[0]) * 180) / Math.PI, aQ = (Math.atan2(-(X[1] - Q[1]), X[0] - Q[0]) * 180) / Math.PI;
    items.push(arcD(P, rho, aP - 14, aP + 14, 'aux'), arcD(Q, rho, aQ - 14, aQ + 14, 'aux'), dot(X));
  }
  if (stage >= 2) { items.push(line(V, e(hh, Lr * 1.02), 'hlline'), text(add(e(hh, Lr * 1.02), [10, -8]), 'D', 'muted', { size: 13 })); }
  if (labels.whole) items.push(...angleArc(V, e(0, 1), e(deg, 1), labels.whole, 30, 'mark'));
  if (labels.half) items.push(...angleArc(V, e(0, 1), e(hh, 1), labels.half, 46, 'hlline'));
  return fig(items, W, H);
}
// an equilateral triangle on AB: arcs of radius AB from A and from B meet at C
export function equiFig(stage = 2, label = '') {
  const W = 280, H = 220, A = [80, 180], B = [200, 180], C = [140, 180 - 103.9];
  const items = [line(A, B, 'ink'), dot(A), dot(B), text([A[0] - 12, A[1] + 8], 'A', 'muted', { size: 13 }), text([B[0] + 12, B[1] + 8], 'B', 'muted', { size: 13 })];
  if (label) items.push(text([140, 196], label, 'ink'));
  if (stage >= 1) items.push(arcD(A, 120, 40, 80, 'aux'), arcD(B, 120, 100, 140, 'aux'), dot(C), text([C[0], C[1] - 16], 'C', 'muted', { size: 13 }));
  if (stage >= 2) items.push(line(A, C, 'hlline'), line(B, C, 'hlline'), ...ticks(A, B, 1), ...ticks(A, C, 1), ...ticks(B, C, 1));
  return fig(items, W, H);
}
// a regular hexagon in a circle: step round the circle with the compass set to the radius
export function hexFig(stage = 2, label = '') {
  const W = 240, H = 220, C = [120, 110], R = 80, p = (k) => [C[0] + R * Math.cos(rad(60 * k)), C[1] - R * Math.sin(rad(60 * k))];
  const items = [circle(C, R, 'fig'), dot(C), line(C, p(0), 'aux')];
  if (label) items.push(text(add(mid(C, p(0)), [0, -11]), label, 'ink'));
  if (stage >= 1) for (let k = 0; k < 6; k++) { const a = 60 * k; items.push(arcD(p(k), R, a + 120 - 12, a + 120 + 12, 'aux'), dot(p(k))); }
  if (stage >= 2) items.push(poly([0, 1, 2, 3, 4, 5].map(p), 'hlline'));
  return fig(items, W, H);
}
const CONS = { 'a perpendicular bisector': (s) => perpBisFig(s), 'an angle bisector': (s) => angleBisFig(70, s), 'an equilateral triangle': (s) => equiFig(s), 'a regular hexagon': (s) => hexFig(s) };
const CONS_Q = [
  ['To construct the perpendicular bisector of segment AB, you draw arcs of the same radius centred at…', 'both A and B', ['only A', 'the midpoint, which you measure first', 'any point on AB'], 'Points the same distance from A and B lie on the perpendicular bisector, so the arcs are centred at A and at B.', 'pb'],
  ['For a perpendicular bisector of AB, the compass must be opened to…', 'more than half the length of AB', ['less than half the length of AB', 'exactly 1 cm', 'any width at all'], 'If the radius is less than half of AB, the arcs from A and B never meet.', 'pb'],
  ['To draw a regular hexagon inside a circle, you step around the circle with the compass set to…', 'the radius of the circle', ['the diameter of the circle', 'half the radius', 'any width'], 'A regular hexagon is made of 6 equilateral triangles meeting at the centre, so each side equals the radius.', 'hex'],
  ['Classic constructions use only…', 'a compass and a straightedge', ['a protractor and a marked ruler', 'a calculator', 'a set square'], 'Constructions do not measure: they copy distances with a compass and draw straight lines with a straightedge.', 'pb'],
  ['To construct an equilateral triangle on segment AB, the compass is set to…', 'the length of AB', ['half of AB', 'twice AB', 'any length'], 'All three sides must equal AB, so both arcs use radius AB.', 'eq'],
  ['To copy an angle, after one arc crosses both arms, you use the compass to copy…', 'the distance between the two crossing points', ['the length of one arm', 'the angle in degrees', 'the distance to the vertex only'], 'That distance fixes how wide the angle opens.', null],
  ['One way to construct a line through P parallel to line ℓ is to copy…', 'a corresponding angle at P', ['the length of ℓ', 'a circle through P', 'the midpoint of ℓ'], 'Equal corresponding angles make the lines parallel.', null],
  ['The perpendicular bisector of AB crosses AB…', 'at its midpoint, at a right angle', ['at A, at a right angle', 'at its midpoint, at 45°', 'nowhere'], 'Bisector means it cuts AB in half; perpendicular means it meets AB at 90°.', 'pb'],
  ['To bisect ∠ABC, the first arc is centred at…', 'the vertex B', ['point A', 'point C', 'the middle of AC'], 'The first arc, centred at the vertex, crosses both arms at the same distance from B.', 'ab'],
];
export function construct(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const names = Object.keys(CONS), right = r.pick(names);
    return mc(r, right, names.filter((x) => x !== right), { q: 'These compass arcs show the steps of a construction. What is being constructed?', visual: CONS[right](1), steps: [
      St(right === 'a perpendicular bisector' ? 'Equal arcs are drawn from both ends of a segment; they cross above and below it.' : right === 'an angle bisector' ? 'An arc from the vertex crosses both arms; then equal arcs from those two points cross inside the angle.' : right === 'an equilateral triangle' ? 'Arcs with radius AB are drawn from A and from B; they meet at one point above AB.' : 'The compass, set to the radius, steps round the circle six times.', CONS[right](1)),
      St(`Joining up gives ${right}.`, CONS[right](2))] });
  }
  if (v === 1 || v === 2) {
    const [q, right, wrongs, why, pic] = r.pick(CONS_Q);
    const start = { pb: perpBisFig(0), hex: hexFig(0), eq: equiFig(0), ab: angleBisFig(70, 0) }[pic];
    const done = { pb: perpBisFig(2), hex: hexFig(2), eq: equiFig(2), ab: angleBisFig(70, 2) }[pic];
    return mc(r, right, wrongs, { q, ...(start ? { visual: start } : {}), steps: [St(why, done ?? null), St(`So the answer is: ${right}.`)] });
  }
  if (v === 3) {
    const a = 2 * r.int(15, 60);
    return num(a / 2, [
      St('The angle bisector BD cuts ∠ABC into two equal angles.', angleBisFig(a, 2, { whole: `${a}°` })),
      St(`${a} ÷ 2 = ${a / 2}.`, angleBisFig(a, 2, { half: `${a / 2}°` })),
      St(`So ∠ABD = ${a / 2}°.`)], { q: `Ray BD is constructed to bisect ∠ABC, which measures ${a}°. What does ∠ABD measure?`, visual: angleBisFig(a, 2, { whole: `${a}°` }), unit: '°', expr: `${a}/2` });
  }
  if (v === 4) {
    if (r.bool()) {
      const d = r.int(4, 15);
      return num(d, [
        St('Every point on the perpendicular bisector of AB is the same distance from A as from B.', perpBisFig(2, { P: true, labels: { PA: `${d} cm`, PB: '?' } })),
        St(`P is on it, so PB = PA = ${d}.`),
        St(`So PB = ${d} cm.`)], { q: `P is on the perpendicular bisector of AB, and PA = ${d} cm. How long is PB?`, visual: perpBisFig(2, { P: true, labels: { PA: `${d} cm`, PB: '?' } }), unit: 'cm', expr: String(d) });
    }
    const L2 = r.int(4, 30) * 2;
    return num(L2 / 2, [
      St('The perpendicular bisector crosses AB at its midpoint M, so AM and MB are equal.', perpBisFig(2, { labels: { AB: '' } })),
      St(`AM = ${L2} ÷ 2 = ${L2 / 2}.`, perpBisFig(2, { labels: { AM: `${L2 / 2} cm` } })),
      St(`So AM = ${L2 / 2} cm.`)], { q: `The perpendicular bisector of AB crosses it at M. AB = ${L2} cm. How long is AM?`, visual: perpBisFig(2), unit: 'cm', expr: `${L2}/2` });
  }
  if (v === 5) {
    const s = r.int(3, 15), ask = r.pick(['perimeter', 'angle']);
    if (ask === 'angle') return num(60, [
      St('Both arcs have radius AB, so AC = BC = AB: all three sides are equal.', equiFig(2, `${s} cm`)),
      St('Equal sides give equal angles, and the three add to 180°: 180 ÷ 3 = 60.'),
      St('So each angle is 60°.')], { q: `An equilateral triangle ABC is constructed on AB = ${s} cm using arcs of radius AB. What does each of its angles measure?`, visual: equiFig(1, `${s} cm`), unit: '°', expr: '180/3' });
    return num(3 * s, [
      St('Both arcs have radius AB, so AC = BC = AB: all three sides are equal.', equiFig(2, `${s} cm`)),
      St(`Perimeter = 3 × ${s} = ${3 * s}.`),
      St(`So the perimeter is ${3 * s} cm.`)], { q: `A triangle ABC is constructed on AB = ${s} cm using arcs of radius AB from A and B. What is its perimeter?`, visual: equiFig(1, `${s} cm`), unit: 'cm', expr: `3*${s}` });
  }
  const R = r.int(2, 12);
  return num(6 * R, [
    St('The compass stays set to the radius, so each side of the hexagon equals the radius.', hexFig(2, `${R} cm`)),
    St(`Perimeter = 6 × ${R} = ${6 * R}.`),
    St(`So the perimeter is ${6 * R} cm.`)], { q: `A regular hexagon is constructed inside a circle of radius ${R} cm by stepping round it with the compass set to the radius. What is the hexagon's perimeter?`, visual: hexFig(1, `${R} cm`), unit: 'cm', expr: `6*${R}` });
}

// ───────── three-dimensional figures ─────────
const SOLIDS = {
  'cube': () => G.boxFig({ l: 1, w: 1, h: 1, cubes: true, W: 220, H: 190 }),
  'rectangular prism': () => G.boxFig({ l: 7, w: 3, h: 4, W: 230, H: 190 }),
  'triangular prism': () => G.prismFig({ base: [[0, 0], [5, 0], [2, 4]], depth: 6, W: 230, H: 190 }),
  'pentagonal prism': () => G.prismFig({ base: G.regular(5, 2.6), depth: 5, W: 230, H: 190 }),
  'hexagonal prism': () => G.prismFig({ base: G.regular(6, 2.6), depth: 5, W: 230, H: 190 }),
  'cylinder': () => G.cylinderFig({ r: 3, h: 5, W: 210, H: 190 }),
  'cone': () => G.coneFig({ r: 3, h: 6, W: 210, H: 190 }),
  'square pyramid': () => G.pyramidFig({ a: 5, h: 6, W: 220, H: 190 }),
  'triangular pyramid': () => G.pyramidFig({ a: 5, h: 6, tri: true, W: 220, H: 190 }),
  'sphere': () => G.sphereFig({ W: 200, H: 190 }),
};
const BASES = { 'triangular prism': ['2 triangles', ['1 triangle', '3 rectangles', '2 rectangles']], 'rectangular prism': ['2 rectangles', ['1 rectangle', '4 rectangles', '2 triangles']], 'cylinder': ['2 circles', ['1 circle', '2 rectangles', '1 rectangle']], 'cone': ['1 circle', ['2 circles', '1 triangle', '2 triangles']], 'square pyramid': ['1 square', ['2 squares', '4 triangles', '1 triangle']], 'pentagonal prism': ['2 pentagons', ['1 pentagon', '5 rectangles', '2 rectangles']], 'hexagonal prism': ['2 hexagons', ['1 hexagon', '6 rectangles', '2 rectangles']], 'triangular pyramid': ['1 triangle', ['2 triangles', '3 rectangles', '1 square']] };
const NETS = {
  'cube': () => G.netFig({ cells: G.CUBE_NETS[5] }),
  'cylinder': () => G.cylinderNet(),
  'square pyramid': () => G.pyramidNet(),
  'triangular prism': () => G.triPrismNet(),
  'cone': () => G.coneNet(),
  'rectangular prism': () => G.boxNet({ l: 6, w: 3, h: 4 }),
};
const NET_SAY = { 'cube': '6 equal squares', 'cylinder': '2 circles and a rectangle', 'square pyramid': '1 square and 4 triangles', 'triangular prism': '2 triangles and 3 rectangles', 'cone': 'a circle and a curved fan shape', 'rectangular prism': '6 rectangles, in 3 matching pairs' };
const SLICES = [['box', 'across', 'rectangle'], ['box', 'down', 'rectangle'], ['cube', 'across', 'square'], ['cylinder', 'across', 'circle'], ['cylinder', 'down', 'rectangle'], ['cone', 'across', 'circle'], ['cone', 'down', 'triangle'], ['pyramid', 'across', 'square'], ['pyramid', 'down', 'triangle'], ['sphere', 'across', 'circle']];
const SOLID_WORD = { box: 'rectangular prism', cube: 'cube', cylinder: 'cylinder', cone: 'cone', pyramid: 'square pyramid', sphere: 'sphere' };
export function solids(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const s = r.pick(Object.keys(BASES)), [right, wrongs] = BASES[s], pic = SOLIDS[s]();
    return mc(r, right, wrongs, { q: `This is ${an(s)} ${s}. How many bases does it have, and what shape are they?`, visual: pic, steps: [
      St(/prism|cylinder/.test(s) ? 'Prisms and cylinders have 2 matching bases, one at each end, joined by the other faces.' : 'Pyramids and cones have just 1 base; the other faces meet at a point.', pic),
      St(`So ${an(s)} ${s} has ${right}.`)] });
  }
  if (v === 1) {
    const right = r.pick(Object.keys(NETS));
    return mc(r, right, r.shuffle(Object.keys(NETS).filter((x) => x !== right)).slice(0, 3), { q: 'This net folds up into which solid?', visual: NETS[right](), steps: [
      St(`The pieces of a net become the faces of the solid. This net has ${NET_SAY[right]}.`, NETS[right]()),
      St(`Folded up, it makes ${an(right)} ${right}.`, SOLIDS[right]())] });
  }
  if (v === 2) {
    const prism = r.bool(), n = prism ? r.int(3, 8) : r.pick([3, 4]), [what, val] = r.pick(prism ? [['faces', n + 2], ['edges', 3 * n], ['vertices', 2 * n]] : [['faces', n + 1], ['edges', 2 * n], ['vertices', n + 1]]);
    const bname = { 3: 'triangular', 4: n === 4 && !prism ? 'square' : 'rectangular', 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octagonal' }[n];
    const pic = prism ? (n === 4 ? G.boxFig({ l: 6, w: 3, h: 4 }) : G.prismFig({ base: G.regular(n, 3), depth: 5 })) : G.pyramidFig({ a: 5, h: 6, tri: n === 3 });
    const why = prism ? { faces: `2 bases + ${n} rectangles = ${n + 2}`, edges: `${n} round each base + ${n} joining them = ${3 * n}`, vertices: `${n} on each base: 2 × ${n} = ${2 * n}` }[what] : { faces: `1 base + ${n} triangles = ${n + 1}`, edges: `${n} round the base + ${n} up to the top = ${2 * n}`, vertices: `${n} on the base + 1 at the top = ${n + 1}` }[what];
    return num(val, [
      St(`The base is ${an(bname)} ${bname === 'rectangular' || bname === 'square' ? (bname === 'square' ? 'square' : 'rectangle') : PN[n]}, with ${n} sides. Dashed edges are at the back, hidden from view.`, pic),
      St(`${why}.`),
      St(`So it has ${val} ${what}.`)], { q: `How many ${what} does this ${bname} ${prism ? 'prism' : 'pyramid'} have?`, visual: pic, expr: String(val) });
  }
  if (v === 3) {
    const [s, view, right] = r.pick([['cylinder', 'top', 'circle'], ['cylinder', 'front', 'rectangle'], ['cone', 'front', 'triangle'], ['cone', 'top', 'circle'], ['square pyramid', 'top', 'square'], ['square pyramid', 'front', 'triangle'], ['cube', 'side', 'square'], ['sphere', 'front', 'circle'], ['rectangular prism', 'front', 'rectangle']]);
    return mc(r, right, ['circle', 'rectangle', 'triangle', 'square'].filter((x) => x !== right), { q: `This ${s} sits on a table. What shape is its ${view} view?`, visual: SOLIDS[s](), steps: [
      St(`Imagine looking straight at it from the ${view === 'top' ? 'top, looking down' : view} and tracing its outline.`, SOLIDS[s]()),
      St(`You see ${an(right)} ${right}.`)] });
  }
  if (v === 4) {
    const [solid, cut, right] = r.pick(SLICES), pic = G.sliceFig({ solid, cut });
    return mc(r, right, ['circle', 'rectangle', 'triangle', 'square'].filter((x) => x !== right), { q: `A ${SOLID_WORD[solid]} is sliced as shown. What shape is the cross-section (the yellow face)?`, visual: pic, steps: [
      St(`The cross-section is the flat face left by the cut. This cut goes ${cut === 'across' ? 'straight across, parallel to the base' : 'straight down through the top'}.`, pic),
      St(`The face is ${an(right)} ${right}.`)] });
  }
  if (v === 5) {
    const right = r.pick(Object.keys(SOLIDS)), wrongs = r.shuffle(Object.keys(SOLIDS).filter((x) => x !== right && !(right.includes('prism') && x.includes('prism') && r.bool(0.5)))).slice(0, 3);
    return mc(r, right, wrongs, { q: 'What is the name of this solid?', visual: SOLIDS[right](), steps: [
      St(right === 'sphere' ? 'It is perfectly round, like a ball, with no flat faces.' : right === 'cylinder' ? 'It has 2 circle bases joined by one curved surface.' : right === 'cone' ? 'It has 1 circle base and a curved surface up to a point.' : /pyramid/.test(right) ? 'It has 1 flat base and triangles that meet at a point at the top.' : 'It has 2 matching flat bases joined by rectangles: it is a prism, named after its base.'),
      St(`So it is ${an(right)} ${right}.`)] });
  }
  if (v === 6) {
    const k = r.int(0, G.CUBE_NETS.length - 1), yes = G.netFig({ cells: G.CUBE_NETS[k] });
    const nos = r.shuffle(G.NOT_CUBE_NETS).slice(0, 3).map((cells) => G.netFig({ cells }));
    return pickFig(r, 'Which of these nets folds up into a cube?', yes, nos, (c) => [
      St('A cube has 6 faces, so a cube net has 6 squares. When folded, no two squares may land on the same face, and none may be left open.'),
      St(`Fold each one in your head: only net ${c} covers all 6 faces exactly once.`, yes)]);
  }
  const n = r.int(3, 8), F = n + 2, V = 2 * n, E = 3 * n, pic = n === 4 ? G.boxFig({ l: 6, w: 3, h: 4 }) : G.prismFig({ base: G.regular(n, 3), depth: 5 });
  return num(E, [
    St('For any solid with flat faces, Euler’s formula says F + V − E = 2 (faces + vertices − edges).', pic),
    St(`${F} + ${V} − E = 2, so E = ${F + V} − 2 = ${E}.`),
    St(`So it has ${E} edges.`)], { q: `This prism has ${F} faces and ${V} vertices. Use F + V − E = 2 to find how many edges it has.`, visual: pic, expr: `${F}+${V}-2` });
}

// ───────── area of polygons ─────────
// display lengths in proportion, but never too thin to read
const disp = (a, b) => { const [x, y] = G.squash([a, b], 0.4, 0.8); return [x * 10, y * 10]; };
export function area(r) {
  const v = r.int(0, 7), u = r.pick(['cm', 'cm', 'm']);
  if (v === 0) {
    const b = r.int(3, 20), h = r.int(2, 15), [B, H] = disp(b, h);
    const pic = (hl) => polygonFig({ pts: [[0, 0], [B, 0], [B, H], [0, H]], sides: [`${b} ${u}`, `${h} ${u}`, '', ''], right: [0, 1, 2, 3], hl });
    return num(b * h, [
      St(`A rectangle is rows of unit squares: ${h} rows of ${b}. So A = length × width.`, pic([{ side: 0 }, { side: 1 }])),
      St(`A = ${b} × ${h} = ${b * h}.`, pic('fill')),
      St(`So the area is ${b * h} ${u}².`)], { q: `What is the area of this rectangle, in ${u}²?`, visual: pic(), unit: `${u}²`, expr: `${b}*${h}` });
  }
  if (v === 1) {
    const b = r.int(5, 18), h = r.int(3, 12), off = r.int(2, 5), s = R1(Math.hypot(off, h)), [B, H] = disp(b, h), O = (off / b) * B;
    const pic = (hl) => polygonFig({ pts: [[0, 0], [B, 0], [B + O, H], [O, H]], sides: [`${b} ${u}`, `${dec(s)} ${u}`, '', ''], base: 0, height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 2, 1, 2], hl });
    return num(b * h, [
      St('Cut the triangle off one end and slide it to the other end: the parallelogram becomes a rectangle. So A = base × height.', pic(['base', 'height'])),
      St(`Use the height at right angles to the base (${h} ${u}), not the slanted side (${dec(s)} ${u}): A = ${b} × ${h} = ${b * h}.`),
      St(`So the area is ${b * h} ${u}².`)], { q: `What is the area of this parallelogram, in ${u}²?`, visual: pic(), unit: `${u}²`, expr: `${b}*${h}` });
  }
  if (v === 2) {
    const b = r.int(3, 24), h = r.int(2, 18), A = (b * h) / 2, [B, H] = disp(b, h), apex = B * r.pick([0.2, 0.35, 0.5, 0.7, 1, 1.25]);
    const pic = (hl) => polygonFig({ pts: [[0, 0], [B, 0], [apex, H]], sides: [`${b} ${u}`, '', ''], base: 0, height: { from: 2, side: 0, label: `${h} ${u}` }, hl, right: apex === B ? [1] : [] });
    return num(dec(A), [
      St('Two copies of a triangle make a parallelogram, so a triangle is half of one: A = base × height ÷ 2. The height is at right angles to the base.', pic(['base', 'height'])),
      St(`A = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = ${dec(A)}.`),
      St(`So the area is ${dec(A)} ${u}².`)], { q: `What is the area of this triangle, in ${u}²?`, visual: pic(), unit: `${u}²`, expr: `${b}*${h}/2` });
  }
  if (v === 3) {
    const a = r.int(3, 12), b = a + r.int(2, 10), h = r.int(2, 12), A = ((a + b) * h) / 2, [B, H] = disp(b, h), Lf = ((b - a) / b) * B * r.pick([0.3, 0.5, 0.7]);
    const pic = (hl) => polygonFig({ pts: [[0, 0], [B, 0], [Lf + (a / b) * B, H], [Lf, H]], sides: [`${b} ${u}`, '', `${a} ${u}`, ''], height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 0, 1, 0], hl });
    return num(dec(A), [
      St(`The parallel sides are ${a} and ${b}. Add them: ${a} + ${b} = ${a + b}.`, pic([{ side: 0 }, { side: 2 }])),
      St(`A = (a + b) ÷ 2 × h = ${a + b} ÷ 2 × ${h} = ${dec((a + b) / 2)} × ${h} = ${dec(A)}.`, pic(['height'])),
      St(`So the area is ${dec(A)} ${u}².`)], { q: `What is the area of this trapezoid, in ${u}²?`, visual: pic(), unit: `${u}²`, expr: `(${a}+${b})/2*${h}` });
  }
  if (v === 4) {
    // work backwards: the height of a triangle or the width of a rectangle from the area
    const tri = r.bool(), b = r.int(4, 16), h = r.int(3, 14), A = tri ? (b * h) / 2 : b * h, [B, H] = disp(b, h);
    const pic = (lab, hl) => (tri ? polygonFig({ pts: [[0, 0], [B, 0], [B * 0.35, H]], sides: [`${b} ${u}`, '', ''], base: 0, height: { from: 2, side: 0, label: lab }, hl }) : polygonFig({ pts: [[0, 0], [B, 0], [B, H], [0, H]], sides: [`${b} ${u}`, lab, '', ''], right: [0, 1, 2, 3], hl }));
    return num(h, tri ? [
      St(`A = base × height ÷ 2, so base × height = 2 × ${dec(A)} = ${b * h}.`, pic('h', ['base'])),
      St(`h = ${b * h} ÷ ${b} = ${h}.`, pic(`${h} ${u}`, ['height'])),
      St(`So the height is ${h} ${u}.`)] : [
      St(`A = length × width, so width = area ÷ length.`, pic('w', [{ side: 0 }])),
      St(`w = ${A} ÷ ${b} = ${h}.`, pic(`${h} ${u}`, [{ side: 1 }])),
      St(`So the width is ${h} ${u}.`)], { q: tri ? `This triangle has an area of ${dec(A)} ${u}². What is its height h, in ${u}?` : `This rectangle has an area of ${A} ${u}². What is its width w, in ${u}?`, visual: pic(tri ? 'h' : 'w'), unit: u, expr: tri ? `2*${dec(A)}/${b}` : `${A}/${b}` });
  }
  if (v === 5) {
    const [p, q] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), [s, t] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), w1 = r.int(2, 5), w2 = r.int(1, w1), n1 = w1 * q + p, n2 = w2 * t + s;
    const m = (w, a, b) => `${w} ${a}/${b}`, [B, H] = disp(n1 / q, n2 / t);
    const pic = (hl) => polygonFig({ pts: [[0, 0], [B, 0], [B, H], [0, H]], sides: [`${m(w1, p, q)} m`, `${m(w2, s, t)} m`, '', ''], right: [0, 1, 2, 3], hl });
    const [an1, ad] = [n1 * n2, q * t], whole = Math.floor(an1 / ad), rest = frac(an1 - whole * ad, ad);
    return num(frac(an1, ad), [
      St(`A = length × width. Change the mixed numbers to improper fractions: ${m(w1, p, q)} = ${n1}/${q} and ${m(w2, s, t)} = ${n2}/${t}.`, pic([{ side: 0 }, { side: 1 }])),
      St(`${n1}/${q} × ${n2}/${t} = ${an1}/${ad}.`, pic('fill')),
      St(`So the area is ${frac(an1, ad)} m²${rest !== '0' ? `, which is ${whole} ${rest} m²` : ''}.`)], { q: 'What is the area of this rectangular rug, in m²?', visual: pic(), unit: 'm²', expr: `${n1}/${q}*${n2}/${t}` });
  }
  if (v === 6) {
    const Lg = r.int(5, 25), W = r.int(3, 15), c = r.pick([4, 5, 8, 12, 15]), P = 2 * (Lg + W), [B, H] = disp(Lg, W);
    const pic = (hl) => polygonFig({ pts: [[0, 0], [B, 0], [B, H], [0, H]], sides: [`${Lg} m`, `${W} m`, '', ''], right: [0, 1, 2, 3], hl });
    return num(P * c, [
      St(`The fence goes all the way round: the perimeter. Opposite sides are equal, so P = 2 × (${Lg} + ${W}) = ${P} m.`, pic([{ side: 0 }, { side: 1 }, { side: 2 }, { side: 3 }])),
      St(`Cost = ${P} × $${c} = $${P * c}.`),
      St(`So the fence costs $${P * c}.`)], { q: `Fencing costs $${c} per metre. How much does it cost to fence all the way round this garden, in dollars?`, visual: pic(), unit: '$', expr: `2*(${Lg}+${W})*${c}` });
  }
  // a right triangle: the two short sides are base and height
  const b = r.int(3, 16), h = r.int(3, 16), [B, H] = disp(b, h), hyp = dec(R1(Math.hypot(b, h)));
  const pic = (hl) => polygonFig({ pts: [[0, 0], [B, 0], [0, H]], sides: [`${b} ${u}`, `${hyp} ${u}`, `${h} ${u}`], right: [0], hl });
  return num(dec((b * h) / 2), [
    St(`In a right triangle the two sides that meet at the right angle are a base and its height. The longest side (${hyp} ${u}) is not used.`, pic([{ side: 0 }, { side: 2 }])),
    St(`A = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = ${dec((b * h) / 2)}.`),
    St(`So the area is ${dec((b * h) / 2)} ${u}².`)], { q: `What is the area of this right triangle, in ${u}²?`, visual: pic(), unit: `${u}²`, expr: `${b}*${h}/2` });
}

// ───────── circles ─────────
// a sector (or half or quarter circle) drawn to scale, with its radius and angle labelled
export function sectorFig({ deg, rLabel = '', aLabel = '', hl = null, start = null, W = 250, H = 200 }) {
  const st = start ?? (deg === 180 ? 0 : deg === 90 ? 0 : 90 - deg / 2 + (deg > 180 ? 180 : 0));
  const model = [[0, 0]]; for (let k = 0; k <= 24; k++) model.push(dir(st + (deg * k) / 24));
  const F = frame(model, { W, H, pad: 30 }), c = F.m([0, 0]), R = F.s, p = (a) => F.m(dir(a));
  const items = [path(`M${c.map(R1).join(' ')}L${p(st).map(R1).join(' ')}A${R1(R)} ${R1(R)} 0 ${deg > 180 ? 1 : 0} 0 ${p(st + deg).map(R1).join(' ')}Z`, hl === 'fill' ? 'hl' : 'fig')];
  if (hl === 'arc') items.push(arcD(c, R, st, st + deg, 'hlline'));
  if (hl === 'radii') items.push(line(c, p(st), 'hlline'), line(c, p(st + deg), 'hlline'));
  if (deg !== 180 && deg !== 90) {
    const mr = deg > 200 ? 18 : 22; items.push(arcD(c, mr, st, st + deg, 'mark'));
    if (aLabel) items.push(text(add(c, mulv([Math.cos(rad(st + deg / 2)), -Math.sin(rad(st + deg / 2))], mr + 18)), aLabel, 'hl'));
  } else if (deg === 90) items.push(rightMark(c, p(st), p(st + 90), 12));
  if (rLabel) items.push(sideLabel(c, p(st), rLabel, F.m(mulv(dir(st + Math.min(deg, 120) / 2), 0.5)), hl === 'radii' ? 'hl' : 'ink'));
  items.push(dot(c));
  return fig(items, W, H);
}
export function circleParts(r) {
  const v = r.int(0, 7);
  if (v === 0 || v === 1) {
    const area = v === 1, R = r.int(2, 12), useD = r.bool(), d = 2 * R;
    const pic = (hl) => G.circleFig({ show: useD ? 'diameter' : 'radius', r: `${R} cm`, d: `${d} cm`, hl });
    if (area) {
      const val = 3.14 * R * R;
      return num(D2(val), [
        St(useD ? `The diameter is ${d} cm, so the radius is half of it: ${d} ÷ 2 = ${R} cm.` : `The radius, from the centre to the edge, is ${R} cm.`, pic(useD ? 'diameter' : 'radius')),
        St(`A = π × r² ≈ 3.14 × ${R}² = 3.14 × ${R * R}.`, pic('fill')),
        St(`3.14 × ${R * R} = ${D2(val)}, so the area is ${D2(val)} cm².`)], { q: 'Using π ≈ 3.14, what is the area of this circle, in cm²?', visual: pic(), ...PI_TOL, expr: `3.14*${R}**2` });
    }
    const val = 3.14 * d;
    return num(D2(val), [
      St(useD ? `The diameter, all the way across through the centre, is ${d} cm.` : `The radius is ${R} cm, so the diameter is twice that: ${d} cm.`, pic(useD ? 'diameter' : 'radius')),
      St(`C = π × d ≈ 3.14 × ${d}.`),
      St(`3.14 × ${d} = ${D2(val)}, so the circumference is ${D2(val)} cm.`)], { q: 'Using π ≈ 3.14, what is the circumference of this circle, in cm?', visual: pic(), ...PI_TOL, expr: `3.14*${d}` });
  }
  if (v === 2) {
    const d = 2 * r.int(2, 10), R = d / 2, ar = r.bool(), val = ar ? (3.14 * R * R) / 2 : (3.14 * d) / 2 + d;
    const pic = (hl) => fig([...sectorFig({ deg: 180, hl }).items, text([125, 172], `${d} cm`, 'ink')], 250, 200);
    return num(D2(val), ar ? [
      St(`A semicircle is half a circle. Its straight side is the diameter, ${d} cm, so the radius is ${R} cm.`, pic('radii')),
      St(`Area = 3.14 × ${R}² ÷ 2 = 3.14 × ${R * R} ÷ 2.`, pic('fill')),
      St(`That is ${D2(val)}, so the area is ${D2(val)} cm².`)] : [
      St(`The curved part is half the circumference: 3.14 × ${d} ÷ 2 = ${D2((3.14 * d) / 2)}.`, pic('arc')),
      St(`Add the straight side, the diameter: ${D2((3.14 * d) / 2)} + ${d} = ${D2(val)}.`, pic('radii')),
      St(`So the perimeter is ${D2(val)} cm.`)], { q: `This semicircle has a diameter of ${d} cm. Using π ≈ 3.14, what is its ${ar ? 'area, in cm²' : 'perimeter, in cm'}?`, visual: pic(), ...PI_TOL, expr: ar ? `3.14*${R}*${R}/2` : `3.14*${d}/2+${d}` });
  }
  if (v === 3) {
    const R = r.int(2, 12), ar = r.bool(), val = ar ? (3.14 * R * R) / 4 : (3.14 * 2 * R) / 4 + 2 * R;
    const pic = (hl) => sectorFig({ deg: 90, rLabel: `${R} cm`, hl });
    return num(D2(val), ar ? [
      St('A quarter circle is 1/4 of a whole circle (the corner is a right angle).', pic(null)),
      St(`Area = 3.14 × ${R}² ÷ 4 = 3.14 × ${R * R} ÷ 4.`, pic('fill')),
      St(`That is ${D2(val)}, so the area is ${D2(val)} cm².`)] : [
      St(`The curved part is 1/4 of the circumference: 3.14 × ${2 * R} ÷ 4 = ${D2((3.14 * 2 * R) / 4)}.`, pic('arc')),
      St(`Add the two straight radii: ${D2((3.14 * 2 * R) / 4)} + ${R} + ${R} = ${D2(val)}.`, pic('radii')),
      St(`So the perimeter is ${D2(val)} cm.`)], { q: `This quarter circle has a radius of ${R} cm. Using π ≈ 3.14, what is its ${ar ? 'area, in cm²' : 'perimeter, in cm'}?`, visual: pic(), ...PI_TOL, expr: ar ? `3.14*${R}*${R}/4` : `3.14*2*${R}/4+2*${R}` });
  }
  const R = r.int(2, 12), th = r.pick([30, 45, 60, 120, 135, 150, 240, 270]);
  if (v === 4) {
    const val = (th / 360) * 3.14 * R * R, pic = (hl) => sectorFig({ deg: th, rLabel: `${R} cm`, aLabel: `${th}°`, hl });
    return num(D2(val), [
      St(`The sector is ${th}° out of the full 360°: ${th}/360 = ${frac(th, 360)} of the circle.`, pic(null)),
      St(`Area = ${frac(th, 360)} × 3.14 × ${R}² = ${frac(th, 360)} × ${D2(3.14 * R * R)}.`, pic('fill')),
      St(`That is ${D2(val)}, so the area is ${D2(val)} cm².`)], { q: `Using π ≈ 3.14, what is the area of this sector, in cm²?`, visual: pic(), ...PI_TOL, expr: `${th}/360*3.14*${R}*${R}` });
  }
  if (v === 5) {
    const val = (th / 360) * 2 * 3.14 * R, pic = (hl) => sectorFig({ deg: th, rLabel: `${R} cm`, aLabel: `${th}°`, hl });
    return num(D2(val), [
      St(`The arc is ${th}/360 = ${frac(th, 360)} of the whole circumference.`, pic('arc')),
      St(`Circumference = 2 × 3.14 × ${R} = ${D2(6.28 * R)}. Then ${frac(th, 360)} × ${D2(6.28 * R)} = ${D2(val)}.`),
      St(`So the arc is ${D2(val)} cm long.`)], { q: `Using π ≈ 3.14, how long is the curved arc of this sector, in cm?`, visual: pic(), ...PI_TOL, expr: `${th}/360*2*3.14*${R}` });
  }
  if (v === 6) {
    const d = r.int(2, 30), C = D2(3.14 * d), radius = r.bool();
    const pic = (hl, lab) => fig([...G.circleFig({ show: 'diameter', d: lab, hl }).items, text([130, 18], `C = ${C} cm`, 'hl')], 260, 220);
    return num(radius ? dec(d / 2) : d, [
      St('C = π × d, so d = C ÷ π.', pic(null, 'd')),
      St(`d = ${C} ÷ 3.14 = ${d}.${radius ? ` The radius is half: ${d} ÷ 2 = ${dec(d / 2)}.` : ''}`, pic('diameter', `${d} cm`)),
      St(`So the ${radius ? `radius is ${dec(d / 2)}` : `diameter is ${d}`} cm.`)], { q: `A circle has a circumference of ${C} cm. Using π ≈ 3.14, what is its ${radius ? 'radius' : 'diameter'}, in cm?`, visual: pic(null, 'd'), ...PI_TOL, expr: radius ? `${C}/3.14/2` : `${C}/3.14` });
  }
  const d = r.int(50, 70), n = 10 * r.int(1, 5), val = (3.14 * d * n) / 100;
  return num(D2(val), [
    St(`One full turn rolls the wheel along one circumference: 3.14 × ${d} = ${D2(3.14 * d)} cm.`, G.circleFig({ show: 'diameter', d: `${d} cm`, hl: 'diameter' })),
    St(`${n} turns: ${D2(3.14 * d)} × ${n} = ${D2(3.14 * d * n)} cm. Divide by 100 for metres: ${D2(val)} m.`),
    St(`So the bike travels ${D2(val)} m.`)], { q: `A bike wheel has a diameter of ${d} cm. How many metres does the bike travel when the wheel turns ${n} times? Use π ≈ 3.14.`, visual: G.circleFig({ show: 'diameter', d: `${d} cm` }), ...PI_TOL, expr: `3.14*${d}*${n}/100` });
}

// ───────── compound figures and scale ─────────
export function compoundArea(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    // a rink: a rectangle with a semicircle on one end
    const Lg = r.int(6, 20), W = 2 * r.int(2, 6), R = W / 2, semi = (3.14 * R * R) / 2, val = Lg * W + semi, [B, Hh] = disp(Lg, W);
    const arc = Array.from({ length: 13 }, (_, i) => [B + (Hh / 2) * Math.sin((i * Math.PI) / 12), Hh / 2 - (Hh / 2) * Math.cos((i * Math.PI) / 12)]);
    const pts = [[0, 0], ...arc, [0, Hh]];
    const pic = (hl) => polygonFig({ pts, sides: [`${Lg} m`, ...Array(13).fill(''), `${W} m`], cuts: [[[B, 0], [B, Hh]]], regions: hl ? [{ pts: [[0, 0], [B, 0], [B, Hh], [0, Hh]], t: 'hl', label: hl === 1 ? `${Lg * W}` : '' }, ...(hl === 2 ? [{ pts: arc, t: 'hl2' }] : [])] : [] });
    return num(D2(val), [
      St(`Split it into a rectangle and a semicircle. Rectangle: ${Lg} × ${W} = ${Lg * W} m².`, pic(1)),
      St(`The semicircle's diameter is ${W} m, so its radius is ${R} m. Half a circle: 3.14 × ${R}² ÷ 2 = ${D2(semi)} m².`, pic(2)),
      St(`Add: ${Lg * W} + ${D2(semi)} = ${D2(val)}.`),
      St(`So the area is ${D2(val)} m².`)], { q: 'A rink is a rectangle with a semicircle on one end. Using π ≈ 3.14, what is its area, in m²?', visual: pic(0), ...PI_TOL, expr: `${Lg}*${W}+3.14*${R}**2/2` });
  }
  if (v === 1) {
    const Lg = r.int(4, 16), H = r.int(3, 10), T = r.int(2, 8), val = Lg * H + (Lg * T) / 2, [B, Hd] = disp(Lg, H), Td = (T / H) * Hd;
    const pts = [[0, 0], [B, 0], [B, Hd], [B / 2, Hd + Td], [0, Hd]];
    const pic = (hl) => polygonFig({ pts, sides: [`${Lg} m`, `${H} m`, '', '', ''], right: [0, 1], cuts: [[[0, Hd], [B, Hd]]], extra: [[B / 2 + 1, Hd + Td]], notes: [{ at: [B / 2 + 0.25 * Math.max(1, B / 6), Hd + Td / 2], s: `${T} m`, t: hl === 2 ? 'hl' : 'ink' }], regions: hl === 1 ? [{ pts: pts.slice(0, 3).concat([[0, Hd]]), t: 'hl', label: `${Lg * H}` }] : hl === 2 ? [{ pts: [[0, Hd], [B, Hd], [B / 2, Hd + Td]], t: 'hl2' }] : [] });
    return num(dec(val), [
      St(`Split the front into a rectangle and a triangle. Rectangle: ${Lg} × ${H} = ${Lg * H} m².`, pic(1)),
      St(`Triangle roof: base ${Lg} m, height ${T} m. ${Lg} × ${T} ÷ 2 = ${dec((Lg * T) / 2)} m².`, pic(2)),
      St(`Add: ${Lg * H} + ${dec((Lg * T) / 2)} = ${dec(val)}.`),
      St(`So the area of the front is ${dec(val)} m².`)], { q: `The front of a shed is a rectangle with a triangle roof that is ${T} m tall. What is the area of the front, in m²?`, visual: pic(0), unit: 'm²', expr: `${Lg}*${H}+${Lg}*${T}/2` });
  }
  if (v === 2) {
    const s = 2 * r.int(2, 10), cA = 3.14 * (s / 2) ** 2, val = s * s - cA;
    return num(D2(val), [
      St(`The square: ${s} × ${s} = ${s * s} cm².`, G.circleFig({ square: true, shade: 'outside', show: 'none', side: `${s} cm` })),
      St(`The circle fits exactly, so its diameter is ${s} and its radius is ${s / 2}. Circle: 3.14 × ${s / 2}² = ${D2(cA)} cm².`, G.circleFig({ square: true, show: 'radius', r: `${s / 2}`, hl: ['fill', 'radius'] })),
      St(`Take the circle away: ${s * s} − ${D2(cA)} = ${D2(val)}.`),
      St(`So the shaded area is ${D2(val)} cm².`)], { q: 'A circle fits exactly inside this square. Using π ≈ 3.14, what is the shaded area, in cm²?', visual: G.circleFig({ square: true, shade: 'outside', show: 'none', side: `${s} cm` }), ...PI_TOL, expr: `${s}**2-3.14*(${s}/2)**2` });
  }
  if (v === 3) {
    // a path around the inside edge of a yard
    const Lg = r.int(8, 20), W = r.int(6, 14), p = r.int(1, 2), inner = (Lg - 2 * p) * (W - 2 * p), val = Lg * W - inner;
    const pic = (hl) => polygonFig({ pts: [[0, 0], [Lg, 0], [Lg, W], [0, W]], holes: [[[p, p], [Lg - p, p], [Lg - p, W - p], [p, W - p]]], shade: true, sides: [`${Lg} m`, `${W} m`, '', ''], notes: [{ at: [Lg / 2, W / 2], s: hl === 'in' ? `${Lg - 2 * p} × ${W - 2 * p}` : 'lawn', t: hl === 'in' ? 'hl' : 'muted' }] });
    return num(val, [
      St(`The whole yard: ${Lg} × ${W} = ${Lg * W} m².`, pic(null)),
      St(`The lawn in the middle is ${p} m shorter at each end: ${Lg} − ${2 * p} = ${Lg - 2 * p} by ${W} − ${2 * p} = ${W - 2 * p}. Its area is ${inner} m².`, pic('in')),
      St(`Path = ${Lg * W} − ${inner} = ${val}.`),
      St(`So the path is ${val} m².`)], { q: `A path ${p} m wide runs all around the inside edge of this yard (shaded), with lawn in the middle. What is the area of the path, in m²?`, visual: pic(null), unit: 'm²', expr: `${Lg}*${W}-(${Lg}-${2 * p})*(${W}-${2 * p})` });
  }
  if (v === 4) {
    // enlarge a rectangle by k: perimeter × k, area × k²
    const k = r.int(2, 3), a = r.int(2, 6), b = r.int(2, 6), ask = r.pick(['perimeter', 'area']), val = ask === 'area' ? a * b * k * k : 2 * (a + b) * k;
    const pic = (lab2) => multiPoly([{ pts: [[0, 0], [a, 0], [a, b], [0, b]], sides: [`${a} cm`, `${b} cm`, '', ''], cap: 'before' }, { pts: [[a + 2, 0], [a + 2 + a * k, 0], [a + 2 + a * k, b * k], [a + 2, b * k]], sides: lab2 ? [`${a * k} cm`, `${b * k} cm`, '', ''] : [], cap: `× ${k}` }], { H: 220 });
    return num(val, ask === 'area' ? [
      St(`Every length is ${k} times as long: ${a * k} cm by ${b * k} cm.`, pic(true)),
      St(`New area = ${a * k} × ${b * k} = ${val}. (That is ${k}² = ${k * k} times the old area of ${a * b} cm².)`),
      St(`So the new area is ${val} cm².`)] : [
      St(`Every length is ${k} times as long: ${a * k} cm by ${b * k} cm.`, pic(true)),
      St(`New perimeter = 2 × (${a * k} + ${b * k}) = ${val}. (That is ${k} times the old perimeter of ${2 * (a + b)} cm.)`),
      St(`So the new perimeter is ${val} cm.`)], { q: `A ${a} cm by ${b} cm rectangle is enlarged so every length is ${k} times as long. What is the new ${ask}${ask === 'area' ? ', in cm²' : ', in cm'}?`, visual: pic(false), expr: ask === 'area' ? `${a * k}*${b * k}` : `2*(${a * k}+${b * k})` });
  }
  if (v === 5) {
    // an L shape: two rectangles
    const W = r.int(6, 12), H = r.int(6, 12), a = r.int(2, H - 3), c = r.int(2, W - 3), A1 = W * a, A2 = c * (H - a), val = A1 + A2;
    const pts = [[0, 0], [W, 0], [W, a], [c, a], [c, H], [0, H]];
    const base = { pts, sides: [`${W} m`, `${a} m`, `${W - c} m`, `${H - a} m`, `${c} m`, `${H} m`], right: [0, 1, 2, 4, 5] };
    return num(val, [
      St('Split the shape into two rectangles with a line across.', polygonFig({ ...base, cuts: [[[0, a], [c, a]]] })),
      St(`Bottom: ${W} × ${a} = ${A1} m². Top: ${c} × ${H - a} = ${A2} m².`, polygonFig({ ...base, regions: [{ pts: [[0, 0], [W, 0], [W, a], [0, a]], t: 'hl', label: `${A1}` }, { pts: [[0, a], [c, a], [c, H], [0, H]], t: 'hl2', label: `${A2}` }], cuts: [[[0, a], [c, a]]] })),
      St(`Add them: ${A1} + ${A2} = ${val}.`),
      St(`So the area is ${val} m².`)], { q: 'What is the area of this shape, in m²? (All the corners are right angles.)', visual: polygonFig(base), unit: 'm²', expr: `${A1}+${A2}` });
  }
  if (v === 6) {
    // a rectangle with a right triangle cut from one corner
    const W = r.int(8, 16), H = r.int(6, 12), a = r.int(2, W - 4), b = r.int(2, H - 3), cut = (a * b) / 2, val = W * H - cut;
    const pts = [[0, 0], [W, 0], [W, H - b], [W - a, H], [0, H]];
    const pic = (hl) => polygonFig({ pts, sides: [`${W} cm`, `${H - b} cm`, '', `${W - a} cm`, `${H} cm`], right: [0, 1, 4], extra: [[W, H]], cuts: hl ? [[[W - a, H], [W, H]], [[W, H], [W, H - b]]] : [], notes: hl ? [{ at: [W - a / 2, H + 0.6], s: `${a}`, t: 'hl' }, { at: [W + 0.7, H - b / 2], s: `${b}`, t: 'hl' }] : [], regions: hl === 2 ? [] : [] });
    return num(dec(val), [
      St(`Complete the rectangle: ${W} × ${H} = ${W * H} cm².`, pic(1)),
      St(`The missing corner is a right triangle with sides ${W} − ${W - a} = ${a} and ${H} − ${H - b} = ${b}: ${a} × ${b} ÷ 2 = ${dec(cut)} cm².`, pic(2)),
      St(`Take it away: ${W * H} − ${dec(cut)} = ${dec(val)}.`),
      St(`So the area is ${dec(val)} cm².`)], { q: 'A corner is cut off a rectangle, leaving this shape. What is its area, in cm²?', visual: pic(0), unit: 'cm²', expr: `${W}*${H}-${a}*${b}/2` });
  }
  // a scale drawing: 1 cm on the plan is k m in real life
  const k = r.pick([2, 3, 4, 5, 10]), a = r.int(2, 8), b = r.int(2, 6), ask = r.pick(['area', 'perimeter']), A = a * k, B = b * k, val = ask === 'area' ? A * B : 2 * (A + B);
  const pic = (real) => multiPoly([{ pts: [[0, 0], [a, 0], [a, b], [0, b]], sides: real ? [`${A} m`, `${B} m`, '', ''] : [`${a} cm`, `${b} cm`, '', ''], right: [0, 1, 2, 3] }], { W: 280, H: 190, notes: [{ at: [a / 2, b + 0.9], s: `Scale: 1 cm = ${k} m`, t: 'muted' }] });
  return num(val, [
    St(`Each 1 cm on the plan is ${k} m. Real length: ${a} × ${k} = ${A} m. Real width: ${b} × ${k} = ${B} m.`, pic(true)),
    St(ask === 'area' ? `Area = ${A} × ${B} = ${val}.` : `Perimeter = 2 × (${A} + ${B}) = ${val}.`),
    St(`So the real ${ask} is ${val} ${ask === 'area' ? 'm²' : 'm'}.`)], { q: `This plan of a room uses the scale 1 cm = ${k} m. What is the real ${ask} of the room, in ${ask === 'area' ? 'm²' : 'm'}?`, visual: pic(false), unit: ask === 'area' ? 'm²' : 'm', expr: ask === 'area' ? `${A}*${B}` : `2*(${A}+${B})` });
}

// ───────── volume ─────────
// a prism with a note written on its front (end) face
const withNote = (f, s) => { const fr = f.items.find((it) => it.k === 'poly' && (it.t === 'front' || it.t === 'hl')); if (fr) f.items.push(text(cen(fr.pts), s, fr.t === 'hl' ? 'hl' : 'ink')); return f; };
export function volume(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const l = r.int(2, 15), w = r.int(2, 12), h = r.int(2, 10) + r.pick([0, 0, 0.5]), B = l * w, val = B * h;
    const pic = (hl) => G.boxFig({ l, w, h, labels: [`${l} cm`, `${w} cm`, `${dec(h)} cm`], hl });
    return num(dec(val), [
      St(`The base (the bottom face) is ${l} × ${w} = ${B} cm²: that many unit cubes fit in one layer.`, pic(['base', 'length', 'width'])),
      St(`The height is ${dec(h)} cm, so there are ${dec(h)} layers: V = ${B} × ${dec(h)} = ${dec(val)}.`, pic(['height'])),
      St(`So the volume is ${dec(val)} cm³.`)], { q: 'What is the volume of this box, in cm³?', visual: pic(), unit: 'cm³', expr: `${l}*${w}*${h}` });
  }
  if (v === 1) {
    const b = r.int(2, 12), h = r.int(2, 10), Lg = r.int(3, 20), B = (b * h) / 2, [Bd, Hd] = disp(b, h);
    const pic = (hl) => G.prismFig({ base: [[0, 0], [Bd, 0], [Bd * 0.35, Hd]], depth: Math.max(Bd, Hd) * 0.9, sides: [`${b} cm`, '', ''], height: { from: 2, side: 0, label: `${h} cm` }, depthLabel: `${Lg} cm`, hl });
    return num(dec(B * Lg), [
      St(`The base of this prism is the triangle at the end: ${b} × ${h} ÷ 2 = ${dec(B)} cm².`, pic('base')),
      St(`V = base area × length = ${dec(B)} × ${Lg} = ${dec(B * Lg)}.`, pic('depth')),
      St(`So the volume is ${dec(B * Lg)} cm³.`)], { q: 'What is the volume of this triangular prism, in cm³?', visual: pic(), unit: 'cm³', expr: `${b}*${h}/2*${Lg}` });
  }
  if (v === 2) {
    const R = r.int(1, 10), h = r.int(2, 20), base = 3.14 * R * R, val = base * h;
    const pic = (hl) => G.cylinderFig({ r: R, h, labels: [`${R} cm`, `${h} cm`], hl });
    return num(D2(val), [
      St(`The base is a circle: 3.14 × ${R}² = ${D2(base)} cm².`, pic(['base', 'radius'])),
      St(`V = base area × height = ${D2(base)} × ${h}.`, pic(['height'])),
      St(`That is ${D2(val)}, so the volume is ${D2(val)} cm³.`)], { q: 'Using π ≈ 3.14, what is the volume of this cylinder, in cm³?', visual: pic(), ...PI_TOL, expr: `3.14*${R}**2*${h}` });
  }
  if (v === 3) {
    const B = r.int(10, 80), h = r.int(2, 15), pts = G.regular(r.pick([5, 6]), 3);
    const pic = (hl, lab) => withNote(G.prismFig({ base: pts, depth: 4 + h * 0.3, depthLabel: lab, hl }), `${B} cm²`);
    return num(h, [
      St('V = base area × height, so height = V ÷ base area.', pic('base', 'h')),
      St(`h = ${B * h} ÷ ${B} = ${h}.`, pic('depth', `${h} cm`)),
      St(`So the height is ${h} cm.`)], { q: `This prism has a base area of ${B} cm² and a volume of ${B * h} cm³. What is its height h, in cm?`, visual: pic(null, 'h'), unit: 'cm', expr: `${B * h}/${B}` });
  }
  if (v === 4) {
    const l = r.pick([30, 40, 50, 60]), w = r.pick([20, 25, 30]), h = r.int(10, 30), V = l * w * h;
    const pic = (hl) => G.boxFig({ l, w, h, labels: [`${l} cm`, `${w} cm`, `${h} cm`], hl });
    return num(dec(V / 1000), [
      St(`The water fills a box ${l} × ${w} × ${h}: V = ${l * w} × ${h} = ${V} cm³.`, pic(['base', 'height'])),
      St(`1 cm³ holds 1 mL, and 1000 mL = 1 L: ${V} ÷ 1000 = ${dec(V / 1000)}.`),
      St(`So the tank holds ${dec(V / 1000)} L.`)], { q: `A fish tank is filled with water to a depth of ${h} cm, as shown. How many litres of water are in it?`, visual: pic(), unit: 'L', expr: `${l}*${w}*${h}/1000` });
  }
  if (v === 5) {
    const l = r.int(2, 5), w = r.int(2, 4), h = r.int(2, 4);
    const pic = (hl) => G.boxFig({ l, w, h, cubes: true, labels: [`${l}`, `${w}`, `${h}`], hl });
    return num(l * w * h, [
      St(`One layer on the bottom has ${l} × ${w} = ${l * w} cubes.`, pic(['base'])),
      St(`There are ${h} layers: ${l * w} × ${h} = ${l * w * h}.`, pic(['height'])),
      St(`So the volume is ${l * w * h} cm³.`)], { q: 'This box is built from 1 cm cubes. What is its volume, in cm³?', visual: pic(), unit: 'cm³', expr: `${l}*${w}*${h}` });
  }
  const s = r.int(2, 12), pic = (hl) => G.boxFig({ l: s, w: s, h: s, labels: [`${s} cm`, '', ''], hl });
  return num(s ** 3, [
    St(`Every edge of a cube is ${s} cm. The base is ${s} × ${s} = ${s * s} cm².`, pic(['base'])),
    St(`V = ${s * s} × ${s} = ${s ** 3}.`),
    St(`So the volume is ${s ** 3} cm³.`)], { q: `This cube has edges of ${s} cm. What is its volume, in cm³?`, visual: pic(), unit: 'cm³', expr: `${s}**3` });
}

// ───────── surface area ─────────
export function surface(r) {
  const v = r.int(0, 5);
  if (v === 0 || v === 5) {
    const l = r.int(2, 15), w = r.int(2, 12), h = r.int(2, 10), open = v === 5, val = (open ? l * w : 2 * l * w) + 2 * l * h + 2 * w * h;
    const net = (hl) => G.boxNet({ l, w, h, labels: [`${l}`, `${w}`, `${h}`], hl });
    return num(val, [
      St('Unfold the box into its net: 6 rectangles in 3 matching pairs.', net(null)),
      St(open ? `Bottom only (no top): ${l} × ${w} = ${l * w} cm².` : `Top and bottom: 2 × ${l} × ${w} = ${2 * l * w} cm².`, net('tb')),
      St(`Front and back: 2 × ${l} × ${h} = ${2 * l * h} cm².`, net('fb')),
      St(`Left and right: 2 × ${w} × ${h} = ${2 * w * h} cm².`, net('lr')),
      St(`Total: ${open ? l * w : 2 * l * w} + ${2 * l * h} + ${2 * w * h} = ${val}.`),
      St(`So the ${open ? 'outside of the open box has an area of' : 'surface area is'} ${val} cm².`)], { q: open ? `This box has no top. How much card is needed to make it, in cm²?` : 'What is the surface area of this box, in cm²?', visual: G.boxFig({ l, w, h, labels: [`${l} cm`, `${w} cm`, `${h} cm`] }), unit: 'cm²', expr: open ? `${l}*${w}+2*${l}*${h}+2*${w}*${h}` : `2*(${l}*${w}+${l}*${h}+${w}*${h})` });
  }
  if (v === 1) {
    const s = r.int(2, 15), cells = G.CUBE_NETS[r.int(0, 10)];
    return num(6 * s * s, [
      St(`A cube has 6 faces, all equal squares. Its net shows all 6.`, G.netFig({ cells })),
      St(`One face: ${s} × ${s} = ${s * s} cm². Six faces: 6 × ${s * s} = ${6 * s * s}.`, G.netFig({ cells, hl: [0] })),
      St(`So the surface area is ${6 * s * s} cm².`)], { q: `This cube has edges of ${s} cm. What is its surface area, in cm²?`, visual: G.boxFig({ l: s, w: s, h: s, labels: [`${s} cm`, '', ''] }), unit: 'cm²', expr: `6*${s}**2` });
  }
  if (v === 2) {
    const R = r.int(1, 10), h = r.int(2, 20), circ = 2 * 3.14 * R * R, side = 2 * 3.14 * R * h, val = circ + side;
    const net = (hl) => G.cylinderNet({ labels: [`${R}`, `${h}`, '2πr'], hl });
    return num(D2(val), [
      St('Unfold the cylinder: two circles and a rectangle. The rectangle wraps round the circle, so its length is the circumference, 2πr.', net(null)),
      St(`Two circles: 2 × 3.14 × ${R}² = ${D2(circ)} cm².`, net('circles')),
      St(`The rectangle: 2 × 3.14 × ${R} × ${h} = ${D2(side)} cm².`, net('rect')),
      St(`Total: ${D2(circ)} + ${D2(side)} = ${D2(val)}.`),
      St(`So the surface area is ${D2(val)} cm².`)], { q: 'Using π ≈ 3.14, what is the surface area of this cylinder, in cm²?', visual: G.cylinderFig({ r: R, h, labels: [`${R} cm`, `${h} cm`] }), ...PI_TOL, expr: `2*3.14*${R}**2+2*3.14*${R}*${h}` });
  }
  if (v === 3) {
    const s = r.int(3, 14), sl = r.int(s, 20), val = s * s + 2 * s * sl;
    const net = (hl) => G.pyramidNet({ labels: [`${s}`, `${sl}`], hl });
    return num(val, [
      St('Unfold the pyramid: a square base with a triangle on each side.', net(null)),
      St(`The base: ${s} × ${s} = ${s * s} cm².`, net('base')),
      St(`Each triangle has base ${s} and height ${sl} (the slant height): ${s} × ${sl} ÷ 2 = ${dec((s * sl) / 2)}. Four of them: ${2 * s * sl} cm².`, net('faces')),
      St(`Total: ${s * s} + ${2 * s * sl} = ${val}.`),
      St(`So the surface area is ${val} cm².`)], { q: 'What is the surface area of this square pyramid, in cm²?', visual: G.pyramidFig({ a: s, h: Math.sqrt(Math.max(1, sl * sl - (s * s) / 4)), labels: [`${s} cm`, '', `${sl} cm`] }), unit: 'cm²', expr: `${s}**2+4*${s}*${sl}/2` });
  }
  // a triangular prism with a right-triangle end
  const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 6, 10]]), Lg = r.int(4, 15), tri = (a * b) / 2, rect = (a + b + c) * Lg, val = 2 * tri + rect;
  const [Ad, Bd] = disp(a, b), net = (hl) => G.triPrismNet({ hl });
  return num(dec(val), [
    St('Unfold the prism: 2 triangles at the ends and 3 rectangles round the sides.', net(null)),
    St(`The two right triangles: 2 × (${a} × ${b} ÷ 2) = ${dec(2 * tri)} cm².`, net('tris')),
    St(`The three rectangles are all ${Lg} cm long, and their widths are the sides of the triangle: (${a} + ${b} + ${c}) × ${Lg} = ${rect} cm².`, net('rects')),
    St(`Total: ${dec(2 * tri)} + ${rect} = ${dec(val)}.`),
    St(`So the surface area is ${dec(val)} cm².`)], { q: 'What is the surface area of this triangular prism, in cm²?', visual: G.prismFig({ base: [[0, 0], [Ad, 0], [0, Bd]], depth: Math.max(Ad, Bd) * 1.1, sides: [`${a} cm`, `${c} cm`, `${b} cm`], depthLabel: `${Lg} cm` }), unit: 'cm²', expr: `${a}*${b}+(${a}+${b}+${c})*${Lg}` });
}

// ───────── transformations on a grid ─────────
// a coordinate grid from −R to R with shapes and points; mirror: 'x' | 'y' draws that axis as the mirror line
export function gridFig({ R = 6, shapes = [], points = [], mirror = null, arrows = [], W = 240 }) {
  const u = (W - 30) / (2 * R), c = W / 2, X = (x) => c + x * u, Y = (y) => c - y * u, P = ([x, y]) => [X(x), Y(y)];
  const items = [];
  for (let k = -R; k <= R; k++) if (k) items.push(line([X(k), Y(-R)], [X(k), Y(R)], 'grid'), line([X(-R), Y(k)], [X(R), Y(k)], 'grid'));
  items.push(line([X(-R), Y(0)], [X(R), Y(0)], mirror === 'x' ? 'hlline' : 'ink'), line([X(0), Y(-R)], [X(0), Y(R)], mirror === 'y' ? 'hlline' : 'ink'));
  for (let k = -R; k <= R; k += 2) if (k) items.push(text([X(k), Y(0) + 10], neg(k), 'muted', { size: 9 }), text([X(0) - 9, Y(k)], neg(k), 'muted', { size: 9 }));
  for (const s of shapes) {
    const p = s.pts.map(P), cc = cen(p);
    items.push(poly(p, s.t ?? 'fig'));
    (s.names ?? []).forEach((nm, i) => { if (nm) items.push(text(add(p[i], mulv(unit(sub(p[i], cc)), 12)), nm, s.t === 'hl' ? 'hl' : 'ink', { size: 12 })); });
  }
  for (const [a, b] of arrows) { items.push(line(P(a), P(b), 'aux'), arrow(P(b), P(a), 'mark')); }
  for (const [x, y, lab, t] of points) items.push(dot(P([x, y]), t ?? 'ink'), ...(lab ? [text([X(x) + 10, Y(y) - 10], lab, t ?? 'ink', { size: 12 })] : []));
  return fig(items, W, W);
}
const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
const FLAG = [[1, 1], [1, 4], [3, 4], [3, 3], [2, 3], [2, 1]];   // an L-shaped flag with no symmetry
const MOVES = {
  translation: { f: ([x, y]) => [x - 5, y - 5], say: 'every point slides 5 left and 5 down; the shape still faces the same way' },
  reflection: { f: ([x, y]) => [-x, y], say: 'the shape is flipped over the y-axis, like a mirror image: it faces the other way' },
  rotation: { f: ([x, y]) => [y, -x], say: 'the shape is turned 90° clockwise about the origin' },
};
export function transform(r) {
  const v = r.int(0, 6), x = r.nonzero(-5, 5), y = r.nonzero(-5, 5);
  if (v === 0) {
    const a = r.nonzero(-3, 3), b = r.nonzero(-3, 3), h = r.nonzero(-3, 3), w = r.nonzero(-3, 3), img = pt(a + h, b + w);
    const pic = (done) => gridFig({ points: [[a, b, 'A'], ...(done ? [[a + h, b + w, 'A′', 'hl']] : [])], arrows: done ? [[[a, b], [a + h, b + w]]] : [] });
    return mc(r, img, [pt(a - h, b - w), pt(a + w, b + h), pt(a + h, b - w)], { q: `Point A is translated ${Math.abs(h)} unit${Math.abs(h) > 1 ? 's' : ''} ${h > 0 ? 'right' : 'left'} and ${Math.abs(w)} unit${Math.abs(w) > 1 ? 's' : ''} ${w > 0 ? 'up' : 'down'}. Where is A′?`, visual: pic(false), steps: [
      St(`A is at ${pt(a, b)}. ${h > 0 ? 'Right' : 'Left'} changes x: ${neg(a)} ${h > 0 ? '+' : '−'} ${Math.abs(h)} = ${neg(a + h)}. ${w > 0 ? 'Up' : 'Down'} changes y: ${neg(b)} ${w > 0 ? '+' : '−'} ${Math.abs(w)} = ${neg(b + w)}.`, pic(true)),
      St(`So A′ is ${img}.`)] });
  }
  if (v === 1) {
    const inX = r.bool(), img = inX ? pt(x, -y) : pt(-x, y), [ix, iy] = inX ? [x, -y] : [-x, y];
    const pic = (done) => gridFig({ points: [[x, y, 'A'], ...(done ? [[ix, iy, 'A′', 'hl']] : [])], mirror: inX ? 'x' : 'y' });
    return mc(r, img, [inX ? pt(-x, y) : pt(x, -y), pt(-x, -y), pt(y, x)], { q: `Point A is reflected in the ${inX ? 'x' : 'y'}-axis (the highlighted line). Where is A′?`, visual: pic(false), steps: [
      St(inX ? `The mirror is the x-axis. A is ${Math.abs(y)} unit${Math.abs(y) > 1 ? 's' : ''} ${y > 0 ? 'above' : 'below'} it, so A′ is ${Math.abs(y)} ${y > 0 ? 'below' : 'above'} it: x stays, y changes sign.` : `The mirror is the y-axis. A is ${Math.abs(x)} unit${Math.abs(x) > 1 ? 's' : ''} to the ${x > 0 ? 'right' : 'left'} of it, so A′ is ${Math.abs(x)} to the ${x > 0 ? 'left' : 'right'}: x changes sign, y stays.`, pic(true)),
      St(`So A′ is ${img}.`)] });
  }
  if (v === 2) {
    const [name, f, rule] = r.pick([['90° clockwise', ([p, q]) => [q, -p], '(x, y) → (y, −x)'], ['90° counterclockwise', ([p, q]) => [-q, p], '(x, y) → (−y, x)'], ['180°', ([p, q]) => [-p, -q], '(x, y) → (−x, −y)']]);
    const [ix, iy] = f([x, y]), img = pt(ix, iy);
    const pic = (done) => gridFig({ points: [[0, 0, 'O'], [x, y, 'A'], ...(done ? [[ix, iy, 'A′', 'hl']] : [])], shapes: done ? [{ pts: [[0, 0], [x, y], [0, 0], [ix, iy]], t: 'ink' }] : [] });
    return mc(r, img, [pt(y, -x), pt(-y, x), pt(-x, -y), pt(x, -y)].filter((p) => p !== img), { q: `Point A is rotated ${name} about the origin O. Where is A′?`, visual: pic(false), steps: [
      St(`A ${name} turn about the origin follows the rule ${rule}.`),
      St(`${pt(x, y)} → ${img}, so A′ is ${img}.`, pic(true))] });
  }
  if (v === 3) {
    const a = r.int(-3, 3), b = r.int(-3, 3), h = r.nonzero(-3, 3), w = r.nonzero(-3, 3), desc = (H, V) => `${Math.abs(H)} ${H > 0 ? 'right' : 'left'} and ${Math.abs(V)} ${V > 0 ? 'up' : 'down'}`;
    const pic = (ar) => gridFig({ points: [[a, b, 'A'], [a + h, b + w, 'A′', 'hl']], arrows: ar ? [[[a, b], [a + h, b]], [[a + h, b], [a + h, b + w]]] : [] });
    return mc(r, desc(h, w), [desc(-h, -w), desc(w, h), desc(h, -w)], { q: 'A is translated to A′. Describe the translation.', visual: pic(false), steps: [
      St(`Count across, then up or down: x goes from ${neg(a)} to ${neg(a + h)}, a change of ${neg(h)}; y goes from ${neg(b)} to ${neg(b + w)}, a change of ${neg(w)}.`, pic(true)),
      St(`So the translation is ${desc(h, w)}.`)] });
  }
  if (v === 4) {
    // reflect a triangle and read one vertex
    const P = [[r.int(1, 2), r.int(1, 2)]]; P.push([P[0][0] + r.int(2, 3), P[0][1]]); P.push([P[0][0] + r.int(0, 1), P[0][1] + r.int(2, 3)]);
    const inX = r.bool(), f = inX ? ([p, q]) => [p, -q] : ([p, q]) => [-p, q], Q = P.map(f), k = r.int(0, 2), nm = 'ABC'[k], img = pt(...Q[k]);
    const pic = (done) => gridFig({ shapes: [{ pts: P, names: ['A', 'B', 'C'] }, ...(done ? [{ pts: Q, t: 'hl', names: ['A′', 'B′', 'C′'] }] : [])], mirror: inX ? 'x' : 'y' });
    return mc(r, img, [pt(-Q[k][0], -Q[k][1]), pt(...P[k]), pt(Q[k][1], Q[k][0]), pt(-P[k][1], P[k][0])].filter((s) => s !== img), { q: `Triangle ABC is reflected in the ${inX ? 'x' : 'y'}-axis. Where is ${nm}′?`, visual: pic(false), steps: [
      St(`${nm} is at ${pt(...P[k])}. Reflecting in the ${inX ? 'x-axis keeps x and changes the sign of y' : 'y-axis changes the sign of x and keeps y'}.`),
      St(`So ${nm}′ is ${img}.`, pic(true))] });
  }
  if (v === 5) {
    const want = r.pick(Object.keys(MOVES)), figs = Object.fromEntries(Object.entries(MOVES).map(([k, m]) => [k, gridFig({ R: 5, shapes: [{ pts: FLAG }, { pts: FLAG.map(m.f), t: 'hl' }], W: 200 })]));
    return pickFig(r, `Each picture shows the blue shape and its image (pink). Which picture shows a ${want}?`, figs[want], Object.keys(MOVES).filter((k) => k !== want).map((k) => figs[k]), (c) => [
      St('A translation slides (the image faces the same way). A reflection flips (the image is a mirror image). A rotation turns (the image is turned round a point).'),
      St(`In picture ${c}, ${MOVES[want].say}, so it shows a ${want}.`, figs[want])]);
  }
  // translate a triangle and read one vertex
  const P = [[r.int(-4, -2), r.int(-1, 1)]]; P.push([P[0][0] + 2, P[0][1]]); P.push([P[0][0], P[0][1] + r.int(2, 3)]);
  const h = r.int(3, 6), w = r.nonzero(-3, 2), Q = P.map(([p, q]) => [p + h, q + w]), k = r.int(0, 2), nm = 'ABC'[k], img = pt(...Q[k]);
  const pic = (done) => gridFig({ shapes: [{ pts: P, names: ['A', 'B', 'C'] }, ...(done ? [{ pts: Q, t: 'hl', names: ['A′', 'B′', 'C′'] }] : [])], arrows: done ? [[P[k], Q[k]]] : [] });
  return mc(r, img, [pt(P[k][0] - h, P[k][1] - w), pt(P[k][0] + w, P[k][1] + h), pt(P[k][0] + h, P[k][1] - w)].filter((s) => s !== img), { q: `Triangle ABC is translated ${h} units right and ${Math.abs(w)} unit${Math.abs(w) > 1 ? 's' : ''} ${w > 0 ? 'up' : 'down'}. Where is ${nm}′?`, visual: pic(false), steps: [
    St(`Add ${h} to x and ${neg(w)} to y. ${nm} is ${pt(...P[k])}: x = ${neg(P[k][0])} + ${h} = ${neg(Q[k][0])}, y = ${neg(P[k][1])} ${w > 0 ? '+' : '−'} ${Math.abs(w)} = ${neg(Q[k][1])}.`, pic(true)),
    St(`So ${nm}′ is ${img}.`)] });
}

// ───────── congruence and symmetry ─────────
const rotP = (p, deg) => { const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
// a triangle and a congruent copy: turned by `turn` degrees (and flipped when `flip`), placed to the right
function congPair(base, { turn = 0, flip = false, n1, n2, s1 = [], s2 = [], a1 = [], a2 = [], hl1 = [], hl2 = [], hA1 = [], hA2 = [] }) {
  const c0 = cen(base);
  let img = base.map((p) => rotP(sub(p, c0), turn)); if (flip) img = img.map(([x, y]) => [-x, y]);
  const w = Math.max(...base.map((p) => p[0])) - Math.min(...base.map((p) => p[0]));
  const dx = Math.max(...base.map((p) => p[0])) + w * 0.3 - Math.min(...img.map((p) => p[0]));
  img = img.map((p) => add(p, [dx, c0[1]]));
  if (flip) img = [...img];
  return multiPoly([{ pts: base, names: n1, sides: s1, angles: a1, hl: hl1, hlAngles: hA1 }, { pts: img, names: n2, sides: s2, angles: a2, hl: hl2, hlAngles: hA2, t: 'top' }], { W: 340, H: 200 });
}
// a shape with its lines of symmetry
function symFig(kind, show) {
  const S = {
    'an equilateral triangle': [G.regular(3), 3], 'a square': [G.regular(4), 4], 'a regular pentagon': [G.regular(5), 5], 'a regular hexagon': [G.regular(6), 6], 'a regular octagon': [G.regular(8), 8],
    'a rectangle that is not a square': [[[-4, -2.2], [4, -2.2], [4, 2.2], [-4, 2.2]], 'rect'], 'an isosceles triangle that is not equilateral': [[[-2.5, -2.5], [2.5, -2.5], [0, 4]], 'iso'],
    'a scalene triangle': [[[-3, -2], [4, -2], [-1, 3]], 0], 'a parallelogram with no right angles': [[[-4, -2], [2, -2], [4, 2], [-2, 2]], 0],
  }[kind];
  const [pts, k] = S, n = typeof k === 'number' ? k : k === 'rect' ? 2 : 1;
  let dirs = [];
  if (typeof k === 'number' && k > 0) { const st = -90 - 180 / k; for (let i = 0; i < k; i++) dirs.push(st + (180 * i) / k); }
  if (k === 'rect') dirs = [0, 90]; if (k === 'iso') dirs = [90];
  const ticksOf = typeof k === 'number' && k > 0 ? Array(k).fill(1) : k === 'iso' ? [0, 1, 1] : k === 'rect' ? [1, 2, 1, 2] : [];
  const f = polygonFig({ pts, ticks: ticksOf, right: k === 'rect' ? [0, 1, 2, 3] : [], extra: [[-5.5, -5.5], [5.5, 5.5]], W: 220, H: 200 });
  if (show) {
    const F = frame([...pts, [-5.5, -5.5], [5.5, 5.5]], { W: 220, H: 200, pad: 38 }), c = F.m([0, 0]);
    for (const d of dirs) { const u = [Math.cos(rad(d)), -Math.sin(rad(d))]; f.items.push(line(sub(c, mulv(u, 85)), add(c, mulv(u, 85)), 'aux')); }
  }
  return { f, n };
}
const SYM_KINDS = ['an equilateral triangle', 'a square', 'a regular pentagon', 'a regular hexagon', 'a regular octagon', 'a rectangle that is not a square', 'an isosceles triangle that is not equilateral', 'a scalene triangle', 'a parallelogram with no right angles'];
export function congruence(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const ox = r.int(1, 3), oy = r.int(1, 3), P = [[ox, oy], [ox + 3, oy], [ox, oy + 2]], kind = r.pick(['translation', 'reflection', 'rotation']);
    let Q;
    if (kind === 'translation') { const dx = -r.int(4, 6), dy = r.pick([-5, -4, 0, 1]); Q = P.map(([x, y]) => [x + dx, y + dy]); }
    else if (kind === 'reflection') Q = r.bool() ? P.map(([x, y]) => [-x, y]) : P.map(([x, y]) => [x, -y]);
    else Q = P.map(([x, y]) => [-x, -y]);
    const pic = gridFig({ shapes: [{ pts: P, names: ['A', 'B', 'C'] }, { pts: Q, t: 'hl', names: ['A′', 'B′', 'C′'] }] });
    return mc(r, kind, ['translation', 'reflection', 'rotation'].filter((k) => k !== kind), { q: 'Which transformation moves triangle ABC onto triangle A′B′C′?', visual: pic, steps: [
      St(kind === 'translation' ? 'Every point moves the same distance in the same direction, and the triangle still faces the same way.' : kind === 'reflection' ? 'The triangle is flipped over an axis: it now faces the other way, like a mirror image.' : 'The triangle is turned halfway round the origin: (x, y) → (−x, −y).', pic),
      St(`So it is a ${kind}. The image is congruent: same size, same shape.`)] });
  }
  const [p1, p2] = r.pick([['ABC', 'DEF'], ['PQR', 'XYZ'], ['JKL', 'MNO'], ['RST', 'UVW']]), i = r.int(0, 2), j = (i + 1) % 3;
  const base = triPts(r.pick([40, 50, 55, 65]), r.pick([60, 70, 75])), turn = r.pick([0, 90, 150, 200, 270]), flip = r.bool();
  if (v === 1) {
    const side = r.bool(), right = side ? p2[i] + p2[j] : `∠${p2[i]}`;
    const wrong = side ? [p2[j] + p2[(j + 1) % 3], p2[(i + 2) % 3] + p2[i], p1[j] + p2[i]] : [`∠${p2[j]}`, `∠${p2[(i + 2) % 3]}`, `∠${p1[i]}`];
    const hl = (on) => congPair(base, { turn, flip, n1: [...p1], n2: [...p2], hl1: on && side ? [i] : [], hl2: on && side ? [i] : [], a1: !side ? [0, 1, 2].map((k) => (k === i ? ' ' : '')) : [], a2: on && !side ? [0, 1, 2].map((k) => (k === i ? ' ' : '')) : [], hA1: [i], hA2: [i] });
    return mc(r, right, wrong, { q: `△${p1} ≅ △${p2}. Which part of △${p2} matches ${side ? `side ${p1[i]}${p1[j]}` : `∠${p1[i]}`}?`, visual: hl(false), steps: [
      St(`The order of the letters tells you which parts match: ${[0, 1, 2].map((k) => `${p1[k]} ↔ ${p2[k]}`).join(', ')}. (The second triangle may be turned or flipped, so trust the letters.)`),
      St(`So ${side ? `${p1[i]}${p1[j]}` : `∠${p1[i]}`} matches ${right}.`, hl(true))] });
  }
  if (v === 2) {
    const s = r.int(3, 20), lab1 = [0, 1, 2].map((k) => (k === i ? `${s} cm` : ''));
    const pic = (done) => congPair(base, { turn, flip, n1: [...p1], n2: [...p2], s1: lab1, s2: [0, 1, 2].map((k) => (k === i ? (done ? `${s} cm` : '?') : '')), hl1: done ? [i] : [], hl2: done ? [i] : [] });
    return num(s, [
      St(`${p1[i]}${p1[j]} matches ${p2[i]}${p2[j]}, because the letters are in the same places in △${p1} ≅ △${p2}.`, pic(true)),
      St(`Matching sides of congruent figures are equal, so ${p2[i]}${p2[j]} = ${s} cm.`)], { q: `△${p1} ≅ △${p2}. How long is ${p2[i]}${p2[j]}?`, visual: pic(false), unit: 'cm', expr: String(s) });
  }
  if (v === 3) {
    const A = r.pick([40, 50, 55, 65]), B = r.pick([60, 70, 75]), C = 180 - A - B, tri = triPts(A, B), k = 2;
    const pic = (done) => congPair(tri, { turn, flip, n1: [...p1], n2: [...p2], a1: [`${A}°`, `${B}°`, done ? `${C}°` : ''], a2: ['', '', done ? `${C}°` : '?'], hA1: done ? [2] : [], hA2: done ? [2] : [] });
    return num(C, [
      St(`In △${p1}: ∠${p1[k]} = 180 − ${A} − ${B} = ${C}°.`, pic(true)),
      St(`∠${p2[k]} matches ∠${p1[k]}, so ∠${p2[k]} = ${C}°.`)], { q: `△${p1} ≅ △${p2}. What is ∠${p2[k]}?`, visual: pic(false), unit: '°', expr: `180-${A}-${B}` });
  }
  if (v === 4) {
    const kind = r.pick(SYM_KINDS), { f, n } = symFig(kind, false), shown = symFig(kind, true).f;
    return num(n, [
      St('A line of symmetry folds the shape exactly onto itself. Try each fold: through the corners, and through the middles of the sides.', shown),
      St(`${cap(kind)} has ${n} line${n === 1 ? '' : 's'} of symmetry.`)], { q: `How many lines of symmetry does this shape have? (It is ${kind}.)`, visual: f, expr: String(n) });
  }
  if (v === 5) {
    // which shape is congruent to the first? Same size and shape, maybe turned or flipped
    const shp = [[0, 0], [4, 0], [4, 1.5], [1.5, 1.5], [1.5, 3], [0, 3]], c0 = cen(shp), tw = r.pick([90, 180, 270]), fl = r.bool();
    const place = (pts) => { const cc = cen(pts); return pts.map((p) => sub(p, cc)); };
    const mk = (pts) => polygonFig({ pts, extra: [[-3.2, -3.2], [3.2, 3.2]], W: 160, H: 150 });
    let same = place(shp).map((p) => rotP(p, tw)); if (fl) same = same.map(([x, y]) => [-x, y]);
    const bigger = place(shp.map((p) => mulv(p, 1.35))).map((p) => rotP(p, tw));
    const wide = place(shp.map(([x, y]) => [x * 1.3, y * 0.85]));
    const other = place([[0, 0], [4, 0], [4, 1.5], [2.5, 1.5], [2.5, 3], [0, 3]]);
    void c0;
    const orig = polygonFig({ pts: place(shp), extra: [[-3.2, -3.2], [3.2, 3.2]], shade: true, W: 160, H: 150 });
    const out = pickFig(r, 'Which shape is congruent to this green shape?', mk(same), [mk(bigger), mk(wide), mk(other)], (c) => [
      St('Congruent shapes have exactly the same size and shape. They may be turned or flipped.', orig),
      St(`Shape ${c} is the green shape ${fl ? 'flipped and ' : ''}turned ${tw}°, with every side the same length, so shape ${c} is congruent to it.`, mk(same))]);
    out.visual = { type: 'figs', figs: [orig, ...out.visual.figs], captions: ['Green', ...out.visual.captions] };
    return out;
  }
  // rotational symmetry: how many times it fits onto itself in one full turn
  const [kind, n] = r.pick([['a regular pentagon', 5], ['a regular hexagon', 6], ['a square', 4], ['an equilateral triangle', 3], ['a regular octagon', 8]]), { f } = symFig(kind, false);
  return num(n, [
    St(`Turn the shape about its centre. It fits onto itself each time it turns by 360° ÷ ${n} = ${360 / n}°.`, symFig(kind, true).f),
    St(`That happens ${n} times in a full turn, so its order of rotational symmetry is ${n}.`)], { q: `This is ${kind}. How many times does it fit exactly onto itself in one full turn about its centre?`, visual: f, expr: String(n) });
}

// ───────── similar figures and dilations ─────────
export function similar(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const [n, d] = r.pick([[2, 1], [3, 1], [1, 2], [3, 2]]), x = d * r.nonzero(-2, 2), y = d * r.nonzero(-2, 2), X = (x * n) / d, Y = (y * n) / d;
    const pic = (ln) => gridFig({ points: [[0, 0, 'O'], [x, y, 'A'], [X, Y, 'A′', 'hl']], shapes: ln ? [{ pts: [[0, 0], [x, y], [X, Y], [x, y]], t: 'ink' }] : [] });
    return num(frac(n, d), [
      St('A dilation from the origin multiplies both coordinates by the scale factor k. A and A′ lie on the same line through O.', pic(true)),
      St(`k = ${neg(X)} ÷ ${neg(x)} = ${frac(n, d)}. Check with y: ${neg(Y)} ÷ ${neg(y)} = ${frac(n, d)}.`),
      St(`So the scale factor is ${frac(n, d)}.`)], { q: `A dilation from the origin O sends A ${pt(x, y)} to A′ ${pt(X, Y)}. What is the scale factor?`, visual: pic(false), expr: `${X}/${x}` });
  }
  if (v === 1) {
    const k = r.pick([2, 3, 0.5]), x = (k === 0.5 ? 2 : 1) * r.nonzero(-2, 2), y = (k === 0.5 ? 2 : 1) * r.nonzero(-2, 2), img = pt(k * x, k * y);
    const pic = (done) => gridFig({ points: [[0, 0, 'O'], [x, y, 'A'], ...(done ? [[k * x, k * y, 'A′', 'hl']] : [])], shapes: done ? [{ pts: [[0, 0], [x, y], [k * x, k * y], [x, y]], t: 'ink' }] : [] });
    return mc(r, img, [pt(x + k, y + k), pt(k * x, y), pt(x / k, y / k)], { q: `Point A is dilated from the origin by a scale factor of ${k}. Where is A′?`, visual: pic(false), steps: [
      St(`Multiply both coordinates by ${k}: ${pt(x, y)} → (${k} × ${neg(x)}, ${k} × ${neg(y)}).`),
      St(`So A′ is ${img}.`, pic(true))] });
  }
  if (v === 2) {
    const k = r.pick([1.5, 2, 2.5, 3]), A = r.pick([40, 50, 60, 70]), B = r.pick([45, 55, 65]), base = triPts(A, B);
    const sc = (p, m) => p.map((q) => mulv(q, m)), a = r.int(2, 10), m1 = a / 10, small = base;
    const sl = [a, R1(a * Math.hypot(base[2][0] - 10, base[2][1]) / 10), R1(a * Math.hypot(base[2][0], base[2][1]) / 10)];
    const j = r.pick([1, 2]), bb = sl[j], big = sc(base, k).map((p) => add(p, [13, 0]));
    const pic = (done) => multiPoly([{ pts: small, sides: [`${a} cm`, j === 1 ? `${dec(bb)} cm` : '', j === 2 ? `${dec(bb)} cm` : ''], hl: done ? [0, j] : [] }, { pts: big, sides: [`${dec(a * k)} cm`, j === 1 ? (done ? `${dec(bb * k)} cm` : '?') : '', j === 2 ? (done ? `${dec(bb * k)} cm` : '?') : ''], hl: done ? [0, j] : [], t: 'top' }], { W: 340, H: 210 });
    return num(dec(bb * k), [
      St(`The bottom sides match: ${dec(a * k)} ÷ ${a} = ${k}. That is the scale factor.`, pic(false)),
      St(`Every side of the big triangle is ${k} times the matching small side: ${dec(bb)} × ${k} = ${dec(bb * k)}.`, pic(true)),
      St(`So the missing side is ${dec(bb * k)} cm.`)], { q: 'These two triangles are similar. Find the missing side, in cm.', visual: pic(false), unit: 'cm', expr: `${bb}*${dec(a * k)}/${a}` });
  }
  if (v === 3) {
    const h = r.pick([1.5, 1.6, 1.8, 2]), s = r.pick([1, 2, 2.5, 3]), k = r.int(3, 12), S = s * k, H = h * k;
    const pic = (lab) => multiPoly([{ pts: [[0, 0], [s, 0], [0, h]], sides: [`${dec(s)} m`, '', `${dec(h)} m`], right: [0] }, { pts: [[s + 2, 0], [s + 2 + s * 2.2, 0], [s + 2, h * 2.2]], sides: [`${dec(S)} m`, '', lab], right: [0], t: 'top' }], { W: 320, H: 200, notes: [{ at: [0, h + 0.5], s: 'person', t: 'muted' }, { at: [s + 2, h * 2.2 + 0.5], s: 'tree', t: 'muted' }] });
    return num(dec(H), [
      St('At the same time of day the sun makes similar triangles: height and shadow are in the same ratio.', pic('H')),
      St(`The tree's shadow is ${dec(S)} ÷ ${dec(s)} = ${k} times as long, so the tree is ${k} times as tall: ${dec(h)} × ${k} = ${dec(H)}.`, pic(`${dec(H)} m`)),
      St(`So the tree is ${dec(H)} m tall.`)], { q: `A person ${dec(h)} m tall casts a ${dec(s)} m shadow. At the same time a tree casts a ${dec(S)} m shadow. How tall is the tree, in metres? (Not drawn to scale.)`, visual: pic('H'), unit: 'm', expr: `${h}*${S}/${s}` });
  }
  if (v === 4) {
    const a = r.int(2, 6), b = r.int(a + 1, 8), k = r.pick([1.5, 2]), yes = r.bool(), c = a * k, d = yes ? b * k : b * k + r.pick([-1, 1, 2]);
    const pic = (hl) => multiPoly([{ pts: [[0, 0], [b, 0], [b, a], [0, a]], sides: [`${b} cm`, `${a} cm`, '', ''], right: [0, 1, 2, 3], hl }, { pts: [[b + 2, 0], [b + 2 + d, 0], [b + 2 + d, c], [b + 2, c]], sides: [`${dec(d)} cm`, `${dec(c)} cm`, '', ''], right: [0, 1, 2, 3], hl, t: 'top' }], { W: 340, H: 200 });
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'Are these two rectangles similar?', visual: pic([]), steps: [
      St(`Compare matching sides: short sides ${dec(c)} ÷ ${a} = ${dec(c / a, 3)}; long sides ${dec(d)} ÷ ${b} = ${dec(d / b, 3)}.`, pic([0, 1])),
      St(yes ? 'Both ratios are the same, so yes, they are similar.' : 'The ratios are different, so no, they are not similar.')] });
  }
  if (v === 5) {
    // the scale factor between similar figures
    const k = r.pick([2, 3, 1.5]), w = r.int(2, 6) * 2, h = r.int(2, 4) * 2, up = r.bool();
    const pts1 = [[0, 0], [w, 0], [w * 0.75, h], [w * 0.25, h]], pts2 = pts1.map((p) => add(mulv(p, k), [w + 2, 0]));
    const pic = (hl) => multiPoly([{ pts: pts1, sides: [`${w} cm`, '', '', ''], cap: 'A', hl }, { pts: pts2, sides: [`${dec(w * k)} cm`, '', '', ''], cap: 'B', hl, t: 'top' }], { W: 340, H: 200 });
    const ans = up ? dec(k) : { 2: '1/2', 3: '1/3', 1.5: '2/3' }[k];
    return num(ans, [
      St(`The scale factor from ${up ? 'A to B' : 'B to A'} is a matching side of the ${up ? 'new figure B' : 'new figure A'} divided by the one in ${up ? 'A' : 'B'}.`, pic([0])),
      St(up ? `${dec(w * k)} ÷ ${w} = ${dec(k)}.` : `${w} ÷ ${dec(w * k)} = ${ans}.`),
      St(`So the scale factor is ${ans}.`)], { q: `Trapezoid A is similar to trapezoid B. What scale factor takes ${up ? 'A onto B' : 'B onto A'}?`, visual: pic([]), expr: up ? `${w * k}/${w}` : `${w}/${w * k}` });
  }
  // matching angles of similar figures are equal
  const A = r.pick([35, 40, 50, 55, 65]), B = r.pick([60, 70, 75]), C = 180 - A - B, base = triPts(A, B), k = r.pick([1.5, 2]);
  const big = base.map((p) => add(mulv(p, k), [13, 0]));
  const pic = (done) => multiPoly([{ pts: base, angles: [`${A}°`, `${B}°`, ''], names: ['A', 'B', 'C'] }, { pts: big, angles: ['', done ? `${B}°` : 'x', ''], names: ['D', 'E', 'F'], hlAngles: done ? [1] : [], t: 'top' }], { W: 340, H: 210 });
  void C;
  return num(B, [
    St('Similar figures have the same shape: matching angles are equal, even though the sides are longer.', pic(false)),
    St(`∠E matches ∠B, so x = ${B}.`, pic(true)),
    St(`So x = ${B}°.`)], { q: '△ABC is similar to △DEF. Find the angle x.', visual: pic(false), unit: 'x =', expr: String(B) });
}

// ───────── lessons: the key ideas, each with its labelled picture ─────────
const fourAngles = { type: 'figs', figs: [angleFig({ deg: 50, label: '50°', W: 200, H: 150 }), angleFig({ deg: 90, W: 200, H: 150 }), angleFig({ deg: 130, label: '130°', W: 200, H: 150 }), angleFig({ deg: 180, label: '180°', W: 200, H: 150 })], captions: ['Acute', 'Right', 'Obtuse', 'Straight'] };
export const LESSONS = {
  angles: [
    L('A line goes on forever both ways (arrows at both ends). A ray has one endpoint and goes on forever one way. A segment has two endpoints.', { type: 'figs', figs: [linearFig('line'), linearFig('ray'), linearFig('segment')], captions: ['Line PQ', 'Ray PQ', 'Segment PQ'] }),
    L('An angle is made by two rays from one point, the vertex. ∠ABC has its vertex at B, the middle letter.', angleFig({ deg: 55, rot: 10, names: ['A', 'B', 'C'], label: '55°' })),
    L('Acute: less than 90°. Right: exactly 90° (a small square marks it). Obtuse: between 90° and 180°. Straight: 180°.', fourAngles),
    L('Parallel lines never meet (arrow marks). Perpendicular lines meet at a right angle.', { type: 'figs', figs: [twoLinesFig('parallel'), twoLinesFig('perpendicular')], captions: ['Parallel', 'Perpendicular'] }),
    L('A full turn is 360° and a straight angle is 180°, so 1/4 of a turn is 90°.', raysFig({ parts: [90], labels: ['90°'] })),
  ],
  anglePairs: [
    L('Complementary angles add to 90°: together they fill a right angle.', raysFig({ parts: [35, 55], labels: ['35°', '55°'], base: 'right' })),
    L('Supplementary angles add to 180°: side by side they make a straight line (a linear pair).', raysFig({ parts: [70, 110], labels: ['70°', '110°'], base: 'line' })),
    L('When two lines cross, the opposite (vertical) angles are equal, and angles next to each other add to 180°.', crossFig({ a: 50, labels: ['50°', '130°', '50°', '130°'], hl: [0, 2] })),
    L('Angles all the way round a point add to 360°. A bisector cuts an angle into two equal halves.', raysFig({ parts: [100, 130, 130], labels: ['100°', '130°', '130°'] })),
    L('With expressions, write the rule as an equation: (2x + 10) + (3x + 20) = 180 gives 5x = 150, so x = 30.'),
  ],
  transversal: [
    L('A transversal crosses two parallel lines (the arrows mark them parallel) and makes 8 angles: 4 at each crossing.', transversalFig({ deg: 60, labels: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8' } })),
    L('Corresponding angles sit in the same position at each crossing. They are equal.', transversalFig({ deg: 60, labels: { 1: '60°', 5: '60°' }, hl: [1, 5] })),
    L('Alternate interior angles are between the parallel lines, on opposite sides of the transversal (a Z shape). They are equal.', transversalFig({ deg: 60, labels: { 3: '60°', 5: '60°' }, hl: [3, 5] })),
    L('Co-interior angles are between the lines on the same side (a C shape). They add to 180°.', transversalFig({ deg: 60, labels: { 4: '120°', 5: '60°' }, hl: [4, 5] })),
    L('So with parallel lines there are just two sizes of angle, and the two sizes add to 180°.'),
  ],
  polygons: [
    L('A polygon is a closed shape with straight sides. It is named by its number of sides: 5 pentagon, 6 hexagon, 8 octagon.', { type: 'figs', figs: [polygonFig({ pts: G.regular(5) }), polygonFig({ pts: G.regular(6) }), polygonFig({ pts: G.regular(8) })], captions: ['Pentagon', 'Hexagon', 'Octagon'] }),
    L('Triangles by sides: equilateral (3 equal), isosceles (2 equal), scalene (none). Ticks mark equal sides.', { type: 'figs', figs: [polygonFig({ pts: triSides(5, 5, 5), ticks: [1, 1, 1] }), polygonFig({ pts: triSides(6, 6, 4), ticks: [0, 1, 1] }), polygonFig({ pts: triSides(4, 5, 7) })], captions: ['Equilateral', 'Isosceles', 'Scalene'] }),
    L('Triangles by angles: acute (all under 90°), right (one 90°), obtuse (one over 90°).', { type: 'figs', figs: [polygonFig({ pts: triPts(60, 70) }), polygonFig({ pts: triPts(90, 40), right: [0] }), polygonFig({ pts: triPts(120, 30), angles: ['120°'] })], captions: ['Acute', 'Right', 'Obtuse'] }),
    L('Quadrilaterals: arrows show parallel sides, ticks equal sides, squares right angles.', { type: 'figs', figs: [polygonFig(QUADS.parallelogram), polygonFig(QUADS.trapezoid), polygonFig(QUADS.kite)], captions: ['Parallelogram', 'Trapezoid', 'Kite'] }),
    L('A regular polygon has all sides equal and all angles equal.', polygonFig({ pts: G.regular(6), ticks: Array(6).fill(1), arcs: [0, 1, 2, 3, 4, 5] })),
  ],
  polyAngles: [
    L('The angles of a triangle add to 180°.', polygonFig({ pts: triPts(50, 70), angles: ['50°', '70°', '60°'] })),
    L('A quadrilateral splits into 2 triangles, so its angles add to 360°.', polygonFig({ pts: [[0, 0], [8, 0], [7, 5], [1.5, 4]], diag: [[0, 2]] })),
    L('A polygon with n sides splits into n − 2 triangles from one corner, so its angles add to (n − 2) × 180°. A hexagon: 4 × 180° = 720°.', G.triangulated(G.regular(6))),
    L('An exterior angle of a triangle equals the two far-away inside angles added together.', polygonFig({ pts: triPts(50, 70), angles: ['50°', '', '60°'], ext: 1, extLabel: '110°' })),
    L('The angles at the centre of a circle add to 360°.', slicesFig(6, '60°')),
  ],
  construct: [
    L('Constructions use only a compass (to copy distances and draw arcs) and a straightedge (to draw lines), with no measuring.'),
    L('Perpendicular bisector of AB: equal arcs from A and from B, wider than half of AB. The line through the two crossings cuts AB in half at a right angle.', perpBisFig(2)),
    L('Angle bisector: an arc from the vertex crosses both arms; equal arcs from those two points cross inside; the ray from the vertex through that crossing halves the angle.', angleBisFig(70, 2)),
    L('Equilateral triangle on AB: arcs of radius AB from A and from B meet at C.', equiFig(2)),
    L('Regular hexagon: step round a circle with the compass set to its radius, 6 times.', hexFig(2)),
  ],
  solids: [
    L('A face is a flat surface, an edge is where two faces meet, and a vertex is a corner. Dashed edges are hidden at the back.', G.boxFig({ l: 6, w: 3, h: 4 })),
    L('A prism has 2 matching bases joined by rectangles; it is named after its base. A pyramid has 1 base and triangles meeting at a point.', { type: 'figs', figs: [SOLIDS['triangular prism'](), SOLIDS['square pyramid']()], captions: ['Triangular prism', 'Square pyramid'] }),
    L('Cylinders, cones and spheres have curved surfaces.', { type: 'figs', figs: [SOLIDS.cylinder(), SOLIDS.cone(), SOLIDS.sphere()], captions: ['Cylinder', 'Cone', 'Sphere'] }),
    L('A net is the solid unfolded flat: every face appears once.', { type: 'figs', figs: [G.netFig({ cells: G.CUBE_NETS[5] }), G.cylinderNet(), G.pyramidNet()], captions: ['Cube', 'Cylinder', 'Square pyramid'] }),
    L('A cross-section is the flat face you get when you slice a solid.', { type: 'figs', figs: [G.sliceFig({ solid: 'cylinder', cut: 'across' }), G.sliceFig({ solid: 'cone', cut: 'down' })], captions: ['Circle', 'Triangle'] }),
  ],
  area: [
    L('Rectangle: A = length × width, the number of unit squares inside.', polygonFig({ pts: [[0, 0], [8, 0], [8, 4], [0, 4]], sides: ['l', 'w', '', ''], right: [0, 1, 2, 3] })),
    L('Parallelogram: A = base × height. The height is at right angles to the base, not the slanted side.', polygonFig({ pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], sides: ['b', '', '', ''], base: 0, height: { from: 3, side: 0, label: 'h' }, hl: ['base', 'height'] })),
    L('Triangle: A = base × height ÷ 2, because two copies make a parallelogram.', polygonFig({ pts: [[0, 0], [8, 0], [2.5, 5]], sides: ['b', '', ''], base: 0, height: { from: 2, side: 0, label: 'h' }, hl: ['base', 'height'] })),
    L('Trapezoid: A = (a + b) ÷ 2 × h, where a and b are the two parallel sides.', polygonFig({ pts: [[0, 0], [9, 0], [7, 4], [2, 4]], sides: ['b', '', 'a', ''], height: { from: 3, side: 0, label: 'h' }, par: [1, 0, 1, 0] })),
    L('Perimeter is the distance all the way round: add every side.'),
  ],
  circleParts: [
    L('The radius goes from the centre to the circle; the diameter goes right across through the centre: d = 2r.', G.circleFig({ show: 'both', r: 'r', d: 'd' })),
    L('Circumference (the distance round): C = π × d. Area: A = π × r². We use π ≈ 3.14.', G.circleFig({ show: 'radius', r: 'r', hl: 'fill' })),
    L('A semicircle is half a circle; a quarter circle is a quarter. Their perimeters include the straight edges too.', { type: 'figs', figs: [sectorFig({ deg: 180, hl: 'arc' }), sectorFig({ deg: 90, rLabel: 'r', hl: 'arc' })], captions: ['Semicircle', 'Quarter circle'] }),
    L('A sector with angle θ is θ/360 of the circle: its area is θ/360 × πr², and its arc is θ/360 × 2πr.', sectorFig({ deg: 60, rLabel: 'r', aLabel: 'θ', hl: 'fill' })),
  ],
  compoundArea: [
    L('Split a compound shape into shapes you know, find each area, then add.', polygonFig({ pts: [[0, 0], [8, 0], [8, 3], [3, 3], [3, 7], [0, 7]], regions: [{ pts: [[0, 0], [8, 0], [8, 3], [0, 3]], t: 'hl' }, { pts: [[0, 3], [3, 3], [3, 7], [0, 7]], t: 'hl2' }], cuts: [[[0, 3], [3, 3]]] })),
    L('Or start with a big shape and take away the part that is missing.', G.circleFig({ square: true, shade: 'outside', show: 'none' })),
    L('If every length is multiplied by k, the perimeter is multiplied by k and the area by k². Here k = 2: the area goes from 2 to 8, which is 2 × 2².', multiPoly([{ pts: [[0, 0], [2, 0], [2, 1], [0, 1]], sides: ['2', '1', '', ''] }, { pts: [[4, 0], [8, 0], [8, 2], [4, 2]], sides: ['4', '2', '', ''] }])),
    L('On a scale drawing, change each length to real size first, then find the area.'),
  ],
  volume: [
    L('Volume is the space inside a solid: how many unit cubes fill it, in cm³ or m³.', G.boxFig({ l: 4, w: 3, h: 2, cubes: true })),
    L('Any prism: V = area of the base × height. The base is one layer of cubes; the height says how many layers.', G.boxFig({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'], hl: ['base', 'height'] })),
    L('A triangular prism: the base is the triangle at the end, so V = (b × h ÷ 2) × length.', G.prismFig({ base: [[0, 0], [6, 0], [2, 4]], depth: 7, sides: ['b', '', ''], height: { from: 2, side: 0, label: 'h' }, depthLabel: 'length', hl: 'base' })),
    L('Cylinder: the base is a circle, so V = π × r² × h.', G.cylinderFig({ r: 3, h: 5, labels: ['r', 'h'], hl: ['base'] })),
    L('1 cm³ holds 1 mL, so 1000 cm³ is 1 L.'),
  ],
  surface: [
    L('Surface area is the total area of all the faces. Unfold the solid into its net and add every piece.', G.boxNet({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'] })),
    L('Box: 3 matching pairs of rectangles: SA = 2lw + 2lh + 2wh.', G.boxNet({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'], hl: 'tb' })),
    L('Cylinder: two circles and a rectangle whose length is the circumference: SA = 2πr² + 2πrh.', G.cylinderNet({ labels: ['r', 'h', '2πr'], hl: 'rect' })),
    L('Square pyramid: the square base plus 4 triangles; each triangle has the slant height as its height.', G.pyramidNet({ labels: ['s', 'slant'], hl: 'faces' })),
  ],
  transform: [
    L('A translation slides every point the same distance in the same direction.', gridFig({ R: 5, shapes: [{ pts: FLAG }, { pts: FLAG.map(MOVES.translation.f), t: 'hl' }], W: 220 })),
    L('A reflection flips a shape over a mirror line. In the y-axis: (x, y) → (−x, y). In the x-axis: (x, y) → (x, −y).', gridFig({ R: 5, shapes: [{ pts: FLAG }, { pts: FLAG.map(MOVES.reflection.f), t: 'hl' }], mirror: 'y', W: 220 })),
    L('A rotation turns a shape about a point. 90° clockwise: (x, y) → (y, −x). 180°: (x, y) → (−x, −y).', gridFig({ R: 5, shapes: [{ pts: FLAG }, { pts: FLAG.map(MOVES.rotation.f), t: 'hl' }], points: [[0, 0, 'O']], W: 220 })),
    L('The image is named with a prime: A moves to A′.'),
  ],
  congruence: [
    L('Congruent figures have the same size and shape. Slides, flips and turns make congruent copies.', gridFig({ R: 5, shapes: [{ pts: [[1, 1], [4, 1], [1, 3]], names: ['A', 'B', 'C'] }, { pts: [[-1, -1], [-4, -1], [-1, -3]], t: 'hl', names: ['A′', 'B′', 'C′'] }], W: 220 })),
    L('In △ABC ≅ △DEF the letters match in order: A ↔ D, B ↔ E, C ↔ F. Matching sides and angles are equal.', congPair(triPts(50, 70), { turn: 150, flip: true, n1: ['A', 'B', 'C'], n2: ['D', 'E', 'F'], hl1: [0], hl2: [0] })),
    L('A line of symmetry folds a shape onto itself. A regular polygon with n sides has n lines of symmetry.', symFig('a regular hexagon', true).f),
    L('A shape has rotational symmetry if it fits onto itself when turned less than a full turn.'),
  ],
  similar: [
    L('Similar figures have the same shape but not always the same size: matching angles are equal and matching sides are in the same ratio.', multiPoly([{ pts: triPts(50, 70).map((p) => mulv(p, 0.5)), angles: ['50°', '70°', ''] }, { pts: triPts(50, 70).map((p) => add(p, [7, 0])), angles: ['50°', '70°', ''], t: 'top' }])),
    L('The scale factor is new length ÷ old length. Multiply every length by it.', multiPoly([{ pts: [[0, 0], [2, 0], [2, 1], [0, 1]], sides: ['2', '1', '', ''] }, { pts: [[4, 0], [10, 0], [10, 3], [4, 3]], sides: ['6', '3', '', ''], t: 'top' }])),
    L('A dilation from the origin with scale factor k sends (x, y) to (kx, ky).', gridFig({ R: 6, points: [[0, 0, 'O'], [2, 1, 'A'], [4, 2, 'A′', 'hl']], shapes: [{ pts: [[0, 0], [4, 2]], t: 'ink' }], W: 220 })),
    L('Shadows at the same time of day make similar triangles, so height ÷ shadow is the same for a person and a tree.'),
  ],
};
