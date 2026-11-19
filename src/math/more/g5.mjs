// Grade 5 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
import * as GEO45 from './geo45.mjs';
const { skill, list } = grade();

// ── helpers for this grade ──
const W1 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const W10 = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const w99 = (n) => (n < 20 ? W1[n] : W10[Math.floor(n / 10)] + (n % 10 ? '-' + W1[n % 10] : ''));
const w999 = (n) => [Math.floor(n / 100) ? `${W1[Math.floor(n / 100)]} hundred` : '', n % 100 ? w99(n % 100) : ''].filter(Boolean).join(' ');
// whole numbers below a million in words
const words = (n) => (n === 0 ? 'zero' : [Math.floor(n / 1000) ? `${w999(Math.floor(n / 1000))} thousand` : '', n % 1000 ? w999(n % 1000) : ''].filter(Boolean).join(' '));
const DECW = ['tenth', 'hundredth', 'thousandth'];
// a decimal given as N / 10^p in words: decWords(3407, 2) → "thirty-four and seven hundredths"
const decWords = (N, p) => { const i = Math.floor(N / 10 ** p), f = N % 10 ** p; const tail = f ? `${words(f)} ${DECW[p - 1]}${f === 1 ? '' : 's'}` : ''; return i ? (tail ? `${words(i)} and ${tail}` : words(i)) : tail; };
const fx = (N, p) => (N / 10 ** p).toFixed(p);                 // N / 10^p shown with p places
const RN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const romanParts = (n) => { const out = []; for (const [v, s] of RN) while (n >= v) { out.push([v, s]); n -= v; } return out; };
const roman = (n) => romanParts(n).map((p) => p[1]).join('');
const js = (s) => s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
const money = (c) => `$${(c / 100).toFixed(2)}`;
const cents = (c) => (c / 100).toFixed(2);
const cmp = (a, b) => (a > b ? '>' : a < b ? '<' : '=');
const signMC = (r, a, b, extra) => { const s = cmp(a, b); return mc(r, s, ['>', '<', '='].filter((x) => x !== s), extra); };
const roundTo = (n, p) => Math.round(n / p) * p;
const roundLead = (n) => { const p = 10 ** (String(n).length - 1); return Math.round(n / p) * p; };
const mixed = (n, d) => { const [a, b] = simplify(n, d); const w = Math.floor(a / b), p = a % b; return p === 0 ? String(w) : w ? `${w} ${p}/${b}` : `${p}/${b}`; };
const tweak = (r, n) => { const s = String(n).split(''); const i = r.int(0, s.length - 1); let d = r.int(i ? 0 : 1, 9); while (String(d) === s[i]) d = r.int(i ? 0 : 1, 9); s[i] = String(d); return Number(s.join('')); };
const factorsOf = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0);
const yesNo = (r, yes, extra) => mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], extra);
// all orderings of a short list
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));
// "Which list is in order?" as multiple choice; vals are numbers, show(v) is how each is written
const orderMC = (r, vals, show, asc, extra) => {
  const sorted = [...vals].sort((a, b) => (asc ? a - b : b - a)), sep = asc ? ' < ' : ' > ';
  const right = sorted.map(show).join(sep);
  const wrongs = r.shuffle(perms(vals).map((p) => p.map(show).join(sep)).filter((s) => s !== right));
  return mc(r, right, wrongs.slice(0, 3), { q: `Which list puts these in order from ${asc ? 'least to greatest' : 'greatest to least'}? ${r.shuffle(vals).map(show).join('; ')}`, ...extra, steps: [...(extra.steps ?? []), `In order: ${right}.`] });
};

// ───────────── 1. Place value and number sense ─────────────
skill('5-pv-place', 5, 'Place value', 'Place value to a million', ['Each place is worth 10 times the place to its right.', 'In 482,315 the 8 is in the ten thousands place, so it is worth 80,000.', 'Expanded form adds up the value of every digit.'], (r) => {
  const n = r.int(100000, 999999), s = String(n), v = r.int(0, 4);
  const valsOf = (m) => String(m).split('').map((d, i, a) => Number(d) * 10 ** (a.length - 1 - i)).filter((x) => x > 0);
  const vals = valsOf(n), exp = vals.map(comma).join(' + ');
  if (v === 0) {
    let i = r.int(0, 4); while (s[i] === '0') i = r.int(0, 4);
    const d = Number(s[i]), pv = 10 ** (5 - i), place = PLACE[5 - i];
    return num(d * pv, [`The digit in the ${place} place of ${comma(n)} is ${d}.`, `One ${place.replace(/s$/, '')} is ${comma(pv)}, so the ${d} is worth ${d} × ${comma(pv)} = ${comma(d * pv)}.`, `So the value is ${comma(d * pv)}.`], { q: `What is the value of the digit in the ${place} place of ${comma(n)}?`, expr: `${d}*${pv}` });
  }
  if (v === 1) {
    const w1 = vals.map((x, k) => (k === vals.length - 1 ? x * 10 : x)).map(comma).join(' + ');
    const w2 = vals.map((x, k) => (k === 0 ? x / 10 : x)).map(comma).join(' + ');
    const sw = s.split(''); [sw[1], sw[2]] = [sw[2], sw[1]];
    const w3 = valsOf(Number(sw.join(''))).map(comma).join(' + ');
    return mc(r, exp, [w1, w2, w3], { q: `Which is the expanded form of ${comma(n)}?`, steps: [`Write the value of each digit that is not 0, from the left.`, `${comma(n)} = ${exp}.`] });
  }
  if (v === 2) return num(n, [`Put each digit in its place: ${exp}.`, `That makes ${comma(n)}.`, `So the number is ${comma(n)}.`], { q: `Write ${exp} as a number.`, expr: vals.join('+') });
  if (v === 3) {
    const U = [['tens', 10], ['hundreds', 100], ['thousands', 1000], ['ten thousands', 10000]];
    const a = r.int(1, 3), b = r.int(0, a - 1), k = r.int(2, 60), [bn, bv] = U[a], [sn, sv] = U[b], ans = k * bv / sv;
    return num(ans, [`1 ${bn.replace(/s$/, '')} = ${comma(bv / sv)} ${sn}.`, `${k} × ${comma(bv / sv)} = ${comma(ans)}.`, `So ${k} ${bn} = ${comma(ans)} ${sn}.`], { q: `${k} ${bn} = how many ${sn}?`, expr: `${k}*${bv}/${sv}` });
  }
  const d = r.int(1, 9), hi = r.int(1, 5), lo = r.int(0, hi - 1);
  const arr = [r.int(1, 9), ...Array.from({ length: 5 }, () => r.int(0, 9))]; arr[5 - hi] = d; arr[5 - lo] = d;
  const m = Number(arr.join('')), ans = 10 ** (hi - lo);
  return num(ans, [`The ${d} in the ${PLACE[hi]} place is worth ${comma(d * 10 ** hi)}. The ${d} in the ${PLACE[lo]} place is worth ${comma(d * 10 ** lo)}.`, `${comma(d * 10 ** hi)} ÷ ${comma(d * 10 ** lo)} = ${comma(ans)}.`, `So it is ${comma(ans)} times as much.`], { q: `In ${comma(m)}, the value of the ${d} in the ${PLACE[hi]} place is how many times the value of the ${d} in the ${PLACE[lo]} place?`, expr: `${d * 10 ** hi}/${d * 10 ** lo}` });
});
skill('5-pv-words', 5, 'Place value', 'Number names and Roman numerals', ['Read a big number in two parts: the thousands, then the last three digits.', '405,120 is "four hundred five thousand one hundred twenty".', 'Roman numerals: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. A smaller one before a bigger one is taken away: IX = 9.'], (r) => {
  const n = r.int(10000, 999999), v = r.int(0, 3), th = Math.floor(n / 1000), rest = n % 1000;
  const read = [`The part before the comma, ${th}, is read "${w999(th)} thousand".`, rest ? `The last three digits, ${rest}, are read "${w999(rest)}".` : 'The last three digits are all 0, so nothing more is said.'];
  if (v === 0) return mc(r, words(n), [tweak(r, n), tweak(r, n), tweak(r, n)].map(words), { q: `Which is the word name for ${comma(n)}?`, steps: [...read, `So it is ${words(n)}.`] });
  if (v === 1) return num(n, [`"${w999(th)} thousand" is ${th} thousands.`, `So the number is ${comma(n)}.`], { q: `Write this number in digits: ${words(n)}.`, expr: String(n) });
  const k = r.int(4, 1500), R = roman(k), parts = romanParts(k);
  if (v === 2) return num(k, [`Break it into parts: ${parts.map(([a, s]) => `${s} = ${a}`).join(', ')}.`, `Add: ${parts.map((p) => p[0]).join(' + ')} = ${k}.`, `So ${R} = ${k}.`], { q: `What number is the Roman numeral ${R}?`, expr: parts.map((p) => p[0]).join('+') });
  return mc(r, R, [roman(k + 1), roman(k + 10), roman(Math.max(1, k - 9)), roman(k + 100)].filter((x) => x !== R), { q: `Which Roman numeral means ${k}?`, steps: [`Split ${k} into parts: ${parts.map((p) => p[0]).join(' + ')}.`, `Write each part: ${parts.map((p) => p[1]).join(' ')}.`, `So ${k} = ${R}.`] });
});
skill('5-pv-compare', 5, 'Place value', 'Compare, order and round big numbers', ['Compare digits from the left. The first place where they differ decides.', 'To round, look at the digit just to the right of the rounding place: 5 or more rounds up.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const a = r.int(100000, 999999), b = r.bool(0.1) ? a : tweak(r, a), s = String(a), t = String(b);
    const i = [...s].findIndex((c, k) => c !== t[k]);
    return signMC(r, a, b, { q: `Which sign makes this true? ${comma(a)} ? ${comma(b)}`, steps: ['Both numbers have 6 digits, so compare from the left.', i < 0 ? 'Every digit is the same.' : `The first different digits are in the ${PLACE[5 - i]} place: ${s[i]} and ${t[i]}.`, `So ${comma(a)} ${cmp(a, b)} ${comma(b)}.`] });
  }
  if (v === 1) {
    const a = r.int(100000, 999999), set = new Set([a]); while (set.size < 3) set.add(tweak(r, a));
    return orderMC(r, [...set], comma, r.bool(), { steps: ['Compare digit by digit from the left.'] });
  }
  if (v === 2) {
    const n = r.int(10000, 999999), p = r.pick([1000, 10000, 100000].filter((x) => x * 10 <= n * 10)), ans = roundTo(n, p);
    const d = Math.floor(n / (p / 10)) % 10, place = { 1000: 'thousand', 10000: 'ten thousand', 100000: 'hundred thousand' }[p];
    return num(ans, [`Look at the digit to the right of the ${place}s place: ${d}.`, d >= 5 ? `${d} is 5 or more, so round up to ${comma(ans)}.` : `${d} is less than 5, so round down to ${comma(ans)}.`, `So ${comma(n)} rounds to ${comma(ans)}.`], { q: `Round ${comma(n)} to the nearest ${place}.`, expr: `Math.round(${n}/${p})*${p}` });
  }
  if (v === 3) {
    const a = r.int(100, 9999), b = r.int(100, 9999), add = r.bool(), eo = (x) => (x % 2 ? 'odd' : 'even');
    const res = add ? eo(a + b) : eo(a * b);
    return mc(r, res === 'even' ? 'Even' : 'Odd', [res === 'even' ? 'Odd' : 'Even'], { q: `Without working it out, is ${comma(a)} ${add ? '+' : '×'} ${comma(b)} even or odd?`, steps: [`${comma(a)} ends in ${a % 10}, so it is ${eo(a)}. ${comma(b)} ends in ${b % 10}, so it is ${eo(b)}.`, add ? 'Even + even and odd + odd are even; even + odd is odd.' : 'A product is odd only when both numbers are odd.', `So the answer is ${res}.`] });
  }
  const by = r.pick([25, 50, 250, 500, 1000, 2500, 5000]), start = by * r.int(1, 20), seq = [0, 1, 2, 3].map((i) => start + i * by), ans = start + 4 * by;
  return num(ans, [`Each number is ${comma(by)} more than the one before.`, `${comma(seq[3])} + ${comma(by)} = ${comma(ans)}.`, `So the next number is ${comma(ans)}.`], { q: `What comes next? ${seq.map(comma).join(', ')}, ?`, expr: `${start}+4*${by}` });
});

// ───────────── 2. Addition and subtraction ─────────────
skill('5-as-big', 5, 'Addition and subtraction', 'Add and subtract to a million', ['Line up the digits by place value.', 'Add or subtract one column at a time, starting with the ones.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const a = r.int(10000, 600000), b = r.int(10000, 999999 - a); return num(a + b, columnAdd([a, b]), { q: `${comma(a)} + ${comma(b)} = ?`, expr: `${a}+${b}` }); }
  if (v === 1) { const a = r.int(100000, 999999), b = r.int(10000, a - 1); return num(a - b, columnSub(a, b), { q: `${comma(a)} − ${comma(b)} = ?`, expr: `${a}-${b}` }); }
  if (v === 2) {
    const a = r.int(10000, 500000), b = r.int(10000, 400000);
    const q = r.pick([`A city library lent out ${comma(a)} books last year and ${comma(b)} books this year. How many books is that in all?`, `A hockey team sold ${comma(a)} tickets in the fall and ${comma(b)} tickets in the spring. How many tickets did it sell altogether?`, `A farm grew ${comma(a)} kg of potatoes and ${comma(b)} kg of carrots. How many kilograms of vegetables is that in total?`]);
    return num(a + b, ['Putting two amounts together means adding.', `${comma(a)} + ${comma(b)} = ${comma(a + b)}.`, `So the total is ${comma(a + b)}.`], { q, expr: `${a}+${b}` });
  }
  const a = r.int(100000, 999999), b = r.int(10000, a - 1000);
  const q = r.pick([`A fundraiser's goal is $${comma(a)}. So far $${comma(b)} has been raised. How many more dollars are needed?`, `A stadium has ${comma(a)} seats. ${comma(b)} seats are filled. How many seats are empty?`, `A town had ${comma(a)} trees. A storm knocked down ${comma(b)}. How many trees are still standing?`]);
  return num(a - b, ['Finding how much is left or how much more means subtracting.', `${comma(a)} − ${comma(b)} = ${comma(a - b)}.`, `So the answer is ${comma(a - b)}.`], { q, expr: `${a}-${b}` });
});
skill('5-as-estimate', 5, 'Addition and subtraction', 'Estimate and use patterns', ['To estimate, round each number first, then add or subtract.', 'Use basic facts with place value: 8 + 7 = 15, so 8,000 + 7,000 = 15,000.'], (r) => {
  const v = r.int(0, 3), UN = { 100: 'hundreds', 1000: 'thousands', 10000: 'ten thousands' };
  if (v === 0) {
    const a = r.int(10000, 99999), b = r.int(10000, 99999), Ra = roundTo(a, 1000), Rb = roundTo(b, 1000);
    const q = r.bool() ? `Estimate ${comma(a)} + ${comma(b)} by rounding each number to the nearest thousand.` : `A school collected ${comma(a)} cans in one drive and ${comma(b)} cans in another. Round each number to the nearest thousand to estimate the total.`;
    return num(Ra + Rb, [`${comma(a)} rounds to ${comma(Ra)}. ${comma(b)} rounds to ${comma(Rb)}.`, `${comma(Ra)} + ${comma(Rb)} = ${comma(Ra + Rb)}.`, `So the total is about ${comma(Ra + Rb)}.`], { q, expr: `Math.round(${a}/1000)*1000+Math.round(${b}/1000)*1000` });
  }
  if (v === 1) {
    const a = r.int(200000, 999999), b = r.int(10000, a - 100000), Ra = roundTo(a, 10000), Rb = roundTo(b, 10000);
    return num(Ra - Rb, [`${comma(a)} rounds to ${comma(Ra)}. ${comma(b)} rounds to ${comma(Rb)}.`, `${comma(Ra)} − ${comma(Rb)} = ${comma(Ra - Rb)}.`, `So the difference is about ${comma(Ra - Rb)}.`], { q: `Estimate ${comma(a)} − ${comma(b)} by rounding each number to the nearest ten thousand.`, expr: `Math.round(${a}/10000)*10000-Math.round(${b}/10000)*10000` });
  }
  const p = r.pick([100, 1000, 10000]);
  if (v === 2) {
    const x = r.int(2, 9), y = r.int(2, 9), ans = (x + y) * p;
    return num(ans, [`${comma(x * p)} is ${x} ${UN[p]} and ${comma(y * p)} is ${y} ${UN[p]}.`, `${x} + ${y} = ${x + y}, so the total is ${x + y} ${UN[p]}.`, `So ${comma(x * p)} + ${comma(y * p)} = ${comma(ans)}.`], { q: `${x} + ${y} = ${x + y}. Use this to find ${comma(x * p)} + ${comma(y * p)}.`, expr: `${x * p}+${y * p}` });
  }
  const x = r.int(11, 18), y = r.int(2, 9), ans = (x - y) * p;
  return num(ans, [`${comma(x * p)} is ${x} ${UN[p]} and ${comma(y * p)} is ${y} ${UN[p]}.`, `${x} − ${y} = ${x - y}, so the difference is ${x - y} ${UN[p]}.`, `So ${comma(x * p)} − ${comma(y * p)} = ${comma(ans)}.`], { q: `${x} − ${y} = ${x - y}. Use this to find ${comma(x * p)} − ${comma(y * p)}.`, expr: `${x * p}-${y * p}` });
});
skill('5-as-missing', 5, 'Addition and subtraction', 'Missing numbers, inequalities and properties', ['Addition and subtraction undo each other: if a + ? = c, then ? = c − a.', 'Changing the order or grouping of numbers being added does not change the sum.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) { const a = r.int(1000, 60000), c = r.int(a + 100, 99999); return num(c - a, [`To find a missing part, subtract: ${comma(c)} − ${comma(a)}.`, `${comma(c)} − ${comma(a)} = ${comma(c - a)}.`, `So the missing number is ${comma(c - a)}.`], { q: `${comma(a)} + ? = ${comma(c)}`, expr: `${c}-${a}` }); }
  if (v === 1) { const b = r.int(1000, 50000), d = r.int(1000, 50000); return num(b + d, [`The missing number is the starting amount, so add back what was taken away.`, `${comma(d)} + ${comma(b)} = ${comma(b + d)}.`, `So the missing number is ${comma(b + d)}.`], { q: `? − ${comma(b)} = ${comma(d)}`, expr: `${b}+${d}` }); }
  if (v === 2) {
    const a = r.int(40000, 60000), b = r.int(10000, 39000), add = r.bool(), val = add ? a + b : a - b;
    const c = r.bool(0.2) ? val : roundTo(val, 1000) + r.pick([-1000, 0, 1000]);
    const e = `${comma(a)} ${add ? '+' : '−'} ${comma(b)}`;
    return signMC(r, val, c, { q: `Which sign makes this true? ${e} ? ${comma(c)}`, steps: [`Work out the left side: ${e} = ${comma(val)}.`, `Compare ${comma(val)} with ${comma(c)}.`, `So ${e} ${cmp(val, c)} ${comma(c)}.`] });
  }
  if (v === 3) {
    const x = r.int(10, 999), y = r.int(10, 999), z = r.int(10, 999), k = r.int(0, 2);
    const P = [[`${x} + ${y} = ${y} + ${x}`, 'Commutative property', 'The numbers swapped order and the sum stayed the same.'], [`(${x} + ${y}) + ${z} = ${x} + (${y} + ${z})`, 'Associative property', 'The brackets moved, so the grouping changed, and the sum stayed the same.'], [`${x} + 0 = ${x}`, 'Identity property', 'Adding 0 leaves a number the same.']][k];
    return mc(r, P[1], ['Commutative property', 'Associative property', 'Identity property'].filter((s) => s !== P[1]), { q: `Which property of addition is shown? ${P[0]}`, steps: [P[2], `This is the ${P[1].toLowerCase()}.`] });
  }
  const S = r.int(20, 90) * 1000, a = r.int(5, S / 1000 - 5) * 1000 + r.int(1, 9) * 100, b = S - a;
  return mc(r, `${comma(a)} and ${comma(b)}`, [`${comma(a)} and ${comma(b + 1000)}`, `${comma(a + 100)} and ${comma(b + 100)}`, `${comma(a - 1000)} and ${comma(b - 100)}`], { q: `Which two numbers have a sum of ${comma(S)}?`, steps: [`Add each pair and look for ${comma(S)}.`, `${comma(a)} + ${comma(b)} = ${comma(S)}.`] });
});

// ───────────── 3. Multiplication ─────────────
skill('5-mul-zeros', 5, 'Multiplication', 'Multiply with zeros and estimate', ['Multiply the front digits, then write all the zeros: 60 × 700 is 6 × 7 = 42 with 3 zeros, 42,000.', 'To estimate a product, round each number to its greatest place first.'], (r) => {
  const v = r.int(0, 3), x = r.int(2, 12), y = r.int(2, 12);
  if (v === 0) {
    const zx = r.int(0, 2), zy = r.int(zx ? 0 : 1, 2), A = x * 10 ** zx, B = y * 10 ** zy, ans = A * B;
    return num(ans, [`Multiply the front parts: ${x} × ${y} = ${x * y}.`, `Count the zeros at the end: ${zx} + ${zy} = ${zx + zy}. Write them after ${x * y}.`, `So ${comma(A)} × ${comma(B)} = ${comma(ans)}.`], { q: `${comma(A)} × ${comma(B)} = ?`, expr: `${A}*${B}` });
  }
  if (v === 1) {
    const p = r.pick([10, 100, 1000]), ans = x * y * p;
    return num(ans, [`${comma(y * p)} is ${y} × ${comma(p)}.`, `So ${x} × ${comma(y * p)} = ${x * y} × ${comma(p)} = ${comma(ans)}.`, `The answer is ${comma(ans)}.`], { q: `${x} × ${y} = ${x * y}. Use this to find ${x} × ${comma(y * p)}.`, expr: `${x}*${y * p}` });
  }
  if (v === 2) {
    const a = r.int(110, 949), b = r.int(11, 94), ra = roundLead(a), rb = roundLead(b), ans = ra * rb;
    return num(ans, [`${a} rounds to ${ra} and ${b} rounds to ${rb}.`, `${ra} × ${rb} = ${comma(ans)}.`, `So ${a} × ${b} is about ${comma(ans)}.`], { q: `Estimate ${a} × ${b} by rounding each number to its greatest place.`, expr: `${ra}*${rb}` });
  }
  const A = x * 10, B = y * 100, ans = A * B;
  const q = r.pick([`Each box holds ${A} pencils. How many pencils are in ${comma(B)} boxes?`, `A machine fills ${A} bottles a minute. How many bottles does it fill in ${comma(B)} minutes?`, `A school buys ${comma(B)} packs of paper with ${A} sheets in each pack. How many sheets is that?`]);
  return num(ans, [`Multiply: ${A} × ${comma(B)}.`, `${x} × ${y} = ${x * y}, then write 3 zeros: ${comma(ans)}.`, `So the answer is ${comma(ans)}.`], { q, expr: `${A}*${B}` });
});
skill('5-mul-long', 5, 'Multiplication', 'Multiply multi-digit numbers', ['Split the numbers by place value and multiply each part (an area model).', 'Then add the partial products.'], (r) => {
  const v = r.int(0, 4), dig = () => r.int(1, 9) * 10 + r.int(1, 9);
  if (v === 0) {
    const a = dig(), b = dig(), ta = a - a % 10, oa = a % 10, tb = b - b % 10, ob = b % 10, P = [ta * tb, ta * ob, oa * tb, oa * ob];
    return num(a * b, [St(`Split ${a} into ${ta} + ${oa} and ${b} into ${tb} + ${ob}.`, areaModel(a, b)), St(`Multiply each part: ${ta} × ${tb} = ${P[0]}, ${ta} × ${ob} = ${P[1]}, ${oa} × ${tb} = ${P[2]}, ${oa} × ${ob} = ${P[3]}.`), St(`Add the parts: ${P.join(' + ')} = ${comma(a * b)}.`), St(`So ${a} × ${b} = ${comma(a * b)}.`)], { q: `${a} × ${b} = ?`, expr: `${a}*${b}` });
  }
  if (v === 1) { const a = r.int(101, 999), b = r.int(11, 99); return num(a * b, columnMul(a, b), { q: `${a} × ${b} = ?`, expr: `${a}*${b}` }); }
  if (v === 2) {
    const a = r.int(12, 250), b = r.int(12, 60);
    const q = r.pick([`A theatre has ${b} rows with ${a} seats in each row. How many seats are there?`, `A bakery makes ${a} muffins every day. How many muffins does it make in ${b} days?`, `A school bus drives ${a} km each week. How far does it drive in ${b} weeks, in kilometres?`]);
    return num(a * b, [`There are ${b} groups of ${a}, so multiply.`, `${a} × ${b} = ${comma(a * b)}.`, `So the answer is ${comma(a * b)}.`], { q, expr: `${a}*${b}` });
  }
  if (v === 3) { const a = r.int(1001, 9999), d = r.int(2, 9); return num(a * d, columnMul(a, d), { q: `${a} × ${d} = ?`, expr: `${a}*${d}` }); }
  const a = r.int(12, 99), b = dig(), tb = b - b % 10, ob = b % 10, nm = r.pick(NAMES);
  return num(a * b, [`${b} = ${tb} + ${ob}, so ${a} × ${b} = ${a} × ${tb} + ${a} × ${ob}.`, `${comma(a * tb)} + ${a * ob} = ${comma(a * b)}.`, `So ${a} × ${b} = ${comma(a * b)}.`], { q: `To find ${a} × ${b}, ${nm} works out ${a} × ${tb} = ${comma(a * tb)} and ${a} × ${ob} = ${a * ob}. What is ${a} × ${b}?`, expr: `${a}*${b}` });
});
skill('5-mul-props', 5, 'Multiplication', 'Properties of multiplication', ['You can multiply in any order (commutative) and group numbers any way (associative).', 'Distributive: 6 × 47 = 6 × 40 + 6 × 7.', 'Look for easy pairs like 25 × 4 = 100.'], (r) => {
  const v = r.int(0, 4), x = r.int(2, 12), y = r.int(2, 12), z = r.int(2, 12);
  if (v === 0) {
    const k = r.int(0, 4), NM = ['Commutative property', 'Associative property', 'Distributive property', 'Identity property', 'Zero property'];
    const P = [[`${x} × ${y} = ${y} × ${x}`, 'The order changed and the product stayed the same.'], [`(${x} × ${y}) × ${z} = ${x} × (${y} × ${z})`, 'The grouping changed and the product stayed the same.'], [`${x} × (${y} + ${z}) = ${x} × ${y} + ${x} × ${z}`, 'Multiplying a sum is the same as multiplying each part and adding.'], [`${x} × 1 = ${x}`, 'Multiplying by 1 leaves a number the same.'], [`${x} × 0 = 0`, 'Multiplying by 0 always gives 0.']][k];
    return mc(r, NM[k], r.shuffle(NM.filter((s, i) => i !== k)).slice(0, 3), { q: `Which property is shown? ${P[0]}`, steps: [P[1], `This is the ${NM[k].toLowerCase()}.`] });
  }
  if (v === 1) {
    const [p1, p2] = r.pick([[25, 4], [5, 2], [50, 2], [20, 5], [4, 5], [2, 50]]), k = r.int(3, 19), four = r.bool(0.4), m = four ? r.int(2, 3) : 1;
    const ns = r.shuffle(four ? [p1, p2, k, m] : [p1, p2, k]), ans = p1 * p2 * k * m;
    return num(ans, [`Multiply in any order. Start with an easy pair: ${p1} × ${p2} = ${p1 * p2}.`, `Then ${p1 * p2} × ${k}${four ? ` × ${m}` : ''} = ${comma(ans)}.`, `So the product is ${comma(ans)}.`], { q: `${ns.join(' × ')} = ?`, expr: ns.join('*') });
  }
  if (v === 2) {
    const a = r.int(11, 99), b = r.int(11, 99), val = a * b, c = r.bool(0.15) ? val : roundTo(val, 100) + r.pick([-100, 0, 100]);
    return signMC(r, val, c, { q: `Which sign makes this true? ${a} × ${b} ? ${comma(c)}`, steps: [`${a} × ${b} = ${comma(val)}.`, `Compare ${comma(val)} with ${comma(c)}.`, `So ${a} × ${b} ${cmp(val, c)} ${comma(c)}.`] });
  }
  if (v === 3) {
    const t = r.int(1, 9) * 10, o = r.int(1, 9), m = r.int(3, 9), b = t + o;
    return num(o, [`Split ${b} into tens and ones: ${b} = ${t} + ${o}.`, `So ${m} × ${b} = ${m} × ${t} + ${m} × ${o}.`, `The missing number is ${o}.`], { q: `Use the distributive property: ${m} × ${b} = ${m} × ${t} + ${m} × ?`, expr: `${b}-${t}` });
  }
  const n = r.int(3, 9), k = r.int(18, 32), m = r.int(2, 6), ans = n * k * m;
  return num(ans, [`Students: ${n} × ${k} = ${n * k}.`, `Notebooks: ${n * k} × ${m} = ${comma(ans)}.`, `So they need ${comma(ans)} notebooks.`], { q: `A school has ${n} classes with ${k} students in each. Every student needs ${m} notebooks. How many notebooks are needed?`, expr: `${n}*${k}*${m}` });
});

// ───────────── 4. Division ─────────────
skill('5-div-facts', 5, 'Division', 'Division facts, zeros and estimates', ['Use a times fact: 56 ÷ 7 = 8 because 7 × 8 = 56.', 'With zeros: 5,600 ÷ 80 is the same as 560 ÷ 8 = 70.', 'To estimate, change the number to one that divides easily.'], (r) => {
  const v = r.int(0, 4), b = r.int(2, 12), q = r.int(2, 12), f = b * q;
  if (v === 0) return num(q, [`Think: ${b} × ? = ${f}.`, `${b} × ${q} = ${f}.`, `So ${f} ÷ ${b} = ${q}.`], { q: `${f} ÷ ${b} = ?`, expr: `${f}/${b}` });
  if (v === 1) return r.bool()
    ? num(f, [`Undo the division with multiplication.`, `${q} × ${b} = ${f}.`, `So the missing number is ${f}.`], { q: `? ÷ ${b} = ${q}`, expr: `${q}*${b}` })
    : num(b, [`Think: ${q} × ? = ${f}.`, `${q} × ${b} = ${f}.`, `So the missing number is ${b}.`], { q: `${f} ÷ ? = ${q}`, expr: `${f}/${q}` });
  if (v === 2) {
    const m = r.int(1, 3), k = r.int(0, Math.min(m, 2)), A = f * 10 ** m, B = b * 10 ** k, ans = q * 10 ** (m - k);
    return num(ans, [`Basic fact: ${f} ÷ ${b} = ${q}.`, `${comma(A)} has ${m} more zero${m > 1 ? 's' : ''} than ${f}${k ? `, and ${comma(B)} has ${k} more than ${b}` : ''}. That leaves ${m - k} zero${m - k === 1 ? '' : 's'} to write after ${q}.`, `So ${comma(A)} ÷ ${comma(B)} = ${comma(ans)}.`], { q: `${comma(A)} ÷ ${comma(B)} = ?`, expr: `${A}/${B}` });
  }
  if (v === 3) {
    const p = r.pick([10, 100, 1000]);
    return num(q * p, [`${comma(f * p)} is ${f} × ${comma(p)}.`, `So the quotient is ${q} × ${comma(p)} = ${comma(q * p)}.`, `${comma(f * p)} ÷ ${b} = ${comma(q * p)}.`], { q: `${f} ÷ ${b} = ${q}. Use this to find ${comma(f * p)} ÷ ${b}.`, expr: `${f * p}/${b}` });
  }
  const d = r.int(3, 9), Q = r.int(2, 9) * 100, A = Q * d + r.nonzero(-d * 9, d * 9);
  return mc(r, String(Q), [String(Q / 10), comma(Q * 10)], { q: `About how much is ${comma(A)} ÷ ${d}?`, steps: [`${comma(A)} is close to ${comma(Q * d)}, which ${d} divides evenly.`, `${comma(Q * d)} ÷ ${d} = ${Q}.`, `So the quotient is about ${Q}.`] });
});
const remText = (q, rem) => ({ answer: `${q} R ${rem}`, accept: [`${q}r${rem}`, `${q} r${rem}`, `${q}r ${rem}`, `${q} remainder ${rem}`, `${q} rem ${rem}`] });
skill('5-div-1digit', 5, 'Division', 'Divide by 1-digit numbers', ['Divide one place at a time from the left: divide, multiply, subtract, bring down.', 'What is left at the end is the remainder. In a story, think about what it means.'], (r) => {
  const v = r.int(0, 2), d = r.int(2, 9);
  if (v === 0) { const q = r.int(100, 1999), a = q * d; return num(q, longDivision(a, d), { q: `${a} ÷ ${d} = ?`, expr: `${a}/${d}` }); }
  if (v === 1) { const q = r.int(100, 1999), rem = r.int(1, d - 1), a = q * d + rem; return { kind: 'text', ...remText(q, rem), q: `${a} ÷ ${d} = ? (write the remainder with R)`, steps: longDivision(a, d) }; }
  const cap = r.int(4, 9); let n = r.int(30, 200); if (n % cap === 0) n++;
  const Q = Math.floor(n / cap), R = n % cap, k = r.int(0, 2);
  const [q, why, ans, ex] = [
    [`${n} students are going on a trip. Each van holds ${cap} students. How many vans are needed so everyone can go?`, `The ${R} students left over still need a van, so add 1.`, Q + 1, `Math.ceil(${n}/${cap})`],
    [`${r.pick(NAMES)} has ${n} cm of ribbon. Each bow needs ${cap} cm. How many bows can be made?`, `The ${R} cm left over is not enough for another bow.`, Q, `Math.floor(${n}/${cap})`],
    [`${n} cookies are packed into boxes of ${cap}. How many cookies are left over after filling as many boxes as possible?`, `The question asks for what is left over: the remainder.`, R, `${n}%${cap}`],
  ][k];
  return num(ans, [`${n} ÷ ${cap} = ${Q} R ${R}.`, why, `So the answer is ${ans}.`], { q, expr: ex });
});
skill('5-div-2digit', 5, 'Division', 'Divide by 2-digit numbers', ['Estimate each digit of the quotient: how many times does the divisor fit?', 'Check by multiplying: quotient × divisor = dividend.'], (r) => {
  const v = r.int(0, 4), d = r.int(11, 99);
  if (v === 0) { const q = r.int(Math.max(2, Math.ceil(100 / d)), Math.floor(999 / d)), a = q * d; return num(q, longDivision(a, d), { q: `${a} ÷ ${d} = ?`, expr: `${a}/${d}` }); }
  if (v === 1) { const q = r.int(Math.ceil(1000 / d), Math.floor(9999 / d)), a = q * d; return num(q, longDivision(a, d), { q: `${a} ÷ ${d} = ?`, expr: `${a}/${d}` }); }
  if (v === 2) {
    const dd = r.int(12, 36), q = r.int(11, 60), a = q * dd;
    const s = r.pick([`A farm packs ${comma(a)} eggs into cartons of ${dd}. How many cartons does it fill?`, `${comma(a)} people sign up for a run and are split into ${dd} equal groups. How many people are in each group?`, `A printer prints ${dd} pages a minute. How many minutes does it take to print ${comma(a)} pages?`]);
    return num(q, [`Divide: ${comma(a)} ÷ ${dd}.`, `Check: ${q} × ${dd} = ${comma(a)}.`, `So the answer is ${q}.`], { q: s, expr: `${a}/${dd}` });
  }
  if (v === 3) {
    const q = r.int(12, 60), a = q * d;
    return mc(r, `${q} × ${d} = ${comma(a)}`, [`${comma(a)} × ${d} = ${comma(a * d)}`, `${q} + ${d} = ${q + d}`, `${d} × ${d} = ${comma(d * d)}`], { q: `Which multiplication fact checks that ${comma(a)} ÷ ${d} = ${q}?`, steps: ['Division and multiplication undo each other.', `If ${comma(a)} ÷ ${d} = ${q}, then ${q} × ${d} = ${comma(a)}.`] });
  }
  const dv = r.pick([20, 25, 50]), Q = r.int(Math.ceil(1000 / dv), Math.floor(9999 / dv) - 1), rem = r.int(1, dv - 1), a = Q * dv + rem, ans = dec(a / dv);
  return num(ans, [`${comma(a)} ÷ ${dv} = ${Q} R ${rem}.`, `The remainder as part of ${dv} is ${rem}/${dv} = ${dec(rem / dv)}.`, `So ${comma(a)} ÷ ${dv} = ${ans}.`], { q: `Divide ${comma(a)} ÷ ${dv}. Write the answer as a decimal.`, expr: `${a}/${dv}` });
});

// ───────────── 5. Exponents ─────────────
skill('5-exp', 5, 'Exponents', 'Powers and exponents', ['An exponent tells how many times to multiply the base by itself: 2^3 = 2 × 2 × 2 = 8.', 'A power of ten is 1 followed by that many zeros: 10^4 = 10,000.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0 || v === 1) {
    const b = r.int(2, 10), e = r.int(2, b <= 6 ? 4 : 3), rep = Array(e).fill(b).join(' × ');
    if (v === 1) return { kind: 'text', answer: `${b}^${e}`, accept: [`${b} ^ ${e}`], q: `Write ${rep} using an exponent.`, steps: [`${b} is multiplied by itself: there are ${e} of them.`, `The base is ${b} and the exponent is ${e}.`, `So ${rep} = ${b}^${e}.`] };
    const run = []; let p = b; for (let i = 1; i < e; i++) { run.push(`${p} × ${b} = ${p * b}`); p *= b; }
    return num(p, [`${b}^${e} means ${rep}.`, `${run.join(', ')}.`, `So ${b}^${e} = ${comma(p)}.`], { q: `What is ${b}^${e}?`, expr: `${b}**${e}` });
  }
  const e = r.int(1, 5);
  if (v === 2) return r.bool()
    ? num(10 ** e, [`10^${e} is 1 followed by ${e} zero${e > 1 ? 's' : ''}.`, `So 10^${e} = ${comma(10 ** e)}.`], { q: `What is 10^${e}?`, expr: `10**${e}` })
    : { kind: 'text', answer: `10^${e}`, accept: [`10 ^ ${e}`], q: `Write ${comma(10 ** e)} as a power of ten.`, steps: [`${comma(10 ** e)} is 1 followed by ${e} zero${e > 1 ? 's' : ''}.`, `So ${comma(10 ** e)} = 10^${e}.`] };
  const n = r.int(2, 999), ee = r.int(1, 4);
  if (v === 3) return num(n * 10 ** ee, [`10^${ee} = ${comma(10 ** ee)}.`, `Multiplying by it puts ${ee} zero${ee > 1 ? 's' : ''} after ${n}: ${comma(n * 10 ** ee)}.`, `So ${n} × 10^${ee} = ${comma(n * 10 ** ee)}.`], { q: `${n} × 10^${ee} = ?`, expr: `${n}*10**${ee}` });
  return num(n, [`10^${ee} = ${comma(10 ** ee)}.`, `Dividing by it takes ${ee} zero${ee > 1 ? 's' : ''} off the end of ${comma(n * 10 ** ee)}.`, `So ${comma(n * 10 ** ee)} ÷ 10^${ee} = ${n}.`], { q: `${comma(n * 10 ** ee)} ÷ 10^${ee} = ?`, expr: `${n * 10 ** ee}/10**${ee}` });
});

// ───────────── 6. Number theory ─────────────
skill('5-nt-prime', 5, 'Number theory', 'Primes, factors and divisibility', ['A prime number has exactly two factors: 1 and itself. A composite number has more.', 'Divisibility rules: by 2 if the last digit is even, by 3 if the digit sum is, by 5 if it ends in 0 or 5, by 9 if the digit sum is, by 10 if it ends in 0.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(2, 100), p = isPrime(n), f = factorsOf(n)[1];
    return mc(r, p ? 'Prime' : 'Composite', [p ? 'Composite' : 'Prime'], { q: `Is ${n} prime or composite?`, steps: [p ? `The only factors of ${n} are 1 and ${n}.` : `${n} = ${f} × ${n / f}, so it has factors other than 1 and ${n}.`, `So ${n} is ${p ? 'prime' : 'composite'}.`] });
  }
  if (v === 1) {
    const P = [2, 3, 5, 7]; let fs; do { fs = Array.from({ length: r.int(3, 4) }, () => r.pick(P)).sort((a, b) => a - b); } while (fs.reduce((a, b) => a * b, 1) > 300);
    const n = fs.reduce((a, b) => a * b, 1), right = fs.join(' × ');
    const merged = [fs[0] * fs[1], ...fs.slice(2)].sort((a, b) => a - b).join(' × ');
    const changed = [...fs.slice(0, -1), fs.at(-1) === 7 ? 5 : 7].sort((a, b) => a - b).join(' × ');
    const dropped = fs.slice(1).join(' × ');
    let m = n; const tree = []; for (const p of fs) { tree.push(`${m} ÷ ${p} = ${m / p}`); m /= p; }
    return mc(r, right, [merged, changed, dropped], { q: `What is the prime factorization of ${n}?`, steps: [`Keep dividing by primes: ${tree.join(', ')}.`, `Every factor must be prime, and they must multiply to ${n}.`, `So ${n} = ${right}.`] });
  }
  const k = r.pick([2, 3, 5, 6, 9, 10]); const n = r.bool() ? k * r.int(20, 1100) : r.int(100, 9999);
  const ds = String(n).split('').map(Number), sum = ds.reduce((a, b) => a + b, 0), last = n % 10, yes = n % k === 0;
  const rule = { 2: `The last digit is ${last}, which is ${last % 2 ? 'odd' : 'even'}.`, 5: `The last digit is ${last}; it must be 0 or 5.`, 10: `The last digit is ${last}; it must be 0.`, 3: `The digit sum is ${ds.join(' + ')} = ${sum}, and ${sum} is ${sum % 3 ? 'not ' : ''}divisible by 3.`, 9: `The digit sum is ${ds.join(' + ')} = ${sum}, and ${sum} is ${sum % 9 ? 'not ' : ''}divisible by 9.`, 6: `It must pass the rules for 2 and 3: the last digit ${last} is ${last % 2 ? 'odd' : 'even'}, and the digit sum ${sum} is ${sum % 3 ? 'not ' : ''}divisible by 3.` }[k];
  if (v === 2) return yesNo(r, yes, { q: `Is ${comma(n)} divisible by ${k}?`, steps: [rule, `So ${comma(n)} is ${yes ? '' : 'not '}divisible by ${k}.`] });
  const thing = r.pick([['chairs', 'rows'], ['students', 'teams'], ['stickers', 'pages']]);
  return yesNo(r, yes, { q: `Can ${comma(n)} ${thing[0]} be split into ${thing[1]} of ${k} with none left over?`, steps: [`This asks whether ${comma(n)} is divisible by ${k}.`, rule, `So the answer is ${yes ? 'yes' : 'no'}.`] });
});
skill('5-nt-gcflcm', 5, 'Number theory', 'Greatest common factor and least common multiple', ['The greatest common factor (GCF) is the biggest number that divides both numbers.', 'The least common multiple (LCM) is the smallest number that both numbers divide into.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0 || v === 2) {
    const g = r.int(2, 12); let x = r.int(1, 9), y = r.int(2, 9); while (x === y || gcd(x, y) !== 1) { x = r.int(1, 9); y = r.int(2, 9); }
    const a = g * x, b = g * y;
    const q = v === 0 ? `What is the greatest common factor of ${a} and ${b}?` : `${r.pick(NAMES)} has ${a} apples and ${b} oranges. They go into identical bags with nothing left over. What is the greatest number of bags that can be made?`;
    return num(g, [`Factors of ${a}: ${factorsOf(a).join(', ')}.`, `Factors of ${b}: ${factorsOf(b).join(', ')}.`, `The greatest factor in both lists is ${g}.`, `So the answer is ${g}.`], { q, expr: `${g}` });
  }
  let a, b, L; do { a = r.int(2, 15); b = r.int(2, 15); L = lcm(a, b); } while (a === b || L / a > 10 || L / b > 10 || L === a || L === b);
  const q = v === 1 ? `What is the least common multiple of ${a} and ${b}?` : `Juice boxes come in packs of ${a} and straws come in packs of ${b}. What is the smallest number of juice boxes you can buy to have exactly the same number of straws?`;
  return num(L, [`Multiples of ${a}: ${multiplesOf(a, L / a).join(', ')}.`, `Multiples of ${b}: ${multiplesOf(b, L / b).join(', ')}.`, `The first number in both lists is ${L}.`, `So the answer is ${L}.`], { q, expr: `${L}` });
});

// ───────────── 7. Mixed operations: whole numbers ─────────────
skill('5-mixed-whole', 5, 'Mixed operations', 'Whole-number word problems', ['Read the story and decide which operation each part needs.', 'Solve one step at a time, then check the answer makes sense.'], (r) => {
  const v = r.int(0, 3), nm = r.pick(NAMES);
  if (v === 0) { const n = r.int(3, 12), k = r.int(12, 48), g = r.int(5, n * k - 5); return num(n * k - g, [`Stickers bought: ${n} × ${k} = ${n * k}.`, `Left after giving some away: ${n * k} − ${g} = ${n * k - g}.`, `So ${nm} has ${n * k - g} left.`], { q: `${nm} buys ${n} packs of ${k} stickers and gives ${g} away. How many stickers are left?`, expr: `${n}*${k}-${g}` }); }
  if (v === 1) { const p = r.int(3, 9), q = r.int(6, 25), e = r.int(2, 9); return num(q + e, [`Share equally: ${p * q} ÷ ${p} = ${q} each.`, `Then ${e} more each: ${q} + ${e} = ${q + e}.`, `So each group has ${q + e}.`], { q: `${p * q} markers are shared equally by ${p} groups. Then each group gets ${e} more. How many markers does each group have now?`, expr: `${p * q}/${p}+${e}` }); }
  if (v === 2) { const c = r.pick([2, 4, 5]), n = c * r.int(2, 9), k = r.int(12, 50), ans = n * k / c; return num(ans, [`Total pencils: ${n} × ${k} = ${n * k}.`, `Shared by ${c} classes: ${n * k} ÷ ${c} = ${ans}.`, `So each class gets ${ans} pencils.`], { q: `A school orders ${n} boxes of ${k} pencils and splits them equally among ${c} classes. How many pencils does each class get?`, expr: `${n}*${k}/${c}` }); }
  const w = r.int(15, 60), n = r.int(4, 12), s = r.int(10, w * n - 10);
  return num(w * n - s, [`Earned: $${w} × ${n} = $${w * n}.`, `After spending: $${w * n} − $${s} = $${w * n - s}.`, `So ${nm} has $${w * n - s} left.`], { q: `${nm} earns $${w} a week for ${n} weeks, then spends $${s}. How many dollars are left?`, expr: `${w}*${n}-${s}` });
});

// ───────────── 8. Numerical expressions ─────────────
skill('5-numexpr', 5, 'Expressions', 'Write and evaluate numerical expressions', ['Brackets show what to do first.', 'Without brackets: × and ÷ before + and −, then left to right.'], (r) => {
  const v = r.int(0, 4), a = r.int(2, 12), b = r.int(2, 12), c = r.int(2, 9);
  if (v === 0) {
    const k = r.int(0, 2), hi = Math.max(a, b) + c, lo = Math.min(a, b);
    const F = [[`Add ${a} and ${b}, then multiply by ${c}.`, `(${a} + ${b}) × ${c}`, [`${a} + ${b} × ${c}`, `${a} × ${c} + ${b}`, `${c} + ${a} × ${b}`]],
      [`Subtract ${lo} from ${hi}, then multiply by ${c}.`, `(${hi} − ${lo}) × ${c}`, [`${hi} − ${lo} × ${c}`, `(${lo} − ${hi}) × ${c}`, `${hi} × ${c} − ${lo}`]],
      [`Multiply ${a} by ${b}, then add ${c}.`, `${a} × ${b} + ${c}`, [`${a} × (${b} + ${c})`, `${a} + ${b} × ${c}`, `(${a} + ${c}) × ${b}`]]][k];
    return mc(r, F[1], F[2], { q: `Which expression matches? ${F[0]}`, steps: ['What is done first must be worked out first: use brackets if it would not come first anyway.', `So the expression is ${F[1]}.`] });
  }
  if (v === 1) {
    const d = r.int(1, c - 1), k = r.int(0, 2), hi = a + b;
    const [e, s1, s2] = [
      [`(${a} + ${b}) × ${c} − ${d}`, `Brackets: ${a} + ${b} = ${a + b}. Then ${a + b} × ${c} = ${(a + b) * c}.`, `Then subtract: ${(a + b) * c} − ${d} = ${(a + b) * c - d}.`],
      [`${a} + ${b} × (${c} − ${d})`, `Brackets: ${c} − ${d} = ${c - d}. Then ${b} × ${c - d} = ${b * (c - d)}.`, `Then add: ${a} + ${b * (c - d)} = ${a + b * (c - d)}.`],
      [`(${hi} − ${b}) × (${c} + ${d})`, `First bracket: ${hi} − ${b} = ${a}. Second bracket: ${c} + ${d} = ${c + d}.`, `Then multiply: ${a} × ${c + d} = ${a * (c + d)}.`],
    ][k];
    const ans = Function(`return ${js(e)}`)();
    return num(ans, ['Do the brackets first, then × and ÷, then + and −.', s1, s2, `So ${e} = ${ans}.`], { q: `${e} = ?`, expr: js(e) });
  }
  if (v === 2) {
    let x, y, op, res, tries = 0;
    do { y = r.int(2, 9); x = y * r.int(2, 9); op = r.pick(['+', '−', '×', '÷']); res = { '+': x + y, '−': x - y, '×': x * y, '÷': x / y }; tries++; } while (Object.values(res).filter((t) => t === res[op]).length > 1 && tries < 30);
    return mc(r, op, ['+', '−', '×', '÷'].filter((s) => s !== op), { q: `Which sign makes this true? ${x} ? ${y} = ${res[op]}`, steps: [`Try each sign: ${x} + ${y} = ${res['+']}, ${x} − ${y} = ${res['−']}, ${x} × ${y} = ${res['×']}, ${x} ÷ ${y} = ${res['÷']}.`, `Only ${op} gives ${res[op]}.`] });
  }
  if (v === 3) {
    const nm = r.pick(NAMES);
    return mc(r, 'Added before multiplying', ['Multiplied wrong', 'There is no mistake'], { q: `${nm} worked out ${a} + ${b} × ${c} like this: ${a} + ${b} = ${a + b}, then ${a + b} × ${c} = ${(a + b) * c}. What is the mistake?`, steps: [`Multiply before adding: ${b} × ${c} = ${b * c}.`, `Then ${a} + ${b * c} = ${a + b * c}, not ${(a + b) * c}.`, `${nm} added before multiplying.`] });
  }
  let ds; do { ds = [r.int(1, 9), r.int(1, 9), r.int(1, 9)]; } while (new Set(ds).size < 3);
  const opts = perms(ds).map(([p, q, s]) => ({ t: `${p}${q} ÷ ${s}`, v: (10 * p + q) / s }));
  const best = opts.reduce((m, o) => (o.v > m.v ? o : m)), wr = r.shuffle(opts.filter((o) => o.v < best.v)).slice(0, 3).map((o) => o.t);
  const [s] = [...ds].sort((x, y) => x - y);
  return mc(r, best.t, wr, { q: `Use the digits ${ds.join(', ')} once each to make a 2-digit number divided by a 1-digit number. Which gives the largest quotient?`, steps: ['To make a quotient big, divide a big number by a small number.', `Divide by the smallest digit, ${s}, and make the 2-digit number as big as possible.`, `So ${best.t} gives the largest quotient.`] });
});

// ───────────── 9. Multi-step word problems ─────────────
skill('5-multistep', 5, 'Word problems', 'Multi-step word problems', ['Find what the question asks, then plan the steps.', '"3 times as many" means multiply by 3.', 'Some stories have facts you do not need.'], (r) => {
  const v = r.int(0, 3), A = r.pick(NAMES); let B = r.pick(NAMES); while (B === A) B = r.pick(NAMES);
  if (v === 0) {
    const n = r.int(12, 60), k = r.int(2, 6), thing = r.pick(['stamps', 'stickers', 'marbles', 'cards']), more = r.bool();
    const ans = more ? n * k - n : n * k + n;
    return num(ans, [`${A} has ${k} × ${n} = ${n * k} ${thing}.`, more ? `${n * k} − ${n} = ${ans}.` : `Together: ${n * k} + ${n} = ${ans}.`, `So the answer is ${ans}.`], { q: `${A} has ${k} times as many ${thing} as ${B}. ${B} has ${n}. ${more ? `How many more ${thing} does ${A} have than ${B}?` : 'How many do they have altogether?'}`, expr: more ? `${n}*${k}-${n}` : `${n}*${k}+${n}` });
  }
  if (v === 1) {
    const pa = r.int(8, 15), pc = r.int(4, 9), na = r.int(1, 3), nc = r.int(1, 4), tot = pa * na + pc * nc, pay = tot <= 50 ? 50 : 100;
    return num(pay - tot, [`Adults: ${na} × $${pa} = $${pa * na}. Children: ${nc} × $${pc} = $${pc * nc}.`, `Total: $${pa * na} + $${pc * nc} = $${tot}.`, `Change: $${pay} − $${tot} = $${pay - tot}.`], { q: `Adult tickets cost $${pa} and child tickets cost $${pc}. ${A} buys ${na} adult and ${nc} child tickets and pays with a $${pay} bill. How many dollars of change does ${A} get?`, expr: `${pay}-(${pa}*${na}+${pc}*${nc})` });
  }
  if (v === 2) {
    const s = r.int(40, 60), p = r.int(5, 15), q = r.int(5, 15), age = r.int(30, 60), days = q % 7 + 3;
    return r.bool()
      ? mc(r, "The driver's age", ['The number of seats', 'How many got on at the first stop', 'How many got on at the second stop'], { q: `A bus has ${s} seats. ${p} people get on at the first stop and ${q} at the second stop. The driver is ${age} years old. How many seats are empty now? Which fact is NOT needed?`, steps: [`Empty seats: ${s} − ${p} − ${q} = ${s - p - q}.`, "The driver's age is not used."] })
      : mc(r, 'How long the trip took', ['How many pages each day', 'How many days', 'How many pages the book has'], { q: `${A} reads ${p} pages a day for ${days} days on a trip that took ${q} hours. The book has ${s * 5} pages. How many pages are left to read? Which fact is NOT needed?`, steps: [`Pages left: ${s * 5} − ${p} × ${days} = ${s * 5 - p * days}.`, 'How long the trip took is not used.'] });
  }
  if (r.bool()) {
    const x = r.int(20, 80), y = r.int(5, x - 3);
    return num(x, [`Guess and check: try pairs that add up to ${x + y}.`, `${x} + ${y} = ${x + y} and ${x} − ${y} = ${x - y}. Both work.`, `So the larger number is ${x}.`], { q: `Two numbers add up to ${x + y}. Their difference is ${x - y}. What is the larger number?`, expr: `(${x + y}+${x - y})/2` });
  }
  const n = r.int(6, 12), m = r.int(1, n - 1), tot = 2 * (n - m) + 3 * m;
  return num(m, [`Guess and check: if all ${n} were pens, the cost would be $${2 * n}. Each marker adds $1 more.`, `$${tot} − $${2 * n} = $${m}, so there are ${m} markers. Check: ${n - m} × $2 + ${m} × $3 = $${tot}.`, `So ${A} bought ${m} markers.`], { q: `Pens cost $2 and markers cost $3. ${A} buys ${n} items and spends $${tot}. How many markers did ${A} buy?`, expr: `${tot}-2*${n}` });
});


// ───────────── 10. Fractions and mixed numbers ─────────────
const coprime = (r, lo, hi) => { let d, n; do { d = r.int(lo, hi); n = r.int(1, d - 1); } while (gcd(n, d) !== 1); return [n, d]; };
skill('5-frac-identify', 5, 'Fractions', 'Fractions of a whole and of a group', ['The denominator (bottom) is how many equal parts there are in all.', 'The numerator (top) is how many parts we are talking about.'], (r) => {
  const v = r.int(0, 3), d = r.int(2, 12), n = r.int(1, d - 1);
  if (v === 0) return num(`${n}/${d}`, [`The bar has ${d} equal parts.`, `${n} of them are shaded, so the fraction is ${n}/${d}.`], { q: 'What fraction of the bar is shaded?', visual: { type: 'fraction', n, d }, expr: `${n}/${d}` });
  if (v === 1) {
    const t = r.int(6, 20), p = r.int(1, t - 1), [thing, col] = r.pick([['marbles', 'blue'], ['crayons', 'red'], ['apples', 'green'], ['beads', 'yellow']]);
    return num(`${p}/${t}`, [`There are ${t} ${thing} in all: that is the denominator.`, `${p} are ${col}, so the fraction is ${p}/${t}.`], { q: `A bag has ${t} ${thing}. ${p} of them are ${col}. What fraction of the ${thing} are ${col}?`, expr: `${p}/${t}` });
  }
  if (v === 2) {
    const D = r.pick([4, 6, 8, 10, 12]), e = r.int(1, D - 1), nm = r.pick(NAMES);
    return num(`${D - e}/${D}`, [`The pizza has ${D} equal slices. ${nm} eats ${e}.`, `${D} − ${e} = ${D - e} slices are left, so ${D - e}/${D} of the pizza is left.`], { q: `A pizza is cut into ${D} equal slices. ${nm} eats ${e}. What fraction of the pizza is left?`, expr: `${D - e}/${D}` });
  }
  return num(`${n}/${d}`, [`Each part is 1/${d} of the way from 0 to 1.`, `${n} parts from 0 is ${n}/${d}.`], { q: `On a number line, the space from 0 to 1 is split into ${d} equal parts. A point is ${n} marks to the right of 0. What fraction is at the point?`, expr: `${n}/${d}` });
});
skill('5-frac-mixed', 5, 'Fractions', 'Mixed numbers and fractions as division', ['A fraction is a division: 3/4 means 3 ÷ 4.', 'A mixed number is a whole number and a fraction: 2 3/4.', 'To round a mixed number, check whether the fraction is at least 1/2.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const b = r.int(2, 9); let a = r.int(1, 12); if (a % b === 0) a++;
    const ans = frac(a, b);
    return num(ans, [`Sharing ${a} among ${b} is ${a} ÷ ${b}.`, `${a} ÷ ${b} = ${a}/${b}${ans !== `${a}/${b}` ? ` = ${ans}` : ''}${a > b ? `, which is ${mixed(a, b)}` : ''}.`, `So each friend gets ${ans}.`], { q: `${b} friends share ${a} pizzas equally. How much pizza does each friend get? (Write a fraction.)`, expr: `${a}/${b}` });
  }
  const w = r.int(1, 9); let [n, d] = coprime(r, 3, 12); while (2 * n === d) [n, d] = coprime(r, 3, 12);
  if (v === 1) { const up = 2 * n > d, ans = up ? w + 1 : w; return num(ans, [`Look at the fraction: ${n}/${d} is ${up ? 'more' : 'less'} than 1/2 (half of ${d} is ${d / 2}).`, up ? `So round up to ${ans}.` : `So round down to ${ans}.`, `${w} ${n}/${d} rounds to ${ans}.`], { q: `Round ${w} ${n}/${d} to the nearest whole number.`, expr: String(ans) }); }
  if (v === 2) return num(`${w} ${n}/${d}`, [`${w} whole pies is the whole-number part: ${w}.`, `The extra ${n}/${d} is the fraction part, so it is ${w} ${n}/${d}.`], { q: `There are ${w} whole pies and ${n}/${d} of another pie. Write this as a mixed number.`, expr: `${w}+${n}/${d}` });
  const N = w * d + n;
  return num(`${w} ${n}/${d}`, [`${N} ÷ ${d} = ${w} R ${n}.`, `The remainder ${n} is ${n}/${d} of a whole, so ${N} ÷ ${d} = ${w} ${n}/${d}.`], { q: `Write ${N} ÷ ${d} as a mixed number.`, expr: `${N}/${d}` });
});

// ───────────── 11. Equivalent fractions ─────────────
skill('5-frac-equiv', 5, 'Equivalent fractions', 'Equivalent fractions and lowest terms', ['Multiply or divide the top and bottom by the same number to get an equal fraction.', 'A fraction is in lowest terms when the top and bottom share no factor except 1.'], (r) => {
  const v = r.int(0, 3), [a, b] = coprime(r, 2, 10), k = r.int(2, 6), bars = b * k <= 24 ? fractionBars([{ n: a, d: b }, { n: a * k, d: b * k }]) : null;
  if (v === 0) return num(a * k, [St(`${b} × ${k} = ${b * k}, so multiply the top by ${k} too.`, bars), St(`${a} × ${k} = ${a * k}.`), St(`So ${a}/${b} = ${a * k}/${b * k}. The missing number is ${a * k}.`)], { q: `${a}/${b} = ?/${b * k}`, expr: `${a}*${k}` });
  if (v === 1) return num(b * k, [St(`${a} × ${k} = ${a * k}, so multiply the bottom by ${k} too.`, bars), St(`${b} × ${k} = ${b * k}.`), St(`So ${a}/${b} = ${a * k}/${b * k}. The missing number is ${b * k}.`)], { q: `${a}/${b} = ${a * k}/?`, expr: `${b}*${k}` });
  if (v === 2) return num(`${a}/${b}`, [`The greatest common factor of ${a * k} and ${b * k} is ${k}.`, `Divide the top and bottom by ${k}: ${a * k} ÷ ${k} = ${a} and ${b * k} ÷ ${k} = ${b}.`, `So ${a * k}/${b * k} in lowest terms is ${a}/${b}.`], { q: `Write ${a * k}/${b * k} in lowest terms.`, exactForm: 'fraction', expr: `${a}/${b}` });
  return num(4 * b, [`Each fraction is ${a}/${b} with the top and bottom multiplied by 1, 2, 3, …`, `The next one multiplies by 4: ${4 * a}/${4 * b}.`, `So the denominator is ${4 * b}.`], { q: `These fractions are all equal: ${a}/${b}, ${2 * a}/${2 * b}, ${3 * a}/${3 * b}, … What is the denominator of the next fraction in the pattern?`, expr: `4*${b}` });
});
skill('5-frac-improper', 5, 'Equivalent fractions', 'Improper fractions, mixed numbers and common denominators', ['An improper fraction has a top bigger than its bottom: 11/4 = 2 3/4.', 'To find a common denominator, find the least common multiple of the denominators.'], (r) => {
  const v = r.int(0, 2), [n, d] = coprime(r, 2, 12), w = r.int(1, 9), N = w * d + n;
  if (v === 0) return { kind: 'text', answer: `${w} ${n}/${d}`, accept: [`${w} and ${n}/${d}`], q: `Write ${N}/${d} as a mixed number.`, steps: [`How many whole ${d}s fit in ${N}? ${N} ÷ ${d} = ${w} R ${n}.`, `${w} wholes and ${n}/${d} left over.`, `So ${N}/${d} = ${w} ${n}/${d}.`] };
  if (v === 1) return { kind: 'text', answer: `${N}/${d}`, accept: [], q: `Write ${w} ${n}/${d} as an improper fraction.`, steps: [`Each whole is ${d}/${d}, so ${w} wholes are ${w} × ${d} = ${w * d} parts.`, `Add the ${n} extra parts: ${w * d} + ${n} = ${N}.`, `So ${w} ${n}/${d} = ${N}/${d}.`] };
  let b = r.int(2, 12), e = r.int(2, 12); while (b === e) e = r.int(2, 12);
  const L = lcm(b, e), x = r.int(1, b - 1), y = r.int(1, e - 1);
  return num(L, [`List multiples of ${Math.max(b, e)}: ${multiplesOf(Math.max(b, e), L / Math.max(b, e)).join(', ')}.`, `The first one that ${Math.min(b, e)} also divides is ${L}.`, `So the least common denominator is ${L}.`], { q: `What is the least common denominator of ${x}/${b} and ${y}/${e}?`, expr: `${L}` });
});

// ───────────── 12. Compare and order fractions ─────────────
skill('5-frac-compare', 5, 'Compare fractions', 'Compare fractions', ['With the same denominator, the bigger numerator is bigger.', 'Otherwise rename both with a common denominator, or compare each with 1/2.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [a, b] = coprime(r, 2, 12); let [c, d] = coprime(r, 2, 12); while (d === b) [c, d] = coprime(r, 2, 12);
    const L = lcm(b, d), A = a * L / b, C = c * L / d, s = cmp(A, C);
    return signMC(r, A, C, { q: `Which sign makes this true? ${a}/${b} ? ${c}/${d}`, steps: [`Use a common denominator, ${L}: ${a}/${b} = ${A}/${L} and ${c}/${d} = ${C}/${L}.`, `Compare the numerators: ${A} and ${C}.`, `So ${a}/${b} ${s} ${c}/${d}.`] });
  }
  if (v === 1) {
    let n, d; do { d = r.int(3, 12); n = r.int(0, d); } while (4 * n === d || 4 * n === 3 * d);
    const right = 4 * n < d ? '0' : 4 * n > 3 * d ? '1' : '1/2';
    return mc(r, right, ['0', '1/2', '1'].filter((x) => x !== right), { q: `Is ${n}/${d} closest to 0, 1/2 or 1?`, steps: [`0 = 0/${d}, 1/2 = ${d / 2}/${d} and 1 = ${d}/${d}.`, `${n}/${d} is closest to ${right}.`] });
  }
  if (v === 2) {
    let a, b, c, d; do { b = r.int(3, 12); a = r.int(1, b - 1); } while (2 * a >= b);
    do { d = r.int(3, 12); c = r.int(1, d - 1); } while (2 * c <= d);
    const swap = r.bool(), [L, R] = swap ? [`${c}/${d}`, `${a}/${b}`] : [`${a}/${b}`, `${c}/${d}`], s = swap ? '>' : '<';
    return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `Use 1/2 to compare: ${L} ? ${R}`, steps: [`${a}/${b} is less than 1/2, because ${a} is less than half of ${b}.`, `${c}/${d} is more than 1/2, because ${c} is more than half of ${d}.`, `So ${L} ${s} ${R}.`] });
  }
  const w1 = r.int(1, 5), w2 = r.bool() ? w1 : r.int(1, 5), [n1, d1] = coprime(r, 2, 10), [n2, d2] = coprime(r, 2, 10);
  const x = (w1 * d1 + n1) * d2, y = (w2 * d2 + n2) * d1, s = cmp(x, y), M1 = `${w1} ${n1}/${d1}`, M2 = `${w2} ${n2}/${d2}`;
  return signMC(r, x, y, { q: `Which sign makes this true? ${M1} ? ${M2}`, steps: [w1 !== w2 ? `Compare the whole numbers first: ${w1} and ${w2}.` : `The whole numbers are the same, so compare ${n1}/${d1} and ${n2}/${d2}: with denominator ${d1 * d2} they are ${n1 * d2}/${d1 * d2} and ${n2 * d1}/${d1 * d2}.`, `So ${M1} ${s} ${M2}.`] });
});
skill('5-frac-order', 5, 'Compare fractions', 'Order fractions', ['Same denominator: order by the numerators.', 'Same numerator: the bigger the denominator, the smaller the parts.', 'Different both: rename with a common denominator.'], (r) => {
  const v = r.int(0, 2), asc = r.bool(), lab = new Map(); let fr = [];
  if (v === 0) { const d = r.int(5, 12), ns = new Set(); while (ns.size < 3) ns.add(r.int(1, d - 1)); fr = [...ns].map((n) => [n, d]); }
  else if (v === 1) { const n = r.int(1, 5), ds = new Set(); while (ds.size < 3) ds.add(r.int(n + 1, 12)); fr = [...ds].map((d) => [n, d]); }
  else { const seen = new Set(); while (fr.length < 3) { const [n, d] = coprime(r, 2, 10), key = n / d; if (!seen.has(key)) { seen.add(key); fr.push([n, d]); } } }
  fr.forEach(([n, d]) => lab.set(n / d, `${n}/${d}`));
  const L = fr.reduce((m, [, d]) => lcm(m, d), 1);
  const hint = v === 0 ? 'The denominators are the same, so compare the numerators.' : v === 1 ? 'The numerators are the same, so the fraction with the bigger denominator is smaller.' : `Rename with denominator ${L}: ${fr.map(([n, d]) => `${n}/${d} = ${n * L / d}/${L}`).join(', ')}.`;
  return orderMC(r, fr.map(([n, d]) => n / d), (x) => lab.get(x), asc, { steps: [hint] });
});

// ───────────── 13. Understand fraction addition and subtraction ─────────────
skill('5-frac-models', 5, 'Understand fraction addition', 'Add and subtract fractions with models', ['When the parts are the same size, just count the parts.', 'Adding joins shaded parts. Subtracting takes parts away.'], (r) => {
  const v = r.int(0, 2), d = r.int(3, 12), a = r.int(1, d - 1), b = r.int(1, d - 1);
  if (v === 0) {
    const x = Math.min(a, d - 1), y = r.int(1, d - x);
    return num(`${x + y}/${d}`, [St(`Each strip has ${d} equal parts.`, fractionBars([{ n: x, d }, { n: y, d }])), St(`Join the shaded parts: ${x} + ${y} = ${x + y} parts.`, fractionBars([{ n: x + y, d }])), St(`So ${x}/${d} + ${y}/${d} = ${x + y}/${d}.`)], { q: `Use the fraction strips: ${x}/${d} + ${y}/${d} = ?`, visual: fractionBars([{ n: x, d }, { n: y, d }]), expr: `${x}/${d}+${y}/${d}` });
  }
  let hi = Math.max(a, b), lo = Math.min(a, b); if (hi === lo) { if (hi > 1) lo = hi - 1; else hi = 2; }
  if (v === 1) return num(`${hi - lo}/${d}`, [St(`Start with ${hi} shaded parts out of ${d}.`, fractionBars([{ n: hi, d }])), St(`Take away ${lo} parts: ${hi} − ${lo} = ${hi - lo}.`, fractionBars([{ n: hi - lo, d }])), St(`So ${hi}/${d} − ${lo}/${d} = ${hi - lo}/${d}.`)], { q: `Use the fraction strip: ${hi}/${d} − ${lo}/${d} = ?`, visual: fractionBars([{ n: hi, d }]), expr: `${hi}/${d}-${lo}/${d}` });
  const start = r.int(1, d - 1), right = start === 1 || r.bool(), jump = right ? r.int(1, d - start) : r.int(1, start - 1), end = right ? start + jump : start - jump;
  return num(`${end}/${d}`, [`Each jump of one part is 1/${d}.`, `Start at ${start}/${d} and jump ${jump} part${jump > 1 ? 's' : ''} to the ${right ? 'right' : 'left'}: ${start} ${right ? '+' : '−'} ${jump} = ${end}.`, `So you land on ${end}/${d}.`], { q: `A number line from 0 to 1 is split into ${d} equal parts. Start at ${start}/${d} and jump ${jump}/${d} to the ${right ? 'right' : 'left'}. Where do you land?`, expr: `${end}/${d}` });
});
skill('5-frac-decompose', 5, 'Understand fraction addition', 'Break fractions apart', ['A fraction can be split into a sum of smaller fractions with the same denominator.', '5/8 = 1/8 + 1/8 + 3/8 = 2/8 + 3/8.'], (r) => {
  const d = r.int(4, 12), n = r.int(3, d), v = r.int(0, 1);
  if (v === 0) {
    const p1 = r.int(1, n - 2), p2 = r.int(1, n - p1 - 1), p3 = n - p1 - p2, sum = (ps) => ps.map((p) => `${p}/${d}`).join(' + ');
    const right = sum([p1, p2, p3]);
    return mc(r, right, [sum([p1, p2, p3 + 1]), sum([p1 + 1, p2 + 1]), p3 > 1 ? sum([p1, p2, p3 - 1]) : sum([p1 + 2, p2])], { q: `Which is a way to break apart ${n}/${d}?`, steps: [`The numerators must add up to ${n}.`, `${p1} + ${p2} + ${p3} = ${n}, so ${n}/${d} = ${right}.`] });
  }
  const a = r.int(1, n - 1);
  return num(n - a, [`The denominators are all ${d}, so the numerators must add up: ${a} + ? = ${n}.`, `${n} − ${a} = ${n - a}.`, `So ${a}/${d} + ${n - a}/${d} = ${n}/${d}. The missing number is ${n - a}.`], { q: `${a}/${d} + ?/${d} = ${n}/${d}`, expr: `${n}-${a}` });
});

// ───────────── 14. Add and subtract fractions with like denominators ─────────────
const likeAns = (top, d) => frac(top, d);
skill('5-frac-like', 5, 'Fractions: like denominators', 'Add and subtract like fractions', ['When the denominators are the same, add or subtract the numerators.', 'Keep the denominator, then simplify if you can.'], (r) => {
  const v = r.int(0, 4), d = r.int(3, 12), a = r.int(1, d - 1), b = r.int(1, d - 1), nm = r.pick(NAMES);
  const simp = (top) => (frac(top, d) !== `${top}/${d}` ? `${top}/${d} = ${frac(top, d)}` : `${top}/${d}`);
  if (v === 0) return num(likeAns(a + b, d), [`Same denominators, so add the numerators: ${a} + ${b} = ${a + b}.`, `${simp(a + b)}.`, `So the answer is ${likeAns(a + b, d)}.`], { q: `${a}/${d} + ${b}/${d} = ?`, expr: `${a}/${d}+${b}/${d}` });
  const hi = Math.max(a, b) === Math.min(a, b) ? Math.min(a + 1, d) : Math.max(a, b), lo = Math.min(a, b);
  if (v === 1) return num(likeAns(hi - lo, d), [`Same denominators, so subtract the numerators: ${hi} − ${lo} = ${hi - lo}.`, `${simp(hi - lo)}.`, `So the answer is ${likeAns(hi - lo, d)}.`], { q: `${hi}/${d} − ${lo}/${d} = ?`, expr: `${hi}/${d}-${lo}/${d}` });
  if (v === 2) { const c = r.int(1, d - 1); return num(likeAns(a + b + c, d), [`Add all the numerators: ${a} + ${b} + ${c} = ${a + b + c}.`, `${simp(a + b + c)}.`, `So the answer is ${likeAns(a + b + c, d)}.`], { q: `${a}/${d} + ${b}/${d} + ${c}/${d} = ?`, expr: `${a}/${d}+${b}/${d}+${c}/${d}` }); }
  if (v === 3) return r.bool()
    ? num(likeAns(a + b, d), [`Add the two distances: ${a}/${d} + ${b}/${d}.`, `${a} + ${b} = ${a + b}, so ${simp(a + b)}.`, `So ${nm} ran ${likeAns(a + b, d)} km.`], { q: `${nm} ran ${a}/${d} km on Monday and ${b}/${d} km on Tuesday. How far did ${nm} run in all, in kilometres?`, expr: `${a}/${d}+${b}/${d}` })
    : num(likeAns(hi - lo, d), [`Subtract what was poured out: ${hi}/${d} − ${lo}/${d}.`, `${hi} − ${lo} = ${hi - lo}, so ${simp(hi - lo)}.`, `So ${likeAns(hi - lo, d)} L is left.`], { q: `A jug had ${hi}/${d} L of juice. ${nm} poured out ${lo}/${d} L. How much juice is left, in litres?`, expr: `${hi}/${d}-${lo}/${d}` });
  const c = r.int(1, 2 * d - 2);
  return signMC(r, a + b, c, { q: `Which sign makes this true? ${a}/${d} + ${b}/${d} ? ${c}/${d}`, steps: [`${a}/${d} + ${b}/${d} = ${a + b}/${d}.`, `Compare ${a + b}/${d} with ${c}/${d}: ${a + b} ${cmp(a + b, c)} ${c}.`, `So ${a}/${d} + ${b}/${d} ${cmp(a + b, c)} ${c}/${d}.`] });
});
skill('5-frac-likemixed', 5, 'Fractions: like denominators', 'Add and subtract mixed numbers', ['Add or subtract the whole numbers, then the fractions.', 'If the fraction part is 1 or more, make another whole. If you cannot take away, regroup one whole.'], (r) => {
  const v = r.int(0, 3), d = r.int(3, 10), w1 = r.int(2, 6), w2 = r.int(1, 5), n1 = r.int(1, d - 1), n2 = r.int(1, d - 1), nm = r.pick(NAMES);
  const N1 = w1 * d + n1, N2 = w2 * d + n2;
  if (v === 0 || v === 3) {
    const ans = mixed(N1 + N2, d);
    const steps = [`Add the whole numbers: ${w1} + ${w2} = ${w1 + w2}. Add the fractions: ${n1}/${d} + ${n2}/${d} = ${n1 + n2}/${d}.`, n1 + n2 >= d ? `${n1 + n2}/${d} is ${mixed(n1 + n2, d)}, so carry the whole: ${w1 + w2} + ${mixed(n1 + n2, d)} = ${ans}.` : `Put them together: ${ans}.`, `So the answer is ${ans}.`];
    const q = v === 0 ? `${w1} ${n1}/${d} + ${w2} ${n2}/${d} = ?` : `${nm} walked ${w1} ${n1}/${d} km in the morning and ${w2} ${n2}/${d} km in the afternoon. How far did ${nm} walk in all, in kilometres?`;
    return num(ans, steps, { q, expr: `${N1 + N2}/${d}` });
  }
  if (v === 1) {
    const big = N1 > N2 ? [w1, n1, N1] : [w2, n2, N2], sml = N1 > N2 ? [w2, n2, N2] : [w1, n1, N1];
    if (big[2] === sml[2]) big[2] += d, big[0] += 1;
    const ans = mixed(big[2] - sml[2], d), regroup = big[1] < sml[1];
    return num(ans, [regroup ? `${big[1]}/${d} is less than ${sml[1]}/${d}, so regroup: ${big[0]} ${big[1]}/${d} = ${big[0] - 1} ${big[1] + d}/${d}.` : `Subtract the whole numbers and the fractions separately.`, regroup ? `${big[0] - 1} − ${sml[0]} = ${big[0] - 1 - sml[0]} and ${big[1] + d}/${d} − ${sml[1]}/${d} = ${big[1] + d - sml[1]}/${d}.` : `${big[0]} − ${sml[0]} = ${big[0] - sml[0]} and ${big[1]}/${d} − ${sml[1]}/${d} = ${big[1] - sml[1]}/${d}.`, `So the answer is ${ans}.`], { q: `${big[0]} ${big[1]}/${d} − ${sml[0]} ${sml[1]}/${d} = ?`, expr: `${big[2] - sml[2]}/${d}` });
  }
  let m1 = n1, m2 = n2; if (2 * m1 === d) m1 = 1; if (2 * m2 === d) m2 = d - 1;
  const r1 = 2 * m1 > d ? w1 + 1 : w1, r2 = 2 * m2 > d ? w2 + 1 : w2;
  return num(r1 + r2, [`${w1} ${m1}/${d} rounds to ${r1} and ${w2} ${m2}/${d} rounds to ${r2}.`, `${r1} + ${r2} = ${r1 + r2}.`, `So the sum is about ${r1 + r2}.`], { q: `Estimate ${w1} ${m1}/${d} + ${w2} ${m2}/${d} by rounding each mixed number to the nearest whole number.`, expr: `${r1}+${r2}` });
});

// ───────────── 15. Add and subtract fractions with unlike denominators ─────────────
const unlikeSteps = (a, b, c, d, op) => {
  const L = lcm(b, d), A = a * L / b, C = c * L / d, top = op === '+' ? A + C : A - C, ans = frac(top, L);
  return { ans, L, steps: [St(`The denominators ${b} and ${d} are different. The least common denominator is ${L}.`), St(`${a}/${b} = ${A}/${L} and ${c}/${d} = ${C}/${L}.`, L <= 24 && A <= L && C <= L ? fractionBars([{ n: A, d: L }, { n: C, d: L }]) : null), St(`${A} ${op === '+' ? '+' : '−'} ${C} = ${top}, so the result is ${top}/${L}${ans !== `${top}/${L}` ? ` = ${ans}` : ''}.`), St(`So the answer is ${ans}.`)] };
};
const twoFr = (r, max = 10) => { let a, b, c, d; do { [a, b] = coprime(r, 2, max); [c, d] = coprime(r, 2, max); } while (b === d); return [a, b, c, d]; };
skill('5-frac-tenths', 5, 'Fractions: unlike denominators', 'Tenths and hundredths', ['Change tenths to hundredths: 3/10 = 30/100.', 'Then add or subtract the hundredths.'], (r) => {
  const v = r.int(0, 3), a = r.int(1, 9), b = r.int(1, 99);
  if (v === 0) { const ans = frac(10 * a + b, 100); return num(ans, [`Change ${a}/10 to hundredths: ${a}/10 = ${10 * a}/100.`, `${10 * a}/100 + ${b}/100 = ${10 * a + b}/100.`, `So the answer is ${ans}.`], { q: `${a}/10 + ${b}/100 = ?`, expr: `${a}/10+${b}/100` }); }
  if (v === 1) {
    const c = r.int(1, 5), e = r.int(1, 40), b2 = r.int(1, 40), tot = 10 * a + b2 + 10 * c + e, ans = frac(tot, 100);
    return num(ans, [`Change the tenths to hundredths: ${a}/10 = ${10 * a}/100 and ${c}/10 = ${10 * c}/100.`, `${10 * a} + ${b2} + ${10 * c} + ${e} = ${tot}, so the sum is ${tot}/100.`, `So the answer is ${ans}.`], { q: `${a}/10 + ${b2}/100 + ${c}/10 + ${e}/100 = ?`, expr: `${a}/10+${b2}/100+${c}/10+${e}/100` });
  }
  if (v === 2) { const bb = r.int(1, 10 * a - 1), ans = frac(10 * a - bb, 100); return num(ans, [`Change ${a}/10 to hundredths: ${10 * a}/100.`, `${10 * a}/100 − ${bb}/100 = ${10 * a - bb}/100.`, `So the answer is ${ans}.`], { q: `${a}/10 − ${bb}/100 = ?`, expr: `${a}/10-${bb}/100` }); }
  const bb = r.int(11, 89), x = 10 * a + bb;
  const bad = [`${a}/100 + ${bb}/10`, `${a + 1}/10 + ${bb}/100`, `${a}/10 + ${bb + 10}/100`].filter((s) => s !== `${a}/10 + ${bb}/100`);
  return mc(r, `${a}/10 + ${bb}/100`, bad, { q: `Which sum is equal to ${x}/100?`, steps: [`Change tenths to hundredths: ${a}/10 = ${10 * a}/100.`, `${10 * a}/100 + ${bb}/100 = ${x}/100.`] });
});
skill('5-frac-unlike2', 5, 'Fractions: unlike denominators', 'Subtract and solve with unlike fractions', ['Rename the fractions with a common denominator first.', 'For mixed numbers, add the whole numbers and the fractions separately.'], (r) => {
  const v = r.int(0, 4), nm = r.pick(NAMES);
  if (v === 0) { let [a, b, c, d] = twoFr(r); if (a / b < c / d) [a, b, c, d] = [c, d, a, b]; const U = unlikeSteps(a, b, c, d, '−'); return num(U.ans, U.steps, { q: `${a}/${b} − ${c}/${d} = ?`, expr: `${a}/${b}-${c}/${d}` }); }
  if (v === 1) {
    let a, b, c, d; do { [a, b, c, d] = twoFr(r); } while (a / b + c / d > 1);
    const add = r.bool(); if (!add && a / b < c / d) [a, b, c, d] = [c, d, a, b];
    const U = unlikeSteps(a, b, c, d, add ? '+' : '−');
    return num(U.ans, U.steps, { q: add ? `${nm} painted ${a}/${b} of a fence on Saturday and ${c}/${d} of it on Sunday. What fraction of the fence has been painted?` : `A bottle had ${a}/${b} L of water. ${nm} drank ${c}/${d} L. How much water is left, in litres?`, expr: `${a}/${b}${add ? '+' : '-'}${c}/${d}` });
  }
  if (v === 2) {
    const [a, b, c, d] = twoFr(r, 8), w1 = r.int(1, 5), w2 = r.int(1, 5), L = lcm(b, d), top = a * L / b + c * L / d, ans = mixed((w1 + w2) * L + top, L);
    return num(ans, [`Add the whole numbers: ${w1} + ${w2} = ${w1 + w2}.`, `Add the fractions with denominator ${L}: ${a * L / b}/${L} + ${c * L / d}/${L} = ${top}/${L}.`, `${w1 + w2} + ${top}/${L} = ${ans}.`, `So the answer is ${ans}.`], { q: `${w1} ${a}/${b} + ${w2} ${c}/${d} = ?`, expr: `${w1}+${a}/${b}+${w2}+${c}/${d}` });
  }
  if (v === 3) {
    const set = r.pick([[2, 4, 8], [2, 3, 6], [2, 5, 10], [3, 4, 12], [2, 3, 12]]), ps = set.map((d) => [r.int(1, d - 1), d]), L = set.reduce((m, d) => lcm(m, d), 1);
    const tops = ps.map(([n, d]) => n * L / d), tot = tops.reduce((s, x) => s + x, 0), ans = frac(tot, L), e = ps.map(([n, d]) => `${n}/${d}`).join(' + ');
    return num(ans, [`The least common denominator is ${L}.`, `Rename: ${tops.map((t) => `${t}/${L}`).join(' + ')} = ${tot}/${L}.`, `So the answer is ${ans}.`], { q: `${e} = ?`, expr: js(e.replace(/ /g, '')) });
  }
  const [a, b, c, d] = twoFr(r), L = lcm(b, d), top = a * L / b + c * L / d;
  return signMC(r, top, L, { q: `Which sign makes this true? ${a}/${b} + ${c}/${d} ? 1`, steps: [`${a}/${b} + ${c}/${d} = ${a * L / b}/${L} + ${c * L / d}/${L} = ${top}/${L}.`, `1 = ${L}/${L}. Compare ${top} and ${L}.`, `So ${a}/${b} + ${c}/${d} ${cmp(top, L)} 1.`] });
});

// ───────────── 16. Multiply unit fractions and whole numbers ─────────────
skill('5-frac-unitmul', 5, 'Multiply unit fractions', 'Multiply unit fractions by whole numbers', ['A unit fraction has 1 on top, like 1/5.', '4 × 1/5 means 4 copies of 1/5, which is 4/5.'], (r) => {
  const v = r.int(0, 3), d = r.int(2, 12); let n = r.int(2, 12); if (n === d) n++;
  const ans = frac(n, d), raw = `${n}/${d}`;
  if (v === 0) return num(ans, [St(`${n} × 1/${d} means ${n} copies of 1/${d}.`, n <= d ? fractionBars([{ n, d }]) : null), St(`That is ${raw}${ans !== raw ? ` = ${ans}` : ''}.`), St(`So the answer is ${ans}.`)], { q: `${n} × 1/${d} = ?`, expr: `${n}*1/${d}` });
  if (v === 1) return num(n, [`${raw} is ${n} copies of 1/${d}.`, `So ? × 1/${d} = ${raw} when ? is ${n}.`, `The missing number is ${n}.`], { q: `? × 1/${d} = ${raw}`, expr: String(n) });
  if (v === 2) return num(ans, [`Each glass is 1/${d} L, and there are ${n} glasses: ${n} × 1/${d}.`, `${n} × 1/${d} = ${raw}${ans !== raw ? ` = ${ans}` : ''}.`, `So there are ${ans} L of milk.`], { q: `Each glass holds 1/${d} L of milk. How much milk is in ${n} glasses, in litres?`, expr: `${n}/${d}` });
  return mc(r, raw, [`1/${n * d}`, `${d}/${n}`, `${n + 1}/${d}`], { q: `Which is equal to ${n} × 1/${d}?`, steps: [`${n} × 1/${d} is ${n} copies of 1/${d}.`, `So it equals ${raw}.`] });
});

// ───────────── 17. Multiply fractions and whole numbers ─────────────
skill('5-frac-wholemul', 5, 'Multiply fractions', 'Multiply fractions by whole numbers', ['Multiply the whole number by the numerator. Keep the denominator.', '3 × 2/5 = 6/5 = 1 1/5.'], (r) => {
  const v = r.int(0, 3), [a, b] = coprime(r, 2, 10), n = r.int(2, 9), ans = frac(n * a, b), raw = `${n * a}/${b}`;
  const show = `${raw}${ans !== raw ? ` = ${ans}` : ''}`;
  if (v === 0) return num(ans, [`Multiply the whole number by the numerator: ${n} × ${a} = ${n * a}.`, `Keep the denominator: ${show}.`, `So the answer is ${ans}.`], { q: `${n} × ${a}/${b} = ?`, expr: `${n}*${a}/${b}` });
  if (v === 1) return num(ans, [`${n} batches of ${a}/${b} kg: ${n} × ${a}/${b}.`, `${n} × ${a} = ${n * a}, so ${show}.`, `So ${ans} kg of rice is needed.`], { q: `A recipe uses ${a}/${b} kg of rice. How much rice is needed for ${n} batches, in kilograms?`, expr: `${n}*${a}/${b}` });
  if (v === 2) {
    const ins = r.shuffle([b, 2 * b, 3 * b, 4 * b, 5 * b]).slice(0, 3), x = r.int(1, 6) * b + (r.bool() ? 0 : b), out = (i) => frac(i * a, b);
    return num(frac(x * a, b), [`The rule is: multiply the input by ${a}/${b}.`, `${x} × ${a}/${b} = ${x * a}/${b}.`, `So the output is ${frac(x * a, b)}.`], { q: `The rule is "× ${a}/${b}". What is the missing output?`, visual: { type: 'table', head: ['Input', 'Output'], rows: [...ins.map((i) => [String(i), out(i)]), [String(x), '?']] }, expr: `${x}*${a}/${b}` });
  }
  return num(a, [`The denominators match, so ${n} × ? = ${n * a}.`, `${n * a} ÷ ${n} = ${a}.`, `The missing number is ${a}.`], { q: `${n} × ?/${b} = ${n * a}/${b}`, expr: `${n * a}/${n}` });
});
skill('5-frac-ofnum', 5, 'Multiply fractions', 'Fractions of a number and scaling', ['To find 3/4 of 20: divide by the denominator (20 ÷ 4 = 5), then multiply by the numerator (3 × 5 = 15).', 'Multiplying by a fraction less than 1 makes a number smaller; greater than 1 makes it bigger.'], (r) => {
  const v = r.int(0, 2), [a, b] = coprime(r, 2, 10), k = r.int(2, 12), N = b * k;
  if (v === 0) return num(a * k, [`Find 1/${b} of ${N}: ${N} ÷ ${b} = ${k}.`, `Then ${a} × ${k} = ${a * k}.`, `So ${a}/${b} of ${N} is ${a * k}.`], { q: `What is ${a}/${b} of ${N}?`, expr: `${a}/${b}*${N}` });
  if (v === 1) {
    const [q, who] = r.pick([[`A class has ${N} students. ${a}/${b} of them walk to school. How many students walk to school?`, 'students walk'], [`A farmer has ${N} chickens. ${a}/${b} of them are brown. How many chickens are brown?`, 'chickens are brown'], [`A book has ${N} pages. ${r.pick(NAMES)} has read ${a}/${b} of it. How many pages have been read?`, 'pages have been read']]);
    return num(a * k, [`1/${b} of ${N} is ${N} ÷ ${b} = ${k}.`, `${a}/${b} of ${N} is ${a} × ${k} = ${a * k}.`, `So ${a * k} ${who}.`], { q, expr: `${a}/${b}*${N}` });
  }
  const t = r.int(0, 2), [p, s] = t === 0 ? [a, b] : t === 1 ? [b + a, b] : [b, b], M = r.int(10, 90);
  const right = p < s ? `Less than ${M}` : p > s ? `Greater than ${M}` : `Equal to ${M}`;
  return mc(r, right, [`Less than ${M}`, `Greater than ${M}`, `Equal to ${M}`].filter((x) => x !== right), { q: `Without multiplying, is ${p}/${s} × ${M} greater than, less than or equal to ${M}?`, steps: [`${p}/${s} is ${p < s ? 'less than 1' : p > s ? 'greater than 1' : 'equal to 1'}.`, p < s ? 'Multiplying by a number less than 1 makes it smaller.' : p > s ? 'Multiplying by a number greater than 1 makes it bigger.' : 'Multiplying by 1 keeps it the same.', `So the product is ${right.toLowerCase()}.`] });
});

// ───────────── 18. Divide fractions ─────────────
skill('5-frac-divunit', 5, 'Divide fractions', 'Divide whole numbers by unit fractions', ['n ÷ 1/d asks: how many 1/d pieces fit in n?', 'Each whole has d of them, so n ÷ 1/d = n × d.'], (r) => {
  const v = r.int(0, 2), n = r.int(2, v === 2 ? 4 : 12), d = r.int(2, 10);
  if (v === 0) return num(n * d, [`Ask: how many 1/${d}s fit in ${n}?`, `Each whole holds ${d} of them, so ${n} wholes hold ${n} × ${d} = ${n * d}.`, `So ${n} ÷ 1/${d} = ${n * d}.`], { q: `${n} ÷ 1/${d} = ?`, expr: `${n}/(1/${d})` });
  if (v === 1) return num(n * d, [`Each metre makes ${d} pieces of 1/${d} m.`, `${n} × ${d} = ${n * d}.`, `So there are ${n * d} pieces.`], { q: `${n} m of ribbon is cut into pieces that are each 1/${d} m long. How many pieces are there?`, expr: `${n}/(1/${d})` });
  return num(n * d, [St(`Each bar is one whole, cut into ${d} parts of 1/${d}.`, fractionBars(Array.from({ length: n }, () => ({ n: d, d, label: '1' })))), St(`${n} bars × ${d} parts = ${n * d}.`), St(`So there are ${n * d} pieces of 1/${d} in ${n}.`)], { q: `How many 1/${d}s are in ${n}?`, visual: fractionBars(Array.from({ length: n }, () => ({ n: d, d, label: '1' }))), expr: `${n}*${d}` });
});

// ───────────── 19. Mixed operations: fractions ─────────────
skill('5-frac-mixedops', 5, 'Fraction operations', 'Add, subtract, multiply and divide fractions', ['+ and −: use a common denominator.', '×: multiply tops and multiply bottoms.', 'Whole ÷ unit fraction: multiply by the denominator.'], (r) => {
  const v = r.int(0, 4), nm = r.pick(NAMES);
  if (v === 0) { const [a, b, c, d] = twoFr(r, 8), U = unlikeSteps(a, b, c, d, '+'); return num(U.ans, U.steps, { q: `${a}/${b} + ${c}/${d} = ?`, expr: `${a}/${b}+${c}/${d}` }); }
  if (v === 1) { let [a, b, c, d] = twoFr(r, 8); if (a / b < c / d) [a, b, c, d] = [c, d, a, b]; const U = unlikeSteps(a, b, c, d, '−'); return num(U.ans, U.steps, { q: `${a}/${b} − ${c}/${d} = ?`, expr: `${a}/${b}-${c}/${d}` }); }
  if (v === 2) { const [a, b, c, d] = twoFr(r, 9), ans = frac(a * c, b * d); return num(ans, [`Multiply the numerators: ${a} × ${c} = ${a * c}. Multiply the denominators: ${b} × ${d} = ${b * d}.`, `${a * c}/${b * d}${ans !== `${a * c}/${b * d}` ? ` = ${ans}` : ''}.`, `So the answer is ${ans}.`], { q: `${a}/${b} × ${c}/${d} = ?`, expr: `${a}/${b}*${c}/${d}` }); }
  if (v === 3) { const n = r.int(2, 9), d = r.int(2, 8); return num(n * d, [`${nm} has ${n} L and each glass takes 1/${d} L: ${n} ÷ 1/${d}.`, `${n} × ${d} = ${n * d}.`, `So ${nm} can fill ${n * d} glasses.`], { q: `${nm} has ${n} L of juice and pours it into glasses that each hold 1/${d} L. How many glasses can ${nm} fill?`, expr: `${n}/(1/${d})` }); }
  const [a, b, c, d] = twoFr(r, 8), ans = frac(a * c, b * d);
  return num(ans, [`"${c}/${d} of ${a}/${b}" means ${c}/${d} × ${a}/${b}.`, `${c} × ${a} = ${a * c} and ${d} × ${b} = ${b * d}, so ${a * c}/${b * d}${ans !== `${a * c}/${b * d}` ? ` = ${ans}` : ''}.`, `So ${ans} of the yard has flowers.`], { q: `A garden takes up ${a}/${b} of a yard. Flowers cover ${c}/${d} of the garden. What fraction of the whole yard has flowers?`, expr: `${a}/${b}*${c}/${d}` });
});


// ───────────── 20. Decimal place value: up to hundredths ─────────────
const DPL = ['ones', 'tenths', 'hundredths', 'thousandths'];
// the value of each nonzero digit of N / 10^p, from the left: [{ d, value(string), name }]
const decParts = (N, p) => { const s = String(N).padStart(p + 1, '0'); return s.split('').map((ch, i) => { const k = s.length - 1 - i - p; return { d: Number(ch), k, val: dec(Number(ch) * 10 ** k), name: k >= 0 ? PLACE[k] : DPL[-k] }; }).filter((x) => x.d > 0); };
const placeValueQ = (r, N, p) => {
  const parts = decParts(N, p), pt = r.pick(parts), x = fx(N, p);
  return num(pt.val, [`In ${x}, the digit in the ${pt.name} place is ${pt.d}.`, `One ${pt.name.replace(/s$/, '').replace(/^one$/, 'one')} is ${dec(10 ** pt.k)}, so the ${pt.d} is worth ${pt.d} × ${dec(10 ** pt.k)} = ${pt.val}.`, `So the value is ${pt.val}.`], { q: `What is the value of the digit in the ${pt.name} place of ${x}?`, expr: `${pt.d}*${10 ** pt.k}` });
};
skill('5-dec-pv2', 5, 'Decimal place value', 'Decimals to hundredths', ['After the decimal point come tenths, then hundredths.', '34.07 is "thirty-four and seven hundredths": 30 + 4 + 0.07.', 'To round, look at the digit just to the right of the place you round to.'], (r) => {
  const v = r.int(0, 3); let N = r.int(101, 9999); if (N % 100 === 0) N += r.int(1, 9);
  const ans = dec(N / 100), i = Math.floor(N / 100), f = N % 100;
  if (v === 0) return num(ans, [`The whole-number part is ${i}.`, `${words(f)} hundredth${f === 1 ? '' : 's'} is 0.${String(f).padStart(2, '0')}, so the number is ${ans}.`], { q: `Write as a decimal: ${decWords(N, 2)}.`, expr: `${N}/100` });
  if (v === 1) return placeValueQ(r, N, 2);
  if (v === 2) {
    const parts = decParts(N, 2), right = parts.map((x) => x.val).join(' + ');
    const shifted = (j, m) => parts.map((x, k) => (k === j ? dec(Number(x.val) * m) : x.val)).join(' + ');
    return mc(r, right, [shifted(parts.length - 1, 10), shifted(parts.length - 1, 0.1), shifted(0, 0.1)], { q: `Which is the expanded form of ${fx(N, 2)}?`, steps: ['Write the value of each digit that is not 0.', `${fx(N, 2)} = ${right}.`] });
  }
  const tenth = r.bool(), R = tenth ? Math.round(N / 10) / 10 : Math.round(N / 100), dgt = tenth ? N % 10 : Math.floor(N / 10) % 10, a = dec(R);
  return num(a, [`Look at the ${tenth ? 'hundredths' : 'tenths'} digit: ${dgt}.`, dgt >= 5 ? `It is 5 or more, so round up to ${a}.` : `It is less than 5, so round down to ${a}.`, `So ${fx(N, 2)} rounds to ${a}.`], { q: `Round ${fx(N, 2)} to the nearest ${tenth ? 'tenth' : 'whole number'}.`, expr: tenth ? `Math.round(${N}/10)/10` : `Math.round(${N}/100)` });
});

// ───────────── 21. Decimal place value: up to thousandths ─────────────
skill('5-dec-pv3', 5, 'Decimal place value', 'Decimals to thousandths', ['The third place after the point is thousandths: 0.001 is one thousandth.', 'Each place is 10 times the place to its right, and 1/10 of the place to its left.'], (r) => {
  const v = r.int(0, 4); let N = r.int(1, 99999); if (N % 1000 === 0) N += r.int(1, 9);
  const ans = dec(N / 1000), i = Math.floor(N / 1000), f = N % 1000;
  if (v === 0) return num(ans, [`The whole-number part is ${i}.`, `${words(f)} thousandth${f === 1 ? '' : 's'} is 0.${String(f).padStart(3, '0')}, so the number is ${ans}.`], { q: `Write as a decimal: ${decWords(N, 3)}.`, expr: `${N}/1000` });
  if (v === 1) return placeValueQ(r, N, 3);
  if (v === 2) {
    const d = r.int(1, 9), a = r.int(2, 3), b = r.int(1, a - 1), big = dec(d / 10 ** b), small = dec(d / 10 ** a), ratio = 10 ** (a - b);
    return num(ratio, [`${big} is ${d} ${DPL[b]} and ${small} is ${d} ${DPL[a]}.`, `Each place is 10 times the next place to the right, so moving ${a - b} place${a - b > 1 ? 's' : ''} is × ${ratio}.`, `So ${big} is ${ratio} times as much as ${small}.`], { q: `${big} is how many times as much as ${small}?`, expr: `${d / 10 ** b}/${d / 10 ** a}` });
  }
  if (v === 3) {
    const R = Math.round(N / 10) / 100, a = dec(R), dg = N % 10;
    return num(a, [`Look at the thousandths digit: ${dg}.`, dg >= 5 ? `It is 5 or more, so round up to ${a}.` : `It is less than 5, so round down to ${a}.`, `So ${fx(N, 3)} rounds to ${a}.`], { q: `Round ${fx(N, 3)} to the nearest hundredth.`, expr: `Math.round(${N}/10)/100` });
  }
  const o = r.int(0, 9), h = r.int(1, 30), t = r.int(1, 9), val = dec(o + h / 100 + t / 1000);
  return num(val, [`${o} ones = ${o}. ${h} hundredths = ${dec(h / 100)}. ${t} thousandths = ${dec(t / 1000)}.`, `${o} + ${dec(h / 100)} + ${dec(t / 1000)} = ${val}.`, `So the number is ${val}.`], { q: `What number is ${o} ones + ${h} hundredths + ${t} thousandths?`, expr: `${o}+${h}/100+${t}/1000` });
});

// ───────────── 22. Compare decimals ─────────────
const thou = (x) => dec(x / 1000);
skill('5-dec-compare', 5, 'Compare decimals', 'Compare decimals', ['Line up the decimal points and compare place by place from the left.', 'Zeros at the end do not change a decimal: 0.4 = 0.40 = 0.400.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const A = r.int(100, 9999), B = r.bool(0.1) ? A : r.bool() ? A + r.nonzero(-60, 60) * (r.bool() ? 1 : 10) : r.int(100, 9999), Bp = Math.max(1, B);
    return signMC(r, A, Bp, { q: `Which sign makes this true? ${thou(A)} ? ${thou(Bp)}`, steps: [`Write both with three decimal places: ${fx(A, 3)} and ${fx(Bp, 3)}.`, `Compare from the left, place by place.`, `So ${thou(A)} ${cmp(A, Bp)} ${thou(Bp)}.`] });
  }
  if (v === 1) {
    const w = r.int(0, 9), d = r.int(1, 9), x = `${w}.${d}`;
    return mc(r, `${x}0`, [`${w}.0${d}`, `${w}${d}`, `${d}.${w}`].filter((s) => s !== `${x}0`), { q: `Which decimal is equal to ${x}?`, steps: ['A zero at the end of a decimal does not change its value.', `${x} = ${x}0.`] });
  }
  const set = new Set(); while (set.size < 4) set.add(r.int(1, 999) * (r.bool() ? 1 : 10) % 10000 || 5);
  const vals = [...set], mx = Math.max(...vals);
  return mc(r, thou(mx), vals.filter((x) => x !== mx).map(thou), { q: `Which decimal is the greatest? ${r.shuffle(vals).map(thou).join('; ')}`, steps: [`Write them all with three places: ${vals.map((x) => fx(x, 3)).join(', ')}.`, `The greatest is ${thou(mx)}.`] });
});
skill('5-dec-order', 5, 'Compare decimals', 'Order decimals and solve', ['Write the decimals with the same number of places, then order them like whole numbers.', 'In a race, the smallest time is the fastest.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) { const set = new Set(); const base = r.int(1, 9) * 1000; while (set.size < 3) set.add(base + r.int(0, 99) * r.pick([1, 10])); return orderMC(r, [...set], thou, r.bool(), { steps: ['Write each with three decimal places and compare.'] }); }
  if (v === 1) {
    const ns = r.shuffle(NAMES).slice(0, 3), set = new Set(); while (set.size < 3) set.add(r.int(1200, 1599));
    const ts = [...set], best = ts.indexOf(Math.min(...ts)), longJump = r.bool();
    if (longJump) { const jumps = ts.map((t) => t - 900), top = jumps.indexOf(Math.max(...jumps)); return mc(r, ns[top], ns.filter((_, i) => i !== top), { q: `In the long jump, ${ns.map((n, i) => `${n} jumped ${dec(jumps[i] / 100)} m`).join(', ')}. Who jumped the farthest?`, steps: [`Compare ${jumps.map((j) => fx(j, 2)).join(', ')}.`, `The greatest is ${dec(jumps[top] / 100)} m, so ${ns[top]} jumped the farthest.`] }); }
    return mc(r, ns[best], ns.filter((_, i) => i !== best), { q: `In a 100 m race, ${ns.map((n, i) => `${n} ran it in ${dec(ts[i] / 100)} s`).join(', ')}. Who was the fastest?`, steps: [`The fastest runner has the smallest time. Compare ${ts.map((t) => fx(t, 2)).join(', ')}.`, `The smallest is ${dec(ts[best] / 100)} s, so ${ns[best]} was the fastest.`] });
  }
  let N = r.int(101, 999); if (N % 10 === 5) N++;
  const a = dec(Math.round(N / 10) / 10), nm = r.pick(NAMES);
  return num(a, [`Look at the hundredths digit of ${fx(N, 2)}: ${N % 10}.`, `${N % 10 >= 5 ? 'Round up' : 'Round down'}: ${fx(N, 2)} ≈ ${a}.`, `So ${nm}'s jump is about ${a} m.`], { q: `${nm} jumped ${fx(N, 2)} m. What is that rounded to the nearest tenth of a metre?`, expr: `Math.round(${N}/10)/10` });
});

// ───────────── 23. Convert between decimals and fractions ─────────────
skill('5-decfrac-convert', 5, 'Decimals and fractions', 'Convert decimals and fractions', ['Tenths, hundredths and thousandths are fractions over 10, 100 and 1000: 0.37 = 37/100.', 'To change 3/4 to a decimal, make the denominator 100: 3/4 = 75/100 = 0.75.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const d = r.pick([2, 4, 5, 20, 25, 50, 10, 100, 1000]), n = r.int(1, d - 1), m = d <= 100 ? 100 / d : 1, D = d <= 100 ? 100 : 1000, ans = dec(n / d);
    return num(ans, [d === D ? `${n}/${d} already has a denominator of ${D}.` : `Multiply top and bottom by ${m} to get a denominator of 100: ${n}/${d} = ${n * m}/100.`, `${n * m}/${D} = ${ans}.`, `So ${n}/${d} = ${ans}.`], { q: `Write ${n}/${d} as a decimal.`, expr: `${n}/${d}` });
  }
  const p = r.int(1, 3), P = 10 ** p; let N = r.int(1, P - 1); if (N % 10 === 0 && p > 1) N += 1;
  const x = fx(N, p), ans = frac(N, P);
  if (v === 1) return num(ans, [`${x} has ${p} decimal place${p > 1 ? 's' : ''}, so it is ${N}/${P}.`, ans !== `${N}/${P}` ? `Simplify: ${N}/${P} = ${ans}.` : `${N}/${P} is already in lowest terms.`, `So ${x} = ${ans}.`], { q: `Write ${x} as a fraction in lowest terms.`, exactForm: 'fraction', expr: `${N}/${P}` });
  return num(N, [`${x} has ${p} decimal place${p > 1 ? 's' : ''}, so it is ${DPL[p]}.`, `${x} = ${N}/${P}. The missing number is ${N}.`], { q: `${x} = ?/${P}`, expr: `${x}*${P}` });
});
skill('5-decfrac-expanded', 5, 'Decimals and fractions', 'Decimals, fractions and expanded form', ['3.274 = 3 + 2/10 + 7/100 + 4/1000.', 'On a number line split into tenths, each mark is 0.1.'], (r) => {
  const v = r.int(0, 3);
  if (v < 2) {
    let N = r.int(1001, 9999); const s = String(N), w = Number(s[0]), ds = s.slice(1).split('').map(Number);
    const terms = [String(w), ...ds.map((d, i) => (d ? `${d}/${10 ** (i + 1)}` : null)).filter(Boolean)], right = terms.join(' + '), x = fx(N, 3);
    if (v === 0) {
      const sw = [String(w), ...ds.map((d, i) => (d ? `${d}/${10 ** (3 - i)}` : null)).filter(Boolean)].join(' + ');
      const plus = [String(w), ...ds.map((d, i) => (d ? `${d}/${10 ** (i + 2)}` : null)).filter(Boolean)].join(' + ');
      const tens = [`${w}/10`, ...terms.slice(1)].join(' + ');
      return mc(r, right, [sw, plus, tens], { q: `Which is ${x} written in expanded form with fractions?`, steps: ['The first place after the point is tenths, then hundredths, then thousandths.', `${x} = ${right}.`] });
    }
    return num(dec(N / 1000), [`${terms.slice(1).map((t) => `${t} = ${dec(Function(`return ${t}`)())}`).join(', ')}.`, `${right} = ${dec(N / 1000)}.`, `So the number is ${dec(N / 1000)}.`], { q: `Write as a decimal: ${right}`, expr: `${N}/1000` });
  }
  if (v === 2) { const w = r.int(0, 8), k = r.int(1, 9), ans = dec(w + k / 10); return num(ans, [`The space from ${w} to ${w + 1} is split into 10 parts, so each mark is 0.1.`, `${k} marks past ${w} is ${w} + ${dec(k / 10)} = ${ans}.`, `So the point is at ${ans}.`], { q: `A number line from ${w} to ${w + 1} is split into 10 equal parts. A point is ${k} marks to the right of ${w}. What decimal is at the point?`, expr: `${w}+${k}/10` }); }
  const k = r.int(1, 99), ans = dec(k / 100);
  return num(ans, [`The grid has 100 equal squares, so each one is 1/100 = 0.01.`, `${k} squares are ${k}/100 = ${ans}.`, `So the shaded part is ${ans}.`], { q: `A grid of 100 equal squares has ${k} squares shaded. Write the shaded part as a decimal.`, expr: `${k}/100` });
});

// ───────────── 24. Compare decimals and fractions ─────────────
skill('5-decfrac-compare', 5, 'Compare decimals and fractions', 'Compare and order decimals and fractions', ['Change the fraction to a decimal, then compare the decimals.', '3/4 = 0.75 and 2/5 = 0.4.'], (r) => {
  const v = r.int(0, 2), FR = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [3, 10], [7, 10], [9, 20], [7, 25], [3, 50]];
  const fThou = ([n, d]) => n * 1000 / d;
  if (v === 0) {
    const f = r.pick(FR), F = fThou(f), X = r.bool(0.15) ? F : Math.max(1, F + r.nonzero(-20, 20) * r.pick([1, 5, 10]));
    const swap = r.bool(), [L, R] = swap ? [thou(X), `${f[0]}/${f[1]}`] : [`${f[0]}/${f[1]}`, thou(X)], s = swap ? cmp(X, F) : cmp(F, X);
    return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `Which sign makes this true? ${L} ? ${R}`, steps: [`Change the fraction to a decimal: ${f[0]}/${f[1]} = ${thou(F)}.`, `Compare ${thou(F)} with ${thou(X)}.`, `So ${L} ${s} ${R}.`] });
  }
  const picks = r.shuffle(FR).slice(0, 2), lab = new Map(); picks.forEach((f) => lab.set(fThou(f), `${f[0]}/${f[1]}`));
  while (lab.size < 4) { const x = r.int(5, 99) * 10; if (!lab.has(x)) lab.set(x, thou(x)); }
  const vals = [...lab.keys()];
  if (v === 1) return orderMC(r, r.shuffle(vals).slice(0, 3), (x) => lab.get(x), r.bool(), { steps: [`Change any fraction to a decimal: ${picks.map((f) => `${f[0]}/${f[1]} = ${thou(fThou(f))}`).join(', ')}.`] });
  const mx = Math.max(...vals);
  return mc(r, lab.get(mx), vals.filter((x) => x !== mx).map((x) => lab.get(x)), { q: `Which is the greatest? ${r.shuffle(vals).map((x) => lab.get(x)).join('; ')}`, steps: [`As decimals: ${vals.map((x) => `${lab.get(x)} = ${thou(x)}`).join(', ')}.`, `The greatest is ${lab.get(mx)}.`] });
});

// ───────────── 25. Add and subtract decimals up to hundredths ─────────────
const hund = (x) => dec(x / 100);
skill('5-dec-addword', 5, 'Add and subtract decimals', 'Decimal word problems and shortcuts', ['Line up the decimal points before adding or subtracting.', 'Compensation: 4.98 + 2.35 is 5 + 2.35 − 0.02.', 'Group decimals that make whole numbers: 1.25 + 0.75 = 2.'], (r) => {
  const v = r.int(0, 3), nm = r.pick(NAMES), A = r.int(105, 2500), B = r.int(105, 2500);
  if (v === 0) {
    const [q, unit] = r.pick([[`A puppy had a mass of ${hund(A)} kg. Since then it has gained ${hund(B)} kg. What is its mass now, in kilograms?`, 'kg'], [`${nm} biked ${hund(A)} km on Saturday and ${hund(B)} km on Sunday. How far is that in all, in kilometres?`, 'km'], [`A tank had ${hund(A)} L of water. ${hund(B)} L more was added. How many litres are in the tank now?`, 'L']]);
    return num(hund(A + B), [`Add: ${fx(A, 2)} + ${fx(B, 2)}.`, `Line up the decimal points: ${fx(A, 2)} + ${fx(B, 2)} = ${hund(A + B)}.`, `So the answer is ${hund(A + B)} ${unit}.`], { q, expr: `${A}/100+${B}/100` });
  }
  if (v === 1) {
    const hi = Math.max(A, B) + 50, lo = Math.min(A, B);
    const q = r.pick([`A ribbon is ${hund(hi)} m long. ${nm} cuts off ${hund(lo)} m. How much ribbon is left, in metres?`, `A pumpkin has a mass of ${hund(hi)} kg and a squash has a mass of ${hund(lo)} kg. How much heavier is the pumpkin, in kilograms?`]);
    return num(hund(hi - lo), [`Subtract: ${fx(hi, 2)} − ${fx(lo, 2)}.`, `Line up the decimal points: ${fx(hi, 2)} − ${fx(lo, 2)} = ${hund(hi - lo)}.`, `So the answer is ${hund(hi - lo)}.`], { q, expr: `${hi}/100-${lo}/100` });
  }
  if (v === 2) {
    const W = r.int(2, 9), gap = r.int(1, 3), a = W * 100 - gap, add = r.bool(), b = add ? r.int(105, 999) : r.int(105, a - 50);
    const ans = hund(add ? a + b : a - b);
    return num(ans, [`${fx(a, 2)} is ${hund(gap)} less than ${W}. Use ${W} instead.`, add ? `${W} + ${fx(b, 2)} = ${hund(W * 100 + b)}, then take away the extra ${hund(gap)}: ${ans}.` : `${W} − ${fx(b, 2)} = ${hund(W * 100 - b)}, then take away ${hund(gap)} more: ${ans}.`, `So ${fx(a, 2)} ${add ? '+' : '−'} ${fx(b, 2)} = ${ans}.`], { q: `Use compensation to find ${fx(a, 2)} ${add ? '+' : '−'} ${fx(b, 2)}.`, expr: `${a}/100${add ? '+' : '-'}${b}/100` });
  }
  const x = r.int(1, 99), w1 = r.int(0, 5), w2 = r.int(0, 5), m = r.int(11, 99) * 10, a = w1 * 100 + x, c = w2 * 100 + (100 - x), ans = hund(a + c + m);
  return num(ans, [`Group the two that make a whole number: ${hund(a)} + ${hund(c)} = ${hund(a + c)}.`, `Then ${hund(a + c)} + ${hund(m)} = ${ans}.`, `So the sum is ${ans}.`], { q: `${hund(a)} + ${hund(m)} + ${hund(c)} = ?`, expr: `${a}/100+${m}/100+${c}/100` });
});
skill('5-dec-estimate', 5, 'Add and subtract decimals', 'Estimate, compare and complete decimal sums', ['To estimate, round each decimal to the nearest whole number first.', 'To find a missing part, use the opposite operation.'], (r) => {
  const v = r.int(0, 4), A = r.int(105, 2999), B = r.int(105, 2999);
  if (v === 0) {
    const add = r.bool() || A < B, Ra = Math.round(A / 100), Rb = Math.round(B / 100), ans = add ? Ra + Rb : Ra - Rb;
    return num(ans, [`${fx(A, 2)} rounds to ${Ra} and ${fx(B, 2)} rounds to ${Rb}.`, `${Ra} ${add ? '+' : '−'} ${Rb} = ${ans}.`, `So the answer is about ${ans}.`], { q: `Estimate by rounding each number to the nearest whole number: ${fx(A, 2)} ${add ? '+' : '−'} ${fx(B, 2)}`, expr: `Math.round(${A}/100)${add ? '+' : '-'}Math.round(${B}/100)` });
  }
  if (v === 1) { const C = A + B; return num(hund(B), [`The missing part is the total minus the part we know: ${hund(C)} − ${hund(A)}.`, `${fx(C, 2)} − ${fx(A, 2)} = ${hund(B)}.`, `So the missing number is ${hund(B)}.`], { q: `${hund(A)} + ? = ${hund(C)}`, expr: `${C}/100-${A}/100` }); }
  if (v === 2) { const val = A + B, c = r.bool(0.2) ? val : val + r.nonzero(-30, 30); return signMC(r, val, c, { q: `Which sign makes this true? ${hund(A)} + ${hund(B)} ? ${hund(c)}`, steps: [`${fx(A, 2)} + ${fx(B, 2)} = ${hund(val)}.`, `Compare ${hund(val)} with ${hund(c)}.`, `So ${hund(A)} + ${hund(B)} ${cmp(val, c)} ${hund(c)}.`] }); }
  if (v === 3) {
    const S = r.int(3, 12) * 100, a = r.int(11, S - 11), b = S - a;
    return mc(r, `${hund(a)} and ${hund(b)}`, [`${hund(a)} and ${hund(b + 10)}`, `${hund(a + 1)} and ${hund(b + 10)}`, `${hund(a)} and ${hund(b - 1)}`], { q: `Which two decimals add up to ${S / 100}?`, steps: ['Add each pair and look for the total.', `${fx(a, 2)} + ${fx(b, 2)} = ${fx(S, 2)}.`] });
  }
  const a = r.int(30, 70), b = r.int(30, 70), sum = a + b, s = sum > 100 ? 'More than 1' : sum < 100 ? 'Less than 1' : 'Exactly 1';
  return mc(r, s, ['More than 1', 'Less than 1', 'Exactly 1'].filter((x) => x !== s), { q: `Use 1/2 as a benchmark. Is ${hund(a)} + ${hund(b)} more than 1, less than 1 or exactly 1?`, steps: [`${hund(a)} is ${a > 50 ? 'more than' : a < 50 ? 'less than' : 'equal to'} 0.5 and ${hund(b)} is ${b > 50 ? 'more than' : b < 50 ? 'less than' : 'equal to'} 0.5.`, `The sum is ${hund(sum)}, so it is ${s.toLowerCase()}.`] });
});

// ───────────── 26. Add and subtract decimals up to thousandths ─────────────
skill('5-dec-add3', 5, 'Add and subtract decimals', 'Add and subtract thousandths', ['Line up the decimal points. Write zeros so every number has three decimal places.', 'Then add or subtract from the right.'], (r) => {
  const v = r.int(0, 2), A = r.int(1001, 29999), B = r.int(101, 19999);
  if (v === 0) return num(thou(A + B), columnAdd([fx(A, 3), fx(B, 3)]), { q: `${thou(A)} + ${thou(B)} = ?`, expr: `${A}/1000+${B}/1000` });
  const hi = Math.max(A, B) + 7, lo = Math.min(A, B);
  if (v === 1) return num(thou(hi - lo), columnSub(fx(hi, 3), fx(lo, 3)), { q: `${thou(hi)} − ${thou(lo)} = ?`, expr: `${hi}/1000-${lo}/1000` });
  const nm = r.pick(NAMES), a = r.int(9001, 14999), b = a + r.int(11, 999);
  return num(thou(b - a), [`Subtract the faster time from the slower one: ${fx(b, 3)} − ${fx(a, 3)}.`, `${fx(b, 3)} − ${fx(a, 3)} = ${thou(b - a)}.`, `So ${nm} was ${thou(b - a)} s faster.`], { q: `${nm} finished a ski race in ${thou(a)} s. A friend took ${thou(b)} s. How many seconds faster was ${nm}?`, expr: `${b}/1000-${a}/1000` });
});
skill('5-dec-add3b', 5, 'Add and subtract decimals', 'Thousandths: missing numbers and estimates', ['Use the opposite operation to find a missing number.', 'Round each decimal to the nearest tenth to estimate.'], (r) => {
  const v = r.int(0, 3), A = r.int(1001, 9999), B = r.int(101, 4999);
  if (v === 0) return r.bool()
    ? num(thou(A + B), [`? − ${thou(B)} = ${thou(A)}, so add back: ${thou(A)} + ${thou(B)}.`, `${fx(A, 3)} + ${fx(B, 3)} = ${thou(A + B)}.`, `So the missing number is ${thou(A + B)}.`], { q: `? − ${thou(B)} = ${thou(A)}`, expr: `${A}/1000+${B}/1000` })
    : num(thou(B), [`The missing part is ${thou(A + B)} − ${thou(A)}.`, `${fx(A + B, 3)} − ${fx(A, 3)} = ${thou(B)}.`, `So the missing number is ${thou(B)}.`], { q: `${thou(A)} + ? = ${thou(A + B)}`, expr: `${A + B}/1000-${A}/1000` });
  if (v === 1) { const val = A - B, c = r.bool(0.2) ? val : val + r.nonzero(-9, 9) * r.pick([1, 10]); return signMC(r, val, c, { q: `Which sign makes this true? ${thou(A)} − ${thou(B)} ? ${thou(c)}`, steps: [`${fx(A, 3)} − ${fx(B, 3)} = ${thou(val)}.`, `Compare ${thou(val)} with ${thou(c)}.`, `So ${thou(A)} − ${thou(B)} ${cmp(val, c)} ${thou(c)}.`] }); }
  if (v === 2) { const Ra = Math.round(A / 100), Rb = Math.round(B / 100), ans = dec((Ra + Rb) / 10); return num(ans, [`${fx(A, 3)} rounds to ${dec(Ra / 10)} and ${fx(B, 3)} rounds to ${dec(Rb / 10)}.`, `${dec(Ra / 10)} + ${dec(Rb / 10)} = ${ans}.`, `So the sum is about ${ans}.`], { q: `Estimate by rounding each number to the nearest tenth: ${thou(A)} + ${thou(B)}`, expr: `(Math.round(${A}/100)+Math.round(${B}/100))/10` }); }
  const D = r.int(101, 2999), a = r.int(D + 101, 9999), b = a - D;
  return mc(r, `${thou(a)} and ${thou(b)}`, [`${thou(a)} and ${thou(b + 10)}`, `${thou(a + 100)} and ${thou(b)}`, `${thou(a)} and ${thou(b - 1)}`], { q: `Which two decimals have a difference of ${thou(D)}?`, steps: ['Subtract the smaller from the bigger in each pair.', `${fx(a, 3)} − ${fx(b, 3)} = ${thou(D)}.`] });
});

// ───────────── 27. Multiply decimals by powers of ten ─────────────
skill('5-dec-pow10b', 5, 'Multiply decimals', 'Decimals × powers of ten', ['× 10, × 100, × 1000 move each digit 1, 2 or 3 places to the left.', '× 0.1 is the same as ÷ 10; × 0.01 is the same as ÷ 100.'], (r) => {
  const v = r.int(0, 3), p = r.int(1, 3), N = r.int(11, 9999), x = dec(N / 10 ** p), e = r.int(1, 3), P = 10 ** e, ans = dec(N * P / 10 ** p);
  if (v === 0) return num(ans, [`10^${e} = ${comma(P)}.`, `Multiplying by ${comma(P)} moves every digit ${e} place${e > 1 ? 's' : ''} to the left.`, `So ${x} × 10^${e} = ${ans}.`], { q: `${x} × 10^${e} = ?`, expr: `${x}*10**${e}` });
  if (v === 1) { const n = r.int(2, 999), m = r.pick([0.1, 0.01]), a = dec(n * m); return num(a, [`× ${m} is the same as ÷ ${m === 0.1 ? 10 : 100}.`, `${n} ÷ ${m === 0.1 ? 10 : 100} = ${a}.`, `So ${n} × ${m} = ${a}.`], { q: `${n} × ${m} = ?`, expr: `${n}*${m}` }); }
  if (v === 2) return num(P, [`${x} became ${ans}: the digits moved ${e} place${e > 1 ? 's' : ''} to the left.`, `Moving ${e} place${e > 1 ? 's' : ''} left is × ${comma(P)}.`, `So the missing number is ${comma(P)}.`], { q: `${x} × ? = ${ans}`, expr: `${ans}/${x}` });
  return num(x, [`Undo × ${comma(P)} by dividing: ${ans} ÷ ${comma(P)}.`, `Move the digits ${e} place${e > 1 ? 's' : ''} to the right: ${x}.`, `So the missing number is ${x}.`], { q: `? × ${comma(P)} = ${ans}`, expr: `${ans}/${P}` });
});

// ───────────── 28. Multiply decimals by whole numbers ─────────────
skill('5-dec-mulwhole', 5, 'Multiply decimals', 'Multiply decimals by whole numbers', ['Multiply as if there were no decimal point.', 'Then put the point back: the answer has as many decimal places as the decimal you started with.'], (r) => {
  const v = r.int(0, 2), nm = r.pick(NAMES);
  if (v === 0) { const N = r.int(101, 999), n = r.int(11, 60), ans = dec(N * n / 100); return num(ans, [`Multiply as whole numbers: ${N} × ${n} = ${comma(N * n)}.`, `${fx(N, 2)} has 2 decimal places, so the answer has 2: ${fx(N * n, 2)}.`, `So ${fx(N, 2)} × ${n} = ${ans}.`], { q: `${fx(N, 2)} × ${n} = ?`, expr: `${N}/100*${n}` }); }
  if (v === 1) {
    const w = r.int(1, 9), t = r.int(1, 9), n = r.int(3, 9), ans = dec(n * (w + t / 10));
    return num(ans, [`Split ${w}.${t} into ${w} + ${dec(t / 10)}.`, `${n} × ${w} = ${n * w} and ${n} × ${dec(t / 10)} = ${dec(n * t / 10)}.`, `${n * w} + ${dec(n * t / 10)} = ${ans}. So ${n} × ${w}.${t} = ${ans}.`], { q: `Use the distributive property: ${n} × ${w}.${t} = ?`, expr: `${n}*${w}.${t}` });
  }
  const N = r.int(11, 499), n = r.int(3, 15), ans = dec(N * n / 100);
  const q = r.pick([`A bottle holds ${hund(N)} L of water. How many litres are in ${n} bottles?`, `${nm} runs ${hund(N)} km every day. How far does ${nm} run in ${n} days, in kilometres?`, `A bag of rice has a mass of ${hund(N)} kg. What is the mass of ${n} bags, in kilograms?`]);
  return num(ans, [`Multiply: ${hund(N)} × ${n}.`, `${N} × ${n} = ${N * n}, then place the point: ${ans}.`, `So the answer is ${ans}.`], { q, expr: `${N}/100*${n}` });
});

// ───────────── 29. Multiply decimals ─────────────
skill('5-dec-muldec', 5, 'Multiply decimals', 'Multiply two decimals', ['Multiply as whole numbers.', 'Count the decimal places in both numbers. The answer has that many.', 'Multiplying by a number less than 1 makes the answer smaller.'], (r) => {
  const v = r.int(0, 4), A = r.int(2, 99), B = r.int(2, 99);
  if (v === 0) { const ans = dec(A * B / 100); return num(ans, [`Multiply as whole numbers: ${A} × ${B} = ${A * B}.`, `There are 1 + 1 = 2 decimal places in all, so the answer is ${fx(A * B, 2)}.`, `So ${fx(A, 1)} × ${fx(B, 1)} = ${ans}.`], { q: `${fx(A, 1)} × ${fx(B, 1)} = ?`, expr: `${A / 10}*${B / 10}` }); }
  if (v === 1) { const C = r.int(11, 999), ans = dec(C * A / 1000); return num(ans, [`Multiply as whole numbers: ${C} × ${A} = ${C * A}.`, `There are 2 + 1 = 3 decimal places in all, so the answer is ${fx(C * A, 3)}.`, `So ${fx(C, 2)} × ${fx(A, 1)} = ${ans}.`], { q: `${fx(C, 2)} × ${fx(A, 1)} = ?`, expr: `${C / 100}*${A / 10}` }); }
  if (v === 2) {
    const a = r.int(11, 99), b = r.int(11, 99), P = a * b, right = fx(P, 2);
    return mc(r, right, [fx(P, 1), fx(P, 3), String(P)], { q: `${a} × ${b} = ${P}. What is ${fx(a, 1)} × ${fx(b, 1)}?`, steps: [`${fx(a, 1)} and ${fx(b, 1)} each have 1 decimal place: 2 in all.`, `So ${fx(a, 1)} × ${fx(b, 1)} = ${right}.`] });
  }
  if (v === 3) {
    const x = r.int(21, 89), y = r.int(21, 89), Rx = Math.round(x / 10), Ry = Math.round(y / 10), E = Rx * Ry;
    return mc(r, String(E), [String(E * 10), String(Rx + Ry), dec(E / 10)].filter((s) => s !== String(E)), { q: `Which is the best estimate of ${fx(x, 1)} × ${fx(y, 1)}?`, steps: [`Round each to the nearest whole number: ${Rx} and ${Ry}.`, `${Rx} × ${Ry} = ${E}.`] });
  }
  const k = r.int(1, 9), M = r.int(12, 99), big = r.bool(), f = big ? `1.${k}` : `0.${k}`, s = big ? '>' : '<';
  return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `Without multiplying, which sign makes this true? ${f} × ${M} ? ${M}`, steps: [`${f} is ${big ? 'more' : 'less'} than 1.`, `So ${f} × ${M} is ${big ? 'more' : 'less'} than ${M}: ${f} × ${M} ${s} ${M}.`] });
});

// ───────────── 30. Divide decimals by powers of ten ─────────────
skill('5-dec-divpow10', 5, 'Divide decimals', 'Divide by powers of ten', ['÷ 10, ÷ 100, ÷ 1000 move each digit 1, 2 or 3 places to the right.', 'Write zeros in front if you need them: 4.5 ÷ 100 = 0.045.'], (r) => {
  const v = r.int(0, 3), N = r.int(11, 9999), p = r.int(0, 1), x = dec(N / 10 ** p), e = r.int(1, 3), P = 10 ** e, ans = dec(N / 10 ** (p + e));
  if (v === 0) return num(ans, [`Dividing by ${comma(P)} moves every digit ${e} place${e > 1 ? 's' : ''} to the right.`, `${x} ÷ ${comma(P)} = ${ans}.`, `So the answer is ${ans}.`], { q: `${x} ÷ ${comma(P)} = ?`, expr: `${x}/${P}` });
  if (v === 1) { const n = r.int(11, 999); return num(dec(n / 100), [`Each time you divide by another 10, the digits move one more place right.`, `${n} ÷ 10 = ${dec(n / 10)}, so ${n} ÷ 100 = ${dec(n / 100)}.`, `The answer is ${dec(n / 100)}.`], { q: `${n} ÷ 1 = ${n} and ${n} ÷ 10 = ${dec(n / 10)}. What is ${n} ÷ 100?`, expr: `${n}/100` }); }
  if (v === 2) return num(x, [`Undo ÷ ${comma(P)} by multiplying: ${ans} × ${comma(P)}.`, `Move the digits ${e} place${e > 1 ? 's' : ''} left: ${x}.`, `So the missing number is ${x}.`], { q: `? ÷ ${comma(P)} = ${ans}`, expr: `${ans}*${P}` });
  return num(ans, [`10^${e} = ${comma(P)}.`, `${x} ÷ ${comma(P)}: move the digits ${e} place${e > 1 ? 's' : ''} to the right.`, `So ${x} ÷ 10^${e} = ${ans}.`], { q: `${x} ÷ 10^${e} = ?`, expr: `${x}/10**${e}` });
});

// ───────────── 31. Divide decimals ─────────────
skill('5-dec-div', 5, 'Divide decimals', 'Divide decimals by whole numbers', ['Divide as with whole numbers, and put the point in the answer right above the point in the number being divided.', 'Check by multiplying back.'], (r) => {
  const v = r.int(0, 3), d = r.int(2, 9), nm = r.pick(NAMES);
  if (v === 0) {
    const p = r.int(1, 2), Q = r.int(11, p === 1 ? 99 : 999), D = Q * d, ans = dec(Q / 10 ** p);
    return num(ans, [`Divide as if there were no decimal point: ${D} ÷ ${d} = ${Q}.`, `${fx(D, p)} has ${p} decimal place${p > 1 ? 's' : ''}, so the answer does too: ${fx(Q, p)}.`, `So ${fx(D, p)} ÷ ${d} = ${ans}.`], { q: `${fx(D, p)} ÷ ${d} = ?`, expr: `${D / 10 ** p}/${d}` });
  }
  if (v === 1) {
    const Q = r.int(11, 299), D = Q * d, ans = hund(Q);
    const q = r.pick([`${nm} pours ${hund(D)} L of juice equally into ${d} bottles. How many litres are in each bottle?`, `A rope ${hund(D)} m long is cut into ${d} equal pieces. How long is each piece, in metres?`]);
    return num(ans, [`Share equally: ${fx(D, 2)} ÷ ${d}.`, `${D} ÷ ${d} = ${Q}, so ${fx(D, 2)} ÷ ${d} = ${ans}.`, `So each one is ${ans}.`], { q, expr: `${D}/100/${d}` });
  }
  if (v === 2) {
    const b = r.pick([3, 6, 7, 9]); let a = r.int(10, 99); if (a % b === 0) a++;
    const ans = dec(Math.round(a * 10 / b) / 10), h = Math.floor(a * 100 / b) % 10;
    return num(ans, [`${a} ÷ ${b} = ${(Math.floor(a * 1000 / b) / 1000).toFixed(3)}…`, `The hundredths digit is ${h}, so round ${h >= 5 ? 'up' : 'down'}.`, `So ${a} ÷ ${b} ≈ ${ans}.`], { q: `Find ${a} ÷ ${b}. Round to the nearest tenth.`, expr: `Math.round(${a}*10/${b})/10` });
  }
  const Q = r.int(2, 12), off = r.nonzero(-4, 4), x = dec(Q * d + off / 10);
  return mc(r, String(Q), [String(Q * 10), dec(Q / 10), String(Q + d)].filter((s) => s !== String(Q)), { q: `Which is the best estimate of ${x} ÷ ${d}?`, steps: [`${x} is close to ${Q * d}, which ${d} divides evenly.`, `${Q * d} ÷ ${d} = ${Q}.`] });
});

// ───────────── 32. Mixed operations: decimals ─────────────
skill('5-dec-mixedops', 5, 'Decimal operations', 'Decimal word problems', ['Decide which operation each step needs.', 'Keep track of the decimal point at every step.'], (r) => {
  const v = r.int(0, 3), nm = r.pick(NAMES);
  if (v === 0) { const A = r.int(101, 999), B = r.int(101, 999), op = r.pick(['+', '−']); const [a, b] = op === '−' && A < B ? [B, A] : [A, B]; const ans = hund(op === '+' ? a + b : a - b); return num(ans, [`Line up the decimal points.`, `${fx(a, 2)} ${op} ${fx(b, 2)} = ${ans}.`, `So the answer is ${ans}.`], { q: `${hund(a)} ${op} ${hund(b)} = ?`, expr: `${a}/100${op === '+' ? '+' : '-'}${b}/100` }); }
  if (v === 1) { const n = r.int(2, 6), p = r.int(105, 650), q = r.int(55, 400), tot = n * p + q; return num(cents(tot), [`Notebooks: ${n} × $${cents(p)} = $${cents(n * p)}.`, `Add the pen: $${cents(n * p)} + $${cents(q)} = $${cents(tot)}.`, `So the total is $${cents(tot)}.`], { q: `${nm} buys ${n} notebooks for $${cents(p)} each and a pen for $${cents(q)}. How many dollars is that in all?`, expr: `(${n}*${p}+${q})/100` }); }
  if (v === 2) { const k = r.int(2, 6), piece = r.int(25, 150), cut = r.int(50, 300), L = k * piece + cut; return num(hund(piece), [`After cutting: ${fx(L, 2)} − ${fx(cut, 2)} = ${hund(k * piece)} m.`, `Shared into ${k} pieces: ${hund(k * piece)} ÷ ${k} = ${hund(piece)}.`, `So each piece is ${hund(piece)} m.`], { q: `A board is ${hund(L)} m long. ${nm} cuts off ${hund(cut)} m and splits the rest into ${k} equal pieces. How long is each piece, in metres?`, expr: `(${L}-${cut})/100/${k}` }); }
  const kg = r.int(12, 60), price = r.int(15, 49) * 10, ans = (kg * price / 1000).toFixed(2);
  return num(ans, [`${dec(kg / 10)} kg at $${cents(price)} per kilogram: ${dec(kg / 10)} × ${cents(price)}.`, `${kg} × ${price} = ${kg * price}; with 3 decimal places that is ${fx(kg * price, 3)}.`, `So the cost is $${ans}.`], { q: `Apples cost $${cents(price)} per kilogram. How many dollars do ${dec(kg / 10)} kg of apples cost?`, expr: `${kg}*${price}/1000` });
});


// ───────────── 33. Money ─────────────
const ITEMS = ['notebook', 'pencil case', 'water bottle', 'sandwich', 'book', 'marker set', 'juice box', 'ruler', 'backpack', 'puzzle'];
skill('5-money-addsub', 5, 'Money', 'Add and subtract money', ['Line up the decimal points: dollars under dollars, cents under cents.', 'Change = amount paid − total cost.'], (r) => {
  const v = r.int(0, 3), nm = r.pick(NAMES), its = r.shuffle(ITEMS).slice(0, 4), pr = its.map(() => r.int(20, 380) * 5);
  const table = { type: 'table', head: ['Item', 'Price'], rows: its.map((t, i) => [t, money(pr[i])]) };
  if (v === 0) { const tot = pr[0] + pr[2]; return num(cents(tot), [`A ${its[0]} costs ${money(pr[0])} and a ${its[2]} costs ${money(pr[2])}.`, `${money(pr[0])} + ${money(pr[2])} = ${money(tot)}.`, `So together they cost ${money(tot)}.`], { q: `Look at the price list. How many dollars do a ${its[0]} and a ${its[2]} cost together?`, visual: table, expr: `(${pr[0]}+${pr[2]})/100` }); }
  if (v === 1) { const tot = pr[1] + pr[3], pay = tot <= 2000 ? 2000 : 5000; return num(cents(pay - tot), [`Total: ${money(pr[1])} + ${money(pr[3])} = ${money(tot)}.`, `Change: ${money(pay)} − ${money(tot)} = ${money(pay - tot)}.`, `So the change is ${money(pay - tot)}.`], { q: `${nm} buys a ${its[1]} and a ${its[3]} and pays with a ${money(pay)} bill. How many dollars of change does ${nm} get?`, visual: table, expr: `(${pay}-${pr[1]}-${pr[3]})/100` }); }
  if (v === 2) {
    const coins = [...Array(r.int(0, 2)).fill(1000), ...Array(r.int(0, 2)).fill(500), ...Array(r.int(0, 3)).fill(200), ...Array(r.int(0, 3)).fill(100), ...Array(r.int(1, 4)).fill(25), ...Array(r.int(0, 3)).fill(10), ...Array(r.int(0, 2)).fill(5)];
    const tot = coins.reduce((a, b) => a + b, 0);
    return num(cents(tot), [`Add the bills and coins from the biggest down: ${coins.map(money).join(' + ')}.`, `That makes ${money(tot)}.`, `So there is ${money(tot)}.`], { q: 'How many dollars are shown?', visual: { type: 'coins', coins }, expr: `(${coins.join('+')})/100` });
  }
  const a = r.int(400, 9999) * 5, b = r.int(100, a / 5 - 50) * 5;
  return num(cents(a - b), [`Line up the decimal points: ${money(a)} − ${money(b)}.`, `${money(a)} − ${money(b)} = ${money(a - b)}.`, `So the answer is ${money(a - b)}.`], { q: `${money(a)} − ${money(b)} = ? (in dollars)`, expr: `(${a}-${b})/100` });
});
skill('5-money-muldiv', 5, 'Money', 'Multiply and divide money', ['To find the cost of many, multiply the price by how many.', 'To share a cost equally, divide. The lower price for one is the better buy.'], (r) => {
  const v = r.int(0, 4), nm = r.pick(NAMES), n = r.int(2, 9), p = r.int(50, 1500) * 5;
  if (v === 0) { const thing = r.pick(['movie tickets', 'swimming passes', 'bus tickets', 'hockey cards packs']); return num(cents(n * p), [`${n} × ${money(p)}.`, `${n} × ${p} cents = ${n * p} cents = ${money(n * p)}.`, `So the total is ${money(n * p)}.`], { q: `${n} ${thing} cost ${money(p)} each. How many dollars do they cost in all?`, expr: `${n}*${p}/100` }); }
  if (v === 1) return num(cents(p), [`Share equally: ${money(n * p)} ÷ ${n}.`, `${n * p} cents ÷ ${n} = ${p} cents = ${money(p)}.`, `So each person pays ${money(p)}.`], { q: `${n} friends share a restaurant bill of ${money(n * p)} equally. How many dollars does each friend pay?`, expr: `${n * p}/${n}/100` });
  if (v === 2) {
    const a = r.int(2, 6), b = r.int(2, 6), ua = r.int(30, 200) * 5; let ub = r.int(30, 200) * 5; while (ub === ua) ub = r.int(30, 200) * 5;
    const right = ua < ub ? 'Pack A' : 'Pack B';
    return mc(r, right, [right === 'Pack A' ? 'Pack B' : 'Pack A'], { q: `Pack A has ${a} granola bars for ${money(a * ua)}. Pack B has ${b} granola bars for ${money(b * ub)}. Which is the better buy?`, steps: [`Price of one bar: A is ${money(a * ua)} ÷ ${a} = ${money(ua)}; B is ${money(b * ub)} ÷ ${b} = ${money(ub)}.`, `${right} costs less for each bar.`] });
  }
  if (v === 3) { const K = r.int(5, 45), P = r.int(15, 120) * 10, c = K * P / 10; return num(cents(c), [`Multiply: ${dec(K / 10)} × ${money(P)}.`, `${K} × ${P} = ${K * P}; move the point: ${money(c)}.`, `So it costs ${money(c)}.`], { q: `Cheese costs ${money(P)} per kilogram. How many dollars does ${dec(K / 10)} kg cost?`, expr: `${K}/10*${P}/100` }); }
  const jp = r.int(15, 60) * 5;
  return num(cents(jp), [`Price of one = total ÷ number: ${money(n * jp)} ÷ ${n}.`, `${money(n * jp)} ÷ ${n} = ${money(jp)}.`, `So one costs ${money(jp)}.`], { q: `A pack of ${n} juice boxes costs ${money(n * jp)}. How many dollars does one juice box cost?`, expr: `${n * jp}/${n}/100` });
});

// ───────────── 34. Time ─────────────
const t24 = (t) => `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
const t12 = (t) => { const h = Math.floor(t / 60) % 24, m = t % 60; return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a.m.' : 'p.m.'}`; };
const hmin = (m) => `${Math.floor(m / 60)} h ${m % 60} min`;
skill('5-time-convert', 5, 'Time', 'Convert and add time units', ['1 min = 60 s, 1 h = 60 min, 1 day = 24 h, 1 week = 7 days, 1 year = 12 months.', 'When minutes add up to 60 or more, make another hour.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [big, small, k] = r.pick([['hours', 'minutes', 60], ['minutes', 'seconds', 60], ['days', 'hours', 24], ['weeks', 'days', 7], ['years', 'months', 12]]), n = r.int(2, 12);
    return r.bool()
      ? num(n * k, [`1 ${big.replace(/s$/, '')} = ${k} ${small}.`, `${n} × ${k} = ${n * k}.`, `So ${n} ${big} = ${n * k} ${small}.`], { q: `${n} ${big} = how many ${small}?`, expr: `${n}*${k}` })
      : num(n, [`1 ${big.replace(/s$/, '')} = ${k} ${small}.`, `${n * k} ÷ ${k} = ${n}.`, `So ${n * k} ${small} = ${n} ${big}.`], { q: `${n * k} ${small} = how many ${big}?`, expr: `${n * k}/${k}` });
  }
  const h = r.int(1, 9), m = r.int(1, 59);
  if (v === 1) return num(h * 60 + m, [`${h} h = ${h} × 60 = ${h * 60} min.`, `${h * 60} + ${m} = ${h * 60 + m}.`, `So ${h} h ${m} min = ${h * 60 + m} min.`], { q: `${h} h ${m} min = how many minutes?`, expr: `${h}*60+${m}` });
  if (v === 2) return num(m, [`${h * 60 + m} min has ${h} full hours (${h * 60} min).`, `${h * 60 + m} − ${h * 60} = ${m}.`, `So it is ${h} h and ${m} min.`], { q: `${h * 60 + m} min = ${h} h and how many minutes?`, expr: `${h * 60 + m}-${h}*60` });
  const h2 = r.int(1, 5), m2 = r.int(10, 59), tot = (h + h2) * 60 + m + m2, H = Math.floor(tot / 60), M = tot % 60;
  return { kind: 'text', answer: `${H} h ${M} min`, accept: [`${H}h ${M}min`, `${H}h${M}min`, `${H} h ${M} m`, `${H} hours ${M} minutes`, `${H} hour ${M} minutes`, `${H} hours ${M} minute`, `${H}h ${M}m`], q: `Add: ${h} h ${m} min + ${h2} h ${m2} min (write it like 3 h 20 min)`, steps: [`Hours: ${h} + ${h2} = ${h + h2}. Minutes: ${m} + ${m2} = ${m + m2}.`, m + m2 >= 60 ? `${m + m2} min = 1 h ${m + m2 - 60} min, so the total is ${H} h ${M} min.` : `So the total is ${H} h ${M} min.`, `The answer is ${H} h ${M} min.`] };
});
skill('5-time-elapsed', 5, 'Time', 'Elapsed time, start and end times', ['Elapsed time is how much time passes from the start to the end.', 'Count on in hours first, then in minutes.'], (r) => {
  const v = r.int(0, 2), s = r.int(6 * 12, 19 * 12) * 5, dur = r.int(3, 60) * 5 + (r.bool() ? r.int(1, 3) * 60 : 0), e = s + dur, f = r.bool() ? t12 : t24;
  if (v === 0) {
    const ev = r.pick(['A movie', 'A soccer game', 'A school trip', 'A piano lesson']);
    return num(dur, [`From ${f(s)} to ${f(e)} is ${hmin(dur)}.`, `${Math.floor(dur / 60)} × 60 + ${dur % 60} = ${dur} minutes.`, `So it lasts ${dur} minutes.`], { q: `How many minutes long is ${ev.toLowerCase()} that starts at ${f(s)} and ends at ${f(e)}?`, expr: `${e}-${s}` });
  }
  const wr = (t) => [f(t + 10), f(t - 10), f(t + 60), f(t - 60)];
  if (v === 1) return mc(r, f(e), wr(e), { q: `A bus trip starts at ${f(s)} and takes ${hmin(dur)}. What time does it end?`, steps: [`Start at ${f(s)}. Add ${Math.floor(dur / 60)} h, then ${dur % 60} min.`, `The trip ends at ${f(e)}.`] });
  return mc(r, f(s), wr(s), { q: `A baking class lasted ${hmin(dur)} and ended at ${f(e)}. What time did it start?`, steps: [`Count back ${Math.floor(dur / 60)} h, then ${dur % 60} min from ${f(e)}.`, `It started at ${f(s)}.`] });
});
skill('5-time-24h', 5, 'Time', '24-hour time, time zones and schedules', ['24-hour time counts hours from 00 to 23: 3:15 p.m. is 15:15.', 'Across Canada: Vancouver is 3 hours behind Toronto, Calgary 2, Winnipeg 1; Halifax is 1 hour ahead and St. John\'s 1 1/2 hours ahead.'], (r) => {
  const v = r.int(0, 4), t = r.int(0, 287) * 5;
  if (v === 0) return mc(r, t24(t), [t24((t + 720) % 1440), t24((t + 60) % 1440), `${Math.floor(t / 60) % 12 || 12}:${String(t % 60).padStart(2, '0')}`], { q: `What is ${t12(t)} in 24-hour time?`, steps: [t >= 720 ? 'For p.m. times after 12:59, add 12 to the hour.' : 'For a.m. times, keep the hour (12 a.m. becomes 00).', `${t12(t)} is ${t24(t)}.`] });
  if (v === 1) return mc(r, t12(t), [t12((t + 720) % 1440), t12((t + 60) % 1440), t12((t + 780) % 1440)], { q: `What is ${t24(t)} in 12-hour time?`, steps: [t >= 780 ? `The hour is more than 12, so subtract 12 and use p.m.` : t >= 720 ? 'Hours 12:00 to 12:59 are p.m.' : 'Hours before 12 are a.m.', `${t24(t)} is ${t12(t)}.`] });
  if (v === 2) {
    const [city, off] = r.pick([['Vancouver', -180], ['Calgary', -120], ['Winnipeg', -60], ['Halifax', 60], ["St. John's", 90]]), T = r.int(8 * 12, 20 * 12) * 5, f = r.bool() ? t12 : t24;
    return mc(r, f(T + off), [f(T - off), f(T), f(T + off + (off > 0 ? 60 : -60))], { q: `When it is ${f(T)} in Toronto, what time is it in ${city}?`, steps: [`${city} is ${Math.abs(off) / 60} hour${Math.abs(off) === 60 ? '' : 's'} ${off < 0 ? 'behind' : 'ahead of'} Toronto.`, `${f(T)} ${off < 0 ? '−' : '+'} ${hmin(Math.abs(off)).replace(' 0 min', '').replace('0 h ', '')} = ${f(T + off)}.`] });
  }
  if (v === 3) {
    const st = ['Kingston', 'Belleville', 'Cobourg', 'Oshawa', 'Toronto'], times = [r.int(6 * 12, 10 * 12) * 5]; for (let i = 1; i < 5; i++) times.push(times[i - 1] + r.int(4, 12) * 5);
    let a = r.int(0, 3), b = r.int(a + 1, 4);
    return num(times[b] - times[a], [`The train leaves ${st[a]} at ${t24(times[a])} and reaches ${st[b]} at ${t24(times[b])}.`, `From ${t24(times[a])} to ${t24(times[b])} is ${times[b] - times[a]} minutes.`, `So the trip takes ${times[b] - times[a]} minutes.`], { q: `Use the train schedule. How many minutes does it take to go from ${st[a]} to ${st[b]}?`, visual: { type: 'table', head: ['Station', 'Time'], rows: st.map((s, i) => [s, t24(times[i])]) }, expr: `${times[b]}-${times[a]}` });
  }
  const gap = r.pick([10, 15, 20, 25, 30, 45]), s0 = r.int(6 * 12, 18 * 12) * 5, seq = [0, 1, 2, 3].map((i) => s0 + i * gap), f = r.bool() ? t12 : t24;
  return mc(r, f(s0 + 4 * gap), [f(s0 + 4 * gap + 5), f(s0 + 4 * gap - 5), f(s0 + 3 * gap + 60)], { q: `If a bus comes at ${seq.map(f).join(', ')} and the pattern continues, when does the next bus come?`, steps: [`The buses come every ${gap} minutes.`, `${f(seq[3])} + ${gap} min = ${f(s0 + 4 * gap)}.`] });
});

// ───────────── 35. Ratios and rates ─────────────
const ratioText = (a, b, extra = []) => { const [x, y] = simplify(a, b); return { answer: `${a}:${b}`, accept: [`${a} to ${b}`, `${x}:${y}`, `${x} to ${y}`, ...extra] }; };
skill('5-ratio-write', 5, 'Ratios', 'Write ratios', ['A ratio compares two amounts: 3 to 5 is written 3:5 or 3/5.', 'The order matters: the first thing named comes first.'], (r) => {
  const v = r.int(0, 3), a = r.int(2, 15), b = r.int(2, 15), [p, q] = r.pick([['girls', 'boys'], ['cats', 'dogs'], ['red marbles', 'blue marbles'], ['apples', 'oranges']]);
  if (v === 0) { const flip = r.bool(), [x, y, nx, ny] = flip ? [b, a, q, p] : [a, b, p, q]; return { kind: 'text', ...ratioText(x, y), q: `There are ${a} ${p} and ${b} ${q}. Write the ratio of ${nx} to ${ny} using a colon.`, steps: [`${nx} come first: ${x}. Then ${ny}: ${y}.`, `So the ratio is ${x}:${y}.`] }; }
  if (v === 1) return num(`${a}/${b}`, [`The first amount (${p}) goes on top: ${a}. The second (${q}) goes on the bottom: ${b}.`, `So the ratio is ${a}/${b}.`], { q: `There are ${a} ${p} and ${b} ${q}. Write the ratio of ${p} to ${q} as a fraction.`, expr: `${a}/${b}` });
  if (v === 2) return { kind: 'text', ...ratioText(a, a + b), q: `There are ${a} ${p} and ${b} ${q}. Write the ratio of ${p} to all of them together, using a colon.`, steps: [`All together: ${a} + ${b} = ${a + b}.`, `So the ratio is ${a}:${a + b}.`] };
  const x = r.int(1, 10), y = r.int(1, 10), o = r.pick(OBJ);
  return { kind: 'text', ...ratioText(x, y), q: `What is the ratio of ${plural(o, 2)} in the red box to ${plural(o, 2)} in the blue box? Use a colon.`, visual: { type: 'groups', groups: [x, y], obj: o }, steps: [`Red box: ${x}. Blue box: ${y}.`, `So the ratio is ${x}:${y}.`] };
});
skill('5-ratio-equiv', 5, 'Ratios', 'Equivalent ratios and rates', ['Multiply or divide both parts of a ratio by the same number to get an equivalent ratio.', 'A unit rate tells how much for 1: 120 km in 2 h is 60 km per hour.'], (r) => {
  const v = r.int(0, 4), a = r.int(1, 9), b = r.int(2, 9), k = r.int(2, 8);
  if (v === 0) return num(a * k, [`${b} × ${k} = ${b * k}, so multiply the first part by ${k} too.`, `${a} × ${k} = ${a * k}.`, `So ${a}:${b} = ${a * k}:${b * k}. The missing number is ${a * k}.`], { q: `${a}:${b} = ?:${b * k}`, expr: `${a}*${k}` });
  if (v === 1) return mc(r, `${a * k}:${b * k}`, [`${a + k}:${b + k}`, `${a * k}:${b * k + 1}`, `${b * k}:${a * k}`].filter((s) => s !== `${a * k}:${b * k}`), { q: `Which ratio is equivalent to ${a}:${b}?`, steps: ['Both parts must be multiplied by the same number.', `${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}, so ${a * k}:${b * k}.`] });
  if (v === 2) { const m = r.int(4, 9); return num(b * m, [`Each row is the first row times a number: ${a}:${b}, ${2 * a}:${2 * b}, ${3 * a}:${3 * b}.`, `${a * m} is ${a} × ${m}, so the water is ${b} × ${m} = ${b * m}.`, `The missing number is ${b * m}.`], { q: 'The table shows a juice mix. What is the missing number?', visual: { type: 'table', head: ['Juice (L)', 'Water (L)'], rows: [[a, b], [2 * a, 2 * b], [3 * a, 3 * b], [a * m, '?']] }, expr: `${b}*${m}` }); }
  if (v === 3) { const rate = r.int(4, 90), n = r.int(2, 9), [u1, u2, w] = r.pick([['km', 'hours', 'km per hour'], ['pages', 'days', 'pages per day'], ['dollars', 'hours', 'dollars per hour']]); return num(rate, [`A unit rate is the amount for 1 of the second thing.`, `${rate * n} ÷ ${n} = ${rate}.`, `So the rate is ${rate} ${w}.`], { q: `${rate * n} ${u1} in ${n} ${u2}. What is the unit rate in ${w}?`, expr: `${rate * n}/${n}` }); }
  const rate = r.int(3, 12), t = r.int(2, 5), m = r.int(2, 6);
  return num(rate * t * m, [`${rate * t} pages in ${t} min is ${rate} pages each minute.`, `In ${t * m} min: ${rate} × ${t * m} = ${rate * t * m}.`, `So ${r.pick(NAMES)} reads ${rate * t * m} pages.`], { q: `A fast reader reads ${rate * t} pages in ${t} minutes. At the same rate, how many pages can be read in ${t * m} minutes?`, expr: `${rate * t}/${t}*${t * m}` });
});

// ───────────── 36. Percents ─────────────
skill('5-pct-convert', 5, 'Percents', 'Percents, fractions and decimals', ['Percent means "out of 100": 35% = 35/100 = 0.35.', 'To change a fraction to a percent, make the denominator 100.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) { const p = r.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 12, 24, 64]), ans = frac(p, 100); return num(ans, [`${p}% = ${p}/100.`, `Simplify by dividing top and bottom by ${gcd(p, 100)}: ${ans}.`, `So ${p}% = ${ans}.`], { q: `Write ${p}% as a fraction in lowest terms.`, exactForm: 'fraction', expr: `${p}/100` }); }
  if (v === 1) { const d = r.pick([2, 4, 5, 10, 20, 25, 50]), n = r.int(1, d - 1), m = 100 / d; return num(n * m, [`Make the denominator 100: multiply top and bottom by ${m}.`, `${n}/${d} = ${n * m}/100.`, `So ${n}/${d} = ${n * m}%.`], { q: `Write ${n}/${d} as a percent.`, expr: `${n}/${d}*100` }); }
  if (v === 2) { const p = r.int(1, 99); return num(dec(p / 100), [`${p}% means ${p} out of 100: ${p}/100.`, `${p}/100 = ${dec(p / 100)}.`, `So ${p}% = ${dec(p / 100)}.`], { q: `Write ${p}% as a decimal.`, expr: `${p}/100` }); }
  if (v === 3) { const p = r.int(1, 99); return num(p, [`${dec(p / 100)} = ${p}/100.`, `${p} out of 100 is ${p}%.`, `So ${dec(p / 100)} = ${p}%.`], { q: `Write ${dec(p / 100)} as a percent.`, expr: `${p / 100}*100` }); }
  const k = r.int(1, 99);
  return num(k, [`The grid has 100 squares, so each square is 1%.`, `${k} squares are shaded: ${k}%.`, `So ${k}% is shaded.`], { q: `A grid of 100 equal squares has ${k} shaded. What percent is shaded?`, expr: String(k) });
});
skill('5-pct-compare', 5, 'Percents', 'Compare percents, fractions and decimals', ['Change everything to percents (or everything to decimals) before comparing.', '3/4 = 75% and 0.6 = 60%.'], (r) => {
  const v = r.int(0, 3), FR = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [3, 20], [9, 20], [7, 25], [11, 50]];
  const pc = ([n, d]) => n * 100 / d;
  if (v === 0) { const f = r.pick(FR), P = pc(f), p = r.bool(0.15) ? P : Math.max(1, Math.min(99, P + r.nonzero(-15, 15))); return signMC(r, p, P, { q: `Which sign makes this true? ${p}% ? ${f[0]}/${f[1]}`, steps: [`${f[0]}/${f[1]} = ${P}/100 = ${P}%.`, `Compare ${p}% and ${P}%.`, `So ${p}% ${cmp(p, P)} ${f[0]}/${f[1]}.`] }); }
  if (v === 1) { const p = r.int(1, 99), q = r.bool(0.15) ? p : r.int(1, 99), d = dec(q / 100); return signMC(r, p, q, { q: `Which sign makes this true? ${p}% ? ${d}`, steps: [`${d} = ${q}/100 = ${q}%.`, `Compare ${p}% and ${q}%.`, `So ${p}% ${cmp(p, q)} ${d}.`] }); }
  if (v === 2) {
    const A = r.pick(NAMES); let B = r.pick(NAMES); while (B === A) B = r.pick(NAMES);
    const f = r.pick(FR), P = pc(f); let p = r.int(5, 19) * 5; if (p === P) p += 5;
    const right = P > p ? A : B;
    return mc(r, right, [right === A ? B : A], { q: `On a quiz, ${A} got ${f[0]}/${f[1]} of the questions right. ${B} got ${p}% right. Who did better?`, steps: [`${f[0]}/${f[1]} = ${P}%.`, `${P}% ${P > p ? '>' : '<'} ${p}%, so ${right} did better.`] });
  }
  const f = r.pick(FR), lab = new Map([[pc(f), `${f[0]}/${f[1]}`]]);
  while (lab.size < 3) { const x = r.int(1, 99); if (!lab.has(x)) lab.set(x, lab.size === 1 ? `${x}%` : dec(x / 100)); }
  return orderMC(r, [...lab.keys()], (x) => lab.get(x), r.bool(), { steps: [`As percents: ${[...lab.entries()].map(([x, s]) => `${s} = ${x}%`).join(', ')}.`] });
});

// ───────────── 37. Patterns and sequences ─────────────
skill('5-pat-shapes', 5, 'Patterns', 'Repeating and growing patterns', GEO45.LESSONS.shapepat, GEO45.shapePat);
skill('5-pat-rule', 5, 'Patterns', 'Number patterns and rules', ['Find the rule: how does each number change to the next?', 'Adding the same amount each time is an arithmetic pattern; multiplying by the same number is a geometric one.'], (r) => {
  const v = r.int(0, 5), a = r.int(1, 30), s = r.int(2, 15), nm = r.pick(NAMES);
  if (v === 0) { const k = r.int(5, 10); return num(a + (k - 1) * s, [`The 1st number is ${a}. Each step adds ${s}.`, `The ${k}th number is ${a} + ${k - 1} × ${s} = ${a + (k - 1) * s}.`, `So the answer is ${a + (k - 1) * s}.`], { q: `A pattern starts at ${a} and adds ${s} each time. What is number ${k} in the pattern?`, expr: `${a}+${k - 1}*${s}` }); }
  if (v === 1) { const t = [0, 1, 2, 3, 4].map((i) => a + i * s); return num(t[2], [`The rule is add ${s}: ${t[1]} − ${t[0]} = ${s}.`, `${t[1]} + ${s} = ${t[2]}.`, `So the missing number is ${t[2]}.`], { q: `What is the missing number? ${t[0]}, ${t[1]}, ?, ${t[3]}, ${t[4]}`, expr: `${t[1]}+${s}` }); }
  if (v === 2) { const m = r.int(2, 5), b = r.int(1, 5), t = [0, 1, 2, 3].map((i) => b * m ** i); return num(b * m ** 4, [`Each number is ${m} times the one before.`, `${t[3]} × ${m} = ${b * m ** 4}.`, `So the next number is ${b * m ** 4}.`], { q: `What comes next? ${t.map(comma).join(', ')}, ?`, expr: `${t[3]}*${m}` }); }
  if (v === 3) { const k = r.int(5, 12); return num(a + (k - 1) * s, [`Each week ${nm} saves $${s} more than the week before.`, `Week ${k}: ${a} + ${k - 1} × ${s} = ${a + (k - 1) * s}.`, `So ${nm} saves $${a + (k - 1) * s} in week ${k}.`], { q: `${nm} saves $${a} in week 1, and each week saves $${s} more than the week before. How many dollars does ${nm} save in week ${k}?`, expr: `${a}+${k - 1}*${s}` }); }
  if (v === 4) {
    const t = [0, 1, 2, 3, 4].map((i) => a + i * s), j = r.int(1, 4), bad = t[j] + r.nonzero(-3, 3), shown = t.map((x, i) => (i === j ? bad : x));
    if (new Set(shown).size < 5) shown[j] = t[j] + 1;
    return mc(r, String(shown[j]), shown.filter((_, i) => i !== j).map(String).slice(0, 3), { q: `The rule is "add ${s}". Which number does not fit? ${shown.join(', ')}`, steps: [`Start at ${t[0]} and add ${s}: ${t.join(', ')}.`, `${shown[j]} should be ${t[j]}.`] });
  }
  const p = r.int(2, 5), m = r.int(2, 4), k = r.int(3, 6);
  return num(m, [`Pattern A: ${[1, 2, 3, 4].map((i) => i * p).join(', ')}. Pattern B: ${[1, 2, 3, 4].map((i) => i * p * m).join(', ')}.`, `Each number in B is ${m} times the matching number in A, e.g. ${k * p} × ${m} = ${k * p * m}.`, `So the answer is ${m}.`], { q: `Pattern A starts at 0 and adds ${p} each time. Pattern B starts at 0 and adds ${p * m} each time. Each number in B is how many times the matching number in A?`, expr: `${p * m}/${p}` });
});
skill('5-pat-frac', 5, 'Patterns', 'Sequences with fractions', ['A fraction pattern can add the same fraction each time: 1/4, 1/2, 3/4, 1, …', 'Or divide by the same number: 8, 4, 2, 1, 1/2, …'], (r) => {
  const v = r.int(0, 2);
  if (v === 0 || v === 2) {
    const d = r.pick([2, 3, 4, 5, 6, 8, 10]), a = r.int(1, d), s = r.int(1, d - 1), t = [0, 1, 2, 3, 4].map((i) => mixed(a + i * s, d));
    if (v === 0) return num(mixed(a + 5 * s, d), [`Each step adds ${frac(s, d)}.`, `${t[4]} + ${frac(s, d)} = ${mixed(a + 5 * s, d)}.`, `So the next number is ${mixed(a + 5 * s, d)}.`], { q: `What comes next? ${t.join(', ')}, ?`, expr: `(${a}+5*${s})/${d}` });
    return num(t[2], [`Each step adds ${frac(s, d)}: ${t[1]} − ${t[0]} = ${frac(s, d)}.`, `${t[1]} + ${frac(s, d)} = ${t[2]}.`, `So the missing number is ${t[2]}.`], { q: `What is the missing number? ${t[0]}, ${t[1]}, ?, ${t[3]}, ${t[4]}`, expr: `(${a}+2*${s})/${d}` });
  }
  const q = r.pick([2, 3, 4]), top = r.int(2, 4), t = [0, 1, 2, 3].map((i) => frac(q ** top, q ** i)), nx = frac(q ** top, q ** 4);
  return num(nx, [`Each number is the one before divided by ${q}.`, `${t[3]} ÷ ${q} = ${nx}.`, `So the next number is ${nx}.`], { q: `What comes next? ${t.join(', ')}, ?`, expr: `${q ** top}/${q ** 4}` });
});

// ───────────── 38. Integers ─────────────
skill('5-int', 5, 'Integers', 'Understand integers', ['Integers are whole numbers and their opposites: …, −2, −1, 0, 1, 2, …', 'On a number line, numbers to the right are greater. −3 is less than −1.'], (r) => {
  const v = r.int(0, 4), k = r.int(1, 40);
  if (v === 0) {
    const [t, val] = r.pick([[`${k} m below sea level`, -k], [`a loss of $${k}`, -k], [`${k} degrees below zero`, -k], [`a gain of ${k} points`, k], [`${k} floors above the ground`, k], [`${k} m above sea level`, k], [`a withdrawal of $${k}`, -k]]);
    return num(val, [val < 0 ? `"Below", "loss" and "withdrawal" mean less than zero, so the integer is negative.` : `"Above" and "gain" mean more than zero, so the integer is positive.`, `So ${t} is ${neg(val)}.`], { q: `Which integer stands for ${t}?`, expr: String(val) });
  }
  if (v === 1) { const n = r.nonzero(-10, 10); return num(-n, [St(`The opposite of a number is the same distance from 0 on the other side.`, numberLine(-10, 10, { marks: [n, -n] })), St(`${neg(n)} is ${Math.abs(n)} from 0, so its opposite is ${neg(-n)}.`), St(`The answer is ${neg(-n)}.`)], { q: `What is the opposite of ${neg(n)}?`, visual: numberLine(-10, 10, { marks: [n] }), expr: String(-n) }); }
  if (v === 2) { const a = r.int(-20, 20), b = r.bool(0.1) ? a : r.int(-20, 20); return signMC(r, a, b, { q: `Which sign makes this true? ${neg(a)} ? ${neg(b)}`, steps: [`On a number line, the number further right is greater.`, `So ${neg(a)} ${cmp(a, b)} ${neg(b)}.`] }); }
  if (v === 3) { const set = new Set(); while (set.size < 3) set.add(r.int(-15, 15)); return orderMC(r, [...set], neg, r.bool(), { steps: ['Picture a number line: negative numbers are on the left, and −10 is further left than −2.'] }); }
  const n = 2 * r.int(-10, 9) + 1;
  return num(n, [`The labels go up by 2. The dot is halfway between ${neg(n - 1)} and ${neg(n + 1)}.`, `So the dot is at ${neg(n)}.`], { q: 'What integer is shown by the dot on the number line?', visual: numberLine(-20, 20, { marks: [n] }), expr: String(n) });
});

// ───────────── 39. Coordinate plane ─────────────
const Q = (x, y) => (x > 0 ? (y > 0 ? 'Quadrant I' : 'Quadrant IV') : y > 0 ? 'Quadrant II' : 'Quadrant III');
const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
skill('5-coord-quad', 5, 'Coordinate plane', 'All four quadrants', ['A point (x, y): x tells how far right (+) or left (−); y tells how far up (+) or down (−).', 'The axes cross at the origin (0, 0) and split the plane into four quadrants, numbered I to IV going anticlockwise from the top right.'], (r) => {
  const v = r.int(0, 3), x = r.nonzero(-6, 6), y = r.nonzero(-6, 6);
  if (v === 0) return mc(r, Q(x, y), ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'].filter((s) => s !== Q(x, y)), { q: `Which quadrant is the point ${pt(x, y)} in?`, visual: { type: 'plane', points: [[x, y]], range: 6 }, steps: [`x is ${x > 0 ? 'positive (right)' : 'negative (left)'} and y is ${y > 0 ? 'positive (up)' : 'negative (down)'}.`, `So ${pt(x, y)} is in ${Q(x, y)}.`] });
  if (v === 1) return mc(r, pt(x, y), [pt(y, x), pt(-x, y), pt(x, -y)].filter((s) => s !== pt(x, y)), { q: 'What are the coordinates of point A?', visual: { type: 'plane', points: [[x, y, 'A']], range: 6 }, steps: [`From the origin, go ${Math.abs(x)} ${x > 0 ? 'right' : 'left'} and ${Math.abs(y)} ${y > 0 ? 'up' : 'down'}.`, `So A is at ${pt(x, y)}.`] });
  if (v === 2) {
    const ps = [[x, y], [-x, y], [x, -y], [-x, -y]], L = r.shuffle(['A', 'B', 'C', 'D']), k = r.int(0, 3);
    return mc(r, L[k], L.filter((_, i) => i !== k), { q: `Which point is at ${pt(...ps[k])}?`, visual: { type: 'plane', points: ps.map((p, i) => [p[0], p[1], L[i]]), range: 6 }, steps: [`Go ${Math.abs(ps[k][0])} ${ps[k][0] > 0 ? 'right' : 'left'} and ${Math.abs(ps[k][1])} ${ps[k][1] > 0 ? 'up' : 'down'}.`, `That is point ${L[k]}.`] });
  }
  const onX = r.bool(), p = onX ? pt(x, 0) : pt(0, y), right = onX ? 'The x-axis' : 'The y-axis';
  return mc(r, right, ['The x-axis', 'The y-axis', 'Quadrant I'].filter((s) => s !== right), { q: `Where is the point ${p}?`, visual: { type: 'plane', points: [onX ? [x, 0] : [0, y]], range: 6 }, steps: [onX ? 'Its y-coordinate is 0, so it has not moved up or down.' : 'Its x-coordinate is 0, so it has not moved left or right.', `So it lies on ${right.toLowerCase()}.`] });
});
skill('5-coord-table', 5, 'Coordinate plane', 'Tables, rules and maps on a grid', ['A rule like y = x + 2 turns each x into a y; each pair (x, y) is a point.', 'On a map grid, count units across or up to find a distance.'], (r) => {
  const v = r.int(0, 3), k = r.int(1, 4);
  if (v === 0) {
    const mul = r.bool(), f = (x) => (mul ? k * x : x + k), xs = [0, 1, 2, 3, r.int(4, 9)], rule = mul ? `y = ${k} × x` : `y = x + ${k}`;
    return num(f(xs[4]), [`The rule is ${rule}.`, `For x = ${xs[4]}: y = ${mul ? `${k} × ${xs[4]}` : `${xs[4]} + ${k}`} = ${f(xs[4])}.`, `So the missing y is ${f(xs[4])}.`], { q: `Use the rule ${rule} to complete the table. What is the missing y?`, visual: { type: 'table', head: ['x', 'y'], rows: xs.map((x, i) => [x, i < 4 ? f(x) : '?']) }, expr: mul ? `${k}*${xs[4]}` : `${xs[4]}+${k}` });
  }
  if (v === 1) {
    const x = r.int(0, 5), y = r.int(0, 5), a = r.int(1, 4), b = r.int(1, 4), up = r.bool(), ny = up ? y + b : y - b, fy = ny < 0 ? y + b : ny, dir = ny < 0 || up ? 'up' : 'down';
    return mc(r, pt(x + a, fy), [pt(x - a < 0 ? x + a + 1 : x - a, fy), pt(fy, x + a), pt(x + a, dir === 'up' ? y - b < 0 ? fy + 1 : y - b : y + b)].filter((s) => s !== pt(x + a, fy)), { q: `Start at (${x}, ${y}). Move ${a} unit${a > 1 ? 's' : ''} right and ${b} unit${b > 1 ? 's' : ''} ${dir}. Where are you now?`, steps: [`Right adds to x: ${x} + ${a} = ${x + a}.`, `${dir === 'up' ? 'Up adds to' : 'Down takes away from'} y: ${fy}. So you are at ${pt(x + a, fy)}.`] });
  }
  if (v === 2) {
    const y = r.int(0, 9), x1 = r.int(0, 4), x2 = r.int(5, 9), [p1, p2] = r.shuffle(['the school', 'the library', 'the park', 'the arena']), vert = r.bool();
    const A = vert ? `(${y}, ${x1})` : `(${x1}, ${y})`, B = vert ? `(${y}, ${x2})` : `(${x2}, ${y})`;
    return num(x2 - x1, [`Both points have the same ${vert ? 'x' : 'y'}-coordinate, so count along the ${vert ? 'y' : 'x'}-axis.`, `${x2} − ${x1} = ${x2 - x1}.`, `So they are ${x2 - x1} units apart.`], { q: `On a town map grid, ${p1} is at ${A} and ${p2} is at ${B}. How many units apart are they?`, expr: `${x2}-${x1}` });
  }
  const b = r.int(1, 3), pts = [0, 1, 2, 3].map((x) => [x, x + b]), right = `y = x + ${b}`;
  return mc(r, right, [`y = x + ${b + 1}`, `y = ${b + 1} × x`, `y = x − ${b}`], { q: 'Which rule matches the points on the graph?', visual: { type: 'plane', points: pts, range: 6 }, steps: [`The points are ${pts.map(([x, y]) => `(${x}, ${y})`).join(', ')}.`, `Each y is ${b} more than x, so the rule is ${right}.`] });
});

// ───────────── 40. Variable expressions ─────────────
skill('5-varexpr', 5, 'Variable expressions', 'Write and evaluate variable expressions', ['A variable is a letter that stands for a number.', '"5 more than n" is n + 5; "3 times n" is 3n; "n divided by 4" is n ÷ 4.'], (r) => {
  const v = r.int(0, 3), k = r.int(2, 12);
  if (v === 0) {
    const F = [[`${k} more than n`, `n + ${k}`], [`${k} less than n`, `n − ${k}`], [`${k} times n`, `${k}n`], [`n divided by ${k}`, `n ÷ ${k}`], [`n subtracted from ${k}`, `${k} − n`]], i = r.int(0, 4);
    return mc(r, F[i][1], r.shuffle(F.filter((_, j) => j !== i).map((f) => f[1])).slice(0, 3), { q: `Which expression means "${F[i][0]}"?`, steps: [`Read the words carefully: ${F[i][0]}.`, `So it is ${F[i][1]}.`] });
  }
  if (v === 1) {
    const a = r.int(2, 9), b = r.int(1, 20), x = r.int(2, 12), t = r.int(0, 1);
    const [e, val, w] = t === 0 ? [`${a}x + ${b}`, a * x + b, `${a} × ${x} + ${b} = ${a * x} + ${b}`] : [`${a}(x + ${b})`, a * (x + b), `${a} × (${x} + ${b}) = ${a} × ${x + b}`];
    return num(val, [`Put ${x} in place of x.`, `${w} = ${val}.`, `So the value is ${val}.`], { q: `Find the value of ${e} when x = ${x}.`, expr: String(val) });
  }
  if (v === 2) return mc(r, `${k} × t`, [`${k} + t`, `t ÷ ${k}`, `t − ${k}`], { q: `Tickets cost $${k} each. Which expression shows the cost, in dollars, of t tickets?`, steps: [`Each ticket is $${k}, and there are t tickets.`, `So the cost is ${k} × t.`] });
  const a = r.int(3, 6), b = r.int(2, 4), km = r.int(3, 20);
  return num(a + b * km, [`Cost = ${a} + ${b} × k, where k is the number of kilometres.`, `${a} + ${b} × ${km} = ${a} + ${b * km} = ${a + b * km}.`, `So the ride costs $${a + b * km}.`], { q: `A taxi charges $${a} plus $${b} for each kilometre. How many dollars does a ${km} km ride cost?`, expr: `${a}+${b}*${km}` });
});

// ───────────── 41. One-variable equations ─────────────
skill('5-eq-solve', 5, 'Equations', 'Solve one-step equations', ['Do the opposite operation to both sides to get x on its own.', 'Check by putting your answer back into the equation.'], (r) => {
  const v = r.int(0, 3), x = r.int(2, 30), a = r.int(2, 12);
  const [e, b, op, back] = [[`x + ${a}`, x + a, `− ${a}`, `${x + a} − ${a}`], [`x − ${a}`, x - a, `+ ${a}`, `${x - a} + ${a}`], [`${a}x`, a * x, `÷ ${a}`, `${a * x} ÷ ${a}`], [`x ÷ ${a}`, x / a, `× ${a}`, `${x / a} × ${a}`]][v];
  if (v === 3 && x % a) return num(a * Math.max(2, Math.floor(x / a)), [`Multiply both sides by ${a}.`, `x = ${Math.max(2, Math.floor(x / a))} × ${a} = ${a * Math.max(2, Math.floor(x / a))}.`, `So x = ${a * Math.max(2, Math.floor(x / a))}.`], { q: `Solve: x ÷ ${a} = ${Math.max(2, Math.floor(x / a))}`, expr: `${Math.max(2, Math.floor(x / a))}*${a}` });
  const lines = [{ eq: `${e} = ${b}` }, { eq: `x = ${back}`, note: `${op} on both sides` }, { eq: `x = ${x}` }];
  return num(x, [St(`To get x alone, undo it: ${op} on both sides.`, eqnLines(lines.slice(0, 2))), St(`x = ${back} = ${x}.`, eqnLines(lines)), St(`Check: put ${x} back in and it works. So x = ${x}.`)], { q: `Solve: ${e} = ${b}`, expr: back.replace('−', '-').replace('÷', '/').replace('×', '*') });
});
skill('5-eq-check', 5, 'Equations', 'Write and check equations', ['A value is a solution if it makes both sides equal.', 'To write an equation from a story, let a letter stand for the unknown.'], (r) => {
  const v = r.int(0, 3), x = r.int(2, 15), a = r.int(2, 9), nm = r.pick(NAMES);
  if (v === 0) { const t = r.bool() ? x : x + r.nonzero(-3, 3), ok = t * a + 1 === x * a + 1; return yesNo(r, ok, { q: `Is x = ${t} a solution of ${a}x + 1 = ${a * x + 1}?`, steps: [`Put ${t} in for x: ${a} × ${t} + 1 = ${a * t + 1}.`, `${a * t + 1} ${ok ? '=' : '≠'} ${a * x + 1}, so the answer is ${ok ? 'yes' : 'no'}.`] }); }
  if (v === 1) return mc(r, String(x), near(r, x, 3).map(String), { q: `Which value of n makes this true? n + ${a * 3} = ${x + a * 3}`, steps: [`n = ${x + a * 3} − ${a * 3}.`, `So n = ${x}.`] });
  if (v === 2) { const F = [[`A number plus ${a} is ${x + a}.`, `n + ${a} = ${x + a}`], [`${a} times a number is ${a * x}.`, `${a} × n = ${a * x}`], [`A number minus ${a} is ${x}.`, `n − ${a} = ${x}`]], i = r.int(0, 2); return mc(r, F[i][1], [`n − ${a} = ${x + a}`, `${a} × n = ${x + a}`, `n + ${x} = ${a}`, `n + ${a} = ${a * x}`].filter((s) => s !== F[i][1]).slice(0, 3), { q: `Which equation matches? ${F[i][0]}`, steps: ['Let n stand for the number.', `So the equation is ${F[i][1]}.`] }); }
  const b = x + a;
  return mc(r, `s + ${a} = ${b}`, [`s − ${a} = ${b}`, `${a} × s = ${b}`, `s + ${b} = ${a}`], { q: `${nm} had some stickers, s, and was given ${a} more. Now ${nm} has ${b}. Which equation matches?`, steps: [`Start with s, then add ${a}: s + ${a}.`, `That equals ${b}: s + ${a} = ${b}.`] });
});

// ───────────── 42. One-variable inequalities ─────────────
skill('5-ineq', 5, 'Inequalities', 'Inequalities', ['x > 3 means x is greater than 3; x < 3 means less than 3.', 'On a number line, an open circle means the number itself is not included.'], (r) => {
  const v = r.int(0, 3), a = r.int(2, 12), b = r.int(a + 2, a + 15), gt = r.bool(), s = gt ? '>' : '<', lim = b - a;
  if (v === 0) { const t = r.int(Math.max(0, lim - 4), lim + 4), ok = gt ? t + a > b : t + a < b; return yesNo(r, ok, { q: `Is x = ${t} a solution of x + ${a} ${s} ${b}?`, steps: [`Put ${t} in for x: ${t} + ${a} = ${t + a}.`, `Is ${t + a} ${s} ${b}? ${ok ? 'Yes' : 'No'}.`] }); }
  if (v === 1) { const good = gt ? lim + r.int(1, 3) : lim - r.int(1, Math.min(3, lim)), bad = gt ? [lim, lim - 1, lim - 2] : [lim, lim + 1, lim + 2]; return mc(r, String(good), bad.filter((x) => x >= 0).map(String), { q: `Which value of x makes this true? x + ${a} ${s} ${b}`, steps: [`x + ${a} ${s} ${b} means x ${s} ${lim}.`, `${good} ${s} ${lim}, so x = ${good} works.`] }); }
  if (v === 2) { const right = `x ${s} ${a}`; return mc(r, right, [`x ${gt ? '<' : '>'} ${a}`, `x ${s} ${a + 1}`, `x = ${a}`], { q: 'Which inequality does the number line show?', visual: { type: 'numberline', from: a - 5, to: a + 5, step: 1, ray: { at: a, dir: gt ? 'right' : 'left', open: true } }, steps: [`An open circle means ${a} is not included. Shading to the ${gt ? 'right' : 'left'} means ${gt ? 'greater' : 'less'} than ${a}.`, `So it shows ${right}.`] }); }
  const right = `x ${s} ${lim}`;
  return mc(r, right, [`x ${s} ${b + a}`, `x ${gt ? '<' : '>'} ${lim}`, `x ${s} ${b}`], { q: `Solve: x + ${a} ${s} ${b}`, steps: [`Subtract ${a} from both sides: x ${s} ${b} − ${a}.`, `So ${right}.`] });
});

// ───────────── 43. Data and graphs ─────────────
const CATS = [['Favourite sport', ['Hockey', 'Soccer', 'Swimming', 'Basketball', 'Skiing']], ['Favourite fruit', ['Apples', 'Bananas', 'Grapes', 'Mangoes', 'Pears']], ['Pets in our class', ['Dogs', 'Cats', 'Fish', 'Birds', 'Rabbits']], ['Books read', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']]];
skill('5-data-bar', 5, 'Data and graphs', 'Read bar graphs', ['Read the height of each bar against the scale.', 'To compare, subtract. To find a total, add.'], (r) => {
  const v = r.int(0, 4), [title, labs] = r.pick(CATS), n = r.int(4, 5), L = labs.slice(0, n), vals = []; while (vals.length < n) { const x = r.int(1, 15) * r.pick([1, 2, 5]); if (!vals.includes(x)) vals.push(x); }
  const g = { type: 'bars', labels: L, values: vals, title }, i = r.int(0, n - 1); let j = r.int(0, n - 1); while (j === i) j = r.int(0, n - 1);
  if (v === 0) return num(vals[i], [`Find the ${L[i]} bar and read across to the scale.`, `The bar for ${L[i]} reaches ${vals[i]}.`], { q: `Look at the bar graph. What is the value for ${L[i]}?`, visual: g, expr: String(vals[i]) });
  if (v === 1) { const [hi, lo] = vals[i] >= vals[j] ? [i, j] : [j, i]; return num(vals[hi] - vals[lo], [`${L[hi]}: ${vals[hi]}. ${L[lo]}: ${vals[lo]}.`, `${vals[hi]} − ${vals[lo]} = ${vals[hi] - vals[lo]}.`, `So the difference is ${vals[hi] - vals[lo]}.`], { q: `Look at the bar graph. How many more for ${L[hi]} than for ${L[lo]}?`, visual: g, expr: `${vals[hi]}-${vals[lo]}` }); }
  if (v === 2) { const tot = vals.reduce((a, b) => a + b, 0); return num(tot, [`Read every bar: ${vals.join(', ')}.`, `${vals.join(' + ')} = ${tot}.`, `So the total is ${tot}.`], { q: 'Look at the bar graph. What is the total of all the bars?', visual: g, expr: vals.join('+') }); }
  if (v === 3) { const mx = Math.max(...vals); if (vals.filter((x) => x === mx).length > 1) vals[i] = mx + 1; const m2 = Math.max(...vals), k = vals.indexOf(m2); return mc(r, L[k], L.filter((_, q) => q !== k).slice(0, 3), { q: 'Look at the bar graph. Which has the greatest value?', visual: { ...g, values: vals }, steps: [`The tallest bar is ${L[k]}, at ${m2}.`, `So the answer is ${L[k]}.`] }); }
  let k = r.int(0, n - 1); while (k === i || k === j) k = r.int(0, n - 1);
  const ans = vals[i] + vals[j] - vals[k];
  return num(ans, [`${L[i]} + ${L[j]} = ${vals[i]} + ${vals[j]} = ${vals[i] + vals[j]}.`, `${vals[i] + vals[j]} − ${vals[k]} = ${ans}.`, `So the answer is ${ans}.`], { q: `Look at the bar graph. What is ${L[i]} and ${L[j]} together, minus ${L[k]}?`, visual: g, expr: `${vals[i]}+${vals[j]}-${vals[k]}` });
});
skill('5-data-table', 5, 'Data and graphs', 'Tables, frequency tables and pictographs', ['A frequency table shows how many times each answer was given.', 'In a pictograph, use the key: if each ★ = 4, then ★★★ = 12.', 'Relative frequency is a part out of the total, like 6/30.'], (r) => {
  const v = r.int(0, 4), [title, labs] = r.pick(CATS.slice(0, 3)), n = 4, L = labs.slice(0, n), f = L.map(() => r.int(2, 20)), tot = f.reduce((a, b) => a + b, 0);
  const T = { type: 'table', head: [title, 'Frequency'], rows: L.map((l, i) => [l, f[i]]) }, i = r.int(0, n - 1); let j = r.int(0, n - 1); while (j === i) j = r.int(0, n - 1);
  if (v === 0) return num(tot, [`Add the frequencies: ${f.join(' + ')}.`, `The total is ${tot}.`], { q: 'How many answers are there in all?', visual: T, expr: f.join('+') });
  if (v === 1) { const [hi, lo] = f[i] >= f[j] ? [i, j] : [j, i]; return num(f[hi] - f[lo], [`${L[hi]}: ${f[hi]}. ${L[lo]}: ${f[lo]}.`, `${f[hi]} − ${f[lo]} = ${f[hi] - f[lo]}.`, `So the answer is ${f[hi] - f[lo]}.`], { q: `How many more chose ${L[hi]} than ${L[lo]}?`, visual: T, expr: `${f[hi]}-${f[lo]}` }); }
  if (v === 2) return num(`${f[i]}/${tot}`, [`Total: ${f.join(' + ')} = ${tot}.`, `${L[i]}: ${f[i]} out of ${tot}, so ${f[i]}/${tot}.`], { q: `What fraction of all the answers were ${L[i]}?`, visual: T, expr: `${f[i]}/${tot}` });
  if (v === 3) {
    const key = r.pick([2, 3, 4, 5, 10]), days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], stars = days.map(() => r.int(1, 6)), d = r.int(0, 4);
    return num(stars[d] * key, [`Each ★ stands for ${key} books. ${days[d]} has ${stars[d]} ★.`, `${stars[d]} × ${key} = ${stars[d] * key}.`, `So ${stars[d] * key} books were read on ${days[d]}.`], { q: `In this pictograph, each ★ = ${key} books. How many books were read on ${days[d]}?`, visual: { type: 'table', head: ['Day', 'Books read'], rows: days.map((dd, q) => [dd, '★'.repeat(stars[q])]) }, expr: `${stars[d]}*${key}` });
  }
  const g4 = L.map(() => r.int(3, 20)), g5 = L.map(() => r.int(3, 20)); if (g5[i] === g4[i]) g5[i]++;
  const [hi, lo, nh] = g5[i] > g4[i] ? [g5[i], g4[i], 'Grade 5'] : [g4[i], g5[i], 'Grade 4'];
  return num(hi - lo, [`${L[i]}: Grade 4 has ${g4[i]} and Grade 5 has ${g5[i]}.`, `${hi} − ${lo} = ${hi - lo}.`, `So ${hi - lo} more students in ${nh} chose ${L[i]}.`], { q: `How many more students in ${nh} than in the other grade chose ${L[i]}?`, visual: { type: 'table', head: [title, 'Grade 4', 'Grade 5'], rows: L.map((l, q) => [l, g4[q], g5[q]]) }, expr: `${hi}-${lo}` });
});
skill('5-data-graphs', 5, 'Data and graphs', 'Stem-and-leaf plots, Venn diagrams and choosing graphs', ['In a stem-and-leaf plot, the stem is the tens digit and each leaf is a ones digit: 3 | 5 means 35.', 'Line graphs show change over time; bar graphs compare groups; circle graphs show parts of a whole.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const data = Array.from({ length: r.int(8, 12) }, () => r.int(12, 69)).sort((a, b) => a - b), stems = [...new Set(data.map((x) => Math.floor(x / 10)))];
    const T = { type: 'table', head: ['Stem', 'Leaf'], rows: stems.map((s) => [s, data.filter((x) => Math.floor(x / 10) === s).map((x) => x % 10).join(' ')]) }, k = r.int(0, 2);
    if (k === 0) return num(data.length, ['Each leaf is one value.', `Count the leaves: there are ${data.length}.`], { q: 'How many values are in this stem-and-leaf plot?', visual: T, expr: String(data.length) });
    if (k === 1) return num(data.at(-1), [`The greatest value is in the last row, with the biggest leaf.`, `${Math.floor(data.at(-1) / 10)} | ${data.at(-1) % 10} means ${data.at(-1)}.`], { q: 'What is the greatest value in this stem-and-leaf plot?', visual: T, expr: String(data.at(-1)) });
    const cut = r.pick(stems) * 10, c = data.filter((x) => x >= cut).length;
    return num(c, [`Values of ${cut} or more have a stem of ${cut / 10} or more.`, `Count those leaves: ${c}.`], { q: `How many values are ${cut} or more?`, visual: T, expr: String(c) });
  }
  if (v === 1) { const S = [['how the temperature changed over a week', 'Line graph'], ['the favourite colours of students in a class', 'Bar graph'], ['what part of a budget is spent on each thing', 'Circle graph'], ['how a puppy\'s mass changed month by month', 'Line graph'], ['the number of medals won by four countries', 'Bar graph'], ['what fraction of a day is spent sleeping, at school and playing', 'Circle graph']], [what, right] = r.pick(S); return mc(r, right, ['Line graph', 'Bar graph', 'Circle graph'].filter((x) => x !== right), { q: `Which type of graph is best to show ${what}?`, steps: ['Line graphs show change over time, bar graphs compare groups, and circle graphs show parts of a whole.', `So a ${right.toLowerCase()} is best.`] }); }
  if (v === 2) {
    const both = r.int(2, 8), a = both + r.int(3, 10), b = both + r.int(3, 10), none = r.int(1, 6), tot = a + b - both + none;
    return num(both, [`Students who like at least one sport: ${tot} − ${none} = ${tot - none}.`, `${a} + ${b} = ${a + b}, which counts the "both" students twice: ${a + b} − ${tot - none} = ${both}.`, `So ${both} students like both.`], { q: `In a class of ${tot}, ${a} like hockey, ${b} like soccer and ${none} like neither. How many like both? (Think of a Venn diagram.)`, expr: `${a}+${b}-(${tot}-${none})` });
  }
  if (v === 3) {
    const M = ['Mar', 'Apr', 'May', 'Jun', 'Jul'], t = [r.int(-5, 5)]; for (let i = 1; i < 5; i++) t.push(t[i - 1] + r.int(1, 8));
    const rises = t.slice(1).map((x, i) => x - t[i]), mx = Math.max(...rises); if (rises.filter((x) => x === mx).length > 1) { t[4] = t[3] + mx + 1; rises[3] = mx + 1; }
    const k = rises.indexOf(Math.max(...rises)), opts = rises.map((_, i) => `${M[i]} to ${M[i + 1]}`);
    return mc(r, opts[k], opts.filter((_, i) => i !== k), { q: 'The table shows the average temperature each month. Between which two months did it rise the most?', visual: { type: 'table', head: ['Month', ...M], rows: [['Temperature (°C)', ...t.map(neg)]] }, steps: [`Rises: ${rises.map((x, i) => `${opts[i]}: ${x}°`).join(', ')}.`, `The biggest rise is ${opts[k]}.`] });
  }
  const n = r.int(2, 12) * 4, part = r.pick([['half', 2], ['a quarter', 4]]);
  return num(n / part[1], [`A circle graph shows parts of a whole. ${part[0][0].toUpperCase() + part[0].slice(1)} of the students walk.`, `${n} ÷ ${part[1]} = ${n / part[1]}.`, `So ${n / part[1]} students walk.`], { q: `A circle graph shows how ${n} students get to school. The "walk" part is ${part[0]} of the circle. How many students walk?`, expr: `${n}/${part[1]}` });
});

// ───────────── 44. Probability ─────────────
skill('5-prob', 5, 'Probability', 'Probability', ['Probability tells how likely something is, from impossible (0) to certain (1).', 'Probability = favourable outcomes ÷ all possible outcomes.'], (r) => {
  const v = r.int(0, 4), red = r.int(0, 8), blue = r.int(0, 8) || (red ? 0 : 3), tot = red + blue || 1;
  if (v === 0) { const R = red === 0 ? 'Impossible' : blue === 0 ? 'Certain' : red < blue ? 'Unlikely' : red > blue ? 'Likely' : 'Equally likely as not'; return mc(r, R, ['Impossible', 'Unlikely', 'Equally likely as not', 'Likely', 'Certain'].filter((x) => x !== R).slice(0, 3), { q: `A bag has ${red} red and ${blue} blue marbles. How likely is it to pick a red marble without looking?`, steps: [`Red: ${red}. Blue: ${blue}.`, `So picking red is ${R.toLowerCase()}.`] }); }
  if (v === 1) { const g = r.int(1, 6), b = r.int(1, 6), y = r.int(1, 6), t = g + b + y; return num(`${g}/${t}`, [`There are ${g} + ${b} + ${y} = ${t} cubes, and ${g} are green.`, `So the probability is ${g}/${t}.`], { q: `A bag has ${g} green, ${b} blue and ${y} yellow cubes. What is the probability of picking a green cube?`, expr: `${g}/${t}` }); }
  if (v === 2) { const k = r.int(3, 6), m = r.int(2, 6), [A, B] = r.pick([[`a spinner with ${k} equal colours`, 'a coin'], [`a spinner with ${k} equal colours`, `a number cube numbered 1 to ${m}`]]), bn = B === 'a coin' ? 2 : m; return num(k * bn, [`The first has ${k} outcomes and the second has ${bn}.`, `Each of the ${k} can go with each of the ${bn}: ${k} × ${bn} = ${k * bn}.`, `So there are ${k * bn} outcomes.`], { q: `You spin ${A} and also use ${B}. How many different outcomes are possible?`, expr: `${k}*${bn}` }); }
  if (v === 3) { const b = r.pick([2, 3, 4, 5, 6, 10]), a = r.int(1, b - 1), N = b * r.int(4, 20); return num(N * a / b, [`The probability is ${a}/${b}, so expect ${a} out of every ${b} tries.`, `${N} ÷ ${b} = ${N / b}, and ${N / b} × ${a} = ${N * a / b}.`, `So expect about ${N * a / b}.`], { q: `The chance of landing on blue is ${a}/${b}. If you spin ${N} times, how many times would you expect blue?`, expr: `${N}*${a}/${b}` }); }
  const h = r.int(5, 25), t = r.int(5, 25);
  return num(`${h}/${h + t}`, [`The coin was flipped ${h} + ${t} = ${h + t} times.`, `Heads came up ${h} times, so the experimental probability is ${h}/${h + t}.`], { q: 'The table shows the results of flipping a coin. What is the experimental probability of heads?', visual: { type: 'table', head: ['Outcome', 'Times'], rows: [['Heads', h], ['Tails', t]] }, expr: `${h}/${h + t}` });
});

// ───────────── 45. Statistics ─────────────
skill('5-stats-mean', 5, 'Statistics', 'Find the mean', ['The mean is the total shared equally: add the values, then divide by how many there are.', 'Missing value: mean × count = total, then subtract the values you know.'], (r) => {
  const v = r.int(0, 2), n = r.int(4, 6), m = r.int(5, 40); let xs = Array.from({ length: n - 1 }, () => m + r.int(-6, 6)); xs.push(m * n - xs.reduce((a, b) => a + b, 0)); if (xs.at(-1) < 0) xs = Array(n).fill(m);
  const tot = m * n;
  if (v === 0) return num(m, [`Add: ${xs.join(' + ')} = ${tot}.`, `Divide by ${n}: ${tot} ÷ ${n} = ${m}.`, `So the mean is ${m}.`], { q: `What is the mean of ${xs.join(', ')}?`, expr: `(${xs.join('+')})/${n}` });
  if (v === 1) { const known = xs.slice(0, -1), miss = xs.at(-1), s = known.reduce((a, b) => a + b, 0); return num(miss, [`The total must be ${m} × ${n} = ${tot}.`, `The known values add to ${s}. ${tot} − ${s} = ${miss}.`, `So the missing value is ${miss}.`], { q: `The mean of ${n} numbers is ${m}. Four of them are ${known.join(', ')}${n > 5 ? '' : ''}. What is the missing number?`.replace('Four', ['', '', '', 'Three', 'Four', 'Five'][n - 1]), expr: `${m}*${n}-(${known.join('+')})` }); }
  const L = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].slice(0, n);
  return num(m, [`Read the bars: ${xs.join(', ')}. Total: ${tot}.`, `${tot} ÷ ${n} = ${m}.`, `So the mean is ${m}.`], { q: 'The bar graph shows how many laps a swimmer did each day. What is the mean number of laps?', visual: { type: 'bars', labels: L, values: xs, title: 'Laps swum' }, expr: `(${xs.join('+')})/${n}` });
});
skill('5-stats-mmm', 5, 'Statistics', 'Median, mode, range and samples', ['Median: the middle value when the values are in order.', 'Mode: the value that appears most often. Range: greatest − least.', 'A fair sample is chosen so that every group has a chance to be picked.'], (r) => {
  const v = r.int(0, 3), xs = r.shuffle(Array.from({ length: 50 }, (_, i) => i + 1)).slice(0, 2 * r.int(2, 4) + 1), s = [...xs].sort((a, b) => a - b);
  if (v === 0) { const med = s[(s.length - 1) / 2]; return num(med, [`In order: ${s.join(', ')}.`, `The middle one of ${s.length} values is number ${(s.length + 1) / 2}: ${med}.`, `So the median is ${med}.`], { q: `What is the median of ${xs.join(', ')}?`, expr: String(med) }); }
  if (v === 1) { const mo = r.pick(xs), ys = r.shuffle([...xs.filter((x) => x !== mo), mo, mo, mo]); return num(mo, [`Count how often each value appears.`, `${mo} appears ${ys.filter((x) => x === mo).length} times, more than any other.`, `So the mode is ${mo}.`], { q: `What is the mode of ${ys.join(', ')}?`, expr: String(mo) }); }
  if (v === 2) return num(s.at(-1) - s[0], [`Greatest: ${s.at(-1)}. Least: ${s[0]}.`, `${s.at(-1)} − ${s[0]} = ${s.at(-1) - s[0]}.`, `So the range is ${s.at(-1) - s[0]}.`], { q: `What is the range of ${xs.join(', ')}?`, expr: `${s.at(-1)}-${s[0]}` });
  const S = [['what students at a school want for lunch', 'Ask 50 students picked at random from every grade', ['Ask the 10 students on the hockey team', 'Ask only the Grade 1 class', 'Ask students who bring a lunch from home']], ['how people in a town get to work', 'Ask 100 adults picked at random from across the town', ['Ask people waiting at one bus stop', 'Ask the people who work at a bike shop', 'Ask only people who own a car']], ['the favourite sport of students in Grade 5', 'Ask every fifth student on a list of all Grade 5 students', ['Ask students leaving the swimming pool', 'Ask the soccer club', 'Ask your three best friends']]], [topic, fair, biased] = r.pick(S);
  return mc(r, fair, biased, { q: `You want to find out ${topic}. Which sample is fair (not biased)?`, steps: ['A biased sample leaves out groups or picks people likely to give one answer.', `The fair one is: ${fair.toLowerCase()}.`] });
});

// ───────────── 46. Units of measurement ─────────────
skill('5-units-choose', 5, 'Units of measurement', 'Choose metric units and temperatures', ['Length: mm (tiny), cm (small), m (a room), km (a trip).', 'Mass: g (light), kg (heavy). Capacity: mL (a spoonful), L (a jug). Water freezes at 0 °C.'], (r) => {
  const v = r.int(0, 3);
  const SETS = [[['an ant', 'mm'], ['a pencil', 'cm'], ['a classroom', 'm'], ['a highway between two cities', 'km'], ['a grain of rice', 'mm'], ['a book', 'cm'], ['a swimming pool', 'm'], ['a bike trail', 'km']], [['a paper clip', 'g'], ['a bag of potatoes', 'kg'], ['an apple', 'g'], ['a dog', 'kg'], ['a pencil', 'g'], ['a bicycle', 'kg']], [['a teaspoon of medicine', 'mL'], ['a bathtub', 'L'], ['a juice box', 'mL'], ['a bucket', 'L'], ['a glass of milk', 'mL'], ['a fish tank', 'L']]];
  if (v < 3) {
    const [thing, u] = r.pick(SETS[v]), units = [['mm', 'cm', 'm', 'km'], ['g', 'kg'], ['mL', 'L']][v], word = ['length', 'mass', 'capacity'][v];
    return mc(r, u, units.filter((x) => x !== u), { q: `Which unit is best for the ${word} of ${thing}?`, steps: [`Think about how big ${thing} is.`, `The best unit is ${u}.`] });
  }
  const T = [['a hot summer day in Toronto', '30 °C'], ['a cold winter day in Winnipeg', '−20 °C'], ['a cup of hot chocolate', '60 °C'], ['a comfortable classroom', '21 °C'], ['a glass of ice water', '0 °C'], ['a cool fall day in Halifax', '10 °C']], [what, t] = r.pick(T);
  return mc(r, t, r.shuffle(T.filter((x) => x[1] !== t).map((x) => x[1])).slice(0, 3), { q: `Which is the most reasonable temperature for ${what}?`, steps: ['Remember: water freezes at 0 °C and boils at 100 °C; a warm room is about 20 °C.', `${what[0].toUpperCase() + what.slice(1)} is about ${t}.`] });
});
skill('5-units-convert', 5, 'Units of measurement', 'Convert metric units', ['1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm; 1 kg = 1000 g; 1 L = 1000 mL.', 'Big unit to small unit: multiply. Small unit to big unit: divide.'], (r) => {
  const v = r.int(0, 3), C = [['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['m', 'mm', 1000], ['kg', 'g', 1000], ['L', 'mL', 1000]];
  const [B, S, k] = v === 1 ? C[4] : v === 2 ? C[5] : r.pick(C.slice(0, 4)), x = r.bool(0.4) ? dec(r.int(11, 99) / 10) : String(r.int(2, 25)), y = dec(Number(x) * k);
  if (v === 3) { const big = r.int(2, 9), small = big * k + r.pick([-k / 2, 0, k / 2]) * (k >= 100 ? 1 : 0) + r.nonzero(-3, 3) * (k / 10); return signMC(r, big * k, small, { q: `Which sign makes this true? ${big} ${B} ? ${comma(small)} ${S}`, steps: [`${big} ${B} = ${big} × ${comma(k)} = ${comma(big * k)} ${S}.`, `Compare ${comma(big * k)} and ${comma(small)}.`, `So ${big} ${B} ${cmp(big * k, small)} ${comma(small)} ${S}.`] }); }
  return r.bool()
    ? num(y, [`1 ${B} = ${comma(k)} ${S}. Big to small: multiply.`, `${x} × ${comma(k)} = ${comma(Number(y))}.`, `So ${x} ${B} = ${comma(Number(y))} ${S}.`], { q: `${x} ${B} = how many ${S}?`, expr: `${x}*${k}` })
    : num(x, [`1 ${B} = ${comma(k)} ${S}. Small to big: divide.`, `${comma(Number(y))} ÷ ${comma(k)} = ${x}.`, `So ${comma(Number(y))} ${S} = ${x} ${B}.`], { q: `${comma(Number(y))} ${S} = how many ${B}?`, expr: `${y}/${k}` });
});

// ───────────── 47. Lines and angles ─────────────
skill('5-angles', 5, 'Lines and angles', 'Lines and angles', GEO45.LESSONS.lines, (r) => GEO45.linesAngles(r, 5));

// ───────────── 48. Two-dimensional figures ─────────────
skill('5-polygons', 5, 'Two-dimensional figures', 'Polygons and circles', GEO45.LESSONS.polygons5, (r) => GEO45.polygons(r, 5));

// ───────────── 49. Triangles and quadrilaterals ─────────────
skill('5-triangles', 5, 'Triangles and quadrilaterals', 'Classify triangles', GEO45.LESSONS.triangles5, (r) => GEO45.triangles(r, 5));
skill('5-quads', 5, 'Triangles and quadrilaterals', 'Classify quadrilaterals', GEO45.LESSONS.quads5, (r) => GEO45.quads(r, 5));

// ───────────── 50. Symmetry and transformations ─────────────
skill('5-symmetry', 5, 'Symmetry and transformations', 'Symmetry and transformations', GEO45.LESSONS.symmetry5, (r) => GEO45.symmetry(r, 5));

// ───────────── 51. Three-dimensional figures ─────────────
skill('5-3d', 5, 'Three-dimensional figures', '3D figures', GEO45.LESSONS.solids, (r) => GEO45.solids(r, 5));

// ───────────── 52. Perimeter and area ─────────────
skill('5-perim', 5, 'Perimeter and area', 'Perimeter', GEO45.LESSONS.perimeter, (r) => GEO45.perimeter(r, 5));
skill('5-area', 5, 'Perimeter and area', 'Area of rectangles, parallelograms and triangles', GEO45.LESSONS.area5, (r) => GEO45.area(r, 5));

// ───────────── 53. Volume and surface area ─────────────
skill('5-surface', 5, 'Volume and surface area', 'Volume and surface area of prisms', GEO45.LESSONS.surface, GEO45.surface5);

// ───────────── 54. Financial literacy ─────────────
skill('5-fin-budget', 5, 'Financial literacy', 'Budgets and financial records', ['A budget plans money coming in (income) and going out (expenses).', 'Balance = income − expenses. In a record, add deposits and subtract withdrawals.'], (r) => {
  const v = r.int(0, 2), nm = r.pick(NAMES);
  if (v === 0) {
    const inc = r.int(8, 20) * 10, ex = [['Snacks', r.int(1, 4) * 5], ['Bus fare', r.int(2, 6) * 5], ['Gifts', r.int(1, 5) * 5]], spent = ex.reduce((a, b) => a + b[1], 0);
    return num(inc - spent, [`Expenses: ${ex.map((e) => `$${e[1]}`).join(' + ')} = $${spent}.`, `Income − expenses: $${inc} − $${spent} = $${inc - spent}.`, `So $${inc - spent} is left to save.`], { q: `${nm} earns $${inc} a month. How many dollars are left to save after the expenses in the table?`, visual: { type: 'table', head: ['Expense', 'Amount'], rows: ex.map((e) => [e[0], `$${e[1]}`]) }, expr: `${inc}-${spent}` });
  }
  if (v === 1) {
    const start = r.int(10, 60) * 5, rows = [['Start', '', '', `$${start}`]]; let bal = start;
    for (let i = 0; i < 3; i++) { const dep = r.bool(), amt = r.int(1, 8) * 5; if (!dep && amt > bal) { bal += amt; rows.push(['Birthday gift', `$${amt}`, '', '']); continue; } bal += dep ? amt : -amt; rows.push([dep ? r.pick(['Allowance', 'Dog walking', 'Lemonade stand']) : r.pick(['Movie', 'Book', 'Snacks']), dep ? `$${amt}` : '', dep ? '' : `$${amt}`, '']); }
    rows.push(['End', '', '', '?']);
    return num(bal, ['Start with the first balance. Add each deposit and subtract each withdrawal.', `The final balance is $${bal}.`], { q: `Use ${nm}'s money record. What is the balance at the end, in dollars?`, visual: { type: 'table', head: ['Item', 'Deposit', 'Withdrawal', 'Balance'], rows }, expr: String(bal) });
  }
  const inc = r.int(10, 30) * 10, plan = r.int(5, 15) * 10, goal = plan + r.int(1, 5) * 10, fun = r.int(3, 10) * 10;
  return num(goal - plan, [`${nm} wants to save $${goal} but the budget saves $${plan}.`, `$${goal} − $${plan} = $${goal - plan}.`, `So ${nm} must spend $${goal - plan} less on fun.`], { q: `${nm}'s budget: income $${inc}, savings $${plan}, fun $${fun}. To save $${goal} instead, how many dollars less must ${nm} spend on fun?`, expr: `${goal}-${plan}` });
});
skill('5-fin-pay', 5, 'Financial literacy', 'Ways to pay', ['Cash is money you hold. A debit card takes money straight from your bank account.', 'A credit card borrows money that you must pay back later, sometimes with interest.'], (r) => {
  const S = [['takes money straight out of your bank account', 'Debit card'], ['lets you borrow money that you pay back later', 'Credit card'], ['is paper money and coins', 'Cash'], ['may charge interest if you do not pay the full amount on time', 'Credit card'], ['can be lost or stolen and cannot be replaced', 'Cash'], ['only lets you spend money you already have in the bank', 'Debit card']], [d, right] = r.pick(S);
  return mc(r, right, ['Cash', 'Debit card', 'Credit card'].filter((x) => x !== right), { q: `Which way to pay ${d}?`, steps: ['Cash: money in hand. Debit: from your bank account now. Credit: borrowed, paid back later.', `So the answer is ${right.toLowerCase()}.`] });
});

export default list;
