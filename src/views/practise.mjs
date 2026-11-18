// Adaptive practice (#/practise/<skill>): questions until the XL score reaches 100. After two misses in a row the
// teacher offers a lesson. Also the review of proficient skills (#/review) and the world's gates (#/gate/<skill>).
import { el, icon, button, ring } from '../app/ui.mjs';
import { current, skillOf, answer, review, dueReviews, openGate, LEVELS } from '../app/store.mjs';
import { SKILL, SUBJECTS, makeItem, itemKey, isYoung, gradeLabel } from '../app/curriculum.mjs';
import { question } from '../app/question.mjs';
import { TEACHERS, teacherFigure, say } from '../app/teacher.mjs';
import { ISLANDS } from '../app/path.mjs';

export default function (main, { route, args, go }) {
  const l = current(), T = TEACHERS[l.teacher] ?? TEACHERS.amina, young = isYoung(l.grade);
  const fig = teacherFigure(T.id);
  if (route === 'review') return reviewRun(main, l, T, fig, go);
  if (route === 'gate') return gateRun(main, l, T, fig, args[0], go);
  const skill = SKILL[args[0]]; if (!skill) return go('');
  const sub = SUBJECTS[skill.subject];
  main.style.setProperty('--sc', sub.colour); main.style.setProperty('--ss', sub.soft);
  const recent = [];
  let missRow = 0, n = 0, rightN = 0;
  const scoreEl = el('b', { class: 'xl-num' }), ringBox = el('span'), lvl = el('small');
  const stage = el('div', { class: 'stage' });
  const showScore = () => { const s = skillOf(l, skill.id); scoreEl.textContent = String(s.score); ringBox.replaceChildren(ring(s.level, 44)); lvl.textContent = LEVELS[s.level]; };
  main.append(
    el('a', { class: 'back', href: skill.subject === 'activities' ? '#/play' : `#/subject/${skill.subject}/${skill.grade}` }, icon('back'), sub.name),
    el('div', { class: 'prac' },
      el('div', { class: 'prac-main' },
        el('p', { class: 'kicker' }, `${sub.name} · ${gradeLabel(skill.grade)}`),
        el('h1', { class: 'h2' }, skill.title),
        stage),
      el('aside', { class: 'prac-side' },
        el('div', { class: 'xl' }, el('small', {}, 'XL score'), scoreEl, el('div', { class: 'xl-lv' }, ringBox, lvl)),
        el('div', { class: 'side-teacher' }, fig, el('small', {}, T.name)),
        el('a', { class: 'btn', href: `#/learn/${skill.id}` }, icon('board'), 'Lesson'),
      )));
  showScore();
  const next = () => {
    const item = makeItem(skill, undefined, recent);
    recent.push(itemKey(item)); if (recent.length > Math.min(8, (skill.items?.length ?? 99) - 2)) recent.shift();
    n++;
    const q = question(item, { teacher: T.id, fig, young, speak: young, onDone: (right) => {
      const before = skillOf(l, skill.id);
      const s = answer(l, skill.id, right);
      showScore();
      if (right) { rightN++; missRow = 0; } else missRow++;
      const after = [];
      if (s.level >= 3 && before.level < 3) {
        after.push(el('p', { class: 'cele' }, icon('star'), `Proficient! You reached 100. It will come back for review in a few days.`));
        say(`Wonderful, ${l.name}! You reached one hundred. This skill is now proficient.`, { teacher: T.id, fig });
      }
      if (missRow >= 2 && !s.learned) after.push(el('p', { class: 'nudge' }, icon('hint'), 'Two in a row were tricky. ', el('a', { href: `#/learn/${skill.id}` }, 'Want a quick lesson?')));
      const nb = button([s.level >= 3 && before.level < 3 ? 'Keep practising' : 'Next question', icon('next')], next, 'btn btn-primary');
      q.append(...after, el('div', { class: 'row' }, nb, s.level >= 3 ? el('a', { class: 'btn', href: skill.subject === 'activities' ? '#/play' : `#/subject/${skill.subject}/${skill.grade}` }, 'Back to skills') : null));
      setTimeout(() => nb.focus({ preventScroll: true }), 30);
    } });
    stage.replaceChildren(el('p', { class: 'qcount' }, `Question ${n}${n > 1 ? ` · ${rightN} right` : ''}`), q);
  };
  next();
}

function reviewRun(main, l, T, fig, go) {
  const due = dueReviews(l);
  const stage = el('div', { class: 'stage' });
  main.append(el('a', { class: 'back', href: '#/' }, icon('back'), 'Home'), el('div', { class: 'prac' }, el('div', { class: 'prac-main' }, el('p', { class: 'kicker' }, 'Review'), el('h1', { class: 'h2' }, 'Do you still remember?'), stage), el('aside', { class: 'prac-side' }, el('div', { class: 'side-teacher' }, fig, el('small', {}, T.name)))));
  if (!due.length) { stage.append(el('p', { class: 'lede' }, 'Nothing to review right now. Skills come back here a few days after you reach 100.')); return; }
  let i = 0;
  const next = () => {
    if (i >= due.length) { stage.replaceChildren(el('p', { class: 'cele' }, icon('star'), 'Review finished. Mastered skills have a tick in their ring.'), el('a', { class: 'btn btn-primary', href: '#/' }, 'Home')); say('Review finished. Well done!', { teacher: T.id, fig }); return; }
    const sk = SKILL[due[i++]]; if (!sk) return next();
    const q = question(makeItem(sk), { teacher: T.id, fig, young: isYoung(l.grade), onDone: (right) => {
      review(l, sk.id, right);
      q.append(el('p', { class: right ? 'cele' : 'nudge' }, right ? `${sk.title}: mastered!` : `${sk.title} goes back to practice for a little while.`), el('div', { class: 'row' }, button(['Next', icon('next')], next, 'btn btn-primary')));
    } });
    stage.replaceChildren(el('p', { class: 'qcount' }, `${SUBJECTS[sk.subject].name} · ${sk.title} · ${i} of ${due.length}`), q);
  };
  next();
}

// a gate in the world: three right answers (out of at most five tries) open it
function gateRun(main, l, T, fig, id, go) {
  const sk = SKILL[id]; if (!sk) return go('world');
  const isl = ISLANDS[sk.subject];
  const need = 3, max = 5; let right = 0, tries = 0;
  const hp = el('div', { class: 'gate-hp' }); const stage = el('div', { class: 'stage' });
  const draw = () => hp.replaceChildren(...Array.from({ length: need }, (_, k) => el('span', { class: k < right ? 'on' : '' }, icon('gem'))));
  main.append(el('a', { class: 'back', href: `#/world/${sk.subject}` }, icon('back'), isl?.name ?? 'World'),
    el('div', { class: 'gate-top' }, el('div', { class: 'keeper', html: KEEPER }), el('div', {}, el('p', { class: 'kicker' }, 'Gate challenge'), el('h1', { class: 'h2' }, sk.title), el('p', { class: 'lede' }, `Answer ${need} right to open the gate. You have ${max} tries.`), hp)),
    stage);
  draw();
  const recent = [];
  const next = () => {
    if (right >= need) {
      openGate(l, sk.id, 5);
      stage.replaceChildren(el('p', { class: 'cele big' }, icon('gem'), 'The gate opens! +5 gems.'), el('a', { class: 'btn btn-primary', href: `#/world/${sk.subject}` }, 'Back to the island'));
      say(`The gate opens! You earned five gems.`, { teacher: T.id }); return;
    }
    if (tries >= max) { stage.replaceChildren(el('p', { class: 'nudge' }, 'The gate stays shut this time. Practise a little and come back!'), el('div', { class: 'row' }, el('a', { class: 'btn btn-primary', href: `#/learn/${sk.id}` }, 'Lesson'), el('a', { class: 'btn', href: `#/practise/${sk.id}` }, 'Practise'), el('a', { class: 'btn', href: `#/world/${sk.subject}` }, 'Back'))); return; }
    tries++;
    const item = makeItem(sk, undefined, recent); recent.push(itemKey(item));
    const q = question(item, { teacher: T.id, young: isYoung(l.grade), speak: isYoung(l.grade), onDone: (ok) => { answer(l, sk.id, ok, { kind: 'gate' }); if (ok) right++; draw(); q.append(el('div', { class: 'row' }, button(['Next', icon('next')], next, 'btn btn-primary'))); } });
    stage.replaceChildren(el('p', { class: 'qcount' }, `Try ${tries} of ${max}`), q);
  };
  next();
}
// the gate-keeper: a friendly round creature (our own drawing)
const KEEPER = '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="108" rx="34" ry="6" fill="#000" opacity=".12"/><path d="M22 70c0-26 17-46 38-46s38 20 38 46-17 36-38 36-38-10-38-36z" fill="#8B5CF6"/><path d="M38 30 30 10l20 14M82 30l8-20-20 14" fill="#8B5CF6"/><ellipse cx="60" cy="80" rx="22" ry="18" fill="#C4B5FD"/><circle cx="46" cy="58" r="9" fill="#fff"/><circle cx="74" cy="58" r="9" fill="#fff"/><circle cx="48" cy="60" r="4.5" fill="#1E1B4B"/><circle cx="72" cy="60" r="4.5" fill="#1E1B4B"/><path d="M50 80q10 8 20 0" stroke="#1E1B4B" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
