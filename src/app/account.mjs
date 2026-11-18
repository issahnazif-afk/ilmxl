// Accounts: sign up, sign in, sign out, and keeping each learner's progress saved to the account
// (the IlmXL accounts server: apps-script/Code.gs). Built like Ta'aleem's adult accounts.
//
// Without a server address (VITE_ILMXL_SERVER at build time) accounts are kept on this device only: the password
// is checked against a PBKDF2 hash stored in this browser. The sign-in page says so.
const SERVER = import.meta.env?.VITE_ILMXL_SERVER || '';
const KEY = 'ilmxl-account';
const LOCAL = 'ilmxl-local-accounts';
export const isDemo = () => !SERVER;

export function me() { try { const a = JSON.parse(localStorage.getItem(KEY) || 'null'); return a?.username && a?.token ? a : null; } catch { return null; } }
const keep = (a) => { try { a ? localStorage.setItem(KEY, JSON.stringify(a)) : localStorage.removeItem(KEY); } catch {} };

export const MESSAGES = {
  'no-name': 'Please enter your name.',
  'bad-username': 'Usernames are 3 to 24 letters or numbers, and may use . _ or - (no spaces).',
  'short-password': 'Choose a password of at least 8 characters.',
  'username-taken': 'That username is already taken. Try another.',
  'bad-login': 'That username or password is not right.',
  'bad-type': 'Choose who the account is for.',
  'too-many': 'Too many tries. Wait 15 minutes, then try again.',
  'busy': 'Lots of people are joining right now. Please try again shortly.',
  'signed-out': 'Your sign-in has expired. Please sign in again.',
  'too-many-learners': 'An account can have up to 12 learners.',
  offline: 'You seem to be offline. Check your internet connection and try again.',
  server: 'The IlmXL accounts server is not answering right now. Please try again in a few minutes.',
};
export const messageFor = (code) => MESSAGES[code] ?? 'Something went wrong. Please try again.';

async function post(body, { timeout = 20000, keepalive = false } = {}) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeout);
  try {
    // text/plain: a simple request with no preflight, which Apps Script web apps accept from any site
    const r = await fetch(SERVER, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body), signal: ctl.signal, redirect: 'follow', keepalive });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } catch (e) {
    // a refused or misconfigured server looks like a network error to the browser; only say "offline" when it is
    if (typeof console !== 'undefined') console.warn('IlmXL accounts server:', e?.message ?? e);
    return { ok: false, error: typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'server' };
  } finally { clearTimeout(t); }
}

// ── device-only accounts (no server) ──
async function pbkdf2(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 150000 }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}
const locals = () => { try { return JSON.parse(localStorage.getItem(LOCAL) || '{}'); } catch { return {}; } };
const saveLocals = (x) => { try { localStorage.setItem(LOCAL, JSON.stringify(x)); } catch {} };

export const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,23}$/;
export function validate({ name, username, password, type }, signup) {
  if (signup && (!name || name.trim().length < 2)) return 'no-name';
  if (!USERNAME_RE.test(String(username || '').trim().toLowerCase())) return signup ? 'bad-username' : 'bad-login';
  if (String(password || '').length < 8) return signup ? 'short-password' : 'bad-login';
  if (signup && !type) return 'bad-type';
  return null;
}

export async function register(form) {
  const bad = validate(form, true); if (bad) return { ok: false, error: bad };
  const username = form.username.trim().toLowerCase();
  let r;
  if (isDemo()) {
    const all = locals();
    if (all[username]) return { ok: false, error: 'username-taken' };
    const salt = crypto.randomUUID();
    all[username] = { name: form.name.trim(), type: form.type, province: form.province, salt, hash: await pbkdf2(form.password, salt), joined: Date.now() };
    saveLocals(all);
    r = { ok: true, username, name: form.name.trim(), type: form.type, province: form.province, token: 'device' };
  } else r = await post({ action: 'register', name: form.name, username, password: form.password, type: form.type, province: form.province, website: form.website ?? '' });
  if (r.ok) keep({ username: r.username, name: r.name, type: r.type, province: r.province, token: r.token });
  return r;
}

export async function signIn({ username, password }) {
  const bad = validate({ username, password }, false); if (bad) return { ok: false, error: bad };
  username = username.trim().toLowerCase();
  let r;
  if (isDemo()) {
    const a = locals()[username];
    if (!a || (await pbkdf2(password, a.salt)) !== a.hash) return { ok: false, error: 'bad-login' };
    r = { ok: true, username, name: a.name, type: a.type, province: a.province, token: 'device' };
  } else r = await post({ action: 'login', username, password });
  if (r.ok) keep({ username: r.username, name: r.name, type: r.type, province: r.province, token: r.token });
  return r;
}

export function signOut() { flush(); keep(null); }

// ── progress on the server ──
export async function pull() {
  const a = me(); if (!a || isDemo()) return null;
  const r = await post({ action: 'load', token: a.token });
  if (!r.ok) { if (r.error === 'signed-out') keep(null); return r.error === 'signed-out' ? { signedOut: true } : null; }
  return r.learners;
}
// the log is long; the account keeps the latest part of it
const slim = (l) => ({ ...l, progress: { ...l.progress, log: (l.progress.log ?? []).slice(-150) } });
const queue = new Map(); let timer = null;
export function queueSave(learner) {
  if (isDemo() || !me()) return;
  queue.set(learner.id, slim(learner));
  clearTimeout(timer); timer = setTimeout(flush, 3000);
}
export function flush(keepalive = false) {
  const a = me(); if (!a || isDemo() || !queue.size) return;
  const items = [...queue.values()]; queue.clear();
  for (const learner of items) post({ action: 'save', token: a.token, learner }, { keepalive }).then((r) => { if (!r.ok && (r.error === 'offline' || r.error === 'server')) queue.set(learner.id, learner); });
}
export function removeRemote(id) { const a = me(); if (a && !isDemo()) post({ action: 'remove', token: a.token, id }); }
export async function changePassword(old, password) {
  const a = me(); if (!a) return { ok: false, error: 'signed-out' };
  if (String(password).length < 8) return { ok: false, error: 'short-password' };
  if (isDemo()) {
    const all = locals(), x = all[a.username];
    if (!x || (await pbkdf2(old, x.salt)) !== x.hash) return { ok: false, error: 'bad-login' };
    x.salt = crypto.randomUUID(); x.hash = await pbkdf2(password, x.salt); saveLocals(all); return { ok: true };
  }
  return post({ action: 'password', token: a.token, old, password });
}
try { addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); }); } catch {}

// password strength, 0–4, for the sign-up meter
export function strength(p) {
  let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++; if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(4, s);
}
