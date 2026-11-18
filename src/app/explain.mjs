// A worked solution, one step at a time, the way a teacher works at the board: each step appears with its picture
// (the column, the number line, the fraction bars...), the teacher says it, and the next one follows when she has
// finished (or when the learner taps Next). Back, Show all and Say it again are always there.
// Used after a wrong answer, on "See the steps" after a right one, in "Learn with an example", and in lessons.
import { el, icon, button, visual, mathText } from './ui.mjs';
import { say, stopSpeaking, isMuted } from './teacher.mjs';
import { stepText, stepSay } from './curriculum.mjs';

export function explain(steps, { teacher = 'amina', fig = null, autoplay = true, title = "Let's work it out, step by step", lead = null } = {}) {
  const S = (steps ?? []).map((s) => (typeof s === 'string' ? { text: s } : s)).filter((s) => s && s.text);
  const box = el('div', { class: 'explain' });
  if (!S.length) return box;
  const list = el('ol', { class: 'ex-steps' });
  const pic = el('div', { class: 'ex-pic', 'aria-hidden': 'true' });
  const counter = el('span', { class: 'ex-count' });
  let k = -1, auto = autoplay, run = 0;
  const alive = () => box.isConnected;

  const backBtn = button([icon('back'), 'Back'], () => { auto = false; go(k - 1); }, 'btn btn-sm');
  const nextBtn = button(['Next step', icon('next')], () => { auto = false; go(k + 1); }, 'btn btn-sm btn-primary');
  const againBtn = button([icon('sound'), 'Say it again'], () => { auto = false; speak(k); }, 'btn btn-sm');
  const allBtn = button('Show all steps', () => { auto = false; run++; stopSpeaking(); draw(S.length - 1, true); }, 'btn btn-sm btn-ghost');
  const controls = el('div', { class: 'ex-controls' }, backBtn, nextBtn, againBtn, allBtn, counter);

  box.append(el('p', { class: 'ex-title' }, icon('board'), title), el('div', { class: 'ex-body' }, list, pic), controls);

  // the picture for step i: the latest picture up to that step (the working keeps growing on the board)
  const picAt = (i) => { for (let j = i; j >= 0; j--) if (S[j].visual) return S[j].visual; return null; };
  function draw(i, all = false) {
    k = Math.max(0, Math.min(S.length - 1, i));
    list.classList.toggle('all', all);
    list.replaceChildren(...S.slice(0, k + 1).map((s, j) => el('li', { class: j === k && !all ? 'now' : '' }, mathText(s.text))));
    const v = picAt(k); pic.replaceChildren(...(v ? [visual(v)].filter(Boolean) : [])); pic.hidden = !v;
    counter.textContent = `Step ${k + 1} of ${S.length}`;
    backBtn.disabled = k <= 0; nextBtn.disabled = k >= S.length - 1;
    list.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  async function speak(i) {
    const mine = ++run;
    await say(stepSay(S[i]), { teacher, fig });
    return mine === run;
  }
  async function go(i) {
    if (i < 0 || i >= S.length) return;
    draw(i);
    const still = await speak(k);
    if (!still || !alive() || !auto || k >= S.length - 1) return;
    // with the sound off there is nothing to wait for: give time to read instead
    await new Promise((r) => setTimeout(r, isMuted() ? 1800 + stepText(S[k]).length * 35 : 650));
    if (alive() && auto) go(k + 1);
  }
  // the first step is on the board at once; the teacher says her opening line, then talks through the steps
  box.start = async () => {
    draw(0);
    if (lead) { const mine = ++run; await say(lead, { teacher, fig }); if (mine !== run || !alive()) return; }
    go(0);
  };
  return box;
}
