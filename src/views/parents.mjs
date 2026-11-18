// Parents (#/parents): behind a times-table question. For each learner: progress by subject, the skills that need
// help, recent activity, and settings (grade, province, teacher). Backup and restore for the whole family.
import { el, icon, button, ring } from '../app/ui.mjs';
import { learners, parentGate, updateLearner, removeLearner, exportAll, importAll, skillOf, streakDays, LEVELS } from '../app/store.mjs';
import { SKILL, SUBJECTS, GRADES, PROVINCES, gradeLabel } from '../app/curriculum.mjs';
import { subjectsFor, summary, pathFor } from '../app/path.mjs';
import { TEACHERS } from '../app/teacher.mjs';
import { me, isDemo, signOut, changePassword, messageFor } from '../app/account.mjs';

let unlocked = false;
export default function (main, { go }) {
  if (!unlocked) {
    const g = parentGate();
    const inp = el('input', { type: 'text', inputmode: 'numeric', 'aria-label': 'Answer', autocomplete: 'off' });
    const err = el('p', { class: 'err', hidden: true }, 'Not quite. Try again.');
    main.append(el('div', { class: 'gate-box' }, el('span', { class: 'subject-ic big' }, icon('family')), el('h1', { class: 'h2' }, 'For parents'), el('p', { class: 'lede' }, `To continue, answer: ${g.q}`),
      el('form', { class: 'q-input', onsubmit: (e) => { e.preventDefault(); if (Number(inp.value) === g.a) { unlocked = true; main.replaceChildren(); render(main, go); } else { err.hidden = false; inp.select(); } } }, inp, el('button', { class: 'btn btn-primary', type: 'submit' }, 'Continue')), err));
    setTimeout(() => inp.focus(), 50);
    return;
  }
  render(main, go);
}

function render(main, go) {
  const all = learners();
  main.append(el('p', { class: 'kicker' }, 'Parents'), el('h1', { class: 'h1' }, 'How your learners are doing'),
    el('p', { class: 'lede' }, isDemo() ? 'Your account and learners are kept on this device for now. Save a backup to move them to another device.' : 'Progress is saved to your account, so it follows you to any device.'),
    accountPanel());
  if (!all.length) main.append(el('p', {}, 'No learners yet. ', el('a', { href: '#/new' }, 'Add one')));
  for (const l of all) main.append(card(l, () => { main.replaceChildren(); render(main, go); }));
  // backup
  const file = el('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { importAll(await f.text()); main.replaceChildren(); render(main, go); } catch (err) { alert(err.message); }
  } });
  main.append(el('section', { class: 'panel' }, el('h2', { class: 'h3' }, 'Backup'),
    el('p', { class: 'small' }, 'A backup file holds every learner and all their progress.'),
    el('div', { class: 'row' },
      button('Save a backup', () => { const a = el('a', { href: URL.createObjectURL(new Blob([exportAll()], { type: 'application/json' })), download: `ilmxl-backup-${new Date().toISOString().slice(0, 10)}.json` }); a.click(); }, 'btn btn-primary'),
      button('Load a backup', () => file.click(), 'btn'), file),
    el('p', { class: 'small' }, 'Loading a backup replaces what is on this device.')),
    el('a', { class: 'btn', href: '#/new' }, icon('plus'), 'Add a learner'));
}

function card(l, refresh) {
  const subs = subjectsFor(l);
  const log = l.progress.log;
  const week = log.filter((e) => e.at > Date.now() - 7 * 864e5 && e.right != null);
  const accuracy = week.length ? Math.round(100 * week.filter((e) => e.right).length / week.length) : null;
  // skills that need help: tried a lot, still low
  const help = Object.entries(l.progress.skills).filter(([id, s]) => SKILL[id] && s.tries >= 6 && s.score < 50).sort((a, b) => a[1].score - b[1].score).slice(0, 6);
  const recent = [...log].reverse().filter((e) => e.skill || e.puzzle).slice(0, 8);
  const sel = (opts, value, on) => el('select', { onchange: (e) => on(e.target.value) }, ...opts.map(([v, t]) => el('option', { value: v, selected: String(v) === String(value) }, t)));
  return el('section', { class: 'panel learner-card' },
    el('header', { class: 'row between' }, el('div', { class: 'row' }, el('span', { class: 'me-dot big', style: `--c:${l.colour}` }, l.name[0]?.toUpperCase()), el('div', {}, el('h2', { class: 'h3' }, l.name), el('small', {}, `${gradeLabel(l.grade)} · ${TEACHERS[l.teacher]?.name ?? ''} · ${PROVINCES.find((p) => p.id === l.province)?.name ?? ''}`))),
      el('div', { class: 'row' }, el('span', { class: 'chip' }, icon('flame'), `${streakDays(l)} day${streakDays(l) === 1 ? '' : 's'}`), el('span', { class: 'chip' }, icon('star'), String(l.progress.stars)), accuracy != null ? el('span', { class: 'chip' }, icon('check'), `${accuracy}% right this week (${week.length})`) : null)),
    el('div', { class: 'par-subjects' }, ...subs.map((id) => {
      const s = summary(l, id), sub = SUBJECTS[id];
      return el('div', { class: 'par-sub', style: `--sc:${sub.colour};--ss:${sub.soft}` }, el('b', {}, sub.name), el('span', { class: 'bar' }, el('i', { style: `width:${s.total ? 100 * s.proficient / s.total : 0}%` }), el('em', { style: `width:${s.total ? 100 * (s.familiar - s.proficient) / s.total : 0}%` })),
        el('small', {}, `${s.mastered} mastered · ${s.proficient} proficient · ${s.started} started · ${s.total} on the path`),
        el('details', {}, el('summary', {}, 'Skills'), el('ul', { class: 'par-skills' }, ...pathFor(l, id).map((sid) => { const p = skillOf(l, sid); return el('li', {}, ring(p.level, 22), el('span', {}, SKILL[sid].title), el('small', {}, p.tries ? `${p.score} · ${p.right}/${p.tries}` : LEVELS[0])); }))));
    }), l.grade >= 0 ? el('div', { class: 'par-sub', style: `--sc:${SUBJECTS.coding.colour}` }, el('b', {}, 'Coding'), el('small', {}, `${Object.keys(l.progress.code).length} of 15 puzzles solved`)) : null),
    help.length ? el('div', {}, el('h3', { class: 'h4' }, 'Needs some help'), el('ul', { class: 'help' }, ...help.map(([id, s]) => el('li', {}, el('b', {}, SKILL[id].title), ` (${SUBJECTS[SKILL[id].subject].name}): score ${s.score} after ${s.tries} tries. A lesson with the teacher may help.`)))) : null,
    recent.length ? el('div', {}, el('h3', { class: 'h4' }, 'Recently'), el('ul', { class: 'recent' }, ...recent.map((e) => el('li', {}, el('small', {}, new Date(e.at).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })), ' ', e.puzzle ? `Coding puzzle ${e.puzzle}: ${'★'.repeat(e.stars)}` : `${SKILL[e.skill]?.title ?? e.skill} · ${e.kind}${e.right != null ? (e.right ? ' ✓' : ' ✗') : ''}`)))) : null,
    el('details', { class: 'settings' }, el('summary', {}, 'Settings'),
      el('div', { class: 'set-grid' },
        el('label', {}, 'Grade', sel(GRADES.map((g) => [g.g, g.label]), l.grade, (v) => { updateLearner(l.id, (x) => (x.grade = Number(v))); refresh(); })),
        el('label', {}, 'Province', sel(PROVINCES.map((p) => [p.id, p.name]), l.province, (v) => { updateLearner(l.id, (x) => (x.province = v)); refresh(); })),
        el('label', {}, 'Teacher', sel(Object.values(TEACHERS).map((t) => [t.id, t.name]), l.teacher, (v) => { updateLearner(l.id, (x) => (x.teacher = v)); refresh(); })),
      ),
      button([icon('trash'), `Remove ${l.name}`], () => { if (confirm(`Remove ${l.name} and all their progress from this device?`)) { removeLearner(l.id); refresh(); } }, 'btn btn-quiet danger')),
  );
}

function accountPanel() {
  const a = me(); if (!a) return null;
  const TYPE = { parent: 'Parent or guardian', student: 'Student (13+)', teacher: 'Teacher' };
  const old = el('input', { type: 'password', autocomplete: 'current-password', placeholder: 'Current password' });
  const pw = el('input', { type: 'password', autocomplete: 'new-password', minlength: 8, placeholder: 'New password (8+ characters)' });
  const msg = el('p', { class: 'small', 'aria-live': 'polite' });
  const form = el('form', { class: 'set-grid', hidden: true, onsubmit: async (e) => {
    e.preventDefault(); msg.textContent = 'Saving…';
    const r = await changePassword(old.value, pw.value);
    msg.textContent = r.ok ? 'Password changed.' : messageFor(r.error);
    if (r.ok) { old.value = ''; pw.value = ''; }
  } }, el('label', {}, 'Current password', old), el('label', {}, 'New password', pw), el('div', { class: 'row' }, el('button', { type: 'submit', class: 'btn btn-primary' }, 'Change password')));
  return el('section', { class: 'panel' },
    el('div', { class: 'acct' }, el('span', { class: 'acct-av' }, a.name[0]?.toUpperCase()), el('div', {}, el('h2', { class: 'h3' }, a.name), el('small', {}, `@${a.username} · ${TYPE[a.type] ?? ''}${isDemo() ? ' · on this device' : ''}`)),
      el('div', { class: 'row', style: 'margin:0' }, button([icon('key'), 'Password'], () => (form.hidden = !form.hidden), 'btn btn-sm'), button([icon('logout'), 'Sign out'], () => { signOut(); location.hash = '#/welcome'; location.reload(); }, 'btn btn-sm'))),
    form, msg);
}
