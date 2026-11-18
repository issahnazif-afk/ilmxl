// The on-screen teacher: a drawn character who speaks (the browser's voice), listens (the browser's speech
// recognition, when it has one) and corrects. Two teachers to choose from; a learner picks one when they join.
import { el } from './ui.mjs';
import { naturalOn, loadNatural, clip, sentences } from './voice.mjs';

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
const FEMALE = /female|woman|zira|aria|jenny|samantha|karen|moira|tessa|victoria|susan|hazel|libby|sonia|clara|natasha|ava|allison|emma|michelle|ana|google us english$/i;
const MALE = /male|man|david|guy|daniel|alex|fred|george|ryan|liam|christopher|eric|mark|thomas|andrew|brian|roger|steffan|tom|evan|aaron/i;
// the best voice this device has: the neural "Natural"/"Online" voices (Edge), Google's voices (Chrome), the Enhanced
// and Premium voices (Apple), before the older robotic ones; Canadian English first, then the right teacher
function pickVoice(kind) {
  const en = voices.filter((v) => /^en[-_]/i.test(v.lang));
  if (!en.length) return voices[0] ?? null;
  const want = kind === 'male' ? MALE : FEMALE, other = kind === 'male' ? FEMALE : MALE;
  const score = (v) => (/natural|neural/i.test(v.name) ? 8 : /online/i.test(v.name) ? 6 : /premium|enhanced/i.test(v.name) ? 6 : /google/i.test(v.name) ? 4 : 0)
    + (/en[-_]CA/i.test(v.lang) ? 3 : /en[-_](US|GB)/i.test(v.lang) ? 1 : 0)
    + (want.test(v.name) && !(kind === 'male' && /female/i.test(v.name)) ? 3 : other.test(v.name) ? -4 : 0);
  return [...en].sort((a, b) => score(b) - score(a))[0];
}
export const canSpeak = () => 'speechSynthesis' in globalThis || typeof Audio !== 'undefined';
let muted = false;
export const setMuted = (m) => { muted = m; if (m) stopSpeaking(); };
export const isMuted = () => muted;

// run counts up with every new line and every stop: a line that was cut off never carries on (no two voices at once)
let run = 0, playing = null;
export function stopSpeaking() {
  run++;
  try { playing?.pause(); } catch {} playing = null;
  try { speechSynthesis.cancel(); } catch {}
  document.querySelectorAll('.teacher.talking').forEach((t) => t.classList.remove('talking'));
}

// speak a line; resolves when done (or at once when muted / no voice). `fig` is the teacher's figure to animate.
// The natural voice (voice.mjs) speaks when it is ready; otherwise the browser's voice, and the natural voice starts
// getting ready in the background.
export async function say(text, { teacher = 'amina', fig = null, rate } = {}) {
  if (muted || !text) return;
  stopSpeaking();
  const mine = run;
  if (!naturalOn()) { loadNatural(); return deviceSay(text, { teacher, fig, rate }, mine); }
  const parts = sentences(text);
  let next = clip(parts[0], teacher);
  for (let i = 0; i < parts.length; i++) {
    // a sentence not ready within 2.5 s (a slow device) is spoken by the device voice: a child never waits
    const url = await Promise.race([next, new Promise((r) => setTimeout(() => r(null), 2500))]);
    if (mine !== run) return;
    if (i + 1 < parts.length) next = clip(parts[i + 1], teacher);
    if (url) await playClip(url, fig, mine);
    // not ready in time: the device voice says the rest of the line, so the voice never swaps back and forth
    else return deviceSay(parts.slice(i).join(' '), { teacher, fig, rate }, mine);
    if (mine !== run) return;
  }
}
function playClip(url, fig, mine) {
  return new Promise((resolve) => {
    const a = new Audio(url); playing = a;
    let done = false; const end = () => { if (done) return; done = true; fig?.classList.remove('talking'); if (playing === a) playing = null; resolve(); };
    a.onplaying = () => { if (mine === run) fig?.classList.add('talking'); };
    a.onended = end; a.onerror = end; a.onpause = end;
    a.play().catch(end);
  });
}
function deviceSay(text, { teacher, fig, rate }, mine) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in globalThis) || mine !== run) return resolve();
    try {
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(TEACHERS[teacher]?.voice); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-CA';
      u.rate = rate ?? 0.95; u.pitch = TEACHERS[teacher]?.voice === 'male' ? 0.95 : 1.08;
      let done = false; const end = () => { if (done) return; done = true; fig?.classList.remove('talking'); resolve(); };
      u.onstart = () => { if (mine === run) fig?.classList.add('talking'); };
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
