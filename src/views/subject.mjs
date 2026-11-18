// A subject: grade tabs (the learner's own grade first; any grade can be opened), skills grouped by strand,
// each with its mastery ring, XL score, and buttons for a lesson or practice.
import { el, icon, ring } from '../app/ui.mjs';
import { current, skillOf } from '../app/store.mjs';
import { SUBJECTS, skillsFor, gradesWith, gradeShort, gradeLabel, PROVINCES } from '../app/curriculum.mjs';

export default function (main, { args, go }) {
  const l = current();
  const sub = SUBJECTS[args[0]];
  if (!sub) return go('');
  const grades = gradesWith(sub.id, l.province);
  let g = args[1] != null ? Number(args[1]) : grades.includes(l.grade) ? l.grade : grades.find((x) => x >= l.grade) ?? grades[0];
  const list = skillsFor(sub.id, g, l.province);
  const strands = [...new Set(list.map((s) => s.strand))];
  const prov = PROVINCES.find((p) => p.id === l.province);
  main.style.setProperty('--sc', sub.colour); main.style.setProperty('--ss', sub.soft);
  main.append(
    el('a', { class: 'back', href: '#/' }, icon('back'), 'Home'),
    el('header', { class: 'subj-head' },
      el('span', { class: 'subject-ic big' }, icon(sub.icon)),
      el('div', {}, el('p', { class: 'kicker' }, gradeLabel(g)), el('h1', { class: 'h1' }, sub.name), el('p', { class: 'lede' }, sub.blurb,
        sub.id === 'social' ? ` Topics are for all of Canada${prov?.ready ? `, plus ${prov.name}’s own` : ''}.` : ''))),
    el('nav', { class: 'grade-tabs', 'aria-label': 'Grades' }, ...grades.map((x) => el('a', { href: `#/subject/${sub.id}/${x}`, class: `${x === g ? 'on' : ''} ${x === l.grade ? 'mine' : ''}`, title: gradeLabel(x) }, gradeShort(x)))),
    ...strands.map((st) => el('section', { class: 'strand' },
      el('h2', { class: 'h3' }, st),
      el('ul', { class: 'skills' }, ...list.filter((s) => s.strand === st).map((s) => {
        const p = skillOf(l, s.id);
        return el('li', { class: 'skill-row' },
          ring(p.level, 36),
          el('span', { class: 'skill-name' }, el('b', {}, s.title), s.province ? el('span', { class: 'tag' }, s.province) : null),
          el('span', { class: 'score', title: 'XL score' }, p.tries ? String(p.score) : '–'),
          el('a', { class: 'btn btn-sm', href: `#/learn/${s.id}`, title: 'Lesson with your teacher' }, icon('board'), el('span', {}, 'Lesson')),
          el('a', { class: 'btn btn-sm btn-primary', href: `#/practise/${s.id}` }, icon('practise'), el('span', {}, 'Practise')),
        );
      })),
    )),
    list.length ? null : el('p', { class: 'empty' }, 'No skills here yet.'),
  );
}
