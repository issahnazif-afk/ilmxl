// Grade 2 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
import * as GK from './geo-k3.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const ONES_W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_W = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const words = (n) => {
  if (n < 20) return ONES_W[n];
  if (n < 100) return TENS_W[Math.floor(n / 10)] + (n % 10 ? `-${ONES_W[n % 10]}` : '');
  if (n === 1000) return 'one thousand';
  return `${ONES_W[Math.floor(n / 100)]} hundred${n % 100 ? ` ${words(n % 100)}` : ''}`;
};
const ORD_W = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const ord = (n) => `${n}${[11, 12, 13].includes(n % 100) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th')}`;
const roman = (n) => { let s = ''; for (const [v, t] of [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]) while (n >= v) { s += t; n -= v; } return s; };
const two = (r) => { const a = r.pick(NAMES); let b = r.pick(NAMES); while (b === a) b = r.pick(NAMES); return [a, b]; };
const THINGS = ['stickers', 'marbles', 'books', 'shells', 'stamps', 'beads', 'cards', 'apples', 'crayons', 'leaves'];
const addStory = (r, a, b) => { const n = r.pick(NAMES), t = r.pick(THINGS); return r.pick([
  `${n} has ${a} ${t}. ${n} gets ${b} more. How many ${t} does ${n} have now?`,
  `There are ${a} ${t} in one box and ${b} ${t} in another box. How many ${t} are there in all?`,
  `${n} collected ${a} ${t} on Monday and ${b} ${t} on Tuesday. How many ${t} is that altogether?`]); };
const subStory = (r, a, b) => { const [n, m] = two(r), t = r.pick(THINGS); return r.pick([
  `${n} had ${a} ${t} and gave ${b} of them away. How many ${t} are left?`,
  `There were ${a} ${t} on a table. ${n} took ${b} of them. How many ${t} are still on the table?`,
  `${n} has ${a} ${t}. ${m} has ${b} ${t}. How many more ${t} does ${n} have than ${m}?`]); };
// an In/Out table with one output hidden
const ioTable = (ins, f, miss) => ({ type: 'table', head: ['In', 'Out'], rows: ins.map((x, i) => [x, i === miss ? '?' : f(x)]) });
const sortedAsc = (xs) => [...xs].sort((a, b) => a - b);
const money = (c) => (c < 100 ? `${c}¢` : `$${(c / 100).toFixed(2)}`);
const tstr = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const tally = (n) => ('||||| '.repeat(Math.floor(n / 5)) + '|'.repeat(n % 5)).trim();
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// ═════════ 1. Counting ═════════
skill('2-number-lines', 2, 'Counting', 'Number lines and counting on', ['On a number line every tick is the same jump.', 'Find the number just before the dot, then count on one more jump.'], (r) => {
  const v = r.int(0, 2);
  if (v < 2) {
    const st = v ? 10 : 1, from = (v ? 100 : 10) * r.int(0, 6), to = from + 40 * st, x = from + st * (2 * r.int(0, 19) + 1);
    return num(x, [St(`Each tick is ${st} more than the tick before. Only every second tick has a number.`, numberLine(from, to, { step: st, marks: [x] })), St(`The dot is one tick past ${x - st}: ${x - st} + ${st} = ${x}.`), St(`So the dot is at ${x}.`)], { q: 'What number is at the dot?', visual: numberLine(from, to, { step: st, marks: [x] }), expr: `${x - st}+${st}` });
  }
  const back = r.bool(), h = 100 * r.int(1, 9), s = back ? h + r.int(0, 3) : h - r.int(1, 4), d = back ? -1 : 1;
  const seq = [s, s + d, s + 2 * d], ans = s + 3 * d;
  return num(ans, [`Counting ${back ? 'back' : 'forward'} by ones, each number is 1 ${back ? 'less' : 'more'} than the one before.`, `${s + 2 * d} ${back ? '−' : '+'} 1 = ${ans}.`, `So the next number is ${ans}.`], { q: `Count ${back ? 'back' : 'forward'} by ones. What comes next? ${seq.join(', ')}, ?`, expr: `${s}+3*${d}` });
});
skill('2-hundred-chart', 2, 'Counting', 'Hundred chart', ['On a hundred chart, one step right is 1 more and one step left is 1 less.', 'One step down is 10 more and one step up is 10 less.'], (r) => {
  const n = 10 * r.int(1, 8) + r.int(2, 9);
  if (r.bool()) {
    const [where, d, how] = r.pick([['just below', 10, 'Down one row is 10 more.'], ['just above', -10, 'Up one row is 10 less.'], ['just to the right of', 1, 'One step right is 1 more.'], ['just to the left of', -1, 'One step left is 1 less.']]), ans = n + d;
    return num(ans, [how, `${n} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${ans}.`, `So the number is ${ans}.`], { q: `On a hundred chart, what number is ${where} ${n}?`, expr: `${n}+${d}` });
  }
  const cells = [[n - 11, n - 10, n - 9], [n - 1, n, n + 1], [n + 9, n + 10, n + 11]];
  let i = r.int(0, 2), j = r.int(0, 2); if (i === 1 && j === 1) j = 2;
  const ans = cells[i][j], rows = cells.map((row, a) => row.map((x, b) => (a === i && b === j ? '?' : x)));
  return num(ans, ['Across a row the numbers go up by 1. Down a column they go up by 10.', `The middle number is ${n}, so the ? box is ${ans}.`, `So the missing number is ${ans}.`], { q: 'This is part of a hundred chart. What number goes in the ? box?', visual: { type: 'table', rows }, expr: `${ans}` });
});

// ═════════ 2. Comparing and ordering ═════════
skill('2-compare', 2, 'Comparing and ordering', 'Compare numbers to 1000', ['Compare the biggest place first: hundreds, then tens, then ones.', '> means greater than and < means less than.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(100, 999); let b = r.bool(0.15) ? a : r.pick([a + r.nonzero(-9, 9), a + 10 * r.nonzero(-5, 5), r.int(100, 999)]);
    b = Math.min(999, Math.max(100, b));
    const sign = a > b ? '>' : a < b ? '<' : '=';
    const place = Math.floor(a / 100) !== Math.floor(b / 100) ? 'hundreds' : Math.floor(a / 10) !== Math.floor(b / 10) ? 'tens' : 'ones';
    return mc(r, sign, ['>', '<', '='], { q: `Which sign goes in the box? ${a} ☐ ${b}`, steps: [a === b ? 'Every digit is the same.' : `The first place that is different is the ${place}.`, a === b ? 'They are equal.' : `${Math.max(a, b)} is greater.`, `${a} ${sign} ${b}.`] });
  }
  if (v === 1) {
    const from = 10 * r.int(0, 8), a = from + r.int(0, 20); let b = from + r.int(0, 20); while (b === a) b = from + r.int(0, 20);
    const big = r.bool(), right = big ? Math.max(a, b) : Math.min(a, b);
    return mc(r, right, [a + b - right], { q: `Look at the number line. Which number is ${big ? 'greater' : 'less'}: ${a} or ${b}?`, visual: numberLine(from, from + 20, { marks: [a, b] }), steps: ['On a number line, numbers get bigger as you go right.', `${Math.min(a, b)} is to the left of ${Math.max(a, b)}.`, `So ${right} is ${big ? 'greater' : 'less'}.`] });
  }
  const names = r.shuffle(NAMES).slice(0, 3), pts = []; while (pts.length < 3) { const x = r.int(20, 999); if (!pts.includes(x)) pts.push(x); }
  const most = r.bool(), k = pts.indexOf(most ? Math.max(...pts) : Math.min(...pts));
  return mc(r, names[k], names.filter((x, i) => i !== k), { q: `Three friends played a game. Who scored the ${most ? 'most' : 'fewest'} points?`, visual: { type: 'table', head: ['Name', 'Points'], rows: names.map((x, i) => [x, pts[i]]) }, steps: [`Compare ${pts.join(', ')}: look at the biggest place first.`, `The ${most ? 'greatest' : 'least'} is ${pts[k]}.`, `So ${names[k]} scored the ${most ? 'most' : 'fewest'}.`] });
});
skill('2-order', 2, 'Comparing and ordering', 'Put numbers in order', ['Find the least number first, then the next, and so on.', 'Compare hundreds, then tens, then ones.'], (r) => {
  const v = r.int(0, 2), max = r.bool() ? 99 : 999, xs = [];
  while (xs.length < (v === 0 ? 3 : 4)) { const x = r.int(max === 99 ? 10 : 100, max); if (!xs.includes(x)) xs.push(x); }
  const asc = sortedAsc(xs);
  if (v === 0) {
    const up = r.bool(), right = (up ? asc : [...asc].reverse()).join(', ');
    const wrongs = [(up ? [...asc].reverse() : asc).join(', '), [asc[1], asc[0], asc[2]].join(', '), [asc[0], asc[2], asc[1]].join(', ')];
    return mc(r, right, wrongs, { q: `Put ${xs.join(', ')} in order from ${up ? 'least to greatest' : 'greatest to least'}.`, steps: [`The least is ${asc[0]}. The greatest is ${asc[2]}.`, `${asc[1]} goes in the middle.`, `So the order is ${right}.`] });
  }
  if (v === 1) {
    const big = r.bool(), right = big ? asc[3] : asc[0];
    return mc(r, right, xs.filter((x) => x !== right), { q: `Which number is the ${big ? 'greatest' : 'least'}? ${xs.join(', ')}`, steps: [`In order: ${asc.join(', ')}.`, `The ${big ? 'greatest' : 'least'} is ${right}.`] });
  }
  const shelves = ['red', 'blue', 'green', 'yellow'], big = r.bool(), right = shelves[xs.indexOf(big ? asc[3] : asc[0])];
  return mc(r, right, shelves.filter((s) => s !== right), { q: `A library has four shelves. Which shelf has the ${big ? 'most' : 'fewest'} books?`, visual: { type: 'table', head: ['Shelf', 'Books'], rows: shelves.map((s, i) => [s, xs[i]]) }, steps: [`In order: ${asc.join(', ')}.`, `The ${big ? 'greatest' : 'least'} is ${big ? asc[3] : asc[0]}, on the ${right} shelf.`] });
});

// ═════════ 3. Skip-counting and number patterns ═════════
skill('2-skip-stories', 2, 'Skip-counting and patterns', 'Skip-counting stories', ['When every group has the same number, skip-count by that number.', 'Rods of ten: count by tens, then count on the ones.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = r.int(2, 12), o = r.int(0, 9), n = 10 * t + o;
    return num(n, [`Count the rods by tens: ${multiplesOf(10, t).join(', ')}.`, `Then count on ${o} ones: ${n}.`, `So there are ${n} cubes.`], { q: 'Each rod is 10 cubes. How many cubes are there?', visual: { type: 'blocks', tens: t, ones: o }, expr: `10*${t}+${o}` });
  }
  if (v === 1) {
    const [thing, many, part, k] = r.pick([['bike', 'bikes', 'wheels', 2], ['hand', 'hands', 'fingers', 5], ['box', 'boxes', 'crayons', 10], ['pair of mittens', 'pairs of mittens', 'mittens', 2], ['star', 'stars', 'points', 5], ['pack', 'packs', 'juice boxes', 10]]), g = r.int(2, 10);
    return num(g * k, [`Skip-count by ${k}, once for each ${thing}.`, `${multiplesOf(k, g).join(', ')}.`, `So there are ${g * k} ${part}.`], { q: `Each ${thing} has ${k} ${part}. How many ${part} are on ${g} ${many}?`, expr: `${g}*${k}` });
  }
  const by = r.pick([2, 5, 10]), s = by * r.int(1, 10), j = r.int(3, 6), ans = s + j * by;
  return num(ans, [`Start at ${s} and add ${by} each jump.`, `${Array.from({ length: j }, (_, i) => s + (i + 1) * by).join(', ')}.`, `After ${j} jumps you say ${ans}.`], { q: `Start at ${s} and skip-count by ${by}s. What number do you say after ${j} jumps?`, expr: `${s}+${j}*${by}` });
});
skill('2-count-patterns', 2, 'Skip-counting and patterns', 'Counting patterns to 1000', ['Find how much the numbers change each time.', 'Use the same change to fill the gap.'], (r) => {
  if (r.bool(0.75)) {
    const by = r.pick([2, 3, 4, 5, 10, 25, 100]) * (r.bool(0.3) ? -1 : 1), len = 5;
    const lo = by < 0 ? -by * (len - 1) : 0, s = r.int(lo + 1, 1000 - Math.max(0, by) * (len - 1));
    const seq = Array.from({ length: len }, (_, i) => s + i * by), miss = r.int(1, len - 1), ans = seq[miss];
    const shown = seq.map((x, i) => (i === miss ? '?' : x)).join(', ');
    return num(ans, [`Look at two numbers next to each other: the pattern ${by > 0 ? 'adds' : 'subtracts'} ${Math.abs(by)} each time.`, `${seq[miss - 1]} ${by > 0 ? '+' : '−'} ${Math.abs(by)} = ${ans}.`, `So the missing number is ${ans}.`], { q: `What number is missing? ${shown}`, expr: `${s}+${miss}*${by}` });
  }
  const by = r.pick([2, 5, 10]), right = by * r.int(3, 40), wrongs = []; while (wrongs.length < 3) { const x = r.int(right - 9, right + 9); if (x > 0 && x % by && !wrongs.includes(x)) wrongs.push(x); }
  return mc(r, right, wrongs, { q: `Start at 0 and skip-count by ${by}s. Which number will you say?`, steps: [`Counting by ${by}s from 0, every number ${by === 2 ? 'is even' : by === 5 ? 'ends in 0 or 5' : 'ends in 0'}.`, `${right} is the only one that fits.`] });
});

// ═════════ 4. Names of numbers ═════════
skill('2-number-words', 2, 'Names of numbers', 'Number words', ['Read a number word in parts: hundreds, then tens, then ones.', 'Tens and ones are joined with a hyphen, like forty-two.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const n = r.bool() ? r.int(21, 99) : r.int(101, 999), h = Math.floor(n / 100);
    const parts = [h ? `"${words(h)} hundred" is ${100 * h}` : '', n % 100 ? `"${words(n % 100)}" is ${n % 100}` : ''].filter(Boolean);
    return num(n, [`Read the parts: ${parts.join(', and ')}.`, `Put them together: ${n}.`, `So the number is ${n}.`], { q: `Write "${words(n)}" as a number.`, expr: `${n}` });
  }
  if (v === 1) {
    const n = r.bool() ? r.int(21, 99) : r.int(101, 999);
    const sw = Number(String(n).split('').reverse().join('')), alts = [sw, n + 10 <= 999 ? n + 10 : n - 10, n >= 100 ? (n + 100 <= 999 ? n + 100 : n - 100) : n + 1].filter((x) => x !== n && x >= 1);
    return mc(r, words(n), alts.map(words), { q: `How do you write ${n} in words?`, steps: [n >= 100 ? `${Math.floor(n / 100) * 100} is ${words(Math.floor(n / 100) * 100)}.` : `${Math.floor(n / 10) * 10} is ${TENS_W[Math.floor(n / 10)]}.`, `So ${n} is ${words(n)}.`] });
  }
  const n = r.int(0, 20);
  return txt(words(n), [`Say it aloud: ${n}.`, `The word for ${n} is "${words(n)}".`, `So ${n} is spelled ${words(n)}.`], { q: `Spell the number ${n} as a word.` });
});
skill('2-ordinals', 2, 'Names of numbers', 'Ordinal numbers and Roman numerals', ['Ordinal numbers tell position: 1st, 2nd, 3rd, 4th.', 'Roman numerals: I is 1, V is 5, X is 10 and L is 50. A smaller one in front means take away.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(1, 10);
    return mc(r, ORD_W[n], [ORD_W[n % 10 + 1], ORD_W[n > 1 ? n - 1 : 3], ONES_W[n]], { q: `Which word means ${ord(n)}?`, steps: [`${ord(n)} is a position in a line.`, `${ord(n)} is said "${ORD_W[n]}".`] });
  }
  if (v === 1) {
    const n = r.int(2, 30), nm = r.pick(NAMES);
    return num(n - 1, [`Everyone in 1st to ${ord(n - 1)} place is in front.`, `That is ${n - 1} children.`, `So ${n - 1} children are ahead of ${nm}.`], { q: `Children are lined up for the bus. ${nm} is ${ord(n)} in line. How many children are ahead of ${nm}?`, expr: `${n}-1` });
  }
  if (v === 2) {
    const n = r.int(11, 89), after = r.bool(), ans = after ? n + 1 : n - 1;
    return mc(r, ord(ans), [ord(after ? n - 1 : n + 1), ord(n + (after ? 10 : -10)), ord(n)], { q: `Which comes just ${after ? 'after' : 'before'} the ${ord(n)}?`, steps: [`${n} ${after ? '+' : '−'} 1 = ${ans}.`, `So it is the ${ord(ans)}.`] });
  }
  const n = r.int(1, 89), R = roman(n), V = { L: 50, XL: 40, XXX: 30, XX: 20, X: 10, IX: 9, VIII: 8, VII: 7, VI: 6, V: 5, IV: 4, III: 3, II: 2, I: 1 };
  const parts = R.match(/XL|L|X{1,3}|IX|VI{0,3}|IV|I{1,3}/g).map((p) => `${p} = ${V[p]}`);
  return num(n, [`Split it into parts: ${parts.join(', ')}.`, `Add the parts: ${n}.`, `So ${R} is ${n}.`], { q: `What number is the Roman numeral ${R}?`, expr: `${n}` });
});

// ═════════ 5. Even and odd ═════════
skill('2-evenodd-more', 2, 'Even and odd', 'Even and odd numbers', ['An even number of things can be put in pairs with none left over.', 'Even numbers end in 0, 2, 4, 6 or 8. Odd numbers end in 1, 3, 5, 7 or 9.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(2, 20), o = r.pick(OBJ), right = n % 2 ? 'Odd' : 'Even';
    return mc(r, right, ['Even', 'Odd'], { q: `Is the number of ${plural(o, 2)} even or odd?`, visual: { type: 'objects', n, obj: o }, steps: [`There are ${n}.`, n % 2 ? `Make pairs: ${(n - 1) / 2} pairs and 1 left over.` : `Make pairs: ${n / 2} pairs and none left over.`, `So ${n} is ${right.toLowerCase()}.`] });
  }
  if (v === 1) {
    const even = r.bool(), xs = new Set(); let right; do right = r.int(10, 999); while ((right % 2 === 0) !== even);
    while (xs.size < 3) { const x = r.int(10, 999); if ((x % 2 === 0) !== even) xs.add(x); }
    return mc(r, right, [...xs], { q: `Which number is ${even ? 'even' : 'odd'}?`, steps: ['Look at the ones digit of each number.', `${right} ends in ${right % 10}, so it is ${even ? 'even' : 'odd'}.`] });
  }
  if (v === 2) {
    const n = r.int(10, 998), even = r.bool(), after = r.bool();
    let ans = n + (after ? 1 : -1); while ((ans % 2 === 0) !== even) ans += after ? 1 : -1;
    return num(ans, [`${even ? 'Even' : 'Odd'} numbers come every 2. ${n} is ${n % 2 ? 'odd' : 'even'}.`, `Count ${after ? 'up' : 'back'} from ${n} to the next ${even ? 'even' : 'odd'} number: ${ans}.`, `So the answer is ${ans}.`], { q: `What is the ${even ? 'even' : 'odd'} number that comes just ${after ? 'after' : 'before'} ${n}?`, expr: `${ans}` });
  }
  const from = 10 * r.int(0, 9), x = from + r.int(1, 9), right = x % 2 ? 'Odd' : 'Even';
  return mc(r, right, ['Even', 'Odd'], { q: 'Is the number at the dot even or odd?', visual: numberLine(from, from + 10, { marks: [x] }), steps: [`The dot is at ${x}.`, `${x} ends in ${x % 10}, so it is ${right.toLowerCase()}.`] });
});

// ═════════ 6. Addition strategies - one digit ═════════
skill('2-doubles', 2, 'Addition strategies', 'Doubles and adding zero', ['A double adds a number to itself: 6 + 6 = 12.', 'Adding 0 does not change a number.', 'On a number line, start at the first number and jump forward.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(1, 10), o = r.pick(OBJ);
    return num(2 * a, [`Both groups have ${a}. This is a double.`, `${a} + ${a} = ${2 * a}.`, `So the answer is ${2 * a}.`], { q: `${a} + ${a} = ?`, visual: { type: 'groups', groups: [a, a], obj: o, plus: true }, expr: `${a}+${a}` });
  }
  if (v === 1) {
    const a = r.int(2, 10);
    return num(a, [`${2 * a} is a double: two equal parts.`, `Half of ${2 * a} is ${a}, because ${a} + ${a} = ${2 * a}.`, `So the missing number is ${a}.`], { q: `Complete the doubles fact: ${a} + ? = ${2 * a}`, expr: `${2 * a}-${a}` });
  }
  if (v === 2) {
    const n = r.int(1, 99), first = r.bool();
    return num(n, ['Adding 0 means adding nothing.', `The number stays ${n}.`, `So the answer is ${n}.`], { q: first ? `0 + ${n} = ?` : `${n} + 0 = ?`, expr: `${n}+0` });
  }
  const a = r.int(2, 12), b = r.int(2, 20 - a), right = `${a} + ${b} = ${a + b}`;
  return mc(r, right, [`${a} + ${b + 1} = ${a + b + 1}`, `${b} + ${a + b} = ${a + 2 * b}`, `${a + b} − ${b} = ${a}`], { q: 'Which addition sentence does the number line show?', visual: numberLine(0, 20, { marks: [a, a + b], jumps: [{ from: a, to: a + b, label: `+${b}` }] }), steps: [`The jump starts at ${a} and moves forward ${b}.`, `It lands on ${a + b}.`, `So it shows ${right}.`] });
});

// ═════════ 7. Addition - one digit ═════════
skill('2-add20-ways', 2, 'Addition', 'Addition sentences to 20', ['An addition sentence uses + and =, like 7 + 5 = 12.', 'Check a sentence by working out the sum.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const s = r.int(6, 20), a = r.int(Math.max(1, s - 10), Math.min(9, s - 1)), right = `${a} and ${s - a}`;
    const wrongs = [-2, -1, 1, 2].map((d) => `${a} and ${Math.max(0, s - a + d)}`);
    return mc(r, right, r.shuffle(wrongs), { q: `Which two numbers add up to ${s}?`, steps: ['Add each pair.', `${a} + ${s - a} = ${s}.`, `So ${right} make ${s}.`] });
  }
  if (v === 1) {
    const a = r.int(2, 10), b = r.int(2, 10), right = `${a} + ${b} = ${a + b}`;
    const c = r.int(2, 10), d = r.int(2, 10), e = r.int(2, 10), f = r.int(2, 10);
    return mc(r, right, [`${c} + ${d} = ${c + d + r.pick([-1, 1, 2])}`, `${e} + ${f} = ${e + f + r.pick([-2, 1, -1])}`, `${a} + ${b} = ${a + b + r.pick([1, -1])}`], { q: 'Which addition sentence is true?', steps: ['Work out each sum and compare it with the number after =.', `${a} + ${b} really is ${a + b}.`, `So ${right} is true.`] });
  }
  const a = r.int(2, 10), b = r.int(1, 10), o = r.pick(OBJ), right = `${a} + ${b} = ${a + b}`;
  return mc(r, right, [`${a} + ${b} = ${a + b + 1}`, `${a + 1} + ${b} = ${a + b + 1}`, `${a} + ${b + 2} = ${a + b + 2}`], { q: 'Which addition sentence matches the picture?', visual: { type: 'groups', groups: [a, b], obj: o, plus: true }, steps: [`The first group has ${a}. The second group has ${b}.`, `Together: ${a + b}.`, `So the sentence is ${right}.`] });
});
skill('2-add20-missing', 2, 'Addition', 'Missing numbers in addition to 20', ['To find a missing part, count up from the part you know to the total.', 'An equals sign means both sides have the same value.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(1, 10), c = r.int(a + 1, Math.min(20, a + 10)), first = r.bool();
    return num(c - a, [St(`Count up from ${a} to ${c}.`, numberLine(0, 20, { marks: [a, c], jumps: [{ from: a, to: c, label: `+${c - a}` }] })), `${a} + ${c - a} = ${c}.`, `So the missing number is ${c - a}.`], { q: first ? `? + ${a} = ${c}` : `${a} + ? = ${c}`, expr: `${c}-${a}` });
  }
  if (v === 1) {
    const a = r.int(2, 9), b = r.int(2, 9); let c = r.int(1, a + b - 1); while (c === a || c === b) c = r.int(1, a + b - 1);
    return num(a + b - c, [`The left side is ${a} + ${b} = ${a + b}.`, `The right side must also be ${a + b}: ${c} + ? = ${a + b}.`, `${a + b} − ${c} = ${a + b - c}, so the missing number is ${a + b - c}.`], { q: `Make both sides equal: ${a} + ${b} = ${c} + ?`, expr: `${a}+${b}-${c}` });
  }
  if (v === 2) {
    const a = r.int(1, 9);
    return num(10 - a, [St(`${a} dots are in the ten-frame. Count the empty boxes.`, { type: 'tenframes', n: a }), `${a} + ${10 - a} = 10.`, `So the missing number is ${10 - a}.`], { q: `Make ten: ${a} + ? = 10`, expr: `10-${a}` });
  }
  const k = r.int(2, 9), ins = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((x) => x + k <= 20)).slice(0, 4), miss = r.int(0, 3), ans = ins[miss] + k;
  return num(ans, [`Each output is the input plus ${k}.`, `${ins[miss]} + ${k} = ${ans}.`, `So the missing output is ${ans}.`], { q: `The rule is "add ${k}". What is the missing output?`, visual: ioTable(ins, (x) => x + k, miss), expr: `${ins[miss]}+${k}` });
});
skill('2-add20-words', 2, 'Addition', 'Addition stories and adding three numbers', ['Words like "in all", "altogether" and "more" often mean add.', 'To add three numbers, add two of them, then add the third.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(2, 12), b = r.int(2, 20 - a);
    return num(a + b, [`Put the two amounts together: ${a} + ${b}.`, `${a} + ${b} = ${a + b}.`, `So the answer is ${a + b}.`], { q: addStory(r, a, b), expr: `${a}+${b}` });
  }
  if (v === 1) {
    const k = r.int(3, 4), xs = Array.from({ length: k }, () => r.int(1, 9)), s = xs.reduce((x, y) => x + y, 0);
    let run = xs[0]; const parts = xs.slice(1).map((x) => { const was = run; run += x; return `${was} + ${x} = ${run}`; });
    return num(s, [`Add one number at a time, starting with ${xs[0]}.`, parts.join(', ') + '.', `So ${xs.join(' + ')} = ${s}.`], { q: `${xs.join(' + ')} = ?`, expr: xs.join('+') });
  }
  if (v === 2) {
    const [a, b, c] = [r.int(2, 9), r.int(2, 9), r.int(2, 9)], nm = r.pick(NAMES);
    return num(a + b + c, [`Add all three: ${a} + ${b} + ${c}.`, `${a} + ${b} = ${a + b}, and ${a + b} + ${c} = ${a + b + c}.`, `So ${nm} has ${a + b + c} pencils.`], { q: `${nm} has ${a} red pencils, ${b} blue pencils and ${c} green pencils. How many pencils does ${nm} have?`, expr: `${a}+${b}+${c}` });
  }
  const a = r.int(3, 12), b = r.int(2, Math.min(8, 20 - a)), nm = r.pick(NAMES), right = `${a} + ${b} = ${a + b}`;
  return mc(r, right, [`${a + b} − ${b} = ${a}`, `${a} + ${b + 1} = ${a + b + 1}`, `${b} + ${b} = ${2 * b}`], { q: `${nm} saw ${a} ducks in a pond. Then ${b} more ducks landed. Which number sentence tells how many ducks there are now?`, steps: ['More ducks came, so we add.', `Start with ${a} and add ${b}.`, `The sentence is ${right}.`] });
});

// ═════════ 8. Subtraction strategies - one digit ═════════
skill('2-sub-strategies', 2, 'Subtraction strategies', 'Subtract doubles, zero and all', ['If you know 7 + 7 = 14, then 14 − 7 = 7.', 'Taking away 0 changes nothing. Taking away all of it leaves 0.', 'On a number line, subtracting jumps back.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(2, 10);
    return num(a, [`Think of the double: ${a} + ${a} = ${2 * a}.`, `So taking ${a} away from ${2 * a} leaves ${a}.`, `${2 * a} − ${a} = ${a}.`], { q: `${2 * a} − ${a} = ?`, expr: `${2 * a}-${a}` });
  }
  if (v === 1) {
    const n = r.int(1, 99), all = r.bool(), ans = all ? 0 : n;
    return num(ans, [all ? `You take away every one of the ${n}.` : 'You take away nothing.', all ? `Nothing is left: ${ans}.` : `All ${n} are still there.`, `So ${n} − ${all ? n : 0} = ${ans}.`], { q: `${n} − ${all ? n : 0} = ?`, expr: `${n}-${all ? n : 0}` });
  }
  const a = r.int(8, 20), b = r.int(2, a - 1), right = `${a} − ${b} = ${a - b}`;
  return mc(r, right, [`${a} − ${b + 1} = ${a - b - 1}`, `${a - b} + ${b} = ${a}`, `${a} + ${b} = ${a + b}`], { q: 'Which subtraction sentence does the number line show?', visual: numberLine(0, 20, { marks: [a, a - b], jumps: [{ from: a, to: a - b, label: `−${b}` }] }), steps: [`The jump starts at ${a} and moves back ${b}.`, `It lands on ${a - b}.`, `So it shows ${right}.`] });
});

// ═════════ 9. Subtraction - one digit ═════════
skill('2-sub20-pictures', 2, 'Subtraction', 'Subtraction sentences to 20', ['A subtraction sentence starts with the whole, takes away a part and gives what is left.', 'Crossed-out things are the ones taken away.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(4, 20), g = r.int(1, n - 1), right = `${n} − ${g} = ${n - g}`;
    return mc(r, right, [`${n} − ${n - g} = ${g + 1}`, `${n} + ${g} = ${n + g}`, `${n} − ${g} = ${n - g + 1}`], { q: 'Which subtraction sentence matches the picture?', visual: { type: 'takeaway', n, gone: g }, steps: [`There are ${n} in all. ${g} are crossed out.`, `${n - g} are left.`, `So the sentence is ${right}.`] });
  }
  if (v === 1) {
    const a = r.int(8, 20), b = r.int(2, 7), right = `${a} − ${b} = ${a - b}`, c = r.int(8, 20), d = r.int(2, 7);
    return mc(r, right, [`${c} − ${d} = ${c - d + 1}`, `${a} − ${b} = ${a - b - 1}`, `${c} − ${d} = ${c - d + 2}`], { q: 'Which subtraction sentence is true?', steps: ['Work out each difference.', `${a} − ${b} really is ${a - b}.`, `So ${right} is true.`] });
  }
  if (v === 2) {
    const d = r.int(2, 9), a = r.int(d + 3, 20), right = `${a} − ${a - d}`;
    return mc(r, right, [`${a} − ${a - d - 1}`, `${a} − ${a - d + 1}`, `${a + 2} − ${a - d}`], { q: `Which subtraction has the answer ${d}?`, steps: ['Work out each one.', `${a} − ${a - d} = ${d}.`, `So ${right} is the one.`] });
  }
  const a = r.int(11, 20), b = r.int(2, 9);
  return num(a - b, [`Start with ${a}. Cross out ${b}.`, `Count what is left: ${a - b}.`, `So ${a} − ${b} = ${a - b}.`], { q: `${a} − ${b} = ?`, visual: { type: 'takeaway', n: a, gone: b }, expr: `${a}-${b}` });
});
skill('2-sub20-problems', 2, 'Subtraction', 'Subtraction problems to 20', ['Words like "left", "fewer" and "how many more" often mean subtract.', 'To find a missing number, think of the addition that goes with it.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(5, 20), b = r.int(1, a - 1), c = a - b;
    return r.bool() ? num(b, [`Think: ${c} + ? = ${a}.`, `${a} − ${c} = ${b}.`, `So the missing number is ${b}.`], { q: `${a} − ? = ${c}`, expr: `${a}-${c}` })
      : num(a, [`The missing number is the whole. Add the parts: ${b} + ${c}.`, `${b} + ${c} = ${a}.`, `So the missing number is ${a}.`], { q: `? − ${b} = ${c}`, expr: `${b}+${c}` });
  }
  if (v === 1) {
    const a = r.int(10, 20), b = r.int(2, 9), d = a - b; let c = r.int(d + 1, 20); while (c === a) c = r.int(d + 1, 20);
    return num(c - d, [`The left side is ${a} − ${b} = ${d}.`, `So ${c} − ? must be ${d} too.`, `${c} − ${c - d} = ${d}, so the missing number is ${c - d}.`], { q: `Make both sides equal: ${a} − ${b} = ${c} − ?`, expr: `${c}-(${a}-${b})` });
  }
  if (v === 2) {
    const k = r.int(2, 9), ins = r.shuffle([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, 4), miss = r.int(0, 3), ans = ins[miss] - k;
    return num(ans, [`Each output is the input minus ${k}.`, `${ins[miss]} − ${k} = ${ans}.`, `So the missing output is ${ans}.`], { q: `The rule is "subtract ${k}". What is the missing output?`, visual: ioTable(ins, (x) => x - k, miss), expr: `${ins[miss]}-${k}` });
  }
  const a = r.int(8, 20), b = r.int(2, a - 2);
  return num(a - b, [`Take the smaller amount away from the bigger: ${a} − ${b}.`, `${a} − ${b} = ${a - b}.`, `So the answer is ${a - b}.`], { q: subStory(r, a, b), expr: `${a}-${b}` });
});

// ═════════ 10. Mixed operations - one digit ═════════
skill('2-mixed20', 2, 'Mixed operations', 'Add and subtract to 20', ['Look at the sign first: + means add, − means take away.', 'Both sides of = must have the same value.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const add = r.bool(), a = r.int(5, 15), b = r.int(2, add ? 20 - a : Math.min(9, a - 1)), ans = add ? a + b : a - b;
    return num(ans, [add ? `Add: start at ${a} and count on ${b}.` : `Subtract: start at ${a} and count back ${b}.`, `${a} ${add ? '+' : '−'} ${b} = ${ans}.`, `So the answer is ${ans}.`], { q: `${a} ${add ? '+' : '−'} ${b} = ?`, expr: `${a}${add ? '+' : '-'}${b}` });
  }
  if (v === 1) {
    const add = r.bool(), a = r.int(5, 12), b = r.int(2, add ? 20 - a : a - 1), ans = add ? a + b : a - b, nm = r.pick(NAMES);
    const q = add ? `${nm} baked ${a} muffins in the morning and ${b} more in the afternoon. How many muffins did ${nm} bake?` : `${nm} had ${a} balloons. ${b} balloons floated away. How many balloons does ${nm} have left?`;
    return num(ans, [add ? 'More muffins were baked, so add.' : 'Some floated away, so subtract.', `${a} ${add ? '+' : '−'} ${b} = ${ans}.`, `So the answer is ${ans}.`], { q, expr: `${a}${add ? '+' : '-'}${b}` });
  }
  if (v === 2) {
    const a = r.int(3, 12), b = r.int(2, 8), c = r.int(10, 20), d = r.int(2, 9);
    const right = r.bool() ? `${a} + ${b} = ${a + b}` : `${c} − ${d} = ${c - d}`;
    return mc(r, right, [`${a} + ${b} = ${a + b + 1}`, `${c} − ${d} = ${c - d - 1}`, `${a + b} − ${b} = ${a + 1}`, `${c} + ${d} = ${c + d - 1}`], { q: 'Which number sentence is true?', steps: ['Work out each one and check the number after =.', `${right} is correct.`] });
  }
  const a = r.int(2, 9), b = r.int(2, 9), s = a + b, c = r.int(s + 1, 20);
  return num(c - s, [`The left side is ${a} + ${b} = ${s}.`, `So ${c} − ? must be ${s}: ${c} − ${c - s} = ${s}.`, `So the missing number is ${c - s}.`], { q: `Make both sides equal: ${a} + ${b} = ${c} − ?`, expr: `${c}-(${a}+${b})` });
});
skill('2-mixed20-rule', 2, 'Mixed operations', 'Find the rule', ['Compare each input with its output: did it go up or down, and by how much?', 'The same rule must work for every row.'], (r) => {
  if (r.bool()) {
    const add = r.bool(), k = r.int(2, 9), ins = sortedAsc(r.shuffle(add ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, 4)), right = `${add ? 'Add' : 'Subtract'} ${k}`;
    const rows = ins.map((x) => [x, add ? x + k : x - k]);
    return mc(r, right, [`${add ? 'Subtract' : 'Add'} ${k}`, `${add ? 'Add' : 'Subtract'} ${k + 1}`, `${add ? 'Add' : 'Subtract'} ${k - 1}`], { q: 'What is the rule for this table?', visual: { type: 'table', head: ['In', 'Out'], rows }, steps: [`${rows[0][0]} → ${rows[0][1]}: it goes ${add ? 'up' : 'down'} by ${k}.`, `Check another row: ${rows[1][0]} ${add ? '+' : '−'} ${k} = ${rows[1][1]}.`, `So the rule is "${right.toLowerCase()}".`] });
  }
  const n = r.int(6, 15), a = r.int(1, n - 1), b = r.int(n + 2, 20), right = r.bool() ? `${a} + ${n - a}` : `${b} − ${b - n}`;
  return mc(r, right, [`${a} + ${n - a + 1}`, `${b} − ${b - n + 1}`, `${a + 1} + ${n - a + 1}`, `${b} − ${b - n - 1}`], { q: `Which one is another way to make ${n}?`, steps: ['Work out each one.', `${right} = ${n}.`] });
});

// ═════════ 11. Place value ═════════
skill('2-pv-models', 2, 'Place value', 'Place value models and digit values', ['A rod is 10 and a small cube is 1.', 'A digit\'s value depends on its place: in 352 the 5 is worth 50.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = r.int(1, 9), o = r.int(0, 9), n = 10 * t + o;
    return num(n, [`There are ${t} tens rods: ${10 * t}.`, `There are ${o} ones: ${10 * t} + ${o} = ${n}.`, `So the blocks show ${n}.`], { q: 'What number do the blocks show?', visual: { type: 'blocks', tens: t, ones: o }, expr: `10*${t}+${o}` });
  }
  if (v === 1) {
    const th = r.bool(0.3) ? r.int(1, 9) : 0, h = r.int(1, 9), t = r.int(0, 9), o = r.int(0, 9), n = 1000 * th + 100 * h + 10 * t + o;
    const desc = `${th ? `${th} thousand${th > 1 ? 's' : ''}, ` : ''}${h} hundred${h > 1 ? 's' : ''}, ${t} ten${t === 1 ? '' : 's'} and ${o} one${o === 1 ? '' : 's'}`;
    const parts = [1000 * th, 100 * h, 10 * t, o].filter((x) => x);
    return num(n, [`Write each digit in its place: ${th ? `${th} thousands, ` : ''}${h} hundreds, ${t} tens, ${o} ones.`, `${parts.join(' + ')} = ${comma(n)}.`, `So the number is ${comma(n)}.`], { q: `What number is ${desc}?`, expr: `${1000 * th}+${100 * h}+${10 * t}+${o}` });
  }
  const len = r.bool(0.3) ? 4 : r.pick([2, 3]), ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len), n = Number(ds.join('')), k = r.bool(0.8) ? r.int(1, len - 1) : 0, d = ds[len - 1 - k], val = d * 10 ** k;
  return num(val, [`In ${comma(n)}, the ${d} is in the ${PLACE[k]} place.`, `${d} ${PLACE[k]} is worth ${comma(val)}.`, `So the value of the ${d} is ${comma(val)}.`], { q: `What is the value of the digit ${d} in ${comma(n)}?`, expr: `${d}*${10 ** k}` });
});
skill('2-pv-expanded', 2, 'Place value', 'Expanded form and converting places', ['Expanded form shows what each digit is worth: 473 = 400 + 70 + 3.', '1 hundred is 10 tens, and 1 ten is 10 ones.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const th = r.bool(0.3) ? r.int(1, 9) : 0, h = r.int(1, 9), t = r.int(0, 9), o = r.int(0, 9), n = 1000 * th + 100 * h + 10 * t + o;
    const parts = [1000 * th, 100 * h, 10 * t, o].filter((x) => x);
    return num(n, [`Each part fills one place: ${parts.join(', ')}.`, `Put the digits together: ${comma(n)}.`, `So ${parts.join(' + ')} = ${comma(n)}.`], { q: `${parts.join(' + ')} = ?`, expr: parts.join('+') });
  }
  if (v === 1) {
    const h = r.int(1, 9), t = r.int(1, 9), o = r.int(1, 9), n = 100 * h + 10 * t + o, right = `${100 * h} + ${10 * t} + ${o}`;
    return mc(r, right, [`${h} + ${t} + ${o}`, `${100 * h} + ${t} + ${10 * o}`, `${100 * t} + ${10 * h} + ${o}`], { q: `Which is ${n} in expanded form?`, steps: [`${h} hundreds = ${100 * h}, ${t} tens = ${10 * t}, ${o} ones = ${o}.`, `So ${n} = ${right}.`] });
  }
  const kind = r.int(0, 2);
  if (kind === 0) { const h = r.int(1, 9); return num(10 * h, ['1 hundred is 10 tens.', `${h} hundreds is ${h} × 10 = ${10 * h} tens.`, `So the answer is ${10 * h}.`], { q: `${h} hundred${h > 1 ? 's' : ''} = ? tens`, expr: `${h}*10` }); }
  if (kind === 1) { const t = r.int(11, 99); return num(10 * t, ['1 ten is 10 ones.', `${t} tens is ${t} × 10 = ${10 * t}.`, `So ${t} tens = ${10 * t}.`], { q: `${t} tens = ?`, expr: `${t}*10` }); }
  const t = r.int(11, 99), h = Math.floor(t / 10);
  return num(t, [`${10 * t} has ${h} hundred${h > 1 ? 's' : ''} and ${t % 10} tens. Each hundred is 10 tens.`, `${10 * h} + ${t % 10} = ${t} tens.`, `So there are ${t} tens in ${10 * t}.`], { q: `How many tens are in ${10 * t}?`, expr: `${10 * t}/10` });
});
skill('2-pv-regroup', 2, 'Place value', 'Regroup and guess the number', ['10 ones can be traded for 1 ten, and 10 tens for 1 hundred.', 'A number can be made in many ways: 52 is 5 tens 2 ones, or 4 tens 12 ones.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const t = r.int(1, 8), o = r.int(10, 19), n = 10 * t + o;
    return num(n, [`${o} ones is 1 ten and ${o - 10} ones.`, `So we have ${t + 1} tens and ${o - 10} ones.`, `That is ${n}.`], { q: `What number is ${t} ten${t > 1 ? 's' : ''} and ${o} ones?`, expr: `10*${t}+${o}` });
  }
  if (v === 1) {
    const n = r.int(21, 99), t = Math.floor(n / 10), o = n % 10, right = `${t - 1} tens and ${o + 10} ones`;
    return mc(r, right, [`${t - 1} tens and ${o} ones`, `${t + 1} tens and ${o + 10} ones`, `${t} tens and ${o + 10} ones`], { q: `Which is another way to make ${n}?`, steps: [`${n} is ${t} tens and ${o} ones.`, `Trade 1 ten for 10 ones: ${t - 1} tens and ${o + 10} ones.`, `${10 * (t - 1)} + ${o + 10} = ${n}.`] });
  }
  if (v === 2) {
    const h = r.int(1, 8), t = r.int(10, 19), o = r.int(0, 9), n = 100 * h + 10 * t + o;
    return num(n, [`${t} tens is 1 hundred and ${t - 10} tens.`, `So we have ${h + 1} hundreds, ${t - 10} tens and ${o} ones.`, `That is ${n}.`], { q: `What number is ${h} hundred${h > 1 ? 's' : ''}, ${t} tens and ${o} ones?`, expr: `100*${h}+10*${t}+${o}` });
  }
  const t = r.int(1, 7), d = r.int(1, 9 - t), n = 10 * t + t + d;
  return num(n, [`The tens digit is ${t}.`, `The ones digit is ${t} + ${d} = ${t + d}.`, `So the number is ${n}.`], { q: `I am a two-digit number. My tens digit is ${t}. My ones digit is ${d} more than my tens digit. What number am I?`, expr: `10*${t}+${t}+${d}` });
});

// ═════════ 12. Addition strategies - two digits ═════════
skill('2-add-models', 2, 'Addition strategies', 'Add with models and place value', ['Add the tens to the tens and the ones to the ones.', 'If there are 10 or more ones, trade 10 ones for a ten.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = r.int(1, 8), o = r.int(0, 9), a = 10 * t + o, b = r.int(1, 9);
    return num(a + b, [`The blocks show ${a}. Add ${b} more ones: ${o} + ${b} = ${o + b} ones.`, o + b >= 10 ? `Trade 10 ones for a ten: ${t + 1} tens and ${o + b - 10} ones.` : `That makes ${t} tens and ${o + b} ones.`, `So ${a} + ${b} = ${a + b}.`], { q: `The blocks show a number. Add ${b}. What is the total?`, visual: { type: 'blocks', tens: t, ones: o }, expr: `${a}+${b}` });
  }
  const a = r.int(11, 79), b = r.int(11, 99 - a), at = a - (a % 10), bt = b - (b % 10), ao = a % 10, bo = b % 10;
  if (v === 1) {
    return num(a + b, [`Tens: ${at} + ${bt} = ${at + bt}.`, `Ones: ${ao} + ${bo} = ${ao + bo}.`, `${at + bt} + ${ao + bo} = ${a + b}, so ${a} + ${b} = ${a + b}.`], { q: `Use place value: ${a} + ${b} = ${at} + ${bt} + ${ao} + ${bo} = ?`, expr: `${a}+${b}` });
  }
  const right = `${at} + ${bt} + ${ao} + ${bo}`;
  return mc(r, right, [`${at / 10} + ${bt / 10} + ${ao} + ${bo}`, `${at} + ${bt} + ${ao * 10} + ${bo}`, `${at} + ${bo} + ${ao} + ${bt / 10}`], { q: `Which shows ${a} + ${b} split into tens and ones?`, steps: [`${a} = ${at} + ${ao} and ${b} = ${bt} + ${bo}.`, `So ${a} + ${b} = ${right}.`] });
});

// ═════════ 13. Addition - two digits ═════════
skill('2-add2-facts', 2, 'Addition', 'Add two-digit numbers', ['Add the ones first, then the tens.', 'Adding a multiple of 10 only changes the tens digit.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(10, 90), b = r.int(1, 9);
    return num(a + b, columnAdd([a, b]), { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
  }
  if (v === 1) {
    const a = r.int(11, 79), t = r.int(1, Math.floor((99 - a) / 10)), b = 10 * t;
    return num(a + b, [St(`${b} is ${t} ten${t > 1 ? 's' : ''}. Count on by tens from ${a}.`, numberLine(a, a + b, { step: 10, jumps: Array.from({ length: t }, (_, i) => ({ from: a + 10 * i, to: a + 10 * i + 10, label: '+10' })) })), `${multiplesOf(10, t).map((x) => a + x).join(', ')}.`, `So ${a} + ${b} = ${a + b}.`], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
  }
  const k = r.int(3, 4), xs = Array.from({ length: k }, () => r.int(5, 45));
  return num(xs.reduce((x, y) => x + y, 0), columnAdd(xs), { q: `${xs.join(' + ')} = ?`, expr: xs.join('+') });
});
skill('2-add2-problems', 2, 'Addition', 'Addition problems to 100', ['Read the story and decide what is put together.', 'For a missing number, count up or subtract to find it.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(12, 70), b = r.int(11, 99 - a), at = a - (a % 10), bt = b - (b % 10);
    return num(a + b, [`Put the amounts together: ${a} + ${b}.`, `Tens: ${at} + ${bt} = ${at + bt}. Ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}.`, `So ${a} + ${b} = ${a + b}.`], { q: addStory(r, a, b), expr: `${a}+${b}` });
  }
  if (v === 1) {
    const a = r.int(11, 80), c = r.int(a + 5, 99);
    return num(c - a, [`Think: what do you add to ${a} to get ${c}?`, `${c} − ${a} = ${c - a}.`, `Check: ${a} + ${c - a} = ${c}. The missing number is ${c - a}.`], { q: `${a} + ? = ${c}`, expr: `${c}-${a}` });
  }
  if (v === 2) {
    const a = r.int(11, 50), b = r.int(11, 45), s = a + b; let c = 10 * r.int(1, Math.floor((s - 1) / 10)); if (c === a || c === b) c = s - 5;
    return num(s - c, [`The left side is ${a} + ${b} = ${s}.`, `So ${c} + ? = ${s}: ${s} − ${c} = ${s - c}.`, `So the missing number is ${s - c}.`], { q: `Make both sides equal: ${a} + ${b} = ${c} + ?`, expr: `${a}+${b}-${c}` });
  }
  const k = r.int(11, 40), ins = r.shuffle([5, 12, 20, 23, 31, 37, 44, 50, 56]).filter((x) => x + k <= 100).slice(0, 4), miss = r.int(0, 3), ans = ins[miss] + k;
  return num(ans, [`Each output is the input plus ${k}.`, `${ins[miss]} + ${k} = ${ans}.`, `So the missing output is ${ans}.`], { q: `The rule is "add ${k}". What is the missing output?`, visual: ioTable(ins, (x) => x + k, miss), expr: `${ins[miss]}+${k}` });
});

// ═════════ 14. Subtraction strategies - two digits ═════════
skill('2-sub-models', 2, 'Subtraction strategies', 'Subtract with models', ['Take away ones from the ones and tens from the tens.', 'If there are not enough ones, trade a ten for 10 ones first.'], (r) => {
  const v = r.int(0, 2), t = r.int(2, 9), o = r.int(0, 9), a = 10 * t + o;
  if (v === 0) {
    const b = r.int(1, 9), have = b > o ? o + 10 : o;
    return num(a - b, [b > o ? `There are only ${o} ones, so trade 1 ten for 10 ones: ${t - 1} tens and ${o + 10} ones.` : `There are ${o} ones. Take away ${b} of them.`, `${have} − ${b} = ${have - b} ones left, so ${a} − ${b} = ${a - b}.`, `So the answer is ${a - b}.`], { q: `The blocks show a number. Take away ${b}. How many are left?`, visual: { type: 'blocks', tens: t, ones: o }, expr: `${a}-${b}` });
  }
  const bt = r.int(1, t - 1), bo = r.int(0, 9), b = 10 * bt + bo;
  if (v === 1) {
    return num(a - b, [bo > o ? `Not enough ones: trade 1 ten, so ${t - 1} tens and ${o + 10} ones.` : `Ones: ${o} − ${bo} = ${o - bo}.`, bo > o ? `Ones: ${o + 10} − ${bo} = ${o + 10 - bo}. Tens: ${t - 1} − ${bt} = ${t - 1 - bt}. That is ${a - b}.` : `Tens: ${t} − ${bt} = ${t - bt}. That is ${a - b}.`, `So ${a} − ${b} = ${a - b}.`], { q: `The blocks show a number. Take away ${bt} ten${bt > 1 ? 's' : ''} and ${bo} one${bo === 1 ? '' : 's'}. What is left?`, visual: { type: 'blocks', tens: t, ones: o }, expr: `${a}-${b}` });
  }
  return num(a - b, [`First take away the tens: ${a} − ${10 * bt} = ${a - 10 * bt}.`, `Then take away the ones: ${a - 10 * bt} − ${bo} = ${a - b}.`, `So ${a} − ${b} = ${a - b}.`], { q: `Take away tens, then ones: ${a} − ${b} = ?`, expr: `${a}-${b}` });
});

// ═════════ 15. Subtraction - two digits ═════════
skill('2-sub2-facts', 2, 'Subtraction', 'Subtract two-digit numbers', ['Subtract the ones first, then the tens.', 'Taking away a multiple of 10 only changes the tens digit.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(20, 99), b = r.int(1, 9);
    return num(a - b, columnSub(a, b), { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  if (v === 1) {
    const a = r.int(21, 99), t = r.int(1, Math.floor(a / 10) - 1), b = 10 * t;
    return num(a - b, [St(`${b} is ${t} ten${t > 1 ? 's' : ''}. Count back by tens from ${a}.`, numberLine(a - b, a, { step: 10, jumps: Array.from({ length: t }, (_, i) => ({ from: a - 10 * i, to: a - 10 * i - 10, label: '−10' })) })), `${multiplesOf(10, t).map((x) => a - x).join(', ')}.`, `So ${a} − ${b} = ${a - b}.`], { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  const a = r.int(30, 99), b = r.int(11, a - 5);
  return num(a - b, columnSub(a, b), { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
});
skill('2-sub2-problems', 2, 'Subtraction', 'Subtraction problems to 100', ['Find the whole and the part you know, then subtract.', 'Check by adding: the answer plus what you took away gives the whole.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const a = r.int(30, 99), b = r.int(11, a - 5);
    return num(a - b, [`Subtract: ${a} − ${b}.`, `${a} − ${b} = ${a - b}. Check: ${a - b} + ${b} = ${a}.`, `So the answer is ${a - b}.`], { q: subStory(r, a, b), expr: `${a}-${b}` });
  }
  if (v === 1) {
    const a = r.int(40, 99), b = r.int(11, a - 10), c = a - b;
    return r.bool() ? num(b, [`Think: ${c} + ? = ${a}.`, `${a} − ${c} = ${b}.`, `So the missing number is ${b}.`], { q: `${a} − ? = ${c}`, expr: `${a}-${c}` })
      : num(a, [`The missing number is the whole: add ${b} + ${c}.`, `${b} + ${c} = ${a}.`, `So the missing number is ${a}.`], { q: `? − ${b} = ${c}`, expr: `${b}+${c}` });
  }
  if (v === 2) {
    const a = r.int(50, 99), b = r.int(11, 40), d = a - b; let c = 10 * r.int(Math.floor(d / 10) + 1, 10); if (c === a) c = c === 100 ? 90 : c + 10; if (c <= d) c = 100;
    return num(c - d, [`The left side is ${a} − ${b} = ${d}.`, `So ${c} − ? = ${d}: ${c} − ${d} = ${c - d}.`, `So the missing number is ${c - d}.`], { q: `Make both sides equal: ${a} − ${b} = ${c} − ?`, expr: `${c}-(${a}-${b})` });
  }
  if (v === 3) {
    const k = r.int(11, 30), ins = r.shuffle([45, 52, 60, 67, 73, 81, 88, 94]).slice(0, 4), miss = r.int(0, 3), ans = ins[miss] - k;
    return num(ans, [`Each output is the input minus ${k}.`, `${ins[miss]} − ${k} = ${ans}.`, `So the missing output is ${ans}.`], { q: `The rule is "subtract ${k}". What is the missing output?`, visual: ioTable(ins, (x) => x - k, miss), expr: `${ins[miss]}-${k}` });
  }
  const a = r.int(30, 99), b = r.int(11, a - 15), right = `${a} − ${b} = ${a - b}`;
  return mc(r, right, [`${a} + ${b} = ${a + b}`, `${a} − ${b + 10} = ${a - b - 10}`, `${a - b} − ${b} = ${a - 2 * b}`], { q: `A bakery made ${a} bagels. It sold ${b} of them. Which number sentence shows how many bagels are left?`, steps: ['Some bagels were sold, so subtract.', `Start with ${a} and take away ${b}.`, `The sentence is ${right}.`] });
});

// ═════════ 16. Mixed operations - two digits ═════════
skill('2-mixed100', 2, 'Mixed operations', 'Add and subtract to 100', ['If the answer is bigger than the first number, the sign is +. If it is smaller, the sign is −.', 'Adding or taking away 10 changes only the tens digit.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(20, 80), b = r.int(2, 19), add = r.bool(), c = add ? a + b : a - b, right = add ? '+' : '−';
    return mc(r, right, ['+', '−'], { q: `Which sign makes this true? ${a} ☐ ${b} = ${c}`, steps: [`${c} is ${add ? 'more' : 'less'} than ${a}.`, `${a} ${right} ${b} = ${c}.`, `So the sign is ${right}.`] });
  }
  if (v === 1) {
    const add = r.bool(), ins = r.shuffle([14, 23, 35, 41, 56, 62, 78, 87]).slice(0, 4), miss = r.int(0, 3), ans = ins[miss] + (add ? 10 : -10);
    return num(ans, [`The rule ${add ? 'adds' : 'takes away'} 10: only the tens digit changes.`, `${ins[miss]} ${add ? '+' : '−'} 10 = ${ans}.`, `So the missing output is ${ans}.`], { q: `The rule is "${add ? 'add' : 'subtract'} 10". What is the missing output?`, visual: ioTable(ins, (x) => x + (add ? 10 : -10), miss), expr: `${ins[miss]}${add ? '+' : '-'}10` });
  }
  if (v === 2) {
    const a = r.int(30, 90), b = r.int(5, 25), d = a - b, c = r.int(2, d - 2);
    return num(d - c, [`The left side is ${a} − ${b} = ${d}.`, `So ${c} + ? = ${d}: ${d} − ${c} = ${d - c}.`, `So the missing number is ${d - c}.`], { q: `Make both sides equal: ${a} − ${b} = ${c} + ?`, expr: `${a}-${b}-${c}` });
  }
  const add = r.bool(), a = r.int(20, 80), b = add ? r.int(11, 99 - a) : r.int(11, a - 5), ans = add ? a + b : a - b;
  return num(ans, add ? columnAdd([a, b]) : columnSub(a, b), { q: `${a} ${add ? '+' : '−'} ${b} = ?`, expr: `${a}${add ? '+' : '-'}${b}` });
});
skill('2-mixed100-words', 2, 'Mixed operations', 'Word problems and rules to 100', ['Decide first: are things joined (add), or taken away or compared (subtract)?', 'For a table, find the change in one row, then check another row.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const nm = r.pick(NAMES), a = r.int(25, 60), b = r.int(11, 30), c = r.int(5, 30), ans = a + b - c;
    return num(ans, [`First add the new beads: ${a} + ${b} = ${a + b}.`, `Then take away the beads used: ${a + b} − ${c} = ${ans}.`, `So ${nm} has ${ans} beads now.`], { q: `${nm} had ${a} beads and bought a bag of ${b} more. Then ${nm} used ${c} beads to make a bracelet. How many beads does ${nm} have now?`, expr: `${a}+${b}-${c}` });
  }
  if (v === 1) {
    const add = r.bool(), k = r.int(11, 35), ins = sortedAsc(r.shuffle([36, 40, 45, 52, 58, 61]).slice(0, 3)), right = `${add ? 'Add' : 'Subtract'} ${k}`;
    const rows = ins.map((x) => [x, add ? x + k : x - k]);
    return mc(r, right, [`${add ? 'Subtract' : 'Add'} ${k}`, `${add ? 'Add' : 'Subtract'} ${k + 10}`, `${add ? 'Add' : 'Subtract'} ${k - 10}`], { q: 'What is the rule for this table?', visual: { type: 'table', head: ['In', 'Out'], rows }, steps: [`${rows[0][0]} → ${rows[0][1]}: it goes ${add ? 'up' : 'down'} by ${k}.`, `Check: ${rows[2][0]} ${add ? '+' : '−'} ${k} = ${rows[2][1]}.`, `So the rule is "${right.toLowerCase()}".`] });
  }
  const n = r.int(30, 90), a = r.int(11, n - 11), b = r.int(n + 5, 99), right = r.bool() ? `${a} + ${n - a}` : `${b} − ${b - n}`;
  return mc(r, right, [`${a} + ${n - a + 10}`, `${b} − ${b - n - 1}`, `${a} + ${n - a - 1}`, `${b} − ${b - n + 10}`], { q: `Which one is equal to ${n}?`, steps: ['Work out each one.', `${right} = ${n}.`] });
});

// ═════════ 17. Addition - three digits ═════════
skill('2-add-hundreds', 2, 'Addition', 'Add hundreds and tens', ['Add hundreds like ones: 3 hundreds + 4 hundreds = 7 hundreds = 700.', 'Line up the places when you add bigger numbers.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(1, 8), b = r.int(1, 9 - a);
    return num(100 * (a + b), [`${100 * a} is ${a} hundred${a > 1 ? 's' : ''} and ${100 * b} is ${b} hundred${b > 1 ? 's' : ''}.`, `${a} + ${b} = ${a + b} hundreds = ${100 * (a + b)}.`, `So ${100 * a} + ${100 * b} = ${100 * (a + b)}.`], { q: `${100 * a} + ${100 * b} = ?`, expr: `${100 * a}+${100 * b}` });
  }
  if (v === 1) {
    const a = 10 * r.int(11, 89), byH = r.bool() && a < 900, b = byH ? 100 * r.int(1, Math.floor((999 - a) / 100)) : 10 * r.int(1, 9), ans = a + b;
    return num(ans, [byH ? `${b} is ${b / 100} hundred${b > 100 ? 's' : ''}. Add to the hundreds.` : `${b} is ${b / 10} ten${b > 10 ? 's' : ''}. Add to the tens.`, `${a} + ${b} = ${ans}.`, `So the answer is ${ans}.`], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
  }
  const a = r.int(111, 599), b = r.int(111, 999 - a), pl = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const d = (x) => `${pl(Math.floor(x / 100), 'hundred')}, ${pl(Math.floor(x / 10) % 10, 'ten')} and ${pl(x % 10, 'one')}`;
  return num(a + b, columnAdd([a, b]), { q: `Add ${d(a)} to ${d(b)}. What number do you get?`, expr: `${a}+${b}` });
});
skill('2-add3-problems', 2, 'Addition', 'Addition problems to 1000', ['Line up hundreds, tens and ones, then add.', 'For a missing number, subtract the part you know from the total.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(120, 600), b = r.int(100, 999 - a);
    return num(a + b, columnAdd([a, b]), { q: addStory(r, a, b), expr: `${a}+${b}` });
  }
  if (v === 1) {
    const a = r.int(100, 700), c = r.int(a + 50, 999);
    return num(c - a, [`What do you add to ${a} to get ${c}? Subtract: ${c} − ${a}.`, `${c} − ${a} = ${c - a}.`, `Check: ${a} + ${c - a} = ${c}. The missing number is ${c - a}.`], { q: `${a} + ? = ${c}`, expr: `${c}-${a}` });
  }
  if (v === 2) {
    const a = 10 * r.int(15, 50), b = 10 * r.int(10, 45), s = a + b, c = 100 * r.int(1, Math.floor((s - 10) / 100));
    return num(s - c, [`The left side is ${a} + ${b} = ${s}.`, `So ${c} + ? = ${s}: ${s} − ${c} = ${s - c}.`, `So the missing number is ${s - c}.`], { q: `Make both sides equal: ${a} + ${b} = ${c} + ?`, expr: `${a}+${b}-${c}` });
  }
  const k = r.pick([100, 150, 200, 250, 300, 125]), ins = r.shuffle([120, 245, 310, 406, 533, 618]).filter((x) => x + k <= 999).slice(0, 4), miss = r.int(0, 3), ans = ins[miss] + k;
  return num(ans, [`Each output is the input plus ${k}.`, `${ins[miss]} + ${k} = ${ans}.`, `So the missing output is ${ans}.`], { q: `The rule is "add ${k}". What is the missing output?`, visual: ioTable(ins, (x) => x + k, miss), expr: `${ins[miss]}+${k}` });
});

// ═════════ 18. Subtraction - three digits ═════════
skill('2-sub-hundreds', 2, 'Subtraction', 'Subtract hundreds, tens and three-digit numbers', ['Subtract hundreds like ones: 7 hundreds − 3 hundreds = 4 hundreds.', 'Line up the places, start with the ones, and regroup when you need to.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(2, 10), b = r.int(1, a - 1);
    return num(100 * (a - b), [`${comma(100 * a)} is ${a} hundreds and ${100 * b} is ${b} hundred${b > 1 ? 's' : ''}.`, `${a} − ${b} = ${a - b} hundred${a - b > 1 ? 's' : ''} = ${100 * (a - b)}.`, `So ${comma(100 * a)} − ${100 * b} = ${100 * (a - b)}.`], { q: `${comma(100 * a)} − ${100 * b} = ?`, expr: `${100 * a}-${100 * b}` });
  }
  if (v === 1) {
    const a = 10 * r.int(25, 99), byH = r.bool(), b = byH ? 100 * r.int(1, Math.floor(a / 100) - 1) : 10 * r.int(1, 9), ans = a - b;
    return num(ans, [byH ? `${b} is ${b / 100} hundred${b > 100 ? 's' : ''}. Take from the hundreds.` : `${b} is ${b / 10} ten${b > 10 ? 's' : ''}. Take from the tens.`, `${a} − ${b} = ${ans}.`, `So the answer is ${ans}.`], { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  const a = r.int(200, 999), b = r.int(100, a - 20);
  return num(a - b, columnSub(a, b), { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
});
skill('2-sub3-problems', 2, 'Subtraction', 'Subtraction problems to 1000', ['Subtract the smaller amount from the bigger one, place by place.', 'Check by adding your answer back on.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(300, 999), b = r.int(100, a - 50);
    return num(a - b, columnSub(a, b), { q: subStory(r, a, b), expr: `${a}-${b}` });
  }
  if (v === 1) {
    const a = r.int(400, 999), b = r.int(100, a - 100), c = a - b;
    return num(b, [`Think: ${c} + ? = ${a}.`, `${a} − ${c} = ${b}.`, `So the missing number is ${b}.`], { q: `${a} − ? = ${c}`, expr: `${a}-${c}` });
  }
  if (v === 2) {
    const a = 10 * r.int(50, 99), b = 10 * r.int(10, 40), d = a - b; let c = 100 * r.int(Math.floor(d / 100) + 1, 10); if (c === a) c += 100;
    return num(c - d, [`The left side is ${a} − ${b} = ${d}.`, `So ${comma(c)} − ? = ${d}: ${comma(c)} − ${d} = ${c - d}.`, `So the missing number is ${c - d}.`], { q: `Make both sides equal: ${a} − ${b} = ${comma(c)} − ?`, expr: `${c}-(${a}-${b})` });
  }
  const k = r.pick([100, 200, 150, 250, 300]), ins = r.shuffle([450, 520, 615, 730, 868, 942]).slice(0, 4), miss = r.int(0, 3), ans = ins[miss] - k;
  return num(ans, [`Each output is the input minus ${k}.`, `${ins[miss]} − ${k} = ${ans}.`, `So the missing output is ${ans}.`], { q: `The rule is "subtract ${k}". What is the missing output?`, visual: ioTable(ins, (x) => x - k, miss), expr: `${ins[miss]}-${k}` });
});

// ═════════ 19. Mixed operations - three digits ═════════
skill('2-mixed1000', 2, 'Mixed operations', 'Tables, sentences and comparing sums', ['Adding or taking away 10 changes the tens; 100 changes the hundreds.', 'To compare, work out each side first, then use <, > or =.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const k = r.pick([10, 100]) * (r.bool() ? 1 : -1), ins = r.shuffle([215, 340, 467, 528, 693, 781]).slice(0, 4), miss = r.int(0, 3), ans = ins[miss] + k;
    return num(ans, [`The rule ${k > 0 ? 'adds' : 'takes away'} ${Math.abs(k)}: only the ${Math.abs(k) === 10 ? 'tens' : 'hundreds'} digit changes.`, `${ins[miss]} ${k > 0 ? '+' : '−'} ${Math.abs(k)} = ${ans}.`, `So the missing output is ${ans}.`], { q: `The rule is "${k > 0 ? 'add' : 'subtract'} ${Math.abs(k)}". What is the missing output?`, visual: ioTable(ins, (x) => x + k, miss), expr: `${ins[miss]}+${k}` });
  }
  if (v === 1) {
    const add = r.bool(), a = r.int(30, 70), b = r.int(5, 29), lhs = add ? a + b : a - b, c = r.bool(0.25) ? lhs : lhs + r.nonzero(-6, 6);
    const sign = lhs > c ? '>' : lhs < c ? '<' : '=';
    return mc(r, sign, ['>', '<', '='], { q: `Which sign goes in the box? ${a} ${add ? '+' : '−'} ${b} ☐ ${c}`, steps: [`Work out the left side: ${a} ${add ? '+' : '−'} ${b} = ${lhs}.`, `Compare ${lhs} and ${c}.`, `${lhs} ${sign} ${c}, so ${a} ${add ? '+' : '−'} ${b} ${sign} ${c}.`] });
  }
  const nm = r.pick(NAMES), a = 10 * r.int(30, 80), b = 10 * r.int(5, 15), add = r.bool();
  const right = add ? `${a} + ${b} = ${a + b}` : `${a} − ${b} = ${a - b}`;
  const q = add ? `A school had ${a} library books. It bought ${b} new books. Now it has ${a + b} books. Which number sentence tells this story?` : `${nm} had ${a} points in a game and lost ${b} points. Now ${nm} has ${a - b} points. Which number sentence tells this story?`;
  return mc(r, right, [add ? `${a} − ${b} = ${a - b}` : `${a} + ${b} = ${a + b}`, add ? `${a + b} + ${b} = ${a + 2 * b}` : `${a - b} − ${b} = ${a - 2 * b}`, `${b} + ${b} = ${2 * b}`], { q, steps: [add ? 'Books were added, so the sentence uses +.' : 'Points were lost, so the sentence uses −.', `The sentence is ${right}.`] });
});

// ═════════ 20. Properties ═════════
skill('2-fact-families', 2, 'Properties', 'Fact families and adding in any order', ['You can add in any order: 4 + 9 = 9 + 4.', 'A fact family uses the same three numbers: 3 + 5 = 8, 5 + 3 = 8, 8 − 5 = 3, 8 − 3 = 5.'], (r) => {
  const v = r.int(0, 2), a = r.int(2, 12); let b = r.int(2, 12); if (b === a) b = a === 12 ? 11 : a + 1; const c = a + b;
  if (v === 0) {
    return num(a, ['Adding in a different order gives the same total.', `${a} + ${b} = ${b} + ${a} = ${c}.`, `So the missing number is ${a}.`], { q: `${a} + ${b} = ${b} + ?`, expr: `${a}` });
  }
  if (v === 1) {
    return r.bool() ? num(a, [`${a} + ${b} = ${c} uses the numbers ${a}, ${b} and ${c}.`, `Take ${b} from the total: ${c} − ${b} = ${a}.`, `So the answer is ${a}.`], { q: `${a} + ${b} = ${c}. So ${c} − ${b} = ?`, expr: `${c}-${b}` })
      : num(c, [`${c} − ${b} = ${a} uses the numbers ${a}, ${b} and ${c}.`, `The related addition puts the parts back together: ${a} + ${b} = ${c}.`, `So the answer is ${c}.`], { q: `${c} − ${b} = ${a}. So ${a} + ${b} = ?`, expr: `${a}+${b}` });
  }
  const right = `${c} − ${a} = ${a}`, fam = [`${a} + ${b} = ${c}`, `${b} + ${a} = ${c}`, `${c} − ${b} = ${a}`, `${c} − ${a} = ${b}`];
  return mc(r, right, r.shuffle(fam).slice(0, 3), { q: `Which number sentence is NOT in the fact family for ${a}, ${b} and ${c}?`, steps: [`The family is: ${fam.join(', ')}.`, `${right} is not true, so it is not in the family.`] });
});
skill('2-op-terms', 2, 'Properties', 'Maths words and comparing without working out', ['The answer to an addition is the sum. The answer to a subtraction is the difference.', 'The answer to a multiplication is the product, and to a division the quotient.'], (r) => {
  if (r.bool()) {
    const [op, word, kind] = r.pick([['+', 'sum', 'an addition'], ['−', 'difference', 'a subtraction'], ['×', 'product', 'a multiplication'], ['÷', 'quotient', 'a division']]);
    const b = r.int(2, 5); let a = op === '×' ? r.int(2, 10) : r.int(6, 15); if (op === '÷') a = r.int(2, 10) * b;
    const ans = { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[op];
    return mc(r, word, ['sum', 'difference', 'product', 'quotient'], { q: `In ${a} ${op} ${b} = ${ans}, what is ${ans} called?`, steps: [`The sign is ${op}.`, `The answer to ${kind} is the ${word}.`] });
  }
  const a = r.int(20, 80), b = r.int(10, 40), d = r.nonzero(-5, 5), add = r.bool();
  const left = add ? `${a} + ${b}` : `${a} − ${b}`, right2 = add ? `${a} + ${b + d}` : `${a} − ${b + d}`;
  const sign = add ? (d > 0 ? '<' : '>') : (d > 0 ? '>' : '<');
  return mc(r, sign, ['<', '>', '='], { q: `Without working out the answers, which sign goes in the box? ${left} ☐ ${right2}`, steps: [`Both start with ${a}. Compare ${b} and ${b + d}.`, add ? `Adding ${d > 0 ? 'more' : 'less'} makes a ${d > 0 ? 'bigger' : 'smaller'} total.` : `Taking away ${d > 0 ? 'more' : 'less'} leaves ${d > 0 ? 'less' : 'more'}.`, `So ${left} ${sign} ${right2}.`] });
});

// ═════════ 21. Estimation and rounding ═════════
skill('2-round', 2, 'Estimation and rounding', 'Round to the nearest ten, hundred or thousand', ['Find the two tens (or hundreds) the number is between.', 'Pick the closer one. Halfway, like 45, rounds up.'], (r) => {
  const v = r.int(0, 3);
  if (v === 3) {
    const n = 10 * r.int(1, 9) + r.int(1, 9), lo = n - (n % 10), hi = lo + 10, ans = Math.round(n / 10) * 10;
    return mc(r, ans, [lo === ans ? hi : lo, n], { q: 'The dot shows a number. Which ten is it closest to?', visual: numberLine(lo, hi, { marks: [n] }), steps: [`The dot is at ${n}, between ${lo} and ${hi}.`, `It is closer to ${ans}${n % 10 === 5 ? ' (halfway rounds up)' : ''}.`] });
  }
  const to = [10, 100, 1000][v], n = to === 10 ? r.int(11, 999) : to === 100 ? r.int(101, 999) : r.int(1001, 9999);
  const ans = Math.round(n / to) * to, lo = Math.floor(n / to) * to, hi = lo + to, d = Math.floor(n / (to / 10)) % 10;
  return num(ans, [`${comma(n)} is between ${comma(lo)} and ${comma(hi)}.`, `Look at the next digit to the right: ${d}. ${d >= 5 ? 'It is 5 or more, so round up.' : 'It is less than 5, so round down.'}`, `So ${comma(n)} rounds to ${comma(ans)}.`], { q: `Round ${comma(n)} to the nearest ${comma(to)}.`, expr: `Math.round(${n}/${to})*${to}` });
});
skill('2-estimate', 2, 'Estimation and rounding', 'Estimate sums and differences', ['To estimate, round each number first, then add or subtract.', 'An estimate is close to the real answer, and easy to work out.'], (r) => {
  const v = r.int(0, 2), R10 = (x) => Math.round(x / 10) * 10, R100 = (x) => Math.round(x / 100) * 100;
  if (v === 0) {
    const a = r.int(11, 59), b = r.int(11, 39);
    return num(R10(a) + R10(b), [`Round each to the nearest ten: ${a} → ${R10(a)}, ${b} → ${R10(b)}.`, `${R10(a)} + ${R10(b)} = ${R10(a) + R10(b)}.`, `So the estimate is ${R10(a) + R10(b)}.`], { q: `Estimate ${a} + ${b} by rounding each number to the nearest ten.`, expr: `Math.round(${a}/10)*10+Math.round(${b}/10)*10` });
  }
  if (v === 1) {
    const a = r.int(110, 549), b = r.int(110, 449);
    return num(R100(a) + R100(b), [`Round each to the nearest hundred: ${a} → ${R100(a)}, ${b} → ${R100(b)}.`, `${R100(a)} + ${R100(b)} = ${R100(a) + R100(b)}.`, `So the estimate is ${R100(a) + R100(b)}.`], { q: `Estimate ${a} + ${b} by rounding each number to the nearest hundred.`, expr: `Math.round(${a}/100)*100+Math.round(${b}/100)*100` });
  }
  const a = r.int(51, 99), b = r.int(11, 44), est = R10(a) - R10(b);
  return num(est, [`Round each to the nearest ten: ${a} → ${R10(a)}, ${b} → ${R10(b)}.`, `${R10(a)} − ${R10(b)} = ${est}.`, `So the estimate is ${est}.`], { q: `Estimate ${a} − ${b} by rounding each number to the nearest ten.`, expr: `Math.round(${a}/10)*10-Math.round(${b}/10)*10` });
});

// ═════════ 22. Money ═════════
const COIN_W = { 5: ['nickel', 'nickels'], 10: ['dime', 'dimes'], 25: ['quarter', 'quarters'], 100: ['loonie', 'loonies'], 200: ['toonie', 'toonies'] };
const describe = (coins) => { const parts = [200, 100, 25, 10, 5].map((c) => [c, coins.filter((x) => x === c).length]).filter(([, k]) => k).map(([c, k]) => `${k} ${COIN_W[c][k === 1 ? 0 : 1]}`); return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0]; };
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const runTotals = (coins) => { let t = 0; return coins.map((c) => money((t += c))).join(', '); };
const randCoins = (r, k, set) => Array.from({ length: k }, () => r.pick(set)).sort((a, b) => b - a);
skill('2-money-count', 2, 'Money', 'Coin values and counting money', ['A nickel is 5¢, a dime is 10¢, a quarter is 25¢, a loonie is $1 and a toonie is $2.', 'Count the biggest coins and bills first, then count on.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const c = r.pick([5, 10, 25, 100, 200]);
    return mc(r, money(c), [5, 10, 25, 100, 200].filter((x) => x !== c).map(money), { q: `How much is this coin worth?`, visual: { type: 'coins', coins: [c] }, steps: [`This coin is a ${COIN_W[c][0]}.`, `A ${COIN_W[c][0]} is worth ${money(c)}.`] });
  }
  if (v === 1) {
    let coins; do coins = randCoins(r, r.int(2, 6), [25, 10, 5]); while (sum(coins) > 100);
    const t = sum(coins);
    return num(t, [`Start with the biggest coin and count on: ${runTotals(coins)}.`, `The total is ${t}¢.`, `So there are ${t} cents.`], { q: 'How many cents are shown?', visual: { type: 'coins', coins }, expr: coins.join('+') });
  }
  const coins = r.bool() ? randCoins(r, r.int(3, 6), [200, 100, 25, 10, 5]) : [...randCoins(r, r.int(1, 3), [2000, 1000, 500]), ...randCoins(r, r.int(1, 3), [200, 100, 25])];
  const t = sum(coins), d = (t / 100).toFixed(2);
  return num(d, [`Start with the biggest and count on: ${runTotals(coins)}.`, `The total is $${d}.`, `So the money is worth $${d}.`], { q: 'How much money is shown? Write it in dollars, like 3.45.', visual: { type: 'coins', coins }, expr: `(${coins.join('+')})/100` });
});
skill('2-money-compare', 2, 'Money', 'Compare and exchange coins', ['Find the value of each group before you compare.', 'Use the biggest coins you can to make an amount with the fewest coins.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    let A, B; do { A = randCoins(r, r.int(2, 5), [25, 10, 5]); B = randCoins(r, r.int(2, 5), [25, 10, 5]); } while (sum(A) === sum(B));
    const right = sum(A) > sum(B) ? 'Group A' : 'Group B', more = r.bool(), ans = more ? right : right === 'Group A' ? 'Group B' : 'Group A';
    return mc(r, ans, ['Group A', 'Group B'], { q: `Group A has ${describe(A)}. Group B has ${describe(B)}. Which group is worth ${more ? 'more' : 'less'}?`, steps: [`Group A: ${runTotals(A)}. That is ${money(sum(A))}.`, `Group B: ${runTotals(B)}. That is ${money(sum(B))}.`, `So ${ans} is worth ${more ? 'more' : 'less'}.`] });
  }
  if (v === 1) {
    const [q, ans, why] = r.pick([['How many nickels are worth the same as 1 quarter?', 5, '25 ÷ 5 = 5'], ['How many dimes are worth the same as 1 loonie?', 10, '100 ÷ 10 = 10'], ['How many quarters are worth the same as 1 loonie?', 4, '25 + 25 + 25 + 25 = 100'], ['How many quarters are worth the same as 1 toonie?', 8, '4 quarters make $1, so 8 make $2'], ['How many loonies are worth the same as 1 toonie?', 2, '$1 + $1 = $2'], ['How many nickels are worth the same as 1 dime?', 2, '5 + 5 = 10'], ['How many dimes are worth the same as 2 quarters?', 5, '2 quarters is 50¢, and 5 dimes is 50¢'], ['How many toonies are worth the same as a $10 bill?', 5, '$2 + $2 + $2 + $2 + $2 = $10'], ['How many $5 bills are worth the same as a $20 bill?', 4, '$5 + $5 + $5 + $5 = $20']]);
    return num(ans, ['Find how many of the smaller amount make the bigger one.', `${why}.`, `So the answer is ${ans}.`], { q, expr: `${ans}` });
  }
  if (v === 2) {
    const t = 5 * r.int(3, 39); let left = t; const used = [];
    for (const c of [200, 100, 25, 10, 5]) while (left >= c) { used.push(c); left -= c; }
    return num(used.length, [`Use the biggest coins first: ${describe(used)}.`, `Check: ${runTotals(used)}. That makes ${money(t)} with ${used.length} coins.`, `So the fewest coins is ${used.length}.`], { q: `What is the fewest number of coins that make ${money(t)}?`, expr: `${used.length}` });
  }
  const right = randCoins(r, r.int(2, 5), [25, 10, 5]), T = sum(right);
  const w1 = [...right, 5].sort((a, b) => b - a), w2 = right.map((c, i) => (i === 0 ? (c === 5 ? 10 : c === 10 ? 25 : 10) : c)).sort((a, b) => b - a), w3 = [...right.slice(0, -1), right.at(-1) === 25 ? 10 : 25].sort((a, b) => b - a);
  const wrongs = [w1, w2, w3].filter((w) => sum(w) !== T).map(describe);
  return mc(r, describe(right), wrongs, { q: `Which group of coins is worth ${money(T)}?`, steps: ['Count each group, biggest coins first.', `${describe(right)}: ${runTotals(right)}.`, `So ${describe(right)} make ${money(T)}.`] });
});
skill('2-money-change', 2, 'Money', 'Buying, change and money problems', ['To know if you have enough, count your money and compare it with the price.', 'Change is what you get back: count up from the price to what you paid.'], (r) => {
  const v = r.int(0, 3), item = r.pick(['pencil', 'eraser', 'sticker', 'apple', 'bookmark', 'ruler', 'granola bar']);
  if (v === 0) {
    const coins = randCoins(r, r.int(2, 5), [100, 25, 10, 5]), have = sum(coins), price = Math.max(5, have + 5 * r.nonzero(-4, 4)), ok = have >= price;
    return mc(r, ok ? 'Yes' : 'No', ['Yes', 'No'], { q: `A ${item} costs ${money(price)}. Is there enough money here to buy it?`, visual: { type: 'coins', coins }, steps: [`Count the money: ${runTotals(coins)}.`, `${money(have)} is ${ok ? 'at least' : 'less than'} ${money(price)}.`, ok ? 'So yes, there is enough.' : 'So no, there is not enough.'] });
  }
  if (v === 1) {
    let coins; do coins = randCoins(r, r.int(2, 5), [25, 10, 5]); while (sum(coins) >= 100);
    const t = sum(coins);
    return num(100 - t, [`Count the coins: ${t}¢.`, `$1 is 100¢. 100 − ${t} = ${100 - t}.`, `So ${100 - t}¢ more makes a dollar.`], { q: 'How many more cents are needed to make $1?', visual: { type: 'coins', coins }, expr: `100-(${coins.join('+')})` });
  }
  if (v === 2) {
    const p = 5 * r.int(3, 19);
    return num(100 - p, [`You pay $1, which is 100¢.`, `Count up from ${p}¢ to 100¢: 100 − ${p} = ${100 - p}.`, `So the change is ${100 - p}¢.`], { q: `A ${item} costs ${p}¢. You pay with a loonie ($1). How much change do you get, in cents?`, expr: `100-${p}` });
  }
  const nm = r.pick(NAMES);
  if (r.bool()) {
    const a = 5 * r.int(2, 10), b = 5 * r.int(2, 20 - a / 5 < 2 ? 2 : 20 - a / 5);
    const bb = Math.min(b, 100 - a);
    return num(a + bb, [`Add the two prices: ${a}¢ + ${bb}¢.`, `${a} + ${bb} = ${a + bb}.`, `So both cost ${a + bb}¢.`], { q: `A ${item} costs ${a}¢ and a juice box costs ${bb}¢. How many cents do they cost together?`, expr: `${a}+${bb}` });
  }
  const have = 5 * r.int(8, 20), spend = 5 * r.int(2, have / 5 - 1);
  return num(have - spend, [`Take what was spent from what ${nm} had: ${have}¢ − ${spend}¢.`, `${have} − ${spend} = ${have - spend}.`, `So ${nm} has ${have - spend}¢ left.`], { q: `${nm} has ${have}¢ and buys a ${item} for ${spend}¢. How many cents does ${nm} have left?`, expr: `${have}-${spend}` });
});

// ═════════ 23. Units of measurement ═════════
skill('2-measure-compare', 2, 'Measurement', 'Compare objects and temperature', ['Long and short, heavy and light, and holds more or less are ways to compare.', 'Temperature is measured in degrees Celsius (°C). Water freezes at 0°C.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const [big, small, word, opp] = r.pick([[['a school bus', 'a pencil'], ['a skipping rope', 'a paper clip'], ['a hockey stick', 'a spoon'], ['a canoe', 'a shoe']].map((p) => [...p, 'longer', 'shorter']), [['a giraffe', 'a cat'], ['a tree', 'a flower'], ['a house', 'a dog'], ['a lighthouse', 'a mailbox']].map((p) => [...p, 'taller', 'shorter']), [['a moose', 'a rabbit'], ['a bowling ball', 'a balloon'], ['a brick', 'a feather'], ['a watermelon', 'a grape']].map((p) => [...p, 'heavier', 'lighter']), [['a bathtub', 'a cup'], ['a bucket', 'a spoon'], ['a swimming pool', 'a sink'], ['a pot', 'a mug']].map((p) => [...p, 'holds more', 'holds less'])][r.int(0, 3)]);
    const askBig = r.bool(), right = askBig ? big : small;
    const ask = word === 'holds more' ? `Which ${askBig ? 'holds more' : 'holds less'}` : `Which is ${askBig ? word : opp}`;
    return mc(r, right, [askBig ? small : big], { q: `${ask}: ${r.bool() ? `${big} or ${small}` : `${small} or ${big}`}?`, steps: [`Think about the real things: ${big} ${word === 'holds more' ? 'holds much more than' : `is much ${word} than`} ${small}.`, `So the answer is ${right}.`] });
  }
  if (v === 1) {
    const opts = [['a snowy day for building a snowman', '−5°C'], ['a hot summer day at the beach', '30°C'], ['a cool, rainy fall day', '10°C'], ['a bowl of hot soup', '70°C']];
    const [what, right] = r.pick(opts);
    return mc(r, right, opts.map((o) => o[1]).filter((x) => x !== right), { q: `Which temperature makes the most sense for ${what}?`, steps: ['0°C is freezing. 20°C is warm room temperature. 100°C is boiling water.', `${what[0].toUpperCase() + what.slice(1)} is about ${right}.`] });
  }
  const x = 2 * r.int(-5, 14) + 1;
  return num(x, [St('Each tick on the thermometer scale is 1 degree. Only every second tick has a number.', numberLine(-10, 30, { step: 1, marks: [x] })), `The mark is one tick past ${neg(x - 1)}: ${neg(x - 1)} + 1 = ${neg(x)}.`, `So the temperature is ${neg(x)}°C.`], { q: 'The dot shows the temperature on a thermometer scale in °C. What is the temperature?', visual: numberLine(-10, 30, { step: 1, marks: [x] }), expr: `${x}` });
});
skill('2-metric-units', 2, 'Measurement', 'Choose the unit and the tool', ['Short lengths use centimetres (cm), longer ones use metres (m), and far distances use kilometres (km).', 'Mass uses grams (g) or kilograms (kg). Liquid uses millilitres (mL) or litres (L).'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [what, u] = r.pick([['the length of a pencil', 'cm'], ['the length of a soccer field', 'm'], ['the distance from Halifax to Toronto', 'km'], ['the width of a book', 'cm'], ['the height of a classroom door', 'm'], ['the distance a plane flies in an hour', 'km'], ['the length of a crayon', 'cm'], ['the length of a hockey rink', 'm']]);
    return mc(r, u, ['cm', 'm', 'km'], { q: `Which unit would you use to measure ${what}?`, steps: ['cm for small things, m for big things and rooms, km for long trips.', `For ${what}, use ${u}.`] });
  }
  if (v === 1) {
    const [what, u] = r.pick([['a paper clip', 'g'], ['a dog', 'kg'], ['an apple', 'g'], ['a bag of potatoes', 'kg'], ['a pencil', 'g'], ['a grown-up', 'kg'], ['a feather', 'g'], ['a bicycle', 'kg']]);
    return mc(r, u, ['g', 'kg'], { q: `Which unit would you use to measure the mass of ${what}?`, steps: ['Grams (g) are for light things. Kilograms (kg) are for heavy things.', `${what[0].toUpperCase() + what.slice(1)} is ${u === 'g' ? 'light, so use g' : 'heavy, so use kg'}.`] });
  }
  if (v === 2) {
    const [what, u] = r.pick([['a spoonful of medicine', 'mL'], ['a bathtub full of water', 'L'], ['a juice box', 'mL'], ['a big jug of milk', 'L'], ['a fish tank', 'L'], ['a small cup of tea', 'mL'], ['a bottle of eye drops', 'mL'], ['a swimming pool', 'L']]);
    return mc(r, u, ['mL', 'L'], { q: `Which unit would you use to measure how much liquid is in ${what}?`, steps: ['Millilitres (mL) are for small amounts. Litres (L) are for big amounts.', `${what[0].toUpperCase() + what.slice(1)} holds ${u === 'mL' ? 'a small amount, so use mL' : 'a lot, so use L'}.`] });
  }
  const tools = ['a ruler', 'a scale', 'a measuring cup', 'a thermometer', 'a clock'];
  const [what, t] = r.pick([['how long a book is', 'a ruler'], ['how heavy a bag of flour is', 'a scale'], ['how much water is in a jug', 'a measuring cup'], ['how hot it is outside', 'a thermometer'], ['how long recess lasts', 'a clock'], ['how wide a desk is', 'a ruler'], ['how much a puppy weighs', 'a scale']]);
  return mc(r, t, r.shuffle(tools.filter((x) => x !== t)).slice(0, 3), { q: `Which tool would you use to measure ${what}?`, steps: ['Ruler: length. Scale: mass. Measuring cup: liquid. Thermometer: temperature. Clock: time.', `To measure ${what}, use ${t}.`] });
});
skill('2-length', 2, 'Measurement', 'Measure and estimate length', ['Line up one end of the object with 0 on the ruler and read the other end.', 'If it does not start at 0, subtract: end − start.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const s = r.bool() ? 0 : r.int(1, 4), e = r.int(s + 3, 15), thing = r.pick(['crayon', 'pencil', 'leaf', 'key', 'eraser']);
    return num(e - s, [St(`The ${thing} goes from ${s} to ${e} on the ruler.`, numberLine(0, 15, { marks: [s, e], jumps: [{ from: s, to: e, label: thing }] })), `Length = ${e} − ${s} = ${e - s}.`, `So the ${thing} is ${e - s} cm long.`], { q: `The jump shows a ${thing} on a centimetre ruler. How long is the ${thing}, in cm?`, visual: numberLine(0, 15, { marks: [s, e], jumps: [{ from: s, to: e, label: thing }] }), expr: `${e}-${s}` });
  }
  if (v === 1) {
    const nm = r.pick(NAMES);
    if (r.bool()) { const a = r.int(30, 95), b = r.int(10, a - 10); return num(a - b, [`Start with ${a} cm and take away ${b} cm.`, `${a} − ${b} = ${a - b}.`, `So ${a - b} cm of ribbon is left.`], { q: `${nm} has a ribbon ${a} cm long and cuts off ${b} cm. How long is the ribbon now, in cm?`, expr: `${a}-${b}` }); }
    const a = r.int(2, 9), b = r.int(2, 9);
    return num(a + b, [`End to end means add the lengths.`, `${a} + ${b} = ${a + b}.`, `So the two boards are ${a + b} m long together.`], { q: `${nm} puts a ${a} m board and a ${b} m board end to end. How long are they together, in metres?`, expr: `${a}+${b}` });
  }
  if (v === 2) {
    const [what, right, wrongs] = r.pick([['a classroom door', '2 m', ['2 cm', '20 m']], ['a crayon', '9 cm', ['9 m', '90 m']], ['a school bus', '12 m', ['12 cm', '120 cm']], ['a math book', '25 cm', ['25 m', '2 cm']], ['a bed', '2 m', ['2 cm', '20 m']], ['your hand', '15 cm', ['15 m', '150 m']], ['a pencil', '18 cm', ['18 m', '1 cm']]]);
    return mc(r, right, wrongs, { q: `About how long is ${what}?`, steps: ['Your finger is about 1 cm wide. A big step is about 1 m.', `${what[0].toUpperCase() + what.slice(1)} is about ${right} long.`] });
  }
  const a = r.int(4, 12), b = r.int(2, a - 1), [x, y] = r.shuffle(['pencil', 'ruler', 'spoon', 'marker', 'straw']);
  return num(a - b, [`The ${x} is ${a} clips long and the ${y} is ${b} clips long.`, `${a} − ${b} = ${a - b}.`, `So the ${x} is ${a - b} paper clips longer.`], { q: `A ${x} is as long as ${a} paper clips in a row. A ${y} is as long as ${b} paper clips. How many paper clips longer is the ${x}?`, expr: `${a}-${b}` });
});

// ═════════ 24. Time ═════════
skill('2-time-read', 2, 'Time', "O'clock, half past, quarter past and a.m. or p.m.", ['Half past means 30 minutes after the hour. Quarter past is 15 minutes after, and quarter to is 15 minutes before the next hour.', 'a.m. is from midnight to noon. p.m. is from noon to midnight.'], (r) => {
  const v = r.int(0, 3), h = r.int(1, 12);
  if (v === 0) {
    const m = 5 * r.int(0, 11), t = tstr(h, m);
    return txt(t, [`The short hand is at or just past ${h}: the hour is ${h}.`, `The long hand is at ${m / 5 || 12}: ${m} minutes. The time is ${t}.`, `So it is ${t}.`], { q: 'What time does the clock show? Write it like 4:25.', visual: { type: 'clock', h, m }, accept: m === 0 ? [`${h} o'clock`, `${h}`] : [] });
  }
  const name = (hh, m) => ({ 0: `${hh} o'clock`, 15: `quarter past ${hh}`, 30: `half past ${hh}`, 45: `quarter to ${hh % 12 + 1}` }[m]);
  if (v === 1) {
    const m = r.pick([0, 15, 30, 45]), right = name(h, m);
    return mc(r, right, [0, 15, 30, 45].filter((x) => x !== m).map((x) => name(h, x)), { q: 'Which words tell the time on the clock?', visual: { type: 'clock', h, m }, steps: [`The long hand points to ${{ 0: 12, 15: 3, 30: 6, 45: 9 }[m]}: ${m} minutes${m === 45 ? ', which is 15 minutes before the next hour' : ''}.`, `So it is ${right}.`] });
  }
  if (v === 2) {
    const m = r.pick([0, 15, 30, 45]), right = name(h, m);
    return mc(r, right, [0, 15, 30, 45].filter((x) => x !== m).map((x) => name(h, x)), { q: `Which means the same as ${tstr(h, m)}?`, steps: [`${tstr(h, m)} is ${m} minutes after ${h}.`, `So it is ${right}.`] });
  }
  const [act, ans] = r.pick([['eating breakfast', 'a.m.'], ['waking up for school', 'a.m.'], ['eating supper', 'p.m.'], ['watching the sun set', 'p.m.'], ['going to bed at night', 'p.m.'], ['the first school bell in the morning', 'a.m.'], ['eating lunch at half past twelve', 'p.m.']]);
  return mc(r, ans, ['a.m.', 'p.m.'], { q: `Is ${act} more likely to happen in the a.m. or the p.m.?`, steps: ['Morning times are a.m. Afternoon and evening times are p.m.', `${act[0].toUpperCase() + act.slice(1)} is ${ans}.`] });
});
skill('2-elapsed', 2, 'Time', 'Elapsed time and time units', ['To find an end time, count on from the start time.', '1 hour = 60 minutes, 1 day = 24 hours, 1 week = 7 days.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const h = r.int(1, 7), m = r.pick([0, 30]), [d, dm, dn] = r.pick([[1, 0, '1 hour'], [2, 0, '2 hours'], [3, 0, '3 hours'], [0, 30, '30 minutes']]);
    const end = h * 60 + m + d * 60 + dm, eh = Math.floor(end / 60), em = end % 60, right = `${tstr(eh, em)} p.m.`;
    const ev = r.pick(['A movie', 'A soccer game', 'A birthday party', 'A swim lesson']);
    return mc(r, right, [`${tstr(eh + 1, em)} p.m.`, `${tstr(eh, (em + 30) % 60)} p.m.`, `${tstr(Math.max(1, eh - 1), em)} p.m.`], { q: `${ev} starts at ${tstr(h, m)} p.m. and lasts ${dn}. When does it end?`, steps: [`Start at ${tstr(h, m)} and count on ${dn}.`, `That is ${right}.`] });
  }
  if (v === 1) {
    const h = r.int(7, 9), d = r.int(1, 11 - h);
    return num(d, [`Count the hours from ${h}:00 to ${h + d}:00.`, `${h + d} − ${h} = ${d}.`, `So it lasted ${d} hour${d > 1 ? 's' : ''}. The answer is ${d}.`], { q: `A school trip left at ${h}:00 a.m. and came back at ${h + d}:00 a.m. How many hours long was it?`, expr: `${h + d}-${h}` });
  }
  if (v === 2) {
    const [q, ans, why] = r.pick([['How many minutes are in 1 hour?', 60, '1 hour = 60 minutes'], ['How many hours are in 1 day?', 24, '1 day = 24 hours'], ['How many days are in 1 week?', 7, '1 week = 7 days'], ['How many minutes are in half an hour?', 30, 'half of 60 is 30'], ['How many minutes are in a quarter of an hour?', 15, 'a quarter of 60 is 15'], ['How many days are in 2 weeks?', 14, '7 + 7 = 14'], ['How many months are in 1 year?', 12, '1 year = 12 months']]);
    return num(ans, ['Use what you know about time units.', `${why}.`, `So the answer is ${ans}.`], { q, expr: `${ans}` });
  }
  if (v === 3) {
    const step = r.pick([15, 30, 60]), h = r.int(1, 8), m = r.pick([0, 15, 30]), t0 = h * 60 + m, ts = [0, 1, 2, 3].map((i) => t0 + i * step), f = (t) => tstr(Math.floor(t / 60), t % 60);
    return mc(r, f(ts[3]), [f(ts[3] + 15), f(ts[2] + 5), f(ts[3] - 30 === ts[2] ? ts[3] + 30 : ts[3] - 30)], { q: `What time comes next in the pattern? ${ts.slice(0, 3).map(f).join(', ')}, ?`, steps: [`Each time is ${step === 60 ? '1 hour' : `${step} minutes`} later than the one before.`, `${f(ts[2])} + ${step === 60 ? '1 hour' : `${step} minutes`} = ${f(ts[3])}.`] });
  }
  const h1 = r.int(1, 10), m1 = 5 * r.int(0, 11); let h2 = r.int(1, 10), m2 = 5 * r.int(0, 11); if (h1 === h2 && m1 === m2) m2 = (m2 + 15) % 60;
  const later = r.bool(), a = tstr(h1, m1), b = tstr(h2, m2), aFirst = h1 * 60 + m1 < h2 * 60 + m2, right = later ? (aFirst ? b : a) : aFirst ? a : b;
  return mc(r, `${right} p.m.`, [`${a} p.m.`, `${b} p.m.`], { q: `Which time is ${later ? 'later' : 'earlier'} in the afternoon or evening: ${a} p.m. or ${b} p.m.?`, steps: [h1 !== h2 ? `Compare the hours: ${h1} and ${h2}.` : `Same hour, so compare the minutes: ${m1} and ${m2}.`, `${right} p.m. is ${later ? 'later' : 'earlier'}.`] });
});

// ═════════ 25. Days, months and seasons ═════════
skill('2-calendar', 2, 'Calendar', 'Days, months, seasons and calendars', ['There are 7 days in a week and 12 months in a year.', 'Most months have 30 or 31 days; February has 28 (29 in a leap year).'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const i = r.int(0, 6), after = r.bool(), k = r.int(1, 2), j = (i + (after ? k : -k) + 7) % 7;
    return mc(r, DAYS[j], r.shuffle(DAYS.filter((d) => d !== DAYS[j])).slice(0, 3), { q: `What day is ${k === 1 ? '' : '2 days '}${after ? 'after' : 'before'} ${DAYS[i]}?`, steps: [`The days in order: ${DAYS.join(', ')}.`, `${k === 1 ? 'One' : 'Two'} day${k > 1 ? 's' : ''} ${after ? 'after' : 'before'} ${DAYS[i]} is ${DAYS[j]}.`] });
  }
  if (v === 1) {
    const i = r.int(0, 11), after = r.bool(), j = (i + (after ? 1 : 11)) % 12;
    return mc(r, MONTHS[j], [MONTHS[(i + (after ? 11 : 1)) % 12], MONTHS[(j + 2) % 12], MONTHS[(j + 6) % 12]], { q: `Which month comes just ${after ? 'after' : 'before'} ${MONTHS[i]}?`, steps: [`The months go ${MONTHS[(i + 11) % 12]}, ${MONTHS[i]}, ${MONTHS[(i + 1) % 12]}.`, `So the answer is ${MONTHS[j]}.`] });
  }
  if (v === 2) {
    const [mo, s] = r.pick([['January', 'winter'], ['February', 'winter'], ['April', 'spring'], ['May', 'spring'], ['July', 'summer'], ['August', 'summer'], ['October', 'fall'], ['November', 'fall']]);
    return mc(r, s, ['winter', 'spring', 'summer', 'fall'], { q: `In Canada, which season is it in ${mo}?`, steps: ['Winter: December to February. Spring: March to May. Summer: June to August. Fall: September to November.', `${mo} is in ${s}.`] });
  }
  if (v === 3) {
    const i = r.pick([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    return num(MDAYS[i], ['Use your knuckles: months on a knuckle have 31 days; the others have 30 (except February).', `${MONTHS[i]} has ${MDAYS[i]} days.`, `So the answer is ${MDAYS[i]}.`], { q: `How many days are in ${MONTHS[i]}?`, expr: `${MDAYS[i]}` });
  }
  const mi = r.pick([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]), start = r.int(0, 6), n = MDAYS[mi], cells = [...Array(start).fill(''), ...Array.from({ length: n }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push('');
  const rows = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(7 * w, 7 * w + 7)), d = r.int(2, n), day = DAYS[(start + d - 1) % 7];
  return mc(r, day, r.shuffle(DAYS.filter((x) => x !== day)).slice(0, 3), { q: `This calendar shows ${MONTHS[mi]}. What day of the week is ${MONTHS[mi]} ${d}?`, visual: { type: 'table', head: DAYS.map((x) => x.slice(0, 3)), rows }, steps: [`Find ${d} on the calendar.`, `Look up to the top of its column: ${day}.`] });
});

// ═════════ 26. Data and graphs ═════════
const CATS = [['Favourite fruit', ['apples', 'bananas', 'grapes', 'pears']], ['Favourite sport', ['hockey', 'soccer', 'swimming', 'skating']], ['Pets', ['dogs', 'cats', 'fish', 'birds']], ['Favourite colour', ['red', 'blue', 'green', 'yellow']]];
skill('2-tally-pictograph', 2, 'Data and graphs', 'Tally charts, pictographs and tables', ['Tally marks are grouped in fives: ||||| is 5.', 'In a pictograph, check the key: each picture may stand for more than 1.'], (r) => {
  const v = r.int(0, 3), [title, labels] = r.pick(CATS), vals = labels.map(() => r.int(2, 14)), i = r.int(0, 3); let j = r.int(0, 3); if (j === i) j = (i + 1) % 4;
  if (v === 0) {
    return num(vals[i], [`Count the tally marks for ${labels[i]} in groups of 5: ${tally(vals[i])}.`, `${Math.floor(vals[i] / 5) ? `${Math.floor(vals[i] / 5)} group${vals[i] >= 10 ? 's' : ''} of 5 and ${vals[i] % 5} more` : `${vals[i]} marks`}: ${vals[i]}.`, `So ${vals[i]} children chose ${labels[i]}.`], { q: `${title}: how many children chose ${labels[i]}?`, visual: { type: 'table', head: [title, 'Tally'], rows: labels.map((l, k) => [l, tally(vals[k])]) }, expr: `${vals[i]}` });
  }
  if (v === 1) {
    const big = Math.max(vals[i], vals[j]), small = Math.min(vals[i], vals[j]), bl = vals[i] >= vals[j] ? labels[i] : labels[j], sl = bl === labels[i] ? labels[j] : labels[i];
    return num(big - small, [`${bl}: ${big}. ${sl}: ${small}.`, `${big} − ${small} = ${big - small}.`, `So ${big - small} more children chose ${bl}.`], { q: `${title}: how many more children chose ${bl} than ${sl}?`, visual: { type: 'table', head: [title, 'Tally'], rows: labels.map((l, k) => [l, tally(vals[k])]) }, expr: `${big}-${small}` });
  }
  if (v === 2) {
    const per = r.pick([2, 5]), pics = labels.map(() => r.int(1, 6)), ans = pics[i] * per;
    return num(ans, [`Each ● stands for ${per} votes. ${labels[i]} has ${pics[i]} ●.`, `Skip-count by ${per}: ${multiplesOf(per, pics[i]).join(', ')}.`, `So ${ans} children chose ${labels[i]}.`], { q: `${title}. Each ● stands for ${per} votes. How many children chose ${labels[i]}?`, visual: { type: 'table', head: [title, `Votes (● = ${per})`], rows: labels.map((l, k) => [l, '●'.repeat(pics[k])]) }, expr: `${pics[i]}*${per}` });
  }
  const s = sum(vals);
  return num(s, [`Add all the numbers in the table: ${vals.join(' + ')}.`, `${vals.join(' + ')} = ${s}.`, `So ${s} children answered.`], { q: `${title}: how many children answered in all?`, visual: { type: 'table', head: [title, 'Children'], rows: labels.map((l, k) => [l, vals[k]]) }, expr: vals.join('+') });
});
skill('2-bar-graphs', 2, 'Data and graphs', 'Bar graphs', ['Read a bar by looking across from its top to the scale.', 'The tallest bar is the most; the shortest bar is the least.'], (r) => {
  const v = r.int(0, 3), [title, labels] = r.pick(CATS), vals = []; while (vals.length < 4) { const x = r.int(1, 12); if (!vals.includes(x)) vals.push(x); }
  const i = r.int(0, 3); let j = r.int(0, 3); if (j === i) j = (i + 1) % 4;
  const visual = { type: 'bars', labels, values: vals, title };
  if (v === 0) return num(vals[i], [`Find the bar for ${labels[i]}.`, `Its top lines up with ${vals[i]}.`, `So the answer is ${vals[i]}.`], { q: `How many children chose ${labels[i]}?`, visual, expr: `${vals[i]}` });
  if (v === 1) {
    const most = r.bool(), k = vals.indexOf(most ? Math.max(...vals) : Math.min(...vals));
    return mc(r, labels[k], labels.filter((x) => x !== labels[k]), { q: `Which got the ${most ? 'most' : 'fewest'} votes?`, visual, steps: [`Find the ${most ? 'tallest' : 'shortest'} bar.`, `It is ${labels[k]}, with ${vals[k]}.`] });
  }
  if (v === 2) {
    const big = Math.max(vals[i], vals[j]), small = Math.min(vals[i], vals[j]), bl = labels[vals.indexOf(big)], sl = labels[vals.indexOf(small)];
    return num(big - small, [`${bl}: ${big}. ${sl}: ${small}.`, `${big} − ${small} = ${big - small}.`, `So ${big - small} more chose ${bl}.`], { q: `How many more children chose ${bl} than ${sl}?`, visual, expr: `${big}-${small}` });
  }
  return num(vals[i] + vals[j], [`${labels[i]}: ${vals[i]}. ${labels[j]}: ${vals[j]}.`, `${vals[i]} + ${vals[j]} = ${vals[i] + vals[j]}.`, `So the answer is ${vals[i] + vals[j]}.`], { q: `How many children chose ${labels[i]} or ${labels[j]} altogether?`, visual, expr: `${vals[i]}+${vals[j]}` });
});
skill('2-line-plot-venn', 2, 'Data and graphs', 'Line plots, Venn diagrams and grids', ['On a line plot, each x is one piece of data.', 'In a Venn diagram, the middle part belongs to both circles.', 'A grid point (3, 5) means 3 across, then 5 up.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const counts = [0, 1, 2, 3, 4].map(() => r.int(0, 5)); if (sum(counts) === 0) counts[2] = 3;
    const visual = { type: 'table', head: ['Pets', 0, 1, 2, 3, 4], rows: [['Children', ...counts.map((c) => ('x '.repeat(c).trim() || '—'))]] };
    if (r.bool()) { const k = r.int(0, 4); return num(counts[k], [`Look above ${k} pets.`, `Count the x marks: ${counts[k]}.`, `So ${counts[k]} children have ${k} pets.`], { q: `The line plot shows how many pets some children have. How many children have ${k} pet${k === 1 ? '' : 's'}?`, visual, expr: `${counts[k]}` }); }
    const s = sum(counts);
    return num(s, ['Each x is one child.', `Count every x: ${counts.join(' + ')} = ${s}.`, `So ${s} children were asked.`], { q: 'The line plot shows how many pets some children have. How many children were asked?', visual, expr: counts.join('+') });
  }
  if (v === 1) {
    const [A, B] = r.pick([['shapes with 4 sides', 'blue shapes'], ['red shapes', 'shapes with curved edges'], ['big shapes', 'shapes with 3 sides']]);
    const items = { 'shapes with 4 sides': [['a blue square', 'both'], ['a red rectangle', 'A'], ['a blue circle', 'B'], ['a yellow triangle', 'none']], 'red shapes': [['a red circle', 'both'], ['a red square', 'A'], ['a green oval', 'B'], ['a blue triangle', 'none']], 'big shapes': [['a big triangle', 'both'], ['a big square', 'A'], ['a small triangle', 'B'], ['a small circle', 'none']] }[A];
    const [it, where] = r.pick(items), say = { both: 'in the middle, in both circles', A: `only in the "${A}" circle`, B: `only in the "${B}" circle`, none: 'outside both circles' };
    return mc(r, say[where], Object.values(say).filter((x) => x !== say[where]), { q: `A Venn diagram has one circle for ${A} and one circle for ${B}. Where does ${it} go?`, steps: [`Is it one of the ${A}? ${where === 'both' || where === 'A' ? 'Yes' : 'No'}. Is it one of the ${B}? ${where === 'both' || where === 'B' ? 'Yes' : 'No'}.`, `So it goes ${say[where]}.`] });
  }
  if (v === 2) {
    const [a, b, c, d] = [r.int(1, 6), r.int(1, 5), r.int(1, 6), r.int(0, 4)], askA = r.bool();
    return num(askA ? a + b : c + b, [`The "${askA ? 'Red' : 'Round'}" circle includes its own part and the middle part.`, `${askA ? a : c} + ${b} = ${askA ? a + b : c + b}.`, `So ${askA ? a + b : c + b} shapes are ${askA ? 'red' : 'round'}.`], { q: `The table gives the counts in each part of a Venn diagram with a "Red" circle and a "Round" circle. How many shapes are ${askA ? 'red' : 'round'}?`, visual: { type: 'table', head: ['Only Red', 'Both', 'Only Round', 'Neither'], rows: [[a, b, c, d]] }, expr: `${askA ? a : c}+${b}` });
  }
  const x = r.int(1, 8), y = r.int(1, 8), right = `(${x}, ${y})`;
  return mc(r, right, [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y - 1})`].filter((s) => s !== right), { q: 'Which point is at the dot? (across, up)', visual: { type: 'coord', x, y }, steps: [`Go across from 0: ${x}.`, `Then go up: ${y}.`, `So the point is ${right}.`] });
});

// ═════════ 27. Patterns ═════════
skill('2-patterns', 2, 'Patterns', 'Repeating and growing patterns', ['A repeating pattern has a part that repeats again and again.', 'A growing pattern gets bigger by the same amount each time.'], (r) => {
  const v = r.int(0, 3), pool = ['circle', 'square', 'triangle', 'star', 'heart', 'red', 'blue', 'green', 'yellow'];
  const shapes = r.bool() ? ['circle', 'square', 'triangle', 'star', 'heart'] : ['red', 'blue', 'green', 'yellow'];
  const unit = r.pick([[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2], [0, 1, 2, 2]]), pick = r.shuffle(shapes).slice(0, 3), core = unit.map((k) => pick[k]);
  if (v === 0) {
    const seq = Array.from({ length: core.length * 2 + 1 }, (_, i) => core[i % core.length]), next = core[seq.length % core.length];
    return mc(r, next, pick.filter((x) => x !== next).concat(pool.filter((x) => !pick.includes(x) && shapes.includes(x)).slice(0, 1)), { q: `What comes next? ${seq.join(', ')}, ?`, steps: [`The part that repeats is: ${core.join(', ')}.`, `After ${seq.at(-1)} comes ${next}.`] });
  }
  if (v === 1) {
    const seq = Array.from({ length: core.length * 3 }, (_, i) => core[i % core.length]), k = r.int(core.length, seq.length - 1), right = seq[k];
    return mc(r, right, pick.filter((x) => x !== right), { q: `What is missing? ${seq.map((x, i) => (i === k ? '?' : x)).join(', ')}`, steps: [`The part that repeats is: ${core.join(', ')}.`, `So the missing one is ${right}.`] });
  }
  if (v === 2) {
    const a = r.int(1, 5), d = r.int(1, 4), n = r.int(4, 6), ans = a + (n - 1) * d;
    return num(ans, [`The rows go ${a}, ${a + d}, ${a + 2 * d}: each row has ${d} more.`, `Row ${n}: ${a} + ${n - 1} × ${d} = ${ans}. Count on: ${Array.from({ length: n }, (_, i) => a + i * d).join(', ')}.`, `So row ${n} has ${ans} blocks.`], { q: `A growing pattern has ${a} block${a > 1 ? 's' : ''} in row 1, ${a + d} in row 2 and ${a + 2 * d} in row 3. How many blocks are in row ${n}?`, expr: `${a}+(${n}-1)*${d}` });
  }
  const sym = r.pick(['●', '■', '▲', '★']), d = r.int(1, 2), a = r.int(1, 2), row = (k) => sym.repeat(a + k * d), right = row(3);
  return mc(r, right, [row(2), row(4), sym.repeat(a + 3 * d + 1 === a + 4 * d ? a + 3 * d + 3 : a + 3 * d + 1)], { q: `What comes next in the growing pattern? ${row(0)}  |  ${row(1)}  |  ${row(2)}  |  ?`, steps: [`Each step has ${d} more ${sym}.`, `${a + 2 * d} + ${d} = ${a + 3 * d}, so the next one has ${a + 3 * d}.`] });
});

// ═════════ 28. Two-dimensional shapes ═════════
skill('2-shapes-2d', 2, 'Two-dimensional shapes', 'Name shapes and count sides', GK.LESSONS['2-shapes-2d'], GK.g2Shapes2d);
skill('2-shape-moves', 2, 'Two-dimensional shapes', 'Slides, flips, turns, symmetry and congruent shapes', GK.LESSONS['2-shape-moves'], GK.g2ShapeMoves);

// ═════════ 29. Three-dimensional shapes ═════════
skill('2-shapes-3d', 2, 'Three-dimensional shapes', 'Faces, edges and vertices', GK.LESSONS['2-shapes-3d'], GK.g2Shapes3d);
skill('2-solids-real', 2, 'Three-dimensional shapes', 'Solids in the real world and nets', GK.LESSONS['2-solids-real'], GK.g2SolidsReal);

// ═════════ 30. Perimeter and area ═════════
skill('2-perimeter-area', 2, 'Perimeter and area', 'Perimeter and area', GK.LESSONS['2-perimeter-area'], GK.g2PerimArea);

// ═════════ 31. Fractions ═════════
const FNAME = { 2: ['one half', 'halves'], 3: ['one third', 'thirds'], 4: ['one fourth', 'fourths'] };
skill('2-fractions', 2, 'Fractions', 'Halves, thirds and fourths', ['A fraction is part of a whole cut into equal parts.', '1/2 is one of 2 equal parts, 1/3 is one of 3, and 1/4 is one of 4.'], (r) => {
  const v = r.int(0, 3), d = r.pick([2, 3, 4]), n = r.int(1, d - 1);
  if (v === 0) {
    const right = `${n}/${d}`;
    return mc(r, right, [`${d - n === n ? n + 1 : d - n}/${d}`, `${n}/${d + 1}`, `${d}/${n}`].filter((x) => x !== right), { q: 'What fraction of the bar is shaded?', visual: { type: 'fraction', n, d }, steps: [`The bar has ${d} equal parts. ${n} ${n === 1 ? 'is' : 'are'} shaded.`, `So ${right} is shaded.`] });
  }
  if (v === 1) {
    return mc(r, FNAME[d][1], ['halves', 'thirds', 'fourths'], { q: 'The bar is cut into equal parts. What are the parts called?', visual: { type: 'fraction', n: 1, d }, steps: [`Count the equal parts: ${d}.`, `${d} equal parts are called ${FNAME[d][1]}.`] });
  }
  if (v === 2) {
    let e = r.pick([2, 3, 4]); if (e === d) e = d === 4 ? 2 : d + 1;
    const big = r.bool(), right = (big ? Math.min(d, e) : Math.max(d, e));
    return mc(r, `1/${right}`, [`1/${d === right ? e : d}`], { q: `Which is ${big ? 'bigger' : 'smaller'}: 1/${d} or 1/${e}?`, steps: [St('Compare the bars: the more parts a whole is cut into, the smaller each part.', fractionBars([{ n: 1, d }, { n: 1, d: e }])), `So 1/${right} is ${big ? 'bigger' : 'smaller'}.`] });
  }
  const [food, nm] = [r.pick(['pizza', 'sandwich', 'pie', 'chocolate bar']), r.pick(NAMES)];
  return num(frac(1, d), [`The ${food} is cut into ${d} equal parts. ${nm} eats 1 of them.`, `1 out of ${d} equal parts is 1/${d}.`, `So ${nm} ate 1/${d} of the ${food}.`], { q: `A ${food} is cut into ${d} equal pieces. ${nm} eats 1 piece. What fraction of the ${food} did ${nm} eat?`, expr: `1/${d}` });
});

// ═════════ 32. Probability and statistics ═════════
skill('2-likely-mode', 2, 'Probability and statistics', 'How likely? and the mode', ['Certain means it will happen. Impossible means it cannot happen.', 'More marbles of a colour make it more likely to be picked.', 'The mode is the number that appears most often.'], (r) => {
  const v = r.int(0, 3), [c1, c2, c3] = r.shuffle(['red', 'blue', 'green', 'yellow']);
  if (v === 0) {
    let a = r.int(1, 9), b = r.int(1, 9); if (r.bool(0.2)) b = a;
    const right = a > b ? `${c1} is more likely` : a < b ? `${c2} is more likely` : 'they are equally likely';
    return mc(r, right, [`${c1} is more likely`, `${c2} is more likely`, 'they are equally likely'], { q: `A bag has ${a} ${c1} marble${a > 1 ? 's' : ''} and ${b} ${c2} marble${b > 1 ? 's' : ''}. You pick one without looking. Which is true?`, steps: [`There ${a > 1 ? 'are' : 'is'} ${a} ${c1} and ${b} ${c2}.`, a === b ? 'The numbers are the same.' : `More marbles means more likely.`, `So ${right}.`] });
  }
  if (v === 1) {
    const big = r.int(6, 10), small = r.int(1, 2), kind = r.int(0, 3);
    const bag = kind === 0 ? `${big} ${c1} marbles` : `${big} ${c1} marbles and ${small} ${c2} marble${small > 1 ? 's' : ''}`;
    const ask = [c1, c1, c2, c3][kind], right = ['certain', 'probable', 'unlikely', 'impossible'][kind];
    return mc(r, right, ['certain', 'probable', 'unlikely', 'impossible'], { q: `A bag has ${bag}. You pick one without looking. Is picking ${ask} certain, probable, unlikely or impossible?`, steps: [kind === 0 ? `Every marble is ${c1}.` : kind === 3 ? `There are no ${c3} marbles.` : `There are many ${c1} marbles and only a few ${c2}.`, `So picking ${ask} is ${right}.`] });
  }
  if (v === 2) {
    const m = r.int(2, 9), others = [], xs = [m, m, m]; while (others.length < 4) { const x = r.int(1, 10); if (x !== m && !others.includes(x)) others.push(x); }
    xs.push(...others, others[0]); const list = r.shuffle(xs);
    return num(m, [`Count how many times each number appears.`, `${m} appears 3 times, more than any other number.`, `So the mode is ${m}.`], { q: `What is the mode of these numbers? ${list.join(', ')}`, expr: `${m}` });
  }
  const [title, labels] = r.pick(CATS), vals = []; while (vals.length < 4) { const x = r.int(1, 10); if (!vals.includes(x)) vals.push(x); }
  const k = vals.indexOf(Math.max(...vals));
  return mc(r, labels[k], labels.filter((x) => x !== labels[k]), { q: `${title}: which answer is the mode (chosen most often)?`, visual: { type: 'table', head: [title, 'Votes'], rows: labels.map((l, i) => [l, vals[i]]) }, steps: ['The mode is the answer chosen most often.', `${labels[k]} has the most votes: ${vals[k]}.`] });
});

// ═════════ 33. Multiplication ═════════
skill('2-equal-groups', 2, 'Multiplication', 'Equal groups and repeated addition', ['Equal groups have the same number in each group.', 'Add the same number again and again: 3 groups of 4 is 4 + 4 + 4.'], (r) => {
  const v = r.int(0, 2), g = r.int(2, 5), k = r.int(2, 5);
  if (v === 0) {
    return num(g * k, [`There are ${g} rows with ${k} in each row.`, `${Array(g).fill(k).join(' + ')} = ${g * k}.`, `So there are ${g * k} in all.`], { q: `There are ${g} rows of ${k} dots. How many dots are there in all?`, visual: { type: 'array', rows: g, cols: k }, expr: `${g}*${k}` });
  }
  if (v === 1) {
    const right = Array(g).fill(k).join(' + ');
    return mc(r, right, [Array(k).fill(g).join(' + '), Array(g + 1).fill(k).join(' + '), `${g} + ${k}`].filter((x) => x !== right), { q: 'Which addition sentence matches the rows of this array?', visual: { type: 'array', rows: g, cols: k }, steps: [`There are ${g} rows, each with ${k}.`, `So add ${k}, ${g} times: ${right}.`] });
  }
  let kk = k; if (kk === g) kk = g === 5 ? 4 : g + 1;
  const thing = r.pick([['plates', 'cookies'], ['bags', 'apples'], ['vases', 'flowers'], ['boxes', 'pencils']]), story = (a, b) => `${a} ${thing[0]} with ${b} ${thing[1]} on each`;
  return mc(r, story(g, kk), [story(kk, g), story(g, kk + 1), story(g + 1, kk)], { q: `Which story matches ${Array(g).fill(kk).join(' + ')}?`, steps: [`${Array(g).fill(kk).join(' + ')} adds ${kk}, ${g} times.`, `That is ${g} groups of ${kk}: ${story(g, kk)}.`] });
});
skill('2-mult-sentences', 2, 'Multiplication', 'Multiplication sentences for groups and arrays', ['× means "groups of": 3 × 4 means 3 groups of 4.', 'An array with 3 rows of 4 shows 3 × 4.'], (r) => {
  const v = r.int(0, 2), g = r.int(2, 5); let k = r.int(2, 6); if (k === g) k += 1;
  if (v === 0) {
    const right = `${g} × ${k} = ${g * k}`;
    return mc(r, right, [`${g} + ${k} = ${g + k}`, `${g} × ${k + 1} = ${g * (k + 1)}`, `${g + 1} × ${k} = ${(g + 1) * k}`], { q: 'Which multiplication sentence matches this array?', visual: { type: 'array', rows: g, cols: k }, steps: [`There are ${g} rows with ${k} in each row.`, `${g} groups of ${k}: ${right}.`] });
  }
  if (v === 1) {
    const [a, b] = r.pick([['bags', 'oranges'], ['tables', 'chairs'], ['packs', 'markers'], ['nests', 'eggs']]), right = `${g} × ${k}`;
    return mc(r, right, [`${g} + ${k}`, `${g} × ${k + 1}`, `${k} + ${k}`], { q: `There are ${g} ${a} with ${k} ${b} in each. Which shows the total?`, steps: [`${g} equal groups of ${k}.`, `That is ${right}.`] });
  }
  return num(g, [`${Array(g).fill(k).join(' + ')} adds ${k} again and again.`, `Count the ${k}s: there are ${g}.`, `So ${Array(g).fill(k).join(' + ')} = ${g} × ${k}. The missing number is ${g}.`], { q: `${Array(g).fill(k).join(' + ')} = ? × ${k}`, expr: `${g}` });
});
skill('2-mult-facts', 2, 'Multiplication', 'Multiplication facts to 10', ['Skip-count to find a product: 4 × 5 is 5, 10, 15, 20.', 'Facts for 2, 5 and 10 are skip-counting by 2s, 5s and 10s.'], (r) => {
  const a = r.bool(0.6) ? r.pick([2, 3, 4, 5, 10]) : r.int(6, 9), b = r.int(1, 10), [x, y] = r.bool() ? [a, b] : [b, a];
  return num(x * y, [St(`${x} × ${y} means ${x} groups of ${y}.`, x * y <= 40 && x <= 10 && y <= 10 ? { type: 'array', rows: x, cols: y } : null), `Skip-count by ${y}, ${x} times: ${multiplesOf(y, x).join(', ')}.`, `So ${x} × ${y} = ${x * y}.`], { q: `${x} × ${y} = ?`, expr: `${x}*${y}` });
});

// ═════════ 34. Division ═════════
skill('2-division', 2, 'Division', 'Sharing into equal groups', ['Division shares things into equal groups.', 'Think of the multiplication: 12 ÷ 3 asks "3 groups of what make 12?"'], (r) => {
  const v = r.int(0, 2), g = r.int(2, 5), k = r.int(2, 6), n = g * k;
  if (v === 0) {
    const nm = r.pick(NAMES);
    return num(k, [St(`Share ${n} into ${g} equal rows.`, { type: 'array', rows: g, cols: k }), `Each row gets ${k}, because ${g} × ${k} = ${n}.`, `So ${n} ÷ ${g} = ${k}. Each friend gets ${k}.`], { q: `${nm} shares ${n} stickers equally among ${g} friends. How many stickers does each friend get?`, expr: `${n}/${g}` });
  }
  if (v === 1) {
    const right = `${n} ÷ ${g} = ${k}`;
    return mc(r, right, [`${n} − ${g} = ${n - g}`, `${n} ÷ ${k + 1} = ${g}`, `${n} + ${g} = ${n + g}`], { q: `${n} dots are put into ${g} equal rows. Which division sentence tells how many are in each row?`, visual: { type: 'array', rows: g, cols: k }, steps: [`${n} shared into ${g} rows.`, `Each row has ${k}: ${right}.`] });
  }
  const d = r.int(1, 10), q = r.int(1, 10);
  return num(q, [`Think: ${d} × ? = ${d * q}.`, `Skip-count by ${d}: ${multiplesOf(d, q).join(', ')}. That is ${q} jumps.`, `So ${d * q} ÷ ${d} = ${q}.`], { q: `${d * q} ÷ ${d} = ?`, expr: `${d * q}/${d}` });
});

export default list;
