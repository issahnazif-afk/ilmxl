// Grade 10 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
import * as GEO from './geo10.mjs';
import * as G from '../figs.mjs';
import * as GH from './geo-hs.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const nf = (s) => String(s).replace(/^-/, '−');                 // show "-3/4" as "−3/4"
const F = (n, d) => nf(frac(n, d));
const r1 = (x) => Math.round((x + 1e-9) * 10) / 10;              // round to the nearest tenth
const fm = (v) => neg(+dec(v));
const pw = (b, e) => (e === 0 ? '' : e === 1 ? `${b}` : e === 2 ? `${b}²` : e === 3 ? `${b}³` : `${b}^${neg(e)}`);
// terms [[coef, 'x²'], [coef, '']] → "3x² − 5"
const lin = (pairs) => {
  let out = '';
  for (const [c, v] of pairs) {
    if (!c) continue;
    const a = Math.abs(c), body = v ? `${a === 1 ? '' : a}${v}` : String(a);
    out += out ? ` ${c < 0 ? '−' : '+'} ${body}` : `${c < 0 ? '−' : ''}${body}`;
  }
  return out || '0';
};
// coefficients from the highest power down: [2, -3, 1] → "2x² − 3x + 1"
const px = (cs, v = 'x') => lin(cs.map((c, i) => [c, pw(v, cs.length - 1 - i)]));
const mul = (a, b) => { const out = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y))); return out; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const bin = (p, q, v = 'x') => `(${px([p, q], v)})`;
const lineY = (m, b) => `y = ${px([m, b])}`;
const P = (x, y) => `(${neg(x)}, ${neg(y)})`;
const ptItem = (x, y, steps, extra = {}) => txt(P(x, y), steps, { accept: [`${neg(x)}, ${neg(y)}`, `${neg(x)},${neg(y)}`], ...extra });
const solSet = (vals, steps, extra = {}) => { const u = [...new Set(vals.map((v) => +dec(v)))].sort((a, b) => a - b); return txt(u.map(fm).join(', '), steps, { numbers: u, ...extra }); };
const pf = (n) => { const out = []; let m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; } if (m > 1) out.push(m); return out.join(' × '); };
const sqx = (v, h) => (h === 0 ? `${v}²` : `(${v} ${sgn(-h)})²`);
const FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
const holds = (x, s, b) => (s === '<' ? x < b : s === '>' ? x > b : s === '≤' ? x <= b : x >= b);
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

// ───────────── 1. Numbers ─────────────
skill('10-gcflcm', 10, 'Numbers', 'Prime factors, GCF and LCM', ['Write each number as a product of primes.', 'The GCF is the biggest number that divides both. The LCM is the smallest number both divide into.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const ps = [2, 3, 5, 7], e = [r.int(1, 3), r.int(0, 2), r.int(0, 1), r.int(0, 1)]; if (e[1] + e[2] + e[3] === 0) e[1] = 1;
    const n = ps.reduce((a, p, i) => a * p ** e[i], 1);
    const show = (ex) => ps.map((p, i) => (ex[i] === 0 ? '' : pw(p, ex[i]))).filter(Boolean).join(' × ');
    return mc(r, show(e), [show([e[0] + 1, ...e.slice(1)]), show([e[0] - 1, e[1] + 1, e[2], e[3]]), show([e[0], e[1], e[2] + 1, e[3]])], { q: `Which is the prime factorization of ${comma(n)}?`, steps: [`Keep dividing by the smallest prime that works: ${n} = ${pf(n)}.`, `Group the repeated primes with powers: ${show(e)}.`] });
  }
  if (v === 1 || v === 2) {
    let a, b; do { a = r.int(6, 60); b = r.int(6, 60); } while (a === b || gcd(a, b) === 1);
    const g = gcd(a, b), l = lcm(a, b);
    if (v === 1) return num(g, [`${a} = ${pf(a)} and ${b} = ${pf(b)}.`, `Multiply the primes they share: GCF = ${g}.`, `So the GCF of ${a} and ${b} is ${g}.`], { q: `What is the greatest common factor of ${a} and ${b}?` });
    return num(l, [`The GCF of ${a} and ${b} is ${g}.`, `LCM = ${a} × ${b} ÷ ${g} = ${l}.`, `So the LCM of ${a} and ${b} is ${l}.`], { q: `What is the least common multiple of ${a} and ${b}?`, expr: `${a}*${b}/${g}` });
  }
  const who = r.pick(NAMES);
  if (r.bool()) {
    const g = r.int(3, 12); let p, q; do { p = r.int(2, 7); q = r.int(2, 7); } while (gcd(p, q) !== 1 || p === q);
    const a = g * p, b = g * q;
    return num(g, [`Each kit must use the same number of each item, so the number of kits must divide ${a} and ${b}.`, `${a} = ${pf(a)}, ${b} = ${pf(b)}: the GCF is ${g}.`, `So the greatest number of kits is ${g}.`], { q: `${who} is packing ${a} pencils and ${b} erasers into identical kits with nothing left over. What is the greatest number of kits?` });
  }
  let a, b; do { a = r.int(4, 15); b = r.int(4, 15); } while (a === b || a % b === 0 || b % a === 0);
  const l = lcm(a, b);
  return num(l, [`We need a number that is a multiple of both ${a} and ${b}.`, `The least common multiple is ${a} × ${b} ÷ ${gcd(a, b)} = ${l}.`, `So ${who} needs ${l} of each.`], { q: `Veggie burgers come in packs of ${a} and buns come in packs of ${b}. ${who} wants the same number of burgers and buns. What is the smallest number of each?`, expr: `${a}*${b}/${gcd(a, b)}` });
});
skill('10-realnum', 10, 'Numbers', 'Rational and irrational numbers', ['A rational number can be written as a fraction of two integers; its decimal ends or repeats.', 'An irrational number, like √2 or π, has a decimal that never ends and never repeats.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    if (r.bool()) {
      const n = r.int(2, 120), k = Math.round(Math.sqrt(n)), sq = k * k === n;
      return mc(r, sq ? 'Rational' : 'Irrational', [sq ? 'Irrational' : 'Rational'], { q: `Is √${n} rational or irrational?`, steps: [sq ? `${k} × ${k} = ${n}, so √${n} = ${k}.` : `${n} is not a perfect square: no whole number times itself makes ${n}.`, sq ? `${k} is an integer, so √${n} is rational.` : `So √${n} never ends or repeats: it is irrational.`] });
    }
    const L = [['π', 'Irrational', 'The digits of π never end and never repeat.'], ['0.121212… (the 12 repeats forever)', 'Rational', 'A repeating decimal can be written as a fraction: 12/99.'], ['−7/3', 'Rational', 'It is already a fraction of two integers.'], ['0.1010010001… (one more 0 each time)', 'Irrational', 'It never ends, and the pattern never repeats exactly.'], ['4.25', 'Rational', 'It ends, so it is a fraction: 425/100 = 17/4.'], ['√50', 'Irrational', '50 is not a perfect square, so √50 never ends or repeats.'], ['√(4/9)', 'Rational', '√(4/9) = 2/3, a fraction.']];
    const [x, a, why] = r.pick(L);
    return mc(r, a, [a === 'Rational' ? 'Irrational' : 'Rational'], { q: `Is ${x} rational or irrational?`, steps: [why, `So it is ${a.toLowerCase()}.`] });
  }
  if (v === 1) {
    const SETS = ['Natural numbers', 'Whole numbers', 'Integers', 'Rational numbers', 'Irrational numbers'];
    const kind = r.int(0, 4);
    const x = [String(r.int(1, 40)), '0', neg(-r.int(1, 40)), r.pick(['3/8', '−5/6', '2.75', '−0.4', '0.333…']), r.pick(['√7', '√15', 'π', '√2', '−√3'])][kind];
    const why = ['It is a counting number, so it is a natural number.', '0 is not a counting number, but it is a whole number.', 'It is negative and has no fraction part, so it is an integer.', 'It is a fraction (or an ending or repeating decimal) but not an integer.', 'Its decimal never ends or repeats.'][kind];
    return mc(r, SETS[kind], r.shuffle(SETS.filter((_, i) => i !== kind)).slice(0, 3), { q: `What is the most specific set that ${x} belongs to?`, steps: [why, `So the answer is ${SETS[kind].toLowerCase()}.`] });
  }
  if (v === 2) {
    const d = r.pick([4, 5, 8, 20, 25, 40]); let n; do { n = r.int(1, 2 * d - 1); } while (gcd(n, d) !== 1 || n === d);
    const x = n / d, places = dec(x).split('.')[1]?.length ?? 0, top = Math.round(x * 10 ** places);
    return num(frac(n, d), [`${dec(x)} = ${top}/${10 ** places}.`, `Divide the top and bottom by ${gcd(top, 10 ** places)}.`, `So ${dec(x)} = ${frac(n, d)}.`], { q: `Write ${dec(x)} as a fraction in simplest form.`, exactForm: 'fraction', expr: `${n}/${d}` });
  }
  const a = r.int(1, 8);
  return num(frac(a, 9), [`Let x = 0.${a}${a}${a}…. Then 10x = ${a}.${a}${a}${a}….`, `Subtract: 10x − x = ${a}, so 9x = ${a}.`, `x = ${a}/9 = ${frac(a, 9)}.`], { q: `Write 0.${a}${a}${a}… (the ${a} repeats forever) as a fraction in simplest form.`, exactForm: 'fraction', expr: `${a}/9` });
});
skill('10-roots', 10, 'Numbers', 'Roots, absolute value and order', ['√ asks which number times itself gives the number; ∛ asks which number used three times does.', 'Absolute value is the distance from 0, so it is never negative.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    if (r.bool()) { const k = r.nonzero(-7, 7); return num(k, [`We need a number that, multiplied by itself three times, gives ${neg(k ** 3)}.`, `${par(k)} × ${par(k)} × ${par(k)} = ${neg(k ** 3)}.`, `So ∛${par(k ** 3)} = ${neg(k)}.`], { q: `∛${par(k ** 3)} = ?`, say: `What is the cube root of ${k ** 3}?`, expr: `Math.cbrt(${k ** 3})` }); }
    const k = r.int(11, 25);
    return num(k, [`Try ${k}: ${k} × ${k} = ${k * k}.`, `So √${k * k} = ${k}.`], { q: `√${k * k} = ?`, say: `What is the square root of ${k * k}?`, expr: `Math.sqrt(${k * k})` });
  }
  if (v === 1) {
    let n; do { n = r.int(3, 150); } while (Number.isInteger(Math.sqrt(n)));
    const f = Math.floor(Math.sqrt(n));
    return mc(r, `${f} and ${f + 1}`, [`${f - 1} and ${f}`, `${f + 1} and ${f + 2}`, `${Math.floor(n / 2)} and ${Math.floor(n / 2) + 1}`], { q: `√${n} lies between which two whole numbers?`, steps: [`${f}² = ${f * f} and ${f + 1}² = ${(f + 1) ** 2}.`, `${n} is between ${f * f} and ${(f + 1) ** 2}, so √${n} is between ${f} and ${f + 1}.`] });
  }
  if (v === 2) {
    const a = r.nonzero(-15, 15), b = r.nonzero(-15, 15), c = r.int(-9, 9), d = r.int(-9, 9);
    const val = Math.abs(a) - Math.abs(b) + Math.abs(c - d);
    return num(val, [`|${neg(a)}| = ${Math.abs(a)} and |${neg(b)}| = ${Math.abs(b)}.`, `|${neg(c)} − ${par(d)}| = |${neg(c - d)}| = ${Math.abs(c - d)}.`, `${Math.abs(a)} − ${Math.abs(b)} + ${Math.abs(c - d)} = ${neg(val)}.`, `So the value is ${neg(val)}.`], { q: `Evaluate: |${neg(a)}| − |${neg(b)}| + |${neg(c)} − ${par(d)}|`, expr: `Math.abs(${a})-Math.abs(${b})+Math.abs(${c}-(${d}))` });
  }
  const pool = [];
  const add = (label, value) => { if (pool.every((p) => Math.abs(p[1] - value) > 0.04 && p[0] !== label)) pool.push([label, value]); };
  let guard = 0;
  while (pool.length < 4 && guard++ < 80) {
    const t = r.int(0, 2);
    if (t === 0) { const d = r.pick([2, 3, 4, 5, 8]), n = r.nonzero(-9, 9); if (gcd(n, d) === 1 && d !== 1) add(nf(`${n}/${d}`), n / d); }
    else if (t === 1) { const x = r.int(-30, 30) / 10; add(neg(x), x); }
    else { const k = r.pick([2, 3, 5, 6, 7, 8, 10]); add(`√${k}`, Math.sqrt(k)); }
  }
  const big = r.bool(), best = [...pool].sort((a, b) => (big ? b[1] - a[1] : a[1] - b[1]))[0];
  return mc(r, best[0], pool.filter((p) => p !== best).map((p) => p[0]), { q: `Which number is the ${big ? 'greatest' : 'least'}? ${pool.map((p) => p[0]).join(',  ')}`, steps: [`Write each as a decimal: ${pool.map((p) => `${p[0]} ≈ ${dec(p[1], 2)}`).join(', ')}.`, `The ${big ? 'greatest' : 'least'} is ${best[0]}.`] });
});

// ───────────── 2. Exponents ─────────────
skill('10-powers', 10, 'Exponents', 'Evaluate powers', ['A power means repeated multiplication: 2^3 = 2 × 2 × 2.', 'A negative exponent means one over: 2^−3 = 1/2^3. Anything (except 0) to the power 0 is 1.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(2, 5), n = r.int(2, a > 3 ? 3 : 4), inside = r.bool(), val = inside ? (-a) ** n : -(a ** n);
    return inside
      ? num(val, [`(−${a})^${n} means ${Array(n).fill(`(−${a})`).join(' × ')}.`, `${n % 2 === 0 ? 'An even' : 'An odd'} number of negatives gives a ${val > 0 ? 'positive' : 'negative'}: ${neg(val)}.`, `So (−${a})^${n} = ${neg(val)}.`], { q: `Evaluate: (−${a})^${n}`, expr: `(-${a})**${n}` })
      : num(val, [`With no brackets, the power is done first: ${a}^${n} = ${a ** n}.`, `Then the minus sign: −${a ** n}.`, `So −${a}^${n} = ${neg(val)}.`], { q: `Evaluate: −${a}^${n}`, expr: `-(${a}**${n})` });
  }
  if (v === 1) {
    if (r.bool()) { const d = r.int(2, 5); let n; do { n = r.int(1, d - 1); } while (gcd(n, d) !== 1); const e = r.int(2, 3); return num(frac(n ** e, d ** e), [`Raise the top and the bottom to the power ${e}.`, `${n}^${e} = ${n ** e} and ${d}^${e} = ${d ** e}.`, `So (${n}/${d})^${e} = ${frac(n ** e, d ** e)}.`], { q: `Evaluate: (${n}/${d})^${e}`, expr: `(${n}/${d})**${e}` }); }
    const x = r.pick([0.1, 0.2, 0.3, 0.5, 1.1, 1.2, 1.5]), e = r.int(2, 3), val = dec(x ** e);
    return num(val, [`${x}^${e} = ${Array(e).fill(x).join(' × ')}.`, `Multiply: ${val}.`, `So ${x}^${e} = ${val}.`], { q: `Evaluate: ${x}^${e}`, expr: `${x}**${e}` });
  }
  if (v === 2) {
    if (r.bool()) { const b = r.int(2, 5), e = r.int(1, b > 3 ? 2 : 4); return num(frac(1, b ** e), [`A negative exponent means one over the positive power.`, `${b}^−${e} = 1/${b}^${e} = 1/${b ** e}.`, `So the answer is ${frac(1, b ** e)}.`], { q: `Evaluate: ${b}^−${e}`, expr: `${b}**(-${e})` }); }
    const d = r.int(2, 5); let n; do { n = r.int(1, 6); } while (gcd(n, d) !== 1 || n === d); const e = r.int(1, 2);
    return num(frac(d ** e, n ** e), [`A negative exponent flips the fraction: (${n}/${d})^−${e} = (${d}/${n})^${e}.`, `${d}^${e} ÷ ${n}^${e} = ${d ** e}/${n ** e}.`, `So the answer is ${frac(d ** e, n ** e)}.`], { q: `Evaluate: (${n}/${d})^−${e}`, expr: `(${n}/${d})**(-${e})` });
  }
  const a = r.int(2, 12), b = r.int(2, 5), e = r.int(1, 2);
  return num(frac(b ** e + 1, b ** e), [`${a}^0 = 1, since any non-zero number to the power 0 is 1.`, `${b}^−${e} = 1/${b ** e}.`, `1 + 1/${b ** e} = ${frac(b ** e + 1, b ** e)}.`, `So the answer is ${frac(b ** e + 1, b ** e)}.`], { q: `Evaluate: ${a}^0 + ${b}^−${e}`, expr: `${a}**0+${b}**(-${e})` });
});
skill('10-explaws', 10, 'Exponents', 'Laws of exponents', ['Multiplying powers of the same base: add the exponents. Dividing: subtract them.', 'A power of a power: multiply the exponents.'], (r) => {
  const v = r.int(0, 4);
  const a = r.nonzero(-6, 9), b = r.nonzero(-6, 9);
  if (v === 0) return num(a + b, [`Same base, multiplying: add the exponents.`, `${neg(a)} + ${par(b)} = ${neg(a + b)}.`, `So the exponent is ${neg(a + b)}.`], { q: `Simplify: x^${neg(a)} × x^${neg(b)} = x^?`, unit: 'exponent =', expr: `${a}+(${b})` });
  if (v === 1) return num(a - b, [`Same base, dividing: subtract the exponents.`, `${neg(a)} − ${par(b)} = ${neg(a - b)}.`, `So the exponent is ${neg(a - b)}.`], { q: `Simplify: x^${neg(a)} ÷ x^${neg(b)} = x^?`, unit: 'exponent =', expr: `${a}-(${b})` });
  if (v === 2) { const p = r.nonzero(-5, 6), q = r.int(2, 4); return num(p * q, [`A power of a power: multiply the exponents.`, `${neg(p)} × ${q} = ${neg(p * q)}.`, `So the exponent is ${neg(p * q)}.`], { q: `Simplify: (x^${neg(p)})^${q} = x^?`, unit: 'exponent =', expr: `${p}*${q}` }); }
  if (v === 3) {
    const base = r.pick([2, 3]), t = r.int(0, base === 2 ? 7 : 4), m = r.int(t + 1, t + 6), n = t - m;
    return num(base ** t, [`Same base: add the exponents. ${m} + ${par(n)} = ${t}.`, `${base}^${t} = ${base ** t}.`, `So the answer is ${base ** t}.`], { q: `Evaluate: ${base}^${m} × ${base}^${neg(n)}`, expr: `${base}**${m}*${base}**(${n})` });
  }
  const c = r.int(2, 3), p = r.int(1, 4), q = r.int(1, 4), n = r.int(2, 3);
  const mn = (k, e1, e2) => `${k}${pw('x', e1)}${pw('y', e2)}`;
  return mc(r, mn(c ** n, p * n, q * n), [mn(c * n, p * n, q * n), mn(c ** n, p + n, q + n), mn(c, p * n, q * n)], { q: `Which expression is equal to (${mn(c, p, q)})^${n}?`, steps: [`Raise each factor to the power ${n}: ${c}^${n} = ${c ** n}.`, `Multiply the exponents: x^${p * n} and y^${q * n}.`, `So the answer is ${mn(c ** n, p * n, q * n)}.`] });
});

// ───────────── 3. Scientific notation ─────────────
skill('10-sci', 10, 'Scientific notation', 'Work with scientific notation', ['Scientific notation is a number from 1 to just under 10, times a power of 10.', 'To multiply or divide, work with the numbers and the powers of 10 separately.'], (r) => {
  const v = r.int(0, 4);
  const sci = (m, e) => `${dec(m)} × 10^${neg(e)}`;
  const std = (m, e) => dec(m * 10 ** e, 12);
  const show = (s) => (Number(s) >= 1000 ? comma(Number(s)) : s);
  const m = r.int(11, 99) / 10, e = r.pick([-6, -5, -4, -3, -2, 3, 4, 5, 6, 7, 8]);
  if (v === 0) return mc(r, sci(m, e), [sci(m, -e), sci(m, e + 1), sci(m, e - 1)], { q: `Which is ${show(std(m, e))} in scientific notation?`, steps: [`Move the decimal point so one non-zero digit is in front of it: ${dec(m)}.`, `It moved ${Math.abs(e)} places ${e > 0 ? 'left, so the power is positive' : 'right, so the power is negative'}: 10^${neg(e)}.`, `So ${show(std(m, e))} = ${sci(m, e)}.`] });
  if (v === 1) return num(std(m, e), [`10^${neg(e)} means move the decimal point ${Math.abs(e)} places to the ${e > 0 ? 'right' : 'left'}.`, `${dec(m)} becomes ${show(std(m, e))}.`, `So ${sci(m, e)} = ${show(std(m, e))}.`], { q: `Write ${sci(m, e)} in standard form.`, expr: `${m}*10**(${e})` });
  if (v === 2) {
    let m2 = r.int(11, 99) / 10; const e2 = e + r.pick([-1, 0, 1]); if (m2 === m && e2 === e) m2 = +dec(m + 0.1);
    const a = sci(m, e), b = sci(m2, e2), big = m * 10 ** e > m2 * 10 ** e2 ? a : b;
    return mc(r, big, [big === a ? b : a], { q: `Which number is greater: ${a} or ${b}?`, steps: [e === e2 ? 'The powers of 10 are the same, so compare the first numbers.' : 'Compare the powers of 10 first: the bigger power wins.', `So ${big} is greater.`] });
  }
  const p = r.int(-6, 9), q = r.int(-6, 9);
  if (v === 3) {
    const a = r.int(2, 9), b = r.int(2, 9), ab = a * b, mm = ab >= 10 ? ab / 10 : ab, ee = ab >= 10 ? p + q + 1 : p + q;
    return mc(r, sci(mm, ee), [sci(mm, ee + 1), sci(a + b > 9 ? (a + b) / 10 : a + b, ee), sci(mm, p * q === ee ? ee - 2 : p * q)], { q: `Multiply: (${a} × 10^${neg(p)}) × (${b} × 10^${neg(q)})`, steps: [`Multiply the numbers: ${a} × ${b} = ${ab}. Add the powers: ${neg(p)} + ${par(q)} = ${neg(p + q)}.`, ab >= 10 ? `${ab} × 10^${neg(p + q)} = ${sci(mm, ee)}, so the first number is between 1 and 10.` : `That gives ${sci(mm, ee)}.`] });
  }
  const b = r.int(11, 30) / 10, c = r.int(2, Math.floor(9.9 / b)), a = dec(b * c);
  return mc(r, sci(c, p - q), [sci(c, p + q), sci(c, q - p), sci(c + 1, p - q)], { q: `Divide: (${a} × 10^${neg(p)}) ÷ (${dec(b)} × 10^${neg(q)})`, steps: [`Divide the numbers: ${a} ÷ ${dec(b)} = ${c}.`, `Subtract the powers: ${neg(p)} − ${par(q)} = ${neg(p - q)}.`, `So the answer is ${sci(c, p - q)}.`] });
});

// ───────────── 4. Radical expressions ─────────────
const SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
const rad = (c, m) => (c === 0 ? '0' : m === 1 ? neg(c) : `${c === 1 ? '' : c === -1 ? '−' : neg(c)}√${m}`);
skill('10-radsimp', 10, 'Radical expressions', 'Simplify and multiply radicals', ['Pull out the largest perfect square: √50 = √25 × √2 = 5√2.', '√a × √b = √(ab), and √a × √a = a.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const k = r.int(2, 7), m = r.pick(SQF.slice(0, 7));
    return mc(r, rad(k, m), [rad(k * k, m), rad(k === 2 ? 3 : k - 1, m), rad(m, k)], { q: `Simplify: √${k * k * m}`, steps: [`Find the largest perfect square that divides ${k * k * m}: it is ${k * k}.`, `√${k * k * m} = √${k * k} × √${m} = ${k} × √${m}.`, `So √${k * k * m} = ${rad(k, m)}.`] });
  }
  if (v === 1) {
    const k = r.pick([2, 3, 5, 6, 7]); let m; do { m = r.pick([2, 3, 5, 7, 10, 11]); } while (m === k);
    return mc(r, rad(k, m), [rad(m, k), rad(k * k, m), rad(2 * k, m)], { q: `Simplify: √${k * m} × √${k}`, steps: [`Multiply under one root: √(${k * m} × ${k}) = √${k * k * m}.`, `${k * k * m} = ${k * k} × ${m}, so √${k * k * m} = ${rad(k, m)}.`] });
  }
  if (v === 2) {
    const a = r.int(2, 6), b = r.int(2, 6), m = r.pick([2, 3, 5, 6, 7]);
    return num(a * b * m, [`Multiply the numbers in front: ${a} × ${b} = ${a * b}.`, `√${m} × √${m} = ${m}.`, `${a * b} × ${m} = ${a * b * m}.`, `So the product is ${a * b * m}.`], { q: `Multiply: ${rad(a, m)} × ${rad(b, m)}`, expr: `${a}*Math.sqrt(${m})*${b}*Math.sqrt(${m})` });
  }
  const [m, n] = r.shuffle([2, 3, 5, 7]).slice(0, 2), a = r.int(2, 5), b = r.int(2, 5);
  return mc(r, rad(a * b, m * n), [rad(a + b, m * n), rad(a * b, m + n), rad(a * b * m * n, 1)], { q: `Multiply: ${rad(a, m)} × ${rad(b, n)}`, steps: [`Multiply the numbers in front: ${a} × ${b} = ${a * b}.`, `Multiply the numbers under the roots: √${m} × √${n} = √${m * n}.`, `So the product is ${rad(a * b, m * n)}.`] });
});
skill('10-radops', 10, 'Radical expressions', 'Add, subtract and rationalize radicals', ['Only like radicals can be added: 2√3 + 5√3 = 7√3. Simplify first to find them.', 'To rationalize, multiply the top and bottom by the root in the denominator.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const m = r.pick([2, 3, 5, 6, 7]); let a = r.int(1, 5), b = r.int(1, 5); if (a === b) b = a + 1;
    const plus = r.bool() || a < b, res = plus ? a + b : a - b;
    return mc(r, rad(res, m), [`√${(a * a + (plus ? b * b : -b * b)) * m}`, rad(res, 2 * m), rad(a * b, m)].filter((x) => x !== rad(res, m)), { q: `Simplify: √${a * a * m} ${plus ? '+' : '−'} √${b * b * m}`, steps: [`Simplify each root: √${a * a * m} = ${rad(a, m)} and √${b * b * m} = ${rad(b, m)}.`, `They are like radicals, so combine the numbers in front: ${a} ${plus ? '+' : '−'} ${b} = ${res}.`, `So the answer is ${rad(res, m)}.`] });
  }
  if (v === 1) {
    const m = r.pick([2, 3, 5, 6, 7, 10]), k = r.int(1, 12), g = gcd(k, m);
    const top = rad(k / g, m), ans = m / g === 1 ? top : `${top}/${m / g}`;
    return mc(r, ans, [`${k}/${m}`, rad(k, m), `√${m}/${k}`].filter((x) => x !== ans), { q: `Rationalize the denominator: ${k}/√${m}`, steps: [`Multiply the top and bottom by √${m}: ${k}√${m} / (√${m} × √${m}) = ${k}√${m}/${m}.`, g > 1 ? `Divide ${k} and ${m} by ${g}: ${ans}.` : `It cannot be simplified: ${ans}.`] });
  }
  if (v === 2) {
    const m = r.pick([2, 3, 5, 7]), a = r.int(2, 5), b = r.int(1, 6);
    const right = `${a * m} + ${rad(a * b, m)}`;
    return mc(r, right, [`${a * m} + ${rad(b, m)}`, `${a} + ${rad(a * b, m)}`, rad(a * b + a * m, m)], { q: `Expand and simplify: ${rad(a, m)}(${b} + √${m})`, steps: [`Multiply ${rad(a, m)} by each term in the brackets.`, `${rad(a, m)} × ${b} = ${rad(a * b, m)} and ${rad(a, m)} × √${m} = ${a} × ${m} = ${a * m}.`, `So the answer is ${right}.`] });
  }
  const a = r.pick([2, 3, 5, 6, 7, 10, 11]), b = r.int(1, 5);
  return num(a - b * b, [`(√${a} + ${b})(√${a} − ${b}) is a difference of squares: (√${a})² − ${b}².`, `${a} − ${b * b} = ${neg(a - b * b)}.`, `So the product is ${neg(a - b * b)}.`], { q: `Multiply: (√${a} + ${b})(√${a} − ${b})`, expr: `(Math.sqrt(${a})+${b})*(Math.sqrt(${a})-${b})` });
});

// ───────────── 5. Rational exponents ─────────────
const ex = (n, d) => { const [a, b] = simplify(n, d); return b === 1 ? neg(a) : `(${nf(`${a}/${b}`)})`; };
skill('10-ratexp', 10, 'Rational exponents', 'Rational exponents', ['x^(1/n) is the nth root of x, and x^(m/n) is that root raised to the power m.', 'The exponent laws still work: add, subtract or multiply the fraction exponents.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const q = r.pick([2, 2, 3, 4]), b = q === 2 ? r.int(2, 10) : q === 3 ? r.int(2, 5) : r.int(2, 3), N = b ** q, p = r.int(1, 3), negE = r.bool(0.3);
    const rootName = q === 2 ? 'square' : q === 3 ? 'cube' : 'fourth';
    if (negE) return num(frac(1, b ** p), [`A negative exponent means one over: ${N}^(−${p}/${q}) = 1 / ${N}^(${p}/${q}).`, `The ${rootName} root of ${N} is ${b}, and ${b}^${p} = ${b ** p}.`, `So the answer is ${frac(1, b ** p)}.`], { q: `Evaluate: ${N}^(−${p}/${q})`, expr: `${N}**(-${p}/${q})` });
    return num(b ** p, [`The bottom of the exponent, ${q}, means take the ${rootName} root: ${b}.`, `The top, ${p}, means raise it to the power ${p}: ${b}^${p} = ${b ** p}.`, `So ${N}^(${p}/${q}) = ${b ** p}.`], { q: `Evaluate: ${N}^(${p}/${q})`, expr: `${N}**(${p}/${q})` });
  }
  const a = r.int(1, 5), b = r.int(2, 5), c = r.int(1, 5), d = r.int(2, 5);
  if (v === 1) return num(frac(a * d + c * b, b * d), [`Same base, multiplying: add the exponents.`, `${a}/${b} + ${c}/${d} = ${a * d}/${b * d} + ${c * b}/${b * d} = ${frac(a * d + c * b, b * d)}.`, `So the exponent is ${frac(a * d + c * b, b * d)}.`], { q: `Simplify: x^(${a}/${b}) × x^(${c}/${d}) = x^?`, unit: 'exponent =', expr: `${a}/${b}+${c}/${d}` });
  if (v === 2) return num(frac(a * d - c * b, b * d), [`Same base, dividing: subtract the exponents.`, `${a}/${b} − ${c}/${d} = ${a * d}/${b * d} − ${c * b}/${b * d} = ${F(a * d - c * b, b * d)}.`, `So the exponent is ${F(a * d - c * b, b * d)}.`], { q: `Simplify: x^(${a}/${b}) ÷ x^(${c}/${d}) = x^?`, unit: 'exponent =', expr: `${a}/${b}-${c}/${d}` });
  if (v === 3) return num(frac(a * c, b * d), [`A power of a power: multiply the exponents.`, `${a}/${b} × ${c}/${d} = ${a * c}/${b * d} = ${frac(a * c, b * d)}.`, `So the exponent is ${frac(a * c, b * d)}.`], { q: `Simplify: (x^(${a}/${b}))^(${c}/${d}) = x^?`, unit: 'exponent =', expr: `${a}/${b}*${c}/${d}` });
  const n = r.int(2, 5), m = r.int(1, 7);
  const root = n === 2 ? '√' : n === 3 ? '∛' : n === 4 ? '∜' : '⁵√';
  return num(frac(m, n), [`The root becomes the bottom of the exponent: ${n}.`, `The power inside becomes the top: ${m}.`, `So ${root}(${pw('x', m)}) = x^(${m}/${n}), and the exponent is ${frac(m, n)}.`], { q: `Write ${root}(${pw('x', m)}) as a power of x. What is the exponent?`, unit: 'exponent =', expr: `${m}/${n}` });
});

// ───────────── 6. Coordinate plane ─────────────
// ── coordinate geometry with pictures (figures: ../figs.mjs and ./geo-hs.mjs) ──
const KL = (text, visual) => ({ text, visual });
const gw = (pts, e = 1, m = 5) => GH.window(pts, e, m);
// the right triangle under a segment A–B on a grid: legs across and up, labelled with their lengths
const distPic = (x1, y1, x2, y2, hl = []) => {
  const corner = [x2, y1], dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
  return GH.gridFig({ ...gw([[x1, y1], [x2, y2]]), pts: [[x1, y1, 'A'], [x2, y2, 'B']], segs: [[[x1, y1], [x2, y2], hl.includes('d') ? 'hlline' : 'ink'], ...(dx && dy ? [[[x1, y1], corner, hl.includes('x') ? 'hlline' : 'aux'], [corner, [x2, y2], hl.includes('y') ? 'hlline' : 'aux']] : [])], rights: dx && dy ? [[corner, [x1, y1], [x2, y2]]] : [], sides: dx && dy && hl.length ? [[[x1, y1], corner, `${dx}`, 'hl', [x2, y2]], [corner, [x2, y2], `${dy}`, 'hl', [x1, y1]]] : [] });
};
skill('10-quadrant', 10, 'Coordinate geometry', 'Quadrants, endpoints and distance', [
  KL('The axes split the plane into four quadrants, numbered I to IV anticlockwise from the top right: I (+, +), II (−, +), III (−, −), IV (+, −).', GH.gridFig({ x0: -5, x1: 5, y0: -5, y1: 5, notes: [{ at: [2.5, 2.5], s: 'I', t: 'hl' }, { at: [-2.5, 2.5], s: 'II', t: 'hl' }, { at: [-2.5, -2.5], s: 'III', t: 'hl' }, { at: [2.5, -2.5], s: 'IV', t: 'hl' }] })),
  KL('A point (x, y): go across x, then up or down y.', GH.gridFig({ x0: -2, x1: 6, y0: -2, y1: 5, pts: [[4, 3, 'P(4, 3)']], segs: [[[0, 0], [4, 0], 'hlline'], [[4, 0], [4, 3], 'hlline']] })),
  KL('The midpoint is halfway: average the x-values and average the y-values.', GH.gridFig({ x0: -1, x1: 7, y0: -1, y1: 6, pts: [[0, 1, 'A'], [6, 5, 'B'], [3, 3, 'M', 'hl']], segs: [[[0, 1], [6, 5], 'ink']] })),
  KL('Distance: draw the right triangle under the segment. Its legs are the change in x and the change in y, so d = √(Δx² + Δy²).', distPic(-2, -1, 2, 2, ['x', 'y'])),
], (r) => {
  const v = r.int(0, 6);
  if (v === 0) {
    const x = r.nonzero(-6, 6), y = r.nonzero(-6, 6), Q = x > 0 ? (y > 0 ? 'I' : 'IV') : y > 0 ? 'II' : 'III';
    const pic = GH.gridFig({ x0: -7, x1: 7, y0: -7, y1: 7, pts: [[x, y, 'A']] });
    return mc(r, `Quadrant ${Q}`, ['I', 'II', 'III', 'IV'].filter((t) => t !== Q).map((t) => `Quadrant ${t}`), { q: `Which quadrant is point A in?`, visual: pic, steps: [St(`A is ${P(x, y)}: x is ${x > 0 ? 'positive (right of the y-axis)' : 'negative (left of the y-axis)'} and y is ${y > 0 ? 'positive (above the x-axis)' : 'negative (below the x-axis)'}.`, GH.gridFig({ x0: -7, x1: 7, y0: -7, y1: 7, pts: [[x, y, 'A']], segs: [[[0, 0], [x, 0], 'hlline'], [[x, 0], [x, y], 'hlline']] })), `So the point is in Quadrant ${Q}.`] });
  }
  if (v === 1) {
    const x = r.int(-6, 6), y = r.int(-6, 6);
    const w = { x0: -7, x1: 7, y0: -7, y1: 7 };
    return ptItem(x, y, [St(`Start at the origin. Go across to x = ${neg(x)}${x ? ` (${x > 0 ? 'right' : 'left'})` : ''}.`, GH.gridFig({ ...w, pts: [[x, y, 'P']], segs: [[[0, 0], [x, 0], 'hlline']] })), St(`Then ${y >= 0 ? 'up' : 'down'} to y = ${neg(y)}.`, GH.gridFig({ ...w, pts: [[x, y, 'P']], segs: [[[0, 0], [x, 0], 'hlline'], [[x, 0], [x, y], 'hlline']] })), `So P = ${P(x, y)}.`], { q: 'What are the coordinates of point P? Write them as (x, y).', visual: GH.gridFig({ ...w, pts: [[x, y, 'P']] }) });
  }
  if (v === 2 || v === 3) {
    let x1, y1, x2, y2; do { x1 = r.int(-7, 7); y1 = r.int(-7, 7); x2 = r.int(-7, 7); y2 = r.int(-7, 7); } while ((x1 + x2) % 2 || (y1 + y2) % 2 || (x1 === x2 && y1 === y2));
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, w = gw([[x1, y1], [x2, y2]]);
    if (v === 2) return ptItem(mx, my, [
      St(`Average the x-values: (${neg(x1)} + ${par(x2)}) ÷ 2 = ${neg(x1 + x2)} ÷ 2 = ${neg(mx)}.`),
      St(`Average the y-values: (${neg(y1)} + ${par(y2)}) ÷ 2 = ${neg(y1 + y2)} ÷ 2 = ${neg(my)}.`, GH.gridFig({ ...w, pts: [[x1, y1, 'A'], [x2, y2, 'B'], [mx, my, 'M', 'hl']], segs: [[[x1, y1], [x2, y2], 'ink']] })),
      `So the midpoint is M${P(mx, my)}.`,
    ], { q: 'Find the midpoint M of segment AB. Write it as (x, y).', visual: GH.gridFig({ ...w, pts: [[x1, y1, 'A'], [x2, y2, 'B']], segs: [[[x1, y1], [x2, y2], 'ink']] }) });
    return ptItem(x2, y2, [
      St(`From A to M, x changes by ${neg(mx - x1)} and y changes by ${neg(my - y1)}.`, GH.gridFig({ ...w, pts: [[x1, y1, 'A'], [mx, my, 'M']], arrows: [[[x1, y1], [mx, my], 'aux']] })),
      St(`M is halfway, so B is the same step again from M: x = ${neg(mx)} ${sgn(mx - x1)} = ${neg(x2)}, y = ${neg(my)} ${sgn(my - y1)} = ${neg(y2)}.`, GH.gridFig({ ...w, pts: [[x1, y1, 'A'], [mx, my, 'M'], [x2, y2, 'B', 'hl']], arrows: [[[x1, y1], [mx, my], 'aux'], [[mx, my], [x2, y2], 'aux']] })),
      `So B = ${P(x2, y2)}.`,
    ], { q: `M${P(mx, my)} is the midpoint of AB, and A is ${P(x1, y1)}. Find B. Write it as (x, y).`, visual: GH.gridFig({ ...w, pts: [[x1, y1, 'A'], [mx, my, 'M']], segs: [[[x1, y1], [mx, my], 'ink']] }) });
  }
  if (v === 4 || v === 5) {
    let dx, dy;
    if (v === 5) [dx, dy] = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]);
    else do { dx = r.int(1, 7); dy = r.int(1, 7); } while (Number.isInteger(Math.hypot(dx, dy)));
    const sx = r.pick([1, -1]), sy = r.pick([1, -1]), x1 = sx > 0 ? r.int(-7, 7 - dx) : r.int(-7 + dx, 7), y1 = sy > 0 ? r.int(-7, 7 - dy) : r.int(-7 + dy, 7), x2 = x1 + sx * dx, y2 = y1 + sy * dy;
    const s = dx * dx + dy * dy, d = Math.hypot(dx, dy), ans = v === 5 ? String(d) : dec(r1(d));
    return num(ans, [
      St(`Draw the right triangle under AB. Across: ${neg(x2)} − ${par(x1)} gives ${dx} units. Up or down: ${neg(y2)} − ${par(y1)} gives ${dy} units.`, distPic(x1, y1, x2, y2, ['x', 'y'])),
      St(`AB is the hypotenuse: d = √(${dx}² + ${dy}²) = √(${dx * dx} + ${dy * dy}) = √${s}.`, distPic(x1, y1, x2, y2, ['x', 'y', 'd'])),
      v === 5 ? `√${s} = ${d}.` : `√${s} ≈ ${dec(d, 3)}, which is ${ans} to the nearest tenth.`,
      `So the distance AB is ${v === 5 ? '' : 'about '}${ans}.`,
    ], { q: `Find the distance between A${P(x1, y1)} and B${P(x2, y2)}${v === 5 ? '' : '. Round to the nearest tenth'}.`, visual: distPic(x1, y1, x2, y2), tol: v === 5 ? undefined : 0.05001, expr: `Math.hypot(${x2}-(${x1}),${y2}-(${y1}))` });
  }
  const c = r.int(-6, 6), a = r.int(-7, 5), b = r.int(a + 1, 7), vert = r.bool();
  const [A, B] = vert ? [[c, a], [c, b]] : [[a, c], [b, c]], w = gw([A, B]);
  return num(b - a, [
    St(`A and B have the same ${vert ? 'x' : 'y'}-coordinate, so AB is ${vert ? 'up and down' : 'straight across'}: just count.`, GH.gridFig({ ...w, pts: [[...A, 'A'], [...B, 'B']], segs: [[A, B, 'hlline']] })),
    `${neg(b)} − ${par(a)} = ${b - a}.`,
    `So the distance is ${b - a} units.`,
  ], { q: `Find the distance between A${P(...A)} and B${P(...B)}.`, visual: GH.gridFig({ ...w, pts: [[...A, 'A'], [...B, 'B']] }), expr: `${b}-(${a})` });
});

// ───────────── 7. Solve equations ─────────────
skill('10-lineq', 10, 'Solve equations', 'Solve linear equations', ['Do the same thing to both sides to keep the balance.', 'Expand brackets, gather the x terms on one side and the numbers on the other, then divide.'], (r) => {
  const v = r.int(0, 3), x = r.int(-9, 12);
  if (v === 0) {
    const a = r.nonzero(-9, 9), b = r.nonzero(-20, 20), c = a * x + b;
    return num(x, [St(`Undo the ${b >= 0 ? 'adding' : 'subtracting'}: ${b >= 0 ? 'subtract' : 'add'} ${Math.abs(b)} on both sides.`, eqnLines([{ eq: `${px([a, b])} = ${neg(c)}` }, { eq: `${px([a, 0])} = ${neg(c - b)}`, note: `${b >= 0 ? '−' : '+'} ${Math.abs(b)}` }])), `Divide both sides by ${neg(a)}: x = ${neg(c - b)} ÷ ${par(a)} = ${neg(x)}.`, `So x = ${neg(x)}.`], { q: `Solve: ${px([a, b])} = ${neg(c)}`, unit: 'x =', expr: `(${c}-(${b}))/(${a})` });
  }
  if (v === 1) {
    const a = r.int(2, 7), b = r.nonzero(-6, 6); let c = r.int(1, 9); if (c === a) c++;
    const d = a * (x + b) - c * x;
    return num(x, [`Expand: ${px([a, a * b])} = ${px([c, d])}.`, `Subtract ${c}x from both sides: ${px([a - c, a * b])} = ${neg(d)}.`, `${px([a - c, 0])} = ${neg(d - a * b)}, so x = ${neg(d - a * b)} ÷ ${par(a - c)} = ${neg(x)}.`, `So x = ${neg(x)}.`], { q: `Solve: ${a}${bin(1, b)} = ${px([c, d])}`, unit: 'x =', expr: `(${d}-(${a * b}))/(${a - c})` });
  }
  if (v === 2) {
    const a = r.int(2, 6), xx = a * r.int(-6, 8), b = r.nonzero(-9, 9), c = xx / a + b;
    return num(xx, [`${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: x/${a} = ${neg(c - b)}.`, `Multiply both sides by ${a}: x = ${neg(c - b)} × ${a} = ${neg(xx)}.`, `So x = ${neg(xx)}.`], { q: `Solve: x/${a} ${sgn(b)} = ${neg(c)}`, unit: 'x =', expr: `(${c}-(${b}))*${a}` });
  }
  if (r.bool()) {
    const who = r.pick(NAMES), fee = r.pick([20, 25, 30, 40, 50]), m = r.pick([15, 18, 22, 25, 30, 35]), n = r.int(2, 12), T = fee + m * n;
    return num(n, [`Let n be the number of months: ${fee} + ${m}n = ${T}.`, `Subtract ${fee}: ${m}n = ${T - fee}.`, `Divide by ${m}: n = ${n}.`, `So ${who} paid for ${n} months.`], { q: `A gym charges a $${fee} sign-up fee plus $${m} per month. ${who} paid $${T} in total. For how many months did ${who} pay?`, expr: `(${T}-${fee})/${m}` });
  }
  const k = r.int(2, 8), w = r.int(3, 15), Pm = 4 * w + 2 * k;
  return num(w, [`Perimeter = 2(length + width) = 2(x + ${k} + x) = 4x + ${2 * k}.`, `4x + ${2 * k} = ${Pm}, so 4x = ${Pm - 2 * k}.`, `x = ${Pm - 2 * k} ÷ 4 = ${w}.`, `So x = ${w} cm.`], { q: `A rectangle is x cm wide and (x + ${k}) cm long. Its perimeter is ${Pm} cm. Find x.`, unit: 'x =', visual: { type: 'poly', points: [[1, 2], [9, 2], [9, 7], [1, 7]], labels: [`x + ${k}`, 'x', '', ''] }, expr: `(${Pm}-${2 * k})/4` });
});
skill('10-numsol', 10, 'Solve equations', 'How many solutions?', ['If the x terms cancel and a true statement is left (like 5 = 5), every x works: infinitely many solutions.', 'If they cancel and a false statement is left (like 5 = 2), there is no solution.'], (r) => {
  const a = r.int(2, 6), b = r.nonzero(-6, 6), v = r.int(0, 3);
  if (v <= 1) {
    const type = r.int(0, 2); const s = type === 0 ? a + r.pick([1, 2, -1]) : a, t = type === 2 ? a * b : a * b + r.nonzero(-5, 5);
    const right = ['Exactly one solution', 'No solution', 'Infinitely many solutions'][type];
    const why = type === 0 ? `The x terms are different (${a}x and ${s}x), so they do not cancel: there is one value of x.` : type === 1 ? `The x terms cancel, leaving ${neg(a * b)} = ${neg(t)}, which is false.` : `The x terms cancel, leaving ${neg(a * b)} = ${neg(a * b)}, which is always true.`;
    return mc(r, right, ['Exactly one solution', 'No solution', 'Infinitely many solutions'].filter((x) => x !== right), { q: `How many solutions does ${a}${bin(1, b)} = ${px([s, t])} have?`, steps: [`Expand the left side: ${px([a, a * b])} = ${px([s, t])}.`, why, `So: ${right.toLowerCase()}.`] });
  }
  if (v === 2) return num(a * b, [`Expand: ${px([a, a * b])} = ${a}x + c.`, `For every x to work, both sides must be the same, so c = ${neg(a * b)}.`, `So c = ${neg(a * b)}.`], { q: `What value of c makes ${a}${bin(1, b)} = ${a}x + c true for every value of x?`, unit: 'c =', expr: `${a}*(${b})` });
  const c = r.int(-9, 9); let d = r.int(-9, 9); if (d === c) d++;
  return num(a, [`For no solution, the x terms must cancel but the numbers must not.`, `The numbers ${neg(c)} and ${neg(d)} are different, so we only need k = ${a}.`, `So k = ${a}.`], { q: `What value of k makes ${lin([[1, 'kx'], [c, '']])} = ${lin([[a, 'x'], [d, '']])} have no solution?`, unit: 'k =' });
});

// ───────────── 8. Single-variable inequalities ─────────────
const ineqChoices = (r, s, b, extra) => { const right = `x ${s} ${neg(b)}`; return mc(r, right, [`x ${FLIP[s]} ${neg(b)}`, `x ${s} ${neg(-b)}`, `x ${FLIP[s]} ${neg(-b)}`, `x ${s === '<' ? '≤' : s === '>' ? '≥' : s === '≤' ? '<' : '>'} ${neg(b)}`].filter((c) => c !== right), extra); };
skill('10-ineqsolve', 10, 'Single-variable inequalities', 'Solve inequalities', ['Solve an inequality like an equation.', 'But when you multiply or divide both sides by a negative number, flip the sign.'], (r) => {
  const v = r.int(0, 3), s = r.pick(['<', '>', '≤', '≥']), x0 = r.int(-8, 8), a = r.nonzero(-7, 7), fs = a < 0 ? FLIP[s] : s;
  if (v === 0) {
    const c = a * x0;
    return ineqChoices(r, fs, x0, { q: `Solve: ${px([a, 0])} ${s} ${neg(c)}`, steps: [`Divide both sides by ${neg(a)}.`, a < 0 ? `Dividing by a negative flips the sign: ${s} becomes ${fs}.` : 'The number is positive, so the sign stays the same.', `x ${fs} ${neg(x0)}.`] });
  }
  if (v === 1) {
    const b = r.nonzero(-15, 15), c = a * x0 + b;
    return ineqChoices(r, fs, x0, { q: `Solve: ${px([a, b])} ${s} ${neg(c)}`, steps: [`${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: ${px([a, 0])} ${s} ${neg(c - b)}.`, `Divide by ${neg(a)}${a < 0 ? ', and flip the sign because it is negative' : ''}.`, `x ${fs} ${neg(x0)}.`] });
  }
  if (v === 2) {
    const k = r.int(2, 6), b = r.nonzero(-5, 5); let c = r.int(-4, 8); if (c === k) c = k + 2;
    const d = k * (x0 + b) - c * x0, A = k - c, fs2 = A < 0 ? FLIP[s] : s;
    return ineqChoices(r, fs2, x0, { q: `Solve: ${k}${bin(1, b)} ${s} ${px([c, d])}`, steps: [`Expand: ${px([k, k * b])} ${s} ${px([c, d])}.`, `Gather the x terms on the left and the numbers on the right: ${px([A, 0])} ${s} ${neg(d - k * b)}.`, `Divide by ${neg(A)}${A < 0 ? ' and flip the sign' : ''}: x ${fs2} ${neg(x0)}.`] });
  }
  const b = r.int(-10, 10), c = a * x0 + b;
  const cands = Array.from({ length: 9 }, (_, i) => x0 - 4 + i), good = cands.filter((x) => holds(x, fs, x0)), bad = cands.filter((x) => !holds(x, fs, x0));
  const right = r.pick(good);
  return mc(r, neg(right), r.shuffle(bad).slice(0, 3).map(neg), { q: `Which value of x is a solution of ${px([a, b])} ${s} ${neg(c)}?`, steps: [`Solve first: x ${fs} ${neg(x0)}.`, `Only ${neg(right)} fits x ${fs} ${neg(x0)}.`, `Check: ${neg(a)} × ${par(right)} ${sgn(b)} = ${neg(a * right + b)}, and ${neg(a * right + b)} ${s} ${neg(c)} is true.`] });
});
skill('10-ineqgraph', 10, 'Single-variable inequalities', 'Graph inequalities', ['An open circle means the number is not included (< or >). A closed circle means it is included (≤ or ≥).', 'Shade to the right for greater than, and to the left for less than.'], (r) => {
  const v = r.int(0, 2), s = r.pick(['<', '>', '≤', '≥']), b = r.int(-9, 9);
  const desc = (sym, n) => `${sym === '<' || sym === '>' ? 'an open' : 'a closed'} circle at ${neg(n)}, shaded to the ${sym === '<' || sym === '≤' ? 'left' : 'right'}`;
  const Cap = (t) => t[0].toUpperCase() + t.slice(1);
  const all = ['<', '>', '≤', '≥'];
  const ray = (sym, n) => ({ type: 'numberline', from: n - 6, to: n + 6, step: 1, ray: { at: n, dir: sym === '<' || sym === '≤' ? 'left' : 'right', open: sym === '<' || sym === '>' } });
  if (v === 0) return mc(r, `x ${s} ${neg(b)}`, all.filter((t) => t !== s).map((t) => `x ${t} ${neg(b)}`), { q: `A number line shows ${desc(s, b)}. Which inequality does it show?`, visual: ray(s, b), steps: [`${s === '<' || s === '>' ? 'Open circle: the number is not included, so it is < or >.' : 'Closed circle: the number is included, so it is ≤ or ≥.'}`, `Shaded to the ${s === '<' || s === '≤' ? 'left: less than' : 'right: greater than'}. So x ${s} ${neg(b)}.`] });
  if (v === 1) return mc(r, Cap(desc(s, b)), all.filter((t) => t !== s).map((t) => Cap(desc(t, b))), { q: `Which describes the graph of x ${s} ${neg(b)}?`, steps: [`${s} ${s === '<' || s === '>' ? 'does not include' : 'includes'} ${neg(b)}, so the circle is ${s === '<' || s === '>' ? 'open' : 'closed'}.`, `x is ${s === '<' || s === '≤' ? 'less' : 'greater'}, so shade to the ${s === '<' || s === '≤' ? 'left' : 'right'}.`] });
  const a = r.nonzero(-5, 5), k = r.nonzero(-10, 10), c = a * b + k, fs = a < 0 ? FLIP[s] : s;
  return mc(r, Cap(desc(fs, b)), all.filter((t) => t !== fs).map((t) => Cap(desc(t, b))), { q: `Solve ${px([a, k])} ${s} ${neg(c)}. Which describes the graph of the solution?`, steps: [`${k >= 0 ? 'Subtract' : 'Add'} ${Math.abs(k)}: ${px([a, 0])} ${s} ${neg(c - k)}.`, `Divide by ${neg(a)}${a < 0 ? ' and flip the sign' : ''}: x ${fs} ${neg(b)}.`, `So: ${desc(fs, b)}.`] });
});
skill('10-compound', 10, 'Single-variable inequalities', 'Compound inequalities', ['"And" means both must be true: the solution is the overlap, like −2 < x ≤ 5.', '"Or" means at least one is true: the graph has two parts.'], (r) => {
  const v = r.int(0, 3), lo = r.int(-8, 2), hi = lo + r.int(2, 8);
  if (v === 0) {
    const a = r.int(2, 5), b = r.nonzero(-9, 9), s1 = r.pick(['<', '≤']), s2 = r.pick(['<', '≤']);
    const right = `${neg(lo)} ${s1} x ${s2} ${neg(hi)}`;
    return mc(r, right, [`${neg(a * lo + b)} ${s1} x ${s2} ${neg(a * hi + b)}`, `${neg(lo)} ${s1 === '<' ? '≤' : '<'} x ${s2} ${neg(hi)}`, `x ${s1} ${neg(lo)} or x ${s2 === '<' ? '>' : '≥'} ${neg(hi)}`], { q: `Solve: ${neg(a * lo + b)} ${s1} ${px([a, b])} ${s2} ${neg(a * hi + b)}`, steps: [`Work on all three parts at once. ${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: ${neg(a * lo)} ${s1} ${a}x ${s2} ${neg(a * hi)}.`, `Divide all three parts by ${a}: ${right}.`] });
  }
  if (v === 1) {
    const and = r.bool(), cands = Array.from({ length: hi - lo + 7 }, (_, i) => lo - 3 + i);
    const ok = (x) => (and ? lo <= x && x < hi : x < lo || x >= hi);
    const right = r.pick(cands.filter(ok)), wrong = r.shuffle(cands.filter((x) => !ok(x))).slice(0, 3);
    const stmt = and ? `${neg(lo)} ≤ x < ${neg(hi)}` : `x < ${neg(lo)} or x ≥ ${neg(hi)}`;
    return mc(r, neg(right), wrong.map(neg), { q: `Which number is a solution of ${stmt}?`, steps: [and ? `"And": x must be at least ${neg(lo)} and also less than ${neg(hi)}.` : `"Or": x can be less than ${neg(lo)}, or ${neg(hi)} and above.`, `${neg(right)} fits, so it is a solution.`] });
  }
  if (v === 2) {
    const c1 = r.bool(), c2 = r.bool(), s1 = c1 ? '≤' : '<', s2 = c2 ? '≤' : '<';
    const right = `${neg(lo)} ${s1} x ${s2} ${neg(hi)}`;
    return mc(r, right, [`${neg(lo)} ${c1 ? '<' : '≤'} x ${s2} ${neg(hi)}`, `${neg(lo)} ${s1} x ${c2 ? '<' : '≤'} ${neg(hi)}`, `x ${c1 ? '<' : '≤'} ${neg(lo)} or x ${c2 ? '>' : '≥'} ${neg(hi)}`], { q: `A number line is shaded between ${neg(lo)} and ${neg(hi)}, with ${c1 ? 'a closed' : 'an open'} circle at ${neg(lo)} and ${c2 ? 'a closed' : 'an open'} circle at ${neg(hi)}. Which compound inequality does it show?`, steps: ['Shaded between two numbers: x is between them, an "and" inequality.', `${c1 ? 'Closed' : 'Open'} at ${neg(lo)} gives ${s1}; ${c2 ? 'closed' : 'open'} at ${neg(hi)} gives ${s2}. So ${right}.`] });
  }
  const right = `x < ${neg(lo)} or x ≥ ${neg(hi)}`;
  return mc(r, right, [`${neg(lo)} < x ≤ ${neg(hi)}`, `x ≤ ${neg(lo)} or x > ${neg(hi)}`, `x > ${neg(lo)} or x ≤ ${neg(hi)}`], { q: `A number line has an open circle at ${neg(lo)} shaded to the left, and a closed circle at ${neg(hi)} shaded to the right. Which inequality does it show?`, steps: ['Two separate pieces: an "or" inequality.', `Open circle, shaded left: x < ${neg(lo)}. Closed circle, shaded right: x ≥ ${neg(hi)}. So ${right}.`] });
});

// ───────────── 9. Data and graphs ─────────────
skill('10-graphs', 10, 'Data and graphs', 'Read graphs and stem-and-leaf plots', ['Read the scale carefully before you read a bar.', 'In a stem-and-leaf plot, the stem is the tens digit and each leaf is a ones digit: 4 | 2 7 means 42 and 47.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const labels = r.pick([['Hockey', 'Soccer', 'Basketball', 'Swimming'], ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], ['Red', 'Blue', 'Green', 'Yellow']]);
    const step = r.pick([1, 2, 5]), values = labels.map(() => r.int(1, 12) * step);
    let i = r.int(0, labels.length - 1), j = r.int(0, labels.length - 1); if (i === j) j = (i + 1) % labels.length;
    if (r.bool()) { const d = Math.abs(values[i] - values[j]); const [hi, lo] = values[i] >= values[j] ? [i, j] : [j, i]; return num(d, [`${labels[hi]}: ${values[hi]}. ${labels[lo]}: ${values[lo]}.`, `${values[hi]} − ${values[lo]} = ${d}.`, `So the difference is ${d}.`], { q: `The bar graph shows the results of a survey. How many more for ${labels[hi]} than for ${labels[lo]}?`, visual: { type: 'bars', labels, values }, expr: `${values[hi]}-${values[lo]}` }); }
    const tot = values.reduce((a, b) => a + b, 0);
    return num(tot, [`Read each bar: ${values.join(', ')}.`, `Add them: ${values.join(' + ')} = ${tot}.`, `So the total is ${tot}.`], { q: 'The bar graph shows the results of a survey. How many responses were there in total?', visual: { type: 'bars', labels, values }, expr: values.join('+') });
  }
  if (v === 1) {
    const n = r.int(8, 12), data = Array.from({ length: n }, () => r.int(12, 59)).sort((a, b) => a - b);
    const rows = []; for (let s = Math.floor(data[0] / 10); s <= Math.floor(data.at(-1) / 10); s++) rows.push([String(s), data.filter((x) => Math.floor(x / 10) === s).map((x) => x % 10).join(' ')]);
    const visual = { type: 'table', head: ['Stem', 'Leaf'], rows };
    const w = r.int(0, 2);
    if (w === 0) return num(data.at(-1) - data[0], [`The smallest value is ${data[0]} and the largest is ${data.at(-1)}.`, `Range = ${data.at(-1)} − ${data[0]} = ${data.at(-1) - data[0]}.`, `So the range is ${data.at(-1) - data[0]}.`], { q: 'The stem-and-leaf plot shows test scores. What is the range?', visual, expr: `${data.at(-1)}-${data[0]}` });
    if (w === 1) { const med = n % 2 ? data[(n - 1) / 2] : (data[n / 2 - 1] + data[n / 2]) / 2; return num(dec(med), [`There are ${n} values, already in order.`, n % 2 ? `The middle one is value number ${(n + 1) / 2}: ${med}.` : `The middle two are ${data[n / 2 - 1]} and ${data[n / 2]}; their average is ${dec(med)}.`, `So the median is ${dec(med)}.`], { q: 'The stem-and-leaf plot shows test scores. What is the median?', visual }); }
    const t = r.pick([20, 30, 40, 50]), c = data.filter((x) => x >= t).length;
    return num(c, [`Scores of ${t} or more have stems ${t / 10} and above.`, `Count those leaves: ${c}.`, `So ${c} scores are ${t} or more.`], { q: `The stem-and-leaf plot shows test scores. How many scores are ${t} or more?`, visual });
  }
  if (v === 2) {
    const cats = r.pick([['Walk', 'Bus', 'Car', 'Bike'], ['Pizza', 'Pasta', 'Tacos', 'Curry']]);
    const p1 = r.int(2, 8) * 5, p2 = r.int(2, 6) * 5, p3 = r.int(1, 4) * 5, p4 = 100 - p1 - p2 - p3, pcts = [p1, p2, p3, p4];
    const N = r.int(2, 15) * 20, i = r.int(0, 3), ans = (pcts[i] * N) / 100;
    return num(ans, [`The circle graph says ${cats[i]} is ${pcts[i]}% of ${N}.`, `${pcts[i]}% of ${N} = ${pcts[i] / 100} × ${N} = ${ans}.`, `So ${ans} students chose ${cats[i]}.`], { q: `A circle graph shows how ${N} students answered a survey. How many chose ${cats[i]}?`, visual: { type: 'table', head: ['Answer', 'Percent'], rows: cats.map((c, k) => [c, `${pcts[k]}%`]) }, expr: `${pcts[i]}*${N}/100` });
  }
  const labels = ['0–9', '10–19', '20–29', '30–39', '40–49'], values = labels.map(() => r.int(1, 12)), from = r.int(1, 3), c = values.slice(from).reduce((a, b) => a + b, 0);
  return num(c, [`${from * 10} or more means the bars from ${labels[from]} up.`, `Add them: ${values.slice(from).join(' + ')} = ${c}.`, `So ${c} people.`], { q: `The histogram shows how many minutes people spent reading. How many read for ${from * 10} minutes or more?`, visual: { type: 'bars', labels, values }, expr: values.slice(from).join('+') });
});
skill('10-boxscatter', 10, 'Data and graphs', 'Box plots and scatter plots', ['A box plot shows the minimum, Q1, median, Q3 and maximum. The box holds the middle half of the data.', 'A scatter plot shows a trend: points rising to the right show positive correlation.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const mn = r.int(5, 20), q1 = mn + r.int(3, 10), md = q1 + r.int(2, 8), q3 = md + r.int(2, 8), mx = q3 + r.int(3, 12);
    const visual = { type: 'table', head: ['Min', 'Q1', 'Median', 'Q3', 'Max'], rows: [[mn, q1, md, q3, mx].map(String)] };
    const w = r.int(0, 2);
    if (w === 0) return num(q3 - q1, ['The interquartile range is Q3 − Q1.', `${q3} − ${q1} = ${q3 - q1}.`, `So the IQR is ${q3 - q1}.`], { q: 'A box plot has the five-number summary shown. What is the interquartile range?', visual, expr: `${q3}-${q1}` });
    if (w === 1) return num(mx - mn, ['The range is the maximum minus the minimum.', `${mx} − ${mn} = ${mx - mn}.`, `So the range is ${mx - mn}.`], { q: 'A box plot has the five-number summary shown. What is the range?', visual, expr: `${mx}-${mn}` });
    const which = r.int(0, 2), cut = [q1, md, q3][which], pct = [75, 50, 25][which];
    return num(pct, ['Each of the four parts of a box plot holds about 25% of the data.', `Above ${cut} there are ${4 - which - 1} parts: ${pct}%.`, `So about ${pct}% of the data are greater than ${cut}.`], { q: `A box plot has the five-number summary shown. About what percent of the data are greater than ${cut}?`, visual, unit: '%' });
  }
  if (v === 1) {
    const t = r.int(0, 2), pts = [];
    for (let x = -5; x <= 5; x += r.int(1, 2)) { const y = t === 2 ? r.int(-5, 5) : Math.max(-6, Math.min(6, Math.round((t === 0 ? 1 : -1) * 0.9 * x + r.int(-1, 1)))); pts.push([x, y]); }
    const names = ['Positive correlation', 'Negative correlation', 'No correlation'];
    return mc(r, names[t], names.filter((_, i) => i !== t), { q: 'What kind of correlation does the scatter plot show?', visual: { type: 'plane', points: pts, range: 6 }, steps: [t === 0 ? 'As x increases, y tends to increase.' : t === 1 ? 'As x increases, y tends to decrease.' : 'The points are scattered with no clear up or down trend.', `So it shows ${names[t].toLowerCase()}.`] });
  }
  const m = r.pick([4, 5, 6, 7, 8]), b = r.int(40, 60), x = r.int(2, 6), y = m * x + b;
  return num(y, [`Put x = ${x} into the line: y = ${m} × ${x} + ${b}.`, `${m * x} + ${b} = ${y}.`, `So the predicted score is ${y}.`], { q: `The line of best fit for hours of study (x) and test score (y) is y = ${m}x + ${b}. Predict the score for ${x} hours of study.`, expr: `${m}*${x}+${b}` });
});

// ───────────── 10. Relations and functions ─────────────
skill('10-funcid', 10, 'Relations and functions', 'Functions, domain and range', ['A function gives exactly one output for each input: no x-value repeats with a different y.', 'The domain is the set of inputs (x-values); the range is the set of outputs (y-values).'], (r) => {
  const v = r.int(0, 3);
  const xs = r.shuffle([-3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 4), ys = xs.map(() => r.int(-5, 9));
  if (v === 0) {
    const isF = r.bool(); if (!isF) { xs[3] = xs[1]; ys[3] = ys[1] + r.nonzero(-3, 3); }
    const set = `{${xs.map((x, i) => P(x, ys[i])).join(', ')}}`;
    const tab = r.bool();
    return mc(r, isF ? 'Yes' : 'No', [isF ? 'No' : 'Yes'], { q: tab ? 'Does this table show a function?' : `Is this relation a function? ${set}`, ...(tab ? { visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [neg(x), neg(ys[i])]) } } : {}), steps: [isF ? 'Every x-value appears only once.' : `x = ${neg(xs[1])} goes to two different y-values: ${neg(ys[1])} and ${neg(ys[3])}.`, isF ? 'So each input has one output: it is a function.' : 'So it is not a function.'] });
  }
  if (v === 1) {
    const dom = r.bool(), vals = [...new Set(dom ? xs : ys)].sort((a, b) => a - b);
    const set = `{${xs.map((x, i) => P(x, ys[i])).join(', ')}}`;
    return txt(vals.map(neg).join(', '), [`The ${dom ? 'domain is every x-value (first number)' : 'range is every y-value (second number)'}.`, `List each once, from least to greatest: ${vals.map(neg).join(', ')}.`], { q: `What is the ${dom ? 'domain' : 'range'} of ${set}? List the numbers, separated by commas.`, numbers: vals });
  }
  if (v === 2) {
    const C = [['the number of hours worked', 'the pay earned'], ['the distance driven', 'the fuel used'], ['the number of tickets sold', 'the money raised'], ['the outdoor temperature', 'the number of hot drinks sold'], ['the length of a side of a square', 'the area of the square'], ['the number of people at a party', 'the amount of pizza needed']];
    const [ind, dep] = r.pick(C), askInd = r.bool(), cap = (s) => s[0].toUpperCase() + s.slice(1);
    return mc(r, cap(askInd ? ind : dep), [cap(askInd ? dep : ind)], { q: `${cap(dep)} depends on ${ind}. Which is the ${askInd ? 'independent' : 'dependent'} variable?`, steps: ['The independent variable is the input; the dependent variable depends on it.', `${cap(dep)} depends on ${ind}, so the ${askInd ? 'independent' : 'dependent'} variable is ${askInd ? ind : dep}.`] });
  }
  const notF = ['the circle x² + y² = 9', 'the vertical line x = 3', 'the sideways parabola x = y²'], isF = ['the line y = 2x + 1', 'the parabola y = x²', 'the horizontal line y = 4', 'the line y = −x'];
  const right = r.pick(notF);
  return mc(r, right, r.shuffle(isF).slice(0, 3), { q: 'Which graph fails the vertical line test (is not a function)?', steps: ['A graph is a function if no vertical line crosses it more than once.', `A vertical line can cross ${right} more than once, so it is not a function.`] });
});
skill('10-funcval', 10, 'Relations and functions', 'Evaluate and read functions', ['f(4) means put 4 in place of x and work it out.', 'On a graph, f(4) is the y-value of the point where x = 4.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const a = r.nonzero(-5, 5), b = r.int(-9, 9), k = r.int(-6, 6), quad = r.bool(), val = quad ? a * k * k + b : a * k + b;
    const f = quad ? px([a, 0, b]) : px([a, b]);
    return num(val, [`Put ${neg(k)} in place of x: ${quad ? `${neg(a)} × ${par(k)}² ${sgn(b)}` : `${neg(a)} × ${par(k)} ${sgn(b)}`}.`, quad ? `${par(k)}² = ${k * k}, so ${neg(a * k * k)} ${sgn(b)} = ${neg(val)}.` : `${neg(a * k)} ${sgn(b)} = ${neg(val)}.`, `So f(${neg(k)}) = ${neg(val)}.`], { q: `f(x) = ${f}. Find f(${neg(k)}).`, expr: quad ? `${a}*(${k})**2+(${b})` : `${a}*(${k})+(${b})` });
  }
  if (v === 1) {
    const a = r.int(2, 6) * r.pick([1, -1]), b = r.int(-9, 9), c = r.nonzero(-5, 5);
    const right = px([a, a * c + b], 't');
    return mc(r, right, [px([a, c + b], 't'), px([a, a * c], 't'), px([1, a * c + b], 't')].filter((x) => x !== right), { q: `f(x) = ${px([a, b])}. Which expression is f(${px([1, c], 't')})?`, steps: [`Replace x with (${px([1, c], 't')}): ${neg(a)}(${px([1, c], 't')}) ${sgn(b)}.`, `Expand: ${px([a, a * c], 't')} ${sgn(b)}.`, `Combine: ${right}.`] });
  }
  if (v === 2) {
    const m = r.nonzero(-2, 2), b = r.int(-3, 3); let k; do { k = r.int(-4, 4); } while (Math.abs(m * k + b) > 6);
    return num(m * k + b, [`Find x = ${neg(k)} on the x-axis and go up or down to the line.`, `The line is at y = ${neg(m * k + b)} there.`, `So f(${neg(k)}) = ${neg(m * k + b)}.`], { q: `The graph shows the line y = f(x). What is f(${neg(k)})?`, visual: { type: 'plane', lines: [[m, b]], range: 6 }, expr: `${m}*(${k})+(${b})` });
  }
  if (v === 3) {
    const a = r.int(2, 5), b = r.int(-5, 5), xs = [0, 1, 2, 3], miss = r.int(0, 3);
    return num(a * xs[miss] + b, [`Use the rule y = ${px([a, b])} with x = ${xs[miss]}.`, `${a} × ${xs[miss]} ${sgn(b)} = ${neg(a * xs[miss] + b)}.`, `So the missing value is ${neg(a * xs[miss] + b)}.`], { q: `Complete the table for y = ${px([a, b])}. What is the missing y-value?`, visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [String(x), i === miss ? '?' : neg(a * x + b)]) }, expr: `${a}*${xs[miss]}+(${b})` });
  }
  const base = r.pick([5, 8, 10, 12, 15]), per = r.pick([2, 3, 4, 5]), n = r.int(3, 12), cost = base + per * n;
  if (r.bool()) return num(cost, [`C(${n}) = ${base} + ${per} × ${n}.`, `${base} + ${per * n} = ${cost}.`, `So C(${n}) = ${cost}: it costs $${cost}.`], { q: `At a fair, C(n) = ${base} + ${per}n gives the cost in dollars of entry plus n rides. Find C(${n}).`, expr: `${base}+${per}*${n}` });
  return num(n, [`Set C(n) = ${cost}: ${base} + ${per}n = ${cost}.`, `${per}n = ${cost - base}, so n = ${n}.`, `So n = ${n} rides.`], { q: `At a fair, C(n) = ${base} + ${per}n gives the cost in dollars of entry plus n rides. For what n is C(n) = ${cost}?`, unit: 'n =', expr: `(${cost}-${base})/${per}` });
});

// ───────────── 11. Direct and inverse variation ─────────────
skill('10-direct', 10, 'Direct and inverse variation', 'Direct variation', ['y varies directly with x when y = kx: y ÷ x is always the same number k.', 'The graph is a straight line through the origin.'], (r) => {
  const v = r.int(0, 3), k = r.pick([2, 3, 4, 5, 6, 1.5, 2.5, 0.5]), x1 = r.int(2, 10) * (k % 1 ? 2 : 1), y1 = k * x1;
  if (v === 0) {
    const x2 = r.int(2, 12) * (k % 1 ? 2 : 1); return num(dec(k * x2), [`k = y ÷ x = ${dec(y1)} ÷ ${x1} = ${dec(k)}.`, `y = ${dec(k)} × ${x2} = ${dec(k * x2)}.`, `So y = ${dec(k * x2)}.`], { q: `y varies directly with x, and y = ${dec(y1)} when x = ${x1}. Find y when x = ${x2}.`, unit: 'y =', expr: `${y1}/${x1}*${x2}` });
  }
  if (v === 1) {
    const xs = r.shuffle([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 4).sort((a, b) => a - b);
    return num(dec(k), [`Divide y by x for any row: ${dec(k * xs[0])} ÷ ${xs[0]} = ${dec(k)}.`, `Every row gives ${dec(k)}.`, `So the constant of variation is k = ${dec(k)}.`], { q: 'y varies directly with x. What is the constant of variation k?', unit: 'k =', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [String(x), dec(k * x)]) }, expr: `${k * xs[0]}/${xs[0]}` });
  }
  if (v === 2) {
    const xs = r.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 4).sort((a, b) => a - b), add = r.bool() ? 0 : r.int(1, 5);
    return mc(r, add ? 'No' : 'Yes', [add ? 'Yes' : 'No'], { q: 'Is the relationship in the table proportional (a direct variation)?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [String(x), dec(k * x + add)]) }, steps: [`Find y ÷ x for each row: ${xs.map((x) => dec((k * x + add) / x, 2)).join(', ')}.`, add ? 'The ratios are not all the same, so it is not proportional.' : 'The ratio is always the same, so it is proportional.'] });
  }
  return mc(r, `y = ${dec(k)}x`, [`y = ${dec(x1 / y1, 3)}x`, `y = ${px([1, y1 - x1])}`, `y = ${dec(y1)}/x`].filter((t) => t !== `y = ${dec(k)}x`), { q: `y varies directly with x, and y = ${dec(y1)} when x = ${x1}. Which equation shows this?`, steps: [`Direct variation is y = kx.`, `k = ${dec(y1)} ÷ ${x1} = ${dec(k)}, so y = ${dec(k)}x.`] });
});
skill('10-inverse', 10, 'Direct and inverse variation', 'Inverse variation', ['y varies inversely with x when y = k/x: x × y is always the same number k.', 'When one doubles, the other halves.'], (r) => {
  const v = r.int(0, 3), k = r.pick([12, 24, 36, 48, 60, 72]), divs = [2, 3, 4, 6, 12].filter((d) => k % d === 0), x1 = r.pick(divs);
  let x2 = r.pick(divs); if (x2 === x1) x2 = x1 === 2 ? 3 : 2;
  if (v === 0) return num(k / x2, [`k = x × y = ${x1} × ${k / x1} = ${k}.`, `y = k ÷ x = ${k} ÷ ${x2} = ${k / x2}.`, `So y = ${k / x2}.`], { q: `y varies inversely with x, and y = ${k / x1} when x = ${x1}. Find y when x = ${x2}.`, unit: 'y =', expr: `${x1}*${k / x1}/${x2}` });
  if (v === 1) {
    const t = r.int(0, 2), xs = [1, 2, 3, 4, 6].filter((x) => k % x === 0).slice(0, 4), m = r.int(2, 5);
    const ys = xs.map((x) => (t === 0 ? m * x : t === 1 ? k / x : m * x + 3));
    const right = ['Direct variation', 'Inverse variation', 'Neither'][t];
    return mc(r, right, ['Direct variation', 'Inverse variation', 'Neither'].filter((x) => x !== right), { q: 'Does the table show direct variation, inverse variation or neither?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [String(x), String(ys[i])]) }, steps: [`y ÷ x: ${xs.map((x, i) => dec(ys[i] / x, 2)).join(', ')}. x × y: ${xs.map((x, i) => x * ys[i]).join(', ')}.`, t === 0 ? 'y ÷ x is constant: direct variation.' : t === 1 ? 'x × y is constant: inverse variation.' : 'Neither stays the same: neither.'] });
  }
  if (v === 2) return mc(r, `y = ${k}/x`, [`y = ${k}x`, `y = ${k / x1}/x`, `y = x/${k}`], { q: `y varies inversely with x, and y = ${k / x1} when x = ${x1}. Which equation shows this?`, steps: ['Inverse variation is y = k/x.', `k = ${x1} × ${k / x1} = ${k}, so y = ${k}/x.`] });
  const h1 = r.pick([2, 3, 4]), t1 = r.pick([6, 8, 12, 24]), kk = h1 * t1, h2 = r.pick([2, 3, 4, 6, 8].filter((h) => h !== h1 && kk % h === 0));
  return num(kk / h2, [`Hoses × hours stays the same: ${h1} × ${t1} = ${kk}.`, `${kk} ÷ ${h2} = ${kk / h2}.`, `So it takes ${kk / h2} hours.`], { q: `The time to fill a pool varies inversely with the number of hoses. With ${h1} hoses it takes ${t1} hours. How many hours with ${h2} hoses?`, expr: `${h1}*${t1}/${h2}` });
});

// ───────────── 12. Linear functions ─────────────
const slopeTerm = (n, d) => { const [a, b] = simplify(n, d); return b === 1 ? px([a, 0]) : `${a < 0 ? '−' : ''}(${Math.abs(a)}/${b})x`; };
const lineF = (n, d, b) => `y = ${slopeTerm(n, d)}${b ? ` ${sgn(b)}` : ''}`;
skill('10-slope', 10, 'Linear functions', 'Slope and intercepts', ['Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁).', 'The x-intercept is where y = 0; the y-intercept is where x = 0.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const run = r.pick([1, 2]), rise = r.nonzero(-3, 3), b = r.int(-3, 3), m = rise / run;
    let x1, y1, x2, y2, g = 0;
    do { x1 = run === 2 ? r.pick([-4, -2, 0, 2]) : r.int(-3, 3); y1 = m * x1 + b; x2 = x1 + run; y2 = m * x2 + b; } while ((Math.abs(y1) > 6 || Math.abs(y2) > 6 || !Number.isInteger(y1)) && g++ < 30);
    if (Math.abs(y1) > 6 || Math.abs(y2) > 6 || !Number.isInteger(y1)) { x1 = 0; y1 = b; x2 = run; y2 = b + rise; }
    return num(frac(rise, run), [`Use two points on the line: ${P(x1, y1)} and ${P(x2, y2)}.`, `Rise = ${neg(y2 - y1)}, run = ${x2 - x1}.`, `Slope = ${neg(y2 - y1)} ÷ ${x2 - x1} = ${F(rise, run)}.`], { q: 'What is the slope of the line?', visual: { type: 'plane', lines: [[m, b]], points: [[x1, y1], [x2, y2]], range: 6 }, expr: `(${y2}-(${y1}))/(${x2}-(${x1}))` });
  }
  if (v === 1) {
    const a = r.nonzero(-6, 6), b = r.nonzero(-6, 6), c = r.int(-12, 12);
    return num(frac(-a, b), [`Solve for y: ${px([b, 0], 'y')} = ${px([-a, c])}.`, `Divide by ${neg(b)}: the coefficient of x is ${neg(-a)}/${par(b)}.`, `So the slope is ${F(-a, b)}.`], { q: `What is the slope of the line ${lin([[a, 'x'], [b, 'y']])} = ${neg(c)}?`, expr: `-(${a})/(${b})` });
  }
  if (v === 2) {
    const m = r.nonzero(-4, 4), x1 = r.int(-5, 5), y1 = r.int(-6, 6), x2 = x1 + r.nonzero(-4, 4), y2 = y1 + m * (x2 - x1);
    return num(y2, [`Slope = (y − ${par(y1)}) ÷ (${neg(x2)} − ${par(x1)}) = ${m}.`, `So y − ${par(y1)} = ${neg(m)} × ${par(x2 - x1)} = ${neg(m * (x2 - x1))}.`, `y = ${neg(y1)} ${sgn(m * (x2 - x1))} = ${neg(y2)}.`, `So y = ${neg(y2)}.`], { q: `A line with slope ${neg(m)} passes through ${P(x1, y1)} and (${neg(x2)}, y). Find y.`, unit: 'y =', expr: `${y1}+(${m})*(${x2}-(${x1}))` });
  }
  const a = r.nonzero(-6, 6), b = r.nonzero(-6, 6), c = a * b * r.nonzero(-3, 3), askX = r.bool();
  return askX
    ? num(c / a, ['At the x-intercept, y = 0.', `${neg(a)}x = ${neg(c)}, so x = ${neg(c)} ÷ ${par(a)} = ${neg(c / a)}.`, `So the x-intercept is ${neg(c / a)}.`], { q: `Find the x-intercept of ${lin([[a, 'x'], [b, 'y']])} = ${neg(c)}.`, expr: `${c}/(${a})` })
    : num(c / b, ['At the y-intercept, x = 0.', `${neg(b)}y = ${neg(c)}, so y = ${neg(c)} ÷ ${par(b)} = ${neg(c / b)}.`, `So the y-intercept is ${neg(c / b)}.`], { q: `Find the y-intercept of ${lin([[a, 'x'], [b, 'y']])} = ${neg(c)}.`, expr: `${c}/(${b})` });
});
skill('10-lineeq', 10, 'Linear functions', 'Write equations of lines', ['Slope-intercept form is y = mx + b. Find the slope m first, then use a point to find b.', 'A horizontal line is y = a number; a vertical line is x = a number.'], (r) => {
  const v = r.int(0, 5), m = r.nonzero(-5, 5), b = r.int(-8, 8);
  const wr = [lineY(m, -b), lineY(-m, b), lineY(m, b + r.nonzero(-3, 3)), lineY(b || 2, m)];
  const pick = (extra) => mc(r, lineY(m, b), wr.filter((w) => w !== lineY(m, b)), extra);
  if (v === 0) { const x0 = r.int(-4, 4); return pick({ q: `Which line has slope ${neg(m)} and passes through ${P(x0, m * x0 + b)}?`, steps: [`Start with y = ${px([m, 0])} + b.`, `Put in the point: ${neg(m * x0 + b)} = ${neg(m)} × ${par(x0)} + b, so b = ${neg(b)}.`, `So ${lineY(m, b)}.`] }); }
  if (v === 1) { const x1 = r.int(-4, 2), x2 = x1 + r.int(1, 4); return pick({ q: `Which line passes through ${P(x1, m * x1 + b)} and ${P(x2, m * x2 + b)}?`, steps: [`Slope = (${neg(m * x2 + b)} − ${par(m * x1 + b)}) ÷ (${neg(x2)} − ${par(x1)}) = ${neg(m)}.`, `b = y − mx = ${neg(m * x1 + b)} − ${par(m * x1)} = ${neg(b)}.`, `So ${lineY(m, b)}.`] }); }
  if (v === 2) { const xs = [0, 1, 2, 3]; return pick({ q: 'Which equation fits the table?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [String(x), neg(m * x + b)]) }, steps: [`When x = 0, y = ${neg(b)}: that is b.`, `Each time x goes up 1, y changes by ${neg(m)}: that is m.`, `So ${lineY(m, b)}.`] }); }
  if (v === 3) {
    const x0 = r.nonzero(-7, 7); let y0 = r.nonzero(-7, 7); if (y0 === x0) y0 = -x0; const vert = r.bool();
    const right = vert ? `x = ${neg(x0)}` : `y = ${neg(y0)}`;
    return mc(r, right, [`x = ${neg(x0)}`, `y = ${neg(y0)}`, `x = ${neg(y0)}`, `y = ${neg(x0)}`].filter((t) => t !== right), { q: `Which is the equation of the ${vert ? 'vertical' : 'horizontal'} line through ${P(x0, y0)}?`, steps: [vert ? 'Every point on a vertical line has the same x-value.' : 'Every point on a horizontal line has the same y-value.', `So the line is ${right}.`] });
  }
  if (v === 4) {
    const s = r.pick([3.5, 4, 4.25, 5]), k = r.pick([1.5, 2, 2.25, 2.5]);
    return mc(r, `C = ${k}d + ${s}`, [`C = ${s}d + ${k}`, `C = ${dec(k + s)}d`, `C = ${k}d − ${s}`], { q: `A taxi charges $${s.toFixed(2)} to start plus $${k.toFixed(2)} per kilometre. Which equation gives the cost C, in dollars, for d km?`, steps: [`The rate per km, ${k}, is the slope: it multiplies d.`, `The starting charge, ${s}, is the y-intercept. So C = ${k}d + ${s}.`] });
  }
  const A = Math.abs(m), B = m > 0 ? -1 : 1, C = m > 0 ? -b : b;
  const right = `${lin([[A, 'x'], [B, 'y']])} = ${neg(C)}`;
  return mc(r, right, [`${lin([[A, 'x'], [-B, 'y']])} = ${neg(C)}`, `${lin([[A, 'x'], [B, 'y']])} = ${neg(-C)}`, `${lin([[A, 'x'], [-B, 'y']])} = ${neg(-C)}`, `${lin([[A, 'x'], [B, 'y']])} = ${neg(C + 1)}`].filter((x) => x !== right), { q: `Write ${lineY(m, b)} in standard form Ax + By = C, with A positive.`, steps: [`Move the x term to the left: ${lin([[-m, 'x'], [1, 'y']])} = ${neg(b)}.`, m > 0 ? `Multiply everything by −1 so A is positive: ${right}.` : `A is already positive: ${right}.`] });
});
skill('10-parperp', 10, 'Linear functions', 'Parallel and perpendicular lines', ['Parallel lines have the same slope.', 'Perpendicular slopes are negative reciprocals: 2/3 and −3/2 multiply to −1.'], (r) => {
  const v = r.int(0, 5);
  const sl = () => { const d = r.pick([1, 1, 2, 3, 4]); let n; do { n = r.nonzero(-5, 5); } while (gcd(n, d) !== 1); return [n, d]; };
  if (v === 0) {
    const [n, d] = sl(), b = r.int(-6, 6), par2 = r.bool();
    return par2 ? num(frac(n, d), ['Parallel lines have the same slope.', `The slope of ${lineF(n, d, b)} is ${F(n, d)}.`, `So the parallel slope is ${F(n, d)}.`], { q: `What is the slope of a line parallel to ${lineF(n, d, b)}?`, expr: `${n}/${d}` })
      : num(frac(-d, n), [`The slope of the line is ${F(n, d)}.`, 'Flip it and change the sign to get the negative reciprocal.', `So the perpendicular slope is ${F(-d, n)}.`], { q: `What is the slope of a line perpendicular to ${lineF(n, d, b)}?`, expr: `-1/(${n}/${d})` });
  }
  if (v === 1) {
    const [n, d] = sl(), t = r.int(0, 2), b1 = r.int(-6, 6); let b2 = r.int(-6, 6); if (b2 === b1) b2 = b1 + 2;
    const [n2, d2] = t === 0 ? [n, d] : t === 1 ? [-d, n] : [n + (n > 0 ? 1 : -1), d];
    const right = ['Parallel', 'Perpendicular', 'Neither'][t];
    return mc(r, right, ['Parallel', 'Perpendicular', 'Neither'].filter((x) => x !== right), { q: `Are the lines ${lineF(n, d, b1)} and ${lineF(n2, d2, b2)} parallel, perpendicular or neither?`, steps: [`The slopes are ${F(n, d)} and ${F(n2, d2)}.`, t === 0 ? 'They are equal (and the intercepts differ): parallel.' : t === 1 ? 'They multiply to −1: perpendicular.' : 'They are not equal and do not multiply to −1: neither.'] });
  }
  if (v === 2) {
    const m = r.nonzero(-4, 4), x0 = r.int(-4, 4), y0 = r.int(-6, 6), b = y0 - m * x0; let b0 = r.int(-5, 5); if (b0 === b) b0 = b + 3;
    return mc(r, lineY(m, b), [lineY(m, b0), lineY(-m, y0 + m * x0), lineY(m, y0 + m * x0)].filter((x) => x !== lineY(m, b)), { q: `Which line passes through ${P(x0, y0)} and is parallel to ${lineY(m, b0)}?`, steps: [`A parallel line has the same slope: ${neg(m)}.`, `b = y − mx = ${neg(y0)} − ${par(m)} × ${par(x0)} = ${neg(b)}.`, `So ${lineY(m, b)}.`] });
  }
  if (v === 3) {
    const m = r.pick([1, -1, 2, -2, 3, -3]), t = r.int(-2, 2), x0 = m * t, y0 = r.int(-5, 5), b = y0 + t, b0 = r.int(-5, 5);
    const right = lineF(-1, m, b);
    return mc(r, right, [lineF(m, 1, b), lineF(1, m, b), lineF(-1, m, b + (t === 0 ? 2 : -t))].filter((x) => x !== right), { q: `Which line passes through ${P(x0, y0)} and is perpendicular to ${lineY(m, b0)}?`, steps: [`The perpendicular slope is the negative reciprocal of ${neg(m)}: ${F(-1, m)}.`, `b = y − mx = ${neg(y0)} − (${F(-1, m)}) × ${par(x0)} = ${neg(b)}.`, `So ${right}.`] });
  }
  if (v === 4) {
    const [a, b, h] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10]]), x0 = r.int(-4, 4), y0 = r.int(-4, 4), d = r.int(1, 6), s = r.pick([1, -1]);
    const c = s * d * h - a * x0 - b * y0;
    return num(d, [`Distance = |${a}x + ${b}y ${sgn(c)}| ÷ √(${a}² + ${b}²), using the point.`, `Top: |${a} × ${par(x0)} + ${b} × ${par(y0)} ${sgn(c)}| = ${d * h}. Bottom: √${a * a + b * b} = ${h}.`, `${d * h} ÷ ${h} = ${d}.`, `So the distance is ${d}.`], { q: `Find the distance from the point ${P(x0, y0)} to the line ${a}x + ${b}y ${sgn(c)} = 0.`, expr: `Math.abs(${a}*(${x0})+${b}*(${y0})+(${c}))/Math.hypot(${a},${b})` });
  }
  const m = r.nonzero(-3, 3), b = r.int(-4, 4), k = r.nonzero(-6, 6);
  const U = Math.abs(k) === 1 ? "unit" : "units", right = `Shifted ${Math.abs(k)} ${U} ${k > 0 ? "up" : "down"}`;
  return mc(r, right, [`Shifted ${Math.abs(k)} ${U} ${k > 0 ? "down" : "up"}`, `Shifted ${Math.abs(k)} ${U} ${k > 0 ? "left" : "right"}`, 'Steeper, through the same y-intercept'], { q: `How does the graph of ${lineY(m, b + k)} compare with the graph of ${lineY(m, b)}?`, steps: [`The slopes are the same (${neg(m)}), so the lines are parallel.`, `The y-intercept changes from ${neg(b)} to ${neg(b + k)}: ${right.toLowerCase()}.`] });
});

// ───────────── 13. Systems of linear equations ─────────────
skill('10-syscheck', 10, 'Systems of linear equations', 'Solutions of a system', ['A solution of a system makes both equations true.', 'Different slopes: one solution. Same slope, different intercepts: none. The same line: infinitely many.'], (r) => {
  const v = r.int(0, 2), x0 = r.int(-4, 4), y0 = r.int(-4, 4);
  if (v === 0) {
    const a = r.nonzero(-4, 4), b = r.nonzero(-4, 4), m = r.nonzero(-3, 3), c = a * x0 + b * y0, k = y0 - m * x0, yes = r.bool(), px0 = x0, py0 = yes ? y0 : y0 + r.nonzero(-2, 2);
    const ok1 = a * px0 + b * py0 === c, ok2 = py0 === m * px0 + k;
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: `Is ${P(px0, py0)} a solution of the system ${lin([[a, 'x'], [b, 'y']])} = ${neg(c)} and ${lineY(m, k)}?`, steps: [`First: ${neg(a)} × ${par(px0)} + ${neg(b)} × ${par(py0)} = ${neg(a * px0 + b * py0)}${ok1 ? ', true' : `, not ${neg(c)}`}.`, `Second: ${neg(m)} × ${par(px0)} ${sgn(k)} = ${neg(m * px0 + k)}${ok2 ? ', true' : `, not ${neg(py0)}`}.`, yes ? 'Both are true, so yes.' : 'Not both are true, so no.'] });
  }
  if (v === 1) {
    const a = r.nonzero(-5, 5), b = r.nonzero(-5, 5), c = r.int(-10, 10), t = r.int(0, 2), k = r.pick([2, 3, -2]);
    let [a2, b2, c2] = t === 0 ? [a + r.pick([1, 2]), b, c + 1] : t === 1 ? [k * a, k * b, k * c + r.nonzero(-3, 3)] : [k * a, k * b, k * c];
    if (t === 0 && a2 === 0) a2 = 3;
    const right = ['Exactly one solution', 'No solution', 'Infinitely many solutions'][t];
    return mc(r, right, ['Exactly one solution', 'No solution', 'Infinitely many solutions'].filter((x) => x !== right), { q: `How many solutions does this system have? ${lin([[a, 'x'], [b, 'y']])} = ${neg(c)} and ${lin([[a2, 'x'], [b2, 'y']])} = ${neg(c2)}`, steps: [t === 0 ? 'The x and y numbers are not in the same ratio, so the slopes differ.' : `The second equation's x and y numbers are ${neg(k)} times the first's, so the slopes are the same.`, t === 0 ? 'Different slopes: the lines cross once.' : t === 1 ? `But ${neg(k)} × ${par(c)} = ${neg(k * c)}, not ${neg(c2)}: parallel lines, no solution.` : `And ${neg(k)} × ${par(c)} = ${neg(c2)} too: the same line, infinitely many solutions.`] });
  }
  let m1, m2; do { m1 = r.nonzero(-3, 3); m2 = r.int(-3, 3); } while (m1 === m2);
  const b1 = y0 - m1 * x0, b2 = y0 - m2 * x0;
  return ptItem(x0, y0, ['The solution is where the two lines cross.', `They meet at ${P(x0, y0)}.`, `Check in both: ${neg(m1)} × ${par(x0)} ${sgn(b1)} = ${neg(y0)} and ${neg(m2)} × ${par(x0)} ${sgn(b2)} = ${neg(y0)}. So the solution is ${P(x0, y0)}.`], { q: `The graph shows ${lineY(m1, b1)} and ${lineY(m2, b2)}. What is the solution of the system? Write it as (x, y).`, visual: { type: 'plane', lines: [[m1, b1], [m2, b2]], range: 6 } });
});
skill('10-syssolve', 10, 'Systems of linear equations', 'Solve systems of equations', ['Substitution: put one equation into the other. Elimination: add or subtract the equations to remove a variable.', 'Then put the value back in to find the other variable.'], (r) => {
  const v = r.int(0, 3), x = r.int(-6, 8), y = r.int(-6, 8);
  if (v === 0) {
    const m = r.nonzero(-3, 3), k = y - m * x, a = r.nonzero(-4, 4); let b = r.nonzero(-4, 4); if (a + b * m === 0) b = b === 4 ? 3 : b + 1 || 2;
    const c = a * x + b * y, askX = r.bool();
    return num(askX ? x : y, [`Substitute y = ${px([m, k])} into the other equation: ${neg(a)}x + ${neg(b)}(${px([m, k])}) = ${neg(c)}.`, `${px([a + b * m, b * k])} = ${neg(c)}, so x = ${neg(x)}.`, `Then y = ${neg(m)} × ${par(x)} ${sgn(k)} = ${neg(y)}.`, `So x = ${neg(x)} and y = ${neg(y)}. ${askX ? 'x' : 'y'} = ${neg(askX ? x : y)}.`], { q: `Solve the system: ${lineY(m, k)} and ${lin([[a, 'x'], [b, 'y']])} = ${neg(c)}. What is ${askX ? 'x' : 'y'}?`, unit: `${askX ? 'x' : 'y'} =` });
  }
  if (v === 1) {
    let a1, b1, a2, b2; do { a1 = r.nonzero(-5, 5); b1 = r.nonzero(-5, 5); a2 = r.nonzero(-5, 5); b2 = r.nonzero(-5, 5); } while (a1 * b2 - a2 * b1 === 0);
    const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, D = a1 * b2 - a2 * b1, askX = r.bool();
    return num(askX ? x : y, [`Make the y terms match: multiply the first equation by ${neg(b2)} and the second by ${neg(b1)}.`, `Subtract: ${neg(D)}x = ${neg(c1 * b2 - c2 * b1)}, so x = ${neg(x)}.`, `Put x = ${neg(x)} into the first equation: ${neg(b1)}y = ${neg(c1 - a1 * x)}, so y = ${neg(y)}.`, `So ${askX ? 'x' : 'y'} = ${neg(askX ? x : y)}.`], { q: `Solve the system: ${lin([[a1, 'x'], [b1, 'y']])} = ${neg(c1)} and ${lin([[a2, 'x'], [b2, 'y']])} = ${neg(c2)}. What is ${askX ? 'x' : 'y'}?`, unit: `${askX ? 'x' : 'y'} =` });
  }
  if (v === 2) {
    const A = r.pick([12, 15, 18, 20]), C = r.pick([6, 8, 10]), ad = r.int(10, 60), ch = r.int(10, 60), T = ad + ch, M = A * ad + C * ch;
    return num(ad, [`Let a = adult tickets and c = child tickets: a + c = ${T} and ${A}a + ${C}c = ${M}.`, `Substitute c = ${T} − a: ${A}a + ${C}(${T} − a) = ${M}, so ${A - C}a = ${M - C * T}.`, `a = ${M - C * T} ÷ ${A - C} = ${ad}.`, `So ${ad} adult tickets were sold.`], { q: `A school play sold ${T} tickets for $${comma(M)}. Adult tickets cost $${A} and child tickets cost $${C}. How many adult tickets were sold?`, expr: `(${M}-${C}*${T})/(${A}-${C})` });
  }
  const big = r.int(10, 60), small = r.int(1, big - 1), S = big + small, D = big - small;
  return num(big, [`Let the numbers be x and y: x + y = ${S} and x − y = ${D}.`, `Add the equations: 2x = ${S + D}, so x = ${big}.`, `Then y = ${S} − ${big} = ${small}.`, `So the larger number is ${big}.`], { q: `Two numbers add to ${S}, and their difference is ${D}. What is the larger number?`, expr: `(${S}+${D})/2` });
});

// ───────────── 14. Monomials ─────────────
const mono = (c, ex1, ey) => lin([[c, `${pw('x', ex1)}${pw('y', ey)}`]]);
skill('10-monomial', 10, 'Monomials', 'Multiply and divide monomials', ['A monomial is a number, a variable, or a product of them with whole-number exponents, like 5x²y.', 'Multiply the numbers and add the exponents of each variable; divide the numbers and subtract.'], (r) => {
  const v = r.int(0, 3), a = r.nonzero(-6, 6), b = r.int(2, 6), p = r.int(1, 5), q = r.int(0, 4), s = r.int(1, 5), t = r.int(1, 4);
  if (v === 0) { const right = mono(a * b, p + s, q + t); return mc(r, right, [mono(a + b, p + s, q + t), mono(a * b, p * s, q * t), mono(a * b, p + s, q)].filter((x) => x !== right), { q: `Multiply: (${mono(a, p, q)})(${mono(b, s, t)})`, steps: [`Multiply the numbers: ${neg(a)} × ${b} = ${neg(a * b)}.`, `Add the exponents of each letter: x: ${p} + ${s} = ${p + s}, y: ${q} + ${t} = ${q + t}.`, `So the product is ${right}.`] }); }
  if (v === 1) { const right = mono(a, p, q); return mc(r, right, [mono(a, p + 2 * s, q + 2 * t), mono(a * b * b, p, q), mono(a, p, q + 1)].filter((x) => x !== right), { q: `Divide: ${mono(a * b, p + s, q + t)} ÷ ${mono(b, s, t)}`, steps: [`Divide the numbers: ${neg(a * b)} ÷ ${b} = ${neg(a)}.`, `Subtract the exponents of each letter: x: ${p + s} − ${s} = ${p}, y: ${q + t} − ${t} = ${q}.`, `So the quotient is ${right}.`] }); }
  if (v === 2) { const n = r.int(2, 3), c = r.pick([2, 3, -2]), right = mono(c ** n, p * n, t * n); return mc(r, right, [mono(c * n, p * n, t * n), mono(c ** n, p + n, t + n), mono(c, p * n, t * n)].filter((x) => x !== right), { q: `Simplify: (${mono(c, p, t)})^${n}`, steps: [`Raise the number to the power ${n}: ${par(c)}^${n} = ${neg(c ** n)}.`, `Multiply each exponent by ${n}: x: ${p * n}, y: ${t * n}.`, `So the answer is ${right}.`] }); }
  const yes = ['3x²y', '−8a³b', '12', '0.5m⁴', 'x/4', '7xy²z'], no = ['x + 4', '5/x', '2^x', 'x² − 1', '√x', '3x^−2'];
  const want = r.bool(), right = r.pick(want ? yes : no);
  return mc(r, right, r.shuffle(want ? no : yes).slice(0, 3), { q: want ? 'Which expression is a monomial?' : 'Which expression is NOT a monomial?', steps: ['A monomial is one term: a number times variables with whole-number exponents (no adding, no variable in a denominator, exponent or root).', `${right} ${want ? 'is' : 'is not'} a monomial.`] });
});

// ───────────── 15. Polynomials ─────────────
skill('10-polyadd', 10, 'Polynomials', 'Add and subtract polynomials', ['The degree is the highest power. A binomial has 2 terms; a trinomial has 3.', 'To add or subtract, combine like terms. When subtracting, change the sign of every term in the second bracket.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const d = r.int(2, 5), cs = Array.from({ length: d + 1 }, (_, i) => (i === 0 ? r.nonzero(-9, 9) : r.bool(0.45) ? r.nonzero(-9, 9) : 0));
    const nt = cs.filter((c) => c).length;
    if (r.bool()) return num(d, [`Look for the highest power of x: x^${d}.`, `So the degree is ${d}.`], { q: `What is the degree of ${px(cs)}?`, expr: String(d) });
    const names = ['Monomial', 'Binomial', 'Trinomial', 'Polynomial with four or more terms'], right = names[Math.min(nt, 4) - 1];
    return mc(r, right, names.filter((x) => x !== right), { q: `How would you name ${px(cs)} by its number of terms?`, steps: [`Count the terms: ${nt}.`, `So it is a ${right.toLowerCase()}.`] });
  }
  const A = [r.nonzero(-6, 9), r.int(-9, 9), r.int(-9, 9)], B = [r.nonzero(-6, 9), r.int(-9, 9), r.int(-9, 9)];
  if (v === 1) {
    const S = A.map((x, i) => x + B[i]); if (S[0] === 0) S[0] = 0;
    const right = px(S);
    return mc(r, right, [px(A.map((x, i) => x - B[i])), px([S[0], S[1], S[2] + 1]), px([S[0], A[1] - B[1], S[2]])].filter((x) => x !== right), { q: `Add: (${px(A)}) + (${px(B)})`, steps: ['Group the like terms: x² terms, x terms and numbers.', `x²: ${neg(A[0])} + ${par(B[0])} = ${neg(S[0])}; x: ${neg(A[1])} + ${par(B[1])} = ${neg(S[1])}; numbers: ${neg(A[2])} + ${par(B[2])} = ${neg(S[2])}.`, `So the sum is ${right}.`] });
  }
  if (v === 2) {
    const D = A.map((x, i) => x - B[i]), right = px(D);
    return mc(r, right, [px(A.map((x, i) => x + B[i])), px([D[0], A[1] + B[1], A[2] + B[2]]), px([D[0], D[1], A[2] + B[2]])].filter((x) => x !== right), { q: `Subtract: (${px(A)}) − (${px(B)})`, steps: [`Change the sign of every term in the second bracket: ${px(B.map((x) => -x))}.`, `Combine like terms: x²: ${neg(D[0])}, x: ${neg(D[1])}, numbers: ${neg(D[2])}.`, `So the difference is ${right}.`] });
  }
  const sides = [0, 1, 2].map(() => [r.int(1, 6), r.int(1, 9)]), S = [sides.reduce((s, x) => s + x[0], 0), sides.reduce((s, x) => s + x[1], 0)], right = px(S);
  return mc(r, right, [px([S[0], S[1] + 2]), px([S[0] + 1, S[1]]), px([sides.reduce((s, x) => s * x[0], 1), S[1]])].filter((x) => x !== right), { q: `A triangle has sides ${sides.map((s) => `(${px(s)})`).join(', ')} cm. Which expression gives its perimeter?`, steps: ['The perimeter is the sum of the three sides.', `x terms: ${sides.map((s) => s[0]).join(' + ')} = ${S[0]}; numbers: ${sides.map((s) => s[1]).join(' + ')} = ${S[1]}.`, `So the perimeter is ${right} cm.`] });
});
skill('10-polymul', 10, 'Polynomials', 'Multiply polynomials', ['Multiply every term in one bracket by every term in the other, then combine like terms.', 'Special cases: (a + b)² = a² + 2ab + b² and (a + b)(a − b) = a² − b².'], (r) => {
  const v = r.int(0, 3);
  const pick = (R, W, extra) => mc(r, px(R), W.filter((w) => !same(w, R)).map((w) => px(w)), extra);
  if (v === 0) {
    const a = r.nonzero(-5, 6), k = r.int(1, 2), T = [r.nonzero(-6, 6), r.int(-9, 9), r.nonzero(-9, 9)], M = [a, ...Array(k).fill(0)], R = mul(M, T);
    return pick(R, [mul(M, [T[0], T[1], 0]).map((x, i, arr) => (i === arr.length - 1 ? T[2] : x)), mul([a, ...Array(k + 1).fill(0)], T), mul(M, [T[0], -T[1], -T[2]])], { q: `Multiply: ${px(M)}(${px(T)})`, steps: [`Multiply ${px(M)} by each of the three terms.`, `${px(M)} × ${px([T[0], 0, 0])} = ${px([a * T[0], ...Array(k + 2).fill(0)])}, and so on.`, `So the product is ${px(R)}.`] });
  }
  if (v === 1) {
    const p = r.int(1, 4), q = r.nonzero(-9, 9), s2 = r.int(1, 3), t = r.nonzero(-9, 9), R = mul([p, q], [s2, t]);
    const ctx = r.bool();
    return pick(R, [[p * s2, 0, q * t], [p * s2, R[1], -q * t], [p * s2, p * t - q * s2, q * t], [p * s2, p * t + q * s2 + 1, q * t]], { q: ctx ? `A rectangle is ${bin(p, q)} m by ${bin(s2, t)} m. Which expression gives its area?` : `Multiply: ${bin(p, q)}${bin(s2, t)}`, steps: [`First: ${px([p, 0])} × ${px([s2, 0])} = ${px([p * s2, 0, 0])}. Outer and inner: ${px([p * t, 0])} and ${px([q * s2, 0])}. Last: ${neg(q)} × ${par(t)} = ${neg(q * t)}.`, `Combine the x terms: ${neg(p * t)} + ${par(q * s2)} = ${neg(R[1])}.`, `So the product is ${px(R)}.`] });
  }
  if (v === 2) {
    const a = r.int(1, 4), b = r.nonzero(-8, 8);
    if (r.bool()) { const R = [a * a, 2 * a * b, b * b]; return pick(R, [[a * a, 0, b * b], [a * a, a * b, b * b], [a * a, 2 * a * b, -b * b]], { q: `Expand: (${px([a, b])})²`, steps: [`(${px([a, b])})² = (${px([a, b])})(${px([a, b])}).`, `Square the first: ${px([a * a, 0, 0])}. Twice the product: 2 × ${px([a, 0])} × ${par(b)} = ${px([2 * a * b, 0])}. Square the last: ${b * b}.`, `So the answer is ${px(R)}.`] }); }
    const bb = Math.abs(b), R = [a * a, 0, -bb * bb];
    return pick(R, [[a * a, -2 * a * bb, -bb * bb], [a * a, 0, bb * bb], [a * a, 2 * a * bb, -bb * bb]], { q: `Multiply: ${bin(a, -bb)}${bin(a, bb)}`, steps: ['This is (a − b)(a + b), a difference of squares: the middle terms cancel.', `(${px([a, 0])})² − ${bb}² = ${px(R)}.`, `So the product is ${px(R)}.`] });
  }
  const a = r.nonzero(-5, 5), b = r.int(-6, 6), c = r.nonzero(-6, 6), R = mul([1, a], [1, b, c]);
  return pick(R, [[1, a + b, c, a * c], [1, a + b, a * b + c, -a * c], [1, b, a * b + c, a * c]], { q: `Multiply: ${bin(1, a)}(${px([1, b, c])})`, steps: [`x × (${px([1, b, c])}) = ${px([1, b, c, 0])}.`, `${neg(a)} × (${px([1, b, c])}) = ${px([a, a * b, a * c])}.`, `Add and combine like terms: ${px(R)}.`] });
});

// ───────────── 16. Factoring ─────────────
const mcF = (r, right, wrongs, extra) => mc(r, right.s, wrongs.filter((w) => !same(w.e, right.e) && w.s !== right.s).map((w) => w.s), extra);
const fac2 = (p, q, s, t) => ({ s: `${bin(p, q)}${bin(s, t)}`, e: mul([p, q], [s, t]) });
skill('10-factor1', 10, 'Factoring', 'Common factors and grouping', ['First take out the greatest common factor of all the terms.', 'With four terms, factor pairs of terms, then take out the common bracket.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const g = r.int(2, 8); let u, w; do { u = r.int(1, 6); w = r.int(1, 6); } while (gcd(u, w) !== 1 || u === w);
    const p = r.int(1, 5), q = r.int(0, 3), s = r.int(1, 5), t = r.int(0, 3);
    const right = mono(g, Math.min(p, s), Math.min(q, t));
    return mc(r, right, [mono(g, Math.max(p, s), Math.max(q, t)), mono(g * u * w, Math.min(p, s), Math.min(q, t)), mono(g, Math.min(p, s), Math.max(q, t)), mono(1, Math.min(p, s), Math.min(q, t))].filter((x) => x !== right), { q: `What is the greatest common factor of ${mono(g * u, p, q)} and ${mono(g * w, s, t)}?`, steps: [`The GCF of ${g * u} and ${g * w} is ${g}.`, `Take the smaller power of each letter: x^${Math.min(p, s)}${Math.min(q, t) ? ` and y^${Math.min(q, t)}` : ''} (a letter missing from one term is left out).`, `So the GCF is ${right}.`] });
  }
  if (v === 1) {
    const g = r.int(2, 6), k = r.int(1, 2); let u, vv, w; do { u = r.int(1, 5); vv = r.nonzero(-7, 7); w = r.nonzero(-9, 9); } while (gcd(gcd(u, vv), w) !== 1);
    const M = [g, ...Array(k).fill(0)], inner = [u, vv, w], E = mul(M, inner);
    const right = `${px(M)}(${px(inner)})`;
    return mc(r, right, [`${px(M)}(${px([u, vv, -w])})`, `${px([g, ...Array(k + 1).fill(0)])}(${px(inner)})`, `${px(M)}(${px([u * g, vv, w])})`], { q: `Factor completely: ${px(E)}`, steps: [`Every term has a factor of ${g} and of ${pw('x', k)}: the GCF is ${px(M)}.`, `Divide each term by ${px(M)}: ${px(inner)}.`, `So ${px(E)} = ${right}.`] });
  }
  const a = r.nonzero(-6, 6); let b = r.nonzero(-9, 9); if (b === a) b = a + 1 || 2;
  const E = mul([1, 0, b], [1, a]), right = `(${px([1, 0, b])})${bin(1, a)}`;
  return mc(r, right, [`(${px([1, 0, -b])})${bin(1, a)}`, `(${px([1, 0, b])})${bin(1, -a)}`, `${bin(1, b)}(${px([1, 0, a])})`], { q: `Factor by grouping: ${px(E)}`, steps: [`Group in pairs: (${px([1, a, 0, 0])}) + (${px([b, a * b])}).`, `Factor each pair: ${pw('x', 2)}${bin(1, a)} ${sgn(b)}${bin(1, a)}.`, `Take out the common bracket: ${right}.`] });
});
skill('10-factor2', 10, 'Factoring', 'Factor trinomials and special cases', ['For ax² + bx + c, find two numbers that multiply to a × c and add to b, or try pairs of brackets and check.', 'a² − b² = (a − b)(a + b), and a² + 2ab + b² = (a + b)².'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [p, s] = r.pick([[1, 2], [1, 3], [1, 4], [1, 5], [2, 3]]); let q, t; do { q = r.nonzero(-7, 7); t = r.nonzero(-7, 7); } while (gcd(p, q) !== 1 || gcd(s, t) !== 1 || p * t + q * s === 0);
    const R = fac2(p, q, s, t);
    return mcF(r, R, [fac2(p, -q, s, -t), fac2(p, t, s, q), fac2(p, q, s, -t), fac2(p, -q, s, t)], { q: `Factor: ${px(R.e)}`, steps: [`a × c = ${R.e[0]} × ${par(R.e[2])} = ${neg(R.e[0] * R.e[2])}. Find two numbers that multiply to this and add to ${neg(R.e[1])}: ${neg(p * t)} and ${neg(q * s)}.`, `Check by expanding ${R.s}: ${px(R.e)}.`, `So the answer is ${R.s}.`] });
  }
  if (v === 1) {
    let a, b; do { a = r.int(1, 5); b = r.int(1, 9); } while (gcd(a, b) !== 1);
    const E = [a * a, 0, -b * b], R = { s: `${bin(a, -b)}${bin(a, b)}`, e: E };
    return mcF(r, R, [{ s: `(${px([a, -b])})²`, e: mul([a, -b], [a, -b]) }, { s: `(${px([a, b])})²`, e: mul([a, b], [a, b]) }, { s: `${bin(a, -b * b)}${bin(a, b * b)}`, e: mul([a, -b * b], [a, b * b]) }], { q: `Factor: ${px(E)}`, steps: [`It is a difference of squares: (${px([a, 0])})² − ${b}².`, `So the answer is ${R.s}.`] });
  }
  if (v === 2) {
    let a, b; do { a = r.int(1, 4); b = r.nonzero(-7, 7); } while (gcd(a, Math.abs(b)) !== 1);
    const E = mul([a, b], [a, b]), R = { s: `(${px([a, b])})²`, e: E };
    return mcF(r, R, [{ s: `(${px([a, -b])})²`, e: mul([a, -b], [a, -b]) }, { s: `${bin(a, -Math.abs(b))}${bin(a, Math.abs(b))}`, e: [a * a, 0, -b * b] }, { s: `(${px([a, 2 * b])})²`, e: mul([a, 2 * b], [a, 2 * b]) }], { q: `Factor: ${px(E)}`, steps: [`The first term is (${px([a, 0])})² and the last is ${Math.abs(b)}².`, `The middle term is 2 × ${px([a, 0])} × ${par(b)} = ${px([E[1], 0])}, so it is a perfect square.`, `So the answer is ${R.s}.`] });
  }
  const k = r.int(2, 5), p = r.nonzero(-6, 6); let q = r.nonzero(-6, 6); if (p + q === 0) q = q + 1 || 2;
  const E = [k, k * (p + q), k * p * q], R = { s: `${k}${bin(1, p)}${bin(1, q)}`, e: E };
  return mcF(r, R, [{ s: `${k}${bin(1, -p)}${bin(1, -q)}`, e: mul([k], mul([1, -p], [1, -q])) }, { s: `${bin(k, p)}${bin(1, q)}`, e: mul([k, p], [1, q]) }, { s: `${k}${bin(1, p * q)}${bin(1, 1)}`, e: mul([k], mul([1, p * q], [1, 1])) }], { q: `Factor completely: ${px(E)}`, steps: [`Take out the common factor ${k}: ${k}(${px([1, p + q, p * q])}).`, `Find two numbers that multiply to ${neg(p * q)} and add to ${neg(p + q)}: ${neg(p)} and ${neg(q)}.`, `So the answer is ${R.s}.`] });
});

// ───────────── 17. Quadratic equations ─────────────
skill('10-quadsolve', 10, 'Quadratic equations', 'Solve by square roots and factoring', ['If x² = k, then x = √k or x = −√k: there are usually two answers.', 'Zero product property: if A × B = 0, then A = 0 or B = 0.'], (r) => {
  const v = r.int(0, 3), ask = ' (give every solution, separated by a comma)';
  if (v === 0) {
    const a = r.int(1, 4), k = r.int(1, 9), c = r.int(-20, 20), d = a * k * k + c;
    return solSet([-k, k], [`${c >= 0 ? 'Subtract' : 'Add'} ${Math.abs(c)}${a > 1 ? ` and divide by ${a}` : ''}: x² = ${k * k}.`, `Take the square root of both sides: x = ±${k}.`, `So x = ${k} or x = −${k}.`], { q: `Solve: ${px([a, 0, c])} = ${d}${ask}` });
  }
  if (v === 1) {
    const h = r.nonzero(-8, 8), k = r.int(1, 9);
    return solSet([h - k, h + k], [`Take the square root of both sides: x ${sgn(-h)} = ±${k}.`, `So x = ${neg(h)} + ${k} or x = ${neg(h)} − ${k}.`, `x = ${neg(h + k)} or x = ${neg(h - k)}.`], { q: `Solve: ${sqx('x', h)} = ${k * k}${ask}` });
  }
  if (v === 2) {
    const p = r.pick([1, 2, 4]), q = r.nonzero(-9, 9), s = r.int(-8, 8), x1 = -q / p;
    return solSet([x1, s], [`One of the brackets must be 0.`, `${bin(p, q)} = 0 gives x = ${fm(x1)}; ${bin(1, -s)} = 0 gives x = ${neg(s)}.`, `So x = ${fm(x1)} or x = ${neg(s)}.`], { q: `Solve: ${bin(p, q)}${s === 0 ? 'x' : bin(1, -s)} = 0${ask}` });
  }
  const a = r.pick([1, 1, 2]), p = r.int(-8, 8), q = r.int(-8, 8), E = mul([a], mul([1, -p], [1, -q]));
  return solSet([p, q], [`Factor: ${a > 1 ? a : ''}${p === 0 ? 'x' : bin(1, -p)}${q === 0 ? 'x' : bin(1, -q)} = 0.`, `Set each bracket to 0.`, `So x = ${neg(p)} or x = ${neg(q)}.`], { q: `Solve by factoring: ${px(E)} = 0${ask}` });
});
skill('10-quadformula', 10, 'Quadratic equations', 'Quadratic formula and discriminant', ['For ax² + bx + c = 0, x = (−b ± √(b² − 4ac)) ÷ 2a.', 'The discriminant b² − 4ac tells how many real solutions: positive 2, zero 1, negative none.'], (r) => {
  const v = r.int(0, 3);
  if (v <= 1) {
    const a = r.nonzero(-4, 5), b = r.int(-9, 9), c = r.int(-9, 9), D = b * b - 4 * a * c;
    if (v === 0) return num(D, [`b² − 4ac = ${par(b)}² − 4 × ${par(a)} × ${par(c)}.`, `= ${b * b} − ${par(4 * a * c)} = ${neg(D)}.`, `So the discriminant is ${neg(D)}.`], { q: `Find the discriminant of ${px([a, b, c])} = 0.`, expr: `(${b})**2-4*(${a})*(${c})` });
    const right = D > 0 ? 'Two real solutions' : D === 0 ? 'One real solution' : 'No real solutions';
    return mc(r, right, ['Two real solutions', 'One real solution', 'No real solutions'].filter((x) => x !== right), { q: `How many real solutions does ${px([a, b, c])} = 0 have?`, steps: [`b² − 4ac = ${b * b} − ${par(4 * a * c)} = ${neg(D)}.`, `${D > 0 ? 'Positive' : D === 0 ? 'Zero' : 'Negative'}, so: ${right.toLowerCase()}.`] });
  }
  if (v === 2) {
    let a, b, c, D; do { a = r.int(1, 3); b = r.int(-9, 9); c = r.int(-9, 9); D = b * b - 4 * a * c; } while (D <= 0 || Number.isInteger(Math.sqrt(D)));
    const x = (-b + Math.sqrt(D)) / (2 * a), ans = dec(r1(x));
    return num(ans, [`a = ${a}, b = ${neg(b)}, c = ${neg(c)}. The discriminant is ${b * b} − ${par(4 * a * c)} = ${D}.`, `The larger solution uses +: x = (${neg(-b)} + √${D}) ÷ ${2 * a}.`, `√${D} ≈ ${dec(Math.sqrt(D), 3)}, so x ≈ ${ans}.`, `So the larger solution is about ${ans}.`], { q: `Use the quadratic formula to solve ${px([a, b, c])} = 0. Give the larger solution, rounded to the nearest tenth.`, tol: 0.05001, expr: `(-(${b})+Math.sqrt(${D}))/(2*${a})` });
  }
  const p = r.pick([-7, -5, -3, -1, 1, 3, 5, 7]); let q = r.int(-5, 5); if (2 * q === p) q++;
  const E = mul([2, -p], [1, -q]), D = E[1] * E[1] - 8 * E[2], sd = Math.round(Math.sqrt(D));
  return solSet([p / 2, q], [`a = 2, b = ${neg(E[1])}, c = ${neg(E[2])}. The discriminant is ${E[1] * E[1]} − ${par(8 * E[2])} = ${D}, and √${D} = ${sd}.`, `x = (${neg(-E[1])} ± ${sd}) ÷ 4.`, `So x = ${fm(p / 2)} or x = ${neg(q)}.`], { q: `Use the quadratic formula to solve ${px(E)} = 0 (give every solution, separated by a comma)` });
});
skill('10-complete', 10, 'Quadratic equations', 'Complete the square', ['To make x² + bx a perfect square, add (b ÷ 2)².', 'x² + bx + c = (x + b/2)² + (c − (b/2)²).'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    if (r.bool()) { const h = r.nonzero(-7, 7); return num(h * h, [`Half of ${neg(2 * h)} is ${neg(h)}.`, `Square it: ${par(h)}² = ${h * h}.`, `So c = ${h * h}, and x² ${sgn(2 * h)}x + ${h * h} = ${sqx('x', -h)}.`], { q: `What value of c makes x² ${sgn(2 * h)}x + c a perfect square?`, unit: 'c =', expr: `(${2 * h}/2)**2` }); }
    const b = r.pick([-7, -5, -3, -1, 1, 3, 5, 7]);
    return num(frac(b * b, 4), [`Half of ${neg(b)} is ${F(b, 2)}.`, `Square it: ${b * b}/4.`, `So c = ${frac(b * b, 4)}.`], { q: `What value of c makes ${px([1, b])} + c a perfect square?`, unit: 'c =', expr: `(${b}/2)**2` });
  }
  if (v === 1) {
    const h = r.nonzero(-6, 6), c = r.int(-10, 15), k = c - h * h;
    const vf = (hh, kk) => `${sqx('x', -hh)}${kk ? ` ${sgn(kk)}` : ''}`;
    const right = vf(h, k);
    return mc(r, right, [vf(-h, k), vf(h, c + h * h), vf(h, -k === k ? k + 1 : -k)].filter((x) => x !== right), { q: `Which is ${px([1, 2 * h, c])} written as (x + p)² + q?`, steps: [`Half of ${neg(2 * h)} is ${neg(h)}: ${sqx('x', -h)} = x² ${sgn(2 * h)}x + ${h * h}.`, `We need ${neg(c)}, not ${h * h}, so adjust: ${neg(c)} − ${h * h} = ${neg(k)}.`, `So it is ${right}.`] });
  }
  let p, q; do { p = r.int(-8, 8); q = r.int(-8, 8); } while ((p + q) % 2 !== 0 || p + q === 0);
  const b = -(p + q), c = p * q, h = b / 2, rhs = h * h - c;
  if (r.bool()) return num(rhs, [`Move the number: ${px([1, b, 0])} = ${neg(-c)}.`, `Add (${neg(b)} ÷ 2)² = ${h * h} to both sides: ${sqx('x', -h)} = ${neg(-c)} + ${h * h}.`, `${neg(-c)} + ${h * h} = ${rhs}.`, `So the right side is ${rhs}.`], { q: `Completing the square turns ${px([1, b, c])} = 0 into ${sqx('x', -h)} = ?`, expr: `(${b}/2)**2-(${c})` });
  return solSet([p, q], [`Complete the square: ${sqx('x', -h)} = ${rhs}.`, `Square root: x ${sgn(h)} = ±${Math.sqrt(rhs)}.`, `So x = ${neg(p)} or x = ${neg(q)}.`], { q: `Solve by completing the square: ${px([1, b, c])} = 0 (give every solution, separated by a comma)` });
});

// ───────────── 18. Parabolas ─────────────
const vform = (a, h, k) => `y = ${a === 1 ? '' : a === -1 ? '−' : neg(a)}${h === 0 ? 'x²' : sqx('x', h)}${k ? ` ${sgn(k)}` : ''}`;
skill('10-parabola', 10, 'Parabolas', 'Vertex, axis and direction', ['In y = a(x − h)² + k the vertex is (h, k). If a > 0 the parabola opens up; if a < 0 it opens down.', 'For y = ax² + bx + c, the axis of symmetry is x = −b ÷ 2a.'], (r) => {
  const v = r.int(0, 4), a = r.nonzero(-4, 4), h = r.int(-5, 5), k = r.int(-8, 8);
  if (v === 0) {
    const b = r.int(-8, 8), c = r.int(-9, 9), right = a > 0 ? 'Upward' : 'Downward';
    return mc(r, right, [a > 0 ? 'Downward' : 'Upward'], { q: `Which way does the parabola y = ${px([a, b, c])} open?`, steps: [`Look at the x² coefficient: a = ${neg(a)}.`, `a is ${a > 0 ? 'positive' : 'negative'}, so it opens ${right.toLowerCase()}.`] });
  }
  if (v === 1) return ptItem(h, k, [`Compare with y = a(x − h)² + k.`, `h = ${neg(h)} and k = ${neg(k)}.`, `So the vertex is ${P(h, k)}.`], { q: `What is the vertex of ${vform(a, h, k)}? Write it as (x, y).` });
  const b = -2 * a * h, c = a * h * h + k;
  if (v === 2) return num(h, [`x = −b ÷ 2a = −(${neg(b)}) ÷ (2 × ${par(a)}).`, `= ${neg(-b)} ÷ ${neg(2 * a)} = ${neg(h)}.`, `So the axis of symmetry is x = ${neg(h)}.`], { q: `What is the axis of symmetry of y = ${px([a, b, c])}?`, unit: 'x =', expr: `-(${b})/(2*(${a}))` });
  if (v === 3) {
    if (r.bool()) return ptItem(h, k, [`x = −b ÷ 2a = ${neg(-b)} ÷ ${neg(2 * a)} = ${neg(h)}.`, `y = ${neg(a)} × ${par(h)}² ${sgn(b)} × ${par(h)} ${sgn(c)} = ${neg(k)}.`, `So the vertex is ${P(h, k)}.`], { q: `What is the vertex of y = ${px([a, b, c])}? Write it as (x, y).` });
    return num(k, [`The vertex is ${P(h, k)}. a = ${neg(a)} is ${a > 0 ? 'positive, so the vertex is the lowest point' : 'negative, so the vertex is the highest point'}.`, `The ${a > 0 ? 'minimum' : 'maximum'} is the y-value of the vertex: ${neg(k)}.`, `So the ${a > 0 ? 'minimum' : 'maximum'} value is ${neg(k)}.`], { q: `What is the ${a > 0 ? 'minimum' : 'maximum'} value of ${vform(a, h, k)}?`, expr: String(k) });
  }
  const d = r.nonzero(-3, 3), y1 = k + a * d * d;
  return num(a, [`Put the vertex in: y = a${h === 0 ? 'x²' : sqx('x', h)}${k ? ` ${sgn(k)}` : ''}.`, `Use ${P(h + d, y1)}: ${neg(y1)} = a × ${par(d)}² ${sgn(k)}, so ${d * d}a = ${neg(y1 - k)}.`, `a = ${neg(y1 - k)} ÷ ${d * d} = ${neg(a)}.`, `So a = ${neg(a)}.`], { q: `A parabola has vertex ${P(h, k)} and passes through ${P(h + d, y1)}. In y = a(x − h)² + k, what is a?`, unit: 'a =', expr: `(${y1}-(${k}))/${d * d}` });
});

// ───────────── 19. Linear, quadratic and exponential functions ─────────────
skill('10-lqe', 10, 'Linear, quadratic and exponential', 'Linear, quadratic or exponential?', ['Linear: y goes up or down by the same amount each step. Exponential: y is multiplied by the same number each step.', 'Quadratic: the differences change, but the differences of the differences are equal.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const t = r.int(0, 2), xs = [0, 1, 2, 3, 4], m = r.nonzero(-5, 6), b = r.int(-5, 9), a = r.nonzero(-3, 3), c = r.int(-5, 5), A = r.int(1, 5), B = r.pick([2, 3]);
    const ys = xs.map((x) => (t === 0 ? m * x + b : t === 1 ? a * x * x + c : A * B ** x));
    const names = ['Linear', 'Quadratic', 'Exponential'], d1 = ys.slice(1).map((y, i) => y - ys[i]);
    return mc(r, names[t], names.filter((_, i) => i !== t), { q: 'Which kind of function does the table show?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [String(x), neg(ys[i])]) }, steps: [`The differences are ${d1.map(neg).join(', ')}.`, t === 0 ? 'They are all the same: linear.' : t === 1 ? `They change by ${neg(d1[1] - d1[0])} each time (equal second differences): quadratic.` : `Each y is ${B} times the one before: exponential.`] });
  }
  if (v === 1) {
    const a = r.int(2, 9) * 50, b = r.pick([1.05, 1.2, 2, 1.5, 0.8, 0.5, 0.95, 0.75]), grow = b > 1;
    return mc(r, grow ? 'Exponential growth' : 'Exponential decay', [grow ? 'Exponential decay' : 'Exponential growth', 'Linear growth', 'Linear decay'], { q: `Does y = ${a}(${b})^x show exponential growth or decay?`, steps: [`The base is ${b}.`, grow ? `${b} is greater than 1, so y grows: exponential growth.` : `${b} is between 0 and 1, so y shrinks: exponential decay.`] });
  }
  if (v === 2) {
    const V = r.pick([12000, 18000, 20000, 25000]), p = r.pick([10, 12, 15, 20]), down = r.bool();
    const f = down ? dec(1 - p / 100) : dec(1 + p / 100), g = down ? dec(1 + p / 100) : dec(1 - p / 100);
    const right = `V = ${comma(V)}(${f})^t`;
    return mc(r, right, [`V = ${comma(V)}(${g})^t`, `V = ${comma(V)}(${dec(p / 100)})^t`, `V = ${comma(V)} ${down ? '−' : '+'} ${dec(p / 100)}t`], { q: `A ${down ? 'car worth' : 'savings account with'} $${comma(V)} ${down ? 'loses' : 'gains'} ${p}% of its value each year. Which function gives its value V after t years?`, steps: [`Each year it keeps ${down ? `100% − ${p}%` : `100% + ${p}%`} = ${down ? 100 - p : 100 + p}% of its value: multiply by ${f}.`, `So ${right}.`] });
  }
  const start = r.int(2, 9), n = r.int(3, 6);
  if (r.bool()) { const B = r.pick([2, 3]), val = start * B ** n; return num(val, [`Each unit step multiplies by ${B}, so after ${n} steps multiply by ${B}^${n} = ${B ** n}.`, `${start} × ${B ** n} = ${val}.`, `So f(${n}) = ${val}.`], { q: `f(0) = ${start}, and f is multiplied by ${B} over every interval of length 1. What is f(${n})?`, expr: `${start}*${B}**${n}` }); }
  const d = r.nonzero(-6, 8), val = start + d * n;
  return num(val, [`Each unit step adds ${neg(d)}, so after ${n} steps add ${n} × ${par(d)} = ${neg(n * d)}.`, `${start} ${sgn(n * d)} = ${neg(val)}.`, `So f(${n}) = ${neg(val)}.`], { q: `f(0) = ${start}, and f changes by ${neg(d)} over every interval of length 1. What is f(${n})?`, expr: `${start}+(${d})*${n}` });
});

// ───────────── 20. Rational functions and expressions ─────────────
skill('10-rational', 10, 'Rational functions and expressions', 'Rational expressions and equations', ['A rational expression is a fraction with polynomials. The denominator can never be 0, so those x-values are excluded.', 'Factor first, then cancel common brackets. To solve an equation, multiply both sides by the denominators.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    if (r.bool()) { const p = r.int(-8, 8); let q = r.int(-8, 8); if (q === p) q++; const a = r.nonzero(-9, 9); return solSet([p, q], ['The denominator cannot be 0.', `${p === 0 ? 'x' : bin(1, -p)}${q === 0 ? 'x' : bin(1, -q)} = 0 when x = ${neg(p)} or x = ${neg(q)}.`, `So exclude x = ${neg(p)} and x = ${neg(q)}.`], { q: `Which values of x must be excluded from the domain of (${px([1, a])}) ÷ (${px([1, -(p + q), p * q])})? (separate them with a comma)` }); }
    const p = r.int(-6, 6), q = r.int(-6, 6), k = r.nonzero(-5, 5), vert = r.bool();
    const f = `f(x) = ${neg(k)}/${p === 0 ? 'x' : bin(1, -p)}${q ? ` ${sgn(q)}` : ''}`;
    return vert ? num(p, [`A vertical asymptote is where the denominator is 0.`, `${p === 0 ? 'x' : px([1, -p])} = 0 when x = ${neg(p)}.`, `So the vertical asymptote is x = ${neg(p)}.`], { q: `${f}. What is the vertical asymptote?`, unit: 'x =', expr: String(p) })
      : num(q, [`As x gets very large, ${k}/${p === 0 ? 'x' : bin(1, -p)} gets close to 0.`, `So f(x) gets close to ${neg(q)}.`, `So the horizontal asymptote is y = ${neg(q)}.`], { q: `${f}. What is the horizontal asymptote?`, unit: 'y =', expr: String(q) });
  }
  if (v === 1) {
    const p = r.nonzero(-7, 7); let s = r.nonzero(-7, 7); if (s === p) s = -s === p ? s + 1 : -s;
    const E = mul([1, p], [1, s]), right = px([1, s]);
    return mc(r, right, [px([1, -s]), px([1, p]), px([1, s + p])].filter((x) => x !== right), { q: `Simplify: (${px(E)}) ÷ ${bin(1, p)}`, steps: [`Factor the top: ${bin(1, p)}${bin(1, s)}.`, `Cancel the common bracket ${bin(1, p)}.`, `So the answer is ${right} (for x ≠ ${neg(-p)}).`] });
  }
  if (v === 2) {
    const p = r.int(1, 8), k = r.int(2, 6), m = r.int(2, 5), right = px([m, m * p]);
    return mc(r, right, [px([m, -m * p]), px([1, p]), px([m, p])].filter((x) => x !== right), { q: `Multiply and simplify: (x² − ${p * p})/${k} × ${k * m}/(x − ${p})`, steps: [`Factor: x² − ${p * p} = (x − ${p})(x + ${p}).`, `Cancel (x − ${p}) and ${k}: what is left is ${m}(x + ${p}).`, `So the answer is ${right}.`] });
  }
  if (v === 3) {
    const a = r.int(1, 6), d = r.pick([1, 2, 3, -1].filter((dd) => a + dd > 0)), t = r.nonzero(-4, 4), x = a * t, c = t * d, b = a + d;
    return num(x, [`Cross-multiply: ${a}${bin(1, c)} = ${b}x.`, `${px([a, a * c])} = ${b}x, so ${neg(a * c)} = ${px([b - a, 0])}.`, `x = ${neg(a * c)} ÷ ${par(b - a)} = ${neg(x)}.`, `So x = ${neg(x)}.`], { q: `Solve: ${a}/x = ${b}/${bin(1, c)}`, unit: 'x =', expr: `${a}*(${c})/(${b}-${a})` });
  }
  let a, b; do { a = r.int(1, 9); b = r.int(1, 9); } while (gcd(3 * a + 2 * b, 6) !== 1);
  const right = `${3 * a + 2 * b}/(6x)`;
  return mc(r, right, [`${a + b}/(5x)`, `${a + b}/(6x)`, `${3 * a + 2 * b}/(5x)`].filter((x) => x !== right), { q: `Add: ${a}/(2x) + ${b}/(3x)`, steps: ['The common denominator is 6x.', `${a}/(2x) = ${3 * a}/(6x) and ${b}/(3x) = ${2 * b}/(6x).`, `Add the tops: ${right}.`] });
});

// ───────────── 21. Circles in the coordinate plane ─────────────
const circ = (h, k, R2) => `${sqx('x', h)} + ${sqx('y', k)} = ${R2}`;
// a circle on a grid, with its centre C and (optionally) a radius drawn across to the right
const circGrid = (h, k, rr, o = {}) => GH.gridFig({ ...gw([[h - rr, k - rr], [h + rr, k + rr]], 1, 4), circles: [{ c: [h, k], r: rr, t: 'ink' }], pts: [[h, k, o.cName ?? 'C', o.hlC ? 'hl' : undefined], ...(o.pts ?? [])], segs: o.radius ? [[[h, k], [h + rr, k], o.hlR ? 'hlline' : 'aux']] : o.segs ?? [], sides: o.rLabel ? [[[h, k], [h + rr, k], o.rLabel, 'hl', [h, k + 1]]] : [] });
skill('10-circle', 10, 'Circles in the coordinate plane', 'Equations of circles', [
  KL('Every point on a circle is the same distance r from the centre (h, k). By Pythagoras, (x − h)² + (y − k)² = r².', circGrid(2, 1, 3, { radius: true, rLabel: 'r', hlC: true })),
  KL('Read the centre with the signs changed: (x − 2)² + (y − 1)² = 9 has centre (2, 1). (x + 3)² means h = −3.'),
  KL('The number on the right is r², not r: r² = 9 means r = 3.', circGrid(2, 1, 3, { radius: true, rLabel: 'r = 3', hlR: true })),
  KL('In the form x² + y² + Dx + Ey + F = 0, complete the square for x and for y to find the centre and radius.'),
], (r) => {
  const v = r.int(0, 6), h = r.nonzero(-4, 4), k = r.int(-4, 4), rr = r.int(1, 5);
  const eq = circ(h, k, rr * rr);
  if (v === 0) return ptItem(h, k, [St(`Compare with (x − h)² + (y − k)² = r². The signs inside the brackets are the opposite of the centre's coordinates.`), St(`h = ${neg(h)} and k = ${neg(k)}.`, circGrid(h, k, rr, { hlC: true })), `So the centre is ${P(h, k)}.`], { q: `What is the centre of the circle ${eq}? Write it as (x, y).` });
  if (v === 1) {
    const dia = r.bool();
    return num(dia ? 2 * rr : rr, [St(`The right side is r²: r² = ${rr * rr}, so r = √${rr * rr} = ${rr}.`, circGrid(h, k, rr, { radius: true, rLabel: `${rr}`, hlR: true })), dia ? `The diameter is 2r = ${2 * rr}.` : `The radius is ${rr}.`, `So the ${dia ? 'diameter' : 'radius'} is ${dia ? 2 * rr : rr}.`], { q: `What is the ${dia ? 'diameter' : 'radius'} of the circle ${eq}?`, expr: `${dia ? 2 : 1}*Math.sqrt(${rr * rr})` });
  }
  const wrongs = [circ(-h, -k, rr * rr), circ(h, k, rr === 1 ? 2 : rr), circ(-h, k, rr * rr), circ(h, -k, rr * rr)].filter((x) => x !== eq);
  if (v === 2) return mc(r, eq, wrongs.slice(0, 3), { q: `Which is the equation of the circle with centre ${P(h, k)} and radius ${rr}?`, steps: [St(`Put h = ${neg(h)}, k = ${neg(k)} and r = ${rr} into (x − h)² + (y − k)² = r². Subtracting a negative makes a plus.`, circGrid(h, k, rr, { radius: true, rLabel: `${rr}` })), `r² = ${rr * rr}, so the equation is ${eq}.`] });
  if (v === 3) return mc(r, eq, wrongs.slice(0, 3), { q: 'Which equation describes the circle on the grid?', visual: circGrid(h, k, rr), steps: [St(`Read the centre: C${P(h, k)}. Count from C straight across to the circle: r = ${rr}.`, circGrid(h, k, rr, { radius: true, rLabel: `${rr}`, hlC: true, hlR: true })), `So (x − h)² + (y − k)² = r² gives ${eq}.`] });
  if (v === 4) {
    const D = -2 * h, E = -2 * k, Fc = h * h + k * k - rr * rr;
    return num(rr, [`Group the x terms and the y terms, and move ${neg(Fc)} across: (x² ${sgn(D)}x) + (y²${E ? ` ${sgn(E)}y` : ''}) = ${neg(-Fc)}.`, `Complete each square by adding (half the middle number)²: ${h * h} and ${k * k}. That gives ${eq}.`, St(`r² = ${rr * rr}, so r = √${rr * rr} = ${rr}.`, circGrid(h, k, rr, { radius: true, rLabel: `${rr}`, hlR: true })), `So the radius is ${rr}.`], { q: `What is the radius of the circle ${lin([[1, 'x²'], [1, 'y²'], [D, 'x'], [E, 'y'], [Fc, '']])} = 0?`, expr: `Math.sqrt(${h * h + k * k - Fc})` });
  }
  if (v === 5) {
    let px_, py_; do { px_ = h + r.int(-rr - 2, rr + 2); py_ = k + r.int(-rr - 2, rr + 2); } while (px_ === h && py_ === k);
    const s = (px_ - h) ** 2 + (py_ - k) ** 2, R2 = rr * rr, right = s === R2 ? 'On the circle' : s < R2 ? 'Inside the circle' : 'Outside the circle';
    return mc(r, right, ['On the circle', 'Inside the circle', 'Outside the circle'].filter((x) => x !== right), { q: `Is the point Q${P(px_, py_)} on, inside or outside the circle ${eq}?`, steps: [`Put x = ${neg(px_)} and y = ${neg(py_)} into the left side: (${neg(px_)} ${sgn(-h)})² + (${neg(py_)} ${sgn(-k)})² = ${(px_ - h) ** 2} + ${(py_ - k) ** 2} = ${s}.`, St(`Compare with r² = ${R2}: ${s} ${s === R2 ? '=' : s < R2 ? '<' : '>'} ${R2}, so Q is ${right.toLowerCase()}.`, circGrid(h, k, rr, { pts: [[px_, py_, 'Q', 'hl']], segs: [[[h, k], [px_, py_], 'aux']] }))] });
  }
  const [dx, dy] = r.pick([[3, 4], [4, 3], [0, 3], [2, 2], [1, 3], [2, 1], [3, 0], [1, 1]]), sx = r.pick([1, -1]), sy = r.pick([1, -1]), qx = h + sx * dx, qy = k + sy * dy, R2 = dx * dx + dy * dy;
  const pic = (hl) => GH.gridFig({ ...gw([[h - 5, k - 5], [h + 5, k + 5]], 0, 5), circles: [{ c: [h, k], r: Math.sqrt(R2), t: 'ink' }], pts: [[h, k, 'C'], [qx, qy, 'Q']], segs: [[[h, k], [qx, qy], hl ? 'hlline' : 'aux'], ...(hl && dx && dy ? [[[h, k], [qx, k], 'aux'], [[qx, k], [qx, qy], 'aux']] : [])] });
  return num(R2, [St(`The radius is the distance CQ. Across: ${dx}. Up or down: ${dy}.`, pic(true)), `r² = ${dx}² + ${dy}² = ${R2}. (We need r², so no square root.)`, `So r² = ${R2}, and the circle is ${circ(h, k, R2)}.`], { q: `A circle has centre C${P(h, k)} and passes through Q${P(qx, qy)}. Its equation is (x − h)² + (y − k)² = r². What is r²?`, visual: pic(false), expr: `(${qx}-(${h}))**2+(${qy}-(${k}))**2` });
});

// ───────────── 22. Logic ─────────────
const CONDS = [
  ['n is divisible by 4', 'n is even', 'n is not divisible by 4', 'n is not even', true, false],
  ['∠A measures 90°', '∠A is a right angle', '∠A does not measure 90°', '∠A is not a right angle', true, true],
  ['shape S is a square', 'S has four sides', 'shape S is not a square', 'S does not have four sides', true, false],
  ['x = 3', 'x² = 9', 'x ≠ 3', 'x² ≠ 9', true, false],
  ['triangle T has three equal sides', 'T has three equal angles', 'triangle T does not have three equal sides', 'T does not have three equal angles', true, true],
  ['n is a prime number', 'n is odd', 'n is not a prime number', 'n is not odd', false, false],
  ['polygon P has six sides', 'P is a hexagon', 'polygon P does not have six sides', 'P is not a hexagon', true, true],
  ['n ends in 0', 'n is divisible by 5', 'n does not end in 0', 'n is not divisible by 5', true, false],
  ['x > 5', 'x > 2', 'x ≤ 5', 'x ≤ 2', true, false],
  ['n is a multiple of 6', 'n is a multiple of 3', 'n is not a multiple of 6', 'n is not a multiple of 3', true, false],
];
const cap1 = (s) => s[0].toUpperCase() + s.slice(1);
skill('10-logic1', 10, 'Logic', 'Conditional statements', ['In "If p, then q", p is the hypothesis and q is the conclusion.', 'Converse: if q, then p. Inverse: if not p, then not q. Contrapositive: if not q, then not p. A statement and its contrapositive are always both true or both false.'], (r) => {
  const [p, q, np, nq, t, conv] = r.pick(CONDS), v = r.int(0, 3), S = `If ${p}, then ${q}.`;
  if (v === 0) { const hyp = r.bool(); return mc(r, hyp ? p : q, [hyp ? q : p, np, nq], { q: `What is the ${hyp ? 'hypothesis' : 'conclusion'} of: "${S}"`, steps: ['The hypothesis comes after "if"; the conclusion comes after "then".', `So the ${hyp ? 'hypothesis' : 'conclusion'} is "${hyp ? p : q}".`] }); }
  const forms = { converse: `If ${q}, then ${p}.`, inverse: `If ${np}, then ${nq}.`, contrapositive: `If ${nq}, then ${np}.`, original: S };
  const kind = r.pick(['converse', 'inverse', 'contrapositive']);
  if (v === 1) return mc(r, forms[kind], ['converse', 'inverse', 'contrapositive', 'original'].filter((k) => k !== kind).map((k) => forms[k]), { q: `Which is the ${kind} of "${S}"`, steps: [kind === 'converse' ? 'The converse swaps the hypothesis and the conclusion.' : kind === 'inverse' ? 'The inverse makes both parts negative, without swapping.' : 'The contrapositive swaps the parts and makes both negative.', `So it is "${forms[kind]}"`] });
  if (v === 2) {
    const truth = kind === 'contrapositive' ? t : conv, right = truth ? 'True' : 'False';
    return mc(r, right, [truth ? 'False' : 'True'], { q: `Is the ${kind} of "${S}" true or false? (${kind}: "${forms[kind]}")`, steps: [kind === 'contrapositive' ? `The contrapositive is true exactly when the original is, and the original is ${t ? 'true' : 'false'}.` : `The ${kind} is true exactly when the converse is. Is it always true that if ${q}, then ${p}?`, `It is ${right.toLowerCase()}.`] });
  }
  const bi = t && conv;
  return mc(r, bi ? 'Yes' : 'No', [bi ? 'No' : 'Yes'], { q: `Is this biconditional true? "${/^[a-z] /.test(p) ? p : cap1(p)} if and only if ${q}."`, steps: ['A biconditional is true only when the statement and its converse are both true.', `"If ${p}, then ${q}" is ${t ? 'true' : 'false'}; its converse is ${conv ? 'true' : 'false'}. So ${bi ? 'yes' : 'no'}.`] });
});
skill('10-logic2', 10, 'Logic', 'Truth values, negations and counterexamples', ['A counterexample makes the hypothesis true but the conclusion false: one is enough to show a statement is false.', '"p and q" is true only when both are true; "p or q" is true when at least one is; "if p then q" is false only when p is true and q is false.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const C = [['If a number is prime, then it is odd.', '2', ['3', '5', '7'], '2 is prime but it is even.'], ['If x² = 25, then x = 5.', 'x = −5', ['x = 5', 'x = 0', 'x = 25'], '(−5)² = 25, but −5 is not 5.'], ['If a number is divisible by 2, then it is divisible by 4.', '6', ['8', '12', '16'], '6 is divisible by 2 but not by 4.'], ['The square of a number is always greater than the number.', '1/2', ['2', '3', '−1'], '(1/2)² = 1/4, which is less than 1/2.'], ['If a number is a multiple of 3, then it is odd.', '12', ['9', '15', '21'], '12 is a multiple of 3 but it is even.'], ['The sum of two odd numbers is odd.', '3 + 5', ['2 + 3', '4 + 7', '6 + 1'], '3 and 5 are odd, but 3 + 5 = 8 is even.'], ['If a quadrilateral has four equal sides, then it is a square.', 'a rhombus with no right angles', ['a square', 'a rectangle that is not a square', 'a trapezoid'], 'A rhombus has four equal sides but need not have right angles.']];
    const [s, right, wrong, why] = r.pick(C);
    return mc(r, right, wrong, { q: `Which is a counterexample to: "${s}"`, steps: ['A counterexample fits the hypothesis but not the conclusion.', `${why} So the counterexample is ${right}.`] });
  }
  if (v === 1) {
    const p = r.bool(), q = r.bool(), ops = [['p and q', p && q], ['p or q', p || q], ['if p, then q', !p || q], ['not p', !p], ['p if and only if q', p === q]];
    const [op, val] = r.pick(ops), right = val ? 'True' : 'False';
    return mc(r, right, [val ? 'False' : 'True'], { q: `p is ${p ? 'true' : 'false'} and q is ${q ? 'true' : 'false'}. Is "${op}" true or false?`, steps: [{ 'p and q': '"And" is true only when both are true.', 'p or q': '"Or" is true when at least one is true.', 'if p, then q': 'A conditional is false only when p is true and q is false.', 'not p': '"Not p" has the opposite truth value of p.', 'p if and only if q': 'A biconditional is true when p and q have the same truth value.' }[op], `So "${op}" is ${right.toLowerCase()}.`] });
  }
  const N = [['x > 5', 'x ≤ 5', ['x < 5', 'x ≥ 5']], ['x ≤ −2', 'x > −2', ['x < −2', 'x ≥ −2']], ['The triangle is isosceles.', 'The triangle is not isosceles.', ['The triangle is equilateral.', 'The triangle is a right triangle.']], ['Every student passed the test.', 'At least one student did not pass the test.', ['No student passed the test.', 'Every student failed the test.']], ['Some numbers are negative.', 'No numbers are negative.', ['Some numbers are not negative.', 'All numbers are negative.']], ['x = 4', 'x ≠ 4', ['x = −4', 'x > 4']]];
  const [s, right, wrong] = r.pick(N);
  return mc(r, right, wrong, { q: `What is the negation of "${s}"`, steps: ['The negation is true exactly when the statement is false.', `So the negation is "${right}"`] });
});

// ───────────── 23. Measurement ─────────────
skill('10-metric', 10, 'Measurement', 'Metric units and rates', ['Metric units go up and down by 10, 100 or 1000: 1 km = 1000 m, 1 m = 100 cm, 1 L = 1000 mL, 1 kg = 1000 g.', 'To change km/h to m/s, multiply by 1000 and divide by 3600.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [big, small, f] = r.pick([['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['L', 'mL', 1000], ['kg', 'g', 1000], ['m', 'mm', 1000]]);
    if (r.bool()) { const x = r.int(2, 99) / 10, ans = dec(x * f); return num(ans, [`1 ${big} = ${comma(f)} ${small}, so multiply by ${comma(f)}.`, `${dec(x)} × ${comma(f)} = ${ans}.`, `So ${dec(x)} ${big} = ${ans} ${small}.`], { q: `${dec(x)} ${big} = ? ${small}`, expr: `${x}*${f}` }); }
    const n = r.int(1, 99) * (f / 10) * r.pick([1, 3, 7]), ans = dec(n / f);
    return num(ans, [`1 ${big} = ${comma(f)} ${small}, so divide by ${comma(f)}.`, `${comma(n)} ÷ ${comma(f)} = ${ans}.`, `So ${comma(n)} ${small} = ${ans} ${big}.`], { q: `${comma(n)} ${small} = ? ${big}`, expr: `${n}/${f}` });
  }
  if (v === 1) {
    if (r.bool()) { const s = r.int(2, 8) * 18; return num(s * 5 / 18, [`${s} km/h = ${comma(s * 1000)} m per 3600 s.`, `${comma(s * 1000)} ÷ 3600 = ${s * 5 / 18}.`, `So ${s} km/h = ${s * 5 / 18} m/s.`], { q: `A train travels at ${s} km/h. What is its speed in metres per second?`, expr: `${s}*1000/3600` }); }
    const m = r.int(2, 30), ans = dec(m * 3.6); return num(ans, [`In one hour (3600 s) it goes ${m} × 3600 = ${comma(m * 3600)} m.`, `${comma(m * 3600)} m = ${ans} km.`, `So ${m} m/s = ${ans} km/h.`], { q: `A cyclist moves at ${m} m/s. What is this in km/h?`, expr: `${m}*3600/1000` });
  }
  if (v === 2) {
    const s1 = r.pick([250, 400, 500]), s2 = r.pick([750, 1000, 1200]), u1 = r.int(50, 120) / 100; let u2 = r.int(50, 120) / 100; if (u2 === u1) u2 += 0.05;
    const p1 = (u1 * s1) / 100, p2 = (u2 * s2) / 100, right = u1 < u2 ? `${s1} g for $${p1.toFixed(2)}` : `${s2} g for $${p2.toFixed(2)}`;
    return mc(r, right, [u1 < u2 ? `${s2} g for $${p2.toFixed(2)}` : `${s1} g for $${p1.toFixed(2)}`], { q: `Which box of cereal is the better buy: ${s1} g for $${p1.toFixed(2)} or ${s2} g for $${p2.toFixed(2)}?`, steps: [`Find the price per 100 g: $${p1.toFixed(2)} ÷ ${s1 / 100} = $${u1.toFixed(2)}, and $${p2.toFixed(2)} ÷ ${s2 / 100} = $${u2.toFixed(2)}.`, `The lower unit price is the better buy: ${right}.`] });
  }
  const E = [['the length of a pencil', '18 cm', ['18 mm', '18 m', '18 km']], ['the mass of an apple', '150 g', ['150 kg', '150 mg', '15 kg']], ['the capacity of a water bottle', '500 mL', ['500 L', '5 mL', '50 L']], ['the height of a classroom door', '2 m', ['2 cm', '20 m', '2 km']], ['the length of a soccer field', '100 m', ['100 cm', '100 km', '10 cm']], ['the mass of a large dog', '30 kg', ['30 g', '300 kg', '3 g']]];
  const [what, right, wrong] = r.pick(E);
  return mc(r, right, wrong, { q: `Which is the best estimate for ${what}?`, steps: ['Picture the object and compare it with units you know (a fingernail is about 1 cm wide; a litre of milk has a mass of about 1 kg).', `So the best estimate is ${right}.`] });
});
skill('10-imperial', 10, 'Measurement', 'Imperial units and scale drawings', ['1 foot = 12 inches, 1 yard = 3 feet, 1 mile = 5280 feet.', '1 inch = 2.54 cm exactly. On a scale drawing, multiply the drawing length by the scale.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const [a, b, f] = r.pick([['feet', 'inches', 12], ['yards', 'feet', 3], ['yards', 'inches', 36], ['miles', 'feet', 5280]]), n = r.int(2, 12);
    if (r.bool() || f === 5280) return num(n * f, [`1 ${a.replace(/s$/, '').replace('feet', 'foot')} = ${comma(f)} ${b}.`, `${n} × ${comma(f)} = ${comma(n * f)}.`, `So ${n} ${a} = ${comma(n * f)} ${b}.`], { q: `${n} ${a} = ? ${b}`, expr: `${n}*${f}` });
    return num(n, [`1 ${a.replace(/s$/, '').replace('feet', 'foot')} = ${f} ${b}, so divide by ${f}.`, `${n * f} ÷ ${f} = ${n}.`, `So ${n * f} ${b} = ${n} ${a}.`], { q: `${n * f} ${b} = ? ${a}`, expr: `${n * f}/${f}` });
  }
  if (v === 1) { const ft = r.int(3, 6), inch = r.int(1, 11); return num(ft * 12 + inch, [`${ft} ft = ${ft} × 12 = ${ft * 12} in.`, `${ft * 12} + ${inch} = ${ft * 12 + inch}.`, `So ${ft} ft ${inch} in = ${ft * 12 + inch} inches.`], { q: `${r.pick(NAMES)} is ${ft} ft ${inch} in tall. How many inches is that?`, expr: `${ft}*12+${inch}` }); }
  if (v === 2) {
    if (r.bool()) { const n = r.int(2, 40), ans = dec(n * 2.54); return num(ans, ['1 inch = 2.54 cm.', `${n} × 2.54 = ${ans}.`, `So ${n} inches = ${ans} cm.`], { q: `A tablet screen is ${n} inches wide. How many centimetres is that? (1 in = 2.54 cm)`, expr: `${n}*2.54` }); }
    const n = r.int(1, 20) * 5, ans = dec(n * 12 * 2.54); return num(ans, [`${n} ft = ${n * 12} in.`, `${n * 12} × 2.54 = ${ans}.`, `So ${n} ft = ${ans} cm.`], { q: `How many centimetres are in ${n} feet? (1 ft = 12 in, 1 in = 2.54 cm)`, expr: `${n}*12*2.54` });
  }
  if (v === 3) {
    const s = r.pick([2, 5, 10, 20, 50]), d = r.int(3, 30) / 2, ans = dec(d * s);
    return num(ans, [`The scale says 1 cm on the drawing is ${s} m in real life.`, `${dec(d)} × ${s} = ${ans}.`, `So the real length is ${ans} m.`], { q: `A floor plan uses the scale 1 cm : ${s} m. A wall is ${dec(d)} cm long on the plan. How long is the real wall, in metres?`, expr: `${d}*${s}` });
  }
  const pr = r.pick([0.75, 1.25, 1.5, 2, 2.25]), yd = r.int(2, 10), ans = (pr * 3 * yd).toFixed(2);
  return num(ans, [`${yd} yards = ${yd} × 3 = ${3 * yd} feet.`, `${3 * yd} × $${pr.toFixed(2)} = $${ans}.`, `So it costs $${ans}.`], { q: `Rope costs $${pr.toFixed(2)} per foot. How much do ${yd} yards of rope cost, in dollars?`, expr: `${pr}*3*${yd}` });
});

// ───────────── 24. Constructions ─────────────
// compass constructions, drawn: the arcs are dashed, the finished line is highlighted
const deg = (a, b) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
function bisectFig(a, { stage = 3, label = `${a}°`, half = '' } = {}) {
  const V = [0, 0], r0 = 2.6, rho = 2.7, Pp = GH.onCircle(V, r0, 0), Q = GH.onCircle(V, r0, a);
  const m = a / 2, along = r0 * Math.cos((m * Math.PI) / 180) + Math.sqrt(rho * rho - (r0 * Math.sin((m * Math.PI) / 180)) ** 2), X = GH.onCircle(V, along, m);
  const P = { V, A: GH.onCircle(V, 5.5, 0), B: GH.onCircle(V, 5.5, a), Pp, Q, X, E: GH.onCircle(V, 6, m) };
  const arcs = [];
  if (stage >= 1) arcs.push({ c: 'V', r: r0, from: -12, to: a + 12, t: 'aux' });
  if (stage >= 2) { const t1 = deg(Pp, X), t2 = deg(Q, X); arcs.push({ c: 'Pp', r: rho, from: t1 - 14, to: t1 + 14, t: 'aux' }, { c: 'Q', r: rho, from: t2 - 14, to: t2 + 14, t: 'aux' }); }
  return GH.scene({ P, W: 280, H: 210, pad: 26, fit: [[0, -0.6]], segs: [['V', 'A'], ['V', 'B'], ...(stage >= 3 ? [['V', 'E', 'hlline']] : [])], arcs, dots: stage >= 1 ? ['Pp', 'Q', ...(stage >= 2 ? ['X'] : [])] : [], angs: stage >= 3 && half ? [{ v: 'V', a: 'A', b: 'E', s: half, r: 34 }] : [{ v: 'V', a: 'A', b: 'B', s: label, r: 18 }], names: { V: 'V' } });
}
function perpFig({ L = '', marks = false, Pd = null } = {}) {
  const A = [0, 0], B = [6, 0], y = Math.sqrt(16 - 9), P = { A, B, M: [3, 0], U: [3, 3.6], Dn: [3, -3.6], X1: [3, y], X2: [3, -y], ...(Pd ? { Pp: [3, 2.2] } : {}) };
  const t = deg(A, [3, y]);
  return GH.scene({ P, W: 280, H: 220, pad: 24, segs: [['A', 'B'], ['U', 'Dn', 'hlline'], ...(Pd ? [['Pp', 'A', 'aux'], ['Pp', 'B', 'aux']] : [])], arcs: [{ c: 'A', r: 4, from: t - 14, to: t + 14, t: 'aux' }, { c: 'A', r: 4, from: -t - 14, to: -t + 14, t: 'aux' }, { c: 'B', r: 4, from: 180 - t - 14, to: 180 - t + 14, t: 'aux' }, { c: 'B', r: 4, from: 180 + t - 14, to: 180 + t + 14, t: 'aux' }], dots: ['A', 'B', 'M', ...(Pd ? ['Pp'] : [])], ticks: marks ? [['A', 'M', 1], ['M', 'B', 1]] : [], rights: marks ? [['M', 'B', 'U']] : [], notes: L ? [{ at: [1.4, -0.5], s: L }] : [], sides: [...(Pd ? [['Pp', 'A', Pd[0], Pd[2] ?? 'ink', [3, 0]], ['Pp', 'B', Pd[1], 'hl', [3, 0]]] : [])], names: { A: 'A', B: 'B', M: 'M', ...(Pd ? { Pp: 'P' } : {}) }, nameDir: { A: [-1, -0.4], B: [1, -0.4], M: [0.6, -1], Pp: [0.8, 1] } });
}
const equiFig = (hl) => { const t = 60; return GH.scene({ P: { A: [0, 0], B: [4, 0], C: [2, 2 * Math.sqrt(3)] }, W: 260, H: 210, pad: 26, fills: hl ? [{ pts: ['A', 'B', 'C'] }] : [], segs: [['A', 'B'], ['A', 'C', hl ? 'ink' : 'aux'], ['B', 'C', hl ? 'ink' : 'aux']], arcs: [{ c: 'A', r: 4, from: t - 18, to: t + 12, t: 'aux' }, { c: 'B', r: 4, from: 180 - t - 12, to: 180 - t + 18, t: 'aux' }], ticks: hl ? [['A', 'B', 1], ['B', 'C', 1], ['C', 'A', 1]] : [], angs: hl ? [{ v: 'A', a: 'B', b: 'C', s: '?' }] : [], dots: ['A', 'B', 'C'], names: ['A', 'B', 'C'] }); };
skill('10-construct', 10, 'Constructions', 'Compass constructions', [
  KL('Constructions use only a compass and a straightedge: no measuring. The compass copies lengths.'),
  KL('To bisect an angle: an arc from the vertex crosses both rays; equal arcs from those two points cross; join the vertex to the crossing.', bisectFig(70, { stage: 3, label: '' })),
  KL('The perpendicular bisector of AB: equal arcs (more than half of AB) from A and from B cross above and below; the line through the crossings cuts AB in half at right angles.', perpFig({ marks: true })),
  KL('An equilateral triangle: arcs of radius AB from A and from B meet at C, so all three sides are equal and every angle is 60°.', equiFig(true)),
  KL('Every construction works because the compass makes equal lengths, so the triangles it builds are congruent (SSS).'),
], (r) => {
  const v = r.int(0, 7);
  if (v === 0) {
    const a = r.int(10, 85) * 2;
    return num(a / 2, [St('Arc from the vertex V crossing both rays.', bisectFig(a, { stage: 1 })), St('Equal arcs from the two crossing points meet inside the angle.', bisectFig(a, { stage: 2 })), St(`The line from V through that point splits the angle into two equal parts: ${a}° ÷ 2 = ${a / 2}°.`, bisectFig(a, { stage: 3, half: `${a / 2}°` })), `So each new angle is ${a / 2}°.`], { q: `This angle of ${a}° is bisected with a compass and straightedge. What is the measure of each new angle, in degrees?`, visual: bisectFig(a, { stage: 0 }), expr: `${a}/2` });
  }
  if (v === 1) { const a = r.int(40, 140); return mc(r, 'Draw an arc centred at the vertex that crosses both rays.', ['Measure the angle with a protractor.', 'Draw a line from the vertex to any point inside the angle.', 'Draw a circle through the two rays’ end points.'], { q: 'You want to bisect this angle with a compass and straightedge. What is the first step?', visual: bisectFig(a, { stage: 0, label: '' }), steps: [St('The construction uses only a compass and a straightedge: no measuring.'), St('First, draw an arc centred at the vertex that crosses both rays.', bisectFig(a, { stage: 1, label: '' }))] }); }
  if (v === 2) return mc(r, 'The distance between the two points where the first arc crosses the rays', ['The length of the longer ray', 'The distance from the vertex to the end of a ray', 'The size of the angle in degrees'], { q: 'When copying an angle onto a new ray, after drawing the matching arcs, which distance do you copy with the compass?', visual: bisectFig(60, { stage: 1, label: '' }), steps: [St('Both angles get arcs with the same radius from their vertices.'), St('Then copying the gap between the two arc points makes the openings match.', bisectFig(60, { stage: 1, label: '' }))] });
  if (v === 3) {
    const which = r.bool() ? 'bisecting an angle' : 'the perpendicular bisector';
    return mc(r, 'SSS', ['SAS', 'ASA', 'AAS'], { q: `The compass construction for ${which} works because it builds two congruent triangles. Which congruence rule proves this?`, visual: which === 'bisecting an angle' ? bisectFig(80, { stage: 2, label: '' }) : perpFig({}), steps: [St('Every length in the construction is set by the compass, and the two triangles share a side: three pairs of equal sides.'), 'Three pairs of equal sides: SSS.'] });
  }
  if (v === 4) {
    const L = 2 * r.int(3, 15);
    return num(L / 2, [St('The perpendicular bisector crosses AB at its midpoint M, at a right angle.', perpFig({ L: `${L} cm`, marks: true })), `AM = ${L} ÷ 2 = ${L / 2}.`, `So AM = ${L / 2} cm.`], { q: `The perpendicular bisector of AB is constructed. AB = ${L} cm. How long is AM, in cm?`, visual: perpFig({ L: `${L} cm` }), expr: `${L}/2` });
  }
  if (v === 5) {
    const d = r.int(3, 20);
    return num(d, [St('Every point on the perpendicular bisector of AB is the same distance from A as from B.', perpFig({ marks: true, Pd: [`${d} cm`, `${d} cm`, 'hl'] })), `PB = PA = ${d}.`, `So PB = ${d} cm.`], { q: `P is on the perpendicular bisector of AB, and PA = ${d} cm. How long is PB?`, visual: perpFig({ Pd: [`${d} cm`, '?'] }), expr: String(d) });
  }
  if (v === 6) return num(60, [St('C is on an arc centred at A and on an arc centred at B, both with radius AB. So CA = AB and CB = AB.', equiFig(false)), St('All three sides are equal, so the triangle is equilateral, and its three equal angles share 180°: 180 ÷ 3 = 60.', equiFig(true)), 'So ∠CAB = 60°.'], { q: 'Arcs with radius AB are drawn from A and from B; they meet at C. What is ∠CAB, in degrees?', visual: equiFig(false), expr: '180/3' });
  const a = r.pick([40, 48, 60, 72, 80, 88, 100, 120, 128, 140, 160, 172]);
  return num(a / 4, [St(`Bisect once: ${a}° ÷ 2 = ${a / 2}°.`, bisectFig(a, { stage: 3, half: `${a / 2}°` })), `Bisect one half again: ${a / 2}° ÷ 2 = ${a / 4}°.`, `So the smallest angle is ${a / 4}°.`], { q: `An angle of ${a}° is bisected, and then one of the two new angles is bisected again. What is the measure of each of the smallest angles, in degrees?`, visual: bisectFig(a, { stage: 0 }), expr: `${a}/4` });
});

// ───────────── 25. Two-dimensional figures (taught with figures: see geo10.mjs) ─────────────
skill('10-area2d', 10, 'Two-dimensional figures', 'Area and perimeter', GEO.LESSONS.area2d, GEO.area2d);
skill('10-quads', 10, 'Two-dimensional figures', 'Quadrilaterals and polygons', GEO.LESSONS.quads, GEO.quads);

// ───────────── 26. Three-dimensional figures ─────────────
skill('10-solids', 10, 'Three-dimensional figures', 'Faces, edges, nets and cross-sections', GEO.LESSONS.solids, GEO.solids);
skill('10-volume', 10, 'Three-dimensional figures', 'Volume', GEO.LESSONS.volume, GEO.volume);
skill('10-surface', 10, 'Three-dimensional figures', 'Surface area and similar solids', GEO.LESSONS.surface, GEO.surface);

// ───────────── 27. Congruent figures ─────────────
// two triangles side by side with matching marks: the second is the first turned, flipped and scaled by k (or a
// different triangle T2). Vertices are numbered 0, 1, 2 in each triangle.
//   ticks [[i, j, n]], arcs [[i, n, label1, label2]], rights [i], labels [[t, i, j, text, tone]], hl [[t, i, j]], angl [[t, i, text, tone]]
function twoTri({ T, T2, k = 1, turn = 0, flip = false, N = ['A', 'B', 'C', 'D', 'E', 'F'], ticks = [], arcs = [], rights = [], labels = [], hl = [], angl = [], W = 320, H = 200 }) {
  const [P1, P2] = T2 ? [T, GH.besides(T, T2)] : GH.pairPts(T, { k, turn, flip });
  const P = {}; N.forEach((n, i) => (P[n] = i < 3 ? P1[i] : P2[i - 3]));
  const v = (t, i) => N[t * 3 + i];
  const tk = [], an = [], rt = [];
  for (const [i, j, n] of ticks) for (const t of [0, 1]) tk.push([v(t, i), v(t, j), n]);
  for (const [i, n, s1 = '', s2 = ''] of arcs) for (const t of [0, 1]) an.push({ v: v(t, i), a: v(t, (i + 1) % 3), b: v(t, (i + 2) % 3), n, s: t ? s2 : s1, r: 17 });
  for (const [t, i, s, tone] of angl) an.push({ v: v(t, i), a: v(t, (i + 1) % 3), b: v(t, (i + 2) % 3), s, r: 20, t: tone ?? 'mark' });
  for (const i of rights) for (const t of [0, 1]) rt.push([v(t, i), v(t, (i + 1) % 3), v(t, (i + 2) % 3)]);
  return GH.scene({ P, W, H, pad: 30, fills: [{ pts: N.slice(0, 3) }, { pts: N.slice(3) }], segs: hl.map(([t, i, j]) => [v(t, i), v(t, j), 'hlline']), ticks: tk, angs: an, rights: rt, sides: labels.map(([t, i, j, s, tone]) => [v(t, i), v(t, j), s, tone ?? 'ink']), names: N });
}
// a scalene triangle whose angles at corners 0 and 1 are A and B
const tri = (r, A = r.int(48, 72), B = r.int(42, 66)) => GH.triFromAngles(A, B, 4);
const TRIS = [['ABC', 'DEF'], ['PQR', 'XYZ'], ['JKL', 'MNO'], ['RST', 'UVW']];
const RULES = ['SSS', 'SAS', 'ASA', 'AAS', 'HL'];
skill('10-congthm', 10, 'Congruent figures', 'Triangle congruence rules', [
  KL('Marks show equal parts: the same number of ticks on equal sides, the same number of arcs on equal angles, a small square on a right angle.', twoTri({ T: GH.triFromAngles(62, 50, 4), turn: 25, flip: true, ticks: [[0, 1, 1], [1, 2, 2], [2, 0, 3]] })),
  KL('SSS: three pairs of equal sides. SAS: two sides and the angle between them.', twoTri({ T: GH.triFromAngles(62, 50, 4), turn: -20, ticks: [[0, 1, 1], [1, 2, 2]], arcs: [[1, 1]] })),
  KL('ASA: two angles and the side between them. AAS: two angles and a side that is not between them.', twoTri({ T: GH.triFromAngles(62, 50, 4), turn: 160, arcs: [[0, 1], [1, 2]], ticks: [[0, 1, 1]] })),
  KL('HL: two right triangles with equal hypotenuses and one pair of equal legs.', twoTri({ T: [[0, 0], [4, 0], [0, 3]], flip: true, rights: [0], ticks: [[1, 2, 1], [0, 2, 2]] })),
  KL('SSA and AAA do NOT prove congruence: AAA gives the same shape but maybe a different size.', twoTri({ T: GH.triFromAngles(62, 50, 4), k: 1.5, arcs: [[0, 1], [1, 2], [2, 3]] })),
], (r) => {
  const v = r.int(0, 9), [t1, t2] = r.pick(TRIS), perm = r.shuffle([0, 1, 2]);
  const N = [...t1, ...t2], [x, y, z] = perm, [X, Y, Z] = perm.map((i) => t1[i]), [X2, Y2, Z2] = perm.map((i) => t2[i]);
  const turn = r.pick([0, 30, -30, 150, 200]), flip = r.bool();
  if (v <= 4) {
    const kind = v <= 1 ? r.pick(['SSS', 'SAS', 'ASA', 'AAS', 'HL', 'SSA', 'AAA']) : r.pick(['SSS', 'SAS', 'ASA', 'AAS', 'HL']);
    let T = tri(r);
    if (kind === 'HL') { const a = [0, 0, 0]; a[z] = 90; a[x] = r.int(30, 60); a[y] = 90 - a[x]; T = GH.triFromAngles(a[0], a[1], 4); }
    const M = { SSS: { ticks: [[x, y, 1], [y, z, 2], [z, x, 3]] }, SAS: { ticks: [[x, y, 1], [y, z, 2]], arcs: [[y, 1]] }, ASA: { arcs: [[x, 1], [y, 2]], ticks: [[x, y, 1]] }, AAS: { arcs: [[x, 1], [y, 2]], ticks: [[y, z, 1]] }, HL: { rights: [z], ticks: [[x, y, 1], [y, z, 2]] }, SSA: { ticks: [[x, y, 1], [y, z, 2]], arcs: [[x, 1]] }, AAA: { arcs: [[x, 1], [y, 2], [z, 3]] } }[kind];
    const right = kind === 'SSA' || kind === 'AAA' ? 'Not enough information' : kind;
    const why = { SSS: 'All three pairs of sides are marked equal.', SAS: `The marked angle ${Y} is between the two marked sides ${X}${Y} and ${Y}${Z}.`, ASA: `The marked side ${X}${Y} is between the two marked angles at ${X} and ${Y}.`, AAS: `Two angles are marked, and the marked side ${Y}${Z} is not between them.`, HL: `They are right triangles: the hypotenuses ${X}${Y} and ${X2}${Y2} are equal, and so are the legs ${Y}${Z} and ${Y2}${Z2}.`, SSA: `The marked angle at ${X} is not between the two marked sides, and SSA does not prove congruence.`, AAA: 'Equal angles give the same shape but not always the same size.' }[kind];
    const opts = [...RULES, 'Not enough information'].filter((o) => o !== right);
    const choices = right === 'Not enough information' ? r.shuffle(opts).slice(0, 3) : [...r.shuffle(opts.filter((o) => o !== 'Not enough information')).slice(0, 2), 'Not enough information'];
    const facts = { SSS: [`${X}${Y} = ${X2}${Y2}`, `${Y}${Z} = ${Y2}${Z2}`, `${Z}${X} = ${Z2}${X2}`], SAS: [`${X}${Y} = ${X2}${Y2}`, `∠${Y} = ∠${Y2}`, `${Y}${Z} = ${Y2}${Z2}`], ASA: [`∠${X} = ∠${X2}`, `${X}${Y} = ${X2}${Y2}`, `∠${Y} = ∠${Y2}`], AAS: [`∠${X} = ∠${X2}`, `∠${Y} = ∠${Y2}`, `${Y}${Z} = ${Y2}${Z2}`], HL: [`∠${Z} and ∠${Z2} are right angles`, `${X}${Y} = ${X2}${Y2}`, `${Y}${Z} = ${Y2}${Z2}`], SSA: [`${X}${Y} = ${X2}${Y2}`, `${Y}${Z} = ${Y2}${Z2}`, `∠${X} = ∠${X2}`], AAA: [`∠${X} = ∠${X2}`, `∠${Y} = ∠${Y2}`, `∠${Z} = ∠${Z2}`] }[kind];
    const pic = twoTri({ T, N, turn, flip, ...M });
    const hl = { SSS: [[0, x, y], [0, y, z], [0, z, x]], SAS: [[0, x, y], [0, y, z]], ASA: [[0, x, y]], AAS: [[0, y, z]], HL: [[0, x, y], [0, y, z]], SSA: [[0, x, y], [0, y, z]], AAA: [] }[kind];
    if (v === 4) return mc(r, right, choices, { q: `In △${t1} and △${t2}: ${facts.join(', ')}. Which rule shows the triangles are congruent?`, steps: [St(why, twoTri({ T, N, turn, flip, ...M, hl })), `So the answer is ${right}.`] });
    return mc(r, right, choices, { q: 'Using only the marked parts, which rule shows these two triangles are congruent?', visual: pic, steps: [St(why, twoTri({ T, N, turn, flip, ...M, hl })), `So the answer is ${right}.`] });
  }
  if (v === 5 || v === 6) {
    const T = tri(r), sas = v === 5;
    const M = sas ? { ticks: [[x, y, 1], [y, z, 2]] } : { arcs: [[x, 1], [y, 2]] };
    const right = sas ? `∠${Y} = ∠${Y2}` : `${X}${Y} = ${X2}${Y2}`;
    const wr = sas ? [`∠${X} = ∠${X2}`, `∠${Z} = ∠${Z2}`, `${Z}${X} = ${Z2}${X2}`] : [`${Y}${Z} = ${Y2}${Z2}`, `${Z}${X} = ${Z2}${X2}`, `∠${Z} = ∠${Z2}`];
    return mc(r, right, wr, { q: `Which extra fact would prove these triangles congruent by ${sas ? 'SAS' : 'ASA'}?`, visual: twoTri({ T, N, turn, flip, ...M }), steps: [St(sas ? `SAS needs the angle between the two marked sides. The sides ${X}${Y} and ${Y}${Z} meet at ${Y}.` : `ASA needs the side between the two marked angles. The angles are at ${X} and ${Y}, so the side is ${X}${Y}.`, twoTri({ T, N, turn, flip, ...M, ...(sas ? { arcs: [[y, 1]] } : { ticks: [[x, y, 1]] }) })), `So the extra fact is ${right}.`] });
  }
  if (v === 7) {
    // a kite: triangles ABD and CBD share BD
    const sss = r.bool(), P = { A: [-2, 0], B: [0, 3], C: [2, 0], Dd: [0, -1.6] };
    const pic = (hl) => GH.scene({ P, W: 260, H: 220, fills: [{ pts: ['A', 'B', 'Dd'] }, { pts: ['C', 'B', 'Dd'] }], segs: hl ? [['B', 'Dd', 'hlline']] : [], ticks: sss ? [['A', 'B', 1], ['C', 'B', 1], ['A', 'Dd', 2], ['C', 'Dd', 2]] : [['A', 'B', 1], ['C', 'B', 1]], angs: sss ? [] : [{ v: 'B', a: 'A', b: 'Dd', r: 26 }, { v: 'B', a: 'Dd', b: 'C', r: 26 }], names: { A: 'A', B: 'B', C: 'C', Dd: 'D' } });
    const right = sss ? 'SSS' : 'SAS';
    return mc(r, right, RULES.filter((o) => o !== right).slice(0, 3), { q: 'Triangles ABD and CBD share the side BD. Which rule shows they are congruent?', visual: pic(false), steps: [St('A shared side is equal to itself: BD = BD.', pic(true)), sss ? 'With AB = CB and AD = CD, that makes three pairs of equal sides: SSS.' : 'With AB = CB and ∠ABD = ∠CBD (between AB and BD), that is two sides and the angle between them: SAS.'] });
  }
  if (v === 8) {
    const P = { A: [-3, 2], B: [3, 2.4], C: [3, -2], Dd: [-3, -2.4], E: [0, 0] };
    const pic = (hl) => GH.scene({ P, W: 280, H: 210, fills: [{ pts: ['A', 'B', 'E'] }, { pts: ['C', 'Dd', 'E'] }], ticks: [['A', 'E', 1], ['E', 'C', 1], ['B', 'E', 2], ['E', 'Dd', 2]], angs: hl ? [{ v: 'E', a: 'A', b: 'B', t: 'hlline', r: 16 }, { v: 'E', a: 'C', b: 'Dd', t: 'hlline', r: 16 }] : [], names: { A: 'A', B: 'B', C: 'C', Dd: 'D', E: 'E' } });
    return mc(r, 'SAS', ['SSS', 'ASA', 'AAS'], { q: 'Segments AC and BD cross at E. Which rule shows △ABE ≅ △CDE?', visual: pic(false), steps: [St('∠AEB and ∠CED are vertical angles, so they are equal. They are between the marked sides.', pic(true)), 'AE = CE, ∠AEB = ∠CED and BE = DE: two sides and the angle between them, SAS.'] });
  }
  const T = tri(r);
  return mc(r, 'Not enough information', ['SSS', 'ASA', 'AAA'], { q: 'All three pairs of angles of these triangles are equal. Are the triangles congruent, and by which rule?', visual: twoTri({ T, N, k: 1.4, turn, flip, arcs: [[0, 1], [1, 2], [2, 3]] }), steps: [St('Equal angles make the same shape, but one triangle can be a bigger copy of the other.'), 'So there is not enough information: AAA is not a congruence rule.'] });
});

skill('10-congparts', 10, 'Congruent figures', 'Corresponding parts and isosceles triangles', [
  KL('In △ABC ≅ △DEF the letters match in order: A ↔ D, B ↔ E, C ↔ F. So AB = DE, BC = EF, ∠C = ∠F, and so on, even when one triangle is turned or flipped.', twoTri({ T: GH.triFromAngles(64, 48, 4), turn: 140, flip: true, ticks: [[0, 1, 1], [1, 2, 2], [2, 0, 3]], arcs: [[0, 1], [1, 2], [2, 3]] })),
  KL('An isosceles triangle has two equal sides. The angles opposite them (the base angles) are equal.', GH.scene({ P: { A: [0, 0], B: [4, 0], C: [2, 3.6] }, fills: [{ pts: ['A', 'B', 'C'] }], ticks: [['A', 'C', 1], ['B', 'C', 1]], angs: [{ v: 'A', a: 'B', b: 'C', s: 'x' }, { v: 'B', a: 'C', b: 'A', s: 'x' }] })),
  KL('An equilateral triangle has three equal sides and three 60° angles.', GH.scene({ P: { A: [0, 0], B: [4, 0], C: [2, 2 * Math.sqrt(3)] }, fills: [{ pts: ['A', 'B', 'C'] }], ticks: [['A', 'B', 1], ['B', 'C', 1], ['C', 'A', 1]], angs: [{ v: 'A', a: 'B', b: 'C', s: '60°' }, { v: 'B', a: 'C', b: 'A', s: '60°' }, { v: 'C', a: 'A', b: 'B', s: '60°' }] })),
], (r) => {
  const v = r.int(0, 7), [t1, t2] = r.pick(TRIS), N = [...t1, ...t2], turn = r.pick([0, 120, 200, -40]), flip = r.bool(), T = tri(r);
  const marks = { ticks: [[0, 1, 1], [1, 2, 2], [2, 0, 3]] };
  if (v === 0) {
    const i = r.int(0, 2), j = (i + 1 + r.int(0, 1)) % 3, sideOf = (a, b) => (a < b ? [a, b] : [b, a]);
    const all = [[0, 1], [1, 2], [0, 2]].map(([a, b]) => t2[a] + t2[b]);
    const [a, b] = sideOf(i, j);
    return mc(r, t2[a] + t2[b], [...all.filter((s) => s !== t2[a] + t2[b]), t1[i] + t2[j]], { q: `△${t1} ≅ △${t2}. Which side matches ${t1[i]}${t1[j]}?`, visual: twoTri({ T, N, turn, flip, ...marks }), steps: [St(`Match the letters in order: ${t1[i]} ↔ ${t2[i]} and ${t1[j]} ↔ ${t2[j]}. The marks agree: the same number of ticks.`, twoTri({ T, N, turn, flip, ...marks, hl: [[0, i, j], [1, i, j]] })), `So ${t1[i]}${t1[j]} matches ${t2[a]}${t2[b]}.`] });
  }
  if (v === 1) {
    const i = r.int(0, 2);
    return mc(r, `∠${t2[i]}`, [0, 1, 2].filter((k) => k !== i).map((k) => `∠${t2[k]}`).concat([`∠${t1[(i + 1) % 3]}`]), { q: `△${t1} ≅ △${t2}. Which angle matches ∠${t1[i]}?`, visual: twoTri({ T, N, turn, flip, ...marks }), steps: [St(`Letters in the same position match: ${t1[i]} is letter ${i + 1} of ${t1}, and ${t2[i]} is letter ${i + 1} of ${t2}.`, twoTri({ T, N, turn, flip, ...marks, angl: [[0, i, '', 'hlline'], [1, i, '', 'hlline']] })), `So ∠${t1[i]} matches ∠${t2[i]}.`] });
  }
  if (v === 2) {
    const a = r.int(45, 75), b = r.int(40, 70), T2 = GH.triFromAngles(a, b, 4), c = 180 - a - b;
    const pic = (hl) => twoTri({ T: T2, N, turn, flip, ...marks, angl: [[0, 0, `${a}°`], [0, 1, `${b}°`], [1, 2, hl ? `${c}°` : '?', hl ? 'hlline' : 'mark']] });
    return num(c, [St(`∠${t2[2]} matches ∠${t1[2]}, so first find ∠${t1[2]}.`), St(`The angles of △${t1} add to 180°: 180 − ${a} − ${b} = ${c}.`, pic(true)), `So ∠${t2[2]} = ${c}°.`], { q: `△${t1} ≅ △${t2}. What is ∠${t2[2]}, in degrees?`, visual: pic(false), expr: `180-${a}-${b}` });
  }
  if (v === 3) {
    const i = r.int(0, 2), j = (i + 1) % 3, side = (a, b) => Math.round(Math.hypot(T[a][0] - T[b][0], T[a][1] - T[b][1]) * 10) / 10;
    const L = Math.round(side(i, j) * r.pick([2, 3]));
    const pic = (hl) => twoTri({ T, N, turn, flip, ...marks, labels: [[0, i, j, `${L} cm`], [1, i, j, hl ? `${L} cm` : '?', 'hl']], hl: hl ? [[0, i, j], [1, i, j]] : [] });
    return num(L, [St(`${t1[i]}${t1[j]} matches ${t2[i]}${t2[j]}: the letters are in the same positions.`, pic(true)), `Matching sides of congruent triangles are equal: ${t2[i]}${t2[j]} = ${L}.`, `So ${t2[i]}${t2[j]} = ${L} cm.`], { q: `△${t1} ≅ △${t2} and ${t1[i]}${t1[j]} = ${L} cm. How long is ${t2[i]}${t2[j]}, in cm?`, visual: pic(false), expr: String(L) });
  }
  const iso = (base, hl, lab) => { const h = 2 * Math.tan((base * Math.PI) / 180); return GH.scene({ P: { A: [0, 0], B: [4, 0], C: [2, h] }, W: 260, H: 220, fills: [{ pts: ['A', 'B', 'C'] }], ticks: [['A', 'C', 1], ['B', 'C', 1]], angs: [{ v: 'A', a: 'B', b: 'C', s: lab[0], t: hl === 'base' ? 'hlline' : 'mark' }, { v: 'B', a: 'C', b: 'A', s: lab[1], t: hl === 'base' ? 'hlline' : 'mark' }, { v: 'C', a: 'A', b: 'B', s: lab[2], r: 18, t: hl === 'top' ? 'hlline' : 'mark' }], names: ['A', 'B', 'C'] }); };
  if (v === 4) { const top = r.int(10, 75) * 2, b = (180 - top) / 2; return num(b, [St('The two marked sides are equal, so the base angles at A and B are equal.', iso(b, 'base', ['?', '?', `${top}°`])), `The three angles add to 180°: (180 − ${top}) ÷ 2 = ${b}.`, `So each base angle is ${b}°.`], { q: 'This triangle is isosceles. What is ∠A, in degrees?', visual: iso(b, null, ['?', '', `${top}°`]), expr: `(180-${top})/2` }); }
  if (v === 5) { const b = r.int(25, 80); return num(180 - 2 * b, [St(`The base angles are equal, so ∠B = ∠A = ${b}°.`, iso(b, 'base', [`${b}°`, `${b}°`, '?'])), `180 − 2 × ${b} = ${180 - 2 * b}.`, `So ∠C = ${180 - 2 * b}°.`], { q: 'This triangle is isosceles. What is ∠C, in degrees?', visual: iso(b, null, [`${b}°`, '', '?']), expr: `180-2*${b}` }); }
  if (v === 6) {
    const x = r.int(2, 12), p = r.int(2, 4), q = p + r.int(1, 3), c = r.int(1, 15), e = c - (q - p) * x;
    const pic = GH.scene({ P: { A: [0, 0], B: [4, 0], C: [2, 2 * Math.sqrt(3)] }, W: 260, H: 220, fills: [{ pts: ['A', 'B', 'C'] }], ticks: [['A', 'B', 1], ['B', 'C', 1], ['C', 'A', 1]], sides: [['C', 'A', px([q, e])], ['B', 'C', px([p, c])]] });
    return num(x, [St(`All the sides of an equilateral triangle are equal: ${px([q, e])} = ${px([p, c])}.`, pic), `Gather the x terms on the left and the numbers on the right: ${q - p}x = ${c - e}.`, `x = ${c - e} ÷ ${q - p} = ${x}.`, `So x = ${x}.`], { q: 'This triangle is equilateral. Find x.', unit: 'x =', visual: pic, expr: `(${c}-(${e}))/(${q - p})` });
  }
  let a1, a2, b1, b2, x, val, g = 0; do { x = r.int(5, 20); a1 = r.int(1, 3); a2 = a1 + r.int(1, 2); b1 = r.int(-10, 20); b2 = (a1 - a2) * x + b1; val = a1 * x + b1; } while ((val < 42 || val > 75) && g++ < 200);
  if (val < 42 || val > 75) { x = 10; a1 = 2; a2 = 3; b1 = 30; b2 = 20; val = 50; }
  const e1 = `(${px([a1, b1])})°`, e2 = `(${px([a2, b2])})°`;
  return num(x, [St('The marked sides are equal, so the base angles are equal.', iso(val, 'base', [e1, e2, ''])), `${px([a1, b1])} = ${px([a2, b2])}, so ${a2 - a1}x = ${b1 - b2} and x = ${x}.`, `So x = ${x} (each base angle is ${val}°).`], { q: 'This triangle is isosceles. Find x.', unit: 'x =', visual: iso(val, null, [e1, e2, '']), expr: `(${b1}-(${b2}))/(${a2 - a1})` });
});

// ───────────── 28. Triangles ─────────────
const triPic = (T, o = {}) => GH.scene({ W: 280, H: 210, ...o, P: { A: T[0], B: T[1], C: T[2], ...(o.P ?? {}) }, fills: [{ pts: ['A', 'B', 'C'] }, ...(o.fills ?? [])], names: o.names ?? ['A', 'B', 'C'] });
const at = (v, s, t = 'mark', r = 20) => { const o = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] }[v]; return { v, a: o[0], b: o[1], s, t, r }; };
skill('10-triangles', 10, 'Triangles', 'Triangle angles and sides', [
  KL('The angles of a triangle add to 180°.', triPic(GH.triFromAngles(70, 50, 4), { angs: [at('A', '70°'), at('B', '50°'), at('C', '60°')] })),
  KL('An exterior angle (made by extending a side) equals the sum of the two inside angles that are not next to it.', triPic(GH.triFromAngles(70, 50, 4), { P: { E: [6, 0] }, segs: [['B', 'E', 'aux']], angs: [at('A', '70°'), at('C', '60°'), { v: 'B', a: 'E', b: 'C', s: '130°', t: 'hlline', r: 18 }], names: [] })),
  KL('Any two sides must add to more than the third. The longest side is opposite the largest angle.'),
  KL('A midsegment joins the midpoints of two sides. It is parallel to the third side and half as long.', triPic([[0, 0], [6, 0], [2, 4]], { P: { Dm: [1, 2], Em: [4, 2] }, segs: [['Dm', 'Em', 'hlline']], ticks: [['A', 'Dm', 1], ['Dm', 'C', 1], ['C', 'Em', 2], ['Em', 'B', 2]], par: [['Dm', 'Em', 1], ['A', 'B', 1]], names: { A: 'A', B: 'B', C: 'C', Dm: 'D', Em: 'E' } })),
], (r) => {
  const v = r.int(0, 8);
  if (v === 0) {
    const a = r.int(30, 75), b = r.int(30, 75);
    const c = 180 - a - b, T2 = GH.triFromAngles(a, c, 4); // put the asked exterior angle at B: remote angles at A and C
    const pic2 = (hl) => triPic(T2, { P: { E: [6.2, 0] }, segs: [['B', 'E', 'aux']], angs: [at('A', `${a}°`, hl ? 'hlline' : 'mark'), at('C', `${b}°`, hl ? 'hlline' : 'mark'), { v: 'B', a: 'E', b: 'C', s: hl ? `${a + b}°` : '?', t: 'mark', r: 18 }] });
    return num(a + b, [St('The exterior angle at B equals the sum of the two inside angles not next to it: the angles at A and C.', pic2(true)), `${a} + ${b} = ${a + b}.`, `So the exterior angle is ${a + b}°.`], { q: 'Side AB is extended past B. What is the exterior angle marked ?, in degrees?', visual: pic2(false), expr: `${a}+${b}` });
  }
  if (v === 1) {
    const [k, x] = r.pick([[[1, 2, 3], 30], [[2, 3, 4], 20], [[1, 1, 2], 45], [[1, 3, 5], 20], [[3, 4, 5], 15], [[1, 2, 2], 36], [[2, 3, 5], 18], [[1, 4, 7], 15]]);
    const t = (c) => (c === 1 ? 'x' : `${c}x`), T = GH.triFromAngles(k[0] * x, k[1] * x, 4);
    return num(x, [St(`The angles add to 180°: ${k.map(t).join(' + ')} = 180.`, triPic(T, { angs: [at('A', t(k[0]), 'hlline'), at('B', t(k[1]), 'hlline'), at('C', t(k[2]), 'hlline')] })), `${k[0] + k[1] + k[2]}x = 180, so x = 180 ÷ ${k[0] + k[1] + k[2]} = ${x}.`, `So x = ${x}.`], { q: 'The angles of this triangle are marked in terms of x. Find x.', unit: 'x =', visual: triPic(T, { angs: [at('A', t(k[0])), at('B', t(k[1])), at('C', t(k[2]))] }), expr: `180/${k[0] + k[1] + k[2]}` });
  }
  if (v === 2) {
    const a = r.int(3, 15), b = r.int(3, 15), T = GH.triFromSides(Math.max(a, b), b, a);
    const pic = triPic(T, { sides: [['A', 'B', `${a} cm`], ['C', 'A', `${b} cm`], ['B', 'C', '?']], names: [] });
    return num(a + b - 1, [St(`The third side must be shorter than the other two put together: less than ${a} + ${b} = ${a + b}.`, pic), `The greatest whole number less than ${a + b} is ${a + b - 1}.`, `So the longest possible whole-number side is ${a + b - 1} cm.`], { q: 'Two sides of a triangle are shown. What is the greatest possible whole-number length of the third side, in cm?', visual: pic, expr: `${a}+${b}-1` });
  }
  if (v === 3) {
    const a = r.int(3, 15), b = r.int(3, 15), c = r.bool() ? r.int(Math.abs(a - b) + 1, a + b - 1) : a + b + r.int(0, 4), ok = c < a + b && a < b + c && b < a + c;
    const big = Math.max(a, b, c), rest = [a, b, c].sort((p, q) => p - q).slice(0, 2);
    return mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], { q: `Can ${a} cm, ${b} cm and ${c} cm be the sides of a triangle?`, steps: [`Check that the two shorter sides add to more than the longest: ${rest[0]} + ${rest[1]} = ${rest[0] + rest[1]}, and the longest is ${big}.`, ok ? `${rest[0] + rest[1]} > ${big}, so yes.` : `${rest[0] + rest[1]} is not more than ${big}: the two short sides cannot meet, so no.`] });
  }
  const mid = (hl, lab) => triPic([[0, 0], [6, 0], [2.2, 4]], { P: { Dm: [1.1, 2], Em: [4.1, 2] }, segs: [['Dm', 'Em', hl ? 'hlline' : 'ink']], ticks: [['A', 'Dm', 1], ['Dm', 'C', 1], ['C', 'Em', 2], ['Em', 'B', 2]], par: [['Dm', 'Em', 1], ['A', 'B', 1]], sides: [['Dm', 'Em', lab[0], hl ? 'hl' : 'ink', 'C'], ['A', 'B', lab[1]]], names: { A: 'B', B: 'C', C: 'A', Dm: 'D', Em: 'E' } });
  if (v === 4) { const m = r.int(3, 20); return num(2 * m, [St('D and E are midpoints (the ticks), so DE is a midsegment: parallel to BC and half as long.', mid(true, [`${m} cm`, '?'])), `So BC = 2 × ${m} = ${2 * m}.`, `So BC = ${2 * m} cm.`], { q: 'D and E are the midpoints of AB and AC. How long is BC, in cm?', visual: mid(false, [`${m} cm`, '?']), expr: `2*${m}` }); }
  if (v === 5) {
    const x = r.int(3, 12), p = r.int(1, 4), bc = 2 * (x + p), k = r.int(3, 5), d = k * x - bc;
    return num(x, [St('DE is a midsegment, so BC = 2 × DE.', mid(true, [`x + ${p}`, px([k, -d])])), `${px([k, -d])} = 2(x + ${p}) = 2x + ${2 * p}, so ${k - 2}x = ${2 * p + d}.`, `x = ${2 * p + d} ÷ ${k - 2} = ${x}.`, `So x = ${x}.`], { q: 'D and E are the midpoints of AB and AC. Find x.', unit: 'x =', visual: mid(false, [`x + ${p}`, px([k, -d])]), expr: `(${2 * p}+(${d}))/${k - 2}` });
  }
  if (v === 6) {
    let A, B; do { A = r.int(30, 100); B = r.int(30, 100); } while (A === B || A + B >= 170 || 180 - A - B === A || 180 - A - B === B);
    const C = 180 - A - B, big = r.bool(), angs = { A, B, C }, key = Object.keys(angs).sort((u, w) => (big ? angs[w] - angs[u] : angs[u] - angs[w]))[0];
    const opp = { A: 'BC', B: 'AC', C: 'AB' }, T = [[0, 0], [4, 0], [2.1, 3.3]];
    return mc(r, opp[key], ['AB', 'BC', 'AC'].filter((x) => x !== opp[key]), { q: `In this triangle, which side is the ${big ? 'longest' : 'shortest'}? (Not drawn to scale.)`, visual: triPic(T, { angs: [at('A', `${A}°`), at('B', `${B}°`)] }), steps: [`∠C = 180 − ${A} − ${B} = ${C}°.`, St(`The ${big ? 'largest' : 'smallest'} angle is ∠${key}, and the side opposite it is ${opp[key]}.`, triPic(T, { angs: [at('A', `${A}°`, key === 'A' ? 'hlline' : 'mark'), at('B', `${B}°`, key === 'B' ? 'hlline' : 'mark'), at('C', `${C}°`, key === 'C' ? 'hlline' : 'mark')], segs: [[opp[key][0], opp[key][1], 'hlline']] }))] });
  }
  if (v === 7) {
    const T = [[0, 0], [6, 0], [2, 4]], kind = r.pick(['Median', 'Altitude', 'Angle bisector', 'Perpendicular bisector']);
    const why = { Median: 'It goes from a corner to the middle of the opposite side (the ticks show two equal halves).', Altitude: 'It goes from a corner and meets the opposite side at a right angle.', 'Angle bisector': 'It goes from a corner and splits that angle into two equal angles.', 'Perpendicular bisector': 'It goes through the middle of a side (equal ticks) at a right angle, not necessarily through a corner.' }[kind];
    // the bisector of angle A meets BC where it divides BC in the ratio AB : AC
    const AB = 6, AC = Math.hypot(2, 4), t = AB / (AB + AC), Fb = [6 + (2 - 6) * t, 0 + 4 * t];
    const o = { Median: { P: { M: [3, 0] }, segs: [['C', 'M', 'hlline']], ticks: [['A', 'M', 1], ['M', 'B', 1]] }, Altitude: { P: { H: [2, 0] }, segs: [['C', 'H', 'hlline']], rights: [['H', 'B', 'C']] }, 'Angle bisector': { P: { Fb }, segs: [['A', 'Fb', 'hlline']], angs: [{ v: 'A', a: 'B', b: 'Fb', r: 30 }, { v: 'A', a: 'Fb', b: 'C', r: 34 }] }, 'Perpendicular bisector': { P: { M: [3, 0], U: [3, 3.2], Dn: [3, -0.8] }, segs: [['U', 'Dn', 'hlline']], ticks: [['A', 'M', 1], ['M', 'B', 1]], rights: [['M', 'B', 'U']] } }[kind];
    const pic = triPic(T, { ...o, names: [] });
    return mc(r, kind, ['Median', 'Altitude', 'Angle bisector', 'Perpendicular bisector'].filter((x) => x !== kind), { q: 'What is the highlighted line in this triangle called?', visual: pic, steps: [St(why, pic), `So it is ${/^[AEIOU]/.test(kind) ? 'an' : 'a'} ${kind.toLowerCase()}.`] });
  }
  const a = r.int(30, 90), b = r.int(25, 150 - a), T = GH.triFromAngles(a, b, 4), c = 180 - a - b;
  const pic = (hl) => triPic(T, { angs: [at('A', `${a}°`), at('B', `${b}°`), at('C', hl ? `${c}°` : '?', hl ? 'hlline' : 'mark')] });
  return num(c, [St('The three angles of a triangle add to 180°.'), St(`∠C = 180 − ${a} − ${b} = ${c}.`, pic(true)), `So ∠C = ${c}°.`], { q: 'Find ∠C, in degrees.', visual: pic(false), expr: `180-${a}-${b}` });
});

// ───────────── 29. Similarity ─────────────
const sideLen = (T, i, j) => Math.hypot(T[i][0] - T[j][0], T[i][1] - T[j][1]);
// triangle ADE inside ABC with DE ∥ BC (A at the top)
function nestFig({ t = 0.45, lab = {}, hl = [] }) {
  const A = [2.2, 4], B = [0, 0], C = [6, 0], D = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], E = [A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t];
  return GH.scene({ P: { A, B, C, D, E }, W: 280, H: 220, fills: [{ pts: ['A', 'B', 'C'] }, { pts: ['A', 'D', 'E'], t: hl.includes('small') ? 'hl2' : 'top' }], par: [['D', 'E', 1], ['B', 'C', 1]], segs: hl.filter((x) => x.length === 2).map(([p, q]) => [p, q, 'hlline']), sides: Object.entries(lab).map(([k, s]) => [k[0], k[1], s, hl.includes(k) ? 'hl' : 'ink']), names: ['A', 'B', 'C', 'D', 'E'] });
}
skill('10-simrules', 10, 'Similarity', 'Similar triangle rules', [
  KL('AA: if two pairs of angles are equal, the triangles are similar (the third pair must match too).', twoTri({ T: GH.triFromAngles(60, 45, 4), k: 1.5, turn: 15, arcs: [[0, 1], [1, 2]] })),
  KL('SSS similarity: all three pairs of sides are in the same ratio. SAS similarity: two pairs of sides in the same ratio, with equal angles between them.', twoTri({ T: GH.triFromSides(3, 4, 2), k: 1.5, labels: [[0, 0, 1, '2'], [0, 1, 2, '3'], [0, 2, 0, '4'], [1, 0, 1, '3'], [1, 1, 2, '4.5'], [1, 2, 0, '6']] })),
  KL('Write the similarity in matching order: △ABC ~ △DEF means AB/DE = BC/EF = CA/FD.'),
  KL('A line parallel to one side of a triangle cuts off a smaller similar triangle, and it cuts the other two sides in the same ratio.', nestFig({ lab: { AD: 'a', DB: 'b', AE: 'c', EC: 'd' } })),
], (r) => {
  const v = r.int(0, 7);
  if (v <= 1 || v === 7) {
    const t = v === 7 ? r.pick([1, 3]) : r.int(0, 3), k = r.pick([1.5, 2, 2.5, 3]), [a, b, c] = r.pick([[4, 6, 8], [2, 3, 4], [6, 8, 10], [4, 5, 6], [3, 5, 7]]);
    const A1 = r.int(40, 70), A2 = r.int(40, 70), kd = Math.min(k, 1.7), names = ['AA', 'SSS similarity', 'SAS similarity', 'Not similar'];
    const sc = (T, f) => T.map(([x, y]) => [x * f, y * f]);
    let pic, why;
    if (t === 0) { const T = GH.triFromAngles(A1, A2, 4); pic = twoTri({ T, k: kd, turn: r.pick([0, 20, -20]), angl: [[0, 0, `${A1}°`], [0, 1, `${A2}°`], [1, 0, `${A1}°`], [1, 1, `${A2}°`]] }); why = 'Two pairs of angles are equal.'; }
    else if (t === 1 || t === 3) {
      const ef = t === 3 ? b * k + 1 : b * k, T = sc(GH.triFromSides(b, c, a), 0.5), U = sc(GH.triFromSides(ef, c * k, a * k), 0.5 * kd / k);
      pic = twoTri({ T, T2: U, labels: [[0, 0, 1, `${a}`], [0, 1, 2, `${b}`], [0, 2, 0, `${c}`], [1, 0, 1, dec(a * k)], [1, 1, 2, dec(ef)], [1, 2, 0, dec(c * k)]] });
      why = t === 1 ? `Divide matching sides: ${dec(a * k)} ÷ ${a} = ${dec(b * k)} ÷ ${b} = ${dec(c * k)} ÷ ${c} = ${dec(k)}. All three ratios are equal.` : `${dec(a * k)} ÷ ${a} = ${dec(k)} but ${dec(ef)} ÷ ${b} = ${dec(ef / b, 3)}: the ratios are not equal.`;
    } else { const T = [[0, 0], [a, 0], [c * Math.cos((A1 * Math.PI) / 180), c * Math.sin((A1 * Math.PI) / 180)]].map(([x, y]) => [x / 2, y / 2]); pic = twoTri({ T, k: kd, labels: [[0, 0, 1, `${a}`], [0, 2, 0, `${c}`], [1, 0, 1, dec(a * k)], [1, 2, 0, dec(c * k)]], angl: [[0, 0, `${A1}°`], [1, 0, `${A1}°`]] }); why = `${dec(a * k)} ÷ ${a} = ${dec(c * k)} ÷ ${c} = ${dec(k)}, and the angles between those sides are both ${A1}°.`; }
    const q = v === 7 ? 'Are these two triangles similar? If so, by which rule?' : `Which rule shows that △ABC and △DEF are similar?${kd < k ? ' (Not drawn to scale.)' : ''}`;
    return mc(r, names[t], names.filter((_, i) => i !== t), { q, visual: pic, steps: [St(why, pic), `So the answer is ${names[t]}.`] });
  }
  if (v === 2) {
    const ad = r.int(2, 9), k = r.pick([0.5, 1, 1.5, 2, 3]), db = ad * k, ae = r.int(2, 12) * 2, ec = ae * k, t = 1 / (1 + k);
    const pic = (hl, ans) => nestFig({ t, lab: { AD: `${ad}`, DB: dec(db), AE: `${ae}`, EC: ans ? dec(ec) : '?' }, hl });
    return num(dec(ec), [St('DE ∥ BC, so it cuts AB and AC in the same ratio: AD/DB = AE/EC.', pic(['AD', 'DB'])), `${ad}/${dec(db)} = ${ae}/EC, so EC = ${ae} × ${dec(db)} ÷ ${ad}.`, St(`EC = ${dec(ec)}.`, pic(['AE', 'EC'], true)), `So EC = ${dec(ec)} cm.`], { q: 'DE is parallel to BC. Find EC, in cm. (Not drawn to scale.)', visual: pic([]), expr: `${ae}*${db}/${ad}` });
  }
  if (v === 3) {
    const [t1, t2] = r.pick([['ABC', 'XYZ'], ['PQR', 'LMN'], ['DEF', 'JKL']]), i = r.int(0, 2), j = (i + 1) % 3, k2 = (i + 2) % 3, T = tri(r);
    const right = `${t1[j]}${t1[k2]}/${t2[j]}${t2[k2]}`, N = [...t1, ...t2], pic = (hl) => twoTri({ T, N, k: 1.4, turn: r.pick([0, 180, 40]), arcs: [[0, 1], [1, 2], [2, 3]], hl });
    return mc(r, right, [`${t1[j]}${t1[k2]}/${t2[i]}${t2[j]}`, `${t2[j]}${t2[k2]}/${t1[i]}${t1[j]}`, `${t1[i]}${t1[k2]}/${t2[i]}${t2[j]}`], { q: `△${t1} ~ △${t2}. Which ratio is equal to ${t1[i]}${t1[j]}/${t2[i]}${t2[j]}?`, visual: pic([]), steps: [St(`Match the letters in order: ${t1[0]} ↔ ${t2[0]}, ${t1[1]} ↔ ${t2[1]}, ${t1[2]} ↔ ${t2[2]}. Matching sides join matching corners.`, pic([[0, j, k2], [1, j, k2]])), `Matching sides are in the same ratio, so ${t1[i]}${t1[j]}/${t2[i]}${t2[j]} = ${right}.`] });
  }
  if (v === 4) {
    const ad = r.int(2, 6), k = r.pick([2, 3, 1.5, 2.5]), ab = ad * k, de = r.int(2, 8), bc = de * k;
    const pic = (hl, ans) => nestFig({ t: 1 / k, lab: { AD: `${ad}`, AB: '', DE: `${de}`, BC: ans ? dec(bc) : '?' }, hl });
    return num(dec(bc), [St(`DE ∥ BC, so △ADE ~ △ABC (they share ∠A, and the parallel lines make equal corresponding angles: AA).`, pic(['small'])), `Scale factor: AB ÷ AD = ${dec(ab)} ÷ ${ad} = ${dec(k)}.`, St(`BC = ${de} × ${dec(k)} = ${dec(bc)}.`, pic(['BC'], true)), `So BC = ${dec(bc)} cm.`], { q: `DE is parallel to BC. AD = ${ad} cm, AB = ${dec(ab)} cm and DE = ${de} cm. Find BC, in cm.`, visual: pic([]), expr: `${de}*${ab}/${ad}` });
  }
  if (v === 5) {
    const T = tri(r), k = r.pick([1.5, 2, 2.5, 3]), a = r.int(3, 10), L = Math.round(sideLen(T, 1, 2) / sideLen(T, 0, 1) * a) || 4, kd = Math.min(k, 1.7), turn = r.pick([0, 30, -30]), flip = r.bool();
    const pic = (hl, ans) => twoTri({ T, k: kd, turn, flip, arcs: [[0, 1], [1, 2], [2, 3]], labels: [[0, 0, 1, `${a}`], [0, 1, 2, `${L}`], [1, 0, 1, dec(a * k)], [1, 1, 2, ans ? dec(L * k) : 'x', 'hl']], hl });
    return num(dec(L * k), [St(`The arcs show △ABC ~ △DEF. AB ↔ DE gives the scale factor ${dec(a * k)} ÷ ${a} = ${dec(k)}.`, pic([[0, 0, 1], [1, 0, 1]])), St(`x matches BC: x = ${L} × ${dec(k)} = ${dec(L * k)}.`, pic([[0, 1, 2], [1, 1, 2]], true)), `So x = ${dec(L * k)}.`], { q: `The triangles are similar. Find x.${kd < k ? ' (Not drawn to scale.)' : ''}`, unit: 'x =', visual: pic([]), expr: `${L}*${a * k}/${a}` });
  }
  const [n, d] = r.pick([[3, 2], [2, 1], [5, 2], [4, 3], [1, 2], [2, 3], [3, 4]]), a = d * r.int(2, 5), T = tri(r);
  const pic = twoTri({ T, k: Math.max(0.6, Math.min(1.7, n / d)), arcs: [[0, 1], [1, 2], [2, 3]], labels: [[0, 0, 1, `${a}`], [1, 0, 1, `${(a * n) / d}`]] });
  return num(frac(n, d), [St('The scale factor from △ABC to △DEF is DE ÷ AB (new ÷ old).', pic), `${(a * n) / d} ÷ ${a} = ${frac((a * n) / d, a)}.`, `So the scale factor is ${frac(n, d)}.`], { q: '△ABC ~ △DEF. What is the scale factor from △ABC to △DEF? (A fraction or a decimal.)', visual: pic, expr: `${(a * n) / d}/${a}` });
});
skill('10-simscale', 10, 'Similarity', 'Scale factors, perimeter and area', [
  KL('If similar figures have scale factor k, every length (sides, perimeter) is multiplied by k.', twoTri({ T: GH.triFromAngles(60, 50, 4), k: 1.5, labels: [[0, 0, 1, '4'], [1, 0, 1, '6']] })),
  KL('Areas are multiplied by k²: double the sides and the area is 4 times as big.', { type: 'figs', figs: [G.polygonFig({ pts: [[0, 0], [2, 0], [2, 2], [0, 2]], sides: ['1', '', '', ''], W: 150, H: 140, pad: 45 }), G.polygonFig({ pts: [[0, 0], [2, 0], [2, 2], [0, 2]], sides: ['2', '', '', ''], cuts: [[[1, 0], [1, 2]], [[0, 1], [2, 1]]], W: 150, H: 140, pad: 25 })], captions: ['Area 1', 'Area 4'] }),
  KL('Similar triangles measure tall things: a post and its shadow make the same shape as a tree and its shadow.', GH.shadowFig({ h1: 1.5, s1: 2, h2: 6, s2: 8, labels: ['1.5 m', '2 m', 'h', '8 m'] })),
], (r) => {
  const v = r.int(0, 6), T = tri(r);
  if (v === 0) {
    const k = r.int(2, 4), P = r.int(8, 40), pic = twoTri({ T, k: Math.min(k, 1.7), turn: r.pick([0, 25]), arcs: [[0, 1], [1, 2], [2, 3]], labels: [[0, 0, 1, '1'], [1, 0, 1, `${k}`]] });
    return num(k * P, [St(`Every side of the larger triangle is ${k} times as long, so the perimeter is too.`, pic), `${P} × ${k} = ${k * P}.`, `So the larger perimeter is ${k * P} cm.`], { q: `These similar triangles have a scale factor of ${k} (matching sides 1 and ${k}). The smaller one has a perimeter of ${P} cm. What is the perimeter of the larger one? (Not drawn to scale.)`, visual: pic, expr: `${k}*${P}` });
  }
  if (v === 1 || v === 4) {
    const a = r.int(1, 4), b = a + r.int(1, 3), A = r.int(2, 12) * a * a, B = (A * b * b) / (a * a);
    const pic = twoTri({ T, k: b / a > 1.8 ? 1.8 : b / a, arcs: [[0, 1], [1, 2], [2, 3]], labels: v === 1 ? [[0, 0, 1, `${a} cm`], [1, 0, 1, `${b} cm`]] : [] });
    if (v === 4) return num(frac(b, a), [St(`The areas are in the ratio ${B} : ${A}. Areas grow by k², so k² = ${B}/${A} = ${frac(B, A)}.`, pic), `k = √(${frac(B, A)}) = ${frac(b, a)}.`, `So the scale factor is ${frac(b, a)}.`], { q: `Two similar triangles have areas ${A} cm² and ${B} cm². What is the scale factor from the smaller to the larger? (A fraction or a decimal.)`, visual: pic, expr: `Math.sqrt(${B}/${A})` });
    return num(B, [St(`The side ratio is ${b}/${a}, so the area ratio is (${b}/${a})² = ${b * b}/${a * a}.`, pic), `${A} × ${b * b} ÷ ${a * a} = ${B}.`, `So the larger area is ${B} cm².`], { q: `These similar triangles have matching sides of ${a} cm and ${b} cm. The smaller triangle has an area of ${A} cm². What is the area of the larger one? (Not drawn to scale.)`, visual: pic, expr: `${A}*(${b}/${a})**2` });
  }
  if (v === 2) {
    const h = r.pick([1.5, 1.6, 1.8, 2]), s = r.pick([2, 2.5, 3, 4]), k = r.int(3, 10), H = dec(h * k);
    const pic = (hl, ans) => GH.shadowFig({ h1: h, s1: s, h2: h * k, s2: s * k, labels: [`${h} m`, `${s} m`, ans ? `${H} m` : 'h', `${dec(s * k)} m`], hl });
    return num(H, [St('The sun hits the person and the tree at the same angle, so the triangles are similar: height ÷ shadow is the same.', pic(['h1', 's1'])), `${h}/${s} = h/${dec(s * k)}, so h = ${h} × ${dec(s * k)} ÷ ${s}.`, St(`h = ${H}.`, pic(['h2', 's2'], true)), `So the tree is ${H} m tall.`], { q: 'How tall is the tree, in metres? (Not drawn to scale.)', visual: pic([]), expr: `${h}*${s * k}/${s}` });
  }
  if (v === 3) {
    const ra = r.int(1, 6); let rb = r.int(2, 12); if (rb === ra) rb++;
    const area = r.bool(), ans = area ? frac(rb * rb, ra * ra) : frac(rb, ra);
    const sA = 1, sB = Math.min(3, rb / ra), note = rb / ra > 3 ? ' (Not drawn to scale.)' : '';
    const pic = GH.scene({ P: { Ca: [0, 0], Ea: [sA, 0], Cb: [sA + 0.8 + sB, 0], Eb: [sA + 0.8 + 2 * sB, 0], La: [0, -sA - 0.45], Lb: [sA + 0.8 + sB, -sB - 0.45] }, W: 320, H: 200, pad: 22, circles: [{ c: 'Ca', r: sA, t: 'fig' }, { c: 'Cb', r: sB, t: 'fig' }], segs: [['Ca', 'Ea', 'aux'], ['Cb', 'Eb', 'aux']], dots: ['Ca', 'Cb'], sides: [['Ca', 'Ea', `${ra} cm`, 'ink', [sA / 2, -1]], ['Cb', 'Eb', `${rb} cm`, 'ink', [sA + 0.8 + 1.5 * sB, -1]]], notes: [{ at: [-sA, sA], s: 'A', t: 'muted' }, { at: [sA + 0.8, sB], s: 'B', t: 'muted' }] });
    return num(ans, [St('All circles are similar. The scale factor from A to B is the ratio of the radii.', pic), `k = ${rb}/${ra}${area ? `, and areas grow by k²: (${rb}/${ra})² = ${rb * rb}/${ra * ra}` : ''}.`, `So the ratio is ${ans}.`], { q: `What is the ratio of the ${area ? 'area' : 'circumference'} of circle B to that of circle A? (A fraction or a number.)${note}`, visual: pic, expr: area ? `(${rb}/${ra})**2` : `${rb}/${ra}` });
  }
  if (v === 5) {
    const h = r.pick([1.5, 1.6, 1.8]), d1 = r.int(2, 5), k = r.int(3, 8), d2 = d1 * k, H = dec(h * k);
    const kd = Math.min(k, 3.5), P = { E: [0, h], F: [0, 0], M: [d1, 0], B: [d1 + d1 * kd, 0], T: [d1 + d1 * kd, h * kd] };
    const pic = (hl, ans) => GH.scene({ P, W: 320, H: 200, pad: 30, fills: [{ pts: ['E', 'F', 'M'], t: 'top' }, { pts: ['T', 'B', 'M'], t: 'top' }], segs: [['E', 'M', 'aux'], ['M', 'T', 'aux'], ...(hl ? [['T', 'B', 'hlline']] : [])], rights: [['F', 'E', 'M'], ['B', 'T', 'M']], angs: [{ v: 'M', a: 'E', b: 'F', r: 16 }, { v: 'M', a: 'B', b: 'T', r: 16 }], sides: [['E', 'F', `${h} m`], ['F', 'M', `${d1} m`], ['M', 'B', `${d2} m`], ['T', 'B', ans ? `${H} m` : 'h', hl ? 'hl' : 'ink']], dots: ['M'], names: { M: 'M' }, nameDir: { M: [0, -1] } });
    return num(H, [St('Light bounces off the mirror at equal angles, so the two right triangles are similar (AA).', pic(false)), `Height ÷ distance is the same: ${h} ÷ ${d1} = h ÷ ${d2}, so h = ${h} × ${d2} ÷ ${d1}.`, St(`h = ${H}.`, pic(true, true)), `So the building is ${H} m tall.`], { q: `A person whose eyes are ${h} m above the ground sees the top of a building in a mirror M on the ground. How tall is the building, in metres? (Not drawn to scale.)`, visual: pic(false), expr: `${h}*${d2}/${d1}` });
  }
  const P1 = r.int(4, 10) * 2, k = r.pick([1.5, 2, 2.5, 3]), P2 = P1 * k, s = r.int(2, P1 / 2 - 1);
  const pic = twoTri({ T, k: Math.min(k, 1.7), arcs: [[0, 1], [1, 2], [2, 3]], labels: [[0, 0, 1, `${s} cm`], [1, 0, 1, 'x', 'hl']] });
  return num(dec(s * k), [St(`The perimeters give the scale factor: ${dec(P2)} ÷ ${P1} = ${dec(k)}.`, pic), `x = ${s} × ${dec(k)} = ${dec(s * k)}.`, `So x = ${dec(s * k)} cm.`], { q: `These similar triangles have perimeters ${P1} cm and ${dec(P2)} cm. Find x, in cm. (Not drawn to scale.)`, unit: 'x =', visual: pic, expr: `${s}*${P2}/${P1}` });
});

// ───────────── 30. Right triangles ─────────────
// rt: a right triangle with legs w (across) and h (up); labels across / up / hyp
const rt = (w, h, lab, o = {}) => GH.rightTri({ w, h, noTheta: true, sides: { adj: lab[0], opp: lab[1], hyp: lab[2] }, hl: o.hl, other: o.other, ...(o.theta ? { noTheta: false, thetaLabel: o.theta } : {}), flip: o.flip });
skill('10-righttri', 10, 'Right triangles', 'Pythagorean theorem and special triangles', [
  KL('In a right triangle, a² + b² = c². The hypotenuse c is the longest side, across from the right angle.', rt(4, 3, ['a', 'b', 'c'], { hl: ['hyp'] })),
  KL('If a² + b² = c² (c the longest side), the triangle is right. If a² + b² > c² it is acute; if a² + b² < c² it is obtuse.'),
  KL('45-45-90: the legs are equal and the hypotenuse = leg × √2.', rt(1, 1, ['1', '1', '√2'], { theta: '45°', other: '45°' })),
  KL('30-60-90: hypotenuse = 2 × short leg, long leg = short leg × √3. The short leg is across from the 30° angle.', rt(Math.sqrt(3), 1, ['√3', '1', '2'], { theta: '30°', other: '60°' })),
], (r) => {
  const v = r.int(0, 8);
  if (v === 0) {
    const [a, b, c0] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15]]), c = c0 + r.pick([0, 0, 1, -1]);
    const L = a * a + b * b, R = c * c, right = L === R ? 'Right' : L > R ? 'Acute' : 'Obtuse';
    const pic = G.polygonFig({ pts: GH.triFromSides(a, b, c), sides: [`${c}`, `${a}`, `${b}`] });
    return mc(r, right, ['Right', 'Acute', 'Obtuse'].filter((x) => x !== right), { q: 'Is this triangle right, acute or obtuse? (Not drawn to scale.)', visual: pic, steps: [St(`The longest side is c = ${c}. a² + b² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${L}, and c² = ${R}.`, G.polygonFig({ pts: GH.triFromSides(a, b, c), sides: [`${c}`, `${a}`, `${b}`], hl: [{ side: 0 }] })), `${L} ${L === R ? '=' : L > R ? '>' : '<'} ${R}, so it is ${right.toLowerCase()}.`] });
  }
  const k = r.int(2, 12);
  if (v === 1) return mc(r, `${k}√2`, [`${2 * k}`, `${k}√3`, `${k * 2}√2`], { q: 'How long is the hypotenuse of this 45-45-90 triangle, in cm?', visual: rt(1, 1, [`${k}`, `${k}`, '?'], { theta: '45°', other: '45°' }), steps: [St('In a 45-45-90 triangle, hypotenuse = leg × √2.', rt(1, 1, [`${k}`, `${k}`, `${k}√2`], { theta: '45°', other: '45°', hl: ['hyp'] })), `So the hypotenuse is ${k}√2 cm.`] });
  if (v === 2) return num(k, [St('In a 45-45-90 triangle, hypotenuse = leg × √2, so leg = hypotenuse ÷ √2.', rt(1, 1, ['x', 'x', `${k}√2`], { theta: '45°', other: '45°', hl: ['hyp'] })), `x = ${k}√2 ÷ √2 = ${k}.`, `So each leg is ${k} cm.`], { q: 'In this 45-45-90 triangle, how long is each leg x, in cm?', unit: 'x =', visual: rt(1, 1, ['x', 'x', `${k}√2`], { theta: '45°', other: '45°' }), expr: `${k}*Math.SQRT2/Math.SQRT2` });
  const s3 = Math.sqrt(3), t30 = (lab, hl) => rt(s3, 1, lab, { theta: '30°', other: '60°', hl });
  if (v === 3) return num(2 * k, [St('In a 30-60-90 triangle the short leg is across from 30°, and hypotenuse = 2 × short leg.', t30(['', `${k}`, '?'], ['opp'])), `2 × ${k} = ${2 * k}.`, `So the hypotenuse is ${2 * k} cm.`], { q: 'How long is the hypotenuse of this 30-60-90 triangle, in cm?', visual: t30(['', `${k}`, '?']), expr: `2*${k}` });
  if (v === 4) return mc(r, `${k}√3`, [`${k}√2`, `${2 * k}`, `${2 * k}√3`], { q: 'How long is the side marked ? in this 30-60-90 triangle, in cm?', visual: t30(['?', `${k}`, '']), steps: [St('The long leg is across from 60°. In a 30-60-90 triangle, long leg = short leg × √3.', t30([`${k}√3`, `${k}`, ''], ['adj'])), `So it is ${k}√3 cm.`] });
  if (v === 5) return num(k, [St('The hypotenuse is twice the short leg (across from 30°), so the short leg is half of it.', t30(['', 'x', `${2 * k}`], ['hyp'])), `x = ${2 * k} ÷ 2 = ${k}.`, `So x = ${k} cm.`], { q: 'In this 30-60-90 triangle, find the short leg x, in cm.', unit: 'x =', visual: t30(['', 'x', `${2 * k}`]), expr: `${2 * k}/2` });
  if (v === 6) {
    let a, b; do { a = r.int(2, 15); b = r.int(2, 15); } while (Number.isInteger(Math.hypot(a, b)));
    const c = dec(r1(Math.hypot(a, b))), pic = (hl, ans) => rt(a, b, [`${a} cm`, `${b} cm`, ans ? `≈ ${c} cm` : 'c'], { hl });
    return num(c, [St(`The legs are ${a} and ${b}: a² + b² = ${a * a} + ${b * b} = ${a * a + b * b}.`, pic(['adj', 'opp'])), St(`c = √${a * a + b * b} ≈ ${dec(Math.hypot(a, b), 3)}.`, pic(['hyp'], true)), `Rounded to the nearest tenth: ${c}.`, `So the hypotenuse is about ${c} cm.`], { q: 'Find the hypotenuse c, rounded to the nearest tenth of a cm.', visual: pic([]), tol: 0.05001, expr: `Math.hypot(${a},${b})` });
  }
  if (v === 7) {
    const [p, q, h] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), m = r.int(1, 3), a = p * m, b = q * m, c = h * m, flip = r.bool();
    const pic = (hl, ans) => rt(a, b, [`${a}`, ans ? `${b}` : 'b', `${c}`], { hl, flip });
    return num(b, [St(`The hypotenuse is ${c}, so b² = c² − a² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}.`, pic(['hyp', 'adj'])), St(`b = √${b * b} = ${b}.`, pic(['opp'], true)), `So b = ${b}.`], { q: 'Find the missing leg b.', unit: 'b =', visual: pic([]), expr: `Math.sqrt(${c}**2-${a}**2)` });
  }
  const [p, q, h] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]]);
  const pic = (hl, ans) => GH.rightTri({ w: p, h: q, noTheta: true, flip: true, sides: { adj: `${p} m`, opp: ans ? `${q} m` : '?', hyp: `${h} m` }, hl });
  return num(q, [St(`The ladder is the hypotenuse (${h} m); the ground from the wall is one leg (${p} m).`, pic(['hyp', 'adj'])), St(`height² = ${h}² − ${p}² = ${h * h - p * p}, so height = ${q}.`, pic(['opp'], true)), `The ladder reaches ${q} m up the wall.`], { q: `A ${h} m ladder leans against a wall with its foot ${p} m from the wall. How high up the wall does it reach, in metres?`, visual: pic([]), expr: `Math.sqrt(${h}**2-${p}**2)` });
});

// ───────────── 31. Trigonometry ─────────────
const RAD = Math.PI / 180;
const ROLE = { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' };
const FUN = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] };
const SOH = { sin: 'SOH: sin = opposite ÷ hypotenuse', cos: 'CAH: cos = adjacent ÷ hypotenuse', tan: 'TOA: tan = opposite ÷ adjacent' };
// a trig triangle: real side lengths opp, adj (for the shape); labels; roles shown
const trig = (opp, adj, sides, o = {}) => GH.rightTri({ w: o.theta === 'A' ? opp : adj, h: o.theta === 'A' ? adj : opp, theta: o.theta ?? 'B', flip: o.flip, sides, roles: o.roles ?? true, hl: o.hl, thetaLabel: o.thetaLabel });
skill('10-trigangle', 10, 'Trigonometry', 'Find angles and solve problems', [
  KL('Name the sides from the angle θ: the hypotenuse is across from the right angle, the opposite side is across from θ, and the adjacent side is next to θ.', trig(3, 4, {}, { roles: true })),
  KL('SOH CAH TOA: sin θ = opposite ÷ hypotenuse, cos θ = adjacent ÷ hypotenuse, tan θ = opposite ÷ adjacent.', trig(3, 4, { opp: '3', adj: '4', hyp: '5' }, { hl: ['opp', 'adj'] })),
  KL('To find a side, write the ratio with the side you want and the one you know, then solve. To find an angle, use the inverse: θ = tan⁻¹(opposite ÷ adjacent), and the same for sin⁻¹ and cos⁻¹.'),
  KL('csc = 1/sin = hyp/opp, sec = 1/cos = hyp/adj, cot = 1/tan = adj/opp.'),
], (r) => {
  const v = r.int(0, 8), flip = r.bool(), th = r.pick(['B', 'A']);
  if (v === 0) {
    const f = r.pick(['tan', 'sin', 'cos']), o = r.int(2, 12), x = f === 'tan' ? r.int(2, 12) : o + r.int(1, 10);
    const ang = Math[`a${f}`](o / x) / RAD, ans = Math.round(ang), [s1, s2] = FUN[f];
    const real = f === 'tan' ? [o, x] : f === 'sin' ? [o, Math.sqrt(x * x - o * o)] : [Math.sqrt(x * x - o * o), o];
    const sides = { [s1]: `${o}`, [s2]: `${x}` };
    return num(ans, [St(`From θ, the side marked ${o} is the ${ROLE[s1]} and the side marked ${x} is the ${ROLE[s2]}. ${SOH[f]}.`, trig(real[0], real[1], sides, { flip, theta: th, hl: [s1, s2] })), `${f} θ = ${o}/${x}, so θ = ${f}⁻¹(${o}/${x}) ≈ ${dec(ang, 2)}°.`, `Rounded to the nearest degree: ${ans}°.`, `So θ is about ${ans}°.`], { q: 'Find the angle θ, to the nearest degree.', visual: trig(real[0], real[1], sides, { flip, theta: th, roles: false }), tol: 0.5001, expr: `Math.a${f}(${o}/${x})*180/Math.PI` });
  }
  const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [4, 3, 5], [12, 5, 13]]);
  if (v === 1) {
    const f = r.pick(['csc', 'sec', 'cot']), val = f === 'csc' ? frac(c, a) : f === 'sec' ? frac(c, b) : frac(b, a), uses = { csc: ['hyp', 'opp'], sec: ['hyp', 'adj'], cot: ['adj', 'opp'] }[f];
    const sides = { opp: `${a}`, adj: `${b}`, hyp: `${c}` };
    return num(val, [St(`${f} θ = ${ROLE[uses[0]]} ÷ ${ROLE[uses[1]]}.`, trig(a, b, sides, { flip, theta: th, hl: uses })), `= ${f === 'csc' ? `${c}/${a}` : f === 'sec' ? `${c}/${b}` : `${b}/${a}`}.`, `So ${f} θ = ${val}.`], { q: `What is ${f} θ for this triangle?`, visual: trig(a, b, sides, { flip, theta: th, roles: false }), expr: f === 'csc' ? `${c}/${a}` : f === 'sec' ? `${c}/${b}` : `${b}/${a}` });
  }
  if (v === 2) {
    const d = r.int(10, 60), t = r.int(20, 65), h = d * Math.tan(t * RAD), ans = dec(r1(h));
    const pic = (hl, an) => GH.rightTri({ w: 1.6, h: Math.tan(t * RAD) * 1.6, sides: { adj: `${d} m`, opp: an ? `≈ ${ans} m` : 'h' }, thetaLabel: `${t}°`, hl, roles: !!hl.length });
    return num(ans, [St(`The height is opposite the ${t}° angle and the distance along the ground is adjacent. TOA: tan ${t}° = h ÷ ${d}.`, pic(['opp', 'adj'])), `h = ${d} × tan ${t}° ≈ ${d} × ${dec(Math.tan(t * RAD), 4)} ≈ ${dec(h, 3)}.`, St(`Rounded to the nearest tenth: ${ans}.`, pic(['opp'], true)), `So the building is about ${ans} m tall.`], { q: `From a point ${d} m from the base of a building, the angle of elevation to the top is ${t}°. How tall is the building h, to the nearest tenth of a metre?`, visual: pic([]), tol: 0.05001, expr: `${d}*Math.tan(${t}*Math.PI/180)` });
  }
  if (v === 3) {
    const L = r.int(3, 10), t = r.int(55, 80), h = L * Math.sin(t * RAD), ans = dec(r1(h));
    const pic = (hl, an) => GH.rightTri({ w: Math.cos(t * RAD), h: Math.sin(t * RAD), flip: true, sides: { hyp: `${L} m`, opp: an ? `≈ ${ans} m` : 'h' }, thetaLabel: `${t}°`, hl, roles: !!hl.length });
    return num(ans, [St(`The ladder is the hypotenuse and the height is opposite the ${t}° angle. SOH: sin ${t}° = h ÷ ${L}.`, pic(['opp', 'hyp'])), `h = ${L} × sin ${t}° ≈ ${dec(h, 3)}.`, St(`Rounded to the nearest tenth: ${ans}.`, pic(['opp'], true)), `So the ladder reaches about ${ans} m up the wall.`], { q: `A ${L} m ladder leans against a wall, making an angle of ${t}° with the ground. How high up the wall does it reach, to the nearest tenth of a metre?`, visual: pic([]), tol: 0.05001, expr: `${L}*Math.sin(${t}*Math.PI/180)` });
  }
  if (v === 4) {
    const f = r.pick(['sin', 'cos', 'tan']), t = r.int(5, 85), val = Math[f](t * RAD), ans = dec(Math.round(val * 1000) / 1000);
    return num(ans, ['Make sure the calculator is in degree mode.', `${f} ${t}° ≈ ${dec(val, 6)}.`, `Rounded to the nearest thousandth: ${ans}.`, `So ${f} ${t}° ≈ ${ans}.`], { q: `Use a calculator: what is ${f} ${t}°, to the nearest thousandth?`, tol: 0.0005001, expr: `Math.${f}(${t}*Math.PI/180)` });
  }
  if (v === 5) {
    const t = r.int(20, 70), known = r.pick(['hyp', 'adj', 'opp']), L = r.int(4, 25), want = r.pick(['hyp', 'adj', 'opp'].filter((s) => s !== known));
    const f = [known, want].includes('hyp') ? ([known, want].includes('opp') ? 'sin' : 'cos') : 'tan', [top, bot] = FUN[f];
    const val = Math[f](t * RAD), x = want === top ? L * val : L / val, ans = dec(r1(x));
    if (x > 200) return list.find((s) => s.id === 'math-10-trigangle').gen(r);
    const sides = { [known]: `${L}`, [want]: 'x' }, real = { opp: Math.sin(t * RAD), adj: Math.cos(t * RAD) };
    const pic = (hl, ro) => trig(real.opp, real.adj, sides, { flip, theta: th, thetaLabel: `${t}°`, hl, roles: ro });
    return num(ans, [St(`From the ${t}° angle, x is the ${ROLE[want]} and ${L} is the ${ROLE[known]}. ${SOH[f]}.`, pic([known, want], true)), want === top ? `${f} ${t}° = x ÷ ${L}, so x = ${L} × ${f} ${t}° ≈ ${L} × ${dec(val, 4)} = ${dec(x, 3)}.` : `${f} ${t}° = ${L} ÷ x, so x = ${L} ÷ ${f} ${t}° ≈ ${L} ÷ ${dec(val, 4)} = ${dec(x, 3)}.`, `Rounded to the nearest tenth: ${ans}.`, `So x ≈ ${ans}.`], { q: 'Find x, to the nearest tenth.', unit: 'x =', visual: pic([], false), tol: 0.05001, expr: want === top ? `${L}*Math.${f}(${t}*Math.PI/180)` : `${L}/Math.${f}(${t}*Math.PI/180)` });
  }
  if (v === 6) {
    const f = r.pick(['sin', 'cos', 'tan']), [top, bot] = FUN[f], vals = { opp: a, adj: b, hyp: c }, val = frac(vals[top], vals[bot]);
    const sides = { opp: `${a}`, adj: `${b}`, hyp: `${c}` };
    return num(val, [St(`${SOH[f]}. From θ: the ${ROLE[top]} is ${vals[top]} and the ${ROLE[bot]} is ${vals[bot]}.`, trig(a, b, sides, { flip, theta: th, hl: [top, bot] })), `${f} θ = ${vals[top]}/${vals[bot]}.`, `So ${f} θ = ${val}.`], { q: `What is ${f} θ? Give a fraction.`, visual: trig(a, b, sides, { flip, theta: th, roles: false }), expr: `${vals[top]}/${vals[bot]}` });
  }
  const f = r.pick(['sin', 'cos', 'tan']), [top, bot] = FUN[f], t = r.int(25, 65);
  const sides = { [top]: top === 'opp' ? 'x' : '12', [bot]: bot === 'hyp' ? '12' : top === 'opp' ? '12' : 'x' };
  if (f === 'cos') { sides.adj = 'x'; sides.hyp = '12'; }
  const real = { opp: Math.sin(t * RAD), adj: Math.cos(t * RAD) };
  return mc(r, f, ['sin', 'cos', 'tan'].filter((x) => x !== f), { q: `To find x from the ${t}° angle, which ratio should you use?`, visual: trig(real.opp, real.adj, sides, { flip, theta: th, thetaLabel: `${t}°`, roles: false }), steps: [St(`From the ${t}° angle, the two sides used are the ${ROLE[top]} and the ${ROLE[bot]}.`, trig(real.opp, real.adj, sides, { flip, theta: th, thetaLabel: `${t}°`, hl: [top, bot] })), `${SOH[f]}, so use ${f}.`] });
});

// ───────────── 32. Transformations ─────────────
const W6 = { x0: -7, x1: 7, y0: -7, y1: 7 };
const tri3 = (r, lo = -5, hi = 5) => { let A; do { A = []; while (A.length < 3) { const p = [r.int(lo, hi), r.int(lo, hi)]; if ((p[0] || p[1]) && !A.some((q) => q[0] === p[0] && q[1] === p[1])) A.push(p); } } while ((A[0][0] - A[1][0]) * (A[2][1] - A[1][1]) === (A[0][1] - A[1][1]) * (A[2][0] - A[1][0])); return A; };
const imgPic = (A, B, o = {}) => GH.gridFig({ ...(o.win ?? gw([...A, ...B], 1, 5)), polys: [{ pts: B, t: 'hl2' }, { pts: A }], pts: (o.names ?? ['A', 'B', 'C']).map((n, i) => [A[i][0], A[i][1], n]).concat(o.primes === false ? [] : (o.names ?? ['A', 'B', 'C']).map((n, i) => [B[i][0], B[i][1], `${n}′`, 'hl2'])), segs: o.segs, arrows: o.arrows, rights: o.rights });
const REF = [['the x-axis', (p, q) => [p, -q], 'The x-coordinate stays; the y-coordinate changes sign.', [[-7, 0], [7, 0]]], ['the y-axis', (p, q) => [-p, q], 'The y-coordinate stays; the x-coordinate changes sign.', [[0, -7], [0, 7]]], ['the line y = x', (p, q) => [q, p], 'Swap the coordinates.', [[-7, -7], [7, 7]]], ['the line y = −x', (p, q) => [-q, -p], 'Swap the coordinates and change both signs.', [[-7, 7], [7, -7]]]];
skill('10-translate', 10, 'Transformations', 'Translations and reflections', [
  KL('A translation slides every point the same way: (x, y) → (x + a, y + b).', imgPic([[-4, -1], [-1, -1], [-3, 2]], [[1, 1], [4, 1], [2, 4]], { arrows: [[[-3, 2], [2, 4], 'aux']], primes: false })),
  KL('A reflection flips over a mirror line. Each point and its image are the same distance from the line, on opposite sides.', imgPic([[1, 1], [4, 1], [2, 4]], [[-1, 1], [-4, 1], [-2, 4]], { segs: [[[0, -2], [0, 6], 'hlline']], primes: false })),
  KL('In the x-axis: (x, −y). In the y-axis: (−x, y). In y = x: (y, x). In y = −x: (−y, −x).', GH.gridFig({ ...W6, pts: [[4, 1, 'P'], [1, 4, 'P′', 'hl']], segs: [[[-7, -7], [7, 7], 'hlline'], [[4, 1], [1, 4], 'aux']] })),
], (r) => {
  const v = r.int(0, 6), x = r.int(-5, 5), y = r.int(-5, 5);
  let a, b; do { a = r.nonzero(-5, 5); b = r.nonzero(-5, 5); } while (Math.abs(x + a) > 7 || Math.abs(y + b) > 7);
  const words = (dx, dy) => `${Math.abs(dx)} unit${Math.abs(dx) === 1 ? '' : 's'} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} unit${Math.abs(dy) === 1 ? '' : 's'} ${dy > 0 ? 'up' : 'down'}`;
  if (v === 0) return ptItem(x + a, y + b, [`Moving ${words(a, b)} adds ${neg(a)} to x and ${neg(b)} to y.`, St(`x: ${neg(x)} ${sgn(a)} = ${neg(x + a)}; y: ${neg(y)} ${sgn(b)} = ${neg(y + b)}.`, GH.gridFig({ ...W6, pts: [[x, y, 'A'], [x + a, y + b, 'A′', 'hl']], segs: [[[x, y], [x + a, y], 'hlline'], [[x + a, y], [x + a, y + b], 'hlline']] })), `So the image is ${P(x + a, y + b)}.`], { q: `Point A${P(x, y)} is translated ${words(a, b)}. What are the coordinates of the image A′? Write them as (x, y).`, visual: GH.gridFig({ ...W6, pts: [[x, y, 'A']] }) });
  if (v === 1) { const [nm, f, why, ln] = r.pick(REF), [x2, y2] = f(x, y); return ptItem(x2 + 0, y2 + 0, [St(why), St(`${P(x, y)} becomes ${P(x2 + 0, y2 + 0)}: the same distance from the mirror, on the other side.`, GH.gridFig({ ...W6, pts: [[x, y, 'B'], [x2, y2, 'B′', 'hl']], segs: [[...ln, 'hlline'], [[x, y], [x2, y2], 'aux']] })), `So the image is ${P(x2 + 0, y2 + 0)}.`], { q: `Point B${P(x, y)} is reflected in ${nm}. What are the coordinates of the image? Write them as (x, y).`, visual: GH.gridFig({ ...W6, pts: [[x, y, 'B']], segs: [[...ln, 'hidden']] }) }); }
  if (v === 2) {
    const rule = (p, q) => `(x, y) → (${lin([[1, 'x'], [p, '']])}, ${lin([[1, 'y'], [q, '']])})`;
    const pic = (ar) => GH.gridFig({ ...W6, pts: [[x, y, 'A'], [x + a, y + b, 'A′', 'hl2']], arrows: ar ? [[[x, y], [x + a, y + b], 'aux']] : [] });
    return mc(r, rule(a, b), [rule(-a, -b), rule(b, a), rule(a, -b)].filter((t) => t !== rule(a, b)), { q: 'A translation maps A to A′. Which rule describes it?', visual: pic(false), steps: [St(`x changes by ${neg(x + a)} − ${par(x)} = ${neg(a)}; y changes by ${neg(y + b)} − ${par(y)} = ${neg(b)}.`, pic(true)), `So the rule is ${rule(a, b)}.`] });
  }
  if (v === 3) {
    const [nm, f, , ln] = r.pick(REF.slice(0, 2)), [x2, y2] = f(x + a, y + b);
    return ptItem(x2 + 0, y2 + 0, [St(`First translate: ${P(x, y)} → ${P(x + a, y + b)}.`, GH.gridFig({ ...W6, pts: [[x, y, 'C'], [x + a, y + b, 'C′']], arrows: [[[x, y], [x + a, y + b], 'aux']] })), St(`Then reflect in ${nm}: ${P(x + a, y + b)} → ${P(x2 + 0, y2 + 0)}.`, GH.gridFig({ ...W6, pts: [[x + a, y + b, 'C′'], [x2, y2, 'C″', 'hl']], segs: [[...ln, 'hlline'], [[x + a, y + b], [x2, y2], 'aux']] })), `So the final image is ${P(x2 + 0, y2 + 0)}.`], { q: `Point C${P(x, y)} is translated ${words(a, b)}, then reflected in ${nm}. Where does it end up? Write it as (x, y).`, visual: GH.gridFig({ ...W6, pts: [[x, y, 'C']] }) });
  }
  if (v === 4) {
    const A = tri3(r, -4, 3), dx = r.nonzero(-3, 3), dy = r.nonzero(-3, 3), B = A.map(([p, q]) => [p + dx, q + dy]), i = r.int(0, 2), L = 'ABC'[i];
    return ptItem(B[i][0], B[i][1], [`The rule adds ${neg(dx)} to every x and ${neg(dy)} to every y.`, St(`${L}${P(...A[i])} → ${L}′${P(...B[i])}.`, imgPic(A, B, { arrows: [[A[i], B[i], 'aux']] })), `So ${L}′ = ${P(...B[i])}.`], { q: `Triangle ABC is translated by (x, y) → (${lin([[1, 'x'], [dx, '']])}, ${lin([[1, 'y'], [dy, '']])}). Where does ${L} go? Write it as (x, y).`, visual: GH.gridFig({ ...gw([...A, ...B]), polys: [{ pts: A }], pts: A.map((p, k) => [p[0], p[1], 'ABC'[k]]) }) });
  }
  if (v === 5) {
    let A, k, B; do { A = tri3(r, -5, 5); k = r.int(0, 3); B = A.map(([p, q]) => REF[k][1](p, q)); } while (B.some((p, j) => p[0] === A[j][0] && p[1] === A[j][1]));
    const right = `In ${REF[k][0]}`;
    return mc(r, right, REF.filter((_, j) => j !== k).map((x) => `In ${x[0]}`), { q: 'The green triangle is the reflection of the blue one. In which line was it reflected?', visual: imgPic(A, B, { win: W6 }), steps: [St(`Compare A with A′: ${P(...A[0])} → ${P(...B[0])}. ${REF[k][2]}`, imgPic(A, B, { win: W6, segs: [[...REF[k][3], 'hlline']] })), `So it was reflected ${right.toLowerCase()}.`] });
  }
  const m = r.nonzero(-3, 3), x0 = r.int(-6, 6), y0 = r.int(-5, 5), x2 = 2 * m - x0;
  if (Math.abs(x2) > 9 || x0 === m) return list.find((s) => s.id === 'math-10-translate').gen(r);
  const w = gw([[x0, y0], [x2, y0], [m, 0]]);
  return ptItem(x2, y0, [St(`P is ${Math.abs(x0 - m)} units ${x0 > m ? 'right' : 'left'} of the line x = ${neg(m)}. Its image is the same distance on the other side.`, GH.gridFig({ ...w, pts: [[x0, y0, 'P'], [x2, y0, 'P′', 'hl']], segs: [[[m, w.y0], [m, w.y1], 'hlline'], [[x0, y0], [x2, y0], 'aux']] })), `x = ${neg(m)} ${x0 > m ? '−' : '+'} ${Math.abs(x0 - m)} = ${neg(x2)}; y stays ${neg(y0)}.`, `So P′ = ${P(x2, y0)}.`], { q: `Point P${P(x0, y0)} is reflected in the vertical line x = ${neg(m)}. Where is its image? Write it as (x, y).`, visual: GH.gridFig({ ...w, pts: [[x0, y0, 'P']], segs: [[[m, w.y0], [m, w.y1], 'hidden']] }) });
});
const ROT = [['90° anticlockwise', (p, q) => [-q, p], '(x, y) → (−y, x)'], ['180°', (p, q) => [-p, -q], '(x, y) → (−x, −y)'], ['90° clockwise', (p, q) => [q, -p], '(x, y) → (y, −x)']];
skill('10-rotate', 10, 'Transformations', 'Rotations and symmetry', [
  KL('A rotation turns every point about a centre by the same angle. About the origin: 90° anticlockwise (x, y) → (−y, x); 180° (x, y) → (−x, −y); 90° clockwise (x, y) → (y, −x).', GH.gridFig({ x0: -5, x1: 5, y0: -2, y1: 5, pts: [[4, 1, 'P'], [-1, 4, 'P′', 'hl']], segs: [[[0, 0], [4, 1], 'aux'], [[0, 0], [-1, 4], 'aux']], rights: [[[0, 0], [4, 1], [-1, 4]]] })),
  KL('A shape has rotational symmetry if a turn of less than 360° fits it onto itself. A regular n-gon fits after 360° ÷ n.', G.polygonFig({ pts: G.regular(6), ticks: Array(6).fill(1), notes: [{ at: [0, 0], s: '60°', t: 'hl' }] })),
  KL('Translations, reflections and rotations keep size and shape: they are congruence transformations. Dilations change the size.'),
], (r) => {
  const v = r.int(0, 6), x = r.nonzero(-5, 5), y = r.nonzero(-5, 5);
  if (v === 0) {
    const [nm, f, rule] = r.pick(ROT), [x2, y2] = f(x, y);
    return ptItem(x2 + 0, y2 + 0, [St(`A rotation of ${nm} about the origin follows ${rule}.`), St(`${P(x, y)} → ${P(x2 + 0, y2 + 0)}. The segment from the origin turns ${nm === '180°' ? 'half a turn' : 'a quarter turn'}.`, GH.gridFig({ ...W6, pts: [[x, y, 'D'], [x2, y2, 'D′', 'hl']], segs: [[[0, 0], [x, y], 'aux'], [[0, 0], [x2, y2], 'aux']], rights: nm === '180°' ? [] : [[[0, 0], [x, y], [x2, y2]]] })), `So the image is ${P(x2 + 0, y2 + 0)}.`], { q: `Point D${P(x, y)} is rotated ${nm} about the origin. What are the coordinates of the image? Write them as (x, y).`, visual: GH.gridFig({ ...W6, pts: [[x, y, 'D']] }) });
  }
  if (v === 1 || v === 2) {
    const n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]), pic = G.polygonFig({ pts: G.regular(n), ticks: Array(n).fill(1) });
    if (v === 1) return num(360 / n, [St(`A regular polygon with ${n} sides fits onto itself after turning 1/${n} of a full turn.`, pic), `360 ÷ ${n} = ${360 / n}.`, `So the smallest angle is ${360 / n}°.`], { q: `What is the smallest angle of rotation (more than 0°) that carries this regular ${n}-sided polygon onto itself, in degrees?`, visual: pic, expr: `360/${n}` });
    const R = G.regular(n), mid = (i) => [(R[i][0] + R[(i + 1) % n][0]) / 2, (R[i][1] + R[(i + 1) % n][1]) / 2];
    const cuts = []; for (let i = 0; i < n; i++) { const p = n % 2 ? [R[i], mid((i + (n - 1) / 2) % n)] : i < n / 2 ? [R[i], R[i + n / 2]] : [mid(i - n / 2), mid(i)]; cuts.push(p); }
    return num(n, [St(`Each fold line goes through a corner or the middle of a side, and through the centre. There is one for each side.`, G.polygonFig({ pts: R, ticks: Array(n).fill(1), cuts })), `It has ${n} sides.`, `So it has ${n} lines of symmetry.`], { q: `How many lines of symmetry does this regular ${n}-sided polygon have?`, visual: pic, expr: String(n) });
  }
  if (v === 3) {
    const M = [['(x, y) → (−x, y)', 'Reflection', 'Only the sign of x changes: a reflection in the y-axis.'], ['(x, y) → (x, −y)', 'Reflection', 'Only the sign of y changes: a reflection in the x-axis.'], ['(x, y) → (−y, x)', 'Rotation', 'This is a 90° anticlockwise rotation about the origin.'], ['(x, y) → (−x, −y)', 'Rotation', 'Both signs change: a 180° rotation about the origin.'], ['(x, y) → (x + 4, y − 1)', 'Translation', 'Every point slides 4 right and 1 down.'], ['(x, y) → (3x, 3y)', 'Dilation', 'Every coordinate is multiplied by 3: a dilation (not a congruence transformation).']];
    const [rule, right, why] = r.pick(M);
    return mc(r, right, ['Translation', 'Reflection', 'Rotation', 'Dilation'].filter((t) => t !== right), { q: `Which kind of transformation is ${rule}?`, steps: [why, `So it is a ${right.toLowerCase()}.`] });
  }
  if (v === 4) {
    const a = r.int(-3, 3), b = r.int(-3, 3), x2 = 2 * a - x, y2 = 2 * b - y, w = gw([[x, y], [x2, y2]]);
    return ptItem(x2, y2, [St(`A 180° turn about ${P(a, b)} sends each point straight through the centre to the other side, the same distance away.`, GH.gridFig({ ...w, pts: [[x, y, 'E'], [a, b, 'C'], [x2, y2, 'E′', 'hl']], segs: [[[x, y], [x2, y2], 'aux']] })), `x: 2 × ${par(a)} − ${par(x)} = ${neg(x2)}; y: 2 × ${par(b)} − ${par(y)} = ${neg(y2)}.`, `So the image is ${P(x2, y2)}.`], { q: `Point E${P(x, y)} is rotated 180° about the point C${P(a, b)}. Where does it go? Write it as (x, y).`, visual: GH.gridFig({ ...w, pts: [[x, y, 'E'], [a, b, 'C']] }) });
  }
  if (v === 5) {
    const k = r.int(0, 2), A = tri3(r, -5, 5), B = A.map(([p, q]) => ROT[k][1](p, q)), right = ROT[k][0];
    return mc(r, right, ROT.filter((_, j) => j !== k).map((t) => t[0]).concat(['A reflection in the y-axis']), { q: 'The green triangle is the blue one rotated about the origin. Through which angle, and which way?', visual: imgPic(A, B), steps: [St(`Follow A: ${P(...A[0])} → ${P(...B[0])}. ${ROT[k][2]} fits every corner.`, imgPic(A, B, { segs: [[[0, 0], A[0], 'aux'], [[0, 0], B[0], 'aux']] })), `So it is a rotation of ${right}.`] });
  }
  const S = r.pick([['a rectangle (not a square)', [[0, 0], [6, 0], [6, 3.5], [0, 3.5]], 2], ['a square', [[0, 0], [4, 0], [4, 4], [0, 4]], 4], ['an equilateral triangle', G.regular(3), 3], ['a regular hexagon', G.regular(6), 6], ['a parallelogram (not a rectangle)', [[0, 0], [5, 0], [6.5, 3], [1.5, 3]], 2], ['a regular pentagon', G.regular(5), 5]]);
  const pic = G.polygonFig({ pts: S[1] });
  return num(S[2], [St(`Turn ${S[0]} about its centre and count how many times it fits onto itself in one full turn (360°).`, pic), `It fits every ${360 / S[2]}°: 360 ÷ ${360 / S[2]} = ${S[2]} times.`, `So its order of rotational symmetry is ${S[2]}.`], { q: `What is the order of rotational symmetry of ${S[0]} (how many times it fits onto itself in one full turn)?`, visual: pic, expr: String(S[2]) });
});
skill('10-dilate', 10, 'Transformations', 'Dilations', [
  KL('A dilation about the origin with scale factor k sends (x, y) to (kx, ky). Each image point is on the line from the centre through the point.', GH.gridFig({ x0: -1, x1: 7, y0: -1, y1: 7, polys: [{ pts: [[2, 2], [6, 2], [2, 6]], t: 'hl2' }, { pts: [[1, 1], [3, 1], [1, 3]] }], segs: [[[0, 0], [6, 2], 'aux'], [[0, 0], [2, 6], 'aux']] })),
  KL('If k > 1 the figure gets bigger; if 0 < k < 1 it gets smaller. Every length is multiplied by k, so k = image length ÷ original length.'),
  KL('Angles stay the same and lines stay parallel to their images, so the image is similar to the original. Areas are multiplied by k².'),
], (r) => {
  const v = r.int(0, 7);
  if (v === 0) {
    const k = r.pick([2, 3, 0.5, 1.5]), x = r.int(-3, 3) * 2, y = r.nonzero(-3, 3) * 2, x2 = k * x, y2 = k * y, w = gw([[x, y], [x2, y2]]);
    return ptItem(x2, y2, [`Multiply both coordinates by ${k}.`, St(`${neg(x)} × ${k} = ${neg(x2)} and ${neg(y)} × ${k} = ${neg(y2)}. F′ is on the line from the origin through F.`, GH.gridFig({ ...w, pts: [[x, y, 'F'], [x2, y2, 'F′', 'hl']], segs: [[[0, 0], k > 1 ? [x2, y2] : [x, y], 'aux']] })), `So the image is ${P(x2, y2)}.`], { q: `Point F${P(x, y)} is dilated by a scale factor of ${k} about the origin. What are the coordinates of the image? Write them as (x, y).`, visual: GH.gridFig({ ...w, pts: [[x, y, 'F']] }) });
  }
  if (v === 1) {
    const [n, d] = r.pick([[2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [5, 2], [4, 1]]), x = r.nonzero(-3, 3) * d, y = r.int(-3, 3) * d, X = (x * n) / d, Y = (y * n) / d, w = gw([[x, y], [X, Y]]);
    return num(frac(n, d), [St(`Compare the x-coordinates: ${neg(X)} ÷ ${par(x)}.`, GH.gridFig({ ...w, pts: [[x, y, 'G'], [X, Y, 'G′', 'hl']], segs: [[[0, 0], n > d ? [X, Y] : [x, y], 'aux']] })), `= ${F(n, d)}.`, `So the scale factor is ${F(n, d)}.`], { q: `A dilation about the origin maps G${P(x, y)} to G′${P(X, Y)}. What is the scale factor?`, visual: GH.gridFig({ ...w, pts: [[x, y, 'G'], [X, Y, 'G′']] }), expr: `${X}/(${x})` });
  }
  if (v === 2) {
    const L = r.int(2, 15), k = r.pick([2, 3, 4, 0.5, 1.5, 2.5]), ans = dec(L * k);
    const pic = GH.scene({ P: { A: [0, 1], B: [3, 1], C: [0, 0], Dd: [3 * Math.min(k, 2.6), 0] }, W: 300, H: 120, pad: 26, segs: [['A', 'B'], ['C', 'Dd', 'hlline']], dots: ['A', 'B', 'C', 'Dd'], sides: [['A', 'B', `${L} cm`, 'ink', [1.5, 0]], ['C', 'Dd', '?', 'hl', [1.5, 1]]] });
    return num(ans, [St('A dilation multiplies every length by the scale factor.', pic), `${L} × ${k} = ${ans}.`, `So the image is ${ans} cm long.`], { q: `A segment ${L} cm long is dilated by a scale factor of ${k}. How long is the image?`, visual: pic, expr: `${L}*${k}` });
  }
  if (v === 3) {
    const k = r.pick([0.25, 0.5, 0.75, 1.5, 2, 3]), right = k > 1 ? 'An enlargement' : 'A reduction';
    return mc(r, right, [k > 1 ? 'A reduction' : 'An enlargement', 'A congruent copy'], { q: `A dilation has scale factor ${k}. Is the image an enlargement, a reduction, or a congruent copy?`, steps: [`The scale factor is ${k > 1 ? 'greater than 1' : 'between 0 and 1'}.`, `So the image is ${right.toLowerCase()}.`] });
  }
  if (v === 4) {
    const pic = GH.gridFig({ x0: -1, x1: 7, y0: -1, y1: 7, segs: [[[0, 3], [3, 0], 'ink'], [[0, 6], [6, 0], 'hlline'], [[0, 0], [3, 3], 'aux']], pts: [[0, 0, 'O']] });
    return mc(r, 'A line parallel to the original line', ['A line perpendicular to the original line', 'A line through the centre of dilation', 'A curve'], { q: 'A line that does not pass through the centre of dilation is dilated with scale factor 2. What is its image?', steps: [St('A dilation keeps the direction of lines; only lines through the centre map onto themselves. Here the blue line becomes the pink one.', pic), 'So the image is a line parallel to the original.'] });
  }
  if (v === 5) {
    const k = r.pick([2, 3, 0.5]), sx = r.pick([1, -1]), sy = r.pick([1, -1]), base = (k === 0.5 ? r.pick([[[2, 2], [6, 2], [2, 4]], [[2, 2], [4, 2], [4, 6]]]) : r.pick([[[1, 1], [2, 1], [1, 2]], [[1, 1], [3, 1], [1, 2]], [[1, 1], [2, 1], [2, 2]]])).map(([p, q]) => [sx * p, sy * q]);
    const img = base.map(([p, q]) => [p * k, q * k]), a = Math.abs(base[1][0] - base[0][0]);
    return num(dec(k), [St(`Compare a matching pair of sides: AB is ${a} units long and A′B′ is ${dec(a * k)} units long.`, imgPic(base, img, { segs: [[base[0], base[1], 'hlline'], [img[0], img[1], 'hlline']] })), `k = ${dec(a * k)} ÷ ${a} = ${dec(k)}.`, `So the scale factor is ${dec(k)}.`], { q: 'The green triangle is a dilation of the blue triangle about the origin. What is the scale factor?', visual: imgPic(base, img), expr: `${a * k}/${a}` });
  }
  if (v === 6) {
    const k = r.pick([2, 3]), c = [r.int(-3, 2), r.int(-3, 2)], d = [r.nonzero(-2, 2), r.nonzero(-2, 2)], p = [c[0] + d[0], c[1] + d[1]], q = [c[0] + k * d[0], c[1] + k * d[1]], w = gw([c, p, q]);
    return ptItem(q[0], q[1], [St(`From the centre C to H: across ${neg(d[0])}, up ${neg(d[1])}.`, GH.gridFig({ ...w, pts: [[...c, 'C'], [...p, 'H']], arrows: [[c, p, 'aux']] })), St(`Multiply that step by ${k}: across ${neg(k * d[0])}, up ${neg(k * d[1])} from C gives ${P(q[0], q[1])}.`, GH.gridFig({ ...w, pts: [[...c, 'C'], [...p, 'H'], [...q, 'H′', 'hl']], arrows: [[c, q, 'aux']] })), `So H′ = ${P(q[0], q[1])}.`], { q: `Point H${P(...p)} is dilated by a scale factor of ${k} with centre C${P(...c)}. Where is its image? Write it as (x, y).`, visual: GH.gridFig({ ...w, pts: [[...c, 'C'], [...p, 'H']] }) });
  }
  const k = r.pick([2, 3, 0.5, 4]), area = r.bool(), val = area ? r.int(2, 20) * 4 : r.int(3, 20) * 2, ans = area ? val * k * k : val * k;
  const base = [[1, 1], [4, 1], [1, 3]], img = base.map(([p, q]) => [p * Math.min(k, 2), q * Math.min(k, 2)]);
  return num(dec(ans), [St(area ? `Every length is multiplied by ${k}, so the area is multiplied by k² = ${dec(k * k)}.` : `Every length is multiplied by ${k}, so the perimeter is too.`, imgPic(base, img, { primes: false })), `${val} × ${dec(area ? k * k : k)} = ${dec(ans)}.`, `So the image has ${area ? 'area' : 'perimeter'} ${dec(ans)} ${area ? 'cm²' : 'cm'}.`], { q: `A triangle with ${area ? `area ${val} cm²` : `perimeter ${val} cm`} is dilated by a scale factor of ${k}. What is the ${area ? 'area' : 'perimeter'} of the image?`, expr: `${val}*${k}**${area ? 2 : 1}` });
});

// ───────────── 33. Probability ─────────────
skill('10-prob', 10, 'Probability', 'Probability of events', ['Theoretical probability = favourable outcomes ÷ possible outcomes. Experimental probability uses what really happened.', 'Independent events: multiply. Without replacement, the second draw has one fewer item.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const R = r.int(1, 9), B = r.int(1, 9), G = r.int(1, 9), n = R + B + G, [c, k] = r.pick([['red', R], ['blue', B], ['green', G]]);
    return num(frac(k, n), [`There are ${R} + ${B} + ${G} = ${n} marbles.`, `${k} are ${c}, so P(${c}) = ${k}/${n}.`, `In simplest form: ${frac(k, n)}.`], { q: `A bag has ${R} red, ${B} blue and ${G} green marbles. One is picked at random. What is the probability it is ${c}?`, expr: `${k}/${n}` });
  }
  if (v === 1) {
    const outs = ['Red', 'Blue', 'Green', 'Yellow'], counts = outs.map(() => r.int(3, 20)), N = counts.reduce((a, b) => a + b, 0), i = r.int(0, 3);
    return num(frac(counts[i], N), [`The spinner was spun ${N} times.`, `It landed on ${outs[i]} ${counts[i]} times: ${counts[i]}/${N}.`, `So the experimental probability is ${frac(counts[i], N)}.`], { q: `A spinner was spun many times with the results shown. What is the experimental probability of ${outs[i]}?`, visual: { type: 'table', head: ['Colour', 'Count'], rows: outs.map((o, j) => [o, String(counts[j])]) }, expr: `${counts[i]}/${N}` });
  }
  if (v === 2) {
    const ev = r.pick([['an even number', 3], ['a number greater than 4', 2], ['a 6', 1], ['a number less than 3', 2], ['a prime number', 3]]), coin = r.bool();
    return coin ? num(frac(ev[1], 12), [`P(heads) = 1/2 and P(${ev[0]}) = ${ev[1]}/6.`, `The events are independent, so multiply: 1/2 × ${ev[1]}/6 = ${ev[1]}/12.`, `So the probability is ${frac(ev[1], 12)}.`], { q: `You flip a coin and roll a six-sided die. What is the probability of heads and ${ev[0]}?`, expr: `1/2*${ev[1]}/6` })
      : num(frac(ev[1] * ev[1], 36), [`P(${ev[0]}) = ${ev[1]}/6 on each die.`, `Independent, so multiply: ${ev[1]}/6 × ${ev[1]}/6 = ${ev[1] * ev[1]}/36.`, `So the probability is ${frac(ev[1] * ev[1], 36)}.`], { q: `You roll two six-sided dice. What is the probability that both show ${ev[0]}?`, expr: `(${ev[1]}/6)**2` });
  }
  if (v === 3) {
    const R = r.int(2, 8), B = r.int(2, 8), n = R + B;
    return num(frac(R * (R - 1), n * (n - 1)), [`First draw: ${R}/${n} are red.`, `Without replacement, ${R - 1} red are left out of ${n - 1}: ${R - 1}/${n - 1}.`, `${R}/${n} × ${R - 1}/${n - 1} = ${R * (R - 1)}/${n * (n - 1)} = ${frac(R * (R - 1), n * (n - 1))}.`, `So the probability is ${frac(R * (R - 1), n * (n - 1))}.`], { q: `A box has ${R} red and ${B} blue pens. Two are taken at random, without replacement. What is the probability that both are red?`, expr: `${R}/${n}*${R - 1}/${n - 1}` });
  }
  const a = r.int(1, 4), b = a + r.int(1, 5);
  return num(frac(a * a, b * b), [`The chance is the area of the bullseye ÷ the area of the whole target.`, `π × ${a}² ÷ (π × ${b}²) = ${a * a}/${b * b}.`, `So the probability is ${frac(a * a, b * b)}.`], { q: `A dart lands at a random point on a circular target of radius ${b} dm. The bullseye has radius ${a} dm. What is the probability the dart lands in the bullseye?`, expr: `(${a}/${b})**2` });
});
skill('10-count', 10, 'Probability', 'Counting, permutations and combinations', ['Counting principle: if there are a ways to do one thing and b ways to do another, there are a × b ways to do both.', 'P(n, r) counts ordered arrangements; C(n, r) counts groups where order does not matter. n! = n × (n − 1) × … × 1.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) { const n = r.int(3, 8); return num(fact(n), [`${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(' × ')}.`, `= ${comma(fact(n))}.`, `So ${n}! = ${comma(fact(n))}.`], { q: `Evaluate ${n}!`, expr: Array.from({ length: n }, (_, i) => n - i).join('*') }); }
  if (v === 1) { const a = r.int(2, 6), b = r.int(2, 5), c = r.int(2, 4); return num(a * b * c, ['Multiply the number of choices for each part.', `${a} × ${b} × ${c} = ${a * b * c}.`, `So there are ${a * b * c} outfits.`], { q: `${r.pick(NAMES)} has ${a} shirts, ${b} pairs of pants and ${c} hats. How many different outfits of one shirt, one pair of pants and one hat are there?`, expr: `${a}*${b}*${c}` }); }
  const n = r.int(5, 10), k = r.int(2, 4);
  if (v === 2) { const val = fact(n) / fact(n - k); return num(val, [`Order matters, so use P(${n}, ${k}) = ${n}! ÷ ${n - k}!.`, `= ${Array.from({ length: k }, (_, i) => n - i).join(' × ')} = ${val}.`, `So there are ${val} ways.`], { q: `${n} students run a race. In how many ways can ${['', '', 'first and second place', 'first, second and third place', 'first, second, third and fourth place'][k]} be awarded?`, expr: Array.from({ length: k }, (_, i) => n - i).join('*') }); }
  if (v === 3) { const val = fact(n) / (fact(k) * fact(n - k)); return num(val, [`Order does not matter, so use C(${n}, ${k}) = ${n}! ÷ (${k}! × ${n - k}!).`, `= ${Array.from({ length: k }, (_, i) => n - i).join(' × ')} ÷ ${k}! = ${val}.`, `So there are ${val} ways.`], { q: `How many ways can a committee of ${k} be chosen from ${n} people?`, expr: `${Array.from({ length: k }, (_, i) => n - i).join('*')}/${fact(k)}` }); }
  const s = r.pick([4, 5, 6, 8]), t = r.int(2, 3);
  return num(s ** t, [`Each spin has ${s} outcomes, and there are ${t} spins.`, `${Array(t).fill(s).join(' × ')} = ${s ** t}.`, `So there are ${s ** t} outcomes.`], { q: `A spinner has ${s} equal sections. It is spun ${t} times. How many outcomes are possible?`, expr: `${s}**${t}` });
});

// ───────────── 34. Statistics ─────────────
skill('10-stats', 10, 'Statistics', 'Centre, spread and samples', ['Mean = total ÷ count. Median = the middle value in order. Mode = the most common. Range = largest − smallest.', 'Mean absolute deviation and standard deviation measure how far the data are from the mean. A biased sample does not fairly represent the whole group.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const n = r.int(5, 8), vals = r.shuffle(Array.from({ length: 30 }, (_, i) => i + 5)).slice(0, n - 1); vals.push(r.pick(vals));
    const data = r.shuffle(vals), s = [...data].sort((a, b) => a - b), what = r.pick(['median', 'mode', 'range', 'mean']);
    const sum = data.reduce((a, b) => a + b, 0);
    if (what === 'mean') { const m = dec(r1(sum / n)); return num(m, [`Add them: ${sum}.`, `Divide by ${n}: ${sum} ÷ ${n} ≈ ${dec(sum / n, 3)}.`, `Rounded to the nearest tenth: ${m}.`, `So the mean is ${m}.`], { q: `Find the mean of ${data.join(', ')}. Round to the nearest tenth.`, tol: 0.05001, expr: `(${data.join('+')})/${n}` }); }
    if (what === 'median') { const md = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; return num(dec(md), [`In order: ${s.join(', ')}.`, n % 2 ? `The middle value is ${md}.` : `The middle two are ${s[n / 2 - 1]} and ${s[n / 2]}; their average is ${dec(md)}.`, `So the median is ${dec(md)}.`], { q: `Find the median of ${data.join(', ')}.` }); }
    if (what === 'mode') { const mo = vals.at(-1); return num(mo, [`In order: ${s.join(', ')}.`, `${mo} appears twice; every other value appears once.`, `So the mode is ${mo}.`], { q: `Find the mode of ${data.join(', ')}.` }); }
    return num(s.at(-1) - s[0], [`The largest is ${s.at(-1)} and the smallest is ${s[0]}.`, `${s.at(-1)} − ${s[0]} = ${s.at(-1) - s[0]}.`, `So the range is ${s.at(-1) - s[0]}.`], { q: `Find the range of ${data.join(', ')}.`, expr: `${s.at(-1)}-${s[0]}` });
  }
  if (v === 1) {
    const n = r.pick([7, 8]), s = r.shuffle(Array.from({ length: 40 }, (_, i) => i + 10)).slice(0, n).sort((a, b) => a - b);
    const lower = s.slice(0, Math.floor(n / 2)), upper = s.slice(Math.ceil(n / 2)), med = (a) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
    const q1 = med(lower), q3 = med(upper), what = r.pick(['Q1', 'Q3', 'IQR']), ans = what === 'Q1' ? q1 : what === 'Q3' ? q3 : q3 - q1;
    return num(dec(ans), [`In order: ${s.join(', ')}.${n % 2 ? ` Leave out the median, ${s[(n - 1) / 2]}.` : ''}`, `Lower half ${lower.join(', ')}: Q1 = ${dec(q1)}. Upper half ${upper.join(', ')}: Q3 = ${dec(q3)}.`, what === 'IQR' ? `IQR = ${dec(q3)} − ${dec(q1)} = ${dec(ans)}.` : `So ${what} = ${dec(ans)}.`], { q: `Find ${what === 'IQR' ? 'the interquartile range' : `the ${what === 'Q1' ? 'first' : 'third'} quartile (${what})`} of ${r.shuffle(s).join(', ')}.` });
  }
  if (v === 2 || v === 3) {
    const n = r.pick([4, 5]); let devs; do { devs = Array.from({ length: n - 1 }, () => r.int(-6, 6)); devs.push(-devs.reduce((a, b) => a + b, 0)); } while (Math.abs(devs.at(-1)) > 8);
    const mean = r.int(10, 40), data = devs.map((d) => mean + d), absd = devs.map(Math.abs);
    if (v === 2) { const mad = dec(absd.reduce((a, b) => a + b, 0) / n); return num(mad, [`Mean = ${data.reduce((a, b) => a + b, 0)} ÷ ${n} = ${mean}.`, `Distances from the mean: ${absd.join(', ')}.`, `Average distance: ${absd.reduce((a, b) => a + b, 0)} ÷ ${n} = ${mad}.`, `So the MAD is ${mad}.`], { q: `Find the mean absolute deviation of ${data.join(', ')}.`, expr: `(${absd.join('+')})/${n}` }); }
    const ss = devs.reduce((a, d) => a + d * d, 0), variance = dec(ss / n), sd = dec(r1(Math.sqrt(ss / n))), askSD = r.bool();
    return num(askSD ? sd : variance, [`Mean = ${mean}. Squared distances from the mean: ${devs.map((d) => d * d).join(', ')}.`, `Variance = ${ss} ÷ ${n} = ${variance}.`, askSD ? `Standard deviation = √${variance} ≈ ${sd}.` : `So the variance is ${variance}.`, askSD ? `So the standard deviation is about ${sd}.` : `(The standard deviation would be √${variance}.) The variance is ${variance}.`], { q: askSD ? `Find the standard deviation of ${data.join(', ')} (treat it as the whole population). Round to the nearest tenth.` : `Find the variance of ${data.join(', ')} (treat it as the whole population).`, ...(askSD ? { tol: 0.05001 } : {}), expr: askSD ? `Math.sqrt((${devs.map((d) => `(${d})**2`).join('+')})/${n})` : `(${devs.map((d) => `(${d})**2`).join('+')})/${n}` });
  }
  const biased = ['Asking people at a hockey arena whether hockey is their favourite sport', 'Surveying only the chess club about which club is most popular at school', 'Asking customers leaving a pizza shop to name their favourite food', 'Asking only the first 10 people in line for a new phone if they like the brand'];
  const fair = ['Choosing 50 student numbers at random from the whole school list', 'Drawing 30 names from a hat holding every student’s name', 'Calling 200 randomly chosen phone numbers from across the city', 'Picking every 10th name from a complete list of members'];
  const want = r.bool(), right = r.pick(want ? biased : fair);
  return mc(r, right, r.shuffle(want ? fair : biased).slice(0, 3), { q: want ? 'Which survey is most likely to give a biased sample?' : 'Which survey is least likely to give a biased sample?', steps: ['A fair sample gives every member of the group the same chance of being chosen.', want ? `"${right}" picks people who are likely to answer one way, so it is biased.` : `"${right}" gives everyone an equal chance, so it is not biased.`] });
});

export default list;
