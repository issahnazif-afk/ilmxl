// Maths: every question is made by code, from a seed, with its worked steps, and checked by scripts/check.mjs.
// Standard North American progression (Common Core-style): Pre-K to grade 8, then Algebra 1 (9), Geometry (10),
// Algebra 2 (11) and Precalculus (12).
//
// A generator gets a seeded rng `r` and returns an item:
//   { q, kind: 'num' | 'mc' | 'text', answer, choices?, a?, steps: [...], visual?, say?, expr? }
//   num:  answer is a number string ("12", "3/4", "-2.5"); the learner's answer is compared as a number
//         (fractions and decimals both accepted unless `exactForm` is set, e.g. "simplest form")
//   mc:   choices + a (index)
//   expr: a plain JS expression whose value must equal the answer (the checker evaluates it independently)
import * as GEO10 from './more/geo10.mjs';
import * as GC from './more/geo-core.mjs';
import * as GEO6 from './more/geo6.mjs';
import * as GEO8 from './more/geo8.mjs';
import * as GEO45 from './more/geo45.mjs';
import * as G1112 from './more/geo-g1112.mjs';
import * as F from './figs.mjs';
import { gcd, lcm, simplify, frac, isPrime, dec, sgn, neg } from './rng.mjs';
import { S as St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf } from './steps.mjs';
const par = (n) => (n < 0 ? `(${neg(n)})` : String(n));   // a negative number in brackets, for working

const mc = (r, right, wrongs, extra = {}) => {
  const set = [...new Set([String(right), ...wrongs.map(String)])].filter((x) => x !== 'NaN');
  const choices = r.shuffle(set.slice(0, 4));
  return { kind: 'mc', choices, a: choices.indexOf(String(right)), ...extra };
};
// numeric distractors around a right answer
const near = (r, x, spread = 3) => { const s = new Set(); let guard = 0; while (s.size < 3 && guard++ < 50) { const d = r.nonzero(-spread, spread); if (x + d >= 0) s.add(x + d); } return [...s]; };
const num = (answer, steps, extra = {}) => ({ kind: 'num', answer: String(answer), steps, ...extra });
const OBJ = ['apple', 'star', 'ball', 'fish', 'leaf', 'heart'];
const plural = (w, n) => (n === 1 ? w : w === 'fish' ? 'fish' : w === 'leaf' ? 'leaves' : `${w}s`);

const S = [];
const skill = (id, grade, strand, title, lesson, gen) => S.push({ id: `math-${id}`, subject: 'math', grade, strand, title, lesson, gen });

// ───────────── Pre-K ─────────────
skill('pk-count5', -1, 'Counting', 'Count to 5', ['We count by touching each one once.', 'Say one number for each thing. The last number you say is how many.'], (r) => {
  const n = r.int(1, 5), o = r.pick(OBJ);
  return mc(r, n, near(r, n, 2).filter((x) => x > 0 && x <= 6), { q: `How many ${plural(o, 2)}?`, visual: { type: 'objects', n, obj: o }, steps: [`Touch and count: ${Array.from({ length: n }, (_, i) => i + 1).join(', ')}.`, `There are ${n}.`] });
});
skill('pk-more', -1, 'Counting', 'More or fewer', ['More means a bigger group. Fewer means a smaller group.', 'Count both groups, then compare.'], (r) => {
  let a = r.int(1, 6), b = r.int(1, 6); while (b === a) b = r.int(1, 6);
  const o = r.pick(OBJ), askMore = r.bool();
  const right = (askMore ? a > b : a < b) ? 'Red group' : 'Blue group';
  return mc(r, right, [right === 'Red group' ? 'Blue group' : 'Red group'], { q: `Which group has ${askMore ? 'more' : 'fewer'}?`, visual: { type: 'groups', groups: [a, b], obj: o }, steps: [`Red has ${a}. Blue has ${b}.`, `${right} has ${askMore ? 'more' : 'fewer'}.`] });
});
const SHAPES2D = ['circle', 'square', 'triangle', 'rectangle'];
skill('pk-shapes', -1, 'Shapes', 'Name the shape', ['A circle is round. A square has 4 equal sides.', 'A triangle has 3 sides. A rectangle has 4 sides, two long and two short.'], (r) => {
  const s = r.pick(SHAPES2D);
  return mc(r, s, SHAPES2D.filter((x) => x !== s), { q: 'What shape is this?', visual: { type: 'shape', name: s }, steps: [{ circle: 'It is round: a circle.', square: '4 equal sides: a square.', triangle: '3 sides: a triangle.', rectangle: '4 sides, two long and two short: a rectangle.' }[s]] });
});

// ───────────── Kindergarten ─────────────
skill('k-count10', 0, 'Counting', 'Count to 10', ['Count each one once, in order.', 'The last number tells how many.'], (r) => {
  const n = r.int(3, 10), o = r.pick(OBJ);
  return num(n, [`Count: ${Array.from({ length: n }, (_, i) => i + 1).join(', ')}.`, `There are ${n}.`], { q: `How many ${plural(o, 2)}?`, visual: { type: 'objects', n, obj: o } });
});
skill('k-count20', 0, 'Counting', 'Count to 20', ['Count by tens first, then the ones.', 'A full ten-frame is 10.'], (r) => {
  const n = r.int(11, 20);
  return num(n, [`One full ten-frame is 10.`, `${n - 10} more makes ${n}.`], { q: 'How many dots?', visual: { type: 'tenframes', n } });
});
skill('k-after', 0, 'Counting', 'What number comes next?', ['Counting up, each number is one more.', 'After 7 comes 8.'], (r) => {
  const n = r.int(1, 19), before = r.bool(0.3);
  return before ? num(n - 1, [`One less than ${n} is ${n - 1}.`], { q: `What number comes just before ${n}?`, expr: `${n}-1` })
    : num(n + 1, [`One more than ${n} is ${n + 1}.`], { q: `What number comes just after ${n}?`, expr: `${n}+1` });
});
skill('k-add5', 0, 'Addition', 'Add within 5', ['Adding puts groups together.', 'Count all of them to find the total.'], (r) => {
  const a = r.int(0, 4), b = r.int(0, 5 - a), o = r.pick(OBJ);
  return num(a + b, [`${a} and ${b} more.`, `Count all: ${a + b}.`], { q: `${a} + ${b} = ?`, visual: { type: 'groups', groups: [a, b], obj: o, plus: true }, expr: `${a}+${b}` });
});
skill('k-sub5', 0, 'Subtraction', 'Subtract within 5', ['Subtracting takes some away.', 'Count what is left.'], (r) => {
  const a = r.int(1, 5), b = r.int(0, a);
  return num(a - b, [`Start with ${a}. Take away ${b}.`, `${a - b} are left.`], { q: `${a} − ${b} = ?`, visual: { type: 'takeaway', n: a, gone: b }, expr: `${a}-${b}` });
});
skill('k-add10', 0, 'Addition', 'Add within 10', ['Start with the bigger number and count on.', 'For 6 + 3: start at 6, count 7, 8, 9.'], (r) => {
  const a = r.int(0, 9), b = r.int(0, 10 - a), big = Math.max(a, b), small = Math.min(a, b);
  const hops = Array.from({ length: small }, (_, i) => ({ from: big + i, to: big + i + 1 }));
  return num(a + b, [St(`Start at the bigger number, ${big}.`, numberLine(0, 10, { marks: [big] })), small ? St(`Count on ${small}: ${Array.from({ length: small }, (_, i) => big + i + 1).join(', ')}.`, numberLine(0, 10, { marks: [a + b], jumps: hops })) : St('Adding 0 changes nothing.'), St(`So ${a} + ${b} = ${a + b}.`)], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
});
skill('k-compare10', 0, 'Counting', 'Compare numbers to 10', ['The number that comes later when we count is greater.', '8 is greater than 5.'], (r) => {
  let a = r.int(0, 10), b = r.int(0, 10); while (a === b) b = r.int(0, 10);
  return mc(r, Math.max(a, b), [Math.min(a, b)], { q: `Which number is greater: ${a} or ${b}?`, steps: [`Count up: ${Math.min(a, b)} comes before ${Math.max(a, b)}.`, `So ${Math.max(a, b)} is greater.`] });
});

// ───────────── Grade 1 ─────────────
skill('1-add20', 1, 'Addition', 'Add within 20', ['Make a ten to add quickly.', 'For 8 + 5: 8 + 2 = 10, then 3 more is 13.'], (r) => {
  const a = r.int(2, 10), b = r.int(2, 10); const need = 10 - Math.max(a, b);
  const big = Math.max(a, b), small = Math.min(a, b), rest = small - need, NL = (o) => numberLine(0, 20, o);
  return num(a + b, a + b > 10 && need > 0 ? [
    St(`Start at the bigger number, ${big}. It needs ${need} more to make 10.`, NL({ marks: [big] })),
    St(`Split ${small} into ${need} and ${rest}. Jump ${need} to get to 10.`, NL({ marks: [10], jumps: [{ from: big, to: 10, label: `+${need}` }] })),
    St(`Then jump the other ${rest}: 10 + ${rest} = ${a + b}.`, NL({ marks: [a + b], jumps: [{ from: big, to: 10, label: `+${need}` }, { from: 10, to: a + b, label: `+${rest}` }] })),
    St(`So ${a} + ${b} = ${a + b}.`),
  ] : [St(`Start at ${big} and count on ${small}.`, NL({ marks: [a + b], jumps: [{ from: big, to: a + b, label: `+${small}` }] })), St(`So ${a} + ${b} = ${a + b}.`)], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
});
skill('1-sub20', 1, 'Subtraction', 'Subtract within 20', ['Think addition: 13 − 5 asks "5 plus what makes 13?"', 'Or take away to 10 first.'], (r) => {
  const a = r.int(10, 20), b = r.int(2, 9);
  const toTen = a - 10, NL = (o) => numberLine(0, 20, o);
  return num(a - b, b > toTen && toTen > 0 ? [
    St(`Start at ${a}. Take away ${b} in two jumps: first back to 10.`, NL({ marks: [a] })),
    St(`${a} − ${toTen} = 10. That uses ${toTen} of the ${b}.`, NL({ marks: [10], jumps: [{ from: a, to: 10, label: `−${toTen}` }] })),
    St(`${b} − ${toTen} = ${b - toTen} more to take away: 10 − ${b - toTen} = ${a - b}.`, NL({ marks: [a - b], jumps: [{ from: a, to: 10, label: `−${toTen}` }, { from: 10, to: a - b, label: `−${b - toTen}` }] })),
    St(`So ${a} − ${b} = ${a - b}. Check: ${a - b} + ${b} = ${a}.`),
  ] : [St(`Start at ${a} and jump back ${b}.`, NL({ marks: [a - b], jumps: [{ from: a, to: a - b, label: `−${b}` }] })), St(`So ${a} − ${b} = ${a - b}. Check: ${a - b} + ${b} = ${a}.`)], { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
});
skill('1-missing', 1, 'Addition', 'Missing number', ['A missing number is a puzzle: what makes the sides equal?', 'For 4 + ? = 9, count up from 4 to 9.'], (r) => {
  const a = r.int(1, 10), c = r.int(a + 1, 20);
  return num(c - a, [St(`Start at ${a}. How far is it to ${c}?`, numberLine(0, 20, { marks: [a, c] })), St(`Count up from ${a} to ${c}: that is a jump of ${c - a}.`, numberLine(0, 20, { marks: [c], jumps: [{ from: a, to: c, label: `+${c - a}` }] })), St(`So ${a} + ${c - a} = ${c}. The missing number is ${c - a}.`)], { q: `${a} + ? = ${c}`, expr: `${c}-${a}` });
});
skill('1-tens', 1, 'Place value', 'Tens and ones', ['A two-digit number is made of tens and ones.', '47 is 4 tens and 7 ones.'], (r) => {
  const t = r.int(1, 9), o = r.int(0, 9), askT = r.bool();
  return num(askT ? t : o, [`${t * 10 + o} = ${t} tens and ${o} ones.`], { q: `How many ${askT ? 'tens' : 'ones'} are in ${t * 10 + o}?`, visual: { type: 'blocks', tens: t, ones: o } });
});
skill('1-compare100', 1, 'Place value', 'Compare two-digit numbers', ['Compare the tens first.', 'If the tens are the same, compare the ones.', '> means greater than, < means less than.'], (r) => {
  const a = r.int(10, 99); let b = r.bool(0.15) ? a : r.int(10, 99);
  const sign = a > b ? '>' : a < b ? '<' : '=';
  return mc(r, sign, ['>', '<', '='].filter((x) => x !== sign), { q: `${a} ? ${b}`, say: `Which sign goes between ${a} and ${b}?`, steps: [`Tens: ${Math.floor(a / 10)} and ${Math.floor(b / 10)}.`, a === b ? 'They are the same number.' : `${Math.max(a, b)} is greater.`, `${a} ${sign} ${b}.`] });
});
const clockSay = (h, m) => (m === 0 ? `${h} o'clock` : `${h}:${String(m).padStart(2, '0')}`);
skill('1-time', 1, 'Time', 'Time to the hour and half hour', ['The short hand shows the hour. The long hand shows the minutes.', 'When the long hand points to 6, it is half past: 30 minutes.'], (r) => {
  const h = r.int(1, 12), m = r.pick([0, 30]);
  const right = clockSay(h, m);
  return mc(r, right, [clockSay(h % 12 + 1, m), clockSay(h, m ? 0 : 30), clockSay(((h + 10) % 12) + 1, m)], { q: 'What time does the clock show?', visual: { type: 'clock', h, m }, steps: [`The short hand is at ${h}${m ? ' (just past it)' : ''}.`, m ? 'The long hand is at 6: 30 minutes.' : "The long hand is at 12: o'clock.", `It is ${right}.`] });
});

// ───────────── Grade 2 ─────────────
skill('2-add100', 2, 'Addition', 'Add within 100', ['Add the ones, then the tens.', 'If the ones make 10 or more, carry a ten.'], (r) => {
  const a = r.int(10, 89), b = r.int(10, 99 - a);
  const ones = (a % 10) + (b % 10);
  void ones;
  return num(a + b, columnAdd([a, b]), { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
});
skill('2-sub100', 2, 'Subtraction', 'Subtract within 100', ['Subtract the ones, then the tens.', 'If there are not enough ones, trade one ten for ten ones.'], (r) => {
  const a = r.int(20, 99), b = r.int(10, a - 1);
  return num(a - b, columnSub(a, b), { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
});
skill('2-skip', 2, 'Counting', 'Skip counting', ['Skip counting adds the same amount each time.', 'By 5s: 5, 10, 15, 20.'], (r) => {
  const by = r.pick([2, 5, 10, 100]), start = by * r.int(1, 8);
  const seq = [0, 1, 2].map((i) => start + i * by);
  const NL = (k, mark) => numberLine(start, start + 3 * by, { step: by, marks: mark ? [mark] : [], jumps: seq.slice(0, k).map((x) => ({ from: x, to: x + by, label: `+${by}` })) });
  return num(start + 3 * by, [St(`Look at how the numbers change: each one is ${by} more than the one before.`, NL(2)), St(`So add ${by} once more: ${seq.at(-1)} + ${by} = ${start + 3 * by}.`, NL(3, start + 3 * by)), St(`The next number is ${start + 3 * by}.`)], { q: `What comes next? ${seq.join(', ')}, ?`, expr: `${start}+3*${by}` });
});
skill('2-place1000', 2, 'Place value', 'Hundreds, tens and ones', ['A three-digit number has hundreds, tens and ones.', '352 = 300 + 50 + 2.'], (r) => {
  const n = r.int(100, 999), which = r.pick(['hundreds', 'tens', 'ones']);
  const d = { hundreds: Math.floor(n / 100), tens: Math.floor(n / 10) % 10, ones: n % 10 }[which];
  return num(d, [`${n} = ${Math.floor(n / 100) * 100} + ${(Math.floor(n / 10) % 10) * 10} + ${n % 10}.`, `The ${which} digit is ${d}.`], { q: `What digit is in the ${which} place in ${n}?` });
});
skill('2-evenodd', 2, 'Counting', 'Even and odd', ['Even numbers can be shared into two equal groups.', 'Even numbers end in 0, 2, 4, 6 or 8.'], (r) => {
  const n = r.int(1, 99), right = n % 2 ? 'Odd' : 'Even';
  return mc(r, right, [right === 'Odd' ? 'Even' : 'Odd'], { q: `Is ${n} even or odd?`, steps: [`${n} ends in ${n % 10}.`, `So it is ${right.toLowerCase()}.`] });
});
skill('2-add1000', 2, 'Addition', 'Add within 1000', ['Line up hundreds, tens and ones.', 'Add each place, carrying when you need to.'], (r) => {
  const a = r.int(100, 800), b = r.int(10, 999 - a);
  return num(a + b, columnAdd([a, b]), { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
});
skill('2-time5', 2, 'Time', 'Time to five minutes', ['Each number on the clock is 5 minutes for the long hand.', 'Long hand on 4 means 20 minutes.'], (r) => {
  const h = r.int(1, 12), m = 5 * r.int(1, 11);
  const t = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
  return mc(r, t(h, m), [t(h, (m + 5) % 60 || 5), t(h % 12 + 1, m), t(h, (60 - m) % 60 || 30)], { q: 'What time does the clock show?', visual: { type: 'clock', h, m }, steps: [`Long hand at ${m / 5}: ${m / 5} × 5 = ${m} minutes.`, `Short hand just past ${h}.`, `It is ${t(h, m)}.`] });
});

// ───────────── Grade 3 ─────────────
skill('3-mult', 3, 'Multiplication', 'Multiplication facts', ['Multiplying is adding equal groups.', '4 × 3 means 4 groups of 3.'], (r) => {
  const a = r.int(2, 10), b = r.int(2, 10);
  return num(a * b, [St(`${a} × ${b} means ${a} groups of ${b}: ${a} rows with ${b} in each row.`, a * b <= 60 ? { type: 'array', rows: a, cols: b } : null), St(`Skip count by ${b}, ${a} times: ${multiplesOf(b, a).join(', ')}.`), St(`So ${a} × ${b} = ${a * b}.`)], { q: `${a} × ${b} = ?`, visual: a * b <= 40 ? { type: 'array', rows: a, cols: b } : null, expr: `${a}*${b}` });
});
skill('3-div', 3, 'Division', 'Division facts', ['Dividing shares into equal groups.', 'Think multiplication: 24 ÷ 6 asks "6 times what is 24?"'], (r) => {
  const b = r.int(2, 10), c = r.int(2, 10);
  return num(c, [St(`${b * c} ÷ ${b} asks: how many groups of ${b} make ${b * c}? Think: ${b} × ? = ${b * c}.`, b * c <= 60 ? { type: 'array', rows: c, cols: b } : null), St(`Skip count by ${b} until you reach ${b * c}: ${multiplesOf(b, c).join(', ')}. That is ${c} groups.`), St(`${b} × ${c} = ${b * c}, so ${b * c} ÷ ${b} = ${c}.`)], { q: `${b * c} ÷ ${b} = ?`, expr: `${b * c}/${b}` });
});
skill('3-mult10', 3, 'Multiplication', 'Multiply by multiples of 10', ['To multiply by 40, multiply by 4, then by 10.', '6 × 40 = 6 × 4 × 10 = 240.'], (r) => {
  const a = r.int(2, 9), b = r.int(1, 9) * 10;
  return num(a * b, [`${a} × ${b / 10} = ${a * b / 10}.`, `Then × 10: ${a * b}.`], { q: `${a} × ${b} = ?`, expr: `${a}*${b}` });
});
skill('3-round', 3, 'Place value', 'Round to the nearest 10 or 100', ['Look at the digit to the right of the place you round to.', '5 or more rounds up; 4 or less rounds down.'], (r) => {
  const to = r.pick([10, 100]), n = r.int(to === 10 ? 11 : 101, 999);
  const ans = Math.round(n / to) * to;
  const lo = Math.floor(n / to) * to, hi = lo + to, d = to === 10 ? n % 10 : Math.floor(n / 10) % 10;
  return num(ans, [St(`${n} is between ${lo} and ${hi}. The halfway point is ${lo + to / 2}.`, numberLine(lo, hi, { step: to / 10, marks: [n] })), St(`Look at the ${to === 10 ? 'ones' : 'tens'} digit: ${d}. ${d >= 5 ? `${d} is 5 or more, so round up.` : `${d} is less than 5, so round down.`}`), St(`So ${n} rounds to ${ans}.`)], { q: `Round ${n} to the nearest ${to}.`, expr: `Math.round(${n}/${to})*${to}` });
});
skill('3-fracid', 3, 'Fractions', 'Name the fraction', ['The bottom number says how many equal parts in all.', 'The top number says how many parts are shaded.'], (r) => {
  const d = r.int(2, 8), n = r.int(1, d - 1);
  return mc(r, `${n}/${d}`, [`${d}/${n}`, `${n}/${d + 1}`, `${d - n}/${d}`].filter((x) => x !== `${n}/${d}`), { q: 'What fraction is shaded?', visual: { type: 'fraction', n, d }, steps: [`${d} equal parts in all.`, `${n} are shaded: ${n}/${d}.`] });
});
skill('3-fraccmp', 3, 'Fractions', 'Compare fractions with the same bottom', ['When the bottom numbers are the same, the parts are the same size.', 'More parts is more: 5/8 > 3/8.'], (r) => {
  const d = r.int(3, 12); let a = r.int(1, d - 1), b = r.int(1, d - 1); while (a === b) b = r.int(1, d - 1);
  const s = a > b ? '>' : '<';
  return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `${a}/${d} ? ${b}/${d}`, say: `Which sign goes between ${a} over ${d} and ${b} over ${d}?`, steps: [St(`Both fractions have ${d} equal parts, so the parts are the same size.`, fractionBars([{ n: a, d }, { n: b, d }])), St(`${Math.max(a, b)} parts is more than ${Math.min(a, b)} parts.`), St(`So ${a}/${d} ${s} ${b}/${d}.`)] });
});
skill('3-area', 3, 'Measurement', 'Area of a rectangle', ['Area is how many unit squares cover a shape.', 'For a rectangle: length × width.'], (r) => {
  const l = r.int(2, 12), w = r.int(2, 10), small = l * w <= 60;
  return num(l * w, [St('Area counts the unit squares inside. Count the squares in one row: the length.', small ? { type: 'grid', rows: w, cols: l } : GC.rectFig(l, w, 'units', [{ side: 0 }])), St(`There are ${w} rows, so area = length × width.`), St(`${l} × ${w} = ${l * w} square units.`)], { q: `A rectangle is ${l} units long and ${w} units wide. What is its area in square units?`, visual: small ? { type: 'grid', rows: w, cols: l } : GC.rectFig(l, w, 'units'), expr: `${l}*${w}` });
});
skill('3-perim', 3, 'Measurement', 'Perimeter', ['Perimeter is the distance all the way around.', 'Add every side.'], (r) => {
  const l = r.int(2, 20), w = r.int(2, 15);
  return num(2 * (l + w), [St(`Start at a corner and go all the way round. The sides are ${l}, ${w}, ${l} and ${w} cm.`, GC.rectFig(l, w, 'cm', [{ side: 0 }, { side: 1 }, { side: 2 }, { side: 3 }])), St(`${l} + ${w} + ${l} + ${w} = ${2 * (l + w)}.`), St(`So the perimeter is ${2 * (l + w)} cm.`)], { q: 'What is the perimeter of this rectangle, in cm?', visual: GC.rectFig(l, w, 'cm'), expr: `2*(${l}+${w})` });
});
skill('3-elapsed', 3, 'Time', 'Elapsed time', ['Count forward from the start time.', 'Count the hours, then the minutes.'], (r) => {
  const h = r.int(1, 10), m = 5 * r.int(0, 6), add = 5 * r.int(3, 20);
  const total = h * 60 + m + add, eh = Math.floor(total / 60), em = total % 60;
  const t = (hh, mm) => `${((hh - 1) % 12) + 1}:${String(mm).padStart(2, '0')}`;
  return mc(r, t(eh, em), [t(eh, (em + 10) % 60), t(eh + 1, em), t(eh - 1 || 12, em)], { q: `A class starts at ${t(h, m)} and lasts ${add} minutes. When does it end?`, steps: [`${add} minutes = ${Math.floor(add / 60)} hour${Math.floor(add / 60) === 1 ? '' : 's'} and ${add % 60} minutes.`, `${t(h, m)} + ${add} minutes = ${t(eh, em)}.`] });
});

// ───────────── Grade 4 ─────────────
skill('4-mult2', 4, 'Multiplication', 'Multiply 2-digit numbers', ['Split one number into tens and ones.', '23 × 14 = 23 × 10 + 23 × 4.'], (r) => {
  const a = r.int(11, 99), b = r.int(11, 49);
  return num(a * b, [St(`Picture ${a} × ${b} as a rectangle. Split each number into tens and ones.`, areaModel(a, b)), ...columnMul(a, b)], { q: `${a} × ${b} = ?`, expr: `${a}*${b}` });
});
skill('4-divrem', 4, 'Division', 'Divide with remainders', ['Find how many whole groups fit, then what is left over.', '17 ÷ 5 = 3 R 2.'], (r) => {
  const b = r.int(3, 9), q = r.int(3, 30), rem = r.int(1, b - 1), a = b * q + rem;
  return { kind: 'text', answer: `${q} R ${rem}`, accept: [`${q}r${rem}`, `${q} r ${rem}`, `${q}R${rem}`, `${q} remainder ${rem}`], q: `${a} ÷ ${b} = ? (write it like 7 R 2)`, steps: longDivision(a, b) };
});
skill('4-equivfrac', 4, 'Fractions', 'Equivalent fractions', ['Multiply the top and bottom by the same number.', '1/2 = 2/4 = 3/6.'], (r) => {
  const d = r.int(2, 6), n = r.int(1, d - 1), k = r.int(2, 5);
  return num(n * k, [St(`The bottom changed from ${d} to ${d * k}: it was multiplied by ${k}.`, fractionBars([{ n, d }])), St(`To keep the same amount, multiply the top by ${k} too: ${n} × ${k} = ${n * k}.`, fractionBars([{ n, d }, { n: n * k, d: d * k }])), St(`So ${n}/${d} = ${n * k}/${d * k}. The bars show the same amount.`)], { q: `${n}/${d} = ?/${d * k}`, expr: `${n}*${k}` });
});
skill('4-fracadd', 4, 'Fractions', 'Add and subtract like fractions', ['When the bottoms match, add or subtract the tops.', 'The bottom stays the same.'], (r) => {
  const d = r.int(3, 12), a = r.int(1, d - 1), b = r.int(1, d - 1), add = r.bool() || a <= b;
  const top = add ? a + b : a - b;
  const op = add ? '+' : '−';
  return num(`${top}/${d}`, [St(`Both fractions have ${d} equal parts, so the parts are the same size.`, fractionBars([{ n: a, d }, { n: b, d }])), St(`${add ? 'Add' : 'Subtract'} the tops: ${a} ${op} ${b} = ${top}. The bottom stays ${d}.`, top <= d ? fractionBars([{ n: top, d }]) : null), St(`So ${a}/${d} ${op} ${b}/${d} = ${top}/${d}${gcd(top, d) > 1 ? `, which simplifies to ${frac(top, d)}` : ''}.`)], { q: `${a}/${d} ${op} ${b}/${d} = ?`, expr: `${top}/${d}` });
});
skill('4-decfrac', 4, 'Decimals', 'Decimals and fractions', ['Tenths: 0.7 = 7/10. Hundredths: 0.07 = 7/100.', 'The place tells the bottom number.'], (r) => {
  const hund = r.bool(), n = hund ? r.int(1, 99) : r.int(1, 9);
  const d = hund ? 100 : 10, decs = hund ? (n / 100).toFixed(2) : (n / 10).toFixed(1);
  return num(decs, [`${n}/${d} means ${n} ${hund ? 'hundredths' : 'tenths'}.`, `${n}/${d} = ${decs}.`], { q: `Write ${n}/${d} as a decimal.`, expr: `${n}/${d}` });
});
skill('4-factors', 4, 'Number sense', 'Factors and primes', ['A factor divides a number with nothing left over.', 'A prime number has exactly two factors: 1 and itself.'], (r) => {
  if (r.bool()) {
    const n = r.int(2, 60), right = isPrime(n) ? 'Prime' : 'Composite';
    const f = [...Array(n).keys()].map((i) => i + 1).filter((i) => n % i === 0);
    return mc(r, right, [right === 'Prime' ? 'Composite' : 'Prime'], { q: `Is ${n} prime or composite?`, steps: [`Factors of ${n}: ${f.join(', ')}.`, f.length === 2 ? 'Exactly two factors: prime.' : 'More than two factors: composite.'] });
  }
  const n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48]);
  const fs = [...Array(n).keys()].map((i) => i + 1).filter((i) => n % i === 0 && i > 1 && i < n);
  const right = r.pick(fs), wrong = [...Array(n).keys()].map((i) => i + 1).filter((i) => n % i !== 0 && i > 1);
  return mc(r, right, r.shuffle(wrong).slice(0, 3), { q: `Which number is a factor of ${n}?`, steps: [`${n} ÷ ${right} = ${n / right}, nothing left over.`] });
});
skill('4-placemil', 4, 'Place value', 'Round large numbers', ['Find the place, look one digit to its right.', '5 or more: round up.'], (r) => {
  const to = r.pick([1000, 10000, 100000]), n = r.int(to + 1, to * 99);
  return num(Math.round(n / to) * to, [`Round ${n.toLocaleString('en-CA')} to the nearest ${to.toLocaleString('en-CA')}.`, `Answer: ${(Math.round(n / to) * to).toLocaleString('en-CA')}.`], { q: `Round ${n.toLocaleString('en-CA')} to the nearest ${to.toLocaleString('en-CA')}.`, expr: `Math.round(${n}/${to})*${to}` });
});
skill('4-angles', 4, 'Geometry', 'Angles on a line and in a right angle', GEO45.LESSONS.angles4, GEO45.angles4);

// ───────────── Grade 5 ─────────────
skill('5-fracunlike', 5, 'Fractions', 'Add fractions with unlike denominators', ['Find a common denominator first.', '1/2 + 1/3 = 3/6 + 2/6 = 5/6.'], (r) => {
  const b = r.int(2, 8); let d = r.int(2, 8); while (d === b) d = r.int(2, 8);
  const a = r.int(1, b - 1), c = r.int(1, d - 1), L = lcm(b, d);
  const top = a * (L / b) + c * (L / d);
  return num(frac(top, L), [
    St(`The bottoms are different (${b} and ${d}), so the parts are different sizes. We need a common denominator.`, fractionBars([{ n: a, d: b }, { n: c, d }])),
    St(`The smallest number that both ${b} and ${d} go into is ${L}.`),
    St(`${a}/${b} = ${a * L / b}/${L} (× ${L / b} top and bottom) and ${c}/${d} = ${c * L / d}/${L} (× ${L / d} top and bottom).`, fractionBars([{ n: a * L / b, d: L }, { n: c * L / d, d: L }])),
    St(`Now add the tops: ${a * L / b} + ${c * L / d} = ${top}, so the sum is ${top}/${L}${frac(top, L) !== `${top}/${L}` ? `, which simplifies to ${frac(top, L)}` : ''}.`),
  ], { q: `${a}/${b} + ${c}/${d} = ?`, expr: `${a}/${b}+${c}/${d}` });
});
skill('5-fracmult', 5, 'Fractions', 'Multiply fractions', ['Multiply the tops, multiply the bottoms.', 'Then simplify.'], (r) => {
  const a = r.int(1, 6), b = r.int(a + 1, 9), c = r.int(1, 6), d = r.int(c + 1, 9);
  return num(frac(a * c, b * d), [`Tops: ${a} × ${c} = ${a * c}. Bottoms: ${b} × ${d} = ${b * d}.`, `${a * c}/${b * d} = ${frac(a * c, b * d)}.`], { q: `${a}/${b} × ${c}/${d} = ?`, expr: `(${a}*${c})/(${b}*${d})` });
});
skill('5-decadd', 5, 'Decimals', 'Add and subtract decimals', ['Line up the decimal points.', 'Then add or subtract as with whole numbers.'], (r) => {
  const a = r.int(10, 999) / 100, b = r.int(10, 999) / 100, add = r.bool() || a < b;
  const ans = dec(add ? a + b : a - b);
  return num(ans, add ? columnAdd([a.toFixed(2), b.toFixed(2)]) : columnSub(a.toFixed(2), b.toFixed(2)), { q: `${a.toFixed(2)} ${add ? '+' : '−'} ${b.toFixed(2)} = ?`, expr: `${a}${add ? '+' : '-'}${b}` });
});
skill('5-decmult', 5, 'Decimals', 'Multiply decimals', ['Multiply as whole numbers.', 'Count the decimal places in both numbers; the answer has that many.'], (r) => {
  const a = r.int(2, 99) / 10, b = r.int(2, 9);
  const ans = dec(a * b);
  return num(ans, [`${Math.round(a * 10)} × ${b} = ${Math.round(a * 10) * b}.`, `One decimal place: ${ans}.`], { q: `${a} × ${b} = ?`, expr: `${a}*${b}` });
});
skill('5-volume', 5, 'Measurement', 'Volume of a box', GEO45.LESSONS.volume, GEO45.volume5);
skill('5-order', 5, 'Expressions', 'Order of operations', ['Brackets first, then × and ÷, then + and −.', 'Work left to right within each step.'], (r) => {
  const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), form = r.int(0, 2);
  const [q, ans, work] = [
    [`${a} + ${b} × ${c}`, a + b * c, [[`= ${a} + ${b * c}`, '× before +', `There are no brackets. Multiply before adding: ${b} × ${c} = ${b * c}.`], [`= ${a + b * c}`, 'then +', `Then add: ${a} + ${b * c} = ${a + b * c}.`]]],
    [`(${a} + ${b}) × ${c}`, (a + b) * c, [[`= ${a + b} × ${c}`, 'brackets first', `Brackets come first: ${a} + ${b} = ${a + b}.`], [`= ${(a + b) * c}`, 'then ×', `Then multiply: ${a + b} × ${c} = ${(a + b) * c}.`]]],
    [`${a * c} ÷ ${c} + ${b}`, a + b, [[`= ${a} + ${b}`, '÷ before +', `There are no brackets. Divide before adding: ${a * c} ÷ ${c} = ${a}.`], [`= ${a + b}`, 'then +', `Then add: ${a} + ${b} = ${a + b}.`]]],
  ][form];
  const lines = [{ eq: q }, ...work.map(([eq, note]) => ({ eq, note }))];
  const steps = work.map(([, , text], k) => St(text, eqnLines(lines.slice(0, k + 2))));
  return num(ans, [St('Order of operations: brackets first, then × and ÷, then + and −.', eqnLines(lines.slice(0, 1))), ...steps, St(`So ${q} = ${ans}.`)], { q: `${q} = ?`, expr: q.replace(/×/g, '*').replace(/÷/g, '/') });
});
skill('5-pow10', 5, 'Decimals', 'Multiply and divide by powers of 10', ['× 10 moves digits one place left; × 100 two places.', '÷ 10 moves digits one place right.'], (r) => {
  const x = r.int(11, 999) / 10, p = r.pick([10, 100, 1000]), mul = r.bool();
  const ans = dec(mul ? x * p : x / p);
  return num(ans, [`${mul ? '×' : '÷'} ${p}: move ${String(p).length - 1} place${p > 10 ? 's' : ''} ${mul ? 'left' : 'right'}.`, `${ans}.`], { q: `${x} ${mul ? '×' : '÷'} ${p} = ?`, expr: `${x}${mul ? '*' : '/'}${p}` });
});
skill('5-coord', 5, 'Geometry', 'Points on a grid', ['A point is written (x, y).', 'x: go across. y: go up.'], (r) => {
  const x = r.int(0, 8), y = r.int(0, 8);
  const p = (a, b) => `(${a}, ${b})`;
  return mc(r, p(x, y), [p(y, x), p(x + 1, y), p(x, Math.max(0, y - 1))].filter((s) => s !== p(x, y)), { q: 'What are the coordinates of the point?', visual: { type: 'coord', x, y }, steps: [`Across ${x}, up ${y}.`, `${p(x, y)}.`] });
});

// ───────────── Grade 6 ─────────────
skill('6-ratio', 6, 'Ratios', 'Simplify ratios', ['A ratio compares two amounts.', 'Divide both parts by their greatest common factor.'], (r) => {
  const g = r.int(2, 9), a = r.int(1, 9), b = r.int(1, 9); const [x, y] = simplify(a, b);
  return { kind: 'text', answer: `${x}:${y}`, accept: [`${x} : ${y}`, `${x} to ${y}`], q: `Simplify the ratio ${a * g}:${b * g}.`, steps: [`GCF of ${a * g} and ${b * g} is ${gcd(a * g, b * g)}.`, `${x}:${y}.`] };
});
skill('6-unitrate', 6, 'Ratios', 'Unit rates', ['A unit rate is "per one".', 'Divide the total by the number of units.'], (r) => {
  const per = r.int(2, 15), n = r.int(2, 12), [w, u] = r.pick([['dollars', 'notebooks'], ['kilometres', 'hours'], ['pages', 'days']]);
  return num(per, [`${per * n} ÷ ${n} = ${per}.`, `${per} ${w} per ${u.replace(/s$/, '')}.`], { q: `${per * n} ${w} for ${n} ${u}. How many ${w} per ${u.replace(/s$/, '')}?`, expr: `${per * n}/${n}` });
});
skill('6-percent', 6, 'Ratios', 'Percent of a number', ['Percent means "out of 100".', '25% of 80 = 0.25 × 80 = 20.'], (r) => {
  const p = r.pick([10, 20, 25, 30, 40, 50, 60, 75, 5, 15]), n = r.int(1, 40) * 20;
  return num(dec(p * n / 100), [`${p}% = ${p}/100 = ${p / 100}.`, `${p / 100} × ${n} = ${dec(p * n / 100)}.`], { q: `What is ${p}% of ${n}?`, expr: `${p}*${n}/100` });
});
skill('6-gcflcm', 6, 'Number sense', 'GCF and LCM', ['GCF: the biggest number that divides both.', 'LCM: the smallest number both divide into.'], (r) => {
  const g = r.int(2, 8), a = g * r.int(2, 7), b = g * r.int(2, 7); const askG = r.bool() || a === b;
  return num(askG ? gcd(a, b) : lcm(a, b), askG ? [`Factors of ${a} and ${b}: the greatest shared one is ${gcd(a, b)}.`] : [`Multiples of ${Math.max(a, b)}: the first that ${Math.min(a, b)} divides is ${lcm(a, b)}.`], { q: `What is the ${askG ? 'greatest common factor' : 'least common multiple'} of ${a} and ${b}?` });
});
skill('6-exp', 6, 'Expressions', 'Exponents', ['An exponent says how many times to multiply the base by itself.', '2³ = 2 × 2 × 2 = 8.'], (r) => {
  const b = r.int(2, 10), e = b <= 5 ? r.int(2, 4) : 2;
  return num(b ** e, [`${Array(e).fill(b).join(' × ')} = ${b ** e}.`], { q: `${b}^${e} = ?`, say: `What is ${b} to the power of ${e}?`, sup: [b, e], expr: `${b}**${e}` });
});
skill('6-fracdiv', 6, 'Fractions', 'Divide fractions', ['Keep, change, flip: keep the first, change ÷ to ×, flip the second.', '1/2 ÷ 1/4 = 1/2 × 4/1 = 2.'], (r) => {
  const a = r.int(1, 5), b = r.int(a + 1, 8), c = r.int(1, 5), d = r.int(c + 1, 8);
  return num(frac(a * d, b * c), [`${a}/${b} × ${d}/${c}.`, `= ${a * d}/${b * c} = ${frac(a * d, b * c)}.`], { q: `${a}/${b} ÷ ${c}/${d} = ?`, expr: `(${a}/${b})/(${c}/${d})` });
});
skill('6-onestep', 6, 'Equations', 'One-step equations', ['Do the opposite operation to both sides.', 'x + 5 = 12 → x = 12 − 5 = 7.'], (r) => {
  const x = r.int(1, 20), k = r.int(2, 12), t = r.int(0, 2);
  const [q, undo, note, back, check] = [
    [`x + ${k} = ${x + k}`, `subtract ${k} from both sides`, `− ${k} on both sides`, `x = ${x + k} − ${k}`, `${x} + ${k} = ${x + k}`],
    [`x − ${k} = ${neg(x - k)}`, `add ${k} to both sides`, `+ ${k} on both sides`, `x = ${neg(x - k)} + ${k}`, `${x} − ${k} = ${neg(x - k)}`],
    [`${k}x = ${k * x}`, `divide both sides by ${k}`, `÷ ${k} on both sides`, `x = ${k * x} ÷ ${k}`, `${k} × ${x} = ${k * x}`],
  ][t];
  const L = [{ eq: q }, { eq: back, note }, { eq: `x = ${x}` }];
  return num(x, [St('We want x on its own. Whatever we do to one side, we do to the other, so the two sides stay equal.', eqnLines(L.slice(0, 1))), St(`To undo it, ${undo}.`, eqnLines(L.slice(0, 2))), St(`x = ${x}.`, eqnLines(L)), St(`Check: ${check}. It works, so x = ${x}.`)], { q: `Solve: ${q}`, unit: 'x =' });
});
skill('6-stats', 6, 'Statistics', 'Mean, median and mode', ['Mean: add them all, divide by how many.', 'Median: the middle when in order. Mode: the most common.'], (r) => {
  const which = r.pick(['mean', 'median', 'mode']);
  let xs;
  if (which === 'mean') { const n = r.int(4, 6), m = r.int(5, 20); xs = Array.from({ length: n - 1 }, () => r.int(1, 30)); xs.push(m * n - xs.reduce((a, b) => a + b, 0)); if (xs.at(-1) < 0) xs[xs.length - 1] = m; }
  else if (which === 'median') xs = Array.from({ length: r.pick([5, 7]) }, () => r.int(1, 40));
  else { xs = Array.from({ length: 6 }, () => r.int(1, 15)); const m = r.int(1, 15); xs.push(m, m); xs = r.shuffle(xs); }
  const sorted = [...xs].sort((a, b) => a - b);
  const counts = {}; xs.forEach((x) => (counts[x] = (counts[x] ?? 0) + 1)); const top = Math.max(...Object.values(counts)); const modes = Object.keys(counts).filter((k) => counts[k] === top).map(Number);
  if (which === 'mode' && modes.length > 1) xs.push(modes[0]), counts[modes[0]]++;
  const ans = which === 'mean' ? dec(xs.reduce((a, b) => a + b, 0) / xs.length, 2) : which === 'median' ? sorted[(sorted.length - 1) / 2] : modes[0];
  return num(ans, which === 'mean' ? [`Sum = ${xs.reduce((a, b) => a + b, 0)}.`, `${xs.reduce((a, b) => a + b, 0)} ÷ ${xs.length} = ${ans}.`] : which === 'median' ? [`In order: ${sorted.join(', ')}.`, `The middle is ${ans}.`] : [`${ans} appears most often.`], { q: `Find the ${which} of: ${xs.join(', ')}${which === 'mean' ? ' (round to 2 decimal places if needed)' : ''}` });
});
skill('6-tri', 6, 'Geometry', 'Area of a triangle', GEO6.TRI_LESSON, GEO6.tri6);

// ───────────── Grade 7 ─────────────
skill('7-int', 7, 'Integers', 'Integer operations', ['Adding a negative is subtracting.', 'Same signs multiply to positive; different signs to negative.'], (r) => {
  const a = r.nonzero(-15, 15), b = r.nonzero(-15, 15), op = r.pick(['+', '−', '×']);
  const ans = op === '+' ? a + b : op === '−' ? a - b : a * b;
  const move = op === '−' ? -b : b, lo = Math.min(0, a, ans) - 1, hi = Math.max(0, a, ans) + 1;
  const NL = (o) => numberLine(lo, hi, o);
  const steps = op === '×' ? [St(`Multiply the sizes: ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(ans)}.`), St(`${Math.sign(a) === Math.sign(b) ? 'The signs are the same, so the answer is positive' : 'The signs are different, so the answer is negative'}.`), St(`So ${neg(a)} × ${par(b)} = ${neg(ans)}.`)]
    : [St(`Start at ${neg(a)} on the number line.`, NL({ marks: [a] })), ...(op === '−' ? [St(`Subtracting ${neg(b)} is the same as adding ${neg(-b)}.`)] : []), St(`${move > 0 ? `Adding ${move} moves ${move} to the right` : `Adding ${neg(move)} moves ${-move} to the left`}.`, NL({ marks: [ans], jumps: [{ from: a, to: ans, label: move > 0 ? `+${move}` : `−${-move}` }] })), St(`We land on ${neg(ans)}, so ${neg(a)} ${op} ${par(b)} = ${neg(ans)}.`)];
  return num(ans, steps, { q: `${neg(a)} ${op} ${b < 0 ? `(${neg(b)})` : b} = ?`, expr: `(${a})${op === '−' ? '-' : op === '×' ? '*' : '+'}(${b})` });
});
skill('7-prop', 7, 'Ratios', 'Solve proportions', ['In a proportion, cross products are equal.', '3/4 = x/12 → 4x = 36 → x = 9.'], (r) => {
  const a = r.int(1, 9), b = r.int(2, 12), k = r.int(2, 6);
  const L = [{ eq: `${a}/${b} = x/${b * k}` }, { eq: `${b} × x = ${a} × ${b * k}`, note: 'cross products are equal' }, { eq: `${b}x = ${a * b * k}` }, { eq: `x = ${a * k}`, note: `÷ ${b} on both sides` }];
  return num(a * k, [St(`In a proportion the cross products are equal: ${b} times x equals ${a} times ${b * k}.`, eqnLines(L.slice(0, 2))), St(`${a} × ${b * k} = ${a * b * k}, so ${b}x = ${a * b * k}.`, eqnLines(L.slice(0, 3))), St(`Divide both sides by ${b}: x = ${a * b * k} ÷ ${b} = ${a * k}.`, eqnLines(L)), St(`Another way: ${b} × ${k} = ${b * k}, so the top is ${a} × ${k} = ${a * k}.`)], { q: `Solve for x: ${a}/${b} = x/${b * k}`, unit: 'x =' });
});
skill('7-twostep', 7, 'Equations', 'Two-step equations', ['Undo adding or subtracting first.', 'Then undo multiplying or dividing.'], (r) => {
  const x = r.int(-10, 15), a = r.nonzero(-9, 9) || 2, b = r.int(-20, 20);
  const L = [{ eq: `${neg(a)}x ${sgn(b)} = ${neg(a * x + b)}` }, { eq: `${neg(a)}x = ${neg(a * x)}`, note: b >= 0 ? `− ${b} on both sides` : `+ ${-b} on both sides` }, { eq: `x = ${neg(x)}`, note: `÷ ${neg(a)} on both sides` }];
  return num(x, [
    St(`Two things happen to x: it is multiplied by ${neg(a)}, then ${b >= 0 ? `${b} is added` : `${-b} is subtracted`}. Undo them in reverse order.`, eqnLines(L.slice(0, 1))),
    St(`First undo the ${b >= 0 ? `+ ${b}` : `− ${-b}`}: ${b >= 0 ? `subtract ${b} from` : `add ${-b} to`} both sides. That gives ${neg(a)}x = ${neg(a * x)}.`, eqnLines(L.slice(0, 2))),
    St(`Then undo the × ${neg(a)}: divide both sides by ${neg(a)}. x = ${neg(a * x)} ÷ ${par(a)} = ${neg(x)}.`, eqnLines(L)),
    St(`Check: ${neg(a)} × ${par(x)} ${sgn(b)} = ${neg(a * x + b)}. It works, so x = ${neg(x)}.`),
  ], { q: `Solve: ${neg(a)}x ${sgn(b)} = ${neg(a * x + b)}`, unit: 'x =' });
});
skill('7-pctchange', 7, 'Ratios', 'Percent increase and decrease', ['Change ÷ original × 100.', 'From 50 to 60 is a 10 ÷ 50 = 20% increase.'], (r) => {
  const o = r.int(2, 20) * 10, p = r.pick([10, 20, 25, 30, 40, 50, 75]), up = r.bool();
  const nw = up ? o * (1 + p / 100) : o * (1 - p / 100);
  return num(p, [`Change: ${dec(Math.abs(nw - o))}.`, `${dec(Math.abs(nw - o))} ÷ ${o} × 100 = ${p}%.`], { q: `A price goes from $${o} to $${dec(nw)}. What is the percent ${up ? 'increase' : 'decrease'}?`, unit: '%', expr: `Math.abs(${nw}-${o})/${o}*100` });
});
skill('7-circle', 7, 'Geometry', 'Circles', ['Circumference = 2 × π × r. Area = π × r².', 'Use π ≈ 3.14.'], (r) => {
  const rad = r.int(1, 12), area = r.bool();
  const ans = dec(area ? 3.14 * rad * rad : 2 * 3.14 * rad, 2), pic = (hl) => F.circleFig({ r: `${rad} cm`, hl });
  return num(ans, [St(`The radius is ${rad} cm.`, pic('radius')), St(area ? `A = 3.14 × ${rad}² = 3.14 × ${rad * rad} = ${ans}.` : `C = 2 × 3.14 × ${rad} = ${ans}.`, pic(area ? 'fill' : null)), St(`So the ${area ? 'area' : 'circumference'} is ${ans} ${area ? 'cm²' : 'cm'}.`)], { q: `Using π ≈ 3.14, what is the ${area ? 'area (cm²)' : 'circumference (cm)'} of this circle?`, visual: pic(), expr: area ? `3.14*${rad}*${rad}` : `2*3.14*${rad}` });
});
skill('7-prob', 7, 'Probability', 'Simple probability', ['Probability = favourable outcomes ÷ all outcomes.', 'Write it as a fraction in simplest form.'], (r) => {
  const red = r.int(1, 8), blue = r.int(1, 8), green = r.int(0, 6), tot = red + blue + green;
  const c = r.pick(['red', 'blue']); const fav = c === 'red' ? red : blue;
  return num(frac(fav, tot), [`${fav} ${c} out of ${tot} marbles.`, `${fav}/${tot} = ${frac(fav, tot)}.`], { q: `A bag has ${red} red, ${blue} blue and ${green} green marbles. What is the probability of picking ${c}? (fraction)`, exactForm: 'fraction', expr: `${fav}/${tot}` });
});
skill('7-ineq', 7, 'Equations', 'One-step inequalities', ['Solve like an equation.', 'If you multiply or divide by a negative, flip the sign.'], (r) => {
  const x = r.int(-8, 12), k = r.int(2, 6), negK = r.bool(0.4);
  const a = negK ? -k : k, rhs = a * x;
  const sign = negK ? '>' : '<';
  const right = `x ${sign} ${neg(x)}`;
  return mc(r, right, [`x ${negK ? '<' : '>'} ${neg(x)}`, `x ${sign} ${neg(rhs)}`, `x ${negK ? '<' : '>'} ${neg(-x)}`], { q: `Solve: ${neg(a)}x < ${neg(rhs)}`, steps: [`Divide both sides by ${neg(a)}.`, negK ? 'Dividing by a negative flips < to >.' : 'The sign stays the same.', right + '.'] });
});

// ───────────── Grade 8 ─────────────
skill('8-explaws', 8, 'Exponents', 'Laws of exponents', ['Multiply same bases: add exponents. Divide: subtract.', 'Power of a power: multiply exponents.'], (r) => {
  const b = r.pick(['x', 'a', '2', '5']), m = r.int(2, 9), n = r.int(2, 6), t = r.int(0, 2);
  const [q, e, s] = [[`${b}^${m} × ${b}^${n}`, m + n, 'add'], [`${b}^${m + n} ÷ ${b}^${n}`, m, 'subtract'], [`(${b}^${m})^${n}`, m * n, 'multiply']][t];
  return num(e, [`Same base: ${s} the exponents.`, `${b}^${e}.`], { q: `${q} = ${b}^?`, say: `Write ${q.replace(/\^/g, ' to the ')} as ${b} to a power. What is the power?` });
});
skill('8-sci', 8, 'Exponents', 'Scientific notation', ['A number between 1 and 10 times a power of 10.', '45 000 = 4.5 × 10⁴.'], (r) => {
  const m = r.int(11, 99) / 10, e = r.int(2, 8);
  const n = Math.round(m * 10 ** e);
  return num(e, [`Move the decimal point until one digit is before it: ${m}.`, `It moved ${e} places: 10^${e}.`], { q: `${n.toLocaleString('en-CA')} = ${m} × 10^?` });
});
skill('8-sqrt', 8, 'Exponents', 'Square roots', ['The square root of n is the number that times itself makes n.', '√49 = 7 because 7 × 7 = 49.'], (r) => {
  const n = r.int(2, 20);
  return num(n, [`${n} × ${n} = ${n * n}.`, `√${n * n} = ${n}.`], { q: `√${n * n} = ?`, say: `What is the square root of ${n * n}?`, expr: `Math.sqrt(${n * n})` });
});
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [12, 16, 20], [20, 21, 29]];
skill('8-pyth', 8, 'Geometry', 'The Pythagorean theorem', ['In a right triangle, a² + b² = c².', 'c is the longest side, across from the right angle.'], (r) => {
  const [a, b, c] = r.pick(TRIPLES), findC = r.bool();
  if (findC) return num(c, [St('The hypotenuse is across from the right angle. a² + b² = c².', GC.rightTriFig(a, b, [`${a}`, `${b}`, 'c'], [{ side: 2 }])), St(`${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}.`), St(`c = √${c * c} = ${c}.`)], { q: 'How long is the hypotenuse c of this right triangle?', visual: GC.rightTriFig(a, b, [`${a}`, `${b}`, 'c']), expr: `Math.hypot(${a},${b})` });
  return num(b, [St(`The hypotenuse is ${c}, so b² = c² − a².`, GC.rightTriFig(a, b, [`${a}`, 'b', `${c}`], [{ side: 1 }])), St(`${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}.`), St(`b = √${b * b} = ${b}.`)], { q: 'How long is the side b of this right triangle?', visual: GC.rightTriFig(a, b, [`${a}`, 'b', `${c}`]), expr: `Math.sqrt(${c}**2-${a}**2)` });
});
skill('8-slope', 8, 'Linear relations', 'Slope from two points', ['Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁).'], (r) => {
  const x1 = r.int(-6, 6), y1 = r.int(-6, 6), run = r.nonzero(-5, 5), m = r.pick([-3, -2, -1, 1, 2, 3, 0.5, -0.5]);
  const x2 = x1 + run * 2, y2 = y1 + m * run * 2;
  return num(dec(m), [`Rise: ${neg(y2)} − ${y1 < 0 ? `(${neg(y1)})` : y1} = ${neg(y2 - y1)}.`, `Run: ${neg(x2)} − ${x1 < 0 ? `(${neg(x1)})` : x1} = ${neg(x2 - x1)}.`, `Slope = ${neg(y2 - y1)} ÷ ${neg(x2 - x1)} = ${neg(m)}.`], { q: `Find the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`, expr: `(${y2}-(${y1}))/(${x2}-(${x1}))` });
});
skill('8-linear', 8, 'Linear relations', 'Evaluate y = mx + b', ['Put the x value in, then multiply and add.'], (r) => {
  const m = r.nonzero(-6, 6), b = r.int(-10, 10), x = r.int(-5, 8);
  const L = [{ eq: `y = ${neg(m)}x ${sgn(b)}` }, { eq: `y = ${neg(m)} × ${par(x)} ${sgn(b)}`, note: `put in x = ${neg(x)}` }, { eq: `y = ${neg(m * x)} ${sgn(b)}`, note: 'multiply first' }, { eq: `y = ${neg(m * x + b)}` }];
  return num(m * x + b, [St(`Put ${neg(x)} in place of x.`, eqnLines(L.slice(0, 2))), St(`Multiply first: ${neg(m)} × ${par(x)} = ${neg(m * x)}.`, eqnLines(L.slice(0, 3))), St(`Then ${b >= 0 ? 'add' : 'subtract'}: ${neg(m * x)} ${sgn(b)} = ${neg(m * x + b)}.`, eqnLines(L)), St(`So y = ${neg(m * x + b)}.`)], { q: `If y = ${neg(m)}x ${sgn(b)}, what is y when x = ${neg(x)}?`, expr: `(${m})*(${x})+(${b})` });
});
skill('8-system', 8, 'Linear relations', 'Systems of equations', ['Add or subtract the equations to remove one letter.', 'Then put that value back in to find the other.'], (r) => {
  const x = r.int(-5, 8), y = r.int(-5, 8), a = r.int(1, 4), b = r.int(1, 4);
  const askX = r.bool();
  const e1 = `${a}x + ${b}y = ${neg(a * x + b * y)}`, e2 = `${a}x − ${b}y = ${neg(a * x - b * y)}`;
  const L = [{ eq: e1 }, { eq: e2 }, { eq: `${2 * a}x = ${neg(2 * a * x)}`, note: 'add the equations: + y and − y cancel' }, { eq: `x = ${neg(x)}`, note: `÷ ${2 * a}` }];
  return num(askX ? x : y, [
    St(`One equation has + ${b}y and the other has − ${b}y. Adding the equations makes the y terms cancel.`, eqnLines(L.slice(0, 2))),
    St(`Add them: ${2 * a}x = ${neg(2 * a * x)}, so x = ${neg(2 * a * x)} ÷ ${2 * a} = ${neg(x)}.`, eqnLines(L)),
    St(`Put x = ${neg(x)} into the first equation: ${a} × ${par(x)} + ${b}y = ${neg(a * x + b * y)}, so ${b}y = ${neg(b * y)} and y = ${neg(y)}.`),
    St(`So x = ${neg(x)} and y = ${neg(y)}. The question asks for ${askX ? `x: ${neg(x)}` : `y: ${neg(y)}`}.`),
  ], { q: `${e1} and ${e2}. What is ${askX ? 'x' : 'y'}?`, unit: `${askX ? 'x' : 'y'} =` });
});
skill('8-cyl', 8, 'Geometry', 'Volume of a cylinder', GEO8.LESSONS.cyl, GEO8.cyl);

// ───────────── Grade 9: Algebra 1 ─────────────
skill('9-multistep', 9, 'Algebra 1', 'Equations with variables on both sides', ['Gather the x terms on one side, numbers on the other.', 'Then divide.'], (r) => {
  const x = r.int(-8, 10), a = r.int(2, 9); let c = r.int(1, 8); if (c === a) c++;
  const b = r.int(-15, 15), d = (a - c) * x + b;
  return num(x, [`Subtract ${c}x: ${a - c}x ${sgn(b)} = ${neg(d)}.`, `Subtract ${neg(b)}: ${a - c}x = ${neg(d - b)}.`, `x = ${neg(x)}.`], { q: `Solve: ${a}x ${sgn(b)} = ${c}x ${sgn(d)}`, unit: 'x =' });
});
skill('9-like', 9, 'Algebra 1', 'Distribute and combine like terms', ['a(b + c) = ab + ac.', 'Then add the x terms together and the numbers together.'], (r) => {
  const a = r.int(2, 6), b = r.int(1, 9), c = r.int(1, 5), d = r.int(-9, 9);
  const xc = a + c, k = a * b + d;
  const show = (m, n) => `${m === 1 ? '' : m}x ${n === 0 ? '' : sgn(n)}`.trim();
  return mc(r, show(xc, k), [show(xc, a + b + d), show(a * c, k), show(xc, a * b - d)], { q: `Simplify: ${a}(x + ${b}) + ${c}x ${sgn(d)}`, steps: [`${a}(x + ${b}) = ${a}x + ${a * b}.`, `${a}x + ${c}x = ${xc}x; ${a * b} ${sgn(d)} = ${k}.`, show(xc, k) + '.'] });
});
skill('9-factor', 9, 'Algebra 1', 'Factor quadratics', ['x² + bx + c = (x + p)(x + q) where p + q = b and p × q = c.'], (r) => {
  const p = r.nonzero(-9, 9), q = r.nonzero(-9, 9);
  const b = p + q, c = p * q;
  const f = (u, v) => `(x ${sgn(u)})(x ${sgn(v)})`;
  return mc(r, f(Math.min(p, q), Math.max(p, q)), [f(-p, -q), f(Math.min(p, q), -Math.max(p, q)), f(p + 1, q - 1)].filter((s) => s !== f(Math.min(p, q), Math.max(p, q)) && s !== f(Math.max(p, q), Math.min(p, q))), { q: `Factor: x² ${b === 0 ? '' : sgn(b) + 'x'} ${sgn(c)}`.replace(/  +/g, ' '), steps: [`Find two numbers that multiply to ${c} and add to ${b}: ${p} and ${q}.`, f(Math.min(p, q), Math.max(p, q)) + '.'] });
});
skill('9-roots', 9, 'Algebra 1', 'Solve quadratics by factoring', ['Factor, then set each bracket to zero.'], (r) => {
  const p = r.int(-9, 9), q = r.int(-9, 9); const lo = Math.min(p, q), hi = Math.max(p, q);
  const b = -(p + q), c = p * q;
  return { kind: 'text', answer: lo === hi ? `${lo}` : `${lo}, ${hi}`, accept: lo === hi ? [] : [`${hi}, ${lo}`, `${lo},${hi}`, `${hi},${lo}`, `${lo} and ${hi}`, `${hi} and ${lo}`], numbers: lo === hi ? [lo] : [lo, hi], q: `Solve: x² ${b === 0 ? '' : sgn(b) + 'x'} ${c === 0 ? '' : sgn(c)} = 0 (give every solution, separated by a comma)`.replace(/  +/g, ' '), steps: [`(x ${sgn(-p)})(x ${sgn(-q)}) = 0.`, `x = ${p} or x = ${q}.`] };
});
skill('9-func', 9, 'Algebra 1', 'Evaluate functions', ['f(3) means put 3 in for x.'], (r) => {
  const a = r.int(1, 4), b = r.int(-6, 6), c = r.int(-9, 9), x = r.int(-4, 5);
  return num(a * x * x + b * x + c, [`f(${x}) = ${a}(${neg(x)})² ${sgn(b)}(${neg(x)}) ${sgn(c)}.`, `= ${a * x * x} ${sgn(b * x)} ${sgn(c)} = ${a * x * x + b * x + c}.`], { q: `f(x) = ${a === 1 ? '' : a}x² ${sgn(b)}x ${sgn(c)}. Find f(${x}).`, expr: `${a}*(${x})**2+(${b})*(${x})+(${c})` });
});
skill('9-intercept', 9, 'Algebra 1', 'Equation of a line', ['y = mx + b: m is the slope, b is where the line crosses the y-axis.', 'Find m, then use a point to find b.'], (r) => {
  const m = r.nonzero(-4, 4), b = r.int(-8, 8), x1 = r.int(-3, 3); const x2 = x1 + r.int(1, 4);
  return num(b, [`Slope m = ${m}.`, `b = y − mx = ${m * x1 + b} − (${m})(${x1}) = ${b}.`], { q: `A line passes through (${x1}, ${m * x1 + b}) and (${x2}, ${m * x2 + b}). What is its y-intercept b?`, unit: 'b =' });
});

// ───────────── Grade 10: Geometry ─────────────
skill('10-polyangle', 10, 'Geometry', 'Angles in polygons', GEO10.LESSONS.polyAngles, GEO10.polyAngles);
skill('10-similar', 10, 'Geometry', 'Similar triangles', ['Similar triangles have sides in the same ratio.', 'Find the scale factor, then multiply.'], (r) => {
  const a = r.int(2, 9), b = r.int(2, 9), k = r.int(2, 5);
  const pic = (show) => GC.similarTris([`${a} cm`, '', `${b} cm`], [`${a * k} cm`, '', show ? `${b * k} cm` : '?'], k);
  return num(b * k, [St(`Matching sides: ${a} cm matches ${a * k} cm, so the scale factor is ${a * k} ÷ ${a} = ${k}.`, pic(false)), St(`${b} × ${k} = ${b * k}.`, pic(true)), St(`So the matching side is ${b * k} cm.`)], { q: 'These two triangles are similar. How long is the side marked ?, in cm?', visual: pic(false), expr: `${b}*${a * k}/${a}` });
});
skill('10-trig', 10, 'Trigonometry', 'Sine, cosine and tangent', ['SOH CAH TOA: sin = opposite ÷ hypotenuse, cos = adjacent ÷ hypotenuse, tan = opposite ÷ adjacent.'], (r) => {
  const ang = r.pick([20, 25, 30, 35, 40, 50, 55, 60]), h = r.int(5, 30), f = r.pick(['sin', 'cos']);
  const rad = ang * Math.PI / 180, v = f === 'sin' ? h * Math.sin(rad) : h * Math.cos(rad), ans = dec(Math.round(v * 10) / 10);
  const A = Math.cos(rad), B = Math.sin(rad);
  const pic = (hl) => GC.rightTriFig(A * 10, B * 10, [f === 'cos' ? 'x' : '', f === 'sin' ? 'x' : '', `${h}`], hl, `${ang}°`);
  return num(ans, [St(`From the ${ang}° angle, the side x is the ${f === 'sin' ? 'opposite' : 'adjacent'} side and ${h} is the hypotenuse, so use ${f === 'sin' ? 'SOH: sin = opposite ÷ hypotenuse' : 'CAH: cos = adjacent ÷ hypotenuse'}.`, pic([{ side: f === 'sin' ? 1 : 0 }, { side: 2 }])), St(`x = ${h} × ${f}(${ang}°) = ${h} × ${dec(f === 'sin' ? Math.sin(rad) : Math.cos(rad), 4)} ≈ ${ans}.`), St(`So x ≈ ${ans}.`)], { q: 'Find the side x in this right triangle, to the nearest tenth.', unit: 'x =', visual: pic(), tol: 0.1001 });
});
skill('10-distance', 10, 'Coordinate geometry', 'Distance and midpoint', ['Distance = √((x₂ − x₁)² + (y₂ − y₁)²).', 'Midpoint = the average of the x values and of the y values.'], (r) => {
  const [a, b, c] = r.pick(TRIPLES.filter((t) => t[0] <= 6 && t[1] <= 8)), x1 = r.int(-4, 1), y1 = r.int(-4, 0), sx = 1, sy = 1;
  const x2 = x1 + sx * a, y2 = y1 + sy * b, R = Math.max(6, Math.abs(x1), Math.abs(x2), Math.abs(y1), Math.abs(y2));
  const plane = { type: 'plane', range: R, points: [[x1, y1, 'A'], [x2, y2, 'B']] };
  if (r.bool()) return num(c, [St(`Make a right triangle under AB: across ${x2} − ${x1 < 0 ? `(${x1})` : x1} = ${a}, up ${y2} − ${y1 < 0 ? `(${y1})` : y1} = ${b}.`, { ...plane, points: [...plane.points, [x2, y1, '']] }), St(`AB is the hypotenuse: √(${a}² + ${b}²) = √${a * a + b * b} = ${c}.`), St(`So the distance is ${c}.`)], { q: `Find the distance between A(${x1}, ${y1}) and B(${x2}, ${y2}).`, visual: plane, expr: `Math.hypot(${x2}-(${x1}),${y2}-(${y1}))` });
  return { kind: 'text', answer: `(${dec((x1 + x2) / 2)}, ${dec((y1 + y2) / 2)})`, numbers: [(x1 + x2) / 2, (y1 + y2) / 2], q: `Find the midpoint of A(${x1}, ${y1}) and B(${x2}, ${y2}). Write it as (x, y).`, visual: plane, steps: [St('The midpoint is halfway along AB: average the x values, then the y values.', plane), St(`x: (${x1} + ${x2}) ÷ 2 = ${dec((x1 + x2) / 2)}.`), St(`y: (${y1} + ${y2}) ÷ 2 = ${dec((y1 + y2) / 2)}.`, { ...plane, points: [...plane.points, [(x1 + x2) / 2, (y1 + y2) / 2, 'M']] })] };
});
skill('10-special', 10, 'Trigonometry', 'Exact trig values', ['sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1.', 'sin 90° = 1, cos 0° = 1.'], (r) => {
  const T = [['sin 30°', '1/2', 30, 'y'], ['cos 60°', '1/2', 60, 'x'], ['tan 45°', '1', 45, 't'], ['sin 90°', '1', 90, 'y'], ['cos 90°', '0', 90, 'x'], ['sin 0°', '0', 0, 'y'], ['cos 0°', '1', 0, 'x']];
  const [q, a, deg, part] = r.pick(T);
  const why = part === 'y' ? `sin is the height (y) of the point at ${deg}° on the unit circle.` : part === 'x' ? `cos is how far across (x) the point at ${deg}° is on the unit circle.` : 'tan = sin ÷ cos; at 45° they are equal, so tan 45° = 1.';
  return num(a, [St(why, GC.unitCircle(deg, `${deg}°`)), St(`${q} = ${a}.`), St(`So ${q} = ${a}.`)], { q: `What is ${q}? (exact value)`, exactForm: 'fraction' });
});

// ───────────── Grade 11: Algebra 2 ─────────────
skill('11-exp', 11, 'Algebra 2', 'Exponential growth', ['y = a × bˣ: a is the start, b is the growth factor.', 'Doubling: b = 2.'], (r) => {
  const a = r.int(1, 10) * 10, b = r.pick([2, 3]), x = r.int(1, 5);
  return num(a * b ** x, [`${a} × ${b}^${x} = ${a} × ${b ** x}.`, `= ${a * b ** x}.`], { q: `A population starts at ${a} and ${b === 2 ? 'doubles' : 'triples'} every year. How large is it after ${x} years?`, expr: `${a}*${b}**${x}` });
});
skill('11-log', 11, 'Algebra 2', 'Logarithms', ['log_b(x) asks: b to what power gives x?', 'log₂ 8 = 3 because 2³ = 8.'], (r) => {
  const b = r.pick([2, 3, 5, 10]), e = r.int(0, b === 2 ? 8 : b === 10 ? 5 : 4);
  return num(e, [`${b}^${e} = ${b ** e}.`, `So log base ${b} of ${b ** e} is ${e}.`], { q: `log base ${b} of ${b ** e} = ?`, expr: `Math.round(Math.log(${b ** e})/Math.log(${b}))` });
});
skill('11-seq', 11, 'Algebra 2', 'Arithmetic and geometric sequences', ['Arithmetic: add the same difference d. aₙ = a₁ + (n − 1)d.', 'Geometric: multiply by the same ratio r. aₙ = a₁ × rⁿ⁻¹.'], (r) => {
  const geo = r.bool(), a = r.int(1, 9), n = r.int(5, geo ? 8 : 20);
  if (geo) { const k = r.pick([2, 3]); return num(a * k ** (n - 1), [`Ratio ${k}.`, `a${n} = ${a} × ${k}^${n - 1} = ${a * k ** (n - 1)}.`], { q: `${a}, ${a * k}, ${a * k * k}, … What is term ${n}?`, expr: `${a}*${k}**(${n}-1)` }); }
  const d = r.nonzero(-6, 9);
  return num(a + (n - 1) * d, [`Difference ${d}.`, `a${n} = ${a} + ${n - 1} × ${neg(d)} = ${a + (n - 1) * d}.`], { q: `${a}, ${a + d}, ${a + 2 * d}, … What is term ${n}?`, expr: `${a}+(${n}-1)*(${d})` });
});
skill('11-discrim', 11, 'Algebra 2', 'The discriminant', ['For ax² + bx + c = 0, the discriminant is b² − 4ac.', 'Positive: 2 real roots. Zero: 1. Negative: none.'], (r) => {
  const a = r.int(1, 4), b = r.int(-8, 8), c = r.int(-6, 6); const D = b * b - 4 * a * c;
  const right = D > 0 ? '2 real roots' : D === 0 ? '1 real root' : 'No real roots';
  return mc(r, right, ['2 real roots', '1 real root', 'No real roots'].filter((x) => x !== right), { q: `How many real roots does ${a === 1 ? '' : a}x² ${sgn(b)}x ${sgn(c)} = 0 have?`, steps: [`b² − 4ac = ${b * b} − ${4 * a * c} = ${D}.`, right + '.'] });
});
skill('11-complex', 11, 'Algebra 2', 'Powers of i', ['i² = −1, i³ = −i, i⁴ = 1, and then the pattern repeats.'], (r) => {
  const n = r.int(2, 60), v = ['1', 'i', '-1', '-i'][n % 4];
  return mc(r, v, ['1', 'i', '-1', '-i'].filter((x) => x !== v), { q: `i^${n} = ?`, steps: [`${n} ÷ 4 leaves ${n % 4}.`, `i^${n % 4} = ${v}.`] });
});

// ───────────── Grade 12: Precalculus and introduction to calculus ─────────────
skill('12-deriv', 12, 'Calculus', 'Derivatives of polynomials', ['The power rule: the derivative of xⁿ is n·xⁿ⁻¹.', 'Then evaluate at the point.'], (r) => {
  const a = r.int(1, 5), n = r.int(2, 4), b = r.int(-6, 6), x = r.int(-3, 3);
  const v = a * n * x ** (n - 1) + b;
  return num(v, [`f'(x) = ${a * n}x^${n - 1} ${sgn(b)}.`, `f'(${x}) = ${a * n}(${x})^${n - 1} ${sgn(b)} = ${v}.`], { q: `f(x) = ${a === 1 ? '' : a}x^${n} ${sgn(b)}x. Find f'(${x}).`, expr: `${a}*${n}*(${x})**(${n}-1)+(${b})` });
});
skill('12-ncr', 12, 'Probability', 'Combinations and permutations', ['Order matters: permutations nPr = n! ÷ (n − r)!.', 'Order does not matter: combinations nCr = n! ÷ (r!(n − r)!).'], (r) => {
  const n = r.int(4, 10), k = r.int(2, Math.min(4, n - 1)), perm = r.bool();
  const f = (m) => (m <= 1 ? 1 : m * f(m - 1));
  const v = perm ? f(n) / f(n - k) : f(n) / (f(k) * f(n - k));
  return num(v, [perm ? `${n}P${k} = ${n}! ÷ ${n - k}!.` : `${n}C${k} = ${n}! ÷ (${k}! × ${n - k}!).`, `= ${v}.`], { q: perm ? `In how many ways can ${k} of ${n} runners finish 1st to ${k === 2 ? '2nd' : k === 3 ? '3rd' : k + 'th'}?` : `How many ways can you choose ${k} books from ${n}?` });
});
skill('12-unit', 12, 'Trigonometry', 'The unit circle', G1112.LESSONS12.unit, G1112.unitCircle);
skill('12-limit', 12, 'Calculus', 'Limits by factoring', ['If you get 0/0, factor and cancel.', '(x² − a²)/(x − a) = x + a, so the limit at a is 2a.'], (r) => {
  const a = r.nonzero(-6, 6);
  return num(2 * a, [`x² − ${a * a} = (x − ${neg(a)})(x + ${neg(a)}).`, `Cancel: x + ${neg(a)}. At x = ${a}: ${2 * a}.`], { q: `Find the limit as x → ${a} of (x² − ${a * a}) ÷ (x ${sgn(-a)}).` });
});

// the skills above, filed under their grade's categories (the names the grade files use)
const RECAT = {
  'k-count10': 'Counting to 10', 'k-count20': 'Counting to 20', 'k-after': 'Counting forward and back to 10', 'k-add5': 'Addition up to 5',
  'k-sub5': 'Subtraction up to 5', 'k-add10': 'Addition up to 10', 'k-compare10': 'Comparing and ordering',
  '1-add20': 'Addition up to 20', '1-missing': 'Addition up to 20', '1-sub20': 'Subtraction up to 20',
  '3-round': 'Estimation and rounding', '3-fracid': 'Understand fractions', '3-fraccmp': 'Compare and order fractions', '3-area': 'Perimeter, area and volume', '3-perim': 'Perimeter, area and volume',
  '4-equivfrac': 'Equivalent fractions', '4-fracadd': 'Fraction word problems', '4-decfrac': 'Fractions and decimals', '4-factors': 'Factors and multiples', '4-angles': 'Lines and angles',
  '5-decadd': 'Add and subtract decimals', '5-decmult': 'Multiply decimals', '5-volume': 'Volume and surface area', '5-pow10': 'Multiply decimals', '5-coord': 'Coordinate plane',
  '6-gcflcm': 'Number theory', '6-tri': 'Perimeter and area',
  '7-circle': 'Perimeter and area', '7-pctchange': 'Percents', '7-ineq': 'Inequalities',
  '8-pyth': 'Pythagorean theorem', '8-cyl': 'Surface area and volume',
  '9-multistep': 'Solve equations', '9-like': 'Variable expressions and equations', '9-factor': 'Polynomials', '9-roots': 'Solve equations', '9-func': 'Relations and functions', '9-intercept': 'Linear functions',
  '10-polyangle': 'Two-dimensional figures', '10-similar': 'Similarity',
  '11-exp': 'Exponential functions', '11-log': 'Exponential functions', '11-seq': 'Sequences and series', '11-discrim': 'Quadratic relations', '11-complex': 'Quadratic relations',
  '12-ncr': 'Probability', '12-unit': 'Trigonometry',   // 12-deriv and 12-limit stay under Calculus, an introduction past the grade 12 list
};
for (const s of S) { const c = RECAT[s.id.slice(5)]; if (c) s.strand = c; }

// more skills, a file for each grade (src/math/more/g0.mjs … g12.mjs), written in the order of the grade's
// categories; a grade's categories follow that file's order (skills above that share a category join it)
import G0 from './more/g0.mjs'; import G1 from './more/g1.mjs'; import G2 from './more/g2.mjs'; import G3 from './more/g3.mjs';
import G4 from './more/g4.mjs'; import G5 from './more/g5.mjs'; import G6 from './more/g6.mjs'; import G7 from './more/g7.mjs';
import G8 from './more/g8.mjs'; import G9 from './more/g9.mjs'; import G10 from './more/g10.mjs'; import G11 from './more/g11.mjs'; import G12 from './more/g12.mjs';
const MORE = [G0, G1, G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G12];
const strandRank = new Map();   // 'grade|strand' → position in the grade file
const keyOf = (s) => s.grade + '|' + s.strand;
MORE.forEach((list) => list.forEach((s) => { if (!strandRank.has(keyOf(s))) strandRank.set(keyOf(s), strandRank.size); }));
S.push(...MORE.flat());
const pos = new Map(S.map((s, i) => [s, i]));
const rank = (s) => strandRank.get(keyOf(s)) ?? 1e6 + pos.get(s);
S.sort((a, b) => a.grade - b.grade || rank(a) - rank(b) || pos.get(a) - pos.get(b));

export const MATH = S;
export default S;
