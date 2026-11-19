// A printable worksheet for a unit or a whole grade (#/worksheet/<subject>/<grade>/<unit code | all>[/<seed>]):
// numbered questions with their figures and room to work, then an answer key on a new page (with the full worked
// solutions if wanted). For teachers and parents; the same seed prints the same sheet again.
import { el, icon, button, visual, mathText } from '../app/ui.mjs';
import { current } from '../app/store.mjs';
import { SUBJECTS } from '../app/curriculum.mjs';
import { stepText } from '../app/curriculum.mjs';
import { examSet } from '../app/exams.mjs';
import { me } from '../app/account.mjs';

const ABC = ['A', 'B', 'C', 'D', 'E', 'F'];
export default function (main, { args, go }) {
  const [subject, gs, code = 'all', sd] = args;
  const grade = Number(gs), sub = SUBJECTS[subject];
  if (!sub || Number.isNaN(grade)) return go('subject/math');
  const province = current()?.province ?? 'NS';
  let seed = Number(sd) || Math.floor(Math.random() * 1e9), n = code === 'all' ? 25 : 20, solutions = false;
  main.classList.add('ws-view');
  main.style.setProperty('--sc', sub.colour);
  const sheet = el('div', { class: 'ws-sheet' });
  const nSel = el('select', { 'aria-label': 'Number of questions', onchange: () => { n = Number(nSel.value); draw(); } }, ...[10, 15, 20, 25, 30, 40].map((k) => el('option', { value: k, selected: k === n }, `${k} questions`)));
  const solBox = el('input', { type: 'checkbox', onchange: () => { solutions = solBox.checked; draw(); } });
  main.append(
    el('div', { class: 'ws-tools no-print' },
      el('a', { class: 'back', href: `#/subject/${subject}/${grade}` }, icon('back'), `${sub.name} skills`),
      el('div', { class: 'row' }, nSel,
        el('label', { class: 'ws-check' }, solBox, 'Worked solutions in the answer key'),
        button([icon('practise'), 'New questions'], () => { seed = Math.floor(Math.random() * 1e9); history.replaceState(null, '', `#/worksheet/${subject}/${grade}/${code}/${seed}`); draw(); }, 'btn'),
        button([icon('pencil'), 'Print'], () => window.print(), 'btn btn-primary')),
      me() ? null : el('p', { class: 'muted' }, 'Free to print and share. Learners can take this unit as an online exam once signed in.')),
    sheet);

  function draw() {
    const set = examSet(subject, grade, code, { province, seed, n });
    if (!set) return go(`subject/${subject}/${grade}`);
    const qs = set.items.map(({ item: it }, i) => el('li', { class: 'ws-q' },
      el('p', { class: 'ws-text' }, mathText(it.q)),
      visual(it.visual),
      it.kind === 'mc' ? el('ol', { class: 'ws-choices' }, ...it.choices.map((c, j) => el('li', {}, el('b', {}, `${ABC[j]}. `), mathText(c))))
        : el('div', { class: 'ws-work' }, el('span', {}, 'Answer:'), el('i'))));
    const key = set.items.map(({ item: it }, i) => {
      const ans = it.kind === 'mc' ? `${ABC[it.a]}. ${it.choices[it.a]}` : it.answer + (it.unit && !/=$/.test(it.unit) ? ` ${it.unit}` : '');
      return el('li', {}, el('b', {}, mathText(ans)), solutions && it.steps?.length ? el('ol', { class: 'ws-steps' }, ...it.steps.map((s) => el('li', {}, mathText(stepText(s))))) : null);
    });
    sheet.replaceChildren(
      el('header', { class: 'ws-head' },
        el('div', {}, el('p', { class: 'ws-brand' }, 'IlmXL'), el('h1', {}, set.title), el('p', { class: 'muted' }, `${set.sub} · Worksheet ${seed % 100000}`)),
        el('div', { class: 'ws-fields' }, el('span', {}, 'Name ', el('i')), el('span', {}, 'Date ', el('i')), el('span', {}, 'Score ', el('i'), ` / ${set.items.length}`))),
      el('p', { class: 'ws-note' }, 'Show your working in the space given. Round as the question asks.'),
      el('ol', { class: 'ws-list' }, ...qs),
      el('section', { class: 'ws-key' }, el('h2', {}, `Answer key · ${set.title}`), el('p', { class: 'muted' }, `Worksheet ${seed % 100000}`), el('ol', { class: solutions ? 'ws-keylist full' : 'ws-keylist' }, ...key)));
  }
  draw();
}
