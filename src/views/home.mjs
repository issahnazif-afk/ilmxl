// Home: a greeting from the teacher, today's plan, and the subjects with progress.
import { el, icon } from '../app/ui.mjs';
import { current, streakDays } from '../app/store.mjs';
import { SUBJECTS, SKILL, gradeLabel } from '../app/curriculum.mjs';
import { today, subjectsFor, summary } from '../app/path.mjs';
import { TEACHERS, teacherFigure, say } from '../app/teacher.mjs';

const KIND = { learn: ['board', 'Lesson'], practise: ['practise', 'Practise'], review: ['star', 'Review'], code: ['code', 'Coding'] };
export const hrefFor = (t) => (t.kind === 'review' ? '#/review' : t.kind === 'code' ? `#/code/${t.puzzle}` : SKILL[t.skill]?.subject === 'activities' ? `#/play/${t.skill}` : `#/${t.kind}/${t.skill}`);

export default function (main) {
  const l = current(), T = TEACHERS[l.teacher] ?? TEACHERS.amina, all = summary(l);
  const hour = new Date().getHours();
  const hello = `${hour < 12 ? 'Good morning' : hour < 18 ? 'Hello' : 'Good evening'}, ${l.name}!`;
  const fig = teacherFigure(T.id);
  const plan = today(l);
  const bubble = plan.length ? `${hello} Today let's start with ${plan[0].title}.` : `${hello} You have finished everything on your path. Try another grade, or the world!`;
  main.append(
    el('section', { class: 'hello' },
      el('button', { type: 'button', class: 'hello-teacher', title: `${T.name} says hello`, onclick: () => say(bubble, { teacher: T.id, fig }) }, fig),
      el('div', { class: 'hello-body' },
        el('p', { class: 'kicker' }, `${gradeLabel(l.grade)} · ${T.name}`),
        el('h1', { class: 'h1' }, hello),
        el('p', { class: 'bubble' }, bubble),
      ),
      el('div', { class: 'hello-stats' },
        el('div', { class: 'stat' }, el('b', {}, icon('flame'), String(streakDays(l))), el('small', {}, 'days in a row')),
        el('div', { class: 'stat' }, el('b', {}, icon('check'), `${all.proficient}/${all.total}`), el('small', {}, 'skills proficient')),
      ),
    ),
    el('h2', { class: 'h2' }, 'Today'),
    el('div', { class: 'plan' }, ...plan.map((t, i) => {
      const [ic, label] = KIND[t.kind];
      const sub = SUBJECTS[t.subject] ?? SUBJECTS.math;
      return el('a', { class: 'task', href: hrefFor(t), style: `--sc:${sub.colour};--ss:${sub.soft}` },
        el('span', { class: 'task-n' }, String(i + 1)),
        el('span', { class: 'task-ic' }, icon(ic)),
        el('span', { class: 'task-body' }, el('small', {}, `${label}${t.subject && t.kind !== 'code' ? ' · ' + sub.name : ''}`), el('b', {}, t.title), el('span', {}, t.text)),
        icon('next', 'task-go'));
    })),
    el('h2', { class: 'h2' }, 'Subjects'),
    el('div', { class: 'subjects' }, ...[...subjectsFor(l), ...(l.grade >= 0 ? ['coding'] : [])].map((id) => {
      const s = SUBJECTS[id], sum = id === 'coding' ? null : summary(l, id);
      const href = id === 'coding' ? '#/code' : id === 'activities' ? '#/play' : `#/subject/${id}`;
      return el('a', { class: 'subject', href, style: `--sc:${s.colour};--ss:${s.soft}` },
        el('span', { class: 'subject-ic' }, icon(s.icon)),
        el('b', {}, s.name), el('small', {}, s.blurb),
        sum ? el('span', { class: 'bar', title: `${sum.proficient} of ${sum.total} proficient` }, el('i', { style: `width:${sum.total ? (100 * sum.proficient / sum.total) : 0}%` }), el('em', { style: `width:${sum.total ? (100 * (sum.familiar - sum.proficient) / sum.total) : 0}%` })) : el('span', { class: 'bar' }, el('i', { style: `width:${(100 * Object.keys(l.progress.code).length / 15)}%` })),
      );
    })),
    el('p', { class: 'foot' }, el('a', { href: '#/about' }, 'About IlmXL'), ' · Free, private, no account. Progress stays on this device.'),
    l.grade < 0 ? el('a', { class: 'trace-cta', href: '#/trace' }, icon('trace'), el('b', {}, 'Tracing'), el('span', {}, 'Trace letters and numbers with your finger.')) : null,
  );
}
