// Grade 12 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
import { TRIPLES, SPECIAL, CONDS, NEGS, BICOND, CEX, NORMAL } from './g11.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const SUP = { 2: '²', 3: '³' };
const pw = (v, e) => (e === 1 ? v : SUP[e] ? v + SUP[e] : `${v}^${e}`);
const poly = (cs, v = 'x') => { const d = cs.length - 1; let s = ''; cs.forEach((c, i) => { const e = d - i; if (!c) return; const a = Math.abs(c); const body = e === 0 ? String(a) : (a === 1 ? '' : a) + pw(v, e); s += s ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; }); return s || '0'; };
const fx = (p) => (p === 0 ? 'x' : `(x ${sgn(-p)})`);
const fm = (s) => String(s).replace(/^-/, '−');
const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
const radS = (k, m) => (m === 1 ? String(k) : k === 1 ? `√${m}` : `${k}√${m}`);
const yn = (r, ok, extra) => mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], extra);
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const nCr = (n, k) => fact(n) / (fact(k) * fact(n - k));
const RAD = Math.PI / 180;
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const LG = (b) => `log${String(b).split('').map((d) => SUB[d]).join('')}`;
const coef = (a) => (a === 1 ? '' : a === -1 ? '−' : neg(a));
const cx = (a, b) => { if (b === 0) return neg(a); const bi = `${Math.abs(b) === 1 ? '' : Math.abs(b)}i`; if (a === 0) return `${b < 0 ? '−' : ''}${bi}`; return `${neg(a)} ${b < 0 ? '−' : '+'} ${bi}`; };
const vec = (...c) => `⟨${c.map((x) => fm(x)).join(', ')}⟩`;
const mat = (M) => `[${M.map((row) => row.map(neg).join('  ')).join(' ; ')}]`;
const piS = (n, d) => { const [a, b] = simplify(n, d); if (a === 0) return '0'; return `${a < 0 ? '−' : ''}${Math.abs(a) === 1 ? '' : Math.abs(a)}π${b === 1 ? '' : '/' + b}`; };

// ───────── 1. Functions ─────────
skill('12-funcops', 12, 'Functions', 'Operations on functions and composition', ['(f + g)(x) = f(x) + g(x), and the same for −, × and ÷.', 'f(g(x)) means: work out g(x) first, then put that into f.'], (r) => {
  const t = r.int(0, 3), a = r.nonzero(-5, 5), b = r.int(-6, 6), c = r.int(-6, 6);
  const f = poly([a, b]), g = poly([1, 0, c]);
  if (t === 0) {
    let x0 = r.int(-4, 4), op = r.int(0, 3); if (op === 3) while (x0 * x0 + c === 0) x0 = r.int(-4, 4);
    const fv = a * x0 + b, gv = x0 * x0 + c, ans = [String(fv + gv), String(fv - gv), String(fv * gv), frac(fv, gv)][op], name = ['(f + g)', '(f − g)', '(fg)', '(f/g)'][op], sym = ['+', '−', '×', '÷'][op];
    return num(ans, [`f(${neg(x0)}) = ${neg(fv)} and g(${neg(x0)}) = ${neg(gv)}.`, `${neg(fv)} ${sym} ${par(gv)} = ${fm(ans)}.`], { q: `f(x) = ${f} and g(x) = ${g}. Find ${name}(${neg(x0)}).`, expr: `(${fv})${['+', '-', '*', '/'][op]}(${gv})` });
  }
  if (t === 1) {
    const x0 = r.int(-3, 3), fg = r.bool(), inner = fg ? x0 * x0 + c : a * x0 + b, v = fg ? a * inner + b : inner * inner + c;
    return num(v, [`First the inside: ${fg ? 'g' : 'f'}(${neg(x0)}) = ${neg(inner)}.`, `Then ${fg ? 'f' : 'g'}(${neg(inner)}) = ${neg(v)}.`], { q: `f(x) = ${f} and g(x) = ${g}. Find ${fg ? 'f(g' : 'g(f'}(${neg(x0)})).`, expr: fg ? `${a}*((${x0})**2+(${c}))+(${b})` : `((${a})*(${x0})+(${b}))**2+(${c})` });
  }
  if (t === 2) {
    const p = r.nonzero(-4, 4), q = r.int(-6, 6), right = poly([a * p, a * q + b]);
    return mc(r, right, [poly([a * p, p * b + q]), poly([a + p, b + q]), poly([a * p, b * q === a * q + b ? b * q + 1 : b * q])], { q: `f(x) = ${f} and g(x) = ${poly([p, q])}. Which is f(g(x))?`, steps: [`Replace x in f with g(x): ${neg(a)}(${poly([p, q])}) ${sgn(b)}.`, `= ${right}.`] });
  }
  const m = r.nonzero(-5, 5), k = r.int(-8, 8), xs = [0, 1, 2, 3];
  return num(m, ['A linear function changes by the same amount for each step of 1 in x: that amount is the slope.', `${neg(m + k)} − ${par(k)} = ${neg(m)}, so the slope is ${neg(m)}.`], { q: 'The table shows a linear function. What is its slope?', visual: { type: 'table', head: ['x', 'f(x)'], rows: xs.map((x) => [x, neg(m * x + k)]) }, expr: `${m * 2 + k}-(${m + k})` });
});
skill('12-inverse', 12, 'Functions', 'Inverse functions and continuity', ['An inverse function undoes the original: if f(a) = b then f⁻¹(b) = a.', 'To find f⁻¹, swap x and y, then solve for y.', 'f and g are inverses if f(g(x)) = x.'], (r) => {
  const t = r.int(0, 4), a = r.pick([2, 3, 4, 5, -2, -3]), b = r.nonzero(-9, 9), f = `f(x) = ${poly([a, b])}`;
  const inv = (p, q) => (p === 1 ? poly([1, -q]) : `(${poly([1, -q])})/${neg(p)}`);
  if (t === 0) {
    const right = `f⁻¹(x) = ${inv(a, b)}`;
    return mc(r, right, [`f⁻¹(x) = ${inv(a, -b)}`, `f⁻¹(x) = ${poly([a, -b])}`, `f⁻¹(x) = 1/(${poly([a, b])})`], { q: `${f}. Which is the inverse function?`, steps: [`Swap x and y: x = ${poly([a, 0], 'y')} ${sgn(b)}.`, `Solve for y: ${right.replace('f⁻¹(x)', 'y')}, so ${right}.`] });
  }
  if (t === 1) {
    const xs = r.shuffle([-2, -1, 0, 1, 2, 3, 4]).slice(0, 4).sort((p, q) => p - q), k = r.pick(xs), v = a * k + b;
    return num(k, [`f⁻¹(${neg(v)}) asks: which x gives f(x) = ${neg(v)}?`, `In the table, f(${neg(k)}) = ${neg(v)}, so f⁻¹(${neg(v)}) = ${neg(k)}.`], { q: `Use the table of f. What is f⁻¹(${neg(v)})?`, visual: { type: 'table', head: ['x', ...xs.map(neg)], rows: [['f(x)', ...xs.map((x) => neg(a * x + b))]] }, expr: `(${v}-(${b}))/(${a})` });
  }
  if (t === 2) {
    const k = r.int(-6, 6), v = a * k + b;
    return num(k, [`Solve f(x) = ${neg(v)}: ${poly([a, b])} = ${neg(v)}.`, `x = (${neg(v)} ${sgn(-b)}) ÷ ${par(a)} = ${neg(k)}, so f⁻¹(${neg(v)}) = ${neg(k)}.`], { q: `${f}. Find f⁻¹(${neg(v)}).`, expr: `(${v}-(${b}))/(${a})` });
  }
  if (t === 3) {
    const ok = r.bool(), g = ok ? inv(a, b) : r.bool() ? inv(a, -b) : poly([a, -b]);
    return yn(r, ok, { q: `${f} and g(x) = ${g}. Are f and g inverse functions?`, steps: [`Check f(g(x)): replace x in f with g(x).`, ok ? `${neg(a)} × ${g} ${sgn(b)} = x, so yes.` : `The result is not just x, so no.`] });
  }
  const p = r.nonzero(-5, 5), k = r.nonzero(-6, 6), right = `y = ${k}/${fx(p)}`.replace(`y = ${k}`, `y = ${neg(k)}`);
  return mc(r, right, [`y = ${poly([1, 0, p])}`, `y = |${poly([1, -p])}|`, `y = ${poly([k, -p])}`], { q: `Which function is not continuous at x = ${neg(p)}?`, steps: [`A function breaks where it is not defined, such as where we would divide by 0.`, `In ${right}, x = ${neg(p)} makes the denominator 0, so it has a break there.`] });
});

// ───────── 2. Families of functions ─────────
skill('12-transform', 12, 'Families of functions', 'Transformations of functions', ['y = f(x − h) + k shifts the graph h units right and k units up.', 'y = −f(x) reflects in the x-axis; y = f(−x) reflects in the y-axis.', 'y = af(x) stretches vertically by a; y = f(bx) compresses horizontally by a factor of 1/b.'], (r) => {
  const t = r.int(0, 4), h = r.nonzero(-6, 6), k = r.nonzero(-6, 6);
  const H = (x) => `${Math.abs(x)} unit${Math.abs(x) === 1 ? '' : 's'} ${x > 0 ? 'right' : 'left'}`, V = (y) => `${Math.abs(y)} unit${Math.abs(y) === 1 ? '' : 's'} ${y > 0 ? 'up' : 'down'}`;
  if (t === 0) {
    const right = `${H(h)} and ${V(k)}`;
    return mc(r, right, [`${H(-h)} and ${V(k)}`, `${H(h)} and ${V(-k)}`, `${H(-h)} and ${V(-k)}`], { q: `How is the graph of y = f(${poly([1, -h])}) ${sgn(k)} related to the graph of y = f(x)?`, steps: [`f(x − h) with h = ${neg(h)} moves the graph ${H(h)}.`, `${sgn(k)} at the end moves it ${V(k)}: ${right}.`] });
  }
  if (t === 1) {
    const p = r.nonzero(-6, 6), q = r.nonzero(-6, 6), xr = r.bool(), right = xr ? pt(p, -q) : pt(-p, q);
    return mc(r, right, [xr ? pt(-p, q) : pt(p, -q), pt(-p, -q), pt(q, p)], { q: `The point ${pt(p, q)} is on the graph of y = f(x). Which point must be on the graph of y = ${xr ? '−f(x)' : 'f(−x)'}?`, steps: [xr ? 'y = −f(x) reflects in the x-axis: the y-coordinate changes sign.' : 'y = f(−x) reflects in the y-axis: the x-coordinate changes sign.', `${pt(p, q)} becomes ${right}.`] });
  }
  if (t === 2) {
    const n = r.pick([2, 3, 4]), vert = r.bool(), half = r.bool(0.3);
    const vs = half ? 'Vertical compression by a factor of 1/2' : `Vertical stretch by a factor of ${n}`, hs = half ? 'Horizontal stretch by a factor of 2' : `Horizontal compression by a factor of 1/${n}`;
    const eq = vert ? (half ? 'y = (1/2)f(x)' : `y = ${n}f(x)`) : (half ? 'y = f(x/2)' : `y = f(${n}x)`), right = vert ? vs : hs;
    const wrongs = half ? ['Vertical compression by a factor of 1/2', 'Horizontal stretch by a factor of 2', 'Vertical stretch by a factor of 2', 'Horizontal compression by a factor of 1/2'] : [vs, hs, `Vertical compression by a factor of 1/${n}`, `Horizontal stretch by a factor of ${n}`];
    return mc(r, right, wrongs.filter((w) => w !== right), { q: `How is the graph of ${eq} related to the graph of y = f(x)?`, steps: [vert ? 'A number multiplying f(x) changes y-values: a vertical stretch or compression.' : 'A number multiplying x inside f changes x-values by its reciprocal: a horizontal stretch or compression.', `${right}.`] });
  }
  if (t === 3) {
    const a = r.pick([2, 3, -1, -2]), p = r.int(-4, 4), q = r.int(-4, 4), askY = r.bool(), nx = p + h, ny = a * q + k;
    return num(askY ? ny : nx, [`x-coordinate: ${neg(p)} + ${par(h)} = ${neg(nx)}.`, `y-coordinate: ${neg(a)} × ${par(q)} + ${par(k)} = ${neg(ny)}.`], { q: `The point ${pt(p, q)} is on y = f(x). It moves to a point on y = ${coef(a)}f(${poly([1, -h])}) ${sgn(k)}. What is the new ${askY ? 'y' : 'x'}-coordinate?`, expr: askY ? `${a}*(${q})+(${k})` : `${p}+(${h})` });
  }
  const right = `g(x) = f(${poly([1, -h])}) ${sgn(k)}`;
  return mc(r, right, [`g(x) = f(${poly([1, h])}) ${sgn(k)}`, `g(x) = f(${poly([1, -h])}) ${sgn(-k)}`, `g(x) = f(${poly([1, k])}) ${sgn(h)}`], { q: `The graph of g is the graph of f moved ${H(h)} and ${V(k)}. Which is g?`, steps: [`Moving ${H(h)} means replacing x with ${poly([1, -h])}.`, `Moving ${V(k)} means adding ${neg(k)}: ${right}.`] });
});

// ───────── 3. Quadratic relations ─────────
skill('12-quadmax', 12, 'Quadratic relations', 'Maximum and minimum of quadratics', ['The vertex of y = ax² + bx + c is at x = −b ÷ 2a.', 'If a < 0 the vertex is a maximum; if a > 0 it is a minimum.'], (r) => {
  const t = r.int(0, 4), a = r.nonzero(-3, 3), h = r.int(-5, 5), k = r.int(-9, 9), b = -2 * a * h, c = a * h * h + k, f = poly([a, b, c]);
  if (t === 0) return num(k, [`x = −b ÷ 2a = ${neg(-b)} ÷ ${par(2 * a)} = ${neg(h)}.`, `f(${neg(h)}) = ${neg(k)}, the ${a > 0 ? 'minimum' : 'maximum'} value.`], { q: `What is the ${a > 0 ? 'minimum' : 'maximum'} value of f(x) = ${f}?`, expr: `(${a})*(${-b}/(2*${a}))**2+(${b})*(${-b}/(2*${a}))+(${c})` });
  if (t === 1) {
    const t0 = r.int(1, 4), B = 10 * t0, C = r.int(0, 30), mx = 5 * t0 * t0 + C;
    return num(mx, [`The highest point is at t = −b ÷ 2a = ${B} ÷ 10 = ${t0} s.`, `h(${t0}) = −5(${t0})² + ${B}(${t0}) + ${C} = ${mx} m.`], { q: `A ball's height in metres after t seconds is h(t) = −5t² + ${B}t${C ? ' + ' + C : ''}. What is its greatest height, in metres?`, expr: `-5*${t0}**2+${B}*${t0}+${C}` });
  }
  if (t === 2) {
    const s = r.int(3, 30), P = 4 * s;
    return num(s * s, [`For a rectangle with perimeter ${P} m, area = x(${P / 2} − x), a parabola opening down with its vertex at x = ${s}.`, `The best is a ${s} m by ${s} m square: area = ${s * s} m².`], { q: `A farmer has ${P} m of fencing for a rectangular pen. What is the greatest area she can enclose, in m²?`, expr: `(${P}/4)**2` });
  }
  if (t === 3) {
    const right = pt(h, k);
    return mc(r, right, [pt(-h, k), pt(h, c === k ? k + 1 : c), pt(k, h)], { q: `What is the vertex of y = ${f}?`, steps: [`x = −b ÷ 2a = ${neg(h)}.`, `y = ${neg(k)}, so the vertex is ${right}.`] });
  }
  const d = r.nonzero(-3, 3), x1 = h + d, y1 = k + a * d * d;
  return num(b, [`Put the point in y = a(x − h)² + k to get a = ${neg(a)}: y = ${coef(a)}${fx(h)}² ${sgn(k)}.`, `Expand: y = ${f}, so b = ${neg(b)}.`], { q: `A parabola has vertex ${pt(h, k)} and passes through ${pt(x1, y1)}. In standard form y = ax² + bx + c, what is b?`, expr: `-2*((${y1})-(${k}))/((${x1})-(${h}))**2*(${h})` });
});
skill('12-quadsolve', 12, 'Quadratic relations', 'Solve quadratics: all methods', ['Try factoring first. If that fails, complete the square or use x = (−b ± √(b² − 4ac)) ÷ 2a.', 'The discriminant b² − 4ac tells how many real roots there are.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.pick([2, 3, -2]), p = r.int(-6, 6); let q = r.int(-6, 6); while (q === p) q = r.int(-6, 6);
    return txt(`x = ${neg(p)} or x = ${neg(q)}`, [`Take out ${neg(a)}: ${neg(a)}(${poly([1, -(p + q), p * q])}) = 0.`, `${neg(a)}${fx(p)}${fx(q)} = 0.`, `x = ${neg(p)} or x = ${neg(q)}.`], { q: `Solve ${poly([a, -a * (p + q), a * p * q])} = 0. Give both solutions.`, numbers: [p, q] });
  }
  if (t === 1 || t === 2) {
    const h = r.nonzero(-6, 6); const D = r.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19]);
    const sol = (c, m) => `x = ${neg(c)} ± ${m}`, right = sol(h, `√${D}`);
    if (t === 1) return mc(r, right, [sol(-h, `√${D}`), sol(h, D), sol(h, `√${2 * D}`)], { q: `Solve (${poly([1, -h])})² = ${D}.`, steps: [`Take the square root: ${poly([1, -h])} = ±√${D}.`, `${right}.`] });
    const c = h * h - D;
    return mc(r, right, [sol(-h, `√${D}`), sol(h, D), sol(h, `√${D + 2}`)], { q: `Solve ${poly([1, -2 * h, c])} = 0 by completing the square.`, steps: [`Move the constant: ${poly([1, -2 * h, 0])} = ${neg(-c)}. Add (${neg(-h)})² = ${h * h} to both sides.`, `(${poly([1, -h])})² = ${D}, so ${right}.`] });
  }
  if (t === 3) {
    let a, b, c, D; do { a = r.int(1, 4); b = r.int(-9, 9); c = r.int(-9, 9); D = b * b - 4 * a * c; } while (D <= 0 || Number.isInteger(Math.sqrt(D)));
    const x = (-b - Math.sqrt(D)) / (2 * a), ans = dec(x, 2);
    return num(ans, [`b² − 4ac = ${b * b} − ${par(4 * a * c)} = ${D}.`, `The smaller root uses −: x = (${neg(-b)} − √${D}) ÷ ${2 * a} ≈ ${fm(ans)}.`], { q: `Solve ${poly([a, b, c])} = 0 with the quadratic formula. Give the smaller root, rounded to 2 decimal places.`, tol: 0.006, expr: `(-(${b})-Math.sqrt(${D}))/(2*${a})` });
  }
  const a = r.nonzero(-4, 4), b = r.int(-9, 9), c = r.int(-9, 9), D = b * b - 4 * a * c;
  return num(D, ['The discriminant is b² − 4ac.', `${par(b)}² − 4(${neg(a)})(${neg(c)}) = ${b * b} − ${par(4 * a * c)} = ${neg(D)}.`], { q: `Find the discriminant of ${poly([a, b, c])} = 0.`, expr: `(${b})**2-4*(${a})*(${c})` });
});

// ───────── 4. Polynomials ─────────
skill('12-polydiv', 12, 'Polynomials', 'Polynomial division, roots and factors', ['Synthetic division by (x − p): bring down, multiply by p, add, repeat. The last number is the remainder.', 'Remainder theorem: the remainder is f(p). If it is 0, (x − p) is a factor.'], (r) => {
  const t = r.int(0, 4);
  if (t < 2) {
    const p = r.nonzero(-4, 4), q = r.int(-5, 5), s = r.int(-6, 6), R = r.int(-9, 9), cs = [1, q - p, s - p * q, -p * s + R];
    if (t === 0) return num(R, [`Use ${neg(p)} with the coefficients ${cs.map(neg).join(', ')}.`, `Bring down, multiply by ${neg(p)}, add: the bottom row is 1, ${neg(q)}, ${neg(s)}, ${neg(R)}.`, `The remainder is the last number: ${neg(R)}.`], { q: `Use synthetic division to divide ${poly(cs)} by ${fx(p)}. What is the remainder?`, expr: `(${p})**3+(${cs[1]})*(${p})**2+(${cs[2]})*(${p})+(${cs[3]})` });
    const right = poly([1, q, s]);
    return mc(r, right, [poly([1, -q, s]), poly([1, q, s === 0 ? 1 : -s]), poly([1, q + p, s])], { q: `Divide ${poly(cs)} by ${fx(p)}. What is the quotient? (The remainder is ${neg(R)}.)`, steps: [`Synthetic division with ${neg(p)} gives the bottom row 1, ${neg(q)}, ${neg(s)}, ${neg(R)}.`, `The quotient is ${right}.`] });
  }
  const [p, q, s] = r.shuffle([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 3), c2 = -(p + q + s), c1 = p * q + q * s + p * s, c0 = -p * q * s;
  if (t === 2) {
    const k = r.pick([1, 2, 3, -1]);
    return txt(`x = ${neg(p)}, ${neg(q)}, ${neg(s)}`, ['A product is 0 when one of its factors is 0.', `Set each bracket to 0: x = ${neg(p)}, ${neg(q)}, ${neg(s)}.`], { q: `Find all the zeros of f(x) = ${coef(k)}${fx(p)}${fx(q)}${fx(s)}.`, numbers: [p, q, s] });
  }
  if (t === 3) {
    const right = poly([1, c2, c1, c0]);
    return mc(r, right, [poly([1, -c2, c1, -c0]), poly([1, c2, -c1 || 1, c0]), poly([1, c2 + 1, c1, c0])], { q: `Which polynomial has zeros ${neg(p)}, ${neg(q)} and ${neg(s)} (and leading coefficient 1)?`, steps: [`Each zero gives a factor: ${fx(p)}${fx(q)}${fx(s)}.`, `Multiply out: ${right}.`] });
  }
  const isF = r.bool(), tv = isF ? r.pick([p, q, s]) : r.pick([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((v) => v !== p && v !== q && v !== s)), fv = (tv - p) * (tv - q) * (tv - s);
  return yn(r, isF, { q: `Is ${fx(tv)} a factor of f(x) = ${poly([1, c2, c1, c0])}?`, steps: [`By the factor theorem, check f(${neg(tv)}).`, `f(${neg(tv)}) = ${neg(fv)}, ${fv === 0 ? 'so yes, it is a factor' : 'not 0, so no'}.`] });
});
skill('12-polythm', 12, 'Polynomials', 'Theorems about polynomial roots', ['Rational root theorem: any rational zero is ± (factor of the constant) ÷ (factor of the leading coefficient).', 'Real polynomials have complex zeros in conjugate pairs: if a + bi is a zero, so is a − bi.', 'A polynomial of degree n has exactly n complex zeros, counting repeats.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.pick([1, 2, 3]), c = r.pick([6, -6, 10, -10, 15, -15, 4, -4, 9, -9]), divs = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
    const S = new Set(); divs(Math.abs(c)).forEach((p) => divs(a).forEach((q) => { S.add(p / q); S.add(-p / q); }));
    const cand = [...S], pick = r.pick(cand), toF = (v) => { for (let q = 1; q <= 6; q++) if (Number.isInteger(Math.round(v * q * 1e6) / 1e6)) return frac(Math.round(v * q), q); return dec(v); };
    const pool = [4, 5, 7, 8, 9, 1 / 4, 2 / 5, 3 / 4, 5 / 2, 7 / 2, 1 / 5, 7 / 3].filter((v) => !cand.some((x) => Math.abs(x - v) < 1e-9));
    const right = fm(toF(pick));
    return mc(r, right, r.shuffle(pool).slice(0, 3).map((v) => toF(v)), { q: `f(x) = ${poly([a, r.int(-5, 5), r.int(-5, 5), c])}. By the rational root theorem, which number could be a zero of f?`, steps: [`Possible rational zeros are ± (factors of ${Math.abs(c)}) ÷ (factors of ${a}).`, `${right} is on that list; the others are not.`] });
  }
  if (t === 1) {
    const a = r.int(-6, 6), b = r.nonzero(-6, 6);
    if (r.bool()) { const right = cx(a, -b); return mc(r, right, [cx(-a, b), cx(-a, -b), cx(b, a)], { q: `A polynomial with real coefficients has the zero ${cx(a, b)}. Which other number must be a zero?`, steps: ['Complex zeros of a real polynomial come in conjugate pairs.', `The conjugate of ${cx(a, b)} is ${right}.`] }); }
    const m = r.pick([2, 3, 5, 6, 7]), bb = Math.abs(b), right = `${neg(a)} − ${radS(bb, m)}`;
    return mc(r, right, [`${neg(-a)} + ${radS(bb, m)}`, `${neg(-a)} − ${radS(bb, m)}`, `${neg(a)} + ${radS(bb, m)}i`], { q: `A polynomial with rational coefficients has the zero ${neg(a)} + ${radS(bb, m)}. Which other number must be a zero?`, steps: ['Irrational zeros a + √m of a rational polynomial come in pairs with a − √m.', `So ${right} is also a zero.`] });
  }
  if (t === 2) {
    const n = r.int(2, 7), cs = [r.nonzero(-5, 5), ...Array.from({ length: n }, () => r.int(-6, 6))];
    return num(n, [`The degree (highest power) is ${n}.`, `By the Fundamental Theorem of Algebra it has exactly ${n} complex zeros, counting repeats.`], { q: `How many complex zeros, counting repeated ones, does f(x) = ${poly(cs)} have?`, expr: `${n}` });
  }
  if (t === 3) {
    const n = r.int(3, 5), cs = [r.int(1, 5), ...Array.from({ length: n }, () => (r.bool(0.2) ? 0 : r.nonzero(-6, 6)))];
    const sg = cs.filter((x) => x).map((x) => (x > 0 ? '+' : '−')); let V = 0; for (let i = 1; i < sg.length; i++) if (sg[i] !== sg[i - 1]) V++;
    return num(V, [`The signs of the coefficients, in order: ${sg.join(' ')}.`, `The sign changes ${V} time${V === 1 ? '' : 's'}, so there are at most ${V} positive real zeros.`], { q: `By Descartes' rule of signs, what is the greatest possible number of positive real zeros of f(x) = ${poly(cs)}?` });
  }
  const kind = r.int(0, 2), n = 5, cs = Array.from({ length: n + 1 }, (_, i) => { const e = n - i, keep = kind === 0 ? e % 2 === 0 : kind === 1 ? e % 2 === 1 : true; return keep && r.bool(0.7) ? r.nonzero(-6, 6) : 0; });
  if (kind === 0 && !cs[1] && !cs[3]) cs[3] = 2; if (kind === 1 && !cs[0] && !cs[2]) cs[2] = 3; if (kind === 2) { cs[2] = cs[2] || 1; cs[3] = cs[3] || 1; }
  const right = ['Even', 'Odd', 'Neither'][kind];
  return mc(r, right, ['Even', 'Odd', 'Neither'], { q: `Is f(x) = ${poly(cs)} even, odd or neither?`, steps: [['Every power of x is even (a constant counts as x⁰), so f(−x) = f(x).', 'Every power of x is odd, so f(−x) = −f(x).', 'It mixes even and odd powers.'][kind], `${right}.`] });
});
skill('12-binomial', 12, 'Polynomials', "Pascal's triangle, the Binomial Theorem and special patterns", ["Row n of Pascal's triangle gives the coefficients of (a + b)ⁿ; each entry is nCk.", 'The term with xᵏ in (x + a)ⁿ is nCk × a^(n − k) × xᵏ.', 'x⁴ + bx² + c is a quadratic in x²: factor it like one.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const n = r.int(3, 8), k = r.int(1, n - 1), row = Array.from({ length: n + 1 }, (_, i) => nCr(n, i));
    return num(row[k], [`Row ${n} is ${row.join(', ')}.`, `Entry number ${k + 1} is ${n}C${k} = ${row[k]}.`], { q: `In Pascal's triangle (the top 1 is row 0), what is entry number ${k + 1} of row ${n}?`, expr: `${fact(n)}/(${fact(k)}*${fact(n - k)})` });
  }
  if (t === 1 || t === 2) {
    const n = r.int(3, 6), k = r.int(1, n - 1), a = t === 1 ? 1 : r.pick([2, 3]), b = r.nonzero(-3, 3), v = nCr(n, k) * a ** k * b ** (n - k);
    return num(v, [`The x^${k} term uses ${n}C${k} × (${a === 1 ? 'x' : a + 'x'})^${k} × (${neg(b)})^${n - k}.`, `${nCr(n, k)} × ${a ** k} × ${par(b ** (n - k))} = ${neg(v)}.`], { q: `In the expansion of (${poly([a, b])})^${n}, what is the coefficient of ${pw('x', k)}?`, expr: `${nCr(n, k)}*${a}**${k}*(${b})**${n - k}` });
  }
  if (t === 3) {
    const p = r.pick([1, 1, 2, 3]), c = r.int(1, 5), plus = r.bool(), ans = frac(plus ? -c : c, p);
    return num(ans, [`${plus ? 'Subtract' : 'Add'} ${c ** 3}: ${p === 1 ? 'x³' : `${p ** 3}x³`} = ${plus ? '−' : ''}${c ** 3}.`, `Take the cube root: ${p === 1 ? 'x' : `${p}x`} = ${plus ? '−' : ''}${c}, so x = ${fm(ans)}.`], { q: `Find the real solution of ${poly([p ** 3, 0, 0, plus ? c ** 3 : -(c ** 3)])} = 0.`, expr: `${plus ? -c : c}/${p}` });
  }
  const p = r.int(1, 4); let q = r.int(1, 5); while (q === p) q = r.int(1, 5);
  return txt(`x = -${p}, ${p}, -${q}, ${q}`, [`Let u = x²: ${poly([1, -(p * p + q * q), p * p * q * q], 'u')} = 0, so (u − ${p * p})(u − ${q * q}) = 0.`, `x² = ${p * p} or x² = ${q * q}, so x = ${p}, −${p}, ${q}, −${q}.`], { q: `Solve x⁴ − ${p * p + q * q}x² + ${p * p * q * q} = 0. Give all four solutions.`, numbers: [p, -p, q, -q] });
});

// ───────── 5. Rational functions ─────────
skill('12-ratfunc', 12, 'Rational functions', 'Rational functions and equations', ['A vertical asymptote is where the denominator is 0 (after cancelling); a cancelled factor leaves a hole.', 'For (ax + b)/(cx + d), the horizontal asymptote is y = a/c.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    let a, b, c, d; do { a = r.nonzero(-5, 5); b = r.int(-6, 6); c = r.int(1, 3); d = r.int(-6, 6); } while (a * d - b * c === 0);
    const vert = r.bool(), ans = vert ? frac(-d, c) : frac(a, c);
    return num(ans, [vert ? `The denominator ${poly([c, d])} = 0 when x = ${fm(frac(-d, c))}.` : 'For large x only the x terms matter: y → a ÷ c.', vert ? `The vertical asymptote is x = ${fm(ans)}.` : `${neg(a)} ÷ ${c} = ${fm(ans)}, so the horizontal asymptote is y = ${fm(ans)}.`], { q: `For f(x) = (${poly([a, b])}) ÷ (${poly([c, d])}), what is the ${vert ? 'vertical asymptote, x = ?' : 'horizontal asymptote, y = ?'}`, expr: vert ? `${-d}/${c}` : `${a}/${c}` });
  }
  if (t === 1) {
    const [p, q, s] = r.shuffle([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3), hole = r.bool();
    return num(hole ? p : s, [`Factor: ${fx(p)}${fx(q)} ÷ (${fx(p)}${fx(s)}).`, hole ? `${fx(p)} cancels, so there is a hole at x = ${neg(p)}.` : `After cancelling ${fx(p)}, the denominator is ${fx(s)}: the vertical asymptote is x = ${neg(s)}.`], { q: `f(x) = (${poly([1, -(p + q), p * q])}) ÷ (${poly([1, -(p + s), p * s])}). ${hole ? 'There is a hole in the graph at x = ?' : 'What is the vertical asymptote, x = ?'}` });
  }
  if (t === 2) {
    const a = r.nonzero(-6, 6), h = r.nonzero(-6, 6); let k = r.int(-6, 6); if (k === h) k = h + 1;
    const askD = r.bool(), f = `y = ${neg(a)}/${fx(h)}${k ? ' ' + sgn(k) : ''}`, right = askD ? `all real numbers except x = ${neg(h)}` : `all real numbers except y = ${neg(k)}`;
    return mc(r, right, [askD ? `all real numbers except x = ${neg(-h)}` : `all real numbers except y = ${neg(h)}`, askD ? `all real numbers except x = ${neg(k)}` : `all real numbers except y = ${neg(k === 0 ? 1 : -k)}`, 'all real numbers'], { q: `What is the ${askD ? 'domain' : 'range'} of ${f}?`, steps: [askD ? `x = ${neg(h)} makes the denominator 0.` : `${neg(a)}/${fx(h)} is never 0, so y never equals ${neg(k)}.`, `${right}.`] });
  }
  if (t === 3) {
    const k = r.pick([2, 3, 4]), b = r.int(-5, 5); let x0 = r.int(-6, 8); while (x0 === b) x0 = r.int(-6, 8); const a = k * (x0 - b) - x0;
    return num(x0, [`Multiply both sides by (${poly([1, -b])}): ${poly([1, a])} = ${k}(${poly([1, -b])}).`, `${poly([1, a])} = ${poly([k, -k * b])}, so ${a + k * b} = ${k - 1}x and x = ${neg(x0)}.`], { q: `Solve (${poly([1, a])}) ÷ (${poly([1, -b])}) = ${k}.`, expr: `(${a}+${k}*(${b}))/(${k}-1)` });
  }
  const a = r.nonzero(-6, 6), h = r.nonzero(-5, 5); let k = r.nonzero(-5, 5); while (k === h) k = r.nonzero(-5, 5);
  const ok = r.bool(), g = ok ? `${neg(a)}/${fx(k)} ${sgn(h)}` : `${neg(a)}/${fx(h)} ${sgn(k)}`;
  return yn(r, ok, { q: `f(x) = ${neg(a)}/${fx(h)} ${sgn(k)} and g(x) = ${g}. Are f and g inverses?`, steps: [`Swap x and y in f and solve: x − ${par(k)} = ${neg(a)}/(y − ${par(h)}), so y = ${neg(a)}/${fx(k)} ${sgn(h)}.`, ok ? 'That is g, so yes.' : 'That is not g, so no.'] });
});

// ───────── 6. Logarithms ─────────
skill('12-logeval', 12, 'Logarithms', 'Evaluate logarithms', ['log_b(x) = y means bʸ = x.', 'Change of base: log_b(x) = log x ÷ log b.', 'log x means base 10; ln x means base e.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const fr = r.bool(0.3), b = fr ? r.pick([2, 3]) : r.pick([2, 3, 4, 5, 10]), e = r.int(2, b === 10 ? 4 : b <= 3 ? 5 : 3), v = b ** e;
    const bs = fr ? `1/${b}` : String(b), vs = fr ? `1/${v}` : String(v), logF = fr ? `log base ${bs} of ${vs} = ${e}` : `${LG(b)} ${vs} = ${e}`;
    if (r.bool()) return mc(r, logF, [fr ? `log base ${vs} of ${bs} = ${e}` : `${LG(e)} ${vs} = ${b}`, fr ? `log base ${bs} of ${e} = ${vs}` : `${LG(v)} ${b} = ${e}`, fr ? `log base ${e} of ${vs} = ${bs}` : `${LG(b)} ${e} = ${v}`], { q: `Write ${fr ? `(${bs})` : bs}^${e} = ${vs} in logarithmic form.`, steps: ['bʸ = x becomes log_b(x) = y: the base stays the base, the exponent is the answer.', logF + '.'] });
    const expF = `${fr ? `(${bs})` : bs}^${e} = ${vs}`;
    return mc(r, expF, [`${e}^${fr ? `(${bs})` : bs} = ${vs}`, `${fr ? `(${vs})` : vs}^${e} = ${bs}`, `${fr ? `(${bs})` : bs}^${vs} = ${e}`], { q: `Write ${logF} in exponential form.`, steps: ['log_b(x) = y becomes bʸ = x.', expF + '.'] });
  }
  if (t === 1) {
    const c = r.pick([2, 3]), m = r.int(1, c === 2 ? 3 : 2), n = r.int(c === 2 ? -5 : -3, c === 2 ? 6 : 4), base = c ** m, vs = n >= 0 ? String(c ** n) : `1/${c ** -n}`, ans = frac(n, m);
    return num(ans, [`Write both as powers of ${c}: ${base} = ${c}^${m} and ${vs} = ${c}^${neg(n)}.`, `${base}^y = ${c}^${neg(n)} means ${m}y = ${neg(n)}, so y = ${fm(ans)}.`], { q: `Evaluate ${LG(base)} (${vs}).`, expr: `Math.log(${n >= 0 ? c ** n : `1/${c ** -n}`})/Math.log(${base})` });
  }
  if (t === 2) {
    const b = r.int(2, 9); let v = r.int(2, 100); while (Number.isInteger(Math.round(Math.log(v) / Math.log(b) * 1e9) / 1e9)) v = r.int(2, 100);
    const ans = dec(Math.log(v) / Math.log(b), 4);
    return num(ans, [`${LG(b)} ${v} = log ${v} ÷ log ${b}.`, `${dec(Math.log10(v), 5)} ÷ ${dec(Math.log10(b), 5)} ≈ ${ans}.`], { q: `Use the change of base formula to find ${LG(b)} ${v}, rounded to 4 decimal places.`, tol: 0.00006, expr: `Math.log(${v})/Math.log(${b})` });
  }
  const k = r.int(-3, 5), nat = r.bool(), disp = nat ? `ln(e^${neg(k)})` : `log ${k >= 0 ? 10 ** k : dec(10 ** k)}`;
  return num(k, [nat ? 'ln means log base e, and ln(eᵏ) = k.' : `log means base 10, and ${k >= 0 ? 10 ** k : dec(10 ** k)} = 10^${neg(k)}.`, `So ${disp} = ${neg(k)}.`], { q: `Evaluate ${disp}.`, expr: `${k}` });
});
const LOGPAIRS = [[6, 4, 9, 2], [6, 3, 12, 2], [6, 2, 18, 2], [10, 4, 25, 2], [10, 2, 50, 2], [10, 5, 200, 3], [10, 8, 125, 3], [4, 2, 8, 2], [12, 3, 48, 2], [15, 5, 45, 2]];
const LOGQ = [[3, 54, 2, 3], [2, 40, 5, 3], [5, 50, 2, 2], [10, 500, 5, 2], [2, 96, 3, 5], [3, 36, 4, 2], [6, 72, 2, 2]];
const LOGP = [[3, 2, 3, 1], [2, 2, 2, 3], [4, 3, 2, 1], [3, 2, 1, 2], [2, 3, 3, 2], [6, 2, 3, 2], [3, 5, 2, 1]];
skill('12-logprops', 12, 'Logarithms', 'Properties of logarithms', ['Product: log(MN) = log M + log N. Quotient: log(M/N) = log M − log N.', 'Power: log(Mᵖ) = p log M.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const kind = r.int(0, 2);
    if (kind === 0) { const [b, a, c, k] = r.pick(LOGPAIRS); return num(k, [`Product property: ${LG(b)} ${a} + ${LG(b)} ${c} = ${LG(b)} ${a * c}.`, `${a * c} = ${b}^${k}, so the answer is ${k}.`], { q: `Evaluate ${LG(b)} ${a} + ${LG(b)} ${c}.`, expr: `Math.log(${a * c})/Math.log(${b})` }); }
    if (kind === 1) { const [b, a, c, k] = r.pick(LOGQ); return num(k, [`Quotient property: ${LG(b)} ${a} − ${LG(b)} ${c} = ${LG(b)} ${a / c}.`, `${a / c} = ${b}^${k}, so the answer is ${k}.`], { q: `Evaluate ${LG(b)} ${a} − ${LG(b)} ${c}.`, expr: `Math.log(${a / c})/Math.log(${b})` }); }
    const [n, g, u, v] = r.pick(LOGP), b = g ** u, c = g ** v, ans = frac(n * v, u);
    return num(ans, [`Power property: ${n} ${LG(b)} ${c} = ${LG(b)} ${c}^${n} = ${LG(b)} ${c ** n}.`, `${c ** n} = ${g}^${n * v} and ${b} = ${g}^${u}, so the answer is ${n * v}/${u} = ${ans}.`], { q: `Evaluate ${n} ${LG(b)} ${c}.`, expr: `${n}*Math.log(${c})/Math.log(${b})` });
  }
  if (t === 1) {
    const b = r.pick([2, 3, 5, 7]), m = r.int(2, 9), n = r.int(2, 9), p = r.int(2, 5);
    const Q = [[`${LG(b)} ${m} + ${LG(b)} ${n} = ${LG(b)} ${m * n}`, 'Product property'], [`${LG(b)} ${m * n} − ${LG(b)} ${n} = ${LG(b)} ${m}`, 'Quotient property'], [`${LG(b)} (${m}^${p}) = ${p} ${LG(b)} ${m}`, 'Power property'], [`${LG(b)} ${m * n} = log ${m * n} ÷ log ${b}`, 'Change of base formula']];
    const [eq, right] = r.pick(Q);
    return mc(r, right, Q.map((x) => x[1]), { q: `Which property is used? ${eq}`, steps: ['Look at what happens to the numbers inside the logs.', `${right}.`] });
  }
  if (t === 2) {
    const m = r.int(2, 4), n = r.int(2, 4), right = `log(${pw('x', m)}${pw('y', n)}/z)`;
    return mc(r, right, [`log(${m}x · ${n}y/z)`, `log(${pw('x', m)}${pw('y', n)}z)`, `log(${pw('x', m)} + ${pw('y', n)} − z)`], { q: `Write ${m} log x + ${n} log y − log z as a single logarithm.`, steps: [`Power property: ${m} log x = log ${pw('x', m)} and ${n} log y = log ${pw('y', n)}.`, `Product, then quotient: ${right}.`] });
  }
  const b = r.pick([5, 6, 7]), p = Number((Math.log(2) / Math.log(b)).toFixed(4)), q = Number((Math.log(3) / Math.log(b)).toFixed(4));
  const [n, e, how] = r.pick([[12, `2*${p}+${q}`, '12 = 2² × 3, so 2p + q'], [18, `${p}+2*${q}`, '18 = 2 × 3², so p + 2q'], [8, `3*${p}`, '8 = 2³, so 3p'], [6, `${p}+${q}`, '6 = 2 × 3, so p + q'], ['1.5', `${q}-${p}`, '1.5 = 3 ÷ 2, so q − p']]);
  const v = Function(`return ${e}`)(), ans = dec(v, 4);
  return num(ans, [`${how}.`, `= ${ans}.`], { q: `${LG(b)} 2 ≈ ${p} (call it p) and ${LG(b)} 3 ≈ ${q} (call it q). Use them to find ${LG(b)} ${n}.`, tol: 0.0006, expr: e });
});

// ───────── 7. Exponential and logarithmic functions ─────────
skill('12-explog', 12, 'Exponential and logarithmic functions', 'Exponential and logarithmic equations', ['To solve bˣ = v, take logs: x = log v ÷ log b.', 'To solve log_b(…) = n, rewrite as … = bⁿ. Reject answers that make a log of 0 or a negative.', 'y = bˣ has range y > 0; y = log_b x has domain x > 0.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const h = r.nonzero(-6, 6), k = r.nonzero(-6, 6), b = r.pick([2, 3, 5]), ex = r.bool();
    if (ex) { const right = `y > ${neg(k)}`; return mc(r, right, [`y > ${neg(-k)}`, `y < ${neg(k)}`, 'all real numbers'], { q: `What is the range of y = ${b}^x ${sgn(k)}?`, steps: [`${b}^x is always greater than 0.`, `Adding ${neg(k)} gives ${right}.`] }); }
    const right = `x > ${neg(h)}`;
    return mc(r, right, [`x > ${neg(-h)}`, `x ≥ ${neg(h)}`, 'all real numbers'], { q: `What is the domain of y = ${LG(b)}(${poly([1, -h])})?`, steps: ['You can only take the log of a positive number.', `${poly([1, -h])} > 0, so ${right}.`] });
  }
  if (t === 1) {
    const b = r.int(2, 9); let v = r.int(3, 200); while (Number.isInteger(Math.round(Math.log(v) / Math.log(b) * 1e9) / 1e9)) v = r.int(3, 200);
    const a = r.pick([1, 1, 2, 3, 5]), x = Math.log(v) / Math.log(b), ans = dec(x, 2);
    return num(ans, [a === 1 ? `Take logs: x log ${b} = log ${v}.` : `Divide by ${a}, then take logs: x log ${b} = log ${v}.`, `x = log ${v} ÷ log ${b} ≈ ${ans}.`], { q: `Solve ${a === 1 ? '' : a + ' × '}${b}^x = ${a * v}. Round to 2 decimal places.`, tol: 0.006, expr: `Math.log(${v})/Math.log(${b})` });
  }
  if (t === 2) {
    const b = r.pick([2, 3, 5, 10]), n = r.int(1, b === 10 ? 3 : b === 2 ? 6 : 3), a = r.int(1, 5), x0 = r.int(-5, 20), c = b ** n - a * x0;
    return num(x0, [`Rewrite: ${poly([a, c])} = ${b}^${n} = ${b ** n}.`, `${poly([a, 0])} = ${b ** n - c}, so x = ${neg(x0)}.`], { q: `Solve ${LG(b)}(${poly([a, c])}) = ${n}.`, expr: `(${b}**${n}-(${c}))/${a}` });
  }
  if (t === 3) {
    const b = r.pick([2, 3, 6, 10]), x0 = r.int(1, 9), p = r.int(1, 6), q = x0 * (x0 + p);
    return num(x0, [`Product property: ${LG(b)}(x(x + ${p})) = ${LG(b)} ${q}, so x² + ${p}x − ${q} = 0.`, `(x − ${x0})(x + ${x0 + p}) = 0. x = −${x0 + p} would be the log of a negative, so x = ${x0}.`], { q: `Solve ${LG(b)} x + ${LG(b)}(x + ${p}) = ${LG(b)} ${q}.`, expr: `(-${p}+Math.sqrt(${p * p + 4 * q}))/2` });
  }
  const [eq, pts] = r.pick([['y = 2^x', [-2, -1, 0, 1, 2, 3].map((x) => [x, 2 ** x])], ['y = (1/2)^x', [-3, -2, -1, 0, 1, 2].map((x) => [x, 0.5 ** x])], ['y = 2 × 2^x', [-2, -1, 0, 1, 2].map((x) => [x, 2 * 2 ** x])], ['y = 3^x', [-1, 0, 1, 2].map((x) => [x, 3 ** x])]]);
  return mc(r, eq, ['y = 2^x', 'y = (1/2)^x', 'y = 2 × 2^x', 'y = 3^x', 'y = 2x'].filter((x) => x !== eq).slice(0, 3), { q: 'The points lie on the graph of an exponential function. Which equation matches?', visual: { type: 'plane', points: pts, range: 8 }, steps: [`Read the y-intercept and how y changes when x goes up by 1: ${pt(pts[0][0], pts[0][1])} and ${pt(pts[1][0], pts[1][1])}.`, `${eq}.`] });
});
skill('12-growth', 12, 'Exponential and logarithmic functions', 'Growth, decay and interest', ['Growth by r% per period: multiply by (1 + r) each time. Decay: multiply by (1 − r).', 'Half-life: after each half-life, half is left.', 'Continuous interest: A = Pe^(rt).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const P = r.int(10, 500) * 100, rt = r.int(1, 8), yrs = r.int(2, 15), v = P * (1 + rt / 100) ** yrs, ans = Math.round(v);
    return num(ans, [`P = ${comma(P)} × ${dec(1 + rt / 100)}^${yrs}.`, `≈ ${dec(v, 2)}, which rounds to ${ans}.`], { q: `A town of ${comma(P)} people grows by ${rt}% a year. What will its population be after ${yrs} years? Round to the nearest whole number.`, tol: 0.51, expr: `${P}*(1+${rt}/100)**${yrs}` });
  }
  if (t === 1) {
    const k = r.int(1, 4), m = r.int(1, 25) * 2 ** k, H = r.pick([3, 5, 8, 12, 30]);
    return num(m / 2 ** k, [`${k * H} years is ${k} half-li${k === 1 ? 'fe' : 'ves'}, so multiply by (1/2)^${k}.`, `${m} ÷ ${2 ** k} = ${m / 2 ** k} g.`], { q: `A sample has ${m} g of a substance with a half-life of ${H} years. How many grams are left after ${k * H} years?`, expr: `${m}*0.5**(${k * H}/${H})` });
  }
  if (t === 2) {
    const V = r.int(15, 60) * 1000, rt = r.pick([10, 12, 15, 18, 20]), yrs = r.int(2, 8), v = V * (1 - rt / 100) ** yrs, ans = Math.round(v);
    return num(ans, [`Each year keeps ${100 - rt}%: V = ${comma(V)} × ${dec(1 - rt / 100)}^${yrs}.`, `≈ $${dec(v, 2)}, which rounds to $${ans}.`], { q: `A $${comma(V)} car loses ${rt}% of its value each year. What is it worth after ${yrs} years, to the nearest dollar?`, tol: 0.51, expr: `${V}*(1-${rt}/100)**${yrs}` });
  }
  if (t === 3) {
    const P = r.int(5, 50) * 100, rt = r.pick([2, 3, 4, 5, 6]), yrs = r.int(2, 12), cont = r.bool(), n = r.pick([2, 4, 12]);
    const A = cont ? P * Math.exp(rt / 100 * yrs) : P * (1 + rt / 100 / n) ** (n * yrs), ans = (Math.round(A * 100) / 100).toFixed(2);
    return num(ans, [cont ? `A = Pe^(rt) = ${P}e^(${rt / 100} × ${yrs}).` : `A = P(1 + r/n)^(nt) = ${P}(1 + ${rt / 100}/${n})^(${n * yrs}).`, `A ≈ $${ans}.`], { q: `$${comma(P)} earns ${rt}% a year, compounded ${cont ? 'continuously' : { 2: 'twice a year', 4: 'quarterly', 12: 'monthly' }[n]}. What is it worth after ${yrs} years? Round to the nearest cent.`, tol: 0.011, expr: cont ? `${P}*Math.exp(${rt}/100*${yrs})` : `${P}*(1+${rt}/100/${n})**(${n}*${yrs})` });
  }
  const amt = r.int(2, 9) * 10, pct = r.int(2, 9), [d, right] = r.pick([[`A salary goes up by $${amt * 100} every year.`, 'Linear growth'], [`A salary goes up by ${pct}% every year.`, 'Exponential growth'], [`A tank loses ${amt} L of water every hour.`, 'Linear decay'], [`A medicine's amount in the body drops by ${pct * 3}% every hour.`, 'Exponential decay']]);
  return mc(r, right, ['Linear growth', 'Exponential growth', 'Linear decay', 'Exponential decay'], { q: `${d} Which describes this?`, steps: ['Adding or subtracting the same amount each time is linear; multiplying by the same percent is exponential.', `${right}.`] });
});

// ───────── 8. Radical functions ─────────
skill('12-radical', 12, 'Radical functions', 'Radical functions and equations', ['For y = a√(x − h) + k: the domain is x ≥ h; the range is y ≥ k if a > 0, or y ≤ k if a < 0.', 'Square both sides to solve, then check each answer in the original equation.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.pick([1, 2, 3, -1, -2]), h = r.nonzero(-6, 6), k = r.nonzero(-6, 6), askD = r.bool(), f = `y = ${coef(a)}√(${poly([1, -h])}) ${sgn(k)}`;
    const right = askD ? `x ≥ ${neg(h)}` : a > 0 ? `y ≥ ${neg(k)}` : `y ≤ ${neg(k)}`;
    const wrongs = askD ? [`x ≥ ${neg(-h)}`, `x ≤ ${neg(h)}`, 'all real numbers'] : [a > 0 ? `y ≤ ${neg(k)}` : `y ≥ ${neg(k)}`, `y ≥ ${neg(-k)}`, 'all real numbers'];
    return mc(r, right, wrongs, { q: `What is the ${askD ? 'domain' : 'range'} of ${f}?`, steps: [askD ? `The expression under the root must be at least 0: ${poly([1, -h])} ≥ 0.` : `√(…) ≥ 0, and a = ${neg(a)} is ${a > 0 ? 'positive' : 'negative'}.`, `So the ${askD ? 'domain' : 'range'} is ${right}.`] });
  }
  if (t === 1) {
    const h = r.nonzero(-6, 6), right = 'all real numbers';
    return mc(r, right, [`x ≥ ${neg(h)}`, `x > ${neg(h)}`, `x ≥ ${neg(-h)}`], { q: `What is the domain of y = ∛(${poly([1, -h])})?`, steps: ['You can take the cube root of any number, even a negative one.', 'The domain is all real numbers.'] });
  }
  if (t === 2) {
    const x0 = r.int(-5, 15), a = r.int(1, 4), c = r.int(1, 8), b = c * c - a * x0, m = r.pick([1, 2, 3]);
    return num(x0, [`${m > 1 ? `Divide by ${m}, then s` : 'S'}quare both sides: ${poly([a, b])} = ${c * c}.`, `${poly([a, 0])} = ${neg(c * c - b)}, so x = ${neg(x0)}.`], { q: `Solve ${m === 1 ? '' : m}√(${poly([a, b])}) = ${m * c}.`, expr: `(${c * c}-(${b}))/${a}` });
  }
  const q = r.int(-3, 4), s = r.int(2, 6), x0 = q + s, p = s * s - x0, x1 = 2 * q + 1 - x0;
  return num(x0, [`Square: ${poly([1, p])} = (${poly([1, -q])})², so ${poly([1, -(2 * q + 1), q * q - p])} = 0 and x = ${neg(x0)} or x = ${neg(x1)}.`, `Check: x = ${neg(x1)} makes the right side ${neg(x1 - q)}, which is negative, so reject it. x = ${neg(x0)}.`], { q: `Solve √(${poly([1, p])}) = ${poly([1, -q])}.`, expr: `${x0}` });
});

// ───────── 9. Roots and rational exponents ─────────
skill('12-roots', 12, 'Roots and rational exponents', 'Roots and simplifying radicals', ['ⁿ√a is the number whose nth power is a. Odd roots of negatives are negative.', 'Take out perfect powers: √(x⁵) = x²√x and ∛54 = 3∛2.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const n = r.pick([3, 4, 5]), b = r.int(2, n === 5 ? 3 : 4), sg = n % 2 && r.bool() ? -1 : 1, v = sg * b ** n, sym = { 3: '∛', 4: '∜', 5: '⁵√' }[n];
    return num(sg * b, [`${par(sg * b)}^${n} = ${neg(v)}.`, `So ${sym}(${neg(v)}) = ${neg(sg * b)}.`], { q: `Find ${sym}(${neg(v)}).`, expr: `${sg}*Math.round(${Math.abs(v)}**(1/${n}))` });
  }
  if (t === 1) {
    const b = r.int(2, 5); let a = r.int(1, b + 2); while (gcd(a, b) !== 1) a = r.int(1, b + 2); const sg = r.bool() ? -1 : 1, ans = frac(sg * a, b);
    return num(ans, [`∛${a ** 3} = ${a} and ∛${b ** 3} = ${b}.`, `${sg < 0 ? 'The cube root of a negative is negative: ' : ''}∛(${sg < 0 ? '−' : ''}${a ** 3}/${b ** 3}) = ${fm(ans)}.`], { q: `Find ∛(${sg < 0 ? '−' : ''}${a ** 3}/${b ** 3}).`, expr: `${sg}*${a}/${b}` });
  }
  if (t === 2) {
    let n = r.int(2, 300); while (Number.isInteger(Math.round(Math.cbrt(n) * 1e9) / 1e9)) n = r.int(2, 300); const ans = dec(Math.cbrt(n), 2);
    return num(ans, [`${Math.floor(Math.cbrt(n))}³ = ${Math.floor(Math.cbrt(n)) ** 3} and ${Math.ceil(Math.cbrt(n))}³ = ${Math.ceil(Math.cbrt(n)) ** 3}, so ∛${n} is between ${Math.floor(Math.cbrt(n))} and ${Math.ceil(Math.cbrt(n))}.`, `A calculator gives ∛${n} ≈ ${ans}.`], { q: `Use a calculator: find ∛${n}, rounded to 2 decimal places.`, tol: 0.006, expr: `Math.cbrt(${n})` });
  }
  if (t === 3) {
    const k = r.int(2, 6), m = r.pick([2, 3, 5, 6, 7]), e = r.int(1, 3), right = `${k}${pw('x', e)}√(${m}x)`;
    return mc(r, right, [`${k}${pw('x', 2 * e)}√(${m}x)`, `${k * k}${pw('x', e)}√(${m}x)`, `${k}${pw('x', e + 1)}√${m}`], { q: `Simplify √(${k * k * m}${pw('x', 2 * e + 1)}), for x ≥ 0.`, steps: [`${k * k * m}${pw('x', 2 * e + 1)} = ${k * k}${pw('x', 2 * e)} × ${m}x.`, `√(${k * k}${pw('x', 2 * e)}) = ${k}${pw('x', e)}, so ${right}.`] });
  }
  const k = r.int(2, 5), m = r.pick([2, 3, 4, 5, 6, 7]), right = `${k}∛${m}`;
  return mc(r, right, [`${m}∛${k}`, `${k * k}∛${m}`, `${k}∛${m * k}`], { q: `Simplify ∛${k ** 3 * m}.`, steps: [`${k ** 3 * m} = ${k ** 3} × ${m}, and ${k ** 3} = ${k}³.`, `∛${k ** 3 * m} = ${right}.`] });
});
skill('12-ratexp', 12, 'Roots and rational exponents', 'Rational exponents', ['ⁿ√(xᵐ) = x^(m/n).', 'Add exponents to multiply, subtract to divide, multiply for a power of a power.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const q = r.pick([2, 3]), b = r.int(2, q === 2 ? 5 : 3); let a = r.int(1, b + 1); while (gcd(a, b) !== 1) a = r.int(1, b + 1);
    const p = r.pick([1, 2, 3].filter((x) => x % q)), negE = r.bool(0.4), ans = negE ? frac(b ** p, a ** p) : frac(a ** p, b ** p);
    return num(ans, [`The ${q === 2 ? 'square' : 'cube'} root of ${a ** q}/${b ** q} is ${a}/${b}.`, `${negE ? `Flip for the negative exponent, then raise to ${p}` : `Raise to the power ${p}`}: ${ans}.`], { q: `Evaluate (${a ** q}/${b ** q})^(${negE ? '−' : ''}${p}/${q}).`, expr: `(${a ** q}/${b ** q})**(${negE ? -p : p}/${q})` });
  }
  if (t === 1) {
    let a, b, c, d, e, f; do { [a, b, c, d, e, f] = [r.int(1, 5), r.pick([2, 3, 4]), r.int(1, 5), r.pick([2, 3, 6]), r.int(1, 3), r.pick([2, 4, 6])]; } while (a % b === 0 || c % d === 0 || e % f === 0); const ans = frac(a * d * f + c * b * f - e * b * d, b * d * f);
    return num(ans, ['Multiplying: add exponents. Dividing: subtract.', `${frac(a, b)} + ${frac(c, d)} − ${frac(e, f)} = ${fm(ans)}.`], { q: `Simplify x^(${frac(a, b)}) × x^(${frac(c, d)}) ÷ x^(${frac(e, f)}). What is the exponent of x?`, expr: `${a}/${b}+${c}/${d}-${e}/${f}` });
  }
  if (t === 2) {
    const n = r.pick([3, 4, 5]); let m = r.int(1, 7); while (m % n === 0) m = r.int(1, 7);
    return num(frac(m, n), [`The root index ${n} becomes the denominator; the power ${m} is the numerator.`, `${{ 3: '∛', 4: '∜', 5: '⁵√' }[n]}(${pw('x', m)}) = x^(${frac(m, n)}).`], { q: `Write ${{ 3: '∛', 4: '∜', 5: '⁵√' }[n]}(${pw('x', m)}) as x^k. What is k?`, expr: `${m}/${n}` });
  }
  if (t === 3) {
    const d1 = r.pick([2, 3]), d2 = r.pick([2, 3, 4]); let p = r.int(1, 3), q = r.int(1, 3); while (p % d1 === 0) p = r.int(1, 3); while (q % d2 === 0) q = r.int(1, 3); const n = lcm(d1, d2) * r.int(1, 2), ex = n * p / d1, ey = n * q / d2, right = `${pw('x', ex)}${pw('y', ey)}`;
    return mc(r, right, [`${pw('x', ex + 1)}${pw('y', ey)}`, `${pw('x', ey)}${pw('y', ex === ey ? ey + 1 : ex)}`, `${pw('x', p * n)}${pw('y', q * n)}`], { q: `Simplify (x^(${frac(p, d1)}) y^(${frac(q, d2)}))^${n}.`, steps: [`Multiply each exponent by ${n}.`, `${frac(p, d1)} × ${n} = ${ex} and ${frac(q, d2)} × ${n} = ${ey}: ${right}.`] });
  }
  const c = r.int(2, 5), a = r.int(-9, 9), x0 = c * c - a;
  return num(x0, [`Raise both sides to the power 2/3: ${poly([1, a])} = (${c ** 3})^(2/3) = ${c * c}.`, `x = ${c * c} ${sgn(-a)} = ${neg(x0)}.`], { q: `Solve (${poly([1, a])})^(3/2) = ${c ** 3}.`, expr: `${c * c}-(${a})` });
});

// ───────── 10. Systems of equations ─────────
skill('12-sys2', 12, 'Systems of equations', 'Systems in two variables', ['Elimination: multiply the equations so one variable has opposite coefficients, then add.', 'Same slope and different intercepts: no solution (inconsistent). Same line: infinitely many (dependent).'], (r) => {
  const t = r.int(0, 3);
  const eq2 = (a, b, c) => `${poly([a, 0])} ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${neg(c)}`;
  if (t === 0) {
    let a1, b1, a2, b2; do { a1 = r.nonzero(-5, 5); b1 = r.nonzero(-5, 5); a2 = r.nonzero(-5, 5); b2 = r.nonzero(-5, 5); } while (a1 * b2 - a2 * b1 === 0);
    const x0 = r.int(-6, 6), y0 = r.int(-6, 6), c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, D = a1 * b2 - a2 * b1, askX = r.bool();
    return num(askX ? x0 : y0, [`Multiply the first equation by ${neg(b2)} and the second by ${neg(b1)}, then subtract to remove y: ${neg(D)}x = ${neg(c1 * b2 - c2 * b1)}.`, `x = ${neg(x0)}.`, `Put it back: ${poly([b1, 0], 'y')} = ${neg(c1)} − ${par(a1 * x0)} = ${neg(c1 - a1 * x0)}, so y = ${neg(y0)}.`], { q: `Solve the system ${eq2(a1, b1, c1)} and ${eq2(a2, b2, c2)}. What is ${askX ? 'x' : 'y'}?`, expr: askX ? `(${c1}*(${b2})-(${c2})*(${b1}))/(${D})` : `((${a1})*(${c2})-(${a2})*(${c1}))/(${D})` });
  }
  if (t === 1) {
    const p = r.int(8, 20), q = r.int(4, p - 2), kg = r.int(10, 40), a = r.int(1, kg - 1), T = p * a + q * (kg - a);
    return num(a, [`Let a = kg of almonds and c = kg of cashews... here: a + c = ${kg} and ${p}a + ${q}c = ${T}.`, `Substitute c = ${kg} − a: ${p - q}a = ${T - q * kg}.`, `a = ${a}.`], { q: `A store mixes almonds at $${p}/kg with peanuts at $${q}/kg to make ${kg} kg of mix worth $${T}. How many kilograms of almonds are used?`, expr: `(${T}-${q}*${kg})/(${p}-${q})` });
  }
  if (t === 2) {
    const m = r.nonzero(-4, 4), b = r.int(-6, 6), kind = r.int(0, 2), k = r.pick([2, 3]), m2 = kind === 0 ? m + r.nonzero(-2, 2) : m, b2 = kind === 1 ? b + r.nonzero(-4, 4) : b;
    const right = ['Consistent and independent (one solution)', 'Inconsistent (no solution)', 'Consistent and dependent (infinitely many solutions)'][kind];
    return mc(r, right, ['Consistent and independent (one solution)', 'Inconsistent (no solution)', 'Consistent and dependent (infinitely many solutions)'], { q: `Classify the system: y = ${poly([m, b])} and ${k}y = ${poly([k * m2, k * b2])}.`, steps: [`The second equation is y = ${poly([m2, b2])}.`, `${kind === 0 ? 'Different slopes' : kind === 1 ? 'Same slope, different intercepts' : 'The same line'}: ${right}.`] });
  }
  const x0 = r.int(-4, 4), y0 = r.int(-4, 4), m1 = r.int(-2, 2); let m2 = r.int(-2, 2); while (m2 === m1) m2 = r.int(-2, 2);
  const right = pt(x0, y0);
  return mc(r, right, [pt(y0, x0) === right ? pt(x0, y0 + 1) : pt(y0, x0), pt(-x0, y0) === right ? pt(x0 - 1, y0) : pt(-x0, y0), pt(x0 + 1, y0 + 1)], { q: `Use the graph to solve the system y = ${poly([m1, y0 - m1 * x0])} and y = ${poly([m2, y0 - m2 * x0])}.`, visual: { type: 'plane', lines: [[m1, y0 - m1 * x0], [m2, y0 - m2 * x0]] }, steps: ['The solution is where the lines cross.', `They cross at ${right}.`] });
});
skill('12-sys3', 12, 'Systems of equations', 'Systems in three variables', ['Use two pairs of equations to eliminate the same variable; that leaves a system in two variables.', 'If the equations reduce to 0 = 0 there are infinitely many solutions; 0 = (not 0) means none.'], (r) => {
  const t = r.int(0, 2);
  if (t < 2) {
    const x0 = r.int(-5, 5), y0 = r.int(-5, 5), z0 = r.int(-5, 5); let a = r.int(1, 4), c = r.int(1, 4); while (a === c) c = r.int(1, 4); const b = r.nonzero(-3, 3);
    const S = x0 + y0 + z0, T = x0 - y0 + z0, U = a * x0 + b * y0 + c * z0, v = r.pick(['x', 'y', 'z']), ans = { x: x0, y: y0, z: z0 }[v];
    return num(ans, [`Subtract the second equation from the first: 2y = ${neg(S - T)}, so y = ${neg(y0)}.`, `Then x + z = ${neg(S - y0)} and ${poly([a, 0])} + ${poly([c, 0], 'z')} = ${neg(U - b * y0)}.`, `Solve those two: x = ${neg(x0)} and z = ${neg(z0)}.`, `So ${v} = ${neg(ans)}.`], { q: `Solve: x + y + z = ${neg(S)}, x − y + z = ${neg(T)}, ${poly([a, 0])} ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y + ${c === 1 ? '' : c}z = ${neg(U)}. What is ${v}?`, expr: `${ans}` });
  }
  const kind = r.int(0, 2); let A, B, C, det;
  // A and B must not be parallel planes; for one solution, C must make the determinant non-zero
  do { A = [1, r.nonzero(-3, 3), r.nonzero(-3, 3), r.int(-9, 9)]; B = [r.nonzero(-3, 3), 1, r.nonzero(-3, 3), r.int(-9, 9)]; } while (A[1] * B[2] - A[2] * B[1] === 0 && A[0] * B[2] - A[2] * B[0] === 0 && A[0] * B[1] - A[1] * B[0] === 0);
  do {
    C = A.map((x, i) => x + B[i]); if (kind === 1) C[3] += r.nonzero(-4, 4); if (kind === 0) C = [r.int(1, 3), r.nonzero(-3, 3), C[2] + r.nonzero(-2, 2), r.int(-9, 9)];
    det = A[0] * (B[1] * C[2] - B[2] * C[1]) - A[1] * (B[0] * C[2] - B[2] * C[0]) + A[2] * (B[0] * C[1] - B[1] * C[0]);
  } while (kind === 0 && det === 0);
  const sx = (e) => `${poly([e[0], 0])} ${e[1] < 0 ? '−' : '+'} ${Math.abs(e[1]) === 1 ? '' : Math.abs(e[1])}y ${e[2] < 0 ? '−' : '+'} ${Math.abs(e[2]) === 1 ? '' : Math.abs(e[2])}z = ${neg(e[3])}`;
  const realKind = kind;
  const right = ['Exactly one solution', 'No solution', 'Infinitely many solutions'][realKind];
  const why = realKind === 0 ? 'The third equation is not built from the first two, so the planes meet at one point.' : realKind === 1 ? 'The left side of the third equation is the sum of the first two, but its constant is not: no solution.' : 'The third equation is exactly the sum of the first two: infinitely many solutions.';
  return mc(r, right, ['Exactly one solution', 'No solution', 'Infinitely many solutions'], { q: `How many solutions? ${sx(A)}; ${sx(B)}; ${sx(C)}`, steps: [realKind === 0 ? 'Try to build the third equation from the first two.' : 'Add the first two equations and compare with the third.', why] });
});

// ───────── 11. Systems of inequalities ─────────
skill('12-sysineq', 12, 'Systems of inequalities', 'Linear programming', ['The best value of an objective is always at a vertex of the feasible region.', 'Find the vertices by solving pairs of boundary lines, then test each one.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const p = r.int(1, 6), q = r.int(1, 4) * 2, A = p + q, B = 2 * p + q, c = r.int(1, 9), d = r.int(1, 9), V = [[0, 0], [B / 2, 0], [p, q], [0, A]], P = V.map(([x, y]) => c * x + d * y), best = Math.max(...P);
    return num(dec(best), [`Vertices: ${V.map(([x, y]) => pt(x, y)).join(', ')}.`, `P = ${c === 1 ? "" : c}x + ${d === 1 ? "" : d}y gives ${P.map((x) => dec(x)).join(', ')}.`, `The maximum is ${dec(best)}.`], { q: `Maximize P = ${c === 1 ? "" : c}x + ${d === 1 ? "" : d}y subject to x ≥ 0, y ≥ 0, x + y ≤ ${A} and 2x + y ≤ ${B}.`, expr: `Math.max(0, ${c}*${B}/2, ${c}*${p}+${d}*${q}, ${d}*${A})` });
  }
  if (t === 1) {
    const s = r.int(3, 8), tt = s + r.int(1, 5), c = r.int(1, 9), d = r.int(1, 9), V = [[s, 0], [tt, 0], [tt, tt], [0, tt], [0, s]], P = V.map(([x, y]) => c * x + d * y), best = Math.min(...P);
    return num(best, [`Vertices: ${V.map(([x, y]) => pt(x, y)).join(', ')}.`, `C = ${c === 1 ? "" : c}x + ${d === 1 ? "" : d}y gives ${P.join(', ')}.`, `The minimum is ${best}.`], { q: `Minimize C = ${c === 1 ? "" : c}x + ${d === 1 ? "" : d}y subject to x ≥ 0, y ≥ 0, x + y ≥ ${s}, x ≤ ${tt} and y ≤ ${tt}.`, expr: `${s}*Math.min(${c},${d})` });
  }
  const x0 = r.int(-4, 4), y0 = r.int(-4, 4), m1 = r.nonzero(-2, 2); let m2 = r.int(-2, 2); while (m2 === m1) m2 = r.int(-2, 2);
  const right = pt(x0, y0);
  return mc(r, right, [pt(x0 + 1, y0), pt(x0, y0 - 1), pt(-x0 - 1, y0 + 1)], { q: `The feasible region of y ≤ ${poly([m1, y0 - m1 * x0])} and y ≥ ${poly([m2, y0 - m2 * x0])} has a vertex where the boundary lines meet. Find it.`, visual: { type: 'plane', lines: [[m1, y0 - m1 * x0], [m2, y0 - m2 * x0]] }, steps: [`Set ${poly([m1, y0 - m1 * x0])} = ${poly([m2, y0 - m2 * x0])}: x = ${neg(x0)}.`, `Then y = ${neg(y0)}: the vertex is ${right}.`] });
});

// ───────── 12. Nonlinear inequalities ─────────
skill('12-polyineq', 12, 'Nonlinear inequalities', 'Quadratic and higher-degree inequalities', ['Find the zeros, mark them on a number line, and test the sign in each interval.', 'A polynomial with a positive leading coefficient is positive to the right of its largest zero.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const p = r.int(-6, 3), q = p + r.int(1, 6), op = r.pick(['<', '≤', '>', '≥']), neg1 = r.bool(0.4), below = (op === '<' || op === '≤') !== neg1, s = op === '<' || op === '>' ? '<' : '≤';
    const btw = `${neg(p)} ${s} x ${s} ${neg(q)}`, out = `x ${s} ${neg(p)} or x ${s === '<' ? '>' : '≥'} ${neg(q)}`, right = below ? btw : out;
    return mc(r, right, [below ? out : btw, `${neg(-q)} ${s} x ${s} ${neg(-p)}`, `x ${s} ${neg(-q)} or x ${s === '<' ? '>' : '≥'} ${neg(-p)}`], { q: `Solve ${poly(neg1 ? [-1, p + q, -p * q] : [1, -(p + q), p * q])} ${op} 0.`, steps: [`The zeros are ${neg(p)} and ${neg(q)}; the parabola opens ${neg1 ? 'down' : 'up'}.`, `${right}.`] });
  }
  if (t === 1) {
    const [p, q, s] = r.shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 3).sort((a, b) => a - b), gt = r.bool();
    const A = `${neg(p)} < x < ${neg(q)} or x > ${neg(s)}`, B = `x < ${neg(p)} or ${neg(q)} < x < ${neg(s)}`, right = gt ? A : B;
    return mc(r, right, [gt ? B : A, `x > ${neg(s)}`, `${neg(p)} < x < ${neg(s)}`], { q: `Solve ${fx(p)}${fx(q)}${fx(s)} ${gt ? '>' : '<'} 0.`, steps: [`The zeros ${neg(p)}, ${neg(q)}, ${neg(s)} split the line into 4 parts. Far right it is positive, and the sign flips at each zero.`, `It is ${gt ? 'positive' : 'negative'} for ${right}.`] });
  }
  if (t === 2) {
    const p = r.int(-6, 3), q = p + r.int(1, 7);
    return num(q - p + 1, [`The zeros are ${neg(p)} and ${neg(q)}; the expression is ≤ 0 between them, including them.`, `Integers from ${neg(p)} to ${neg(q)}: ${q - p + 1}.`], { q: `How many integers satisfy ${poly([1, -(p + q), p * q])} ≤ 0?`, expr: `${q}-(${p})+1` });
  }
  const p = r.int(-4, 4), q = p + r.int(1, 5), v = r.int(-6, 8), val = (v - p) * (v - q) * v, op = r.pick(['>', '<']), ok = op === '>' ? val > 0 : val < 0;
  return yn(r, ok, { q: `Is x = ${neg(v)} a solution of x${fx(p)}${fx(q)} ${op} 0?`, steps: [`Put x = ${neg(v)} in: ${neg(v)} × ${par(v - p)} × ${par(v - q)} = ${neg(val)}.`, `Is ${neg(val)} ${op} 0? ${ok ? 'Yes' : 'No'}.`] });
});

// ───────── 13. Matrices ─────────
const rndM = (r, m, n, lo = -5, hi = 6) => Array.from({ length: m }, () => Array.from({ length: n }, () => r.int(lo, hi)));
skill('12-matrix', 12, 'Matrices', 'Matrix operations', ['An m × n matrix has m rows and n columns; aᵢⱼ is the entry in row i, column j.', 'Add or subtract matching entries. To multiply AB, row i of A times column j of B gives entry ij.', 'AB is defined only when A has as many columns as B has rows.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const m = r.int(2, 3), n = r.int(2, 4), A = rndM(r, m, n), i = r.int(1, m), j = r.int(1, n);
    return num(A[i - 1][j - 1], [`a${SUB[i]}${SUB[j]} is in row ${i}, column ${j}.`, `That entry is ${neg(A[i - 1][j - 1])}.`], { q: `Matrix A is shown. What is entry a${SUB[i]}${SUB[j]}?`, visual: { type: 'table', rows: A.map((row) => row.map(neg)) } });
  }
  const A = rndM(r, 2, 2), B = rndM(r, 2, 2), i = r.int(0, 1), j = r.int(0, 1), q0 = `A = ${mat(A)} and B = ${mat(B)}.`;
  if (t === 1) {
    const sub = r.bool(), v = sub ? A[i][j] - B[i][j] : A[i][j] + B[i][j];
    return num(v, [`Entry (${i + 1}, ${j + 1}) uses ${neg(A[i][j])} and ${neg(B[i][j])}.`, `${neg(A[i][j])} ${sub ? '−' : '+'} ${par(B[i][j])} = ${neg(v)}.`], { q: `${q0} What is the entry in row ${i + 1}, column ${j + 1} of A ${sub ? '−' : '+'} B?`, expr: `${A[i][j]}${sub ? '-' : '+'}(${B[i][j]})` });
  }
  if (t === 2) {
    const p = r.nonzero(-3, 3), q = r.nonzero(-3, 3), v = p * A[i][j] + q * B[i][j];
    return num(v, [`Entry (${i + 1}, ${j + 1}): ${neg(p)} × ${par(A[i][j])} ${q < 0 ? '−' : '+'} ${Math.abs(q)} × ${par(B[i][j])}.`, `= ${neg(p * A[i][j])} ${q * B[i][j] < 0 ? '−' : '+'} ${Math.abs(q * B[i][j])} = ${neg(v)}.`], { q: `${q0} What is the entry in row ${i + 1}, column ${j + 1} of ${coef(p)}A ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}B?`, expr: `${p}*(${A[i][j]})+(${q})*(${B[i][j]})` });
  }
  if (t === 3) {
    const v = A[i][0] * B[0][j] + A[i][1] * B[1][j];
    return num(v, [`Row ${i + 1} of A is (${A[i].map(neg).join(', ')}); column ${j + 1} of B is (${neg(B[0][j])}, ${neg(B[1][j])}).`, `${neg(A[i][0])} × ${par(B[0][j])} + ${par(A[i][1])} × ${par(B[1][j])} = ${neg(v)}.`], { q: `${q0} What is the entry in row ${i + 1}, column ${j + 1} of AB?`, expr: `(${A[i][0]})*(${B[0][j]})+(${A[i][1]})*(${B[1][j]})` });
  }
  const m = r.int(2, 4), n = r.int(2, 4), ok = r.bool(), p = ok ? n : n + r.pick([1, -1]), s = r.int(2, 4), right = ok ? `${m} × ${s}` : 'Not defined';
  return mc(r, right, [ok ? 'Not defined' : `${m} × ${s}`, `${n} × ${p}`, `${p} × ${m}`].filter((x) => x !== right), { q: `A is ${m} × ${n} and B is ${p} × ${s}. What are the dimensions of AB?`, steps: [`AB needs the columns of A (${n}) to equal the rows of B (${p}).`, ok ? `They match, so AB is ${m} × ${s}.` : 'They do not match, so AB is not defined.'] });
});
skill('12-det', 12, 'Matrices', 'Determinants and inverse matrices', ['For [a b ; c d], the determinant is ad − bc.', 'A matrix is invertible only if its determinant is not 0. Then A⁻¹ = (1/det) × [d −b ; −c a].', 'To solve AX = B, use X = A⁻¹B.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const A = rndM(r, 2, 2, -9, 9), D = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return num(D, ['det = ad − bc.', `${neg(A[0][0])} × ${par(A[1][1])} − ${par(A[0][1])} × ${par(A[1][0])} = ${neg(D)}.`], { q: `Find the determinant of ${mat(A)}.`, expr: `(${A[0][0]})*(${A[1][1]})-(${A[0][1]})*(${A[1][0]})` });
  }
  if (t === 1) {
    const A = rndM(r, 3, 3, -3, 3), [[a, b, c], [d, e, f], [g, h, i]] = A, m1 = e * i - f * h, m2 = d * i - f * g, m3 = d * h - e * g, D = a * m1 - b * m2 + c * m3;
    return num(D, [`Expand along the top row: ${neg(a)}(${neg(m1)}) − ${par(b)}(${neg(m2)}) + ${par(c)}(${neg(m3)}).`, `= ${neg(a * m1)} − ${par(b * m2)} + ${par(c * m3)} = ${neg(D)}.`], { q: `Find the determinant of ${mat(A)}.`, expr: `(${a})*((${e})*(${i})-(${f})*(${h}))-(${b})*((${d})*(${i})-(${f})*(${g}))+(${c})*((${d})*(${h})-(${e})*(${g}))` });
  }
  if (t === 2) {
    const sing = r.bool(), a = r.nonzero(-6, 6), b = r.int(-6, 6), k = r.nonzero(-3, 3), A = sing ? [[a, b], [k * a, k * b]] : [[a, b], [r.int(-6, 6), r.nonzero(-6, 6)]], D = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return yn(r, D !== 0, { q: `Is ${mat(A)} invertible?`, steps: [`det = ${neg(A[0][0])} × ${par(A[1][1])} − ${par(A[0][1])} × ${par(A[1][0])} = ${neg(D)}.`, D !== 0 ? 'The determinant is not 0, so yes.' : 'The determinant is 0, so no.'] });
  }
  let A, D; do { A = rndM(r, 2, 2, -6, 6); D = A[0][0] * A[1][1] - A[0][1] * A[1][0]; } while (D === 0);
  const [[a, b], [c, d]] = A;
  if (t === 3) {
    const adj = [[d, -b], [-c, a]], i = r.int(0, 1), j = r.int(0, 1), ans = frac(adj[i][j], D);
    return num(ans, [`det = ${neg(D)}, so A⁻¹ = (1/${neg(D)}) × ${mat(adj)}.`, `Entry (${i + 1}, ${j + 1}) = ${neg(adj[i][j])} ÷ ${par(D)} = ${fm(ans)}.`], { q: `A = ${mat(A)}. What is the entry in row ${i + 1}, column ${j + 1} of A⁻¹?`, expr: `${adj[i][j]}/(${D})` });
  }
  const x0 = r.int(-6, 6), y0 = r.int(-6, 6), e = a * x0 + b * y0, f = c * x0 + d * y0, askX = r.bool();
  return num(askX ? x0 : y0, [`X = A⁻¹B with A⁻¹ = (1/${neg(D)}) × ${mat([[d, -b], [-c, a]])}.`, `x = (${neg(d)} × ${par(e)} − ${par(b)} × ${par(f)}) ÷ ${par(D)} = ${neg(x0)}.`, `y = (${neg(a)} × ${par(f)} − ${par(c)} × ${par(e)}) ÷ ${par(D)} = ${neg(y0)}.`], { q: `Solve ${mat(A)} × [x ; y] = [${neg(e)} ; ${neg(f)}]. What is ${askX ? 'x' : 'y'}?`, expr: askX ? `((${d})*(${e})-(${b})*(${f}))/(${D})` : `((${a})*(${f})-(${c})*(${e}))/(${D})` });
});

// ───────── 14. Trigonometry ─────────
skill('12-radians', 12, 'Trigonometry', 'Radians, arc length and reference angles', ['180° = π radians, so multiply degrees by π/180.', 'Arc length s = rθ, with θ in radians.', 'Use the reference angle for the size of a ratio and the quadrant for its sign.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const deg = r.pick([30, 45, 60, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330, 360, 540]), right = piS(deg, 180);
    return mc(r, right, [piS(deg, 360), piS(180, deg), piS(deg, 90)].filter((x) => x !== right), { q: `Convert ${deg}° to radians.`, steps: [`Multiply by π/180: ${deg} × π/180.`, `= ${right}.`] });
  }
  if (t === 1) {
    const d = r.pick([2, 3, 4, 6, 12]), n = r.int(1, 2 * d); const deg = (180 * n) / d;
    return num(deg, ['Replace π with 180°.', `${piS(n, d)} = ${n} × 180° ÷ ${d} = ${dec(deg)}°.`], { q: `Convert ${piS(n, d)} radians to degrees.`, expr: `${n}*180/${d}` });
  }
  if (t === 2) {
    const rr = r.int(2, 20), dpi = r.bool(), th = dpi ? null : r.int(5, 30) / 10, [n, d] = dpi ? r.pick([[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6], [1, 2]]) : [0, 0], ang = dpi ? n * Math.PI / d : th, v = rr * ang, ans = dec(v, 1);
    return num(ans, ['Arc length s = rθ.', `s = ${rr} × ${dpi ? piS(n, d) : th} ≈ ${ans} cm.`], { q: `A circle has radius ${rr} cm. Find the length of the arc cut off by a central angle of ${dpi ? piS(n, d) : th} radians. Round to 1 decimal place.`, tol: 0.051, expr: `${rr}*${dpi ? `${n}*Math.PI/${d}` : th}` });
  }
  if (t === 3) {
    const [n, d] = r.pick([[2, 3], [3, 4], [5, 6], [7, 6], [5, 4], [4, 3], [5, 3], [7, 4], [11, 6]]), refN = { 3: 1, 4: 1, 6: 1 }[d], rd = n / d < 1 ? 1 - n / d : n / d < 1.5 ? n / d - 1 : 2 - n / d, right = piS(Math.round(rd * d), d);
    return mc(r, right, ['π/6', 'π/4', 'π/3', 'π/2'].filter((x) => x !== right), { q: `What is the reference angle of ${piS(n, d)}?`, steps: [`${piS(n, d)} is in Quadrant ${n / d < 1 ? 'II' : n / d < 1.5 ? 'III' : 'IV'}.`, `Its distance to the x-axis is ${right}.`] });
  }
  const deg = r.pick([120, 135, 150, 210, 225, 240, 300, 315, 330]), f = r.pick(['sin', 'cos', 'tan']), q = Math.floor(deg / 90), ref = [deg, 180 - deg, deg - 180, 360 - deg][q];
  const pos = { sin: q <= 1, cos: q === 0 || q === 3, tan: q === 0 || q === 2 }[f], mag = SPECIAL[f][ref], right = pos ? mag : `−${mag}`;
  const pool = ['1/2', '√2/2', '√3/2', '1', '√3', '√3/3'].flatMap((x) => [x, `−${x}`]).filter((x) => x !== right && x !== (pos ? `−${mag}` : mag));
  return mc(r, right, [pos ? `−${mag}` : mag, ...r.shuffle(pool).slice(0, 2)], { q: `What is the exact value of ${f} ${deg}°?`, steps: [`The reference angle is ${ref}°, and ${deg}° is in Quadrant ${['I', 'II', 'III', 'IV'][q]}, where ${f} is ${pos ? 'positive' : 'negative'}.`, `${f} ${ref}° = ${mag}, so ${f} ${deg}° = ${right}.`] });
});
skill('12-trisolve', 12, 'Trigonometry', 'Solve triangles', ['Right triangles: SOH CAH TOA. Other triangles: the Sine Law or the Cosine Law.', "Area = ½ab sin C, or Heron's formula: √(s(s − a)(s − b)(s − c)) where s is half the perimeter."], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const th = r.int(15, 75), a = r.int(4, 30), v = a * Math.tan(th * RAD), ans = dec(v, 1);
    return num(ans, [`tan ${th}° = opposite ÷ ${a}.`, `opposite = ${a} × tan ${th}° ≈ ${ans}.`], { q: `In a right triangle, an angle of ${th}° has an adjacent leg of ${a} cm. How long is the opposite leg? Round to 1 decimal place.`, tol: 0.051, expr: `${a}*Math.tan(${th}*Math.PI/180)` });
  }
  if (t === 1) {
    const h = r.int(6, 30), o = r.int(2, h - 1), A = Math.asin(o / h) / RAD, ans = Math.round(A);
    return num(ans, [`sin θ = ${o}/${h}.`, `θ = sin⁻¹(${o}/${h}) ≈ ${A.toFixed(2)}°, so about ${ans}°.`], { q: `A right triangle has hypotenuse ${h} cm and the side opposite θ is ${o} cm. Find θ to the nearest degree.`, tol: 0.51, expr: `Math.asin(${o}/${h})*180/Math.PI` });
  }
  if (t === 2) {
    const A = r.int(30, 80), a = r.int(10, 25), b = r.int(4, a - 1), B = Math.asin(b * Math.sin(A * RAD) / a) / RAD, ans = Math.round(B);
    return num(ans, [`Sine Law: sin B = ${b} × sin ${A}° ÷ ${a} ≈ ${dec(Math.sin(B * RAD), 4)}.`, `B ≈ ${B.toFixed(2)}°, so about ${ans}°.`], { q: `In △ABC, ∠A = ${A}°, a = ${a} cm and b = ${b} cm. Find ∠B to the nearest degree.`, tol: 0.51, expr: `Math.asin(${b}*Math.sin(${A}*Math.PI/180)/${a})*180/Math.PI` });
  }
  if (t === 3) {
    const a = r.int(4, 20), b = r.int(4, 20), C = r.int(20, 150), area = r.bool(), v = area ? 0.5 * a * b * Math.sin(C * RAD) : Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * RAD)), ans = dec(v, 1);
    return num(ans, [area ? `Area = ½ × ${a} × ${b} × sin ${C}°.` : `c² = ${a}² + ${b}² − 2(${a})(${b})cos ${C}°.`, area ? `≈ ${ans} cm².` : `c ≈ ${ans} cm.`], { q: `In △ABC, a = ${a} cm, b = ${b} cm and ∠C = ${C}°. Find ${area ? 'the area' : 'c'}, rounded to 1 decimal place.`, tol: 0.051, expr: area ? `0.5*${a}*${b}*Math.sin(${C}*Math.PI/180)` : `Math.sqrt(${a}**2+${b}**2-2*${a}*${b}*Math.cos(${C}*Math.PI/180))` });
  }
  let a, b, c; do { a = r.int(4, 15); b = r.int(4, 15); c = r.int(4, 15); } while (a + b <= c || a + c <= b || b + c <= a);
  const s = (a + b + c) / 2, v = Math.sqrt(s * (s - a) * (s - b) * (s - c)), ans = dec(v, 1);
  return num(ans, [`s = (${a} + ${b} + ${c}) ÷ 2 = ${dec(s)}.`, `Area = √(${dec(s)} × ${dec(s - a)} × ${dec(s - b)} × ${dec(s - c)}) ≈ ${ans}.`], { q: `Use Heron's formula to find the area of a triangle with sides ${a}, ${b} and ${c} cm. Round to 1 decimal place.`, tol: 0.051, expr: `Math.sqrt(${s}*(${s}-${a})*(${s}-${b})*(${s}-${c}))` });
});
const INV = [['sin⁻¹(1/2)', 30], ['sin⁻¹(−1/2)', -30], ['cos⁻¹(1/2)', 60], ['cos⁻¹(−1/2)', 120], ['tan⁻¹(1)', 45], ['tan⁻¹(−1)', -45], ['sin⁻¹(√3/2)', 60], ['cos⁻¹(0)', 90], ['tan⁻¹(√3)', 60], ['cos⁻¹(−√2/2)', 135], ['sin⁻¹(1)', 90]];
const LINEQ = [['2 sin x − 1 = 0', [30, 150]], ['2 cos x + 1 = 0', [120, 240]], ['tan x − 1 = 0', [45, 225]], ['2 sin x + √3 = 0', [240, 300]], ['√2 cos x − 1 = 0', [45, 315]], ['2 cos x − √3 = 0', [30, 330]], ['sin x + 1 = 0', [270]], ['√3 tan x + 1 = 0', [150, 330]]];
const RADEQ = [['sin x = 1/2', 'π/6 and 5π/6', ['π/3 and 2π/3', 'π/6 and 7π/6', 'π/6 and 11π/6']], ['cos x = 1/2', 'π/3 and 5π/3', ['π/6 and 11π/6', 'π/3 and 2π/3', 'π/3 and 4π/3']], ['tan x = 1', 'π/4 and 5π/4', ['π/4 and 3π/4', 'π/4 and 7π/4', '3π/4 and 7π/4']], ['sin x = −√2/2', '5π/4 and 7π/4', ['3π/4 and 5π/4', 'π/4 and 3π/4', '5π/4 and 3π/4']], ['cos x = −√3/2', '5π/6 and 7π/6', ['π/6 and 11π/6', '2π/3 and 4π/3', '5π/6 and 11π/6']]];
skill('12-trigeq', 12, 'Trigonometry', 'Inverse trig and trig equations', ['sin⁻¹ gives an angle from −90° to 90°, cos⁻¹ from 0° to 180°, tan⁻¹ between −90° and 90°.', 'Get the trig ratio alone, find the reference angle, then use the signs to find every angle in the interval.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const [e, v] = r.pick(INV); return num(v, [`Which angle in the allowed range has this ratio?`, `${e} = ${neg(v)}°.`], { q: `Find ${e} in degrees.` }); }
  if (t === 1) { const [e, s] = r.pick(LINEQ); return txt(`x = ${s.join('°, ')}°`, ['Get the trig ratio alone, then use the special angles and the signs in each quadrant.', `x = ${s.join('° and ')}°.`], { q: `Solve ${e} for 0° ≤ x < 360°. Give every solution.`, numbers: s }); }
  if (t === 2) { const [e, right, w] = r.pick(RADEQ); return mc(r, right, w, { q: `Solve ${e} for 0 ≤ x < 2π.`, steps: ['Find the reference angle, then the two quadrants with the right sign.', `x = ${right}.`] }); }
  const sinE = r.bool(), v = r.int(10, 90) / 100, A = (sinE ? Math.asin(v) : Math.acos(v)) / RAD, s = [Math.round(A), Math.round(sinE ? 180 - A : 360 - A)];
  return txt(`x = ${s[0]}° or x = ${s[1]}°`, [`${sinE ? 'sin' : 'cos'}⁻¹(${v}) ≈ ${A.toFixed(2)}°. ${sinE ? 'sin' : 'cos'} is also positive in Quadrant ${sinE ? 'II' : 'IV'}: ${sinE ? '180°' : '360°'} − ${A.toFixed(2)}°.`, `x ≈ ${s[0]}° or x ≈ ${s[1]}°.`], { q: `Solve ${sinE ? 'sin' : 'cos'} x = ${v} for 0° ≤ x < 360°. Round each angle to the nearest degree.`, numbers: s });
});

// ───────── 15. Trigonometric functions ─────────
const sinEq = (fn, a, b, c, d) => `y = ${coef(a)}${fn}(${b === 1 ? (c ? `x ${sgn(-c)}°` : 'x') : `${b}${c ? `(x ${sgn(-c)}°)` : 'x'}`})${d ? ' ' + sgn(d) : ''}`;
skill('12-sinusoid', 12, 'Trigonometric functions', 'Properties of sine and cosine functions', ['For y = a sin(b(x − c)) + d: amplitude |a|, period 360° ÷ b, phase shift c, midline y = d.', 'Maximum = d + |a|; minimum = d − |a|.'], (r) => {
  const t = r.int(0, 4), fn = r.pick(['sin', 'cos']), a = r.nonzero(-5, 5), b = r.pick([1, 2, 3, 4, 6]), c = r.pick([0, 0, 30, -30, 45, -45, 60, -60, 90]), d = r.int(-5, 5), eq = sinEq(fn, a, b, c, d);
  if (t === 0) return num(Math.abs(a), ['The amplitude is |a|.', `a = ${neg(a)}, so the amplitude is ${Math.abs(a)}.`], { q: `What is the amplitude of ${eq}?` });
  if (t === 1) return num(360 / b, ['Period = 360° ÷ b.', `360° ÷ ${b} = ${360 / b}°.`], { q: `What is the period of ${eq}, in degrees?`, expr: `360/${b}` });
  if (t === 2) return num(d, ['The midline is y = d.', `Here d = ${neg(d)}, so the midline is y = ${neg(d)}.`], { q: `The midline of ${eq} is y = ?` });
  if (t === 3) { const mx = r.bool(), v = mx ? d + Math.abs(a) : d - Math.abs(a); return num(v, [`The midline is y = ${neg(d)} and the amplitude is ${Math.abs(a)}.`, `${mx ? 'Maximum' : 'Minimum'} = ${neg(d)} ${mx ? '+' : '−'} ${Math.abs(a)} = ${neg(v)}.`], { q: `What is the ${mx ? 'maximum' : 'minimum'} value of ${eq}?`, expr: `${d}${mx ? '+' : '-'}${Math.abs(a)}` }); }
  const cc = c || 45, e2 = sinEq(fn, a, b, cc, d), right = `${Math.abs(cc)}° to the ${cc > 0 ? 'right' : 'left'}`;
  return mc(r, right, [`${Math.abs(cc)}° to the ${cc > 0 ? 'left' : 'right'}`, `${Math.abs(cc * b)}° to the ${cc > 0 ? 'right' : 'left'}`, `${Math.abs(d) || 1} unit${Math.abs(d) === 1 || !d ? '' : 's'} up`], { q: `What is the phase shift of ${e2}?`, steps: ['In y = a sin(b(x − c)) + d, the phase shift is c.', `c = ${neg(cc)}°: ${right}.`] });
});
skill('12-sinwrite', 12, 'Trigonometric functions', 'Write and graph sine and cosine functions', ['b = 360° ÷ period. Amplitude = (max − min) ÷ 2. Midline d = (max + min) ÷ 2.', 'y = cos x starts at its maximum; y = sin x starts on its midline.'], (r) => {
  const t = r.int(0, 3), a = r.int(1, 5), d = r.int(-4, 4);
  if (t === 0) {
    const P = r.pick([90, 120, 180, 360, 720]), b = 360 / P, fn = r.pick(['sin', 'cos']), bS = b === 1 ? 'x' : b === 0.5 ? '(x/2)' : `${b}x`, E = (A, B, D) => `y = ${A === 1 ? '' : A}${fn}${B.startsWith('(') ? B : `(${B})`}${D ? ' ' + sgn(D) : ''}`, right = E(a, bS, d);
    return mc(r, right, [E(a, `${P}x`, d), E(Math.abs(d) || 2, bS, a), E(a, bS, -d === d ? d + 1 : -d)], { q: `Which ${fn === 'sin' ? 'sine' : 'cosine'} function has amplitude ${a}, period ${P}° and midline y = ${neg(d)}?`, steps: [`b = 360° ÷ ${P}° = ${dec(b)}.`, `${right}.`] });
  }
  if (t === 1) {
    const fn = r.pick(['sin', 'cos']), xs = [0, 90, 180, 270], val = (x) => d + a * (fn === 'sin' ? [0, 1, 0, -1] : [1, 0, -1, 0])[x / 90], E = (f, A, D) => `y = ${A === 1 ? '' : A} ${f} x${D ? ' ' + sgn(D) : ''}`.replace('=  ', '= '), right = E(fn, a, d);
    return mc(r, right, [E(fn === 'sin' ? 'cos' : 'sin', a, d), E(fn, Math.abs(d) || a + 1, a === Math.abs(d) ? d + 1 : a), E(fn, a, -d === d ? d + 2 : -d)], { q: 'Which function matches the table?', visual: { type: 'table', head: ['x', ...xs.map((x) => x + '°')], rows: [['y', ...xs.map((x) => neg(val(x)))]] }, steps: [`Max ${neg(d + a)}, min ${neg(d - a)}: amplitude ${a}, midline y = ${neg(d)}. At 0° it is ${fn === 'sin' ? 'on the midline' : 'at its maximum'}, so it is ${fn === 'sin' ? 'sine' : 'cosine'}.`, `${right}.`] });
  }
  if (t === 2) {
    const fn = r.pick(['sin', 'cos']), b = r.pick([1, 2, 3]), x = r.pick([0, 30, 45, 90, 180]) / b * (b === 1 ? 1 : 1), ang = b * x, base = { sin: { 0: 0, 30: '1/2', 45: null, 90: 1, 180: 0 }, cos: { 0: 1, 30: null, 45: null, 90: 0, 180: -1 } }[fn][ang];
    const val = base === null || base === undefined ? (fn === 'sin' ? 1 : 0) : base, xx = base === null || base === undefined ? 90 / b : x, angle = b * xx, fv = fn === 'sin' ? Math.round(Math.sin(angle * RAD) * 2) / 2 : Math.round(Math.cos(angle * RAD) * 2) / 2, v = a * fv + d;
    return num(dec(v), [`${fn}(${b === 1 ? '' : b + ' × '}${dec(xx)}°) = ${fn} ${angle}° = ${dec(fv)}.`, `y = ${a} × ${par(fv)} ${sgn(d)} = ${fm(dec(v))}.`], { q: `For y = ${a === 1 ? '' : a}${fn}(${b === 1 ? '' : b}x) ${sgn(d)}, find y when x = ${dec(xx)}°.`, expr: `${a}*Math.round(Math.${fn}(${b}*${xx}*Math.PI/180)*2)/2+(${d})` });
  }
  const fn = r.pick(['sin', 'cos']), b = r.pick([1, 2, 3]), v = fn === 'cos' ? a + d : d;
  return num(v, [`At x = 0, ${fn}(0) = ${fn === 'cos' ? 1 : 0}.`, `y = ${a} × ${fn === 'cos' ? 1 : 0} ${sgn(d)} = ${neg(v)}.`], { q: `Where does the graph of y = ${a === 1 ? '' : a}${fn}(${b === 1 ? '' : b}x) ${sgn(d)} cross the y-axis? Give the y-value.`, expr: `${a}*Math.${fn}(0)+(${d})` });
});

// ───────── 16. Trigonometric identities ─────────
const SUMDIFF = [['sin 75°', '(√6 + √2)/4'], ['cos 75°', '(√6 − √2)/4'], ['sin 15°', '(√6 − √2)/4'], ['cos 15°', '(√6 + √2)/4'], ['tan 15°', '2 − √3'], ['tan 75°', '2 + √3'], ['cos 105°', '(√2 − √6)/4'], ['sin 105°', '(√6 + √2)/4']];
skill('12-identity', 12, 'Trigonometric identities', 'Trigonometric identities', ['sin θ = cos(90° − θ). sin(−θ) = −sin θ and cos(−θ) = cos θ.', 'sin²θ + cos²θ = 1. tan θ = sin θ ÷ cos θ, and csc, sec, cot are reciprocals.', 'sin(A ± B) = sin A cos B ± cos A sin B; cos(A ± B) = cos A cos B ∓ sin A sin B.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.int(5, 85), [f, g] = r.pick([['sin', 'cos'], ['cos', 'sin'], ['tan', 'cot'], ['sec', 'csc']]);
    return num(90 - a, [`Complementary angles: ${f} θ = ${g}(90° − θ).`, `90° − ${a}° = ${90 - a}°.`], { q: `${f} ${a}° = ${g} x°. Find x, between 0 and 90.`, expr: `90-${a}` });
  }
  const [o, ad, h] = r.pick(TRIPLES), Q = r.int(1, 4), sS = Q <= 2 ? 1 : -1, cS = Q === 1 || Q === 4 ? 1 : -1, sinV = frac(sS * o, h), cosV = frac(cS * ad, h);
  if (t === 1) {
    const [e, v, why] = r.pick([[`sin(−θ)`, frac(-sS * o, h), 'sin(−θ) = −sin θ'], [`sin(180° − θ)`, sinV, 'sin(180° − θ) = sin θ'], [`sin(θ + 360°)`, sinV, 'sin repeats every 360°'], [`sin(θ + 180°)`, frac(-sS * o, h), 'sin(θ + 180°) = −sin θ']]);
    return num(v, [`${why}.`, `${e} = ${fm(v)}.`], { q: `sin θ = ${fm(sinV)}. Find ${e}.`, expr: v.includes('/') ? v.replace(/^(-?\d+)\/(\d+)$/, '$1/$2') : v });
  }
  if (t === 2) {
    return num(cosV, [`cos²θ = 1 − (${fm(sinV)})² = ${ad * ad}/${h * h}, so cos θ = ±${ad}/${h}.`, `In Quadrant ${['I', 'II', 'III', 'IV'][Q - 1]}, cos is ${cS > 0 ? 'positive' : 'negative'}: cos θ = ${fm(cosV)}.`], { q: `sin θ = ${fm(sinV)} and θ is in Quadrant ${['I', 'II', 'III', 'IV'][Q - 1]}. Find cos θ.`, expr: `${cS}*Math.sqrt(1-(${sS * o}/${h})**2)` });
  }
  if (t === 3) {
    const [f, n, dd] = r.pick([['tan', sS * o, cS * ad], ['sec', h, cS * ad], ['csc', h, sS * o], ['cot', cS * ad, sS * o]]), v = frac(n, dd);
    return num(v, [`From sin θ = ${fm(sinV)} in Quadrant ${['I', 'II', 'III', 'IV'][Q - 1]}, cos θ = ${fm(cosV)}.`, `${f} θ = ${{ tan: 'sin ÷ cos', sec: '1 ÷ cos', csc: '1 ÷ sin', cot: 'cos ÷ sin' }[f]} = ${fm(v)}.`], { q: `sin θ = ${fm(sinV)} and θ is in Quadrant ${['I', 'II', 'III', 'IV'][Q - 1]}. Find ${f} θ.`, expr: `${n}/(${dd})` });
  }
  const [e, right] = r.pick(SUMDIFF);
  return mc(r, right, [...new Set(SUMDIFF.map((x) => x[1]))].filter((x) => x !== right).slice(0, 3), { q: `Use a sum or difference identity to find the exact value of ${e}.`, steps: [`Write the angle as a sum or difference of 30°, 45°, 60°, and use the identity.`, `${e} = ${right}.`] });
});

// ───────── 17. Conic sections ─────────
skill('12-circle', 12, 'Conic sections', 'Circles and parabolas', ['A circle with centre (h, k) and radius r: (x − h)² + (y − k)² = r².', 'x² = 4py is a parabola with vertex (0, 0), focus (0, p) and directrix y = −p.', 'Complete the square to change general form to standard form.'], (r) => {
  const t = r.int(0, 4), h = r.int(-6, 6), k = r.int(-6, 6), rr = r.int(1, 9), sq = (v, c) => (c === 0 ? `${v}²` : `(${v} ${sgn(-c)})²`), std = `${sq('x', h)} + ${sq('y', k)} = ${rr * rr}`;
  if (t === 0) {
    if (r.bool()) return num(rr, ['The right side is r².', `r = √${rr * rr} = ${rr}.`], { q: `What is the radius of the circle ${std}?` });
    const right = pt(h, k); return mc(r, right, [pt(-h, -k), pt(h, -k), pt(k, h)].filter((x) => x !== right).concat([pt(h + 1, k)]), { q: `What is the centre of the circle ${std}?`, steps: ['In (x − h)² + (y − k)² = r² the centre is (h, k).', `Centre ${right}.`] });
  }
  if (t === 1) {
    return mc(r, std, [`${sq('x', -h)} + ${sq('y', -k)} = ${rr * rr}`, `${sq('x', h)} + ${sq('y', k)} = ${rr}`, `${sq('x', k)} + ${sq('y', h)} = ${rr * rr}`].filter((x) => x !== std).concat([`${sq('x', h)} + ${sq('y', k)} = ${rr * rr + 1}`]), { q: `Which is the equation of the circle with centre ${pt(h, k)} and radius ${rr}?`, steps: ['Use (x − h)² + (y − k)² = r².', std + '.'] });
  }
  if (t === 2) {
    const D = -2 * h, E = -2 * k, F = h * h + k * k - rr * rr, gen = `x² + y²${D ? ` ${sgn(D)}x` : ''}${E ? ` ${sgn(E)}y` : ''}${F ? ` ${sgn(F)}` : ''} = 0`;
    return num(rr, [`Complete the square: ${sq('x', h)} + ${sq('y', k)} = ${neg(-F)} + ${h * h} + ${k * k} = ${rr * rr}.`, `So the radius is √${rr * rr} = ${rr}.`], { q: `Find the radius of the circle ${gen}.`, expr: `Math.sqrt(${h * h}+${k * k}-(${F}))` });
  }
  const p = r.nonzero(-4, 4), up = r.bool(), eq = up ? `x² = ${4 * p}y` : `y² = ${4 * p}x`;
  if (t === 3) { const right = up ? pt(0, p) : pt(p, 0); return mc(r, right, [up ? pt(0, -p) : pt(-p, 0), up ? pt(p, 0) : pt(0, p), up ? pt(0, 4 * p) : pt(4 * p, 0)], { q: `Where is the focus of the parabola ${eq}?`, steps: [`${4 * p} = 4p, so p = ${neg(p)}.`, `The focus is ${right}.`] }); }
  return num(-p, [`${4 * p} = 4p, so p = ${neg(p)}.`, `The directrix is ${up ? 'y' : 'x'} = −p = ${neg(-p)}.`], { q: `The directrix of the parabola ${eq} is ${up ? 'y' : 'x'} = ?`, expr: `-(${4 * p})/4` });
});
const ELL = [[5, 4, 3], [13, 12, 5], [10, 8, 6], [17, 15, 8], [5, 3, 4], [25, 24, 7], [10, 6, 8]];
const HYP = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13], [12, 5, 13], [8, 6, 10], [8, 15, 17]];
skill('12-ellipse', 12, 'Conic sections', 'Ellipses and hyperbolas', ['Ellipse x²/a² + y²/b² = 1 (a > b): vertices (±a, 0), foci (±c, 0) with c² = a² − b².', 'Hyperbola x²/a² − y²/b² = 1: vertices (±a, 0), c² = a² + b², asymptotes y = ±(b/a)x.', 'Eccentricity e = c ÷ a.'], (r) => {
  const t = r.int(0, 4);
  if (t <= 2) {
    const [a, b, c] = r.pick(ELL), vert = r.bool(), eq = vert ? `x²/${b * b} + y²/${a * a} = 1` : `x²/${a * a} + y²/${b * b} = 1`;
    if (t === 0) return num(2 * a, [`The larger denominator is a² = ${a * a}, so a = ${a}.`, `The major axis is 2a = ${2 * a}.`], { q: `How long is the major axis of the ellipse ${eq}?`, expr: `2*Math.sqrt(${a * a})` });
    if (t === 1) return num(c, [`c² = a² − b² = ${a * a} − ${b * b} = ${c * c}.`, `c = ${c}, so each focus is ${c} from the centre.`], { q: `How far is each focus from the centre of the ellipse ${eq}?`, expr: `Math.sqrt(${a * a}-${b * b})` });
    return num(frac(c, a), [`c = √(${a * a} − ${b * b}) = ${c} and a = ${a}.`, `e = c ÷ a = ${c}/${a} = ${frac(c, a)}.`], { q: `What is the eccentricity of the ellipse ${eq}?`, expr: `Math.sqrt(${a * a}-${b * b})/${a}` });
  }
  if (t === 3) {
    const [a, b, c] = r.pick(HYP), eq = `x²/${a * a} − y²/${b * b} = 1`, k = r.int(0, 2);
    if (k === 0) return num(c, [`c² = a² + b² = ${a * a} + ${b * b} = ${c * c}.`, `c = ${c}.`], { q: `For the hyperbola ${eq}, how far is each focus from the centre?`, expr: `Math.sqrt(${a * a}+${b * b})` });
    if (k === 1) return num(frac(c, a), [`c = √(${a * a} + ${b * b}) = ${c}.`, `e = ${c}/${a} = ${frac(c, a)}.`], { q: `What is the eccentricity of the hyperbola ${eq}?`, expr: `Math.sqrt(${a * a}+${b * b})/${a}` });
    return num(frac(b, a), [`a = ${a} and b = ${b}; the asymptotes are y = ±(b/a)x.`, `The positive slope is ${b}/${a} = ${frac(b, a)}.`], { q: `The asymptotes of the hyperbola ${eq} are y = ±mx. What is m?`, expr: `${b}/${a}` });
  }
  const kind = r.int(0, 3), A = r.int(1, 6), C = [A, A + r.int(1, 4), -r.int(1, 6), 0][kind], D = r.int(-8, 8), E = kind === 3 ? r.nonzero(-8, 8) : r.int(-8, 8), F = r.int(-20, 20);
  const right = ['Circle', 'Ellipse', 'Hyperbola', 'Parabola'][kind], eq = `${poly([A, 0, 0])}${C ? ` ${C < 0 ? '−' : '+'} ${Math.abs(C) === 1 ? '' : Math.abs(C)}y²` : ''}${D ? ` ${sgn(D)}x` : ''}${E ? ` ${sgn(E)}y` : ''}${F ? ` ${sgn(F)}` : ''} = 0`;
  return mc(r, right, ['Circle', 'Ellipse', 'Hyperbola', 'Parabola'], { q: `Which conic section is ${eq} (assuming it is not degenerate)?`, steps: [`Compare the x² and y² coefficients: ${A} and ${neg(C)}.`, ['Equal: a circle.', 'Same sign but different: an ellipse.', 'Opposite signs: a hyperbola.', 'Only one squared term: a parabola.'][kind]] });
});

// ───────── 18. Complex numbers ─────────
skill('12-complex', 12, 'Complex numbers', 'Operations with complex numbers', ['i² = −1. Add or subtract real parts and imaginary parts separately.', 'The conjugate of a + bi is a − bi; (a + bi)(a − bi) = a² + b².', 'To divide, multiply top and bottom by the conjugate of the bottom.'], (r) => {
  const t = r.int(0, 4), a = r.int(-6, 6), b = r.nonzero(-6, 6), c = r.int(-6, 6), d = r.nonzero(-6, 6);
  if (t === 0) {
    const sub = r.bool(), right = sub ? cx(a - c, b - d) : cx(a + c, b + d);
    return mc(r, right, [sub ? cx(a + c, b + d) : cx(a - c, b - d), sub ? cx(a - c, b + d) : cx(a + c, b - d), cx((sub ? a - c : a + c) + 1, sub ? b - d : b + d)], { q: `Simplify (${cx(a, b)}) ${sub ? '−' : '+'} (${cx(c, d)}).`, steps: [`Real parts: ${neg(a)} ${sub ? '−' : '+'} ${par(c)}. Imaginary parts: ${neg(b)} ${sub ? '−' : '+'} ${par(d)}.`, `${right}.`] });
  }
  if (t === 1) {
    const re = a * c - b * d, im = a * d + b * c, right = cx(re, im);
    return mc(r, right, [cx(a * c + b * d, im), cx(re, a * d - b * c), cx(a * c, b * d)], { q: `Multiply (${cx(a, b)})(${cx(c, d)}).`, steps: [`FOIL: ${neg(a * c)} + ${par(a * d)}i + ${par(b * c)}i + ${par(b * d)}i².`, `i² = −1, so ${right}.`] });
  }
  if (t === 2) {
    const right = cx(a, -b);
    return mc(r, right, [cx(-a, b), cx(-a, -b), cx(b, a)].filter((x) => x !== right).concat([cx(a, b)]), { q: `What is the complex conjugate of ${cx(a, b)}?`, steps: ['Change the sign of the imaginary part only.', `${right}.`] });
  }
  if (t === 3) {
    const zr = a * c - b * d, zi = a * d + b * c, right = cx(a, b);
    return mc(r, right, [cx(a, -b), cx(b, a), cx(-a, -b)], { q: `Divide (${cx(zr, zi)}) ÷ (${cx(c, d)}).`, steps: [`Multiply top and bottom by ${cx(c, -d)}; the bottom becomes ${c * c + d * d}.`, `The top becomes ${cx(a * (c * c + d * d), b * (c * c + d * d))}; dividing gives ${right}.`] });
  }
  const [p, q, h] = r.pick(TRIPLES), k = r.int(1, 2), sa = r.bool() ? 1 : -1, sb = r.bool() ? 1 : -1;
  return num(h * k, ['|a + bi| = √(a² + b²).', `√(${p * k}² + ${q * k}²) = √${(h * k) ** 2} = ${h * k}.`], { q: `Find |${cx(sa * p * k, sb * q * k)}|.`, expr: `Math.hypot(${p * k},${q * k})` });
});

// ───────── 19. Complex plane ─────────
skill('12-cplane', 12, 'Complex plane', 'Graphing complex numbers', ['a + bi is the point (a, b): real part across, imaginary part up.', 'Adding complex numbers adds their points like vectors. The conjugate reflects the point in the real axis.'], (r) => {
  const t = r.int(0, 3), a = r.nonzero(-5, 5), b = r.nonzero(-5, 5);
  if (t === 0) {
    const right = cx(a, b);
    return mc(r, right, [cx(b, a), cx(a, -b), cx(-a, b)].filter((x) => x !== right).concat([cx(a + 1, b)]), { q: 'Which complex number is shown by point z?', visual: { type: 'plane', points: [[a, b, 'z']] }, steps: [`The point is ${pt(a, b)}: real part ${neg(a)}, imaginary part ${neg(b)}.`, `z = ${right}.`] });
  }
  if (t === 1) {
    const Q = a > 0 ? (b > 0 ? 'I' : 'IV') : b > 0 ? 'II' : 'III';
    return mc(r, `Quadrant ${Q}`, ['I', 'II', 'III', 'IV'].map((x) => `Quadrant ${x}`), { q: `In which quadrant of the complex plane is ${cx(a, b)}?`, steps: [`It is the point ${pt(a, b)}.`, `Real part ${a > 0 ? 'positive' : 'negative'}, imaginary part ${b > 0 ? 'positive' : 'negative'}: Quadrant ${Q}.`] });
  }
  if (t === 2) {
    const right = pt(a, -b);
    return mc(r, right, [pt(-a, b), pt(-a, -b), pt(b, a)].filter((x) => x !== right).concat([pt(a, b)]), { q: `The conjugate of ${cx(a, b)} is plotted. At which point?`, steps: [`The conjugate is ${cx(a, -b)}.`, `It is the point ${right}, the reflection in the real axis.`] });
  }
  const c = r.int(-4, 4), d = r.int(-4, 4), sub = r.bool(), x = sub ? a - c : a + c, y = sub ? b - d : b + d, right = pt(x, y);
  return mc(r, right, [pt(sub ? a + c : a - c, sub ? b + d : b - d), pt(y, x), pt(x, -y)].filter((s) => s !== right).concat([pt(x + 1, y)]), { q: `z = ${cx(a, b)} and w = ${cx(c, d)}. Which point shows z ${sub ? '−' : '+'} w?`, visual: { type: 'plane', points: [[a, b, 'z'], [c, d, 'w']], range: 9 }, steps: [`z ${sub ? '−' : '+'} w = ${cx(x, y)}.`, `That is the point ${right}.`] });
});
skill('12-cdist', 12, 'Complex plane', 'Distance, midpoint and absolute value in the complex plane', ['|a + bi| is the distance from 0 to the point (a, b).', 'The distance between z and w is |z − w|. The midpoint is (z + w) ÷ 2.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const [p, q, h] = r.pick(TRIPLES), s1 = r.bool() ? 1 : -1, s2 = r.bool() ? 1 : -1; return num(h, [`The point is ${pt(s1 * p, s2 * q)}.`, `Distance from 0 = √(${p}² + ${q}²) = ${h}.`], { q: `How far is ${cx(s1 * p, s2 * q)} from the origin in the complex plane?`, expr: `Math.hypot(${p},${q})` }); }
  if (t === 1) {
    const [p, q, h] = r.pick(TRIPLES.slice(0, 3)), a = r.int(-5, 5), b = r.int(-5, 5), c = a + (r.bool() ? p : -p), d = b + (r.bool() ? q : -q);
    return num(h, [`z − w = ${cx(a - c, b - d)}.`, `|z − w| = √(${p}² + ${q}²) = ${h}.`], { q: `Find the distance between ${cx(a, b)} and ${cx(c, d)} in the complex plane.`, expr: `Math.hypot(${a - c},${b - d})` });
  }
  if (t === 2) {
    const a = r.int(-8, 8), b = r.int(-8, 8), c = a + 2 * r.int(-4, 4), d = b + 2 * r.nonzero(-4, 4), right = cx((a + c) / 2, (b + d) / 2);
    return mc(r, right, [cx(a + c, b + d), cx((a - c) / 2, (b - d) / 2), cx((b + d) / 2, (a + c) / 2)].filter((x) => x !== right).concat([cx((a + c) / 2 + 1, (b + d) / 2)]), { q: `What is the midpoint of ${cx(a, b)} and ${cx(c, d)}?`, steps: [`Add them: ${cx(a + c, b + d)}.`, `Divide by 2: ${right}.`] });
  }
  const a = r.nonzero(-9, 9), b = r.nonzero(-9, 9), v = Math.hypot(a, b), ans = dec(v, 2);
  return num(ans, ['|a + bi| = √(a² + b²).', `√(${a * a} + ${b * b}) = √${a * a + b * b} ≈ ${ans}.`], { q: `Find |${cx(a, b)}|, rounded to 2 decimal places.`, tol: 0.006, expr: `Math.hypot(${a},${b})` });
});

// ───────── 20. Polar form ─────────
skill('12-polar', 12, 'Polar form', 'Polar form of complex numbers', ['r(cos θ + i sin θ): r is the modulus |z| and θ is the argument (angle from the positive real axis).', 'a = r cos θ and b = r sin θ.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.nonzero(-9, 9), b = r.nonzero(-9, 9), A = ((Math.atan2(b, a) / RAD) + 360) % 360, ans = Math.round(A);
    return num(ans, [`The point ${pt(a, b)} is in Quadrant ${a > 0 ? (b > 0 ? 'I' : 'IV') : b > 0 ? 'II' : 'III'}; tan⁻¹(${Math.abs(b)}/${Math.abs(a)}) ≈ ${(Math.atan(Math.abs(b / a)) / RAD).toFixed(2)}°.`, `Measured from the positive real axis, θ ≈ ${A.toFixed(2)}°, about ${ans}°.`], { q: `Find the argument of ${cx(a, b)}, from 0° to 360°, to the nearest degree.`, tol: 0.51, expr: `((Math.atan2(${b},${a})*180/Math.PI)+360)%360` });
  }
  if (t === 1) {
    const rr = r.int(1, 6) * 2, th = r.pick([0, 90, 180, 270, 60, 120, 240, 300, 30, 150, 210, 330]), askRe = [0, 90, 180, 270, 60, 120, 240, 300].includes(th) && ([30, 150, 210, 330].includes(th) ? false : r.bool() || ![0, 90, 180, 270].includes(th)), v = Math.round((askRe ? rr * Math.cos(th * RAD) : rr * Math.sin(th * RAD)) * 1e9) / 1e9;
    return num(v, [`${askRe ? 'Real part a = r cos θ' : 'Imaginary part b = r sin θ'}.`, `${rr} × ${askRe ? 'cos' : 'sin'} ${th}° = ${neg(v)}.`], { q: `z = ${rr}(cos ${th}° + i sin ${th}°). What is the ${askRe ? 'real' : 'imaginary'} part of z?`, expr: `${rr}*Math.${askRe ? 'cos' : 'sin'}(${th}*Math.PI/180)` });
  }
  if (t === 2) {
    const k = r.int(1, 6), [a, b, th, mod] = r.pick([[k, k, 45, `${k === 1 ? '' : k}√2`], [-k, k, 135, `${k === 1 ? '' : k}√2`], [-k, -k, 225, `${k === 1 ? '' : k}√2`], [k, -k, 315, `${k === 1 ? '' : k}√2`], [0, k, 90, `${k}`], [-k, 0, 180, `${k}`], [0, -k, 270, `${k}`]]);
    const P = (m, d) => `${m}(cos ${d}° + i sin ${d}°)`, right = P(mod, th);
    return mc(r, right, [P(mod, (th + 180) % 360), P(mod, (360 - th) % 360 === th ? (th + 90) % 360 : (360 - th) % 360), P(`${2 * k}`, th)], { q: `Write ${cx(a, b)} in polar form.`, steps: [`r = √(${a * a} + ${b * b}) = ${mod}.`, `The point ${pt(a, b)} makes an angle of ${th}°: ${right}.`] });
  }
  const a = r.int(2, 6), n = r.int(2, 5), [eq, right] = r.pick([[`r = ${a}`, 'A circle centred at the origin'], [`θ = ${r.pick([30, 45, 60, 120])}°`, 'A line through the origin'], [`r = ${a} sin(${n}θ)`, `A rose with ${n % 2 ? n : 2 * n} petals`], [`r = ${a} + ${a} cos θ`, 'A cardioid']]);
  const opts = ['A circle centred at the origin', 'A line through the origin', `A rose with ${n % 2 ? n : 2 * n} petals`, 'A cardioid', `A rose with ${n % 2 ? 2 * n : n} petals`];
  return mc(r, right, opts.filter((x) => x !== right).slice(0, 3), { q: `What does the graph of the polar equation ${eq} look like?`, steps: [eq.startsWith('r = ' + a + ' sin') ? `r = a sin(nθ) is a rose: n petals if n is odd, 2n if n is even. Here n = ${n}.` : 'Think about what r and θ do as θ goes around.', `${right}.`] });
});

// ───────── 21. Two-dimensional vectors ─────────
skill('12-vec', 12, 'Two-dimensional vectors', 'Magnitude, direction and components', ['For v = ⟨a, b⟩: |v| = √(a² + b²) and the direction angle θ has tan θ = b/a.', 'From A to B: ⟨x₂ − x₁, y₂ − y₁⟩. From magnitude m and angle θ: ⟨m cos θ, m sin θ⟩.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const [p, q, h] = r.pick(TRIPLES), k = r.int(1, 2), s1 = r.bool() ? 1 : -1, s2 = r.bool() ? 1 : -1; return num(h * k, ['|v| = √(a² + b²).', `√(${(p * k) ** 2} + ${(q * k) ** 2}) = ${h * k}.`], { q: `Find the magnitude of v = ${vec(s1 * p * k, s2 * q * k)}.`, expr: `Math.hypot(${p * k},${q * k})` }); }
  if (t === 1) {
    const a = r.nonzero(-9, 9), b = r.nonzero(-9, 9), A = ((Math.atan2(b, a) / RAD) + 360) % 360, ans = Math.round(A);
    return num(ans, [`tan⁻¹(${Math.abs(b)}/${Math.abs(a)}) ≈ ${(Math.atan(Math.abs(b / a)) / RAD).toFixed(2)}°, and ⟨${neg(a)}, ${neg(b)}⟩ points into Quadrant ${a > 0 ? (b > 0 ? 'I' : 'IV') : b > 0 ? 'II' : 'III'}.`, `So θ ≈ ${A.toFixed(2)}°, about ${ans}°.`], { q: `Find the direction angle of ${vec(a, b)}, from 0° to 360°, to the nearest degree.`, tol: 0.51, expr: `((Math.atan2(${b},${a})*180/Math.PI)+360)%360` });
  }
  if (t === 2) {
    const x1 = r.int(-6, 6), y1 = r.int(-6, 6), x2 = r.int(-6, 6), y2 = r.int(-6, 6), right = vec(x2 - x1, y2 - y1);
    return mc(r, right, [vec(x1 - x2, y1 - y2), vec(x2 + x1, y2 + y1), vec(y2 - y1, x2 - x1)].filter((x) => x !== right).concat([vec(x2 - x1 + 1, y2 - y1)]), { q: `A vector starts at ${pt(x1, y1)} and ends at ${pt(x2, y2)}. What is its component form?`, steps: ['Subtract start from end: ⟨x₂ − x₁, y₂ − y₁⟩.', `⟨${neg(x2)} − ${par(x1)}, ${neg(y2)} − ${par(y1)}⟩ = ${right}.`] });
  }
  const m = r.int(3, 20), th = r.int(10, 350), xc = r.bool(), v = xc ? m * Math.cos(th * RAD) : m * Math.sin(th * RAD), ans = dec(v, 1);
  return num(ans, [`The ${xc ? 'x' : 'y'}-component is ${m} × ${xc ? 'cos' : 'sin'} ${th}°.`, `≈ ${fm(ans)}.`], { q: `A vector has magnitude ${m} and direction angle ${th}°. Find its ${xc ? 'x' : 'y'}-component, rounded to 1 decimal place.`, tol: 0.051, expr: `${m}*Math.${xc ? 'cos' : 'sin'}(${th}*Math.PI/180)` });
});
skill('12-vecops', 12, 'Two-dimensional vectors', 'Vector operations', ['Add vectors by adding components: ⟨a, b⟩ + ⟨c, d⟩ = ⟨a + c, b + d⟩. Tip-to-tail or parallelogram drawings give the same resultant.', 'k⟨a, b⟩ = ⟨ka, kb⟩, and its magnitude is |k| times as long.', 'A unit vector is v ÷ |v|.'], (r) => {
  const t = r.int(0, 4), a = r.int(-6, 6), b = r.int(-6, 6), c = r.int(-6, 6), d = r.int(-6, 6);
  if (t === 0) {
    const sub = r.bool(), right = vec(sub ? a - c : a + c, sub ? b - d : b + d);
    return mc(r, right, [vec(sub ? a + c : a - c, sub ? b + d : b - d), vec(sub ? a - c : a + c, sub ? b + d : b - d), vec(a * c, b * d)].filter((x) => x !== right).concat([vec((sub ? a - c : a + c) + 1, sub ? b - d : b + d)]), { q: `u = ${vec(a, b)} and v = ${vec(c, d)}. ${sub ? 'Find u − v.' : 'Using the triangle (tip-to-tail) method, what is the resultant u + v?'}`, steps: [`${sub ? 'Subtract' : 'Add'} matching components.`, `${right}.`] });
  }
  if (t === 1) {
    const p = r.nonzero(-3, 3), q = r.nonzero(-3, 3), right = vec(p * a + q * c, p * b + q * d);
    return mc(r, right, [vec(p * a - q * c, p * b - q * d), vec(p * a + q * c, p * b - q * d), vec((p + q) * a, (p + q) * b)].filter((x) => x !== right).concat([vec(p * a + q * c + 1, p * b + q * d)]), { q: `u = ${vec(a, b)} and v = ${vec(c, d)}. Find ${coef(p)}u ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}v.`, steps: [`${coef(p)}u = ${vec(p * a, p * b)} and ${coef(q)}v = ${vec(q * c, q * d)}.`, `Add: ${right}.`] });
  }
  if (t === 2) {
    const [p, q, h] = r.pick(TRIPLES), s1 = r.bool() ? 1 : -1, s2 = r.bool() ? 1 : -1, right = vec(frac(s1 * p, h), frac(s2 * q, h));
    return mc(r, right, [vec(frac(s2 * q, h), frac(s1 * p, h)), vec(frac(s1 * p, p + q), frac(s2 * q, p + q)), vec(frac(-s1 * p, h), frac(-s2 * q, h))], { q: `Find the unit vector in the direction of ${vec(s1 * p, s2 * q)}.`, steps: [`|v| = √(${p * p} + ${q * q}) = ${h}.`, `Divide each component by ${h}: ${right}.`] });
  }
  if (t === 3) {
    const [p, q, h] = r.pick(TRIPLES), k = r.nonzero(-4, 4);
    return num(Math.abs(k) * h, [`|${vec(p, q)}| = ${h}.`, `|${neg(k)}v| = ${Math.abs(k)} × ${h} = ${Math.abs(k) * h}.`], { q: `v = ${vec(p, q)}. What is the magnitude of ${neg(k)}v?`, expr: `Math.abs(${k})*Math.hypot(${p},${q})` });
  }
  const sx = a + c, sy = b + d, v = Math.hypot(sx, sy), ans = dec(v, 2);
  return num(ans, [`u + v = ${vec(sx, sy)}.`, `|u + v| = √(${sx * sx} + ${sy * sy}) ≈ ${ans}.`], { q: `u = ${vec(a, b)} and v = ${vec(c, d)}. Find |u + v|, rounded to 2 decimal places.`, tol: 0.006, expr: `Math.hypot(${a}+(${c}),${b}+(${d}))` });
});

// ───────── 22. Three-dimensional vectors ─────────
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [2, 10, 11, 15], [6, 6, 7, 11]];
skill('12-vec3', 12, 'Three-dimensional vectors', 'Vectors in three dimensions', ['|⟨a, b, c⟩| = √(a² + b² + c²).', 'Add, subtract and multiply by a scalar component by component, just like in 2-D.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0 || t === 4) {
    const [p, q, s, m] = r.pick(QUADS), sg = () => (r.bool() ? 1 : -1), P = [p * sg(), q * sg(), s * sg()];
    if (t === 0) return num(m, ['|v| = √(a² + b² + c²).', `√(${p * p} + ${q * q} + ${s * s}) = √${m * m} = ${m}.`], { q: `Find the magnitude of ${vec(...P)}.`, expr: `Math.hypot(${P.join(',')})` });
    const right = vec(...P.map((x) => frac(x, m)));
    return mc(r, right, [vec(...P.map((x) => frac(-x, m))), vec(...P.map((x) => frac(x, p + q + s))), vec(...[P[1], P[0], P[2]].map((x) => frac(x, m)))].filter((x) => x !== right).concat([vec(...P.map((x) => frac(x, m * m)))]), { q: `Find the unit vector in the direction of ${vec(...P)}.`, steps: [`|v| = ${m}.`, `Divide each component by ${m}: ${right}.`] });
  }
  const A = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)], B = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
  if (t === 1) {
    const right = vec(...B.map((x, i) => x - A[i]));
    return mc(r, right, [vec(...A.map((x, i) => x - B[i])), vec(...B.map((x, i) => x + A[i])), vec(B[0] - A[0], B[2] - A[2], B[1] - A[1])].filter((x) => x !== right).concat([vec(B[0] - A[0] + 1, B[1] - A[1], B[2] - A[2])]), { q: `A vector goes from ${'(' + A.map(neg).join(', ') + ')'} to ${'(' + B.map(neg).join(', ') + ')'}. What is its component form?`, steps: ['Subtract start from end for each coordinate.', `${right}.`] });
  }
  if (t === 2) {
    const sub = r.bool(), right = vec(...A.map((x, i) => (sub ? x - B[i] : x + B[i])));
    return mc(r, right, [vec(...A.map((x, i) => (sub ? x + B[i] : x - B[i]))), vec(...A.map((x, i) => x * B[i])), vec(...A.map((x, i) => (sub ? x - B[i] : x + B[i]) + (i === 2 ? 1 : 0)))].filter((x) => x !== right), { q: `u = ${vec(...A)} and v = ${vec(...B)}. Find u ${sub ? '−' : '+'} v.`, steps: [`${sub ? 'Subtract' : 'Add'} each pair of components.`, `${right}.`] });
  }
  const p = r.nonzero(-3, 3), q = r.nonzero(-3, 3), right = vec(...A.map((x, i) => p * x + q * B[i]));
  return mc(r, right, [vec(...A.map((x, i) => p * x - q * B[i])), vec(...A.map((x, i) => (p + q) * x)), vec(...A.map((x, i) => p * x + q * B[i] + (i === 0 ? 1 : 0)))].filter((x) => x !== right), { q: `u = ${vec(...A)} and v = ${vec(...B)}. Find ${coef(p)}u ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}v.`, steps: [`${coef(p)}u = ${vec(...A.map((x) => p * x))} and ${coef(q)}v = ${vec(...B.map((x) => q * x))}.`, `Add: ${right}.`] });
});

// ───────── 23. Sequences and series ─────────
skill('12-recur', 12, 'Sequences and series', 'Explicit and recursive formulas', ['Explicit: aₙ is given straight from n. Recursive: a first term plus a rule using the previous term.', 'Arithmetic: aₙ = aₙ₋₁ + d ↔ aₙ = a₁ + (n − 1)d. Geometric: aₙ = r·aₙ₋₁ ↔ aₙ = a₁·r^(n − 1).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const n = r.int(2, 9), [f, v] = r.pick([[`(−1)ⁿ × ${n + 1}`, (-1) ** n * (n + 1)], [`n² − ${n}`, n * n - n], [`2ⁿ − 1`, 2 ** n - 1], [`n(n + 1) ÷ 2`, n * (n + 1) / 2], [`3n − 7`, 3 * n - 7]]), shown = f.replace(/n/g, 'n');
    return num(v, [`Put n = ${n} into aₙ = ${shown}.`, `a${SUB[n]} = ${neg(v)}.`], { q: `aₙ = ${shown}. Find a${SUB[n]}.`, expr: `${v}` });
  }
  if (t === 1) {
    const a = r.int(1, 5), [rule, step] = r.pick([['aₙ = 2aₙ₋₁ + 1', (x) => 2 * x + 1], ['aₙ = 3aₙ₋₁ − 2', (x) => 3 * x - 2], ['aₙ = aₙ₋₁ + 4', (x) => x + 4], ['aₙ = (aₙ₋₁)² − 1', (x) => x * x - 1], ['aₙ = −2aₙ₋₁', (x) => -2 * x]]), terms = [a]; for (let i = 0; i < 3; i++) terms.push(step(terms.at(-1)));
    return num(terms[3], ['Apply the rule to each term in turn.', `The terms are ${terms.map(neg).join(', ')}, so a₄ = ${neg(terms[3])}.`], { q: `a₁ = ${a} and ${rule}. Find a₄.` });
  }
  if (t === 2) {
    const [f, right] = r.pick([['aₙ = 5n − 2', 'Explicit'], ['a₁ = 3, aₙ = aₙ₋₁ + 5', 'Recursive'], ['aₙ = 4(2)^(n − 1)', 'Explicit'], ['a₁ = 4, aₙ = 2aₙ₋₁', 'Recursive'], ['aₙ = n² + 1', 'Explicit'], ['a₁ = 1, aₙ = aₙ₋₁ + n', 'Recursive']]);
    return mc(r, right, ['Explicit', 'Recursive'], { q: `Is ${f} an explicit or a recursive formula?`, steps: ['A recursive formula uses the previous term aₙ₋₁; an explicit one uses only n.', `${right}.`] });
  }
  const a = r.int(-5, 9), d = r.nonzero(-5, 6), m = r.pick([2, 3, -2]), geo = r.bool();
  if (t === 3) {
    const right = geo ? `aₙ = ${neg(a || 1)}(${neg(m)})^(n − 1)` : `aₙ = ${poly([d, a - d], 'n')}`;
    const wrongs = geo ? [`aₙ = ${neg(m)}(${neg(a || 1)})^(n − 1)`, `aₙ = ${neg(a || 1)}(${neg(m)})^n`, `aₙ = ${poly([m, (a || 1) - m], 'n')}`] : [`aₙ = ${poly([d, a], 'n')}`, `aₙ = ${poly([a || 1, d], 'n')}`, `aₙ = ${neg(a)}(${neg(d)})^(n − 1)`];
    return mc(r, right, wrongs, { q: `Convert to an explicit formula: a₁ = ${neg(geo ? a || 1 : a)}, aₙ = ${geo ? `${neg(m)}aₙ₋₁` : `aₙ₋₁ ${sgn(d)}`}.`, steps: [geo ? `Geometric with a₁ = ${neg(a || 1)} and r = ${neg(m)}.` : `Arithmetic with a₁ = ${neg(a)} and d = ${neg(d)}: aₙ = ${neg(a)} + (n − 1)(${neg(d)}).`, `${right}.`] });
  }
  const right = geo ? `a₁ = ${neg(a || 1)}, aₙ = ${neg(m)}aₙ₋₁` : `a₁ = ${neg(a)}, aₙ = aₙ₋₁ ${sgn(d)}`;
  const wrongs = geo ? [`a₁ = ${neg(m)}, aₙ = ${neg(a || 1)}aₙ₋₁`, `a₁ = ${neg(a || 1)}, aₙ = aₙ₋₁ ${sgn(m)}`, `a₁ = ${neg((a || 1) * m)}, aₙ = ${neg(m)}aₙ₋₁`] : [`a₁ = ${neg(a - d)}, aₙ = aₙ₋₁ ${sgn(d)}`, `a₁ = ${neg(a)}, aₙ = aₙ₋₁ ${sgn(-d)}`, `a₁ = ${neg(a)}, aₙ = ${neg(d)}aₙ₋₁`];
  return mc(r, right, wrongs, { q: `Convert to a recursive formula: aₙ = ${geo ? `${neg(a || 1)}(${neg(m)})^(n − 1)` : poly([d, a - d], 'n')}.`, steps: [geo ? `a₁ = ${neg(a || 1)}, and each term is ${neg(m)} times the one before.` : `a₁ = ${neg(a)}, and each term adds ${neg(d)}.`, `${right}.`] });
});
skill('12-series', 12, 'Sequences and series', 'Sums of series', ['Arithmetic: Sₙ = n(a₁ + aₙ) ÷ 2. Geometric: Sₙ = a₁(rⁿ − 1) ÷ (r − 1).', 'An infinite geometric series converges to a₁ ÷ (1 − r) only when |r| < 1.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.int(1, 5), m = r.pick([2, 3, -2]), n = r.int(3, 7), S = a * (m ** n - 1) / (m - 1);
    return num(S, [`This is geometric with a₁ = ${a}, r = ${neg(m)}, n = ${n}.`, `S = ${a}(${par(m)}^${n} − 1) ÷ (${neg(m)} − 1) = ${neg(S)}.`], { q: `Find Σ (from k = 1 to ${n}) of ${a === 1 ? '' : a}(${neg(m)})^(k − 1).`, expr: Array.from({ length: n }, (_, i) => `${a}*(${m})**${i}`).join('+') });
  }
  if (t === 1) {
    const geo = r.bool(), a = r.int(1, 6), d = r.int(2, 5), terms = [0, 1, 2, 3].map((i) => (geo ? a * d ** i : a + i * d)), right = geo ? 'Geometric' : 'Arithmetic';
    return mc(r, right, ['Arithmetic', 'Geometric', 'Neither'], { q: `Is ${terms.join(' + ')} + … an arithmetic or a geometric series?`, steps: [geo ? `Each term is ${d} times the last.` : `Each term is ${d} more than the last.`, `${right}.`] });
  }
  if (t === 2) {
    const a = r.int(-5, 10), d = r.nonzero(-4, 6), n = r.int(4, 25), S = n * (2 * a + (n - 1) * d) / 2;
    return num(S, [`a₁ = ${neg(a)}, d = ${neg(d)}, so a${n < 10 ? SUB[n] : ''}${n >= 10 ? ' (term ' + n + ')' : ''} = ${neg(a + (n - 1) * d)}.`, `S${n < 10 ? SUB[n] : ''} = ${n}(${neg(a)} + ${par(a + (n - 1) * d)}) ÷ 2 = ${neg(S)}.`], { q: `Find the partial sum of the first ${n} terms of ${neg(a)} + ${par(a + d)} + ${par(a + 2 * d)} + …`, expr: Array.from({ length: n }, (_, i) => `(${a + i * d})`).join('+') });
  }
  if (t === 3) {
    const [a, p, q] = r.pick([[12, 1, 2], [27, 1, 3], [16, -1, 2], [9, 2, 3], [5, 3, 2], [4, -3, 2], [20, 1, 4], [8, 2, 1]]), conv = Math.abs(p) < q, right = conv ? `Converges to ${frac(a * q, q - p)}` : 'Diverges', rs = frac(p, q);
    const wrongs = conv ? ['Diverges', `Converges to ${frac(a * q, q + p)}`, `Converges to ${frac(a * q * 2, q - p)}`] : [`Converges to ${frac(a * q, q - p)}`, `Converges to ${a}`, `Converges to ${2 * a}`];
    return mc(r, right, wrongs, { q: `An infinite geometric series has first term ${a} and common ratio ${fm(rs)}. Does it converge, and if so, to what?`, steps: [`|r| = ${frac(Math.abs(p), q)} ${conv ? '< 1, so it converges' : '≥ 1, so it diverges'}.`, conv ? `S = ${a} ÷ (1 − ${p < 0 ? `(${fm(rs)})` : rs}) = ${frac(a * q, q - p)}: ${right}.` : `${right}.`] });
  }
  const a = r.int(0, 9); let b = r.int(1, 9); while (b === a) b = r.int(1, 9);
  const n = 10 * a + b - a, ans = frac(n, 90);
  return num(ans, [`Let x = 0.${a}${b}${b}${b}…; then 100x − 10x = ${a}${b} − ${a} = ${n}.`, `90x = ${n}, so x = ${n}/90 = ${ans}.`], { q: `Write 0.${a}${b}${b}${b}… (only the ${b} repeats) as a fraction in simplest form.`, exactForm: 'fraction', expr: `${n}/90` });
});

// ───────── 24. Logic ─────────
skill('12-logic', 12, 'Logic', 'Statements, conditionals and counterexamples', ['A conditional and its contrapositive always have the same truth value.', 'A counterexample makes the hypothesis true and the conclusion false.', 'A biconditional "p if and only if q" needs both directions to be true.'], (r) => {
  const t = r.int(0, 4), [p, q, np, nq] = r.pick(CONDS), stmt = `If ${p}, then ${q}.`;
  if (t === 0) {
    const right = `If ${nq}, then ${np}.`;
    return mc(r, right, [`If ${q}, then ${p}.`, `If ${np}, then ${nq}.`, `If ${p}, then ${nq}.`], { q: `"${stmt}" is true. Which statement must also be true?`, steps: ['The contrapositive (swap and negate both parts) always has the same truth value.', `"${right}"`] });
  }
  if (t === 1) { const [s, right, wr] = r.pick(NEGS); return mc(r, right, wr, { q: `Which statement is the negation of "${s}"?`, steps: ['The negation is true exactly when the original is false.', `"${right}"`] }); }
  if (t === 2) { const [s, tv] = r.pick(BICOND); return mc(r, tv ? 'True' : 'False', [tv ? 'False' : 'True'], { q: `True or false? "${s}"`, steps: ['Check both directions of the biconditional.', tv ? 'Both directions hold: true.' : 'One direction fails: false.'] }); }
  if (t === 3) { const [s, rights, wrongs] = r.pick(CEX), right = r.pick(rights); return mc(r, right, r.shuffle(wrongs).slice(0, 3), { q: `Which value shows that "${s}" is false?`, steps: ['Look for a value where the first part is true but the second part is false.', `${right} works, so it is a counterexample.`] }); }
  const hyp = r.bool(), right = hyp ? p : q;
  return mc(r, right, [hyp ? q : p, np, nq], { q: `What is the ${hyp ? 'hypothesis' : 'conclusion'} of "${stmt}"?`, steps: ['The hypothesis comes after "if"; the conclusion comes after "then".', `"${right}"`] });
});

// ───────── 25. Probability ─────────
skill('12-prob', 12, 'Probability', 'Conditional probability and the addition rule', ['P(A | B) = P(A and B) ÷ P(B).', 'P(A or B) = P(A) + P(B) − P(A and B).', 'Events are independent if one does not change the chance of the other.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const g = [[r.int(4, 25), r.int(4, 25)], [r.int(4, 25), r.int(4, 25)]], rows = ['Walks', 'Takes the bus'], cols = ['Grade 11', 'Grade 12'], rt = g.map((x) => x[0] + x[1]), ct = [g[0][0] + g[1][0], g[0][1] + g[1][1]], N = rt[0] + rt[1], i = r.int(0, 1), j = r.int(0, 1), byRow = r.bool();
    const nu = g[i][j], den = byRow ? rt[i] : ct[j];
    return num(frac(nu, den), [byRow ? `Only look at the "${rows[i]}" row: ${rt[i]} students.` : `Only look at the ${cols[j]} column: ${ct[j]} students.`, `P = ${nu}/${den} = ${frac(nu, den)}.`], { q: byRow ? `A student who ${rows[i].toLowerCase()} is picked at random. What is the probability they are in ${cols[j]}?` : `A ${cols[j]} student is picked at random. What is the probability they ${rows[i].toLowerCase()}?`, visual: { type: 'table', head: ['', ...cols, 'Total'], rows: [[rows[0], ...g[0], rt[0]], [rows[1], ...g[1], rt[1]], ['Total', ...ct, N]] }, expr: `${nu}/${den}` });
  }
  if (t === 1) {
    const [d, ind] = r.pick([['A die is rolled and a coin is flipped.', true], ['Two cards are drawn from a deck without putting the first back.', false], ['Two cards are drawn from a deck, putting the first back and shuffling.', true], ['Two students are picked from a class to be president and vice-president.', false], ['It rains in Halifax today, and a die rolled in Vancouver shows 6.', true]]);
    return mc(r, ind ? 'Independent' : 'Dependent', [ind ? 'Dependent' : 'Independent'], { q: `${d} Are the two events independent or dependent?`, steps: ['Ask: does the first result change the chances for the second?', ind ? 'No, so they are independent.' : 'Yes, so they are dependent.'] });
  }
  if (t === 2) {
    const [d, f] = r.pick([['a heart or a face card (J, Q, K)', 13 + 12 - 3], ['a king or a queen', 8], ['a red card or an ace', 26 + 4 - 2], ['a spade or a 7', 13 + 4 - 1], ['a club or a red card', 39]]);
    return num(frac(f, 52), ['P(A or B) = P(A) + P(B) − P(A and B): count each card only once.', `${f} cards work: P = ${f}/52 = ${frac(f, 52)}.`], { q: `One card is drawn from a standard 52-card deck. What is the probability it is ${d}?`, expr: `${f}/52` });
  }
  if (t === 3) {
    const m = r.int(3, 7), w = r.int(3, 7), k = r.int(2, 3), f = nCr(w, k), tot = nCr(m + w, k);
    return num(frac(f, tot), [`Ways to pick ${k} girls: ${w}C${k} = ${f}. Ways to pick any ${k}: ${m + w}C${k} = ${tot}.`, `P = ${f}/${tot} = ${frac(f, tot)}.`], { q: `A committee of ${k} is chosen at random from ${m} boys and ${w} girls. What is the probability that everyone chosen is a girl?`, expr: `${f}/${tot}` });
  }
  const pb = r.int(3, 9) / 10, pab = r.int(1, Math.round(pb * 10) - 1) / 10, v = pab / pb, ans = dec(v, 2);
  return num(ans, ['P(A | B) = P(A and B) ÷ P(B).', `${dec(pab)} ÷ ${dec(pb)} ≈ ${ans}.`], { q: `P(A and B) = ${dec(pab)} and P(B) = ${dec(pb)}. Find P(A | B), rounded to 2 decimal places.`, tol: 0.006, expr: `${pab}/${pb}` });
});

// ───────── 26. Probability distributions ─────────
skill('12-expected', 12, 'Probability distributions', 'Discrete distributions and expected value', ['The probabilities in a distribution add to 1.', 'Expected value E(X) = Σ x·P(x). Variance = Σ (x − E(X))²·P(x); the standard deviation is its square root.'], (r) => {
  const t = r.int(0, 4);
  if (t <= 2) {
    const xs = [0, 1, 2, 3]; let ps; do { const c = [r.int(1, 7), r.int(1, 7), r.int(1, 7)]; ps = [...c, 10 - c[0] - c[1] - c[2]]; } while (ps[3] < 1);
    const P = ps.map((x) => x / 10), E = xs.reduce((s, x, i) => s + x * P[i], 0), Var = xs.reduce((s, x, i) => s + (x - E) ** 2 * P[i], 0);
    if (t === 0) { const h = r.int(0, 3); return num(dec(P[h]), ['The probabilities add to 1.', `P(${h}) = 1 − ${P.filter((_, i) => i !== h).map((x) => dec(x)).join(' − ')} = ${dec(P[h])}.`], { q: `X is the number of goals a team scores. Find the missing probability.`, visual: { type: 'table', head: ['x', ...xs], rows: [['P(x)', ...P.map((x, i) => (i === h ? '?' : dec(x)))]] }, expr: `1-(${P.filter((_, i) => i !== h).join('+')})` }); }
    const tbl = { type: 'table', head: ['x', ...xs], rows: [['P(x)', ...P.map((x) => dec(x))]] };
    if (t === 1) return num(dec(E), ['E(X) = Σ x·P(x).', `${xs.map((x, i) => `${x}(${dec(P[i])})`).join(' + ')} = ${dec(E)}.`], { q: 'Find the expected value of X.', visual: tbl, expr: xs.map((x, i) => `${x}*${P[i]}`).join('+') });
    const sd = r.bool(), ans = sd ? dec(Math.sqrt(Var), 2) : dec(Var, 2);
    return num(ans, [`E(X) = ${dec(E)}. Variance = Σ (x − ${dec(E)})²·P(x) ≈ ${dec(Var, 4)}.`, sd ? `Standard deviation = √${dec(Var, 4)} ≈ ${ans}.` : `Variance ≈ ${ans}.`], { q: `Find the ${sd ? 'standard deviation' : 'variance'} of X, rounded to 2 decimal places.`, visual: tbl, tol: 0.006, expr: sd ? `Math.sqrt(${Var})` : `${Var}` });
  }
  if (t === 3) {
    if (r.bool()) {
      const W = r.int(1, 8) * 6, c = r.int(2, 9), E = W / 6 - c;
      return num(E, [`Win $${W} with probability 1/6, and the $${c} cost is always paid.`, `E = ${W} × 1/6 − ${c} = ${neg(E)} dollars.`], { q: `A game costs $${c} to play. You roll a die and win $${W} if it shows a 6. What is the expected net gain per game, in dollars?`, expr: `${W}/6-${c}` });
    }
    const a = r.int(2, 9) * 4, b = r.int(2, 9) * 3, Ea = a / 4, Eb = b / 3, right = Ea > Eb ? 'Game A' : Ea < Eb ? 'Game B' : 'They are equal';
    return mc(r, right, ['Game A', 'Game B', 'They are equal'], { q: `Game A pays $${a} with probability 1/4. Game B pays $${b} with probability 1/3. Both cost the same. Which is the better bet?`, steps: [`E(A) = ${a}/4 = $${Ea}. E(B) = ${b}/3 = $${Eb}.`, right === 'They are equal' ? 'They are equal.' : `${right} has the higher expected value.`] });
  }
  const [d, right] = r.pick([['the number of goals in a hockey game', 'Discrete'], ['the time it takes to run 100 m', 'Continuous'], ['the number of siblings a student has', 'Discrete'], ['the mass of a newborn baby', 'Continuous'], ['the number of cars in a parking lot', 'Discrete'], ['the temperature at noon in Ottawa', 'Continuous']]);
  return mc(r, right, ['Discrete', 'Continuous'], { q: `Is ${d} a discrete or a continuous random variable?`, steps: ['Counts are discrete; measurements that can take any value in a range are continuous.', `${right}.`] });
});
skill('12-binnorm', 12, 'Probability distributions', 'Binomial and normal distributions', ['Binomial: P(X = k) = nCk·pᵏ(1 − p)^(n − k); mean np, standard deviation √(np(1 − p)).', 'z = (x − μ) ÷ σ. Sample means have mean μ and standard deviation σ ÷ √n.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const n = r.int(3, 8), k = r.int(0, n);
    if (r.bool()) return num(frac(nCr(n, k), 2 ** n), [`P = ${n}C${k} × (1/2)^${n} = ${nCr(n, k)}/${2 ** n}.`, `= ${frac(nCr(n, k), 2 ** n)}.`], { q: `A fair coin is flipped ${n} times. What is the probability of exactly ${k} heads?`, expr: `${nCr(n, k)}/${2 ** n}` });
    const p = r.pick([0.1, 0.2, 0.3, 0.4]), v = nCr(n, k) * p ** k * (1 - p) ** (n - k), ans = dec(v, 4);
    return num(ans, [`P = ${n}C${k} × ${p}^${k} × ${dec(1 - p)}^${n - k}.`, `≈ ${ans}.`], { q: `A free throw goes in with probability ${p}. In ${n} independent shots, what is the probability of exactly ${k} basket${k === 1 ? "" : "s"}? Round to 4 decimal places.`, tol: 0.00006, expr: `${nCr(n, k)}*${p}**${k}*${1 - p}**${n - k}` });
  }
  if (t === 1) {
    const n = r.int(2, 20) * 10, p = r.pick([0.1, 0.2, 0.25, 0.3, 0.5, 0.6]), sd = r.bool(), v = sd ? Math.sqrt(n * p * (1 - p)) : n * p, ans = dec(v, 2);
    return num(ans, [sd ? `σ = √(np(1 − p)) = √(${n} × ${p} × ${dec(1 - p)}).` : 'μ = np.', `${sd ? '≈' : '='} ${ans}.`], { q: `X is binomial with n = ${n} and p = ${p}. Find the ${sd ? 'standard deviation, rounded to 2 decimal places' : 'mean'}.`, tol: 0.006, expr: sd ? `Math.sqrt(${n}*${p}*(1-${p}))` : `${n}*${p}` });
  }
  const [mu, sg, what, unit] = r.pick([[170, 8, 'heights of adults', 'cm'], [500, 100, 'test scores', 'points'], [75, 5, 'masses of apples', 'g'], [30, 4, 'commute times', 'minutes'], [64, 12, 'marks on an exam', '%']]);
  if (t === 2) {
    const z = r.int(-12, 12) / 4, x = mu + z * sg;
    return num(dec(z), ['z = (x − μ) ÷ σ.', `(${dec(x)} − ${mu}) ÷ ${sg} = ${fm(dec(z))}.`], { q: `The ${what} have mean ${mu} ${unit} and standard deviation ${sg} ${unit}. Find the z-score of ${dec(x)} ${unit}.`, expr: `(${x}-${mu})/${sg}` });
  }
  if (t === 3) {
    if (r.bool()) { const [reg, pct] = r.pick(NORMAL), val = (s) => s.replace(/μ ([+−]) (\d?)σ/g, (m, op, k) => String(op === '+' ? mu + (Number(k) || 1) * sg : mu - (Number(k) || 1) * sg)).replace(/μ/g, String(mu)); return num(pct, [`With μ = ${mu} and σ = ${sg}, the region is ${reg}.`, `By the 68–95–99.7 rule, about ${pct}%.`], { q: `The ${what} are normally distributed with mean ${mu} ${unit} and standard deviation ${sg} ${unit}. About what percent are ${val(reg)} ${unit}?` }); }
    const z = r.int(-8, 8) / 4, x = mu + z * sg;
    return num(dec(x), ['x = μ + zσ.', `${mu} + ${par(z)} × ${sg} = ${dec(x)}.`], { q: `The ${what} have mean ${mu} ${unit} and standard deviation ${sg} ${unit}. Which value has a z-score of ${fm(dec(z))}?`, expr: `${mu}+(${z})*${sg}` });
  }
  const n = r.pick([4, 9, 16, 25, 36, 64, 100]), mean = r.bool(0.3), v = mean ? mu : sg / Math.sqrt(n);
  return num(dec(v, 2), [mean ? 'The mean of the sample means equals the population mean.' : 'σ of the sample mean = σ ÷ √n.', mean ? `So it is ${mu}.` : `${sg} ÷ √${n} = ${sg} ÷ ${Math.sqrt(n)} = ${dec(v, 2)}.`], { q: `The ${what} have mean ${mu} ${unit} and standard deviation ${sg} ${unit}. Samples of ${n} are taken. What is the ${mean ? 'mean' : 'standard deviation'} of the sample means?`, tol: 0.006, expr: mean ? `${mu}` : `${sg}/Math.sqrt(${n})` });
});

// ───────── 27. Statistics ─────────
const SAMPLES = [['students at a school', 'Randomly choose 50 students from the full school list', ['Ask the first 50 students who arrive at the gym', 'Ask the members of the hockey team', 'Ask students who answer an online post']], ['shoppers at a mall', 'Survey every 20th shopper who enters, at different times of the week', ['Survey shoppers at one shoe store on Saturday', 'Survey your friends who shop there', 'Survey people who reply to a mall flyer']], ['residents of a city', 'Phone numbers chosen at random from all city households', ['People at a downtown coffee shop at 8 a.m.', 'Members of one community centre', 'People who write in to a radio show']]];
skill('12-stats', 12, 'Statistics', 'Samples, spread and outliers', ['A random sample gives everyone the same chance of being picked; other methods can be biased.', 'Standard deviation measures spread: σ = √(Σ(x − mean)² ÷ n).', 'An outlier lies more than 1.5 × IQR below Q1 or above Q3.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const [pop, right, wr] = r.pick(SAMPLES); return mc(r, right, wr, { q: `Which way of sampling ${pop} is least likely to be biased?`, steps: ['An unbiased sample gives every member of the population the same chance to be chosen.', `${right}.`] }); }
  if (t === 1) {
    const m = r.int(5, 30), d = [r.int(-6, 6), r.int(-6, 6), r.int(-6, 6), r.int(-6, 6)]; d.push(-d.reduce((s, x) => s + x, 0));
    const xs = d.map((x) => m + x), V = d.reduce((s, x) => s + x * x, 0) / 5, sd = r.bool(), ans = sd ? dec(Math.sqrt(V), 2) : dec(V, 2);
    return num(ans, [`Mean = ${m}. Squared distances from it: ${d.map((x) => x * x).join(', ')}; their mean is ${dec(V, 2)} (the variance).`, sd ? `σ = √${dec(V, 2)} ≈ ${ans}.` : `Variance = ${ans}.`], { q: `Find the population ${sd ? 'standard deviation' : 'variance'} of ${xs.join(', ')}. Round to 2 decimal places.`, tol: 0.006, expr: sd ? `Math.sqrt(${V})` : `${V}` });
  }
  const v = [r.int(10, 30)]; for (let i = 0; i < 5; i++) v.push(v.at(-1) + r.int(1, 3)); const IQR = v[5] - v[1], O = v[5] + Math.ceil(1.5 * IQR) + r.int(3, 15), data = r.shuffle([...v, O]);
  if (t === 2) return mc(r, String(O), [v[0], v[3], v[5]].map(String), { q: `Which value in this data set is an outlier? ${data.join(', ')}`, steps: [`Sorted: Q1 = ${v[1]}, Q3 = ${v[5]}, IQR = ${IQR}. Upper fence = ${v[5]} + 1.5 × ${IQR} = ${dec(v[5] + 1.5 * IQR)}.`, `${O} is above the fence, so ${O} is the outlier.`] });
  const mean1 = (v.reduce((s, x) => s + x, 0) + O) / 7, mean2 = v.reduce((s, x) => s + x, 0) / 6;
  return mc(r, 'The mean decreases', ['The mean increases', 'The mean stays the same'], { q: `${data.join(', ')}: the value ${O} is an outlier. What happens to the mean if it is removed?`, steps: [`With it the mean is about ${dec(mean1, 2)}; without it, ${dec(mean2, 2)}.`, `${O} is far above the rest, so the mean decreases.`] });
});
skill('12-regress', 12, 'Statistics', 'Correlation, regression and confidence intervals', ['r near 1: strong positive; near −1: strong negative; near 0: no linear relationship.', 'Use the regression line ŷ = mx + b to predict. The slope m is the change in ŷ for each 1-unit increase in x.', '95% confidence interval: estimate ± 1.96 × standard error.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) { const R = [['0.95', 'A strong positive linear relationship'], ['−0.93', 'A strong negative linear relationship'], ['0.35', 'A weak positive linear relationship'], ['−0.3', 'A weak negative linear relationship'], ['0.02', 'Almost no linear relationship']], [v, right] = r.pick(R); return mc(r, right, R.map((x) => x[1]).filter((x) => x !== right).slice(0, 3), { q: `A scatter plot has correlation coefficient r = ${v}. Which describes it best?`, steps: [`The sign gives the direction; the size (how close to 1) gives the strength.`, `r = ${v}: ${right.toLowerCase()}.`] }); }
  if (t === 1) {
    const m = r.int(5, 40) / 10, b = r.int(10, 60), x = r.int(1, 12), v = m * x + b;
    return num(dec(v), [`Put x = ${x} into ŷ = ${m}x + ${b}.`, `${m} × ${x} + ${b} = ${dec(v)}.`], { q: `The line of best fit for test score (ŷ) against hours studied (x) is ŷ = ${m}x + ${b}. Predict the score for ${x} hours of study.`, expr: `${m}*${x}+${b}` });
  }
  if (t === 2) {
    const m = r.int(5, 40) / 10, b = r.int(10, 60), right = `Each extra hour of study adds about ${m} points to the predicted score`;
    return mc(r, right, [`Each extra point adds about ${m} hours of study`, `A student who studies 0 hours is predicted to score ${m}`, `Each extra hour of study adds about ${b} points to the predicted score`], { q: `For ŷ = ${m}x + ${b} (ŷ = score, x = hours studied), what does the slope mean?`, steps: ['The slope is the change in ŷ for each 1-unit increase in x.', `${right}.`] });
  }
  if (t === 3) {
    const n = r.pick([25, 36, 49, 64, 100]), s = r.int(4, 20), xb = r.int(40, 200), up = r.bool(), e = 1.96 * s / Math.sqrt(n), v = up ? xb + e : xb - e, ans = dec(v, 2);
    return num(ans, [`Margin = 1.96 × ${s} ÷ √${n} = 1.96 × ${s} ÷ ${Math.sqrt(n)} ≈ ${dec(e, 3)}.`, `${xb} ${up ? '+' : '−'} ${dec(e, 3)} ≈ ${ans}.`], { q: `A sample of ${n} has mean ${xb}, and σ = ${s}. Find the ${up ? 'upper' : 'lower'} end of the 95% confidence interval for the population mean, rounded to 2 decimal places.`, tol: 0.006, expr: `${xb}${up ? '+' : '-'}1.96*${s}/Math.sqrt(${n})` });
  }
  const n = r.int(2, 10) * 100, k = r.int(Math.round(n * 0.2), Math.round(n * 0.8)), ph = k / n, e = 1.96 * Math.sqrt(ph * (1 - ph) / n), up = r.bool(), v = up ? ph + e : ph - e, ans = dec(v, 3);
  return num(ans, [`p̂ = ${k}/${n} = ${dec(ph, 4)}; margin = 1.96 × √(p̂(1 − p̂) ÷ ${n}) ≈ ${dec(e, 4)}.`, `${dec(ph, 4)} ${up ? '+' : '−'} ${dec(e, 4)} ≈ ${ans}.`], { q: `In a survey, ${k} of ${n} people said yes. Find the ${up ? 'upper' : 'lower'} end of the 95% confidence interval for the true proportion, rounded to 3 decimal places.`, tol: 0.0006, expr: `${ph}${up ? '+' : '-'}1.96*Math.sqrt(${ph}*(1-${ph})/${n})` });
});

// ───────── 28. Sets ─────────
skill('12-sets', 12, 'Sets', 'Sets, subsets, unions and intersections', ['A ∪ B (union) holds everything in A or B; A ∩ B (intersection) holds what is in both.', "The complement A′ is everything in the universal set that is not in A. A set with n elements has 2ⁿ subsets.", 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B).'], (r) => {
  const t = r.int(0, 4), set = (a) => `{${[...a].sort((x, y) => x - y).join(', ')}}`;
  if (t === 0) { const n = r.int(1, 6); return num(2 ** n, ['Each element is either in a subset or not: 2 choices each.', `2^${n} = ${2 ** n} subsets.`], { q: `How many subsets does a set with ${n} elements have (including the empty set and the set itself)?`, expr: `2**${n}` }); }
  if (t === 1) {
    const U = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), A = U.slice(0, r.int(3, 6)), B = U.slice(r.int(1, 3), r.int(5, 9)), uni = new Set([...A, ...B]), inter = A.filter((x) => B.includes(x)), un = r.bool();
    if (un) return num(uni.size, [`A ∪ B = ${set(uni)}.`, `It has ${uni.size} elements.`], { q: `A = ${set(A)} and B = ${set(B)}. How many elements are in A ∪ B?`, expr: `${uni.size}` });
    const right = inter.length ? set(inter) : '{ } (empty set)';
    return mc(r, right, [set(uni), set(A.filter((x) => !B.includes(x))), set(B.filter((x) => !A.includes(x)))].filter((x) => x !== right && x !== '{}'), { q: `A = ${set(A)} and B = ${set(B)}. What is A ∩ B?`, steps: ['A ∩ B holds the elements in both sets.', `A ∩ B = ${right}.`] });
  }
  if (t === 2) {
    const kind = r.pick([['even numbers', (x) => x % 2 === 0], ['odd numbers', (x) => x % 2 === 1], ['multiples of 3', (x) => x % 3 === 0], ['prime numbers', (x) => [2, 3, 5, 7].includes(x)]]), U = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], A = U.filter(kind[1]), comp = U.filter((x) => !kind[1](x)), right = set(comp);
    return mc(r, right, [set(A), set(comp.slice(1)), set([...comp, 10].filter((x, i, a) => a.indexOf(x) === i && !(kind[1](x) && x !== 10)))].filter((x) => x !== right), { q: `U = {1, 2, …, 10} and A is the set of ${kind[0]} in U. What is A′?`, steps: [`A = ${set(A)}.`, `A′ is everything in U not in A: ${right}.`] });
  }
  if (t === 3) {
    const lo = r.int(-5, 5), hi = lo + r.int(2, 8), s1 = r.bool(), s2 = r.bool(), a = s1 ? lo : lo + 1, b = s2 ? hi : hi - 1;
    return num(b - a + 1, [`The integers x with ${neg(lo)} ${s1 ? '≤' : '<'} x ${s2 ? '≤' : '<'} ${neg(hi)} run from ${neg(a)} to ${neg(b)}.`, `That is ${b - a + 1} elements.`], { q: `How many elements are in {x | x is an integer, ${neg(lo)} ${s1 ? '≤' : '<'} x ${s2 ? '≤' : '<'} ${neg(hi)}}?`, expr: `${b}-(${a})+1` });
  }
  const nA = r.int(10, 30), nB = r.int(10, 30), both = r.int(2, Math.min(nA, nB) - 1), v = nA + nB - both;
  return num(v, ['n(A ∪ B) = n(A) + n(B) − n(A ∩ B).', `${nA} + ${nB} − ${both} = ${v}.`], { q: `In a class, ${nA} students play soccer, ${nB} play basketball and ${both} play both. How many play at least one of the two?`, expr: `${nA}+${nB}-${both}` });
});

export default list;
