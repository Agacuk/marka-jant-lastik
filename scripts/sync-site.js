const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CONTACT = {
  phone_display: "+90 (544) 948 31 97",
  phone_tel: "+905449483197",
  phone2_display: "+90 544 662 03 56",
  phone2_tel: "+905446620356",
  whatsapp: "https://wa.me/905449483197",
  whatsapp2: "https://wa.me/905446620356",
  email: "markajantlastikkurumsal@gmail.com",
  address: "Yenimahalle, 7. Sk. No:11, 55080 Canik/Samsun",
  maps_url:
    "https://www.google.com/maps/search/?api=1&query=Yenimahalle+7.+Sk.+No%3A11+55080+Canik+Samsun",
  maps_embed:
    "https://www.google.com/maps?q=Yenimahalle,+7.+Sk.+No:11,+55080+Canik/Samsun&hl=tr&z=16&output=embed",
  instagram: "https://www.instagram.com/markajantlastik",
  facebook: "https://www.facebook.com/marka.jant.lastik",
};

const SITE_BASE = "https://markajantlastik.com";

const PAGE_META = {
  "index.html": {
    active: "home",
    title: "Marka Jant Lastik | Premium Jant & Lastik Merkezi Samsun",
    description:
      "Samsun Canik'te premium jant, lastik ve profesyonel servis hizmetleri. Lastik değişimi, jant onarım, lastik oteli ve balans.",
    og_image: "assets/images/hero/hero-store.jpg",
  },
  "jantlar.html": {
    active: "jantlar",
    title: "Jantlar | Marka Jant Lastik",
    description:
      "Premium jant koleksiyonumuzu keşfedin. Samsun'da geniş jant seçenekleri ve profesyonel montaj hizmeti.",
    og_image: "assets/images/jantlar/jant-001.jpg",
  },
  "lastikler.html": {
    active: "lastikler",
    title: "Lastikler | Marka Jant Lastik",
    description:
      "Yaz, kış ve dört mevsim lastik çözümleri. Bridgestone, Michelin, Continental ve daha fazlası Marka Jant Lastik'te.",
    og_image: "assets/images/hero/hero-store.jpg",
  },
  "lastik-degisimi.html": {
    active: "services",
    service: "lastik-degisimi.html",
    title: "Lastik Değişimi & Montaj | Marka Jant Lastik",
    description:
      "Hızlı ve güvenli lastik değişimi ve montaj hizmeti. Uzman ekip, modern ekipman ve garantili işçilik.",
    og_image: "assets/images/services/service-lastik-degisimi.jpg",
  },
  "jant-onarim.html": {
    active: "services",
    service: "jant-onarim.html",
    title: "Jant Onarım & Düzeltme | Marka Jant Lastik",
    description:
      "Hasarlı jantlarınızı profesyonel ekipmanlarla onarıyoruz. Bükülme, çizik ve korozyon düzeltme hizmetleri.",
    og_image: "assets/images/services/service-jant-onarim.jpg",
  },
  "lastik-oteli.html": {
    active: "services",
    service: "lastik-oteli.html",
    title: "Lastik Oteli | Marka Jant Lastik",
    description:
      "Sezon dışı lastiklerinizi güvenli koşullarda muhafaza ediyoruz. Etiketli ve kontrollü depolama hizmeti.",
    og_image: "assets/images/services/service-lastik-oteli.jpg",
  },
  "balans.html": {
    active: "services",
    service: "balans.html",
    title: "Balans | Marka Jant Lastik",
    description:
      "Hassas balans ayarı ile titreşimi azaltın, konforlu ve güvenli sürüş deneyimi yaşayın.",
    og_image: "assets/images/services/service-balans.jpg",
  },
  "sss.html": {
    active: "sss",
    title: "Sıkça Sorulan Sorular | Marka Jant Lastik",
    description:
      "Jant, lastik ve servis hizmetlerimiz hakkında sıkça sorulan sorular ve cevapları.",
    og_image: "assets/images/hero/hero-store.jpg",
  },
  "iletisim.html": {
    active: "iletisim",
    title: "İletişim | Marka Jant Lastik",
    description:
      "Marka Jant Lastik ile iletişime geçin. Telefon, WhatsApp, e-posta ve adres bilgilerimiz.",
    og_image: "assets/images/hero/hero-store.jpg",
  },
};

const SERVICE_IMAGES = {
  "lastik-degisimi.html": "assets/images/services/service-lastik-degisimi.jpg",
  "jant-onarim.html": "assets/images/services/service-jant-onarim.jpg",
  "lastik-oteli.html": "assets/images/services/service-lastik-oteli.jpg",
  "balans.html": "assets/images/services/service-balans.jpg",
};

const SOCIAL_SVG = {
  instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>`,
  facebook: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 8.5V7.2c0-.66.53-1.2 1.2-1.2H17V3h-2.5C12.02 3 10 5.02 10 7.5V8.5H7v3.5h3V21h4v-9h3l.5-3.5H14z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>`,
};

function linkClass(base, pageKey, target) {
  return pageKey === target ? `${base} ${base}--active` : base;
}

function buildFooterPhoneItem() {
  return `            <li>
              <span class="site-footer__contact-label">Telefon</span>
              <div class="contact-links">
                <a href="tel:${CONTACT.phone_tel}" class="site-footer__contact-value">${CONTACT.phone_display}</a>
                <a href="tel:${CONTACT.phone2_tel}" class="site-footer__contact-value">${CONTACT.phone2_display}</a>
              </div>
            </li>`;
}

function buildFooterWhatsappItem() {
  return `            <li>
              <span class="site-footer__contact-label">WhatsApp</span>
              <div class="contact-links">
                <a href="${CONTACT.whatsapp}" class="site-footer__contact-value" target="_blank" rel="noopener noreferrer">${CONTACT.phone_display}</a>
                <a href="${CONTACT.whatsapp2}" class="site-footer__contact-value" target="_blank" rel="noopener noreferrer">${CONTACT.phone2_display}</a>
              </div>
            </li>`;
}

function buildContactInfoList() {
  return `            <li class="contact__info-item">
              <span class="contact__info-label">Telefon</span>
              <div class="contact-links">
                <a href="tel:${CONTACT.phone_tel}" class="contact__info-value">${CONTACT.phone_display}</a>
                <a href="tel:${CONTACT.phone2_tel}" class="contact__info-value">${CONTACT.phone2_display}</a>
              </div>
            </li>
            <li class="contact__info-item">
              <span class="contact__info-label">WhatsApp</span>
              <div class="contact-links">
                <a href="${CONTACT.whatsapp}" class="contact__info-value" target="_blank" rel="noopener noreferrer">${CONTACT.phone_display}</a>
                <a href="${CONTACT.whatsapp2}" class="contact__info-value" target="_blank" rel="noopener noreferrer">${CONTACT.phone2_display}</a>
              </div>
            </li>
            <li class="contact__info-item">
              <span class="contact__info-label">Mail</span>
              <a href="mailto:${CONTACT.email}" class="contact__info-value">${CONTACT.email}</a>
            </li>
            <li class="contact__info-item">
              <span class="contact__info-label">Adres</span>
              <span class="contact__info-value">${CONTACT.address}</span>
            </li>`;
}

function buildPremiumCtaActions() {
  return `        <div class="premium-cta__actions premium-cta__actions--dual">
          <div class="contact-links contact-links--cta">
            <a href="${CONTACT.whatsapp}" class="hero__btn hero__btn--primary" target="_blank" rel="noopener noreferrer">WhatsApp · ${CONTACT.phone_display}</a>
            <a href="${CONTACT.whatsapp2}" class="hero__btn hero__btn--primary" target="_blank" rel="noopener noreferrer">WhatsApp · ${CONTACT.phone2_display}</a>
          </div>
          <div class="contact-links contact-links--cta">
            <a href="tel:${CONTACT.phone_tel}" class="hero__btn hero__btn--ghost">${CONTACT.phone_display}</a>
            <a href="tel:${CONTACT.phone2_tel}" class="hero__btn hero__btn--ghost">${CONTACT.phone2_display}</a>
          </div>
        </div>`;
}

function buildSocialLinks(mobile = false) {
  const svgs = mobile
    ? {
        instagram: SOCIAL_SVG.instagram.replace(/width="18"/g, 'width="20"').replace(/height="18"/g, 'height="20"'),
        facebook: SOCIAL_SVG.facebook.replace(/width="18"/g, 'width="20"').replace(/height="18"/g, 'height="20"'),
      }
    : SOCIAL_SVG;
  const sizeClass = mobile ? " site-header__social--mobile" : "";
  return `        <div class="site-header__social${sizeClass}">
          <a href="${CONTACT.instagram}" class="site-header__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            ${svgs.instagram}
          </a>
          <a href="${CONTACT.facebook}" class="site-header__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            ${svgs.facebook}
          </a>
        </div>`;
}

function mobileSublink(href, label, service) {
  let cls = "mobile-nav__sublink";
  if (service && href === service) cls += " mobile-nav__sublink--active";
  return `<li><a href="${href}" class="${cls}">${label}</a></li>`;
}

function dropdownLink(href, label, service) {
  let cls = "site-header__dropdown-link";
  if (service && href === service) cls += " site-header__dropdown-link--active";
  return `<li><a href="${href}" class="${cls}">${label}</a></li>`;
}

function buildHeader(meta) {
  const { active, service } = meta;
  const servicesCls =
    active === "services"
      ? "site-header__link site-header__link--dropdown site-header__link--active"
      : "site-header__link site-header__link--dropdown";
  const mServicesBtn =
    active === "services"
      ? "mobile-nav__accordion-btn mobile-nav__link--active"
      : "mobile-nav__accordion-btn";

  return `  <header class="site-header" id="siteHeader">
    <div class="site-header__container">
      <a href="index.html" class="site-header__logo" aria-label="Ana sayfa">
        <img
          src="assets/images/logo-white.png"
          alt="Marka Jant Lastik"
          width="auto"
          height="68"
          decoding="async"
        >
      </a>

      <nav class="site-header__nav" aria-label="Ana menü">
        <ul class="site-header__menu">
          <li><a href="index.html" class="${linkClass("site-header__link", active, "home")}">Ana Sayfa</a></li>
          <li><a href="jantlar.html" class="${linkClass("site-header__link", active, "jantlar")}">Jantlar</a></li>
          <li><a href="lastikler.html" class="${linkClass("site-header__link", active, "lastikler")}">Lastikler</a></li>
          <li class="site-header__dropdown">
            <a href="index.html#hizmetler" class="${servicesCls}" aria-haspopup="true" aria-expanded="false">
              Hizmetlerimiz
              <svg class="site-header__chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <ul class="site-header__dropdown-menu">
              ${dropdownLink("lastik-degisimi.html", "Lastik Değişimi &amp; Montaj", service)}
              ${dropdownLink("jant-onarim.html", "Jant Onarım &amp; Düzeltme", service)}
              ${dropdownLink("lastik-oteli.html", "Lastik Oteli", service)}
              ${dropdownLink("balans.html", "Balans", service)}
            </ul>
          </li>
          <li><a href="sss.html" class="${linkClass("site-header__link", active, "sss")}">S.S.S.</a></li>
          <li><a href="iletisim.html" class="${linkClass("site-header__link", active, "iletisim")}">İletişim</a></li>
        </ul>
      </nav>

      <div class="site-header__actions">
${buildSocialLinks(false)}
        <a href="iletisim.html" class="site-header__btn">Bilgi Al</a>
        <button
          class="site-header__toggle"
          type="button"
          aria-label="Menüyü aç"
          aria-expanded="false"
          aria-controls="mobileMenu"
        >
          <span class="site-header__toggle-line"></span>
          <span class="site-header__toggle-line"></span>
          <span class="site-header__toggle-line"></span>
        </button>
      </div>
    </div>

    <nav class="mobile-nav" id="mobileMenu" aria-hidden="true">
      <div class="mobile-nav__overlay" data-mobile-nav-close></div>
      <div class="mobile-nav__panel">
        <a href="index.html" class="mobile-nav__logo" aria-label="Ana sayfa">
          <img src="assets/images/logo-white.png" alt="Marka Jant Lastik" width="160" height="48" decoding="async">
        </a>
        <ul class="mobile-nav__menu">
          <li><a href="index.html" class="${linkClass("mobile-nav__link", active, "home")}">Ana Sayfa</a></li>
          <li><a href="jantlar.html" class="${linkClass("mobile-nav__link", active, "jantlar")}">Jantlar</a></li>
          <li><a href="lastikler.html" class="${linkClass("mobile-nav__link", active, "lastikler")}">Lastikler</a></li>
          <li class="mobile-nav__accordion">
            <button type="button" class="${mServicesBtn}" aria-expanded="false" aria-controls="mobileNavServices">
              <span>Hizmetler</span>
              <svg class="mobile-nav__chevron" width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <ul class="mobile-nav__accordion-panel" id="mobileNavServices">
              ${mobileSublink("lastik-degisimi.html", "Lastik Değişimi", service)}
              ${mobileSublink("jant-onarim.html", "Jant Onarımı", service)}
              ${mobileSublink("lastik-oteli.html", "Lastik Oteli", service)}
              ${mobileSublink("balans.html", "Balans", service)}
            </ul>
          </li>
          <li><a href="sss.html" class="${linkClass("mobile-nav__link", active, "sss")}">SSS</a></li>
          <li><a href="iletisim.html" class="${linkClass("mobile-nav__link", active, "iletisim")}">İletişim</a></li>
          <li><a href="iletisim.html" class="mobile-nav__link mobile-nav__link--cta">Bilgi AI</a></li>
        </ul>
      </div>
    </nav>
  </header>`;
}

function buildFooter() {
  return `  <footer class="site-footer">
    <div class="site-footer__glow" aria-hidden="true"></div>
    <div class="site-footer__container">
      <div class="site-footer__grid">
        <div class="site-footer__col site-footer__col--brand">
          <a href="index.html" class="site-footer__logo" aria-label="Ana sayfa">
            <img src="assets/images/logo-white.png" alt="Marka Jant Lastik" width="auto" height="56" decoding="async">
          </a>
          <p class="site-footer__desc">Premium jant, lastik ve profesyonel servis çözümleriyle aracınıza değer katıyoruz.</p>
          <div class="site-footer__social">
            <a href="${CONTACT.instagram}" class="site-footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              ${SOCIAL_SVG.instagram}
            </a>
            <a href="${CONTACT.facebook}" class="site-footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              ${SOCIAL_SVG.facebook}
            </a>
          </div>
        </div>

        <div class="site-footer__col">
          <h3 class="site-footer__heading">Hızlı Menü</h3>
          <ul class="site-footer__list">
            <li><a href="index.html" class="site-footer__link">Ana Sayfa</a></li>
            <li><a href="jantlar.html" class="site-footer__link">Jantlar</a></li>
            <li><a href="lastikler.html" class="site-footer__link">Lastikler</a></li>
            <li><a href="index.html#hizmetler" class="site-footer__link">Hizmetlerimiz</a></li>
            <li><a href="sss.html" class="site-footer__link">S.S.S.</a></li>
            <li><a href="iletisim.html" class="site-footer__link">İletişim</a></li>
          </ul>
        </div>

        <div class="site-footer__col">
          <h3 class="site-footer__heading">Hizmetlerimiz</h3>
          <ul class="site-footer__list">
            <li><a href="lastik-degisimi.html" class="site-footer__link">Lastik Değişimi &amp; Montaj</a></li>
            <li><a href="jant-onarim.html" class="site-footer__link">Jant Onarım &amp; Düzeltme</a></li>
            <li><a href="lastik-oteli.html" class="site-footer__link">Lastik Oteli</a></li>
            <li><a href="balans.html" class="site-footer__link">Balans</a></li>
          </ul>
        </div>

        <div class="site-footer__col">
          <h3 class="site-footer__heading">İletişim</h3>
          <ul class="site-footer__contact">
            ${buildFooterPhoneItem()}
            ${buildFooterWhatsappItem()}
            <li>
              <span class="site-footer__contact-label">E-Posta</span>
              <a href="mailto:${CONTACT.email}" class="site-footer__contact-value">${CONTACT.email}</a>
            </li>
            <li>
              <span class="site-footer__contact-label">Adres</span>
              <span class="site-footer__contact-value">${CONTACT.address}</span>
            </li>
            <li>
              <span class="site-footer__contact-label">Google Maps</span>
              <a href="${CONTACT.maps_url}" class="site-footer__contact-value" target="_blank" rel="noopener noreferrer">Haritada Görüntüle</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="site-footer__bottom">
        <p class="site-footer__copyright">&copy; 2026 Marka Jant Lastik</p>
        <p class="site-footer__credit">Designed &amp; Developed by Kanal Ajans</p>
      </div>
    </div>
  </footer>`;
}

function buildSeoHead(filename, meta) {
  const canonical = `${SITE_BASE}/${filename}`;
  const ogImage = `${SITE_BASE}/${meta.og_image}`;
  return `  <meta name="description" content="${meta.description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Marka Jant Lastik">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${ogImage}">`;
}

function replaceBlock(content, startMarker, endMarker, replacement) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Block not found: ${startMarker}`);
  }
  return content.slice(0, start) + replacement + "\n\n" + content.slice(end);
}

function processFile(filename) {
  const filePath = path.join(ROOT, filename);
  let content = fs.readFileSync(filePath, "utf8");
  const meta = PAGE_META[filename];

  content = replaceBlock(content, '  <header class="site-header"', "  </header>", buildHeader(meta));
  content = replaceBlock(content, '  <footer class="site-footer"', "  </footer>", buildFooter());

  const seo = buildSeoHead(filename, meta);
  if (content.includes('<meta name="description"')) {
    content = content.replace(
      /  <meta name="description"[\s\S]*?<meta name="twitter:image"[^>]*>\n/,
      seo + "\n"
    );
  } else {
    content = content.replace("  <title>", seo + "\n  <title>");
  }

  if (SERVICE_IMAGES[filename]) {
    content = content.replace(/src="assets\/images\/services\/[^"]+"/, `src="${SERVICE_IMAGES[filename]}"`);
    content = content.replace(
      '<a href="#" class="hero__btn hero__btn--primary">Bilgi Al</a>',
      '<a href="iletisim.html" class="hero__btn hero__btn--primary">Bilgi Al</a>'
    );
  }

  if (filename === "index.html") {
    content = content.replace(/assets\/images\/hero\/hero-showroom\.jpg/g, "assets/images/hero/hero-store.jpg");
  }

  if (filename === "iletisim.html") {
    const contactInfo = buildContactInfoList();
    content = content.replace(
      /<ul class="contact__info-list">[\s\S]*?<\/ul>/,
      `<ul class="contact__info-list">\n${contactInfo}\n          </ul>`
    );
    const mapBlock = `          <div class="contact__map" aria-label="Google Maps">
            <iframe
              src="${CONTACT.maps_embed}"
              title="Marka Jant Lastik konumu"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            ></iframe>
          </div>`;
    content = content.replace(/<div class="contact__map"[\s\S]*?<\/div>/, mapBlock);
    content = content.replace('placeholder="+90 (000) 000 00 00"', `placeholder="${CONTACT.phone_display}"`);
    content = content.replace('placeholder="ornek@email.com"', `placeholder="${CONTACT.email}"`);
  }

  if (filename === "index.html" || filename === "lastikler.html") {
    content = content.replace(
      /<div class="premium-cta__actions">[\s\S]*?<\/div>/,
      buildPremiumCtaActions()
    );
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Updated ${filename}`);
}

Object.keys(PAGE_META).forEach(processFile);
