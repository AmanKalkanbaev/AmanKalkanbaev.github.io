(() => {
  'use strict';

  const base = window.PORTFOLIO || {};
  const content = window.SiteContent || null; // правки из админки (js/content.js)
  let data = base;
  const GROUPS = ['motion', 'reels', 'graphics'];
  const root = document.documentElement;
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const ICON_PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M5 3.2v9.6c0 .5.5.8.9.5l7.4-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z"/></svg>';
  const ICON_ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 11.5l7-7M5.5 4.5h6v6"/></svg>';

  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => [...(scope || document).querySelectorAll(selector)];
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  const isLocked = () => root.classList.contains('is-locked');
  const scrollTo = (node) => node.scrollIntoView({ behavior: calm.matches ? 'auto' : 'smooth', block: 'start' });

  /* ---------- Языки ---------- */
  // Английский по умолчанию. Выбор посетителя запоминается; ссылка вида сайт/?lang=ru сразу открывает русский.

  const LANGS = ['en', 'ru'];
  const I18N = {
    en: {
      'meta.title': 'Aman Kalkanbaev: portfolio',
      'meta.desc': "Aman Kalkanbaev's portfolio: motion videos, reels and graphic design.",
      'nav.label': 'Page sections',
      'nav.motion': 'Motion',
      'nav.reels': 'Reels',
      'nav.graphics': 'Graphics',
      'nav.contact': 'Contacts',
      'name.label': 'Aman Kalkanbaev, about me',
      'about.exp': 'Experience',
      'about.exp.v': '5+ years',
      'about.design': 'Design',
      'about.design.v': 'posts, banners, presentations, event graphics',
      'about.anim': 'Animation',
      'about.anim.v': 'motion videos, animated reels',
      'about.video': 'Video',
      'about.video.v': 'writing scripts, supervising shoots, editing, VFX',
      'tools': 'Software and AI tools I use',
      'motion.h': 'Motion videos',
      'reels.h': 'Reels',
      'graphics.h': 'Graphic design',
      'contact.h': 'Contacts',
      'contact.arc': 'CONTACTS',
      'contact.email': 'Email',
      'top': 'Back to top',
      'badge.label': 'Message me on Telegram',
      'badge.tip': 'Message me',
      'close': 'Close',
      'prev': 'Previous work',
      'next': 'Next work',
      'of': 'of',
      'link.ig': 'Open on Instagram',
      'link.yt': 'Open on YouTube'
    },
    ru: {
      'meta.title': 'Aman Kalkanbaev: портфолио',
      'meta.desc': 'Портфолио Амана Калканбаева: моушен-ролики, рилсы и графика.',
      'nav.label': 'Разделы страницы',
      'nav.motion': 'Моушен',
      'nav.reels': 'Рилсы',
      'nav.graphics': 'Графика',
      'nav.contact': 'Контакты',
      'name.label': 'Aman Kalkanbaev, о себе',
      'about.exp': 'Опыт',
      'about.exp.v': 'больше 5 лет',
      'about.design': 'Дизайн',
      'about.design.v': 'посты, баннеры, презентации, оформление мероприятий',
      'about.anim': 'Анимация',
      'about.anim.v': 'моушен-ролики, анимированные рилсы',
      'about.video': 'Видео',
      'about.video.v': 'пишу сценарии, курирую съёмки, монтирую, добавляю VFX',
      'tools': 'Программы и нейросети, в которых работаю',
      'motion.h': 'Моушен-ролики',
      'reels.h': 'Рилсы',
      'graphics.h': 'Графика',
      'contact.h': 'Контакты',
      'contact.arc': 'КОНТАКТЫ',
      'contact.email': 'Почта',
      'top': 'Наверх',
      'badge.label': 'Написать в Telegram',
      'badge.tip': 'Написать',
      'close': 'Закрыть',
      'prev': 'Предыдущая работа',
      'next': 'Следующая работа',
      'of': 'из',
      'link.ig': 'Открыть в Instagram',
      'link.yt': 'Открыть на YouTube'
    }
  };

  let lang = (() => {
    const asked = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(asked)) return asked;
    try {
      const saved = localStorage.getItem('lang');
      if (LANGS.includes(saved)) return saved;
    } catch (e) { /* хранилище недоступно: просто английский */ }
    return 'en';
  })();

  const ui = (key) => I18N[lang][key] ?? I18N.en[key] ?? key;
  // Текст работы: строка или { en, ru }
  const tr = (v) => (v == null ? '' : typeof v === 'string' ? v : v[lang] || v.en || v.ru || '');
  const trList = (v) => {
    const list = v == null ? [] : Array.isArray(v) ? v : v[lang] || v.en || v.ru || [];
    return (Array.isArray(list) ? list : String(list).split(',')).map((s) => String(s).trim()).filter(Boolean);
  };

  function applyStatic() {
    root.lang = lang;
    document.title = ui('meta.title');
    const desc = $('meta[name="description"]');
    if (desc) desc.content = ui('meta.desc');
    $$('[data-i18n]').forEach((n) => { n.textContent = ui(n.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((n) => n.setAttribute('aria-label', ui(n.dataset.i18nAria)));
    $$('.lang [data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }

  function setLang(next) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem('lang', lang); } catch (e) { /* не критично */ }
    try {
      const url = new URL(location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', lang);
        history.replaceState(history.state, '', url);
      }
    } catch (e) { /* не критично */ }
    applyStatic();
    renderWorks();
    if (current) fillText(index.get(current.work.id) || current);
  }

  $$('.lang [data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------- Карточки работ ---------- */

  const index = new Map(); // id работы -> { work, group, i, list }

  function coverOf(work, group) {
    if (work.cover) return work.cover;
    if (group === 'motion') return 'assets/video/' + (work.yt || work.id) + '.webp';
    return 'assets/reels/' + (work.ig || work.id) + '.webp';
  }

  function preview(work, group) {
    if (group === 'motion') return { src: coverOf(work, group), w: 1280, h: 720, ratio: 16 / 9 };
    if (group === 'reels') return { src: coverOf(work, group), w: 540, h: 960, ratio: 9 / 16 };
    const real = work.w / work.h;
    const ratio = Math.min(2.6, Math.max(0.62, real)); // очень длинные и очень высокие макеты в плитке подрезаем
    return { src: 'assets/graphics/' + work.file + '-sm.webp', w: work.w, h: work.h, ratio, cropped: ratio !== real };
  }

  function card(work, group) {
    const p = preview(work, group);
    const a = el('a', 'card');
    a.href = '#' + work.id;

    const media = el('span', 'card__media');
    media.style.setProperty('--ar', String(p.ratio));
    const img = el('img');
    img.alt = '';
    img.width = p.w;
    img.height = p.h;
    img.decoding = 'async';
    img.loading = group === 'motion' ? 'eager' : 'lazy';
    if (p.cropped) img.style.objectPosition = 'center top';
    img.src = p.src;
    media.append(img);
    if (group !== 'graphics') {
      const mark = el('span', 'card__mark');
      mark.innerHTML = ICON_PLAY;
      media.append(mark);
    }

    a.append(media, el('span', 'card__title', tr(work.title)));
    const note = tr(work.note);
    if (note) a.append(el('span', 'card__note', note));
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault();
      open(work.id, true);
    });
    return a;
  }

  function renderWorks() {
    index.clear();
    GROUPS.forEach((group) => {
      const host = $('[data-group="' + group + '"]');
      if (!host) return;
      const section = host.closest('section');
      const list = (Array.isArray(data[group]) ? data[group] : []).filter((w) => w && w.id);
      host.textContent = '';
      section.hidden = !list.length;
      const count = $('.count', section);
      if (count) count.textContent = list.length ? String(list.length) : '';
      list.forEach((work, i) => {
        index.set(work.id, { work, group, i, list });
        host.append(card(work, group));
      });
    });
  }

  /* ---------- Контакты ---------- */

  function contacts() {
    const c = data.contacts || {};
    const rows = [];
    const trim = (v) => String(v || '').trim();
    const handle = (v, prefix) => trim(v).replace(prefix, '').replace(/\/+$/, '');

    if (trim(c.telegram)) {
      const name = handle(c.telegram, /^(https?:\/\/)?(t\.me\/)?@?/i);
      rows.push({ label: 'Telegram', value: '@' + name, href: 'https://t.me/' + name });
    }
    if (trim(c.whatsapp)) {
      rows.push({ label: 'WhatsApp', value: trim(c.whatsapp), href: 'https://wa.me/' + trim(c.whatsapp).replace(/\D/g, '') });
    }
    if (trim(c.instagram)) {
      const name = handle(c.instagram, /^(https?:\/\/)?(www\.)?(instagram\.com\/)?@?/i);
      rows.push({ label: 'Instagram', value: '@' + name, href: 'https://www.instagram.com/' + name + '/' });
    }
    if (trim(c.email)) {
      rows.push({ key: 'contact.email', value: trim(c.email), href: 'mailto:' + trim(c.email) });
    }
    if (!rows.length) return;

    const host = $('#contact-links');
    rows.forEach((row) => {
      const li = el('li');
      const a = el('a');
      a.href = row.href;
      if (!row.href.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener'; }
      const label = el('span', 'contacts__label', row.label || '');
      if (row.key) label.dataset.i18n = row.key;
      const arrow = el('span', 'contacts__arrow');
      arrow.innerHTML = ICON_ARROW;
      a.append(label, el('span', 'contacts__value', row.value), arrow);
      li.append(a);
      host.append(li);
    });
    $('#contact').hidden = false;

    // Аватарка ведёт в Telegram, надпись по кругу над ней листает к контактам
    const badge = $('#badge');
    const tg = rows.find((r) => r.label === 'Telegram') || rows[0];
    badge.href = tg.href;
    if (!tg.href.startsWith('mailto:')) { badge.target = '_blank'; badge.rel = 'noopener'; }
    if (tg.label !== 'Telegram') badge.removeAttribute('data-i18n-aria');
    $('#reach-label').addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo($('#contact'));
    });
    $('#reach').hidden = false;
  }

  /* ---------- Навигация слева ---------- */
  // Линии строятся сами из разделов с атрибутом data-nav: новый раздел появится в навигации без правок здесь.
  // Подсвечен раздел, верх которого прошёл 40% высоты экрана; в самом низу страницы всегда последний.

  function rail() {
    const nav = $('#rail');
    if (!nav) return;
    const sections = $$('main > section[data-nav]').filter((s) => !s.hidden && s.id);
    const items = sections.map((section) => {
      const key = 'nav.' + section.dataset.nav;
      const a = el('a', 'rail__item');
      a.href = '#' + section.id;
      a.dataset.i18nAria = key;
      const tip = el('span', 'rail__tip');
      tip.dataset.i18n = key;
      a.append(el('span', 'rail__line'), tip);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        scrollTo(section);
      });
      nav.append(a);
      return a;
    });

    let ticking = false;
    function pick() {
      ticking = false;
      let active = null;
      if (window.scrollY + window.innerHeight >= root.scrollHeight - 4) {
        active = sections[sections.length - 1];
      } else {
        const line = window.innerHeight * 0.4;
        sections.forEach((s) => { if (s.getBoundingClientRect().top <= line) active = s; });
      }
      items.forEach((a, i) => a.classList.toggle('is-active', sections[i] === active));
    }
    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(pick);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    pick();
  }

  /* ---------- Имя: блик и раскрытие сводки ---------- */

  (function nameToggle() {
    const button = $('#name');
    const about = $('#about');
    if (!button || !about) return;

    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(opening));
      about.classList.toggle('is-open', opening);
      about.inert = !opening;
    });
  })();

  /* ---------- Живое свечение сверху ---------- */

  (function aurora() {
    const field = $('#aurora');
    if (!field) return;
    const blobs = $$('.blob', field);

    // Каждое пятно плавает по своей траектории и тянется к курсору.
    // drag: насколько медленно пятно догоняет курсор; разная скорость у пятен даёт ощущение вязкой жидкости.
    const motion = [
      { ax: 0.10, ay: 0.16, fx: 0.00011, fy: 0.00017, p: 0.0, pull: 0.30, drag: 0.010, breathe: 0.07 },
      { ax: 0.12, ay: 0.12, fx: 0.00009, fy: 0.00013, p: 2.1, pull: 0.18, drag: 0.006, breathe: 0.09 },
      { ax: 0.09, ay: 0.18, fx: 0.00013, fy: 0.00010, p: 4.2, pull: 0.34, drag: 0.013, breathe: 0.06 },
      { ax: 0.14, ay: 0.10, fx: 0.00016, fy: 0.00012, p: 1.3, pull: 0.42, drag: 0.008, breathe: 0.1 }
    ];
    const lag = blobs.map(() => ({ x: 0, y: 0 }));

    const pointer = { x: 0, y: 0, inside: false };
    let running = false;
    let onScreen = true;
    let raf = 0;
    let started = 0;

    function frame(now) {
      raf = 0;
      if (!running) return;
      const t = now - started;
      const W = field.clientWidth;
      const H = field.clientHeight;

      const tx = pointer.inside ? pointer.x - W / 2 : 0;
      const ty = pointer.inside ? pointer.y - H * 0.3 : 0;

      blobs.forEach((blob, i) => {
        const m = motion[i % motion.length];
        const l = lag[i];
        l.x += (tx * m.pull - l.x) * m.drag;
        l.y += (ty * m.pull - l.y) * m.drag;
        const dx = Math.sin(t * m.fx + m.p) * W * m.ax + l.x;
        const dy = Math.cos(t * m.fy + m.p) * H * m.ay + l.y;
        const s = 1 + Math.sin(t * 0.00025 + m.p) * m.breathe;
        blob.style.transform = 'translate(-50%, -50%) translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
      });
      raf = requestAnimationFrame(frame);
    }

    function update() {
      const should = onScreen && !document.hidden && !isLocked() && !calm.matches;
      if (should && !running) {
        running = true;
        if (!started) started = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = field.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = pointer.y >= 0 && pointer.y <= r.height;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { pointer.inside = false; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        onScreen = entries[0].isIntersecting;
        update();
      }).observe(field);
    }
    document.addEventListener('visibilitychange', update);
    new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['class'] });
    if (calm.addEventListener) calm.addEventListener('change', update);
    update();
  })();

  /* ---------- Лента программ ---------- */

  (function tools() {
    const box = $('.tools');
    const track = $('.tools__track');
    if (!box || !track || !track.firstElementChild) return;
    const list = track.firstElementChild;

    const start = () => {
      box.classList.add('is-live');
      const width = list.getBoundingClientRect().width;
      if (!width) return;
      const copies = Math.max(2, Math.ceil((window.innerWidth * 2) / width));
      while (track.children.length < copies) {
        const copy = list.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        track.append(copy);
      }
      box.style.setProperty('--marquee-shift', -width + 'px');
      box.style.setProperty('--marquee-time', Math.round(width / 42) + 's');
    };
    start();
    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(start, 200);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);

    // Линза: под курсором пункты (иконка вместе с подписью) крупнее всех и раздвигают соседей,
    // к краям линзы плавно возвращаются к обычному размеру. Как док в macOS.
    if (!finePointer.matches) return;
    const SIGMA = 120; // ширина линзы, px
    const MAX = 0.6;   // пункт прямо под курсором в 1,6 раза больше обычного
    const EASE = 0.2;  // мягкость: как быстро пункты догоняют нужный размер
    let items = [];
    let px = null;
    let raf = 0;

    // Запоминаем положение каждого пункта внутри ленты без наших трансформаций
    function measureItems() {
      const lis = $$('.tools__list li', track);
      lis.forEach((li) => { li.style.transform = ''; });
      const left = track.getBoundingClientRect().left;
      items = lis.map((li) => {
        const r = li.getBoundingClientRect();
        return { li, off: r.left - left + r.width / 2, w: r.width, s: 1, x: 0 };
      });
    }

    function frame() {
      raf = 0;
      const left = track.getBoundingClientRect().left;
      const targets = items.map((it) => {
        if (px === null) return 1;
        const d = left + it.off - px;
        return 1 + MAX * Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
      });
      // Каждый увеличенный пункт сдвигает соседей справа на половину своего прироста вправо, слева влево
      const growth = items.map((it, i) => it.w * (targets[i] - 1));
      const total = growth.reduce((a, b) => a + b, 0);
      let before = 0;
      let moving = false;
      items.forEach((it, i) => {
        const shift = before - (total - before - growth[i]);
        const targetX = shift / 2;
        before += growth[i];
        it.s += (targets[i] - it.s) * EASE;
        it.x += (targetX - it.x) * EASE;
        if (Math.abs(it.s - 1) < 0.002 && Math.abs(it.x) < 0.3 && px === null) {
          it.s = 1;
          it.x = 0;
          it.li.style.transform = '';
          return;
        }
        moving = true;
        it.li.style.transform = 'translateX(' + it.x.toFixed(2) + 'px) scale(' + it.s.toFixed(4) + ')';
      });
      if (moving || px !== null) raf = requestAnimationFrame(frame);
      else box.classList.remove('is-lens');
    }

    box.addEventListener('pointerenter', (e) => {
      if (!items.length || items.length !== $$('.tools__list li', track).length) measureItems();
      box.classList.add('is-lens');
      px = e.clientX;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    box.addEventListener('pointermove', (e) => {
      px = e.clientX;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    box.addEventListener('pointerleave', () => {
      px = null;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    window.addEventListener('resize', () => { items = []; });
  })();

  /* ---------- Просмотр работы ---------- */

  const viewer = $('#viewer');
  const stage = $('#viewer-stage');
  const vTitle = $('#viewer-title');
  const vNote = $('#viewer-note');
  const vTags = $('#viewer-tags');
  const vLink = $('#viewer-link');
  const vClose = $('#viewer-close');
  const vPrev = $('#viewer-prev');
  const vNext = $('#viewer-next');

  // Телефонам и экономному режиму отдаём лёгкую версию 720p
  const liteQuery = window.matchMedia('(max-width: 760px), (max-height: 500px)');
  function wantsLite() {
    const net = navigator.connection;
    return liteQuery.matches || !!(net && (net.saveData || /(^|-)2g|3g/.test(net.effectiveType || '')));
  }
  const mediaSrc = (work) => 'assets/media/' + (work.video || work.id) + (wantsLite() ? '-720' : '') + '.mp4';

  let current = null;
  let video = null;
  let lastFocus = null;

  function stopVideo() {
    if (!video) return;
    video.pause();
    video.removeAttribute('src'); // обрываем загрузку, чтобы не тратить трафик
    video.load();
    video = null;
  }

  function fillText(hit) {
    const { work, group, i, list } = hit;
    vTitle.textContent = tr(work.title);
    vNote.textContent = [(i + 1) + ' ' + ui('of') + ' ' + list.length, tr(work.note)].filter(Boolean).join(' · ');
    vTags.textContent = '';
    const tags = trList(work.tags);
    tags.forEach((tag) => vTags.append(el('span', 'tag', tag)));
    vTags.hidden = !tags.length;
    vPrev.disabled = vNext.disabled = list.length < 2;

    if (group !== 'graphics' && work.ig) {
      vLink.href = 'https://www.instagram.com/' + (work.kind || 'reel') + '/' + work.ig + '/';
      vLink.textContent = ui('link.ig');
      vLink.hidden = false;
    } else if (group !== 'graphics' && work.yt) {
      vLink.href = 'https://youtu.be/' + work.yt;
      vLink.textContent = ui('link.yt');
      vLink.hidden = false;
    } else {
      vLink.hidden = true;
    }
    const img = $('.viewer__img', stage);
    if (img) img.alt = [tr(work.title), tr(work.note)].filter(Boolean).join('. ');
  }

  function show(hit) {
    current = hit;
    const { work, group } = hit;
    stopVideo();
    stage.textContent = '';

    if (group === 'graphics') {
      const img = el('img', 'viewer__img');
      img.width = work.w;
      img.height = work.h;
      img.src = 'assets/graphics/' + work.file + '.webp';
      stage.append(img);
      fillText(hit);
      return;
    }
    fillText(hit);

    // Своё видео: стартует сразу, крутится по кругу без перезапуска плеера
    const box = el('div', 'viewer__media is-loading viewer__media--' + (group === 'reels' ? 'tall' : 'wide'));
    const cover = coverOf(work, group);
    box.style.backgroundImage = 'url("' + cover + '")';
    const v = document.createElement('video');
    v.poster = cover;
    v.loop = true;
    v.controls = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.setAttribute('playsinline', '');
    v.setAttribute('controlslist', 'nodownload');
    v.setAttribute('aria-label', tr(work.title));
    const loaded = () => box.classList.remove('is-loading');
    v.addEventListener('playing', loaded);
    v.addEventListener('pause', loaded);
    v.addEventListener('error', loaded);
    v.addEventListener('waiting', () => { if (!v.paused) box.classList.add('is-loading'); });
    v.src = mediaSrc(work);
    box.append(v, el('span', 'viewer__spin'));
    stage.append(box);
    video = v;

    // Со звуком, если браузер разрешает; иначе без звука (звук включается в плеере)
    const attempt = v.play();
    if (attempt && attempt.catch) {
      attempt.catch(() => {
        if (video !== v) return;
        v.muted = true;
        v.play().catch(() => { if (video === v) loaded(); });
      });
    }
  }

  function open(id, push) {
    const hit = index.get(id);
    if (!hit) return;
    const wasClosed = viewer.hidden;
    if (wasClosed) {
      lastFocus = document.activeElement;
      viewer.hidden = false;
      root.classList.add('is-locked');
      requestAnimationFrame(() => viewer.classList.add('is-open'));
    }
    try {
      if (wasClosed && push) history.pushState({ viewer: true }, '', '#' + id);
      else history.replaceState(history.state, '', '#' + id);
    } catch (e) { /* адрес не меняем, просмотр всё равно работает */ }
    show(hit);
    if (wasClosed) vClose.focus();
  }

  function shut() {
    if (viewer.hidden) return;
    stopVideo();
    stage.textContent = '';
    current = null;
    viewer.classList.remove('is-open');
    viewer.hidden = true;
    root.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function close() {
    if (viewer.hidden) return;
    if (history.state && history.state.viewer) { history.back(); return; } // закрытие придёт через popstate
    shut();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* не критично */ }
  }

  function step(delta) {
    if (!current || current.list.length < 2) return;
    const { list, i } = current;
    open(list[(i + delta + list.length) % list.length].id, false);
  }

  vClose.addEventListener('click', close);
  vPrev.addEventListener('click', () => step(-1));
  vNext.addEventListener('click', () => step(1));
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer || e.target === stage) close();
  });

  document.addEventListener('keydown', (e) => {
    if (viewer.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    const inVideo = e.target && e.target.tagName === 'VIDEO'; // там стрелки перематывают ролик
    if (e.key === 'ArrowLeft' && !inVideo) step(-1);
    if (e.key === 'ArrowRight' && !inVideo) step(1);
    if (e.key === 'Tab') {
      const focusable = $$('button:not([disabled]), a[href], video', viewer).filter((n) => !n.hidden && n.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Листание макетов свайпом
  let swipeX = null;
  let swipeY = 0;
  stage.addEventListener('pointerdown', (e) => { swipeX = e.clientX; swipeY = e.clientY; });
  stage.addEventListener('pointerup', (e) => {
    if (swipeX === null || !current || current.group !== 'graphics') { swipeX = null; return; }
    const dx = e.clientX - swipeX;
    const dy = e.clientY - swipeY;
    swipeX = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  });

  window.addEventListener('popstate', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (history.state && history.state.viewer && index.has(id)) open(id, false);
    else shut();
  });
  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (index.has(id) && (!current || current.work.id !== id)) open(id, false);
  });

  /* ---------- Вход в админку: двойной клик по подписи внизу ---------- */

  (function secret() {
    const sign = $('#sign');
    if (!sign) return;
    let last = 0;
    sign.addEventListener('click', () => {
      const now = Date.now();
      if (now - last < 450) location.href = 'admin/';
      last = now;
    });
  })();

  /* ---------- Запуск ---------- */

  contacts();
  applyStatic();

  let started = false;
  function start() {
    if (started) return;
    started = true;
    renderWorks();
    rail();
    applyStatic();
    // Ссылка вида сайт/#id-работы сразу открывает эту работу
    const wanted = decodeURIComponent(location.hash.slice(1));
    if (index.has(wanted)) open(wanted, false);
  }

  // Правки из админки: прошлые берём из памяти браузера и показываем сразу,
  // свежие догружаем. Кто зашёл впервые, ждёт их не дольше 1,2 секунды.
  if (!content) {
    start();
  } else {
    const saved = content.cached();
    if (saved) {
      data = content.apply(base, saved);
      start();
    } else {
      setTimeout(start, 1200);
    }
    content.load().then((fresh) => {
      content.remember(fresh);
      if (JSON.stringify(fresh) === JSON.stringify(saved)) { start(); return; }
      data = content.apply(base, fresh);
      if (!started) { start(); return; }
      renderWorks();
      if (current) {
        const hit = index.get(current.work.id);
        if (hit) { current = hit; fillText(hit); }
      }
    }).catch(() => start());
  }
})();
