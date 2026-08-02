/**
 * Premium 2. El Jantlar — carousel + lightbox modal
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

  var lightbox = null;
  var lbState = { itemIndex: 0, imageIndex: 0, scale: 1, tx: 0, ty: 0 };
  var drag = {
    pointerId: null,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    dragging: false,
    suppressClick: false,
  };
  var pinch = { active: false, startDist: 0, startScale: 1 };
  var swipe = { startX: 0, startY: 0, active: false };

  var DRAG_THRESHOLD = 14;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function specLine(specs) {
    if (!specs || !specs.length) return "";
    return specs.map(function (spec) {
      return spec.label;
    }).join(" • ");
  }

  function pictureSources(img, className) {
    var cls = className || "used-wheels-card__img";
    if (img.webp) {
      return (
        '<source type="image/webp" srcset="' +
        escapeHtml(img.webp) +
        '"><img class="' +
        cls +
        '" src="' +
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
      '<img class="' +
      cls +
      '" src="' +
      escapeHtml(img.jpg) +
      '" alt="' +
      escapeHtml(img.alt || "") +
      '" loading="lazy" decoding="async">'
    );
  }

  function renderCards() {
    track.innerHTML = catalog.items
      .map(function (item, index) {
        var primary = item.images && item.images[0] ? item.images[0] : item;
        var status = item.status || catalog.defaultStatus;
        var tone = status.tone || "in-stock";
        var line = specLine(item.specs);

        return (
          '<button type="button" class="used-wheels-card" data-uw-index="' +
          index +
          '" aria-label="' +
          escapeHtml(item.title + (line ? " — " + line : "")) +
          '">' +
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
          "</picture></div>" +
          '<div class="used-wheels-card__body">' +
          '<h3 class="used-wheels-card__title">' +
          escapeHtml(item.title) +
          "</h3>" +
          (line
            ? '<p class="used-wheels-card__specline">' + escapeHtml(line) + "</p>"
            : "") +
          "</div></div></button>"
        );
      })
      .join("");

    track.querySelectorAll(".used-wheels-card__img").forEach(function (img) {
      if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
      else img.addEventListener("load", function () { img.classList.add("is-loaded"); });
    });

    track.querySelectorAll(".used-wheels-card").forEach(function (card) {
      card.addEventListener("click", onCardClick);
    });
  }

  function onCardClick(e) {
    if (drag.suppressClick) {
      drag.suppressClick = false;
      return;
    }
    var card = e.currentTarget;
    var index = parseInt(card.getAttribute("data-uw-index"), 10);
    if (Number.isNaN(index)) return;
    e.preventDefault();
    openLightbox(index);
  }

  function currentItem() {
    return catalog.items[lbState.itemIndex] || null;
  }

  function itemImages(item) {
    if (item.images && item.images.length) return item.images;
    return [{ jpg: item.jpg, webp: item.webp, alt: item.title }];
  }

  function ensureLightbox() {
    if (lightbox) return lightbox;

    lightbox = document.createElement("div");
    lightbox.className = "uw-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML =
      '<div class="uw-lightbox__backdrop" data-uw-close tabindex="-1"></div>' +
      '<div class="uw-lightbox__shell">' +
      '<button type="button" class="uw-lightbox__close" data-uw-close aria-label="Kapat">&times;</button>' +
      '<button type="button" class="uw-lightbox__wheel-nav uw-lightbox__wheel-nav--prev" aria-label="Önceki jant">&lsaquo;</button>' +
      '<button type="button" class="uw-lightbox__wheel-nav uw-lightbox__wheel-nav--next" aria-label="Sonraki jant">&rsaquo;</button>' +
      '<div class="uw-lightbox__layout">' +
      '<div class="uw-lightbox__media-col">' +
      '<div class="uw-lightbox__stage" data-uw-stage>' +
      '<div class="uw-lightbox__zoom" data-uw-zoom>' +
      '<img class="uw-lightbox__img" data-uw-img alt="" decoding="async">' +
      "</div></div>" +
      '<div class="uw-lightbox__thumbs" data-uw-thumbs hidden></div></div>' +
      '<div class="uw-lightbox__info">' +
      '<h2 class="uw-lightbox__title" data-uw-title></h2>' +
      '<p class="uw-lightbox__specline" data-uw-specline hidden></p>' +
      '<div class="uw-lightbox__status" data-uw-status></div>' +
      '<div class="uw-lightbox__actions">' +
      '<a class="hero__btn hero__btn--whatsapp" data-uw-whatsapp target="_blank" rel="noopener noreferrer">WhatsApp\'tan Bilgi Al</a>' +
      '<a class="hero__btn uw-lightbox__phone" data-uw-phone href="' +
      escapeHtml(catalog.phoneUrl || "tel:+905449483197") +
      '">Telefonla Ara</a>' +
      "</div></div></div></div>";

    document.body.appendChild(lightbox);

    lightbox.querySelectorAll("[data-uw-close]").forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });

    lightbox.querySelector(".uw-lightbox__wheel-nav--prev").addEventListener("click", function () {
      shiftWheel(-1);
    });
    lightbox.querySelector(".uw-lightbox__wheel-nav--next").addEventListener("click", function () {
      shiftWheel(1);
    });

    var stage = lightbox.querySelector("[data-uw-stage]");
    var zoomEl = lightbox.querySelector("[data-uw-zoom]");
    var img = lightbox.querySelector("[data-uw-img]");

    img.addEventListener("dblclick", function () {
      if (lbState.scale > 1) resetZoom();
      else setZoom(2);
    });

    stage.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false }
    );

    lightbox.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      { passive: false }
    );

    stage.addEventListener("touchstart", onStageTouchStart, { passive: false });
    stage.addEventListener("touchmove", onStageTouchMove, { passive: false });
    stage.addEventListener("touchend", onStageTouchEnd, { passive: true });

    document.addEventListener("keydown", onLightboxKeydown);

    return lightbox;
  }

  function applyZoomTransform() {
    var zoomEl = lightbox.querySelector("[data-uw-zoom]");
    if (!zoomEl) return;
    zoomEl.style.transform =
      "translate(" + lbState.tx + "px," + lbState.ty + "px) scale(" + lbState.scale + ")";
    lightbox.classList.toggle("is-zoomed", lbState.scale > 1);
  }

  function resetZoom() {
    lbState.scale = 1;
    lbState.tx = 0;
    lbState.ty = 0;
    applyZoomTransform();
  }

  function setZoom(scale) {
    lbState.scale = Math.max(1, Math.min(3, scale));
    if (lbState.scale === 1) {
      lbState.tx = 0;
      lbState.ty = 0;
    }
    applyZoomTransform();
  }

  function touchDistance(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function onStageTouchStart(e) {
    if (e.touches.length === 2) {
      pinch.active = true;
      pinch.startDist = touchDistance(e.touches);
      pinch.startScale = lbState.scale;
      swipe.active = false;
      e.preventDefault();
      return;
    }
    if (e.touches.length === 1 && lbState.scale === 1) {
      swipe.active = true;
      swipe.startX = e.touches[0].clientX;
      swipe.startY = e.touches[0].clientY;
    }
  }

  function onStageTouchMove(e) {
    if (pinch.active && e.touches.length === 2) {
      var dist = touchDistance(e.touches);
      setZoom(pinch.startScale * (dist / pinch.startDist));
      e.preventDefault();
      return;
    }
    if (swipe.active && e.touches.length === 1 && lbState.scale === 1) {
      var dx = e.touches[0].clientX - swipe.startX;
      var dy = e.touches[0].clientY - swipe.startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) e.preventDefault();
    }
  }

  function onStageTouchEnd(e) {
    if (pinch.active) {
      pinch.active = false;
      return;
    }
    if (swipe.active && lbState.scale === 1 && e.changedTouches.length) {
      var dx = e.changedTouches[0].clientX - swipe.startX;
      var dy = e.changedTouches[0].clientY - swipe.startY;
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy)) {
        shiftWheel(dx < 0 ? 1 : -1);
      }
    }
    swipe.active = false;
  }

  function updateLightboxView() {
    var item = currentItem();
    if (!item || !lightbox) return;

    var images = itemImages(item);
    if (lbState.imageIndex >= images.length) lbState.imageIndex = 0;

    var current = images[lbState.imageIndex];
    var img = lightbox.querySelector("[data-uw-img]");
    resetZoom();
    img.src = current.jpg || item.jpg;
    img.alt = current.alt || item.title;

    lightbox.querySelector("[data-uw-title]").textContent = item.title;

    var line = specLine(item.specs);
    var lineEl = lightbox.querySelector("[data-uw-specline]");
    if (item.specs && item.specs.length) {
      lineEl.hidden = false;
      lineEl.innerHTML = item.specs
        .map(function (spec) {
          return escapeHtml(spec.label);
        })
        .join("<br>");
    } else {
      lineEl.hidden = true;
      lineEl.innerHTML = "";
    }

    var status = item.status || catalog.defaultStatus;
    lightbox.querySelector("[data-uw-status]").innerHTML =
      escapeHtml(status.icon || "") + " " + escapeHtml(status.label || "Stokta");

    lightbox.querySelector("[data-uw-whatsapp]").href =
      item.whatsappUrl || catalog.whatsappUrl;

    var thumbs = lightbox.querySelector("[data-uw-thumbs]");
    if (images.length > 1) {
      thumbs.hidden = false;
      thumbs.innerHTML = images
        .map(function (imgObj, idx) {
          return (
            '<button type="button" class="uw-lightbox__thumb' +
            (idx === lbState.imageIndex ? " is-active" : "") +
            '" data-uw-thumb="' +
            idx +
            '" aria-label="Fotoğraf ' +
            (idx + 1) +
            '">' +
            '<img src="' +
            escapeHtml(imgObj.jpg) +
            '" alt="" loading="lazy" decoding="async">' +
            "</button>"
          );
        })
        .join("");

      thumbs.querySelectorAll("[data-uw-thumb]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          lbState.imageIndex = parseInt(btn.getAttribute("data-uw-thumb"), 10);
          updateLightboxView();
        });
      });
    } else {
      thumbs.hidden = true;
      thumbs.innerHTML = "";
    }

    var prevWheel = lightbox.querySelector(".uw-lightbox__wheel-nav--prev");
    var nextWheel = lightbox.querySelector(".uw-lightbox__wheel-nav--next");
    prevWheel.disabled = lbState.itemIndex <= 0;
    nextWheel.disabled = lbState.itemIndex >= catalog.items.length - 1;
  }

  function openLightbox(itemIndex) {
    ensureLightbox();
    lbState.itemIndex = itemIndex;
    lbState.imageIndex = 0;
    updateLightboxView();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("uw-lightbox-open");
    lightbox.querySelector(".uw-lightbox__close").focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("uw-lightbox-open");
    resetZoom();
  }

  function shiftWheel(delta) {
    var next = lbState.itemIndex + delta;
    if (next < 0 || next >= catalog.items.length) return;
    lbState.itemIndex = next;
    lbState.imageIndex = 0;
    updateLightboxView();
  }

  function onLightboxKeydown(e) {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") shiftWheel(-1);
    if (e.key === "ArrowRight") shiftWheel(1);
  }

  function cardWidth() {
    var card = track.querySelector(".used-wheels-card");
    if (!card) return viewport.clientWidth;
    var gap = parseFloat(getComputedStyle(track).gap) || 0;
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
    if (lightbox && lightbox.classList.contains("is-open")) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    viewport.scrollLeft += e.deltaY;
  }

  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.pointerId = e.pointerId;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.scrollLeft = viewport.scrollLeft;
    drag.dragging = false;
  }

  function onPointerMove(e) {
    if (drag.pointerId !== e.pointerId) return;
    var dx = e.clientX - drag.startX;
    var dy = e.clientY - drag.startY;
    if (!drag.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      drag.dragging = true;
      viewport.classList.add("is-dragging");
    }
    e.preventDefault();
    viewport.scrollLeft = drag.scrollLeft - dx;
  }

  function onPointerUp(e) {
    if (drag.pointerId !== e.pointerId) return;
    if (drag.dragging) drag.suppressClick = true;
    drag.dragging = false;
    drag.pointerId = null;
    viewport.classList.remove("is-dragging");
  }

  viewport.addEventListener("scroll", updateNav, { passive: true });
  viewport.addEventListener("wheel", onWheel, { passive: false });
  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerUp);
  viewport.addEventListener("pointercancel", onPointerUp);

  prevBtn.addEventListener("click", function () { scrollByCards(-1); });
  nextBtn.addEventListener("click", function () { scrollByCards(1); });

  viewport.setAttribute("tabindex", "0");
  viewport.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); scrollByCards(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); scrollByCards(1); }
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
      '" target="_blank" rel="noopener noreferrer">WhatsApp\'tan Bilgi Al</a>' +
      "</div>";
  }

  renderCards();
  renderCta();
  updateNav();
  window.addEventListener("resize", updateNav);
})();
