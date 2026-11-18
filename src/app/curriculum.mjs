// The whole curriculum in one place: grades, subjects, every skill, and how to make a question for a skill.
// Node-safe (scripts/check.mjs imports it).
import MATH from '../math/skills.mjs';
import SCIENCE from '../content/science.mjs';
import ENGLISH from '../content/english.mjs';
import SOCIAL from '../content/social.mjs';
import { ACTIVITIES } from './activities.mjs';
import { rng } from '../math/rng.mjs';

export const GRADES = [
  { g: -1, label: 'Pre-K', short: 'PK', band: 'little' },
  { g: 0, label: 'Kindergarten', short: 'K', band: 'little' },
  ...Array.from({ length: 12 }, (_, i) => ({ g: i + 1, label: `Grade ${i + 1}`, short: String(i + 1), band: i + 1 <= 3 ? 'young' : i + 1 <= 8 ? 'middle' : 'high' })),
];
export const gradeLabel = (g) => GRADES.find((x) => x.g === g)?.label ?? `Grade ${g}`;
export const gradeShort = (g) => GRADES.find((x) => x.g === g)?.short ?? String(g);
export const bandOf = (g) => GRADES.find((x) => x.g === g)?.band ?? 'middle';
export const isYoung = (g) => g <= 3;

export const PROVINCES = [
  { id: 'NS', name: 'Nova Scotia', ready: true },
  { id: 'NB', name: 'New Brunswick' }, { id: 'PE', name: 'Prince Edward Island' }, { id: 'NL', name: 'Newfoundland and Labrador' },
  { id: 'QC', name: 'Quebec' }, { id: 'ON', name: 'Ontario' }, { id: 'MB', name: 'Manitoba' }, { id: 'SK', name: 'Saskatchewan' },
  { id: 'AB', name: 'Alberta' }, { id: 'BC', name: 'British Columbia' }, { id: 'YT', name: 'Yukon' }, { id: 'NT', name: 'Northwest Territories' }, { id: 'NU', name: 'Nunavut' },
];

export const SUBJECTS = {
  math: { id: 'math', name: 'Maths', colour: '#2563EB', soft: '#E3ECFD', icon: 'math', blurb: 'Numbers, shapes, algebra and more. Every question is made fresh.' },
  english: { id: 'english', name: 'English', colour: '#C2410C', soft: '#FDEBDD', icon: 'book', blurb: 'Phonics, grammar, vocabulary, reading and writing.' },
  science: { id: 'science', name: 'Science', colour: '#15803D', soft: '#DFF3E5', icon: 'flask', blurb: 'Life, Earth and space, matter, forces and energy.' },
  social: { id: 'social', name: 'Social Studies', colour: '#B91C1C', soft: '#FBE3E3', icon: 'leaf', blurb: 'Canada: its land, peoples, history and government.' },
  coding: { id: 'coding', name: 'Coding', colour: '#7C3AED', soft: '#EEE6FD', icon: 'code', blurb: 'Guide the robot with blocks: sequences, loops and ifs.' },
  activities: { id: 'activities', name: 'Activities', colour: '#DB2777', soft: '#FCE4F0', icon: 'star', blurb: 'Letters, numbers, colours, shapes and tracing for little learners.' },
};
export const LEARN_SUBJECTS = ['math', 'english', 'science', 'social'];

const tag = (subject) => (s) => ({ ...s, subject });
export const SKILLS = [...ACTIVITIES, ...MATH, ...ENGLISH.map(tag('english')), ...SCIENCE.map(tag('science')), ...SOCIAL.map(tag('social'))];
export const SKILL = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

// skills of a subject, for a grade (and the learner's province, for Social Studies)
export function skillsFor(subject, grade, province = 'NS') {
  return SKILLS.filter((s) => s.subject === subject && s.grade === grade && (!s.province || s.province === province));
}
export const gradesWith = (subject, province = 'NS') => [...new Set(SKILLS.filter((s) => s.subject === subject && (!s.province || s.province === province)).map((s) => s.grade))].sort((a, b) => a - b);

// ── questions ──
// A bank item ({ q, choices, a, why } or { q, answer, accept, why }) becomes the same shape a generator makes.
export function fromBank(it) {
  const steps = it.why ? [it.why] : [];
  if (it.choices) return { kind: 'mc', q: it.q, choices: it.choices, a: it.a, steps };
  const numeric = /^-?\d+(\.\d+)?$/.test(String(it.answer).trim());
  return { kind: numeric ? 'num' : 'text', q: it.q, answer: String(it.answer), accept: it.accept ?? [], steps };
}
// a question for a skill. `avoid` is a list of recent question texts not to repeat.
export const itemKey = (it) => it.q + '|' + (it.choices ?? []).join('|') + (it.visual ? JSON.stringify(it.visual) : '');
export function makeItem(skill, seed = Math.floor(Math.random() * 2 ** 31), avoid = []) {
  if (skill.gen) {
    let item, tries = 0;
    do { item = skill.gen(rng(seed + tries * 7919)); tries++; } while (avoid.includes(itemKey(item)) && tries < 8);
    return { ...item, seed };
  }
  const pool = skill.items.map((it, i) => [it, i]).filter(([it]) => !avoid.includes(itemKey(it)));
  const [it] = (pool.length ? pool : skill.items.map((x, i) => [x, i]))[seed % (pool.length || skill.items.length)];
  return { ...fromBank(it), seed };
}

// ── the teacher's lesson for a skill: [{ say, board }] then a question to check ──
export function lessonOf(skill) {
  if (skill.gen) {
    const lines = skill.lesson.map((t) => ({ say: speakable(t), board: t }));
    const ex = makeItem(skill, 12345);
    const worked = [{ say: "Let's do one together.", board: ex.q, visual: ex.visual }, ...(ex.steps ?? []).map((t) => ({ say: speakable(t), board: t }))];
    return { steps: [...lines, ...worked], check: makeItem(skill, 777) };
  }
  return { steps: skill.lesson.map((x) => ({ say: x.say, board: x.board ?? x.say })), check: skill.check ? fromBank(skill.check) : makeItem(skill, 1) };
}
// symbols the browser voice would misread, said in words
export function speakable(t) {
  return String(t)
    .replace(/(\d)\s*×\s*(\d)/g, '$1 times $2').replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ')
    .replace(/(\d+)\/(\d+)/g, '$1 over $2').replace(/≈/g, ' about ').replace(/√/g, 'the square root of ')
    .replace(/(\w)\^(\d+)/g, '$1 to the power $2').replace(/²/g, ' squared').replace(/³/g, ' cubed').replace(/°/g, ' degrees')
    .replace(/</g, ' is less than ').replace(/>/g, ' is greater than ').replace(/ = /g, ' equals ').replace(/→/g, ', so ').replace(/\s+/g, ' ').trim();
}
