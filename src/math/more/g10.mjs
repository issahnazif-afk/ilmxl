// Grade 10 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
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
skill('10-quadrant', 10, 'Coordinate geometry', 'Quadrants, endpoints and distance', ['The axes split the plane into four quadrants, numbered I to IV anticlockwise from the top right.', 'The midpoint is halfway: to find a missing endpoint, go from the midpoint the same distance again.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const x = r.nonzero(-6, 6), y = r.nonzero(-6, 6), Q = x > 0 ? (y > 0 ? 'I' : 'IV') : y > 0 ? 'II' : 'III';
    return mc(r, `Quadrant ${Q}`, ['I', 'II', 'III', 'IV'].filter((t) => t !== Q).map((t) => `Quadrant ${t}`), { q: `Which quadrant is the point ${P(x, y)} in?`, visual: { type: 'plane', points: [[x, y, 'A']], range: 6 }, steps: [`x is ${x > 0 ? 'positive (right)' : 'negative (left)'} and y is ${y > 0 ? 'positive (up)' : 'negative (down)'}.`, `So the point is in Quadrant ${Q}.`] });
  }
  if (v === 1) {
    const x1 = r.int(-8, 8), y1 = r.int(-8, 8), mx = r.int(-6, 6), my = r.int(-6, 6), x2 = 2 * mx - x1, y2 = 2 * my - y1;
    return ptItem(x2, y2, [`From A to M, x changes by ${neg(mx - x1)} and y changes by ${neg(my - y1)}.`, `Do the same again from M: x = ${neg(mx)} ${sgn(mx - x1)} = ${neg(x2)}, y = ${neg(my)} ${sgn(my - y1)} = ${neg(y2)}.`, `So B = ${P(x2, y2)}.`], { q: `M${P(mx, my)} is the midpoint of AB, and A is ${P(x1, y1)}. Find B. Write it as (x, y).` });
  }
  let dx, dy; do { dx = r.int(1, 8); dy = r.int(1, 8); } while (Number.isInteger(Math.hypot(dx, dy)));
  const x1 = r.int(-5, 5), y1 = r.int(-5, 5), x2 = x1 + dx * r.pick([1, -1]), y2 = y1 + dy * r.pick([1, -1]), d = r1(Math.hypot(dx, dy));
  return num(dec(d), [`Δx = ${dx} and Δy = ${dy}.`, `d = √(${dx}² + ${dy}²) = √${dx * dx + dy * dy}.`, `√${dx * dx + dy * dy} ≈ ${dec(d)}.`, `So the distance is about ${dec(d)}.`], { q: `Find the distance between ${P(x1, y1)} and ${P(x2, y2)}. Round to the nearest tenth.`, tol: 0.05001, expr: `Math.hypot(${x2}-(${x1}),${y2}-(${y1}))` });
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
skill('10-circle', 10, 'Circles in the coordinate plane', 'Equations of circles', ['A circle with centre (h, k) and radius r has equation (x − h)² + (y − k)² = r².', 'Watch the signs: (x + 3)² means h = −3.'], (r) => {
  const v = r.int(0, 3), h = r.nonzero(-6, 6), k = r.int(-6, 6), rr = r.int(1, 9);
  if (v === 0) return ptItem(h, k, [`Compare with (x − h)² + (y − k)² = r².`, `h = ${neg(h)} and k = ${neg(k)}.`, `So the centre is ${P(h, k)}.`], { q: `What is the centre of the circle ${circ(h, k, rr * rr)}? Write it as (x, y).` });
  if (v === 1) {
    const dia = r.bool();
    return num(dia ? 2 * rr : rr, [`r² = ${rr * rr}, so r = √${rr * rr} = ${rr}.`, dia ? `The diameter is 2r = ${2 * rr}.` : `The radius is ${rr}.`, `So the ${dia ? 'diameter' : 'radius'} is ${dia ? 2 * rr : rr}.`], { q: `What is the ${dia ? 'diameter' : 'radius'} of the circle ${circ(h, k, rr * rr)}?`, expr: `${dia ? 2 : 1}*Math.sqrt(${rr * rr})` });
  }
  if (v === 2) { const right = circ(h, k, rr * rr); return mc(r, right, [circ(-h, -k, rr * rr), circ(h, k, rr === 1 ? 2 : rr), circ(-h, k, rr * rr)].filter((x) => x !== right), { q: `Which is the equation of the circle with centre ${P(h, k)} and radius ${rr}?`, steps: [`Put h = ${neg(h)}, k = ${neg(k)} and r = ${rr} into (x − h)² + (y − k)² = r².`, `r² = ${rr * rr}, so ${right}.`] }); }
  const D = -2 * h, E = -2 * k, Fc = h * h + k * k - rr * rr;
  return num(rr, [`Group and complete the squares: (x² ${sgn(D)}x + ${h * h}) + (y² ${E ? `${sgn(E)}y ` : ''}+ ${k * k}) = ${neg(-Fc)} + ${h * h} + ${k * k}.`, `That is ${circ(h, k, rr * rr)}.`, `r = √${rr * rr} = ${rr}.`, `So the radius is ${rr}.`], { q: `What is the radius of the circle ${lin([[1, 'x²'], [1, 'y²'], [D, 'x'], [E, 'y'], [Fc, '']])} = 0?`, expr: `Math.sqrt(${h * h + k * k - Fc})` });
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
skill('10-construct', 10, 'Constructions', 'Compass constructions', ['To bisect an angle: draw an arc from the vertex across both rays, then equal arcs from those two points; join the vertex to where they cross.', 'To copy an angle, copy two distances with the compass: the arc radius and the gap between the arc points.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const a = r.int(10, 85) * 2; return num(a / 2, ['An angle bisector splits the angle into two equal angles.', `${a}° ÷ 2 = ${a / 2}°.`, `So each new angle is ${a / 2}°.`], { q: `You bisect an angle of ${a}° with a compass and straightedge. What is the measure of each new angle, in degrees?`, visual: { type: 'angle', deg: a, label: `${a}°` }, expr: `${a}/2` }); }
  if (v === 1) return mc(r, 'Draw an arc centred at the vertex that crosses both rays.', ['Measure the angle with a protractor.', 'Draw a line from the vertex to any point inside the angle.', 'Draw a circle through the two rays’ end points.'], { q: 'When you construct the bisector of an angle with a compass, what is the first step?', steps: ['The construction uses only a compass and a straightedge: no measuring.', 'First, draw an arc centred at the vertex that crosses both rays.'] });
  if (v === 2) return mc(r, 'The distance between the two points where the first arc crosses the rays', ['The length of the longer ray', 'The distance from the vertex to the end of a ray', 'The size of the angle in degrees'], { q: 'When copying an angle onto a new ray, after drawing the matching arcs, which distance do you copy with the compass?', steps: ['Both angles get arcs with the same radius.', 'Then copying the gap between the arc points makes the openings match.'] });
  const which = r.bool() ? 'bisecting an angle' : 'copying an angle';
  return mc(r, 'SSS', ['SAS', 'ASA', 'AAS'], { q: `The compass construction for ${which} works because it builds two congruent triangles. Which congruence rule proves this?`, steps: ['Every length in the construction is set by the compass: three pairs of equal sides.', 'Three pairs of equal sides: SSS.'] });
});

// ───────────── 25. Two-dimensional figures ─────────────
skill('10-area2d', 10, 'Two-dimensional figures', 'Area and perimeter', ['Triangle: A = bh ÷ 2. Parallelogram: A = bh. Trapezoid: A = (a + b)h ÷ 2. Circle: A = πr², C = 2πr.', 'For a compound shape, split it into simple shapes, or take away the missing part.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const t = r.int(0, 2), b = r.int(3, 20), h = r.int(2, 15);
    if (t === 0) { const A = b * h / 2; return num(dec(A), [`A = base × height ÷ 2.`, `${b} × ${h} ÷ 2 = ${dec(A)}.`, `So the area is ${dec(A)} cm².`], { q: `A triangle has base ${b} cm and height ${h} cm. What is its area in cm²?`, expr: `${b}*${h}/2` }); }
    if (t === 1) return num(b * h, ['A = base × height.', `${b} × ${h} = ${b * h}.`, `So the area is ${b * h} m².`], { q: `A parallelogram has base ${b} m and height ${h} m. What is its area in m²?`, expr: `${b}*${h}` });
    const a = r.int(2, b), A = (a + b) * h / 2;
    return num(dec(A), ['A = (a + b) × h ÷ 2.', `(${a} + ${b}) × ${h} ÷ 2 = ${dec(A)}.`, `So the area is ${dec(A)} cm².`], { q: `A trapezoid has parallel sides ${a} cm and ${b} cm and height ${h} cm. What is its area in cm²?`, visual: { type: 'poly', points: [[1, 2], [9, 2], [7, 7], [3, 7]], labels: [`${b} cm`, '', `${a} cm`, ''] }, expr: `(${a}+${b})*${h}/2` });
  }
  if (v === 1) {
    const rad = r.int(2, 15), useD = r.bool(), area = r.bool(), val = area ? 3.14 * rad * rad : 2 * 3.14 * rad, ans = dec(r1(val));
    return num(ans, [useD ? `The radius is half the diameter: ${2 * rad} ÷ 2 = ${rad} cm.` : `The radius is ${rad} cm.`, area ? `A = πr² ≈ 3.14 × ${rad}² = 3.14 × ${rad * rad} = ${dec(val)}.` : `C = 2πr ≈ 2 × 3.14 × ${rad} = ${dec(val)}.`, `Rounded to the nearest tenth: ${ans}.`, `So the ${area ? 'area is about ' + ans + ' cm²' : 'circumference is about ' + ans + ' cm'}.`], { q: `A circle has ${useD ? `diameter ${2 * rad}` : `radius ${rad}`} cm. Using π ≈ 3.14, find its ${area ? 'area in cm²' : 'circumference in cm'}. Round to the nearest tenth.`, tol: 0.05001, expr: area ? `3.14*${rad}**2` : `2*3.14*${rad}` });
  }
  if (v === 2) {
    const W = r.int(6, 10), H = r.int(6, 10), a = r.int(2, H - 2), c = r.int(2, W - 2), A = W * a + c * (H - a);
    return num(A, [`Split it into two rectangles: a ${W} × ${a} rectangle at the bottom and a ${c} × ${H - a} rectangle on top.`, `${W * a} + ${c * (H - a)} = ${A}.`, `So the area is ${A} m².`], { q: 'What is the area of this shape, in m²? (All corners are right angles.)', visual: { type: 'poly', points: [[0, 0], [W, 0], [W, a], [c, a], [c, H], [0, H]], labels: [`${W} m`, `${a} m`, `${W - c} m`, `${H - a} m`, `${c} m`, `${H} m`] }, expr: `${W}*${H}-${W - c}*${H - a}` });
  }
  if (v === 3) {
    if (r.bool()) { const s = r.int(2, 10) * 2, val = s * s - 3.14 * (s / 2) ** 2, ans = dec(r1(val)); return num(ans, [`Square: ${s}² = ${s * s} cm². Circle: radius ${s / 2}, area ≈ 3.14 × ${(s / 2) ** 2} = ${dec(3.14 * (s / 2) ** 2)} cm².`, `Take away: ${s * s} − ${dec(3.14 * (s / 2) ** 2)} = ${dec(val)}.`, `Rounded to the nearest tenth: ${ans}.`, `So the shaded area is about ${ans} cm².`], { q: `A circle fits exactly inside a square with side ${s} cm. Using π ≈ 3.14, what is the area inside the square but outside the circle, in cm²? Round to the nearest tenth.`, tol: 0.05001, expr: `${s}**2-3.14*(${s}/2)**2` }); }
    const W = r.int(8, 20), H = r.int(6, 15), w = r.int(2, W - 3), h = r.int(2, H - 3);
    return num(W * H - w * h, [`Big rectangle: ${W} × ${H} = ${W * H} m².`, `Take away the pool: ${w} × ${h} = ${w * h} m², so ${W * H} − ${w * h} = ${W * H - w * h}.`, `So the lawn is ${W * H - w * h} m².`], { q: `A yard is ${W} m by ${H} m. A ${w} m by ${h} m pool is inside it. What is the area of the yard that is not pool, in m²?`, expr: `${W}*${H}-${w}*${h}` });
  }
  const x1 = r.int(0, 4), y1 = r.int(0, 4), x2 = x1 + r.int(2, 6), y2 = y1 + r.int(2, 6), per = r.bool(), w = x2 - x1, h = y2 - y1;
  return num(per ? 2 * (w + h) : w * h, [`Width = ${x2} − ${x1} = ${w}. Height = ${y2} − ${y1} = ${h}.`, per ? `Perimeter = 2 × (${w} + ${h}) = ${2 * (w + h)}.` : `Area = ${w} × ${h} = ${w * h}.`, `So the ${per ? 'perimeter' : 'area'} is ${per ? 2 * (w + h) : w * h} ${per ? 'units' : 'square units'}.`], { q: `A rectangle has vertices (${x1}, ${y1}), (${x2}, ${y1}), (${x2}, ${y2}) and (${x1}, ${y2}). What is its ${per ? 'perimeter' : 'area'}?`, visual: { type: 'poly', points: [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], grid: true }, expr: per ? `2*(${w}+${h})` : `${w}*${h}` });
});
skill('10-quads', 10, 'Two-dimensional figures', 'Quadrilaterals and polygons', ['A parallelogram has two pairs of parallel sides; its opposite angles are equal and its diagonals bisect each other.', 'A rhombus has four equal sides and perpendicular diagonals. A trapezoid has exactly one pair of parallel sides.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const Q = [['four right angles and four equal sides', 'Square'], ['four right angles, but its sides are not all equal', 'Rectangle'], ['four equal sides, but no right angles', 'Rhombus'], ['exactly one pair of parallel sides', 'Trapezoid'], ['two pairs of parallel sides, no right angles, and sides that are not all equal', 'Parallelogram'], ['two pairs of equal sides next to each other, and no parallel sides', 'Kite']];
    const [d, right] = r.pick(Q);
    return mc(r, right, r.shuffle(Q.map((x) => x[1]).filter((x) => x !== right)).slice(0, 3), { q: `A quadrilateral has ${d}. What is the most specific name for it?`, steps: [`Check each property: ${d}.`, `That describes a ${right.toLowerCase()}.`] });
  }
  if (v === 1) {
    if (r.bool()) { const a = r.int(35, 145); const opp = r.bool(); return num(opp ? a : 180 - a, [opp ? 'Opposite angles of a parallelogram are equal.' : 'Angles next to each other in a parallelogram add to 180°.', opp ? `So the angle is ${a}°.` : `180 − ${a} = ${180 - a}.`, `So the angle is ${opp ? a : 180 - a}°.`], { q: `One angle of a parallelogram is ${a}°. What is the angle ${opp ? 'opposite' : 'next to'} it, in degrees?`, expr: opp ? String(a) : `180-${a}` }); }
    const x = r.int(4, 12), p = r.int(1, 3), q = p + r.int(1, 3), c = r.int(0, 20), d = (q - p) * x + c;
    return num(x, ['The diagonals of a parallelogram bisect each other, so the two parts are equal.', `${px([q, c])} = ${px([p, d])}, so ${q - p}x = ${d - c}.`, `x = ${x}.`, `So x = ${x}.`], { q: `The diagonals of parallelogram ABCD meet at E. AE = ${px([q, c])} and EC = ${px([p, d])}. Find x.`, unit: 'x =', expr: `(${d}-${c})/(${q - p})` });
  }
  if (v === 2) {
    const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]), area = r.bool();
    if (area) return num(2 * a * b, [`The diagonals are ${2 * a} and ${2 * b}.`, `Area = d₁ × d₂ ÷ 2 = ${2 * a} × ${2 * b} ÷ 2 = ${2 * a * b}.`, `So the area is ${2 * a * b} cm².`], { q: `A rhombus has diagonals ${2 * a} cm and ${2 * b} cm. What is its area in cm²?`, expr: `${2 * a}*${2 * b}/2` });
    return num(c, [`The diagonals of a rhombus bisect each other at right angles, making right triangles with legs ${a} and ${b}.`, `side = √(${a}² + ${b}²) = √${c * c} = ${c}.`, `So each side is ${c} cm.`], { q: `A rhombus has diagonals ${2 * a} cm and ${2 * b} cm. How long is each side, in cm?`, expr: `Math.hypot(${a},${b})` });
  }
  if (v === 3) { const n = r.pick([5, 6, 8, 9, 10, 12]); return num(360 / n, ['The exterior angles of any polygon add to 360°.', `A regular polygon with ${n} sides has ${n} equal exterior angles: 360 ÷ ${n} = ${360 / n}.`, `So each exterior angle is ${360 / n}°.`], { q: `What is each exterior angle of a regular polygon with ${n} sides, in degrees?`, expr: `360/${n}` }); }
  const NM = [[5, 'Pentagon'], [6, 'Hexagon'], [7, 'Heptagon'], [8, 'Octagon'], [9, 'Nonagon'], [10, 'Decagon'], [12, 'Dodecagon']], [n, right] = r.pick(NM);
  return mc(r, right, r.shuffle(NM.filter((x) => x[0] !== n).map((x) => x[1])).slice(0, 3), { q: `What is a polygon with ${n} sides called?`, steps: [`The name comes from the number of sides: ${n}.`, `A ${n}-sided polygon is a ${right.toLowerCase()}.`] });
});

// ───────────── 26. Three-dimensional figures ─────────────
const BASES = [[3, 'triangular'], [4, 'rectangular'], [5, 'pentagonal'], [6, 'hexagonal'], [8, 'octagonal']];
skill('10-solids', 10, 'Three-dimensional figures', 'Faces, edges, nets and cross-sections', ['A prism has two matching bases joined by rectangles; a pyramid has one base and triangles that meet at a point.', 'A cross-section is the flat shape you see when you slice a solid.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [n, nm] = r.pick(BASES), prism = r.bool(), what = r.pick(['faces', 'edges', 'vertices']);
    const val = prism ? { faces: n + 2, edges: 3 * n, vertices: 2 * n }[what] : { faces: n + 1, edges: 2 * n, vertices: n + 1 }[what];
    const why = prism ? { faces: `${n} side faces + 2 bases = ${n + 2}.`, edges: `${n} edges on each base + ${n} joining them = ${3 * n}.`, vertices: `${n} on each base: 2 × ${n} = ${2 * n}.` }[what] : { faces: `${n} triangles + 1 base = ${n + 1}.`, edges: `${n} on the base + ${n} up to the top = ${2 * n}.`, vertices: `${n} on the base + 1 at the top = ${n + 1}.` }[what];
    return num(val, [`The base has ${n} sides.`, why, `So it has ${val} ${what}.`], { q: `How many ${what} does ${/^[aeiou]/.test(nm) ? "an" : "a"} ${nm} ${prism ? 'prism' : 'pyramid'} have?`, expr: String(val) });
  }
  if (v === 1) {
    const X = [['a cube', 'parallel to one face', 'Square'], ['a cylinder', 'parallel to its bases', 'Circle'], ['a cylinder', 'straight down through both bases, through the centre', 'Rectangle'], ['a cone', 'parallel to its base', 'Circle'], ['a cone', 'straight down through the tip, at right angles to the base', 'Triangle'], ['a square pyramid', 'parallel to its base', 'Square'], ['a sphere', 'through any plane', 'Circle'], ['a rectangular prism (not a cube)', 'parallel to its long, thin side face', 'Rectangle']];
    const [s, how, right] = r.pick(X);
    return mc(r, right, ['Square', 'Circle', 'Rectangle', 'Triangle'].filter((x) => x !== right), { q: `You slice ${s} ${how}. What shape is the cross-section?`, steps: [`Picture the cut face of ${s} sliced ${how}.`, `It is a ${right.toLowerCase()}.`] });
  }
  if (v === 2) {
    const R = [['a rectangle', 'one of its sides', 'Cylinder'], ['a right triangle', 'one of its legs', 'Cone'], ['a semicircle', 'its diameter', 'Sphere']];
    const [s, ax, right] = r.pick(R);
    return mc(r, right, ['Cylinder', 'Cone', 'Sphere', 'Square pyramid'].filter((x) => x !== right), { q: `${cap1(s)} is spun all the way around ${ax}. What solid does it make?`, steps: [`As ${s} turns, every point traces a circle.`, `The result is a ${right.toLowerCase()}.`] });
  }
  const N = [['6 equal squares', 'Cube'], ['2 circles and a rectangle', 'Cylinder'], ['1 square and 4 triangles', 'Square pyramid'], ['2 triangles and 3 rectangles', 'Triangular prism'], ['a circle and a sector of a larger circle', 'Cone'], ['4 equal triangles', 'Triangular pyramid']];
  const [d, right] = r.pick(N);
  return mc(r, right, r.shuffle(N.map((x) => x[1]).filter((x) => x !== right)).slice(0, 3), { q: `A net is made of ${d}. What solid does it fold into?`, steps: ['Each piece of a net becomes one face of the solid.', `${cap1(d)} fold into a ${right.toLowerCase()}.`] });
});
skill('10-volume', 10, 'Three-dimensional figures', 'Volume', ['Prism or cylinder: V = base area × height. Pyramid or cone: V = base area × height ÷ 3.', 'Sphere: V = 4/3 × π × r³.'], (r) => {
  const v = r.int(0, 5), a = r.int(2, 12), b = r.int(2, 12), h = r.int(2, 15);
  if (v === 0) return num(a * b * h, [`V = length × width × height.`, `${a} × ${b} × ${h} = ${a * b * h}.`, `So the volume is ${a * b * h} cm³.`], { q: `A box is ${a} cm long, ${b} cm wide and ${h} cm high. What is its volume in cm³?`, expr: `${a}*${b}*${h}` });
  if (v === 1) { const A = a * b / 2; return num(dec(A * h), [`The triangle base has area ${a} × ${b} ÷ 2 = ${dec(A)} cm².`, `V = ${dec(A)} × ${h} = ${dec(A * h)}.`, `So the volume is ${dec(A * h)} cm³.`], { q: `A triangular prism has a triangle base with base ${a} cm and height ${b} cm. The prism is ${h} cm long. What is its volume in cm³?`, expr: `${a}*${b}/2*${h}` }); }
  if (v === 2) { const hh = r.int(1, 8) * 3; return num(a * a * hh / 3, ['V = base area × height ÷ 3.', `${a}² × ${hh} ÷ 3 = ${a * a} × ${hh} ÷ 3 = ${a * a * hh / 3}.`, `So the volume is ${a * a * hh / 3} m³.`], { q: `A square pyramid has base edge ${a} m and height ${hh} m. What is its volume in m³?`, expr: `${a}**2*${hh}/3` }); }
  const rad = r.int(1, 10);
  const shape = ['cylinder', 'cone', 'sphere'][v - 3], val = v === 3 ? 3.14 * rad * rad * h : v === 4 ? 3.14 * rad * rad * h / 3 : 4 / 3 * 3.14 * rad ** 3, ans = dec(r1(val));
  const f = v === 3 ? `V = πr²h ≈ 3.14 × ${rad}² × ${h}` : v === 4 ? `V = πr²h ÷ 3 ≈ 3.14 × ${rad}² × ${h} ÷ 3` : `V = 4/3 × π × r³ ≈ 4/3 × 3.14 × ${rad}³`;
  return num(ans, [f + '.', `= ${dec(val, 3)}, which rounds to ${ans}.`, `So the volume is about ${ans} cm³.`], { q: `A ${shape} has radius ${rad} cm${v === 5 ? '' : ` and height ${h} cm`}. Using π ≈ 3.14, find its volume in cm³. Round to the nearest tenth.`, tol: 0.05001, expr: v === 3 ? `3.14*${rad}**2*${h}` : v === 4 ? `3.14*${rad}**2*${h}/3` : `4/3*3.14*${rad}**3` });
});
skill('10-surface', 10, 'Three-dimensional figures', 'Surface area and similar solids', ['Surface area is the total area of all the faces: add up the area of each piece of the net.', 'If two solids are similar with scale factor k, their surface areas are in the ratio k² and their volumes in the ratio k³.'], (r) => {
  const v = r.int(0, 4), a = r.int(2, 12), b = r.int(2, 12), h = r.int(2, 12);
  if (v === 0) { const S = 2 * (a * b + a * h + b * h); return num(S, [`There are three pairs of faces: ${a} × ${b}, ${a} × ${h} and ${b} × ${h}.`, `2 × (${a * b} + ${a * h} + ${b * h}) = ${S}.`, `So the surface area is ${S} cm².`], { q: `What is the surface area of a box ${a} cm by ${b} cm by ${h} cm, in cm²?`, expr: `2*(${a}*${b}+${a}*${h}+${b}*${h})` }); }
  if (v === 1) { const l = r.int(3, 15); const S = a * a + 2 * a * l; return num(S, [`Base: ${a} × ${a} = ${a * a}. Each triangle: ${a} × ${l} ÷ 2 = ${a * l / 2}, and there are 4.`, `${a * a} + 4 × ${a * l / 2} = ${S}.`, `So the surface area is ${S} cm².`], { q: `A square pyramid has base edge ${a} cm and slant height ${l} cm. What is its surface area in cm²?`, expr: `${a}**2+2*${a}*${l}` }); }
  if (v === 2 || v === 3) {
    const rad = r.int(1, 9), cyl = v === 2 && r.bool(), val = cyl ? 2 * 3.14 * rad * rad + 2 * 3.14 * rad * h : v === 2 ? 4 * 3.14 * rad * rad : 3.14 * rad * rad + 3.14 * rad * (rad + h), ans = dec(r1(val));
    const f = cyl ? `SA = 2πr² + 2πrh ≈ 2 × 3.14 × ${rad}² + 2 × 3.14 × ${rad} × ${h}` : v === 2 ? `SA = 4πr² ≈ 4 × 3.14 × ${rad}²` : `SA = πr² + πrl ≈ 3.14 × ${rad}² + 3.14 × ${rad} × ${rad + h}`;
    return num(ans, [f + '.', `= ${dec(val, 3)}, which rounds to ${ans}.`, `So the surface area is about ${ans} cm².`], { q: `${cyl ? `A cylinder has radius ${rad} cm and height ${h} cm` : v === 2 ? `A sphere has radius ${rad} cm` : `A cone has radius ${rad} cm and slant height ${rad + h} cm`}. Using π ≈ 3.14, find its surface area in cm². Round to the nearest tenth.`, tol: 0.05001, expr: cyl ? `2*3.14*${rad}**2+2*3.14*${rad}*${h}` : v === 2 ? `4*3.14*${rad}**2` : `3.14*${rad}**2+3.14*${rad}*${rad + h}` });
  }
  const k = r.int(2, 4), vol = r.bool(), base = r.int(2, 30);
  return num(base * k ** (vol ? 3 : 2), [`The scale factor is ${k}, so ${vol ? 'volumes' : 'surface areas'} grow by ${k}^${vol ? 3 : 2} = ${k ** (vol ? 3 : 2)}.`, `${base} × ${k ** (vol ? 3 : 2)} = ${base * k ** (vol ? 3 : 2)}.`, `So the larger one has ${vol ? 'volume' : 'surface area'} ${base * k ** (vol ? 3 : 2)} ${vol ? 'cm³' : 'cm²'}.`], { q: `Two solids are similar. Each length of the larger one is ${k} times the smaller one. The smaller has ${vol ? 'volume' : 'surface area'} ${base} ${vol ? 'cm³' : 'cm²'}. What is the ${vol ? 'volume' : 'surface area'} of the larger one?`, expr: `${base}*${k}**${vol ? 3 : 2}` });
});

// ───────────── 27. Congruent figures ─────────────
const TRIS = [['ABC', 'DEF'], ['PQR', 'XYZ'], ['JKL', 'MNO'], ['RST', 'UVW']];
skill('10-congthm', 10, 'Congruent figures', 'Triangle congruence rules', ['SSS: three pairs of equal sides. SAS: two sides and the angle between them. ASA: two angles and the side between them.', 'AAS: two angles and a side not between them. HL: right triangles with equal hypotenuses and one pair of equal legs. SSA and AAA do not prove congruence.'], (r) => {
  const [t1, t2] = r.pick(TRIS), rot = r.int(0, 2), A = [...t1.slice(rot), ...t1.slice(0, rot)], B = [...t2.slice(rot), ...t2.slice(0, rot)];
  const [X, Y, Z] = A, [X2, Y2, Z2] = B;
  const kind = r.pick(['SSS', 'SAS', 'ASA', 'AAS', 'HL', 'SSA', 'AAA']);
  const facts = { SSS: [`${X}${Y} = ${X2}${Y2}`, `${Y}${Z} = ${Y2}${Z2}`, `${Z}${X} = ${Z2}${X2}`], SAS: [`${X}${Y} = ${X2}${Y2}`, `∠${Y} = ∠${Y2}`, `${Y}${Z} = ${Y2}${Z2}`], ASA: [`∠${X} = ∠${X2}`, `${X}${Y} = ${X2}${Y2}`, `∠${Y} = ∠${Y2}`], AAS: [`∠${X} = ∠${X2}`, `∠${Y} = ∠${Y2}`, `${Y}${Z} = ${Y2}${Z2}`], HL: [`∠${Z} and ∠${Z2} are right angles`, `${X}${Y} = ${X2}${Y2}`, `${Y}${Z} = ${Y2}${Z2}`], SSA: [`${X}${Y} = ${X2}${Y2}`, `${Y}${Z} = ${Y2}${Z2}`, `∠${X} = ∠${X2}`], AAA: [`∠${X} = ∠${X2}`, `∠${Y} = ∠${Y2}`, `∠${Z} = ∠${Z2}`] }[kind];
  const right = kind === 'SSA' || kind === 'AAA' ? 'Not enough information' : kind;
  const why = { SSS: 'All three pairs of sides are equal.', SAS: `∠${Y} is between sides ${X}${Y} and ${Y}${Z}.`, ASA: `Side ${X}${Y} is between ∠${X} and ∠${Y}.`, AAS: `Side ${Y}${Z} is not between ∠${X} and ∠${Y}.`, HL: `They are right triangles, ${X}${Y} is the hypotenuse, and ${Y}${Z} is a leg.`, SSA: `∠${X} is not between the two sides, and SSA does not prove congruence.`, AAA: 'Equal angles give the same shape but not always the same size.' }[kind];
  const opts = ['SSS', 'SAS', 'ASA', 'AAS', 'HL', 'Not enough information'].filter((x) => x !== right);
  return mc(r, right, right === 'Not enough information' ? r.shuffle(opts).slice(0, 3) : [...r.shuffle(opts.filter((x) => x !== 'Not enough information')).slice(0, 2), 'Not enough information'], { q: `In △${t1} and △${t2}: ${facts.join(', ')}. Which rule shows the triangles are congruent?`, steps: [why, `So the answer is ${right}.`] });
});
skill('10-congparts', 10, 'Congruent figures', 'Corresponding parts and isosceles triangles', ['In △ABC ≅ △DEF, the letters match in order: A ↔ D, B ↔ E, C ↔ F, so AB = DE and ∠C = ∠F.', 'An isosceles triangle has two equal sides, and the angles opposite them (base angles) are equal. An equilateral triangle has all angles 60°.'], (r) => {
  const v = r.int(0, 3), [t1, t2] = r.pick(TRIS);
  if (v === 0) {
    const i = r.int(0, 2), j = (i + 1 + r.int(0, 1)) % 3, side = r.bool();
    if (side) { const right = t2[i] + t2[j]; return mc(r, right, [0, 1, 2].filter((k) => k !== 3 - i - j).map((k) => t2[(k + 1) % 3] + t2[(k + 2) % 3]).filter((x) => x !== right && x.split('').reverse().join('') !== right).concat([t1[i] + t1[j] === right ? t2[0] + t2[2] : t1[i] + t2[j]]), { q: `△${t1} ≅ △${t2}. Which side matches ${t1[i]}${t1[j]}?`, steps: [`Match the letters in order: ${t1[i]} ↔ ${t2[i]} and ${t1[j]} ↔ ${t2[j]}.`, `So ${t1[i]}${t1[j]} matches ${right}.`] }); }
    return mc(r, `∠${t2[i]}`, [0, 1, 2].filter((k) => k !== i).map((k) => `∠${t2[k]}`).concat([`∠${t1[(i + 1) % 3]}`]), { q: `△${t1} ≅ △${t2}. Which angle matches ∠${t1[i]}?`, steps: [`Letters in the same position match: ${t1[i]} is letter ${i + 1}, and so is ${t2[i]}.`, `So ∠${t1[i]} matches ∠${t2[i]}.`] });
  }
  if (v === 1) { const a = r.int(30, 90), b = r.int(20, 150 - a); return num(180 - a - b, [`∠${t2[0]} = ∠${t1[0]} = ${a}° and ∠${t2[1]} = ∠${t1[1]} = ${b}°.`, `The angles of a triangle add to 180°: 180 − ${a} − ${b} = ${180 - a - b}.`, `So ∠${t2[2]} = ${180 - a - b}°.`], { q: `△${t1} ≅ △${t2}. ∠${t1[0]} = ${a}° and ∠${t1[1]} = ${b}°. What is ∠${t2[2]}, in degrees?`, expr: `180-${a}-${b}` }); }
  if (v === 2) {
    if (r.bool()) { const top = r.int(10, 80) * 2; return num((180 - top) / 2, ['The two base angles of an isosceles triangle are equal.', `(180 − ${top}) ÷ 2 = ${(180 - top) / 2}.`, `So each base angle is ${(180 - top) / 2}°.`], { q: `An isosceles triangle has a vertex angle of ${top}°. What is each base angle, in degrees?`, expr: `(180-${top})/2` }); }
    const base = r.int(20, 85); return num(180 - 2 * base, ['The two base angles are equal.', `180 − 2 × ${base} = ${180 - 2 * base}.`, `So the vertex angle is ${180 - 2 * base}°.`], { q: `Each base angle of an isosceles triangle is ${base}°. What is the vertex angle, in degrees?`, expr: `180-2*${base}` });
  }
  const x = r.int(2, 12), p = r.int(2, 4), q = p + r.int(1, 3), c = r.int(1, 15), e = c - (q - p) * x;
  return num(x, [`In an equilateral triangle all sides are equal: ${px([q, e])} = ${px([p, c])}.`, `Gather the x terms on the left and the numbers on the right: ${q - p}x = ${c - e}.`, `x = ${c - e} ÷ ${q - p} = ${x}.`, `So x = ${x}.`], { q: `Two sides of an equilateral triangle are ${px([q, e])} and ${px([p, c])}. Find x.`, unit: 'x =', expr: `(${c}-(${e}))/(${q - p})` });
});

// ───────────── 28. Triangles ─────────────
skill('10-triangles', 10, 'Triangles', 'Triangle angles and sides', ['The angles of a triangle add to 180°. An exterior angle equals the sum of the two interior angles not next to it.', 'Any two sides must add to more than the third side. The longest side is opposite the largest angle.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    if (r.bool()) { const a = r.int(25, 80), b = r.int(25, 80); return num(a + b, ['An exterior angle equals the sum of the two remote interior angles.', `${a} + ${b} = ${a + b}.`, `So the exterior angle is ${a + b}°.`], { q: `Two angles of a triangle are ${a}° and ${b}°. What is the exterior angle at the third vertex, in degrees?`, expr: `${a}+${b}` }); }
    const [k, x] = r.pick([[[1, 2, 3], 30], [[2, 3, 4], 20], [[1, 1, 2], 45], [[1, 3, 5], 20], [[3, 4, 5], 15], [[1, 2, 2], 36], [[2, 3, 5], 18], [[1, 4, 7], 15]]);
    const t = (c) => (c === 1 ? 'x' : `${c}x`);
    return num(x, [`The angles add to 180°: ${k.map(t).join(' + ')} = 180.`, `${k[0] + k[1] + k[2]}x = 180, so x = 180 ÷ ${k[0] + k[1] + k[2]} = ${x}.`, `So x = ${x}.`], { q: `The angles of a triangle are ${k.map(t).join(', ')} degrees. Find x.`, unit: 'x =', expr: `180/${k[0] + k[1] + k[2]}` });
  }
  if (v === 1) {
    const a = r.int(3, 15), b = r.int(3, 15);
    if (r.bool()) return num(a + b - 1, [`The third side must be less than ${a} + ${b} = ${a + b}.`, `The greatest whole number less than ${a + b} is ${a + b - 1}.`, `So the longest possible whole-number side is ${a + b - 1} cm.`], { q: `Two sides of a triangle are ${a} cm and ${b} cm. What is the greatest possible whole-number length of the third side, in cm?`, expr: `${a}+${b}-1` });
    const c = r.bool() ? r.int(Math.abs(a - b) + 1, a + b - 1) : a + b + r.int(0, 4), ok = c < a + b && a < b + c && b < a + c;
    return mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], { q: `Can ${a} cm, ${b} cm and ${c} cm be the sides of a triangle?`, steps: ['Check that the two shorter sides add to more than the longest.', ok ? `They do, so yes.` : `${Math.min(a, b, c) === c ? `${a} + ${b}` : `the two shorter sides`} do not add to more than the longest side, so no.`] });
  }
  if (v === 2) {
    if (r.bool()) { const m = r.int(3, 20); return num(2 * m, ['A midsegment joins the midpoints of two sides; it is parallel to the third side and half as long.', `So the third side is 2 × ${m} = ${2 * m}.`, `So BC = ${2 * m} cm.`], { q: `In △ABC, D and E are the midpoints of AB and AC. DE = ${m} cm. How long is BC?`, expr: `2*${m}` }); }
    const x = r.int(3, 12), p = r.int(1, 4), c = r.int(1, 9), bc = 2 * (x + p), k = r.int(3, 5), d = k * x - bc;
    return num(x, ['BC = 2 × DE, because DE is a midsegment.', `${px([k, -d])} = 2(x + ${p}) = 2x + ${2 * p}, so ${k - 2}x = ${2 * p + d}.`, `x = ${x}.`, `So x = ${x}.`], { q: `In △ABC, DE joins the midpoints of AB and AC. DE = x + ${p} and BC = ${px([k, -d])}. Find x.`, unit: 'x =', expr: `(${2 * p}+(${d}))/${k - 2}` });
  }
  if (v === 3) {
    let A, B; do { A = r.int(30, 100); B = r.int(30, 100); } while (A === B || A + B >= 170 || 180 - A - B === A || 180 - A - B === B);
    const C = 180 - A - B, big = r.bool(), angs = { A, B, C }, key = Object.keys(angs).sort((u, w) => (big ? angs[w] - angs[u] : angs[u] - angs[w]))[0];
    const opp = { A: 'BC', B: 'AC', C: 'AB' };
    return mc(r, opp[key], ['AB', 'BC', 'AC'].filter((x) => x !== opp[key]), { q: `In △ABC, ∠A = ${A}° and ∠B = ${B}°. Which side is the ${big ? 'longest' : 'shortest'}?`, steps: [`∠C = 180 − ${A} − ${B} = ${C}°.`, `The ${big ? 'largest' : 'smallest'} angle is ∠${key}, and the side opposite it is ${opp[key]}.`] });
  }
  const V = [['from a vertex to the midpoint of the opposite side', 'Median'], ['from a vertex, meeting the opposite side at a right angle', 'Altitude'], ['from a vertex, splitting its angle into two equal angles', 'Angle bisector'], ['through the midpoint of a side, at a right angle to it', 'Perpendicular bisector']];
  const [d, right] = r.pick(V);
  return mc(r, right, V.map((x) => x[1]).filter((x) => x !== right), { q: `In a triangle, what is a segment or line ${d} called?`, steps: [`It goes ${d}.`, `That is the definition of a${/^[AEIOU]/.test(right) ? 'n' : ''} ${right.toLowerCase()}.`] });
});

// ───────────── 29. Similarity ─────────────
skill('10-simrules', 10, 'Similarity', 'Similar triangle rules', ['AA: two pairs of equal angles. SSS similarity: all three side ratios are equal. SAS similarity: two side ratios are equal and the angles between them are equal.', 'If a line is parallel to one side of a triangle, it cuts the other two sides in the same ratio.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = r.int(0, 3), k = r.pick([1.5, 2, 2.5, 3]), [a, b, c] = r.pick([[4, 6, 8], [2, 3, 4], [6, 8, 10], [4, 5, 6]]);
    const A1 = r.int(35, 80), A2 = r.int(30, 70);
    const desc = [`∠A = ∠D = ${A1}° and ∠B = ∠E = ${A2}°`, `AB = ${a}, BC = ${b}, CA = ${c} and DE = ${dec(a * k)}, EF = ${dec(b * k)}, FD = ${dec(c * k)}`, `AB = ${a}, AC = ${c}, ∠A = ${A1}° and DE = ${dec(a * k)}, DF = ${dec(c * k)}, ∠D = ${A1}°`, `AB = ${a}, BC = ${b}, CA = ${c} and DE = ${dec(a * k)}, EF = ${dec(b * k + 1)}, FD = ${dec(c * k)}`][t];
    const names = ['AA', 'SSS similarity', 'SAS similarity', 'Not similar'];
    const why = [`Two pairs of angles are equal.`, `Each ratio is ${dec(k)}.`, `DE/AB = DF/AC = ${dec(k)}, and the angles between those sides are equal.`, `DE/AB = ${dec(k)} but EF/BC = ${dec((b * k + 1) / b, 3)}: the ratios are not equal.`][t];
    return mc(r, names[t], names.filter((_, i) => i !== t), { q: `In △ABC and △DEF: ${desc}. Which rule shows they are similar?`, steps: [why, `So the answer is ${names[t]}.`] });
  }
  if (v === 1) {
    const ad = r.int(2, 9), k = r.pick([0.5, 1, 1.5, 2, 3]), db = ad * k, ae = r.int(2, 12) * 2, ec = ae * k;
    return num(dec(ec), ['DE ∥ BC, so AD/DB = AE/EC (Triangle Proportionality Theorem).', `${ad}/${dec(db)} = ${ae}/EC, so EC = ${ae} × ${dec(db)} ÷ ${ad}.`, `EC = ${dec(ec)}.`, `So EC = ${dec(ec)} cm.`], { q: `In △ABC, D is on AB and E is on AC with DE ∥ BC. AD = ${ad} cm, DB = ${dec(db)} cm and AE = ${ae} cm. Find EC.`, expr: `${ae}*${db}/${ad}` });
  }
  const [t1, t2] = r.pick([['ABC', 'XYZ'], ['PQR', 'LMN'], ['DEF', 'JKL']]), i = r.int(0, 2), j = (i + 1) % 3, k2 = (i + 2) % 3;
  const right = `${t1[j]}${t1[k2]}/${t2[j]}${t2[k2]}`;
  return mc(r, right, [`${t1[j]}${t1[k2]}/${t2[i]}${t2[j]}`, `${t2[j]}${t2[k2]}/${t1[i]}${t1[j]}`, `${t1[i]}${t1[k2]}/${t2[i]}${t2[j]}`], { q: `△${t1} ~ △${t2}. Which ratio is equal to ${t1[i]}${t1[j]}/${t2[i]}${t2[j]}?`, steps: [`Match the letters in order: ${t1[0]} ↔ ${t2[0]}, ${t1[1]} ↔ ${t2[1]}, ${t1[2]} ↔ ${t2[2]}.`, `Matching sides are in the same ratio, so ${t1[i]}${t1[j]}/${t2[i]}${t2[j]} = ${right}.`] });
});
skill('10-simscale', 10, 'Similarity', 'Scale factors, perimeter and area', ['If similar figures have scale factor k, their perimeters are in the ratio k and their areas in the ratio k².', 'Similar triangles let us measure tall things: a pole and its shadow make the same shape as a tree and its shadow.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const k = r.int(2, 5), P = r.int(8, 40); return num(k * P, ['Perimeters grow by the same scale factor as the sides.', `${P} × ${k} = ${k * P}.`, `So the larger perimeter is ${k * P} cm.`], { q: `Two similar polygons have a scale factor of ${k}. The smaller one has a perimeter of ${P} cm. What is the perimeter of the larger one?`, expr: `${k}*${P}` }); }
  if (v === 1) {
    const a = r.int(1, 4), b = a + r.int(1, 3), A = r.int(2, 12) * a * a;
    return num(A * b * b / (a * a), [`The side ratio is ${b}/${a}, so the area ratio is ${b * b}/${a * a}.`, `${A} × ${b * b} ÷ ${a * a} = ${A * b * b / (a * a)}.`, `So the larger area is ${A * b * b / (a * a)} cm².`], { q: `Two similar triangles have matching sides of ${a} cm and ${b} cm. The smaller triangle has an area of ${A} cm². What is the area of the larger one?`, expr: `${A}*(${b}/${a})**2` });
  }
  if (v === 2) {
    const h = r.pick([1.5, 1.6, 1.8, 2]), s = r.pick([2, 2.5, 3, 4]), k = r.int(3, 10), H = dec(h * k);
    return num(H, [`The person and the tree make similar triangles with their shadows: height/shadow is the same.`, `${h}/${s} = H/${dec(s * k)}, so H = ${h} × ${dec(s * k)} ÷ ${s}.`, `H = ${H}.`, `So the tree is ${H} m tall.`], { q: `A person ${h} m tall casts a shadow ${s} m long. At the same time, a tree casts a shadow ${dec(s * k)} m long. How tall is the tree, in metres?`, expr: `${h}*${s * k}/${s}` });
  }
  const r1_ = r.int(1, 6); let r2 = r.int(2, 12); if (r2 === r1_) r2++;
  const area = r.bool();
  return num(area ? frac(r2 * r2, r1_ * r1_) : frac(r2, r1_), ['All circles are similar; the scale factor is the ratio of the radii.', `${r2}/${r1_}${area ? `, so the areas are in the ratio (${r2}/${r1_})² = ${r2 * r2}/${r1_ * r1_}` : ''}.`, `So the ratio is ${area ? frac(r2 * r2, r1_ * r1_) : frac(r2, r1_)}.`], { q: `Circle A has radius ${r1_} cm and circle B has radius ${r2} cm. What is the ratio of the ${area ? 'area' : 'circumference'} of B to that of A? (as a fraction or number)`, expr: area ? `(${r2}/${r1_})**2` : `${r2}/${r1_}` });
});

// ───────────── 30. Right triangles ─────────────
skill('10-righttri', 10, 'Right triangles', 'Pythagorean theorem and special triangles', ['If a² + b² = c² (c the longest side), the triangle is right. If a² + b² > c² it is acute; if a² + b² < c² it is obtuse.', '45-45-90: hypotenuse = leg × √2. 30-60-90: hypotenuse = 2 × short leg, long leg = short leg × √3.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [a, b, c0] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15]]), c = c0 + r.pick([0, 0, 1, -1]);
    const L = a * a + b * b, R = c * c, right = L === R ? 'Right' : L > R ? 'Acute' : 'Obtuse';
    return mc(r, right, ['Right', 'Acute', 'Obtuse'].filter((x) => x !== right), { q: `A triangle has sides ${a}, ${b} and ${c}. Is it right, acute or obtuse?`, steps: [`a² + b² = ${a * a} + ${b * b} = ${L}, and c² = ${c}² = ${R}.`, `${L} ${L === R ? '=' : L > R ? '>' : '<'} ${R}, so it is ${right.toLowerCase()}.`] });
  }
  const k = r.int(2, 12);
  if (v === 1) {
    if (r.bool()) return mc(r, `${k}√2`, [`${2 * k}`, `${k}√3`, `${k * 2}√2`], { q: `A 45-45-90 triangle has legs of ${k} cm. How long is the hypotenuse?`, steps: ['In a 45-45-90 triangle, hypotenuse = leg × √2.', `So the hypotenuse is ${k}√2 cm.`] });
    return num(k, ['In a 45-45-90 triangle, hypotenuse = leg × √2.', `So leg = ${k}√2 ÷ √2 = ${k}.`, `So each leg is ${k} cm.`], { q: `The hypotenuse of a 45-45-90 triangle is ${k}√2 cm. How long is each leg?`, expr: `${k}*Math.SQRT2/Math.SQRT2` });
  }
  if (v === 2) {
    if (r.bool()) return num(2 * k, ['In a 30-60-90 triangle, hypotenuse = 2 × short leg.', `2 × ${k} = ${2 * k}.`, `So the hypotenuse is ${2 * k} cm.`], { q: `In a 30-60-90 triangle the shortest side is ${k} cm. How long is the hypotenuse?`, expr: `2*${k}` });
    return mc(r, `${k}√3`, [`${k}√2`, `${2 * k}`, `${2 * k}√3`], { q: `In a 30-60-90 triangle the shortest side is ${k} cm. How long is the other leg (opposite the 60° angle)?`, steps: ['In a 30-60-90 triangle, long leg = short leg × √3.', `So it is ${k}√3 cm.`] });
  }
  let a, b; do { a = r.int(2, 15); b = r.int(2, 15); } while (Number.isInteger(Math.hypot(a, b)));
  const c = dec(r1(Math.hypot(a, b)));
  return num(c, [`c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}.`, `c = √${a * a + b * b} ≈ ${dec(Math.hypot(a, b), 3)}.`, `Rounded to the nearest tenth: ${c}.`, `So the hypotenuse is about ${c} cm.`], { q: `A right triangle has legs ${a} cm and ${b} cm. Find the hypotenuse, rounded to the nearest tenth.`, visual: { type: 'righttri', a, b, c: '?' }, tol: 0.05001, expr: `Math.hypot(${a},${b})` });
});

// ───────────── 31. Trigonometry ─────────────
const RAD = Math.PI / 180;
skill('10-trigangle', 10, 'Trigonometry', 'Find angles and solve problems', ['To find an angle, use the inverse: θ = tan⁻¹(opposite ÷ adjacent), and the same for sin⁻¹ and cos⁻¹.', 'csc = 1/sin = hyp/opp, sec = 1/cos = hyp/adj, cot = 1/tan = adj/opp.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const f = r.pick(['tan', 'sin', 'cos']), o = r.int(2, 12), x = f === 'tan' ? r.int(2, 12) : o + r.int(1, 10);
    const ang = f === 'tan' ? Math.atan(o / x) / RAD : f === 'sin' ? Math.asin(o / x) / RAD : Math.acos(o / x) / RAD, ans = Math.round(ang);
    const desc = f === 'tan' ? `the side opposite θ is ${o} cm and the side adjacent to θ is ${x} cm` : f === 'sin' ? `the side opposite θ is ${o} cm and the hypotenuse is ${x} cm` : `the side adjacent to θ is ${o} cm and the hypotenuse is ${x} cm`;
    return num(ans, [`${f} θ = ${o}/${x}.`, `θ = ${f}⁻¹(${o}/${x}) ≈ ${dec(ang, 2)}°.`, `Rounded to the nearest degree: ${ans}°.`, `So θ is about ${ans}°.`], { q: `In a right triangle, ${desc}. Find θ to the nearest degree.`, tol: 0.5001, expr: f === 'tan' ? `Math.atan(${o}/${x})*180/Math.PI` : f === 'sin' ? `Math.asin(${o}/${x})*180/Math.PI` : `Math.acos(${o}/${x})*180/Math.PI` });
  }
  if (v === 1) {
    const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), f = r.pick(['csc', 'sec', 'cot']);
    const val = f === 'csc' ? frac(c, a) : f === 'sec' ? frac(c, b) : frac(b, a);
    return num(val, [`${f} θ = ${f === 'csc' ? 'hypotenuse ÷ opposite' : f === 'sec' ? 'hypotenuse ÷ adjacent' : 'adjacent ÷ opposite'}.`, `= ${f === 'csc' ? `${c}/${a}` : f === 'sec' ? `${c}/${b}` : `${b}/${a}`}.`, `So ${f} θ = ${val}.`], { q: `A right triangle has the side opposite θ equal to ${a}, the side adjacent to θ equal to ${b}, and hypotenuse ${c}. What is ${f} θ?`, expr: f === 'csc' ? `${c}/${a}` : f === 'sec' ? `${c}/${b}` : `${b}/${a}` });
  }
  if (v === 2) {
    if (r.bool()) { const d = r.int(10, 60), t = r.int(20, 65), h = d * Math.tan(t * RAD), ans = dec(r1(h)); return num(ans, [`The height is opposite the angle and the distance is adjacent: tan ${t}° = h ÷ ${d}.`, `h = ${d} × tan ${t}° ≈ ${d} × ${dec(Math.tan(t * RAD), 4)} ≈ ${dec(h, 3)}.`, `Rounded to the nearest tenth: ${ans}.`, `So the building is about ${ans} m tall.`], { q: `From a point ${d} m from the base of a building, the angle of elevation to the top is ${t}°. How tall is the building, to the nearest tenth of a metre?`, tol: 0.05001, expr: `${d}*Math.tan(${t}*Math.PI/180)` }); }
    const L = r.int(3, 10), t = r.int(55, 80), h = L * Math.sin(t * RAD), ans = dec(r1(h));
    return num(ans, [`The ladder is the hypotenuse and the height is opposite the angle: sin ${t}° = h ÷ ${L}.`, `h = ${L} × sin ${t}° ≈ ${dec(h, 3)}.`, `Rounded to the nearest tenth: ${ans}.`, `So the ladder reaches about ${ans} m up the wall.`], { q: `A ${L} m ladder leans against a wall, making an angle of ${t}° with the ground. How high up the wall does it reach, to the nearest tenth of a metre?`, tol: 0.05001, expr: `${L}*Math.sin(${t}*Math.PI/180)` });
  }
  const f = r.pick(['sin', 'cos', 'tan']), t = r.int(5, 85), val = Math[f](t * RAD), ans = dec(Math.round(val * 1000) / 1000);
  return num(ans, [`Make sure the calculator is in degree mode.`, `${f} ${t}° ≈ ${dec(val, 6)}.`, `Rounded to the nearest thousandth: ${ans}.`, `So ${f} ${t}° ≈ ${ans}.`], { q: `Use a calculator: what is ${f} ${t}°, to the nearest thousandth?`, tol: 0.0005001, expr: `Math.${f}(${t}*Math.PI/180)` });
});

// ───────────── 32. Transformations ─────────────
skill('10-translate', 10, 'Transformations', 'Translations and reflections', ['A translation slides every point the same way: (x, y) → (x + a, y + b).', 'Reflect in the x-axis: (x, −y). In the y-axis: (−x, y). In y = x: (y, x). In y = −x: (−y, −x).'], (r) => {
  const v = r.int(0, 3), x = r.int(-5, 5), y = r.int(-5, 5), a = r.nonzero(-5, 5), b = r.nonzero(-5, 5);
  const words = (dx, dy) => `${Math.abs(dx)} unit${Math.abs(dx) === 1 ? '' : 's'} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} unit${Math.abs(dy) === 1 ? '' : 's'} ${dy > 0 ? 'up' : 'down'}`;
  const REF = [['the x-axis', (p, q) => [p, -q], 'The x-coordinate stays; the y-coordinate changes sign.'], ['the y-axis', (p, q) => [-p, q], 'The y-coordinate stays; the x-coordinate changes sign.'], ['the line y = x', (p, q) => [q, p], 'Swap the coordinates.'], ['the line y = −x', (p, q) => [-q, -p], 'Swap the coordinates and change both signs.']];
  if (v === 0) return ptItem(x + a, y + b, [`Moving ${words(a, b)} adds ${neg(a)} to x and ${neg(b)} to y.`, `x: ${neg(x)} ${sgn(a)} = ${neg(x + a)}; y: ${neg(y)} ${sgn(b)} = ${neg(y + b)}.`, `So the image is ${P(x + a, y + b)}.`], { q: `Point A${P(x, y)} is translated ${words(a, b)}. What are the coordinates of the image A′? Write them as (x, y).`, visual: { type: 'plane', points: [[x, y, 'A']], range: 6 } });
  if (v === 1) { const [nm, f, why] = r.pick(REF), [x2, y2] = f(x, y); return ptItem(x2, y2, [why, `${P(x, y)} becomes ${P(x2, y2)}.`, `So the image is ${P(x2, y2)}.`], { q: `Point B${P(x, y)} is reflected in ${nm}. What are the coordinates of the image? Write them as (x, y).`, visual: { type: 'plane', points: [[x, y, 'B']], range: 6 } }); }
  if (v === 2) { const rule = (p, q) => `(x, y) → (${lin([[1, 'x'], [p, '']])}, ${lin([[1, 'y'], [q, '']])})`; return mc(r, rule(a, b), [rule(-a, -b), rule(b, a), rule(a, -b)].filter((t) => t !== rule(a, b)), { q: `A translation maps ${P(x, y)} to ${P(x + a, y + b)}. Which rule describes it?`, steps: [`x changes by ${neg(x + a)} − ${par(x)} = ${neg(a)}; y changes by ${neg(y + b)} − ${par(y)} = ${neg(b)}.`, `So the rule is ${rule(a, b)}.`] }); }
  const [nm, f] = r.pick(REF.slice(0, 2)), [x2, y2] = f(x + a, y + b);
  return ptItem(x2, y2, [`First translate: ${P(x, y)} → ${P(x + a, y + b)}.`, `Then reflect in ${nm}: ${P(x + a, y + b)} → ${P(x2, y2)}.`, `So the final image is ${P(x2, y2)}.`], { q: `Point C${P(x, y)} is translated ${words(a, b)}, then reflected in ${nm}. Where does it end up? Write it as (x, y).` });
});
skill('10-rotate', 10, 'Transformations', 'Rotations and symmetry', ['About the origin: 90° anticlockwise (x, y) → (−y, x); 180° (x, y) → (−x, −y); 90° clockwise (x, y) → (y, −x).', 'Translations, reflections and rotations keep size and shape: they are congruence transformations.'], (r) => {
  const v = r.int(0, 3), x = r.nonzero(-5, 5), y = r.nonzero(-5, 5);
  if (v === 0) {
    const [nm, f, rule] = r.pick([['90° anticlockwise', (p, q) => [-q, p], '(x, y) → (−y, x)'], ['180°', (p, q) => [-p, -q], '(x, y) → (−x, −y)'], ['90° clockwise', (p, q) => [q, -p], '(x, y) → (y, −x)']]), [x2, y2] = f(x, y);
    return ptItem(x2, y2, [`A rotation of ${nm} about the origin follows ${rule}.`, `${P(x, y)} → ${P(x2, y2)}.`, `So the image is ${P(x2, y2)}.`], { q: `Point D${P(x, y)} is rotated ${nm} about the origin. What are the coordinates of the image? Write them as (x, y).`, visual: { type: 'plane', points: [[x, y, 'D']], range: 6 } });
  }
  if (v === 1) {
    const n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]);
    if (r.bool()) return num(360 / n, [`A regular polygon with ${n} sides looks the same after turning 1/${n} of a full turn.`, `360 ÷ ${n} = ${360 / n}.`, `So the smallest angle is ${360 / n}°.`], { q: `What is the smallest angle of rotation (more than 0°) that carries a regular polygon with ${n} sides onto itself, in degrees?`, expr: `360/${n}` });
    return num(n, ['A regular polygon has one line of symmetry for each side.', `It has ${n} sides.`, `So it has ${n} lines of symmetry.`], { q: `How many lines of symmetry does a regular polygon with ${n} sides have?`, expr: String(n) });
  }
  if (v === 2) {
    const M = [['(x, y) → (−x, y)', 'Reflection', 'Only the sign of x changes: a reflection in the y-axis.'], ['(x, y) → (x, −y)', 'Reflection', 'Only the sign of y changes: a reflection in the x-axis.'], ['(x, y) → (−y, x)', 'Rotation', 'This is a 90° anticlockwise rotation about the origin.'], ['(x, y) → (−x, −y)', 'Rotation', 'Both signs change: a 180° rotation about the origin.'], ['(x, y) → (x + 4, y − 1)', 'Translation', 'Every point slides 4 right and 1 down.'], ['(x, y) → (3x, 3y)', 'Dilation', 'Every coordinate is multiplied by 3: a dilation (not a congruence transformation).']];
    const [rule, right, why] = r.pick(M);
    return mc(r, right, ['Translation', 'Reflection', 'Rotation', 'Dilation'].filter((t) => t !== right), { q: `Which kind of transformation is ${rule}?`, steps: [why, `So it is a ${right.toLowerCase()}.`] });
  }
  const a = r.int(-3, 3), b = r.int(-3, 3), x2 = 2 * a - x, y2 = 2 * b - y;
  return ptItem(x2, y2, [`A 180° turn about ${P(a, b)} sends each point to the other side of the centre, the same distance away.`, `x: 2 × ${par(a)} − ${par(x)} = ${neg(x2)}; y: 2 × ${par(b)} − ${par(y)} = ${neg(y2)}.`, `So the image is ${P(x2, y2)}.`], { q: `Point E${P(x, y)} is rotated 180° about the point ${P(a, b)}. Where does it go? Write it as (x, y).` });
});
skill('10-dilate', 10, 'Transformations', 'Dilations', ['A dilation about the origin with scale factor k sends (x, y) to (kx, ky).', 'If k > 1 the figure gets bigger; if 0 < k < 1 it gets smaller. Lengths are multiplied by k, and lines stay parallel to their images.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const k = r.pick([2, 3, 0.5, 1.5]), x = r.int(-4, 4) * 2, y = r.int(-4, 4) * 2, x2 = k * x, y2 = k * y;
    return ptItem(x2, y2, [`Multiply both coordinates by ${k}.`, `${neg(x)} × ${k} = ${neg(x2)} and ${neg(y)} × ${k} = ${neg(y2)}.`, `So the image is ${P(x2, y2)}.`], { q: `Point F${P(x, y)} is dilated by a scale factor of ${k} about the origin. What are the coordinates of the image? Write them as (x, y).` });
  }
  if (v === 1) {
    const [n, d] = r.pick([[2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [5, 2], [4, 1]]), x = r.nonzero(-3, 3) * d, y = r.int(-3, 3) * d;
    return num(frac(n, d), [`Compare the x-coordinates: ${neg(x * n / d)} ÷ ${par(x)}.`, `= ${F(n, d)}.`, `So the scale factor is ${F(n, d)}.`], { q: `A dilation about the origin maps ${P(x, y)} to ${P(x * n / d, y * n / d)}. What is the scale factor?`, expr: `${x * n / d}/(${x})` });
  }
  if (v === 2) {
    const L = r.int(2, 15), k = r.pick([2, 3, 4, 0.5, 1.5, 2.5]), ans = dec(L * k);
    return num(ans, ['A dilation multiplies every length by the scale factor.', `${L} × ${k} = ${ans}.`, `So the image is ${ans} cm long.`], { q: `A segment is ${L} cm long. It is dilated by a scale factor of ${k}. How long is the image?`, expr: `${L}*${k}` });
  }
  if (r.bool()) {
    const k = r.pick([0.25, 0.5, 0.75, 1.5, 2, 3]), right = k > 1 ? 'An enlargement' : 'A reduction';
    return mc(r, right, [k > 1 ? 'A reduction' : 'An enlargement', 'A congruent copy'], { q: `A dilation has scale factor ${k}. Is the image an enlargement, a reduction, or a congruent copy?`, steps: [`The scale factor is ${k > 1 ? 'greater than 1' : 'between 0 and 1'}.`, `So the image is ${right.toLowerCase()}.`] });
  }
  return mc(r, 'A line parallel to the original line', ['A line perpendicular to the original line', 'A line through the centre of dilation', 'A curve'], { q: 'A line that does not pass through the centre of dilation is dilated with scale factor 2. What is its image?', steps: ['A dilation keeps the direction of lines; only lines through the centre map onto themselves.', 'So the image is a line parallel to the original.'] });
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
