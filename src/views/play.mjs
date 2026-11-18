// Pre-K activities (#/play): big tiles, spoken prompts, rounds of five, a celebration at the end.
import { el, icon, button } from '../app/ui.mjs';
import { current, answer, skillOf, activity } from '../app/store.mjs';
import { SKILL, SKILLS, makeItem, itemKey } from '../app/curriculum.mjs';
import { question } from '../app/question.mjs';
import { TEACHERS, teacherFigure, say, stopSpeaking } from '../app/teacher.mjs';

const ROUND = 5;
export default function (main, { args }) {
  const l = current(), T = TEACHERS[l.teacher] ?? TEACHERS.amina;
  const acts = SKILLS.filter((s) => s.subject === 'activities');
  if (!args[0] || !SKILL[args[0]]) {
    const fig = teacherFigure(T.id);
    main.append(
      el('a', { class: 'back', href: '#/' }, icon('back'), 'Home'),
      el('div', { class: 'play-head' }, el('button', { type: 'button', class: 'hello-teacher', onclick: () => say('What shall we play today? Tap a picture!', { teacher: T.id, fig }) }, fig),
        el('div', {}, el('p', { class: 'kicker' }, 'Activities'), el('h1', { class: 'h1' }, 'Let’s play and learn!'))),
      el('div', { class: 'play-grid' },
        ...acts.map((a) => el('a', { class: `play-tile t-${a.strand.toLowerCase()}`, href: `#/play/${a.id}` }, el('span', { class: 'play-ic' }, icon(a.icon)), el('b', {}, a.title), el('span', { class: 'mini-stars' }, '★'.repeat(Math.min(3, skillOf(l, a.id).level))))),
        el('a', { class: 'play-tile t-trace', href: '#/trace' }, el('span', { class: 'play-ic' }, icon('trace')), el('b', {}, 'Tracing')),
        el('a', { class: 'play-tile t-maths', href: '#/subject/math/-1' }, el('span', { class: 'play-ic' }, icon('math')), el('b', {}, 'More maths')),
      ),
    );
    setTimeout(() => say(`Hello ${l.name}! What shall we play today? Tap a picture!`, { teacher: T.id, fig }), 300);
    return () => stopSpeaking();
  }
  const sk = SKILL[args[0]], fig = teacherFigure(T.id);
  let n = 0, right = 0; const recent = [];
  const stage = el('div', { class: 'stage play-stage' });
  const dots = el('div', { class: 'round-dots' });
  const drawDots = () => dots.replaceChildren(...Array.from({ length: ROUND }, (_, k) => el('span', { class: k < n ? 'on' : '' })));
  main.append(el('a', { class: 'back', href: '#/play' }, icon('back'), 'Activities'), el('div', { class: 'play-head' }, el('div', { class: 'side-teacher sm' }, fig), el('div', {}, el('h1', { class: 'h2' }, sk.title), dots)), stage);
  const next = () => {
    drawDots();
    if (n >= ROUND) {
      activity(l, 'play', { skill: sk.id, right, stars: right });
      stage.replaceChildren(el('div', { class: 'party' }, el('p', { class: 'party-stars' }, '★'.repeat(right) + '☆'.repeat(ROUND - right)), el('h2', { class: 'h2' }, right >= 4 ? 'Amazing!' : 'Good playing!'),
        el('div', { class: 'row center' }, button('Play again', () => { n = 0; right = 0; next(); }, 'btn btn-primary btn-lg'), el('a', { class: 'btn btn-lg', href: '#/play' }, 'Something else'))));
      say(right >= 4 ? `Amazing, ${l.name}! You got ${right} stars!` : `Good playing! You got ${right} stars.`, { teacher: T.id, fig });
      return;
    }
    const item = makeItem(sk, undefined, recent); recent.push(itemKey(item)); if (recent.length > 4) recent.shift();
    const q = question(item, { teacher: T.id, fig, young: true, speak: true, onDone: (ok) => { answer(l, sk.id, ok, { kind: 'play' }); n++; if (ok) right++; drawDots(); setTimeout(next, ok ? 1400 : 3200); } });
    stage.replaceChildren(q);
  };
  next();
  return () => stopSpeaking();
}
