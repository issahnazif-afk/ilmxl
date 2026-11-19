// Figures for the original geometry skills in src/math/skills.mjs (rectangles, angle pairs, boxes, triangles,
// circles, right triangles, similar triangles, trig triangles, the unit circle).
import * as G from '../figs.mjs';

const disp = (a, b) => { const [x, y] = G.squash([a, b], 0.4, 0.8); return [x * 10, y * 10]; };

export const rectFig = (l, w, u = 'cm', hl) => { const [L, W] = disp(l, w); return G.polygonFig({ pts: [[0, 0], [L, 0], [L, W], [0, W]], sides: [`${l} ${u}`, `${w} ${u}`, `${l} ${u}`, `${w} ${u}`], right: [0, 1, 2, 3], hl }); };
export const triFig = (b, h, u = 'm', hl) => { const [B, H] = disp(b, h); return G.polygonFig({ pts: [[0, 0], [B, 0], [B * 0.35, H]], sides: [`${b} ${u}`, '', ''], base: 0, height: { from: 2, side: 0, label: `${h} ${u}` }, hl }); };
// a right triangle with legs a (bottom) and b (up), labels for each side ('' for none), hl: { side } entries
export function rightTriFig(a, b, labels = [], hl, angle = null) {
  const [A, B] = disp(a, b);
  const o = { pts: [[0, 0], [A, 0], [A, B]], sides: labels, right: [1], hl };
  if (angle) o.angles = [angle, '', ''];
  return G.polygonFig(o);
}
// two similar triangles side by side: the small one with sides s1, the big one with sides s2 (labels, '' to hide)
export function similarTris(s1, s2, k) {
  // one picture, the large triangle drawn bigger (by up to 2.2 times, so the small one stays readable)
  const shape = [[0, 0], [6, 0], [2, 4]], z = Math.min(k, 2.2), u = 17;
  const tri = (ox, sc) => shape.map(([x, y]) => [ox + x * u * sc, 196 - y * u * sc]);
  const A = tri(24, 1), B = tri(24 + 6 * u + 40, z), W = 24 + 6 * u + 40 + 6 * u * z + 30;
  const items = [];
  for (const [P, s] of [[A, s1], [B, s2]]) {
    items.push(G.poly(P, 'fig'), ...G.angleArc(P[0], P[1], P[2], '', 16));
    s.forEach((t, j) => items.push(G.sideLabel(P[j], P[(j + 1) % 3], t, P, t === '?' ? 'hl' : 'ink')));
  }
  return G.fig(items, W, 222);
}
// the unit circle with the point at angle deg, its coordinates (cos, sin) shown as dashed lines
export function unitCircle(deg, label = '') {
  const W = 260, H = 260, C = [130, 130], R = 95, a = (deg * Math.PI) / 180, P = [C[0] + R * Math.cos(a), C[1] - R * Math.sin(a)];
  const items = [G.circle(C, R, 'fig'), G.line([20, 130], [240, 130], 'ink'), G.line([130, 240], [130, 20], 'ink'),
    G.text([250, 130], 'x', 'muted', { size: 12 }), G.text([130, 12], 'y', 'muted', { size: 12 }), G.text([C[0] + R + 8, 142], '1', 'muted', { size: 12 }), G.text([120, C[1] - R - 8], '1', 'muted', { size: 12 })];
  // the turn from the positive x-axis, counterclockwise (the long way round for angles past 180°)
  const d = ((deg % 360) + 360) % 360, r = 24, E = [C[0] + r * Math.cos(a), C[1] - r * Math.sin(a)];
  if (d !== 0) items.push(G.path(`M${C[0] + r} ${C[1]}A${r} ${r} 0 ${d > 180 ? 1 : 0} 0 ${Math.round(E[0] * 10) / 10} ${Math.round(E[1] * 10) / 10}`, 'mark'));
  items.push(G.line(C, P, 'hlline'), G.line(P, [P[0], C[1]], 'aux'), G.line(P, [C[0], P[1]], 'aux'), G.dot(P, 'hl'));
  if (label) items.push(G.text([P[0] + (Math.cos(a) >= 0 ? 26 : -26), P[1] + (Math.sin(a) >= 0 ? -14 : 14)], label, 'hl'));
  return G.fig(items, W, H);
}
export const angleLine = (a, total, labels) => (total === 90 ? G.anglePairFig({ kind: 'comp', deg: a, labels }) : G.anglePairFig({ kind: 'supp', deg: a, labels }));
