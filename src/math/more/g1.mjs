// Grade 1 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
const { skill, list } = grade();

// ── small helpers ──
const upto = (a, b, step = 1) => { const o = []; if (step > 0) for (let x = a; x <= b; x += step) o.push(x); else for (let x = a; x >= b; x += step) o.push(x); return o; };
const two = (r) => r.shuffle(NAMES).slice(0, 2);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const art = (w) => (/^[aeiou]/.test(w) ? 'an ' : 'a ') + w;
const tw = (t, o) => `${t} ${t === 1 ? 'ten' : 'tens'} and ${o} ${o === 1 ? 'one' : 'ones'}`;
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENSW = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const words = (n) => (n === 100 ? 'one hundred' : n < 20 ? ONES[n] : TENSW[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''));
const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const sent = (a, op, b) => `${a} ${op} ${b} = ${op === '+' ? a + b : a - b}`;
// a fact "a + b" or "a − b" whose value is v (numbers up to max)
const factFor = (r, v, max, op = r.pick(['+', '−'])) => { if (op === '+') { const a = r.int(0, v); return `${a} + ${v - a}`; } const b = r.int(0, Math.max(0, max - v)); return `${v + b} − ${b}`; };
const NL = (to, o) => numberLine(0, to, o);
const countOn = (a, b, to) => [
  St(`Start at ${a}.`, NL(to, { marks: [a] })),
  St(`Count on ${b}: ${upto(a + 1, a + b).join(', ')}.`, NL(to, { marks: [a + b], jumps: upto(a, a + b - 1).map((x) => ({ from: x, to: x + 1 })) })),
  St(`So ${a} + ${b} = ${a + b}.`),
];
const countBack = (a, b, to) => [
  St(`Start at ${a}.`, NL(to, { marks: [a] })),
  St(`Count back ${b}: ${upto(a - 1, a - b, -1).join(', ')}.`, NL(to, { marks: [a - b], jumps: upto(a, a - b + 1, -1).map((x) => ({ from: x, to: x - 1 })) })),
  St(`So ${a} − ${b} = ${a - b}.`),
];
// word problems: [question, picture object or null]
const ADD_STORY = [
  (N, M, a, b) => [`${N} picks ${a} apples. Then ${N} picks ${b} more. How many apples did ${N} pick in all?`, 'apple'],
  (N, M, a, b) => [`There are ${a} fish in a pond. ${b} more fish swim in. How many fish are in the pond now?`, 'fish'],
  (N, M, a, b) => [`${N} has ${a} red balls and ${b} blue balls. How many balls does ${N} have?`, 'ball'],
  (N, M, a, b) => [`${a} leaves fell in the morning and ${b} leaves fell after lunch. How many leaves fell in all?`, 'leaf'],
  (N, M, a, b) => [`${N} drew ${a} stars and ${M} drew ${b} stars. How many stars did they draw altogether?`, 'star'],
  (N, M, a, b) => [`${N} put ${a} heart stickers on a card, then ${b} more. How many heart stickers are on the card now?`, 'heart'],
  (N, M, a, b) => [`${a} children are on the bus. At the next stop, ${b} more get on. How many children are on the bus now?`, null],
];
const SUB_STORY = [
  (N, M, a, b) => [`${N} had ${a} apples and ate ${b} of them. How many apples are left?`, 'apple'],
  (N, M, a, b) => [`There were ${a} fish in a pond. ${b} of them swam away. How many fish are still in the pond?`, 'fish'],
  (N, M, a, b) => [`${a} leaves were on a branch. The wind blew ${b} of them off. How many leaves are still on the branch?`, 'leaf'],
  (N, M, a, b) => [`${N} had ${a} star stickers and gave ${b} of them to ${M}. How many star stickers does ${N} have now?`, 'star'],
  (N, M, a, b) => [`There were ${a} balls in a bin. The class took ${b} of them out to play. How many balls are still in the bin?`, 'ball'],
  (N, M, a, b) => [`${N} blew up ${a} balloons. ${b} of them popped. How many balloons did not pop?`, null],
];
const addWrongs = (a, b) => [sent(a, '+', b + 1), sent(a + 1, '+', b), b > 0 ? sent(a, '+', b - 1) : sent(a + 2, '+', b)];
const subWrongs = (a, b) => [sent(a, '+', b), sent(a + 1, '−', b), a - b - 1 >= 0 ? sent(a, '−', b + 1) : sent(a + 2, '−', b)];

// ───── Counting and numbers ─────
skill('1-count-objects', 1, 'Counting and numbers', 'Count objects', ['Touch each thing once as you count.', 'Count rows of 5, full ten frames of 10, and tall blocks as tens.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(8, 20), o = r.pick(OBJ), rows = Math.floor(n / 5);
    return num(n, [`Each full row has 5. Count the full rows by fives: ${upto(5, rows * 5, 5).join(', ')}.`, n % 5 ? `Count on the last ${n % 5}: there are ${n}.` : `So there are ${n}.`], { q: `How many ${plural(o, 2)} are there?`, visual: { type: 'objects', n, obj: o }, expr: `${rows * 5}+${n % 5}` });
  }
  if (v === 1) {
    const n = r.int(11, 20);
    return num(n, ['The first ten frame is full: that is 10.', `10 and ${n - 10} more is ${n}.`], { q: 'How many dots are on the ten frames?', visual: { type: 'tenframes', n }, expr: `10+${n - 10}` });
  }
  if (v === 2) {
    const t = r.int(2, 9), o = r.int(0, 9), n = t * 10 + o;
    return num(n, [`Count the tall blocks by tens: ${upto(10, t * 10, 10).join(', ')}.`, o ? `Count on ${o} small cubes: there are ${n} cubes.` : `There are no small cubes, so there are ${n} cubes.`], { q: 'Each tall block is 10 cubes. How many cubes are there?', visual: { type: 'blocks', tens: t, ones: o }, expr: `${t}*10+${o}` });
  }
  let n = r.int(11, 38); if (n % 10 === 5) n += 1;
  const o = r.pick(OBJ), near10 = Math.round(n / 10) * 10, other = n % 10 < 5 ? near10 + 10 : near10 - 10;
  return mc(r, near10, [10, 20, 30, 40].filter((x) => x !== near10), { q: `About how many ${plural(o, 2)} are there? Choose the nearest ten.`, visual: { type: 'objects', n, obj: o }, steps: [`Count them: there are ${n}.`, `${n} is closer to ${near10} than to ${other}.`, `So there are about ${near10}.`] });
});
skill('1-count-on', 1, 'Counting and numbers', 'Count forward and back', ['Counting forward, each number is 1 more. Counting back, each number is 1 less.', 'On a hundred chart, one step right is 1 more and one step down is 10 more.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const s = r.int(1, 96);
    return num(s + 3, ['Each number is 1 more than the one before.', `One more than ${s + 2} is ${s + 3}.`], { q: `Count forward. What number comes next? ${s}, ${s + 1}, ${s + 2}, ___`, expr: `${s + 2}+1` });
  }
  if (v === 1) {
    const s = r.int(5, 100);
    return num(s - 3, ['Each number is 1 less than the one before.', `One less than ${s - 2} is ${s - 3}.`], { q: `Count back. What number comes next? ${s}, ${s - 1}, ${s - 2}, ___`, expr: `${s - 2}-1` });
  }
  if (v === 2) {
    const base = r.pick([0, 10, 20, 30, 40, 50, 60]), p = base + 2 * r.int(0, 19) + 1;
    return num(p, ['Only every second number has a label.', `The dot is one step after ${p - 1}, so it is at ${p}.`], { q: 'What number is at the red dot?', visual: numberLine(base, base + 40, { marks: [p] }), expr: `${p - 1}+1` });
  }
  const c = r.int(1, 8) * 10 + r.int(2, 9);
  let i = r.int(0, 2), j = r.int(0, 2); if (i === 1 && j === 1) j = r.pick([0, 2]);
  const rows = [[c - 11, c - 10, c - 9], [c - 1, c, c + 1], [c + 9, c + 10, c + 11]].map((row) => row.map(String));
  const val = c + (i - 1) * 10 + (j - 1); rows[i][j] = '?';
  return num(val, ['Moving right adds 1. Moving down adds 10.', `The middle number is ${c}.`, `So the missing number is ${val}.`], { q: 'This is part of a hundred chart. What number goes in the ? box?', visual: { type: 'table', rows }, expr: `${c}+(${(i - 1) * 10})+(${j - 1})` });
});
skill('1-number-words', 1, 'Counting and numbers', 'Number words and order words', ['We can write numbers in words: 47 is forty-seven.', 'Order words tell the place: first, second, third, fourth, fifth …'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const n = r.int(21, 99), t = Math.floor(n / 10), o = n % 10;
    return num(n, [`"${cap(TENSW[t])}" means ${t} tens: ${t * 10}.${o ? ` "${cap(ONES[o])}" is ${o} more.` : ''}`, `So ${words(n)} is ${n}.`], { q: `Write this as a number: ${words(n)}`, expr: `${t * 10}+${o}` });
  }
  if (v === 1) {
    const t = r.int(2, 9); let o = r.int(1, 9); if (o === t) o = (o % 9) + 1;
    const n = t * 10 + o, wr = [n + 1, n - 1, o >= 2 ? o * 10 + t : n - 10].map(words);
    return mc(r, words(n), wr, { q: `How do you write ${n} in words?`, steps: [`${n} is ${tw(t, o)}: ${TENSW[t]} and ${ONES[o]}.`, `So ${n} is ${words(n)}.`] });
  }
  if (v === 2) {
    const names = r.shuffle(NAMES).slice(0, 6), k = r.int(1, 6);
    return mc(r, names[k - 1], names.filter((x, idx) => idx !== k - 1).slice(0, 3), { q: `Six children stand in a line. From the front, they are: ${names.join(', ')}. Who is ${ORD[k - 1]} in line?`, steps: [`Count from the front: ${names.slice(0, k).map((x, idx) => `${ORD[idx]} ${x}`).join(', ')}.`, `${names[k - 1]} is ${ORD[k - 1]}.`] });
  }
  const k = r.int(2, 10), N = r.pick(NAMES);
  return num(k - 1, [`${N} is ${ORD[k - 1]}, so ${k - 1} ${k - 1 === 1 ? 'child is' : 'children are'} before ${N}.`, `${k} − 1 = ${k - 1}. So ${k - 1} ${k - 1 === 1 ? 'child is' : 'children are'} in front.`], { q: `${N} is ${ORD[k - 1]} in line. How many children are in front of ${N}?`, expr: `${k}-1` });
});

// ───── Skip-counting ─────
skill('1-skip-count', 1, 'Skip-counting', 'Skip-count by 2s, 5s and 10s', ['Skip-counting jumps by the same amount each time.', 'By 2s: 2, 4, 6, 8. By 5s: 5, 10, 15. By 10s: 10, 20, 30.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const step = r.pick([2, 5, 10]), k0 = r.int(0, Math.floor(100 / step) - 4), seq = upto(k0 * step, (k0 + 3) * step, step), ans = (k0 + 4) * step;
    return num(ans, [`Each number is ${step} more than the one before.`, `${seq[3]} + ${step} = ${ans}. So the next number is ${ans}.`], { q: `Skip-count by ${step}s. What comes next? ${seq.join(', ')}, ___`, expr: `${seq[3]}+${step}` });
  }
  if (v === 1) {
    const step = r.pick([2, 5, 10]), k0 = r.int(0, Math.floor(100 / step) - 4), seq = upto(k0 * step, (k0 + 4) * step, step), m = r.int(1, 3), ans = seq[m];
    const shown = seq.map((x, i) => (i === m ? '___' : x));
    return num(ans, [`The numbers go up by ${step} each time.`, `${seq[m - 1]} + ${step} = ${ans}. So the missing number is ${ans}.`], { q: `Skip-count by ${step}s. What number is missing? ${shown.join(', ')}`, expr: `${seq[m - 1]}+${step}` });
  }
  const step = r.pick([1, 2, 5, 10]), top = r.int(4, Math.floor(100 / step)) * step, seq = upto(top, top - 3 * step, -step), ans = top - 4 * step;
  return num(ans, [`Each number is ${step} less than the one before.`, `${seq[3]} − ${step} = ${ans}. So the next number is ${ans}.`], { q: `Count back by ${step}s. What comes next? ${seq.join(', ')}, ___`, expr: `${seq[3]}-${step}` });
});
const GROUPS = [['bike', 'bikes', 'wheels', 2], ['hand', 'hands', 'fingers', 5], ['box', 'boxes', 'crayons', 10], ['pair of socks', 'pairs of socks', 'socks', 2], ['starfish', 'starfish', 'arms', 5], ['bag', 'bags', 'apples', 10]];
skill('1-skip-groups', 1, 'Skip-counting', 'Count equal groups', ['When every group has the same number, skip-count by that number.', 'Socks come in pairs, so count them by 2s.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const [one, many, things, per] = r.pick(GROUPS), k = r.int(3, 6);
    const rows = upto(1, k - 1).map((i) => [i, i * per]).concat([[k, '?']]);
    return num(k * per, [`Count by ${per}s: ${upto(per, k * per, per).join(', ')}.`, `So ${k} ${many} have ${k * per} ${things}.`], { q: `Each ${one} has ${per} ${things}. How many ${things} do ${k} ${many} have?`, visual: { type: 'table', head: [cap(many), cap(things)], rows }, expr: `${k}*${per}` });
  }
  if (v === 1) {
    const per = r.pick([2, 5, 10]), rows = r.int(2, per === 10 ? 6 : 8);
    return num(rows * per, [`Each row has ${per} dots.`, `Count by ${per}s: ${upto(per, rows * per, per).join(', ')}. There are ${rows * per} dots.`], { q: `Count by ${per}s. How many dots are there?`, visual: { type: 'array', rows, cols: per }, expr: `${rows}*${per}` });
  }
  const per = r.pick([5, 10]), k = r.int(3, 9), N = r.pick(NAMES);
  return num(k * per, [`Count by ${per}s, once for each pack: ${upto(per, k * per, per).join(', ')}.`, `So ${N} has ${k * per} stickers.`], { q: `${N} has ${k} packs of stickers. Each pack has ${per} stickers. How many stickers does ${N} have?`, expr: `${k}*${per}` });
});

// ───── Even and odd ─────
skill('1-even-odd', 1, 'Even and odd', 'Even and odd numbers', ['An even number can be split into pairs with none left over.', 'Even numbers end in 0, 2, 4, 6 or 8. Odd numbers end in 1, 3, 5, 7 or 9.'], (r) => {
  const v = r.int(0, 3);
  const eo = (n) => (n % 2 ? 'odd' : 'even');
  if (v === 0) {
    const n = r.int(2, 20), o = r.pick(OBJ), p = Math.floor(n / 2);
    return mc(r, eo(n), ['even', 'odd'], { q: `Is the number of ${plural(o, 2)} even or odd?`, visual: { type: 'objects', n, obj: o }, steps: [`There are ${n}. Make pairs: ${p} pairs${n % 2 ? ' and 1 left over' : ' with none left over'}.`, `So ${n} is ${eo(n)}.`] });
  }
  if (v === 1) {
    const n = r.int(1, 100);
    return mc(r, eo(n), ['even', 'odd'], { q: `Is ${n} even or odd?`, steps: [`Look at the ones digit: ${n % 10}.`, `${n % 10} is ${eo(n % 10)}, so ${n} is ${eo(n)}.`] });
  }
  if (v === 2) {
    const kind = r.pick(['even', 'odd']), after = r.bool(), n = r.int(3, 97);
    const want = kind === 'even' ? 0 : 1; let ans = after ? n + 1 : n - 1; if (ans % 2 !== want) ans += after ? 1 : -1;
    return num(ans, [`${cap(kind)} numbers end in ${kind === 'even' ? '0, 2, 4, 6 or 8' : '1, 3, 5, 7 or 9'}.`, `The closest ${kind} number ${after ? 'after' : 'before'} ${n} is ${ans}.`], { q: `Which ${kind} number comes just ${after ? 'after' : 'before'} ${n}?`, expr: `${n}${after ? '+' : '-'}${Math.abs(ans - n)}` });
  }
  const kind = r.pick(['even', 'odd']), want = kind === 'even' ? 0 : 1;
  const pickP = (p) => { let x = r.int(1, 50); if (x % 2 !== p) x += 1; return x; };
  const right = pickP(want), wr = new Set(); while (wr.size < 3) wr.add(pickP(1 - want));
  return mc(r, right, [...wr], { q: `Which number is ${kind}?`, steps: [`${cap(kind)} numbers end in ${kind === 'even' ? '0, 2, 4, 6 or 8' : '1, 3, 5, 7 or 9'}.`, `${right} ends in ${right % 10}, so ${right} is ${kind}.`] });
});

// ───── Understand addition ─────
skill('1-add-models', 1, 'Understand addition', 'Addition with pictures', ['Adding puts two groups together.', 'We write it as an addition sentence: 3 + 4 = 7.'], (r) => {
  const a = r.int(1, 8), b = r.int(1, 10 - a), s = a + b, o = r.pick(OBJ), v = r.int(0, 3);
  if (v === 0) return num(s, [`There are ${a} in the first group and ${b} in the second.`, `${a} + ${b} = ${s}. There are ${s} in all.`], { q: `How many ${plural(o, 2)} are there in all?`, visual: { type: 'groups', groups: [a, b], obj: o, plus: true }, expr: `${a}+${b}` });
  if (v === 1) return mc(r, sent(a, '+', b), addWrongs(a, b), { q: 'Which addition sentence matches the picture?', visual: { type: 'groups', groups: [a, b], obj: o, plus: true }, steps: [`The groups have ${a} and ${b}.`, `Together: ${sent(a, '+', b)}.`] });
  if (v === 2) return mc(r, sent(a, '+', b), [sent(a, '+', b + 1), sent(a + 1, '+', b), sent(s, '+', b)], { q: 'Which addition sentence does the number line show?', visual: NL(10, { marks: [a], jumps: [{ from: a, to: s, label: `+${b}` }] }), steps: [`The jump starts at ${a} and moves ${b} to the right.`, `It lands on ${s}: ${sent(a, '+', b)}.`] });
  const [N] = two(r), [c1, c2] = r.shuffle(['red', 'blue', 'green', 'yellow']);
  return mc(r, sent(a, '+', b), [sent(a, '+', a), sent(b, '+', b), sent(a, '+', b + 1)], { q: `${N} has ${a} ${c1} ${a === 1 ? 'block' : 'blocks'} and ${b} ${c2} ${b === 1 ? 'block' : 'blocks'}. Which addition sentence tells how many blocks ${N} has in all?`, steps: [`Put the ${a} ${c1} with the ${b} ${c2}.`, `${sent(a, '+', b)}.`] });
});

// ───── Addition strategies up to 10 ─────
skill('1-add-strat10', 1, 'Addition strategies up to 10', 'Count on and make ten', ['You can add in any order: 2 + 5 is the same as 5 + 2.', 'Start with the bigger number and count on.', 'Learn the pairs that make 10.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(1, 8); let b = r.int(1, 10 - a); if (b === a) b = a === 1 ? 2 : a - 1;
    return num(a, ['You can add in any order and get the same total.', `${a} + ${b} = ${a + b} and ${b} + ${a} = ${a + b}.`, `So the missing number is ${a}.`], { q: `${a} + ${b} = ${b} + ?`, expr: `${a}+${b}-${b}` });
  }
  if (v === 1) {
    const big = r.int(4, 9), small = r.int(1, Math.min(3, 10 - big)), swap = r.bool();
    return num(big + small, countOn(big, small, 10), { q: `Count on to add: ${swap ? small : big} + ${swap ? big : small} = ?`, expr: `${big}+${small}` });
  }
  const a = r.int(1, 9);
  if (v === 2) return num(10 - a, ['Count the empty boxes in the ten frame.', `There are ${10 - a} empty boxes. So ${a} + ${10 - a} = 10.`], { q: `${a} + ? = 10`, visual: { type: 'tenframes', n: a }, expr: `10-${a}` });
  return num(10 - a, [`Pairs that make 10: 1 and 9, 2 and 8, 3 and 7, 4 and 6, 5 and 5.`, `${10 - a} + ${a} = 10. The missing number is ${10 - a}.`], { q: `? + ${a} = 10`, expr: `10-${a}` });
});

// ───── Addition up to 10 ─────
skill('1-add-facts10', 1, 'Addition up to 10', 'Addition facts to 10', ['Know your facts to 10 by heart.', 'A number can be split into two parts in different ways: 7 = 3 + 4 = 5 + 2.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const a = r.int(0, 10), b = r.int(0, 10 - a); return num(a + b, [b ? `Start at ${a} and count on ${b}.` : 'Adding 0 changes nothing.', `${a} + ${b} = ${a + b}.`], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` }); }
  const t = r.int(4, 10), a = r.int(1, t - 1);
  if (v === 1) {
    const wr = [t - 1, t + 1, t + 2].map((x) => { const p = r.int(1, x - 1); return `${p} + ${x - p}`; });
    return mc(r, `${a} + ${t - a}`, wr, { q: `Which is a way to make ${t}?`, steps: ['Add each pair and look for the total.', `${a} + ${t - a} = ${t}.`] });
  }
  if (v === 2) return num(t - a, [`Count up from ${a} to ${t}.`, `That is ${t - a}. So ${a} + ${t - a} = ${t}.`], { q: `${a} + ? = ${t}`, expr: `${t}-${a}` });
  return num(t - a, [`${t} is split into ${a} and another part.`, `${a} + ${t - a} = ${t}, so the other part is ${t - a}.`], { q: `${t} = ${a} + ?`, expr: `${t}-${a}` });
});

// ───── Addition word problems up to 10 ─────
skill('1-add-word10', 1, 'Addition word problems up to 10', 'Addition stories to 10', ['Words like "in all", "more" and "altogether" tell us to add.', 'Write an addition sentence, then find the total.'], (r) => {
  const a = r.int(2, 8), b = r.int(2, Math.max(2, 10 - a)), [N, M] = two(r), [q, o] = r.pick(ADD_STORY)(N, M, a, b), v = r.int(0, 2);
  if (v === 2) return mc(r, sent(a, '+', b), [sent(a + b, '−', b), sent(a, '+', b + 1), sent(a, '+', a + b)], { q: `${q} Which addition sentence solves it?`, steps: [`Put ${a} and ${b} together.`, `${sent(a, '+', b)}.`] });
  return num(a + b, [`Put the two groups together: ${a} + ${b}.`, `${a} + ${b} = ${a + b}. The answer is ${a + b}.`], { q, expr: `${a}+${b}`, ...(v === 0 && o ? { visual: { type: 'groups', groups: [a, b], obj: o, plus: true } } : {}) });
});

// ───── Understand subtraction ─────
skill('1-sub-models', 1, 'Understand subtraction', 'Subtraction with pictures', ['Subtracting takes some away. What is left is the difference.', 'Taking away 0 changes nothing. Taking away all leaves 0.'], (r) => {
  const a = r.int(2, 10), b = r.int(1, a - 1), v = r.int(0, 3);
  if (v === 0) return num(a - b, [`There are ${a} circles. ${b} are crossed out.`, `${a} − ${b} = ${a - b}. ${a - b} are left.`], { q: 'Some circles are crossed out. How many circles are left?', visual: { type: 'takeaway', n: a, gone: b }, expr: `${a}-${b}` });
  if (v === 1) return mc(r, sent(a, '−', b), subWrongs(a, b), { q: 'Which subtraction sentence matches the picture?', visual: { type: 'takeaway', n: a, gone: b }, steps: [`There are ${a} circles and ${b} are crossed out.`, `${sent(a, '−', b)}.`] });
  if (v === 2) return mc(r, sent(a, '−', b), subWrongs(a, b), { q: 'Which subtraction sentence does the number line show?', visual: NL(10, { marks: [a], jumps: [{ from: a, to: a - b, label: `−${b}` }] }), steps: [`The jump starts at ${a} and moves ${b} to the left.`, `It lands on ${a - b}: ${sent(a, '−', b)}.`] });
  const all = r.bool();
  return num(all ? 0 : a, [all ? 'Taking away all of them leaves nothing.' : 'Taking away 0 takes nothing away.', `${a} − ${all ? a : 0} = ${all ? 0 : a}.`], { q: `${a} − ${all ? a : 0} = ?`, expr: `${a}-${all ? a : 0}` });
});

// ───── Subtraction strategies up to 10 ─────
skill('1-sub-strat10', 1, 'Subtraction strategies up to 10', 'Count back, count on, think addition', ['To take away a small number, count back.', 'When the numbers are close, count on from the smaller one.', 'Addition helps: 9 − 4 = ? is the same as 4 + ? = 9.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const a = r.int(4, 10), b = r.int(1, 3); return num(a - b, countBack(a, b, 10), { q: `Count back to subtract: ${a} − ${b} = ?`, expr: `${a}-${b}` }); }
  if (v === 1) {
    const b = r.int(3, 8), d = r.int(1, Math.min(3, 10 - b)), a = b + d;
    return num(d, [`Start at ${b} and count up to ${a}: ${upto(b + 1, a).join(', ')}.`, `That is ${d} ${d === 1 ? 'count' : 'counts'}. So ${a} − ${b} = ${d}.`], { q: `Count on to subtract: ${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  const x = r.int(1, 8), y = r.int(1, 10 - x), s = x + y;
  if (v === 2) return num(x, [`${x} + ${y} = ${s}, so taking ${y} away from ${s} leaves ${x}.`, `${s} − ${y} = ${x}.`], { q: `${x} + ${y} = ${s}. So ${s} − ${y} = ?`, expr: `${s}-${y}` });
  return num(x, [`Think: ${y} + ? = ${s}.`, `${y} + ${x} = ${s}. So ${s} − ${y} = ${x}.`], { q: `${s} − ${y} = ?  Think: ${y} + ? = ${s}`, expr: `${s}-${y}` });
});

// ───── Subtraction up to 10 ─────
skill('1-sub-facts10', 1, 'Subtraction up to 10', 'Subtraction facts to 10', ['Know your take-away facts to 10.', 'There are many ways to make the same difference: 5 − 2 = 3 and 7 − 4 = 3.'], (r) => {
  const a = r.int(1, 10), b = r.int(0, a), c = a - b, v = r.int(0, 3);
  if (v === 0) return num(c, [b ? `Start at ${a} and take away ${b}.` : 'Taking away 0 changes nothing.', `${a} − ${b} = ${c}.`], { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
  if (v === 1) return num(b, [`From ${a}, how many must go to leave ${c}?`, `${a} − ${b} = ${c}, so the missing number is ${b}.`], { q: `${a} − ? = ${c}`, expr: `${a}-${c}` });
  if (v === 2) return num(a, [`Think: the start take away ${b} leaves ${c}. Add them back: ${c} + ${b}.`, `${c} + ${b} = ${a}. So ${a} − ${b} = ${c}.`], { q: `? − ${b} = ${c}`, expr: `${c}+${b}` });
  const t = r.int(1, 7), x = r.int(t + 1, 10);
  const wr = [t - 1, t + 1, t + 2].filter((y) => y >= 0).map((y) => { const p = r.int(y + 1, 10); return `${p} − ${p - y}`; });
  return mc(r, `${x} − ${x - t}`, wr, { q: `Which subtraction has a difference of ${t}?`, steps: ['Work out each subtraction.', `${x} − ${x - t} = ${t}.`] });
});

// ───── Subtraction word problems up to 10 ─────
skill('1-sub-word10', 1, 'Subtraction word problems up to 10', 'Subtraction stories to 10', ['Words like "left", "away" and "ate" often tell us to subtract.', 'Start with the whole group and take away the part that goes.'], (r) => {
  const a = r.int(3, 10), b = r.int(1, a - 1), [N, M] = two(r), [q, o] = r.pick(SUB_STORY)(N, M, a, b), v = r.int(0, 2);
  if (v === 2) return mc(r, sent(a, '−', b), subWrongs(a, b), { q: `${q} Which subtraction sentence solves it?`, steps: [`Start with ${a} and take away ${b}.`, `${sent(a, '−', b)}.`] });
  return num(a - b, [`Start with ${a}. Take away ${b}.`, `${a} − ${b} = ${a - b}. The answer is ${a - b}.`], { q, expr: `${a}-${b}`, ...(v === 0 && o ? { visual: { type: 'takeaway', n: a, gone: b } } : {}) });
});

// ───── Addition and subtraction up to 10 ─────
skill('1-fact-family', 1, 'Addition and subtraction up to 10', 'Fact families to 10', ['A fact family uses the same three numbers: 3 + 5 = 8, 5 + 3 = 8, 8 − 5 = 3, 8 − 3 = 5.', 'If you know one fact, you know them all.'], (r) => {
  let x = r.int(1, 8), y = r.int(1, 10 - x); if (x === y) y = y > 1 ? y - 1 : y + 1;
  const s = x + y, v = r.int(0, 3);
  if (v === 0) return mc(r, sent(s, '−', y), [sent(s, '+', y), sent(s, '−', y + 1), sent(s + 1, '−', y)], { q: `The picture shows ${x} + ${y} = ${s}. Which subtraction fact uses the same numbers?`, visual: { type: 'groups', groups: [x, y], obj: r.pick(OBJ) }, steps: [`The numbers are ${x}, ${y} and ${s}.`, `Take ${y} away from the whole: ${sent(s, '−', y)}.`] });
  if (v === 1) {
    const out = r.pick([sent(x, '+', s), sent(s, '−', x + 1), sent(y, '+', y)]);
    return mc(r, out, [sent(y, '+', x), sent(s, '−', x), sent(s, '−', y)], { q: `Which fact is NOT in the fact family for ${x}, ${y} and ${s}?`, steps: [`The family is ${sent(x, '+', y)}, ${sent(y, '+', x)}, ${sent(s, '−', x)} and ${sent(s, '−', y)}.`, `${out} does not belong.`] });
  }
  if (v === 2) {
    const add = r.bool(); const a = add ? r.int(0, 10) : r.int(1, 10), b = add ? r.int(0, 10 - a) : r.int(0, a), ans = add ? a + b : a - b;
    return num(ans, [add ? `Start at ${a} and count on ${b}.` : `Start at ${a} and take away ${b}.`, `${a} ${add ? '+' : '−'} ${b} = ${ans}.`], { q: `${a} ${add ? '+' : '−'} ${b} = ?`, expr: `${a}${add ? '+' : '-'}${b}` });
  }
  const t = r.int(1, 8), right = factFor(r, t, 10), wr = [t - 1, t + 1, t + 2].filter((u) => u >= 0).map((u) => factFor(r, u, 10));
  return mc(r, right, wr, { q: `Which fact has an answer of ${t}?`, steps: ['Work out each fact.', `${right} = ${t}.`] });
});

// ───── Addition and subtraction word problems up to 10 / 20 ─────
function unknownStory(r, lo, hi) {
  const [N, M] = two(r), c = r.int(lo, hi), a = r.int(2, c - 2), b = c - a, v = r.int(0, 4);
  if (v === 0) return num(b, [`${N} started with ${a} and ended with ${c}. Think: ${a} + ? = ${c}.`, `${c} − ${a} = ${b}. So ${M} gave ${b} marbles.`], { q: `${N} had ${a} marbles. ${M} gave ${N} some more. Now ${N} has ${c} marbles. How many marbles did ${M} give?`, expr: `${c}-${a}` });
  if (v === 1) return num(c, [`Put back the ${b} crayons that ${N} gave away: ${a} + ${b}.`, `${a} + ${b} = ${c}. ${N} had ${c} crayons at first.`], { q: `${N} had some crayons. ${N} gave ${b} of them to ${M}. Now ${N} has ${a} crayons left. How many crayons did ${N} have at first?`, expr: `${a}+${b}` });
  if (v === 2) return num(b, [`The blocks are red or blue: ${a} + ? = ${c}.`, `${c} − ${a} = ${b}. So ${b} blocks are blue.`], { q: `${N} has ${c} blocks. ${a} are red and the rest are blue. How many blue blocks does ${N} have?`, expr: `${c}-${a}` });
  if (v === 3) return num(b, [`${c} birds became ${a} birds. Think: ${c} − ? = ${a}.`, `${c} − ${a} = ${b}. So ${b} birds flew away.`], { q: `There were ${c} birds on a fence. Some flew away. Now there are ${a} birds on the fence. How many birds flew away?`, expr: `${c}-${a}` });
  return num(a, [`Take away the ${b} new shells: ${c} − ${b}.`, `${c} − ${b} = ${a}. ${N} had ${a} shells at the start.`], { q: `${N} had some shells. ${N} found ${b} more at the beach. Now ${N} has ${c} shells. How many shells did ${N} have at the start?`, expr: `${c}-${b}` });
}
skill('1-word-unknown10', 1, 'Addition and subtraction word problems up to 10', 'Find the missing number in a story', ['Read the story and find what is missing: the start, the change or the end.', 'Write a sentence with a box for the missing number, then solve it.'], (r) => unknownStory(r, 4, 10));

// ───── Addition strategies up to 20 ─────
skill('1-add-doubles', 1, 'Addition strategies up to 20', 'Doubles and near doubles', ['A double adds a number to itself: 6 + 6 = 12.', 'Near doubles: 6 + 7 is double 6 plus 1 more. 6 + 5 is double 6 minus 1.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const d = r.int(1, 10); return num(2 * d, ['Both numbers are the same, so this is a double.', `${d} + ${d} = ${2 * d}.`], { q: `${d} + ${d} = ?`, expr: `${d}+${d}` }); }
  if (v === 1) {
    const d = r.int(2, 9), sw = r.bool();
    return num(2 * d + 1, [`${d + 1} is 1 more than ${d}.`, `Double: ${d} + ${d} = ${2 * d}.`, `One more: ${2 * d} + 1 = ${2 * d + 1}.`], { q: `Use doubles plus one: ${sw ? d + 1 : d} + ${sw ? d : d + 1} = ?`, expr: `${d}+${d + 1}` });
  }
  if (v === 2) {
    const d = r.int(2, 10), sw = r.bool();
    return num(2 * d - 1, [`${d - 1} is 1 less than ${d}.`, `Double: ${d} + ${d} = ${2 * d}.`, `One less: ${2 * d} − 1 = ${2 * d - 1}.`], { q: `Use doubles minus one: ${sw ? d - 1 : d} + ${sw ? d : d - 1} = ?`, expr: `${d}+${d - 1}` });
  }
  const d = r.int(1, 6), c = r.int(1, Math.min(9, 20 - 2 * d)), nums = r.shuffle([d, d, c]), s = 2 * d + c;
  return num(s, [`Find the double: ${d} + ${d} = ${2 * d}.`, `Then add ${c}: ${2 * d} + ${c} = ${s}.`], { q: `${nums.join(' + ')} = ?`, expr: nums.join('+') });
});
skill('1-add-make10', 1, 'Addition strategies up to 20', 'Make ten to add', ['Fill a ten first, then add what is left.', 'For 8 + 5: 8 + 2 = 10, and 3 more makes 13.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(7, 9), b = r.int(11 - a, 9), rest = a + b - 10;
    return num(rest, [`${a} needs ${10 - a} more to make 10.`, `Take ${10 - a} from ${b}: ${b} − ${10 - a} = ${rest} is left.`, `So ${a} + ${b} = 10 + ${rest}.`], { q: `${a} + ${b} = 10 + ?`, expr: `${a}+${b}-10` });
  }
  if (v === 1) {
    const a = r.int(6, 9), b = r.int(11 - a, 9), rest = a + b - 10;
    return num(a + b, [`Fill the first ten frame: ${a} + ${10 - a} = 10.`, `${b} − ${10 - a} = ${rest} more go in the second frame.`, `10 + ${rest} = ${a + b}.`], { q: `There are ${a} dots. Add ${b} more dots. How many dots are there now?`, visual: { type: 'tenframes', n: a }, expr: `${a}+${b}` });
  }
  if (v === 2) {
    const p = r.int(1, 9), q = 10 - p, c = r.int(1, 9), nums = r.shuffle([p, q, c]);
    return num(10 + c, [`Look for two numbers that make 10: ${p} + ${q} = 10.`, `Then 10 + ${c} = ${10 + c}.`], { q: `${nums.join(' + ')} = ?`, expr: nums.join('+') });
  }
  const a = r.int(5, 15), b = r.int(2, Math.min(5, 20 - a));
  return num(a + b, countOn(a, b, 20), { q: `Start at ${a} on the number line and jump forward ${b}. Where do you land? ${a} + ${b} = ?`, expr: `${a}+${b}` });
});

// ───── Addition up to 20 ─────
const addTip = (a, n) => (n === 0 ? 'Adding 0 changes nothing.'
  : n === 1 ? 'Adding 1 gives the next number.'
  : n === 10 ? `Adding 10 adds one ten: ${a} + 10 = ${a + 10}.`
  : n === 9 ? `Adding 9 is like adding 10 and taking 1 away: ${a} + 10 = ${a + 10}, then ${a + 10} − 1 = ${a + 9}.`
  : a < 10 && a + n > 10 ? `Make a ten: ${a} + ${10 - a} = 10, then ${n - (10 - a)} more.`
  : `Start at ${a} and count on ${n}.`);
skill('1-add-n', 1, 'Addition up to 20', 'Adding 0 to 10', ['Each number you add has a trick: + 0 changes nothing, + 10 adds a ten, + 9 is + 10 then − 1.', 'Turning a sum around gives the same answer.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) { const n = r.int(0, 10), a = r.int(0, Math.min(10, 20 - n)); return num(a + n, [addTip(a, n), `So ${a} + ${n} = ${a + n}.`], { q: `${a} + ${n} = ?`, expr: `${a}+${n}` }); }
  if (v === 1) {
    const s = r.int(11, 19), a = r.int(s - 9, 9), right = `${a} + ${s - a}`;
    const wr = [s - 1, s + 1, s + 2].map((x) => { const p = r.int(Math.max(1, x - 10), Math.min(10, x - 1)); return `${p} + ${x - p}`; });
    return mc(r, right, wr, { q: `Which sum is equal to ${s}?`, steps: ['Work out each sum.', `${right} = ${s}.`] });
  }
  const a = r.int(2, 10), b = r.int(2, 10);
  return num(a + b, ['Adding in any order gives the same total.', `${b} + ${a} = ${a + b} too. So the answer is ${a + b}.`], { q: `${a} + ${b} = ${a + b}. What is ${b} + ${a}?`, expr: `${b}+${a}` });
});
skill('1-add-three', 1, 'Addition up to 20', 'Add three numbers', ['Add two of the numbers first, then add the third.', 'Look for a ten or a double to make it easier.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(1, 9), b = r.int(1, 9), c = r.int(1, Math.max(1, Math.min(9, 20 - a - b))), s = a + b + c;
    return num(s, [`Add the first two: ${a} + ${b} = ${a + b}.`, `Then add ${c}: ${a + b} + ${c} = ${s}.`], { q: `${a} + ${b} + ${c} = ?`, expr: `${a}+${b}+${c}` });
  }
  const s = r.int(11, 20), a = r.int(s - 10, 9), b = s - a;
  if (v === 1) return num(b, [`Count up from ${a} to ${s}.`, `${s} − ${a} = ${b}. So ${s} = ${a} + ${b}.`], { q: `${s} = ${a} + ?`, expr: `${s}-${a}` });
  return num(a, [`Think: what adds to ${b} to make ${s}?`, `${s} − ${b} = ${a}. So ${a} + ${b} = ${s}.`], { q: `? + ${b} = ${s}`, expr: `${s}-${b}` });
});

// ───── Addition word problems up to 20 ─────
skill('1-add-word20', 1, 'Addition word problems up to 20', 'Addition stories to 20', ['Find the numbers in the story and add them.', 'If there are three groups, add all three.'], (r) => {
  const v = r.int(0, 2), [N, M] = two(r);
  if (v === 2) {
    const a = r.int(2, 8), b = r.int(2, 8), c = r.int(2, Math.max(2, 20 - a - b)), s = a + b + c;
    return num(s, [`Add the first two: ${a} + ${b} = ${a + b}.`, `Then add ${c}: ${a + b} + ${c} = ${s}.`], { q: `${N} has ${a} red crayons, ${b} blue crayons and ${c} green crayons. How many crayons does ${N} have in all?`, expr: `${a}+${b}+${c}` });
  }
  const a = r.int(3, 10), b = r.int(Math.max(2, 11 - a), 10), [q] = r.pick(ADD_STORY)(N, M, a, b);
  if (v === 1) return mc(r, sent(a, '+', b), [sent(a + b, '−', b), sent(a, '+', b + 1), sent(a, '+', a)], { q: `${q} Which addition sentence solves it?`, steps: [`Put ${a} and ${b} together.`, `${sent(a, '+', b)}.`] });
  return num(a + b, [`Put the two groups together: ${a} + ${b}.`, `${a} + ${b} = ${a + b}. The answer is ${a + b}.`], { q, expr: `${a}+${b}` });
});

// ───── Subtraction strategies up to 20 ─────
skill('1-sub-related', 1, 'Subtraction strategies up to 20', 'Use addition to subtract', ['Addition and subtraction are linked: 8 + 5 = 13, so 13 − 5 = 8.', 'To find 13 − 8, ask "8 plus what makes 13?"'], (r) => {
  const s = r.int(11, 18), a = r.int(s - 9, 9), b = s - a, v = r.int(0, 4);
  if (v === 0) return num(a, [`${s} − ${a} = ${b} uses the numbers ${s}, ${a} and ${b}.`, `Swap the parts: ${s} − ${b} = ${a}.`], { q: `${s} − ${a} = ${b}. So ${s} − ${b} = ?`, expr: `${s}-${b}` });
  if (v === 1) return num(a, [`${a} + ${b} = ${s}, so taking ${b} away from ${s} leaves ${a}.`, `${s} − ${b} = ${a}.`], { q: `${a} + ${b} = ${s}. So ${s} − ${b} = ?`, expr: `${s}-${b}` });
  if (v === 2) return num(a, [`Think: ${b} + ? = ${s}.`, `${b} + ${a} = ${s}. So ${s} − ${b} = ${a}.`], { q: `${s} − ${b} = ?  Think: ${b} + ? = ${s}`, expr: `${s}-${b}` });
  if (v === 3) {
    const c = r.int(12, 20), d = r.int(1, 4), e = c - d;
    return num(d, [`Start at ${e} and count up to ${c}: ${upto(e + 1, c).join(', ')}.`, `That is ${d} ${d === 1 ? 'count' : 'counts'}. So ${c} − ${e} = ${d}.`], { q: `Count on to subtract: ${c} − ${e} = ?`, expr: `${c}-${e}` });
  }
  const c = r.int(8, 20), d = r.int(2, 7);
  return mc(r, sent(c, '−', d), [sent(c, '+', d), sent(c - d, '+', c), sent(c, '−', d + 1)], { q: 'Which subtraction sentence does the number line show?', visual: NL(20, { marks: [c], jumps: [{ from: c, to: c - d, label: `−${d}` }] }), steps: [`The jump starts at ${c} and moves ${d} to the left.`, `It lands on ${c - d}: ${sent(c, '−', d)}.`] });
});
skill('1-sub-ten', 1, 'Subtraction strategies up to 20', 'Use ten to subtract', ['Take away down to 10 first, then take away the rest.', 'For 14 − 6: 14 − 4 = 10, then 10 − 2 = 8.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(11, 18), b = r.int(a - 9, 9), first = a - 10, rest = b - first;
    return num(a - b, [`First take away ${first} to get to 10: ${a} − ${first} = 10.`, `Then take away the other ${rest}: 10 − ${rest} = ${a - b}.`, `So ${a} − ${b} = ${a - b}.`], { q: `Use ten to subtract: ${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  if (v === 1) {
    const a = r.int(11, 20), b = r.int(2, 9);
    return num(a - b, [`There are ${a} dots: a full ten and ${a - 10} more.`, `Take away ${b}: ${a} − ${b} = ${a - b}. There are ${a - b} dots left.`], { q: `There are ${a} dots. Take away ${b}. How many dots are left?`, visual: { type: 'tenframes', n: a }, expr: `${a}-${b}` });
  }
  if (v === 2) { const a = r.int(11, 20), b = r.int(1, 3); return num(a - b, countBack(a, b, 20), { q: `Count back to subtract: ${a} − ${b} = ?`, expr: `${a}-${b}` }); }
  const d = r.int(2, 10);
  return num(d, [`Think of the double: ${d} + ${d} = ${2 * d}.`, `So ${2 * d} − ${d} = ${d}.`], { q: `${2 * d} − ${d} = ?`, expr: `${2 * d}-${d}` });
});

// ───── Subtraction up to 20 ─────
const subTip = (a, n) => (n === 0 ? 'Taking away 0 changes nothing.'
  : n === 1 ? 'Taking away 1 gives the number just before.'
  : n === 10 ? `Taking away 10 takes away one ten: ${a} − 10 = ${a - 10}.`
  : n === 9 && a >= 10 ? `Take away 10, then add 1 back: ${a} − 10 = ${a - 10}, then ${a - 10} + 1 = ${a - 9}.`
  : `Think addition: ${n} + ? = ${a}.`);
skill('1-sub-n', 1, 'Subtraction up to 20', 'Subtracting 0 to 10', ['Each number you take away has a trick: − 0 changes nothing, − 10 takes away a ten, − 9 is − 10 then + 1.', 'You can always check by adding back.'], (r) => {
  const v = r.int(0, 1);
  if (v === 0) { const n = r.int(0, 10), a = r.int(Math.max(n, 10), Math.min(20, n + 10)); return num(a - n, [subTip(a, n), `So ${a} − ${n} = ${a - n}.`], { q: `${a} − ${n} = ?`, expr: `${a}-${n}` }); }
  const t = r.int(2, 9), b = r.int(2, 9), right = `${t + b} − ${b}`;
  const wr = [t - 1, t + 1, t + 2].map((x) => { const y = r.int(2, 9); return `${x + y} − ${y}`; });
  return mc(r, right, wr, { q: `Which subtraction is equal to ${t}?`, steps: ['Work out each subtraction.', `${right} = ${t}.`] });
});
skill('1-sub-make', 1, 'Subtraction up to 20', 'Missing numbers in subtraction', ['A missing number puzzle: use the other two numbers.', 'If ? − 6 = 8, add back: 8 + 6 = 14.'], (r) => {
  const a = r.int(11, 20), b = r.int(2, 9), c = a - b, v = r.int(0, 2);
  if (v === 0) return num(a, [`Add back what was taken: ${c} + ${b}.`, `${c} + ${b} = ${a}. So ${a} − ${b} = ${c}.`], { q: `? − ${b} = ${c}`, expr: `${c}+${b}` });
  if (v === 1) return num(b, [`How far is it from ${c} up to ${a}?`, `${a} − ${c} = ${b}. So the missing number is ${b}.`], { q: `${a} − ? = ${c}`, expr: `${a}-${c}` });
  const t = r.int(3, 10), right = `${t + b} − ${b}`;
  const wr = [t - 1, t + 1, t + 2].map((x) => { const y = r.int(2, 9); return `${x + y} − ${y}`; });
  return mc(r, right, wr, { q: `Which subtraction makes ${t}?`, steps: ['Work out each subtraction.', `${right} = ${t}.`] });
});

// ───── Subtraction word problems up to 20 ─────
skill('1-sub-word20', 1, 'Subtraction word problems up to 20', 'Subtraction stories to 20', ['Take away the part that goes from the whole group.', '"How many more" means find the difference between two groups.'], (r) => {
  const a = r.int(11, 20), b = r.int(2, 9), [N, M] = two(r), v = r.int(0, 2);
  if (v === 0) { const [q] = r.pick(SUB_STORY)(N, M, a, b); return num(a - b, [`Start with ${a}. Take away ${b}.`, `${a} − ${b} = ${a - b}. The answer is ${a - b}.`], { q, expr: `${a}-${b}` }); }
  if (v === 1) return num(a - b, [`Compare: ${N} has ${a} and ${M} has ${b}. Find the difference.`, `${a} − ${b} = ${a - b}. ${N} has ${a - b} more.`], { q: `${N} has ${a} cards. ${M} has ${b} cards. How many more cards does ${N} have than ${M}?`, expr: `${a}-${b}` });
  const [q] = r.pick(SUB_STORY)(N, M, a, b);
  return mc(r, sent(a, '−', b), subWrongs(a, b), { q: `${q} Which subtraction sentence solves it?`, steps: [`Start with ${a} and take away ${b}.`, `${sent(a, '−', b)}.`] });
});

// ───── Addition and subtraction up to 20 ─────
skill('1-addsub20', 1, 'Addition and subtraction up to 20', 'Add and subtract to 20', ['Look at the sign: + means add, − means take away.', 'In 4 + 9 = 13, 4 and 9 are addends and 13 is the sum. In 12 − 5 = 7, 7 is the difference.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const add = r.bool(), a = add ? r.int(2, 10) : r.int(11, 20), b = add ? r.int(2, 10) : r.int(2, 9), ans = add ? a + b : a - b;
    return num(ans, [add ? addTip(a, b) : subTip(a, b), `So ${a} ${add ? '+' : '−'} ${b} = ${ans}.`], { q: `${a} ${add ? '+' : '−'} ${b} = ?`, expr: `${a}${add ? '+' : '-'}${b}` });
  }
  if (v === 1) {
    const t = r.int(6, 15), rights = [factFor(r, t, 20, '+'), factFor(r, t, 20, '−'), factFor(r, t, 20, r.pick(['+', '−']))];
    const bad = factFor(r, t + r.pick([-1, 1, 2]), 20);
    return mc(r, bad, rights, { q: `Which one is NOT a way to make ${t}?`, steps: ['Work out each one.', `${bad} = ${Function(`return ${bad.replace('−', '-')}`)()}, not ${t}.`] });
  }
  const x = r.int(2, 9), y = r.int(2, 9), s = x + y, w = r.int(0, 2);
  if (w === 0) return mc(r, 'sum', ['difference', 'addend'], { q: `In ${x} + ${y} = ${s}, what is ${s} called?`, steps: ['The answer to an addition is the sum.', `${s} is the sum.`] });
  if (w === 1) return mc(r, 'addend', ['sum', 'difference'], { q: `In ${x} + ${y} = ${s}, what is ${x} called?`, steps: ['The numbers we add are the addends.', `${x} is an addend.`] });
  return mc(r, 'difference', ['sum', 'addend'], { q: `In ${s} − ${y} = ${x}, what is ${x} called?`, steps: ['The answer to a subtraction is the difference.', `${x} is the difference.`] });
});

// ───── Addition and subtraction word problems up to 20 ─────
skill('1-word-unknown20', 1, 'Addition and subtraction word problems up to 20', 'Story problems to 20', ['Decide what is missing: the start, the change, a part or the total.', 'Then add or subtract to find it.'], (r) => {
  if (r.bool(0.25)) {
    const [N, M] = two(r), a = r.int(2, 10), b = r.int(2, 10);
    return num(a + b, [`Put both groups together: ${a} + ${b}.`, `${a} + ${b} = ${a + b}. They have ${a + b} shells.`], { q: `${N} found ${a} shells and ${M} found ${b} shells. How many shells did they find altogether?`, expr: `${a}+${b}` });
  }
  return unknownStory(r, 11, 20);
});

// ───── True or false equations ─────
skill('1-true-false', 1, 'True or false equations', 'True or false number sentences', ['A number sentence is true when both sides have the same value.', 'Work out each side, then compare.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const add = r.bool(), a = add ? r.int(1, 10) : r.int(5, 20), b = add ? r.int(1, 10) : r.int(1, Math.min(9, a)), c = add ? a + b : a - b;
    return mc(r, add ? '+' : '−', ['+', '−'], { q: `Which sign makes this true? ${a} ? ${b} = ${c}`, steps: [`${c} is ${add ? 'more' : 'less'} than ${a}, so we ${add ? 'add' : 'take away'}.`, `${a} ${add ? '+' : '−'} ${b} = ${c}.`] });
  }
  if (v === 1) {
    const add = r.bool(), a = add ? r.int(1, 10) : r.int(5, 20), b = add ? r.int(1, 10) : r.int(1, Math.min(9, a)), real = add ? a + b : a - b;
    const ok = r.bool(), shown = ok ? real : real + r.pick(real > 0 ? [-1, 1, 2] : [1, 2]);
    return mc(r, ok ? 'true' : 'false', ['true', 'false'], { q: `True or false? ${a} ${add ? '+' : '−'} ${b} = ${shown}`, steps: [`${a} ${add ? '+' : '−'} ${b} = ${real}.`, ok ? 'Both sides match, so it is true.' : `${real} is not ${shown}, so it is false.`] });
  }
  if (v === 2) {
    const s = r.int(4, 10), a = r.int(1, s - 1), c = r.int(1, s - 1), ok = r.bool(), right = ok ? s : s + r.pick([-1, 1]);
    return mc(r, ok ? 'true' : 'false', ['true', 'false'], { q: `True or false? ${a} + ${s - a} = ${c} + ${right - c}`, steps: [`Left side: ${a} + ${s - a} = ${s}. Right side: ${c} + ${right - c} = ${right}.`, ok ? 'Both sides are the same, so it is true.' : 'The sides are different, so it is false.'] });
  }
  const pick = () => { const add = r.bool(); const a = add ? r.int(0, 5) : r.int(3, 10), b = add ? r.int(0, 5) : r.int(0, a); return [a, add ? '+' : '−', b, add ? a + b : a - b]; };
  const [a, op, b, val] = pick(), right = `${a} ${op} ${b} = ${val}`;
  const wr = [1, 2, 3].map(() => { const [x, o, y, w] = pick(); return `${x} ${o} ${y} = ${w + r.pick([1, 2])}`; });
  return mc(r, right, wr, { q: 'Which number sentence is true?', steps: ['Work out the left side of each one.', `${a} ${op} ${b} = ${val}, so "${right}" is true.`] });
});

// ───── Place value ─────
skill('1-teen', 1, 'Place value', 'Teen numbers on ten frames', ['A teen number is 1 ten and some ones.', '16 is 10 and 6 more: 10 + 6 = 16.'], (r) => {
  const n = r.int(11, 19), o = n - 10, v = r.int(0, 4), vis = { type: 'tenframes', n };
  if (v === 0) return num(o, ['One ten frame is full: 10.', `The other has ${o}. So 10 + ${o} = ${n}.`], { q: `10 + ? = ${n}`, visual: vis, expr: `${n}-10` });
  if (v === 1) return mc(r, `${tw(1, o)}`, [`${tw(o, 1)}`, `${tw(1, o === 9 ? 8 : o + 1)}`, `${o} ones`], { q: 'Which describes the ten frames?', visual: vis, steps: ['One full ten frame is 1 ten.', `The other frame has ${o} ones: ${n} is ${tw(1, o)}.`] });
  if (v === 2) return mc(r, `10 + ${o} = ${n}`, [`10 + ${o + 1} = ${n + 1}`, `${o} + ${o} = ${2 * o}`, `10 + ${o - 1} = ${n - 1}`], { q: 'Which addition sentence matches the ten frames?', visual: vis, steps: [`There are 10 and ${o} more.`, `10 + ${o} = ${n}.`] });
  if (v === 3) return num(o, [`${n} is 10 and some more.`, `${n} − 10 = ${o}. So ${n} = 10 + ${o}.`], { q: `${n} = 10 + ?`, expr: `${n}-10` });
  return num(n, [`Ten and ${ONES[o]} is 10 + ${o}.`, `10 + ${o} = ${n}.`], { q: `Ten and ${ONES[o]} more make what number?`, expr: `10+${o}` });
});
skill('1-tens-models', 1, 'Place value', 'Tens and ones models', ['A tall block is 1 ten. A small cube is 1 one.', 'A ten can be traded for 10 ones: 4 tens 5 ones is the same as 3 tens 15 ones.'], (r) => {
  const t = r.int(2, 9), o = r.int(0, 9), n = t * 10 + o, v = r.int(0, 3);
  if (v === 0) return mc(r, `${tw(t, o)}`, [`${tw(o, t)}`, `${tw(t === 9 ? t - 1 : t + 1, o)}`, `${tw(t, o === 9 ? o - 1 : o + 1)}`], { q: 'How many tens and ones do the blocks show?', visual: { type: 'blocks', tens: t, ones: o }, steps: [`Count the tall blocks: ${t} tens.`, `Count the small cubes: ${o} ones. So it is ${tw(t, o)}.`] });
  if (v === 1) return num(n, [`${t} tens is ${t * 10}.`, `${t * 10} + ${o} = ${n}.`], { q: `${tw(t, o)} = ?`, expr: `${t}*10+${o}` });
  if (v === 2) return mc(r, `${tw(t - 1, o + 10)}`, [`${tw(t - 1, o)}`, `${tw(t, o + 10)}`, `${tw(t + 1, o)}`], { q: `Which is another way to make ${n}?`, steps: [`${n} is ${tw(t, o)}.`, `Trade 1 ten for 10 ones: ${tw(t - 1, o + 10)}.`] });
  return num(o, [`${n} is ${tw(t, o)}.`, `${t * 10} + ${o} = ${n}. The missing number is ${o}.`], { q: `${n} = ${t * 10} + ?`, expr: `${n}-${t * 10}` });
});

// ───── Comparing and ordering ─────
skill('1-compare20', 1, 'Comparing and ordering', 'Compare numbers to 20', ['The number that comes later when you count is greater.', '> means greater than, < means less than.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(1, 10); let b = r.int(1, 10); if (b === a) b = a === 10 ? 9 : a + 1;
    const more = r.bool(), right = (more ? a > b : a < b) ? 'Red group' : 'Blue group';
    return mc(r, right, ['Red group', 'Blue group'], { q: `Which group has ${more ? 'more' : 'fewer'}?`, visual: { type: 'groups', groups: [a, b], obj: r.pick(OBJ) }, steps: [`Red has ${a}. Blue has ${b}.`, `${right} has ${more ? 'more' : 'fewer'}.`] });
  }
  if (v === 1) {
    const [N, M] = two(r), a = r.int(1, 10); let b = r.int(1, 10); if (b === a) b = a === 1 ? 2 : a - 1;
    const more = r.bool(), right = (more ? a > b : a < b) ? N : M;
    return mc(r, right, [N, M], { q: `${N} has ${a} toy cars. ${M} has ${b} toy cars. Who has ${more ? 'more' : 'fewer'} toy cars?`, steps: [`Compare ${a} and ${b}.`, `${right} has ${more ? 'more' : 'fewer'}.`] });
  }
  if (v === 2) {
    const a = r.int(0, 20), b = r.bool(0.15) ? a : r.int(0, 20), sign = a > b ? '>' : a < b ? '<' : '=';
    return mc(r, sign, ['>', '<', '='], { q: `${a} ? ${b}`, say: `Which sign goes between ${a} and ${b}?`, steps: [a === b ? 'Both numbers are the same.' : `${Math.max(a, b)} is greater than ${Math.min(a, b)}.`, `${a} ${sign} ${b}.`] });
  }
  const ns = new Set(); while (ns.size < 4) ns.add(r.int(10, 99));
  const arr = [...ns], big = r.bool(), right = big ? Math.max(...arr) : Math.min(...arr);
  return mc(r, right, arr.filter((x) => x !== right), { q: `Which number is the ${big ? 'greatest' : 'least'}? ${arr.join(', ')}`, steps: ['Compare the tens first, then the ones.', `${right} is the ${big ? 'greatest' : 'least'}.`] });
});
skill('1-order', 1, 'Comparing and ordering', 'Put numbers in order', ['To order numbers, find the least, then the next, and so on.', 'Least to greatest goes up. Greatest to least goes down.'], (r) => {
  const v = r.int(0, 2);
  if (v === 2) {
    const lo = r.int(10, 94), hi = lo + 4, right = r.int(lo + 1, hi - 1);
    return mc(r, right, [lo - 1, hi + 1, hi + 3], { q: `Which number is between ${lo} and ${hi}?`, steps: [`The numbers between are ${upto(lo + 1, hi - 1).join(', ')}.`, `${right} is between ${lo} and ${hi}.`] });
  }
  const max = v === 0 ? 20 : 100, ns = new Set(); while (ns.size < 3) ns.add(r.int(v === 0 ? 0 : 10, max));
  const up = r.bool(), sorted = [...ns].sort((x, y) => (up ? x - y : y - x)), right = sorted.join(', ');
  const perms = [[0, 2, 1], [1, 0, 2], [2, 1, 0], [1, 2, 0], [2, 0, 1]].map((p) => p.map((i) => sorted[i]).join(', '));
  return mc(r, right, r.shuffle(perms).slice(0, 3), { q: `Which list puts the numbers in order from ${up ? 'least to greatest' : 'greatest to least'}?`, steps: [`The ${up ? 'least' : 'greatest'} is ${sorted[0]}, then ${sorted[1]}, then ${sorted[2]}.`, `So the order is ${right}.`] });
});

// ───── Addition and subtraction: multiples of ten ─────
skill('1-tens-more', 1, 'Addition and subtraction: multiples of ten', 'Ten more, ten less', ['Ten more makes the tens digit go up by 1. Ten less makes it go down by 1.', 'To add tens, add the tens digits: 30 + 40 is 3 tens + 4 tens = 7 tens.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const n = r.int(10, 89), more = r.bool(), ans = more ? n + 10 : n - 10;
    return num(ans, [`${n} is ${tw(Math.floor(n / 10), n % 10)}.`, `${more ? 'One more' : 'One less'} ten: ${n} ${more ? '+' : '−'} 10 = ${ans}.`], { q: `What is 10 ${more ? 'more' : 'less'} than ${n}?`, visual: { type: 'blocks', tens: Math.floor(n / 10), ones: n % 10 }, expr: `${n}${more ? '+' : '-'}10` });
  }
  const a = r.int(1, 8), b = r.int(1, 9 - a);
  if (v === 1) return num((a + b) * 10, [`${a * 10} is ${a} tens and ${b * 10} is ${b} tens.`, `${a} tens + ${b} tens = ${a + b} tens, which is ${(a + b) * 10}.`], { q: `${a * 10} + ${b * 10} = ?`, expr: `${a * 10}+${b * 10}` });
  return num(a * 10, [`${(a + b) * 10} is ${a + b} tens and ${b * 10} is ${b} tens.`, `${a + b} tens − ${b} tens = ${a} tens, which is ${a * 10}.`], { q: `${(a + b) * 10} − ${b * 10} = ?`, expr: `${(a + b) * 10}-${b * 10}` });
});

// ───── Addition: two digits ─────
skill('1-add-tens-ones', 1, 'Addition: two digits', 'Add tens to a number', ['Adding a ten changes the tens digit only.', '40 + 7 is 4 tens and 7 ones: 47.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = r.int(1, 9), o = r.int(1, 9);
    return num(t * 10 + o, [`${t * 10} is ${t} tens. ${o} is ${o} ones.`, `${tw(t, o)} is ${t * 10 + o}.`], { q: `${t * 10} + ${o} = ?`, visual: { type: 'blocks', tens: t, ones: o }, expr: `${t * 10}+${o}` });
  }
  const t1 = r.int(1, 7), tb = r.int(1, 8 - t1), ob = r.int(0, 9), b = tb * 10 + ob, a = t1 * 10;
  if (v === 1) return num(a + b, [`Add the tens: ${t1} tens + ${tb} tens = ${t1 + tb} tens.`, `The ones stay ${ob}. So ${a} + ${b} = ${a + b}.`], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
  return num(a + b, [`The blocks show ${b}: ${tw(tb, ob)}.`, `${t1} more tens makes ${tw(t1 + tb, ob)}: ${a + b}.`], { q: `The blocks show a number. Add ${t1} more ${t1 === 1 ? 'ten' : 'tens'}. ${b} + ${a} = ?`, visual: { type: 'blocks', tens: tb, ones: ob }, expr: `${b}+${a}` });
});
skill('1-add-2d1d', 1, 'Addition: two digits', 'Add a one-digit number to a two-digit number', ['Add the ones first.', 'If the ones make 10 or more, trade 10 ones for a new ten.'], (r) => {
  const regroup = r.bool(), ta = r.int(1, 8);
  let oa, b;
  if (regroup) { oa = r.int(2, 9); b = r.int(10 - oa, 9); } else { oa = r.int(0, 8); b = r.int(1, 9 - oa); }
  const a = ta * 10 + oa, s = a + b, model = r.bool(0.4), vis = model ? { visual: { type: 'blocks', tens: ta, ones: oa } } : {};
  const steps = regroup
    ? [`Add the ones: ${oa} + ${b} = ${oa + b}. That is ${tw(1, oa + b - 10)}.`, `The new ten joins the ${ta} tens: ${ta + 1} tens.`, `So ${a} + ${b} = ${s}.`]
    : [`Add the ones: ${oa} + ${b} = ${oa + b}.`, `The tens stay ${ta}. So ${a} + ${b} = ${s}.`];
  return num(s, steps, { q: model ? `The blocks show ${a}. Add ${b} more. ${a} + ${b} = ?` : `${a} + ${b} = ?`, expr: `${a}+${b}`, ...vis });
});

// ───── Subtraction: two digits ─────
skill('1-sub-2d', 1, 'Subtraction: two digits', 'Subtract from a two-digit number', ['Taking away tens changes only the tens digit.', 'Taking away ones changes only the ones digit, when there are enough ones.'], (r) => {
  const ta = r.int(2, 9), oa = r.int(1, 9), a = ta * 10 + oa, v = r.int(0, 2);
  if (v === 0) { const k = r.int(1, ta - 1); return num(a - k * 10, [`Take away ${k} tens: ${ta} tens − ${k} tens = ${ta - k} tens.`, `The ones stay ${oa}. So ${a} − ${k * 10} = ${a - k * 10}.`], { q: `${a} − ${k * 10} = ?`, expr: `${a}-${k * 10}` }); }
  if (v === 1) { const k = r.int(1, ta - 1); return num(a - k * 10, [`Cross out ${k} tall ${k === 1 ? 'block' : 'blocks'}: ${ta - k} tens are left.`, `${tw(ta - k, oa)} is ${a - k * 10}.`], { q: `The blocks show ${a}. Take away ${k} ${k === 1 ? 'ten' : 'tens'}. How many are left?`, visual: { type: 'blocks', tens: ta, ones: oa }, expr: `${a}-${k * 10}` }); }
  const b = r.int(1, oa), model = r.bool();
  return num(a - b, [`Take away the ones: ${oa} − ${b} = ${oa - b}.`, `The tens stay ${ta}. So ${a} − ${b} = ${a - b}.`], { q: `${a} − ${b} = ?`, expr: `${a}-${b}`, ...(model ? { visual: { type: 'blocks', tens: ta, ones: oa } } : {}) });
});

// ───── Addition and subtraction: two digits ─────
skill('1-addsub40', 1, 'Addition and subtraction: two digits', 'Add and subtract to 40', ['Work with tens and ones: add or take away the tens, then the ones.', 'Adding or taking away a multiple of ten changes only the tens.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(10, 29), b = r.int(2, 40 - a), ta = Math.floor(a / 10) * 10, tb = Math.floor(b / 10) * 10, oa = a % 10, ob = b % 10;
    return num(a + b, [`Tens: ${ta} + ${tb} = ${ta + tb}. Ones: ${oa} + ${ob} = ${oa + ob}.`, `${ta + tb} + ${oa + ob} = ${a + b}.`], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
  }
  if (v === 1) {
    const ta = r.int(1, 3), oa = r.int(1, 9), a = ta * 10 + oa, tb = r.int(0, ta - 1), ob = r.int(1, oa), b = tb * 10 + ob;
    return num(a - b, [`Tens: ${ta * 10} − ${tb * 10} = ${(ta - tb) * 10}. Ones: ${oa} − ${ob} = ${oa - ob}.`, `${(ta - tb) * 10} + ${oa - ob} = ${a - b}.`], { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  if (v === 2) {
    const [N, M] = two(r), add = r.bool();
    if (add) { const a = r.int(11, 25), b = r.int(5, 40 - a); return num(a + b, [`Put them together: ${a} + ${b}.`, `${a} + ${b} = ${a + b}. There are ${a + b} books.`], { q: `A class has ${a} books on one shelf and ${b} books on another. How many books are on the two shelves?`, expr: `${a}+${b}` }); }
    const a = r.int(21, 39), b = r.int(1, a % 10 || 1) + 10 * r.int(0, 1);
    return num(a - b, [`Start with ${a} and take away ${b}.`, `${a} − ${b} = ${a - b}. ${N} has ${a - b} beads left.`], { q: `${N} has ${a} beads. ${N} gives ${b} beads to ${M}. How many beads does ${N} have left?`, expr: `${a}-${b}` });
  }
  const n = r.int(11, 89), add = r.bool(), maxK = add ? Math.floor((99 - n) / 10) : Math.floor(n / 10);
  const k = r.int(1, Math.max(1, maxK)), ans = add ? n + k * 10 : n - k * 10;
  return num(ans, [`${add ? 'Add' : 'Take away'} ${k} ${k === 1 ? 'ten' : 'tens'}; the ones stay ${n % 10}.`, `${n} ${add ? '+' : '−'} ${k * 10} = ${ans}.`], { q: `${n} ${add ? '+' : '−'} ${k * 10} = ?`, expr: `${n}${add ? '+' : '-'}${k * 10}` });
});

// ───── Measurement ─────
const LONGER = [['a bus', 'a car'], ['a pencil', 'a paper clip'], ['a snake', 'a worm'], ['a skipping rope', 'a shoelace'], ['a hockey stick', 'a spoon'], ['a train', 'a bike']];
const TALLER = [['a giraffe', 'a dog'], ['a tree', 'a flower'], ['a house', 'a doghouse'], ['a grown-up', 'a baby'], ['a lamp post', 'a fire hydrant']];
const HEAVIER = [['a watermelon', 'a grape'], ['a bike', 'a feather'], ['an elephant', 'a cat'], ['a bag of potatoes', 'a pencil'], ['a chair', 'a sock']];
const HOLDS = [['a bathtub', 'a cup'], ['a bucket', 'a spoon'], ['a swimming pool', 'a bowl'], ['a watering can', 'a juice box']];
const COVERS = [['a placemat', 'a stamp'], ['a bed sheet', 'a napkin'], ['a rug', 'a book cover']];
const MEASURE = [['how long a table is', 'length'], ['how tall a plant is', 'length'], ['how heavy a backpack is', 'mass'], ['how heavy a pumpkin is', 'mass'], ['how much water a bucket holds', 'capacity'], ['how much milk a jug holds', 'capacity']];
skill('1-compare-size', 1, 'Measurement', 'Compare length, mass and capacity', ['Length tells how long or tall. Mass tells how heavy. Capacity tells how much a container holds.', 'Compare two things by asking which has more.'], (r) => {
  const v = r.int(0, 5);
  const ask = (list, big, small) => { const [x, y] = r.pick(list), wantBig = r.bool(), right = wantBig ? x : y; return mc(r, right, [x, y], { q: `Which ${wantBig ? big : small}: ${r.bool() ? `${x} or ${y}` : `${y} or ${x}`}?`, steps: [`Think about the real size of ${x} and ${y}.`, `${cap(right)} ${wantBig ? big : small}.`] }); };
  if (v === 0) return ask(LONGER, 'is longer', 'is shorter');
  if (v === 1) return ask(TALLER, 'is taller', 'is shorter');
  if (v === 2) return ask(HEAVIER, 'is heavier', 'is lighter');
  if (v === 3) return r.bool() ? ask(HOLDS, 'holds more', 'holds less') : ask(COVERS, 'covers more', 'covers less');
  if (v === 4) {
    const [a, b, c] = r.shuffle(['red', 'blue', 'green', 'yellow']).slice(0, 3), most = r.bool();
    return mc(r, most ? a : c, [a, b, c], { q: `The ${a} ribbon is longer than the ${b} ribbon. The ${b} ribbon is longer than the ${c} ribbon. Which ribbon is the ${most ? 'longest' : 'shortest'}?`, steps: [`From longest to shortest: ${a}, ${b}, ${c}.`, `The ${most ? a : c} ribbon is the ${most ? 'longest' : 'shortest'}.`] });
  }
  const [task, right] = r.pick(MEASURE), N = r.pick(NAMES);
  return mc(r, right, ['length', 'mass', 'capacity'], { q: `${N} wants to find out ${task}. What should ${N} measure?`, steps: ['Length: how long or tall. Mass: how heavy. Capacity: how much it holds.', `To find ${task}, measure ${right}.`] });
});
const THINGS = ['pencil', 'crayon', 'ribbon', 'leaf', 'feather', 'key', 'straw'];
skill('1-measure-length', 1, 'Measurement', 'Measure length', ['Line up the end of the object with the start of the ruler or the first cube.', 'Count the units with no gaps and no overlaps.'], (r) => {
  const v = r.int(0, 3), thing = r.pick(THINGS);
  if (v === 0) {
    const s = r.bool() ? 0 : r.int(1, 4), len = r.int(2, 15 - s), e = s + len;
    return num(len, s ? [`It starts at ${s} cm and ends at ${e} cm.`, `${e} − ${s} = ${len}. It is ${len} cm long.`] : ['It starts at 0.', `It ends at ${e}, so it is ${len} cm long.`], { q: `${cap(art(thing))} lies along a centimetre ruler, from one red dot to the other. How long is the ${thing}, in centimetres?`, visual: NL(15, { marks: [s, e] }), expr: `${e}-${s}` });
  }
  if (v === 1) {
    const n = r.int(3, 12);
    return num(n, [`Count the cubes: ${upto(1, n).join(', ')}.`, `The ${thing} is ${n} cubes long.`], { q: `${cap(art(thing))} is as long as this train of cubes. How many cubes long is the ${thing}?`, visual: { type: 'grid', rows: 1, cols: n } });
  }
  if (v === 2) {
    const n = r.int(3, 9);
    return num(n, [`Count the cubes from the bottom to the top: ${upto(1, n).join(', ')}.`, `The plant is ${n} cubes tall.`], { q: 'A plant is as tall as this tower of cubes. How many cubes tall is the plant?', visual: { type: 'grid', rows: n, cols: 1 } });
  }
  const [t1, t2] = r.shuffle(THINGS).slice(0, 2), a = r.int(5, 15), b = r.int(2, a - 1);
  return num(a - b, [`Compare: ${a} cubes and ${b} cubes.`, `${a} − ${b} = ${a - b}. The ${t1} is ${a - b} cubes longer.`], { q: `${cap(art(t1))} is ${a} cubes long. ${cap(art(t2))} is ${b} cubes long. How many cubes longer is the ${t1}?`, expr: `${a}-${b}` });
});
const LEN_UNIT = [['a crayon', 'centimetres'], ['a classroom', 'metres'], ['a book', 'centimetres'], ['a school hallway', 'metres'], ['an ant', 'centimetres'], ['a soccer field', 'metres'], ['a spoon', 'centimetres'], ['a swimming pool', 'metres']];
const MASS_UNIT = [['a paper clip', 'grams'], ['a bag of potatoes', 'kilograms'], ['a pencil', 'grams'], ['a dog', 'kilograms'], ['a feather', 'grams'], ['a grown-up', 'kilograms'], ['a strawberry', 'grams'], ['a bike', 'kilograms']];
skill('1-metric', 1, 'Measurement', 'Metric units and temperature', ['Centimetres (cm) measure small lengths; metres (m) measure big ones.', 'Grams (g) are for light things; kilograms (kg) are for heavy things.', 'A thermometer shows temperature in degrees Celsius (°C).'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const [x, u] = r.pick(LEN_UNIT); return mc(r, u, ['centimetres', 'metres'], { q: `Which unit would you use to measure the length of ${x}?`, steps: ['Use centimetres for small things and metres for big things.', `${cap(x)} is ${u === 'metres' ? 'big' : 'small'}, so use ${u}.`] }); }
  if (v === 1) { const [x, u] = r.pick(MASS_UNIT); return mc(r, u, ['grams', 'kilograms'], { q: `Which unit would you use to measure the mass of ${x}?`, steps: ['Use grams for light things and kilograms for heavy things.', `${cap(x)} is ${u === 'kilograms' ? 'heavy' : 'light'}, so use ${u}.`] }); }
  if (v === 2) {
    const N = r.pick(NAMES), add = r.bool(), a = r.int(6, 20), b = r.int(2, add ? 15 : a - 2);
    return add
      ? num(a + b, [`Put the two lengths together: ${a} cm + ${b} cm.`, `${a} + ${b} = ${a + b}. Together they are ${a + b} cm long.`], { q: `${N} has a ribbon ${a} cm long and another ribbon ${b} cm long. How long are they laid end to end, in centimetres?`, expr: `${a}+${b}` })
      : num(a - b, [`Take the piece away: ${a} cm − ${b} cm.`, `${a} − ${b} = ${a - b}. The string is now ${a - b} cm long.`], { q: `${N} has a string ${a} cm long. ${N} cuts off ${b} cm. How long is the string now, in centimetres?`, expr: `${a}-${b}` });
  }
  const t = r.int(0, 40);
  return num(t, ['The labels go up by 2 degrees.', t % 2 ? `The dot is one mark past ${t - 1}, so it shows ${t} °C.` : `The dot is on ${t}, so it shows ${t} °C.`], { q: 'This thermometer is lying on its side. What temperature does the red dot show, in °C?', visual: numberLine(0, 40, { marks: [t] }), expr: `${t}` });
});

// ───── Area ─────
skill('1-area', 1, 'Area', 'Cover shapes with squares', ['Area is how many squares cover a shape, with no gaps and no overlaps.', 'Count the squares row by row.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const rows = r.int(2, 4), cols = r.int(2, 5);
    return num(rows * cols, [`There are ${rows} rows of ${cols} squares.`, `Count by rows: ${upto(cols, rows * cols, cols).join(', ')}. That is ${rows * cols} squares.`], { q: 'How many squares cover this rectangle?', visual: { type: 'grid', rows, cols }, expr: `${rows}*${cols}` });
  }
  if (v === 1) {
    const w = r.int(3, 6), h = r.int(3, 6), w2 = r.int(1, w - 1), h1 = r.int(1, h - 1), A = w * h1 + w2 * (h - h1);
    return num(A, [`The bottom part has ${h1} ${h1 === 1 ? 'row' : 'rows'} of ${w}: ${w * h1} squares.`, `The top part has ${h - h1} ${h - h1 === 1 ? 'row' : 'rows'} of ${w2}: ${w2 * (h - h1)} ${w2 * (h - h1) === 1 ? 'square' : 'squares'}.`, `${w * h1} + ${w2 * (h - h1)} = ${A} squares.`], { q: 'Each small square is 1 unit. How many squares are inside the shape?', visual: { type: 'poly', points: [[0, 0], [w, 0], [w, h1], [w2, h1], [w2, h], [0, h]], grid: true }, expr: `${w}*${h1}+${w2}*${h - h1}` });
  }
  const opts = [[1, 4], [2, 3], [2, 4], [3, 3], [2, 5], [3, 4], [2, 6], [4, 4], [3, 5]], [R, C] = r.pick(opts), A = R * C;
  const wr = r.shuffle(opts.filter(([x, y]) => x * y !== A)).slice(0, 3).map(([x, y]) => `${x} ${x === 1 ? 'row' : 'rows'} of ${y} squares`);
  return mc(r, `${R} ${R === 1 ? 'row' : 'rows'} of ${C} squares`, wr, { q: `Which rectangle has an area of ${A} squares?`, steps: ['Count the squares in each one: rows times squares in a row.', `${R} ${R === 1 ? 'row' : 'rows'} of ${C} is ${A} squares.`] });
});

// ───── Time ─────
const tstr = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const nextH = (h) => (h % 12) + 1;
const EVENTS = [['eats breakfast', 7, 0, 'a.m.', 'eat breakfast'], ['goes to bed', 8, 0, 'p.m.', 'go to bed'], ['eats supper', 6, 0, 'p.m.', 'eat supper'], ['has morning recess', 10, 30, 'a.m.', 'have morning recess'], ['eats lunch', 12, 30, 'p.m.', 'eat lunch'], ['wakes up', 6, 30, 'a.m.', 'wake up'], ['walks to school', 8, 30, 'a.m.', 'walk to school'], ['plays at the park after school', 4, 0, 'p.m.', 'play at the park after school']];
skill('1-clock-read', 1, 'Time', 'Read clocks and a.m. or p.m.', ['A digital clock shows hours, then minutes: 3:30 is half past 3.', 'a.m. is from midnight to noon. p.m. is from noon to midnight.'], (r) => {
  const v = r.int(0, 3), h = r.int(1, 12), m = r.pick([0, 30]);
  if (v === 0) return mc(r, tstr(h, m), [tstr(nextH(h), m), tstr(h, m ? 0 : 30), m ? tstr(nextH(h), 0) : tstr(((h + 10) % 12) + 1, 0)], { q: 'Which digital time matches the clock?', visual: { type: 'clock', h, m }, steps: [`The short hand shows the hour: ${h}.`, m ? `The long hand is on 6: 30 minutes. It is ${tstr(h, m)}.` : `The long hand is on 12: 00 minutes. It is ${tstr(h, m)}.`] });
  if (v === 1) {
    const say = (hh, mm) => (mm ? `half past ${hh}` : `${hh} o'clock`);
    return mc(r, say(h, m), [say(nextH(h), m), say(h, m ? 0 : 30), say(((h + 10) % 12) + 1, m)], { q: `Which words tell the time ${tstr(h, m)}?`, steps: [m ? '30 minutes past the hour is half past.' : ':00 means o\'clock.', `${tstr(h, m)} is ${say(h, m)}.`] });
  }
  const [what, eh, em, ap, base] = r.pick(EVENTS), N = r.pick(NAMES);
  if (v === 2) return mc(r, ap, ['a.m.', 'p.m.'], { q: `${N} ${what} at ${tstr(eh, em)}. Is that a.m. or p.m.?`, visual: { type: 'clock', h: eh, m: em }, steps: ['a.m. is the morning, before noon. p.m. is after noon.', `${N} ${what} at ${tstr(eh, em)} ${ap}.`] });
  const other = ap === 'a.m.' ? 'p.m.' : 'a.m.';
  return mc(r, `${tstr(eh, em)} ${ap}`, [`${tstr(eh, em)} ${other}`, '3:00 a.m.'], { q: `What is the best time for a child to ${base}?`, steps: [`Think about when people usually do this.`, `${tstr(eh, em)} ${ap} is the best time.`] });
});
skill('1-time-compare', 1, 'Time', 'Earlier, later and how long', ['A later time comes after. An earlier time comes before.', 'One hour after 3:00 is 4:00. Half an hour after 3:00 is 3:30.'], (r) => {
  const v = r.int(0, 2), N = r.pick(NAMES);
  if (v === 0) {
    const h1 = r.int(1, 10), m1 = r.pick([0, 30]); let h2 = r.int(1, 11), m2 = r.pick([0, 30]); if (h2 === h1 && m2 === m1) h2 = h1 + 1;
    const t1 = h1 * 60 + m1, t2 = h2 * 60 + m2, later = r.bool(), right = (later ? t1 > t2 : t1 < t2) ? tstr(h1, m1) : tstr(h2, m2);
    return mc(r, `${right} p.m.`, [`${tstr(h1, m1)} p.m.`, `${tstr(h2, m2)} p.m.`], { q: `Which time is ${later ? 'later' : 'earlier'} in the afternoon or evening: ${tstr(h1, m1)} p.m. or ${tstr(h2, m2)} p.m.?`, steps: ['Compare the hours first, then the minutes.', `${right} p.m. is ${later ? 'later' : 'earlier'}.`] });
  }
  if (v === 1) {
    const h = r.int(1, 12), m = r.pick([0, 30]), half = r.bool();
    const [eh, em] = half ? (m ? [nextH(h), 0] : [h, 30]) : [nextH(h), m], right = tstr(eh, em);
    const wr = [tstr(h, m), half ? tstr(nextH(h), m) : tstr(h, m ? 0 : 30), tstr(nextH(nextH(h)), m)];
    return mc(r, right, wr, { q: `${N} starts painting at the time on the clock. ${N} paints for ${half ? 'half an hour' : '1 hour'}. What time does ${N} finish?`, visual: { type: 'clock', h, m }, steps: [`The clock shows ${tstr(h, m)}.`, `${half ? 'Half an hour' : 'One hour'} later is ${right}.`] });
  }
  const h1 = r.int(1, 8), k = r.int(1, 3);
  return num(k, [`Count the hours from ${h1}:00: ${upto(h1 + 1, h1 + k).map((x) => `${x}:00`).join(', ')}.`, `That is ${k} ${k === 1 ? 'hour' : 'hours'}.`], { q: `A movie starts at ${h1}:00 and ends at ${h1 + k}:00. How many hours long is it?`, expr: `${h1 + k}-${h1}` });
});

// ───── Days, months and seasons ─────
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SEASONS = ['spring', 'summer', 'fall', 'winter'];
skill('1-calendar', 1, 'Days, months and seasons', 'Days, months and the calendar', ['A week has 7 days. A year has 12 months and 4 seasons.', 'On a calendar, each column is one day of the week.'], (r) => {
  const v = r.int(0, 3);
  const nextPrev = (arr, what) => { const i = r.int(0, arr.length - 1), after = r.bool(), right = arr[(i + (after ? 1 : arr.length - 1)) % arr.length]; return mc(r, right, r.shuffle(arr.filter((x) => x !== right)).slice(0, 3), { q: `Which ${what} comes just ${after ? 'after' : 'before'} ${arr[i]}?`, steps: [`In order: ${arr.join(', ')}.`, `${cap(right)} comes just ${after ? 'after' : 'before'} ${arr[i]}.`] }); };
  if (v === 0) return nextPrev(DAYS, 'day');
  if (v === 1) return nextPrev(MONTHS, 'month');
  if (v === 2) return nextPrev(SEASONS, 'season');
  const s = r.int(0, 6), len = r.pick([30, 31]), mon = r.pick(MONTHS.filter((x) => x !== 'February')), cells = [...Array(s).fill(''), ...upto(1, len)];
  while (cells.length % 7) cells.push('');
  const rows = []; for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  const head = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (r.bool()) {
    const d = r.int(1, len), right = DAYS[(s + d - 1) % 7];
    return mc(r, right, r.shuffle(DAYS.filter((x) => x !== right)).slice(0, 3), { q: `This is a calendar for ${mon}. What day of the week is ${mon} ${d}?`, visual: { type: 'table', head, rows }, steps: [`Find ${d} on the calendar.`, `It is in the ${right} column.`] });
  }
  const wd = r.int(0, 6), first = ((wd - s + 7) % 7) + 1;
  return num(first, [`Look down the ${DAYS[wd]} column to the first date.`, `The first ${DAYS[wd]} is ${mon} ${first}.`], { q: `This is a calendar for ${mon}. What is the date of the first ${DAYS[wd]}?`, visual: { type: 'table', head, rows }, expr: `((${wd}-${s}+7)%7)+1` });
});

// ───── Money ─────
const COIN = { 5: ['nickel', '5¢'], 10: ['dime', '10¢'], 25: ['quarter', '25¢'], 100: ['loonie', '$1'], 200: ['toonie', '$2'] };
skill('1-coins', 1, 'Money', 'Canadian coins', ['A nickel is 5¢, a dime is 10¢ and a quarter is 25¢. A loonie is $1 and a toonie is $2.', 'Count the coins worth the most first, then count on.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const c = r.pick([5, 10, 25, 100, 200]), byName = r.bool(), all = [5, 10, 25, 100, 200].map((x) => COIN[x][1]);
    return mc(r, COIN[c][1], r.shuffle(all.filter((x) => x !== COIN[c][1])).slice(0, 3), byName ? { q: `How much is ${art(COIN[c][0])} worth?`, steps: [`${cap(art(COIN[c][0]))} is worth ${COIN[c][1]}.`] } : { q: 'How much is this coin worth?', visual: { type: 'coins', coins: [c] }, steps: [`This coin is ${art(COIN[c][0])}.`, `${cap(art(COIN[c][0]))} is worth ${COIN[c][1]}.`] });
  }
  const q = v === 2 ? r.int(1, 2) : 0, d = r.int(v === 2 ? 0 : 1, 3), n = r.int(1, 4);
  const coins = [...Array(q).fill(25), ...Array(d).fill(10), ...Array(n).fill(5)], total = 25 * q + 10 * d + 5 * n;
  const parts = []; let run = 0; coins.forEach((c) => { run += c; parts.push(run); });
  return num(total, [`Start with the coins worth the most and count on: ${parts.map((x) => `${x}¢`).join(', ')}.`, `The coins are worth ${total}¢.`], { q: 'How many cents are these coins worth?', visual: { type: 'coins', coins }, expr: `25*${q}+10*${d}+5*${n}` });
});
const ITEMS = ['a pencil', 'an eraser', 'a sticker', 'a bouncy ball', 'a bookmark', 'a toy car'];
skill('1-money-use', 1, 'Money', 'Use coins', ['Count your coins to see if you have enough to buy something.', 'Some coins can be traded: 2 nickels make a dime, 4 quarters make a loonie.'], (r) => {
  const v = r.int(0, 3), [N, M] = two(r);
  if (v === 0) {
    const coins = [...Array(r.int(0, 2)).fill(25), ...Array(r.int(1, 3)).fill(10), ...Array(r.int(0, 3)).fill(5)], T = coins.reduce((s, c) => s + c, 0);
    const p = Math.max(5, T + r.pick([-15, -10, -5, 0, 5, 10, 15])), item = r.pick(ITEMS), ok = T >= p;
    return mc(r, ok ? 'yes' : 'no', ['yes', 'no'], { q: `You have these coins. ${cap(item)} costs ${p}¢. Do you have enough money?`, visual: { type: 'coins', coins }, steps: [`The coins are worth ${T}¢.`, ok ? `${T}¢ is at least ${p}¢, so yes.` : `${T}¢ is less than ${p}¢, so no.`] });
  }
  if (v === 1) {
    const [qq, a] = r.pick([['How many nickels make 1 dime?', 2], ['How many nickels make 1 quarter?', 5], ['How many dimes make $1?', 10], ['How many quarters make $1?', 4], ['How many loonies make 1 toonie?', 2], ['How many dimes make 50¢?', 5], ['How many nickels make 50¢?', 10]]);
    return num(a, ['Count by the value of the smaller coin until you reach the bigger amount.', `So the answer is ${a}.`], { q: qq });
  }
  if (v === 2) {
    const T = r.pick([20, 25, 30, 35, 50]), d = r.int(0, Math.floor(T / 10)), n = (T - 10 * d) / 5;
    const fmt = (dd, nn) => [dd ? `${dd} ${dd === 1 ? 'dime' : 'dimes'}` : '', nn ? `${nn} ${nn === 1 ? 'nickel' : 'nickels'}` : ''].filter(Boolean).join(' and ');
    const wr = []; let g = 0; while (wr.length < 3 && g++ < 40) { const dd = r.int(0, 4), nn = r.int(0, 4); if ((dd || nn) && 10 * dd + 5 * nn !== T && !wr.includes(fmt(dd, nn))) wr.push(fmt(dd, nn)); }
    return mc(r, fmt(d, n), wr, { q: `Which group of coins is worth ${T}¢?`, steps: ['Dimes count by 10s, nickels by 5s.', d && n ? `${fmt(d, n)}: ${10 * d}¢ + ${5 * n}¢ = ${T}¢.` : `${fmt(d, n)} make ${T}¢.`] });
  }
  const d = r.int(1, 6); let n = r.int(1, 9); if (5 * n === 10 * d) n += 1;
  const right = 10 * d > 5 * n ? N : M;
  return mc(r, right, [N, M], { q: `${N} has ${d} ${d === 1 ? 'dime' : 'dimes'}. ${M} has ${n} ${n === 1 ? 'nickel' : 'nickels'}. Who has more money?`, steps: [`${N} has ${10 * d}¢. ${M} has ${5 * n}¢.`, `${right} has more money.`] });
});

// ───── Data and graphs ─────
const THEMES = [['fruit', ['Apple', 'Banana', 'Grape', 'Pear']], ['pet', ['Cat', 'Dog', 'Fish', 'Bird']], ['season', ['Spring', 'Summer', 'Fall', 'Winter']], ['colour', ['Red', 'Blue', 'Green', 'Yellow']], ['sport', ['Soccer', 'Hockey', 'Swimming', 'Skating']]];
function dataQ(r, max, show, read) {
  const [noun, all] = r.pick(THEMES), k = r.int(3, 4), labels = r.shuffle(all).slice(0, k), values = r.shuffle(upto(1, max)).slice(0, k);
  const visual = show(noun, labels, values), v = r.int(0, 3), i = r.int(0, k - 1);
  const intro = `Students voted for their favourite ${noun}.`;
  if (v === 0) return num(values[i], [read(labels[i], values[i]), `So ${values[i]} students chose ${labels[i]}.`], { q: `${intro} How many students chose ${labels[i]}?`, visual });
  if (v === 1) {
    const most = r.bool(), m = values.indexOf(most ? Math.max(...values) : Math.min(...values));
    return mc(r, labels[m], labels.filter((x, j) => j !== m), { q: `${intro} Which ${noun} got the ${most ? 'most' : 'fewest'} votes?`, visual, steps: [labels.map((l, j) => `${l}: ${values[j]}`).join(', ') + '.', `${labels[m]} got the ${most ? 'most' : 'fewest'}.`] });
  }
  if (v === 2) {
    let j = r.int(0, k - 1); if (j === i) j = (i + 1) % k;
    const hi = values[i] > values[j] ? i : j, lo = hi === i ? j : i, d = values[hi] - values[lo];
    return num(d, [`${labels[hi]}: ${values[hi]}. ${labels[lo]}: ${values[lo]}.`, `${values[hi]} − ${values[lo]} = ${d}. So ${d} more students chose ${labels[hi]}.`], { q: `${intro} How many more students chose ${labels[hi]} than ${labels[lo]}?`, visual, expr: `${values[hi]}-${values[lo]}` });
  }
  const total = values.reduce((s, x) => s + x, 0);
  return num(total, [`Add all the votes: ${values.join(' + ')}.`, `That is ${total} students.`], { q: `${intro} How many students voted in all?`, visual, expr: values.join('+') });
}
const tally = (n) => [...Array(Math.floor(n / 5)).fill('|||||'), ...(n % 5 ? ['|'.repeat(n % 5)] : [])].join('  ');
skill('1-pictograph', 1, 'Data and graphs', 'Read pictographs', ['A pictograph uses pictures to show data.', 'Here each ★ stands for 1 vote. Count the stars in each row.'], (r) => dataQ(r, 8, (noun, L, V) => ({ type: 'table', head: [cap(noun), 'Votes (★ = 1)'], rows: L.map((l, j) => [l, '★'.repeat(V[j])]) }), (l, x) => `Count the stars for ${l}: ${x}.`));
skill('1-tally', 1, 'Data and graphs', 'Tally charts and tables', ['A tally mark | stands for 1. Tally marks are grouped in fives: ||||| is 5.', 'A table shows the same data with numbers.'], (r) => (r.bool()
  ? dataQ(r, 14, (noun, L, V) => ({ type: 'table', head: [cap(noun), 'Tally'], rows: L.map((l, j) => [l, tally(V[j])]) }), (l, x) => `Count the tally marks for ${l} (fives first): ${x}.`)
  : dataQ(r, 15, (noun, L, V) => ({ type: 'table', head: [cap(noun), 'Number of votes'], rows: L.map((l, j) => [l, V[j]]) }), (l, x) => `Read the row for ${l}: ${x}.`)));
skill('1-bar-graph', 1, 'Data and graphs', 'Read bar graphs', ['A bar graph uses bars to show how many.', 'Read across from the top of a bar to the numbers on the side.'], (r) => dataQ(r, 10, (noun, L, V) => ({ type: 'bars', labels: L, values: V, title: `Favourite ${noun}` }), (l, x) => `The ${l} bar reaches ${x}.`));

// ───── Patterns ─────
const PAT = { colour: ['red', 'blue', 'yellow', 'green'], shape: ['circle', 'square', 'triangle', 'star'], size: ['big', 'small'] };
const PAT_INTRO = { colour: 'Beads on a string', shape: 'Shapes in a row', size: 'Big and small balls in a row' };
skill('1-pattern', 1, 'Patterns', 'Repeating patterns', ['A repeating pattern has a part that repeats again and again.', 'Find the part that repeats, then keep going.'], (r) => {
  const kind = r.pick(['colour', 'shape', 'size']), st = r.pick(kind === 'size' ? ['AB', 'AAB', 'ABB', 'AABB'] : ['AB', 'AAB', 'ABB', 'ABC', 'AABB']);
  const els = r.shuffle(PAT[kind]), map = { A: els[0], B: els[1], C: els[2] }, unit = st.split('').map((c) => map[c]);
  const L = unit.length * 2 + r.int(0, unit.length - 1), seq = Array.from({ length: L + 1 }, (_, i) => unit[i % unit.length]);
  const used = [...new Set(unit)], extra = kind === 'size' ? [] : els.filter((x) => !used.includes(x)).slice(0, 1);
  if (r.bool(0.35)) {
    const m = r.int(1, L - 1), shown = seq.slice(0, L).map((x, i) => (i === m ? '___' : x)), ans = seq[m];
    return mc(r, ans, [...used, ...extra].filter((x) => x !== ans), { q: `${PAT_INTRO[kind]}: ${shown.join(', ')}. What goes in the blank?`, steps: [`The part that repeats is: ${unit.join(', ')}.`, `So the missing one is ${ans}.`] });
  }
  const ans = seq[L];
  return mc(r, ans, [...used, ...extra].filter((x) => x !== ans), { q: `${PAT_INTRO[kind]}: ${seq.slice(0, L).join(', ')}, ___. What comes next?`, steps: [`The part that repeats is: ${unit.join(', ')}.`, `So the next one is ${ans}.`] });
});
skill('1-growing', 1, 'Patterns', 'Growing patterns', ['In a growing pattern, each step adds the same amount.', 'Find how many are added each time, then add that again.'], (r) => {
  const s = r.int(1, 4), d = r.int(1, 3);
  if (r.bool()) {
    const k = r.int(4, 5), terms = upto(1, k - 1).map((i) => s + (i - 1) * d), ans = s + (k - 1) * d, N = r.pick(NAMES);
    return num(ans, [`Each row has ${d} more ${d === 1 ? 'block' : 'blocks'} than the row before.`, `${terms[terms.length - 1]} + ${d} = ${ans}. Row ${k} has ${ans} blocks.`], { q: `${N} builds rows of blocks. ${terms.map((x, i) => `Row ${i + 1} has ${x}`).join(', ')}. How many blocks will row ${k} have?`, expr: `${s}+${k - 1}*${d}` });
  }
  const sym = r.pick(['■', '●', '▲', '★']), t = [s, s + d, s + 2 * d], ans = s + 3 * d;
  return mc(r, sym.repeat(ans), [sym.repeat(ans - 1), sym.repeat(ans + 1), sym.repeat(t[2])], { q: `What comes next in this growing pattern?  ${t.map((x) => sym.repeat(x)).join('   ')}   ___`, steps: [`The pattern has ${t.join(', ')} shapes: ${d} more each time.`, `Next comes ${t[2]} + ${d} = ${ans} shapes.`] });
});

// ───── Two-dimensional shapes ─────
const ngon = (k, rot = 90) => Array.from({ length: k }, (_, i) => { const a = ((rot + (i * 360) / k) * Math.PI) / 180; return [+(5 + 4.5 * Math.cos(a)).toFixed(2), +(5 + 4.5 * Math.sin(a)).toFixed(2)]; });
const SH = [
  { name: 'triangle', sides: 3, vis: { type: 'shape', name: 'triangle' } },
  { name: 'square', sides: 4, vis: { type: 'shape', name: 'square' } },
  { name: 'rectangle', sides: 4, vis: { type: 'shape', name: 'rectangle' } },
  { name: 'rhombus', sides: 4, vis: { type: 'shape', name: 'diamond' } },
  { name: 'circle', sides: 0, vis: { type: 'shape', name: 'circle' } },
  { name: 'pentagon', sides: 5, vis: { type: 'poly', points: ngon(5) } },
  { name: 'hexagon', sides: 6, vis: { type: 'poly', points: ngon(6) } },
  { name: 'octagon', sides: 8, vis: { type: 'poly', points: ngon(8, 112.5) } },
];
skill('1-shape-sides', 1, 'Two-dimensional shapes', 'Name shapes, sides and vertices', ['A side is a straight line on the edge of a shape. A vertex is a corner where two sides meet.', 'A triangle has 3 sides, a square 4, a pentagon 5, a hexagon 6 and an octagon 8. A circle has none.'], (r) => {
  const v = r.int(0, 3), s = r.pick(SH);
  if (v === 0) {
    const bad = s.name === 'square' ? ['rhombus', 'rectangle'] : [];
    return mc(r, s.name, r.shuffle(SH.map((x) => x.name).filter((x) => x !== s.name && !bad.includes(x))).slice(0, 3), { q: 'What is the name of this shape?', visual: s.vis, steps: [s.sides ? `It has ${s.sides} straight sides.` : 'It is round, with no straight sides.', `It is ${art(s.name)}.`] });
  }
  if (v === 1 || v === 2) {
    const what = v === 1 ? 'sides' : 'vertices';
    return num(s.sides, [s.sides ? `Count the ${what} as you go around the shape.` : 'A circle is round: it has no straight sides and no corners.', `${cap(art(s.name))} has ${s.sides} ${what}.`], { q: `How many ${what} does this shape have?`, visual: s.vis });
  }
  const [a, b] = r.shuffle(SH.filter((x) => x.sides !== 4 || x.name === 'square')).slice(0, 2), more = r.bool();
  if (a.sides === b.sides) return num(a.sides, [`Count the sides of ${art(a.name)}.`, `${cap(art(a.name))} has ${a.sides} sides.`], { q: `How many sides does ${art(a.name)} have?` });
  const right = (more ? a.sides > b.sides : a.sides < b.sides) ? a.name : b.name;
  return mc(r, right, [a.name, b.name], { q: `Which has ${more ? 'more' : 'fewer'} sides: ${art(a.name)} or ${art(b.name)}?`, steps: [`${cap(art(a.name))} has ${a.sides} sides. ${cap(art(b.name))} has ${b.sides} sides.`, `The ${right} has ${more ? 'more' : 'fewer'}.`] });
});
const ATTR = { square: 'It has 4 equal sides and 4 square corners.', rectangle: 'It has 4 square corners, with 2 long sides and 2 short sides.', triangle: 'It has 3 sides and 3 vertices.', rhombus: 'It has 4 equal sides but no square corners.', circle: 'It is round, with no sides and no vertices.', pentagon: 'It has 5 sides and 5 vertices.', hexagon: 'It has 6 sides and 6 vertices.' };
const RIDDLES = [
  ['I have 4 equal sides and 4 square corners. What am I?', 'square', ['rhombus', 'triangle', 'circle']],
  ['I have 3 sides and 3 vertices. What am I?', 'triangle', ['square', 'circle', 'pentagon']],
  ['I have no sides and no vertices. What am I?', 'circle', ['triangle', 'square', 'hexagon']],
  ['I have 4 equal sides but no square corners. What am I?', 'rhombus', ['square', 'triangle', 'hexagon']],
  ['I have 4 square corners, 2 long sides and 2 short sides. What am I?', 'rectangle', ['square', 'rhombus', 'triangle']],
  ['I have 6 sides and 6 vertices. What am I?', 'hexagon', ['pentagon', 'octagon', 'square']],
  ['I have 5 sides and 5 vertices. What am I?', 'pentagon', ['hexagon', 'square', 'triangle']],
];
skill('1-shape-attr', 1, 'Two-dimensional shapes', 'Shape attributes', ['Look at the sides: how many, and are they equal?', 'Look at the corners: are they square corners? A closed shape has no gaps.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const [q, a, w] = r.pick(RIDDLES); return mc(r, a, w, { q, steps: ['Check the number of sides, then the corners.', `The shape is ${art(a)}.`] }); }
  if (v === 1) {
    const name = r.pick(Object.keys(ATTR)), s = SH.find((x) => x.name === name);
    return mc(r, ATTR[name], r.shuffle(Object.keys(ATTR).filter((x) => x !== name).map((x) => ATTR[x])).slice(0, 3), { q: 'Which is true about this shape?', visual: s.vis, steps: [`This shape is ${art(name)}.`, ATTR[name]] });
  }
  if (v === 2) {
    const qs = [['A shape whose sides all join up with no gaps is called', 'a closed shape', 'an open shape'], ['A shape with a gap, where the sides do not all meet, is called', 'an open shape', 'a closed shape'], ['Is a triangle an open shape or a closed shape? A triangle is', 'a closed shape', 'an open shape']];
    const [q, a, w] = r.pick(qs);
    return mc(r, a, [w], { q: `${q} ___.`, steps: ['Closed shapes have no gaps. Open shapes have a gap.', `The answer is ${a}.`] });
  }
  const fours = r.shuffle(['square', 'rectangle', 'rhombus']), odd = r.pick(['triangle', 'circle', 'pentagon', 'hexagon']), shown = r.shuffle([...fours, odd]);
  return mc(r, odd, fours, { q: `Which shape does not belong? ${shown.join(', ')}`, steps: ['A square, a rectangle and a rhombus all have 4 sides.', `${cap(art(odd))} does not have 4 sides, so it does not belong.`] });
});
const REAL2D = [['the face of a coin', 'circle'], ['a door', 'rectangle'], ['a yield sign', 'triangle'], ['a stop sign', 'octagon'], ['the face of a round clock', 'circle'], ['a sheet of paper', 'rectangle'], ['a square floor tile', 'square'], ['a honeycomb cell', 'hexagon'], ['a slice of pizza', 'triangle'], ['a chessboard', 'square']];
const SYM = ['A', 'H', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y'], NOSYM = ['F', 'G', 'J', 'L', 'N', 'P', 'Q', 'R', 'S', 'Z'];
const MOVES = [['The shape moves to a new place without turning or flipping over.', 'slide'], ['The shape spins around a point, like the hands of a clock.', 'turn'], ['The shape flips over, like a pancake, and makes a mirror image.', 'flip']];
const COMPOSE = [['Two squares put side by side make which shape?', 'rectangle', ['triangle', 'circle', 'hexagon']], ['Six triangles can fit together to make which shape?', 'hexagon', ['circle', 'square', 'oval']], ['Two half circles put together make which shape?', 'circle', ['triangle', 'square', 'rectangle']], ['Shapes that are the same shape and the same size are called ___.', 'congruent', ['open', 'round', 'tall']]];
skill('1-shape-world', 1, 'Two-dimensional shapes', 'Shapes around us', ['Flat shapes are all around us: a door is a rectangle and a coin is a circle.', 'A line of symmetry folds a shape into two matching halves.', 'Shapes can slide, turn or flip.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const [obj, s] = r.pick(REAL2D);
    return mc(r, s, r.shuffle(['circle', 'square', 'rectangle', 'triangle', 'hexagon', 'octagon'].filter((x) => x !== s)).slice(0, 3), { q: `What shape is ${obj}?`, steps: ['Think of its outline.', `${cap(obj)} is shaped like ${art(s)}.`] });
  }
  if (v === 1) { const right = r.pick(SYM); return mc(r, right, r.shuffle(NOSYM).slice(0, 3), { q: 'Which letter has a line of symmetry? (It can fold into two matching halves.)', steps: [`Fold ${right} down the middle.`, `Both halves of ${right} match.`] }); }
  if (v === 2) { const [d, a] = r.pick(MOVES); return mc(r, a, ['slide', 'turn', 'flip'], { q: `${d} Is this a slide, a turn or a flip?`, steps: ['A slide moves, a turn spins, a flip makes a mirror image.', `This is ${art(a)}.`] }); }
  const [q, a, w] = r.pick(COMPOSE);
  return mc(r, a, w, { q, steps: ['Picture the shapes put together.', `The answer is ${a}.`] });
});

// ───── Three-dimensional shapes ─────
const SOLIDS = ['cube', 'rectangular prism', 'cylinder', 'cone', 'sphere', 'square pyramid', 'triangular prism'];
const REAL3D = [['a soup can', 'cylinder'], ['a basketball', 'sphere'], ['a number cube', 'cube'], ['a cereal box', 'rectangular prism'], ['an ice cream cone', 'cone'], ['a party hat', 'cone'], ['an orange', 'sphere'], ['an ice cube', 'cube'], ['a brick', 'rectangular prism'], ['a roll of paper towel', 'cylinder']];
const DESC3D = [['I have 6 faces that are all squares.', 'cube'], ['I have 2 flat faces that are circles, and I can roll.', 'cylinder'], ['I am round all over and have no flat faces.', 'sphere'], ['I have 1 flat face that is a circle, and 1 point.', 'cone'], ['I have a square base and 4 triangle faces that meet at a point.', 'square pyramid'], ['I have 6 faces that are rectangles.', 'rectangular prism'], ['I have 2 triangle faces and 3 rectangle faces.', 'triangular prism']];
skill('1-solid-name', 1, 'Three-dimensional shapes', 'Name solid shapes', ['Solid (three-dimensional) shapes are not flat: cube, rectangular prism, cylinder, cone, sphere and pyramid.', 'Flat (two-dimensional) shapes are like drawings: circle, square, triangle.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) { const [o, s] = r.pick(REAL3D); return mc(r, s, r.shuffle(SOLIDS.filter((x) => x !== s)).slice(0, 3), { q: `${cap(o)} is shaped like which solid?`, steps: ['Think of the whole object, not just one face.', `${cap(o)} is shaped like ${art(s)}.`] }); }
  if (v === 1) { const [d, s] = r.pick(DESC3D); return mc(r, s, r.shuffle(SOLIDS.filter((x) => x !== s)).slice(0, 3), { q: `${d} What am I?`, steps: ['Match the faces and points to a solid.', `It is ${art(s)}.`] }); }
  const flat = r.bool(), right = r.pick(flat ? ['circle', 'square', 'triangle', 'rectangle'] : ['cube', 'sphere', 'cone', 'cylinder']);
  return mc(r, right, r.shuffle(flat ? ['cube', 'sphere', 'cone', 'cylinder'] : ['circle', 'square', 'triangle', 'rectangle']).slice(0, 3), { q: `Which one is ${art(flat ? 'flat (two-dimensional)' : 'solid (three-dimensional)')} shape?`, steps: ['Flat shapes: circle, square, triangle, rectangle. Solids: cube, sphere, cone, cylinder.', `${cap(art(right))} is ${flat ? 'flat' : 'solid'}.`] });
});
const FEV = { cube: [6, 12, 8, '6 square faces', '4 on top, 4 on the bottom and 4 going up', '4 on top and 4 on the bottom'], 'rectangular prism': [6, 12, 8, 'top, bottom and 4 sides', '4 on top, 4 on the bottom and 4 going up', '4 on top and 4 on the bottom'], 'square pyramid': [5, 8, 5, '1 square base and 4 triangles', '4 around the base and 4 going up to the top', '4 around the base and 1 at the top'], 'triangular prism': [5, 9, 6, '2 triangles and 3 rectangles', '3 on each triangle end and 3 joining them', '3 on each triangle end'] };
skill('1-solid-count', 1, 'Three-dimensional shapes', 'Faces, edges and vertices', ['A face is a flat surface. An edge is where two faces meet. A vertex is a corner.', 'A cube has 6 faces, 12 edges and 8 vertices.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const s = r.pick(Object.keys(FEV)), w = r.int(0, 2), what = ['faces', 'edges', 'vertices'][w], n = FEV[s][w];
    return num(n, [`Count them: ${FEV[s][3 + w]}.`, `${cap(art(s))} has ${n} ${what}.`], { q: `How many ${what} does ${art(s)} have?` });
  }
  if (v === 1) {
    const [s, n] = r.pick([['cylinder', 2], ['cone', 1], ['sphere', 0]]);
    return num(n, [{ cylinder: 'A cylinder has a flat circle on the top and on the bottom.', cone: 'A cone has one flat circle at the bottom.', sphere: 'A sphere is curved all over.' }[s], `${cap(art(s))} has ${n} flat ${n === 1 ? 'face' : 'faces'}.`], { q: `How many flat faces does ${art(s)} have?` });
  }
  const [a, b] = r.shuffle(['cube', 'square pyramid', 'triangular prism']).slice(0, 2), w = r.pick([0, 2]), what = ['faces', 'edges', 'vertices'][w];
  if (FEV[a][w] === FEV[b][w]) return num(FEV[a][w], [`Count them: ${FEV[a][3 + w]}.`, `${cap(art(a))} has ${FEV[a][w]} ${what}.`], { q: `How many ${what} does ${art(a)} have?` });
  const right = FEV[a][w] > FEV[b][w] ? a : b;
  return mc(r, right, [a, b], { q: `Which has more ${what}: ${art(a)} or ${art(b)}?`, steps: [`${cap(art(a))} has ${FEV[a][w]}. ${cap(art(b))} has ${FEV[b][w]}.`, `The ${right} has more ${what}.`] });
});
const TRACE = [['the bottom of a cylinder', 'circle'], ['a face of a cube', 'square'], ['the bottom of a cone', 'circle'], ['the base of a square pyramid', 'square'], ['a side face of a square pyramid', 'triangle'], ['an end of a triangular prism', 'triangle'], ['the front of a cereal box', 'rectangle']];
skill('1-solid-attr', 1, 'Three-dimensional shapes', 'What solids can do', ['Trace a flat face of a solid to see a flat shape.', 'Curved solids can roll. Solids with flat faces can stack and slide.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) { const [x, s] = r.pick(TRACE); return mc(r, s, ['circle', 'square', 'triangle', 'rectangle'].filter((y) => y !== s), { q: `If you trace around ${x}, what shape do you draw?`, steps: ['The face you trace is flat.', `Tracing ${x} makes ${art(s)}.`] }); }
  if (v === 1) {
    const [q, a, w] = r.pick([['Which solid can roll but cannot be stacked?', 'sphere', ['cube', 'rectangular prism']], ['Which solid can roll and can also be stacked?', 'cylinder', ['sphere', 'cube']], ['Which solid can be stacked and slide, but cannot roll?', 'cube', ['sphere', 'cylinder']]]);
    return mc(r, a, w, { q, steps: ['Curved surfaces roll. Flat faces stack and slide.', `The answer is ${art(a)}.`] });
  }
  const [q, a, w] = r.pick([['Two cubes stuck together side by side make which solid?', 'rectangular prism', ['sphere', 'cone', 'cylinder']], ['Three cans stacked on top of each other make which solid?', 'cylinder', ['cube', 'cone', 'sphere']], ['Eight small cubes put together in 2 layers of 4 make which solid?', 'cube', ['cone', 'cylinder', 'sphere']]]);
  return mc(r, a, w, { q, steps: ['Picture the solids put together.', `They make ${art(a)}.`] });
});

// ───── Spatial sense ─────
const STUFF = ['cat', 'ball', 'book', 'cup', 'hat', 'drum', 'kite', 'sock', 'bell'];
const ROWN = ['top', 'middle', 'bottom'], COLN = ['left', 'middle', 'right'];
skill('1-position', 1, 'Spatial sense', 'Where is it?', ['Words like above, below, left, right, in front of and behind tell where things are.', 'In a grid, say the row (top, middle, bottom), then the side (left, middle, right).'], (r) => {
  const g = r.shuffle(STUFF), at = (i, j) => g[i * 3 + j], vis = { type: 'table', head: ['', 'Left', 'Middle', 'Right'], rows: ROWN.map((rn, i) => [cap(rn), at(i, 0), at(i, 1), at(i, 2)]) };
  const v = r.int(0, 3), i = r.int(0, 2), j = r.int(0, 2), here = `${ROWN[i]} ${COLN[j]}`;
  if (v === 0) return mc(r, at(i, j), r.shuffle(g.filter((x) => x !== at(i, j))).slice(0, 3), { q: `What is in the ${ROWN[i]} row, on the ${COLN[j]}?`, visual: vis, steps: [`Find the ${ROWN[i]} row, then the ${COLN[j]} column.`, `The ${at(i, j)} is there.`] });
  if (v === 1) {
    const all = ROWN.flatMap((a) => COLN.map((b) => `${a} ${b}`));
    return mc(r, here, r.shuffle(all.filter((x) => x !== here)).slice(0, 3), { q: `Where is the ${at(i, j)}?`, visual: vis, steps: [`The ${at(i, j)} is in the ${ROWN[i]} row and the ${COLN[j]} column.`, `It is at the ${here}.`] });
  }
  if (v === 2) {
    const dirs = [['just above', -1, 0], ['just below', 1, 0], ['just to the left of', 0, -1], ['just to the right of', 0, 1]].filter(([, di, dj]) => i + di >= 0 && i + di <= 2 && j + dj >= 0 && j + dj <= 2);
    const [w, di, dj] = r.pick(dirs), right = at(i + di, j + dj);
    return mc(r, right, r.shuffle(g.filter((x) => x !== right && x !== at(i, j))).slice(0, 3), { q: `What is ${w} the ${at(i, j)}?`, visual: vis, steps: [`Find the ${at(i, j)}.`, `The ${right} is ${w} it.`] });
  }
  const names = r.shuffle(NAMES).slice(0, 3), front = r.bool(), k = front ? r.int(1, 2) : r.int(0, 1), right = names[front ? k - 1 : k + 1];
  return mc(r, right, names.filter((x) => x !== right), { q: `Three children stand in a line facing a door. ${names[0]} is at the front, ${names[1]} is in the middle and ${names[2]} is at the back. Who is just ${front ? 'in front of' : 'behind'} ${names[k]}?`, steps: [`From front to back: ${names.join(', ')}.`, `${right} is just ${front ? 'in front of' : 'behind'} ${names[k]}.`] });
});

// ───── Fractions ─────
const FW = { 2: ['one half', 'halves'], 3: ['one third', 'thirds'], 4: ['one fourth', 'fourths'] };
skill('1-fractions', 1, 'Fractions', 'Halves, thirds and fourths', ['Equal parts are the same size.', '2 equal parts are halves, 3 are thirds and 4 are fourths (also called quarters).'], (r) => {
  const v = r.int(0, 3), d = r.int(2, 4);
  if (v === 0) return mc(r, FW[d][0], ['one half', 'one third', 'one fourth'], { q: 'The bar is cut into equal parts. What part is shaded?', visual: { type: 'fraction', n: 1, d }, steps: [`There are ${d} equal parts and 1 is shaded.`, `That is ${FW[d][0]}.`] });
  if (v === 1) return num(d, [`Count the parts: ${upto(1, d).join(', ')}.`, `There are ${d} equal parts: ${FW[d][1]}.`], { q: 'How many equal parts is this bar cut into?', visual: { type: 'fraction', n: 0, d } });
  if (v === 2) { const n = r.int(1, d - 1); return num(n, [`Each part is one ${FW[d][1].replace(/s$/, '').replace('halve', 'half')}.`, `${n} of the ${d} parts are shaded: ${n} ${n === 1 ? FW[d][1].replace(/s$/, '').replace('halve', 'half') : FW[d][1]}.`], { q: `How many ${FW[d][1]} are shaded?`, visual: { type: 'fraction', n, d } }); }
  const qs = [['Which is bigger: one half or one fourth of the same pizza?', 'one half', ['one fourth'], 'Fewer equal parts means bigger parts.'], ['Which is smaller: one third or one half of the same sandwich?', 'one third', ['one half'], 'More equal parts means smaller parts.'], ['A sandwich is cut into 2 pieces. One piece is big and one is small. Is each piece one half?', 'no', ['yes'], 'Halves must be equal parts.'], ['A pizza is cut into 4 equal pieces. What is each piece called?', 'one fourth', ['one half', 'one third'], '4 equal parts are fourths.'], ['3 friends share a cake into equal parts. What is each part called?', 'one third', ['one half', 'one fourth'], '3 equal parts are thirds.']];
  const [q, a, w, why] = r.pick(qs);
  return mc(r, a, w, { q, steps: [why, `The answer is ${a}.`] });
});

// ───── Venn diagrams ─────
const VENN = [['have 4 sides', 'are red'], ['are pets', 'can fly'], ['are fruits', 'are red'], ['like soccer', 'like hockey']];
skill('1-venn', 1, 'Venn diagrams', 'Venn diagrams', ['A Venn diagram sorts things into circles.', 'Things that belong in both circles go in the middle, where the circles overlap.'], (r) => {
  if (r.bool(0.4)) {
    const col = r.pick(['red', 'blue', 'yellow']), sh = r.pick(['square', 'rectangle', 'triangle', 'circle']), four = sh === 'square' || sh === 'rectangle', red = col === 'red';
    const right = four && red ? 'in the middle, in both circles' : four ? 'only in the "4 sides" circle' : red ? 'only in the "red" circle' : 'outside both circles';
    return mc(r, right, ['in the middle, in both circles', 'only in the "4 sides" circle', 'only in the "red" circle', 'outside both circles'], { q: `A Venn diagram has a "4 sides" circle and a "red" circle. Where does ${art(col)} ${sh} go?`, steps: [`${cap(art(sh))} ${four ? 'has' : 'does not have'} 4 sides. It ${red ? 'is' : 'is not'} red.`, `So it goes ${right}.`] });
  }
  const [A, B] = r.pick(VENN), k = [r.int(1, 6), r.int(1, 5), r.int(1, 6)], w = r.int(0, 2);
  const vis = { type: 'table', head: [`Only ${A}`, 'Both (middle)', `Only ${B}`], rows: [k] };
  const [q, ans, ex, why] = [[`How many ${A}?`, k[0] + k[1], `${k[0]}+${k[1]}`, `Count the "${A}" circle: ${k[0]} + ${k[1]}`], [`How many ${B}?`, k[1] + k[2], `${k[1]}+${k[2]}`, `Count the "${B}" circle: ${k[1]} + ${k[2]}`], ['How many are in the diagram in all?', k[0] + k[1] + k[2], `${k[0]}+${k[1]}+${k[2]}`, `Add all three parts: ${k[0]} + ${k[1]} + ${k[2]}`]][w];
  return num(ans, ['The middle part counts for both circles.', `${why} = ${ans}.`], { q: `The table shows how many are in each part of a Venn diagram. One circle is "${A}" and the other is "${B}". ${q}`, visual: vis, expr: ex });
});

// ───── Probability and statistics ─────
skill('1-likely', 1, 'Probability and statistics', 'How likely is it?', ['If there are more of one colour in a bag, you are more likely to pick it.', 'Certain means it will happen. Impossible means it cannot happen.'], (r) => {
  const [c1, c2] = r.shuffle(['red', 'blue', 'green', 'yellow']), v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(1, 9); let b = r.int(1, 9); if (b === a) b = a === 9 ? 8 : a + 1;
    const more = r.bool(), right = (more ? a > b : a < b) ? c1 : c2;
    return mc(r, right, [c1, c2], { q: `A bag has ${a} ${c1} marbles and ${b} ${c2} marbles. You pick one without looking. Which colour are you ${more ? 'more' : 'less'} likely to pick?`, visual: { type: 'table', head: ['Colour', 'Marbles'], rows: [[cap(c1), a], [cap(c2), b]] }, steps: [`There are ${a} ${c1} and ${b} ${c2}.`, `${cap(right)} has ${more ? 'more' : 'fewer'}, so it is ${more ? 'more' : 'less'} likely.`] });
  }
  if (v === 1) {
    const a = r.int(1, 8), b = r.bool(0.3) ? a : r.int(1, 8), right = a > b ? 'more likely' : a < b ? 'less likely' : 'equally likely';
    return mc(r, right, ['more likely', 'less likely', 'equally likely'], { q: `A bag has ${a} ${c1} cubes and ${b} ${c2} cubes. Is picking ${c1} more likely, less likely or equally likely as picking ${c2}?`, steps: [`Compare: ${a} ${c1} and ${b} ${c2}.`, `Picking ${c1} is ${right}.`] });
  }
  const kind = r.int(0, 3);
  const [a, b] = kind === 0 ? [r.int(3, 8), 0] : kind === 1 ? [0, r.int(3, 8)] : kind === 2 ? [r.int(7, 9), r.int(1, 2)] : [r.int(1, 2), r.int(7, 9)];
  const right = ['certain', 'impossible', 'probable', 'unlikely'][kind], rows = [[cap(c1), a], ...(b ? [[cap(c2), b]] : [])];
  return mc(r, right, ['certain', 'probable', 'unlikely', 'impossible'], { q: `A bag has ${b ? `${a} ${c1} and ${b} ${c2} marbles` : `${a} ${c1} marbles and nothing else`}. You pick one without looking. Is picking ${c1} certain, probable, unlikely or impossible?`.replace(`has 0 ${c1} and`, `has no ${c1} marbles and`), visual: { type: 'table', head: ['Colour', 'Marbles'], rows }, steps: [`There ${a === 1 ? 'is' : 'are'} ${a} ${c1} out of ${a + b}.`, `So picking ${c1} is ${right}.`] });
});

export default list;
