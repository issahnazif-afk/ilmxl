// Each learner's path: the skills of their grade in every subject, today's plan, and the quest world's islands.
import { SKILL, SKILLS, LEARN_SUBJECTS, skillsFor } from './curriculum.mjs';
import { PUZZLES } from './coding.mjs';
import { skillOf, dueReviews } from './store.mjs';

// Pre-K: the activities and the Pre-K maths. From K: the grade's skills in the four subjects.
export function subjectsFor(l) { return l.grade < 0 ? ['activities', 'math'] : LEARN_SUBJECTS; }
export function pathFor(l, subject) {
  const list = skillsFor(subject, l.grade, l.province);
  // a Pre-K learner who has the Pre-K maths can start Kindergarten maths too
  if (subject === 'math' && l.grade < 0) return [...list, ...skillsFor('math', 0, l.province)].map((s) => s.id);
  return list.map((s) => s.id);
}
export const fullPath = (l) => subjectsFor(l).flatMap((s) => pathFor(l, s));

export const nextIn = (l, subject) => { const p = pathFor(l, subject); return p.find((id) => skillOf(l, id).level < 2) ?? p.find((id) => skillOf(l, id).level < 3) ?? null; };
export const nextPuzzle = (l) => PUZZLES.find((p) => !l.progress.code[p.id] && p.grade <= Math.max(0, l.grade) + 1) ?? null;

// how to start a skill: a lesson first the first time (or always first for those who like to watch and listen)
export function firstStep(l, id) {
  const s = skillOf(l, id);
  if (!s.learned && SKILL[id].subject !== 'activities') return 'learn';
  return 'practise';
}

// today's plan: a review if due, then the next skill in each subject (rotating which comes first by day), then coding
export function today(l) {
  const plan = [];
  const due = dueReviews(l);
  if (due.length) plan.push({ kind: 'review', title: 'Review time', text: `${due.length} skill${due.length > 1 ? 's' : ''} you were good at, to check you still are.` });
  const subs = subjectsFor(l);
  const day = new Date().getDate();
  const order = subs.map((_, i) => subs[(i + day) % subs.length]);
  for (const sub of order) {
    const id = nextIn(l, sub); if (!id) continue;
    const k = firstStep(l, id);
    plan.push({ kind: k, skill: id, subject: sub, title: SKILL[id].title, text: k === 'learn' ? 'A lesson with your teacher.' : skillOf(l, id).score ? `Your score is ${skillOf(l, id).score}. Keep going to 100.` : 'Practise until it is steady.' });
  }
  const pz = l.grade >= 0 && nextPuzzle(l);
  if (pz) plan.push({ kind: 'code', puzzle: pz.id, subject: 'coding', title: `Puzzle ${pz.id}: ${pz.title}`, text: 'Guide the robot with blocks.' });
  return plan.slice(0, l.grade < 0 ? 3 : 5);
}

export function summary(l, subject) {
  const p = subject ? pathFor(l, subject) : fullPath(l), lv = p.map((id) => skillOf(l, id).level);
  return { total: p.length, mastered: lv.filter((x) => x === 4).length, proficient: lv.filter((x) => x >= 3).length, familiar: lv.filter((x) => x >= 2).length, started: lv.filter((x) => x >= 1).length };
}

// ── the quest world: one island per subject; each skill of the learner's grade is a gate on that island ──
export const ISLANDS = {
  math: { name: 'Number Peaks', line: 'Mountains of numbers, where every gate is a puzzle of sums and shapes.' },
  english: { name: 'Story Shore', line: 'A beach of words. The gate-keepers speak only in good sentences.' },
  science: { name: 'Discovery Woods', line: 'A forest full of living things, rocks, magnets and light.' },
  social: { name: 'True North Trail', line: 'A trail across Canada, from coast to coast to coast.' },
  activities: { name: 'Little Meadow', line: 'Letters, numbers and colours grow here like flowers.' },
};
export const gatesFor = (l, subject) => pathFor(l, subject);
export const gateOpen = (l, subject, i) => i === 0 || !!l.progress.world.gates[gatesFor(l, subject)[i - 1]];
export const SHOP = [
  { id: 'tent', name: 'Camp tent', cost: 5 }, { id: 'tree', name: 'Maple tree', cost: 6 }, { id: 'lantern', name: 'Lantern', cost: 8 },
  { id: 'flag', name: 'Flag pole', cost: 10 }, { id: 'telescope', name: 'Telescope', cost: 14 }, { id: 'canoe', name: 'Canoe', cost: 16 },
  { id: 'lighthouse', name: 'Lighthouse', cost: 24 }, { id: 'rocket', name: 'Model rocket', cost: 30 }, { id: 'books', name: 'Book pile', cost: 9 }, { id: 'garden', name: 'Garden', cost: 12 },
];
export const allSkills = SKILLS;
