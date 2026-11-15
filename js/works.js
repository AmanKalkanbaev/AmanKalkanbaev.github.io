// Данные портфолио. Новая работа = новая строка в нужном списке.
// После правки этого файла сайт нужно заново отправить на GitHub.
window.PORTFOLIO = {
  // Контакты. Заполните то, что нужно показать: пустые поля на сайте не появляются.
  // telegram и instagram: имя без @, whatsapp: номер с кодом страны (как написан, так и показывается), email: адрес.
  contacts: { telegram: "thestillman", whatsapp: "+996 553 678 608", instagram: "", email: "kalkanbaev5@gmail.com" },

  // Горизонтальные ролики с YouTube. yt: код из ссылки youtu.be/КОД
  motion: [
    { id: "growave", yt: "SC030amqSKQ", title: "Growave", note: "Презентационный ролик", tag: "моушен" },
    { id: "it4biz-motion", yt: "Ctj-f4kdfZA", title: "IT4BIZ", note: "Моушен-ролик", tag: "моушен" },
    { id: "guarantee-fund", yt: "kJUZyoB4r2I", title: "Гарантийный фонд", note: "Моушен-ролик", tag: "моушен" }
  ],

  // Рилсы из Instagram. ig: код из ссылки, kind: "reel" или "p" (как в ссылке).
  // external: true ставится, если Instagram не разрешает играть рилс на чужом сайте:
  // тогда вместо плеера показывается обложка и кнопка «Смотреть в Instagram».
  reels: [
    { id: "royal-may", ig: "DZVCQVcozYt", kind: "p", title: "Стройка: май", note: "Видеоотчёт с площадки", tag: "Royal ololo AkJol" },
    { id: "royal-february", ig: "DVgZH-AiOxh", kind: "p", title: "Стройка: февраль", note: "Видеоотчёт с площадки", tag: "Royal ololo AkJol" },
    { id: "royal-why", ig: "DGQVlmWIFla", kind: "reel", title: "Зачем покупать квартиру", note: "Преимущества Royal ololo AkJol", tag: "Royal ololo AkJol", external: true },
    { id: "royal-september", ig: "DeGyilhIKCB", kind: "reel", title: "Стройка: сентябрь", note: "Видеоотчёт с площадки", tag: "Royal ololo AkJol" },
    { id: "overdressed-party", ig: "DSSb1JQDXlG", kind: "reel", title: "Overdressed New Year Party", note: "Анонс новогодней вечеринки", tag: "ololo" },
    { id: "ololo-bombers", ig: "DEhLm4tyA2X", kind: "reel", title: "Бомберы ololo", note: "Мерч в креативных хабах", tag: "ololo" },
    { id: "royal-november", ig: "DRzZuEkCC_e", kind: "p", title: "Стройка: ноябрь", note: "Видеоотчёт с площадки", tag: "Royal ololo AkJol" },
    { id: "switchers", ig: "DNDj2r4M0Vg", kind: "reel", title: "Бизнес-лагерь для свитчеров", note: "Анонс лагеря на Иссык-Куле", tag: "ololo.pro" },
    { id: "ololo-team", ig: "DIOdl44tWEY", kind: "reel", title: "Ищем в команду", note: "Вакансии SMM и видеографа", tag: "ololo" },
    { id: "royal-invest", ig: "DGXcwwpooYR", kind: "reel", title: "Инвестиции в Royal ololo", note: "Про вложения в недвижимость", tag: "Royal ololo AkJol" }
  ],

  // Статичная графика. file: имя картинки без расширения (как его делает portfolio/build_assets.py),
  // w и h: размер исходника в пикселях.
  graphics: [
    { id: "ibm-ai-day-presswall", file: "greenlight-ibm-ai-presswall", title: "IBM AI and Automation Day", note: "Пресс-волл", tag: "ивент", w: 5241, h: 3145 },
    { id: "ibm-ai-day-rollup", file: "greenlight-ibm-ai-rollup", title: "IBM AI and Automation Day", note: "Ролл-ап", tag: "ивент", w: 1258, h: 3145 },
    { id: "ibm-ai-day-desk", file: "greenlight-ibm-ai-registration-desk", title: "IBM AI and Automation Day", note: "Стойка регистрации", tag: "ивент", w: 3382, h: 944 },
    { id: "ibm-ai-day-post", file: "instagram-post-1", title: "IBM AI and Automation Day", note: "Пост для Instagram", tag: "пост", w: 1080, h: 1350 },
    { id: "it4biz-identity", file: "it4biz-2501-newcolors", title: "IT4BIZ", note: "Фирменный стиль", tag: "айдентика", w: 2880, h: 2532 },
    { id: "it4biz-speaker", file: "it4biz-speacker", title: "IT4BIZ", note: "Карточка спикера", tag: "ивент", w: 1920, h: 1080 },
    { id: "urbantech-banner", file: "urbantech-banner", title: "UrbanTech", note: "Баннер хакатона", tag: "баннер", w: 3104, h: 2328 },
    { id: "greenlight-creatio-banner", file: "learand-dinner-banner", title: "GreenLight × Creatio", note: "Баннер бизнес-ужина", tag: "баннер", w: 3104, h: 1746 },
    { id: "greenlight-slide", file: "slide-1", title: "GreenLight", note: "Слайд презентации", tag: "презентация", w: 1920, h: 1080 },
    { id: "undp-cover", file: "thumbnail", title: "UNDP", note: "Обложка ролика с инфографикой", tag: "обложка", w: 1920, h: 1080 },
    { id: "ololo-creative-park", file: "ololocity-creativeindustries-1204", title: "Парк креативных индустрий", note: "Пост для ololo", tag: "пост", w: 1080, h: 1350 },
    { id: "ololo-independence", file: "ololocity-independence-2809", title: "День независимости", note: "Пост для ololo", tag: "пост", w: 1080, h: 1350 },
    { id: "ololo-infotour", file: "ololocity-infotour-0506", title: "Инфотур по хабам", note: "Пост для ololo", tag: "пост", w: 1080, h: 1350 },
    { id: "ololo-podcast", file: "ololocity-podcast-0602", title: "Подкаст ololo", note: "Обложка выпуска", tag: "обложка", w: 1080, h: 1350 },
    { id: "ololo-planet-preview", file: "ololoplanet-preview-1", title: "ololo Planet", note: "Превью видео", tag: "обложка", w: 1920, h: 1080 },
    { id: "akjol-hot-prices", file: "oaj-burningakcia-2606", title: "Горящие цены", note: "Акция ololo AkJol", tag: "пост", w: 1080, h: 1350 },
    { id: "akjol-first-friday", file: "oaj-firstfriday-0604", title: "First Friday", note: "Афиша ololo AkJol", tag: "афиша", w: 1080, h: 1350 }
  ]
};
