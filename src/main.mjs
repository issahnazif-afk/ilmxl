// IlmXL: the app shell. Hash routes (GitHub Pages has no server rewrites):
//   #/                 home: today's plan and the subjects
//   #/who  #/new       choose or add a learner
//   #/subject/<s>[/<g>] a subject's skills by grade (any grade can be opened)
//   #/learn/<skill>    a lesson with the teacher · #/practise/<skill> adaptive practice · #/review
//   #/code[/<n>]       coding puzzles · #/world[/<subject>] the quest world · #/gate/<skill> a gate challenge
//   #/play[/<skill>]   Pre-K activities · #/trace  tracing · #/parents · #/about
import './styles/ilmxl.css';
import { el, icon } from './app/ui.mjs';
import { current, learners, onChange } from './app/store.mjs';
import { isYoung, bandOf } from './app/curriculum.mjs';

const views = {
  '': () => import('./views/home.mjs'),
  who: () => import('./views/onboard.mjs'), new: () => import('./views/onboard.mjs'),
  subject: () => import('./views/subject.mjs'),
  learn: () => import('./views/learn.mjs'),
  practise: () => import('./views/practise.mjs'), review: () => import('./views/practise.mjs'), gate: () => import('./views/practise.mjs'),
  code: () => import('./views/code.mjs'),
  world: () => import('./views/world.mjs'),
  play: () => import('./views/play.mjs'), trace: () => import('./views/trace.mjs'),
  parents: () => import('./views/parents.mjs'),
  about: () => import('./views/about.mjs'),
};
const OPEN = new Set(['who', 'new', 'parents', 'about']);

const app = document.getElementById('app');
let cleanup = null, seq = 0;
function parts() { return (location.hash.replace(/^#\/?/, '').split('?')[0] || '').split('/').filter(Boolean).map(decodeURIComponent); }
export const go = (path) => { location.hash = '#/' + String(path).replace(/^\/+/, ''); };

function shell(route) {
  const l = current();
  const link = (href, ic, label, on) => el('a', { href, class: on ? 'on' : '' }, icon(ic), el('span', {}, label));
  return el('nav', { class: 'top', 'aria-label': 'IlmXL' },
    el('a', { class: 'brand', href: '#/' }, el('span', { class: 'brand-mark', 'aria-hidden': 'true', html: MARK }), el('span', { class: 'brand-name' }, 'Ilm', el('b', {}, 'XL'))),
    l ? el('div', { class: 'top-links' },
      link('#/', 'home', 'Home', route === ''),
      l.grade < 0 ? link('#/play', 'star', 'Play', route === 'play' || route === 'trace') : link('#/code', 'code', 'Coding', route === 'code'),
      link('#/world', 'map', 'World', route === 'world' || route === 'gate'),
      link('#/parents', 'family', 'Parents', route === 'parents'),
    ) : el('span', { class: 'grow' }),
    l ? el('a', { class: 'me', href: '#/who', title: 'Change learner' },
      el('span', { class: 'me-dot', style: `--c:${l.colour}` }, l.name[0]?.toUpperCase()), el('span', { class: 'me-name' }, l.name),
      el('span', { class: 'pill stars', title: 'Stars: earned by learning' }, icon('star'), String(l.progress.stars)),
      el('span', { class: 'pill gems', title: 'Gems: spend them in the world' }, icon('gem'), String(l.progress.world.gems))) : null,
  );
}

async function render() {
  const mine = ++seq;
  const [route = '', ...args] = parts();
  if (!views[route]) { go(''); return; }
  if (!OPEN.has(route) && !current()) { go(learners().length ? 'who' : 'new'); return; }
  try { cleanup?.(); } catch {}
  cleanup = null;
  try { speechSynthesis.cancel(); } catch {}
  const mod = await views[route]();
  if (mine !== seq) return;
  const l = current();
  document.documentElement.dataset.young = l && isYoung(l.grade) ? '1' : '';
  document.documentElement.dataset.band = l ? bandOf(l.grade) : '';
  const main = el('main', { class: `view view-${route || 'home'}`, id: 'main' });
  // views pass optional pieces (cond ? x : null): skip them, as el() does
  main.append = (...kids) => Element.prototype.append.apply(main, kids.flat().filter((k) => k != null && k !== false));
  app.replaceChildren(shell(route), main);
  document.body.dataset.route = route || 'home';
  window.scrollTo(0, 0);
  cleanup = (await mod.default(main, { route, args, go })) ?? null;
}

// the brand mark: an open book with a rising spark (our own drawing)
const MARK = '<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="currentColor"/><path d="M6 22.5c3.3-2 6.7-2 10 0 3.3-2 6.7-2 10 0V11c-3.3-2-6.7-2-10 0-3.3-2-6.7-2-10 0z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M16 11v11.5" stroke="#fff" stroke-width="2"/><path d="m22 3.5 1 2.4 2.5.4-1.8 1.7.5 2.5-2.2-1.2-2.2 1.2.5-2.5-1.8-1.7 2.5-.4z" fill="#FFC83D"/></svg>';

window.addEventListener('hashchange', render);
onChange(() => {
  const l = current(); if (!l) return;
  const s = document.querySelector('.pill.stars'), g = document.querySelector('.pill.gems');
  if (s) s.lastChild.textContent = String(l.progress.stars);
  if (g) g.lastChild.textContent = String(l.progress.world.gems);
});
render();
