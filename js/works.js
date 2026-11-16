// Данные портфолио. Новая работа = новая строка в нужном списке.
// После правки этого файла сайт нужно заново отправить на GitHub.
//
// Тексты на двух языках: { en: "...", ru: "..." }. Если текст одинаковый, можно написать просто строку.
// tags: роли в работе, тоже на двух языках.
// Видео лежат в assets/media/<id>.mp4 (их делает portfolio/build_videos.py).
window.PORTFOLIO = {
  // Контакты. Пустые поля на сайте не появляются.
  // telegram и instagram: имя без @, whatsapp: номер с кодом страны, email: адрес.
  contacts: { telegram: "thestillman", whatsapp: "+996 553 678 608", instagram: "", email: "kalkanbaev5@gmail.com" },

  // Горизонтальные ролики. yt: код ролика на YouTube (для обложки и ссылки).
  motion: [
    { id: "growave", yt: "SC030amqSKQ", title: "Growave",
      note: { en: "Presentation video", ru: "Презентационный ролик" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "it4biz-motion", yt: "Ctj-f4kdfZA", title: "IT4BIZ",
      note: { en: "Motion video", ru: "Моушен-ролик" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "guarantee-fund", yt: "kJUZyoB4r2I", title: { en: "Guarantee Fund", ru: "Гарантийный фонд" },
      note: { en: "Motion video", ru: "Моушен-ролик" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } }
  ],

  // Вертикальные ролики. ig: код поста в Instagram (для обложки и ссылки), kind: "reel" или "p", как в ссылке.
  // Без ig обложка берётся из assets/reels/<id>.webp.
  reels: [
    { id: "royal-may", ig: "DZVCQVcozYt", kind: "p", title: { en: "Construction: May", ru: "Стройка: май" },
      note: { en: "Construction site update", ru: "Видеоотчёт с площадки" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "royal-february", ig: "DVgZH-AiOxh", kind: "p", title: { en: "Construction: February", ru: "Стройка: февраль" },
      note: { en: "Construction site update", ru: "Видеоотчёт с площадки" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "royal-why", ig: "DGQVlmWIFla", kind: "reel", title: { en: "Why buy an apartment", ru: "Зачем покупать квартиру" },
      note: { en: "Benefits of Royal ololo AkJol", ru: "Преимущества Royal ololo AkJol" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "royal-september", ig: "DeGyilhIKCB", kind: "reel", title: { en: "Construction: September", ru: "Стройка: сентябрь" },
      note: { en: "Construction site update", ru: "Видеоотчёт с площадки" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "overdressed-party", ig: "DSSb1JQDXlG", kind: "reel", title: "Overdressed New Year Party",
      note: { en: "New Year party announcement", ru: "Анонс новогодней вечеринки" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "ololo-bombers", ig: "DEhLm4tyA2X", kind: "reel", title: { en: "ololo bombers", ru: "Бомберы ololo" },
      note: { en: "Merch in the creative hubs", ru: "Мерч в креативных хабах" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "royal-november", ig: "DRzZuEkCC_e", kind: "p", title: { en: "Construction: November", ru: "Стройка: ноябрь" },
      note: { en: "Construction site update", ru: "Видеоотчёт с площадки" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "switchers", ig: "DNDj2r4M0Vg", kind: "reel", title: { en: "Business camp for career switchers", ru: "Бизнес-лагерь для свитчеров" },
      note: { en: "Camp announcement, Issyk-Kul", ru: "Анонс лагеря на Иссык-Куле" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "ololo-team", ig: "DIOdl44tWEY", kind: "reel", title: { en: "Join the team", ru: "Ищем в команду" },
      note: { en: "SMM and videographer openings", ru: "Вакансии SMM и видеографа" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "royal-invest", ig: "DGXcwwpooYR", kind: "reel", title: { en: "Investing in Royal ololo", ru: "Инвестиции в Royal ololo" },
      note: { en: "About real estate investment", ru: "Про вложения в недвижимость" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } },
    { id: "ololo-family", title: "ololo Family",
      note: { en: "Reel for ololo", ru: "Рилс для ololo" },
      tags: { en: ["Editing", "Animation"], ru: ["Монтаж", "Анимация"] } }
  ],

  // Статичная графика. file: имя картинки без расширения (как его делает portfolio/build_assets.py),
  // w и h: размер исходника в пикселях.
  graphics: [
    { id: "ibm-ai-day-presswall", file: "greenlight-ibm-ai-presswall", w: 5241, h: 3145, title: "IBM AI and Automation Day",
      note: { en: "Press wall", ru: "Пресс-волл" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "ibm-ai-day-rollup", file: "greenlight-ibm-ai-rollup", w: 1258, h: 3145, title: "IBM AI and Automation Day",
      note: { en: "Roll-up banner", ru: "Ролл-ап" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "ibm-ai-day-desk", file: "greenlight-ibm-ai-registration-desk", w: 3382, h: 944, title: "IBM AI and Automation Day",
      note: { en: "Registration desk", ru: "Стойка регистрации" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "ibm-ai-day-post", file: "instagram-post-1", w: 1080, h: 1350, title: "IBM AI and Automation Day",
      note: { en: "Instagram post", ru: "Пост для Instagram" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "it4biz-identity", file: "it4biz-2501-newcolors", w: 2880, h: 2532, title: "IT4BIZ",
      note: { en: "Brand identity", ru: "Фирменный стиль" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "it4biz-speaker", file: "it4biz-speacker", w: 1920, h: 1080, title: "IT4BIZ",
      note: { en: "Speaker card", ru: "Карточка спикера" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "urbantech-banner", file: "urbantech-banner", w: 3104, h: 2328, title: "UrbanTech",
      note: { en: "Hackathon banner", ru: "Баннер хакатона" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "greenlight-creatio-banner", file: "learand-dinner-banner", w: 3104, h: 1746, title: "GreenLight × Creatio",
      note: { en: "Business dinner banner", ru: "Баннер бизнес-ужина" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "greenlight-slide", file: "slide-1", w: 1920, h: 1080, title: "GreenLight",
      note: { en: "Presentation slide", ru: "Слайд презентации" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "undp-cover", file: "thumbnail", w: 1920, h: 1080, title: "UNDP",
      note: { en: "Cover for an infographic video", ru: "Обложка ролика с инфографикой" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "ololo-creative-park", file: "ololocity-creativeindustries-1204", w: 1080, h: 1350, title: { en: "Creative Industries Park", ru: "Парк креативных индустрий" },
      note: { en: "Post for ololo", ru: "Пост для ololo" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "ololo-independence", file: "ololocity-independence-2809", w: 1080, h: 1350, title: { en: "Independence Day", ru: "День независимости" },
      note: { en: "Post for ololo", ru: "Пост для ololo" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "ololo-infotour", file: "ololocity-infotour-0506", w: 1080, h: 1350, title: { en: "Hub info tour", ru: "Инфотур по хабам" },
      note: { en: "Post for ololo", ru: "Пост для ololo" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "ololo-podcast", file: "ololocity-podcast-0602", w: 1080, h: 1350, title: { en: "ololo Podcast", ru: "Подкаст ololo" },
      note: { en: "Episode cover", ru: "Обложка выпуска" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "ololo-planet-preview", file: "ololoplanet-preview-1", w: 1920, h: 1080, title: "ololo Planet",
      note: { en: "Video preview", ru: "Превью видео" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "akjol-hot-prices", file: "oaj-burningakcia-2606", w: 1080, h: 1350, title: { en: "Hot prices", ru: "Горящие цены" },
      note: { en: "ololo AkJol promotion", ru: "Акция ololo AkJol" }, tags: { en: ["Design"], ru: ["Дизайн"] } },
    { id: "akjol-first-friday", file: "oaj-firstfriday-0604", w: 1080, h: 1350, title: "First Friday",
      note: { en: "ololo AkJol poster", ru: "Афиша ololo AkJol" }, tags: { en: ["Design"], ru: ["Дизайн"] } }
  ]
};
