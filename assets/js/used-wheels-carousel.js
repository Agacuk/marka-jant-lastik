/**
 * 2. El Jantlar — horizontal carousel (bağımsız, reusable)
 */
(function () {
  "use strict";

  var SCROLL_EPS = 4;

  function supportsWebP(callback) {
    var img = new Image();
    img.onload = function () {
      callback(img.width === 1);
    };
    img.onerror = function () {
      callback(false);
    };
    img.src =
      "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v/uQAAA=";
  }

  function createCard(item, useWebP) {
    var article = document.createElement("article");
    article.className = "used-wheels-card";
    article.setAttribute("role", "listitem");

    var media = document.createElement("div");
    media.className = "used-wheels-card__media";

    var placeholder = document.createElement("div");
    placeholder.className = "used-wheels-card__placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    media.appendChild(placeholder);

    var img = document.createElement("img");
    img.className = "used-wheels-card__img";
    img.alt = item.alt || "2. el jant";
    img.decoding = "async";
    img.loading = "lazy";
    img.width = item.width || 1200;
    img.height = item.height || 900;

    var src = useWebP && item.webp ? item.webp : item.jpg;
    img.dataset.src = src;

    media.appendChild(img);
    article.appendChild(media);

    var badge = document.createElement("span");
    badge.className = "used-wheels-card__badge";
    badge.textContent = "2. El";
    article.appendChild(badge);

    return article;
  }

  function UsedWheelsCarousel(root) {
    this.root = root;
    this.viewport = root.querySelector("[data-used-wheels-track-viewport]");
    this.track = root.querySelector("[data-used-wheels-track]");
    this.prevBtn = root.querySelector("[data-used-wheels-prev]");
    this.nextBtn = root.querySelector("[data-used-wheels-next]");
    this.cards = [];
    this.useWebP = false;
    this.onScroll = this.updateNav.bind(this);
    this.onWheel = this.handleWheel.bind(this);
    this.onKeyDown = this.handleKeyDown.bind(this);
  }

  UsedWheelsCarousel.prototype.mount = function (items) {
    var self = this;
    if (!items.length) {
      this.root.hidden = true;
      return;
    }

    supportsWebP(function (ok) {
      self.useWebP = ok;
      self.track.innerHTML = "";
      self.cards = items.map(function (item) {
        var card = createCard(item, ok);
        self.track.appendChild(card);
        return card;
      });
      self.observeImages();
      self.bind();
      self.updateNav();
    });
  };

  UsedWheelsCarousel.prototype.bind = function () {
    var self = this;
    this.viewport.addEventListener("scroll", this.onScroll, { passive: true });
    this.viewport.addEventListener("wheel", this.onWheel, { passive: false });
    this.viewport.addEventListener("keydown", this.onKeyDown);
    this.prevBtn.addEventListener("click", function () {
      self.scrollByPage(-1);
    });
    this.nextBtn.addEventListener("click", function () {
      self.scrollByPage(1);
    });
    window.addEventListener("resize", this.onScroll);
  };

  UsedWheelsCarousel.prototype.getStep = function () {
    var first = this.cards[0];
    if (!first) return this.viewport.clientWidth * 0.8;
    var style = window.getComputedStyle(this.track);
    var gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  };

  UsedWheelsCarousel.prototype.scrollByPage = function (direction) {
    this.viewport.scrollBy({
      left: direction * this.getStep(),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  UsedWheelsCarousel.prototype.handleWheel = function (event) {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    this.viewport.scrollLeft += event.deltaY;
    event.preventDefault();
  };

  UsedWheelsCarousel.prototype.handleKeyDown = function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.scrollByPage(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this.scrollByPage(1);
    }
  };

  UsedWheelsCarousel.prototype.updateNav = function () {
    var maxScroll = this.viewport.scrollWidth - this.viewport.clientWidth;
    var left = this.viewport.scrollLeft;
    this.prevBtn.disabled = left <= SCROLL_EPS;
    this.nextBtn.disabled = left >= maxScroll - SCROLL_EPS;
  };

  UsedWheelsCarousel.prototype.observeImages = function () {
    var images = this.track.querySelectorAll("img[data-src]");
    if (!("IntersectionObserver" in window)) {
      images.forEach(loadImage);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          loadImage(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { root: this.viewport, rootMargin: "120px 0px", threshold: 0.01 }
    );

    images.forEach(function (img) {
      observer.observe(img);
    });
  };

  function loadImage(img) {
    var src = img.dataset.src;
    if (!src) return;

    function markLoaded() {
      img.classList.add("is-loaded");
      delete img.dataset.src;
    }

    function markError() {
      img.classList.add("is-error");
      delete img.dataset.src;
    }

    img.addEventListener("load", markLoaded, { once: true });
    img.addEventListener("error", markError, { once: true });
    img.src = src;
  }

  function renderCta(container, whatsappUrl) {
    var cta = document.createElement("div");
    cta.className = "used-wheels-cta";
    cta.innerHTML =
      '<h3 class="used-wheels-cta__title">Aradığınız jantı bulamadınız mı?</h3>' +
      '<p class="used-wheels-cta__text">Farklı ölçü ve modeller için bizimle iletişime geçin.</p>' +
      '<a href="' +
      whatsappUrl +
      '" class="hero__btn hero__btn--whatsapp" target="_blank" rel="noopener noreferrer">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
      "</svg> WhatsApp'tan Bilgi Al</a>";
    container.appendChild(cta);
  }

  function init() {
    var section = document.getElementById("ikinci-el-jantlar");
    var catalog = window.UsedWheelsCatalog;
    if (!section || !catalog || !catalog.items || !catalog.items.length) return;

    var carouselRoot = section.querySelector("[data-used-wheels-carousel]");
    var ctaHost = section.querySelector("[data-used-wheels-cta]");
    if (!carouselRoot) return;

    var carousel = new UsedWheelsCarousel(carouselRoot);
    carousel.mount(catalog.items);

    if (ctaHost) {
      renderCta(ctaHost, catalog.whatsappUrl);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
