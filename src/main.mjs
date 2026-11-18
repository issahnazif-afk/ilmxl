// IlmXL: the app shell. Hash routes (GitHub Pages has no server rewrites):
//   public:  #/welcome (landing) · #/signin · #/signup · #/about
//   signed in:
//   #/                 home: today's plan and the subjects
//   #/who  #/new       choose or add a learner
//   #/subject/<s>[/<g>] a subject's skills by grade (any grade can be opened)
//   #/learn/<skill>    a lesson with the teacher · #/practise/<skill> adaptive practice · #/review
//   #/code[/<n>]       coding puzzles · #/world[/<subject>] the quest world · #/gate/<skill> a gate challenge
//   #/play[/<skill>]   Pre-K activities · #/trace  tracing · #/parents (and the account)
import './styles/ilmxl.css';
import { el, icon } from './app/ui.mjs';
import { current, learners, onChange, openAccount, mergeRemote } from './app/store.mjs';
import { me, pull, signOut } from './app/account.mjs';
import { isYoung, bandOf } from './app/curriculum.mjs';

const views = {
  welcome: () => import('./views/welcome.mjs'),
  signin: () => import('./views/auth.mjs'), signup: () => import('./views/auth.mjs'),
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
const PUBLIC = new Set(['welcome', 'signin', 'signup', 'about']);
const NO_LEARNER = new Set(['who', 'new', 'parents']);
const BARE = new Set(['signin', 'signup']);          // full-screen pages with their own header

const app = document.getElementById('app');
let cleanup = null, seq = 0;
function parts() { return (location.hash.replace(/^#\/?/, '').split('?')[0] || '').split('/').filter(Boolean).map(decodeURIComponent); }
export const go = (path) => { location.hash = '#/' + String(path).replace(/^\/+/, ''); };

// ── theme: light, dark or the device's ──
const THEME = 'ilmxl-theme';
const getTheme = () => { try { return localStorage.getItem(THEME) || 'system'; } catch { return 'system'; } };
function applyTheme(t) { if (t === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t; }
applyTheme(getTheme());
const isDark = () => document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
export function themeButton() {
  return el('button', { type: 'button', class: 'icon-btn theme-btn', title: 'Light or dark', 'aria-label': 'Switch light or dark', onclick: () => { const t = isDark() ? 'light' : 'dark'; try { localStorage.setItem(THEME, t); } catch {} applyTheme(t); } }, icon('sun', 'sun'), icon('moon', 'moon'));
}

export const MARK = '<svg viewBox="0 0 32 32"><defs><linearGradient id="mk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366F1"/><stop offset=".55" stop-color="#8B5CF6"/><stop offset="1" stop-color="#EC4899"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#mk)"/><path d="M6 22.5c3.3-2 6.7-2 10 0 3.3-2 6.7-2 10 0V11c-3.3-2-6.7-2-10 0-3.3-2-6.7-2-10 0z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M16 11v11.5" stroke="#fff" stroke-width="2"/><path d="m23 3.2 1 2.4 2.5.4-1.8 1.7.5 2.5-2.2-1.2-2.2 1.2.5-2.5-1.8-1.7 2.5-.4z" fill="#FDE047"/></svg>';
export const brand = (href = '#/') => el('a', { class: 'brand', href }, el('span', { class: 'brand-mark', 'aria-hidden': 'true', html: MARK }), el('span', { class: 'brand-name' }, 'Ilm', el('b', {}, 'XL')));

function shell(route) {
  const a = me(), l = current();
  if (!a) {
    return el('header', { class: 'nav-wrap' }, el('nav', { class: 'nav', 'aria-label': 'IlmXL' }, brand('#/welcome'),
      el('div', { class: 'nav-links' }, el('a', { href: '#/welcome' }, 'Home'), el('a', { href: '#/welcome#features', onclick: (e) => { e.preventDefault(); go('welcome'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 300); } }, 'Features'), el('a', { href: '#/about', class: route === 'about' ? 'on' : '' }, 'About')),
      el('div', { class: 'nav-end' }, themeButton(), el('a', { class: 'btn btn-ghost btn-sm hide-sm', href: '#/signin' }, 'Sign in'), el('a', { class: 'btn btn-primary btn-sm', href: '#/signup' }, 'Get started'))));
  }
  const link = (href, ic, label, on) => el('a', { href, class: on ? 'on' : '' }, icon(ic), el('span', {}, label));
  const menu = el('div', { class: 'menu', hidden: true, role: 'menu' },
    el('div', { class: 'menu-head' }, el('b', {}, a.name), el('small', {}, `@${a.username}`)),
    ...learners().map((x) => el('a', { href: '#/who', role: 'menuitem', class: x.id === l?.id ? 'on' : '', onclick: (e) => { e.preventDefault(); import('./app/store.mjs').then((s) => { s.choose(x.id); menu.hidden = true; go(''); render(); }); } }, el('span', { class: 'me-dot sm', style: `--c:${x.colour}` }, x.name[0]?.toUpperCase()), x.name)),
    el('a', { href: '#/new', role: 'menuitem' }, icon('plus'), 'Add a learner'),
    el('hr'),
    el('a', { href: '#/parents', role: 'menuitem' }, icon('family'), 'Parents and account'),
    el('button', { type: 'button', role: 'menuitem', onclick: () => { signOut(); location.hash = '#/welcome'; location.reload(); } }, icon('logout'), 'Sign out'),
  );
  const meBtn = el('button', { type: 'button', class: 'me', 'aria-haspopup': 'menu', onclick: (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; } },
    l ? el('span', { class: 'me-dot', style: `--c:${l.colour}` }, l.name[0]?.toUpperCase()) : el('span', { class: 'me-dot', style: '--c:#6366F1' }, a.name[0]?.toUpperCase()),
    el('span', { class: 'me-name' }, l?.name ?? a.name), icon('down', 'caret'));
  document.addEventListener('click', () => (menu.hidden = true), { once: true });
  return el('header', { class: 'nav-wrap' }, el('nav', { class: 'nav', 'aria-label': 'IlmXL' }, brand('#/'),
    l ? el('div', { class: 'nav-links app' },
      link('#/', 'home', 'Home', route === ''),
      l.grade < 0 ? link('#/play', 'star', 'Play', route === 'play' || route === 'trace') : link('#/code', 'code', 'Coding', route === 'code'),
      link('#/world', 'map', 'World', route === 'world' || route === 'gate'),
      link('#/parents', 'family', 'Parents', route === 'parents'),
    ) : el('span', { class: 'grow' }),
    el('div', { class: 'nav-end' },
      l ? el('span', { class: 'pill stars', title: 'Stars: earned by learning' }, icon('star'), String(l.progress.stars)) : null,
      l ? el('span', { class: 'pill gems hide-sm', title: 'Gems: spend them in the world' }, icon('gem'), String(l.progress.world.gems)) : null,
      themeButton(),
      el('div', { class: 'me-wrap' }, meBtn, menu))));
}

async function render() {
  const mine = ++seq;
  let [route = '', ...args] = parts();
  if (!views[route]) { go(me() ? '' : 'welcome'); return; }
  const a = me();
  if (!a && !PUBLIC.has(route)) { go(route === '' ? 'welcome' : 'signin'); return; }
  if (a && (route === 'signin' || route === 'signup' || route === 'welcome')) { go(''); return; }
  if (a && !PUBLIC.has(route) && !NO_LEARNER.has(route) && !current()) { go(learners().length ? 'who' : 'new'); return; }
  try { cleanup?.(); } catch {}
  cleanup = null;
  try { speechSynthesis.cancel(); } catch {}
  const mod = await views[route]();
  if (mine !== seq) return;
  const l = a ? current() : null;
  document.documentElement.dataset.young = l && isYoung(l.grade) && !PUBLIC.has(route) ? '1' : '';
  document.documentElement.dataset.band = l ? bandOf(l.grade) : '';
  const main = el('main', { class: `view view-${route || 'home'}`, id: 'main' });
  // views pass optional pieces (cond ? x : null): skip them, as el() does
  main.append = (...kids) => Element.prototype.append.apply(main, kids.flat().filter((k) => k != null && k !== false));
  app.replaceChildren(...(BARE.has(route) ? [] : [shell(route)]), main);
  document.body.dataset.route = route || 'home';
  window.scrollTo(0, 0);
  cleanup = (await mod.default(main, { route, args, go, rerender: render })) ?? null;
  reveal(main);
}
export const rerender = () => render();

// scroll-in reveal for [data-reveal] blocks
let io = null;
function reveal(root) {
  if (!('IntersectionObserver' in window)) { root.querySelectorAll('[data-reveal]').forEach((x) => x.classList.add('in')); return; }
  io ??= new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  root.querySelectorAll('[data-reveal]').forEach((x) => io.observe(x));
}
// the spotlight that follows the pointer on .spot cards
document.addEventListener('pointermove', (e) => {
  const c = e.target.closest?.('.spot'); if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
}, { passive: true });

window.addEventListener('hashchange', render);
onChange(() => {
  const l = current(); if (!l) return;
  const s = document.querySelector('.pill.stars'), g = document.querySelector('.pill.gems');
  if (s) s.lastChild.textContent = String(l.progress.stars);
  if (g) g.lastChild.textContent = String(l.progress.world.gems);
});

// signed in: open the account's learners here, then bring in what the account has on the server
export async function startAccount() {
  const a = me(); if (!a) return;
  openAccount(a.username);
  const remote = await pull();
  if (remote?.signedOut) { location.hash = '#/signin'; render(); return; }
  if (remote && mergeRemote(remote)) render();
}
if (me()) openAccount(me().username);
render();
if (me()) startAccount();
