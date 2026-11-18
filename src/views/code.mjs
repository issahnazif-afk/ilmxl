// Coding puzzles (#/code, #/code/<n>): build a program from blocks, press Run, watch the robot.
import { el, icon, button, chime } from '../app/ui.mjs';
import { current, coded } from '../app/store.mjs';
import { PUZZLES, BLOCKS, run, world, countBlocks, toText, starsFor } from '../app/coding.mjs';
import { TEACHERS, teacherFigure, say, stopSpeaking } from '../app/teacher.mjs';

export default function (main, { args }) {
  const l = current();
  if (!args[0]) return list(main, l);
  const p = PUZZLES.find((x) => x.id === Number(args[0])); if (!p) return list(main, l);
  const T = TEACHERS[l.teacher] ?? TEACHERS.amina, fig = teacherFigure(T.id);
  const W = world(p), CELL = 44;
  let prog = [], cursor = prog, timer = null;

  // ── the board ──
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W.w * CELL} ${W.h * CELL}`); svg.setAttribute('class', 'maze');
  let cells = '';
  W.grid.forEach((row, y) => row.forEach((c, x) => { cells += `<rect x="${x * CELL}" y="${y * CELL}" width="${CELL}" height="${CELL}" class="${c === '#' ? 'wall' : 'floor'}"/>`; }));
  cells += `<g transform="translate(${W.flag.x * CELL + 12} ${W.flag.y * CELL + 6})"><path d="M2 2v32" stroke="#444" stroke-width="3"/><path d="M4 3h18l-5 6 5 6H4z" fill="#E0442E"/></g>`;
  svg.innerHTML = cells + '<g class="gems"></g><g class="bot"><circle r="15" fill="#2563EB"/><path d="M-8-11 0-23 8-11z" fill="#FFC83D" stroke="#B88A00"/><circle cx="-5.5" cy="-4" r="3.2" fill="#fff"/><circle cx="5.5" cy="-4" r="3.2" fill="#fff"/><circle cx="-5.5" cy="-5" r="1.5" fill="#1E3A8A"/><circle cx="5.5" cy="-5" r="1.5" fill="#1E3A8A"/><path d="M-5 6h10" stroke="#DBEAFE" stroke-width="2.5" stroke-linecap="round"/></g>';
  const bot = svg.querySelector('.bot'), gemsG = svg.querySelector('.gems');
  const ANG = { N: 0, E: 90, S: 180, W: 270 };
  const pose = (st) => {
    bot.setAttribute('transform', `translate(${st.x * CELL + CELL / 2} ${st.y * CELL + CELL / 2}) rotate(${ANG[st.dir]})`);
    gemsG.innerHTML = st.gems.map((g) => { const [x, y] = g.split(',').map(Number); return `<path transform="translate(${x * CELL + CELL / 2} ${y * CELL + CELL / 2})" d="M-8-4l4-5h8l4 5-8 11z" fill="#22C55E" stroke="#15803D"/>`; }).join('');
  };
  const reset = () => { clearInterval(timer); pose({ x: W.start.x, y: W.start.y, dir: p.dir, gems: [...W.gems] }); };
  reset();

  // ── the program ──
  const progEl = el('div', { class: 'program', 'aria-label': 'Your program' });
  const count = el('span', { class: 'count' });
  const draw = () => {
    const render = (list) => el('ol', { class: `blocks ${list === cursor ? 'cursor' : ''}` }, ...list.map((b, i) => {
      const del = el('button', { type: 'button', class: 'del', 'aria-label': 'Remove block', onclick: (e) => { e.stopPropagation(); list.splice(i, 1); if (!contains(prog, cursor)) cursor = prog; draw(); } }, icon('x'));
      if (b.op === 'repeat' || b.op === 'until') {
        const head = el('div', { class: 'blk loop', onclick: () => { cursor = b.body; draw(); } },
          el('b', {}, b.op === 'repeat' ? 'Repeat' : 'Repeat until flag'),
          b.op === 'repeat' ? el('span', { class: 'times' }, button('−', (e) => { e.stopPropagation(); b.n = Math.max(2, b.n - 1); draw(); }, 'mini'), el('b', {}, String(b.n)), button('+', (e) => { e.stopPropagation(); b.n = Math.min(12, b.n + 1); draw(); }, 'mini'), ' times') : null, del);
        return el('li', { class: 'loop-li' }, head, render(b.body), el('button', { type: 'button', class: 'loop-end', onclick: () => { cursor = parentOf(prog, b.body) ?? prog; draw(); } }, b.body === cursor ? 'Done adding inside ✓' : ''));
      }
      return el('li', {}, el('div', { class: `blk b-${b.op === 'if' ? 'if' : b.op}` }, el('span', {}, BLOCKS[b.op === 'if' ? '?' + b.dir : b.op].short), BLOCKS[b.op === 'if' ? '?' + b.dir : b.op].label, del));
    }), list.length ? null : el('li', { class: 'hole' }, list === prog ? 'Tap blocks below to add them here' : 'Add blocks inside'));
    progEl.replaceChildren(render(prog));
    const n = countBlocks(prog); count.textContent = `${n} block${n === 1 ? '' : 's'} · best is ${p.limit}`;
  };
  const contains = (list, target) => list === target || list.some((b) => b.body && contains(b.body, target));
  const parentOf = (list, target) => { for (const b of list) { if (b.body === target) return list; if (b.body) { const r = parentOf(b.body, target); if (r) return r; } } return null; };
  const add = (key) => {
    if (key === '[') { const b = { op: 'repeat', n: 3, body: [] }; cursor.push(b); cursor = b.body; }
    else if (key === '{') { const b = { op: 'until', body: [] }; cursor.push(b); cursor = b.body; }
    else if (key.startsWith('?')) cursor.push({ op: 'if', dir: key[1] });
    else cursor.push({ op: key });
    draw();
  };
  const toolKeys = ['F', 'L', 'R', ...(p.tools.includes('[') ? ['['] : []), ...(p.tools.includes('{') ? ['{'] : []), ...(p.tools.includes('?') ? ['?F', '?L', '?R'] : []), ...(p.tools.includes('W') ? ['?W'] : [])];
  const palette = el('div', { class: 'palette' }, ...toolKeys.map((k) => el('button', { type: 'button', class: `blk b-${k.startsWith('?') ? 'if' : k === '[' || k === '{' ? 'loop' : k}`, onclick: () => add(k) }, el('span', {}, BLOCKS[k].short), BLOCKS[k].label)));
  const msg = el('p', { class: 'code-msg', 'aria-live': 'polite' });
  const runIt = () => {
    reset();
    const { trace, result } = run(p, prog);
    let k = 0; msg.textContent = 'Running…';
    timer = setInterval(() => {
      if (k < trace.length) { pose(trace[k]); if (trace[k].event === 'bump') svg.classList.add('bump'); k++; return; }
      clearInterval(timer); svg.classList.remove('bump');
      const n = countBlocks(prog);
      const text = { win: '', crash: 'Bump! The robot hit a wall. Check the blocks and try again.', short: 'The robot stopped before the flag. Add more blocks.', gems: 'You reached the flag, but some gems are left. Collect them all!', loop: 'The program never finished. Check your loop.' }[result];
      if (result === 'win') {
        const stars = starsFor(p, n); coded(l, p.id, stars); chime(true);
        msg.replaceChildren(el('b', {}, '★'.repeat(stars) + '☆'.repeat(3 - stars)), ` Solved with ${n} blocks!`, stars < 3 ? ` Can you do it in ${p.limit}?` : '', ' ', PUZZLES.find((x) => x.id === p.id + 1) ? el('a', { href: `#/code/${p.id + 1}`, class: 'btn btn-sm btn-primary' }, 'Next puzzle') : el('a', { href: '#/code', class: 'btn btn-sm' }, 'All puzzles'));
        say(stars === 3 ? 'Brilliant! Solved with the fewest blocks.' : `Solved! Now try to use only ${p.limit} blocks.`, { teacher: T.id, fig });
      } else { chime(false); msg.textContent = text; say(text, { teacher: T.id, fig }); }
    }, 380);
  };
  main.append(
    el('a', { class: 'back', href: '#/code' }, icon('back'), 'All puzzles'),
    el('div', { class: 'code-head' }, el('div', { class: 'side-teacher sm' }, fig), el('div', {}, el('p', { class: 'kicker' }, `Puzzle ${p.id} of ${PUZZLES.length}`), el('h1', { class: 'h2' }, p.title), el('p', { class: 'lede' }, p.teach))),
    el('div', { class: 'code' }, el('div', { class: 'code-board' }, svg, msg),
      el('div', { class: 'code-edit' }, el('div', { class: 'row between' }, el('b', {}, 'Your program'), count), progEl, el('p', { class: 'small' }, 'Blocks'), palette,
        el('div', { class: 'row' }, button([icon('play'), 'Run'], runIt, 'btn btn-primary btn-lg'), button('Reset robot', reset, 'btn'), button([icon('trash'), 'Clear'], () => { prog.length = 0; cursor = prog; draw(); reset(); }, 'btn btn-quiet')))),
  );
  draw();
  say(p.teach, { teacher: T.id, fig });
  return () => { clearInterval(timer); stopSpeaking(); };
}

function list(main, l) {
  main.append(
    el('a', { class: 'back', href: '#/' }, icon('back'), 'Home'),
    el('p', { class: 'kicker' }, 'Coding'), el('h1', { class: 'h1' }, 'Robot puzzles'),
    el('p', { class: 'lede' }, 'Guide the robot to the flag with blocks. First in order, then with loops, then with loops that think for themselves.'),
    el('div', { class: 'puzzles' }, ...PUZZLES.map((p) => {
      const s = l.progress.code[p.id] ?? 0;
      return el('a', { class: `puzzle ${s ? 'done' : ''}`, href: `#/code/${p.id}` }, el('b', { class: 'pn' }, String(p.id)), el('span', {}, p.title), el('small', { class: 'stars3' }, '★'.repeat(s) + '☆'.repeat(3 - s)),
        el('small', {}, p.tools.includes('{') ? 'Loops + ifs' : p.tools.includes('[') ? 'Loops' : 'Sequence'));
    })),
  );
}
