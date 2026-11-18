// The Fluency Zone: one-minute sprints on the basic facts. Type the answer; a right answer moves straight on.
// Each learner's best score for each sprint is kept. Visitors can try a sprint without saving.
import { el, icon, chime } from '../app/ui.mjs';
import { current, activity } from '../app/store.mjs';
import { me } from '../app/account.mjs';

const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const add = (max) => () => { const a = R(0, max), b = R(0, max - a); return [`${a} + ${b}`, a + b]; };
const sub = (max) => () => { const a = R(0, max), b = R(0, a); return [`${a} − ${b}`, a - b]; };
const mul = (lo, hi, top = 12) => () => { const a = R(lo, hi), b = R(0, top); return Math.random() < 0.5 ? [`${a} × ${b}`, a * b] : [`${b} × ${a}`, a * b]; };
const div = (lo, hi, top = 12) => () => { const a = R(lo, hi), q = R(0, top); return [`${a * q} ÷ ${a}`, q]; };
const mix = (top) => () => (Math.random() < 0.5 ? mul(1, top, top)() : div(1, top, top)());

export const SPRINTS = [
  { group: 'Addition and subtraction', items: [
    { id: 'add10', name: 'Addition facts to 10', sign: '+', make: add(10) },
    { id: 'add20', name: 'Addition facts to 20', sign: '+', make: add(20) },
    { id: 'sub10', name: 'Subtraction facts to 10', sign: '−', make: sub(10) },
    { id: 'sub20', name: 'Subtraction facts to 20', sign: '−', make: sub(20) },
  ] },
  { group: 'Multiplication', items: [
    { id: 'mul5', name: 'Multiplication facts up to 5', sign: '×', make: mul(0, 5, 5) },
    { id: 'mul10', name: 'Multiplication facts up to 10', sign: '×', make: mul(0, 10, 10) },
    { id: 'mul69', name: 'Multiply by 6, 7, 8 and 9', sign: '×', make: mul(6, 9, 10) },
    { id: 'mul12', name: 'Multiplication facts up to 12', sign: '×', make: mul(0, 12, 12) },
  ] },
  { group: 'Division', items: [
    { id: 'div5', name: 'Division facts up to 5', sign: '÷', make: div(1, 5, 5) },
    { id: 'div10', name: 'Division facts up to 10', sign: '÷', make: div(1, 10, 10) },
    { id: 'div69', name: 'Divide by 6, 7, 8 and 9', sign: '÷', make: div(6, 9, 10) },
    { id: 'div12', name: 'Division facts up to 12', sign: '÷', make: div(1, 12, 12) },
  ] },
  { group: 'Mixed', items: [
    { id: 'md10', name: 'Multiplication and division up to 10', sign: '×÷', make: mix(10) },
    { id: 'md12', name: 'Multiplication and division up to 12', sign: '×÷', make: mix(12) },
  ] },
];
const ALL = SPRINTS.flatMap((g) => g.items);
const SECONDS = 60;
const bestOf = (l, id) => l?.progress?.fluency?.[id] ?? 0;

export default function (main, { args, rerender }) {
  const l = current(), signedIn = !!me();
  main.classList.add('fluency');
  const sp = ALL.find((s) => s.id === args[0]);
  if (!sp) {
    main.append(
      el('a', { class: 'back', href: '#/subject/math' }, icon('back'), 'Maths skills'),
      el('header', { class: 'fz-hero' },
        el('div', {}, el('p', { class: 'kicker' }, 'Fluency Zone'), el('h1', { class: 'h1' }, 'Race the clock on your facts'),
          el('p', { class: 'lede' }, `Each sprint lasts ${SECONDS} seconds. Type the answer: a right answer moves you straight on. Beat your best score!`)),
        el('div', { class: 'fz-car', 'aria-hidden': 'true' }, icon('bolt'))),
      ...SPRINTS.map((g) => el('section', { class: 'fz-group' }, el('h2', { class: 'h3' }, g.group),
        el('div', { class: 'fz-grid' }, ...g.items.map((s) => el('a', { class: 'fz-card spot', href: `#/fluency/${s.id}` },
          el('span', { class: 'fz-sign' }, s.sign), el('b', {}, s.name),
          el('span', { class: 'fz-best' }, ...(bestOf(l, s.id) ? [icon('flame'), `Best: ${bestOf(l, s.id)}`] : [icon('timer'), `${SECONDS} s`]))))))),
    );
    return;
  }

  // a sprint
  let score = 0, wrong = 0, left = SECONDS, cur = sp.make(), timer = null, started = false, over = false;
  const qEl = el('div', { class: 'fz-q' }, cur[0], ' = ');
  const input = el('input', { class: 'fz-in', inputmode: 'numeric', autocomplete: 'off', 'aria-label': 'Your answer', maxlength: 4 });
  const clock = el('span', { class: 'fz-clock' }, icon('timer'), `${left}`);
  const tally = el('span', { class: 'fz-tally' }, icon('check'), '0');
  const bar = el('i', { style: 'width:100%' });
  const box = el('div', { class: 'fz-play' });
  const next = () => { let n = sp.make(); while (n[0] === cur[0]) n = sp.make(); cur = n; qEl.replaceChildren(cur[0], ' = '); input.value = ''; };
  const finish = () => {
    over = true; clearInterval(timer); input.disabled = true;
    const before = bestOf(l, sp.id), record = score > before;
    if (l && signedIn) { l.progress.fluency = l.progress.fluency ?? {}; if (record) l.progress.fluency[sp.id] = score; activity(l, 'fluency', { sprint: sp.id, score, stars: record ? 1 : 0 }); }
    box.replaceChildren(el('div', { class: 'fz-done' },
      el('p', { class: 'kicker' }, 'Time!'), el('p', { class: 'fz-big' }, String(score)), el('p', { class: 'muted' }, `right answers in ${SECONDS} seconds${wrong ? ` · ${wrong} to look at again` : ''}`),
      record && before ? el('p', { class: 'fz-record' }, icon('flame'), `New best! (was ${before})`) : !before && score ? el('p', { class: 'fz-record' }, icon('star'), 'Your first score. Now beat it!') : before ? el('p', { class: 'muted' }, `Your best: ${before}`) : null,
      signedIn ? null : el('p', { class: 'note' }, icon('info'), el('span', {}, el('a', { href: '#/signup' }, 'Create a free account'), ' to keep your best scores.')),
      el('div', { class: 'row' }, el('a', { class: 'btn btn-primary btn-lg', href: `#/fluency/${sp.id}`, onclick: (e) => { e.preventDefault(); rerender(); } }, icon('play'), 'Go again'), el('a', { class: 'btn btn-quiet', href: '#/fluency' }, 'All sprints'))));
  };
  const start = () => {
    if (started) return; started = true;
    timer = setInterval(() => { left--; clock.replaceChildren(icon('timer'), `${left}`); bar.style.width = `${(100 * left) / SECONDS}%`; clock.classList.toggle('low', left <= 10); if (left <= 0) finish(); }, 1000);
  };
  input.addEventListener('input', () => {
    if (over) return; start();
    const v = input.value.trim(); if (!v) return;
    if (Number(v) === cur[1]) { score++; tally.replaceChildren(icon('check'), String(score)); chime(true); box.classList.remove('nope'); next(); }
    else if (v.length >= String(cur[1]).length) { box.classList.add('nope'); }
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && input.value.trim() && Number(input.value) !== cur[1]) { wrong++; chime(false); next(); } });
  const pad = el('div', { class: 'fz-pad' }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 'skip', 0, 'del'].map((k) => el('button', { type: 'button', class: typeof k === 'number' ? '' : 'alt', onclick: () => {
    if (over) return;
    if (k === 'del') input.value = input.value.slice(0, -1);
    else if (k === 'skip') { start(); wrong++; next(); return; }
    else input.value += k;
    input.dispatchEvent(new Event('input'));
  } }, k === 'del' ? '⌫' : k === 'skip' ? 'Skip' : String(k))));
  box.append(el('div', { class: 'fz-top' }, clock, el('span', { class: 'fz-bar' }, bar), tally), el('div', { class: 'fz-qrow' }, qEl, input), el('p', { class: 'muted fz-hint' }, 'The clock starts when you type your first answer.'), pad);
  main.append(el('a', { class: 'back', href: '#/fluency' }, icon('back'), 'Fluency Zone'), el('h1', { class: 'h2' }, sp.name), bestOf(l, sp.id) ? el('p', { class: 'muted' }, icon('flame'), ` Your best: ${bestOf(l, sp.id)}`) : null, box);
  setTimeout(() => input.focus({ preventScroll: true }), 50);
  // leaving the page stops the clock
  return () => clearInterval(timer);
}
