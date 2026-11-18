// Marking a typed answer. Numbers are compared as numbers, so 0.5, 1/2 and .5 are all the same answer, unless the
// question asks for a form (simplest fraction). Node-safe: the checker uses it too.
const clean = (s) => String(s ?? '').trim().replace(/[−–—]/g, '-').replace(/ /g, ' ').replace(/,(?=\d{3}\b)/g, '').replace(/\s+/g, ' ');

export function parseNumber(s) {
  let t = clean(s).replace(/^[a-z]\s*=\s*/i, '').replace(/^\$/, '').replace(/\s*(%|°|cm²|cm³|cm|m²|m|units?|square units|cubic units)$/i, '').replace(/ /g, (m, i, str) => (/^-?\d+ \d+\/\d+$/.test(str) ? m : ''));
  let m;
  if ((m = t.match(/^(-?)(\d+) (\d+)\/(\d+)$/))) return (m[1] ? -1 : 1) * (Number(m[2]) + Number(m[3]) / Number(m[4]));
  if ((m = t.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/))) return Number(m[2]) === 0 ? NaN : Number(m[1]) / Number(m[2]);
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return Number(t);
  return NaN;
}
const simplestFraction = (s) => { const m = clean(s).match(/^-?(\d+)\/(\d+)$/); if (!m) return true; let [a, b] = [Number(m[1]), Number(m[2])]; while (b) [a, b] = [b, a % b]; return a === 1 && Number(m[2]) !== 1; };
const norm = (s) => clean(s).toLowerCase().replace(/[.!?]+$/, '').replace(/\s*([,:()])\s*/g, '$1').replace(/^(the|a|an) /, '');
const numbersIn = (s) => (clean(s).match(/-?\d*\.?\d+(\/\d+)?/g) ?? []).map(parseNumber);

// returns { right, reason? }
export function mark(item, given) {
  if (item.kind === 'mc') return { right: Number(given) === item.a };
  if (given == null || !String(given).trim()) return { right: false, reason: 'empty' };
  if (item.kind === 'num') {
    if ((item.accept ?? []).some((x) => norm(x) === norm(given))) return { right: true };
    const want = parseNumber(item.answer), got = parseNumber(given);
    if (Number.isNaN(got)) return { right: false, reason: 'not-a-number' };
    const tol = item.tol ?? 1e-6 * Math.max(1, Math.abs(want));
    const ok = Math.abs(want - got) <= tol;
    if (ok && item.exactForm === 'fraction' && !simplestFraction(given)) return { right: false, reason: 'simplify' };
    return { right: ok };
  }
  // text: exact (forgiving) match, or the same set of numbers
  if (item.numbers) {
    const got = numbersIn(given).sort((a, b) => a - b), want = [...item.numbers].sort((a, b) => a - b);
    return { right: got.length === want.length && got.every((x, i) => Math.abs(x - want[i]) < 1e-6) };
  }
  const g = norm(given);
  return { right: [item.answer, ...(item.accept ?? [])].some((a) => norm(a) === g) };
}

// spoken numbers → digits ("twenty five" → 25, "three point five" → 3.5, "minus four" → -4, "one half" → 1/2)
const ONES = { zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const DEN = { half: 2, halves: 2, third: 3, thirds: 3, quarter: 4, quarters: 4, fourth: 4, fourths: 4, fifth: 5, fifths: 5, sixth: 6, sixths: 6, seventh: 7, sevenths: 7, eighth: 8, eighths: 8, ninth: 9, ninths: 9, tenth: 10, tenths: 10 };
export function spokenToNumber(text) {
  let t = String(text).toLowerCase().replace(/-/g, ' ').replace(/\b(is|it's|its|the answer|answer|equals|i think|um|uh)\b/g, ' ').trim();
  if (/^-?[\d.,/ ]+$/.test(t.replace(/\s+/g, ''))) return t.replace(/\s+/g, '');
  const words = t.split(/\s+/).filter(Boolean);
  let sign = 1, total = 0, cur = 0, seen = false, i = 0, decimal = '';
  if (['minus', 'negative'].includes(words[0])) { sign = -1; i = 1; }
  for (; i < words.length; i++) {
    const w = words[i];
    if (/^\d+$/.test(w)) { cur += Number(w); seen = true; }
    else if (w in ONES) { cur += ONES[w]; seen = true; }
    else if (w in TENS) { cur += TENS[w]; seen = true; }
    else if (w === 'hundred') { cur = (cur || 1) * 100; seen = true; }
    else if (w === 'thousand') { total += (cur || 1) * 1000; cur = 0; seen = true; }
    else if (w === 'point') { decimal = words.slice(i + 1).map((x) => (x in ONES ? ONES[x] : /^\d$/.test(x) ? x : '')).join(''); break; }
    else if (w in DEN && seen) { return `${sign < 0 ? '-' : ''}${total + cur}/${DEN[w]}`; }
    else if (w === 'over' && seen) { const rest = spokenToNumber(words.slice(i + 1).join(' ')); return rest ? `${sign < 0 ? '-' : ''}${total + cur}/${rest}` : null; }
    else if (w === 'and') continue;
  }
  if (!seen) return null;
  return `${sign < 0 ? '-' : ''}${total + cur}${decimal ? '.' + decimal : ''}`;
}
