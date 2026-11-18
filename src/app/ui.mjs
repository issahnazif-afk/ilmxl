// Small DOM helpers, the icon set (our own line drawings), the question pictures, and feedback sounds.
export function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;            // only our own templates and drawings
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(e.dataset, v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k instanceof Node ? k : document.createTextNode(String(k)));
  return e;
}
export const button = (label, on, cls = 'btn') => el('button', { type: 'button', class: cls, onclick: on }, label);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ── icons: 24×24, stroke = currentColor ──
const P = {
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V20h12V9.5M10 20v-5.5h4V20"/>',
  map: '<path d="M3 6.5 8.5 4l7 2.5L21 4v13.5L15.5 20l-7-2.5L3 20z"/><path d="M8.5 4v13.5M15.5 6.5V20"/>',
  family: '<circle cx="8" cy="7" r="2.6"/><circle cx="16.5" cy="8.5" r="2.1"/><path d="M3.5 19.5c0-3.4 2-5.6 4.5-5.6s4.5 2.2 4.5 5.6M13 19.5c.2-2.6 1.6-4.3 3.5-4.3s3.3 1.7 3.5 4.3"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
  gem: '<path d="M6 4h12l3.5 5L12 20.5 2.5 9z"/><path d="M2.5 9h19M9 4 7.5 9 12 20.5 16.5 9 15 4"/>',
  flame: '<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.6 3-5.4 3.6-9.4 2.4 1.6 3.4 3.6 3.4 5.4 1-.6 1.6-1.8 1.8-3 1.9 1.6 3.2 4 3.2 7 0 3.2-2.4 5.6-6 5.6z"/>',
  math: '<path d="M5 7h5M7.5 4.5v5M14 7h5M5.5 15.5l4 4M9.5 15.5l-4 4M14 16h5M14 19h5"/>',
  book: '<path d="M4 5.5C6.5 4 9.5 4 12 5.5v14c-2.5-1.5-5.5-1.5-8 0zM20 5.5C17.5 4 14.5 4 12 5.5v14c2.5-1.5 5.5-1.5 8 0z"/>',
  flask: '<path d="M9.5 3.5h5M10.5 3.5v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4A1.5 1.5 0 0 0 19 19l-5.5-9.5v-6"/><path d="M7.5 15h9"/>',
  leaf: '<path d="M12 21v-4M12 17l-6.5 1 1.5-2.5L3 12l2-.8L4 7l3.5 1.4L8.5 5l2 2.5L12 3l1.5 4.5 2-2.5 1 3.4L20 7l-1 4.2 2 .8-4 3.5 1.5 2.5z"/>',
  code: '<path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>',
  board: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20l4-4 4 4M7 8h6M7 11h9"/>',
  practise: '<path d="M4 12a8 8 0 1 0 8-8"/><path d="M12 4V1.5M12 4l2.2-2"/><path d="M8.5 12.5l2.3 2.3 4.7-5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  back: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  next: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
  hint: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  gate: '<path d="M4 20V10a8 8 0 0 1 16 0v10"/><path d="M8 20v-9a4 4 0 0 1 8 0v9M2.5 20h19"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  pencil: '<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z"/><path d="M14 7l3.5 3.5"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  shop: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5c0 1.6 1.3 2.5 2.7 2.5S9.3 11 9.3 9.5c0 1.5 1.2 2.5 2.7 2.5s2.7-1 2.7-2.5c0 1.5 1.2 2.5 2.6 2.5S20 11 20 9.5M5.5 12v8h13v-8"/>',
  abc: '<path d="M3.5 17l3-9 3 9M4.5 14h4M12 8h3a2 2 0 0 1 0 4h-3zM12 12h3.5a2.5 2.5 0 0 1 0 5H12zM12 8v9"/>',
  num: '<path d="M6 8l2-1.5V17M11.5 9a2.2 2.2 0 1 1 3.6 1.7L11.5 17h4.5"/>',
  paint: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 1.4-2.2-.7-1.3.2-2.8 1.7-2.8H17a3.5 3.5 0 0 0 3.5-3.5c0-4.7-3.8-8.5-8.5-8.5z"/><circle cx="7.8" cy="11" r="1.1"/><circle cx="10.5" cy="7.5" r="1.1"/><circle cx="15" cy="7.8" r="1.1"/>',
  shape: '<circle cx="7" cy="7" r="3.5"/><rect x="13" y="3.5" width="7" height="7" rx=".5"/><path d="M12 13.5 16.5 20.5h-9z"/>',
  trace: '<path d="M4 18c3-9 6-13 8-13s2.5 5 4 9 3 4 4 1"/><path d="M4 21h16" stroke-dasharray="2 2"/>',
};
export const icon = (name, cls = '') => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', `ic ${cls}`.trim());
  s.innerHTML = P[name] ?? '';
  return s;
};

// the mastery ring: four segments (tried, familiar, proficient, mastered)
export function ring(level, size = 40) {
  const r = 15, c = 2 * Math.PI * r, seg = c / 4, gap = 2.5;
  const arcs = [0, 1, 2, 3].map((i) => `<circle r="${r}" cx="20" cy="20" class="seg${i < level ? ' on' : ''} l${i + 1}" stroke-dasharray="${seg - gap} ${c - seg + gap}" stroke-dashoffset="${-i * seg}" transform="rotate(-90 20 20)"/>`).join('');
  return el('span', { class: `ring lv${level}`, style: `--s:${size}px`, title: ['Not started', 'Tried', 'Familiar', 'Proficient', 'Mastered'][level], html: `<svg viewBox="0 0 40 40">${arcs}${level === 4 ? '<path class="tick" d="m14 20.5 4 4 8-8.5"/>' : ''}</svg>` });
}

// ── pictures for questions (all our own SVG) ──
const OBJ_SVG = {
  apple: '<circle cx="0" cy="2" r="9" fill="#E0442E"/><path d="M0-7c0-3 1-5 3-6" stroke="#6B3E1F" stroke-width="2" fill="none"/><ellipse cx="4" cy="-9" rx="4" ry="2" fill="#3E9C47"/>',
  star: '<path d="m0-11 3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L0 5.5l-6.5 3.4 1.3-7.2-5.3-5.1 7.3-1z" fill="#F4C430" stroke="#C99A0E" stroke-width="1"/>',
  ball: '<circle r="10" fill="#2F6FDB"/><path d="M-10 0h20M0-10c4 4 4 16 0 20M0-10c-4 4-4 16 0 20" stroke="#fff" stroke-width="1.5" fill="none"/>',
  fish: '<ellipse cx="-2" cy="0" rx="9" ry="6" fill="#F28C28"/><path d="M6 0l6-6v12z" fill="#F28C28"/><circle cx="-6" cy="-1.5" r="1.4" fill="#222"/>',
  leaf: '<path d="M-9 8C-9-4 0-10 10-10 10 0 4 9-9 8z" fill="#3E9C47"/><path d="M-9 8 6-6" stroke="#2A6B30" stroke-width="1.4"/>',
  heart: '<path d="M0 9-9 0a5 5 0 0 1 9-6 5 5 0 0 1 9 6z" fill="#F27AB0"/>',
};
const objs = (n, obj, ox = 0, colour) => Array.from({ length: n }, (_, i) => `<g transform="translate(${ox + 16 + (i % 5) * 26} ${16 + Math.floor(i / 5) * 26})">${colour ? `<circle r="10" fill="${colour}"/>` : OBJ_SVG[obj] ?? OBJ_SVG.star}</g>`).join('');
export const SHAPE_SVG = {
  circle: '<circle cx="50" cy="50" r="38"/>', square: '<rect x="14" y="14" width="72" height="72"/>', triangle: '<path d="M50 10 90 86H10z"/>',
  rectangle: '<rect x="6" y="26" width="88" height="48"/>', oval: '<ellipse cx="50" cy="50" rx="42" ry="28"/>', diamond: '<path d="M50 6 88 50 50 94 12 50z"/>',
  star: '<path d="m50 6 12.5 27 29.5 4-21.5 20.5 5.5 29L50 72.5 24 86.5l5.5-29L8 37l29.5-4z"/>', heart: '<path d="M50 88 12 50a20 20 0 0 1 38-24 20 20 0 0 1 38 24z"/>',
};
export function visual(v) {
  if (!v) return null;
  let svg = '';
  if (v.type === 'objects') svg = `<svg viewBox="0 0 ${Math.min(v.n, 5) * 26 + 6} ${Math.ceil(v.n / 5) * 26 + 6}">${objs(v.n, v.obj)}</svg>`;
  else if (v.type === 'groups') {
    const w = (n) => Math.max(1, Math.min(n, 5)) * 26 + 6, h = Math.max(...v.groups.map((n) => Math.ceil(Math.max(n, 1) / 5))) * 26 + 6;
    const [a, b] = v.groups, gap = 40;
    svg = `<svg viewBox="0 0 ${w(a) + gap + w(b)} ${h}"><rect x="1" y="1" width="${w(a) - 2}" height="${h - 2}" rx="8" fill="none" stroke="#E0442E" stroke-width="2"/>${objs(a, v.obj)}<text x="${w(a) + gap / 2}" y="${h / 2 + 7}" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor">${v.plus ? '+' : ''}</text><rect x="${w(a) + gap + 1}" y="1" width="${w(b) - 2}" height="${h - 2}" rx="8" fill="none" stroke="#2F6FDB" stroke-width="2"/>${objs(b, v.obj, w(a) + gap)}</svg>`;
  } else if (v.type === 'takeaway') svg = `<svg viewBox="0 0 ${Math.min(v.n, 5) * 26 + 6} ${Math.ceil(v.n / 5) * 26 + 6}">${Array.from({ length: v.n }, (_, i) => `<g transform="translate(${16 + (i % 5) * 26} ${16 + Math.floor(i / 5) * 26})"><circle r="10" fill="${i >= v.n - v.gone ? 'none' : '#2F6FDB'}" stroke="#2F6FDB" stroke-width="2"/>${i >= v.n - v.gone ? '<path d="M-8 8 8-8" stroke="#E0442E" stroke-width="3"/>' : ''}</g>`).join('')}</svg>`;
  else if (v.type === 'tenframes') {
    const frame = (k, ox) => `<rect x="${ox}" y="2" width="130" height="52" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>${Array.from({ length: 10 }, (_, i) => `<rect x="${ox + (i % 5) * 26}" y="${2 + Math.floor(i / 5) * 26}" width="26" height="26" fill="none" stroke="currentColor" stroke-opacity=".4"/>${i < k ? `<circle cx="${ox + 13 + (i % 5) * 26}" cy="${15 + Math.floor(i / 5) * 26}" r="9" fill="#E0442E"/>` : ''}`).join('')}`;
    svg = `<svg viewBox="0 0 280 56">${frame(Math.min(v.n, 10), 2)}${frame(Math.max(0, v.n - 10), 146)}</svg>`;
  } else if (v.type === 'blocks') svg = `<svg viewBox="0 0 ${v.tens * 16 + 20 + Math.ceil(v.ones / 5) * 16} 110">${Array.from({ length: v.tens }, (_, i) => `<g>${Array.from({ length: 10 }, (_, j) => `<rect x="${4 + i * 16}" y="${4 + j * 10}" width="12" height="10" fill="#7FB0F5" stroke="#2F6FDB"/>`).join('')}</g>`).join('')}${Array.from({ length: v.ones }, (_, i) => `<rect x="${v.tens * 16 + 14 + Math.floor(i / 5) * 16}" y="${54 + (i % 5) * 10}" width="12" height="10" fill="#F4C430" stroke="#C99A0E"/>`).join('')}</svg>`;
  else if (v.type === 'clock') {
    const ha = ((v.h % 12) + v.m / 60) * 30, ma = v.m * 6;
    const nums = Array.from({ length: 12 }, (_, i) => { const a = (i + 1) * 30 * Math.PI / 180; return `<text x="${60 + 40 * Math.sin(a)}" y="${65 - 40 * Math.cos(a)}" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">${i + 1}</text>`; }).join('');
    svg = `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="var(--surface)" stroke="currentColor" stroke-width="3"/>${nums}<line x1="60" y1="60" x2="${60 + 26 * Math.sin(ha * Math.PI / 180)}" y2="${60 - 26 * Math.cos(ha * Math.PI / 180)}" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="60" y1="60" x2="${60 + 40 * Math.sin(ma * Math.PI / 180)}" y2="${60 - 40 * Math.cos(ma * Math.PI / 180)}" stroke="#E0442E" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="3.5" fill="currentColor"/></svg>`;
  } else if (v.type === 'fraction') {
    const w = 240 / v.d;
    svg = `<svg viewBox="0 0 244 44">${Array.from({ length: v.d }, (_, i) => `<rect x="${2 + i * w}" y="2" width="${w}" height="40" fill="${i < v.n ? '#2F6FDB' : 'var(--surface)'}" stroke="currentColor" stroke-width="2"/>`).join('')}</svg>`;
  } else if (v.type === 'shape') svg = `<svg viewBox="0 0 100 100"><g fill="#7FB0F5" stroke="#2F6FDB" stroke-width="3">${SHAPE_SVG[v.name]}</g></svg>`;
  else if (v.type === 'array') svg = `<svg viewBox="0 0 ${v.cols * 20 + 4} ${v.rows * 20 + 4}">${Array.from({ length: v.rows * v.cols }, (_, i) => `<circle cx="${12 + (i % v.cols) * 20}" cy="${12 + Math.floor(i / v.cols) * 20}" r="7" fill="#F28C28"/>`).join('')}</svg>`;
  else if (v.type === 'grid') svg = `<svg viewBox="0 0 ${v.cols * 20 + 4} ${v.rows * 20 + 4}">${Array.from({ length: v.rows * v.cols }, (_, i) => `<rect x="${2 + (i % v.cols) * 20}" y="${2 + Math.floor(i / v.cols) * 20}" width="20" height="20" fill="#DFF3E5" stroke="#15803D"/>`).join('')}</svg>`;
  else if (v.type === 'coord') {
    const g = Array.from({ length: 10 }, (_, i) => `<line x1="${20 + i * 20}" y1="10" x2="${20 + i * 20}" y2="190" stroke="currentColor" stroke-opacity=".15"/><line x1="20" y1="${190 - i * 20}" x2="200" y2="${190 - i * 20}" stroke="currentColor" stroke-opacity=".15"/><text x="${20 + i * 20}" y="204" font-size="10" text-anchor="middle" fill="currentColor">${i}</text><text x="10" y="${194 - i * 20}" font-size="10" text-anchor="middle" fill="currentColor">${i}</text>`).join('');
    svg = `<svg viewBox="0 0 210 210">${g}<line x1="20" y1="190" x2="200" y2="190" stroke="currentColor" stroke-width="2"/><line x1="20" y1="190" x2="20" y2="10" stroke="currentColor" stroke-width="2"/><circle cx="${20 + v.x * 20}" cy="${190 - v.y * 20}" r="6" fill="#E0442E"/></svg>`;
  } else if (v.type === 'righttri') svg = `<svg viewBox="0 0 220 150"><path d="M30 130h150V30z" fill="#E3ECFD" stroke="#2563EB" stroke-width="3"/><path d="M165 130v-15h15" fill="none" stroke="#2563EB" stroke-width="2"/><text x="105" y="146" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">${esc(v.a)}</text><text x="196" y="85" font-size="15" font-weight="800" fill="currentColor">${esc(v.b)}</text><text x="90" y="72" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">${esc(v.c)}</text></svg>`;
  return svg ? el('div', { class: `pic pic-${v.type}`, html: svg }) : null;
}
// "2^3" → 2<sup>3</sup> for display
export function mathText(s) {
  const span = el('span', { class: 'mtext' });
  String(s).split(/(\^-?\w+|\^\(.+?\))/).forEach((part) => { if (part.startsWith('^')) span.append(el('sup', {}, part.slice(1).replace(/^\((.*)\)$/, '$1'))); else span.append(part); });
  return span;
}

// small feedback sounds made in the browser: a soft rising chime, a low tone
let ctx = null;
export function chime(good = true) {
  try {
    ctx ??= new AudioContext();
    const now = ctx.currentTime;
    (good ? [523.25, 659.25, 783.99] : [311.13, 233.08]).forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      const t = now + i * 0.09; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.start(t); o.stop(t + 0.4);
    });
  } catch {}
}
