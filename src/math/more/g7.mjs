// Grade 7 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const M = (s) => String(s).replace(/^-/, '−');                 // a real minus sign at the front
const D = (x, p = 6) => M(dec(x, p));                           // a tidy decimal, for showing
const F = (n, d) => M(frac(n, d));                              // a fraction in simplest form, for showing
const cash = (cents) => `$${(cents / 100).toFixed(2)}`;         // 1250 → "$12.50"
const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
// improper n/d → "2 1/3" (or a whole number, or a proper fraction)
const mixed = (n, d) => { const [a, b] = simplify(n, d); if (b === 1) return neg(a); const s = a < 0 ? '−' : '', A = Math.abs(a), w = Math.floor(A / b); return w ? `${s}${w} ${A % b}/${b}` : `${s}${A}/${b}`; };
// an expression from [coefficient, variable] pairs: [[3,'x'],[-1,'y'],[5,'']] → "3x − y + 5"
const ex = (pairs) => pairs.filter(([c]) => c !== 0).map(([c, v], i) => { const body = v ? (Math.abs(c) === 1 ? v : `${Math.abs(c)}${v}`) : `${Math.abs(c)}`; return i === 0 ? (c < 0 ? `−${body}` : body) : (c < 0 ? ` − ${body}` : ` + ${body}`); }).join('') || '0';
const pick2 = (r, arr) => { const [a, b] = r.shuffle(arr); return [a, b]; };
const an = (w) => (/^(8|11(?!\d)|18(?!\d)|[aeiou])/i.test(String(w)) ? 'an' : 'a');   // a/an before a word or number
const signWord = (v) => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'zero');
const PROPER = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10], [9, 10], [1, 12], [5, 12], [7, 12], [11, 12]];
const TERM = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [7, 20], [1, 25], [4, 25]];

// ───────────── 1. Integers ─────────────
skill('7-intabs', 7, 'Integers', 'Opposites and absolute value', ['The opposite of a number is the same distance from 0, on the other side.', 'Absolute value is the distance from 0, so it is never negative: |−7| = 7.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const n = r.nonzero(-40, 40);
    return num(-n, [St(`${neg(n)} is ${Math.abs(n)} units ${n < 0 ? 'left' : 'right'} of 0.`), St(`Its opposite is ${Math.abs(n)} units on the other side of 0.`), St(`So the opposite of ${neg(n)} is ${neg(-n)}.`)], { q: `What is the opposite of ${neg(n)}?`, expr: `-(${n})` });
  }
  if (t === 1) {
    const a = r.nonzero(-25, 25), b = r.nonzero(-25, 25), op = r.pick(['+', '−']);
    const v = op === '+' ? Math.abs(a) + Math.abs(b) : Math.abs(a) - Math.abs(b);
    return num(v, [`Absolute value is distance from 0: |${neg(a)}| = ${Math.abs(a)} and |${neg(b)}| = ${Math.abs(b)}.`, `${Math.abs(a)} ${op} ${Math.abs(b)} = ${neg(v)}.`, `So the answer is ${neg(v)}.`], { q: `|${neg(a)}| ${op} |${neg(b)}| = ?`, expr: `Math.abs(${a})${op === '+' ? '+' : '-'}Math.abs(${b})` });
  }
  if (t === 2) {
    const a = r.int(3, 30), b = r.int(2, 25), who = r.pick(NAMES);
    const [q, s1] = r.bool()
      ? [`In Yellowknife the temperature at dawn was −${a}°C. By the afternoon it was ${b}°C. By how many degrees did it rise?`, `From −${a} up to 0 is ${a} degrees, and from 0 up to ${b} is ${b} more.`]
      : [`${who} is diving at −${a} m (below sea level). A seagull flies at ${b} m above the water. How far apart are they, up and down?`, `The diver is ${a} m below 0 and the gull is ${b} m above 0.`];
    return num(a + b, [s1, `Add the two distances from 0: ${a} + ${b} = ${a + b}.`, `So the answer is ${a + b}.`], { q, expr: `Math.abs(-${a})+Math.abs(${b})` });
  }
  const a = r.nonzero(-20, 20), b = r.bool(0.25) ? -a : r.nonzero(-20, 20);
  const sign = Math.abs(a) > Math.abs(b) ? '>' : Math.abs(a) < Math.abs(b) ? '<' : '=';
  return mc(r, sign, ['>', '<', '='].filter((x) => x !== sign), { q: `Which sign makes this true?  |${neg(a)}|  ?  |${neg(b)}|`, steps: [`|${neg(a)}| = ${Math.abs(a)} and |${neg(b)}| = ${Math.abs(b)}.`, `${Math.abs(a)} ${sign} ${Math.abs(b)}, so the sign is ${sign}.`] });
});
skill('7-intorder', 7, 'Integers', 'Compare and order integers', ['On a number line, numbers get bigger to the right.', 'So −2 > −9, because −2 is to the right of −9.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.int(-15, 15); let b = r.int(-15, 15); if (r.bool(0.15)) b = a;
    const sign = a > b ? '>' : a < b ? '<' : '=';
    const lo = Math.min(a, b) - 1, hi = Math.max(a, b) + 1;
    return mc(r, sign, ['>', '<', '='].filter((x) => x !== sign), { q: `Which sign makes this true?  ${neg(a)}  ?  ${neg(b)}`, steps: [St('Put both numbers on a number line. The one further right is greater.', numberLine(lo, hi, { marks: [a, b] })), St(a === b ? 'They are the same number.' : `${neg(Math.max(a, b))} is further right, so it is greater.`), St(`${neg(a)} ${sign} ${neg(b)}.`)] });
  }
  if (t === 1) {
    const s = new Set(); while (s.size < 4) s.add(r.nonzero(-20, 20));
    const xs = [...s], up = [...xs].sort((a, b) => a - b), show = (arr) => arr.map(neg).join(', ');
    const byAbs = [...xs].sort((a, b) => Math.abs(a) - Math.abs(b) || a - b), swap = [up[1], up[0], up[2], up[3]];
    return mc(r, show(up), [show([...up].reverse()), show(byAbs), show(swap)], { q: `Put in order from least to greatest: ${show(r.shuffle(xs))}`, steps: [St('The most negative number is the least. Positive numbers are greater than all the negatives.'), St(`From least to greatest: ${show(up)}.`)] });
  }
  if (t === 2) {
    const a = r.int(-10, 10), k = r.int(2, 9), left = r.bool(), ans = left ? a - k : a + k;
    return num(ans, [St(`Moving ${left ? 'left' : 'right'} ${left ? 'subtracts' : 'adds'} ${k}: ${neg(a)} ${left ? '−' : '+'} ${k} = ${neg(ans)}.`, numberLine(Math.min(a, ans) - 1, Math.max(a, ans) + 1, { marks: [ans], jumps: [{ from: a, to: ans, label: `${left ? '−' : '+'}${k}` }] })), St(`So the integer is ${neg(ans)}.`)], { q: `Which integer is ${k} units to the ${left ? 'left' : 'right'} of ${neg(a)} on a number line?`, expr: `${a}${left ? '-' : '+'}${k}` });
  }
  const n = r.int(2, 300);
  const [desc, v] = r.pick([[`a loss of $${n}`, -n], [`${n} m below sea level`, -n], [`a gain of ${n} points`, n], [`${n} degrees below zero`, -n], [`a deposit of $${n}`, n], [`${n} m above sea level`, n], [`a drop of ${n} cm`, -n]]);
  return num(v, [St(v < 0 ? 'Words like loss, below and drop mean less than zero: a negative number.' : 'Words like gain, above and deposit mean more than zero: a positive number.'), St(`So ${desc} is ${neg(v)}.`)], { q: `Which integer stands for ${desc}?`, expr: String(v) });
});

// ───────────── 2. Operations with integers ─────────────
skill('7-intaddsub', 7, 'Integer operations', 'Add and subtract integers', ['Adding a negative moves left; subtracting a negative moves right.', 'A positive and a negative counter make a zero pair.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.nonzero(-20, 20), b = r.nonzero(-20, 20), c = r.nonzero(-20, 20), s = a + b + c;
    return num(s, [`Add from left to right. ${neg(a)} + ${par(b)} = ${neg(a + b)}.`, `${neg(a + b)} + ${par(c)} = ${neg(s)}.`, `So the sum is ${neg(s)}.`], { q: `${neg(a)} + ${par(b)} + ${par(c)} = ?`, expr: `(${a})+(${b})+(${c})` });
  }
  if (t === 1) {
    const a = r.nonzero(-15, 15), x = r.nonzero(-15, 15), add = r.bool(), c = add ? a + x : a - x;
    return num(x, add
      ? [`Think: what do we add to ${neg(a)} to get ${neg(c)}?`, `${neg(c)} − ${par(a)} = ${neg(x)}.`, `So the missing number is ${neg(x)}. Check: ${neg(a)} + ${par(x)} = ${neg(c)}.`]
      : [`Think: ${neg(a)} minus what gives ${neg(c)}?`, `${neg(a)} − ${par(c)} = ${neg(x)}.`, `So the missing number is ${neg(x)}. Check: ${neg(a)} − ${par(x)} = ${neg(c)}.`],
    { q: `Fill in the missing number: ${neg(a)} ${add ? '+' : '−'} ? = ${neg(c)}`, expr: add ? `(${c})-(${a})` : `(${a})-(${c})` });
  }
  if (t === 2) {
    if (r.bool()) {
      const a = r.int(-8, 10), b = r.int(4, 22), ans = a - b;
      return num(ans, [`A drop means subtract: ${neg(a)} − ${b}.`, `${neg(a)} − ${b} = ${neg(ans)}.`, `The temperature at midnight was ${neg(ans)}°C.`], { q: `At 18:00 the temperature was ${neg(a)}°C. By midnight it had dropped ${b} degrees. What was the temperature at midnight?`, unit: '°C', expr: `${a}-${b}` });
    }
    const who = r.pick(NAMES), a = r.int(10, 80), b = r.int(a + 5, a + 60), c = r.int(5, 40), ans = a - b + c;
    return num(ans, [`Start with ${a}, take away ${b}, then add ${c}.`, `${a} − ${b} = ${neg(a - b)}, and ${neg(a - b)} + ${c} = ${neg(ans)}.`, `The balance is ${neg(ans)} dollars.`], { q: `${who}'s account has $${a}. ${who} spends $${b}, then gets $${c} for a birthday. What is the balance now, in dollars? (A balance below zero is negative.)`, expr: `${a}-${b}+${c}` });
  }
  if (t === 3) {
    const p = r.int(0, 9), n = r.int(0, 9);
    if (p + n === 0) return num(0, ['There are no counters at all.', 'So the integer is 0.'], { q: 'A mat has no counters on it. What integer does it show?', expr: '0' });
    const pairs = Math.min(p, n), v = p - n;
    return num(v, [`Each + counter with a − counter is a zero pair. There ${pairs === 1 ? 'is' : 'are'} ${pairs} zero pair${pairs === 1 ? '' : 's'}.`, `Take them away: ${Math.abs(v)} ${v >= 0 ? 'positive' : 'negative'} counter${Math.abs(v) === 1 ? '' : 's'} ${Math.abs(v) === 1 ? 'is' : 'are'} left.`, `So the counters show ${neg(v)}.`], { q: `A mat has ${p} positive (+1) counters and ${n} negative (−1) counters. What integer do they show?`, expr: `${p}-${n}` });
  }
  const a = r.int(2, 30), b = r.int(2, 30), v = -a + b;
  return mc(r, signWord(v), ['positive', 'negative', 'zero'].filter((x) => x !== signWord(v)), { q: `Without working it out, is −${a} + ${b} positive, negative or zero?`, steps: [`The signs are different, so the answer takes the sign of the number further from 0.`, a === b ? `−${a} and ${b} are the same distance from 0, so they cancel: zero.` : `${a > b ? '−' + a : b} is further from 0, so the sum is ${signWord(v)}.`] });
});
skill('7-intmuldiv', 7, 'Integer operations', 'Multiply and divide integers', ['Same signs give a positive answer. Different signs give a negative answer.', 'This works for dividing too: −20 ÷ (−4) = 5.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.nonzero(-12, 12), b = r.nonzero(-12, 12), mul = r.bool(), p = a * b;
    if (mul) return num(p, [`Multiply the sizes: ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(p)}.`, `${Math.sign(a) === Math.sign(b) ? 'Same signs, so positive' : 'Different signs, so negative'}: ${neg(a)} × ${par(b)} = ${neg(p)}.`], { q: `${neg(a)} × ${par(b)} = ?`, expr: `(${a})*(${b})` });
    return num(a, [`Divide the sizes: ${Math.abs(p)} ÷ ${Math.abs(b)} = ${Math.abs(a)}.`, `${Math.sign(p) === Math.sign(b) ? 'Same signs, so positive' : 'Different signs, so negative'}: ${neg(p)} ÷ ${par(b)} = ${neg(a)}.`], { q: `${neg(p)} ÷ ${par(b)} = ?`, expr: `(${p})/(${b})` });
  }
  if (t === 1) {
    const a = r.nonzero(-12, 12), b = r.nonzero(-12, 12), p = a * b;
    if (r.bool()) return num(a, [`Undo the multiplying: ? = ${neg(p)} ÷ ${par(b)}.`, `${neg(p)} ÷ ${par(b)} = ${neg(a)}, so the missing number is ${neg(a)}.`], { q: `Fill in the missing number: ? × ${par(b)} = ${neg(p)}`, expr: `(${p})/(${b})` });
    return num(b, [`${neg(p)} ÷ ? = ${neg(a)} means ? = ${neg(p)} ÷ ${par(a)}.`, `${neg(p)} ÷ ${par(a)} = ${neg(b)}, so the missing number is ${neg(b)}.`], { q: `Fill in the missing number: ${neg(p)} ÷ ? = ${neg(a)}`, expr: `(${p})/(${a})` });
  }
  if (t === 2) {
    const k = r.int(2, 5), fs = Array.from({ length: k }, () => r.nonzero(-6, 6)), negs = fs.filter((x) => x < 0).length;
    const v = negs % 2 ? 'negative' : 'positive';
    return mc(r, v, ['positive', 'negative', 'zero'].filter((x) => x !== v), { q: `Is this product positive or negative? ${fs.map((x, i) => (i ? par(x) : neg(x))).join(' × ')}`, steps: [`Count the negative factors: there ${negs === 1 ? 'is' : 'are'} ${negs}.`, `${negs % 2 ? 'An odd' : 'An even'} number of negatives gives a ${v} product.`] });
  }
  if (t === 3) {
    const q = r.int(2, 9), b = r.int(2, 9), p = q * b;
    return mc(r, `${p} ÷ (−${b})`, [`−${p} ÷ (−${b})`, `${p} ÷ ${b}`, `${b} ÷ (−${p})`], { q: `Which has the same value as −${p} ÷ ${b}?`, steps: [`−${p} ÷ ${b} = −${q}: different signs give a negative.`, `${p} ÷ (−${b}) also has different signs, so it is −${q} too.`] });
  }
  const a = r.int(2, 6), n = r.int(2, 5), ans = -a * n;
  const jumps = Array.from({ length: n }, (_, i) => ({ from: -a * i, to: -a * (i + 1), label: `−${a}` }));
  return num(ans, [St(`${n} × (−${a}) means ${n} jumps of −${a}, starting at 0.`, numberLine(ans - 1, 1, { marks: [ans], jumps })), St(`Each jump goes ${a} to the left, so we land on ${neg(ans)}.`), St(`So ${n} × (−${a}) = ${neg(ans)}.`)], { q: `On a number line, start at 0 and make ${n} jumps of −${a}. This shows ${n} × (−${a}). Where do you land?`, expr: `${n}*(-${a})` });
});
skill('7-intexpr', 7, 'Integer operations', 'Integer expressions', ['Brackets first, then × and ÷, then + and −.', 'Keep track of the signs at every step.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.nonzero(-20, 20), b = r.nonzero(-9, 9), c = r.nonzero(-9, 9), v = a + b * c;
    return num(v, [`Multiply first: ${neg(b)} × ${par(c)} = ${neg(b * c)}.`, `Then add: ${neg(a)} + ${par(b * c)} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `${neg(a)} + ${neg(b)} × ${par(c)} = ?`, expr: `(${a})+(${b})*(${c})` });
  }
  if (t === 1) {
    const c = r.nonzero(-6, 6), q = r.nonzero(-8, 8), b = r.int(-12, 12), a = b + c * q;
    return num(q, [`Brackets first: ${neg(a)} − ${par(b)} = ${neg(a - b)}.`, `Then divide: ${neg(a - b)} ÷ ${par(c)} = ${neg(q)}.`, `So the value is ${neg(q)}.`], { q: `(${neg(a)} − ${par(b)}) ÷ ${par(c)} = ?`, expr: `((${a})-(${b}))/(${c})` });
  }
  if (t === 2) {
    const a = r.nonzero(-9, 9), b = r.nonzero(-9, 9), c = r.nonzero(-9, 9), d = r.nonzero(-9, 9), v = a * b - c * d;
    return num(v, [`Do both products first: ${neg(a)} × ${par(b)} = ${neg(a * b)} and ${neg(c)} × ${par(d)} = ${neg(c * d)}.`, `Then subtract: ${neg(a * b)} − ${par(c * d)} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `${neg(a)} × ${par(b)} − ${neg(c)} × ${par(d)} = ?`, expr: `(${a})*(${b})-(${c})*(${d})` });
  }
  const a = r.nonzero(-9, 9), b = r.nonzero(-9, 9), c = r.nonzero(-5, 5), d = r.int(-15, 15), v = (a + b) * c - d;
  return num(v, [`Brackets first: ${neg(a)} + ${par(b)} = ${neg(a + b)}.`, `Multiply: ${neg(a + b)} × ${par(c)} = ${neg((a + b) * c)}.`, `Subtract: ${neg((a + b) * c)} − ${par(d)} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `(${neg(a)} + ${par(b)}) × ${par(c)} − ${par(d)} = ?`, expr: `((${a})+(${b}))*(${c})-(${d})` });
});

// ───────────── 3. Decimals ─────────────
skill('7-decimals', 7, 'Decimals', 'Compare, order and round decimals', ['Line up the decimal points and compare place by place, from the left.', 'To round, look at the next digit: 5 or more rounds up.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const k = r.int(1001, 99999), x = k / 1000, [name, div, nextName, digit] = r.pick([
      ['tenth', 100, 'hundredths', Math.floor(k / 10) % 10], ['hundredth', 10, 'thousandths', k % 10], ['whole number', 1000, 'tenths', Math.floor(k / 100) % 10]]);
    const ans = dec(Math.round(k / div) * div / 1000);
    return num(ans, [`Look at the ${nextName} digit of ${(k / 1000).toFixed(3)}: it is ${digit}.`, digit >= 5 ? `${digit} is 5 or more, so round up.` : `${digit} is less than 5, so round down.`, `${dec(x)} rounded to the nearest ${name} is ${ans}.`], { q: `Round ${dec(x)} to the nearest ${name}.`, expr: `Math.round(${k}/${div})*${div}/1000` });
  }
  if (t === 1) {
    const w = r.int(0, 9), A = r.int(100, 999); const B = r.bool(0.15) ? A : Math.floor(A / 100) * 100 + r.int(0, 99);
    const a = dec(w + A / 1000), b = dec(w + B / 1000), sign = A > B ? '>' : A < B ? '<' : '=';
    return mc(r, sign, ['>', '<', '='].filter((x) => x !== sign), { q: `Which sign makes this true?  ${a}  ?  ${b}`, steps: [`Line them up with the same number of places: ${(w + A / 1000).toFixed(3)} and ${(w + B / 1000).toFixed(3)}.`, `Compare digit by digit from the left: ${a} ${sign} ${b}.`] });
  }
  if (t === 2) {
    const w = r.int(0, 9), [a, b] = pick2(r, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const vals = [w + a / 10 + b / 100, w + b / 10 + a / 100, w + a / 10 + b / 1000, w + a / 100 + b / 1000].map((x) => dec(x));
    const big = r.bool(), best = [...vals].sort((x, y) => (big ? y - x : x - y))[0];
    return mc(r, best, vals.filter((x) => x !== best), { q: `Which number is the ${big ? 'greatest' : 'least'}?`, steps: [`Write them all with 3 decimal places: ${vals.map((x) => Number(x).toFixed(3)).join(', ')}.`, `Compare from the left: the ${big ? 'greatest' : 'least'} is ${best}.`] });
  }
  const k = r.int(1, 99), lo = k / 10, hi = (k + 1) / 10, ans = dec((2 * k + 1) / 20);
  return num(ans, [St(`Split the gap from ${dec(lo)} to ${dec(hi)} into hundredths: ${lo.toFixed(2)} to ${hi.toFixed(2)}.`, numberLine(lo, hi, { step: 0.01, marks: [(2 * k + 1) / 20] })), St(`Halfway is 5 hundredths along: ${ans}.`)], { q: `Which decimal is exactly halfway between ${dec(lo)} and ${dec(hi)} on a number line?`, expr: `(${lo}+${hi})/2` });
});

// ───────────── 4. Operations with decimals ─────────────
skill('7-decops', 7, 'Decimal operations', 'Add, subtract, multiply and divide decimals', ['To add or subtract, line up the decimal points.', 'To multiply, multiply as whole numbers, then count the decimal places.', 'To divide by a decimal, move both points until the divisor is whole.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0 || t === 1) {
    let a = r.int(150, 9999) / 100, b = r.int(11, 999) / 10;
    if (t === 1 && b > a) [a, b] = [b, a];
    const cs = t === 0 ? columnAdd([a, b]) : columnSub(a, b), ans = dec(t === 0 ? a + b : a - b, 2);
    return num(ans, [cs[0], St('Work each column from the right, carrying or regrouping when needed.', cs[cs.length - 2].visual), St(`So ${dec(a)} ${t === 0 ? '+' : '−'} ${dec(b)} = ${ans}.`)], { q: `${dec(a)} ${t === 0 ? '+' : '−'} ${dec(b)} = ?`, expr: `${a}${t === 0 ? '+' : '-'}${b}` });
  }
  if (t === 2) {
    const whole = r.bool(), k1 = r.int(12, 999), dp1 = whole ? 2 : 1, k2 = whole ? r.int(3, 25) : r.int(2, 99), dp2 = whole ? 0 : 1;
    const a = k1 / 10 ** dp1, b = k2 / 10 ** dp2, ans = dec(k1 * k2 / 10 ** (dp1 + dp2));
    return num(ans, [`Multiply as whole numbers: ${k1} × ${k2} = ${k1 * k2}.`, `Count decimal places in ${(k1 / 10 ** dp1).toFixed(dp1)} and ${dp2 ? b.toFixed(dp2) : b}: ${dp1} + ${dp2} = ${dp1 + dp2}.`, `So the answer is ${(k1 * k2 / 10 ** (dp1 + dp2)).toFixed(dp1 + dp2)}, which is ${ans}.`], { q: `${dec(a)} × ${dec(b)} = ?`, expr: `${a}*${b}` });
  }
  if (t === 3) {
    const qk = r.int(11, 999), d = r.int(2, 9), q = qk / 100, dvd = (qk * d / 100).toFixed(2);
    return num(dec(q), [`Divide as if there were no point: ${qk * d} ÷ ${d} = ${qk}.`, `${dvd} has 2 decimal places, so the answer has 2 as well.`, `${dvd} ÷ ${d} = ${dec(q)}.`], { q: `${dec(Number(dvd))} ÷ ${d} = ?`, expr: `${dvd}/${d}` });
  }
  const dk = r.int(2, 9), dv = dk / 10, q = r.int(2, 40), dvd = dec(q * dk / 10);
  return num(q, [`Make the divisor whole: multiply both numbers by 10.`, `${dvd} ÷ ${dec(dv)} becomes ${dec(q * dk)} ÷ ${dk}.`, `${dec(q * dk)} ÷ ${dk} = ${q}.`], { q: `${dvd} ÷ ${dec(dv)} = ?`, expr: `${dvd}/${dv}` });
});
skill('7-decword', 7, 'Decimal operations', 'Decimal word problems', ['Decide which operation the story needs.', 'For money, give the answer to the cent: two decimal places.'], (r) => {
  const t = r.int(0, 4), who = r.pick(NAMES);
  if (t === 0) {
    const c = r.int(105, 1299), n = r.int(3, 12), item = r.pick(['notebooks', 'granola bars', 'bus tickets', 'muffins', 'pens']);
    return num(dec(c * n / 100), [`Multiply the price by how many: ${cash(c)} × ${n}.`, `${(c / 100).toFixed(2)} × ${n} = ${(c * n / 100).toFixed(2)}.`, `The total is ${cash(c * n)}.`], { q: `${who} buys ${n} ${item} at ${cash(c)} each. What is the total cost in dollars?`, unit: '$', expr: `${c}*${n}/100` });
  }
  if (t === 1) {
    const each = r.int(250, 2500), n = r.int(2, 6);
    return num(dec(each / 100), [`Share equally means divide: ${cash(each * n)} ÷ ${n}.`, `${(each * n / 100).toFixed(2)} ÷ ${n} = ${(each / 100).toFixed(2)}.`, `Each person pays ${cash(each)}.`], { q: `${n} friends share a bill of ${cash(each * n)} equally. How much does each pay, in dollars?`, unit: '$', expr: `${each * n}/100/${n}` });
  }
  if (t === 2) {
    const [s10, sTxt] = r.pick([[5, '0.5'], [15, '1.5'], [20, '2'], [25, '2.5'], [40, '4'], [50, '5']]), d10 = r.int(12, 99), real = dec(d10 * s10 / 100);
    return num(real, [`Each centimetre on the map is ${sTxt} km.`, `${dec(d10 / 10)} × ${sTxt} = ${real}.`, `The towns are ${real} km apart.`], { q: `On a map, 1 cm stands for ${sTxt} km. Two towns are ${dec(d10 / 10)} cm apart on the map. How far apart are they really, in kilometres?`, unit: 'km', expr: `${d10 / 10}*${s10 / 10}` });
  }
  if (t === 3) {
    const a = r.int(150, 1500), b = r.int(150, 1500), bill = a + b < 1800 ? 2000 : 5000;
    return num(dec((bill - a - b) / 100), [`Total spent: ${cash(a)} + ${cash(b)} = ${cash(a + b)}.`, `Change: ${cash(bill)} − ${cash(a + b)} = ${cash(bill - a - b)}.`, `The change is ${cash(bill - a - b)}.`], { q: `${who} buys a book for ${cash(a)} and a game for ${cash(b)}, and pays with a $${bill / 100} bill. How much change, in dollars?`, unit: '$', expr: `(${bill}-${a}-${b})/100` });
  }
  const B = r.int(15, 60), p = r.int(275, 1250), n = Math.floor(B * 100 / p);
  return num(n, [`Divide the money by the price: ${B} ÷ ${(p / 100).toFixed(2)} ≈ ${(Math.floor(B * 10000 / p) / 100).toFixed(2)}.`, `You can't buy part of a ticket, so round down.`, `${who} can buy at most ${n} tickets.`], { q: `${who} has $${B}. Each ticket costs ${cash(p)}. What is the greatest number of tickets ${who} can buy?`, expr: `Math.floor(${B * 100}/${p})` });
});
skill('7-decexpr', 7, 'Decimal operations', 'Estimate and evaluate with decimals', ['To estimate, round each decimal to a friendly number first.', 'In an expression, use the order of operations: brackets, × and ÷, then + and −.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.int(11, 98) + r.pick([0.1, 0.2, 0.3, 0.7, 0.8, 0.9, 0.15, 0.35, 0.62, 0.84]), b = r.int(2, 9) + r.pick([0.1, 0.2, 0.3, 0.7, 0.8, 0.9, 0.24, 0.46, 0.71]);
    const add = r.bool(), ra = Math.round(a), rb = Math.round(b), est = add ? ra + rb : ra - rb;
    return mc(r, est, [est + 1, est - 1, est + 2, est - 2], { q: `Estimate ${dec(a)} ${add ? '+' : '−'} ${dec(b)} by rounding each number to the nearest whole number.`, steps: [`${dec(a)} ≈ ${ra} and ${dec(b)} ≈ ${rb}.`, `${ra} ${add ? '+' : '−'} ${rb} = ${est}.`] });
  }
  if (t === 1) {
    const ra = r.int(2, 12), rb = r.int(2, 12), a = dec(ra + r.pick([-0.3, -0.2, -0.1, 0.1, 0.2, 0.3])), b = dec(rb + r.pick([-0.2, -0.1, 0.1, 0.2]));
    const est = ra * rb;
    return mc(r, est, [est + ra, est - rb, ra + rb, est * 10], { q: `Estimate the product ${a} × ${b}.`, steps: [`${a} ≈ ${ra} and ${b} ≈ ${rb}.`, `${ra} × ${rb} = ${est}, so the product is about ${est}.`] });
  }
  if (t === 2) {
    const a = r.int(5, 99), b = r.int(5, 99), c = r.int(2, 9), v = dec((a + b) * c / 10);
    return num(v, [`Brackets first: ${dec(a / 10)} + ${dec(b / 10)} = ${dec((a + b) / 10)}.`, `Then multiply: ${dec((a + b) / 10)} × ${c} = ${v}.`, `So the value is ${v}.`], { q: `(${dec(a / 10)} + ${dec(b / 10)}) × ${c} = ?`, expr: `(${a / 10}+${b / 10})*${c}` });
  }
  const m = r.pick([0.5, 1.5, 2.5, 0.4]), b = r.int(1, 30) / 10, x0 = r.int(2, 8), rhs = dec(m * x0 + b);
  return mc(r, x0 + 1, [x0, x0 - 1, x0 - 2], { q: `Which value of x makes ${m}x + ${dec(b)} > ${rhs} true?`, steps: [`Try x = ${x0}: ${m} × ${x0} + ${dec(b)} = ${rhs}, which is equal, not greater.`, `A bigger x makes the left side bigger, so x = ${x0 + 1} works: ${dec(m * (x0 + 1) + b)} > ${rhs}.`] });
});

// ───────────── 5. Number theory ─────────────
skill('7-numtheory', 7, 'Number theory', 'Primes, factors and multiples', ['A prime has exactly two factors: 1 and itself.', 'Every whole number above 1 is a product of primes in just one way.', 'GCF: the greatest number that divides both. LCM: the least number both divide into.'], (r) => {
  const t = r.int(0, 5);
  if (t === 0) {
    const n = r.int(21, 119), p = isPrime(n), f = [2, 3, 5, 7].find((k) => n % k === 0);
    return mc(r, p ? 'prime' : 'composite', [p ? 'composite' : 'prime'], { q: `Is ${n} prime or composite?`, steps: p ? [`${n} is not divisible by 2, 3, 5 or 7, and 11 × 11 is already more than ${n}.`, `Its only factors are 1 and ${n}, so it is prime.`] : [`${n} = ${f} × ${n / f}.`, `It has a factor other than 1 and itself, so it is composite.`] });
  }
  if (t === 1) {
    const fs = Array.from({ length: r.int(3, 4) }, () => r.pick([2, 2, 3, 3, 5, 7, 11])).sort((a, b) => a - b), n = fs.reduce((a, b) => a * b, 1);
    const show = (arr) => arr.join(' × '), nextP = { 2: 3, 3: 5, 5: 7, 7: 11, 11: 13 };
    const w1 = [...fs.slice(0, -1), nextP[fs.at(-1)]], w2 = [fs[0] * fs[1], ...fs.slice(2)], w3 = [2, ...fs];
    return mc(r, show(fs), [show(w1), show(w2), show(w3)], { q: `Which is the prime factorization of ${n}?`, steps: [`Divide by primes, smallest first: ${fs.map((p, i) => `${fs.slice(i).reduce((a, b) => a * b, 1)} ÷ ${p}`).join(', ')}.`, `So ${n} = ${show(fs)}. Every factor is prime.`] });
  }
  if (t === 2) {
    const kind = r.int(0, 2);
    if (kind === 0) { const n = r.int(2, 15); return num(frac(1, n), [`The multiplicative inverse is the number that multiplies by ${n} to give 1.`, `${n} × 1/${n} = 1, so the inverse is 1/${n}.`], { q: `What is the multiplicative inverse of ${n}?`, exactForm: 'fraction', expr: `1/${n}` }); }
    let [a, b] = r.pick(PROPER); if (kind === 2) { const w = r.int(1, 4); a = w * b + a; }
    return num(frac(b, a), [`Write it as a fraction: ${kind === 2 ? `${mixed(a, b)} = ` : ''}${a}/${b}. The inverse flips it.`, `${a}/${b} × ${b}/${a} = 1, so the inverse is ${frac(b, a)}.`], { q: `What is the multiplicative inverse of ${mixed(a, b)}?`, exactForm: 'fraction', expr: `1/(${a}/${b})` });
  }
  if (t === 3) {
    const k = r.pick([3, 4, 6, 9]), right = k * r.int(120, 1100);
    const rule = { 3: 'a number is divisible by 3 when its digit sum is divisible by 3', 4: 'a number is divisible by 4 when its last two digits make a multiple of 4', 6: 'a number is divisible by 6 when it is even and divisible by 3', 9: 'a number is divisible by 9 when its digit sum is divisible by 9' }[k];
    const ds = (n) => String(n).split('').reduce((a, b) => a + Number(b), 0);
    return mc(r, right, [right + 1, right + 2, right - 1], { q: `Which number is divisible by ${k}?`, steps: [`The rule: ${rule}.`, k === 4 ? `${right} ends in ${String(right).slice(-2)}, a multiple of 4, so ${right} works.` : `${right} has digit sum ${ds(right)}${k === 6 ? ' and is even' : ''}, so ${right} works.`] });
  }
  if (t === 4) {
    const g = r.int(2, 9), m = r.int(2, 7); let n = r.int(2, 9); while (gcd(m, n) !== 1 || m === n) n = r.int(2, 9);
    const who = r.pick(NAMES);
    return num(g, [`Each kit must use the same number of pens and of pencils, so the number of kits divides both ${g * m} and ${g * n}.`, `The greatest common factor of ${g * m} and ${g * n} is ${g}.`, `So ${who} can make ${g} kits.`], { q: `${who} has ${g * m} pens and ${g * n} pencils. ${who} makes identical kits with no supplies left over. What is the greatest number of kits?`, expr: `${g}` });
  }
  const a = r.int(4, 12); let b = r.int(4, 12); while (a === b || lcm(a, b) === Math.max(a, b)) b = r.int(4, 12);
  return num(lcm(a, b), [`List multiples of ${a}: ${multiplesOf(a, lcm(a, b) / a).join(', ')}.`, `The first one that is also a multiple of ${b} is ${lcm(a, b)}.`, `So the least number is ${lcm(a, b)}.`], { q: `Veggie dogs come in packs of ${a} and buns in packs of ${b}. What is the least number of veggie dogs to buy so there are exactly as many buns?`, expr: `${a * b}/${gcd(a, b)}` });
});

// ───────────── 6. Fractions ─────────────
skill('7-fracequiv', 7, 'Fractions', 'Equivalent fractions and mixed numbers', ['Multiply or divide the top and bottom by the same number to get an equivalent fraction.', 'A mixed number like 2 1/3 is 2 wholes and 1/3, which is 7/3.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const [a, b] = r.pick(PROPER), g = r.int(2, 9);
    return num(frac(a, b), [St(`The greatest common factor of ${a * g} and ${b * g} is ${g}.`), St(`Divide top and bottom by ${g}: ${a * g} ÷ ${g} = ${a}, ${b * g} ÷ ${g} = ${b}.`), St(`So ${a * g}/${b * g} in lowest terms is ${a}/${b}.`)], { q: `Write ${a * g}/${b * g} in lowest terms.`, exactForm: 'fraction', expr: `${a}/${b}` });
  }
  if (t === 1) {
    const [a, b] = r.pick(PROPER), k = r.int(2, 8);
    return num(a * k, [St(`${b} × ${k} = ${b * k}, so the bottom was multiplied by ${k}.`, fractionBars([{ n: a, d: b }, { n: a * k, d: b * k }])), St(`Do the same to the top: ${a} × ${k} = ${a * k}.`), St(`So ${a}/${b} = ${a * k}/${b * k}. The missing number is ${a * k}.`)], { q: `Fill in the missing number: ${a}/${b} = ?/${b * k}`, expr: `${a}*${b * k}/${b}` });
  }
  if (t === 2) {
    const b = r.int(2, 12); let d = r.int(2, 12); while (d === b) d = r.int(2, 12);
    const L = lcm(b, d);
    return num(L, [`The least common denominator is the least common multiple of ${b} and ${d}.`, `Multiples of ${Math.max(b, d)}: ${multiplesOf(Math.max(b, d), L / Math.max(b, d)).join(', ')}. The first that ${Math.min(b, d)} divides is ${L}.`, `So the LCD is ${L}.`], { q: `What is the least common denominator of 1/${b} and 1/${d}?`, expr: `${b * d}/${gcd(b, d)}` });
  }
  const [a, b] = r.pick(PROPER), w = r.int(1, 9), n = w * b + a;
  if (t === 3) return num(`${n}/${b}`, [`Each whole is ${b}/${b}, so ${w} wholes are ${w} × ${b} = ${w * b} ${b === 2 ? 'halves' : `pieces of 1/${b}`}.`, `Add the ${a}: ${w * b} + ${a} = ${n}.`, `So ${w} ${a}/${b} = ${n}/${b}.`], { q: `Write ${w} ${a}/${b} as an improper fraction.`, exactForm: 'fraction', expr: `${n}/${b}` });
  return num(`${w} ${a}/${b}`, [`How many times does ${b} go into ${n}? ${w} times, because ${w} × ${b} = ${w * b}.`, `${n} − ${w * b} = ${a} left over, so ${a}/${b} remains.`, `So ${n}/${b} = ${w} ${a}/${b}.`], { q: `Write ${n}/${b} as a mixed number.`, expr: `${n}/${b}` });
});
skill('7-fraccompare', 7, 'Fractions', 'Compare and order fractions', ['To compare, give the fractions a common denominator, or compare each to 1/2.', 'To order fractions and decimals together, change them all to decimals.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const [a, b] = r.pick(PROPER); let [c, d] = r.pick(PROPER); if (r.bool(0.15)) { const k = r.int(2, 3); [c, d] = [a * k, b * k]; }
    const L = lcm(b, d), A = a * L / b, C = c * L / d, sign = A > C ? '>' : A < C ? '<' : '=';
    return mc(r, sign, ['>', '<', '='].filter((x) => x !== sign), { q: `Which sign makes this true?  ${a}/${b}  ?  ${c}/${d}`, steps: [St(`Use the common denominator ${L}: ${a}/${b} = ${A}/${L} and ${c}/${d} = ${C}/${L}.`, fractionBars([{ n: a, d: b }, { n: c, d }])), St(`Compare the tops: ${A} ${sign} ${C}, so ${a}/${b} ${sign} ${c}/${d}.`)] });
  }
  if (t === 1) {
    let n, d; do { d = r.int(5, 15); n = r.int(1, d - 1); } while ([0, 0.5, 1].map((b) => Math.abs(n / d - b)).sort((x, y) => x - y)[0] === [0, 0.5, 1].map((b) => Math.abs(n / d - b)).sort((x, y) => x - y)[1]);
    const opts = [['0', 0], ['1/2', 0.5], ['1', 1]], best = opts.reduce((p, o) => (Math.abs(n / d - o[1]) < Math.abs(n / d - p[1]) ? o : p));
    return mc(r, best[0], opts.map((o) => o[0]).filter((x) => x !== best[0]), { q: `Is ${n}/${d} closest to 0, 1/2 or 1?`, steps: [`Half of ${d} is ${dec(d / 2)}, so 1/2 = ${dec(d / 2)}/${d}. 0 = 0/${d} and 1 = ${d}/${d}.`, `${n} is closest to ${best[1] === 0 ? 0 : best[1] === 1 ? d : dec(d / 2)}, so ${n}/${d} is closest to ${best[0]}.`] });
  }
  if (t === 2) {
    const pool = r.shuffle(TERM.slice(0, 15)).slice(0, 4), w = r.int(0, 2);
    const vals = pool.map(([a, b], i) => { const v = w + a / b; const show = i % 2 ? dec(v) : w ? `${w} ${a}/${b}` : `${a}/${b}`; return [show, v]; });
    if (new Set(vals.map((x) => x[1])).size < 4) vals.pop();
    const big = r.bool(), best = [...vals].sort((x, y) => (big ? y[1] - x[1] : x[1] - y[1]))[0];
    return mc(r, best[0], vals.map((x) => x[0]).filter((x) => x !== best[0]), { q: `Which number is the ${big ? 'greatest' : 'least'}?`, steps: [`Change each one to a decimal: ${vals.map(([s, v]) => `${s} = ${dec(v)}`).join(', ')}.`, `The ${big ? 'greatest' : 'least'} is ${best[0]}.`] });
  }
  if (t === 3) {
    let [a, b] = r.pick(PROPER); while (2 * a === b) [a, b] = r.pick(PROPER);
    const w = r.int(1, 12), up = 2 * a > b, ans = up ? w + 1 : w;
    return num(ans, [`Compare ${a}/${b} with 1/2: it is ${up ? 'more' : 'less'} than a half.`, `So ${w} ${a}/${b} rounds ${up ? 'up' : 'down'} to ${ans}.`], { q: `Round ${w} ${a}/${b} to the nearest whole number.`, expr: `Math.round(${w}+${a}/${b})` });
  }
  const [p, q] = pick2(r, NAMES); const [a, b] = r.pick(PROPER); let [c, d] = r.pick(PROPER); while (a * d === b * c) [c, d] = r.pick(PROPER);
  const win = a * d > b * c ? p : q;
  return mc(r, win, [win === p ? q : p], { q: `${p} ran ${a}/${b} km and ${q} ran ${c}/${d} km. Who ran farther?`, steps: [`Cross-multiply to compare: ${a} × ${d} = ${a * d} and ${c} × ${b} = ${b * c}.`, `${Math.max(a * d, b * c)} is bigger, so ${win} ran farther.`] });
});

// ───────────── 7. Add and subtract fractions ─────────────
// a/b ± c/d worked with the least common denominator
const addSteps = (a, b, c, d, op) => {
  const L = lcm(b, d), A = a * L / b, C = c * L / d, top = op === '+' ? A + C : A - C;
  return [St(`The least common denominator of ${b} and ${d} is ${L}.`, fractionBars([{ n: a, d: b }, { n: c, d }])), St(`Rewrite: ${a}/${b} = ${A}/${L} and ${c}/${d} = ${C}/${L}.`), St(`${op === '+' ? 'Add' : 'Subtract'} the tops: ${A} ${op === '+' ? '+' : '−'} ${C} = ${top}, giving ${top}/${L}.`), St(`In simplest form that is ${F(top, L)}.`)];
};
skill('7-fracaddsub', 7, 'Adding and subtracting fractions', 'Add and subtract fractions', ['Fractions need the same denominator before you add or subtract.', 'Find the least common denominator, rewrite, then add or subtract the tops.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    let [a, b] = r.pick(PROPER), [c, d] = r.pick(PROPER); while (d === b) [c, d] = r.pick(PROPER);
    const add = r.bool(); if (!add && a / b < c / d) [a, b, c, d] = [c, d, a, b];
    if (!add && a * d === b * c) return num(0, ['The two fractions are equal.', 'So the difference is 0.'], { q: `${a}/${b} − ${c}/${d} = ?`, expr: '0' });
    return num(frac(add ? a * d + b * c : a * d - b * c, b * d), addSteps(a, b, c, d, add ? '+' : '−'), { q: `${a}/${b} ${add ? '+' : '−'} ${c}/${d} = ?`, expr: `${a}/${b}${add ? '+' : '-'}${c}/${d}` });
  }
  if (t === 1) {
    const ds = r.shuffle([2, 3, 4, 6, 8, 12]).slice(0, 3), ns = ds.map((d) => r.int(1, d - 1)), L = ds.reduce((x, y) => lcm(x, y)), tops = ns.map((n, i) => n * L / ds[i]), s = tops.reduce((x, y) => x + y);
    return num(frac(s, L), [`The least common denominator of ${ds.join(', ')} is ${L}.`, `Rewrite: ${ns.map((n, i) => `${n}/${ds[i]} = ${tops[i]}/${L}`).join(', ')}.`, `Add the tops: ${tops.join(' + ')} = ${s}, so ${s}/${L}.`, `In simplest form: ${F(s, L)}.`], { q: `${ns.map((n, i) => `${n}/${ds[i]}`).join(' + ')} = ?`, expr: ns.map((n, i) => `${n}/${ds[i]}`).join('+') });
  }
  if (t === 2) {
    let [a, b] = r.pick(PROPER), [c, d] = r.pick(PROPER); while (a * d >= b * c) { [a, b] = r.pick(PROPER); [c, d] = r.pick(PROPER); }
    const L = lcm(b, d);
    return num(frac(c * b - a * d, b * d), [`Think: ? = ${c}/${d} − ${a}/${b}.`, `With denominator ${L}: ${c * L / d}/${L} − ${a * L / b}/${L} = ${c * L / d - a * L / b}/${L}.`, `In simplest form the missing fraction is ${F(c * b - a * d, b * d)}.`], { q: `Fill in the missing fraction: ${a}/${b} + ? = ${c}/${d}`, expr: `${c}/${d}-${a}/${b}` });
  }
  if (t === 3) {
    const near0 = [[1, 8], [1, 10], [1, 9], [1, 12]], nearH = [[5, 9], [4, 9], [5, 11], [6, 11], [7, 12], [5, 12]], near1 = [[7, 8], [9, 10], [11, 12], [8, 9]];
    const g = () => r.pick([[near0, 0], [nearH, 0.5], [near1, 1]]), [p1, v1] = g(), [p2, v2] = g(), [a, b] = r.pick(p1), [c, d] = r.pick(p2);
    const sh = (v) => ({ 0: '0', 0.5: '1/2', 1: '1', 1.5: '1 1/2', 2: '2' }[v]);
    return mc(r, sh(v1 + v2), ['0', '1/2', '1', '1 1/2', '2'].filter((x) => x !== sh(v1 + v2)).slice(0, 3), { q: `Estimate ${a}/${b} + ${c}/${d}. Round each fraction to 0, 1/2 or 1 first.`, steps: [`${a}/${b} is about ${sh(v1)} and ${c}/${d} is about ${sh(v2)}.`, `${sh(v1)} + ${sh(v2)} = ${sh(v1 + v2)}.`] });
  }
  const d = r.pick([5, 6, 8, 9, 10, 12]), a = r.int(1, d - 2), b = r.int(1, d - 1 - a), who = r.pick(NAMES), more = r.bool() && a !== b;
  if (more) { const [x, y] = a > b ? [a, b] : [b, a]; return num(frac(x - y, d), [`How much more means subtract: ${x}/${d} − ${y}/${d}.`, `Same denominator, so subtract the tops: ${x - y}/${d}.`, `In simplest form: ${F(x - y, d)} km.`], { q: `${who} walked ${x}/${d} km on Monday and ${y}/${d} km on Tuesday. How much farther did ${who} walk on Monday, in km?`, expr: `${x - y}/${d}` }); }
  return num(frac(a + b, d), [`In all means add: ${a}/${d} + ${b}/${d}.`, `Same denominator, so add the tops: ${a + b}/${d}.`, `In simplest form: ${F(a + b, d)} of the pizza.`], { q: `${who} ate ${a}/${d} of a pizza and a friend ate ${b}/${d} of it. What fraction of the pizza did they eat in all?`, expr: `${a + b}/${d}` });
});
skill('7-mixedaddsub', 7, 'Adding and subtracting fractions', 'Add and subtract mixed numbers', ['Change mixed numbers to improper fractions, or work with the wholes and the fractions separately.', 'Use a common denominator for the fraction parts.'], (r) => {
  const t = r.int(0, 3);
  const mk = () => { const [a, b] = r.pick(PROPER.filter(([, d]) => d <= 8)); const w = r.int(1, 6); return { w, a, b, n: w * b + a }; };
  let X = mk(), Y = mk(); if (X.n / X.b < Y.n / Y.b) [X, Y] = [Y, X];
  const L = lcm(X.b, Y.b), xa = X.n * L / X.b, ya = Y.n * L / Y.b;
  if (t === 0 || t === 1) {
    const add = t === 0 ? r.bool() : false, top = add ? xa + ya : xa - ya;
    const ctx = t === 1 ? r.pick([['board', 'm', 'cuts off'], ['ribbon', 'm', 'uses'], ['bag of rice', 'kg', 'cooks']]) : null, who = r.pick(NAMES);
    const q = t === 0 ? `${X.w} ${X.a}/${X.b} ${add ? '+' : '−'} ${Y.w} ${Y.a}/${Y.b} = ?` : `${who} has a ${ctx[0]} that is ${X.w} ${X.a}/${X.b} ${ctx[1]}. ${who} ${ctx[2]} ${Y.w} ${Y.a}/${Y.b} ${ctx[1]}. How much is left, in ${ctx[1]}?`;
    if (top === 0) return num(0, ['The two amounts are equal.', 'So the difference is 0.'], { q, expr: '0' });
    return num(frac(top, L), [`Write as improper fractions: ${X.w} ${X.a}/${X.b} = ${X.n}/${X.b} and ${Y.w} ${Y.a}/${Y.b} = ${Y.n}/${Y.b}.`, `With denominator ${L}: ${xa}/${L} ${add ? '+' : '−'} ${ya}/${L} = ${top}/${L}.`, `${top}/${L} = ${mixed(top, L)}, which is ${F(top, L)}.`], { q, expr: `${X.n}/${X.b}${add ? '+' : '-'}${Y.n}/${Y.b}` });
  }
  if (t === 2) {
    let p = X, s = Y; while (2 * p.a === p.b || 2 * s.a === s.b) { p = mk(); s = mk(); }
    const rp = Math.round(p.n / p.b), rs = Math.round(s.n / s.b), add = r.bool(), est = add ? rp + rs : rp - rs;
    return num(est, [`Round each to the nearest whole: ${p.w} ${p.a}/${p.b} ≈ ${rp} and ${s.w} ${s.a}/${s.b} ≈ ${rs}.`, `${rp} ${add ? '+' : '−'} ${rs} = ${neg(est)}.`, `The estimate is ${neg(est)}.`], { q: `Estimate ${p.w} ${p.a}/${p.b} ${add ? '+' : '−'} ${s.w} ${s.a}/${s.b} by rounding each mixed number to the nearest whole number.`, expr: `Math.round(${p.n}/${p.b})${add ? '+' : '-'}Math.round(${s.n}/${s.b})` });
  }
  const top = xa + ya, T = Math.round(top / L) + r.pick([-1, 0, 1]), cmp = top > T * L ? 'greater than' : top < T * L ? 'less than' : 'equal to';
  return mc(r, `${cmp} ${T}`, ['greater than', 'less than', 'equal to'].filter((x) => x !== cmp).map((x) => `${x} ${T}`), { q: `Is ${X.w} ${X.a}/${X.b} + ${Y.w} ${Y.a}/${Y.b} greater than, less than or equal to ${T}?`, steps: [`Add: ${xa}/${L} + ${ya}/${L} = ${top}/${L} = ${mixed(top, L)}.`, `${mixed(top, L)} is ${cmp} ${T}.`] });
});

// ───────────── 8. Multiply fractions ─────────────
skill('7-fracmul', 7, 'Multiplying fractions', 'Multiply fractions', ['Multiply the tops, multiply the bottoms, then simplify.', 'A whole number n is n/1.', '"Of" means multiply: 1/2 of 3/4 is 1/2 × 3/4.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const [a, b] = r.pick(PROPER), n = r.int(2, 12);
    return num(frac(n * a, b), [`${n} × ${a}/${b} = ${n}/1 × ${a}/${b}.`, `Multiply the tops: ${n} × ${a} = ${n * a}. So ${n * a}/${b}.`, `In simplest form: ${F(n * a, b)}${b / gcd(n * a, b) !== 1 && n * a > b ? ` = ${mixed(n * a, b)}` : ''}.`], { q: `${n} × ${a}/${b} = ?`, expr: `${n}*${a}/${b}` });
  }
  if (t === 1) {
    const [a, b] = r.pick(PROPER), [c, d] = r.pick(PROPER);
    return num(frac(a * c, b * d), [`Tops: ${a} × ${c} = ${a * c}. Bottoms: ${b} × ${d} = ${b * d}.`, `So ${a * c}/${b * d}.`, `In simplest form: ${F(a * c, b * d)}.`], { q: `${a}/${b} × ${c}/${d} = ?`, expr: `${a}/${b}*${c}/${d}` });
  }
  if (t === 2) {
    const [a, b] = r.pick(PROPER), [c, d] = r.pick(PROPER), n = r.int(2, 9);
    return num(frac(a * c * n, b * d), [`Multiply all the tops: ${a} × ${c} × ${n} = ${a * c * n}.`, `Multiply all the bottoms: ${b} × ${d} = ${b * d}.`, `${a * c * n}/${b * d} in simplest form is ${F(a * c * n, b * d)}.`], { q: `${a}/${b} × ${c}/${d} × ${n} = ?`, expr: `${a}/${b}*${c}/${d}*${n}` });
  }
  if (t === 3) {
    const [a, b] = r.pick(PROPER), [c, d] = r.pick(PROPER);
    return num(frac(c, d), [`Undo the multiplying: ? = ${F(a * c, b * d)} ÷ ${a}/${b}.`, `${F(a * c, b * d)} × ${b}/${a} = ${F(c, d)}.`, `So the missing fraction is ${F(c, d)}.`], { q: `Fill in the missing fraction: ${a}/${b} × ? = ${F(a * c, b * d)}`, expr: `${c}/${d}` });
  }
  const [a, b] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), [c, d] = r.pick([[1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [3, 8]]), who = r.pick(NAMES);
  return num(frac(a * c, b * d), [`"${a}/${b} of ${c}/${d}" means ${a}/${b} × ${c}/${d}.`, `${a} × ${c} = ${a * c} and ${b} × ${d} = ${b * d}, so ${a * c}/${b * d}.`, `In simplest form: ${F(a * c, b * d)} of the garden.`], { q: `${c}/${d} of a garden is vegetables. ${who} planted carrots in ${a}/${b} of the vegetable part. What fraction of the whole garden is carrots?`, expr: `${a}/${b}*${c}/${d}` });
});
skill('7-mixedmul', 7, 'Multiplying fractions', 'Multiply mixed numbers', ['First change each mixed number to an improper fraction.', 'Then multiply tops and bottoms, and simplify.'], (r) => {
  const t = r.int(0, 2);
  const mk = () => { const [a, b] = r.pick(PROPER.filter(([, d]) => d <= 6)); const w = r.int(1, 4); return { s: `${w} ${a}/${b}`, n: w * b + a, d: b }; };
  const X = mk();
  if (t === 0) {
    const n = r.int(2, 9);
    return num(frac(X.n * n, X.d), [`${X.s} = ${X.n}/${X.d}.`, `${X.n}/${X.d} × ${n} = ${X.n * n}/${X.d}.`, `That is ${mixed(X.n * n, X.d)}, or ${F(X.n * n, X.d)}.`], { q: `${X.s} × ${n} = ?`, expr: `${X.n}/${X.d}*${n}` });
  }
  const Y = mk();
  if (t === 1) return num(frac(X.n * Y.n, X.d * Y.d), [`${X.s} = ${X.n}/${X.d} and ${Y.s} = ${Y.n}/${Y.d}.`, `Multiply: ${X.n * Y.n}/${X.d * Y.d}.`, `That is ${mixed(X.n * Y.n, X.d * Y.d)}, or ${F(X.n * Y.n, X.d * Y.d)}.`], { q: `${X.s} × ${Y.s} = ?`, expr: `${X.n}/${X.d}*${Y.n}/${Y.d}` });
  if (r.bool()) return num(frac(X.n * Y.n, X.d * Y.d), [`Area = length × width = ${X.s} × ${Y.s}.`, `${X.n}/${X.d} × ${Y.n}/${Y.d} = ${X.n * Y.n}/${X.d * Y.d}.`, `That is ${mixed(X.n * Y.n, X.d * Y.d)} m², or ${F(X.n * Y.n, X.d * Y.d)} m².`], { q: `A rectangular flower bed is ${X.s} m long and ${Y.s} m wide. What is its area in square metres?`, expr: `${X.n}/${X.d}*${Y.n}/${Y.d}` });
  const n = r.int(2, 5);
  return num(frac(X.n * n, X.d), [`${n} batches need ${n} × ${X.s} cups.`, `${X.n}/${X.d} × ${n} = ${X.n * n}/${X.d}.`, `That is ${mixed(X.n * n, X.d)} cups, or ${F(X.n * n, X.d)}.`], { q: `A bannock recipe uses ${X.s} cups of flour. How many cups are needed for ${n} batches?`, expr: `${X.n}/${X.d}*${n}` });
});

// ───────────── 9. Divide fractions ─────────────
skill('7-fracdiv', 7, 'Dividing fractions', 'Divide fractions', ['To divide by a fraction, multiply by its reciprocal (flip it).', '4 ÷ 1/3 asks how many thirds are in 4: 4 × 3 = 12.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const n = r.int(2, 9), d = r.int(2, 8);
    return num(n * d, [St(`How many 1/${d}s are in ${n}? Each whole has ${d} of them.`, fractionBars(Array.from({ length: Math.min(n, 3) }, () => ({ n: d, d })))), St(`${n} wholes have ${n} × ${d} = ${n * d}.`), St(`So ${n} ÷ 1/${d} = ${n * d}.`)], { q: `${n} ÷ 1/${d} = ?`, expr: `${n}/(1/${d})` });
  }
  if (t === 1) {
    const [a, b] = r.pick(PROPER);
    return num(frac(b, a), [`The reciprocal flips the fraction: ${a}/${b} becomes ${b}/${a}.`, `Check: ${a}/${b} × ${b}/${a} = 1. So the reciprocal is ${frac(b, a)}.`], { q: `What is the reciprocal of ${a}/${b}?`, exactForm: 'fraction', expr: `${b}/${a}` });
  }
  if (t === 2) {
    const [a, b] = r.pick(PROPER), n = r.int(2, 12);
    return num(frac(n * b, a), [`Keep ${n}, change ÷ to ×, flip ${a}/${b} to ${b}/${a}.`, `${n} × ${b}/${a} = ${n * b}/${a}.`, `In simplest form: ${F(n * b, a)}.`], { q: `${n} ÷ ${a}/${b} = ?`, expr: `${n}/(${a}/${b})` });
  }
  const [a, b] = r.pick(PROPER), [c, d] = r.pick(PROPER);
  return num(frac(a * d, b * c), [`Keep ${a}/${b}, change ÷ to ×, flip ${c}/${d} to ${d}/${c}.`, `${a}/${b} × ${d}/${c} = ${a * d}/${b * c}.`, `In simplest form: ${F(a * d, b * c)}.`], { q: `${a}/${b} ÷ ${c}/${d} = ?`, expr: `(${a}/${b})/(${c}/${d})` });
});
skill('7-mixeddiv', 7, 'Dividing fractions', 'Divide mixed numbers', ['Change mixed numbers to improper fractions first.', 'Then multiply by the reciprocal of the divisor.'], (r) => {
  const t = r.int(0, 2);
  const mk = () => { const [a, b] = r.pick(PROPER.filter(([, d]) => d <= 6)); const w = r.int(1, 5); return { s: `${w} ${a}/${b}`, n: w * b + a, d: b }; };
  if (t === 0) {
    const X = mk(), Y = r.bool() ? mk() : (() => { const [a, b] = r.pick(PROPER); return { s: `${a}/${b}`, n: a, d: b }; })();
    return num(frac(X.n * Y.d, X.d * Y.n), [`Improper fractions: ${X.s} = ${X.n}/${X.d}${Y.s.includes(' ') ? ` and ${Y.s} = ${Y.n}/${Y.d}` : ''}.`, `Multiply by the reciprocal: ${X.n}/${X.d} × ${Y.d}/${Y.n} = ${X.n * Y.d}/${X.d * Y.n}.`, `In simplest form: ${F(X.n * Y.d, X.d * Y.n)}${X.n * Y.d > X.d * Y.n && (X.n * Y.d) % (X.d * Y.n) ? ` = ${mixed(X.n * Y.d, X.d * Y.n)}` : ''}.`], { q: `${X.s} ÷ ${Y.s} = ?`, expr: `(${X.n}/${X.d})/(${Y.n}/${Y.d})` });
  }
  if (t === 1) {
    const [a, b] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]), k = r.int(2, 12), L = k * a, whole = L % b === 0;
    if (whole) return num(k,[`How many ${a}/${b} m pieces fit in ${L / b} m? Divide: ${L / b} ÷ ${a}/${b}.`, `${L / b} × ${b}/${a} = ${L}/${a} = ${k}.`, `So ${k} pieces.`], { q: `A rope is ${L / b} m long. How many pieces ${a}/${b} m long can be cut from it?`, expr: `(${L}/${b})/(${a}/${b})` });
    return num(k, [`Write ${mixed(L, b)} as ${L}/${b}. Divide by ${a}/${b}.`, `${L}/${b} × ${b}/${a} = ${L}/${a} = ${k}.`, `So ${k} pieces.`], { q: `A rope is ${mixed(L, b)} m long. How many pieces ${a}/${b} m long can be cut from it?`, expr: `(${L}/${b})/(${a}/${b})` });
  }
  const B = r.int(2, 6), q = r.int(2, 6), A = q * B;
  const fuzz = (v) => (r.bool() ? `${v - 1} ${r.pick(['7/8', '9/10', '5/6'])}` : `${v} ${r.pick(['1/8', '1/10', '1/6'])}`);
  return mc(r, q, [q + 1, q - 1, A * B], { q: `Estimate ${fuzz(A)} ÷ ${fuzz(B)}.`, steps: [`Round each mixed number to the nearest whole: about ${A} and about ${B}.`, `${A} ÷ ${B} = ${q}, so the quotient is about ${q}.`] });
});

// ───────────── 10. Rational numbers ─────────────
skill('7-ratconv', 7, 'Rational numbers', 'Fractions and decimals', ['To write a decimal as a fraction, use its place value: 0.35 = 35/100 = 7/20.', 'To write a fraction as a decimal, divide the top by the bottom.'], (r) => {
  const t = r.int(0, 3);
  const [a, b] = r.pick(TERM), w = r.bool(0.35) ? r.int(1, 5) : 0, v = w + a / b, places = String(dec(a / b)).split('.')[1].length;
  if (t === 0) return num(frac(w * b + a, b), [`${dec(v)} has ${places} decimal place${places > 1 ? 's' : ''}, so write it over ${10 ** places}: ${Math.round(v * 10 ** places)}/${10 ** places}.`, `Simplify by dividing top and bottom by ${gcd(Math.round(v * 10 ** places), 10 ** places)}.`, `So ${dec(v)} = ${frac(w * b + a, b)}${w ? ` = ${mixed(w * b + a, b)}` : ''}.`], { q: `Write ${dec(v)} as a fraction in simplest form.`, exactForm: 'fraction', expr: `${v}` });
  if (t === 1 || t === 3) {
    const k = 10 ** places / b;
    return num(dec(v), [`Make the bottom a power of 10: ${a}/${b} = ${a * k}/${b * k}.`, `${a * k}/${b * k} = ${dec(a / b)}.`, `So ${w ? `${w} ${a}/${b}` : `${a}/${b}`} = ${dec(v)}.`], { q: `Write ${w ? `${w} ${a}/${b}` : `${a}/${b}`} as a decimal.`, expr: `${w}+${a}/${b}` });
  }
  const [n, d] = r.pick([[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [4, 9], [7, 9], [1, 11], [2, 11], [5, 11]]);
  const show = `${(n / d).toFixed(4)}…`;
  return mc(r, show, [`0.${n}${d}`, (n / d).toFixed(2), `${(n / d + 0.1).toFixed(4)}…`], { q: `Which is ${n}/${d} written as a decimal? (… means the digits keep repeating)`, steps: [`Divide ${n} by ${d}: the remainders start to repeat, so the digits repeat too.`, `${n} ÷ ${d} = ${show}`] });
});
skill('7-ratcompare', 7, 'Rational numbers', 'Compare and classify rational numbers', ['A rational number can be written as a fraction of two integers: −3, 0.25 and −2/3 are all rational.', 'On a number line, the number further right is greater, even for negatives.'], (r) => {
  const t = r.int(0, 4);
  const sv = () => { const [a, b] = r.pick(TERM.slice(0, 15)); const w = r.int(0, 3), s = r.bool() ? -1 : 1; const v = s * (w + a / b); const show = r.bool() ? D(v) : (s < 0 ? '−' : '') + (w ? `${w} ${a}/${b}` : `${a}/${b}`); return [show, v]; };
  if (t === 0) {
    const irr = r.pick(['√2', '√3', '√5', 'π', '√7', '√10']), rats = r.shuffle(['−3/4', '0.25', '√9', '−6', '2 1/3', '0.333…', '√16', '1.5']).slice(0, 3);
    return mc(r, irr, rats, { q: 'Which number is NOT rational?', steps: [`${rats.join(', ')} can all be written as a fraction of two integers (√9 = 3 and √16 = 4).`, `${irr} is a decimal that never ends or repeats, so it is irrational.`] });
  }
  if (t === 1) {
    const [s1, v1] = sv(); let [s2, v2] = sv(); while (s2 === s1) [s2, v2] = sv();
    const sign = v1 > v2 + 1e-9 ? '>' : v1 < v2 - 1e-9 ? '<' : '=';
    return mc(r, sign, ['>', '<', '='].filter((x) => x !== sign), { q: `Which sign makes this true?  ${s1}  ?  ${s2}`, steps: [`As decimals: ${s1} = ${D(v1)} and ${s2} = ${D(v2)}.`, `${D(v1)} ${sign} ${D(v2)}, so ${s1} ${sign} ${s2}.`] });
  }
  if (t === 2) {
    const xs = []; while (xs.length < 4) { const p = sv(); if (!xs.some((x) => Math.abs(x[1] - p[1]) < 1e-9)) xs.push(p); }
    const up = [...xs].sort((a, b) => a[1] - b[1]), show = (arr) => arr.map((x) => x[0]).join(', ');
    return mc(r, show(up), [show([...up].reverse()), show([...xs].sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))), show([up[1], up[0], up[2], up[3]])], { q: `Put in order from least to greatest: ${show(r.shuffle(xs))}`, steps: [`As decimals: ${xs.map((x) => D(x[1])).join(', ')}.`, `From least to greatest: ${show(up)}.`] });
  }
  if (t === 3) {
    const [s, v] = sv(), av = Math.abs(v), shown = s.replace(/^−/, '');
    return num(dec(av), [`Absolute value is the distance from 0, so drop the sign.`, `|${s}| = ${shown}${shown !== dec(av) ? ` = ${dec(av)}` : ''}.`], { q: `What is |${s}|?`, expr: `Math.abs(${v})` });
  }
  const [x, kind] = r.pick([['−7', 'an integer, but not a whole number'], ['−12', 'an integer, but not a whole number'], ['0', 'a whole number'], ['5', 'a whole number'], ['√16', 'a whole number'], ['2/3', 'rational, but not an integer'], ['−1.25', 'rational, but not an integer'], ['0.4', 'rational, but not an integer'], ['√2', 'irrational'], ['π', 'irrational']]);
  return mc(r, kind, ['a whole number', 'an integer, but not a whole number', 'rational, but not an integer', 'irrational'].filter((k) => k !== kind), { q: `Which best describes ${x}?`, steps: ['Whole numbers: 0, 1, 2, … Integers add the negatives. Rationals are any fractions of integers. Irrationals never end or repeat.', `${x} is ${kind}.`] });
});

// ───────────── 11. Operations with rational numbers ─────────────
skill('7-ratops', 7, 'Rational number operations', 'Operations with signed fractions and decimals', ['The integer sign rules work for fractions and decimals too.', 'Same signs multiply to a positive; different signs to a negative.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.nonzero(-2000, 2000), b = r.nonzero(-2000, 2000), add = r.bool(), s = add ? a + b : a - b;
    const bs = b < 0 ? `(${D(b / 100)})` : D(b / 100), plus = add ? b : -b, ps = plus < 0 ? `(${D(plus / 100)})` : D(plus / 100);
    return num(dec(s / 100), [add ? `Adding ${b < 0 ? 'a negative moves left' : 'a positive moves right'} on the number line.` : `Subtracting ${bs} is the same as adding ${ps}.`, `${D(a / 100)} + ${ps} = ${D(s / 100)}.`, `So the answer is ${D(s / 100)}.`], { q: `${D(a / 100)} ${add ? '+' : '−'} ${bs} = ?`, expr: `${a / 100}${add ? '+' : '-'}(${b / 100})` });
  }
  if (t === 1) {
    const a = r.nonzero(-90, 90), b = r.nonzero(-12, 12), A = a / 10, mul = r.bool();
    if (mul) return num(dec(A * b), [`Multiply the sizes: ${dec(Math.abs(A))} × ${Math.abs(b)} = ${dec(Math.abs(A * b))}.`, `${Math.sign(a) === Math.sign(b) ? 'Same signs: positive' : 'Different signs: negative'}. ${D(A)} × ${par(b)} = ${D(A * b)}.`], { q: `${D(A)} × ${par(b)} = ?`, expr: `${A}*(${b})` });
    const p = dec(A * b);
    return num(dec(A), [`Divide the sizes: ${dec(Math.abs(A * b))} ÷ ${Math.abs(b)} = ${dec(Math.abs(A))}.`, `${Math.sign(A * b) === Math.sign(b) ? 'Same signs: positive' : 'Different signs: negative'}. ${M(p)} ÷ ${par(b)} = ${D(A)}.`], { q: `${M(p)} ÷ ${par(b)} = ?`, expr: `(${p})/(${b})` });
  }
  if (t === 2) {
    const [a0, b] = r.pick(PROPER), [c0, d] = r.pick(PROPER), a = r.bool() ? -a0 : a0, c = r.bool() ? -c0 : c0, L = lcm(b, d), A = a * L / b, C = c * L / d;
    return num(frac(A + C, L), [`Common denominator ${L}: ${F(a, b)} = ${M(A)}/${L} and ${F(c, d)} = ${M(C)}/${L}.`, `Add the tops: ${neg(A)} + ${par(C)} = ${neg(A + C)}, so ${neg(A + C)}/${L}.`, `In simplest form: ${F(A + C, L)}.`], { q: `${F(a, b)} + ${c < 0 ? `(${F(c, d)})` : F(c, d)} = ?`, expr: `${a}/${b}+(${c})/${d}` });
  }
  const [dv, dn, dd] = r.pick([['0.5', 1, 2], ['0.25', 1, 4], ['0.75', 3, 4], ['0.2', 1, 5], ['0.4', 2, 5], ['1.5', 3, 2], ['−0.5', -1, 2], ['−1.25', -5, 4]]), [a, b] = r.pick(PROPER), mul = r.bool();
  return num(mul ? frac(dn * a, dd * b) : frac(dn * b, dd * a), [`Write the decimal as a fraction: ${dv} = ${F(dn, dd)}.`, mul ? `${F(dn, dd)} × ${a}/${b} = ${F(dn * a, dd * b)}.` : `${F(dn, dd)} × ${b}/${a} = ${F(dn * b, dd * a)}.`, `So the answer is ${mul ? F(dn * a, dd * b) : F(dn * b, dd * a)}.`], { q: `${dv} ${mul ? '×' : '÷'} ${a}/${b} = ?`, expr: mul ? `(${dn}/${dd})*(${a}/${b})` : `(${dn}/${dd})/(${a}/${b})` });
});
skill('7-ratword', 7, 'Rational number operations', 'Rational number problems', ['Use the order of operations with fractions and decimals, just as with whole numbers.', 'In a story, decide whether to add, subtract, multiply or divide.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const SM = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6]], [a, b] = r.pick(SM), [c, d] = r.pick(SM), [e, f] = r.pick(SM), pn = c * e, pd = d * f;
    return num(frac(a * pd + pn * b, b * pd), [`Multiply first: ${c}/${d} × ${e}/${f} = ${F(pn, pd)}.`, `Then add: ${a}/${b} + ${F(pn, pd)} = ${F(a * pd + pn * b, b * pd)}.`, `So the value is ${F(a * pd + pn * b, b * pd)}.`], { q: `${a}/${b} + ${c}/${d} × ${e}/${f} = ?`, expr: `${a}/${b}+${c}/${d}*${e}/${f}` });
  }
  if (t === 1) {
    const [a, b] = r.pick([[1, 2], [3, 4], [2, 3], [1, 3], [1, 4]]), w = r.int(1, 4), [p, q] = r.pick([[1, 2], [1, 3], [1, 4]]), n = w * q + p;
    return num(frac(a * n, b * q), [`Total = ${a}/${b} cup × ${w} ${p}/${q} batches.`, `${a}/${b} × ${n}/${q} = ${a * n}/${b * q}.`, `That is ${mixed(a * n, b * q)} cups, or ${F(a * n, b * q)}.`], { q: `One batch of muffins uses ${a}/${b} cup of milk. How many cups of milk are needed for ${w} ${p}/${q} batches?`, expr: `${a}/${b}*${n}/${q}` });
  }
  if (t === 2) {
    const T = r.int(-50, 50) / 10, x = r.int(5, 25) / 10, h = r.int(2, 6), ans = dec(T - x * h);
    return num(ans, [`The total drop is ${dec(x)} × ${h} = ${dec(x * h)} degrees.`, `${D(T)} − ${dec(x * h)} = ${M(ans)}.`, `The temperature is ${M(ans)}°C.`], { q: `At 20:00 the temperature was ${D(T)}°C. It fell ${dec(x)} degrees every hour for ${h} hours. What was the temperature then?`, unit: '°C', expr: `${T}-${x}*${h}` });
  }
  if (t === 3) {
    const A = r.int(2, 9), B = r.int(2, 9), est = A * B;
    const fz = (v) => (r.bool() ? `${v - 1} ${r.pick(['7/8', '9/10', '4/5'])}` : `${v} ${r.pick(['1/8', '1/10', '1/5'])}`);
    return mc(r, est, [est + A, est - B, A + B], { q: `Estimate ${fz(A)} × ${fz(B)}.`, steps: [`Round each to the nearest whole: about ${A} and about ${B}.`, `${A} × ${B} = ${est}, so the product is about ${est}.`] });
  }
  const [q, right, why] = r.pick([
    ['a < 0 and b > 0. What is the sign of a × b?', 'negative', 'Different signs multiply to a negative.'],
    ['a < 0 and b < 0. What is the sign of a × b?', 'positive', 'Same signs multiply to a positive.'],
    ['a < 0 and b > 0. What is the sign of a − b?', 'negative', 'Taking a positive away from a negative goes further left of 0.'],
    ['a > 0 and b < 0. What is the sign of a − b?', 'positive', 'Subtracting a negative adds, so a − b is more than a, which is positive.'],
    ['a < 0 and b < 0. What is the sign of a ÷ b?', 'positive', 'Same signs divide to a positive.'],
    ['a > 0 and b < 0. What is the sign of a + b?', 'it depends on the numbers', 'The sum takes the sign of whichever is further from 0, and we do not know which.'],
  ]);
  return mc(r, right, ['positive', 'negative', 'zero', 'it depends on the numbers'].filter((x) => x !== right).slice(0, 3), { q, steps: [why, `So the answer is: ${right}.`] });
});

// ───────────── 12. Exponents and square roots ─────────────
skill('7-powers', 7, 'Exponents', 'Powers', ['An exponent says how many times the base is multiplied by itself.', '(−2)^3 = (−2) × (−2) × (−2) = −8, but −2^4 means −(2^4) = −16.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const b = r.pick(['5', '7', 'x', 'a', '3', '(−2)']), n = r.int(3, 6);
    return mc(r, `${b}^${n}`, [`${n}^${b.replace(/[()]/g, '')}`, `${b} × ${n}`, `${b}^${n - 1}`], { q: `Which is ${Array(n).fill(b).join(' × ')} written as a power?`, steps: [`${b} is multiplied by itself, ${n} times.`, `So it is ${b}^${n}.`] });
  }
  if (t === 1) {
    const b = r.int(2, 5), e = r.int(2, 4), brk = r.bool(), v = brk ? (-b) ** e : -(b ** e);
    return num(v, brk ? [`(−${b})^${e} = ${Array(e).fill(`(−${b})`).join(' × ')}.`, `${e} negative factors: ${e % 2 ? 'odd, so negative' : 'even, so positive'}. The answer is ${neg(v)}.`] : [`Without brackets, the power is done first: −${b}^${e} = −(${b}^${e}).`, `${b}^${e} = ${b ** e}, so −${b}^${e} = ${neg(v)}.`], { q: `${brk ? `(−${b})` : `−${b}`}^${e} = ?`, expr: brk ? `(-${b})**${e}` : `-(${b}**${e})` });
  }
  if (t === 2) {
    if (r.bool()) {
      const [a, b] = r.pick([[1, 2], [2, 3], [3, 4], [1, 3], [2, 5], [3, 5]]), e = r.int(2, 3);
      return num(frac(a ** e, b ** e), [`Raise the top and the bottom to the power ${e}.`, `${a}^${e} = ${a ** e} and ${b}^${e} = ${b ** e}, so (${a}/${b})^${e} = ${a ** e}/${b ** e}.`], { q: `(${a}/${b})^${e} = ?`, expr: `(${a}/${b})**${e}` });
    }
    const k = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15]), x = k / 10;
    return num(dec(x * x), [`${dec(x)}^2 = ${dec(x)} × ${dec(x)}.`, `${k} × ${k} = ${k * k}, with 2 decimal places: ${dec(x * x)}.`], { q: `${dec(x)}^2 = ?`, expr: `${x}**2` });
  }
  if (t === 3) {
    const b = r.int(2, 5), x = r.int(2, b === 2 ? 7 : 4), v = b ** x;
    return num(x, [`Multiply ${b} by itself until you reach ${v}: ${Array.from({ length: x }, (_, i) => b ** (i + 1)).join(', ')}.`, `That took ${x} factors of ${b}, so x = ${x}.`], { q: `Solve: ${b}^x = ${v}`, unit: 'x =', expr: `Math.log(${v})/Math.log(${b})` });
  }
  const a = r.int(2, 6), b = r.int(2, 5), c = r.int(2, 3), d = r.int(1, 20), v = a ** 2 + b * c ** 3 - d;
  return num(v, [`Powers first: ${a}^2 = ${a * a} and ${c}^3 = ${c ** 3}.`, `Multiply: ${b} × ${c ** 3} = ${b * c ** 3}.`, `Add and subtract: ${a * a} + ${b * c ** 3} − ${d} = ${v}.`], { q: `${a}^2 + ${b} × ${c}^3 − ${d} = ?`, expr: `${a}**2+${b}*${c}**3-${d}` });
});
skill('7-sqroots', 7, 'Exponents', 'Square roots', ['The square root of n is the number that times itself makes n: √49 = 7.', 'For a number that is not a perfect square, find the perfect squares on each side.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const kind = r.int(0, 2);
    if (kind === 0) { const n = r.int(2, 20); return num(n, [`${n} × ${n} = ${n * n}.`, `So √${n * n} = ${n}.`], { q: `√${n * n} = ?`, expr: `Math.sqrt(${n * n})` }); }
    if (kind === 1) { const a = r.int(1, 9), b = r.int(a + 1, 12); return num(frac(a, b), [`Take the root of the top and the bottom: √${a * a} = ${a} and √${b * b} = ${b}.`, `So √(${a * a}/${b * b}) = ${F(a, b)}.`], { q: `√(${a * a}/${b * b}) = ?`, expr: `Math.sqrt(${a * a}/${b * b})` }); }
    const k = r.int(2, 15), x = k / 10;
    return num(dec(x), [`${dec(x)} × ${dec(x)} = ${dec(x * x)}.`, `So √${dec(x * x)} = ${dec(x)}.`], { q: `√${dec(x * x)} = ?`, expr: `Math.sqrt(${x * x})` });
  }
  let n = r.int(5, 200); while (Number.isInteger(Math.sqrt(n))) n++;
  const k = Math.floor(Math.sqrt(n));
  if (t === 1) return mc(r, `${k} and ${k + 1}`, [`${k - 1} and ${k}`, `${k + 1} and ${k + 2}`, `${Math.floor(n / 2)} and ${Math.floor(n / 2) + 1}`], { q: `√${n} is between which two whole numbers?`, steps: [`${k}^2 = ${k * k} and ${k + 1}^2 = ${(k + 1) ** 2}.`, `${n} is between them, so √${n} is between ${k} and ${k + 1}.`] });
  if (t === 2) {
    const ans = Math.round(Math.sqrt(n));
    return num(ans, [`${k}^2 = ${k * k} and ${k + 1}^2 = ${(k + 1) ** 2}, so √${n} is between ${k} and ${k + 1}.`, `${k}.5^2 = ${dec((k + 0.5) ** 2)}. ${n} is ${n < (k + 0.5) ** 2 ? 'below' : 'above'} that, so √${n} is closer to ${ans}.`, `To the nearest whole number, √${n} ≈ ${ans}.`], { q: `What is √${n} to the nearest whole number?`, expr: `Math.round(Math.sqrt(${n}))` });
  }
  const s = r.int(3, 25), who = r.pick(NAMES);
  return num(s, [`For a square, area = side × side.`, `${s} × ${s} = ${s * s}, so each side is √${s * s} = ${s} m.`], { q: `${who}'s square garden has an area of ${s * s} m². How long is each side, in metres?`, unit: 'm', expr: `Math.sqrt(${s * s})` });
});

// ───────────── 13. Ratios, rates and proportions ─────────────
skill('7-ratios', 7, 'Ratios', 'Equivalent ratios', ['A ratio compares two amounts, like 3:5.', 'Multiply or divide both parts by the same number to get an equivalent ratio.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.int(2, 12); let b = r.int(2, 12); while (b === a) b = r.int(2, 12);
    const opts = [['red marbles to blue marbles', `${a}:${b}`], ['blue marbles to red marbles', `${b}:${a}`], ['red marbles to all the marbles', `${a}:${a + b}`], ['blue marbles to all the marbles', `${b}:${a + b}`]], [what, right] = r.pick(opts);
    return mc(r, right, opts.map((o) => o[1]).filter((x) => x !== right), { q: `A bag has ${a} red marbles and ${b} blue marbles. What is the ratio of ${what}?`, steps: [`There are ${a} red, ${b} blue and ${a + b} marbles in all.`, `Write the amounts in the order asked: ${right}.`] });
  }
  const a = r.int(1, 9); let b = r.int(2, 12); while (b === a) b = r.int(2, 12);
  const k = r.int(2, 8);
  if (t === 1) return num(a * k, [`${b} × ${k} = ${b * k}, so the second part was multiplied by ${k}.`, `Multiply the first part by ${k} too: ${a} × ${k} = ${a * k}.`, `So ${a}:${b} = ${a * k}:${b * k}.`], { q: `Fill in the missing number: ${a}:${b} = ?:${b * k}`, expr: `${a}*${b * k}/${b}` });
  if (t === 2) return mc(r, `${a * k}:${b * k}`, [`${a + k}:${b + k}`, `${b * k}:${a * k}`, `${a * k}:${b * k + 1}`], { q: `Which ratio is equivalent to ${a}:${b}?`, steps: ['Equivalent ratios multiply both parts by the same number. Adding does not work.', `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}, so ${a * k}:${b * k} is equivalent.`] });
  return num(b * k, [`The ratio of rice to water is ${a}:${b}.`, `${a * k} cups of rice is ${a} × ${k}, so use ${b} × ${k} cups of water.`, `That is ${b * k} cups of water.`], { q: `A recipe uses rice and water in the ratio ${a}:${b}. How many cups of water go with ${a * k} cups of rice?`, expr: `${a * k}*${b}/${a}` });
});
skill('7-rates', 7, 'Ratios', 'Unit rates and comparing rates', ['A unit rate is the amount for one: per item, per hour, per kilogram.', 'To compare deals, find the unit price of each.'], (r) => {
  const t = r.int(0, 4), who = r.pick(NAMES);
  if (t === 0) {
    const u = r.int(50, 500), n = r.int(2, 12);
    return num(dec(u / 100), [`Divide the total by the number of items: ${cash(u * n)} ÷ ${n}.`, `${(u * n / 100).toFixed(2)} ÷ ${n} = ${(u / 100).toFixed(2)}.`, `The unit price is ${cash(u)} each.`], { q: `${n} cartons of milk cost ${cash(u * n)}. What is the price per carton, in dollars?`, unit: '$', expr: `${u * n}/100/${n}` });
  }
  if (t === 1) {
    const [n1, n2] = pick2(r, [2, 3, 4, 5, 6, 8, 10, 12]), [u1, u2] = pick2(r, [55, 60, 75, 80, 90, 95, 110, 125, 140]);
    const best = u1 < u2 ? 'Pack A' : 'Pack B';
    return mc(r, best, [best === 'Pack A' ? 'Pack B' : 'Pack A'], { q: `Pack A has ${n1} granola bars for ${cash(u1 * n1)}. Pack B has ${n2} granola bars for ${cash(u2 * n2)}. Which is the better buy?`, steps: [`Pack A: ${cash(u1 * n1)} ÷ ${n1} = ${cash(u1)} per bar. Pack B: ${cash(u2 * n2)} ÷ ${n2} = ${cash(u2)} per bar.`, `The lower price per bar is the better buy: ${best}.`] });
  }
  if (t === 2) {
    const s = r.pick([48, 60, 72, 84, 96]), m = r.pick([15, 20, 30, 45]), d = s * m / 60;
    return num(s, [`1 hour is 60 minutes, which is ${60 / m === Math.round(60 / m) ? `${60 / m} times ${m} minutes` : `${m} minutes × 4/3`}.`, `${d} km in ${m} minutes is ${d} ÷ ${m} = ${dec(d / m, 3)} km per minute. × 60 = ${s}.`, `So ${s} km in 1 hour.`], { q: `A train goes ${d} km in ${m} minutes. At this rate, how far does it go in 1 hour, in km?`, unit: 'km', expr: `${d}/${m}*60` });
  }
  if (t === 3) {
    let g1, n1, g2, n2; do { n1 = r.int(20, 32); n2 = r.int(20, 32); g1 = r.int(5, n1 - 5); g2 = r.int(5, n2 - 5); } while (g1 * n2 === g2 * n1);
    const best = g1 / n1 > g2 / n2 ? 'Class A' : 'Class B';
    return mc(r, best, [best === 'Class A' ? 'Class B' : 'Class A'], { q: `In Class A, ${g1} of ${n1} students bike to school. In Class B, ${g2} of ${n2} students bike. Which class has the greater fraction of bikers?`, steps: [`Class A: ${g1}/${n1} ≈ ${dec(g1 / n1, 3)}. Class B: ${g2}/${n2} ≈ ${dec(g2 / n2, 3)}.`, `${best} has the greater fraction.`] });
  }
  const w = r.int(25, 70), m = r.int(4, 15);
  return num(w * m, [`${who} types ${w} words in each minute.`, `${w} × ${m} = ${w * m}.`, `So ${who} types ${w * m} words.`], { q: `${who} types ${w} words per minute. How many words can ${who} type in ${m} minutes?`, expr: `${w}*${m}` });
});
skill('7-propword', 7, 'Ratios', 'Proportion word problems', ['Two ratios form a proportion when their cross products are equal.', 'Set up a proportion with the same units in the same places, then solve.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.int(1, 9), b = r.int(a + 1, 12), k = r.int(2, 6), yes = r.bool(), c = a * k, d = yes ? b * k : b * k + r.pick([-1, 1]);
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: `Do ${a}/${b} and ${c}/${d} form a proportion?`, steps: [`Cross products: ${a} × ${d} = ${a * d} and ${b} × ${c} = ${b * c}.`, yes ? 'They are equal, so yes, it is a proportion.' : 'They are not equal, so no, it is not a proportion.'] });
  }
  if (t === 1) {
    const u = 5 * r.int(10, 80), n = r.int(2, 6); let m = r.int(2, 12); while (m === n) m = r.int(2, 12);
    return num(dec(m * u / 100), [`Set up n/cost: ${n}/${cash(u * n)} = ${m}/?`, `One notebook costs ${cash(u * n)} ÷ ${n} = ${cash(u)}.`, `${m} × ${cash(u)} = ${cash(m * u)}.`], { q: `${n} notebooks cost ${cash(u * n)}. At the same price, how much do ${m} notebooks cost, in dollars?`, unit: '$', expr: `${u * n}/${n}*${m}/100` });
  }
  if (t === 2) {
    const T = r.int(20, 80), tg = r.int(2, 10), m = r.int(3, 10), S = tg * m;
    return num(T * m, [`In the sample, ${tg} of ${S} fish were tagged. Assume the same fraction of the lake is tagged: ${tg}/${S} = ${T}/P.`, `${S} is ${m} times ${tg}, so P is ${m} times ${T}.`, `The lake has about ${T * m} fish.`], { q: `Biologists tag ${T} fish in a lake and let them go. Later they catch ${S} fish, and ${tg} of them are tagged. About how many fish are in the lake?`, expr: `${T}*${S}/${tg}` });
  }
  const [s, sTxt] = r.pick([[2, '2'], [3, '3'], [4, '4'], [5, '5'], [1.5, '1.5'], [2.5, '2.5']]), L = r.int(4, 30) / 2;
  return num(dec(L * s), [`Each centimetre on the drawing is ${sTxt} m in real life.`, `${dec(L)} × ${sTxt} = ${dec(L * s)}.`, `The real room is ${dec(L * s)} m long.`], { q: `A floor plan uses the scale 1 cm : ${sTxt} m. A room is ${dec(L)} cm long on the plan. How long is the real room, in metres?`, unit: 'm', expr: `${L}*${s}` });
});
skill('7-rateofchange', 7, 'Ratios', 'Rate of change', ['The rate of change tells how much y changes for each 1 that x goes up.', 'Rate of change = change in y ÷ change in x.'], (r) => {
  const t = r.int(0, 3);
  const ctxs = [['Hours', 'Distance (km)', r.int(40, 90), r.int(0, 50)], ['Weeks', 'Savings ($)', r.int(5, 30), r.int(10, 100)], ['Minutes', 'Water in tank (L)', -r.int(5, 20), r.int(200, 400)]];
  if (t === 0) {
    const [hx, hy, m, b] = r.pick(ctxs), x0 = r.int(0, 2), xs = [0, 1, 2, 3].map((i) => x0 + i);
    return num(m, [`Each time ${hx.toLowerCase()} go up by 1, ${hy.toLowerCase()} changes by ${neg(m)}: ${m * x0 + b} → ${m * (x0 + 1) + b}.`, `It changes the same amount every row, so the rate of change is ${neg(m)}.`], { q: `What is the rate of change of the ${hy.replace(/ \(.*\)/, '').toLowerCase()} per ${hx.toLowerCase().replace(/s$/, '')}?`, visual: { type: 'table', head: [hx, hy], rows: xs.map((x) => [x, m * x + b]) }, expr: `(${m * (x0 + 1) + b})-(${m * x0 + b})` });
  }
  if (t === 1) {
    const [hx, hy, m, b] = r.pick(ctxs), yes = r.bool(), ys = [0, 1, 2, 3].map((x) => m * x + b); if (!yes) ys[r.int(2, 3)] += r.pick([-5, -3, 3, 5]);
    const diffs = ys.slice(1).map((y, i) => y - ys[i]);
    return mc(r, yes ? 'Yes, it is constant' : 'No, it is not constant', [yes ? 'No, it is not constant' : 'Yes, it is constant'], { q: 'Is the rate of change in this table constant?', visual: { type: 'table', head: [hx, hy], rows: ys.map((y, x) => [x, y]) }, steps: [`The changes from row to row are ${diffs.map(neg).join(', ')}.`, yes ? 'They are all the same, so the rate is constant.' : 'They are not all the same, so the rate is not constant.'] });
  }
  if (t === 2) {
    const x1 = r.int(-5, 0), x2 = r.int(x1 + 1, 5), y1 = r.int(-5, 5), y2 = r.int(-5, 5);
    return num(frac(y2 - y1, x2 - x1), [`From (${neg(x1)}, ${neg(y1)}) to (${neg(x2)}, ${neg(y2)}): y changes by ${neg(y2 - y1)} and x changes by ${x2 - x1}.`, `Rate of change = ${neg(y2 - y1)} ÷ ${x2 - x1} = ${F(y2 - y1, x2 - x1)}.`], { q: 'The line on the graph goes through the two points shown. What is its rate of change?', visual: { type: 'plane', points: [[x1, y1], [x2, y2]], lines: [[(y2 - y1) / (x2 - x1), y1 - x1 * (y2 - y1) / (x2 - x1)]] }, expr: `(${y2}-(${y1}))/(${x2}-(${x1}))` });
  }
  const inc = [0, 1, 2, 3, 4].map(() => 2 * r.int(5, 25)), ys = inc.map((_, i) => inc.slice(0, i).reduce((a, b) => a + b, 0)), [a, b] = r.pick([[0, 2], [1, 3], [2, 4], [0, 4]]);
  return num((ys[b] - ys[a]) / (b - a), [`From hour ${a} to hour ${b}, the distance goes from ${ys[a]} to ${ys[b]} km: a change of ${ys[b] - ys[a]} km in ${b - a} hours.`, `${ys[b] - ys[a]} ÷ ${b - a} = ${(ys[b] - ys[a]) / (b - a)}.`, `The rate is ${(ys[b] - ys[a]) / (b - a)} km per hour.`], { q: `A cyclist's distance is shown in the table. What is the rate of change from hour ${a} to hour ${b}, in km per hour?`, visual: { type: 'table', head: ['Hour', 'Distance (km)'], rows: ys.map((y, i) => [i, y]) }, expr: `(${ys[b]}-${ys[a]})/(${b}-${a})` });
});

// ───────────── 14. Coordinate plane ─────────────
skill('7-coordplane', 7, 'Coordinate geometry', 'The coordinate plane', ['A point (x, y): x says how far right or left, y says how far up or down.', 'The axes split the plane into four quadrants: I top right, II top left, III bottom left, IV bottom right.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    let x = r.int(-6, 6), y = r.int(-6, 6); if (x === 0 && y === 0) x = 3;
    const right = y === 0 ? 'on the x-axis' : x === 0 ? 'on the y-axis' : x > 0 ? (y > 0 ? 'Quadrant I' : 'Quadrant IV') : y > 0 ? 'Quadrant II' : 'Quadrant III';
    const all = ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV', 'on the x-axis', 'on the y-axis'].filter((q) => q !== right);
    return mc(r, right, r.shuffle(all).slice(0, 3), { q: `Where is the point ${pt(x, y)}?`, visual: { type: 'plane', points: [[x, y]] }, steps: [`x = ${neg(x)} is ${x > 0 ? 'right of' : x < 0 ? 'left of' : 'on'} the y-axis; y = ${neg(y)} is ${y > 0 ? 'above' : y < 0 ? 'below' : 'on'} the x-axis.`, `So the point is ${right}.`] });
  }
  if (t === 1) {
    const x = r.nonzero(-6, 6); let y = r.nonzero(-6, 6); while (Math.abs(y) === Math.abs(x)) y = r.nonzero(-6, 6);
    return mc(r, pt(x, y), [pt(y, x), pt(-x, y), pt(x, -y)], { q: 'What are the coordinates of point A?', visual: { type: 'plane', points: [[x, y, 'A']] }, steps: [`From the origin, go ${Math.abs(x)} ${x > 0 ? 'right' : 'left'}: x = ${neg(x)}. Then ${Math.abs(y)} ${y > 0 ? 'up' : 'down'}: y = ${neg(y)}.`, `So A is ${pt(x, y)}.`] });
  }
  if (t === 2) {
    const a = r.int(-4, 4), b = r.int(-4, 4), h = r.nonzero(-5, 5), v = r.nonzero(-5, 5);
    return mc(r, pt(a + h, b + v), [pt(a - h, b + v), pt(a + h, b - v), pt(a + v, b + h)], { q: `Start at ${pt(a, b)}. Move ${Math.abs(h)} units ${h > 0 ? 'right' : 'left'} and ${Math.abs(v)} units ${v > 0 ? 'up' : 'down'}. Where do you end?`, steps: [`Right or left changes x: ${neg(a)} ${h > 0 ? '+' : '−'} ${Math.abs(h)} = ${neg(a + h)}. Up or down changes y: ${neg(b)} ${v > 0 ? '+' : '−'} ${Math.abs(v)} = ${neg(b + v)}.`, `You end at ${pt(a + h, b + v)}.`] });
  }
  const horiz = r.bool(), c = r.int(-5, 5), p = r.int(-6, 5), q = r.int(p + 1, 6), P = horiz ? [p, c] : [c, p], Q = horiz ? [q, c] : [c, q];
  return num(q - p, [`The points have the same ${horiz ? 'y' : 'x'}-coordinate, so they lie on a ${horiz ? 'horizontal' : 'vertical'} line.`, `Distance = |${neg(q)} − ${par(p)}| = ${q - p}.`, `They are ${q - p} units apart.`], { q: `How far apart are the points ${pt(...P)} and ${pt(...Q)}?`, visual: { type: 'plane', points: [[...P, 'P'], [...Q, 'Q']] }, unit: 'units', expr: `Math.abs(${q}-(${p}))` });
});

// ───────────── 15. Proportional relationships ─────────────
skill('7-constprop', 7, 'Proportional relationships', 'The constant of proportionality', ['In a proportional relationship, y ÷ x is always the same number, k.', 'Its equation is y = kx, and its graph is a straight line through (0, 0).'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const k = r.pick([0.5, 1.5, 2, 2.5, 3, 4, 5, 6, 0.25, 1.25, 7, 12]), xs = r.shuffle([2, 4, 6, 8, 10, 12]).slice(0, 3).sort((a, b) => a - b);
    return num(dec(k), [`Divide y by x in any row: ${dec(k * xs[0])} ÷ ${xs[0]} = ${dec(k)}.`, `Check another: ${dec(k * xs[1])} ÷ ${xs[1]} = ${dec(k)}. So k = ${dec(k)}.`], { q: 'y is proportional to x. What is the constant of proportionality?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [x, dec(k * x)]) }, expr: `${dec(k * xs[0])}/${xs[0]}` });
  }
  if (t === 1) {
    const [n, d] = r.pick([[1, 2], [1, 1], [2, 1], [3, 1], [1, 3], [3, 2], [2, 3]]), ms = [1, 2, 3, 4, 5, 6].filter((m) => d * m <= 6 && n * m <= 6), m = r.pick(ms), x = d * m, y = n * m;
    return num(frac(n, d), [`The line goes through (0, 0) and the point P (${x}, ${y}).`, `k = y ÷ x = ${y} ÷ ${x} = ${frac(n, d)}.`], { q: 'The graph shows a proportional relationship. What is the constant of proportionality?', visual: { type: 'plane', lines: [[n / d, 0]], points: [[x, y, 'P']] }, expr: `${y}/${x}` });
  }
  if (t === 2) {
    const k = r.int(2, 9), xs = r.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3).sort((a, b) => a - b);
    return mc(r, `y = ${k}x`, [`y = x + ${k}`, `x = ${k}y`, `y = ${k}x + ${k}`], { q: 'Which equation matches the table?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [x, k * x]) }, steps: [`y ÷ x is ${k} in every row: ${xs.map((x) => `${k * x} ÷ ${x} = ${k}`).join(', ')}.`, `So y = ${k}x.`] });
  }
  const who = r.pick(NAMES), k = r.int(12, 25), [what, right, wrongs] = r.pick([
    ['hours worked (x) and dollars earned (y)', `${who} earns $${k} for each hour of work.`, [`${who} works ${k} hours for each dollar.`, `${who} starts with $${k} before working.`, `${who} works ${k} hours in all.`]],
    ['kilograms of apples (x) and their cost in dollars (y)', `1 kg of apples costs $${k}.`, [`$1 buys ${k} kg of apples.`, `The apples cost $${k} in all.`, `${k} kg of apples cost $1.`]],
  ]);
  return mc(r, right, wrongs, { q: `A proportional graph shows ${what}. It passes through the point (1, ${k}). What does this point mean?`, steps: ['(1, y) tells the value of y when x is 1: the unit rate.', right] });
});
skill('7-propid', 7, 'Proportional relationships', 'Identify and use proportional relationships', ['A table is proportional when y ÷ x is the same in every row.', 'A graph is proportional when it is a straight line through the origin.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const k = r.int(2, 8), yes = r.bool(), c = yes ? 0 : r.int(1, 6), xs = r.shuffle([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 3).sort((a, b) => a - b), ys = xs.map((x) => k * x + c);
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'Is the relationship in the table proportional?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [x, ys[i]]) }, steps: [`Find y ÷ x: ${xs.map((x, i) => `${ys[i]} ÷ ${x} = ${dec(ys[i] / x, 2)}`).join(', ')}.`, yes ? 'It is the same every time, so yes, it is proportional.' : 'It is not the same every time, so no, it is not proportional.'] });
  }
  if (t === 1) {
    const m = r.pick([1, 2, 0.5, 3, -1, -2]), yes = r.bool(), b = yes ? 0 : r.nonzero(-3, 3);
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: 'Does the graph show a proportional relationship?', visual: { type: 'plane', lines: [[m, b]] }, steps: ['A proportional graph is a straight line that passes through the origin (0, 0).', yes ? 'This line goes through (0, 0), so yes.' : `This line crosses the y-axis at ${neg(b)}, not at 0, so no.`] });
  }
  if (t === 2) {
    const u = 5 * r.int(20, 120), n = r.int(2, 6); let m = r.int(2, 12); while (m === n) m = r.int(2, 12);
    return num(dec(m * u / 100), [`The cost per kilogram is k = ${cash(u * n)} ÷ ${n} = ${cash(u)}. The equation is y = ${(u / 100).toFixed(2)}x.`, `For x = ${m}: y = ${(u / 100).toFixed(2)} × ${m} = ${(m * u / 100).toFixed(2)}.`, `So ${m} kg cost ${cash(m * u)}.`], { q: `The cost of cheese is proportional to its mass. ${n} kg cost ${cash(u * n)}. How much do ${m} kg cost, in dollars?`, unit: '$', expr: `${u * n}/${n}*${m}/100` });
  }
  const k = r.pick([2, 3, 4, 1.5, 2.5]), xs = r.shuffle([2, 4, 6, 8, 10]).slice(0, 4).sort((a, b) => a - b), miss = r.int(1, 3);
  return num(dec(k * xs[miss]), [`From a full row: k = ${dec(k * xs[0])} ÷ ${xs[0]} = ${k}.`, `y = ${k} × ${xs[miss]} = ${dec(k * xs[miss])}.`, `The missing value is ${dec(k * xs[miss])}.`], { q: 'y is proportional to x. What is the missing y-value?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [x, i === miss ? '?' : dec(k * x)]) }, expr: `${k}*${xs[miss]}` });
});

// ───────────── 16. Percents ─────────────
skill('7-pctconv', 7, 'Percents', 'Percents, fractions and decimals', ['Percent means "out of 100": 35% = 35/100 = 0.35.', 'To change a decimal to a percent, multiply by 100.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const d = r.pick([2, 4, 5, 10, 20]), n = r.int(1, d - 1);
    return num(n * 100 / d, [`${n} of ${d} equal parts are shaded: ${n}/${d}.`, `${n}/${d} = ${n * 100 / d}/100 = ${n * 100 / d}%.`], { q: 'What percent of the bar is shaded?', visual: { type: 'fraction', n, d }, unit: '%', expr: `${n}/${d}*100` });
  }
  if (t === 1) {
    const kind = r.int(0, 3);
    if (kind === 0) { const p = r.pick([37.5, 8, 125, 45, 3, 60, 12.5, 250, 0.5, 72]); return num(dec(p / 100), [`Percent means divide by 100: move the point 2 places left.`, `${p}% = ${dec(p / 100)}.`], { q: `Write ${p}% as a decimal.`, expr: `${p}/100` }); }
    if (kind === 1) { const k = r.int(1, 250), x = k / 100; return num(k, [`Multiply by 100: move the point 2 places right.`, `${dec(x)} = ${k}%.`], { q: `Write ${dec(x)} as a percent.`, unit: '%', expr: `${x}*100` }); }
    if (kind === 2) { const [a, b] = r.pick(TERM); return num(dec(a / b * 100), [`${a}/${b} = ${dec(a / b)} as a decimal.`, `× 100: ${a}/${b} = ${dec(a / b * 100)}%.`], { q: `Write ${a}/${b} as a percent.`, unit: '%', expr: `${a}/${b}*100` }); }
    const p = 5 * r.int(1, 19);
    return num(frac(p, 100), [`${p}% = ${p}/100.`, `Simplify by dividing by ${gcd(p, 100)}: ${frac(p, 100)}.`], { q: `Write ${p}% as a fraction in simplest form.`, exactForm: 'fraction', expr: `${p}/100` });
  }
  const [a, b] = r.pick(TERM), v = a / b * 100, p = r.bool(0.2) ? v : Math.round(v) + r.nonzero(-6, 6);
  const sign = p > v + 1e-9 ? '>' : p < v - 1e-9 ? '<' : '=';
  return mc(r, sign, ['>', '<', '='].filter((x) => x !== sign), { q: `Which sign makes this true?  ${dec(p)}%  ?  ${a}/${b}`, steps: [`${a}/${b} = ${dec(a / b)} = ${dec(v)}%.`, `${dec(p)}% ${sign} ${dec(v)}%, so ${dec(p)}% ${sign} ${a}/${b}.`] });
});
skill('7-pctof', 7, 'Percents', 'Percent problems', ['Part = percent × whole. 30% of 60 = 0.3 × 60 = 18.', 'To find the percent: part ÷ whole × 100. To find the whole: part ÷ percent.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const p = r.pick([5, 12.5, 15, 20, 25, 30, 35, 40, 60, 75, 120, 150]), n = p === 12.5 ? 8 * r.int(2, 30) : 4 * r.int(3, 60), money = r.bool(), v = dec(p * n / 100);
    return num(v, [`${p}% = ${dec(p / 100)}.`, `${dec(p / 100)} × ${n} = ${v}.`, `So ${p}% of ${money ? '$' : ''}${n} is ${money ? '$' : ''}${v}.`], { q: `What is ${p}% of ${money ? '$' : ''}${n}?`, unit: money ? '$' : undefined, expr: `${p}*${n}/100` });
  }
  const pairs = []; for (const w of [20, 25, 40, 50, 80, 120, 200, 250, 400]) for (const p of [5, 10, 15, 20, 25, 30, 40, 60, 75, 80]) if ((w * p) % 100 === 0) pairs.push([w, p]);
  const [w, p] = r.pick(pairs), part = w * p / 100;
  if (t === 1) return num(p, [`Percent = part ÷ whole × 100.`, `${part} ÷ ${w} = ${dec(part / w)}, and × 100 gives ${p}.`, `So ${part} is ${p}% of ${w}.`], { q: `${part} is what percent of ${w}?`, unit: '%', expr: `${part}/${w}*100` });
  if (t === 2) return num(w, [`${part} is ${p}% of the whole, so whole = ${part} ÷ ${dec(p / 100)}.`, `${part} ÷ ${dec(p / 100)} = ${w}.`, `Check: ${p}% of ${w} = ${part}. The whole is ${w}.`], { q: `${part} is ${p}% of what number?`, expr: `${part}/${p}*100` });
  if (t === 3) {
    const p0 = r.pick([10, 20, 25, 50]), n0 = (p0 === 25 ? 40 : 100) * r.int(2, 9), pp = p0 + r.pick([-1, 1]), nn = n0 + r.nonzero(-4, 4), est = p0 * n0 / 100;
    return mc(r, est, [est * 2, est / 2, est + 10], { q: `Estimate ${pp}% of ${nn}.`, steps: [`${pp}% is about ${p0}%, and ${nn} is about ${n0}.`, `${p0}% of ${n0} = ${est}, so the answer is about ${est}.`] });
  }
  if (r.bool()) return num(part, [`${p}% of ${w} students walk.`, `${dec(p / 100)} × ${w} = ${part}.`, `So ${part} students walk.`], { q: `A school has ${w} students in grade 7. ${p}% of them walk to school. How many walk?`, expr: `${p}*${w}/100` });
  const tot = r.pick([20, 25, 40, 50]), s = r.int(Math.ceil(tot / 2), tot);
  return num(dec(s / tot * 100), [`Percent = ${s} ÷ ${tot} × 100.`, `${s} ÷ ${tot} = ${dec(s / tot)}, so ${dec(s / tot * 100)}%.`, `The score is ${dec(s / tot * 100)}%.`], { q: `${r.pick(NAMES)} got ${s} out of ${tot} questions right on a quiz. What percent is that?`, unit: '%', expr: `${s}/${tot}*100` });
});

// ───────────── 17. Consumer maths ─────────────
skill('7-unitprice', 7, 'Consumer maths', 'Unit prices and price lists', ['A unit price is the cost for one unit: one item, one kilogram, one litre.', 'Total cost = unit price × amount.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const u = r.int(30, 900), n = r.int(2, 8), [what, per] = r.pick([['kg of cherries', 'kilogram'], ['L of apple juice', 'litre'], ['bus tickets', 'ticket']]);
    return num(dec(u / 100), [`Divide the cost by the amount: ${cash(u * n)} ÷ ${n}.`, `${(u * n / 100).toFixed(2)} ÷ ${n} = ${(u / 100).toFixed(2)}.`, `The unit price is ${cash(u)} per ${per}.`], { q: `${n} ${what} cost ${cash(u * n)}. What is the price per ${per}, in dollars?`, unit: '$', expr: `${u * n}/${n}/100` });
  }
  if (t === 1) {
    const [s1, s2] = pick2(r, [200, 300, 400, 500, 600, 800, 1000]), [u1, u2] = pick2(r, [40, 55, 60, 75, 80, 95, 120, 150]), best = u1 < u2 ? 'Box A' : 'Box B';
    return mc(r, best, [best === 'Box A' ? 'Box B' : 'Box A'], { q: `Box A: ${s1} g of cereal for ${cash(u1 * s1 / 100)}. Box B: ${s2} g for ${cash(u2 * s2 / 100)}. Which is the better buy?`, steps: [`Price per 100 g: A is ${cash(u1 * s1 / 100)} ÷ ${s1 / 100} = ${cash(u1)}; B is ${cash(u2 * s2 / 100)} ÷ ${s2 / 100} = ${cash(u2)}.`, `The lower unit price is the better buy: ${best}.`] });
  }
  if (t === 2) {
    const u = 10 * r.int(15, 90), k = r.int(5, 40), tot = u * k / 10;
    return num(dec(tot / 100), [`Total = unit price × amount = ${cash(u)} × ${dec(k / 10)}.`, `${(u / 100).toFixed(2)} × ${dec(k / 10)} = ${(tot / 100).toFixed(2)}.`, `The grapes cost ${cash(tot)}.`], { q: `Grapes cost ${cash(u)} per kilogram. How much do ${dec(k / 10)} kg cost, in dollars?`, unit: '$', expr: `${u}*${k / 10}/100` });
  }
  const items = r.shuffle([['Sandwich', r.int(450, 750)], ['Soup', r.int(300, 550)], ['Milk', r.int(150, 250)], ['Apple', r.int(75, 125)], ['Salad', r.int(400, 700)]]).slice(0, 4);
  const [i1, i2] = pick2(r, [0, 1, 2, 3]), q1 = r.int(1, 3), q2 = r.int(1, 3), tot = q1 * items[i1][1] + q2 * items[i2][1];
  return num(dec(tot / 100), [`${q1} × ${cash(items[i1][1])} = ${cash(q1 * items[i1][1])} and ${q2} × ${cash(items[i2][1])} = ${cash(q2 * items[i2][1])}.`, `Add: ${cash(q1 * items[i1][1])} + ${cash(q2 * items[i2][1])} = ${cash(tot)}.`, `The total is ${cash(tot)}.`], { q: `Using the price list, what is the cost of ${q1} ${items[i1][0].toLowerCase()}${q1 > 1 ? 's' : ''} and ${q2} ${items[i2][0].toLowerCase()}${q2 > 1 ? 's' : ''}, in dollars?`, visual: { type: 'table', head: ['Item', 'Price'], rows: items.map(([n, p]) => [n, cash(p)]) }, unit: '$', expr: `(${q1}*${items[i1][1]}+${q2}*${items[i2][1]})/100` });
});
skill('7-taxdisc', 7, 'Consumer maths', 'Discounts, tax and tips', ['A discount is taken off the price; sales tax is added on.', 'GST is 5%. HST is 13% in Ontario and 15% in the Atlantic provinces.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const P = r.int(8, 60) * 5, p = r.pick([10, 15, 20, 25, 30, 40, 50]), off = P * p / 100;
    return num(dec(P - off), [`Discount: ${p}% of $${P} = ${dec(p / 100)} × ${P} = $${dec(off)}.`, `Sale price: $${P} − $${dec(off)} = $${dec(P - off)}.`, `The sale price is $${dec(P - off)}.`], { q: `A jacket costs $${P}. It is on sale for ${p}% off. What is the sale price, in dollars?`, unit: '$', expr: `${P}*(1-${p}/100)` });
  }
  if (t === 1) {
    const P = r.int(10, 300), [tx, nm] = r.pick([[5, 'GST of 5%'], [13, 'HST of 13% (Ontario)'], [15, 'HST of 15% (Nova Scotia)']]), tax = P * tx / 100;
    return num(dec(P + tax, 2), [`Tax: ${tx}% of $${P} = ${dec(tx / 100)} × ${P} = ${cash(Math.round(tax * 100))}.`, `Total: $${P} + ${cash(Math.round(tax * 100))} = ${cash(Math.round((P + tax) * 100))}.`, `You pay ${cash(Math.round((P + tax) * 100))}.`], { q: `A pair of skates costs $${P} before tax. With ${nm}, what is the total cost, in dollars?`, unit: '$', expr: `${P}*(1+${tx}/100)` });
  }
  const R = r.pick([20, 40, 50, 60, 80, 120, 150, 200]), p = r.pick([10, 20, 25, 30, 40, 50, 75]), S = R * (100 - p) / 100;
  if (t === 2) return num(p, [`The discount is $${R} − $${dec(S)} = $${dec(R - S)}.`, `Percent off = ${dec(R - S)} ÷ ${R} × 100 = ${p}.`, `It is ${p}% off.`], { q: `A game regularly costs $${R}. It is on sale for $${dec(S)}. What percent is the discount?`, unit: '%', expr: `(${R}-${S})/${R}*100` });
  if (t === 3) return num(R, [`After ${p}% off, you pay ${100 - p}% of the original price.`, `So ${dec((100 - p) / 100)} × original = $${dec(S)}, and original = ${dec(S)} ÷ ${dec((100 - p) / 100)} = ${R}.`, `The original price was $${R}.`], { q: `After a ${p}% discount, a backpack costs $${dec(S)}. What was the original price, in dollars?`, unit: '$', expr: `${S}/(1-${p}/100)` });
  const B = 10 * r.int(2, 12), bill = B * 100 + r.nonzero(-140, 140), tp = r.pick([10, 15, 20]), est = B * tp / 100;
  const fm = (x) => `$${x.toFixed(2)}`;
  return mc(r, fm(est), [fm(est * 2), fm(est / 2), fm(est + 5)], { q: `Estimate a ${tp}% tip on a restaurant bill of ${cash(bill)}.`, steps: [`Round the bill to $${B}. 10% of $${B} is $${dec(B / 10)}.`, tp === 10 ? `So the tip is about ${fm(est)}.` : tp === 20 ? `20% is double that: about ${fm(est)}.` : `5% is half of 10%, so 15% is $${dec(B / 10)} + $${dec(B / 20)}: about ${fm(est)}.`] });
});
skill('7-interest', 7, 'Consumer maths', 'Simple interest and multi-step percents', ['Simple interest: I = P × r × t (principal × rate as a decimal × years).', 'For several percent changes, do them one at a time.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const P = r.pick([200, 500, 800, 1000, 1500, 2000, 2500, 5000]), rt = r.pick([2, 3, 4, 5, 1.5, 2.5]), y = r.int(1, 5), I = P * rt * y / 100, total = r.bool();
    return num(dec(total ? P + I : I, 2), [`I = P × r × t = ${P} × ${dec(rt / 100)} × ${y}.`, `I = $${dec(I, 2)}.`, total ? `Balance = $${P} + $${dec(I, 2)} = $${dec(P + I, 2)}.` : `The interest is $${dec(I, 2)}.`], { q: `$${P} is saved at ${rt}% simple interest per year for ${y} year${y > 1 ? 's' : ''}. ${total ? 'What is the total balance at the end' : 'How much interest is earned'}, in dollars?`, unit: '$', expr: total ? `${P}+${P}*${rt}/100*${y}` : `${P}*${rt}/100*${y}` });
  }
  if (t === 1) {
    const P = 20 * r.int(1, 15), p = r.pick([10, 20, 25, 50]), [tx, nm] = r.pick([[5, 'GST of 5%'], [13, '13% HST'], [15, '15% HST']]), S = P * (100 - p) / 100, T = S * (100 + tx) / 100;
    return num(dec(T, 2), [`Discount first: ${p}% off $${P} leaves $${dec(S)}.`, `Then tax: ${tx}% of $${dec(S)} is $${dec(S * tx / 100, 2)}.`, `Total: $${dec(S)} + $${dec(S * tx / 100, 2)} = $${dec(T, 2)}.`], { q: `A $${P} sweater is ${p}% off, and then ${nm} is added. What is the final price, in dollars?`, unit: '$', expr: `${P}*(1-${p}/100)*(1+${tx}/100)` });
  }
  if (t === 2) {
    const P = r.pick([400, 500, 800, 1000, 2000]), rt = r.pick([2, 3, 4, 5]), y = r.int(2, 8), I = P * rt * y / 100;
    return num(y, [`I = P × r × t, so t = I ÷ (P × r).`, `P × r = ${P} × ${dec(rt / 100)} = ${dec(P * rt / 100)} per year.`, `${dec(I)} ÷ ${dec(P * rt / 100)} = ${y}, so it takes ${y} years.`], { q: `How many years does it take $${P} to earn $${dec(I)} in simple interest at ${rt}% per year?`, unit: 'years', expr: `${I}/(${P}*${rt}/100)` });
  }
  const C = 4 * r.int(3, 50), m = r.pick([20, 25, 30, 40, 50, 75, 100]), S = C * (100 + m) / 100;
  return num(dec(S), [`Markup: ${m}% of $${C} = $${dec(C * m / 100)}.`, `Selling price: $${C} + $${dec(C * m / 100)} = $${dec(S)}.`, `The store sells it for $${dec(S)}.`], { q: `A store buys a hockey stick for $${C} and marks the price up by ${m}%. What is the selling price, in dollars?`, unit: '$', expr: `${C}*(1+${m}/100)` });
});

// ───────────── 18. Problem solving and estimation ─────────────
skill('7-problemsolve', 7, 'Problem solving', 'Problem solving', ['Read carefully, decide what is asked, then choose a plan: draw it, guess and check, or work step by step.', 'Check that your answer makes sense.'], (r) => {
  const t = r.int(0, 4), who = r.pick(NAMES);
  if (t === 0 || t === 3) {
    const [v1, v2, w1, w2] = t === 0 ? r.pick([[10, 25, 'dimes', 'quarters'], [5, 10, 'nickels', 'dimes'], [100, 200, 'loonies', 'toonies'], [5, 25, 'nickels', 'quarters']]) : [r.int(5, 9) * 100, r.int(10, 15) * 100, 'child tickets', 'adult tickets'];
    const n = r.int(6, 18), k = r.int(1, n - 1), val = (n - k) * v1 + k * v2;
    return num(k, [`If all ${n} were ${w1}: ${n} × ${cash(v1)} = ${cash(n * v1)}.`, `That is ${cash(val - n * v1)} short. Each swap to one of the ${w2} adds ${cash(v2 - v1)}.`, `${cash(val - n * v1)} ÷ ${cash(v2 - v1)} = ${k}, so there are ${k} ${w2}.`], { q: t === 0 ? `${who} has ${n} coins, all ${w1} and ${w2}. They are worth ${cash(val)}. How many ${w2} are there?` : `A class buys ${n} tickets: child tickets cost ${cash(v1)} and adult tickets cost ${cash(v2)}. The total is ${cash(val)}. How many adult tickets were bought?`, expr: `(${val}-${n}*${v1})/(${v2}-${v1})` });
  }
  if (t === 1) {
    const sh = r.int(6, 15), sm = 5 * r.int(0, 11), dh = r.int(0, 4), dm = 5 * r.int(1, 11), end = sh * 60 + sm + dh * 60 + dm, hm = (x) => `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
    if (r.bool()) return num(end - sh * 60 - sm, [`From ${hm(sh * 60 + sm)} to ${hm(end)} is ${dh} h ${dm} min.`, `${dh} × 60 + ${dm} = ${dh * 60 + dm}.`, `The trip takes ${dh * 60 + dm} minutes.`], { q: `A bus leaves at ${hm(sh * 60 + sm)} and arrives at ${hm(end)}. How many minutes long is the trip?`, unit: 'min', expr: `${end}-${sh * 60 + sm}` });
    return mc(r, hm(end), [hm(end + 60), hm(end - 60), hm(end + 10)], { q: `A movie starts at ${hm(sh * 60 + sm)} and lasts ${dh} h ${dm} min. When does it end?`, steps: [`Add the hours: ${hm(sh * 60 + sm)} + ${dh} h = ${hm(sh * 60 + sm + dh * 60)}.`, `Add the minutes: + ${dm} min = ${hm(end)}.`] });
  }
  if (t === 2) {
    const both = r.int(2, 8), A = both + r.int(3, 12), B = both + r.int(3, 12), T = A + B - both + r.int(0, 8), sp = r.pick([['soccer', 'hockey'], ['piano', 'guitar'], ['French', 'Spanish']]);
    return num(T - (A + B - both), [`${A} + ${B} counts the ${both} who do both twice, so ${A} + ${B} − ${both} = ${A + B - both} do at least one.`, `${T} − ${A + B - both} = ${T - (A + B - both)}.`, `So ${T - (A + B - both)} students do neither.`], { q: `In a group of ${T} students, ${A} play ${sp[0]}, ${B} play ${sp[1]}, and ${both} play both. How many play neither? (Think of a Venn diagram.)`, expr: `${T}-(${A}+${B}-${both})` });
  }
  const s = r.int(100, 300), tc = r.int(5, 20), cap = r.pick([40, 48, 52, 60]), people = s + tc, buses = Math.ceil(people / cap);
  return num(buses, [`People: ${s} + ${tc} = ${people}.`, `${people} ÷ ${cap} ≈ ${dec(people / cap, 2)}. Part of a bus is still a bus, so round up.`, `They need ${buses} buses.`], { q: `${s} students and ${tc} teachers go on a trip. Each bus holds ${cap} people. How many buses are needed?`, expr: `Math.ceil(${people}/${cap})` });
});

// ───────────── 19. Units of measurement ─────────────
skill('7-metric', 7, 'Measurement', 'Metric units', ['Metric units go up and down by powers of 10: 1 km = 1000 m, 1 m = 100 cm, 1 kg = 1000 g, 1 L = 1000 mL.', 'Going to a smaller unit, multiply. Going to a bigger unit, divide.', '1 cm³ holds exactly 1 mL.'], (r) => {
  const t = r.int(0, 5);
  const U = r.pick([['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'mL', 1000], ['m', 'mm', 1000]]);
  const [big, small, Fc] = U;
  if (t === 0) {
    if (r.bool()) { const k = r.int(5, 999), v = k / 100, a = dec(k * Fc / 100); return num(a, [`1 ${big} = ${comma(Fc)} ${small}. Going to a smaller unit, multiply.`, `${dec(v)} × ${comma(Fc)} = ${a}.`, `So ${dec(v)} ${big} = ${a} ${small}.`], { q: `${dec(v)} ${big} = ? ${small}`, expr: `${v}*${Fc}` }); }
    const w = r.int(5, 9999), a = dec(w / Fc);
    return num(a, [`1 ${big} = ${comma(Fc)} ${small}. Going to a bigger unit, divide.`, `${w} ÷ ${comma(Fc)} = ${a}.`, `So ${w} ${small} = ${a} ${big}.`], { q: `${w} ${small} = ? ${big}`, expr: `${w}/${Fc}` });
  }
  if (t === 1) {
    const a = r.int(1, 9), b = r.int(1, Fc - 1), toSmall = r.bool();
    if (toSmall) return num(a * Fc + b, [`${a} ${big} = ${a * Fc} ${small}.`, `${a * Fc} + ${b} = ${a * Fc + b}, so the answer is ${a * Fc + b} ${small}.`], { q: `${a} ${big} ${b} ${small} = ? ${small}`, expr: `${a}*${Fc}+${b}` });
    return num(dec(a + b / Fc), [`${b} ${small} = ${b} ÷ ${comma(Fc)} = ${dec(b / Fc)} ${big}.`, `${a} + ${dec(b / Fc)} = ${dec(a + b / Fc)}, so the answer is ${dec(a + b / Fc)} ${big}.`], { q: `${a} ${big} ${b} ${small} = ? ${big}`, expr: `${a}+${b}/${Fc}` });
  }
  if (t === 2) {
    const [b2, s2, F2, why] = r.pick([['m²', 'cm²', 10000, '1 m² is 100 cm by 100 cm'], ['cm²', 'mm²', 100, '1 cm² is 10 mm by 10 mm'], ['m³', 'cm³', 1000000, '1 m³ is 100 × 100 × 100 cm'], ['cm³', 'mm³', 1000, '1 cm³ is 10 × 10 × 10 mm']]), v = r.int(2, 9);
    if (r.bool()) return num(v * F2, [`${why}, so 1 ${b2} = ${comma(F2)} ${s2}.`, `${v} × ${comma(F2)} = ${comma(v * F2)}, so the answer is ${comma(v * F2)} ${s2}.`], { q: `${v} ${b2} = ? ${s2}`, expr: `${v}*${F2}` });
    return num(v, [`${why}, so 1 ${b2} = ${comma(F2)} ${s2}.`, `${comma(v * F2)} ÷ ${comma(F2)} = ${v}, so the answer is ${v} ${b2}.`], { q: `${comma(v * F2)} ${s2} = ? ${b2}`, expr: `${v * F2}/${F2}` });
  }
  if (t === 3) {
    if (r.bool()) { const l = r.int(2, 20), w = r.int(2, 15), h = r.int(2, 12); return num(l * w * h, [`Volume = ${l} × ${w} × ${h} = ${l * w * h} cm³.`, `1 cm³ holds 1 mL, so the box holds ${l * w * h} mL.`], { q: `A box is ${l} cm long, ${w} cm wide and ${h} cm high. How many millilitres does it hold?`, unit: 'mL', expr: `${l}*${w}*${h}` }); }
    const k = r.int(5, 50) / 10;
    return num(dec(k * 1000), [`1 L = 1000 mL, and 1 mL = 1 cm³.`, `${dec(k)} × 1000 = ${dec(k * 1000)}, so the answer is ${dec(k * 1000)} cm³.`], { q: `A jug holds ${dec(k)} L. How many cubic centimetres is that?`, unit: 'cm³', expr: `${k}*1000` });
  }
  if (t === 4) {
    const [what, right, wrongs] = r.pick([['the mass of an apple', '150 g', ['150 kg', '15 g', '1.5 kg']], ['the length of a pencil', '18 cm', ['18 mm', '18 m', '1.8 m']], ['the capacity of a bathtub', '200 L', ['200 mL', '20 mL', '2000 L']], ['the height of a classroom door', '2 m', ['2 cm', '20 m', '200 mm']], ['the mass of a large dog', '30 kg', ['30 g', '300 kg', '3 g']], ['the capacity of a soup spoon', '15 mL', ['15 L', '150 L', '1.5 L']], ['the distance a person walks in an hour', '5 km', ['5 m', '50 km', '500 cm']]]);
    return mc(r, right, wrongs, { q: `Which is the best estimate for ${what}?`, steps: ['Picture each amount and compare with things you know.', `${right} is the most reasonable.`] });
  }
  const [u, a] = [r.pick(['m', 'kg', 'L']), r.int(2, 9)], b = r.int(1, 9), c = r.int(1, 9);
  const right = `${a}.${b}${c} ${u}`;
  return mc(r, right, [`${a} ${u}`, `${a}.${b} ${u}`], { q: 'Which measurement is the most precise?', steps: ['The more decimal places in the same unit, the smaller the unit it was measured to.', `${right} is measured to the hundredth, so it is the most precise.`] });
});

// ───────────── 20. Expressions ─────────────
skill('7-writeexpr', 7, 'Expressions', 'Write expressions', ['A variable stands for a number we do not know yet.', '"5 less than twice n" is 2n − 5. "Twice the sum of n and 5" is 2(n + 5).', 'In 4x − 7y + 3, the terms are 4x, −7y and 3; the coefficient of y is −7.'], (r) => {
  const t = r.int(0, 2), k = r.int(2, 9); let m = r.int(2, 9); while (m === k) m = r.int(2, 9);
  if (t === 0) {
    const [phrase, right, wrongs] = r.pick([
      [`${k} less than ${m} times a number n`, `${m}n − ${k}`, [`${k} − ${m}n`, `${m}(n − ${k})`, `${m} + n − ${k}`]],
      [`${m} times the sum of a number n and ${k}`, `${m}(n + ${k})`, [`${m}n + ${k}`, `${k}n + ${m}`, `n + ${m} × ${k}`]],
      [`a number n divided by ${m}, then increased by ${k}`, `n/${m} + ${k}`, [`${m}/n + ${k}`, `(n + ${k})/${m}`, `${m}n + ${k}`]],
      [`${k} more than the square of a number n`, `n^2 + ${k}`, [`${k}n^2`, `(n + ${k})^2`, `2n + ${k}`]],
    ]);
    return mc(r, right, wrongs, { q: `Which expression means "${phrase}"?`, steps: ['Find the operations in the words, and the order they happen.', `"${phrase}" is ${right}.`] });
  }
  if (t === 1) {
    const who = r.pick(NAMES), [q, right, wrongs] = r.pick([
      [`A climbing gym charges $${m} per visit plus a $${k} membership fee. Which expression gives the cost for v visits?`, `${m}v + ${k}`, [`${k}v + ${m}`, `${m + k}v`, `${m}(v + ${k})`]],
      [`${who} has n stickers, gives away ${k}, then shares the rest equally among ${m} friends. Which expression gives how many each friend gets?`, `(n − ${k})/${m}`, [`n − ${k}/${m}`, `${m}(n − ${k})`, `(n − ${m})/${k}`]],
      [`A taxi charges $${k} to start and $${m} per kilometre. Which expression gives the cost for d kilometres?`, `${k} + ${m}d`, [`${m} + ${k}d`, `${k + m}d`, `${k}d + ${m}d`]],
    ]);
    return mc(r, right, wrongs, { q, steps: ['Find the part that changes (times the variable) and the part that stays the same.', `So the expression is ${right}.`] });
  }
  const a = r.nonzero(-9, 9), b = r.nonzero(-9, 9), c = r.nonzero(-12, 12), e = ex([[a, 'x'], [b, 'y'], [c, '']]), [ask, v] = r.pick([['the coefficient of x', a], ['the coefficient of y', b], ['the constant term', c]]);
  return num(v, [`The terms of ${e} are ${[ex([[a, 'x']]), ex([[b, 'y']]), ex([[c, '']])].join(', ')}.`, `So ${ask} is ${neg(v)}.`], { q: `In the expression ${e}, what is ${ask}?`, expr: String(v) });
});
skill('7-evalexpr', 7, 'Expressions', 'Evaluate expressions', ['Put each value in place of its variable, using brackets for negatives.', 'Then follow the order of operations.'], (r) => {
  const t = r.int(0, 3);
  const x = r.nonzero(-6, 6), y = r.nonzero(-6, 6), a = r.int(2, 9), b = r.int(-12, 12), c = r.int(1, 9);
  if (t === 0) { const v = a * x + b; return num(v, [`Put x = ${neg(x)} in: ${a} × ${par(x)} ${sgn(b)}.`, `${a} × ${par(x)} = ${neg(a * x)}, and ${neg(a * x)} ${sgn(b)} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `Evaluate ${ex([[a, 'x'], [b, '']])} when x = ${neg(x)}.`, expr: `${a}*(${x})+(${b})` }); }
  if (t === 1) { const v = a * x - c * y + b; return num(v, [`Put in x = ${neg(x)} and y = ${neg(y)}: ${a} × ${par(x)} − ${c} × ${par(y)} ${sgn(b)}.`, `${neg(a * x)} − ${par(c * y)} ${sgn(b)} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `Evaluate ${ex([[a, 'x'], [-c, 'y'], [b, '']])} when x = ${neg(x)} and y = ${neg(y)}.`, expr: `${a}*(${x})-${c}*(${y})+(${b})` }); }
  if (t === 2) { const inner = a * x + b, v = Math.abs(inner) - c; return num(v, [`Inside the bars: ${a} × ${par(x)} ${sgn(b)} = ${neg(inner)}.`, `|${neg(inner)}| = ${Math.abs(inner)}, and ${Math.abs(inner)} − ${c} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `Evaluate |${ex([[a, 'x'], [b, '']])}| − ${c} when x = ${neg(x)}.`, expr: `Math.abs(${a}*(${x})+(${b}))-${c}` }); }
  if (r.bool()) { const v = x * x + a * x + b; return num(v, [`x^2 = ${par(x)}^2 = ${x * x}, and ${a}x = ${a} × ${par(x)} = ${neg(a * x)}.`, `${x * x} + ${par(a * x)} ${sgn(b)} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `Evaluate x^2 + ${a}x ${sgn(b)} when x = ${neg(x)}.`, expr: `(${x})**2+${a}*(${x})+(${b})` }); }
  const v = 2 * x ** 3 - y; return num(v, [`x^3 = ${par(x)}^3 = ${neg(x ** 3)}, so 2x^3 = ${neg(2 * x ** 3)}.`, `${neg(2 * x ** 3)} − ${par(y)} = ${neg(v)}.`, `So the value is ${neg(v)}.`], { q: `Evaluate 2x^3 − y when x = ${neg(x)} and y = ${neg(y)}.`, expr: `2*(${x})**3-(${y})` });
});

// ───────────── 21. Equivalent expressions ─────────────
skill('7-liketerms', 7, 'Equivalent expressions', 'Combine like terms', ['Like terms have the same variable part: 3x and −5x are like terms, 3x and 3x^2 are not.', 'Add or subtract the coefficients of like terms.'], (r) => {
  const t = r.int(0, 2), nz = (lo, hi) => r.nonzero(lo, hi);
  let a = nz(-9, 9), c = nz(-9, 9); while (a + c === 0) c = nz(-9, 9);
  let b = nz(-9, 9), d = nz(-9, 9); while (b + d === 0) d = nz(-9, 9);
  if (t === 0) {
    const right = ex([[a + c, 'x'], [b + d, '']]);
    return mc(r, right, [ex([[a + c + b + d, 'x']]), ex([[a + c, 'x'], [b - d, '']]), ex([[a + b, 'x'], [c + d, '']])], { q: `Simplify: ${ex([[a, 'x'], [b, ''], [c, 'x'], [d, '']])}`, steps: [`x terms: ${neg(a)} + ${par(c)} = ${neg(a + c)}. Numbers: ${neg(b)} + ${par(d)} = ${neg(b + d)}.`, `So it simplifies to ${right}.`] });
  }
  if (t === 1) {
    const right = ex([[a + c, 'x^2'], [b + d, 'x']]);
    return mc(r, right, [ex([[a + c + b + d, 'x^2']]), ex([[a + b, 'x^2'], [c + d, 'x']]), ex([[a + c, 'x^4'], [b + d, 'x']])], { q: `Simplify: ${ex([[a, 'x^2'], [b, 'x'], [c, 'x^2'], [d, 'x']])}`, steps: [`x^2 terms: ${neg(a)} + ${par(c)} = ${neg(a + c)}. x terms: ${neg(b)} + ${par(d)} = ${neg(b + d)}.`, `x^2 and x are not like terms, so the answer is ${right}.`] });
  }
  return num(a + c, [`Combine the x terms: ${neg(a)} + ${par(c)} = ${neg(a + c)}.`, `So the expression is ${ex([[a + c, 'x'], [b + d, '']])}, and the missing coefficient is ${neg(a + c)}.`], { q: `${ex([[a, 'x'], [b, ''], [c, 'x'], [d, '']])} simplifies to ?x ${sgn(b + d)}. What number goes in the box?`, expr: `${a}+(${c})` });
});
skill('7-distribute', 7, 'Equivalent expressions', 'The distributive property and factoring', ['Distributive property: a(b + c) = ab + ac. Multiply the outside number by every term inside.', 'Factoring goes the other way: take out the greatest common factor.'], (r) => {
  const t = r.int(0, 4), a = r.int(2, 9), b = r.int(1, 9), c = r.nonzero(-9, 9);
  if (t === 0) { const right = ex([[a * b, 'x'], [a * c, '']]); return mc(r, right, [ex([[a * b, 'x'], [c, '']]), ex([[b, 'x'], [a * c, '']]), ex([[a + b, 'x'], [a + c, '']])], { q: `Expand: ${a}(${ex([[b, 'x'], [c, '']])})`, steps: [`Multiply ${a} by each term: ${a} × ${ex([[b, 'x']])} = ${ex([[a * b, 'x']])} and ${a} × ${par(c)} = ${neg(a * c)}.`, `So ${a}(${ex([[b, 'x'], [c, '']])}) = ${right}.`] }); }
  if (t === 1) { const right = ex([[-a * b, 'x'], [-a * c, '']]); return mc(r, right, [ex([[-a * b, 'x'], [a * c, '']]), ex([[a * b, 'x'], [-a * c, '']]), ex([[-a * b, 'x'], [c, '']])], { q: `Expand: −${a}(${ex([[b, 'x'], [c, '']])})`, steps: [`Multiply −${a} by each term: −${a} × ${ex([[b, 'x']])} = ${ex([[-a * b, 'x']])} and −${a} × ${par(c)} = ${neg(-a * c)}.`, `So the answer is ${right}.`] }); }
  if (t === 2) {
    const g = r.int(2, 6), m = r.int(1, 5); let n = r.int(1, 9); while (gcd(m, n) !== 1) n = r.int(1, 9);
    const right = `${g}(${ex([[m, 'x'], [n, '']])})`;
    return mc(r, right, [`${g}(${ex([[m, 'x'], [g * n, '']])})`, `${g * m}(x + ${n})`, `${g}(${ex([[m + 1, 'x'], [n, '']])})`], { q: `Factor using the greatest common factor: ${ex([[g * m, 'x'], [g * n, '']])}`, steps: [`The greatest common factor of ${g * m} and ${g * n} is ${g}.`, `${g * m}x ÷ ${g} = ${ex([[m, 'x']])} and ${g * n} ÷ ${g} = ${n}, so it is ${right}.`] });
  }
  if (t === 3) {
    const [rule, name] = r.pick([[`${b} + ${a} = ${a} + ${b}`, 'Commutative property of addition'], [`${a} × x = x × ${a}`, 'Commutative property of multiplication'], [`(${a} + ${b}) + x = ${a} + (${b} + x)`, 'Associative property of addition'], [`(${a} × ${b}) × x = ${a} × (${b} × x)`, 'Associative property of multiplication'], [`${a}(x + ${b}) = ${a}x + ${a * b}`, 'Distributive property'], [`x + 0 = x`, 'Identity property of addition']]);
    return mc(r, name, r.shuffle(['Commutative property of addition', 'Commutative property of multiplication', 'Associative property of addition', 'Associative property of multiplication', 'Distributive property', 'Identity property of addition'].filter((x) => x !== name)).slice(0, 3), { q: `Which property is shown?  ${rule}`, steps: ['Commutative: swap the order. Associative: move the brackets. Distributive: multiply into brackets. Identity: adding 0 changes nothing.', `So this is the ${name.toLowerCase()}.`] });
  }
  const n = r.int(12, 98);
  return num(a * n, [St(`Split ${n} into ${n - (n % 10)} + ${n % 10}: ${a} × ${n} = ${a} × ${n - (n % 10)} + ${a} × ${n % 10}.`, areaModel(a, n)), St(`${a * (n - (n % 10))} + ${a * (n % 10)} = ${a * n}.`), St(`So ${a} × ${n} = ${a * n}.`)], { q: `Use the distributive property: ${a} × ${n} = ${a} × ${n - (n % 10)} + ${a} × ${n % 10} = ?`, expr: `${a}*${n}` });
});
skill('7-equivexpr', 7, 'Equivalent expressions', 'Equivalent expressions', ['Two expressions are equivalent when they are equal for every value of the variable.', 'Simplify both and compare: expand brackets, then combine like terms.'], (r) => {
  const t = r.int(0, 2), a = r.int(2, 6), b = r.int(1, 9), c = r.int(1, 6);
  if (t === 0) { const right = ex([[a + c, 'x'], [a * b, '']]); return mc(r, right, [ex([[a + c, 'x'], [b, '']]), ex([[a, 'x'], [a * b + c, '']]), ex([[a * c, 'x'], [a * b, '']])], { q: `Which expression is equivalent to ${a}(x + ${b}) + ${c === 1 ? '' : c}x?`, steps: [`Expand: ${a}(x + ${b}) = ${a}x + ${a * b}.`, `Add the ${c === 1 ? '' : c}x: ${a}x + ${c === 1 ? '' : c}x = ${a + c}x. So it is ${right}.`] }); }
  if (t === 1) { const right = ex([[2, 'x'], [2 * b + 2 * c, '']]); return mc(r, right, [ex([[1, 'x'], [b + c, '']]), ex([[2, 'x'], [b + c, '']]), ex([[c, 'x'], [b * c, '']])], { q: `A rectangle is (x + ${b}) cm long and ${c} cm wide. Which expression gives its perimeter?`, steps: [`Perimeter = 2 × length + 2 × width = 2(x + ${b}) + 2 × ${c}.`, `= 2x + ${2 * b} + ${2 * c} = ${right}.`] }); }
  const m = r.int(1, 4), n = r.int(1, 5), g = r.int(2, 4), right = `${g}(${ex([[m, 'x'], [n, '']])})`;
  return mc(r, right, [`${g}(${ex([[m * g, 'x'], [n * g, '']])})`, `${g + 1}(${ex([[m, 'x'], [n, '']])})`, `${g}x + ${n}`], { q: `Algebra tiles show ${g * m} x-tiles and ${g * n} unit tiles, split into ${g} equal groups. Which expression is equivalent to ${ex([[g * m, 'x'], [g * n, '']])}?`, steps: [`Each of the ${g} groups has ${m} x-tile${m > 1 ? 's' : ''} and ${n} unit tile${n > 1 ? 's' : ''}.`, `So ${ex([[g * m, 'x'], [g * n, '']])} = ${right}.`] });
});

// ───────────── 22. One-variable equations ─────────────
skill('7-eqsolve', 7, 'Equations', 'Write and solve equations', ['Do the same thing to both sides to keep the equation balanced.', 'To check, put your answer back into the equation.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const x = r.nonzero(-9, 9), a = r.nonzero(-6, 6), b = r.int(-15, 15), c = a * x + b;
    return mc(r, `x = ${neg(x)}`, [`x = ${neg(x + 1)}`, `x = ${neg(x - 1)}`, `x = ${neg(-x)}`], { q: `Which value of x makes ${ex([[a, 'x'], [b, '']])} = ${neg(c)} true?`, steps: [`Try each value. For x = ${neg(x)}: ${neg(a)} × ${par(x)} ${sgn(b)} = ${neg(c)}.`, `That matches, so x = ${neg(x)}.`] });
  }
  if (t === 1) {
    const kind = r.int(0, 2);
    if (kind === 0) { const a = r.int(11, 99) / 10, x = r.int(-50, 99) / 10, s = dec(x + a); return num(dec(x), [St(`Subtract ${dec(a)} from both sides.`, eqnLines([{ eq: `x + ${dec(a)} = ${M(s)}` }, { eq: `x = ${M(s)} − ${dec(a)}`, note: `− ${dec(a)} on both sides` }])), St(`x = ${D(x)}.`)], { q: `Solve: x + ${dec(a)} = ${M(s)}`, unit: 'x =', expr: `${s}-${a}` }); }
    if (kind === 1) { const a = r.pick([0.2, 0.4, 0.5, 1.5, 2.5, 0.25]), x = r.int(2, 40), p = dec(a * x); return num(x, [St(`Divide both sides by ${a}.`, eqnLines([{ eq: `${a}x = ${p}` }, { eq: `x = ${p} ÷ ${a}`, note: `÷ ${a} on both sides` }])), St(`x = ${x}.`)], { q: `Solve: ${a}x = ${p}`, unit: 'x =', expr: `${p}/${a}` }); }
    const a = r.int(2, 9), q = r.nonzero(-12, 12); return num(a * q, [St(`Multiply both sides by ${a}.`, eqnLines([{ eq: `x ÷ ${a} = ${neg(q)}` }, { eq: `x = ${neg(q)} × ${a}`, note: `× ${a} on both sides` }])), St(`x = ${neg(a * q)}.`)], { q: `Solve: x ÷ ${a} = ${neg(q)}`, unit: 'x =', expr: `${q}*${a}` });
  }
  if (t === 2) {
    const m = r.int(2, 6), k = r.int(1, 12), n = r.int(1, 12), [words, right, wrongs] = r.pick([
      [`${k} more than ${m} times a number is ${m * n + k}.`, `${m}n + ${k} = ${m * n + k}`, [`${m}(n + ${k}) = ${m * n + k}`, `${k}n + ${m} = ${m * n + k}`, `${m}n = ${m * n + k} + ${k}`]],
      [`${m} times the sum of a number and ${k} is ${m * (n + k)}.`, `${m}(n + ${k}) = ${m * (n + k)}`, [`${m}n + ${k} = ${m * (n + k)}`, `n + ${m * k} = ${m * (n + k)} + ${m}`, `${k}(n + ${m}) = ${m * (n + k)}`]],
      [`A number divided by ${m}, minus ${k}, is ${n}.`, `n/${m} − ${k} = ${n}`, [`(n − ${k})/${m} = ${n}`, `${m}n − ${k} = ${n}`, `n/${k} − ${m} = ${n}`]],
    ]);
    return mc(r, right, wrongs, { q: `Which equation matches: "${words}"`, steps: ['Turn each phrase into symbols, keeping the order of operations from the words.', `So the equation is ${right}.`] });
  }
  const fee = r.int(10, 40), per = r.int(5, 15), v = r.int(3, 15), tot = fee + per * v, who = r.pick(NAMES);
  return num(v, [St(`Let v be the number of visits: ${per}v + ${fee} = ${tot}.`, eqnLines([{ eq: `${per}v + ${fee} = ${tot}` }, { eq: `${per}v = ${tot - fee}`, note: `− ${fee}` }, { eq: `v = ${v}`, note: `÷ ${per}` }])), St(`Subtract ${fee}: ${per}v = ${tot - fee}. Divide by ${per}: v = ${v}.`), St(`So ${who} made ${v} visits.`)], { q: `A pool pass costs $${fee} plus $${per} per visit. ${who} paid $${tot} in all. How many visits did ${who} make?`, expr: `(${tot}-${fee})/${per}` });
});
skill('7-eqboth', 7, 'Equations', 'Multi-step equations', ['First combine like terms on each side.', 'If x is on both sides, move the x terms to one side, then solve as a two-step equation.'], (r) => {
  const t = r.int(0, 4), x = r.int(-9, 12);
  if (t === 0) {
    let a = r.int(2, 9), b = r.nonzero(-6, 6); while (a + b === 0) b = r.nonzero(-6, 6);
    const c = r.int(-15, 15), d = (a + b) * x + c;
    const L = [{ eq: `${ex([[a, 'x'], [b, 'x'], [c, '']])} = ${neg(d)}` }, { eq: `${ex([[a + b, 'x'], [c, '']])} = ${neg(d)}`, note: 'combine like terms' }, { eq: `${ex([[a + b, 'x']])} = ${neg(d - c)}`, note: c ? `${c > 0 ? '−' : '+'} ${Math.abs(c)}` : '' }, { eq: `x = ${neg(x)}` }];
    return num(x, [St(`Combine like terms: ${neg(a)}x ${sgn(b)}x = ${ex([[a + b, 'x']])}.`, eqnLines(L.slice(0, 2))), St(`Undo the ${sgn(c)}: ${ex([[a + b, 'x']])} = ${neg(d - c)}.`, eqnLines(L.slice(0, 3))), St(`Divide by ${neg(a + b)}: x = ${neg(x)}.`, eqnLines(L))], { q: `Solve: ${L[0].eq}`, unit: 'x =', expr: `(${d}-(${c}))/(${a + b})` });
  }
  if (t === 1) {
    const a = r.int(2, 9); let c = r.int(-5, 9); while (c === a || c === 0) c = r.int(-5, 9);
    const b = r.int(-15, 15), d = (a - c) * x + b;
    const L = [{ eq: `${ex([[a, 'x'], [b, '']])} = ${ex([[c, 'x'], [d, '']])}` }, { eq: `${ex([[a - c, 'x'], [b, '']])} = ${neg(d)}`, note: `${c > 0 ? '−' : '+'} ${ex([[Math.abs(c), 'x']])} on both sides` }, { eq: `${ex([[a - c, 'x']])} = ${neg(d - b)}` }, { eq: `x = ${neg(x)}` }];
    return num(x, [St(`Move the x terms to the left: ${c > 0 ? 'subtract' : 'add'} ${ex([[Math.abs(c), 'x']])} on both sides.`, eqnLines(L.slice(0, 2))), St(`Undo the ${sgn(b)}: ${ex([[a - c, 'x']])} = ${neg(d - b)}.`, eqnLines(L.slice(0, 3))), St(`Divide by ${a - c}: x = ${neg(x)}.`, eqnLines(L))], { q: `Solve: ${L[0].eq}`, unit: 'x =', expr: `(${d}-(${b}))/(${a - c})` });
  }
  if (t === 2) {
    const a = r.int(2, 9), b = r.int(1, 20), c = a * Math.abs(x) + b, minus = r.bool();
    const eq = minus ? `${a}x − ${b} = ${c - 2 * b}` : `${a}x + ${b} = ${c}`;
    return mc(r, minus ? `Add ${b} to both sides` : `Subtract ${b} from both sides`, [minus ? `Subtract ${b} from both sides` : `Add ${b} to both sides`, `Multiply both sides by ${a}`, `Subtract ${a} from both sides`], { q: `What is a good first step to solve ${eq}?`, steps: [`x is multiplied by ${a}, then ${b} is ${minus ? 'subtracted' : 'added'}. Undo the last thing first.`, `So: ${minus ? `add ${b} to` : `subtract ${b} from`} both sides.`] });
  }
  if (t === 3) {
    const [f, v, right, wrongs] = r.pick([['A = lw', 'w', 'w = A/l', ['w = A − l', 'w = Al', 'w = l/A']], ['d = rt', 'r', 'r = d/t', ['r = d − t', 'r = dt', 'r = t/d']], ['P = 2l + 2w', 'l', 'l = (P − 2w)/2', ['l = P − 2w', 'l = P/2 − 2w', 'l = (P + 2w)/2']], ['y = mx + b', 'b', 'b = y − mx', ['b = y + mx', 'b = mx − y', 'b = y/mx']], ['C = 2πr', 'r', 'r = C/(2π)', ['r = C − 2π', 'r = 2πC', 'r = C/π']]]);
    return mc(r, right, wrongs, { q: `Solve ${f} for ${v}.`, steps: [`Undo the operations around ${v}, doing the same to both sides.`, `${right}.`] });
  }
  const a = r.int(2, 6), b = r.int(-8, 8), c = a * (x + b);
  return num(x, [St(`Divide both sides by ${a}: x ${sgn(b)} = ${neg(x + b)}.`, eqnLines([{ eq: `${a}(x ${sgn(b)}) = ${neg(c)}` }, { eq: `x ${sgn(b)} = ${neg(x + b)}`, note: `÷ ${a}` }, { eq: `x = ${neg(x)}`, note: b >= 0 ? `− ${b}` : `+ ${-b}` }])), St(`Then undo the ${sgn(b)}: x = ${neg(x)}.`)], { q: `Solve: ${a}(x ${sgn(b)}) = ${neg(c)}`, unit: 'x =', expr: `${c}/${a}-(${b})` });
});

// ───────────── 23. One-variable inequalities ─────────────
const FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
const holds = (l, op, rr) => (op === '<' ? l < rr : op === '>' ? l > rr : op === '≤' ? l <= rr : l >= rr);
const graphWords = (op, c) => `${op === '<' || op === '>' ? 'open' : 'closed'} circle at ${neg(c)}, shaded to the ${op === '<' || op === '≤' ? 'left' : 'right'}`;
skill('7-ineqgraph', 7, 'Inequalities', 'Inequalities and their graphs', ['An inequality has many solutions: x > 3 means any number greater than 3.', 'On a number line: an open circle for < or >, a closed circle for ≤ or ≥, then shade the way the solutions go.'], (r) => {
  const t = r.int(0, 3), op = r.pick(['<', '>', '≤', '≥']);
  if (t === 0) {
    const a = r.nonzero(-5, 5), b = r.int(-10, 10), c = r.int(-15, 15), v = r.int(-6, 6), l = a * v + b, ok = holds(l, op, c);
    return mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], { q: `Is x = ${neg(v)} a solution of ${ex([[a, 'x'], [b, '']])} ${op} ${neg(c)}?`, steps: [`Put x = ${neg(v)} in: ${neg(a)} × ${par(v)} ${sgn(b)} = ${neg(l)}.`, `Is ${neg(l)} ${op} ${neg(c)}? ${ok ? 'Yes, so it is a solution.' : 'No, so it is not a solution.'}`] });
  }
  if (t === 1) {
    const c = r.int(-5, 5), left = op === '<' || op === '≤';
    return mc(r, `x ${op} ${neg(c)}`, ['<', '>', '≤', '≥'].filter((o) => o !== op).map((o) => `x ${o} ${neg(c)}`), { q: `A number line has ${graphWords(op, c).replace(/^(\w)/, 'an $1').replace('an closed', 'a closed')}. Which inequality does it show?`, visual: { type: 'numberline', from: c - 6, to: c + 6, step: 1, ray: { at: c, dir: left ? 'left' : 'right', open: op === '<' || op === '>' } }, steps: [`${op === '<' || op === '>' ? 'An open circle means the number itself is not included: < or >.' : 'A closed circle means the number itself is included: ≤ or ≥.'}`, `Shaded to the ${left ? 'left means less' : 'right means greater'}, so x ${op} ${neg(c)}.`] });
  }
  if (t === 2) {
    const a = r.nonzero(-9, 9), b = r.int(-10, 10), c = b - a;
    return mc(r, graphWords(op, c), [graphWords(FLIP[op], c), graphWords(op, b), graphWords(op, -c)], { q: `Which graph shows the solution of x ${sgn(a)} ${op} ${neg(b)}?`, steps: [`${a > 0 ? 'Subtract' : 'Add'} ${Math.abs(a)} on both sides: x ${op} ${neg(c)}.`, `So the graph is: ${graphWords(op, c)}.`] });
  }
  const who = r.pick(NAMES);
  if (r.bool()) { const B = r.int(30, 100), p = r.int(6, 20), n = Math.floor(B / p); return num(n, [`Let s be the number of shirts: ${p}s ≤ ${B}.`, `s ≤ ${B} ÷ ${p} ≈ ${dec(B / p, 2)}. Only whole shirts count.`, `So at most ${n} shirts.`], { q: `${who} has $${B}. T-shirts cost $${p} each. What is the greatest number of T-shirts ${who} can buy?`, expr: `Math.floor(${B}/${p})` }); }
  const need = r.int(50, 100), have = r.int(10, need - 10), each = r.int(4, 9), n = Math.ceil((need - have) / each);
  return num(n, [`Let t be the number of tasks: ${have} + ${each}t ≥ ${need}, so ${each}t ≥ ${need - have}.`, `t ≥ ${need - have} ÷ ${each} ≈ ${dec((need - have) / each, 2)}. Round up to a whole task.`, `So at least ${n} more tasks.`], { q: `${who} has ${have} points and needs at least ${need}. Each task earns ${each} points. What is the least number of tasks ${who} must do?`, expr: `Math.ceil((${need}-${have})/${each})` });
});
skill('7-ineqtwostep', 7, 'Inequalities', 'Two-step inequalities', ['Solve like a two-step equation: undo + or − first, then × or ÷.', 'If you multiply or divide both sides by a negative number, flip the inequality sign.'], (r) => {
  const t = r.int(0, 2), op = r.pick(['<', '>', '≤', '≥']), a = r.nonzero(-6, 6), b = r.int(-12, 12), c = r.int(-6, 8), rhs = a * c + b, fop = a < 0 ? FLIP[op] : op;
  const eq = `${ex([[a, 'x'], [b, '']])} ${op} ${neg(rhs)}`;
  const steps = [`${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: ${ex([[a, 'x']])} ${op} ${neg(rhs - b)}.`, `Divide both sides by ${neg(a)}${a < 0 ? ' and flip the sign, because it is negative' : ''}: x ${fop} ${neg(c)}.`];
  if (t === 0) return mc(r, `x ${fop} ${neg(c)}`, [`x ${FLIP[fop]} ${neg(c)}`, `x ${fop} ${neg(-c)}`, `x ${fop} ${neg(rhs)}`], { q: `Solve: ${eq}`, steps });
  if (t === 1) return mc(r, graphWords(fop, c), [graphWords(FLIP[fop], c), graphWords(fop, -c), graphWords(fop, rhs)], { q: `Which graph shows the solution of ${eq}?`, steps: [...steps, `So the graph is: ${graphWords(fop, c)}.`] });
  const fee = r.int(10, 25), per = r.pick([0.1, 0.2, 0.25, 0.5]), budget = fee + r.int(5, 20), n = Math.floor((budget - fee) / per + 1e-9);
  return num(n, [`Let m be the number of extra minutes: ${fee} + ${per}m ≤ ${budget}.`, `Subtract ${fee}: ${per}m ≤ ${budget - fee}. Divide by ${per}: m ≤ ${n}.`, `So at most ${n} minutes.`], { q: `A phone plan costs $${fee} a month plus $${per.toFixed(2)} for each extra minute. To spend no more than $${budget}, what is the greatest number of extra minutes?`, expr: `Math.floor((${budget}-${fee})/${per}+1e-9)` });
});

// ───────────── 24. Sequences ─────────────
skill('7-sequences', 7, 'Sequences', 'Arithmetic and geometric sequences', ['An arithmetic sequence adds the same number each time: 4, 7, 10, 13 (add 3).', 'A geometric sequence multiplies by the same number each time: 3, 6, 12, 24 (× 2).', 'For an arithmetic sequence, the nth term is (difference) × n + (first term − difference).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const f = r.int(-20, 20), d = r.nonzero(-9, 9), seq = [0, 1, 2, 3].map((i) => f + i * d);
    return num(f + 4 * d, [`Each term is ${d > 0 ? `${d} more` : `${-d} less`} than the one before: the difference is ${neg(d)}.`, `${neg(seq[3])} ${sgn(d)} = ${neg(f + 4 * d)}.`, `The next term is ${neg(f + 4 * d)}.`], { q: `What is the next term? ${seq.map(neg).join(', ')}, …`, expr: `${f}+4*(${d})` });
  }
  if (t === 1) {
    const [f, k] = r.pick([[r.int(1, 5), 2], [r.int(1, 4), 3], [r.int(1, 3), -2], [16 * r.int(1, 5), 0.5], [r.int(1, 9), 10]]), seq = [0, 1, 2, 3].map((i) => f * k ** i), nx = f * k ** 4;
    return num(nx, [`Each term is ${k === 0.5 ? 'half of' : `${neg(k)} times`} the one before.`, `${neg(seq[3])} × ${par(k)} = ${neg(nx)}.`, `The next term is ${neg(nx)}.`], { q: `What is the next term? ${seq.map(neg).join(', ')}, …`, expr: `${f}*(${k})**4` });
  }
  if (t === 2) {
    const kind = r.pick(['arithmetic', 'geometric', 'neither']), a = r.int(1, 6);
    const seq = kind === 'arithmetic' ? [0, 1, 2, 3, 4].map((i) => a + i * r.int(2, 2) * a) : kind === 'geometric' ? [0, 1, 2, 3, 4].map((i) => a * 3 ** i) : [0, 1, 2, 3, 4].map((i) => (i + a) ** 2);
    const why = kind === 'arithmetic' ? `It adds ${2 * a} each time, so it is arithmetic.` : kind === 'geometric' ? 'It multiplies by 3 each time, so it is geometric.' : 'The differences change and so do the ratios, so it is neither.';
    return mc(r, kind, ['arithmetic', 'geometric', 'neither'].filter((x) => x !== kind), { q: `Is this sequence arithmetic, geometric or neither? ${seq.join(', ')}, …`, steps: [`Differences: ${seq.slice(1).map((x, i) => x - seq[i]).join(', ')}.`, why] });
  }
  if (t === 3) {
    const f = r.int(-5, 15), d = r.nonzero(-6, 9), right = ex([[d, 'n'], [f - d, '']]);
    return mc(r, right, [ex([[f, 'n'], [d, '']]), ex([[d, 'n'], [f, '']]), `n ${sgn(d)}`], { q: `Which expression gives the nth term of ${[0, 1, 2, 3].map((i) => neg(f + i * d)).join(', ')}, …?`, steps: [`The difference is ${neg(d)}, so the expression starts ${ex([[d, 'n']])}.`, `For n = 1 we need ${neg(f)}: ${neg(d)} ${sgn(f - d)} = ${neg(f)}. So it is ${right}.`] });
  }
  if (r.bool()) {
    const f = r.int(10, 25), d = r.int(2, 5), k = r.int(8, 25), v = f + (k - 1) * d;
    return num(v, [`Row 1 has ${f} seats, and each row adds ${d}. Row ${k} is ${k - 1} rows after row 1.`, `${f} + ${k - 1} × ${d} = ${v}.`, `Row ${k} has ${v} seats.`], { q: `A theatre has ${f} seats in row 1, and each row has ${d} more seats than the row before. How many seats are in row ${k}?`, expr: `${f}+(${k}-1)*${d}` });
  }
  const a = r.int(2, 9), b = r.int(-9, 9), k = r.int(5, 30), v = a * k + b;
  return num(v, [`Put n = ${k} into ${ex([[a, 'n'], [b, '']])}.`, `${a} × ${k} ${sgn(b)} = ${v}.`, `Term ${k} is ${v}.`], { q: `The nth term of a sequence is ${ex([[a, 'n'], [b, '']])}. What is term number ${k}?`, expr: `${a}*${k}+(${b})` });
});

// ───────────── 25. Two-variable equations ─────────────
skill('7-twovar', 7, 'Two-variable equations', 'Equations with two variables', ['An equation like y = 3x + 2 links two variables. Each x gives one y.', 'The independent variable (x) is the one you choose; the dependent variable (y) depends on it.'], (r) => {
  const t = r.int(0, 3), m = r.nonzero(-5, 5), b = r.int(-9, 9), x = r.int(-5, 6);
  if (t === 0) {
    const yes = r.bool(), y = m * x + b + (yes ? 0 : r.nonzero(-3, 3));
    return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: `Is ${pt(x, y)} a solution of y = ${ex([[m, 'x'], [b, '']])}?`, steps: [`Put x = ${neg(x)} in: y = ${neg(m)} × ${par(x)} ${sgn(b)} = ${neg(m * x + b)}.`, yes ? `That matches y = ${neg(y)}, so yes.` : `But the point has y = ${neg(y)}, so no.`] });
  }
  if (t === 1) {
    const xs = [0, 1, 2, 3].map((i) => x + i), miss = r.int(0, 3);
    return num(m * xs[miss] + b, [`Put x = ${neg(xs[miss])} into y = ${ex([[m, 'x'], [b, '']])}.`, `y = ${neg(m)} × ${par(xs[miss])} ${sgn(b)} = ${neg(m * xs[miss] + b)}.`, `The missing value is ${neg(m * xs[miss] + b)}.`], { q: `Complete the table for y = ${ex([[m, 'x'], [b, '']])}. What is the missing y-value?`, visual: { type: 'table', head: ['x', 'y'], rows: xs.map((v, i) => [neg(v), i === miss ? '?' : neg(m * v + b)]) }, expr: `${m}*(${xs[miss]})+(${b})` });
  }
  if (t === 2) {
    const [story, dep, ind] = r.pick([['earns money for every hour worked', 'the money earned', 'the number of hours worked'], ['fills a pool with a hose', 'the amount of water in the pool', 'the time the hose runs'], ['buys bags of apples', 'the total cost', 'the number of bags bought'], ['drives at a steady speed', 'the distance travelled', 'the time spent driving']]), who = r.pick(NAMES), askDep = r.bool();
    return mc(r, askDep ? dep : ind, [askDep ? ind : dep], { q: `${who} ${story}. Which is the ${askDep ? 'dependent' : 'independent'} variable?`, steps: [`${dep[0].toUpperCase() + dep.slice(1)} depends on ${ind}.`, `So the ${askDep ? 'dependent' : 'independent'} variable is ${askDep ? dep : ind}.`] });
  }
  const base = r.int(30, 50) / 10, per = r.int(15, 25) / 10, d = r.int(2, 15), c = dec(base + per * d);
  return num(c, [`The equation is c = ${dec(base)} + ${dec(per)}d. Put d = ${d}.`, `c = ${dec(base)} + ${dec(per)} × ${d} = ${dec(base)} + ${dec(per * d)} = ${c}.`, `The ride costs $${Number(c).toFixed(2)}.`], { q: `A taxi charges $${base.toFixed(2)} plus $${per.toFixed(2)} per kilometre: c = ${dec(base)} + ${dec(per)}d. How much does ${an(d)} ${d} km ride cost, in dollars?`, unit: '$', expr: `${base}+${per}*${d}` });
});
skill('7-twovargraph', 7, 'Two-variable equations', 'Graphs of two-variable equations', ['The graph of y = mx + b is a straight line. Every point on it makes the equation true.', 'b is where the line crosses the y-axis; m is how much y changes when x goes up 1.'], (r) => {
  const t = r.int(0, 2), m = r.pick([-3, -2, -1, 1, 2, 3]), b = r.int(-4, 4), eq = `y = ${ex([[m, 'x'], [b, '']])}`;
  const wrongs = [`y = ${ex([[-m, 'x'], [b, '']])}`, `y = ${ex([[m, 'x'], [-b, '']])}`, `y = ${ex([[b || 2, 'x'], [m, '']])}`, `y = ${ex([[m + 1, 'x'], [b, '']])}`];
  if (t === 0) {
    const pts = [-2, -1, 0, 1, 2].map((x) => [x, m * x + b]).filter(([, y]) => Math.abs(y) <= 6).slice(0, 2);
    return mc(r, eq, wrongs, { q: 'Which equation does the graph show?', visual: { type: 'plane', lines: [[m, b]], points: pts }, steps: [`The line crosses the y-axis at ${neg(b)}, and y changes by ${neg(m)} each time x goes up 1.`, `So the equation is ${eq}.`] });
  }
  if (t === 1) {
    const xs = [0, 1, 2, 3];
    return mc(r, eq, wrongs, { q: 'Which equation matches the table?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x) => [x, neg(m * x + b)]) }, steps: [`When x = 0, y = ${neg(b)}. Each time x goes up 1, y changes by ${neg(m)}.`, `So ${eq}.`] });
  }
  const x = r.int(-4, 4), y = m * x + b;
  return mc(r, pt(x, y), [pt(x, y + 1), pt(x + 1, y), pt(x, -y || 1)], { q: `Which point is on the graph of ${eq}?`, steps: [`Put x = ${neg(x)} in: y = ${neg(m)} × ${par(x)} ${sgn(b)} = ${neg(y)}.`, `So ${pt(x, y)} is on the line.`] });
});

// ───────────── 26. Lines and angles ─────────────
skill('7-angles', 7, 'Lines and angles', 'Lines, rays and angles', ['Acute: less than 90°. Right: exactly 90°. Obtuse: between 90° and 180°. Straight: 180°.', 'A line goes on forever both ways; a ray has one endpoint; a segment has two.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const deg = r.pick([r.int(15, 80), 90, r.int(100, 170), 180]), kind = deg < 90 ? 'acute' : deg === 90 ? 'right' : deg < 180 ? 'obtuse' : 'straight';
    return mc(r, kind, ['acute', 'right', 'obtuse', 'straight'].filter((k) => k !== kind), { q: `This angle measures ${deg}°. What kind of angle is it?`, visual: { type: 'angle', deg, label: `${deg}°` }, steps: ['Compare with 90° (a square corner) and 180° (a straight line).', `${deg}° is ${kind === 'acute' ? 'less than 90°' : kind === 'right' ? 'exactly 90°' : kind === 'obtuse' ? 'between 90° and 180°' : 'exactly 180°'}, so it is ${kind}.`] });
  }
  if (t === 1) {
    const [q, right] = r.pick([['Which goes on forever in both directions?', 'a line'], ['Which has exactly one endpoint and goes on forever in one direction?', 'a ray'], ['Which has two endpoints?', 'a line segment'], ['Which names an exact location but has no length?', 'a point']]);
    return mc(r, right, ['a line', 'a ray', 'a line segment', 'a point'].filter((x) => x !== right), { q, steps: ['A line has no endpoints, a ray has one, a segment has two, and a point is just a location.', `So the answer is ${right}.`] });
  }
  if (t === 2) {
    const [q, right] = r.pick([['Two lines in a plane never meet, however far they go. They are…', 'parallel'], ['Two lines cross to make four right angles. They are…', 'perpendicular'], ['The two rails of a straight railway track are…', 'parallel'], ['The edges at the corner of a page, where the side meets the top, are…', 'perpendicular'], ['Two roads cross like the letter X, not at right angles. They are…', 'intersecting, but not perpendicular']]);
    return mc(r, right, ['parallel', 'perpendicular', 'intersecting, but not perpendicular'].filter((x) => x !== right), { q, steps: ['Parallel lines never meet. Perpendicular lines meet at 90°. Other crossing lines are just intersecting.', `So they are ${right}.`] });
  }
  if (r.bool()) { const k = r.pick([3, 4, 5, 6, 8, 9, 10, 12]); return num(360 / k, [`A full turn is 360°.`, `360 ÷ ${k} = ${360 / k}, so the angle is ${360 / k}°.`], { q: `An angle is 1/${k} of a full turn. How many degrees is it?`, unit: '°', expr: `360/${k}` }); }
  const k = r.pick([2, 3, 4, 5, 6, 9, 10]);
  return num(180 / k, ['A straight angle is 180°.', `180 ÷ ${k} = ${180 / k}, so the angle is ${180 / k}°.`], { q: `An angle is 1/${k} of a straight angle. How many degrees is it?`, unit: '°', expr: `180/${k}` });
});
skill('7-anglepairs', 7, 'Lines and angles', 'Angle pairs', ['Complementary angles add to 90°. Supplementary angles add to 180°.', 'When two lines cross, vertical (opposite) angles are equal, and angles next to each other add to 180°.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const sup = r.bool(), a = sup ? r.int(15, 165) : r.int(5, 85), T = sup ? 180 : 90;
    return num(T - a, [`${sup ? 'Supplementary' : 'Complementary'} angles add to ${T}°.`, `${T} − ${a} = ${T - a}, so the answer is ${T - a}°.`], { q: `What is the ${sup ? 'supplement' : 'complement'} of ${an(a)} ${a}° angle?`, unit: '°', expr: `${T}-${a}` });
  }
  if (t === 1) {
    const a = r.int(20, 160), vert = r.bool();
    return num(vert ? a : 180 - a, vert ? ['Vertical angles are opposite each other, and they are equal.', `So the vertical angle is ${a}°.`] : ['Angles next to each other on a straight line add to 180°.', `180 − ${a} = ${180 - a}, so the angle is ${180 - a}°.`], { q: `Two lines cross. One of the angles is ${a}°. What is the angle ${vert ? 'vertical (opposite) to it' : 'next to it, on the same straight line'}?`, unit: '°', expr: vert ? `${a}` : `180-${a}` });
  }
  if (t === 2) {
    const [q, right] = r.pick([['Two angles add up to 90°. They are…', 'complementary'], ['Two angles add up to 180°. They are…', 'supplementary'], ['When two lines cross, the angles opposite each other are…', 'vertical angles'], ['Two angles share a vertex and a side, but do not overlap. They are…', 'adjacent angles']]);
    return mc(r, right, ['complementary', 'supplementary', 'vertical angles', 'adjacent angles'].filter((x) => x !== right), { q, steps: ['Complementary: add to 90°. Supplementary: add to 180°. Vertical: opposite at a crossing. Adjacent: side by side.', `So they are ${right}.`] });
  }
  if (t === 3) {
    const kind = r.int(0, 2);
    if (kind === 0) { const a = 2 * r.int(10, 85); return num(a / 2, ['A bisector splits an angle into two equal angles.', `${a} ÷ 2 = ${a / 2}, so each angle is ${a / 2}°.`], { q: `Ray BD bisects ∠ABC, which measures ${a}°. What is the measure of ∠ABD?`, unit: '°', expr: `${a}/2` }); }
    const L = r.int(4, 40) / 2;
    if (kind === 1) return num(dec(L / 2), ['The midpoint splits a segment into two equal parts.', `${dec(L)} ÷ 2 = ${dec(L / 2)}, so AM = ${dec(L / 2)} cm.`], { q: `M is the midpoint of segment AB, and AB = ${dec(L)} cm. How long is AM?`, unit: 'cm', expr: `${L}/2` });
    return num(dec(L * 2), ['The midpoint splits a segment into two equal parts, so AB is twice AM.', `${dec(L)} × 2 = ${dec(2 * L)}, so AB = ${dec(2 * L)} cm.`], { q: `M is the midpoint of segment AB, and AM = ${dec(L)} cm. How long is AB?`, unit: 'cm', expr: `${L}*2` });
  }
  let a, b, c, d, x, T; do { T = r.pick([90, 180]); x = r.int(5, 30); a = r.int(1, 4); c = r.int(1, 4); b = r.int(-10, 30); d = T - (a + c) * x - b; } while (d < -20 || d > 60 || a * x + b <= 0 || c * x + d <= 0);
  return num(x, [St(`${T === 90 ? 'Complementary' : 'Supplementary'} angles add to ${T}°: (${ex([[a, 'x'], [b, '']])}) + (${ex([[c, 'x'], [d, '']])}) = ${T}.`), St(`Combine: ${ex([[a + c, 'x'], [b + d, '']])} = ${T}, so ${a + c}x = ${T - b - d}.`), St(`x = ${T - b - d} ÷ ${a + c} = ${x}.`)], { q: `Two angles measuring (${ex([[a, 'x'], [b, '']])})° and (${ex([[c, 'x'], [d, '']])})° are ${T === 90 ? 'complementary' : 'supplementary'}. What is x?`, unit: 'x =', expr: `(${T}-(${b})-(${d}))/${a + c}` });
});
skill('7-transversal', 7, 'Lines and angles', 'Parallel lines and transversals', ['A transversal is a line that crosses two parallel lines.', 'Corresponding, alternate interior and alternate exterior angles are equal. Co-interior (same-side interior) angles add to 180°.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const [q, right] = r.pick([['Two angles are in matching positions at the two crossing points. They are…', 'corresponding angles'], ['Two angles are between the parallel lines, on opposite sides of the transversal. They are…', 'alternate interior angles'], ['Two angles are outside the parallel lines, on opposite sides of the transversal. They are…', 'alternate exterior angles'], ['Two angles are between the parallel lines, on the same side of the transversal. They are…', 'co-interior angles']]);
    return mc(r, right, ['corresponding angles', 'alternate interior angles', 'alternate exterior angles', 'co-interior angles'].filter((x) => x !== right), { q, steps: ['Interior means between the parallel lines; exterior means outside them. Alternate means on opposite sides of the transversal.', `So they are ${right}.`] });
  }
  if (t === 1) {
    let a = r.int(35, 145); if (a === 90) a = 72;
    const [rel, eq] = r.pick([['corresponding', true], ['alternate interior', true], ['alternate exterior', true], ['co-interior (same-side interior)', false]]);
    return num(eq ? a : 180 - a, eq ? [`With parallel lines, ${rel} angles are equal.`, `So the angle is ${a}°.`] : ['With parallel lines, co-interior angles add to 180°.', `180 − ${a} = ${180 - a}, so the angle is ${180 - a}°.`], { q: `A transversal crosses two parallel lines. One angle is ${a}°. What is the ${rel} angle to it?`, unit: '°', expr: eq ? `${a}` : `180-${a}` });
  }
  let a, b, c, d, x; do { x = r.int(5, 25); a = r.int(2, 6); c = r.int(1, 5); b = r.int(-20, 40); d = a * x + b - c * x; } while (a === c || a * x + b < 30 || a * x + b > 150 || Math.abs(d) > 80);
  return num(x, [`Corresponding angles are equal: ${ex([[a, 'x'], [b, '']])} = ${ex([[c, 'x'], [d, '']])}.`, `${ex([[a - c, 'x']])} = ${neg(d - b)}, so x = ${neg(d - b)} ÷ ${a - c} = ${neg(x)}.`, `So x = ${neg(x)}.`], { q: `A transversal crosses two parallel lines. Two corresponding angles measure (${ex([[a, 'x'], [b, '']])})° and (${ex([[c, 'x'], [d, '']])})°. What is x?`, unit: 'x =', expr: `(${d}-(${b}))/(${a}-${c})` });
});

// ───────────── 27. Two-dimensional figures ─────────────
const POLYNAME = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
const regular = (n) => Array.from({ length: n }, (_, i) => { const a = Math.PI / 2 + (2 * Math.PI * i) / n; return [Number((5 + 4.5 * Math.cos(a)).toFixed(2)), Number((5 + 4.5 * Math.sin(a)).toFixed(2))]; });
skill('7-polygons', 7, 'Two-dimensional figures', 'Classify polygons, triangles and quadrilaterals', ['Polygons are named by their number of sides: pentagon 5, hexagon 6, octagon 8.', 'Triangles: equilateral (3 equal sides), isosceles (2), scalene (none). Acute, right or obtuse by the largest angle.', 'A trapezoid has exactly one pair of parallel sides.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const n = r.int(3, 10), right = POLYNAME[n];
    return mc(r, right, r.shuffle(Object.values(POLYNAME).filter((x) => x !== right)).slice(0, 3), { q: 'What is the name of this polygon?', visual: { type: 'poly', points: regular(n) }, steps: [`Count the sides: ${n}.`, `A polygon with ${n} sides is ${an(right)} ${right}.`] });
  }
  if (t === 1) {
    if (r.bool()) {
      const s = r.int(3, 12), kind = r.pick(['equilateral', 'isosceles', 'scalene']), sides = kind === 'equilateral' ? [s, s, s] : kind === 'isosceles' ? [s, s, s + r.int(1, 4)] : [s, s + 1, s + r.int(2, 4)];
      return mc(r, kind, ['equilateral', 'isosceles', 'scalene'].filter((k) => k !== kind), { q: `A triangle has sides ${r.shuffle(sides).join(' cm, ')} cm. Classify it by its sides.`, steps: [`Count the equal sides: ${kind === 'equilateral' ? 'all 3' : kind === 'isosceles' ? 'exactly 2' : 'none'}.`, `So it is ${kind}.`] });
    }
    const kind = r.pick(['acute', 'right', 'obtuse']), big = kind === 'acute' ? r.int(61, 85) : kind === 'right' ? 90 : r.int(95, 140), a = r.int(10, 180 - big - 10), angs = r.shuffle([big, a, 180 - big - a]);
    if (kind === 'acute' && Math.max(...angs) >= 90) return mc(r, 'acute', ['right', 'obtuse'], { q: 'A triangle has angles 60°, 60° and 60°. Classify it by its angles.', steps: ['All three angles are less than 90°.', 'So it is acute.'] });
    return mc(r, kind, ['acute', 'right', 'obtuse'].filter((k) => k !== kind), { q: `A triangle has angles ${angs.join('°, ')}°. Classify it by its angles.`, steps: [`The largest angle is ${Math.max(...angs)}°.`, `${kind === 'acute' ? 'All angles are less than 90°' : kind === 'right' ? 'One angle is exactly 90°' : 'One angle is more than 90°'}, so it is ${kind}.`] });
  }
  if (t === 2) {
    const [name, pts, why] = r.pick([['square', [[2, 2], [7, 2], [7, 7], [2, 7]], '4 equal sides and 4 right angles'], ['rectangle', [[1, 2], [9, 2], [9, 6], [1, 6]], '4 right angles, but the sides are not all equal'], ['parallelogram', [[1, 2], [6, 2], [8, 6], [3, 6]], '2 pairs of parallel sides, but no right angles'], ['rhombus', [[5, 1], [8, 5], [5, 9], [2, 5]], '4 equal sides, but no right angles'], ['trapezoid', [[1, 2], [9, 2], [7, 6], [3, 6]], 'exactly 1 pair of parallel sides'], ['kite', [[5, 1], [8, 6], [5, 8], [2, 6]], '2 pairs of equal sides next to each other, and no parallel sides']]);
    return mc(r, name, r.shuffle(['square', 'rectangle', 'parallelogram', 'rhombus', 'trapezoid', 'kite'].filter((x) => x !== name)).slice(0, 3), { q: 'What is the most specific name for this quadrilateral?', visual: { type: 'poly', points: pts, grid: true }, steps: [`Count grid squares to compare the sides and check the angles: it has ${why}.`, `So it is a ${name}.`] });
  }
  const [q, right] = r.pick([['Which quadrilateral has exactly one pair of parallel sides?', 'trapezoid'], ['Which quadrilateral has four equal sides and four right angles?', 'square'], ['Which quadrilateral has four right angles, with opposite sides equal but not all four equal?', 'rectangle'], ['Which quadrilateral has four equal sides but no right angles?', 'rhombus'], ['Which quadrilateral has two pairs of equal sides next to each other and no parallel sides?', 'kite']]);
  return mc(r, right, r.shuffle(['square', 'rectangle', 'rhombus', 'trapezoid', 'kite'].filter((x) => x !== right)).slice(0, 3), { q, steps: ['Check the sides, the parallel pairs and the angles one at a time.', `It is a ${right}.`] });
});
skill('7-polyangles', 7, 'Two-dimensional figures', 'Angles in polygons and circles', ['The angles in a triangle add to 180°; in a quadrilateral, 360°.', 'In any polygon with n sides, the angles add to (n − 2) × 180°.', 'A full circle around its centre is 360°.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const a = r.int(20, 100), b = r.int(20, 150 - a);
    return num(180 - a - b, ['The angles in a triangle add to 180°.', `180 − ${a} − ${b} = ${180 - a - b}, so the missing angle is ${180 - a - b}°.`], { q: `A triangle has angles of ${a}° and ${b}°. What is the third angle?`, unit: '°', expr: `180-${a}-${b}` });
  }
  if (t === 1) { const n = r.int(5, 12); return num((n - 2) * 180, [`A polygon with ${n} sides splits into ${n - 2} triangles from one corner.`, `(${n} − 2) × 180 = ${(n - 2) * 180}, so the sum is ${(n - 2) * 180}°.`], { q: `What is the sum of the interior angles of a polygon with ${n} sides?`, unit: '°', expr: `(${n}-2)*180` }); }
  if (t === 2) { const n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]); return num((n - 2) * 180 / n, [`The angles add to (${n} − 2) × 180 = ${(n - 2) * 180}°.`, `They are all equal: ${(n - 2) * 180} ÷ ${n} = ${(n - 2) * 180 / n}, so each is ${(n - 2) * 180 / n}°.`], { q: `What is the measure of each interior angle of a regular ${POLYNAME[n] ?? `${n}-sided polygon`}${n > 10 ? '' : ''}?`, unit: '°', expr: `(${n}-2)*180/${n}` }); }
  if (t === 3) {
    const a = r.int(60, 130), b = r.int(60, 130), c = r.int(50, 120), d = 360 - a - b - c;
    if (d <= 20 || d >= 180) return num(90, ['The angles in a quadrilateral add to 360°.', '360 − 90 − 90 − 90 = 90, so the missing angle is 90°.'], { q: 'A quadrilateral has angles of 90°, 90° and 90°. What is the fourth angle?', unit: '°', expr: '360-270' });
    return num(d, ['The angles in a quadrilateral add to 360°.', `360 − ${a} − ${b} − ${c} = ${d}, so the missing angle is ${d}°.`], { q: `A quadrilateral has angles of ${a}°, ${b}° and ${c}°. What is the fourth angle?`, unit: '°', expr: `360-${a}-${b}-${c}` });
  }
  if (r.bool()) { const n = r.pick([3, 4, 5, 6, 8, 9, 10, 12]); return num(360 / n, ['All the central angles together make a full turn: 360°.', `360 ÷ ${n} = ${360 / n}, so each central angle is ${360 / n}°.`], { q: `A circle is cut into ${n} equal slices from its centre. What is the central angle of each slice?`, unit: '°', expr: `360/${n}` }); }
  const [q, right] = r.pick([['A segment from the centre of a circle to its edge is a…', 'radius'], ['A segment through the centre, with both ends on the circle, is a…', 'diameter'], ['A segment with both ends on the circle that does not have to pass through the centre is a…', 'chord'], ['Part of the circle itself, between two points on it, is an…', 'arc']]);
  return mc(r, right, ['radius', 'diameter', 'chord', 'arc'].filter((x) => x !== right), { q, steps: ['Radius: centre to edge. Diameter: edge to edge through the centre. Chord: any edge to edge. Arc: a piece of the curve.', `So it is the ${right}.`] });
});

// ───────────── 28. Constructions ─────────────
skill('7-construct', 7, 'Constructions', 'Geometric constructions', ['Constructions use only a compass and a straightedge (a ruler without using its marks).', 'Arcs of equal radius find points that are the same distance from two places.'], (r) => {
  const t = r.int(0, 9);
  if (t === 9) { const a = 2 * r.int(15, 85); return mc(r, `${a / 2}°`, [`${a}°`, `${2 * a}°`, `${180 - a}°`], { q: `You construct the bisector of ${an(a)} ${a}° angle. What does each of the two new angles measure?`, steps: ['A bisector splits the angle into two equal parts.', `${a} ÷ 2 = ${a / 2}, so each is ${a / 2}°.`] }); }
  const [q, right, wrongs, why] = [
    ['To construct the perpendicular bisector of segment AB, you draw arcs of the same radius centred at…', 'both A and B', ['only A', 'the midpoint, which you measure first', 'any point on AB'], 'Points the same distance from A and B lie on the perpendicular bisector.'],
    ['For a perpendicular bisector of AB, the compass must be opened to…', 'more than half the length of AB', ['less than half the length of AB', 'exactly 1 cm', 'any width at all'], 'If the radius is too small, the arcs from A and B will not cross.'],
    ['An angle bisector divides an angle into…', 'two equal angles', ['two right angles', 'two supplementary angles', 'three equal angles'], 'To bisect means to cut into two equal parts.'],
    ['To draw a regular hexagon inside a circle, you step around the circle with the compass set to…', 'the radius of the circle', ['the diameter of the circle', 'half the radius', 'any width'], 'A regular hexagon is made of 6 equilateral triangles, so each side equals the radius.'],
    ['Classic constructions use only…', 'a compass and a straightedge', ['a protractor and a marked ruler', 'a calculator', 'a set square'], 'Constructions do not measure; they copy distances with a compass.'],
    ['To construct an equilateral triangle on segment AB, the compass is set to…', 'the length of AB', ['half of AB', 'twice AB', 'any length'], 'All three sides must equal AB, so both arcs use radius AB.'],
    ['To copy an angle, after one arc crosses both arms, you use the compass to copy…', 'the distance between the two crossing points', ['the length of one arm', 'the angle in degrees', 'the distance to the vertex only'], 'That distance fixes how wide the angle opens.'],
    ['One way to construct a line through P parallel to line ℓ is to copy…', 'a corresponding angle at P', ['the length of ℓ', 'a circle through P', 'the midpoint of ℓ'], 'Equal corresponding angles make the lines parallel.'],
    ['The perpendicular bisector of AB crosses AB…', 'at its midpoint, at a right angle', ['at A, at a right angle', 'at its midpoint, at 45°', 'nowhere'], 'Bisector means it halves AB; perpendicular means it meets at 90°.'],
  ][t];
  return mc(r, right, wrongs, { q, steps: [why, `So the answer is: ${right}.`] });
});

// ───────────── 29. Three-dimensional figures ─────────────
skill('7-solids', 7, 'Three-dimensional figures', 'Three-dimensional figures', ['A prism has 2 matching bases joined by rectangles. A pyramid has 1 base and triangles meeting at a point.', 'A net is a flat shape that folds up into a solid.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const [solid, right, wrongs] = r.pick([['triangular prism', '2 triangles', ['1 triangle', '3 rectangles', '2 rectangles']], ['rectangular prism', '2 rectangles', ['1 rectangle', '4 rectangles', '2 triangles']], ['cylinder', '2 circles', ['1 circle', '2 rectangles', '1 rectangle']], ['cone', '1 circle', ['2 circles', '1 triangle', '2 triangles']], ['square pyramid', '1 square', ['2 squares', '4 triangles', '1 triangle']], ['pentagonal prism', '2 pentagons', ['1 pentagon', '5 rectangles', '2 rectangles']], ['hexagonal pyramid', '1 hexagon', ['2 hexagons', '6 triangles', '1 triangle']]]);
    return mc(r, right, wrongs, { q: `How many bases does a ${solid} have, and what shape are they?`, steps: [solid.includes('prism') || solid === 'cylinder' ? 'Prisms and cylinders have 2 matching bases.' : 'Pyramids and cones have 1 base.', `A ${solid} has ${right}.`] });
  }
  if (t === 1) {
    const [net, right] = r.pick([['6 squares', 'cube'], ['2 circles and a rectangle', 'cylinder'], ['1 square and 4 triangles', 'square pyramid'], ['2 triangles and 3 rectangles', 'triangular prism'], ['a circle and a curved fan shape', 'cone'], ['6 rectangles, in 3 matching pairs', 'rectangular prism']]);
    return mc(r, right, r.shuffle(['cube', 'cylinder', 'square pyramid', 'triangular prism', 'cone', 'rectangular prism'].filter((x) => x !== right)).slice(0, 3), { q: `A net is made of ${net}. What solid does it fold into?`, steps: ['The faces of the net become the faces of the solid.', `${net[0].toUpperCase() + net.slice(1)} fold into a ${right}.`] });
  }
  if (t === 2) {
    const n = r.int(3, 8), prism = r.bool(), [what, v] = r.pick(prism ? [['faces', n + 2], ['edges', 3 * n], ['vertices', 2 * n]] : [['faces', n + 1], ['edges', 2 * n], ['vertices', n + 1]]), base = { 3: 'triangular', 4: 'rectangular', 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octagonal' }[n];
    const why = prism ? { faces: `2 bases + ${n} rectangles = ${n + 2}`, edges: `${n} on each base + ${n} joining them = ${3 * n}`, vertices: `${n} on each base × 2 = ${2 * n}` }[what] : { faces: `1 base + ${n} triangles = ${n + 1}`, edges: `${n} around the base + ${n} up to the top = ${2 * n}`, vertices: `${n} on the base + 1 at the top = ${n + 1}` }[what];
    return num(v, [`The base has ${n} sides.`, `${why}, so the answer is ${v}.`], { q: `How many ${what} does ${/^[aeiou]/.test(base) ? 'an' : 'a'} ${base} ${prism ? 'prism' : 'pyramid'} have?`, expr: String(v) });
  }
  const [q, right] = r.pick([['A cylinder stands on its base. What shape is its top view?', 'circle'], ['A cylinder stands on its base. What shape is its front view?', 'rectangle'], ['A cone stands on its base. What shape is its front view?', 'triangle'], ['A square pyramid sits on its base. What shape is the outline of its top view?', 'square'], ['A cube sits on a table. What shape is its side view?', 'square'], ['A sphere sits on a table. What shape is its front view?', 'circle']]);
  return mc(r, right, ['circle', 'rectangle', 'triangle', 'square'].filter((x) => x !== right), { q, steps: ['Imagine looking straight at the solid from that side and tracing its outline.', `You see a ${right}.`] });
});

// ───────────── 30. Perimeter and area ─────────────
const PI_TOL = { tol: 0.01 };
skill('7-area', 7, 'Perimeter and area', 'Area of polygons', ['Rectangle and parallelogram: A = base × height. Triangle: A = base × height ÷ 2.', 'Trapezoid: A = (a + b) ÷ 2 × height, where a and b are the parallel sides.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const b = r.int(3, 20), h = r.int(2, 15), para = r.bool();
    return num(b * h, [`${para ? 'A parallelogram has the same area as a rectangle with the same base and height' : 'Area of a rectangle = length × width'}.`, `${b} × ${h} = ${b * h}, so the area is ${b * h} cm².`], { q: para ? `A parallelogram has base ${b} cm and height ${h} cm. What is its area in cm²?` : 'What is the area of this rectangle, in cm²?', visual: para ? { type: 'poly', points: [[1, 2], [7, 2], [9, 7], [3, 7]], labels: [`${b} cm`, '', '', ''] } : { type: 'poly', points: [[1, 2], [9, 2], [9, 7], [1, 7]], labels: [`${b} cm`, `${h} cm`, '', ''] }, unit: 'cm²', expr: `${b}*${h}` });
  }
  if (t === 1) {
    const b = r.int(3, 24), h = r.int(2, 18);
    return num(dec(b * h / 2), [`A = base × height ÷ 2 = ${b} × ${h} ÷ 2.`, `${b * h} ÷ 2 = ${dec(b * h / 2)}, so the area is ${dec(b * h / 2)} m².`], { q: `A triangle has base ${b} m and height ${h} m. What is its area in m²?`, visual: { type: 'poly', points: [[1, 2], [9, 2], [4, 8]], labels: [`${b} m`, '', ''] }, unit: 'm²', expr: `${b}*${h}/2` });
  }
  if (t === 2) {
    const a = r.int(3, 12), b = a + r.int(2, 10), h = r.int(2, 12);
    return num(dec((a + b) * h / 2), [`A = (a + b) ÷ 2 × h = (${a} + ${b}) ÷ 2 × ${h}.`, `${a + b} ÷ 2 = ${dec((a + b) / 2)}, and × ${h} = ${dec((a + b) * h / 2)}.`, `The area is ${dec((a + b) * h / 2)} cm².`], { q: `A trapezoid has parallel sides ${a} cm and ${b} cm, and height ${h} cm. What is its area in cm²?`, visual: { type: 'poly', points: [[1, 2], [9, 2], [7, 7], [3, 7]], labels: [`${b} cm`, '', `${a} cm`, ''] }, unit: 'cm²', expr: `(${a}+${b})/2*${h}` });
  }
  if (t === 3) {
    const [p, q] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), [s, u] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), w1 = r.int(1, 5), w2 = r.int(1, 5), n1 = w1 * q + p, n2 = w2 * u + s;
    return num(frac(n1 * n2, q * u), [`Improper fractions: ${w1} ${p}/${q} = ${n1}/${q} and ${w2} ${s}/${u} = ${n2}/${u}.`, `${n1}/${q} × ${n2}/${u} = ${n1 * n2}/${q * u}.`, `That is ${mixed(n1 * n2, q * u)} m², or ${F(n1 * n2, q * u)} m².`], { q: `A rectangular rug is ${w1} ${p}/${q} m long and ${w2} ${s}/${u} m wide. What is its area in m²?`, unit: 'm²', expr: `${n1}/${q}*${n2}/${u}` });
  }
  const L = r.int(5, 25), W = r.int(3, 15), c = r.pick([4, 5, 8, 12, 15]);
  return num(2 * (L + W) * c, [`Perimeter = 2 × (${L} + ${W}) = ${2 * (L + W)} m.`, `Cost = ${2 * (L + W)} × $${c} = $${2 * (L + W) * c}.`, `The fence costs $${2 * (L + W) * c}.`], { q: `A rectangular garden is ${L} m by ${W} m. Fencing costs $${c} per metre. How much does it cost to fence the whole garden, in dollars?`, unit: '$', expr: `2*(${L}+${W})*${c}` });
});
skill('7-circleparts', 7, 'Perimeter and area', 'Parts of circles', ['Use π ≈ 3.14. Circumference = π × diameter. Area = π × r².', 'A sector or arc is a fraction of the circle: its angle out of 360°.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const d = 2 * r.int(2, 10), R = d / 2, area = r.bool(), v = area ? 3.14 * R * R / 2 : 3.14 * d / 2 + d;
    return num(dec(v, 2), area ? [`A semicircle is half a circle. The radius is ${d} ÷ 2 = ${R}.`, `3.14 × ${R}^2 ÷ 2 = 3.14 × ${R * R} ÷ 2 = ${dec(v, 2)}.`, `The area is ${dec(v, 2)} cm².`] : [`The curved part is half the circumference: 3.14 × ${d} ÷ 2 = ${dec(3.14 * d / 2, 2)}.`, `Add the straight side (the diameter): ${dec(3.14 * d / 2, 2)} + ${d} = ${dec(v, 2)}.`, `The perimeter is ${dec(v, 2)} cm.`], { q: `A semicircle has a diameter of ${d} cm. Using π ≈ 3.14, what is its ${area ? 'area, in cm²' : 'perimeter, in cm'}?`, ...PI_TOL, expr: area ? `3.14*${R}*${R}/2` : `3.14*${d}/2+${d}` });
  }
  if (t === 1) {
    const R = r.int(2, 12), area = r.bool(), v = area ? 3.14 * R * R / 4 : 3.14 * 2 * R / 4 + 2 * R;
    return num(dec(v, 2), area ? [`A quarter circle is 1/4 of a circle.`, `3.14 × ${R}^2 ÷ 4 = 3.14 × ${R * R} ÷ 4 = ${dec(v, 2)}.`, `The area is ${dec(v, 2)} cm².`] : [`The curved part is 1/4 of the circumference: 3.14 × ${2 * R} ÷ 4 = ${dec(3.14 * 2 * R / 4, 2)}.`, `Add the two radii: ${dec(3.14 * 2 * R / 4, 2)} + ${R} + ${R} = ${dec(v, 2)}.`, `The perimeter is ${dec(v, 2)} cm.`], { q: `A quarter circle has a radius of ${R} cm. Using π ≈ 3.14, what is its ${area ? 'area, in cm²' : 'perimeter, in cm'}?`, ...PI_TOL, expr: area ? `3.14*${R}*${R}/4` : `3.14*2*${R}/4+2*${R}` });
  }
  const R = r.int(2, 12), th = r.pick([30, 45, 60, 90, 120, 135, 150, 270]);
  if (t === 2) { const v = th / 360 * 3.14 * R * R; return num(dec(v, 2), [`The sector is ${th}/360 = ${F(th, 360)} of the circle.`, `${F(th, 360)} × 3.14 × ${R * R} = ${dec(v, 2)}.`, `The area is ${dec(v, 2)} cm².`], { q: `A sector of a circle has radius ${R} cm and a central angle of ${th}°. Using π ≈ 3.14, what is its area, in cm²?`, visual: { type: 'angle', deg: th, label: `${th}°` }, ...PI_TOL, expr: `${th}/360*3.14*${R}*${R}` }); }
  if (t === 3) { const v = th / 360 * 2 * 3.14 * R; return num(dec(v, 2), [`The arc is ${th}/360 = ${F(th, 360)} of the circumference.`, `Circumference = 2 × 3.14 × ${R} = ${dec(6.28 * R, 2)}. × ${F(th, 360)} = ${dec(v, 2)}.`, `The arc is ${dec(v, 2)} cm long.`], { q: `An arc of a circle with radius ${R} cm has a central angle of ${th}°. Using π ≈ 3.14, how long is the arc, in cm?`, ...PI_TOL, expr: `${th}/360*2*3.14*${R}` }); }
  if (r.bool()) { const d = r.int(2, 30), C = dec(3.14 * d, 2); return num(d, ['C = π × d, so d = C ÷ π.', `${C} ÷ 3.14 = ${d}, so the diameter is ${d} cm.`], { q: `A circle has a circumference of ${C} cm. Using π ≈ 3.14, what is its diameter, in cm?`, ...PI_TOL, expr: `${C}/3.14` }); }
  const d = r.int(50, 70), n = 10 * r.int(1, 5), v = 3.14 * d * n / 100;
  return num(dec(v, 2), [`One turn moves the bike one circumference: 3.14 × ${d} = ${dec(3.14 * d, 2)} cm.`, `${n} turns: ${dec(3.14 * d, 2)} × ${n} = ${dec(3.14 * d * n, 2)} cm = ${dec(v, 2)} m.`, `The bike travels ${dec(v, 2)} m.`], { q: `A bike wheel has a diameter of ${d} cm. How many metres does the bike travel when the wheel turns ${n} times? Use π ≈ 3.14.`, ...PI_TOL, expr: `3.14*${d}*${n}/100` });
});
skill('7-compoundarea', 7, 'Perimeter and area', 'Compound figures and scale', ['Split a compound figure into shapes you know, find each area, then add (or subtract the gap).', 'If every length is multiplied by k, the perimeter is multiplied by k and the area by k^2.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const L = r.int(6, 20), W = 2 * r.int(2, 6), R = W / 2, v = L * W + 3.14 * R * R / 2;
    return num(dec(v, 2), [`Rectangle: ${L} × ${W} = ${L * W} m².`, `Semicircle with radius ${R}: 3.14 × ${R * R} ÷ 2 = ${dec(3.14 * R * R / 2, 2)} m².`, `Total: ${L * W} + ${dec(3.14 * R * R / 2, 2)} = ${dec(v, 2)} m².`], { q: `A rink is made of a rectangle, ${L} m by ${W} m, with a semicircle on one ${W} m end. Using π ≈ 3.14, what is its area in m²?`, ...PI_TOL, expr: `${L}*${W}+3.14*${R}**2/2` });
  }
  if (t === 1) {
    const L = r.int(4, 16), H = r.int(3, 10), T = r.int(2, 8), v = L * H + L * T / 2;
    return num(dec(v), [`Rectangle: ${L} × ${H} = ${L * H} m².`, `Triangle roof: ${L} × ${T} ÷ 2 = ${dec(L * T / 2)} m².`, `Total: ${L * H} + ${dec(L * T / 2)} = ${dec(v)} m².`], { q: `The front of a shed is ${an(L)} ${L} m wide, ${H} m tall rectangle with a triangle roof on top that is ${T} m tall. What is the area of the front, in m²?`, visual: { type: 'poly', points: [[1, 1], [9, 1], [9, 5], [5, 8], [1, 5]], labels: [`${L} m`, `${H} m`, '', '', ''] }, unit: 'm²', expr: `${L}*${H}+${L}*${T}/2` });
  }
  if (t === 2) {
    if (r.bool()) { const s = 2 * r.int(2, 10), v = s * s - 3.14 * (s / 2) ** 2; return num(dec(v, 2), [`Square: ${s} × ${s} = ${s * s} cm².`, `Circle with radius ${s / 2}: 3.14 × ${(s / 2) ** 2} = ${dec(3.14 * (s / 2) ** 2, 2)} cm².`, `Area between: ${s * s} − ${dec(3.14 * (s / 2) ** 2, 2)} = ${dec(v, 2)} cm².`], { q: `A circle fits exactly inside a square with sides ${s} cm. Using π ≈ 3.14, what is the area inside the square but outside the circle, in cm²?`, ...PI_TOL, expr: `${s}**2-3.14*(${s}/2)**2` }); }
    const L = r.int(8, 20), W = r.int(6, 14), p = r.int(1, 2), v = L * W - (L - 2 * p) * (W - 2 * p);
    return num(v, [`Whole rectangle: ${L} × ${W} = ${L * W} m².`, `Inner lawn: ${L - 2 * p} × ${W - 2 * p} = ${(L - 2 * p) * (W - 2 * p)} m².`, `Path: ${L * W} − ${(L - 2 * p) * (W - 2 * p)} = ${v} m².`], { q: `A yard that is ${L} m by ${W} m has a path ${p} m wide all around the inside edge, with lawn in the middle. What is the area of the path, in m²?`, unit: 'm²', expr: `${L}*${W}-(${L}-${2 * p})*(${W}-${2 * p})` });
  }
  const k = r.int(2, 5), a = r.int(2, 9), b = r.int(2, 9), [ask, v, why] = r.pick([['perimeter', 2 * (a + b) * k, `The perimeter was ${2 * (a + b)} cm; it is multiplied by ${k}`], ['area', a * b * k * k, `The area was ${a * b} cm²; it is multiplied by ${k}^2 = ${k * k}`]]);
  return num(v, [`${why}.`, `So the new ${ask} is ${v} ${ask === 'area' ? 'cm²' : 'cm'}.`], { q: `A rectangle that is ${a} cm by ${b} cm is enlarged so every length is ${k} times as long. What is the new ${ask}${ask === 'area' ? ' in cm²' : ' in cm'}?`, expr: ask === 'area' ? `${a * k}*${b * k}` : `2*(${a * k}+${b * k})` });
});

// ───────────── 31. Surface area and volume ─────────────
skill('7-volume', 7, 'Surface area and volume', 'Volume of prisms and cylinders', ['For any prism or cylinder: volume = area of the base × height.', 'Rectangular prism: V = l × w × h. Cylinder: V = π × r^2 × h.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const l = r.int(2, 15), w = r.int(2, 12), h = r.int(2, 10) + r.pick([0, 0.5]); return num(dec(l * w * h), [`V = l × w × h = ${l} × ${w} × ${dec(h)}.`, `${l * w} × ${dec(h)} = ${dec(l * w * h)}, so the volume is ${dec(l * w * h)} cm³.`], { q: `A box is ${l} cm long, ${w} cm wide and ${dec(h)} cm high. What is its volume, in cm³?`, unit: 'cm³', expr: `${l}*${w}*${h}` }); }
  if (t === 1) { const b = r.int(2, 12), h = r.int(2, 10), L = r.int(3, 20), B = b * h / 2; return num(dec(B * L), [`The base is a triangle: ${b} × ${h} ÷ 2 = ${dec(B)} cm².`, `V = base area × length = ${dec(B)} × ${L} = ${dec(B * L)}.`, `The volume is ${dec(B * L)} cm³.`], { q: `A triangular prism has a triangle base with base ${b} cm and height ${h} cm. The prism is ${L} cm long. What is its volume, in cm³?`, unit: 'cm³', expr: `${b}*${h}/2*${L}` }); }
  if (t === 2) { const R = r.int(1, 10), h = r.int(2, 20), v = 3.14 * R * R * h; return num(dec(v, 2), [`Base area = 3.14 × ${R}^2 = ${dec(3.14 * R * R, 2)} cm².`, `V = ${dec(3.14 * R * R, 2)} × ${h} = ${dec(v, 2)}.`, `The volume is ${dec(v, 2)} cm³.`], { q: `A cylinder has radius ${R} cm and height ${h} cm. Using π ≈ 3.14, what is its volume, in cm³?`, ...PI_TOL, expr: `3.14*${R}**2*${h}` }); }
  if (r.bool()) { const B = r.int(10, 80), h = r.int(2, 15); return num(h, ['V = base area × height, so height = V ÷ base area.', `${B * h} ÷ ${B} = ${h}, so the height is ${h} cm.`], { q: `A prism has a base area of ${B} cm² and a volume of ${B * h} cm³. What is its height, in cm?`, unit: 'cm', expr: `${B * h}/${B}` }); }
  const B = 100 * r.int(5, 30), h = r.int(10, 40), V = B * h;
  return num(dec(V / 1000), [`Volume of water = ${comma(B)} × ${h} = ${comma(V)} cm³, which is ${comma(V)} mL.`, `${comma(V)} mL ÷ 1000 = ${dec(V / 1000)} L.`, `The tank holds ${dec(V / 1000)} L of water.`], { q: `A fish tank has a base area of ${comma(B)} cm². The water is ${h} cm deep. How many litres of water are in it?`, unit: 'L', expr: `${B}*${h}/1000` });
});
skill('7-surface', 7, 'Surface area and volume', 'Surface area', ['Surface area is the total area of all the faces. A net helps you see every face.', 'Cylinder: two circles plus a rectangle that wraps around: 2 × π × r^2 + 2 × π × r × h.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const l = r.int(2, 15), w = r.int(2, 12), h = r.int(2, 10), v = 2 * (l * w + l * h + w * h); return num(v, [`The faces come in 3 pairs: ${l} × ${w} = ${l * w}, ${l} × ${h} = ${l * h}, ${w} × ${h} = ${w * h}.`, `2 × (${l * w} + ${l * h} + ${w * h}) = ${v}.`, `The surface area is ${v} cm².`], { q: `What is the surface area of a box ${l} cm long, ${w} cm wide and ${h} cm high, in cm²?`, unit: 'cm²', expr: `2*(${l}*${w}+${l}*${h}+${w}*${h})` }); }
  if (t === 1) { const s = r.int(2, 15); return num(6 * s * s, [`A cube has 6 equal square faces, each ${s} × ${s} = ${s * s} cm².`, `6 × ${s * s} = ${6 * s * s}, so the surface area is ${6 * s * s} cm².`], { q: `A cube has edges of ${s} cm. What is its surface area, in cm²?`, unit: 'cm²', expr: `6*${s}**2` }); }
  if (t === 2) { const R = r.int(1, 10), h = r.int(2, 20), v = 2 * 3.14 * R * R + 2 * 3.14 * R * h; return num(dec(v, 2), [`Two circles: 2 × 3.14 × ${R}^2 = ${dec(2 * 3.14 * R * R, 2)} cm².`, `The curved side: 2 × 3.14 × ${R} × ${h} = ${dec(2 * 3.14 * R * h, 2)} cm².`, `Total: ${dec(2 * 3.14 * R * R, 2)} + ${dec(2 * 3.14 * R * h, 2)} = ${dec(v, 2)} cm².`], { q: `A cylinder has radius ${R} cm and height ${h} cm. Using π ≈ 3.14, what is its surface area, in cm²?`, ...PI_TOL, expr: `2*3.14*${R}**2+2*3.14*${R}*${h}` }); }
  const s = r.int(3, 14), sl = r.int(s, 20), v = s * s + 2 * s * sl;
  return num(v, [`Square base: ${s} × ${s} = ${s * s} cm².`, `4 triangles: 4 × (${s} × ${sl} ÷ 2) = ${2 * s * sl} cm².`, `Total: ${s * s} + ${2 * s * sl} = ${v} cm².`], { q: `A square pyramid has a base ${s} cm on each side. Each triangle face has a height (slant height) of ${sl} cm. What is its surface area, in cm²?`, unit: 'cm²', expr: `${s}**2+4*${s}*${sl}/2` });
});

// ───────────── 32. Transformations and congruence ─────────────
skill('7-transform', 7, 'Transformations', 'Translations, reflections and rotations', ['A translation slides a figure. A reflection flips it over a line. A rotation turns it about a point.', 'Reflect in the x-axis: (x, y) → (x, −y). In the y-axis: (x, y) → (−x, y). Rotate 180°: (x, y) → (−x, −y).'], (r) => {
  const t = r.int(0, 3), x = r.nonzero(-5, 5), y = r.nonzero(-5, 5);
  if (t === 0) {
    const a = r.nonzero(-3, 3), b = r.nonzero(-3, 3), h = r.nonzero(-3, 3), v = r.nonzero(-3, 3);
    return mc(r, pt(a + h, b + v), [pt(a - h, b - v), pt(a + v, b + h), pt(a + h, b - v)], { q: `Point A ${pt(a, b)} is translated ${Math.abs(h)} unit${Math.abs(h) > 1 ? 's' : ''} ${h > 0 ? 'right' : 'left'} and ${Math.abs(v)} unit${Math.abs(v) > 1 ? 's' : ''} ${v > 0 ? 'up' : 'down'}. Where is A′?`, visual: { type: 'plane', points: [[a, b, 'A']] }, steps: [`x: ${neg(a)} ${h > 0 ? '+' : '−'} ${Math.abs(h)} = ${neg(a + h)}. y: ${neg(b)} ${v > 0 ? '+' : '−'} ${Math.abs(v)} = ${neg(b + v)}.`, `So A′ is ${pt(a + h, b + v)}.`] });
  }
  if (t === 1) {
    const inX = r.bool(), img = inX ? pt(x, -y) : pt(-x, y);
    return mc(r, img, [inX ? pt(-x, y) : pt(x, -y), pt(-x, -y), pt(y, x)], { q: `Point A ${pt(x, y)} is reflected in the ${inX ? 'x' : 'y'}-axis. Where is A′?`, visual: { type: 'plane', points: [[x, y, 'A']] }, steps: [inX ? 'Reflecting in the x-axis keeps x and changes the sign of y.' : 'Reflecting in the y-axis changes the sign of x and keeps y.', `So A′ is ${img}.`] });
  }
  if (t === 2) {
    const [name, img, rule] = r.pick([['90° clockwise', pt(y, -x), '(x, y) → (y, −x)'], ['90° counterclockwise', pt(-y, x), '(x, y) → (−y, x)'], ['180°', pt(-x, -y), '(x, y) → (−x, −y)']]);
    return mc(r, img, [pt(y, -x), pt(-y, x), pt(-x, -y), pt(x, -y)].filter((p) => p !== img), { q: `Point A ${pt(x, y)} is rotated ${name} about the origin. Where is A′?`, visual: { type: 'plane', points: [[x, y, 'A']] }, steps: [`The rule for ${an(name)} ${name} rotation is ${rule}.`, `So A′ is ${img}.`] });
  }
  const a = r.int(-3, 3), b = r.int(-3, 3), h = r.nonzero(-3, 3), v = r.nonzero(-3, 3), desc = (H, V) => `${Math.abs(H)} ${H > 0 ? 'right' : 'left'} and ${Math.abs(V)} ${V > 0 ? 'up' : 'down'}`;
  return mc(r, desc(h, v), [desc(-h, -v), desc(v, h), desc(h, -v)], { q: `A ${pt(a, b)} is translated to A′ ${pt(a + h, b + v)}. Describe the translation.`, visual: { type: 'plane', points: [[a, b, 'A'], [a + h, b + v, 'A′']] }, steps: [`x changes by ${neg(a + h)} − ${par(a)} = ${neg(h)}; y changes by ${neg(b + v)} − ${par(b)} = ${neg(v)}.`, `So it moves ${desc(h, v)}.`] });
});
skill('7-congruence', 7, 'Transformations', 'Congruence and symmetry', ['Congruent figures have the same size and shape. Slides, flips and turns make congruent figures.', 'In △ABC ≅ △DEF, the letters match in order: A↔D, B↔E, C↔F.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const ox = r.int(1, 3), oy = r.int(1, 3), P = [[ox, oy], [ox + 3, oy], [ox, oy + 2]], kind = r.pick(['translation', 'reflection', 'rotation']);
    let Q;
    if (kind === 'translation') { const dx = -r.int(4, 6), dy = r.pick([-5, -4, 0, 1]); Q = P.map(([x, y]) => [x + dx, y + dy]); }
    else if (kind === 'reflection') Q = r.bool() ? P.map(([x, y]) => [-x, y]) : P.map(([x, y]) => [x, -y]);
    else Q = P.map(([x, y]) => [-x, -y]);
    const L = ['A', 'B', 'C'];
    return mc(r, kind, ['translation', 'reflection', 'rotation'].filter((k) => k !== kind), { q: 'Which transformation moves triangle ABC onto triangle A′B′C′?', visual: { type: 'plane', points: [...P.map((p, i) => [...p, L[i]]), ...Q.map((p, i) => [...p, L[i] + '′'])] }, steps: [kind === 'translation' ? 'Every point moves the same distance in the same direction, and the triangle faces the same way.' : kind === 'reflection' ? 'The triangle is flipped over an axis: it now faces the other way, like a mirror image.' : 'The triangle is turned halfway around the origin: (x, y) → (−x, −y).', `So it is a ${kind}.`] });
  }
  const [p1, p2] = r.pick([['ABC', 'DEF'], ['PQR', 'XYZ'], ['JKL', 'MNO'], ['RST', 'UVW']]), i = r.int(0, 2), j = (i + 1) % 3;
  if (t === 1) {
    const side = r.bool(), right = side ? p2[i] + p2[j] : `∠${p2[i]}`;
    const wrong = side ? [p2[j] + p2[(j + 1) % 3], p2[(i + 2) % 3] + p2[i], p1[j] + p2[i]] : [`∠${p2[j]}`, `∠${p2[(i + 2) % 3]}`, `∠${p1[i]}`];
    return mc(r, right, wrong, { q: `△${p1} ≅ △${p2}. Which part matches ${side ? `side ${p1[i]}${p1[j]}` : `∠${p1[i]}`}?`, steps: [`Match the letters in order: ${[0, 1, 2].map((k) => `${p1[k]}↔${p2[k]}`).join(', ')}.`, `So ${side ? `${p1[i]}${p1[j]}` : `∠${p1[i]}`} matches ${right}.`] });
  }
  if (t === 2) {
    if (r.bool()) { const s = r.int(3, 20); return num(s, [`${p1[i]}${p1[j]} matches ${p2[i]}${p2[j]}.`, `Congruent figures have equal matching sides, so ${p2[i]}${p2[j]} = ${s} cm.`], { q: `△${p1} ≅ △${p2} and ${p1[i]}${p1[j]} = ${s} cm. How long is ${p2[i]}${p2[j]}?`, unit: 'cm', expr: String(s) }); }
    const a = r.int(30, 90), b = r.int(20, 150 - a), k = 2;
    return num(180 - a - b, [`∠${p1[k]} = 180 − ${a} − ${b} = ${180 - a - b}°.`, `∠${p2[k]} matches ∠${p1[k]}, so it is ${180 - a - b}°.`], { q: `△${p1} ≅ △${p2}. ∠${p1[0]} = ${a}° and ∠${p1[1]} = ${b}°. What is ∠${p2[k]}?`, unit: '°', expr: `180-${a}-${b}` });
  }
  const [shape, n] = r.pick([['an equilateral triangle', 3], ['a square', 4], ['a rectangle that is not a square', 2], ['a regular pentagon', 5], ['a regular hexagon', 6], ['an isosceles triangle that is not equilateral', 1], ['a scalene triangle', 0], ['a regular octagon', 8], ['a parallelogram with no right angles and unequal sides', 0]]);
  return num(n, ['A line of symmetry folds the shape onto itself exactly.', `${shape[0].toUpperCase() + shape.slice(1)} has ${n} line${n === 1 ? '' : 's'} of symmetry.`], { q: `How many lines of symmetry does ${shape} have?`, expr: String(n) });
});

// ───────────── 33. Transformations and similarity ─────────────
skill('7-similar', 7, 'Similarity', 'Similar figures and dilations', ['Similar figures have the same shape: matching angles are equal and matching sides are in the same ratio.', 'A dilation from the origin by scale factor k sends (x, y) to (kx, ky).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const [n, d] = r.pick([[2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [4, 1]]), x = d * r.nonzero(-2, 2), y = d * r.nonzero(-2, 2);
    return num(frac(n, d), [`Compare matching coordinates: ${neg(x * n / d)} ÷ ${par(x)} = ${F(n, d)}.`, `Check y: ${neg(y * n / d)} ÷ ${par(y)} = ${F(n, d)}. The scale factor is ${F(n, d)}.`], { q: `A dilation from the origin sends A ${pt(x, y)} to A′ ${pt(x * n / d, y * n / d)}. What is the scale factor?`, expr: `${x * n / d}/${x}` });
  }
  if (t === 1) {
    const k = r.pick([2, 3, 0.5]), x = (k === 0.5 ? 2 : 1) * r.nonzero(-3, 3), y = (k === 0.5 ? 2 : 1) * r.nonzero(-3, 3);
    return mc(r, pt(k * x, k * y), [pt(x + k, y + k), pt(k * x, y), pt(x / k, y / k)], { q: `Point ${pt(x, y)} is dilated from the origin by a scale factor of ${k}. Where does it go?`, steps: ['Multiply both coordinates by the scale factor.', `${pt(x, y)} → ${pt(k * x, k * y)}.`] });
  }
  if (t === 2) {
    const k = r.pick([1.5, 2, 2.5, 3]), a = r.int(2, 10), b = r.int(2, 12);
    return num(dec(b * k), [`Scale factor: ${dec(a * k)} ÷ ${a} = ${k}.`, `${b} × ${k} = ${dec(b * k)}, so the missing side is ${dec(b * k)} cm.`], { q: `Two triangles are similar. A side of ${a} cm in the small one matches a side of ${dec(a * k)} cm in the big one. Another side of the small one is ${b} cm. How long is the matching side in the big one?`, unit: 'cm', expr: `${b}*${dec(a * k)}/${a}` });
  }
  if (t === 3) {
    const h = r.pick([1.5, 1.6, 1.8, 2]), s = r.pick([1, 2, 2.5, 3]), k = r.int(3, 12), S = s * k, H = h * k;
    return num(dec(H), [`Shadows and heights are in the same ratio: ${dec(h)}/${dec(s)} = H/${dec(S)}.`, `${dec(S)} is ${k} times ${dec(s)}, so H = ${dec(h)} × ${k} = ${dec(H)}.`, `The tree is ${dec(H)} m tall.`], { q: `A person ${dec(h)} m tall casts ${an(dec(s))} ${dec(s)} m shadow. At the same time, a tree casts ${an(dec(S))} ${dec(S)} m shadow. How tall is the tree, in metres?`, unit: 'm', expr: `${h}*${S}/${s}` });
  }
  const a = r.int(2, 8), b = r.int(a + 1, 12), k = r.pick([1.5, 2, 3]), yes = r.bool(), c = a * k, d = yes ? b * k : b * k + r.pick([-1, 1, 2]);
  return mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], { q: `Is a rectangle that is ${a} cm by ${b} cm similar to one that is ${dec(c)} cm by ${dec(d)} cm?`, steps: [`Compare matching sides: ${dec(c)} ÷ ${a} = ${dec(c / a, 3)} and ${dec(d)} ÷ ${b} = ${dec(d / b, 3)}.`, yes ? 'The ratios are equal, so yes, they are similar.' : 'The ratios are different, so no, they are not similar.'] });
});

// ───────────── 34. Data and graphs ─────────────
skill('7-graphs', 7, 'Data and graphs', 'Read tables and graphs', ['Read the title and labels first, so you know what each number means.', 'Bar graphs compare groups; line graphs show change over time; circle graphs show parts of a whole.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const labels = r.shuffle(['Soccer', 'Hockey', 'Basketball', 'Swimming', 'Lacrosse']).slice(0, 4), values = labels.map(() => r.int(3, 20)), [i, j] = pick2(r, [0, 1, 2, 3]), total = r.bool();
    if (total) return num(values.reduce((a, b) => a + b, 0), [`Read each bar: ${labels.map((l, k) => `${l} ${values[k]}`).join(', ')}.`, `${values.join(' + ')} = ${values.reduce((a, b) => a + b, 0)}.`, `So ${values.reduce((a, b) => a + b, 0)} students voted.`], { q: 'How many students voted in all?', visual: { type: 'bars', labels, values, title: 'Favourite sport' }, expr: values.join('+') });
    return num(Math.abs(values[i] - values[j]), [`${labels[i]}: ${values[i]}. ${labels[j]}: ${values[j]}.`, `${Math.max(values[i], values[j])} − ${Math.min(values[i], values[j])} = ${Math.abs(values[i] - values[j])}.`, `The difference is ${Math.abs(values[i] - values[j])} votes.`], { q: `How many more votes did ${values[i] >= values[j] ? labels[i] : labels[j]} get than ${values[i] >= values[j] ? labels[j] : labels[i]}?`, visual: { type: 'bars', labels, values, title: 'Favourite sport' }, expr: `Math.abs(${values[i]}-${values[j]})` });
  }
  if (t === 1) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], sold = days.map(() => r.int(12, 60)), [i, j] = pick2(r, [0, 1, 2, 3, 4]);
    return num(sold[i] + sold[j], [`${days[i]}: ${sold[i]}. ${days[j]}: ${sold[j]}.`, `${sold[i]} + ${sold[j]} = ${sold[i] + sold[j]}.`, `So ${sold[i] + sold[j]} muffins.`], { q: `The table shows muffins sold at a bake sale. How many were sold on ${days[i]} and ${days[j]} together?`, visual: { type: 'table', head: ['Day', 'Muffins sold'], rows: days.map((d, k) => [d, sold[k]]) }, expr: `${sold[i]}+${sold[j]}` });
  }
  if (t === 2) {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul'], incs = r.shuffle([2, 3, 5, 7]), temps = [r.int(-5, 3)]; incs.forEach((d) => temps.push(temps.at(-1) + d));
    const k = incs.indexOf(Math.max(...incs)), right = `${months[k]} to ${months[k + 1]}`;
    return mc(r, right, incs.map((_, m) => `${months[m]} to ${months[m + 1]}`).filter((x) => x !== right).slice(0, 3), { q: 'A line graph of average temperature has these points. Between which two months did the temperature rise the most?', visual: { type: 'table', head: ['Month', 'Temperature (°C)'], rows: months.map((m, i) => [m, neg(temps[i])]) }, steps: [`The rises are ${incs.map((d, m) => `${months[m]}–${months[m + 1]}: ${d}`).join(', ')}.`, `The biggest rise is ${Math.max(...incs)} degrees, from ${right}.`] });
  }
  const [q, right] = r.pick([['to show how a plant’s height changed over 8 weeks', 'line graph'], ['to show what part of a budget goes to each category', 'circle graph'], ['to compare the number of students who chose each fruit', 'bar graph'], ['to show how many test scores fall in the ranges 60–69, 70–79 and 80–89', 'histogram'], ['to show every data value while grouping them by tens', 'stem-and-leaf plot']]);
  return mc(r, right, r.shuffle(['line graph', 'circle graph', 'bar graph', 'histogram', 'stem-and-leaf plot'].filter((x) => x !== right)).slice(0, 3), { q: `Which type of graph is best ${q}?`, steps: ['Line graphs: change over time. Circle graphs: parts of a whole. Bar graphs: compare groups. Histograms: counts in intervals. Stem-and-leaf: every value, grouped.', `So use a ${right}.`] });
});
skill('7-stemleaf', 7, 'Data and graphs', 'Stem-and-leaf plots, line plots and histograms', ['In a stem-and-leaf plot, the stem is the tens digit and each leaf is a ones digit: 3 | 2 5 means 32 and 35.', 'A histogram uses bars for intervals of equal width, like 10–19 and 20–29.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const data = Array.from({ length: r.int(9, 13) }, () => r.int(12, 68)).sort((a, b) => a - b), stems = [...new Set(data.map((x) => Math.floor(x / 10)))];
    const rows = []; for (let s = stems[0]; s <= stems.at(-1); s++) rows.push([s, data.filter((x) => Math.floor(x / 10) === s).map((x) => x % 10).join(' ') || ' ']);
    const th = 10 * r.int(stems[0] + 1, stems.at(-1)), [ask, v, why] = r.pick([['the least value', data[0], `The first stem and its first leaf: ${data[0]}.`], ['the greatest value', data.at(-1), `The last stem and its last leaf: ${data.at(-1)}.`], ['the range', data.at(-1) - data[0], `Greatest − least = ${data.at(-1)} − ${data[0]}.`], [`the number of values that are ${th} or more`, data.filter((x) => x >= th).length, `Count the leaves on stems ${th / 10} and above.`]]);
    return num(v, [why, `So ${ask} is ${v}.`], { q: `The stem-and-leaf plot shows test scores. What is ${ask}?`, visual: { type: 'table', head: ['Stem', 'Leaf'], rows }, expr: String(v) });
  }
  if (t === 1) {
    const vals = [1, 2, 3, 4, 5, 6], counts = vals.map(() => r.int(0, 5)); const top = r.int(0, 5); counts[top] = 6;
    const total = counts.reduce((a, b) => a + b, 0), k = r.int(2, 5), above = counts.slice(k).reduce((a, b) => a + b, 0);
    const [ask, v, why] = r.pick([['How many data values are there in all?', total, `Add the ×s: ${counts.join(' + ')} = ${total}.`], [`How many values are greater than ${k}?`, above, `Add the ×s above ${k + 1} to 6: ${counts.slice(k).join(' + ')} = ${above}.`], ['Which value is the mode?', vals[top], `The tallest column of ×s is above ${vals[top]}.`]]);
    return num(v, [why, `So the answer is ${v}.`], { q: `A line plot shows how many books students read. ${ask}`, visual: { type: 'table', head: ['Books', 'Students (×)'], rows: vals.map((x, i) => [x, '×'.repeat(counts[i]).split('').join(' ') || '–']) }, expr: String(v) });
  }
  const labels = ['50–59', '60–69', '70–79', '80–89', '90–99'], values = labels.map(() => r.int(1, 9)), k = r.int(1, 3), v = values.slice(k).reduce((a, b) => a + b, 0);
  return num(v, [`Scores of ${50 + 10 * k} or more are in the bars ${labels.slice(k).join(', ')}.`, `${values.slice(k).join(' + ')} = ${v}.`, `So ${v} students.`], { q: `The histogram shows quiz scores. How many students scored ${50 + 10 * k} or more?`, visual: { type: 'bars', labels, values, title: 'Quiz scores' }, expr: values.slice(k).join('+') });
});
skill('7-circlegraph', 7, 'Data and graphs', 'Circle graphs', ['A circle graph shows parts of a whole. All the parts add to 100%, or 360°.', 'Part = percent × total. Central angle = percent × 360°.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const cats = ['Walk', 'Bus', 'Car', 'Bike'], ps = [5 * r.int(2, 6), 5 * r.int(2, 6), 5 * r.int(2, 6)]; ps.push(100 - ps.reduce((a, b) => a + b, 0));
    const N = 20 * r.int(2, 30), i = r.int(0, 3), v = N * ps[i] / 100;
    return num(v, [`${cats[i]} is ${ps[i]}% of the ${N} students.`, `${dec(ps[i] / 100)} × ${N} = ${v}.`, `So ${v} students.`], { q: `A circle graph shows how ${N} students get to school. How many students ${cats[i] === 'Walk' ? 'walk' : cats[i] === 'Bike' ? 'bike' : `come by ${cats[i].toLowerCase()}`}?`, visual: { type: 'table', head: ['How', 'Percent'], rows: cats.map((c, k) => [c, `${ps[k]}%`]) }, expr: `${ps[i]}*${N}/100` });
  }
  if (t === 1) { const p = 5 * r.int(1, 12); return num(p * 3.6, [`The whole circle is 360°, and this part is ${p}% of it.`, `${dec(p / 100)} × 360 = ${dec(p * 3.6)}, so the central angle is ${dec(p * 3.6)}°.`], { q: `In a circle graph, one section is ${p}%. What is its central angle?`, unit: '°', expr: `${p}/100*360` }); }
  const a = 18 * r.int(1, 19);
  return num(a / 3.6, [`The section is ${a}° out of 360°.`, `${a} ÷ 360 = ${dec(a / 360)}, which is ${dec(a / 3.6)}%.`], { q: `In a circle graph, a section has a central angle of ${a}°. What percent of the whole is it?`, unit: '%', expr: `${a}/360*100` });
});

// ───────────── 35. Statistics ─────────────
skill('7-stats', 7, 'Statistics', 'Mean, median, mode and range', ['Mean: add the values and divide by how many. Median: the middle value in order.', 'Mode: the most common value. Range: greatest − least.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const n = r.int(4, 7), m = r.int(8, 40); let xs; do { xs = Array.from({ length: n - 1 }, () => m + r.int(-8, 8)); xs.push(m * n - xs.reduce((a, b) => a + b, 0)); } while (xs.at(-1) < 1 || Math.abs(xs.at(-1) - m) > 12);
    if (r.bool()) return num(m, [`Sum: ${xs.join(' + ')} = ${m * n}.`, `${m * n} ÷ ${n} = ${m}, so the mean is ${m}.`], { q: `Find the mean of: ${xs.join(', ')}`, expr: `(${xs.join('+')})/${n}` });
    return num(Math.max(...xs) - Math.min(...xs), [`Greatest: ${Math.max(...xs)}. Least: ${Math.min(...xs)}.`, `${Math.max(...xs)} − ${Math.min(...xs)} = ${Math.max(...xs) - Math.min(...xs)}, so the range is ${Math.max(...xs) - Math.min(...xs)}.`], { q: `Find the range of: ${xs.join(', ')}`, expr: `${Math.max(...xs)}-${Math.min(...xs)}` });
  }
  if (t === 1) {
    const n = r.int(5, 8), xs = Array.from({ length: n }, () => r.int(1, 30)), s = [...xs].sort((a, b) => a - b);
    if (r.bool()) { const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; return num(dec(med), [`In order: ${s.join(', ')}.`, n % 2 ? `The middle value is ${med}, so the median is ${med}.` : `The two middle values are ${s[n / 2 - 1]} and ${s[n / 2]}; halfway between them is ${dec(med)}, so the median is ${dec(med)}.`], { q: `Find the median of: ${xs.join(', ')}`, expr: n % 2 ? `${med}` : `(${s[n / 2 - 1]}+${s[n / 2]})/2` }); }
    const mo = r.pick(xs), ys = r.shuffle([...new Set(xs)].concat([mo, mo]));
    return num(mo, [`Count each value: ${mo} appears ${ys.filter((y) => y === mo).length} times, more than any other.`, `So the mode is ${mo}.`], { q: `Find the mode of: ${ys.join(', ')}`, expr: String(mo) });
  }
  if (t === 2) {
    const games = ['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5'], goals = games.map(() => r.int(0, 8)), sum = goals.reduce((a, b) => a + b, 0);
    return num(dec(sum / 5), [`Add the goals: ${goals.join(' + ')} = ${sum}.`, `${sum} ÷ 5 = ${dec(sum / 5)}, so the mean is ${dec(sum / 5)} goals.`], { q: 'The table shows goals scored by a hockey team. What is the mean number of goals per game?', visual: { type: 'table', head: ['Game', 'Goals'], rows: games.map((g, i) => [g, goals[i]]) }, expr: `(${goals.join('+')})/5` });
  }
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values = labels.map(() => r.int(2, 20)), s = [...values].sort((a, b) => a - b), ask = r.pick(['range', 'median']);
  const v = ask === 'range' ? s[4] - s[0] : s[2];
  return num(v, [ask === 'range' ? `Tallest bar ${s[4]}, shortest ${s[0]}.` : `In order: ${s.join(', ')}.`, ask === 'range' ? `${s[4]} − ${s[0]} = ${v}, so the range is ${v}.` : `The middle value is ${v}, so the median is ${v}.`], { q: `The bar graph shows library books borrowed each day. What is the ${ask}?`, visual: { type: 'bars', labels, values, title: 'Books borrowed' }, expr: ask === 'range' ? `${s[4]}-${s[0]}` : String(s[2]) });
});
skill('7-statchanges', 7, 'Statistics', 'Missing values, outliers and changes', ['If you know the mean and how many values, the total is mean × count.', 'An outlier is a value far from the rest. It pulls the mean toward it, but barely moves the median.'], (r) => {
  const t = r.int(0, 4);
  const n = r.int(4, 6), m = r.int(10, 30); let xs; do { xs = Array.from({ length: n - 1 }, () => m + r.int(-6, 6)); } while (Math.abs(m * n - xs.reduce((a, b) => a + b, 0) - m) > 9);
  if (t === 0) { const miss = m * n - xs.reduce((a, b) => a + b, 0); return num(miss, [`The total must be ${m} × ${n} = ${m * n}.`, `The known values add to ${xs.reduce((a, b) => a + b, 0)}. ${m * n} − ${xs.reduce((a, b) => a + b, 0)} = ${miss}.`, `The missing value is ${miss}.`], { q: `The mean of ${n} numbers is ${m}. ${n - 1} of them are ${xs.join(', ')}. What is the other number?`, expr: `${m}*${n}-(${xs.join('+')})` }); }
  const all = [...xs, m * n - xs.reduce((a, b) => a + b, 0)];
  if (t === 1) {
    const v = m + r.pick([-7, -4, 0, 5, 9]), right = v > m ? 'It increases' : v < m ? 'It decreases' : 'It stays the same';
    return mc(r, right, ['It increases', 'It decreases', 'It stays the same'].filter((x) => x !== right), { q: `The data ${all.join(', ')} has a mean of ${m}. If ${v} is added to the data, what happens to the mean?`, steps: [`${v} is ${v > m ? 'above' : v < m ? 'below' : 'equal to'} the mean of ${m}.`, `A value ${v > m ? 'above the mean pulls it up' : v < m ? 'below the mean pulls it down' : 'equal to the mean leaves it'}: ${right.toLowerCase()}.`] });
  }
  const high = m < 22 || r.bool(), o = high ? m + r.int(40, 70) : r.int(0, m - 20), base = Array.from({ length: n + 2 }, () => m + r.int(-5, 5)), data = r.shuffle([...base, o]);
  if (t === 2) return mc(r, o, r.shuffle([...new Set(base)]).slice(0, 3), { q: `Which value is an outlier? ${data.join(', ')}`, steps: [`Most values are close to ${m}.`, `${o} is far from the rest, so it is the outlier.`] });
  if (t === 3) { const right = high ? 'The mean decreases' : 'The mean increases'; return mc(r, right, [high ? 'The mean increases' : 'The mean decreases', 'The mean stays the same'], { q: `The outlier ${o} is removed from: ${data.join(', ')}. What happens to the mean?`, steps: [`${o} is ${high ? 'much bigger' : 'much smaller'} than the other values, so it was pulling the mean ${high ? 'up' : 'down'}.`, `Without it: ${right.toLowerCase()}.`] }); }
  let k = r.int(1, 4) * (r.bool() ? 1 : -1); if (m + (n + 1) * k < 0) k = -k; const v = m + (n + 1) * k;
  return num(m + k, [`Old total: ${m} × ${n} = ${m * n}. New total: ${m * n} + ${v} = ${m * n + v}.`, `${m * n + v} ÷ ${n + 1} = ${m + k}.`, `The new mean is ${m + k}.`], { q: `${n} test scores have a mean of ${m}. A new score of ${v} is added. What is the new mean?`, expr: `(${m}*${n}+${v})/${n + 1}` });
});
skill('7-sampling', 7, 'Statistics', 'Samples and predictions', ['A sample is part of a population. A good sample is random and represents the whole group.', 'A biased sample leans one way, like asking only hockey players about their favourite sport.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const [q, right, wrongs] = r.pick([
      ['A principal wants to know which lunch students like best. Which sample is most likely to represent the whole school?', '50 students picked at random from the school list', ['the 25 students in the cooking club', 'the first 10 students in the lunch line', 'the students in one grade 7 class']],
      ['A city wants to know how residents feel about a new bike lane. Which sample is best?', '300 residents picked at random from all neighbourhoods', ['people riding bikes on the bike path', 'drivers stopped in traffic downtown', 'the members of one cycling club']],
      ['A store wants to know how customers rate its service. Which sample is best?', 'every 10th customer who leaves the store all week', ['customers who wrote a complaint', 'the owner’s friends', 'customers on one Saturday morning only']],
    ]);
    return mc(r, right, wrongs, { q, steps: ['A good sample is chosen at random from the whole population, so every group is included.', `So the best sample is: ${right}.`] });
  }
  if (t === 1) {
    const [q, biased, why] = r.pick([['To find how often Canadians exercise, a researcher asks people at a gym.', true, 'People at a gym probably exercise more than most.'], ['To find the favourite colour of students, a teacher picks names at random from a list of every student.', false, 'Every student had the same chance to be picked.'], ['To find the most popular sport at school, a student asks the basketball team.', true, 'Basketball players are likely to choose basketball.'], ['To find how many families own a pet, a town mails a survey to 500 addresses picked at random.', false, 'The addresses were picked at random from the whole town.']]);
    return mc(r, biased ? 'Yes, it is biased' : 'No, it is not biased', [biased ? 'No, it is not biased' : 'Yes, it is biased'], { q: `${q} Is the sample biased?`, steps: [why, biased ? 'So yes, the sample is biased.' : 'So no, it is not biased.'] });
  }
  const n = r.pick([20, 25, 40, 50]), k = r.int(3, n - 3), mult = r.int(3, 20), N = n * mult;
  return num(k * mult, [`In the sample, ${k} out of ${n} walk.`, `The school has ${N} students, which is ${mult} times ${n}. So ${k} × ${mult} = ${k * mult}.`, `About ${k * mult} students walk.`], { q: `In a random sample of ${n} students, ${k} walk to school. There are ${N} students at the school. About how many walk to school?`, expr: `${k}/${n}*${N}` });
});

// ───────────── 36. Probability ─────────────
skill('7-probevents', 7, 'Probability', 'Probability of events', ['P(not A) = 1 − P(A).', 'If two events cannot happen together, P(A or B) = P(A) + P(B).', 'Experimental probability = times it happened ÷ number of trials.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    if (r.bool()) { const [a, b] = r.pick(PROPER); return num(frac(b - a, b), [`P(not A) = 1 − P(A) = ${b}/${b} − ${a}/${b}.`, `= ${b - a}/${b}, which is ${F(b - a, b)}.`], { q: `The probability that a spinner lands on red is ${a}/${b}. What is the probability it does not land on red?`, exactForm: 'fraction', expr: `1-${a}/${b}` }); }
    const p = r.int(1, 19) * 5; return num(dec(1 - p / 100), [`P(no rain) = 1 − P(rain) = 1 − ${dec(p / 100)}.`, `= ${dec(1 - p / 100)}.`], { q: `The chance of rain tomorrow is ${dec(p / 100)}. What is the probability that it does not rain?`, expr: `1-${p / 100}` });
  }
  if (t === 1) {
    const [ev, set] = r.pick([['a 2 or a 5', [2, 5]], ['an even number', [2, 4, 6]], ['a number greater than 4', [5, 6]], ['an even number or a number greater than 3', [2, 4, 5, 6]], ['a multiple of 3', [3, 6]], ['a prime number', [2, 3, 5]], ['a 1 or an even number', [1, 2, 4, 6]], ['not a 6', [1, 2, 3, 4, 5]]]);
    return num(frac(set.length, 6), [`The outcomes that work: ${set.join(', ')}. That is ${set.length} of the 6 outcomes (count each one only once).`, `P = ${set.length}/6 = ${F(set.length, 6)}.`], { q: `A fair number cube (1 to 6) is rolled. What is the probability of rolling ${ev}?`, exactForm: 'fraction', expr: `${set.length}/6` });
  }
  if (t === 2) {
    const cols = ['Red', 'Blue', 'Green', 'Yellow'], counts = cols.map(() => r.int(2, 15)), N = counts.reduce((a, b) => a + b, 0), i = r.int(0, 3);
    return num(frac(counts[i], N), [`${cols[i]} came up ${counts[i]} times in ${N} spins.`, `Experimental probability = ${counts[i]}/${N} = ${F(counts[i], N)}.`], { q: `A spinner was spun ${N} times with the results shown. What is the experimental probability of ${cols[i].toLowerCase()}?`, visual: { type: 'table', head: ['Colour', 'Times'], rows: cols.map((c, k) => [c, counts[k]]) }, exactForm: 'fraction', expr: `${counts[i]}/${N}` });
  }
  if (r.bool()) { const k = r.int(5, 40), f = r.int(1, 6); return num(k, [`P(rolling a ${f}) = 1/6.`, `1/6 × ${6 * k} = ${k}, so expect about ${k} times.`], { q: `A fair number cube is rolled ${6 * k} times. About how many times would you expect to roll a ${f}?`, expr: `${6 * k}/6` }); }
  const n = r.pick([20, 25, 40, 50]), k = r.int(3, n - 3), m = r.int(2, 8);
  return num(k * m, [`In ${n} trials, red came up ${k} times: ${k}/${n}.`, `${n * m} trials is ${m} times as many, so ${k} × ${m} = ${k * m}.`, `Predict about ${k * m} reds.`], { q: `A spinner landed on red ${k} times in ${n} spins. Predict how many reds there will be in ${n * m} spins.`, expr: `${k}/${n}*${n * m}` });
});
skill('7-compoundprob', 7, 'Probability', 'Compound events', ['The counting principle: if one choice has a ways and another has b ways, together there are a × b ways.', 'For independent events, P(A and B) = P(A) × P(B).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) { const a = r.int(2, 6), b = r.int(2, 6), c = r.int(2, 4), who = r.pick(NAMES); return num(a * b * c, [`Multiply the number of choices for each item.`, `${a} × ${b} × ${c} = ${a * b * c}.`, `So there are ${a * b * c} outfits.`], { q: `${who} has ${a} shirts, ${b} pairs of pants and ${c} pairs of shoes. How many different outfits can ${who} make?`, expr: `${a}*${b}*${c}` }); }
  if (t === 1) { const [what, a, b] = r.pick([['a coin is flipped and a number cube is rolled', 2, 6], ['two number cubes are rolled', 6, 6], [`a spinner with ${r.int(3, 8)} equal parts is spun and a coin is flipped`, 0, 2], ['a coin is flipped three times', 4, 2]]); const A = a || Number(what.match(/\d+/)[0]); return num(A * b, [`The first part has ${A} outcomes and the second has ${b}.`, `${A} × ${b} = ${A * b}, so there are ${A * b} outcomes.`], { q: `How many outcomes are in the sample space when ${what}?`, expr: `${A}*${b}` }); }
  if (t === 2) {
    const [e1, p1, d1] = r.pick([['heads on a coin', 1, 2], ['tails on a coin', 1, 2]]), [e2, p2, d2] = r.pick([['a 4 on a number cube', 1, 6], ['an even number on a number cube', 3, 6], ['a number less than 3 on a number cube', 2, 6], ['blue on a spinner with 4 equal colours', 1, 4], ['red on a spinner with 5 equal parts, 2 of them red', 2, 5]]);
    return num(frac(p1 * p2, d1 * d2), [`The events are independent: P(${e1}) = ${F(p1, d1)} and P(${e2}) = ${F(p2, d2)}.`, `${F(p1, d1)} × ${F(p2, d2)} = ${F(p1 * p2, d1 * d2)}.`], { q: `What is the probability of getting ${e1} and ${e2}?`, exactForm: 'fraction', expr: `${p1}/${d1}*${p2}/${d2}` });
  }
  if (t === 3) {
    const [q, ind] = r.pick([['A marble is picked from a bag, put back, and then a second marble is picked.', true], ['A card is picked from a deck and kept, then a second card is picked.', false], ['A coin is flipped and a number cube is rolled.', true], ['Two students are chosen from a class, one after the other, to be president and vice-president.', false], ['A spinner is spun twice.', true]]);
    return mc(r, ind ? 'independent' : 'dependent', [ind ? 'dependent' : 'independent'], { q: `${q} Are the two events independent or dependent?`, steps: [ind ? 'The first result does not change the chances for the second.' : 'The first pick is not put back, so it changes the chances for the second.', `So they are ${ind ? 'independent' : 'dependent'}.`] });
  }
  const [q, right, wrongs] = r.pick([['flipping two coins', 'HH, HT, TH, TT', ['HH, HT, TT', 'H, T', 'HH, TT']], ['flipping a coin and spinning a spinner with A and B', 'HA, HB, TA, TB', ['HA, TB', 'H, T, A, B', 'HA, HB, TA']], ['choosing a drink (milk or juice) and a snack (apple, pear or bun)', 'milk-apple, milk-pear, milk-bun, juice-apple, juice-pear, juice-bun', ['milk, juice, apple, pear, bun', 'milk-apple, juice-pear, milk-bun', 'milk-apple, milk-pear, juice-apple, juice-pear']]]);
  return mc(r, right, wrongs, { q: `Which list shows the whole sample space for ${q}?`, steps: ['Pair every outcome of the first part with every outcome of the second.', `So the sample space is: ${right}.`] });
});

export default list;
