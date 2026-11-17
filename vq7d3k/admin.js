// Админка портфолио: правит названия, подписи, теги, порядок и видимость работ.
// Вход через Firebase Authentication (почта и пароль). Правки пишутся в Firestore, документ site/content;
// записывать туда может только владелец (правила Firestore), читают все (так сайт их получает).
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const OWNER = 'I2bJwD0kvgO5xAUuiXYaSHiI6BE2'; // User UID владельца в Firebase
const OWNER_EMAIL = 'kalkanbaev5@gmail.com'; // вход только по паролю, почта всегда эта
const SC = window.SiteContent;
const BASE = window.PORTFOLIO || {};
const GROUP_NAMES = { motion: 'Моушен', reels: 'Рилсы', graphics: 'Графика' };

const auth = getAuth(initializeApp(SC.FIREBASE));
auth.languageCode = 'ru';

const $ = (selector, scope) => (scope || document).querySelector(selector);
function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

/* ---------- Данные ---------- */

const str = (v) => (v == null ? '' : String(v));
const pair = (v) => (typeof v === 'string' ? { en: v, ru: v } : { en: str(v && v.en), ru: str(v && v.ru) });
const words = (v) => (Array.isArray(v) ? v : typeof v === 'string' ? v.split(',') : [])
  .map((s) => String(s).trim()).filter(Boolean);
const tagPair = (v) => (Array.isArray(v) || typeof v === 'string'
  ? { en: words(v), ru: words(v) }
  : { en: words(v && v.en), ru: words(v && v.ru) });
const record = (w) => ({ title: pair(w.title), note: pair(w.note), tags: tagPair(w.tags), hidden: !!w.hidden });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Готовый список тегов: тег ставится нажатием сразу на двух языках.
// Список можно дополнять прямо в админке, он сохраняется вместе с остальными правками.
const DEFAULT_TAGS = [
  { en: 'Idea', ru: 'Идея' },
  { en: 'Concept', ru: 'Концепция' },
  { en: 'Script', ru: 'Сценарий' },
  { en: 'Storyboard', ru: 'Раскадровка' },
  { en: 'Filming', ru: 'Съёмка' },
  { en: 'Directing', ru: 'Режиссура' },
  { en: 'Editing', ru: 'Монтаж' },
  { en: 'Animation', ru: 'Анимация' },
  { en: 'Motion design', ru: 'Моушен-дизайн' },
  { en: 'AI generation', ru: 'AI-генерация' },
  { en: 'VFX', ru: 'VFX' },
  { en: '3D', ru: '3D' },
  { en: 'Color grading', ru: 'Цветокоррекция' },
  { en: 'Sound design', ru: 'Саунд-дизайн' },
  { en: 'Voice-over', ru: 'Озвучка' },
  { en: 'Design', ru: 'Дизайн' },
  { en: 'Illustration', ru: 'Иллюстрация' },
  { en: 'Branding', ru: 'Брендинг' },
  { en: 'Layout', ru: 'Вёрстка' },
  { en: 'Retouching', ru: 'Ретушь' }
];
const tagKey = (s) => str(s).trim().toLowerCase();
const sameTag = (a, b) => (!!tagKey(a.en) && tagKey(a.en) === tagKey(b.en)) || (!!tagKey(a.ru) && tagKey(a.ru) === tagKey(b.ru));
// Место тега в тегах работы (там два списка, английский и русский, в одном порядке)
function tagAt(tags, t) {
  const n = Math.max(tags.en.length, tags.ru.length);
  for (let i = 0; i < n; i++) if (sameTag({ en: tags.en[i], ru: tags.ru[i] }, t)) return i;
  return -1;
}
function toggleTag(rec, t) {
  const i = tagAt(rec.tags, t);
  if (i >= 0) { rec.tags.en.splice(i, 1); rec.tags.ru.splice(i, 1); }
  else { rec.tags.en.push(t.en); rec.tags.ru.push(t.ru); }
}

const meta = {};         // id -> { work, group }: исходная запись из works.js
const defaults = {};     // id -> тексты из works.js
const defaultOrder = {}; // раздел -> порядок из works.js
const state = { order: {}, works: {}, tagList: [] };
let savedJSON = '';
let ready = false;
let saving = false;
let lastSaved = '';

(function readDefaults() {
  const plain = SC.apply(BASE, null, true);
  SC.GROUPS.forEach((group) => {
    defaultOrder[group] = plain[group].map((w) => w.id);
    plain[group].forEach((w) => {
      meta[w.id] = { work: w, group };
      defaults[w.id] = record(w);
    });
  });
})();

function useContent(content) {
  const merged = SC.apply(BASE, content, true);
  SC.GROUPS.forEach((group) => {
    state.order[group] = merged[group].map((w) => w.id);
    merged[group].forEach((w) => { state.works[w.id] = record(w); });
  });
  const list = content && Array.isArray(content.tagList) ? content.tagList : DEFAULT_TAGS;
  state.tagList = list.filter((t) => t && (t.en || t.ru))
    .map((t) => ({ en: str(t.en || t.ru).trim(), ru: str(t.ru || t.en).trim() }));
  // Теги работ, которых нет в списке, добавляем в список, чтобы их было видно и можно было снять
  Object.values(state.works).forEach(({ tags }) => {
    const n = Math.max(tags.en.length, tags.ru.length);
    for (let i = 0; i < n; i++) {
      const t = { en: tags.en[i] || tags.ru[i], ru: tags.ru[i] || tags.en[i] };
      if (!state.tagList.some((x) => sameTag(x, t))) state.tagList.push(t);
    }
  });
  savedJSON = JSON.stringify(build());
}

// В базу пишем только отличия от works.js: тогда правки в works.js по-прежнему доходят до сайта
function build() {
  const works = {};
  Object.keys(state.works).forEach((id) => {
    const now = state.works[id];
    const def = defaults[id];
    const diff = {};
    ['title', 'note', 'tags'].forEach((k) => { if (!same(now[k], def[k])) diff[k] = now[k]; });
    if (now.hidden) diff.hidden = true;
    if (Object.keys(diff).length) works[id] = diff;
  });
  const order = {};
  SC.GROUPS.forEach((group) => {
    if (!same(state.order[group], defaultOrder[group])) order[group] = state.order[group].slice();
  });
  const out = { v: 1, works, order };
  if (!same(state.tagList, DEFAULT_TAGS)) out.tagList = state.tagList.map((t) => ({ en: t.en, ru: t.ru }));
  return out;
}

const isDirty = () => ready && JSON.stringify(build()) !== savedJSON;

/* ---------- Вход ---------- */

const gate = $('#gate');
const gateWait = $('#gate-wait');
const login = $('#login');
const loginEmail = $('#login-email'); // скрытое поле: чтобы менеджер паролей узнал аккаунт
loginEmail.value = OWNER_EMAIL;
const loginPass = $('#login-pass');
const loginGo = $('#login-go');
const loginMsg = $('#login-msg');
const appBox = $('#app');

function showLogin(message) {
  appBox.hidden = true;
  gate.hidden = false;
  gateWait.hidden = true;
  login.hidden = false;
  loginMsg.textContent = message || '';
  loginMsg.classList.remove('msg--ok');
  loginPass.focus();
}

function authError(err) {
  const code = (err && err.code) || '';
  if (/invalid-credential|wrong-password|user-not-found|invalid-email|missing-password/.test(code)) return 'Неверный пароль.';
  if (code.includes('too-many-requests')) return 'Слишком много попыток. Подождите несколько минут.';
  if (code.includes('network-request-failed')) return 'Нет связи с интернетом.';
  if (code.includes('operation-not-allowed')) return 'Вход по почте выключен в Firebase: Authentication → Sign-in method → Email/Password.';
  if (code.includes('user-disabled')) return 'Этот аккаунт отключён в Firebase.';
  return 'Не получилось (' + (code || 'неизвестная ошибка') + ').';
}

login.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMsg.textContent = '';
  loginMsg.classList.remove('msg--ok');
  if (!loginPass.value) { loginMsg.textContent = 'Впишите пароль.'; return; }
  loginGo.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, OWNER_EMAIL, loginPass.value);
    loginPass.value = '';
  } catch (err) {
    loginMsg.textContent = authError(err);
  } finally {
    loginGo.disabled = false;
  }
});

$('#login-reset').addEventListener('click', async () => {
  loginMsg.classList.remove('msg--ok');
  try {
    await sendPasswordResetEmail(auth, OWNER_EMAIL);
    loginMsg.textContent = 'Ссылка для нового пароля ушла на ' + OWNER_EMAIL + '. Если письма нет, проверьте спам.';
    loginMsg.classList.add('msg--ok');
  } catch (err) {
    loginMsg.textContent = authError(err);
  }
});


/* ---------- Редактор ---------- */

const statusBox = $('#status');
const saveBtn = $('#save');
const tabsBox = $('#tabs');
const listBox = $('#list');
let tab = 'motion';
try { if (SC.GROUPS.includes(sessionStorage.getItem('admin-tab'))) tab = sessionStorage.getItem('admin-tab'); } catch (e) { /* не важно */ }

function setStatus(text, kind) {
  statusBox.textContent = text;
  statusBox.dataset.kind = kind || '';
}

function changed() {
  const dirty = isDirty();
  saveBtn.disabled = !ready || saving || !dirty;
  if (saving) return;
  if (dirty) setStatus('Есть несохранённые правки', 'dirty');
  else if (ready) setStatus(lastSaved || 'Изменений нет', lastSaved ? 'ok' : '');
}

async function loadContent() {
  ready = false;
  changed();
  listBox.textContent = '';
  tabsBox.textContent = '';
  setStatus('Загружаю…');
  let content;
  try {
    content = await SC.load();
  } catch (err) {
    // Без текущих правок редактировать нельзя: сохранение затёрло бы то, что уже на сайте
    const denied = /403/.test(String(err && err.message));
    setStatus(denied ? 'Firestore не даёт читать: опубликуйте правила доступа' : 'Не удалось загрузить правки', 'error');
    const retry = el('button', 'btn', 'Попробовать снова');
    retry.type = 'button';
    retry.addEventListener('click', loadContent);
    listBox.append(retry);
    return;
  }
  useContent(content);
  ready = true;
  renderTabs();
  renderList();
  changed();
}

function renderTabs() {
  tabsBox.textContent = '';
  SC.GROUPS.forEach((group) => {
    const b = el('button', 'tab');
    b.type = 'button';
    b.append(el('span', '', GROUP_NAMES[group]), el('span', 'tab__count', String(state.order[group].length)));
    b.setAttribute('aria-pressed', String(group === tab));
    b.addEventListener('click', () => {
      tab = group;
      try { sessionStorage.setItem('admin-tab', tab); } catch (e) { /* не важно */ }
      renderTabs();
      renderList();
    });
    tabsBox.append(b);
  });
}

function cover(work, group) {
  if (work.cover) return '../' + work.cover;
  if (group === 'motion') return '../assets/video/' + (work.yt || work.id) + '.webp';
  if (group === 'reels') return '../assets/reels/' + (work.ig || work.id) + '.webp';
  return '../assets/graphics/' + work.file + '-sm.webp';
}

function input(label, value, onInput, placeholder) {
  const wrap = el('label', 'field');
  const box = el('input');
  box.type = 'text';
  box.value = value;
  box.spellcheck = true;
  if (placeholder) box.placeholder = placeholder;
  box.addEventListener('input', () => { onInput(box.value); changed(); });
  wrap.append(el('span', 'field__label', label), box);
  return wrap;
}

function column(rec, lang) {
  const col = el('div', 'work__col');
  const ru = lang === 'ru';
  col.append(
    el('span', 'work__lang', ru ? 'Русский' : 'English'),
    input('Название', rec.title[lang], (v) => { rec.title[lang] = v; }, ru ? rec.title.en : ''),
    input('Подпись', rec.note[lang], (v) => { rec.note[lang] = v; }, ru ? rec.note.en : '')
  );
  return col;
}

/* Теги работы: кнопки из общего списка. «+» открывает панель, где список можно дополнить или почистить */

function tagBlock(id) {
  const box = el('div', 'tags');
  box.dataset.id = id;
  box.append(el('span', 'field__label', 'Теги: нажмите, чтобы поставить или снять. На сайте они будут на английском и на русском'),
    el('div', 'chips'), tagForm());
  fillChips(box);
  return box;
}

function fillChips(box) {
  const rec = state.works[box.dataset.id];
  const editing = box.classList.contains('is-editing');
  const chips = $('.chips', box);
  chips.textContent = '';
  state.tagList.forEach((t) => {
    const on = tagAt(rec.tags, t) >= 0;
    const chip = el('button', 'chip' + (on ? ' is-on' : ''));
    chip.type = 'button';
    chip.setAttribute('aria-pressed', String(on));
    chip.append(el('span', '', t.ru));
    if (tagKey(t.en) !== tagKey(t.ru)) chip.append(el('small', '', t.en));
    if (editing) {
      chip.append(el('span', 'chip__x', '×'));
      chip.title = 'Убрать из списка';
      chip.addEventListener('click', () => dropTag(t));
    } else {
      chip.addEventListener('click', () => {
        toggleTag(rec, t);
        fillChips(box);
        changed();
        const again = [...$('.chips', box).children].find((c) => c.firstChild && c.firstChild.textContent === t.ru);
        if (again) again.focus();
      });
    }
    chips.append(chip);
  });
  const add = el('button', 'chip chip--add', editing ? 'Готово' : '+');
  add.type = 'button';
  add.title = editing ? 'Закрыть панель' : 'Добавить тег в список';
  add.setAttribute('aria-label', add.title);
  add.setAttribute('aria-expanded', String(editing));
  add.addEventListener('click', () => {
    const open = !box.classList.contains('is-editing');
    box.classList.toggle('is-editing', open);
    $('.tagform', box).hidden = !open;
    fillChips(box);
    if (open) $('.tagform input', box).focus();
    else $('.chip--add', box).focus();
  });
  chips.append(add);
}

function refreshChips() {
  listBox.querySelectorAll('.tags').forEach(fillChips);
}

function dropTag(t) {
  const used = Object.keys(state.works).filter((id) => tagAt(state.works[id].tags, t) >= 0);
  const question = used.length
    ? 'Тег «' + t.ru + '» стоит у работ: ' + used.length + '. Убрать его из списка и из этих работ?'
    : 'Убрать тег «' + t.ru + '» из списка?';
  if (!confirm(question)) return;
  used.forEach((id) => toggleTag(state.works[id], t));
  state.tagList = state.tagList.filter((x) => x !== t);
  refreshChips();
  changed();
}

function tagForm() {
  const form = el('form', 'tagform');
  form.hidden = true;
  form.noValidate = true;
  const en = el('input');
  en.type = 'text';
  en.placeholder = 'English, например Editing';
  en.setAttribute('aria-label', 'Новый тег на английском');
  const ru = el('input');
  ru.type = 'text';
  ru.placeholder = 'Русский, например Монтаж';
  ru.setAttribute('aria-label', 'Новый тег на русском');
  const go = el('button', 'btn', 'Добавить в список');
  go.type = 'submit';
  const msg = el('p', 'tagform__msg');
  msg.setAttribute('role', 'status');
  const note = el('p', 'tagform__note', 'Новый тег появится в списке у всех работ. Если язык один, можно заполнить одно поле. ' +
    'Чтобы убрать тег из списка, нажмите на него, пока открыта эта панель.');
  form.append(en, ru, go, msg, note);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = { en: en.value.trim() || ru.value.trim(), ru: ru.value.trim() || en.value.trim() };
    if (!t.en) { msg.textContent = 'Впишите название тега.'; en.focus(); return; }
    if (state.tagList.some((x) => sameTag(x, t))) { msg.textContent = 'Такой тег уже есть в списке.'; return; }
    state.tagList.push(t);
    en.value = '';
    ru.value = '';
    msg.textContent = 'Добавлен: ' + t.ru + '. Не забудьте сохранить.';
    refreshChips();
    changed();
    en.focus();
  });
  return form;
}

function iconButton(act, label, svgPath, onClick, disabled) {
  const b = el('button', 'icon');
  b.type = 'button';
  b.dataset.act = act;
  b.title = label;
  b.setAttribute('aria-label', label);
  b.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + svgPath + '"/></svg>';
  b.disabled = !!disabled;
  b.addEventListener('click', onClick);
  return b;
}

function move(id, delta) {
  const order = state.order[tab];
  const i = order.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= order.length) return;
  [order[i], order[j]] = [order[j], order[i]];
  renderList();
  changed();
  const card = listBox.querySelector('[data-id="' + id + '"]');
  const again = card && card.querySelector('[data-act="' + (delta < 0 ? 'up' : 'down') + '"]');
  const target = again && !again.disabled ? again : card && card.querySelector('[data-act="' + (delta < 0 ? 'down' : 'up') + '"]');
  if (target) target.focus();
  if (card) card.scrollIntoView({ block: 'nearest' });
}

function workCard(id, i, total) {
  const { work, group } = meta[id];
  const rec = state.works[id];
  const card = el('article', 'work work--' + group + (rec.hidden ? ' is-hidden' : ''));
  card.dataset.id = id;

  const pic = el('div', 'work__cover');
  const img = el('img');
  img.alt = '';
  img.loading = 'lazy';
  img.src = cover(work, group);
  pic.append(img);

  const body = el('div', 'work__body');
  const head = el('div', 'work__head');
  head.append(el('span', 'work__num', String(i + 1)), el('code', 'work__id', id), el('span', 'work__flag', 'скрыта'));
  const tools = el('div', 'work__tools');
  tools.append(
    iconButton('up', 'Выше', 'M8 13V3M4 7l4-4 4 4', () => move(id, -1), i === 0),
    iconButton('down', 'Ниже', 'M8 3v10M4 9l4 4 4-4', () => move(id, 1), i === total - 1),
    iconButton('reset', 'Вернуть исходные тексты', 'M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8', () => {
      if (!confirm('Вернуть тексты и теги этой работы к исходным?')) return;
      state.works[id] = Object.assign(JSON.parse(JSON.stringify(defaults[id])), { hidden: rec.hidden });
      card.replaceWith(workCard(id, i, total));
      changed();
    })
  );
  head.append(tools);

  const cols = el('div', 'work__cols');
  cols.append(column(rec, 'en'), column(rec, 'ru'));

  const hide = el('label', 'check');
  const box = el('input');
  box.type = 'checkbox';
  box.checked = rec.hidden;
  box.addEventListener('change', () => {
    rec.hidden = box.checked;
    card.classList.toggle('is-hidden', rec.hidden);
    changed();
  });
  hide.append(box, el('span', '', 'Скрыть с сайта'));

  body.append(head, cols, tagBlock(id), hide);
  card.append(pic, body);
  return card;
}

function renderList() {
  listBox.textContent = '';
  const order = state.order[tab];
  order.forEach((id, i) => listBox.append(workCard(id, i, order.length)));
}

/* ---------- Сохранение и выход ---------- */

async function save() {
  if (!ready || saving || !isDirty()) return;
  saving = true;
  changed();
  setStatus('Сохраняю…');
  try {
    const content = build();
    const token = await auth.currentUser.getIdToken();
    const res = await fetch(SC.DOC_URL + '?key=' + SC.FIREBASE.apiKey, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: {
        json: { stringValue: JSON.stringify(content) },
        updated: { timestampValue: new Date().toISOString() }
      } })
    });
    if (!res.ok) throw new Error(String(res.status));
    savedJSON = JSON.stringify(content);
    SC.remember(content); // открытый в этом браузере сайт сразу покажет новые тексты
    lastSaved = 'Сохранено в ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    saving = false;
    changed();
  } catch (err) {
    saving = false;
    changed();
    const code = String(err && err.message);
    setStatus(code === '403' ? 'Нет прав на запись: проверьте правила Firestore'
      : code === '401' ? 'Сессия устарела: выйдите и войдите снова'
      : 'Не сохранилось, попробуйте ещё раз', 'error');
  }
}

saveBtn.addEventListener('click', save);
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'ы' || e.code === 'KeyS')) {
    e.preventDefault();
    save();
  }
});

$('#logout').addEventListener('click', async () => {
  if (isDirty() && !confirm('Есть несохранённые правки. Выйти без сохранения?')) return;
  ready = false;
  lastSaved = '';
  await signOut(auth);
  location.href = '../';
});

window.addEventListener('beforeunload', (e) => {
  if (!isDirty()) return;
  e.preventDefault();
  e.returnValue = '';
});

/* ---------- Запуск: ждём, вошёл ли владелец ---------- */

onAuthStateChanged(auth, async (user) => {
  if (!user) { ready = false; showLogin(); return; }
  if (user.uid !== OWNER) {
    await signOut(auth);
    showLogin('У этого аккаунта нет доступа к админке.');
    return;
  }
  gate.hidden = true;
  appBox.hidden = false;
  await loadContent();
});
