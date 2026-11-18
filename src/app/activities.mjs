// Pre-K activities: letters, numbers, colours and shapes, all with a spoken prompt (tracing has its own view).
// Each is a skill with a generator, so it shares mastery, the score and the parents' view with everything else.
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const WORD = { A: 'apple', B: 'ball', C: 'cat', D: 'dog', E: 'egg', F: 'fish', G: 'goat', H: 'hat', I: 'igloo', J: 'jam', K: 'kite', L: 'leaf', M: 'moon', N: 'nest', O: 'octopus', P: 'pig', Q: 'queen', R: 'rain', S: 'sun', T: 'tree', U: 'umbrella', V: 'van', W: 'water', X: 'fox', Y: 'yo-yo', Z: 'zebra' };
export const COLOURS = { red: '#E0442E', blue: '#2F6FDB', yellow: '#F4C430', green: '#3E9C47', orange: '#F28C28', purple: '#8A4FC2', pink: '#F27AB0', brown: '#8B5A2B', black: '#222222', white: '#FFFFFF' };
const SHAPES = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'oval', 'diamond'];

const pickN = (r, list, n, must) => r.shuffle([must, ...r.shuffle(list.filter((x) => x !== must)).slice(0, n - 1)]);
const mc = (choices, right, extra) => ({ kind: 'mc', choices: choices.map(String), a: choices.indexOf(right), ...extra });

export const ACTIVITIES = [
  { id: 'act-letters', subject: 'activities', grade: -1, strand: 'Letters', title: 'Find the letter', icon: 'abc',
    lesson: ['Every letter has a name and a sound.', 'A says "a" as in apple. B says "b" as in ball.'],
    gen: (r) => { const L = r.pick(LETTERS); const ch = pickN(r, LETTERS, 3, L); return mc(ch, L, { q: `Find the letter ${L}.`, say: `Find the letter ${L}. ${L}, as in ${WORD[L]}.`, big: true, steps: [`${L} is for ${WORD[L]}.`] }); } },
  { id: 'act-lower', subject: 'activities', grade: -1, strand: 'Letters', title: 'Big and small letters', icon: 'abc',
    lesson: ['Each letter has a big (capital) shape and a small shape.', 'Big A and small a are the same letter.'],
    gen: (r) => { const L = r.pick(LETTERS); const ch = pickN(r, LETTERS, 3, L).map((x) => x.toLowerCase()); return mc(ch, L.toLowerCase(), { q: `Which small letter goes with ${L}?`, say: `Which small letter goes with big ${L}?`, big: true, steps: [`Big ${L} and small ${L.toLowerCase()}.`] }); } },
  { id: 'act-sounds', subject: 'activities', grade: -1, strand: 'Letters', title: 'First sounds', icon: 'abc',
    lesson: ['Words start with a sound.', 'Sun starts with the S sound: sss.'],
    gen: (r) => { const L = r.pick(LETTERS.filter((x) => !'XQ'.includes(x))); const ch = pickN(r, LETTERS.filter((x) => !'XQ'.includes(x)), 3, L); return mc(ch, L, { q: `${WORD[L][0].toUpperCase() + WORD[L].slice(1)} starts with which letter?`, say: `${WORD[L]}. Which letter does ${WORD[L]} start with?`, big: true, steps: [`${WORD[L]} starts with ${L}.`] }); } },
  { id: 'act-numbers', subject: 'activities', grade: -1, strand: 'Numbers', title: 'Find the number', icon: 'num',
    lesson: ['Numbers tell us how many.', 'Let us find the numbers from 1 to 10.'],
    gen: (r) => { const n = r.int(1, 10); const ch = pickN(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, n); return mc(ch, n, { q: `Find the number ${n}.`, say: `Find the number ${n}.`, big: true, steps: [`This is ${n}.`] }); } },
  { id: 'act-count', subject: 'activities', grade: -1, strand: 'Numbers', title: 'Count and tap', icon: 'num',
    lesson: ['Touch each one and count out loud.', 'The last number you say is how many.'],
    gen: (r) => { const n = r.int(1, 8); const o = r.pick(['apple', 'star', 'ball', 'fish', 'heart']); const ch = pickN(r, [1, 2, 3, 4, 5, 6, 7, 8], 3, n); return mc(ch, n, { q: 'How many?', say: `How many do you see? Count them.`, big: true, visual: { type: 'objects', n, obj: o }, steps: [`There are ${n}.`] }); } },
  { id: 'act-colours', subject: 'activities', grade: -1, strand: 'Colours', title: 'Colours', icon: 'paint',
    lesson: ['Colours are all around us.', 'The sky is blue. Grass is green. A banana is yellow.'],
    gen: (r) => { const names = Object.keys(COLOURS); const c = r.pick(names); const ch = pickN(r, names, 3, c); return mc(ch, c, { q: `Tap ${c}.`, say: `Can you find ${c}?`, swatches: true, steps: [`This is ${c}.`] }); } },
  { id: 'act-shapes', subject: 'activities', grade: -1, strand: 'Shapes', title: 'Shapes', icon: 'shape',
    lesson: ['A circle is round. A triangle has three sides.', 'A square has four sides that are all the same.'],
    gen: (r) => { const s = r.pick(SHAPES); const ch = pickN(r, SHAPES, 3, s); return mc(ch, s, { q: `Tap the ${s}.`, say: `Can you find the ${s}?`, shapeChoices: true, steps: [`This is a ${s}.`] }); } },
];
export const TRACE = { letters: LETTERS, numbers: '0123456789'.split('') };
export const WORDS = WORD;
