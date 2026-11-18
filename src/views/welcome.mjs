// The landing page (#/welcome): what IlmXL is, a question to try right here, and the way in.
import { el, icon } from '../app/ui.mjs';
import { SKILLS, SKILL, SUBJECTS, makeItem } from '../app/curriculum.mjs';
import { PUZZLES } from '../app/coding.mjs';
import { question } from '../app/question.mjs';
import { teacherFigure } from '../app/teacher.mjs';
import { isDemo } from '../app/account.mjs';
import { GRADES } from '../app/curriculum.mjs';
import { TOPICS, topicsOf } from '../app/topics.mjs';
import { categories, GRADE_HUE } from './subject.mjs';

const WORDS = ['Maths', 'English', 'Science', 'Social Studies', 'Coding'];

export default function (main) {
  document.title = 'IlmXL · Learn with a teacher who listens';
  const count = (s) => SKILLS.filter((x) => x.subject === s).length;
  // every generated skill is checked over 400 questions before each build, plus every written item
  const questions = SKILLS.reduce((a, x) => a + (x.gen ? 400 : (x.items?.length ?? 0)), 0);

  // the rotating word in the headline
  const word = el('span', { class: 'rot' }, ...WORDS.map((w, i) => el('span', { class: i === 0 ? 'on' : '' }, w)));
  let wi = 0; const rot = setInterval(() => { const s = word.children; s[wi].classList.remove('on'); s[wi].classList.add('out'); const prev = wi; setTimeout(() => s[prev].classList.remove('out'), 600); wi = (wi + 1) % s.length; s[wi].classList.add('on'); }, 2400);

  // a question to try, from the real generators
  const demoSkills = ['math-3-mult', 'math-4-equivfrac', 'math-2-add100', 'math-5-order', 'math-6-percent'];
  const demoBox = el('div', { class: 'demo-q' });
  const fig = teacherFigure('amina');
  const newDemo = () => {
    const sk = SKILL[demoSkills[Math.floor(Math.random() * demoSkills.length)]];
    const q = question(makeItem(sk), { teacher: 'amina', fig, onDone: () => q.append(el('div', { class: 'row' }, el('button', { type: 'button', class: 'btn btn-sm', onclick: newDemo }, 'Another one', icon('next')), el('a', { class: 'btn btn-sm btn-primary', href: '#/signup' }, 'Keep going free'))) });
    demoBox.replaceChildren(el('p', { class: 'demo-tag' }, icon('spark'), `Try it · ${sk.title}`), q);
  };
  newDemo();

  const subjects = ['math', 'english', 'science', 'social', 'coding', 'activities'];
  const marqueeRow = (list, rev) => el('div', { class: `marquee ${rev ? 'rev' : ''}` }, el('div', { class: 'marquee-track' }, ...[...list, ...list].map((s) => el('span', { class: 'mchip', style: `--sc:${SUBJECTS[s.subject].colour}` }, el('i'), s.title))));
  const pick = (n, off) => SKILLS.filter((_, i) => (i + off) % 4 === 0).slice(0, n);

  const orbit = el('div', { class: 'orbit', 'aria-hidden': 'true' }, el('div', { class: 'ring r1' }), el('div', { class: 'ring r2' }),
    ...subjects.map((s, i) => el('span', { class: 'orb', style: `--a:${i * 60}deg;--sc:${SUBJECTS[s].colour};--ss:${SUBJECTS[s].soft}` }, icon(SUBJECTS[s].icon))));

  // the showcase: a tablet with the grade 4 maths catalogue on it, tilting from 20° to flat as it scrolls in
  const g4 = categories('math', 4).slice(0, 9);
  const tablet = el('div', { class: 'tablet' }, el('div', { class: 'tablet-screen' },
    el('div', { class: 'ts-bar' }, el('span', { class: 'ts-dots' }, el('i'), el('i'), el('i')), el('span', { class: 'ts-url' }, 'IlmXL · Grade 4 maths'), el('span', { class: 'ts-pill' }, icon('bolt'), 'Fluency Zone')),
    el('div', { class: 'ts-body' },
      el('div', { class: 'ts-rail' }, ...['K', '1', '2', '3', '4', '5', '6', '7', '8'].map((x, i) => el('span', { class: x === '4' ? 'on' : '', style: `--gh:${GRADE_HUE[i]}` }, x))),
      el('div', { class: 'ts-cols' }, ...g4.map((c) => el('div', { class: 'ts-cat' }, el('b', {}, `${c.code}. ${c.name}`), ...c.skills.slice(0, 4).map((x, k) => el('span', {}, el('i', {}, String(k + 1)), x.title, k === 0 ? el('em', {}, String(70 + ((x.title.length * 7) % 30))) : null))))),
    )));
  const showHead = el('div', { class: 'show-head' }, el('p', { class: 'eyebrow' }, 'One app, everything in it'), el('h2', { class: 'h-sec' }, 'Hundreds of skills, ', el('span', { class: 'grad' }, 'one teacher'), ' beside you'), el('p', { class: 'muted' }, 'Every grade’s skills, lettered and numbered, with your score beside each. Pick one and Ms. Amina teaches it, step by step.'));
  const showcase = el('section', { class: 'showcase' }, showHead, el('a', { class: 'tablet-wrap', href: '#/subject/math/4', 'aria-label': 'Browse grade 4 maths' }, tablet));
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const tilt = () => {
    raf = 0;
    const r = showcase.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.9)));        // 0 as it enters, 1 once well in view
    const small = innerWidth < 760;
    const [s0, s1] = small ? [0.86, 1] : [1.05, 1];
    tablet.style.transform = `rotateX(${20 * (1 - p)}deg) scale(${s0 + (s1 - s0) * p})`;
    showHead.style.transform = `translateY(${-30 * p}px)`;
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tilt); };
  if (!still) { addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); requestAnimationFrame(tilt); }

  main.append(
    // ── hero ──
    el('section', { class: 'hero' },
      el('div', { class: 'aurora' }, el('i'), el('i'), el('i')), el('div', { class: 'grid-bg' }),
      el('div', { class: 'hero-in' },
        el('div', { class: 'hero-copy' },
          el('a', { class: 'badge-pill', href: '#/signup' }, el('span', { class: 'dot' }), 'Free · Pre-K to Grade 12 · Made in Canada', icon('next')),
          el('h1', { class: 'display' }, 'Learn ', word, el('br'), 'with a teacher who ', el('span', { class: 'grad' }, 'listens'), '.'),
          el('p', { class: 'hero-sub' }, 'Lessons on a chalkboard, practice that adapts to you, a quest world, coding puzzles and Pre-K play. Your teacher speaks, listens to your answers and helps when you slip.'),
          el('div', { class: 'cta' }, el('a', { class: 'btn btn-primary btn-lg shimmer', href: '#/signup' }, 'Create a free account', icon('next')), el('a', { class: 'btn btn-outline btn-lg', href: '#/signin' }, 'Sign in')),
          el('ul', { class: 'trust' }, el('li', {}, icon('shield'), 'No ads, ever'), el('li', {}, icon('check'), 'Every maths question checked'), el('li', {}, icon('leaf'), 'Canadian Social Studies')),
        ),
        el('div', { class: 'hero-art' }, orbit,
          el('div', { class: 'demo spot' }, el('div', { class: 'demo-head' }, el('div', { class: 'demo-teacher' }, fig), el('div', {}, el('b', {}, 'Ms. Amina'), el('small', {}, 'Your teacher')), el('span', { class: 'live' }, el('i'), 'Live')), demoBox)),
      ),
    ),
    el('section', { class: 'band-marquee', 'aria-label': 'Some of the skills' }, marqueeRow(pick(24, 0), false), marqueeRow(pick(24, 2), true)),

    // ── the app itself, on a tablet that tilts up into view as you scroll ──
    showcase,

    // ── every grade, every subject ──
    el('section', { class: 'section', id: 'grades' },
      el('div', { class: 'sec-head', 'data-reveal': '' }, el('p', { class: 'eyebrow' }, 'Pre-K to Grade 12'), el('h2', { class: 'h-sec' }, 'Pick a grade, see every skill'), el('p', { class: 'muted' }, `${count('math')} maths skills across ${TOPICS.length} topics, plus English, Science and Canadian Social Studies. Open any grade to browse; practise free with an account.`)),
      el('div', { class: 'grade-cards' }, ...GRADES.filter((g) => g.g >= 0).map((g) => {
        const subs = ['math', 'english', 'science', 'social'].map((x) => [x, SKILLS.filter((k) => k.subject === x && k.grade === g.g && !k.province).length]).filter(([, n]) => n);
        const about = [...new Set(['math', 'english', 'science'].flatMap((x) => categories(x, g.g).slice(0, 2).map((c) => c.name.toLowerCase())))].slice(0, 5);
        return el('article', { class: 'grade-card spot', style: `--gh:${GRADE_HUE[g.g]}`, 'data-reveal': '' },
          el('header', {}, el('span', { class: 'gc-badge' }, g.short), el('h3', {}, g.label)),
          el('p', { class: 'gc-about' }, about.length ? `${about.join(', ').replace(/^./, (c) => c.toUpperCase())} and more.` : 'Skills for this grade.'),
          el('ul', { class: 'gc-subs' }, ...subs.map(([x, n]) => el('li', {}, el('a', { href: `#/subject/${x}/${g.g}` }, el('span', {}, SUBJECTS[x].name), el('b', {}, `${n} skills`, icon('next')))))));
      })),
    ),

    // ── maths by topic, and the Fluency Zone ──
    el('section', { class: 'section' },
      el('div', { class: 'sec-head', 'data-reveal': '' }, el('p', { class: 'eyebrow' }, 'Maths by topic'), el('h2', { class: 'h-sec' }, 'Every topic, every grade'), el('p', { class: 'muted' }, 'From counting to calculus: open a topic to see its skills from Kindergarten up.')),
      el('div', { class: 'topic-cloud', 'data-reveal': '' }, ...TOPICS.map((t) => { const n = SKILLS.filter((x) => x.subject === 'math' && topicsOf(x).includes(t.id)).length; return n ? el('a', { class: 'topic-pill', href: `#/subject/math/topic/${t.id}` }, t.name, el('small', {}, String(n))) : null; }).filter(Boolean)),
      el('a', { class: 'fz-teaser spot', href: '#/fluency', 'data-reveal': '' },
        el('span', { class: 'fz-car' }, icon('bolt')),
        el('span', { class: 'fz-copy' }, el('b', {}, 'Fluency Zone'), el('span', {}, 'One-minute sprints on addition, subtraction, multiplication and division facts. Beat your best score.')),
        el('span', { class: 'btn btn-primary' }, 'Try a sprint', icon('next')))),

    // ── features: a bento grid ──
    el('section', { class: 'section', id: 'features' },
      el('div', { class: 'sec-head', 'data-reveal': '' }, el('p', { class: 'eyebrow' }, 'Everything in one place'), el('h2', { class: 'h-sec' }, 'The best ideas in learning, together'), el('p', { class: 'muted' }, 'Mastery and lessons, a guided path for little ones, adaptive practice with a score, a game world and coding: all in one free app.')),
      el('div', { class: 'bento' },
        el('article', { class: 'tile spot t-big', 'data-reveal': '' },
          el('div', { class: 'tile-copy' }, el('span', { class: 'tile-ic' }, icon('mic')), el('h3', {}, 'A teacher who teaches, listens and corrects'), el('p', {}, 'Ms. Amina or Mr. Yusuf writes each step on the chalkboard and says it aloud, then asks you. Say your answer or type it. Read a sentence aloud and they mark every word.')),
          el('div', { class: 'mini-board' }, el('p', { class: 'mb-title' }, 'Equivalent fractions'), el('p', {}, '1. Multiply top and bottom by the same number.'), el('p', {}, '2. 1/2 = 2/4 = 3/6'), el('p', { class: 'mb-now' }, '3. Your turn: 2/3 = ?/9'))),
        el('article', { class: 'tile spot', 'data-reveal': '' }, el('span', { class: 'tile-ic' }, icon('chart')), el('h3', {}, 'An XL score that means something'), el('p', {}, 'From 0 to 100: quick at first, harder near the top. 100 means proficient; a review a few days later makes it mastered.'),
          el('div', { class: 'score-demo' }, el('div', { class: 'score-ring', html: '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="bg"/><circle cx="60" cy="60" r="50" class="fg"/></svg>' }), el('b', {}, '92'))),
        el('article', { class: 'tile spot', 'data-reveal': '' }, el('span', { class: 'tile-ic' }, icon('map')), el('h3', {}, 'A quest world'), el('p', {}, 'An island for every subject. Open gates with challenges, earn gems, and build your own camp.')),
        el('article', { class: 'tile spot', 'data-reveal': '' }, el('span', { class: 'tile-ic' }, icon('code')), el('h3', {}, `${PUZZLES.length} coding puzzles`), el('p', {}, 'Guide the robot with blocks: sequences, then loops, then loops that think with “if”.'),
          el('div', { class: 'blocks-demo' }, el('span', { class: 'b1' }, '↑ Move forward'), el('span', { class: 'b2' }, '⟳ Repeat 3 times'), el('span', { class: 'b3' }, '↻ Turn right'))),
        el('article', { class: 'tile spot', 'data-reveal': '' }, el('span', { class: 'tile-ic' }, icon('star')), el('h3', {}, 'Pre-K play'), el('p', {}, 'Letters, sounds, numbers, colours, shapes and tracing with a finger, all spoken aloud.')),
        el('article', { class: 'tile spot t-wide', 'data-reveal': '' }, el('span', { class: 'tile-ic' }, icon('family')), el('h3', {}, 'Parents see everything'), el('p', {}, 'Progress in every subject, the skills that need help, and what was done today. One account for the whole family, saved to your account so it follows you to any device.')),
      ),
    ),

    // ── subjects ──
    el('section', { class: 'section' },
      el('div', { class: 'sec-head', 'data-reveal': '' }, el('p', { class: 'eyebrow' }, 'Subjects'), el('h2', { class: 'h-sec' }, 'From first letters to precalculus')),
      el('div', { class: 'subj-grid' }, ...subjects.map((s) => {
        const S = SUBJECTS[s];
        const n = s === 'coding' ? `${PUZZLES.length} puzzles` : `${count(s)} skills`;
        return el('article', { class: 'subj spot', style: `--sc:${S.colour};--ss:${S.soft}`, 'data-reveal': '' }, el('span', { class: 'subj-ic' }, icon(S.icon)), el('h3', {}, S.name), el('p', {}, S.blurb), el('small', {}, n, s === 'math' ? ' · Pre-K to 12' : s === 'activities' ? ' · Pre-K' : s === 'coding' ? ' · K to 8' : ' · K to 12'));
      })),
    ),

    // ── numbers ──
    el('section', { class: 'stats', 'data-reveal': '' },
      ...[[SKILLS.length, 'skills'], [questions, 'questions checked each build', '+'], [14, 'grades, Pre-K to 12'], [0, 'ads, ever']].map(([n, t, plus]) => el('div', { class: 'stat-n' }, el('b', { class: 'ticker', dataset: { n } }, '0'), plus ? el('b', {}, plus) : null, el('span', {}, t)))),

    // ── how it works ──
    el('section', { class: 'section' },
      el('div', { class: 'sec-head', 'data-reveal': '' }, el('p', { class: 'eyebrow' }, 'How it works'), el('h2', { class: 'h-sec' }, 'Three steps to start')),
      el('ol', { class: 'steps' },
        ...[['user', 'Create a free account', 'A parent, guardian, teacher or a student aged 13+. No email needed.'], ['plus', 'Add your learners', 'Each child gets their grade, their teacher, and their own path.'], ['spark', 'Learn a little every day', 'Today’s plan picks the next step in each subject, with reviews when they are due.']]
          .map(([ic, h, p], i) => el('li', { class: 'step', 'data-reveal': '', style: `--d:${i * 120}ms` }, el('span', { class: 'step-n' }, String(i + 1)), el('span', { class: 'tile-ic' }, icon(ic)), el('h3', {}, h), el('p', {}, p))))),

    // ── questions ──
    el('section', { class: 'section narrow' },
      el('div', { class: 'sec-head', 'data-reveal': '' }, el('p', { class: 'eyebrow' }, 'Questions'), el('h2', { class: 'h-sec' }, 'Good to know')),
      el('div', { class: 'faq' }, ...[
        ['Is IlmXL really free?', 'Yes. No ads, no subscriptions, nothing to buy.'],
        ['Which curriculum does it follow?', 'Maths, English and Science follow the usual North American order. Social Studies is Canadian, with Nova Scotia’s own topics first and other provinces to follow.'],
        ['Whose voice is the teacher’s?', 'A natural voice made on your own device. The voice model (about 90 MB) downloads once and stays in the browser; nothing your child types or says is sent anywhere by it. On a slow connection you can keep the device’s own voice (account menu).'],
        ['How does the teacher listen?', 'Your browser’s speech recognition hears spoken answers and reading. In some browsers (such as Chrome) the audio is sent to the browser maker to be recognised. Typing always works instead.'],
        ['Do children need their own accounts?', 'No. A parent, guardian or teacher creates the account and adds each child as a learner, by first name and grade only.'],
        ['Can we use it on more than one device?', isDemo() ? 'Soon: saving to your account is being switched on. Until then, a parent can save a backup file and load it on another device.' : 'Yes. Sign in on any device and your learners and their progress come with you.'],
      ].map(([q, a]) => el('details', { class: 'qa' }, el('summary', {}, q, icon('plus')), el('p', {}, a))))),

    // ── call to action ──
    el('section', { class: 'cta-band', 'data-reveal': '' },
      el('div', { class: 'aurora' }, el('i'), el('i')),
      el('h2', { class: 'h-sec' }, 'Ready when you are'), el('p', {}, 'Create a free account in under a minute.'),
      el('div', { class: 'cta' }, el('a', { class: 'btn btn-light btn-lg shimmer', href: '#/signup' }, 'Get started', icon('next')))),
    el('footer', { class: 'foot' }, el('span', {}, '© IlmXL · Ilm Atlantic Tech'), el('a', { href: '#/subject/math' }, 'All skills'), el('a', { href: '#/fluency' }, 'Fluency Zone'), el('a', { href: '#/about' }, 'About and privacy'), el('a', { href: '#/signin' }, 'Sign in')),
  );

  // number tickers count up when seen
  const tick = (b) => { const n = Number(b.dataset.n); const t0 = performance.now(); const step = (t) => { const k = Math.min(1, (t - t0) / 1400); b.textContent = Math.round(n * (1 - (1 - k) ** 3)).toLocaleString('en-CA'); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  const obs = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { tick(e.target); obs.unobserve(e.target); } })) : null;
  main.querySelectorAll('.ticker').forEach((b) => (obs ? obs.observe(b) : (b.textContent = Number(b.dataset.n).toLocaleString('en-CA'))));
  return () => { clearInterval(rot); obs?.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
}
