// The on-screen teacher: a drawn character who speaks (the browser's voice), listens (the browser's speech
// recognition, when it has one) and corrects. Two teachers to choose from; a learner picks one when they join.
import { el } from './ui.mjs';

export const TEACHERS = {
  amina: { id: 'amina', name: 'Ms. Amina', voice: 'female', blurb: 'Patient and cheerful. Loves stories and science.' },
  yusuf: { id: 'yusuf', name: 'Mr. Yusuf', voice: 'male', blurb: 'Calm and clear. Loves numbers and puzzles.' },
};

// our own drawings: a head-and-shoulders teacher with a mouth that moves while speaking
const FACE = {
  amina: `<svg viewBox="0 0 160 170" class="t-svg">
    <path d="M18 170c4-34 28-52 62-52s58 18 62 52z" fill="#2B7A78"/>
    <path d="M30 78c0-36 22-58 50-58s50 22 50 58c0 22-6 40-14 52H44c-8-12-14-30-14-52z" fill="#6D3F8F"/>
    <ellipse cx="80" cy="80" rx="34" ry="40" fill="#C98E64"/>
    <path d="M44 66c4-24 18-34 36-34s32 10 36 34c-10-10-22-14-36-14s-26 4-36 14z" fill="#6D3F8F"/>
    <g class="t-eyes"><ellipse cx="66" cy="80" rx="4" ry="5" fill="#2A1A10"/><ellipse cx="94" cy="80" rx="4" ry="5" fill="#2A1A10"/></g>
    <path d="M59 70q7-4 14 0M87 70q7-4 14 0" stroke="#3B2416" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="58" cy="96" r="6" fill="#E0796A" opacity=".35"/><circle cx="102" cy="96" r="6" fill="#E0796A" opacity=".35"/>
    <g class="t-mouth"><path class="m-closed" d="M70 101q10 8 20 0" stroke="#8A2F2A" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse class="m-open" cx="80" cy="103" rx="8" ry="6" fill="#8A2F2A"/></g>
  </svg>`,
  yusuf: `<svg viewBox="0 0 160 170" class="t-svg">
    <path d="M18 170c4-34 28-52 62-52s58 18 62 52z" fill="#1F4E8C"/>
    <path d="M66 118h28l-14 22z" fill="#F2F2F2"/>
    <ellipse cx="80" cy="78" rx="34" ry="40" fill="#B9825A"/>
    <path d="M46 70c0-26 14-40 34-40s34 14 34 40c-6-12-18-18-34-18s-28 6-34 18z" fill="#2A1C14"/>
    <path d="M48 88c2 20 14 34 32 34s30-14 32-34c-4 8-10 12-16 12H64c-6 0-12-4-16-12z" fill="#2A1C14"/>
    <g fill="none" stroke="#1B1B1B" stroke-width="2.2"><circle cx="66" cy="78" r="9"/><circle cx="94" cy="78" r="9"/><path d="M75 78h10"/></g>
    <g class="t-eyes"><circle cx="66" cy="78" r="3.5" fill="#1B1208"/><circle cx="94" cy="78" r="3.5" fill="#1B1208"/></g>
    <g class="t-mouth"><path class="m-closed" d="M71 102q9 6 18 0" stroke="#5A1F1A" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse class="m-open" cx="80" cy="104" rx="7" ry="5.5" fill="#5A1F1A"/></g>
  </svg>`,
};
export function teacherFigure(id) { return el('div', { class: `teacher t-${id}`, html: FACE[id] ?? FACE.amina }); }

// ── speaking ──
let voices = [];
const loadVoices = () => { try { voices = speechSynthesis.getVoices(); } catch {} };
try { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; } catch {}
const FEMALE = /female|woman|zira|aria|jenny|samantha|karen|moira|tessa|victoria|susan|hazel|libby|sonia|clara|natasha|google us english$/i;
const MALE = /male|man|david|guy|daniel|alex|fred|george|ryan|liam|christopher|eric|mark|thomas/i;
function pickVoice(kind) {
  const en = voices.filter((v) => /^en[-_](CA|US|GB|AU)/i.test(v.lang));
  const pool = en.length ? en : voices;
  const want = kind === 'male' ? MALE : FEMALE, not = kind === 'male' ? FEMALE : MALE;
  return pool.find((v) => /en[-_]CA/i.test(v.lang) && want.test(v.name) && !(kind === 'male' && /female/i.test(v.name)))
    ?? pool.find((v) => want.test(v.name) && !(kind === 'male' && /female/i.test(v.name)) && !not.test(v.name.replace(want, '')))
    ?? pool[0] ?? null;
}
export const canSpeak = () => 'speechSynthesis' in globalThis;
let muted = false;
export const setMuted = (m) => { muted = m; if (m) stopSpeaking(); };
export const isMuted = () => muted;
export function stopSpeaking() { try { speechSynthesis.cancel(); } catch {} document.querySelectorAll('.teacher.talking').forEach((t) => t.classList.remove('talking')); }

// speak a line; resolves when done (or at once when muted / no voice). `fig` is the teacher's figure to animate.
export function say(text, { teacher = 'amina', fig = null, rate } = {}) {
  return new Promise((resolve) => {
    if (muted || !canSpeak() || !text) return resolve();
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(TEACHERS[teacher]?.voice); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-CA';
      u.rate = rate ?? 0.95; u.pitch = TEACHERS[teacher]?.voice === 'male' ? 0.95 : 1.08;
      let done = false; const end = () => { if (done) return; done = true; fig?.classList.remove('talking'); resolve(); };
      u.onstart = () => fig?.classList.add('talking');
      u.onend = end; u.onerror = end;
      // some browsers never fire onend: give up after a generous time
      setTimeout(end, 1500 + text.length * 110);
      speechSynthesis.speak(u);
    } catch { resolve(); }
  });
}

// ── listening ──
const SR = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
export const canListen = () => !!SR;
// listen once; resolves with the alternatives heard ([] if nothing). `onLevel` gets 'listening' / 'done'.
export function listen({ lang = 'en-CA', timeout = 8000, onState } = {}) {
  return new Promise((resolve) => {
    if (!SR) return resolve([]);
    let rec; try { rec = new SR(); } catch { return resolve([]); }
    rec.lang = lang; rec.interimResults = false; rec.maxAlternatives = 5; rec.continuous = false;
    let out = [], finished = false;
    const finish = () => { if (finished) return; finished = true; onState?.('done'); try { rec.stop(); } catch {} resolve(out); };
    rec.onresult = (e) => { out = [...e.results[0]].map((a) => a.transcript.trim()); finish(); };
    rec.onerror = finish; rec.onend = finish;
    try { stopSpeaking(); rec.start(); onState?.('listening'); } catch { finish(); }
    setTimeout(finish, timeout);
  });
}

// words a teacher says
const PRAISE = ['Well done!', 'Excellent!', 'That is right!', 'Great thinking!', 'Yes, exactly!', 'You got it!', 'Super work!'];
const RETRY = ['Not quite. Let us look again.', 'Close! Let us work through it.', 'Good try. Here is how to think about it.'];
export const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];
export const retry = () => RETRY[Math.floor(Math.random() * RETRY.length)];
