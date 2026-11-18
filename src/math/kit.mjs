// Shared helpers for the maths generators (src/math/skills.mjs and the grade files in src/math/more/).
// See the top of skills.mjs for the shape of an item.
export { gcd, lcm, simplify, frac, isPrime, dec, sgn, neg } from './rng.mjs';
export { S as St, columnAdd, columnSub, columnMul, longDivision, numberLine, fractionBars, eqnLines, areaModel, multiplesOf, PLACE } from './steps.mjs';
import { neg } from './rng.mjs';

export const par = (n) => (n < 0 ? `(${neg(n)})` : String(n));   // a negative number in brackets, for working
// multiple choice: the right answer plus wrong ones (repeats and NaN dropped), shuffled, at most 4
export const mc = (r, right, wrongs, extra = {}) => {
  const set = [...new Set([String(right), ...wrongs.map(String)])].filter((x) => x !== 'NaN');
  const choices = r.shuffle(set.slice(0, 4));
  return { kind: 'mc', choices, a: choices.indexOf(String(right)), ...extra };
};
// numeric distractors around a right answer (never negative)
export const near = (r, x, spread = 3) => { const s = new Set(); let guard = 0; while (s.size < 3 && guard++ < 50) { const d = r.nonzero(-spread, spread); if (x + d >= 0) s.add(x + d); } return [...s]; };
// a typed numeric answer
export const num = (answer, steps, extra = {}) => ({ kind: 'num', answer: String(answer), steps, ...extra });
// a typed short text answer (normalised match; `accept` for other forms)
export const txt = (answer, steps, extra = {}) => ({ kind: 'text', answer: String(answer), steps, ...extra });
export const OBJ = ['apple', 'star', 'ball', 'fish', 'leaf', 'heart'];
export const plural = (w, n) => (n === 1 ? w : w === 'fish' ? 'fish' : w === 'leaf' ? 'leaves' : `${w}s`);
export const NAMES = ['Amina', 'Yusuf', 'Maya', 'Liam', 'Noor', 'Ethan', 'Sofia', 'Omar', 'Chloe', 'Ali', 'Priya', 'Lucas', 'Fatima', 'Owen', 'Zara', 'Noah'];
export const comma = (n) => Number(n).toLocaleString('en-CA');

// a grade file makes its skills with `skill(id, grade, strand, title, lesson, gen)`; id is prefixed "math-"
export function grade() {
  const list = [];
  const skill = (id, g, strand, title, lesson, gen) => list.push({ id: `math-${id}`, subject: 'math', grade: g, strand, title, lesson, gen });
  return { skill, list };
}
