// Grade 6 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
import * as G6 from './geo6.mjs';   // grade 6 geometry and measurement, taught with pictures
const { skill, list } = grade();

// ── small helpers for this grade ──
const PL = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions', 'hundred millions', 'billions'];
const DPL = ['tenths', 'hundredths', 'thousandths'];
const ONE = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TEN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const w99 = (n) => (n < 20 ? ONE[n] : TEN[Math.floor(n / 10)] + (n % 10 ? '-' + ONE[n % 10] : ''));
const w999 = (n) => [Math.floor(n / 100) ? ONE[Math.floor(n / 100)] + ' hundred' : '', n % 100 ? w99(n % 100) : ''].filter(Boolean).join(' ');
const words = (n) => {
  if (!n) return 'zero';
  const parts = [];
  [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand'], [1, '']].forEach(([u, w]) => { const g = Math.floor(n / u) % 1000; if (g) parts.push(w999(g) + (w ? ' ' + w : '')); });
  return parts.join(' ');
};
// 3.405 → "three and four hundred five thousandths"
const decWords = (x, dp) => {
  const [i, f] = x.toFixed(dp).split('.'); const fn = Number(f);
  const tail = `${words(fn)} ${DPL[dp - 1].replace(/s$/, fn === 1 ? '' : 's')}`;
  return Number(i) ? `${words(Number(i))} and ${tail}` : tail;
};
const money = (x) => `$${x.toFixed(2)}`;
const X = (s) => s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\^/g, '**');   // board text → JS
const names = (r, k) => r.shuffle(NAMES).slice(0, k);
// a mixed number from n/d (n ≥ 0): "3 1/4", "2", "3/5"
const mixed = (n, d) => { const [a, b] = simplify(n, d); const w = Math.floor(a / b), rem = a % b; return b === 1 ? String(a) : w ? (rem ? `${w} ${rem}/${b}` : String(w)) : `${rem}/${b}`; };
const cmpSign = (a, b) => (Math.abs(a - b) < 1e-9 ? '=' : a < b ? '<' : '>');
const roundTo = (x, p) => Math.round(x / p) * p;
const distinctDigits = (r, len) => { const d = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len); if (d[0] === 0) [d[0], d[1]] = [d[1], d[0]]; return d.join(''); };
const dpOf = (x) => (String(x).split('.')[1] ?? '').length;

// ───────────── 1. Whole numbers ─────────────
skill('6-wholeplace', 6, 'Whole numbers', 'Place value to billions', ['Each place is worth 10 times the place to its right.', 'Read a big number in groups of three digits: billions, millions, thousands, then ones.'], (r) => {
  const t = r.int(0, 3);
  if (t <= 1) {
    const len = r.int(7, 10), s = distinctDigits(r, len), n = Number(s);
    let p; do p = r.int(0, len - 1); while (s[len - 1 - p] === '0');
    const d = Number(s[len - 1 - p]);
    if (t === 0) return num(d * 10 ** p, [`Count places from the right: ones, tens, hundreds, … The ${d} is in the ${PL[p]} place.`, `The ${PL[p]} place is worth ${comma(10 ** p)}.`, `So the value is ${d} × ${comma(10 ** p)} = ${comma(d * 10 ** p)}.`], { q: `What is the value of the digit ${d} in ${comma(n)}?`, expr: `${d}*${10 ** p}` });
    return mc(r, PL[p], [PL[p + 1] ?? PL[p - 2], PL[p - 1] ?? PL[p + 2], PL[(p + 3) % 10]], { q: `In ${comma(n)}, which place is the digit ${d} in?`, steps: [`Count places from the right: ones, tens, hundreds, thousands, …`, `The ${d} is in the ${PL[p]} place.`] });
  }
  const m = r.int(1, 999), th = r.int(0, 999), o = r.int(1, 999), n = m * 1e6 + th * 1e3 + o;
  if (t === 2) return num(n, [`Each group name tells where three digits go: ${w999(m)} million → ${m}; ${th ? `${w999(th)} thousand → ${String(th).padStart(3, '0')}` : 'no thousands → 000'}; ${w999(o)} → ${String(o).padStart(3, '0')}.`, `So the number is ${comma(n)}.`], { q: `Write this number in digits: ${words(n)}.`, expr: String(n) });
  const wrongs = [o * 1e6 + th * 1e3 + m, m * 1e6 + o * 1e3 + th, n + 1e6, m * 1e5 + th * 1e3 + o].map(words);
  return mc(r, words(n), wrongs, { q: `Which is the word name for ${comma(n)}?`, steps: [`Split into groups of three: ${m} | ${String(th).padStart(3, '0')} | ${String(o).padStart(3, '0')}.`, `Read each group and say its name: ${words(n)}.`] });
});
skill('6-wholecomp', 6, 'Whole numbers', 'Compare and order whole numbers', ['The number with more digits is greater.', 'With the same number of digits, compare from the left until two digits differ.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) {
    const len = r.int(6, 9), s = String(r.int(10 ** (len - 1), 10 ** len - 1)), k = r.int(1, len - 1);
    let d2 = r.int(0, 9); while (String(d2) === s[k]) d2 = r.int(0, 9);
    const b = Number(s.slice(0, k) + d2 + s.slice(k + 1)), a = Number(s), sign = cmpSign(a, b);
    return mc(r, sign, ['<', '>', '='], { q: `Which sign makes this true? ${comma(a)} ☐ ${comma(b)}`, steps: [`Both numbers have ${len} digits, so compare from the left.`, `The first different digits are in the ${PL[len - 1 - k]} place: ${s[k]} and ${d2}.`, `${s[k]} ${Number(s[k]) < d2 ? 'is less than' : 'is greater than'} ${d2}, so ${comma(a)} ${sign} ${comma(b)}.`] });
  }
  if (t === 1) {
    const base = r.int(100, 999) * 1000, xs = [];
    while (xs.length < 4) { const x = base + r.int(0, 9) * 100 + r.int(0, 99) + r.pick([0, 10000, -10000]); if (!xs.includes(x)) xs.push(x); }
    const up = [...xs].sort((a, b) => a - b), most = r.bool();
    const right = (most ? [...up].reverse() : up).map(comma).join(', ');
    const wrong = [r.shuffle(xs), r.shuffle(xs), most ? up : [...up].reverse()].map((l) => l.map(comma).join(', '));
    return mc(r, right, wrong, { q: `Put these in order from ${most ? 'greatest to least' : 'least to greatest'}: ${r.shuffle(xs).map(comma).join(', ')}`, steps: [`Compare from the left, place by place.`, `From least to greatest: ${up.map(comma).join(', ')}.`, `So the order is ${right}.`] });
  }
  const [a, b, c] = names(r, 3), what = r.pick(['points', 'money', 'height']), most = r.bool();
  const say = (x, y, up) => (what === 'height' ? `${x} is ${up ? 'taller' : 'shorter'} than ${y}` : `${x} has ${up ? 'more' : what === 'money' ? 'less' : 'fewer'} ${what} than ${y}`);
  const ask = what === 'height' ? (most ? 'Who is the tallest?' : 'Who is the shortest?') : `Who has the ${most ? 'most' : what === 'money' ? 'least' : 'fewest'} ${what}?`;
  return mc(r, most ? a : c, [a, b, c], { q: `${say(a, b, true)}. ${say(c, b, false)}. ${ask}`, steps: [`${a} is above ${b}, and ${c} is below ${b}.`, `Order from the top: ${a}, ${b}, ${c}.`, `So the answer is ${most ? a : c}.`] });
});

// ───────────── 2. Add and subtract whole numbers ─────────────
skill('6-addsub', 6, 'Add and subtract', 'Add and subtract large numbers', ['Line up the places and work from the ones.', 'To estimate, round each number first, then add or subtract.'], (r) => {
  const t = r.int(0, 4), a = r.int(10000, 99999), b = r.int(1000, 89999);
  const [x, y] = a > b ? [a, b] : [b, a];
  if (t === 0) return num(a + b, columnAdd([a, b]), { q: `${comma(a)} + ${comma(b)} = ?`, expr: `${a}+${b}` });
  if (t === 1) return num(x - y, columnSub(x, y), { q: `${comma(x)} − ${comma(y)} = ?`, expr: `${x}-${y}` });
  if (t === 2) {
    const add = r.bool(), ans = add ? x + y : x - y;
    const q = `A stadium had ${comma(x)} fans on Saturday and ${comma(y)} fans on Sunday. ${add ? 'How many fans came on the two days altogether?' : 'How many more fans came on Saturday?'}`;
    return num(ans, [add ? '"Altogether" means add.' : '"How many more" means subtract.', `${comma(x)} ${add ? '+' : '−'} ${comma(y)} = ${comma(ans)}.`, `So the answer is ${comma(ans)} fans.`], { q, expr: `${x}${add ? '+' : '-'}${y}` });
  }
  if (t === 3) {
    if (r.bool()) return num(b, [`The missing number is the sum minus the part we know.`, `${comma(a + b)} − ${comma(a)} = ${comma(b)}.`, `Check: ${comma(a)} + ${comma(b)} = ${comma(a + b)}. So ☐ = ${comma(b)}.`], { q: `${comma(a)} + ☐ = ${comma(a + b)}. What is ☐?`, expr: `${a + b}-${a}` });
    return num(a + b, [`Undo the subtraction by adding.`, `${comma(a)} + ${comma(b)} = ${comma(a + b)}.`, `Check: ${comma(a + b)} − ${comma(b)} = ${comma(a)}. So ☐ = ${comma(a + b)}.`], { q: `☐ − ${comma(b)} = ${comma(a)}. What is ☐?`, expr: `${a}+${b}` });
  }
  const add = r.bool(), X1 = roundTo(x, 1000), Y1 = roundTo(y, 1000), ans = add ? X1 + Y1 : X1 - Y1;
  return num(ans, [`Round each number to the nearest thousand: ${comma(x)} → ${comma(X1)} and ${comma(y)} → ${comma(Y1)}.`, `${comma(X1)} ${add ? '+' : '−'} ${comma(Y1)} = ${comma(ans)}.`, `So the estimate is ${comma(ans)}.`], { q: `Estimate ${comma(x)} ${add ? '+' : '−'} ${comma(y)} by rounding each number to the nearest thousand.`, expr: `${X1}${add ? '+' : '-'}${Y1}` });
});

// ───────────── 3. Multiply whole numbers ─────────────
skill('6-mult', 6, 'Multiplication', 'Multiply multi-digit numbers', ['Multiply by each digit of the bottom number, one place at a time.', 'Then add the rows.'], (r) => {
  const t = r.int(0, 2), a = r.int(105, 2999), b = r.int(12, 89);
  if (t === 0) return num(a * b, columnMul(a, b), { q: `${comma(a)} × ${b} = ?`, expr: `${a}*${b}` });
  if (t === 1) {
    const [q, unit] = r.pick([[`A school orders ${b} boxes of pencils. Each box holds ${a} pencils. How many pencils is that?`, 'pencils'], [`A bus travels ${a} km each week. How far does it travel in ${b} weeks, in km?`, 'km'], [`A farm packs ${a} apples into each crate. How many apples are in ${b} crates?`, 'apples']]);
    const tens = b - (b % 10), ones = b % 10;
    return num(a * b, [`Equal groups: multiply. ${comma(a)} × ${b}.`, `${comma(a)} × ${tens} = ${comma(a * tens)}${ones ? ` and ${comma(a)} × ${ones} = ${comma(a * ones)}` : ''}.`, `Add: ${comma(a * b)}. So the answer is ${comma(a * b)} ${unit}.`], { q, expr: `${a}*${b}` });
  }
  return num(a, [`The missing factor is the product divided by the factor we know.`, `${comma(a * b)} ÷ ${b} = ${comma(a)}.`, `Check: ${comma(a)} × ${b} = ${comma(a * b)}. So ☐ = ${comma(a)}.`], { q: `☐ × ${b} = ${comma(a * b)}. What is ☐?`, expr: `${a * b}/${b}` });
});
skill('6-multzero', 6, 'Multiplication', 'Multiply with zeros, three factors and estimates', ['For numbers ending in zeros, multiply the front digits, then write all the zeros.', 'To estimate, round each number to its greatest place first.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const d1 = r.int(2, 9), d2 = r.int(2, 9), k1 = r.int(1, 3), k2 = r.int(1, 3), a = d1 * 10 ** k1, b = d2 * 10 ** k2, p = a * b;
    return num(p, [`Multiply the front digits: ${d1} × ${d2} = ${d1 * d2}.`, `Count the zeros: ${k1} + ${k2} = ${k1 + k2}. Write them after ${d1 * d2}.`, `So ${comma(a)} × ${comma(b)} = ${comma(p)}.`], { q: `${comma(a)} × ${comma(b)} = ?`, expr: `${a}*${b}` });
  }
  if (t === 1) {
    const [x, y] = r.pick([[4, 25], [2, 50], [5, 20], [2, 5], [4, 5]]), c = r.int(3, 19), order = r.shuffle([x, y, c]);
    return num(x * y * c, [`We can multiply in any order. Find a friendly pair: ${x} × ${y} = ${x * y}.`, `Then ${x * y} × ${c} = ${x * y * c}.`, `So ${order.join(' × ')} = ${x * y * c}.`], { q: `${order.join(' × ')} = ?`, expr: order.join('*') });
  }
  if (t === 2) {
    const a = r.int(110, 949), b = r.int(21, 94), A = roundTo(a, 100), B = roundTo(b, 10);
    return num(A * B, [`Round each number to its greatest place: ${a} → ${A} and ${b} → ${B}.`, `${A} × ${B} = ${comma(A * B)}.`, `So the estimate is ${comma(A * B)}.`], { q: `Estimate ${a} × ${b} by rounding each number to its greatest place.`, expr: `${A}*${B}` });
  }
  const seats = r.int(2, 9) * 100, shows = r.int(2, 9) * 10;
  return num(seats * shows, [`Multiply: ${seats} × ${shows}.`, `${seats / 100} × ${shows / 10} = ${seats * shows / 1000}, then write 3 zeros.`, `So ${comma(seats * shows)} tickets were sold.`], { q: `A theatre has ${seats} seats. Every seat is sold for ${shows} shows. How many tickets were sold?`, expr: `${seats}*${shows}` });
});

// ───────────── 4. Divide whole numbers ─────────────
skill('6-div2', 6, 'Division', 'Divide by two-digit numbers', ['Ask how many times the divisor fits, one digit at a time.', 'A remainder can be written as a fraction of the divisor.'], (r) => {
  const t = r.int(0, 3), b = r.int(12, 48), q = r.int(12, 99);
  if (t === 0) return num(q, longDivision(q * b, b), { q: `${comma(q * b)} ÷ ${b} = ?`, expr: `${q * b}/${b}` });
  if (t === 1) {
    const rem = r.int(1, b - 1), a = q * b + rem, m = mixed(a, b);
    return num(m, [`${comma(a)} ÷ ${b}: ${b} × ${q} = ${comma(q * b)}, which leaves ${rem}.`, `So ${comma(a)} ÷ ${b} = ${q} R ${rem}.`, `Write the remainder over the divisor: ${rem}/${b}${frac(rem, b) !== `${rem}/${b}` ? ` = ${frac(rem, b)}` : ''}. The answer is ${m}.`], { q: `Divide and write the remainder as a fraction: ${comma(a)} ÷ ${b} = ?`, expr: `${a}/${b}`, say: `Divide ${a} by ${b}. Write the remainder as a fraction.` });
  }
  if (t === 2) {
    const seats = r.pick([24, 36, 40, 45, 48]), rem = r.int(1, seats - 1), people = q * seats + rem;
    return num(q + 1, [`${comma(people)} ÷ ${seats} = ${q} R ${rem}.`, `${q} full buses carry ${comma(q * seats)} students, and ${rem} students are still waiting.`, `They need one more bus, so ${q + 1} buses.`], { q: `${comma(people)} students are going on a trip. Each bus holds ${seats} students. How many buses are needed?`, expr: `Math.ceil(${people}/${seats})` });
  }
  return num(q * b, [`Undo division with multiplication.`, `${q} × ${b} = ${comma(q * b)}.`, `Check: ${comma(q * b)} ÷ ${b} = ${q}. So ☐ = ${comma(q * b)}.`], { q: `☐ ÷ ${b} = ${q}. What is ☐?`, expr: `${q}*${b}` });
});
const DIVRULE = { 2: 'the last digit is even', 3: 'the sum of the digits divides by 3', 4: 'the last two digits make a number that divides by 4', 5: 'the last digit is 0 or 5', 6: 'it divides by both 2 and 3', 9: 'the sum of the digits divides by 9', 10: 'the last digit is 0' };
skill('6-divest', 6, 'Division', 'Divisibility, zeros and estimates', ['Divisibility rules tell if a number divides evenly, without dividing.', 'To estimate a quotient, change the numbers to compatible ones that divide easily.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const d = r.pick([2, 3, 4, 5, 6, 9, 10]), yes = r.bool(), n0 = r.int(100, 9999), n = yes ? n0 * d : n0 * d + r.int(1, d - 1);
    const ds = String(n).split('').map(Number), sum = ds.reduce((a, b) => a + b, 0);
    const fact = d === 3 || d === 9 ? `Digit sum: ${ds.join(' + ')} = ${sum}.` : d === 4 ? `The last two digits make ${n % 100}.` : d === 6 ? `${n % 2 === 0 ? 'It is even' : 'It is odd'}, and its digit sum is ${sum}.` : `The last digit is ${n % 10}.`;
    const ok = n % d === 0;
    return mc(r, ok ? 'Yes' : 'No', ['Yes', 'No'], { q: `Is ${comma(n)} divisible by ${d}?`, steps: [`Rule for ${d}: a number divides by ${d} when ${DIVRULE[d]}.`, fact, `So the answer is ${ok ? 'yes' : 'no'}: ${comma(n)} ${ok ? 'is' : 'is not'} divisible by ${d}.`] });
  }
  if (t === 1) {
    const d = r.int(2, 9), q = r.int(2, 9), k1 = r.int(1, 2), k2 = r.int(0, 1), a = d * q * 10 ** (k1 + k2), b = d * 10 ** k1, ans = q * 10 ** k2;
    return num(ans, [`Cross off the same number of zeros from both: ${comma(a)} ÷ ${comma(b)} is the same as ${comma(a / 10 ** k1)} ÷ ${d}.`, `${comma(a / 10 ** k1)} ÷ ${d} = ${ans}.`, `So ${comma(a)} ÷ ${comma(b)} = ${ans}.`], { q: `${comma(a)} ÷ ${comma(b)} = ?`, expr: `${a}/${b}` });
  }
  if (t === 2) {
    const D = r.int(2, 9) * 10, q = r.int(2, 9) * 10, b = D + r.int(-4, 4), a = D * q + r.int(-30, 30);
    return mc(r, q, [q * 10, q / 10, q + 10], { q: `Which is the best estimate of ${comma(a)} ÷ ${b}?`, steps: [`${b} is close to ${D}. ${comma(a)} is close to ${comma(D * q)}, which ${D} divides easily.`, `${comma(D * q)} ÷ ${D} = ${q}.`, `So the best estimate is ${q}.`] });
  }
  const per = r.pick([20, 30, 40, 50, 60, 80]), n = r.int(2, 9) * 10, total = per * n;
  return num(n, [`Putting ${comma(total)} into groups of ${per} means divide.`, `${comma(total)} ÷ ${per} is the same as ${total / 10} ÷ ${per / 10} = ${n}.`, `So ${n} crates are filled.`], { q: `A factory packs ${comma(total)} bottles into crates of ${per}. How many crates can it fill?`, expr: `${total}/${per}` });
});

// ───────────── 5. Exponents ─────────────
skill('6-expform', 6, 'Exponents', 'Write and find powers', ['A power like 5^3 means 5 × 5 × 5: the base is 5 and the exponent is 3.', 'To find a missing exponent, count how many times the base is multiplied.'], (r) => {
  const t = r.int(0, 3), b = r.int(2, 6), e = r.int(2, b <= 3 ? 6 : 4);
  if (t === 0) return mc(r, `${b}^${e}`, [`${e}^${b}`, `${b}^${e + 1}`, `${b} × ${e}`], { q: `Write ${Array(e).fill(b).join(' × ')} as a power.`, steps: [`The number being multiplied is ${b}: that is the base.`, `It is used ${e} times: that is the exponent.`, `So it is ${b}^${e}.`] });
  if (t === 1) return num(e, [`Multiply by ${b} again and again: ${Array.from({ length: e }, (_, i) => b ** (i + 1)).join(', ')}.`, `We used ${e} factors of ${b} to reach ${comma(b ** e)}.`, `So the exponent is ${e}.`], { q: `${b}^☐ = ${comma(b ** e)}. What is the missing exponent?`, expr: `Math.round(Math.log(${b ** e})/Math.log(${b}))` });
  if (t === 2) { const e2 = r.int(2, 3), b2 = r.int(2, e2 === 2 ? 12 : 6); return num(b2, [`We need a number that, used ${e2} times as a factor, gives ${b2 ** e2}.`, `Try ${b2}: ${Array(e2).fill(b2).join(' × ')} = ${b2 ** e2}.`, `So the base is ${b2}.`], { q: `☐^${e2} = ${b2 ** e2}. What is the missing base?`, expr: `Math.round(${b2 ** e2}**(1/${e2}))` }); }
  const k = r.int(2, 7);
  return r.bool() ? num(10 ** k, [`10^${k} is 1 followed by ${k} zeros.`, `So 10^${k} = ${comma(10 ** k)}.`], { q: `10^${k} = ?`, expr: `10**${k}` })
    : num(k, [`${comma(10 ** k)} is 1 followed by ${k} zeros.`, `So the exponent is ${k}.`], { q: `10^☐ = ${comma(10 ** k)}. What is the missing exponent?`, expr: String(k) });
});

// ───────────── 6. Mixed operations: whole numbers ─────────────
skill('6-orderops', 6, 'Mixed operations', 'Order of operations with exponents', ['Brackets first, then exponents, then × and ÷ from left to right, then + and − from left to right.', 'Moving the brackets can change the value.'], (r) => {
  const t = r.int(0, 4), a = r.int(2, 9), b = r.int(2, 6), c = r.int(2, 9), d = r.int(1, 9);
  if (t === 0) { const v = a + b * b * c; return num(v, [`No brackets. Exponent first: ${b}^2 = ${b * b}.`, `Then multiply: ${b * b} × ${c} = ${b * b * c}.`, `Then add: ${a} + ${b * b * c} = ${v}. So the answer is ${v}.`], { q: `${a} + ${b}^2 × ${c} = ?`, expr: X(`${a} + ${b}^2 × ${c}`) }); }
  if (t === 1) { const s = a + b, v = s * s - d; return num(v, [`Brackets first: ${a} + ${b} = ${s}.`, `Exponent: ${s}^2 = ${s * s}.`, `Then subtract: ${s * s} − ${d} = ${v}. So the answer is ${v}.`], { q: `(${a} + ${b})^2 − ${d} = ?`, expr: X(`(${a} + ${b})^2 − ${d}`) }); }
  if (t === 2) {
    const k = r.int(2, 9), m = k * b, v = 100 + k * c - a * d;
    return num(v, [`× and ÷ from left to right: ${m} ÷ ${b} = ${k}, then ${k} × ${c} = ${k * c}. Also ${a} × ${d} = ${a * d}.`, `Now + and − from left to right: 100 + ${k * c} − ${a * d}.`, `That is ${v}. So the answer is ${v}.`], { q: `100 + ${m} ÷ ${b} × ${c} − ${a} × ${d} = ?`, expr: X(`100 + ${m} ÷ ${b} × ${c} − ${a} × ${d}`) });
  }
  if (t === 3) {
    const p = c + 1 + r.int(0, 4), q = c;
    const opts = [`(${a} + ${b}) × ${p} − ${q}`, `${a} + ${b} × (${p} − ${q})`, `${a} + ${b} × ${p} − ${q}`];
    const vals = opts.map((s) => Function(`return ${X(s)}`)());
    if (new Set(vals).size < 3) return num(vals[0], [`Brackets first: ${a} + ${b} = ${a + b}.`, `Then ${a + b} × ${p} = ${(a + b) * p}, and ${(a + b) * p} − ${q} = ${vals[0]}.`, `So the answer is ${vals[0]}.`], { q: `${opts[0]} = ?`, expr: X(opts[0]) });
    const k = r.int(0, 2);
    return mc(r, opts[k], opts.filter((_, i) => i !== k), { q: `Which expression has the value ${vals[k]}?`, steps: [`Work out each one, brackets first: ${opts[0]} = ${vals[0]}.`, `${opts[1]} = ${vals[1]}, and ${opts[2]} = ${vals[2]}.`, `So ${opts[k]} has the value ${vals[k]}.`] });
  }
  const right = a + b * c, wrong = (a + b) * c, nm = r.pick(NAMES);
  return num(right, [`${nm} added first: (${a} + ${b}) × ${c} = ${wrong}. That is the mistake.`, `Multiply before adding: ${b} × ${c} = ${b * c}.`, `Then ${a} + ${b * c} = ${right}. The correct value is ${right}.`], { q: `${nm} worked out ${a} + ${b} × ${c} and got ${wrong}. What is the correct value?`, expr: `${a}+${b}*${c}` });
});
skill('6-wordmix', 6, 'Mixed operations', 'Multi-step word problems', ['Read carefully and decide which operations to use.', 'Some problems give extra numbers you do not need. Some are easiest to solve by guessing and checking.'], (r) => {
  const t = r.int(0, 4), nm = r.pick(NAMES);
  if (t === 0) {
    const n = r.int(3, 9), p = r.int(4, 18), bill = [50, 100, 200].find((x) => x > n * p);
    return num(bill - n * p, [`Cost: ${n} × $${p} = $${n * p}.`, `Change: $${bill} − $${n * p} = $${bill - n * p}.`, `So the change is $${bill - n * p}.`], { q: `${nm} buys ${n} books at $${p} each and pays with a $${bill} bill. How much change does ${nm} get, in dollars?`, expr: `${bill}-${n}*${p}` });
  }
  if (t === 1) {
    const cows = r.int(2, 15), hens = r.int(2, 20), H = cows + hens, L = 4 * cows + 2 * hens;
    return num(cows, [`If all ${H} animals were hens, there would be ${2 * H} legs.`, `There are ${L - 2 * H} extra legs, and each cow adds 2 extra legs: ${L - 2 * H} ÷ 2 = ${cows}.`, `Check: ${cows} cows × 4 + ${hens} hens × 2 = ${L}. So there are ${cows} cows.`], { q: `A farm has hens and cows. There are ${H} heads and ${L} legs. How many cows are there?`, expr: `(${L}-2*${H})/2` });
  }
  if (t === 2) {
    const big = r.int(20, 80), small = r.int(5, big - 1);
    return num(big, [`Guess and check, or use a shortcut: add the sum and the difference, then halve. ${big + small} + ${big - small} = ${2 * big}.`, `${2 * big} ÷ 2 = ${big}, and the other number is ${small}.`, `Check: ${big} + ${small} = ${big + small} and ${big} − ${small} = ${big - small}. The larger number is ${big}.`], { q: `Two numbers add to ${big + small}. Their difference is ${big - small}. What is the larger number?`, expr: `(${big + small}+${big - small})/2` });
  }
  if (t === 3) {
    const per = r.int(12, 36), trays = r.int(3, 9), age = r.int(25, 60);
    return num(per * trays, [`We need the muffins per tray and the number of trays. The baker's age (${age}) is extra information.`, `${per} × ${trays} = ${per * trays}.`, `So ${per * trays} muffins are baked each morning.`], { q: `A baker who is ${age} years old fills ${trays} trays each morning. Each tray holds ${per} muffins. How many muffins are baked each morning?`, expr: `${per}*${trays}` });
  }
  const op = r.pick(['÷', '+', '−']);
  if (op === '÷') { const share = r.int(12, 45), kids = r.int(3, 9); return num(share, [`Sharing equally means divide.`, `${share * kids} ÷ ${kids} = ${share}.`, `So each friend gets ${share} stickers.`], { q: `${share * kids} stickers are shared equally among ${kids} friends. How many stickers does each friend get?`, expr: `${share * kids}/${kids}` }); }
  const a = r.int(150, 900), b = r.int(40, 140);
  return op === '+' ? num(a + b, [`"More than" here means add.`, `${a} + ${b} = ${a + b}.`, `So ${nm} has ${a + b} cards.`], { q: `Sam has ${a} trading cards. ${nm} has ${b} more than Sam. How many cards does ${nm} have?`, expr: `${a}+${b}` })
    : num(a - b, [`"Fewer than" means subtract.`, `${a} − ${b} = ${a - b}.`, `So ${nm} has ${a - b} cards.`], { q: `Sam has ${a} trading cards. ${nm} has ${b} fewer than Sam. How many cards does ${nm} have?`, expr: `${a}-${b}` });
});
skill('6-inout', 6, 'Mixed operations', 'Input/output tables', ['Find the rule that turns each input into its output.', 'Check the rule on every row, then use it.'], (r) => {
  const t = r.int(0, 3), m = r.int(2, 9), k = r.int(1, 15);
  const rules = [[`multiply by ${m}, then add ${k}`, (x) => m * x + k, `× ${m}, then + ${k}`], [`multiply by ${m}`, (x) => m * x, `× ${m}`], [`add ${k + 5}`, (x) => x + k + 5, `+ ${k + 5}`], [`divide by ${m}`, (x) => x / m, `÷ ${m}`]];
  const [say, f, short] = rules[t];
  const ins = t === 3 ? r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 4).map((x) => x * m) : r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]).slice(0, 4);
  if (r.bool(0.35)) {
    return mc(r, short, rules.filter((_, i) => i !== t).map((x) => x[2]), { q: 'Which rule turns each input into its output?', visual: { type: 'table', head: ['Input', 'Output'], rows: ins.slice(0, 3).map((x) => [x, f(x)]) }, steps: [`Try the rule on the first row: ${ins[0]} → ${f(ins[0])}.`, `It works on every row, so the rule is: ${say}.`] });
  }
  const rows = ins.map((x, i) => [x, i < 3 ? f(x) : '?']), ans = f(ins[3]);
  return num(ans, [`Look at the rows: ${ins.slice(0, 2).map((x) => `${x} → ${f(x)}`).join(', ')}.`, `The rule is: ${say}. It works on every row.`, `${ins[3]} → ${ans}. So the missing output is ${ans}.`], { q: 'Find the missing output.', visual: { type: 'table', head: ['Input', 'Output'], rows }, expr: String(ans) });
});

// ───────────── 7. Number theory ─────────────
skill('6-primefact', 6, 'Number theory', 'Primes, factors and prime factorization', ['A prime number has exactly two factors: 1 and itself. A composite number has more.', 'Prime factorization writes a number as a product of primes, like 72 = 2^3 × 3^2.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const n = r.int(11, 99), p = isPrime(n), f = p ? null : [2, 3, 5, 7].find((d) => n % d === 0);
    return mc(r, p ? 'Prime' : 'Composite', ['Prime', 'Composite'], { q: `Is ${n} prime or composite?`, steps: p ? [`Try small primes: ${n} does not divide by 2, 3, 5 or 7.`, `Its only factors are 1 and ${n}, so ${n} is prime.`] : [`${n} ÷ ${f} = ${n / f}, so ${f} is a factor.`, `It has more than two factors, so ${n} is composite.`] });
  }
  if (t === 1) {
    const n = r.pick([24, 30, 36, 40, 42, 48, 54, 56, 60, 63, 72, 84, 90, 96]);
    const all = Array.from({ length: n }, (_, i) => i + 1), fs = all.filter((d) => n % d === 0 && d > 1 && d < n), nf = all.filter((d) => n % d && d > 2 && d < 20);
    const right = r.pick(fs);
    return mc(r, right, r.shuffle(nf).slice(0, 3), { q: `Which number is a factor of ${n}?`, steps: [`A factor divides ${n} with nothing left over.`, `${n} ÷ ${right} = ${n / right}, so ${right} is a factor of ${n}.`] });
  }
  const e2 = r.int(1, 4), e3 = r.int(0, 2), e5 = r.int(0, 1), e7 = e3 + e5 < 2 ? r.int(0, 1) : 0, n = 2 ** e2 * 3 ** e3 * 5 ** e5 * 7 ** e7;
  const show = (a, b, c, d) => [[2, a], [3, b], [5, c], [7, d]].filter(([, e]) => e > 0).map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`)).join(' × ');
  const right = show(e2, e3, e5, e7);
  if (t === 2) {
    const wrongs = [show(e2 + 1, e3, e5, e7), show(Math.max(1, e2 - 1), e3 + 1, e5, e7), e2 >= 2 ? `4 × ${n / 4}` : `2 × ${n / 2}`];
    return mc(r, right, wrongs, { q: `Which is the prime factorization of ${n}?`, steps: [`Divide by primes until you reach 1: ${n} = ${Array(e2).fill(2).concat(Array(e3).fill(3), Array(e5).fill(5), Array(e7).fill(7)).join(' × ')}.`, `Group repeated primes with exponents: ${n} = ${right}.`] });
  }
  return num(n, [`Work out each power: ${[[2, e2], [3, e3], [5, e5], [7, e7]].filter(([, e]) => e > 0).map(([p, e]) => `${p}^${e} = ${p ** e}`).join(', ')}.`, `Multiply them together: ${n}.`, `So the number is ${n}.`], { q: `What number has the prime factorization ${right}?`, expr: X(right) });
});
skill('6-gcfword', 6, 'Number theory', 'GCF and LCM word problems', ['Use the GCF to split things into the greatest number of equal groups.', 'Use the LCM to find when two repeating events happen together again.'], (r) => {
  const g = r.int(2, 12), a = g * r.int(2, 7), b0 = g * r.int(2, 7), b = b0 === a ? a + g : b0, G = gcd(a, b), L = lcm(a, b), t = r.int(0, 2);
  if (t === 0) return num(G, [`Every bag must be the same, so the number of bags must divide both ${a} and ${b}.`, `The greatest common factor of ${a} and ${b} is ${G}.`, `So the greatest number of bags is ${G}.`], { q: `A teacher has ${a} pencils and ${b} erasers. She makes identical bags with nothing left over. What is the greatest number of bags she can make?`, expr: String(G) });
  if (t === 1) {
    const x = r.pick([4, 6, 8, 9, 10, 12, 15]), y = r.pick([6, 9, 10, 12, 14, 16, 18, 20].filter((v) => v !== x)), M = lcm(x, y);
    return num(M, [`Bus A leaves at ${x}, ${2 * x}, ${3 * x}, … minutes. Bus B leaves at ${y}, ${2 * y}, ${3 * y}, … minutes.`, `The least common multiple of ${x} and ${y} is ${M}.`, `So they leave together again after ${M} minutes.`], { q: `Bus A leaves every ${x} minutes and bus B leaves every ${y} minutes. Both leave at 08:00. After how many minutes will they next leave together?`, expr: String(M) });
  }
  return num(L, [`We want a number of hot dogs that is a multiple of ${a} and also of ${b}.`, `The least common multiple of ${a} and ${b} is ${L}.`, `So the smallest number is ${L}.`], { q: `Hot dogs come in packs of ${a} and buns come in packs of ${b}. What is the smallest number of hot dogs you can buy so that you can buy exactly the same number of buns?`, expr: String(L) });
});

// ───────────── 8. Decimals ─────────────
skill('6-decplace', 6, 'Decimals', 'Decimal place value and word names', ['After the decimal point come tenths, hundredths, then thousandths.', '4.207 = 4 + 0.2 + 0.007. We read it "four and two hundred seven thousandths".'], (r) => {
  const t = r.int(0, 4), s = distinctDigits(r, 5), x = Number(s.slice(0, 2) + '.' + s.slice(2));
  if (t === 0) {
    const k = r.int(0, 4), d = s[k], place = ['tens', 'ones', ...DPL][k];
    return mc(r, place, r.shuffle(['tens', 'ones', ...DPL].filter((p) => p !== place)), { q: `In ${x.toFixed(3)}, which place is the digit ${d} in?`, steps: [`The places are tens, ones, then after the point: tenths, hundredths, thousandths.`, `The ${d} is in the ${place} place.`] });
  }
  if (t === 1) {
    const dp = r.int(1, 3), y = Number((r.int(1, 99) + r.int(1, 10 ** dp - 1) / 10 ** dp).toFixed(dp)), right = decWords(y, dp);
    const swap = { ' tenths': ' hundredths', ' tenth': ' hundredth', ' hundredths': ' thousandths', ' hundredth': ' thousandth', ' thousandths': ' tenths', ' thousandth': ' tenth' };
    const wrongs = [right.replace(/ (tenths?|hundredths?|thousandths?)$/, (m) => swap[m]), `${words(Math.floor(y))} point ${y.toFixed(dp).split('.')[1].split('').map((c) => ONE[c]).join(' ')} ${DPL[dp - 1]}`, decWords(Number((Math.floor(y) * 10 + y - Math.floor(y)).toFixed(dp)), dp)];
    return mc(r, right, wrongs, { q: `Which is the word name for ${y.toFixed(dp)}?`, steps: [`Say the whole number, then "and" for the decimal point.`, `The last digit is in the ${DPL[dp - 1]} place, so we read: ${right}.`] });
  }
  if (t === 2) {
    const parts = [Number(s[0]) * 10, Number(s[1]), Number(s[2]) / 10, Number(s[3]) / 100, Number(s[4]) / 1000].filter((v) => v);
    return num(dec(x), [`Each part fills one place.`, `${parts.join(' + ')} = ${dec(x)}.`, `So the number is ${dec(x)}.`], { q: `Write in standard form: ${parts.join(' + ')}`, expr: parts.join('+') });
  }
  if (t === 3) {
    const d = r.int(1, 9), w = r.int(0, 9), right = `${w}.${d}0`;
    return mc(r, right, [`${w}.0${d}`, `${w}.00${d}`, `${w + d}.0`], { q: `Which decimal is equal to ${w}.${d}?`, steps: [`Adding zeros at the end of a decimal does not change its value.`, `${w}.${d} = ${right}, since ${d} tenths = ${d}0 hundredths.`] });
  }
  const n = r.int(1, 9);
  return num(dec(n / 10), [`The strip is cut into 10 equal parts, so each part is 0.1.`, `${n} parts are shaded: ${n} tenths = ${dec(n / 10)}.`], { q: 'What decimal is shaded?', visual: { type: 'fraction', n, d: 10 }, expr: `${n}/10` });
});
skill('6-decround', 6, 'Decimals', 'Round decimals', ['Look at the digit just to the right of the place you are rounding to.', '5 or more: round up. 4 or less: keep the digit.'], (r) => {
  if (r.bool(0.7)) {
    const x = r.int(1000, 99999) / 1000, k = r.int(0, 2), p = [1, 0.1, 0.01][k], ans = dec(Math.round(x / p + 1e-9) * p);
    const name = ['the nearest whole number', 'the nearest tenth', 'the nearest hundredth'][k], sx = x.toFixed(3), next = sx[sx.indexOf('.') + 1 + k];
    return num(ans, [`Look at the digit after the ${['ones', 'tenths', 'hundredths'][k]} place: it is ${next}.`, `${Number(next) >= 5 ? 'That is 5 or more, so round up' : 'That is 4 or less, so keep the digit'}.`, `So ${x} rounds to ${ans}.`], { q: `Round ${x} to ${name}.`, expr: `Math.round(${x}/${p}+1e-9)*${p}` });
  }
  const w = r.int(1, 30), up = r.bool(), t1 = r.int(1, 8), h = up ? r.int(5, 9) : r.int(0, 4), target = dec(w + (up ? t1 + 1 : t1) / 10);
  return num(t1, [`The hundredths digit is ${h}, so we round ${up ? 'up: the tenths digit goes up by 1' : 'down: the tenths digit stays the same'}.`, `${w}.${t1}${h} rounds to ${target}.`, `So the missing digit is ${t1}.`], { q: `${w}.☐${h} rounded to the nearest tenth is ${target}. What is the missing digit?`, expr: String(t1) });
});
skill('6-deccomp', 6, 'Decimals', 'Compare and order decimals', ['Line up the decimal points, then compare place by place from the left.', 'Writing zeros at the end can help: 0.5 = 0.50.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const a = r.int(100, 9999) / 1000, b = r.bool(0.15) ? a : Number((a + r.pick([0.1, 0.01, 0.001, -0.01, 0.09, 0.2])).toFixed(3)), s = cmpSign(a, b);
    return mc(r, s, ['<', '>', '='], { q: `Which sign makes this true? ${a} ☐ ${b}`, steps: [`Write both with 3 decimal places: ${a.toFixed(3)} and ${b.toFixed(3)}.`, `Compare from the left: ${a.toFixed(3)} ${s} ${b.toFixed(3)}.`, `So ${a} ${s} ${b}.`] });
  }
  if (t === 1) {
    const w = r.int(0, 5), xs = r.shuffle([w + r.int(1, 9) / 10, w + r.int(10, 99) / 100, w + r.int(100, 999) / 1000, w + r.int(1, 9) / 100].map((v) => Number(v.toFixed(3)))).filter((v, i, a) => a.indexOf(v) === i);
    const up = [...xs].sort((a, b) => a - b), right = up.join(', ');
    return mc(r, right, [[...up].reverse().join(', '), [...xs].sort((a, b) => String(a).length - String(b).length || a - b).join(', '), r.shuffle(xs).join(', ')], { q: `Which list is in order from least to greatest?`, steps: [`Write each with 3 decimal places: ${xs.map((v) => v.toFixed(3)).join(', ')}.`, `Compare them: ${up.map((v) => v.toFixed(3)).join(' < ')}.`, `So the order is ${right}.`] });
  }
  if (t === 2) {
    const a = r.int(0, 8), k = r.int(1, 9), x = dec(a + k / 10);
    return num(x, [`From ${a} to ${a + 1} there are 10 equal steps, so each step is 0.1.`, `The dot is ${k} steps past ${a}: ${a} + ${dec(k / 10)} = ${x}.`, `So the dot is at ${x}.`], { q: 'What decimal does the dot show?', visual: numberLine(a, a + 1, { step: 0.1, marks: [a + k / 10] }), expr: `${a}+${k}/10` });
  }
  const ppl = names(r, 4), times = r.shuffle([12.4, 12.38, 12.5, 12.09, 12.45, 12.3]).slice(0, 4), best = Math.min(...times), who = ppl[times.indexOf(best)];
  return mc(r, who, ppl, { q: 'In a 100 m race, the fastest runner has the smallest time. Who was fastest?', visual: { type: 'table', head: ['Runner', 'Time (s)'], rows: ppl.map((p, i) => [p, times[i].toFixed(2)]) }, steps: [`Compare the times: ${times.map((v) => v.toFixed(2)).join(', ')}.`, `The smallest is ${best.toFixed(2)} s.`, `So ${who} was fastest.`] });
});

// ───────────── 9. Add and subtract decimals ─────────────
skill('6-decaddsub', 6, 'Add and subtract decimals', 'Add and subtract decimals', ['Line up the decimal points, fill empty places with zeros, then work as with whole numbers.', 'To estimate, round each decimal to the nearest whole number first.'], (r) => {
  const t = r.int(0, 3), a = r.int(100, 9999) / 100, b = r.int(10, 999) / (r.bool() ? 10 : 100);
  const [x, y] = a > b ? [a, b] : [b, a];
  if (t === 0) { const add = r.bool(); return num(dec(add ? x + y : x - y), add ? columnAdd([x, y]) : columnSub(x, y), { q: `${x} ${add ? '+' : '−'} ${y} = ?`, expr: `${x}${add ? '+' : '-'}${y}` }); }
  if (t === 1) {
    const nm = r.pick(NAMES), add = r.bool(), ans = dec(add ? x + y : x - y);
    const q = add ? `${nm} cycled ${x} km on Saturday and ${y} km on Sunday. How far is that in total, in km?` : `A rope is ${x} m long. ${nm} cuts off ${y} m. How many metres are left?`;
    return num(ans, [add ? '"In total" means add.' : 'Cutting off means subtract.', `Line up the points: ${x} ${add ? '+' : '−'} ${y} = ${ans}.`, `So the answer is ${ans}.`], { q, expr: `${x}${add ? '+' : '-'}${y}` });
  }
  if (t === 2) {
    const add = r.bool(), X1 = Math.round(x), Y1 = Math.round(y), ans = add ? X1 + Y1 : X1 - Y1;
    return num(ans, [`Round to the nearest whole number: ${x} → ${X1} and ${y} → ${Y1}.`, `${X1} ${add ? '+' : '−'} ${Y1} = ${ans}.`, `So the estimate is ${ans}.`], { q: `Estimate ${x} ${add ? '+' : '−'} ${y} by rounding each number to the nearest whole number.`, expr: `${X1}${add ? '+' : '-'}${Y1}` });
  }
  const [A, B, C] = r.shuffle(['Elm Park', 'Riverside', 'Hilltop', 'Lakeview', 'Maple Bay']).slice(0, 3), ab = r.int(12, 89) / 10, bc = r.int(105, 499) / 100;
  return num(dec(ab + bc), [`Going through ${B} means adding the two distances.`, `${ab} + ${bc} = ${dec(ab + bc)}.`, `So the trip is ${dec(ab + bc)} km.`], { q: `On a map, ${A} to ${B} is ${ab} km and ${B} to ${C} is ${bc} km. How far is it from ${A} to ${C} through ${B}, in km?`, visual: { type: 'table', head: ['Road', 'Distance (km)'], rows: [[`${A} – ${B}`, ab], [`${B} – ${C}`, bc]] }, expr: `${ab}+${bc}` });
});

// ───────────── 10. Multiply and divide decimals ─────────────
skill('6-decmul', 6, 'Multiply and divide decimals', 'Multiply decimals', ['Multiply as if there were no decimal points.', 'Then count the decimal places in both factors: the answer has that many.'], (r) => {
  const t = r.int(0, 3);
  if (t <= 1) {
    const a = r.int(11, 999) / (r.bool() ? 10 : 100), b = t === 0 ? r.int(2, 39) : r.int(2, 99) / 10, A = Math.round(a * 10 ** dpOf(a)), B = Math.round(b * 10 ** dpOf(b)), k = dpOf(a) + dpOf(b), ans = dec(a * b);
    return num(ans, [`Ignore the points: ${A} × ${B} = ${comma(A * B)}.`, `Decimal places: ${dpOf(a)} in ${a}${dpOf(b) ? ` and ${dpOf(b)} in ${b}` : ''}, so ${k} in all.`, `Put ${k} decimal place${k > 1 ? 's' : ''} in the answer: ${a} × ${b} = ${ans}.`], { q: `${a} × ${b} = ?`, expr: `${a}*${b}` });
  }
  if (t === 2) {
    const A = r.int(12, 98), B = r.int(12, 98), a = A / 10, b = B / r.pick([10, 100]), ans = dec(a * b);
    return mc(r, ans, [dec(a * b * 10), dec(a * b / 10), dec(a * b * 100)], { q: `${A} × ${B} = ${comma(A * B)}. So what is ${a} × ${b}?`, steps: [`${a} has ${dpOf(a)} decimal place and ${b} has ${dpOf(b)}.`, `So the answer has ${dpOf(a) + dpOf(b)} decimal places: ${ans}.`] });
  }
  const price = r.int(105, 999) / 100, n = r.int(2, 9), nm = r.pick(NAMES), item = r.pick(['notebooks', 'muffins', 'bus tickets', 'pens']), c = Math.round(price * 100);
  return num(dec(price * n), [`Equal groups: multiply. ${n} × ${money(price)}.`, `In cents: ${c} × ${n} = ${c * n}.`, `That is ${money(c * n / 100)}, so the answer is ${dec(price * n)} dollars.`], { q: `${nm} buys ${n} ${item} at ${money(price)} each. How much does ${nm} spend, in dollars?`, expr: `${price}*${n}` });
});
skill('6-decdiv', 6, 'Multiply and divide decimals', 'Divide decimals', ['To divide by a decimal, multiply both numbers by 10 or 100 so the divisor is a whole number.', 'Then divide, keeping the decimal point in line.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) { const d = r.int(2, 9), q = r.int(11, 999) / 100, a = dec(q * d); return num(dec(q), [`Divide as whole numbers: ${Math.round(q * d * 100)} ÷ ${d} = ${Math.round(q * 100)}.`, `Put the decimal point back: the answer has 2 decimal places.`, `So ${a} ÷ ${d} = ${dec(q)}.`], { q: `${a} ÷ ${d} = ?`, expr: `${a}/${d}` }); }
  if (t === 1) {
    const d = r.pick([0.2, 0.4, 0.5, 0.25, 0.3, 0.6, 0.8]), q = r.int(2, 30), a = dec(q * d), m = d === 0.25 ? 100 : 10;
    return num(q, [`Multiply both numbers by ${m} so the divisor is whole: ${a} ÷ ${d} = ${dec(q * d * m)} ÷ ${dec(d * m)}.`, `${dec(q * d * m)} ÷ ${dec(d * m)} = ${q}.`, `So ${a} ÷ ${d} = ${q}.`], { q: `${a} ÷ ${d} = ?`, expr: `${a}/${d}` });
  }
  if (t === 2) { const d = r.int(2, 9) / 10, q = r.int(12, 95) / 10, a = dec(q * d); return num(dec(q), [`Multiply both numbers by 10: ${a} ÷ ${d} = ${dec(q * d * 10)} ÷ ${dec(d * 10)}.`, `${dec(q * d * 10)} ÷ ${dec(d * 10)} = ${dec(q)}.`, `So ${a} ÷ ${d} = ${dec(q)}.`], { q: `${a} ÷ ${d} = ?`, expr: `${a}/${d}` }); }
  if (t === 3) { const d = r.pick([4, 8, 5, 2, 20, 25]), a = d * r.int(1, 12) + r.pick(d === 8 ? [1, 3, 5, 7] : d === 4 ? [1, 2, 3] : [1]), ans = dec(a / d); return num(ans, [`${a} ÷ ${d} does not come out even, so keep dividing past the decimal point.`, `Write ${a} as ${a}.000 and divide: ${a} ÷ ${d} = ${ans}.`, `So the answer is ${ans}.`], { q: `${a} ÷ ${d} = ? (as a decimal)`, expr: `${a}/${d}` }); }
  const n = r.int(2, 8), each = r.int(105, 1999) / 100, c = Math.round(each * 100);
  return num(dec(each), [`Sharing equally means divide: ${money(each * n)} ÷ ${n}.`, `In cents: ${c * n} ÷ ${n} = ${c}.`, `That is ${money(each)} each, so the answer is ${dec(each)}.`], { q: `${n} friends share a bill of ${money(each * n)} equally. How much does each pay, in dollars?`, expr: `${c * n}/${n}/100` });
});
skill('6-decest', 6, 'Multiply and divide decimals', 'Decimal patterns and estimates', ['× 10 moves each digit one place left; ÷ 10 moves it one place right.', 'Multiplying by a number less than 1 gives a smaller answer; dividing by it gives a bigger one.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const x = r.int(11, 9999) / 100, p = r.pick([10, 100, 1000]), mul = r.bool(), z = String(p).length - 1, ans = dec(mul ? x * p : x / p); return num(ans, [`${p} has ${z} zero${z > 1 ? 's' : ''}, so move each digit ${z} place${z > 1 ? 's' : ''} to the ${mul ? 'left' : 'right'}.`, `So ${x} ${mul ? '×' : '÷'} ${p} = ${ans}.`], { q: `${x} ${mul ? '×' : '÷'} ${p} = ?`, expr: `${x}${mul ? '*' : '/'}${p}` }); }
  if (t === 1) { const d = r.int(2, 9), q = r.int(2, 12), k = r.int(1, 2), a = dec(q * d / 10 ** k), ans = dec(q / 10 ** k); return num(ans, [`${q * d} ÷ ${d} = ${q}.`, `${a} is ${q * d} ÷ ${10 ** k}, so the answer is ${q} ÷ ${10 ** k}.`, `So ${a} ÷ ${d} = ${ans}.`], { q: `${q * d} ÷ ${d} = ${q}. Use this to find ${a} ÷ ${d}.`, expr: `${a}/${d}` }); }
  if (t === 2) {
    const a = r.int(12, 99) / 10, b = r.pick([0.4, 0.5, 0.8, 1.2, 1.5, 2.5, 0.9]), mul = r.bool(), big = mul ? b > 1 : b < 1;
    return mc(r, big ? 'Greater' : 'Less', ['Greater', 'Less'], { q: `Without working it out: is ${a} ${mul ? '×' : '÷'} ${b} greater or less than ${a}?`, steps: [`${b} is ${b > 1 ? 'more' : 'less'} than 1.`, `${mul ? 'Multiplying' : 'Dividing'} by a number ${b > 1 ? 'more' : 'less'} than 1 makes the answer ${big ? 'bigger' : 'smaller'}.`, `So the answer is ${big ? 'greater' : 'less'} than ${a}.`] });
  }
  const a = r.int(15, 94) / 10, b = r.int(15, 94) / 10, A = Math.round(a), B = Math.round(b);
  return num(A * B, [`Round each to the nearest whole number: ${a} → ${A}, ${b} → ${B}.`, `${A} × ${B} = ${A * B}.`, `So the estimate is ${A * B}.`], { q: `Estimate ${a} × ${b} by rounding each number to the nearest whole number.`, expr: `${A}*${B}` });
});

// ───────────── 11. Mixed operations: decimals ─────────────
skill('6-decmixed', 6, 'Mixed operations: decimals', 'Mixed operations with decimals', ['Use the order of operations with decimals too: brackets, then × and ÷, then + and −.', 'Line up the decimal points when you add or subtract.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const a = r.int(11, 99) / 10, b = r.int(2, 9) / 10, c = r.int(2, 9), ans = dec(a + b * c); return num(ans, [`Multiply first: ${b} × ${c} = ${dec(b * c)}.`, `Then add: ${a} + ${dec(b * c)} = ${ans}.`, `So the answer is ${ans}.`], { q: `${a} + ${b} × ${c} = ?`, expr: `${a}+${b}*${c}` }); }
  if (t === 1) { const a = r.int(11, 49) / 10, b = r.int(11, 49) / 10, c = r.pick([2, 4, 5]), ans = dec((a + b) * c); return num(ans, [`Brackets first: ${a} + ${b} = ${dec(a + b)}.`, `Then multiply: ${dec(a + b)} × ${c} = ${ans}.`, `So the answer is ${ans}.`], { q: `(${a} + ${b}) × ${c} = ?`, expr: `(${a}+${b})*${c}` }); }
  const n = r.int(2, 5), p1 = r.int(125, 450) / 100, p2 = r.int(150, 600) / 100, nm = r.pick(NAMES), total = dec(n * p1 + p2);
  return num(total, [`Juice: ${n} × ${money(p1)} = ${money(n * p1)}.`, `Add the sandwich: ${money(n * p1)} + ${money(p2)} = ${money(n * p1 + p2)}.`, `So the total is ${total} dollars.`], { q: `${nm} buys ${n} juice boxes at ${money(p1)} each and one sandwich for ${money(p2)}. What is the total cost, in dollars?`, expr: `${n}*${p1}+${p2}` });
});

// ───────────── 12. Fractions and mixed numbers ─────────────
const fracPair2 = (r, d) => { let a = r.int(1, d - 1); while (gcd(a, d) !== 1) a = r.int(1, d - 1); return a; };
const fracPair = (r, maxD = 12) => { const b = r.int(2, maxD); let a = r.int(1, b - 1); while (gcd(a, b) !== 1) a = r.int(1, b - 1); return [a, b]; };
skill('6-fracequiv', 6, 'Fractions', 'Equivalent fractions and mixed numbers', ['Multiply or divide the top and bottom by the same number to get an equivalent fraction.', 'An improper fraction like 17/5 is the mixed number 3 2/5: 5 goes into 17 three times, with 2 left.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    let [a, b] = fracPair(r); [a, b] = simplify(a, b); const g = r.int(2, 9);
    return num(`${a}/${b}`, [`Find the greatest common factor of ${a * g} and ${b * g}: it is ${gcd(a * g, b * g)}.`, `Divide top and bottom by ${g}: ${a * g} ÷ ${g} = ${a}, ${b * g} ÷ ${g} = ${b}.`, `So ${a * g}/${b * g} in lowest terms is ${a}/${b}.`], { q: `Write ${a * g}/${b * g} in lowest terms.`, exactForm: 'fraction', expr: `${a}/${b}` });
  }
  if (t === 1) {
    const [a, b] = fracPair(r, 10), k = r.int(2, 8);
    return num(a * k, [`${b} × ${k} = ${b * k}, so the bottom was multiplied by ${k}.`, `Do the same to the top: ${a} × ${k} = ${a * k}.`, `So ${a}/${b} = ${a * k}/${b * k}, and the missing number is ${a * k}.`], { q: `${a}/${b} = ☐/${b * k}. What is ☐?`, expr: `${a}*${k}` });
  }
  const d = r.int(2, 9), w = r.int(1, 6); let k = r.int(1, d - 1); while (gcd(k, d) !== 1) k = r.int(1, d - 1);
  const n = w * d + k;
  if (t === 2) return mc(r, `${w} ${k}/${d}`, [`${w + 1} ${k}/${d}`, `${w} ${d - k}/${d}`, `${k} ${w}/${d}`, `${w - 1} ${k}/${d}`].filter((s) => !/^0 /.test(s)), { q: `Write ${n}/${d} as a mixed number.`, steps: [`How many times does ${d} go into ${n}? ${w} times (${w} × ${d} = ${w * d}).`, `${n} − ${w * d} = ${k} left over, so the answer is ${w} ${k}/${d}.`] });
  if (t === 3) return num(`${n}/${d}`, [`Whole part: ${w} × ${d} = ${w * d} ${d === 2 ? 'halves' : 'parts'}.`, `Add the ${k}: ${w * d} + ${k} = ${n}.`, `So ${w} ${k}/${d} = ${n}/${d}.`], { q: `Write ${w} ${k}/${d} as an improper fraction.`, exactForm: 'fraction', expr: `${n}/${d}` });
  const b1 = r.pick([4, 6, 8, 9, 10, 12, 15]), b2 = r.pick([3, 4, 5, 6, 8, 10].filter((x) => x !== b1)), L = lcm(b1, b2);
  return num(L, [`The least common denominator is the least common multiple of ${b1} and ${b2}.`, `Multiples of ${Math.max(b1, b2)}: ${multiplesOf(Math.max(b1, b2), L / Math.max(b1, b2)).join(', ')}. The first one ${Math.min(b1, b2)} divides is ${L}.`, `So the least common denominator is ${L}.`], { q: `What is the least common denominator of 1/${b1} and 1/${b2}?`, expr: String(L) });
});
skill('6-fraccomp', 6, 'Fractions', 'Compare and order fractions', ['To compare fractions, give them a common denominator, then compare the tops.', 'Compare with 1/2: a fraction is more than 1/2 when its top is more than half its bottom.'], (r) => {
  const t = r.int(0, 4);
  const pair = () => { let [a, b] = fracPair(r, 10), [c, d] = fracPair(r, 10); while (a * d === b * c) [c, d] = fracPair(r, 10); return [a, b, c, d]; };
  if (t === 0) {
    const [a, b, c, d] = pair(), L = lcm(b, d), s = cmpSign(a / b, c / d);
    return mc(r, s, ['<', '>', '='], { q: `Which sign makes this true? ${a}/${b} ☐ ${c}/${d}`, visual: fractionBars([{ n: a, d: b }, { n: c, d }]), steps: [`Common denominator ${L}: ${a}/${b} = ${a * L / b}/${L} and ${c}/${d} = ${c * L / d}/${L}.`, `Compare the tops: ${a * L / b} ${s} ${c * L / d}.`, `So ${a}/${b} ${s} ${c}/${d}.`] });
  }
  if (t === 1) {
    const d = r.int(3, 16), n = r.int(1, d - 1), s = cmpSign(2 * n, d), right = { '<': 'Less than 1/2', '>': 'Greater than 1/2', '=': 'Equal to 1/2' }[s];
    return mc(r, right, ['Less than 1/2', 'Greater than 1/2', 'Equal to 1/2'], { q: `Is ${n}/${d} greater than, less than or equal to 1/2?`, steps: [`Half of ${d} is ${d / 2}.`, `The top, ${n}, is ${s === '<' ? 'less than' : s === '>' ? 'more than' : 'equal to'} ${d / 2}, so ${n}/${d} is ${right.toLowerCase()}.`] });
  }
  if (t === 2) {
    const fs = []; while (fs.length < 3) { const [a, b] = fracPair(r, 12); if (!fs.some(([c, d]) => c * b === a * d)) fs.push([a, b]); }
    const up = [...fs].sort((x, y) => x[0] / x[1] - y[0] / y[1]), show = (l) => l.map(([a, b]) => `${a}/${b}`).join(', ');
    return mc(r, show(up), [show([...up].reverse()), show([up[1], up[0], up[2]]), show([up[0], up[2], up[1]])], { q: `Which list is in order from least to greatest?`, steps: [`Change each to a decimal (or use a common denominator): ${fs.map(([a, b]) => `${a}/${b} ≈ ${dec(a / b, 2)}`).join(', ')}.`, `From least to greatest: ${show(up)}.`] });
  }
  if (t === 3) {
    const [a, b, c, d] = pair(), [p, q] = names(r, 2), who = a / b > c / d ? p : q, L = lcm(b, d);
    return mc(r, who, [p, q], { q: `${p} ate ${a}/${b} of a pizza. ${q} ate ${c}/${d} of a same-sized pizza. Who ate more?`, steps: [`Common denominator ${L}: ${a * L / b}/${L} and ${c * L / d}/${L}.`, `${Math.max(a * L / b, c * L / d)}/${L} is more, so ${who} ate more.`] });
  }
  const [a, b] = fracPair(r, 6), k = r.int(2, 3), D = b * k, lim = a * k;
  const right = r.int(lim + 1, D - 1), wrongs = r.shuffle(Array.from({ length: lim }, (_, i) => i + 1)).slice(0, 3);
  return mc(r, right, wrongs, { q: `☐/${D} > ${a}/${b}. Which number could go in the box?`, steps: [`${a}/${b} = ${lim}/${D}.`, `So the top must be more than ${lim}. Of the choices, only ${right} works.`] });
});
const MIXVALS = [['1/2', 0.5], ['3/4', 0.75], ['2/5', 0.4], ['0.65', 0.65], ['1 1/4', 1.25], ['1.3', 1.3], ['0.8', 0.8], ['7/10', 0.7], ['1 3/5', 1.6], ['1.05', 1.05], ['3/8', 0.375], ['0.45', 0.45], ['0.9', 0.9], ['1 1/2', 1.5]];
skill('6-fracdec', 6, 'Fractions', 'Fractions, decimals and mixed numbers', ['A decimal is a fraction with a denominator of 10, 100 or 1000: 0.35 = 35/100 = 7/20.', 'To change a fraction to a decimal, divide the top by the bottom.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const tenths = r.bool(0.3), n = tenths ? r.int(1, 9) : r.int(1, 99), D = tenths ? 10 : 100, x = dec(n / D);
    return num(frac(n, D), [`${x} means ${n} ${tenths ? 'tenths' : 'hundredths'}: ${n}/${D}.`, `Simplify: ${n}/${D} = ${frac(n, D)}.`, `So ${x} = ${frac(n, D)}.`], { q: `Write ${x} as a fraction in simplest form.`, exactForm: 'fraction', expr: `${n}/${D}` });
  }
  if (t === 1) {
    const d = r.pick([2, 4, 5, 8, 20, 25]), n = fracPair2(r, d), w = r.bool(0.3) ? r.int(1, 4) : 0, x = dec(w + n / d);
    return num(x, [`Divide the top by the bottom: ${n} ÷ ${d} = ${dec(n / d)}.`, w ? `Add the whole number: ${w} + ${dec(n / d)} = ${x}.` : `So ${n}/${d} = ${x}.`, `The decimal is ${x}.`], { q: `Write ${w ? `${w} ` : ''}${n}/${d} as a decimal.`, expr: `${w}+${n}/${d}` });
  }
  if (t === 2) {
    const [a, b] = simplify(...fracPair(r, 8)), N = b * r.int(3, 12), nm = r.pick(['students walk to school', 'marbles are blue', 'apples are red']);
    return num(a * N / b, [`Find 1/${b} of ${N}: ${N} ÷ ${b} = ${N / b}.`, `Then ${a}/${b} is ${a} times that: ${a} × ${N / b} = ${a * N / b}.`, `So ${a * N / b} ${nm.split(' ')[0]}.`], { q: `There are ${N} ${nm.split(' ')[0]}. ${a}/${b} of the ${nm}. How many is that?`, expr: `${a}*${N}/${b}` });
  }
  const vs = []; for (const v of r.shuffle(MIXVALS)) if (vs.length < 4 && !vs.some((u) => u[1] === v[1])) vs.push(v);
  const most = r.bool(), pick = vs.reduce((m, v) => (most ? v[1] > m[1] : v[1] < m[1]) ? v : m);
  return mc(r, pick[0], vs.map((v) => v[0]), { q: `Which number is the ${most ? 'greatest' : 'least'}?`, steps: [`Write each as a decimal: ${vs.map(([s, v]) => `${s} = ${v}`).join(', ')}.`, `The ${most ? 'greatest' : 'least'} is ${pick[1]}, which is ${pick[0]}.`] });
});

// ───────────── 13. Add and subtract fractions ─────────────
skill('6-fraclike', 6, 'Add and subtract fractions', 'Like denominators', ['When the denominators are the same, add or subtract the tops and keep the bottom.', 'Then simplify if you can.'], (r) => {
  const t = r.int(0, 2), d = r.int(4, 12), a = r.int(1, d - 1), b = r.int(1, d - 1);
  if (t === 0) {
    const add = r.bool() || a === b, [x, y] = add ? [a, b] : [Math.max(a, b), Math.min(a, b)], top = add ? x + y : x - y;
    return num(frac(top, d), [`The bottoms are both ${d}, so ${add ? 'add' : 'subtract'} the tops: ${x} ${add ? '+' : '−'} ${y} = ${top}.`, `That gives ${top}/${d}${frac(top, d) !== `${top}/${d}` ? `, which simplifies to ${frac(top, d)}` : ''}.`, `So the answer is ${frac(top, d)}.`], { q: `${x}/${d} ${add ? '+' : '−'} ${y}/${d} = ?`, visual: fractionBars([{ n: x, d }, { n: y, d }]), expr: `${x}/${d}${add ? '+' : '-'}${y}/${d}` });
  }
  if (t === 1) {
    const [x, y] = a === b ? [a + 1 > d - 1 ? a : a + 1, a === d - 1 ? a - 1 : a] : [Math.max(a, b), Math.min(a, b)], nm = r.pick(NAMES), top = x - y;
    if (x === y) return num(frac(a + b, d), [`Together means add: ${a}/${d} + ${b}/${d} = ${a + b}/${d}.`, `So the answer is ${frac(a + b, d)} L.`], { q: `${nm} pours ${a}/${d} L of juice and then ${b}/${d} L more. How many litres is that?`, expr: `${a + b}/${d}` });
    return num(frac(top, d), [`"How much is left" means subtract.`, `${x}/${d} − ${y}/${d} = ${top}/${d}.`, `So ${frac(top, d)} L is left.`], { q: `A jug holds ${x}/${d} L of water. ${nm} drinks ${y}/${d} L. How much is left, in litres?`, expr: `${x}/${d}-${y}/${d}` });
  }
  const s = cmpSign(a + b, d);
  return mc(r, s, ['<', '>', '='], { q: `Which sign makes this true? ${a}/${d} + ${b}/${d} ☐ 1`, steps: [`${a}/${d} + ${b}/${d} = ${a + b}/${d}.`, `1 = ${d}/${d}. Compare ${a + b} and ${d}: ${a + b} ${s} ${d}.`, `So the sum ${s} 1.`] });
});
skill('6-fracunlike', 6, 'Add and subtract fractions', 'Unlike denominators', ['Rewrite both fractions with a common denominator.', 'Then add or subtract the tops, and simplify.'], (r) => {
  let [a, b] = fracPair(r, 10), [c, d] = fracPair(r, 10); while (d === b) [c, d] = fracPair(r, 10);
  const L = lcm(b, d), A = a * L / b, C = c * L / d;
  let add = r.bool(); if (A === C) add = true;
  const [p, P, pd, q, Q, qd] = add || A > C ? [a, A, b, c, C, d] : [c, C, d, a, A, b];
  const top = add ? P + Q : P - Q, ans = frac(top, L);
  const steps = [St(`The bottoms are ${pd} and ${qd}. The least common denominator is ${L}.`, fractionBars([{ n: p, d: pd }, { n: q, d: qd }])), St(`${p}/${pd} = ${P}/${L} and ${q}/${qd} = ${Q}/${L}.`), St(`${P}/${L} ${add ? '+' : '−'} ${Q}/${L} = ${top}/${L}${ans !== `${top}/${L}` ? ` = ${ans}` : ''}.`), St(`So the answer is ${ans}.`)];
  if (r.bool(0.35)) {
    const nm = r.pick(NAMES);
    const q2 = add ? `${nm} walked ${p}/${pd} km to the park and then ${q}/${qd} km to a friend's house. How far did ${nm} walk in all, in km?` : `${nm} had ${p}/${pd} of a bag of flour and used ${q}/${qd} of the bag. How much of the bag is left?`;
    return num(ans, steps, { q: q2, expr: `${p}/${pd}${add ? '+' : '-'}${q}/${qd}` });
  }
  return num(ans, steps, { q: `${p}/${pd} ${add ? '+' : '−'} ${q}/${qd} = ?`, expr: `${p}/${pd}${add ? '+' : '-'}${q}/${qd}` });
});
skill('6-mixednum', 6, 'Add and subtract fractions', 'Add and subtract mixed numbers', ['Add or subtract the whole numbers and the fractions. Use a common denominator first.', 'If the fraction part is too small to subtract, regroup 1 whole, or change to improper fractions.'], (r) => {
  const t = r.int(0, 3);
  let [n1, d1] = fracPair(r, 8), [n2, d2] = fracPair(r, 8); if (t === 0) { d2 = d1; n2 = r.int(1, d1 - 1); }
  const w1 = r.int(3, 9), w2 = r.int(1, w1 - 2), L = lcm(d1, d2), A = w1 * L + n1 * L / d1, B = w2 * L + n2 * L / d2;
  if (t === 3) {
    const x1 = n1 / d1 >= 0.5 ? w1 + 1 : w1, x2 = n2 / d2 >= 0.5 ? w2 + 1 : w2;
    return num(x1 + x2, [`Round each mixed number to the nearest whole: ${w1} ${n1}/${d1} → ${x1} and ${w2} ${n2}/${d2} → ${x2}.`, `${x1} + ${x2} = ${x1 + x2}.`, `So the estimate is ${x1 + x2}.`], { q: `Estimate ${w1} ${n1}/${d1} + ${w2} ${n2}/${d2} by rounding each to the nearest whole number.`, expr: `${x1}+${x2}` });
  }
  const add = t === 0 ? r.bool() : t === 1 ? false : r.bool(), ans = mixed(add ? A + B : A - B, L);
  const steps = [`Write both with the denominator ${L}: ${w1} ${n1 * L / d1}/${L} and ${w2} ${n2 * L / d2}/${L}.`, `As improper fractions: ${A}/${L} ${add ? '+' : '−'} ${B}/${L} = ${add ? A + B : A - B}/${L}.`, `Change back to a mixed number: ${ans}. So the answer is ${ans}.`];
  if (t === 2) {
    const nm = r.pick(NAMES);
    return num(ans, steps, { q: add ? `${nm} hiked ${w1} ${n1}/${d1} km in the morning and ${w2} ${n2}/${d2} km in the afternoon. How far did ${nm} hike in all, in km?` : `A board is ${w1} ${n1}/${d1} m long. ${nm} cuts off ${w2} ${n2}/${d2} m. How long is the board now, in metres?`, expr: `${A}/${L}${add ? '+' : '-'}${B}/${L}` });
  }
  return num(ans, steps, { q: `${w1} ${n1}/${d1} ${add ? '+' : '−'} ${w2} ${n2}/${d2} = ?`, expr: `${A}/${L}${add ? '+' : '-'}${B}/${L}` });
});

// ───────────── 14. Multiply and divide fractions ─────────────
skill('6-fracwhole', 6, 'Multiply and divide fractions', 'Multiply fractions by whole numbers', ['To multiply a whole number by a fraction, multiply the whole number by the top and keep the bottom.', 'a/b of a number: divide by b, then multiply by a.'], (r) => {
  const t = r.int(0, 3), [a, b] = fracPair(r, 10), n = r.int(2, 12);
  if (t === 0) { const ans = mixed(n * a, b); return num(ans, [`Multiply the whole number by the top: ${n} × ${a} = ${n * a}.`, `Keep the bottom: ${n * a}/${b}.`, `Simplify: ${n * a}/${b} = ${ans}. So the answer is ${ans}.`], { q: `${n} × ${a}/${b} = ?`, expr: `${n}*${a}/${b}` }); }
  if (t === 1) {
    const N = b * r.int(2, 12), nm = r.pick(NAMES);
    const [q, unit] = r.pick([[`${nm} is running a ${N} km race and has run ${a}/${b} of it. How many km is that?`, 'km'], [`A tank holds ${N} L. It is ${a}/${b} full. How many litres are in it?`, 'L'], [`A book has ${N} pages. ${nm} has read ${a}/${b} of it. How many pages is that?`, 'pages']]);
    return num(a * N / b, [`1/${b} of ${N} is ${N} ÷ ${b} = ${N / b}.`, `${a}/${b} of ${N} is ${a} × ${N / b} = ${a * N / b}.`, `So the answer is ${a * N / b} ${unit}.`], { q, expr: `${a}*${N}/${b}` });
  }
  if (t === 2) {
    const N = r.int(6, 40), kind = r.int(0, 2), [p, q] = kind === 0 ? [a, b] : kind === 1 ? [b + a, b] : [b, b];
    const right = kind === 0 ? 'Less' : kind === 1 ? 'Greater' : 'Equal', size = kind === 0 ? 'less than 1' : kind === 1 ? 'more than 1' : 'equal to 1';
    return mc(r, right, ['Greater', 'Less', 'Equal'], { q: `Without working it out: is ${p}/${q} × ${N} greater than, less than or equal to ${N}?`, steps: [`${p}/${q} is ${size}.`, `Multiplying ${N} by a number ${size} gives ${kind === 0 ? `less than ${N}` : kind === 1 ? `more than ${N}` : `exactly ${N}`}.`, `So the answer is ${right.toLowerCase()}.`] });
  }
  return num(frac(n, b), [`${n} × 1/${b} means ${n} jumps of 1/${b}.`, `That is ${n}/${b}${frac(n, b) !== `${n}/${b}` ? ` = ${frac(n, b)}` : ''}.`, `So the answer is ${frac(n, b)}.`], { q: `${n} × 1/${b} = ?`, expr: `${n}/${b}` });
});
skill('6-wholefrac', 6, 'Multiply and divide fractions', 'Divide whole numbers by fractions', ['n ÷ 1/b asks how many 1/b pieces fit in n wholes: n × b.', 'To divide by a/b, multiply by its reciprocal b/a.'], (r) => {
  const t = r.int(0, 2), b = r.int(2, 8), n = r.int(2, 9);
  if (t === 0) return num(n * b, [`Each whole has ${b} pieces of size 1/${b}.`, `${n} wholes have ${n} × ${b} = ${n * b} pieces.`, `So ${n} ÷ 1/${b} = ${n * b}.`], { q: `${n} ÷ 1/${b} = ?`, expr: `${n}/(1/${b})` });
  if (t === 1) {
    let a = r.int(2, b + 3); while (gcd(a, b) !== 1 || a === b) a = r.int(2, b + 3);
    const k = r.int(1, 6), N = a * k;
    return num(k * b, [`Dividing by ${a}/${b} is the same as multiplying by ${b}/${a}.`, `${N} × ${b}/${a} = ${N * b}/${a}.`, `${N * b} ÷ ${a} = ${k * b}. So ${N} ÷ ${a}/${b} = ${k * b}.`], { q: `${N} ÷ ${a}/${b} = ?`, expr: `${N}/(${a}/${b})` });
  }
  const [cup, ctx] = r.pick([['L', 'jug of juice'], ['kg', 'bag of rice'], ['m', 'roll of ribbon']]);
  return num(n * b, [`How many 1/${b} ${cup} pieces fit in ${n} ${cup}? Divide: ${n} ÷ 1/${b}.`, `Each ${cup} holds ${b} of them, so ${n} × ${b} = ${n * b}.`, `So there are ${n * b} portions.`], { q: `A ${n} ${cup} ${ctx} is split into portions of 1/${b} ${cup}. How many portions are there?`, expr: `${n}*${b}` });
});

// ───────────── 15. Mixed operations: fractions ─────────────
skill('6-fracops', 6, 'Mixed operations: fractions', 'Add, subtract, multiply or divide fractions', ['+ and −: use a common denominator. ×: multiply tops and bottoms.', '÷: multiply by the reciprocal of the second fraction.'], (r) => {
  const [a, b] = fracPair(r, 9), [c, d] = fracPair(r, 9), op = r.pick(['+', '−', '×', '÷']), L = lcm(b, d);
  let x = [a, b], y = [c, d]; if (op === '−' && a / b < c / d) [x, y] = [y, x];
  const [p, q] = x, [s, u] = y;
  const val = op === '+' ? [p * u + s * q, q * u] : op === '−' ? [p * u - s * q, q * u] : op === '×' ? [p * s, q * u] : [p * u, q * s];
  const ans = frac(...val);
  const how = op === '+' || op === '−' ? [`Common denominator ${lcm(q, u)}: ${p * lcm(q, u) / q}/${lcm(q, u)} ${op} ${s * lcm(q, u) / u}/${lcm(q, u)}.`, `= ${(op === '+' ? p * lcm(q, u) / q + s * lcm(q, u) / u : p * lcm(q, u) / q - s * lcm(q, u) / u)}/${lcm(q, u)} = ${ans}.`] : op === '×' ? [`Multiply the tops: ${p} × ${s} = ${p * s}. Multiply the bottoms: ${q} × ${u} = ${q * u}.`, `${p * s}/${q * u} = ${ans}.`] : [`Flip the second fraction and multiply: ${p}/${q} × ${u}/${s}.`, `= ${p * u}/${q * s} = ${ans}.`];
  const e = `(${p}/${q})${X(op)}(${s}/${u})`;
  if (r.bool(0.3) && op !== '−') {
    const nm = r.pick(NAMES);
    const story = { '+': `${nm} ate ${p}/${q} of a pie and a friend ate ${s}/${u} of the same pie. How much of the pie did they eat together?`, '×': `A recipe needs ${p}/${q} cup of milk. ${nm} makes ${s}/${u} of the recipe. How many cups of milk are needed?`, '÷': `${nm} has ${p}/${q} m of string and cuts it into pieces ${s}/${u} m long. How many pieces is that?` }[op];
    return num(ans, [...how, `So the answer is ${ans}.`], { q: story, expr: e });
  }
  return num(ans, [...how, `So the answer is ${ans}.`], { q: `${p}/${q} ${op} ${s}/${u} = ?`, expr: e });
});

// ───────────── 16. Integers ─────────────
skill('6-integers', 6, 'Integers', 'Understand and compare integers', ['Integers are whole numbers and their opposites: …, −2, −1, 0, 1, 2, …', 'On a number line, numbers get greater as you go right. −8 is less than −3.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) {
    const n = r.int(2, 40), [txt0, v] = r.pick([[`${n} m below sea level`, -n], [`a gain of ${n} points`, n], [`a temperature of ${n} degrees below zero`, -n], [`a withdrawal of $${n}`, -n], [`${n} m above the ground`, n], [`a loss of ${n} points`, -n]]);
    return num(v, [`Below, loss and withdrawal mean negative. Above and gain mean positive.`, `So ${txt0} is ${neg(v)}.`], { q: `Which integer stands for ${txt0}?`, expr: String(v) });
  }
  if (t === 1) { const x = r.nonzero(-9, 9); return num(x, [`Count from 0: the dot is ${Math.abs(x)} step${Math.abs(x) > 1 ? 's' : ''} to the ${x < 0 ? 'left' : 'right'}.`, `So the dot is at ${neg(x)}.`], { q: 'What integer does the dot show?', visual: numberLine(-10, 10, { marks: [x] }), expr: String(x) }); }
  if (t === 2) {
    const a = r.int(-20, 20), b = r.bool(0.1) ? a : r.int(-20, 20), s = cmpSign(a, b);
    return mc(r, s, ['<', '>', '='], { q: `Which sign makes this true? ${neg(a)} ☐ ${neg(b)}`, steps: [`On a number line, the number further right is greater.`, a === b ? `They are the same number.` : `${neg(Math.max(a, b))} is to the right of ${neg(Math.min(a, b))}.`, `So ${neg(a)} ${s} ${neg(b)}.`] });
  }
  if (t === 3) {
    const xs = []; while (xs.length < 4) { const v = r.int(-15, 15); if (!xs.includes(v)) xs.push(v); }
    const up = [...xs].sort((a, b) => a - b), show = (l) => l.map(neg).join(', ');
    return mc(r, show(up), [show([...up].reverse()), show([...xs].sort((a, b) => Math.abs(a) - Math.abs(b) || a - b)), show(r.shuffle(xs))], { q: `Which list is in order from least to greatest?`, steps: [`Negative numbers are less than positive ones. The further left on the number line, the less.`, `From least to greatest: ${show(up)}.`] });
  }
  const x = r.nonzero(-30, 30);
  return num(-x, [`The opposite is the same distance from 0 on the other side.`, `${neg(x)} is ${Math.abs(x)} from 0, so its opposite is ${neg(-x)}.`], { q: `What is the opposite of ${neg(x)}?`, expr: String(-x) });
});

// ───────────── 17. Rational numbers ─────────────
const RAT = [['−3/4', -0.75], ['−0.5', -0.5], ['−1 1/2', -1.5], ['0.25', 0.25], ['−2', -2], ['1/3', 1 / 3], ['−0.8', -0.8], ['1.2', 1.2], ['−1/4', -0.25], ['0', 0], ['−1.25', -1.25], ['3/5', 0.6], ['−2/3', -2 / 3], ['−0.6', -0.6], ['1 1/2', 1.5], ['−0.1', -0.1]];
skill('6-rational', 6, 'Rational numbers', 'Compare and order rational numbers', ['Rational numbers include fractions and decimals, positive and negative.', 'Change them to decimals to compare. A negative number with a bigger size is less: −0.8 < −0.5.'], (r) => {
  if (r.bool()) {
    let [A, B] = r.shuffle(RAT); const s = cmpSign(A[1], B[1]);
    return mc(r, s, ['<', '>', '='], { q: `Which sign makes this true? ${A[0]} ☐ ${B[0]}`, steps: [`As decimals: ${A[0]} = ${dec(A[1], 3).replace('-', '−')} and ${B[0]} = ${dec(B[1], 3).replace('-', '−')}.`, `The one further right on a number line is greater.`, `So ${A[0]} ${s} ${B[0]}.`] });
  }
  const vs = []; for (const v of r.shuffle(RAT)) if (vs.length < 4 && !vs.some((u) => Math.abs(u[1] - v[1]) < 1e-9)) vs.push(v);
  const up = [...vs].sort((a, b) => a[1] - b[1]), show = (l) => l.map((v) => v[0]).join(', ');
  return mc(r, show(up), [show([...up].reverse()), show([...vs].sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))), show(r.shuffle(vs))], { q: 'Which list is in order from least to greatest?', steps: [`As decimals: ${vs.map((v) => `${v[0]} = ${dec(v[1], 3).replace('-', '−')}`).join(', ')}.`, `From least to greatest: ${show(up)}.`] });
});

// ───────────── 18. Coordinate plane ─────────────
const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
const quad = (x, y) => (x > 0 ? (y > 0 ? 'Quadrant I' : 'Quadrant IV') : y > 0 ? 'Quadrant II' : 'Quadrant III');
skill('6-plane', 6, 'Coordinate plane', 'Points in four quadrants', ['A point (x, y): x tells how far right (+) or left (−); y tells how far up (+) or down (−).', 'The axes cut the plane into four quadrants, numbered I to IV counter-clockwise from the top right.'], (r) => {
  const t = r.int(0, 2), x = r.nonzero(-6, 6), y = r.nonzero(-6, 6);
  if (t === 0) return mc(r, pt(x, y), [pt(y, x), pt(-x, y), pt(x, -y)], { q: 'What are the coordinates of point A?', visual: { type: 'plane', points: [[x, y, 'A']] }, steps: [`From the origin, A is ${Math.abs(x)} ${x > 0 ? 'right' : 'left'}: x = ${neg(x)}.`, `Then ${Math.abs(y)} ${y > 0 ? 'up' : 'down'}: y = ${neg(y)}. So A is ${pt(x, y)}.`] });
  if (t === 1) return mc(r, quad(x, y), ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'], { q: `Which quadrant is the point ${pt(x, y)} in?`, steps: [`x is ${x > 0 ? 'positive (right)' : 'negative (left)'} and y is ${y > 0 ? 'positive (up)' : 'negative (down)'}.`, `${x > 0 ? 'Right' : 'Left'} and ${y > 0 ? 'up' : 'down'} is ${quad(x, y)}.`] });
  const others = [[-x, y], [x, -y], [y === x ? -y : y, x]].filter(([a, b], i, l) => !(a === x && b === y) && l.findIndex(([c, d]) => c === a && d === b) === i);
  const labels = ['A', 'B', 'C', 'D'], all = r.shuffle([[x, y], ...others]), at = all.findIndex(([a, b]) => a === x && b === y);
  return mc(r, labels[at], labels.slice(0, all.length), { q: `Which point is at ${pt(x, y)}?`, visual: { type: 'plane', points: all.map(([a, b], i) => [a, b, labels[i]]) }, steps: [`Start at the origin. Go ${Math.abs(x)} ${x > 0 ? 'right' : 'left'}, then ${Math.abs(y)} ${y > 0 ? 'up' : 'down'}.`, `That is point ${labels[at]}.`] });
});
skill('6-planemove', 6, 'Coordinate plane', 'Moves, maps and distances', ['Moving right or left changes x; moving up or down changes y.', 'Two points on the same horizontal or vertical line: subtract the coordinates that differ to find the distance.'], (r) => {
  const t = r.int(0, 3), x = r.int(-5, 5), y = r.int(-5, 5);
  if (t === 0) {
    const dx = r.nonzero(-5, 5), dy = r.nonzero(-5, 5), ex = x + dx, ey = y + dy;
    const say = `${Math.abs(dx)} unit${Math.abs(dx) > 1 ? 's' : ''} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} unit${Math.abs(dy) > 1 ? 's' : ''} ${dy > 0 ? 'up' : 'down'}`;
    return mc(r, pt(ex, ey), [pt(x - dx, y + dy), pt(x + dx, y - dy), pt(x + dy, y + dx)], { q: `Start at ${pt(x, y)}. Move ${say}. Where do you end up?`, steps: [`Right/left changes x: ${neg(x)} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${neg(ex)}.`, `Up/down changes y: ${neg(y)} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${neg(ey)}.`, `So you end at ${pt(ex, ey)}.`] });
  }
  if (t <= 2) {
    const same = r.bool(), a = r.int(-6, -1), b = r.int(1, 6), k = r.nonzero(-5, 5), [P, Q] = same ? [[a, k], [b, k]] : [[k, a], [k, b]], [p1, p2] = r.shuffle(['school', 'library', 'park', 'pool', 'mosque', 'rink']);
    const q = t === 1 ? `How far apart are ${pt(...P)} and ${pt(...Q)}?` : `On a town map, the ${p1} is at ${pt(...P)} and the ${p2} is at ${pt(...Q)}. Each unit is one block. How many blocks apart are they?`;
    return num(b - a, [`The ${same ? 'y' : 'x'}-coordinates match, so the points are on a ${same ? 'horizontal' : 'vertical'} line.`, `From ${neg(a)} to 0 is ${-a}, and from 0 to ${b} is ${b}.`, `${-a} + ${b} = ${b - a}. So they are ${b - a} apart.`], { q, expr: `${b}-(${a})`, visual: { type: 'plane', points: [[...P, 'P'], [...Q, 'Q']] } });
  }
  const steps = [r.int(2, 7), r.int(2, 7)], dir = r.pick([['east', 'west'], ['north', 'south']]), nm = r.pick(NAMES), net = steps[0] - steps[1];
  const right = net === 0 ? 'Back at the start' : `${Math.abs(net)} unit${Math.abs(net) > 1 ? 's' : ''} ${net > 0 ? dir[0] : dir[1]}`;
  return mc(r, right, [`${steps[0] + steps[1]} units ${dir[0]}`, `${Math.abs(net) + 1} units ${net >= 0 ? dir[0] : dir[1]}`, net === 0 ? `1 unit ${dir[1]}` : `${Math.abs(net)} unit${Math.abs(net) > 1 ? 's' : ''} ${net > 0 ? dir[1] : dir[0]}`], { q: `From the start, ${nm} walks ${steps[0]} units ${dir[0]}, then ${steps[1]} units ${dir[1]}. Where is ${nm} now, compared with the start?`, steps: [`${dir[0]} and ${dir[1]} are opposite, so subtract: ${steps[0]} − ${steps[1]} = ${neg(net)}.`, `So ${nm} is: ${right.toLowerCase()}.`] });
});

// ───────────── 19. Ratios and rates ─────────────
skill('6-ratiowrite', 6, 'Ratios', 'Write ratios', ['A ratio compares two amounts, in order: 3 to 5, 3:5 or 3/5.', 'Part-to-part compares two groups; part-to-whole compares a group with the total.'], (r) => {
  const a = r.int(2, 15), b = r.int(2, 15), [A, B] = r.pick([['girls', 'boys'], ['red marbles', 'blue marbles'], ['cats', 'dogs'], ['apples', 'oranges']]), t = r.int(0, 2), whole = A.includes('marbles') ? 'marbles' : A === 'girls' ? 'students' : A === 'cats' ? 'pets' : 'pieces of fruit';
  const ctx = `There are ${a} ${A} and ${b} ${B}.`;
  if (t === 0) return mc(r, `${b}:${a}`, [`${a}:${b}`, `${b}:${a + b}`, `${a + b}:${b}`], { q: `${ctx} What is the ratio of ${B} to ${A}?`, steps: [`Keep the order asked: ${B} first, then ${A}.`, `So the ratio is ${b}:${a}.`] });
  if (t === 1) return mc(r, `${a}:${a + b}`, [`${a}:${b}`, `${a + b}:${a}`, `${b}:${a + b}`], { q: `${ctx} What is the ratio of ${A} to all the ${whole}?`, steps: [`All the ${whole}: ${a} + ${b} = ${a + b}.`, `${A} to all: ${a}:${a + b}.`] });
  return mc(r, `${a}/${b}`, [`${b}/${a}`, `${a}/${a + b}`, `${b}/${a + b}`], { q: `${ctx} Which fraction shows the ratio of ${A} to ${B}?`, steps: [`The first amount goes on top: ${a} ${A}.`, `The second goes on the bottom: ${b} ${B}. So it is ${a}/${b}.`] });
});
skill('6-ratioequiv', 6, 'Ratios', 'Equivalent ratios and proportions', ['Equivalent ratios come from multiplying or dividing both terms by the same number.', 'Two ratios form a proportion when they are equivalent.'], (r) => {
  const t = r.int(0, 4), a0 = r.int(1, 9), [a, b] = simplify(a0, r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a0))), k = r.int(2, 8);
  if (t === 0) return num(a * k, [`${b} × ${k} = ${b * k}, so the second term was multiplied by ${k}.`, `Multiply the first term by ${k} too: ${a} × ${k} = ${a * k}.`, `So ${a}:${b} = ${a * k}:${b * k}, and ☐ = ${a * k}.`], { q: `${a}:${b} = ☐:${b * k}. What is ☐?`, expr: `${a}*${k}` });
  if (t === 1) {
    const ks = [1, 2, 3, k + 2], miss = r.int(1, 3);
    const rows = ks.map((m, i) => [i === miss ? '?' : a * m, b * m]);
    return num(a * ks[miss], [`Each row is the first row times a number. The first row is ${a} and ${b}.`, `In the missing row, ${b * ks[miss]} = ${b} × ${ks[miss]}.`, `So the missing number is ${a} × ${ks[miss]} = ${a * ks[miss]}.`], { q: 'Complete the ratio table: what number goes where the ? is?', visual: { type: 'table', head: ['Cups of flour', 'Cups of milk'], rows }, expr: `${a}*${ks[miss]}` });
  }
  if (t === 2) {
    const yes = r.bool(), c = a * k, d = yes ? b * k : b * k + r.nonzero(-1, 2);
    const ok = a * d === b * c;
    return mc(r, ok ? 'Yes' : 'No', ['Yes', 'No'], { q: `Do ${a}/${b} and ${c}/${d} form a proportion?`, steps: [`Cross-multiply: ${a} × ${d} = ${a * d} and ${b} × ${c} = ${b * c}.`, ok ? `They are equal, so yes, they form a proportion.` : `They are not equal, so no, they do not form a proportion.`] });
  }
  if (t === 3) return mc(r, `${a * k}:${b * k}`, [`${a + k}:${b + k}`, `${b * k}:${a * k}`, `${a * k}:${b * k + 1}`], { q: `Which ratio is equivalent to ${a}:${b}?`, steps: [`Multiply both terms by the same number, ${k}.`, `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}, so ${a * k}:${b * k}.`] });
  const e = r.int(2, 4), f = r.int(1, 3), m = r.int(2, 5);
  return num(f * m, [`The recipe uses ${e} eggs for ${f} cup${f > 1 ? 's' : ''} of flour.`, `${e * m} eggs is ${m} times as many, so use ${m} times as much flour: ${f} × ${m} = ${f * m}.`, `So ${f * m} cups of flour are needed.`], { q: `A recipe uses ${e} eggs for every ${f} cup${f > 1 ? 's' : ''} of flour. How many cups of flour go with ${e * m} eggs?`, expr: `${f}*${m}` });
});
skill('6-rateword', 6, 'Ratios', 'Rate and ratio word problems', ['Compare rates by finding each unit rate (per 1).', 'In a tape diagram, all the equal parts together make the total.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const [p, q] = names(r, 2), h1 = r.int(2, 5), h2 = r.int(2, 5), s1 = r.int(8, 20), s2 = s1 === 15 ? 16 : r.pick([s1 + r.nonzero(-3, 3)]);
    const faster = s1 > s2 ? p : q;
    return mc(r, faster, [p, q], { q: `${p} cycled ${s1 * h1} km in ${h1} hours. ${q} cycled ${s2 * h2} km in ${h2} hours. Who cycled faster?`, steps: [`${p}: ${s1 * h1} ÷ ${h1} = ${s1} km per hour.`, `${q}: ${s2 * h2} ÷ ${h2} = ${s2} km per hour.`, `${Math.max(s1, s2)} is greater, so ${faster} was faster.`] });
  }
  if (t === 1) {
    const a = r.int(1, 5), b = r.int(a + 1, 8), u = r.int(2, 12), T = (a + b) * u, [A, B] = r.pick([['red beads', 'blue beads'], ['juice', 'water'], ['girls', 'boys']]);
    return num(b * u, [`The ratio ${a}:${b} makes ${a} + ${b} = ${a + b} equal parts.`, `Each part is ${T} ÷ ${a + b} = ${u}.`, `${B}: ${b} parts × ${u} = ${b * u}. So the answer is ${b * u}.`], { q: `The ratio of ${A} to ${B} is ${a}:${b}. There are ${T} in all. How many are ${B}?`, expr: `${T}/${a + b}*${b}` });
  }
  if (t === 2) {
    const k = r.pick([2, 5, 10, 20, 50]), d = r.int(2, 15) / (r.bool(0.3) ? 2 : 1), ans = dec(d * k);
    return num(ans, [`Each 1 cm on the drawing is ${k} m in real life.`, `${dec(d)} × ${k} = ${ans}.`, `So the real length is ${ans} m.`], { q: `A scale drawing uses 1 cm : ${k} m. A wall is ${dec(d)} cm long on the drawing. How long is the real wall, in metres?`, expr: `${d}*${k}` });
  }
  const s = r.int(40, 110), h = r.int(2, 6);
  return num(s * h, [`The rate is ${s} km in 1 hour.`, `In ${h} hours: ${s} × ${h} = ${s * h}.`, `So the car goes ${s * h} km.`], { q: `A car travels at ${s} km per hour. At that rate, how far does it go in ${h} hours, in km?`, expr: `${s}*${h}` });
});

// ───────────── 20. Percents ─────────────
skill('6-pctconv', 6, 'Percents', 'Percents, fractions and decimals', ['Percent means "out of 100": 35% = 35/100 = 0.35.', 'To change a fraction to a percent, make the bottom 100 (or divide and multiply by 100).'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) { const d = r.pick([4, 5, 10, 20]), n = r.int(1, d - 1), p = n * 100 / d; return num(p, [`The strip has ${d} equal parts, so each part is 100 ÷ ${d} = ${100 / d}%.`, `${n} parts are shaded: ${n} × ${100 / d} = ${p}.`, `So ${p}% is shaded.`], { q: 'What percent of the strip is shaded?', visual: { type: 'fraction', n, d }, unit: '%', expr: `${n}/${d}*100` }); }
  if (t === 1) { const d = r.pick([2, 4, 5, 10, 20, 25, 50]), n = fracPair2(r, d), p = n * 100 / d; return num(p, [`Make the bottom 100: multiply top and bottom by ${100 / d}.`, `${n}/${d} = ${p}/100.`, `So ${n}/${d} = ${p}%.`], { q: `Write ${n}/${d} as a percent.`, unit: '%', expr: `${n}/${d}*100` }); }
  if (t === 2) {
    const p = r.int(1, 199);
    return r.bool() ? num(dec(p / 100), [`Percent means out of 100, so divide by 100.`, `${p} ÷ 100 = ${dec(p / 100)}. So ${p}% = ${dec(p / 100)}.`], { q: `Write ${p}% as a decimal.`, expr: `${p}/100` })
      : num(p, [`Multiply the decimal by 100.`, `${dec(p / 100)} × 100 = ${p}, so ${dec(p / 100)} = ${p}%.`], { q: `Write ${dec(p / 100)} as a percent.`, unit: '%', expr: `${p / 100}*100` });
  }
  if (t === 3) { const p = r.pick([5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 64, 75, 80, 90, 12, 35]); return num(frac(p, 100), [`${p}% = ${p}/100.`, `Simplify: ${p}/100 = ${frac(p, 100)}.`, `So ${p}% = ${frac(p, 100)}.`], { q: `Write ${p}% as a fraction in simplest form.`, exactForm: 'fraction', expr: `${p}/100` }); }
  const d = r.pick([20, 25, 50]), n = r.int(1, d - 1), p = n * 100 / d, nm = r.pick(NAMES);
  return num(p, [`${nm} got ${n} out of ${d}: ${n}/${d}.`, `Multiply top and bottom by ${100 / d}: ${p}/100.`, `So ${nm} got ${p}%.`], { q: `${nm} got ${n} out of ${d} questions right on a quiz. What percent is that?`, unit: '%', expr: `${n}/${d}*100` });
});
skill('6-pctcomp', 6, 'Percents', 'Compare and estimate percents', ['To compare a percent and a fraction, change the fraction to a percent.', 'To estimate, round to friendly numbers: 19% of 61 is about 20% of 60 = 12.'], (r) => {
  const t = r.int(0, 3);
  const FR = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [9, 20], [1, 3], [2, 3]];
  if (t <= 1) {
    const [a, b] = r.pick(FR), fp = a * 100 / b, p = r.bool(0.15) && Number.isInteger(fp) ? fp : Math.round(fp) + r.pick([-15, -5, 5, 10, -10, 3]);
    const show = Number.isInteger(fp) ? `${fp}%` : `about ${dec(fp, 1)}%`;
    if (t === 0) { const s = cmpSign(p, fp); return mc(r, s, ['<', '>', '='], { q: `Which sign makes this true? ${p}% ☐ ${a}/${b}`, steps: [`Change the fraction to a percent: ${a}/${b} = ${a} ÷ ${b} × 100 = ${show}.`, `Compare: ${p}% ${s} ${show.replace('about ', '')}.`, `So ${p}% ${s} ${a}/${b}.`] }); }
    if (p === fp) return mc(r, 'They are the same', ['Team A', 'Team B', 'They are the same'], { q: `Team A won ${a}/${b} of its games. Team B won ${p}% of its games. Which team won a greater part of its games?`, steps: [`${a}/${b} = ${show}.`, `That equals ${p}%, so they are the same.`] });
    const win = fp > p ? 'Team A' : 'Team B';
    return mc(r, win, ['Team A', 'Team B', 'They are the same'], { q: `Team A won ${a}/${b} of its games. Team B won ${p}% of its games. Which team won a greater part of its games?`, steps: [`Change the fraction to a percent: ${a}/${b} = ${show}.`, `Compare with ${p}%: ${win} won the greater part.`] });
  }
  if (t === 2) {
    const P = r.pick([10, 20, 25, 50]), N = r.int(2, 9) * (P === 25 ? 40 : 20), p = P + r.nonzero(-2, 2), n = N + r.nonzero(-3, 3), est = P * N / 100;
    return mc(r, est, [est * 2, est / 2 + 1, est + 10], { q: `Which is the best estimate of ${p}% of ${n}?`, steps: [`Round to friendly numbers: ${p}% ≈ ${P}% and ${n} ≈ ${N}.`, `${P}% of ${N} = ${est}.`, `So the best estimate is ${est}.`] });
  }
  const p = r.pick([10, 20, 25, 40, 50]), whole = r.int(2, 12) * (100 / gcd(100, p)), part = p * whole / 100;
  return num(whole, [`${p}% of the strip is ${part}, so each 1% is ${part} ÷ ${p}.`, `The whole strip is 100%: ${part} ÷ ${p} × 100 = ${whole}.`, `So the whole is ${whole}.`], { q: `${p}% of a number is ${part}. What is the number?`, visual: { type: 'fraction', n: p / 10 === Math.floor(p / 10) ? p / 10 : p / 5, d: p / 10 === Math.floor(p / 10) ? 10 : 20 }, expr: `${part}/${p}*100` });
});

// ───────────── 21. Percents of numbers ─────────────
skill('6-pctof', 6, 'Percents of numbers', 'Percent problems', ['Part = percent × whole. To find a percent: part ÷ whole × 100.', 'To find the whole: part ÷ percent × 100.'], (r) => {
  const t = r.int(0, 3), p = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80]), whole = r.int(2, 20) * 20, part = p * whole / 100, nm = r.pick(NAMES);
  if (t === 0) return num(p, [`Percent = part ÷ whole × 100.`, `${part} ÷ ${whole} = ${dec(part / whole)}, and × 100 gives ${p}.`, `So ${part} is ${p}% of ${whole}.`], { q: `What percent of ${whole} is ${part}?`, unit: '%', expr: `${part}/${whole}*100` });
  if (t === 1) return num(whole, [`${p}% of the number is ${part}. So 1% is ${part} ÷ ${p} = ${dec(part / p)}.`, `100% is ${dec(part / p)} × 100 = ${whole}.`, `So the number is ${whole}.`], { q: `${part} is ${p}% of what number?`, expr: `${part}/${p}*100` });
  if (t === 2) return num(part, [`${p}% = ${dec(p / 100)}.`, `${dec(p / 100)} × ${whole} = ${part}.`, `So ${part} students.`], { q: `A school has ${whole} students. ${p}% of them take the bus. How many students take the bus?`, expr: `${p}*${whole}/100` });
  return num(p, [`Part ÷ whole: ${part} ÷ ${whole} = ${dec(part / whole)}.`, `× 100 = ${p}.`, `So ${nm} has saved ${p}% of the cost.`], { q: `A bike costs $${whole}. ${nm} has saved $${part}. What percent of the cost has ${nm} saved?`, unit: '%', expr: `${part}/${whole}*100` });
});

// ───────────── 22. Units of measurement ─────────────
const UNITS = [['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'mL', 1000], ['m', 'mm', 1000]];
const REASON = [['the mass of an apple', '150 g', ['150 kg', '15 mg', '1.5 kg']], ['the height of a door', '2 m', ['2 cm', '20 m', '2 km']], ['the amount of water in a bathtub', '150 L', ['150 mL', '15 mL', '1,500 L']], ['the length of a pencil', '18 cm', ['18 mm', '18 m', '1.8 m']], ['the mass of a car', '1,500 kg', ['1,500 g', '15 kg', '150 g']], ['the distance from Toronto to Ottawa', '450 km', ['450 m', '45 m', '4,500 cm']], ['the amount of juice in a glass', '250 mL', ['250 L', '25 L', '2.5 mL']]];
skill('6-metric', 6, 'Measurement', 'Metric units', ['To change a big unit to a small one, multiply (1 km = 1000 m). To change a small unit to a big one, divide.', 'kilo means 1000; centi means one hundredth; milli means one thousandth.'], (r) => {
  const t = r.int(0, 4), [B, S, f] = r.pick(UNITS);
  if (t === 0) {
    if (r.bool()) { const x = r.int(5, 99) / (r.bool() ? 10 : 1); return num(dec(x * f), [`1 ${B} = ${comma(f)} ${S}. Big to small: multiply.`, `${dec(x)} × ${comma(f)} = ${comma(dec(x * f))}.`, `So ${dec(x)} ${B} = ${dec(x * f)} ${S}.`], { q: `${dec(x)} ${B} = ? ${S}`, expr: `${x}*${f}` }); }
    const y = r.int(1, 99) * f / 10 + (f >= 100 ? r.int(0, 9) * f / 100 : 0), ans = dec(y / f);
    return num(ans, [`1 ${B} = ${comma(f)} ${S}. Small to big: divide.`, `${comma(y)} ÷ ${comma(f)} = ${ans}.`, `So ${comma(y)} ${S} = ${ans} ${B}.`], { q: `${comma(y)} ${S} = ? ${B}`, expr: `${y}/${f}` });
  }
  if (t === 1) {
    const x = r.int(11, 99) / 10, y = Math.round(x * f) + r.pick([0, f / 10, -f / 10, f / 100 * 5]), s = cmpSign(x * f, y);
    return mc(r, s, ['<', '>', '='], { q: `Which sign makes this true? ${x} ${B} ☐ ${comma(y)} ${S}`, steps: [`Change to the same unit: ${x} ${B} = ${comma(dec(x * f))} ${S}.`, `Compare: ${comma(dec(x * f))} ${s} ${comma(y)}.`, `So ${x} ${B} ${s} ${comma(y)} ${S}.`] });
  }
  if (t === 2) { const a = r.int(1, 9), b = r.int(1, f - 1); return num(a * f + b, [`${a} ${B} = ${a} × ${comma(f)} = ${comma(a * f)} ${S}.`, `Add the ${b} ${S}: ${comma(a * f)} + ${b} = ${comma(a * f + b)}.`, `So the answer is ${comma(a * f + b)} ${S}.`], { q: `${a} ${B} ${b} ${S} = ? ${S}`, expr: `${a}*${f}+${b}` }); }
  if (t === 3) { const [what, right, wrongs] = r.pick(REASON); return mc(r, right, wrongs, { q: `Which is the most reasonable estimate for ${what}?`, steps: [`Think of objects you know: compare with them.`, `The most reasonable is ${right}.`] }); }
  const piece = r.pick([20, 25, 40, 50]), n = r.int(3, 12), total = piece * n;
  return num(n, [`Change to the same unit: ${dec(total / 100)} m = ${total} cm.`, `${total} ÷ ${piece} = ${n}.`, `So ${n} pieces.`], { q: `A ribbon is ${dec(total / 100)} m long. It is cut into pieces ${piece} cm long. How many pieces are there?`, expr: `${total}/${piece}` });
});
skill('6-unitsarea', 6, 'Measurement', 'Area, volume, capacity and temperature', G6.UNITSAREA_LESSON, G6.unitsArea6);

// ───────────── 23. Money ─────────────
skill('6-money', 6, 'Money', 'Money problems', ['Line up the decimal points when you add or subtract money.', 'Work in cents if it helps: $2.35 = 235¢.'], (r) => {
  const t = r.int(0, 4), nm = r.pick(NAMES);
  if (t === 0) {
    const q = r.int(2, 12), d = r.int(1, 12), tot = 25 * q + 10 * d;
    return num(d, [`${q} quarters = ${q} × 25¢ = ${25 * q}¢.`, `The dimes make ${tot}¢ − ${25 * q}¢ = ${10 * d}¢.`, `${10 * d} ÷ 10 = ${d}. So there are ${d} dimes.`], { q: `${nm} has ${money(tot / 100)} in quarters and dimes. There are ${q} quarters. How many dimes are there?`, expr: `(${tot}-25*${q})/10` });
  }
  if (t === 1) {
    const coins = Array.from({ length: r.int(4, 7) }, () => r.pick([5, 10, 25, 100, 200, 500])).sort((a, b) => b - a), tot = coins.reduce((a, b) => a + b, 0);
    return num(dec(tot / 100), [`Add from the largest: ${coins.map((c) => (c >= 100 ? `$${c / 100}` : `${c}¢`)).join(' + ')}.`, `That is ${tot}¢.`, `So the total is ${money(tot / 100)}, which is ${dec(tot / 100)} dollars.`], { q: 'How much money is shown, in dollars?', visual: { type: 'coins', coins }, expr: `${tot}/100` });
  }
  if (t === 2) {
    const a = r.int(500, 4000) / 100, b = r.int(100, 2000) / 100, pay = [20, 50, 100].find((x) => x > a + b);
    return num(dec(pay - a - b), [`Total: ${money(a)} + ${money(b)} = ${money(a + b)}.`, `Change: ${money(pay)} − ${money(a + b)} = ${money(pay - a - b)}.`, `So the change is ${dec(pay - a - b)} dollars.`], { q: `${nm} buys a shirt for ${money(a)} and socks for ${money(b)}, and pays with $${pay}. How much change, in dollars?`, expr: `${pay}-${a}-${b}` });
  }
  if (t === 3) { const p = r.int(105, 2499) / 100, n = r.int(3, 12); return num(dec(p * n), [`${n} × ${money(p)}.`, `In cents: ${Math.round(p * 100)} × ${n} = ${Math.round(p * 100) * n}.`, `That is ${money(p * n)}, so the answer is ${dec(p * n)}.`], { q: `Movie tickets cost ${money(p)} each. How much do ${n} tickets cost, in dollars?`, expr: `${Math.round(p * 100)}*${n}/100` }); }
  const n = r.int(2, 9), each = r.int(105, 2499) / 100, c = Math.round(each * 100);
  return num(dec(each), [`Divide the total by ${n}: ${money(each * n)} ÷ ${n}.`, `In cents: ${c * n} ÷ ${n} = ${c}.`, `So each pays ${money(each)}, which is ${dec(each)}.`], { q: `${n} friends split a ${money(each * n)} pizza order equally. How much does each friend pay, in dollars?`, expr: `${c * n}/${n}/100` });
});

// ───────────── 24. Consumer math ─────────────
skill('6-unitprice', 6, 'Consumer maths', 'Unit prices and coupons', ['Unit price = total price ÷ number of units. The lower unit price is the better buy.', 'To compare coupons, work out how much each one saves.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const u = r.int(50, 899) / 100, n = r.int(2, 12), [item, unit] = r.pick([['apples', 'kg'], ['juice', 'L'], ['rice', 'kg'], ['granola bars', 'bar']]); return num(dec(u), [`Unit price = total ÷ units.`, `${money(u * n)} ÷ ${n} = ${money(u)}.`, `So it costs ${dec(u)} dollars per ${unit}.`], { q: `${n} ${unit === 'bar' ? 'granola bars cost' : `${unit} of ${item} costs`} ${money(u * n)}. What is the price per ${unit}, in dollars?`, expr: `${Math.round(u * 100) * n}/${n}/100` }); }
  if (t === 1) {
    const s1 = r.pick([2, 3, 4]), s2 = s1 * 2 + r.int(0, 2), u1 = r.int(150, 400) / 100, u2 = Number((u1 + r.pick([-0.25, -0.1, 0.15, 0.3])).toFixed(2)), p1 = Number((u1 * s1).toFixed(2)), p2 = Number((u2 * s2).toFixed(2)), better = p1 / s1 < p2 / s2 ? `${s1} L for ${money(p1)}` : `${s2} L for ${money(p2)}`;
    return mc(r, better, [`${s1} L for ${money(p1)}`, `${s2} L for ${money(p2)}`], { q: 'Which is the better buy?', steps: [`${money(p1)} ÷ ${s1} = ${money(p1 / s1)} per L.`, `${money(p2)} ÷ ${s2} = ${money(p2 / s2)} per L.`, `The lower unit price is the better buy: ${better}.`] });
  }
  if (t === 2) {
    const P = r.int(8, 30) * 5, pct = r.pick([10, 15, 20, 25, 30]), save = P * pct / 100, off = Math.max(1, Math.round(save) + r.pick([-3, -2, 2, 3, 5]));
    const right = save > off ? `${pct}% off` : `$${off} off`;
    return mc(r, right, [`${pct}% off`, `$${off} off`], { q: `A jacket costs $${P}. Which coupon saves more: ${pct}% off or $${off} off?`, steps: [`${pct}% of $${P} = ${dec(pct / 100)} × ${P} = $${dec(save)}.`, `The other coupon saves $${off}.`, `So ${right} saves more.`] });
  }
  const kg = r.pick([0.5, 1.5, 2.5, 0.25]), u = r.int(2, 12), price = dec(kg * u);
  return num(u, [`Unit price = price ÷ mass: ${money(Number(price))} ÷ ${kg}.`, `${price} ÷ ${kg} = ${u}.`, `So it costs ${u} dollars per kg.`], { q: `${kg} kg of cheese costs ${money(Number(price))}. What is the price per kilogram, in dollars?`, expr: `${price}/${kg}` });
});
skill('6-saleprice', 6, 'Consumer maths', 'Sales, tax, tips and interest', ['Sale price = price − discount. Total with tax = price + tax.', 'Simple interest = principal × rate × time (in years).'], (r) => {
  const t = r.int(0, 4), P = r.int(2, 40) * 5;
  if (t === 0) { const p = r.pick([10, 20, 25, 30, 40, 50]), off = P * p / 100; return num(dec(P - off), [`Discount: ${p}% of $${P} = $${dec(off)}.`, `Sale price: $${P} − $${dec(off)} = $${dec(P - off)}.`, `So the sale price is ${dec(P - off)} dollars.`], { q: `A pair of shoes costs $${P}. It is on sale for ${p}% off. What is the sale price, in dollars?`, expr: `${P}*(1-${p}/100)` }); }
  if (t === 1) { const [p, nm] = r.pick([[13, 'HST'], [5, 'GST'], [15, 'HST']]), tax = P * p / 100; return num(dec(P + tax), [`Tax: ${p}% of $${P} = ${dec(p / 100)} × ${P} = $${dec(tax)}.`, `Total: $${P} + $${dec(tax)} = $${dec(P + tax)}.`, `So the total is ${dec(P + tax)} dollars.`], { q: `A game costs $${P} before tax. The ${nm} is ${p}%. What is the total cost, in dollars?`, expr: `${P}*(1+${p}/100)` }); }
  if (t === 2) { const p = r.pick([10, 15, 20]), bill = r.int(4, 30) * 4, tip = bill * p / 100; return num(dec(tip), [`${p}% = ${dec(p / 100)}.`, `${dec(p / 100)} × $${bill} = $${dec(tip)}.`, `So the tip is ${dec(tip)} dollars.`], { q: `A restaurant bill is $${bill}. How much is a ${p}% tip, in dollars?`, expr: `${bill}*${p}/100` }); }
  if (t === 3) { const p = r.pick([20, 25, 40, 50, 60]), up = P * p / 100; return num(dec(P + up), [`Mark-up: ${p}% of $${P} = $${dec(up)}.`, `Selling price: $${P} + $${dec(up)} = $${dec(P + up)}.`, `So the store sells it for ${dec(P + up)} dollars.`], { q: `A store buys a lamp for $${P} and marks the price up by ${p}%. What is the selling price, in dollars?`, expr: `${P}*(1+${p}/100)` }); }
  const prin = r.int(1, 20) * 100, rate = r.int(1, 8), yrs = r.int(1, 5), I = prin * rate * yrs / 100;
  return num(dec(I), [`Interest = principal × rate × time.`, `$${comma(prin)} × ${rate}% × ${yrs} = ${comma(prin)} × ${dec(rate / 100)} × ${yrs} = $${dec(I)}.`, `So the interest is ${dec(I)} dollars.`], { q: `$${comma(prin)} is saved at ${rate}% simple interest per year. How much interest is earned in ${yrs} year${yrs > 1 ? 's' : ''}, in dollars?`, expr: `${prin}*${rate}/100*${yrs}` });
});

// ───────────── 25. Time ─────────────
const hm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const ampm = (m) => { const h = Math.floor(m / 60) % 24, mm = String(m % 60).padStart(2, '0'); return `${h % 12 === 0 ? 12 : h % 12}:${mm} ${h < 12 ? 'a.m.' : 'p.m.'}`; };
skill('6-time', 6, 'Time', 'Elapsed time and time units', ['To find elapsed time, count the hours, then the minutes.', 'In 24-hour time, p.m. hours add 12: 3:45 p.m. is 15:45.'], (r) => {
  const t = r.int(0, 4), start = r.int(6 * 12, 20 * 12) * 5, dur = r.int(3, 40) * 5;
  if (t === 0) return num(dur, [`From ${hm(start)} to ${hm(start + dur)}.`, `Count on: ${Math.floor(dur / 60) ? `${Math.floor(dur / 60)} h ` : ''}${dur % 60} min${Math.floor(dur / 60) ? ` = ${dur} min` : ''}.`, `So ${dur} minutes passed.`], { q: `A movie starts at ${hm(start)} and ends at ${hm(start + dur)}. How many minutes long is it?`, expr: `${start + dur}-${start}` });
  if (t === 1) {
    const [q, ans, how] = r.pick([[`${Math.floor(dur / 60) + 1} h ${dur % 60} min = ? min`, (Math.floor(dur / 60) + 1) * 60 + (dur % 60), `${Math.floor(dur / 60) + 1} × 60 + ${dur % 60}`], [`${dur % 7 + 2} days = ? hours`, (dur % 7 + 2) * 24, `${dur % 7 + 2} × 24`], [`${dur % 9 + 2} weeks = ? days`, (dur % 9 + 2) * 7, `${dur % 9 + 2} × 7`], [`${dur % 11 + 2} min = ? s`, (dur % 11 + 2) * 60, `${dur % 11 + 2} × 60`]]);
    return num(ans, [`Use the unit facts: 1 h = 60 min, 1 day = 24 h, 1 week = 7 days, 1 min = 60 s.`, `${how} = ${ans}.`, `So the answer is ${ans}.`], { q, expr: X(how) });
  }
  if (t === 2) { const e = start + dur; return mc(r, hm(e), [hm(e + 60), hm(e - 10), hm(start + dur % 60 + 100)], { q: `A practice starts at ${hm(start)} and lasts ${Math.floor(dur / 60) ? `${Math.floor(dur / 60)} h ` : ''}${dur % 60} min. When does it end?`, steps: [`Add the time to ${hm(start)}.`, `It ends at ${hm(e)}.`] }); }
  if (t === 3) { const m = r.int(0, 287) * 5; return r.bool() ? mc(r, hm(m), [hm((m + 720) % 1440), hm((m + 60) % 1440), `${Math.floor(m / 60) % 12 || 12}:${String(m % 60).padStart(2, '0')}`.padStart(5, '0')], { q: `What is ${ampm(m)} in 24-hour time?`, steps: [m >= 720 ? `p.m. after 12:59: add 12 to the hour.` : m < 60 ? `12 a.m. hours are written as 00.` : `a.m. times keep the same hour.`, `So ${ampm(m)} is ${hm(m)}.`] }) : mc(r, ampm(m), [ampm((m + 720) % 1440), ampm((m + 60) % 1440)], { q: `What is ${hm(m)} in 12-hour time?`, steps: [m >= 720 ? `The hour is 12 or more, so it is p.m.${m >= 780 ? ' Subtract 12 from the hour.' : ''}` : `The hour is less than 12, so it is a.m.`, `So ${hm(m)} is ${ampm(m)}.`] }); }
  const e = start + dur;
  return mc(r, hm(start), [hm(start - 60), hm(start + 10), hm(e + dur)], { q: `A bus trip lasts ${dur} minutes and ends at ${hm(e)}. When did it start?`, steps: [`Count back ${dur} minutes from ${hm(e)}.`, `It started at ${hm(start)}.`] });
});

// ───────────── 26. Expressions ─────────────
skill('6-varexpr', 6, 'Expressions', 'Write variable expressions', ['A variable is a letter that stands for a number.', '"5 more than n" is n + 5; "5 less than n" is n − 5; "5 times n" is 5n.'], (r) => {
  const v = r.pick(['n', 'x', 'y', 'm', 'p']), k = r.int(2, 12), m = r.int(2, 9), t = r.int(0, 5);
  const forms = [
    [`${k} more than ${v}`, `${v} + ${k}`, [`${k}${v}`, `${v} − ${k}`, `${k} − ${v}`]],
    [`${k} less than ${v}`, `${v} − ${k}`, [`${k} − ${v}`, `${v} + ${k}`, `${v} ÷ ${k}`]],
    [`the product of ${k} and ${v}`, `${k}${v}`, [`${k} + ${v}`, `${v} − ${k}`, `${v} ÷ ${k}`]],
    [`${v} divided by ${k}`, `${v} ÷ ${k}`, [`${k} ÷ ${v}`, `${k}${v}`, `${v} − ${k}`]],
    [`${m} less than ${k} times ${v}`, `${k}${v} − ${m}`, [`${m} − ${k}${v}`, `${k}(${v} − ${m})`, `${k}${v} + ${m}`]],
  ];
  if (t < 5) { const [w, right, wrongs] = forms[t]; return mc(r, right, wrongs, { q: `Which expression means "${w}"?`, steps: [`Turn the words into symbols, keeping the order.`, `"${w}" is ${right}.`] }); }
  const nm = r.pick(NAMES), [story, right, wrongs] = r.pick([
    [`Tickets cost $${k} each. Which expression gives the cost of ${v} tickets?`, `${k}${v}`, [`${v} + ${k}`, `${v} ÷ ${k}`, `${k} − ${v}`]],
    [`${nm} has ${v} stickers and gives away ${k}. Which expression shows how many are left?`, `${v} − ${k}`, [`${k} − ${v}`, `${v} + ${k}`, `${k}${v}`]],
    [`${v} grapes are shared equally among ${k} friends. Which expression shows how many each friend gets?`, `${v} ÷ ${k}`, [`${k} ÷ ${v}`, `${k}${v}`, `${v} − ${k}`]],
    [`${nm} is ${k} years older than a cousin who is ${v} years old. Which expression gives ${nm}'s age?`, `${v} + ${k}`, [`${v} − ${k}`, `${k}${v}`, `${k} − ${v}`]],
  ]);
  return mc(r, right, wrongs, { q: story, steps: [`Decide the operation: ${right.includes('+') ? 'more means add' : right.includes('−') ? 'giving away means subtract' : right.includes('÷') ? 'sharing equally means divide' : 'equal groups mean multiply'}.`, `So the expression is ${right}.`] });
});
skill('6-evalexpr', 6, 'Expressions', 'Evaluate expressions and name their parts', ['To evaluate, replace each variable with its value, then use the order of operations.', 'In 4x + 7, the terms are 4x and 7; 4 is the coefficient of x and 7 is the constant.'], (r) => {
  const t = r.int(0, 3), a = r.int(2, 9), b = r.int(1, 20), x = r.int(1, 12);
  if (t === 0) return num(a * x + b, [`Replace x with ${x}: ${a} × ${x} + ${b}.`, `Multiply first: ${a * x}. Then add: ${a * x} + ${b} = ${a * x + b}.`, `So the value is ${a * x + b}.`], { q: `Evaluate ${a}x + ${b} when x = ${x}.`, expr: `${a}*${x}+${b}` });
  if (t === 1) {
    const y = r.int(1, 9), sq = r.bool(), v = sq ? x * x - y : a * x + 2 * y, e = sq ? `x^2 − y` : `${a}x + 2y`;
    if (sq && v < 0) return num(x * x + y, [`Replace x with ${x} and y with ${y}: ${x}^2 + ${y}.`, `${x}^2 = ${x * x}, and ${x * x} + ${y} = ${x * x + y}.`, `So the value is ${x * x + y}.`], { q: `Evaluate x^2 + y when x = ${x} and y = ${y}.`, expr: `${x}**2+${y}` });
    return num(v, [`Replace x with ${x} and y with ${y}.`, sq ? `${x}^2 − ${y} = ${x * x} − ${y} = ${v}.` : `${a} × ${x} + 2 × ${y} = ${a * x} + ${2 * y} = ${v}.`, `So the value is ${v}.`], { q: `Evaluate ${e} when x = ${x} and y = ${y}.`, expr: sq ? `${x}**2-${y}` : `${a}*${x}+2*${y}` });
  }
  if (t === 2) { const c = r.int(11, 99) / 10, m = r.int(2, 9), ans = dec(c * m + b); return num(ans, [`Replace m with ${m}: ${c} × ${m} + ${b}.`, `${c} × ${m} = ${dec(c * m)}, then + ${b} = ${ans}.`, `So the value is ${ans}.`], { q: `Evaluate ${c}m + ${b} when m = ${m}.`, expr: `${c}*${m}+${b}` }); }
  const c2 = r.int(2, 12), k = r.int(1, 15), ask = r.int(0, 2), e = `${a}x + ${c2}y − ${k}`;
  if (ask === 2) return num(3, [`Terms are separated by + and − signs.`, `The terms are ${a}x, ${c2}y and ${k}: that is 3 terms.`], { q: `How many terms are in ${e}?`, expr: '3' });
  return num(ask === 0 ? c2 : -k, [`The terms of ${e} are ${a}x, ${c2}y and −${k}.`, ask === 0 ? `The number multiplying y is ${c2}, so the coefficient of y is ${c2}.` : `The constant term has no variable: it is −${k}.`], { q: ask === 0 ? `What is the coefficient of y in ${e}?` : `What is the constant term in ${e}?`, expr: String(ask === 0 ? c2 : -k) });
});

// ───────────── 27. Equivalent expressions ─────────────
const PROPS = [
  [(a, b, c) => `${a} + ${b} = ${b} + ${a}`, 'Commutative property of addition'],
  [(a, b, c) => `${a} × ${b} = ${b} × ${a}`, 'Commutative property of multiplication'],
  [(a, b, c) => `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, 'Associative property of addition'],
  [(a, b, c) => `(${a} × ${b}) × ${c} = ${a} × (${b} × ${c})`, 'Associative property of multiplication'],
  [(a, b, c) => `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c}`, 'Distributive property'],
  [(a) => `${a} × 1 = ${a}`, 'Identity property of multiplication'],
  [(a) => `${a} + 0 = ${a}`, 'Identity property of addition'],
];
skill('6-props', 6, 'Equivalent expressions', 'Properties and equivalent expressions', ['Commutative: order does not matter. Associative: grouping does not matter. Identity: + 0 or × 1 changes nothing.', 'Distributive: 3(x + 4) = 3x + 12, because the 3 multiplies each term.'], (r) => {
  const t = r.int(0, 3), a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9);
  if (t === 0) {
    const [f, name] = r.pick(PROPS);
    return mc(r, name, r.shuffle(PROPS.map((p) => p[1]).filter((n) => n !== name)).slice(0, 3), { q: `Which property does this show? ${f(a, b, c)}`, steps: [`Look at what changes: ${name.startsWith('Comm') ? 'the order' : name.startsWith('Assoc') ? 'the grouping (brackets)' : name.startsWith('Ident') ? 'nothing: the number stays the same' : 'one number multiplies each term in the brackets'}.`, `That is the ${name.toLowerCase()}.`] });
  }
  if (t === 1) return num(c, [`The distributive property: ${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c}.`, `So the missing number is ${c}.`], { q: `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ☐. What is ☐?`, expr: String(c) });
  if (t === 2) return mc(r, `${a}x + ${a * b}`, [`${a}x + ${b}`, `x + ${a * b}`, `${a + b}x`], { q: `Which expression is equivalent to ${a}(x + ${b})?`, steps: [`Multiply each term in the brackets by ${a}.`, `${a} × x = ${a}x and ${a} × ${b} = ${a * b}, so ${a}x + ${a * b}.`] });
  return mc(r, `${a + b}x + ${c}`, [`${a + b + c}x`, `${a * b}x + ${c}`, `${a + b}x + ${c}x`], { q: `Which expression is equivalent to ${a}x + ${b}x + ${c}?`, steps: [`${a}x and ${b}x are like terms: ${a}x + ${b}x = ${a + b}x.`, `${c} has no x, so it stays: ${a + b}x + ${c}.`] });
});

// ───────────── 28. One-variable equations ─────────────
skill('6-eqcheck', 6, 'Equations', 'Check and write equations', ['A solution makes the equation true. Put the value in and check both sides.', 'Words like "is" or "equals" become the = sign.'], (r) => {
  const t = r.int(0, 2), x = r.int(2, 12), a = r.int(2, 9), b = r.int(1, 20), c = a * x + b;
  if (t === 0) {
    const tryV = r.bool() ? x : x + r.nonzero(-2, 2), ok = a * tryV + b === c;
    return mc(r, ok ? 'Yes' : 'No', ['Yes', 'No'], { q: `Is x = ${tryV} a solution of ${a}x + ${b} = ${c}?`, steps: [`Put ${tryV} in for x: ${a} × ${tryV} + ${b} = ${a * tryV + b}.`, `${a * tryV + b} ${ok ? '=' : '≠'} ${c}, so ${ok ? 'yes, it is' : 'no, it is not'} a solution.`] });
  }
  if (t === 1) {
    const set = r.shuffle([x, x + 1, x - 1, x + 2].filter((v) => v > 0));
    return mc(r, `x = ${x}`, set.map((v) => `x = ${v}`), { q: `Which value of x makes ${a}x + ${b} = ${c} true?`, steps: [`Try each value. For x = ${x}: ${a} × ${x} + ${b} = ${c}.`, `It works, so x = ${x}.`] });
  }
  const n = r.int(2, 9), s = n + x, [w, right, wrongs] = r.pick([
    [`A number increased by ${n} is ${s}.`, `x + ${n} = ${s}`, [`x − ${n} = ${s}`, `${n}x = ${s}`, `x + ${s} = ${n}`]],
    [`${n} times a number is ${n * x}.`, `${n}x = ${n * x}`, [`x + ${n} = ${n * x}`, `x ÷ ${n} = ${n * x}`, `${n * x}x = ${n}`]],
    [`A number decreased by ${n} is ${x}.`, `x − ${n} = ${x}`, [`${n} − x = ${x}`, `x + ${n} = ${x}`, `${n}x = ${x}`]],
    [`A number divided by ${n} is ${x}.`, `x ÷ ${n} = ${x}`, [`${n} ÷ x = ${x}`, `${n}x = ${x}`, `x − ${n} = ${x}`]],
  ]);
  return mc(r, right, wrongs, { q: `Which equation matches? "${w}"`, steps: [`Let x be the number. "Is" becomes =.`, `So the equation is ${right}.`] });
});
skill('6-eqdec', 6, 'Equations', 'One-step equations with decimals and word problems', ['Undo the operation on x by doing the opposite to both sides.', 'With decimals, line up the decimal points when you add or subtract.'], (r) => {
  const t = r.int(0, 3), x = r.int(11, 199) / 10, a = r.int(11, 99) / 10;
  if (t === 0) { const s = dec(x + a); return num(dec(x), [`Undo + ${a}: subtract ${a} from both sides.`, `x = ${s} − ${a} = ${dec(x)}.`, `Check: ${dec(x)} + ${a} = ${s}. So x = ${dec(x)}.`], { q: `Solve: x + ${a} = ${s}`, unit: 'x =', expr: `${s}-${a}` }); }
  if (t === 1) { const k = r.int(2, 9), p = dec(k * x); return num(dec(x), [`Undo × ${k}: divide both sides by ${k}.`, `x = ${p} ÷ ${k} = ${dec(x)}.`, `Check: ${k} × ${dec(x)} = ${p}. So x = ${dec(x)}.`], { q: `Solve: ${k}x = ${p}`, unit: 'x =', expr: `${p}/${k}` }); }
  if (t === 2) { const k = r.int(2, 5), q = dec(x / 1); return num(dec(k * x), [`Undo ÷ ${k}: multiply both sides by ${k}.`, `x = ${q} × ${k} = ${dec(k * x)}.`, `Check: ${dec(k * x)} ÷ ${k} = ${q}. So x = ${dec(k * x)}.`], { q: `Solve: x ÷ ${k} = ${q}`, unit: 'x =', expr: `${q}*${k}` }); }
  const nm = r.pick(NAMES), p = r.int(150, 900) / 100, n = r.int(3, 8);
  return num(dec(p), [`Let c be the cost of one. Then ${n}c = ${money(p * n)}.`, `Divide both sides by ${n}: c = ${dec(p * n)} ÷ ${n} = ${dec(p)}.`, `So one costs ${money(p)}, which is ${dec(p)} dollars.`], { q: `${nm} paid ${money(p * n)} for ${n} granola bars that each cost the same. Solve ${n}c = ${dec(p * n)} to find the cost of one bar, in dollars.`, expr: `${Math.round(p * 100) * n}/${n}/100` });
});
skill('6-eqtwo', 6, 'Equations', 'Two-step equations and like terms', ['Undo adding or subtracting first, then undo multiplying or dividing.', 'Combine like terms first: 3x + 2x = 5x.'], (r) => {
  const t = r.int(0, 2), x = r.int(1, 15), a = r.int(2, 9), b = r.int(1, 30);
  if (t === 0) {
    const plus = r.bool(), c = plus ? a * x + b : a * x - b;
    const L = [{ eq: `${a}x ${plus ? '+' : '−'} ${b} = ${neg(c)}` }, { eq: `${a}x = ${a * x}`, note: `${plus ? '−' : '+'} ${b} on both sides` }, { eq: `x = ${x}`, note: `÷ ${a} on both sides` }];
    return num(x, [St(`First undo the ${plus ? '+' : '−'} ${b}: ${plus ? 'subtract' : 'add'} ${b} on both sides. ${a}x = ${a * x}.`, eqnLines(L.slice(0, 2))), St(`Then undo × ${a}: divide both sides by ${a}. x = ${x}.`, eqnLines(L)), St(`Check: ${a} × ${x} ${plus ? '+' : '−'} ${b} = ${neg(c)}. So x = ${x}.`)], { q: `Solve: ${a}x ${plus ? '+' : '−'} ${b} = ${neg(c)}`, unit: 'x =', expr: String(x) });
  }
  if (t === 1) {
    const p = r.int(2, 5), q = r.int(2, 6), sum = (p + q) * x;
    return num(x, [`Combine like terms: ${p}x + ${q}x = ${p + q}x.`, `So ${p + q}x = ${sum}. Divide both sides by ${p + q}: x = ${x}.`, `Check: ${p} × ${x} + ${q} × ${x} = ${sum}. So x = ${x}.`], { q: `Solve: ${p}x + ${q}x = ${sum}`, unit: 'x =', expr: `${sum}/${p + q}` });
  }
  const nm = r.pick(NAMES), fee = r.int(5, 20), per = r.int(3, 12), h = r.int(2, 9), tot = fee + per * h;
  return num(h, [`Write an equation: ${fee} + ${per}h = ${tot}.`, `Subtract ${fee}: ${per}h = ${tot - fee}. Divide by ${per}: h = ${h}.`, `So ${nm} rented the kayak for ${h} hours.`], { q: `A kayak rental costs $${fee} plus $${per} per hour. ${nm} paid $${tot}. For how many hours did ${nm} rent the kayak?`, expr: `(${tot}-${fee})/${per}` });
});

// ───────────── 29. One-variable inequalities ─────────────
const flipWord = { '>': 'greater than', '<': 'less than', '≥': 'greater than or equal to', '≤': 'less than or equal to' };
const holds = (v, s, c) => (s === '>' ? v > c : s === '<' ? v < c : s === '≥' ? v >= c : v <= c);
skill('6-ineq6', 6, 'Inequalities', 'Inequalities', ['An inequality like x > 3 has many solutions: every number greater than 3.', 'On a number line, an open dot means the number is not included; a closed dot means it is.'], (r) => {
  const t = r.int(0, 4), s = r.pick(['>', '<', '≥', '≤']), a = r.int(1, 9), c = r.int(5, 20);
  if (t === 0) {
    const v = r.int(c - a - 3, c - a + 3), ok = holds(v + a, s, c);
    return mc(r, ok ? 'Yes' : 'No', ['Yes', 'No'], { q: `Is x = ${neg(v)} a solution of x + ${a} ${s} ${c}?`, steps: [`Put ${neg(v)} in: ${neg(v)} + ${a} = ${v + a}.`, `Is ${v + a} ${flipWord[s]} ${c}? ${ok ? 'Yes' : 'No'}, so ${ok ? 'it is' : 'it is not'} a solution.`] });
  }
  if (t === 1) {
    const vals = r.shuffle([c - 2, c - 1, c, c + 1, c + 2]), good = vals.filter((v) => holds(v, s, c)), bad = vals.filter((v) => !holds(v, s, c));
    return mc(r, good[0], bad, { q: `Which number is a solution of x ${s} ${c}?`, steps: [`x must be ${flipWord[s]} ${c}.`, `${good[0]} is ${flipWord[s]} ${c}, so it is a solution.`] });
  }
  if (t === 2) {
    const open = s === '>' || s === '<', right = s === '>' || s === '≥' ? 'right' : 'left';
    return mc(r, `x ${s} ${a}`, ['>', '<', '≥', '≤'].filter((z) => z !== s).map((z) => `x ${z} ${a}`), { q: 'Which inequality does the number line show?', visual: { type: 'numberline', from: 0, to: 10, step: 1, ray: { at: a, dir: right, open } }, steps: [`${open ? 'An open dot: ' + a + ' is not included' : 'A closed dot: ' + a + ' is included'}.`, `Shaded to the ${right} means ${right === 'right' ? 'greater' : 'less'}. So x ${s} ${a}.`] });
  }
  if (t === 3) {
    const k = r.int(2, 9), x0 = r.int(1, 12), mult = r.bool();
    if (mult) return mc(r, `x ${s} ${x0}`, [`x ${s} ${k * x0 * k}`, `x ${s} ${k * x0 - k}`, `x ${s} ${k + x0}`], { q: `Solve: ${k}x ${s} ${k * x0}`, steps: [`Divide both sides by ${k}. The sign stays the same, since ${k} is positive.`, `So x ${s} ${x0}.`] });
    return mc(r, `x ${s} ${x0}`, [`x ${s} ${x0 + 2 * k}`, `x ${s} ${k * (x0 + k)}`, `x ${s} ${x0 + k + 1}`], { q: `Solve: x + ${k} ${s} ${x0 + k}`, steps: [`Subtract ${k} from both sides.`, `So x ${s} ${x0}.`] });
  }
  const k = r.int(2, 6), x0 = r.int(1, 10), c2 = k * x0 + a;
  return mc(r, `x ${s} ${x0}`, [`x ${s} ${x0 + a}`, `x ${s} ${dec((c2 + a) / k, 2)}`, `x ${s} ${c2 - a}`], { q: `Solve: ${k}x + ${a} ${s} ${c2}`, steps: [`Subtract ${a} from both sides: ${k}x ${s} ${k * x0}.`, `Divide both sides by ${k}: x ${s} ${x0}.`] });
});

// ───────────── 30. Two-variable equations ─────────────
skill('6-twovar', 6, 'Two-variable equations', 'Use two-variable equations', ['An equation like y = 3x + 2 links two variables: choose x, then work out y.', 'x is the independent variable (we choose it); y is the dependent variable (it depends on x).'], (r) => {
  const t = r.int(0, 3), m = r.int(2, 6), b = r.int(0, 9), x = r.int(1, 9), e = `y = ${m}x${b ? ` + ${b}` : ''}`;
  if (t === 0) {
    const y = r.bool() ? m * x + b : m * x + b + r.nonzero(-3, 3), ok = y === m * x + b;
    return mc(r, ok ? 'Yes' : 'No', ['Yes', 'No'], { q: `Does (${x}, ${y}) make ${e} true?`, steps: [`Put x = ${x} in: y = ${m} × ${x}${b ? ` + ${b}` : ''} = ${m * x + b}.`, `${ok ? 'That matches' : `That is not ${y}`}, so the answer is ${ok ? 'yes' : 'no'}.`] });
  }
  if (t === 1) return num(m * x + b, [`Put x = ${x} into ${e}.`, `y = ${m} × ${x}${b ? ` + ${b}` : ''} = ${m * x + b}.`, `So y = ${m * x + b}.`], { q: `If ${e}, what is y when x = ${x}?`, unit: 'y =', expr: `${m}*${x}+${b}` });
  if (t === 2) {
    const xs = [0, 1, 2, x + 2], rows = xs.map((v, i) => [v, i < 3 ? m * v + b : '?']);
    return num(m * (x + 2) + b, [`The rule is ${e}.`, `For x = ${x + 2}: y = ${m} × ${x + 2}${b ? ` + ${b}` : ''} = ${m * (x + 2) + b}.`, `So the missing value is ${m * (x + 2) + b}.`], { q: `Complete the table for ${e}. What goes where the ? is?`, visual: { type: 'table', head: ['x', 'y'], rows }, expr: `${m}*${x + 2}+${b}` });
  }
  const [story, ind, dep] = r.pick([['The cost of apples depends on how many kilograms you buy.', 'Kilograms of apples', 'Cost'], ['The distance a car travels depends on how many hours it drives.', 'Hours driven', 'Distance travelled'], ['The money earned depends on the number of hours worked.', 'Hours worked', 'Money earned'], ['The height of a plant depends on how many weeks it has grown.', 'Number of weeks', 'Height of the plant']]);
  const askInd = r.bool();
  return mc(r, askInd ? ind : dep, [ind, dep], { q: `${story} Which is the ${askInd ? 'independent' : 'dependent'} variable?`, steps: [`The dependent variable depends on the other one: ${dep.toLowerCase()}.`, `So the ${askInd ? 'independent' : 'dependent'} variable is ${(askInd ? ind : dep).toLowerCase()}.`] });
});
skill('6-twovarrule', 6, 'Two-variable equations', 'Find the equation from a table or graph', ['Look at how y changes when x goes up by 1: that is the number x is multiplied by.', 'Then check what is added by looking at x = 0.'], (r) => {
  const t = r.int(0, 3), m = r.int(1, 4), b = r.int(0, 3), e = (mm, bb) => `y = ${mm === 1 ? '' : mm}x${bb ? ` + ${bb}` : ''}`;
  const right = e(m, b), wrongs = [e(m + 1, b), e(m, b + 1), b ? e(m + b, 0) : e(m, 2), `y = x + ${m + b}`].filter((w) => w !== right);
  if (t === 0) { const xs = [0, 1, 2, 3]; return mc(r, right, wrongs, { q: 'Which equation fits the table?', visual: { type: 'table', head: ['x', 'y'], rows: xs.map((v) => [v, m * v + b]) }, steps: [`Each time x goes up 1, y goes up ${m}: multiply x by ${m}.`, `When x = 0, y = ${b}: add ${b}. So ${right}.`] }); }
  if (t === 1) {
    const pts = [0, 1, 2].map((v) => [v, m * v + b]);
    return mc(r, right, wrongs, { q: 'Which equation do these points fit?', visual: { type: 'plane', points: pts.map(([x, y]) => [x, y]), range: 12 }, steps: [`Read the points: ${pts.map(([x, y]) => `(${x}, ${y})`).join(', ')}.`, `From x = 0 to x = 1, y goes up by ${m}, and at x = 0, y = ${b}. So ${right}.`] });
  }
  if (t === 2) {
    const rate = r.int(3, 25), [what, unit] = r.pick([['A pool fills with', 'L'], ['A cyclist rides', 'km'], ['A printer prints', 'pages']]);
    return mc(r, `y = ${rate}x`, [`y = x + ${rate}`, `x = ${rate}y`, `y = ${rate} − x`], { q: `${what} ${rate} ${unit} each hour. Which equation gives y, the ${unit} after x hours?`, steps: [`Each hour adds ${rate} ${unit}, so after x hours it is ${rate} times x.`, `So y = ${rate}x.`] });
  }
  const x0 = r.int(1, 2), mm = r.int(1, 2), bb = r.int(0, 2), pts = [0, 1, 2].map((v) => [v, mm * v + bb]);
  return num(mm * x0 + bb, [`Find the point with x = ${x0} on the graph.`, `It is at (${x0}, ${mm * x0 + bb}).`, `So y = ${mm * x0 + bb}.`], { q: `The points follow a straight-line pattern. What is y when x = ${x0}?`, visual: { type: 'plane', points: pts.map(([x, y]) => [x, y, `(${x}, ${x === x0 ? '?' : y})`]) }, expr: String(mm * x0 + bb) });
});

// ───────────── 31. Lines and angles ─────────────
skill('6-angles', 6, 'Lines and angles', 'Measure and classify angles', G6.ANGLES_LESSON, G6.angles6);
skill('6-anglepairs', 6, 'Lines and angles', 'Angle pairs', G6.ANGLEPAIRS_LESSON, G6.anglePairs6);

// ───────────── 32. Two-dimensional figures ─────────────
skill('6-polygons', 6, 'Two-dimensional figures', 'Classify polygons, triangles and quadrilaterals', G6.POLYGONS_LESSON, G6.polygons6);
skill('6-anglesum', 6, 'Two-dimensional figures', 'Angles in polygons', G6.ANGLESUM_LESSON, G6.angleSum6);

// ───────────── 33. Symmetry and transformations ─────────────
skill('6-symmetry', 6, 'Symmetry and transformations', 'Symmetry and types of transformations', G6.SYMMETRY_LESSON, G6.symmetry6);
skill('6-transcoord', 6, 'Symmetry and transformations', 'Coordinates after a transformation', ['Translate: add to x for right (subtract for left), add to y for up. Reflect in the x-axis: (x, y) → (x, −y); in the y-axis: (x, y) → (−x, y).', 'Rotate 180° about the origin: (x, y) → (−x, −y). 90° clockwise: (x, y) → (y, −x).'], (r) => {
  const t = r.int(0, 2), x = r.nonzero(-5, 5), y = r.nonzero(-5, 5);
  let ans, q, why;
  if (t === 0) { let dx = r.nonzero(-4, 4); const dy = r.nonzero(-4, 4); if (x + dx === 0) dx = dx > 0 ? dx + 1 : dx - 1; ans = [x + dx, y + dy]; q = `Point A ${pt(x, y)} is translated ${Math.abs(dx)} unit${Math.abs(dx) > 1 ? 's' : ''} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} unit${Math.abs(dy) > 1 ? 's' : ''} ${dy > 0 ? 'up' : 'down'}. Where is A′?`; why = `x: ${neg(x)} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${neg(ans[0])}; y: ${neg(y)} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${neg(ans[1])}.`; }
  else if (t === 1) { const xa = r.bool(); ans = xa ? [x, -y] : [-x, y]; q = `Point A ${pt(x, y)} is reflected in the ${xa ? 'x' : 'y'}-axis. Where is A′?`; why = xa ? `Reflecting in the x-axis keeps x and changes the sign of y.` : `Reflecting in the y-axis keeps y and changes the sign of x.`; }
  else { const k = r.int(0, 2); ans = [[-x, -y], [y, -x], [-y, x]][k]; q = `Point A ${pt(x, y)} is rotated ${['180°', '90° clockwise', '90° counter-clockwise'][k]} about the origin. Where is A′?`; why = ['A 180° turn changes the sign of both coordinates: (x, y) → (−x, −y).', 'A 90° clockwise turn: (x, y) → (y, −x).', 'A 90° counter-clockwise turn: (x, y) → (−y, x).'][k]; }
  const right = pt(...ans);
  return mc(r, right, [pt(-ans[0], ans[1]), pt(ans[0], -ans[1]), pt(ans[1], ans[0]), pt(-ans[0], -ans[1])], { q, visual: { type: 'plane', points: [[x, y, 'A']], range: 9 }, steps: [St(why, { type: 'plane', points: [[x, y, 'A'], [ans[0], ans[1], 'A′']], range: 9 }), `So A′ is ${right}.`] });
});

// ───────────── 34. Three-dimensional figures ─────────────
skill('6-solids', 6, 'Three-dimensional figures', 'Solids, nets and views', G6.SOLIDS_LESSON, G6.solids6);

// ───────────── 35. Perimeter and area ─────────────
skill('6-perimeter', 6, 'Perimeter and area', 'Perimeter and area of rectangles and grid shapes', G6.PERIMETER_LESSON, G6.perimeter6);
skill('6-areaquad', 6, 'Perimeter and area', 'Area of parallelograms, trapezoids and rhombuses', G6.AREAQUAD_LESSON, G6.areaQuad6);
skill('6-areacomp', 6, 'Perimeter and area', 'Area of compound shapes and word problems', G6.AREACOMP_LESSON, G6.areaComp6);

// ───────────── 36. Surface area and volume ─────────────
skill('6-surface', 6, 'Surface area and volume', 'Surface area', G6.SURFACE_LESSON, G6.surface6);
skill('6-volume6', 6, 'Surface area and volume', 'Volume of prisms', G6.VOLUME_LESSON, G6.volume6);

// ───────────── 37. Data and graphs ─────────────
skill('6-bargraph', 6, 'Data and graphs', 'Bar graphs, pictographs and line plots', ['Read each bar against the scale on the side.', 'In a pictograph, use the key: each symbol stands for a number of items.'], (r) => {
  const t = r.int(0, 3);
  if (t <= 1) {
    const labels = r.shuffle(['Soccer', 'Hockey', 'Swim', 'Dance', 'Chess', 'Art']).slice(0, 4), k = r.pick([1, 5]), vals = labels.map(() => r.int(1, 9) * k);
    const [i, j] = r.shuffle([0, 1, 2, 3]); if (vals[i] === vals[j]) vals[i] += k;
    if (t === 0) { const [a, b] = vals[i] > vals[j] ? [i, j] : [j, i]; return num(vals[a] - vals[b], [`${labels[a]}: ${vals[a]} students. ${labels[b]}: ${vals[b]} students.`, `${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}.`, `So ${vals[a] - vals[b]} more students chose ${labels[a]}.`], { q: `How many more students chose ${labels[a]} than ${labels[b]}?`, visual: { type: 'bars', labels, values: vals, title: 'Favourite club' }, expr: `${vals[a]}-${vals[b]}` }); }
    const tot = vals.reduce((a, b) => a + b, 0);
    return num(tot, [`Read each bar: ${vals.join(', ')}.`, `Add them: ${vals.join(' + ')} = ${tot}.`, `So ${tot} students were asked.`], { q: 'How many students were asked in all?', visual: { type: 'bars', labels, values: vals, title: 'Favourite club' }, expr: vals.join('+') });
  }
  if (t === 2) {
    const key = r.pick([2, 4, 5, 10]), who = names(r, 3), counts = who.map(() => r.int(1, 6)), pick = r.int(0, 2);
    return num(counts[pick] * key, [`Each ● stands for ${key} books.`, `${who[pick]} has ${counts[pick]} symbols: ${counts[pick]} × ${key} = ${counts[pick] * key}.`, `So ${who[pick]} read ${counts[pick] * key} books.`], { q: `Key: ● = ${key} books. How many books did ${who[pick]} read?`, visual: { type: 'table', head: ['Reader', 'Books read'], rows: who.map((w, i) => [w, '●'.repeat(counts[i])]) }, expr: `${counts[pick]}*${key}` });
  }
  const xs = [0, 1, 2, 3, 4], cnt = xs.map(() => r.int(0, 5)), at = r.int(1, 3), ans = cnt.slice(at).reduce((a, b) => a + b, 0);
  return num(ans, [`Count the X marks above ${at}, ${xs.slice(at + 1).join(', ')}.`, `${cnt.slice(at).join(' + ')} = ${ans}.`, `So ${ans} students have ${at} or more pets.`], { q: `The line plot shows how many pets each student has. How many students have ${at} or more pets?`, visual: { type: 'table', head: ['Pets', 'Students'], rows: xs.map((x, i) => [x, cnt[i] ? 'X '.repeat(cnt[i]).trim() : '—']) }, expr: cnt.slice(at).join('+') });
});
skill('6-graphs2', 6, 'Data and graphs', 'Histograms, stem-and-leaf plots, circle and line graphs', ['A histogram groups data into equal intervals. A stem-and-leaf plot shows each value: stem = tens, leaf = ones.', 'A circle graph shows parts of a whole as percents. A line graph shows change over time.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const labels = ['50–59', '60–69', '70–79', '80–89', '90–99'], vals = labels.map(() => r.int(1, 10)), from = r.int(2, 4), ans = vals.slice(from).reduce((a, b) => a + b, 0);
    return num(ans, [`Scores of ${from * 10 + 50} or more are in the bars ${labels.slice(from).join(', ')}.`, `${vals.slice(from).join(' + ')} = ${ans}.`, `So ${ans} students scored ${from * 10 + 50} or more.`], { q: `The histogram shows test scores. How many students scored ${from * 10 + 50} or more?`, visual: { type: 'bars', labels, values: vals, title: 'Test scores' }, expr: vals.slice(from).join('+') });
  }
  if (t === 1) {
    const stems = [2, 3, 4, 5], leaves = stems.map(() => Array.from({ length: r.int(1, 4) }, () => r.int(0, 9)).sort((a, b) => a - b)), data = stems.flatMap((s, i) => leaves[i].map((l) => s * 10 + l)), ask = r.int(0, 2);
    const ans = ask === 0 ? Math.max(...data) : ask === 1 ? Math.min(...data) : data.filter((d) => d >= 40).length;
    return num(ans, [`Each value is stem then leaf: 3 | 4 means 34.`, ask === 2 ? `Count the leaves on stems 4 and 5: ${leaves[2].length} + ${leaves[3].length} = ${ans}.` : `The ${ask === 0 ? 'greatest is the last leaf on the top stem' : 'least is the first leaf on the bottom stem'}: ${ans}.`, `So the answer is ${ans}.`], { q: ask === 0 ? 'What is the greatest value in the stem-and-leaf plot?' : ask === 1 ? 'What is the least value in the stem-and-leaf plot?' : 'How many values are 40 or more?', visual: { type: 'table', head: ['Stem', 'Leaf'], rows: stems.map((s, i) => [s, leaves[i].join(' ')]) }, expr: String(ans) });
  }
  if (t === 2) {
    const N = r.pick([200, 300, 400, 500]), cats = ['Walk', 'Bus', 'Car', 'Bike'], p1 = r.pick([10, 20, 30, 40]), p2 = r.pick([10, 20, 25]), p3 = r.pick([10, 15, 20]), ps = [p1, p2, p3, 100 - p1 - p2 - p3], i = r.int(0, 3);
    return num(ps[i] * N / 100, [`The circle graph shows ${ps[i]}% chose ${cats[i].toLowerCase()}.`, `${ps[i]}% of ${N} = ${dec(ps[i] / 100)} × ${N} = ${ps[i] * N / 100}.`, `So ${ps[i] * N / 100} students.`], { q: `The table shows the data in a circle graph of how ${N} students get to school. How many students ${['walk', 'take the bus', 'come by car', 'bike'][i]}?`, visual: { type: 'table', head: ['How students travel', 'Percent'], rows: cats.map((c, k) => [c, `${ps[k]}%`]) }, expr: `${ps[i]}*${N}/100` });
  }
  const wk = ['week 1', 'week 2', 'week 3', 'week 4', 'week 5', 'week 6'], rises = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 5), hts = [r.int(1, 5)]; rises.forEach((d, k) => hts.push(hts[k] + d));
  const best = rises.indexOf(Math.max(...rises));
  const right = `${wk[best]} to ${wk[best + 1]}`;
  return mc(r, right, [0, 1, 2, 3, 4].filter((k) => k !== best).map((k) => `${wk[k]} to ${wk[k + 1]}`), { q: 'The line graph shows the height of a bean plant each week. Between which two weeks did it grow the most?', visual: { type: 'plane', quad1: true, xMax: 6, yMax: 40, yStep: 5, joined: true, xLabel: 'Week', yLabel: 'Height (cm)', points: hts.map((h, k) => [k + 1, h, String(h)]) }, steps: [`Read the heights: ${hts.join(', ')} cm. The growth each week: ${rises.join(', ')} cm.`, `The biggest growth is ${rises[best]} cm, from ${right}.`] });
});
skill('6-graphchoose', 6, 'Data and graphs', 'Frequency tables and choosing a graph', ['A frequency table counts how often each value appears.', 'Bar graphs compare groups; line graphs show change over time; circle graphs show parts of a whole; histograms show data in intervals.'], (r) => {
  const t = r.int(0, 1);
  if (t === 0) {
    const [d, right] = r.pick([['how a puppy\'s mass changed each month for a year', 'Line graph'], ['the favourite fruit of each student in a class', 'Bar graph'], ['what percent of a family budget goes to each expense', 'Circle graph'], ['how many students scored in each 10-point range on a test', 'Histogram'], ['the favourite sports of two different classes, side by side', 'Double bar graph'], ['the temperature in a city every hour during one day', 'Line graph']]);
    return mc(r, right, ['Line graph', 'Bar graph', 'Circle graph', 'Histogram', 'Double bar graph'].filter((x) => x !== right).slice(0, 3), { q: `Which type of graph would best show ${d}?`, steps: [`Change over time → line graph. Compare groups → bar graph. Parts of a whole → circle graph. Intervals → histogram.`, `So the best choice is a ${right.toLowerCase()}.`] });
  }
  const data = Array.from({ length: r.int(12, 16) }, () => r.int(1, 5)), v = r.pick(data), c = data.filter((x) => x === v).length;
  return num(c, [`Go through the list and tally each ${v}.`, `${v} appears ${c} time${c > 1 ? 's' : ''}.`, `So its frequency is ${c}.`], { q: `Students rated a movie from 1 to 5: ${data.join(', ')}. In a frequency table, what is the frequency of ${v}?`, expr: String(c) });
});

// ───────────── 38. Statistics ─────────────
skill('6-meanmiss', 6, 'Statistics', 'Mean, median, mode and range problems', ['Mean × number of values = total. Use this to find a missing value.', 'Range = greatest − least. With an even number of values, the median is the mean of the two middle values.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const n = r.int(4, 6), m = r.int(6, 20), xs = Array.from({ length: n - 1 }, () => r.int(Math.max(1, m - 6), m + 6)), miss = m * n - xs.reduce((a, b) => a + b, 0); if (miss < 0) return num(m * n, [`Total = mean × count.`, `${m} × ${n} = ${m * n}.`, `So the total is ${m * n}.`], { q: `The mean of ${n} numbers is ${m}. What is their total?`, expr: `${m}*${n}` }); return num(miss, [`The total must be mean × count: ${m} × ${n} = ${m * n}.`, `The known numbers add to ${xs.reduce((a, b) => a + b, 0)}. ${m * n} − ${xs.reduce((a, b) => a + b, 0)} = ${miss}.`, `So the missing number is ${miss}.`], { q: `The mean of ${n} numbers is ${m}. The other numbers are ${xs.join(', ')}. What is the missing number?`, expr: `${m * n}-(${xs.join('+')})` }); }
  if (t === 1) { const xs = Array.from({ length: r.int(5, 8) }, () => r.int(-5, 40)), hi = Math.max(...xs), lo = Math.min(...xs); return num(hi - lo, [`Greatest: ${neg(hi)}. Least: ${neg(lo)}.`, `${neg(hi)} − ${par(lo)} = ${hi - lo}.`, `So the range is ${hi - lo}.`], { q: `Find the range: ${xs.map(neg).join(', ')}`, expr: `${hi}-(${lo})` }); }
  if (t === 2) {
    const labels = names(r, 4), vals = [r.int(1, 10), r.int(1, 10), r.int(1, 10)]; vals.push(r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((v) => (v + vals[0] + vals[1] + vals[2]) % 4 === 0)));
    const tot = vals.reduce((a, b) => a + b, 0), mean = tot / 4;
    return num(dec(mean), [`Read the bars: ${vals.join(', ')}.`, `Total: ${tot}. Divide by 4: ${tot} ÷ 4 = ${dec(mean)}.`, `So the mean is ${dec(mean)}.`], { q: `The bar graph shows how many goals each player scored. What is the mean number of goals?`, visual: { type: 'bars', labels, values: vals, title: 'Goals scored' }, expr: `(${vals.join('+')})/4` });
  }
  const xs = Array.from({ length: r.pick([4, 6]) }, () => r.int(1, 30)).sort((a, b) => a - b), k = xs.length / 2, med = (xs[k - 1] + xs[k]) / 2;
  return num(dec(med), [`In order: ${xs.join(', ')}. There is an even number of values.`, `The two middle values are ${xs[k - 1]} and ${xs[k]}: (${xs[k - 1]} + ${xs[k]}) ÷ 2 = ${dec(med)}.`, `So the median is ${dec(med)}.`], { q: `Find the median: ${r.shuffle(xs).join(', ')}`, expr: `(${xs[k - 1]}+${xs[k]})/2` });
});
skill('6-samples', 6, 'Statistics', 'Samples and types of data', ['A representative sample is chosen fairly from the whole group. A biased sample favours some answers.', 'Discrete data is counted (whole numbers). Continuous data is measured and can take any value in a range.'], (r) => {
  if (r.bool()) {
    const [q, right] = r.pick([['To learn the favourite sport of students in a school, a student asks 50 randomly chosen students from every grade.', 'Representative'], ['To learn the favourite sport of students in a school, a student asks only the members of the hockey team.', 'Biased'], ['To find out how people in a town get to work, a survey is given only to people waiting at a bus stop.', 'Biased'], ['To find the most popular lunch, the school picks every 10th name from the full student list.', 'Representative'], ['To learn whether people like a new park, only people who live next to the park are asked.', 'Biased'], ['To find the average height of grade 6 students in a city, 100 students are chosen at random from every school.', 'Representative']]);
    return mc(r, right, ['Representative', 'Biased'], { q: `${q} Is this sample representative or biased?`, steps: [`Ask: could every person in the group be chosen fairly?`, right === 'Representative' ? 'Yes, it is chosen fairly from the whole group, so it is representative.' : 'No, it only asks a group likely to answer one way, so it is biased.'] });
  }
  const [q, right] = r.pick([['the number of students in each class', 'Discrete'], ['the height of each student', 'Continuous'], ['the number of goals scored in a game', 'Discrete'], ['the time it takes to run 100 m', 'Continuous'], ['the mass of a newborn puppy', 'Continuous'], ['the number of pets in each home', 'Discrete'], ['the temperature at noon each day', 'Continuous'], ['the number of cars in a parking lot', 'Discrete']]);
  return mc(r, right, ['Discrete', 'Continuous'], { q: `Is ${q} discrete or continuous data?`, steps: [`Counted things are discrete; measured things are continuous.`, `This is ${right === 'Discrete' ? 'counted' : 'measured'}, so it is ${right.toLowerCase()}.`] });
});

// ───────────── 39. Probability ─────────────
skill('6-prob1', 6, 'Probability', 'Probability of an event', ['Probability = number of favourable outcomes ÷ number of possible outcomes.', 'The probability that an event does not happen is 1 minus the probability that it does.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) {
    const [ev, fav, words] = r.pick([['an even number', 3, '2, 4, 6'], ['a number greater than 4', 2, '5, 6'], ['a 6', 1, '6'], ['a number less than 3', 2, '1, 2'], ['a prime number', 3, '2, 3, 5'], ['not a 1', 5, '2, 3, 4, 5, 6']]);
    return num(frac(fav, 6), [`A number cube has 6 outcomes: 1 to 6.`, `Favourable: ${words}, which is ${fav} outcome${fav > 1 ? 's' : ''}.`, `P = ${fav}/6 = ${frac(fav, 6)}.`], { q: `You roll a number cube (1 to 6). What is the probability of rolling ${ev}? Write it as a fraction.`, exactForm: 'fraction', expr: `${fav}/6` });
  }
  if (t === 1) {
    const red = r.int(1, 8), blue = r.int(1, 8), green = r.int(1, 6), tot = red + blue + green, either = r.bool(), [fav, what] = either ? [red + blue, 'red or blue'] : [tot - green, 'not green'];
    return num(frac(fav, tot), [`There are ${tot} marbles in all.`, either ? `Red or blue: ${red} + ${blue} = ${fav}.` : `Not green: ${tot} − ${green} = ${fav}.`, `P = ${fav}/${tot} = ${frac(fav, tot)}.`], { q: `A bag has ${red} red, ${blue} blue and ${green} green marbles. What is the probability of picking a marble that is ${what}? Write it as a fraction.`, exactForm: 'fraction', expr: `${fav}/${tot}` });
  }
  if (t === 2) { const p = r.int(1, 9) / 10; return num(dec(1 - p), [`It either rains or it does not, so the two probabilities add to 1.`, `1 − ${p} = ${dec(1 - p)}.`, `So the probability of no rain is ${dec(1 - p)}.`], { q: `The probability of rain tomorrow is ${p}. What is the probability that it does not rain?`, expr: `1-${p}` }); }
  const [n, d] = r.pick([[0, 8], [1, 8], [2, 8], [4, 8], [6, 8], [7, 8], [8, 8]]), right = n === 0 ? 'Impossible' : n === d ? 'Certain' : n * 2 === d ? 'Equally likely as unlikely' : n * 2 < d ? 'Unlikely' : 'Likely';
  return mc(r, right, ['Impossible', 'Unlikely', 'Equally likely as unlikely', 'Likely', 'Certain'].filter((x) => x !== right).slice(0, 3), { q: `A spinner has 8 equal parts. ${n} ${n === 1 ? 'part is' : 'parts are'} blue. How likely is landing on blue?`, steps: [`P(blue) = ${n}/8${n && n !== d ? ` = ${frac(n, d)}` : ''}.`, `0 is impossible, 1 is certain, 1/2 is equally likely. So it is ${right.toLowerCase()}.`] });
});
skill('6-probcomp', 6, 'Probability', 'Compound events', ['To count outcomes of two events, multiply: 3 shirts and 4 pants make 3 × 4 = 12 outfits.', 'Events are independent if one does not change the chances of the other.'], (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const a = r.int(2, 6), b = r.int(2, 5), c = r.bool(0.4) ? r.int(2, 3) : 1; return num(a * b * c, [`Each choice can go with every other choice, so multiply.`, `${a} × ${b}${c > 1 ? ` × ${c}` : ''} = ${a * b * c}.`, `So there are ${a * b * c} outfits.`], { q: `${r.pick(NAMES)} has ${a} shirts and ${b} pairs of pants${c > 1 ? ` and ${c} pairs of shoes` : ''}. How many different outfits can be made?`, expr: `${a}*${b}*${c}` }); }
  if (t === 1) { const [what, n] = r.pick([['flip a coin and roll a number cube (1 to 6)', 12], ['spin a 4-part spinner and flip a coin', 8], ['roll two number cubes', 36], ['flip three coins', 8], ['spin a 3-part spinner and roll a number cube', 18]]); return num(n, [`Count the outcomes of each part, then multiply.`, `So there are ${n} outcomes in the sample space.`], { q: `How many outcomes are in the sample space if you ${what}?`, expr: String(n) }); }
  if (t === 2) { const s = r.int(2, 12), ways = 6 - Math.abs(7 - s); return num(ways, [`List pairs (first, second) that add to ${s}.`, `${Array.from({ length: 6 }, (_, i) => i + 1).filter((a) => s - a >= 1 && s - a <= 6).map((a) => `(${a}, ${s - a})`).join(', ')}.`, `That is ${ways} way${ways > 1 ? 's' : ''}.`], { q: `You roll two number cubes (1 to 6). In how many ways can the sum be ${s}?`, expr: String(ways) }); }
  const [d, right] = r.pick([['Roll a number cube, then flip a coin.', 'Independent'], ['Pick a card from a deck, keep it, then pick another card.', 'Dependent'], ['Pick a marble from a bag, put it back, then pick again.', 'Independent'], ['Pick a name from a hat, do not put it back, then pick another name.', 'Dependent'], ['Spin a spinner twice.', 'Independent']]);
  return mc(r, right, ['Independent', 'Dependent'], { q: `Are these events independent or dependent? ${d}`, steps: [`Ask: does the first event change what can happen in the second?`, right === 'Independent' ? 'No, so they are independent.' : 'Yes, something was taken away, so they are dependent.'] });
});
skill('6-probpredict', 6, 'Probability', 'Predictions and experimental probability', ['Prediction = probability × number of trials.', 'Experimental probability = times it happened ÷ number of trials.'], (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const [act, ev, p, q] = r.pick([['roll a number cube', 'a 3', 1, 6], ['flip a coin', 'heads', 1, 2], ['spin a spinner with 4 equal parts (1 red)', 'red', 1, 4], ['roll a number cube', 'an even number', 1, 2], ['spin a spinner with 5 equal parts (2 blue)', 'blue', 2, 5]]), n = q * r.int(5, 30); return num(n * p / q, [`P(${ev}) = ${p}/${q}.`, `${p}/${q} × ${n} = ${n * p / q}.`, `So you can expect ${ev} about ${n * p / q} times.`], { q: `You ${act} ${n} times. About how many times should you expect ${ev}?`, expr: `${p}/${q}*${n}` }); }
  if (t === 1) {
    const cols = ['Red', 'Blue', 'Green'], cnt = cols.map(() => r.int(2, 15)), tot = cnt.reduce((a, b) => a + b, 0), i = r.int(0, 2);
    return num(frac(cnt[i], tot), [`There were ${tot} spins in all.`, `${cols[i]} came up ${cnt[i]} times.`, `Experimental P = ${cnt[i]}/${tot} = ${frac(cnt[i], tot)}.`], { q: `A spinner was spun many times. What is the experimental probability of ${cols[i].toLowerCase()}? Write it as a fraction.`, visual: { type: 'table', head: ['Colour', 'Times'], rows: cols.map((c, k) => [c, cnt[k]]) }, exactForm: 'fraction', expr: `${cnt[i]}/${tot}` });
  }
  const tries = r.pick([20, 25, 40, 50]), hits = r.int(2, tries - 2), m = r.pick([2, 4, 10]);
  const nm = r.pick(NAMES);
  return num(hits * m, [`Experimental probability: ${hits}/${tries}.`, `${tries * m} shots is ${m} times as many, so ${hits} × ${m} = ${hits * m}.`, `So ${nm} can expect about ${hits * m} baskets.`], { q: `${nm} made ${hits} of ${tries} basketball shots. At this rate, about how many baskets would ${nm} make in ${tries * m} shots?`, expr: `${hits}/${tries}*${tries * m}` });
});

// ───────────── 40. Patterns and sequences ─────────────
skill('6-seq', 6, 'Patterns', 'Number sequences', ['In an arithmetic sequence, add (or subtract) the same number each time.', 'In a geometric sequence, multiply by the same number each time.'], (r) => {
  const t = r.int(0, 4);
  if (t === 0) { const a = r.int(1, 50), d = r.nonzero(-9, 12), s = Array.from({ length: 5 }, (_, i) => a + d * i); if (s.some((v) => v < 0)) return num(a + 5 * Math.abs(d), [`Each term goes up by ${Math.abs(d)}.`, `Next: ${a + 4 * Math.abs(d)} + ${Math.abs(d)} = ${a + 5 * Math.abs(d)}.`, `So the next term is ${a + 5 * Math.abs(d)}.`], { q: `What comes next? ${Array.from({ length: 5 }, (_, i) => a + Math.abs(d) * i).join(', ')}, …`, expr: `${a}+5*${Math.abs(d)}` }); return num(a + 5 * d, [`Each term ${d > 0 ? 'goes up' : 'goes down'} by ${Math.abs(d)}.`, `Next: ${s[4]} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${a + 5 * d}.`, `So the next term is ${a + 5 * d}.`], { q: `What comes next? ${s.join(', ')}, …`, expr: `${a}+5*(${d})` }); }
  if (t === 1) { const a = r.int(1, 5), m = r.int(2, 4), s = Array.from({ length: 4 }, (_, i) => a * m ** i); return num(a * m ** 4, [`Each term is ${m} times the one before.`, `${s[3]} × ${m} = ${a * m ** 4}.`, `So the next term is ${a * m ** 4}.`], { q: `What comes next? ${s.join(', ')}, …`, expr: `${a}*${m}**4` }); }
  if (t === 2) { const a = r.int(1, 30), d = r.int(2, 11), s = Array.from({ length: 5 }, (_, i) => a + d * i), k = r.int(1, 3); return num(s[k], [`The rule is add ${d}: ${s[k - 1]} + ${d}.`, `${s[k - 1]} + ${d} = ${s[k]}, and ${s[k]} + ${d} = ${s[k + 1]}. It fits.`, `So the missing term is ${s[k]}.`], { q: `Find the missing term: ${s.map((v, i) => (i === k ? '☐' : v)).join(', ')}`, expr: `${a}+${d}*${k}` }); }
  if (t === 3) { const a = r.int(1, 20), d = r.int(2, 9), n = r.int(8, 15); return num(a + d * (n - 1), [`From the 1st term to the ${n}th term there are ${n - 1} steps of ${d}.`, `${a} + ${n - 1} × ${d} = ${a + d * (n - 1)}.`, `So the ${n}th term is ${a + d * (n - 1)}.`], { q: `A sequence starts at ${a} and adds ${d} each time. What is the ${n}th term?`, expr: `${a}+${d}*(${n}-1)` }); }
  const a = r.int(1, 10), d0 = r.int(1, 3), s = [a]; for (let i = 1; i < 5; i++) s.push(s[i - 1] + d0 + i - 1);
  return num(s[4] + d0 + 4, [`The jumps are ${s.slice(1).map((v, i) => v - s[i]).join(', ')}: each jump is 1 more.`, `Next jump: ${d0 + 4}. ${s[4]} + ${d0 + 4} = ${s[4] + d0 + 4}.`, `So the next term is ${s[4] + d0 + 4}.`], { q: `What comes next? ${s.join(', ')}, …`, expr: `${s[4]}+${d0 + 4}` });
});
skill('6-seqword', 6, 'Patterns', 'Pattern word problems', ['Find the rule first, then use it to go forward.', 'Check every term against the rule to find a mistake.'], (r) => {
  const t = r.int(0, 3), nm = r.pick(NAMES);
  if (t === 0) { const a = r.int(5, 50), d = r.int(3, 15), w = r.int(4, 12); return num(a + d * w, [`${nm} starts with $${a} and adds $${d} each week.`, `After ${w} weeks: ${a} + ${w} × ${d} = ${a + d * w}.`, `So ${nm} has $${a + d * w}.`], { q: `${nm} has $${a} saved and adds $${d} every week. How many dollars will ${nm} have after ${w} weeks?`, expr: `${a}+${w}*${d}` }); }
  if (t === 1) { const a = r.int(1, 20), d = r.int(2, 9), s = Array.from({ length: 6 }, (_, i) => a + d * i), k = r.int(1, 5), bad = [...s]; bad[k] += r.nonzero(-1, 1) * r.int(1, Math.max(1, d - 1)); return mc(r, bad[k], bad.filter((_, i) => i !== k).slice(0, 3), { q: `The rule is "add ${d}". Which number in this list is a mistake? ${bad.join(', ')}`, steps: [`Start at ${a} and add ${d}: ${s.join(', ')}.`, `${bad[k]} should be ${s[k]}, so ${bad[k]} is the mistake.`] }); }
  if (t === 2) { const p = r.int(2, 5), q = p * r.int(2, 3), n = r.int(3, 8); return num(q * n, [`Pattern A adds ${p}; pattern B adds ${q}. Both start at 0.`, `Each B term is ${q / p} times the A term. A's term ${p * n} is term number ${n}, and B's term number ${n} is ${q} × ${n} = ${q * n}.`, `So the answer is ${q * n}.`], { q: `Pattern A: start at 0, add ${p}. Pattern B: start at 0, add ${q}. When pattern A reaches ${p * n}, what is the matching term of pattern B?`, expr: `${q}*${n}` }); }
  const a = r.int(3, 6), d = r.int(2, 5), n = r.int(6, 12);
  return num(a + d * (n - 1), [`Figure 1 has ${a} squares and each figure adds ${d}.`, `Figure ${n}: ${a} + ${n - 1} × ${d} = ${a + d * (n - 1)}.`, `So figure ${n} has ${a + d * (n - 1)} squares.`], { q: `A pattern of squares: figure 1 has ${a} squares, figure 2 has ${a + d}, figure 3 has ${a + 2 * d}. How many squares are in figure ${n}?`, expr: `${a}+${d}*(${n}-1)` });
});

// ───────────── 41. Financial literacy ─────────────
skill('6-finance', 6, 'Financial literacy', 'Banking, payments, saving and budgets', ['A deposit puts money into an account; a withdrawal takes it out. Interest is money paid for saving or charged for borrowing.', 'A budget plans income and expenses. If expenses are more than income, cut spending or earn more.'], (r) => {
  const t = r.int(0, 4), nm = r.pick(NAMES);
  if (t === 0) { const V = [['money put into a bank account', 'Deposit'], ['money taken out of a bank account', 'Withdrawal'], ['money a bank pays you for keeping your savings there', 'Interest'], ['money that is borrowed and must be paid back', 'Loan'], ['an account mainly for everyday spending and paying bills', 'Chequing account'], ['an account mainly for keeping money you do not plan to spend soon', 'Savings account']]; const [d, right] = r.pick(V); return mc(r, right, r.shuffle(V.map((v) => v[1]).filter((x) => x !== right)).slice(0, 3), { q: `What is the word for ${d}?`, steps: [`Think about which way the money moves and why.`, `It is called a ${right.toLowerCase()}.`] }); }
  if (t === 1) { const P = [['takes money straight out of your bank account when you pay', 'Debit card'], ['lets you buy now and pay later, but may charge interest if you pay late', 'Credit card'], ['needs no bank account, but can be lost or stolen and is hard to replace', 'Cash'], ['lets you pay a fixed amount you loaded on it ahead of time', 'Prepaid card']]; const [d, right] = r.pick(P); return mc(r, right, P.map((p) => p[1]).filter((x) => x !== right), { q: `Which way to pay ${d}?`, steps: [`Match each payment method to how it works.`, `That is a ${right.toLowerCase()}.`] }); }
  if (t === 2) { const P0 = r.int(2, 10) * 100, rate = r.int(2, 5), yrs = r.int(2, 4), I = P0 * rate * yrs / 100, bonus = Math.max(5, I + r.pick([-20, -10, 10, 15, 20])); const right = I > bonus ? `Account A` : `Account B`; return mc(r, right, ['Account A', 'Account B'], { q: `${nm} has $${P0} to save for ${yrs} years. Account A pays ${rate}% simple interest each year. Account B pays a one-time bonus of $${bonus}. Which earns more?`, steps: [`Account A: ${P0} × ${rate}% × ${yrs} = $${I}.`, `Account B: $${bonus}. So ${right} earns more.`] }); }
  const rent = r.int(5, 15) * 10, food = r.int(5, 12) * 10, fun = r.int(2, 8) * 10, inc = rent + food + fun + r.int(1, 30) * 10, left = inc - rent - food - fun;
  if (t === 3) return num(left, [`Expenses: $${rent} + $${food} + $${fun} = $${rent + food + fun}.`, `Income − expenses: ${inc} − ${rent + food + fun} = ${left}.`, `So ${left} is left over.`], { q: `${nm}'s monthly budget: income ${inc}; phone ${rent}, food ${food}, fun ${fun}. How much money is left after expenses, in dollars?`, expr: `${inc}-${rent}-${food}-${fun}` });
  const cut = r.int(1, fun / 10) * 10, goal = left + cut;
  return num(cut, [`Right now ${nm} has ${left} left after expenses.`, `To save ${goal}, ${nm} needs ${goal} − ${left} = ${cut} more.`, `So ${nm} must cut fun spending by $${cut}.`], { q: `${nm} earns $${inc} a month and spends $${rent} on phone, $${food} on food and $${fun} on fun. ${nm} wants to save $${goal} a month. By how many dollars must ${nm} cut fun spending?`, expr: `${goal}-(${inc}-${rent}-${food}-${fun})` });
});

export default list;
