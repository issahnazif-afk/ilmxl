// Grade 8 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const fr = (n, d) => frac(n, d).replace(/^-/, '−');                       // a fraction to show: −3/4
const mixed = (n, d) => {                                                   // 17/6 → "2 5/6"
  const [a, b] = simplify(n, d); if (b === 1) return neg(a);
  const s = a < 0 ? '−' : '', A = Math.abs(a), w = Math.floor(A / b);
  return w ? `${s}${w} ${A % b}/${b}` : `${s}${A % b}/${b}`;
};
const money = (x) => `$${x.toFixed(2)}`;
const pl = (w, n) => { w = w.toLowerCase(); if (n === 1) return w; const [h, ...t] = w.split(' of '); return (/(ch|sh|x|s)$/.test(h) ? h + 'es' : h + 's') + (t.length ? ' of ' + t.join(' of ') : ''); };
const factorsOf = (n) => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
const primeFactors = (n) => { const f = []; for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; } return f; };
const powerForm = (n) => { const c = {}; primeFactors(n).forEach((p) => (c[p] = (c[p] ?? 0) + 1)); return Object.entries(c).map(([p, e]) => (e > 1 ? `${p}^${e}` : p)).join(' × '); };
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const cmp = (a, b) => (Math.abs(a - b) < 1e-9 ? '=' : a < b ? '<' : '>');
const term = (c, v, first = false) => {                                     // 3x, −x, + 4y, − 2y
  if (first) return `${c === 1 ? '' : c === -1 ? '−' : neg(c)}${v}`;
  const k = Math.abs(c); return `${c < 0 ? '−' : '+'} ${k === 1 ? '' : k}${v}`;
};
const lin = (a, b, v = 'x') => (a === 0 ? neg(b) : `${term(a, v, true)}${b ? ` ${sgn(b)}` : ''}`);   // ax + b

// ───────────── 1. Number theory ─────────────
skill('8-factors', 8, 'Number theory', 'Factors, divisibility and primes', ['A factor divides a number with nothing left over.', 'A prime has exactly two factors: 1 and itself. A composite number has more.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const n = r.pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 64, 72, 80, 84, 90, 96, 100]);
    const f = factorsOf(n), pairs = f.filter((x) => x * x <= n).map((x) => `${x} × ${n / x}`);
    return num(f.length, [`Find factor pairs: ${pairs.join(', ')}.`, `The factors are ${f.join(', ')}.`, `Count them: ${n} has ${f.length} factors.`], { q: `How many factors does ${n} have?` });
  }
  if (t === 1) {
    const d = r.pick([3, 4, 6, 9]);
    const rule = { 3: 'the sum of the digits is a multiple of 3', 4: 'the last two digits make a multiple of 4', 6: 'it is even and its digit sum is a multiple of 3', 9: 'the sum of the digits is a multiple of 9' }[d];
    const right = d * r.int(Math.ceil(100 / d), Math.floor(999 / d));
    const wrongs = []; while (wrongs.length < 3) { const w = r.int(100, 999); if (w % d && !wrongs.includes(w)) wrongs.push(w); }
    const ds = String(right).split('').map(Number);
    return mc(r, right, wrongs, { q: `Which number is divisible by ${d}?`, steps: [`A number is divisible by ${d} when ${rule}.`, d === 4 ? `${right}: the last two digits are ${String(right).slice(-2)}, a multiple of 4.` : `${right}: ${ds.join(' + ')} = ${sum(ds)}${d === 6 ? ', and it is even' : ''}.`, `So ${right} is divisible by ${d}.`] });
  }
  const n = r.int(21, 99), p = isPrime(n);
  const f = factorsOf(n).find((x) => x > 1 && x < n);
  return mc(r, p ? 'prime' : 'composite', [p ? 'composite' : 'prime'], { q: `Is ${n} prime or composite?`, steps: p ? [`Try dividing ${n} by 2, 3, 5 and 7 (the primes up to √${n}).`, `None of them divide it, so ${n} has only the factors 1 and ${n}: prime.`] : [`${n} = ${f} × ${n / f}.`, 'It has a factor other than 1 and itself, so it is composite.'] });
});
skill('8-primefact', 8, 'Number theory', 'Prime factorization', ['Break a number into primes with a factor tree.', 'Write repeated primes with exponents: 72 = 2^3 × 3^2.'], (r) => {
  if (r.bool()) {
    const n = r.pick([24, 36, 40, 45, 48, 54, 56, 60, 72, 75, 80, 84, 88, 90, 96, 98, 100, 108, 112, 120, 126, 135, 144, 150, 162, 168, 180, 196, 200, 225, 250]);
    const right = powerForm(n), pf = primeFactors(n);
    const wrongs = [powerForm(n * 2), powerForm(n / pf[0] * (pf[0] === 2 ? 3 : 2)), pf.join(' + ')].filter((w) => w !== right);
    return mc(r, right, wrongs, { q: `What is the prime factorization of ${n}?`, steps: [`Divide by primes: ${n} = ${pf.join(' × ')}.`, `Group repeats with exponents: ${right}.`] });
  }
  const a = r.int(1, 4), b = r.int(0, 2), c = r.int(0, 2), n = 2 ** a * 3 ** b * 5 ** c;
  const pw = (p, e) => (e === 1 ? String(p) : `${p}^${e}`), parts = [pw(2, a), ...(b ? [pw(3, b)] : []), ...(c ? [pw(5, c)] : [])];
  return num(n, [`Work out each power: 2^${a} = ${2 ** a}${b ? `, 3^${b} = ${3 ** b}` : ''}${c ? `, 5^${c} = ${5 ** c}` : ''}.`, `Multiply: ${[2 ** a, ...(b ? [3 ** b] : []), ...(c ? [5 ** c] : [])].join(' × ')} = ${n}.`, `So the number is ${n}.`], { q: `A number has prime factorization ${parts.join(' × ')}. What is the number?`, expr: `2**${a}*3**${b}*5**${c}` });
});
skill('8-gcflcm', 8, 'Number theory', 'GCF and LCM', ['The greatest common factor (GCF) is the biggest number that divides both.', 'The least common multiple (LCM) is the smallest number both divide into.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0 || t === 2) {
    const g = r.int(2, 12); const a = r.int(2, 9); let b = r.int(2, 9); while (gcd(a, b) !== 1 || a === b) b = r.int(2, 9);
    const A = g * a, B = g * b;
    if (t === 0) return num(g, [`Factors of ${A}: ${factorsOf(A).join(', ')}.`, `Factors of ${B}: ${factorsOf(B).join(', ')}.`, `The greatest one in both lists is ${g}.`, `So the GCF is ${g}.`], { q: `Find the GCF of ${A} and ${B}.`, expr: `${g}` });
    const n = r.pick(NAMES);
    return num(g, [`Every bag must have the same number of each, so the number of bags must divide both ${A} and ${B}.`, `The most bags is the GCF of ${A} and ${B}.`, `GCF = ${g}, so ${n} can make ${g} bags.`], { q: `${n} has ${A} pencils and ${B} erasers. What is the greatest number of identical gift bags ${n} can make, using every item?`, expr: `${g}` });
  }
  const a = r.int(3, 15); let b = r.int(3, 15); while (a === b) b = r.int(3, 15);
  const L = lcm(a, b), big = Math.max(a, b);
  if (t === 1) return num(L, [`Multiples of ${big}: ${multiplesOf(big, L / big).join(', ')}.`, `The first one that ${Math.min(a, b)} also divides is ${L}.`, `So the LCM is ${L}.`], { q: `Find the LCM of ${a} and ${b}.`, expr: `${L}` });
  return num(L, [`One bus is back every ${a} minutes, the other every ${b} minutes.`, `They meet at a common multiple. The first one is the LCM of ${a} and ${b}.`, `LCM = ${L}, so they meet again in ${L} minutes.`], { q: `Two buses leave a station together. One returns every ${a} minutes, the other every ${b} minutes. In how many minutes will they next be at the station together?`, expr: `${L}` });
});
skill('8-classify', 8, 'Number theory', 'Classify numbers', ['Whole numbers: 0, 1, 2, … Integers add the negatives.', 'Rational numbers can be written as a fraction of integers; irrational numbers cannot.'], (r) => {
  const t = r.int(0, 3);
  const labels = ['whole number', 'integer, but not whole', 'rational, but not an integer', 'irrational'];
  let x, why;
  if (t === 0) { x = String(r.int(0, 60)); why = 'It has no sign and no fraction part, so it is a whole number.'; }
  else if (t === 1) { x = neg(-r.int(1, 60)); why = 'It is negative with no fraction part, so it is an integer but not a whole number.'; }
  else if (t === 2) {
    if (r.bool()) { const d = r.pick([3, 4, 5, 7, 8]); let n = r.int(1, 20); if (n % d === 0) n++; x = (r.bool() ? '−' : '') + fr(n, d); }
    else { let k = r.int(11, 99); if (k % 10 === 0) k++; x = (r.bool() ? '−' : '') + dec(k / 10); }
    why = 'It can be written as a fraction of integers, but it is not a whole step on the number line, so it is rational but not an integer.';
  } else { x = r.pick(['√2', '√3', '√5', 'π', '√7', '√11', '0.1010010001…']); why = 'It cannot be written as a fraction: its decimal never ends and never repeats.'; }
  return mc(r, labels[t], labels.filter((_, i) => i !== t), { q: `Which best describes ${x}?`, steps: [why, `So ${x} is: ${labels[t]}.`] });
});

// ───────────── 2. Integers ─────────────
skill('8-absval', 8, 'Integers', 'Absolute value and opposites', ['Absolute value is distance from 0, so it is never negative.', 'Opposites are the same distance from 0 on different sides: 6 and −6.'], (r) => {
  const t = r.int(0, 3), a = r.nonzero(-30, 30);
  if (t === 0) return num(Math.abs(a), [St(`${neg(a)} is ${Math.abs(a)} steps from 0.`, numberLine(Math.min(a, 0) - 1, Math.max(a, 0) + 1, { marks: [a] })), `So |${neg(a)}| = ${Math.abs(a)}.`], { q: `What is |${neg(a)}|?`, expr: `Math.abs(${a})` });
  if (t === 1) return num(-a, ['The opposite of a number is on the other side of 0, the same distance away.', `The opposite of ${neg(a)} is ${neg(-a)}.`], { q: `What is the opposite of ${neg(a)}?`, expr: `-(${a})` });
  if (t === 2) { const b = r.nonzero(-20, 20); return num(Math.abs(a) - Math.abs(b), [`|${neg(a)}| = ${Math.abs(a)} and |${neg(b)}| = ${Math.abs(b)}.`, `${Math.abs(a)} − ${Math.abs(b)} = ${neg(Math.abs(a) - Math.abs(b))}.`], { q: `Evaluate |${neg(a)}| − |${neg(b)}|.`, expr: `Math.abs(${a})-Math.abs(${b})` }); }
  const d = r.int(5, 60);
  return num(d, [`Below sea level is negative: the diver is at −${d} m.`, `Distance from the surface is |−${d}| = ${d}.`, `So the diver is ${d} m from the surface.`], { q: `A diver is at −${d} m (below sea level). How many metres is the diver from the surface?`, unit: 'm', expr: `Math.abs(-${d})` });
});
skill('8-intorder', 8, 'Integers', 'Compare and order integers', ['On a number line, numbers get bigger to the right.', 'Any negative number is less than 0 and less than every positive number.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const x = r.int(-9, 9);
    return num(x, [St('Count the ticks from 0 to the dot.', numberLine(-10, 10, { marks: [x] })), `The dot is ${x < 0 ? `${-x} to the left of` : x > 0 ? `${x} to the right of` : 'at'} 0, so it is at ${neg(x)}.`], { q: 'Which integer does the dot show?', visual: numberLine(-10, 10, { marks: [x] }), expr: `${x}` });
  }
  if (t === 1) {
    const a = r.nonzero(-15, 15), b = r.nonzero(-15, 15), absA = r.bool(), absB = r.bool();
    const va = absA ? Math.abs(a) : a, vb = absB ? Math.abs(b) : b;
    const sa = absA ? `|${neg(a)}|` : neg(a), sb = absB ? `|${neg(b)}|` : neg(b), s = cmp(va, vb);
    return mc(r, s, ['<', '>', '='].filter((x) => x !== s), { q: `Which sign goes in the box? ${sa} ☐ ${sb}`, steps: [`${sa} = ${neg(va)} and ${sb} = ${neg(vb)}.`, `${neg(va)} ${s} ${neg(vb)}, so ${sa} ${s} ${sb}.`] });
  }
  const xs = []; while (xs.length < 4) { const v = xs.length < 2 ? -r.int(1, 20) : r.nonzero(-20, 20); if (!xs.includes(v) && !xs.includes(-v)) xs.push(v); }
  const up = r.bool(), sorted = [...xs].sort((a, b) => (up ? a - b : b - a)).map(neg);
  const right = sorted.join(', ');
  const w1 = [...xs].sort((a, b) => (up ? Math.abs(a) - Math.abs(b) : Math.abs(b) - Math.abs(a))).map(neg).join(', ');
  const w2 = [...sorted].reverse().join(', ');
  const w3 = [...xs].sort((a, b) => (up ? Math.abs(b) - Math.abs(a) : Math.abs(a) - Math.abs(b))).map(neg).join(', ');
  return mc(r, right, [w1, w2, w3], { q: `Put in order from ${up ? 'least to greatest' : 'greatest to least'}: ${r.shuffle(xs).map(neg).join(', ')}`, steps: ['Negative numbers further from 0 are smaller.', `${up ? 'Least to greatest' : 'Greatest to least'}: ${right}.`] });
});

// ───────────── 3. Operations with integers ─────────────
skill('8-intaddsub', 8, 'Integer operations', 'Add and subtract integers', ['Adding a negative moves left; subtracting a negative moves right.', 'Subtracting a number is the same as adding its opposite.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.nonzero(-20, 20), b = r.nonzero(-20, 20), c = r.nonzero(-20, 20), o1 = r.pick(['+', '−']), o2 = r.pick(['+', '−']);
    const s1 = o1 === '+' ? a + b : a - b, ans = o2 === '+' ? s1 + c : s1 - c;
    return num(ans, [`Change each subtraction to adding the opposite: ${neg(a)} + ${par(o1 === '+' ? b : -b)} + ${par(o2 === '+' ? c : -c)}.`, `Left to right: ${neg(a)} ${o1} ${par(b)} = ${neg(s1)}.`, `Then ${neg(s1)} ${o2} ${par(c)} = ${neg(ans)}.`], { q: `${neg(a)} ${o1} ${par(b)} ${o2} ${par(c)} = ?`, expr: `(${a})${o1 === '+' ? '+' : '-'}(${b})${o2 === '+' ? '+' : '-'}(${c})` });
  }
  if (t === 1) {
    const a = r.nonzero(-15, 15), x = r.nonzero(-15, 15), add = r.bool(), res = add ? a + x : a - x;
    return num(x, [add ? `Undo the adding: ? = ${neg(res)} − ${par(a)}.` : `${neg(a)} − ? = ${neg(res)}, so ? = ${neg(a)} − ${par(res)}.`, `? = ${neg(x)}.`, `Check: ${neg(a)} ${add ? '+' : '−'} ${par(x)} = ${neg(res)}. So the missing number is ${neg(x)}.`], { q: `Find the missing number: ${neg(a)} ${add ? '+' : '−'} ? = ${neg(res)}`, expr: add ? `(${res})-(${a})` : `(${a})-(${res})` });
  }
  if (t === 2) {
    const start = r.int(-15, 5), drop = r.int(3, 18), rise = r.int(2, 12), ans = start - drop + rise, town = r.pick(['Whitehorse', 'Yellowknife', 'Iqaluit', 'Winnipeg']);
    return num(ans, [`Start at ${neg(start)} °C.`, `Fall ${drop}: ${neg(start)} − ${drop} = ${neg(start - drop)}.`, `Rise ${rise}: ${neg(start - drop)} + ${rise} = ${neg(ans)}.`, `So it was ${neg(ans)} °C.`], { q: `In ${town} it was ${neg(start)} °C at 18:00. Overnight it fell ${drop} degrees, then by noon it rose ${rise} degrees. What was the temperature at noon?`, unit: '°C', expr: `${start}-${drop}+${rise}` });
  }
  const a = r.nonzero(-25, 25), b = r.nonzero(-25, 25);
  return num(a - b, [`Subtracting ${neg(b)} is the same as adding ${neg(-b)}.`, `${neg(a)} + ${par(-b)} = ${neg(a - b)}.`, `So ${neg(a)} − ${par(b)} = ${neg(a - b)}.`], { q: `${neg(a)} − ${par(b)} = ?`, expr: `(${a})-(${b})` });
});
skill('8-intmuldiv', 8, 'Integer operations', 'Multiply and divide integers', ['Same signs give a positive answer.', 'Different signs give a negative answer.'], (r) => {
  const t = r.int(0, 3), b = r.nonzero(-12, 12); let a = r.nonzero(-12, 12); if (a > 0 && b > 0) a = -a; const p = a * b;
  const rule = (x, y) => (Math.sign(x) === Math.sign(y) ? 'The signs are the same, so the answer is positive.' : 'The signs are different, so the answer is negative.');
  if (t === 0) return num(p, [`${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(p)}.`, rule(a, b), `So ${neg(a)} × ${par(b)} = ${neg(p)}.`], { q: `${neg(a)} × ${par(b)} = ?`, expr: `(${a})*(${b})` });
  if (t === 1) return num(a, [`${Math.abs(p)} ÷ ${Math.abs(b)} = ${Math.abs(a)}.`, rule(p, b), `So ${neg(p)} ÷ ${par(b)} = ${neg(a)}.`], { q: `${neg(p)} ÷ ${par(b)} = ?`, expr: `(${p})/(${b})` });
  if (t === 2) return num(b, [`? = ${neg(p)} ÷ ${par(a)}.`, `${Math.abs(p)} ÷ ${Math.abs(a)} = ${Math.abs(b)}, and the sign is ${b < 0 ? 'negative' : 'positive'}.`, `So the missing number is ${neg(b)}.`], { q: `Find the missing number: ${neg(a)} × ? = ${neg(p)}`, expr: `(${p})/(${a})` });
  const k = r.int(3, 5), signs = Array.from({ length: k }, () => r.bool()), negs = signs.filter(Boolean).length;
  const right = negs % 2 ? 'negative' : 'positive';
  const fs = signs.map((s) => (s ? `(${neg(-r.int(1, 9))})` : String(r.int(1, 9)))).join(' × ');
  return mc(r, right, [right === 'negative' ? 'positive' : 'negative', 'zero'], { q: `Without working it out, is ${fs} positive or negative?`, steps: [`Count the negative factors: ${negs}.`, `An ${negs % 2 ? 'odd' : 'even'} number of negatives gives a ${right} product.`] });
});
skill('8-intexpr', 8, 'Integer operations', 'Integer expressions', ['Brackets first, then powers, then × and ÷ left to right, then + and − left to right.', 'Keep track of the sign at each step.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const a = r.nonzero(-10, 10), b = r.nonzero(-6, 6), c = r.nonzero(-6, 6), ans = a + b * c;
    return num(ans, [`Multiply first: ${par(b)} × ${par(c)} = ${neg(b * c)}.`, `Then add: ${neg(a)} + ${par(b * c)} = ${neg(ans)}.`], { q: `Evaluate: ${neg(a)} + ${par(b)} × ${par(c)}`, expr: `(${a})+(${b})*(${c})` });
  }
  if (t === 1) {
    const a = r.nonzero(-10, 10), b = r.nonzero(-10, 10), c = r.nonzero(-5, 5), ans = (a - b) * c;
    return num(ans, [`Brackets first: ${neg(a)} − ${par(b)} = ${neg(a - b)}.`, `Then multiply: ${par(a - b)} × ${par(c)} = ${neg(ans)}.`], { q: `Evaluate: (${neg(a)} − ${par(b)}) × ${par(c)}`, expr: `((${a})-(${b}))*(${c})` });
  }
  const d = r.nonzero(-5, 5), q = r.nonzero(-8, 8), a = d * q, e = r.nonzero(-4, 4), f = r.nonzero(-9, 9), ans = q - e * e + f;
  return num(ans, [`Power first: ${par(e)}^2 = ${e * e}.`, `Divide: ${neg(a)} ÷ ${par(d)} = ${neg(q)}.`, `Then left to right: ${neg(q)} − ${e * e} ${sgn(f)} = ${neg(ans)}.`], { q: `Evaluate: ${neg(a)} ÷ ${par(d)} − ${par(e)}^2 ${sgn(f)}`, expr: `(${a})/(${d})-(${e})**2+(${f})` });
});

// ───────────── 4. Operations with fractions ─────────────
const coprime = (r, d) => { let n; do n = r.int(1, d - 1); while (gcd(n, d) !== 1); return n; };
const fpair = (r, dens = [2, 3, 4, 5, 6, 8, 10, 12]) => { const d = r.pick(dens); return [coprime(r, d), d]; };
skill('8-fracadd', 8, 'Fractions', 'Add and subtract fractions and mixed numbers', ['To add or subtract, first give the fractions a common denominator.', 'Then add or subtract the numerators, and write the answer in lowest terms.'], (r) => {
  const t = r.int(0, 5);
  if (t === 0) {
    const [n, d] = fpair(r, [3, 4, 5, 6, 7, 8, 9, 10, 12]), k = r.int(2, 9), N = n * k, D = d * k;
    return num(`${n}/${d}`, [`Find the GCF of ${N} and ${D}: it is ${k}.`, `Divide top and bottom by ${k}: ${N} ÷ ${k} = ${n}, ${D} ÷ ${k} = ${d}.`, `So ${N}/${D} = ${n}/${d} in lowest terms.`], { q: `Write ${N}/${D} in lowest terms.`, exactForm: 'fraction', expr: `${N}/${D}` });
  }
  const [a, b] = fpair(r); let [c, d] = fpair(r); while (d === b) [c, d] = fpair(r);
  const L = lcm(b, d), A = a * (L / b), C = c * (L / d);
  if (t === 1) return num(L, [`Multiples of ${Math.max(b, d)}: ${multiplesOf(Math.max(b, d), L / Math.max(b, d)).join(', ')}.`, `The first one ${Math.min(b, d)} also divides is ${L}.`, `So the least common denominator is ${L}.`], { q: `What is the least common denominator of ${a}/${b} and ${c}/${d}?`, expr: `${L}` });
  if (t === 2 || t === 4) {
    let sub = r.bool(), [p, P, q, Q, pn, qn] = [a, b, c, d, A, C];
    if (sub && pn < qn) [p, P, q, Q, pn, qn] = [c, d, a, b, C, A];
    const top = sub ? pn - qn : pn + qn, ans = frac(top, L);
    const steps = [St(`The least common denominator of ${P} and ${Q} is ${L}.`), St(`Rewrite: ${p}/${P} = ${pn}/${L} and ${q}/${Q} = ${qn}/${L}.`, L <= 24 ? fractionBars([{ n: pn, d: L, label: `${p}/${P}` }, { n: qn, d: L, label: `${q}/${Q}` }]) : null), St(`${pn}/${L} ${sub ? '−' : '+'} ${qn}/${L} = ${top}/${L}.`), St(`In lowest terms that is ${ans}.`)];
    if (t === 2) return num(ans, steps, { q: `${p}/${P} ${sub ? '−' : '+'} ${q}/${Q} = ?`, expr: `${p}/${P}${sub ? '-' : '+'}${q}/${Q}` });
    const n = r.pick(NAMES), what = r.pick([['km', 'ran'], ['L of water', 'drank'], ['kg of flour', 'used']]);
    return num(ans, steps, { q: sub ? `${n} ${what[1]} ${p}/${P} ${what[0]} on Saturday and ${q}/${Q} ${what[0]} on Sunday. How much more on Saturday?` : `${n} ${what[1]} ${p}/${P} ${what[0]} on Saturday and ${q}/${Q} ${what[0]} on Sunday. How much in all?`, expr: `${p}/${P}${sub ? '-' : '+'}${q}/${Q}` });
  }
  if (t === 3) {
    const w1 = r.int(1, 6), w2 = r.int(1, 5), sub = r.bool();
    let N1 = w1 * b + a, D1 = b, N2 = w2 * d + c, D2 = d;
    if (sub && N1 / D1 < N2 / D2) [N1, D1, N2, D2] = [N2, D2, N1, D1];
    const top = sub ? N1 * (L / D1) - N2 * (L / D2) : N1 * (L / D1) + N2 * (L / D2), ans = frac(top, L);
    return num(ans, [`Change to improper fractions: ${mixed(N1, D1)} = ${N1}/${D1} and ${mixed(N2, D2)} = ${N2}/${D2}.`, `Use denominator ${L}: ${N1 * (L / D1)}/${L} ${sub ? '−' : '+'} ${N2 * (L / D2)}/${L} = ${top}/${L}.`, `So the answer is ${ans}${ans.includes('/') && top > L ? `, which is ${mixed(top, L)}` : ''}.`], { q: `${mixed(N1, D1)} ${sub ? '−' : '+'} ${mixed(N2, D2)} = ?`, expr: `${N1}/${D1}${sub ? '-' : '+'}${N2}/${D2}` });
  }
  const s = A + C, sym = cmp(s, L);
  return mc(r, sym, ['<', '>', '='].filter((x) => x !== sym), { q: `Which sign makes this true? ${a}/${b} + ${c}/${d} ☐ 1`, steps: [`Use denominator ${L}: ${A}/${L} + ${C}/${L} = ${s}/${L}.`, `1 = ${L}/${L}, and ${s} ${sym} ${L}.`, `So ${a}/${b} + ${c}/${d} ${sym} 1.`] });
});
skill('8-fracmul', 8, 'Fractions', 'Multiply fractions and mixed numbers', ['Multiply the tops, multiply the bottoms, then simplify.', 'Change mixed numbers to improper fractions first. A reciprocal flips a fraction: 2/5 becomes 5/2.'], (r) => {
  const t = r.int(0, 5), [a, b] = fpair(r, [2, 3, 4, 5, 6, 7, 8, 9]), [c, d] = fpair(r, [2, 3, 4, 5, 6, 8, 10]);
  if (t === 0) { const ans = frac(a * c, b * d); return num(ans, [`Multiply the tops: ${a} × ${c} = ${a * c}.`, `Multiply the bottoms: ${b} × ${d} = ${b * d}.`, `${a * c}/${b * d} in lowest terms is ${ans}.`], { q: `${a}/${b} × ${c}/${d} = ?`, expr: `${a}/${b}*${c}/${d}` }); }
  if (t === 1) {
    const n = b * r.int(2, 12), ans = frac(n * a, b);
    return num(ans, [`"of" means multiply: ${a}/${b} × ${n}.`, `${n} ÷ ${b} = ${n / b}, then × ${a} = ${n * a / b}.`, `So ${a}/${b} of ${n} is ${ans}.`], { q: `What is ${a}/${b} of ${n}?`, expr: `${a}/${b}*${n}` });
  }
  const w1 = r.int(1, 3), w2 = r.int(1, 3), N1 = w1 * b + a, N2 = w2 * d + c;
  if (t === 2) {
    const ans = frac(N1 * N2, b * d);
    return num(ans, [`Improper fractions: ${mixed(N1, b)} = ${N1}/${b}, ${mixed(N2, d)} = ${N2}/${d}.`, `Multiply: ${N1} × ${N2} = ${N1 * N2} and ${b} × ${d} = ${b * d}.`, `${N1 * N2}/${b * d} = ${ans}${ans.includes('/') ? ` = ${mixed(N1 * N2, b * d)}` : ''}.`], { q: `${mixed(N1, b)} × ${mixed(N2, d)} = ?`, expr: `${N1}/${b}*${N2}/${d}` });
  }
  if (t === 3) {
    const form = r.int(0, 2);
    if (form === 0) return num(frac(b, a), [`Flip the fraction: the reciprocal of ${a}/${b} is ${b}/${a}.`, `Check: ${a}/${b} × ${b}/${a} = 1. So it is ${frac(b, a)}.`], { q: `What is the reciprocal of ${a}/${b}?`, expr: `${b}/${a}` });
    if (form === 1) { const n = r.int(2, 15); return num(`1/${n}`, [`${n} = ${n}/1.`, `Flip it: the reciprocal is 1/${n}.`], { q: `What is the reciprocal of ${n}?`, expr: `1/${n}` }); }
    return num(frac(b, N1), [`Change to an improper fraction: ${mixed(N1, b)} = ${N1}/${b}.`, `Flip it: the reciprocal is ${frac(b, N1)}.`], { q: `What is the reciprocal of ${mixed(N1, b)}?`, expr: `${b}/${N1}` });
  }
  if (t === 4) {
    const n = r.pick(NAMES), ans = frac(N2 * a, d * b);
    return num(ans, [`Find ${a}/${b} of ${mixed(N2, d)}: multiply.`, `${a}/${b} × ${N2}/${d} = ${a * N2}/${b * d}.`, `In lowest terms that is ${ans} cups${ans.includes('/') && a * N2 > b * d ? ` (${mixed(a * N2, b * d)})` : ''}.`], { q: `A recipe needs ${mixed(N2, d)} cups of flour. ${n} makes only ${a}/${b} of the recipe. How many cups of flour does ${n} need?`, expr: `${a}/${b}*${N2}/${d}` });
  }
  const [e, f] = fpair(r, [2, 3, 4, 6]), p = simplify(a * c, b * d), ans = frac(p[0] * f + e * p[1], p[1] * f);
  return num(ans, [`Multiply first: ${a}/${b} × ${c}/${d} = ${frac(a * c, b * d)}.`, `Then add: ${frac(a * c, b * d)} + ${e}/${f}, with denominator ${lcm(p[1], f)}.`, `The answer is ${ans}.`], { q: `Evaluate: ${a}/${b} × ${c}/${d} + ${e}/${f}`, expr: `${a}/${b}*${c}/${d}+${e}/${f}` });
});
skill('8-fracdiv', 8, 'Fractions', 'Divide fractions and mixed numbers', ['To divide by a fraction, multiply by its reciprocal.', '3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2.'], (r) => {
  const t = r.int(0, 4), [a, b] = fpair(r, [2, 3, 4, 5, 6, 8]), [c, d] = fpair(r, [2, 3, 4, 5, 6, 8, 9]);
  if (t === 0) {
    const n = r.int(2, 12), k = r.int(2, 8);
    if (r.bool()) return num(n * k, [`How many 1/${k}s fit in ${n}? Each whole holds ${k} of them.`, `${n} ÷ 1/${k} = ${n} × ${k} = ${n * k}.`], { q: `${n} ÷ 1/${k} = ?`, expr: `${n}/(1/${k})` });
    return num(`1/${n * k}`, [`Dividing by ${n} is multiplying by 1/${n}.`, `1/${k} × 1/${n} = 1/${n * k}.`], { q: `1/${k} ÷ ${n} = ?`, expr: `(1/${k})/${n}` });
  }
  if (t === 1) {
    const ans = frac(a * d, b * c);
    return num(ans, [`Keep ${a}/${b}, change ÷ to ×, and flip ${c}/${d} to ${d}/${c}.`, `${a}/${b} × ${d}/${c} = ${a * d}/${b * c}.`, `In lowest terms that is ${ans}.`], { q: `${a}/${b} ÷ ${c}/${d} = ?`, expr: `(${a}/${b})/(${c}/${d})` });
  }
  if (t === 2) {
    const w1 = r.int(1, 5), w2 = r.int(1, 2), N1 = w1 * b + a, N2 = w2 * d + c, ans = frac(N1 * d, b * N2);
    return num(ans, [`Improper fractions: ${mixed(N1, b)} = ${N1}/${b} and ${mixed(N2, d)} = ${N2}/${d}.`, `Multiply by the reciprocal: ${N1}/${b} × ${d}/${N2} = ${N1 * d}/${b * N2}.`, `In lowest terms that is ${ans}.`], { q: `${mixed(N1, b)} ÷ ${mixed(N2, d)} = ?`, expr: `(${N1}/${b})/(${N2}/${d})` });
  }
  if (t === 3) {
    const q = r.pick([2, 3, 4, 8]), p = coprime(r, q), k = r.int(3, 12), total = simplify(k * p, q);
    return num(k, [`Divide the total by the length of one piece: ${mixed(total[0], total[1])} ÷ ${p}/${q}.`, `${total[0]}/${total[1]} × ${q}/${p} = ${k}.`, `So there are ${k} pieces.`], { q: `A ribbon is ${mixed(total[0], total[1])} m long. It is cut into pieces that are each ${p}/${q} m long. How many pieces are there?`, expr: `(${total[0]}/${total[1]})/(${p}/${q})` });
  }
  const n = r.int(2, 6), ans = frac(a, b * n);
  return num(ans, [`Share ${a}/${b} into ${n} equal parts: ${a}/${b} ÷ ${n}.`, `${a}/${b} × 1/${n} = ${a}/${b * n}.`, `Each friend gets ${ans} of the pizza.`], { q: `${n} friends share ${a}/${b} of a pizza equally. What fraction of the whole pizza does each friend get?`, expr: `(${a}/${b})/${n}` });
});

// ───────────── 5. Rational numbers ─────────────
const D = (x) => neg(+dec(x));                     // a decimal to show: −2.5
const P = (x) => (x < 0 ? `(${D(x)})` : D(x));      // in brackets when negative
const TERM = [2, 4, 5, 8, 10, 20, 25, 50];
const pow10For = (d) => [10, 100, 1000].find((p) => p % d === 0);
skill('8-ratconv', 8, 'Rational numbers', 'Decimals, fractions and rounding', ['A decimal names tenths, hundredths or thousandths, so it can be written as a fraction.', 'To round, look at the digit just after the place you want: 5 or more rounds up.'], (r) => {
  const t = r.int(0, 4);
  if (t <= 1) {
    const d = r.pick(TERM); let n = r.int(1, 3 * d); if (n % d === 0) n++;
    const sg = r.bool(0.3) ? -1 : 1, p = pow10For(d), k = p / d, x = sg * n / d;
    if (t === 0) return num(frac(sg * n, d), [`${D(x)} = ${neg(sg * n * k)}/${p}.`, `Simplify: ${neg(sg * n * k)}/${p} = ${fr(sg * n, d)}.`, `So the fraction is ${fr(sg * n, d)}.`], { q: `Write ${D(x)} as a fraction in lowest terms.`, exactForm: 'fraction', expr: `${sg * n}/${d}` });
    return num(dec(x), [`Make the denominator ${p}: multiply top and bottom by ${k}.`, `${fr(sg * n, d)} = ${neg(sg * n * k)}/${p} = ${D(x)}.`, `So the decimal is ${D(x)}.`], { q: `Write ${fr(sg * n, d)} as a decimal.`, expr: `${sg * n}/${d}` });
  }
  if (t === 2) {
    const fs = r.shuffle([[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [4, 9], [7, 9], [1, 11], [3, 11], [5, 12], [7, 12], [2, 9]]).slice(0, 4);
    const show = ([n, d]) => (Math.floor((n / d) * 10000) / 10000).toFixed(4) + '…';
    const [n, d] = fs[0];
    return mc(r, show(fs[0]), fs.slice(1).map(show), { q: `Which decimal equals ${n}/${d}?`, steps: [`Divide: ${n} ÷ ${d} = ${show(fs[0])}`, 'The digits repeat forever, so it is a repeating decimal (still rational).', `So ${n}/${d} = ${show(fs[0])}`] });
  }
  if (t === 3) {
    const N = r.int(10001, 99999), x = N / 1000, p = r.int(0, 2), name = ['whole number', 'tenth', 'hundredth'][p];
    const q = Math.round(N / 10 ** (3 - p)), ans = dec(q / 10 ** p), next = Math.floor(N / 10 ** (2 - p)) % 10;
    return num(ans, [`Look at the digit after the ${name}s place: it is ${next}.`, next >= 5 ? `${next} is 5 or more, so round up.` : `${next} is less than 5, so round down.`, `${dec(x)} rounds to ${ans}.`], { q: `Round ${dec(x)} to the nearest ${name}.`, expr: `Math.round(${N}/${10 ** (3 - p)})/${10 ** p}`, tol: 1e-6 });
  }
  const d = r.pick([3, 4, 5, 6, 7, 8, 9, 10]); let n = r.int(1, d - 1); if (2 * n === d) n++;
  const w = r.int(1, 20), up = 2 * n > d, ans = up ? w + 1 : w;
  return num(ans, [`Compare ${n}/${d} with 1/2: ${n}/${d} is ${up ? 'more' : 'less'} than ${d / 2}/${d}.`, `So round ${up ? 'up' : 'down'}: ${mixed(w * d + n, d)} rounds to ${ans}.`], { q: `Round ${mixed(w * d + n, d)} to the nearest whole number.`, expr: `Math.round(${w}+${n}/${d})` });
});
skill('8-ratcompare', 8, 'Rational numbers', 'Compare and order rational numbers', ['Write the numbers the same way, as decimals, before you compare.', 'On a number line, the number further right is greater.'], (r) => {
  const t = r.int(0, 2);
  const rat = () => { const d = r.pick([2, 3, 4, 5, 8, 10]); const n = r.nonzero(-3 * d, 3 * d); return r.bool() ? { v: n / d, s: n % d === 0 ? neg(n / d) : (n < 0 ? '−' : '') + mixed(Math.abs(n), d) } : { v: +dec(n / d, 2), s: D(+dec(n / d, 2)) }; };
  if (t === 0) {
    const d = r.pick([2, 3, 4, 5, 8]), n = r.nonzero(-2 * d, 2 * d), v = n / d, fs = fr(n, d);
    const other = +dec(r.pick([v, v + 0.05, v - 0.05, v + 0.1, -v]), 2), sym = cmp(v, other);
    const flip = r.bool(), left = flip ? D(other) : fs, right = flip ? fs : D(other), s2 = flip ? cmp(other, v) : sym;
    return mc(r, s2, ['<', '>', '='].filter((x) => x !== s2), { q: `Which sign goes in the box? ${left} ☐ ${right}`, steps: [`Change the fraction to a decimal: ${fs} ${Number.isInteger(v * 1000) ? '=' : '≈'} ${D(+v.toFixed(3))}.`, `Compare ${flip ? `${D(other)} and ${D(+v.toFixed(3))}` : `${D(+v.toFixed(3))} and ${D(other)}`}: so ${left} ${s2} ${right}.`] });
  }
  if (t === 1) {
    const xs = []; let guard = 0; while (xs.length < 4 && guard++ < 50) { const x = rat(); if (!xs.some((y) => Math.abs(y.v - x.v) < 0.01)) xs.push(x); }
    const up = r.bool(), order = [...xs].sort((a, b) => (up ? a.v - b.v : b.v - a.v)).map((x) => x.s);
    const right = order.join(', '), byAbs = [...xs].sort((a, b) => (up ? Math.abs(a.v) - Math.abs(b.v) : Math.abs(b.v) - Math.abs(a.v))).map((x) => x.s).join(', ');
    const swap = [order[1], order[0], ...order.slice(2)].join(', ');
    return mc(r, right, [byAbs, swap, [...order].reverse().join(', ')], { q: `Order from ${up ? 'least to greatest' : 'greatest to least'}: ${xs.map((x) => x.s).join(';  ')}`, steps: [`As decimals: ${xs.map((x) => `${x.s} ≈ ${D(+x.v.toFixed(2))}`).join(', ')}.`, `${up ? 'Least to greatest' : 'Greatest to least'}: ${right}.`] });
  }
  if (r.bool()) { const x = -r.int(11, 999) / 100; return num(dec(-x), [`Absolute value is the distance from 0.`, `|${D(x)}| = ${D(-x)}.`], { q: `What is |${D(x)}|?`, expr: `Math.abs(${x})` }); }
  const d = r.pick([2, 3, 4, 5, 8]), n = coprime(r, d) + d * r.int(0, 4);
  return num(frac(n, d), ['Absolute value is the distance from 0, so it is never negative.', `|−${mixed(n, d)}| = ${mixed(n, d)} = ${frac(n, d)}.`], { q: `What is |−${mixed(n, d)}|?`, expr: `${n}/${d}` });
});

// ───────────── 6. Operations with rational numbers ─────────────
skill('8-ratadd', 8, 'Rational number operations', 'Add and subtract rational numbers', ['The integer rules still work for decimals and fractions.', 'Line up decimal points, or use a common denominator.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.nonzero(-999, 999) / 100, b = r.nonzero(-99, 99) / 10, sub = r.bool(), ans = sub ? a - b : a + b;
    return num(dec(ans), [sub ? `Subtracting ${D(b)} is adding ${D(-b)}: ${D(a)} + ${P(-b)}.` : `Add ${D(a)} and ${P(b)}.`, Math.sign(a) === Math.sign(sub ? -b : b) ? 'The signs are the same: add the sizes and keep the sign.' : 'The signs are different: subtract the sizes and keep the sign of the bigger one.', `${D(a)} ${sub ? '−' : '+'} ${P(b)} = ${D(ans)}.`], { q: `${D(a)} ${sub ? '−' : '+'} ${P(b)} = ?`, expr: `(${a})${sub ? '-' : '+'}(${b})` });
  }
  if (t === 1) {
    const [a, b] = fpair(r, [2, 3, 4, 5, 6, 8]), [c, d] = fpair(r, [2, 3, 4, 6, 8, 10]), sa = r.pick([-1, 1]), sc = r.pick([-1, 1]), sub = r.bool();
    const L = lcm(b, d), top = sa * a * (L / b) + (sub ? -1 : 1) * sc * c * (L / d), ans = frac(top, L), second = sc < 0 ? `(${fr(-c, d)})` : `${c}/${d}`;
    return num(ans, [`Use denominator ${L}: ${fr(sa * a * (L / b), L)} and ${fr(sc * c * (L / d), L)}.`, `${neg(sa * a * (L / b))} ${sub ? '−' : '+'} ${par(sc * c * (L / d))} = ${neg(top)}, so ${fr(top, L)}.`, `The answer is ${fr(top, L)}.`], { q: `${fr(sa * a, b)} ${sub ? '−' : '+'} ${second} = ?`, expr: `(${sa * a}/${b})${sub ? '-' : '+'}(${sc * c}/${d})` });
  }
  if (t === 2) {
    const x = -r.int(1, 40) / 4, y = r.int(1, 40) / 4, ans = y - x;
    return num(dec(ans), [St(`Distance is the larger minus the smaller: ${D(y)} − ${P(x)}.`, numberLine(Math.floor(x) - 1, Math.ceil(y) + 1, { marks: [x, y] })), `${D(y)} + ${D(-x)} = ${D(ans)}.`, `So the distance is ${D(ans)}.`], { q: `How far apart are ${D(x)} and ${D(y)} on a number line?`, expr: `Math.abs(${y}-(${x}))` });
  }
  const start = -r.int(200, 900) / 10, up = r.int(20, Math.floor(-start * 4) - 1) / 4, ans = start + up;
  return num(dec(ans), [`Below sea level is negative: start at ${D(start)} m.`, `Rising is adding: ${D(start)} + ${D(up)} = ${D(ans)}.`, `The new height is ${D(ans)} m.`], { q: `A submarine is at ${D(start)} m. It rises ${D(up)} m. What is its new height, in metres? (Use a negative number for below sea level.)`, unit: 'm', expr: `${start}+${up}` });
});
skill('8-ratmul', 8, 'Rational number operations', 'Multiply and divide rational numbers', ['Multiply or divide the sizes, then use the sign rules.', 'Same signs: positive. Different signs: negative.'], (r) => {
  const t = r.int(0, 3);
  const rule = (x, y) => (Math.sign(x) === Math.sign(y) ? 'Same signs, so the answer is positive.' : 'Different signs, so the answer is negative.');
  if (t === 0) {
    const a = r.nonzero(-45, 45) / 10, b = r.nonzero(-12, 12) / r.pick([1, 10]), ans = a * b;
    return num(dec(ans), [`Multiply the sizes: ${D(Math.abs(a))} × ${D(Math.abs(b))} = ${D(Math.abs(ans))}.`, rule(a, b), `So ${D(a)} × ${P(b)} = ${D(ans)}.`], { q: `${D(a)} × ${P(b)} = ?`, expr: `(${a})*(${b})` });
  }
  if (t === 1) {
    const q = r.nonzero(-60, 60) / 10, b = r.nonzero(-9, 9) / r.pick([1, 10]), a = +dec(q * b);
    return num(dec(q), [`Divide the sizes: ${D(Math.abs(a))} ÷ ${D(Math.abs(b))} = ${D(Math.abs(q))}.`, rule(a, b), `So ${D(a)} ÷ ${P(b)} = ${D(q)}.`], { q: `${D(a)} ÷ ${P(b)} = ?`, expr: `(${a})/(${b})` });
  }
  if (t === 2) {
    const [a, b] = fpair(r, [2, 3, 4, 5, 6]), [c, d] = fpair(r, [2, 3, 4, 5, 8]), sa = r.pick([-1, 1]), sc = r.pick([-1, 1]), div = r.bool();
    const top = div ? sa * a * d * sc : sa * a * c * sc, bot = div ? b * c : b * d, ans = frac(top, bot);
    return num(ans, [div ? `Multiply by the reciprocal: ${fr(sa * a, b)} × ${fr(sc * d, c)}.` : `Multiply tops and bottoms: ${neg(sa * a)} × ${par(sc * c)} over ${b} × ${d}.`, `${rule(sa, sc)} That gives ${neg(top)}/${bot}.`, `In lowest terms the answer is ${fr(top, bot)}.`], { q: `${fr(sa * a, b)} ${div ? '÷' : '×'} ${sc < 0 ? `(${fr(-c, d)})` : `${c}/${d}`} = ?`, expr: `(${sa * a}/${b})${div ? '/' : '*'}(${sc * c}/${d})` });
  }
  const per = r.int(5, 45) / 10, h = r.int(2, 8);
  if (r.bool()) return num(dec(-per * h), [`A drop is negative: −${D(per)} each hour.`, `${h} × (−${D(per)}) = ${D(-per * h)}.`, `The total change is ${D(-per * h)} °C.`], { q: `The temperature drops ${D(per)} °C every hour for ${h} hours. What is the total change in temperature?`, unit: '°C', expr: `${h}*(-${per})` });
  return num(dec(-per), [`The total change is ${D(-per * h)} °C over ${h} hours.`, `${D(-per * h)} ÷ ${h} = ${D(-per)}.`, `So the change each hour is ${D(-per)} °C.`], { q: `Over ${h} hours the temperature changed by ${D(-per * h)} °C, the same amount each hour. What was the change each hour?`, unit: '°C', expr: `${dec(-per * h)}/${h}` });
});
skill('8-ratrules', 8, 'Rational number operations', 'Sign rules and expressions', ['Know the sign of an answer before you work it out.', 'Order of operations works the same with decimals and fractions.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const cases = [
      ['a < 0 and b < 0', 'a + b', 'negative', 'Two negatives added stay negative.'], ['a < 0 and b < 0', 'a × b', 'positive', 'Same signs multiply to a positive.'], ['a < 0 and b < 0', 'a ÷ b', 'positive', 'Same signs divide to a positive.'], ['a < 0 and b < 0', 'a − b', 'can’t tell', 'It depends which is further from 0, so we can’t tell.'],
      ['a < 0 and b > 0', 'a − b', 'negative', 'A negative minus a positive moves further left: negative.'], ['a < 0 and b > 0', 'a × b', 'negative', 'Different signs multiply to a negative.'], ['a < 0 and b > 0', 'b − a', 'positive', 'A positive minus a negative is a positive plus a positive.'], ['a < 0 and b > 0', 'a + b', 'can’t tell', 'It depends which is further from 0, so we can’t tell.'],
      ['a > 0 and b > 0', 'a − b', 'can’t tell', 'It depends which is bigger, so we can’t tell.'], ['a > 0 and b < 0', 'a ÷ b', 'negative', 'Different signs divide to a negative.'],
    ];
    const [given, e, right, why] = r.pick(cases);
    return mc(r, right, ['positive', 'negative', 'can’t tell'].filter((x) => x !== right), { q: `If ${given}, is ${e} positive, negative, or can’t you tell?`, steps: [`Try numbers: ${given.includes('a < 0') ? 'a = −2' : 'a = 3'}, ${given.includes('b < 0') ? 'b = −5' : 'b = 4'}.`, why, `So ${e} is: ${right}.`] });
  }
  if (t === 1) {
    const a = r.nonzero(-9, 9) / 2, b = r.nonzero(-6, 6), c = r.nonzero(-99, 99) / 10, ans = a * b + c;
    return num(dec(ans), [`Multiply first: ${D(a)} × ${P(b)} = ${D(a * b)}.`, `Then add: ${D(a * b)} + ${P(c)} = ${D(ans)}.`], { q: `Evaluate: ${D(a)} × ${P(b)} + ${P(c)}`, expr: `(${a})*(${b})+(${c})` });
  }
  const [a, b] = fpair(r, [2, 3, 4]), [c, d] = fpair(r, [2, 4, 6]), k = r.nonzero(-12, 12), L = lcm(b, d), top = -a * (L / b) + c * (L / d), ans = frac(top * k, L);
  return num(ans, [`Brackets first: ${fr(-a, b)} + ${c}/${d} = ${fr(top, L)}.`, `Then multiply: ${fr(top, L)} × ${par(k)} = ${fr(top * k, L)}.`, `The answer is ${fr(top * k, L)}.`], { q: `Evaluate: (${fr(-a, b)} + ${c}/${d}) × ${par(k)}`, expr: `(-${a}/${b}+${c}/${d})*(${k})` });
});

// ───────────── 7. Exponents ─────────────
skill('8-powers', 8, 'Exponents', 'Evaluate powers', ['The exponent says how many times to multiply the base by itself: 2^3 = 2 × 2 × 2 = 8.', '(−3)^2 = 9, but −3^2 = −9, because the power is done before the minus.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const b = r.int(2, 10), e = r.int(2, b <= 4 ? 6 : b <= 6 ? 4 : 3), v = b ** e;
    return num(v, [`${b}^${e} means ${Array(e).fill(b).join(' × ')}.`, `Multiply: ${comma(v)}.`, `So ${b}^${e} = ${comma(v)}.`], { q: `Evaluate ${b}^${e}.`, expr: `${b}**${e}` });
  }
  if (t === 1) {
    const b = r.int(2, 6), e = r.int(2, b <= 3 ? 5 : 3), bracket = r.bool(0.65), v = bracket ? (-b) ** e : -(b ** e);
    return num(v, bracket ? [`(−${b})^${e} = ${Array(e).fill(`(−${b})`).join(' × ')}.`, `There ${e === 1 ? 'is' : 'are'} ${e} negative factors: ${e % 2 ? 'odd, so negative' : 'even, so positive'}.`, `So (−${b})^${e} = ${neg(v)}.`] : [`Without brackets, the power is done first: −(${b}^${e}).`, `${b}^${e} = ${b ** e}, so −${b}^${e} = ${neg(v)}.`], { q: `Evaluate ${bracket ? `(−${b})^${e}` : `−${b}^${e}`}.`, expr: bracket ? `(${-b})**${e}` : `-(${b}**${e})` });
  }
  if (t === 2) {
    const [n, d] = fpair(r, [2, 3, 4, 5]), e = r.int(2, 3), ans = frac(n ** e, d ** e);
    return num(ans, [`Raise the top and the bottom to the power ${e}.`, `${n}^${e} = ${n ** e} and ${d}^${e} = ${d ** e}.`, `So (${n}/${d})^${e} = ${ans}.`], { q: `Evaluate (${n}/${d})^${e}.`, expr: `(${n}/${d})**${e}` });
  }
  if (t === 3) {
    const x = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 1.1, 1.2, 1.5, 0.6]), e = x > 1 ? 2 : r.int(2, 3), v = dec(x ** e);
    return num(v, [`${x}^${e} = ${Array(e).fill(x).join(' × ')}.`, `Multiply the digits, then count decimal places: ${v}.`, `So ${x}^${e} = ${v}.`], { q: `Evaluate ${x}^${e}.`, expr: `${x}**${e}` });
  }
  if (r.bool(0.25)) { const b = r.int(2, 50); return num(1, [`Any non-zero number to the power 0 is 1.`, `So ${b}^0 = 1.`], { q: `Evaluate ${b}^0.`, expr: `${b}**0` }); }
  const b = r.int(2, 5), x = r.int(2, b === 2 ? 8 : 4), v = b ** x;
  return num(x, [`Multiply ${b} by itself until you reach ${v}: ${Array.from({ length: x }, (_, i) => b ** (i + 1)).join(', ')}.`, `That took ${x} factors of ${b}.`, `So x = ${x}.`], { q: `Solve for x: ${b}^x = ${comma(v)}`, unit: 'x =', expr: `Math.log(${v})/Math.log(${b})`, tol: 1e-6 });
});
skill('8-pow10', 8, 'Exponents', 'Powers of ten', ['10^4 = 10 000: the exponent counts the zeros.', 'Multiplying by 10^n moves the decimal point n places right; dividing moves it n places left.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) { const k = r.int(2, 8), v = 10 ** k; return num(k, [`${comma(v)} is 1 followed by ${k} zeros.`, `So ${comma(v)} = 10^${k}.`], { q: `Write ${comma(v)} as a power of ten: 10^?`, expr: `Math.log10(${v})` }); }
  if (t === 1) { const n = r.int(2, 999), k = r.int(1, 5), v = n * 10 ** k; return num(v, [`10^${k} = ${comma(10 ** k)}.`, `${n} × ${comma(10 ** k)}: write ${k} zeros after ${n}.`, `So the answer is ${comma(v)}.`], { q: `${n} × 10^${k} = ?`, expr: `${n}*10**${k}` }); }
  if (t === 2) { const N = r.int(1001, 99999), x = N / 1000, k = r.int(1, 4), v = dec(x * 10 ** k); return num(v, [`Multiplying by 10^${k} moves the decimal point ${k} place${k > 1 ? 's' : ''} right.`, `${dec(x)} → ${v}.`, `So ${dec(x)} × 10^${k} = ${v}.`], { q: `${dec(x)} × 10^${k} = ?`, expr: `${x}*10**${k}` }); }
  if (t === 3) { const n = r.int(12, 98765), k = r.int(1, 4), v = dec(n / 10 ** k); return num(v, [`Dividing by 10^${k} moves the decimal point ${k} place${k > 1 ? 's' : ''} left.`, `${comma(n)} → ${v}.`, `So ${comma(n)} ÷ 10^${k} = ${v}.`], { q: `${comma(n)} ÷ 10^${k} = ?`, expr: `${n}/10**${k}` }); }
  const m = r.int(11, 99) / 10, k = r.int(2, 6), v = Math.round(m * 10 ** k);
  return num(k, [`From ${m} to ${comma(v)} the decimal point moves right.`, `It moves ${k} places, so the power is 10^${k}.`, `The missing exponent is ${k}.`], { q: `${m} × 10^? = ${comma(v)}`, expr: `Math.round(Math.log10(${v}/${m}))` });
});

// ───────────── 8. Roots ─────────────
skill('8-roots', 8, 'Roots', 'Estimate and use square roots', ['Squaring and square-rooting undo each other: √(7^2) = 7.', 'To estimate √50, find the perfect squares on each side: 49 < 50 < 64, so √50 is between 7 and 8.'], (r) => {
  const t = r.int(0, 3);
  let n = r.int(3, 220); while (Number.isInteger(Math.sqrt(n))) n++;
  const s = Math.floor(Math.sqrt(n));
  if (t === 0) return mc(r, `${s} and ${s + 1}`, [`${s - 1} and ${s}`, `${s + 1} and ${s + 2}`, `${Math.floor(n / 2)} and ${Math.floor(n / 2) + 1}`], { q: `√${n} is between which two whole numbers?`, steps: [`${s}^2 = ${s * s} and ${s + 1}^2 = ${(s + 1) ** 2}.`, `${s * s} < ${n} < ${(s + 1) ** 2}, so √${n} is between ${s} and ${s + 1}.`] });
  if (t === 1) {
    const ans = Math.round(Math.sqrt(n));
    return num(ans, [`${s}^2 = ${s * s} and ${s + 1}^2 = ${(s + 1) ** 2}, so √${n} is between ${s} and ${s + 1}.`, `${n} is closer to ${n - s * s <= s ? s * s : (s + 1) ** 2} (halfway is ${s}.5^2 = ${dec((s + 0.5) ** 2)}).`, `So √${n} is closest to ${ans}.`], { q: `To the nearest whole number, what is √${n}?`, expr: `Math.round(Math.sqrt(${n}))` });
  }
  const k = r.int(2, 20);
  if (t === 2) {
    const negAns = r.bool(0.4);
    return num(negAns ? -k : k, [`x^2 = ${k * k} means x × x = ${k * k}.`, `${k} × ${k} = ${k * k} and (−${k}) × (−${k}) = ${k * k}.`, `The ${negAns ? 'negative' : 'positive'} solution is x = ${neg(negAns ? -k : k)}.`], { q: `x^2 = ${k * k}. What is the ${negAns ? 'negative' : 'positive'} value of x?`, unit: 'x =', expr: `${negAns ? '-' : ''}Math.sqrt(${k * k})` });
  }
  if (r.bool()) return num(n, ['Squaring undoes a square root.', `So (√${n})^2 = ${n}.`], { q: `What is (√${n})^2?`, expr: `${n}` });
  return num(k, [`${k}^2 = ${k * k}, so √${k * k} undoes the squaring.`, `√${k * k} = ${k}.`], { q: `${k}^2 = ${k * k}. What is √${k * k}?`, expr: `Math.sqrt(${k * k})` });
});

// ───────────── 9. Scientific notation ─────────────
const sciShow = (m, e) => `${m} × 10^${e < 0 ? '−' + -e : e}`;
skill('8-scicompare', 8, 'Scientific notation', 'Convert and compare in scientific notation', ['In scientific notation the first number is from 1 up to (not including) 10.', 'A positive exponent makes a big number; a negative exponent makes a small one.'], (r) => {
  const t = r.int(0, 2), m = r.int(11, 99) / 10;
  if (t === 0) {
    const e = r.bool() ? r.int(2, 7) : -r.int(1, 5), v = dec(m * 10 ** e, 7);
    return num(v, [e > 0 ? `10^${e}: move the decimal point ${e} places right.` : `10^−${-e}: move the decimal point ${-e} place${e < -1 ? 's' : ''} left.`, `${m} → ${comma(v).includes('.') || Math.abs(+v) < 1 ? v : comma(v)}.`, `So ${sciShow(m, e)} = ${v}.`], { q: `Write ${sciShow(m, e)} in standard form.`, expr: `${m}*10**(${e})` });
  }
  if (t === 1) {
    const e = r.bool() ? r.int(3, 8) : -r.int(2, 5), v = dec(m * 10 ** e, 7), shown = e > 0 ? comma(v) : v;
    return mc(r, sciShow(m, e), [sciShow(m, e + 1), sciShow(m, -e), `${dec(m * 10)} × 10^${e - 1 < 0 ? '−' + (1 - e) : e - 1}`], { q: `Which is ${shown} in scientific notation?`, steps: [`Put the decimal point after the first non-zero digit: ${m}.`, `It moved ${Math.abs(e)} place${Math.abs(e) > 1 ? 's' : ''} ${e > 0 ? 'left, so the exponent is positive' : 'right, so the exponent is negative'}: ${sciShow(m, e)}.`] });
  }
  const e1 = r.int(-6, 9); let e2 = e1 + r.pick([-1, 0, 0, 1]); const m2 = r.bool(0.2) ? m : r.int(11, 99) / 10;
  const v1 = m * 10 ** e1, v2 = m2 * 10 ** e2, sym = m === m2 && e1 === e2 ? '=' : v1 < v2 ? '<' : '>';
  return mc(r, sym, ['<', '>', '='].filter((x) => x !== sym), { q: `Which sign goes in the box? ${sciShow(m, e1)} ☐ ${sciShow(m2, e2)}`, steps: [e1 !== e2 ? `Compare the exponents first: ${e1} ${e1 < e2 ? '<' : '>'} ${e2}.` : `The exponents are the same, so compare ${m} and ${m2}.`, `So ${sciShow(m, e1)} ${sym} ${sciShow(m2, e2)}.`] });
});

// ───────────── 10. Ratios, rates and proportions ─────────────
skill('8-ratios', 8, 'Ratios', 'Equivalent ratios and ratio tables', ['Multiply or divide both parts of a ratio by the same number to get an equivalent ratio.', '3:5 = 6:10 = 9:15.'], (r) => {
  const t = r.int(0, 3); let a = r.int(1, 9), b = r.int(2, 12); while (a === b || gcd(a, b) !== 1) b = r.int(2, 12);
  const k = r.int(2, 9);
  if (t === 0) { const askA = r.bool(); return num(askA ? a * k : b * k, [`${askA ? `${b} × ${k} = ${b * k}` : `${a} × ${k} = ${a * k}`}, so multiply both parts by ${k}.`, `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}.`, `The missing number is ${askA ? a * k : b * k}.`], { q: askA ? `Fill in: ${a} : ${b} = ? : ${b * k}` : `Fill in: ${a} : ${b} = ${a * k} : ?`, expr: askA ? `${a}*${k}` : `${b}*${k}` }); }
  if (t === 1) return mc(r, `${a * k} : ${b * k}`, [`${a * k} : ${b * k + 1}`, `${a + k} : ${b + k}`, `${b * k} : ${a * k}`], { q: `Which ratio is equivalent to ${a} : ${b}?`, steps: [`Multiply both parts by the same number, ${k}.`, `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}, so ${a} : ${b} = ${a * k} : ${b * k}.`] });
  if (t === 2) {
    const ks = [1, 2, 3, k + 2], hide = r.int(1, 3), row = ks.map((m) => m * b);
    const top = ks.map((m, i) => (i === hide ? '?' : m * a));
    return num(ks[hide] * a, [`Each column is ${a} : ${b} multiplied by the same number.`, `${row[hide]} ÷ ${b} = ${ks[hide]}, so the top is ${a} × ${ks[hide]}.`, `The missing number is ${ks[hide] * a}.`], { q: 'The table shows equivalent ratios. What is the missing number?', visual: { type: 'table', head: ['Cups of juice', ...top], rows: [['Cups of water', ...row]] }, expr: `${row[hide]}/${b}*${a}` });
  }
  const tot = (a + b) * k, n = r.pick(['boys to girls', 'red to blue marbles', 'cats to dogs at a shelter']), second = n.split(' to ')[1].split(' ')[0];
  return num(b * k, [St(`Draw a tape: ${a} parts and ${b} parts make ${a + b} equal parts.`), `Each part is ${tot} ÷ ${a + b} = ${k}.`, `${second[0].toUpperCase() + second.slice(1)}: ${b} × ${k} = ${b * k}.`], { q: `The ratio of ${n} is ${a} : ${b}. There are ${tot} in all. How many ${n.includes('girls') ? 'girls' : n.includes('blue') ? 'blue marbles' : 'dogs'} are there?`, expr: `${tot}/${a + b}*${b}` });
});
skill('8-rates', 8, 'Ratios', 'Unit rates and comparing rates', ['A unit rate tells how much for one: per kilogram, per hour, per litre.', 'Compare rates by finding the unit rate of each.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const u = r.int(5, 60) / 4, n = r.int(2, 8), item = r.pick([['kg of apples', 'kg'], ['L of juice', 'L'], ['m of rope', 'm']]);
    return num(dec(u), [`Unit rate = total ÷ number of ${item[1]}.`, `${money(u * n)} ÷ ${n} = ${money(u)}.`, `So it costs ${money(u)} per ${item[1]}, which is ${dec(u)}.`], { q: `${n} ${item[0]} cost ${money(u * n)}. What is the cost per ${item[1]}, in dollars?`, unit: '$', expr: `${u * n}/${n}` });
  }
  if (t === 1) {
    const s = r.int(6, 24) * 5, h1 = r.int(2, 4), h2 = r.int(5, 9);
    return num(s * h2, [`Find the unit rate: ${s * h1} km ÷ ${h1} h = ${s} km per hour.`, `In ${h2} hours: ${s} × ${h2} = ${s * h2}.`, `So the car goes ${s * h2} km.`], { q: `A car travels ${s * h1} km in ${h1} hours. At the same speed, how far does it go in ${h2} hours?`, unit: 'km', expr: `${s * h1}/${h1}*${h2}` });
  }
  if (t === 2) {
    const n1 = r.int(2, 6), n2 = n1 + r.int(1, 4), u1 = r.int(150, 400) / 100; let u2 = u1 + r.pick([-0.25, -0.15, 0.1, 0.2, 0.3]);
    const p1 = +(u1 * n1).toFixed(2), p2 = +(u2 * n2).toFixed(2), U1 = p1 / n1, U2 = p2 / n2, right = U1 < U2 ? `${n1} for ${money(p1)}` : `${n2} for ${money(p2)}`;
    return mc(r, right, [U1 < U2 ? `${n2} for ${money(p2)}` : `${n1} for ${money(p1)}`, 'They cost the same'], { q: `Which is the better buy for granola bars: ${n1} for ${money(p1)} or ${n2} for ${money(p2)}?`, steps: [`${money(p1)} ÷ ${n1} ≈ ${money(U1)} each.`, `${money(p2)} ÷ ${n2} ≈ ${money(U2)} each.`, `The lower price per bar is the better buy: ${right}.`] });
  }
  const a = [r.int(1, 4), r.int(2, 6)]; let b = [r.int(1, 4), r.int(2, 6)]; while (a[0] * b[1] === b[0] * a[1]) b = [r.int(1, 4), r.int(2, 6)];
  const right = a[0] / a[1] > b[0] / b[1] ? 'Mix A' : 'Mix B';
  return mc(r, right, [right === 'Mix A' ? 'Mix B' : 'Mix A', 'They taste the same'], { q: `Mix A uses ${a[0]} cup${a[0] > 1 ? "s" : ""} of juice for ${a[1]} cups of water. Mix B uses ${b[0]} cup${b[0] > 1 ? "s" : ""} of juice for ${b[1]} cups of water. Which tastes more of juice?`, steps: [`Juice per cup of water: A = ${a[0]}/${a[1]} ≈ ${dec(a[0] / a[1], 2)}, B = ${b[0]}/${b[1]} ≈ ${dec(b[0] / b[1], 2)}.`, `More juice per cup of water is stronger: ${right}.`] });
});
skill('8-proportion', 8, 'Ratios', 'Proportions, populations and scale', ['A proportion says two ratios are equal. The cross products are equal too.', 'Scale drawings and population estimates are proportions.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.int(1, 9), b = r.int(2, 12), k = r.int(2, 6), yes = r.bool(), c = a * k, d = b * k + (yes ? 0 : r.pick([-1, 1, 2]));
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: `Do ${a}/${b} and ${c}/${d} form a proportion?`, steps: [`Cross products: ${a} × ${d} = ${a * d} and ${b} × ${c} = ${b * c}.`, yes ? 'They are equal, so yes, it is a proportion.' : 'They are not equal, so no, it is not a proportion.'] });
  }
  if (t === 1) {
    const x = r.int(2, 30), a = r.int(2, 9), b = r.int(2, 9), c = a * x;
    if ((c * b) % a) return num(x, [`Cross multiply: ${a} × x = ${b} × ${c / b * 1}.`, `x = ${x}.`], { q: `Solve: x/${b} = ${c}/${a * b}`, unit: 'x =', expr: `${c}/${a}` });
    return num(x * b, [St(`Cross multiply: ${a} × x = ${c} × ${b}.`, eqnLines([{ eq: `${c}/${a} = x/${b}` }, { eq: `${a}x = ${c * b}` }, { eq: `x = ${x * b}`, note: `÷ ${a}` }])), `${a}x = ${c * b}, so x = ${c * b} ÷ ${a} = ${x * b}.`, `So x = ${x * b}.`], { q: `Solve: ${c}/${a} = x/${b}`, unit: 'x =', expr: `${c}*${b}/${a}` });
  }
  if (t === 2) {
    const tagged = r.int(3, 12) * 10, second = r.int(4, 10) * 10, marked = second / 10 * r.int(1, 4), est = tagged * second / marked;
    return num(est, [`The fraction marked in the sample should match the whole lake: ${marked}/${second} = ${tagged}/N.`, `N = ${tagged} × ${second} ÷ ${marked}.`, `N = ${comma(est)}. About ${comma(est)} fish live in the lake.`], { q: `Scientists tagged ${tagged} fish in a lake. Later they caught ${second} fish and ${marked} had tags. Estimate the number of fish in the lake.`, expr: `${tagged}*${second}/${marked}` });
  }
  const s = r.pick([2, 4, 5, 10, 20, 25]), d = r.int(3, 30) / 2, real = d * s;
  return num(dec(real), [`Scale: 1 cm on the drawing is ${s} m in real life.`, `${dec(d)} × ${s} = ${dec(real)}.`, `So the real length is ${dec(real)} m.`], { q: `A map uses the scale 1 cm : ${s} m. A path is ${dec(d)} cm long on the map. How long is the real path?`, unit: 'm', expr: `${d}*${s}` });
});

// ───────────── 11. Percents ─────────────
skill('8-pctconvert', 8, 'Percents', 'Percents, fractions and decimals', ['Percent means "out of 100": 35% = 35/100 = 0.35.', 'To change a decimal to a percent, multiply by 100.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const p = r.pick([r.int(1, 99), r.int(101, 250), r.int(1, 99) + 0.5]); return num(dec(p / 100), [`Percent means out of 100: divide by 100.`, `${p}% = ${p} ÷ 100 = ${dec(p / 100)}.`], { q: `Write ${p}% as a decimal.`, expr: `${p}/100` }); }
  if (t === 1) { const d = r.pick([2, 4, 5, 8, 10, 20, 25, 50]), n = coprime(r, d) % d || 1, p = dec((n / d) * 100); return num(p, [`Make the fraction out of 100, or divide: ${n} ÷ ${d} = ${dec(n / d)}.`, `${dec(n / d)} × 100 = ${p}.`, `So ${n}/${d} = ${p}%.`], { q: `Write ${n}/${d} as a percent.`, unit: '%', expr: `${n}/${d}*100` }); }
  if (t === 2) { const x = r.int(1, 999) / 1000, p = dec(x * 100); return num(p, ['Multiply by 100: move the decimal point 2 places right.', `${dec(x)} × 100 = ${p}, so ${p}%.`], { q: `Write ${dec(x)} as a percent.`, unit: '%', expr: `${x}*100` }); }
  const d = r.pick([3, 4, 5, 8, 6]), n = coprime(r, d), v = (n / d) * 100, p = Math.round(v) + r.pick([-3, -1, 0, 2, 4]), sym = cmp(v, p);
  return mc(r, sym, ['<', '>', '='].filter((x) => x !== sym), { q: `Which sign goes in the box? ${n}/${d} ☐ ${p}%`, steps: [`${n}/${d} = ${n} ÷ ${d} ${Number.isInteger(v * 100) ? '=' : '≈'} ${dec(v / 100, 4)}, which is about ${dec(v, 1)}%.`, `${dec(v, 1)}% ${sym} ${p}%, so ${n}/${d} ${sym} ${p}%.`] });
});
skill('8-pctof', 8, 'Percents', 'Percent problems', ['Part = percent × whole. 20% of 50 = 0.2 × 50 = 10.', 'Percent = part ÷ whole × 100.'], (r) => {
  const t = r.int(0, 4), p = r.pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 120, 150]), w = r.int(2, 40) * 20, part = (p * w) / 100;
  if (t === 0) return num(dec(part), [`${p}% = ${dec(p / 100)}.`, `${dec(p / 100)} × ${w} = ${dec(part)}.`, `So ${p}% of ${w} is ${dec(part)}.`], { q: `What is ${p}% of ${w}?`, expr: `${p}/100*${w}` });
  if (t === 1) return num(p, [`Percent = part ÷ whole × 100.`, `${dec(part)} ÷ ${w} = ${dec(p / 100)}.`, `${dec(p / 100)} × 100 = ${p}, so ${p}%.`], { q: `What percent of ${w} is ${dec(part)}?`, unit: '%', expr: `${part}/${w}*100` });
  if (t === 2) return num(w, [St(`Write an equation: ${dec(p / 100)} × n = ${dec(part)}.`), `n = ${dec(part)} ÷ ${dec(p / 100)}.`, `n = ${w}.`], { q: `${p}% of what number is ${dec(part)}?`, expr: `${part}/(${p}/100)` });
  if (t === 3) {
    const tot = r.int(4, 20) * 20, pp = r.pick([15, 20, 25, 35, 40, 45, 55, 65]), k = (pp * tot) / 100;
    return num(k, [`${pp}% of ${tot} walk to school.`, `${dec(pp / 100)} × ${tot} = ${k}.`, `So ${k} students walk.`], { q: `A school has ${tot} students. ${pp}% of them walk to school. How many students walk?`, expr: `${pp}/100*${tot}` });
  }
  const pe = r.pick([10, 20, 25, 50]), base = r.int(3, 20) * (100 / pe), nn = base + r.pick([-2, -1, 1, 2]), pp = pe + r.pick([-1, 1]), est = (pe * base) / 100;
  return mc(r, est, [est * 2, Math.round(est / 2), est + 10 * r.int(1, 3)], { q: `Estimate ${pp}% of ${nn}.`, steps: [`${pp}% is close to ${pe}%, and ${nn} is close to ${base}.`, `${pe}% of ${base} = ${est}. So the estimate is about ${est}.`] });
});
skill('8-pctchg', 8, 'Percents', 'Percent of change', ['Percent of change = change ÷ original × 100.', 'It is an increase if the amount grew and a decrease if it shrank.'], (r) => {
  const t = r.int(0, 2), o = r.int(2, 40) * 10, p = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]), up = r.bool(), nw = up ? o + (o * p) / 100 : o - (o * p) / 100;
  if (t === 0) return num(p, [`Change: ${dec(nw)} − ${o} = ${neg(+dec(nw - o))}.`, `${dec(Math.abs(nw - o))} ÷ ${o} × 100 = ${p}.`, `It is a ${p}% ${up ? 'increase' : 'decrease'}.`], { q: `A number changes from ${o} to ${dec(nw)}. What is the percent of change? (Give the size.)`, unit: '%', expr: `Math.abs(${nw}-${o})/${o}*100` });
  if (t === 1) {
    const town = r.pick(['A town', 'A library', 'A hockey club']), thing = { 'A town': 'people', 'A library': 'books', 'A hockey club': 'members' }[town];
    return mc(r, `${p}% ${up ? 'increase' : 'decrease'}`, [`${p}% ${up ? 'decrease' : 'increase'}`, `${dec(Math.abs(nw - o) / nw * 100, 1)}% ${up ? 'increase' : 'decrease'}`, `${Math.abs(nw - o)}% ${up ? 'increase' : 'decrease'}`], { q: `${town} had ${o} ${thing} last year and has ${dec(nw)} this year. What is the percent of change?`, steps: [`The change is ${dec(Math.abs(nw - o))}, ${up ? 'up' : 'down'}.`, `${dec(Math.abs(nw - o))} ÷ ${o} (the original) × 100 = ${p}%.`, `So it is a ${p}% ${up ? 'increase' : 'decrease'}.`] });
  }
  return num(dec(nw), [`${p}% of ${o} is ${dec((o * p) / 100)}.`, `${up ? 'Add' : 'Subtract'}: ${o} ${up ? '+' : '−'} ${dec((o * p) / 100)} = ${dec(nw)}.`, `The new amount is ${dec(nw)}.`], { q: `${o} is ${up ? 'increased' : 'decreased'} by ${p}%. What is the new amount?`, expr: `${o}*(1${up ? '+' : '-'}${p}/100)` });
});

// ───────────── 12. Consumer maths ─────────────
skill('8-unitprice', 8, 'Consumer maths', 'Price lists and unit prices', ['The unit price is the cost of one unit: total ÷ amount.', 'Total cost = unit price × amount.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const menu = r.shuffle([['Sandwich', 6.75], ['Bowl of soup', 4.5], ['Salad', 5.25], ['Juice box', 2.25], ['Muffin', 2.75], ['Carton of milk', 1.5]]).slice(0, 4);
    const [i, j] = [0, r.int(1, 3)], ni = r.int(1, 3), nj = r.int(1, 3), tot = ni * menu[i][1] + nj * menu[j][1];
    return num(dec(tot), [`${ni} × ${money(menu[i][1])} = ${money(ni * menu[i][1])}.`, `${nj} × ${money(menu[j][1])} = ${money(nj * menu[j][1])}.`, `Total: ${money(tot)}, which is ${dec(tot)} dollars.`], { q: `Using the price list, how much do ${ni} ${pl(menu[i][0], ni)} and ${nj} ${pl(menu[j][0], nj)} cost, in dollars?`, visual: { type: 'table', head: ['Item', 'Price'], rows: menu.map(([a, b]) => [a, money(b)]) }, unit: '$', expr: `${ni}*${menu[i][1]}+${nj}*${menu[j][1]}` });
  }
  if (t === 1) {
    const g = r.pick([250, 400, 500, 750]), u = r.int(4, 16) / 1000 * 2.5, price = +(u * g).toFixed(2), per100 = price / g * 100;
    return num(dec(per100, 2), [`Unit price per 100 g = price ÷ grams × 100.`, `${money(price)} ÷ ${g} × 100 = ${dec(per100, 2)}.`, `So it costs about $${dec(per100, 2)} per 100 g.`], { q: `A ${g} g box of cereal costs ${money(price)}. What is the price per 100 g, in dollars? (Round to the nearest cent.)`, unit: '$', expr: `${price}/${g}*100`, tol: 0.006 });
  }
  const u = r.int(80, 600) / 100, kg = r.int(2, 12) / 2, tot = u * kg;
  return num(dec(tot, 2), [`Total = unit price × amount.`, `${money(u)} × ${dec(kg)} = ${dec(tot, 4)}.`, `To the nearest cent: ${money(+tot.toFixed(2))}, which is ${dec(tot, 2)} dollars.`], { q: `Grapes cost ${money(u)} per kg. How much do ${dec(kg)} kg cost, in dollars? (Round to the nearest cent.)`, unit: '$', expr: `${u}*${kg}`, tol: 0.006 });
});
skill('8-taxdisc', 8, 'Consumer maths', 'Tax, discounts and tips', ['A discount is taken off the price; tax and tips are added on.', 'To find the original price from a sale price, divide by the percent you paid.'], (r) => {
  const t = r.int(0, 5), price = r.int(8, 60) * 5;
  if (t === 0) { const tax = r.pick([5, 13, 15]), tot = price * (1 + tax / 100); return num(dec(tot, 2), [`Tax: ${tax}% of ${money(price)} = ${money(price * tax / 100)}.`, `Total: ${money(price)} + ${money(price * tax / 100)} = ${money(tot)}.`, `So the total is ${dec(tot, 2)} dollars.`], { q: `A jacket costs ${money(price)}. The sales tax is ${tax}%. What is the total cost, in dollars?`, unit: '$', expr: `${price}*(1+${tax}/100)` }); }
  const d = r.pick([10, 15, 20, 25, 30, 40, 50]), sale = price * (1 - d / 100);
  if (t === 1) return num(dec(sale, 2), [`Discount: ${d}% of ${money(price)} = ${money(price * d / 100)}.`, `Sale price: ${money(price)} − ${money(price * d / 100)} = ${money(sale)}.`, `So it costs ${dec(sale, 2)} dollars.`], { q: `A bike helmet is ${money(price)}, on sale for ${d}% off. What is the sale price, in dollars?`, unit: '$', expr: `${price}*(1-${d}/100)` });
  if (t === 2) return num(d, [`Discount: ${money(price)} − ${money(sale)} = ${money(price - sale)}.`, `${money(price - sale)} ÷ ${money(price)} × 100 = ${d}.`, `So the discount is ${d}%.`], { q: `Shoes that cost ${money(price)} are on sale for ${money(sale)}. What percent is the discount?`, unit: '%', expr: `(${price}-${sale})/${price}*100` });
  if (t === 3) return num(price, [`After ${d}% off, you pay ${100 - d}% of the original.`, `${dec((100 - d) / 100)} × original = ${money(sale)}, so original = ${money(sale)} ÷ ${dec((100 - d) / 100)}.`, `Original price = ${money(price)}, which is ${price} dollars.`], { q: `A game is on sale for ${money(sale)} after a ${d}% discount. What was the original price, in dollars?`, unit: '$', expr: `${sale}/(1-${d}/100)` });
  if (t === 4) {
    const bill = r.int(1800, 9000) / 100, tp = r.pick([15, 20]), round = Math.round(bill), est = round * tp / 100;
    return num(dec(est), [`Round the bill to ${money(round)}.`, tp === 15 ? `10% is ${money(round / 10)}, 5% is half of that: ${money(round / 20)}. Add them: ${money(est)}.` : `10% is ${money(round / 10)}. Double it: ${money(est)}.`, `So the tip is about ${dec(est)} dollars.`], { q: `A restaurant bill is ${money(bill)}. Round the bill to the nearest dollar, then estimate a ${tp}% tip, in dollars.`, unit: '$', expr: `Math.round(${bill})*${tp}/100` });
  }
  const tot = sale * 1.13;
  return num(dec(tot, 2), [`Discount first: ${money(price)} × ${dec(1 - d / 100)} = ${money(sale)}.`, `Then add 13% HST: ${money(sale)} × 1.13 = ${dec(tot, 4)}.`, `To the nearest cent: ${money(+tot.toFixed(2))}, which is ${dec(tot, 2)} dollars.`], { q: `A coat is ${money(price)}. It is ${d}% off, then 13% HST is added to the sale price. What is the final cost, in dollars? (Round to the nearest cent.)`, unit: '$', expr: `${price}*(1-${d}/100)*1.13`, tol: 0.006 });
});
skill('8-interest', 8, 'Consumer maths', 'Interest and budgets', ['Simple interest: I = P × r × t (principal × rate × time in years).', 'Compound interest adds the interest each year, so next year earns interest on it too.'], (r) => {
  const t = r.int(0, 3), P = r.int(4, 40) * 100, rate = r.pick([2, 3, 4, 5, 6]), yrs = r.int(2, 5);
  if (t === 0) { const I = P * rate / 100 * yrs; return num(I, [`I = P × r × t = ${P} × ${dec(rate / 100)} × ${yrs}.`, `${P} × ${dec(rate / 100)} = ${dec(P * rate / 100)} per year.`, `${dec(P * rate / 100)} × ${yrs} = ${dec(I)}. The interest is ${money(I)}, which is ${dec(I)}.`], { q: `${r.pick(NAMES)} puts ${money(P)} in a savings account that pays ${rate}% simple interest per year. How much interest is earned in ${yrs} years, in dollars?`, unit: '$', expr: `${P}*${rate}/100*${yrs}` }); }
  if (t === 1) {
    const y1 = P * (1 + rate / 100), y2 = y1 * (1 + rate / 100);
    return num(dec(y2, 2), [`Year 1: ${money(P)} × ${dec(1 + rate / 100)} = ${money(y1)}.`, `Year 2: ${money(y1)} × ${dec(1 + rate / 100)} = ${dec(y2, 4)}.`, `To the nearest cent: ${money(+y2.toFixed(2))}, which is ${dec(y2, 2)}.`], { q: `${money(P)} is invested at ${rate}% interest, compounded once a year. How much is in the account after 2 years, in dollars? (Round to the nearest cent.)`, unit: '$', expr: `${P}*(1+${rate}/100)**2`, tol: 0.006 });
  }
  const inc = r.int(30, 90) * 10, rent = r.int(5, 15) * 10, food = r.int(5, 15) * 10, phone = r.int(3, 6) * 10, fun = r.int(2, 10) * 10, spend = rent + food + phone + fun;
  const rows = [['Job income', money(inc)], ['Bus pass', money(rent)], ['Food', money(food)], ['Phone', money(phone)], ['Fun', money(fun)]];
  if (t === 2) return num(inc - spend, [`Expenses: ${rent} + ${food} + ${phone} + ${fun} = ${spend}.`, `Income − expenses: ${inc} − ${spend} = ${neg(inc - spend)}.`, `So ${inc - spend >= 0 ? 'there is' : 'the budget is short by'} ${money(Math.abs(inc - spend))}: the balance is ${neg(inc - spend)}.`], { q: 'Here is a monthly budget. What is income minus expenses, in dollars? (Use a negative number if the budget is short.)', visual: { type: 'table', head: ['Item', 'Amount'], rows }, unit: '$', expr: `${inc}-${spend}` });
  const goal = inc - spend + r.int(2, 8) * 10, cut = goal - (inc - spend);
  return num(cut, [`Now the budget leaves ${neg(inc - spend)} dollars each month.`, `To save ${goal}, the extra needed is ${goal} − ${par(inc - spend)} = ${cut}.`, `So spending must drop by ${cut} dollars.`], { q: `Here is a monthly budget. How many dollars must be cut from expenses to save ${money(goal)} each month?`, visual: { type: 'table', head: ['Item', 'Amount'], rows }, unit: '$', expr: `${goal}-(${inc}-${spend})` });
});

// ───────────── 13. Units of measurement ─────────────
skill('8-metric', 8, 'Measurement', 'Metric units and rates', ['Metric units go up and down by 10, 100 or 1000: 1 km = 1000 m, 1 m = 100 cm, 1 L = 1000 mL.', 'To change a rate, change one unit at a time.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const [big, small, f] = r.pick([['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'mL', 1000], ['g', 'mg', 1000]]), down = r.bool(), x = r.int(1, 999) / r.pick([10, 100]);
    return down ? num(dec(x * f), [`1 ${big} = ${f} ${small}, so multiply by ${f}.`, `${dec(x)} × ${f} = ${dec(x * f)}.`, `So ${dec(x)} ${big} = ${dec(x * f)} ${small}.`], { q: `${dec(x)} ${big} = ? ${small}`, expr: `${x}*${f}` })
      : num(dec(x), [`1 ${big} = ${f} ${small}, so divide by ${f}.`, `${dec(x * f)} ÷ ${f} = ${dec(x)}.`, `So ${dec(x * f)} ${small} = ${dec(x)} ${big}.`], { q: `${dec(x * f)} ${small} = ? ${big}`, expr: `${x * f}/${f}` });
  }
  if (t === 1) {
    const ms = r.int(2, 30), kmh = ms * 3.6;
    return r.bool() ? num(dec(kmh), [`In one hour there are 3600 seconds, and 1000 m = 1 km.`, `${ms} m/s × 3600 ÷ 1000 = ${ms} × 3.6 = ${dec(kmh)}.`, `So ${ms} m/s = ${dec(kmh)} km/h.`], { q: `A cyclist rides at ${ms} m/s. What is that speed in km/h?`, unit: 'km/h', expr: `${ms}*3600/1000` })
      : num(ms, [`${dec(kmh)} km/h = ${dec(kmh * 1000)} m in 3600 s.`, `${dec(kmh * 1000)} ÷ 3600 = ${ms}.`, `So the speed is ${ms} m/s.`], { q: `A train moves at ${dec(kmh)} km/h. What is that speed in metres per second?`, unit: 'm/s', expr: `${kmh}*1000/3600` });
  }
  const m1 = r.int(1, 9), c1 = r.int(10, 95), m2 = r.int(1, 5), c2 = r.int(10, 95), tot = (m1 + m2) * 100 + c1 + c2;
  return num(tot, [`${m1} m ${c1} cm = ${m1 * 100 + c1} cm and ${m2} m ${c2} cm = ${m2 * 100 + c2} cm.`, `${m1 * 100 + c1} + ${m2 * 100 + c2} = ${tot}.`, `So the total is ${tot} cm (${Math.floor(tot / 100)} m ${tot % 100} cm).`], { q: `Two boards are ${m1} m ${c1} cm and ${m2} m ${c2} cm long. What is their total length in centimetres?`, unit: 'cm', expr: `${m1 * 100 + c1}+${m2 * 100 + c2}` });
});
skill('8-areaunits', 8, 'Measurement', 'Square units, cubic units and precision', ['1 m = 100 cm, so 1 m² = 100 × 100 = 10 000 cm².', '1 cm³ holds 1 mL, and 1 m³ holds 1000 L.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const x = r.int(2, 90) / 10, down = r.bool();
    return down ? num(dec(x * 10000), [`1 m² = 100 cm × 100 cm = 10 000 cm².`, `${dec(x)} × 10 000 = ${comma(+dec(x * 10000))}.`, `So ${dec(x)} m² = ${dec(x * 10000)} cm².`], { q: `${dec(x)} m² = ? cm²`, expr: `${x}*10000` })
      : num(dec(x), [`1 m² = 10 000 cm², so divide by 10 000.`, `${comma(+dec(x * 10000))} ÷ 10 000 = ${dec(x)}.`, `So it is ${dec(x)} m².`], { q: `${comma(+dec(x * 10000))} cm² = ? m²`, expr: `${x * 10000}/10000` });
  }
  if (t === 1) {
    const x = r.int(1, 60) / 10, toL = r.bool();
    return toL ? num(dec(x * 1000), ['1 m³ holds 1000 L.', `${dec(x)} × 1000 = ${dec(x * 1000)}.`, `So ${dec(x)} m³ = ${dec(x * 1000)} L.`], { q: `A tank holds ${dec(x)} m³ of water. How many litres is that?`, unit: 'L', expr: `${x}*1000` })
      : num(dec(x), ['1000 L = 1 m³, so divide by 1000.', `${comma(x * 1000)} ÷ 1000 = ${dec(x)}.`, `So it is ${dec(x)} m³.`], { q: `${comma(x * 1000)} L = ? m³`, expr: `${x * 1000}/1000` });
  }
  if (t === 2) { const l = r.int(2, 20), w = r.int(2, 15), h = r.int(2, 12), v = l * w * h; return num(v, [`Volume: ${l} × ${w} × ${h} = ${v} cm³.`, `1 cm³ holds 1 mL.`, `So the box holds ${v} mL.`], { q: `A box is ${l} cm by ${w} cm by ${h} cm. How many millilitres does it hold?`, unit: 'mL', expr: `${l}*${w}*${h}` }); }
  const base = r.int(2, 9), opts = [`${base} m`, `${base}.4 m`, `${base}.38 m`, `${base}.382 m`], i = r.int(0, 3);
  const most = r.bool();
  return mc(r, most ? opts[3] : opts[0], most ? opts.slice(0, 3) : opts.slice(1), { q: `Which measurement is the ${most ? 'most' : 'least'} precise?`, steps: ['Precision is about the smallest unit measured: more decimal places means a smaller unit.', `${most ? `${opts[3]} is measured to the nearest millimetre` : `${opts[0]} is only measured to the nearest metre`}, so it is the ${most ? 'most' : 'least'} precise.`] });
});

// ───────────── 14. Problem solving ─────────────
skill('8-wordprob', 8, 'Problem solving', 'Multi-step and guess-and-check problems', ['Read carefully, plan the steps, then check your answer makes sense.', 'Guess and check: try a value, see how far off it is, then adjust.'], (r) => {
  const t = r.int(0, 2), n = r.pick(NAMES);
  if (t === 0) {
    const a = r.int(2, 6), pa = r.int(3, 12) + 0.25 * r.int(0, 3), b = r.int(1, 4), pb = r.int(2, 9) + 0.5 * r.int(0, 1), paid = Math.ceil((a * pa + b * pb) / 20) * 20 + (r.bool() ? 20 : 0), ch = paid - a * pa - b * pb;
    return num(dec(ch), [`Notebooks: ${a} × ${money(pa)} = ${money(a * pa)}. Pens: ${b} × ${money(pb)} = ${money(b * pb)}.`, `Total: ${money(a * pa + b * pb)}.`, `Change: ${money(paid)} − ${money(a * pa + b * pb)} = ${money(ch)}, which is ${dec(ch)} dollars.`], { q: `${n} buys ${a} notebooks at ${money(pa)} each and ${b} packs of pens at ${money(pb)} each, and pays with ${money(paid)}. How much change is there, in dollars?`, unit: '$', expr: `${paid}-${a}*${pa}-${b}*${pb}` });
  }
  if (t === 1) {
    const c = r.int(3, 15), w = r.int(3, 15), heads = c + w, legs = 2 * c + 4 * w;
    return num(w, [`Guess: if all ${heads} were chickens there would be ${2 * heads} legs.`, `There are ${legs - 2 * heads} extra legs. Each cow adds 2 more legs, so there are ${(legs - 2 * heads) / 2} cows.`, `Check: ${c} chickens × 2 + ${w} cows × 4 = ${legs}. So there are ${w} cows.`], { q: `A farm has chickens and cows. There are ${heads} heads and ${legs} legs. How many cows are there?`, expr: `(${legs}-2*${heads})/2` });
  }
  const sh = r.int(6, 20), sm = r.pick([0, 10, 15, 20, 30, 40, 45, 50]), dh = r.int(1, 5), dm = r.int(5, 55), end = sh * 60 + sm + dh * 60 + dm, eh = Math.floor(end / 60) % 24, em = end % 60;
  const two = (x) => String(x).padStart(2, '0');
  return mc(r, `${two(eh)}:${two(em)}`, [`${two((eh + 1) % 24)}:${two(em)}`, `${two(eh)}:${two((em + 10) % 60)}`, `${two((sh + dh) % 24)}:${two((sm + dm) % 60)}`], { q: `A train leaves at ${two(sh)}:${two(sm)}. The trip takes ${dh} h ${dm} min. When does it arrive?`, steps: [`Add the hours: ${two(sh)}:${two(sm)} + ${dh} h = ${two((sh + dh) % 24)}:${two(sm)}.`, `Add ${dm} minutes: ${sm + dm >= 60 ? `${sm} + ${dm} = ${sm + dm} min, which is 1 h ${sm + dm - 60} min.` : `${sm} + ${dm} = ${sm + dm} min.`}`, `It arrives at ${two(eh)}:${two(em)}.`] });
});
skill('8-logic', 8, 'Problem solving', 'Venn diagrams and consecutive integers', ['In a Venn diagram, the overlap is counted in both circles, so subtract it once.', 'Consecutive integers go up by 1: n, n + 1, n + 2.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const both = r.int(2, 12), onlyA = r.int(3, 20), onlyB = r.int(3, 20), none = r.int(0, 10), tot = both + onlyA + onlyB + none;
    return num(none, [`Hockey: ${onlyA + both}. Soccer: ${onlyB + both}. Both: ${both}.`, `Play at least one: ${onlyA + both} + ${onlyB + both} − ${both} = ${onlyA + onlyB + both}.`, `Neither: ${tot} − ${onlyA + onlyB + both} = ${none}.`], { q: `In a class of ${tot}, ${onlyA + both} play hockey, ${onlyB + both} play soccer, and ${both} play both. How many play neither?`, expr: `${tot}-(${onlyA + both}+${onlyB + both}-${both})` });
  }
  if (t === 1) {
    const both = r.int(2, 12), onlyA = r.int(3, 20), onlyB = r.int(3, 20);
    return num(onlyA, [`Students who like cats: ${onlyA + both}, and ${both} of them like dogs too.`, `Only cats: ${onlyA + both} − ${both} = ${onlyA}.`], { q: `${onlyA + both} students like cats, ${onlyB + both} like dogs, and ${both} like both. How many like cats but not dogs?`, expr: `${onlyA + both}-${both}` });
  }
  const k = r.int(2, 4), n = r.int(-10, 40), even = r.bool(0.3), step = even ? 2 : 1, s = Array.from({ length: k }, (_, i) => n * (even ? 2 : 1) + i * step), tot = sum(s), first = s[0];
  return num(first, [`Call the smallest n. The ${k} numbers are ${Array.from({ length: k }, (_, i) => (i ? `n + ${i * step}` : 'n')).join(', ')}.`, `${k}n + ${sum(Array.from({ length: k }, (_, i) => i * step))} = ${tot}, so ${k}n = ${tot - sum(Array.from({ length: k }, (_, i) => i * step))} and n = ${neg(first)}.`, `The numbers are ${s.map(neg).join(', ')}. The smallest is ${neg(first)}.`], { q: `The sum of ${k} consecutive ${even ? 'even ' : ''}integers is ${neg(tot)}. What is the smallest one?`, expr: `(${tot}-${sum(Array.from({ length: k }, (_, i) => i * step))})/${k}` });
});

// ───────────── 15. Expressions ─────────────
skill('8-writeexpr', 8, 'Expressions', 'Write expressions and name their parts', ['A variable stands for a number we do not know yet.', 'In 5x − 3, the term 5x has coefficient 5, and −3 is a constant.'], (r) => {
  const t = r.int(0, 3), a = r.int(2, 9), b = r.int(1, 15);
  if (t === 0) {
    const forms = [[`${b} more than ${a} times a number`, `${a}n + ${b}`, [`${a}(n + ${b})`, `${b}n + ${a}`, `${a} + ${b}n`]], [`${b} less than ${a} times a number`, `${a}n − ${b}`, [`${b} − ${a}n`, `${a}(n − ${b})`, `${a} − ${b}n`]], [`${a} times the sum of a number and ${b}`, `${a}(n + ${b})`, [`${a}n + ${b}`, `n + ${a * b}`, `${a} + n + ${b}`]], [`a number divided by ${a}, minus ${b}`, `n ÷ ${a} − ${b}`, [`${a} ÷ n − ${b}`, `n ÷ (${a} − ${b})`, `${b} − n ÷ ${a}`]]];
    const [w, right, wr] = r.pick(forms);
    return mc(r, right, wr, { q: `Which expression means "${w}"? Use n for the number.`, steps: ['Find the operations in the words and their order.', `"${w}" is ${right}.`] });
  }
  if (t === 1) {
    const p = r.int(8, 25), f = r.int(2, 9);
    return mc(r, `${p}t + ${f}`, [`${p} + ${f}t`, `${p + f}t`, `${f}(t + ${p})`], { q: `Concert tickets cost $${p} each, plus a $${f} booking fee for the whole order. Which expression gives the cost for t tickets?`, steps: [`Each ticket is $${p}, so t tickets cost ${p}t.`, `The fee is added once: ${p}t + ${f}.`] });
  }
  if (t === 2) {
    const c1 = r.nonzero(-9, 9), c2 = r.nonzero(-9, 9), k = r.nonzero(-12, 12), ask = r.pick(['x', 'y', 'const']), e = `${term(c1, 'x', true)} ${term(c2, 'y')} ${sgn(k)}`;
    const ans = ask === 'x' ? c1 : ask === 'y' ? c2 : k;
    return num(ans, [`The terms are ${term(c1, 'x', true)}, ${term(c2, 'y', true)} and ${neg(k)}. Each term keeps its sign.`, ask === 'const' ? `The constant term is the number alone: ${neg(k)}.` : `The coefficient of ${ask} is the number in front of it: ${neg(ans)}.`], { q: ask === 'const' ? `What is the constant term in ${e}?` : `In ${e}, what is the coefficient of ${ask}?`, expr: `${ans}` });
  }
  const k = r.int(1, 6);
  return mc(r, `4x + ${2 * k}`, [`2x + ${k}`, `4x + ${k}`, `x^2 + ${k}x`], { q: `A rectangle is x cm long and (x + ${k}) cm wide. Which expression gives its perimeter?`, visual: { type: 'poly', points: [[1, 2], [9, 2], [9, 7], [1, 7]], labels: ['x', `x + ${k}`, '', ''] }, steps: ['Perimeter = 2 × length + 2 × width.', `2x + 2(x + ${k}) = 2x + 2x + ${2 * k} = 4x + ${2 * k}.`] });
});
skill('8-evalexpr', 8, 'Expressions', 'Evaluate expressions', ['Put each value in place of its letter, in brackets.', 'Then follow the order of operations.'], (r) => {
  const t = r.int(0, 4), x = r.nonzero(-6, 8), y = r.nonzero(-5, 6);
  if (t === 0) { const a = r.nonzero(-9, 9), b = r.int(-12, 12), v = a * x + b; return num(v, [`Put in x = ${neg(x)}: ${neg(a)} × ${par(x)} ${sgn(b)}.`, `${neg(a * x)} ${sgn(b)} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `Evaluate ${lin(a, b)} when x = ${neg(x)}.`, expr: `(${a})*(${x})+(${b})` }); }
  if (t === 1) { const a = r.int(2, 5), v = a * x - y * y; return num(v, [`Put in a = ${neg(x)} and b = ${neg(y)}: ${a} × ${par(x)} − ${par(y)}^2.`, `${neg(a * x)} − ${y * y} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `Evaluate ${a}a − b^2 when a = ${neg(x)} and b = ${neg(y)}.`, expr: `${a}*(${x})-(${y})**2` }); }
  if (t === 2) { const c = r.int(1, 12), v = Math.abs(x - c); return num(v, [`Put in x = ${neg(x)}: |${neg(x)} − ${c}| = |${neg(x - c)}|.`, `The absolute value of ${neg(x - c)} is ${v}.`, `So the value is ${v}.`], { q: `Evaluate |x − ${c}| when x = ${neg(x)}.`, expr: `Math.abs(${x}-${c})` }); }
  if (t === 3) { const s = r.int(2, 12), p = r.int(1, s * s - 1), q = s * s - p; return num(s, [`Put in the values: √(${p} + ${q}).`, `${p} + ${q} = ${s * s}, and √${s * s} = ${s}.`, `So the value is ${s}.`], { q: `Evaluate √(m + n) when m = ${p} and n = ${q}.`, expr: `Math.sqrt(${p}+${q})` }); }
  const d = r.nonzero(-6, 6), k = r.nonzero(-6, 6), top = k * d, xx = top - 3, yy = d + 1;
  return num(k, [`Top: ${neg(xx)} + 3 = ${neg(top)}. Bottom: ${neg(yy)} − 1 = ${neg(d)}.`, `${neg(top)} ÷ ${par(d)} = ${neg(k)}.`, `So the value is ${neg(k)}.`], { q: `Evaluate (x + 3)/(y − 1) when x = ${neg(xx)} and y = ${neg(yy)}.`, expr: `(${xx}+3)/(${yy}-1)` });
});

// ───────────── 16. Equivalent expressions ─────────────
skill('8-distrib', 8, 'Equivalent expressions', 'Distribute and combine like terms', ['The distributive property: a(b + c) = ab + ac.', 'Like terms have the same variable part. Add their coefficients: 3x + 5x = 8x.'], (r) => {
  const t = r.int(0, 3), a = r.nonzero(-6, 7), b = r.int(1, 9), c = r.nonzero(-9, 9);
  if (t === 0) { const right = lin(a * b, a * c); return mc(r, right, [lin(a * b, c), lin(a + b, a * c), lin(a * b, a + c), lin(b, a * c)], { q: `Expand: ${neg(a)}(${b}x ${sgn(c)})`, steps: [`Multiply each term inside by ${neg(a)}.`, `${neg(a)} × ${b}x = ${neg(a * b)}x and ${neg(a)} × ${par(c)} = ${neg(a * c)}.`, `So the answer is ${right}.`] }); }
  if (t === 1) {
    const p = r.nonzero(-9, 9), q = r.nonzero(-9, 9), u = r.nonzero(-9, 9), v = r.nonzero(-9, 9), right = lin(p + q, u + v);
    return mc(r, right, [lin(p + q + u + v, 0), lin(p - q, u + v), lin(p + q, u - v), lin(p + u, q + v)], { q: `Simplify: ${lin(p, u)} ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}x ${sgn(v)}`, steps: [`x terms: ${neg(p)}x + ${par(q)}x = ${neg(p + q)}x.`, `Numbers: ${neg(u)} + ${par(v)} = ${neg(u + v)}.`, `So the answer is ${right}.`] });
  }
  if (t === 2) {
    const k = r.int(2, 6), d = r.nonzero(-9, 9), right = lin(k + c, k * b + d);
    return mc(r, right, [lin(k + c, k + b + d), lin(k * c, k * b + d), lin(k + c, b + d)], { q: `Simplify: ${k}(x + ${b}) ${term(c, 'x')} ${sgn(d)}`, steps: [`Distribute: ${k}(x + ${b}) = ${k}x + ${k * b}.`, `Combine: ${k}x ${term(c, 'x')} = ${term(k + c, 'x', true)}; ${k * b} ${sgn(d)} = ${neg(k * b + d)}.`, `So the answer is ${right}.`] });
  }
  const props = [[`${b} + y = y + ${b}`, 'commutative property of addition'], [`${b} × y = y × ${b}`, 'commutative property of multiplication'], [`(${b} + y) + ${a < 0 ? -a : a} = ${b} + (y + ${a < 0 ? -a : a})`, 'associative property of addition'], [`${b}(y + 4) = ${b}y + ${4 * b}`, 'distributive property'], [`y + 0 = y`, 'identity property of addition'], [`y × 1 = y`, 'identity property of multiplication']];
  const [eq, right] = r.pick(props);
  return mc(r, right, r.shuffle(props.map((p) => p[1]).filter((p) => p !== right)).slice(0, 3), { q: `Which property is shown? ${eq}`, steps: [right.startsWith('commutative') ? 'The order changed, but the answer did not.' : right.startsWith('associative') ? 'The grouping (brackets) changed, not the order.' : right === 'distributive property' ? 'A number times a sum is spread over each term.' : 'Adding 0 or multiplying by 1 leaves a number the same.', `So it is the ${right}.`] });
});
skill('8-equivexpr', 8, 'Equivalent expressions', 'Equivalent expressions and factors', ['Equivalent expressions give the same value for every x.', 'Factor out the greatest common factor: 6x + 9 = 3(2x + 3).'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const g = r.int(2, 9); let a = r.int(1, 6), b = r.nonzero(-9, 9); while (gcd(a, Math.abs(b)) !== 1) b = r.nonzero(-9, 9);
    const right = `${g}(${lin(a, b)})`;
    return mc(r, right, [`${g}(${lin(a * g, b)})`, `${g}(${lin(a, b * g)})`, `${a}(${lin(g, b)})`], { q: `Factor: ${lin(g * a, g * b)}`, steps: [`The GCF of ${g * a} and ${Math.abs(g * b)} is ${g}.`, `${g * a}x ÷ ${g} = ${term(a, 'x', true)} and ${neg(g * b)} ÷ ${g} = ${neg(b)}.`, `So the answer is ${right}.`] });
  }
  if (t === 1) {
    const a = r.int(2, 6), b = r.int(1, 8), c = r.int(1, 5), d = r.nonzero(-9, 9), A = a + c, B = a * b + d;
    return mc(r, lin(A, B), [lin(A, a + b + d), lin(a * c, B), lin(A, B + 1)], { q: `Which expression is equivalent to ${a}(x + ${b}) + ${c}x ${sgn(d)}?`, steps: [`Distribute: ${a}x + ${a * b} + ${c}x ${sgn(d)}.`, `Combine like terms: ${lin(A, B)}.`, `Check with x = 1: both sides give ${A + B}.`] });
  }
  const p = r.int(5, 20), k = r.int(2, 5);
  return mc(r, `${k}(n + ${p})`, [`${k}n + ${p}`, `n + ${k * p}`, `${k + p}n`], { q: `Each of ${k} friends buys a snack for $n and a ticket for $${p}. Which expression gives the total they spend?`, steps: [`One friend spends n + ${p}.`, `${k} friends spend ${k}(n + ${p}), which is also ${k}n + ${k * p}.`] });
});

// ───────────── 17. One-variable equations ─────────────
skill('8-eqcheck', 8, 'Equations', 'Solutions and writing equations', ['A solution makes both sides of the equation equal.', 'Keep an equation balanced: do the same thing to both sides.'], (r) => {
  const t = r.int(0, 3), x = r.int(-8, 10), a = r.nonzero(-6, 6), b = r.int(-12, 12), c = a * x + b;
  if (t === 0) { const ws = [x + 1, x - 2, -x === x ? x + 3 : -x]; return mc(r, x, ws, { q: `Which value of x makes ${lin(a, b)} = ${neg(c)} true?`, steps: [`Try x = ${neg(x)}: ${neg(a)} × ${par(x)} ${sgn(b)} = ${neg(c)}.`, `Both sides are equal, so x = ${neg(x)} is the solution.`] }); }
  if (t === 1) {
    const k = r.int(2, 9), m = r.int(1, 20), tot = k * r.int(1, 12) + m;
    return mc(r, `${k}n + ${m} = ${tot}`, [`${k}(n + ${m}) = ${tot}`, `${m}n + ${k} = ${tot}`, `${k}n = ${tot} + ${m}`], { q: `Which equation says "${m} more than ${k} times a number is ${tot}"?`, steps: [`${k} times a number: ${k}n. ${m} more: ${k}n + ${m}.`, `"is ${tot}" means = ${tot}: ${k}n + ${m} = ${tot}.`] });
  }
  if (t === 2) {
    const k = r.int(2, 9), right = `divide both sides by ${k}`;
    return mc(r, right, [`subtract ${k} from both sides`, `multiply both sides by ${k}`, `add ${k} to both sides`], { q: `To solve ${k}x = ${k * x}, what should you do?`, steps: [`x is multiplied by ${k}. Division undoes multiplication.`, `So ${right}: x = ${neg(x)}.`] });
  }
  const op = r.int(0, 2);
  if (op === 0) return num(x, [`Undo + ${Math.abs(b)}: subtract ${Math.abs(b)} from both sides.`, `x = ${neg(x + Math.abs(b))} − ${Math.abs(b)} = ${neg(x)}.`], { q: `Solve: x + ${Math.abs(b)} = ${neg(x + Math.abs(b))}`, unit: 'x =', expr: `${x + Math.abs(b)}-${Math.abs(b)}` });
  if (op === 1) return num(x, [`Undo × ${par(a)}: divide both sides by ${neg(a)}.`, `x = ${neg(a * x)} ÷ ${par(a)} = ${neg(x)}.`], { q: `Solve: ${neg(a)}x = ${neg(a * x)}`, unit: 'x =', expr: `${a * x}/(${a})` });
  const k = r.int(2, 8); return num(x * k, [`Undo ÷ ${k}: multiply both sides by ${k}.`, `x = ${neg(x)} × ${k} = ${neg(x * k)}.`], { q: `Solve: x/${k} = ${neg(x)}`, unit: 'x =', expr: `${x}*${k}` });
});
skill('8-eqmulti', 8, 'Equations', 'Multi-step equations', ['Simplify each side first: distribute and combine like terms.', 'Get the x terms on one side and the numbers on the other, then divide.'], (r) => {
  const t = r.int(0, 3), x = r.int(-9, 12);
  if (t === 0) {
    const p = r.int(1, 7); let q = r.nonzero(-5, 6); if (p + q === 0) q++; const A = p + q; const b = r.int(-15, 15), c = A * x + b;
    const L = [{ eq: `${term(p, 'x', true)} ${term(q, 'x')} ${sgn(b)} = ${neg(c)}` }, { eq: `${term(A, 'x', true)} ${sgn(b)} = ${neg(c)}`, note: 'combine like terms' }, { eq: `${term(A, 'x', true)} = ${neg(c - b)}`, note: `${b >= 0 ? '−' : '+'} ${Math.abs(b)}` }, { eq: `x = ${neg(x)}`, note: `÷ ${neg(A)}` }];
    return num(x, [St(`Combine like terms: ${neg(p)}x + ${par(q)}x = ${neg(A)}x.`, eqnLines(L.slice(0, 2))), St(`${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: ${neg(A)}x = ${neg(c - b)}.`, eqnLines(L.slice(0, 3))), St(`Divide by ${neg(A)}: x = ${neg(x)}.`, eqnLines(L))], { q: `Solve: ${L[0].eq}`, unit: 'x =', expr: `(${c}-(${b}))/(${A})` });
  }
  if (t === 1) {
    const a = r.int(2, 9); let c = r.int(1, 8); if (c === a) c++;
    const b = r.int(-15, 15), d = (a - c) * x + b;
    return num(x, [St(`Subtract ${c}x from both sides: ${neg(a - c)}x ${sgn(b)} = ${neg(d)}.`), St(`${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}: ${neg(a - c)}x = ${neg(d - b)}.`), St(`Divide by ${neg(a - c)}: x = ${neg(x)}.`)], { q: `Solve: ${a}x ${sgn(b)} = ${c}x ${sgn(d)}`, unit: 'x =', expr: `(${d}-(${b}))/(${a - c})` });
  }
  if (t === 2) {
    const a = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), b = r.nonzero(-9, 9), c = a * (x + b);
    return num(x, [St(`Distribute: ${neg(a)}x ${sgn(a * b)} = ${neg(c)}.`), St(`${a * b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(a * b)}: ${neg(a)}x = ${neg(c - a * b)}.`), St(`Divide by ${neg(a)}: x = ${neg(x)}.`)], { q: `Solve: ${neg(a)}(x ${sgn(b)}) = ${neg(c)}`, unit: 'x =', expr: `${c}/(${a})-(${b})` });
  }
  const k = r.int(2, 6), xx = k * r.int(-5, 8), b = r.int(-10, 10), c = xx / k + b;
  return num(xx, [`${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: x/${k} = ${neg(c - b)}.`, `Multiply both sides by ${k}: x = ${neg(c - b)} × ${k}.`, `x = ${neg(xx)}.`], { q: `Solve: x/${k} ${sgn(b)} = ${neg(c)}`, unit: 'x =', expr: `(${c}-(${b}))*${k}` });
});
skill('8-eqword', 8, 'Equations', 'Equation word problems and formulas', ['Let a letter stand for the unknown, write an equation, and solve it.', 'To rearrange a formula, undo operations the same way you solve an equation.'], (r) => {
  const t = r.int(0, 3), n = r.pick(NAMES);
  if (t === 0) {
    const fee = r.int(10, 40), per = r.pick([0.1, 0.15, 0.2, 0.25]), m = r.int(4, 40) * 10, bill = fee + per * m;
    return num(m, [`Let m be the minutes: ${fee} + ${per}m = ${dec(bill)}.`, `${per}m = ${dec(bill)} − ${fee} = ${dec(bill - fee)}.`, `m = ${dec(bill - fee)} ÷ ${per} = ${m}.`], { q: `A phone plan costs $${fee} a month plus $${per.toFixed(2)} per minute of long-distance. ${n}'s bill was ${money(bill)}. How many long-distance minutes did ${n} use?`, expr: `(${bill}-${fee})/${per}` });
  }
  if (t === 1) {
    const w = r.int(3, 20), extra = r.int(2, 10), P = 2 * w + 2 * (w + extra);
    return num(w, [`Let the width be w. The length is w + ${extra}.`, `2w + 2(w + ${extra}) = ${P}, so 4w + ${2 * extra} = ${P}.`, `4w = ${P - 2 * extra}, so w = ${w}.`], { q: `A rectangle's length is ${extra} cm more than its width. Its perimeter is ${P} cm. What is its width?`, unit: 'cm', expr: `(${P}-2*${extra})/4` });
  }
  if (t === 2) {
    const age = r.int(8, 15), k = r.int(2, 4), plus = r.int(-6, 8), parent = k * age + plus;
    return num(age, [`Let ${n}'s age be a. Then ${k}a ${sgn(plus)} = ${parent}.`, `${k}a = ${parent - plus}.`, `a = ${parent - plus} ÷ ${k} = ${age}.`], { q: `${n}'s aunt is ${parent}. That is ${plus >= 0 ? `${plus} more than` : `${-plus} less than`} ${k} times ${n}'s age. How old is ${n}?`, expr: `(${parent}-(${plus}))/${k}` });
  }
  const forms = [['A = lw', 'w', 'w = A/l', ['w = A − l', 'w = Al', 'w = l/A'], 'Divide both sides by l.'], ['P = 2l + 2w', 'l', 'l = (P − 2w)/2', ['l = P − w', 'l = (P − w)/2', 'l = P/2 + 2w'], 'Subtract 2w, then divide by 2.'], ['d = st', 't', 't = d/s', ['t = ds', 't = s/d', 't = d − s'], 'Divide both sides by s.'], ['y = mx + b', 'x', 'x = (y − b)/m', ['x = y/m − b', 'x = (y + b)/m', 'x = m(y − b)'], 'Subtract b, then divide by m.'], ['V = Bh', 'h', 'h = V/B', ['h = VB', 'h = B/V', 'h = V − B'], 'Divide both sides by B.']];
  const [f, v, right, wr, how] = r.pick(forms);
  return mc(r, right, wr, { q: `Solve ${f} for ${v}.`, steps: [`Get ${v} on its own. ${how}`, `So ${right}.`] });
});

// ───────────── 18. One-variable inequalities ─────────────
const flipSym = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
const graphWords = (s, v) => `${s === '<' || s === '>' ? 'open' : 'closed'} circle at ${neg(v)}, shaded to the ${s === '<' || s === '≤' ? 'left' : 'right'}`;
skill('8-ineqgraph', 8, 'Inequalities', 'Inequalities and their graphs', ['An inequality has many solutions: x > 3 means every number bigger than 3.', 'On a number line, an open circle means the number is not included; a closed circle means it is.'], (r) => {
  const t = r.int(0, 2), v = r.int(-8, 8), s = r.pick(['<', '>', '≤', '≥']);
  if (t === 0) {
    const ok = (x) => (s === '<' ? x < v : s === '>' ? x > v : s === '≤' ? x <= v : x >= v);
    const cands = r.shuffle([v - 3, v - 1, v, v + 1, v + 4]); const right = cands.find(ok), wr = cands.filter((x) => !ok(x)).slice(0, 3);
    return mc(r, right, wr, { q: `Which number is a solution of x ${s} ${neg(v)}?`, steps: [`x ${s} ${neg(v)} means x is ${s === '<' ? 'less than' : s === '>' ? 'greater than' : s === '≤' ? 'less than or equal to' : 'greater than or equal to'} ${neg(v)}.`, `${neg(right)} ${s} ${neg(v)} is true, so ${neg(right)} is a solution.`] });
  }
  if (t === 1) {
    return mc(r, `x ${s} ${neg(v)}`, [`x ${flipSym[s]} ${neg(v)}`, `x ${{ '<': '≤', '≤': '<', '>': '≥', '≥': '>' }[s]} ${neg(v)}`, `x ${s} ${neg(-v || v + 1)}`], { q: `A graph has an ${graphWords(s, v)}. Which inequality does it show?`, steps: [`${s === '<' || s === '>' ? 'Open circle: the number is not included, so use < or >.' : 'Closed circle: the number is included, so use ≤ or ≥.'}`, `Shaded to the ${s === '<' || s === '≤' ? 'left means smaller numbers' : 'right means bigger numbers'}: x ${s} ${neg(v)}.`] });
  }
  const k = r.int(12, 60), forms = [[`You must be at least ${k} years old to join.`, '≥'], [`The lift can carry at most ${k * 10} kg.`, '≤'], [`Fewer than ${k} people came.`, '<'], [`It took more than ${k} minutes.`, '>']];
  const [w, sym] = r.pick(forms), val = w.includes('kg') ? k * 10 : k;
  return mc(r, `x ${sym} ${val}`, ['<', '>', '≤', '≥'].filter((y) => y !== sym).map((y) => `x ${y} ${val}`), { q: `Which inequality matches? "${w}"`, steps: [`${sym === '≥' ? '"At least" means that number or more' : sym === '≤' ? '"At most" means that number or less' : sym === '<' ? '"Fewer than" means less, not equal' : '"More than" means greater, not equal'}.`, `So x ${sym} ${val}.`] });
});
skill('8-ineqsolve', 8, 'Inequalities', 'Solve inequalities', ['Solve an inequality like an equation.', 'When you multiply or divide both sides by a negative number, flip the inequality sign.'], (r) => {
  const t = r.int(0, 2), x = r.int(-8, 10), s = r.pick(['<', '>', '≤', '≥']);
  let A, q, steps;
  if (t === 0) { A = r.nonzero(-6, 6); q = `${term(A, 'x', true)} ${s} ${neg(A * x)}`; steps = []; }
  else if (t === 1) { A = r.nonzero(-6, 6); const b = r.nonzero(-12, 12); q = `${lin(A, b)} ${s} ${neg(A * x + b)}`; steps = [`${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: ${term(A, 'x', true)} ${s} ${neg(A * x)}.`]; }
  else {
    const k = r.int(1, 5); let p = r.nonzero(-5, 8); if (p === k) p++;
    A = p - k; const B = r.int(-12, 12);   // p x + B  s  k x + (A x + B)
    q = `${lin(p, B)} ${s} ${lin(k, A * x + B)}`;
    steps = [`Subtract ${k}x from both sides: ${lin(A, B)} ${s} ${neg(A * x + B)}.`, ...(B ? [`${B > 0 ? 'Subtract' : 'Add'} ${Math.abs(B)}: ${term(A, 'x', true)} ${s} ${neg(A * x)}.`] : [])];
  }
  const sym2 = A < 0 ? flipSym[s] : s, right = `x ${sym2} ${neg(x)}`;
  steps.push(`Divide both sides by ${neg(A)}${A < 0 ? '. It is negative, so flip the sign' : ''}: ${right}.`);
  steps.push(`On a number line: ${graphWords(sym2, x)}.`);
  return mc(r, right, [`x ${A < 0 ? s : flipSym[s]} ${neg(x)}`, `x ${sym2} ${neg(A * x)}`, `x ${sym2} ${neg(x + 1)}`], { q: `Solve: ${q}`, steps });
});


// ───────────── 19. Coordinate plane ─────────────
const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
const TRIPLES8 = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]];
skill('8-coord', 8, 'Coordinate plane', 'Quadrants, moves and distance', ['(x, y): x says how far right or left, y says how far up or down.', 'Quadrant I is (+, +), II is (−, +), III is (−, −), IV is (+, −).'], (r) => {
  const t = r.int(0, 3), x = r.nonzero(-6, 6), y = r.nonzero(-6, 6);
  if (t === 0) {
    const onAxis = r.bool(0.2), X = onAxis && r.bool() ? 0 : x, Y = onAxis && X !== 0 ? 0 : y;
    const q = X === 0 ? 'on the y-axis' : Y === 0 ? 'on the x-axis' : X > 0 ? (Y > 0 ? 'Quadrant I' : 'Quadrant IV') : Y > 0 ? 'Quadrant II' : 'Quadrant III';
    return mc(r, q, ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV', 'on the x-axis'].filter((z) => z !== q).slice(0, 3), { q: `Where is the point ${pt(X, Y)}?`, visual: { type: 'plane', points: [[X, Y, 'P']] }, steps: [`x is ${X === 0 ? 'zero' : X > 0 ? 'positive' : 'negative'} and y is ${Y === 0 ? 'zero' : Y > 0 ? 'positive' : 'negative'}.`, `So ${pt(X, Y)} is ${q}.`] });
  }
  if (t === 1) {
    const sx = r.int(-6, 6), sy = r.int(-6, 6), dx = (sx > 0 ? -1 : 1) * r.int(1, 4), dy = (sy > 0 ? -1 : 1) * r.int(1, 4), nx = sx + dx, ny = sy + dy;
    const words = `${Math.abs(dx)} unit${Math.abs(dx) > 1 ? 's' : ''} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} unit${Math.abs(dy) > 1 ? 's' : ''} ${dy > 0 ? 'up' : 'down'}`;
    return mc(r, pt(nx, ny), [pt(sx + dy, sy + dx), pt(sx - dx, sy - dy), pt(nx, sy - dy)], { q: `Start at ${pt(sx, sy)}. Move ${words}. Where do you end?`, visual: { type: 'plane', points: [[sx, sy, 'start']], range: 10 }, steps: [`Right/left changes x: ${neg(sx)} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${neg(nx)}.`, `Up/down changes y: ${neg(sy)} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${neg(ny)}.`, `You end at ${pt(nx, ny)}.`] });
  }
  if (t === 2) {
    const flat = r.bool(), a = r.int(-6, 6), b1 = r.int(-6, 0), b2 = r.int(1, 6), A = flat ? [b1, a] : [a, b1], B = flat ? [b2, a] : [a, b2];
    return num(b2 - b1, [St(`The points share the same ${flat ? 'y' : 'x'}, so the distance is the difference in ${flat ? 'x' : 'y'}.`, { type: 'plane', points: [[...A, 'A'], [...B, 'B']] }), `${b2} − ${par(b1)} = ${b2 - b1}.`, `So the distance is ${b2 - b1} units.`], { q: `How far apart are ${pt(...A)} and ${pt(...B)}?`, unit: 'units', expr: `Math.abs(${b2}-(${b1}))` });
  }
  const [p, q, c] = r.pick(TRIPLES8.slice(0, 2)), sx = r.int(-6, 6 - p), sy = r.int(-6, 6 - q);
  return num(c, [St(`Make a right triangle: across ${p}, up ${q}.`, { type: 'plane', points: [[sx, sy, 'A'], [sx + p, sy + q, 'B']] }), `d^2 = ${p}^2 + ${q}^2 = ${p * p + q * q}.`, `d = √${p * p + q * q} = ${c}.`], { q: `Find the distance between ${pt(sx, sy)} and ${pt(sx + p, sy + q)}.`, unit: 'units', expr: `Math.hypot(${p},${q})` });
});

// ───────────── 20. Lines and angles ─────────────
skill('8-anglepairs', 8, 'Lines and angles', 'Complementary, supplementary and vertical angles', ['Complementary angles add to 90°. Supplementary angles add to 180°.', 'Vertical angles (across from each other where two lines cross) are equal.'], (r) => {
  const t = r.int(0, 3), a = r.int(12, 78);
  if (t === 0) return num(90 - a, [St('Complementary angles add to 90°.', { type: 'angle', deg: a, label: `${a}°` }), `90 − ${a} = ${90 - a}.`, `The complement is ${90 - a}°.`], { q: `What is the complement of a ${a}° angle?`, unit: '°', expr: `90-${a}` });
  const b = r.int(20, 160);
  if (t === 1) return num(180 - b, [St('Supplementary angles add to 180°.', { type: 'angle', deg: b, label: `${b}°` }), `180 − ${b} = ${180 - b}.`, `The supplement is ${180 - b}°.`], { q: `What is the supplement of a ${b}° angle?`, unit: '°', expr: `180-${b}` });
  if (t === 2) {
    const which = r.pick(['vertical', 'next to each other on a straight line']);
    const ans = which === 'vertical' ? b : 180 - b;
    return num(ans, [which === 'vertical' ? 'Vertical angles are across from each other, and they are equal.' : 'Angles side by side on a straight line are supplementary: they add to 180°.', which === 'vertical' ? `So the other angle is also ${b}°.` : `180 − ${b} = ${180 - b}.`, `The angle is ${ans}°.`], { q: `Two lines cross. One angle is ${b}°. What is the angle that is ${which === 'vertical' ? 'vertical to it (across from it)' : 'next to it on the same straight line'}?`, unit: '°', expr: `${ans}` });
  }
  const k = r.pick([2, 3, 4]), x = r.int(5, Math.floor((90 - 10) / (k + 1))), c = 90 - (k + 1) * x;
  if (c < 0) return num(90 - a, [`Complementary angles add to 90°.`, `90 − ${a} = ${90 - a}.`], { q: `What is the complement of a ${a}° angle?`, unit: '°', expr: `90-${a}` });
  return num(x, [`The two angles are complementary: ${k}x + (x + ${c}) = 90.`, `${k + 1}x + ${c} = 90, so ${k + 1}x = ${90 - c}.`, `x = ${x}.`], { q: `Two adjacent angles make a right angle. One is ${k}x° and the other is (x + ${c})°. What is x?`, unit: 'x =', expr: `(90-${c})/${k + 1}` });
});
skill('8-transversal', 8, 'Lines and angles', 'Parallel lines, transversals and bisectors', ['A line crossing two parallel lines makes corresponding angles that are equal and alternate interior angles that are equal.', 'Same-side interior angles add to 180°. A bisector cuts a segment or angle into two equal parts.'], (r) => {
  const t = r.int(0, 3), a = r.int(35, 145);
  if (t === 0) {
    const pairs = [['in the same position at each crossing (both above-left, say)', 'corresponding angles'], ['between the parallel lines, on opposite sides of the transversal', 'alternate interior angles'], ['outside the parallel lines, on opposite sides of the transversal', 'alternate exterior angles'], ['between the parallel lines, on the same side of the transversal', 'same-side interior angles']];
    const [desc, right] = r.pick(pairs);
    return mc(r, right, pairs.map((p) => p[1]).filter((p) => p !== right), { q: `A transversal crosses two parallel lines. Two angles are ${desc}. What are they called?`, steps: [`Look at where the two angles sit: ${desc}.`, `Those are ${right}.`] });
  }
  if (t === 1) {
    const kind = r.pick(['corresponding', 'alternate interior', 'alternate exterior', 'same-side interior']), ans = kind === 'same-side interior' ? 180 - a : a;
    return num(ans, [kind === 'same-side interior' ? 'Same-side interior angles add to 180°.' : `With parallel lines, ${kind} angles are equal.`, kind === 'same-side interior' ? `180 − ${a} = ${ans}.` : `So the angle is ${a}°.`, `The answer is ${ans}°.`], { q: `Two parallel lines are cut by a transversal. One angle is ${a}°. What is the measure of its ${kind} partner?`, unit: '°', expr: `${ans}` });
  }
  if (t === 2) {
    const x = r.int(2, 12), p = r.int(2, 5); let q = r.int(1, 6); if (q === p) q++;
    const c = r.int(1, 20), d = (p - q) * x + c;
    if (d < 1 || p < q) { const m = r.int(3, 30); return num(2 * m, [`M is the midpoint, so AM = MB = ${m}.`, `AB = ${m} + ${m} = ${2 * m}.`], { q: `M is the midpoint of segment AB, and AM = ${m} cm. How long is AB?`, unit: 'cm', expr: `2*${m}` }); }
    return num(x, [`A midpoint makes two equal parts: ${p}x + ${c} = ${q}x + ${d}.`, `${p - q}x = ${d - c}.`, `x = ${x}.`], { q: `M is the midpoint of AB. AM = ${p}x + ${c} and MB = ${q}x + ${d}. What is x?`, unit: 'x =', expr: `(${d}-${c})/${p - q}` });
  }
  const whole = 2 * r.int(15, 85);
  return num(whole / 2, [St('A bisector splits the angle into two equal angles.', { type: 'angle', deg: whole, label: `${whole}°` }), `${whole} ÷ 2 = ${whole / 2}.`, `Each part is ${whole / 2}°.`], { q: `Ray BD bisects ∠ABC, which measures ${whole}°. What is the measure of ∠ABD?`, unit: '°', expr: `${whole}/2` });
});

// ───────────── 21. Two-dimensional figures ─────────────
const NGON = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
skill('8-classify2d', 8, 'Two-dimensional figures', 'Classify polygons, triangles and quadrilaterals', ['Name a polygon by its number of sides.', 'Triangles: equilateral, isosceles or scalene by sides; acute, right or obtuse by angles.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const n = r.int(3, 10); return mc(r, NGON[n], r.shuffle(Object.values(NGON).filter((x) => x !== NGON[n])).slice(0, 3), { q: `What is a polygon with ${n} sides called?`, steps: [`Count the sides: ${n}.`, `A ${n}-sided polygon is a ${NGON[n]}.`] }); }
  if (t === 1) {
    const byAngle = r.bool();
    if (byAngle) {
      const kind = r.pick(['acute', 'right', 'obtuse']), A = kind === 'right' ? 90 : kind === 'obtuse' ? r.int(95, 150) : r.int(50, 85), B = r.int(10, Math.min(85, 180 - A - 10) ), C = 180 - A - B;
      const big = Math.max(A, B, C), right = big === 90 ? 'right' : big > 90 ? 'obtuse' : 'acute';
      return mc(r, `${right} triangle`, ['acute triangle', 'right triangle', 'obtuse triangle'].filter((x) => x !== `${right} triangle`), { q: `A triangle has angles ${A}°, ${B}° and ${C}°. What kind of triangle is it?`, steps: [`The largest angle is ${big}°.`, big === 90 ? 'It has a right angle, so it is a right triangle.' : big > 90 ? 'It has an angle over 90°, so it is obtuse.' : 'All angles are under 90°, so it is acute.'] });
    }
    const kind = r.pick(['equilateral', 'isosceles', 'scalene']), s = r.int(3, 12), sides = kind === 'equilateral' ? [s, s, s] : kind === 'isosceles' ? [s, s, r.int(Math.max(2, s - 4), s + 4) === s ? s + 1 : s + 2] : [s, s + 1, s + 3];
    return mc(r, `${kind} triangle`, ['equilateral triangle', 'isosceles triangle', 'scalene triangle'].filter((x) => x !== `${kind} triangle`), { q: `A triangle has sides ${sides.join(' cm, ')} cm. What kind of triangle is it?`, steps: [kind === 'equilateral' ? 'All three sides are equal.' : kind === 'isosceles' ? 'Exactly two sides are equal.' : 'No two sides are equal.', `So it is ${kind}.`] });
  }
  const Q = [['4 equal sides and 4 right angles', 'square'], ['4 right angles, but the sides are not all equal', 'rectangle'], ['4 equal sides, but no right angles', 'rhombus'], ['exactly one pair of parallel sides', 'trapezoid'], ['two pairs of parallel sides, no right angles, sides not all equal', 'parallelogram'], ['two pairs of equal sides next to each other, and no parallel sides', 'kite']];
  const [desc, right] = r.pick(Q);
  return mc(r, right, r.shuffle(Q.map((q) => q[1]).filter((x) => x !== right)).slice(0, 3), { q: `A quadrilateral has ${desc}. What is the best name for it?`, steps: [`Match the clues: ${desc}.`, `That is a ${right}.`] });
});
skill('8-triangleangles', 8, 'Two-dimensional figures', 'Angles in triangles', ['The three angles of a triangle add to 180°.', 'An exterior angle equals the sum of the two far-away interior angles.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const A = r.int(20, 100), B = r.int(20, 160 - A - 0), C = 180 - A - B; return num(C, [St('The angles of a triangle add to 180°.', { type: 'poly', points: [[1, 1], [9, 1], [r.int(3, 7), 8]], labels: ['', '', ''] }), `${A} + ${B} = ${A + B}.`, `180 − ${A + B} = ${C}. The missing angle is ${C}°.`], { q: `A triangle has angles of ${A}° and ${B}°. What is the third angle?`, unit: '°', expr: `180-${A}-${B}` }); }
  if (t === 1) {
    const rs = r.pick([[1, 2, 3], [2, 3, 4], [1, 1, 2], [1, 2, 6], [2, 3, 5], [3, 4, 5], [1, 3, 5], [4, 5, 9]]), tot = sum(rs), k = 180 / tot, ask = r.int(0, 2);
    return num(dec(rs[ask] * k), [`The ratio parts add to ${rs.join(' + ')} = ${tot}.`, `Each part is 180 ÷ ${tot} = ${dec(k)}°.`, `The ${['smallest', 'middle', 'largest'][ask]} angle is ${rs[ask]} × ${dec(k)} = ${dec(rs[ask] * k)}°.`], { q: `The angles of a triangle are in the ratio ${rs.join(' : ')}. What is the ${['smallest', 'middle', 'largest'][ask]} angle?`, unit: '°', expr: `180/${tot}*${rs[ask]}` });
  }
  if (t === 2) { const A = r.int(25, 80), B = r.int(25, 80); return num(A + B, ['An exterior angle equals the sum of the two interior angles that are not next to it.', `${A} + ${B} = ${A + B}.`, `The exterior angle is ${A + B}°.`], { q: `In a triangle, two angles are ${A}° and ${B}°. What is the exterior angle next to the third angle?`, unit: '°', expr: `${A}+${B}` }); }
  const top = 2 * r.int(10, 70), base = (180 - top) / 2;
  return num(base, ['An isosceles triangle has two equal base angles.', `180 − ${top} = ${180 - top}, shared by two angles.`, `${180 - top} ÷ 2 = ${base}. Each base angle is ${base}°.`], { q: `An isosceles triangle has a top angle of ${top}°. What is each base angle?`, unit: '°', expr: `(180-${top})/2` });
});
skill('8-polyangles', 8, 'Two-dimensional figures', 'Angles in polygons and circles', ['A polygon with n sides has angles that add to (n − 2) × 180°. A quadrilateral\'s add to 360°.', 'A central angle and its arc have the same measure. A circle has 360° around its centre.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) { const A = r.int(70, 110), B = r.int(70, 110), C = r.int(70, 110), D = 360 - A - B - C; return num(D, [St('The angles of a quadrilateral add to 360°.', { type: 'poly', points: [[1, 1], [8, 1], [9, 7], [2, 8]] }), `${A} + ${B} + ${C} = ${A + B + C}.`, `360 − ${A + B + C} = ${D}. The fourth angle is ${D}°.`], { q: `Three angles of a quadrilateral are ${A}°, ${B}° and ${C}°. What is the fourth angle?`, unit: '°', expr: `360-${A}-${B}-${C}` }); }
  const n = r.int(5, 12);
  if (t === 1) return num((n - 2) * 180, [`Sum = (n − 2) × 180° with n = ${n}.`, `(${n} − 2) × 180 = ${n - 2} × 180 = ${(n - 2) * 180}.`, `The angles add to ${(n - 2) * 180}°.`], { q: `What is the sum of the interior angles of a polygon with ${n} sides${NGON[n] ? ` (a ${NGON[n]})` : ''}?`, unit: '°', expr: `(${n}-2)*180` });
  if (t === 2) { const m = r.pick([5, 6, 8, 9, 10, 12]), each = (m - 2) * 180 / m; return num(each, [`Sum = (${m} − 2) × 180 = ${(m - 2) * 180}°.`, `A regular polygon has equal angles: ${(m - 2) * 180} ÷ ${m} = ${each}.`, `Each angle is ${each}°.`], { q: `What is each interior angle of a regular polygon with ${m} sides?`, unit: '°', expr: `(${m}-2)*180/${m}` }); }
  if (t === 3) {
    const parts = [['the distance from the centre to the circle', 'radius'], ['a segment through the centre with both ends on the circle', 'diameter'], ['a segment with both ends on the circle (not through the centre)', 'chord'], ['part of the circle between two points', 'arc']];
    const [d, right] = r.pick(parts);
    return mc(r, right, parts.map((p) => p[1]).filter((p) => p !== right), { q: `What part of a circle is ${d}?`, steps: [`${d[0].toUpperCase() + d.slice(1)}: that is a ${right}.`, `So the answer is ${right}.`] });
  }
  const a = r.int(20, 160), b = r.int(20, 340 - a - 20 > 160 ? 160 : 340 - a - 20), c = 360 - a - b;
  return num(c, ['The central angles around a circle add to 360°.', `360 − ${a} − ${b} = ${c}.`, `So the third arc measures ${c}°.`], { q: `A circle is split into three arcs by three radii. Two of the central angles are ${a}° and ${b}°. What is the measure of the third arc?`, unit: '°', expr: `360-${a}-${b}` });
});

// ───────────── 22. Transformations and congruence ─────────────
const ROT = { '90° clockwise': (x, y) => [y, -x], '90° counterclockwise': (x, y) => [-y, x], '180°': (x, y) => [-x, -y] };
skill('8-transcoords', 8, 'Transformations', 'Translations, reflections and rotations', ['A translation slides, a reflection flips, a rotation turns. Each keeps the same size and shape.', 'Reflect in the x-axis: (x, y) → (x, −y). In the y-axis: (x, y) → (−x, y). Turn 180° about the origin: (x, y) → (−x, −y).'], (r) => {
  const t = r.int(0, 3), x = r.nonzero(-5, 5), y = r.nonzero(-5, 5); let ans, how, desc;
  if (t === 0) { const a = r.nonzero(-4, 4), b = r.nonzero(-4, 4); ans = [x + a, y + b]; desc = `translated ${Math.abs(a)} ${a > 0 ? 'right' : 'left'} and ${Math.abs(b)} ${b > 0 ? 'up' : 'down'}`; how = `Add ${neg(a)} to x and ${neg(b)} to y.`; }
  else if (t === 1) { const axis = r.pick(['x', 'y']); ans = axis === 'x' ? [x, -y] : [-x, y]; desc = `reflected in the ${axis}-axis`; how = axis === 'x' ? 'Reflecting in the x-axis keeps x and changes the sign of y.' : 'Reflecting in the y-axis keeps y and changes the sign of x.'; }
  else if (t === 2) { const k = r.pick(Object.keys(ROT)); ans = ROT[k](x, y); desc = `rotated ${k} about the origin`; how = { '90° clockwise': '90° clockwise: (x, y) → (y, −x).', '90° counterclockwise': '90° counterclockwise: (x, y) → (−y, x).', '180°': '180°: (x, y) → (−x, −y).' }[k]; }
  else { ans = [x + 2, -y]; desc = 'reflected in the x-axis and then translated 2 units right'; how = `Reflect: ${pt(x, -y)}. Then add 2 to x.`; }
  return mc(r, pt(...ans), [pt(-ans[0], ans[1]), pt(ans[0], -ans[1]), pt(ans[1], ans[0]), pt(-ans[0], -ans[1]), pt(ans[0] + 1, ans[1]), pt(x, y)].filter((p) => p !== pt(...ans)), { q: `Point A is at ${pt(x, y)}. It is ${desc}. Where is A'?`, visual: { type: 'plane', points: [[x, y, 'A']] }, steps: [how, St(`So A' is at ${pt(...ans)}.`, { type: 'plane', points: [[x, y, 'A'], [ans[0], ans[1], "A'"]], range: 10 })] });
});
skill('8-transid', 8, 'Transformations', 'Name transformations and symmetry', ['Compare the old and new points to see what happened.', 'A line of symmetry folds a shape onto itself.'], (r) => {
  const t = r.int(0, 1);
  if (t === 0) {
    const kinds = [['translation', (x, y) => [x + 3, y - 2]], ['reflection in the y-axis', (x, y) => [-x, y]], ['reflection in the x-axis', (x, y) => [x, -y]], ['rotation of 180° about the origin', (x, y) => [-x, -y]], ['dilation by a scale factor of 2', (x, y) => [2 * x, 2 * y]]];
    const [right, f] = r.pick(kinds), ox = r.int(0, 2), oy = r.int(0, 2), P = [[1, 1], [4, 1], [1, 3]].map(([a, b]) => [a + ox, b + oy]), Q = P.map(([a, b]) => f(a, b));
    return mc(r, right, r.shuffle(kinds.map((k) => k[0]).filter((k) => k !== right)).slice(0, 3), { q: `Triangle ${P.map(([a, b]) => pt(a, b)).join(', ')} is moved to ${Q.map(([a, b]) => pt(a, b)).join(', ')}. Which transformation is this?`, steps: [`Compare: ${pt(...P[0])} → ${pt(...Q[0])}.`, `Every point follows the same rule, so it is a ${right}.`] });
  }
  const shapes = [['a square', 4], ['an equilateral triangle', 3], ['a regular hexagon', 6], ['a rectangle that is not a square', 2], ['a regular pentagon', 5], ['an isosceles triangle that is not equilateral', 1], ['a parallelogram with no right angles and unequal sides', 0], ['a rhombus that is not a square', 2]];
  const [s, n] = r.pick(shapes);
  return num(n, [n ? `Try each fold that matches one half onto the other.` : 'No fold makes the two halves match.', `So ${s} has ${n} line${n === 1 ? '' : 's'} of symmetry.`], { q: `How many lines of symmetry does ${s} have?`, expr: `${n}` });
});
skill('8-congruent', 8, 'Transformations', 'Congruent figures', ['Congruent figures have the same size and shape: one can be moved onto the other by slides, flips and turns.', 'In △ABC ≅ △DEF, the letters match in order: A ↔ D, B ↔ E, C ↔ F.'], (r) => {
  const t = r.int(0, 3), L = r.shuffle(['A', 'B', 'C']), M = ['D', 'E', 'F'];
  const name1 = L.join(''), match = (s) => M[L.indexOf(s)];
  if (t === 0) {
    const [p, q] = r.shuffle(['A', 'B', 'C']).slice(0, 2), right = [match(p), match(q)].join('');
    return mc(r, right, ['DE', 'EF', 'DF', 'ED', 'FE', 'FD'].filter((x) => x !== right && x !== [...right].reverse().join('')).slice(0, 3), { q: `△${name1} ≅ △DEF. Which side matches side ${p}${q}?`, steps: [`Match the letters in order: ${L.map((l, i) => `${l} ↔ ${M[i]}`).join(', ')}.`, `${p} ↔ ${match(p)} and ${q} ↔ ${match(q)}, so ${p}${q} matches ${right}.`] });
  }
  if (t === 1) { const v = r.pick(['A', 'B', 'C']), deg = r.int(25, 110); return num(deg, [`Letters match in order, so ∠${v} ↔ ∠${match(v)}.`, `Corresponding angles of congruent figures are equal.`, `∠${match(v)} = ${deg}°.`], { q: `△${name1} ≅ △DEF and ∠${v} = ${deg}°. What is ∠${match(v)}?`, unit: '°', expr: `${deg}` }); }
  if (t === 2) { const [p, q] = r.shuffle(['A', 'B', 'C']).slice(0, 2), len = r.int(3, 25); return num(len, [`${p}${q} matches ${match(p)}${match(q)}.`, 'Corresponding sides of congruent figures are equal.', `${match(p)}${match(q)} = ${len} cm.`], { q: `△${name1} ≅ △DEF and ${p}${q} = ${len} cm. How long is ${match(p)}${match(q)}?`, unit: 'cm', expr: `${len}` }); }
  const right = r.pick(['a dilation by a scale factor of 3', 'a dilation by a scale factor of 1/2']);
  return mc(r, right, ['a translation', 'a reflection', 'a rotation of 90°'], { q: 'Which move does NOT always give a figure congruent to the original?', steps: ['Translations, reflections and rotations keep size and shape.', `${right[0].toUpperCase() + right.slice(1)} changes the size, so the image is not congruent.`] });
});

// ───────────── 23. Transformations and similarity ─────────────
skill('8-dilation', 8, 'Similarity', 'Dilations and scale factors', ['A dilation about the origin by scale factor k sends (x, y) to (kx, ky).', 'k > 1 makes the figure bigger; 0 < k < 1 makes it smaller. The scale factor is new length ÷ old length.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const k = r.pick([2, 3, 0.5]), x = (k === 0.5 ? 2 : 1) * r.nonzero(-4, 4), y = (k === 0.5 ? 2 : 1) * r.nonzero(-3, 3), ans = [x * k, y * k];
    return mc(r, pt(...ans), [pt(x + k, y + k), pt(x * k, y), pt(y * k, x * k)].filter((p) => p !== pt(...ans)), { q: `Point P ${pt(x, y)} is dilated about the origin by a scale factor of ${k === 0.5 ? '1/2' : k}. Where is P'?`, steps: [`Multiply each coordinate by ${k === 0.5 ? '1/2' : k}.`, `${neg(x)} × ${k === 0.5 ? '1/2' : k} = ${neg(ans[0])} and ${neg(y)} × ${k === 0.5 ? '1/2' : k} = ${neg(ans[1])}.`, `P' is at ${pt(...ans)}.`] });
  }
  if (t === 1) {
    const [p, q] = r.pick([[2, 1], [3, 1], [4, 1], [1, 2], [1, 3], [3, 2], [2, 3], [5, 2], [1, 4]]), old = q * r.int(2, 6), nw = old * p / q;
    return num(frac(p, q), [`Scale factor = new length ÷ old length.`, `${nw} ÷ ${old} = ${frac(nw, old)}.`, `The scale factor is ${frac(p, q)}${p < q ? ', so the image is smaller' : ''}.`], { q: `A side of ${old} cm becomes ${nw} cm after a dilation. What is the scale factor?`, expr: `${nw}/${old}` });
  }
  const sim = r.bool(), k = r.int(2, 4), a = r.int(2, 6), b = a + r.int(1, 4);
  return mc(r, sim ? 'Yes, they are similar' : 'No, they are not similar', [sim ? 'No, they are not similar' : 'Yes, they are similar'], { q: `Rectangle A is ${a} cm by ${b} cm. Rectangle B is ${a * k} cm by ${sim ? b * k : b * k + 1} cm. Are they similar?`, steps: [`Compare the ratios: ${a * k} ÷ ${a} = ${k} and ${sim ? b * k : b * k + 1} ÷ ${b} = ${dec((sim ? b * k : b * k + 1) / b, 2)}.`, sim ? 'Both sides grew by the same factor, so they are similar.' : 'The factors are different, so they are not similar.'] });
});
skill('8-similar', 8, 'Similarity', 'Similar figures', ['Similar figures have equal angles and proportional sides.', 'Find the scale factor, then multiply or divide to find a missing side.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const [a, b] = [r.int(3, 9), r.int(4, 12)], k = r.pick([2, 3, 1.5, 2.5]), A = a * k, B = b * k;
    return num(dec(B), [`Scale factor: ${dec(A)} ÷ ${a} = ${k}.`, `Missing side: ${b} × ${k} = ${dec(B)}.`, `The missing side is ${dec(B)} cm.`], { q: `Two triangles are similar. In the small one, two sides are ${a} cm and ${b} cm. In the large one, the side that matches ${a} cm is ${dec(A)} cm. How long is the side that matches ${b} cm?`, unit: 'cm', expr: `${b}*${A}/${a}` });
  }
  if (t === 1) { const d = r.int(25, 120); return num(d, ['Similar figures have equal corresponding angles.', `The scale factor changes lengths, not angles.`, `So the matching angle is ${d}°.`], { q: `Quadrilateral PQRS is similar to WXYZ, with a scale factor of ${r.int(2, 5)}. ∠Q = ${d}°. What is ∠X?`, unit: '°', expr: `${d}` }); }
  const A = r.int(30, 80), B = r.int(30, 90), C = 180 - A - B, sim = r.bool(), B2 = sim ? B : B + r.pick([-6, 5, 8]);
  return mc(r, sim ? 'Yes' : 'No', [sim ? 'No' : 'Yes'], { q: `Triangle 1 has angles ${A}° and ${B}°. Triangle 2 has angles ${A}° and ${B2}°. Are the triangles similar?`, steps: [`Third angles: 180 − ${A} − ${B} = ${C}° and 180 − ${A} − ${B2} = ${180 - A - B2}°.`, sim ? 'All three angles match, so yes, they are similar.' : 'The angles do not all match, so no, they are not similar.'] });
});

// ───────────── 24. Pythagorean theorem ─────────────
skill('8-pythapply', 8, 'Pythagorean theorem', 'Use the Pythagorean theorem', ['In a right triangle, a^2 + b^2 = c^2, where c is the hypotenuse.', 'If a^2 + b^2 = c^2 for three sides, the triangle has a right angle (the converse).'], (r) => {
  const t = r.int(0, 3), [a, b, c] = r.pick(TRIPLES8.concat([[7, 24, 25], [12, 16, 20], [20, 21, 29]]));
  if (t === 0) {
    const yes = r.bool(), C = yes ? c : c + r.pick([-1, 1]);
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: `A triangle has sides ${a}, ${b} and ${C}. Is it a right triangle?`, steps: [`Check a^2 + b^2 = c^2 with the longest side as c.`, `${a}^2 + ${b}^2 = ${a * a + b * b} and ${C}^2 = ${C * C}.`, yes ? 'They are equal, so yes, it is a right triangle.' : 'They are not equal, so no, it is not a right triangle.'] });
  }
  if (t === 1) return num(b, [St(`The ladder is the hypotenuse: ${c}^2 = ${a}^2 + h^2.`, { type: 'righttri', a: `${a} m`, b: 'h', c: `${c} m` }), `h^2 = ${c * c} − ${a * a} = ${b * b}.`, `h = √${b * b} = ${b}. The ladder reaches ${b} m up the wall.`], { q: `A ${c} m ladder leans against a wall. Its foot is ${a} m from the wall. How high up the wall does it reach?`, unit: 'm', expr: `Math.sqrt(${c}**2-${a}**2)` });
  if (t === 2) return num(a + b + c, [St(`Find the hypotenuse: √(${a}^2 + ${b}^2) = √${c * c} = ${c}.`, { type: 'righttri', a, b, c: '?' }), `Perimeter = ${a} + ${b} + ${c}.`, `= ${a + b + c} cm.`], { q: `A right triangle has legs ${a} cm and ${b} cm. What is its perimeter?`, unit: 'cm', expr: `${a}+${b}+Math.hypot(${a},${b})` });
  return num(c, [`The diagonal cuts the rectangle into two right triangles with legs ${a} and ${b}.`, `d^2 = ${a * a} + ${b * b} = ${c * c}.`, `d = ${c}. The diagonal is ${c} m.`], { q: `A rectangular field is ${a} m by ${b} m. How long is the path straight across from corner to corner?`, visual: { type: 'righttri', a: `${a} m`, b: `${b} m`, c: '?' }, unit: 'm', expr: `Math.hypot(${a},${b})` });
});

// ───────────── 25. Three-dimensional figures ─────────────
const SOLIDS = [['cube', 6, 12, 8], ['rectangular prism', 6, 12, 8], ['triangular prism', 5, 9, 6], ['square pyramid', 5, 8, 5], ['triangular pyramid', 4, 6, 4], ['pentagonal prism', 7, 15, 10], ['hexagonal prism', 8, 18, 12], ['pentagonal pyramid', 6, 10, 6]];
skill('8-solids', 8, 'Three-dimensional figures', 'Faces, nets and views of solids', ['A solid has faces (flat surfaces), edges (where faces meet) and vertices (corners).', 'A net is a flat pattern that folds into the solid.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const [s, F, E, V] = r.pick(SOLIDS), ask = r.int(0, 2), ans = [F, E, V][ask], w = ['faces', 'edges', 'vertices'][ask];
    return num(ans, [s.includes('prism') || s === 'cube' ? 'A prism has two matching bases joined by rectangles.' : 'A pyramid has one base, with triangles meeting at a top point.', `Count the ${w}: ${ans}.`, `A ${s} has ${ans} ${w}.`], { q: `How many ${w} does a ${s} have?`, expr: `${ans}` });
  }
  if (t === 1) {
    const nets = [['2 triangles and 3 rectangles', 'triangular prism'], ['1 square and 4 triangles', 'square pyramid'], ['6 squares', 'cube'], ['2 circles and 1 rectangle', 'cylinder'], ['4 triangles', 'triangular pyramid'], ['1 circle and a curved sector', 'cone']];
    const [d, right] = r.pick(nets);
    return mc(r, right, r.shuffle(nets.map((n) => n[1]).filter((x) => x !== right)).slice(0, 3), { q: `A net is made of ${d}. What solid does it fold into?`, steps: [`Look at the bases and the sides: ${d}.`, `That folds into a ${right}.`] });
  }
  if (t === 2) {
    const views = [['a circle', 'a rectangle', 'cylinder'], ['a circle (with a point in the centre)', 'a triangle', 'cone'], ['a square', 'a square', 'cube'], ['a square (with lines to the centre)', 'a triangle', 'square pyramid'], ['a circle', 'a circle', 'sphere']];
    const [top, front, right] = r.pick(views);
    return mc(r, right, r.shuffle(views.map((v) => v[2]).filter((x) => x !== right)).slice(0, 3), { q: `A solid looks like ${top} from the top and ${front} from the front. What is it?`, steps: [`Top view: ${top}. Front view: ${front}.`, `That is a ${right}.`] });
  }
  const k = r.pick([2, 3, 1.5]), h = r.int(4, 12), w = r.int(2, 8);
  return num(dec(w * k), [`Similar solids grow by the same scale factor in every direction.`, `Scale factor: ${dec(h * k)} ÷ ${h} = ${k}.`, `Width: ${w} × ${k} = ${dec(w * k)} cm.`], { q: `Two boxes are similar. The small one is ${h} cm tall and ${w} cm wide. The large one is ${dec(h * k)} cm tall. How wide is the large one?`, unit: 'cm', expr: `${w}*${h * k}/${h}` });
});

// ───────────── 26. Perimeter and area ─────────────
skill('8-areas', 8, 'Perimeter and area', 'Area and perimeter of polygons', ['Parallelogram: A = b × h. Triangle: A = b × h ÷ 2. Trapezoid: A = (a + b) ÷ 2 × h.', 'If every length is multiplied by k, the perimeter is multiplied by k and the area by k^2.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const kind = r.pick(['parallelogram', 'trapezoid', 'triangle']), b = r.int(4, 9), h = r.int(2, 8), a = r.int(1, b - 1);
    if (kind === 'parallelogram') return num(b * h, [St('A = base × height.', { type: 'poly', points: [[1, 1], [1 + b, 1], [2 + b, 1 + h], [2, 1 + h]], labels: [`${b} m`, '', '', ''], grid: true }), `${b} × ${h} = ${b * h}.`, `The area is ${b * h} m².`], { q: `A parallelogram has base ${b} m and height ${h} m. What is its area?`, unit: 'm²', expr: `${b}*${h}` });
    if (kind === 'triangle') return num(dec(b * h / 2), ['A = base × height ÷ 2.', `${b} × ${h} ÷ 2 = ${dec(b * h / 2)}.`, `The area is ${dec(b * h / 2)} m².`], { q: `A triangle has base ${b} m and height ${h} m. What is its area?`, visual: { type: 'poly', points: [[1, 1], [1 + b, 1], [2, 1 + h]], labels: [`${b} m`, '', ''], grid: true }, unit: 'm²', expr: `${b}*${h}/2` });
    return num(dec((a + b) * h / 2), ['A = (a + b) ÷ 2 × h.', `(${a} + ${b}) ÷ 2 = ${dec((a + b) / 2)}, then × ${h}.`, `The area is ${dec((a + b) * h / 2)} m².`], { q: `A trapezoid has parallel sides ${a} m and ${b} m, and height ${h} m. What is its area?`, visual: { type: 'poly', points: [[1, 1], [1 + b, 1], [1 + a, 1 + h], [1, 1 + h]], labels: [`${b} m`, '', `${a} m`, `${h} m`], grid: true }, unit: 'm²', expr: `(${a}+${b})/2*${h}` });
  }
  if (t === 1) {
    const sides = Array.from({ length: r.int(4, 6) }, () => r.int(3, 20)), P = sum(sides);
    return num(P, ['Perimeter is the distance all the way around.', `${sides.join(' + ')} = ${P}.`, `The perimeter is ${P} cm.`], { q: `A ${NGON[sides.length]} has sides ${sides.join(' cm, ')} cm. What is its perimeter?`, unit: 'cm', expr: sides.join('+') });
  }
  if (t === 2) {
    const L = r.int(8, 20), W = r.int(6, 14), s = r.int(2, Math.min(L, W) - 2);
    return num(L * W - s * s, [`Big rectangle: ${L} × ${W} = ${L * W} m².`, `Square pool: ${s} × ${s} = ${s * s} m².`, `Grass: ${L * W} − ${s * s} = ${L * W - s * s} m².`], { q: `A ${L} m by ${W} m yard has a ${s} m by ${s} m square pool. What area of the yard is not pool?`, unit: 'm²', expr: `${L}*${W}-${s}*${s}` });
  }
  const k = r.pick([2, 3, 4]), A = r.int(5, 40), area = r.bool();
  return num(area ? A * k * k : A * k, [`Every length is multiplied by ${k}.`, area ? `Area is multiplied by ${k}^2 = ${k * k}: ${A} × ${k * k} = ${A * k * k}.` : `Perimeter is multiplied by ${k}: ${A} × ${k} = ${A * k}.`, `The new ${area ? 'area' : 'perimeter'} is ${area ? A * k * k : A * k} ${area ? 'cm²' : 'cm'}.`], { q: `A shape has ${area ? `area ${A} cm²` : `perimeter ${A} cm`}. Every side is made ${k} times as long. What is the new ${area ? 'area' : 'perimeter'}?`, unit: area ? 'cm²' : 'cm', expr: area ? `${A}*${k}**2` : `${A}*${k}` });
});
skill('8-circles', 8, 'Perimeter and area', 'Circles, semicircles and quarter circles', ['Circumference C = 2 × π × r = π × d. Area A = π × r^2.', 'A semicircle is half a circle; a quarter circle is a quarter. Use π ≈ 3.14.'], (r) => {
  const t = r.int(0, 3), rad = r.int(2, 15);
  if (t === 0) { const useD = r.bool(), C = 2 * 3.14 * rad; return num(dec(C, 2), [useD ? `C = π × d = 3.14 × ${2 * rad}.` : `C = 2 × π × r = 2 × 3.14 × ${rad}.`, `= ${dec(C, 2)}.`, `The circumference is ${dec(C, 2)} cm.`], { tol: 0.01, q: `A circle has ${useD ? `diameter ${2 * rad}` : `radius ${rad}`} cm. Using π ≈ 3.14, what is its circumference? Round to the nearest hundredth.`, unit: 'cm', expr: `2*3.14*${rad}` }); }
  if (t === 1) { const A = 3.14 * rad * rad, useD = r.bool(); return num(dec(A, 2), [useD ? `The radius is half the diameter: ${2 * rad} ÷ 2 = ${rad}.` : `r = ${rad}.`, `A = 3.14 × ${rad}^2 = 3.14 × ${rad * rad} = ${dec(A, 2)}.`, `The area is ${dec(A, 2)} cm².`], { tol: 0.01, q: `A circle has ${useD ? `diameter ${2 * rad}` : `radius ${rad}`} cm. Using π ≈ 3.14, what is its area? Round to the nearest hundredth.`, unit: 'cm²', expr: `3.14*${rad}**2` }); }
  if (t === 2) { const d = r.int(50, 80), turns = r.int(10, 100), dist = 3.14 * d * turns / 100; return num(dec(dist, 2), [`One turn rolls one circumference: 3.14 × ${d} = ${dec(3.14 * d, 2)} cm.`, `${turns} turns: ${dec(3.14 * d, 2)} × ${turns} = ${dec(3.14 * d * turns, 2)} cm.`, `In metres: ÷ 100 = ${dec(dist, 2)} m.`], { tol: 0.01, q: `A bike wheel has a diameter of ${d} cm. How many metres does the bike travel when the wheel turns ${turns} times? (π ≈ 3.14; round to the nearest hundredth)`, unit: 'm', expr: `3.14*${d}*${turns}/100` }); }
  const half = r.bool(), part = half ? 2 : 4, A = 3.14 * rad * rad / part, perim = r.bool();
  if (perim) { const P = 2 * 3.14 * rad / part + (half ? 2 * rad : 2 * rad); return num(dec(P, 2), [`Curved part: 2 × 3.14 × ${rad} ÷ ${part} = ${dec(2 * 3.14 * rad / part, 2)}.`, half ? `Add the straight side, the diameter: ${2 * rad}.` : `Add the two straight radii: ${rad} + ${rad} = ${2 * rad}.`, `Perimeter = ${dec(P, 2)} cm.`], { tol: 0.01, q: `A ${half ? 'semicircle' : 'quarter circle'} has radius ${rad} cm. Using π ≈ 3.14, what is its perimeter (curved part plus straight sides)? Round to the nearest hundredth.`, unit: 'cm', expr: `2*3.14*${rad}/${part}+2*${rad}` }); }
  return num(dec(A, 2), [`A full circle: 3.14 × ${rad}^2 = ${dec(3.14 * rad * rad, 2)}.`, `${half ? 'Half' : 'A quarter'} of it: ÷ ${part} = ${dec(A, 2)}.`, `The area is ${dec(A, 2)} cm².`], { tol: 0.01, q: `A ${half ? 'semicircle' : 'quarter circle'} has radius ${rad} cm. Using π ≈ 3.14, what is its area? Round to the nearest hundredth.`, unit: 'cm²', expr: `3.14*${rad}**2/${part}` });
});
skill('8-compound', 8, 'Perimeter and area', 'Area of compound figures', ['Split a compound figure into shapes you know.', 'Add the areas of the parts, or subtract a part that is cut out.'], (r) => {
  const t = r.int(0, 2), w = 2 * r.int(2, 5), L = r.int(5, 12);
  if (t === 0) { const rad = w / 2, A = L * w + 3.14 * rad * rad / 2; return num(dec(A, 2), [`Rectangle: ${L} × ${w} = ${L * w} m².`, `Semicircle on the ${w} m side: radius ${rad}, area 3.14 × ${rad}^2 ÷ 2 = ${dec(3.14 * rad * rad / 2, 2)} m².`, `Total: ${L * w} + ${dec(3.14 * rad * rad / 2, 2)} = ${dec(A, 2)} m².`], { tol: 0.01, q: `A garden is a ${L} m by ${w} m rectangle with a semicircle on one ${w} m end. Using π ≈ 3.14, what is its area? Round to the nearest hundredth.`, unit: 'm²', expr: `${L}*${w}+3.14*${rad}**2/2` }); }
  if (t === 1) { const h = r.int(2, 8), A = L * w + L * h / 2; return num(dec(A), [St(`Rectangle: ${L} × ${w} = ${L * w}.`, { type: 'poly', points: [[0, 0], [L > 10 ? 10 : L, 0], [L > 10 ? 10 : L, Math.min(5, w / 2)], [(L > 10 ? 10 : L) / 2, Math.min(5, w / 2) + Math.min(4, h / 2)], [0, Math.min(5, w / 2)]] }), `Triangle on top: ${L} × ${h} ÷ 2 = ${dec(L * h / 2)}.`, `Total: ${L * w} + ${dec(L * h / 2)} = ${dec(A)} m².`], { tol: 0.01, q: `The front of a shed is a ${L} m wide, ${w} m tall rectangle with a triangle roof on top that is ${h} m tall. What is the area of the front?`, unit: 'm²', expr: `${L}*${w}+${L}*${h}/2` }); }
  const s = r.int(4, 12), A = s * s - 3.14 * s * s / 4;
  return num(dec(A, 2), [`Square: ${s} × ${s} = ${s * s}.`, `Quarter circle of radius ${s}: 3.14 × ${s}^2 ÷ 4 = ${dec(3.14 * s * s / 4, 2)}.`, `Left over: ${s * s} − ${dec(3.14 * s * s / 4, 2)} = ${dec(A, 2)} cm².`], { tol: 0.01, q: `A square tile has sides of ${s} cm. A quarter circle of radius ${s} cm, centred on one corner, is cut out. Using π ≈ 3.14, what area of the tile is left? Round to the nearest hundredth.`, unit: 'cm²', expr: `${s}**2-3.14*${s}**2/4` });
});

// ───────────── 27. Surface area and volume ─────────────
skill('8-volume', 8, 'Surface area and volume', 'Volume of prisms and compound solids', ['Volume of a prism = area of the base × height.', 'For a compound solid, add the volumes of the parts.'], (r) => {
  const t = r.int(0, 3), l = r.int(2, 12), w = r.int(2, 10), h = r.int(2, 10);
  if (t === 0) return num(l * w * h, [`Base area: ${l} × ${w} = ${l * w}.`, `× height ${h}: ${l * w} × ${h} = ${l * w * h}.`, `The volume is ${l * w * h} cm³.`], { q: `A box is ${l} cm long, ${w} cm wide and ${h} cm high. What is its volume?`, unit: 'cm³', expr: `${l}*${w}*${h}` });
  if (t === 1) { const b = 2 * r.int(1, 6), th = r.int(2, 9), len = r.int(3, 15), B = b * th / 2; return num(B * len, [`The base is a triangle: ${b} × ${th} ÷ 2 = ${B} cm².`, `× length ${len}: ${B} × ${len} = ${B * len}.`, `The volume is ${B * len} cm³.`], { q: `A triangular prism has a triangle base with base ${b} cm and height ${th} cm. The prism is ${len} cm long. What is its volume?`, unit: 'cm³', expr: `${b}*${th}/2*${len}` }); }
  if (t === 2) { const l2 = r.int(2, l), h2 = r.int(2, 8); return num(l * w * h + l2 * w * h2, [`First box: ${l} × ${w} × ${h} = ${l * w * h}.`, `Second box: ${l2} × ${w} × ${h2} = ${l2 * w * h2}.`, `Total: ${l * w * h + l2 * w * h2} m³.`], { q: `A building is made of two boxes: one ${l} m × ${w} m × ${h} m, and on top of it one ${l2} m × ${w} m × ${h2} m. What is the total volume?`, unit: 'm³', expr: `${l}*${w}*${h}+${l2}*${w}*${h2}` }); }
  const L = r.int(4, 12) * 10, W = r.int(3, 6) * 10, H = r.int(3, 6) * 10, V = L * W * H;
  return num(V / 1000, [`Volume: ${L} × ${W} × ${H} = ${comma(V)} cm³.`, `1000 cm³ = 1 L, so ÷ 1000.`, `The tank holds ${V / 1000} L.`], { q: `An aquarium is ${L} cm long, ${W} cm wide and ${H} cm high. How many litres of water does it hold when full?`, unit: 'L', expr: `${L}*${W}*${H}/1000` });
});
skill('8-surface', 8, 'Surface area and volume', 'Surface area', ['Surface area is the total area of all the faces. A net helps you count them all.', 'Cylinder: SA = 2 × π × r^2 + 2 × π × r × h. If lengths grow by k, surface area grows by k^2 and volume by k^3.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const l = r.int(2, 12), w = r.int(2, 10), h = r.int(2, 10), SA = 2 * (l * w + l * h + w * h); return num(SA, [`Three pairs of faces: ${l} × ${w} = ${l * w}, ${l} × ${h} = ${l * h}, ${w} × ${h} = ${w * h}.`, `Add them and double: 2 × (${l * w} + ${l * h} + ${w * h}) = ${SA}.`, `The surface area is ${SA} cm².`], { q: `What is the surface area of a box ${l} cm by ${w} cm by ${h} cm?`, unit: 'cm²', expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` }); }
  if (t === 1) { const rad = r.int(1, 8), h = r.int(2, 15), SA = 2 * 3.14 * rad * rad + 2 * 3.14 * rad * h; return num(dec(SA, 2), [`Two circles: 2 × 3.14 × ${rad}^2 = ${dec(2 * 3.14 * rad * rad, 2)}.`, `Curved side: 2 × 3.14 × ${rad} × ${h} = ${dec(2 * 3.14 * rad * h, 2)}.`, `Total: ${dec(SA, 2)} cm².`], { q: `A cylinder has radius ${rad} cm and height ${h} cm. Using π ≈ 3.14, what is its surface area?`, unit: 'cm²', expr: `2*3.14*${rad}**2+2*3.14*${rad}*${h}` }); }
  if (t === 2) { const b = r.int(2, 12), s = r.int(3, 15), SA = b * b + 4 * (b * s / 2); return num(SA, [`Square base: ${b} × ${b} = ${b * b}.`, `Four triangles: 4 × (${b} × ${s} ÷ 2) = ${4 * b * s / 2}.`, `Total: ${b * b} + ${4 * b * s / 2} = ${SA} cm².`], { q: `A square pyramid has base edges of ${b} cm. Each triangle face has a height (slant height) of ${s} cm. What is the surface area?`, unit: 'cm²', expr: `${b}**2+2*${b}*${s}` }); }
  const k = r.pick([2, 3]), v = r.bool(), x = r.int(5, 40);
  return num(v ? x * k ** 3 : x * k * k, [`Each length is multiplied by ${k}.`, v ? `Volume is multiplied by ${k}^3 = ${k ** 3}: ${x} × ${k ** 3} = ${x * k ** 3}.` : `Surface area is multiplied by ${k}^2 = ${k * k}: ${x} × ${k * k} = ${x * k * k}.`, `The answer is ${v ? x * k ** 3 : x * k * k} ${v ? 'cm³' : 'cm²'}.`], { q: `A small cube-shaped box has ${v ? `volume ${x} cm³` : `surface area ${x} cm²`}. A similar box has edges ${k} times as long. What is its ${v ? 'volume' : 'surface area'}?`, unit: v ? 'cm³' : 'cm²', expr: v ? `${x}*${k}**3` : `${x}*${k}**2` });
});

// ───────────── 28. Proportional relationships ─────────────
const KS = [0.5, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 12];
const xsFor = (r) => r.shuffle([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 4).sort((a, b) => a - b);
skill('8-constprop', 8, 'Proportional relationships', 'Constant of proportionality', ['In a proportional relationship, y ÷ x is always the same number, k.', 'The equation is y = kx, and the graph is a straight line through (0, 0).'], (r) => {
  const t = r.int(0, 3), k = r.pick(KS), xs = xsFor(r), ys = xs.map((x) => +dec(k * x));
  if (t === 0) return num(dec(k), [`Divide y by x: ${ys[0]} ÷ ${xs[0]} = ${dec(k)}.`, `Check another: ${ys[1]} ÷ ${xs[1]} = ${dec(k)}.`, `So k = ${dec(k)}.`], { q: 'y is proportional to x. What is the constant of proportionality?', visual: { type: 'table', head: ['x', ...xs], rows: [['y', ...ys]] }, unit: 'k =', expr: `${ys[2]}/${xs[2]}` });
  if (t === 1) return mc(r, `y = ${dec(k)}x`, [`y = x + ${dec(ys[0] - xs[0]) === '0' ? 1 : dec(ys[0] - xs[0])}`, `x = ${dec(k)}y`, `y = ${dec(k)}x + ${dec(k)}`], { q: 'Which equation fits the table?', visual: { type: 'table', head: ['x', ...xs], rows: [['y', ...ys]] }, steps: [`y ÷ x = ${dec(k)} for every column.`, `So y = ${dec(k)}x.`] });
  if (t === 2) {
    const m = r.pick([1, 2, 3, 0.5]), a = m === 0.5 ? r.pick([2, 4]) : r.int(1, 2);
    return num(dec(m), [St(`The line goes through (0, 0) and (${a}, ${dec(m * a)}).`, { type: 'plane', points: [[a, m * a, `(${a}, ${dec(m * a)})`]], lines: [[m, 0]] }), `k = y ÷ x = ${dec(m * a)} ÷ ${a} = ${dec(m)}.`, `So k = ${dec(m)}.`], { q: 'The graph shows a proportional relationship. What is the constant of proportionality?', visual: { type: 'plane', points: [[a, m * a, `(${a}, ${dec(m * a)})`]], lines: [[m, 0]] }, unit: 'k =', expr: `${m * a}/${a}` });
  }
  const p = r.int(5, 40) / 4, kg = r.int(2, 5), want = r.int(6, 12), u = p / kg * want;
  return num(dec(u, 2), [`k = cost ÷ mass = ${money(p)} ÷ ${kg} = ${dec(p / kg, 4)} dollars per kg.`, `y = ${dec(p / kg, 4)}x, so for ${want} kg: ${dec(p / kg, 4)} × ${want} = ${dec(u, 4)}.`, `It costs about ${money(+u.toFixed(2))}, which is ${dec(u, 2)} dollars.`], { q: `The cost of rice is proportional to its mass. ${kg} kg cost ${money(p)}. How much do ${want} kg cost, in dollars? (Round to the nearest cent.)`, unit: '$', tol: 0.006, expr: `${p}/${kg}*${want}` });
});
skill('8-propid', 8, 'Proportional relationships', 'Is it proportional?', ['Proportional: y ÷ x is the same each time, and the graph is a straight line through the origin.', 'y = 3x is proportional; y = 3x + 2 is not, because it does not go through (0, 0).'], (r) => {
  const t = r.int(0, 3), k = r.pick([2, 3, 4, 5, 1.5]);
  if (t === 0) {
    const yes = r.bool(), c = r.int(1, 5), xs = xsFor(r), ys = xs.map((x) => +dec(k * x + (yes ? 0 : c)));
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'Is y proportional to x in this table?', visual: { type: 'table', head: ['x', ...xs], rows: [['y', ...ys]] }, steps: [`Find y ÷ x: ${xs.map((x, i) => dec(ys[i] / x, 2)).join(', ')}.`, yes ? 'They are all the same, so yes, it is proportional.' : 'They are not all the same, so no, it is not proportional.'] });
  }
  if (t === 1) { const c = r.int(1, 9); return mc(r, `y = ${dec(k)}x`, [`y = ${dec(k)}x + ${c}`, `y = x + ${c}`, `y = ${dec(k)}x − ${c}`], { q: 'Which equation shows a proportional relationship?', steps: ['A proportional equation has the form y = kx, with nothing added.', `y = ${dec(k)}x is the only one: when x = 0, y = 0.`] }); }
  if (t === 2) {
    const m = r.pick([1, 2, 0.5, -1]), b = r.bool() ? 0 : r.nonzero(-3, 3), yes = b === 0;
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'Does this graph show a proportional relationship?', visual: { type: 'plane', lines: [[m, b]] }, steps: ['A proportional graph is a straight line through the origin (0, 0).', yes ? 'This line goes through (0, 0), so yes.' : `This line crosses the y-axis at ${neg(b)}, not 0, so no.`] });
  }
  const sp = r.int(4, 12) * 10;
  return mc(r, `The car travels ${sp} km in 1 hour.`, [`The car travels 1 km in ${sp} hours.`, `The car has travelled ${sp + 1} km in all.`, `The car starts ${sp} km from home.`], { q: `A graph of distance (km) against time (hours) is proportional and passes through (1, ${sp}). What does the point (1, ${sp}) mean?`, steps: ['x is time in hours and y is distance in km.', `(1, ${sp}): in 1 hour the car travels ${sp} km. That is the unit rate.`] });
});

// ───────────── 29. Linear functions ─────────────
skill('8-linsat', 8, 'Linear relations', 'Points and tables for linear functions', ['To check a point, put its x into the equation and see if you get its y.', 'To fill a table, put each x into the equation.'], (r) => {
  const t = r.int(0, 2), m = r.nonzero(-4, 4), b = r.int(-6, 6), eq = `y = ${lin(m, b)}`;
  if (t === 0) {
    const x = r.int(-4, 5), yes = r.bool(), y = m * x + b + (yes ? 0 : r.pick([-2, -1, 1, 2]));
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: `Is (${neg(x)}, ${neg(y)}) on the line ${eq}?`, steps: [`Put in x = ${neg(x)}: y = ${neg(m)} × ${par(x)} ${sgn(b)} = ${neg(m * x + b)}.`, yes ? `That matches y = ${neg(y)}, so yes.` : `${neg(m * x + b)} is not ${neg(y)}, so no.`] });
  }
  if (t === 1) {
    const xs = [-2, -1, 0, 1, 2, 3], hide = r.int(0, 5), ys = xs.map((x, i) => (i === hide ? '?' : m * x + b)), x = xs[hide];
    return num(m * x + b, [`Put x = ${neg(x)} into ${eq}.`, `y = ${neg(m)} × ${par(x)} ${sgn(b)} = ${neg(m * x + b)}.`, `The missing value is ${neg(m * x + b)}.`], { q: `Complete the table for ${eq}. What is the missing y?`, visual: { type: 'table', head: ['x', ...xs.map(neg)], rows: [['y', ...ys.map((v) => (v === '?' ? v : neg(v)))]] }, expr: `(${m})*(${x})+(${b})` });
  }
  const x = r.int(-3, 3), right = pt(x, m * x + b);
  return mc(r, right, [pt(x, m * x + b + 1), pt(x + 1, m * x + b - m + (m === 1 ? 1 : 0) ), pt(-x === x ? x + 2 : -x, m * x + b)].filter((p) => p !== right), { q: `Which point is on the graph of ${eq}?`, visual: { type: 'plane', lines: [[m, b]] }, steps: [`Test each point in the equation.`, `${right}: ${neg(m)} × ${par(x)} ${sgn(b)} = ${neg(m * x + b)}. It works.`] });
});
skill('8-rate', 8, 'Linear relations', 'Rate of change', ['Rate of change = change in y ÷ change in x.', 'If the rate of change is the same everywhere, the relationship is linear.'], (r) => {
  const t = r.int(0, 2), m = r.pick([-3, -2, -1, 1, 2, 3, 4, 5, 0.5, -0.5, 1.5]), b = r.int(-5, 10), dx = r.pick([1, 2, 5]);
  const xs = [0, 1, 2, 3].map((i) => i * dx), ys = xs.map((x) => +dec(m * x + b));
  if (t === 0) return num(dec(m), [`Change in y: ${neg(ys[1])} − ${par(ys[0])} = ${neg(+dec(ys[1] - ys[0]))}. Change in x: ${dx}.`, `Rate = ${neg(+dec(ys[1] - ys[0]))} ÷ ${dx} = ${D(m)}.`, `The rate of change is ${D(m)}.`], { q: 'What is the rate of change shown in the table?', visual: { type: 'table', head: ['x', ...xs], rows: [['y', ...ys.map(D)]] }, expr: `(${ys[3]}-(${ys[0]}))/${xs[3]}` });
  if (t === 1) {
    const mm = r.pick([-2, -1, 1, 2, 3, 0.5]), bb = r.int(-3, 3), x1 = r.int(-4, 0), x2 = x1 + (mm === 0.5 ? 4 : r.int(1, 3)), y1 = mm * x1 + bb, y2 = mm * x2 + bb;
    const vis = { type: 'plane', points: [[x1, y1, 'A'], [x2, y2, 'B']], lines: [[mm, bb]], range: 8 };
    return num(dec(mm), [St(`A is ${pt(x1, y1)} and B is ${pt(x2, y2)}.`, vis), `Rise ${neg(y2 - y1)}, run ${x2 - x1}: ${neg(y2 - y1)} ÷ ${x2 - x1} = ${D(mm)}.`, `The rate of change is ${D(mm)}.`], { q: `What is the rate of change of the line through A ${pt(x1, y1)} and B ${pt(x2, y2)}?`, visual: vis, expr: `(${y2}-(${y1}))/(${x2}-(${x1}))` });
  }
  const yes = r.bool(), ys2 = yes ? ys : ys.map((y, i) => (i === 3 ? y + r.pick([-3, 2, 4]) : y));
  return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'Is the rate of change constant in this table?', visual: { type: 'table', head: ['x', ...xs], rows: [['y', ...ys2.map(D)]] }, steps: [`Changes in y each step: ${ys2.slice(1).map((y, i) => D(+dec(y - ys2[i]))).join(', ')}.`, yes ? 'They are all the same, so yes, it is constant (linear).' : 'They are not all the same, so no.'] });
});
skill('8-linwrite', 8, 'Linear relations', 'Write and interpret linear functions', ['y = mx + b: m is the rate of change and b is the starting value (where x = 0).', 'In a story, b is the fixed amount and m is the amount for each unit.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const m = r.nonzero(-5, 5), b = r.int(-8, 8), xs = [0, 1, 2, 3], ys = xs.map((x) => m * x + b), right = `y = ${lin(m, b)}`;
    return mc(r, right, [`y = ${lin(b || 1, m)}`, `y = ${lin(m, b + m)}`, `y = ${lin(-m, b)}`], { q: 'Which linear function matches the table?', visual: { type: 'table', head: ['x', ...xs], rows: [['y', ...ys.map(neg)]] }, steps: [`Each time x goes up 1, y changes by ${neg(m)}: m = ${neg(m)}.`, `When x = 0, y = ${neg(b)}: b = ${neg(b)}.`, `So ${right}.`] });
  }
  if (t === 1) {
    const f = r.int(3, 6) + 0.5 * r.int(0, 1), per = r.pick([1.5, 2, 2.25, 2.5]);
    return mc(r, `C = ${per}d + ${f}`, [`C = ${f}d + ${per}`, `C = ${dec(f + per)}d`, `C = ${per}(d + ${f})`], { q: `A taxi charges $${f.toFixed(2)} to start plus $${per.toFixed(2)} for each kilometre. Which function gives the cost C for d km?`, steps: [`The rate is $${per.toFixed(2)} per km: ${per}d.`, `The fixed start is $${f.toFixed(2)}: C = ${per}d + ${f}.`] });
  }
  if (t === 2) {
    const m = r.int(10, 30), b = r.int(20, 80);
    return mc(r, `A one-time sign-up fee of $${b}`, [`The cost of each class, $${b}`, `The number of classes, ${b}`, `The total cost after ${m} classes`], { q: `The cost of dance classes is C = ${m}n + ${b}, where n is the number of classes. What does ${b} mean?`, steps: [`${m}n changes with the number of classes: $${m} each.`, `${b} is added once, even when n = 0: it is a one-time fee of $${b}.`] });
  }
  const start = r.int(10, 50) * 20, rate = r.pick([10, 20, 25, 40, 50]), mins = start / rate;
  if (!Number.isInteger(mins)) return num(start, ['The starting amount is the value at time 0.', `So the answer is ${start}.`], { q: `A tank's water is W = ${start} − ${rate}t litres after t minutes. How much water is in it at the start?`, unit: 'L', expr: `${start}` });
  return num(mins, [`The tank starts with ${start} L and loses ${rate} L each minute: W = ${start} − ${rate}t.`, `Empty means W = 0: ${rate}t = ${start}.`, `t = ${start} ÷ ${rate} = ${mins} minutes.`], { q: `A tank holds ${start} L and drains at ${rate} L per minute. After how many minutes is it empty?`, unit: 'min', expr: `${start}/${rate}` });
});

// ───────────── 30. Sequences ─────────────
skill('8-seq', 8, 'Sequences', 'Arithmetic and geometric sequences', ['An arithmetic sequence adds the same number each time: 3, 7, 11, 15 (+4).', 'A geometric sequence multiplies by the same number each time: 2, 6, 18, 54 (×3).'], (r) => {
  const t = r.int(0, 3), a = r.int(-10, 20), d = r.nonzero(-9, 9), g0 = r.int(1, 5), q = r.pick([2, 3, -2, 4, 5]);
  const ar = [0, 1, 2, 3].map((i) => a + i * d), ge = [0, 1, 2, 3].map((i) => g0 * q ** i);
  if (t === 0) {
    const kind = r.pick(['arithmetic', 'geometric', 'neither']), sq = kind === 'arithmetic' ? ar : kind === 'geometric' ? ge : [1, 2, 3, 4].map((n) => n * n + a);
    return mc(r, kind, ['arithmetic', 'geometric', 'neither'].filter((x) => x !== kind), { q: `Is this sequence arithmetic, geometric or neither? ${sq.map(neg).join(', ')}, …`, steps: [kind === 'arithmetic' ? `Each term adds ${neg(d)}.` : kind === 'geometric' ? `Each term is multiplied by ${neg(q)}.` : `The differences are ${sq.slice(1).map((x, i) => neg(x - sq[i])).join(', ')}: not the same, and there is no common ratio.`, `So it is ${kind}.`] });
  }
  if (t === 1) return num(a + 4 * d, [`The difference is ${neg(ar[1])} − ${par(ar[0])} = ${neg(d)}.`, `Next: ${neg(ar[3])} ${sgn(d)} = ${neg(a + 4 * d)}.`], { q: `What is the next term? ${ar.map(neg).join(', ')}, …`, expr: `${ar[3]}+(${d})` });
  if (t === 2) return num(g0 * q ** 4, [`The ratio is ${neg(ge[1])} ÷ ${par(ge[0])} = ${neg(q)}.`, `Next: ${neg(ge[3])} × ${par(q)} = ${neg(g0 * q ** 4)}.`], { q: `What is the next term? ${ge.map(neg).join(', ')}, …`, expr: `${ge[3]}*(${q})` });
  const h = r.int(2, 10), gr = r.int(2, 8) / 2, w = r.int(3, 10);
  return num(dec(h + gr * w), [`The height goes up ${dec(gr)} cm each week: an arithmetic sequence.`, `After ${w} weeks: ${h} + ${w} × ${dec(gr)} = ${dec(h + gr * w)}.`, `The plant is ${dec(h + gr * w)} cm tall.`], { q: `A plant is ${h} cm tall. It grows ${dec(gr)} cm every week. How tall is it after ${w} weeks?`, unit: 'cm', expr: `${h}+${w}*${gr}` });
});
skill('8-seqexpr', 8, 'Sequences', 'Expressions for sequences', ['For an arithmetic sequence with difference d, the nth term is d × n + (first term − d).', '3, 7, 11, … has d = 4, so the nth term is 4n − 1.'], (r) => {
  const t = r.int(0, 2), d = r.nonzero(-6, 9), c = r.int(-8, 10), terms = [1, 2, 3, 4].map((n) => d * n + c);
  if (t === 0) return mc(r, lin(d, c, 'n'), [lin(d, terms[0], 'n'), lin(c || 1, d, 'n'), lin(d, c + 1, 'n')], { q: `Which expression gives the nth term of ${terms.map(neg).join(', ')}, …?`, steps: [`The difference is ${neg(d)}, so start with ${neg(d)}n.`, `When n = 1, ${neg(d)}n = ${neg(d)}, but the term is ${neg(terms[0])}: adjust by ${neg(c)}.`, `So the nth term is ${lin(d, c, 'n')}.`] });
  const n = r.int(5, 30);
  if (t === 1) return num(d * n + c, [`Put n = ${n} into ${lin(d, c, 'n')}.`, `${neg(d)} × ${n} ${sgn(c)} = ${neg(d * n + c)}.`, `The term is ${neg(d * n + c)}.`], { q: `The nth term of a sequence is ${lin(d, c, 'n')}. What is term number ${n}?`, expr: `(${d})*${n}+(${c})` });
  return num(n, [`Set ${lin(d, c, 'n')} = ${neg(d * n + c)}.`, `${neg(d)}n = ${neg(d * n)}, so n = ${neg(d * n)} ÷ ${par(d)}.`, `n = ${n}. It is term number ${n}.`], { q: `The nth term of a sequence is ${lin(d, c, 'n')}. Which term number has the value ${neg(d * n + c)}?`, expr: `(${d * n + c}-(${c}))/(${d})` });
});

// ───────────── 31. Data and graphs ─────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
skill('8-graphread', 8, 'Data and graphs', 'Read tables and bar graphs', ['Read the labels and the scale first.', 'Then find the numbers you need and work with them.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const vals = DAYS.map(() => r.int(20, 95)), [i, j] = r.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
    return num(Math.abs(vals[i] - vals[j]), [`${DAYS[i]}: ${vals[i]}. ${DAYS[j]}: ${vals[j]}.`, `Difference: ${Math.max(vals[i], vals[j])} − ${Math.min(vals[i], vals[j])} = ${Math.abs(vals[i] - vals[j])}.`, `So the difference is ${Math.abs(vals[i] - vals[j])}.`], { q: `How many more library visitors were there on ${vals[i] >= vals[j] ? DAYS[i] : DAYS[j]} than on ${vals[i] >= vals[j] ? DAYS[j] : DAYS[i]}?`, visual: { type: 'table', head: ['Day', ...DAYS], rows: [['Visitors', ...vals]] }, expr: `Math.abs(${vals[i]}-${vals[j]})` });
  }
  if (t === 1) {
    const labels = r.shuffle(['Hockey', 'Soccer', 'Swim', 'Dance', 'Chess', 'Art']).slice(0, 4), vals = labels.map(() => r.int(1, 10) * 5), tot = sum(vals);
    return num(tot, [`Read each bar: ${labels.map((l, i) => `${l} ${vals[i]}`).join(', ')}.`, `Add: ${vals.join(' + ')} = ${tot}.`, `So ${tot} students in all.`], { q: 'The bar graph shows students in each club. How many students are in the clubs altogether?', visual: { type: 'bars', labels, values: vals, title: 'Club members' }, expr: vals.join('+') });
  }
  if (t === 2) {
    const g = [['how the temperature changed over a day', 'line graph'], ['what percent of a budget goes to each item', 'circle graph'], ['the number of pets of each kind in a class', 'bar graph'], ['how many students scored in each range: 50–59, 60–69, 70–79', 'histogram'], ['the link between hours studied and test score for many students', 'scatter plot']];
    const [d, right] = r.pick(g);
    return mc(r, right, r.shuffle(g.map((x) => x[1]).filter((x) => x !== right)).slice(0, 3), { q: `Which type of graph is best for showing ${d}?`, steps: ['Line graphs show change over time; circle graphs show parts of a whole; bar graphs compare groups; histograms show ranges; scatter plots show a link between two things.', `So use a ${right}.`] });
  }
  const books = [0, 1, 2, 3, 4, 5], f = books.map(() => r.int(0, 7)), cut = r.int(1, 4), ans = sum(f.slice(cut + 1));
  return num(ans, [`More than ${cut} means ${books.slice(cut + 1).join(', ')} books.`, `Add those counts: ${f.slice(cut + 1).join(' + ')} = ${ans}.`, `So ${ans} students.`], { q: `The line plot data are shown in the table. How many students read more than ${cut} book${cut > 1 ? 's' : ''}?`, visual: { type: 'table', head: ['Books read', ...books], rows: [['Students (×)', ...f]] }, expr: f.slice(cut + 1).join('+') || '0' });
});
skill('8-stemleaf', 8, 'Data and graphs', 'Stem-and-leaf plots, histograms and frequency tables', ['In a stem-and-leaf plot, 4 | 7 means 47: the stem is the tens, the leaf is the ones.', 'A histogram uses bars for ranges of values, with no gaps between them.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const stems = [r.int(1, 5)]; stems.push(stems[0] + 1, stems[0] + 2, stems[0] + 3);
    const data = stems.map((s) => Array.from({ length: r.int(1, 5) }, () => r.int(0, 9)).sort((a, b) => a - b).map((l) => s * 10 + l)), all = data.flat().sort((a, b) => a - b);
    const ask = r.pick(['range', 'count', 'greatest']), cut = stems[1] * 10 + r.int(0, 9);
    const ans = ask === 'range' ? all.at(-1) - all[0] : ask === 'count' ? all.filter((x) => x > cut).length : all.at(-1);
    return num(ans, [`Read the values: ${all.join(', ')}.`, ask === 'range' ? `Range = greatest − least = ${all.at(-1)} − ${all[0]} = ${ans}.` : ask === 'count' ? `Count the values greater than ${cut}: ${ans}.` : `The greatest value is ${ans}.`, `So the answer is ${ans}.`], { q: `The stem-and-leaf plot shows test scores. ${ask === 'range' ? 'What is the range?' : ask === 'count' ? `How many scores are greater than ${cut}?` : 'What is the highest score?'}`, visual: { type: 'table', head: ['Stem', 'Leaf'], rows: data.map((d, i) => [stems[i], d.map((x) => x % 10).join(' ')]) }, expr: `${ans}` });
  }
  if (t === 1) {
    const labels = ['0–9', '10–19', '20–29', '30–39', '40–49'], vals = labels.map(() => r.int(1, 12)), i = r.int(0, 3), ans = vals[i] + vals[i + 1];
    return num(ans, [`The bars for ${labels[i]} and ${labels[i + 1]} show ${vals[i]} and ${vals[i + 1]}.`, `${vals[i]} + ${vals[i + 1]} = ${ans}.`, `So ${ans} players.`], { q: `The histogram shows points scored by players this season. How many players scored from ${labels[i].split('–')[0]} to ${labels[i + 1].split('–')[1]} points?`, visual: { type: 'bars', labels, values: vals, title: 'Points scored' }, expr: `${vals[i]}+${vals[i + 1]}` });
  }
  const data = Array.from({ length: 12 }, () => r.int(10, 49)), lo = r.pick([10, 20, 30, 40]), ans = data.filter((x) => x >= lo && x <= lo + 9).length;
  return num(ans, [`Look for values from ${lo} to ${lo + 9}: ${data.filter((x) => x >= lo && x <= lo + 9).join(', ') || 'none'}.`, `Count them: the frequency is ${ans}.`, `So the row for ${lo}–${lo + 9} has ${ans}.`], { q: `Ages of people at an event: ${data.join(', ')}. In a frequency table, what is the frequency for ${lo}–${lo + 9}?`, expr: `${ans}` });
});
skill('8-circlegraph', 8, 'Data and graphs', 'Circle graphs', ['A circle graph shows parts of a whole. All the parts add to 100%.', 'A part\'s central angle is its percent of 360°: 25% is 90°.'], (r) => {
  const t = r.int(0, 2), cats = r.shuffle(['Hockey', 'Soccer', 'Basketball', 'Swimming', 'Skating']).slice(0, 4);
  const ps = [r.pick([10, 15, 20, 25]), r.pick([15, 20, 25, 30]), r.pick([10, 15, 20])]; ps.push(100 - sum(ps));
  const vis = { type: 'table', head: ['Favourite sport', 'Percent'], rows: cats.map((c, i) => [c, `${ps[i]}%`]) }, i = r.int(0, 3);
  if (t === 0) { const N = r.int(4, 30) * 20, ans = ps[i] * N / 100; return num(dec(ans), [`${cats[i]} is ${ps[i]}% of the circle.`, `${ps[i]}% of ${N} = ${dec(ps[i] / 100)} × ${N} = ${dec(ans)}.`, `So ${dec(ans)} students chose ${cats[i].toLowerCase()}.`], { q: `A circle graph shows the favourite sports of ${N} students. How many chose ${cats[i].toLowerCase()}?`, visual: vis, expr: `${ps[i]}/100*${N}` }); }
  if (t === 1) return num(dec(ps[i] * 3.6), [`A full circle is 360°.`, `${ps[i]}% of 360 = ${dec(ps[i] / 100)} × 360 = ${dec(ps[i] * 3.6)}.`, `The central angle is ${dec(ps[i] * 3.6)}°.`], { q: `In a circle graph of these data, what is the central angle for ${cats[i].toLowerCase()}?`, visual: vis, unit: '°', expr: `${ps[i]}/100*360` });
  const ang = r.pick([36, 54, 72, 90, 108, 126, 144, 180, 18]), p = ang / 3.6;
  return num(dec(p), ['The whole circle is 360° = 100%.', `${ang} ÷ 360 × 100 = ${dec(p)}.`, `That part is ${dec(p)}% of the whole.`], { q: `A part of a circle graph has a central angle of ${ang}°. What percent of the whole is it?`, unit: '%', expr: `${ang}/360*100` });
});

// ───────────── 32. One-variable statistics ─────────────
skill('8-centre', 8, 'Statistics', 'Mean, median, mode and range', ['Mean: add the values and divide by how many. Median: the middle value in order.', 'Mode: the most common value. Range: greatest − least.'], (r) => {
  const t = r.int(0, 1), which = r.pick(['mean', 'median', 'mode', 'range']), n = r.pick([5, 7]);
  let xs = r.shuffle(Array.from({ length: 39 }, (_, i) => i + 2)).slice(0, n);
  if (which === 'mean') { const m = r.int(5, 30); xs = Array.from({ length: n - 1 }, () => r.int(Math.max(1, m - 10), m + 10)); xs.push(m * n - sum(xs)); if (xs.at(-1) < 0) xs[n - 1] = Math.abs(xs.at(-1)); }
  if (which === 'mode') { xs[1] = xs[0]; xs[3] = xs[0]; xs = r.shuffle(xs); }
  const s = [...xs].sort((a, b) => a - b), cnt = {}; xs.forEach((x) => (cnt[x] = (cnt[x] ?? 0) + 1));
  const ans = which === 'mean' ? dec(sum(xs) / n, 2) : which === 'median' ? s[(n - 1) / 2] : which === 'range' ? s.at(-1) - s[0] : +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
  const steps = which === 'mean' ? [`Add: ${xs.join(' + ')} = ${sum(xs)}.`, `Divide by ${n}: ${sum(xs)} ÷ ${n} = ${ans}.`, `The mean is ${ans}.`] : which === 'median' ? [`Put in order: ${s.join(', ')}.`, `The middle (value number ${(n + 1) / 2}) is ${ans}.`, `The median is ${ans}.`] : which === 'range' ? [`Greatest: ${s.at(-1)}. Least: ${s[0]}.`, `${s.at(-1)} − ${s[0]} = ${ans}.`, `The range is ${ans}.`] : [`Count each value: ${ans} appears ${cnt[ans]} times, more than any other.`, `The mode is ${ans}.`];
  const ex = which === 'mean' ? `(${xs.join('+')})/${n}` : `${ans}`;
  if (t === 0) return num(ans, steps, { q: `Find the ${which} of: ${xs.join(', ')}${which === 'mean' ? ' (to 2 decimal places if needed)' : ''}`, expr: ex, ...(which === 'mean' ? { tol: 0.006 } : {}) });
  const names = NAMES.slice(0, n);
  return num(ans, steps, { q: `The table shows how many goals each player scored. What is the ${which}?${which === 'mean' ? ' (to 2 decimal places if needed)' : ''}`, visual: { type: 'table', head: ['Player', 'Goals'], rows: names.map((p, i) => [p, xs[i]]) }, expr: ex, ...(which === 'mean' ? { tol: 0.006 } : {}) });
});
skill('8-missing', 8, 'Statistics', 'Missing values and changes in data', ['The mean × the number of values = the total.', 'A new value above the mean pulls the mean up; below the mean pulls it down.'], (r) => {
  const t = r.int(0, 2), n = r.int(4, 6), m = r.int(60, 90), xs = Array.from({ length: n - 1 }, () => r.int(m - 15, Math.min(100, m + 15))), miss = m * n - sum(xs);
  if (t === 0 && miss >= 0 && miss <= 100) return num(miss, [`Total needed: ${m} × ${n} = ${m * n}.`, `Known total: ${xs.join(' + ')} = ${sum(xs)}.`, `Missing score: ${m * n} − ${sum(xs)} = ${miss}.`], { q: `${r.pick(NAMES)} has test scores ${xs.join(', ')} and one more test. To have a mean of ${m} over all ${n} tests, what must the last score be?`, expr: `${m}*${n}-(${xs.join('+')})` });
  if (t <= 1) {
    const mean = sum(xs) / xs.length, nw = r.pick([Math.round(mean) + r.int(5, 20), Math.max(0, Math.round(mean) - r.int(5, 20))]), right = nw > mean ? 'The mean goes up.' : nw < mean ? 'The mean goes down.' : 'The mean stays the same.';
    return mc(r, right, ['The mean goes up.', 'The mean goes down.', 'The mean stays the same.'].filter((x) => x !== right), { q: `The data are ${xs.join(', ')}. The value ${nw} is added. What happens to the mean?`, steps: [`The mean now is ${sum(xs)} ÷ ${xs.length} ≈ ${dec(mean, 2)}.`, `${nw} is ${nw > mean ? 'above' : 'below'} the mean, so it pulls the mean ${nw > mean ? 'up' : 'down'}.`, right] });
  }
  const lo = Math.min(...xs), hi = Math.max(...xs), R = hi - lo + r.int(3, 10), up = r.bool(), ans = up ? lo + R : hi - R;
  return num(ans, [`Range = greatest − least, and now the range is ${R}.`, up ? `The new value must be the greatest: ${lo} + ${R} = ${ans}.` : `The new value must be the least: ${hi} − ${R} = ${ans}.`, `So the missing value is ${ans}.`], { q: `The data ${xs.join(', ')} get one more value, which is ${up ? 'greater than all the others' : 'less than all the others'}. The new range is ${R}. What is the new value?`, expr: up ? `${lo}+${R}` : `${hi}-${R}` });
});
skill('8-quartiles', 8, 'Statistics', 'Quartiles and samples', ['Quartiles split ordered data into four parts. Q1 is the median of the lower half; Q3 is the median of the upper half.', 'A good sample is random and represents the whole group; a biased sample favours some people.'], (r) => {
  const t = r.int(0, 1);
  if (t === 0) {
    const n = r.pick([7, 11]), xs = Array.from({ length: n }, () => r.int(1, 60)), s = [...xs].sort((a, b) => a - b), h = (n - 1) / 2, lower = s.slice(0, h), upper = s.slice(h + 1);
    const q1 = lower[(lower.length - 1) / 2], q3 = upper[(upper.length - 1) / 2], ask = r.pick(['Q1', 'Q3', 'IQR']), ans = ask === 'Q1' ? q1 : ask === 'Q3' ? q3 : q3 - q1;
    return num(ans, [`In order: ${s.join(', ')}. The median is ${s[h]}.`, `Lower half: ${lower.join(', ')} → Q1 = ${q1}. Upper half: ${upper.join(', ')} → Q3 = ${q3}.`, ask === 'IQR' ? `IQR = Q3 − Q1 = ${q3} − ${q1} = ${ans}.` : `So ${ask} = ${ans}.`], { q: `Find ${ask === 'IQR' ? 'the interquartile range (Q3 − Q1)' : `the ${ask === 'Q1' ? 'first' : 'third'} quartile`} of: ${xs.join(', ')}`, expr: `${ans}` });
  }
  const S = [['asking 50 students picked at random from the whole school list', 'random and representative'], ['asking only the members of the hockey team which sport the school likes best', 'biased'], ['asking people leaving a pet store whether the town needs a dog park', 'biased'], ['drawing 40 names from a hat holding every student\'s name', 'random and representative'], ['asking the first 10 people who reply to an online post', 'biased']];
  const [d, right] = r.pick(S);
  return mc(r, right, ['random and representative', 'biased'].filter((x) => x !== right), { q: `A school wants to know what all its students think. Is this sample random and representative, or biased? ${d[0].toUpperCase() + d.slice(1)}.`, steps: [right === 'biased' ? 'This group is not like the whole school: some opinions are favoured.' : 'Everyone has the same chance to be chosen, so the sample is like the whole school.', `So the sample is ${right}.`] });
});

// ───────────── 33. Two-variable statistics ─────────────
skill('8-linegraph', 8, 'Two-variable statistics', 'Line graphs', ['A line graph shows how something changes over time.', 'Steeper segments mean faster change; going down means a decrease.'], (r) => {
  const ys = Array.from({ length: 6 }, () => r.int(1, 9)), pts = ys.map((y, i) => [i + 1, y, '']), t = r.int(0, 2), vis = { type: 'plane', points: pts, range: 10 };
  if (t === 0) { const i = r.int(0, 5); return num(ys[i], [`Find week ${i + 1} on the x-axis.`, `Go up to the point: y = ${ys[i]}.`, `So ${ys[i]} cm of snow.`], { q: `The graph shows snowfall (cm, up) in weeks 1 to 6 (across). How much snow fell in week ${i + 1}?`, visual: vis, unit: 'cm', expr: `${ys[i]}` }); }
  if (t === 1) { const [i, j] = r.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 2).sort((a, b) => a - b); return num(ys[j] - ys[i], [`Week ${i + 1}: ${ys[i]}. Week ${j + 1}: ${ys[j]}.`, `Change: ${ys[j]} − ${ys[i]} = ${neg(ys[j] - ys[i])}.`, `So the change is ${neg(ys[j] - ys[i])} cm.`], { q: `The graph shows snowfall (cm, up) in weeks 1 to 6 (across). What was the change from week ${i + 1} to week ${j + 1}? (Use a negative number for a decrease.)`, visual: vis, unit: 'cm', expr: `${ys[j]}-${ys[i]}` }); }
  const d = ys.slice(1).map((y, i) => y - ys[i]), best = Math.max(...d);
  if (best <= 0) return num(Math.max(...ys), ['Find the highest point.', `It is at y = ${Math.max(...ys)}.`], { q: 'The graph shows snowfall (cm) in weeks 1 to 6. What was the most snow in one week?', visual: vis, unit: 'cm', expr: `${Math.max(...ys)}` });
  const k = d.indexOf(best), right = `week ${k + 1} to week ${k + 2}`, wr = d.map((_, i) => `week ${i + 1} to week ${i + 2}`).filter((x, i) => d[i] !== best);
  return mc(r, right, r.shuffle(wr).slice(0, 3), { q: 'The graph shows snowfall (cm) in weeks 1 to 6. Between which two weeks was the biggest increase?', visual: vis, steps: [`Changes: ${d.map(neg).join(', ')}.`, `The biggest increase is ${best}, from ${right}.`] });
});
skill('8-scatter', 8, 'Two-variable statistics', 'Scatter plots and trends', ['If the points rise from left to right, the trend is positive; if they fall, it is negative.', 'A line of best fit lets us predict values we did not measure.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const kind = r.pick(['positive', 'negative', 'no clear']), pts = Array.from({ length: 8 }, (_, i) => { const x = i + 1; const y = kind === 'positive' ? Math.min(9, Math.round(x + r.int(-1, 1))) : kind === 'negative' ? Math.max(0, Math.round(9 - x + r.int(-1, 1))) : r.int(1, 9); return [x, y]; });
    if (kind === 'no clear') pts.forEach((p, i) => (p[1] = [3, 8, 2, 7, 5, 1, 9, 4][(i + r.int(0, 7)) % 8]));
    const right = `${kind} trend`;
    return mc(r, right, ['positive trend', 'negative trend', 'no clear trend'].filter((x) => x !== right), { q: 'What kind of trend does the scatter plot show?', visual: { type: 'plane', points: pts, range: 10 }, steps: [kind === 'positive' ? 'As x gets bigger, y tends to get bigger.' : kind === 'negative' ? 'As x gets bigger, y tends to get smaller.' : 'The points are spread out with no pattern up or down.', `So it shows a ${right}.`] });
  }
  if (t === 1) {
    const m = r.pick([2, 3, 4, 5]), b = r.int(10, 40), x = r.int(8, 20), y = m * x + b;
    return num(y, [`Put x = ${x} into the line of best fit y = ${m}x + ${b}.`, `${m} × ${x} + ${b} = ${y}.`, `So the prediction is ${y}.`], { q: `A line of best fit for test score (y) against hours studied (x) is y = ${m}x + ${b}. Predict the score for ${x} hours.`, expr: `${m}*${x}+${b}` });
  }
  const L = ['A', 'B', 'C', 'D', 'E'], out = r.int(1, 3), pts = L.map((l, i) => [i * 2 + 1, i === out ? (i < 2 ? 9 : 1) : i * 2 + 1, l]);
  return mc(r, `Point ${L[out]}`, L.filter((_, i) => i !== out).map((l) => `Point ${l}`).slice(0, 3), { q: 'Which point is an outlier (far from the pattern of the others)?', visual: { type: 'plane', points: pts, range: 10 }, steps: ['The other points rise together in a straight line.', `Point ${L[out]} is far from that line, so it is the outlier.`] });
});

// ───────────── 34. Probability ─────────────
skill('8-probsimple', 8, 'Probability', 'Probability of events', ['Probability = number of favourable outcomes ÷ number of possible outcomes.', 'P(not A) = 1 − P(A). For events that cannot happen together, P(A or B) = P(A) + P(B).'], (r) => {
  const t = r.int(0, 4);
  if (t <= 1) {
    const red = r.int(1, 9), blue = r.int(1, 9), green = r.int(1, 9), tot = red + blue + green, c = r.pick(['red', 'blue', 'green']), k = { red, blue, green }[c];
    if (t === 0) return num(frac(k, tot), [`There are ${red} + ${blue} + ${green} = ${tot} marbles.`, `${k} of them are ${c}: ${k}/${tot}.`, `In simplest form: ${frac(k, tot)}.`], { q: `A bag has ${red} red, ${blue} blue and ${green} green marbles. One is picked at random. What is P(${c})?`, exactForm: 'fraction', expr: `${k}/${tot}` });
    return num(frac(tot - k, tot), [`P(${c}) = ${k}/${tot}.`, `P(not ${c}) = 1 − ${k}/${tot} = ${tot - k}/${tot}.`, `In simplest form: ${frac(tot - k, tot)}.`], { q: `A bag has ${red} red, ${blue} blue and ${green} green marbles. One is picked at random. What is P(not ${c})?`, exactForm: 'fraction', expr: `1-${k}/${tot}` });
  }
  if (t === 2) {
    const cases = [['an even number or a 5', [2, 4, 6, 5]], ['an even number or a number greater than 3', [2, 4, 6, 5]], ['a 1 or a 6', [1, 6]], ['an odd number or a number less than 3', [1, 3, 5, 2]], ['a multiple of 3 or a 4', [3, 6, 4]]];
    const [d, outs] = r.pick(cases), k = outs.length;
    return num(frac(k, 6), [`List the outcomes that work: ${[...outs].sort().join(', ')} (count any overlap once).`, `That is ${k} out of 6.`, `P = ${k}/6 = ${frac(k, 6)}.`], { q: `A fair die is rolled. What is the probability of rolling ${d}?`, exactForm: 'fraction', expr: `${k}/6` });
  }
  if (t === 3) {
    const cols = ['Red', 'Blue', 'Yellow', 'Green'], f = cols.map(() => r.int(3, 20)), tot = sum(f), i = r.int(0, 3);
    return num(frac(f[i], tot), [`Total spins: ${f.join(' + ')} = ${tot}.`, `${cols[i]} came up ${f[i]} times: ${f[i]}/${tot}.`, `The experimental probability is ${frac(f[i], tot)}.`], { q: `A spinner was spun and the results recorded. What is the experimental probability of ${cols[i].toLowerCase()}?`, visual: { type: 'table', head: ['Colour', ...cols], rows: [['Times', ...f]] }, exactForm: 'fraction', expr: `${f[i]}/${tot}` });
  }
  const d = r.pick([2, 4, 5, 6, 10]), N = d * r.int(5, 60), n = r.int(1, d - 1);
  return num(N * n / d, [`P = ${n}/${d}.`, `Expected = ${n}/${d} × ${N} = ${N * n / d}.`, `About ${N * n / d} times.`], { q: `The probability of winning a game is ${frac(n, d)}. About how many times would you expect to win in ${N} games?`, expr: `${n}/${d}*${N}` });
});
skill('8-counting', 8, 'Probability', 'Sample spaces and counting', ['A sample space lists every possible outcome.', 'Counting principle: if one choice has a ways and another has b ways, together there are a × b ways.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const a = r.int(2, 6), b = r.int(2, 5), c = r.int(1, 4); return num(a * b * c, [`Choices: ${a} shirts, ${b} pants${c > 1 ? `, ${c} pairs of shoes` : ''}.`, `Multiply: ${a} × ${b}${c > 1 ? ` × ${c}` : ''} = ${a * b * c}.`, `So there are ${a * b * c} outfits.`], { q: `${r.pick(NAMES)} has ${a} shirts, ${b} pairs of pants${c > 1 ? ` and ${c} pairs of shoes` : ''}. How many different outfits can be made${c > 1 ? '' : ' (one shirt and one pair of pants)'}?`, expr: `${a}*${b}*${c}` }); }
  if (t === 1) {
    const s = r.int(3, 8), kind = r.pick(['all', 'heads and even']);
    if (kind === 'all') return num(2 * s, [`The coin has 2 outcomes; the spinner has ${s}.`, `2 × ${s} = ${2 * s}.`, `There are ${2 * s} outcomes in the sample space.`], { q: `A coin is flipped and a spinner numbered 1 to ${s} is spun. How many outcomes are in the sample space?`, expr: `2*${s}` });
    const ev = Math.floor(s / 2);
    return num(ev, [`Heads is 1 of the 2 coin outcomes.`, `Even numbers from 1 to ${s}: ${Array.from({ length: ev }, (_, i) => 2 * (i + 1)).join(', ')}.`, `So ${ev} outcomes are heads and an even number.`], { q: `A coin is flipped and a spinner numbered 1 to ${s} is spun. How many outcomes are heads with an even number?`, expr: `Math.floor(${s}/2)` });
  }
  const digits = r.int(3, 6);
  return num(10 ** digits, [`Each of the ${digits} places can be any digit 0 to 9: 10 choices.`, `10 × … × 10 (${digits} times) = 10^${digits}.`, `= ${comma(10 ** digits)} codes.`], { q: `A lock code is ${digits} digits long, and digits can repeat. How many codes are possible?`, expr: `10**${digits}` });
});
skill('8-indep', 8, 'Probability', 'Independent and dependent events', ['Independent events do not affect each other: P(A and B) = P(A) × P(B).', 'If you do not put the first item back, the second pick is dependent: the counts change.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const S = [['flipping a coin, then rolling a die', 'independent'], ['picking a card, putting it back, then picking again', 'independent'], ['picking a marble, keeping it, then picking another', 'dependent'], ['choosing a class president, then a vice-president from the students left', 'dependent'], ['spinning a spinner twice', 'independent'], ['taking two cookies from a jar, one after the other, and eating the first', 'dependent']];
    const [d, right] = r.pick(S);
    return mc(r, right, [right === 'independent' ? 'dependent' : 'independent'], { q: `Are these events independent or dependent? ${d[0].toUpperCase() + d.slice(1)}.`, steps: [right === 'independent' ? 'The first event does not change the chances for the second.' : 'The first event changes what is left, so the chances for the second change.', `So they are ${right}.`] });
  }
  if (t === 1) { const k = r.int(1, 5), ans = frac(k, 12); return num(ans, [`P(heads) = 1/2. P(a number ≤ ${k} on a die) = ${k}/6.`, `Independent, so multiply: 1/2 × ${k}/6 = ${k}/12.`, `In simplest form: ${ans}.`], { q: `A coin is flipped and a die is rolled. What is P(heads and a number less than or equal to ${k})?`, exactForm: 'fraction', expr: `1/2*${k}/6` }); }
  const red = r.int(2, 6), blue = r.int(2, 6), tot = red + blue, back = r.bool(), top = back ? red * red : red * (red - 1), bot = back ? tot * tot : tot * (tot - 1);
  return num(frac(top, bot), [`First pick: P(red) = ${red}/${tot}.`, back ? `It is put back, so the second pick is also ${red}/${tot}.` : `It is not put back: ${red - 1} red out of ${tot - 1} are left, so ${red - 1}/${tot - 1}.`, `Multiply: ${top}/${bot} = ${frac(top, bot)}.`], { q: `A bag has ${red} red and ${blue} blue counters. Two are picked one after the other, ${back ? 'putting the first back' : 'without putting the first back'}. What is P(both red)?`, exactForm: 'fraction', expr: `${red}/${tot}*${back ? red : red - 1}/${back ? tot : tot - 1}` });
});
export default list;
