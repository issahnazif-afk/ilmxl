// Draws a geometry figure ({ type: 'fig', w, h, items }, made by src/math/figs.mjs) as an SVG string.
// Pure (no DOM), so pages, worksheets and the checker can all use it. Colours come from CSS variables
// (--fg-* in src/styles/ilmxl.css), so figures follow the light and dark themes; the fallbacks are the light ones.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const V = (name, fb) => `var(--fg-${name},${fb})`;
const LINE = V('line', '#2563EB'), HL = V('hl', '#DB2777'), HL2 = V('hl2', '#0D9488');
const TONE = {
  fig: { fill: V('fill', '#E3ECFD'), stroke: LINE, sw: 2.6 },
  front: { fill: V('front', '#DCE7FD'), stroke: LINE, sw: 2.2 },
  top: { fill: V('top', '#EEF3FE'), stroke: LINE, sw: 2.2 },
  side: { fill: V('side', '#C3D5FA'), stroke: LINE, sw: 2.2 },
  hl: { fill: V('hl-fill', '#FBD5E6'), stroke: HL, sw: 2.8 },
  hlsoft: { fill: V('hl-fill', '#FBD5E6'), stroke: 'none', sw: 0, op: 0.85 },
  hl2: { fill: V('hl2-fill', '#CCF0EA'), stroke: HL2, sw: 2.6 },
  shade: { fill: V('shade', '#BBF7D0'), stroke: V('shade-line', '#15803D'), sw: 2.4 },
  paper: { fill: V('paper', '#FFFFFF'), stroke: LINE, sw: 2.4 },
  cut: { fill: V('cut-fill', '#FDE68A'), stroke: V('cut', '#D97706'), sw: 2.4, op: 0.8 },
  hidden: { fill: 'none', stroke: LINE, sw: 1.8, dash: '6 5', op: 0.7 },
  aux: { fill: 'none', stroke: HL, sw: 2, dash: '5 4' },
  mark: { fill: 'none', stroke: HL, sw: 2 },
  ink: { fill: 'none', stroke: LINE, sw: 2.4 },
  grid: { fill: 'none', stroke: LINE, sw: 1, op: 0.55 },
  hlline: { fill: 'none', stroke: HL, sw: 4.2 },
};
const TEXT = { ink: 'currentColor', hl: HL, hl2: HL2, muted: V('muted', '#71717A'), mark: HL, hlline: HL };
const pts = (p) => p.map((q) => q.join(',')).join(' ');
const attrs = (t, open) => {
  const s = TONE[t] ?? TONE.ink;
  return `fill="${open ? 'none' : s.fill}" stroke="${s.stroke}" stroke-width="${s.sw}"${s.dash ? ` stroke-dasharray="${s.dash}"` : ''}${s.op ? ` opacity="${s.op}"` : ''} stroke-linejoin="round" stroke-linecap="round"`;
};

export function figSvg(v) {
  const out = [];
  for (const it of v.items ?? []) {
    if (it.k === 'poly') out.push(it.open ? `<polyline points="${pts(it.pts)}" ${attrs(it.t, true)}/>` : `<polygon points="${pts(it.pts)}" ${attrs(it.outline ? 'ink' : it.t, it.outline)}/>`);
    else if (it.k === 'line') out.push(`<line x1="${it.a[0]}" y1="${it.a[1]}" x2="${it.b[0]}" y2="${it.b[1]}" ${attrs(it.t, true)}/>`);
    else if (it.k === 'path') out.push(`<path d="${it.d}" ${attrs(it.t, !/Z\s*$/i.test(it.d))}${it.evenodd ? ' fill-rule="evenodd"' : ''}/>`);
    else if (it.k === 'circle') out.push(`<circle cx="${it.c[0]}" cy="${it.c[1]}" r="${it.r}" ${attrs(it.t)}/>`);
    else if (it.k === 'dot') out.push(`<circle cx="${it.at[0]}" cy="${it.at[1]}" r="3.2" fill="${TEXT[it.t] === 'currentColor' ? LINE : TEXT[it.t] ?? LINE}"/>`);
  }
  // labels last, so they sit on top, with a halo in the page colour so lines never cross through them
  for (const it of v.items ?? []) if (it.k === 'text') {
    out.push(`<text x="${it.at[0]}" y="${it.at[1]}" text-anchor="${it.anchor ?? 'middle'}" dominant-baseline="central" font-size="${it.size ?? 14}" font-weight="800" fill="${TEXT[it.t] ?? 'currentColor'}" stroke="${V('halo', '#FFFFFF')}" stroke-width="4" paint-order="stroke" style="font-variant-numeric:tabular-nums">${esc(it.s)}</text>`);
  }
  return `<svg viewBox="0 0 ${v.w} ${v.h}" role="img"${v.alt ? ` aria-label="${esc(v.alt)}"` : ''}>${out.join('')}</svg>`;
}
