// One question on screen: the prompt, its picture, the way to answer (tap a choice, type, or say it), then the
// teacher's feedback with worked steps. Used by practice, the teacher's lessons, reviews and the world's gates.
import { el, icon, visual, mathText, chime, SHAPE_SVG } from './ui.mjs';
import { mark, spokenToNumber } from './answer.mjs';
import { say, listen, canListen, praise, retry } from './teacher.mjs';
import { speakable } from './curriculum.mjs';
import { COLOURS } from './activities.mjs';

// opts: { teacher, fig, young, speak (read the question aloud), onDone(right, given) }
export function question(item, opts = {}) {
  const { teacher = 'amina', fig = null, young = false } = opts;
  const box = el('div', { class: `q ${young ? 'q-young' : ''}`, 'aria-live': 'polite' });
  const spoken = item.say ?? speakable(item.q);
  const readBtn = el('button', { type: 'button', class: 'q-read', title: 'Read it to me', 'aria-label': 'Read the question aloud', onclick: () => say(spoken, { teacher, fig }) }, icon('sound'));
  box.append(el('div', { class: 'q-head' }, readBtn, el('p', { class: `q-text ${item.big ? 'q-big' : ''}` }, mathText(item.q))));
  const pic = visual(item.visual); if (pic) box.append(pic);
  const fb = el('div', { class: 'q-fb', hidden: true });
  let answered = false;

  const finish = (given) => {
    if (answered) return; answered = true;
    const res = mark(item, given);
    box.classList.add(res.right ? 'is-right' : 'is-wrong');
    chime(res.right);
    const right = item.kind === 'mc' ? item.choices[item.a] : item.answer;
    fb.hidden = false;
    const word = res.right ? praise() : res.reason === 'simplify' ? 'Right value, but write it in simplest form.' : retry();
    fb.replaceChildren(
      el('p', { class: 'q-verdict' }, icon(res.right ? 'check' : 'x'), word),
      res.right ? null : el('p', { class: 'q-answer' }, 'The answer is ', el('b', {}, mathText(right)), '.'),
      !res.right && item.steps?.length ? el('ol', { class: 'q-steps' }, ...item.steps.map((s) => el('li', {}, mathText(s)))) : null,
    );
    const line = res.right ? word : `${word} The answer is ${speakable(right)}. ${(item.steps ?? []).map(speakable).join(' ')}`;
    say(line, { teacher, fig });
    box.querySelectorAll('button.choice, .q-input input, .q-input button, .keypad button').forEach((b) => (b.disabled = true));
    opts.onDone?.(res.right, given);
  };

  if (item.kind === 'mc') {
    const shapes = item.shapeChoices, swatches = item.swatches;
    box.append(el('div', { class: `choices ${shapes || swatches ? 'choices-pics' : ''} ${item.choices.length > 3 || item.choices.some((c) => c.length > 28) ? '' : 'choices-row'}` },
      ...item.choices.map((c, i) => el('button', { type: 'button', class: 'choice', 'aria-label': c, onclick: (e) => { e.currentTarget.classList.add('picked'); box.querySelectorAll('.choice')[item.a].classList.add('correct'); finish(i); } },
        shapes ? el('span', { class: 'shape-pic', html: `<svg viewBox="0 0 100 100"><g fill="#F4C430" stroke="#B88A00" stroke-width="3">${SHAPE_SVG[c]}</g></svg>` })
          : swatches ? el('span', { class: 'swatch', style: `background:${COLOURS[c]}` })
            : el('span', { class: item.big ? 'big' : '' }, mathText(c))))));
  } else {
    const input = el('input', { type: 'text', inputmode: item.kind === 'num' && !young ? 'decimal' : 'text', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Your answer', placeholder: item.kind === 'num' ? 'Your answer' : 'Type your answer' });
    const submit = el('button', { type: 'submit', class: 'btn btn-primary' }, 'Submit');
    const mic = canListen() ? el('button', { type: 'button', class: 'btn mic', title: 'Say your answer', 'aria-label': 'Say your answer' }, icon('mic')) : null;
    mic?.addEventListener('click', async () => {
      mic.classList.add('on');
      const heard = await listen({ onState: (s) => mic.classList.toggle('on', s === 'listening') });
      if (!heard.length) { say("I didn't catch that. Try again, or type it.", { teacher, fig }); return; }
      const val = item.kind === 'num' ? heard.map(spokenToNumber).find((x) => x != null) : heard[0];
      if (val == null) { say(`I heard ${heard[0]}. Can you say a number?`, { teacher, fig }); return; }
      input.value = val; say(`I heard ${speakable(val)}.`, { teacher, fig }).then(() => finish(val));
    });
    const form = el('form', { class: 'q-input', onsubmit: (e) => { e.preventDefault(); if (input.value.trim()) finish(input.value); else input.focus(); } },
      item.unit && /=$/.test(item.unit) ? el('span', { class: 'unit' }, item.unit) : null, input, item.unit && !/=$/.test(item.unit) ? el('span', { class: 'unit' }, item.unit) : null, mic, submit);
    box.append(form);
    if (young && item.kind === 'num') box.append(keypad(input, () => form.requestSubmit()));
    setTimeout(() => { if (!young) input.focus({ preventScroll: true }); }, 50);
  }
  box.append(fb);
  if (opts.speak) setTimeout(() => say(spoken, { teacher, fig }), 150);
  return box;
}

function keypad(input, submit) {
  const k = (label, on) => el('button', { type: 'button', onclick: on }, label);
  return el('div', { class: 'keypad' },
    ...'1234567890'.split('').map((d) => k(d, () => { input.value += d; })),
    k('⌫', () => { input.value = input.value.slice(0, -1); }),
    el('button', { type: 'button', class: 'go', onclick: submit }, icon('check')),
  );
}
