// Grade 9 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const M = (s) => String(s).replace(/-/g, '−');                         // show a minus sign
const F = (n, d) => M(frac(n, d));                                       // a fraction for showing
const PF = (n, d) => { const s = F(n, d); return s.startsWith('−') ? `(${s})` : s; };
const D = (x, k = 6) => M(dec(x, k));                                    // a tidy decimal for showing
const PD = (x) => (x < 0 ? `(${D(x)})` : D(x));
const rnd = (x, k = 1) => Math.round(x * 10 ** k) / 10 ** k;
const xy = (x, y) => `(${neg(x)}, ${neg(y)})`;
// a point typed as (x, y): order matters, so no `numbers`
const pt = (x, y, steps, extra = {}) => txt(xy(x, y), steps, { accept: [`${x}, ${y}`, `${x},${y}`, `(${x},${y})`], ...extra });
const pw = (b, e) => (e < 0 ? `${b}^(${neg(e)})` : `${b}^${e}`);
// a polynomial from [[coefficient, power], ...]
const poly = (ts, v = 'x') => {
  const t = ts.filter(([c]) => c !== 0); if (!t.length) return '0';
  return t.map(([c, p], i) => { const a = Math.abs(c), body = p === 0 ? String(a) : `${a === 1 ? '' : a}${v}${p === 1 ? '' : '^' + p}`; return i === 0 ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body; }).join('');
};
const lin = (m, b, v = 'x') => poly([[m, 1], [b, 0]], v);
// y = (p/q)x + b with a fraction slope
const linQ = (p, q, b) => { const [n, d] = simplify(p, q); if (d === 1) return lin(n, b); const s = `${n < 0 ? '−' : ''}(${Math.abs(n)}/${d})x`; return b === 0 ? s : `${s} ${sgn(b)}`; };
// a monomial c·x^p·y^q
const mono = (c, p, q = 0) => { const vars = `${p ? (p === 1 ? 'x' : `x^${p}`) : ''}${q ? (q === 1 ? 'y' : `y^${q}`) : ''}`; const co = vars && c === 1 ? '' : vars && c === -1 ? '−' : neg(c); return co + vars; };
// powers of a variable, with positive exponents only
const vpow = (v, k) => (k === 0 ? '1' : k === 1 ? v : k < 0 ? `1/${v}${k === -1 ? '' : '^' + -k}` : `${v}^${k}`);
const ord = (n) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
// answers made with π: we say "use 3.14", and also accept the answer made with the π key
const piAns = (v314, vTrue) => ({ answer: dec(rnd(v314 + 1e-7, 1)), tol: Math.abs(vTrue - v314) + 0.06 });
const money = (x) => `$${x.toFixed(2)}`;

// ───────────── Numbers ─────────────
const SETS = ['natural numbers', 'whole numbers', 'integers', 'rational numbers', 'irrational numbers'];
skill('9-classify', 9, 'Numbers', 'Classify real numbers', ['Natural numbers are 1, 2, 3, …. Whole numbers add 0. Integers add the negatives.', 'A rational number can be written as a fraction of two integers: its decimal stops or repeats.', 'An irrational number, like √2 or π, has a decimal that never stops and never repeats.'], (r) => {
  const nonSq = () => { let n; do n = r.int(2, 99); while (Number.isInteger(Math.sqrt(n))); return n; };
  const k = r.int(2, 12), n = nonSq(), d1 = r.int(1, 9), d2 = r.int(1, 9), a = r.int(1, 9), b = r.int(11, 19);
  const RAT = [[`${a}/${b}`, `${a}/${b} is a fraction of two integers, and it is not a whole number`], [`0.${d1}${d2}${d1}${d2}${d1}${d2}…`, `its decimal repeats the block ${d1}${d2} forever, so it is rational`], [`−${r.int(1, 20)}.${r.int(1, 9)}${r.int(1, 9)}`, 'its decimal stops, so it is a fraction over 100, but it is not an integer'], [`√(${a * a}/${b * b})`, `√(${a * a}/${b * b}) = ${a}/${b}, a fraction of two integers`]];
  const IRR = [[`√${n}`, `${n} is not a perfect square, so the decimal of √${n} never stops or repeats`], ['π', 'the decimal of π never stops or repeats'], ['0.1010010001…', 'it has more and more zeros each time, so it never repeats'], [`${a} + √${n}`, `√${n} is irrational, and adding ${a} keeps it irrational`]];
  if (r.bool(0.35)) {
    const isRat = r.bool(), [show, why] = r.pick(isRat ? RAT : IRR), right = isRat ? 'rational' : 'irrational';
    return mc(r, right, [isRat ? 'irrational' : 'rational'], { q: `Is ${show} rational or irrational?`, steps: [`Check: ${why}.`, `So ${show} is ${right}.`] });
  }
  const kind = r.int(0, 4);
  const [show, why] = kind === 0 ? r.pick([[String(r.int(1, 99)), 'it is a counting number'], [`√${k * k}`, `√${k * k} = ${k}, a counting number`], [`${a * b}/${b}`, `${a * b}/${b} = ${a}, a counting number`]])
    : kind === 1 ? r.pick([['0', 'it is 0, which is whole but not a counting number'], [`${a} − ${a}`, `${a} − ${a} = 0, which is whole but not a counting number`]])
      : kind === 2 ? r.pick([[`−${r.int(1, 60)}`, 'it is a negative whole number, an integer'], [`−√${k * k}`, `−√${k * k} = −${k}, an integer`]])
        : r.pick(kind === 3 ? RAT : IRR);
  const right = SETS[kind];
  return mc(r, right, r.shuffle(SETS.filter((s) => s !== right)).slice(0, 3), { q: `What is the smallest set of numbers that ${show} belongs to?`, steps: [`Check: ${why}.`, `So the smallest set is the ${right}.`] });
});

skill('9-ratorder', 9, 'Numbers', 'Compare, order and convert rational numbers', ['Write rational numbers as decimals to compare them.', 'On a number line, the number further to the right is greater: −0.5 > −0.75.', 'A decimal that stops can be written over 10, 100 or 1000, then simplified.'], (r) => {
  const one = () => {
    if (r.bool(0.6)) { const d = r.pick([2, 3, 4, 5, 6, 8]); let n; do n = r.nonzero(-3 * d, 3 * d); while (n % d === 0); return [F(n, d), n / d]; }
    const x = r.nonzero(-300, 300) / 100; return [D(x), x];
  };
  const asDec = ([s, x]) => (s === D(x) ? s : `${s} ${rnd(x, 3) === x ? '=' : '≈'} ${D(rnd(x, 3))}`);
  const v = r.int(0, 2);
  if (v === 0) {
    let A = one(), B = one();
    if (r.bool(0.15)) { const d = r.pick([2, 4, 5, 8]); let n; do n = r.nonzero(-2 * d, 2 * d); while (n % d === 0); A = [F(n, d), n / d]; B = [D(n / d), n / d]; }
    else while (B[1] === A[1]) B = one();
    const sign = A[1] > B[1] ? '>' : A[1] < B[1] ? '<' : '=';
    return mc(r, sign, ['<', '>', '='].filter((x) => x !== sign), { q: `Which sign makes this true?  ${A[0]} ? ${B[0]}`, steps: [`As decimals: ${asDec(A)} and ${asDec(B)}.`, sign === '=' ? 'They are the same number.' : `${A[1] > B[1] ? A[0] : B[0]} is further right on a number line.`, `So ${A[0]} ${sign} ${B[0]}.`] });
  }
  if (v === 1) {
    const vals = [one()]; while (vals.length < 3) { const c = one(); if (!vals.some((x) => x[1] === c[1])) vals.push(c); }
    const s = [...vals].sort((p, q) => p[1] - q[1]).map((x) => x[0]);
    const right = s.join(', ');
    return mc(r, right, [[...s].reverse().join(', '), [s[1], s[0], s[2]].join(', '), [s[0], s[2], s[1]].join(', ')], { q: `Put these in order from least to greatest: ${r.shuffle(vals.map((x) => x[0])).join(', ')}`, steps: [`As decimals: ${vals.map(asDec).join('; ')}.`, 'Negative numbers come first; the most negative is the least.', `Order: ${right}.`] });
  }
  if (r.bool()) {   // decimal → fraction
    const d = r.pick([4, 5, 8, 20, 25, 40]); let n; do n = r.int(1, d - 1); while (gcd(n, d) !== 1); const s = r.bool(0.3) ? -1 : 1;
    const x = s * n / d, places = String(dec(Math.abs(x))).split('.')[1].length, p10 = 10 ** places, top = Math.round(n / d * p10);
    return num(frac(s * n, d), [`${D(x)} has ${places} decimal place${places > 1 ? 's' : ''}, so write it over ${p10}: ${M(s * top)}/${p10}.`, `Divide the top and bottom by ${gcd(top, p10)}.`, `So ${D(x)} = ${F(s * n, d)}.`], { q: `Write ${D(x)} as a fraction in simplest form.`, exactForm: 'fraction', expr: `${s * n}/${d}` });
  }
  if (r.bool()) {   // repeating decimal → fraction
    let n; do n = r.int(1, 8); while (n === 3 || n === 6);
    return num(frac(n, 9), ['A single digit that repeats forever is that digit over 9.', `0.${n}${n}${n}… = ${n}/9.`, `So the fraction is ${F(n, 9)}.`], { q: `Write 0.${n}${n}${n}… (the ${n} repeats forever) as a fraction in simplest form.`, exactForm: 'fraction', expr: `${n}/9` });
  }
  const d = r.pick([4, 5, 8, 16, 20, 25]); let n; do n = r.int(1, 2 * d); while (gcd(n, d) !== 1);
  return num(dec(n / d), ['A fraction means top ÷ bottom.', `${n} ÷ ${d} = ${dec(n / d)}.`, `So ${n}/${d} = ${dec(n / d)}.`], { q: `Write ${n}/${d} as a decimal.`, expr: `${n}/${d}` });
});

skill('9-sqrt', 9, 'Numbers', 'Square roots', ['√49 = 7 because 7 × 7 = 49.', 'For a fraction, take the root of the top and of the bottom: √(9/25) = 3/5.', 'If a number is not a perfect square, its root is between the roots of the perfect squares on either side.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const k = r.int(2, 25), minus = r.bool(0.25);
    return num(minus ? -k : k, [`${k} × ${k} = ${k * k}, so √${k * k} = ${k}.`, `So ${minus ? '−' : ''}√${k * k} = ${neg(minus ? -k : k)}.`], { q: `Find ${minus ? '−' : ''}√${k * k}.`, expr: `${minus ? '-' : ''}Math.sqrt(${k * k})` });
  }
  if (v === 1) {
    const b = r.int(2, 12); let a; do a = r.int(1, 11); while (gcd(a, b) !== 1 || a === b);
    return num(frac(a, b), [`Take the root of the top: √${a * a} = ${a}.`, `Take the root of the bottom: √${b * b} = ${b}.`, `So √(${a * a}/${b * b}) = ${a}/${b}.`], { q: `Find √(${a * a}/${b * b}).`, expr: `Math.sqrt(${a * a}/${b * b})` });
  }
  if (v === 2) {
    let k; do k = r.int(2, 15); while (k % 10 === 0);
    const sq = dec(k * k / 100), ans = dec(k / 10);
    return num(ans, [`Think of ${k} × ${k} = ${k * k}.`, `${ans} × ${ans} = ${sq}, so √${sq} = ${ans}.`, `So the answer is ${ans}.`], { q: `Find √${sq}.`, expr: `Math.sqrt(${sq})` });
  }
  let n; do n = r.int(5, 400); while (Number.isInteger(Math.sqrt(n)));
  const lo = Math.floor(Math.sqrt(n)), right = `between ${lo} and ${lo + 1}`;
  return mc(r, right, [`between ${lo - 1} and ${lo}`, `between ${lo + 1} and ${lo + 2}`, `between ${lo + 2} and ${lo + 3}`], { q: `√${n} is between which two whole numbers?`, steps: [`${lo}^2 = ${lo * lo} and ${lo + 1}^2 = ${(lo + 1) ** 2}.`, `${n} is between ${lo * lo} and ${(lo + 1) ** 2}.`, `So √${n} is ${right}.`] });
});

// ───────────── Operations ─────────────
skill('9-intops', 9, 'Operations', 'Integer expressions', ['Follow the order of operations: brackets, exponents, × and ÷, then + and −.', 'Same signs multiply to a positive; different signs give a negative.', 'To evaluate, put each value in brackets where its letter was.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.nonzero(-20, 20), b = r.nonzero(-9, 9), c = r.nonzero(-9, 9), ans = a + b * c;
    return num(ans, [`Multiply first: ${par(b)} × ${par(c)} = ${neg(b * c)}.`, `Then add: ${neg(a)} + ${par(b * c)} = ${neg(ans)}.`, `So the answer is ${neg(ans)}.`], { q: `Evaluate: ${neg(a)} + ${par(b)} × ${par(c)}`, expr: `${a}+(${b})*(${c})` });
  }
  if (v === 1) {
    const c = r.nonzero(-6, 6), q = r.nonzero(-9, 9), b = r.int(-15, 15), a = c * q + b;
    return num(q, [`Brackets first: ${neg(a)} − ${par(b)} = ${neg(a - b)}.`, `Then divide: ${neg(a - b)} ÷ ${par(c)} = ${neg(q)}.`, `So the answer is ${neg(q)}.`], { q: `Evaluate: (${neg(a)} − ${par(b)}) ÷ ${par(c)}`, expr: `(${a}-(${b}))/(${c})` });
  }
  if (v === 2) {
    const a = r.nonzero(-6, 6), b = r.nonzero(-12, 12), c = r.int(2, 4), ans = a * a - b * c;
    return num(ans, [`Exponent first: ${par(a)}^2 = ${a * a}.`, `Then multiply: ${par(b)} × ${c} = ${neg(b * c)}.`, `${a * a} − ${par(b * c)} = ${neg(ans)}.`, `So the answer is ${neg(ans)}.`], { q: `Evaluate: ${par(a)}^2 − ${par(b)} × ${c}`, expr: `(${a})**2-(${b})*${c}` });
  }
  const x = r.nonzero(-6, 6), y = r.nonzero(-6, 6), p = r.int(2, 6), q = r.pick([-5, -4, -3, -2, 2, 3, 4, 5]), ans = p * x + q * y;
  return num(ans, [`Put in the values: ${p}${par(x)} ${q < 0 ? '−' : '+'} ${Math.abs(q)}${par(y)}.`, `= ${neg(p * x)} ${sgn(q * y)}.`, `= ${neg(ans)}. So the answer is ${neg(ans)}.`], { q: `Evaluate ${p}x ${q < 0 ? '−' : '+'} ${Math.abs(q)}y when x = ${neg(x)} and y = ${neg(y)}.`, expr: `${p}*(${x})+(${q})*(${y})` });
});

const fr = (r, dens = [2, 3, 4, 5, 6, 8, 10]) => { const d = r.pick(dens); let n; do n = r.nonzero(-2 * d, 2 * d); while (gcd(n, d) !== 1 || n % d === 0); return [n, d]; };
skill('9-ratadd', 9, 'Operations', 'Add and subtract rational numbers', ['To add fractions, use a common denominator, then add the tops.', 'Subtracting a negative is the same as adding a positive.', 'The distance between two numbers on a number line is the bigger one minus the smaller one.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [n1, d1] = fr(r), [n2, d2] = fr(r), plus = r.bool(), L = lcm(d1, d2);
    const a1 = n1 * L / d1, a2 = n2 * L / d2, res = plus ? a1 + a2 : a1 - a2;
    return num(frac(res, L), [`Use the common denominator ${L}: ${M(a1)}/${L} ${plus ? '+' : '−'} ${a2 < 0 ? `(${M(a2)}/${L})` : `${a2}/${L}`}.`, `Combine the tops: ${neg(a1)} ${plus ? '+' : '−'} ${par(a2)} = ${neg(res)}, so ${M(res)}/${L}.`, `Simplify: ${F(res, L)}. So the answer is ${F(res, L)}.`], { q: `${F(n1, d1)} ${plus ? '+' : '−'} ${PF(n2, d2)} = ?`, expr: `${n1}/${d1}${plus ? '+' : '-'}(${n2}/${d2})` });
  }
  if (v === 1) {
    const a = r.nonzero(-200, 200) / 10, b = r.nonzero(-900, 900) / 100, plus = r.bool(), ans = plus ? a + b : a - b;
    return num(dec(ans), [`${plus ? 'Add' : 'Subtract'} ${PD(b)}${!plus && b < 0 ? ', which is the same as adding ' + D(-b) : ''}.`, `${D(a)} ${plus ? '+' : '−'} ${PD(b)} = ${D(ans)}.`, `So the answer is ${D(ans)}.`], { q: `${D(a)} ${plus ? '+' : '−'} ${PD(b)} = ?`, expr: `${a}${plus ? '+' : '-'}(${b})` });
  }
  if (v === 2) {
    const a = r.int(-30, 30) / 4; let b; do b = r.int(-30, 30) / 4; while (b === a);
    const hi = Math.max(a, b), lo = Math.min(a, b), ans = hi - lo;
    return num(dec(ans), ['The distance is the greater number minus the smaller one.', `${D(hi)} − ${PD(lo)} = ${D(ans)}.`, `So they are ${D(ans)} units apart.`], { q: `How far apart are ${D(a)} and ${D(b)} on a number line?`, expr: `Math.abs(${a}-(${b}))` });
  }
  const t0 = r.int(-150, 50) / 10, ch = r.int(5, 120) / 10, up = r.bool(), ans = up ? t0 + ch : t0 - ch, nm = r.pick(NAMES);
  return num(dec(ans), [`${up ? 'A rise means add' : 'A drop means subtract'}: ${D(t0)} ${up ? '+' : '−'} ${D(ch)}.`, `= ${D(ans)}.`, `The temperature is ${D(ans)} °C.`], { q: `At 6 a.m. ${nm}'s thermometer reads ${D(t0)} °C. By noon the temperature has ${up ? 'risen' : 'dropped'} by ${D(ch)} °C. What is the temperature at noon?`, unit: '°C', expr: `${t0}${up ? '+' : '-'}${ch}` });
});

skill('9-ratmul', 9, 'Operations', 'Multiply and divide rational numbers', ['To multiply fractions, multiply the tops and multiply the bottoms.', 'To divide by a fraction, multiply by its reciprocal (flip it).', 'Count the negative signs: an even number gives a positive answer, an odd number gives a negative one.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0 || v === 1) {
    const [n1, d1] = fr(r, [2, 3, 4, 5, 6, 7, 8, 9]), [n2, d2] = fr(r, [2, 3, 4, 5, 6, 7, 8, 9]);
    if (v === 0) return num(frac(n1 * n2, d1 * d2), [`Multiply the tops: ${par(n1)} × ${par(n2)} = ${neg(n1 * n2)}.`, `Multiply the bottoms: ${d1} × ${d2} = ${d1 * d2}.`, `${M(n1 * n2)}/${d1 * d2} simplifies to ${F(n1 * n2, d1 * d2)}. So the answer is ${F(n1 * n2, d1 * d2)}.`], { q: `${F(n1, d1)} × ${PF(n2, d2)} = ?`, expr: `(${n1}/${d1})*(${n2}/${d2})` });
    return num(frac(n1 * d2, d1 * n2), [`Flip the second fraction: ÷ ${PF(n2, d2)} becomes × ${PF(d2, n2)}.`, `${F(n1, d1)} × ${PF(d2, n2)} = ${M(n1 * d2)}/${M(d1 * n2)}.`, `Simplify: ${F(n1 * d2, d1 * n2)}. So the answer is ${F(n1 * d2, d1 * n2)}.`], { q: `${F(n1, d1)} ÷ ${PF(n2, d2)} = ?`, expr: `(${n1}/${d1})/(${n2}/${d2})` });
  }
  if (v === 2) {
    const q = r.nonzero(-90, 90) / 10, b = r.pick([0.2, 0.4, 0.5, -0.5, 1.5, -2.5, 0.25, -0.8]), a = rnd(q * b, 4);
    if (r.bool()) return num(dec(a), ['Multiply as if there were no signs or decimal points, then place the point.', `An ${(q < 0) !== (b < 0) ? 'odd number of negatives gives a negative' : 'even number of negatives gives a positive'}: ${D(q)} × ${PD(b)} = ${D(a)}.`, `So the answer is ${D(a)}.`], { q: `${D(q)} × ${PD(b)} = ?`, expr: `(${q})*(${b})` });
    return num(dec(q), [`Think: what times ${PD(b)} makes ${D(a)}?`, `${PD(q)} × ${PD(b)} = ${D(a)}, so ${D(a)} ÷ ${PD(b)} = ${D(q)}.`, `So the answer is ${D(q)}.`], { q: `${D(a)} ÷ ${PD(b)} = ?`, expr: `(${a})/(${b})` });
  }
  if (v === 3) {
    const [n1, d1] = fr(r, [2, 3, 4, 5]), [n2, d2] = fr(r, [2, 3, 4, 6]), k = r.int(2, 4);
    const ans = frac(k * n1 * d2 - n2 * d1, d1 * d2);
    return num(ans, [`Put in the values: ${k} × ${PF(n1, d1)} − ${PF(n2, d2)}.`, `${k} × ${PF(n1, d1)} = ${F(k * n1, d1)}.`, `${F(k * n1, d1)} − ${PF(n2, d2)} = ${M(ans)}. So the answer is ${M(ans)}.`], { q: `Evaluate ${k}x − y when x = ${F(n1, d1)} and y = ${F(n2, d2)}.`, expr: `${k}*(${n1}/${d1})-(${n2}/${d2})` });
  }
  const rate = r.pick([1.2, 1.5, 2.4, 0.8, 3.5, 0.6]), t = r.pick([2, 3, 4, 5, 2.5, 1.5]), ans = rnd(-rate * t, 4);
  return num(dec(ans), [`Going down is negative: each minute the change is −${D(rate)} m.`, `−${D(rate)} × ${D(t)} = ${D(ans)}.`, `The change in depth is ${D(ans)} m.`], { q: `A diver goes down ${D(rate)} m every minute. What is the change in depth after ${D(t)} minutes? (Going down is negative.)`, unit: 'm', expr: `-${rate}*${t}` });
});

// ───────────── Ratios, rates and proportions ─────────────
skill('9-ratio', 9, 'Ratios, rates and proportions', 'Equivalent ratios and unit rates', ['Equivalent ratios come from multiplying or dividing both parts by the same number.', 'A unit rate tells how much for one: divide the amount by the number of units.', 'The better buy has the lower price for one unit.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    let a = r.int(1, 9), b = r.int(2, 12); while (a === b) b++;
    const k = r.int(2, 9);
    return num(a * k, [`${b} × ${k} = ${b * k}, so multiply the first part by ${k} too.`, `${a} × ${k} = ${a * k}.`, `So ${a}:${b} = ${a * k}:${b * k}. The missing number is ${a * k}.`], { q: `Find the missing number: ${a}:${b} = ?:${b * k}`, expr: `${a}*${b * k}/${b}` });
  }
  if (v === 1) {
    let a = r.int(1, 9), b = r.int(2, 12); while (gcd(a, b) !== 1 || a === b) { a = r.int(1, 9); b = r.int(2, 12); }
    const k = r.int(2, 6), right = `${a * k}:${b * k}`;
    return mc(r, right, [`${a * k}:${b * k + 1}`, `${b * k}:${a * k}`, `${a + k}:${b + k}`], { q: `Which ratio is equivalent to ${a}:${b}?`, steps: ['Multiply both parts by the same number.', `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}.`, `So ${right} is equivalent.`] });
  }
  if (v === 2) {
    const [what, unit, per, lo, hi] = r.pick([['drives', 'km', 'hour', 40, 110], ['types', 'words', 'minute', 25, 70], ['earns', 'dollars', 'hour', 15, 30], ['reads', 'pages', 'day', 12, 40]]);
    const rate = r.int(lo, hi), t = r.int(2, 8), nm = r.pick(NAMES);
    return num(rate, ['Unit rate = amount ÷ time.', `${rate * t} ÷ ${t} = ${rate}.`, `That is ${rate} ${unit} per ${per}.`], { q: `${nm} ${what} ${rate * t} ${unit} in ${t} ${per}s. How many ${unit} is that per ${per}?`, expr: `${rate * t}/${t}` });
  }
  const [item, many] = r.pick([['granola bar', 'granola bars'], ['juice box', 'juice boxes'], ['pencil', 'pencils'], ['muffin', 'muffins']]);
  const c1 = r.int(9, 80) * 5, n1 = r.int(3, 12), n2 = n1 + r.int(2, 8); let c2 = r.int(9, 80) * 5; while (c2 === c1) c2 = r.int(9, 80) * 5;
  if (r.bool()) return num(dec(c1 / 100), ['Price for one = total ÷ number of items.', `${money(c1 * n1 / 100)} ÷ ${n1} = ${money(c1 / 100)}.`, `So one ${item} costs ${money(c1 / 100)}.`], { q: `A pack of ${n1} ${many} costs ${money(c1 * n1 / 100)}. What is the price of one ${item}?`, unit: '$', expr: `${c1 * n1 / 100}/${n1}` });
  const right = c1 < c2 ? `${n1} for ${money(c1 * n1 / 100)}` : `${n2} for ${money(c2 * n2 / 100)}`, other = c1 < c2 ? `${n2} for ${money(c2 * n2 / 100)}` : `${n1} for ${money(c1 * n1 / 100)}`;
  return mc(r, right, [other], { q: `Which is the better buy for ${many}: ${n1} for ${money(c1 * n1 / 100)} or ${n2} for ${money(c2 * n2 / 100)}?`, steps: [`One from the first pack: ${money(c1 * n1 / 100)} ÷ ${n1} = ${money(c1 / 100)}.`, `One from the second pack: ${money(c2 * n2 / 100)} ÷ ${n2} = ${money(c2 / 100)}.`, `The lower price for one is the better buy: ${right}.`] });
});

skill('9-proportion', 9, 'Ratios, rates and proportions', 'Proportions and scale drawings', ['A proportion says two ratios are equal, like x/6 = 10/15.', 'Cross-multiply, then divide to find the unknown.', 'On a scale drawing, multiply the drawing length by the scale to get the real length.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    let b = r.int(1, 12), c = r.int(2, 12); while (b === c) c = r.int(2, 12);
    const k = r.int(2, 6), a = c * k, x = b * k;
    if (r.bool()) return num(x, [`Cross-multiply: ${c} × x = ${a} × ${b}.`, `${c}x = ${a * b}, so x = ${a * b} ÷ ${c}.`, `x = ${x}.`], { q: `Solve: x/${a} = ${b}/${c}`, unit: 'x =', expr: `${a}*${b}/${c}` });
    return num(c * k, [`Cross-multiply: ${b} × x = ${c} × ${x}.`, `${b}x = ${c * x}, so x = ${c * x} ÷ ${b}.`, `x = ${c * k}.`], { q: `Solve: ${b}/${c} = ${x}/x`, unit: 'x =', expr: `${c}*${x}/${b}` });
  }
  if (v === 1) {
    const cups = r.int(2, 5), per = r.pick([6, 8, 9, 10, 12]), want = r.int(2, 9), nm = r.pick(NAMES);
    return num(want, [`Set up a proportion: ${cups}/${per * cups} = x/${per * want}.`, `Each cup makes ${per * cups} ÷ ${cups} = ${per} cookies, so x = ${per * want} ÷ ${per}.`, `x = ${want}. ${nm} needs ${want} cups.`], { q: `${nm}'s recipe uses ${cups} cups of flour for ${per * cups} cookies. How many cups are needed for ${per * want} cookies?`, unit: 'cups', expr: `${cups}*${per * want}/${per * cups}` });
  }
  const [s, u] = r.pick([[2, 'm'], [5, 'm'], [10, 'm'], [20, 'm'], [50, 'km'], [25, 'km']]), L = r.int(3, 30) / 2;
  const what = u === 'km' ? 'map' : 'floor plan';
  if (r.bool()) return num(dec(L * s), [`Each 1 cm on the ${what} is ${s} ${u} for real.`, `${D(L)} × ${s} = ${D(L * s)}.`, `So the real length is ${D(L * s)} ${u}.`], { q: `A ${what} uses the scale 1 cm : ${s} ${u}. A length on it measures ${D(L)} cm. What is the real length in ${u}?`, unit: u, expr: `${L}*${s}` });
  return num(dec(L), [`Each ${s} ${u} for real is 1 cm on the ${what}.`, `${D(L * s)} ÷ ${s} = ${D(L)}.`, `So it is ${D(L)} cm on the ${what}.`], { q: `A ${what} uses the scale 1 cm : ${s} ${u}. A real distance is ${D(L * s)} ${u}. How long is it on the ${what}, in cm?`, unit: 'cm', expr: `${L * s}/${s}` });
});

// ───────────── Percents ─────────────
skill('9-percent', 9, 'Percents', 'Percents, fractions and decimals', ['Percent means "out of 100": 35% = 35/100 = 0.35.', 'To find a percent of a number, change the percent to a decimal and multiply.', 'A discount is taken off the price; tax (like 13% HST) is added on.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = r.int(0, 3);
    if (t === 0) { const p = r.pick([r.int(1, 99), r.int(101, 250), r.int(1, 99) + 0.5]); return num(dec(p / 100), ['Percent means out of 100, so divide by 100.', `${D(p)} ÷ 100 = ${dec(p / 100)}.`, `So ${D(p)}% = ${dec(p / 100)}.`], { q: `Write ${D(p)}% as a decimal.`, expr: `${p}/100` }); }
    if (t === 1) { const x = r.int(1, 250) / 100; return num(dec(x * 100), ['To change a decimal to a percent, multiply by 100.', `${dec(x)} × 100 = ${dec(x * 100)}.`, `So ${dec(x)} = ${dec(x * 100)}%.`], { q: `Write ${dec(x)} as a percent.`, unit: '%', expr: `${x}*100` }); }
    if (t === 2) { const d = r.pick([2, 4, 5, 8, 10, 20, 25, 40, 50]); let n; do n = r.int(1, d - 1); while (gcd(n, d) !== 1); const p = dec(100 * n / d); return num(p, [`Divide: ${n} ÷ ${d} = ${dec(n / d)}.`, `Multiply by 100: ${dec(n / d)} × 100 = ${p}.`, `So ${n}/${d} = ${p}%.`], { q: `Write ${n}/${d} as a percent.`, unit: '%', expr: `100*${n}/${d}` }); }
    let p; do p = r.int(2, 98); while (p % 10 === 0 && r.bool(0.7));
    return num(frac(p, 100), [`${p}% means ${p} out of 100: ${p}/100.`, `Divide the top and bottom by ${gcd(p, 100)}.`, `So ${p}% = ${frac(p, 100)}.`], { q: `Write ${p}% as a fraction in simplest form.`, exactForm: 'fraction', expr: `${p}/100` });
  }
  if (v === 1) {
    const t = r.int(0, 2);
    if (t === 0) { const p = r.pick([5, 10, 12, 15, 20, 25, 30, 40, 60, 75, 120, 150]), n = r.int(2, 40) * 10, a = dec(p * n / 100); return num(a, [`${p}% = ${dec(p / 100)}.`, `${dec(p / 100)} × ${n} = ${a}.`, `So ${p}% of ${n} is ${a}.`], { q: `What is ${p}% of ${n}?`, expr: `${p}/100*${n}` }); }
    if (t === 1) { const y = r.pick([20, 25, 40, 50, 80, 200, 400]), p = r.pick([5, 10, 20, 25, 40, 50, 60, 75, 80, 110, 150]), x = dec(y * p / 100); return num(p, [`Divide the part by the whole: ${x} ÷ ${y} = ${dec(p / 100)}.`, `Multiply by 100 to get a percent: ${dec(p / 100)} × 100 = ${p}.`, `So ${x} is ${p}% of ${y}.`], { q: `${x} is what percent of ${y}?`, unit: '%', expr: `${x}/${y}*100` }); }
    const p = r.pick([5, 10, 15, 20, 25, 40, 50, 75]), w = r.int(2, 40) * 20, a = w * p / 100;
    return num(w, [`Write the equation: ${dec(p / 100)} × n = ${a}.`, `Divide: n = ${a} ÷ ${dec(p / 100)} = ${w}.`, `So ${a} is ${p}% of ${w}.`], { q: `${a} is ${p}% of what number?`, expr: `${a}/(${p}/100)` });
  }
  const t = r.int(0, 2), nm = r.pick(NAMES);
  if (t === 0) { const price = r.int(20, 200), p = r.pick([10, 15, 20, 25, 30, 40, 50]), off = rnd(price * p / 100, 2), sale = rnd(price - off, 2); return num(dec(sale), [`The discount is ${p}% of $${price}: ${dec(p / 100)} × ${price} = ${money(off)}.`, `Take it off: $${price} − ${money(off)} = ${money(sale)}.`, `The sale price is ${money(sale)}.`], { q: `A pair of skates costs $${price}. It is on sale for ${p}% off. What is the sale price?`, unit: '$', expr: `${price}*(1-${p}/100)` }); }
  if (t === 1) { const price = r.int(10, 150), tax = rnd(price * 0.13, 2), tot = rnd(price + tax, 2); return num(dec(tot), [`The tax is 13% of $${price}: 0.13 × ${price} = ${money(tax)}.`, `Add it on: $${price} + ${money(tax)} = ${money(tot)}.`, `${nm} pays ${money(tot)}.`], { q: `${nm} buys a game for $${price}. The HST is 13%. What is the total cost with tax?`, unit: '$', expr: `Math.round(${price}*113)/100` }); }
  const bill = r.int(20, 120), p = r.pick([15, 18, 20]), tip = rnd(bill * p / 100, 2);
  return num(dec(tip), [`The tip is ${p}% of $${bill}.`, `${dec(p / 100)} × ${bill} = ${money(tip)}.`, `The tip is ${money(tip)}.`], { q: `A family's restaurant bill is $${bill}. They leave a ${p}% tip. How much is the tip?`, unit: '$', expr: `${bill}*${p}/100` });
});

skill('9-pctchange', 9, 'Percents', 'Percent of change', ['Percent of change = change ÷ original amount × 100.', 'It is an increase if the amount went up and a decrease if it went down.', 'To increase by 20%, multiply by 1.20; to decrease by 20%, multiply by 0.80.'], (r) => {
  let o, p; do { o = r.pick([20, 40, 50, 60, 80, 120, 200, 250, 400, 500]); p = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]); } while ((o * p) % 100);
  const up = r.bool(), ch = o * p / 100, nw = up ? o + ch : o - ch, word = up ? 'increase' : 'decrease';
  const ctx = r.pick([[(a) => `$${a}`, 'The price of a jacket'], [(a) => `${a} members`, "A club's membership"], [(a) => `${a} kg`, "A school's monthly recycling"]]);
  const v = r.int(0, 2);
  if (v === 0) return num(p, [`The change is ${Math.max(o, nw)} − ${Math.min(o, nw)} = ${ch}.`, `Divide by the original: ${ch} ÷ ${o} = ${dec(p / 100)}.`, `× 100: it is a ${p}% ${word}.`], { q: `${ctx[1]} went from ${ctx[0](o)} to ${ctx[0](nw)}. What is the percent ${word}?`, unit: '%', expr: `Math.abs(${nw}-${o})/${o}*100` });
  if (v === 1) return num(nw, [`${p}% of ${o} is ${dec(p / 100)} × ${o} = ${ch}.`, `${up ? 'Add' : 'Subtract'} it: ${o} ${up ? '+' : '−'} ${ch} = ${nw}.`, `The new amount is ${nw}.`], { q: `${ctx[1]} was ${ctx[0](o)}. It had a ${p}% ${word}. What is the new amount?`, expr: `${o}*(1${up ? '+' : '-'}${p}/100)` });
  const right = `${p}% ${word}`;
  return mc(r, right, [`${p}% ${up ? 'decrease' : 'increase'}`, `${dec(ch / nw * 100, 1)}% ${word}`, `${ch}% ${word}`], { q: `An amount changes from ${o} to ${nw}. Which describes the change?`, steps: [`It went ${up ? 'up' : 'down'}, so it is a ${word}.`, `Change ÷ original = ${ch} ÷ ${o} = ${dec(p / 100)}.`, `So it is a ${right}.`] });
});

// ───────────── Geometry ─────────────
skill('9-area', 9, 'Geometry', 'Perimeter and area', ['Rectangle: A = l × w. Triangle: A = b × h ÷ 2. Parallelogram: A = b × h. Trapezoid: A = (a + b) × h ÷ 2.', 'For a compound shape, take the small missing piece away from the big rectangle.', 'The area between two shapes is the big area minus the small area.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const s = r.pick(['rect', 'tri', 'para', 'trap']);
    if (s === 'rect') {
      const l = r.int(4, 20), w = r.int(2, l - 1), askP = r.bool(), vis = { type: 'poly', points: [[1, 2], [9, 2], [9, 7], [1, 7]], labels: [`${l} cm`, `${w} cm`, '', ''] };
      return askP ? num(2 * (l + w), ['P = 2 × (l + w).', `2 × (${l} + ${w}) = 2 × ${l + w} = ${2 * (l + w)}.`, `The perimeter is ${2 * (l + w)} cm.`], { q: 'Find the perimeter of the rectangle.', visual: vis, unit: 'cm', expr: `2*(${l}+${w})` })
        : num(l * w, ['A = l × w.', `${l} × ${w} = ${l * w}.`, `The area is ${l * w} cm².`], { q: 'Find the area of the rectangle.', visual: vis, unit: 'cm²', expr: `${l}*${w}` });
    }
    if (s === 'tri') { const b = r.int(4, 20), h = r.int(3, 16), A = b * h / 2; return num(dec(A), ['A = b × h ÷ 2.', `${b} × ${h} = ${b * h}, and ÷ 2 = ${dec(A)}.`, `The area is ${dec(A)} cm².`], { q: `The triangle has a base of ${b} cm and a height of ${h} cm. Find its area.`, visual: { type: 'poly', points: [[1, 1], [9, 1], [4, 7]], labels: [`${b} cm`, '', ''] }, unit: 'cm²', expr: `${b}*${h}/2` }); }
    if (s === 'para') { const b = r.int(4, 20), h = r.int(3, 15); return num(b * h, ['A = b × h (the height is straight up, not the slanted side).', `${b} × ${h} = ${b * h}.`, `The area is ${b * h} cm².`], { q: `The parallelogram has a base of ${b} cm and a height of ${h} cm. Find its area.`, visual: { type: 'poly', points: [[1, 1], [7, 1], [9, 6], [3, 6]], labels: [`${b} cm`, '', '', ''] }, unit: 'cm²', expr: `${b}*${h}` }); }
    const a = r.int(3, 12), b = a + r.int(2, 10), h = r.int(2, 12), A = (a + b) * h / 2;
    return num(dec(A), ['A = (a + b) × h ÷ 2, where a and b are the parallel sides.', `(${a} + ${b}) × ${h} ÷ 2 = ${a + b} × ${h} ÷ 2 = ${dec(A)}.`, `The area is ${dec(A)} cm².`], { q: `The trapezoid has parallel sides of ${a} cm and ${b} cm, and a height of ${h} cm. Find its area.`, visual: { type: 'poly', points: [[1, 1], [9, 1], [7, 6], [3, 6]], labels: [`${b} cm`, '', `${a} cm`, ''] }, unit: 'cm²', expr: `(${a}+${b})*${h}/2` });
  }
  if (v === 1 || v === 2) {
    const W = r.int(6, 10), H = r.int(5, 9), w = r.int(2, W - 2), h = r.int(2, H - 2);
    const vis = { type: 'poly', points: [[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]], labels: [`${W} m`, `${H - h} m`, `${w} m`, `${h} m`, `${W - w} m`, `${H} m`] };
    if (v === 1) return num(W * H - w * h, [`Think of a ${W} m by ${H} m rectangle: ${W} × ${H} = ${W * H}.`, `A ${w} m by ${h} m corner is missing: ${w} × ${h} = ${w * h}.`, `${W * H} − ${w * h} = ${W * H - w * h}. The area is ${W * H - w * h} m².`], { q: 'Find the area of this shape.', visual: vis, unit: 'm²', expr: `${W}*${H}-${w}*${h}` });
    const P = 2 * (W + H);
    return num(P, ['Add all six sides.', `${W} + ${H - h} + ${w} + ${h} + ${W - w} + ${H} = ${P}.`, `The perimeter is ${P} m.`], { q: 'Find the perimeter of this shape.', visual: vis, unit: 'm', expr: `${W}+${H - h}+${w}+${h}+${W - w}+${H}` });
  }
  if (r.bool()) {
    const L = r.int(10, 30), Wd = r.int(8, L), b = r.int(1, 3), inner = (L - 2 * b) * (Wd - 2 * b), A = L * Wd - inner;
    return num(A, [`Outer area: ${L} × ${Wd} = ${L * Wd}.`, `The picture is ${L - 2 * b} cm by ${Wd - 2 * b} cm: ${inner}.`, `${L * Wd} − ${inner} = ${A}. The frame is ${A} cm².`], { q: `A picture frame is ${L} cm by ${Wd} cm on the outside. The frame is ${b} cm wide all the way around. What is the area of the frame itself?`, unit: 'cm²', expr: `${L}*${Wd}-${L - 2 * b}*${Wd - 2 * b}` });
  }
  const s = 2 * r.int(2, 10), c = 3.14 * (s / 2) ** 2, { answer, tol } = piAns(s * s - c, s * s - Math.PI * (s / 2) ** 2);
  return num(answer, [`Square: ${s} × ${s} = ${s * s}.`, `The circle has radius ${s / 2}: 3.14 × ${s / 2}^2 = ${dec(c)}.`, `${s * s} − ${dec(c)} ≈ ${answer}. The area between them is about ${answer} cm².`], { q: `A circle fits exactly inside a square with sides of ${s} cm. What is the area inside the square but outside the circle? Use 3.14 for π and round to the nearest tenth.`, unit: 'cm²', tol, expr: `Math.round((${s * s}-3.14*${(s / 2) ** 2})*10+1e-6)/10` });
});

skill('9-angles', 9, 'Geometry', 'Angles, polygons and symmetry', ['The interior angles of a polygon with n sides add to (n − 2) × 180°.', 'Parallel lines cut by a transversal: corresponding and alternate angles are equal; co-interior angles add to 180°.', 'A line of symmetry folds a shape onto itself.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(5, 12), S = (n - 2) * 180, nameN = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 11: '11-sided polygon', 12: 'dodecagon' }[n];
    if ([5, 6, 8, 9, 10, 12].includes(n) && r.bool()) return num(S / n, [`Angle sum: (${n} − 2) × 180° = ${S}°.`, `A regular polygon has ${n} equal angles: ${S} ÷ ${n} = ${S / n}.`, `Each angle is ${S / n}°.`], { q: `What is the measure of each interior angle of a regular ${nameN}?`, unit: '°', expr: `(${n}-2)*180/${n}` });
    return num(S, [`A ${nameN} has ${n} sides.`, `(${n} − 2) × 180° = ${n - 2} × 180° = ${S}°.`, `The angles add to ${S}°.`], { q: `What is the sum of the interior angles of a ${nameN}?`, unit: '°', expr: `(${n}-2)*180` });
  }
  if (v === 1) {
    const angs = [r.int(60, 130), r.int(60, 130), r.int(60, 130)], miss = 360 - angs[0] - angs[1] - angs[2];
    if (miss > 20 && miss < 180) return num(miss, ['The angles of a quadrilateral add to 360°.', `${angs.join(' + ')} = ${360 - miss}.`, `360 − ${360 - miss} = ${miss}. The missing angle is ${miss}°.`], { q: `A quadrilateral has angles of ${angs.join('°, ')}° and x. Find x.`, unit: '°', expr: `360-${angs.join('-')}` });
  }
  if (v <= 2) {
    let a; do a = r.int(35, 145); while (a === 90);
    const [name, same] = r.pick([['corresponding angles', true], ['alternate interior angles', true], ['alternate exterior angles', true], ['co-interior (same-side interior) angles', false]]), ans = same ? a : 180 - a;
    return num(ans, [same ? `${name[0].toUpperCase() + name.slice(1)} are equal when the lines are parallel.` : 'Co-interior angles add to 180° when the lines are parallel.', same ? `So the other angle is also ${a}°.` : `180 − ${a} = ${ans}.`, `The other angle is ${ans}°.`], { q: `Two parallel lines are cut by a transversal. Two of the angles are ${name}. One of them is ${a}°. What is the other?`, visual: { type: 'angle', deg: a, label: `${a}°` }, unit: '°', expr: same ? `${a}` : `180-${a}` });
  }
  const [shape, n, why] = r.pick([['a square', 4, 'two through opposite corners and two through the middles of opposite sides'], ['a rectangle that is not a square', 2, 'one across and one up and down, through the middles of the sides'], ['an equilateral triangle', 3, 'one from each corner to the middle of the opposite side'], ['an isosceles triangle that is not equilateral', 1, 'only the line down the middle, between the equal sides'], ['a scalene triangle', 0, 'no fold matches the sides, since all the sides are different'], ['a regular pentagon', 5, 'a regular polygon has as many lines as sides'], ['a regular hexagon', 6, 'a regular polygon has as many lines as sides'], ['a regular octagon', 8, 'a regular polygon has as many lines as sides'], ['a rhombus that is not a square', 2, 'the two diagonals'], ['a kite', 1, 'the long diagonal only'], ['an isosceles trapezoid', 1, 'the line through the middles of the two parallel sides']]);
  return num(n, [`Look for every fold that lands the shape on itself: ${why}.`, `So ${shape} has ${n} line${n === 1 ? '' : 's'} of symmetry.`], { q: `How many lines of symmetry does ${shape} have?` });
});

skill('9-volume', 9, 'Geometry', 'Volume of solids', ['Prism or cylinder: V = area of the base × height.', 'Pyramid or cone: V = (1/3) × area of the base × height.', 'Sphere: V = (4/3) × π × r^3.'], (r) => {
  if (r.bool()) {
    const t = r.int(0, 2);
    if (t === 0) { const l = r.int(2, 12), w = r.int(2, 12), h = r.int(2, 12); return num(l * w * h, [`V = l × w × h.`, `${l} × ${w} × ${h} = ${l * w * h}.`, `The volume is ${l * w * h} cm³.`], { q: `A rectangular prism is ${l} cm long, ${w} cm wide and ${h} cm high. Find its volume.`, unit: 'cm³', expr: `${l}*${w}*${h}` }); }
    if (t === 1) { const b = 2 * r.int(2, 6), h = r.int(3, 10), L = r.int(4, 15), B = b * h / 2; return num(B * L, [`Base triangle: ${b} × ${h} ÷ 2 = ${B} cm².`, `V = base × length = ${B} × ${L} = ${B * L}.`, `The volume is ${B * L} cm³.`], { q: `A triangular prism has a triangle base with base ${b} cm and height ${h} cm. The prism is ${L} cm long. Find its volume.`, unit: 'cm³', expr: `${b}*${h}/2*${L}` }); }
    const s = r.int(2, 12), h = 3 * r.int(1, 6); return num(s * s * h / 3, [`Base: ${s} × ${s} = ${s * s} cm².`, `V = (1/3) × ${s * s} × ${h} = ${s * s * h / 3}.`, `The volume is ${s * s * h / 3} cm³.`], { q: `A square pyramid has a base with sides of ${s} cm and a height of ${h} cm. Find its volume.`, unit: 'cm³', expr: `${s}**2*${h}/3` });
  }
  const t = r.int(0, 2), rad = r.int(1, 10), h = r.int(2, 20), tail = ' Use 3.14 for π and round to the nearest tenth.';
  if (t === 0) { const { answer, tol } = piAns(3.14 * rad * rad * h, Math.PI * rad * rad * h); return num(answer, [`V = π × r^2 × h.`, `3.14 × ${rad}^2 × ${h} = 3.14 × ${rad * rad} × ${h}.`, `≈ ${answer}. The volume is about ${answer} cm³.`], { q: `A cylinder has a radius of ${rad} cm and a height of ${h} cm. Find its volume.${tail}`, unit: 'cm³', tol, expr: `Math.round(3.14*${rad * rad}*${h}*10+1e-6)/10` }); }
  if (t === 1) { const { answer, tol } = piAns(3.14 * rad * rad * h / 3, Math.PI * rad * rad * h / 3); return num(answer, [`V = (1/3) × π × r^2 × h.`, `(1/3) × 3.14 × ${rad * rad} × ${h}.`, `≈ ${answer}. The volume is about ${answer} cm³.`], { q: `A cone has a radius of ${rad} cm and a height of ${h} cm. Find its volume.${tail}`, unit: 'cm³', tol, expr: `Math.round(3.14*${rad * rad}*${h}/3*10+1e-6)/10` }); }
  const { answer, tol } = piAns(4 / 3 * 3.14 * rad ** 3, 4 / 3 * Math.PI * rad ** 3);
  return num(answer, [`V = (4/3) × π × r^3.`, `(4/3) × 3.14 × ${rad}^3 = (4/3) × 3.14 × ${rad ** 3}.`, `≈ ${answer}. The volume is about ${answer} cm³.`], { q: `A sphere has a radius of ${rad} cm. Find its volume.${tail}`, unit: 'cm³', tol, expr: `Math.round(4/3*3.14*${rad ** 3}*10+1e-6)/10` });
});

skill('9-surface', 9, 'Geometry', 'Surface area and nets', ['Surface area is the total area of all the faces: unfold the solid into a net and add the pieces.', 'Cylinder: SA = 2πr^2 + 2πrh. Cone: SA = πr^2 + πrs (s is the slant height). Sphere: SA = 4πr^2.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = r.int(0, 2);
    if (t === 0) { const l = r.int(2, 12), w = r.int(2, 12), h = r.int(2, 12), S = 2 * (l * w + l * h + w * h); return num(S, ['There are three pairs of matching faces.', `2 × (${l} × ${w} + ${l} × ${h} + ${w} × ${h}) = 2 × ${l * w + l * h + w * h}.`, `= ${S}. The surface area is ${S} cm².`], { q: `Find the surface area of a rectangular prism that is ${l} cm by ${w} cm by ${h} cm.`, unit: 'cm²', expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` }); }
    if (t === 1) { const s = r.int(2, 15); return num(6 * s * s, ['A cube has 6 equal square faces.', `One face: ${s} × ${s} = ${s * s}. Six faces: 6 × ${s * s} = ${6 * s * s}.`, `The surface area is ${6 * s * s} cm².`], { q: `Find the surface area of a cube with edges of ${s} cm.`, unit: 'cm²', expr: `6*${s}**2` }); }
    const s = r.int(2, 12), l = r.int(s, 15), S = s * s + 2 * s * l;
    return num(S, [`Base: ${s} × ${s} = ${s * s}.`, `Four triangles: 4 × (${s} × ${l} ÷ 2) = ${2 * s * l}.`, `${s * s} + ${2 * s * l} = ${S}. The surface area is ${S} cm².`], { q: `A square pyramid has base sides of ${s} cm. Each triangle face has a slant height of ${l} cm. Find the surface area.`, unit: 'cm²', expr: `${s}**2+4*${s}*${l}/2` });
  }
  if (v === 1) {
    const t = r.int(0, 2), rad = r.int(1, 10), h = r.int(2, 15), tail = ' Use 3.14 for π and round to the nearest tenth.';
    if (t === 0) { const { answer, tol } = piAns(2 * 3.14 * rad * rad + 2 * 3.14 * rad * h, 2 * Math.PI * rad * (rad + h)); return num(answer, ['SA = 2πr^2 + 2πrh (two circles and a rectangle).', `2 × 3.14 × ${rad * rad} + 2 × 3.14 × ${rad} × ${h}.`, `≈ ${answer}. The surface area is about ${answer} cm².`], { q: `Find the surface area of a cylinder with radius ${rad} cm and height ${h} cm.${tail}`, unit: 'cm²', tol, expr: `Math.round((2*3.14*${rad * rad}+2*3.14*${rad}*${h})*10+1e-6)/10` }); }
    if (t === 1) { const s = rad + r.int(1, 10), { answer, tol } = piAns(3.14 * rad * rad + 3.14 * rad * s, Math.PI * rad * (rad + s)); return num(answer, ['SA = πr^2 + πrs (the base circle and the curved side).', `3.14 × ${rad * rad} + 3.14 × ${rad} × ${s}.`, `≈ ${answer}. The surface area is about ${answer} cm².`], { q: `A cone has a radius of ${rad} cm and a slant height of ${s} cm. Find its surface area.${tail}`, unit: 'cm²', tol, expr: `Math.round((3.14*${rad * rad}+3.14*${rad}*${s})*10+1e-6)/10` }); }
    const { answer, tol } = piAns(4 * 3.14 * rad * rad, 4 * Math.PI * rad * rad);
    return num(answer, ['SA = 4πr^2.', `4 × 3.14 × ${rad}^2 = 4 × 3.14 × ${rad * rad}.`, `≈ ${answer}. The surface area is about ${answer} cm².`], { q: `Find the surface area of a sphere with radius ${rad} cm.${tail}`, unit: 'cm²', tol, expr: `Math.round(4*3.14*${rad * rad}*10+1e-6)/10` });
  }
  const NETS = [['6 equal squares', 'cube'], ['2 triangles and 3 rectangles', 'triangular prism'], ['1 square and 4 triangles', 'square pyramid'], ['2 circles and 1 rectangle', 'cylinder'], ['1 circle and 1 curved sector', 'cone'], ['4 equal triangles', 'triangular pyramid'], ['6 rectangles, in 3 matching pairs', 'rectangular prism'], ['2 hexagons and 6 rectangles', 'hexagonal prism']];
  const [desc, solid] = r.pick(NETS);
  return mc(r, solid, r.shuffle(NETS.filter((n) => n[1] !== solid).map((n) => n[1])).slice(0, 3), { q: `A net is made of ${desc}. What solid does it fold into?`, steps: [`Match the faces: ${desc}.`, `That folds into a ${solid}.`] });
});

skill('9-similar', 9, 'Geometry', 'Similar figures and solids', ['Similar figures have equal angles, and every length is multiplied by the same scale factor k.', 'Perimeters multiply by k, areas by k^2 and volumes by k^3.', 'Similar triangles let us measure tall things with shadows.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const k = r.pick([2, 3, 1.5, 0.5, 2.5]), a = 2 * r.int(2, 8), b = 2 * r.int(2, 8);
    if (r.bool(0.25)) { const x = r.int(30, 100); return num(x, ['Similar figures have equal corresponding angles.', `∠E matches ∠B, so ∠E = ${x}°.`], { q: `Triangle ABC is similar to triangle DEF. ∠B = ${x}°. What is ∠E?`, unit: '°' }); }
    return num(dec(b * k), [`Scale factor: DE ÷ AB = ${D(a * k)} ÷ ${a} = ${D(k)}.`, `EF = BC × ${D(k)} = ${b} × ${D(k)} = ${D(b * k)}.`, `So EF = ${D(b * k)} cm.`], { q: `Triangle ABC is similar to triangle DEF. AB = ${a} cm, BC = ${b} cm and DE = ${D(a * k)} cm. Find EF.`, unit: 'cm', expr: `${b}*${a * k}/${a}` });
  }
  if (v === 1) {
    const [h, s] = r.pick([[1.5, 2], [1.5, 3], [1.6, 2], [1.8, 1.5], [1.8, 1.2], [1.6, 4], [1.2, 1.5]]), S = r.int(4, 30), T = rnd(S * h / s, 4), nm = r.pick(NAMES);
    return num(dec(T), [`The triangles are similar, so height ÷ shadow is the same: ${D(h)} ÷ ${D(s)} = ${D(h / s)}.`, `Tree: ${S} × ${D(h / s)} = ${D(T)}.`, `The tree is ${D(T)} m tall.`], { q: `${nm} is ${D(h)} m tall and casts a ${D(s)} m shadow. At the same time a tree casts a ${S} m shadow. How tall is the tree?`, unit: 'm', expr: `${S}*${h}/${s}` });
  }
  if (v === 2) {
    const k = r.int(2, 5), A = r.int(3, 20), P = r.int(10, 40);
    if (r.bool()) return num(A * k * k, [`Areas grow by k^2 = ${k}^2 = ${k * k}.`, `${A} × ${k * k} = ${A * k * k}.`, `The larger area is ${A * k * k} cm².`], { q: `Two similar figures have a scale factor of ${k}. The smaller one has an area of ${A} cm². What is the area of the larger one?`, unit: 'cm²', expr: `${A}*${k}**2` });
    return num(P * k, [`Perimeters grow by k = ${k}.`, `${P} × ${k} = ${P * k}.`, `The larger perimeter is ${P * k} cm.`], { q: `Two similar figures have a scale factor of ${k}. The smaller one has a perimeter of ${P} cm. What is the perimeter of the larger one?`, unit: 'cm', expr: `${P}*${k}` });
  }
  const k = r.int(2, 4), word = { 2: 'doubled', 3: 'tripled', 4: 'multiplied by 4' }[k];
  if (r.bool()) { const V = r.int(2, 30); return num(V * k ** 3, [`Volumes grow by k^3 = ${k}^3 = ${k ** 3}.`, `${V} × ${k ** 3} = ${V * k ** 3}.`, `The larger volume is ${V * k ** 3} cm³.`], { q: `Two similar solids have a scale factor of ${k}. The smaller one has a volume of ${V} cm³. What is the volume of the larger one?`, unit: 'cm³', expr: `${V}*${k}**3` }); }
  const isV = r.bool();
  return num(isV ? k ** 3 : k * k, [`Every length is ${word}, so k = ${k}.`, isV ? `Volume is multiplied by k^3 = ${k ** 3}.` : `Surface area is multiplied by k^2 = ${k * k}.`, `It is multiplied by ${isV ? k ** 3 : k * k}.`], { q: `Every edge of a box is ${word}. By what number is its ${isV ? 'volume' : 'surface area'} multiplied?`, expr: isV ? `${k}**3` : `${k}**2` });
});

skill('9-transform', 9, 'Geometry', 'Transformations', ['A translation slides, a reflection flips, a rotation turns, and a dilation enlarges or shrinks.', 'Reflect in the x-axis: (x, y) → (x, −y). In the y-axis: (x, y) → (−x, y).', 'Rotate 90° counterclockwise: (x, y) → (−y, x). Rotate 180°: (x, y) → (−x, −y).'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const x = r.nonzero(-5, 5), y = r.nonzero(-5, 5), t = r.int(0, 5);
    let X, Y, desc, rule;
    if (t === 0) { const dx = r.nonzero(-4, 4), dy = r.nonzero(-4, 4); [X, Y] = [x + dx, y + dy]; desc = `a translation ${Math.abs(dx)} unit${Math.abs(dx) > 1 ? 's' : ''} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} unit${Math.abs(dy) > 1 ? 's' : ''} ${dy > 0 ? 'up' : 'down'}`; rule = `(x, y) → (x ${sgn(dx)}, y ${sgn(dy)})`; }
    else [X, Y, desc, rule] = [[x, -y, 'a reflection in the x-axis', '(x, y) → (x, −y)'], [-x, y, 'a reflection in the y-axis', '(x, y) → (−x, y)'], [-y, x, 'a rotation of 90° counterclockwise about the origin', '(x, y) → (−y, x)'], [y, -x, 'a rotation of 90° clockwise about the origin', '(x, y) → (y, −x)'], [-x, -y, 'a rotation of 180° about the origin', '(x, y) → (−x, −y)']][t - 1];
    return pt(X + 0, Y + 0, [`The rule for ${desc} is ${rule}.`, `${xy(x, y)} → ${xy(X + 0, Y + 0)}.`, `So P′ is ${xy(X + 0, Y + 0)}.`], { q: `Point P${xy(x, y)} is moved by ${desc}. What are the coordinates of its image P′? Write them as (x, y).`, visual: { type: 'plane', points: [[x, y, 'P']] } });
  }
  if (v === 1) {
    let A, img, kind, why;
    do {
      const t = r.int(0, 3), sm = t === 3;
      A = []; while (A.length < 3) { const p = [r.int(sm ? -3 : -5, sm ? 3 : 5), r.int(sm ? -3 : -5, sm ? 3 : 5)]; if (!A.some((q) => q[0] === p[0] && q[1] === p[1]) && (p[0] || p[1])) A.push(p); }
      if (t === 0) { const dx = r.nonzero(-3, 3), dy = r.int(-3, 3); img = A.map(([x, y]) => [x + dx, y + dy]); kind = 'a translation'; why = `every point moved ${dx > 0 ? 'right' : 'left'} ${Math.abs(dx)}${dy ? ` and ${dy > 0 ? 'up' : 'down'} ${Math.abs(dy)}` : ''}`; }
      else if (t === 1) { const xa = r.bool(); img = A.map(([x, y]) => (xa ? [x, -y] : [-x, y])); kind = 'a reflection'; why = `every ${xa ? 'y' : 'x'}-coordinate changed sign: a flip in the ${xa ? 'x' : 'y'}-axis`; }
      else if (t === 2) { img = A.map(([x, y]) => [-x, -y]); kind = 'a rotation'; why = 'both coordinates changed sign: a turn of 180° about the origin'; }
      else { img = A.map(([x, y]) => [2 * x, 2 * y]); kind = 'a dilation'; why = 'every coordinate was multiplied by 2: an enlargement'; }
    } while ((A[0][0] - A[1][0]) * (A[2][1] - A[1][1]) === (A[0][1] - A[1][1]) * (A[2][0] - A[1][0]) || img.every(([x, y]) => A.some((p) => p[0] === x && p[1] === y)));
    const L = ['A', 'B', 'C'], show = (pts, pr) => pts.map(([x, y], i) => `${L[i]}${pr}${xy(x + 0, y + 0)}`).join(', ');
    return mc(r, kind, ['a translation', 'a reflection', 'a rotation', 'a dilation'].filter((k) => k !== kind), { q: `Triangle ABC has ${show(A, '')}. Its image has ${show(img, '′')}. What kind of transformation is this?`, steps: [`Compare each point with its image: ${why}.`, `So it is ${kind}.`] });
  }
  if (r.bool()) {
    const k = r.pick([2, 3, 0.5]), x = 2 * r.int(-3, 3), y = 2 * r.nonzero(-3, 3);
    return pt(x * k + 0, y * k + 0, [`A dilation about the origin multiplies both coordinates by ${D(k)}.`, `(${neg(x)} × ${D(k)}, ${neg(y)} × ${D(k)}) = ${xy(x * k + 0, y * k + 0)}.`, `So the image is ${xy(x * k + 0, y * k + 0)}.`], { q: `Point Q${xy(x, y)} is dilated by a scale factor of ${D(k)} about the origin. What is its image? Write it as (x, y).` });
  }
  const k = r.pick([2, 3, 1.5, 0.5, 2.5, 4]), L0 = 2 * r.int(2, 9);
  return num(dec(k), ['Scale factor = image length ÷ original length.', `${D(L0 * k)} ÷ ${L0} = ${D(k)}.`, `The scale factor is ${D(k)}.`], { q: `A segment ${L0} cm long is dilated. Its image is ${D(L0 * k)} cm long. What is the scale factor?`, expr: `${L0 * k}/${L0}` });
});

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [9, 40, 41]];
skill('9-pythag', 9, 'Geometry', 'The Pythagorean theorem', ['In a right triangle, a^2 + b^2 = c^2, where c is the hypotenuse (the longest side, across from the right angle).', 'To find a leg: b^2 = c^2 − a^2.', 'If a^2 + b^2 = c^2 for the sides of a triangle, then it is a right triangle.'], (r) => {
  const v = r.int(0, 3);
  const [p, q, h] = r.pick(TRIPLES), k = r.pick([1, 1, 2, 3]), a = p * k, b = q * k, c = h * k;
  if (v === 0) return num(c, [`c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}.`, `c = √${c * c} = ${c}.`, `The hypotenuse is ${c} cm.`], { q: 'Find the length of the hypotenuse.', visual: { type: 'righttri', a: `${a} cm`, b: `${b} cm`, c: '?' }, unit: 'cm', expr: `Math.sqrt(${a}**2+${b}**2)` });
  if (v === 1) return num(b, [`b^2 = c^2 − a^2 = ${c}^2 − ${a}^2 = ${c * c} − ${a * a} = ${b * b}.`, `b = √${b * b} = ${b}.`, `The missing leg is ${b} cm.`], { q: 'Find the length of the missing leg.', visual: { type: 'righttri', a: `${a} cm`, b: '?', c: `${c} cm` }, unit: 'cm', expr: `Math.sqrt(${c}**2-${a}**2)` });
  if (v === 2) {
    if (r.bool()) return num(b, [`The ladder is the hypotenuse: ${c} m. The base is ${a} m from the wall.`, `height^2 = ${c * c} − ${a * a} = ${b * b}, so height = ${b}.`, `The ladder reaches ${b} m up the wall.`], { q: `A ${c} m ladder leans against a wall. Its foot is ${a} m from the wall. How high up the wall does it reach?`, unit: 'm', expr: `Math.sqrt(${c}**2-${a}**2)` });
    const l = r.int(4, 30), w = r.int(3, 20), d = rnd(Math.sqrt(l * l + w * w), 1);
    return num(dec(d), [`The diagonal is the hypotenuse: d^2 = ${l}^2 + ${w}^2 = ${l * l + w * w}.`, `d = √${l * l + w * w} ≈ ${dec(d)}.`, `The diagonal is about ${dec(d)} m.`], { q: `A rectangular field is ${l} m long and ${w} m wide. How long is a path straight across it, corner to corner? Round to the nearest tenth.`, unit: 'm', tol: 0.051, expr: `Math.round(Math.sqrt(${l * l + w * w})*10+1e-6)/10` });
  }
  const right = r.bool(), C = right ? c : c + r.pick([-1, 1]);
  const ok = a * a + b * b === C * C;
  return mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], { q: `A triangle has sides of ${a}, ${b} and ${C} cm. Is it a right triangle?`, steps: [`Check: ${a}^2 + ${b}^2 = ${a * a + b * b}.`, `The longest side: ${C}^2 = ${C * C}.`, ok ? 'They are equal, so it is a right triangle: Yes.' : 'They are not equal, so it is not a right triangle: No.'] });
});

// ───────────── Circles ─────────────
skill('9-circle', 9, 'Circles', 'Parts and measures of a circle', ['The radius goes from the centre to the circle; the diameter goes across through the centre: d = 2r.', 'Circumference C = 2πr = πd. Area A = πr^2.', 'We use 3.14 for π.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const P = [['radius', 'a segment from the centre to a point on the circle'], ['diameter', 'a chord that passes through the centre'], ['chord', 'a segment that joins two points on the circle'], ['tangent', 'a line that touches the circle at exactly one point'], ['arc', 'a part of the circle between two points on it'], ['sector', 'the region between two radii and an arc'], ['circumference', 'the distance around the circle'], ['secant', 'a line that crosses the circle at two points']];
    const [w, def] = r.pick(P);
    return mc(r, w, r.shuffle(P.filter((p) => p[0] !== w).map((p) => p[0])).slice(0, 3), { q: `Which word means ${def}?`, steps: [`${def[0].toUpperCase() + def.slice(1)} is called a ${w}.`, `The answer is ${w}.`] });
  }
  const rad = r.int(2, 20), tail = ' Use 3.14 for π and round to the nearest tenth.';
  if (v === 1) {
    const t = r.int(0, 3);
    if (t === 0) { const { answer, tol } = piAns(2 * 3.14 * rad, 2 * Math.PI * rad); return num(answer, ['C = 2πr.', `2 × 3.14 × ${rad} = ${dec(6.28 * rad)}.`, `The circumference is about ${answer} cm.`], { q: `A circle has a radius of ${rad} cm. Find its circumference.${tail}`, unit: 'cm', tol, expr: `Math.round(2*3.14*${rad}*10+1e-6)/10` }); }
    if (t === 1) { const { answer, tol } = piAns(3.14 * rad * rad, Math.PI * rad * rad); return num(answer, ['A = πr^2. The radius is half the diameter.', `r = ${2 * rad} ÷ 2 = ${rad}; 3.14 × ${rad}^2 = 3.14 × ${rad * rad}.`, `The area is about ${answer} cm².`], { q: `A circle has a diameter of ${2 * rad} cm. Find its area.${tail}`, unit: 'cm²', tol, expr: `Math.round(3.14*${rad * rad}*10+1e-6)/10` }); }
    if (t === 2) { const C = dec(6.28 * rad); return num(rad, ['C = 2πr, so r = C ÷ (2π).', `${C} ÷ (2 × 3.14) = ${C} ÷ 6.28 = ${rad}.`, `The radius is ${rad} cm.`], { q: `A circle has a circumference of ${C} cm. Use 3.14 for π to find its radius.`, unit: 'cm', tol: 0.06, expr: `${C}/6.28` }); }
    return num(2 * rad, ['The diameter is twice the radius.', `2 × ${rad} = ${2 * rad}.`, `The diameter is ${2 * rad} cm.`], { q: `A circle has a radius of ${rad} cm. What is its diameter?`, unit: 'cm', expr: `2*${rad}` });
  }
  if (r.bool()) {
    const d = r.pick([50, 60, 64, 70, 75]), n = r.int(5, 40), { answer, tol } = piAns(3.14 * d * n / 100, Math.PI * d * n / 100);
    return num(answer, [`One turn moves the bike one circumference: 3.14 × ${d} = ${dec(3.14 * d)} cm.`, `${n} turns: ${n} × ${dec(3.14 * d)} = ${dec(3.14 * d * n)} cm = ${dec(3.14 * d * n / 100)} m.`, `It travels about ${answer} m.`], { q: `A bike wheel has a diameter of ${d} cm. How many metres does the bike travel when the wheel turns ${n} times? Use 3.14 for π and round to the nearest tenth.`, unit: 'm', tol, expr: `Math.round(3.14*${d}*${n}/100*10+1e-6)/10` });
  }
  const R = r.int(2, 12), { answer, tol } = piAns(3.14 * R * R, Math.PI * R * R);
  return num(answer, ['The grass covers the whole circle, so find the area: A = πr^2.', `3.14 × ${R}^2 = 3.14 × ${R * R}.`, `≈ ${answer}. About ${answer} m² of grass is needed.`], { q: `A round garden has a radius of ${R} m. How much grass sod is needed to cover it?${tail}`, unit: 'm²', tol, expr: `Math.round(3.14*${R * R}*10+1e-6)/10` });
});

skill('9-arcs', 9, 'Circles', 'Central angles, arcs and sectors', ['The central angles around the centre add to 360°. An arc measures the same as its central angle.', 'Arc length = (angle ÷ 360) × 2πr.', 'Sector area = (angle ÷ 360) × πr^2.'], (r) => {
  const v = r.int(0, 3), th = r.pick([30, 40, 45, 60, 72, 90, 120, 135, 150, 210, 240, 270, 300]), rad = r.int(2, 15), tail = ' Use 3.14 for π and round to the nearest tenth.';
  if (v === 0) {
    if (r.bool()) { const a = r.int(40, 120), b = r.int(40, 120), c = r.int(30, 100), x = 360 - a - b - c; return num(x, ['Central angles around the centre add to 360°.', `${a} + ${b} + ${c} = ${a + b + c}.`, `360 − ${a + b + c} = ${x}. The missing angle is ${x}°.`], { q: `Four central angles fill a circle. Three of them are ${a}°, ${b}° and ${c}°. What is the fourth?`, unit: '°', expr: `360-${a}-${b}-${c}` }); }
    const x = r.int(25, 170); return num(360 - x, [`Arc AB (the minor arc) measures the same as ∠AOB: ${x}°.`, `The major arc is the rest of the circle: 360 − ${x} = ${360 - x}.`, `The major arc measures ${360 - x}°.`], { q: `The central angle ∠AOB is ${x}°. What is the measure of the major arc AB (the long way around)?`, unit: '°', expr: `360-${x}` });
  }
  if (v === 1) { const { answer, tol } = piAns(th / 360 * 2 * 3.14 * rad, th / 360 * 2 * Math.PI * rad); return num(answer, [`The arc is ${th}/360 = ${F(th, 360)} of the circle.`, `${F(th, 360)} × 2 × 3.14 × ${rad} = ${F(th, 360)} × ${dec(6.28 * rad)}.`, `≈ ${answer}. The arc length is about ${answer} cm.`], { q: `A circle has a radius of ${rad} cm. Find the length of an arc with a central angle of ${th}°.${tail}`, unit: 'cm', tol, expr: `Math.round(${th}/360*2*3.14*${rad}*10+1e-6)/10` }); }
  if (v === 2) { const { answer, tol } = piAns(th / 360 * 3.14 * rad * rad, th / 360 * Math.PI * rad * rad); return num(answer, [`The sector is ${th}/360 = ${F(th, 360)} of the circle.`, `${F(th, 360)} × 3.14 × ${rad}^2 = ${F(th, 360)} × ${dec(3.14 * rad * rad)}.`, `≈ ${answer}. The sector's area is about ${answer} cm².`], { q: `A circle has a radius of ${rad} cm. Find the area of a sector with a central angle of ${th}°.${tail}`, unit: 'cm²', tol, expr: `Math.round(${th}/360*3.14*${rad * rad}*10+1e-6)/10` }); }
  return num(frac(th, 360), ['A full turn is 360°.', `${th}/360 simplifies to ${frac(th, 360)}.`, `So the sector is ${frac(th, 360)} of the circle.`], { q: `A sector has a central angle of ${th}°. What fraction of the whole circle is it? Give the simplest fraction.`, exactForm: 'fraction', expr: `${th}/360` });
});

skill('9-inscribed', 9, 'Circles', 'Inscribed angles and tangents', ['An inscribed angle is half of the arc it cuts off.', 'An angle inscribed in a semicircle is 90°. Opposite angles of a quadrilateral inscribed in a circle add to 180°.', 'A tangent meets the radius at 90°, and the two tangents from one point are equal.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const arc = 2 * r.int(20, 150);
    if (r.bool()) return num(arc / 2, ['An inscribed angle is half of its arc.', `${arc} ÷ 2 = ${arc / 2}.`, `The inscribed angle is ${arc / 2}°.`], { q: `An inscribed angle cuts off an arc of ${arc}°. What is the inscribed angle?`, unit: '°', expr: `${arc}/2` });
    return num(arc, ['The arc is twice the inscribed angle.', `2 × ${arc / 2} = ${arc}.`, `The arc measures ${arc}°.`], { q: `An inscribed angle measures ${arc / 2}°. What is the measure of the arc it cuts off?`, unit: '°', expr: `2*${arc / 2}` });
  }
  if (v === 1) { const x = r.int(15, 75); return num(90 - x, ['The side AB is a diameter, so the angle at C is 90°.', `The angles add to 180°: 180 − 90 − ${x} = ${90 - x}.`, `∠B = ${90 - x}°.`], { q: `Triangle ABC is drawn inside a circle, and AB is a diameter. ∠A = ${x}°. What is ∠B?`, unit: '°', expr: `90-${x}` }); }
  if (v === 2) { const x = r.int(50, 130); return num(180 - x, ['ABCD is inscribed in a circle, so opposite angles add to 180°.', `∠C = 180 − ${x} = ${180 - x}.`, `∠C = ${180 - x}°.`], { q: `Quadrilateral ABCD is inscribed in a circle. ∠A = ${x}°. What is ∠C?`, unit: '°', expr: `180-${x}` }); }
  if (v === 3) {
    const [a, b, c] = r.pick(TRIPLES);
    if (r.bool()) return num(b, [`The radius OT meets the tangent at 90°, so OTP is a right triangle with hypotenuse OP = ${c}.`, `PT^2 = ${c}^2 − ${a}^2 = ${c * c - a * a}, so PT = ${b}.`, `PT = ${b} cm.`], { q: `PT is tangent to a circle with centre O at point T. The radius is ${a} cm and OP = ${c} cm. How long is PT?`, unit: 'cm', expr: `Math.sqrt(${c}**2-${a}**2)` });
    const x = r.int(30, 140); return num(180 - x, ['Each tangent meets its radius at 90°, so the quadrilateral has two 90° angles.', `The angles add to 360°: 360 − 90 − 90 − ${x} = ${180 - x}.`, `The angle at the centre is ${180 - x}°.`], { q: `Two tangents from point P touch a circle with centre O at A and B. ∠APB = ${x}°. What is ∠AOB?`, unit: '°', expr: `180-${x}` });
  }
  const p = r.int(2, 9), q = r.int(2, 9), s = r.int(2, 9), P = 2 * (p + q + s);
  return num(P, ['Two tangents from the same corner are equal, so each length appears twice.', `2 × (${p} + ${q} + ${s}) = 2 × ${p + q + s} = ${P}.`, `The perimeter is ${P} cm.`], { q: `A circle is inscribed in a triangle. From the three corners, the tangent lengths to the circle are ${p} cm, ${q} cm and ${s} cm. What is the perimeter of the triangle?`, unit: 'cm', expr: `2*(${p}+${q}+${s})` });
});

// ───────────── Coordinate plane ─────────────
skill('9-quadrant', 9, 'Coordinate plane', 'Quadrants and axes', ['The axes split the plane into four quadrants, numbered I to IV counterclockwise from the top right.', 'Quadrant I (+, +), II (−, +), III (−, −), IV (+, −).', 'A point with a 0 coordinate is on an axis, not in a quadrant.'], (r) => {
  const x = r.bool(0.15) ? 0 : r.nonzero(-6, 6), y = r.bool(0.15) ? 0 : r.nonzero(-6, 6);
  if (r.bool(0.4)) return pt(x, y, [`Go across to ${neg(x)} on the x-axis.`, `Then up or down to ${neg(y)}: the point is ${xy(x, y)}.`, `So P is ${xy(x, y)}.`], { q: 'What are the coordinates of point P? Write them as (x, y).', visual: { type: 'plane', points: [[x, y, 'P']] } });
  const where = x === 0 && y === 0 ? 'the origin' : x === 0 ? 'on the y-axis' : y === 0 ? 'on the x-axis' : x > 0 ? (y > 0 ? 'Quadrant I' : 'Quadrant IV') : (y > 0 ? 'Quadrant II' : 'Quadrant III');
  const all = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV', 'on the x-axis', 'on the y-axis', 'the origin'];
  return mc(r, where, r.shuffle(all.filter((w) => w !== where)).slice(0, 3), { q: `Where is the point ${xy(x, y)}?`, visual: { type: 'plane', points: [[x, y]] }, steps: [`x is ${x === 0 ? 'zero' : x > 0 ? 'positive' : 'negative'}; y is ${y === 0 ? 'zero' : y > 0 ? 'positive' : 'negative'}.`, `So the point is ${where}.`] });
});

skill('9-distance', 9, 'Coordinate plane', 'Distance between two points', ['If the points share an x or a y, count the difference.', 'Otherwise draw a right triangle: d = √((x2 − x1)^2 + (y2 − y1)^2).'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const y = r.int(-6, 6), x1 = r.int(-6, 5); const x2 = r.int(x1 + 1, 6), flip = r.bool();
    const P = flip ? [[y, x1], [y, x2]] : [[x1, y], [x2, y]];
    return num(x2 - x1, [`The points share ${flip ? 'an x' : 'a y'}-coordinate, so count along the line.`, `${neg(x2)} − ${par(x1)} = ${x2 - x1}.`, `The distance is ${x2 - x1} units.`], { q: `Find the distance between ${xy(...P[0])} and ${xy(...P[1])}.`, visual: { type: 'plane', points: P.map(([a, b], i) => [a, b, 'AB'[i]]) }, expr: `${x2}-(${x1})` });
  }
  if (v === 1) {
    const [a, b, c] = r.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]), sx = r.pick([1, -1]), sy = r.pick([1, -1]);
    const x1 = sx > 0 ? r.int(-6, 6 - a) : r.int(-6 + a, 6), y1 = sy > 0 ? r.int(-6, 6 - b) : r.int(-6 + b, 6), x2 = x1 + sx * a, y2 = y1 + sy * b;
    return num(c, [`Across: ${a}. Up or down: ${b}.`, `d = √(${a}^2 + ${b}^2) = √${c * c} = ${c}.`, `The distance is ${c} units.`], { q: `Find the distance between A${xy(x1, y1)} and B${xy(x2, y2)}.`, visual: { type: 'plane', points: [[x1, y1, 'A'], [x2, y2, 'B']] }, expr: `Math.hypot(${x2}-(${x1}),${y2}-(${y1}))` });
  }
  const x1 = r.int(-6, 6), y1 = r.int(-6, 6); let x2, y2; do { x2 = r.int(-6, 6); y2 = r.int(-6, 6); } while (x2 === x1 || y2 === y1);
  const dx = x2 - x1, dy = y2 - y1, s = dx * dx + dy * dy, d = rnd(Math.sqrt(s), 1);
  return num(dec(d), [`Across: ${Math.abs(dx)}. Up or down: ${Math.abs(dy)}.`, `d = √(${Math.abs(dx)}^2 + ${Math.abs(dy)}^2) = √${s} ≈ ${dec(d)}.`, `The distance is about ${dec(d)} units.`], { q: `Find the distance between ${xy(x1, y1)} and ${xy(x2, y2)}. Round to the nearest tenth.`, tol: 0.051, expr: `Math.round(Math.sqrt(${s})*10+1e-6)/10` });
});

// ───────────── Properties ─────────────
skill('9-props', 9, 'Properties', 'Properties of operations and equality', ['Commutative: order does not matter. Associative: grouping does not matter.', 'Distributive: a(b + c) = ab + ac.', 'Properties of equality: do the same thing to both sides and the equation stays true.'], (r) => {
  const v = r.int(0, 2), a = r.int(2, 15), b = r.int(2, 15), c = r.int(2, 15);
  if (v === 0) {
    const P = [['commutative property of addition', `${a} + ${b} = ${b} + ${a}`], ['commutative property of multiplication', `${a} × ${b} = ${b} × ${a}`], ['associative property of addition', `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`], ['associative property of multiplication', `(${a} × ${b}) × ${c} = ${a} × (${b} × ${c})`], ['distributive property', `${a}(x + ${b}) = ${a}x + ${a * b}`], ['identity property of addition', `${a}x + 0 = ${a}x`], ['identity property of multiplication', `1 × ${a}y = ${a}y`], ['inverse property of addition', `${a} + (−${a}) = 0`], ['zero property of multiplication', `${a}y × 0 = 0`]];
    const [name, ex] = r.pick(P);
    return mc(r, name, r.shuffle(P.filter((p) => p[0] !== name).map((p) => p[0])).slice(0, 3), { q: `Which property is shown?  ${ex}`, steps: [`Look at what changed from one side to the other.`, `This is the ${name}.`] });
  }
  if (v === 1) {
    const s = r.int(-9, 9), k = r.int(2, 9);
    const E = [['addition property of equality', `x − ${k} = ${s - k}`, `x = ${s}`, `${k} was added to both sides`], ['subtraction property of equality', `x + ${k} = ${s + k}`, `x = ${s}`, `${k} was subtracted from both sides`], ['multiplication property of equality', `x/${k} = ${s}`, `x = ${s * k}`, `both sides were multiplied by ${k}`], ['division property of equality', `${k}x = ${s * k}`, `x = ${s}`, `both sides were divided by ${k}`]];
    const [name, from, to, why] = r.pick(E);
    return mc(r, name, E.filter((e) => e[0] !== name).map((e) => e[0]), { q: `If ${M(from)}, then ${M(to)}. Which property of equality was used?`, steps: [`From ${M(from)} to ${M(to)}: ${why}.`, `That is the ${name}.`] });
  }
  const n = r.pick([98, 99, 101, 102, 49, 51, 198, 201]), m = r.int(3, 9), base = Math.round(n / 50) * 50, d = n - base;
  return num(m * n, [`Write ${n} as ${base} ${sgn(d)}.`, `${m} × ${base} ${d < 0 ? '−' : '+'} ${m} × ${Math.abs(d)} = ${m * base} ${d < 0 ? '−' : '+'} ${m * Math.abs(d)}.`, `= ${m * n}. So ${m} × ${n} = ${m * n}.`], { q: `Use the distributive property to work out ${m} × ${n} in your head.`, expr: `${m}*${n}` });
});

// ───────────── Exponents ─────────────
skill('9-powers', 9, 'Exponents', 'Evaluate powers', ['The exponent says how many times to multiply the base: 2^3 = 2 × 2 × 2 = 8.', '(−3)^2 = 9, but −3^2 = −9: without brackets the power is done first.', 'A negative exponent means a reciprocal: 2^(−3) = 1/2^3 = 1/8. Anything (not 0) to the power 0 is 1.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const b = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), e = Math.abs(b) <= 3 ? r.int(2, 4) : r.int(2, 3), out = b > 0 && r.bool(0.35);
    const val = out ? -(b ** e) : b ** e;
    if (out) return num(val, [`Without brackets, the power comes first: ${b}^${e} = ${b ** e}.`, `Then the minus sign: −${b}^${e} = ${neg(val)}.`, `So the answer is ${neg(val)}.`], { q: `Evaluate: −${b}^${e}`, expr: `-(${b}**${e})` });
    return num(val, [`${par(b)}^${e} = ${Array(e).fill(par(b)).join(' × ')}.`, `${e % 2 === 0 || b > 0 ? 'The answer is positive' : 'An odd number of negatives gives a negative'}: ${neg(val)}.`, `So the answer is ${neg(val)}.`], { q: `Evaluate: ${par(b)}^${e}`, expr: `(${b})**${e}` });
  }
  if (v === 1) {
    if (r.bool()) { const b = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, -0.2, -0.3, 1.1, 1.2]), e = r.int(2, 3), val = dec(b ** e); return num(val, [`${PD(b)}^${e} = ${Array(e).fill(PD(b)).join(' × ')}.`, `= ${M(val)}.`, `So the answer is ${M(val)}.`], { q: `Evaluate: ${PD(b)}^${e}`, expr: `(${b})**${e}` }); }
    const d = r.int(2, 5); let n; do n = r.nonzero(-3, 3); while (gcd(n, d) !== 1); const e = r.int(2, 3), ans = frac(n ** e, d ** e);
    return num(ans, [`Raise the top and the bottom to the power ${e}.`, `${par(n)}^${e} = ${neg(n ** e)} and ${d}^${e} = ${d ** e}.`, `So (${F(n, d)})^${e} = ${M(ans)}.`], { q: `Evaluate: (${F(n, d)})^${e}`, expr: `(${n}/${d})**${e}` });
  }
  if (v === 2) {
    const b = r.int(2, 5), e = r.int(1, 3), t = r.int(0, 2);
    if (t === 0) return num(frac(1, b ** e), [`A negative exponent means 1 over the power: ${pw(b, -e)} = 1/${b}^${e}.`, `${b}^${e} = ${b ** e}, so the answer is 1/${b ** e}.`], { q: `Evaluate: ${pw(b, -e)}`, expr: `${b}**(-${e})` });
    if (t === 1) return num(b ** e, [`(1/${b})^(−${e}) flips the fraction: ${b}^${e}.`, `${b}^${e} = ${b ** e}.`, `So the answer is ${b ** e}.`], { q: `Evaluate: (1/${b})^(−${e})`, expr: `(1/${b})**(-${e})` });
    const c = r.nonzero(-20, 20); return num(1, ['Any number except 0 raised to the power 0 is 1.', `So ${par(c)}^0 = 1.`], { q: `Evaluate: ${par(c)}^0`, expr: `(${c})**0` });
  }
  const b = r.int(2, 9), e = r.int(3, 6), right = `${b}^${e}`;
  return mc(r, right, [`${e}^${b}`, `${b} × ${e}`, `${b}^${e + 1}`], { q: `Which power means ${Array(e).fill(b).join(' × ')}?`, steps: [`The base ${b} is multiplied ${e} times.`, `So it is ${right}.`] });
});

skill('9-explaws', 9, 'Exponents', 'Exponent laws with numbers', ['Multiplying powers with the same base: add the exponents. 3^4 × 3^2 = 3^6.', 'Dividing: subtract the exponents. 5^7 ÷ 5^3 = 5^4.', 'A power of a power: multiply the exponents. (2^3)^4 = 2^12.'], (r) => {
  const B = r.int(2, 9), t = r.int(0, 4);
  const nz = (lo, hi) => r.nonzero(lo, hi);
  const ask = (expr, k, steps) => num(k, [...steps, `So it is ${pw(B, k)}. The exponent is ${neg(k)}.`], { q: `Write as a single power of ${B}: ${expr}. What is the exponent?`, expr: String(k) });
  if (t === 0) { const m = nz(-4, 9), n = nz(-4, 9); return { ...ask(`${pw(B, m)} × ${pw(B, n)}`, m + n, [`Same base, multiplying: add the exponents.`, `${neg(m)} + ${par(n)} = ${neg(m + n)}.`]), expr: `${m}+(${n})` }; }
  if (t === 1) { const m = nz(-4, 12), n = nz(-4, 9); return { ...ask(`${pw(B, m)} ÷ ${pw(B, n)}`, m - n, [`Same base, dividing: subtract the exponents.`, `${neg(m)} − ${par(n)} = ${neg(m - n)}.`]), expr: `${m}-(${n})` }; }
  if (t === 2) { const m = nz(-3, 6), n = r.int(2, 4); return { ...ask(`(${pw(B, m)})^${n}`, m * n, [`A power of a power: multiply the exponents.`, `${neg(m)} × ${n} = ${neg(m * n)}.`]), expr: `${m}*${n}` }; }
  if (t === 3) { const a = r.int(1, 8), b = r.int(1, 8), c = r.int(1, 9); return { ...ask(`(${pw(B, a)} × ${pw(B, b)}) ÷ ${pw(B, c)}`, a + b - c, [`Top: ${a} + ${b} = ${a + b}.`, `Divide: ${a + b} − ${c} = ${neg(a + b - c)}.`]), expr: `${a}+${b}-${c}` }; }
  const b0 = r.int(2, 5), s = r.int(-2, 3); let a; do a = r.nonzero(-3, 6); while (s - a === 0); const b = s - a, ans = s >= 0 ? String(b0 ** s) : frac(1, b0 ** -s);
  return num(ans, [`Add the exponents: ${neg(a)} + ${par(b)} = ${neg(s)}, so it is ${pw(b0, s)}.`, s >= 0 ? `${pw(b0, s)} = ${ans}.` : `${pw(b0, s)} = 1/${b0}^${-s} = ${ans}.`, `So the answer is ${ans}.`], { q: `Evaluate: ${pw(b0, a)} × ${pw(b0, b)}`, expr: `${b0}**(${s})` });
});

skill('9-expvar', 9, 'Exponents', 'Exponent laws with variables', ['The same laws work for letters: x^3 × x^5 = x^8, x^9 ÷ x^4 = x^5, (x^2)^3 = x^6.', 'Write answers with positive exponents: x^(−2) = 1/x^2.'], (r) => {
  const v = r.pick(['x', 'y', 'a', 'n', 'm']), t = r.int(0, 4), P = (k) => vpow(v, k);
  if (t === 0) { const a = r.int(2, 9), b = r.int(2, 9); return mc(r, P(a + b), [P(a * b), P(a + b + 1), P(Math.abs(a - b) || a + b - 1)], { q: `Simplify: ${v}^${a} × ${v}^${b}`, steps: ['Same base, multiplying: add the exponents.', `${a} + ${b} = ${a + b}, so ${P(a + b)}.`] }); }
  if (t === 1) { const a = r.int(4, 12), b = r.int(1, a + 3); return mc(r, P(a - b), [P(a + b), P(b - a), P(a - b + 1)], { q: `Simplify: ${v}^${a} ÷ ${v}^${b}`, steps: ['Same base, dividing: subtract the exponents.', `${a} − ${b} = ${neg(a - b)}, so ${P(a - b)}.`] }); }
  if (t === 2) { const a = r.int(2, 6), b = r.int(2, 4); return mc(r, P(a * b), [P(a + b), P(a ** b), P(a * b + 1)], { q: `Simplify: (${v}^${a})^${b}`, steps: ['A power of a power: multiply the exponents.', `${a} × ${b} = ${a * b}, so ${P(a * b)}.`] }); }
  if (t === 3) { const a = r.int(2, 8), b = r.int(2, 8), c = r.int(1, 12), k = a + b - c; return mc(r, P(k), [P(a + b + c), P(a * b - c), P(c - a - b)], { q: `Simplify: ${v}^${a} × ${v}^${b} ÷ ${v}^${c}`, steps: [`Add for the top: ${a} + ${b} = ${a + b}.`, `Subtract the bottom: ${a + b} − ${c} = ${neg(k)}, so ${P(k)}.`] }); }
  let a, b; do { a = r.int(2, 4); b = r.int(2, 4); } while (a + b === a * b);
  const k = a * b, right = `(${v}^${a})^${b}`;
  return mc(r, right, [`${v}^${a} × ${v}^${b}`, `${v}^${k + 2} ÷ ${v}^3`, `(${v}^${k})^0`], { q: `Which expression is equal to ${v}^${k}?`, steps: [`(${v}^${a})^${b}: multiply the exponents, ${a} × ${b} = ${k}.`, `${v}^${a} × ${v}^${b} = ${v}^${a + b}, and ${v}^${k + 2} ÷ ${v}^3 = ${v}^${k - 1}, so they do not match.`, `The answer is ${right}.`] });
});

// ───────────── Scientific notation ─────────────
const sci = (m, e) => `${dec(m)} × 10^${e < 0 ? `(${neg(e)})` : e}`;
const stdForm = (digits, p) => { if (p >= 0) return String(digits) + '0'.repeat(p); const s = String(digits).padStart(-p + 1, '0'), cut = s.length + p; return s.slice(0, cut) + '.' + s.slice(cut); };
skill('9-scinot', 9, 'Scientific notation', 'Scientific notation', ['Scientific notation is a number from 1 to just under 10, times a power of 10: 45 000 = 4.5 × 10^4.', 'A negative power of 10 is for a small number: 0.0045 = 4.5 × 10^(−3).', 'To multiply, multiply the front numbers and add the exponents; to divide, divide them and subtract.'], (r) => {
  const pick = () => { const two = r.bool(0.7); let d; do d = two ? r.int(11, 99) : r.int(2, 9); while (d % 10 === 0); const e = r.nonzero(-6, 9); return { d, m: two ? d / 10 : d, e, p: e - (two ? 1 : 0) }; };
  const v = r.int(0, 4);
  if (v === 0) {
    const { d, m, e, p } = pick(), std = stdForm(d, p), show = p >= 0 && d * 10 ** p >= 10000 ? comma(d * 10 ** p) : std;
    return mc(r, sci(m, e), [sci(m, e + 1), sci(m, e - 1), sci(m, -e)], { q: `Write ${show} in scientific notation.`, steps: [`Move the decimal point to get a number from 1 to 10: ${dec(m)}.`, `It moved ${Math.abs(e)} place${Math.abs(e) > 1 ? 's' : ''} ${e > 0 ? 'left, so the power is positive' : 'right, so the power is negative'}.`, `So ${show} = ${sci(m, e)}.`] });
  }
  if (v === 1) {
    const { d, m, e, p } = pick(), std = stdForm(d, p);
    return num(std, [`10^${e < 0 ? `(${neg(e)})` : e} means move the decimal point ${Math.abs(e)} place${Math.abs(e) > 1 ? 's' : ''} to the ${e > 0 ? 'right' : 'left'}.`, `${dec(m)} becomes ${std}.`, `So ${sci(m, e)} = ${std}.`], { q: `Write ${sci(m, e)} in standard form.`, expr: `${m}*10**(${e})` });
  }
  if (v === 2) {
    const A = pick(); let B = pick(); if (r.bool(0.4)) B = { ...pick(), e: A.e };
    const va = A.m * 10 ** A.e, vb = B.m * 10 ** B.e, sign = va > vb ? '>' : va < vb ? '<' : '=';
    return mc(r, sign, ['<', '>', '='].filter((x) => x !== sign), { q: `Which sign makes this true?  ${sci(A.m, A.e)} ? ${sci(B.m, B.e)}`, steps: [A.e === B.e ? 'The powers of 10 are the same, so compare the front numbers.' : 'Compare the powers of 10 first: the bigger power is the bigger number.', A.e === B.e ? `${dec(A.m)} ${sign} ${dec(B.m)}.` : `10^${A.e < 0 ? `(${neg(A.e)})` : A.e} ${A.e > B.e ? '>' : '<'} 10^${B.e < 0 ? `(${neg(B.e)})` : B.e}.`, `So ${sci(A.m, A.e)} ${sign} ${sci(B.m, B.e)}.`] });
  }
  if (v === 3) {
    const a = r.int(11, 49) / 10, b = r.int(2, 9), p = r.int(-5, 8), q = r.int(-5, 8), prod = rnd(a * b, 4);
    const big = prod >= 10, m = big ? rnd(prod / 10, 4) : prod, e = p + q + (big ? 1 : 0);
    return mc(r, sci(m, e), [sci(m, p * q === e ? e + 2 : p * q), sci(m, e + (big ? -1 : 1)), sci(m, e - 2)], { q: `Multiply: (${sci(a, p)}) × (${sci(b, q)})`, steps: [`Multiply the front numbers: ${dec(a)} × ${b} = ${dec(prod)}.`, `Add the exponents: ${neg(p)} + ${par(q)} = ${neg(p + q)}.`, big ? `${dec(prod)} is 10 or more, so write ${dec(m)} and add 1 to the exponent: ${sci(m, e)}.` : `So the answer is ${sci(m, e)}.`] });
  }
  const b = r.pick([2, 3, 4, 5, 1.5, 2.5]); let c; do c = r.int(11, 99); while (c % 10 === 0); c /= 10;
  const p = r.int(-4, 9), q = r.int(-4, 6), raw = rnd(b * c, 4), big = raw >= 10, a = big ? rnd(raw / 10, 4) : raw, pa = big ? p + 1 : p;
  return mc(r, sci(c, p - q), [sci(c, p + q), sci(c, p - q + 1), sci(c, q - p)], { q: `Divide: (${sci(a, pa)}) ÷ (${sci(b, q)})`, steps: [`Divide the front numbers: ${dec(a)} ÷ ${dec(b)} = ${dec(rnd(a / b, 4))}.`, `Subtract the exponents: ${neg(pa)} − ${par(q)} = ${neg(pa - q)}.`, big ? `Make the front number 1 to 10: ${dec(rnd(a / b, 4))} × 10^${pa - q < 0 ? `(${neg(pa - q)})` : pa - q} = ${sci(c, p - q)}.` : `So the answer is ${sci(c, p - q)}.`] });
});

// ───────────── Problem solving ─────────────
skill('9-wordprob', 9, 'Problem solving', 'Word problems: money, integers, travel and averages', ['Read carefully, name the unknown, and write an equation or a plan.', 'Consecutive integers are n, n + 1, n + 2, …; consecutive even (or odd) integers are n, n + 2, n + 4, ….', 'Distance = speed × time. A weighted average multiplies each value by its weight before adding.'], (r) => {
  const v = r.int(0, 3), nm = r.pick(NAMES);
  if (v === 0) {
    const pc = r.int(20, 160) * 5, n = r.int(2, 6), tot = pc * n, bill = [1000, 2000, 5000, 10000].find((b) => b > tot), ch = bill - tot, item = r.pick(['notebooks', 'smoothies', 'bus tickets', 'sandwiches']);
    return num(dec(ch / 100), [`Cost: ${n} × ${money(pc / 100)} = ${money(tot / 100)}.`, `Change: ${money(bill / 100)} − ${money(tot / 100)} = ${money(ch / 100)}.`, `${nm} gets ${money(ch / 100)} back.`], { q: `${nm} buys ${n} ${item} at ${money(pc / 100)} each and pays with a $${bill / 100} bill. How much change does ${nm} get?`, unit: '$', expr: `(${bill}-${n}*${pc})/100` });
  }
  if (v === 1) {
    if (r.bool()) { const k = r.int(-10, 60), S = 3 * k + 3; return num(k, ['Call them n, n + 1 and n + 2.', `3n + 3 = ${S}, so 3n = ${S - 3} and n = ${neg(k)}.`, `The integers are ${neg(k)}, ${neg(k + 1)}, ${neg(k + 2)}. The smallest is ${neg(k)}.`], { q: `The sum of three consecutive integers is ${S}. What is the smallest of them?`, expr: `(${S}-3)/3` }); }
    const k = 2 * r.int(2, 40), S = 2 * k + 2; return num(k + 2, ['Call them n and n + 2.', `2n + 2 = ${S}, so 2n = ${S - 2} and n = ${k}.`, `The numbers are ${k} and ${k + 2}. The larger is ${k + 2}.`], { q: `Two consecutive even numbers add to ${S}. What is the larger one?`, expr: `(${S}-2)/2+2` });
  }
  if (v === 2) {
    if (r.bool()) { const s = r.pick([60, 72, 80, 90, 100]), t = r.int(2, 10) / 2, d = s * t; return num(dec(t), ['Time = distance ÷ speed.', `${d} ÷ ${s} = ${dec(t)}.`, `It takes ${dec(t)} hours.`], { q: `A bus travels ${d} km at ${s} km/h. How many hours does the trip take?`, unit: 'h', expr: `${d}/${s}` }); }
    const s1 = r.pick([60, 70, 80, 90]), s2 = r.pick([50, 65, 75, 100]), t = r.pick([1, 1.5, 2, 2.5, 3]), d = (s1 + s2) * t;
    return num(dec(t), [`They close the gap at ${s1} + ${s2} = ${s1 + s2} km/h.`, `Time = ${d} ÷ ${s1 + s2} = ${dec(t)}.`, `They meet after ${dec(t)} hours.`], { q: `Two cars are ${d} km apart and drive toward each other, one at ${s1} km/h and the other at ${s2} km/h. After how many hours do they meet?`, unit: 'h', expr: `${d}/(${s1}+${s2})` });
  }
  if (r.bool()) {
    const w1 = r.pick([40, 60, 70, 75, 80]), w2 = 100 - w1, m1 = r.int(55, 98), m2 = r.int(55, 98), avg = dec((w1 * m1 + w2 * m2) / 100);
    return num(avg, [`Multiply each mark by its weight: ${dec(w1 / 100)} × ${m1} + ${dec(w2 / 100)} × ${m2}.`, `= ${dec(w1 * m1 / 100)} + ${dec(w2 * m2 / 100)} = ${avg}.`, `The final mark is ${avg}%.`], { q: `In ${nm}'s course, term work counts for ${w1}% and the final exam for ${w2}%. ${nm} has ${m1}% on term work and ${m2}% on the exam. What is the final mark?`, unit: '%', expr: `(${w1}*${m1}+${w2}*${m2})/100` });
  }
  const k1 = r.int(2, 8), k2 = 10 - k1, p1 = r.int(10, 20), p2 = r.int(4, 9), avg = dec((k1 * p1 + k2 * p2) / 10);
  return num(avg, [`Total cost: ${k1} × $${p1} + ${k2} × $${p2} = $${k1 * p1 + k2 * p2}.`, `Total mass: ${k1} + ${k2} = 10 kg. $${k1 * p1 + k2 * p2} ÷ 10 = $${avg}.`, `The mix costs $${avg} per kg.`], { q: `A store mixes ${k1} kg of nuts that cost $${p1}/kg with ${k2} kg of raisins that cost $${p2}/kg. What is the cost per kilogram of the mix?`, unit: '$', expr: `(${k1}*${p1}+${k2}*${p2})/10` });
});

// ───────────── Number sequences ─────────────
skill('9-sequence', 9, 'Number sequences', 'Arithmetic and geometric sequences', ['In an arithmetic sequence you add the same number each time (the common difference d): aₙ = a₁ + (n − 1)d.', 'In a geometric sequence you multiply by the same number each time (the common ratio r): aₙ = a₁ × r^(n − 1).'], (r) => {
  const v = r.int(0, 4);
  const arith = () => { const a = r.int(-10, 20), d = r.nonzero(-7, 9); return { a, d, terms: [0, 1, 2, 3].map((i) => a + i * d) }; };
  if (v === 0) {
    const t = r.int(0, 2); let terms, right, why;
    if (t === 0) { const s = arith(); terms = [...s.terms, s.a + 4 * s.d]; right = 'arithmetic'; why = `each term is ${s.d > 0 ? s.d + ' more' : -s.d + ' less'} than the one before`; }
    else if (t === 1) { const a = r.pick([1, 2, 3, 5, -2]), q = r.pick([2, 3, -2, -3]); terms = [0, 1, 2, 3, 4].map((i) => a * q ** i); right = 'geometric'; why = `each term is the one before × ${par(q)}`; }
    else { const k = r.int(1, 6); terms = [0, 1, 2, 3, 4].map((i) => (k + i) ** 2); right = 'neither'; why = `the differences (${terms.slice(1).map((x, i) => x - terms[i]).join(', ')}) change, and so do the ratios`; }
    return mc(r, right, ['arithmetic', 'geometric', 'neither'].filter((x) => x !== right), { q: `Is this sequence arithmetic, geometric or neither?  ${terms.map(neg).join(', ')}, …`, steps: [`Look at how each term changes: ${why}.`, `So it is ${right}.`] });
  }
  if (v === 1) { const { a, d, terms } = arith(), n = r.int(8, 40), ans = a + (n - 1) * d; return num(ans, [`a₁ = ${neg(a)} and d = ${neg(d)}.`, `a${n} = ${neg(a)} + (${n} − 1) × ${par(d)} = ${neg(a)} ${sgn((n - 1) * d)}.`, `= ${neg(ans)}. The ${ord(n)} term is ${neg(ans)}.`], { q: `What is the ${ord(n)} term of this sequence?  ${terms.map(neg).join(', ')}, …`, expr: `${a}+(${n}-1)*(${d})` }); }
  if (v === 2) { const a = r.pick([1, 2, 3, -1, -2]), q = r.pick([2, 3, -2]), n = r.int(5, 7), ans = a * q ** (n - 1); return num(ans, [`a₁ = ${neg(a)} and the ratio is ${neg(q)}.`, `a${n} = ${neg(a)} × ${par(q)}^${n - 1} = ${neg(a)} × ${neg(q ** (n - 1))}.`, `= ${neg(ans)}. The ${ord(n)} term is ${neg(ans)}.`], { q: `What is the ${ord(n)} term of this sequence?  ${[0, 1, 2, 3].map((i) => neg(a * q ** i)).join(', ')}, …`, expr: `${a}*(${q})**${n - 1}` }); }
  if (v === 3) {
    if (r.bool()) { const { a, d, terms } = arith(), right = `aₙ = ${lin(d, a - d, 'n')}`; return mc(r, right, [`aₙ = ${lin(d, a, 'n')}`, `aₙ = ${lin(a, d - a, 'n')}`, `aₙ = ${lin(-d, a + d, 'n')}`], { q: `Which formula gives the nth term?  ${terms.map(neg).join(', ')}, …`, steps: [`d = ${neg(d)}, so the formula starts ${neg(d)}n.`, `For n = 1 it must give ${neg(a)}: ${neg(d)} ${sgn(a - d)} = ${neg(a)}.`, `So ${right}.`] }); }
    const a = r.pick([2, 3, 4, 5]), q = r.pick([2, 3]), right = `aₙ = ${a} × ${q}^(n − 1)`;
    return mc(r, right, [`aₙ = ${q} × ${a}^(n − 1)`, `aₙ = ${a} × ${q}^n`, `aₙ = ${a} + ${q}(n − 1)`], { q: `Which formula gives the nth term?  ${[0, 1, 2, 3].map((i) => a * q ** i).join(', ')}, …`, steps: [`The first term is ${a} and the ratio is ${q}.`, `So ${right}.`] });
  }
  const p = r.nonzero(-6, 8), c = r.int(-10, 10), n = r.int(5, 30), ans = p * n + c;
  return num(ans, [`Put n = ${n} into ${lin(p, c, 'n')}.`, `${p} × ${n} ${sgn(c)} = ${neg(p * n)} ${sgn(c)}.`, `= ${neg(ans)}. The ${ord(n)} term is ${neg(ans)}.`], { q: `A sequence has aₙ = ${lin(p, c, 'n')}. What is the ${ord(n)} term?`, expr: `${p}*${n}+(${c})` });
});

// ───────────── Variable expressions and equations ─────────────
skill('9-writeexpr', 9, 'Variable expressions and equations', 'Write and match expressions', ['Turn words into symbols: "less than" means subtract, but the order flips: "5 less than n" is n − 5.', '"Times the sum" means brackets: 3 times the sum of n and 4 is 3(n + 4).', 'Two expressions are equivalent if they simplify to the same thing.'], (r) => {
  const k = r.int(2, 12), m = r.int(2, 12), nm = r.pick(NAMES);
  if (r.bool(0.7)) {
    const B = [
      [`${k} less than a number n`, `n − ${k}`, [`${k} − n`, `n + ${k}`, `${k}n`]],
      [`${k} times the sum of a number n and ${m}`, `${k}(n + ${m})`, [`${k}n + ${m}`, `${k} + n + ${m}`, `n(${k} + ${m})`]],
      [`the quotient of a number n and ${k}, increased by ${m}`, `n/${k} + ${m}`, [`n/(${k} + ${m})`, `${k}/n + ${m}`, `${k}n + ${m}`]],
      [`${k} more than twice a number n`, `2n + ${k}`, [`2(n + ${k})`, `${k}n + 2`, `2n − ${k}`]],
      [`the square of a number n, minus ${k}`, `n^2 − ${k}`, [`2n − ${k}`, `(n − ${k})^2`, `${k} − n^2`]],
      [`${k} less than three times a number is ${m}`, `3n − ${k} = ${m}`, [`${k} − 3n = ${m}`, `3(n − ${k}) = ${m}`, `3n + ${k} = ${m}`]],
      [`the amount ${nm} has after w weeks, starting with $${k * 5} and saving $${m} each week`, `${k * 5} + ${m}w`, [`${m} + ${k * 5}w`, `${k * 5 + m}w`, `${k * 5} − ${m}w`]],
    ];
    const [words, right, wrongs] = r.pick(B);
    return mc(r, right, wrongs, { q: `Which ${right.includes('=') ? 'equation' : 'expression'} shows ${words}?`, steps: ['Turn each phrase into symbols, in order of meaning.', `So it is ${right}.`] });
  }
  let a = r.int(2, 6), c = r.int(1, 5); while (a === c) c = r.int(1, 5);
  const b = r.nonzero(-8, 8), right = lin(a - c, a * b);
  return mc(r, right, [lin(a - c, b), lin(a + c, a * b), lin(a - c, -a * b)], { q: `Which expression is equivalent to ${a}(x ${sgn(b)}) − ${c}x?`, steps: [`Distribute: ${a}(x ${sgn(b)}) = ${lin(a, a * b)}.`, `Combine like terms: ${a}x − ${c}x = ${lin(a - c, 0)}.`, `So it is ${right}.`] });
});

skill('9-satisfy', 9, 'Variable expressions and equations', 'Check solutions and rearrange formulas', ['To check a solution, put it in for the letter: if both sides come out equal, it works.', 'To rearrange a formula, undo what is done to the letter you want, the same way you solve an equation.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const s = r.int(-6, 8), a = r.int(2, 7), c = r.nonzero(-4, 4) + a, b = r.int(-10, 10), d = (a - c) * s + b, t = r.bool() ? s : s + r.nonzero(-2, 2);
    const L = a * t + b, R = c * t + d, ok = L === R;
    return mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], { q: `Is x = ${neg(t)} a solution of ${lin(a, b)} = ${lin(c, d)}?`, steps: [`Left: ${a}${par(t)} ${sgn(b)} = ${neg(L)}.`, `Right: ${c}${par(t)} ${sgn(d)} = ${neg(R)}.`, ok ? 'Both sides are equal, so Yes.' : 'The sides are not equal, so No.'] });
  }
  if (v === 1) {
    const a = r.int(2, 5), b = r.int(2, 4), c = r.int(2, 6), dv = r.pick([2, 3, 4, 6]), e = dv * r.int(2, 8), k = r.int(1, 20);
    const rhs = a * b ** 2 - e / dv;
    return num(rhs + k, [`Work out the right side: ${b}^2 = ${b * b}, ${a} × ${b * b} = ${a * b * b}, ${e} ÷ ${dv} = ${e / dv}.`, `${a * b * b} − ${e / dv} = ${rhs}, so x − ${k} = ${neg(rhs)}.`, `Add ${k}: x = ${neg(rhs + k)}.`], { q: `Solve: x − ${k} = ${a} × ${b}^2 − ${e} ÷ ${dv}`, unit: 'x =', expr: `${a}*${b}**2-${e}/${dv}+${k}` });
  }
  const B = [
    ['A = lw', 'w', 'w = A/l', ['w = Al', 'w = l/A', 'w = A − l'], 'divide both sides by l'],
    ['P = 2l + 2w', 'l', 'l = (P − 2w)/2', ['l = P − 2w', 'l = P/2 − 2w', 'l = (P + 2w)/2'], 'subtract 2w, then divide by 2'],
    ['v = u + at', 't', 't = (v − u)/a', ['t = a(v − u)', 't = (v + u)/a', 't = v/a − u'], 'subtract u, then divide by a'],
    ['y = mx + b', 'x', 'x = (y − b)/m', ['x = y/m − b', 'x = m(y − b)', 'x = (y + b)/m'], 'subtract b, then divide by m'],
    ['d = rt', 'r', 'r = d/t', ['r = dt', 'r = t/d', 'r = d − t'], 'divide both sides by t'],
    ['C = 2πr', 'r', 'r = C/(2π)', ['r = 2πC', 'r = C − 2π', 'r = 2π/C'], 'divide both sides by 2π'],
    ['F = 9C/5 + 32', 'C', 'C = 5(F − 32)/9', ['C = 9(F − 32)/5', 'C = 5F/9 − 32', 'C = 5(F + 32)/9'], 'subtract 32, then multiply by 5/9'],
    ['ax + by = c', 'y', 'y = (c − ax)/b', ['y = (c + ax)/b', 'y = c/b − ax', 'y = b(c − ax)'], 'subtract ax, then divide by b'],
  ];
  const [f, letter, right, wrongs, how] = r.pick(B);
  return mc(r, right, wrongs, { q: `Solve ${f} for ${letter}.`, steps: [`Get ${letter} by itself: ${how}.`, `So ${right}.`] });
});

// ───────────── Solve equations ─────────────
skill('9-solve', 9, 'Solve equations', 'Solve linear equations', ['Undo the operations in reverse order, doing the same thing to both sides.', 'With brackets, divide by the number outside or distribute first.', 'Check by putting your answer back into the equation.'], (r) => {
  const x = r.nonzero(-12, 12), v = r.int(0, 2), E = (lines) => eqnLines(lines);
  if (v === 0) {
    const t = r.int(0, 3), a = r.int(2, 12);
    if (t === 0) { const c = x + a; return num(x, [St(`Subtract ${a} from both sides.`, E([{ eq: `x + ${a} = ${neg(c)}` }, { eq: `x = ${neg(x)}`, note: `− ${a}` }])), `x = ${neg(x)}.`], { q: `Solve: x + ${a} = ${neg(c)}`, unit: 'x =', expr: `${c}-${a}` }); }
    if (t === 1) { const c = x - a; return num(x, [St(`Add ${a} to both sides.`, E([{ eq: `x − ${a} = ${neg(c)}` }, { eq: `x = ${neg(x)}`, note: `+ ${a}` }])), `x = ${neg(x)}.`], { q: `Solve: x − ${a} = ${neg(c)}`, unit: 'x =', expr: `${c}+${a}` }); }
    if (t === 2) { const k = r.nonzero(-9, 9) * (r.bool() ? 1 : 1), c = k * x; return num(x, [St(`Divide both sides by ${neg(k)}.`, E([{ eq: `${neg(k)}x = ${neg(c)}` }, { eq: `x = ${neg(x)}`, note: `÷ ${par(k)}` }])), `x = ${neg(c)} ÷ ${par(k)} = ${neg(x)}.`], { q: `Solve: ${k === 1 ? '' : k === -1 ? '−' : neg(k)}x = ${neg(c)}`, unit: 'x =', expr: `${c}/(${k})` }); }
    const c = r.nonzero(-9, 9), X = a * c; return num(X, [St(`Multiply both sides by ${a}.`, E([{ eq: `x/${a} = ${neg(c)}` }, { eq: `x = ${neg(X)}`, note: `× ${a}` }])), `x = ${neg(c)} × ${a} = ${neg(X)}.`], { q: `Solve: x/${a} = ${neg(c)}`, unit: 'x =', expr: `${c}*${a}` });
  }
  if (v === 1) {
    const a = r.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), b = r.nonzero(-15, 15), c = a * x + b;
    return num(x, [St(`Undo the ${b > 0 ? 'adding' : 'subtracting'}: ${b > 0 ? 'subtract' : 'add'} ${Math.abs(b)} on both sides.`, E([{ eq: `${lin(a, b)} = ${neg(c)}` }, { eq: `${lin(a, 0)} = ${neg(c - b)}`, note: `${b > 0 ? '−' : '+'} ${Math.abs(b)}` }])), `Divide both sides by ${neg(a)}: x = ${neg(c - b)} ÷ ${par(a)}.`, `x = ${neg(x)}.`], { q: `Solve: ${lin(a, b)} = ${neg(c)}`, unit: 'x =', expr: `(${c}-(${b}))/(${a})` });
  }
  const t = r.int(0, 1);
  if (t === 0) { const a = r.int(2, 6), b = r.nonzero(-9, 9), c = a * (x + b); return num(x, [`Divide both sides by ${a}: x ${sgn(b)} = ${neg(c / a)}.`, `${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: x = ${neg(c / a)} ${b > 0 ? '−' : '+'} ${Math.abs(b)}.`, `x = ${neg(x)}.`], { q: `Solve: ${a}(x ${sgn(b)}) = ${neg(c)}`, unit: 'x =', expr: `${c}/${a}-(${b})` }); }
  const a = r.int(2, 6), b = r.nonzero(-9, 9), c = r.nonzero(-9, 9), X = a * (c - b);
  return num(X, [`${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: x/${a} = ${neg(c - b)}.`, `Multiply both sides by ${a}: x = ${neg(c - b)} × ${a}.`, `x = ${neg(X)}.`], { q: `Solve: x/${a} ${sgn(b)} = ${neg(c)}`, unit: 'x =', expr: `${a}*(${c}-(${b}))` });
});

skill('9-numsol', 9, 'Solve equations', 'How many solutions?', ['Simplify both sides. If the x terms cancel and the numbers match (like 5 = 5), every x works: infinitely many solutions.', 'If the x terms cancel and the numbers do not match (like 5 = 2), nothing works: no solution.', 'Otherwise there is exactly one solution.'], (r) => {
  const a = r.int(2, 6), b = r.nonzero(-8, 8), t = r.int(0, 2), choices = ['one solution', 'no solution', 'infinitely many solutions'];
  if (r.bool(0.7)) {
    let q, right, why;
    if (t === 0) { let c = r.int(1, 7); while (c === a) c++; const d = r.int(-12, 12); q = `${a}(x ${sgn(b)}) = ${lin(c, d)}`; right = choices[0]; why = `The x terms are ${a}x and ${c}x: they do not cancel, so there is exactly one x that works`; }
    else if (t === 1) { let e = r.int(-20, 20); while (e === a * b) e++; q = `${a}(x ${sgn(b)}) = ${lin(a, e)}`; right = choices[1]; why = `${lin(a, a * b)} = ${lin(a, e)}: take away ${a}x and you get ${neg(a * b)} = ${neg(e)}, which is false`; }
    else { const c = r.int(1, 4); q = `${a}(x ${sgn(b)}) + ${c}x = ${lin(a + c, a * b)}`; right = choices[2]; why = `the left side simplifies to ${lin(a + c, a * b)}, exactly the right side, so it is true for every x`; }
    return mc(r, right, choices.filter((c) => c !== right), { q: `How many solutions does ${q} have?`, steps: [`Simplify: ${why}.`, `So it has ${right}.`] });
  }
  if (r.bool()) return num(a * b, [`For infinitely many solutions, both sides must be the same expression.`, `${a}(x ${sgn(b)}) = ${lin(a, a * b)}, so the box must be ${neg(a * b)}.`, `The number is ${neg(a * b)}.`], { q: `What number in the box makes ${a}(x ${sgn(b)}) = ${a}x + □ true for every x (infinitely many solutions)?`, expr: `${a}*(${b})` });
  let d = r.int(-12, 12); if (d === b) d++;
  return num(a, ['For no solution, the x terms must cancel but the numbers must differ.', `The x terms cancel only if the box is ${a}; then ${neg(b)} ≠ ${neg(d)}.`, `The number is ${a}.`], { q: `What number in the box makes ${lin(a, b)} = □x ${sgn(d)} have no solution?`.replace(/□x \+ 0$/, '□x'), expr: `${a}` });
});

skill('9-eqword', 9, 'Solve equations', 'Equations from words and diagrams', ['Name the unknown with a letter, write an equation from the story or the picture, then solve it.', 'The angles in a triangle add to 180°; the perimeter of a rectangle is 2l + 2w.'], (r) => {
  const v = r.int(0, 4), nm = r.pick(NAMES);
  if (v === 0) { let x, k; do { x = r.int(20, 42); k = 180 - 4 * x; } while (k <= 0); return num(x, [`The angles add to 180°: x + 2x + (x + ${k}) = 180.`, `4x + ${k} = 180, so 4x = ${180 - k}.`, `x = ${x}.`], { q: `A triangle has angles of x, 2x and (x + ${k}) degrees. Find x.`, unit: 'x =', expr: `(180-${k})/4` }); }
  if (v === 1) { const w = r.int(3, 30), k = r.int(2, 15), P = 2 * (w + k) + 2 * w; return num(w, [`Length = w + ${k}. Perimeter: 2(w + ${k}) + 2w = ${P}.`, `4w + ${2 * k} = ${P}, so 4w = ${P - 2 * k}.`, `w = ${w}. The width is ${w} m.`], { q: `A garden's length is ${k} m more than its width. Its perimeter is ${P} m. What is its width?`, unit: 'm', expr: `(${P}-2*${k})/4` }); }
  if (v === 2) { const f = r.int(2, 10) * 5, m = r.int(20, 60), n = r.int(2, 12), T = f + m * n; return num(n, [`Equation: ${f} + ${m}n = ${T}.`, `${m}n = ${T - f}, so n = ${T - f} ÷ ${m}.`, `n = ${n}. That is ${n} months.`], { q: `A gym charges $${f} to join plus $${m} a month. ${nm} has paid $${T} in total. For how many months?`, unit: 'months', expr: `(${T}-${f})/${m}` }); }
  if (v === 3) { const b = r.int(3, 15), k = r.int(2, 4), S = b * (k + 1); return num(b, [`Let the brother's age be b. Then ${nm} is ${k}b.`, `b + ${k}b = ${S}, so ${k + 1}b = ${S}.`, `b = ${b}. The brother is ${b}.`], { q: `${nm} is ${k} times as old as a younger brother. Together their ages add to ${S}. How old is the brother?`, expr: `${S}/${k + 1}` }); }
  const a = r.int(3, 7), c = r.int(1, a - 1), x = r.int(2, 9), b = r.int(1, Math.min(9, (a - c) * x - 1)), d = (a - c) * x - b;
  return num(x, [`The equal sides give ${a}x − ${b} = ${lin(c, d)}.`, `${a - c}x = ${d + b}, so x = ${d + b} ÷ ${a - c}.`, `x = ${x}.`], { q: `Two equal sides of an isosceles triangle are (${a}x − ${b}) cm and (${lin(c, d)}) cm long. Find x.`, unit: 'x =', expr: `(${b}+${d})/(${a - c})` });
});

// ───────────── Single-variable inequalities ─────────────
const FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }, ASC = { '<': '<', '>': '>', '≤': '<=', '≥': '>=' };
const ineqAns = (op, v, steps, extra = {}) => txt(`x ${op} ${neg(v)}`, steps, { accept: [`x${op}${v}`, `x ${ASC[op]} ${v}`, `x${ASC[op]}${v}`, `${v} ${FLIP[op]} x`, `${v}${FLIP[op]}x`, `${v} ${ASC[FLIP[op]]} x`, `${v}${ASC[FLIP[op]]}x`], ...extra });
const graphOf = (op, v) => `${op === '<' || op === '>' ? 'an open' : 'a closed'} circle at ${neg(v)}, shaded to the ${op === '<' || op === '≤' ? 'left' : 'right'}`;
skill('9-ineqgraph', 9, 'Single-variable inequalities', 'Inequalities and their graphs', ['< and > use an open circle (the number itself is not included); ≤ and ≥ use a closed circle.', 'Shade to the right for "greater than" and to the left for "less than".', '"At least" means ≥ and "at most" or "no more than" means ≤.'], (r) => {
  const v = r.int(0, 3), ops = ['<', '>', '≤', '≥'], op = r.pick(ops), n = r.int(-9, 9);
  if (v === 0) { const right = graphOf(op, n); return mc(r, right, ops.filter((o) => o !== op).map((o) => graphOf(o, n)), { q: `Which describes the graph of x ${op} ${neg(n)} on a number line?`, visual: numberLine(n - 5, n + 5, { marks: [n] }), steps: [`${op === '<' || op === '>' ? `${neg(n)} is not included: open circle` : `${neg(n)} is included: closed circle`}.`, `x is ${op === '<' || op === '≤' ? 'less' : 'greater'}, so shade to the ${op === '<' || op === '≤' ? 'left' : 'right'}.`, `So: ${right}.`] }); }
  if (v === 1) { const right = `x ${op} ${neg(n)}`; return mc(r, right, ops.filter((o) => o !== op).map((o) => `x ${o} ${neg(n)}`), { q: 'Which inequality does the graph show?', visual: { type: 'numberline', from: n - 5, to: n + 5, step: 1, ray: { at: n, dir: op === '<' || op === '≤' ? 'left' : 'right', open: op === '<' || op === '>' } }, steps: [`${op === '<' || op === '>' ? 'An open circle means < or >' : 'A closed circle means ≤ or ≥'}.`, `Shaded to the ${op === '<' || op === '≤' ? 'left means less' : 'right means greater'}: ${right}.`] }); }
  if (v === 2) {
    const C = [['To ride the roller coaster you must be at least {n} cm tall. (h = height)', 'h', '≥', r.int(110, 140)], ['A room can hold no more than {n} people. (p = people)', 'p', '≤', r.int(20, 80)], ['You need more than {n} points to win. (s = score)', 's', '>', r.int(50, 99)], ['The trip must take less than {n} hours. (t = time)', 't', '<', r.int(2, 9)], ['A bag can weigh at most {n} kg. (w = mass)', 'w', '≤', r.int(15, 30)], ['A volunteer must be at least {n} years old. (a = age)', 'a', '≥', r.int(13, 18)]];
    const [s, L, o, k] = r.pick(C), right = `${L} ${o} ${k}`;
    return mc(r, right, ops.filter((x) => x !== o).map((x) => `${L} ${x} ${k}`), { q: `Which inequality matches? ${s.replace('{n}', k)}`, steps: [`${{ '≥': '"At least" means ≥', '≤': '"At most" or "no more than" means ≤', '>': '"More than" means >', '<': '"Less than" means <' }[o]}.`, `So ${right}.`] });
  }
  const a = r.int(2, 5), b = r.nonzero(-9, 9), c = a * n + b, dir = op === '>' || op === '≥' ? 1 : -1;
  const right = n + dir * r.int(op === '≤' || op === '≥' ? 0 : 1, 4), wrongs = []; for (const k of r.shuffle([1, 2, 3, 4, 5])) { if (wrongs.length < 3) wrongs.push(n - dir * k); }
  if (op === '<' || op === '>') wrongs[0] = n;
  return mc(r, neg(right), wrongs.map(neg), { q: `Which value of x is a solution of ${lin(a, b)} ${op} ${neg(c)}?`, steps: [`Solve: ${a}x ${op} ${neg(c - b)}, so x ${op} ${neg(n)}.`, `Only ${neg(right)} makes x ${op} ${neg(n)} true.`, `The answer is ${neg(right)}.`] });
});

skill('9-ineqsolve', 9, 'Single-variable inequalities', 'Solve linear inequalities', ['Solve an inequality like an equation.', 'When you multiply or divide both sides by a negative number, flip the sign: −2x < 6 becomes x > −3.', 'Write the answer with x first, like x ≥ 4.'], (r) => {
  const ops = ['<', '>', '≤', '≥'], op = r.pick(ops), v = r.nonzero(-9, 9), t = r.int(0, 4), tail = ' Write your answer like x > 4.';
  if (t === 0) { const a = r.nonzero(-12, 12), c = v + a; return ineqAns(op, v, [`${a > 0 ? 'Subtract' : 'Add'} ${Math.abs(a)} on both sides.`, `x ${op} ${neg(c)} ${a > 0 ? '−' : '+'} ${Math.abs(a)}, so x ${op} ${neg(v)}.`], { q: `Solve: x ${sgn(a)} ${op} ${neg(c)}.${tail}` }); }
  if (t === 1) {
    const a = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), c = a * v, fo = a < 0 ? FLIP[op] : op;
    return ineqAns(fo, v, [`Divide both sides by ${neg(a)}.`, a < 0 ? `Dividing by a negative flips the sign: ${op} becomes ${fo}.` : 'Dividing by a positive keeps the sign.', `x ${fo} ${neg(c)} ÷ ${par(a)}, so x ${fo} ${neg(v)}.`], { q: `Solve: ${neg(a)}x ${op} ${neg(c)}.${tail}` });
  }
  if (t === 2) {
    const a = r.pick([-4, -3, -2, 2, 3, 4, 5]), c = r.nonzero(-6, 6), X = a * c, fo = a < 0 ? FLIP[op] : op;
    return ineqAns(fo, X, [`Multiply both sides by ${neg(a)}.`, a < 0 ? `Multiplying by a negative flips the sign: ${op} becomes ${fo}.` : 'Multiplying by a positive keeps the sign.', `x ${fo} ${neg(c)} × ${par(a)}, so x ${fo} ${neg(X)}.`], { q: `Solve: x/${par(a)} ${op} ${neg(c)}.${tail}` });
  }
  if (t === 3) {
    const a = r.pick([-5, -4, -3, -2, 2, 3, 4, 5]), b = r.nonzero(-12, 12), c = a * v + b, fo = a < 0 ? FLIP[op] : op;
    if (r.bool(0.3)) { const right = graphOf(fo, v); return mc(r, right, ops.filter((o) => o !== fo).map((o) => graphOf(o, v)), { q: `Solve ${lin(a, b)} ${op} ${neg(c)}. Which describes the graph of the solution?`, steps: [`${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: ${lin(a, 0)} ${op} ${neg(c - b)}.`, `Divide by ${neg(a)}${a < 0 ? ' and flip the sign' : ''}: x ${fo} ${neg(v)}.`, `So: ${right}.`] }); }
    return ineqAns(fo, v, [`${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: ${lin(a, 0)} ${op} ${neg(c - b)}.`, `Divide by ${neg(a)}${a < 0 ? ', and flip the sign because it is negative' : ''}.`, `So x ${fo} ${neg(v)}.`], { q: `Solve: ${lin(a, b)} ${op} ${neg(c)}.${tail}` });
  }
  let a = r.int(2, 6), c = r.int(1, 7); while (c === a) c = r.int(1, 7);
  const b = r.nonzero(-6, 6), d = a * (v + b) - c * v, k = a - c, fo = k < 0 ? FLIP[op] : op;
  return ineqAns(fo, v, [`Distribute: ${lin(a, a * b)} ${op} ${lin(c, d)}.`, `Gather x terms on the left and numbers on the right: ${lin(k, 0)} ${op} ${neg(d - a * b)}.`, `Divide by ${neg(k)}${k < 0 ? ' and flip the sign' : ''}: x ${fo} ${neg(v)}.`], { q: `Solve: ${a}(x ${sgn(b)}) ${op} ${lin(c, d)}.${tail}` });
});

// ───────────── Data and graphs ─────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
skill('9-graphs', 9, 'Data and graphs', 'Read bar, line, circle graphs and histograms', ['Read each bar or value carefully against the scale.', 'A histogram groups the data into intervals; add the bars you need.', 'In a circle graph each part is a percent of the whole: part = percent × total.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const labels = r.shuffle(['Hockey', 'Soccer', 'Basketball', 'Swimming', 'Skiing', 'Lacrosse']).slice(0, 4), values = labels.map(() => r.int(3, 20));
    if (values.every((x) => x === values[0])) values[0]++;
    let i = r.int(0, 3), j = r.int(0, 3); while (j === i || values[i] === values[j]) { i = r.int(0, 3); j = r.int(0, 3); }
    if (values[i] < values[j]) [i, j] = [j, i];
    const vis = { type: 'bars', labels, values, title: 'Favourite sport' };
    if (r.bool()) return num(values[i] - values[j], [`${labels[i]}: ${values[i]}. ${labels[j]}: ${values[j]}.`, `${values[i]} − ${values[j]} = ${values[i] - values[j]}.`, `${values[i] - values[j]} more students chose ${labels[i]}.`], { q: `How many more students chose ${labels[i]} than ${labels[j]}?`, visual: vis, expr: `${values[i]}-${values[j]}` });
    const tot = values.reduce((a, b) => a + b, 0);
    return num(tot, ['Add all the bars.', `${values.join(' + ')} = ${tot}.`, `${tot} students were asked.`], { q: 'How many students were asked in all?', visual: vis, expr: values.join('+') });
  }
  if (v === 1) {
    const labels = ['50–59', '60–69', '70–79', '80–89', '90–99'], values = labels.map(() => r.int(1, 12)), vis = { type: 'bars', labels, values, title: 'Test scores' };
    const k = r.int(1, 4), sum = values.slice(k).reduce((a, b) => a + b, 0), lo = 50 + 10 * k;
    return num(sum, [`Scores of ${lo} or higher are in the bars from ${labels[k]} up.`, `${values.slice(k).join(' + ')} = ${sum}.`, `${sum} students scored ${lo} or higher.`], { q: `The histogram shows a class's test scores. How many students scored ${lo} or higher?`, visual: vis, expr: values.slice(k).join('+') });
  }
  if (v === 2) {
    const cats = ['Rent', 'Food', 'Transport', 'Savings', 'Other'], ps = []; let left = 100;
    for (let i = 0; i < 4; i++) { const p = 5 * r.int(1, Math.min(8, (left - 5 * (4 - i)) / 5)); ps.push(p); left -= p; } ps.push(left);
    const T = r.pick([800, 1200, 2000, 2400, 3000, 4000]), i = r.int(0, 4), amt = ps[i] * T / 100;
    return num(amt, [`${cats[i]} is ${ps[i]}% of $${comma(T)}.`, `${dec(ps[i] / 100)} × ${T} = ${amt}.`, `$${amt} is spent on ${cats[i].toLowerCase()}.`], { q: `A family's monthly budget of $${comma(T)} is shown in a circle graph. The table gives the percent for each part. How many dollars go to ${cats[i].toLowerCase()}?`, visual: { type: 'table', head: ['Part', 'Percent'], rows: cats.map((c, k) => [c, `${ps[k]}%`]) }, unit: '$', expr: `${ps[i]}*${T}/100` });
  }
  let vals, diffs, best; do { vals = MONTHS.slice(0, 5).map(() => r.int(10, 60)); diffs = vals.slice(1).map((x, k) => x - vals[k]); best = Math.max(...diffs); } while (best <= 0 || diffs.filter((d) => d === best).length > 1);
  const bi = diffs.indexOf(best), names = diffs.map((_, k) => `${MONTHS[k]} to ${MONTHS[k + 1]}`);
  return mc(r, names[bi], names.filter((_, k) => k !== bi), { q: 'A line graph shows the number of bikes a shop sold each month (the values are in the table). Between which two months did sales go up the most?', visual: { type: 'table', head: ['Month', ...MONTHS.slice(0, 5)], rows: [['Bikes sold', ...vals]] }, steps: [`Changes: ${diffs.map((d, k) => `${names[k]} ${d >= 0 ? '+' : '−'}${Math.abs(d)}`).join(', ')}.`, `The biggest rise is +${best}, from ${names[bi]}.`] });
});

const median = (a) => { const s = [...a].sort((p, q) => p - q), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
skill('9-stemleaf', 9, 'Data and graphs', 'Stem-and-leaf plots and box plots', ['In a stem-and-leaf plot, the stem is the tens digit and each leaf is a ones digit: 4 | 7 means 47.', 'A box plot shows five numbers: minimum, first quartile (Q1), median, third quartile (Q3) and maximum.', 'The interquartile range is Q3 − Q1. Each section of a box plot holds about 25% of the data.'], (r) => {
  if (r.bool()) {
    const n = r.int(9, 13), data = Array.from({ length: n }, () => r.int(20, 69)).sort((a, b) => a - b), lo = Math.floor(data[0] / 10), hi = Math.floor(data[n - 1] / 10);
    const rows = []; for (let s = lo; s <= hi; s++) rows.push([s, data.filter((x) => Math.floor(x / 10) === s).map((x) => x % 10).join(' ')]);
    const vis = { type: 'table', head: ['Stem', 'Leaf'], rows }, key = ` (Key: ${lo} | ${data[0] % 10} means ${data[0]}.)`, t = r.int(0, 2);
    if (t === 0) { const m = median(data); return num(dec(m), [`There are ${n} values; in order they are ${data.join(', ')}.`, n % 2 ? `The middle one (number ${(n + 1) / 2}) is ${m}.` : `The middle two are ${data[n / 2 - 1]} and ${data[n / 2]}; halfway is ${dec(m)}.`, `The median is ${dec(m)}.`], { q: `Find the median of the data.${key}`, visual: vis, expr: `${m}` }); }
    if (t === 1) return num(data[n - 1] - data[0], [`Largest: ${data[n - 1]}. Smallest: ${data[0]}.`, `${data[n - 1]} − ${data[0]} = ${data[n - 1] - data[0]}.`, `The range is ${data[n - 1] - data[0]}.`], { q: `Find the range of the data.${key}`, visual: vis, expr: `${data[n - 1]}-${data[0]}` });
    const cut = 10 * r.int(lo + 1, Math.max(lo + 1, hi)), above = data.filter((x) => x >= cut), c = above.length;
    return num(c, [`Count the leaves on stem ${cut / 10} and above.`, `Those values are ${above.join(', ') || 'none'}.`, `${c} values are at least ${cut}.`], { q: `How many values are at least ${cut}?${key}`, visual: vis, expr: `${c}` });
  }
  const mn = r.int(10, 30), q1 = mn + r.int(3, 12), md = q1 + r.int(2, 10), q3 = md + r.int(2, 10), mx = q3 + r.int(3, 15);
  const vis = { type: 'table', head: ['Minimum', 'Q1', 'Median', 'Q3', 'Maximum'], rows: [[mn, q1, md, q3, mx]] }, t = r.int(0, 2), intro = 'The table gives the five numbers of a box plot of race times (in minutes).';
  if (t === 0) return num(q3 - q1, ['IQR = Q3 − Q1.', `${q3} − ${q1} = ${q3 - q1}.`, `The interquartile range is ${q3 - q1}.`], { q: `${intro} What is the interquartile range?`, visual: vis, expr: `${q3}-${q1}` });
  if (t === 1) return num(mx - mn, ['Range = maximum − minimum.', `${mx} − ${mn} = ${mx - mn}.`, `The range is ${mx - mn}.`], { q: `${intro} What is the range?`, visual: vis, expr: `${mx}-${mn}` });
  const [what, p, why] = r.pick([[`between ${q1} and ${q3}`, 50, 'The box, from Q1 to Q3, holds the middle half'], [`above ${q3}`, 25, 'Above Q3 is the top quarter'], [`below ${q1}`, 25, 'Below Q1 is the bottom quarter'], [`below ${md}`, 50, 'The median splits the data in half'], [`above ${q1}`, 75, 'Above Q1 is three of the four quarters']]);
  return num(p, [`${why}.`, `So about ${p}% of the times are ${what}.`], { q: `${intro} About what percent of the times are ${what} minutes?`, visual: vis, unit: '%' });
});

const corr = (P) => { const n = P.length, mx = P.reduce((a, p) => a + p[0], 0) / n, my = P.reduce((a, p) => a + p[1], 0) / n; let sxy = 0, sx = 0, sy = 0; for (const [x, y] of P) { sxy += (x - mx) * (y - my); sx += (x - mx) ** 2; sy += (y - my) ** 2; } return sx && sy ? sxy / Math.sqrt(sx * sy) : 0; };
const clamp6 = (y) => Math.max(0, Math.min(6, Math.round(y)));
skill('9-scatter', 9, 'Data and graphs', 'Scatter plots and lines of best fit', ['If the points rise from left to right, there is a positive correlation; if they fall, a negative one; no pattern means no correlation.', 'An outlier is a point far away from the others.', 'A line of best fit follows the trend; use its equation to predict.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const kind = r.pick(['positive', 'negative', 'no']); let P, c;
    do { P = [0, 1, 2, 3, 4, 5, 6].map((x) => [x, kind === 'positive' ? clamp6(0.5 + 0.8 * x + r.int(-1, 1)) : kind === 'negative' ? clamp6(5.5 - 0.8 * x + r.int(-1, 1)) : r.int(0, 6)]); c = corr(P); } while (kind === 'positive' ? c < 0.75 : kind === 'negative' ? c > -0.75 : Math.abs(c) > 0.25);
    const right = `${kind} correlation`;
    return mc(r, right, ['positive correlation', 'negative correlation', 'no correlation'].filter((x) => x !== right), { q: 'What kind of correlation does the scatter plot show?', visual: { type: 'plane', quad1: true, xMax: 6, yMax: 6, points: P }, steps: [kind === 'no' ? 'The points are scattered with no clear direction.' : `The points ${kind === 'positive' ? 'rise' : 'fall'} from left to right.`, `So it shows ${right}.`] });
  }
  if (v === 1) {
    const L = 'ABCDEFG'; let P, o;
    do { o = r.int(0, 6); P = [0, 1, 2, 3, 4, 5, 6].map((x, i) => [x, i === o ? (x <= 2 ? x + r.int(4, 6 - x) : x - r.int(Math.min(4, x), x)) : clamp6(x + r.int(-1, 1))]); } while (Math.abs(P[o][1] - P[o][0]) < 4);
    const pts = P.map(([x, y], i) => [x, y, L[i]]), others = r.shuffle(L.split('').filter((_, i) => i !== o)).slice(0, 3);
    return mc(r, L[o], others, { q: 'Which point is an outlier?', visual: { type: 'plane', quad1: true, xMax: 6, yMax: 6, points: pts }, steps: ['Most points lie close to the line y = x.', `Point ${L[o]}${xy(...P[o])} is far from the rest, so ${L[o]} is the outlier.`] });
  }
  const m = r.pick([0.5, 1, 1.5, -0.5, -1]), b = m > 0 ? r.int(0, 2) : r.int(5, 6), X = r.int(8, 14), Y = rnd(m * X + b, 2);
  const P = [0, 1, 2, 3, 4, 5, 6].filter((x) => m * x + b >= 0 && m * x + b <= 6).map((x) => [x, clamp6(m * x + b + r.pick([-1, 0, 0, 1]))]);
  return num(dec(Y), [`Put x = ${X} into y = ${linQ(m * 2, 2, b)}.`, `y = ${D(m)} × ${X} ${sgn(b)} = ${D(Y)}.`, `The prediction is ${D(Y)}.`], { q: `The line of best fit for this scatter plot is y = ${linQ(m * 2, 2, b)}. Use it to predict y when x = ${X}.`, visual: { type: 'plane', points: P, lines: [[m, b]] }, expr: `${m}*${X}+${b}` });
});

// ───────────── Relations and functions ─────────────
skill('9-relation', 9, 'Relations and functions', 'Relations and functions', ['A relation is a set of ordered pairs. It is a function if each x-value has only one y-value.', 'Vertical line test: if a vertical line ever touches the graph twice, it is not a function.', 'The independent variable is the input; the dependent variable depends on it.'], (r) => {
  const v = r.int(0, 3);
  if (v <= 1) {
    const xs = r.shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 4), P = xs.map((x) => [x, r.int(-5, 5)]), isF = r.bool();
    let dup = null;
    if (!isF) { const k = r.int(0, 2); let y; do y = r.int(-5, 5); while (y === P[k][1]); P[3] = [P[k][0], y]; dup = P[k][0]; }
    const pts = r.shuffle(P), right = isF ? 'Yes' : 'No';
    const steps = [isF ? 'Each x-value appears only once.' : `x = ${neg(dup)} goes with two different y-values${v === 1 ? ': a vertical line there touches two points' : ''}.`, isF ? 'So it is a function: Yes.' : 'So it is not a function: No.'];
    if (v === 0) return mc(r, right, [isF ? 'No' : 'Yes'], { q: `Is this relation a function?  {${pts.map(([x, y]) => xy(x, y)).join(', ')}}`, steps });
    return mc(r, right, [isF ? 'No' : 'Yes'], { q: 'The graph shows a relation. Use the vertical line test: is it a function?', visual: { type: 'plane', points: pts }, steps });
  }
  if (v === 2) {
    const [ind, dep, s] = r.pick([['the number of hours worked', 'the amount earned', 'The amount earned depends on the number of hours worked.'], ['the number of tickets sold', 'the money raised', 'The money raised depends on the number of tickets sold.'], ['the time spent running', 'the distance run', 'The distance run depends on the time spent running.'], ['the temperature outside', 'the number of cold drinks sold', 'The number of cold drinks sold depends on the temperature outside.'], ['the number of guests', 'the amount of food needed', 'The amount of food needed depends on the number of guests.']]);
    const askInd = r.bool(), right = askInd ? ind : dep;
    return mc(r, right, [askInd ? dep : ind], { q: `${s} Which is the ${askInd ? 'independent' : 'dependent'} variable?`, steps: [`${dep[0].toUpperCase() + dep.slice(1)} depends on ${ind}.`, `So the ${askInd ? 'independent' : 'dependent'} variable is ${right}.`] });
  }
  const xs = r.shuffle([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 3).sort((a, b) => a - b), ys = xs.map(() => r.int(-6, 6));
  const L = (f) => xs.map((x, i) => f(x, ys[i])).join(', '), right = L((x, y) => xy(x, y));
  return mc(r, right, [L((x, y) => xy(y, x)), L((x, y) => xy(x, y + 1)), L((x, y) => xy(-x, y))], { q: 'Which list of ordered pairs matches the table?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [neg(x), neg(ys[i])]) }, steps: ['Each row gives one pair (x, y), with x first.', `So the pairs are ${right}.`] });
});

skill('9-funcgraph', 9, 'Relations and functions', 'Use and read functions', ['f(4) means the value of the function when x = 4: put 4 in for x, or read the graph above x = 4.', 'To plug in an expression, put it in brackets where x was, then simplify.', 'In a word problem, the starting amount is the fixed part and the rate is the part that grows with x.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const m = r.pick([-2, -1, 1, 2, 0.5, -0.5]), b = r.int(-3, 3); let x0; do x0 = r.int(-4, 4); while (Math.abs(m * x0 + b) > 6 || !Number.isInteger(m * x0 + b));
    const y0 = m * x0 + b;
    if (r.bool()) return num(y0, [`Find x = ${neg(x0)} on the x-axis and go up or down to the line.`, `The line is at y = ${neg(y0)} there.`, `So f(${neg(x0)}) = ${neg(y0)}.`], { q: `The graph shows the line y = f(x). What is f(${neg(x0)})?`, visual: { type: 'plane', lines: [[m, b]] }, expr: `${m}*(${x0})+(${b})` });
    return num(x0, [`Find y = ${neg(y0)} on the y-axis and go across to the line.`, `The line is there when x = ${neg(x0)}.`, `So f(x) = ${neg(y0)} when x = ${neg(x0)}.`], { q: `The graph shows the line y = f(x). For what value of x is f(x) = ${neg(y0)}?`, visual: { type: 'plane', lines: [[m, b]] }, expr: `(${y0}-(${b}))/(${m})` });
  }
  if (v === 1) {
    const a = r.nonzero(-5, 5), b = r.int(-9, 9), xs = r.shuffle([-3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 4).sort((p, q) => p - q), k = r.int(0, 3), X = xs[k];
    return num(a * X + b, [`Put x = ${neg(X)} into f(x) = ${lin(a, b)}.`, `${a}${par(X)} ${sgn(b)} = ${neg(a * X)} ${sgn(b)}.`, `= ${neg(a * X + b)}. The missing value is ${neg(a * X + b)}.`], { q: `Complete the table for f(x) = ${lin(a, b)}. What goes in place of the ?`, visual: { type: 'table', head: ['x', 'f(x)'], rows: xs.map((x, i) => [neg(x), i === k ? '?' : neg(a * x + b)]) }, expr: `${a}*(${X})+(${b})` });
  }
  if (v === 2) {
    const A = r.nonzero(-5, 6), B = r.nonzero(-9, 9), c = r.int(2, 4), d = r.nonzero(-6, 6), right = lin(A * c, A * d + B, 'a');
    return mc(r, right, [lin(A * c, d + B, 'a'), lin(c, A * d + B, 'a'), lin(A * c, A * d - B, 'a')], { q: `f(x) = ${lin(A, B)}. Find f(${lin(c, d, 'a')}).`, steps: [`Put (${lin(c, d, 'a')}) in place of x: ${A}(${lin(c, d, 'a')}) ${sgn(B)}.`, `Distribute: ${lin(A * c, A * d, 'a')} ${sgn(B)}.`, `So f(${lin(c, d, 'a')}) = ${right}.`] });
  }
  const m = r.int(3, 15), b = r.int(2, 12) * 5, h = r.int(2, 8), item = r.pick(['bike', 'kayak', 'canoe']);
  if (r.bool()) return num(m * h + b, [`Put h = ${h}: C = ${m} × ${h} + ${b}.`, `= ${m * h} + ${b} = ${m * h + b}.`, `It costs $${m * h + b}.`], { q: `The cost C (in dollars) to rent a ${item} for h hours is C = ${m}h + ${b}. What does it cost for ${h} hours?`, unit: '$', expr: `${m}*${h}+${b}` });
  const askB = r.bool(), right = askB ? 'a fixed fee paid once' : 'the cost for each hour';
  return mc(r, right, [askB ? 'the cost for each hour' : 'a fixed fee paid once', 'the number of hours', 'the total cost'], { q: `The cost C (in dollars) to rent a ${item} for h hours is C = ${m}h + ${b}. What does the ${askB ? b : m} mean?`, steps: [`${b} is added once, no matter how many hours: a fixed fee. ${m} is multiplied by h: a cost per hour.`, `So ${askB ? b : m} is ${right}.`] });
});

// ───────────── Direct variation ─────────────
skill('9-direct', 9, 'Direct variation', 'Direct variation', ['y varies directly with x when y = kx. k is the constant of variation.', 'In a direct variation y ÷ x is the same for every pair, and the graph is a line through (0, 0).', 'To solve, find k from one pair, then use y = kx.'], (r) => {
  const k = r.pick([2, 3, 4, 5, 6, 1.5, 2.5, 0.5]), v = r.int(0, 4), xs = r.shuffle([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 3).sort((a, b) => a - b);
  if (v === 0) return num(dec(k), [`k = y ÷ x for any pair: ${D(k * xs[0])} ÷ ${xs[0]} = ${D(k)}.`, `Check another: ${D(k * xs[1])} ÷ ${xs[1]} = ${D(k)}.`, `The constant of variation is ${D(k)}.`], { q: 'y varies directly with x. What is the constant of variation k?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [x, D(k * x)]) }, expr: `${k * xs[0]}/${xs[0]}` });
  if (v === 1) {
    const prop = r.bool(), b = prop ? 0 : r.nonzero(-3, 4), ys = xs.map((x) => rnd(k * x + b, 4));
    return mc(r, prop ? 'Yes' : 'No', [prop ? 'No' : 'Yes'], { q: 'Is the relationship between x and y proportional (a direct variation)?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [x, D(ys[i])]) }, steps: [`Find y ÷ x for each pair: ${xs.map((x, i) => D(rnd(ys[i] / x, 3))).join(', ')}.`, prop ? 'They are all the same, so Yes.' : 'They are not all the same, so No.'] });
  }
  if (v === 2) { const x0 = xs[0], x1 = r.int(7, 20), y1 = rnd(k * x1, 4); return num(dec(y1), [`k = ${D(k * x0)} ÷ ${x0} = ${D(k)}, so y = ${D(k)}x.`, `y = ${D(k)} × ${x1} = ${D(y1)}.`, `So y = ${D(y1)}.`], { q: `y varies directly with x, and y = ${D(k * x0)} when x = ${x0}. Find y when x = ${x1}.`, expr: `${k * x0}/${x0}*${x1}` }); }
  if (v === 3) { const x0 = xs[1], y0 = rnd(k * x0, 4), right = `y = ${D(k)}x`; return mc(r, right, [`y = ${D(rnd(x0 / y0, 3))}x`, `y = x ${sgn(rnd(y0 - x0, 4))}`, `y = ${D(k)}x + 1`], { q: `y varies directly with x, and y = ${D(y0)} when x = ${x0}. Which equation shows this?`, steps: [`k = y ÷ x = ${D(y0)} ÷ ${x0} = ${D(k)}.`, `So ${right}.`] }); }
  const kk = r.pick([0.5, 1, 2, 3, -1, -2]); let x0; do x0 = r.nonzero(-4, 4); while (!Number.isInteger(kk * x0) || Math.abs(kk * x0) > 6);
  return num(dec(kk), [`The line goes through (0, 0) and ${xy(x0, kk * x0)}.`, `k = y ÷ x = ${neg(kk * x0)} ÷ ${par(x0)} = ${D(kk)}.`, `The constant of variation is ${D(kk)}.`], { q: 'The graph shows a direct variation. What is the constant of variation k?', visual: { type: 'plane', lines: [[kk, 0]], points: [[x0, kk * x0, 'P']] }, expr: `${kk * x0}/(${x0})` });
});

// ───────────── Linear functions ─────────────
const stdS = (A, B, C) => `${A === 1 ? '' : A === -1 ? '−' : neg(A)}x ${B < 0 ? '−' : '+'} ${Math.abs(B) === 1 ? '' : Math.abs(B)}y = ${neg(C)}`;
skill('9-slope', 9, 'Linear functions', 'Slope', ['Slope = rise ÷ run = (y2 − y1) ÷ (x2 − x1).', 'A line going up to the right has a positive slope; going down, a negative slope; a flat line has slope 0.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const p = r.nonzero(-4, 4), q = r.int(1, 3), x1 = r.int(-5, 5 - q), y1 = r.int(Math.max(-6, -6 - p), Math.min(6, 6 - p)), m = p / q;
    return num(frac(p, q), [`From A to B: rise ${neg(p)}, run ${q}.`, `Slope = ${neg(p)} ÷ ${q} = ${F(p, q)}.`, `The slope is ${F(p, q)}.`], { q: 'What is the slope of the line?', visual: { type: 'plane', lines: [[m, y1 - m * x1]], points: [[x1, y1, 'A'], [x1 + q, y1 + p, 'B']] }, expr: `${p}/${q}` });
  }
  if (v === 1) {
    const x1 = r.int(-9, 9), y1 = r.int(-9, 9); let x2; do x2 = r.int(-9, 9); while (x2 === x1); const y2 = r.int(-9, 9);
    return num(frac(y2 - y1, x2 - x1), [`Rise: ${neg(y2)} − ${par(y1)} = ${neg(y2 - y1)}. Run: ${neg(x2)} − ${par(x1)} = ${neg(x2 - x1)}.`, `Slope = ${neg(y2 - y1)} ÷ ${par(x2 - x1)} = ${F(y2 - y1, x2 - x1)}.`, `The slope is ${F(y2 - y1, x2 - x1)}.`], { q: `Find the slope of the line through ${xy(x1, y1)} and ${xy(x2, y2)}.`, expr: `(${y2}-(${y1}))/(${x2}-(${x1}))` });
  }
  const p = r.nonzero(-4, 4), q = r.int(1, 3), k = r.nonzero(-3, 3), x1 = r.int(-6, 6), y1 = r.int(-6, 6), x2 = x1 + q * k, y = y1 + p * k;
  return num(y, [`Slope = (y − ${par(y1)}) ÷ (${neg(x2)} − ${par(x1)}) = (y − ${par(y1)}) ÷ ${par(x2 - x1)}.`, `So y − ${par(y1)} = ${F(p, q)} × ${par(x2 - x1)} = ${neg(p * k)}.`, `y = ${neg(y)}.`], { q: `A line through ${xy(x1, y1)} and (${neg(x2)}, y) has a slope of ${F(p, q)}. Find y.`, unit: 'y =', expr: `${y1}+(${p}/${q})*(${x2 - x1})` });
});

skill('9-slopeint', 9, 'Linear functions', 'Slope-intercept form', ['y = mx + b: m is the slope and b is the y-intercept (where the line crosses the y-axis).', 'From a graph, read b where the line crosses the y-axis, then count rise over run for m.', 'From a table, m is the change in y for each 1 the x goes up.'], (r) => {
  const v = r.int(0, 4), m = r.nonzero(-4, 4), b = r.int(-5, 5);
  if (v === 0) {
    const askM = r.bool(), form = r.bool(0.3) && b !== 0 ? `y = ${neg(b)} ${m < 0 ? '−' : '+'} ${Math.abs(m) === 1 ? '' : Math.abs(m)}x` : `y = ${lin(m, b)}`;
    return num(askM ? m : b, ['In y = mx + b, m is the number with x and b is the number on its own.', askM ? `The number with x is ${neg(m)}, so m = ${neg(m)}.` : `The number on its own is ${neg(b)}, so b = ${neg(b)}.`, `The ${askM ? 'slope' : 'y-intercept'} is ${neg(askM ? m : b)}.`], { q: `What is the ${askM ? 'slope' : 'y-intercept'} of ${form}?`, expr: String(askM ? m : b) });
  }
  if (v === 1) {
    const mm = r.nonzero(-3, 3), bb = r.int(-4, 4), right = `y = ${lin(mm, bb)}`;
    return mc(r, right, [`y = ${lin(-mm, bb)}`, `y = ${lin(mm, -bb || bb + 1)}`, `y = ${lin(bb || 1, mm)}`], { q: 'Which equation matches the line?', visual: { type: 'plane', lines: [[mm, bb]], points: [[0, bb], [1, mm + bb]] }, steps: [`The line crosses the y-axis at ${neg(bb)}, so b = ${neg(bb)}.`, `From (0, ${neg(bb)}) to (1, ${neg(mm + bb)}) it rises ${neg(mm)}, so m = ${neg(mm)}.`, `So ${right}.`] });
  }
  if (v === 2) {
    const xs = [0, 1, 2, 3], vis = { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [x, neg(m * x + b)]) };
    if (r.bool()) return num(m, ['Rate of change = change in y ÷ change in x.', `Each time x goes up 1, y changes by ${neg(m)}.`, `The rate of change is ${neg(m)}.`], { q: 'What is the rate of change shown in the table?', visual: vis, expr: `${m + b}-(${b})` });
    const right = `y = ${lin(m, b)}`;
    return mc(r, right, [`y = ${lin(b || 1, m)}`, `y = ${lin(m, b + m)}`, `y = ${lin(-m, b)}`], { q: 'Which equation matches the table?', visual: vis, steps: [`When x = 0, y = ${neg(b)}, so b = ${neg(b)}.`, `y changes by ${neg(m)} each step, so m = ${neg(m)}.`, `So ${right}.`] });
  }
  if (v === 3) {
    const mm = r.int(20, 90), bb = r.int(4, 20) * 5, right = `C = ${mm}h + ${bb}`;
    return mc(r, right, [`C = ${bb}h + ${mm}`, `C = ${mm}(h + ${bb})`, `C = ${mm + bb}h`], { q: `An electrician charges $${bb} for a visit plus $${mm} per hour. Which equation gives the cost C for h hours?`, steps: [`The hourly rate ${mm} is the slope; the visit fee ${bb} is the starting amount.`, `So ${right}.`] });
  }
  const B = r.pick([-4, -3, -2, 2, 3, 4]), A = -m * B, C = b * B, right = `y = ${lin(m, b)}`;
  return mc(r, right, [`y = ${lin(-m, b)}`, `y = ${lin(m, -b || b + 1)}`, `y = ${lin(A, C)}`], { q: `Solve for y: ${stdS(A, B, C)}`, steps: [`Move the x term: ${neg(B)}y = ${lin(-A, C)}.`, `Divide everything by ${neg(B)}: y = ${lin(m, b)}.`, `So ${right}.`] });
});

skill('9-stdform', 9, 'Linear functions', 'Standard form, intercepts and special lines', ['Standard form is Ax + By = C.', 'x-intercept: put y = 0 and solve. y-intercept: put x = 0 and solve.', 'A horizontal line is y = (a number); a vertical line is x = (a number).'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const A = r.nonzero(-6, 6), B = r.nonzero(-6, 6), C = lcm(A, B) * r.nonzero(-3, 3), askX = r.bool(), ans = askX ? C / A : C / B;
    return num(ans, [`Put ${askX ? 'y' : 'x'} = 0: ${askX ? `${neg(A)}x` : `${neg(B)}y`} = ${neg(C)}.`, `${askX ? 'x' : 'y'} = ${neg(C)} ÷ ${par(askX ? A : B)} = ${neg(ans)}.`, `The ${askX ? 'x' : 'y'}-intercept is ${neg(ans)}.`], { q: `Find the ${askX ? 'x' : 'y'}-intercept of ${stdS(A, B, C)}.`, expr: `${C}/(${askX ? A : B})` });
  }
  if (v === 1) {
    const q = r.int(2, 5); let p; do p = r.nonzero(-6, 6); while (gcd(p, q) !== 1); const b = r.nonzero(-5, 5);
    let A = -p, B = q, C = q * b; if (A < 0) { A = -A; B = -B; C = -C; }
    const right = stdS(A, B, C);
    return mc(r, right, [stdS(A, -B, C), stdS(A, B, -C), stdS(Math.abs(B), B < 0 ? -A : A, C)], { q: `Write y = ${linQ(p, q, b)} in standard form.`, steps: [`Multiply every term by ${q}: ${q}y = ${lin(p, q * b)}.`, `Move the x term to the left: ${lin(-p, 0)} + ${q}y = ${neg(q * b)}.`, `With A positive: ${right}.`] });
  }
  if (v === 2) {
    const a = r.nonzero(-6, 6); let b; do b = r.nonzero(-6, 6); while (b === a);
    if (r.bool()) { const hor = r.bool(), right = hor ? `y = ${neg(b)}` : `x = ${neg(a)}`; return mc(r, right, hor ? [`x = ${neg(a)}`, `y = ${neg(a)}`, `x = ${neg(b)}`] : [`y = ${neg(b)}`, `x = ${neg(b)}`, `y = ${neg(a)}`], { q: `What is the equation of the ${hor ? 'horizontal' : 'vertical'} line through ${xy(a, b)}?`, steps: [hor ? 'On a horizontal line every point has the same y.' : 'On a vertical line every point has the same x.', `So ${right}.`] }); }
    const right = `y = ${neg(b)}`;
    return mc(r, right, [`x = ${neg(b)}`, `y = ${neg(b)}x`, `y = ${neg(-b)}`], { q: 'What is the equation of the line shown?', visual: { type: 'plane', lines: [[0, b]] }, steps: [`The line is flat and every point on it has y = ${neg(b)}.`, `So ${right}.`] });
  }
  const m = r.nonzero(-5, 5), b = r.int(-9, 9), right = `y = ${lin(m, b)}`;
  return mc(r, right, [`y = x^2 ${sgn(b || 1)}`, `y = ${Math.abs(m) + 1}/x`, `y = ${Math.abs(m) + 1}^x`], { q: 'Which equation is a linear function?', steps: ['A linear function has x only to the power 1: not squared, not in a denominator and not as an exponent.', `So ${right} is linear.`] });
});

const psForm = (m, x1, y1) => { const co = m === 1 ? '' : m === -1 ? '−' : neg(m); return `${y1 === 0 ? 'y' : `y ${sgn(-y1)}`} = ${x1 === 0 ? `${co}x` : `${co}(x ${sgn(-x1)})`}`; };
skill('9-parperp', 9, 'Linear functions', 'Parallel and perpendicular lines, point-slope form', ['Parallel lines have equal slopes. Perpendicular slopes are negative reciprocals: 2/3 and −3/2.', 'Point-slope form: y − y1 = m(x − x1), for a line with slope m through (x1, y1).', 'g(x) = f(x) + k moves a graph up k; g(x) = −f(x) reflects it in the x-axis.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    let p, q; do { p = r.nonzero(-5, 5); q = r.int(1, 4); } while (gcd(p, q) !== 1); const b = r.int(-6, 6), isPar = r.bool();
    return isPar ? num(frac(p, q), [`The line has slope ${F(p, q)}.`, `Parallel lines have the same slope: ${F(p, q)}.`, `The slope is ${F(p, q)}.`], { q: `What is the slope of a line parallel to y = ${linQ(p, q, b)}?`, expr: `${p}/${q}` })
      : num(frac(-q, p), [`The line has slope ${F(p, q)}.`, `Flip it and change the sign: ${F(-q, p)}.`, `The perpendicular slope is ${F(-q, p)}.`], { q: `What is the slope of a line perpendicular to y = ${linQ(p, q, b)}?`, expr: `-${q}/(${p})` });
  }
  if (v === 1) {
    let p, q; do { p = r.nonzero(-4, 4); q = r.int(1, 3); } while (gcd(p, q) !== 1 || Math.abs(p) === q);
    const t = r.int(0, 2), b1 = r.int(-6, 6), b2 = b1 + r.nonzero(-4, 4), [p2, q2] = t === 0 ? [p, q] : t === 1 ? [-q, p] : [q, p];
    const right = ['parallel', 'perpendicular', 'neither'][t];
    return mc(r, right, ['parallel', 'perpendicular', 'neither'].filter((x) => x !== right), { q: `Are these lines parallel, perpendicular or neither?  y = ${linQ(p, q, b1)}  and  y = ${linQ(p2, q2, b2)}`, steps: [`Slopes: ${F(p, q)} and ${F(p2, q2)}.`, t === 0 ? 'They are equal: parallel.' : t === 1 ? `Their product is ${F(p * p2, q * q2)}: they are negative reciprocals, so perpendicular.` : 'They are not equal and their product is not −1: neither.', `So the answer is ${right}.`] });
  }
  if (v === 2) {
    const m = r.nonzero(-5, 5), x1 = r.nonzero(-6, 6); let y1; do y1 = r.nonzero(-6, 6); while (y1 === x1);
    const right = psForm(m, x1, y1);
    return mc(r, right, [psForm(m, -x1, -y1), psForm(-m, x1, y1), psForm(m, y1, x1)], { q: `Which equation is the line with slope ${neg(m)} through ${xy(x1, y1)}, in point-slope form?`, steps: ['Use y − y1 = m(x − x1).', `y − ${par(y1)} = ${neg(m)}(x − ${par(x1)}).`, `Tidy the signs: ${right}.`] });
  }
  if (v === 3) {
    const m = r.pick([-3, -2, 2, 3]), t = r.nonzero(-2, 2), x1 = m * t, y1 = r.int(-5, 5), perp = r.bool();
    const [sp, sq] = perp ? [-1, m] : [m, 1], b = perp ? y1 + t : y1 - m * x1, right = `y = ${linQ(sp, sq, b)}`;
    return mc(r, right, [`y = ${linQ(perp ? m : -1, perp ? 1 : m, b)}`, `y = ${linQ(sp, sq, b === y1 ? y1 + 1 : y1)}`, `y = ${linQ(-sp, sq, b)}`], { q: `Which line is ${perp ? 'perpendicular' : 'parallel'} to y = ${lin(m, 2)} and passes through ${xy(x1, y1)}?`, steps: [`The new slope is ${F(sp, sq)} (${perp ? 'the negative reciprocal' : 'the same slope'}).`, `b = y − mx = ${neg(y1)} − ${F(sp, sq)} × ${par(x1)} = ${neg(b)}.`, `So ${right}.`] });
  }
  const m = r.nonzero(-3, 3), b = r.int(-4, 4), k = r.int(1, 6), t = r.int(0, 2);
  const D4 = [`moved ${k} unit${k > 1 ? 's' : ''} up`, `moved ${k} unit${k > 1 ? 's' : ''} down`, 'reflected in the x-axis', `moved ${k} unit${k > 1 ? 's' : ''} right`];
  const [g, right] = t === 0 ? (r.bool() ? [`f(x) + ${k}`, D4[0]] : [`f(x) − ${k}`, D4[1]]) : t === 1 ? ['−f(x)', D4[2]] : [`f(x − ${k})`, D4[3]];
  return mc(r, right, D4.filter((d) => d !== right), { q: `f(x) = ${lin(m, b)} and g(x) = ${g}. How is the graph of g related to the graph of f?`, steps: [t === 0 ? 'Adding or subtracting outside f moves the graph up or down.' : t === 1 ? 'A minus sign in front of f flips every y-value.' : 'Replacing x with x − k moves the graph right k.', `So the graph is ${right}.`] });
});

// ───────────── Systems of linear equations ─────────────
skill('9-system', 9, 'Systems of linear equations', 'Systems of linear equations', ['A solution of a system makes both equations true.', 'On a graph, the solution is where the two lines cross.', 'Same slope, different intercepts: no solution. The same line: infinitely many. Different slopes: one solution.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const x0 = r.int(-5, 5), y0 = r.int(-5, 5); let a1, b1, a2, b2; do { a1 = r.nonzero(-4, 4); b1 = r.nonzero(-4, 4); a2 = r.nonzero(-4, 4); b2 = r.nonzero(-4, 4); } while (a1 * b2 === a2 * b1);
    const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, ok = r.bool(), tx = ok ? x0 : x0 + r.nonzero(-1, 1), ty = y0;
    const L1 = a1 * tx + b1 * ty, L2 = a2 * tx + b2 * ty, right = L1 === c1 && L2 === c2 ? 'Yes' : 'No';
    return mc(r, right, [right === 'Yes' ? 'No' : 'Yes'], { q: `Is ${xy(tx, ty)} a solution of the system?  ${stdS(a1, b1, c1)}  and  ${stdS(a2, b2, c2)}`, steps: [`First: ${a1}${par(tx)} + ${b1}${par(ty)} = ${neg(L1)}${L1 === c1 ? ', which is true' : `, not ${neg(c1)}`}.`, `Second: ${a2}${par(tx)} + ${b2}${par(ty)} = ${neg(L2)}${L2 === c2 ? ', which is true' : `, not ${neg(c2)}`}.`, right === 'Yes' ? 'Both are true, so Yes.' : 'Not both are true, so No.'] });
  }
  if (v === 1) {
    const x0 = r.int(-4, 4), y0 = r.int(-4, 4); let m1, m2; do { m1 = r.int(-3, 3); m2 = r.int(-3, 3); } while (m1 === m2);
    const b1 = y0 - m1 * x0, b2 = y0 - m2 * x0;
    return pt(x0, y0, ['The solution is where the lines cross.', `Check: ${neg(y0)} = ${m1}${par(x0)} ${sgn(b1)} and ${neg(y0)} = ${m2}${par(x0)} ${sgn(b2)}.`, `The solution is ${xy(x0, y0)}.`], { q: `The graph shows y = ${lin(m1, b1)} and y = ${lin(m2, b2)}. What is the solution of the system? Write it as (x, y).`, visual: { type: 'plane', lines: [[m1, b1], [m2, b2]] } });
  }
  if (v === 2) {
    const m = r.nonzero(-3, 3), b = r.int(-4, 4), t = r.int(0, 2), choices = ['one solution', 'no solution', 'infinitely many solutions'];
    let eq2, line2, why;
    if (t === 0) { let m2; do m2 = r.int(-3, 3); while (m2 === m); const b2 = r.int(-4, 4); [eq2, line2, why] = [`y = ${lin(m2, b2)}`, [m2, b2], 'The slopes are different, so the lines cross once']; }
    else if (t === 1) { const b2 = b + r.nonzero(-3, 3); [eq2, line2, why] = [`y = ${lin(m, b2)}`, [m, b2], 'Same slope but different y-intercepts: the lines are parallel and never meet']; }
    else [eq2, line2, why] = [`2y = ${lin(2 * m, 2 * b)}`, [m, b], `Divide the second by 2: y = ${lin(m, b)}, the same line, so every point on it works`];
    return mc(r, choices[t], choices.filter((_, i) => i !== t), { q: `How many solutions does this system have?  y = ${lin(m, b)}  and  ${eq2}`, visual: { type: 'plane', lines: [[m, b], line2] }, steps: [`${why}.`, `So it has ${choices[t]}.`] });
  }
  const n = r.int(2, 12), m2 = r.int(10, 30), m1 = m2 + r.int(2, 10), a = r.int(0, 6) * 5, b = a + (m1 - m2) * n;
  return num(n, [`Plan A: ${a} + ${m1}x. Plan B: ${b} + ${m2}x. Set them equal.`, `${a} + ${m1}x = ${b} + ${m2}x, so ${m1 - m2}x = ${b - a} and x = ${n}.`, `They cost the same after ${n} months.`], { q: `Phone plan A costs $${a} to start plus $${m1} a month. Plan B costs $${b} to start plus $${m2} a month. After how many months do they cost the same?`, unit: 'months', expr: `(${b}-${a})/(${m1}-${m2})` });
});

// ───────────── Monomials ─────────────
skill('9-monomial', 9, 'Monomials', 'Monomials', ['A monomial is one term: a number, a variable, or a product of them with whole-number exponents, like −5x^2y.', 'To multiply monomials, multiply the numbers and add the exponents of each variable. To divide, divide the numbers and subtract.', 'A power of a monomial raises every part: (2x^3)^2 = 4x^6.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) { const c = r.nonzero(-9, 9), p = r.int(1, 4), q = r.int(0, 3), right = mono(c, p, q); return mc(r, right, [`${r.int(2, 9)}x + ${r.int(1, 9)}`, `${r.int(2, 9)}/x`, `x^2 − ${r.int(2, 9)}y`], { q: 'Which expression is a monomial?', steps: ['A monomial has one term, with no + or − between terms and no variable in a denominator.', `${right} is a single term, so it is a monomial.`] }); }
  const c1 = r.nonzero(-6, 6), c2 = r.nonzero(-6, 6), p1 = r.int(1, 5), p2 = r.int(1, 5), q1 = r.int(0, 3), q2 = r.int(0, 3);
  if (v === 1) { const right = mono(c1 * c2, p1 + p2, q1 + q2); return mc(r, right, [mono(c1 + c2 || 1, p1 + p2, q1 + q2), mono(c1 * c2, p1 * p2, q1 * q2), mono(-c1 * c2, p1 + p2, q1 + q2)], { q: `Multiply: (${mono(c1, p1, q1)})(${mono(c2, p2, q2)})`, steps: [`Numbers: ${par(c1)} × ${par(c2)} = ${neg(c1 * c2)}.`, `Add exponents: x^${p1 + p2}${q1 + q2 ? `, y^${q1 + q2}` : ''}.`, `So ${right}.`] }); }
  if (v === 2) { const right = mono(c1, p1, q1); return mc(r, right, [mono(c1 * c2 * c2, p1, q1), mono(c1, p1 + 2 * p2, q1), mono(-c1, p1, q1)], { q: `Divide: (${mono(c1 * c2, p1 + p2, q1 + q2)}) ÷ (${mono(c2, p2, q2)})`, steps: [`Numbers: ${neg(c1 * c2)} ÷ ${par(c2)} = ${neg(c1)}.`, `Subtract exponents: x^${p1 + p2} ÷ x^${p2} = x^${p1}${q2 ? `, y^${q1 + q2} ÷ y^${q2} = y^${q1}` : ''}.`, `So ${right}.`] }); }
  if (v === 3) { const c = r.pick([-4, -3, -2, 2, 3, 4]), n = r.int(2, 3), right = mono(c ** n, p1 * n, q1 * n); return mc(r, right, [mono(c * n, p1 * n, q1 * n), mono(c ** n, p1 + n, q1 ? q1 + n : 0), mono(-(c ** n), p1 * n, q1 * n)], { q: `Simplify: (${mono(c, p1, q1)})^${n}`, steps: [`The number: ${par(c)}^${n} = ${neg(c ** n)}.`, `Multiply each exponent by ${n}: x^${p1 * n}${q1 ? `, y^${q1 * n}` : ''}.`, `So ${right}.`] }); }
  const a = r.int(2, 9), b = r.int(2, 9), right = mono(a * b, 3);
  return mc(r, right, [mono(a * b, 2), mono(a + b, 3), `${a}x + ${b}x^2`], { q: `A rectangle is ${a}x cm wide and ${b}x^2 cm long. Which expression gives its area?`, visual: { type: 'poly', points: [[1, 2], [9, 2], [9, 7], [1, 7]], labels: [`${b}x^2`, `${a}x`, '', ''] }, steps: ['Area = length × width.', `${b}x^2 × ${a}x = ${a * b}x^3.`, `So the area is ${right} cm².`] });
});

// ───────────── Polynomials ─────────────
skill('9-polyvocab', 9, 'Polynomials', 'Polynomial vocabulary and algebra tiles', ['A polynomial is one or more terms added or subtracted. A monomial has 1 term, a binomial 2, a trinomial 3.', 'The degree is the highest exponent. The leading coefficient is the number in front of that term.', 'Algebra tiles: a big square is x^2, a long rectangle is x, a small square is 1; a negative tile means minus.'], (r) => {
  const v = r.int(0, 3);
  if (v === 3) {
    const a = r.int(1, 3), b = r.nonzero(-5, 5), c = r.nonzero(-6, 6), right = poly([[a, 2], [b, 1], [c, 0]]);
    const tiles = [`${a} big square${a > 1 ? 's' : ''} (x^2)`, `${Math.abs(b)} ${b < 0 ? 'negative ' : ''}rectangle${Math.abs(b) > 1 ? 's' : ''} (x)`, `${Math.abs(c)} ${c < 0 ? 'negative ' : ''}small square${Math.abs(c) > 1 ? 's' : ''} (1)`];
    return mc(r, right, [poly([[a, 2], [-b, 1], [c, 0]]), poly([[a, 2], [b, 1], [-c, 0]]), poly([[Math.abs(b), 2], [a, 1], [c, 0]])], { q: `A model uses algebra tiles: ${tiles.join(', ')}. Which polynomial does it show?`, steps: ['Each kind of tile gives one term; negative tiles give minus signs.', `So the polynomial is ${right}.`] });
  }
  const n = r.int(1, 4), pows = r.shuffle([0, 1, 2, 3, 4, 5]).slice(0, n).sort((a, b) => b - a), terms = pows.map((p) => [r.nonzero(-9, 9), p]), P = poly(terms);
  if (v === 0) { const names = ['monomial', 'binomial', 'trinomial', 'polynomial with 4 terms'], right = names[n - 1]; return mc(r, right, names.filter((x) => x !== right), { q: `What kind of polynomial is ${P}?`, steps: [`Count the terms: ${n}.`, `So it is a ${right}.`] }); }
  if (v === 1) return num(pows[0], [`Look at each exponent: ${terms.map(([, p]) => p).join(', ')} (a number on its own has exponent 0).`, `The highest is ${pows[0]}, so the degree is ${pows[0]}.`], { q: `What is the degree of ${P}?`, expr: `${pows[0]}` });
  const lead = terms[0][0];
  return num(lead, [`The term with the highest exponent is ${poly([terms[0]])}.`, `Its number is ${neg(lead)}, so the leading coefficient is ${neg(lead)}.`], { q: `What is the leading coefficient of ${P}?`, expr: `${lead}` });
});

const P3 = (c) => poly([[c[0], 2], [c[1], 1], [c[2], 0]]);
skill('9-polyops', 9, 'Polynomials', 'Add, subtract, multiply and divide polynomials', ['To add or subtract, combine like terms. Subtracting a bracket changes the sign of every term inside.', 'To multiply by a monomial, multiply it by every term: 2x(3x − 4) = 6x^2 − 8x.', 'To divide by a monomial, divide every term by it.'], (r) => {
  const v = r.int(0, 4), A = [r.nonzero(-6, 6), r.int(-9, 9), r.int(-9, 9)], B = [r.nonzero(-6, 6), r.nonzero(-9, 9), r.nonzero(-9, 9)];
  if (v === 0) {
    const sub = r.bool(), R = A.map((a, i) => (sub ? a - B[i] : a + B[i])), right = P3(R);
    const w = sub ? [P3([A[0] - B[0], A[1] + B[1], A[2] + B[2]]), P3(A.map((a, i) => a + B[i])), P3([A[0] - B[0], A[1] - B[1], A[2] + B[2]])] : [P3(A.map((a, i) => a - B[i])), P3([A[0] + B[0], A[1] + B[1], A[2] - B[2]]), P3([A[0] + B[0], A[1] - B[1], A[2] + B[2]])];
    return mc(r, right, w, { q: `Simplify: (${P3(A)}) ${sub ? '−' : '+'} (${P3(B)})`, steps: [sub ? `Change every sign in the second bracket: ${P3(B.map((b) => -b))}.` : 'Remove the brackets.', 'Combine like terms: x^2 terms, x terms, then numbers.', `So the answer is ${right}.`] });
  }
  if (v === 1) {
    const S = [[r.int(1, 5), r.int(-3, 9)], [r.int(1, 5), r.int(1, 9)], [r.int(1, 5), r.int(1, 9)]], tx = S.reduce((s, t) => s + t[0], 0), tc = S.reduce((s, t) => s + t[1], 0), right = lin(tx, tc);
    return mc(r, right, [lin(tx, tc + 1), lin(tx + 1, tc), lin(2 * tx, 2 * tc)], { q: `A triangle has sides of ${S.map(([a, c]) => `(${lin(a, c)})`).join(', ')}. Which expression gives its perimeter?`, steps: ['Perimeter = add all three sides.', `x terms: ${S.map((t) => t[0]).join(' + ')} = ${tx}. Numbers: ${S.map((t) => par(t[1])).join(' + ')} = ${neg(tc)}.`, `So the perimeter is ${right}.`] });
  }
  if (v === 2) {
    const k = r.nonzero(-5, 5), p = r.int(1, 2), b = r.nonzero(-9, 9), c = r.nonzero(-9, 9), a = r.nonzero(-5, 5);
    const right = poly([[k * a, p + 2], [k * b, p + 1], [k * c, p]]);
    return mc(r, right, [poly([[k * a, p + 2], [k * b, p + 1], [c, 0]]), poly([[k * a, 2 * p], [k * b, p], [k * c, p]]), poly([[k * a, p + 2], [-k * b, p + 1], [k * c, p]])], { q: `Multiply: ${mono(k, p)}(${P3([a, b, c])})`, steps: [`Multiply ${mono(k, p)} by each term, adding exponents.`, `${mono(k, p)} × ${mono(a, 2)} = ${mono(k * a, p + 2)}, and so on.`, `So the answer is ${right}.`] });
  }
  if (v === 3) {
    const a = r.int(2, 9), b = r.int(1, 6), c = r.int(1, 9), right = poly([[a * b, 2], [a * c, 1]]);
    return mc(r, right, [poly([[a * b, 2], [c, 0]]), poly([[a * b + a * c, 2]]), poly([[a + b, 2], [a * c, 1]])], { q: `A rectangle is ${a}x m wide and (${lin(b, c)}) m long. Which expression gives its area?`, steps: ['Area = width × length.', `${a}x(${lin(b, c)}) = ${a}x × ${mono(b, 1)} + ${a}x × ${c}.`, `So the area is ${right} m².`] });
  }
  const k = r.int(2, 5), a = r.nonzero(-6, 6), b = r.nonzero(-6, 6), c = r.nonzero(-6, 6), right = poly([[a, 2], [b, 1], [c, 0]]);
  return mc(r, right, [poly([[a, 3], [b, 2], [c, 1]]), poly([[a, 2], [b, 1], [k * c, 0]]), poly([[a * k, 2], [b, 1], [c, 0]])], { q: `Divide: (${poly([[k * a, 3], [k * b, 2], [k * c, 1]])}) ÷ ${k}x`, steps: [`Divide every term by ${k}x: divide the number by ${k} and subtract 1 from the exponent.`, `${mono(k * a, 3)} ÷ ${k}x = ${mono(a, 2)}, and so on.`, `So the answer is ${right}.`] });
});

// ───────────── Logic ─────────────
skill('9-logic', 9, 'Logic', 'Conditional statements and counterexamples', ['In "If p, then q", p is the hypothesis and q is the conclusion.', 'A counterexample makes the hypothesis true but the conclusion false: one is enough to show a statement is false.'], (r) => {
  const a = r.pick([2, 3, 4, 5]), b = r.int(2, 4);
  if (r.bool()) {
    const S = [[`a number is divisible by ${a * b}`, `it is divisible by ${a}`], [`an angle measures ${r.int(91, 179)}°`, 'it is an obtuse angle'], ['a triangle has a right angle', 'its other two angles add to 90°'], [`${r.pick(NAMES)} finishes the homework`, 'there is time for hockey practice'], ['two lines are parallel', 'they have the same slope'], [`x + ${a} = ${a + b}`, `x = ${b}`]];
    const [p, q] = r.pick(S), askH = r.bool(), right = askH ? p : q;
    return mc(r, right, [askH ? q : p], { q: `"If ${p}, then ${q}." What is the ${askH ? 'hypothesis' : 'conclusion'}?`, steps: ['The hypothesis comes after "if"; the conclusion comes after "then".', `So the ${askH ? 'hypothesis' : 'conclusion'} is "${right}".`] });
  }
  const t = r.int(0, 2);
  if (t === 0) {
    const [d, e] = r.pick([[4, 8], [6, 12], [3, 6], [5, 10], [6, 4], [10, 4], [9, 6]]), L = lcm(d, e);
    let ce; do ce = d * r.int(1, 12); while (ce % e === 0);
    let w; do w = r.int(5, 60); while (w % d === 0);
    return mc(r, ce, [L * r.int(1, 3), w, L * r.int(4, 5)], { q: `Which number is a counterexample to: "If a number is divisible by ${d}, then it is divisible by ${e}"?`, steps: ['A counterexample must be divisible by the first number but not by the second.', `${ce} ÷ ${d} = ${ce / d}, but ${ce} is not divisible by ${e}.`, `So ${ce} is a counterexample.`] });
  }
  if (t === 1) {
    const k = r.int(2, 6), ce = -(k + r.int(1, 4));
    return mc(r, neg(ce), [k + 1, k - 1, 0].map(neg), { q: `Which value of x is a counterexample to: "If x^2 > ${k * k}, then x > ${k}"?`, steps: [`Try x = ${neg(ce)}: x^2 = ${ce * ce}, which is more than ${k * k}.`, `But ${neg(ce)} is not greater than ${k}.`, `So x = ${neg(ce)} is a counterexample.`] });
  }
  const p = r.pick([3, 5, 7, 11, 13]), right = `2 + ${p} = ${2 + p}`;
  return mc(r, right, [`3 + ${p === 3 ? 5 : 3} = ${3 + (p === 3 ? 5 : 3)}`, `${p} + ${p} = ${2 * p}`, '7 + 11 = 18'], { q: '"The sum of any two prime numbers is even." Which example shows this is false?', steps: ['Two odd primes always add to an even number.', `But 2 is a prime that is even: ${right}, which is odd.`, `So ${right} is the counterexample.`] });
});

// ───────────── Probability ─────────────
skill('9-prob', 9, 'Probability', 'Probability of simple and compound events', ['Theoretical probability = favourable outcomes ÷ all equally likely outcomes.', 'Experimental probability = times it happened ÷ number of trials.', 'Independent events: multiply. Dependent events (no replacement): after the first pick, there is one fewer item.'], (r) => {
  const v = r.int(0, 4), rd = r.int(2, 9), bl = r.int(2, 9), gr = r.int(1, 8), T = rd + bl + gr;
  if (v === 0) {
    const [c, n] = r.pick([['red', rd], ['blue', bl], ['green', gr]]), not = r.bool(0.3), f = not ? T - n : n;
    return num(frac(f, T), [`There are ${rd} + ${bl} + ${gr} = ${T} marbles.`, `${not ? `Not ${c}: ${T} − ${n} = ${f}` : `${c[0].toUpperCase() + c.slice(1)}: ${n}`}. P = ${f}/${T}.`, `Simplified, P = ${frac(f, T)}.`], { q: `A bag has ${rd} red, ${bl} blue and ${gr} green marbles. One is picked at random. What is P(${not ? 'not ' : ''}${c})?`, expr: `${f}/${T}` });
  }
  if (v === 1) {
    const cols = ['Red', 'Blue', 'Yellow', 'Green'], cnt = cols.map(() => r.int(3, 15)), N = cnt.reduce((a, b) => a + b, 0), i = r.int(0, 3), vis = { type: 'table', head: ['Colour', 'Times landed'], rows: cols.map((c, k) => [c, cnt[k]]) };
    if (r.bool()) return num(frac(cnt[i], N), [`Total spins: ${cnt.join(' + ')} = ${N}.`, `${cols[i]} came up ${cnt[i]} times: ${cnt[i]}/${N}.`, `So the experimental probability is ${frac(cnt[i], N)}.`], { q: `A spinner was spun and the results recorded. What is the experimental probability of ${cols[i].toLowerCase()}?`, visual: vis, expr: `${cnt[i]}/${N}` });
    const k = r.int(2, 5);
    return num(cnt[i] * k, [`P(${cols[i].toLowerCase()}) = ${cnt[i]}/${N} from ${N} spins.`, `For ${N * k} spins: ${cnt[i]}/${N} × ${N * k} = ${cnt[i] * k}.`, `Expect about ${cnt[i] * k} times.`], { q: `A spinner was spun and the results recorded. Based on these results, about how many times would you expect ${cols[i].toLowerCase()} in ${N * k} spins?`, visual: vis, expr: `${cnt[i]}/${N}*${N * k}` });
  }
  if (v === 2) {
    const t = r.int(0, 2);
    if (t === 0) { const s = r.int(2, 6), p = r.int(2, 5), h = r.int(2, 4); return num(s * p * h, ['Multiply the number of choices for each part.', `${s} × ${p} × ${h} = ${s * p * h}.`, `There are ${s * p * h} outfits.`], { q: `An outfit is made of one of ${s} shirts, one of ${p} pairs of pants and one of ${h} hats. How many different outfits are there?`, expr: `${s}*${p}*${h}` }); }
    if (t === 1) { const d = r.int(3, 4); return num(10 ** d, [`Each of the ${d} digits has 10 choices (0 to 9).`, `${Array(d).fill(10).join(' × ')} = ${10 ** d}.`, `There are ${comma(10 ** d)} codes.`], { q: `A lock code has ${d} digits, each from 0 to 9 (repeats allowed). How many codes are possible?`, expr: `10**${d}` }); }
    const sides = r.pick([4, 6, 8, 10, 12]);
    return num(2 * sides, [`The coin has 2 outcomes and the die has ${sides}.`, `2 × ${sides} = ${2 * sides}.`, `There are ${2 * sides} outcomes.`], { q: `A coin is flipped and a ${sides}-sided die is rolled. How many outcomes are possible?`, expr: `2*${sides}` });
  }
  if (v === 3) {
    const B = [['Roll a die, then flip a coin.', true], ['Pick a card from a deck, put it back, then pick another.', true], ['Pick a card from a deck, keep it, then pick another.', false], [`Choose two students from a class of ${r.int(20, 32)} for two different jobs (one person cannot get both).`, false], ['Spin a spinner twice.', true], ['Take one marble from a bag, do not put it back, then take a second.', false]];
    const [s, ind] = r.pick(B), right = ind ? 'independent' : 'dependent';
    return mc(r, right, [ind ? 'dependent' : 'independent'], { q: `Are these events independent or dependent? ${s}`, steps: [ind ? 'The first result does not change the chances for the second.' : 'The first pick changes what is left, so the chances change.', `So they are ${right}.`] });
  }
  if (r.bool()) { const k = r.int(2, 6), f = 7 - k; return num(frac(f, 12), [`P(heads) = 1/2. P(at least ${k}) = ${f}/6.`, `Independent: multiply. 1/2 × ${f}/6 = ${f}/12.`, `So P = ${frac(f, 12)}.`], { q: `A coin is flipped and a six-sided die is rolled. What is P(heads and a number of at least ${k})?`, expr: `1/2*${f}/6` }); }
  return num(frac(rd * (rd - 1), T * (T - 1)), [`First red: ${rd}/${T}. Then one red is gone: ${rd - 1}/${T - 1}.`, `Multiply: ${rd}/${T} × ${rd - 1}/${T - 1} = ${rd * (rd - 1)}/${T * (T - 1)}.`, `Simplified, P = ${frac(rd * (rd - 1), T * (T - 1))}.`], { q: `A bag has ${rd} red, ${bl} blue and ${gr} green marbles. Two are taken without putting the first back. What is P(both red)?`, expr: `${rd}/${T}*${rd - 1}/${T - 1}` });
});

// ───────────── Statistics ─────────────
skill('9-stats', 9, 'Statistics', 'Mean, median, mode and range', ['Mean: add the values and divide by how many. Median: the middle value in order. Mode: the most common value. Range: largest − smallest.', 'If the mean of n numbers is m, they add to n × m; use that to find a missing number.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const n = r.int(5, 8), base = r.shuffle(Array.from({ length: 30 }, (_, i) => i + 1)).slice(0, n - 1), data = r.shuffle([...base, r.pick(base)]), s = [...data].sort((a, b) => a - b), sum = data.reduce((a, b) => a + b, 0);
    const t = r.int(0, 3), list = data.join(', ');
    if (t === 0) { const m = rnd(sum / n + 1e-9, 1); return num(dec(m), [`Add: ${data.join(' + ')} = ${sum}.`, `Divide by ${n}: ${sum} ÷ ${n} ≈ ${dec(m)}.`, `The mean is about ${dec(m)}.`], { q: `Find the mean of ${list}. Round to the nearest tenth.`, tol: 0.051, expr: `Math.round(${sum}/${n}*10+1e-6)/10` }); }
    if (t === 1) { const md = median(data); return num(dec(md), [`In order: ${s.join(', ')}.`, n % 2 ? `The middle value is ${md}.` : `The middle two are ${s[n / 2 - 1]} and ${s[n / 2]}; halfway is ${dec(md)}.`, `The median is ${dec(md)}.`], { q: `Find the median of ${list}.`, expr: `${md}` }); }
    if (t === 2) { const mode = s.find((x, i) => s[i + 1] === x); return num(mode, ['Look for the value that appears most often.', `${mode} appears twice; every other value appears once.`, `The mode is ${mode}.`], { q: `Find the mode of ${list}.`, expr: `${mode}` }); }
    return num(s[n - 1] - s[0], [`Largest: ${s[n - 1]}. Smallest: ${s[0]}.`, `${s[n - 1]} − ${s[0]} = ${s[n - 1] - s[0]}.`, `The range is ${s[n - 1] - s[0]}.`], { q: `Find the range of ${list}.`, expr: `${s[n - 1]}-${s[0]}` });
  }
  if (v === 1) {
    const vals = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 4).sort((a, b) => a - b); let fq; do fq = vals.map(() => r.int(1, 7)); while (fq.filter((f) => f === Math.max(...fq)).length > 1);
    const N = fq.reduce((a, b) => a + b, 0), all = vals.flatMap((x, i) => Array(fq[i]).fill(x)), vis = { type: 'table', head: ['Goals in a game', 'Number of games'], rows: vals.map((x, i) => [x, fq[i]]) }, t = r.int(0, 2);
    if (t === 0) { const mo = vals[fq.indexOf(Math.max(...fq))]; return num(mo, ['The mode has the highest frequency.', `${mo} goals happened in ${Math.max(...fq)} games, more than any other.`, `The mode is ${mo}.`], { q: 'The table shows the goals a hockey team scored in each game. What is the mode?', visual: vis, expr: `${mo}` }); }
    if (t === 1) { const md = median(all); return num(dec(md), [`There are ${N} games. Listed in order: ${all.join(', ')}.`, `The middle ${N % 2 ? 'value is' : 'two average to'} ${dec(md)}.`, `The median is ${dec(md)}.`], { q: 'The table shows the goals a hockey team scored in each game. What is the median?', visual: vis, expr: `${md}` }); }
    const sum = all.reduce((a, b) => a + b, 0), m = rnd(sum / N + 1e-9, 1);
    return num(dec(m), [`Total goals: ${vals.map((x, i) => `${x} × ${fq[i]}`).join(' + ')} = ${sum}.`, `Divide by ${N} games: ${sum} ÷ ${N} ≈ ${dec(m)}.`, `The mean is about ${dec(m)}.`], { q: 'The table shows the goals a hockey team scored in each game. What is the mean number of goals? Round to the nearest tenth.', visual: vis, tol: 0.051, expr: `Math.round(${sum}/${N}*10+1e-6)/10` });
  }
  let n, m, given, last; do { n = r.int(4, 6); m = r.int(60, 90); given = Array.from({ length: n - 1 }, () => r.int(55, 99)); last = m * n - given.reduce((a, b) => a + b, 0); } while (last < 40 || last > 100);
  return num(last, [`The ${n} marks must add to ${n} × ${m} = ${m * n}.`, `The others add to ${given.join(' + ')} = ${m * n - last}.`, `${m * n} − ${m * n - last} = ${last}. The last mark is ${last}.`], { q: `${r.pick(NAMES)}'s first ${n - 1} test marks are ${given.join(', ')}. What mark is needed on the next test for a mean of ${m}?`, expr: `${m}*${n}-(${given.join('+')})` });
});

skill('9-quartile', 9, 'Statistics', 'Quartiles and biased samples', ['Put the data in order and find the median. Q1 is the median of the lower half and Q3 is the median of the upper half (leave out the middle value when there is an odd number of values).', 'A sample is biased if some members of the group are more likely to be chosen; a random sample of the whole group is fair.'], (r) => {
  if (r.bool(0.6)) {
    const n = r.pick([7, 8, 9, 11]), data = Array.from({ length: n }, () => r.int(10, 60)), s = [...data].sort((a, b) => a - b), lower = s.slice(0, Math.floor(n / 2)), upper = s.slice(Math.ceil(n / 2)), q1 = median(lower), q3 = median(upper), t = r.int(0, 2);
    const st = [`In order: ${s.join(', ')}.`, `Lower half: ${lower.join(', ')}. Upper half: ${upper.join(', ')}.`];
    if (t === 0) return num(dec(q1), [...st, `Q1 is the median of the lower half: Q1 = ${dec(q1)}.`], { q: `Find the first quartile (Q1) of: ${data.join(', ')}`, expr: `${q1}` });
    if (t === 1) return num(dec(q3), [...st, `Q3 is the median of the upper half: Q3 = ${dec(q3)}.`], { q: `Find the third quartile (Q3) of: ${data.join(', ')}`, expr: `${q3}` });
    return num(dec(q3 - q1), [...st, `Q1 = ${dec(q1)} and Q3 = ${dec(q3)}.`, `IQR = ${dec(q3)} − ${dec(q1)} = ${dec(q3 - q1)}.`], { q: `Find the interquartile range of: ${data.join(', ')}`, expr: `${q3}-${q1}` });
  }
  const S = [['which sport the students at a school like best', 'students at the school', ['the players on the school hockey team', 'students leaving a basketball game']], ['how much time people in a town spend reading each week', 'people in the town', ['people leaving the public library', 'members of a book club']], ['whether people in a city want a new bike lane', 'people in the city', ['members of a cycling club', 'customers at a car dealership']], ['the favourite lunch of grade 9 students', 'grade 9 students', ['students in the line for pizza', 'students in one cooking class']]];
  const [topic, pop, biased] = r.pick(S), k = r.pick([30, 40, 50, 60]), fair = [`${k} ${pop} chosen at random`, `every 10th name on a list of all ${pop}`];
  if (r.bool()) { const right = r.pick(biased); return mc(r, right, fair, { q: `A survey wants to find ${topic}. Which sample is biased?`, steps: [`${right[0].toUpperCase() + right.slice(1)} are more likely than others to give one kind of answer.`, `So that sample is biased: ${right}.`] }); }
  const right = r.pick(fair);
  return mc(r, right, biased, { q: `A survey wants to find ${topic}. Which sample is NOT biased?`, steps: ['A fair sample gives every member of the whole group the same chance to be picked.', `So the fair sample is ${right}.`] });
});

export default list;
