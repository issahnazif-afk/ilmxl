// Choose a learner, or add one: name, grade, province (for Social Studies), teacher, how they like to learn.
import { el, icon, button } from '../app/ui.mjs';
import { learners, choose, addLearner } from '../app/store.mjs';
import { GRADES, PROVINCES, gradeLabel } from '../app/curriculum.mjs';
import { TEACHERS, teacherFigure, say } from '../app/teacher.mjs';
import { me } from '../app/account.mjs';

const COLOURS = ['#2563EB', '#C2410C', '#15803D', '#B91C1C', '#7C3AED', '#DB2777', '#0E7490', '#A16207'];
const WAYS = [
  { id: 'watch', label: 'Watch and listen', text: 'A lesson with my teacher first.' },
  { id: 'practise', label: 'Practise', text: 'Straight to questions; the teacher helps when I slip.' },
  { id: 'play', label: 'Play', text: 'The quest world and challenges.' },
  { id: 'build', label: 'Build', text: 'Puzzles and coding.' },
];

export default function (main, { route, go }) {
  const all = learners();
  if (route === 'who' && all.length) {
    main.append(
      el('p', { class: 'kicker' }, 'Welcome back'), el('h1', { class: 'h1' }, 'Who is learning?'),
      el('div', { class: 'who-grid' },
        ...all.map((l) => el('button', { type: 'button', class: 'who-card', onclick: () => { choose(l.id); go(''); } },
          el('span', { class: 'me-dot big', style: `--c:${l.colour}` }, l.name[0]?.toUpperCase()), el('b', {}, l.name), el('small', {}, gradeLabel(l.grade)))),
        el('a', { class: 'who-card add', href: '#/new' }, el('span', { class: 'me-dot big', style: '--c:var(--muted)' }, icon('plus')), el('b', {}, 'Add a learner'), el('small', {}, 'For a child or yourself')),
      ),
    );
    return;
  }
  const acct = me();
  const st = { name: acct?.type === 'student' && !all.length ? acct.name.split(' ')[0] : '', grade: acct?.type === 'student' ? 8 : 1, province: acct?.province || 'NS', teacher: 'amina', ways: ['watch'], colour: COLOURS[all.length % COLOURS.length] };
  const nameIn = el('input', { type: 'text', maxlength: 30, required: true, autocomplete: 'off', placeholder: 'First name', value: st.name, oninput: (e) => (st.name = e.target.value) });
  const gradeSel = el('div', { class: 'grade-pick', role: 'radiogroup', 'aria-label': 'Grade' },
    ...GRADES.map((g) => el('button', { type: 'button', role: 'radio', 'aria-checked': String(g.g === st.grade), class: g.g === st.grade ? 'on' : '', onclick: (e) => { st.grade = g.g; gradeSel.querySelectorAll('button').forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-checked', 'false'); }); e.currentTarget.classList.add('on'); e.currentTarget.setAttribute('aria-checked', 'true'); } }, el('b', {}, g.short), el('small', {}, g.g < 1 ? g.label : ''))));
  const provSel = el('select', { onchange: (e) => (st.province = e.target.value) }, ...PROVINCES.map((p) => el('option', { value: p.id, selected: p.id === st.province }, p.name + (p.ready ? '' : ' (Canada-wide topics for now)'))));
  const teachers = el('div', { class: 'teacher-pick' }, ...Object.values(TEACHERS).map((t) => {
    const fig = teacherFigure(t.id);
    return el('button', { type: 'button', class: `t-card ${t.id === st.teacher ? 'on' : ''}`, onclick: (e) => { st.teacher = t.id; teachers.querySelectorAll('.t-card').forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on'); say(`Hello! I am ${t.name}. I will be your teacher.`, { teacher: t.id, fig }); } }, fig, el('b', {}, t.name), el('small', {}, t.blurb));
  }));
  const ways = el('div', { class: 'ways' }, ...WAYS.map((w) => el('label', { class: 'way' }, el('input', { type: 'radio', name: 'way', value: w.id, checked: w.id === 'watch', onchange: () => (st.ways = [w.id]) }), el('span', {}, el('b', {}, w.label), el('small', {}, w.text)))));
  const colours = el('div', { class: 'colours' }, ...COLOURS.map((c) => el('button', { type: 'button', class: `colour ${c === st.colour ? 'on' : ''}`, style: `--c:${c}`, 'aria-label': 'Colour', onclick: (e) => { st.colour = c; colours.querySelectorAll('.colour').forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on'); } })));
  const err = el('p', { class: 'err', hidden: true });
  main.append(
    el('p', { class: 'kicker' }, all.length ? 'New learner' : `Welcome, ${acct?.name?.split(' ')[0] ?? ''}`),
    el('h1', { class: 'h1' }, all.length ? 'Add a learner' : acct?.type === 'student' ? 'Set up your learning' : 'Add your first learner'),
    el('p', { class: 'lede' }, acct?.type === 'student' ? 'Choose your grade and your teacher. You can change them later.' : 'Each child gets their own path, teacher and progress. Use a first name only. You can add more learners later.'),
    el('form', { class: 'setup', onsubmit: (e) => {
      e.preventDefault();
      if (!st.name.trim()) { err.hidden = false; err.textContent = 'Please enter a name.'; nameIn.focus(); return; }
      addLearner(st); go('');
    } },
      el('label', { class: 'field' }, el('span', {}, 'Name'), nameIn),
      el('fieldset', { class: 'field' }, el('legend', {}, 'Grade'), gradeSel),
      el('label', { class: 'field' }, el('span', {}, 'Province or territory (for Social Studies)'), provSel),
      el('fieldset', { class: 'field' }, el('legend', {}, 'Choose a teacher'), teachers),
      el('fieldset', { class: 'field' }, el('legend', {}, 'How do you like to learn?'), ways),
      el('fieldset', { class: 'field' }, el('legend', {}, 'Your colour'), colours),
      err,
      el('div', { class: 'row' }, el('button', { type: 'submit', class: 'btn btn-primary btn-lg' }, 'Start learning', icon('next')), all.length ? button('Cancel', () => go('who'), 'btn btn-quiet') : null),
    ),
  );
}
