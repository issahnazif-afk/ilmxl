// Unit exams and worksheets: a set of questions for one unit (a grade's category, e.g. "Y. Two-dimensional
// figures") or for the whole grade. The same seed always gives the same set, so a worksheet can be printed again.
// Node-safe (scripts/check.mjs makes every unit's set).
import { skillsFor, variedItems, makeItem, gradeLabel, SUBJECTS } from './curriculum.mjs';
import { rng } from '../math/rng.mjs';

const letter = (i) => (i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(65 + (i % 26)).repeat(Math.floor(i / 26) + 1));
// a grade's units, in order: { code, name, skills }
export function unitsOf(subject, grade, province = 'NS') {
  const list = skillsFor(subject, grade, province).filter((s) => s.gen || s.items?.length);
  return [...new Set(list.map((s) => s.strand))].map((name, i) => ({ code: letter(i), name, skills: list.filter((s) => s.strand === name) }));
}
export const examKey = (subject, grade, code) => `${subject}/${grade}/${code}`;
export const UNIT_N = 10, GRADE_N = 25;

// examSet(subject, grade, code ('all' for the whole grade), { province, seed, n })
//  → { title, sub, key, units, items: [{ skill, item }] }
export function examSet(subject, grade, code, { province = 'NS', seed = 1, n } = {}) {
  const units = unitsOf(subject, grade, province);
  const whole = code === 'all';
  const picked = whole ? units : units.filter((u) => u.code === code);
  if (!picked.length) return null;
  const N = n ?? (whole ? GRADE_N : UNIT_N);
  const r = rng(seed);
  // spread the questions over the units, then over each unit's skills, as evenly as possible
  const skills = whole ? r.shuffle(picked).flatMap((u, k) => r.shuffle(u.skills).map((s, j) => ({ s, order: j * picked.length + k }))).sort((a, b) => a.order - b.order).map((x) => x.s)
    : r.shuffle(picked[0].skills);
  const per = new Map();
  for (let i = 0; i < N; i++) { const s = skills[i % skills.length]; per.set(s, (per.get(s) ?? 0) + 1); }
  const pools = new Map([...per].map(([s, k]) => [s, s.gen ? variedItems(s, k, seed * 31 + s.id.length * 977) : pick(s, k, r)]));
  const items = [];
  for (let i = 0; i < N; i++) { const s = skills[i % skills.length]; const it = pools.get(s).shift() ?? makeItem(s, seed + i * 7919); items.push({ skill: s, item: it }); }
  const unit = whole ? null : picked[0];
  return {
    key: examKey(subject, grade, code), units: picked,
    title: whole ? `${gradeLabel(grade)} ${subject === 'math' ? 'maths' : SUBJECTS[subject].name} exam` : `Unit ${unit.code}: ${unit.name}`,
    sub: `${SUBJECTS[subject].name} · ${gradeLabel(grade)}`,
    items: r.shuffle(items),
  };
}
// bank skills: k different questions from the bank
function pick(s, k, r) {
  const idx = r.shuffle(s.items.map((_, i) => i)).slice(0, k);
  return idx.map((i) => makeItem(s, i));
}
