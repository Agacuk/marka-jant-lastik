(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var toggle = document.querySelector(".site-header__toggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var scrollThreshold = 20;
  var isMenuOpen = false;

  function handleScroll() {
    if (!header) return;

    if (window.scrollY > scrollThreshold) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function openMenu() {
    if (!toggle || !mobileMenu) return;

    isMenuOpen = true;
    toggle.classList.add("is-active");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Menüyü kapat");
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    if (!toggle || !mobileMenu) return;

    isMenuOpen = false;
    toggle.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menüyü aç");
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    var mobileDropdowns = mobileMenu.querySelectorAll(".site-header__mobile-dropdown.is-open");
    mobileDropdowns.forEach(function (item) {
      item.classList.remove("is-open");
      var btn = item.querySelector(".site-header__mobile-dropdown-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      if (isMenuOpen) {
        closeMenu();
        toggle.focus();
        return;
      }

      var focusedDropdown = document.querySelector(".site-header__dropdown:focus-within");
      if (focusedDropdown) {
        var trigger = focusedDropdown.querySelector(".site-header__link--dropdown");
        var activeElement = document.activeElement;

        if (trigger && activeElement && activeElement !== trigger && focusedDropdown.contains(activeElement)) {
          event.preventDefault();
          trigger.focus();
        }
      }
    }
  }

  function handleResize() {
    if (window.innerWidth > 1100 && isMenuOpen) {
      closeMenu();
    }
  }

  function initDesktopDropdowns() {
    var dropdowns = document.querySelectorAll(".site-header__dropdown");

    dropdowns.forEach(function (dropdown) {
      var trigger = dropdown.querySelector(".site-header__link--dropdown");
      if (!trigger) return;

      dropdown.addEventListener("mouseenter", function () {
        trigger.setAttribute("aria-expanded", "true");
      });

      dropdown.addEventListener("mouseleave", function () {
        trigger.setAttribute("aria-expanded", "false");
      });

      trigger.addEventListener("click", function (event) {
        event.preventDefault();
      });
    });
  }

  function initMobileDropdowns() {
    var mobileDropdownBtns = document.querySelectorAll(".site-header__mobile-dropdown-btn");

    mobileDropdownBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parent = btn.closest(".site-header__mobile-dropdown");
        if (!parent) return;

        var isOpen = parent.classList.contains("is-open");
        parent.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  if (header) {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", toggleMenu);

    var backdrop = mobileMenu.querySelector(".site-header__mobile-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", closeMenu);
    }

    var mobileLinks = mobileMenu.querySelectorAll(".site-header__mobile-link, .site-header__mobile-sublink");
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  initDesktopDropdowns();
  initMobileDropdowns();

  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);

  /* Hero */
  var hero = document.getElementById("hero");

  if (hero) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add("is-loaded");
      });
    });
  }

  /* Image load / fallback */
  function initImageFallback(selector) {
    var images = document.querySelectorAll(selector);

    images.forEach(function (img) {
      if (img.dataset.fallbackInit === "true") return;
      img.dataset.fallbackInit = "true";

      function markLoaded() {
        img.classList.add("is-loaded");
        img.classList.remove("is-error");
      }

      function markError() {
        img.classList.add("is-error");
        img.classList.remove("is-loaded");
      }

      img.addEventListener("load", markLoaded);
      img.addEventListener("error", markError);

      if (img.complete) {
        if (img.naturalWidth > 0) {
          markLoaded();
        } else {
          markError();
        }
      }
    });
  }

  initImageFallback(".services__card-img");
  initImageFallback(".why__visual-img");

  /* Gallery lightbox */
  function getGallerySources(sectionId) {
    if (window.MJLGallery) {
      const map = window.MJLGallery.SECTION_GALLERY_MAP || {};
      const galleryId = map[sectionId];
      if (galleryId) {
        const sources = window.MJLGallery.getSources(galleryId);
        if (sources.length) return sources;
      }
    }

    const section = document.getElementById(sectionId);
    if (!section) return [];

    const sources = [];
    section.querySelectorAll(".jantlar__item .jantlar__img").forEach(function (img) {
      const src = img.getAttribute("src");
      if (src) sources.push(src);
    });
    return sources;
  }

  function initGalleryLightbox(sectionId, lightboxId, lightboxImgId, altPrefix) {
    var section = document.getElementById(sectionId);
    var lightbox = document.getElementById(lightboxId);
    var lightboxImg = document.getElementById(lightboxImgId);

    if (!section || !lightbox || !lightboxImg) return;

    var currentIndex = 0;
    var isOpen = false;
    var lastFocused = null;

    function getSources() {
      return getGallerySources(sectionId);
    }

    function showImage(index) {
      var sources = getSources();
      if (!sources.length) return;

      if (index < 0) index = sources.length - 1;
      if (index >= sources.length) index = 0;

      currentIndex = index;
      lightboxImg.classList.remove("is-visible");
      lightboxImg.onload = function () {
        lightboxImg.classList.add("is-visible");
      };
      lightboxImg.src = sources[currentIndex];
      lightboxImg.alt = altPrefix + " " + (currentIndex + 1);

      if (lightboxImg.complete) {
        lightboxImg.classList.add("is-visible");
      }
    }

    function openLightbox(index) {
      lastFocused = document.activeElement;
      isOpen = true;
      showImage(index);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".jantlar-lightbox__close").focus();
    }

    function closeLightbox() {
      isOpen = false;
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lightboxImg.classList.remove("is-visible");
      lightboxImg.removeAttribute("src");

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    function goPrev() {
      showImage(currentIndex - 1);
    }

    function goNext() {
      showImage(currentIndex + 1);
    }

    section.addEventListener("click", function (event) {
      var item = event.target.closest(".jantlar__item");
      if (!item || !section.contains(item)) return;

      var index = parseInt(item.getAttribute("data-index"), 10) || 0;
      openLightbox(index);
    });

    lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });

    var prevBtn = lightbox.querySelector("[data-lightbox-prev]");
    var nextBtn = lightbox.querySelector("[data-lightbox-next]");

    if (prevBtn) prevBtn.addEventListener("click", goPrev);
    if (nextBtn) nextBtn.addEventListener("click", goNext);

    document.addEventListener("keydown", function (event) {
      if (!isOpen) return;

      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    });
  }

  function initAllLightboxes() {
    var lightboxSections = [
      { section: "jantlar", lightbox: "jantlarLightbox", img: "jantlarLightboxImg", alt: "Jant görseli" },
      { section: "lastikler", lightbox: "lastiklerLightbox", img: "lastiklerLightboxImg", alt: "Lastik görseli" },
      { section: "uygulamalar", lightbox: "jantApplicationsLightbox", img: "jantApplicationsLightboxImg", alt: "Jant uygulaması" },
      { section: "lastik-applications", lightbox: "lastikApplicationsLightbox", img: "lastikApplicationsLightboxImg", alt: "Lastik uygulaması" },
      { section: "home-applications", lightbox: "homeApplicationsLightbox", img: "homeApplicationsLightboxImg", alt: "Uygulama görseli" }
    ];

    lightboxSections.forEach(function (cfg) {
      initGalleryLightbox(cfg.section, cfg.lightbox, cfg.img, cfg.alt);
    });
  }

  /* Reveal animations */
  function initRevealAnimations() {
    var autoRevealSections = document.querySelectorAll(
      "section.services, section.showcase, section.jantlar, section.page-hero, section.service-hero, section.service-content, section.service-features, section.faq, section.contact, section.faq-cta, section.service-cta"
    );

    autoRevealSections.forEach(function (section) {
      if (!section.hasAttribute("data-reveal")) {
        section.setAttribute("data-reveal", "");
      }
    });

    var revealElements = document.querySelectorAll("[data-reveal], [data-reveal-child]");
    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-reveal-delay"), 10) || 0;

        setTimeout(function () {
          el.classList.add("is-revealed");
        }, delay);

        observer.unobserve(el);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(function (el, index) {
      if (!el.hasAttribute("data-reveal-delay") && el.hasAttribute("data-reveal-child")) {
        el.setAttribute("data-reveal-delay", String((index % 8) * 80));
      }
      observer.observe(el);
    });
  }

  function initInstagramLinks() {
    const instagramUrl = "https://www.instagram.com/markajantlastik";
    document.querySelectorAll("[data-instagram-link]").forEach(function (link) {
      link.href = instagramUrl;
    });
  }

  function ensureBootstrapIcons() {
    var iconsHref = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
    if (!document.querySelector('link[href="' + iconsHref + '"]')) {
      var iconsLink = document.createElement("link");
      iconsLink.rel = "stylesheet";
      iconsLink.href = iconsHref;
      document.head.appendChild(iconsLink);
    }
  }

  ensureBootstrapIcons();
  initAllLightboxes();
  initRevealAnimations();
  initInstagramLinks();

  /* Stats counter — bağımsız modül */
  (function initStatsSectionCounters() {
    var statsSection = document.getElementById("stats");
    if (!statsSection) return;

    var values = statsSection.querySelectorAll(".stats__value[data-count]");
    if (!values.length) return;

    var DURATION = 2000;

    function formatValue(el, value) {
      var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var formatted = decimals ? value.toFixed(decimals) : Math.floor(value).toString();
      return prefix + formatted + suffix;
    }

    function animateValue(el) {
      if (el.dataset.counted === "true") return;
      el.dataset.counted = "true";

      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;

      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / DURATION, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;

        el.textContent = formatValue(el, current);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatValue(el, target);
        }
      }

      requestAnimationFrame(step);
    }

    function startCounters() {
      if (statsSection.dataset.countersStarted === "true") return;
      statsSection.dataset.countersStarted = "true";
      values.forEach(animateValue);
    }

    if (!("IntersectionObserver" in window)) {
      startCounters();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        startCounters();
        observer.disconnect();
      });
    }, {
      threshold: 0.25,
      rootMargin: "0px 0px -5% 0px"
    });

    observer.observe(statsSection);
  })();

  /* Floating action buttons (Phone & WhatsApp) */
  function initFloatingActions() {
    if (document.querySelector(".fab-group")) return;

    ensureBootstrapIcons();

    var group = document.createElement("div");
    group.className = "fab-group";

    var phoneLink = document.createElement("a");
    phoneLink.className = "fab fab--phone";
    phoneLink.href = "tel:+905449483197";
    phoneLink.setAttribute("aria-label", "Hemen ara");

    var phoneTooltip = document.createElement("span");
    phoneTooltip.className = "fab__tooltip";
    phoneTooltip.textContent = "Hemen Ara";

    var phoneIcon = document.createElement("i");
    phoneIcon.className = "bi bi-telephone-fill fab__icon";
    phoneIcon.setAttribute("aria-hidden", "true");

    phoneLink.appendChild(phoneTooltip);
    phoneLink.appendChild(phoneIcon);

    var whatsappLink = document.createElement("a");
    whatsappLink.className = "fab fab--whatsapp";
    whatsappLink.href = "https://wa.me/905449483197";
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
    whatsappLink.setAttribute("aria-label", "WhatsApp'tan yazın");

    var whatsappTooltip = document.createElement("span");
    whatsappTooltip.className = "fab__tooltip";
    whatsappTooltip.textContent = "WhatsApp'tan Yazın";

    var whatsappIcon = document.createElement("i");
    whatsappIcon.className = "bi bi-whatsapp fab__icon";
    whatsappIcon.setAttribute("aria-hidden", "true");

    whatsappLink.appendChild(whatsappTooltip);
    whatsappLink.appendChild(whatsappIcon);

    group.appendChild(phoneLink);
    group.appendChild(whatsappLink);
    document.body.appendChild(group);
  }

  initFloatingActions();
})();
