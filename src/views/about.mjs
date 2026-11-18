// About: what IlmXL is, how it works, privacy, and where the content comes from.
import { el, icon } from '../app/ui.mjs';
import { SKILLS } from '../app/curriculum.mjs';
import { PUZZLES } from '../app/coding.mjs';
import { isDemo } from '../app/account.mjs';

export default function (main) {
  const n = (s) => SKILLS.filter((x) => x.subject === s).length;
  main.append(
    el('a', { class: 'back', href: '#/' }, icon('back'), 'Home'),
    el('p', { class: 'kicker' }, 'About'), el('h1', { class: 'h1' }, 'IlmXL'),
    el('p', { class: 'lede' }, 'Free learning from Pre-K to grade 12, with a teacher on screen who teaches, listens and corrects. By Ilm Atlantic Tech.'),
    el('section', { class: 'panel prose' },
      el('h2', { class: 'h3' }, 'What is inside'),
      el('ul', {},
        el('li', {}, el('b', {}, `Maths (${n('math')} skills). `), 'Standard North American progression, Pre-K to grade 8, then Algebra 1, Geometry, Algebra 2 and Precalculus. Every question is made by code with its worked steps, and checked automatically before each release.'),
        el('li', {}, el('b', {}, `English (${n('english')}) and Science (${n('science')}). `), 'Written question banks following the usual North American progression.'),
        el('li', {}, el('b', {}, `Social Studies (${n('social')}). `), 'Canadian: land, peoples, history and government, with Nova Scotia’s own topics first. More provinces will follow.'),
        el('li', {}, el('b', {}, `Coding (${PUZZLES.length} puzzles) and Pre-K activities. `), 'Block puzzles with sequences, loops and ifs; letters, numbers, colours, shapes and tracing with spoken prompts.')),
      el('h2', { class: 'h3' }, 'How it works'),
      el('p', {}, 'Each skill has an XL score from 0 to 100. It rises quickly at first and slowly near the top, and the last stretch needs answers right in a row. At 100 a skill is proficient; a few days later it comes back for review, and a right answer then makes it mastered.'),
      el('h2', { class: 'h3' }, 'Privacy'),
      el('p', {}, isDemo()
        ? 'Accounts are kept on this device only for now: the username, a hashed password, and each learner’s first name, grade and progress stay in this browser.'
        : 'An account keeps the username, a hashed password, and each learner’s first name, grade and progress in IlmXL’s account store (a Google Sheet run through Google Apps Script), so they work on any device. No email or surname is asked for children.'),
      el('p', {}, 'The teacher’s natural voice is made on your own device: a voice model (about 90 MB) is downloaded once from Hugging Face and kept by the browser, and nothing your child types or says is sent anywhere by it. Until it is ready, or if you choose the device voice in the menu, the browser’s own voice speaks.'),
      el('p', {}, 'Listening uses your browser’s speech recognition; in some browsers (such as Chrome) spoken answers are sent to the browser maker to be recognised. Typing always works instead.'),
      el('h2', { class: 'h3' }, 'Content'),
      el('p', {}, 'Questions are original. Written items are being reviewed by teachers; if you find a mistake, please tell us. IlmXL is not affiliated with any other learning platform.'),
    ),
  );
}
