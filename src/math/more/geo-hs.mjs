// Figures for grades 9 and 10 geometry (circles, transformations on a grid, congruent and similar triangles,
// right-triangle trigonometry, constructions), composed from the primitives in src/math/figs.mjs.
// The main builder is scene(): named points in model coordinates (y up), fitted into the picture, with segments,
// filled shapes, tick marks, angle arcs (1–3 arcs), right-angle boxes, side labels, circles, sectors, arcs and an
// optional coordinate grid. Every other builder here is a scene.
import * as G from '../figs.mjs';

const { fig, frame, poly, line, text, path, circle, dot, sideLabel, rightMark, angleArc, ticks, parArrows } = G;
const R1 = (x) => Math.round(x * 10) / 10;
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mulv = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]) || 1;
const unit = (a) => mulv(a, 1 / len(a));
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const cen = (pts) => mulv(pts.reduce(add, [0, 0]), 1 / pts.length);
const rad = (d) => (d * Math.PI) / 180;
export const onCircle = (c, r, deg) => [c[0] + r * Math.cos(rad(deg)), c[1] + r * Math.sin(rad(deg))];

// scene({ P: { A: [x, y], … }, W, H, pad, fit: [extra points], grid: { x0, x1, y0, y1, step?, labels? },
//   circles: [{ c, r, t }], sectors: [{ c, r, from, to, t }], arcs: [{ c, r, from, to, t }] (degrees, anticlockwise),
//   fills: [{ pts: ['A', 'B', 'C'], t }], segs: [['A', 'B', t]], arrows: [['A', 'B', t]], ticks: [['A', 'B', n]],
//   par: [['A', 'B', n]], rights: [['C', 'A', 'B']], angs: [{ v, a, b, s, n, r, t }], sides: [['A', 'B', label, t, away]],
//   dots: ['O'], names: ['A', …] or { A: 'A′' }, notes: [{ at, s, t, size }] })
// A point can be a name or a raw [x, y].
export function scene(o) {
  const P = o.P ?? {};
  const pt = (p) => (typeof p === 'string' ? P[p] : p);
  const fit = [...Object.values(P), ...(o.fit ?? [])];
  for (const c of [...(o.circles ?? []), ...(o.sectors ?? [])]) { const C = pt(c.c); fit.push([C[0] - c.r, C[1] - c.r], [C[0] + c.r, C[1] + c.r]); }
  const g = o.grid;
  if (g) fit.push([g.x0, g.y0], [g.x1, g.y1]);
  const W = o.W ?? 300, H = o.H ?? 220;
  const F = frame(fit, { W, H, pad: o.pad ?? (g ? 22 : 34), maxScale: o.maxScale ?? Infinity });
  const S = (p) => F.m(pt(p));
  const items = [];
  if (g) {
    const st = g.step ?? 1, lab = g.labels ?? (g.x1 - g.x0 > 14 || g.y1 - g.y0 > 14 ? 4 : g.x1 - g.x0 > 9 || g.y1 - g.y0 > 9 ? 2 : 1);
    for (let x = Math.ceil(g.x0 / st) * st; x <= g.x1; x += st) if (x !== 0) items.push(line(F.m([x, g.y0]), F.m([x, g.y1]), 'grid'));
    for (let y = Math.ceil(g.y0 / st) * st; y <= g.y1; y += st) if (y !== 0) items.push(line(F.m([g.x0, y]), F.m([g.x1, y]), 'grid'));
    const ax = Math.min(Math.max(0, g.y0), g.y1), ay = Math.min(Math.max(0, g.x0), g.x1);
    items.push(line(F.m([g.x0, ax]), F.m([g.x1, ax]), 'ink'), line(F.m([ay, g.y0]), F.m([ay, g.y1]), 'ink'));
    if (g.axisNames !== false) items.push(text(add(F.m([g.x1, ax]), [-6, -9]), 'x', 'muted', { size: 11 }), text(add(F.m([ay, g.y1]), [9, 6]), 'y', 'muted', { size: 11 }));
    for (let x = Math.ceil(g.x0); x <= g.x1; x++) if (x && x % lab === 0 && x < g.x1) items.push(text(add(F.m([x, ax]), [0, 10]), String(x).replace('-', '−'), 'muted', { size: 10 }));
    for (let y = Math.ceil(g.y0); y <= g.y1; y++) if (y && y % lab === 0 && y < g.y1) items.push(text(add(F.m([ay, y]), [-9, 0]), String(y).replace('-', '−'), 'muted', { size: 10, anchor: 'end' }));
  }
  const arcPath = (c, r, from, to, closed) => {
    const C = S(c), R = r * F.s, a = S(onCircle(pt(c), r, from)), b = S(onCircle(pt(c), r, to));
    let sweep = (((to - from) % 360) + 360) % 360; if (sweep === 0) sweep = 360;
    const d = `${closed ? `M${R1(C[0])} ${R1(C[1])}L` : 'M'}${R1(a[0])} ${R1(a[1])}A${R1(R)} ${R1(R)} 0 ${sweep > 180 ? 1 : 0} 0 ${R1(b[0])} ${R1(b[1])}${closed ? 'Z' : ''}`;
    return d;
  };
  for (const c of o.circles ?? []) if ((c.t ?? 'ink') !== 'ink') items.push(circle(S(c.c), c.r * F.s, c.t));
  for (const s of o.sectors ?? []) items.push(path(arcPath(s.c, s.r, s.from, s.to, true), s.t ?? 'hl'));
  for (const f of o.fills ?? []) items.push(poly(f.pts.map(S), f.t ?? 'fig', f.open ? { open: true } : {}));
  for (const c of o.circles ?? []) if ((c.t ?? 'ink') === 'ink') items.push(circle(S(c.c), c.r * F.s, 'ink'));
  for (const a of o.arcs ?? []) items.push(path(arcPath(a.c, a.r, a.from, a.to, false), a.t ?? 'hlline'));
  for (const [a, b, t] of o.segs ?? []) items.push(line(S(a), S(b), t ?? 'ink'));
  for (const [a, b, t] of o.arrows ?? []) {
    const A = S(a), B = S(b), d = unit(sub(B, A)), n = [d[1], -d[0]], tip = sub(B, mulv(d, 5));
    items.push(line(A, tip, t ?? 'aux'), poly([add(sub(tip, mulv(d, 8)), mulv(n, 5)), tip, sub(sub(tip, mulv(d, 8)), mulv(n, 5))], t === 'hlline' ? 'mark' : 'mark', { open: true }));
  }
  for (const [a, b, n, t] of o.ticks ?? []) items.push(...ticks(S(a), S(b), n, t ?? 'mark'));
  for (const [a, b, n] of o.par ?? []) items.push(...parArrows(S(a), S(b), n));
  for (const [v, a, b] of o.rights ?? []) items.push(rightMark(S(v), S(a), S(b), 10));
  for (const A of o.angs ?? []) {
    const n = A.n ?? 1, r0 = A.r ?? 20;
    for (let k = 0; k < n; k++) items.push(...angleArc(S(A.v), S(A.a), S(A.b), k === n - 1 ? A.s ?? '' : '', r0 + 4 * k, A.t ?? 'mark'));
  }
  // the centre a label is pushed away from: the filled shape that holds the point(s), else the given point
  const awayFor = (names) => {
    const f = (o.fills ?? []).find((x) => names.every((nm) => x.pts.includes(nm)));
    if (f) return f.pts.map(S);
    if (o.circles?.length) return S(o.circles[0].c);
    return [F.W / 2, F.H / 2];
  };
  for (const [a, b, s, t, away] of o.sides ?? []) items.push(sideLabel(S(a), S(b), s, away ? (typeof away === 'string' ? S(away) : Array.isArray(away[0]) || typeof away[0] === 'string' ? away.map(S) : S(away)) : awayFor([a, b]), t ?? 'ink', o.sideOff ?? 14));
  // stacked labels outside a side, each placed by its size so none overlaps the line or the next:
  //   stack: [['A', 'B', [[text, tone, size], …]]]
  for (const [a, b, list] of o.stack ?? []) {
    const A = S(a), B = S(b), m = mid(A, B), d = unit(sub(B, A));
    let n = [d[1], -d[0]];
    const aw = awayFor([a, b]), c = Array.isArray(aw[0]) ? cen(aw) : aw;
    if ((m[0] - c[0]) * n[0] + (m[1] - c[1]) * n[1] < 0) n = mulv(n, -1);
    let dist = 5;
    for (const [s, t, size = 14] of list.filter((x) => x && x[0] !== '' && x[0] != null)) {
      const half = Math.abs(n[0]) * String(s).length * size * 0.31 + Math.abs(n[1]) * size * 0.55;
      dist += half; items.push(text(add(m, mulv(n, dist)), s, t ?? 'ink', { size })); dist += half + 2;
    }
  }
  for (const d of o.dots ?? []) items.push(dot(S(d), 'ink'));
  const names = Array.isArray(o.names) ? Object.fromEntries(o.names.map((n) => [n, n])) : o.names ?? {};
  for (const [k, s] of Object.entries(names)) {
    const p = S(k), aw = awayFor([k]), c = Array.isArray(aw[0]) ? cen(aw) : aw;
    let d = o.nameDir?.[k] ? [o.nameDir[k][0], -o.nameDir[k][1]] : sub(p, c);
    if (len(d) < 1) d = [0, -1];
    items.push(text(add(p, mulv(unit(d), 13)), s, o.nameTone?.[k] ?? 'muted', { size: 13 }));
  }
  for (const nt of o.notes ?? []) items.push(text(S(nt.at), nt.s, nt.t ?? 'ink', nt.size ? { size: nt.size } : {}));
  return fig(items, W, H);
}

// ── two triangles side by side: the second is the first turned, maybe flipped, and scaled by k ──
// returns [first three points, second three points] (model coordinates), the second to the right of the first
export function pairPts(T, { k = 1, turn = 0, flip = false, gap = 1.2 } = {}) {
  const c = cen(T), a = rad(turn);
  let U = T.map((p) => { let q = sub(p, c); if (flip) q = [-q[0], q[1]]; q = [q[0] * Math.cos(a) - q[1] * Math.sin(a), q[0] * Math.sin(a) + q[1] * Math.cos(a)]; return mulv(q, k); });
  const xmax = Math.max(...T.map((p) => p[0])), ux = Math.min(...U.map((p) => p[0])), ymin1 = Math.min(...T.map((p) => p[1])), uy = Math.min(...U.map((p) => p[1]));
  const span = Math.max(...T.map((p) => p[0])) - Math.min(...T.map((p) => p[0]));
  U = U.map((p) => [p[0] - ux + xmax + gap * span * 0.25 + 0.6, p[1] - uy + ymin1]);
  return [T, U];
}
// place U to the right of T (same bottom line), without turning it
export function besides(T, U) {
  const xmax = Math.max(...T.map((p) => p[0])), span = xmax - Math.min(...T.map((p) => p[0])), ux = Math.min(...U.map((p) => p[0])), uy = Math.min(...U.map((p) => p[1])), y1 = Math.min(...T.map((p) => p[1]));
  return U.map((p) => [p[0] - ux + xmax + 0.3 * span + 0.6, p[1] - uy + y1]);
}
// a triangle with the given angles (degrees at the first two corners) on a base of length b
export function triFromAngles(A, B, b = 6) {
  const C = 180 - A - B, sa = Math.sin(rad(A)), sc = Math.sin(rad(C));
  const ac = (b * Math.sin(rad(B))) / sc;
  void sa;
  return [[0, 0], [b, 0], [ac * Math.cos(rad(A)), ac * Math.sin(rad(A))]];
}
// a triangle with sides a = BC, b = CA, c = AB (A at the origin, B along the base)
export function triFromSides(a, b, c) {
  const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0.01, b * b - x * x));
  return [[0, 0], [c, 0], [x, y]];
}

// ── a right triangle for trigonometry ──
// rightTri({ w, h (real leg lengths: horizontal, vertical), theta: 'B' (bottom corner) | 'A' (top corner),
//   flip (right angle on the left), sides: { opp, adj, hyp } labels, roles: true (write opp/adj/hyp), hl: ['opp', …],
//   thetaLabel, names, other: label of the other acute angle })
export function rightTri(o) {
  const ratio = Math.min(1.7, Math.max(0.5, o.h / o.w));
  const s = o.flip ? -1 : 1;
  const P = { C: [0, 0], B: [-s * 2.2, 0], A: [0, ratio * 2.2] };
  const th = o.theta ?? 'B', other = th === 'B' ? 'A' : 'B';
  const side = { hyp: ['A', 'B'], opp: th === 'B' ? ['C', 'A'] : ['B', 'C'], adj: th === 'B' ? ['B', 'C'] : ['C', 'A'] };
  const hl = [].concat(o.hl ?? []);
  const segs = [], stack = [];
  const word = { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' };
  for (const k of ['opp', 'adj', 'hyp']) {
    const [a, b] = side[k], on = hl.includes(k);
    if (on) segs.push([a, b, 'hlline']);
    stack.push([a, b, [[o.sides?.[k] ?? '', on ? 'hl' : 'ink', 14], o.roles ? [word[k], on ? 'hl' : 'muted', 11] : null]]);
  }
  const angs = o.noTheta ? [] : [{ v: th, a: other, b: 'C', s: o.thetaLabel ?? 'θ', r: 24, t: hl.includes('theta') ? 'hlline' : 'mark' }];
  if (o.other) angs.push({ v: other, a: th, b: 'C', s: o.other, r: 20 });
  return scene({ P, W: o.W ?? 300, H: o.H ?? 220, pad: o.pad ?? 36, fit: o.roles ? [[s * 1.5, 0], [-s * 2.2, -0.35]] : [[s * 0.45, 0]], fills: [{ pts: ['A', 'B', 'C'], t: o.fill ?? 'fig' }], segs, rights: [['C', 'A', 'B']], angs, stack, names: o.names ? { A: o.names[0], B: o.names[1], C: o.names[2] } : {}, notes: o.notes });
}

// ── a coordinate grid with points, segments and polygons ──
// gridFig({ x0, x1, y0, y1, pts: [[x, y, name, tone?]], polys: [{ pts: [[x, y]…], t }], segs: [[[x,y],[x,y], t]],
//   circles: [{ c: [x, y], r, t }], arrows, rights, sides, W, H })
export function gridFig(o) {
  const P = {}, names = {}, nameTone = {};
  (o.pts ?? []).forEach(([x, y, n, t], i) => { const k = n ?? `p${i}`; P[k] = [x, y]; if (n) { names[k] = n; if (t) nameTone[k] = t; } });
  const fills = (o.polys ?? []).map((pp, j) => { const ks = pp.pts.map((p, i) => { const k = `q${j}_${i}`; P[k] = p; return k; }); return { pts: ks, t: pp.t ?? 'fig' }; });
  const sc = scene({ P, W: o.W ?? 260, H: o.H ?? 240, pad: 20, grid: { x0: o.x0, x1: o.x1, y0: o.y0, y1: o.y1, labels: o.labels }, fills, circles: o.circles, segs: o.segs, arrows: o.arrows, rights: o.rights, sides: o.sides, sideOff: 12, dots: Object.keys(names), names: {}, notes: o.notes });
  // name labels: up and to the right of the point unless told otherwise
  const F = frame([...Object.values(P), [o.x0, o.y0], [o.x1, o.y1], ...(o.circles ?? []).flatMap((c) => [[c.c[0] - c.r, c.c[1] - c.r], [c.c[0] + c.r, c.c[1] + c.r]])], { W: o.W ?? 260, H: o.H ?? 240, pad: 20 });
  for (const [k, s] of Object.entries(names)) {
    const p = F.m(P[k]), d = o.nameDir?.[s] ?? [1, 1];
    sc.items.push(text([p[0] + d[0] * 11, p[1] - d[1] * 10], s, nameTone[k] ?? 'ink', { size: 12 }));
  }
  return sc;
}
// a sensible square window round some points (and the origin)
export function window(pts, extra = 1, min = 5) {
  const xs = [0, ...pts.map((p) => p[0])], ys = [0, ...pts.map((p) => p[1])];
  let x0 = Math.min(...xs) - extra, x1 = Math.max(...xs) + extra, y0 = Math.min(...ys) - extra, y1 = Math.max(...ys) + extra;
  const span = Math.max(x1 - x0, y1 - y0, 2 * min);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  x0 = Math.floor(cx - span / 2); x1 = x0 + span; y0 = Math.floor(cy - span / 2); y1 = y0 + span;
  return { x0, x1, y0, y1 };
}

// ── shadows: a post and its shadow beside a tall object and its shadow (similar right triangles) ──
export function shadowFig({ h1, s1, h2, s2, labels = [], hl = [], tall = 'tree' }) {
  // drawn with the second one at most 2.4 times the first, so both can be read
  const k = Math.min(2.4, h2 / h1), sh = s1 / h1;
  const a = 1, b = k;
  const P = { A: [0, 0], A1: [0, a], A2: [a * sh, 0], B: [a * sh + 1.2, 0], B1: [a * sh + 1.2, b], B2: [a * sh + 1.2 + b * sh, 0] };
  const L = labels;
  return scene({
    P, W: 320, H: 210, pad: 30,
    segs: [[[-0.3, 0], [a * sh + 1.6 + b * sh, 0], 'ink'], ['A1', 'A2', 'aux'], ['B1', 'B2', 'aux'], ['A', 'A1', hl.includes('h1') ? 'hlline' : 'ink'], ['B', 'B1', hl.includes('h2') ? 'hlline' : 'ink'], ['A', 'A2', hl.includes('s1') ? 'hlline' : 'ink'], ['B', 'B2', hl.includes('s2') ? 'hlline' : 'ink']],
    fills: [{ pts: ['A', 'A1', 'A2'], t: 'top' }, { pts: ['B', 'B1', 'B2'], t: 'top' }],
    rights: [['A', 'A1', 'A2'], ['B', 'B1', 'B2']],
    angs: [{ v: 'A2', a: 'A1', b: 'A', s: '', r: 16 }, { v: 'B2', a: 'B1', b: 'B', s: '', r: 16 }],
    sides: [['A', 'A1', L[0], hl.includes('h1') ? 'hl' : 'ink', 'A2'], ['A', 'A2', L[1], hl.includes('s1') ? 'hl' : 'ink', 'A1'], ['B', 'B1', L[2], hl.includes('h2') ? 'hl' : 'ink', 'B2'], ['B', 'B2', L[3], hl.includes('s2') ? 'hl' : 'ink', 'B1']],
    notes: tall === 'none' ? [] : [],
  });
}
