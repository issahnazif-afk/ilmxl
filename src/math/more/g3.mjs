// Grade 3 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const words = (n) => {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` ${words(n % 100)}` : ''}`;
  return `${words(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${words(n % 1000)}` : ''}`;
};
const ordSuffix = (n) => (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[n % 10] ?? 'th');
const ord = (n) => `${n}${ordSuffix(n)}`;
const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const romanParts = (n) => { const out = []; for (const [v, s] of ROMAN) while (n >= v) { out.push([v, s]); n -= v; } return out; };
const roman = (n) => romanParts(n).map((p) => p[1]).join('');
const money = (c) => `$${(c / 100).toFixed(2)}`;
const two = (r) => { const [a, b] = r.shuffle(NAMES); return [a, b]; };
const sign = (a, b) => (a > b ? '>' : a < b ? '<' : '=');
const signQ = (r, left, right, a, b, steps) => { const s = sign(a, b); return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `${left} ? ${right}`, say: `Which sign goes between ${left} and ${right}?`, steps }); };
const digitsOf = (n) => String(n).split('').map(Number);
const expandParts = (n) => String(n).split('').map((d, i, s) => Number(d) * 10 ** (s.length - 1 - i)).filter((x) => x > 0);
const expanded = (n) => expandParts(n).map(comma).join(' + ');
const placeOf = (n, k) => Math.floor(n / 10 ** k) % 10;
const pu = (n, w) => `${n} ${n === 1 ? w : `${w}s`}`;
const an = (w) => `${/^[aeiou]/i.test(w) ? 'an' : 'a'} ${w}`;
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const tf = (r, ok, q, steps) => mc(r, ok ? 'True' : 'False', [ok ? 'False' : 'True'], { q, steps });
// an input/output table with the last output missing
const ioTable = (ins, f) => ({ type: 'table', head: ['Input', 'Output'], rows: ins.map((x, i) => [comma(x), i < ins.length - 1 ? comma(f(x)) : '?']) });
// a different number with the same number of digits, changed in one place
const tweak = (r, n) => { const s = String(n).split(''); const k = r.int(0, s.length - 1); let d = r.int(0, 9); while (String(d) === s[k] || (k === 0 && d === 0)) d = r.int(0, 9); s[k] = String(d); return Number(s.join('')); };
const firstDiff = (a, b) => { const A = String(a), B = String(b); for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) return A.length - 1 - i; return -1; };
const distinctDigits = (r, k) => { const ds = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k); if (ds[0] === 0) [ds[0], ds[1]] = [ds[1], ds[0]]; return Number(ds.join('')); };

// ───────────── Numbers ─────────────
skill('3-numline', 3, 'Numbers', 'Number lines to 1000', ['On a number line, each mark is the same jump from the one before.', 'Find the size of one jump, then count from a labelled mark.'], (r) => {
  if (r.bool(0.65)) {
    const step = r.pick([5, 10]), L = r.int(0, step === 5 ? 8 : 6) * 100, k = r.int(1, 20) * 2 - 1, v = L + k * step;
    const NL = numberLine(L, L + 40 * step, { step, marks: [v] });
    return num(v, [St(`Each small mark is a jump of ${step}. Only every second mark has a number.`, NL), St(`The dot is one mark past ${v - step}: ${v - step} + ${step} = ${v}.`), St(`So the dot is at ${v}.`)], { q: 'What number is at the dot?', visual: NL, expr: `${L}+${k}*${step}` });
  }
  const n = r.int(1, 8) * 100 + r.int(1, 99), lo = Math.floor(n / 100) * 100;
  const opt = (a) => `Between ${a} and ${a + 100}`;
  return mc(r, opt(lo), [opt(lo >= 100 ? lo - 100 : lo + 200), opt(lo + 100), opt(lo + 300 <= 900 ? lo + 300 : lo - 200)], { q: `A number line from 0 to 1000 has a mark at every hundred. Where does ${n} go?`, steps: [St(`${n} has ${Math.floor(n / 100)} hundreds, so it is more than ${lo}.`, numberLine(0, 1000, { step: 100, marks: [n] })), `It is less than ${lo + 100}, so it goes between ${lo} and ${lo + 100}.`] });
});
skill('3-numwords', 3, 'Numbers', 'Numbers in words and ordinals', ['Read a big number in chunks: first the thousands, then the rest.', '34 125 is "thirty-four thousand one hundred twenty-five".', 'Ordinal numbers tell position: 1st, 2nd, 3rd, 4th.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.bool() ? r.int(101, 999) : r.int(1001, 99999);
    const rev = Number(String(n).split('').reverse().join(''));
    return mc(r, words(n), [words(tweak(r, n)), words(tweak(r, n)), words(rev > 0 && rev !== n ? rev : n + 10)], { q: `Which words name ${comma(n)}?`, steps: [n >= 1000 ? `Thousands: ${Math.floor(n / 1000)} thousand is "${words(Math.floor(n / 1000))} thousand".` : `Hundreds: ${Math.floor(n / 100)} hundred is "${words(Math.floor(n / 100))} hundred".`, `So ${comma(n)} is "${words(n)}".`] });
  }
  if (v === 1) {
    const n = r.bool() ? r.int(101, 999) : r.int(1001, 99999);
    return num(n, [n >= 1000 ? `"${words(Math.floor(n / 1000))} thousand" is ${comma(Math.floor(n / 1000) * 1000)}.` : `"${words(Math.floor(n / 100))} hundred" is ${Math.floor(n / 100) * 100}.`, `Put the parts together: ${expanded(n)} = ${comma(n)}.`, `So the number is ${comma(n)}.`], { q: `Write the number: ${words(n)}.`, expr: String(n) });
  }
  if (v === 2) {
    const n = r.int(2, 100), who = r.pick(NAMES);
    return num(n - 1, [`Being ${ord(n)} means ${n - 1} people come before.`, `So ${n - 1} people are ahead.`, `The answer is ${n - 1}.`], { q: `${who} is ${ord(n)} in a line. How many people are ahead of ${who}?`, expr: `${n}-1` });
  }
  const n = r.int(11, 100), right = ord(n);
  return mc(r, right, ['st', 'nd', 'rd', 'th'].map((s) => `${n}${s}`).filter((x) => x !== right), { q: `How do we write the position number ${n} as an ordinal?`, steps: [n % 100 >= 11 && n % 100 <= 13 ? `Numbers ending in 11, 12 or 13 use "th".` : `Look at the last digit, ${n % 10}: ${n % 10 === 1 ? '1 uses "st"' : n % 10 === 2 ? '2 uses "nd"' : n % 10 === 3 ? '3 uses "rd"' : 'it uses "th"'}.`, `So we write ${right}.`] });
});
skill('3-numclues', 3, 'Numbers', 'Roman numerals, even and odd, and number clues', ['Roman numerals: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.', 'A smaller numeral before a bigger one is taken away: IV = 4.', 'Even numbers end in 0, 2, 4, 6 or 8.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0 || v === 1) {
    const n = r.bool(0.7) ? r.int(1, 100) : r.int(101, 2000);
    const groups = [];
    for (const [val, s] of romanParts(n)) { const g = groups.at(-1); if (g && g.unit === val) { g.v += val; g.s += s; } else groups.push({ v: val, s, unit: s.length === 1 ? val : -1 }); }
    const how = groups.map((g) => `${g.s} = ${g.v}`).join(', ');
    if (v === 0) return txt(roman(n), [`Split ${n} into parts: ${groups.map((g) => g.v).join(' + ')}.`, `Write each part: ${how}.`, `So ${n} is ${roman(n)}.`], { q: `Write ${n} in Roman numerals.` });
    return num(n, [`Split ${roman(n)} into parts: ${how}.`, `Add: ${groups.map((g) => g.v).join(' + ')} = ${n}.`, `So ${roman(n)} is ${n}.`], { q: `What number is ${roman(n)}?`, expr: groups.map((g) => g.v).join('+') });
  }
  if (v === 2) {
    const n = r.int(100, 99999), right = n % 2 ? 'Odd' : 'Even';
    return mc(r, right, [right === 'Odd' ? 'Even' : 'Odd'], { q: `Is ${comma(n)} even or odd?`, steps: [`Only the ones digit matters: ${n % 10}.`, `${n % 10} is ${right.toLowerCase()}, so ${comma(n)} is ${right.toLowerCase()}.`] });
  }
  const t = r.int(1, 9), o = r.int(0, 9), d = t - o, s = t + o, n = 10 * t + o;
  const clue = d === 0 ? 'My two digits are the same.' : d > 0 ? `My tens digit is ${d} more than my ones digit.` : `My ones digit is ${-d} more than my tens digit.`;
  return num(n, [`The digits add to ${s}. ${d === 0 ? 'They are the same' : `They are ${Math.abs(d)} apart`}.`, `Tens ${t} and ones ${o} fit both clues: ${t} + ${o} = ${s}.`, `So I am ${n}.`], { q: `I am a two-digit number. ${clue} My digits add up to ${s}. What number am I?`, expr: String(n) });
});

// ───────────── Comparing and ordering ─────────────
skill('3-compare', 3, 'Comparing and ordering', 'Compare numbers to 100 000', ['A number with more digits is greater.', 'With the same number of digits, compare from the left until the digits are different.'], (r) => {
  const big = r.bool(), a = big ? r.int(1000, 99999) : r.int(100, 999);
  const b = r.bool(0.12) ? a : r.bool(0.8) ? tweak(r, a) : big ? r.int(1000, 99999) : r.int(100, 999);
  const A = String(a), B = String(b), k = firstDiff(a, b);
  const steps = a === b ? [`Every digit is the same.`, `So ${comma(a)} = ${comma(b)}.`]
    : A.length !== B.length ? [`${comma(a)} has ${A.length} digits and ${comma(b)} has ${B.length} digits.`, `More digits means greater, so ${comma(a)} ${sign(a, b)} ${comma(b)}.`]
      : [k < A.length - 1 ? `Start on the left. The digits match until the ${PLACE[k]} place.` : `Start on the left: the ${PLACE[k]} digits are different.`, `${cap(PLACE[k])}: ${placeOf(a, k)} and ${placeOf(b, k)}.`, `So ${comma(a)} ${sign(a, b)} ${comma(b)}.`];
  return signQ(r, comma(a), comma(b), a, b, steps);
});
skill('3-order', 3, 'Comparing and ordering', 'Order numbers and find the greatest', ['To order numbers, compare them two at a time from the left digit.', 'Least to greatest starts with the smallest number.'], (r) => {
  const big = r.bool(), base = big ? r.int(10, 96) * 1000 : r.int(1, 8) * 100;
  const ns = new Set(); while (ns.size < 4) ns.add(base + (big ? r.int(0, 2999) : r.int(0, 199)));
  const nums = [...ns], asc = [...nums].sort((x, y) => x - y);
  if (r.bool()) {
    const up = r.bool(), right = (up ? asc : [...asc].reverse()).map(comma).join(', ');
    const wrongs = [nums.map(comma).join(', '), (up ? [...asc].reverse() : asc).map(comma).join(', '), (up ? [asc[1], asc[0], asc[2], asc[3]] : [asc[3], asc[1], asc[2], asc[0]]).map(comma).join(', ')];
    return mc(r, right, wrongs, { q: `Put these numbers in order from ${up ? 'least to greatest' : 'greatest to least'}: ${r.shuffle(nums).map(comma).join(', ')}.`, steps: [`The least is ${comma(asc[0])} and the greatest is ${comma(asc[3])}.`, `Compare the middle two: ${comma(asc[1])} < ${comma(asc[2])}.`, `Order: ${right}.`] });
  }
  const names = r.shuffle(NAMES).slice(0, 4), most = r.bool();
  const pick = most ? asc[3] : asc[0], who = names[nums.indexOf(pick)];
  const thing = big ? r.pick(['steps walked in a week', 'points in a video game']) : r.pick(['pages read this month', 'stickers collected']);
  return mc(r, who, names.filter((x) => x !== who), { q: `Who has the ${most ? 'greatest' : 'least'} number of ${thing}?`, visual: { type: 'table', head: ['Name', 'Number'], rows: names.map((nm, i) => [nm, comma(nums[i])]) }, steps: [`Compare the numbers from the left digit.`, `The ${most ? 'greatest' : 'least'} is ${comma(pick)}.`, `So ${who} has the ${most ? 'most' : 'fewest'}.`] });
});
skill('3-largest', 3, 'Comparing and ordering', 'Make the largest or smallest number', ['For the largest number, put the biggest digit in the highest place.', 'For the smallest, put the smallest digit first, but never 0 at the front.'], (r) => {
  if (r.bool(0.7)) {
    const k = r.int(3, 5), ds = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k), large = r.bool();
    const sorted = [...ds].sort((x, y) => (large ? y - x : x - y));
    if (!large && sorted[0] === 0) [sorted[0], sorted[1]] = [sorted[1], sorted[0]];
    const n = Number(sorted.join(''));
    return num(n, [large ? 'Biggest digit first, then the next biggest, and so on.' : `Smallest digit first${ds.includes(0) ? '. A number cannot start with 0, so start with the smallest digit that is not 0, then the 0' : ''}.`, `The digits in order: ${sorted.join(', ')}.`, `So the ${large ? 'largest' : 'smallest'} number is ${comma(n)}.`], { q: `Use each digit once: ${r.shuffle(ds).join(', ')}. What is the ${large ? 'largest' : 'smallest'} number you can make?`, expr: String(n) });
  }
  const [a, b, c] = r.shuffle(NAMES).slice(0, 3), thing = r.pick(['marbles', 'books', 'stickers', 'shells']), few = r.bool();
  return mc(r, few ? c : a, [a, b, c].filter((x) => x !== (few ? c : a)), { q: `${a} has more ${thing} than ${b}. ${b} has more ${thing} than ${c}. Who has the ${few ? 'fewest' : 'most'}?`, steps: [`Order them from most to fewest: ${a}, ${b}, ${c}.`, `So ${few ? c : a} has the ${few ? 'fewest' : 'most'}.`] });
});

// ───────────── Place value: up to hundreds ─────────────
skill('3-pv100', 3, 'Place value: up to hundreds', 'Hundreds, tens and ones', ['A three-digit number has hundreds, tens and ones.', 'In 362, the 3 means 300, the 6 means 60 and the 2 means 2.'], (r) => {
  const n = r.int(101, 999), [h, t, o] = digitsOf(n), v = r.int(0, 3);
  if (v === 0) {
    return num(n, [`${h} hundreds = ${h * 100}, ${t} tens = ${t * 10}, ${o} ones = ${o}.`, `${h * 100} + ${t * 10} + ${o} = ${n}.`, `So the model shows ${n}.`], { q: `A model has ${pu(h, 'hundred flat')}, ${pu(t, 'ten rod')} and ${pu(o, 'unit cube')}. What number does it show?`, visual: t + o > 0 ? { type: 'blocks', tens: t, ones: o } : null, expr: `${h}*100+${t}*10+${o}` });
  }
  if (v === 1) {
    const m = distinctDigits(r, 3), k = r.int(0, 2), d = placeOf(m, k);
    return num(d * 10 ** k, [`In ${m}, the digit ${d} is in the ${PLACE[k]} place.`, `${d} ${PLACE[k]} = ${d * 10 ** k}.`, `So its value is ${d * 10 ** k}.`], { q: d ? `What is the value of the digit ${d} in ${m}?` : `What is the value of the ${PLACE[k]} digit in ${m}?`, expr: `${d}*${10 ** k}` });
  }
  if (v === 2) {
    const m = distinctDigits(r, 3), k = r.int(0, 2), d = placeOf(m, k), ds = digitsOf(m);
    return mc(r, PLACE[k], ['ones', 'tens', 'hundreds'].filter((x) => x !== PLACE[k]), { q: `In ${m}, which place is the digit ${d} in?`, steps: [`${m}: ${ds[0]} hundreds, ${ds[1]} tens, ${ds[2]} ones.`, `The ${d} is in the ${PLACE[k]} place.`] });
  }
  if (t === 0) {
    const right = `${h - 1} hundreds, 10 tens, ${o} ones`;
    return mc(r, right, [`${h - 1} hundreds, ${o} tens, 10 ones`, `${h} hundreds, 10 tens, ${o} ones`, `${h - 1} hundreds, 1 ten, ${o} ones`], { q: `Which is another way to make ${n}?`, steps: [`Trade 1 hundred for 10 tens.`, `${(h - 1) * 100} + 100 + ${o} = ${n}, so ${right} works.`] });
  }
  const right = `${h} hundreds, ${t - 1} tens, ${o + 10} ones`;
  return mc(r, right, [`${h} hundreds, ${t} tens, ${o + 10} ones`, `${h > 1 ? h - 1 : h + 1} hundreds, ${t} tens, ${o} ones`, `${h} hundreds, ${t - 1} tens, ${o + 1} ones`], { q: `Which is another way to make ${n}?`, steps: [`Trade 1 ten for 10 ones: ${t} tens becomes ${t - 1} tens, and ${o} ones becomes ${o + 10} ones.`, `${h * 100} + ${(t - 1) * 10} + ${o + 10} = ${n}, so ${right} works.`] });
});
skill('3-expand100', 3, 'Place value: up to hundreds', 'Expanded form and trading places', ['Expanded form shows the value of each digit: 482 = 400 + 80 + 2.', '10 ones make 1 ten, and 10 tens make 1 hundred.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(101, 999), parts = r.shuffle(expandParts(n));
    return num(n, [`Put the parts in order, biggest first: ${expandParts(n).join(' + ')}.`, `Write each digit in its place: ${n}.`, `So the number is ${n}.`], { q: `${parts.join(' + ')} = ?`, expr: parts.join('+') });
  }
  if (v === 1) {
    const n = distinctDigits(r, 3), [h, t, o] = digitsOf(n);
    return mc(r, expanded(n), [`${h} + ${t} + ${o}`, `${h * 100} + ${t} + ${o * 10}`, `${h * 10} + ${t * 100} + ${o}`], { q: `Which is ${n} in expanded form?`, steps: [`${h} hundreds = ${h * 100}, ${t} tens = ${t * 10}, ${o} ones = ${o}.`, `So ${n} = ${expanded(n)}.`] });
  }
  if (v === 2) {
    const h = r.int(1, 9);
    if (r.bool()) return num(h * 10, [`1 hundred is 10 tens.`, `${h} hundreds is ${h} × 10 = ${h * 10} tens.`, `So the answer is ${h * 10}.`], { q: `How many tens are in ${h} hundreds?`, expr: `${h}*10` });
    return num(h, [`10 tens make 1 hundred.`, `${h * 10} tens is ${h * 10} ÷ 10 = ${h} hundreds.`, `So the answer is ${h}.`], { q: `${h * 10} tens = ? hundreds`, expr: `${h * 10}/10` });
  }
  const who = r.pick(NAMES);
  if (r.bool()) {
    const h = r.int(1, 9), t = r.int(0, 9), o = r.int(2, 9), n = h * 100 + t * 10 + o;
    return num(n, [`Boxes: ${h} × 100 = ${h * 100}. Packs: ${t} × 10 = ${t * 10}. Single: ${o}.`, `${h * 100} + ${t * 10} + ${o} = ${n}.`, `So ${who} has ${n} pencils.`], { q: `Pencils come in boxes of 100 and packs of 10. ${who} has ${h} boxes, ${t} packs and ${o} single pencils. How many pencils is that?`, expr: `${h}*100+${t}*10+${o}` });
  }
  const n = r.int(10, 99) * 10;
  return num(n / 10, [`Each pack holds 10 cards.`, `${n} ÷ 10 = ${n / 10}.`, `So ${who} needs ${n / 10} packs.`], { q: `Cards come in packs of 10. ${who} wants exactly ${n} cards. How many packs is that?`, expr: `${n}/10` });
});

// ───────────── Place value: up to ten thousands ─────────────
const PL = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];
skill('3-pv10k', 3, 'Place value: up to ten thousands', 'Place value to ten thousands', ['Five-digit numbers have ten thousands, thousands, hundreds, tens and ones.', 'In 47 251, the 4 is worth 40 000 and the 7 is worth 7000.'], (r) => {
  const n = distinctDigits(r, 5), ds = digitsOf(n), v = r.int(0, 2);
  let k = r.int(0, 4); if (ds[4 - k] === 0) k = (k + 1) % 5;
  const d = ds[4 - k];
  if (v === 0) return mc(r, PL[k], r.shuffle(PL.filter((x) => x !== PL[k])).slice(0, 3), { q: `In ${comma(n)}, which place is the digit ${d} in?`, steps: [`${comma(n)}: ${ds.map((x, i) => `${x} ${PL[4 - i]}`).join(', ')}.`, `The ${d} is in the ${PL[k]} place.`] });
  if (v === 1) return num(d * 10 ** k, [`The ${d} is in the ${PL[k]} place.`, `${d} ${PL[k]} = ${comma(d * 10 ** k)}.`, `So its value is ${comma(d * 10 ** k)}.`], { q: `What is the value of the digit ${d} in ${comma(n)}?`, expr: `${d}*${10 ** k}` });
  const nm = ds.map((x, i) => `${x} ${PL[4 - i]}`).join(', ');
  return num(n, [`${expandParts(n).map(comma).join(' + ')}.`, `Write the digits in order: ${comma(n)}.`, `So the number is ${comma(n)}.`], { q: `What number is ${nm}?`, expr: expandParts(n).join('+') });
});
skill('3-expand10k', 3, 'Place value: up to ten thousands', 'Expanded form to ten thousands', ['Expanded form adds the value of each digit: 30 405 = 30 000 + 400 + 5.', '10 hundreds make 1 thousand; 10 thousands make 1 ten thousand.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(1000, 99999), parts = r.shuffle(expandParts(n));
    return num(n, [`Put the parts in order, biggest first: ${expandParts(n).map(comma).join(' + ')}.`, `Any place with no part gets a 0: ${comma(n)}.`, `So the number is ${comma(n)}.`], { q: `${parts.map(comma).join(' + ')} = ?`, expr: parts.join('+') });
  }
  if (v === 1) {
    const n = distinctDigits(r, r.int(4, 5)), ds = digitsOf(n);
    const shifted = ds.map((x, i) => x * 10 ** (ds.length - 2 - i)).filter((x) => x >= 1).map(comma).join(' + ');
    return mc(r, expanded(n), [ds.filter((x) => x).join(' + '), shifted, expandParts(tweak(r, n)).map(comma).join(' + ')], { q: `Which is ${comma(n)} in expanded form?`, steps: [`Write the value of each digit that is not 0.`, `${comma(n)} = ${expanded(n)}.`] });
  }
  if (v === 2) {
    const k = r.int(2, 9), c = r.int(0, 2);
    if (c === 0) return num(k, [`10 hundreds make 1 thousand.`, `${k * 10} hundreds ÷ 10 = ${k} thousands.`, `So the answer is ${k}.`], { q: `${k * 10} hundreds = ? thousands`, expr: `${k * 10}/10` });
    if (c === 1) return num(k * 100, [`1 thousand is 100 tens.`, `${k} thousands = ${k} × 100 = ${k * 100} tens.`, `So the answer is ${k * 100}.`], { q: `How many tens are in ${k} thousands?`, expr: `${k}*100` });
    return num(k * 10, [`1 ten thousand is 10 thousands.`, `${k} ten thousands = ${k} × 10 = ${k * 10} thousands.`, `So the answer is ${k * 10}.`], { q: `${k} ten thousands = ? thousands`, expr: `${k}*10` });
  }
  const who = r.pick(NAMES), a = r.int(1, 9), b = r.int(0, 9), c = r.int(0, 9), n = a * 1000 + b * 100 + c * 10;
  return num(n, [`${a} × 1000 = ${comma(a * 1000)}, ${b} × 100 = ${b * 100}, ${c} × 10 = ${c * 10}.`, `${comma(a * 1000)} + ${b * 100} + ${c * 10} = ${comma(n)}.`, `So there are ${comma(n)} beads.`], { q: `Beads come in tubs of 1000, bags of 100 and strings of 10. ${who} has ${a} tubs, ${b} bags and ${c} strings. How many beads is that?`, expr: `${a}*1000+${b}*100+${c}*10` });
});

// ── addition and subtraction helpers ──
const hide = (n, k) => { const s = String(n).split(''); s[s.length - 1 - k] = '?'; return s.join(''); };
// a + b = c or a − b = c with one digit hidden in one of the three numbers
function missingDigit(r, a, b, op) {
  const c = op === '+' ? a + b : a - b, which = r.int(0, 2), nums = [a, b, c];
  const n = nums[which], k = r.int(0, String(n).length - 1), d = placeOf(n, k);
  const shown = nums.map((x, i) => (i === which ? hide(x, k) : String(x)));
  const how = which === 2 ? `Work out ${a} ${op} ${b} = ${c}.`
    : which === 0 ? (op === '+' ? `Undo the adding: ${c} − ${b} = ${a}.` : `Undo the subtracting: ${c} + ${b} = ${a}.`)
      : (op === '+' ? `Undo the adding: ${c} − ${a} = ${b}.` : `Work backwards: ${a} − ${c} = ${b}.`);
  return num(d, [how, `The full number is ${n}. Its ${PLACE[k]} digit is ${d}.`, `So the missing digit is ${d}.`], { q: `Find the missing digit: ${shown[0]} ${op} ${shown[1]} = ${shown[2]}`, expr: `Math.floor(${n}/${10 ** k})%10` });
}
const ADD_WORD = [
  (w, a, b) => `${w} read ${a} pages in March and ${b} pages in April. How many pages did ${w} read in all?`,
  (w, a, b) => `A farm has ${a} chickens and ${b} ducks. How many birds is that altogether?`,
  (w, a, b) => `On Saturday ${a} people visited a museum. On Sunday ${b} people visited. How many visitors came over the two days?`,
  (w, a, b) => `${w} biked ${a} m to the park and then ${b} m to the library. How many metres did ${w} bike?`,
];
const SUB_WORD = [
  (w, a, b) => `A library had ${a} books. It lent out ${b} of them. How many books are still on the shelves?`,
  (w, a, b) => `${w} had ${a} stickers and gave away ${b}. How many stickers does ${w} have left?`,
  (w, a, b) => `A school has ${a} students. ${b} of them take the bus. How many do not take the bus?`,
  (w, a, b) => `A hall has ${a} seats. ${b} seats are taken. How many seats are empty?`,
  (w, a, b) => `A pine tree is ${a} cm tall and a maple tree is ${b} cm tall. How much taller is the pine tree, in centimetres?`,
];

// ───────────── Addition: up to three digits ─────────────
skill('3-add3', 3, 'Addition: up to three digits', 'Add three-digit numbers', ['Line up ones, tens and hundreds.', 'Add each place from the right. 10 or more? Carry 1 to the next place.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0 || v === 1) {
    const a = r.int(100, 899), b = r.int(100, 999 - a + (r.bool() ? 200 : 0)), w = r.pick(NAMES);
    return num(a + b, [...columnAdd([a, b]), `So the answer is ${comma(a + b)}.`], { q: v ? r.pick(ADD_WORD)(w, a, b) : `${a} + ${b} = ?`, expr: `${a}+${b}` });
  }
  if (v === 2) {
    const a = r.int(11, 89), b = r.int(11, 99);
    return num(a + b, columnAdd([a, b]), { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
  }
  if (v === 3) {
    const k = r.int(11, 40) * 5, ins = r.shuffle([...Array(40).keys()].map((i) => 100 + i * 10 + r.int(0, 9))).slice(0, 4);
    const last = ins.at(-1);
    return num(last + k, [St(`Find the rule: ${ins[0]} → ${ins[0] + k}. The output is ${k} more than the input.`), `${last} + ${k} = ${last + k}.`, `So the missing output is ${last + k}.`], { q: `The rule is "add ${k}". What is the missing output?`, visual: ioTable(ins, (x) => x + k), expr: `${last}+${k}` });
  }
  const h1 = r.int(1, 4), t1 = r.int(0, 4), o1 = r.int(0, 9), h2 = r.int(1, 4), t2 = r.int(0, 5), o2 = r.int(0, 9);
  const a = h1 * 100 + t1 * 10 + o1, b = h2 * 100 + t2 * 10 + o2, s = a + b;
  return num(s, [`Hundreds: ${h1} + ${h2} = ${h1 + h2}. Tens: ${t1} + ${t2} = ${t1 + t2}. Ones: ${o1} + ${o2} = ${o1 + o2}.`, o1 + o2 >= 10 ? `${o1 + o2} ones is 1 ten and ${o1 + o2 - 10} ones, so trade 10 ones for a ten.` : 'No trading is needed.', `${(h1 + h2) * 100} + ${(t1 + t2) * 10} + ${o1 + o2} = ${s}.`, `So the models show ${s} in all.`], { q: `One model shows ${pu(h1, 'hundred')}, ${pu(t1, 'ten')} and ${pu(o1, 'one')}. Another shows ${pu(h2, 'hundred')}, ${pu(t2, 'ten')} and ${pu(o2, 'one')}. What is the total?`, expr: `${a}+${b}` });
});
skill('3-addmissing', 3, 'Addition: up to three digits', 'Missing numbers in addition', ['A missing addend is found by subtracting: 250 + ? = 400 means 400 − 250.', 'Both sides of = must have the same value.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0 || v === 3) {
    const a = r.int(v ? 11 : 100, v ? 99 : 800), c = r.int(a + 10, 999), x = c - a;
    const q = v ? `? + ${a} = ${c}` : `${a} + ? = ${c}`;
    return num(x, [`The missing number plus ${a} makes ${c}. Subtract to find it.`, `${c} − ${a} = ${x}.`, `So the missing number is ${x}.`], { q, expr: `${c}-${a}` });
  }
  if (v === 1) {
    const a = r.int(20, 499), b = r.int(20, 499), d = r.int(10, Math.min(a + b - 10, 499)), x = a + b - d;
    return num(x, [`Left side: ${a} + ${b} = ${a + b}.`, `The right side must also be ${a + b}: ${d} + ? = ${a + b}, so ? = ${a + b} − ${d} = ${x}.`, `So the missing number is ${x}.`], { q: `${a} + ${b} = ${d} + ?`, expr: `${a}+${b}-${d}` });
  }
  const a = r.int(100, 600), b = r.int(100, 999 - a);
  return missingDigit(r, a, b, '+');
});
skill('3-add3many', 3, 'Addition: up to three digits', 'Add three or more numbers', ['Line up all the numbers by place.', 'Add one place at a time; you may carry more than 1.'], (r) => {
  const k = r.pick([3, 3, 4]), ns = Array.from({ length: k }, () => r.int(k === 4 ? 10 : 100, k === 4 ? 299 : 499)), s = ns.reduce((x, y) => x + y, 0);
  if (r.bool() && k === 3) {
    const w = r.pick(NAMES), [a, b, c] = ns;
    const q = r.pick([`A bakery sold ${a} muffins on Monday, ${b} on Tuesday and ${c} on Wednesday. How many muffins did it sell?`, `${w} counted ${a} red cars, ${b} blue cars and ${c} white cars. How many cars is that?`, `Three classes collected cans: ${a}, ${b} and ${c}. How many cans in all?`]);
    return num(s, [...columnAdd(ns), `So the total is ${comma(s)}.`], { q, expr: ns.join('+') });
  }
  return num(s, columnAdd(ns), { q: `${ns.join(' + ')} = ?`, expr: ns.join('+') });
});

// ───────────── Addition: up to four digits ─────────────
skill('3-add4', 3, 'Addition: up to four digits', 'Add four-digit numbers', ['Line up thousands, hundreds, tens and ones.', 'Add from the right and carry when a place makes 10 or more.'], (r) => {
  const v = r.int(0, 2);
  if (v === 2) {
    const a = r.int(2, 9), b = r.int(2, 9), p = r.pick([10, 100, 1000]);
    return num((a + b) * p, [`Start with the fact: ${a} + ${b} = ${a + b}.`, `${comma(a * p)} + ${comma(b * p)} is ${a + b} ${p === 10 ? 'tens' : p === 100 ? 'hundreds' : 'thousands'} = ${comma((a + b) * p)}.`, `So the answer is ${comma((a + b) * p)}.`], { q: `${a} + ${b} = ${a + b}. So ${comma(a * p)} + ${comma(b * p)} = ?`, expr: `${a * p}+${b * p}` });
  }
  const a = r.int(1000, 6999), b = r.int(v ? 1000 : 100, 9999 - a), w = r.pick(NAMES);
  const q = v ? r.pick([`A stadium had ${comma(a)} fans on Friday and ${comma(b)} fans on Saturday. How many fans came in all?`, `${w}'s family drove ${comma(a)} km last year and ${comma(b)} km this year. How many kilometres is that?`, `A tank holds ${comma(a)} L of water. ${comma(b)} L more is poured in. How many litres are in the tank now?`]) : `${a} + ${b} = ?`;
  return num(a + b, [...columnAdd([a, b]), `So the answer is ${comma(a + b)}.`], { q, expr: `${a}+${b}` });
});
skill('3-add4more', 3, 'Addition: up to four digits', 'Four-digit addition puzzles', ['Add several numbers by lining them all up.', 'For a missing number, subtract what you know from the total.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const ns = Array.from({ length: 3 }, () => r.int(100, 3000)), s = ns.reduce((x, y) => x + y, 0);
    return num(s, columnAdd(ns), { q: `${ns.join(' + ')} = ?`, expr: ns.join('+') });
  }
  if (v === 1) {
    const a = r.int(1000, 6000), c = r.int(a + 100, 9999), bal = r.bool();
    if (bal) { const b = r.int(100, 2000), d = r.int(100, a + b - 100); return num(a + b - d, [`Left side: ${a} + ${b} = ${a + b}.`, `${d} + ? must also be ${a + b}: ${a + b} − ${d} = ${a + b - d}.`, `So the missing number is ${a + b - d}.`], { q: `${a} + ${b} = ${d} + ?`, expr: `${a}+${b}-${d}` }); }
    return num(c - a, [`? is what you add to ${a} to reach ${c}.`, `${c} − ${a} = ${c - a}.`, `So the missing number is ${c - a}.`], { q: `${a} + ? = ${c}`, expr: `${c}-${a}` });
  }
  if (v === 2) {
    const k = r.int(10, 30) * 100 + r.pick([0, 50, 25]), ins = r.shuffle([...Array(30).keys()].map((i) => 1000 + i * 150 + r.int(0, 9))).slice(0, 4), last = ins.at(-1);
    return num(last + k, [`The rule is "add ${comma(k)}".`, `${comma(last)} + ${comma(k)} = ${comma(last + k)}.`, `So the missing output is ${comma(last + k)}.`], { q: `The rule is "add ${comma(k)}". What is the missing output?`, visual: ioTable(ins, (x) => x + k), expr: `${last}+${k}` });
  }
  const a = r.int(1000, 5000), b = r.int(1000, 4999);
  return missingDigit(r, a, b, '+');
});

// ───────────── Subtraction: up to three digits ─────────────
skill('3-sub3', 3, 'Subtraction: up to three digits', 'Subtract three-digit numbers', ['Line up the places and subtract from the right.', 'If the top digit is too small, regroup 1 from the next place.'], (r) => {
  const v = r.int(0, 3), w = r.pick(NAMES);
  if (v === 0 || v === 1) {
    const a = r.int(200, 999), b = r.int(100, a - 10);
    return num(a - b, [...columnSub(a, b), `So the answer is ${a - b}.`], { q: v ? r.pick(SUB_WORD)(w, a, b) : `${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  if (v === 2) {
    const a = r.int(30, 99), b = r.int(11, a - 1);
    return num(a - b, columnSub(a, b), { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  const k = r.int(5, 30) * 5, ins = r.shuffle([...Array(60).keys()].map((i) => 300 + i * 10 + r.int(0, 9))).slice(0, 4), last = ins.at(-1);
  return num(last - k, [`Find the rule: ${ins[0]} → ${ins[0] - k}. The output is ${k} less than the input.`, `${last} − ${k} = ${last - k}.`, `So the missing output is ${last - k}.`], { q: `The rule is "subtract ${k}". What is the missing output?`, visual: ioTable(ins, (x) => x - k), expr: `${last}-${k}` });
});
skill('3-submissing', 3, 'Subtraction: up to three digits', 'Missing numbers in subtraction', ['For ? − 120 = 300, add back: 300 + 120.', 'For 500 − ? = 320, subtract: 500 − 320.'], (r) => {
  const v = r.int(0, 3), a = r.int(200, 999), b = r.int(50, a - 20), c = a - b;
  if (v === 0) return num(b, [`${a} take away the missing number leaves ${c}.`, `${a} − ${c} = ${b}.`, `So the missing number is ${b}.`], { q: `${a} − ? = ${c}`, expr: `${a}-${c}` });
  if (v === 1) return num(a, [`Undo the subtraction by adding back ${b}.`, `${c} + ${b} = ${a}.`, `So the missing number is ${a}.`], { q: `? − ${b} = ${c}`, expr: `${c}+${b}` });
  if (v === 2) { const d = r.int(10, 99); return num(c + d, [`Left side: ${a} − ${b} = ${c}.`, `? − ${d} must also be ${c}, so ? = ${c} + ${d} = ${c + d}.`, `So the missing number is ${c + d}.`], { q: `${a} − ${b} = ? − ${d}`, expr: `${a}-${b}+${d}` }); }
  return missingDigit(r, a, Math.max(100, b), '−');
});

// ───────────── Subtraction: up to four digits ─────────────
skill('3-sub4', 3, 'Subtraction: up to four digits', 'Subtract four-digit numbers', ['Line up the places and subtract from the ones.', 'Regroup across zeros when you need to: 1 thousand = 10 hundreds.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) { const a = r.int(2000, 9999), b = r.int(1000, a - 100); return num(a - b, columnSub(a, b), { q: `${a} − ${b} = ?`, expr: `${a}-${b}` }); }
  if (v === 1) {
    const a = r.int(2000, 9999), b = r.int(500, a - 100), w = r.pick(NAMES);
    const q = r.pick([`A ferry carried ${comma(a)} passengers in June and ${comma(b)} in May. How many more passengers were there in June?`, `${w} needs ${comma(a)} points to win. ${w} has ${comma(b)} points. How many more points are needed?`, `A road is ${comma(a)} m long. ${comma(b)} m has been paved. How many metres are not paved yet?`]);
    return num(a - b, [...columnSub(a, b), `So the answer is ${comma(a - b)}.`], { q, expr: `${a}-${b}` });
  }
  if (v === 2) {
    const a = r.int(5, 9), b = r.int(1, a - 1), p = r.pick([10, 100, 1000]);
    return num((a - b) * p, [`Start with the fact: ${a} − ${b} = ${a - b}.`, `${comma(a * p)} − ${comma(b * p)} is ${a - b} ${p === 10 ? 'tens' : p === 100 ? 'hundreds' : 'thousands'} = ${comma((a - b) * p)}.`, `So the answer is ${comma((a - b) * p)}.`], { q: `${a} − ${b} = ${a - b}. So ${comma(a * p)} − ${comma(b * p)} = ?`, expr: `${a * p}-${b * p}` });
  }
  if (v === 3) {
    const k = r.int(5, 20) * 100, ins = r.shuffle([...Array(30).keys()].map((i) => 3000 + i * 200 + r.int(0, 99))).slice(0, 4), last = ins.at(-1);
    return num(last - k, [`The rule is "subtract ${comma(k)}".`, `${comma(last)} − ${comma(k)} = ${comma(last - k)}.`, `So the missing output is ${comma(last - k)}.`], { q: `The rule is "subtract ${comma(k)}". What is the missing output?`, visual: ioTable(ins, (x) => x - k), expr: `${last}-${k}` });
  }
  if (r.bool()) { const a = r.int(2000, 9999), b = r.int(1000, a - 100); return missingDigit(r, a, b, '−'); }
  const a = r.int(2000, 9999), c = r.int(100, a - 500);
  return num(a - c, [`${a} take away the missing number leaves ${c}.`, `${a} − ${c} = ${a - c}.`, `So the missing number is ${a - c}.`], { q: `${a} − ? = ${c}`, expr: `${a}-${c}` });
});

// ───────────── Mixed operations: addition and subtraction ─────────────
skill('3-addsubword', 3, 'Mixed operations: addition and subtraction', 'Add and subtract: word problems and puzzles', ['Decide what happens: joining means add, taking away or comparing means subtract.', 'For two steps, solve one part at a time.'], (r) => {
  const v = r.int(0, 4), w = r.pick(NAMES);
  if (v === 0) {
    const a = r.int(100, 600), b = r.int(20, 300), c = r.int(20, a + b - 10);
    return num(a + b - c, [`First add what was gained: ${a} + ${b} = ${a + b}.`, `Then subtract what was given away: ${a + b} − ${c} = ${a + b - c}.`, `So ${w} has ${a + b - c} now.`], { q: `${w} had ${a} beads. ${w} bought ${b} more, then used ${c} to make bracelets. How many beads does ${w} have now?`, expr: `${a}+${b}-${c}` });
  }
  if (v === 1) {
    const items = r.shuffle(['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']).slice(0, 4), vals = items.map(() => r.int(25, 350));
    const [i, j] = r.shuffle([0, 1, 2, 3]).slice(0, 2), more = r.bool();
    const head = ['Fruit', 'Number sold'], vis = { type: 'table', head, rows: items.map((it, k) => [it, vals[k]]) };
    if (more) { const [hi, lo] = vals[i] >= vals[j] ? [i, j] : [j, i]; return num(vals[hi] - vals[lo], [`${items[hi]}: ${vals[hi]}. ${items[lo]}: ${vals[lo]}.`, `${vals[hi]} − ${vals[lo]} = ${vals[hi] - vals[lo]}.`, `So ${vals[hi] - vals[lo]} more ${items[hi].toLowerCase()} were sold.`], { q: `How many more ${items[hi].toLowerCase()} than ${items[lo].toLowerCase()} were sold?`, visual: vis, expr: `${vals[hi]}-${vals[lo]}` }); }
    return num(vals[i] + vals[j], [`${items[i]}: ${vals[i]}. ${items[j]}: ${vals[j]}.`, `${vals[i]} + ${vals[j]} = ${vals[i] + vals[j]}.`, `So ${vals[i] + vals[j]} were sold in all.`], { q: `How many ${items[i].toLowerCase()} and ${items[j].toLowerCase()} were sold altogether?`, visual: vis, expr: `${vals[i]}+${vals[j]}` });
  }
  if (v === 2) {
    const a = r.int(100, 500), b = r.int(50, 400), c = r.bool(0.2) ? a + b : a + b + r.nonzero(-40, 40);
    return signQ(r, `${a} + ${b}`, String(c), a + b, c, [`Work out the left side: ${a} + ${b} = ${a + b}.`, `Compare ${a + b} with ${c}: ${a + b} ${sign(a + b, c)} ${c}.`]);
  }
  if (v === 3) {
    const y = r.int(5, 60), x = y + r.int(2, 40), S = x + y, D = x - y, big = r.bool();
    return num(big ? x : y, [`Take the difference away from the sum: ${S} − ${D} = ${S - D}. That is two of the smaller number.`, `Smaller: ${S - D} ÷ 2 = ${y}. Larger: ${y} + ${D} = ${x}.`, `So the ${big ? 'larger' : 'smaller'} number is ${big ? x : y}.`], { q: `Two numbers add up to ${S}. Their difference is ${D}. What is the ${big ? 'larger' : 'smaller'} number?`, expr: big ? `(${S}+${D})/2` : `(${S}-${D})/2` });
  }
  const [p, q2] = two(r), y = r.int(3, 12), d = r.int(2, 8), S = 2 * y + d;
  return num(y, [`If ${p} were not ${d} years older, the ages would add to ${S} − ${d} = ${S - d}.`, `Then both are the same age: ${S - d} ÷ 2 = ${y}.`, `So ${q2} is ${y} years old.`], { q: `${p} is ${d} years older than ${q2}. Their ages add up to ${S}. How old is ${q2}?`, expr: `(${S}-${d})/2` });
});

// ───────────── Addition properties ─────────────
skill('3-addprops', 3, 'Addition properties', 'Properties of addition', ['Changing the order of numbers does not change the sum: 3 + 8 = 8 + 3.', 'Changing the grouping does not change the sum: (2 + 5) + 5 = 2 + (5 + 5).', 'Adding 0 does not change a number.'], (r) => {
  const v = r.int(0, 4), a = r.int(12, 98), b = r.int(12, 98);
  if (v === 0) return mc(r, `${b} + ${a}`, [`${a} − ${b}`, `${a} + ${b + 1}`, `${b} + ${b}`].filter((x) => x !== `${b} + ${a}`), { q: `Which has the same sum as ${a} + ${b}?`, steps: [`Changing the order of the numbers does not change the sum.`, `So ${a} + ${b} = ${b} + ${a}.`] });
  if (v === 1) return num(b, [`Both sides have ${a}. Adding in any order gives the same sum.`, `${a} + ${b} = ${b} + ${a}.`, `So the missing number is ${b}.`], { q: `${a} + ? = ${b} + ${a}`, expr: String(b) });
  if (v === 2) { const c = r.int(2, 30); return r.bool() ? num(b, [`Changing the grouping does not change the sum.`, `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c}).`, `So the missing number is ${b}.`], { q: `(${a} + ${b}) + ${c} = ${a} + (? + ${c})`, expr: String(b) }) : num(0, [`Adding 0 does not change a number.`, `${a} + 0 = ${a}.`, `So the missing number is 0.`], { q: `${a} + ? = ${a}`, expr: '0' }); }
  if (v === 3) {
    const x = r.int(11, 89), round = r.pick([100, 50]), y = round - (x % round) || round, mid = r.int(12, 89);
    const z = x + y;
    return num(x + mid + y, [`Look for a pair that makes a tidy number: ${x} + ${y} = ${z}.`, `Then add the rest: ${z} + ${mid} = ${z + mid}.`, `So ${x} + ${mid} + ${y} = ${z + mid}.`], { q: `Use properties to add: ${x} + ${mid} + ${y} = ?`, expr: `${x}+${mid}+${y}` });
  }
  const p = r.int(100, 999), q2 = r.int(100, 999), sub = r.bool() && p > q2, res = sub ? p - q2 : p + q2, right = res % 2 ? 'Odd' : 'Even';
  const kind = (n) => (n % 2 ? 'odd' : 'even');
  return mc(r, right, [right === 'Odd' ? 'Even' : 'Odd'], { q: `Without working it out, is ${p} ${sub ? '−' : '+'} ${q2} even or odd?`, steps: [`${p} is ${kind(p)} and ${q2} is ${kind(q2)}.`, kind(p) === kind(q2) ? `Two ${kind(p)} numbers ${sub ? 'subtracted' : 'added'} always give an even number.` : `An odd and an even number always give an odd number.`, `So the answer is ${right.toLowerCase()}.`] });
});

// ───────────── Skip-counting and number sequences ─────────────
skill('3-skip', 3, 'Skip-counting and number sequences', 'Skip-count forward and backward', ['Skip counting adds or takes away the same amount each time.', 'Find the jump between two numbers next to each other, then use it.'], (r) => {
  const by = r.pick([2, 5, 10, 25, 100]), back = r.bool(0.4), start = by * r.int(back ? 6 : 0, back ? 30 : 20) + (by === 2 && r.bool() ? 1 : 0);
  const seq = Array.from({ length: 6 }, (_, i) => start + (back ? -1 : 1) * i * by), gap = r.int(2, 5);
  const shown = seq.map((x, i) => (i === gap ? '?' : x)).join(', ');
  return num(seq[gap], [`Each number is ${by} ${back ? 'less' : 'more'} than the one before.`, `${seq[gap - 1]} ${back ? '−' : '+'} ${by} = ${seq[gap]}.`, `So the missing number is ${seq[gap]}.`], { q: `Fill in the missing number: ${shown}`, expr: `${start}${back ? '-' : '+'}${gap}*${by}` });
});
skill('3-skipstory', 3, 'Skip-counting and number sequences', 'Skip-counting stories and number patterns', ['Skip counting is a fast way to count equal groups.', 'In a number pattern, find the rule, then use it to go on.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const [by, thing, box] = r.pick([[2, 'socks', 'pairs'], [5, 'fingers', 'hands'], [10, 'crayons', 'boxes'], [5, 'apples', 'bags'], [10, 'eggs', 'trays']]), k = r.int(3, 10);
    return num(by * k, [`Count by ${by}s, once for each of the ${k} ${box}.`, `${multiplesOf(by, k).join(', ')}.`, `So there are ${by * k} ${thing}.`], { q: `There are ${by} ${thing} in each of ${k} ${box}. Count by ${by}s: how many ${thing} in all?`, expr: `${by}*${k}` });
  }
  if (v === 1) {
    const by = r.pick([2, 5, 10, 25]), k = r.int(4, 30), right = by * k;
    const wrongs = [right + Math.ceil(by / 2), right - 1, right + by + 1].filter((x) => x % by !== 0 && x > 0);
    return mc(r, right, wrongs, { q: `Counting by ${by}s from 0, which number will you say?`, steps: [`Numbers said when counting by ${by}s are all multiples of ${by}.`, `${right} = ${k} × ${by}, so you will say ${right}.`] });
  }
  const s = r.int(1, 30), rule = r.pick(['add', 'sub', 'dbl']), k = r.int(3, 9);
  const nx = (x) => (rule === 'add' ? x + k : rule === 'sub' ? x - k : x * 2);
  let st = rule === 'sub' ? s + 5 * k : rule === 'dbl' ? r.int(1, 6) : s;
  const seq = [st]; for (let i = 0; i < 4; i++) seq.push(nx(seq.at(-1)));
  const say = rule === 'add' ? `add ${k}` : rule === 'sub' ? `subtract ${k}` : 'multiply by 2';
  return num(nx(seq[3]), [`Compare neighbours: ${seq[0]} → ${seq[1]} → ${seq[2]}. The rule is "${say}".`, `${seq[3]} → ${nx(seq[3])}.`, `So the next number is ${nx(seq[3])}.`], { q: `What comes next? ${seq.slice(0, 4).join(', ')}, ?`, expr: rule === 'add' ? `${seq[3]}+${k}` : rule === 'sub' ? `${seq[3]}-${k}` : `${seq[3]}*2` });
});

// ───────────── Understand multiplication ─────────────
skill('3-multgroups', 3, 'Understand multiplication', 'Equal groups and multiplication', ['Multiplication counts equal groups: 4 × 3 means 4 groups of 3.', 'It is a quick way to add the same number again and again: 3 + 3 + 3 + 3 = 4 × 3.'], (r) => {
  const v = r.int(0, 3), g = r.int(2, 8), k = r.int(2, 9);
  const [box, thing] = r.pick([['plates', 'apples'], ['bags', 'oranges'], ['vases', 'flowers'], ['boxes', 'pencils'], ['nests', 'eggs']]);
  if (v === 0) return num(g * k, [St(`There are ${g} groups with ${k} in each group.`, { type: 'array', rows: g, cols: k }), `${g} × ${k} = ${g * k}.`, `So there are ${g * k} ${thing}.`], { q: `There are ${g} ${box} with ${k} ${thing} on each. How many ${thing} are there?`, visual: { type: 'array', rows: g, cols: k }, expr: `${g}*${k}` });
  if (v === 1) return mc(r, `${g} × ${k}`, [`${g} + ${k}`, `${g} × ${k + 1}`, `${g + k} × ${k}`], { q: `Which multiplication shows ${g} groups of ${k}?`, visual: { type: 'array', rows: g, cols: k }, steps: [`"${g} groups of ${k}" is written ${g} × ${k}.`, `Check by adding: ${Array(g).fill(k).join(' + ')} = ${g * k}.`] });
  if (v === 2) return num(g, [`Count how many times ${k} is added: ${g} times.`, `Adding ${k} again ${g} times is the same as ${g} × ${k}.`, `So the missing number is ${g}.`], { q: `${Array(g).fill(k).join(' + ')} = ? × ${k}`, expr: String(g) });
  const zero = r.bool(), each = zero ? 0 : 1;
  return num(g * each, [zero ? `Each of the ${g} ${box} has 0 ${thing}.` : `Each of the ${g} ${box} has just 1.`, `${g} × ${each} = ${g * each}.`, `So there ${g * each === 1 ? 'is' : 'are'} ${g * each} ${thing}.`], { q: `There are ${g} ${box}. Each has ${each} ${thing.replace(/s$/, each === 1 ? '' : 's')}. How many ${thing} are there in all?`, expr: `${g}*${each}` });
});
skill('3-multarrays', 3, 'Understand multiplication', 'Arrays, number lines and times as many', ['An array has equal rows: rows × number in each row.', 'On a number line, equal jumps show multiplication.', '"3 times as many" means multiply by 3.'], (r) => {
  const v = r.int(0, 3), a = r.int(2, 7), b = r.int(2, 9);
  if (v === 0) return mc(r, `${a} × ${b} = ${a * b}`, [`${a} + ${b} = ${a + b}`, `${a} × ${b + 1} = ${a * (b + 1)}`, `${a + 1} × ${b} = ${(a + 1) * b}`], { q: 'Which multiplication sentence matches the array?', visual: { type: 'array', rows: a, cols: b }, steps: [`There are ${a} rows with ${b} in each row.`, `So ${a} × ${b} = ${a * b}.`] });
  if (v === 1) {
    const NL = numberLine(0, a * b, { step: b, jumps: Array.from({ length: a }, (_, i) => ({ from: i * b, to: (i + 1) * b, label: `+${b}` })) });
    return mc(r, `${a} × ${b} = ${a * b}`, [`${b} × ${b} = ${b * b}`, `${a} + ${b} = ${a + b}`, `${a + 1} × ${b} = ${(a + 1) * b}`], { q: 'Which multiplication sentence does the number line show?', visual: NL, steps: [`Count the jumps: ${a}. Each jump is ${b}.`, `${a} jumps of ${b} land on ${a * b}, so ${a} × ${b} = ${a * b}.`] });
  }
  if (v === 2) {
    const [p, q2] = two(r), k = r.int(2, 5), n = r.int(2, 9), thing = r.pick(['shells', 'stamps', 'marbles', 'books']);
    return num(n * k, [`"${k} times as many" means ${k} × ${n}.`, `${k} × ${n} = ${n * k}.`, `So ${q2} has ${n * k} ${thing}.`], { q: `${p} has ${n} ${thing}. ${q2} has ${k} times as many. How many ${thing} does ${q2} have?`, expr: `${k}*${n}` });
  }
  const thing = r.pick(['chairs', 'desks', 'plants', 'tiles']);
  return num(a * b, [St(`The array has ${a} rows of ${b}.`, { type: 'array', rows: a, cols: b }), `${a} × ${b} = ${a * b}.`, `So there are ${a * b} ${thing}.`], { q: `${thing[0].toUpperCase() + thing.slice(1)} are set out in ${a} rows with ${b} in each row. How many ${thing} are there?`, expr: `${a}*${b}` });
});

// ───────────── Multiplication skill builders ─────────────
skill('3-multspecial', 3, 'Multiplication skill builders', 'Multiply by 0, 1, 10, 11 and 12', ['Times 0 is always 0. Times 1 keeps the number the same.', 'Times 10: add a 0 on the end.', 'Times 11 or 12: do times 10, then add 1 or 2 more groups.'], (r) => {
  const n = r.pick([0, 1, 10, 11, 12]), k = r.int(1, 12), [a, b] = r.bool() ? [n, k] : [k, n], p = n * k;
  const how = n === 0 ? 'Any number times 0 is 0.' : n === 1 ? `Any number times 1 stays the same: ${k}.` : n === 10 ? `Times 10: put a 0 on the end of ${k}.` : `Split ${n} into 10 + ${n - 10}: ${k} × 10 = ${10 * k} and ${k} × ${n - 10} = ${k * (n - 10)}. Add: ${10 * k} + ${k * (n - 10)} = ${p}.`;
  return num(p, [how, `So ${a} × ${b} = ${p}.`], { q: `${a} × ${b} = ?`, expr: `${a}*${b}` });
});

// ───────────── Factors and multiples ─────────────
const DIV_RULE = { 2: 'the ones digit is 0, 2, 4, 6 or 8', 5: 'the ones digit is 0 or 5', 10: 'the ones digit is 0', 3: 'the digits add up to a multiple of 3' };
skill('3-factors-multiples', 3, 'Factors and multiples', 'Divisibility, multiples, factors and primes', ['A number divides by 2 if it ends in 0, 2, 4, 6 or 8; by 5 if it ends in 0 or 5; by 10 if it ends in 0.', 'Multiples of 4 are 4, 8, 12, 16 and so on. Factors are numbers that multiply to make a number: 3 × 4 = 12.', 'A prime number has exactly two factors, 1 and itself; a composite number has more.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const d = r.pick([2, 5, 10, 3]), n = r.bool() ? d * r.int(3, 99) : r.int(11, 999), ok = n % d === 0;
    const sum = digitsOf(n).reduce((a, b) => a + b, 0);
    const check = d === 3 ? `The digits add up to ${digitsOf(n).join(' + ')} = ${sum}${ok ? `, a multiple of 3` : `, not a multiple of 3`}.` : `The ones digit of ${n} is ${n % 10}.`;
    return mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], { q: `Can ${n} be divided by ${d} with nothing left over?`, steps: [`Rule for ${d}: ${DIV_RULE[d]}.`, check, ok ? `So yes: ${n} ÷ ${d} = ${n / d}.` : `So no, ${n} does not divide evenly by ${d}.`] });
  }
  if (v === 1) {
    const N = r.int(3, 9), k = r.int(2, 10), right = N * k;
    const wrongs = new Set(); while (wrongs.size < 3) { const w = N * r.int(2, 10) + r.int(1, N - 1); wrongs.add(w); }
    return mc(r, right, [...wrongs], { q: `Which number is a multiple of ${N}?`, steps: [`Multiples of ${N}: ${multiplesOf(N, 10).join(', ')}.`, `${right} = ${k} × ${N}, so ${right} is a multiple of ${N}.`] });
  }
  if (v === 2) {
    const n = r.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48]), fs = [];
    for (let a = 2; a < n; a++) if (n % a === 0) fs.push(a);
    const a = r.pick(fs);
    return num(n / a, [`A factor pair is two numbers that multiply to make ${n}.`, `${n} ÷ ${a} = ${n / a}, so ${a} × ${n / a} = ${n}.`, `So the other factor is ${n / a}.`], { q: `${a} and ? are a factor pair of ${n}. What is the missing factor?`, expr: `${n}/${a}` });
  }
  const n = r.int(2, 50), f = [...Array(n).keys()].map((i) => i + 1).filter((i) => n % i === 0), right = isPrime(n) ? 'Prime' : 'Composite';
  return mc(r, right, [right === 'Prime' ? 'Composite' : 'Prime'], { q: `Is ${n} prime or composite?`, steps: [`The factors of ${n} are ${f.join(', ')}.`, f.length === 2 ? `Exactly two factors, 1 and ${n}, so ${n} is prime.` : `More than two factors, so ${n} is composite.`] });
});

// ───────────── Multiplication fluency ─────────────
skill('3-multtf', 3, 'Multiplication fluency', 'Multiplication facts: true, false and squares', ['Know your facts: check each one with skip counting if you are unsure.', 'A square number is a number times itself, like 6 × 6 = 36.'], (r) => {
  const v = r.int(0, 2), a = r.int(2, 12), b = r.int(2, 10);
  if (v === 0) {
    const ok = r.bool(), c = ok ? a * b : a * b + r.pick([-a, a, -1, 1, b, -b].filter((x) => x !== 0));
    return tf(r, ok, `True or false: ${a} × ${b} = ${c}`, [`${a} × ${b} = ${a * b}.`, ok ? 'That matches, so it is true.' : `${a * b} is not ${c}, so it is false.`]);
  }
  if (v === 1) {
    const p = a * b, wrongs = [`${a} × ${b + 1}`, `${a + 1} × ${b}`, `${a} + ${b}`, `${b} × ${b === a ? b + 2 : a - 1}`].filter((e) => Function(`return ${e.replace('×', '*')}`)() !== p);
    return mc(r, `${a} × ${b}`, wrongs.slice(0, 3), { q: `Which one equals ${p}?`, steps: [`Work each one out. ${a} × ${b} = ${p}.`, `So ${a} × ${b} is the one that equals ${p}.`] });
  }
  const s = r.int(2, 12);
  if (r.bool()) return num(s * s, [`${s} × ${s} means ${s} groups of ${s}.`, `${s} × ${s} = ${s * s}.`, `So the square is ${s * s}.`], { q: `${s} × ${s} = ?`, expr: `${s}*${s}` });
  return num(s, [`We need a number times itself that makes ${s * s}.`, `${s} × ${s} = ${s * s}.`, `So the number is ${s}.`], { q: `What number times itself equals ${s * s}?`, expr: `Math.sqrt(${s * s})` });
});
skill('3-multmissing', 3, 'Multiplication fluency', 'Find the missing factor', ['A missing factor is found with division: ? × 6 = 42 means 42 ÷ 6.', 'Or skip count by the known factor until you reach the product.'], (r) => {
  const v = r.int(0, 2), a = r.int(2, 12), b = r.int(2, 10), p = a * b;
  if (v === 0) return num(a, [`Think: what times ${b} makes ${p}?`, `Skip count by ${b}: ${multiplesOf(b, a).join(', ')}. That is ${a} jumps.`, `So ${a} × ${b} = ${p}. The missing factor is ${a}.`], { q: `? × ${b} = ${p}`, expr: `${p}/${b}` });
  if (v === 1) return num(b, [`Think: ${a} times what makes ${p}?`, `${p} ÷ ${a} = ${b}.`, `So ${a} × ${b} = ${p}. The missing factor is ${b}.`], { q: `${a} × ? = ${p}`, expr: `${p}/${a}` });
  const P = r.pick([12, 16, 18, 20, 24, 30, 36, 40, 48]), pairs = [];
  for (let x = 2; x <= 10; x++) if (P % x === 0 && P / x <= 12 && P / x >= 2) pairs.push([x, P / x]);
  const [x, y] = r.pick(pairs);
  const wrongs = [[x, y + 1], [x + 1, y], [x - 1 || 3, y + 2]].filter(([m, n]) => m * n !== P).map(([m, n]) => `${m} and ${n}`);
  return mc(r, `${x} and ${y}`, wrongs, { q: `Which two numbers can go in the boxes? ? × ? = ${P}`, steps: [`Multiply each pair and look for ${P}.`, `${x} × ${y} = ${P}, so ${x} and ${y} work.`] });
});

// ───────────── Multiplication ─────────────
skill('3-multword', 3, 'Multiplication', 'Multiplication word problems', ['Look for equal groups: how many groups, and how many in each?', 'Multiply the number of groups by the number in each group.'], (r) => {
  const v = r.int(0, 2), g = r.int(2, 10), k = r.int(2, 10), w = r.pick(NAMES);
  if (v === 0) {
    const [q, unit] = r.pick([[`A bus has ${g} rows of seats with ${k} seats in each row. How many seats are there?`, 'seats'], [`${w} buys ${g} packs of juice boxes. Each pack has ${k} juice boxes. How many juice boxes is that?`, 'juice boxes'], [`A strip model shows ${g} equal parts. Each part is ${k} cm long. How long is the whole strip, in centimetres?`, 'cm'], [`Each spider in a picture book has 8 legs. There are ${g} spiders. How many legs is that?`, 'legs']]);
    const kk = q.includes('spider') ? 8 : k;
    return num(g * kk, [`There are ${g} equal groups of ${kk}.`, `${g} × ${kk} = ${g * kk}.`, `So the answer is ${g * kk} ${unit}.`], { q, expr: `${g}*${kk}` });
  }
  if (v === 1) return num(g, [`Equal groups of ${k} make ${g * k}. Find the number of groups.`, `? × ${k} = ${g * k}, and ${g} × ${k} = ${g * k}.`, `So the answer is ${g}.`], { q: `${w} puts ${g * k} photos into an album, ${k} on each page, with every page full. How many pages does ${w} fill?`, expr: `${g * k}/${k}` });
  const [p, q2] = two(r), t = r.int(2, 5);
  return num(g * t, [`"${t} times as many" means multiply: ${t} × ${g}.`, `${t} × ${g} = ${g * t}.`, `So ${q2} ran ${g * t} km.`], { q: `${p} ran ${g} km this month. ${q2} ran ${t} times as far. How many kilometres did ${q2} run?`, expr: `${t}*${g}` });
});
skill('3-mult2d', 3, 'Multiplication', 'Multiply a two-digit number by a one-digit number', ['Split the two-digit number into tens and ones.', '4 × 23 = 4 × 20 + 4 × 3 = 80 + 12 = 92.'], (r) => {
  const v = r.int(0, 2), d = r.int(2, 9), n = r.int(1, 9) * 10 + r.int(1, 9), t =Math.floor(n / 10) * 10, o = n % 10, p = d * n;
  if (v === 2) {
    const right = `${d} × ${t} and ${d} × ${o}`;
    return mc(r, right, [`${d} × ${t / 10} and ${d} × ${o}`, `${d} + ${t} and ${d} + ${o}`, `${d} × ${t} and ${d} × ${o * 10 || 10}`], { q: `Which area model parts show ${d} × ${n}?`, steps: [St(`Split ${n} into ${t} + ${o}.`, areaModel(d, n)), `The parts are ${right}: ${d * t} + ${d * o} = ${p}.`] });
  }
  const w = r.pick(NAMES);
  const q = v ? r.pick([`A box holds ${n} crayons. How many crayons are in ${d} boxes?`, `${w} saves $${n} each month. How much does ${w} save in ${d} months, in dollars?`, `A train car has ${n} seats. How many seats are in ${d} cars?`]) : `${d} × ${n} = ?`;
  return num(p, [St(`Split ${n} into ${t} + ${o}.`, areaModel(d, n)), `${d} × ${t} = ${d * t} and ${d} × ${o} = ${d * o}.`, `Add: ${d * t} + ${d * o} = ${p}.`, `So ${d} × ${n} = ${p}.`], { q, expr: `${d}*${n}` });
});
skill('3-mult3d', 3, 'Multiplication', 'Multiply larger numbers and number patterns', ['Multiply each place: hundreds, tens and ones, then add.', '6 × 7 = 42, so 6 × 70 = 420 and 6 × 700 = 4200.', 'With three numbers, multiply two first, then the third.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0 || v === 1) {
    const d = r.int(2, 9), n = r.int(102, 999), w = r.pick(NAMES), p = d * n;
    const q = v ? r.pick([`A school orders ${d} boxes of paper. Each box has ${n} sheets. How many sheets is that?`, `A plane flies ${n} km each day. How far does it fly in ${d} days, in kilometres?`, `${w} walks ${n} steps to school. How many steps are ${d} trips?`]) : `${d} × ${n} = ?`;
    return num(p, [St(`Split ${n} into ${expandParts(n).join(' + ')}.`, areaModel(d, n)), ...columnMul(n, d).slice(1), `So the answer is ${comma(p)}.`], { q, expr: `${d}*${n}` });
  }
  if (v === 2) {
    const a = r.int(2, 5), b = r.int(2, 5), c = r.int(2, 6);
    return num(a * b * c, [`Multiply the first two: ${a} × ${b} = ${a * b}.`, `Then ${a * b} × ${c} = ${a * b * c}.`, `So ${a} × ${b} × ${c} = ${a * b * c}.`], { q: `${a} × ${b} × ${c} = ?`, expr: `${a}*${b}*${c}` });
  }
  if (v === 3) {
    const a = r.int(2, 9), b = r.int(2, 9), z = r.pick([10, 100, 1000]);
    return num(a * b * z, [`Start with the fact: ${a} × ${b} = ${a * b}.`, `${comma(b * z)} is ${b} × ${comma(z)}, so the answer is ${a * b} × ${comma(z)} = ${comma(a * b * z)}.`, `So ${a} × ${comma(b * z)} = ${comma(a * b * z)}.`], { q: `${a} × ${b} = ${a * b}. So ${a} × ${comma(b * z)} = ?`, expr: `${a}*${b * z}` });
  }
  const k = r.int(2, 9), ins = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 3);
  return mc(r, `Multiply by ${k}`, [`Add ${k}`, `Multiply by ${k + 1}`, `Add ${ins[0] * k - ins[0]}`].filter((x) => x !== `Multiply by ${k}`), { q: 'What is the rule for this table?', visual: { type: 'table', head: ['Input', 'Output'], rows: ins.map((x) => [x, x * k]) }, steps: [`${ins[0]} → ${ins[0] * k}: ${ins[0]} × ${k} = ${ins[0] * k}.`, `Check: ${ins[1]} × ${k} = ${ins[1] * k} and ${ins[2]} × ${k} = ${ins[2] * k}. The rule is multiply by ${k}.`] });
});

// ───────────── Understand division ─────────────
function divGen(r, v) {
  const g = r.int(2, 7), k = r.int(2, 9), c = g * k;
  if (v === 0) {
    const thing = r.pick(['strawberries', 'stickers', 'crackers', 'beads']);
    return num(k, [St(`Share ${c} into ${g} equal rows.`, { type: 'array', rows: g, cols: k }), `Each row gets ${k}, because ${g} × ${k} = ${c}.`, `So ${c} ÷ ${g} = ${k}.`], { q: `${c} ${thing} are shared equally by ${g} children. How many does each child get?`, expr: `${c}/${g}` });
  }
  if (v === 1) return mc(r, `${c} ÷ ${g} = ${k}`, [`${c} ÷ ${k + 1} = ${g}`, `${c} − ${g} = ${c - g}`, `${g} ÷ ${k} = ${c}`], { q: `The array shows ${c} dots in ${g} equal rows. Which division sentence matches?`, visual: { type: 'array', rows: g, cols: k }, steps: [`${c} dots in ${g} rows: each row has ${k}.`, `So ${c} ÷ ${g} = ${k}.`] });
  if (v === 2) return num(g, [`Division undoes multiplication.`, `${g} × ${k} = ${c}, so ${c} ÷ ${k} = ${g}.`, `The answer is ${g}.`], { q: `${g} × ${k} = ${c}. So ${c} ÷ ${k} = ?`, expr: `${c}/${k}` });
  const NL = numberLine(0, c, { step: k, jumps: Array.from({ length: g }, (_, i) => ({ from: c - i * k, to: c - (i + 1) * k, label: `−${k}` })) });
  return num(g, [St(`Jump back from ${c} by ${k} each time until you reach 0.`, NL), `There are ${g} jumps, so ${c} ÷ ${k} = ${g}.`, `The answer is ${g}.`], { q: `How many jumps of ${k} take you from ${c} back to 0? (${c} ÷ ${k})`, visual: numberLine(0, c, { step: k, marks: [c] }), expr: `${c}/${k}` });
}
skill('3-divgroups', 3, 'Understand division', 'Sharing and equal groups', ['Division shares a total into equal groups.', '12 ÷ 3 = 4 because 3 groups of 4 make 12.'], (r) => divGen(r, r.int(0, 1)));
skill('3-divrelate', 3, 'Understand division', 'Relate multiplication and division', ['Every division has a matching multiplication: 4 × 6 = 24, so 24 ÷ 6 = 4.', 'On a number line, count the equal jumps back to 0.'], (r) => divGen(r, r.int(2, 3)));

// ───────────── Division skill builders ─────────────
skill('3-divspecial', 3, 'Division skill builders', 'Divide by 1, 10, 11 and 12', ['Dividing by 1 leaves the number the same.', 'To divide by 10, 11 or 12, think of the times table: ? × 12 = 84.'], (r) => {
  const d = r.pick([1, 10, 11, 12]), q = r.int(1, 12), c = d * q;
  const how = d === 1 ? `Dividing by 1 leaves the number the same.` : `Think: ? × ${d} = ${c}. Count by ${d}s: ${multiplesOf(d, q).join(', ')}. That is ${q} ${d}s.`;
  return num(q, [how, `${q} × ${d} = ${c}.`, `So ${c} ÷ ${d} = ${q}.`], { q: `${c} ÷ ${d} = ?`, expr: `${c}/${d}` });
});

// ───────────── Division fluency ─────────────
skill('3-divtf', 3, 'Division fluency', 'Division facts: true or false', ['Check a division with multiplication: 42 ÷ 6 = 7 because 6 × 7 = 42.'], (r) => {
  const b = r.int(2, 12), q = r.int(2, 10), c = b * q;
  if (r.bool()) {
    const ok = r.bool(), shown = ok ? q : q + r.pick([-1, 1, 2]);
    return tf(r, ok, `True or false: ${c} ÷ ${b} = ${shown}`, [`Check: ${b} × ${shown} = ${b * shown}.`, ok ? `That is ${c}, so it is true.` : `That is not ${c}, so it is false.`]);
  }
  const wrongs = [`${c + b} ÷ ${b}`, `${c} ÷ ${q + 1 === b ? q + 2 : q + 1}`, `${c - b > 0 ? c - b : c + 2 * b} ÷ ${b}`];
  return mc(r, `${c} ÷ ${b}`, wrongs, { q: `Which one equals ${q}?`, steps: [`${b} × ${q} = ${c}.`, `So ${c} ÷ ${b} = ${q}.`] });
});
skill('3-divmissing', 3, 'Division fluency', 'Division facts: find the missing number', ['For ? ÷ 4 = 6, multiply: 4 × 6 = 24.', 'For 35 ÷ ? = 7, ask: 7 times what is 35?'], (r) => {
  const v = r.int(0, 2), b = r.int(2, 10), q = r.int(2, 10), c = b * q;
  if (v === 0) return num(c, [`The missing number split into groups of ${b} gives ${q}.`, `${b} × ${q} = ${c}.`, `So the missing number is ${c}.`], { q: `? ÷ ${b} = ${q}`, expr: `${b}*${q}` });
  if (v === 1) return num(b, [`Ask: ${q} times what is ${c}?`, `${q} × ${b} = ${c}, so ${c} ÷ ${b} = ${q}.`, `So the missing number is ${b}.`], { q: `${c} ÷ ? = ${q}`, expr: `${c}/${q}` });
  const wrongs = [[c + 1, b], [c, b + 1], [c - b, b + 1]].map(([x, y]) => `${x} and ${y}`);
  return mc(r, `${c} and ${b}`, wrongs, { q: `Which pair of numbers fits? ? ÷ ? = ${q}`, steps: [`Check with multiplication: ${b} × ${q} = ${c}.`, `So ${c} ÷ ${b} = ${q}.`] });
});

// ───────────── Division ─────────────
skill('3-divword', 3, 'Division', 'Division word problems', ['Sharing equally or making equal groups means divide.', 'Total ÷ number of groups = how many in each group.'], (r) => {
  const v = r.int(0, 2), b = r.int(2, 10), q = r.int(2, 10), c = b * q, w = r.pick(NAMES);
  if (v === 0) return num(q, [`Share ${c} equally into ${b} groups.`, `${c} ÷ ${b} = ${q}, because ${b} × ${q} = ${c}.`, `So each friend gets ${q}.`], { q: `${w} shares ${c} stickers equally among ${b} friends. How many stickers does each friend get?`, expr: `${c}/${b}` });
  if (v === 1) return num(q, [`Make teams of ${b} from ${c} children.`, `${c} ÷ ${b} = ${q}.`, `So there are ${q} teams.`], { q: `${c} children make teams of ${b}. How many teams are there?`, expr: `${c}/${b}` });
  return num(q, [`The strip of ${c} cm is cut into ${b} equal parts.`, `${c} ÷ ${b} = ${q}.`, `So each piece is ${q} cm long.`], { q: `A ribbon ${c} cm long is cut into ${b} equal pieces. How long is each piece, in centimetres?`, expr: `${c}/${b}` });
});
skill('3-div2d', 3, 'Division', 'Divide two-digit numbers', ['Split the number into parts that are easy to divide: 84 ÷ 4 = 80 ÷ 4 + 4 ÷ 4.', 'If something is left over, that is the remainder.'], (r) => {
  const v = r.int(0, 2), d = r.int(2, 9), qmax = Math.floor(99 / d);
  if (v === 1) {
    const q = r.int(3, Math.min(qmax, 15)), rem = r.int(1, d - 1), a = d * q + rem;
    if (a > 99) return num(q, longDivision(d * q, d), { q: `${d * q} ÷ ${d} = ?`, expr: `${d * q}/${d}` });
    return txt(`${q} R ${rem}`, longDivision(a, d), { q: `${a} ÷ ${d} = ? (write it like 7 R 2)`, accept: [`${q}r${rem}`, `${q} r ${rem}`, `${q}R${rem}`, `${q} remainder ${rem}`] });
  }
  const q = r.int(Math.min(11, qmax), Math.max(11, qmax)), a = d * q;
  if (a > 99 || q < 2) return num(8, longDivision(72, 9), { q: '72 ÷ 9 = ?', expr: '72/9' });
  const big = Math.floor(q / 10) * 10 * d, small = a - big, w = r.pick(NAMES);
  const q2 = v === 2 ? r.pick([`${w} has ${a} beads and makes ${d} bracelets with the same number on each. How many beads go on each bracelet?`, `${a} chairs are put into ${d} equal rows. How many chairs are in each row?`]) : `${a} ÷ ${d} = ?`;
  return num(q, [St(`Split ${a} into ${big} + ${small}. Both divide by ${d}.`), `${big} ÷ ${d} = ${big / d} and ${small} ÷ ${d} = ${small / d}.`, `Add the parts: ${big / d} + ${small / d} = ${q}.`, `So ${a} ÷ ${d} = ${q}.`], { q: q2, expr: `${a}/${d}` });
});
skill('3-div3d', 3, 'Division', 'Divide larger numbers and division patterns', ['Divide one place at a time, starting on the left.', '56 ÷ 7 = 8, so 560 ÷ 7 = 80.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0 || v === 1) {
    const d = r.int(2, 9), q = r.int(Math.ceil(100 / d), Math.floor(999 / d)), a = d * q, w = r.pick(NAMES);
    const q2 = v ? r.pick([`${a} books are packed equally into ${d} boxes. How many books go in each box?`, `${w} drives ${a} km in ${d} days, the same distance each day. How many kilometres is that each day?`]) : `${a} ÷ ${d} = ?`;
    return num(q, [...longDivision(a, d), `So the answer is ${q}.`], { q: q2, expr: `${a}/${d}` });
  }
  if (v === 2) {
    const d = r.int(2, 9), q = r.int(2, 9), z = r.pick([10, 100]);
    return num(q * z, [`Start with the fact: ${d * q} ÷ ${d} = ${q}.`, `${comma(d * q * z)} is ${d * q} ${z === 10 ? 'tens' : 'hundreds'}, so the answer is ${q} ${z === 10 ? 'tens' : 'hundreds'} = ${q * z}.`, `So ${comma(d * q * z)} ÷ ${d} = ${q * z}.`], { q: `${comma(d * q * z)} ÷ ${d} = ?`, expr: `${d * q * z}/${d}` });
  }
  const d = r.int(2, 9), ins = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 4).map((x) => x * d * 10), last = ins.at(-1);
  return num(last / d, [`The rule is "divide by ${d}".`, `${last} ÷ ${d} = ${last / d}.`, `So the missing output is ${last / d}.`], { q: `The rule is "divide by ${d}". What is the missing output?`, visual: ioTable(ins, (x) => x / d), expr: `${last}/${d}` });
});

// ───────────── Mixed operations: multiplication and division ─────────────
skill('3-muldivfacts', 3, 'Mixed operations: multiplication and division', 'Multiplication and division facts', ['Multiplication and division are opposites: 6 × 8 = 48, so 48 ÷ 8 = 6.', 'A fact family uses the same three numbers.'], (r) => {
  const v = r.int(0, 2), a = r.int(2, 12), b = r.int(2, 10), c = a * b;
  if (v === 0) {
    const div = r.bool(), ok = r.bool(), shown = ok ? (div ? a : c) : (div ? a + 1 : c + r.pick([-1, 1, a]));
    return tf(r, ok, div ? `True or false: ${c} ÷ ${b} = ${shown}` : `True or false: ${a} × ${b} = ${shown}`, [div ? `${b} × ${a} = ${c}, so ${c} ÷ ${b} = ${a}.` : `${a} × ${b} = ${c}.`, ok ? 'So it is true.' : `So it is false.`]);
  }
  if (v === 1) {
    const f = r.int(0, 3);
    const [q, ans, e] = [[`${a} × ? = ${c}`, b, `${c}/${a}`], [`? × ${b} = ${c}`, a, `${c}/${b}`], [`${c} ÷ ? = ${a}`, b, `${c}/${a}`], [`? ÷ ${b} = ${a}`, c, `${a}*${b}`]][f];
    return num(ans, [`Use the fact family of ${a}, ${b} and ${c}.`, `${a} × ${b} = ${c} and ${c} ÷ ${b} = ${a}.`, `So the missing number is ${ans}.`], { q, expr: e });
  }
  const odd = r.pick([`${c} ÷ ${a + 1} = ${b}`, `${a} + ${b} = ${c}`, `${b} × ${b} = ${c}`].filter((x) => !(a === b && x.startsWith(`${b} × ${b}`))));
  const fam = [`${a} × ${b} = ${c}`, `${b} × ${a} = ${c}`, `${c} ÷ ${a} = ${b}`, `${c} ÷ ${b} = ${a}`];
  return mc(r, odd, r.shuffle(fam).slice(0, 3), { q: `Which one is NOT in the fact family of ${a}, ${b} and ${c}?`, steps: [`The fact family is ${fam.join(', ')}.`, `${odd} is not one of them.`] });
});
skill('3-muldivword', 3, 'Mixed operations: multiplication and division', 'Multiply or divide: word problems and patterns', ['Equal groups put together: multiply. Sharing or grouping a total: divide.', 'For two steps, find the first answer, then use it.'], (r) => {
  const v = r.int(0, 2), w = r.pick(NAMES);
  if (v === 0) {
    const b = r.int(2, 9), q = r.int(2, 9);
    if (r.bool()) return num(b * q, [`There are ${b} equal groups of ${q}: multiply.`, `${b} × ${q} = ${b * q}.`, `So there are ${b * q} muffins.`], { q: `A baker fills ${b} trays with ${q} muffins each. How many muffins is that?`, expr: `${b}*${q}` });
    return num(q, [`Share ${b * q} into ${b} equal groups: divide.`, `${b * q} ÷ ${b} = ${q}.`, `So each vase gets ${q} flowers.`], { q: `${w} puts ${b * q} flowers equally into ${b} vases. How many flowers go in each vase?`, expr: `${b * q}/${b}` });
  }
  if (v === 1) {
    const m = r.int(2, 6), each = r.int(2, 8), packs = m * r.int(1, 4), k = r.pick([2, 3, 4, 5, 6]);
    const total = packs * k;
    if (total % m) return num(packs * k, [`${packs} × ${k} = ${packs * k}.`, `So there are ${packs * k} cards.`], { q: `${w} buys ${packs} packs of ${k} cards. How many cards is that?`, expr: `${packs}*${k}` });
    return num(total / m, [`First find the total: ${packs} × ${k} = ${total} pencils.`, `Then share among ${m}: ${total} ÷ ${m} = ${total / m}.`, `So each student gets ${total / m} pencils.`], { q: `A teacher has ${packs} boxes of ${k} pencils. She shares them equally among ${m} students. How many pencils does each student get?`, expr: `${packs}*${k}/${m}` });
  }
  const [thing, unit, k] = r.pick([['tricycles', 'wheels', 3], ['spiders', 'legs', 8], ['cars', 'wheels', 4], ['starfish', 'arms', 5], ['insects', 'legs', 6]]), n = r.int(5, 10);
  return num(n * k, [`Each one has ${k} ${unit}, so the number of ${unit} goes up by ${k} each time.`, `${n} × ${k} = ${n * k}.`, `So ${n} ${thing} have ${n * k} ${unit}.`], { q: `How many ${unit} do ${n} ${thing} have?`, visual: { type: 'table', head: [cap(thing), cap(unit)], rows: [[1, k], [2, 2 * k], [3, 3 * k], [n, '?']] }, expr: `${n}*${k}` });
});

// ───────────── Mixed operations ─────────────
const OPS = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };
skill('3-mixedfacts', 3, 'Mixed operations', 'Add, subtract, multiply and divide', ['Read the sign carefully before you work it out.', 'For a missing sign, try each sign and see which one makes the sentence true.'], (r) => {
  const v = r.int(0, 2), op = r.pick(Object.keys(OPS));
  let a = r.int(2, 12), b = r.int(2, 10);
  if (op === '÷') a = a * b; if (op === '−' && a < b) [a, b] = [b, a];
  const c = OPS[op](a, b);
  if (v === 0) return num(c, [`The sign is ${op}.`, `${a} ${op} ${b} = ${c}.`, `So the answer is ${c}.`], { q: `${a} ${op} ${b} = ?`, expr: `${a}${{ '×': '*', '÷': '/', '−': '-', '+': '+' }[op]}${b}` });
  if (v === 1) {
    const back = { '+': `${c} − ${a} = ${b}`, '−': `${a} − ${c} = ${b}`, '×': `${c} ÷ ${a} = ${b}`, '÷': `${a} ÷ ${c} = ${b}` }[op];
    return num(b, [`Work backwards from ${c}.`, back + '.', `So the missing number is ${b}.`], { q: `${a} ${op} ? = ${c}`, expr: String(b) });
  }
  const fits = Object.keys(OPS).filter((s) => OPS[s](a, b) === c);
  if (fits.length > 1) return num(c, [`The sign is ${op}.`, `${a} ${op} ${b} = ${c}.`, `So the answer is ${c}.`], { q: `${a} ${op} ${b} = ?`, expr: String(c) });
  return mc(r, op, Object.keys(OPS).filter((s) => s !== op), { q: `Which sign makes it true? ${a} ? ${b} = ${c}`, steps: [`Try each sign with ${a} and ${b}.`, `${a} ${op} ${b} = ${c}, so the sign is ${op}.`] });
});
skill('3-orderops', 3, 'Mixed operations', 'Brackets and more than one operation', ['Work out brackets first.', 'Then multiply and divide, then add and subtract, from left to right.'], (r) => {
  const v = r.int(0, 2), a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 6);
  if (v === 0) {
    const f = r.int(0, 2);
    if (f === 0) return num((a + b) * c, [`Brackets first: ${a} + ${b} = ${a + b}.`, `Then ${a + b} × ${c} = ${(a + b) * c}.`, `So (${a} + ${b}) × ${c} = ${(a + b) * c}.`], { q: `(${a} + ${b}) × ${c} = ?`, expr: `(${a}+${b})*${c}` });
    if (f === 1) { const big = b + c + r.int(0, 4); return num(a * (big - c), [`Brackets first: ${big} − ${c} = ${big - c}.`, `Then ${a} × ${big - c} = ${a * (big - c)}.`, `So ${a} × (${big} − ${c}) = ${a * (big - c)}.`], { q: `${a} × (${big} − ${c}) = ?`, expr: `${a}*(${big}-${c})` }); }
    const t = c * r.int(2, 9), s = t + r.int(5, 30);
    return num(t / c + s - t, [`Brackets first: ${t} ÷ ${c} = ${t / c}.`, `Then ${t / c} + ${s - t} = ${t / c + s - t}.`, `So (${t} ÷ ${c}) + ${s - t} = ${t / c + s - t}.`], { q: `(${t} ÷ ${c}) + ${s - t} = ?`, expr: `(${t}/${c})+${s - t}` });
  }
  if (v === 1) {
    const x = r.int(5, 40);
    return num(x + a * b, [`Multiply before adding: ${a} × ${b} = ${a * b}.`, `Then ${x} + ${a * b} = ${x + a * b}.`, `So ${x} + ${a} × ${b} = ${x + a * b}.`], { q: `${x} + ${a} × ${b} = ?`, expr: `${x}+${a}*${b}` });
  }
  const L = a * b - c, R = r.bool(0.2) ? L : L + r.nonzero(-6, 6);
  return signQ(r, `${a} × ${b} − ${c}`, String(R), L, R, [`Multiply first: ${a} × ${b} = ${a * b}. Then ${a * b} − ${c} = ${L}.`, `${L} ${sign(L, R)} ${R}.`]);
});
skill('3-mixedword', 3, 'Mixed operations', 'Mixed word problems', ['Read the whole problem and plan the steps.', '"More than" usually means add; "times as many" means multiply.'], (r) => {
  const v = r.int(0, 2), w = r.pick(NAMES);
  if (v === 0) {
    const p = r.int(3, 8), k = r.int(4, 10), g = r.int(2, p * k - 5);
    return num(p * k - g, [`First: ${p} packs × ${k} = ${p * k} cards.`, `Then give away ${g}: ${p * k} − ${g} = ${p * k - g}.`, `So ${w} has ${p * k - g} cards left.`], { q: `${w} buys ${p} packs of cards with ${k} cards in each pack, then gives ${g} cards to a friend. How many cards are left?`, expr: `${p}*${k}-${g}` });
  }
  if (v === 1) {
    const [p, q2] = two(r), n = r.int(3, 9), k = r.int(2, 5), times = r.bool();
    const right = times ? `${n} × ${k}` : `${n} + ${k}`;
    return mc(r, right, [times ? `${n} + ${k}` : `${n} × ${k}`, `${n} − ${k}`, `${n} ÷ ${k}`].filter((x) => x !== right), { q: `${p} has ${n} marbles. ${q2} has ${times ? `${k} times as many marbles as` : `${k} more marbles than`} ${p}. Which shows how many marbles ${q2} has?`, steps: [times ? `"${k} times as many" means multiply.` : `"${k} more than" means add.`, `So ${q2} has ${right} marbles.`] });
  }
  const x = r.int(2, 9), y = r.int(2, 9), big = Math.max(x, y), small = Math.min(x, y);
  return num(big, [`List pairs that multiply to ${x * y} and check their sum.`, `${small} × ${big} = ${x * y} and ${small} + ${big} = ${x + y}.`, `So the larger number is ${big}.`], { q: `Two numbers multiply to ${x * y} and add up to ${x + y}. What is the larger number?`, expr: String(big) });
});

// ───────────── Equations and variables ─────────────
skill('3-variables', 3, 'Equations and variables', 'Solve for the unknown', ['A letter like n stands for an unknown number.', 'Use the opposite operation to find it: n + 7 = 15, so n = 15 − 7.'], (r) => {
  const v = r.int(0, 4), n = r.int(2, 12), k = r.int(2, 9);
  if (v === 0) {
    const right = r.pick([`n + ${k} = ${n + k}`, `${k} × n = ${n * k}`, `${n * k} ÷ n = ${k}`]);
    return mc(r, right, [`n + ${k}`, `${k} × ${n}`, `${n * k} − n`], { q: 'Which one is an equation?', steps: ['An equation has an equals sign with a value on each side.', `${right} has an equals sign, so it is an equation.`] });
  }
  const [q, ans, how, e] = [
    [`n + ${k} = ${n + k}`, n, `n = ${n + k} − ${k}`, `${n + k}-${k}`],
    [`n − ${k} = ${n}`, n + k, `n = ${n} + ${k}`, `${n}+${k}`],
    [`${k} × n = ${n * k}`, n, `n = ${n * k} ÷ ${k}`, `${n * k}/${k}`],
    [`n ÷ ${k} = ${n}`, n * k, `n = ${n} × ${k}`, `${n}*${k}`],
  ][v - 1];
  return num(ans, [`Undo the operation: ${how}.`, `${how} = ${ans}.`, `So n = ${ans}.`], { q: `Solve for n: ${q}`, expr: e });
});
skill('3-writeeqn', 3, 'Equations and variables', 'Write an equation for a story', ['Use a letter for the number you do not know.', 'Write what happens in the story with +, −, × or ÷ and an equals sign.'], (r) => {
  const w = r.pick(NAMES), a = r.int(3, 9), b = r.int(12, 40), v = r.int(0, 3);
  const set = [
    [`${w} had some cards and got ${a} more. Now ${w} has ${b} cards. Which equation fits?`, `n + ${a} = ${b}`, [`n − ${a} = ${b}`, `${a} × n = ${b}`, `n + ${b} = ${a}`], 'Getting more means add.'],
    [`${w} had some stickers and gave away ${a}. ${b} stickers are left. Which equation fits?`, `n − ${a} = ${b}`, [`n + ${a} = ${b}`, `${a} − n = ${b}`, `n ÷ ${a} = ${b}`], 'Giving away means subtract.'],
    [`There are ${a} bags with the same number of apples in each. There are ${a * 4} apples in all. Which equation fits?`, `${a} × n = ${a * 4}`, [`${a} + n = ${a * 4}`, `n ÷ ${a} = ${a * 4}`, `${a * 4} × ${a} = n`], 'Equal groups put together means multiply.'],
    [`Some crayons are shared equally by ${a} children. Each child gets 5. Which equation fits?`, `n ÷ ${a} = 5`, [`n × ${a} = 5`, `n − ${a} = 5`, `${a} ÷ n = 5`], 'Sharing equally means divide.'],
  ][v];
  return mc(r, set[1], set[2], { q: set[0], steps: [set[3], `Let n be the unknown number: ${set[1]}.`] });
});

// ───────────── Estimation and rounding ─────────────
const rnd = (n, to) => Math.round(n / to) * to;
skill('3-round10k', 3, 'Estimation and rounding', 'Round to thousands, ten thousands and dollars', ['Find the place you round to and look at the digit just to its right.', '5 or more rounds up; 4 or less rounds down.', 'For money, round to the nearest dollar: 50¢ or more rounds up.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const to = r.pick([1000, 10000]), n = to === 1000 ? r.int(1001, 98999) : r.int(10001, 94999), ans = rnd(n, to), lo = Math.floor(n / to) * to, d = placeOf(n, to === 1000 ? 2 : 3);
    return num(ans, [`${comma(n)} is between ${comma(lo)} and ${comma(lo + to)}.`, `Look at the ${to === 1000 ? 'hundreds' : 'thousands'} digit: ${d}. ${d >= 5 ? 'Round up' : 'Round down'}.`, `So ${comma(n)} rounds to ${comma(ans)}.`], { q: `Round ${comma(n)} to the nearest ${comma(to)}.`, expr: `Math.round(${n}/${to})*${to}` });
  }
  if (v === 1) {
    const c = r.int(101, 4999) * 5, ans = rnd(c, 100) / 100, cents = c % 100;
    return num(ans, [`${money(c)} is between $${Math.floor(c / 100)} and $${Math.floor(c / 100) + 1}.`, `It has ${cents}¢. ${cents >= 50 ? '50¢ or more: round up.' : 'Less than 50¢: round down.'}`, `So ${money(c)} rounds to $${ans}.`], { q: `Round ${money(c)} to the nearest dollar. (in dollars)`, expr: `Math.round(${c}/100)` });
  }
  const to = r.pick([10, 100]), target = to === 10 ? r.int(3, 99) * 10 : r.int(2, 9) * 100, big = r.bool();
  const ans = big ? target + to / 2 - 1 : target - to / 2;
  return num(ans, [`Numbers that round to ${target} go from ${target - to / 2} up to ${target + to / 2 - 1}.`, `${target + to / 2} would round up to ${target + to}.`, `So the ${big ? 'largest' : 'smallest'} is ${ans}.`], { q: `What is the ${big ? 'largest' : 'smallest'} whole number that rounds to ${target} when rounding to the nearest ${to}?`, expr: String(ans) });
});
skill('3-estsum', 3, 'Estimation and rounding', 'Estimate sums and differences', ['To estimate, round each number first, then add or subtract.', 'An estimate is close to the exact answer, and quick to find.'], (r) => {
  const v = r.int(0, 3), to = r.pick([10, 100]);
  const gen = () => (to === 10 ? r.int(11, 99) : r.int(101, 999));
  let a = gen(), b = gen(); if (a < b) [a, b] = [b, a];
  const ra = rnd(a, to), rb = rnd(b, to);
  if (v === 0 || v === 1) {
    const add = v === 0, ans = add ? ra + rb : ra - rb, op = add ? '+' : '−';
    return num(ans, [`Round each number to the nearest ${to}: ${a} → ${ra}, ${b} → ${rb}.`, `${ra} ${op} ${rb} = ${ans}.`, `So the estimate is ${ans}.`], { q: `Estimate ${a} ${op} ${b} by rounding each number to the nearest ${to}.`, expr: `Math.round(${a}/${to})*${to}${add ? '+' : '-'}Math.round(${b}/${to})*${to}` });
  }
  if (v === 2) {
    const w = r.pick(NAMES), A = r.int(101, 999), B = r.int(101, 999), rA = rnd(A, 100), rB = rnd(B, 100);
    return num(rA + rB, [`Round to the nearest hundred: ${A} → ${rA}, ${B} → ${rB}.`, `${rA} + ${rB} = ${rA + rB}.`, `So about ${rA + rB} people.`], { q: `${A} people came to the fair on Saturday and ${B} on Sunday. Round each to the nearest hundred to estimate how many came in all.`, expr: `Math.round(${A}/100)*100+Math.round(${B}/100)*100` });
  }
  const A = r.int(120, 480), B = r.int(120, 480), s = A + B, T = rnd(s, 100) + r.pick([-200, 200, 300, -300]);
  const right = s > T ? `More than ${T}` : `Less than ${T}`;
  return mc(r, right, [s > T ? `Less than ${T}` : `More than ${T}`], { q: `Without adding exactly, is ${A} + ${B} more or less than ${T}?`, steps: [`Round: ${A} → ${rnd(A, 100)} and ${B} → ${rnd(B, 100)}. The sum is about ${rnd(A, 100) + rnd(B, 100)}.`, `That is far ${s > T ? 'above' : 'below'} ${T}, so the answer is "${right.toLowerCase()}".`] });
});
skill('3-estprod', 3, 'Estimation and rounding', 'Estimate products, quotients and reasonable answers', ['Round to a friendly number, then multiply or divide in your head.', '38 × 6 is close to 40 × 6 = 240.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const n = r.int(12, 98), d = r.int(2, 9), rn = rnd(n, 10);
    return num(rn * d, [`Round ${n} to the nearest ten: ${rn}.`, `${rn} × ${d} = ${rn * d}.`, `So ${n} × ${d} is about ${rn * d}.`], { q: `Estimate ${n} × ${d} by rounding ${n} to the nearest ten.`, expr: `Math.round(${n}/10)*10*${d}` });
  }
  if (v === 1) {
    const d = r.int(2, 9), q = r.int(2, 9), n = d * q * 10 + r.int(-4, 4);
    return mc(r, q * 10, [q, q * 100, (q + 3) * 10], { q: `Which is the best estimate for ${n} ÷ ${d}?`, steps: [`${n} is close to ${d * q * 10}, which divides easily by ${d}.`, `${d * q * 10} ÷ ${d} = ${q * 10}, so the best estimate is ${q * 10}.`] });
  }
  const k = r.int(2, 5), p = r.pick([19, 21, 29, 31, 39, 41, 49]), est = k * rnd(p, 10), thing = r.pick(['books', 'games', 'shirts', 'puzzles']);
  return mc(r, `About $${est}`, [`About $${est * 2}`, `About $${rnd(p, 10)}`, `About $${est * 10}`].filter((x) => x !== `About $${est}`), { q: `${r.pick(NAMES)} buys ${k} ${thing} that cost $${p} each. Which total is most reasonable?`, steps: [`$${p} is close to $${rnd(p, 10)}.`, `${k} × $${rnd(p, 10)} = $${est}, so about $${est} is reasonable.`] });
});

// ───────────── Patterns ─────────────
const PAT = [['circle', 'square', 'triangle', 'star', 'heart'], ['red', 'blue', 'green', 'yellow', 'purple'], ['clap', 'stomp', 'snap', 'jump', 'hop']];
skill('3-reppattern', 3, 'Patterns', 'Repeating patterns', ['A repeating pattern has a core: the part that repeats.', 'Find the core, then keep repeating it.'], (r) => {
  const set = r.shuffle(r.pick(PAT)), core = r.pick([[0, 1], [0, 1, 1], [0, 0, 1], [0, 1, 2], [0, 1, 2, 2], [0, 1, 1, 2]]).map((i) => set[i]);
  const L = core.length, len = 2 * L + r.int(1, L), seq = Array.from({ length: len + 1 }, (_, i) => core[i % L]), v = r.int(0, 2);
  const others = [...new Set(core)];
  if (v === 0) {
    const ans = seq[len];
    return mc(r, ans, [...others.filter((x) => x !== ans), set[3]], { q: `What comes next? ${seq.slice(0, len).join(', ')}, ?`, steps: [`The core is: ${core.join(', ')}. It has ${L} items.`, `Keep repeating the core: the next item is ${ans}.`] });
  }
  if (v === 1) {
    const gap = r.int(L, len - 1), ans = seq[gap];
    return mc(r, ans, [...others.filter((x) => x !== ans), set[4]], { q: `What is missing? ${seq.slice(0, len).map((x, i) => (i === gap ? '?' : x)).join(', ')}`, steps: [`The core is: ${core.join(', ')}.`, `Following the core, the missing item is ${ans}.`] });
  }
  return num(L, [`Look for where the pattern starts again.`, `The core is: ${core.join(', ')}.`, `So the core has ${L} items.`], { q: `How many items are in the core of this pattern? ${seq.slice(0, 3 * L).join(', ')}`, expr: String(L) });
});
skill('3-growpattern', 3, 'Patterns', 'Growing patterns and rules', ['A growing pattern changes by the same amount each step.', 'Find how much it grows each time, then keep going.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(1, 6), d = r.int(2, 5), n = r.int(4, 7), thing = r.pick(['squares', 'dots', 'sticks', 'tiles']);
    const vis = { type: 'table', head: ['Figure', cap(thing)], rows: [[1, a], [2, a + d], [3, a + 2 * d], [n, '?']] };
    return num(a + (n - 1) * d, [`Each figure has ${d} more ${thing} than the one before.`, `From figure 3 to figure ${n} is ${n - 3} more steps: ${a + 2 * d} + ${n - 3} × ${d} = ${a + (n - 1) * d}.`, `So figure ${n} has ${a + (n - 1) * d} ${thing}.`], { q: `How many ${thing} are in figure ${n}?`, visual: vis, expr: `${a}+(${n}-1)*${d}` });
  }
  if (v === 1) {
    const start = r.int(1, 4), rows = [start, start + 1, start + 2, start + 3];
    const shown = rows.map((k) => Array(k).fill('★').join(' '));
    return num(start + 4, [`Each row has 1 more star than the row above.`, `Row 4 has ${start + 3}, so row 5 has ${start + 3} + 1 = ${start + 4}.`, `So the next row has ${start + 4} stars.`], { q: 'How many stars will be in the next row?', visual: { type: 'table', head: ['Row', 'Stars'], rows: shown.map((s, i) => [i + 1, s]) }, expr: `${start}+4` });
  }
  const s = r.int(1, 20), k = r.int(3, 12), dbl = r.bool(0.25);
  const seq = dbl ? [s, 2 * s, 4 * s, 8 * s, 16 * s] : [s, s + k, s + 2 * k, s + 3 * k, s + 4 * k];
  return num(seq[4], [`Start at ${s}. The rule is "${dbl ? 'multiply by 2' : `add ${k}`}".`, `${seq.slice(0, 4).join(', ')}, then ${seq[3]} ${dbl ? '× 2' : `+ ${k}`} = ${seq[4]}.`, `So the 5th number is ${seq[4]}.`], { q: `Start at ${s} and use the rule "${dbl ? 'multiply by 2' : `add ${k}`}". What is the 5th number?`, expr: dbl ? `${s}*16` : `${s}+4*${k}` });
});

// ───────────── Money ─────────────
const COIN_NAME = { 5: ['nickel', 'nickels'], 10: ['dime', 'dimes'], 25: ['quarter', 'quarters'], 100: ['loonie', 'loonies'], 200: ['toonie', 'toonies'], 500: ['$5 bill', '$5 bills'], 1000: ['$10 bill', '$10 bills'], 2000: ['$20 bill', '$20 bills'] };
const coinList = (cs) => { const cnt = {}; cs.forEach((c) => (cnt[c] = (cnt[c] ?? 0) + 1)); return Object.keys(cnt).map(Number).sort((a, b) => b - a).map((c) => `${cnt[c]} ${COIN_NAME[c][cnt[c] === 1 ? 0 : 1]}`).join(', '); };
const someCoins = (r, big) => Array.from({ length: r.int(3, 7) }, () => r.pick(big ? [5, 10, 25, 100, 200, 500, 1000, 2000] : [5, 10, 25, 100, 200])).sort((a, b) => b - a);
skill('3-countmoney', 3, 'Money', 'Count coins and bills', ['Start with the bills and coins worth the most, then count on.', 'Nickel 5¢, dime 10¢, quarter 25¢, loonie $1, toonie $2.'], (r) => {
  if (r.bool(0.6)) {
    const cs = someCoins(r, r.bool()), total = cs.reduce((a, b) => a + b, 0);
    let run = 0; const counts = cs.map((c) => money((run += c)));
    return num(dec(total / 100), [`Start with the biggest and count on: ${counts.join(', ')}.`, `The total is ${money(total)}.`, `So there is ${money(total)}.`], { q: 'How much money is shown? (in dollars)', visual: { type: 'coins', coins: cs }, expr: `(${cs.join('+')})/100` });
  }
  let A = someCoins(r, false), B = someCoins(r, false), sa = A.reduce((a, b) => a + b, 0), sb = B.reduce((a, b) => a + b, 0);
  if (sa === sb) { B = [...B, 5]; sb += 5; }
  const right = sa > sb ? 'Group A' : 'Group B';
  return mc(r, right, [right === 'Group A' ? 'Group B' : 'Group A'], { q: `Group A has ${coinList(A)}. Group B has ${coinList(B)}. Which group has more money?`, steps: [`Group A: ${money(sa)}. Group B: ${money(sb)}.`, `${right} has more.`] });
});
skill('3-change', 3, 'Money', 'Making change and having enough', ['Change is what you get back: money paid − price.', 'Count up from the price to the money paid.'], (r) => {
  const w = r.pick(NAMES), thing = r.pick(['a book', 'a toy car', 'a lunch', 'a puzzle', 'a hat']);
  if (r.bool(0.6)) {
    const bill = r.pick([500, 1000, 2000, 5000]), price = r.int(Math.floor(bill / 10), bill / 5 - 1) * 5;
    return num(dec((bill - price) / 100), [`Change = money paid − price.`, `${money(bill)} − ${money(price)} = ${money(bill - price)}.`, `So the change is ${money(bill - price)}.`], { q: `${w} buys ${thing} for ${money(price)} and pays with a ${money(bill).replace('.00', '')} bill. How much change should ${w} get? (in dollars)`, expr: `(${bill}-${price})/100` });
  }
  const have = r.int(100, 1000) * 5, cost = have + r.nonzero(-80, 80) * 5, ok = have >= cost;
  return mc(r, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], { q: `${w} has ${money(have)}. ${cap(thing)} costs ${money(cost)}. Does ${w} have enough money?`, steps: [`Compare ${money(have)} and ${money(cost)}.`, ok ? `${money(have)} is at least ${money(cost)}, so yes.` : `${money(have)} is less than ${money(cost)}, so no.`] });
});
skill('3-moneyword', 3, 'Money', 'Add, subtract and compare money', ['Line up the decimal points and add or subtract like whole numbers.', 'Write the answer with a $ and two places after the point.'], (r) => {
  const v = r.int(0, 3), w = r.pick(NAMES);
  if (v === 0 || v === 1) {
    let a = r.int(40, 900) * 5, b = r.int(20, 600) * 5; if (v === 1 && a < b) [a, b] = [b, a]; if (v === 1 && a === b) a += 100;
    const add = v === 0, ans = add ? a + b : a - b;
    const q = add ? `${w} spends ${money(a)} on a backpack and ${money(b)} on a lunch box. How much is that in all? (in dollars)` : `${w} had ${money(a)} and spent ${money(b)}. How much is left? (in dollars)`;
    return num(dec(ans / 100), [`${add ? 'Add' : 'Subtract'} like whole numbers: ${a} ${add ? '+' : '−'} ${b} = ${ans} cents.`, `${ans} cents is ${money(ans)}.`, `So the answer is ${money(ans)}.`], { q, expr: `(${a}${add ? '+' : '-'}${b})/100` });
  }
  if (v === 2) {
    const items = r.shuffle(['Juice', 'Muffin', 'Apple', 'Sandwich', 'Yogurt']).slice(0, 4), prices = items.map(() => r.int(15, 120) * 5);
    const [i, j] = r.shuffle([0, 1, 2, 3]).slice(0, 2), s = prices[i] + prices[j];
    return num(dec(s / 100), [`${items[i]}: ${money(prices[i])}. ${items[j]}: ${money(prices[j])}.`, `${money(prices[i])} + ${money(prices[j])} = ${money(s)}.`, `So it costs ${money(s)}.`], { q: `How much do ${an(items[i].toLowerCase())} and ${an(items[j].toLowerCase())} cost together? (in dollars)`, visual: { type: 'table', head: ['Item', 'Price'], rows: items.map((it, k) => [it, money(prices[k])]) }, expr: `(${prices[i]}+${prices[j]})/100` });
  }
  const a = r.int(100, 2000) * 5, b = r.bool(0.15) ? a : a + r.nonzero(-60, 60) * 5;
  return signQ(r, money(a), money(b), a, b, [`Compare dollars first, then cents.`, `${money(a)} ${sign(a, b)} ${money(b)}.`]);
});

// ───────────── Time ─────────────
const hm = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const h12 = (h) => ((h + 11) % 12) + 1;
const timeWords = (h, m) => (m <= 30 ? `${m === 15 ? 'quarter' : m === 30 ? 'half' : words(m)} past ${words(h)}` : `${m === 45 ? 'quarter' : words(60 - m)} to ${words(h12(h + 1))}`);
skill('3-clock', 3, 'Time', 'Read clocks, a.m. and p.m., and times in words', ['The short hand shows the hour; the long hand shows the minutes.', 'Count the minutes by 5s, then by 1s.', 'a.m. is from midnight to noon; p.m. is from noon to midnight.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const h = r.int(1, 12), m = r.int(0, 59), right = hm(h, m);
    return mc(r, right, [hm(h, (m + 5) % 60), hm(h12(h + 1), m), hm(h, (m + 30) % 60), hm(h12(h - 1), m)].filter((x) => x !== right), { q: 'What time does the clock show?', visual: { type: 'clock', h, m }, steps: [`The short hand is ${m ? `just past ${h}` : `on ${h}`}.`, `The long hand: ${Math.floor(m / 5)} fives = ${Math.floor(m / 5) * 5}${m % 5 ? `, plus ${m % 5} more = ${m}` : ''} minutes.`, `It is ${right}.`] });
  }
  if (v === 1) {
    const [act, ap, h] = r.pick([['eats breakfast', 'a.m.', 7], ['eats supper', 'p.m.', 6], ['goes to bed', 'p.m.', 8], ['wakes up', 'a.m.', 6], ['walks to school', 'a.m.', 8], ['plays at recess after lunch', 'p.m.', 1], ['watches the sunset', 'p.m.', 7]]);
    return mc(r, ap, [ap === 'a.m.' ? 'p.m.' : 'a.m.'], { q: `${r.pick(NAMES)} ${act} at ${hm(h, 5 * r.int(0, 11))}. Is that a.m. or p.m.?`, steps: [ap === 'a.m.' ? 'This happens in the morning, before noon.' : 'This happens after noon.', `So it is ${ap}`] });
  }
  const h = r.int(1, 12), m = r.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]), right = hm(h, m);
  return mc(r, right, [hm(h12(h + 1), m), hm(h, 60 - m), hm(h12(h - 1), m)].filter((x) => x !== right), { q: `What time is "${timeWords(h, m)}"?`, steps: [m <= 30 ? `"Past" counts minutes after ${h} o'clock: ${m} minutes.` : `"To" counts minutes before ${h12(h + 1)} o'clock: ${60 - m} minutes before is ${m} minutes past ${h}.`, `So it is ${right}.`] });
});
const MONTHS = [['January', 31], ['March', 31], ['April', 30], ['May', 31], ['June', 30], ['July', 31], ['August', 31], ['September', 30], ['October', 31], ['November', 30], ['December', 31]];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
skill('3-timeunits', 3, 'Time', 'Time units, 24-hour time and calendars', ['1 minute = 60 seconds, 1 hour = 60 minutes, 1 day = 24 hours, 1 week = 7 days.', 'In 24-hour time, add 12 to p.m. hours: 3:15 p.m. is 15:15.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const [big, small, k] = r.pick([['minutes', 'seconds', 60], ['hours', 'minutes', 60], ['days', 'hours', 24], ['weeks', 'days', 7]]), n = r.int(2, 6);
    return num(n * k, [`1 ${big.replace(/s$/, '')} = ${k} ${small}.`, `${n} × ${k} = ${n * k}.`, `So ${n} ${big} = ${n * k} ${small}.`], { q: `${n} ${big} = ? ${small}`, expr: `${n}*${k}` });
  }
  if (v === 1) {
    const [name, m] = r.pick([['half an hour', 30], ['a quarter of an hour', 15], ['three quarters of an hour', 45], ['one and a half hours', 90]]);
    return num(m, ['1 hour = 60 minutes.', `${name} is ${m} minutes.`, `So the answer is ${m}.`], { q: `How many minutes are in ${name}?`, expr: String(m) });
  }
  if (v === 2) {
    const h = r.int(1, 11), m = 5 * r.int(0, 11), pm = r.bool();
    const h24 = pm ? h + 12 : h, right = `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    if (r.bool()) return mc(r, right, [`${String(pm ? h : h + 12).padStart(2, '0')}:${String(m).padStart(2, '0')}`, `${String(h24 + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`, `${String(pm ? h + 10 : h + 2).padStart(2, '0')}:${String(m).padStart(2, '0')}`], { q: `What is ${hm(h, m)} ${pm ? 'p.m.' : 'a.m.'} in 24-hour time?`, steps: [pm ? `It is p.m., so add 12 to the hour: ${h} + 12 = ${h24}.` : 'It is a.m., so the hour stays the same (with a 0 in front).', `So it is ${right}.`] });
    const r12 = `${hm(h, m)} ${pm ? 'p.m.' : 'a.m.'}`;
    return mc(r, r12, [`${hm(h, m)} ${pm ? 'a.m.' : 'p.m.'}`, `${hm(h12(h + 2), m)} ${pm ? 'p.m.' : 'a.m.'}`], { q: `What is ${right} in 12-hour time?`, steps: [pm ? `The hour ${h24} is more than 12, so subtract 12: ${h24} − 12 = ${h}. It is p.m.` : 'The hour is less than 12, so it is a.m.', `So it is ${r12}.`] });
  }
  if (v === 3) {
    const [mo, d] = r.pick(MONTHS);
    return num(d, [mo === 'April' || mo === 'June' || mo === 'September' || mo === 'November' ? 'April, June, September and November have 30 days.' : 'All months except February have 30 or 31 days; this one is not one of the 30-day months.', `${mo} has ${d} days.`, `So the answer is ${d}.`], { q: `How many days are in ${mo}?`, expr: String(d) });
  }
  const d0 = r.int(1, 7), wd = r.int(0, 6), add = 7 * r.int(1, 3) + r.int(0, 6), d1 = d0 + add, right = DAYS[(wd + add) % 7];
  return mc(r, right, r.shuffle(DAYS.filter((x) => x !== right)).slice(0, 3), { q: `The ${ord(d0)} of the month is a ${DAYS[wd]}. What day of the week is the ${ord(d1)}?`, steps: [`From the ${ord(d0)} to the ${ord(d1)} is ${add} days: ${Math.floor(add / 7)} full week${add >= 14 ? 's' : ''} and ${add % 7} more day${add % 7 === 1 ? '' : 's'}.`, `Full weeks land on ${DAYS[wd]} again. ${add % 7} more day${add % 7 === 1 ? '' : 's'} after that is ${right}.`] });
});
skill('3-schedule', 3, 'Time', 'Schedules, time patterns and timelines', ['Read a schedule across the row: what happens, when it starts and when it ends.', 'To find how long something lasts, count on from the start time to the end time.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const use24 = r.bool(), evs = r.shuffle(['Swimming', 'Art class', 'Reading time', 'Soccer', 'Music', 'Lunch']).slice(0, 4);
    let t = (use24 ? r.int(13, 15) : r.int(8, 9)) * 60 + 5 * r.int(0, 6); const rows = [];
    for (const e of evs) { const len = 5 * r.int(5, 15); rows.push([e, t, t + len]); t += len + 5 * r.int(0, 3); }
    const fmt = (x) => (use24 ? `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}` : `${hm(h12(Math.floor(x / 60)), x % 60)} ${Math.floor(x / 60) >= 12 ? 'p.m.' : 'a.m.'}`);
    const [e, s, f] = r.pick(rows);
    return num(f - s, [`${e} starts at ${fmt(s)} and ends at ${fmt(f)}.`, `Count on from ${fmt(s)} to ${fmt(f)}: ${f - s} minutes.`, `So ${e} lasts ${f - s} minutes.`], { q: `How many minutes does ${e.toLowerCase()} last?`, visual: { type: 'table', head: ['Activity', 'Starts', 'Ends'], rows: rows.map(([a, b, c]) => [a, fmt(b), fmt(c)]) }, expr: `${f}-${s}` });
  }
  if (v === 1) {
    const step = r.pick([10, 15, 20, 30]), st = r.int(7, 10) * 60 + 5 * r.int(0, 11), seq = [0, 1, 2, 3].map((i) => st + i * step), f = (x) => hm(h12(Math.floor(x / 60)), x % 60);
    const right = f(seq[3]);
    return mc(r, right, [f(seq[3] + 5), f(seq[3] - 5), f(seq[3] + step)].filter((x) => x !== right), { q: `A bus comes at ${seq.slice(0, 3).map(f).join(', ')}. If the pattern goes on, when does the next bus come?`, steps: [`Each bus comes ${step} minutes after the one before.`, `${f(seq[2])} + ${step} minutes = ${right}.`] });
  }
  const k = r.int(3, 60), y = r.int(1900, 2024 - k), thing = r.pick(['A bridge was built', 'A library opened', 'A park opened', 'A school was built']);
  return num(y + k, [`Start at ${y} on the timeline and move ${k} years later.`, `${y} + ${k} = ${y + k}.`, `So it happened in ${y + k}.`], { q: `${thing} in ${y}. A big party was held there ${k} years later. In what year was the party?`, expr: `${y}+${k}` });
});

// ───────────── Coordinate plane ─────────────
const pt = (x, y) => `(${x}, ${y})`;
skill('3-coord', 3, 'Coordinate plane', 'Points on a grid', ['A point is named (across, up).', 'Start at 0, go across to the first number, then up to the second.'], (r) => {
  let x = r.int(0, 9), y = r.int(0, 9); if (x === y) y = (y + 3) % 10;
  if (r.bool(0.6)) return mc(r, pt(x, y), [pt(y, x), pt(x, (y + 1) % 10), pt((x + 1) % 10, y)], { q: 'Which ordered pair names the point?', visual: { type: 'coord', x, y }, steps: [`Go across from 0 to ${x}.`, `Then up to ${y}. The point is ${pt(x, y)}.`] });
  const a = r.int(0, 5), b = r.int(0, 5), dx = r.int(1, 4), dy = r.int(1, 4), place = r.pick(['library', 'park', 'school', 'pool']);
  const right = pt(a + dx, b + dy);
  return mc(r, right, [pt(a + dy, b + dx), pt(a + dx, b), pt(b + dy, a + dx), pt(a + dx - 1, b + dy), pt(a, b + dy)].filter((s) => s !== right), { q: `On a map grid, ${r.pick(NAMES)}'s home is at ${pt(a, b)}. The ${place} is ${dx} units right and ${dy} units up from home. Where is the ${place}?`, visual: { type: 'coord', x: a, y: b }, steps: [`Right ${dx}: ${a} + ${dx} = ${a + dx}. Up ${dy}: ${b} + ${dy} = ${b + dy}.`, `So the ${place} is at ${right}.`] });
});

// ───────────── Data and graphs ─────────────
skill('3-datatable', 3, 'Data and graphs', 'Read tables and frequency tables', ['A table puts information in rows and columns.', 'A frequency table shows how many times each answer was given.'], (r) => {
  const v = r.int(0, 2), topics = r.pick([['Favourite fruit', ['Apple', 'Banana', 'Grapes', 'Mango']], ['Favourite sport', ['Hockey', 'Soccer', 'Swimming', 'Basketball']], ['Way to school', ['Walk', 'Bus', 'Car', 'Bike']]]);
  const labels = topics[1], vals = labels.map(() => r.int(2, 15)), vis = { type: 'table', head: [topics[0], 'Number of students'], rows: labels.map((l, i) => [l, vals[i]]) };
  const [i, j] = r.shuffle([0, 1, 2, 3]).slice(0, 2);
  if (v === 0) return num(vals[i], [`Find the row for ${labels[i]}.`, `It shows ${vals[i]}.`, `So ${vals[i]} students chose ${labels[i].toLowerCase()}.`], { q: `How many students chose ${labels[i].toLowerCase()}?`, visual: vis, expr: String(vals[i]) });
  if (v === 1) { const tot = vals.reduce((a, b) => a + b, 0); return num(tot, [`Add every row: ${vals.join(' + ')}.`, `${vals.join(' + ')} = ${tot}.`, `So ${tot} students answered.`], { q: 'How many students answered in all?', visual: vis, expr: vals.join('+') }); }
  if (vals[i] === vals[j]) vals[i] += 1, vis.rows[i][1] = vals[i];
  const [hi, lo] = vals[i] > vals[j] ? [i, j] : [j, i];
  return num(vals[hi] - vals[lo], [`${labels[hi]}: ${vals[hi]}. ${labels[lo]}: ${vals[lo]}.`, `${vals[hi]} − ${vals[lo]} = ${vals[hi] - vals[lo]}.`, `So ${vals[hi] - vals[lo]} more students chose ${labels[hi].toLowerCase()}.`], { q: `How many more students chose ${labels[hi].toLowerCase()} than ${labels[lo].toLowerCase()}?`, visual: vis, expr: `${vals[hi]}-${vals[lo]}` });
});
skill('3-bargraph', 3, 'Data and graphs', 'Bar graphs', ['Read a bar by looking across from its top to the scale.', 'Compare bars to see which is most, least or how many more.'], (r) => {
  const [title, labels, scales] = r.pick([['Books read by our class', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], [1, 2, 5]], ['Pets owned by students', ['Dogs', 'Cats', 'Fish', 'Birds'], [1, 2]], ['Snowy days', ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'], [1, 2]], ['Tickets sold', ['Mon', 'Tue', 'Wed', 'Thu'], [5, 10]]]), scale = r.pick(scales);
  const vals = labels.map(() => scale * r.int(1, 10)), vis = { type: 'bars', labels, values: vals, title }, v = r.int(0, 3);
  const i = r.int(0, labels.length - 1); let j = r.int(0, labels.length - 1); if (j === i) j = (i + 1) % labels.length;
  if (v === 0) return num(vals[i], [`Find the bar for ${labels[i]} and look across from its top to the scale.`, `It reaches ${vals[i]}.`, `So the answer is ${vals[i]}.`], { q: `${title}: what is the value for ${labels[i]}?`, visual: vis, expr: String(vals[i]) });
  if (v === 1) { const d = Math.abs(vals[i] - vals[j]); return num(d, [`${labels[i]}: ${vals[i]}. ${labels[j]}: ${vals[j]}.`, `The difference is ${Math.max(vals[i], vals[j])} − ${Math.min(vals[i], vals[j])} = ${d}.`, `So the answer is ${d}.`], { q: `${title}: what is the difference between ${labels[i]} and ${labels[j]}?`, visual: vis, expr: `Math.abs(${vals[i]}-${vals[j]})` }); }
  if (v === 2) { const s = vals.reduce((a, b) => a + b, 0); return num(s, [`Read every bar: ${vals.join(', ')}.`, `${vals.join(' + ')} = ${s}.`, `So the total is ${s}.`], { q: `${title}: what is the total of all the bars?`, visual: vis, expr: vals.join('+') }); }
  const most = r.bool(), target = most ? Math.max(...vals) : Math.min(...vals);
  if (vals.filter((x) => x === target).length > 1) return num(vals[i], [`Find the bar for ${labels[i]}.`, `It reaches ${vals[i]}.`, `So the answer is ${vals[i]}.`], { q: `${title}: what is the value for ${labels[i]}?`, visual: vis, expr: String(vals[i]) });
  const right = labels[vals.indexOf(target)];
  return mc(r, right, r.shuffle(labels.filter((x) => x !== right)).slice(0, 3), { q: `${title}: which has the ${most ? 'tallest' : 'shortest'} bar?`, visual: vis, steps: [`Compare the heights: the ${most ? 'greatest' : 'least'} value is ${target}.`, `That bar is ${right}.`] });
});
skill('3-pictograph', 3, 'Data and graphs', 'Pictographs, line plots and Venn diagrams', ['In a pictograph, the key tells what one picture is worth.', 'A line plot puts an X above a number for each answer.', 'In a Venn diagram, things in the middle belong to both circles.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const k = r.pick([2, 5, 10]), names = r.shuffle(['Class A', 'Class B', 'Class C', 'Class D']).slice(0, 3), stars = names.map(() => r.int(1, 7)), i = r.int(0, 2);
    return num(stars[i] * k, [`Key: each ★ = ${k} books. ${names[i]} has ${stars[i]} stars.`, `${stars[i]} × ${k} = ${stars[i] * k}.`, `So ${names[i]} read ${stars[i] * k} books.`], { q: `Each ★ stands for ${k} books. How many books did ${names[i]} read?`, visual: { type: 'table', head: ['Class', `Books read (★ = ${k})`], rows: names.map((n, j) => [n, Array(stars[j]).fill('★').join(' ')]) }, expr: `${stars[i]}*${k}` });
  }
  if (v === 1) {
    const counts = [0, 1, 2, 3, 4].map(() => r.int(0, 6)), more = r.bool(), at = r.int(1, 3);
    if (counts.every((c) => !c)) counts[2] = 3;
    const ans = more ? counts.slice(at + 1).reduce((a, b) => a + b, 0) : counts[at];
    const vis = { type: 'table', head: ['Number of pets', 'Students'], rows: counts.map((c, i) => [i, c ? Array(c).fill('X').join(' ') : '—']) };
    return num(ans, [more ? `Count the Xs above ${at + 1}, 2 and up: ${counts.slice(at + 1).join(' + ')}.` : `Count the Xs above ${at}.`, more ? `${counts.slice(at + 1).join(' + ')} = ${ans}.` : `There are ${ans}.`, `So the answer is ${ans}.`], { q: more ? `The line plot shows how many pets students have. How many students have more than ${at} pet${at === 1 ? '' : 's'}?` : `The line plot shows how many pets students have. How many students have exactly ${at} pet${at === 1 ? '' : 's'}?`, visual: vis, expr: more ? counts.slice(at + 1).join('+') : String(counts[at]) });
  }
  const colour = r.pick(['red', 'blue', 'green']), shape = r.pick(['triangle', 'square', 'circle']);
  const isC = r.bool(), isS = r.bool(), item0 = `${isC ? colour : r.pick(['yellow', 'purple', 'orange'])} ${isS ? shape : r.pick(['star', 'heart', 'oval'])}`, item = `${/^[aeiou]/.test(item0) ? 'an' : 'a'} ${item0}`;
  const right = isC && isS ? 'In the middle, inside both circles' : isC ? `Only in the "${colour}" circle` : isS ? `Only in the "${shape}s" circle` : 'Outside both circles';
  return mc(r, right, ['In the middle, inside both circles', `Only in the "${colour}" circle`, `Only in the "${shape}s" circle`, 'Outside both circles'].filter((x) => x !== right), { q: `A Venn diagram has one circle for "${colour}" shapes and one for "${shape}s". Where does ${item} go?`, steps: [`Is it ${colour}? ${isC ? 'Yes' : 'No'}. Is it a ${shape}? ${isS ? 'Yes' : 'No'}.`, `So it goes: ${right.toLowerCase()}.`] });
});

// ───────────── Units of measurement ─────────────
const UNIT_SETS = {
  length: { units: ['mm', 'cm', 'm', 'km'], what: 'length', items: [['the width of a fingernail', 'mm'], ['the length of a ladybug', 'mm'], ['the length of a pencil', 'cm'], ['the length of a shoe', 'cm'], ['the height of a door', 'm'], ['the length of a soccer field', 'm'], ['the distance from Halifax to Toronto', 'km'], ['the length of a long bike trip', 'km']] },
  mass: { units: ['g', 'kg'], what: 'mass', items: [['a paper clip', 'g'], ['an apple', 'g'], ['a pencil', 'g'], ['a bag of potatoes', 'kg'], ['a dog', 'kg'], ['a bicycle', 'kg']] },
  volume: { units: ['mL', 'L'], what: 'capacity', items: [['a spoonful of medicine', 'mL'], ['a juice box', 'mL'], ['a small cup of milk', 'mL'], ['a bathtub', 'L'], ['a large bucket', 'L'], ['a fish tank', 'L']] },
};
skill('3-metricunit', 3, 'Units of measurement', 'Choose metric units and tools', ['Length: mm, cm, m, km. Mass: g, kg. Capacity: mL, L.', 'Small things use small units; big things use big units.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const key = r.pick(Object.keys(UNIT_SETS)), set = UNIT_SETS[key], [item, u] = r.pick(set.items);
    const q = key === 'length' ? `Which unit is best for measuring ${item}?` : `Which unit is best for measuring the ${set.what} of ${item}?`;
    return mc(r, u, set.units.filter((x) => x !== u), { q, steps: [`Think about how big ${item.replace(/^the /, '')} is.`, `The best unit is ${u}.`] });
  }
  if (v === 1) {
    const [job, tool] = r.pick([['how heavy a pumpkin is', 'scale'], ['how long a table is', 'measuring tape'], ['how much water a pot holds', 'measuring cup'], ['how warm it is outside', 'thermometer'], ['how long recess lasts', 'clock']]);
    return mc(r, tool, r.shuffle(['scale', 'measuring tape', 'measuring cup', 'thermometer', 'clock'].filter((x) => x !== tool)).slice(0, 3), { q: `Which tool would you use to find ${job}?`, steps: [`We are measuring ${job}.`, `A ${tool} measures that.`] });
  }
  const [thing, n, u, how] = r.pick([['a new pencil', 18, 'cm', 'long'], ['a classroom door', 2, 'm', 'tall'], ['a school bus', 12, 'm', 'long'], ['a paper clip', 3, 'cm', 'long'], ['a grain of rice', 5, 'mm', 'long'], ['a hockey stick', 150, 'cm', 'long']]);
  return mc(r, `${n} ${u}`, ['mm', 'cm', 'm', 'km'].filter((x) => x !== u).map((x) => `${n} ${x}`), { q: `About how ${how} is ${thing}?`, steps: [`Picture ${thing} next to things you know.`, `It is about ${n} ${u} ${how}.`] });
});
const CONV = [['m', 'cm', 100], ['km', 'm', 1000], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'mL', 1000]];
skill('3-metricconv', 3, 'Units of measurement', 'Convert and compare metric units', ['1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m.', '1 kg = 1000 g and 1 L = 1000 mL.', 'Big unit to small unit: multiply. Small to big: divide.'], (r) => {
  const [big, small, k] = r.pick(CONV), n = r.int(2, 9), v = r.int(0, 2);
  if (v === 0) return num(n * k, [`1 ${big} = ${k} ${small}.`, `${n} × ${k} = ${n * k}.`, `So ${n} ${big} = ${n * k} ${small}.`], { q: `${n} ${big} = ? ${small}`, expr: `${n}*${k}` });
  if (v === 1) return num(n, [`${k} ${small} make 1 ${big}.`, `${n * k} ÷ ${k} = ${n}.`, `So ${n * k} ${small} = ${n} ${big}.`], { q: `${n * k} ${small} = ? ${big}`, expr: `${n * k}/${k}` });
  const other = r.bool(0.2) ? n * k : n * k + r.nonzero(-5, 5) * Math.max(1, k / 10);
  return signQ(r, `${n} ${big}`, `${other} ${small}`, n * k, other, [`Change ${n} ${big} to ${small}: ${n} × ${k} = ${n * k} ${small}.`, `${n * k} ${small} ${sign(n * k, other)} ${other} ${small}.`]);
});
skill('3-temperature', 3, 'Units of measurement', 'Temperature and measuring length', ['Temperature is measured in degrees Celsius (°C). Water freezes at 0 °C.', 'To measure with a ruler that does not start at 0, subtract the start mark from the end mark.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = 2 * r.int(1, 19) + 1, NL = numberLine(0, 40, { step: 1, marks: [t] });
    return num(t, [St('Each small mark is 1 degree. Every second mark has a number.', NL), `The dot is one mark past ${t - 1}: ${t - 1} + 1 = ${t}.`, `So the temperature is ${t} °C.`], { q: 'This scale is part of a thermometer in °C. What temperature does the dot show?', visual: NL, expr: String(t) });
  }
  if (v === 1) {
    const all = [['a hot summer day', 30], ['a cold winter day in Winnipeg', -20], ['a glass of ice water', 2], ['a warm bath', 38], ['inside a classroom', 21], ['a pot of boiling water', 100]];
    const [what, t] = r.pick(all), f = (x) => `${neg(x)} °C`;
    return mc(r, f(t), r.shuffle(all.filter((x) => x[1] !== t)).slice(0, 3).map((x) => f(x[1])), { q: `What is a reasonable temperature for ${what}?`, steps: [`Think about how ${what} feels.`, `A reasonable temperature is ${f(t)}.`] });
  }
  const a = r.int(1, 6), len = r.int(3, 9), b = a + len, thing = r.pick(['ribbon', 'crayon', 'leaf', 'twig']);
  return num(len, [St(`The ${thing} starts at ${a} cm and ends at ${b} cm.`, numberLine(0, 15, { marks: [a, b] })), `${b} − ${a} = ${len}.`, `So the ${thing} is ${len} cm long.`], { q: `A ${thing} lies along a ruler from the ${a} cm mark to the ${b} cm mark. How long is it, in centimetres?`, expr: `${b}-${a}` });
});

// ───────────── Lines and angles ─────────────
skill('3-lines', 3, 'Lines and angles', 'Lines, rays, segments and angles', ['A line goes on forever both ways. A ray has one endpoint. A segment has two endpoints.', 'Parallel lines never meet. Perpendicular lines meet at a square corner.', 'A right angle is a square corner.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const [d, ans] = r.pick([['goes on forever in both directions', 'line'], ['has one endpoint and goes on forever in one direction', 'ray'], ['has two endpoints', 'line segment']]);
    return mc(r, ans, ['line', 'ray', 'line segment'].filter((x) => x !== ans), { q: `What do we call a straight path that ${d}?`, steps: ['Look at the endpoints: a line has none, a ray has one and a segment has two.', `So it is a ${ans}.`] });
  }
  if (v === 1) {
    const [d, ans] = r.pick([['never meet, like the two rails of a train track', 'parallel'], ['cross to make four square corners, like a plus sign', 'perpendicular'], ['cross, but not at square corners, like the letter X', 'intersecting but not perpendicular']]);
    return mc(r, ans, ['parallel', 'perpendicular', 'intersecting but not perpendicular'].filter((x) => x !== ans), { q: `Two lines ${d}. What kind of lines are they?`, steps: ['Parallel lines never meet; perpendicular lines meet at square corners.', `So these lines are ${ans}.`] });
  }
  const deg = r.pick([30, 40, 45, 60, 70, 90, 90, 110, 120, 135, 150]), ans = deg < 90 ? 'Less than a right angle' : deg === 90 ? 'Equal to a right angle' : 'Greater than a right angle';
  return mc(r, ans, ['Less than a right angle', 'Equal to a right angle', 'Greater than a right angle'].filter((x) => x !== ans), { q: 'How does this angle compare with a right angle?', visual: { type: 'angle', deg }, steps: ['A right angle is a square corner, like the corner of a page.', deg === 90 ? 'This angle is a square corner, so it is equal to a right angle.' : `This angle is ${deg < 90 ? 'narrower' : 'wider'} than a square corner, so it is ${ans.toLowerCase()}.`] });
});

// ───────────── Two-dimensional shapes ─────────────
const regular = (k) => Array.from({ length: k }, (_, i) => { const a = Math.PI / 2 + Math.PI / k + (2 * Math.PI * i) / k; return [+(5 + 4.5 * Math.cos(a)).toFixed(2), +(5 + 4.5 * Math.sin(a)).toFixed(2)]; });
const PNAME = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 8: 'octagon' };
skill('3-polygons', 3, 'Two-dimensional shapes', 'Polygons, sides and vertices', ['A polygon is a closed shape with straight sides.', 'Triangle 3 sides, quadrilateral 4, pentagon 5, hexagon 6, octagon 8.', 'A vertex is a corner where two sides meet.'], (r) => {
  const v = r.int(0, 3), k = r.pick([3, 4, 5, 6, 8]), vis = { type: 'poly', points: regular(k) };
  if (v === 0) { const part = r.pick(['sides', 'vertices']); return num(k, [`Count the ${part} one by one around the shape.`, `There are ${k} ${part}.`, `So the answer is ${k}.`], { q: `How many ${part} does this shape have?`, visual: vis, expr: String(k) }); }
  if (v === 1) return mc(r, PNAME[k], r.shuffle(Object.values(PNAME).filter((x) => x !== PNAME[k])).slice(0, 3), { q: 'What is the name of this polygon?', visual: vis, steps: [`It has ${k} sides.`, `A polygon with ${k} sides is ${an(PNAME[k])}.`] });
  if (v === 2) {
    const curved = r.bool(), s = r.pick(['circle', 'oval', 'heart']);
    return mc(r, curved ? 'No' : 'Yes', [curved ? 'Yes' : 'No'], { q: 'Is this shape a polygon?', visual: curved ? { type: 'shape', name: s } : vis, steps: ['A polygon is closed and has only straight sides.', curved ? 'This shape has a curved side, so it is not a polygon.' : `This shape is closed with ${k} straight sides, so it is a polygon.`] });
  }
  const [a, b] = r.shuffle([3, 4, 5, 6, 8]).slice(0, 2), big = Math.max(a, b), small = Math.min(a, b);
  return num(big - small, [`${cap(an(PNAME[big]))} has ${big} sides. ${cap(an(PNAME[small]))} has ${small} sides.`, `${big} − ${small} = ${big - small}.`, `So the answer is ${big - small}.`], { q: `How many more sides does ${an(PNAME[big])} have than ${an(PNAME[small])}?`, expr: `${big}-${small}` });
});
const QUADS = {
  square: { pts: [[2, 2], [7, 2], [7, 7], [2, 7]], wrong: ['trapezoid', 'kite', 'triangle'] },
  rectangle: { pts: [[1, 2], [9, 2], [9, 6], [1, 6]], wrong: ['rhombus', 'trapezoid', 'kite'] },
  rhombus: { pts: [[5, 1], [8, 5], [5, 9], [2, 5]], wrong: ['rectangle', 'trapezoid', 'square'] },
  parallelogram: { pts: [[1, 2], [7, 2], [9, 7], [3, 7]], wrong: ['rectangle', 'square', 'kite'] },
  trapezoid: { pts: [[1, 2], [9, 2], [7, 7], [3, 7]], wrong: ['rectangle', 'square', 'rhombus'] },
};
skill('3-triquad', 3, 'Two-dimensional shapes', 'Quadrilaterals and triangles', ['Square: 4 equal sides and 4 right angles. Rectangle: 4 right angles.', 'Rhombus: 4 equal sides. Parallelogram: 2 pairs of parallel sides. Trapezoid: 1 pair of parallel sides.', 'Triangles: equilateral (3 equal sides), isosceles (2 equal), scalene (none equal).'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const name = r.pick(Object.keys(QUADS)), Q = QUADS[name];
    const why = { square: '4 equal sides and 4 right angles', rectangle: '4 right angles, but the sides are not all equal', rhombus: '4 equal sides, but no right angles', parallelogram: '2 pairs of parallel sides, but no right angles and the sides are not all equal', trapezoid: 'exactly 1 pair of parallel sides' }[name];
    return mc(r, name, Q.wrong, { q: 'What is the best name for this quadrilateral?', visual: { type: 'poly', points: Q.pts, grid: true }, steps: [`It has ${why}.`, `So the best name is ${name}.`] });
  }
  if (v === 1) {
    const kind = r.pick(['equilateral', 'isosceles', 'scalene']), s = r.int(3, 9);
    const pts = kind === 'equilateral' ? [[1, 1], [9, 1], [5, 7.93]] : kind === 'isosceles' ? [[2, 1], [8, 1], [5, 8]] : [[1, 1], [9, 1], [3, 6]];
    const labels = kind === 'isosceles' ? [`${s} cm`, `${s + 2} cm`, `${s + 2} cm`] : kind === 'scalene' ? [`${s + 2} cm`, `${s + 1} cm`, `${s} cm`] : [`${s} cm`, `${s} cm`, `${s} cm`];
    return mc(r, kind, ['equilateral', 'isosceles', 'scalene'].filter((x) => x !== kind), { q: 'What kind of triangle is this, by its sides?', visual: { type: 'poly', points: pts, labels }, steps: [`The sides are ${labels.join(', ')}.`, kind === 'equilateral' ? 'All three sides are equal: equilateral.' : kind === 'isosceles' ? 'Exactly two sides are equal: isosceles.' : 'No sides are equal: scalene.'] });
  }
  if (v === 2) {
    const kind = r.pick(['acute', 'right', 'obtuse']);
    let a, b; if (kind === 'right') { a = 90; b = r.int(20, 70); } else if (kind === 'obtuse') { a = r.int(100, 140); b = r.int(15, 165 - a); } else { a = r.int(50, 80); b = r.int(Math.max(50, 101 - a), 80); }
    const angles = r.shuffle([a, b, 180 - a - b]);
    return mc(r, kind, ['acute', 'right', 'obtuse'].filter((x) => x !== kind), { q: `A triangle has angles of ${angles.join('°, ')}°. What kind of triangle is it?`, steps: ['Right: one angle is 90°. Obtuse: one angle is more than 90°. Acute: all angles are less than 90°.', kind === 'right' ? 'One angle is 90°, so it is a right triangle.' : kind === 'obtuse' ? `${Math.max(...angles)}° is more than 90°, so it is obtuse.` : 'Every angle is less than 90°, so it is acute.'] });
  }
  const name = r.pick(['square', 'rectangle', 'rhombus', 'parallelogram']), ask = (r.bool() || name === 'rhombus' || name === 'parallelogram') ? 'parallel' : 'right';
  const ans = ask === 'parallel' ? 2 : 4;
  return num(ans, [ask === 'parallel' ? `Opposite sides of a ${name} are parallel.` : `Every corner of a ${name} is a square corner.`, ask === 'parallel' ? `That makes ${ans} pairs of parallel sides.` : `It has ${ans} right angles.`, `So the answer is ${ans}.`], { q: ask === 'parallel' ? `How many pairs of parallel sides does a ${name} have?` : `How many right angles does a ${name} have?`, visual: { type: 'poly', points: QUADS[name].pts, grid: true }, expr: String(ans) });
});
skill('3-transform', 3, 'Two-dimensional shapes', 'Slides, flips, turns, symmetry and congruence', ['A slide moves a shape without turning it. A flip makes a mirror image. A turn spins it around a point.', 'A line of symmetry folds a shape into two matching halves.', 'Congruent shapes have the same size and the same shape.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [d, ans] = r.pick([['moves 3 squares to the right without turning or flipping', 'slide (translation)'], ['is flipped over a line so it becomes a mirror image', 'flip (reflection)'], ['spins a quarter turn around one corner', 'turn (rotation)'], ['moves 2 squares down and stays facing the same way', 'slide (translation)']]);
    return mc(r, ans, ['slide (translation)', 'flip (reflection)', 'turn (rotation)'].filter((x) => x !== ans), { q: `A shape ${d}. What kind of move is it?`, steps: ['Slide: same way, new place. Flip: mirror image. Turn: spun around a point.', `So it is a ${ans}.`] });
  }
  if (v === 1) {
    const [name, pts, n] = r.pick([['square', QUADS.square.pts, 4], ['rectangle', QUADS.rectangle.pts, 2], ['equilateral triangle', [[1, 1], [9, 1], [5, 7.93]], 3], ['regular hexagon', regular(6), 6], ['rhombus', QUADS.rhombus.pts, 2], ['isosceles triangle', [[2, 1], [8, 1], [5, 8]], 1]]);
    return num(n, [`Look for every fold line that makes two matching halves of the ${name}.`, `A ${name} has ${n} line${n === 1 ? '' : 's'} of symmetry.`, `So the answer is ${n}.`], { q: `How many lines of symmetry does this ${name} have?`, visual: { type: 'poly', points: pts }, expr: String(n) });
  }
  if (v === 2) {
    const yes = r.pick(['A', 'H', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y']), no = r.shuffle(['F', 'G', 'J', 'L', 'N', 'P', 'Q', 'R', 'S', 'Z']).slice(0, 3);
    return mc(r, yes, no, { q: 'Which letter has a line of symmetry?', steps: ['Imagine folding each letter down the middle.', `${yes} folds into two matching halves, so it has a line of symmetry.`] });
  }
  const s = r.int(3, 8), shape = r.pick(['square', 'equilateral triangle']);
  return mc(r, `${an(shape)} with ${s} cm sides`, [`${an(shape)} with ${s + 2} cm sides`, `${an(shape)} with ${s - 1} cm sides`, `a rectangle ${s} cm by ${s + 3} cm`], { q: `Which shape is congruent to ${an(shape)} with ${s} cm sides?`, steps: ['Congruent shapes are exactly the same shape and size.', `Only ${an(shape)} with ${s} cm sides matches.`] });
});

// ───────────── Three-dimensional shapes ─────────────
const SOLID = { cube: [6, 12, 8], 'rectangular prism': [6, 12, 8], 'triangular prism': [5, 9, 6], 'square-based pyramid': [5, 8, 5], 'triangular pyramid': [4, 6, 4] };
const SOLID_D = [['6 square faces that are all the same size', 'cube'], ['6 rectangle faces, not all squares', 'rectangular prism'], ['2 triangle faces and 3 rectangle faces', 'triangular prism'], ['a square base and 4 triangle faces that meet at a point', 'square-based pyramid'], ['2 flat circle faces and one curved surface', 'cylinder'], ['1 flat circle face, a curved surface and a point at the top', 'cone'], ['only a curved surface, like a ball', 'sphere']];
function solidGen(r, v) {
  const all = ['cube', 'rectangular prism', 'triangular prism', 'square-based pyramid', 'cylinder', 'cone', 'sphere'];
  if (v === 0) { const [d, ans] = r.pick(SOLID_D); return mc(r, ans, r.shuffle(all.filter((x) => x !== ans)).slice(0, 3), { q: `Which 3-D shape has ${d}?`, steps: [`Picture a shape with ${d}.`, `That is a ${ans}.`] }); }
  if (v === 1) {
    const name = r.pick(Object.keys(SOLID)), i = r.int(0, 2), part = ['faces', 'edges', 'vertices'][i], n = SOLID[name][i];
    return num(n, [`A ${name} has ${SOLID[name][0]} faces, ${SOLID[name][1]} edges and ${SOLID[name][2]} vertices.`, `We want the ${part}: ${n}.`, `So the answer is ${n}.`], { q: `How many ${part} does a ${name} have?`, expr: String(n) });
  }
  if (v === 2) {
    const [obj, ans] = r.pick([['a soup can', 'cylinder'], ['a basketball', 'sphere'], ['a number cube from a board game', 'cube'], ['an ice cream cone', 'cone'], ['a cereal box', 'rectangular prism'], ['a party hat', 'cone'], ['a roll of paper towels', 'cylinder'], ['a globe', 'sphere']]);
    return mc(r, ans, r.shuffle(all.filter((x) => x !== ans)).slice(0, 3), { q: `What 3-D shape is ${obj} most like?`, steps: [`Think about the faces and curves of ${obj}.`, `It is shaped like a ${ans}.`] });
  }
  const [net, ans] = r.pick([['6 squares', 'cube'], ['2 circles and a rectangle', 'cylinder'], ['1 square and 4 triangles', 'square-based pyramid'], ['2 triangles and 3 rectangles', 'triangular prism'], ['4 triangles', 'triangular pyramid']]);
  return mc(r, ans, r.shuffle(['cube', 'cylinder', 'square-based pyramid', 'triangular prism', 'triangular pyramid'].filter((x) => x !== ans)).slice(0, 3), { q: `A net is made of ${net}. What shape does it fold into?`, steps: ['Each flat piece of the net becomes one face.', `${cap(net)} fold into a ${ans}.`] });
}
skill('3-solids', 3, 'Three-dimensional shapes', 'Name 3-D shapes', ['Prisms have two matching ends; pyramids have faces that meet at a point.', 'Cylinders, cones and spheres have curved surfaces.'], (r) => solidGen(r, r.pick([0, 2])));
skill('3-solidparts', 3, 'Three-dimensional shapes', 'Faces, edges, vertices and nets', ['A face is a flat surface, an edge is where two faces meet, and a vertex is a corner.', 'A net is a flat pattern that folds into a 3-D shape.'], (r) => solidGen(r, r.pick([1, 3])));

// ───────────── Perimeter, area and volume ─────────────
const lShape = (W, H, w2, h1) => [[0.5, 0.5], [W + 0.5, 0.5], [W + 0.5, h1 + 0.5], [w2 + 0.5, h1 + 0.5], [w2 + 0.5, H + 0.5], [0.5, H + 0.5]];
skill('3-perim2', 3, 'Perimeter, area and volume', 'Perimeter of polygons and missing sides', ['Perimeter is the distance all the way around: add every side.', 'If you know the perimeter, subtract the known sides to find a missing one.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const k = r.pick([3, 4, 5, 6]), sides = Array.from({ length: k }, () => r.int(2, 12)), P = sides.reduce((a, b) => a + b, 0);
    return num(P, [`Add all ${k} sides: ${sides.join(' + ')}.`, `${sides.join(' + ')} = ${P}.`, `So the perimeter is ${P} cm.`], { q: 'What is the perimeter of this shape, in centimetres? (not drawn to scale)', visual: { type: 'poly', points: regular(k), labels: sides.map((s) => `${s} cm`) }, expr: sides.join('+') });
  }
  if (v === 1) {
    const l = r.int(3, 15), w = r.int(2, 12), P = 2 * (l + w);
    if (r.bool()) return num(w, [`Two lengths: ${l} + ${l} = ${2 * l}. That leaves ${P} − ${2 * l} = ${2 * w} for the two widths.`, `${2 * w} ÷ 2 = ${w}.`, `So the width is ${w} m.`], { q: `A rectangle has a perimeter of ${P} m. Its length is ${l} m. What is its width, in metres?`, expr: `(${P}-2*${l})/2` });
    const s = r.int(2, 15);
    return num(s, ['A square has 4 equal sides.', `${4 * s} ÷ 4 = ${s}.`, `So each side is ${s} cm.`], { q: `A square has a perimeter of ${4 * s} cm. How long is each side, in centimetres?`, expr: `${4 * s}/4` });
  }
  if (v === 2) {
    const W = r.int(4, 9), H = r.int(4, 9), w2 = r.int(1, W - 2), h1 = r.int(1, H - 2), sides = [W, h1, W - w2, H - h1, w2, H], P = 2 * (W + H);
    return num(P, [`Add every side: ${sides.join(' + ')}.`, `${sides.join(' + ')} = ${P}.`, `So the perimeter is ${P} m.`], { q: 'What is the perimeter of this shape, in metres?', visual: { type: 'poly', points: lShape(W, H, w2, h1), labels: sides.map((x) => `${x} m`) }, expr: sides.join('+') });
  }
  const l = r.int(4, 20), w = r.int(2, 15), w0 = r.pick(NAMES);
  return num(2 * (l + w), [`The fence goes all the way around: ${l} + ${w} + ${l} + ${w}.`, `${l} + ${w} + ${l} + ${w} = ${2 * (l + w)}.`, `So ${w0} needs ${2 * (l + w)} m of fence.`], { q: `${w0} puts a fence around a garden ${l} m long and ${w} m wide. How many metres of fence are needed?`, expr: `2*(${l}+${w})` });
});
skill('3-area2', 3, 'Perimeter, area and volume', 'Area of rectangles and other shapes', ['Area counts the unit squares inside a shape.', 'For a rectangle, multiply length × width.', 'Split other shapes into rectangles and add their areas.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const rows = r.int(2, 6), cols = r.int(2, 8); return num(rows * cols, [`There are ${rows} rows of ${cols} squares.`, `${rows} × ${cols} = ${rows * cols}.`, `So the area is ${rows * cols} square units.`], { q: 'What is the area of this rectangle, in square units?', visual: { type: 'grid', rows, cols }, expr: `${rows}*${cols}` }); }
  if (v === 1) { const l = r.int(2, 10), w = r.int(2, 10); return num(w, [`Area = length × width, so ${l} × ? = ${l * w}.`, `${l * w} ÷ ${l} = ${w}.`, `So the missing side is ${w} cm.`], { q: `A rectangle has an area of ${l * w} square centimetres. One side is ${l} cm. How long is the other side, in centimetres?`, expr: `${l * w}/${l}` }); }
  if (v === 2) {
    const W = r.int(4, 9), H = r.int(4, 9), w2 = r.int(1, W - 2), h1 = r.int(1, H - 2), A = W * h1 + w2 * (H - h1);
    return num(A, [`Split the shape into two rectangles: a bottom one ${W} × ${h1} and a top one ${w2} × ${H - h1}.`, `${W} × ${h1} = ${W * h1} and ${w2} × ${H - h1} = ${w2 * (H - h1)}.`, `Add: ${W * h1} + ${w2 * (H - h1)} = ${A}.`, `So the area is ${A} square units.`], { q: 'Count or split: what is the area of this shape, in square units?', visual: { type: 'poly', points: lShape(W, H, w2, h1), grid: true }, expr: `${W}*${h1}+${w2}*(${H}-${h1})` });
  }
  const l = r.int(3, 9), w = r.int(2, 8), A = l * w;
  return mc(r, `${l} cm by ${w} cm`, [`${l + 1} cm by ${w} cm`, `${l} cm by ${w + 2} cm`, `${l + w} cm by 2 cm`].filter((x) => { const [p, q] = x.split(' cm by ').map(parseFloat); return p * q !== A; }), { q: `Which rectangle has an area of ${A} square centimetres?`, steps: ['Multiply length × width for each one.', `${l} × ${w} = ${A}, so ${l} cm by ${w} cm is the one.`] });
});
skill('3-volume', 3, 'Perimeter, area and volume', 'Volume with cubes', ['Volume is how many unit cubes fill a box.', 'Find the cubes in one layer, then multiply by the number of layers.'], (r) => {
  const l = r.int(2, 6), w = r.int(2, 5), h = r.int(1, 4);
  if (r.bool()) return num(l * w * h, [St(`One layer has ${l} × ${w} = ${l * w} cubes.`, { type: 'grid', rows: w, cols: l }), `There ${h === 1 ? 'is 1 layer' : `are ${h} layers`}: ${l * w} × ${h} = ${l * w * h}.`, `So the volume is ${l * w * h} cubic units.`], { q: `A box is ${l} cubes long, ${w} cubes wide and ${h} cube${h === 1 ? '' : 's'} high. How many unit cubes fill it?`, expr: `${l}*${w}*${h}` });
  return num(l * w * h, [`Each layer has ${l * w} cubes.`, `${l * w} × ${h} = ${l * w * h}.`, `So there are ${l * w * h} cubes.`], { q: `${r.pick(NAMES)} builds a stack of ${h} layer${h === 1 ? '' : 's'}. Each layer is the grid below, one cube on each square. What is the volume, in cubes?`, visual: { type: 'grid', rows: w, cols: l }, expr: `${l * w}*${h}` });
});

// ───────────── Understand fractions ─────────────
const FNAME = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'], 10: ['tenth', 'tenths'] };
skill('3-fracparts', 3, 'Understand fractions', 'Equal parts and unit fractions', ['A fraction names equal parts of a whole.', 'If a whole is cut into 4 equal parts, each part is one fourth, 1/4.', 'The parts must be the same size.'], (r) => {
  const v = r.int(0, 3), d = r.pick([2, 3, 4, 5, 6, 8, 10]);
  if (v === 0) { const n = r.int(1, d - 1); return num(`${d - n}/${d}`, [`There are ${d} equal parts and ${n} ${n === 1 ? 'is' : 'are'} shaded.`, `${d} − ${n} = ${d - n} are not shaded.`.replace(/= 1 are/, '= 1 is'), `So ${d - n}/${d} is not shaded.`], { q: 'What fraction of the bar is NOT shaded?', visual: { type: 'fraction', n, d }, expr: `${d - n}/${d}` }); }
  if (v === 1) {
    const thing = r.pick(['pizza', 'pie', 'cake', 'chocolate bar']), right = `one ${FNAME[d][0]} (1/${d})`;
    return mc(r, right, r.shuffle(Object.keys(FNAME).filter((x) => +x !== d)).slice(0, 3).map((x) => `one ${FNAME[x][0]} (1/${x})`), { q: `A ${thing} is cut into ${d} equal pieces. What is one piece called?`, steps: [`${d} equal pieces make the whole.`, `One piece is ${right}.`] });
  }
  if (v === 2) {
    const equal = r.bool(), k = r.pick([2, 3, 4]);
    return mc(r, equal ? 'Yes' : 'No', [equal ? 'No' : 'Yes'], { q: `A sandwich is cut into ${k} pieces that are ${equal ? 'all the same size' : 'different sizes'}. Is each piece one ${FNAME[k][0]}?`, steps: ['Fractions need equal parts.', equal ? `The ${k} pieces are equal, so each is 1/${k}: yes.` : 'The pieces are not equal, so each piece is not one ' + FNAME[k][0] + ': no.'] });
  }
  return num(d, [`1/${d} means 1 of ${d} equal parts.`, `${d} parts of 1/${d} fill the whole.`, `So it takes ${d}.`], { q: `How many pieces of 1/${d} make one whole?`, visual: { type: 'fraction', n: 1, d }, expr: String(d) });
});
skill('3-fracgroup', 3, 'Understand fractions', 'Fractions of a group and unit fractions', ['A fraction can name part of a group: 3 of 8 balls is 3/8 of the balls.', 'Any fraction is made of unit fractions: 3/5 = 1/5 + 1/5 + 1/5.'], (r) => {
  const v = r.int(0, 2), d = r.int(3, 10), n = r.int(1, d - 1);
  if (v === 0) {
    const [thing, obj, col] = r.pick([['balls', 'ball', 'red'], ['apples', 'apple', 'green'], ['fish', 'fish', 'orange'], ['stars', 'star', 'yellow']]);
    return num(`${n}/${d}`, [St(`There are ${d} ${thing} in the group. That is the bottom number.`, { type: 'objects', n: d, obj }), `${n} ${n === 1 ? 'is' : 'are'} ${col}. That is the top number.`, `So ${n}/${d} of the ${thing} are ${col}.`], { q: `There are ${d} ${thing}. ${n} of them ${n === 1 ? 'is' : 'are'} ${col}. What fraction of the ${thing} are ${col}?`, expr: `${n}/${d}` });
  }
  const m = Math.max(n, 2);
  if (v === 1) return num(`1/${d}`, [St(`${m}/${d} is ${m} pieces of 1/${d}.`, fractionBars([{ n: m, d }])), `The sentence shows ${m - 1} of them, so one more 1/${d} is needed.`, `So the missing fraction is 1/${d}.`], { q: `${m}/${d} = ${Array(m - 1).fill(`1/${d}`).join(' + ')} + ?`, expr: `1/${d}` });
  const right = Array(m).fill(`1/${d}`).join(' + ');
  return mc(r, right, [Array(m + 1).fill(`1/${d}`).join(' + '), Array(m).fill(`1/${d + 1}`).join(' + '), `${m}/${d} + 1/${d}`], { q: `Which shows ${m}/${d} as a sum of unit fractions?`, steps: [St(`${m}/${d} means ${m} parts, each 1/${d}.`, fractionBars([{ n: m, d }])), `So ${m}/${d} = ${right}.`] });
});

// ───────────── Fractions on number lines ─────────────
skill('3-fracline', 3, 'Fractions on number lines', 'Fractions on number lines', ['Split the space from 0 to 1 into equal parts. Each part is a unit fraction.', 'Count the parts from 0 to name the point: 3 parts of 1/4 is 3/4.'], (r) => {
  const v = r.int(0, 3), d = r.pick([2, 3, 4, 6, 8]), k = r.int(1, d - 1);
  if (v === 0) return num(`${k}/${d}`, [St(`From 0 to 1 there are ${d} equal parts, so each part is 1/${d}.`, fractionBars([{ n: k, d }])), `The point is ${k} part${k === 1 ? '' : 's'} from 0.`, `So the point is at ${k}/${d}.`], { q: `A number line from 0 to 1 is cut into ${d} equal parts. A point is on the ${ord(k)} mark after 0. What fraction is at the point?`, expr: `${k}/${d}` });
  if (v === 1) { const K = d + r.int(1, d - 1); return num(`${K}/${d}`, [`Each whole is cut into ${d} parts, so each part is 1/${d}.`, `The point is ${K} parts from 0, past 1.`, `So the point is at ${K}/${d}.`], { q: `A number line from 0 to 2 has each whole cut into ${d} equal parts. A point is on the ${ord(K)} mark after 0. What fraction is at the point?`, expr: `${K}/${d}` }); }
  if (v === 2) return num(k, [`Each mark after 0 adds 1/${d}.`, `${k}/${d} is ${k} jump${k === 1 ? '' : 's'} of 1/${d} from 0.`, `So it is mark number ${k}.`], { q: `A number line from 0 to 1 is cut into ${d} equal parts. Counting from 0, which mark shows ${k}/${d}? (give the mark number)`, expr: String(k) });
  const D = r.pick([3, 4, 6, 8]); let j = r.int(1, D - 1), kk = r.int(1, D - 1); if (j === kk) kk = j === D - 1 ? j - 1 : j + 1;
  const big = Math.max(j, kk), small = Math.min(j, kk);
  return mc(r, `${big}/${D}`, [`${small}/${D}`, 'They are the same distance'], { q: `On a number line, which is farther from 0: ${j}/${D} or ${kk}/${D}?`, steps: [`Both count jumps of 1/${D} from 0.`, `${big} jumps is farther than ${small}, so ${big}/${D} is farther from 0.`] });
});

// ───────────── Fraction word problems ─────────────
skill('3-fracword', 3, 'Fraction word problems', 'Fraction word problems', ['The whole is cut into equal parts; the bottom number says how many.', 'To find a fraction of a group, split the group into equal parts, then take the parts you need.'], (r) => {
  const v = r.int(0, 3), d = r.pick([3, 4, 5, 6, 8]), w = r.pick(NAMES);
  if (v === 0) { const a = r.int(1, d - 1); return num(`${d - a}/${d}`, [St(`The whole pizza is ${d}/${d}.`, fractionBars([{ n: d - a, d }])), `${d}/${d} − ${a}/${d} = ${d - a}/${d}.`, `So ${d - a}/${d} of the pizza is left.`], { q: `A pizza is cut into ${d} equal slices. ${w} eats ${a}/${d} of it. What fraction of the pizza is left?`, expr: `${d - a}/${d}` }); }
  if (v === 1) return num(`1/${d}`, [`The ribbon is cut into ${d} equal pieces.`, `Each piece is 1 of ${d} parts: 1/${d}.`, `So each piece is 1/${d} of the ribbon.`], { q: `${w} cuts a ribbon into ${d} equal pieces. What fraction of the ribbon is each piece?`, expr: `1/${d}` });
  const g = r.int(2, 6), total = d * g, a = v === 2 ? 1 : r.int(2, d - 1);
  return num(a * g, [`Split ${total} into ${d} equal groups: ${total} ÷ ${d} = ${g}.`, a === 1 ? `1/${d} is one group: ${g}.` : `${a}/${d} is ${a} groups: ${a} × ${g} = ${a * g}.`, `So ${a * g} students walk to school.`], { q: `There are ${total} students in a class. ${a}/${d} of them walk to school. How many students walk?`, expr: `${total}/${d}*${a}` });
});

// ───────────── Equivalent fractions ─────────────
skill('3-equivfrac', 3, 'Equivalent fractions', 'Equivalent fractions', ['Equivalent fractions name the same amount: 1/2 = 2/4 = 4/8.', 'Fraction bars that line up show equal amounts.', 'Lowest terms means the top and bottom cannot be divided by the same number any more.'], (r) => {
  const v = r.int(0, 2), d = r.pick([2, 3, 4]), n = r.int(1, d - 1), k = r.pick([2, 2, 3, 4].filter((x) => d * x <= 12));
  if (v === 0) return num(n * k, [St(`${d} × ${k} = ${d * k}, so each part is cut into ${k}.`, fractionBars([{ n, d }, { n: n * k, d: d * k }])), `Then the shaded parts are ${n} × ${k} = ${n * k}.`, `So ${n}/${d} = ${n * k}/${d * k}.`], { q: `${n}/${d} = ?/${d * k}`, expr: `${n}*${k}` });
  if (v === 1) {
    const right = `${n * k}/${d * k}`;
    return mc(r, right, [`${n * k}/${d * k + 1}`, `${n + 1}/${d * k}`, `${n * k + 1}/${d * k}`].filter((x) => x !== right), { q: `Which fraction is equal to ${n}/${d}?`, steps: [St('Line up the fraction bars.', fractionBars([{ n, d }, { n: n * k, d: d * k }])), `Both bars show the same amount, so ${n}/${d} = ${right}.`] });
  }
  const g = gcd(n * k, d * k), [p, q] = [n * k / g, d * k / g];
  return num(`${p}/${q}`, [St(`${n * k} and ${d * k} can both be divided by ${g}.`, fractionBars([{ n: n * k, d: d * k }, { n: p, d: q }])), `${n * k} ÷ ${g} = ${p} and ${d * k} ÷ ${g} = ${q}.`, `So ${n * k}/${d * k} in lowest terms is ${p}/${q}.`], { q: `Write ${n * k}/${d * k} in lowest terms.`, exactForm: 'fraction', expr: `${p}/${q}` });
});

// ───────────── Compare and order fractions ─────────────
skill('3-fracorder', 3, 'Compare and order fractions', 'Compare and order fractions', ['Same bottom number: more parts means more.', 'Same top number: a bigger bottom number means smaller pieces, so less.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const n = r.int(1, 4), ds = [2, 3, 4, 6, 8].filter((x) => x > n); const a = r.pick(ds); let b = r.pick(ds); if (r.bool(0.15)) b = a;
    return signQ(r, `${n}/${a}`, `${n}/${b}`, n / a, n / b, [St(a === b ? 'The fractions are the same.' : `Both have ${n} part${n === 1 ? '' : 's'}. Pieces of 1/${Math.min(a, b)} are bigger than pieces of 1/${Math.max(a, b)}.`, fractionBars([{ n, d: a }, { n, d: b }])), `So ${n}/${a} ${sign(n / a, n / b)} ${n}/${b}.`]);
  }
  if (v === 1) {
    const same = r.bool();
    let fr;
    if (same) { const d = r.pick([5, 6, 8, 10, 12]); fr = r.shuffle([...Array(d - 1).keys()].map((i) => i + 1)).slice(0, 3).map((n) => [n, d]); }
    else { const n = r.int(1, 3); fr = r.shuffle([4, 5, 6, 8, 10, 12]).slice(0, 3).map((d) => [n, d]); }
    const asc = [...fr].sort((x, y) => x[0] / x[1] - y[0] / y[1]), s = (l) => l.map(([a, b]) => `${a}/${b}`).join(', ');
    return mc(r, s(asc), [s([...asc].reverse()), s([asc[1], asc[0], asc[2]]), s([asc[0], asc[2], asc[1]])], { q: `Put in order from least to greatest: ${s(fr)}`, steps: [same ? 'The bottom numbers are the same, so order by the top numbers.' : 'The top numbers are the same, so the biggest bottom number is the least.', `Order: ${s(asc)}.`] });
  }
  const d = r.pick([2, 3, 4]), k = r.pick([2, 3, 4].filter((x) => d * x <= 12)), D = d * k, n = r.int(1, d - 1), m = r.int(1, D - 1);
  return signQ(r, `${n}/${d}`, `${m}/${D}`, n * k, m, [St(`Change ${n}/${d} to ${D}ths: ${n}/${d} = ${n * k}/${D}.`, fractionBars([{ n, d }, { n: m, d: D }])), `Compare ${n * k}/${D} and ${m}/${D}: so ${n}/${d} ${sign(n * k, m)} ${m}/${D}.`]);
});

// ───────────── Relate fractions and decimals ─────────────
skill('3-decfrac', 3, 'Relate fractions and decimals', 'Tenths and hundredths as decimals', ['Tenths: 3/10 = 0.3. Hundredths: 27/100 = 0.27.', 'The first place after the point is tenths; the second is hundredths.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const n = r.int(1, 9); return num(`0.${n}`, [`The bar has 10 equal parts and ${n} ${n === 1 ? 'is' : 'are'} shaded: ${n}/10.`, `${n}/10 = 0.${n}.`, `So the decimal is 0.${n}.`], { q: 'What decimal is shaded?', visual: { type: 'fraction', n, d: 10 }, expr: `${n}/10` }); }
  if (v === 1) {
    const h = r.bool(), n = h ? r.int(1, 99) : r.int(1, 9), D = h ? 100 : 10, ds = h ? (n / 100).toFixed(2) : (n / 10).toFixed(1);
    return num(ds, [`${n}/${D} is ${n} ${h ? 'hundredths' : 'tenths'}.`, `${n}/${D} = ${ds}.`, `So the decimal is ${ds}.`], { q: `Write ${n}/${D} as a decimal.`, expr: `${n}/${D}` });
  }
  if (v === 2) {
    const n = r.int(11, 99), ds = (n / 100).toFixed(2);
    return mc(r, `${n}/100`, [`${n}/10`, `${Math.floor(n / 10)}/100`, `${n}/1000`], { q: `Which fraction is equal to ${ds}?`, steps: [`${ds} has two places after the point: hundredths.`, `So ${ds} = ${n}/100.`] });
  }
  const t = 2 * r.int(0, 14) + 1, NL = numberLine(0, 3, { step: 0.1, marks: [t / 10] });
  return num(dec(t / 10), [St('Each small mark is 0.1. Every second mark has a number.', NL), `The dot is one mark past ${dec((t - 1) / 10)}: ${dec((t - 1) / 10)} + 0.1 = ${dec(t / 10)}.`, `So the dot is at ${dec(t / 10)}.`], { q: 'What decimal is at the dot?', visual: NL, expr: `${t}/10` });
});

// ───────────── Decimals ─────────────
skill('3-decplace', 3, 'Decimals', 'Decimal place value', ['In 4.27, the 4 is ones, the 2 is tenths and the 7 is hundredths.', '0.5 and 0.50 are equal: 5 tenths is 50 hundredths.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), x = `${ds[0]}.${ds[1]}${ds[2]}`, i = r.int(0, 2), place = ['ones', 'tenths', 'hundredths'][i];
    return mc(r, place, ['ones', 'tenths', 'hundredths', 'tens'].filter((p) => p !== place), { q: `In ${x}, which place is the digit ${ds[i]} in?`, steps: [`${x}: ${ds[0]} ones, ${ds[1]} tenths, ${ds[2]} hundredths.`, `The ${ds[i]} is in the ${place} place.`] });
  }
  if (v === 1) {
    const a = r.int(1, 9), b = r.int(0, 9), c = r.int(1, 9), x = `${a}.${b}${c}`;
    return num(x, [`${a} ones, ${b} tenths and ${c} hundredths.`, `Write them in order: ${x}.`, `So the number is ${x}.`], { q: `${a} + ${b}/10 + ${c}/100 = ? (as a decimal)`, expr: `${a}+${b}/10+${c}/100` });
  }
  if (v === 2) {
    const a = r.int(1, 9), h = r.bool(), n = h ? r.int(1, 99) : r.int(1, 9), x = h ? `${a}.${String(n).padStart(2, '0')}` : `${a}.${n}`;
    const unit = h ? (n === 1 ? 'hundredth' : 'hundredths') : (n === 1 ? 'tenth' : 'tenths');
    return num(x, [`"${words(a)}" is the whole number part: ${a}.`, `"${words(n)} ${unit}" goes after the point: ${x}.`, `So the number is ${x}.`], { q: `Write as a decimal: ${words(a)} and ${words(n)} ${unit}`, expr: h ? `${a}+${n}/100` : `${a}+${n}/10` });
  }
  const n = r.int(1, 9), right = `0.${n}0`;
  return mc(r, right, [`0.0${n}`, `${n}.0`, `0.${n}${n}`], { q: `Which decimal is equal to 0.${n}?`, steps: [`0.${n} is ${n} tenths, which is ${n}0 hundredths.`, `So 0.${n} = ${right}.`] });
});
skill('3-deccompare', 3, 'Decimals', 'Compare, order and round decimals', ['Line up the decimal points and compare from the left.', '0.7 is more than 0.65, because 7 tenths is more than 6 tenths.'], (r) => {
  const v = r.int(0, 2), f = (c) => (c % 10 === 0 ? (c / 100).toFixed(1) : (c / 100).toFixed(2));
  if (v === 0) {
    const a = r.int(1, 999); let b = r.bool() ? Math.max(1, Math.round(a / 10) * 10 + r.nonzero(-3, 3) * 10) : r.int(1, 999); if (r.bool(0.1)) b = a;
    return signQ(r, f(a), f(b), a, b, [`Line up the points: ${(a / 100).toFixed(2)} and ${(b / 100).toFixed(2)}.`, `Compare from the left: ${f(a)} ${sign(a, b)} ${f(b)}.`]);
  }
  if (v === 1) {
    const s = new Set(); while (s.size < 4) s.add(r.int(1, 99) * 10 + (r.bool() ? r.int(1, 9) : 0));
    const xs = [...s], asc = [...xs].sort((a, b) => a - b), L = (l) => l.map(f).join(', ');
    return mc(r, L(asc), [L([...asc].reverse()), L([asc[1], asc[0], asc[2], asc[3]]), L([asc[0], asc[2], asc[1], asc[3]])], { q: `Put in order from least to greatest: ${L(xs)}`, steps: ['Compare the whole numbers first, then tenths, then hundredths.', `Order: ${L(asc)}.`] });
  }
  const t = r.int(11, 999), x = dec(t / 10), ans = Math.round(t / 10), lo = Math.floor(t / 10);
  return num(ans, [`${x} is between ${lo} and ${lo + 1}.`, `The tenths digit is ${t % 10}: ${t % 10 >= 5 ? 'round up' : 'round down'}.`, `So ${x} rounds to ${ans}.`], { q: `Round ${x} to the nearest whole number.`, expr: `Math.round(${t}/10)` });
});

// ───────────── Add and subtract decimals ─────────────
skill('3-decadd', 3, 'Add and subtract decimals', 'Add and subtract decimals', ['Line up the decimal points, then add or subtract like whole numbers.', 'Put the point in the answer right under the other points.'], (r) => {
  const v = r.int(0, 3), a = r.int(11, 99) / 10, b = r.int(11, 99) / 10;
  if (v === 0) { const add = r.bool() || a <= b; return num(dec(add ? a + b : a - b), add ? columnAdd([a, b]) : columnSub(a, b), { q: `${a} ${add ? '+' : '−'} ${b} = ?`, expr: `${a}${add ? '+' : '-'}${b}` }); }
  if (v === 1) {
    const w = r.pick(NAMES), c = r.int(11, 49) / 10;
    if (r.bool()) return num(dec(a + b), [...columnAdd([a, b]), `So ${w} ran ${dec(a + b)} km.`], { q: `${w} ran ${a} km on Monday and ${b} km on Tuesday. How many kilometres is that in all?`, expr: `${a}+${b}` });
    const big = dec(Math.max(a, b) + 5);
    return num(dec(Number(big) - c), [...columnSub(big, c), `So ${dec(Number(big) - c)} L is left.`], { q: `A tank holds ${big} L of water. ${w} pours out ${c} L. How many litres are left?`, expr: `${big}-${c}` });
  }
  if (v === 2) {
    const ra = Math.round(a), rb = Math.round(b);
    return num(ra + rb, [`Round each to the nearest whole number: ${a} → ${ra}, ${b} → ${rb}.`, `${ra} + ${rb} = ${ra + rb}.`, `So the estimate is ${ra + rb}.`], { q: `Estimate ${a} + ${b} by rounding each number to the nearest whole number.`, expr: `Math.round(${a})+Math.round(${b})` });
  }
  const st = r.int(1, 20) / 10, k = r.pick([0.1, 0.2, 0.5, 0.25]), seq = [0, 1, 2, 3].map((i) => dec(st + i * k));
  return num(dec(st + 4 * k), [`Each number is ${k} more than the one before.`, `${seq[3]} + ${k} = ${dec(st + 4 * k)}.`, `So the next number is ${dec(st + 4 * k)}.`], { q: `What comes next? ${seq.join(', ')}, ?`, expr: `${st}+4*${k}` });
});

// ───────────── Probability and statistics ─────────────
skill('3-probability', 3, 'Probability and statistics', 'How likely is it?', ['Certain: it will happen. Impossible: it cannot happen.', 'Likely means more chances to happen; unlikely means fewer chances.', 'The colour with more marbles is more likely to be picked.'], (r) => {
  const cols = r.shuffle(['red', 'blue', 'green', 'yellow']).slice(0, 3), cnt = cols.map(() => r.int(1, 9)), v = r.int(0, 2);
  const bag = () => cols.map((c, k) => `${cnt[k]} ${c}`).join(', ');
  if (v === 0) {
    if (r.bool(0.25)) cnt[1] = cnt[0];
    const right = cnt[0] > cnt[1] ? cols[0] : cnt[0] < cnt[1] ? cols[1] : 'Equally likely';
    return mc(r, right, [cols[0], cols[1], 'Equally likely'].filter((x) => x !== right), { q: `A bag has ${bag()} marbles. Which is more likely to be picked: ${cols[0]} or ${cols[1]}?`, steps: [`${cap(cols[0])}: ${cnt[0]}. ${cap(cols[1])}: ${cnt[1]}.`, right === 'Equally likely' ? 'They have the same number, so they are equally likely.' : `There are more ${right} marbles, so ${right} is more likely.`] });
  }
  if (v === 1) {
    const kind = r.pick(['certain', 'impossible', 'likely', 'unlikely']);
    let q, why;
    if (kind === 'certain') { q = `A bag has ${r.int(4, 10)} red marbles and nothing else. How likely is it to pick a red marble?`; why = 'Every marble is red, so it is certain.'; }
    else if (kind === 'impossible') { q = `A bag has ${bag()} marbles. How likely is it to pick a purple marble?`; why = 'There are no purple marbles, so it is impossible.'; }
    else { const big = r.int(7, 12), small = r.int(1, 3), pickBig = kind === 'likely'; q = `A spinner has ${big} ${cols[0]} parts and ${small} ${cols[1]} part${small === 1 ? '' : 's'}, all the same size. How likely is it to land on ${pickBig ? cols[0] : cols[1]}?`; why = pickBig ? `Most parts are ${cols[0]}, so it is likely.` : `Only a few parts are ${cols[1]}, so it is unlikely.`; }
    return mc(r, kind, ['certain', 'likely', 'unlikely', 'impossible'].filter((x) => x !== kind), { q, steps: ['Certain: always. Likely: most of the time. Unlikely: not often. Impossible: never.', why] });
  }
  const mx = Math.max(...cnt); if (cnt.filter((x) => x === mx).length > 1) cnt[0] = mx + 1;
  const best = cols[cnt.indexOf(Math.max(...cnt))];
  return mc(r, best, cols.filter((x) => x !== best), { q: `A bag has ${bag()} marbles. Which colour are you most likely to pick?`, steps: ['The colour with the most marbles is the most likely.', `${cap(best)} has ${Math.max(...cnt)}, the most, so ${best} is most likely.`] });
});
skill('3-meanmode', 3, 'Probability and statistics', 'Mode and mean', ['The mode is the value that appears most often.', 'The mean shares the total equally: add all the values, then divide by how many there are.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const m = r.int(1, 20), o = r.shuffle([...Array(20).keys()].map((i) => i + 1).filter((x) => x !== m)).slice(0, 3), data = r.shuffle([m, m, m, o[0], o[1], o[2], o[2]]);
    return num(m, ['Count how many times each number appears.', `${m} appears 3 times, more than any other.`, `So the mode is ${m}.`], { q: `What is the mode of these numbers? ${data.join(', ')}`, expr: String(m) });
  }
  const k = r.int(3, 5), mean = r.int(4, 15), data = Array(k).fill(mean);
  for (let t = 0; t < 3; t++) { const i = r.int(0, k - 1), j = (i + r.int(1, k - 1)) % k, x = r.int(1, 3); if (data[j] - x >= 0) { data[i] += x; data[j] -= x; } }
  const sum = data.reduce((a, b) => a + b, 0);
  if (v === 1) return num(mean, [`Add them: ${data.join(' + ')} = ${sum}.`, `Divide by ${k}: ${sum} ÷ ${k} = ${mean}.`, `So the mean is ${mean}.`], { q: `What is the mean of these numbers? ${data.join(', ')}`, expr: `(${data.join('+')})/${k}` });
  const names = r.shuffle(NAMES).slice(0, k);
  return num(mean, [`Add the goals: ${data.join(' + ')} = ${sum}.`, `Share among ${k} players: ${sum} ÷ ${k} = ${mean}.`, `So the mean is ${mean} goals.`], { q: 'What is the mean number of goals scored?', visual: { type: 'table', head: ['Player', 'Goals'], rows: names.map((n, i) => [n, data[i]]) }, expr: `(${data.join('+')})/${k}` });
});

export default list;
