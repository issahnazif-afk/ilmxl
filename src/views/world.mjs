// The quest world (#/world): one island per subject. On an island, each skill of the learner's grade is a gate on
// a winding path; a gate opens after a short challenge, and gems buy decorations for the learner's camp.
import { el, icon, button } from '../app/ui.mjs';
import { current, skillOf, buy, place } from '../app/store.mjs';
import { SKILL, SUBJECTS } from '../app/curriculum.mjs';
import { ISLANDS, subjectsFor, gatesFor, gateOpen, SHOP } from '../app/path.mjs';

const DECOR = {
  tent: '<path d="M4 40 24 8l20 32z" fill="#F28C28"/><path d="M24 8v32M18 40l6-12 6 12" fill="#7A3E0C"/>',
  tree: '<rect x="21" y="28" width="6" height="14" fill="#7A4A21"/><path d="M24 4l4 8 6-2-2 7 7 2-6 5 2 6-11-3-11 3 2-6-6-5 7-2-2-7 6 2z" fill="#D9342B"/>',
  lantern: '<path d="M18 10h12l2 24H16z" fill="#FFC83D" stroke="#8A6200" stroke-width="2"/><path d="M20 6h8v4h-8zM16 34h16v4H16z" fill="#4B3B1A"/>',
  flag: '<path d="M10 4v38" stroke="#555" stroke-width="3"/><path d="M12 6h14v14H12z" fill="#D9342B"/><path d="M26 6h4v14h-4zM12 6H8" fill="#fff"/><path d="M19 9l1.5 3 2-1-1 4h-5l-1-4 2 1z" fill="#D9342B"/>',
  telescope: '<path d="M8 22 34 10l3 7-26 12z" fill="#4C5BD4"/><path d="M22 22l-8 18M22 22l8 18" stroke="#333" stroke-width="2.5"/>',
  canoe: '<path d="M2 30c10 8 34 8 44 0-14 3-30 3-44 0z" fill="#B45309"/><path d="M30 14l-6 18" stroke="#6B3E1F" stroke-width="2.5"/>',
  lighthouse: '<path d="M18 42 20 12h8l2 30z" fill="#fff" stroke="#B91C1C" stroke-width="2"/><path d="M19 24h10v6H19z" fill="#B91C1C"/><path d="M18 8h12v4H18z" fill="#FFC83D"/><path d="M20 4h8l-4-3z" fill="#B91C1C"/>',
  rocket: '<path d="M24 2c8 8 9 20 6 30H18c-3-10-2-22 6-30z" fill="#E5E7EB" stroke="#4B5563" stroke-width="2"/><circle cx="24" cy="16" r="4" fill="#3B82F6"/><path d="M18 26l-6 10h6zM30 26l6 10h-6z" fill="#EF4444"/><path d="M21 34h6l-3 8z" fill="#F59E0B"/>',
  books: '<rect x="8" y="30" width="32" height="8" fill="#2563EB"/><rect x="10" y="22" width="28" height="8" fill="#15803D"/><rect x="12" y="14" width="24" height="8" fill="#C2410C"/>',
  garden: '<path d="M4 40h40" stroke="#7A4A21" stroke-width="4"/><g fill="#3E9C47"><path d="M10 40V28M24 40V24M38 40V30" stroke="#3E9C47" stroke-width="2"/></g><circle cx="10" cy="26" r="4" fill="#F27AB0"/><circle cx="24" cy="22" r="4" fill="#FFC83D"/><circle cx="38" cy="28" r="4" fill="#8A4FC2"/>',
};

export default function (main, { args, go }) {
  const l = current();
  if (args[0] && ISLANDS[args[0]]) return island(main, l, args[0]);
  const w = l.progress.world;
  const subs = subjectsFor(l);
  main.append(
    el('a', { class: 'back', href: '#/' }, icon('back'), 'Home'),
    el('p', { class: 'kicker' }, 'The world'), el('h1', { class: 'h1' }, 'Choose an island'),
    el('p', { class: 'lede' }, 'Open gates by answering challenges. Each gate gives gems; spend them on your camp.'),
    el('div', { class: 'islands' }, ...subs.map((id) => {
      const g = gatesFor(l, id), open = g.filter((s) => w.gates[s]).length, sub = SUBJECTS[id];
      return el('a', { class: 'island', href: `#/world/${id}`, style: `--sc:${sub.colour};--ss:${sub.soft}` },
        el('span', { class: 'island-art', html: islandArt(sub.colour) }), el('b', {}, ISLANDS[id].name), el('small', {}, ISLANDS[id].line), el('span', { class: 'chip' }, icon('gate'), `${open} of ${g.length} gates`));
    })),
    camp(l),
  );
}

function island(main, l, id) {
  const sub = SUBJECTS[id], g = gatesFor(l, id), w = l.progress.world;
  main.style.setProperty('--sc', sub.colour); main.style.setProperty('--ss', sub.soft);
  main.append(
    el('a', { class: 'back', href: '#/world' }, icon('back'), 'All islands'),
    el('p', { class: 'kicker' }, sub.name), el('h1', { class: 'h1' }, ISLANDS[id].name), el('p', { class: 'lede' }, ISLANDS[id].line),
    el('ol', { class: 'trail' }, ...g.map((sid, i) => {
      const sk = SKILL[sid], done = !!w.gates[sid], open = gateOpen(l, id, i);
      return el('li', { class: `gate ${done ? 'done' : open ? 'open' : 'locked'}`, style: `--i:${i}` },
        el('span', { class: 'gate-ic' }, icon(done ? 'check' : open ? 'gate' : 'lock')),
        el('span', { class: 'gate-body' }, el('b', {}, sk.title), el('small', {}, done ? 'Gate open' : open ? 'Answer 3 to open it · +5 gems' : 'Open the gate before this one')),
        open && !done ? el('a', { class: 'btn btn-primary btn-sm', href: `#/gate/${sid}` }, 'Challenge') : done ? el('a', { class: 'btn btn-sm', href: `#/practise/${sid}` }, 'Practise') : null,
      );
    })),
    g.length ? null : el('p', { class: 'empty' }, 'No gates for your grade on this island yet.'),
  );
}

function camp(l) {
  const w = l.progress.world;
  const scene = el('div', { class: 'camp-scene', 'aria-label': 'Your camp' });
  const drawScene = () => scene.replaceChildren(...(w.placed.length ? w.placed.map((it) => el('span', { class: 'decor', title: SHOP.find((s) => s.id === it)?.name, html: `<svg viewBox="0 0 48 44">${DECOR[it]}</svg>` })) : [el('p', { class: 'small' }, 'Buy things with gems and place them here.')]));
  const shop = el('div', { class: 'shop' });
  const drawShop = () => shop.replaceChildren(...SHOP.map((s) => {
    const own = w.owned.includes(s.id), placed = w.placed.includes(s.id);
    return el('div', { class: `shop-item ${own ? 'own' : ''}` }, el('span', { class: 'decor sm', html: `<svg viewBox="0 0 48 44">${DECOR[s.id]}</svg>` }), el('b', {}, s.name),
      own ? button(placed ? 'Put away' : 'Place', () => { place(l, s.id); drawScene(); drawShop(); }, 'btn btn-sm')
        : button([icon('gem'), String(s.cost)], () => { if (buy(l, s.id, s.cost)) { place(l, s.id); drawScene(); drawShop(); } }, `btn btn-sm ${w.gems >= s.cost ? 'btn-primary' : ''}`));
  }));
  drawScene(); drawShop();
  return el('section', { class: 'camp' }, el('h2', { class: 'h2' }, 'Your camp'), el('p', { class: 'small' }, `You have ${w.gems} gems. Earn them at gates and in coding puzzles.`), scene, el('h3', { class: 'h3' }, 'Shop'), shop);
}

const islandArt = (c) => `<svg viewBox="0 0 120 70"><ellipse cx="60" cy="58" rx="56" ry="10" fill="#7DD3FC" opacity=".6"/><path d="M14 56c8-22 22-34 46-34s38 12 46 34z" fill="${c}"/><path d="M30 56c6-12 16-18 30-18s24 6 30 18z" fill="#fff" opacity=".25"/><path d="M60 22V6" stroke="#333" stroke-width="2"/><path d="M60 6h14l-4 5 4 5H60z" fill="#FFC83D"/></svg>`;
