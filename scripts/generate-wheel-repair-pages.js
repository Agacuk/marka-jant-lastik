/**
 * Generates wheel repair sub-service detail pages from wheel-repair-services-data.js
 * Run: node scripts/generate-wheel-repair-pages.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DATA_PATH = path.join(ROOT, "assets", "js", "wheel-repair-services-data.js");

const CONTACT = {
  phone_display: "+90 (544) 948 31 97",
  phone_tel: "+905449483197",
  whatsapp: "https://wa.me/905449483197",
  email: "markajantlastikkurumsal@gmail.com",
  address: "Yenimahalle, 7. Sk. No:11, 55080 Canik/Samsun",
  maps_url:
    "https://www.google.com/maps/search/?api=1&query=Yenimahalle+7.+Sk.+No%3A11+55080+Canik+Samsun",
  instagram: "https://www.instagram.com/markajantlastik",
  facebook: "https://www.facebook.com/marka.jant.lastik",
};

const SITE = "https://markajantlastik.com";

function loadCatalog() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(DATA_PATH, "utf8"), sandbox);
  return sandbox.window.WheelRepairServices;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHeader() {
  return `  <header class="site-header" id="siteHeader">
    <div class="site-header__container">
      <div class="site-header__brand">
        <a href="index.html" class="site-header__logo" aria-label="Ana sayfa">
          <img src="assets/images/logo-white.webp" alt="Marka Jant Lastik" width="auto" height="68" decoding="async">
        </a>
        <p class="site-header__tagline">
          <span class="site-header__tagline-line">Her İşin Bir</span>
          <span class="site-header__tagline-line"><span class="site-header__tagline-mark">MARKA&rsquo;SI</span> Vardır</span>
        </p>
      </div>
      <nav class="site-header__nav" aria-label="Ana menü">
        <ul class="site-header__menu">
          <li><a href="index.html" class="site-header__link">Ana Sayfa</a></li>
          <li><a href="jantlar.html" class="site-header__link">Jantlar</a></li>
          <li><a href="lastikler.html" class="site-header__link">Lastikler</a></li>
          <li class="site-header__dropdown">
            <a href="index.html#hizmetler" class="site-header__link site-header__link--dropdown site-header__link--active" aria-haspopup="true" aria-expanded="false">
              Hizmetlerimiz
              <svg class="site-header__chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <ul class="site-header__dropdown-menu">
              <li><a href="lastik-degisimi.html" class="site-header__dropdown-link">Lastik Değişimi &amp; Montaj</a></li>
              <li><a href="jant-onarim.html" class="site-header__dropdown-link site-header__dropdown-link--active">Jant Onarım &amp; Düzeltme</a></li>
              <li><a href="lastik-oteli.html" class="site-header__dropdown-link">Lastik Oteli</a></li>
              <li><a href="balans.html" class="site-header__dropdown-link">Balans</a></li>
            </ul>
          </li>
          <li><a href="sss.html" class="site-header__link">S.S.S.</a></li>
          <li><a href="iletisim.html" class="site-header__link">İletişim</a></li>
        </ul>
      </nav>
      <div class="site-header__actions">
        <div class="site-header__social">
          <a href="${CONTACT.instagram}" class="site-header__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
          </a>
          <a href="${CONTACT.facebook}" class="site-header__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 8.5V7.2c0-.66.53-1.2 1.2-1.2H17V3h-2.5C12.02 3 10 5.02 10 7.5V8.5H7v3.5h3V21h4v-9h3l.5-3.5H14z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
          </a>
        </div>
        <a href="bayi.html" class="site-header__btn site-header__btn--dealer">Bayi Portalı</a>
        <a href="iletisim.html" class="site-header__btn">Bilgi Al</a>
        <a href="bayi.html" class="site-header__btn site-header__btn--dealer-mobile">Bayi Girişi</a>
        <button class="site-header__toggle" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="mobileMenu">
          <span class="site-header__toggle-line"></span>
          <span class="site-header__toggle-line"></span>
          <span class="site-header__toggle-line"></span>
        </button>
      </div>
    </div>
    <nav class="mobile-nav" id="mobileMenu" aria-hidden="true">
      <div class="mobile-nav__overlay" data-mobile-nav-close></div>
      <div class="mobile-nav__panel">
        <button type="button" class="mobile-nav__close" data-mobile-nav-close aria-label="Menüyü kapat">
          <span class="mobile-nav__close-icon" aria-hidden="true">&times;</span>
        </button>
        <a href="index.html" class="mobile-nav__logo" aria-label="Ana sayfa">
          <img src="assets/images/logo-white.webp" alt="Marka Jant Lastik" width="160" height="48" decoding="async">
        </a>
        <ul class="mobile-nav__menu">
          <li><a href="index.html" class="mobile-nav__link">Ana Sayfa</a></li>
          <li><a href="jantlar.html" class="mobile-nav__link">Jantlar</a></li>
          <li><a href="lastikler.html" class="mobile-nav__link">Lastikler</a></li>
          <li class="mobile-nav__accordion">
            <button type="button" class="mobile-nav__accordion-btn mobile-nav__link--active" aria-expanded="false" aria-controls="mobileNavServices">
              <span>Hizmetler</span>
              <svg class="mobile-nav__chevron" width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <ul class="mobile-nav__accordion-panel" id="mobileNavServices">
              <li><a href="lastik-degisimi.html" class="mobile-nav__sublink">Lastik Değişimi</a></li>
              <li><a href="jant-onarim.html" class="mobile-nav__sublink mobile-nav__sublink--active">Jant Onarımı</a></li>
              <li><a href="lastik-oteli.html" class="mobile-nav__sublink">Lastik Oteli</a></li>
              <li><a href="balans.html" class="mobile-nav__sublink">Balans</a></li>
            </ul>
          </li>
          <li><a href="sss.html" class="mobile-nav__link">SSS</a></li>
          <li><a href="iletisim.html" class="mobile-nav__link">İletişim</a></li>
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
            <img src="assets/images/logo-white.webp" alt="Marka Jant Lastik" width="auto" height="56" decoding="async">
          </a>
          <p class="site-footer__desc">Premium jant, lastik ve profesyonel servis çözümleriyle aracınıza değer katıyoruz.</p>
          <div class="site-footer__social">
            <a href="${CONTACT.instagram}" class="site-footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a href="${CONTACT.facebook}" class="site-footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 8.5V7.2c0-.66.53-1.2 1.2-1.2H17V3h-2.5C12.02 3 10 5.02 10 7.5V8.5H7v3.5h3V21h4v-9h3l.5-3.5H14z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
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
            <li><span class="site-footer__contact-label">Telefon</span><div class="contact-links"><a href="tel:${CONTACT.phone_tel}" class="site-footer__contact-value">${CONTACT.phone_display}</a></div></li>
            <li><span class="site-footer__contact-label">WhatsApp</span><div class="contact-links"><a href="${CONTACT.whatsapp}" class="site-footer__contact-value" target="_blank" rel="noopener noreferrer">${CONTACT.phone_display}</a></div></li>
            <li><span class="site-footer__contact-label">E-Posta</span><a href="mailto:${CONTACT.email}" class="site-footer__contact-value">${CONTACT.email}</a></li>
            <li><span class="site-footer__contact-label">Adres</span><span class="site-footer__contact-value">${CONTACT.address}</span></li>
            <li><span class="site-footer__contact-label">Google Maps</span><a href="${CONTACT.maps_url}" class="site-footer__contact-value" target="_blank" rel="noopener noreferrer">Haritada Görüntüle</a></li>
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

function listItems(items) {
  return items.map(function (item) {
    return "            <li>" + esc(item) + "</li>";
  }).join("\n");
}

function faqItems(faq) {
  return faq
    .map(function (item) {
      return (
        '          <details class="service-detail__faq-item">\n' +
        "            <summary>" +
        esc(item.q) +
        "</summary>\n" +
        "            <p>" +
        esc(item.a) +
        "</p>\n" +
        "          </details>"
      );
    })
    .join("\n");
}

function schemaJson(service, catalog) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription,
    provider: {
      "@type": "AutoRepair",
      name: "Marka Jant Lastik",
      url: SITE,
      telephone: CONTACT.phone_tel,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Yenimahalle, 7. Sk. No:11",
        addressLocality: "Canik",
        addressRegion: "Samsun",
        postalCode: "55080",
        addressCountry: "TR",
      },
    },
    areaServed: "Samsun",
    url: SITE + "/" + service.slug,
    image: SITE + "/" + service.heroImage,
    isPartOf: {
      "@type": "Service",
      name: catalog.parent.title,
      url: SITE + "/" + catalog.parent.url,
    },
  };
  return JSON.stringify(schema, null, 2);
}

function breadcrumbJson(service, catalog) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Anasayfa",
          item: SITE + "/index.html",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: catalog.parent.title,
          item: SITE + "/" + catalog.parent.url,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: service.title,
          item: SITE + "/" + service.slug,
        },
      ],
    },
    null,
    2
  );
}

function buildPage(service, catalog) {
  const pageTitle = service.title + " | Marka Jant Lastik";
  const canonical = SITE + "/" + service.slug;
  const ogImage = SITE + "/" + service.heroImage;
  const quoteUrl =
    "iletisim.html?hizmet=" + encodeURIComponent(service.title);
  const waMessage =
    "Merhaba, " + service.title + " hizmeti hakkında bilgi almak istiyorum.";
  const waUrl = catalog.whatsappUrl + "?text=" + encodeURIComponent(waMessage);

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="assets/images/logo-white.webp" type="image/webp">
  <link rel="manifest" href="manifest.json">
  <meta name="description" content="${esc(service.metaDescription)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Marka Jant Lastik">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${esc(service.metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(pageTitle)}">
  <meta name="twitter:description" content="${esc(service.metaDescription)}">
  <meta name="twitter:image" content="${ogImage}">
  <title>${esc(pageTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/wheel-repair-services.css">
  <script type="application/ld+json">
${schemaJson(service, catalog)}
  </script>
  <script type="application/ld+json">
${breadcrumbJson(service, catalog)}
  </script>
</head>
<body class="wheel-repair-detail-page">

${buildHeader()}

  <nav class="service-breadcrumb" aria-label="Breadcrumb">
    <ol class="service-breadcrumb__list" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li class="service-breadcrumb__item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="index.html" itemprop="item"><span itemprop="name">Anasayfa</span></a>
        <meta itemprop="position" content="1">
      </li>
      <li class="service-breadcrumb__item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="${catalog.parent.url}" itemprop="item"><span itemprop="name">${esc(catalog.parent.title)}</span></a>
        <meta itemprop="position" content="2">
      </li>
      <li class="service-breadcrumb__item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" aria-current="page">
        <span itemprop="name">${esc(service.title)}</span>
        <meta itemprop="item" content="${canonical}">
        <meta itemprop="position" content="3">
      </li>
    </ol>
  </nav>

  <section class="service-detail-hero">
    <div class="service-detail-hero__container">
      <div class="service-detail-hero__content">
        <h1 class="service-detail-hero__title">${esc(service.title)}</h1>
        <p class="service-detail-hero__desc">${esc(service.heroDesc)}</p>
      </div>
      <div class="service-detail-hero__media">
        <div class="services__card-media">
          <div class="services__card-placeholder" aria-hidden="true"></div>
          <img src="${service.heroImage}" alt="${esc(service.title)}" class="services__card-img is-loaded" loading="eager" decoding="async" width="640" height="400">
        </div>
      </div>
    </div>
  </section>

  <section class="service-detail">
    <div class="why__container">
      <article class="service-detail__section">
        <h2 class="service-detail__heading">Bu Hizmet Nedir?</h2>
        <p class="service-detail__text">${esc(service.whatIs)}</p>
      </article>
      <article class="service-detail__section">
        <h2 class="service-detail__heading">Nasıl Yapılır?</h2>
        <ul class="service-detail__list">
${listItems(service.howItWorks)}
        </ul>
      </article>
      <article class="service-detail__section">
        <h2 class="service-detail__heading">Avantajları</h2>
        <ul class="service-detail__list">
${listItems(service.advantages)}
        </ul>
      </article>
      <article class="service-detail__section">
        <h2 class="service-detail__heading">Hangi Durumlarda Yapılır?</h2>
        <ul class="service-detail__list">
${listItems(service.whenNeeded)}
        </ul>
      </article>
      <article class="service-detail__section">
        <h2 class="service-detail__heading">İşlem Süresi</h2>
        <p class="service-detail__duration">${esc(service.duration)}</p>
      </article>
      <article class="service-detail__section">
        <h2 class="service-detail__heading">Sık Sorulan Sorular</h2>
        <div class="service-detail__faq">
${faqItems(service.faq)}
        </div>
      </article>
    </div>
  </section>

  <section class="service-detail-cta">
    <div class="why__container">
      <div class="service-detail-cta__box">
        <h2 class="service-detail-cta__title">${esc(service.title)} için Teklif Alın</h2>
        <p class="service-detail-cta__desc">Uzman ekibimiz jantınızı inceleyerek size en uygun çözümü sunar.</p>
        <div class="service-detail-cta__actions">
          <a href="${quoteUrl}" class="hero__btn hero__btn--primary">Hemen Teklif Al</a>
          <a href="${waUrl}" class="hero__btn hero__btn--whatsapp" target="_blank" rel="noopener noreferrer"><i class="bi bi-whatsapp" aria-hidden="true"></i> WhatsApp'tan Bilgi Al</a>
          <a href="${catalog.phoneUrl}" class="hero__btn hero__btn--ghost">Telefonla Ara</a>
        </div>
      </div>
    </div>
  </section>

${buildFooter()}

  <script src="assets/js/script.js" defer></script>
</body>
</html>
`;
}

function main() {
  const catalog = loadCatalog();

  catalog.services.forEach(function (service) {
    const filePath = path.join(ROOT, service.slug);
    fs.writeFileSync(filePath, buildPage(service, catalog), "utf8");
    console.log("Generated " + service.slug);
  });
}

main();
