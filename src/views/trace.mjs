// Tracing (#/trace): trace a big letter or number with a finger or mouse. The teacher says the letter, and checks
// how much of it was covered and how much went outside the lines.
import { el, icon, button, chime } from '../app/ui.mjs';
import { current, activity } from '../app/store.mjs';
import { TRACE, WORDS } from '../app/activities.mjs';
import { TEACHERS, teacherFigure, say, stopSpeaking } from '../app/teacher.mjs';

export default function (main) {
  const l = current(), T = TEACHERS[l.teacher] ?? TEACHERS.amina, fig = teacherFigure(T.id);
  let set = 'letters', idx = 0, lower = false;
  const S = 360;
  const cv = el('canvas', { width: S, height: S, class: 'trace-cv', 'aria-label': 'Tracing area' });
  const ctx = cv.getContext('2d');
  const mask = document.createElement('canvas'); mask.width = mask.height = S; const mctx = mask.getContext('2d');
  const label = el('h1', { class: 'h2' }); const msg = el('p', { class: 'code-msg', 'aria-live': 'polite' });
  let strokes = [], drawing = false;
  const glyph = () => { const g = TRACE[set][idx]; return lower && set === 'letters' ? g.toLowerCase() : g; };
  const font = `800 ${S * 0.78}px "Nunito", "Baloo 2", system-ui, sans-serif`;
  function paint() {
    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface') || '#fff'; ctx.fillRect(0, 0, S, S);
    ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(37,99,235,.13)'; ctx.fillText(glyph(), S / 2, S / 2 + 10);
    ctx.setLineDash([6, 8]); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(37,99,235,.55)'; ctx.strokeText(glyph(), S / 2, S / 2 + 10); ctx.setLineDash([]);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 22; ctx.strokeStyle = '#F28C28';
    for (const s of strokes) { ctx.beginPath(); s.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); if (s.length === 1) ctx.lineTo(s[0].x + 0.1, s[0].y); ctx.stroke(); }
    mctx.clearRect(0, 0, S, S); mctx.font = font; mctx.textAlign = 'center'; mctx.textBaseline = 'middle'; mctx.fillStyle = '#000'; mctx.fillText(glyph(), S / 2, S / 2 + 10);
  }
  const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * S / r.width, y: (e.clientY - r.top) * S / r.height }; };
  cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); drawing = true; strokes.push([pos(e)]); paint(); });
  cv.addEventListener('pointermove', (e) => { if (!drawing) return; strokes.at(-1).push(pos(e)); paint(); });
  const up = () => { drawing = false; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  function check() {
    // glyph pixels covered by the child's strokes, and stroke pixels outside the glyph (with a margin)
    const g = mctx.getImageData(0, 0, S, S).data;
    const paintCv = document.createElement('canvas'); paintCv.width = paintCv.height = S; const p = paintCv.getContext('2d');
    p.lineCap = 'round'; p.lineJoin = 'round'; p.lineWidth = 34; p.strokeStyle = '#000';
    for (const s of strokes) { p.beginPath(); s.forEach((q, i) => (i ? p.lineTo(q.x, q.y) : p.moveTo(q.x, q.y))); p.stroke(); }
    const d = p.getImageData(0, 0, S, S).data;
    const thin = document.createElement('canvas'); thin.width = thin.height = S; const t = thin.getContext('2d');
    t.lineCap = 'round'; t.lineWidth = 6; t.strokeStyle = '#000'; for (const s of strokes) { t.beginPath(); s.forEach((q, i) => (i ? t.lineTo(q.x, q.y) : t.moveTo(q.x, q.y))); t.stroke(); }
    const th = t.getImageData(0, 0, S, S).data;
    // grow the glyph a little for "outside" so tracing just beside the line is fine
    const grown = document.createElement('canvas'); grown.width = grown.height = S; const gr = grown.getContext('2d');
    gr.font = font; gr.textAlign = 'center'; gr.textBaseline = 'middle'; gr.lineWidth = 26; gr.lineJoin = 'round'; gr.strokeStyle = '#000'; gr.fillStyle = '#000'; gr.fillText(glyph(), S / 2, S / 2 + 10); gr.strokeText(glyph(), S / 2, S / 2 + 10);
    const gg = gr.getImageData(0, 0, S, S).data;
    let gl = 0, cov = 0, ink = 0, out = 0;
    for (let i = 3; i < g.length; i += 16) { if (g[i] > 128) { gl++; if (d[i] > 128) cov++; } if (th[i] > 128) { ink++; if (gg[i] < 128) out++; } }
    const c = gl ? cov / gl : 0, o = ink ? out / ink : 1;
    if (!strokes.length) { msg.textContent = 'Trace over the dotted shape with your finger.'; return; }
    if (c >= 0.6 && o <= 0.3) {
      chime(true); activity(l, 'trace', { glyph: glyph(), stars: 1 });
      msg.textContent = `Great tracing! ${Math.round(c * 100)}% covered.`;
      say(set === 'letters' ? `Great tracing! That is ${glyph().toUpperCase()}, for ${WORDS[glyph().toUpperCase()]}.` : `Great tracing! That is ${glyph()}.`, { teacher: T.id, fig });
    } else {
      chime(false);
      const tip = c < 0.6 ? 'Cover more of the shape.' : 'Try to stay inside the dotted lines.';
      msg.textContent = `${tip} (${Math.round(c * 100)}% covered)`; say(`Nice try! ${tip}`, { teacher: T.id, fig });
    }
  }
  const show = () => { strokes = []; label.textContent = `Trace: ${glyph()}`; msg.textContent = ''; paint(); say(set === 'letters' ? `Let's trace ${lower ? 'small' : 'big'} ${glyph().toUpperCase()}. ${glyph().toUpperCase()} is for ${WORDS[glyph().toUpperCase()]}.` : `Let's trace the number ${glyph()}.`, { teacher: T.id, fig }); };
  const tabs = el('div', { class: 'row' },
    button('ABC', () => { set = 'letters'; lower = false; idx = 0; show(); }, 'btn'), button('abc', () => { set = 'letters'; lower = true; idx = 0; show(); }, 'btn'), button('123', () => { set = 'numbers'; idx = 0; show(); }, 'btn'));
  main.append(
    el('a', { class: 'back', href: '#/play' }, icon('back'), 'Activities'),
    el('div', { class: 'play-head' }, el('div', { class: 'side-teacher sm' }, fig), el('div', {}, el('p', { class: 'kicker' }, 'Tracing'), label, tabs)),
    el('div', { class: 'trace' }, cv,
      el('div', { class: 'row center' },
        button([icon('back'), 'Back'], () => { idx = (idx - 1 + TRACE[set].length) % TRACE[set].length; show(); }, 'btn btn-lg'),
        button('Clear', () => { strokes = []; paint(); msg.textContent = ''; }, 'btn btn-lg'),
        button([icon('check'), 'Check'], check, 'btn btn-primary btn-lg'),
        button(['Next', icon('next')], () => { idx = (idx + 1) % TRACE[set].length; show(); }, 'btn btn-lg')),
      msg),
  );
  (document.fonts?.ready ?? Promise.resolve()).then(show);
  return () => stopSpeaking();
}
