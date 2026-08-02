/**
 * Premium 2. El Jantlar — carousel + modal
 */
(function () {
  "use strict";

  var catalog = window.UsedWheelsCatalog;
  if (!catalog || !catalog.items || !catalog.items.length) return;

  var root = document.querySelector("[data-used-wheels]");
  if (!root) return;

  var viewport = root.querySelector(".used-wheels-carousel__viewport");
  var track = root.querySelector(".used-wheels-carousel__track");
  var prevBtn = root.querySelector(".used-wheels-carousel__nav--prev");
  var nextBtn = root.querySelector(".used-wheels-carousel__nav--next");

  var modal = null;
  var modalState = { item: null, imageIndex: 0 };
  var drag = { active: false, moved: false, startX: 0, scrollLeft: 0, pointerId: null };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pictureSources(img) {
    if (img.webp) {
      return (
        '<source type="image/webp" srcset="' +
        escapeHtml(img.webp) +
        '">' +
        '<img class="used-wheels-card__img" src="' +
        escapeHtml(img.jpg) +
        '" alt="' +
        escapeHtml(img.alt || "") +
        '" loading="lazy" decoding="async" width="' +
        (img.width || "") +
        '" height="' +
        (img.height || "") +
        '">'
      );
    }
    return (
      '<img class="used-wheels-card__img" src="' +
      escapeHtml(img.jpg) +
      '" alt="' +
      escapeHtml(img.alt || "") +
      '" loading="lazy" decoding="async">'
    );
  }

  function renderSpecs(specs, className) {
    if (!specs || !specs.length) return "";
    return (
      '<ul class="' +
      className +
      '">' +
      specs
        .map(function (spec) {
          return '<li class="' + className + "__spec" + '">' + escapeHtml(spec.label) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function renderCards() {
    track.innerHTML = catalog.items
      .map(function (item, index) {
        var primary = item.images && item.images[0] ? item.images[0] : item;
        var status = item.status || catalog.defaultStatus;
        var tone = status.tone || "in-stock";

        return (
          '<button type="button" class="used-wheels-card" data-index="' +
          index +
          '" aria-label="' +
          escapeHtml(item.title) +
          ' detayını aç">' +
          '<div class="used-wheels-card__inner">' +
          '<div class="used-wheels-card__media">' +
          '<span class="used-wheels-card__status used-wheels-card__status--' +
          escapeHtml(tone) +
          '">' +
          escapeHtml(status.icon || "") +
          " " +
          escapeHtml(status.label || "Stokta") +
          "</span>" +
          '<div class="used-wheels-card__placeholder" aria-hidden="true"></div>' +
          "<picture>" +
          pictureSources({
            jpg: primary.jpg || item.jpg,
            webp: primary.webp || item.webp,
            alt: item.title,
            width: item.width,
            height: item.height,
          }) +
          "</picture>" +
          "</div>" +
          '<div class="used-wheels-card__body">' +
          "<h3 class=\"used-wheels-card__title\">" +
          escapeHtml(item.title) +
          "</h3>" +
          renderSpecs(item.specs, "used-wheels-card__specs") +
          "</div>" +
          "</div>" +
          "</button>"
        );
      })
      .join("");

    track.querySelectorAll(".used-wheels-card__img").forEach(function (img) {
      if (img.complete && img.naturalWidth) {
        img.classList.add("is-loaded");
      } else {
        img.addEventListener("load", function () {
          img.classList.add("is-loaded");
        });
      }
    });
  }

  function ensureModal() {
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "used-wheels-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="used-wheels-modal__backdrop" data-modal-close></div>' +
      '<div class="used-wheels-modal__dialog">' +
      '<button type="button" class="used-wheels-modal__close" aria-label="Kapat" data-modal-close>&times;</button>' +
      '<div class="used-wheels-modal__gallery">' +
      '<button type="button" class="used-wheels-modal__gal-nav used-wheels-modal__gal-nav--prev" aria-label="Önceki fotoğraf">&lsaquo;</button>' +
      '<picture class="used-wheels-modal__picture"></picture>' +
      '<button type="button" class="used-wheels-modal__gal-nav used-wheels-modal__gal-nav--next" aria-label="Sonraki fotoğraf">&rsaquo;</button>' +
      "</div>" +
      '<div class="used-wheels-modal__content">' +
      '<h2 class="used-wheels-modal__title"></h2>' +
      '<ul class="used-wheels-modal__specs"></ul>' +
      '<div class="used-wheels-modal__vehicles-wrap" hidden>' +
      '<p class="used-wheels-modal__block-title">Uyumlu Araçlar</p>' +
      '<ul class="used-wheels-modal__vehicles"></ul>' +
      "</div>" +
      '<div class="used-wheels-modal__status-wrap"></div>' +
      '<div class="used-wheels-modal__actions">' +
      '<a class="hero__btn hero__btn--whatsapp used-wheels-modal__whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp\'tan Bilgi Al</a>' +
      '<a class="hero__btn used-wheels-modal__phone" href="' +
      escapeHtml(catalog.phoneUrl || "tel:+905449483197") +
      '">Telefonla Ara</a>' +
      "</div>" +
      "</div>" +
      "</div>";

    document.body.appendChild(modal);

    modal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    modal.querySelector(".used-wheels-modal__gal-nav--prev").addEventListener("click", function () {
      shiftModalImage(-1);
    });
    modal.querySelector(".used-wheels-modal__gal-nav--next").addEventListener("click", function () {
      shiftModalImage(1);
    });

    document.addEventListener("keydown", onModalKeydown);

    return modal;
  }

  function updateModalGallery() {
    var item = modalState.item;
    if (!item) return;

    var images = item.images && item.images.length ? item.images : [{ jpg: item.jpg, webp: item.webp, alt: item.title }];
    var idx = modalState.imageIndex;
    var current = images[idx];
    var picture = modal.querySelector(".used-wheels-modal__picture");

    picture.innerHTML =
      (current.webp
        ? '<source type="image/webp" srcset="' + escapeHtml(current.webp) + '">'
        : "") +
      '<img class="used-wheels-modal__img" src="' +
      escapeHtml(current.jpg) +
      '" alt="' +
      escapeHtml(current.alt || item.title) +
      '">';

    var prev = modal.querySelector(".used-wheels-modal__gal-nav--prev");
    var next = modal.querySelector(".used-wheels-modal__gal-nav--next");
    prev.disabled = idx <= 0;
    next.disabled = idx >= images.length - 1;
    prev.hidden = images.length <= 1;
    next.hidden = images.length <= 1;
  }

  function openModal(index) {
    var item = catalog.items[index];
    if (!item) return;

    ensureModal();
    modalState.item = item;
    modalState.imageIndex = 0;

    modal.querySelector(".used-wheels-modal__title").textContent = item.title;

    var specsEl = modal.querySelector(".used-wheels-modal__specs");
    specsEl.innerHTML = (item.specs || [])
      .map(function (spec) {
        return '<li class="used-wheels-modal__spec">' + escapeHtml(spec.label) + "</li>";
      })
      .join("");

    var vehiclesWrap = modal.querySelector(".used-wheels-modal__vehicles-wrap");
    var vehiclesEl = modal.querySelector(".used-wheels-modal__vehicles");
    if (item.vehicles && item.vehicles.length) {
      vehiclesWrap.hidden = false;
      vehiclesEl.innerHTML = item.vehicles
        .map(function (v) {
          return "<li>" + escapeHtml(v) + "</li>";
        })
        .join("");
    } else {
      vehiclesWrap.hidden = true;
      vehiclesEl.innerHTML = "";
    }

    var status = item.status || catalog.defaultStatus;
    modal.querySelector(".used-wheels-modal__status-wrap").innerHTML =
      '<span class="used-wheels-modal__status">' +
      escapeHtml(status.icon || "") +
      " " +
      escapeHtml(status.label || "Stokta") +
      "</span>";

    modal.querySelector(".used-wheels-modal__whatsapp").href =
      item.whatsappUrl || catalog.whatsappUrl;

    updateModalGallery();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".used-wheels-modal__close").focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalState.item = null;
    modalState.imageIndex = 0;
  }

  function shiftModalImage(delta) {
    var item = modalState.item;
    if (!item) return;
    var images = item.images && item.images.length ? item.images : [{ jpg: item.jpg, webp: item.webp }];
    var next = modalState.imageIndex + delta;
    if (next < 0 || next >= images.length) return;
    modalState.imageIndex = next;
    updateModalGallery();
  }

  function onModalKeydown(e) {
    if (!modal || !modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") shiftModalImage(-1);
    if (e.key === "ArrowRight") shiftModalImage(1);
  }

  function cardWidth() {
    var card = track.querySelector(".used-wheels-card");
    if (!card) return viewport.clientWidth;
    var styles = getComputedStyle(track);
    var gap = parseFloat(styles.gap) || 0;
    return card.offsetWidth + gap;
  }

  function updateNav() {
    var maxScroll = viewport.scrollWidth - viewport.clientWidth;
    prevBtn.disabled = viewport.scrollLeft <= 2;
    nextBtn.disabled = viewport.scrollLeft >= maxScroll - 2;
  }

  function scrollByCards(dir) {
    viewport.scrollBy({ left: dir * cardWidth(), behavior: "smooth" });
  }

  function onWheel(e) {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    viewport.scrollLeft += e.deltaY;
  }

  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.active = true;
    drag.moved = false;
    drag.startX = e.clientX;
    drag.scrollLeft = viewport.scrollLeft;
    drag.pointerId = e.pointerId;
    viewport.classList.add("is-dragging");
    try {
      viewport.setPointerCapture(e.pointerId);
    } catch (_err) {}
  }

  function onPointerMove(e) {
    if (!drag.active) return;
    var dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 4) drag.moved = true;
    viewport.scrollLeft = drag.scrollLeft - dx;
  }

  function onPointerUp(e) {
    if (!drag.active) return;
    drag.active = false;
    viewport.classList.remove("is-dragging");
    if (drag.pointerId != null) {
      try {
        viewport.releasePointerCapture(drag.pointerId);
      } catch (_err) {}
    }
    drag.pointerId = null;
  }

  track.addEventListener("click", function (e) {
    if (drag.moved) {
      drag.moved = false;
      return;
    }
    var card = e.target.closest(".used-wheels-card");
    if (!card) return;
    var index = parseInt(card.getAttribute("data-index"), 10);
    if (!Number.isNaN(index)) openModal(index);
  });

  viewport.addEventListener("scroll", updateNav, { passive: true });
  viewport.addEventListener("wheel", onWheel, { passive: false });
  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerUp);
  viewport.addEventListener("pointercancel", onPointerUp);

  prevBtn.addEventListener("click", function () {
    scrollByCards(-1);
  });
  nextBtn.addEventListener("click", function () {
    scrollByCards(1);
  });

  viewport.setAttribute("tabindex", "0");
  viewport.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCards(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCards(1);
    }
  });

  function renderCta() {
    var ctaHost = document.querySelector("[data-used-wheels-cta]");
    if (!ctaHost) return;
    ctaHost.innerHTML =
      '<div class="used-wheels-cta">' +
      '<h3 class="used-wheels-cta__title">Aradığınız jantı bulamadınız mı?</h3>' +
      '<p class="used-wheels-cta__text">Stoklarımız sürekli güncellenir. WhatsApp üzerinden bize yazın, size uygun premium 2. el jantları birlikte seçelim.</p>' +
      '<a class="hero__btn hero__btn--whatsapp" href="' +
      escapeHtml(catalog.whatsappUrl || "https://wa.me/905449483197") +
      '" target="_blank" rel="noopener noreferrer">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      "WhatsApp'tan Bilgi Al" +
      "</a>" +
      "</div>";
  }

  renderCards();
  renderCta();
  updateNav();
  window.addEventListener("resize", updateNav);
})();
