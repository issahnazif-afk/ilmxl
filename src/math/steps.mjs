// Worked steps, one idea per step, the way a teacher works at the board. Node-safe (scripts/check.mjs runs them).
// A step is { text, say?, visual? }:
//   text    what the board shows (maths symbols allowed; "^" for powers)
//   say     what the teacher says, when it differs from the text (otherwise the text is made speakable)
//   visual  a picture of the working at that moment (drawn by visual() in src/app/ui.mjs)
// A generator may still give plain strings; they are steps with text only.

export const PLACE = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
const UNIT = ['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand', 'million'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
export const S = (text, visual = null, say = null) => ({ text, ...(visual ? { visual } : {}), ...(say ? { say } : {}) });
const digitAt = (s, c) => (c < s.length && s[s.length - 1 - c] !== '.' ? Number(s[s.length - 1 - c]) : null);
const DEC = ['tenths', 'hundredths', 'thousandths'];
// line numbers up on the decimal point: "3.4", "12.75" → "3.40", "12.75" (dp = decimal places; 0 for whole numbers)
function lineUp(nums) {
  const strs = nums.map((x) => String(x));
  const dp = Math.max(...strs.map((t) => (t.split('.')[1] ?? '').length));
  return { dp, rows: strs.map((t) => { if (!dp) return t; const [i, f = ''] = t.split('.'); return `${i}.${f.padEnd(dp, '0')}`; }) };
}
// the name of column c (counted from the right) when there are dp decimal places; null for the point itself
const placeName = (c, dp) => (!dp ? PLACE[c] : c < dp ? DEC[dp - 1 - c] : c === dp ? null : PLACE[c - dp - 1]);
const nextCol = (c, dp) => (dp && c + 1 === dp ? c + 2 : c + 1);
const scaled = (t, dp) => Number(t.replace('.', ''));                       // "12.75" (dp 2) → 1275
const unscale = (n, dp) => (dp ? (n / 10 ** dp).toFixed(dp) : String(n));
const tidy = (t) => (t.includes('.') ? t.replace(/0+$/, '').replace(/\.$/, '') : t);

// ── column addition (two or more numbers; decimals are lined up on the point) ──
// visual: { type: 'column', op: '+', rows, result, carries: { col: digit }, hl }  (columns counted from the right;
// the decimal point takes a column of its own)
export function columnAdd(nums) {
  const { dp, rows } = lineUp(nums), width = Math.max(...rows.map((t) => t.length));
  const total = unscale(rows.reduce((a, t) => a + scaled(t, dp), 0), dp);
  const view = (result, carries, hl) => ({ type: 'column', op: '+', rows, result, carries: { ...carries }, hl });
  const steps = [S(dp ? 'Line up the decimal points, so each place is under the same place. Start on the right.' : 'Write the numbers in columns: ones under ones, tens under tens. Start with the ones.', view('', {}, 0))];
  let carry = 0, result = '';
  const carries = {};
  for (let c = 0; c < width; c++) {
    if (dp && c === dp) { result = '.' + result; continue; }
    const ds = rows.map((t) => digitAt(t, c)).filter((d) => d != null);
    const sum = ds.reduce((a, b) => a + b, 0) + carry;
    const last = c === width - 1, name = placeName(c, dp), up = placeName(nextCol(c, dp), dp);
    const parts = [...ds, ...(carry ? [carry] : [])].join(' + ');
    let text = ds.length === 1 && !carry ? `${cap(name)}: just ${sum}.` : `${cap(name)}: ${parts} = ${sum}${carry ? ` (with the ${carry} carried)` : ''}.`;
    if (last) { result = String(sum) + result; text += ` Write ${sum}.`; }
    else {
      result = String(sum % 10) + result;
      if (sum >= 10) { text += ` Write ${sum % 10} and carry ${Math.floor(sum / 10)} to the ${up}.`; carries[nextCol(c, dp)] = Math.floor(sum / 10); }
      else text += ` Write ${sum}.`;
    }
    carry = last ? 0 : Math.floor(sum / 10);
    steps.push(S(text, view(result, carries, c)));
  }
  const shown = rows.join(' + ');
  steps.push(S(`So ${shown} = ${total}${tidy(total) !== total ? `, which is ${tidy(total)}` : ''}.`));
  return steps;
}

// ── column subtraction a − b (a ≥ b ≥ 0; decimals lined up), regrouping across zeros ──
// visual: { type: 'column', op: '−', rows, result, above: { col: new digit(s) }, crossed: [cols], hl }
export function columnSub(a, b) {
  const { dp, rows } = lineUp([a, b]);
  const [A, B] = rows, n = A.length;
  const diff = unscale(scaled(A, dp) - scaled(B, dp), dp);
  const work = A.split('').reverse().map((ch) => (ch === '.' ? null : Number(ch)));
  const above = {}, crossed = new Set();
  const view = (result, hl) => ({ type: 'column', op: '−', rows, result, above: { ...above }, crossed: [...crossed], hl });
  const steps = [S(dp ? 'Line up the decimal points, so each place is under the same place. Start on the right.' : 'Write the numbers in columns: ones under ones, tens under tens. Start with the ones.', view('', 0))];
  let result = '';
  for (let c = 0; c < n; c++) {
    if (dp && c === dp) { result = '.' + result; continue; }
    const bd = digitAt(B, c) ?? 0;
    if (c >= B.length && work.slice(c).every((x) => x === 0 || x === null)) break;   // only regrouped-away zeros are left
    const name = placeName(c, dp);
    let text;
    if (work[c] < bd) {
      const had = work[c];
      let k = nextCol(c, dp); while (work[k] === 0) k = nextCol(k, dp);
      work[k] -= 1; above[k] = String(work[k]); crossed.add(k);
      for (let j = c + 1; j < k; j++) if (work[j] !== null) { work[j] = 9; above[j] = '9'; crossed.add(j); }
      work[c] += 10; above[c] = String(work[c]); crossed.add(c);
      const kn = placeName(k, dp), unit = kn.replace(/s$/, '').replace(/^ones$/, 'one');
      const how = k === nextCol(c, dp)
        ? `Regroup 1 ${unit} as 10 ${name}: the ${kn} digit becomes ${work[k]} and we now have ${work[c]} ${name}.`
        : `There are no ${placeName(nextCol(c, dp), dp)} to take from, so regroup 1 ${unit}: the ${kn} digit becomes ${work[k]}, each 0 in between becomes 9, and we now have ${work[c]} ${name}.`;
      text = `${cap(name)}: ${had} is less than ${bd}, so we regroup. ${how} ${work[c]} − ${bd} = ${work[c] - bd}.`;
    } else text = `${cap(name)}: ${work[c]} − ${bd} = ${work[c] - bd}.`;
    // a 0 in front of the answer is not written (but the 0 in 0.25 is)
    const intDigits = diff.split('.')[0].replace(/^0+(?=.)/, '').length, onesCol = dp ? dp + 1 : 0;
    const leading = c > onesCol && c - onesCol >= intDigits && work[c] - bd === 0;
    if (leading) text += ' A 0 at the front is not written.';
    else result = String(work[c] - bd) + result;
    steps.push(S(text, view(result, c)));
  }
  steps.push(S(`So ${A} − ${B} = ${diff}${tidy(diff) !== diff ? `, which is ${tidy(diff)}` : ''}.`));
  return steps;
}

// ── multiplication by one digit, column by column ──
export function columnMul1(a, d) {
  const A = String(a), rows = [A, String(d)];
  const carries = {};
  const view = (result, hl) => ({ type: 'column', op: '×', rows, result, carries: { ...carries }, hl });
  const steps = [S(`Multiply each digit of ${a} by ${d}, starting with the ones.`, view('', 0))];
  let carry = 0, result = '';
  for (let c = 0; c < A.length; c++) {
    const x = digitAt(A, c), p = x * d + carry, last = c === A.length - 1;
    let text = `${cap(PLACE[c])}: ${x} × ${d} = ${x * d}${carry ? `, plus the ${carry} carried = ${p}` : ''}.`;
    if (last) { result = String(p) + result; text += ` Write ${p}.`; }
    else {
      result = String(p % 10) + result;
      text += p >= 10 ? ` Write ${p % 10} and carry ${Math.floor(p / 10)}.` : ` Write ${p}.`;
      if (p >= 10) carries[c + 1] = Math.floor(p / 10);
    }
    carry = last ? 0 : Math.floor(p / 10);
    steps.push(S(text, view(result, c)));
  }
  steps.push(S(`So ${a} × ${d} = ${a * d}.`));
  return steps;
}

// ── multi-digit multiplication with partial products ──
// visual: { type: 'column', op: '×', rows: [a, b], partials: [...], result, hl }
export function columnMul(a, b) {
  const B = String(b);
  if (B.length === 1) return columnMul1(a, b);
  const rows = [String(a), B], partials = [];
  const view = (result = '') => ({ type: 'column', op: '×', rows, partials: [...partials], result, hl: -1 });
  const steps = [S(`Multiply ${a} by each digit of ${b}, one place at a time.`, view())];
  for (let c = 0; c < B.length; c++) {
    const d = digitAt(B, c); if (d === 0) { partials.push('0'.repeat(c + 1)); steps.push(S(`The ${PLACE[c]} digit is 0, so this row is 0.`, view())); continue; }
    const v = d * 10 ** c, p = a * v;
    partials.push(String(p));
    steps.push(S(c === 0 ? `Ones digit: ${a} × ${d} = ${p}.` : `${cap(PLACE[c])} digit: ${d} ${d === 1 ? UNIT[c] : PLACE[c]} is ${v}. ${a} × ${v} = ${p}.`, view()));
  }
  const ps = partials.map(Number).filter((x) => x > 0);
  if (ps.length > 1) steps.push(S(`Add the rows: ${ps.join(' + ')} = ${a * b}.`, view(String(a * b))));
  steps.push(S(`So ${a} × ${b} = ${a * b}.`));
  return steps;
}

// ── long division (whole numbers) ──
// visual: { type: 'longdiv', divisor, dividend, quotient, work: [{ v, at }] }  (`at` = index of the dividend digit
// the value ends under; each subtraction is a pair of lines)
export function longDivision(a, b) {
  const D = String(a), work = [];
  let q = '', cur = 0, started = false;
  const view = () => ({ type: 'longdiv', divisor: b, dividend: D, quotient: q, work: work.map((w) => ({ ...w })) });
  const steps = [S(`Divide ${a} by ${b}, one digit at a time from the left.`, view())];
  for (let i = 0; i < D.length; i++) {
    cur = cur * 10 + Number(D[i]);
    if (!started && cur < b && i < D.length - 1) { q += ' '; continue; }
    // the first digits were too small: say so, and start with enough digits
    const skipped = !started && i > 0 ? `${b} does not go into ${D.slice(0, i)}, so start with the first ${i + 1} digits: ${cur}. ` : '';
    started = true;
    const k = Math.floor(cur / b), take = k * b, left = cur - take;
    q += String(k);
    if (k === 0) {   // nothing to subtract: the digits carry on to the next bring-down
      steps.push(S(`${skipped}${b} does not go into ${cur}, so write 0 on top.`, view()));
    } else {
      if (work.length) work.push({ v: String(cur), at: i, kind: 'bring' });
      work.push({ v: String(take), at: i, kind: 'take' });
      steps.push(S(`${skipped}How many ${b}s are in ${cur}? ${k}, because ${k} × ${b} = ${take}${(k + 1) * b <= cur ? '' : ` and ${k + 1} × ${b} = ${(k + 1) * b} is too big`}. Write ${k} on top. Subtract: ${cur} − ${take} = ${left}.`, view()));
    }
    cur = left;
    if (i < D.length - 1) steps.push(S(`Bring down the next digit, ${D[i + 1]}: that makes ${cur * 10 + Number(D[i + 1])}.`, null));
  }
  const quot = Math.floor(a / b), rem = a % b;
  work.push({ v: String(rem), at: D.length - 1, kind: 'left' });
  steps.push(S(rem ? `Nothing left to bring down. ${rem} is left over: the remainder.` : 'Nothing is left over.', view()));
  steps.push(S(rem ? `So ${a} ÷ ${b} = ${quot} R ${rem}.` : `So ${a} ÷ ${b} = ${quot}.`, null, rem ? `So ${a} divided by ${b} is ${quot}, remainder ${rem}.` : null));
  return steps;
}

// ── a number line with jumps ──
// visual: { type: 'numberline', from, to, step, marks: [values], jumps: [{ from, to, label }] }
export const numberLine = (from, to, { step = 1, marks = [], jumps = [] } = {}) => ({ type: 'numberline', from, to, step, marks, jumps });

// ── fraction bars, one under the other (equal widths, so equal amounts line up) ──
export const fractionBars = (rows) => ({ type: 'fracbars', rows });   // rows: [{ n, d, label? }]

// ── equation lines with what was done to both sides ──
export const eqnLines = (lines) => ({ type: 'eqn', lines });          // lines: [{ eq, note? }]

// ── an area model for a × b (each split into place-value parts) ──
export const areaModel = (a, b) => {
  const parts = (n) => String(n).split('').map((d, i, s) => Number(d) * 10 ** (s.length - 1 - i)).filter((x) => x > 0);
  return { type: 'area', a: parts(a), b: parts(b) };
};

// the multiples of n up to k × n, for "skip count" steps
export const multiplesOf = (n, k) => Array.from({ length: k }, (_, i) => n * (i + 1));
