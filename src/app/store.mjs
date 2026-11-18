// Learners and their progress, kept on this device only (no account, nothing sent anywhere: children's privacy).
// A family can keep several learners. A parent can save everything to a file and load it on another device.
//
// learner:  { id, name, grade, province, teacher, ways, colour, created, progress }
// progress: { skills: { [id]: Skill }, stars, days: [YYYY-MM-DD], log: [Entry], world: { gems, gates: { [skill]: 1 }, owned: [], placed: [] }, code: { [puzzle]: stars } }
// Skill:    { score (XL score 0–100), level (0–4), tries, right, streak, seen, learned?, due? }
const KEY = 'ilmxl-v1';
const today = () => new Date().toISOString().slice(0, 10);
let db = load();

function load() {
  try { const j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j?.learners) return j; } catch {}
  return { learners: [], current: null };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} listeners.forEach((f) => f()); }
const listeners = new Set();
export const onChange = (f) => { listeners.add(f); return () => listeners.delete(f); };

export const learners = () => db.learners;
export const current = () => db.learners.find((l) => l.id === db.current) ?? null;
export function choose(id) { db.current = id; save(); }
export function addLearner({ name, grade, province, teacher, ways, colour }) {
  const l = { id: Math.random().toString(36).slice(2, 10), name: name.trim().slice(0, 30), grade, province, teacher, ways, colour, created: Date.now(),
    progress: { skills: {}, stars: 0, days: [], log: [], world: { gems: 0, gates: {}, owned: [], placed: [] }, code: {} } };
  db.learners.push(l); db.current = l.id; save(); return l;
}
export function updateLearner(id, f) { const l = db.learners.find((x) => x.id === id); if (l) { f(l); save(); } }
export function removeLearner(id) { db.learners = db.learners.filter((l) => l.id !== id); if (db.current === id) db.current = db.learners[0]?.id ?? null; save(); }

// the parents' area: a sum to answer (keeps young children out; it is not a password)
export const parentGate = () => { const a = 6 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7); return { q: `${a} × ${b}`, a: a * b }; };

// ── backup ──
export const exportAll = () => JSON.stringify({ app: 'ilmxl', v: 1, at: new Date().toISOString(), ...db }, null, 1);
export function importAll(text) {
  const j = JSON.parse(text);
  if (j.app !== 'ilmxl' || !Array.isArray(j.learners)) throw new Error('This is not an IlmXL backup file.');
  db = { learners: j.learners, current: j.current ?? j.learners[0]?.id ?? null }; save();
}

// ── mastery ──
// 0 Not started · 1 Tried · 2 Familiar (score ≥ 50) · 3 Proficient (score 100) · 4 Mastered (proficient, then right again on review)
export const LEVELS = ['Not started', 'Tried', 'Familiar', 'Proficient', 'Mastered'];
const REVIEW_DAYS = 3;

export const skillOf = (l, id) => l.progress.skills[id] ?? { score: 0, level: 0, tries: 0, right: 0, streak: 0, seen: 0 };
function put(l, id, f) { const p = l.progress; const s = { ...skillOf(l, id) }; f(s); p.skills[id] = s; touchDay(p); save(); return s; }
function touchDay(p) { const d = today(); if (p.days.at(-1) !== d) { p.days.push(d); if (p.days.length > 400) p.days.shift(); } }
function log(l, e) { const g = l.progress.log; g.push({ at: Date.now(), ...e }); if (g.length > 2000) g.splice(0, g.length - 2000); }

// The XL score: up fast at first, slower near the top; a mistake costs more the higher it is. The last stretch
// (90 to 100) needs answers right in a row. 100 = proficient. It measures steady accuracy, not how many were done.
export function nextScore(score, right, streak) {
  if (right) {
    const gain = score < 50 ? 12 : score < 75 ? 8 : score < 90 ? 5 : 2 + Math.min(streak, 3);
    return Math.min(100, score + gain);
  }
  const loss = score < 30 ? 3 : score < 60 ? 6 : score < 90 ? 8 : 10;
  return Math.max(0, score - loss);
}
export function answer(l, id, right, extra = {}) {
  return put(l, id, (s) => {
    s.tries++; if (right) { s.right++; s.streak++; } else s.streak = 0;
    s.score = nextScore(s.score, right, s.streak); s.seen = Date.now();
    s.level = Math.max(s.level, 1);
    if (s.score >= 50) s.level = Math.max(s.level, 2);
    if (s.score >= 100 && s.level < 3) { s.level = 3; s.due = Date.now() + REVIEW_DAYS * 864e5; }
    l.progress.stars += right ? (extra.bonus ?? 1) : 0;
    log(l, { skill: id, kind: extra.kind ?? 'practise', right });
  });
}
// review of a proficient skill: right → mastered; wrong → back to familiar
export function review(l, id, right) {
  return put(l, id, (s) => {
    if (right && s.level >= 3) { s.level = 4; s.due = null; }
    if (!right) { s.level = Math.min(s.level, 2); s.score = Math.min(s.score, 70); s.due = null; }
    s.seen = Date.now(); l.progress.stars += right ? 3 : 0;
    log(l, { skill: id, kind: 'review', right });
  });
}
export function learned(l, id) {
  return put(l, id, (s) => { s.learned = Date.now(); s.level = Math.max(s.level, 1); s.seen = Date.now(); l.progress.stars += 5; log(l, { skill: id, kind: 'learn' }); });
}
export function coded(l, puzzle, stars) {
  const c = l.progress.code; const first = !c[puzzle]; c[puzzle] = Math.max(stars, c[puzzle] ?? 0);
  l.progress.stars += stars * 2; if (first) l.progress.world.gems += 3;
  log(l, { puzzle, kind: 'code', stars }); touchDay(l.progress); save();
}
export function openGate(l, skill, gems) { const w = l.progress.world; if (!w.gates[skill]) { w.gates[skill] = Date.now(); w.gems += gems; } save(); }
export function buy(l, item, cost) { const w = l.progress.world; if (w.gems < cost || w.owned.includes(item)) return false; w.gems -= cost; w.owned.push(item); save(); return true; }
export function place(l, item) { const w = l.progress.world; w.placed = w.placed.includes(item) ? w.placed.filter((x) => x !== item) : [...w.placed, item]; save(); }
export function activity(l, kind, extra = {}) { log(l, { kind, ...extra }); l.progress.stars += extra.stars ?? 0; touchDay(l.progress); save(); }

export const dueReviews = (l) => Object.entries(l.progress.skills).filter(([, s]) => s.level === 3 && s.due && s.due <= Date.now()).map(([id]) => id);
export function streakDays(l) {
  const d = l.progress.days; if (!d.length) return 0;
  let n = 1; for (let i = d.length - 1; i > 0; i--) { if ((new Date(d[i]) - new Date(d[i - 1])) / 864e5 === 1) n++; else break; }
  return (new Date(today()) - new Date(d.at(-1))) / 864e5 <= 1 ? n : 0;
}
