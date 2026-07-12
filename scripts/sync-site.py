#!/usr/bin/env python3
"""Sync header, footer, contact info and SEO across all HTML pages."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CONTACT = {
    "phone_display": "+90 (544) 948 31 97",
    "phone_tel": "+905449483197",
    "whatsapp": "https://wa.me/905449483197",
    "email": "markajantlastikkurumsal@gmail.com",
    "address": "Yenimahalle, 7. Sk. No:11, 55080 Canik/Samsun",
    "maps_url": "https://www.google.com/maps/search/?api=1&query=Yenimahalle+7.+Sk.+No%3A11+55080+Canik+Samsun",
    "maps_embed": "https://www.google.com/maps?q=Yenimahalle,+7.+Sk.+No:11,+55080+Canik/Samsun&hl=tr&z=16&output=embed",
    "instagram": "https://www.instagram.com/markajantlastik",
    "facebook": "https://www.facebook.com/marka.jant.lastik",
}

SITE_BASE = "https://markajantlastik.com"

PAGE_META = {
    "index.html": {
        "active": "home",
        "title": "Marka Jant Lastik | Premium Jant & Lastik Merkezi Samsun",
        "description": "Samsun Canik'te premium jant, lastik ve profesyonel servis hizmetleri. Lastik değişimi, jant onarım, lastik oteli ve balans.",
        "og_image": "assets/images/hero/hero-store.jpg",
    },
    "jantlar.html": {
        "active": "jantlar",
        "title": "Jantlar | Marka Jant Lastik",
        "description": "Premium jant koleksiyonumuzu keşfedin. Samsun'da geniş jant seçenekleri ve profesyonel montaj hizmeti.",
        "og_image": "assets/images/jantlar/jant-001.jpg",
    },
    "lastikler.html": {
        "active": "lastikler",
        "title": "Lastikler | Marka Jant Lastik",
        "description": "Yaz, kış ve dört mevsim lastik çözümleri. Bridgestone, Michelin, Continental ve daha fazlası Marka Jant Lastik'te.",
        "og_image": "assets/images/hero/hero-store.jpg",
    },
    "lastik-degisimi.html": {
        "active": "services",
        "service": "lastik-degisimi.html",
        "title": "Lastik Değişimi & Montaj | Marka Jant Lastik",
        "description": "Hızlı ve güvenli lastik değişimi ve montaj hizmeti. Uzman ekip, modern ekipman ve garantili işçilik.",
        "og_image": "assets/images/services/service-lastik-degisimi.jpg",
    },
    "jant-onarim.html": {
        "active": "services",
        "service": "jant-onarim.html",
        "title": "Jant Onarım & Düzeltme | Marka Jant Lastik",
        "description": "Hasarlı jantlarınızı profesyonel ekipmanlarla onarıyoruz. Bükülme, çizik ve korozyon düzeltme hizmetleri.",
        "og_image": "assets/images/services/service-jant-onarim.jpg",
    },
    "lastik-oteli.html": {
        "active": "services",
        "service": "lastik-oteli.html",
        "title": "Lastik Oteli | Marka Jant Lastik",
        "description": "Sezon dışı lastiklerinizi güvenli koşullarda muhafaza ediyoruz. Etiketli ve kontrollü depolama hizmeti.",
        "og_image": "assets/images/services/service-lastik-oteli.jpg",
    },
    "balans.html": {
        "active": "services",
        "service": "balans.html",
        "title": "Balans | Marka Jant Lastik",
        "description": "Hassas balans ayarı ile titreşimi azaltın, konforlu ve güvenli sürüş deneyimi yaşayın.",
        "og_image": "assets/images/services/service-balans.jpg",
    },
    "sss.html": {
        "active": "sss",
        "title": "Sıkça Sorulan Sorular | Marka Jant Lastik",
        "description": "Jant, lastik ve servis hizmetlerimiz hakkında sıkça sorulan sorular ve cevapları.",
        "og_image": "assets/images/hero/hero-store.jpg",
    },
    "iletisim.html": {
        "active": "iletisim",
        "title": "İletişim | Marka Jant Lastik",
        "description": "Marka Jant Lastik ile iletişime geçin. Telefon, WhatsApp, e-posta ve adres bilgilerimiz.",
        "og_image": "assets/images/hero/hero-store.jpg",
    },
}

SERVICE_IMAGES = {
    "lastik-degisimi.html": "assets/images/services/service-lastik-degisimi.jpg",
    "jant-onarim.html": "assets/images/services/service-jant-onarim.jpg",
    "lastik-oteli.html": "assets/images/services/service-lastik-oteli.jpg",
    "balans.html": "assets/images/services/service-balans.jpg",
}

SOCIAL_SVG = {
    "instagram": """<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>""",
    "facebook": """<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 8.5V7.2c0-.66.53-1.2 1.2-1.2H17V3h-2.5C12.02 3 10 5.02 10 7.5V8.5H7v3.5h3V21h4v-9h3l.5-3.5H14z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>""",
}

SOCIAL_SVG_MOBILE = {
    "instagram": SOCIAL_SVG["instagram"].replace('width="18"', 'width="20"').replace('height="18"', 'height="20"'),
    "facebook": SOCIAL_SVG["facebook"].replace('width="18"', 'width="20"').replace('height="18"', 'height="20"'),
}


def link_class(base: str, page_key: str, target: str) -> str:
    return f'{base} {base}--active' if page_key == target else base


def build_social_links(mobile: bool = False) -> str:
    svgs = SOCIAL_SVG_MOBILE if mobile else SOCIAL_SVG
    size_class = " site-header__social--mobile" if mobile else ""
    return f"""        <div class="site-header__social{size_class}">
          <a href="{CONTACT['instagram']}" class="site-header__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            {svgs['instagram']}
          </a>
          <a href="{CONTACT['facebook']}" class="site-header__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            {svgs['facebook']}
          </a>
        </div>"""


def build_header(meta: dict) -> str:
    active = meta["active"]
    service = meta.get("service")

    home_cls = link_class("site-header__link", active, "home")
    jantlar_cls = link_class("site-header__link", active, "jantlar")
    lastikler_cls = link_class("site-header__link", active, "lastikler")
    services_cls = "site-header__link site-header__link--dropdown"
    if active == "services":
        services_cls += " site-header__link--active"
    sss_cls = link_class("site-header__link", active, "sss")
    iletisim_cls = link_class("site-header__link", active, "iletisim")

    def dropdown_link(href: str, label: str) -> str:
        cls = "site-header__dropdown-link"
        if service and href == service:
            cls += " site-header__dropdown-link--active"
        return f'<li><a href="{href}" class="{cls}">{label}</a></li>'

    m_home = link_class("site-header__mobile-link", active, "home")
    m_jantlar = link_class("site-header__mobile-link", active, "jantlar")
    m_lastikler = link_class("site-header__mobile-link", active, "lastikler")
    m_services_btn = "site-header__mobile-dropdown-btn"
    if active == "services":
        m_services_btn += " site-header__mobile-link--active"
    m_sss = link_class("site-header__mobile-link", active, "sss")
    m_iletisim = link_class("site-header__mobile-link", active, "iletisim")

    return f"""  <header class="site-header" id="siteHeader">
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
          <li><a href="index.html" class="{home_cls}">Ana Sayfa</a></li>
          <li><a href="jantlar.html" class="{jantlar_cls}">Jantlar</a></li>
          <li><a href="lastikler.html" class="{lastikler_cls}">Lastikler</a></li>
          <li class="site-header__dropdown">
            <a href="index.html#hizmetler" class="{services_cls}" aria-haspopup="true" aria-expanded="false">
              Hizmetlerimiz
              <svg class="site-header__chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <ul class="site-header__dropdown-menu">
              {dropdown_link("lastik-degisimi.html", "Lastik Değişimi &amp; Montaj")}
              {dropdown_link("jant-onarim.html", "Jant Onarım &amp; Düzeltme")}
              {dropdown_link("lastik-oteli.html", "Lastik Oteli")}
              {dropdown_link("balans.html", "Balans")}
            </ul>
          </li>
          <li><a href="sss.html" class="{sss_cls}">S.S.S.</a></li>
          <li><a href="iletisim.html" class="{iletisim_cls}">İletişim</a></li>
        </ul>
      </nav>

      <div class="site-header__actions">
{build_social_links(mobile=False)}
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

    <div class="site-header__mobile" id="mobileMenu" aria-hidden="true">
      <div class="site-header__mobile-backdrop"></div>
      <div class="site-header__mobile-panel">
        <nav class="site-header__mobile-nav" aria-label="Mobil menü">
          <ul class="site-header__mobile-menu">
            <li><a href="index.html" class="{m_home}">Ana Sayfa</a></li>
            <li><a href="jantlar.html" class="{m_jantlar}">Jantlar</a></li>
            <li><a href="lastikler.html" class="{m_lastikler}">Lastikler</a></li>
            <li class="site-header__mobile-dropdown">
              <button type="button" class="{m_services_btn}" aria-expanded="false">
                Hizmetlerimiz
                <svg class="site-header__chevron" width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <ul class="site-header__mobile-submenu">
                {dropdown_link("lastik-degisimi.html", "Lastik Değişimi &amp; Montaj").replace("site-header__dropdown-link", "site-header__mobile-sublink")}
                {dropdown_link("jant-onarim.html", "Jant Onarım &amp; Düzeltme").replace("site-header__dropdown-link", "site-header__mobile-sublink")}
                {dropdown_link("lastik-oteli.html", "Lastik Oteli").replace("site-header__dropdown-link", "site-header__mobile-sublink")}
                {dropdown_link("balans.html", "Balans").replace("site-header__dropdown-link", "site-header__mobile-sublink")}
              </ul>
            </li>
            <li><a href="sss.html" class="{m_sss}">S.S.S.</a></li>
            <li><a href="iletisim.html" class="{m_iletisim}">İletişim</a></li>
          </ul>
        </nav>
        <div class="site-header__mobile-footer">
{build_social_links(mobile=True)}
          <a href="iletisim.html" class="site-header__btn site-header__btn--mobile">Bilgi Al</a>
        </div>
      </div>
    </div>
  </header>"""


def build_footer() -> str:
    return f"""  <footer class="site-footer">
    <div class="site-footer__glow" aria-hidden="true"></div>
    <div class="site-footer__container">
      <div class="site-footer__grid">
        <div class="site-footer__col site-footer__col--brand">
          <a href="index.html" class="site-footer__logo" aria-label="Ana sayfa">
            <img src="assets/images/logo-white.png" alt="Marka Jant Lastik" width="auto" height="56" decoding="async">
          </a>
          <p class="site-footer__desc">Premium jant, lastik ve profesyonel servis çözümleriyle aracınıza değer katıyoruz.</p>
          <div class="site-footer__social">
            <a href="{CONTACT['instagram']}" class="site-footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              {SOCIAL_SVG['instagram']}
            </a>
            <a href="{CONTACT['facebook']}" class="site-footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              {SOCIAL_SVG['facebook']}
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
            <li>
              <span class="site-footer__contact-label">Telefon</span>
              <a href="tel:{CONTACT['phone_tel']}" class="site-footer__contact-value">{CONTACT['phone_display']}</a>
            </li>
            <li>
              <span class="site-footer__contact-label">WhatsApp</span>
              <a href="{CONTACT['whatsapp']}" class="site-footer__contact-value" target="_blank" rel="noopener noreferrer">{CONTACT['phone_display']}</a>
            </li>
            <li>
              <span class="site-footer__contact-label">E-Posta</span>
              <a href="mailto:{CONTACT['email']}" class="site-footer__contact-value">{CONTACT['email']}</a>
            </li>
            <li>
              <span class="site-footer__contact-label">Adres</span>
              <span class="site-footer__contact-value">{CONTACT['address']}</span>
            </li>
            <li>
              <span class="site-footer__contact-label">Google Maps</span>
              <a href="{CONTACT['maps_url']}" class="site-footer__contact-value" target="_blank" rel="noopener noreferrer">Haritada Görüntüle</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="site-footer__bottom">
        <p class="site-footer__copyright">&copy; 2026 Marka Jant Lastik</p>
        <p class="site-footer__credit">Designed &amp; Developed by Kanal Ajans</p>
      </div>
    </div>
  </footer>"""


def build_seo_head(filename: str, meta: dict) -> str:
    canonical = f"{SITE_BASE}/{filename}"
    og_image = f"{SITE_BASE}/{meta['og_image']}"
    title = meta["title"]
    desc = meta["description"]
    return f"""  <meta name="description" content="{desc}">
  <link rel="canonical" href="{canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Marka Jant Lastik">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{og_image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="{og_image}">"""


def replace_block(content: str, start_marker: str, end_marker: str, replacement: str) -> str:
    pattern = re.compile(
        re.escape(start_marker) + r".*?" + re.escape(end_marker),
        re.DOTALL,
    )
    if not pattern.search(content):
        raise ValueError(f"Block not found: {start_marker}")
    return pattern.sub(replacement.rstrip() + "\n\n" + end_marker, content, count=1)


def process_file(filename: str) -> None:
    path = ROOT / filename
    content = path.read_text(encoding="utf-8")
    meta = PAGE_META[filename]

    header = build_header(meta)
    footer = build_footer()
    seo = build_seo_head(filename, meta)

    content = replace_block(content, '  <header class="site-header"', "  </header>", header)

    content = replace_block(content, '  <footer class="site-footer"', "  </footer>", footer)

    if '<meta name="description"' in content:
        content = re.sub(
            r'  <meta name="description"[^>]*>.*?<meta name="twitter:image"[^>]*>\n',
            seo + "\n",
            content,
            count=1,
            flags=re.DOTALL,
        )
    else:
        content = content.replace(
            '  <title>',
            seo + "\n  <title>",
            1,
        )

    if filename in SERVICE_IMAGES:
        img = SERVICE_IMAGES[filename]
        content = re.sub(
            r'src="assets/images/services/[^"]+"',
            f'src="{img}"',
            content,
            count=1,
        )
        content = content.replace(
            '<a href="#" class="hero__btn hero__btn--primary">Bilgi Al</a>',
            '<a href="iletisim.html" class="hero__btn hero__btn--primary">Bilgi Al</a>',
        )

    if filename == "index.html":
        content = content.replace(
            "assets/images/hero/hero-showroom.jpg",
            "assets/images/hero/hero-store.jpg",
        )
        content = re.sub(
            r'<a href="#" class="site-header__social-link" aria-label="YouTube"[^>]*>.*?</a>\s*',
            "",
            content,
            flags=re.DOTALL,
        )
        content = re.sub(
            r'<a href="#" class="site-footer__social-link" aria-label="YouTube"[^>]*>.*?</a>\s*',
            "",
            content,
            flags=re.DOTALL,
        )
        content = content.replace(
            '<a href="#" class="site-footer__contact-value">Haritada Görüntüle</a>',
            f'<a href="{CONTACT["maps_url"]}" class="site-footer__contact-value" target="_blank" rel="noopener noreferrer">Haritada Görüntüle</a>',
        )
        content = re.sub(
            r'<a href="#" class="site-header__social-link" aria-label="Instagram"[^>]*>',
            f'<a href="{CONTACT["instagram"]}" class="site-header__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">',
            content,
        )
        content = re.sub(
            r'<a href="#" class="site-header__social-link" aria-label="Facebook"[^>]*>',
            f'<a href="{CONTACT["facebook"]}" class="site-header__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">',
            content,
        )
        content = re.sub(
            r'<a href="#" class="site-footer__social-link" aria-label="Instagram"[^>]*>',
            f'<a href="{CONTACT["instagram"]}" class="site-footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">',
            content,
        )
        content = re.sub(
            r'<a href="#" class="site-footer__social-link" aria-label="Facebook"[^>]*>',
            f'<a href="{CONTACT["facebook"]}" class="site-footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">',
            content,
        )

    if filename == "iletisim.html":
        contact_info = f"""            <li class="contact__info-item">
              <span class="contact__info-label">Telefon</span>
              <a href="tel:{CONTACT['phone_tel']}" class="contact__info-value">{CONTACT['phone_display']}</a>
            </li>
            <li class="contact__info-item">
              <span class="contact__info-label">WhatsApp</span>
              <a href="{CONTACT['whatsapp']}" class="contact__info-value" target="_blank" rel="noopener noreferrer">{CONTACT['phone_display']}</a>
            </li>
            <li class="contact__info-item">
              <span class="contact__info-label">Mail</span>
              <a href="mailto:{CONTACT['email']}" class="contact__info-value">{CONTACT['email']}</a>
            </li>
            <li class="contact__info-item">
              <span class="contact__info-label">Adres</span>
              <span class="contact__info-value">{CONTACT['address']}</span>
            </li>"""
        content = re.sub(
            r'<ul class="contact__info-list">.*?</ul>',
            f'<ul class="contact__info-list">\n{contact_info}\n          </ul>',
            content,
            count=1,
            flags=re.DOTALL,
        )
        map_block = f"""          <div class="contact__map" aria-label="Google Maps">
            <iframe
              src="{CONTACT['maps_embed']}"
              title="Marka Jant Lastik konumu"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            ></iframe>
          </div>"""
        content = re.sub(
            r'<div class="contact__map"[^>]*>.*?</div>',
            map_block,
            content,
            count=1,
            flags=re.DOTALL,
        )
        content = content.replace(
            'placeholder="+90 (000) 000 00 00"',
            f'placeholder="{CONTACT["phone_display"]}"',
        )
        content = content.replace(
            'placeholder="ornek@email.com"',
            f'placeholder="{CONTACT["email"]}"',
        )

    path.write_text(content, encoding="utf-8")
    print(f"Updated {filename}")


def main() -> None:
    for filename in PAGE_META:
        process_file(filename)


if __name__ == "__main__":
    main()
