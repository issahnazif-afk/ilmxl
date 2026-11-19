// Grade 0 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
import * as GK from './geo-k3.mjs';
const { skill, list } = grade();

// ── small helpers for Kindergarten ──
const W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const upto = (a, b) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
const countOut = (n, from = 1) => upto(from, n).join(', ');
const countBack = (n, k) => upto(1, k).map((i) => n - i).join(', ');
const others = (r, pool, right, k = 3) => r.shuffle(pool.filter((x) => x !== right)).slice(0, k);
const twoNames = (r) => r.shuffle(NAMES).slice(0, 2);
const ITEMS = [['apple', 'apples'], ['sticker', 'stickers'], ['balloon', 'balloons'], ['crayon', 'crayons'], ['book', 'books'], ['shell', 'shells'], ['cookie', 'cookies'], ['toy car', 'toy cars'], ['block', 'blocks'], ['flower', 'flowers'], ['marble', 'marbles']];
const pl = (it, n) => `${n} ${n === 1 ? it[0] : it[1]}`;
const dots = (n) => Array(n).fill('●').join(' ');
const tally = (n) => { const g = []; for (let i = 0; i < Math.floor(n / 5); i++) g.push('|||||'); if (n % 5) g.push('|'.repeat(n % 5)); return g.join('   '); };
const fives = (n) => upto(1, Math.floor(n / 5)).map((i) => i * 5).join(', ');
const otherInt = (r, lo, hi, not) => { let m = r.int(lo, hi); while (m === not) m = r.int(lo, hi); return m; };

// ── makers shared by the "up to 3 / 5 / 10 / 20" topics ──
// identify numbers: tap the numeral for a number word, pick the word for a numeral, write a number word in digits
const identify = (lo, max) => (r) => {
  const n = r.int(lo, max), v = r.int(0, max >= 10 ? 2 : 1), pool = upto(max > 10 ? 10 : 0, max);
  if (v === 0) {
    const wrong = n > 10 && n % 10 ? [Number(String(n).split('').reverse().join('')), ...others(r, pool, n, 2)] : others(r, pool, n);
    return mc(r, n, wrong, { q: `Tap the number ${W[n]}.`, big: true, steps: [`Say it slowly: ${W[n]}.`, `${cap(W[n])} is written ${n}.`, `So tap ${n}.`] });
  }
  if (v === 1) return mc(r, W[n], others(r, pool, n).map((x) => W[x]), { q: `Which word names the number ${n}?`, steps: [`Read the number: ${n}.`, `We say it as "${W[n]}".`] });
  return num(n, [`Say the word: ${W[n]}.`, `${cap(W[n])} is written ${n}.`, `So the number is ${n}.`], { q: `Write the number ${W[n]} using digits.`, expr: `${n}` });
};

// counting: count pictures, count a ten frame, find the group with n, finish a ten frame, (to 10) tally marks
const counting = (max) => (r) => {
  const v = r.int(0, max >= 10 ? 4 : 3), n = r.int(1, max), o = r.pick(OBJ);
  if (v === 0) return num(n, [`Touch each one once and count: ${countOut(n)}.`, `The last number you say is ${n}.`, `So there are ${n}.`], { q: `How many ${plural(o, 2)} are there?`, visual: { type: 'objects', n, obj: o }, expr: `${n}` });
  if (v === 1) return mc(r, n, others(r, upto(1, Math.max(max, 4)), n), { q: 'How many dots are in the ten frame?', visual: { type: 'tenframes', n }, steps: [`Count the dots: ${countOut(n)}.`, `There are ${n} dots.`] });
  if (v === 2) {
    const m = otherInt(r, 1, max, n), redFirst = r.bool(), g = redFirst ? [n, m] : [m, n], right = redFirst ? 'Red box' : 'Blue box';
    return mc(r, right, [redFirst ? 'Blue box' : 'Red box'], { q: `Which box has ${W[n]} ${plural(o, n)}?`, visual: { type: 'groups', groups: g, obj: o }, steps: [`Count the red box: ${g[0]}. Count the blue box: ${g[1]}.`, `The ${right.toLowerCase()} has ${n}.`] });
  }
  if (v === 3) {
    const k = r.int(0, n - 1);
    return num(n - k, [`The ten frame has ${k} ${k === 1 ? 'dot' : 'dots'} now.`, `Count on from ${k} up to ${n}: ${countOut(n, k + 1)}.`, `That is ${n - k} more ${n - k === 1 ? 'dot' : 'dots'}.`], { q: `The ten frame should show ${n}. How many more dots do you need to put in?`, visual: { type: 'tenframes', n: k }, expr: `${n}-${k}` });
  }
  const t = r.int(3, max);
  return num(t, [t >= 5 ? `Count the groups of 5 first: ${fives(t)}.` : 'There is no full group of 5 yet.', `Then count on the single marks to reach ${t}.`, `So there are ${t} tally marks.`], { q: `Tally marks are drawn in groups of 5. How many tally marks?   ${tally(t)}`, say: 'How many tally marks are there?', expr: `${t}` });
};

// one more and one less, with pictures or ten frames (and, if both, the two together)
const oneMoreLess = (max, both) => (r) => {
  const frame = r.bool(), o = r.pick(OBJ);
  if (both && r.bool(0.3)) {
    const n = r.int(1, max - 1), vis = frame ? { type: 'tenframes', n } : { type: 'objects', n, obj: o };
    return txt(`${n - 1} and ${n + 1}`, [`There are ${n}.`, `One less: count back 1 to ${n - 1}. One more: count on 1 to ${n + 1}.`, `So the numbers are ${n - 1} and ${n + 1}.`], { q: 'Count them. Type the number that is one less, then the number that is one more.', visual: vis, numbers: [n - 1, n + 1] });
  }
  const more = r.bool(), n = more ? r.int(1, max - 1) : r.int(1, max), ans = more ? n + 1 : n - 1, word = more ? 'more' : 'less';
  const vis = frame ? { type: 'tenframes', n } : { type: 'objects', n, obj: o }, thing = frame ? 'dots' : plural(o, 2);
  return num(ans, [`Count them: there ${n === 1 ? 'is' : 'are'} ${n}.`, more ? `One more means count on 1: ${n}, ${ans}.` : `One less means count back 1: ${n}, ${ans}.`, `One ${word} than ${n} is ${ans}.`], { q: `Count the ${thing}. What number is one ${word}?`, visual: vis, expr: `${n}${more ? '+' : '-'}1` });
};

// counting forward and back: next number up or down, between, before/after, hops on a number line, fill a gap, (fill) fill a ten frame
const forwardBack = (lo, hi, fill) => (r) => {
  const v = r.int(0, fill ? 6 : 5);
  if (v === 0) { const a = r.int(lo, hi - 3); return num(a + 3, ['Each number is one more than the one before.', `After ${a + 2} comes ${a + 3}.`, `So the next number is ${a + 3}.`], { q: `Count up. What number comes next?   ${a}, ${a + 1}, ${a + 2}, ?`, expr: `${a}+3` }); }
  if (v === 1) { const a = r.int(lo + 3, hi); return num(a - 3, ['Counting down, each number is one less.', `After ${a - 2} comes ${a - 3}.`, `So the next number is ${a - 3}.`], { q: `Count down. What number comes next?   ${a}, ${a - 1}, ${a - 2}, ?`, expr: `${a}-3` }); }
  if (v === 2) { const a = r.int(lo, hi - 2); return num(a + 1, [`Count: ${a}, ${a + 1}, ${a + 2}.`, `${a + 1} is between ${a} and ${a + 2}.`, `So the answer is ${a + 1}.`], { q: `What number is between ${a} and ${a + 2}?`, expr: `${a}+1` }); }
  if (v === 3) {
    const after = r.bool(), n = after ? r.int(lo, hi - 1) : r.int(lo + 1, hi), ans = after ? n + 1 : n - 1;
    return num(ans, [after ? 'Just after means one more.' : 'Just before means one less.', `${after ? `${n}, ${ans}` : `${ans}, ${n}`}: the number just ${after ? 'after' : 'before'} ${n} is ${ans}.`], { q: `What number comes just ${after ? 'after' : 'before'} ${n}?`, expr: `${n}${after ? '+' : '-'}1` });
  }
  if (v === 4) {
    const fwd = r.bool(), k = r.int(1, 3), a = fwd ? r.int(lo, hi - k) : r.int(lo + k, hi), end = fwd ? a + k : a - k;
    const jumps = upto(1, k).map((i) => (fwd ? { from: a + i - 1, to: a + i } : { from: a - i + 1, to: a - i }));
    return num(end, [St(`Start at ${a}.`, numberLine(lo, hi, { marks: [a] })), St(`Hop ${fwd ? 'forward' : 'back'} ${k}, one at a time: ${upto(1, k).map((i) => (fwd ? a + i : a - i)).join(', ')}.`, numberLine(lo, hi, { marks: [end], jumps })), St(`You land on ${end}.`)], { q: `Start at ${a} on the number line. Hop ${fwd ? 'forward' : 'back'} ${k} ${k === 1 ? 'time' : 'times'}, one number each hop. Where do you land?`, visual: numberLine(lo, hi, { marks: [a] }), expr: `${a}${fwd ? '+' : '-'}${k}` });
  }
  if (v === 5) {
    const a = r.int(lo, hi - 4), gap = r.int(1, 3), down = r.bool(0.3), s = upto(a, a + 4); if (down) s.reverse();
    const ans = s[gap];
    return num(ans, [`The numbers go ${down ? 'down' : 'up'} by 1 each time.`, `${s[gap - 1]}, then ${ans}, then ${s[gap + 1]}.`, `The missing number is ${ans}.`], { q: `Fill in the missing number:   ${s.map((x, i) => (i === gap ? '?' : x)).join(', ')}`, expr: `${ans}` });
  }
  const n = r.int(1, 9);
  return num(10 - n, [`A full ten frame has 10 boxes. ${n} have dots.`, `Count on from ${n} to 10: ${countOut(10, n + 1)}.`, `So ${10 - n} more dots fill it.`], { q: 'How many more dots will fill the ten frame?', visual: { type: 'tenframes', n }, expr: `10-${n}` });
};

// understand addition: which sentence matches the picture, cube trains in words, which picture matches the sentence, (to 10) words to a sentence
const understandAdd = (max) => (r) => {
  const a = r.int(1, max - 1), b = r.int(1, max - a), c = a + b, o = r.pick(OBJ), v = r.int(0, max >= 10 ? 3 : 2);
  const right = `${a} + ${b} = ${c}`;
  if (v === 0) return mc(r, right, [`${a + 1} + ${b} = ${c + 1}`, `${a} + ${b + 1} = ${c + 1}`, `${a} + ${b} = ${c + 1}`], { q: 'Which addition sentence matches the picture?', visual: { type: 'groups', groups: [a, b], obj: o, plus: true }, steps: [`The red box has ${a}. The blue box has ${b}.`, `Together there are ${c}.`, `So the sentence is ${right}.`] });
  if (v === 1) { const [x, y] = r.shuffle(['red', 'blue', 'yellow', 'green']); return num(c, [`Join ${a} ${x} and ${b} ${y} cubes into one train.`, `Count every cube: ${countOut(c)}.`, `The train has ${c} cubes: ${right}.`], { q: `You build a cube train with ${a} ${x} ${a === 1 ? 'cube' : 'cubes'} and ${b} ${y} ${b === 1 ? 'cube' : 'cubes'}. How many cubes long is the train?`, expr: `${a}+${b}` }); }
  if (v === 2) {
    const P = (x, y) => `${x} ${plural(o, x)} and ${y} more ${plural(o, y)}`;
    return mc(r, P(a, b), [P(a, b + 1), P(a + 1, b), b > 1 ? P(a, b - 1) : P(a + 2, b)], { q: `Which picture shows ${a} + ${b}?`, steps: [`${a} + ${b} means ${a}, then ${b} more.`, `So the picture has ${P(a, b)}.`] });
  }
  return mc(r, right, [`${a} + ${c} = ${b}`, `${a} − ${b} = ${c}`, `${b} + ${b} = ${c}`], { q: `Which number sentence says "${W[a]} plus ${W[b]} equals ${W[c]}"?`, steps: ['"Plus" is written +. "Equals" is written =.', `${cap(W[a])} is ${a}, ${W[b]} is ${b} and ${W[c]} is ${c}.`, `So it is ${right}.`] });
};

// addition practice: complete the sentence, add with pictures, cube trains, (to 10) make 10
const addPractice = (max) => (r) => {
  const v = r.int(0, max >= 10 ? 4 : 2), a = r.int(1, max - 1), b = r.int(1, max - a), c = a + b;
  if (v === 0) return num(b, [St(`Start at ${a}. Count up to ${c}.`, numberLine(0, max, { marks: [a, c] })), St(`${countOut(c, a + 1)}: that is ${b} more.`, numberLine(0, max, { marks: [c], jumps: [{ from: a, to: c, label: `+${b}` }] })), St(`So ${a} + ${b} = ${c}. The missing number is ${b}.`)], { q: `${a} + ? = ${c}`, say: `${a} plus what equals ${c}?`, expr: `${c}-${a}` });
  if (v === 1) { const o = r.pick(OBJ); return num(c, [`The red box has ${a}. The blue box has ${b}.`, `Count them all: ${countOut(c)}.`, `So ${a} + ${b} = ${c}.`], { q: `Add. How many ${plural(o, 2)} in all?   ${a} + ${b} = ?`, visual: { type: 'groups', groups: [a, b], obj: o, plus: true }, expr: `${a}+${b}` }); }
  if (v === 2) return num(c, [`The train starts with ${a} ${a === 1 ? 'cube' : 'cubes'}.`, `Count on ${b}: ${countOut(c, a + 1)}.`, `${a} + ${b} = ${c}, so the train is ${c} cubes long.`], { q: `A cube train has ${a} ${a === 1 ? 'cube' : 'cubes'}. You snap on ${b} more. Find the total: ${a} + ${b} = ?`, expr: `${a}+${b}` });
  const n = r.int(1, 9);
  if (v === 3) return num(10 - n, [`The ten frame shows ${n}. There are ${10 - n} empty boxes.`, `Fill them: ${n} + ${10 - n} = 10.`, `So ${10 - n} more makes 10.`], { q: `Use the ten frame. ${n} + ? = 10`, say: `${n} plus what makes 10?`, visual: { type: 'tenframes', n }, expr: `10-${n}` });
  return num(10 - n, [`Count up from ${n} to 10: ${countOut(10, n + 1)}.`, `That is ${10 - n} more.`, `So ${10 - n} + ${n} = 10.`], { q: `Make 10.   ? + ${n} = 10`, say: `What plus ${n} makes 10?`, expr: `10-${n}` });
};

// take apart a number: missing part, which pair makes n, cubes of two colours
const takeApart = (max) => (r) => {
  const n = r.int(2, max), a = r.int(0, n), b = n - a, v = r.int(0, 2);
  if (v === 0) return num(b, [`${n} is made of ${a} and another part.`, `Count up from ${a} to ${n}: that is ${b}.`, `So ${n} = ${a} + ${b}.`], { q: `${n} = ${a} + ?`, say: `${n} equals ${a} plus what?`, expr: `${n}-${a}` });
  if (v === 1) {
    const x = r.int(1, n - 1), right = `${x} and ${n - x}`;
    const wrongs = [`${x} and ${n - x + 1}`, `${x + 1} and ${n - x + 1}`, n - x > 1 ? `${x} and ${n - x - 1}` : `${x + 2} and ${n - x}`];
    return mc(r, right, wrongs, { q: `Which two numbers make ${n}?`, steps: [`Add each pair and look for ${n}.`, `${x} + ${n - x} = ${n}.`, `So ${right} make ${n}.`] });
  }
  const [x, y] = r.shuffle(['red', 'blue', 'green', 'yellow']), k = r.int(1, n - 1);
  return num(n - k, [`There are ${n} cubes. ${k} ${k === 1 ? 'is' : 'are'} ${x}.`, `The rest are ${y}: ${n} = ${k} + ?`, `${n} = ${k} + ${n - k}, so ${n - k} ${n - k === 1 ? 'is' : 'are'} ${y}.`], { q: `There are ${n} cubes. ${k} ${k === 1 ? 'is' : 'are'} ${x} and the rest are ${y}. How many cubes are ${y}?`, expr: `${n}-${k}` });
};

// addition word problems: solve the story, pick the sentence for it, or solve it with a picture
const addStory = (r, max) => {
  const [A, B] = twoNames(r), it = r.pick(ITEMS), a = r.int(1, max - 1), b = r.int(1, max - a), t = r.int(0, 2);
  const q = [
    `${A} has ${pl(it, a)}. ${B} gives ${A} ${b} more. How many ${it[1]} does ${A} have now?`,
    `There ${a === 1 ? 'is' : 'are'} ${pl(it, a)} on the table. ${A} puts ${b} more on the table. How many ${it[1]} are on the table now?`,
    `${A} has ${pl(it, a)} and ${B} has ${pl(it, b)}. How many ${it[1]} do they have in all?`,
  ][t];
  return { a, b, c: a + b, q };
};
const addWord = (max) => (r) => {
  const { a, b, c, q } = addStory(r, max), v = r.int(0, 2);
  if (v === 0) return num(c, [`The story puts ${a} and ${b} together, so we add.`, `Count on from ${a}: ${countOut(c, a + 1)}.`, `So ${a} + ${b} = ${c}. The answer is ${c}.`], { q, expr: `${a}+${b}` });
  if (v === 1) return mc(r, `${a} + ${b} = ${c}`, [`${a} + ${c} = ${a + c}`, b <= a ? `${a} − ${b} = ${a - b}` : `${b} − ${a} = ${b - a}`, `${a} + ${b} = ${c + 1}`], { q: `${q} Which number sentence matches the story?`, steps: [`Two groups are put together, so we add: ${a} + ${b}.`, `${a} + ${b} = ${c}.`] });
  const o = r.pick(OBJ);
  return num(c, [`The picture shows ${a} for the first part and ${b} for the second part.`, `Count them all: ${countOut(c)}.`, `${a} + ${b} = ${c}. The answer is ${c}.`], { q: `${q} The picture shows the story.`, visual: { type: 'groups', groups: [a, b], obj: o, plus: true }, expr: `${a}+${b}` });
};

// understand subtraction: which sentence matches, cube train in words, what was taken away, (to 10) words to a sentence
const understandSub = (max) => (r) => {
  const n = r.int(2, max), k = r.int(1, n - 1), c = n - k, v = r.int(0, max >= 10 ? 3 : 2), right = `${n} − ${k} = ${c}`;
  if (v === 0) return mc(r, right, [`${n} + ${k} = ${n + k}`, `${n + 1} − ${k} = ${c + 1}`, `${n} − ${k} = ${c + 1}`], { q: 'Which subtraction sentence matches the picture?', visual: { type: 'takeaway', n, gone: k }, steps: [`There are ${n} circles. ${k} ${k === 1 ? 'is' : 'are'} crossed out.`, `${c} ${c === 1 ? 'is' : 'are'} left.`, `So the sentence is ${right}.`] });
  if (v === 1) return num(c, [`The train starts with ${n} cubes.`, `Take off ${k}: count back ${countBack(n, k)}.`, `${right}, so ${c} ${c === 1 ? 'cube is' : 'cubes are'} left.`], { q: `A cube train has ${n} cubes. You break off ${k}. How many cubes are left in the train?`, expr: `${n}-${k}` });
  if (v === 2) return num(k, [`There were ${n} circles at the start.`, `Count the crossed-out ones: ${countOut(k)}.`, `${k} ${k === 1 ? 'was' : 'were'} taken away: ${right}.`], { q: `The picture shows a subtraction: ${n} − ? = ${c}. How many were taken away?`, visual: { type: 'takeaway', n, gone: k }, expr: `${n}-${c}` });
  return mc(r, right, [`${n} + ${k} = ${c}`, `${k} − ${c} = ${n}`, `${n} − ${c} = ${c}`].filter((x) => x !== right), { q: `Which number sentence says "${W[n]} minus ${W[k]} equals ${W[c]}"?`, steps: ['"Minus" is written −. "Equals" is written =.', `${cap(W[n])} is ${n}, ${W[k]} is ${k} and ${W[c]} is ${c}.`, `So it is ${right}.`] });
};

// subtraction practice: take away with pictures, on a number line, complete the sentence, (to 10) which subtraction makes n
const subPractice = (max) => (r) => {
  const n = r.int(2, max), k = r.int(1, n), c = n - k, v = r.int(0, max >= 10 ? 3 : 2);
  if (v === 0) return num(c, [`Start with ${n}. ${k} ${k === 1 ? 'is' : 'are'} crossed out.`, `Count the ones not crossed out: ${c ? countOut(c) : 'none are left'}.`, `So ${n} − ${k} = ${c}.`], { q: `Subtract.   ${n} − ${k} = ?`, visual: { type: 'takeaway', n, gone: k }, expr: `${n}-${k}` });
  if (v === 1) return num(c, [St(`Start at ${n}.`, numberLine(0, max, { marks: [n] })), St(`Jump back ${k}.`, numberLine(0, max, { marks: [c], jumps: [{ from: n, to: c, label: `−${k}` }] })), St(`You land on ${c}. So ${n} − ${k} = ${c}.`)], { q: `${n} − ${k} = ?`, expr: `${n}-${k}` });
  if (v === 2) { const kk = Math.min(k, n - 1), cc = n - kk; return num(kk, [`Start at ${n} and count back to ${cc}.`, `${countBack(n, kk)}: that is ${kk} ${kk === 1 ? 'step' : 'steps'} back.`, `So ${n} − ${kk} = ${cc}. The missing number is ${kk}.`], { q: `${n} − ? = ${cc}`, say: `${n} minus what equals ${cc}?`, expr: `${n}-${cc}` }); }
  const t = r.int(1, 8), x = r.int(t + 1, 10), right = `${x} − ${x - t}`;
  return mc(r, right, [`${x} − ${x - t + 1}`, `${x} − ${x - t - 1 >= 0 ? x - t - 1 : x - t + 2}`, `${x} + ${t}`], { q: `Which one makes ${t}?`, steps: [`Work out each one and look for ${t}.`, `${x} − ${x - t} = ${t}.`, `So ${right} makes ${t}.`] });
};

// subtraction word problems
const subWord = (max) => (r) => {
  const [A, B] = twoNames(r), it = r.pick(ITEMS), n = r.int(2, max), k = r.int(1, n - 1), c = n - k, t = r.int(0, 2), v = r.int(0, 3);
  const q = [
    `${A} has ${pl(it, n)}. ${A} gives ${k} to ${B}. How many ${it[1]} does ${A} have left?`,
    `There are ${pl(it, n)} in a basket. ${A} takes out ${k}. How many ${it[1]} are still in the basket?`,
    `${A} had ${pl(it, n)}. ${k} ${k === 1 ? 'was' : 'were'} lost. How many ${it[1]} does ${A} have now?`,
  ][t];
  if (v === 0) return num(c, [`Some are taken away, so we subtract: ${n} − ${k}.`, `Count back ${k} from ${n}: ${countBack(n, k)}.`, `So ${n} − ${k} = ${c}. The answer is ${c}.`], { q, expr: `${n}-${k}` });
  if (v === 1) return mc(r, `${n} − ${k} = ${c}`, [`${n} + ${k} = ${n + k}`, `${k} + ${c} = ${n + 1}`, `${n} − ${c} = ${k + 1}`], { q: `${q} Which number sentence matches the story?`, steps: [`The story starts with ${n} and ${k} go away, so we subtract.`, `${n} − ${k} = ${c}.`] });
  if (v === 2) return num(c, [`Make a cube train of ${n} cubes, one for each of the ${it[1]}.`, `Break off ${k} ${k === 1 ? 'cube' : 'cubes'}. Count what is left: ${countOut(c)}.`, `${n} − ${k} = ${c}. The answer is ${c}.`], { q: `Use a cube train to solve it. ${q}`, expr: `${n}-${k}` });
  return num(c, [`The picture shows ${n}, with ${k} crossed out.`, `Count the ones left: ${countOut(c)}.`, `${n} − ${k} = ${c}. The answer is ${c}.`], { q, visual: { type: 'takeaway', n, gone: k }, expr: `${n}-${k}` });
};

// ═══════════ 1. Numbers to 3 ═══════════
skill('0-num3', 0, 'Numbers to 3', 'Numbers up to 3', ['Every number has a name and a way to write it.', 'One is 1, two is 2, three is 3.'], identify(0, 3));
// ═══════════ 2. Counting to 3 ═══════════
skill('0-count3', 0, 'Counting to 3', 'Count up to 3', ['Touch each thing once as you count.', 'The last number you say tells how many.'], counting(3));
// ═══════════ 3. Numbers to 5 ═══════════
skill('0-num5', 0, 'Numbers to 5', 'Numbers up to 5', ['Four is written 4. Five is written 5.', 'Match the number word to the number.'], identify(1, 5));
// ═══════════ 4. Counting to 5 ═══════════
skill('0-count5', 0, 'Counting to 5', 'Count up to 5', ['Count each thing just once.', 'A ten frame fills one box at a time, from left to right.'], counting(5));
skill('0-next5', 0, 'Counting to 5', 'What comes next? Up to 5', ['When we count up, each number is one more.', '1, 2, 3, 4, 5.'], (r) => {
  if (r.bool()) { const n = r.int(1, 4); return num(n + 1, [`Count: ${countOut(n + 1)}.`, `After ${n} comes ${n + 1}.`], { q: `What number comes after ${n}?`, expr: `${n}+1` }); }
  const a = r.int(0, 2); return num(a + 3, [`Count up by one: ${a}, ${a + 1}, ${a + 2} …`, `The next number is ${a + 3}.`], { q: `What comes next?   ${a}, ${a + 1}, ${a + 2}, ?`, expr: `${a}+3` });
});
// ═══════════ 5. One more and one less to 5 ═══════════
skill('0-moreless5', 0, 'One more and one less to 5', 'One more, one less (to 5)', ['One more is the next number when you count up.', 'One less is the number just before.'], oneMoreLess(5, false));
// ═══════════ 6. Numbers to 10 ═══════════
skill('0-num10', 0, 'Numbers to 10', 'Numbers up to 10', ['Each number word has a number to match.', 'Seven is 7. Ten is 10: a 1 and a 0.'], identify(0, 10));
// ═══════════ 7. Counting to 10 ═══════════
skill('0-count10b', 0, 'Counting to 10', 'Count and show up to 10', ['A ten frame holds 10. A full top row is 5.', 'Tally marks are drawn in groups of 5.'], counting(10));
// ═══════════ 8. One more and one less to 10 ═══════════
skill('0-moreless10', 0, 'One more and one less to 10', 'One more, one less (to 10)', ['One more: count on 1. One less: count back 1.', 'One more than 7 is 8. One less than 7 is 6.'], oneMoreLess(10, true));
// ═══════════ 9. Counting forward and back to 10 ═══════════
skill('0-fwdback10', 0, 'Counting forward and back to 10', 'Count forward and back to 10', ['Counting forward, numbers get bigger by 1.', 'Counting back, numbers get smaller by 1.'], forwardBack(0, 10, true));
// ═══════════ 10. Understand addition up to 5 ═══════════
skill('0-addmeaning5', 0, 'Understand addition up to 5', 'What addition means (to 5)', ['Adding puts two groups together.', '2 + 1 = 3 means 2 and 1 more make 3.'], understandAdd(5));
// ═══════════ 11. Addition up to 5 ═══════════
skill('0-addmore5', 0, 'Addition up to 5', 'Add and complete sentences (to 5)', ['To add, count all of them.', 'For 2 + ? = 5, count up from 2 to 5.'], addPractice(5));
// ═══════════ 12. Take apart numbers up to 5 ═══════════
skill('0-apart5', 0, 'Take apart numbers up to 5', 'Make numbers up to 5', ['A number can be split into two parts.', '5 is 2 and 3. It is also 4 and 1.'], takeApart(5));
// ═══════════ 13. Addition word problems up to 5 ═══════════
skill('0-addword5', 0, 'Addition word problems up to 5', 'Addition stories (to 5)', ['In an adding story, groups join together.', 'Words like "more" and "in all" tell us to add.'], addWord(5));
// ═══════════ 14. Understand addition up to 10 ═══════════
skill('0-addmeaning10', 0, 'Understand addition up to 10', 'What addition means (to 10)', ['The + sign means put together. The = sign means "is the same as".', '4 + 3 = 7 is read "four plus three equals seven".'], understandAdd(10));
// ═══════════ 15. Addition up to 10 ═══════════
skill('0-addmore10', 0, 'Addition up to 10', 'Add and make 10', ['Start with the bigger number and count on.', 'A full ten frame is 10: use it to make 10.'], addPractice(10));
// ═══════════ 16. Take apart numbers up to 10 ═══════════
skill('0-apart10', 0, 'Take apart numbers up to 10', 'Make numbers up to 10', ['A number can be made in different ways.', '8 is 5 and 3. It is also 6 and 2.'], takeApart(10));
// ═══════════ 17. Addition word problems up to 10 ═══════════
skill('0-addword10', 0, 'Addition word problems up to 10', 'Addition stories (to 10)', ['Find the two groups in the story.', 'Add them to find how many in all.'], addWord(10));
// ═══════════ 18. Understand subtraction up to 5 ═══════════
skill('0-submeaning5', 0, 'Understand subtraction up to 5', 'What subtraction means (to 5)', ['Subtracting takes some away.', '5 − 2 = 3 means 5 take away 2 leaves 3.'], understandSub(5));
// ═══════════ 19. Subtraction up to 5 ═══════════
skill('0-submore5', 0, 'Subtraction up to 5', 'Subtract and complete sentences (to 5)', ['Start with all of them, take some away, and count what is left.', 'For 4 − ? = 1, count back from 4 to 1.'], subPractice(5));
// ═══════════ 20. Subtraction word problems up to 5 ═══════════
skill('0-subword5', 0, 'Subtraction word problems up to 5', 'Subtraction stories (to 5)', ['In a take-away story, some things go away.', 'Words like "left" and "gives away" tell us to subtract.'], subWord(5));
// ═══════════ 21. Understand subtraction up to 10 ═══════════
skill('0-submeaning10', 0, 'Understand subtraction up to 10', 'What subtraction means (to 10)', ['The − sign means take away.', '9 − 4 = 5 is read "nine minus four equals five".'], understandSub(10));
// ═══════════ 22. Subtraction up to 10 ═══════════
skill('0-sub10', 0, 'Subtraction up to 10', 'Subtract within 10', ['Start at the bigger number and count back.', 'For 9 − 3: 8, 7, 6. So 9 − 3 = 6.'], subPractice(10));
// ═══════════ 23. Subtraction word problems up to 10 ═══════════
skill('0-subword10', 0, 'Subtraction word problems up to 10', 'Subtraction stories (to 10)', ['Find how many there were at the start, and how many went away.', 'Subtract to find how many are left.'], subWord(10));

// ═══════════ 24. Mixed operations ═══════════
skill('0-mixed', 0, 'Mixed operations', 'Add or subtract', ['+ means add (plus). − means take away (minus). = means equals.', 'Read the sign before you work it out.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const sym = r.pick(['+', '−', '=']), word = { '+': 'plus', '−': 'minus', '=': 'equals' }[sym];
    return mc(r, word, ['plus', 'minus', 'equals'].filter((x) => x !== word), { q: `What do we call this sign?   ${sym}`, say: { '+': 'What do we call the sign that means add?', '−': 'What do we call the sign that means take away?', '=': 'What do we call the sign that means is the same as?' }[sym], steps: ['+ is plus, − is minus and = is equals.', `So ${sym} is "${word}".`] });
  }
  if (v === 1) {
    if (r.bool()) { const a = r.int(0, 10), b = r.int(0, 10 - a); return num(a + b, ['The sign is +, so we add.', `Start at ${Math.max(a, b)} and count on ${Math.min(a, b)}.`, `${a} + ${b} = ${a + b}.`], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` }); }
    const a = r.int(1, 10), b = r.int(0, a); return num(a - b, ['The sign is −, so we take away.', `Start at ${a} and count back ${b}.`, `${a} − ${b} = ${a - b}.`], { q: `${a} − ${b} = ?`, expr: `${a}-${b}` });
  }
  if (v === 2) {
    const [A, B] = twoNames(r), it = r.pick(ITEMS);
    if (r.bool()) { const a = r.int(1, 8), b = r.int(1, 10 - a); return mc(r, 'add', ['subtract'], { q: `${A} has ${pl(it, a)}. ${B} gives ${A} ${b} more. To find how many ${A} has now, do you add or subtract?`, steps: ['More things join the group.', `So we add: ${a} + ${b} = ${a + b}.`] }); }
    const a = r.int(2, 10), b = r.int(1, a - 1); return mc(r, 'subtract', ['add'], { q: `${A} has ${pl(it, a)}. ${A} gives ${b} to ${B}. To find how many ${A} has left, do you add or subtract?`, steps: ['Some things go away.', `So we subtract: ${a} − ${b} = ${a - b}.`] });
  }
  const b = r.int(1, 9);
  if (r.bool()) return num(10 + b, [`10 and ${b} more.`, `Ten and ${W[b]} make ${W[10 + b]}: ${10 + b}.`, `So 10 + ${b} = ${10 + b}.`], { q: `10 + ${b} = ?`, expr: `10+${b}` });
  return num(10, [`${10 + b} is 10 and ${b} ones.`, `Take away the ${b} ones and 10 is left.`, `So ${10 + b} − ${b} = 10.`], { q: `${10 + b} − ${b} = ?`, expr: `${10 + b}-${b}` });
});

// ═══════════ 25. Numbers to 20 ═══════════
skill('0-num20', 0, 'Numbers to 20', 'Numbers up to 20', ['The teen numbers start with a 1: one ten and some ones.', 'Fifteen is 15: 1 ten and 5 ones.'], identify(11, 20));

// ═══════════ 26. Counting to 20 ═══════════
skill('0-count20b', 0, 'Counting to 20', 'Count, tally and tens to 20', ['Count in rows to keep track.', 'Ten ones make 1 ten. 1 ten and 4 ones is 14.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const n = r.int(11, 20), o = r.pick(OBJ); return num(n, [`Each row has 5. Count the full rows: ${fives(n)}.`, `Then count on the rest to reach ${n}.`, `So there are ${n}.`], { q: `How many ${plural(o, 2)} are there?`, visual: { type: 'objects', n, obj: o }, expr: `${n}` }); }
  if (v === 1) { const [rows, cols] = r.pick([[2, 6], [2, 7], [2, 8], [2, 9], [3, 4], [3, 5], [3, 6], [4, 4], [4, 5], [2, 10], [3, 3]]), n = rows * cols; return num(n, [`There are ${rows} rows of ${cols}.`, `Count row by row: ${upto(1, rows).map((i) => i * cols).join(', ')}.`, `So there are ${n} dots.`], { q: 'How many dots are there?', visual: { type: 'array', rows, cols }, expr: `${rows}*${cols}` }); }
  if (v === 2) { const n = r.int(11, 20); return num(n, [`Count the groups of 5: ${fives(n)}.`, `Count on the single marks to reach ${n}.`, `So there are ${n} tally marks.`], { q: `Tally marks are drawn in groups of 5. How many tally marks?   ${tally(n)}`, say: 'How many tally marks are there?', expr: `${n}` }); }
  const o = r.int(0, 9), n = 10 + o;
  if (r.bool()) return num(n, [`1 ten is 10. Then ${o} ones more.`, `10 + ${o} = ${n}.`, `So the number is ${n}.`], { q: 'The rod is 1 ten. The small cubes are ones. What number is shown?', visual: { type: 'blocks', tens: 1, ones: o }, expr: `10+${o}` });
  return num(o, [`${n} is 1 ten and some ones.`, `${n} = 10 + ${o}.`, `So there are ${o} ones.`], { q: `${n} is 1 ten and how many ones?`, expr: `${n}-10` });
});

// ═══════════ 27. Counting forward and back to 20 ═══════════
skill('0-fwdback20', 0, 'Counting forward and back to 20', 'Count forward and back to 20', ['After 10 come the teens: 11, 12, 13 … 19, then 20.', 'To count back, say the numbers in reverse.'], forwardBack(5, 20, false));

// ═══════════ 28. Numbers and counting beyond 20 ═══════════
skill('0-beyond20', 0, 'Numbers and counting beyond 20', 'Count past 20', ['Count tens first, then the ones.', '2 tens and 3 ones is 23.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) { const t = r.int(1, 3), o = r.int(0, 9), n = t * 10 + o; return num(n, [`Count the tens: ${upto(1, t).map((i) => i * 10).join(', ')}.`, `Count on the ${o} ones from ${t * 10}.`, `So the number is ${n}.`], { q: 'Each rod is 10. Each small cube is 1. What number is shown?', visual: { type: 'blocks', tens: t, ones: o }, expr: `${t}*10+${o}` }); }
  if (v === 1) { const a = r.int(18, 27); return num(a + 3, [`Count up by 1: ${a}, ${a + 1}, ${a + 2} …`, `After ${a + 2} comes ${a + 3}.`, `So the next number is ${a + 3}.`], { q: `What number comes next?   ${a}, ${a + 1}, ${a + 2}, ?`, expr: `${a}+3` }); }
  if (v === 2) { const a = r.int(20, 27), k = r.int(1, 3), end = a + k; return num(end, [St(`Start at ${a}.`, numberLine(20, 30, { marks: [a] })), St(`Hop forward ${k}: ${countOut(end, a + 1)}.`, numberLine(20, 30, { marks: [end], jumps: upto(1, k).map((i) => ({ from: a + i - 1, to: a + i })) })), St(`You land on ${end}.`)], { q: `Start at ${a}. Hop forward ${k} on the number line, one number each hop. Where do you land?`, visual: numberLine(20, 30, { marks: [a] }), expr: `${a}+${k}` }); }
  if (v === 3) { const rows = r.int(3, 9); return num(rows * 10, ['Each row has 10 dots.', `Count by tens: ${upto(1, rows).map((i) => i * 10).join(', ')}.`, `So there are ${rows * 10} dots.`], { q: 'Each row has 10 dots. Count by tens. How many dots are there?', visual: { type: 'array', rows, cols: 10 }, expr: `${rows}*10` }); }
  // a piece of the hundred chart with one number hidden
  const n = r.int(12, 88), pos = r.pick([[0, 1], [1, 0], [1, 2], [2, 1]]);
  const g = [[n - 11, n - 10, n - 9], [n - 1, n, n + 1], [n + 9, n + 10, n + 11]], ans = g[pos[0]][pos[1]];
  const where = pos[0] === 0 ? 'above' : pos[0] === 2 ? 'below' : pos[1] === 0 ? 'to the left of' : 'to the right of';
  const rule = { above: '10 less', below: '10 more', 'to the left of': '1 less', 'to the right of': '1 more' }[where];
  return num(ans, [`On a hundred chart, the number ${where} another is ${rule}.`, `The ? is ${where} ${n}, so it is ${rule} than ${n}.`, `So the missing number is ${ans}.`], { q: 'This is part of a hundred chart. What number goes in the ? box?', visual: { type: 'table', rows: g.map((row, i) => row.map((x, j) => (i === pos[0] && j === pos[1] ? '?' : x))) }, expr: `${ans}` });
});

// ═══════════ 29. Comparing and ordering ═══════════
skill('0-more-fewer', 0, 'Comparing and ordering', 'More, fewer or the same', ['Match the things one to one, or count both groups.', 'The group with things left over has more.'], (r) => {
  const v = r.int(0, 3), o = r.pick(OBJ);
  if (v === 0) {
    const a = r.int(1, 9), b = otherInt(r, 1, 9, a), askMore = r.bool(), right = (askMore ? a > b : a < b) ? 'Red box' : 'Blue box';
    return mc(r, right, [right === 'Red box' ? 'Blue box' : 'Red box'], { q: `Which box has ${askMore ? 'more' : 'fewer'} ${plural(o, 2)}?`, visual: { type: 'groups', groups: [a, b], obj: o }, steps: [`Red has ${a}. Blue has ${b}.`, `${right} has ${askMore ? 'more' : 'fewer'}.`] });
  }
  if (v === 1) {
    const a = r.int(2, 8), b = r.bool(0.4) ? a : otherInt(r, 2, 8, a), right = a === b ? 'The same' : a > b ? 'Red box' : 'Blue box';
    return mc(r, right, ['Red box', 'Blue box', 'The same'].filter((x) => x !== right), { q: `Which box has more ${plural(o, 2)}, or do they have the same number?`, visual: { type: 'groups', groups: [a, b], obj: o }, steps: [`Red has ${a}. Blue has ${b}.`, a === b ? 'Both have the same number.' : `${right} has more.`] });
  }
  if (v === 2) {
    const kids = r.int(2, 8), have = r.int(2, 8), it = r.pick(['hats', 'chairs', 'cups', 'books']), right = have >= kids ? 'Yes' : 'No';
    return mc(r, right, [right === 'Yes' ? 'No' : 'Yes'], { q: `There are ${kids} children and ${have} ${it}. Are there enough ${it} for every child to have one?`, steps: ['Give one to each child.', have >= kids ? `${have} is enough for ${kids} children${have > kids ? `, with ${have - kids} left over` : ''}.` : `${have} is not enough: ${kids - have} ${kids - have === 1 ? 'child gets' : 'children get'} none.`, `So the answer is ${right}.`] });
  }
  const red = r.int(1, 9), blue = otherInt(r, 1, 9, red), askMore = r.bool(), right = (askMore ? red > blue : red < blue) ? 'red' : 'blue';
  return mc(r, right, [right === 'red' ? 'blue' : 'red'], { q: `A box has ${red} red ${red === 1 ? 'ball' : 'balls'} and ${blue} blue ${blue === 1 ? 'ball' : 'balls'}, all mixed up. Which colour has ${askMore ? 'more' : 'fewer'}?`, swatches: true, steps: [`Count each colour: ${red} red and ${blue} blue.`, `${askMore ? Math.max(red, blue) : Math.min(red, blue)} is ${askMore ? 'more' : 'fewer'}, so ${right} has ${askMore ? 'more' : 'fewer'}.`] });
});
skill('0-compare-nums', 0, 'Comparing and ordering', 'Compare numbers to 10', ['A number that comes later when you count is greater.', 'A number that comes earlier is less.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) { const a = r.int(0, 10), b = otherInt(r, 0, 10, a); return mc(r, Math.min(a, b), [Math.max(a, b)], { q: `Which number is less: ${a} or ${b}?`, steps: [`Count: ${Math.min(a, b)} comes before ${Math.max(a, b)}.`, `So ${Math.min(a, b)} is less.`] }); }
  if (v === 1) {
    const [x, y, z] = r.shuffle(upto(0, 10)).slice(0, 3), big = r.bool(), ans = big ? Math.max(x, y, z) : Math.min(x, y, z);
    return mc(r, ans, [x, y, z].filter((t) => t !== ans), { q: `Which number is the ${big ? 'greatest' : 'least'}?   ${x}, ${y}, ${z}`, steps: [`In counting order: ${[x, y, z].sort((p, s) => p - s).join(', ')}.`, `The ${big ? 'last' : 'first'} one is the ${big ? 'greatest' : 'least'}: ${ans}.`] });
  }
  const a = r.int(0, 10), b = otherInt(r, 0, 10, a), right = a > b ? 'greater than' : 'less than';
  return mc(r, right, [a > b ? 'less than' : 'greater than'], { q: `Is ${a} greater than or less than ${b}?`, steps: [`Count: ${Math.min(a, b)} comes before ${Math.max(a, b)}.`, `So ${a} is ${right} ${b}.`] });
});
skill('0-order', 0, 'Comparing and ordering', 'Put numbers in order', ['Least to greatest means smallest first.', 'Use counting order: 2, 5, 8.'], (r) => {
  const big = r.bool(), set = r.shuffle(upto(big ? 11 : 0, big ? 30 : 10)).slice(0, 3), s = [...set].sort((a, b) => a - b);
  if (r.bool()) {
    const right = s.join(', '), wrongs = [[s[1], s[0], s[2]], [s[2], s[1], s[0]], [s[0], s[2], s[1]]].map((x) => x.join(', '));
    return mc(r, right, wrongs, { q: 'Which list is in order from least to greatest?', steps: [`The least is ${s[0]}, then ${s[1]}, then the greatest, ${s[2]}.`, `So the order is ${right}.`] });
  }
  const pos = r.int(0, 2), word = ['first', 'in the middle', 'last'][pos];
  return mc(r, s[pos], set.filter((x) => x !== s[pos]), { q: `Put ${set.join(', ')} in order from least to greatest. Which number goes ${word}?`, steps: [`In order: ${s.join(', ')}.`, `The number ${word} is ${s[pos]}.`] });
});

// ═══════════ 30. Skip-counting ═══════════
skill('0-skip2', 0, 'Skip-counting', 'Count by twos', ['Counting by twos: 2, 4, 6, 8, 10.', 'Pairs, like socks and shoes, come in twos.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) { const a = r.int(1, 6) * 2; return num(a + 6, ['Each number is 2 more than the one before.', `${a + 4} + 2 = ${a + 6}.`, `So the next number is ${a + 6}.`], { q: `Count by twos. What comes next?   ${a}, ${a + 2}, ${a + 4}, ?`, expr: `${a}+6` }); }
  if (v === 1) { const n = r.int(2, 10) * 2; return num(n, ['Count the dots two at a time.', `${multiplesOf(2, n / 2).join(', ')}.`, `So there are ${n} dots.`], { q: 'Count the dots by twos. How many dots?', visual: { type: 'tenframes', n }, expr: `${n}` }); }
  const k = r.int(2, 6), [pair, each] = r.pick([['pairs of socks', 'socks'], ['pairs of shoes', 'shoes'], ['pairs of mittens', 'mittens']]);
  return num(2 * k, ['Each pair has 2. Count by twos, once for each pair.', `${multiplesOf(2, k).join(', ')}.`, `So there are ${2 * k} ${each}.`], { q: `There are ${k} ${pair}. How many ${each} is that? Count by twos.`, expr: `2*${k}` });
});
skill('0-skip5-10', 0, 'Skip-counting', 'Count by fives and tens', ['By fives: 5, 10, 15, 20, 25.', 'By tens: 10, 20, 30, 40, 50.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const by = r.pick([5, 10]), a = by * r.int(1, 5); return num(a + 3 * by, [`Each number is ${by} more than the one before.`, `${a + 2 * by} + ${by} = ${a + 3 * by}.`, `So the next number is ${a + 3 * by}.`], { q: `Count by ${by === 5 ? 'fives' : 'tens'}. What comes next?   ${a}, ${a + by}, ${a + 2 * by}, ?`, expr: `${a}+3*${by}` }); }
  if (v === 1) { const k = r.int(2, 6); return num(5 * k, ['Each hand has 5 fingers. Count by fives.', `${multiplesOf(5, k).join(', ')}.`, `So there are ${5 * k} fingers.`], { q: `How many fingers are on ${k} hands? Count by fives.`, expr: `5*${k}` }); }
  const k = r.int(2, 9);
  if (v === 2) return num(10 * k, ['Each rod is 10. Count by tens.', `${multiplesOf(10, k).join(', ')}.`, `So there are ${10 * k} cubes.`], { q: 'Each rod has 10 cubes. How many cubes are there in all? Count by tens.', visual: { type: 'blocks', tens: k, ones: 0 }, expr: `10*${k}` });
  return num(10 * k, ['Each bag has 10. Count by tens, once for each bag.', `${multiplesOf(10, k).join(', ')}.`, `So there are ${10 * k} marbles.`], { q: `There are ${k} bags with 10 marbles in each bag. How many marbles in all?`, expr: `10*${k}` });
});
skill('0-skip-mixed', 0, 'Skip-counting', 'Skip-count by 2s, 5s and 10s', ['Find the jump: is it 2, 5 or 10 each time?', 'Then keep jumping by the same amount.'], (r) => {
  const by = r.pick([2, 5, 10]), name = { 2: 'twos', 5: 'fives', 10: 'tens' }[by], v = r.int(0, 2);
  if (v === 0) { const a = by * r.int(1, 4), s = upto(0, 4).map((i) => a + i * by), gap = r.int(1, 3); return num(s[gap], [`The numbers go up by ${by} each time.`, `${s[gap - 1]} + ${by} = ${s[gap]}.`, `The missing number is ${s[gap]}.`], { q: `Fill in the missing number:   ${s.map((x, i) => (i === gap ? '?' : x)).join(', ')}`, expr: `${s[gap - 1]}+${by}` }); }
  if (v === 1) { const k = r.int(2, 9), right = by * k; return mc(r, right, [right + 1, right - 1, right + (by === 2 ? 3 : by === 5 ? 2 : 5)], { q: `Which number do you say when you count by ${name}?`, steps: [`Counting by ${name}: ${multiplesOf(by, Math.min(k + 1, 10)).join(', ')}.`, `${right} is one of them.`] }); }
  const a = by * r.int(1, 4); return mc(r, by, [2, 5, 10].filter((x) => x !== by), { q: `What are these numbers counting by?   ${a}, ${a + by}, ${a + 2 * by}, ${a + 3 * by}`, steps: [`From ${a} to ${a + by} is a jump of ${by}.`, `Every jump is ${by}, so it counts by ${name}.`] });
});

// ═══════════ 31. Patterns ═══════════
const PATS = [[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2]];
const COLS = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'], SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
const patternOf = (r, pool, units = PATS) => { const unit = r.pick(units), vals = r.shuffle(pool).slice(0, 3); return { unit, vals: vals.slice(0, Math.max(...unit) + 1), at: (i) => vals[unit[i % unit.length]], core: unit.map((u) => vals[u]) }; };
skill('0-pattern-next', 0, 'Patterns', 'What comes next in a pattern?', ['A pattern repeats the same part again and again.', 'Find the part that repeats, then keep going.'], (r) => {
  const kind = r.pick(['colour', 'colour', 'shape', 'shape', 'size']), pool = kind === 'colour' ? COLS : kind === 'shape' ? SHAPES : ['big', 'small'];
  const P = patternOf(r, pool, kind === 'size' ? PATS.slice(0, 3) : PATS);
  const len = P.unit.length * 2 + r.int(0, P.unit.length - 1), shown = upto(0, len - 1).map(P.at), ans = P.at(len);
  const wrong = P.vals.filter((x) => x !== ans);
  if (kind !== 'size') wrong.push(r.pick(pool.filter((x) => !P.vals.includes(x))));
  return mc(r, ans, wrong, { q: `What comes next?   ${shown.join(', ')}, ?`, ...(kind === 'colour' ? { swatches: true } : kind === 'shape' ? { shapeChoices: true } : {}), steps: [`The part that repeats is: ${P.core.join(', ')}.`, `After ${shown.at(-1)} comes ${ans}.`] });
});
skill('0-pattern-missing', 0, 'Patterns', 'Complete a pattern', ['Say the pattern out loud to hear what repeats.', 'The missing one must keep the pattern going.'], (r) => {
  const shapes = r.bool(), pool = shapes ? SHAPES : COLS, P = patternOf(r, pool), len = P.unit.length * 3, gap = r.int(P.unit.length, len - 2), ans = P.at(gap);
  const shown = upto(0, len - 1).map((i) => (i === gap ? '?' : P.at(i)));
  const wrong = P.vals.filter((x) => x !== ans); wrong.push(r.pick(pool.filter((x) => !P.vals.includes(x))));
  return mc(r, ans, wrong, { q: `Which one is missing from the pattern?   ${shown.join(', ')}`, ...(shapes ? { shapeChoices: true } : { swatches: true }), steps: [`The part that repeats is: ${P.core.join(', ')}.`, `So the missing one is ${ans}.`] });
});
skill('0-pattern-grow', 0, 'Patterns', 'Growing patterns', ['A growing pattern gets bigger by the same amount each time.', 'Find how many are added each time.'], (r) => {
  const step = r.pick([1, 1, 2]), start = r.int(1, 3), rows = [start, start + step, start + 2 * step], next = start + 3 * step;
  const visual = { type: 'table', head: ['Step', 'Picture'], rows: rows.map((n, i) => [`Step ${i + 1}`, dots(n)]) };
  if (r.bool()) return num(next, [`Count each step: ${rows.join(', ')}.`, `Each step adds ${step}.`, `So step 4 has ${rows[2]} + ${step} = ${next} dots.`], { q: 'The pattern grows. How many dots will step 4 have?', visual, expr: `${start}+3*${step}` });
  return mc(r, dots(next), [dots(rows[2]), dots(next + 1), dots(next + step + 1)], { q: 'The pattern grows. Which picture comes next?', visual, steps: [`Each step adds ${step} ${step === 1 ? 'dot' : 'dots'}.`, `Step 4 has ${next} dots.`] });
});

// ═══════════ 32. Positions ═══════════
const TOYS = ['ball', 'teddy bear', 'drum', 'kite', 'car', 'doll', 'robot', 'boat', 'yo-yo'];
skill('0-pos-rows', 0, 'Positions', 'Left, middle, right, top and bottom', ['Left, middle and right go across.', 'Top, middle and bottom go up and down.'], (r) => {
  const v = r.int(0, 2), t = r.shuffle(TOYS);
  if (v === 0) { const p = r.int(0, 2), word = ['on the left', 'in the middle', 'on the right'][p]; return mc(r, t[p], t.slice(0, 3).filter((x) => x !== t[p]), { q: `Which toy is ${word}?`, visual: { type: 'table', rows: [t.slice(0, 3)] }, steps: ['Left, middle and right go across the row.', `The toy ${word} is the ${t[p]}.`] }); }
  if (v === 1) { const p = r.int(0, 2), word = ['top', 'middle', 'bottom'][p]; return mc(r, t[p], t.slice(0, 3).filter((x) => x !== t[p]), { q: `This is a shelf. Which toy is on the ${word} shelf?`, visual: { type: 'table', rows: [[t[0]], [t[1]], [t[2]]] }, steps: ['Top is highest and bottom is lowest.', `The ${t[p]} is on the ${word} shelf.`] }); }
  const row = r.int(0, 2), col = r.int(0, 2), g = [t.slice(0, 3), t.slice(3, 6), t.slice(6, 9)], ans = g[row][col];
  return mc(r, ans, others(r, t, ans), { q: `Which toy is in the ${['top', 'middle', 'bottom'][row]} row, ${['on the left', 'in the middle', 'on the right'][col]}?`, visual: { type: 'table', rows: g }, steps: [`Find the ${['top', 'middle', 'bottom'][row]} row.`, `Go ${['to the left', 'to the middle', 'to the right'][col]}: it is the ${ans}.`] });
});
skill('0-pos-words', 0, 'Positions', 'Above, below, in front, behind', ['Above is higher and below is lower.', 'In front is ahead of something; behind is after it.'], (r) => {
  const v = r.int(0, 3), [A, B] = twoNames(r);
  if (v === 0) { const askBehind = r.bool(); return mc(r, askBehind ? B : A, [askBehind ? A : B], { q: `${A} stands in front of ${B} in a line. Who is ${askBehind ? 'behind' : 'in front'}?`, steps: [`${A} is ahead. ${B} comes after ${A}.`, `So ${askBehind ? B : A} is ${askBehind ? 'behind' : 'in front'}.`] }); }
  if (v === 1) { const [x, y] = r.shuffle(['cat', 'dog', 'puppy', 'kitten', 'bunny']), askIn = r.bool(); return mc(r, askIn ? x : y, [askIn ? y : x], { q: `A ${x} is inside the box. A ${y} is outside the box. Which animal is ${askIn ? 'inside' : 'outside'} the box?`, steps: [`The ${x} is in the box; the ${y} is not.`, `So the ${askIn ? x : y} is ${askIn ? 'inside' : 'outside'}.`] }); }
  if (v === 2) { const [hi, lo] = r.shuffle(['bird', 'rabbit', 'squirrel', 'fox']), askAbove = r.bool(); return mc(r, askAbove ? hi : lo, [askAbove ? lo : hi], { q: `A ${hi} is up in a tree. A ${lo} sits on the ground under the tree. Which animal is ${askAbove ? 'above' : 'below'} the other?`, steps: ['Up in the tree is higher than the ground.', `So the ${askAbove ? hi : lo} is ${askAbove ? 'above' : 'below'}.`] }); }
  const [p, m, s] = r.shuffle(NAMES).slice(0, 3), both = r.bool();
  return mc(r, m, [p, s], { q: `${p}, ${m} and ${s} sit in a row, in that order. Who sits ${both ? 'beside both of the others' : `next to ${p}`}?`, steps: [`The row is: ${p}, ${m}, ${s}.`, `${m} is in the middle, so ${m} is next to ${both ? 'both' : p}.`] });
});

// ═══════════ 33. Same and different ═══════════
const SH8 = ['circle', 'square', 'triangle', 'rectangle', 'oval', 'diamond', 'star', 'heart'];
skill('0-same-diff', 0, 'Same and different', 'Same and different', ['Things that are the same match in every way.', 'Look closely for the one that does not match.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) { const [a, b] = r.shuffle(SHAPES), n = r.int(4, 5), at = r.int(0, n - 1), row = upto(0, n - 1).map((i) => (i === at ? b : a)); return mc(r, b, [a], { q: 'Which shape is different from the others?', visual: { type: 'table', rows: [row] }, shapeChoices: true, steps: [`Most of them are ${a}s.`, `The ${b} does not match, so it is different.`] }); }
  if (v === 1) { const s = r.pick(SH8); return mc(r, s, others(r, SH8, s), { q: 'Which shape is the same as this one?', visual: { type: 'shape', name: s }, shapeChoices: true, steps: [`The shape is a ${s}.`, `Find the ${s}: it is the same.`] }); }
  const [a, b] = r.shuffle(COLS), n = r.int(4, 5), at = r.int(0, n - 1), row = upto(0, n - 1).map((i) => (i === at ? b : a));
  return mc(r, b, [a], { q: `Which colour is different?   ${row.join(', ')}`, swatches: true, steps: [`Most of them are ${a}.`, `One is ${b}, so ${b} is different.`] });
});

// ═══════════ 34. Two-dimensional shapes ═══════════
skill('0-shapes2d', 0, 'Two-dimensional shapes', 'Name flat shapes', GK.LESSONS['0-shapes2d'], GK.kShapes2d);

// ═══════════ 35. Two-dimensional shape attributes ═══════════
skill('0-shape-sides', 0, 'Two-dimensional shape attributes', 'Sides, corners and curves', GK.LESSONS['0-shape-sides'], GK.kShapeSides);
skill('0-symmetry', 0, 'Two-dimensional shape attributes', 'Matching halves', GK.LESSONS['0-symmetry'], GK.symmetry);

// ═══════════ 36. Three-dimensional shapes ═══════════
skill('0-solids-name', 0, 'Three-dimensional shapes', 'Name solid shapes', GK.LESSONS['0-solids-name'], GK.kSolidsName);
skill('0-solids-faces', 0, 'Three-dimensional shapes', 'Faces, rolling and stacking', GK.LESSONS['0-solids-faces'], GK.kSolidsFaces);

// ═══════════ 37. Shapes in the real world ═══════════
skill('0-shapes-real', 0, 'Shapes in the real world', 'Shapes around us', GK.LESSONS['0-shapes-real'], GK.kShapesReal);

// ═══════════ 38. Classifying and sorting ═══════════
skill('0-sort', 0, 'Classifying and sorting', 'Sort and count', ['To sort, put things that are alike together: by colour or by shape.', 'Then count each group.'], (r) => {
  const cols = r.shuffle(['red', 'blue', 'yellow']).slice(0, 2), shp = r.shuffle(['circle', 'square', 'triangle']).slice(0, 2), n = r.int(5, 7);
  const items = upto(1, n).map(() => [r.pick(cols), r.pick(shp)]);
  if (!items.some((x) => x[0] === cols[0] && x[1] === shp[0])) items[0] = [cols[0], shp[0]];
  const cnt = (f) => items.filter(f).length, visual = { type: 'table', head: ['Colour', 'Shape'], rows: items }, v = r.int(0, 3);
  if (v === 0) { const c = r.pick(cols), k = cnt((x) => x[0] === c); return num(k, [`Sort by colour. Look for ${c} in each row.`, `Count the ${c} ones: ${k ? countOut(k) : 'there are none'}.`, `So ${k} ${k === 1 ? 'shape is' : 'shapes are'} ${c}.`], { q: `How many shapes are ${c}?`, visual, expr: `${k}` }); }
  if (v === 1) { const s = r.pick(shp), k = cnt((x) => x[1] === s); return num(k, [`Sort by shape. Look for ${s}s.`, `Count them: ${k ? countOut(k) : 'there are none'}.`, `So there ${k === 1 ? 'is' : 'are'} ${k} ${k === 1 ? s : s + 's'}.`], { q: `How many ${s}s are there?`, visual, expr: `${k}` }); }
  if (v === 2) { const k = cnt((x) => x[0] === cols[0] && x[1] === shp[0]); return num(k, [`The middle part of a Venn diagram holds shapes that are both ${cols[0]} and ${shp[0]}s.`, `Count the ${cols[0]} ${shp[0]}s: ${countOut(k)}.`, `So ${k} ${k === 1 ? 'shape goes' : 'shapes go'} in the middle.`], { q: `You sort these shapes into a Venn diagram with two circles: "${cols[0]}" and "${shp[0]}s". How many shapes go in the middle, where the circles overlap?`, visual, expr: `${k}` }); }
  const a = cnt((x) => x[0] === cols[0]), b = n - a, right = a === b ? 'the same' : a > b ? cols[0] : cols[1];
  return mc(r, right, [cols[0], cols[1], 'the same'].filter((x) => x !== right), { q: `Sort by colour. Are there more ${cols[0]} shapes or more ${cols[1]} shapes, or the same?`, visual, steps: [`${cap(cols[0])}: ${a}. ${cap(cols[1])}: ${b}.`, a === b ? 'They are the same.' : `There are more ${right} shapes.`] });
});

// ═══════════ 39. Data and graphs ═══════════
skill('0-pictograph', 0, 'Data and graphs', 'Read and make picture graphs', ['In a picture graph, each picture stands for one.', 'Count the pictures in a row to find how many.'], (r) => {
  const [topic, cats] = r.pick([['Favourite fruit', ['Apples', 'Bananas', 'Grapes', 'Pears']], ['Pets', ['Cats', 'Dogs', 'Fish', 'Birds']], ['Favourite season', ['Winter', 'Spring', 'Summer', 'Fall']]]);
  const vals = r.shuffle(upto(1, 6)).slice(0, 3), names = r.shuffle(cats).slice(0, 3), visual = { type: 'table', head: [topic, 'Votes'], rows: names.map((c, i) => [c, dots(vals[i])]) }, v = r.int(0, 2);
  if (v === 0) { const i = r.int(0, 2); return num(vals[i], [`Find the row for ${names[i]}.`, `Count the dots: ${countOut(vals[i])}.`, `So ${names[i]} got ${vals[i]} ${vals[i] === 1 ? 'vote' : 'votes'}.`], { q: `Each dot is one vote. How many votes did ${names[i]} get?`, visual, expr: `${vals[i]}` }); }
  if (v === 1) { const most = r.bool(), t = most ? Math.max(...vals) : Math.min(...vals), right = names[vals.indexOf(t)]; return mc(r, right, names.filter((x) => x !== right), { q: `Each dot is one vote. Which got the ${most ? 'most' : 'fewest'} votes?`, visual, steps: [`Count each row: ${names.map((c, i) => `${c} ${vals[i]}`).join(', ')}.`, `${right} has the ${most ? 'most' : 'fewest'}.`] }); }
  const k = r.int(1, 6), A = r.pick(NAMES); return mc(r, dots(k), [dots(k + 1), k > 1 ? dots(k - 1) : dots(k + 2), dots(k + 3)], { q: `${A} sees ${k} ${k === 1 ? 'cat' : 'cats'} at the park and makes a picture graph. Each dot stands for one cat. Which row should ${A} draw?`, steps: ['Draw one dot for each cat.', `${k} ${k === 1 ? 'cat means 1 dot' : `cats means ${k} dots`}.`] });
});

// ═══════════ 40. Probability ═══════════
skill('0-likely', 0, 'Probability', 'More likely or less likely', ['If there are more of something, you are more likely to pick it.', 'If there are only a few, you are less likely to pick it.'], (r) => {
  const [a, b] = r.shuffle(['red', 'blue', 'green', 'yellow']).slice(0, 2), na = r.int(5, 9), nb = r.int(1, 3), more = r.bool(), right = more ? a : b, thing = r.pick(['marbles', 'blocks', 'buttons']);
  const [x, y, nx, ny] = r.bool() ? [a, b, na, nb] : [b, a, nb, na];
  const th = (k) => (k === 1 ? thing.slice(0, -1) : thing);
  return mc(r, right, [more ? b : a], { q: `A bag has ${nx} ${x} ${th(nx)} and ${ny} ${y} ${th(ny)}. You pick one without looking. Which colour are you ${more ? 'more' : 'less'} likely to pick?`, swatches: true, steps: [`There are ${na} ${a} and only ${nb} ${b}.`, more ? `There are more ${a}, so ${a} is more likely.` : `There are fewer ${b}, so ${b} is less likely.`] });
});

// ═══════════ 41. Measurement ═══════════
const MEAS = {
  long: ['longer', 'shorter', [['a train', 'a car'], ['a snake', 'a worm'], ['a bus', 'a bike'], ['a ruler', 'a crayon'], ['a skipping rope', 'a shoelace']]],
  tall: ['taller', 'shorter', [['a giraffe', 'a cat'], ['a tree', 'a flower'], ['a door', 'a chair'], ['a house', 'a doghouse'], ['a grown-up', 'a baby']]],
  wide: ['wider', 'narrower', [['a road', 'a path'], ['a river', 'a stream'], ['a couch', 'a stool'], ['a garage door', 'a front door']]],
  heavy: ['heavier', 'lighter', [['an elephant', 'a mouse'], ['a pumpkin', 'a grape'], ['a car', 'a bike'], ['a bowling ball', 'a balloon'], ['a dictionary', 'a feather']]],
  holds: ['holds more', 'holds less', [['a bathtub', 'a cup'], ['a bucket', 'a spoon'], ['a swimming pool', 'a sink'], ['a jug', 'a glass'], ['a backpack', 'a pencil case']]],
  covers: ['covers more', 'covers less', [['a blanket', 'a napkin'], ['a rug', 'a sticker'], ['a poster', 'a stamp'], ['a tablecloth', 'a coaster']]],
};
skill('0-measure-compare', 0, 'Measurement', 'Compare size, mass and capacity', ['Longer, taller and wider compare size. Heavier and lighter compare mass.', 'Holds more or less compares capacity. Covers more or less compares how much space it takes up.'], (r) => {
  if (r.bool(0.25)) {
    const vals = r.shuffle(upto(2, 9)).slice(0, 3), labels = ['A', 'B', 'C'], tall = r.bool(), t = tall ? Math.max(...vals) : Math.min(...vals), right = labels[vals.indexOf(t)];
    return mc(r, right, labels.filter((x) => x !== right), { q: `These are three block towers. Which tower is the ${tall ? 'tallest' : 'shortest'}?`, visual: { type: 'bars', labels, values: vals }, steps: ['The bottoms line up, so look at the tops.', `Tower ${right} is the ${tall ? 'tallest' : 'shortest'}.`] });
  }
  const key = r.pick(Object.keys(MEAS)), [moreW, lessW, pairs] = MEAS[key], [big, small] = r.pick(pairs), askMore = r.bool(), right = askMore ? big : small, word = askMore ? moreW : lessW;
  const be = key === 'holds' || key === 'covers' ? '' : 'is ', [x, y] = r.shuffle([big, small]);
  return mc(r, right, [right === big ? small : big], { q: `Which ${be}${word}: ${x} or ${y}?`, steps: [`${cap(big)} ${be}${moreW} than ${small}.`, `So ${right} ${be}${word}.`] });
});
skill('0-measure-what', 0, 'Measurement', 'Length, mass or capacity?', ['Length tells how long, tall or wide. Mass tells how heavy.', 'Capacity tells how much something holds.'], (r) => {
  const [what, right] = r.pick([['how long a table is', 'length'], ['how tall a friend is', 'length'], ['how wide a door is', 'length'], ['how heavy a watermelon is', 'mass'], ['how heavy a backpack is', 'mass'], ['how heavy a bag of flour is', 'mass'], ['how much water a pot holds', 'capacity'], ['how much juice a jug holds', 'capacity'], ['how much milk a glass holds', 'capacity']]);
  if (r.bool()) return mc(r, right, ['length', 'mass', 'capacity'].filter((x) => x !== right), { q: `You want to find ${what}. Do you measure length, mass or capacity?`, steps: [{ length: 'How long, tall or wide something is: that is length.', mass: 'How heavy something is: that is mass.', capacity: 'How much something holds: that is capacity.' }[right], `So you measure ${right}.`] });
  const tool = { length: 'a ruler', mass: 'a balance scale', capacity: 'a measuring cup' }[right];
  return mc(r, tool, ['a ruler', 'a balance scale', 'a measuring cup'].filter((x) => x !== tool), { q: `Which tool helps you find ${what}?`, steps: [`That is a question about ${right}.`, `We use ${tool} for ${right}.`] });
});
skill('0-measure-units', 0, 'Measurement', 'Measure with objects', ['Line up objects end to end, with no gaps.', 'Count how many objects long it is.'], (r) => {
  const v = r.int(0, 2), [thing, unit] = r.pick([['pencil', 'paper clips'], ['ribbon', 'cubes'], ['crayon', 'cubes'], ['spoon', 'paper clips'], ['shoe', 'cubes']]);
  if (v === 0) { const n = r.int(2, 10); return num(n, [`Each dot stands for one of the ${unit}, lined up end to end.`, `Count them: ${countOut(n)}.`, `So the ${thing} is ${n} ${unit} long.`], { q: `A ${thing} is as long as this row. Each dot is one of the ${unit}. How many ${unit} long is the ${thing}?`, visual: { type: 'array', rows: 1, cols: n }, expr: `${n}` }); }
  const [a, b] = r.shuffle(upto(2, 10)).slice(0, 2), other = r.pick(['marker', 'straw', 'leaf', 'stick']);
  if (v === 1) { const longer = a > b ? thing : other; return mc(r, longer, [longer === thing ? other : thing], { q: `A ${thing} is ${a} ${unit} long. A ${other} is ${b} ${unit} long. Which is longer?`, steps: [`${Math.max(a, b)} ${unit} is more than ${Math.min(a, b)} ${unit}.`, `So the ${longer} is longer.`] }); }
  const hi = Math.max(a, b), lo = Math.min(a, b);
  return num(hi - lo, [`One is ${hi} long and the other is ${lo} long.`, `Count up from ${lo} to ${hi}: that is ${hi - lo}.`, `So it is ${hi - lo} ${unit} longer.`], { q: `A ${thing} is ${hi} ${unit} long. A ${other} is ${lo} ${unit} long. How many ${unit} longer is the ${thing}?`, expr: `${hi}-${lo}` });
});

// ═══════════ 42. Time ═══════════
skill('0-time-hour', 0, 'Time', 'Read clocks to the hour', ['The short hand points to the hour.', "When the long hand points to 12, it is o'clock: 3 o'clock is written 3:00."], (r) => {
  const h = r.int(1, 12), v = r.int(0, 2), right = `${h}:00`;
  if (v === 0) return mc(r, right, [`${h % 12 + 1}:00`, `${(h + 10) % 12 + 1}:00`, `12:${String(h * 5 % 60).padStart(2, '0')}`].filter((x) => x !== right), { q: 'What time does the clock show?', visual: { type: 'clock', h, m: 0 }, steps: [`The short hand points to ${h}. The long hand points to 12.`, `So it is ${h} o'clock, written ${right}.`] });
  if (v === 1) return num(h, ["The long hand is on 12, so it is o'clock.", `The short hand points to ${h}.`, `So it is ${h} o'clock.`], { q: "The clock shows a time on the hour. What is the hour? Type the number.", visual: { type: 'clock', h, m: 0 }, expr: `${h}` });
  return mc(r, right, [`${h}:30`, `12:${String(h).padStart(2, '0')}`, `${h % 12 + 1}:00`].filter((x) => x !== right), { q: `Which digital clock time is ${W[h]} o'clock?`, steps: ['On a digital clock, the hour comes first, then the minutes.', `${cap(W[h])} o'clock is ${right}.`] });
});
skill('0-time-day', 0, 'Time', 'Times of day and seasons', ['a.m. times are from midnight to noon, the morning. p.m. times are from noon to midnight, the afternoon and evening.', 'The seasons go winter, spring, summer, fall.'], (r) => {
  const v = r.int(0, 2), A = r.pick(NAMES);
  if (v === 0) { const [act, h, ap] = r.pick([['eats breakfast', 7, 'a.m.'], ['wakes up', 6, 'a.m.'], ['walks to school', 8, 'a.m.'], ['eats supper', 6, 'p.m.'], ['goes to bed', 8, 'p.m.'], ['plays at the park after school', 4, 'p.m.']]); return mc(r, ap, [ap === 'a.m.' ? 'p.m.' : 'a.m.'], { q: `${A} ${act} at ${h}:00. Is that ${h}:00 a.m. or ${h}:00 p.m.?`, steps: [ap === 'a.m.' ? 'That happens in the morning.' : 'That happens in the afternoon or evening.', `So it is ${h}:00 ${ap}.`] }); }
  if (v === 1) { const [act, right, wrong] = r.pick([['eat breakfast', '7:00 a.m.', ['7:00 p.m.', '11:00 p.m.']], ['go to bed', '8:00 p.m.', ['8:00 a.m.', '11:00 a.m.']], ['eat supper', '6:00 p.m.', ['6:00 a.m.', '2:00 a.m.']], ['start school', '9:00 a.m.', ['9:00 p.m.', '3:00 a.m.']], ['wake up', '7:00 a.m.', ['7:00 p.m.', '1:00 p.m.']]]); return mc(r, right, wrong, { q: `When would a child most likely ${act}?`, steps: [`Think about your own day: when do you ${act}?`, `The best time is ${right}.`] }); }
  const S4 = ['winter', 'spring', 'summer', 'fall'];
  if (r.bool()) { const i = r.int(0, 3), after = r.bool(), ans = S4[(i + (after ? 1 : 3)) % 4]; return mc(r, ans, S4.filter((x) => x !== ans), { q: `Which season comes just ${after ? 'after' : 'before'} ${S4[i]}?`, steps: ['The seasons go around: winter, spring, summer, fall, then winter again.', `The season just ${after ? 'after' : 'before'} ${S4[i]} is ${ans}.`] }); }
  const [clue, s] = r.pick([['Snow falls and you wear a warm coat and mittens.', 'winter'], ['Leaves change colour and fall from the trees.', 'fall'], ['Flowers start to grow and the snow melts.', 'spring'], ['It is hot and you can swim in a lake.', 'summer']]);
  return mc(r, s, S4.filter((x) => x !== s), { q: `Which season is it? ${clue}`, steps: [clue, `That is ${s}.`] });
});

// ═══════════ 43. Money ═══════════
const COIN = { 5: 'nickel', 10: 'dime', 25: 'quarter', 100: 'loonie', 200: 'toonie' };
const val = (c) => (c >= 100 ? `$${c / 100}` : `${c}¢`);
skill('0-coins-name', 0, 'Money', 'Canadian coins', ['A nickel is 5¢, a dime is 10¢ and a quarter is 25¢.', 'A loonie is $1 and a toonie is $2.'], (r) => {
  const v = r.int(0, 2), c = r.pick([5, 10, 25, 100, 200]);
  if (v === 0) return mc(r, COIN[c], others(r, Object.values(COIN), COIN[c]), { q: 'What is the name of this coin?', visual: { type: 'coins', coins: [c] }, steps: [`This coin is worth ${val(c)}.`, `A ${val(c)} coin is called a ${COIN[c]}.`] });
  if (v === 1) return mc(r, val(c), others(r, [5, 10, 25, 100, 200], c).map(val), { q: `How much is a ${COIN[c]} worth?`, steps: ['Nickel 5¢, dime 10¢, quarter 25¢, loonie $1, toonie $2.', `A ${COIN[c]} is worth ${val(c)}.`] });
  const [a, b] = r.shuffle([5, 10, 25, 100, 200]).slice(0, 2), more = r.bool(), right = (more ? a > b : a < b) ? COIN[a] : COIN[b];
  return mc(r, right, [right === COIN[a] ? COIN[b] : COIN[a]], { q: `Which coin is worth ${more ? 'more' : 'less'}: a ${COIN[a]} or a ${COIN[b]}?`, steps: [`A ${COIN[a]} is ${val(a)}. A ${COIN[b]} is ${val(b)}.`, `So the ${right} is worth ${more ? 'more' : 'less'}.`] });
});
skill('0-coins-count', 0, 'Money', 'Count nickels and dimes', ['Count nickels by fives: 5, 10, 15.', 'Count dimes by tens: 10, 20, 30. With both, count the dimes first, then count on the nickels by fives.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) { const k = r.int(2, 8); return num(5 * k, ['Each nickel is 5¢. Count by fives.', `${multiplesOf(5, k).join(', ')}.`, `So there are ${5 * k}¢.`], { q: 'How much money is this? Write the number of cents.', visual: { type: 'coins', coins: Array(k).fill(5) }, expr: `5*${k}` }); }
  if (v === 1) { const k = r.int(2, 9); return num(10 * k, ['Each dime is 10¢. Count by tens.', `${multiplesOf(10, k).join(', ')}.`, `So there are ${10 * k}¢.`], { q: 'How much money is this? Write the number of cents.', visual: { type: 'coins', coins: Array(k).fill(10) }, expr: `10*${k}` }); }
  const d = r.int(1, 4), n = r.int(1, 4), tot = 10 * d + 5 * n, seq = [...multiplesOf(10, d), ...upto(1, n).map((i) => 10 * d + 5 * i)];
  return num(tot, [`Count the ${d} ${d === 1 ? 'dime' : 'dimes'} by tens: ${multiplesOf(10, d).join(', ')}.`, `Count on the ${n} ${n === 1 ? 'nickel' : 'nickels'} by fives: ${seq.join(', ')}.`, `So there are ${tot}¢.`], { q: 'How much money is this? Write the number of cents.', visual: { type: 'coins', coins: r.shuffle([...Array(d).fill(10), ...Array(n).fill(5)]) }, expr: `10*${d}+5*${n}` });
});
skill('0-coins-trade', 0, 'Money', 'Trade and compare coins', ['2 nickels are worth the same as 1 dime.', '4 quarters make $1, which is 1 loonie. 2 loonies make 1 toonie.'], (r) => {
  if (r.bool(0.55)) {
    const [small, big] = r.pick([[5, 10], [5, 25], [25, 100], [100, 200], [10, 100], [5, 20], [10, 50]]), k = big / small;
    const bigName = COIN[big] ? `1 ${COIN[big]}` : `${big}¢`;
    return num(k, [`A ${COIN[small]} is ${val(small)}. Count by ${val(small)} until you reach ${val(big)}.`, `${multiplesOf(small, k).map(val).join(', ')}.`, `That is ${k} ${COIN[small]}s.`], { q: `How many ${COIN[small]}s are worth the same as ${bigName}?`, ...(COIN[big] ? { visual: { type: 'coins', coins: [big] } } : {}), expr: `${big}/${small}` });
  }
  const pick = () => { const d = r.int(0, 3), n = r.int(d ? 0 : 1, 4); return { d, n, t: 10 * d + 5 * n }; };
  const A = pick(), B = pick();
  const desc = ({ d, n }) => [d && `${d} ${d === 1 ? 'dime' : 'dimes'}`, n && `${n} ${n === 1 ? 'nickel' : 'nickels'}`].filter(Boolean).join(' and ');
  const right = A.t === B.t ? 'They are worth the same' : A.t > B.t ? 'Group A' : 'Group B';
  return mc(r, right, ['Group A', 'Group B', 'They are worth the same'].filter((x) => x !== right), { q: `Group A has ${desc(A)}. Group B has ${desc(B)}. Which group is worth more?`, steps: [`Group A: ${A.t}¢. Group B: ${B.t}¢.`, A.t === B.t ? 'Both are worth the same.' : `${right} is worth more.`] });
});

export default list;
