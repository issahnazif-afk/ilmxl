// Sign in (#/signin) and create an account (#/signup): a split screen, the form on one side and a lively panel
// with the teacher on the other. Accounts are for parents and guardians (who add their children as learners),
// students aged 13 and over, and teachers.
import { el, icon } from '../app/ui.mjs';
import { register, signIn, messageFor, isDemo, strength, USERNAME_RE } from '../app/account.mjs';
import { PROVINCES } from '../app/curriculum.mjs';
import { teacherFigure } from '../app/teacher.mjs';
import { brand, themeButton, startAccount } from '../main.mjs';

const TYPES = [
  { id: 'parent', label: 'Parent', text: 'I am setting this up for my children.' },
  { id: 'student', label: 'Student 13+', text: 'I am 13 or older and learning myself.' },
  { id: 'teacher', label: 'Teacher', text: 'I am setting this up for my class.' },
];

export default function (main, { route, go }) {
  const up = route === 'signup';
  document.title = up ? 'Create your account · IlmXL' : 'Sign in · IlmXL';
  const err = el('p', { class: 'form-err', role: 'alert', hidden: true });
  const showErr = (code) => { err.hidden = false; err.replaceChildren(icon('info'), messageFor(code)); };
  const st = { type: 'parent', province: 'NS' };

  const field = (label, input, hint) => el('label', { class: 'f' }, el('span', { class: 'f-label' }, label), input, hint ? el('small', { class: 'f-hint' }, hint) : null);
  const pwInput = el('input', { type: 'password', name: 'password', autocomplete: up ? 'new-password' : 'current-password', required: true, minlength: 8, placeholder: up ? 'At least 8 characters' : 'Your password' });
  const eye = el('button', { type: 'button', class: 'eye', 'aria-label': 'Show password', onclick: () => { const show = pwInput.type === 'password'; pwInput.type = show ? 'text' : 'password'; eye.replaceChildren(icon(show ? 'eyeoff' : 'eye')); eye.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); } }, icon('eye'));
  const meter = el('div', { class: 'meter', 'aria-hidden': 'true' }, ...Array.from({ length: 4 }, () => el('i')));
  const meterText = el('small', { class: 'f-hint' }, ' ');
  if (up) pwInput.addEventListener('input', () => {
    const s = strength(pwInput.value);
    meter.dataset.s = pwInput.value ? String(s) : '';
    meterText.textContent = pwInput.value ? ['Too short', 'Weak', 'Okay', 'Good', 'Strong'][pwInput.value.length < 8 ? 0 : Math.max(1, s)] : ' ';
  });
  const userInput = el('input', { type: 'text', name: 'username', autocomplete: 'username', required: true, autocapitalize: 'none', spellcheck: 'false', placeholder: up ? 'e.g. amina.family' : 'Your username' });
  const userHint = el('small', { class: 'f-hint' }, up ? '3 to 24 letters or numbers; . _ - allowed.' : '');
  if (up) userInput.addEventListener('input', () => {
    const v = userInput.value.trim().toLowerCase();
    userHint.className = 'f-hint ' + (!v ? '' : USERNAME_RE.test(v) ? 'ok' : 'bad');
    userHint.textContent = !v ? '3 to 24 letters or numbers; . _ - allowed.' : USERNAME_RE.test(v) ? 'Looks good.' : 'Use 3 to 24 letters or numbers, with no spaces.';
  });
  const nameInput = el('input', { type: 'text', name: 'name', autocomplete: 'name', required: true, maxlength: 80, placeholder: 'Your name' });
  const honey = el('input', { type: 'text', name: 'website', tabindex: '-1', autocomplete: 'off', class: 'hp', 'aria-hidden': 'true' });

  const seg = el('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Who is this account for?' },
    el('span', { class: 'seg-thumb' }),
    ...TYPES.map((t, i) => el('button', { type: 'button', role: 'radio', 'aria-checked': String(i === 0), class: i === 0 ? 'on' : '', onclick: (e) => {
      st.type = t.id; seg.style.setProperty('--i', i);
      seg.querySelectorAll('button').forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-checked', 'false'); });
      e.currentTarget.classList.add('on'); e.currentTarget.setAttribute('aria-checked', 'true'); segText.textContent = t.text;
    } }, t.label)));
  const segText = el('small', { class: 'f-hint' }, TYPES[0].text);
  const prov = el('select', { name: 'province', onchange: (e) => (st.province = e.target.value) }, ...PROVINCES.map((p) => el('option', { value: p.id, selected: p.id === 'NS' }, p.name)));

  const submit = el('button', { type: 'submit', class: 'btn btn-primary btn-lg btn-block shimmer' }, el('span', {}, up ? 'Create account' : 'Sign in'), icon('next'));
  const busy = (on) => { submit.disabled = on; submit.classList.toggle('loading', on); };
  const form = el('form', { class: 'auth-form', novalidate: true, onsubmit: async (e) => {
    e.preventDefault(); err.hidden = true; busy(true);
    const data = { name: nameInput.value, username: userInput.value, password: pwInput.value, type: st.type, province: st.province, website: honey.value };
    const r = up ? await register(data) : await signIn(data);
    busy(false);
    if (!r.ok) { showErr(r.error); return; }
    await startAccount();
    go(up ? 'new' : '');
  } },
    up ? el('div', { class: 'f' }, el('span', { class: 'f-label' }, 'This account is for'), seg, segText) : null,
    up ? field('Your name', nameInput) : null,
    el('label', { class: 'f' }, el('span', { class: 'f-label' }, 'Username'), userInput, userHint),
    el('label', { class: 'f' }, el('span', { class: 'f-label' }, 'Password', up ? null : el('button', { type: 'button', class: 'link-btn', onclick: () => forgot.hidden = !forgot.hidden }, 'Forgot password?')),
      el('span', { class: 'pw' }, pwInput, eye), up ? meter : null, up ? meterText : null),
    up ? field('Province or territory', prov, 'For Canadian Social Studies.') : null,
    honey, err, submit,
  );
  const forgot = el('p', { class: 'note', hidden: true }, icon('key'), 'Passwords are reset by the IlmXL team: ask the person who runs IlmXL for your school or centre to set a temporary password, then sign in with it.');

  main.classList.add('auth');
  main.append(
    el('section', { class: 'auth-side' },
      el('div', { class: 'auth-top' }, brand('#/welcome'), themeButton()),
      el('div', { class: 'auth-card' },
        el('h1', { class: 'auth-h' }, up ? 'Create your free account' : 'Welcome back'),
        el('p', { class: 'muted' }, up ? 'One account for the whole family. Add each child as a learner.' : 'Sign in to carry on where you left off.'),
        isDemo() ? el('p', { class: 'note' }, icon('info'), 'Accounts are kept on this device for now. Saving to the cloud switches on soon.') : null,
        form, forgot,
        el('p', { class: 'switch' }, up ? 'Already have an account? ' : 'New to IlmXL? ', el('a', { href: up ? '#/signin' : '#/signup' }, up ? 'Sign in' : 'Create a free account')),
        up ? el('p', { class: 'fine' }, icon('shield'), 'Children don’t sign up: a parent, guardian or teacher does. We ask for no email address, show no ads and sell nothing.') : null,
      ),
    ),
    el('aside', { class: 'auth-art', 'aria-hidden': 'true' },
      el('div', { class: 'aurora' }, el('i'), el('i'), el('i')), el('div', { class: 'grid-bg' }),
      el('div', { class: 'auth-stage' },
        el('div', { class: 'auth-teacher' }, teacherFigure('amina')),
        el('div', { class: 'float f1' }, el('small', {}, 'XL score'), el('b', {}, '92'), el('span', { class: 'mini-bar' }, el('i', { style: 'width:92%' }))),
        el('div', { class: 'float f2' }, icon('gem'), el('span', {}, 'Gate opened', el('small', {}, '+5 gems'))),
        el('div', { class: 'float f3' }, el('small', {}, 'Ms. Amina'), el('span', {}, '“Great thinking! Let’s try one more.”')),
        el('div', { class: 'float f4' }, el('span', { class: 'chip-num' }, '7 × 8'), el('b', {}, '= 56'), icon('check')),
      ),
      el('blockquote', { class: 'auth-quote' }, el('p', {}, 'Maths, English, Science and Canadian Social Studies, from Pre-K to grade 12, with a teacher who listens.'), el('cite', {}, 'IlmXL · by Ilm Atlantic Tech')),
    ),
  );
  setTimeout(() => (up ? nameInput : userInput).focus({ preventScroll: true }), 60);
}
