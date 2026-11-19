// Grade 10 two- and three-dimensional figures, taught with pictures: every question has its figure, and the worked
// steps light up the part being used (the base, then the height; one pair of faces of the net at a time).
// Used by g10.mjs (area, quadrilaterals, solids, volume, surface area) and skills.mjs (angles in polygons).
import { num, mc, St, dec } from '../kit.mjs';
import * as G from '../figs.mjs';

const r1 = (x) => Math.round((x + 1e-9) * 10) / 10;
const sq = (x) => `${x}²`;
const art = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
// display lengths in proportion, but never too thin to read
const disp = (a, b) => { const [x, y] = G.squash([a, b], 0.4, 0.8); return [x * 10, y * 10]; };
const NG = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };

// ───────── angles in polygons ─────────
export function polyAngles(r) {
  const v = r.int(0, 5);
  if (v === 0 || v === 1) {
    const n = r.pick([5, 6, 7, 8, 9, 10, 12]), sum = (n - 2) * 180, nm = NG[n];
    const shape = G.polygonFig({ pts: G.regular(n), ticks: v === 1 ? Array(n).fill(1) : null, angles: v === 1 ? ['?'] : null });
    const cut = G.triangulated(G.regular(n));
    const steps = [
      St(`Pick one corner and draw every diagonal from it. They cut the ${nm} into ${n} − 2 = ${n - 2} triangles.`, cut),
      St(`The angles of each triangle add to 180°, and together they make up the angles of the ${nm}: ${n - 2} × 180° = ${sum}°.`, cut),
    ];
    if (v === 0) return num(sum, [...steps, St(`So the interior angles of ${art(nm)} ${nm} add to ${sum}°.`)], { q: `What do the interior angles of ${art(nm)} ${nm} (${n} sides) add up to, in degrees?`, visual: shape, expr: `(${n}-2)*180` });
    const each = sum / n;
    if (!Number.isInteger(each * 10)) return polyAngles(r);
    return num(dec(each), [...steps, St(`A regular ${nm} has ${n} equal angles: ${sum}° ÷ ${n} = ${dec(each)}°.`), St(`So each interior angle is ${dec(each)}°.`)], { q: `This is a regular ${nm}: all its sides and angles are equal. What is each interior angle, in degrees?`, visual: shape, expr: `(${n}-2)*180/${n}` });
  }
  if (v === 2) {
    // a missing angle in an irregular convex polygon (not drawn to scale)
    const n = r.pick([4, 5, 5, 6]), sum = (n - 2) * 180;
    let angs, x, guard = 0;
    do { angs = Array.from({ length: n - 1 }, () => r.int(14, 34) * 5); x = sum - angs.reduce((a, b) => a + b, 0); } while ((x < 60 || x > 175) && guard++ < 200);
    if (x < 60 || x > 175) return polyAngles(r);
    const k = r.int(0, n - 1), labels = []; let j = 0;
    for (let i = 0; i < n; i++) labels.push(i === k ? 'x' : `${angs[j++]}°`);
    const pts = G.regular(n).map(([px, py], i) => [px * (1 + 0.18 * Math.sin(i * 2.1 + n)), py * (1 + 0.14 * Math.cos(i * 1.7))]);
    const known = angs.reduce((a, b) => a + b, 0);
    return num(x, [
      St(`A ${NG[n]} has ${n} sides, so its angles add to (${n} − 2) × 180° = ${sum}°.`),
      St(`Add the angles you know: ${angs.join(' + ')} = ${known}°.`, G.polygonFig({ pts, angles: labels, hl: labels.map((l, i) => (l === 'x' ? null : { angle: i })).filter(Boolean) })),
      St(`x = ${sum} − ${known} = ${x}.`),
      St(`So x = ${x}°.`),
    ], { q: `Find the angle x in this ${NG[n]}. (The figure is not drawn to scale.)`, unit: 'x =', visual: G.polygonFig({ pts, angles: labels }), expr: `${sum}-${known}` });
  }
  if (v === 3) {
    const n = r.pick([5, 6, 8, 9, 10, 12]), e = 360 / n;
    const pic = (hl) => G.polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), ext: 1, extLabel: '?', hl });
    return num(e, [
      St('An exterior angle is between one side and the next side extended. Walking all the way round the polygon, you turn through every exterior angle once: one full turn, 360°.', pic('ext')),
      St(`A regular polygon with ${n} sides turns by ${n} equal angles: 360° ÷ ${n} = ${e}°.`),
      St(`So each exterior angle is ${e}°.`),
    ], { q: `This regular ${NG[n]} has one side extended. What is the exterior angle marked ?, in degrees?`, visual: pic(), expr: `360/${n}` });
  }
  if (v === 4) {
    const n = r.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]), ext = 360 / n, int = 180 - ext;
    return num(n, [
      St(`At each corner the interior and exterior angles sit on a straight line, so they add to 180°. The exterior angle is 180° − ${int}° = ${ext}°.`, G.anglePairFig({ kind: 'supp', deg: Math.min(80, ext), labels: [`${ext}°`, `${int}°`] })),
      St(`The exterior angles add to 360°, so the number of sides is 360 ÷ ${ext} = ${n}.`),
      St(`So the polygon has ${n} sides.`),
    ], { q: `Each interior angle of a regular polygon is ${int}°. How many sides does it have?`, expr: `360/(180-${int})` });
  }
  const n = r.int(5, 14), sum = (n - 2) * 180;
  return num(n, [St(`The angle sum is (n − 2) × 180°, so n − 2 = ${sum} ÷ 180 = ${n - 2}.`, G.triangulated(G.regular(Math.min(n, 8)))), St(`n = ${n - 2} + 2 = ${n}.`), St(`So the polygon has ${n} sides.`)], { q: `The interior angles of a polygon add up to ${sum}°. How many sides does it have?`, expr: `${sum}/180+2` });
}

// ───────── area and perimeter ─────────
export function area2d(r) {
  const v = r.int(0, 11), u = r.pick(['cm', 'cm', 'm', 'mm']);
  if (v === 0 || v === 10) {
    const b = r.int(4, 20), h = r.int(3, 15), obtuse = r.bool(0.3), A = (b * h) / 2;
    const [B, H] = disp(b, h), apex = obtuse ? B * 1.3 : B * (0.2 + r.next() * 0.6);
    const pic = (hl, hide) => G.polygonFig({ pts: [[0, 0], [B, 0], [apex, H]], sides: [`${b} ${u}`, '', ''], base: 0, height: { from: 2, side: 0, label: hide ? 'h' : `${h} ${u}` }, hl });
    if (v === 10) return num(h, [
      St(`A = base × height ÷ 2, so base × height = 2 × A = 2 × ${dec(A)} = ${b * h}.`, pic(['base'], true)),
      St(`height = ${b * h} ÷ ${b} = ${h}.`, pic(['height'], true)),
      St(`So the height is ${h} ${u}.`),
    ], { q: `This triangle has area ${dec(A)} ${u}² and base ${b} ${u}. What is its height h, in ${u}?`, visual: pic(null, true), expr: `2*${dec(A)}/${b}` });
    return num(dec(A), [
      St(`A triangle is half of a parallelogram with the same base and height, so A = base × height ÷ 2. The height is the dashed line at right angles to the base${obtuse ? ', here outside the triangle' : ''}.`, pic(['base', 'height'])),
      St(`A = ${b} × ${h} ÷ 2 = ${b * h} ÷ 2 = ${dec(A)}.`),
      St(`So the area is ${dec(A)} ${u}².`),
    ], { q: `What is the area of this triangle, in ${u}²?`, visual: pic(), expr: `${b}*${h}/2` });
  }
  if (v === 1) {
    const b = r.int(5, 18), h = r.int(3, 12), off = r.int(2, 6), s = r1(Math.hypot(off, h));
    const [B, H] = disp(b, h), O = (off / b) * B;
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [B + O, H], [O, H]], sides: [`${b} ${u}`, `${dec(s)} ${u}`, '', ''], base: 0, height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 2, 1, 2], hl });
    return num(b * h, [
      St(`Cut the triangle off one end and slide it to the other: the parallelogram becomes a rectangle, so A = base × height.`, pic(['base', 'height'])),
      St(`Use the height at right angles to the base (${h} ${u}), not the slanted side (${dec(s)} ${u}): A = ${b} × ${h} = ${b * h}.`),
      St(`So the area is ${b * h} ${u}².`),
    ], { q: `What is the area of this parallelogram, in ${u}²?`, visual: pic(), expr: `${b}*${h}` });
  }
  if (v === 2) {
    const b = r.int(8, 20), a = r.int(3, b - 2), h = r.int(3, 12), A = ((a + b) * h) / 2;
    const [B, H] = disp(b, h), L = ((b - a) / b) * B * r.pick([0.3, 0.5, 0.7]);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [B, 0], [L + (a / b) * B, H], [L, H]], sides: [`${b} ${u}`, '', `${a} ${u}`, ''], height: { from: 3, side: 0, label: `${h} ${u}` }, par: [1, 0, 1, 0], hl });
    return num(dec(A), [
      St(`The two parallel sides are ${a} ${u} and ${b} ${u}. Add them: ${a} + ${b} = ${a + b}.`, pic([{ side: 0 }, { side: 2 }])),
      St(`Multiply by the height and halve it: A = (a + b) × h ÷ 2 = ${a + b} × ${h} ÷ 2 = ${dec(A)}.`, pic(['height'])),
      St(`So the area is ${dec(A)} ${u}².`),
    ], { q: `What is the area of this trapezoid, in ${u}²?`, visual: pic(), expr: `(${a}+${b})*${h}/2` });
  }
  if (v === 3) {
    const rad = r.int(2, 15), useD = r.bool(), area = r.bool(), val = area ? 3.14 * rad * rad : 2 * 3.14 * rad, ans = dec(r1(val));
    const pic = (hl) => G.circleFig({ show: useD ? 'diameter' : 'radius', r: `${rad} ${u}`, d: `${2 * rad} ${u}`, hl });
    return num(ans, [
      St(useD ? `The diameter goes all the way across. The radius is half of it: ${2 * rad} ÷ 2 = ${rad} ${u}.` : `The radius goes from the centre to the edge: ${rad} ${u}.`, pic(useD ? 'diameter' : 'radius')),
      St(area ? `A = πr² ≈ 3.14 × ${rad}² = 3.14 × ${rad * rad} = ${dec(val)}.` : `C = 2πr ≈ 2 × 3.14 × ${rad} = ${dec(val)}.`, pic(area ? 'fill' : null)),
      St(`To the nearest tenth: ${ans}.`),
      St(`So the ${area ? `area is about ${ans} ${u}²` : `circumference is about ${ans} ${u}`}.`),
    ], { q: `Using π ≈ 3.14, find the ${area ? `area of this circle, in ${u}²` : `circumference of this circle, in ${u}`}. Round to the nearest tenth.`, visual: pic(), tol: 0.05001, expr: area ? `3.14*${rad}**2` : `2*3.14*${rad}` });
  }
  if (v === 4 || v === 5) {
    const W = r.int(6, 12), H = r.int(6, 12), a = r.int(2, H - 3), c = r.int(2, W - 3);
    const pts = [[0, 0], [W, 0], [W, a], [c, a], [c, H], [0, H]];
    if (v === 4) {
      const A1 = W * a, A2 = c * (H - a), A = A1 + A2;
      const base = { pts, sides: [`${W} m`, `${a} m`, `${W - c} m`, `${H - a} m`, `${c} m`, `${H} m`], right: [0, 1, 2, 4, 5] };
      return num(A, [
        St(`Split the shape into two rectangles with a line across.`, G.polygonFig({ ...base, cuts: [[[0, a], [c, a]]] })),
        St(`Bottom rectangle: ${W} × ${a} = ${A1} m². Top rectangle: ${c} × ${H - a} = ${A2} m².`, G.polygonFig({ ...base, regions: [{ pts: [[0, 0], [W, 0], [W, a], [0, a]], t: 'hl', label: `${A1}` }, { pts: [[0, a], [c, a], [c, H], [0, H]], t: 'hl2', label: `${A2}` }], cuts: [[[0, a], [c, a]]] })),
        St(`Add them: ${A1} + ${A2} = ${A}.`),
        St(`So the area is ${A} m².`),
      ], { q: 'What is the area of this shape, in m²? (All corners are right angles.)', visual: G.polygonFig(base), expr: `${W}*${H}-${W - c}*${H - a}` });
    }
    const P = 2 * (W + H);
    const base = (hl) => G.polygonFig({ pts, sides: [`${W} m`, `${a} m`, hl === 'x' ? `${W - c} m` : 'x', hl === 'y' ? `${H - a} m` : 'y', `${c} m`, `${H} m`], right: [0, 1, 2, 4, 5], hl: hl === 'x' ? [{ side: 2 }] : hl === 'y' ? [{ side: 3 }] : null });
    return num(P, [
      St(`First find the missing sides. Across: the bottom (${W} m) is the top (${c} m) plus x, so x = ${W} − ${c} = ${W - c} m.`, base('x')),
      St(`Up: the left side (${H} m) is ${a} m plus y, so y = ${H} − ${a} = ${H - a} m.`, base('y')),
      St(`Add all six sides: ${W} + ${a} + ${W - c} + ${H - a} + ${c} + ${H} = ${P}.`),
      St(`So the perimeter is ${P} m.`),
    ], { q: 'What is the perimeter of this shape, in m? (All corners are right angles.)', visual: base(), expr: `2*(${W}+${H})` });
  }
  if (v === 6) {
    const W = r.int(10, 20), H = r.int(6, 14), w = r.int(2, W - 5), h = r.int(2, H - 4), x0 = r.int(1, W - w - 1), y0 = r.int(1, H - h - 1);
    const pic = (hl) => G.polygonFig({ pts: [[0, 0], [W, 0], [W, H], [0, H]], holes: [[[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]]], shade: true, sides: [`${W} m`, `${H} m`, '', ''], notes: [{ at: [x0 + w / 2, y0 + h / 2], s: `${w} × ${h}`, t: hl === 'pool' ? 'hl' : 'ink' }] });
    return num(W * H - w * h, [
      St(`Find the area of the whole yard: ${W} × ${H} = ${W * H} m².`, pic('yard')),
      St(`Take away the pool, which is not lawn: ${w} × ${h} = ${w * h} m². ${W * H} − ${w * h} = ${W * H - w * h}.`, pic('pool')),
      St(`So the green lawn is ${W * H - w * h} m².`),
    ], { q: `A ${W} m by ${H} m yard has a ${w} m by ${h} m pool in it. What is the area of the green lawn, in m²?`, visual: pic(), expr: `${W}*${H}-${w}*${h}` });
  }
  if (v === 7) {
    const s = r.int(2, 10) * 2, sqA = s * s, cA = 3.14 * (s / 2) ** 2, val = sqA - cA, ans = dec(r1(val));
    return num(ans, [
      St(`The square's area is ${s}² = ${sqA} ${u}².`, G.circleFig({ square: true, shade: 'outside', show: 'none', side: `${s} ${u}` })),
      St(`The circle fits exactly, so its diameter is ${s} and its radius ${s / 2}. Its area is ≈ 3.14 × ${s / 2}² = ${dec(cA)} ${u}².`, G.circleFig({ square: true, show: 'radius', r: `${s / 2}`, hl: ['fill', 'radius'] })),
      St(`Shaded = ${sqA} − ${dec(cA)} = ${dec(val)}, which is ${ans} to the nearest tenth.`),
      St(`So the shaded area is about ${ans} ${u}².`),
    ], { q: `A circle fits exactly inside a square with sides of ${s} ${u}. Using π ≈ 3.14, what is the shaded area, in ${u}²? Round to the nearest tenth.`, visual: G.circleFig({ square: true, shade: 'outside', show: 'none', side: `${s} ${u}` }), tol: 0.05001, expr: `${s}**2-3.14*(${s}/2)**2` });
  }
  if (v === 8) {
    const x1 = r.int(0, 4), y1 = r.int(0, 4), x2 = x1 + r.int(2, 6), y2 = y1 + r.int(2, 6), per = r.bool(), w = x2 - x1, h = y2 - y1;
    return num(per ? 2 * (w + h) : w * h, [`Width = ${x2} − ${x1} = ${w}. Height = ${y2} − ${y1} = ${h}.`, per ? `Perimeter = 2 × (${w} + ${h}) = ${2 * (w + h)}.` : `Area = ${w} × ${h} = ${w * h}.`, `So the ${per ? 'perimeter' : 'area'} is ${per ? 2 * (w + h) : w * h} ${per ? 'units' : 'square units'}.`], { q: `A rectangle has vertices (${x1}, ${y1}), (${x2}, ${y1}), (${x2}, ${y2}) and (${x1}, ${y2}). What is its ${per ? 'perimeter' : 'area'}?`, visual: { type: 'poly', points: [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], grid: true }, expr: per ? `2*(${w}+${h})` : `${w}*${h}` });
  }
  if (v === 9) {
    const p = r.int(3, 12) * 2, q = r.int(3, 12) * 2, A = (p * q) / 2, [P2, Q2] = disp(p, q);
    const pts = [[0, Q2 / 2], [P2 / 2, 0], [P2, Q2 / 2], [P2 / 2, Q2]];
    const pic = (hl) => G.polygonFig({ pts, ticks: [1, 1, 1, 1], diag: [[0, 2, hl ? 'hlline' : 'aux'], [1, 3, hl ? 'hlline' : 'aux']], notes: [{ at: [P2 * 0.27, Q2 / 2 + Q2 * 0.07], s: `${p} ${u}` }, { at: [P2 / 2 + P2 * 0.16, Q2 * 0.8], s: `${q} ${u}` }] });
    return num(A, [
      St(`The diagonals of a rhombus cross at right angles. The rhombus is half of the rectangle around it, which measures ${p} by ${q}.`, pic(true)),
      St(`A = d₁ × d₂ ÷ 2 = ${p} × ${q} ÷ 2 = ${A}.`),
      St(`So the area is ${A} ${u}².`),
    ], { q: `The diagonals of this rhombus are ${p} ${u} and ${q} ${u}. What is its area, in ${u}²?`, visual: pic(false), expr: `${p}*${q}/2` });
  }
  // a window: a rectangle with a semicircle on top
  const w = r.int(2, 6) * 2, h = r.int(3, 10), rad = w / 2, rect = w * h, semi = (3.14 * rad * rad) / 2, val = rect + semi, ans = dec(r1(val));
  const [Wd, Hd] = disp(w, h), arc = Array.from({ length: 13 }, (_, i) => [Wd / 2 + (Wd / 2) * Math.cos((i * Math.PI) / 12), Hd + (Wd / 2) * Math.sin((i * Math.PI) / 12)]);
  const pts = [[0, 0], [Wd, 0], ...arc, [0, 0]].slice(0, -1);
  const pic = (hl) => G.polygonFig({ pts, sides: [`${w} m`, `${h} m`], cuts: [[[0, Hd], [Wd, Hd]]], regions: hl ? [{ pts: [[0, 0], [Wd, 0], [Wd, Hd], [0, Hd]], t: 'hl', label: hl ? `${rect}` : '' }, { pts: arc, t: 'hl2' }] : [] });
  return num(ans, [
    St(`Split the window into a rectangle and a semicircle. The rectangle is ${w} × ${h} = ${rect} m².`, pic(true)),
    St(`The semicircle's diameter is ${w}, so its radius is ${rad}. Its area is half a circle: 3.14 × ${rad}² ÷ 2 = ${dec(semi)} m².`),
    St(`Total: ${rect} + ${dec(semi)} = ${dec(val)}, which is ${ans} to the nearest tenth.`),
    St(`So the window's area is about ${ans} m².`),
  ], { q: `A window is a rectangle ${w} m wide and ${h} m tall with a semicircle on top. Using π ≈ 3.14, what is its area, in m²? Round to the nearest tenth.`, visual: pic(false), tol: 0.05001, expr: `${w}*${h}+3.14*${rad}**2/2` });
}

// ───────── quadrilaterals and polygons ─────────
const QUADS = {
  Square: { pts: [[0, 0], [5, 0], [5, 5], [0, 5]], ticks: [1, 1, 1, 1], right: [0, 1, 2, 3], say: 'four equal sides (one tick on each) and four right angles' },
  Rectangle: { pts: [[0, 0], [8, 0], [8, 4.5], [0, 4.5]], ticks: [1, 2, 1, 2], right: [0, 1, 2, 3], say: 'four right angles, with opposite sides equal but not all four equal' },
  Rhombus: { pts: [[0, 0], [5, 0], [8, 4], [3, 4]], ticks: [1, 1, 1, 1], say: 'four equal sides but no right angles' },
  Parallelogram: { pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], par: [1, 2, 1, 2], ticks: [1, 2, 1, 2], say: 'two pairs of parallel sides (arrows), opposite sides equal, and no right angles' },
  Trapezoid: { pts: [[0, 0], [9, 0], [6.5, 4], [2, 4]], par: [1, 0, 1, 0], say: 'exactly one pair of parallel sides (the arrows)' },
  Kite: { pts: [[0, 3], [3, 0], [9, 3], [3, 6]], ticks: [1, 2, 2, 1], say: 'two pairs of equal sides next to each other, and no parallel sides' },
};
export function quads(r) {
  const v = r.int(0, 7);
  if (v === 0) {
    const right = r.pick(Object.keys(QUADS)), Q = QUADS[right];
    return mc(r, right, r.shuffle(Object.keys(QUADS).filter((x) => x !== right)).slice(0, 3), { q: 'Read the marks on the sides and corners. What is the most specific name for this quadrilateral?', visual: G.polygonFig(Q),
      steps: [St('Tick marks show equal sides, arrows show parallel sides, and a small square shows a right angle.', G.polygonFig(Q)), St(`This one has ${Q.say}.`), St(`So it is ${art(right)} ${right.toLowerCase()}.`)] });
  }
  if (v === 1) {
    const a = r.int(7, 29) * 5, opp = r.bool(), pts = [[0, 0], [7, 0], [9.5, 4], [2.5, 4]];
    const labels = (show) => [`${a}°`, opp ? '' : '?', opp ? '?' : '', ''].map((x, i) => (show && x === '?' ? `${opp ? a : 180 - a}°` : x));
    const ans = opp ? a : 180 - a;
    return num(ans, [
      St(opp ? 'In a parallelogram, opposite angles are equal.' : 'In a parallelogram, angles next to each other (between the same pair of parallel sides) add to 180°.', G.polygonFig({ pts, par: [1, 2, 1, 2], angles: labels(false), hl: [{ angle: 0 }, { angle: opp ? 2 : 1 }] })),
      St(opp ? `So the angle is also ${a}°.` : `180° − ${a}° = ${180 - a}°.`, G.polygonFig({ pts, par: [1, 2, 1, 2], angles: labels(true) })),
      St(`So the angle marked ? is ${ans}°.`),
    ], { q: 'In this parallelogram, what is the angle marked ?, in degrees?', visual: G.polygonFig({ pts, par: [1, 2, 1, 2], angles: labels(false) }), expr: opp ? String(a) : `180-${a}` });
  }
  if (v === 2) {
    const x = r.int(2, 9), p = r.int(1, 3), q = p + r.int(1, 3), c = r.int(0, 12), d = (q - p) * x + c;
    const lin = (k, m) => `${k === 1 ? '' : k}x${m ? ` + ${m}` : ''}`;
    const pts = [[0, 0], [8, 0], [10, 5], [2, 5]];
    const pic = (hl) => G.polygonFig({ pts, names: ['A', 'B', 'C', 'D'], par: [1, 2, 1, 2], diag: [[0, 2, hl ? 'hlline' : 'aux'], [1, 3, 'aux']], notes: [{ at: [2.3, 1.9], s: lin(q, c), t: hl ? 'hl' : 'ink' }, { at: [7.6, 3.3], s: lin(p, d), t: hl ? 'hl' : 'ink' }] });
    return num(x, [
      St('The diagonals of a parallelogram cut each other in half, so AE = EC.', pic(true)),
      St(`${lin(q, c)} = ${lin(p, d)}, so ${q - p}x = ${d - c}.`),
      St(`x = ${d - c} ÷ ${q - p} = ${x}.`),
      St(`So x = ${x}.`),
    ], { q: `ABCD is a parallelogram and its diagonals meet at E. AE = ${lin(q, c)} and EC = ${lin(p, d)}. Find x.`, unit: 'x =', visual: pic(false), expr: `(${d}-${c})/(${q - p})` });
  }
  if (v === 3) {
    const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
    const pts = [[0, b], [a, 0], [2 * a, b], [a, 2 * b]];
    const pic = (hl) => G.polygonFig({ pts, ticks: [1, 1, 1, 1], diag: [[0, 2, 'aux'], [1, 3, 'aux']], regions: hl ? [{ pts: [[a, b], [a, 0], [2 * a, b]], t: 'hl' }] : [], notes: [{ at: [a * 1.5, b + 0.08 * b + 0.3], s: `${a}` }, { at: [a + 0.18 * a + 0.3, b * 0.5], s: `${b}` }], right: [] });
    return num(c, [
      St(`The diagonals of a rhombus cut each other in half at right angles, so half-diagonals ${a} and ${b} make a right triangle with a side as the hypotenuse.`, pic(true)),
      St(`side = √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = √${c * c} = ${c}.`),
      St(`So each side is ${c} cm.`),
    ], { q: `The diagonals of a rhombus are ${2 * a} cm and ${2 * b} cm long. How long is each side, in cm?`, visual: pic(false), expr: `Math.hypot(${a},${b})` });
  }
  if (v === 4) {
    const n = r.pick([5, 6, 8, 9, 10, 12]);
    const pic = (hl) => G.polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1), ext: 1, extLabel: '?', hl });
    return num(360 / n, [St('Going once round any polygon, you turn through all the exterior angles: 360° in total.', pic('ext')), St(`A regular ${NG[n]} has ${n} equal exterior angles: 360 ÷ ${n} = ${360 / n}.`), St(`So each exterior angle is ${360 / n}°.`)], { q: `What is each exterior angle of a regular ${NG[n]}, in degrees?`, visual: pic(), expr: `360/${n}` });
  }
  if (v === 5) {
    const NM = [[5, 'Pentagon'], [6, 'Hexagon'], [7, 'Heptagon'], [8, 'Octagon'], [9, 'Nonagon'], [10, 'Decagon'], [12, 'Dodecagon']], [n, right] = r.pick(NM);
    const pts = G.regular(n).map(([x, y], i) => [x * (1 + 0.12 * Math.sin(i * 2.3)), y * (1 + 0.1 * Math.cos(i * 1.9))]);
    return mc(r, right, r.shuffle(NM.filter((x) => x[0] !== n).map((x) => x[1])).slice(0, 3), { q: 'Count the sides. What is this polygon called?', visual: G.polygonFig({ pts }), steps: [St(`Count the sides: there are ${n}.`, G.polygonFig({ pts, names: pts.map((_, i) => String(i + 1)) })), St(`A polygon with ${n} sides is ${art(right)} ${right.toLowerCase()}.`)] });
  }
  if (v === 6) {
    const a = r.int(10, 22) * 5, b = r.int(8, 18) * 5, x = (360 - a - b) / 2;
    if (x <= 20 || x >= 175 || !Number.isInteger(x)) return quads(r);
    const pts = [[0, 3], [3, 0], [9, 3], [3, 6]];
    const pic = (show, hl) => G.polygonFig({ pts, ticks: [1, 2, 2, 1], angles: [`${a}°`, show ? `${x}°` : 'x', `${b}°`, show ? `${x}°` : 'x'], hl });
    return num(x, [
      St('A kite has one pair of equal angles: the two between the unequal sides (marked x).', pic(false, [{ angle: 1 }, { angle: 3 }])),
      St(`A quadrilateral's angles add to 360°: ${a} + ${b} + 2x = 360, so 2x = ${360 - a - b} and x = ${x}.`),
      St(`So x = ${x}°.`, pic(true)),
    ], { q: 'In this kite, find the angle x.', unit: 'x =', visual: pic(false), expr: `(360-${a}-${b})/2` });
  }
  const a = r.int(9, 17) * 5, pts = [[0, 0], [10, 0], [7.5, 4], [2.5, 4]];
  const pic = (show) => G.polygonFig({ pts, par: [1, 0, 1, 0], ticks: [0, 1, 0, 1], angles: [`${a}°`, '', '', show ? `${180 - a}°` : '?'] });
  return num(180 - a, [
    St('The top and bottom are parallel, so the two angles on the same slanted side add to 180°.', G.polygonFig({ pts, par: [1, 0, 1, 0], ticks: [0, 1, 0, 1], angles: [`${a}°`, '', '', '?'], hl: [{ angle: 0 }, { angle: 3 }, { side: 3 }] })),
    St(`180° − ${a}° = ${180 - a}°.`, pic(true)),
    St(`So the angle marked ? is ${180 - a}°.`),
  ], { q: 'This trapezoid has its top and bottom parallel and its slanted sides equal. What is the angle marked ?, in degrees?', visual: pic(false), expr: `180-${a}` });
}

// ───────── solids: faces, edges, vertices, nets and cross-sections ─────────
const BASES = [[3, 'triangular'], [4, 'rectangular'], [5, 'pentagonal'], [6, 'hexagonal'], [8, 'octagonal']];
const prismPic = (n) => (n === 4 ? G.boxFig({ l: 6, w: 3, h: 4 }) : G.prismFig({ base: G.regular(n, 3), depth: 5 }));
const SOLIDS = {
  Cylinder: () => G.cylinderFig({ r: 3, h: 6 }), Cone: () => G.coneFig({ r: 3, h: 6 }), Sphere: () => G.sphereFig(), 'Square pyramid': () => G.pyramidFig({ a: 5, h: 6 }),
  'Triangular prism': () => G.prismFig({ base: [[0, 0], [5, 0], [2, 4]], depth: 6 }), 'Rectangular prism': () => G.boxFig({ l: 7, w: 3, h: 4 }), 'Triangular pyramid': () => G.pyramidFig({ a: 5, h: 6, tri: true }), 'Hexagonal prism': () => G.prismFig({ base: G.regular(6, 3), depth: 5 }),
};
export function solids(r) {
  const v = r.int(0, 6);
  if (v === 0) {
    const [n, nm] = r.pick(BASES), prism = n > 4 || r.bool(), what = r.pick(['faces', 'edges', 'vertices']);
    const val = prism ? { faces: n + 2, edges: 3 * n, vertices: 2 * n }[what] : { faces: n + 1, edges: 2 * n, vertices: n + 1 }[what];
    const why = prism ? { faces: `${n} rectangles round the side + 2 bases = ${n + 2}.`, edges: `${n} edges round each base (2 × ${n}) + ${n} joining them = ${3 * n}.`, vertices: `${n} corners on each base: 2 × ${n} = ${2 * n}.` }[what] : { faces: `${n} triangles + 1 base = ${n + 1}.`, edges: `${n} round the base + ${n} up to the top = ${2 * n}.`, vertices: `${n} round the base + 1 at the top = ${n + 1}.` }[what];
    const pic = prism ? prismPic(n) : G.pyramidFig({ a: 5, h: 6, tri: n === 3 });
    const name = `${nm} ${prism ? 'prism' : 'pyramid'}`;
    return num(val, [St(`This is ${art(nm)} ${name}. Its base has ${n} sides. Dashed edges are at the back, hidden from view: count them too.`, pic), St(why), St(`So it has ${val} ${what}.`)], { q: `How many ${what} does this ${name} have?`, visual: pic, expr: String(val) });
  }
  if (v === 1) {
    const X = [['box', 'across', 'Rectangle', 'a rectangular prism (box), sliced parallel to its base'], ['cube', 'down', 'Square', 'a cube, sliced parallel to a face'], ['cylinder', 'across', 'Circle', 'a cylinder, sliced parallel to its bases'], ['cylinder', 'down', 'Rectangle', 'a cylinder, sliced straight down through its centre'], ['cone', 'down', 'Triangle', 'a cone, sliced straight down through its tip'], ['pyramid', 'across', 'Square', 'a square pyramid, sliced parallel to its base'], ['sphere', 'across', 'Circle', 'a sphere, sliced through its centre']];
    const [solid, cut, right, desc] = r.pick(X), pic = G.sliceFig({ solid, cut });
    return mc(r, right, ['Square', 'Circle', 'Rectangle', 'Triangle'].filter((x) => x !== right), { q: `The yellow plane slices ${desc}. What shape is the cross-section?`, visual: pic, steps: [St('A cross-section is the flat face you would see if you cut along the plane and looked straight at the cut.', pic), St(`Here the cut face is ${art(right)} ${right.toLowerCase()}.`)] });
  }
  if (v === 2) {
    const N = [['Cube', () => G.netFig({ cells: r.pick(G.CUBE_NETS) }), '6 equal squares'], ['Rectangular prism', () => G.boxNet({ l: 6, w: 3, h: 4 }), '6 rectangles in 3 matching pairs'], ['Cylinder', () => G.cylinderNet(), '2 equal circles and a rectangle'], ['Square pyramid', () => G.pyramidNet(), '1 square and 4 triangles'], ['Triangular prism', () => G.triPrismNet(), '2 triangles and 3 rectangles'], ['Cone', () => G.coneNet(), 'a circle and a sector (a slice of a bigger circle)']];
    const [right, f, d] = r.pick(N), pic = f();
    return mc(r, right, r.shuffle(N.map((x) => x[0]).filter((x) => x !== right)).slice(0, 3), { q: 'This net is folded up along its edges. What solid does it make?', visual: pic, steps: [St(`Each piece of a net becomes one face of the solid. This net has ${d}.`, pic), St(`They fold into ${art(right)} ${right.toLowerCase()}.`)] });
  }
  if (v === 3) {
    const good = r.pick(G.CUBE_NETS), bad = r.shuffle(G.NOT_CUBE_NETS).slice(0, 3), all = r.shuffle([good, ...bad]), k = all.indexOf(good), L = ['A', 'B', 'C', 'D'];
    const pic = { type: 'figs', figs: all.map((cells) => G.netFig({ cells })), captions: L };
    return mc(r, L[k], L.filter((_, i) => i !== k), { q: 'Each net has 6 squares. Which one folds into a cube?', visual: pic, steps: [
      St('Fold each net in your mind, keeping one square as the bottom. Watch for squares that would land on the same face.'),
      St('Nets that never work: a row of 5 or more squares, a 2 × 2 block, or two squares folding up on the same side of a row of four.', { type: 'figs', figs: all.map((cells, i) => G.netFig({ cells, hl: i === k ? [0, 1, 2, 3, 4, 5] : [] })), captions: L }),
      St(`Only net ${L[k]} gives every square its own face. So the answer is ${L[k]}.`)] });
  }
  if (v === 4) {
    const [n] = r.pick(BASES), F = n + 2, V = 2 * n, E = 3 * n, ask = r.pick(['E', 'F', 'V']);
    const given = { E: `${F} faces and ${V} vertices`, F: `${V} vertices and ${E} edges`, V: `${F} faces and ${E} edges` }[ask];
    const ans = { E, F, V }[ask], word = { E: 'edges', F: 'faces', V: 'vertices' }[ask];
    return num(ans, [St(`For any solid with flat faces, Euler's formula says F + V − E = 2 (faces plus vertices minus edges).`, prismPic(n)), St(ask === 'E' ? `${F} + ${V} − E = 2, so E = ${F + V} − 2 = ${E}.` : ask === 'F' ? `F + ${V} − ${E} = 2, so F = 2 + ${E} − ${V} = ${F}.` : `${F} + V − ${E} = 2, so V = 2 + ${E} − ${F} = ${V}.`), St(`So it has ${ans} ${word}.`)], { q: `A solid has ${given}. Use Euler's formula to find the number of ${word}.`, expr: String(ans) });
  }
  if (v === 5) {
    const R = [['A rectangle', 'one of its sides', 'Cylinder'], ['A right triangle', 'one of its legs', 'Cone'], ['A semicircle', 'its diameter', 'Sphere']];
    const [s, ax, right] = r.pick(R);
    return mc(r, right, ['Cylinder', 'Cone', 'Sphere', 'Square pyramid'].filter((x) => x !== right), { q: `${s} is spun all the way round ${ax}. What solid does it make?`, steps: [St(`As it turns, every point traces a circle round the axis.`), St(`The result is ${art(right)} ${right.toLowerCase()}.`, SOLIDS[right]())] });
  }
  const right = r.pick(Object.keys(SOLIDS)), pic = SOLIDS[right]();
  const say = { Cylinder: 'two equal circles joined by a curved surface', Cone: 'a circle base and a curved surface up to a point', Sphere: 'one curved surface, every point the same distance from the centre', 'Square pyramid': 'a square base and 4 triangles meeting at a point', 'Triangular prism': 'two triangles joined by 3 rectangles', 'Rectangular prism': '6 rectangle faces', 'Triangular pyramid': '4 triangles', 'Hexagonal prism': 'two hexagons joined by 6 rectangles' }[right];
  return mc(r, right, r.shuffle(Object.keys(SOLIDS).filter((x) => x !== right)).slice(0, 3), { q: 'What is the name of this solid?', visual: pic, steps: [St(`Look at its faces: ${say}.`, pic), St(`So it is ${art(right)} ${right.toLowerCase()}.`)] });
}

// ───────── volume ─────────
export function volume(r) {
  const v = r.int(0, 8), u = r.pick(['cm', 'cm', 'm']);
  if (v === 0 || v === 7) {
    const a = r.int(2, 12), b = r.int(2, 9), h = r.int(2, 12), V = a * b * h;
    const pic = (hl, lab = true) => G.boxFig({ l: a, w: b, h, labels: lab ? [`${a} ${u}`, `${b} ${u}`, `${h} ${u}`] : [`${a} ${u}`, `${b} ${u}`, 'h'], hl });
    if (v === 7) return num(h, [St(`V = base area × height. The base is ${a} × ${b} = ${a * b} ${u}².`, pic('base', false)), St(`h = ${V} ÷ ${a * b} = ${h}.`, pic('height', false)), St(`So the height is ${h} ${u}.`)], { q: `This box has a volume of ${V} ${u}³. What is its height h, in ${u}?`, visual: pic(null, false), expr: `${V}/(${a}*${b})` });
    return num(V, [
      St(`Volume = base area × height. The base is the bottom face: ${a} × ${b} = ${a * b} ${u}². That is how many cubes cover the bottom in one layer.`, pic(['base', 'length', 'width'])),
      St(`The height says how many layers: ${a * b} × ${h} = ${V}.`, pic(['height'])),
      St(`So the volume is ${V} ${u}³.`),
    ], { q: `What is the volume of this box, in ${u}³?`, visual: pic(), expr: `${a}*${b}*${h}` });
  }
  if (v === 1) {
    const b = r.int(3, 12), th = r.int(2, 10), L = r.int(4, 15), A = (b * th) / 2, V = A * L;
    const [B, H] = disp(b, th);
    const pic = (hl) => G.prismFig({ base: [[0, 0], [B, 0], [B * 0.35, H]], depth: Math.max(B, H) * 0.9, sides: [`${b} ${u}`, '', ''], height: { from: 2, side: 0, label: `${th} ${u}` }, depthLabel: `${L} ${u}`, hl });
    return num(dec(V), [
      St(`A prism has the same cross-section all along it. Its base is the triangle at the end: ${b} × ${th} ÷ 2 = ${dec(A)} ${u}².`, pic(['base'])),
      St(`Multiply by the length of the prism: ${dec(A)} × ${L} = ${dec(V)}.`, pic(['depth'])),
      St(`So the volume is ${dec(V)} ${u}³.`),
    ], { q: `What is the volume of this triangular prism, in ${u}³?`, visual: pic(), expr: `${b}*${th}/2*${L}` });
  }
  if (v === 2) {
    const a = r.int(2, 12), hh = r.int(1, 8) * 3, V = (a * a * hh) / 3;
    const pic = (hl) => G.pyramidFig({ a, h: hh, labels: [`${a} ${u}`, `${hh} ${u}`, ''], hl });
    return num(V, [
      St(`A pyramid holds one third of the prism with the same base and height. The base is a square: ${a} × ${a} = ${a * a} ${u}².`, pic('base')),
      St(`V = base area × height ÷ 3 = ${a * a} × ${hh} ÷ 3 = ${V}.`, pic('height')),
      St(`So the volume is ${V} ${u}³.`),
    ], { q: `What is the volume of this square pyramid, in ${u}³?`, visual: pic(), expr: `${a}**2*${hh}/3` });
  }
  const rad = r.int(1, 10), h = r.int(2, 15);
  if (v === 3 || v === 4) {
    const cyl = v === 3, base = 3.14 * rad * rad, val = cyl ? base * h : (base * h) / 3, ans = dec(r1(val));
    const pic = (hl) => (cyl ? G.cylinderFig({ r: rad, h, labels: [`${rad} ${u}`, `${h} ${u}`], hl }) : G.coneFig({ r: rad, h, labels: [`${rad} ${u}`, `${h} ${u}`], hl }));
    return num(ans, [
      St(`The base is a circle: πr² ≈ 3.14 × ${rad}² = ${dec(base)} ${u}².`, pic(['base', 'radius'])),
      St(cyl ? `V = base area × height = ${dec(base)} × ${h} = ${dec(val, 3)}.` : `A cone is one third of the cylinder around it: V = base area × height ÷ 3 = ${dec(base)} × ${h} ÷ 3 = ${dec(val, 3)}.`, pic(['height'])),
      St(`To the nearest tenth: ${ans}.`),
      St(`So the volume is about ${ans} ${u}³.`),
    ], { q: `Using π ≈ 3.14, find the volume of this ${cyl ? 'cylinder' : 'cone'}, in ${u}³. Round to the nearest tenth.`, visual: pic(), tol: 0.05001, expr: cyl ? `3.14*${rad}**2*${h}` : `3.14*${rad}**2*${h}/3` });
  }
  if (v === 5 || v === 6) {
    const hemi = v === 6, val = ((4 / 3) * 3.14 * rad ** 3) / (hemi ? 2 : 1), ans = dec(r1(val));
    const pic = (hl) => G.sphereFig({ labels: [`${rad} ${u}`], hl, hemi });
    return num(ans, [
      St(`The radius goes from the centre to the surface: r = ${rad} ${u}.`, pic('radius')),
      St(`V = 4/3 × π × r³${hemi ? ' ÷ 2 (half a sphere)' : ''} ≈ 4/3 × 3.14 × ${rad}³${hemi ? ' ÷ 2' : ''} = ${dec(val, 3)}.`),
      St(`To the nearest tenth: ${ans}.`),
      St(`So the volume is about ${ans} ${u}³.`),
    ], { q: `Using π ≈ 3.14, find the volume of this ${hemi ? 'hemisphere' : 'sphere'}, in ${u}³. Round to the nearest tenth.`, visual: pic(), tol: 0.05001, expr: `4/3*3.14*${rad}**3/${hemi ? 2 : 1}` });
  }
  const a = r.int(2, 5), b = r.int(2, 4), c = r.int(2, 4), V = a * b * c;
  const pic = (hl) => G.boxFig({ l: a, w: b, h: c, cubes: true, hl });
  return num(V, [
    St(`Count the cubes in the bottom layer: ${a} along the front and ${b} going back, so ${a} × ${b} = ${a * b} cubes.`, pic('base')),
    St(`There are ${c} layers: ${a * b} × ${c} = ${V}.`, pic('height')),
    St(`So the volume is ${V} unit cubes.`),
  ], { q: 'This solid is built from unit cubes, with no gaps inside. What is its volume, in unit cubes?', visual: pic(), expr: `${a}*${b}*${c}` });
}

// ───────── surface area and similar solids ─────────
export function surface(r) {
  const v = r.int(0, 7), u = r.pick(['cm', 'cm', 'm']);
  if (v === 0) {
    const a = r.int(2, 12), b = r.int(2, 9), h = r.int(2, 12), S = 2 * (a * b + a * h + b * h);
    const L = [`${a}`, `${b}`, `${h}`], net = (hl) => G.boxNet({ l: a, w: b, h, labels: L, hl });
    return num(S, [
      St('Unfold the box into its net: six rectangles in three matching pairs.', net(null)),
      St(`Top and bottom: 2 × ${a} × ${b} = ${2 * a * b}.`, net('tb')),
      St(`Front and back: 2 × ${a} × ${h} = ${2 * a * h}.`, net('fb')),
      St(`The two ends: 2 × ${b} × ${h} = ${2 * b * h}.`, net('lr')),
      St(`Add them: ${2 * a * b} + ${2 * a * h} + ${2 * b * h} = ${S}.`),
      St(`So the surface area is ${S} ${u}².`),
    ], { q: `What is the surface area of this box, in ${u}²?`, visual: G.boxFig({ l: a, w: b, h, labels: [`${a} ${u}`, `${b} ${u}`, `${h} ${u}`] }), expr: `2*(${a}*${b}+${a}*${h}+${b}*${h})` });
  }
  if (v === 1) {
    const a = r.int(2, 12), l = r.int(3, 15), S = a * a + 2 * a * l;
    return num(S, [
      St('Unfold the pyramid: a square base and four equal triangles.', G.pyramidNet({ labels: [`${a}`, `${l}`] })),
      St(`Base: ${a} × ${a} = ${a * a}.`, G.pyramidNet({ labels: [`${a}`, `${l}`], hl: 'base' })),
      St(`Each triangle has base ${a} and height ${l} (the slant height): ${a} × ${l} ÷ 2 = ${(a * l) / 2}. Four of them: ${2 * a * l}.`, G.pyramidNet({ labels: [`${a}`, `${l}`], hl: 'faces' })),
      St(`${a * a} + ${2 * a * l} = ${S}.`),
      St(`So the surface area is ${S} ${u}².`),
    ], { q: `What is the surface area of this square pyramid, in ${u}²?`, visual: G.pyramidFig({ a, h: l, labels: [`${a} ${u}`, '', `${l} ${u}`] }), expr: `${a}**2+2*${a}*${l}` });
  }
  if (v === 2) {
    const rad = r.int(1, 9), h = r.int(2, 12), circ = 2 * 3.14 * rad * rad, side = 2 * 3.14 * rad * h, val = circ + side, ans = dec(r1(val));
    const net = (hl) => G.cylinderNet({ labels: [`${rad}`, `${h}`, '2πr'], hl });
    return num(ans, [
      St('Unfold the cylinder: two circles and a rectangle. The rectangle wraps round the circle, so its length is the circumference, 2πr.', net(null)),
      St(`The two circles: 2 × 3.14 × ${rad}² = ${dec(circ)}.`, net('circles')),
      St(`The rectangle: 2 × 3.14 × ${rad} × ${h} = ${dec(side)}.`, net('rect')),
      St(`Total: ${dec(circ)} + ${dec(side)} = ${dec(val)}, which is ${ans} to the nearest tenth.`),
      St(`So the surface area is about ${ans} ${u}².`),
    ], { q: `Using π ≈ 3.14, find the surface area of this cylinder, in ${u}². Round to the nearest tenth.`, visual: G.cylinderFig({ r: rad, h, labels: [`${rad} ${u}`, `${h} ${u}`] }), tol: 0.05001, expr: `2*3.14*${rad}**2+2*3.14*${rad}*${h}` });
  }
  if (v === 3 || v === 4) {
    const rad = r.int(1, 9), sph = v === 3, l = rad + r.int(2, 9), val = sph ? 4 * 3.14 * rad * rad : 3.14 * rad * rad + 3.14 * rad * l, ans = dec(r1(val));
    const pic = sph ? G.sphereFig({ labels: [`${rad} ${u}`] }) : G.coneFig({ r: rad, h: Math.sqrt(l * l - rad * rad), labels: [`${rad} ${u}`, '', `${l} ${u}`] });
    return num(ans, [
      St(sph ? 'The surface of a sphere is exactly 4 times the area of a circle through its centre: SA = 4πr².' : 'A cone has a circle base and a curved surface. The curved part is πrl, where l is the slant height.', sph ? pic : G.coneFig({ r: rad, h: Math.sqrt(l * l - rad * rad), labels: [`${rad} ${u}`, '', `${l} ${u}`], hl: 'slant' })),
      St(sph ? `SA ≈ 4 × 3.14 × ${rad}² = ${dec(val)}.` : `SA = πr² + πrl ≈ 3.14 × ${rad}² + 3.14 × ${rad} × ${l} = ${dec(3.14 * rad * rad)} + ${dec(3.14 * rad * l)} = ${dec(val)}.`),
      St(`To the nearest tenth: ${ans}.`),
      St(`So the surface area is about ${ans} ${u}².`),
    ], { q: `Using π ≈ 3.14, find the surface area of this ${sph ? 'sphere' : 'cone'}, in ${u}². Round to the nearest tenth.`, visual: pic, tol: 0.05001, expr: sph ? `4*3.14*${rad}**2` : `3.14*${rad}**2+3.14*${rad}*${l}` });
  }
  if (v === 5) {
    const k = r.int(2, 4), vol = r.bool(), base = r.int(2, 30), p = vol ? 3 : 2, ans = base * k ** p;
    const pic = G.similarBoxes({ k, labels1: ['1', '', ''], labels2: [`${k}`, '', ''] });
    return num(ans, [
      St(`Every length is ${k} times as long. An area has two lengths multiplied, so areas grow by ${k}² = ${k * k}; a volume has three, so volumes grow by ${k}³ = ${k ** 3}.`, pic),
      St(`${base} × ${k ** p} = ${ans}.`),
      St(`So the larger one has ${vol ? 'volume' : 'surface area'} ${ans} ${vol ? 'cm³' : 'cm²'}.`),
    ], { q: `Two solids are similar. Each length of the larger one is ${k} times the matching length of the smaller one. The smaller has ${vol ? 'volume' : 'surface area'} ${base} ${vol ? 'cm³' : 'cm²'}. What is the ${vol ? 'volume' : 'surface area'} of the larger one?`, visual: pic, expr: `${base}*${k}**${p}` });
  }
  if (v === 6) {
    const a = r.int(2, 15), S = 6 * a * a;
    return num(S, [St(`A cube has 6 faces, all squares of side ${a}.`, G.netFig({ cells: G.CUBE_NETS[5] })), St(`Each face: ${a}² = ${a * a}. Six faces: 6 × ${a * a} = ${S}.`, G.netFig({ cells: G.CUBE_NETS[5], hl: [0, 1, 2, 3, 4, 5] })), St(`So the surface area is ${S} ${u}².`)], { q: `A cube has edges ${a} ${u} long. What is its surface area, in ${u}²?`, visual: G.boxFig({ l: a, w: a, h: a, labels: [`${a} ${u}`, '', ''] }), expr: `6*${a}**2` });
  }
  const [p, q, s] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]), L = r.int(4, 15), tri = (p * q) / 2, rects = (p + q + s) * L, S = 2 * tri + rects;
  const [Pd, Qd] = disp(p, q);
  const pic = (hl) => G.prismFig({ base: [[0, 0], [Pd, 0], [0, Qd]], depth: Math.max(Pd, Qd), sides: [`${p}`, `${s}`, `${q}`], depthLabel: `${L}`, hl });
  return num(S, [
    St(`The two triangle ends are right triangles with legs ${p} and ${q}: each is ${p} × ${q} ÷ 2 = ${tri}, so both together are ${2 * tri}.`, pic(['base'])),
    St(`The three rectangles are each ${L} long and as wide as a side of the triangle: (${p} + ${q} + ${s}) × ${L} = ${rects}.`, pic(['sides'])),
    St(`${2 * tri} + ${rects} = ${S}.`),
    St(`So the surface area is ${S} ${u}².`),
  ], { q: `This prism has right-triangle ends with sides ${p}, ${q} and ${s} ${u}, and it is ${L} ${u} long. What is its surface area, in ${u}²?`, visual: pic(), expr: `${p}*${q}+(${p}+${q}+${s})*${L}` });
}

// ───────── the lessons: key ideas on the board, each with its picture ─────────
const L = (text, visual) => ({ text, visual });
export const LESSONS = {
  polyAngles: [
    L('A polygon with n sides can be cut into n − 2 triangles by the diagonals from one corner.', G.triangulated(G.regular(6))),
    L('Each triangle has 180°, so the interior angles add to (n − 2) × 180°. A hexagon: 4 × 180° = 720°.'),
    L('In a regular polygon all n angles are equal: each one is (n − 2) × 180° ÷ n.', G.polygonFig({ pts: G.regular(6), ticks: Array(6).fill(1), angles: ['120°', '120°', '120°', '120°', '120°', '120°'] })),
    L('An exterior angle is made by extending one side. Interior + exterior = 180°, and the exterior angles of any polygon add to 360°.', G.polygonFig({ pts: G.regular(5), ext: 1, extLabel: '72°', angles: ['', '108°'] })),
  ],
  area2d: [
    L('Area measures the flat space inside a shape, in square units. Perimeter is the distance around it.'),
    L('Parallelogram: A = base × height. The height is at right angles to the base, never the slanted side.', G.polygonFig({ pts: [[0, 0], [7, 0], [9.5, 4], [2.5, 4]], sides: ['b', '', '', ''], base: 0, height: { from: 3, side: 0, label: 'h' }, hl: ['base', 'height'] })),
    L('Triangle: A = base × height ÷ 2, because two copies of it make a parallelogram.', G.polygonFig({ pts: [[0, 0], [8, 0], [2.5, 5]], sides: ['b', '', ''], base: 0, height: { from: 2, side: 0, label: 'h' }, hl: ['base', 'height'] })),
    L('Trapezoid: A = (a + b) × h ÷ 2, where a and b are the parallel sides.', G.polygonFig({ pts: [[0, 0], [9, 0], [7, 4], [2, 4]], sides: ['b', '', 'a', ''], height: { from: 3, side: 0, label: 'h' }, par: [1, 0, 1, 0] })),
    L('Circle: A = πr² and C = 2πr. The radius is half the diameter.', G.circleFig({ show: 'radius', r: 'r' })),
    L('Compound shapes: split them into simple shapes and add, or take away the missing part.', G.polygonFig({ pts: [[0, 0], [8, 0], [8, 3], [3, 3], [3, 7], [0, 7]], regions: [{ pts: [[0, 0], [8, 0], [8, 3], [0, 3]], t: 'hl' }, { pts: [[0, 3], [3, 3], [3, 7], [0, 7]], t: 'hl2' }], cuts: [[[0, 3], [3, 3]]] })),
  ],
  quads: [
    L('Marks tell you the facts: ticks for equal sides, arrows for parallel sides, a small square for a right angle.', G.polygonFig(QUADS.Parallelogram)),
    L('Parallelogram: opposite sides parallel and equal, opposite angles equal, next-door angles add to 180°, diagonals cut each other in half.'),
    L('Rectangle: a parallelogram with four right angles. Rhombus: a parallelogram with four equal sides. Square: both.', { type: 'figs', figs: [G.polygonFig(QUADS.Rectangle), G.polygonFig(QUADS.Rhombus), G.polygonFig(QUADS.Square)], captions: ['Rectangle', 'Rhombus', 'Square'] }),
    L('Trapezoid: exactly one pair of parallel sides. Kite: two pairs of equal sides next to each other.', { type: 'figs', figs: [G.polygonFig(QUADS.Trapezoid), G.polygonFig(QUADS.Kite)], captions: ['Trapezoid', 'Kite'] }),
  ],
  solids: [
    L('A face is a flat surface, an edge is where two faces meet, and a vertex is a corner. Dashed edges are hidden at the back.', G.boxFig({ l: 6, w: 3, h: 4 })),
    L('A prism has two matching bases joined by rectangles. A pyramid has one base and triangles meeting at a point.', { type: 'figs', figs: [G.prismFig({ base: [[0, 0], [5, 0], [2, 4]], depth: 6 }), G.pyramidFig({ a: 5, h: 6 })], captions: ['Prism', 'Pyramid'] }),
    L('A net is the solid unfolded flat: every face appears once.', { type: 'figs', figs: [G.netFig({ cells: G.CUBE_NETS[5] }), G.cylinderNet()], captions: ['Cube', 'Cylinder'] }),
    L('A cross-section is the face you see when you slice a solid with a plane.', { type: 'figs', figs: [G.sliceFig({ solid: 'cylinder', cut: 'across' }), G.sliceFig({ solid: 'cone', cut: 'down' })], captions: ['Circle', 'Triangle'] }),
    L('Euler’s formula for solids with flat faces: F + V − E = 2.'),
  ],
  volume: [
    L('Volume is the space inside a solid, in cubic units: how many unit cubes fill it.', G.boxFig({ l: 4, w: 3, h: 2, cubes: true })),
    L('Prism or cylinder: V = base area × height. The base area is one layer; the height is the number of layers.', G.boxFig({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'], hl: ['base', 'height'] })),
    L('Cylinder: V = πr²h.', G.cylinderFig({ r: 3, h: 5, labels: ['r', 'h'], hl: ['base'] })),
    L('Pyramid or cone: V = base area × height ÷ 3. It holds one third of the prism around it.', { type: 'figs', figs: [G.pyramidFig({ a: 5, h: 6, labels: ['', 'h', ''] }), G.coneFig({ r: 3, h: 6, labels: ['r', 'h', ''] })], captions: ['Pyramid', 'Cone'] }),
    L('Sphere: V = 4/3 × π × r³.', G.sphereFig({ labels: ['r'] })),
  ],
  surface: [
    L('Surface area is the total area of all the faces. Unfold the solid into its net and add the area of every piece.', G.boxNet({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'] })),
    L('Box: SA = 2lw + 2lh + 2wh (three matching pairs).', G.boxNet({ l: 6, w: 3, h: 4, labels: ['l', 'w', 'h'], hl: 'tb' })),
    L('Cylinder: two circles and a rectangle whose length is the circumference: SA = 2πr² + 2πrh.', G.cylinderNet({ labels: ['r', 'h', '2πr'], hl: 'rect' })),
    L('Pyramid: base + the triangles. Cone: πr² + πrl, with l the slant height. Sphere: 4πr².', G.coneFig({ r: 3, h: 6, labels: ['r', '', 'l'], hl: 'slant' })),
    L('Similar solids with scale factor k: surface areas multiply by k², volumes by k³.', G.similarBoxes({ k: 2 })),
  ],
};
