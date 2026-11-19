// Geometry figures for questions, worked steps and lessons: labelled flat shapes, solids drawn in 3-D with hidden
// edges dashed, nets, cross-sections, circles and angle diagrams. Node-safe: a builder returns plain data
//   { type: 'fig', w, h, items: [...] }
// which visual() in src/app/ui.mjs draws (figSvg in src/app/figure.mjs), so scripts/check.mjs can check every figure.
//
// Items (screen coordinates, y down):
//   { k: 'poly', pts, t, open? }      a polygon (open = a polyline)
//   { k: 'line', a, b, t }            a segment
//   { k: 'path', d, t }               an SVG path (arcs for ellipses and angle marks)
//   { k: 'circle', c, r, t }
//   { k: 'text', at, s, t, size?, anchor? }
//   { k: 'dot', at, t }
// Tones: fig (the shape), front/top/side (faces of a solid), hl/hl2 (highlighted parts), shade (a shaded region),
// cut (a slicing plane), hidden (dashed hidden edge), aux (dashed construction line: heights, radii), mark (angle
// arcs, right-angle boxes, ticks), ink (a plain line), hlline (a highlighted edge), muted (light text).
//
// The `hl` option of each builder names the parts to highlight, so a worked example can light up the base, then the
// height, one step at a time.

const R1 = (x) => Math.round(x * 10) / 10;
const P = ([x, y]) => [R1(x), R1(y)];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mulv = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]) || 1;
const unit = (a) => mulv(a, 1 / len(a));
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const centroid = (pts) => mulv(pts.reduce(add, [0, 0]), 1 / pts.length);
const has = (hl, k) => hl === k || (Array.isArray(hl) && hl.includes(k));

// ── items ──
export const poly = (pts, t = 'fig', extra = {}) => ({ k: 'poly', pts: pts.map(P), t, ...extra });
export const line = (a, b, t = 'ink') => ({ k: 'line', a: P(a), b: P(b), t });
export const text = (at, s, t = 'ink', extra = {}) => ({ k: 'text', at: P(at), s: String(s), t, ...extra });
export const path = (d, t = 'ink') => ({ k: 'path', d, t });
export const circle = (c, r, t = 'fig') => ({ k: 'circle', c: P(c), r: R1(r), t });
export const dot = (at, t = 'ink') => ({ k: 'dot', at: P(at), t });
export const fig = (items, w = 300, h = 220) => ({ type: 'fig', w, h, items: items.flat().filter(Boolean) });

// ── fitting model coordinates (y up) into the picture ──
export function frame(pts, { W = 300, H = 220, pad = 36, maxScale = Infinity } = {}) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = Math.min((W - 2 * pad) / (x1 - x0 || 1), (H - 2 * pad) / (y1 - y0 || 1), maxScale);
  const ox = W / 2 - (s * (x0 + x1)) / 2, oy = H / 2 + (s * (y0 + y1)) / 2;
  return { m: ([x, y]) => [ox + s * x, oy - s * y], s, W, H };
}

// ── marks ──
// is p inside the polygon pts?
export const inside = (p, pts) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
// a label beside segment a–b, pushed away from `away`: a point (usually the shape's centre) or the shape's corners
// (then the label goes on the outside of that shape)
export function sideLabel(a, b, s, away, t = 'ink', off = 14) {
  if (s == null || s === '') return null;
  const m = mid(a, b), d = sub(b, a);
  let n = unit([d[1], -d[0]]);
  if (Array.isArray(away[0])) { if (inside(add(m, mulv(n, 3)), away)) n = mulv(n, -1); }
  else if ((m[0] - away[0]) * n[0] + (m[1] - away[1]) * n[1] < 0) n = mulv(n, -1);
  const long = String(s).length > 4 ? 6 : 0;
  return text(add(m, mulv(n, off + long * Math.abs(n[0]))), s, t);
}
// the little square at a right angle at V between rays to A and B
export function rightMark(V, A, B, size = 11) {
  const u = mulv(unit(sub(A, V)), size), w = mulv(unit(sub(B, V)), size);
  return poly([add(V, u), add(add(V, u), w), add(V, w)], 'mark', { open: true });
}
// an arc for the angle at V between rays to A and B (the smaller one), with its label
export function angleArc(V, A, B, label = '', r = 22, t = 'mark') {
  const u1 = unit(sub(A, V)), u2 = unit(sub(B, V));
  const cross = u1[0] * u2[1] - u1[1] * u2[0];
  const p1 = add(V, mulv(u1, r)), p2 = add(V, mulv(u2, r));
  const out = [path(`M${P(p1).join(' ')}A${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${P(p2).join(' ')}`, t)];
  if (label !== '' && label != null) {
    let bis = unit(add(u1, u2)); if (len(add(u1, u2)) < 0.05) bis = [u1[1], -u1[0]];
    out.push(text(add(V, mulv(bis, r + 11 + String(label).length * 1.8)), label, t === 'mark' ? 'hl' : t));
  }
  return out;
}
// n tick marks across the middle of a–b (equal sides)
export function ticks(a, b, n = 1, t = 'mark') {
  const m = mid(a, b), d = unit(sub(b, a)), nn = [d[1], -d[0]];
  return Array.from({ length: n }, (_, i) => { const c = add(m, mulv(d, (i - (n - 1) / 2) * 5)); return line(add(c, mulv(nn, 6)), sub(c, mulv(nn, 6)), t); });
}
// n arrowheads in the middle of a–b (parallel sides)
export function parArrows(a, b, n = 1, t = 'mark', at = 0.5) {
  const m = add(a, mulv(sub(b, a), at)), d = unit(sub(b, a)), nn = [d[1], -d[0]];
  return Array.from({ length: n }, (_, i) => { const tip = add(m, mulv(d, (i - (n - 1) / 2) * 7 + 4)); return poly([add(sub(tip, mulv(d, 7)), mulv(nn, 5)), tip, sub(sub(tip, mulv(d, 7)), mulv(nn, 5))], t, { open: true }); });
}
// foot of the perpendicular from p to the line through a and b
const foot = (p, a, b) => { const d = sub(b, a), k = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [add(a, mulv(d, k)), k]; };

// display sizes: keep the order of the real lengths but never draw one side 8 times another
export function squash(vals, lo = 0.35, pow = 0.7) {
  const mx = Math.max(...vals.map((v) => Math.abs(v))) || 1;
  return vals.map((v) => Math.max(lo, (Math.abs(v) / mx) ** pow));
}

// ── flat shapes ──
// polygonFig({ pts (model, y up), sides: [label of side i→i+1], angles: [label at vertex i], arcs: [vertex i with an
//   arc but no label], right: [vertex i], ticks: [n per side], par: [n per side], names: ['A', …], diag: [[i, j]],
//   height: { from: i, side: j, label }, regions: [{ pts, t, label }], cuts: [[p, q]], holes: [pts], shade, hl })
// hl: 'fill', 'height', 'base' (side `base`), { side: j } entries, or { angle: i } entries (arrays allowed)
export function polygonFig(o) {
  const all = [...o.pts, ...(o.extra ?? [])];
  const many = (o.angles ?? []).filter((x) => x != null && x !== '').length >= 4;
  const F = frame(all, { W: o.W ?? (many ? 340 : 300), H: o.H ?? (many ? 280 : 220), pad: o.pad ?? 38 });
  const pts = o.pts.map(F.m), c = centroid(pts), n = pts.length;
  const hl = [].concat(o.hl ?? []);
  const sideHl = (j) => hl.some((h) => h && h.side === j) || (hl.includes('base') && o.base === j);
  const angHl = (i) => hl.some((h) => h && h.angle === i);
  const items = [];
  const body = o.holes ? { k: 'path', d: [pts, ...o.holes.map((h) => h.map(F.m))].map((r) => `M${r.map((p) => P(p).join(' ')).join('L')}Z`).join(''), t: o.shade ? 'shade' : 'fig', evenodd: true } : poly(pts, has(hl, 'fill') ? 'hl' : o.shade ? 'shade' : 'fig');
  items.push(body);
  for (const r of o.regions ?? []) { const rp = r.pts.map(F.m); items.push(poly(rp, r.t ?? 'hl')); if (r.label) items.push(text(centroid(rp), r.label, r.t === 'hl2' ? 'hl2' : 'hl')); }
  if (o.holes) for (const h of o.holes) items.push(poly(h.map(F.m), 'fig', { hole: true }));
  else if (o.regions?.length) items.push(poly(pts, 'ink', { outline: true }));
  for (const [p, q] of o.cuts ?? []) items.push(line(F.m(p), F.m(q), 'aux'));
  for (const [i, j, t] of o.diag ?? []) items.push(line(pts[i], pts[j], t ?? 'aux'));
  for (let j = 0; j < n; j++) {
    const a = pts[j], b = pts[(j + 1) % n];
    if (sideHl(j)) items.push(line(a, b, 'hlline'));
    if (o.ticks?.[j]) items.push(...ticks(a, b, o.ticks[j]));
    if (o.par?.[j]) items.push(...parArrows(a, b, o.par[j], 'mark', o.sides?.[j] ? 0.25 : 0.5));
  }
  for (const i of o.right ?? []) items.push(rightMark(pts[i], pts[(i + n - 1) % n], pts[(i + 1) % n]));
  (o.angles ?? []).forEach((lab, i) => { if (lab != null && lab !== '') items.push(...angleArc(pts[i], pts[(i + n - 1) % n], pts[(i + 1) % n], lab, many ? 15 : 22, angHl(i) ? 'hlline' : 'mark')); });
  for (const i of o.arcs ?? []) items.push(...angleArc(pts[i], pts[(i + n - 1) % n], pts[(i + 1) % n], '', 18));
  if (o.height) {
    const { from, side, label } = o.height, a = pts[side], b = pts[(side + 1) % n], v = pts[from];
    const [f, k] = foot(v, a, b);
    if (k < 0 || k > 1) items.push(line(k < 0 ? a : b, f, 'hidden'));
    items.push(line(v, f, has(hl, 'height') ? 'hlline' : 'aux'), rightMark(f, v, k > 0.5 ? a : b, 9));
    if (label) { const m = mid(v, f), d = unit(sub(f, v)); let nn = [d[1], -d[0]]; if (nn[0] < 0) nn = mulv(nn, -1); items.push(text(add(m, mulv(nn, 12 + String(label).length * 2.5)), label, has(hl, 'height') ? 'hl' : 'ink')); }
  }
  (o.sides ?? []).forEach((s, j) => items.push(sideLabel(pts[j], pts[(j + 1) % n], s, pts, sideHl(j) ? 'hl' : 'ink')));
  (o.names ?? []).forEach((s, i) => { if (s) { const d = unit(sub(pts[i], c)); items.push(text(add(pts[i], mulv(d, 13)), s, 'muted', { size: 13 })); } });
  for (const t of o.notes ?? []) items.push(text(F.m(t.at), t.s, t.t ?? 'ink'));
  // ext: extend the side coming into vertex i past it, and mark the exterior angle there
  if (o.ext != null) {
    const i = o.ext, v = pts[i], e = add(v, mulv(unit(sub(v, pts[(i + n - 1) % n])), 40));
    items.push(line(v, e, 'aux'), ...angleArc(v, e, pts[(i + 1) % n], o.extLabel ?? '', 18, has(hl, 'ext') ? 'hlline' : 'mark'));
  }
  return fig(items, F.W, F.H);
}

// the corners of a regular n-gon (model coordinates, one side flat at the bottom)
export function regular(n, R = 5) {
  const start = -Math.PI / 2 - Math.PI / n;
  return Array.from({ length: n }, (_, i) => [R * Math.cos(start + (2 * Math.PI * i) / n), R * Math.sin(start + (2 * Math.PI * i) / n)]);
}
// a polygon cut into triangles from one corner (for the angle sum), triangles coloured in turn
export function triangulated(pts, { label = '', hl = 'all' } = {}) {
  const regs = [];
  for (let i = 1; i < pts.length - 1; i++) regs.push({ pts: [pts[0], pts[i], pts[i + 1]], t: i % 2 ? 'hl' : 'hl2', label: hl === 'all' ? `${i}` : '' });
  return polygonFig({ pts, regions: regs, diag: pts.slice(2, -1).map((_, k) => [0, k + 2, 'ink']), notes: label ? [] : [] });
}

// circleFig({ r: label, show: 'radius' | 'diameter' | 'both' | 'none', centre: 'O', sector: { deg, label }, square,
//   shade: 'disk' | 'sector' | 'outside' | 'half' | 'quarter', chord, hl })
export function circleFig(o = {}) {
  const W = o.W ?? 260, H = o.H ?? 220, C = [W / 2, H / 2], R = Math.min(W, H) / 2 - 30;
  const items = [];
  if (o.square) items.push(poly([[C[0] - R, C[1] - R], [C[0] + R, C[1] - R], [C[0] + R, C[1] + R], [C[0] - R, C[1] + R]], o.shade === 'outside' ? 'shade' : 'fig'));
  const part = o.shade === 'half' ? 180 : o.shade === 'quarter' ? 90 : null;
  if (part) {
    const end = [C[0] + R * Math.cos((part * Math.PI) / 180), C[1] - R * Math.sin((part * Math.PI) / 180)];
    items.push(path(`M${C.join(' ')}L${C[0] + R} ${C[1]}A${R} ${R} 0 ${part > 180 ? 1 : 0} 0 ${P(end).join(' ')}Z`, has(o.hl, 'fill') ? 'hl' : 'fig'));
  } else items.push(circle(C, R, o.shade === 'outside' ? 'paper' : has(o.hl, 'fill') ? 'hl' : o.shade === 'disk' ? 'shade' : 'fig'));
  if (o.sector) {
    const a = (o.sector.deg * Math.PI) / 180, e = [C[0] + R * Math.cos(-a), C[1] + R * Math.sin(-a)];
    items.push(path(`M${C.join(' ')}L${C[0] + R} ${C[1]}A${R} ${R} 0 ${o.sector.deg > 180 ? 1 : 0} 0 ${P(e).join(' ')}Z`, 'hl'));
    items.push(...angleArc(C, [C[0] + R, C[1]], e, o.sector.label ?? `${o.sector.deg}°`, 20, 'mark'));
  }
  if (o.chord) { const [a1, a2] = o.chord.map((d) => (d * Math.PI) / 180); items.push(line([C[0] + R * Math.cos(a1), C[1] - R * Math.sin(a1)], [C[0] + R * Math.cos(a2), C[1] - R * Math.sin(a2)], 'ink')); }
  const show = o.show ?? 'radius';
  if (show === 'radius' || show === 'both') { const ra = o.sector ? 2.4 : -0.6, e = [C[0] + R * Math.cos(ra), C[1] + R * Math.sin(ra)]; items.push(line(C, e, has(o.hl, 'radius') ? 'hlline' : 'aux')); if (o.r != null) items.push(text(add(mid(C, e), [-4, -12]), o.r, has(o.hl, 'radius') ? 'hl' : 'ink')); }
  if (show === 'diameter' || show === 'both') { items.push(line([C[0] - R, C[1] + (show === 'both' ? 0 : 0)], [C[0] + R, C[1]], has(o.hl, 'diameter') ? 'hlline' : 'aux')); if (o.d != null) items.push(text([C[0] - R / 2, C[1] + 14], o.d, has(o.hl, 'diameter') ? 'hl' : 'ink')); }
  if (o.square && o.side != null) items.push(text([C[0], C[1] + R + 16], o.side));
  items.push(dot(C));
  if (o.centre) items.push(text([C[0] - 10, C[1] + 12], o.centre, 'muted', { size: 12 }));
  return fig(items, W, H);
}

// two lines crossed by a third (parallel lines and a transversal), angles 1–8 or given labels; deg = the acute angle
export function transversalFig({ deg = 60, labels = {}, hl = [], parallel = true } = {}) {
  const W = 300, H = 220, a = (deg * Math.PI) / 180;
  const y1 = 70, y2 = 150, dir = [Math.cos(a), -Math.sin(a)];
  const at = (y) => [W / 2 + ((y - H / 2) / -Math.sin(a)) * Math.cos(a), y];
  const P1 = at(y1), P2 = at(y2), ext = 170;
  const items = [line([16, y1], [W - 16, y1], 'ink'), line([16, y2], [W - 16, y2], 'ink'), line(sub(P2, mulv(dir, 70)), add(P1, mulv(dir, 70)), 'ink')];
  if (parallel) items.push(...parArrows([30, y1], [90, y1]), ...parArrows([30, y2], [90, y2]));
  // angle positions around each crossing: 1 top-right, 2 top-left, 3 bottom-left, 4 bottom-right (then 5–8 below)
  const spots = (V, k0) => {
    const R = [1, 0], L = [-1, 0], up = dir, dn = mulv(dir, -1);
    return [[k0 + 1, R, up], [k0 + 2, up, L], [k0 + 3, L, dn], [k0 + 4, dn, R]].map(([k, u, w]) => ({ k, V, u, w }));
  };
  void ext;
  for (const s of [...spots(P1, 0), ...spots(P2, 4)]) {
    const lab = labels[s.k]; if (lab == null) continue;
    items.push(...angleArc(s.V, add(s.V, s.u), add(s.V, s.w), lab, 20, hl.includes(s.k) ? 'hlline' : 'mark'));
  }
  return fig(items, W, H);
}
// two angles side by side on a line (supplementary), at a right angle (complementary), or crossing lines (vertical)
export function anglePairFig({ kind = 'supp', deg = 50, labels = ['', ''], hl = [] } = {}) {
  const W = 300, H = 180, V = [150, 130], a = (deg * Math.PI) / 180, ray = (t, r = 110) => add(V, [r * Math.cos(t), -r * Math.sin(t)]);
  const items = [];
  if (kind === 'supp') {
    items.push(line(ray(Math.PI), ray(0), 'ink'), line(V, ray(a), 'ink'));
    items.push(...angleArc(V, ray(0), ray(a), labels[0], 26, hl.includes(0) ? 'hlline' : 'mark'), ...angleArc(V, ray(a), ray(Math.PI), labels[1], 34, hl.includes(1) ? 'hlline' : 'mark'));
  } else if (kind === 'comp') {
    const V2 = [80, 160], r2 = (t) => add(V2, [150 * Math.cos(t), -150 * Math.sin(t)]);
    items.push(line(V2, r2(0), 'ink'), line(V2, r2(Math.PI / 2), 'ink'), line(V2, r2(a), 'ink'), rightMark(V2, r2(0), r2(Math.PI / 2), 12));
    items.push(...angleArc(V2, r2(0), r2(a), labels[0], 40, hl.includes(0) ? 'hlline' : 'mark'), ...angleArc(V2, r2(a), r2(Math.PI / 2), labels[1], 56, hl.includes(1) ? 'hlline' : 'mark'));
    return fig(items, W, 200);
  } else {
    const V3 = [150, 95], r3 = (t) => add(V3, [120 * Math.cos(t), -120 * Math.sin(t) * 0.65]);
    items.push(line(r3(Math.PI + a), r3(a), 'ink'), line(r3(Math.PI), r3(0), 'ink'));
    items.push(...angleArc(V3, r3(0), r3(a), labels[0], 24, hl.includes(0) ? 'hlline' : 'mark'), ...angleArc(V3, r3(Math.PI), r3(Math.PI + a), labels[1], 24, hl.includes(1) ? 'hlline' : 'mark'));
    if (labels[2] != null) items.push(...angleArc(V3, r3(a), r3(Math.PI), labels[2], 30, hl.includes(2) ? 'hlline' : 'mark'));
    return fig(items, W, 190);
  }
  return fig(items, W, H);
}

// ── solids, drawn in oblique projection: depth goes up and to the right, hidden edges dashed ──
const DX = 0.42, DY = 0.3;
const proj = ([x, y, z]) => [x + z * DX, y + z * DY];

// boxFig({ l, w, h (numbers), labels: [l, w, h], hl: 'base' | 'top' | 'front' | 'right' | 'height' | 'length' |
//   'width' (or an array), cubes: true (unit-cube grid; real proportions), cube: true })
export function boxFig(o) {
  const [L, Wd, Hh] = o.cubes ? [o.l, o.w, o.h] : squash([o.l, o.w, o.h]).map((v, i) => v * (i === 1 ? 1.25 : 1));
  const V = { a: [0, 0, 0], b: [L, 0, 0], c: [L, Hh, 0], d: [0, Hh, 0], e: [0, 0, Wd], f: [L, 0, Wd], g: [L, Hh, Wd], h: [0, Hh, Wd] };
  const F = frame(Object.values(V).map(proj), { W: o.W ?? 300, H: o.H ?? 220, pad: o.pad ?? 36 });
  const S = Object.fromEntries(Object.entries(V).map(([k, v]) => [k, F.m(proj(v))]));
  const hl = o.hl ?? [];
  const items = [
    poly([S.a, S.b, S.c, S.d], has(hl, 'front') ? 'hl' : 'front'),
    poly([S.d, S.c, S.g, S.h], has(hl, 'top') ? 'hl' : 'top'),
    poly([S.b, S.f, S.g, S.c], has(hl, 'right') ? 'hl' : 'side'),
    ...(o.cubes ? [] : [line(S.a, S.e, 'hidden'), line(S.e, S.f, 'hidden'), line(S.e, S.h, 'hidden')]),
  ];
  if (has(hl, 'base')) items.splice(0, 0, poly([S.a, S.b, S.f, S.e], 'hl'));
  if (o.cubes) {
    const sx = mulv(sub(S.b, S.a), 1 / o.l), sy = mulv(sub(S.d, S.a), 1 / o.h), sz = mulv(sub(S.e, S.a), 1 / o.w);
    const g = (from, to, n, step) => Array.from({ length: Math.max(0, Math.round(n) - 1) }, (_, i) => line(add(from, mulv(step, i + 1)), add(to, mulv(step, i + 1)), 'grid'));
    items.push(...g(S.a, S.d, o.l, sx), ...g(S.a, S.b, o.h, sy),           // front: columns, rows
      ...g(S.d, S.h, o.l, sx), ...g(S.d, S.c, o.w, sz),                    // top
      ...g(S.b, S.c, o.w, sz), ...g(S.b, S.f, o.h, sy));                   // right side
  }
  if (has(hl, 'height')) items.push(line(S.a, S.d, 'hlline'));
  if (has(hl, 'length')) items.push(line(S.a, S.b, 'hlline'));
  if (has(hl, 'width')) items.push(line(S.b, S.f, 'hlline'));
  const c = centroid(Object.values(S));
  const [lL, wL, hL] = o.labels ?? [];
  items.push(sideLabel(S.a, S.b, lL, c, has(hl, 'length') ? 'hl' : 'ink'), sideLabel(S.b, S.f, wL, c, has(hl, 'width') ? 'hl' : 'ink'), sideLabel(S.a, S.d, hL, c, has(hl, 'height') ? 'hl' : 'ink'));
  return fig(items, F.W, F.H);
}

// prismFig({ base: [[x, y], …] the end face (model, y up), depth (display length), sides: [labels of the end face],
//   depthLabel, height: { from, side, label } on the end face, hl: 'base' (end face) | 'depth' | 'sides' })
export function prismFig(o) {
  let base = o.base;
  const area = base.reduce((s, p, i) => s + p[0] * base[(i + 1) % base.length][1] - base[(i + 1) % base.length][0] * p[1], 0);
  if (area < 0) base = [...base].reverse();
  const n = base.length, D = o.depth ?? 4;
  const front = base.map(([x, y]) => [x, y, 0]), back = base.map(([x, y]) => [x, y, D]);
  const F = frame([...front, ...back].map(proj), { W: o.W ?? 300, H: o.H ?? 220, pad: o.pad ?? 36 });
  const fp = front.map((p) => F.m(proj(p))), bp = back.map((p) => F.m(proj(p)));
  const dv = [DX, DY];
  const vis = base.map((p, i) => { const q = base[(i + 1) % n], e = sub(q, p); return e[1] * dv[0] - e[0] * dv[1] > 1e-9; });
  const hl = o.hl ?? [];
  const items = [];
  for (let i = 0; i < n; i++) if (vis[i]) items.push(poly([fp[i], fp[(i + 1) % n], bp[(i + 1) % n], bp[i]], has(hl, 'sides') ? 'hl2' : 'side'));
  for (let i = 0; i < n; i++) if (!vis[i]) items.push(line(bp[i], bp[(i + 1) % n], 'hidden'));
  for (let i = 0; i < n; i++) { const seen = vis[i] || vis[(i + n - 1) % n]; if (!seen) items.push(line(fp[i], bp[i], 'hidden')); }
  items.push(poly(fp, has(hl, 'base') ? 'hl' : 'front'));
  const c = centroid(fp);
  if (o.height) {
    const { from, side, label } = o.height, v = fp[from], a = fp[side], b = fp[(side + 1) % n], [f] = foot(v, a, b);
    items.push(line(v, f, has(hl, 'height') ? 'hlline' : 'aux'), rightMark(f, v, a, 8));
    if (label) items.push(text(add(mid(v, f), [-14 - String(label).length * 2.5, 0]), label, has(hl, 'height') ? 'hl' : 'ink'));
  }
  (o.sides ?? []).forEach((s, j) => items.push(sideLabel(fp[j], fp[(j + 1) % n], s, c, has(hl, 'base') ? 'hl' : 'ink')));
  if (o.depthLabel) {
    // the depth is labelled along a visible connecting edge, as low as possible
    let k = 0, best = -Infinity;
    for (let i = 0; i < n; i++) if ((vis[i] || vis[(i + n - 1) % n]) && fp[i][1] > best - 0.01 && fp[i][0] >= (fp[k]?.[0] ?? 0) - 1) { best = fp[i][1]; k = i; }
    if (has(hl, 'depth')) items.push(line(fp[k], bp[k], 'hlline'));
    items.push(sideLabel(fp[k], bp[k], o.depthLabel, centroid([...fp, ...bp]), has(hl, 'depth') ? 'hl' : 'ink'));
  }
  return fig(items, F.W, F.H);
}

// an ellipse as two arcs: the back half dashed (or solid when `whole`), the front half solid
function ellipse(C, rx, ry, { back = 'hidden', front = 'ink', fill = null } = {}) {
  const L = P([C[0] - rx, C[1]]).join(' '), Rr = P([C[0] + rx, C[1]]).join(' ');
  const out = [];
  if (fill) out.push({ k: 'path', d: `M${L}A${R1(rx)} ${R1(ry)} 0 1 0 ${Rr}A${R1(rx)} ${R1(ry)} 0 1 0 ${L}Z`, t: fill });
  out.push(path(`M${L}A${R1(rx)} ${R1(ry)} 0 0 1 ${Rr}`, back), path(`M${L}A${R1(rx)} ${R1(ry)} 0 0 0 ${Rr}`, front));
  return out;
}

// cylinderFig({ r, h (numbers), labels: [r, h], hl: 'base' | 'top' | 'height' | 'radius' | 'side' })
export function cylinderFig(o) {
  const [r, h] = squash([o.r * 1.3, o.h]);
  const ry = r * 0.32;
  const F = frame([[-r, -ry], [r, h + ry]], { W: o.W ?? 260, H: o.H ?? 230, pad: o.pad ?? 34 });
  const s = F.s, B = F.m([0, 0]), T = F.m([0, h]), rx = s * r, rys = s * ry, hl = o.hl ?? [];
  const items = [
    poly([[B[0] - rx, B[1]], [T[0] - rx, T[1]], [T[0] + rx, T[1]], [B[0] + rx, B[1]]], has(hl, 'side') ? 'hl2' : 'side'),
    { k: 'path', d: `M${P([B[0] - rx, B[1]]).join(' ')}A${R1(rx)} ${R1(rys)} 0 0 0 ${P([B[0] + rx, B[1]]).join(' ')}Z`, t: has(hl, 'side') ? 'hl2' : 'side' },
    ...ellipse(B, rx, rys, { fill: has(hl, 'base') ? 'hlsoft' : null, back: 'hidden', front: 'ink' }),
    line([B[0] - rx, B[1]], [T[0] - rx, T[1]], 'ink'), line([B[0] + rx, B[1]], [T[0] + rx, T[1]], 'ink'),
    { k: 'path', d: `M${P([T[0] - rx, T[1]]).join(' ')}A${R1(rx)} ${R1(rys)} 0 1 0 ${P([T[0] + rx, T[1]]).join(' ')}A${R1(rx)} ${R1(rys)} 0 1 0 ${P([T[0] - rx, T[1]]).join(' ')}Z`, t: has(hl, 'top') ? 'hl' : 'top' },
  ];
  const [rL, hL] = o.labels ?? [];
  items.push(line(T, [T[0] + rx, T[1]], has(hl, 'radius') ? 'hlline' : 'aux'), dot(T));
  if (rL) items.push(text([T[0] + rx / 2, T[1] - 10], rL, has(hl, 'radius') ? 'hl' : 'ink'));
  if (has(hl, 'height')) items.push(line([B[0] + rx, B[1]], [T[0] + rx, T[1]], 'hlline'));
  if (hL) items.push(text([B[0] + rx + 16 + String(hL).length * 2.5, (B[1] + T[1]) / 2], hL, has(hl, 'height') ? 'hl' : 'ink'));
  return fig(items, F.W, F.H);
}

// coneFig({ r, h, labels: [r, h, slant], hl: 'base' | 'height' | 'radius' | 'slant' })
export function coneFig(o) {
  const [r, h] = squash([o.r * 1.3, o.h]);
  const ry = r * 0.32;
  const F = frame([[-r, -ry], [r, h]], { W: o.W ?? 260, H: o.H ?? 230, pad: o.pad ?? 34 });
  const s = F.s, B = F.m([0, 0]), A = F.m([0, h]), rx = s * r, rys = s * ry, hl = o.hl ?? [];
  const items = [
    poly([[B[0] - rx, B[1]], A, [B[0] + rx, B[1]]], 'side'),
    { k: 'path', d: `M${P([B[0] - rx, B[1]]).join(' ')}A${R1(rx)} ${R1(rys)} 0 0 0 ${P([B[0] + rx, B[1]]).join(' ')}Z`, t: 'side' },
    ...ellipse(B, rx, rys, { fill: has(hl, 'base') ? 'hlsoft' : null }),
    line([B[0] - rx, B[1]], A, 'ink'), line([B[0] + rx, B[1]], A, has(hl, 'slant') ? 'hlline' : 'ink'),
  ];
  const [rL, hL, lL] = o.labels ?? [];
  if (hL || has(hl, 'height')) items.push(line(A, B, has(hl, 'height') ? 'hlline' : 'aux'), rightMark(B, A, [B[0] + rx, B[1]], 8));
  if (hL) items.push(text([B[0] + 12 + String(hL).length * 3, (A[1] + B[1]) / 2 + 10], hL, has(hl, 'height') ? 'hl' : 'ink'));
  items.push(line(B, [B[0] + rx, B[1]], has(hl, 'radius') ? 'hlline' : 'aux'), dot(B));
  if (rL) items.push(text([B[0] + rx / 2, B[1] + 14], rL, has(hl, 'radius') ? 'hl' : 'ink'));
  if (lL) items.push(text([(A[0] + B[0] + rx) / 2 + 16 + String(lL).length * 2.5, (A[1] + B[1]) / 2], lL, has(hl, 'slant') ? 'hl' : 'ink'));
  return fig(items, F.W, F.H);
}

// pyramidFig({ a (base edge), h, labels: [a, h, slant], hl: 'base' | 'height' | 'slant' | 'face', tri: true for a
//   triangular base })
export function pyramidFig(o) {
  const [a, h] = squash([o.a * 1.4, o.h]);
  const base = o.tri ? [[0, 0, 0], [a, 0, 0], [a * 0.85, 0, a * 0.9]] : [[0, 0, 0], [a, 0, 0], [a, 0, a], [0, 0, a]];
  const cen = o.tri ? [a * 0.617, 0, a * 0.3] : [a / 2, 0, a / 2], apex = [cen[0], h, cen[2]];
  const F = frame([...base, apex].map(proj), { W: o.W ?? 280, H: o.H ?? 230, pad: o.pad ?? 36 });
  const S = base.map((p) => F.m(proj(p))), A = F.m(proj(apex)), C = F.m(proj(cen)), hl = o.hl ?? [];
  const items = [];
  if (has(hl, 'base')) items.push(poly(S, 'hlsoft'));
  if (o.tri) {
    items.push(line(S[0], S[2], 'hidden'), line(S[2], A, 'ink'), line(S[1], S[2], 'ink'));
    items.push(poly([S[0], S[1], A], has(hl, 'face') ? 'hl' : 'front'), poly([S[1], S[2], A], 'side'));
  } else {
    items.push(line(S[3], S[0], 'hidden'), line(S[3], S[2], 'hidden'), line(S[3], A, 'hidden'));
    items.push(poly([S[0], S[1], A], has(hl, 'face') ? 'hl' : 'front'), poly([S[1], S[2], A], 'side'));
  }
  const [aL, hL, lL] = o.labels ?? [];
  if (hL || has(hl, 'height')) items.push(line(A, C, has(hl, 'height') ? 'hlline' : 'aux'), dot(C));
  if (hL) items.push(text([C[0] - 14 - String(hL).length * 2.5, (A[1] + C[1]) / 2 - 6], hL, has(hl, 'height') ? 'hl' : 'ink'));
  const M = mid(S[0], S[1]);
  if (lL || has(hl, 'slant')) items.push(line(A, M, has(hl, 'slant') ? 'hlline' : 'aux'), rightMark(M, A, S[1], 7));
  if (lL) items.push(text(add(mid(A, M), [12 + String(lL).length * 2.5, 8]), lL, has(hl, 'slant') ? 'hl' : 'ink'));
  if (aL) items.push(sideLabel(S[0], S[1], aL, C, 'ink', 16));
  return fig(items, F.W, F.H);
}

// sphereFig({ labels: [r], hl: 'radius', hemi: true for a hemisphere })
export function sphereFig(o = {}) {
  const W = o.W ?? 240, H = o.H ?? (o.hemi ? 170 : 220), R = o.hemi ? 92 : 82, C = o.hemi ? [W / 2, 120] : [W / 2, H / 2], ry = R * 0.3;
  const items = o.hemi
    ? [path(`M${C[0] - R} ${C[1]}A${R} ${R} 0 0 1 ${C[0] + R} ${C[1]}A${R} ${R1(ry)} 0 0 1 ${C[0] - R} ${C[1]}Z`, 'side'), ...ellipse(C, R, ry, { back: 'ink', fill: 'top' })]
    : [circle(C, R, 'side'), ...ellipse(C, R, ry)];
  items.push(line(C, [C[0] + R, C[1]], has(o.hl, 'radius') ? 'hlline' : 'aux'), dot(C));
  if (o.labels?.[0]) items.push(text([C[0] + R / 2, C[1] - 11], o.labels[0], has(o.hl, 'radius') ? 'hl' : 'ink'));
  return fig(items, W, H);
}

// ── cross-sections: the solid with the slice shown on it ──
// sliceFig({ solid: 'box' | 'cube' | 'cylinder' | 'cone' | 'pyramid' | 'sphere', cut: 'across' | 'down' })
export function sliceFig({ solid, cut = 'across' }) {
  if (solid === 'box' || solid === 'cube') {
    const f = boxFig({ l: solid === 'cube' ? 1 : 1.6, w: 1, h: solid === 'cube' ? 1 : 0.8, cubes: true });
    const ps = f.items.filter((x) => x.k === 'poly');
    const front = ps[0].pts, top = ps[1].pts, side = ps[2].pts;
    if (cut === 'across') {
      const y = (front[0][1] + front[3][1]) / 2, dy = y - front[0][1];
      const q = [[front[0][0], y], [front[1][0], y], [side[1][0], side[1][1] + dy], [side[1][0] - (front[1][0] - front[0][0]), side[1][1] + dy]];
      f.items.push(poly(q, 'cut'));
    } else {
      const x = (front[0][0] + front[1][0]) / 2, dx = x - front[0][0];
      f.items.push(poly([[x, front[0][1]], [x, front[3][1]], [top[3][0] + dx, top[3][1]], [top[3][0] + dx, top[3][1] + (front[0][1] - front[3][1])]], 'cut'));
    }
    void top;
    return f;
  }
  if (solid === 'cylinder' || solid === 'cone') {
    const f = solid === 'cylinder' ? cylinderFig({ r: 1, h: 1.4 }) : coneFig({ r: 1, h: 1.5 });
    const b = f.items.find((x) => x.k === 'line' && x.t === 'ink');
    const [A, B] = [b.a, b.b];                               // the left side, bottom to top
    const cx = f.items.find((x) => x.k === 'dot').at[0];
    if (cut === 'across') {
      const y = (A[1] + B[1]) / 2, half = cx - (A[0] + B[0]) / 2, ry = Math.abs(half) * 0.32;
      f.items.push({ k: 'path', d: `M${R1(cx - half)} ${R1(y)}A${R1(half)} ${R1(ry)} 0 1 0 ${R1(cx + half)} ${R1(y)}A${R1(half)} ${R1(ry)} 0 1 0 ${R1(cx - half)} ${R1(y)}Z`, t: 'cut' });
    } else f.items.push(poly(solid === 'cylinder' ? [A, B, [2 * cx - B[0], B[1]], [2 * cx - A[0], A[1]]] : [A, B, [2 * cx - A[0], A[1]]], 'cut'));
    return f;
  }
  if (solid === 'pyramid') {
    const f = pyramidFig({ a: 1, h: 1.1 });
    const lines = f.items.filter((x) => x.k === 'poly' && (x.t === 'front' || x.t === 'side'));
    const [p0, p1, A] = lines[0].pts, [, p2] = lines[1].pts, p3 = [p0[0] + (p2[0] - p1[0]), p0[1] + (p2[1] - p1[1])];
    const half = (p) => mid(p, A);
    f.items.push(poly(cut === 'across' ? [half(p0), half(p1), half(p2), half(p3)] : [mid(p0, p1), A, mid(p3, p2)], 'cut'));
    return f;
  }
  const f = sphereFig({});
  f.items.push({ k: 'path', d: 'M38 110A82 24.6 0 1 0 202 110A82 24.6 0 1 0 38 110Z', t: 'cut' });
  return f;
}

// ── nets ──
// netFig({ cells: [[col, row], …], size }) — squares on a grid (cube nets)
export function netFig({ cells, hl = [] }) {
  const cols = Math.max(...cells.map((c) => c[0])) + 1, rows = Math.max(...cells.map((c) => c[1])) + 1;
  const s = Math.min(260 / cols, 180 / rows, 52), W = cols * s + 40, H = rows * s + 40;
  return fig(cells.map(([c, r], i) => poly([[20 + c * s, 20 + r * s], [20 + (c + 1) * s, 20 + r * s], [20 + (c + 1) * s, 20 + (r + 1) * s], [20 + c * s, 20 + (r + 1) * s]], hl.includes(i) ? 'hl' : 'front')), W, H);
}
// the 11 nets of a cube, and some arrangements of 6 squares that do not fold into one
export const CUBE_NETS = [[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[2,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]],[[0,0],[1,0],[1,1],[2,1],[3,1],[1,2]],[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]],[[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[2,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]],[[0,0],[0,1],[1,1],[2,1],[3,1],[0,2]],[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]]];   // all 11, found by foldsToCube
export const NOT_CUBE_NETS = [
  [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]], [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [2, 0]],
  [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 0]], [[0, 0], [1, 0], [1, 1], [2, 1], [1, 2], [2, 2]], [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2]],
];
// does a set of 6 squares fold into a cube? Roll a cube over the squares: each square must meet a different face.
export function foldsToCube(cells) {
  const key = (c) => c.join(','), at = new Map(cells.map((c) => [key(c), c])), seen = new Map();
  const roll = { E: (f) => ({ U: f.W, D: f.E, E: f.U, W: f.D, N: f.N, S: f.S }), W: (f) => ({ U: f.E, D: f.W, W: f.U, E: f.D, N: f.N, S: f.S }),
    N: (f) => ({ U: f.S, D: f.N, N: f.U, S: f.D, E: f.E, W: f.W }), S: (f) => ({ U: f.N, D: f.S, S: f.U, N: f.D, E: f.E, W: f.W }) };
  const q = [[cells[0], { U: 'U', D: 'D', N: 'N', S: 'S', E: 'E', W: 'W' }]]; seen.set(key(cells[0]), 'D');
  while (q.length) {
    const [[c, r], f] = q.shift();
    for (const [dir, dc, dr] of [['E', 1, 0], ['W', -1, 0], ['N', 0, -1], ['S', 0, 1]]) {
      const k = key([c + dc, r + dr]); if (!at.has(k) || seen.has(k)) continue;
      const g = roll[dir](f); seen.set(k, g.D); q.push([[c + dc, r + dr], g]);
    }
  }
  return cells.length === 6 && seen.size === 6 && new Set(seen.values()).size === 6;
}

// boxNet({ l, w, h, labels: [l, w, h], hl: 'tb' | 'fb' | 'lr' }) — the cross-shaped net of a box
export function boxNet({ l, w, h, labels = [], hl = null }) {
  const [L, Wd, Hh] = squash([l, w, h], 0.45).map((v) => v * 60);
  const x0 = 20 + Wd, rows = [Wd, Hh, Wd, Hh];
  const items = []; let y = 20;
  const tone = (k) => (hl === k ? 'hl' : 'front');
  ['tb', 'fb', 'tb', 'fb'].forEach((k, i) => { items.push(poly([[x0, y], [x0 + L, y], [x0 + L, y + rows[i]], [x0, y + rows[i]]], tone(k))); if (i === 1) { items.push(poly([[x0 - Wd, y], [x0, y], [x0, y + Hh], [x0 - Wd, y + Hh]], tone('lr')), poly([[x0 + L, y], [x0 + L + Wd, y], [x0 + L + Wd, y + Hh], [x0 + L, y + Hh]], tone('lr'))); } y += rows[i]; });
  const [lL, wL, hL] = labels;
  if (lL) items.push(text([x0 + L / 2, 12], lL));
  if (wL) items.push(text([x0 - 14 - String(wL).length * 2.5, 20 + Wd / 2], wL));
  if (hL) items.push(text([x0 + L + Wd + 16 + String(hL).length * 2.5, 20 + Wd + Hh / 2], hL));
  return fig(items, x0 + L + Wd + 46, y + 14);
}
// cylinderNet({ labels: [r, h, around], hl: 'circles' | 'rect' })
export function cylinderNet({ labels = [], hl = null } = {}) {
  const R = 30, Wr = 2 * Math.PI * R * 0.9, Hr = 80, x0 = 30, y0 = 2 * R + 14;
  const items = [poly([[x0, y0], [x0 + Wr, y0], [x0 + Wr, y0 + Hr], [x0, y0 + Hr]], hl === 'rect' ? 'hl' : 'front'),
    circle([x0 + Wr / 2, y0 - R], R, hl === 'circles' ? 'hl' : 'top'), circle([x0 + Wr / 2, y0 + Hr + R], R, hl === 'circles' ? 'hl' : 'top')];
  if (labels[0]) items.push(line([x0 + Wr / 2, y0 - R], [x0 + Wr / 2 + R, y0 - R], 'aux'), text([x0 + Wr / 2 + R / 2, y0 - R - 10], labels[0]));
  if (labels[1]) items.push(text([x0 - 16 - String(labels[1]).length * 2.5, y0 + Hr / 2], labels[1]));
  if (labels[2]) items.push(text([x0 + Wr * 0.22, y0 + Hr / 2], labels[2], hl === 'rect' ? 'hl' : 'ink'));
  return fig(items, x0 * 2 + Wr + 20, y0 + Hr + 2 * R + 12);
}
// pyramidNet({ labels: [a, slant], hl: 'base' | 'faces' }) — a square with a triangle on each side
export function pyramidNet({ labels = [], hl = null } = {}) {
  const a = 86, s = 72, c = [150, 150], h = a / 2;
  const sq = [[c[0] - h, c[1] - h], [c[0] + h, c[1] - h], [c[0] + h, c[1] + h], [c[0] - h, c[1] + h]];
  const items = [poly(sq, hl === 'base' ? 'hl' : 'top')];
  sq.forEach((p, i) => { const q = sq[(i + 1) % 4], m = mid(p, q), out = unit(sub(m, c)); items.push(poly([p, q, add(m, mulv(out, s))], hl === 'faces' ? 'hl2' : 'front')); });
  if (labels[0]) items.push(text([c[0], c[1] + 4], labels[0]));
  if (labels[1]) { const m = mid(sq[1], sq[2]); items.push(line(m, add(m, [s, 0]), 'aux'), text(add(m, [s / 2, -9]), labels[1])); }
  return fig(items, 300, 300);
}
// triPrismNet({ hl }) — three rectangles in a row with a triangle on the middle one, top and bottom
export function triPrismNet({ labels = [], hl = null } = {}) {
  const w = 60, h = 80, x0 = 30, y0 = 62, items = [];
  for (let i = 0; i < 3; i++) items.push(poly([[x0 + i * w, y0], [x0 + (i + 1) * w, y0], [x0 + (i + 1) * w, y0 + h], [x0 + i * w, y0 + h]], hl === 'rects' ? 'hl2' : 'front'));
  items.push(poly([[x0 + w, y0], [x0 + 2 * w, y0], [x0 + 1.5 * w, y0 - 52]], hl === 'tris' ? 'hl' : 'top'), poly([[x0 + w, y0 + h], [x0 + 2 * w, y0 + h], [x0 + 1.5 * w, y0 + h + 52]], hl === 'tris' ? 'hl' : 'top'));
  if (labels[0]) items.push(text([x0 + 1.5 * w, y0 + h / 2], labels[0]));
  return fig(items, x0 * 2 + 3 * w, y0 + h + 66);
}
// coneNet: a sector (the curved surface) and a circle (the base)
export function coneNet({ hl = null } = {}) {
  const C = [120, 40], R = 120, a1 = (60 * Math.PI) / 180, a2 = (120 * Math.PI) / 180;
  const p1 = [C[0] + R * Math.cos(a1), C[1] + R * Math.sin(a1)], p2 = [C[0] + R * Math.cos(a2), C[1] + R * Math.sin(a2)];
  return fig([path(`M${C.join(' ')}L${P(p1).join(' ')}A${R} ${R} 0 0 1 ${P(p2).join(' ')}Z`, hl === 'sector' ? 'hl' : 'front'), circle([120, 40 + R + 34], 34, hl === 'base' ? 'hl' : 'top')], 240, 240);
}

// two similar boxes side by side, with the scale factor
export function similarBoxes({ k = 2, labels1 = [], labels2 = [] }) {
  const a = boxFig({ l: 1.4, w: 1, h: 0.9, cubes: true, labels: labels1, W: 150, H: 150, pad: 30 });
  const b = boxFig({ l: 1.4, w: 1, h: 0.9, cubes: true, labels: labels2, W: 150, H: 150, pad: Math.max(8, 30 / k) });
  const shrink = (it, s, dx, dy) => {
    const T = (p) => [R1(p[0] * s + dx), R1(p[1] * s + dy)];
    const o = { ...it };
    if (o.pts) o.pts = o.pts.map(T); if (o.a) o.a = T(o.a); if (o.b) o.b = T(o.b); if (o.at) o.at = T(o.at);
    return o;
  };
  const s1 = 1 / Math.sqrt(k) * 0.9;
  return fig([...a.items.map((it) => shrink(it, s1, 75 - 75 * s1, 75 - 75 * s1 + 30)), ...b.items.map((it) => shrink(it, 1, 150, 20))], 310, 190);
}

// a check used by scripts/check.mjs: every number in a figure is finite and every label is real text
export function figProblems(v) {
  const bad = [];
  const num = (x) => typeof x === 'number' && Number.isFinite(x);
  for (const it of v.items ?? []) {
    if (!it || !it.k) { bad.push('empty item'); continue; }
    const pts = [...(it.pts ?? []), ...(it.a ? [it.a] : []), ...(it.b ? [it.b] : []), ...(it.at ? [it.at] : []), ...(it.c ? [it.c] : [])];
    if (pts.some((p) => !Array.isArray(p) || !num(p[0]) || !num(p[1]))) bad.push(`${it.k} has a bad point`);
    if (it.k === 'text' && (!it.s || /undefined|NaN|null|\[object/.test(it.s))) bad.push(`label "${it.s}"`);
    if (it.k === 'path' && /NaN|undefined|Infinity/.test(it.d)) bad.push('bad path');
    if (it.k === 'circle' && !num(it.r)) bad.push('bad radius');
  }
  if (!num(v.w) || !num(v.h)) bad.push('bad size');
  return bad;
}
