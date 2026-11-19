// Grade 11 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
import * as GEO from './geo-g1112.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const SUP = { 2: '²', 3: '³' };
const pw = (v, e) => (e === 1 ? v : SUP[e] ? v + SUP[e] : `${v}^${e}`);
// a polynomial from its coefficients, highest power first: [2, -3, 1] → "2x² − 3x + 1"
const poly = (cs, v = 'x') => { const d = cs.length - 1; let s = ''; cs.forEach((c, i) => { const e = d - i; if (!c) return; const a = Math.abs(c); const body = e === 0 ? String(a) : (a === 1 ? '' : a) + pw(v, e); s += s ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; }); return s || '0'; };
const fx = (p) => (p === 0 ? 'x' : `(x ${sgn(-p)})`);          // the factor whose root is p
const fm = (s) => String(s).replace(/^-/, '−');                 // a minus sign for display
const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
const radS = (k, m) => (m === 1 ? String(k) : k === 1 ? `√${m}` : `${k}√${m}`);
const yn = (r, ok, extra) => mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], extra);
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const nCr = (n, k) => fact(n) / (fact(k) * fact(n - k));
const RAD = Math.PI / 180;
const FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
const vform = (a, h, k) => `y = ${a === 1 ? '' : a === -1 ? '−' : neg(a)}${h === 0 ? 'x²' : `(x ${sgn(-h)})²`}${k ? ' ' + sgn(k) : ''}`;
const eq2 = (a, b, c) => `${poly([a, 0])} ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${neg(c)}`;

// ───────── 1. Measurement ─────────
skill('11-rates', 11, 'Measurement', 'Unit rates and scale drawings', ['A unit rate is the amount for one unit: divide the total by the number of units.', 'On a map or plan, multiply the drawing length by the scale to get the real length.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const n = r.int(3, 12), pc = r.int(5, 60) * 5, tot = n * pc, item = r.pick(['juice boxes', 'granola bars', 'pencils', 'notebooks']);
    return num(dec(pc / 100, 2), ['Unit rate = total cost ÷ number of items.', `$${(tot / 100).toFixed(2)} ÷ ${n} = $${(pc / 100).toFixed(2)} each.`], { q: `A pack of ${n} ${item} costs $${(tot / 100).toFixed(2)}. What is the cost of one, in dollars?`, expr: `${tot}/100/${n}` });
  }
  if (t === 1) {
    const v = r.int(40, 110), h = r.int(2, 6), d = v * h;
    return num(v, ['Speed = distance ÷ time.', `${d} km ÷ ${h} h = ${v} km/h.`], { q: `A train travels ${d} km in ${h} hours at a steady speed. What is its speed in km/h?`, expr: `${d}/${h}` });
  }
  if (t === 2) {
    const s = r.pick([2, 5, 10, 25]), L = r.int(4, 30) / 2;
    return num(dec(L * s), [`Each centimetre on the map is ${s} km.`, `${dec(L)} × ${s} = ${dec(L * s)} km.`], { q: `On a map, 1 cm stands for ${s} km. Two towns are ${dec(L)} cm apart on the map. How far apart are they really, in km?`, expr: `${L}*${s}` });
  }
  const s = r.pick([2, 4, 5]), real = r.int(3, 20);
  return num(dec(real / s), [`Each centimetre on the plan is ${s} m, so divide the real length by ${s}.`, `${real} ÷ ${s} = ${dec(real / s)} cm.`], { q: `A floor plan uses the scale 1 cm : ${s} m. A room is ${real} m long. How long is it on the plan, in cm?`, expr: `${real}/${s}` });
});

// ───────── 2. Equations ─────────
skill('11-equations', 11, 'Equations', 'Linear and absolute value equations', ['Undo each operation in reverse order to get x alone.', '|x| is the distance from 0, so |x − 3| = 5 means x − 3 = 5 or x − 3 = −5.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.nonzero(-9, 9), b = r.nonzero(-20, 20), x = r.int(-10, 10), c = a * x + b;
    return num(x, [`${b > 0 ? `Subtract ${b} from` : `Add ${-b} to`} both sides: ${poly([a, 0])} = ${neg(c - b)}.`, a === 1 ? `So x = ${neg(x)}.` : `Divide by ${neg(a)}: x = ${neg(x)}.`], { q: `Solve ${poly([a, b])} = ${neg(c)}.`, expr: `(${c}-(${b}))/(${a})` });
  }
  if (t === 1) {
    const f = r.int(2, 8) * 10, m = r.int(15, 45), n = r.int(3, 12), T = f + m * n, who = r.pick(NAMES);
    return num(n, [`Let m be the number of months: ${f} + ${m}m = ${T}.`, `${m}m = ${T - f}.`, `m = ${T - f} ÷ ${m} = ${n}.`], { q: `A gym charges a $${f} joining fee plus $${m} a month. ${who} has paid $${T} in total. For how many months has ${who} been a member?`, expr: `(${T}-${f})/${m}` });
  }
  if (t === 2) {
    const a = r.nonzero(-15, 15), b = r.nonzero(-15, 15), v = Math.abs(a) - Math.abs(b);
    return num(v, [`|${neg(a)}| = ${Math.abs(a)} and |${neg(b)}| = ${Math.abs(b)}.`, `${Math.abs(a)} − ${Math.abs(b)} = ${neg(v)}.`], { q: `Find |${neg(a)}| − |${neg(b)}|.`, expr: `Math.abs(${a})-Math.abs(${b})` });
  }
  if (t === 3) {
    const h = r.int(-8, 8), k = r.int(1, 9), inside = poly([1, -h]);
    return txt(`x = ${neg(h - k)} or x = ${neg(h + k)}`, [`Either ${inside} = ${k} or ${inside} = −${k}.`, `x = ${neg(h + k)} or x = ${neg(h - k)}.`], { q: `Solve |${inside}| = ${k}. Give both solutions.`, numbers: [h - k, h + k] });
  }
  const a = r.pick([1, 2, 3]), b = r.nonzero(-9, 9), k = r.int(-6, 6), e = poly([a, b]);
  const right = k < 0 ? 'No solutions' : k === 0 ? 'One solution' : 'Two solutions';
  return mc(r, right, ['No solutions', 'One solution', 'Two solutions'], { q: `How many solutions does |${e}| = ${neg(k)} have?`, steps: [k < 0 ? `An absolute value is never negative, so it cannot equal ${neg(k)}.` : k === 0 ? `Only ${e} = 0 works.` : `${e} can be ${k} or −${k}.`, `${right}.`] });
});

// ───────── 3. Inequalities ─────────
skill('11-ineq', 11, 'Inequalities', 'Linear inequalities', ['Solve an inequality like an equation, but flip the sign when you multiply or divide by a negative.', 'Closed dot: ≤ or ≥. Open dot: < or >.'], (r) => {
  const t = r.int(0, 3), OPS = ['<', '>', '≤', '≥'];
  if (t === 0) {
    const v = r.int(-8, 8), a = r.nonzero(-5, 5), b = r.int(-10, 10), op = r.pick(OPS), c = a * v + b, res = a < 0 ? FLIP[op] : op, right = `x ${res} ${neg(v)}`;
    return mc(r, right, OPS.filter((o) => o !== res).map((o) => `x ${o} ${neg(v)}`), { q: `Solve ${poly([a, b])} ${op} ${neg(c)}.`, steps: [b ? `${b > 0 ? `Subtract ${b} from` : `Add ${-b} to`} both sides: ${poly([a, 0])} ${op} ${neg(c - b)}.` : `The x term is already alone: ${poly([a, 0])} ${op} ${neg(c)}.`, a < 0 ? `Divide by ${neg(a)}. Dividing by a negative flips the sign: ${right}.` : `Divide by ${a}: ${right}.`] });
  }
  if (t === 1) {
    const n = r.int(-9, 20), [ph, op, mean] = r.pick([['at least', '≥', 'equal to or bigger than'], ['at most', '≤', 'equal to or smaller than'], ['more than', '>', 'bigger than, but not equal to'], ['less than', '<', 'smaller than, but not equal to'], ['no more than', '≤', 'equal to or smaller than'], ['no less than', '≥', 'equal to or bigger than']]);
    return mc(r, `x ${op} ${neg(n)}`, OPS.filter((o) => o !== op).map((o) => `x ${o} ${neg(n)}`), { q: `A number x is ${ph} ${neg(n)}. Which inequality shows this?`, steps: [`"${ph}" means ${mean}.`, `So x ${op} ${neg(n)}.`] });
  }
  if (t === 2) {
    const v = r.int(-6, 6), closed = r.bool(), right = r.bool(), op = closed ? (right ? '≥' : '≤') : (right ? '>' : '<');
    return mc(r, `x ${op} ${neg(v)}`, OPS.filter((o) => o !== op).map((o) => `x ${o} ${neg(v)}`), { q: `A number line has ${closed ? 'a closed (filled) dot' : 'an open dot'} at ${neg(v)} and is shaded to the ${right ? 'right' : 'left'}. Which inequality is graphed?`, visual: { ...numberLine(v - 5, v + 5), ray: { at: v, dir: right ? 'right' : 'left', open: !closed } }, steps: [`${closed ? 'A closed dot means the number itself is included' : 'An open dot means the number itself is not included'}; shading to the ${right ? 'right means bigger numbers' : 'left means smaller numbers'}.`, `So x ${op} ${neg(v)}.`] });
  }
  const m = r.int(-2, 2), b = r.int(-3, 3), px = r.int(-5, 5), py = r.int(-5, 5), op = r.pick(OPS), val = m * px + b;
  const ok = { '<': py < val, '>': py > val, '≤': py <= val, '≥': py >= val }[op];
  return yn(r, ok, { q: `Is the point ${pt(px, py)} a solution of y ${op} ${poly([m, b])}?`, visual: { type: 'plane', lines: [[m, b]], points: [[px, py, 'P']] }, steps: [`When x = ${neg(px)}, ${poly([m, b])} = ${neg(val)}.`, `Is ${neg(py)} ${op} ${neg(val)}? ${ok ? 'Yes' : 'No'}, so the point ${ok ? 'is' : 'is not'} a solution.`] });
});
skill('11-ineq2', 11, 'Inequalities', 'Absolute value and quadratic inequalities', ['|x − h| < k means x is within k of h: h − k < x < h + k.', '|x − h| > k means x is more than k away: x < h − k or x > h + k.', 'For a quadratic, find its zeros, then decide which side is above or below 0.'], (r) => {
  const t = r.int(0, 2);
  const between = (lo, hi, s) => `${neg(lo)} ${s} x ${s} ${neg(hi)}`, outside = (lo, hi, s) => `x ${s} ${neg(lo)} or x ${s === '<' ? '>' : '≥'} ${neg(hi)}`;
  if (t === 0) {
    const h = r.int(-6, 6), k = r.int(1, 8), op = r.pick(['<', '≤', '>', '≥']), inside = poly([1, -h]), lo = h - k, hi = h + k;
    const less = op === '<' || op === '≤', strict = op === '<' || op === '>', s = strict ? '<' : '≤';
    const right = less ? between(lo, hi, s) : outside(lo, hi, s);
    const wrongs = [less ? outside(lo, hi, s) : between(lo, hi, s), less ? between(-h - k, -h + k, s) : outside(-h - k, -h + k, s), less ? between(lo, hi, strict ? '≤' : '<') : outside(lo, hi, strict ? '≤' : '<')];
    return mc(r, right, wrongs, { q: `Solve |${inside}| ${op} ${k}.`, steps: [`The distance from x to ${neg(h)} is ${less ? 'less than' : 'more than'} ${k}${strict ? '' : ' or equal to it'}.`, `${neg(h)} − ${k} = ${neg(lo)} and ${neg(h)} + ${k} = ${neg(hi)}, so ${right}.`] });
  }
  if (t === 1) {
    const p = r.int(-6, 4), q = p + r.int(1, 6), op = r.pick(['<', '≤', '>', '≥']), below = op === '<' || op === '≤', strict = op === '<' || op === '>', s = strict ? '<' : '≤';
    const right = below ? between(p, q, s) : outside(p, q, s);
    const wrongs = [below ? outside(p, q, s) : between(p, q, s), below ? between(-q, -p, s) : outside(-q, -p, s), below ? outside(-q, -p, s) : between(-q, -p, s)];
    return mc(r, right, wrongs, { q: `Solve ${poly([1, -(p + q), p * q])} ${op} 0.`, steps: [`Factor: ${fx(p)}${fx(q)} ${op} 0, so the zeros are ${neg(p)} and ${neg(q)}.`, `The parabola opens up, so it is ${below ? 'below' : 'above'} 0 ${below ? 'between' : 'outside'} the zeros: ${right}.`] });
  }
  const h = r.int(-6, 6), k = r.int(1, 7), strict = r.bool(), n = strict ? 2 * k - 1 : 2 * k + 1, lo = strict ? h - k + 1 : h - k, hi = strict ? h + k - 1 : h + k;
  return num(n, [`The integers that work run from ${neg(lo)} to ${neg(hi)}.`, `${neg(hi)} − ${par(lo)} + 1 = ${n} integers.`], { q: `How many integers x satisfy |${poly([1, -h])}| ${strict ? '<' : '≤'} ${k}?`, expr: `${hi}-(${lo})+1` });
});

// ───────── 4. Functions ─────────
skill('11-func', 11, 'Functions', 'Domain, range and evaluating functions', ['The domain is all the x-values; the range is all the y-values.', 'A function gives each x exactly one y.', 'f(3) means put 3 in for x.'], (r) => {
  const t = r.int(0, 3);
  const setStr = (arr) => `{${[...new Set(arr)].sort((a, b) => a - b).map(neg).join(', ')}}`;
  if (t === 0) {
    const xs = r.shuffle([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 4), ys = xs.map(() => r.int(-4, 9)), askR = r.bool();
    const target = askR ? ys : xs, u = [...new Set(target)].sort((a, b) => a - b), right = setStr(target);
    const wrongs = [setStr(askR ? xs : ys), setStr([...u, u.at(-1) + 1])]; if (u.length > 1) wrongs.push(setStr(u.slice(0, -1)));
    return mc(r, right, wrongs, { q: `What is the ${askR ? 'range' : 'domain'} of the relation {${xs.map((x, i) => pt(x, ys[i])).join(', ')}}?`, steps: [`The ${askR ? 'range' : 'domain'} is the set of ${askR ? 'y' : 'x'}-values (the ${askR ? 'second' : 'first'} numbers).`, `Each value is listed once: ${right}.`] });
  }
  if (t === 1) {
    const xs = r.shuffle([-3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 4), ys = xs.map(() => r.int(-5, 9)), isF = r.bool();
    if (!isF) { xs[3] = xs[0]; ys[3] = ys[0] + r.nonzero(-3, 3); }
    const pts = r.shuffle(xs.map((x, i) => pt(x, ys[i])));
    return yn(r, isF, { q: `Is the relation {${pts.join(', ')}} a function?`, steps: ['A function gives each x-value exactly one y-value.', isF ? 'No x-value repeats, so yes, it is a function.' : `x = ${neg(xs[0])} goes to two different y-values, so no, it is not a function.`] });
  }
  if (t === 2) {
    const a = r.nonzero(-3, 3), b = r.int(-6, 6), c = r.int(-9, 9), x = r.int(-4, 4), v = a * x * x + b * x + c;
    return num(v, [`f(${neg(x)}) = ${neg(a)}(${par(x)})² + ${par(b)}(${par(x)}) + ${par(c)}.`, `= ${neg(a * x * x)} + ${par(b * x)} + ${par(c)} = ${neg(v)}.`], { q: `f(x) = ${poly([a, b, c])}. Find f(${neg(x)}).`, expr: `(${a})*(${x})**2+(${b})*(${x})+(${c})` });
  }
  const m = r.nonzero(-4, 4), b = r.int(-6, 6), xs = [-2, -1, 0, 1, 2], k = r.pick(xs), v = m * k + b;
  return num(k, [`Find ${neg(v)} in the f(x) row of the table.`, `It sits under x = ${neg(k)}, so x = ${neg(k)}.`], { q: `Use the table. For which x is f(x) = ${neg(v)}?`, visual: { type: 'table', head: ['x', ...xs.map(neg)], rows: [['f(x)', ...xs.map((x) => neg(m * x + b))]] }, expr: `(${v}-(${b}))/(${m})` });
});
skill('11-linfunc', 11, 'Functions', 'Linear and absolute value functions', ['Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁).', 'A linear function changes by the same amount each time x goes up by 1.', 'y = a|x − h| + k is a V shape with its vertex at (h, k).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const x1 = r.int(-6, 6), y1 = r.int(-6, 6); let x2 = r.int(-6, 6); while (x2 === x1) x2 = r.int(-6, 6); const y2 = r.int(-6, 6), dy = y2 - y1, dx = x2 - x1;
    return num(frac(dy, dx), [`Slope = (${neg(y2)} − ${par(y1)}) ÷ (${neg(x2)} − ${par(x1)}).`, `= ${neg(dy)} ÷ ${par(dx)} = ${fm(frac(dy, dx))}.`], { q: `Find the slope of the line through ${pt(x1, y1)} and ${pt(x2, y2)}.`, expr: `(${y2}-(${y1}))/(${x2}-(${x1}))` });
  }
  if (t === 1) {
    const m = r.nonzero(-4, 4), b = r.int(-6, 6), x1 = r.int(-3, 0), x2 = x1 + r.int(1, 4), y1 = m * x1 + b, y2 = m * x2 + b, right = `y = ${poly([m, b])}`;
    return mc(r, right, [`y = ${poly([-m, b])}`, `y = ${poly([m, b + r.nonzero(-3, 3)])}`, `y = ${poly([m, -b - 1])}`], { q: `Which equation is the line through ${pt(x1, y1)} and ${pt(x2, y2)}?`, steps: [`Slope m = (${neg(y2)} − ${par(y1)}) ÷ (${neg(x2)} − ${par(x1)}) = ${neg(m)}.`, `b = y − mx = ${neg(y1)} − ${par(m)}(${par(x1)}) = ${neg(b)}.`, `So ${right}.`] });
  }
  if (t === 2) {
    const m = r.nonzero(-5, 6), b = r.int(-8, 8), xs = [0, 1, 2, 3, 4];
    return num(m, [`From x = 0 to x = 1, y changes by ${neg(m + b)} − ${par(b)} = ${neg(m)}.`, `It changes by the same amount every time: ${neg(m)}.`], { q: 'This table shows a linear function. By how much does y change each time x goes up by 1?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [x, neg(m * x + b)]) }, expr: `${m * 4 + b}-(${m * 3 + b})` });
  }
  const a = r.pick([1, 2, 3, -1, -2]), h = r.nonzero(-4, 4), k = r.nonzero(-5, 5), f = `f(x) = ${a === 1 ? '' : a === -1 ? '−' : neg(a)}|${poly([1, -h])}| ${sgn(k)}`;
  if (t === 3) {
    const x = r.int(-6, 6), v = a * Math.abs(x - h) + k;
    return num(v, [`|${neg(x)} − ${par(h)}| = ${Math.abs(x - h)}.`, `${neg(a)} × ${Math.abs(x - h)} ${sgn(k)} = ${neg(v)}.`], { q: `${f}. Complete the table: what is f(${neg(x)})?`, expr: `(${a})*Math.abs(${x}-(${h}))+(${k})` });
  }
  const right = pt(h, k);
  return mc(r, right, [pt(-h, k), pt(h, -k), pt(k, h)], { q: `The graph of ${f} is a V shape. Where is its vertex?`, steps: ['For y = a|x − h| + k the vertex is (h, k).', `Here h = ${neg(h)} and k = ${neg(k)}: ${right}.`] });
});

// ───────── 5. Systems of equations ─────────
skill('11-sys', 11, 'Systems of equations', 'Solutions of systems', ['A solution of a system makes every equation true.', 'Lines that cross: one solution. Parallel lines: none. The same line: infinitely many.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const x0 = r.int(-5, 5), y0 = r.int(-5, 5), a1 = r.nonzero(-5, 5), b1 = r.nonzero(-5, 5), a2 = r.nonzero(-5, 5), b2 = r.nonzero(-5, 5), c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
    const ok = r.bool(), tx = ok ? x0 : x0 + r.nonzero(-2, 2), ty = y0, v1 = a1 * tx + b1 * ty, v2 = a2 * tx + b2 * ty;
    const chk = (a, b, v, c) => `${neg(a)}(${par(tx)}) ${b < 0 ? '−' : '+'} ${Math.abs(b)}(${par(ty)}) = ${neg(v)}${v === c ? ' ✓' : `, not ${neg(c)}`}`;
    const good = v1 === c1 && v2 === c2;
    return yn(r, good, { q: `Is ${pt(tx, ty)} a solution of the system ${eq2(a1, b1, c1)} and ${eq2(a2, b2, c2)}?`, steps: [`First equation: ${chk(a1, b1, v1, c1)}.`, `Second equation: ${chk(a2, b2, v2, c2)}.`, good ? 'Both are true, so yes.' : 'Not both are true, so no.'] });
  }
  if (t === 1) {
    const m1 = r.nonzero(-4, 4), b1 = r.int(-6, 6), kind = r.int(0, 2), k = r.pick([2, 3]);
    const m2 = kind === 0 ? m1 + r.nonzero(-2, 2) : m1, b2 = kind === 1 ? b1 + r.nonzero(-4, 4) : b1;
    const right = ['Exactly one solution', 'No solution', 'Infinitely many solutions'][kind];
    const why = kind === 0 ? `The slopes ${neg(m1)} and ${neg(m2)} are different, so the lines cross once.` : kind === 1 ? `Same slope ${neg(m1)} but different y-intercepts: parallel lines never meet.` : 'Same slope and same y-intercept: it is the same line.';
    return mc(r, right, ['Exactly one solution', 'No solution', 'Infinitely many solutions'], { q: `How many solutions does this system have? y = ${poly([m1, b1])} and ${k}y = ${poly([k * m2, k * b2])}`, steps: [`Divide the second equation by ${k}: y = ${poly([m2, b2])}.`, why, `${right}.`] });
  }
  const x0 = r.int(-4, 4), y0 = r.int(-4, 4), m1 = r.int(-2, 2); let m2 = r.int(-2, 2); while (m2 === m1) m2 = r.int(-2, 2);
  const b1 = y0 - m1 * x0, b2 = y0 - m2 * x0, right = pt(x0, y0);
  return mc(r, right, [pt(y0, x0), pt(-x0, y0), pt(x0, -y0), pt(x0 + 1, y0)], { q: `The graph shows y = ${poly([m1, b1])} and y = ${poly([m2, b2])}. What is the solution of the system?`, visual: { type: 'plane', lines: [[m1, b1], [m2, b2]] }, steps: ['The solution is where the two lines cross.', `They cross at ${right}: ${neg(m1)}(${par(x0)}) ${sgn(b1)} = ${neg(y0)} and ${neg(m2)}(${par(x0)}) ${sgn(b2)} = ${neg(y0)}.`] });
});
skill('11-sys2', 11, 'Systems of equations', 'Solve systems of equations', ['Substitution: put one equation into the other.', 'Elimination: add the equations so one variable cancels.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const x0 = r.int(-6, 6), y0 = r.int(-6, 6), m = r.nonzero(-3, 3), b = y0 - m * x0; let a2, b2; do { a2 = r.nonzero(-5, 5); b2 = r.nonzero(-4, 4); } while (a2 + b2 * m === 0);
    const c2 = a2 * x0 + b2 * y0, A = a2 + b2 * m, Cc = c2 - b2 * b, askX = r.bool();
    return num(askX ? x0 : y0, [`Substitute y = ${poly([m, b])} into ${eq2(a2, b2, c2)}.`, `${poly([a2, 0])} ${b2 < 0 ? '−' : '+'} ${Math.abs(b2)}(${poly([m, b])}) = ${neg(c2)}, so ${poly([A, 0])} = ${neg(Cc)} and x = ${neg(x0)}.`, `Then y = ${neg(m)}(${par(x0)}) ${sgn(b)} = ${neg(y0)}.`], { q: `Solve by substitution: y = ${poly([m, b])} and ${eq2(a2, b2, c2)}. What is ${askX ? 'x' : 'y'}?`, expr: askX ? `(${c2}-(${b2})*(${b}))/(${a2}+(${b2})*(${m}))` : `(${m})*(${c2}-(${b2})*(${b}))/(${a2}+(${b2})*(${m}))+(${b})` });
  }
  if (t === 1) {
    const x0 = r.int(-6, 6), y0 = r.int(-6, 6), a1 = r.nonzero(-5, 5), b1 = r.nonzero(-5, 5); let a2 = r.nonzero(-5, 5); while (a1 + a2 === 0) a2 = r.nonzero(-5, 5);
    const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 - b1 * y0, askX = r.bool();
    return num(askX ? x0 : y0, [`Add the equations; the y terms cancel: ${poly([a1 + a2, 0])} = ${neg(c1 + c2)}.`, `x = ${neg(c1 + c2)} ÷ ${par(a1 + a2)} = ${neg(x0)}.`, `Put it into the first equation: ${poly([b1, 0], 'y')} = ${neg(c1)} − ${par(a1)}(${par(x0)}) = ${neg(c1 - a1 * x0)}, so y = ${neg(y0)}.`], { q: `Solve by elimination: ${eq2(a1, b1, c1)} and ${eq2(a2, -b1, c2)}. What is ${askX ? 'x' : 'y'}?`, expr: askX ? `(${c1}+(${c2}))/(${a1}+(${a2}))` : `(${c1}-(${a1})*(${c1}+(${c2}))/(${a1}+(${a2})))/(${b1})` });
  }
  if (t === 2) {
    const A = r.int(12, 20), Cp = r.int(5, A - 3), n = r.int(10, 40), a = r.int(1, n - 1), T = A * a + Cp * (n - a);
    return num(a, [`Let a = adult tickets and c = child tickets: a + c = ${n} and ${A}a + ${Cp}c = ${T}.`, `Replace c with ${n} − a: ${A}a + ${Cp}(${n} − a) = ${T}, so ${A - Cp}a = ${T - Cp * n}.`, `a = ${a}.`], { q: `A museum sold ${n} tickets for $${T}. Adult tickets cost $${A} and child tickets cost $${Cp}. How many adult tickets were sold?`, expr: `(${T}-${Cp}*${n})/(${A}-${Cp})` });
  }
  const p = r.int(-5, 5); let q = r.int(-5, 5); while (q === p) q = r.int(-5, 5); const s = p + q, tt = -p * q;
  return txt(`x = ${neg(p)} or x = ${neg(q)}`, [`Set them equal: x² = ${poly([s, tt])}, so ${poly([1, -s, -tt])} = 0.`, `Factor: ${fx(p)}${fx(q)} = 0.`, `x = ${neg(p)} or x = ${neg(q)}.`], { q: `Where do y = x² and y = ${poly([s, tt])} meet? Give both x-values.`, numbers: [p, q] });
});

// ───────── 6. Systems of inequalities ─────────
skill('11-sysineq', 11, 'Systems of inequalities', 'Systems of inequalities and linear programming', ['A point is in the solution region only if it makes every inequality true.', 'In linear programming, the greatest or least value is always at a corner (vertex) of the region.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const m1 = r.int(-2, 2), b1 = r.int(-4, 0), m2 = r.int(-2, 2), b2 = r.int(1, 4), o1 = r.pick(['≥', '>']), o2 = r.pick(['≤', '<']), px = r.int(-4, 4), py = r.int(-5, 5);
    const v1 = m1 * px + b1, v2 = m2 * px + b2, ok1 = o1 === '≥' ? py >= v1 : py > v1, ok2 = o2 === '≤' ? py <= v2 : py < v2;
    return yn(r, ok1 && ok2, { q: `Is ${pt(px, py)} a solution of the system y ${o1} ${poly([m1, b1])} and y ${o2} ${poly([m2, b2])}?`, visual: { type: 'plane', lines: [[m1, b1], [m2, b2]], points: [[px, py, 'P']] }, steps: [`First: is ${neg(py)} ${o1} ${neg(v1)}? ${ok1 ? 'Yes' : 'No'}.`, `Second: is ${neg(py)} ${o2} ${neg(v2)}? ${ok2 ? 'Yes' : 'No'}.`, ok1 && ok2 ? 'Both are true, so yes.' : 'Not both are true, so no.'] });
  }
  if (t === 1) {
    const x0 = r.int(-4, 4), y0 = r.int(-4, 4), m1 = r.nonzero(-2, 2); let m2 = r.int(-2, 2); while (m2 === m1) m2 = r.int(-2, 2);
    const b1 = y0 - m1 * x0, b2 = y0 - m2 * x0, right = pt(x0, y0);
    return mc(r, right, [pt(y0, x0), pt(-x0, -y0), pt(x0 + 1, y0), pt(x0, y0 - 1)].filter((s) => s !== right), { q: `The solution region of y ≥ ${poly([m1, b1])} and y ≤ ${poly([m2, b2])} has a vertex where the two boundary lines meet. What is it?`, visual: { type: 'plane', lines: [[m1, b1], [m2, b2]] }, steps: [`Set the boundary lines equal: ${poly([m1, b1])} = ${poly([m2, b2])}, so x = ${neg(x0)}.`, `y = ${neg(m1)}(${par(x0)}) ${sgn(b1)} = ${neg(y0)}. The vertex is ${right}.`] });
  }
  const s = r.int(6, 12), tt = r.int(2, s - 2), c = r.int(1, 9), d = r.int(1, 9), V = [[0, 0], [tt, 0], [tt, s - tt], [0, s]], P = V.map(([x, y]) => c * x + d * y), best = Math.max(...P);
  return num(best, [`The corners are ${V.map(([x, y]) => pt(x, y)).join(', ')}.`, `P at each corner: ${P.join(', ')}.`, `The greatest is ${best}.`], { q: `Find the maximum of P = ${c === 1 ? "" : c}x + ${d === 1 ? "" : d}y for the region x ≥ 0, y ≥ 0, x ≤ ${tt} and x + y ≤ ${s}.`, expr: `Math.max(0, ${c}*${tt}, ${c}*${tt}+${d}*(${s}-${tt}), ${d}*${s})` });
});

// ───────── 7. Factoring ─────────
skill('11-factor', 11, 'Factoring', 'Factor polynomials', ['Always take out the greatest common factor first.', 'Patterns: a² − b² = (a − b)(a + b); a³ + b³ = (a + b)(a² − ab + b²); a³ − b³ = (a − b)(a² + ab + b²).', 'With four terms, try grouping them in pairs.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const g = r.int(2, 6); let a = r.int(1, 7), b = r.int(1, 7); while (gcd(a, b) !== 1 || a === b) { a = r.int(1, 7); b = r.int(1, 7); }
    const e1 = r.int(1, 5), e2 = r.int(1, 5), f1 = r.int(0, 4), f2 = r.int(0, 4), me = Math.min(e1, e2), mf = Math.min(f1, f2);
    const mono = (c, ex, ey) => `${c}${ex ? pw('x', ex) : ''}${ey ? pw('y', ey) : ''}`, right = mono(g, me, mf);
    return mc(r, right, [mono(g, Math.max(e1, e2), mf), mono(g, me, Math.max(f1, f2) || 1), mono(g * a * b, me, mf)], { q: `What is the greatest common factor of ${mono(g * a, e1, f1)} and ${mono(g * b, e2, f2)}?`, steps: [`The greatest common factor of ${g * a} and ${g * b} is ${g}.`, `Take the smaller power of each variable: ${right}.`] });
  }
  if (t === 1) {
    const a = r.pick([1, 1, 2, 3]); let p = r.nonzero(-7, 7), q = r.nonzero(-7, 7); while (gcd(a, p) !== 1 || p === q) { p = r.nonzero(-7, 7); q = r.nonzero(-7, 7); }
    const right = `(${poly([a, p])})(${poly([1, q])})`, ex = poly([a, a * q + p, p * q]);
    const wrongs = [`(${poly([a, -p])})(${poly([1, -q])})`, `(${poly([a, p])})(${poly([1, -q])})`, a === 1 ? `(${poly([1, -p])})(${poly([1, q])})` : `(${poly([a, q])})(${poly([1, p])})`];
    return mc(r, right, wrongs, { q: `Factor ${ex}.`, steps: [a === 1 ? `Find two numbers that multiply to ${neg(p * q)} and add to ${neg(p + q)}: ${neg(p)} and ${neg(q)}.` : `Try (${a}x + ?)(x + ?) with the numbers multiplying to ${neg(p * q)}.`, `Check: ${right} = ${ex}.`] });
  }
  if (t === 2) {
    const a = r.pick([1, 2, 3, 5]); let b = r.int(1, 9); while (gcd(a, b) !== 1) b = r.int(1, 9);
    const right = `(${poly([a, -b])})(${poly([a, b])})`;
    return mc(r, right, [`(${poly([a, -b])})²`, `(${poly([a, b])})²`, `(${poly([a * a, -b])})(${poly([1, b])})`], { q: `Factor ${poly([a * a, 0, -b * b])}.`, steps: [`This is a difference of squares: (${poly([a, 0])})² − ${b}².`, `a² − b² = (a − b)(a + b), so ${right}.`] });
  }
  if (t === 3) {
    const b = r.int(1, 5), plus = r.bool(), s = plus ? 1 : -1;
    const right = `(${poly([1, s * b])})(${poly([1, -s * b, b * b])})`;
    return mc(r, right, [`(${poly([1, s * b])})(${poly([1, s * b, b * b])})`, `(${poly([1, -s * b])})(${poly([1, s * b, b * b])})`, `(${poly([1, s * b])})(${poly([1, -2 * s * b, b * b])})`], { q: `Factor ${poly([1, 0, 0, s * b ** 3])}.`, steps: [`${b ** 3} = ${b}³, so this is a ${plus ? 'sum' : 'difference'} of cubes.`, `${plus ? 'a³ + b³ = (a + b)(a² − ab + b²)' : 'a³ − b³ = (a − b)(a² + ab + b²)'}: ${right}.`] });
  }
  const p = r.nonzero(-6, 6), q = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, -2, -3, -5, -6, -7]);
  const right = `(${poly([1, p])})(${poly([1, 0, q])})`;
  return mc(r, right, [`(${poly([1, -p])})(${poly([1, 0, q])})`, `(${poly([1, p])})(${poly([1, 0, -q])})`, `(${poly([1, q])})(${poly([1, 0, p])})`], { q: `Factor by grouping: ${poly([1, p, q, p * q])}.`, steps: [`Group: x²(${poly([1, p])}) ${q < 0 ? '−' : '+'} ${Math.abs(q)}(${poly([1, p])}).`, `Take out the common bracket: ${right}.`] });
});

// ───────── 8. Quadratic relations ─────────
skill('11-quadsolve', 11, 'Quadratic relations', 'Solve quadratic equations', ['Factor and set each factor to 0, or take square roots.', 'The quadratic formula always works: x = (−b ± √(b² − 4ac)) ÷ 2a.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.pick([1, 2, 3]), h = r.int(-6, 6), s = r.int(1, 8), sq = h === 0 ? 'x²' : `(x ${sgn(-h)})²`;
    return txt(`x = ${neg(h - s)} or x = ${neg(h + s)}`, [a > 1 ? `Divide by ${a}: ${sq} = ${s * s}.` : 'Take the square root of both sides.', `${h === 0 ? 'x' : `x ${sgn(-h)}`} = ±${s}.`, `x = ${neg(h - s)} or x = ${neg(h + s)}.`], { q: `Solve ${a === 1 ? '' : a}${sq} = ${a * s * s}. Give both solutions.`, numbers: [h - s, h + s] });
  }
  if (t === 1) {
    const p = r.int(-9, 9); let q = r.int(-9, 9); while (q === -p) q = r.int(-9, 9);
    return txt(`x = ${neg(p)} or x = ${neg(-q)}`, ['If a product is 0, one of the factors is 0.', `${fx(p)} = 0 gives x = ${neg(p)}; ${fx(-q)} = 0 gives x = ${neg(-q)}.`], { q: `Solve ${fx(p)}${fx(-q)} = 0. Give both solutions.`, numbers: [p, -q] });
  }
  if (t === 2) {
    const p = r.int(-8, 8); let q = r.int(-8, 8); while (q === p) q = r.int(-8, 8);
    return txt(`x = ${neg(p)} or x = ${neg(q)}`, [`Two numbers that multiply to ${neg(p * q)} and add to ${neg(-(p + q))} are ${neg(-p)} and ${neg(-q)}.`, `${fx(p)}${fx(q)} = 0.`, `x = ${neg(p)} or x = ${neg(q)}.`], { q: `Solve ${poly([1, -(p + q), p * q])} = 0. Give both solutions.`, numbers: [p, q] });
  }
  let a, b, c, D; do { a = r.int(1, 3); b = r.int(-9, 9); c = r.int(-9, 9); D = b * b - 4 * a * c; } while (D <= 0 || Number.isInteger(Math.sqrt(D)));
  const x = (-b + Math.sqrt(D)) / (2 * a), ans = dec(x, 2);
  return num(ans, [`a = ${a}, b = ${neg(b)}, c = ${neg(c)}, so b² − 4ac = ${D}.`, `The larger root uses +: x = (${neg(-b)} + √${D}) ÷ ${2 * a} ≈ ${ans}.`], { q: `Use the quadratic formula to solve ${poly([a, b, c])} = 0. Give the larger root, rounded to 2 decimal places.`, tol: 0.006, expr: `(-(${b})+Math.sqrt(${D}))/(2*${a})` });
});
skill('11-quadvertex', 11, 'Quadratic relations', 'Vertex form and standard form', ['Vertex form y = a(x − h)² + k has its vertex at (h, k).', 'a > 0: opens up, with a minimum. a < 0: opens down, with a maximum.', 'Complete the square to change x² + bx + c into vertex form.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.nonzero(-3, 3), h = r.int(-6, 6), k = r.int(-9, 9);
    return num(k, ['In y = a(x − h)² + k, the vertex is (h, k).', `a ${a > 0 ? '> 0, so it opens up and has a minimum' : '< 0, so it opens down and has a maximum'} of ${neg(k)}.`], { q: `What is the ${a > 0 ? 'minimum' : 'maximum'} value of ${vform(a, h, k)}?` });
  }
  if (t === 1) {
    const a = r.nonzero(-3, 3), h = r.int(-5, 5), k = r.int(-9, 9), d = r.nonzero(-3, 3), x1 = h + d, y1 = k + a * d * d, askC = r.bool(), c = a * h * h + k;
    const steps = [`Put the point into y = a(x − h)² + k: ${neg(y1)} = a(${neg(x1)} − ${par(h)})² + ${par(k)}.`, `${neg(y1 - k)} = ${d * d}a, so a = ${neg(a)}.`];
    if (askC) steps.push(`Expand: y = ${poly([a, -2 * a * h, c])}, so c = ${neg(c)}.`);
    return num(askC ? c : a, steps, { q: `A parabola has vertex ${pt(h, k)} and passes through ${pt(x1, y1)}. ${askC ? 'Written in standard form y = ax² + bx + c, what is c?' : 'In y = a(x − h)² + k, what is a?'}`, expr: askC ? `((${y1})-(${k}))/((${x1})-(${h}))**2*(${h})**2+(${k})` : `((${y1})-(${k}))/((${x1})-(${h}))**2` });
  }
  if (t === 2) {
    const h = r.nonzero(-6, 6), b = 2 * h, c = r.nonzero(-9, 9), k = c - h * h;
    const sq = (hh, kk) => `(x ${sgn(hh)})²${kk ? ' ' + sgn(kk) : ''}`, right = sq(h, k);
    return mc(r, right, [sq(-h, k), sq(h, c + h * h), sq(h, c)], { q: `Complete the square: write ${poly([1, b, c])} in the form (x + p)² + q.`, steps: [`Half of ${neg(b)} is ${neg(h)}; its square is ${h * h}.`, `${poly([1, b, c])} = (x ${sgn(h)})² − ${h * h} ${sgn(c)} = ${right}.`] });
  }
  const a = r.nonzero(-4, 4), b = r.int(-8, 8), c = r.int(-9, 9), x = r.int(-3, 3), v = a * x * x + b * x + c;
  return num(v, [`y = ${neg(a)}(${par(x)})² + ${par(b)}(${par(x)}) + ${par(c)}.`, `= ${neg(a * x * x)} + ${par(b * x)} + ${par(c)} = ${neg(v)}.`], { q: `Complete the table for y = ${poly([a, b, c])}: what is y when x = ${neg(x)}?`, expr: `(${a})*(${x})**2+(${b})*(${x})+(${c})` });
});

// ───────── 9. Parabolas ─────────
skill('11-parabola', 11, 'Parabolas', 'Parabolas: direction, vertex and axis', ['y = ax² + …: up if a > 0, down if a < 0. x = ay² + …: right if a > 0, left if a < 0.', 'The axis of symmetry is x = −b ÷ 2a; the vertex is on it.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.nonzero(-3, 3), h = r.int(-5, 5), k = r.int(-5, 5), side = r.bool();
    const right = side ? (a > 0 ? 'Right' : 'Left') : (a > 0 ? 'Up' : 'Down');
    const eq = side ? `x = ${a === 1 ? '' : a === -1 ? '−' : neg(a)}${k === 0 ? 'y²' : `(y ${sgn(-k)})²`}${h ? ' ' + sgn(h) : ''}` : vform(a, h, k);
    return mc(r, right, ['Up', 'Down', 'Left', 'Right'], { q: `Which way does the parabola ${eq} open?`, steps: [side ? 'The y is squared, so it opens left or right.' : 'The x is squared, so it opens up or down.', `a = ${neg(a)} is ${a > 0 ? 'positive' : 'negative'}: it opens ${right.toLowerCase()}.`] });
  }
  if (t === 1) {
    const a = r.nonzero(-3, 3), h = r.int(-5, 5), k = r.int(-9, 9), b = -2 * a * h, c = a * h * h + k, askK = r.bool();
    const s1 = `x = −b ÷ 2a = ${neg(-b)} ÷ ${par(2 * a)} = ${neg(h)}.`;
    return num(askK ? k : h, askK ? [s1, `y = ${neg(a)}(${par(h)})² + ${par(b)}(${par(h)}) + ${par(c)} = ${neg(k)}.`] : ['The axis of symmetry passes through the vertex.', s1], { q: askK ? `What is the y-coordinate of the vertex of y = ${poly([a, b, c])}?` : `The axis of symmetry of y = ${poly([a, b, c])} is x = ?`, expr: askK ? `(${a})*(${-b}/(2*${a}))**2+(${b})*(${-b}/(2*${a}))+(${c})` : `${-b}/(2*${a})` });
  }
  if (t === 2) {
    const a = r.nonzero(-3, 3), h = r.nonzero(-5, 5), k = r.nonzero(-6, 6), d = r.nonzero(-2, 2), right = vform(a, h, k);
    return mc(r, right, [vform(a, -h, k), vform(-a, h, k), vform(a, h, -k)], { q: `A parabola has vertex ${pt(h, k)} and passes through ${pt(h + d, k + a * d * d)}. Which is its equation?`, steps: [`The vertex gives y = a(x ${sgn(-h)})² ${sgn(k)}.`, `Put in the point: ${neg(k + a * d * d)} = a(${d * d}) ${sgn(k)}, so a = ${neg(a)}: ${right}.`] });
  }
  const a = r.pick([1, -1]), h = r.int(-2, 2), k = a > 0 ? r.int(-6, 2) : r.int(-2, 6), right = vform(a, h, k);
  const points = [-2, -1, 0, 1, 2].map((d) => [h + d, k + a * d * d]);
  return mc(r, right, [vform(a, -h, k), vform(-a, h, k), vform(a, h, -k), vform(a, k, h)], { q: 'The points lie on a parabola. Which equation matches?', visual: { type: 'plane', points }, steps: [`The ${a > 0 ? 'lowest' : 'highest'} point, the vertex, is ${pt(h, k)}.`, `One step from the vertex, y changes by ${neg(a)}, so a = ${neg(a)}: ${right}.`] });
});

// ───────── 10. Polynomials ─────────
skill('11-polyops', 11, 'Polynomials', 'Polynomial operations', ['The degree is the highest power; the leading coefficient is the number in front of it.', 'To subtract, change the sign of every term in the second bracket.', 'To multiply, multiply every term by every term.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const d = r.int(2, 5), cs = Array.from({ length: d + 1 }, (_, e) => (e === d ? r.nonzero(-9, 9) : r.bool(0.4) ? 0 : r.nonzero(-9, 9)));
    const terms = r.shuffle(cs.map((c, e) => [c, e]).filter(([c]) => c));
    const str = terms.map(([c, e], i) => { const a = Math.abs(c), body = e === 0 ? String(a) : (a === 1 ? '' : a) + pw('x', e); return i === 0 ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body; }).join('');
    const ask = r.int(0, 2), ans = [d, cs[d], terms.length][ask];
    return num(ans, [`In standard form: ${poly([...cs].reverse())}.`, [`The highest power is ${pw('x', d)}, so the degree is ${d}.`, `The term with the highest power is ${poly([cs[d], ...Array(d).fill(0)])}, so the leading coefficient is ${neg(cs[d])}.`, `Count the terms: ${terms.length}.`][ask]], { q: `For ${str}, what is the ${['degree', 'leading coefficient', 'number of terms'][ask]}?` });
  }
  if (t === 1) {
    const A = [r.nonzero(-6, 6), r.int(-9, 9), r.int(-9, 9)], B = [r.nonzero(-6, 6), r.int(-9, 9), r.nonzero(-9, 9)], sub = r.bool();
    const res = A.map((x, i) => (sub ? x - B[i] : x + B[i])), right = poly(res);
    const wrongs = sub ? [poly(A.map((x, i) => x + B[i])), poly([A[0] - B[0], A[1] - B[1], A[2] + B[2]])] : [poly([A[0] + B[0], A[1] + B[1], A[2] - B[2]]), poly([A[0] + B[0], A[1] - B[1], A[2] + B[2]])];
    wrongs.push(poly([res[0], res[1], res[2] + 1]));
    return mc(r, right, wrongs, { q: `Simplify (${poly(A)}) ${sub ? '−' : '+'} (${poly(B)}).`, steps: [sub ? `Change every sign in the second bracket: ${poly(B.map((x) => -x))}.` : 'Remove the brackets.', `Combine like terms: ${right}.`] });
  }
  if (t === 2) {
    const k = r.nonzero(-5, 5), a = r.nonzero(-4, 4), b = r.int(-6, 6), c = r.nonzero(-6, 6), right = poly([k * a, k * b, k * c, 0]);
    return mc(r, right, [poly([k * a, k * b, k * c]), poly([k * a, b, c, 0]), poly([k * a, k * b, -k * c, 0])], { q: `Multiply: ${poly([k, 0])}(${poly([a, b, c])}).`, steps: [`Multiply each term by ${poly([k, 0])}.`, `${right}.`] });
  }
  if (t === 3) {
    const a = r.int(1, 4), b = r.nonzero(-7, 7), c = r.int(1, 4), d = r.nonzero(-7, 7), ask = r.int(0, 1);
    const v = ask ? a * d + b * c : b * d;
    return num(v, [`(${poly([a, b])})(${poly([c, d])}) = ${poly([a * c, 0, 0])} + ${par(a * d)}x + ${par(b * c)}x + ${par(b * d)}.`, ask ? `The x terms: ${neg(a * d)} + ${par(b * c)} = ${neg(v)}.` : `The constant term is ${neg(b)} × ${par(d)} = ${neg(v)}.`], { q: `Multiply (${poly([a, b])})(${poly([c, d])}). What is the ${ask ? 'coefficient of x' : 'constant term'}?`, expr: ask ? `${a}*(${d})+(${b})*${c}` : `(${b})*(${d})` });
  }
  const p = r.nonzero(-4, 4), q = r.int(-5, 5), s = r.int(-6, 6), R = r.int(-9, 9), cs = [1, q - p, s - p * q, -p * s + R];
  return num(R, ['Divide step by step: x³ ÷ x = x², multiply, subtract, and repeat.', `The quotient is ${poly([1, q, s])} and the remainder is ${neg(R)}.`, `Check with x = ${neg(p)}: f(${neg(p)}) = ${neg(R)}.`], { q: `Use long division: (${poly(cs)}) ÷ ${fx(p)}. What is the remainder?`, expr: `(${p})**3+(${cs[1]})*(${p})**2+(${cs[2]})*(${p})+(${cs[3]})` });
});

// ───────── 11. Radical functions and expressions ─────────
skill('11-roots', 11, 'Radical functions and expressions', 'Roots and simplifying radicals', ['√ undoes squaring, ∛ undoes cubing.', 'To simplify √n, take out the biggest square factor: √72 = √36 × √2 = 6√2.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const kind = r.int(0, 2), n = r.int(2, kind === 2 ? 4 : kind === 1 ? 6 : 15), sg = kind === 1 && r.bool() ? -1 : 1, v = sg * n ** (kind + 2);
    const disp = [`√${v}`, `∛(${neg(v)})`, `∜${v}`][kind];
    return num(sg * n, [`${par(sg * n)}^${kind + 2} = ${neg(v)}.`, `So ${disp} = ${neg(sg * n)}.`], { q: `Find ${disp}.`, expr: `${sg}*Math.round(Math.abs(${v})**(1/${kind + 2}))` });
  }
  if (t === 1) {
    const b = r.int(2, 9); let a = r.int(1, b - 1); while (gcd(a, b) !== 1) a = r.int(1, b - 1); const cube = r.bool(0.3) && b <= 6;
    const e = cube ? 3 : 2, disp = `${cube ? '∛' : '√'}(${a ** e}/${b ** e})`;
    return num(frac(a, b), [`${cube ? '∛' : '√'}${a ** e} = ${a} and ${cube ? '∛' : '√'}${b ** e} = ${b}.`, `So ${disp} = ${a}/${b}.`], { q: `Find ${disp}.`, expr: `(${a ** e}/${b ** e})**(1/${e})` });
  }
  if (t === 2) {
    let n = r.int(2, 200); while (Number.isInteger(Math.sqrt(n))) n = r.int(2, 200); const ans = dec(Math.sqrt(n), 2);
    return num(ans, [`${Math.floor(Math.sqrt(n))}² = ${Math.floor(Math.sqrt(n)) ** 2} and ${Math.ceil(Math.sqrt(n))}² = ${Math.ceil(Math.sqrt(n)) ** 2}, so √${n} is between ${Math.floor(Math.sqrt(n))} and ${Math.ceil(Math.sqrt(n))}.`, `A calculator gives √${n} ≈ ${ans}.`], { q: `Use a calculator: find √${n}, rounded to 2 decimal places.`, tol: 0.006, expr: `Math.sqrt(${n})` });
  }
  if (t === 3) {
    const k = r.int(2, 6), m = r.pick([2, 3, 5, 6, 7, 10, 11]), right = radS(k, m);
    return mc(r, right, [`${m}√${k}`, radS(k + 1, m), `${k * k}√${m}`], { q: `Simplify √${k * k * m}.`, steps: [`${k * k * m} = ${k * k} × ${m}, and ${k * k} is a perfect square.`, `√${k * k * m} = √${k * k} × √${m} = ${right}.`] });
  }
  const k = r.int(2, 9), e = r.int(1, 4), right = `${k}${pw('x', e)}`;
  return mc(r, right, [`${k * k}${pw('x', e)}`, `${k}${pw('x', 2 * e)}`, `${k}${pw('x', e + 2)}`], { q: `Simplify √(${k * k}${pw('x', 2 * e)}), for x ≥ 0.`, steps: [`√${k * k} = ${k}.`, `√(${pw('x', 2 * e)}) = ${pw('x', e)}, since half of ${2 * e} is ${e}: ${right}.`] });
});
skill('11-radops', 11, 'Radical functions and expressions', 'Radical operations and equations', ['√a × √b = √(ab). Add radicals only when the number under the root is the same.', 'To solve √(…) = c, square both sides, then check your answer.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    if (r.bool()) {
      const m = r.pick([2, 3, 5, 6, 7]), s = r.int(1, 4), u = r.int(1, 4), a = m * s * s, b = m * u * u;
      return num(m * s * u, [`√${a} × √${b} = √${a * b}.`, `√${a * b} = ${m * s * u}.`], { q: `Multiply √${a} × √${b}.`, expr: `Math.sqrt(${a}*${b})` });
    }
    const a = r.int(2, 9); let m = r.int(2, 15); while (Number.isInteger(Math.sqrt(m))) m = r.int(2, 15);
    return num(a * a - m, ['Conjugates: (a + √m)(a − √m) = a² − m.', `${a}² − ${m} = ${neg(a * a - m)}.`], { q: `Multiply (${a} + √${m})(${a} − √${m}).`, expr: `(${a}+Math.sqrt(${m}))*(${a}-Math.sqrt(${m}))` });
  }
  if (t === 1) {
    const m = r.pick([2, 3, 5, 6, 7]), c1 = r.int(1, 4), c2 = r.int(1, 4); let k1 = r.int(1, 4), k2 = r.int(1, 4); if (k1 === 1 && k2 === 1) k2 = 2;
    let s = r.bool() ? 1 : -1; if (c1 * k1 + s * c2 * k2 === 0) s = 1;
    const tot = c1 * k1 + s * c2 * k2, fr = (n) => (n === 0 ? '0' : `${n < 0 ? '−' : ''}${radS(Math.abs(n), m)}`), term = (c, n) => (c === 1 ? `√${n}` : `${c}√${n}`);
    const right = fr(tot);
    return mc(r, right, [fr(tot + 1), fr(tot - 1), fr(2 * tot)], { q: `Simplify ${term(c1, m * k1 * k1)} ${s > 0 ? '+' : '−'} ${term(c2, m * k2 * k2)}.`, steps: [`√${m * k1 * k1} = ${radS(k1, m)} and √${m * k2 * k2} = ${radS(k2, m)}.`, `${c1 * k1}√${m} ${s > 0 ? '+' : '−'} ${c2 * k2}√${m} = ${right}.`] });
  }
  if (t === 2) {
    const m = r.pick([2, 3, 5, 6, 7]);
    if (r.bool()) {
      const a = r.int(2, 9), right = `${a}√${m} + ${m}`;
      return mc(r, right, [`${a + m}√${m}`, `${a}√${m} + ${m * m}`, `${a * m} + √${m}`], { q: `Simplify √${m}(${a} + √${m}).`, steps: [`Multiply each term by √${m}: ${a}√${m} + √${m} × √${m}.`, `√${m} × √${m} = ${m}, so ${right}.`] });
    }
    const k = r.int(2, 6), right = radS(k, m);
    return mc(r, right, [radS(k * m, m), radS(k + 1, m), `${k * m}`], { q: `Simplify ${k * m} ÷ √${m} (no root in the denominator).`, steps: [`Multiply top and bottom by √${m}: ${k * m}√${m} ÷ ${m}.`, `${k * m} ÷ ${m} = ${k}, so ${right}.`] });
  }
  if (t === 3) {
    const x0 = r.int(-5, 12), a = r.int(1, 5), c = r.int(1, 9), b = c * c - a * x0;
    return num(x0, [`Square both sides: ${poly([a, b])} = ${c * c}.`, `${poly([a, 0])} = ${neg(c * c - b)}, so x = ${neg(x0)}.`, `Check: √${c * c} = ${c} ✓, so x = ${neg(x0)}.`], { q: `Solve √(${poly([a, b])}) = ${c}.`, expr: `(${c}**2-(${b}))/${a}` });
  }
  const h = r.nonzero(-6, 6), k = r.nonzero(-6, 6), askD = r.bool(), f = `f(x) = √(${poly([1, -h])}) ${sgn(k)}`;
  const right = askD ? `x ≥ ${neg(h)}` : `y ≥ ${neg(k)}`;
  return mc(r, right, askD ? [`x ≥ ${neg(-h)}`, `x ≤ ${neg(h)}`, `x ≥ ${neg(k === h ? h + 1 : k)}`] : [`y ≥ ${neg(-k)}`, `y ≤ ${neg(k)}`, `y ≥ ${neg(h === k ? k + 1 : h)}`], { q: `What is the ${askD ? 'domain' : 'range'} of ${f}?`, steps: [askD ? `The number under the root cannot be negative: ${poly([1, -h])} ≥ 0.` : `√(…) is never negative, so the smallest value of f is 0 ${sgn(k)}.`, `So the ${askD ? 'domain' : 'range'} is ${right}.`] });
});

// ───────── 12. Rational exponents ─────────
skill('11-ratexp', 11, 'Rational exponents', 'Rational exponents', ['x^(1/n) means the nth root of x; x^(m/n) is that root raised to the power m.', 'Multiply powers: add exponents. Divide: subtract. Power of a power: multiply.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const q = r.pick([2, 3]), c = q === 2 ? r.int(2, 10) : r.int(2, 5); let p = r.int(1, 3); while (p % q === 0) p = r.int(1, 3);
    const negE = r.bool(0.35), b = c ** q, v = c ** p, ans = negE ? frac(1, v) : String(v);
    return num(ans, [`The denominator ${q} means a ${q === 2 ? 'square' : 'cube'} root: ${q === 2 ? '√' : '∛'}${b} = ${c}.`, `Then the power ${p}: ${c}^${p} = ${v}${negE ? `, and the negative exponent flips it: 1/${v}` : ''}.`], { q: `Evaluate ${b}^(${negE ? '−' : ''}${p}/${q}).`, expr: `${b}**(${negE ? -p : p}/${q})` });
  }
  if (t === 1) {
    let a, b, c, d; do { a = r.int(1, 5); b = r.pick([2, 3, 4, 5]); c = r.int(1, 5); d = r.pick([2, 3, 4, 6]); } while (a % b === 0 || c % d === 0 || c === 1); const op = r.int(0, 2);
    const e1 = frac(a, b), e2 = frac(c, d), ans = op === 0 ? frac(a * d + c * b, b * d) : op === 1 ? frac(a * d - c * b, b * d) : frac(a * c, b);
    const q = op === 0 ? `x^(${e1}) × x^(${e2})` : op === 1 ? `x^(${e1}) ÷ x^(${e2})` : `(x^(${e1}))^${c}`;
    return num(ans, [op === 0 ? 'Same base, multiplying: add the exponents.' : op === 1 ? 'Same base, dividing: subtract the exponents.' : 'Power of a power: multiply the exponents.', op === 0 ? `${e1} + ${e2} = ${fm(ans)}.` : op === 1 ? `${e1} − ${e2} = ${fm(ans)}.` : `${e1} × ${c} = ${fm(ans)}.`], { q: `Write ${q} as a single power of x. What is the exponent?`, expr: op === 0 ? `${a}/${b}+${c}/${d}` : op === 1 ? `${a}/${b}-${c}/${d}` : `${a}/${b}*${c}` });
  }
  if (t === 2) {
    const q = r.pick([2, 3]); let p = r.int(2, 5); while (gcd(p, q) !== 1) p = r.int(2, 5); const c = r.int(2, p >= 4 ? 3 : 4), v = c ** p;
    return num(c ** q, [`Raise both sides to the power ${q}/${p}: x = ${v}^(${q}/${p}).`, `The ${p === 2 ? 'square' : p === 3 ? 'cube' : p + 'th'} root of ${v} is ${c}, and ${c}^${q} = ${c ** q}.`], { q: `Solve x^(${p}/${q}) = ${v}, for x > 0.`, expr: `Math.round(${v}**(${q}/${p}))` });
  }
  const q = r.pick([2, 3]), c = r.int(2, q === 2 ? 9 : 4), e = r.int(1, 4), right = `${c}${pw('x', e)}`;
  return mc(r, right, [`${c ** q}${pw('x', e)}`, `${c}${pw('x', q * e)}`, `${c}${pw('x', e + q)}`], { q: `Simplify (${c ** q}${pw('x', q * e)})^(1/${q}), for x ≥ 0.`, steps: [`${c ** q}^(1/${q}) = ${c}.`, `(${pw('x', q * e)})^(1/${q}) = x^(${q * e}/${q}) = ${pw('x', e)}, so ${right}.`] });
});

// ───────── 13. Rational functions and expressions ─────────
skill('11-ratfunc', 11, 'Rational functions and expressions', 'Rational functions: asymptotes and domain', ['A rational function is not defined where its denominator is 0; that gives an excluded value or a vertical asymptote.', 'y = a ÷ (x − h) + k has asymptotes x = h and y = k.'], (r) => {
  const t = r.int(0, 3);
  const a = r.nonzero(-6, 6), h = r.nonzero(-6, 6), k = r.int(-6, 6), f = `y = ${neg(a)}/${fx(h)}${k ? ' ' + sgn(k) : ''}`;
  if (t === 0) {
    const vert = r.bool();
    return num(vert ? h : k, [vert ? `The denominator ${fx(h)} is 0 when x = ${neg(h)}.` : `As x gets very large, ${neg(a)}/${fx(h)} gets close to 0.`, vert ? `So the vertical asymptote is x = ${neg(h)}.` : `So y gets close to ${neg(k)}: the horizontal asymptote is y = ${neg(k)}.`], { q: `For ${f}, what is the ${vert ? 'vertical asymptote, x = ?' : 'horizontal asymptote, y = ?'}` });
  }
  if (t === 1) {
    const q = r.int(-6, 6); let s = r.int(-6, 6); while (s === q) s = r.int(-6, 6); let p = r.int(-6, 6); while (p === -q || p === -s) p = r.int(-6, 6);
    return txt(`x = ${neg(q)} or x = ${neg(s)}`, ['The expression is not defined where the denominator is 0.', `${fx(q)} = 0 or ${fx(s)} = 0, so x = ${neg(q)} or x = ${neg(s)}.`], { q: `Which values of x are excluded from (${poly([1, p])}) ÷ (${fx(q)}${fx(s)})? Give both.`, numbers: [q, s] });
  }
  if (t === 2) {
    const askD = r.bool(), right = askD ? `all real numbers except x = ${neg(h)}` : `all real numbers except y = ${neg(k)}`;
    const wrongs = askD ? [`all real numbers except x = ${neg(-h)}`, `all real numbers except x = ${neg(k === h ? h + 1 : k)}`, 'all real numbers'] : [`all real numbers except y = ${neg(h === k ? k + 1 : h)}`, `all real numbers except y = ${neg(k === 0 ? 1 : -k)}`, 'all real numbers'];
    return mc(r, right, wrongs, { q: `What is the ${askD ? 'domain' : 'range'} of ${f}?`, steps: [askD ? `x cannot make the denominator 0: x ≠ ${neg(h)}.` : `${neg(a)}/${fx(h)} is never 0, so y never equals ${neg(k)}.`, `The ${askD ? 'domain' : 'range'} is ${right}.`] });
  }
  const p = r.nonzero(-5, 5), b = r.int(-9, 9), c = r.int(-6, 6); let v = r.int(-6, 6); while (v === -c) v = r.int(-6, 6);
  const top = p * v + b, bot = v + c;
  return num(frac(top, bot), [`Top: ${neg(p)}(${par(v)}) ${sgn(b)} = ${neg(top)}. Bottom: ${neg(v)} ${sgn(c)} = ${neg(bot)}.`, `${neg(top)} ÷ ${par(bot)} = ${fm(frac(top, bot))}.`], { q: `Evaluate (${poly([p, b])}) ÷ (${poly([1, c])}) when x = ${neg(v)}.`, expr: `(${p}*(${v})+(${b}))/((${v})+(${c}))` });
});
skill('11-ratexpr', 11, 'Rational functions and expressions', 'Rational expressions and equations', ['Factor first, then cancel common factors.', 'To solve a rational equation, multiply both sides by the denominator, then check that the answer does not make it 0.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const p = r.nonzero(-6, 6); let q = r.nonzero(-6, 6); while (q === p) q = r.nonzero(-6, 6);
    const right = poly([1, q]);
    return mc(r, right, [poly([1, p]), poly([1, -q]), poly([1, p + q])], { q: `Simplify (${poly([1, p + q, p * q])}) ÷ (${poly([1, p])}).`, steps: [`Factor the top: (${poly([1, p])})(${poly([1, q])}).`, `Cancel (${poly([1, p])}): ${right}.`] });
  }
  if (t === 1) {
    const a = r.nonzero(-6, 6); let b = r.nonzero(-6, 6), c = r.nonzero(-6, 6); while (b === a || c === a || c === b) { b = r.nonzero(-6, 6); c = r.nonzero(-6, 6); }
    const F = (s) => `(${poly([1, s])})`;
    if (r.bool()) {
      const right = `${F(a)}/${F(c)}`;
      return mc(r, right, [`${F(a)}/${F(b)}`, `${F(b)}/${F(c)}`, `${F(c)}/${F(a)}`], { q: `Simplify ${F(a)}/${F(b)} × ${F(b)}/${F(c)}.`, steps: [`Multiply: ${F(a)}${F(b)} ÷ (${F(b)}${F(c)}).`, `Cancel ${F(b)}: ${right}.`] });
    }
    const right = `${F(a)}/${F(b)}`;
    return mc(r, right, [`${F(b)}/${F(a)}`, `${F(a)}/${F(c)}`, `${F(a)}${F(b)}/${F(c)}²`], { q: `Simplify ${F(a)}/${F(c)} ÷ ${F(b)}/${F(c)}.`, steps: [`Dividing means multiplying by the flip: ${F(a)}/${F(c)} × ${F(c)}/${F(b)}.`, `Cancel ${F(c)}: ${right}.`] });
  }
  if (t === 2) {
    const a = r.int(1, 9), b = r.int(1, 9), k = r.int(2, 5), right = `${a * k + b}/(${k}x)`;
    return mc(r, right, [`${a + b}/(${k}x)`, `${a + b}/(${k + 1}x)`, `${a * k + b}/(${k}x²)`], { q: `Add ${a}/x + ${b}/(${k}x).`, steps: [`The common denominator is ${k}x: ${a}/x = ${a * k}/(${k}x).`, `${a * k}/(${k}x) + ${b}/(${k}x) = ${right}.`] });
  }
  const c = r.nonzero(-5, 5), m = r.nonzero(-6, 6), b = r.int(-6, 6), a = c * m, x0 = m - b;
  return num(x0, [`Multiply both sides by (${poly([1, b])}): ${neg(a)} = ${neg(c)}(${poly([1, b])}).`, `Divide by ${par(c)}: ${poly([1, b])} = ${neg(m)}, so x = ${neg(x0)}.`], { q: `Solve ${neg(a)}/(${poly([1, b])}) = ${neg(c)}.`, expr: `${a}/(${c})-(${b})` });
});

// ───────── 14. Exponential functions ─────────
skill('11-expfunc', 11, 'Exponential functions', 'Exponential functions and interest', ['In y = a × bˣ, b > 1 means growth and 0 < b < 1 means decay.', 'A negative exponent means a reciprocal: 2^(−3) = 1/8.', 'Compound interest: A = P(1 + r/n)^(nt).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.int(1, 6), b = r.int(2, 5), x = r.int(-3, 3), v = x < 0 ? frac(a, b ** -x) : String(a * b ** x);
    return num(v, [x < 0 ? `${b}^${neg(x)} = 1/${b ** -x}.` : `${b}^${x} = ${b ** x}.`, `${a} × ${x < 0 ? `1/${b ** -x}` : b ** x} = ${v}.`], { q: `f(x) = ${a === 1 ? '' : a + ' × '}${b}^x. Find f(${neg(x)}).`, expr: `${a}*${b}**(${x})` });
  }
  if (t === 1) {
    const c = r.pick([2, 3, 5]), p = r.int(1, c === 5 ? 2 : 3), s = r.int(1, c === 2 ? 9 : c === 3 ? 6 : 4), d = r.nonzero(-3, 3), ans = frac(s - p * d, p);
    return num(ans, [`Write both sides as powers of ${c}: ${c}^(${p === 1 ? '' : p}(x ${sgn(d)})) = ${c}^${s}.`, `${p === 1 ? '' : p}(x ${sgn(d)}) = ${s}, so x = ${fm(ans)}.`], { q: `Solve ${c ** p}^(x ${sgn(d)}) = ${c ** s}.`, expr: `${s}/${p}-(${d})` });
  }
  if (t === 2) {
    const lin = r.bool(), a = r.int(2, 6), xs = [0, 1, 2, 3];
    const k = r.pick([2, 3]), dd = r.nonzero(-5, 6), ys = xs.map((x) => (lin ? a + dd * x : a * k ** x));
    return mc(r, lin ? 'Linear' : 'Exponential', [lin ? 'Exponential' : 'Linear'], { q: 'Is the function in the table linear or exponential?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [x, neg(ys[i])]) }, steps: [lin ? `Each step adds the same amount: ${neg(dd)}.` : `Each step multiplies by the same number: ${k}.`, lin ? 'Equal differences: linear.' : 'Equal ratios: exponential.'] });
  }
  if (t === 3) {
    const grow = r.bool(), pct = r.pick([2, 3, 4, 5, 8, 10, 12, 15, 20, 25]), b = grow ? 1 + pct / 100 : 1 - pct / 100, a = r.int(1, 9) * 100;
    return mc(r, grow ? 'Growth' : 'Decay', [grow ? 'Decay' : 'Growth'], { q: `Does y = ${a}(${dec(b)})^x show exponential growth or decay?`, steps: [`The base is ${dec(b)}, which is ${grow ? 'more' : 'less'} than 1.`, grow ? `Growth, by ${pct}% each step.` : `Decay, by ${pct}% each step.`] });
  }
  const P = r.int(5, 50) * 100, rt = r.pick([2, 3, 4, 5, 6]), yrs = r.int(2, 10), cont = r.bool(0.3), n = r.pick([1, 2, 4, 12]);
  const A = cont ? P * Math.exp(rt / 100 * yrs) : P * (1 + rt / 100 / n) ** (n * yrs), ans = (Math.round(A * 100) / 100).toFixed(2);
  const how = { 1: 'once a year', 2: 'twice a year', 4: 'every quarter', 12: 'every month' }[n];
  return num(ans, [cont ? `A = Pe^(rt) = ${P} × e^(${rt / 100} × ${yrs}).` : `A = P(1 + r/n)^(nt) = ${P}(1 + ${rt / 100}/${n})^(${n * yrs}).`, `A ≈ $${ans}.`], { q: `$${comma(P)} is invested at ${rt}% a year, compounded ${cont ? 'continuously' : how}. How much is it worth after ${yrs} years? Round to the nearest cent.`, tol: 0.011, expr: cont ? `${P}*Math.exp(${rt}/100*${yrs})` : `${P}*(1+${rt}/100/${n})**(${n}*${yrs})` });
});

// ───────── 15–22. Geometry and trigonometry, taught with pictures (generators and lessons in geo-g1112.mjs) ─────────
// ───────── 15. Angle measures ─────────
skill('11-angles', 11, 'Angle measures', 'Quadrants, coterminal and reference angles', GEO.LESSONS11.angles, GEO.angles);

// ───────── 16. Right triangles ─────────
export const TRIPLES = GEO.TRIPLES;
skill('11-righttri', 11, 'Right triangles', 'Pythagorean theorem and special triangles', GEO.LESSONS11.righttri, GEO.righttri);

// ───────── 17. Trigonometry ─────────
export const TRIG_DEF = GEO.TRIG_DEF;
export const SPECIAL = GEO.SPECIAL;
skill('11-trigratio', 11, 'Trigonometry', 'The six trigonometric ratios', GEO.LESSONS11.trigratio, GEO.trigratio);
skill('11-trigsolve', 11, 'Trigonometry', 'Solve right triangles and trig equations', GEO.LESSONS11.trigsolve, GEO.trigsolve);
skill('11-triglaws', 11, 'Trigonometry', 'Sine Law, Cosine Law and triangle area', GEO.LESSONS11.triglaws, GEO.triglaws);

// ───────── 18. Two-dimensional figures ─────────
skill('11-polygons', 11, 'Two-dimensional figures', 'Polygons and quadrilaterals', GEO.LESSONS11.polygons, GEO.polygons);
skill('11-area2d', 11, 'Two-dimensional figures', 'Area and perimeter', GEO.LESSONS11.area2d, GEO.area2d);

// ───────── 19. Three-dimensional figures ─────────
skill('11-solids', 11, 'Three-dimensional figures', 'Parts of solids, nets and cross-sections', GEO.LESSONS11.solids, GEO.solids);
skill('11-volume', 11, 'Three-dimensional figures', 'Surface area and volume', GEO.LESSONS11.volume, GEO.volume);

// ───────── 20. Congruent figures ─────────
skill('11-congruent', 11, 'Congruent figures', 'Congruent triangles', GEO.LESSONS11.congruent, GEO.congruent);
skill('11-angleproof', 11, 'Congruent figures', 'Angle reasons for proofs', GEO.LESSONS11.angleproof, GEO.angleproof);

// ───────── 21. Triangles ─────────
skill('11-triangles', 11, 'Triangles', 'Triangle angles, sides and segments', GEO.LESSONS11.triangles, GEO.triangles);

// ───────── 22. Similarity ─────────
skill('11-similar', 11, 'Similarity', 'Similar figures and indirect measurement', GEO.LESSONS11.similar, GEO.similar);
skill('11-similar2', 11, 'Similarity', 'Similar triangles: areas, proportions and rules', GEO.LESSONS11.similar2, GEO.similar2);

// ───────── 23. Logic ─────────
export const CONDS = [['n is divisible by 6', 'n is divisible by 3', 'n is not divisible by 6', 'n is not divisible by 3'], ['ABCD is a square', 'ABCD has four right angles', 'ABCD is not a square', 'ABCD does not have four right angles'], ['Sam lives in Halifax', 'Sam lives in Nova Scotia', 'Sam does not live in Halifax', 'Sam does not live in Nova Scotia'], ['∠A measures 30°', '∠A is acute', '∠A does not measure 30°', '∠A is not acute'], ['△PQR is equilateral', '△PQR is isosceles', '△PQR is not equilateral', '△PQR is not isosceles'], ['x = 4', 'x² = 16', 'x ≠ 4', 'x² ≠ 16'], ['it is raining', 'the ground is wet', 'it is not raining', 'the ground is not wet']];
export const NEGS = [['All maples lose their leaves in autumn.', 'Some maples do not lose their leaves in autumn.', ['No maples lose their leaves in autumn.', 'All maples keep their leaves in autumn.']], ['Some students walk to school.', 'No students walk to school.', ['Some students do not walk to school.', 'All students walk to school.']], ['7 is a prime number.', '7 is not a prime number.', ['7 is an even number.', '8 is a prime number.']], ['Every square is a rectangle.', 'Some square is not a rectangle.', ['No square is a rectangle.', 'Every rectangle is a square.']], ['There is a whole number between 3 and 4.', 'There is no whole number between 3 and 4.', ['There is a whole number between 4 and 5.', 'There are two whole numbers between 3 and 4.']]];
export const BICOND = [['A triangle is equilateral if and only if all its angles are 60°.', true], ['A number is even if and only if it ends in 4.', false], ['x = 5 if and only if x² = 25.', false], ['An angle is a right angle if and only if it measures 90°.', true], ['A quadrilateral is a square if and only if it has four right angles.', false], ['A whole number is divisible by 10 if and only if it ends in 0.', true]];
skill('11-logic', 11, 'Logic', 'Conditional statements', ['In "If p, then q", p is the hypothesis and q is the conclusion.', 'Converse: if q then p. Inverse: if not p then not q. Contrapositive: if not q then not p.', 'A statement and its contrapositive are always both true or both false.'], (r) => {
  const t = r.int(0, 3), [p, q, np, nq] = r.pick(CONDS), stmt = `If ${p}, then ${q}.`;
  if (t === 0) {
    const hyp = r.bool(), right = hyp ? p : q;
    return mc(r, right, [hyp ? q : p, np, nq], { q: `In "${stmt}", what is the ${hyp ? 'hypothesis' : 'conclusion'}?`, steps: ['The hypothesis follows "if"; the conclusion follows "then".', `The ${hyp ? 'hypothesis' : 'conclusion'} is "${right}".`] });
  }
  if (t === 1) {
    const forms = { converse: `If ${q}, then ${p}.`, inverse: `If ${np}, then ${nq}.`, contrapositive: `If ${nq}, then ${np}.` }, kind = r.pick(Object.keys(forms)), right = forms[kind];
    return mc(r, right, [...Object.values(forms).filter((x) => x !== right), stmt], { q: `Statement: "${stmt}" Which is its ${kind}?`, steps: [{ converse: 'The converse swaps the hypothesis and conclusion.', inverse: 'The inverse negates both parts.', contrapositive: 'The contrapositive swaps and negates both parts.' }[kind], `"${right}"`] });
  }
  if (t === 2) {
    const [s, right, wr] = r.pick(NEGS);
    return mc(r, right, wr, { q: `What is the negation of "${s}"?`, steps: ['The negation is true exactly when the statement is false.', `"${right}"`] });
  }
  const [s, tv] = r.pick(BICOND);
  return mc(r, tv ? 'True' : 'False', [tv ? 'False' : 'True'], { q: `Is this biconditional true or false? "${s}"`, steps: ['A biconditional is true only if the statement works in both directions.', tv ? 'Both directions are true: true.' : 'One direction fails, so it is false.'] });
});
export const CEX = [['If n is prime, then n is odd.', ['2'], ['3', '5', '7', '9']], ['If x² = 9, then x = 3.', ['−3'], ['3', '9', '0']], ['If a number is divisible by 2, then it is divisible by 4.', ['6', '10', '14'], ['8', '12', '16', '5']], ['The square of a number is always greater than the number.', ['1', '0', '1/2'], ['2', '3', '5', '−1']], ['If x² > 4, then x > 2.', ['−3', '−5'], ['3', '5', '1', '0']], ['If a whole number is a multiple of 3, then it is a multiple of 9.', ['6', '12', '15'], ['9', '18', '27', '4']]];
skill('11-truth', 11, 'Logic', 'Truth values, truth tables and counterexamples', ['p ∧ q (and) is true only when both are true. p ∨ q (or) is true when at least one is true.', 'p → q is false only when p is true and q is false.', 'A counterexample makes the hypothesis true and the conclusion false.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const P = r.bool(), Q = r.bool(), ops = [['p ∧ q', P && Q, 'p and q: both must be true'], ['p ∨ q', P || Q, 'p or q: at least one must be true'], ['p → q', !P || Q, 'if p then q: false only when p is true and q is false'], ['p ↔ q', P === Q, 'p if and only if q: true when both match'], ['~p ∧ q', !P && Q, 'not p, and q']];
    const [e, v, why] = r.pick(ops), T = (b) => (b ? 'true' : 'false');
    return mc(r, v ? 'True' : 'False', [v ? 'False' : 'True'], { q: `p is ${T(P)} and q is ${T(Q)}. Is ${e} true or false?`, steps: [`${e} means ${why}.`, `With p ${T(P)} and q ${T(Q)}, it is ${T(v)}.`] });
  }
  if (t === 1) {
    const n = r.int(2, 5);
    return num(2 ** n, ['Each variable can be true or false, so the number of rows doubles with each one.', `2^${n} = ${2 ** n} rows.`], { q: `A truth table has ${n} variables. How many rows (not counting the header) does it need?`, expr: `2**${n}` });
  }
  if (t === 2) {
    const [s, rights, wrongs] = r.pick(CEX), right = r.pick(rights);
    return mc(r, right, r.shuffle(wrongs).slice(0, 3), { q: `Which value is a counterexample to: "${s}"?`, steps: ['A counterexample makes the hypothesis true but the conclusion false.', `${right} does that, so ${right} is a counterexample.`] });
  }
  const n = r.int(1, 30), ev = n % 2 === 0, m3 = n % 3 === 0, v = !ev || m3;
  return mc(r, v ? 'True' : 'False', [v ? 'False' : 'True'], { q: `Is this conditional true or false? "If ${n} is even, then ${n} is a multiple of 3."`, steps: [`Hypothesis: ${n} is ${ev ? '' : 'not '}even. Conclusion: ${n} is ${m3 ? '' : 'not '}a multiple of 3.`, v ? (ev ? 'Both parts are true, so it is true.' : 'The hypothesis is false, so the conditional is true.') : 'True hypothesis, false conclusion: false.'] });
});

// ───────── 24. Sequences and series ─────────
skill('11-recursive', 11, 'Sequences and series', 'Recursive and explicit formulas', ['An explicit formula finds aₙ straight from n. A recursive formula finds each term from the one before.', 'Arithmetic: aₙ = a₁ + (n − 1)d. Geometric: aₙ = a₁ × r^(n − 1).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const s = r.int(-5, 9), k = r.pick([1, 2, 3, -1]), d = r.int(-5, 5), terms = [s]; for (let i = 1; i < 5; i++) terms.push(k * terms[i - 1] + d);
    const n = r.int(4, 5), sub = n === 4 ? '₄' : '₅', rule = `aₙ = ${k === 1 ? '' : k === -1 ? '−' : k}aₙ₋₁${d ? ' ' + sgn(d) : ''}`;
    return num(terms[n - 1], [`Start with a₁ = ${neg(s)} and apply the rule again and again.`, `The terms are ${terms.slice(0, n).map(neg).join(', ')}, so a${sub} = ${neg(terms[n - 1])}.`], { q: `a₁ = ${neg(s)} and ${rule}. Find a${sub}.` });
  }
  if (t === 1) {
    const kind = r.int(0, 2), n = r.int(3, 12);
    if (kind === 0) { const p = r.nonzero(-6, 9), q = r.int(-9, 9), v = p * n + q; return num(v, [`Put n = ${n}: ${neg(p)}(${n}) ${sgn(q)}.`, `= ${neg(v)}.`], { q: `aₙ = ${poly([p, q], 'n')}. Find term number ${n}.`, expr: `${p}*${n}+(${q})` }); }
    if (kind === 1) { const a = r.int(1, 5), k = r.pick([2, 3, -2]), m = r.int(3, 7), v = a * k ** (m - 1); return num(v, [`Put n = ${m}: ${a} × ${par(k)}^${m - 1}.`, `= ${neg(v)}.`], { q: `aₙ = ${a === 1 ? '' : a}(${neg(k)})^(n − 1). Find term number ${m}.`, expr: `${a}*(${k})**(${m}-1)` }); }
    const q = r.int(-9, 9), v = n * n + q; return num(v, [`Put n = ${n}: ${n}² ${sgn(q)}.`, `= ${neg(v)}.`], { q: `aₙ = ${poly([1, 0, q], 'n')}. Find term number ${n}.`, expr: `${n}**2+(${q})` });
  }
  if (t === 2) {
    const k = r.int(0, 2), a = r.int(1, 6); let seq, why;
    if (k === 0) { const d = r.nonzero(-5, 7); seq = [0, 1, 2, 3].map((i) => a + i * d); why = `Each term adds ${neg(d)}.`; }
    else if (k === 1) { const m = r.pick([2, 3, -2]); seq = [0, 1, 2, 3].map((i) => a * m ** i); why = `Each term is multiplied by ${neg(m)}.`; }
    else { const s = r.int(0, 3); seq = [1, 2, 3, 4].map((i) => (i + s) ** 2); why = 'The differences change and the ratios change.'; }
    const right = ['Arithmetic', 'Geometric', 'Neither'][k];
    return mc(r, right, ['Arithmetic', 'Geometric', 'Neither'], { q: `Is ${seq.map(neg).join(', ')}, … arithmetic, geometric or neither?`, steps: [why, `${right}.`] });
  }
  if (t === 3) {
    const a = r.int(-5, 9), d = r.nonzero(-5, 6), geo = r.bool(0.4), m = r.pick([2, 3, -2]);
    if (geo) { const g = Math.abs(a) || 1, right = `aₙ = ${g}(${neg(m)})^(n − 1)`; return mc(r, right, [`aₙ = ${neg(m)}(${g})^(n − 1)`, `aₙ = ${g}(${neg(m)})^n`, `aₙ = ${g} + (n − 1)(${neg(m)})`], { q: `Which explicit formula fits ${[0, 1, 2].map((i) => neg(g * m ** i)).join(', ')}, …?`, steps: [`a₁ = ${g} and the common ratio is ${neg(m)}.`, `${right}.`] }); }
    const right = `aₙ = ${poly([d, a - d], 'n')}`;
    return mc(r, right, [`aₙ = ${poly([d, a], 'n')}`, `aₙ = ${poly([a || 1, d], 'n')}`, `aₙ = ${poly([-d, a + d], 'n')}`], { q: `Which explicit formula fits ${[0, 1, 2].map((i) => neg(a + i * d)).join(', ')}, …?`, steps: [`a₁ = ${neg(a)} and d = ${neg(d)}, so aₙ = ${neg(a)} + (n − 1)(${neg(d)}).`, `Simplify: ${right}.`] });
  }
  const a = r.int(-5, 9), d = r.nonzero(-5, 6), right = `a₁ = ${neg(a)}, aₙ = aₙ₋₁ ${sgn(d)}`;
  return mc(r, right, [`a₁ = ${neg(a + d)}, aₙ = aₙ₋₁ ${sgn(d)}`, `a₁ = ${neg(a)}, aₙ = aₙ₋₁ ${sgn(-d)}`, `a₁ = ${neg(a)}, aₙ = ${neg(d)}aₙ₋₁`], { q: `Which recursive formula fits ${[0, 1, 2, 3].map((i) => neg(a + i * d)).join(', ')}, …?`, steps: [`The first term is ${neg(a)} and each term adds ${neg(d)}.`, `${right}.`] });
});
const R_INF = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3], [1, 5]];
skill('11-series', 11, 'Sequences and series', 'Series and sums', ['Σ means add up the terms. Arithmetic sum: Sₙ = n(a₁ + aₙ) ÷ 2. Geometric sum: Sₙ = a₁(rⁿ − 1) ÷ (r − 1).', 'An infinite geometric series converges only if −1 < r < 1; then S = a₁ ÷ (1 − r).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.nonzero(-4, 5), b = r.int(-6, 6), n = r.int(4, 10), terms = Array.from({ length: n }, (_, i) => a * (i + 1) + b), S = terms.reduce((x, y) => x + y, 0);
    return num(S, [`Put k = 1, 2, …, ${n}: ${terms.slice(0, 3).map(neg).join(' + ')} + … + ${neg(terms.at(-1))}.`, `This is arithmetic: ${n}(${neg(terms[0])} + ${par(terms.at(-1))}) ÷ 2 = ${neg(S)}.`], { q: `Find Σ (from k = 1 to ${n}) of (${poly([a, b], 'k')}).`, expr: terms.map((x) => `(${x})`).join('+') });
  }
  if (t === 1) {
    if (r.bool()) {
      const a = r.int(-5, 10), d = r.nonzero(-4, 6), n = r.int(5, 20), last = a + (n - 1) * d, S = n * (a + last) / 2;
      return num(S, [`Term number ${n} is ${neg(a)} + ${n - 1} × ${par(d)} = ${neg(last)}.`, `S = ${n}(${neg(a)} + ${par(last)}) ÷ 2 = ${neg(S)}.`], { q: `Find the sum of the first ${n} terms of the arithmetic series ${neg(a)} + ${par(a + d)} + ${par(a + 2 * d)} + …`, expr: Array.from({ length: n }, (_, i) => `(${a + i * d})`).join('+') });
    }
    const a = r.int(1, 5), m = r.pick([2, 3, -2]), n = r.int(4, 7), S = a * (m ** n - 1) / (m - 1);
    return num(S, [`a₁ = ${a}, r = ${neg(m)}, n = ${n}.`, `S = ${a}(${par(m)}^${n} − 1) ÷ (${neg(m)} − 1) = ${neg(S)}.`], { q: `Find the sum of the first ${n} terms of the geometric series ${a} + ${par(a * m)} + ${par(a * m * m)} + …`, expr: Array.from({ length: n }, (_, i) => `${a}*(${m})**${i}`).join('+') });
  }
  if (t === 2) {
    const [a, rr, rs] = r.pick([[8, 1 / 2, '1/2'], [27, 1 / 3, '1/3'], [16, -1 / 2, '−1/2'], [3, 2, '2'], [8, 3 / 2, '3/2'], [1, -2, '−2'], [32, 3 / 4, '3/4']]), conv = Math.abs(rr) < 1;
    return mc(r, conv ? 'Converges' : 'Diverges', [conv ? 'Diverges' : 'Converges'], { q: `Does the infinite geometric series ${[0, 1, 2].map((i) => neg(a * rr ** i)).join(' + ').replace(/\+ −/g, '− ')} + … converge or diverge?`, steps: [`The common ratio is r = ${rs}.`, conv ? '|r| < 1, so it converges.' : '|r| ≥ 1, so it diverges.'] });
  }
  if (t === 3) {
    const [p, q] = r.pick(R_INF), a = r.int(1, 20), ans = frac(a * q, q - p), rs = `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`;
    return num(ans, [`S = a₁ ÷ (1 − r) = ${a} ÷ (1 − ${p < 0 ? `(${rs})` : rs}).`, `= ${a} ÷ ${frac(q - p, q)} = ${ans}.`], { q: `Find the sum of the infinite geometric series with first term ${a} and common ratio ${rs}.`, expr: `${a}/(1-(${p}/${q}))` });
  }
  const two = r.bool(); let n = two ? r.int(1, 98) : r.int(1, 8); while (two && n % 11 === 0) n = r.int(1, 98);
  const digits = two ? String(n).padStart(2, '0') : String(n), den = two ? 99 : 9, ans = frac(n, den);
  return num(ans, [`The repeating block has ${digits.length} digit${digits.length > 1 ? 's' : ''}, so put it over ${den}: ${n}/${den}.`, `Simplify: ${ans}.`], { q: `Write 0.${digits.repeat(3)}… (the ${digits} repeats forever) as a fraction in simplest form.`, exactForm: 'fraction', expr: `${n}/${den}` });
});

// ───────── 25. Probability ─────────
skill('11-prob', 11, 'Probability', 'Probability and counting', ['P(event) = favourable outcomes ÷ total outcomes.', 'Counting principle: multiply the number of choices at each step.', 'Order matters: permutations. Order does not matter: combinations.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const R = r.int(1, 9), B = r.int(1, 9), G = r.int(1, 9), N = R + B + G, [c, n] = r.pick([['red', R], ['blue', B], ['green', G]]), not = r.bool(0.3), f = not ? N - n : n;
    return num(frac(f, N), [`There are ${R} + ${B} + ${G} = ${N} marbles${not ? `, and ${N - n} are not ${c}` : `, and ${n} are ${c}`}.`, `P = ${f}/${N} = ${frac(f, N)}.`], { q: `A bag has ${R} red, ${B} blue and ${G} green marbles. One is picked at random. What is P(${not ? 'not ' : ''}${c})?`, expr: `${f}/${N}` });
  }
  if (t === 1) {
    const a = r.int(2, 6), b = r.int(2, 5), c = r.int(2, 4);
    return num(a * b * c, ['Multiply the number of choices for each part.', `${a} × ${b} × ${c} = ${a * b * c}.`], { q: `A meal has ${a} main dishes, ${b} sides and ${c} drinks to choose from. How many different meals (one of each) are possible?`, expr: `${a}*${b}*${c}` });
  }
  if (t === 2) {
    const n = r.int(5, 10), k = r.int(2, 3), v = fact(n) / fact(n - k);
    return num(v, ['The jobs are different, so order matters: a permutation.', `${n}P${k} = ${Array.from({ length: k }, (_, i) => n - i).join(' × ')} = ${v}.`], { q: `In how many ways can ${k === 2 ? 'a captain and an assistant captain' : 'a president, a vice-president and a treasurer'} be chosen from ${n} people?`, expr: `${fact(n)}/${fact(n - k)}` });
  }
  if (t === 3) {
    const R = r.int(2, 7), B = r.int(2, 7), N = R + B, f = nCr(R, 2), tot = nCr(N, 2);
    return num(frac(f, tot), [`Ways to choose 2 red: ${R}C2 = ${f}. Ways to choose any 2: ${N}C2 = ${tot}.`, `P = ${f}/${tot} = ${frac(f, tot)}.`], { q: `A box has ${R} red and ${B} blue pens. Two are taken at random. What is the probability that both are red?`, expr: `${R}/${N}*${R - 1}/${N - 1}` });
  }
  const s = r.int(2, 12), ways = 6 - Math.abs(7 - s);
  return num(frac(ways, 36), [`There are 36 equally likely rolls; ${ways} of them add to ${s}.`, `P = ${ways}/36 = ${frac(ways, 36)}.`], { q: `Two dice are rolled. What is the probability that the sum is ${s}?`, expr: `${ways}/36` });
});
export const NORMAL = [['between μ − σ and μ + σ', 68], ['between μ − 2σ and μ + 2σ', 95], ['between μ − 3σ and μ + 3σ', 99.7], ['above μ + σ', 16], ['above μ + 2σ', 2.5], ['below μ − σ', 16], ['between μ and μ + σ', 34], ['between μ and μ + 2σ', 47.5], ['between μ − σ and μ + 2σ', 81.5], ['below μ + σ', 84]];
skill('11-condprob', 11, 'Probability', 'Conditional probability and independence', ['P(A | B) = P(A and B) ÷ P(B): the chance of A among the B cases.', 'A and B are independent if P(A and B) = P(A) × P(B).', 'Addition rule: P(A or B) = P(A) + P(B) − P(A and B).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const g = [[r.int(5, 30), r.int(5, 30)], [r.int(5, 30), r.int(5, 30)]], rows = ['Grade 11', 'Grade 12'], cols = ['Hockey', 'Soccer'];
    const rt = g.map((x) => x[0] + x[1]), ct = [g[0][0] + g[1][0], g[0][1] + g[1][1]], N = rt[0] + rt[1], i = r.int(0, 1), j = r.int(0, 1), k = r.int(0, 3);
    const table = { type: 'table', head: ['', ...cols, 'Total'], rows: [[rows[0], ...g[0], rt[0]], [rows[1], ...g[1], rt[1]], ['Total', ...ct, N]] };
    const [nu, den, qq, s1] = [[rt[i], N, `a student is in ${rows[i]}`, `${rows[i]} total: ${rt[i]} of ${N}.`], [g[i][j], N, `a student is in ${rows[i]} and prefers ${cols[j]}`, `${rows[i]} and ${cols[j]}: ${g[i][j]} of ${N}.`], [g[i][j], rt[i], `a student prefers ${cols[j]}, given they are in ${rows[i]}`, `Only look at the ${rows[i]} row: ${g[i][j]} of ${rt[i]}.`], [g[i][j], ct[j], `a student is in ${rows[i]}, given they prefer ${cols[j]}`, `Only look at the ${cols[j]} column: ${g[i][j]} of ${ct[j]}.`]][k];
    return num(frac(nu, den), [s1, `P = ${nu}/${den} = ${frac(nu, den)}.`], { q: `The table shows students' favourite sport. A student is picked at random. What is the probability that ${qq}?`, visual: table, expr: `${nu}/${den}` });
  }
  if (t === 1) {
    const pa = r.int(2, 8) / 10, pb = r.int(2, 8) / 10, ind = r.bool(), pab = ind ? pa * pb : pa * pb + r.pick([0.05, -0.02, 0.1]);
    return yn(r, ind, { q: `P(A) = ${dec(pa)}, P(B) = ${dec(pb)} and P(A and B) = ${dec(pab)}. Are A and B independent?`, steps: [`P(A) × P(B) = ${dec(pa)} × ${dec(pb)} = ${dec(pa * pb)}.`, ind ? 'That equals P(A and B), so yes, they are independent.' : `That is not ${dec(pab)}, so no, they are not independent.`] });
  }
  if (t === 2) {
    if (r.bool()) {
      const [ev, n] = r.pick([['an even number', 3], ['a number greater than 4', 2], ['a 6', 1], ['a prime number', 3]]), heads = r.bool();
      return num(frac(n, 12), [`The coin and die are independent: P(${heads ? 'heads' : 'tails'}) = 1/2 and P(${ev}) = ${frac(n, 6)}.`, `Multiply: 1/2 × ${frac(n, 6)} = ${frac(n, 12)}.`], { q: `A coin is flipped and a die is rolled. What is the probability of ${heads ? 'heads' : 'tails'} and ${ev}?`, expr: `1/2*${n}/6` });
    }
    const R = r.int(2, 8), B = r.int(2, 8), N = R + B;
    return num(frac(R * (R - 1), N * (N - 1)), [`First red: ${R}/${N}. Then one red is gone: ${R - 1}/${N - 1}.`, `${R}/${N} × ${R - 1}/${N - 1} = ${frac(R * (R - 1), N * (N - 1))}.`], { q: `A bag has ${R} red and ${B} blue counters. Two are drawn without putting the first back. What is the probability both are red?`, expr: `${R}/${N}*${R - 1}/${N - 1}` });
  }
  if (t === 3) {
    const pa = r.int(2, 6) / 10, pb = r.int(2, 6) / 10, pab = r.int(1, Math.round(Math.min(pa, pb) * 10) - 1) / 10, v = pa + pb - pab;
    return num(dec(v), ['P(A or B) = P(A) + P(B) − P(A and B).', `${dec(pa)} + ${dec(pb)} − ${dec(pab)} = ${dec(v)}.`], { q: `P(A) = ${dec(pa)}, P(B) = ${dec(pb)} and P(A and B) = ${dec(pab)}. Find P(A or B).`, expr: `${pa}+${pb}-${pab}` });
  }
  const [mu, sd, what, unit] = r.pick([[170, 8, 'heights of adults', 'cm'], [500, 100, 'test scores', 'points'], [75, 5, 'masses of apples', 'g'], [30, 4, 'commute times', 'minutes']]), [reg, pct] = r.pick(NORMAL);
  const val = (s) => s.replace(/μ ([+−]) (\d?)σ/g, (m, op, k) => String(op === '+' ? mu + (Number(k) || 1) * sd : mu - (Number(k) || 1) * sd)).replace(/μ/g, String(mu));
  return num(pct, [`μ = ${mu} and σ = ${sd}, so ${val(reg)} ${unit} means ${reg}.`, `By the 68–95–99.7 rule, that is ${pct}%.`], { q: `The ${what} are normally distributed with mean ${mu} ${unit} and standard deviation ${sd} ${unit}. About what percent are ${val(reg)} ${unit}? Use the 68–95–99.7 rule.` });
});

export default list;
