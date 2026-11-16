// Правки из админки. Хранятся в Firebase (Firestore, документ site/content) поверх js/works.js:
// works.js остаётся основой, админка меняет названия, подписи, теги, порядок и скрывает работы.
// Новая работа, добавленная в works.js, появится на сайте сама (в конце своего раздела).
(() => {
  'use strict';

  // Настройки веб-приложения Firebase. Это не секрет: доступ на запись закрыт правилами Firestore.
  const FIREBASE = {
    apiKey: 'AIzaSyDSJKyoXnmFhSPnmFHPFEW9VExdYduAnOo',
    authDomain: 'portfolio-896bc.firebaseapp.com',
    projectId: 'portfolio-896bc',
    storageBucket: 'portfolio-896bc.firebasestorage.app',
    messagingSenderId: '10070012523',
    appId: '1:10070012523:web:dd3e43367911413ae8772e'
  };
  const DOC_URL = 'https://firestore.googleapis.com/v1/projects/' + FIREBASE.projectId +
    '/databases/(default)/documents/site/content';
  const GROUPS = ['motion', 'reels', 'graphics'];
  const FIELDS = ['title', 'note', 'tags', 'hidden'];
  const CACHE_KEY = 'content';

  // Работы из works.js с наложенными правками и в нужном порядке.
  // withHidden: оставить скрытые работы (нужно админке).
  function apply(base, content, withHidden) {
    const out = Object.assign({}, base);
    const works = (content && content.works) || {};
    const order = (content && content.order) || {};
    GROUPS.forEach((group) => {
      let list = (Array.isArray(base[group]) ? base[group] : []).filter((w) => w && w.id).map((w) => {
        const merged = Object.assign({}, w);
        const edit = works[w.id];
        if (edit && typeof edit === 'object') FIELDS.forEach((k) => { if (k in edit) merged[k] = edit[k]; });
        return merged;
      });
      const ids = Array.isArray(order[group]) ? order[group] : null;
      if (ids) {
        const pos = new Map(ids.map((id, i) => [id, i]));
        list = list
          .map((w, i) => ({ w, rank: pos.has(w.id) ? pos.get(w.id) : ids.length + i }))
          .sort((a, b) => a.rank - b.rank)
          .map((x) => x.w);
      }
      out[group] = withHidden ? list : list.filter((w) => !w.hidden);
    });
    return out;
  }

  function cached() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function remember(content) {
    try {
      if (content) localStorage.setItem(CACHE_KEY, JSON.stringify(content));
      else localStorage.removeItem(CACHE_KEY);
    } catch (e) { /* хранилище недоступно: просто без кэша */ }
  }

  // null, если правок ещё нет; ошибка, если база недоступна
  async function load() {
    const res = await fetch(DOC_URL + '?key=' + FIREBASE.apiKey, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Firestore ' + res.status);
    const doc = await res.json();
    const raw = doc.fields && doc.fields.json && doc.fields.json.stringValue;
    const content = raw ? JSON.parse(raw) : null;
    return content && typeof content === 'object' ? content : null;
  }

  window.SiteContent = { FIREBASE, DOC_URL, GROUPS, apply, cached, remember, load };
})();
