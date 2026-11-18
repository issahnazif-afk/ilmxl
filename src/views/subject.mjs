// A subject's skills, laid out like a skills catalogue: a rail of grades down the side, the grade's categories
// lettered A, B, C … and the skills in each numbered, with the learner's XL score beside each. Maths can also be
// viewed by topic (every grade's skills on one topic), and has the Fluency Zone (timed fact sprints).
// Visitors who are not signed in can browse; practising asks them to sign in.
import { el, icon } from '../app/ui.mjs';
import { current, skillOf } from '../app/store.mjs';
import { SUBJECTS, SKILLS, skillsFor, gradesWith, gradeShort, gradeLabel, PROVINCES } from '../app/curriculum.mjs';
import { TOPICS, TOPIC, topicsOf } from '../app/topics.mjs';
import { me } from '../app/account.mjs';

export const GRADE_HUE = { '-1': '#0EA5E9', 0: '#F97316', 1: '#22C55E', 2: '#EF4444', 3: '#3B82F6', 4: '#A855F7', 5: '#10B981', 6: '#F43F5E', 7: '#0F766E', 8: '#EAB308', 9: '#7C3AED', 10: '#DB2777', 11: '#2563EB', 12: '#EA580C' };
// A … Z, then AA, BB … (the way skill catalogues letter their categories)
export const letter = (i) => (i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(65 + (i % 26)).repeat(Math.floor(i / 26) + 1));
// a grade's categories, in order, each with its skills
export function categories(subject, grade, province) {
  const list = skillsFor(subject, grade, province);
  return [...new Set(list.map((s) => s.strand))].map((st, i) => ({ code: letter(i), name: st, skills: list.filter((s) => s.strand === st) }));
}
// the code a skill has in its grade's list, e.g. "D.3"
export function codeOf(skill, province) {
  const cats = categories(skill.subject, skill.grade, province);
  for (const c of cats) { const k = c.skills.indexOf(skill); if (k >= 0) return `${c.code}.${k + 1}`; }
  return '';
}

export default function (main, { args, go }) {
  const l = current(), signedIn = !!me();
  const province = l?.province ?? 'NS';
  const sub = SUBJECTS[args[0]];
  if (!sub) return go(signedIn ? '' : 'welcome');
  const byTopic = args[1] === 'topic' && sub.id === 'math';
  const grades = gradesWith(sub.id, province);
  const mine = l?.grade;
  main.classList.add('catalogue');
  main.style.setProperty('--sc', sub.colour); main.style.setProperty('--ss', sub.soft);
  const practiseHref = (s) => (signedIn ? `#/practise/${s.id}` : '#/signup');
  const scoreOf = (s) => (l ? skillOf(l, s.id) : null);
  const skillLink = (s, code) => {
    const p = scoreOf(s);
    return el('li', { class: `cat-skill ${p?.level === 4 ? 'mastered' : ''}` },
      el('span', { class: 'cat-num' }, code),
      el('a', { href: practiseHref(s), class: 'cat-link' }, s.title),
      p?.tries ? el('span', { class: 'cat-score', title: 'XL score' }, p.level === 4 ? icon('star') : null, String(p.score)) : null,
      signedIn ? el('a', { class: 'cat-lesson', href: `#/learn/${s.id}`, title: 'Lesson with your teacher', 'aria-label': `Lesson: ${s.title}` }, icon('board')) : null,
    );
  };
  const total = SKILLS.filter((s) => s.subject === sub.id).length;
  const viewbar = sub.id === 'math' ? el('div', { class: 'viewbar', role: 'tablist', 'aria-label': 'View by' },
    el('span', { class: 'muted' }, 'View by:'),
    el('a', { role: 'tab', 'aria-selected': String(!byTopic), class: byTopic ? '' : 'on', href: `#/subject/math/${byTopic ? (mine ?? 1) : args[1] ?? mine ?? 1}` }, 'Grades'),
    el('a', { role: 'tab', 'aria-selected': String(byTopic), class: byTopic ? 'on' : '', href: '#/subject/math/topic/fractions' }, 'Topics'),
    el('a', { href: '#/fluency', class: 'fz-chip' }, icon('bolt'), 'Fluency Zone')) : null;

  if (byTopic) {
    const t = TOPIC[args[2]] ?? TOPICS[0];
    const all = SKILLS.filter((s) => s.subject === 'math' && topicsOf(s).includes(t.id));
    const gs = [...new Set(all.map((s) => s.grade))].sort((a, b) => a - b);
    main.append(
      el('a', { class: 'back', href: signedIn ? '#/' : '#/welcome' }, icon('back'), signedIn ? 'Home' : 'IlmXL'),
      el('header', { class: 'cat-head' }, el('div', {}, el('p', { class: 'kicker' }, 'Maths by topic'), el('h1', { class: 'cat-title' }, t.name), el('p', { class: 'lede' }, `${all.length} skills on ${t.name.toLowerCase()}, from ${gradeLabel(gs[0] ?? 0)} to ${gradeLabel(gs.at(-1) ?? 12)}. Pick any one to practise.`)),
        el('div', { class: 'cat-stats' }, el('span', { class: 'stat-chip' }, el('b', {}, String(total)), ' maths skills'), el('span', { class: 'stat-chip' }, el('b', {}, String(TOPICS.length)), ' topics'))),
      viewbar,
      el('div', { class: 'cat-layout' },
        el('nav', { class: 'topic-rail', 'aria-label': 'Topics' }, ...TOPICS.map((x) => el('a', { href: `#/subject/math/topic/${x.id}`, class: x.id === t.id ? 'on' : '', 'aria-current': x.id === t.id ? 'page' : null }, x.name))),
        el('div', { class: 'cat-cols' }, ...gs.map((g) => el('section', { class: 'cat', style: `--gh:${GRADE_HUE[g]}` },
          el('h2', { class: 'cat-h' }, el('a', { href: `#/subject/math/${g}` }, `${gradeLabel(g)}`)),
          el('ol', { class: 'cat-list' }, ...all.filter((s) => s.grade === g).map((s) => skillLink(s, codeOf(s, province))))))),
      ),
    );
    return;
  }

  let g = args[1] != null && args[1] !== '' ? Number(args[1]) : grades.includes(mine) ? mine : grades.find((x) => x >= (mine ?? 1)) ?? grades[0];
  if (!grades.includes(g)) g = grades[0];
  const cats = categories(sub.id, g, province);
  const n = cats.reduce((a, c) => a + c.skills.length, 0);
  const done = l ? cats.flatMap((c) => c.skills).filter((s) => skillOf(l, s.id).level === 4).length : 0;
  const prov = PROVINCES.find((p) => p.id === province);
  main.append(
    el('a', { class: 'back', href: signedIn ? '#/' : '#/welcome' }, icon('back'), signedIn ? 'Home' : 'IlmXL'),
    el('header', { class: 'cat-head', style: `--gh:${GRADE_HUE[g]}` },
      el('div', {}, el('p', { class: 'kicker' }, sub.name), el('h1', { class: 'cat-title' }, `${gradeLabel(g)} ${sub.id === 'math' ? 'maths' : sub.name.toLowerCase()}`),
        el('p', { class: 'lede' }, sub.blurb, sub.id === 'social' ? ` Topics are for all of Canada${prov?.ready ? `, plus ${prov.name}’s own` : ''}.` : '', ' Pick any skill to practise; your teacher helps when you slip.')),
      el('div', { class: 'cat-stats' },
        el('span', { class: 'stat-chip' }, el('b', {}, String(n)), ' skills'),
        el('span', { class: 'stat-chip' }, el('b', {}, String(cats.length)), ' categories'),
        l ? el('span', { class: 'stat-chip' }, el('b', {}, String(done)), ' mastered') : null)),
    viewbar,
    el('div', { class: 'cat-layout' },
      el('nav', { class: 'grade-rail', 'aria-label': 'Grades' }, ...grades.map((x) => el('a', { href: `#/subject/${sub.id}/${x}`, class: `${x === g ? 'on' : ''} ${x === mine ? 'mine' : ''}`, style: `--gh:${GRADE_HUE[x]}`, title: gradeLabel(x), 'aria-current': x === g ? 'page' : null }, gradeShort(x)))),
      el('div', { class: 'cat-cols' }, ...cats.map((c) => el('section', { class: 'cat', style: `--gh:${GRADE_HUE[g]}` },
        el('h2', { class: 'cat-h' }, el('span', { class: 'cat-code' }, `${c.code}.`), ' ', c.name),
        el('ol', { class: 'cat-list' }, ...c.skills.map((s, k) => skillLink(s, String(k + 1)))))),
        cats.length ? null : el('p', { class: 'empty' }, 'No skills here yet.')),
    ),
  );
}
