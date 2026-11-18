// The teacher's natural voice. Kokoro (an open neural text-to-speech model, Apache-2.0) runs here, in the browser:
// its model (about 90 MB) is downloaded once from Hugging Face and kept in the browser's cache, and the speech is
// made on this device, so nothing a child types or says is sent anywhere by it. Until the model is ready, on a
// device that cannot run it, or when a family chooses "device voice", the browser's own voice speaks instead.
const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
export const KOKORO = { amina: 'af_heart', yusuf: 'am_michael' };

let tts = null, loading = null, state = 'off', progress = 0;   // state: off | loading | ready | failed
const listeners = new Set();
const set = (s) => { state = s; listeners.forEach((f) => { try { f(state, progress); } catch {} }); };
export const voiceState = () => state;
export const voiceProgress = () => progress;
export const onVoiceState = (f) => { listeners.add(f); return () => listeners.delete(f); };

// the family's choice: 'natural' (default) or 'device'
const PREF = 'ilmxl-voice';
export const voicePref = () => { try { return localStorage.getItem(PREF) || 'natural'; } catch { return 'natural'; } };
export function setVoicePref(v) { try { localStorage.setItem(PREF, v); } catch {} if (v === 'natural') loadNatural({ force: true }); else set(state === 'ready' ? 'ready' : 'off'); }
export const naturalOn = () => state === 'ready' && voicePref() === 'natural';
// on a metered or very slow connection the download waits until the family asks for it
const thrifty = () => { const c = globalThis.navigator?.connection; return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType ?? ''))); };
export const isThrifty = thrifty;

export function loadNatural({ force = false } = {}) {
  if (tts) return Promise.resolve(tts);
  if (loading) return loading;
  if (typeof window === 'undefined' || voicePref() !== 'natural' || (thrifty() && !force)) return Promise.resolve(null);
  progress = 0; set('loading');
  const sizes = {};
  loading = import('kokoro-js')
    .then(({ KokoroTTS }) => KokoroTTS.from_pretrained(MODEL, {
      dtype: 'q8', device: 'wasm',
      progress_callback: (e) => {
        if (e?.status !== 'progress' || !e.total) return;
        sizes[e.file] = [e.loaded, e.total];
        const all = Object.values(sizes), got = all.reduce((a, [l]) => a + l, 0), tot = all.reduce((a, [, t]) => a + t, 0);
        const p = Math.round((100 * got) / tot);
        if (p !== progress) { progress = p; set('loading'); }
      },
    }))
    .then((m) => { tts = m; progress = 100; set('ready'); return m; })
    .catch((e) => { console.warn('[voice] the natural voice could not start; using the device voice', e); loading = null; set('failed'); return null; });
  return loading;
}

// one sentence of speech as an object URL (made once, then reused). The model makes one sentence at a time:
// sentences the teacher needs now go to the front; prepared ones (prepare(), below) wait their turn.
const cache = new Map();
const waiting = [];          // [{ key, text, voice, resolve }]
let busy = false;
async function work() {
  if (busy) return; busy = true;
  while (waiting.length) {
    const job = waiting.shift();
    try { const a = await tts.generate(job.text, { voice: job.voice }); job.resolve(URL.createObjectURL(a.toBlob())); } catch { job.resolve(null); }
  }
  busy = false;
}
function request(text, teacher, urgent) {
  if (!tts) return Promise.resolve(null);
  const voice = KOKORO[teacher] ?? KOKORO.amina, key = `${voice}|${text}`;
  if (cache.has(key)) {
    if (urgent) { const i = waiting.findIndex((j) => j.key === key); if (i > 0) waiting.unshift(...waiting.splice(i, 1)); }
    return cache.get(key);
  }
  if (cache.size >= 400) { const [k, p] = cache.entries().next().value; cache.delete(k); p.then((u) => u && setTimeout(() => URL.revokeObjectURL(u), 60000)); }
  const pr = new Promise((resolve) => { const job = { key, text, voice, resolve }; if (urgent) waiting.unshift(job); else waiting.push(job); });
  cache.set(key, pr); work();
  return pr;
}
export const clip = (text, teacher) => request(text, teacher, true);
// make these lines ahead of time (a question's explanation while the learner is still thinking)
export function prepare(lines, teacher) {
  if (!tts || voicePref() !== 'natural') return;
  for (const line of lines) for (const s of sentences(line)) request(s, teacher, false);
}
// forget prepared sentences nobody needs any more (a new question replaced the old one)
export function dropPrepared() { waiting.splice(0).forEach((j) => { cache.delete(j.key); j.resolve(null); }); }

// a line in sentences: shorter pieces start sooner, and the next is made while the first is spoken
// (a full stop inside a number, 3.14, does not end a sentence)
export const sentences = (t) => String(t).split(/(?<=[.!?:])\s+(?=[A-Z0-9"'(“−-])/).map((x) => x.trim()).filter(Boolean);
