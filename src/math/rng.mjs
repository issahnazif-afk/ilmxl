// A small seeded random generator, so a question can be made again from its seed (and the checker can test
// thousands of them the same way every time).
export function rng(seed = Date.now()) {
  let a = seed >>> 0 || 1;
  const next = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const r = {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    bool: (p = 0.5) => next() < p,
    shuffle: (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    nonzero: (lo, hi) => { let v = 0; while (v === 0) v = r.int(lo, hi); return v; },
  };
  return r;
}

export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
export function simplify(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; }
export const frac = (n, d) => { const [a, b] = simplify(n, d); return b === 1 ? String(a) : `${a}/${b}`; };
export const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
// a tidy decimal string: no float noise (0.1 + 0.2 → "0.3")
export const dec = (x, places = 6) => String(Number(x.toFixed(places)));
// a signed term for showing an expression: +3, − 4
export const sgn = (n) => (n < 0 ? `− ${-n}` : `+ ${n}`);
export const neg = (n) => (n < 0 ? `−${-n}` : String(n));
