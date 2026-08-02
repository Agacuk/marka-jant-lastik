/**
 * Premium hero slider — unified overlay layout
 */
(function () {
  "use strict";

  var hero = document.getElementById("hero");
  if (!hero) return;

  var viewport = hero.querySelector("[data-hero-slider]");
  if (!viewport) return;

  var slides = Array.prototype.slice.call(viewport.querySelectorAll("[data-hero-slide]"));
  var panels = Array.prototype.slice.call(viewport.querySelectorAll("[data-hero-content]"));
  var prevBtn = viewport.querySelector("[data-hero-prev]");
  var nextBtn = viewport.querySelector("[data-hero-next]");
  var dotsHost = viewport.querySelector("[data-hero-dots]");

  if (!slides.length) return;

  var index = 0;
  var timer = null;
  var dragging = false;
  var dragStartX = 0;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var INTERVAL = 3000;
  var TRANSITION = 1100;

  function slideImageSrc(img) {
    if (window.matchMedia("(max-width: 768px)").matches && img.getAttribute("data-src-mobile")) {
      return img.getAttribute("data-src-mobile");
    }
    return img.getAttribute("data-src") || img.getAttribute("src");
  }

  function preloadSlide(slideEl) {
    var img = slideEl.querySelector("[data-hero-img]");
    if (!img || img.dataset.preloaded === "true") return;
    var src = slideImageSrc(img);
    if (!src || img.getAttribute("src") === src) {
      img.dataset.preloaded = "true";
      return;
    }
    img.src = src;
    img.dataset.preloaded = "true";
  }

  function restartKenBurns(slideEl) {
    var img = slideEl.querySelector(".hero__bg-img");
    if (!img || reducedMotion) return;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "";
  }

  function renderDots() {
    if (!dotsHost) return;
    dotsHost.innerHTML = slides
      .map(function (_s, i) {
        return (
          '<button type="button" class="hero__dot' +
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

    hero.classList.remove("hero--slide-0", "hero--slide-1", "hero--slide-2");
    hero.classList.add("hero--slide-" + index);

    if (dotsHost) {
      dotsHost.querySelectorAll("[data-hero-dot]").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    preloadSlide(slides[index]);
    preloadSlide(slides[(index + 1) % slides.length]);
  }

  function goTo(nextIndex, userTriggered) {
    var n = (nextIndex + slides.length) % slides.length;
    if (n === index) return;
    index = n;
    updateView();
    if (userTriggered) restartAutoplay();
  }

  function next(userTriggered) { goTo(index + 1, userTriggered); }
  function prev(userTriggered) { goTo(index - 1, userTriggered); }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  function startAutoplay() {
    if (reducedMotion || slides.length < 2) return;
    timer = window.setInterval(function () { next(false); }, INTERVAL);
  }

  function stopAutoplay() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true;
    dragStartX = e.clientX;
    stopAutoplay();
    hero.classList.add("is-dragging");
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    hero.classList.remove("is-dragging");
    var dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 56) {
      if (dx < 0) next(true);
      else prev(true);
    } else {
      startAutoplay();
    }
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { prev(true); });
  if (nextBtn) nextBtn.addEventListener("click", function () { next(true); });

  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointerup", onPointerUp);
  viewport.addEventListener("pointercancel", onPointerUp);

  hero.addEventListener("mouseenter", stopAutoplay);
  hero.addEventListener("mouseleave", startAutoplay);

  document.addEventListener("keydown", function (e) {
    if (!hero.contains(document.activeElement) && !hero.matches(":hover")) return;
    if (e.key === "ArrowLeft") prev(true);
    if (e.key === "ArrowRight") next(true);
    if (e.key === "Escape") stopAutoplay();
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
