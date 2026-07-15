const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "..");

function navHtml(flags) {
  const [home, jantlar, lastikler, svcBtn, degisim, onarim, oteli, balans, sss, iletisim] = flags;
  const c = (on) => (on ? " mobile-nav__link--active" : "");
  const sc = (on) => (on ? " mobile-nav__sublink--active" : "");
  const svcCls = svcBtn ? " mobile-nav__link--active" : "";

  return `    <nav class="mobile-nav" id="mobileMenu" aria-hidden="true">
      <div class="mobile-nav__overlay" data-mobile-nav-close></div>
      <div class="mobile-nav__panel">
        <a href="index.html" class="mobile-nav__logo" aria-label="Ana sayfa">
          <img src="assets/images/logo-white.webp" alt="Marka Jant Lastik" width="160" height="48" decoding="async">
        </a>
        <ul class="mobile-nav__menu">
          <li><a href="index.html" class="mobile-nav__link${c(home)}">Ana Sayfa</a></li>
          <li><a href="jantlar.html" class="mobile-nav__link${c(jantlar)}">Jantlar</a></li>
          <li><a href="lastikler.html" class="mobile-nav__link${c(lastikler)}">Lastikler</a></li>
          <li class="mobile-nav__accordion">
            <button type="button" class="mobile-nav__accordion-btn${svcCls}" aria-expanded="false" aria-controls="mobileNavServices">
              <span>Hizmetler</span>
              <svg class="mobile-nav__chevron" width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <ul class="mobile-nav__accordion-panel" id="mobileNavServices">
              <li><a href="lastik-degisimi.html" class="mobile-nav__sublink${sc(degisim)}">Lastik Değişimi</a></li>
              <li><a href="jant-onarim.html" class="mobile-nav__sublink${sc(onarim)}">Jant Onarımı</a></li>
              <li><a href="lastik-oteli.html" class="mobile-nav__sublink${sc(oteli)}">Lastik Oteli</a></li>
              <li><a href="balans.html" class="mobile-nav__sublink${sc(balans)}">Balans</a></li>
            </ul>
          </li>
          <li><a href="sss.html" class="mobile-nav__link${c(sss)}">SSS</a></li>
          <li><a href="iletisim.html" class="mobile-nav__link${c(iletisim)}">İletişim</a></li>
          <li><a href="iletisim.html" class="mobile-nav__link mobile-nav__link--cta">Bilgi AI</a></li>
        </ul>
      </div>
    </nav>`;
}

const pages = {
  "index.html": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "jantlar.html": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  "lastikler.html": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  "sss.html": [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  "iletisim.html": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  "lastik-degisimi.html": [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  "jant-onarim.html": [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  "lastik-oteli.html": [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  "balans.html": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0]
};

const pattern = /\s*<div class="site-header__mobile" id="mobileMenu"[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/;

for (const [file, flags] of Object.entries(pages)) {
  const filePath = path.join(base, file);
  let content = fs.readFileSync(filePath, "utf8");
  const replacement = navHtml(flags) + "\n  </header>";
  if (!pattern.test(content)) {
    console.error("WARN: no match in", file);
    continue;
  }
  content = content.replace(pattern, "\n" + replacement);
  fs.writeFileSync(filePath, content, "utf8");
  console.log("OK:", file);
}
