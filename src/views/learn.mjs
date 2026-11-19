// The classroom (#/learn/<skill>): the teacher stands by the chalkboard, writes each step and says it, then asks a
// question. A right answer → the lesson counts as learned and practice is next. A wrong one → the teacher shows the
// working and asks another. For reading (English, grades K–3) the learner can read a board line aloud: the teacher
// listens and marks each word, and says the ones to try again.
import { el, icon, button, visual, mathText } from '../app/ui.mjs';
import { current, learned, answer } from '../app/store.mjs';
import { SKILL, SUBJECTS, lessonOf, makeItem, gradeLabel, isYoung } from '../app/curriculum.mjs';
import { question } from '../app/question.mjs';
import { TEACHERS, teacherFigure, say, stopSpeaking, listen, canListen, isMuted, setMuted } from '../app/teacher.mjs';

export default function (main, { args, go }) {
  const l = current(), T = TEACHERS[l.teacher] ?? TEACHERS.amina, young = isYoung(l.grade);
  const skill = SKILL[args[0]]; if (!skill) return go('');
  const sub = SUBJECTS[skill.subject];
  const lesson = lessonOf(skill);
  const fig = teacherFigure(T.id);
  const board = el('ol', { class: 'board-lines' });
  const boardWrap = el('div', { class: 'chalkboard' }, el('p', { class: 'board-title' }, skill.title), board);
  const caption = el('p', { class: 'caption', 'aria-live': 'polite' });
  const below = el('div', { class: 'class-below' });
  let i = 0, alive = true, auto = true;
  const readable = skill.subject === 'english' && skill.grade <= 3 && canListen();

  const muteBtn = el('button', { type: 'button', class: 'btn btn-sm', onclick: () => { setMuted(!isMuted()); muteBtn.replaceChildren(icon('sound'), isMuted() ? 'Sound off' : 'Sound on'); } }, icon('sound'), isMuted() ? 'Sound off' : 'Sound on');
  const nextBtn = button(['Next', icon('next')], () => { auto = false; step(); }, 'btn btn-primary');
  const againBtn = button([icon('sound'), 'Say it again'], () => { const s = lesson.steps[i - 1]; if (s) speak(s.say); }, 'btn');
  const controls = el('div', { class: 'class-controls' }, againBtn, nextBtn, muteBtn);

  main.style.setProperty('--sc', sub.colour); main.style.setProperty('--ss', sub.soft);
  main.append(
    el('a', { class: 'back', href: skill.subject === 'activities' ? '#/play' : `#/subject/${skill.subject}/${skill.grade}` }, icon('back'), sub.name),
    el('p', { class: 'kicker' }, `${sub.name} · ${gradeLabel(skill.grade)} · Lesson with ${T.name}`),
    el('div', { class: 'classroom' }, el('div', { class: 'class-teacher' }, fig, caption), boardWrap),
    controls, below,
  );

  async function speak(text) { caption.textContent = text; await say(text, { teacher: T.id, fig }); }

  async function step() {
    if (i >= lesson.steps.length) return ask();
    const s = lesson.steps[i++];
    board.querySelectorAll('li').forEach((x) => x.classList.remove('now'));
    const li = el('li', { class: s.head ? 'now board-head' : 'now' }, el('span', { class: 'chalk' }, mathText(s.board)));
    const pic = visual(s.visual); if (pic) li.append(pic);
    if (readable && !s.visual) li.append(el('button', { type: 'button', class: 'read-btn', title: 'Read this line to me', onclick: () => readAloud(s.board, li) }, icon('mic'), 'Read it'));
    board.append(li);
    li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    nextBtn.replaceChildren(i >= lesson.steps.length ? 'Your turn' : 'Next', icon('next'));
    await speak(s.say);
    if (alive && auto && i < lesson.steps.length) setTimeout(() => alive && auto && step(), 700);
  }

  // Check your understanding: three questions (two for the youngest). All but one right completes the lesson.
  const checks = (lesson.checks?.length ? lesson.checks : [lesson.check]).slice(0, young ? 2 : 3);
  const need = Math.max(1, checks.length - 1);
  let k = 0, rightN = 0, round = 0;
  const again = () => { below.replaceChildren(); board.replaceChildren(); i = 0; auto = true; controls.hidden = false; step(); };
  async function ask() {
    controls.hidden = true;
    const item = round === 0 ? checks[k] : makeItem(skill);
    const lead = round ? "Let's try another one." : k === 0 ? `Now check your understanding, ${l.name}: ${checks.length} questions.` : `Question ${k + 1}.`;
    const dots = el('div', { class: 'chk-dots', 'aria-hidden': 'true' }, ...checks.map((_, j) => el('span', { class: j < k ? 'done' : j === k ? 'now' : '' })));
    const q = question(item, { teacher: T.id, fig, young, onDone: (right) => {
      answer(l, skill.id, right, { kind: 'lesson' });
      if (right) rightN++;
      if (round === 0) { dots.children[k]?.classList.add(right ? 'ok' : 'miss'); k++; }
      if ((round === 0 && k < checks.length) || (round > 0 && !right)) { q.append(el('div', { class: 'row' }, button([round ? 'Try another' : 'Next question', icon('next')], ask, 'btn btn-primary'), round ? button('Watch the lesson again', again, 'btn') : null)); return; }
      if (round > 0 || rightN >= need) {
        learned(l, skill.id);
        q.append(el('p', { class: 'cele' }, icon('star'), round ? 'Lesson complete! +5 stars.' : `Lesson complete: ${rightN} of ${checks.length} right. +5 stars.`), el('div', { class: 'row' }, el('a', { class: 'btn btn-primary', href: skill.subject === 'activities' ? `#/play/${skill.id}` : `#/practise/${skill.id}` }, 'Practise now', icon('next')), el('a', { class: 'btn', href: '#/' }, 'Home')));
        say(`Well done, ${l.name}! Lesson complete.`, { teacher: T.id, fig });
      } else {
        round++;
        q.append(el('p', { class: 'nudge' }, icon('hint'), `${rightN} of ${checks.length} right. Watch the lesson again, or try one more.`), el('div', { class: 'row' }, button(['Try another', icon('next')], ask, 'btn btn-primary'), button('Watch the lesson again', again, 'btn')));
      }
    } });
    below.replaceChildren(el('p', { class: 'lead' }, lead), round ? null : dots, q);
    await speak(lead);
    q.querySelector('.q-read')?.click();
  }

  // read a line aloud: the teacher listens and marks each word
  async function readAloud(text, li) {
    const words = text.replace(/[^\w\s'’-]/g, ' ').split(/\s+/).filter(Boolean);
    let out = li.querySelector('.read-out'); if (!out) { out = el('p', { class: 'read-out' }); li.append(out); }
    out.replaceChildren(el('em', {}, 'Listening… read the line now.'));
    const heard = await listen({ timeout: 12000 });
    if (!heard.length) { out.replaceChildren('I didn’t hear anything. Try again when you are ready.'); return; }
    const said = new Set(heard.join(' ').toLowerCase().replace(/[^\w\s'’-]/g, ' ').split(/\s+/));
    const marks = words.map((w) => ({ w, ok: said.has(w.toLowerCase()) }));
    const miss = marks.filter((m) => !m.ok).map((m) => m.w);
    out.replaceChildren(...marks.flatMap((m) => [el('span', { class: m.ok ? 'w-ok' : 'w-miss' }, m.w), ' ']));
    const pct = Math.round(100 * (words.length - miss.length) / Math.max(1, words.length));
    out.append(el('small', {}, ` ${pct}% read clearly`));
    await speak(miss.length === 0 ? 'Beautiful reading!' : miss.length <= 2 ? `Good reading! Let's practise: ${miss.join(', ')}.` : `Nice try. Listen to me, then try again. ${text}`);
  }

  step();
  return () => { alive = false; stopSpeaking(); };
}
