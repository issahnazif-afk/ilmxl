/**
 * IlmXL accounts — the server the IlmXL website talks to (a Google Apps Script web app on a Google Sheet),
 * built the same way as Ta'aleem's class server.
 *
 * It:
 *   • creates accounts: a parent or guardian (for a family of learners) or a student aged 13 or over, each with a
 *     unique username and a password (stored only as a salted, many-times-hashed value; never the password),
 *   • signs people in and gives the website a signed token (valid 60 days),
 *   • keeps each learner's progress in the "Progress" tab, one row per learner, so it follows the family to any
 *     device, and lets a signed-in person change their password.
 *
 * Set up once (full steps in apps-script/README.md):
 *   1. Create a Google Sheet called "IlmXL accounts". Extensions → Apps Script. Paste this file. Save.
 *   2. Run setup() once and allow access.
 *   3. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 *   4. In GitHub: Settings → Secrets and variables → Actions → Variables → New variable
 *      ILMXL_SERVER_URL = the Web app URL. Then re-run the deploy.
 *
 * To reset a password: type a temporary password in the "Reset password" column of the Accounts tab and tell the
 * person. They sign in with it once and it becomes their password.
 */

const ACCOUNTS_TAB = 'Accounts';
const ACCOUNT_HEADERS = ['Username', 'Name', 'Type', 'Province', 'Joined', 'Last sign-in', 'Reset password', 'Password hash', 'Salt', 'Learners', 'Last activity'];
const A = { user: 0, name: 1, type: 2, prov: 3, joined: 4, last: 5, reset: 6, hash: 7, salt: 8, learners: 9, activity: 10 };
const PROGRESS_TAB = 'Progress';
const PROGRESS_HEADERS = ['Account', 'Learner ID', 'Learner name', 'Grade', 'Updated', 'Data'];
const P = { acct: 0, id: 1, name: 2, grade: 3, updated: 4, data: 5 };
const TYPES = { parent: 'Parent or guardian', student: 'Student (13+)', teacher: 'Teacher' };
const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,23}$/;
const TOKEN_DAYS = 60;
const HASH_ROUNDS = 300;
const SIGNUPS_PER_HOUR = 120;
const LOGIN_TRIES = 8;             // wrong passwords allowed per username per 15 minutes
const MAX_LEARNERS = 12;

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ACCOUNTS_TAB) || ss.insertSheet(ACCOUNTS_TAB, 0);
  if (sh.getLastRow() === 0) sh.appendRow(ACCOUNT_HEADERS);
  sh.getRange(1, 1, 1, ACCOUNT_HEADERS.length).setFontWeight('bold');
  sh.getRange(1, A.reset + 1).setBackground('#FBE3A6').setNote('Type a temporary password here to reset an account\'s password. It is cleared once they sign in with it.');
  sh.setFrozenRows(1);
  sh.hideColumns(A.hash + 1, 2);
  sh.getRange('E:F').setNumberFormat('yyyy-mm-dd hh:mm');
  let pr = ss.getSheetByName(PROGRESS_TAB) || ss.insertSheet(PROGRESS_TAB, 1);
  if (pr.getLastRow() === 0) pr.appendRow(PROGRESS_HEADERS);
  pr.getRange(1, 1, 1, PROGRESS_HEADERS.length).setFontWeight('bold');
  pr.setFrozenRows(1);
  pr.getRange('E:E').setNumberFormat('yyyy-mm-dd hh:mm');
  secret();
  SpreadsheetApp.getUi().alert('IlmXL accounts are ready. Now deploy this script as a web app (Execute as: Me, Who has access: Anyone) and put its URL in GitHub as ILMXL_SERVER_URL.');
}

function doGet() { return json({ ok: true, service: 'ilmxl-accounts' }); }

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'bad-request' }); }
  try {
    switch (body.action) {
      case 'register': return json(register(body));
      case 'login': return json(login(body));
      case 'load': return json(load(body));
      case 'save': return json(save(body));
      case 'remove': return json(removeLearner(body));
      case 'password': return json(changePassword(body));
      default: return json({ ok: false, error: 'unknown-action' });
    }
  } catch (err) {
    return json({ ok: false, error: 'server', detail: String(err && err.message || err).slice(0, 200) });
  }
}

function json(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

// ── passwords and tokens ──
function hashPassword(password, salt) {
  let h = salt + '|' + password;
  for (let i = 0; i < HASH_ROUNDS; i++) h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + '|' + password, Utilities.Charset.UTF_8));
  return h;
}
function secret() {
  const props = PropertiesService.getScriptProperties();
  let s = props.getProperty('TOKEN_SECRET');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); props.setProperty('TOKEN_SECRET', s); }
  return s;
}
function sign(text) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(text, secret())); }
function makeToken(username) { const p = String(username).toLowerCase() + '|' + (Date.now() + TOKEN_DAYS * 864e5); return Utilities.base64EncodeWebSafe(p) + '.' + sign(p); }
function readToken(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 2) return null;
  let p; try { p = Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString(); } catch (err) { return null; }
  if (sign(p) !== parts[1]) return null;
  const [user, exp] = p.split('|');
  return Number(exp) > Date.now() ? user : null;
}

// ── rows ──
function accounts() { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ACCOUNTS_TAB); }
function progressSheet() { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PROGRESS_TAB); }
function findAccount(sh, username) {
  const u = String(username || '').trim().toLowerCase();
  if (!u || sh.getLastRow() < 2) return null;
  const col = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < col.length; i++) if (String(col[i][0]).toLowerCase() === u) {
    const row = i + 2;
    return { row, v: sh.getRange(row, 1, 1, ACCOUNT_HEADERS.length).getValues()[0] };
  }
  return null;
}
function who(body) {
  const user = readToken(body.token);
  if (!user) return { error: 'signed-out' };
  const sh = accounts(), ac = findAccount(sh, user);
  if (!ac) return { error: 'signed-out' };
  return { sh, ac, user };
}
function view(v) { return { ok: true, username: String(v[A.user]), name: String(v[A.name]), type: typeKey(v[A.type]), province: String(v[A.prov] || 'NS'), token: makeToken(v[A.user]) }; }
function typeKey(label) { for (const k in TYPES) if (TYPES[k] === String(label)) return k; return 'parent'; }

// ── actions ──
function register(body) {
  if (String(body.website || '')) return { ok: false, error: 'bad-request' };   // a hidden field only robots fill in
  const name = String(body.name || '').trim().replace(/\s+/g, ' ');
  const username = String(body.username || '').trim().toLowerCase();
  const password = String(body.password || '');
  const type = TYPES[body.type] ? body.type : '';
  const province = /^[A-Z]{2}$/.test(String(body.province || '')) ? body.province : 'NS';
  if (name.length < 2 || name.length > 80) return { ok: false, error: 'no-name' };
  if (!USERNAME_RE.test(username)) return { ok: false, error: 'bad-username' };
  if (password.length < 8 || password.length > 200) return { ok: false, error: 'short-password' };
  if (!type) return { ok: false, error: 'bad-type' };
  const cache = CacheService.getScriptCache(), hour = 'signups-' + Math.floor(Date.now() / 36e5), count = Number(cache.get(hour) || 0);
  if (count >= SIGNUPS_PER_HOUR) return { ok: false, error: 'busy' };
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  let row;
  try {
    const sh = accounts();
    if (findAccount(sh, username)) return { ok: false, error: 'username-taken' };
    const salt = Utilities.getUuid();
    row = [username, name, TYPES[type], province, new Date(), new Date(), '', hashPassword(password, salt), salt, 0, new Date()];
    sh.appendRow(row);
    cache.put(hour, String(count + 1), 3700);
  } finally { lock.releaseLock(); }
  return view(row);
}

function login(body) {
  const username = String(body.username || '').trim().toLowerCase();
  const cache = CacheService.getScriptCache(), key = 'tries-' + username.slice(0, 40), tries = Number(cache.get(key) || 0);
  if (tries >= LOGIN_TRIES) return { ok: false, error: 'too-many' };
  const sh = accounts(), ac = findAccount(sh, username), password = String(body.password || '');
  let ok = false;
  if (ac) {
    ok = !!ac.v[A.hash] && hashPassword(password, String(ac.v[A.salt])) === String(ac.v[A.hash]);
    const reset = String(ac.v[A.reset] || '');
    if (!ok && reset && password === reset) {
      const salt = Utilities.getUuid();
      sh.getRange(ac.row, A.reset + 1).setValue('');
      sh.getRange(ac.row, A.hash + 1, 1, 2).setValues([[hashPassword(password, salt), salt]]);
      ok = true;
    }
  }
  if (!ok) { cache.put(key, String(tries + 1), 900); return { ok: false, error: 'bad-login' }; }
  cache.remove(key);
  sh.getRange(ac.row, A.last + 1).setValue(new Date());
  return view(ac.v);
}

function load(body) {
  const r = who(body); if (r.error) return { ok: false, error: r.error };
  const pr = progressSheet(), learners = [];
  if (pr.getLastRow() >= 2) {
    const rows = pr.getRange(2, 1, pr.getLastRow() - 1, PROGRESS_HEADERS.length).getValues();
    for (const x of rows) if (String(x[P.acct]).toLowerCase() === r.user) { try { learners.push(JSON.parse(String(x[P.data]))); } catch (err) {} }
  }
  return { ok: true, learners };
}

function save(body) {
  const r = who(body); if (r.error) return { ok: false, error: r.error };
  const l = body.learner || {};
  const id = String(l.id || '');
  if (!/^[a-z0-9]{4,16}$/.test(id)) return { ok: false, error: 'bad-learner' };
  const text = JSON.stringify(l);
  if (text.length > 48000) return { ok: false, error: 'too-big' };     // a Sheets cell holds 50,000 characters
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const pr = progressSheet();
    const n = pr.getLastRow() - 1;
    const rows = n > 0 ? pr.getRange(2, 1, n, 2).getValues() : [];
    let at = -1, mine = 0;
    rows.forEach((x, i) => { if (String(x[0]).toLowerCase() === r.user) { mine++; if (String(x[1]) === id) at = i + 2; } });
    const values = [r.user, id, String(l.name || '').slice(0, 30), String(l.grade), new Date(), text];
    if (at > 0) pr.getRange(at, 1, 1, values.length).setValues([values]);
    else { if (mine >= MAX_LEARNERS) return { ok: false, error: 'too-many-learners' }; pr.appendRow(values); mine++; }
    r.sh.getRange(r.ac.row, A.learners + 1).setValue(mine);
    r.sh.getRange(r.ac.row, A.activity + 1).setValue(new Date());
  } finally { lock.releaseLock(); }
  return { ok: true };
}

function removeLearner(body) {
  const r = who(body); if (r.error) return { ok: false, error: r.error };
  const id = String(body.id || '');
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const pr = progressSheet();
    for (let row = pr.getLastRow(); row >= 2; row--) {
      const x = pr.getRange(row, 1, 1, 2).getValues()[0];
      if (String(x[0]).toLowerCase() === r.user && String(x[1]) === id) pr.deleteRow(row);
    }
  } finally { lock.releaseLock(); }
  return { ok: true };
}

function changePassword(body) {
  const r = who(body); if (r.error) return { ok: false, error: r.error };
  const old = String(body.old || ''), next = String(body.password || '');
  if (hashPassword(old, String(r.ac.v[A.salt])) !== String(r.ac.v[A.hash])) return { ok: false, error: 'bad-login' };
  if (next.length < 8 || next.length > 200) return { ok: false, error: 'short-password' };
  const salt = Utilities.getUuid();
  r.sh.getRange(r.ac.row, A.hash + 1, 1, 2).setValues([[hashPassword(next, salt), salt]]);
  return { ok: true };
}
