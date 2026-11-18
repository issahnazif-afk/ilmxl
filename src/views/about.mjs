// About: what IlmXL is, how it works, privacy, and where the content comes from.
import { el, icon } from '../app/ui.mjs';
import { SKILLS } from '../app/curriculum.mjs';
import { PUZZLES } from '../app/coding.mjs';

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
      el('p', {}, 'There are no accounts and no server. Learners and progress are kept in this browser only. The teacher’s voice and listening use your browser’s own speech features; on some browsers (such as Chrome) spoken answers are sent to the browser maker to be recognised. Typing always works instead.'),
      el('h2', { class: 'h3' }, 'Content'),
      el('p', {}, 'Questions are original. Written items are being reviewed by teachers; if you find a mistake, please tell us. IlmXL is not affiliated with any other learning platform.'),
    ),
  );
}
