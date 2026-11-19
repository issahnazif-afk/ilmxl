// A unit exam (#/exam/<subject>/<grade>/<unit code>) or a whole-grade exam (…/all). Like a chapter test: no hints
// and no marking until the end, then the score, how each skill went, and every question with its worked solution.
import { el, icon, button, visual, mathText } from '../app/ui.mjs';
import { current, examOf, examDone, answer } from '../app/store.mjs';
import { SUBJECTS, isYoung } from '../app/curriculum.mjs';
import { examSet } from '../app/exams.mjs';
import { question } from '../app/question.mjs';
import { explain } from '../app/explain.mjs';
import { TEACHERS, teacherFigure, say, stopSpeaking } from '../app/teacher.mjs';

export default function (main, { args, go }) {
  const [subject, gs, code = 'all'] = args;
  const l = current(), grade = Number(gs), sub = SUBJECTS[subject];
  if (!sub || Number.isNaN(grade)) return go('');
  const T = TEACHERS[l.teacher] ?? TEACHERS.amina, fig = teacherFigure(T.id), young = isYoung(l.grade);
  let seed = Math.floor(Math.random() * 1e9);
  let set = examSet(subject, grade, code, { province: l.province ?? 'NS', seed });
  if (!set) return go(`subject/${subject}/${grade}`);
  main.style.setProperty('--sc', sub.colour); main.style.setProperty('--ss', sub.soft);
  main.classList.add('exam-view');
  const back = `#/subject/${subject}/${grade}`;
  const stage = el('div', { class: 'exam-stage' });
  main.append(el('a', { class: 'back', href: back }, icon('back'), `${sub.name} skills`), stage);
  let timer = null, alive = true;

  function intro() {
    const prev = examOf(l, set.key);
    const skills = [...new Set(set.items.map((x) => x.skill))];
    stage.replaceChildren(el('section', { class: 'exam-intro spot' },
      el('p', { class: 'kicker' }, set.sub, ' · ', code === 'all' ? 'Grade exam' : 'Unit exam'),
      el('h1', { class: 'h2' }, set.title),
      el('p', { class: 'lede' }, `${set.items.length} questions from ${skills.length} skill${skills.length === 1 ? '' : 's'}${code === 'all' ? ` across ${set.units.length} units` : ''}. There are no hints and nothing is marked until you finish; then you will see your score and the full working for every question.`),
      el('ul', { class: 'exam-skills' }, ...(code === 'all' ? set.units.map((u) => el('li', {}, `${u.code}. ${u.name}`)) : set.units[0].skills.map((s) => el('li', {}, s.title)))),
      prev ? el('p', { class: 'exam-prev' }, icon('chart'), `Last time: ${prev.last}% · best ${prev.best}% · ${prev.tries} ${prev.tries === 1 ? 'try' : 'tries'}`) : null,
      el('div', { class: 'row' },
        button([icon('play'), 'Start the exam'], run, 'btn btn-primary btn-lg'),
        el('a', { class: 'btn', href: `#/worksheet/${subject}/${grade}/${code}/${seed}` }, icon('pencil'), 'Printable worksheet')),
      el('div', { class: 'exam-teacher' }, fig, el('p', {}, `${T.name}: Take your time. Work it out on paper first, then answer.`))));
  }

  function run() {
    const answers = [];
    let k = 0;
    const t0 = Date.now();
    const bar = el('div', { class: 'exam-bar' }, el('i'));
    const count = el('span', { class: 'exam-count' }), clock = el('span', { class: 'exam-clock' }, icon('timer'), el('b', {}, '0:00'));
    const host = el('div', { class: 'exam-q' });
    stage.replaceChildren(el('div', { class: 'exam-top' }, el('div', {}, el('p', { class: 'kicker' }, set.sub), el('h1', { class: 'h3' }, set.title)), el('div', { class: 'exam-meta' }, count, clock)), bar, host);
    const tick = () => { const s = Math.floor((Date.now() - t0) / 1000); clock.lastChild.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
    timer = setInterval(tick, 1000);
    const next = () => {
      if (!alive) return;
      if (k >= set.items.length) return finish(answers, Math.round((Date.now() - t0) / 1000));
      const { item, skill } = set.items[k];
      count.textContent = `Question ${k + 1} of ${set.items.length}`;
      bar.firstChild.style.width = `${(100 * k) / set.items.length}%`;
      const skip = button('Skip', () => { answers.push({ skill, item, right: false, given: null }); k++; next(); }, 'btn btn-ghost btn-sm');
      const q = question(item, { teacher: T.id, fig, young, exam: true, onDone: (right, given) => {
        answers.push({ skill, item, right, given }); k++;
        skip.remove();
        const nb = button([k >= set.items.length ? 'Finish and see my score' : 'Next question', icon('next')], next, 'btn btn-primary');
        q.append(el('p', { class: 'exam-saved' }, icon('check'), 'Answer saved.'), el('div', { class: 'row' }, nb));
        setTimeout(() => nb.focus({ preventScroll: true }), 30);
      } });
      host.replaceChildren(q, el('div', { class: 'row exam-skip' }, skip));
      host.scrollIntoView({ block: 'nearest' });
    };
    next();
  }

  function finish(answers, secs) {
    clearInterval(timer);
    const right = answers.filter((a) => a.right).length, n = answers.length, pct = Math.round((100 * right) / n);
    for (const a of answers) if (a.given != null) answer(l, a.skill.id, a.right, { kind: 'exam' });
    const res = examDone(l, set.key, { right, n, secs });
    const verdict = pct >= 90 ? 'Excellent: this unit is mastered.' : pct >= 75 ? 'Well done: a strong result.' : pct >= 50 ? 'Good effort. Practise the skills marked below, then try again.' : 'This unit needs more practice. Start with the lessons below.';
    // by skill
    const by = new Map();
    for (const a of answers) { const x = by.get(a.skill) ?? { right: 0, n: 0 }; x.n++; if (a.right) x.right++; by.set(a.skill, x); }
    const rows = [...by].sort((a, b) => a[1].right / a[1].n - b[1].right / b[1].n).map(([s, x]) => el('tr', { class: x.right === x.n ? 'ok' : x.right ? 'part' : 'miss' },
      el('td', {}, s.title), el('td', { class: 'num' }, `${x.right} / ${x.n}`),
      el('td', {}, x.right === x.n ? el('span', { class: 'muted' }, 'Got it') : el('span', { class: 'row-links' }, el('a', { href: `#/learn/${s.id}` }, icon('board'), 'Lesson'), el('a', { href: `#/practise/${s.id}` }, icon('practise'), 'Practise')))));
    const review = answers.map((a, i) => {
      const it = a.item, rightAns = it.kind === 'mc' ? it.choices[it.a] : it.answer;
      const given = a.given == null ? 'Skipped' : it.kind === 'mc' ? it.choices[a.given] : a.given;
      const host = el('div');
      const steps = it.steps?.length ? button([icon('board'), 'See the working'], () => { b2.remove(); const ex = explain(it.steps, { teacher: T.id, fig, title: 'How to work it out', autoplay: false }); host.append(ex); ex.start(); }, 'btn btn-sm') : null;
      const b2 = steps;
      return el('li', { class: `exam-rev ${a.right ? 'ok' : 'miss'}` },
        el('div', { class: 'rev-head' }, el('span', { class: 'rev-n' }, String(i + 1)), icon(a.right ? 'check' : 'x', 'rev-ic'), el('span', { class: 'muted' }, a.skill.title)),
        el('p', { class: 'q-text' }, mathText(it.q)), visual(it.visual),
        el('p', { class: 'rev-ans' }, 'Your answer: ', el('b', {}, mathText(String(given))), a.right ? null : el('span', {}, ' · Correct answer: ', el('b', {}, mathText(String(rightAns))))),
        steps ? el('div', { class: 'row' }, steps) : null, host);
    });
    stage.replaceChildren(
      el('section', { class: 'exam-result spot' },
        el('div', { class: 'score-ring', style: `--p:${pct}` }, el('b', {}, `${pct}%`), el('small', {}, `${right} of ${n}`)),
        el('div', {}, el('p', { class: 'kicker' }, set.sub), el('h1', { class: 'h2' }, set.title), el('p', { class: 'lede' }, verdict),
          el('p', { class: 'muted' }, `Time: ${Math.floor(secs / 60)} min ${secs % 60} s · Best so far: ${res.best}% · +${Math.round(pct / 10)} stars`),
          el('div', { class: 'row' }, button([icon('practise'), 'Try a new exam'], () => { seed = Math.floor(Math.random() * 1e9); set = examSet(subject, grade, code, { province: l.province ?? 'NS', seed }); intro(); }, 'btn btn-primary'), el('a', { class: 'btn', href: back }, 'Back to the skills')))),
      el('h2', { class: 'h3' }, 'How each skill went'),
      el('table', { class: 'exam-table' }, el('thead', {}, el('tr', {}, el('th', {}, 'Skill'), el('th', {}, 'Right'), el('th', {}, ''))), el('tbody', {}, ...rows)),
      el('h2', { class: 'h3' }, 'Every question, with the working'),
      el('ol', { class: 'exam-review' }, ...review));
    stage.scrollIntoView({ block: 'start' });
    say(pct >= 75 ? `Well done, ${l.name}! You scored ${pct} percent.` : `You scored ${pct} percent, ${l.name}. Let's look at what to practise next.`, { teacher: T.id, fig });
  }

  intro();
  return () => { alive = false; clearInterval(timer); stopSpeaking(); };
}
