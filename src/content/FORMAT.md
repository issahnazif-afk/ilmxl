# Written content format (Science, English, Social Studies)

Each subject file (`science.mjs`, `english.mjs`, `social.mjs`) default-exports an array of skills:

```js
export default [
  {
    id: 'sci-1-living',            // unique, kebab-case, prefixed sci- / ela- / ss-
    grade: 1,                      // -1 = Pre-K, 0 = Kindergarten, 1..12
    strand: 'Life Science',        // grouping within the subject
    title: 'Living and non-living things',
    province: null,                // Social Studies only: null = pan-Canadian, or 'NS', 'ON', ... for province-specific
    // The teacher's lesson: 3–6 short steps. `say` is spoken aloud (plain words, no symbols the voice would misread);
    // `board` is what is written on the chalkboard (short, may differ from say).
    lesson: [
      { say: 'Living things grow, need food and water, and make more of their own kind.', board: 'Living things: grow · need food and water · reproduce' },
    ],
    // A question the teacher asks at the end of the lesson. Same shape as an item.
    check: { q: 'Is a cat living or non-living?', choices: ['Living', 'Non-living'], a: 0 },
    // Practice items: at least 8. Two kinds:
    //  multiple choice: { q, choices: [2–4 strings], a: index of the right choice, why }
    //  typed answer:    { q, answer: 'text', accept: ['other accepted spellings'], why }   (short answers only)
    items: [
      { q: 'Which one is a living thing?', choices: ['A tree', 'A rock', 'A chair', 'A cup'], a: 0, why: 'A tree grows and needs water.' },
    ],
  },
];
```

Rules:
- Facts must be accurate and well established. No invented dates, numbers, quotations or people.
- `why` is one short sentence the teacher says after a wrong answer.
- Choices are unique within an item; exactly one is right. Avoid "all of the above".
- Spelling: Canadian (colour, centre, neighbour) in prose. Never make an item hinge on US vs Canadian spelling.
- Keep wording at the grade's reading level.
