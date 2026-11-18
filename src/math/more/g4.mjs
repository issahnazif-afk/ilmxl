// Grade 4 maths: more skills, one or more for each topic of the grade (see src/math/kit.mjs for the helpers).
import { grade, mc, near, num, txt, OBJ, plural, NAMES, comma, par, gcd, lcm, simplify, frac, isPrime, dec, sgn, neg, St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from '../kit.mjs';
const { skill, list } = grade();

// ── small helpers for this grade ──
const C = comma;
const ONESW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENSW = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const w3 = (n) => { const s = []; if (n >= 100) { s.push(`${ONESW[Math.floor(n / 100)]} hundred`); n %= 100; } if (n >= 20) s.push(TENSW[Math.floor(n / 10)] + (n % 10 ? `-${ONESW[n % 10]}` : '')); else if (n > 0) s.push(ONESW[n]); return s.join(' '); };
const words = (n) => { if (n === 0) return 'zero'; const th = Math.floor(n / 1000), rest = n % 1000; return [th ? `${w3(th)} thousand` : '', rest ? w3(rest) : ''].filter(Boolean).join(' '); };
const ROM = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const roman = (n) => { let s = ''; for (const [v, l] of ROM) while (n >= v) { s += l; n -= v; } return s; };
const placesOf = (n) => String(n).split('').map(Number).reverse();          // index p → the digit worth 10^p
const uniqNum = (r, len) => { const d = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len); if (d[0] === 0) [d[0], d[1]] = [d[1], d[0]]; return Number(d.join('')); };
const nm = (r) => r.pick(NAMES);
const roundTo = (n, to) => Math.round(n / to) * to;
const money = (c) => `$${(c / 100).toFixed(2)}`;
const d1 = (x) => x.toFixed(1), d2 = (x) => x.toFixed(2);
const yesNo = (r, yes, extra) => mc(r, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'], extra);
const TF = (r, t, extra) => mc(r, t ? 'True' : 'False', [t ? 'False' : 'True'], extra);
const perms = (r, arr, sep, k = 3) => { const right = arr.join(sep), s = new Set(); let g = 0; while (s.size < k && g++ < 60) { const p = r.shuffle(arr).join(sep); if (p !== right) s.add(p); } return [...s]; };
const UNITS = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];

// ───────────── 1. Place value and number sense ─────────────
skill('4-place', 4, 'Place value', 'Digits, places and number names', ['Each place is worth 10 times the place to its right.', 'In 52,407 the 2 is in the thousands place, so it is worth 2,000.', 'Expanded form adds up the value of each digit.'], (r) => {
  const v = r.int(0, 4);
  if (v <= 1) {
    const n = uniqNum(r, r.int(5, 6)), ds = placesOf(n);
    const p = v === 0 ? r.pick(ds.map((d, i) => (d ? i : -1)).filter((i) => i >= 0)) : r.int(0, ds.length - 1), d = ds[p];
    if (v === 0) return num(d * 10 ** p, [`Find the ${d} in ${C(n)}: it is in the ${PLACE[p]} place.`, `Its value is ${d} × ${C(10 ** p)} = ${C(d * 10 ** p)}.`, `So the digit ${d} is worth ${C(d * 10 ** p)}.`], { q: `What is the value of the digit ${d} in ${C(n)}?`, expr: `${d}*${10 ** p}` });
    const wrongs = [p - 1, p + 1, p + 2, p - 2].filter((x) => x >= 0 && x <= 5).map((x) => PLACE[x]);
    return mc(r, PLACE[p], wrongs, { q: `In ${C(n)}, which place is the digit ${d} in?`, steps: [`Name the places from the right: ones, tens, hundreds, thousands, ten thousands, hundred thousands.`, `Counting from the right, ${d} is digit number ${p + 1}.`, `So ${d} is in the ${PLACE[p]} place.`] });
  }
  if (v === 2) {
    let n = r.int(10000, 999999); while (placesOf(n).filter((x) => x).length < 3) n = r.int(10000, 999999);
    const parts = placesOf(n).map((d, i) => d * 10 ** i).filter((x) => x).reverse(), k = r.int(0, parts.length - 1);
    const shown = parts.map((x, i) => (i === k ? '?' : C(x))).join(' + ');
    return num(parts[k], [`Write each digit's value: ${parts.map(C).join(' + ')}.`, `The missing part is ${C(parts[k])}.`, `So ? = ${C(parts[k])}.`], { q: `${C(n)} = ${shown}`, say: `${C(n)} in expanded form. What is the missing part?`, expr: `${n}-(${parts.filter((_, i) => i !== k).join('+')})` });
  }
  if (v === 3) {
    const th = r.int(1, 999), rest = r.pick([r.int(0, 999), r.int(1, 99), r.int(100, 999)]), n = th * 1000 + rest;
    return num(n, [`"${w3(th)} thousand" is ${C(th * 1000)}.`, rest ? `"${w3(rest)}" is ${rest}. Add: ${C(th * 1000)} + ${rest} = ${C(n)}.` : `There is nothing after the thousands, so it is ${C(n)}.`, `In digits: ${C(n)}.`], { q: `Write this number in digits: ${words(n)}.`, expr: `${th}*1000+${rest}` });
  }
  const ds = [r.int(1, 9), r.int(0, 9), r.int(0, 9), r.int(0, 9), r.int(0, 9)], names = ['ten thousands', 'thousands', 'hundreds', 'tens', 'ones'];
  const n = Number(ds.join('')), bits = r.shuffle(ds.map((d, i) => `${d} ${names[i]}`));
  return num(n, [`Put each digit in its place: ten thousands ${ds[0]}, thousands ${ds[1]}, hundreds ${ds[2]}, tens ${ds[3]}, ones ${ds[4]}.`, `Read the digits in order: ${C(n)}.`, `The number is ${C(n)}.`], { q: `What number has ${bits.slice(0, -1).join(', ')} and ${bits.at(-1)}?`, expr: `${ds[0]}*10000+${ds[1]}*1000+${ds[2]}*100+${ds[3]}*10+${ds[4]}` });
});
skill('4-placeconv', 4, 'Place value', 'Convert between places', ['One place to the left is worth 10 times as much.', '1 thousand = 10 hundreds = 100 tens.', 'So 36 hundreds = 360 tens.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const d = r.int(1, 9), lo = r.int(0, 2), gap = r.pick([1, 2]), hi = lo + gap, L = hi + 1 + r.int(0, 1);
    const other = () => { let x; do x = r.int(0, 9); while (x === d); return x; };
    const ds = Array.from({ length: L }, other); ds[lo] = d; ds[hi] = d; if (ds[L - 1] === 0) ds[L - 1] = d === 1 ? 2 : 1;
    const n = Number([...ds].reverse().join('')), A = d * 10 ** hi, B = d * 10 ** lo;
    return num(10 ** gap, [`The ${d} in the ${PLACE[hi]} place is worth ${C(A)}.`, `The ${d} in the ${PLACE[lo]} place is worth ${C(B)}.`, `${C(A)} ÷ ${C(B)} = ${10 ** gap}, so it is ${10 ** gap} times as much.`], { q: `In ${C(n)}, the value of the ${d} in the ${PLACE[hi]} place is how many times the value of the ${d} in the ${PLACE[lo]} place?`, expr: `${A}/${B}` });
  }
  if (v === 1) {
    const big = r.int(2, 4), small = r.int(Math.max(0, big - 2), big - 1), k = r.int(2, 99), f = 10 ** (big - small);
    if (r.bool()) return num(k * f, [`1 ${UNITS[big].replace(/s$/, '')} = ${f} ${UNITS[small]}.`, `So ${k} ${UNITS[big]} = ${k} × ${f} = ${C(k * f)} ${UNITS[small]}.`, `The answer is ${C(k * f)}.`], { q: `${k} ${UNITS[big]} = ? ${UNITS[small]}`, expr: `${k}*${f}` });
    const tot = k * 10 ** big;
    return num(k, [`1 ${UNITS[big].replace(/s$/, '')} is ${C(10 ** big)}.`, `${C(tot)} ÷ ${C(10 ** big)} = ${k}.`, `So ${C(tot)} = ${k} ${UNITS[big]}.`], { q: `${C(tot)} = ? ${UNITS[big]}`, expr: `${tot}/${10 ** big}` });
  }
  const name = nm(r);
  if (r.bool()) {
    const per = r.pick([10, 100]), k = r.int(12, 95), tot = per * k, it = r.pick(['stickers', 'pencils', 'beads', 'craft sticks']);
    return num(k, [`Each pack holds ${per}.`, `${C(tot)} ÷ ${per} = ${k}: just remove ${per === 10 ? 'one zero' : 'two zeros'}.`, `So ${name} needs ${k} packs.`], { q: `${it[0].toUpperCase() + it.slice(1)} come in packs of ${per}. ${name} needs exactly ${C(tot)} ${it}. How many packs is that?`, expr: `${tot}/${per}` });
  }
  const h = r.int(3, 40), t = r.int(1, 9), o = r.int(0, 9), tot = h * 100 + t * 10 + o;
  return num(tot, [`${h} boxes of 100 = ${C(h * 100)}. ${t} boxes of 10 = ${t * 10}.`, `${C(h * 100)} + ${t * 10} + ${o} = ${C(tot)}.`, `So there are ${C(tot)} sheets.`], { q: `${name} has ${h} boxes of 100 sheets, ${t} boxes of 10 sheets and ${o} loose sheets. How many sheets is that?`, expr: `${h}*100+${t}*10+${o}` });
});
skill('4-numsense', 4, 'Place value', 'Even, odd, integers and Roman numerals', ['A number is even if its ones digit is 0, 2, 4, 6 or 8.', 'Numbers below zero are negative: −3 is 3 below zero.', 'Roman numerals: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const n = r.int(100, 99999), right = n % 2 ? 'Odd' : 'Even';
    return mc(r, right, [right === 'Odd' ? 'Even' : 'Odd'], { q: `Is ${C(n)} even or odd?`, steps: [`Only the ones digit matters. ${C(n)} ends in ${n % 10}.`, `${n % 10} is ${n % 2 ? 'odd' : 'even'}, so ${C(n)} is ${right.toLowerCase()}.`] });
  }
  if (v === 1) {
    const a = r.int(100, 999), b = r.int(100, 999), op = r.pick(['+', '×', '−']);
    const [x, y] = op === '−' ? [Math.max(a, b), Math.min(a, b)] : [a, b], val = op === '+' ? x + y : op === '×' ? x * y : x - y;
    const right = val % 2 ? 'Odd' : 'Even', pa = (n) => (n % 2 ? 'odd' : 'even');
    const rule = op === '×' ? (x % 2 && y % 2 ? 'odd × odd is odd' : 'even × any whole number is even') : x % 2 === y % 2 ? `${pa(x)} ${op} ${pa(y)} is even` : `even ${op} odd and odd ${op} even are odd`;
    return mc(r, right, [right === 'Odd' ? 'Even' : 'Odd'], { q: `Without working it out, is ${x} ${op} ${y} even or odd?`, steps: [`${x} is ${pa(x)} and ${y} is ${pa(y)}.`, `The rule: ${rule}.`, `So the answer is ${right.toLowerCase()}.`] });
  }
  if (v === 2) {
    const a = r.int(-8, 8), k = r.int(2, 9), up = a + k > 10 ? false : a - k < -10 ? true : r.bool(), b = up ? a + k : a - k;
    return num(b, [St(`Start at ${neg(a)} on the number line.`, numberLine(-10, 10, { marks: [a] })), St(`Move ${k} ${up ? 'up' : 'down'}: ${neg(a)} ${up ? '+' : '−'} ${k} = ${neg(b)}.`, numberLine(-10, 10, { marks: [b], jumps: [{ from: a, to: b }] })), `So the temperature is ${neg(b)} °C.`], { q: `It is ${neg(a)} °C in the morning. By noon the temperature has gone ${up ? 'up' : 'down'} ${k} degrees. What is the temperature now, in °C?`, expr: `${a}${up ? '+' : '-'}${k}` });
  }
  if (v === 3) {
    const by = r.pick([3, 4, 6, 7, 8, 9, 11, 12, 15, 25, 50, 250]), start = by * r.int(1, 12), seq = [0, 1, 2, 3, 4].map((i) => start + i * by), k = r.int(1, 4);
    return num(seq[k], [`Each number is ${by} more than the one before.`, `${C(seq[k - 1])} + ${by} = ${C(seq[k])}.`, `The missing number is ${C(seq[k])}.`], { q: `Find the missing number: ${seq.map((x, i) => (i === k ? '?' : C(x))).join(', ')}`, expr: `${start}+${k}*${by}` });
  }
  const n = r.pick([r.int(1, 49), r.int(40, 400), r.int(400, 2000)]), R = roman(n);
  const parts = placesOf(n).map((d, i) => d * 10 ** i).filter((x) => x).reverse();
  if (r.bool()) return num(n, [`Split it by place: ${parts.map((x) => `${roman(x)} = ${x}`).join(', ')}.`, `Add: ${parts.join(' + ')} = ${n}.`, `So ${R} = ${n}.`], { q: `What number is the Roman numeral ${R}?`, expr: `${parts.join('+')}` });
  return txt(R, [`Split ${n} by place: ${parts.join(' + ')}.`, `Write each part: ${parts.map((x) => `${x} = ${roman(x)}`).join(', ')}.`, `So ${n} = ${R}.`], { q: `Write ${n} as a Roman numeral.` });
});

// ───────────── 2. Comparing and ordering ─────────────
skill('4-compare', 4, 'Comparing and ordering', 'Compare and order big numbers', ['Line the numbers up by place value.', 'Compare from the left: the first place that is different decides.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(1000, 999999), same = r.bool(0.1); let b = same ? a : a + r.pick([1, -1]) * r.pick([r.int(1, 9), r.int(10, 900), r.int(1000, 9000)]);
    if (b < 1000) b = a + 10;
    const s = a > b ? '>' : a < b ? '<' : '=';
    const sa = String(a), sb = String(b); let i = 0; while (i < sa.length && sa[i] === sb[i]) i++;
    return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `${C(a)} ? ${C(b)}`, say: `Which sign goes between ${C(a)} and ${C(b)}?`, steps: [sa.length !== sb.length ? `${sa.length > sb.length ? C(a) : C(b)} has more digits.` : a === b ? 'Every digit is the same.' : `Compare from the left. The first different digits are ${sa[i]} and ${sb[i]}, in the ${PLACE[sa.length - 1 - i]} place.`, `So ${C(a)} ${s} ${C(b)}.`] });
  }
  if (v === 1) {
    const base = r.int(10, 98) * 1000, ns = new Set(); while (ns.size < 4) ns.add(base + r.int(0, 1999));
    const arr = [...ns], up = r.bool(), sorted = [...arr].sort((x, y) => (up ? x - y : y - x)), sep = up ? ' < ' : ' > ';
    return mc(r, sorted.map(C).join(sep), perms(r, arr.map(C), sep), { q: `Put these in order from ${up ? 'least to greatest' : 'greatest to least'}: ${r.shuffle(arr).map(C).join('; ')}`, steps: [`They all have the same number of digits, so compare place by place from the left.`, `${up ? 'Smallest' : 'Greatest'} first: ${sorted.map(C).join(sep)}.`] });
  }
  const lo = r.int(10, 900) * 100, hi = lo + r.pick([100, 200, 500]), right = r.int(lo + 1, hi - 1);
  return mc(r, C(right), [C(lo - r.int(1, 99)), C(hi + r.int(1, 99)), C(hi + r.int(100, 900))], { q: `Which number is greater than ${C(lo)} and less than ${C(hi)}?`, steps: [`The number must be between ${C(lo)} and ${C(hi)}.`, `Only ${C(right)} is bigger than ${C(lo)} and smaller than ${C(hi)}.`] });
});

// ───────────── 3. Rounding ─────────────
skill('4-round', 4, 'Rounding', 'Rounding tables and puzzles', ['Find the two round numbers on each side, then see which is closer.', 'Halfway or more rounds up.'], (r) => {
  const v = r.int(0, 3), to = r.pick([10, 100, 1000]);
  if (v === 0) {
    const n = r.int(1000, 99999), ans = roundTo(n, to), lo = Math.floor(n / to) * to;
    return num(ans, [`${C(n)} is between ${C(lo)} and ${C(lo + to)}. Halfway is ${C(lo + to / 2)}.`, `${C(n)} is ${n >= lo + to / 2 ? 'at or past' : 'before'} halfway, so round ${n >= lo + to / 2 ? 'up' : 'down'}.`, `So ${C(n)} rounds to ${C(ans)}.`], { q: `Round ${C(n)} to the nearest ${C(to)}.`, expr: `Math.round(${n}/${to})*${to}` });
  }
  if (v === 1) {
    const ins = Array.from({ length: 4 }, () => r.int(1000, 9999)), k = r.int(0, 3), outs = ins.map((x) => roundTo(x, to));
    return num(outs[k], [`The rule is: round to the nearest ${C(to)}.`, `${C(ins[k])} is between ${C(Math.floor(ins[k] / to) * to)} and ${C(Math.floor(ins[k] / to) * to + to)}.`, `So ${C(ins[k])} rounds to ${C(outs[k])}.`], { q: `Rule: round to the nearest ${C(to)}. What number goes in the empty box?`, visual: { type: 'table', head: ['In', 'Out'], rows: ins.map((x, i) => [C(x), i === k ? '?' : C(outs[i])]) }, expr: `Math.round(${ins[k]}/${to})*${to}` });
  }
  const t = r.int(2, 98) * to;
  if (v === 2) {
    const right = r.int(t - to / 2, t + to / 2 - 1);
    return mc(r, C(right), [C(t - to / 2 - r.int(1, to / 10)), C(t + to / 2 + r.int(0, to / 10)), C(t + to)], { q: `Which number rounds to ${C(t)} when you round to the nearest ${C(to)}?`, steps: [`Numbers that round to ${C(t)} go from ${C(t - to / 2)} up to ${C(t + to / 2 - 1)}.`, `Only ${C(right)} is in that range.`] });
  }
  const great = r.bool(), ans = great ? t + to / 2 - 1 : t - to / 2;
  return num(ans, [`Halfway between ${C(t - to)} and ${C(t)} is ${C(t - to / 2)}; halfway between ${C(t)} and ${C(t + to)} is ${C(t + to / 2)}.`, `Numbers from ${C(t - to / 2)} to ${C(t + to / 2 - 1)} round to ${C(t)}.`, `So the ${great ? 'greatest' : 'least'} one is ${C(ans)}.`], { q: `What is the ${great ? 'greatest' : 'least'} whole number that rounds to ${C(t)} when rounded to the nearest ${C(to)}?`, expr: `${t}${great ? '+' : '-'}${to / 2}${great ? '-1' : ''}` });
});

// ───────────── 4. Addition and subtraction fluency ─────────────
skill('4-facts20', 4, 'Addition and subtraction facts', 'Facts to 20', ['Make a ten to add: 8 + 5 = 8 + 2 + 3 = 13.', 'Think addition to subtract: 15 − 7 asks "7 plus what is 15?"'], (r) => {
  const v = r.int(0, 3), a = r.int(2, 10), b = r.int(2, 10), c = a + b;
  if (v === 0) return num(c, [`Start at ${Math.max(a, b)} and add ${Math.min(a, b)}.`, `So ${a} + ${b} = ${c}.`], { q: `${a} + ${b} = ?`, expr: `${a}+${b}` });
  if (v === 1) return num(c - b, [`Think: ${b} + ? = ${c}.`, `${b} + ${a} = ${c}, so ${c} − ${b} = ${a}.`], { q: `${c} − ${b} = ?`, expr: `${c}-${b}` });
  if (v === 2) return r.bool() ? num(b, [`Count up from ${a} to ${c}.`, `${a} + ${b} = ${c}, so the missing number is ${b}.`], { q: `${a} + ? = ${c}`, expr: `${c}-${a}` }) : num(c, [`Undo the subtraction: add ${b} back to ${a}.`, `${a} + ${b} = ${c}, so ? = ${c}.`], { q: `? − ${b} = ${a}`, expr: `${a}+${b}` });
  const name = nm(r);
  return r.bool() ? num(c, [`Put the two groups together: ${a} + ${b}.`, `${a} + ${b} = ${c}, so there are ${c} shells.`], { q: `${name} found ${a} shells on Monday and ${b} shells on Tuesday. How many shells is that in all?`, expr: `${a}+${b}` })
    : num(a, [`Take away the ones given away: ${c} − ${b}.`, `${c} − ${b} = ${a}, so ${a} cards are left.`], { q: `${name} had ${c} hockey cards and gave ${b} to a friend. How many cards are left?`, expr: `${c}-${b}` });
});

// ───────────── 5. Addition ─────────────
skill('4-addest', 4, 'Addition', 'Estimate sums', ['Round each number first, then add the round numbers.', 'The estimate should be close to the real sum.'], (r) => {
  const to = r.pick([10, 100, 1000]), lo = to === 10 ? 11 : to === 100 ? 120 : 1200, hi = to === 10 ? 98 : to === 100 ? 980 : 9800;
  const a = r.int(lo, hi), b = r.int(lo, hi), ra = roundTo(a, to), rb = roundTo(b, to);
  if (r.bool()) return num(ra + rb, [`${C(a)} rounds to ${C(ra)}. ${C(b)} rounds to ${C(rb)}.`, `Add: ${C(ra)} + ${C(rb)} = ${C(ra + rb)}.`, `So the estimate is ${C(ra + rb)}.`], { q: `Estimate ${C(a)} + ${C(b)} by rounding each number to the nearest ${C(to)}.`, expr: `Math.round(${a}/${to})*${to}+Math.round(${b}/${to})*${to}` });
  const name = nm(r), place = r.pick(['a food bank', 'a library', 'a museum', 'a skating rink']);
  return num(ra + rb, [`Round each number to the nearest ${C(to)}: ${C(a)} → ${C(ra)} and ${C(b)} → ${C(rb)}.`, `${C(ra)} + ${C(rb)} = ${C(ra + rb)}.`, `So it is about ${C(ra + rb)}.`], { q: `${name} counted ${C(a)} visitors at ${place} in May and ${C(b)} in June. Rounding each number to the nearest ${C(to)}, about how many visitors came in the two months?`, expr: `Math.round(${a}/${to})*${to}+Math.round(${b}/${to})*${to}` });
});
skill('4-add4', 4, 'Addition', 'Add numbers up to four digits', ['Line up the places and start with the ones.', 'If a column makes 10 or more, carry to the next place.'], (r) => {
  const v = r.int(0, 3), a = r.int(1000, 8999), b = r.int(r.pick([10, 100, 1000]), 9999 - a), c = a + b;
  if (v === 0) return num(c, columnAdd([a, b]), { q: `${C(a)} + ${C(b)} = ?`, expr: `${a}+${b}` });
  if (v === 1) {
    const name = nm(r);
    return num(c, [`We put two amounts together, so we add: ${C(a)} + ${C(b)}.`, ...columnAdd([a, b]).slice(-2)], { q: r.bool() ? `${name} walked ${C(a)} steps on Saturday and ${C(b)} steps on Sunday. How many steps is that in all?` : `A farm has ${C(a)} litres of water in one tank and ${C(b)} litres in another. How many litres is that altogether?`, expr: `${a}+${b}` });
  }
  if (v === 2) return num(b, [`Missing part = total − known part.`, `${C(c)} − ${C(a)} = ${C(b)}.`, `Check: ${C(a)} + ${C(b)} = ${C(c)}. So ? = ${C(b)}.`], { q: `${C(a)} + ? = ${C(c)}`, expr: `${c}-${a}` });
  const sa = String(a), k = r.int(0, 3), dig = Number(sa[k]), shown = sa.slice(0, k) + '_' + sa.slice(k + 1);
  return num(dig, [`Work backwards: the first number is ${C(c)} − ${C(b)}.`, `${C(c)} − ${C(b)} = ${C(a)}.`, `So the missing digit is ${dig}.`], { q: `Find the missing digit: ${shown} + ${C(b)} = ${C(c)}`, expr: `Math.floor(${a}/${10 ** (3 - k)})%10` });
});
skill('4-addprop', 4, 'Addition', 'Addition properties and patterns', ['Order does not change a sum: 3 + 5 = 5 + 3.', 'Grouping does not change a sum, and adding 0 changes nothing.', 'If 3 + 4 = 7, then 300 + 400 = 700.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(10, 99), b = r.int(10, 99), c = r.int(10, 99), P = r.int(0, 2);
    const q = [`${a} + ${b} = ${b} + ${a}`, `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, `${a} + 0 = ${a}`][P], names = ['Commutative property (order)', 'Associative property (grouping)', 'Identity property (adding zero)'];
    return mc(r, names[P], names.filter((_, i) => i !== P), { q: `Which property does this show? ${q}`, steps: [['The same numbers are added in a different order.', 'The same numbers are grouped differently with brackets.', 'Adding 0 leaves the number the same.'][P], `That is the ${names[P].toLowerCase()}.`] });
  }
  if (v === 1) {
    const ns = Array.from({ length: r.int(3, 4) }, () => r.int(100, 2500)), t = ns.reduce((x, y) => x + y, 0);
    return num(t, columnAdd(ns), { q: `${ns.map(C).join(' + ')} = ?`, expr: ns.join('+') });
  }
  if (v === 2) {
    const target = r.pick([100, 500, 1000, 2000, 5000]), x = r.int(1, target / 10 - 1) * 10 + r.pick([0, 5]), y = target - x;
    return mc(r, `${C(x)} and ${C(y)}`, [`${C(x)} and ${C(y + 10)}`, `${C(x + 100)} and ${C(y)}`, `${C(x + 5)} and ${C(y + 5)}`], { q: `Which two numbers add up to ${C(target)}?`, steps: [`Add each pair and check which makes ${C(target)}.`, `${C(x)} + ${C(y)} = ${C(target)}.`] });
  }
  const a = r.int(1, 9), b = r.int(1, 9), p = r.pick([10, 100, 1000]), U = UNITS[String(p).length - 1];
  return num((a + b) * p, [`Start with the fact ${a} + ${b} = ${a + b}.`, `${C(a * p)} + ${C(b * p)} is ${a} ${U} + ${b} ${U}, which is ${a + b} ${U}.`, `So ${C(a * p)} + ${C(b * p)} = ${C((a + b) * p)}.`], { q: `${C(a * p)} + ${C(b * p)} = ?`, expr: `${a * p}+${b * p}` });
});

// ───────────── 6. Subtraction ─────────────
skill('4-subest', 4, 'Subtraction', 'Estimate differences', ['Round each number first, then subtract the round numbers.', 'An estimate tells you about how much.'], (r) => {
  const to = r.pick([10, 100, 1000]), lo = to === 10 ? 11 : to === 100 ? 120 : 1200, hi = to === 10 ? 98 : to === 100 ? 980 : 9800;
  let a = r.int(lo, hi), b = r.int(lo, hi); if (a < b) [a, b] = [b, a];
  let ra = roundTo(a, to); const rb = roundTo(b, to); if (ra === rb) { a += to; ra += to; }
  if (r.bool()) return num(ra - rb, [`${C(a)} rounds to ${C(ra)}. ${C(b)} rounds to ${C(rb)}.`, `Subtract: ${C(ra)} − ${C(rb)} = ${C(ra - rb)}.`, `So the estimate is ${C(ra - rb)}.`], { q: `Estimate ${C(a)} − ${C(b)} by rounding each number to the nearest ${C(to)}.`, expr: `Math.round(${a}/${to})*${to}-Math.round(${b}/${to})*${to}` });
  return num(ra - rb, [`Round each number to the nearest ${C(to)}: ${C(a)} → ${C(ra)} and ${C(b)} → ${C(rb)}.`, `${C(ra)} − ${C(rb)} = ${C(ra - rb)}.`, `So it is about $${C(ra - rb)} more.`], { q: `A school raised $${C(a)} this year and $${C(b)} last year. Rounding each amount to the nearest ${C(to)}, about how many more dollars did it raise this year?`, expr: `Math.round(${a}/${to})*${to}-Math.round(${b}/${to})*${to}` });
});
skill('4-sub4', 4, 'Subtraction', 'Subtract numbers up to four digits', ['Line up the places and start with the ones.', 'If the top digit is too small, regroup from the next place.'], (r) => {
  const v = r.int(0, 2), a = r.int(1100, 9999), b = r.int(r.pick([10, 100, 1000]), a - 1), c = a - b;
  if (v === 0) return num(c, columnSub(a, b), { q: `${C(a)} − ${C(b)} = ?`, expr: `${a}-${b}` });
  if (v === 1) {
    const name = nm(r);
    return num(c, [`We want how many are left, so subtract: ${C(a)} − ${C(b)}.`, ...columnSub(a, b).slice(-2)], { q: r.bool() ? `A theatre has ${C(a)} seats. ${C(b)} seats are sold. How many seats are not sold yet?` : `${name}'s town has ${C(a)} trees. ${C(b)} of them are maples. How many trees are not maples?`, expr: `${a}-${b}` });
  }
  return r.bool() ? num(b, [`The missing number is how much was taken away: ${C(a)} − ${C(c)}.`, `${C(a)} − ${C(c)} = ${C(b)}.`, `Check: ${C(a)} − ${C(b)} = ${C(c)}. So ? = ${C(b)}.`], { q: `${C(a)} − ? = ${C(c)}`, expr: `${a}-${c}` })
    : num(a, [`Undo the subtraction: add ${C(b)} back.`, `${C(c)} + ${C(b)} = ${C(a)}.`, `So ? = ${C(a)}.`], { q: `? − ${C(b)} = ${C(c)}`, expr: `${c}+${b}` });
});
skill('4-subpuzzle', 4, 'Subtraction', 'Subtraction patterns and missing digits', ['If 9 − 4 = 5, then 900 − 400 = 500.', 'To find a missing digit, work out the whole subtraction first.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const a = r.int(3, 18), b = r.int(1, Math.min(9, a - 1)), p = r.pick([10, 100, 1000]), U = UNITS[String(p).length - 1];
    return num((a - b) * p, [`Start with the fact ${a} − ${b} = ${a - b}.`, `These are ${U}, so ${C(a * p)} − ${C(b * p)} = ${a - b} ${U}.`, `So the answer is ${C((a - b) * p)}.`], { q: `${C(a * p)} − ${C(b * p)} = ?`, expr: `${a * p}-${b * p}` });
  }
  if (v === 1) {
    const a = r.int(3000, 9999), b = r.int(100, a - 1000), c = a - b, sc = String(c), k = r.int(0, 3), show = sc.slice(0, k) + '_' + sc.slice(k + 1);
    return num(Number(sc[k]), [`Find the full answer: ${C(a)} − ${C(b)} = ${C(c)}.`, `Match it with ${show}.`, `So the missing digit is ${sc[k]}.`], { q: `Find the missing digit: ${C(a)} − ${C(b)} = ${show}`, expr: `Math.floor(${c}/${10 ** (3 - k)})%10` });
  }
  const diff = r.pick([150, 250, 500, 1000, 1200, 2500]), x = r.int(diff / 50 + 2, 160) * 50, y = x - diff;
  return mc(r, `${C(x)} and ${C(y)}`, [`${C(x)} and ${C(y + 100)}`, `${C(x + 50)} and ${C(y - 50)}`, `${C(x)} and ${C(y - 10)}`], { q: `Which pair has a difference of ${C(diff)}?`, steps: [`Subtract the smaller number from the bigger one in each pair.`, `${C(x)} − ${C(y)} = ${C(diff)}.`] });
});

// ───────────── 7. Understand multiplication ─────────────
skill('4-multmean', 4, 'Understand multiplication', 'Groups, arrays and number lines', ['Equal groups can be written as multiplication: 4 groups of 6 is 4 × 6.', 'An array with 3 rows of 5 is 3 × 5.', 'Adding the same number again and again is multiplying.'], (r) => {
  const v = r.int(0, 3), a = r.int(2, 9), b = r.int(2, 9);
  if (v === 0) {
    const thing = r.pick([['plates', 'cookies'], ['bags', 'marbles'], ['vases', 'flowers'], ['shelves', 'books']]);
    return mc(r, `${a} × ${b}`, [`${a} + ${b}`, `${a} × ${a}`, `${b} + ${b}`, `${b} × ${b + 1}`], { q: `There are ${a} ${thing[0]} with ${b} ${thing[1]} on each. Which expression gives the number of ${thing[1]}?`, steps: [`There are ${a} equal groups of ${b}.`, `${a} groups of ${b} is ${a} × ${b} = ${a * b}.`] });
  }
  if (v === 1) return mc(r, `${a} × ${b} = ${a * b}`, [`${a} + ${b} = ${a + b}`, `${a} × ${b + 1} = ${a * (b + 1)}`, `${a + 1} × ${b} = ${(a + 1) * b}`], { q: 'Which multiplication sentence matches this array?', visual: { type: 'array', rows: a, cols: b }, steps: [`Count the rows: ${a}. Count in each row: ${b}.`, `${a} rows of ${b}: ${a} × ${b} = ${a * b}.`] });
  if (v === 2) return num(a, [`Count how many times ${b} is added: ${a} times.`, `${a} groups of ${b} is ${a} × ${b}.`, `So ? = ${a}.`], { q: `${Array(a).fill(b).join(' + ')} = ? × ${b}`, expr: `${a * b}/${b}` });
  const jumps = Array.from({ length: a }, (_, i) => ({ from: i * b, to: (i + 1) * b, label: `+${b}` }));
  return mc(r, `${a} × ${b} = ${a * b}`, [`${b} + ${a} = ${a + b}`, `${a} × ${b + 1} = ${a * (b + 1)}`, `${a - 1} × ${b} = ${(a - 1) * b}`], { q: 'Which multiplication sentence does the number line show?', visual: numberLine(0, a * b, { step: b, jumps }), steps: [`Each jump is ${b} long and there are ${a} jumps.`, `${a} jumps of ${b} land on ${a * b}: ${a} × ${b} = ${a * b}.`] });
});

skill('4-multsent', 4, 'Understand multiplication', 'Multiplication sentences and repeated addition', ['5 groups of 3 can be written 3 + 3 + 3 + 3 + 3 or 5 × 3.', 'An array with 4 rows of 6 shows 4 × 6.'], (r) => {
  const v = r.int(0, 3), a = r.int(2, 9), b = r.int(2, 9), o = r.pick(OBJ);
  if (v === 0) return num(2 * b, [St('There are 2 equal groups of ' + b + '.', { type: 'groups', groups: [b, b], obj: o }), '2 groups of ' + b + ' is 2 × ' + b + ' = ' + (2 * b) + '.', 'So there are ' + (2 * b) + ' in all.'], { q: 'How many ' + plural(o, 2) + ' are there in all? Write it as 2 × ' + b + '.', visual: { type: 'groups', groups: [b, b], obj: o }, expr: '2*' + b });
  if (v === 1) return mc(r, Array(a).fill(b).join(' + '), [Array(b).fill(a).join(' + ') === Array(a).fill(b).join(' + ') ? a + ' + ' + b : a + ' + ' + b, Array(a + 1).fill(b).join(' + '), Array(Math.max(2, a - 1)).fill(b + 1).join(' + ')], { q: 'Which addition sentence has the same value as ' + a + ' × ' + b + '?', steps: [a + ' × ' + b + ' means ' + a + ' groups of ' + b + '.', 'So add ' + b + ' a total of ' + a + ' times: ' + Array(a).fill(b).join(' + ') + ' = ' + (a * b) + '.'] });
  if (v === 2) return mc(r, a + ' rows of ' + b, [(a + 1) + ' rows of ' + b, a + ' rows of ' + (b + 2), (a + b) + ' rows of 1'], { q: 'Which array shows ' + a + ' × ' + b + '?', steps: [a + ' × ' + b + ' can be ' + a + ' rows with ' + b + ' in each row.', 'So the array is ' + a + ' rows of ' + b + '.'] });
  return num(a * b, [St('Count the rows (' + a + ') and how many in each row (' + b + ').', { type: 'array', rows: a, cols: b }), a + ' × ' + b + ' = ' + (a * b) + '.', 'So there are ' + (a * b) + ' dots.'], { q: 'Write a multiplication sentence for the array. How many dots are there?', visual: { type: 'array', rows: a, cols: b }, expr: a + '*' + b });
});

// ───────────── 8. Multiplication fluency ─────────────
skill('4-multfacts', 4, 'Multiplication facts', 'Facts up to 12 × 12', ['Know your facts up to 12 × 12.', 'A missing factor: 7 × ? = 56 asks "56 ÷ 7".'], (r) => {
  const v = r.int(0, 3), a = r.int(2, 12), b = r.int(2, 12), c = a * b;
  if (v === 0) return num(c, [`Skip count by ${b}, ${a} times: ${multiplesOf(b, a).join(', ')}.`, `So ${a} × ${b} = ${c}.`], { q: `${a} × ${b} = ?`, expr: `${a}*${b}` });
  if (v === 1) return num(b, [`Think: what times ${a} makes ${c}? That is ${c} ÷ ${a}.`, `${a} × ${b} = ${c}, so ? = ${b}.`], { q: r.bool() ? `${a} × ? = ${c}` : `? × ${a} = ${c}`, expr: `${c}/${a}` });
  if (v === 2) {
    const t = r.bool(), shown = t ? c : c + r.pick([-a, a, -1, 1, 2]);
    return TF(r, t, { q: `True or false? ${a} × ${b} = ${shown}`, steps: [`${a} × ${b} = ${c}.`, t ? `${c} matches, so it is true.` : `${shown} is not ${c}, so it is false.`] });
  }
  const pairs = []; for (let x = 2; x <= 12; x++) if (c % x === 0 && c / x <= 12 && c / x >= 2) pairs.push([x, c / x]);
  const [x, y] = r.pick(pairs);
  const wr = [[x, y + 1], [x + 1, y], [x - 1, y + 2], [x + 2, y - 1]].filter(([p, q]) => p * q !== c && p > 0 && q > 0).map(([p, q]) => `${p} and ${q}`);
  return mc(r, `${x} and ${y}`, wr, { q: `Which two factors complete ? × ? = ${c}?`, steps: [`Multiply each pair to test it.`, `${x} × ${y} = ${c}.`] });
});

// ───────────── 9. Factors and multiples ─────────────
const DIVRULE = { 2: 'the ones digit is even', 3: 'the sum of the digits can be divided by 3', 4: 'the last two digits make a number that can be divided by 4', 5: 'the ones digit is 0 or 5', 6: 'it can be divided by both 2 and 3', 9: 'the sum of the digits can be divided by 9', 10: 'the ones digit is 0' };
const digitSum = (n) => String(n).split('').reduce((s, d) => s + Number(d), 0);
const ruleWhy = (n, k) => (k === 3 || k === 9 ? `The digits add to ${digitSum(n)}.` : k === 4 ? `The last two digits make ${n % 100}.` : k === 6 ? `${n} is ${n % 2 ? 'odd' : 'even'} and its digits add to ${digitSum(n)}.` : `The ones digit is ${n % 10}.`);
skill('4-divisible', 4, 'Factors and multiples', 'Divisibility rules', ['A number can be divided by 2 if it is even, by 5 if it ends in 0 or 5, and by 10 if it ends in 0.', 'It can be divided by 3 (or 9) if its digits add to a number you can divide by 3 (or 9).'], (r) => {
  const v = r.int(0, 2), k = r.pick([2, 3, 4, 5, 6, 9, 10]);
  if (v === 0) {
    const n = r.bool() ? k * r.int(20, 999) : r.int(100, 9999), yes = n % k === 0;
    return yesNo(r, yes, { q: `Is ${C(n)} divisible by ${k}?`, steps: [`Rule for ${k}: ${DIVRULE[k]}.`, ruleWhy(n, k), yes ? `So yes, ${C(n)} ÷ ${k} has no remainder.` : `So no, ${C(n)} is not divisible by ${k}.`] });
  }
  if (v === 1) {
    const right = k * r.int(15, 300), wrongs = new Set(); let g = 0; while (wrongs.size < 3 && g++ < 50) { const w = right + r.nonzero(-9, 9); if (w > 0 && w % k) wrongs.add(w); }
    return mc(r, C(right), [...wrongs].map(C), { q: `Which number is divisible by ${k}?`, steps: [`Rule for ${k}: ${DIVRULE[k]}.`, ruleWhy(right, k), `So ${C(right)} is divisible by ${k}.`] });
  }
  const name = nm(r), kk = r.pick([2, 3, 5, 9, 10]), n = r.bool() ? kk * r.int(12, 99) : r.int(30, 900), yes = n % kk === 0;
  return yesNo(r, yes, { q: `${name} has ${n} stickers and wants to share them equally among ${kk} friends with none left over. Can it be done?`, steps: [`We need to know if ${n} is divisible by ${kk}. Rule: ${DIVRULE[kk]}.`, ruleWhy(n, kk), yes ? `Yes: each friend gets ${n / kk}.` : `No: there would be ${n % kk} left over.`] });
});
const factorsOf = (n) => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
const primeFactors = (n) => { const f = []; for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; } return f; };
skill('4-factorpairs', 4, 'Factors and multiples', 'Factor pairs, multiples and prime factors', ['A factor pair is two numbers that multiply to make the number: 3 and 8 for 24.', 'A multiple is what you land on when you skip count.', 'Prime factorization writes a number as primes multiplied together.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const n = r.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 54, 56, 60, 63, 64, 72, 80, 84, 90, 96, 100]);
    const pairs = factorsOf(n).filter((x) => x * x <= n).map((x) => [x, n / x]), [x, y] = r.pick(pairs.filter((p) => p[0] > 1));
    const wr = [[x, y + 1], [x + 1, y], [x + 1, y - 1]].filter(([p, q]) => p * q !== n).map(([p, q]) => `${p} and ${q}`);
    return mc(r, `${x} and ${y}`, wr, { q: `Which is a factor pair of ${n}?`, steps: [`A factor pair multiplies to make ${n}.`, `${x} × ${y} = ${n}, so ${x} and ${y} is a factor pair.`] });
  }
  if (v === 1) {
    const n = r.pick([12, 15, 16, 18, 20, 24, 28, 30, 32, 36, 40, 45, 48, 50, 60]), pairs = factorsOf(n).filter((x) => x * x <= n).map((x) => [x, n / x]);
    return num(pairs.length, [`Try each number from 1 up: ${pairs.map(([p, q]) => `${p} × ${q}`).join(', ')}.`, `After that the pairs repeat, so there are ${pairs.length} factor pairs.`, `The answer is ${pairs.length}.`], { q: `How many factor pairs does ${n} have? (Count 2 × 3 and 3 × 2 as the same pair.)` });
  }
  if (v === 2) {
    const k = r.int(3, 12), right = k * r.int(3, 12), wr = new Set(); let g = 0; while (wr.size < 3 && g++ < 50) { const w = right + r.nonzero(-5, 5); if (w > 0 && w % k) wr.add(w); }
    return mc(r, right, [...wr], { q: `Which number is a multiple of ${k}?`, steps: [`Skip count by ${k}: ${multiplesOf(k, right / k).join(', ')}.`, `${right} = ${k} × ${right / k}, so it is a multiple of ${k}.`] });
  }
  if (v === 3) {
    const n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 72, 75, 80, 84, 90, 100]), pf = primeFactors(n);
    const wr = [`2 × ${n / 2}`, `${pf.slice(0, -2).concat([pf.at(-2) * pf.at(-1)]).join(' × ')}`, `${[...pf, 2].join(' × ')}`, `3 × ${n / 3}`].filter((w) => w !== pf.join(' × ') && !w.includes('.'));
    return mc(r, pf.join(' × '), wr, { q: `Which is the prime factorization of ${n}?`, steps: [`Keep dividing by the smallest prime that works: ${n} = ${pf.join(' × ')}.`, `Every factor must be prime (2, 3, 5, 7, …), and they must multiply to ${n}.`, `So the prime factorization is ${pf.join(' × ')}.`] });
  }
  const n = r.pick([24, 36, 48, 56, 60, 72, 84, 96]), ps = factorsOf(n).filter((x) => x > 1 && x * x < n), x = r.pick(ps), y = n / x;
  return mc(r, `${x} and ${y}`, [`${x} and ${y + 2}`, `${x + 1} and ${y}`, `${x + 2} and ${y - 1}`].filter((w) => { const [p, q] = w.split(' and ').map(Number); return p * q !== n; }), { q: `Which two numbers have a product of ${n}?`, steps: [`Multiply each pair.`, `${x} × ${y} = ${n}.`] });
});

// ───────────── 10. Multiplication ─────────────
skill('4-mult10', 4, 'Multiplication', 'Multiply by 10, 100 and numbers ending in zeros', ['Times 10 puts one zero on the end; times 100 puts two.', 'For 40 × 300: do 4 × 3 = 12, then add the three zeros: 12,000.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(2, 999), p = r.pick([10, 100, 1000]);
    return num(a * p, [`Multiplying by ${C(p)} moves every digit ${String(p).length - 1} place${p === 10 ? '' : 's'} to the left.`, `So write ${String(p).length - 1} zero${p === 10 ? '' : 's'} after ${a}: ${C(a * p)}.`, `${a} × ${C(p)} = ${C(a * p)}.`], { q: `${a} × ${C(p)} = ?`, expr: `${a}*${p}` });
  }
  if (v === 1) {
    const a = r.int(2, 9), b = r.int(2, 9), p = r.pick([10, 100, 1000]);
    return num(a * b * p, [`Start with the fact: ${a} × ${b} = ${a * b}.`, `${C(b * p)} is ${b} × ${C(p)}, so the answer is ${a * b} × ${C(p)}.`, `So ${a} × ${C(b * p)} = ${C(a * b * p)}.`], { q: `${a} × ${b} = ${a * b}. Use this to find ${a} × ${C(b * p)}.`, expr: `${a}*${b * p}` });
  }
  const a = r.int(2, 9) * r.pick([10, 100]), b = r.int(2, 9) * r.pick([10, 100]), sa = String(a), sb = String(b);
  const za = sa.length - sa.replace(/0+$/, '').length, zb = sb.length - sb.replace(/0+$/, '').length, fa = a / 10 ** za, fb = b / 10 ** zb;
  const steps = [`Multiply the front digits: ${fa} × ${fb} = ${fa * fb}.`, `Count the zeros: ${za} + ${zb} = ${za + zb}. Put them on the end.`, `So ${C(a)} × ${C(b)} = ${C(a * b)}.`];
  if (v === 2) return num(a * b, steps, { q: `${C(a)} × ${C(b)} = ?`, expr: `${a}*${b}` });
  const it = r.pick([['A box holds', 'sheets of paper', 'boxes'], ['A crate holds', 'apples', 'crates'], ['A roll has', 'stickers', 'rolls']]);
  return num(a * b, [`Each of the ${a} ${it[2]} has ${b}, so multiply ${a} × ${b}.`, ...steps.slice(1)], { q: `${it[0]} ${C(b)} ${it[1]}. How many ${it[1]} are in ${C(a)} ${it[2]}?`, expr: `${a}*${b}` });
});
skill('4-mult1d', 4, 'Multiplication', 'Multiply by a one-digit number', ['Split the big number by place value and multiply each part.', '6 × 243 = 6 × 200 + 6 × 40 + 6 × 3 = 1,200 + 240 + 18 = 1,458.'], (r) => {
  const v = r.int(0, 3), d = r.int(2, 9);
  if (v === 0) { const n = r.pick([r.int(12, 99), r.int(100, 999), r.int(1000, 4999)]); return num(d * n, columnMul(n, d), { q: `${C(n)} × ${d} = ?`, expr: `${n}*${d}` }); }
  const n = r.int(1, 9) * 100 + r.int(1, 9) * 10 + r.int(1, 9), H = Math.floor(n / 100) * 100, T = Math.floor(n / 10) % 10 * 10, O = n % 10;
  if (v === 1) return num(d * n, [St(`Split ${n} into ${H} + ${T} + ${O} and make an area model.`, areaModel(d, n)), `Multiply each part: ${d} × ${H} = ${C(d * H)}, ${d} × ${T} = ${d * T}, ${d} × ${O} = ${d * O}.`, `Add the parts: ${C(d * H)} + ${d * T} + ${d * O} = ${C(d * n)}.`, `So ${d} × ${n} = ${C(d * n)}.`], { q: `Use an area model to find ${d} × ${n}.`, visual: areaModel(d, n), expr: `${d}*${n}` });
  if (v === 2) return num(T, [`Write ${n} in expanded form: ${H} + ${T} + ${O}.`, `Each part is multiplied by ${d}, so the missing part is the tens part.`, `So ? = ${T}.`], { q: `${d} × ${n} = ${d} × ${H} + ${d} × ? + ${d} × ${O}`, expr: `${n}-${H}-${O}` });
  const q = r.pick([`A ferry carries ${n} people on each trip. How many people does it carry in ${d} trips?`, `A box holds ${n} pencils. How many pencils are in ${d} boxes?`, `A train has ${n} seats. How many seats are on ${d} trains like it?`]);
  return num(d * n, [`Equal groups: ${d} groups of ${n}, so multiply ${d} × ${n}.`, `${d} × ${H} = ${C(d * H)}, ${d} × ${T} = ${d * T}, ${d} × ${O} = ${d * O}. Add: ${C(d * n)}.`, `So the answer is ${C(d * n)}.`], { q, expr: `${d}*${n}` });
});
skill('4-multprop', 4, 'Multiplication', 'Multiplication properties and estimates', ['Order and grouping do not change a product.', 'Times 1 keeps a number the same; times 0 gives 0.', 'Distributive: 6 × 14 = 6 × 10 + 6 × 4.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const a = r.int(2, 12), b = r.int(2, 12), c = r.int(2, 9), P = r.int(0, 4);
    const eq = [`${a} × ${b} = ${b} × ${a}`, `(${a} × ${b}) × ${c} = ${a} × (${b} × ${c})`, `${a} × 1 = ${a}`, `${a} × 0 = 0`, `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c}`][P];
    const names = ['Commutative property', 'Associative property', 'Identity property', 'Zero property', 'Distributive property'];
    const why = ['The order of the factors changed.', 'The grouping (brackets) changed.', 'Multiplying by 1 keeps the number the same.', 'Multiplying by 0 always gives 0.', 'A sum in brackets was multiplied part by part.'][P];
    return mc(r, names[P], names.filter((_, i) => i !== P), { q: `Which property does this show? ${eq}`, steps: [why, `That is the ${names[P].toLowerCase()}.`] });
  }
  if (v === 1) {
    const a = r.int(3, 9), t = r.int(1, 9) * 10, o = r.int(1, 9);
    return num(o, [`Split ${t + o} into ${t} + ${o}.`, `${a} × ${t + o} = ${a} × ${t} + ${a} × ${o}.`, `So ? = ${o}.`], { q: `${a} × ${t + o} = ${a} × ${t} + ${a} × ?`, expr: `${t + o}-${t}` });
  }
  if (v === 2) {
    const [x, y] = r.pick([[2, 5], [4, 25], [5, 20], [2, 50], [4, 5]]), z = r.int(3, 19), arr = r.shuffle([x, y, z]);
    return num(x * y * z, [`Group the friendly pair first: ${x} × ${y} = ${x * y}.`, `Then ${x * y} × ${z} = ${C(x * y * z)}.`, `So ${arr.join(' × ')} = ${C(x * y * z)}.`], { q: `${arr.join(' × ')} = ?`, expr: arr.join('*') });
  }
  if (v === 3) {
    const n = r.int(101, 999), d = r.int(2, 9), p = n * d, t = roundTo(p, 100) + r.pick([0, 100, -100]);
    const s = p > t ? '>' : p < t ? '<' : '=';
    return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `${n} × ${d} ? ${C(t)}`, say: `Which sign goes between ${n} times ${d} and ${C(t)}?`, steps: [`Work out the product: ${n} × ${d} = ${C(p)}.`, `${C(p)} ${s} ${C(t)}.`] });
  }
  let n = r.int(110, 980); while (n % 100 >= 40 && n % 100 <= 60) n = r.int(110, 980);
  const d = r.int(3, 9), rn = roundTo(n, 100);
  return num(d * rn, [`Round ${n} to the nearest hundred: ${rn}.`, `${d} × ${rn} = ${C(d * rn)}.`, `So ${d} × ${n} is about ${C(d * rn)}.`], { q: `Estimate ${d} × ${n} by rounding ${n} to the nearest hundred.`, expr: `${d}*Math.round(${n}/100)*100` });
});

// ───────────── 11. Multiplicative relationships ─────────────
skill('4-timesas', 4, 'Multiplicative comparison', 'Times as many and unit rates', ['"5 times as many as 4" means 5 × 4 = 20.', 'A unit rate is the amount for one: 3 for $12 is $4 each.'], (r) => {
  const v = r.int(0, 4), k = r.int(2, 9), b = r.int(2, 12), name = nm(r); let name2 = nm(r); while (name2 === name) name2 = nm(r);
  if (v === 0) return num(k * b, [`${k} times as many as ${b} means ${k} × ${b}.`, `${k} × ${b} = ${k * b}.`, `So ${name2} has ${k * b} stamps.`], { q: `${name} has ${b} stamps. ${name2} has ${k} times as many. How many stamps does ${name2} have?`, expr: `${k}*${b}` });
  if (v === 1) return num(b, [`${k * b} is ${k} times some number: ${k} × ? = ${k * b}.`, `${k * b} ÷ ${k} = ${b}.`, `So the number is ${b}.`], { q: `${k * b} is ${k} times as many as what number?`, expr: `${k * b}/${k}` });
  if (v === 2) return num(k, [`How many times does ${b} fit into ${k * b}?`, `${k * b} ÷ ${b} = ${k}.`, `So it is ${k} times as many.`], { q: `A tree is ${k * b} m tall. A shed is ${b} m tall. The tree is how many times as tall as the shed?`, expr: `${k * b}/${b}` });
  if (v === 3) return num(b, [`The cost for one is the total ÷ the number of items.`, `$${k * b} ÷ ${k} = $${b}.`, `So one notebook costs $${b}.`], { q: `${k} notebooks cost $${k * b} in all. Each costs the same. How much does one notebook cost, in dollars?`, expr: `${k * b}/${k}` });
  const sp = r.pick([40, 50, 60, 70, 80, 90, 100]), h = r.int(2, 6);
  return num(sp * h, [`In 1 hour the car goes ${sp} km.`, `In ${h} hours it goes ${h} × ${sp} = ${sp * h} km.`, `So the answer is ${sp * h} km.`], { q: `A car drives ${sp} km each hour. At the same speed, how many kilometres does it go in ${h} hours?`, expr: `${sp}*${h}` });
});

// ───────────── 12. Understand division ─────────────
skill('4-divmean', 4, 'Understand division', 'Sharing, arrays and division strategies', ['Division shares into equal groups: 24 ÷ 4 = 6.', 'Every division has a matching multiplication: 4 × 6 = 24.', 'Split a big number to divide: 84 ÷ 4 = 80 ÷ 4 + 4 ÷ 4 = 21.'], (r) => {
  const v = r.int(0, 5), a = r.int(2, 9), b = r.int(2, 9), t = a * b;
  if (v === 0) {
    const [it, box] = r.pick([['cookies', 'plates'], ['pencils', 'cups'], ['marbles', 'bags'], ['stickers', 'pages']]);
    return mc(r, `${t} ÷ ${a} = ${b}`, [`${t} − ${a} = ${t - a}`, `${t} ÷ ${a} = ${b + 1}`, `${t} + ${a} = ${t + a}`], { q: `${t} ${it} are shared equally onto ${a} ${box}. Which division sentence tells how many go on each?`, steps: [`Share ${t} into ${a} equal groups: ${t} ÷ ${a}.`, `${a} × ${b} = ${t}, so ${t} ÷ ${a} = ${b}.`] });
  }
  if (v === 1) return mc(r, `${t} ÷ ${b} = ${a}`, [`${t} ÷ ${b} = ${a + 1}`, `${t} − ${b} = ${t - b}`, `${t} ÷ ${b} = ${b}`], { q: `These ${t} counters are in rows of ${b}. Which division sentence tells how many rows there are?`, visual: { type: 'array', rows: a, cols: b }, steps: [`There are ${t} counters with ${b} in each row: ${t} ÷ ${b}.`, `Count the rows: ${a}. So ${t} ÷ ${b} = ${a}.`] });
  if (v === 2) return num(a, [`Division undoes multiplication.`, `${a} × ${b} = ${t}, so ${t} ÷ ${b} = ${a}.`], { q: `${a} × ${b} = ${t}. So ${t} ÷ ${b} = ?`, expr: `${t}/${b}` });
  if (v === 3) {
    const jumps = Array.from({ length: a }, (_, i) => ({ from: t - i * b, to: t - (i + 1) * b, label: `−${b}` }));
    return num(a, [St(`Start at ${t} and jump back ${b} each time until you reach 0.`, numberLine(0, t, { step: b, jumps })), `Count the jumps: ${a}.`, `So ${t} ÷ ${b} = ${a}.`], { q: `Start at ${t} and keep subtracting ${b}. How many times can you subtract ${b} before you reach 0?`, expr: `${t}/${b}` });
  }
  const d = r.int(2, 9), q = r.int(11, 39), T = Math.floor(q / 10) * 10, O = q % 10, n = d * q;
  if (v === 4 || O === 0) return num(q, [`Split ${n} into parts ${d} divides easily: ${d * T} + ${d * O}.`, `${d * T} ÷ ${d} = ${T} and ${d * O} ÷ ${d} = ${O}.`, `Add: ${T} + ${O} = ${q}. So ${n} ÷ ${d} = ${q}.`], { q: `Use the distributive property: ${n} ÷ ${d} = ?`, expr: `${n}/${d}` });
  return num(q, [`Area = side × side, so the missing side is ${n} ÷ ${d}.`, `Split the rectangle: ${d * T} ÷ ${d} = ${T} and ${d * O} ÷ ${d} = ${O}.`, `${T} + ${O} = ${q}, so the other side is ${q} units.`], { q: `A rectangle has an area of ${n} square units. One side is ${d} units long. How long is the other side?`, visual: { type: 'area', a: [d], b: [T, O] }, expr: `${n}/${d}` });
});

skill('4-divrelate', 4, 'Understand division', 'Relate multiplication and division', ['Multiplication and division are opposites.', 'From 6 × 7 = 42 we also know 42 ÷ 6 = 7 and 42 ÷ 7 = 6.'], (r) => {
  const v = r.int(0, 3), a = r.int(2, 12), b = r.int(2, 12), c = a * b;
  if (v === 0) return mc(r, a + ' × ' + b + ' = ' + c, [a + ' + ' + b + ' = ' + (a + b), (a + 1) + ' × ' + b + ' = ' + (c + b), c + ' − ' + a + ' = ' + (c - a)], { q: 'Which fact helps you solve ' + c + ' ÷ ' + a + '?', steps: ['Division undoes multiplication.', a + ' × ' + b + ' = ' + c + ', so ' + c + ' ÷ ' + a + ' = ' + b + '.'] });
  if (v === 1) return num(b, ['In a fact family the same three numbers are used: ' + a + ', ' + b + ', ' + c + '.', c + ' ÷ ' + a + ' = ' + b + '.', 'So ? = ' + b + '.'], { q: 'If ' + a + ' × ' + b + ' = ' + c + ', then ' + c + ' ÷ ' + a + ' = ?', expr: c + '/' + a });
  if (v === 2) { const n = r.int(2, 6), m = r.int(2, 6); return num(m, [St('Make ' + n + ' equal rows from the ' + (n * m) + ' counters.', { type: 'array', rows: n, cols: m }), 'Each row has ' + m + '.', 'So ' + (n * m) + ' ÷ ' + n + ' = ' + m + '.'], { q: (n * m) + ' counters are put into ' + n + ' equal rows. How many are in each row?', visual: { type: 'array', rows: n, cols: m }, expr: (n * m) + '/' + n }); }
  return mc(r, c + ' ÷ ' + b + ' = ' + a, [c + ' ÷ ' + b + ' = ' + (a + 1), b + ' ÷ ' + c + ' = ' + a, c + ' × ' + b + ' = ' + a], { q: 'Which is in the same fact family as ' + a + ' × ' + b + ' = ' + c + '?', steps: ['A fact family uses the same three numbers.', c + ' ÷ ' + b + ' = ' + a + ' is true and uses ' + a + ', ' + b + ' and ' + c + '.'] });
});

// ───────────── 13. Division fluency ─────────────
skill('4-divfacts', 4, 'Division facts', 'Division facts up to 12', ['Use multiplication facts to divide: 63 ÷ 7 = 9 because 7 × 9 = 63.', 'A missing number: ? ÷ 4 = 6 means 4 × 6.'], (r) => {
  const v = r.int(0, 4), a = r.int(2, 12), b = r.int(2, 12), c = a * b;
  if (v === 0) return num(b, [`Think: ${a} × ? = ${c}.`, `${a} × ${b} = ${c}, so ${c} ÷ ${a} = ${b}.`], { q: `${c} ÷ ${a} = ?`, expr: `${c}/${a}` });
  if (v === 1) return r.bool() ? num(c, [`Undo the division: multiply.`, `${a} × ${b} = ${c}, so ? = ${c}.`], { q: `? ÷ ${a} = ${b}`, expr: `${a}*${b}` }) : num(a, [`Think: ${b} × ? = ${c}.`, `${b} × ${a} = ${c}, so ? = ${a}.`], { q: `${c} ÷ ? = ${b}`, expr: `${c}/${b}` });
  if (v === 2) {
    const t = r.bool(), shown = t ? b : b + r.pick([-1, 1, 2]);
    return TF(r, t, { q: `True or false? ${c} ÷ ${a} = ${shown}`, steps: [`${a} × ${b} = ${c}, so ${c} ÷ ${a} = ${b}.`, t ? 'It matches, so it is true.' : `${shown} is not ${b}, so it is false.`] });
  }
  if (v === 3) {
    const name = nm(r);
    return num(b, [`Share ${c} equally into ${a} groups: ${c} ÷ ${a}.`, `${c} ÷ ${a} = ${b}, so each team gets ${b}.`], { q: `${name}'s coach has ${c} pinnies to share equally among ${a} teams. How many pinnies does each team get?`, expr: `${c}/${a}` });
  }
  const wr = [[c, a + 1], [c + a, a], [c, b + 1]].filter(([x, y]) => x / y !== b).map(([x, y]) => `${x} and ${y}`);
  return mc(r, `${c} and ${a}`, wr, { q: `Which numbers make ? ÷ ? = ${b} true?`, steps: [`Test each pair by dividing.`, `${c} ÷ ${a} = ${b}.`] });
});

skill('4-divfacts2', 4, 'Division facts', 'Division sentences and quotients', ['Both sides of = must have the same value.', 'To check 36 ÷ 4 = 18 ÷ 2, work out each side: 9 and 9.'], (r) => {
  const v = r.int(0, 2), q = r.int(2, 12), a = r.int(2, 12); let b = r.int(2, 12); while (b === a) b = r.int(2, 12);
  if (v === 0) { const t = r.bool(), q2 = t ? q : q + r.pick([-1, 1]); return TF(r, t, { q: 'True or false? ' + (a * q) + ' ÷ ' + a + ' = ' + (b * q2) + ' ÷ ' + b, steps: ['Left: ' + (a * q) + ' ÷ ' + a + ' = ' + q + '. Right: ' + (b * q2) + ' ÷ ' + b + ' = ' + q2 + '.', t ? 'Both sides are ' + q + ', so it is true.' : q + ' is not ' + q2 + ', so it is false.'] }); }
  if (v === 1) { const wr = [[a * q + 1, a], [a * q, a + 1], [a * (q + 1), a + 2]].filter(([x, y]) => x % y || x / y !== q).map(([x, y]) => x + ' ÷ ' + y); return mc(r, (a * q) + ' ÷ ' + a, wr, { q: 'Which division has a quotient of ' + q + '?', steps: ['Divide each one.', (a * q) + ' ÷ ' + a + ' = ' + q + '.'] }); }
  const name = nm(r);
  return num(q, ['Equal groups of ' + a + ': divide ' + (a * q) + ' by ' + a + '.', (a * q) + ' ÷ ' + a + ' = ' + q + '.', 'So ' + name + ' fills ' + q + ' bags.'], { q: name + ' has ' + (a * q) + ' oranges and puts ' + a + ' in each bag. How many bags does ' + name + ' fill?', expr: (a * q) + '/' + a });
});

// ───────────── 14. Division ─────────────
skill('4-divzero', 4, 'Division', 'Division patterns and estimates', ['If 24 ÷ 6 = 4, then 2,400 ÷ 6 = 400.', 'To estimate, change the number to a close one that divides easily.'], (r) => {
  const v = r.int(0, 3), b = r.int(2, 9), q = r.int(2, 9), a = b * q;
  if (v === 0) {
    const p = r.pick([10, 100]);
    return num(q * p, [`Start with the fact ${a} ÷ ${b} = ${q}.`, `${C(a * p)} is ${a} ${p === 10 ? 'tens' : 'hundreds'}, so the answer is ${q} ${p === 10 ? 'tens' : 'hundreds'}.`, `So ${C(a * p)} ÷ ${b} = ${C(q * p)}.`], { q: `${C(a * p)} ÷ ${b} = ?`, expr: `${a * p}/${b}` });
  }
  if (v === 1) return num(q * 10, [`Cross one zero off each number: ${C(a * 100)} ÷ ${b * 10} is the same as ${a * 10} ÷ ${b}.`, `${a} ÷ ${b} = ${q}, so ${a * 10} ÷ ${b} = ${q * 10}.`, `So ${C(a * 100)} ÷ ${b * 10} = ${q * 10}.`], { q: `${C(a * 100)} ÷ ${b * 10} = ?`, expr: `${a * 100}/${b * 10}` });
  const d = r.int(3, 9), q0 = r.int(2, 9) * 10, n = d * q0 + r.nonzero(-d, d);
  const steps = [`${n} is close to ${d * q0}, which is easy to divide by ${d}.`, `${d * q0} ÷ ${d} = ${q0}.`, `So the answer is about ${q0}.`];
  if (v === 2) return mc(r, q0, [q0 + 10, q0 - 10, q0 * 10], { q: `Use compatible numbers to estimate ${n} ÷ ${d}.`, steps });
  return mc(r, q0, [q0 + 10, q0 - 10, q0 * 10], { q: `${nm(r)} has ${n} beads to share equally into ${d} jars. About how many beads go in each jar?`, steps });
});
skill('4-div3', 4, 'Division', 'Divide 2- and 3-digit numbers', ['Divide one place at a time from the left: divide, multiply, subtract, bring down.', 'In a story, decide what the remainder means: round up, drop it, or give it as the answer.'], (r) => {
  const v = r.int(0, 4), d = r.int(2, 9), q = r.int(12, Math.floor(999 / d)), n = d * q;
  if (v === 0) return num(q, longDivision(n, d), { q: `${n} ÷ ${d} = ?`, expr: `${n}/${d}` });
  if (v === 1) {
    const [it, box] = r.pick([['books', 'shelves'], ['apples', 'baskets'], ['chairs', 'rows'], ['cards', 'piles']]);
    return num(q, [`Equal sharing, so divide: ${n} ÷ ${d}.`, ...longDivision(n, d).slice(-2)], { q: `${n} ${it} are put equally into ${d} ${box}. How many ${it} are in each?`, expr: `${n}/${d}` });
  }
  if (v === 2) {
    const k = r.int(4, 9), qq = r.int(5, 40), rem = r.int(1, k - 1), m = k * qq + rem, ask = r.int(0, 2);
    const stories = [[`${m} students are going on a trip. Each van holds ${k} students. How many vans are needed?`, `${qq} vans are full and ${rem} students still need a seat, so we need one more van.`, qq + 1],
      [`${m} eggs are packed into cartons of ${k}. How many cartons can be filled?`, `Only full cartons count, so the ${rem} extra eggs are left out.`, qq],
      [`${m} stickers are shared equally among ${k} friends. How many stickers are left over?`, `Each friend gets ${qq}, and the remainder is what is left over.`, rem]][ask];
    return num(stories[2], [`${m} ÷ ${k} = ${qq} R ${rem}.`, stories[1], `So the answer is ${stories[2]}.`], { q: stories[0], expr: ['Math.ceil', 'Math.floor', ''][ask] ? `${['Math.ceil', 'Math.floor'][ask]}(${m}/${k})` : `${m}%${k}` });
  }
  if (v === 3) {
    const t = q + r.pick([-5, -2, 0, 3, 6]), s = q > t ? '>' : q < t ? '<' : '=';
    return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `${n} ÷ ${d} ? ${t}`, say: `Which sign goes between ${n} divided by ${d} and ${t}?`, steps: [`Work out the division: ${n} ÷ ${d} = ${q}.`, `${q} ${s} ${t}.`] });
  }
  const ins = [q, ...Array.from({ length: 3 }, () => r.int(12, Math.floor(999 / d)))].map((x) => x * d), k = r.int(0, 3);
  const rows = ins.map((x, i) => [x, i === k ? '?' : x / d]);
  return num(ins[k] / d, [`Each number in the second column is the first number ÷ ${d}.`, `${ins[k]} ÷ ${d} = ${ins[k] / d}.`, `So the missing number is ${ins[k] / d}.`], { q: `Complete the table. What number goes where the ? is?`, visual: { type: 'table', head: ['Number', `÷ ${d}`], rows }, expr: `${ins[k]}/${d}` });
});

// ───────────── 15. Mixed operations ─────────────
skill('4-mixedops', 4, 'Mixed operations', 'All four operations', ['Choose the operation that matches the words.', 'Undo an operation to find a missing number: + and − undo each other, × and ÷ undo each other.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const big = r.int(10, 60), small = r.int(2, big - 1), S = big + small, D = big - small, askBig = r.bool();
    return num(askBig ? big : small, [`Add the sum and the difference: ${S} + ${D} = ${S + D}. That is two of the bigger number.`, `Bigger: ${S + D} ÷ 2 = ${big}. Smaller: ${S} − ${big} = ${small}.`, `So the ${askBig ? 'bigger' : 'smaller'} number is ${askBig ? big : small}.`], { q: `Two numbers have a sum of ${S} and a difference of ${D}. What is the ${askBig ? 'bigger' : 'smaller'} number?`, expr: askBig ? `(${S}+${D})/2` : `(${S}-${D})/2` });
  }
  if (v === 1) {
    const op = r.pick(['+', '−', '×', '÷']), a = r.int(2, 12), b = r.int(2, 12);
    if (op === '+') { const x = a * 7, y = b * 9; return num(y, [`Missing part = total − known part.`, `${x + y} − ${x} = ${y}, so ? = ${y}.`], { q: `${x} + ? = ${x + y}`, expr: `${x + y}-${x}` }); }
    if (op === '−') { const x = a * 9 + b * 5, y = b * 5; return num(x, [`Undo the subtraction by adding.`, `${x - y} + ${y} = ${x}, so ? = ${x}.`], { q: `? − ${y} = ${x - y}`, expr: `${x - y}+${y}` }); }
    if (op === '×') return num(b, [`Divide to undo the multiplication.`, `${a * b} ÷ ${a} = ${b}, so ? = ${b}.`], { q: `${a} × ? = ${a * b}`, expr: `${a * b}/${a}` });
    return num(a, [`Think: ${b} × ? = ${a * b}.`, `${b} × ${a} = ${a * b}, so ? = ${a}.`], { q: `${a * b} ÷ ? = ${b}`, expr: `${a * b}/${b}` });
  }
  if (v === 2) {
    const a = r.int(20, 90), b = r.int(2, 9), P = r.int(0, 4);
    const phrase = [`the sum of ${a} and ${b}`, `${b} less than ${a}`, `${a} groups of ${b}`, `${a * b} shared equally into ${b} groups`, `subtract ${b} from ${a}`][P];
    const right = [`${a} + ${b}`, `${a} − ${b}`, `${a} × ${b}`, `${a * b} ÷ ${b}`, `${a} − ${b}`][P];
    const wrongs = P === 3 ? [`${a * b} − ${b}`, `${a * b} × ${b}`, `${b} ÷ ${a * b}`] : [`${a} + ${b}`, `${a} − ${b}`, `${b} − ${a}`, `${a} × ${b}`, `${a} ÷ ${b}`].filter((x) => x !== right);
    return mc(r, right, r.shuffle(wrongs).slice(0, 3), { q: `Which expression means "${phrase}"?`, steps: [['"Sum" means add.', '"Less than" means subtract, starting from the bigger amount.', '"Groups of" means multiply.', '"Shared equally" means divide.', '"Subtract b from a" starts with a.'][P].replace('b from a', `${b} from ${a}`).replace('starts with a', `starts with ${a}`), `So the expression is ${right}.`] });
  }
  if (v === 3) {
    const a = r.int(11, 89), b = r.int(11, 89), add = r.bool() || a < b, ans = add ? (a + b) * 100 : (a - b) * 100;
    return num(ans, [`Think in hundreds: ${a} hundreds ${add ? '+' : '−'} ${b} hundreds.`, `${a} ${add ? '+' : '−'} ${b} = ${add ? a + b : a - b}, so the answer is ${add ? a + b : a - b} hundreds.`, `So the answer is ${C(ans)}.`], { q: `Work it out in your head: ${C(a * 100)} ${add ? '+' : '−'} ${C(b * 100)} = ?`, expr: `${a * 100}${add ? '+' : '-'}${b * 100}` });
  }
  const a = r.int(3, 12), b = r.int(3, 12), L = a * b, c = r.int(10, 99), R = L + r.pick([-3, 0, 4]) , d = R + c;
  const s = L > R ? '>' : L < R ? '<' : '=';
  return mc(r, s, ['>', '<', '='].filter((x) => x !== s), { q: `${a} × ${b} ? ${d} − ${c}`, say: `Which sign goes between ${a} times ${b} and ${d} minus ${c}?`, steps: [`Left side: ${a} × ${b} = ${L}. Right side: ${d} − ${c} = ${R}.`, `${L} ${s} ${R}, so the sign is ${s}.`] });
});

skill('4-mixedfacts', 4, 'Mixed operations', 'Facts and number puzzles', ['× and ÷ facts come in families: 6 × 8 = 48, 48 ÷ 6 = 8.', 'To find two numbers from clues, guess, check and adjust.'], (r) => {
  const v = r.int(0, 2), a = r.int(2, 12), b = r.int(2, 12);
  if (v === 0) { const t = r.bool(), L = a * b, k = r.pick([2, 3, 4]), R = t ? L : L + k; return TF(r, t, { q: 'True or false? ' + a + ' × ' + b + ' = ' + (R * k) + ' ÷ ' + k, steps: ['Left: ' + a + ' × ' + b + ' = ' + L + '. Right: ' + (R * k) + ' ÷ ' + k + ' = ' + R + '.', t ? 'Both are ' + L + ', so it is true.' : L + ' is not ' + R + ', so it is false.'] }); }
  if (v === 1) { const s = r.int(2, 9), k = r.int(2, 6), big = s * k; return num(big, ['The bigger number is ' + k + ' times the smaller: try smaller = ' + s + ', bigger = ' + big + '.', 'Check: ' + big + ' × ' + s + ' = ' + (big * s) + ' and ' + big + ' ÷ ' + s + ' = ' + k + '. It works.', 'So the bigger number is ' + big + '.'], { q: 'Two numbers have a product of ' + (big * s) + '. When you divide the bigger by the smaller you get ' + k + '. What is the bigger number?', expr: big }); }
  const op = r.pick(['×', '÷']), right = op === '×' ? a + ' and ' + b : (a * b) + ' and ' + a, val = op === '×' ? a * b : b;
  const wr = op === '×' ? [a + ' and ' + (b + 1), (a + 1) + ' and ' + b, (a + b) + ' and 1'].filter((w) => { const [x, y] = w.split(' and ').map(Number); return x * y !== val; }) : [(a * b) + ' and ' + (a + 1), (a * b + a) + ' and ' + (b + 2), (a * b) + ' and ' + b].filter((w) => { const [x, y] = w.split(' and ').map(Number); return x / y !== val; });
  return mc(r, right, wr, { q: 'Which two numbers have a ' + (op === '×' ? 'product' : 'quotient') + ' of ' + val + '?', steps: [op === '×' ? 'Multiply each pair.' : 'Divide the first number by the second in each pair.', right.replace(' and ', ' ' + op + ' ') + ' = ' + val + '.'] });
});

// ───────────── 16. Mixed operations: word problems ─────────────
skill('4-wordmulti', 4, 'Word problems', 'Multi-step word problems', ['Find what the question asks, then plan the steps.', 'Do one step at a time and check your answer makes sense.'], (r) => {
  const v = r.int(0, 4), name = nm(r);
  if (v === 0) {
    const p = r.int(3, 9), k = r.int(6, 12), g = r.int(2, p * k - 5);
    return num(p * k - g, [`First find how many in all: ${p} × ${k} = ${p * k}.`, `Then take away the ones given out: ${p * k} − ${g} = ${p * k - g}.`, `So ${p * k - g} juice boxes are left.`], { q: `${name} buys ${p} packs of juice boxes with ${k} in each pack. ${name} hands out ${g} at a picnic. How many juice boxes are left?`, expr: `${p}*${k}-${g}` });
  }
  if (v === 1) {
    const S = r.pick([50, 75, 100, 120]), x = r.int(8, 30), y = r.int(5, S - x - 5);
    return num(S - x - y, [`Add what was spent: $${x} + $${y} = $${x + y}.`, `Subtract from the start: $${S} − $${x + y} = $${S - x - y}.`, `So ${name} has $${S - x - y} left.`], { q: `${name} has $${S}. ${name} spends $${x} on a book and $${y} on a game. How many dollars are left?`, expr: `${S}-${x}-${y}` });
  }
  if (v === 2) {
    const cap = r.pick([20, 24, 30, 40, 48]), s = r.int(60, 230), t = r.int(4, 12), tot = s + t, buses = Math.ceil(tot / cap);
    return num(buses, [`Find the number of people: ${s} + ${t} = ${tot}.`, `${tot} ÷ ${cap} = ${Math.floor(tot / cap)}${tot % cap ? ` R ${tot % cap}. The extra people need one more bus` : ' exactly'}.`, `So they need ${buses} buses.`], { q: `${s} students and ${t} teachers are going to a museum. Each bus holds ${cap} people. How many buses are needed?`, expr: `Math.ceil(${tot}/${cap})` });
  }
  if (v === 3) {
    const c = r.int(3, 6), n = r.int(40, 150), G = c * n + r.int(20, 200);
    return num(G - c * n, [`Cans collected so far: ${c} × ${n} = ${c * n}.`, `Still needed: ${G} − ${c * n} = ${G - c * n}.`, `So they need ${G - c * n} more cans.`], { q: `${c} classes each collected ${n} cans for the food bank. Their goal is ${G} cans. How many more cans do they need?`, expr: `${G}-${c}*${n}` });
  }
  const a = r.int(12, 35), b = r.int(4, 9), c = r.int(5, 40);
  return num(a * b + c, [`Pages in the first ${b} days: ${a} × ${b} = ${a * b}.`, `Add the extra pages: ${a * b} + ${c} = ${a * b + c}.`, `So ${name} read ${a * b + c} pages.`], { q: `${name} reads ${a} pages each day for ${b} days. Then ${name} reads ${c} more pages on the weekend. How many pages is that in all?`, expr: `${a}*${b}+${c}` });
});
skill('4-wordest', 4, 'Word problems', 'Estimates, extra facts and guess-and-check', ['Estimate to check if an answer is reasonable.', 'Some facts in a story are not needed. Cross them out.', 'Guess, check, then make a better guess.'], (r) => {
  const v = r.int(0, 3), name = nm(r);
  if (v === 0) {
    const d = r.int(3, 9), n = r.int(110, 890), e = d * roundTo(n, 100);
    return mc(r, C(e), [C(e / 10), C(e * 10), C(roundTo(n, 100) + d)], { q: `A school orders ${d} boxes with ${n} pencils in each. Which is the most reasonable estimate of the number of pencils?`, steps: [`Round ${n} to ${roundTo(n, 100)}.`, `${d} × ${roundTo(n, 100)} = ${C(e)}, so about ${C(e)}.`] });
  }
  if (v === 1) {
    const k = r.int(2, 6), p = r.int(3, 15), age = r.int(8, 11), extra = r.pick([`${name} is ${age} years old.`, `The store opens at 9 a.m.`, `${name}'s friend has ${age} books.`]);
    return mc(r, extra, [`${name} buys ${k} books.`, `Each book costs $${p}.`], { q: `${name} buys ${k} books. Each book costs $${p}. ${extra} How much does ${name} spend? Which fact is NOT needed to answer?`, steps: [`To find the cost you need the number of books and the price: ${k} × $${p} = $${k * p}.`, `"${extra}" does not help, so it is not needed.`] });
  }
  if (v === 2) {
    const A = r.pick([5, 6, 7, 8]), Cc = r.pick([2, 3, 4]), tot = r.int(6, 12), adults = r.int(1, tot - 1), cost = A * adults + Cc * (tot - adults);
    return num(adults, [`Guess and check: try a number of adult tickets and work out the cost.`, `${adults} adults × $${A} = $${A * adults} and ${tot - adults} children × $${Cc} = $${Cc * (tot - adults)}. Total $${cost}. It works.`, `So ${adults} adult tickets were bought.`], { q: `Adult tickets cost $${A} and child tickets cost $${Cc}. A family buys ${tot} tickets for $${cost}. How many adult tickets did they buy?`, expr: `(${cost}-${Cc}*${tot})/(${A}-${Cc})` });
  }
  const a = r.int(2, 12); let b = r.int(2, 12); while (b === a) b = r.int(2, 12);
  const big = Math.max(a, b), small = Math.min(a, b);
  return num(big, [`Guess pairs that add to ${a + b} and check their product.`, `${big} + ${small} = ${a + b} and ${big} × ${small} = ${a * b}. It works.`, `So the bigger number is ${big}.`], { q: `Two numbers add to ${a + b}. When you multiply them you get ${a * b}. What is the bigger number?`, expr: `Math.max(${a},${b})` });
});

// ───────────── 17. Variable expressions ─────────────
skill('4-varexpr', 4, 'Variable expressions', 'Write expressions with a letter', ['A letter, like n, stands for a number we do not know.', '"5 more than n" is n + 5. "4 times n" is 4 × n.'], (r) => {
  const v = r.int(0, 3), k = r.int(2, 12), name = nm(r);
  if (v === 0) {
    const P = r.int(0, 3), phrase = [`${k} more than n`, `${k} less than n`, `${k} times n`, `n divided by ${k}`][P], forms = [`n + ${k}`, `n − ${k}`, `${k} × n`, `n ÷ ${k}`];
    return mc(r, forms[P], [...forms.filter((_, i) => i !== P), `${k} − n`].slice(0, 3), { q: `Which expression means "${phrase}"?`, steps: [['"More than" means add.', '"Less than n" means start with n and subtract.', '"Times" means multiply.', '"Divided by" means divide.'][P], `So it is ${forms[P]}.`] });
  }
  if (v === 1) {
    const P = r.int(0, 3);
    const q = [`Each box holds ${k} pencils. Which expression shows the number of pencils in b boxes?`, `${name} is ${k} cm taller than a friend who is h cm tall. Which expression shows ${name}'s height?`, `${name} shares c cookies equally among ${k} friends. Which expression shows how many each friend gets?`, `${name} had m dollars and spent $${k}. Which expression shows how much is left?`][P];
    const right = [`${k} × b`, `h + ${k}`, `c ÷ ${k}`, `m − ${k}`][P], wr = [[`b + ${k}`, `b ÷ ${k}`, `${k} − b`], [`h − ${k}`, `${k} × h`, `${k} − h`], [`c × ${k}`, `${k} ÷ c`, `c − ${k}`], [`m + ${k}`, `${k} − m`, `${k} × m`]][P];
    return mc(r, right, wr, { q, steps: [['Equal boxes means multiply.', 'Taller means add.', 'Sharing equally means divide.', 'Spending means subtract.'][P], `So the expression is ${right}.`] });
  }
  if (v === 2) {
    const x = r.int(3, 12), t = k * x;
    if (r.bool()) return mc(r, `s + ${k} = ${t + k}`, [`s − ${k} = ${t + k}`, `${k} × s = ${t + k}`, `s = ${t + k} + ${k}`], { q: `${name} had s stickers. After getting ${k} more, ${name} has ${t + k}. Which equation fits the story?`, steps: [`Start with s and add ${k}.`, `The result is ${t + k}: s + ${k} = ${t + k}.`] });
    return mc(r, `${k} × x = ${t}`, [`${k} + x = ${t}`, `x ÷ ${k} = ${t}`, `x − ${k} = ${t}`], { q: `${k} bags each hold x marbles. There are ${t} marbles in all. Which equation fits the story?`, steps: [`${k} equal bags of x is ${k} × x.`, `That makes ${t}: ${k} × x = ${t}.`] });
  }
  const n = r.int(2, 12), c = r.int(1, 20);
  return num(k * n + c, [`Put ${n} in place of n: ${k} × ${n} + ${c}.`, `Multiply first: ${k} × ${n} = ${k * n}. Then add: ${k * n} + ${c} = ${k * n + c}.`, `So the value is ${k * n + c}.`], { q: `What is ${k} × n + ${c} when n = ${n}?`, expr: `${k}*${n}+${c}` });
});
skill('4-vareq', 4, 'Variable expressions', 'Solve equations', ['Do the opposite operation to get the letter alone.', 'x + 7 = 15: subtract 7, so x = 8. 4 × x = 28: divide by 4, so x = 7.'], (r) => {
  const v = r.int(0, 3), x = r.int(2, 12), k = r.int(2, 12), L = r.pick(['x', 'n', 'y', 'm']);
  const eq = [`${L} + ${k * 3} = ${x + k * 3}`, `${L} − ${k} = ${x}`, `${k} × ${L} = ${k * x}`, `${L} ÷ ${k} = ${x}`][v];
  const how = [`subtract ${k * 3} from both sides`, `add ${k} to both sides`, `divide both sides by ${k}`, `multiply both sides by ${k}`][v];
  const mid = [`${L} = ${x + k * 3} − ${k * 3}`, `${L} = ${x} + ${k}`, `${L} = ${k * x} ÷ ${k}`, `${L} = ${x} × ${k}`][v], ans = [x, x + k, x, x * k][v];
  return num(ans, [St(`Get ${L} alone: ${how}.`, eqnLines([{ eq }, { eq: mid, note: how }])), `${mid.split(' = ')[1]} = ${ans}.`, `So ${L} = ${ans}.`], { q: `Solve for ${L}: ${eq}`, expr: [`${x + k * 3}-${k * 3}`, `${x}+${k}`, `${k * x}/${k}`, `${x}*${k}`][v] });
});

// ───────────── 18. Patterns and sequences ─────────────
skill('4-numpattern', 4, 'Patterns', 'Number patterns and rules', ['A rule tells how to get from one number to the next.', 'Some patterns add the same amount; some multiply by the same amount.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const s = r.int(1, 30), k = r.int(3, 15), n = r.int(5, 8), seq = Array.from({ length: n }, (_, i) => s + i * k);
    return num(seq.at(-1), [`Start at ${s} and add ${k} each time: ${seq.slice(0, -1).join(', ')}, …`, `Number ${n} is ${seq.at(-2)} + ${k} = ${seq.at(-1)}.`, `So the answer is ${seq.at(-1)}.`], { q: `A pattern starts at ${s}. The rule is "add ${k}". What is the number in position ${n}?`, expr: `${s}+${n - 1}*${k}` });
  }
  if (v === 1) {
    const s = r.int(1, 5), m = r.pick([2, 3, 4, 5, 10]), seq = Array.from({ length: 5 }, (_, i) => s * m ** i).filter((x) => x <= 50000);
    const show = seq.slice(0, Math.min(4, seq.length - 1)), next = show.at(-1) * m;
    return num(next, [`Each number is ${m} times the one before.`, `${C(show.at(-1))} × ${m} = ${C(next)}.`, `The next number is ${C(next)}.`], { q: `What comes next? ${show.map(C).join(', ')}, ?`, expr: `${show.at(-1)}*${m}` });
  }
  if (v === 2) {
    const s = r.int(1, 40), k = r.pick([2, 4, 5, 10, 3]), seq = Array.from({ length: 6 }, (_, i) => s + i * k);
    const allEven = seq.every((x) => x % 2 === 0), allOdd = seq.every((x) => x % 2 === 1);
    const right = allEven ? 'Every number is even.' : allOdd ? 'Every number is odd.' : 'The numbers switch between odd and even.';
    return mc(r, right, ['Every number is even.', 'Every number is odd.', 'The numbers switch between odd and even.'].filter((x) => x !== right).concat(['Every number is a multiple of 7.']), { q: `The rule is "start at ${s}, add ${k}". What is true about the numbers? (${seq.join(', ')}, …)`, steps: [`${s} is ${s % 2 ? 'odd' : 'even'}, and adding ${k} ${k % 2 ? 'switches between odd and even' : 'keeps a number odd or even'}.`, right] });
  }
  if (v === 3) {
    const k = r.int(2, 6), m = r.pick([2, 3]), A = [1, 2, 3, 4, 5].map((i) => i * k), B = A.map((x) => x * m);
    return num(m, [`Pattern A: ${A.join(', ')}. Pattern B: ${B.join(', ')}.`, `${B[0]} ÷ ${A[0]} = ${m}, ${B[1]} ÷ ${A[1]} = ${m}, and so on.`, `So each number in B is ${m} times the number in A.`], { q: `Pattern A starts at 0 and adds ${k}. Pattern B starts at 0 and adds ${k * m}. Each number in B (after 0) is how many times the matching number in A?`, expr: `${k * m}/${k}` });
  }
  const name = nm(r), s = r.int(5, 30), k = r.int(2, 9), w = r.int(3, 10);
  return num(s + k * w, [`Each week adds $${k}: after ${w} weeks that is ${w} × $${k} = $${k * w}.`, `Add the starting $${s}: $${s} + $${k * w} = $${s + k * w}.`, `So ${name} has $${s + k * w}.`], { q: `${name} has $${s} in a piggy bank and adds $${k} every week. How many dollars will be in the bank after ${w} weeks?`, expr: `${s}+${k}*${w}` });
});
skill('4-inout', 4, 'Patterns', 'Input and output tables', ['An input/output table follows one rule.', 'Test the rule on every row before you use it.'], (r) => {
  const op = r.pick(['+', '−', '×', '÷']), k = op === '+' || op === '−' ? r.int(3, 25) : r.int(2, 9);
  const ins = r.shuffle(Array.from({ length: 12 }, (_, i) => (op === '÷' ? (i + 2) * k : op === '−' ? i + k + 2 : i + 2))).slice(0, 4);
  const f = (x) => (op === '+' ? x + k : op === '−' ? x - k : op === '×' ? x * k : x / k), rule = `${op} ${k}`;
  if (r.bool()) {
    const j = r.int(0, 3);
    return num(f(ins[j]), [`Look at the full rows: ${ins.filter((_, i) => i !== j).slice(0, 2).map((x) => `${x} → ${f(x)}`).join(', ')}. The rule is ${rule}.`, `${ins[j]} ${op} ${k} = ${f(ins[j])}.`, `So the missing output is ${f(ins[j])}.`], { q: 'Find the rule, then the missing output.', visual: { type: 'table', head: ['Input', 'Output'], rows: ins.map((x, i) => [x, i === j ? '?' : f(x)]) }, expr: `${ins[j]}${op === '×' ? '*' : op === '÷' ? '/' : op === '−' ? '-' : '+'}${k}` });
  }
  const others = [['+', k + 1], ['−', k], ['×', 2], ['+', k * 2]].map(([o, c]) => `${o} ${c}`).filter((x) => x !== rule);
  return mc(r, rule, others, { q: 'What is the rule for this table?', visual: { type: 'table', head: ['Input', 'Output'], rows: ins.map((x) => [x, f(x)]) }, steps: [`${ins[0]} → ${f(ins[0])} and ${ins[1]} → ${f(ins[1])}.`, `The rule ${rule} works for every row.`] });
});
skill('4-shapepat', 4, 'Patterns', 'Shape patterns', ['A repeating pattern has a core that repeats again and again.', 'A growing pattern adds the same amount each time.'], (r) => {
  const v = r.int(0, 2), SH = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
  if (v <= 1) {
    const len = r.int(2, 4), core = r.shuffle(SH).slice(0, len), shown = Array.from({ length: len * 2 + r.int(0, len - 1) }, (_, i) => core[i % len]);
    if (v === 0) {
      const next = core[shown.length % len];
      return mc(r, next, SH.filter((x) => x !== next).slice(0, 3), { q: `What comes next? ${shown.join(', ')}, ?`, steps: [`The part that repeats is: ${core.join(', ')}.`, `After ${shown.at(-1)} comes ${next}.`] });
    }
    const pos = r.int(10, 30), right = core[(pos - 1) % len];
    return mc(r, right, SH.filter((x) => x !== right).slice(0, 3), { q: `The pattern ${core.join(', ')} repeats over and over. What is shape number ${pos}?`, steps: [`The core has ${len} shapes. ${pos} ÷ ${len} = ${Math.floor(pos / len)} R ${pos % len}.`, pos % len ? `Remainder ${pos % len} means shape ${pos % len} of the core: ${right}.` : `No remainder means the last shape of the core: ${right}.`] });
  }
  const s = r.int(2, 6), k = r.int(2, 5), n = r.int(5, 10), t = s + (n - 1) * k;
  return num(t, [`Figures: ${[1, 2, 3].map((i) => s + (i - 1) * k).join(', ')}, … Each figure adds ${k} squares.`, `Figure ${n} = ${s} + ${n - 1} × ${k} = ${t}.`, `So figure ${n} has ${t} squares.`], { q: `Figure 1 has ${s} squares, figure 2 has ${s + k}, and figure 3 has ${s + 2 * k}. The pattern keeps growing the same way. How many squares are in figure ${n}?`, expr: `${s}+${n - 1}*${k}` });
});

// ───────────── 19. Coordinate plane ─────────────
const PLACES = ['Library', 'School', 'Park', 'Rink', 'Pool', 'Store', 'Farm', 'Zoo'];
skill('4-coord', 4, 'Coordinate plane', 'Points and maps on a grid', ['A point is written (x, y): go across first, then up.', 'The first number is how far right; the second is how far up.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const x = r.int(0, 9), y = r.int(0, 9); let y2 = y; if (x === y) y2 = (y + 3) % 10;
    return mc(r, `(${x}, ${y2})`, [`(${y2}, ${x})`, `(${x + 1 > 9 ? x - 1 : x + 1}, ${y2})`, `(${x}, ${y2 + 1 > 9 ? y2 - 1 : y2 + 1})`], { q: 'What are the coordinates of the point?', visual: { type: 'coord', x, y: y2 }, steps: [`Go across to ${x}, then up to ${y2}.`, `The point is (${x}, ${y2}).`] });
  }
  const pts = [], used = new Set(); while (pts.length < 4) { const x = r.int(1, 6), y = r.int(1, 6); if (!used.has(`${x},${y}`)) { used.add(`${x},${y}`); pts.push([x, y]); } }
  const names = r.shuffle(PLACES).slice(0, 4), k = r.int(0, 3), [px, py] = pts[k];
  if (v === 1) return mc(r, names[k], names.filter((_, i) => i !== k), { q: `On this town map, which place is at (${px}, ${py})?`, visual: { type: 'plane', points: pts.map(([x, y], i) => [x, y, names[i]]), range: 6 }, steps: [`Go ${px} right from 0, then ${py} up.`, `The ${names[k]} is there.`] });
  let dx = r.int(-px, 6 - px), dy = r.int(-py, 6 - py); if (!dx && !dy) dy = py < 6 ? 1 : -1; const ex = px + dx, ey = py + dy;
  const dir = `${dx ? `${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'}` : ''}${dx && dy ? ' and ' : ''}${dy ? `${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}` : ''}` || 'nowhere';
  return mc(r, `(${ex}, ${ey})`, [`(${ey}, ${ex})`, `(${px - dx}, ${ey})`, `(${ex}, ${py - dy})`, `(${ex + 1}, ${ey})`], { q: `${nm(r)} starts at (${px}, ${py}) and walks ${dir}. Where does the walk end?`, visual: { type: 'plane', points: [[px, py, 'Start']], range: 6 }, steps: [`Across: ${px} ${dx >= 0 ? '+' : '−'} ${Math.abs(dx)} = ${ex}. Up: ${py} ${dy >= 0 ? '+' : '−'} ${Math.abs(dy)} = ${ey}.`, `The walk ends at (${ex}, ${ey}).`] });
});

// ───────────── 20. Data and graphs ─────────────
const FRUIT = ['Apples', 'Bananas', 'Grapes', 'Pears', 'Plums'], SPORT = ['Hockey', 'Soccer', 'Swimming', 'Basketball', 'Skating'];
skill('4-tables', 4, 'Data and graphs', 'Tables, tallies and pictographs', ['Read the row and the column carefully.', 'In a pictograph, each picture stands for more than one: check the key.'], (r) => {
  const v = r.int(0, 2), cats = r.shuffle(r.bool() ? FRUIT : SPORT).slice(0, 4);
  if (v === 0) {
    const vals = cats.map(() => r.int(5, 60)); let i = r.int(0, 3), j = r.int(0, 3); while (j === i || vals[j] === vals[i]) { j = r.int(0, 3); if (vals[j] === vals[i]) vals[j] += 1; }
    const [hi, lo] = vals[i] > vals[j] ? [i, j] : [j, i];
    return num(vals[hi] - vals[lo], [`From the table: ${cats[hi]} ${vals[hi]}, ${cats[lo]} ${vals[lo]}.`, `${vals[hi]} − ${vals[lo]} = ${vals[hi] - vals[lo]}.`, `So ${vals[hi] - vals[lo]} more votes.`], { q: `The table shows votes for a class vote. How many more votes did ${cats[hi]} get than ${cats[lo]}?`, visual: { type: 'table', head: ['Choice', 'Votes'], rows: cats.map((c, k) => [c, vals[k]]) }, expr: `${vals[hi]}-${vals[lo]}` });
  }
  if (v === 1) {
    const vals = cats.map(() => r.int(2, 14)), tally = (n) => '||||| '.repeat(Math.floor(n / 5)) + '|'.repeat(n % 5), tot = vals.reduce((a, b) => a + b, 0);
    if (r.bool()) return num(tot, [`Count each row: ${vals.join(', ')}. (Each bundle of tally marks is 5.)`, `${vals.join(' + ')} = ${tot}.`, `So ${tot} students answered.`], { q: 'This frequency table shows favourite choices. How many students answered in all?', visual: { type: 'table', head: ['Choice', 'Tally', 'Frequency'], rows: cats.map((c, k) => [c, tally(vals[k]), vals[k]]) }, expr: vals.join('+') });
    const k = r.int(0, 3);
    return num(vals[k], [`Each bundle of tally marks is 5 and each single mark is 1.`, `${cats[k]}: ${Math.floor(vals[k] / 5)} bundle${Math.floor(vals[k] / 5) === 1 ? '' : 's'} and ${vals[k] % 5} more makes ${vals[k]}.`, `So the frequency is ${vals[k]}.`], { q: `What number goes in the Frequency column for ${cats[k]}?`, visual: { type: 'table', head: ['Choice', 'Tally', 'Frequency'], rows: cats.map((c, i) => [c, tally(vals[i]), i === k ? '?' : vals[i]]) }, expr: `${vals[k]}` });
  }
  const key = r.pick([2, 4, 5, 10]), pics = cats.map(() => r.int(1, 6)), k = r.int(0, 3);
  return num(pics[k] * key, [`The key says each ★ stands for ${key} votes.`, `${cats[k]} has ${pics[k]} stars: ${pics[k]} × ${key} = ${pics[k] * key}.`, `So ${cats[k]} got ${pics[k] * key} votes.`], { q: `In this pictograph, each ★ = ${key} votes. How many votes did ${cats[k]} get?`, visual: { type: 'table', head: ['Choice', `Votes (★ = ${key})`], rows: cats.map((c, i) => [c, '★'.repeat(pics[i])]) }, expr: `${pics[k]}*${key}` });
});
skill('4-graphs', 4, 'Data and graphs', 'Bar graphs, double bar graphs and line plots', ['Read the height of a bar against the scale.', 'A line plot puts an ✕ above a number line for each piece of data.'], (r) => {
  const v = r.int(0, 2), cats = r.shuffle(SPORT).slice(0, 4);
  if (v === 0) {
    const step = r.pick([1, 2, 5]), vals = cats.map(() => step * r.int(1, 10)), ask = r.int(0, 2), i = r.int(0, 3); let j = (i + 1 + r.int(0, 2)) % 4;
    if (ask === 0) return num(vals[i], [`Find the ${cats[i]} bar and read across to the scale.`, `The bar reaches ${vals[i]}.`, `So ${vals[i]} students chose ${cats[i]}.`], { q: `How many students chose ${cats[i]}?`, visual: { type: 'bars', labels: cats, values: vals, title: 'Favourite sport' }, expr: `${vals[i]}` });
    if (ask === 1) return num(vals[i] + vals[j], [`${cats[i]}: ${vals[i]}. ${cats[j]}: ${vals[j]}.`, `${vals[i]} + ${vals[j]} = ${vals[i] + vals[j]}.`, `So ${vals[i] + vals[j]} students chose one of them.`], { q: `How many students chose ${cats[i]} or ${cats[j]}?`, visual: { type: 'bars', labels: cats, values: vals, title: 'Favourite sport' }, expr: `${vals[i]}+${vals[j]}` });
    if (vals[i] === vals[j]) vals[j] += step;
    const [hi, lo] = vals[i] > vals[j] ? [i, j] : [j, i];
    return num(vals[hi] - vals[lo], [`${cats[hi]}: ${vals[hi]}. ${cats[lo]}: ${vals[lo]}.`, `${vals[hi]} − ${vals[lo]} = ${vals[hi] - vals[lo]}.`, `So ${vals[hi] - vals[lo]} more students chose ${cats[hi]}.`], { q: `How many more students chose ${cats[hi]} than ${cats[lo]}?`, visual: { type: 'bars', labels: cats, values: vals, title: 'Favourite sport' }, expr: `${vals[hi]}-${vals[lo]}` });
  }
  if (v === 1) {
    const g4 = cats.map(() => r.int(4, 30)), g5 = cats.map(() => r.int(4, 30)), k = r.int(0, 3); if (g4[k] === g5[k]) g5[k] += 3;
    const [big, small, bn, sn] = g4[k] > g5[k] ? [g4[k], g5[k], 'Grade 4', 'Grade 5'] : [g5[k], g4[k], 'Grade 5', 'Grade 4'];
    return num(big - small, [`This table holds the data of a double bar graph: two bars for each sport.`, `${cats[k]}: ${bn} ${big}, ${sn} ${small}. ${big} − ${small} = ${big - small}.`, `So ${bn} had ${big - small} more.`], { q: `The table shows the data for a double bar graph. For ${cats[k]}, how many more students chose it in ${bn} than in ${sn}?`, visual: { type: 'table', head: ['Sport', 'Grade 4', 'Grade 5'], rows: cats.map((c, i) => [c, g4[i], g5[i]]) }, expr: `${big}-${small}` });
  }
  const counts = [0, 1, 2, 3, 4].map(() => r.int(0, 6)), ask = r.int(0, 2), k = r.int(1, 4);
  const vis = { type: 'table', head: ['Pets at home', '0', '1', '2', '3', '4'], rows: [['Students', ...counts.map((c) => '✕'.repeat(c) || '–')]] };
  if (ask === 0) return num(counts[k], [`Count the ✕ marks above ${k}.`, `There are ${counts[k]}.`, `So ${counts[k]} students have ${k} pet${k === 1 ? '' : 's'}.`], { q: `This line plot shows how many pets each student has. How many students have ${k} pet${k === 1 ? '' : 's'}?`, visual: vis, expr: `${counts[k]}` });
  if (ask === 1) { const t = counts.reduce((a, b) => a + b, 0); return num(t, [`Each ✕ is one student. Count every ✕: ${counts.join(' + ')}.`, `${counts.join(' + ')} = ${t}.`, `So ${t} students answered.`], { q: 'This line plot shows how many pets each student has. How many students are in the data?', visual: vis, expr: counts.join('+') }); }
  const more = counts.slice(k).reduce((a, b) => a + b, 0);
  return num(more, [`"${k} or more" means the columns ${[0, 1, 2, 3, 4].slice(k).join(', ')}.`, `${counts.slice(k).join(' + ')} = ${more}.`, `So ${more} students have ${k} or more pets.`], { q: `This line plot shows how many pets each student has. How many students have ${k} or more pets?`, visual: vis, expr: counts.slice(k).join('+') });
});
skill('4-stemvenn', 4, 'Data and graphs', 'Stem-and-leaf plots, Venn diagrams and choosing a graph', ['In a stem-and-leaf plot, the stem is the tens and the leaf is the ones: 4 | 7 means 47.', 'In a Venn diagram, the overlap holds what is in both groups.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const stems = [r.int(1, 3)]; while (stems.length < 4) stems.push(stems.at(-1) + 1);
    const leaves = stems.map(() => Array.from({ length: r.int(1, 5) }, () => r.int(0, 9)).sort((a, b) => a - b)), data = stems.flatMap((s, i) => leaves[i].map((l) => s * 10 + l));
    const vis = { type: 'table', head: ['Stem', 'Leaf'], rows: stems.map((s, i) => [s, leaves[i].join(' ')]) }, ask = r.int(0, 2);
    if (ask === 0) { const cut = stems[2] * 10; const n = data.filter((x) => x >= cut).length; return num(n, [`Values of ${cut} or more are in the rows with stems ${stems[2]} and ${stems[3]}.`, `Count the leaves in those rows: ${n}.`, `So ${n} scores are ${cut} or more.`], { q: `The stem-and-leaf plot shows test scores. How many scores are ${cut} or more?`, visual: vis, expr: `${n}` }); }
    if (ask === 1) { const mx = Math.max(...data), mn = Math.min(...data); return num(mx - mn, [`Greatest: last leaf on the last stem = ${mx}. Least: first leaf on the first stem = ${mn}.`, `${mx} − ${mn} = ${mx - mn}.`, `So the difference is ${mx - mn}.`], { q: 'The stem-and-leaf plot shows test scores. What is the difference between the greatest and least score?', visual: vis, expr: `${mx}-${mn}` }); }
    return num(data.length, [`Each leaf is one value.`, `Count all the leaves: ${leaves.map((l) => l.length).join(' + ')} = ${data.length}.`, `So there are ${data.length} scores.`], { q: 'The stem-and-leaf plot shows test scores. How many scores are there?', visual: vis, expr: leaves.map((l) => l.length).join('+') });
  }
  if (v === 1) {
    const both = r.int(2, 8), a = both + r.int(3, 12), b = both + r.int(3, 12), ask = r.int(0, 2);
    const ans = [a - both, b - both, a + b - both][ask], Q = ['only hockey', 'only soccer', 'hockey or soccer or both'][ask];
    const vis = { type: 'table', head: ['Only hockey', 'Both', 'Only soccer'], rows: [['?', both, '?']] };
    return num(ans, [`${both} students play both, so they are in the overlap.`, ask === 2 ? `Add the two groups and take away the overlap counted twice: ${a} + ${b} − ${both} = ${ans}.` : `Only ${ask ? 'soccer' : 'hockey'}: ${ask ? b : a} − ${both} = ${ans}.`, `So ${ans} students play ${Q}.`], { q: `In a Venn diagram, ${a} students play hockey and ${b} play soccer. ${both} of them play both. How many students play ${Q}?`, visual: vis, expr: [`${a}-${both}`, `${b}-${both}`, `${a}+${b}-${both}`][ask] });
  }
  if (v === 2) {
    const P = r.int(0, 3), q = [`how the temperature changed every hour during one day`, `the favourite sports of students in a class`, `what fraction of a budget is spent on each thing`, `how many letters are in each student's first name`][P];
    const G = ['Line graph', 'Bar graph', 'Circle graph', 'Line plot'];
    return mc(r, G[P], G.filter((_, i) => i !== P), { q: `Which kind of graph is best to show ${q}?`, steps: [['A line graph shows change over time.', 'A bar graph compares groups.', 'A circle graph shows parts of a whole.', 'A line plot shows how often each number appears.'][P], `So choose a ${G[P].toLowerCase()}.`] });
  }
  const [f, word] = r.pick([[2, 'half'], [4, 'one quarter'], [10, 'one tenth'], [5, 'one fifth']]), n = f * r.int(3, 9), food = r.pick(['pizza', 'tacos', 'pasta', 'sushi']);
  return num(n / f, [`${word[0].toUpperCase() + word.slice(1)} of the circle means 1/${f} of the students.`, `${n} ÷ ${f} = ${n / f}.`, `So ${n / f} students chose ${food}.`], { q: `A circle graph shows the lunch choices of ${n} students. The ${food} part is ${word} of the circle. How many students chose ${food}?`, visual: { type: 'fraction', n: 1, d: f }, expr: `${n}/${f}` });
});

// ───────────── 21. Money ─────────────
const COINVAL = [5, 10, 25, 100, 200, 500, 1000, 2000];
const cname = (c) => (c >= 100 ? `$${c / 100}` : `${c}¢`);
skill('4-moneycount', 4, 'Money', 'Count, compare and round money', ['Count bills first, then the big coins, then the small coins.', '100¢ = $1. A loonie is $1 and a toonie is $2.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const coins = Array.from({ length: r.int(4, 8) }, () => r.pick(COINVAL)).sort((a, b) => b - a), tot = coins.reduce((a, b) => a + b, 0);
    const bills = coins.filter((c) => c >= 500).reduce((a, b) => a + b, 0), big = coins.filter((c) => c >= 100 && c < 500).reduce((a, b) => a + b, 0), small = tot - bills - big;
    return num(d2(tot / 100), [`Bills: ${money(bills)}. Loonies and toonies: ${money(big)}. Other coins: ${small}¢.`, `${money(bills)} + ${money(big)} + ${money(small)} = ${money(tot)}.`, `So there is ${money(tot)}.`], { q: 'How much money is shown, in dollars?', visual: { type: 'coins', coins }, expr: `(${coins.join('+')})/100` });
  }
  const a = 5 * r.int(100, 4000);
  if (v === 1) {
    let b = a + r.pick([-1, 1]) * 5 * r.int(1, 30); if (b <= 0) b = a + 45;
    const sa = money(a), sb = money(b), big = a > b ? sa : sb;
    return mc(r, big, [a > b ? sb : sa], { q: `Which amount is greater: ${sa} or ${sb}?`, steps: [`Compare the dollars first, then the cents.`, `${big} is greater.`] });
  }
  if (v === 2) {
    const ams = new Set([a]); while (ams.size < 4) ams.add(a + 5 * r.int(-40, 40));
    const arr = [...ams], sorted = [...arr].sort((x, y) => x - y);
    return mc(r, sorted.map(money).join(' < '), perms(r, arr.map(money), ' < '), { q: `Put these amounts in order from least to greatest: ${r.shuffle(arr).map(money).join(', ')}`, steps: ['Compare the dollars first; if they match, compare the cents.', `In order: ${sorted.map(money).join(' < ')}.`] });
  }
  const dol = Math.floor(a / 100), ct = a % 100, ans = Math.round(a / 100);
  return num(ans, [`${money(a)} is between $${dol} and $${dol + 1}.`, `${ct}¢ is ${ct >= 50 ? '50¢ or more, so round up' : 'less than 50¢, so round down'}.`, `So ${money(a)} rounds to $${ans}.`], { q: `Round ${money(a)} to the nearest dollar.`, expr: `Math.round(${a}/100)` });
});
skill('4-change', 4, 'Money', 'Add, subtract and make change', ['Line up the decimal points to add or subtract money.', 'Change = amount paid − price.'], (r) => {
  const v = r.int(0, 4), a = 5 * r.int(100, 3000), b = 5 * r.int(50, 2000), name = nm(r);
  if (v === 0) {
    const add = r.bool() || a < b, x = add ? a : Math.max(a, b), y = add ? b : Math.min(a, b), res = add ? x + y : x - y;
    return num(d2(res / 100), [...(add ? columnAdd([d2(x / 100), d2(y / 100)]) : columnSub(d2(x / 100), d2(y / 100))).slice(-1), `So the answer is ${money(res)}.`], { q: `${money(x)} ${add ? '+' : '−'} ${money(y)} = ?`, expr: `(${x}${add ? '+' : '-'}${y})/100` });
  }
  if (v === 1) {
    const x = 5 * r.int(200, 1500), y = 5 * r.int(100, 1200);
    return num(d2((x + y) / 100), [`Add the two prices: ${money(x)} + ${money(y)}.`, `Dollars and cents together make ${money(x + y)}.`, `So ${name} spends ${money(x + y)}.`], { q: `${name} buys a scarf for ${money(x)} and mittens for ${money(y)}. How much does ${name} spend, in dollars?`, expr: `(${x}+${y})/100` });
  }
  if (v === 2) {
    const paid = r.pick([500, 1000, 2000, 5000]), price = 5 * r.int(paid / 5 / 4, paid / 5 - 1);
    return num(d2((paid - price) / 100), [`Change = amount paid − price.`, `${money(paid)} − ${money(price)} = ${money(paid - price)}.`, `So the change is ${money(paid - price)}.`], { q: `${name} pays for a ${money(price)} book with a $${paid / 100} bill. How much change should ${name} get, in dollars?`, expr: `(${paid}-${price})/100` });
  }
  if (v === 3) {
    const items = r.shuffle([['Muffin', 5 * r.int(30, 80)], ['Juice', 5 * r.int(25, 60)], ['Apple', 5 * r.int(10, 30)], ['Sandwich', 5 * r.int(80, 150)]]), [p, q] = [items[0], items[1]], n = r.int(2, 4), tot = n * p[1] + q[1];
    return num(d2(tot / 100), [`${n} × ${money(p[1])} = ${money(n * p[1])}.`, `Add the ${q[0].toLowerCase()}: ${money(n * p[1])} + ${money(q[1])} = ${money(tot)}.`, `So the total is ${money(tot)}.`], { q: `Use the price list. How much do ${n} ${p[0].toLowerCase()}s and 1 ${q[0].toLowerCase()} cost, in dollars?`, visual: { type: 'table', head: ['Item', 'Price'], rows: items.map(([i, c]) => [i, money(c)]) }, expr: `(${n}*${p[1]}+${q[1]})/100` });
  }
  const paid = r.pick([1000, 2000]), price = 5 * r.int(paid / 5 / 4, paid / 5 - 1), ch = paid - price;
  return num(d2(price / 100), [`Price = amount paid − change.`, `${money(paid)} − ${money(ch)} = ${money(price)}.`, `So the item cost ${money(price)}.`], { q: `${name} paid with a $${paid / 100} bill and got ${money(ch)} in change. What was the price, in dollars?`, expr: `(${paid}-${ch})/100` });
});

// ───────────── 22. Units of measurement ─────────────
const UNITQ = [['the length of a pencil', 'centimetres', ['kilometres', 'metres', 'millimetres']], ['the distance from Halifax to Moncton', 'kilometres', ['centimetres', 'metres', 'millimetres']], ['the height of a door', 'metres', ['kilometres', 'millimetres']], ['the thickness of a coin', 'millimetres', ['kilometres', 'metres']],
  ['the mass of a paper clip', 'grams', ['kilograms']], ['the mass of a bicycle', 'kilograms', ['grams']], ['the mass of a watermelon', 'kilograms', ['grams']], ['the mass of a pencil', 'grams', ['kilograms']],
  ['the amount of water in a bathtub', 'litres', ['millilitres']], ['the amount of medicine in a spoon', 'millilitres', ['litres']], ['the amount of milk in a big jug', 'litres', ['millilitres']], ['the amount of juice in a small glass', 'millilitres', ['litres']]];
skill('4-units', 4, 'Measurement', 'Choose and compare metric units', ['Length: mm < cm < m < km. Mass: g < kg. Volume: mL < L.', '1 m = 100 cm, 1 km = 1000 m, 1 kg = 1000 g, 1 L = 1000 mL.', 'Water freezes at 0 °C and a warm summer day is about 25 °C.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const [what, right, wr] = r.pick(UNITQ); return mc(r, right, wr, { q: `Which unit is best for measuring ${what}?`, steps: [`Think about how big ${what.replace(/^the /, '')} is.`, `${right[0].toUpperCase() + right.slice(1)} fit best.`] }); }
  if (v === 1) {
    const [big, small, f, ab, sb] = r.pick([['m', 'cm', 100, 'metres', 'centimetres'], ['km', 'm', 1000, 'kilometres', 'metres'], ['kg', 'g', 1000, 'kilograms', 'grams'], ['L', 'mL', 1000, 'litres', 'millilitres'], ['cm', 'mm', 10, 'centimetres', 'millimetres']]);
    const x = r.int(2, 9), y = x * f + r.pick([-1, 1]) * r.int(1, f / 2), A = `${x} ${big}`, B = `${C(y)} ${small}`, more = x * f > y ? A : B;
    return mc(r, more, [more === A ? B : A, 'They are equal'], { q: `Which is more: ${A} or ${B}?`, steps: [`Change to the same unit: ${x} ${big} = ${C(x * f)} ${small}.`, `${C(x * f)} ${small} ${x * f > y ? '>' : '<'} ${C(y)} ${small}, so ${more} is more.`] });
  }
  if (v === 2) {
    const P = r.int(0, 3), q = ['a warm summer afternoon in Halifax', 'a cold winter day in Winnipeg', 'a cup of hot cocoa', 'a glass of ice water'][P], right = ['25 °C', '−20 °C', '70 °C', '2 °C'][P];
    return mc(r, right, ['25 °C', '−20 °C', '70 °C', '2 °C', '150 °C'].filter((x) => x !== right).slice(0, 3), { q: `Which temperature is most reasonable for ${q}?`, steps: ['Water freezes at 0 °C and boils at 100 °C. Room temperature is about 20 °C.', `So ${right} fits ${q}.`] });
  }
  const s = r.int(0, 6), len = r.int(3, 12), e = s + len, obj = r.pick(['crayon', 'leaf', 'key', 'paper clip', 'feather']);
  return num(len, [St(`The ${obj} starts at ${s} cm and ends at ${e} cm on the ruler.`, numberLine(0, 20, { marks: [s, e], jumps: [{ from: s, to: e, label: `${len} cm` }] })), `Length = end − start = ${e} − ${s} = ${len}.`, `So the ${obj} is ${len} cm long.`], { q: `A ${obj} is placed on a centimetre ruler. One end is at ${s} cm and the other end is at ${e} cm. How long is the ${obj}, in cm?`, visual: numberLine(0, 20, { marks: [s, e] }), expr: `${e}-${s}` });
});
skill('4-convert', 4, 'Measurement', 'Convert metric units', ['To change a big unit to a small unit, multiply.', 'To change a small unit to a big unit, divide.', '1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 L = 1000 mL.'], (r) => {
  const [big, small, f] = r.pick([['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'mL', 1000], ['m', 'mm', 1000]]), x = r.int(2, 25), v = r.int(0, 2);
  if (v === 0) return num(x * f, [`1 ${big} = ${C(f)} ${small}. Big unit to small unit: multiply.`, `${x} × ${C(f)} = ${C(x * f)}.`, `So ${x} ${big} = ${C(x * f)} ${small}.`], { q: `${x} ${big} = ? ${small}`, expr: `${x}*${f}` });
  if (v === 1) return num(x, [`1 ${big} = ${C(f)} ${small}. Small unit to big unit: divide.`, `${C(x * f)} ÷ ${C(f)} = ${x}.`, `So ${C(x * f)} ${small} = ${x} ${big}.`], { q: `${C(x * f)} ${small} = ? ${big}`, expr: `${x * f}/${f}` });
  const extra = r.int(1, f - 1);
  return num(x * f + extra, [`${x} ${big} = ${x} × ${C(f)} = ${C(x * f)} ${small}.`, `Add the ${extra} ${small}: ${C(x * f)} + ${extra} = ${C(x * f + extra)}.`, `So it is ${C(x * f + extra)} ${small}.`], { q: `${x} ${big} ${extra} ${small} = ? ${small}`, expr: `${x}*${f}+${extra}` });
});

// ───────────── 23. Time ─────────────
const t12 = (mins) => { mins = ((mins % 1440) + 1440) % 1440; const h = Math.floor(mins / 60), m = mins % 60; return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a.m.' : 'p.m.'}`; };
const t24 = (mins) => { mins = ((mins % 1440) + 1440) % 1440; return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`; };
const fixDots = (t) => t.replace(/\.\.(?=\s|$)/g, '.');
const tidyDots = (it) => ({ ...it, q: fixDots(it.q), steps: it.steps.map((x) => (typeof x === 'string' ? fixDots(x) : { ...x, text: fixDots(x.text) })) });
const skillT = (id, g, st, t, l, gen) => skill(id, g, st, t, l, (r) => tidyDots(gen(r)));
const hm = (mins) => `${Math.floor(mins / 60)} h ${mins % 60} min`;
skillT('4-clock', 4, 'Time', 'Clocks, time units and 24-hour time', ['1 hour = 60 minutes, 1 minute = 60 seconds, 1 day = 24 hours, 1 week = 7 days.', 'In 24-hour time, add 12 to p.m. hours: 3:15 p.m. is 15:15.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const h = r.int(1, 12), m = r.int(0, 59), t = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
    return mc(r, t(h, m), [t(h, (m + 5) % 60), t(h % 12 + 1, m), t(((h + 10) % 12) + 1, m)], { q: 'What time does the clock show?', visual: { type: 'clock', h, m }, steps: [`The short hand is at or just past ${h}, so the hour is ${h}.`, `The long hand shows ${m} minutes: ${t(h, m)}.`] });
  }
  if (v === 1) {
    const [big, small, f] = r.pick([['hours', 'minutes', 60], ['minutes', 'seconds', 60], ['days', 'hours', 24], ['weeks', 'days', 7], ['years', 'months', 12]]), x = r.int(2, 9);
    return num(x * f, [`1 ${big.replace(/s$/, '')} = ${f} ${small}.`, `${x} × ${f} = ${x * f}.`, `So ${x} ${big} = ${x * f} ${small}.`], { q: `${x} ${big} = ? ${small}`, expr: `${x}*${f}` });
  }
  if (v === 2) {
    const [n, d, unit, sub, f] = r.pick([[1, 2, 'hour', 'minutes', 60], [1, 4, 'hour', 'minutes', 60], [3, 4, 'hour', 'minutes', 60], [1, 3, 'hour', 'minutes', 60], [1, 2, 'day', 'hours', 24], [1, 4, 'day', 'hours', 24], [1, 2, 'minute', 'seconds', 60]]);
    return num(f / d * n, [`1 ${unit} = ${f} ${sub}.`, `${n}/${d} of ${f}: ${f} ÷ ${d} = ${f / d}${n > 1 ? `, then × ${n} = ${f / d * n}` : ''}.`, `So ${n}/${d} ${unit} = ${f / d * n} ${sub}.`], { q: `How many ${sub} are in ${n}/${d} of a${unit === 'hour' ? 'n' : ''} ${unit}?`, expr: `${f}*${n}/${d}` });
  }
  if (v === 3) {
    const mins = r.int(0, 287) * 5;
    if (r.bool()) return txt(t24(mins), [mins >= 720 ? `It is p.m., so add 12 to the hour (12 noon stays 12).` : `It is a.m., so the hour stays the same (12 midnight becomes 00).`, `${t12(mins)} is ${t24(mins)}.`, `So it is ${t24(mins)}.`], { q: `Write ${t12(mins)} in 24-hour time (like 14:05).`, accept: [t24(mins).replace(/^0/, '')] });
    return mc(r, t12(mins), [t12(mins + 720), t12(mins + 60), t12(mins - 120)], { q: `What is ${t24(mins)} in 12-hour time?`, steps: [Math.floor(mins / 60) >= 12 ? `The hour is 12 or more, so it is p.m.${Math.floor(mins / 60) > 12 ? ` Take away 12 from the hour.` : ''}` : `The hour is less than 12, so it is a.m.`, `${t24(mins)} is ${t12(mins)}.`] });
  }
  const a = r.int(60, 200), b = r.int(30, 150), add = r.bool() || a <= b, res = add ? a + b : a - b;
  return mc(r, hm(res), [hm(res + 10), hm(res + 60), hm(Math.max(1, res - 50))], { q: `${hm(a)} ${add ? '+' : '−'} ${hm(b)} = ?`, steps: [`Change to minutes: ${hm(a)} = ${a} min and ${hm(b)} = ${b} min.`, `${a} ${add ? '+' : '−'} ${b} = ${res} min = ${hm(res)}.`] });
});
skillT('4-elapsed', 4, 'Time', 'Start time, end time and elapsed time', ['Count on in steps: first to the next hour, then the rest.', 'To find a start time, count back.'], (r) => {
  const v = r.int(0, 2), start = 6 * 60 + 5 * r.int(0, 150), dur = 5 * r.int(5, 40), end = start + dur, name = nm(r), act = r.pick(['a soccer game', 'a movie', 'a piano lesson', 'a hike', 'a bake sale']);
  const toHour = 60 - (start % 60) === 60 ? 0 : 60 - (start % 60);
  if (v === 0) return mc(r, hm(dur), [hm(dur + 10), hm(dur + 60), hm(Math.abs(dur - 15) || 5)], { q: `${act[0].toUpperCase() + act.slice(1)} starts at ${t12(start)} and ends at ${t12(end)}. How long does it last?`, steps: [`Count on from ${t12(start)}${toHour && toHour < dur ? `: ${toHour} min to ${t12(start + toHour)}` : ''}.`, `In all that is ${dur} minutes = ${hm(dur)}.`] });
  if (v === 1) return mc(r, t12(end), [t12(end + 10), t12(end - 60), t12(end + 60)], { q: `${name} starts ${act} at ${t12(start)}. It lasts ${hm(dur)}. When does it end?`, steps: [`Add ${Math.floor(dur / 60)} h to ${t12(start)}: ${t12(start + Math.floor(dur / 60) * 60)}.`, `Add ${dur % 60} min more: ${t12(end)}.`] });
  return mc(r, t12(start), [t12(start + 10), t12(start - 60), t12(start + 60)], { q: `${name}'s ${act.replace(/^a /, '')} ended at ${t12(end)}. It lasted ${hm(dur)}. When did it start?`, steps: [`Count back ${Math.floor(dur / 60)} h from ${t12(end)}: ${t12(end - Math.floor(dur / 60) * 60)}.`, `Count back ${dur % 60} min more: ${t12(start)}.`] });
});
const ZONES = [['Vancouver', -3], ['Calgary', -2], ['Winnipeg', -1], ['Toronto', 0], ['Halifax', 1]];
skillT('4-schedule', 4, 'Time', 'Schedules, time zones and time patterns', ['Read a schedule across a row and down a column.', 'Going west in Canada, clocks show an earlier time: when it is 3:00 p.m. in Toronto, it is 12:00 p.m. in Vancouver.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const stops = ['Main St', 'Library', 'Park', 'Arena'], first = 7 * 60 + 5 * r.int(0, 12), gaps = [r.int(2, 6) * 5, r.int(2, 5) * 5, r.int(1, 4) * 5], buses = [0, r.int(3, 6) * 10];
    const times = buses.map((b) => [0, gaps[0], gaps[0] + gaps[1], gaps[0] + gaps[1] + gaps[2]].map((g) => first + b + g));
    const i = r.int(0, 1), j = r.int(2, 3), d = times[0][j] - times[0][i];
    return num(d, [`The bus leaves ${stops[i]} at ${t24(times[0][i])} and reaches ${stops[j]} at ${t24(times[0][j])}.`, `From ${t24(times[0][i])} to ${t24(times[0][j])} is ${d} minutes.`, `So the trip takes ${d} minutes.`], { q: `Use the bus schedule. How many minutes does the first bus take to go from ${stops[i]} to ${stops[j]}?`, visual: { type: 'table', head: ['Stop', 'Bus 1', 'Bus 2'], rows: stops.map((s, k) => [s, t24(times[0][k]), t24(times[1][k])]) }, expr: `${d}` });
  }
  if (v === 1) {
    let a = r.int(0, 4), b = r.int(0, 4); while (b === a) b = r.int(0, 4);
    const t = 60 * r.int(8, 20), diff = ZONES[b][1] - ZONES[a][1], ans = t + diff * 60;
    return mc(r, t12(ans), [t12(t - diff * 60), t12(t), t12(ans + 60)], { q: `When it is ${t12(t)} in ${ZONES[a][0]}, what time is it in ${ZONES[b][0]}?`, steps: [`${ZONES[b][0]} is ${Math.abs(diff)} hour${Math.abs(diff) === 1 ? '' : 's'} ${diff > 0 ? 'ahead of' : 'behind'} ${ZONES[a][0]}.`, `${t12(t)} ${diff > 0 ? '+' : '−'} ${Math.abs(diff)} h = ${t12(ans)}.`] });
  }
  const s = 6 * 60 + 5 * r.int(0, 24), g = r.pick([10, 15, 20, 25, 30, 45]), seq = [0, 1, 2, 3].map((i) => s + i * g);
  return mc(r, t12(s + 4 * g), [t12(s + 4 * g + 5), t12(s + 5 * g), t12(s + 3 * g + 5)], { q: `A ferry leaves at ${seq.map(t12).join(', ')}. If the pattern keeps going, when does the next ferry leave?`, steps: [`Each ferry leaves ${g} minutes after the one before.`, `${t12(seq[3])} + ${g} min = ${t12(s + 4 * g)}.`] });
});

// ───────────── 24. Lines and angles ─────────────
skill('4-lines', 4, 'Lines and angles', 'Lines, rays and kinds of angles', ['A line goes on forever both ways; a ray has one endpoint; a segment has two.', 'Acute is less than 90°, right is 90°, obtuse is between 90° and 180°, straight is 180°.', 'A full turn is 360°, so a quarter turn is 90°.'], (r) => {
  const v = r.int(0, 4);
  if (v === 0) {
    const deg = r.pick([r.int(10, 85), 90, r.int(95, 175), 180]), right = deg < 90 ? 'Acute' : deg === 90 ? 'Right' : deg < 180 ? 'Obtuse' : 'Straight';
    return mc(r, right, ['Acute', 'Right', 'Obtuse', 'Straight'].filter((x) => x !== right), { q: `What kind of angle is ${deg}°?`, visual: { type: 'angle', deg, label: `${deg}°` }, steps: [`Compare ${deg}° with 90° and 180°.`, `${deg}° is ${deg < 90 ? 'less than 90°' : deg === 90 ? 'exactly 90°' : deg < 180 ? 'between 90° and 180°' : 'exactly 180°'}, so it is ${right.toLowerCase()}.`] });
  }
  if (v === 1) {
    const P = r.int(0, 2), d = ['part of a line with two endpoints', 'part of a line with one endpoint that goes on forever in one direction', 'a straight path that goes on forever in both directions'][P], N = ['Line segment', 'Ray', 'Line'];
    return mc(r, N[P], N.filter((_, i) => i !== P).concat(['Angle']), { q: `What is the name for ${d}?`, steps: ['Count the endpoints: a line has 0, a ray has 1, a segment has 2.', `So it is a ${N[P].toLowerCase()}.`] });
  }
  if (v === 2) {
    const P = r.int(0, 2), d = ['never meet, like the rails of a train track', 'cross to make square corners, like the corner of a page', 'cross but not at a right angle, like the letter X leaning over'][P], N = ['Parallel', 'Perpendicular', 'Intersecting (not perpendicular)'];
    return mc(r, N[P], N.filter((_, i) => i !== P), { q: `Two lines ${d}. What are they called?`, steps: ['Parallel lines never meet. Perpendicular lines meet at a right angle.', `So they are ${N[P].toLowerCase()}.`] });
  }
  if (v === 3) {
    const [n, d] = r.pick([[1, 4], [1, 2], [3, 4], [1, 3], [1, 6], [1, 8], [2, 3], [1, 12], [1, 10]]), deg = 360 * n / d;
    return num(deg, [`A full turn is 360°.`, `${n}/${d} of 360°: 360 ÷ ${d} = ${360 / d}${n > 1 ? `, × ${n} = ${deg}` : ''}.`, `So the angle is ${deg}°.`], { q: `An angle turns through ${n}/${d} of a full circle. How many degrees is the angle?`, visual: { type: 'angle', deg }, expr: `360*${n}/${d}` });
  }
  const deg = r.pick([90, 180, 270, 360]), F = { 90: '1/4', 180: '1/2', 270: '3/4', 360: '1 (a full turn)' };
  return mc(r, F[deg], Object.values(F).filter((x) => x !== F[deg]), { q: `A wheel turns ${deg}°. What fraction of a full turn is that?`, visual: deg < 360 ? { type: 'angle', deg } : null, steps: [`A full turn is 360°.`, `${deg} out of 360 is ${F[deg]}.`] });
});

// ───────────── 25. Two-dimensional figures ─────────────
const POLYN = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
const regPoly = (n) => Array.from({ length: n }, (_, i) => { const a = Math.PI / 2 + (2 * Math.PI * i) / n; return [+(5 + 4.5 * Math.cos(a)).toFixed(2), +(5 + 4.5 * Math.sin(a)).toFixed(2)]; });
skill('4-polygons', 4, 'Two-dimensional figures', 'Polygons', ['A polygon is a closed shape made of straight sides.', 'Pentagon 5 sides, hexagon 6, octagon 8. A regular polygon has all sides and all angles equal.', 'Congruent shapes are the same size and the same shape.'], (r) => {
  const v = r.int(0, 4), n = r.int(3, 10);
  if (v === 0) return r.bool() ? num(n, [`A ${POLYN[n]} has ${n} sides.`, `So the answer is ${n}.`], { q: `How many sides does a ${POLYN[n]} have?`, visual: { type: 'poly', points: regPoly(n) } })
    : mc(r, POLYN[n], [n - 1, n + 1, n + 2, n - 2].filter((k) => POLYN[k]).map((k) => POLYN[k]), { q: 'What is the name of this polygon?', visual: { type: 'poly', points: regPoly(n) }, steps: [`Count the sides: ${n}.`, `A polygon with ${n} sides is a ${POLYN[n]}.`] });
  if (v === 1) {
    const s = r.pick(['circle', 'oval', 'heart', 'square', 'triangle', 'rectangle', 'diamond', 'star']), yes = !['circle', 'oval', 'heart'].includes(s);
    return yesNo(r, yes, { q: 'Is this shape a polygon?', visual: { type: 'shape', name: s }, steps: ['A polygon is closed and has only straight sides.', yes ? 'This shape is closed and every side is straight, so yes.' : 'This shape has a curved edge, so no.'] });
  }
  if (v === 2) {
    const P = r.pick([['regular', regPoly(r.int(3, 8))], ['irregular', [[1, 2], [9, 2], [9, 6], [1, 6]]], ['irregular', [[1, 1], [9, 1], [3, 8]]], ['irregular', [[2, 1], [8, 1], [9, 6], [5, 9], [1, 5]]], ['regular', [[2, 2], [8, 2], [8, 8], [2, 8]]]]);
    const right = P[0] === 'regular' ? 'Regular' : 'Irregular';
    return mc(r, right, [right === 'Regular' ? 'Irregular' : 'Regular'], { q: 'Is this polygon regular or irregular?', visual: { type: 'poly', points: P[1], grid: true }, steps: ['A regular polygon has all sides equal and all angles equal.', right === 'Regular' ? 'All the sides and angles match, so it is regular.' : 'Its sides are not all the same length, so it is irregular.'] });
  }
  if (v === 3) {
    const a = r.int(3, 9), b = r.int(3, 9), c = r.int(Math.abs(a - b) + 1, a + b - 1), same = r.bool(), c2 = same ? c : c + 1;
    return yesNo(r, same, { q: `Triangle A has sides ${a} cm, ${b} cm and ${c} cm. Triangle B has sides ${b} cm, ${c2} cm and ${a} cm. Are they congruent?`, steps: ['Congruent shapes have exactly the same size and shape, so the side lengths must match.', same ? 'Both have sides ' + [a, b, c].sort((x, y) => x - y).join(', ') + ' cm, so yes.' : `One side is ${c} cm in A but ${c2} cm in B, so no.`] });
  }
  return mc(r, POLYN[n], [POLYN[n === 3 ? 4 : n - 1], POLYN[n === 10 ? 9 : n + 1], 'circle'], { q: `I am a polygon with ${n} straight sides and ${n} corners. What am I?`, steps: [`${n} sides means a ${POLYN[n]}.`, `So it is a ${POLYN[n]}.`] });
});

// ───────────── 26. Triangles and quadrilaterals ─────────────
skill('4-triangles', 4, 'Triangles and quadrilaterals', 'Kinds of triangles', ['By sides: equilateral (3 equal), isosceles (2 equal), scalene (none equal).', 'By angles: acute (all less than 90°), right (one 90°), obtuse (one more than 90°).'], (r) => {
  if (r.bool()) {
    const k = r.int(0, 2), a = r.int(3, 9); let b = r.int(3, 9), c = r.int(3, 9);
    if (k === 0) b = c = a; else if (k === 1) { b = a; while (c === a || c >= 2 * a) c = r.int(2, 2 * a - 1); } else { while (b === a) b = r.int(3, 9); c = r.int(Math.abs(a - b) + 1, a + b - 1); while (c === a || c === b) c = r.int(Math.abs(a - b) + 1, a + b - 1); }
    const right = ['Equilateral', 'Isosceles', 'Scalene'][k];
    return mc(r, right, ['Equilateral', 'Isosceles', 'Scalene'].filter((x) => x !== right), { q: `A triangle has sides of ${a} cm, ${b} cm and ${c} cm. What kind of triangle is it?`, steps: [`Look for equal sides: ${a}, ${b}, ${c}.`, `${k === 0 ? 'All three are equal' : k === 1 ? 'Exactly two are equal' : 'No sides are equal'}, so it is ${right.toLowerCase()}.`] });
  }
  const k = r.int(0, 2), big = k === 0 ? r.int(61, 85) : k === 1 ? 90 : r.int(95, 140), a2 = r.int(Math.max(20, 180 - 2 * big), Math.min(big, 160 - big)), a3 = 180 - big - a2;
  const right = ['Acute', 'Right', 'Obtuse'][k], angs = r.shuffle([big, a2, a3]);
  return mc(r, right, ['Acute', 'Right', 'Obtuse'].filter((x) => x !== right), { q: `A triangle has angles of ${angs.join('°, ')}°. What kind of triangle is it?`, steps: [`The biggest angle is ${big}°.`, `${big < 90 ? 'All angles are less than 90°' : big === 90 ? 'One angle is exactly 90°' : 'One angle is more than 90°'}, so it is a${k === 0 ? 'n' : ''} ${right.toLowerCase()} triangle.`] });
});
const QUADS = { Square: [[2, 2], [7, 2], [7, 7], [2, 7]], Rectangle: [[1, 3], [9, 3], [9, 7], [1, 7]], Rhombus: [[5, 1], [8, 5], [5, 9], [2, 5]], Parallelogram: [[1, 2], [7, 2], [9, 7], [3, 7]], Trapezoid: [[1, 2], [9, 2], [7, 7], [3, 7]] };
const QWHY = { Square: '4 equal sides and 4 right angles', Rectangle: '4 right angles, but not all sides equal', Rhombus: '4 equal sides, but no right angles', Parallelogram: '2 pairs of parallel sides, no right angles and not all sides equal', Trapezoid: 'exactly 1 pair of parallel sides' };
skill('4-quads', 4, 'Triangles and quadrilaterals', 'Kinds of quadrilaterals', ['A parallelogram has 2 pairs of parallel sides. A trapezoid has exactly 1 pair.', 'A rectangle has 4 right angles; a rhombus has 4 equal sides; a square has both.'], (r) => {
  const v = r.int(0, 2), names = Object.keys(QUADS);
  if (v === 0) { const k = r.pick(names); return mc(r, k, names.filter((x) => x !== k).slice(0, 3), { q: 'What is the best name for this quadrilateral?', visual: { type: 'poly', points: QUADS[k], grid: true }, steps: ['Check the sides, the angles and which sides are parallel.', `It has ${QWHY[k]}, so it is a ${k.toLowerCase()}.`] }); }
  if (v === 1) { const k = r.pick(names), p = k === 'Trapezoid' ? 1 : 2; return num(p, [`A ${k.toLowerCase()} has ${QWHY[k]}.`, `So it has ${p} pair${p === 1 ? '' : 's'} of parallel sides.`], { q: `How many pairs of parallel sides does a ${k.toLowerCase()} have?`, visual: { type: 'poly', points: QUADS[k], grid: true } }); }
  const S = r.pick([['Every square is a rectangle.', true], ['Every rectangle is a parallelogram.', true], ['Every square is a rhombus.', true], ['Every rhombus is a square.', false], ['Every parallelogram is a rectangle.', false], ['A trapezoid has two pairs of parallel sides.', false], ['Every rectangle is a square.', false], ['A rhombus is a parallelogram.', true]]);
  return TF(r, S[1], { q: `True or false? ${S[0]}`, steps: ['Square: 4 equal sides and 4 right angles. Rectangle: 4 right angles. Rhombus: 4 equal sides. All three are parallelograms.', S[1] ? 'The first shape always has what the second one needs, so it is true.' : 'Not every one of the first shape has what the second one needs, so it is false.'] });
});

// ───────────── 27. Symmetry and transformations ─────────────
const SYM = [['square', 4, [[2, 2], [8, 2], [8, 8], [2, 8]]], ['rectangle', 2, [[1, 3], [9, 3], [9, 7], [1, 7]]], ['equilateral triangle', 3, regPoly(3)], ['regular hexagon', 6, regPoly(6)], ['regular pentagon', 5, regPoly(5)], ['isosceles triangle', 1, [[1, 1], [9, 1], [5, 9]]], ['rhombus', 2, [[5, 1], [8, 5], [5, 9], [2, 5]]], ['parallelogram', 0, [[1, 2], [7, 2], [9, 7], [3, 7]]], ['scalene triangle', 0, [[1, 1], [9, 1], [3, 7]]]];
skill('4-symmetry', 4, 'Symmetry and transformations', 'Symmetry, slides, flips and turns', ['A line of symmetry folds a shape into two matching halves.', 'A slide is a translation, a flip is a reflection, and a turn is a rotation.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const [n, k, pts] = r.pick(SYM); return num(k, [`Look for every fold line that makes the two halves match.`, k ? `A ${n} has ${k} line${k === 1 ? '' : 's'} of symmetry.` : `No fold makes the halves match.`, `So the answer is ${k}.`], { q: `How many lines of symmetry does this ${n} have?`, visual: { type: 'poly', points: pts } }); }
  if (v === 1) {
    const yes = ['A', 'H', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y'], no = ['F', 'G', 'J', 'L', 'N', 'P', 'R', 'S', 'Z'], right = r.pick(yes);
    return mc(r, right, r.shuffle(no).slice(0, 3), { q: 'Which letter has a line of symmetry going straight up and down?', steps: ['Imagine folding each letter down the middle.', `Only ${right} folds into two matching halves.`] });
  }
  if (v === 2) {
    const [n, k] = r.pick([['square', 4], ['rectangle', 2], ['equilateral triangle', 3], ['regular hexagon', 6], ['parallelogram', 2], ['rhombus', 2]]), turn = r.pick([['a quarter turn (90°)', 4], ['a half turn (180°)', 2], ['a third of a turn (120°)', 3]]), yes = k % turn[1] === 0;
    return yesNo(r, yes, { q: `Does a ${n} look exactly the same after ${turn[0]} about its centre?`, steps: [`A ${n} matches itself ${k} times in one full turn.`, yes ? `${turn[0][0].toUpperCase() + turn[0].slice(1)} is one of those positions, so yes.` : `${turn[0][0].toUpperCase() + turn[0].slice(1)} is not one of those positions, so no.`] });
  }
  const P = r.int(0, 2), d = [`slides ${r.int(2, 6)} units to the right without turning or flipping`, 'flips over a line, like a mirror image', `turns ${r.pick(['90°', '180°'])} around a point`][P], N = ['Translation', 'Reflection', 'Rotation'];
  return mc(r, N[P], N.filter((_, i) => i !== P), { q: `A shape ${d}. What is this move called?`, steps: ['Slide = translation, flip = reflection, turn = rotation.', `So it is a ${N[P].toLowerCase()}.`] });
});

// ───────────── 28. Three-dimensional figures ─────────────
const SOLIDS = { cube: [6, 12, 8], 'rectangular prism': [6, 12, 8], 'triangular prism': [5, 9, 6], 'square pyramid': [5, 8, 5], 'triangular pyramid': [4, 6, 4] };
skill('4-solids', 4, '3D figures', 'Faces, edges, vertices and nets', ['A face is a flat surface, an edge is where two faces meet, and a vertex is a corner.', 'A net is a flat shape that folds up into a 3D figure.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const s = r.pick(Object.keys(SOLIDS)), k = r.int(0, 2), what = ['faces', 'edges', 'vertices'][k], n = SOLIDS[s][k];
    return num(n, [`${['Count the flat surfaces', 'Count where two faces meet', 'Count the corners'][k]} of a ${s}.`, `A ${s} has ${n} ${what}.`, `So the answer is ${n}.`], { q: `How many ${what} does a ${s} have?` });
  }
  const D = [['6 square faces that are all the same', 'cube'], ['2 circle faces and a curved surface', 'cylinder'], ['1 circle face, a curved surface and one point at the top', 'cone'], ['a curved surface with no flat faces, no edges and no vertices', 'sphere'], ['a square base and 4 triangle faces that meet at a point', 'square pyramid'], ['2 triangle faces and 3 rectangle faces', 'triangular prism'], ['6 rectangle faces', 'rectangular prism']];
  const names = D.map((x) => x[1]), [d, right] = r.pick(D);
  if (v === 1) return mc(r, right, r.shuffle(names.filter((x) => x !== right)).slice(0, 3), { q: `Which 3D figure has ${d}?`, steps: ['Match the faces to the figure.', `${d[0].toUpperCase() + d.slice(1)}: that is a ${right}.`] });
  const N = [['6 squares', 'cube'], ['2 triangles and 3 rectangles', 'triangular prism'], ['1 square and 4 triangles', 'square pyramid'], ['4 triangles', 'triangular pyramid'], ['2 circles and 1 rectangle', 'cylinder'], ['6 rectangles', 'rectangular prism']], [nd, nr] = r.pick(N);
  return mc(r, nr, r.shuffle(N.map((x) => x[1]).filter((x) => x !== nr)).slice(0, 3), { q: `A net is made of ${nd}. What 3D figure does it fold into?`, steps: ['Each shape in the net becomes one face.', `${nd[0].toUpperCase() + nd.slice(1)} fold into a ${nr}.`] });
});

// ───────────── 29. Area, perimeter and volume ─────────────
const Lshape = (r) => { const W = r.int(5, 10), H = r.int(5, 10), w = r.int(2, W - 2), h = r.int(2, H - 2); return { W, H, w, h, points: [[0, 0], [W, 0], [W, H - h], [W - w, H - h], [W - w, H], [0, H]], labels: [W, H - h, w, h, W - w, H].map((x) => `${x} m`) }; };
skill('4-perimeter', 4, 'Area, perimeter and volume', 'Perimeter', ['Perimeter is the distance around a shape: add all the sides.', 'A rectangle: 2 × length + 2 × width.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const n = r.int(3, 6), pts = n === 4 ? [[1, 1], [9, 2], [8, 8], [2, 7]] : regPoly(n).map(([x, y], i) => [x + (i % 2) * 0.4, y]), sides = pts.map(() => r.int(2, 15)), P = sides.reduce((a, b) => a + b, 0);
    return num(P, [`Add every side: ${sides.join(' + ')}.`, `${sides.join(' + ')} = ${P}.`, `So the perimeter is ${P} cm.`], { q: 'What is the perimeter of this shape, in cm?', visual: { type: 'poly', points: pts, labels: sides.map((s) => `${s} cm`) }, expr: sides.join('+') });
  }
  if (v === 1) {
    const L = r.int(2, 9), W = r.int(1, 7), x0 = r.int(0, 10 - L), y0 = r.int(0, 10 - W);
    return num(2 * (L + W), [`Count the units along each side: ${L}, ${W}, ${L}, ${W}.`, `${L} + ${W} + ${L} + ${W} = ${2 * (L + W)}.`, `So the perimeter is ${2 * (L + W)} units.`], { q: 'Each grid square is 1 unit long. What is the perimeter of the rectangle, in units?', visual: { type: 'poly', points: [[x0, y0], [x0 + L, y0], [x0 + L, y0 + W], [x0, y0 + W]], grid: true }, expr: `2*(${L}+${W})` });
  }
  if (r.bool()) {
    const L = r.int(4, 30), W = r.int(2, 20), P = 2 * (L + W);
    return num(W, [`Two lengths: 2 × ${L} = ${2 * L}.`, `The two widths share the rest: ${P} − ${2 * L} = ${2 * W}, and ${2 * W} ÷ 2 = ${W}.`, `So the width is ${W} m.`], { q: `A rectangle has a perimeter of ${P} m. Its length is ${L} m. What is its width, in m?`, visual: { type: 'poly', points: [[1, 3], [9, 3], [9, 7], [1, 7]], labels: [`${L} m`, '? m', '', ''] }, expr: `(${P}-2*${L})/2` });
  }
  const a = r.int(3, 12), b = r.int(3, 12), c = r.int(Math.abs(a - b) + 1, a + b - 1), P = a + b + c;
  return num(c, [`Add the sides you know: ${a} + ${b} = ${a + b}.`, `The missing side is ${P} − ${a + b} = ${c}.`, `So the missing side is ${c} cm.`], { q: `A triangle has a perimeter of ${P} cm. Two sides are ${a} cm and ${b} cm. How long is the third side, in cm?`, visual: { type: 'poly', points: [[1, 1], [9, 1], [4, 8]], labels: [`${a} cm`, `${b} cm`, '? cm'] }, expr: `${P}-${a}-${b}` });
});
skill('4-area', 4, 'Area, perimeter and volume', 'Area of rectangles and other shapes', ['Area is the number of unit squares that cover a shape.', 'Rectangle area = length × width.', 'Split an odd shape into rectangles and add their areas.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const rows = r.int(2, 8), cols = r.int(2, 10); return num(rows * cols, [`There are ${rows} rows of ${cols} squares.`, `${rows} × ${cols} = ${rows * cols}.`, `So the area is ${rows * cols} square units.`], { q: 'What is the area of this rectangle, in square units?', visual: { type: 'grid', rows, cols }, expr: `${rows}*${cols}` }); }
  if (v === 1) {
    const L = r.int(3, 25), W = r.int(2, 15);
    if (r.bool()) return num(L * W, [`Area = length × width.`, `${L} × ${W} = ${L * W}.`, `So the area is ${L * W} cm².`], { q: `A rectangle is ${L} cm long and ${W} cm wide. What is its area, in square centimetres?`, visual: { type: 'poly', points: [[1, 3], [9, 3], [9, 7], [1, 7]], labels: [`${L} cm`, `${W} cm`, '', ''] }, expr: `${L}*${W}` });
    return num(W, [`Area = length × width, so width = area ÷ length.`, `${L * W} ÷ ${L} = ${W}.`, `So the width is ${W} cm.`], { q: `A rectangle has an area of ${L * W} cm². Its length is ${L} cm. What is its width, in cm?`, expr: `${L * W}/${L}` });
  }
  if (v === 2) {
    const s = Lshape(r), A = s.W * s.H - s.w * s.h, A1 = (s.W - s.w) * s.H, A2 = s.w * (s.H - s.h);
    return num(A, [`Split the shape into two rectangles: ${s.W - s.w} × ${s.H} and ${s.w} × ${s.H - s.h}.`, `${s.W - s.w} × ${s.H} = ${A1} and ${s.w} × ${s.H - s.h} = ${A2}.`, `Add: ${A1} + ${A2} = ${A}. So the area is ${A} m².`], { q: 'What is the area of this shape, in square metres?', visual: { type: 'poly', points: s.points, labels: s.labels }, expr: `${s.W}*${s.H}-${s.w}*${s.h}` });
  }
  const A = r.pick([12, 16, 18, 20, 24, 30, 36]), fs = factorsOf(A).filter((x) => x > 1 && x * x <= A), x = r.pick(fs), y = A / x;
  return mc(r, `${x} by ${y}`, [`${x} by ${y + 1}`, `${x + 1} by ${y + 1}`, `${A / 2} by ${A / 2 - 2}`].filter((w) => { const [p, q] = w.split(' by ').map(Number); return p * q !== A; }), { q: `Which rectangle has an area of ${A} square units?`, steps: ['Multiply length × width for each choice.', `${x} × ${y} = ${A}.`] });
});
skill('4-areaword', 4, 'Area, perimeter and volume', 'Area and perimeter problems, and volume', ['Fencing goes around a shape (perimeter); carpet covers it (area).', 'Volume is the number of unit cubes that fill a box: length × width × height.'], (r) => {
  const v = r.int(0, 2), name = nm(r);
  if (v === 0) {
    const L = r.int(4, 20), W = r.int(3, 15), fence = r.bool();
    return fence ? num(2 * (L + W), [`Fence goes all the way around, so find the perimeter.`, `2 × ${L} + 2 × ${W} = ${2 * L} + ${2 * W} = ${2 * (L + W)}.`, `So ${name} needs ${2 * (L + W)} m of fence.`], { q: `${name}'s garden is a rectangle ${L} m long and ${W} m wide. How many metres of fence go all the way around it?`, expr: `2*(${L}+${W})` })
      : num(L * W, [`Grass covers the whole garden, so find the area.`, `${L} × ${W} = ${L * W}.`, `So ${L * W} m² of grass is needed.`], { q: `${name}'s garden is a rectangle ${L} m long and ${W} m wide. How many square metres of grass seed cover it?`, expr: `${L}*${W}` });
  }
  if (v === 1) {
    const P = 2 * r.int(8, 15), half = P / 2, a = r.int(1, Math.floor(half / 2) - 1), b = Math.floor(half / 2), ask = r.bool();
    const s1 = `${a} m by ${half - a} m`, s2 = `${b} m by ${half - b} m`, big = a * (half - a) > b * (half - b) ? s1 : s2;
    return mc(r, big, [big === s1 ? s2 : s1, 'They have the same area'], { q: `Two rectangles both have a perimeter of ${P} m: one is ${s1}, the other is ${s2}. Which has the greater area?`, steps: [`Areas: ${a} × ${half - a} = ${a * (half - a)} and ${b} × ${half - b} = ${b * (half - b)}.`, `${big} has the greater area. (The closer to a square, the bigger the area.)`] });
  }
  const l = r.int(2, 6), w = r.int(2, 5), h = r.int(2, 5);
  return num(l * w * h, [`One layer has ${l} × ${w} = ${l * w} cubes.`, `There are ${h} layers: ${l * w} × ${h} = ${l * w * h}.`, `So the volume is ${l * w * h} cubic units.`], { q: `A box is filled with unit cubes. It is ${l} cubes long, ${w} cubes wide and ${h} cubes high. How many cubes fill it?`, expr: `${l}*${w}*${h}` });
});

// ───────────── 30. Understand fractions ─────────────
const fsign = (a, b, c, d) => (a * d > c * b ? '>' : a * d < c * b ? '<' : '=');
const signWrongs = (s) => ['>', '<', '='].filter((x) => x !== s);
skill('4-fracmodel', 4, 'Understand fractions', 'Fraction models and unit fractions', ['The bottom number (denominator) is how many equal parts make the whole.', 'The top number (numerator) is how many parts we count.', '3/5 is three fifths: 1/5 + 1/5 + 1/5.'], (r) => {
  const v = r.int(0, 4), d = r.int(2, 12), n = r.int(1, d - 1);
  if (v === 0) return mc(r, `${n}/${d}`, [`${d}/${n}`, `${n}/${d + 1}`, `${d - n}/${d}`, `${n + 1}/${d}`], { q: 'What fraction of the bar is shaded?', visual: { type: 'fraction', n, d }, steps: [`The bar has ${d} equal parts, and ${n} are shaded.`, `So ${n}/${d} is shaded.`] });
  if (v === 1) return num(`1/${d}`, [St(`The whole is split into ${d} equal parts.`, fractionBars([{ n: 1, d }])), `One part is one ${d}th of the whole: 1/${d}.`, `So each piece is 1/${d}.`], { q: `A ribbon is cut into ${d} equal pieces. What fraction of the ribbon is one piece?`, expr: `1/${d}` });
  if (v === 2) {
    const m = r.int(2, d - 1 > 2 ? d - 1 : 2);
    return num(m, [St(`${m}/${d} means ${m} parts of size 1/${d}.`, fractionBars([{ n: m, d }])), `${Array(m).fill(`1/${d}`).join(' + ')} = ${m}/${d}.`, `So you add 1/${d} ${m} times: the answer is ${m}.`], { q: `How many copies of 1/${d} add up to ${m}/${d}?`, expr: `${m}` });
  }
  if (v === 3) {
    const a = r.int(1, n), b = n - a;
    if (b === 0) return num(`${n}/${d}`, [`The parts are all ${d}ths, so add the tops.`, `${n} parts of 1/${d} is ${n}/${d}.`, `So the answer is ${n}/${d}.`], { q: `${Array(n).fill(`1/${d}`).join(' + ')} = ?`, expr: `${n}/${d}` });
    return num(`${b}/${d}`, [St(`${n}/${d} is ${n} parts. ${a} parts are already there.`, fractionBars([{ n, d }, { n: a, d }])), `${n} − ${a} = ${b}, so ${b} more parts are needed.`, `So ? = ${b}/${d}.`], { q: `${n}/${d} = ${a}/${d} + ?`, expr: `${b}/${d}` });
  }
  const food = r.pick(['pizza', 'pie', 'cake', 'bannock']), name = nm(r), left = r.bool();
  return num(`${left ? d - n : n}/${d}`, [`The ${food} has ${d} equal slices.`, left ? `${n} were eaten, so ${d} − ${n} = ${d - n} are left: ${d - n}/${d}.` : `${n} were eaten: ${n}/${d}.`, `So the answer is ${left ? d - n : n}/${d}.`], { q: `A ${food} is cut into ${d} equal slices. ${name}'s family eats ${n}. What fraction of the ${food} is ${left ? 'left' : 'eaten'}?`, visual: { type: 'fraction', n, d }, expr: `${left ? d - n : n}/${d}` });
});

const FWORD = { 2: 'half', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 8: 'eighth', 10: 'tenth', 12: 'twelfth' };
skill('4-fracparts', 4, 'Understand fractions', 'Halves to twelfths and sums of fractions', ['Fourths are 4 equal parts; eighths are 8 equal parts.', 'A fraction can be split into a sum: 5/6 = 2/6 + 3/6.'], (r) => {
  const v = r.int(0, 2), d = r.pick([2, 3, 4, 5, 6, 8, 10, 12]), n = r.int(1, d - 1);
  if (v === 0) { const w = ONESW[n] + ' ' + FWORD[d] + (n > 1 ? 's' : ''); return mc(r, n + '/' + d, [d + '/' + n, n + '/' + (d === 12 ? 10 : d + 1), (n === 1 ? 2 : n - 1) + '/' + d], { q: 'Which fraction is "' + w + '"?', steps: ['"' + FWORD[d] + 's" means ' + d + ' equal parts, so ' + d + ' is the denominator.', '"' + ONESW[n] + '" tells how many parts: ' + n + '/' + d + '.'] }); }
  if (v === 1) return num(d, [St('One whole is all of the parts.', { type: 'fraction', n: d, d }), d + ' ' + FWORD[d] + 's make ' + d + '/' + d + ' = 1.', 'So the answer is ' + d + '.'], { q: 'How many ' + FWORD[d] + 's make one whole?', expr: d });
  const dd = r.pick([5, 6, 8, 10, 12]), nn = r.int(3, dd - 1), x = r.int(1, nn - 1);
  return mc(r, x + '/' + dd + ' + ' + (nn - x) + '/' + dd, [x + '/' + dd + ' + ' + (nn - x + 1) + '/' + dd, x + '/' + dd + ' + ' + (nn - x) + '/' + (dd + 1), (x + 1) + '/' + dd + ' + ' + (nn - x + 1) + '/' + dd], { q: 'Which sum is equal to ' + nn + '/' + dd + '?', visual: { type: 'fraction', n: nn, d: dd }, steps: ['The parts must be ' + dd + 'ths and the tops must add to ' + nn + '.', x + ' + ' + (nn - x) + ' = ' + nn + ', so ' + x + '/' + dd + ' + ' + (nn - x) + '/' + dd + ' = ' + nn + '/' + dd + '.'] });
});

// ───────────── 31. Fractions on number lines ─────────────
skill('4-fracline', 4, 'Fractions on number lines', 'Fractions on a number line', ['Split the space from 0 to 1 into equal parts. Each part is a unit fraction.', 'Count the parts from 0 to find the fraction.'], (r) => {
  const v = r.int(0, 3), d = r.pick([2, 3, 4, 5, 6, 8, 10]), n = r.int(1, d - 1);
  const NL = [2, 4, 5, 10].includes(d) ? numberLine(0, 1, { step: 1 / d, marks: [n / d] }) : fractionBars([{ n, d, label: `${n}/${d}` }]);
  if (v === 0) return num(`${n}/${d}`, [`From 0 to 1 there are ${d} equal parts, so each part is 1/${d}.`, `The point is ${n} part${n === 1 ? '' : 's'} from 0: ${n}/${d}.`, `So the point shows ${n}/${d}.`], { q: `The space from 0 to 1 on a number line is split into ${d} equal parts. A point is ${n} part${n === 1 ? '' : 's'} from 0. What fraction is at the point?`, visual: [2, 4, 5, 10].includes(d) ? numberLine(0, 1, { step: 1 / d, marks: [n / d] }) : null, expr: `${n}/${d}` });
  if (v === 1) return num(n, [`Each jump is 1/${d}.`, `${n}/${d} is ${n} jumps of 1/${d}.`, `So it takes ${n} jumps.`], { q: `You hop along a number line from 0 in jumps of 1/${d}. How many jumps does it take to land on ${n}/${d}?`, expr: `${n}` });
  if (v === 2) {
    let nn = n; if (2 * nn === d) nn = nn + 1 < d ? nn + 1 : nn - 1;
    if (2 * nn === d || nn < 1) nn = 1;
    const right = 2 * nn < d ? 'Between 0 and 1/2' : 'Between 1/2 and 1';
    return mc(r, right, [right === 'Between 0 and 1/2' ? 'Between 1/2 and 1' : 'Between 0 and 1/2', 'Greater than 1'], { q: `Where does ${nn}/${d} go on a number line from 0 to 1?`, steps: [`Double the top: 2 × ${nn} = ${2 * nn}. Compare it with the bottom, ${d}.`, `${2 * nn} is ${2 * nn < d ? 'less' : 'more'} than ${d}, so ${nn}/${d} is ${2 * nn < d ? 'less' : 'more'} than 1/2: ${right.toLowerCase()}.`], visual: NL });
  }
  let m = r.int(1, d); while (m === n) m = r.int(1, d);
  const far = Math.max(n, m);
  return mc(r, `${far}/${d}`, [`${Math.min(n, m)}/${d}`, 'They are at the same place'], { q: `Which fraction is farther from 0 on a number line: ${n}/${d} or ${m}/${d}?`, steps: [`Both are counted in ${d}ths.`, `${far} parts is farther from 0 than ${Math.min(n, m)} parts, so ${far}/${d} is farther.`] });
});

skill('4-fracline2', 4, 'Fractions on number lines', 'Fractions past 1 and unit fractions on a line', ['A number line can keep going past 1: 5/4 is one fourth past 1.', 'The bigger the denominator, the closer a unit fraction is to 0.'], (r) => {
  const v = r.int(0, 2), d = r.pick([2, 4, 5]);
  if (v === 0) { const n = r.int(d + 1, 2 * d - 1); return num(n + '/' + d, [St('Each whole is split into ' + d + ' equal parts, so each part is 1/' + d + '.', numberLine(0, 2, { step: 1 / d, marks: [n / d] })), 'The point is ' + n + ' parts from 0: ' + n + '/' + d + '.', 'So the point shows ' + n + '/' + d + '.'], { q: 'Each whole on this number line is split into ' + d + ' equal parts. The point is ' + n + ' parts from 0. What fraction is at the point?', visual: numberLine(0, 2, { step: 1 / d, marks: [n / d] }), expr: n + '/' + d }); }
  if (v === 1) { const ds = r.shuffle([2, 3, 4, 5, 6, 8, 10, 12]).slice(0, 3), near0 = r.bool(), pick = near0 ? Math.max(...ds) : Math.min(...ds); return mc(r, '1/' + pick, ds.filter((x) => x !== pick).map((x) => '1/' + x), { q: 'Which unit fraction is ' + (near0 ? 'closest to 0' : 'farthest from 0') + ' on a number line: ' + ds.map((x) => '1/' + x).join(', ') + '?', steps: ['A bigger denominator means smaller parts, so the fraction is closer to 0.', 'So 1/' + pick + ' is ' + (near0 ? 'closest to 0' : 'farthest from 0') + '.'] }); }
  const dd = r.pick([6, 8, 10, 12]); let a = r.int(1, dd - 1), b = r.int(1, dd - 1); while (b === a || Math.abs(dd - a) === Math.abs(dd - b)) b = r.int(1, dd - 1);
  const close = Math.abs(dd - a) < Math.abs(dd - b) ? a : b;
  return mc(r, close + '/' + dd, [(close === a ? b : a) + '/' + dd], { q: 'Which is closer to 1 on a number line: ' + a + '/' + dd + ' or ' + b + '/' + dd + '?', steps: ['1 = ' + dd + '/' + dd + '. ' + a + '/' + dd + ' is ' + (dd - a) + ' parts away and ' + b + '/' + dd + ' is ' + (dd - b) + ' parts away.', 'So ' + close + '/' + dd + ' is closer to 1.'] });
});

// ───────────── 32. Fraction word problems ─────────────
skill('4-fracword', 4, 'Fraction word problems', 'Fraction word problems', ['To find 1/4 of a group, split it into 4 equal parts and take one part.', 'For 3/4 of a group, find 1/4, then take 3 of those parts.'], (r) => {
  const v = r.int(0, 3), d = r.int(2, 10), name = nm(r);
  if (v === 0) { const g = r.int(2, 10), tot = g * d; return num(g, [`Split ${tot} into ${d} equal groups: ${tot} ÷ ${d} = ${g}.`, `One group is 1/${d} of ${tot}: ${g}.`, `So ${name} gives away ${g} stickers.`], { q: `${name} has ${tot} stickers and gives away 1/${d} of them. How many stickers does ${name} give away?`, expr: `${tot}/${d}` }); }
  if (v === 1) { const g = r.int(2, 10), tot = g * d, n = r.int(2, Math.max(2, d - 1)); return num(n * g, [`First find 1/${d} of ${tot}: ${tot} ÷ ${d} = ${g}.`, `${n}/${d} is ${n} of those parts: ${n} × ${g} = ${n * g}.`, `So ${n * g} students walk to school.`], { q: `There are ${tot} students in a club. ${n}/${d} of them walk to school. How many students walk to school?`, expr: `${tot}*${n}/${d}` }); }
  if (v === 2) { const n = r.int(1, d - 1); return num(`${d - n}/${d}`, [`The whole garden has ${d} equal rows: ${d}/${d}.`, `${d}/${d} − ${n}/${d} = ${d - n}/${d}.`, `So ${d - n}/${d} of the garden has flowers.`], { q: `A garden has ${d} equal rows. ${n} row${n === 1 ? ' has' : 's have'} carrots and the rest have flowers. What fraction of the garden has flowers?`, visual: { type: 'fraction', n, d }, expr: `${d - n}/${d}` }); }
  const len = d * r.int(2, 9);
  return num(len / d, [`Cut ${len} cm into ${d} equal pieces: ${len} ÷ ${d}.`, `${len} ÷ ${d} = ${len / d}.`, `So each piece, 1/${d} of the rope, is ${len / d} cm long.`], { q: `A rope ${len} cm long is cut into ${d} equal pieces. How long is each piece, in cm?`, expr: `${len}/${d}` });
});

// ───────────── 33. Equivalent fractions ─────────────
skill('4-lowest', 4, 'Equivalent fractions', 'Lowest terms, tenths and hundredths', ['Divide the top and bottom by the same number to simplify.', 'A fraction is in lowest terms when only 1 divides both numbers.', '3/10 = 30/100 because 3 × 10 = 30 and 10 × 10 = 100.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) {
    const d0 = r.int(2, 9), n0 = r.int(1, d0 - 1), [a, b] = simplify(n0, d0), k = r.int(2, 6), n = a * k, d = b * k;
    return num(`${a}/${b}`, [St(`Find a number that divides both ${n} and ${d}: the biggest one is ${k}.`, fractionBars([{ n, d }, { n: a, d: b }])), `${n} ÷ ${k} = ${a} and ${d} ÷ ${k} = ${b}.`, `So ${n}/${d} in lowest terms is ${a}/${b}.`], { q: `Write ${n}/${d} in lowest terms.`, exactForm: 'fraction', expr: `${n}/${d}` });
  }
  if (v === 1) {
    const t = r.int(1, 9);
    return r.bool() ? num(t * 10, [`10 × 10 = 100, so multiply the top by 10 too.`, `${t} × 10 = ${t * 10}.`, `So ${t}/10 = ${t * 10}/100.`], { q: `${t}/10 = ?/100`, expr: `${t}*10` })
      : num(t, [`100 ÷ 10 = 10, so divide the top by 10 too.`, `${t * 10} ÷ 10 = ${t}.`, `So ${t * 10}/100 = ${t}/10.`], { q: `${t * 10}/100 = ?/10`, expr: `${t * 10}/10` });
  }
  if (v === 2) {
    const d = r.int(2, 6), n = r.int(1, d - 1), k = r.int(2, 5), right = `${n * k}/${d * k}`;
    return mc(r, right, [`${n + k}/${d + k}`, `${n * k}/${d + k}`, `${n + 1}/${d * k}`].filter((x) => { const [p, q] = x.split('/').map(Number); return p * d !== q * n; }), { q: `Which fraction is equal to ${n}/${d}?`, steps: [`Multiply the top and bottom of ${n}/${d} by the same number.`, `× ${k}: ${n}/${d} = ${right}.`] });
  }
  const d = r.int(2, 5), n = r.int(1, d - 1), seq = [1, 2, 3, 4].map((k) => `${n * k}/${d * k}`), nxt = `${n * 5}/${d * 5}`;
  return mc(r, nxt, [`${n * 5}/${d * 4}`, `${n * 4 + 1}/${d * 4 + 1}`, `${n * 6}/${d * 5}`], { q: `What comes next in this pattern of equal fractions? ${seq.join(', ')}, ?`, steps: [`Each fraction is ${n}/${d} with the top and bottom multiplied by 1, 2, 3, 4, …`, `Next multiply by 5: ${nxt}.`] });
});

// ───────────── 34. Compare fractions with like denominators ─────────────
skill('4-fraclike', 4, 'Compare like fractions', 'Compare fractions with the same denominator', ['When the denominators match, the parts are the same size.', 'Then the bigger numerator is the bigger fraction.'], (r) => {
  const v = r.int(0, 2), d = r.int(3, 12); let a = r.int(1, d - 1), b = r.int(1, d - 1); if (v === 0 && r.bool(0.15)) b = a; else while (b === a) b = r.int(1, d - 1);
  if (v === 0) { const s = fsign(a, d, b, d); return mc(r, s, signWrongs(s), { q: `${a}/${d} ? ${b}/${d}`, say: `Which sign goes between ${a} over ${d} and ${b} over ${d}?`, visual: fractionBars([{ n: a, d }, { n: b, d }]), steps: [`Same denominator, so compare the numerators: ${a} and ${b}.`, `So ${a}/${d} ${s} ${b}/${d}.`] }); }
  if (v === 1) {
    const [x, y] = r.pick([['flour', 'sugar'], ['milk', 'water'], ['oats', 'raisins']]), more = a > b ? `${a}/${d} cup of ${x}` : `${b}/${d} cup of ${y}`;
    return mc(r, a > b ? x[0].toUpperCase() + x.slice(1) : y[0].toUpperCase() + y.slice(1), [a > b ? y[0].toUpperCase() + y.slice(1) : x[0].toUpperCase() + x.slice(1), 'They are the same'], { q: `A recipe uses ${a}/${d} cup of ${x} and ${b}/${d} cup of ${y}. Which is used more?`, steps: [`Both amounts are in ${d}ths, so compare ${a} and ${b}.`, `${more} is more.`] });
  }
  const ns = r.shuffle([...new Set([a, b, r.int(1, d - 1), r.int(1, d - 1)])]), big = Math.max(...ns);
  return mc(r, `${big}/${d}`, ns.filter((x) => x !== big).map((x) => `${x}/${d}`), { q: `Which fraction is the greatest: ${ns.map((x) => `${x}/${d}`).join(', ')}?`, steps: [`All are ${d}ths, so look for the biggest numerator.`, `${big} is the biggest, so ${big}/${d} is greatest.`] });
});

// ───────────── 35. Compare fractions ─────────────
skill('4-fraccomp', 4, 'Compare fractions', 'Compare fractions', ['Same numerator: the smaller denominator means bigger pieces, so 3/5 > 3/8.', 'Different numbers: change to a common denominator, then compare.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const n = r.int(1, 5); let d1 = r.int(n + 1, 12), d2 = r.int(n + 1, 12); while (d2 === d1) d2 = r.int(n + 1, 12);
    const s = fsign(n, d1, n, d2);
    return mc(r, s, signWrongs(s), { q: `${n}/${d1} ? ${n}/${d2}`, say: `Which sign goes between ${n} over ${d1} and ${n} over ${d2}?`, visual: fractionBars([{ n, d: d1 }, { n, d: d2 }]), steps: [`Both have ${n} parts. ${d1 < d2 ? `${d1}ths are bigger than ${d2}ths` : `${d2}ths are bigger than ${d1}ths`}.`, `So ${n}/${d1} ${s} ${n}/${d2}.`] });
  }
  if (v === 1) {
    const b = r.int(2, 8); let d = r.int(2, 8); while (d === b) d = r.int(2, 8); const a = r.int(1, b - 1), c = r.int(1, d - 1), L = lcm(b, d), s = fsign(a, b, c, d);
    return mc(r, s, signWrongs(s), { q: `${a}/${b} ? ${c}/${d}`, say: `Which sign goes between ${a} over ${b} and ${c} over ${d}?`, steps: [St(`Use ${L} as a common denominator: ${a}/${b} = ${a * L / b}/${L} and ${c}/${d} = ${c * L / d}/${L}.`, fractionBars([{ n: a, d: b }, { n: c, d }])), `Compare ${a * L / b} and ${c * L / d}.`, `So ${a}/${b} ${s} ${c}/${d}.`] });
  }
  const b = r.int(3, 8), a = r.int(1, b - 2), bigger = r.bool(), right = bigger ? `${a + 1}/${b}` : `${a}/${b + 1}`;
  return mc(r, right, bigger ? [`${a}/${b + 1}`, `${a}/${b + 2}`, `${a - 1 || 1}/${b + 3}`] : [`${a + 1}/${b}`, `${a}/${b - 1}`, `${a + 2}/${b}`], { q: `Which fraction is ${bigger ? 'greater' : 'less'} than ${a}/${b}?`, steps: [bigger ? `More parts of the same size is bigger: ${a + 1}/${b} > ${a}/${b}.` : `The same number of smaller parts is less: ${a}/${b + 1} < ${a}/${b}.`, `So the answer is ${right}.`] });
});
skill('4-fracbench', 4, 'Compare fractions', 'Compare with 1/2', ['A fraction is exactly 1/2 when the top is half the bottom.', 'If the top is more than half the bottom, the fraction is more than 1/2.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const d = r.int(3, 12), n = r.int(1, d - 1), s = fsign(n, d, 1, 2), right = s === '>' ? 'Greater than 1/2' : s === '<' ? 'Less than 1/2' : 'Equal to 1/2';
    return mc(r, right, ['Greater than 1/2', 'Less than 1/2', 'Equal to 1/2'].filter((x) => x !== right), { q: `How does ${n}/${d} compare with 1/2?`, visual: { type: 'fraction', n, d }, steps: [`Double the top: 2 × ${n} = ${2 * n}. Compare it with the bottom, ${d}.`, `${2 * n} is ${s === '>' ? 'more than' : s === '<' ? 'less than' : 'equal to'} ${d}, so ${n}/${d} is ${right.toLowerCase()}.`] });
  }
  if (v === 1) {
    const d1 = r.int(3, 12), n1 = r.int(1, Math.ceil(d1 / 2) - 1), d2 = r.int(3, 12), n2 = r.int(Math.floor(d2 / 2) + 1, d2 - 1), flip = r.bool();
    const [a, b, c, d] = flip ? [n2, d2, n1, d1] : [n1, d1, n2, d2], s = fsign(a, b, c, d);
    return mc(r, s, signWrongs(s), { q: `Use 1/2 to compare: ${a}/${b} ? ${c}/${d}`, say: `Which sign goes between ${a} over ${b} and ${c} over ${d}?`, steps: [`${n1}/${d1} is less than 1/2, and ${n2}/${d2} is more than 1/2.`, `So ${a}/${b} ${s} ${c}/${d}.`] });
  }
  const d = 2 * r.int(2, 6), half = d / 2, more = r.bool(), right = more ? r.int(half + 1, d - 1) : r.int(1, half - 1);
  const wr = more ? [half, half - 1, 1].filter((x) => x > 0) : [half, half + 1, d - 1];
  return mc(r, right, wr, { q: `Which numerator makes ?/${d} ${more ? 'greater' : 'less'} than 1/2?`, steps: [`1/2 = ${half}/${d}.`, `${right}/${d} is ${more ? 'more' : 'less'} than ${half}/${d}, so ${right} works.`] });
});

// ───────────── 36. Order fractions ─────────────
skill('4-fracorder', 4, 'Order fractions', 'Put fractions in order', ['Same denominator: order by the numerators.', 'Same numerator: the bigger the denominator, the smaller the fraction.', 'Otherwise, use a common denominator first.'], (r) => {
  const v = r.int(0, 2); let fr;
  if (v === 0) { const d = r.int(5, 12), ns = r.shuffle([...Array(d - 1).keys()].map((x) => x + 1)).slice(0, 3); fr = ns.map((n) => [n, d]); }
  else if (v === 1) { const n = r.int(1, 4), ds = r.shuffle([...Array(12 - n).keys()].map((x) => x + n + 1)).slice(0, 3); fr = ds.map((d) => [n, d]); }
  else { const pool = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6], [3, 8], [5, 8], [7, 8], [2, 5], [4, 5], [1, 12], [7, 12]]; fr = []; for (const f of r.shuffle(pool)) if (!fr.some(([a, b]) => a * f[1] === f[0] * b)) { fr.push(f); if (fr.length === 3) break; } }
  const up = r.bool(), sorted = [...fr].sort((x, y) => (up ? x[0] / x[1] - y[0] / y[1] : y[0] / y[1] - x[0] / x[1])), S = (a) => a.map(([n, d]) => `${n}/${d}`), sep = up ? ' < ' : ' > ';
  const L = fr.reduce((a, [, d]) => lcm(a, d), 1);
  return mc(r, S(sorted).join(sep), perms(r, S(fr), sep), { q: `Put these fractions in order from ${up ? 'least to greatest' : 'greatest to least'}: ${S(fr).join(', ')}`, steps: [v === 0 ? 'The denominators match, so order by the numerators.' : v === 1 ? 'The numerators match, so the bigger denominator means the smaller fraction.' : `Use ${L} as a common denominator: ${fr.map(([n, d]) => `${n}/${d} = ${n * L / d}/${L}`).join(', ')}.`, `In order: ${S(sorted).join(sep)}.`] });
});

// ───────────── 37. Decimal place value: up to tenths ─────────────
skill('4-dectenths', 4, 'Decimal place value', 'Tenths', ['The first digit after the decimal point is the tenths place.', '4.3 is "four and three tenths" = 4 + 3/10.'], (r) => {
  const v = r.int(0, 2), w = r.int(0, 30), t = r.int(1, 9), x = `${w}.${t}`;
  if (v === 0) return num(x, [`"${w ? `${words(w)} and ` : ''}${ONESW[t]} tenth${t === 1 ? '' : 's'}" has ${w} whole${w === 1 ? '' : 's'} and ${t} tenth${t === 1 ? '' : 's'}.`, `Tenths go just after the decimal point: ${x}.`, `So the number is ${x}.`], { q: `Write as a decimal: ${w ? `${words(w)} and ` : ''}${ONESW[t]} tenth${t === 1 ? '' : 's'}.`, visual: w === 0 ? { type: 'fraction', n: t, d: 10 } : null, expr: `${w}+${t}/10` });
  if (v === 1) { const y = `${r.int(10, 99)}.${t}`; return num(t, [`The tenths place is the first digit after the decimal point.`, `In ${y} that digit is ${t}.`, `So the answer is ${t}.`], { q: `Which digit is in the tenths place in ${y}?`, expr: `${t}` }); }
  return r.bool() ? num(t, [`${x} = ${w} + 0.${t}.`, `0.${t} is ${t} tenths: ${t}/10.`, `So ? = ${t}.`], { q: `${x} = ${w} + ?/10`, expr: `${t}` })
    : num(x, [`${t}/10 is ${t} tenths: 0.${t}.`, `${w} + 0.${t} = ${x}.`, `So the decimal is ${x}.`], { q: `Write ${w} + ${t}/10 as a decimal.`, expr: `${w}+${t}/10` });
});

// ───────────── 38. Decimal place value: up to hundredths ─────────────
skill('4-dechund', 4, 'Decimal place value', 'Hundredths', ['The second digit after the decimal point is the hundredths place.', '2.15 = 2 + 1/10 + 5/100, read "two and fifteen hundredths".', 'To round to the nearest tenth, look at the hundredths digit.'], (r) => {
  const v = r.int(0, 4), w = r.int(0, 20), h = r.int(1, 99), x = `${w}.${String(h).padStart(2, '0')}`, t = Math.floor(h / 10), o = h % 10;
  if (v === 0) return num(`0.${String(h).padStart(2, '0')}`, [`Each small square is 1/100 of the grid.`, `${h} squares is ${h}/100 = 0.${String(h).padStart(2, '0')}.`, `So the decimal is 0.${String(h).padStart(2, '0')}.`], { q: `A hundred grid has ${h} of its 100 squares shaded. What decimal is shaded?`, expr: `${h}/100` });
  if (v === 1) return num(x, [`"${w ? `${words(w)} and ` : ''}${w3(h)} hundredth${h === 1 ? '' : 's'}" has ${w} whole${w === 1 ? '' : 's'} and ${h} hundredth${h === 1 ? '' : 's'}.`, `${h} hundredths takes two places after the point: .${String(h).padStart(2, '0')}.`, `So the number is ${x}.`], { q: `Write as a decimal: ${w ? `${words(w)} and ` : ''}${w3(h)} hundredth${h === 1 ? '' : 's'}.`, expr: `${w}+${h}/100` });
  if (v === 2) {
    const which = r.pick(['tenths', 'hundredths']), dg = which === 'tenths' ? t : o;
    if (r.bool()) return num(dg, [`After the decimal point: tenths first, then hundredths.`, `In ${x} the ${which} digit is ${dg}.`, `So the answer is ${dg}.`], { q: `Which digit is in the ${which} place in ${x}?`, expr: `${dg}` });
    const val = which === 'tenths' ? (t / 10).toFixed(1) : (o / 100).toFixed(2);
    return num(val, [`The ${dg} is in the ${which} place.`, `${dg} ${which} = ${val}.`, `So the digit is worth ${val}.`], { q: `What is the value of the ${which} digit in ${x}?`, expr: `${dg}/${which === 'tenths' ? 10 : 100}` });
  }
  if (v === 3) {
    const toT = r.bool(), val = w + h / 100;
    const ans = toT ? (Math.round(w * 10 + h / 10 + 1e-9) / 10).toFixed(1) : String(Math.round(val + 1e-9));
    return num(ans, [toT ? `Look at the hundredths digit: ${o}.` : `Look at the tenths digit: ${t}.`, `${toT ? o : t} is ${(toT ? o : t) >= 5 ? '5 or more, so round up' : 'less than 5, so round down'}.`, `So ${x} rounds to ${ans}.`], { q: `Round ${x} to the nearest ${toT ? 'tenth' : 'whole number'}.`, expr: toT ? `Math.round(${w * 100 + h}/10)/10` : `Math.round(${w * 100 + h}/100)` });
  }
  return num(o, [`${x} = ${w} + ${t}/10 + ${o}/100.`, `The hundredths part is ${o}/100.`, `So ? = ${o}.`], { q: `${x} = ${w} + ${t}/10 + ?/100`, expr: `${o}` });
});

// ───────────── 39. Compare decimals ─────────────
skill('4-deccompare', 4, 'Compare decimals', 'Compare decimals', ['Line up the decimal points and compare from the left.', 'Adding a zero at the end does not change a decimal: 0.4 = 0.40.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const t = r.int(1, 9), w = r.int(0, 9), right = `${w}.${t}0`;
    return mc(r, right, [`${w}.0${t}`, `${w + t}.0`, `${t}.${w}`].filter((x) => x !== right), { q: `Which decimal is equal to ${w}.${t}?`, steps: [`${w}.${t} has ${t} tenths. ${t} tenths = ${t * 10} hundredths.`, `So ${w}.${t} = ${right}.`] });
  }
  const hund = v === 2, a = hund ? r.int(100, 999) / 100 : r.int(10, 99) / 10; let b = hund ? (r.bool() ? Math.round(a * 10) / 10 + r.pick([0.05, -0.05, 0.1]) : r.int(100, 999) / 100) : r.int(10, 99) / 10;
  b = Math.max(0.01, Number(b.toFixed(2)));
  const sa = hund ? String(Number(a.toFixed(2))) : a.toFixed(1), sb = hund ? String(b) : b.toFixed(1), s = a > b ? '>' : a < b ? '<' : '=';
  return mc(r, s, signWrongs(s), { q: `${sa} ? ${sb}`, say: `Which sign goes between ${sa} and ${sb}?`, visual: hund ? null : numberLine(0, 10, { marks: [a, b] }), steps: [`Line up the points: ${a.toFixed(2)} and ${b.toFixed(2)}.`, `Compare place by place from the left: ${sa} ${s} ${sb}.`] });
});

// ───────────── 40. Order decimals ─────────────
skill('4-decorder', 4, 'Order decimals', 'Put decimals in order', ['Write every number with the same number of decimal places.', 'Then compare them like whole numbers.'], (r) => {
  const hund = r.bool(), w = r.int(0, 9), set = new Set(); while (set.size < 4) set.add(hund ? w * 100 + r.int(0, 199) : w * 10 + r.int(0, 25));
  const vals = [...set].map((x) => (hund ? x / 100 : x / 10)), show = (x) => (hund ? String(Number(x.toFixed(2))) : x.toFixed(1)), up = r.bool();
  const sorted = [...vals].sort((a, b) => (up ? a - b : b - a)), sep = up ? ' < ' : ' > ';
  return mc(r, sorted.map(show).join(sep), perms(r, vals.map(show), sep), { q: `Put these in order from ${up ? 'least to greatest' : 'greatest to least'}: ${vals.map(show).join(', ')}`, steps: [`Write them all with ${hund ? 2 : 1} decimal place${hund ? 's' : ''}: ${vals.map((x) => x.toFixed(hund ? 2 : 1)).join(', ')}.`, `In order: ${sorted.map(show).join(sep)}.`] });
});

// ───────────── 41. Relate fractions and decimals ─────────────
skill('4-dectofrac', 4, 'Fractions and decimals', 'Decimals as fractions', ['0.7 is 7 tenths = 7/10.', '0.35 is 35 hundredths = 35/100.'], (r) => {
  const v = r.int(0, 2);
  if (v === 0) {
    const hund = r.bool(), n = hund ? r.int(1, 99) : r.int(1, 9), s = hund ? (n / 100).toFixed(2) : (n / 10).toFixed(1), d = hund ? 100 : 10;
    return num(n, [`${s} has ${hund ? 'two' : 'one'} decimal place${hund ? 's' : ''}, so it is ${hund ? 'hundredths' : 'tenths'}.`, `${s} = ${n}/${d}.`, `So ? = ${n}.`], { q: `${s} = ?/${d}`, expr: `${s}*${d}` });
  }
  if (v === 1) {
    const w = r.int(1, 9), n = r.int(1, 99), s = `${w}.${String(n).padStart(2, '0')}`;
    return num(`${w * 100 + n}/100`, [`${s} is ${w} and ${n} hundredths.`, `${w} = ${w * 100}/100, so ${s} = ${w * 100 + n}/100.`, `So the fraction is ${w * 100 + n}/100.`], { q: `Write ${s} as a fraction with a denominator of 100.`, expr: `${w * 100 + n}/100`, accept: [`${w} ${n}/100`] });
  }
  const n = r.int(1, 9), right = `0.${n}`;
  return mc(r, right, [`0.0${n}`, `${n}.0`, `0.${10 - n === n ? n + 1 : 10 - n}`], { q: 'Which decimal does the model show?', visual: { type: 'fraction', n, d: 10 }, steps: [`The bar has 10 equal parts and ${n} are shaded: ${n}/10.`, `${n}/10 = ${right}.`] });
});
skill('4-decline', 4, 'Fractions and decimals', 'Decimals on number lines', ['Between 0 and 1 there are 10 tenths; between two tenths there are 10 hundredths.', 'Fractions with 10 or 100 on the bottom are easy to write as decimals.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const k = 2 * r.int(0, 14) + 1, x = (k / 10).toFixed(1); return num(x, [`Each small step is 0.1.`, `The point is ${k} steps from 0: ${k} × 0.1 = ${x}.`, `So the point is at ${x}.`], { q: 'What decimal is at the red point?', visual: numberLine(0, 3, { step: 0.1, marks: [k / 10] }), expr: `${k}/10` }); }
  if (v === 1) { const a = r.int(0, 7) / 10, k = 2 * r.int(0, 14) + 1, x = (a + k / 100).toFixed(2); return num(x, [`From ${a.toFixed(1)} each small step is 0.01.`, `The point is ${k} steps past ${a.toFixed(1)}: ${a.toFixed(1)} + ${(k / 100).toFixed(2)} = ${x}.`, `So the point is at ${x}.`], { q: 'What decimal is at the red point?', visual: numberLine(a, a + 0.3, { step: 0.01, marks: [a + k / 100] }), expr: `${Math.round(a * 100) + k}/100` }); }
  if (v === 2) { const t = r.int(0, 8), w = r.int(0, 5), lo = `${w}.${t}`, hi = (w + (t + 1) / 10).toFixed(1), mid = `${w}.${t}5`; return num(mid, [`${lo} = ${lo}0 and ${hi} = ${hi}0.`, `Halfway between ${t}0 and ${t + 1}0 hundredths is ${t}5 hundredths.`, `So the halfway point is ${mid}.`], { q: `What decimal is halfway between ${lo} and ${hi}?`, expr: `(${lo}+${hi})/2` }); }
  const [n, d] = r.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 20], [7, 20], [3, 25], [9, 50], [1, 10], [7, 10], [13, 100]]), k = 100 / d, ans = dec(n / d);
  return num(ans, [`Make the denominator 10 or 100: multiply top and bottom by ${k}.`, `${n}/${d} = ${n * k}/100 = ${ans}.`, `So ${n}/${d} = ${ans}.`], { q: `Write ${n}/${d} as a decimal.`, expr: `${n}/${d}` });
});

// ───────────── 42. Compare decimals and fractions ─────────────
skill('4-decfraccomp', 4, 'Compare decimals and fractions', 'Compare decimals and fractions', ['Change the fraction to a decimal (or the decimal to a fraction).', 'Then compare the two decimals.'], (r) => {
  const v = r.int(0, 2); let fn, fd;
  if (v === 0) { fd = 10; fn = r.int(1, 9); } else if (v === 1) { fd = 100; fn = r.int(1, 99); } else [fn, fd] = r.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]]);
  const fv = fn / fd, dv = r.bool(0.2) ? fv : Number((fv + r.pick([-0.2, -0.1, -0.05, -0.01, 0.01, 0.05, 0.1, 0.2])).toFixed(2));
  const ddv = Math.min(0.99, Math.max(0.01, dv)), ds = String(Number(ddv.toFixed(2))), s = fv > ddv + 1e-9 ? '>' : fv < ddv - 1e-9 ? '<' : '=';
  return mc(r, s, signWrongs(s), { q: `${fn}/${fd} ? ${ds}`, say: `Which sign goes between ${fn} over ${fd} and ${ds}?`, steps: [`Write the fraction as a decimal: ${fn}/${fd} = ${dec(fv)}.`, `Compare ${dec(fv)} and ${ds}: ${fn}/${fd} ${s} ${ds}.`] });
});

// ───────────── 43. Add and subtract decimals up to tenths ─────────────
const t1 = (r, lo, hi) => r.int(lo, hi) / 10;
skill('4-decadd1', 4, 'Add and subtract decimals', 'Add and subtract tenths', ['Line up the decimal points, then add or subtract like whole numbers.', 'Bring the decimal point straight down into the answer.'], (r) => {
  const v = r.int(0, 4), a = t1(r, 11, 199), b = t1(r, 11, 199), A = a.toFixed(1), B = b.toFixed(1);
  if (v === 0) return num(dec(a + b), columnAdd([A, B]), { q: `${A} + ${B} = ?`, expr: `${A}+${B}` });
  const [hi, lo] = a >= b ? [A, B] : [B, A];
  if (v === 1) return num(dec(Math.abs(a - b)), columnSub(hi, lo), { q: `${hi} − ${lo} = ?`, expr: `${hi}-${lo}` });
  if (v === 2) {
    const name = nm(r);
    return r.bool() ? num(dec(a + b), [`Add the two distances: ${A} + ${B}.`, ...columnAdd([A, B]).slice(-1), `So ${name} ran ${dec(a + b)} km.`], { q: `${name} ran ${A} km on Monday and ${B} km on Tuesday. How many kilometres is that in all?`, expr: `${A}+${B}` })
      : num(dec(Math.abs(a - b)), [`Find the difference: ${hi} − ${lo}.`, ...columnSub(hi, lo).slice(-1), `So the difference is ${dec(Math.abs(a - b))} kg.`], { q: `A pumpkin has a mass of ${hi} kg and a squash has a mass of ${lo} kg. How much heavier is the pumpkin, in kg?`, expr: `${hi}-${lo}` });
  }
  if (v === 3) { const c = t1(r, 11, 99).toFixed(1); return num(dec(a + b + Number(c)), columnAdd([A, B, c]), { q: `${A} + ${B} + ${c} = ?`, expr: `${A}+${B}+${c}` }); }
  return num(dec(Math.abs(a - b)), [`Missing part = total − known part.`, `${hi} − ${lo} = ${dec(Math.abs(a - b))}.`, `So ? = ${dec(Math.abs(a - b))}.`], { q: `${lo} + ? = ${hi}`, expr: `${hi}-${lo}` });
});
skill('4-decpat1', 4, 'Add and subtract decimals', 'Tenths: patterns, estimates and comparisons', ['A decimal pattern adds or subtracts the same amount each time.', 'To estimate, round each decimal to the nearest whole number first.'], (r) => {
  const v = r.int(0, 3);
  if (v === 0) { const s = r.int(1, 50), k = r.int(1, 9), up = r.bool(), seq = [0, 1, 2, 3].map((i) => (s + (up ? 1 : -1) * i * k + (up ? 0 : 4 * k)) / 10), nx = dec(seq[3] + (up ? k : -k) / 10); return num(nx, [`Each number ${up ? 'goes up' : 'goes down'} by ${(k / 10).toFixed(1)}.`, `${seq[3].toFixed(1)} ${up ? '+' : '−'} ${(k / 10).toFixed(1)} = ${nx}.`, `So the next number is ${nx}.`], { q: `What comes next? ${seq.map((x) => x.toFixed(1)).join(', ')}, ?`, expr: `${seq[3].toFixed(1)}${up ? '+' : '-'}${k / 10}` }); }
  const a = t1(r, 11, 99), b = t1(r, 11, 99);
  if (v === 1) { const L = a + b, R = Number((L + r.pick([-0.3, -0.1, 0, 0.2, 0.5])).toFixed(1)), s = L > R + 1e-9 ? '>' : L < R - 1e-9 ? '<' : '='; return mc(r, s, signWrongs(s), { q: `${a.toFixed(1)} + ${b.toFixed(1)} ? ${R.toFixed(1)}`, say: `Which sign goes between ${a.toFixed(1)} plus ${b.toFixed(1)} and ${R.toFixed(1)}?`, steps: [`${a.toFixed(1)} + ${b.toFixed(1)} = ${dec(L)}.`, `${dec(L)} ${s} ${R.toFixed(1)}.`] }); }
  if (v === 2) { const ra = Math.round(a), rb = Math.round(b), add = r.bool() || a < b, e = add ? ra + rb : ra - rb; return num(e, [`Round to the nearest whole number: ${a.toFixed(1)} → ${ra} and ${b.toFixed(1)} → ${rb}.`, `${ra} ${add ? '+' : '−'} ${rb} = ${e}.`, `So the estimate is ${e}.`], { q: `Estimate ${a.toFixed(1)} ${add ? '+' : '−'} ${b.toFixed(1)} by rounding each number to the nearest whole number.`, expr: `Math.round(${a})${add ? '+' : '-'}Math.round(${b})` }); }
  const T = r.int(30, 120) / 10, x = r.int(5, Math.round(T * 10) - 5) / 10, y = Number((T - x).toFixed(1));
  return mc(r, `${x.toFixed(1)} and ${y.toFixed(1)}`, [`${x.toFixed(1)} and ${(y + 0.1).toFixed(1)}`, `${(x + 1).toFixed(1)} and ${y.toFixed(1)}`, `${x.toFixed(1)} and ${(y + 1).toFixed(1)}`], { q: `Which two decimals add up to ${T.toFixed(1)}?`, steps: ['Add each pair.', `${x.toFixed(1)} + ${y.toFixed(1)} = ${T.toFixed(1)}.`] });
});

// ───────────── 44. Add and subtract decimals up to hundredths ─────────────
const h2 = (r, lo, hi) => r.int(lo, hi) / 100;
skill('4-decadd2', 4, 'Add and subtract decimals', 'Add and subtract hundredths', ['Line up the decimal points. Write a 0 at the end if a number has fewer decimal places.', 'Add or subtract each place, starting with the hundredths.'], (r) => {
  const v = r.int(0, 4), a = h2(r, 101, 1999), b = h2(r, 101, 1999), A = a.toFixed(2), B = b.toFixed(2), [hi, lo] = a >= b ? [A, B] : [B, A];
  if (v === 0) return num(dec(a + b), columnAdd([A, B]), { q: `${A} + ${B} = ?`, expr: `${A}+${B}` });
  if (v === 1) return num(dec(Math.abs(a - b)), columnSub(hi, lo), { q: `${hi} − ${lo} = ?`, expr: `${hi}-${lo}` });
  if (v === 2) {
    const name = nm(r);
    return r.bool() ? num(dec(a + b), [`Add the two lengths: ${A} + ${B}.`, ...columnAdd([A, B]).slice(-1), `So the total is ${dec(a + b)} m.`], { q: `${name} has two pieces of rope, ${A} m and ${B} m long. How many metres of rope is that altogether?`, expr: `${A}+${B}` })
      : num(dec(Math.abs(a - b)), [`Take the used part away: ${hi} − ${lo}.`, ...columnSub(hi, lo).slice(-1), `So ${dec(Math.abs(a - b))} L is left.`], { q: `A tank holds ${hi} L of water. ${name} uses ${lo} L. How many litres are left?`, expr: `${hi}-${lo}` });
  }
  if (v === 3) { const c = h2(r, 11, 999).toFixed(2); return num(dec(a + b + Number(c)), columnAdd([A, B, c]), { q: `${A} + ${B} + ${c} = ?`, expr: `${A}+${B}+${c}` }); }
  return num(hi, [`Undo the subtraction by adding.`, `${dec(Math.abs(a - b))} + ${lo} = ${hi}.`, `So ? = ${hi}.`], { q: `? − ${lo} = ${dec(Math.abs(a - b))}`, expr: `${dec(Math.abs(a - b))}+${lo}` });
});
skill('4-decmore', 4, 'Add and subtract decimals', 'Hundredths: more, less, patterns and estimates', ['0.1 more changes the tenths digit; 0.01 more changes the hundredths digit.', 'Round to the nearest whole number to estimate.'], (r) => {
  const v = r.int(0, 3), x = h2(r, 100, 999), X = x.toFixed(2);
  if (v === 0) { const amt = r.pick([0.1, 0.01]), up = r.bool(), ans = dec(up ? x + amt : x - amt); return num(ans, [`${amt === 0.1 ? 'One tenth' : 'One hundredth'} ${up ? 'more' : 'less'} changes the ${amt === 0.1 ? 'tenths' : 'hundredths'} place.`, `${X} ${up ? '+' : '−'} ${amt} = ${ans}.`, `So the answer is ${ans}.`], { q: `What is ${amt} ${up ? 'more' : 'less'} than ${X}?`, expr: `${X}${up ? '+' : '-'}${amt}` }); }
  if (v === 1) { const k = r.pick([5, 10, 15, 20, 25]), seq = [0, 1, 2, 3].map((i) => x + i * k / 100), nx = dec(x + 4 * k / 100); return num(nx, [`Each number goes up by ${(k / 100).toFixed(2)}.`, `${seq[3].toFixed(2)} + ${(k / 100).toFixed(2)} = ${nx}.`, `So the next number is ${nx}.`], { q: `What comes next? ${seq.map((y) => y.toFixed(2)).join(', ')}, ?`, expr: `${x}+4*${k / 100}` }); }
  const b = h2(r, 100, 999), B = b.toFixed(2);
  if (v === 2) { const L = x + b, R = Number((L + r.pick([-0.05, -0.01, 0, 0.01, 0.1])).toFixed(2)), s = L > R + 1e-9 ? '>' : L < R - 1e-9 ? '<' : '='; return mc(r, s, signWrongs(s), { q: `${X} + ${B} ? ${R.toFixed(2)}`, say: `Which sign goes between ${X} plus ${B} and ${R.toFixed(2)}?`, steps: [`${X} + ${B} = ${dec(L)}.`, `${dec(L)} ${s} ${R.toFixed(2)}.`] }); }
  const rx = Math.round(x), rb = Math.round(b), add = r.bool() || x < b, e = add ? rx + rb : rx - rb;
  return num(e, [`Round each number to the nearest whole number: ${X} → ${rx} and ${B} → ${rb}.`, `${rx} ${add ? '+' : '−'} ${rb} = ${e}.`, `So the estimate is ${e}.`], { q: `Estimate ${X} ${add ? '+' : '−'} ${B} by rounding each number to the nearest whole number.`, expr: `Math.round(${x})${add ? '+' : '-'}Math.round(${b})` });
});

// ───────────── 45. Probability ─────────────
const COLS = ['red', 'blue', 'green', 'yellow'];
skill('4-prob', 4, 'Probability', 'Chance and probability', ['Impossible means it cannot happen; certain means it must happen.', 'Probability = favourable outcomes ÷ all outcomes, like 3 red out of 10 marbles = 3/10.'], (r) => {
  const v = r.int(0, 3), [c1, c2, c3] = r.shuffle(COLS); let a = r.int(1, 9), b = r.int(1, 9); while (b === a) b = r.int(1, 9);
  if (v === 0) { const lo = r.int(1, 3), hi = r.int(lo * 3, 12); [a, b] = r.bool() ? [lo, hi] : [hi, lo]; }
  const bag = `A bag has ${a} ${c1} marble${a === 1 ? '' : 's'} and ${b} ${c2} marble${b === 1 ? '' : 's'}.`;
  if (v === 0) {
    const P = r.int(0, 3), ev = [`a ${c3} marble`, `a ${c1} or ${c2} marble`, `a ${a > b ? c1 : c2} marble`, `a ${a > b ? c2 : c1} marble`][P], right = ['Impossible', 'Certain', 'Probable', 'Unlikely'][P];
    return mc(r, right, ['Impossible', 'Certain', 'Probable', 'Unlikely'].filter((x) => x !== right), { q: `${bag} You pick one without looking. How likely is it that you pick ${ev}?`, steps: [['There are no marbles of that colour.', 'Every marble is one of those colours.', 'More than half the marbles are that colour.', 'Fewer than half the marbles are that colour.'][P], `So it is ${right.toLowerCase()}.`] });
  }
  if (v === 1) return num(`${a}/${a + b}`, [`There are ${a} + ${b} = ${a + b} marbles in all.`, `${a} of them are ${c1}, so the probability is ${a}/${a + b}.`, `The answer is ${a}/${a + b}.`], { q: `${bag} You pick one without looking. What is the probability of picking ${c1}? (Write a fraction.)`, expr: `${a}/${a + b}` });
  if (v === 2) {
    const d = r.pick([2, 4, 5, 10]), n = r.int(1, d - 1), spins = d * r.int(4, 12);
    return num(spins * n / d, [`The spinner lands on ${c1} ${n}/${d} of the time.`, `${n}/${d} of ${spins}: ${spins} ÷ ${d} = ${spins / d}, × ${n} = ${spins * n / d}.`, `So expect about ${spins * n / d} times.`], { q: `A spinner has ${d} equal parts and ${n} of them ${n === 1 ? 'is' : 'are'} ${c1}. If you spin it ${spins} times, about how many times should it land on ${c1}?`, visual: { type: 'fraction', n, d }, expr: `${spins}*${n}/${d}` });
  }
  const c = r.int(1, 9), counts = [a, b, c], cols = [c1, c2, c3], mx = Math.max(...counts);
  if (counts.filter((x) => x === mx).length > 1) counts[2] = mx + 1;
  const best = cols[counts.indexOf(Math.max(...counts))];
  return mc(r, best, cols.filter((x) => x !== best), { q: `A bag has ${counts[0]} ${c1}, ${counts[1]} ${c2} and ${counts[2]} ${c3} cubes. Which colour are you most likely to pick?`, steps: ['The colour with the most cubes is the most likely.', `${best} has the most, so ${best} is most likely.`] });
});

// ───────────── 46. Statistics ─────────────
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
skill('4-meanmode', 4, 'Statistics', 'Mode, mean and median', ['The mode is the value that appears most often.', 'The mean: add all the values and divide by how many there are.', 'The median is the middle value when the values are in order.'], (r) => {
  const v = r.int(0, 2), n = r.pick([5, 7]);
  if (v === 0) {
    const m = r.int(2, 30), others = new Set(); while (others.size < n - 3) { const x = r.int(2, 30); if (x !== m) others.add(x); }
    const data = r.shuffle([m, m, m, ...others]);
    return num(m, [`Count how many times each value appears.`, `${m} appears 3 times, more than any other value.`, `So the mode is ${m}.`], { q: `Find the mode: ${data.join(', ')}`, expr: `${m}` });
  }
  if (v === 1) {
    const k = r.pick([3, 4, 5]), avg = r.int(20, 40); let data = Array.from({ length: k - 1 }, () => avg + r.int(-5, 5)); const last = avg * k - data.reduce((s, x) => s + x, 0); data = r.shuffle([...data, last]);
    const tot = data.reduce((s, x) => s + x, 0);
    return num(avg, [`Add the values: ${data.join(' + ')} = ${tot}.`, `Divide by ${k}: ${tot} ÷ ${k} = ${avg}.`, `So the mean is ${avg}.`], { q: `Find the mean: ${data.join(', ')}`, expr: `(${data.join('+')})/${k}` });
  }
  const data = Array.from({ length: n }, () => r.int(1, 50)), sorted = [...data].sort((a, b) => a - b), med = sorted[(n - 1) / 2];
  return num(med, [`Put them in order: ${sorted.join(', ')}.`, `The middle one (number ${(n + 1) / 2}) is ${med}.`, `So the median is ${med}.`], { q: `Find the median: ${data.join(', ')}`, expr: `${med}` });
});
skill('4-plotstats', 4, 'Statistics', 'Mean, median and mode from plots and charts', ['Each ✕ on a line plot is one value.', 'Write the values out from the plot, then find the mode, mean or median.'], (r) => {
  const v = r.int(0, 2), labels = [1, 2, 3, 4, 5]; let counts;
  do counts = labels.map(() => r.int(0, 4)); while (counts.reduce((a, b) => a + b, 0) < 5 || counts.reduce((a, b) => a + b, 0) % 2 === 0 || counts.filter((c) => c === Math.max(...counts)).length > 1);
  const data = labels.flatMap((l, i) => Array(counts[i]).fill(l)), vis = { type: 'table', head: ['Goals scored', ...labels], rows: [['Games', ...counts.map((c) => '✕'.repeat(c) || '–')]] };
  if (v === 0) { const m = labels[counts.indexOf(Math.max(...counts))]; return num(m, [`Find the tallest stack of ✕ marks.`, `${m} has ${Math.max(...counts)} marks, the most.`, `So the mode is ${m}.`], { q: 'The line plot shows goals scored in each game. What is the mode?', visual: vis, expr: `${m}` }); }
  if (v === 1) {
    const N = data.length, med = data[(N - 1) / 2];
    return num(med, [`List the values in order: ${data.join(', ')}.`, `There are ${N} values; the middle is ${med}.`, `So the median is ${med}.`], { q: 'The line plot shows goals scored in each game. What is the median?', visual: vis, expr: `${med}` });
  }
  const names = r.shuffle(NAMES).slice(0, 4), k = 4, avg = r.int(25, 40); let vals = Array.from({ length: k - 1 }, () => avg + r.int(-8, 8)); vals = [...vals, avg * k - vals.reduce((a, b) => a + b, 0)];
  const tot = vals.reduce((a, b) => a + b, 0);
  return num(avg, [`Add the books: ${vals.join(' + ')} = ${tot}.`, `Divide by ${k} students: ${tot} ÷ ${k} = ${avg}.`, `So the mean is ${avg} books.`], { q: 'The chart shows how many books each student read this year. What is the mean number of books?', visual: { type: 'bars', labels: names, values: vals, title: 'Books read' }, expr: `(${vals.join('+')})/${k}` });
});

export default list;
