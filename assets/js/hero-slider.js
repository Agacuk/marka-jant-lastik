/**
 * Premium hero background slider — index only
 */
(function () {
  "use strict";

  var hero = document.getElementById("hero");
  if (!hero) return;

  var slider = hero.querySelector("[data-hero-slider]");
  if (!slider) return;

  var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
  var panels = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-content]"));
  var prevBtn = slider.querySelector("[data-hero-prev]");
  var nextBtn = slider.querySelector("[data-hero-next]");
  var dotsHost = slider.querySelector("[data-hero-dots]");

  if (!slides.length) return;

  var index = 0;
  var timer = null;
  var dragging = false;
  var dragStartX = 0;
  var dragMoved = false;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var INTERVAL = 3000;
  var TRANSITION = 1050;

  function slideImageSrc(img) {
    if (
      window.matchMedia("(max-width: 768px)").matches &&
      img.getAttribute("data-src-mobile")
    ) {
      return img.getAttribute("data-src-mobile");
    }
    return img.getAttribute("data-src") || img.getAttribute("src");
  }

  function preloadSlide(slideEl) {
    var img = slideEl.querySelector("img[data-hero-img]");
    if (!img || img.dataset.preloaded === "true") return;
    var src = slideImageSrc(img);
    if (!src) return;
    if (img.getAttribute("src") === src) {
      img.dataset.preloaded = "true";
      return;
    }
    img.src = src;
    img.dataset.preloaded = "true";
  }

  function preloadAdjacent() {
    preloadSlide(slides[index]);
    preloadSlide(slides[(index + 1) % slides.length]);
  }

  function renderDots() {
    if (!dotsHost) return;
    dotsHost.innerHTML = slides
      .map(function (_slide, i) {
        return (
          '<button type="button" class="hero-slider__dot' +
          (i === index ? " is-active" : "") +
          '" data-hero-dot="' +
          i +
          '" aria-label="Slide ' +
          (i + 1) +
          '"></button>'
        );
      })
      .join("");

    dotsHost.querySelectorAll("[data-hero-dot]").forEach(function (dot) {
      dot.addEventListener("click", function () {
        goTo(parseInt(dot.getAttribute("data-hero-dot"), 10), true);
      });
    });
  }

  function restartKenBurns(slideEl) {
    var img = slideEl.querySelector(".hero-slider__img");
    if (!img || reducedMotion) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "";
  }

  function updateView() {
    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      if (active) restartKenBurns(slide);
    });

    panels.forEach(function (panel, i) {
      var active = i === index;
      panel.classList.toggle("is-active", active);
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });

    var activePanel = panels[index];
    var hasCopy = activePanel && !activePanel.classList.contains("hero__copy-panel--empty");
    hero.classList.toggle("hero--has-copy", Boolean(hasCopy));

    if (dotsHost) {
      dotsHost.querySelectorAll("[data-hero-dot]").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    preloadAdjacent();
  }

  function goTo(nextIndex, userTriggered) {
    var normalized = (nextIndex + slides.length) % slides.length;
    if (normalized === index) return;
    index = normalized;
    updateView();
    if (userTriggered) restartAutoplay();
  }

  function next(userTriggered) {
    goTo(index + 1, userTriggered);
  }

  function prev(userTriggered) {
    goTo(index - 1, userTriggered);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  function startAutoplay() {
    if (reducedMotion || slides.length < 2) return;
    timer = window.setInterval(function () {
      next(false);
    }, INTERVAL);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    dragStartX = e.clientX;
    stopAutoplay();
    hero.classList.add("is-slider-dragging");
  }

  function onPointerMove(e) {
    if (!dragging) return;
    if (Math.abs(e.clientX - dragStartX) > 8) dragMoved = true;
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    hero.classList.remove("is-slider-dragging");
    var dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 56) {
      if (dx < 0) next(true);
      else prev(true);
    } else {
      startAutoplay();
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      prev(true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      next(true);
    });
  }

  slider.addEventListener("pointerdown", onPointerDown);
  slider.addEventListener("pointermove", onPointerMove);
  slider.addEventListener("pointerup", onPointerUp);
  slider.addEventListener("pointercancel", onPointerUp);

  hero.addEventListener("mouseenter", stopAutoplay);
  hero.addEventListener("mouseleave", startAutoplay);
  hero.addEventListener("focusin", stopAutoplay);
  hero.addEventListener("focusout", startAutoplay);

  document.addEventListener("keydown", function (e) {
    if (!hero.matches(":hover") && document.activeElement && !hero.contains(document.activeElement)) {
      return;
    }
    if (e.key === "ArrowLeft") prev(true);
    if (e.key === "ArrowRight") next(true);
  });

  renderDots();
  updateView();
  startAutoplay();

  window.setTimeout(function () {
    slides.forEach(function (slide, i) {
      if (i > 0) preloadSlide(slide);
    });
  }, TRANSITION + 200);

  hero.classList.add("is-loaded");
})();
