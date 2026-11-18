// Checks every question IlmXL can ask, before every build:
//  · each maths generator, 400 seeds: a well-formed question, its own answer marked right, multiple-choice answers
//    present and unique, and (where the generator gives one) the answer re-computed from `expr` independently
//  · each written skill: fields present, at least 8 items, choices unique, the answer index in range
//  · each coding puzzle: its solution reaches the flag with every gem, within the block limit
//  · the answer marker itself, on known cases
import { SKILLS, makeItem, lessonOf, fromBank } from '../src/app/curriculum.mjs';
import { mark, parseNumber, spokenToNumber } from '../src/app/answer.mjs';
import { PUZZLES, parse, run, countBlocks } from '../src/app/coding.mjs';

const VISUALS = new Set(['bars', 'table', 'coins', 'poly', 'angle', 'plane', 'objects', 'groups', 'takeaway', 'tenframes', 'blocks', 'clock', 'fraction', 'shape', 'array', 'grid', 'coord', 'righttri', 'column', 'longdiv', 'numberline', 'fracbars', 'area', 'eqn']);
const fails = [];
const failCount = {};
const fail = (where, msg) => { const k = where.split(/[#\[ ]/)[0]; failCount[k] = (failCount[k] ?? 0) + 1; if (fails.length < 60) fails.push(`${where}: ${msg}`); else fails.length === 60 && fails.push('…'); };
let questions = 0;

function checkItem(where, it, generated = false) {
  if (!it || typeof it.q !== 'string' || !it.q.trim()) return fail(where, 'no question text');
  if (/undefined|NaN|\[object/.test(it.q)) fail(where, `bad text: ${it.q}`);
  if (it.kind === 'mc') {
    if (!Array.isArray(it.choices) || it.choices.length < 2) return fail(where, `too few choices: ${it.q}`);
    if (new Set(it.choices).size !== it.choices.length) fail(where, `repeated choice: ${it.q} → ${it.choices.join(' | ')}`);
    if (!(it.a >= 0 && it.a < it.choices.length)) fail(where, `answer not among choices: ${it.q} → ${it.choices.join(' | ')}`);
    if (it.choices.some((c) => /undefined|NaN/.test(c))) fail(where, `bad choice: ${it.choices.join(' | ')}`);
  } else if (it.kind === 'num' || it.kind === 'text') {
    if (it.answer == null || /undefined|NaN/.test(String(it.answer))) return fail(where, `no answer: ${it.q}`);
    if (!mark(it, it.answer).right) fail(where, `own answer marked wrong: ${it.q} → ${it.answer}`);
    if (it.kind === 'num' && Number.isNaN(parseNumber(it.answer))) fail(where, `answer is not a number: ${it.answer}`);
    for (const a of it.accept ?? []) if (!mark(it, a).right) fail(where, `accepted answer marked wrong: ${a}`);
  } else fail(where, `unknown kind ${it.kind}`);
  // worked steps: well formed, known pictures, and the working must reach the answer
  const steps = it.steps ?? [];
  steps.forEach((s, k) => {
    const t = typeof s === 'string' ? s : s?.text;
    if (!t || /undefined|NaN|\[object|Infinity/.test(t)) fail(where, `step ${k + 1} is broken: ${t}`);
    if (s?.say != null && /undefined|NaN|\[object/.test(s.say)) fail(where, `step ${k + 1} says: ${s.say}`);
    if (s?.visual && !VISUALS.has(s.visual.type)) fail(where, `step ${k + 1} has an unknown picture: ${s.visual.type}`);
  });
  if (generated && steps.length && (it.kind === 'num' || it.kind === 'text')) {
    const tail = steps.slice(-2).map((s) => (typeof s === 'string' ? s : s.text)).join(' ');
    const ans = String(it.answer), plain = ans.replace(/^-/, '−');
    const shown = [ans, plain, ans.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'), Number(ans).toLocaleString('en-CA')];
    const each = it.numbers ? it.numbers.every((x) => tail.includes(String(x)) || tail.includes(String(x).replace(/^-/, '−'))) : false;
    if (!each && !shown.some((x) => tail.includes(x))) fail(where, `the last steps never reach the answer ${ans}: "${tail.slice(0, 140)}"`);
  }
  if (it.expr) {
    let v; try { v = Function(`"use strict"; return (${it.expr});`)(); } catch (e) { return fail(where, `expr fails: ${it.expr}`); }
    const want = parseNumber(it.answer);
    const tol = it.tol ?? Math.max(1e-6, Math.abs(v) * 1e-9);
    if (!(Math.abs(v - want) <= Math.max(tol, 0.005 * (it.answer.includes('.') ? 1 : 0)))) fail(where, `answer ${it.answer} but ${it.expr} = ${v}`);
  }
  questions++;
}

// ONLY=math-4- npm run check: check just the skills whose id starts with that (for working on one grade)
const ONLY = process.env.ONLY ?? '';
const ids = new Set();
for (const s of SKILLS) {
  if (ONLY && !s.id.startsWith(ONLY)) continue;
  if (ids.has(s.id)) fail(s.id, 'duplicate id'); ids.add(s.id);
  if (!s.title || !s.subject || typeof s.grade !== 'number' || s.grade < -1 || s.grade > 12) fail(s.id, 'missing title/subject/grade');
  if (s.gen) {
    for (let seed = 1; seed <= 400; seed++) { let it; try { it = makeItem(s, seed * 104729); } catch (e) { fail(s.id, `seed ${seed}: ${e.message}`); continue; } checkItem(`${s.id}#${seed}`, it, true); }
    // variety: a generator should not give the same question every time
    const qs = new Set(Array.from({ length: 40 }, (_, i) => makeItem(s, i * 31 + 5).q + JSON.stringify(makeItem(s, i * 31 + 5).visual ?? '')));
    if (qs.size < 4) fail(s.id, `only ${qs.size} different questions`);
  } else {
    if (!Array.isArray(s.items) || s.items.length < 8) fail(s.id, `only ${s.items?.length ?? 0} items`);
    if (!Array.isArray(s.lesson) || !s.lesson.length || s.lesson.some((x) => !x.say)) fail(s.id, 'lesson missing or a step has no say');
    const seenQ = new Set();
    (s.items ?? []).forEach((it, i) => { const key = it.q + '|' + (it.choices ?? []).join('|'); if (seenQ.has(key)) fail(`${s.id}[${i}]`, 'repeated question'); seenQ.add(key); checkItem(`${s.id}[${i}]`, fromBank(it)); });
    if (s.check) checkItem(`${s.id} check`, fromBank(s.check));
  }
  try { const L = lessonOf(s); if (!L.steps.length) fail(s.id, 'empty lesson'); checkItem(`${s.id} lesson check`, L.check); } catch (e) { fail(s.id, `lesson: ${e.message}`); }
}

for (const p of PUZZLES) {
  try {
    const t = parse(p.solution), r = run(p, t), n = countBlocks(t);
    if (r.result !== 'win') fail(`puzzle ${p.id}`, `solution ends in ${r.result}`);
    if (n > p.limit) fail(`puzzle ${p.id}`, `solution uses ${n} blocks, limit ${p.limit}`);
    const used = p.solution.match(/\?[LRFW]|[FLR[{]/g) ?? [];
    for (const u of used) if (!p.tools.includes(u[0] === '?' ? u : u) && !(u.startsWith('?') && p.tools.includes('?') && (u !== '?W' || p.tools.includes('W')))) fail(`puzzle ${p.id}`, `solution needs ${u}, not in the toolbox`);
  } catch (e) { fail(`puzzle ${p.id}`, e.message); }
}

// the marker
const cases = [
  [{ kind: 'num', answer: '1/2' }, '0.5', true], [{ kind: 'num', answer: '1/2' }, '2/4', true], [{ kind: 'num', answer: '1/2', exactForm: 'fraction' }, '2/4', false],
  [{ kind: 'num', answer: '-3' }, '−3', true], [{ kind: 'num', answer: '1200' }, '1,200', true], [{ kind: 'num', answer: '1.5' }, '1 1/2', true],
  [{ kind: 'num', answer: '7' }, 'x = 7', true], [{ kind: 'num', answer: '7' }, '8', false], [{ kind: 'text', answer: '3 R 2', accept: ['3r2'] }, '3r2', true],
  [{ kind: 'text', answer: 'x', numbers: [-2, 5] }, '5, -2', true], [{ kind: 'text', answer: 'Halifax' }, 'halifax', true],
];
cases.forEach(([it, g, want], i) => { if (mark(it, g).right !== want) fail(`marker case ${i}`, `${g} vs ${it.answer} should be ${want}`); });
[['twenty five', '25'], ['minus four', '-4'], ['three point five', '3.5'], ['one half', '1/2'], ['12', '12'], ['one hundred and six', '106']].forEach(([s, w]) => { if (spokenToNumber(s) !== w) fail('spoken numbers', `"${s}" → ${spokenToNumber(s)}, want ${w}`); });

const by = {}; SKILLS.forEach((s) => (by[s.subject] = (by[s.subject] ?? 0) + 1));
if (fails.length) { console.error(`✗ ${fails.length} problem(s):\n  ` + fails.join('\n  ')); process.exit(1); }
console.log(`✓ ${SKILLS.length} skills (${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(', ')}), ${questions} questions checked, ${PUZZLES.length} puzzles solved`);
