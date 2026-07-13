/**
 * Marka Jant Lastik — Production Gallery Engine
 * Manifest tabanlı, probe yok, IntersectionObserver ile lazy image hydration.
 */
(function () {
  "use strict";

  const GALLERY_PER_PAGE = 8;
  const IMAGE_IO_ROOT_MARGIN = "240px 0px";
  const IMAGE_IO_THRESHOLD = 0.01;

  const GALLERY_MANIFEST = {
    jantlar: {
      folder: "assets/images/jantlar/",
      prefix: "jant-",
      total: 31
    },
    lastikler: {
      folder: "assets/images/lastikler/",
      prefix: "lastik-",
      total: 18
    },
    jantApplications: {
      folder: "assets/images/uygulamalar/jant/",
      prefix: "jant-uygulama-",
      total: 16
    },
    lastikApplications: {
      folder: "assets/images/uygulamalar/lastik/",
      prefix: "lastik-uygulama-",
      total: 16
    },
    homeApplications: {
      folder: "assets/images/uygulamalar/ana-sayfa/",
      prefix: "uygulama-",
      total: 8
    }
  };

  const GALLERY_ID_MAP = {
    jantlar: "jantlar",
    "jant-applications": "jantApplications",
    "lastik-applications": "lastikApplications",
    "home-applications": "homeApplications"
  };

  const HOVER_ICON_SVG =
    '<svg class="jantlar__hover-icon" width="28" height="28" viewBox="0 0 24 24" fill="none">' +
    '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>' +
    '<path d="M16 16l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M11 8v6M8 11h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
    "</svg>";

  const galleryRegistry = new Map();
  const loadMoreWrapCache = new Map();

  let imageObserver = null;
  let imageFallbackBound = false;

  /* ── Utilities ─────────────────────────────────────────────────────────── */

  function padImageNumber(num) {
    return String(num).padStart(3, "0");
  }

  function buildGalleryPath(folder, prefix, number) {
    const normalizedFolder = folder.endsWith("/") ? folder : folder + "/";
    return normalizedFolder + prefix + padImageNumber(number) + ".webp";
  }

  function runWhenIdle(callback) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(callback, { timeout: 1200 });
    } else {
      setTimeout(callback, 1);
    }
  }

  function resolveManifest(galleryId) {
    const manifestKey = GALLERY_ID_MAP[galleryId];
    return manifestKey ? GALLERY_MANIFEST[manifestKey] : null;
  }

  /* ── Image fallback (event delegation) ───────────────────────────────── */

  function markImageLoaded(img) {
    img.classList.add("is-loaded");
    img.classList.remove("is-error");
  }

  function markImageError(img) {
    img.classList.add("is-error");
    img.classList.remove("is-loaded");
  }

  function bindImageFallback(img) {
    if (img.dataset.fallbackBound === "true") return;
    img.dataset.fallbackBound = "true";

    img.addEventListener("load", () => markImageLoaded(img), { passive: true });
    img.addEventListener("error", () => markImageError(img), { passive: true });

    if (img.complete) {
      if (img.naturalWidth > 0) {
        markImageLoaded(img);
      } else {
        markImageError(img);
      }
    }
  }

  function initImageFallbackDelegation() {
    if (imageFallbackBound) return;
    imageFallbackBound = true;

    document.addEventListener(
      "load",
      (event) => {
        const img = event.target;
        if (!(img instanceof HTMLImageElement)) return;
        if (!img.classList.contains("jantlar__img")) return;
        markImageLoaded(img);
      },
      true
    );

    document.addEventListener(
      "error",
      (event) => {
        const img = event.target;
        if (!(img instanceof HTMLImageElement)) return;
        if (!img.classList.contains("jantlar__img")) return;
        markImageError(img);
      },
      true
    );
  }

  /* ── IntersectionObserver: lazy image hydration ────────────────────────── */

  function ensureImageObserver() {
    if (imageObserver || !("IntersectionObserver" in window)) return;

    imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          hydrateCardImage(entry.target);
          imageObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: IMAGE_IO_ROOT_MARGIN,
        threshold: IMAGE_IO_THRESHOLD
      }
    );
  }

  function observeCardImage(card) {
    if (!card || card.dataset.imageHydrated === "true") return;

    if (imageObserver) {
      imageObserver.observe(card);
      return;
    }

    hydrateCardImage(card);
  }

  function hydrateCardImage(card) {
    if (!card || card.dataset.imageHydrated === "true") return;

    const src = card.dataset.src;
    const media = card.querySelector(".jantlar__media");
    if (!src || !media) return;

    card.dataset.imageHydrated = "true";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.className = "jantlar__img";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 800;
    img.height = 800;

    const overlay = media.querySelector(".jantlar__hover, .instagram-card__overlay");
    if (overlay) {
      media.insertBefore(img, overlay);
    } else {
      media.appendChild(img);
    }

    bindImageFallback(img);
  }

  function hydrateShowcaseImage(media, src) {
    if (!media || media.dataset.imageHydrated === "true") return;
    media.dataset.imageHydrated = "true";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.className = "jantlar__img";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 800;
    img.height = 800;
    media.appendChild(img);
    bindImageFallback(img);
  }

  function observeShowcaseMedia(media, src) {
    if (!("IntersectionObserver" in window)) {
      hydrateShowcaseImage(media, src);
      return;
    }

    const showcaseObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          hydrateShowcaseImage(entry.target, entry.target.dataset.src);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: IMAGE_IO_ROOT_MARGIN, threshold: IMAGE_IO_THRESHOLD }
    );

    media.dataset.src = src;
    showcaseObserver.observe(media);
  }

  /* ── DOM factories ───────────────────────────────────────────────────── */

  function createGalleryPlaceholder() {
    const placeholder = document.createElement("div");
    placeholder.className = "jantlar__placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    return placeholder;
  }

  function createGalleryCardShell(index, src, altPrefix, variant) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = variant === "instagram" ? "jantlar__item instagram-card" : "jantlar__item";
    button.dataset.index = String(index);
    button.dataset.src = src;
    button.dataset.imageHydrated = "false";
    button.setAttribute("aria-label", altPrefix + " görseli " + (index + 1) + ", büyüt");

    const media = document.createElement("div");
    media.className = "jantlar__media";
    media.appendChild(createGalleryPlaceholder());

    if (variant === "instagram") {
      const overlay = document.createElement("div");
      overlay.className = "instagram-card__overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML =
        '<i class="bi bi-instagram" aria-hidden="true"></i><span>Instagram\'da Gör</span>';
      media.appendChild(overlay);
    } else {
      const hover = document.createElement("span");
      hover.className = "jantlar__hover";
      hover.setAttribute("aria-hidden", "true");
      hover.innerHTML = HOVER_ICON_SVG;
      media.appendChild(hover);
    }

    button.appendChild(media);
    return button;
  }

  function createShowcaseCardShell(src, label) {
    const card = document.createElement("article");
    card.className = "showcase__card";

    const media = document.createElement("div");
    media.className = "showcase__media";
    media.appendChild(createGalleryPlaceholder());

    const labelEl = document.createElement("span");
    labelEl.className = "showcase__label";
    labelEl.textContent = label;

    card.appendChild(media);
    card.appendChild(labelEl);

    return { card, media, src };
  }

  /* ── Rendering ───────────────────────────────────────────────────────── */

  function getLoadMoreWrap(galleryId) {
    if (!loadMoreWrapCache.has(galleryId)) {
      loadMoreWrapCache.set(
        galleryId,
        document.querySelector('[data-load-more-for="' + galleryId + '"]')
      );
    }
    return loadMoreWrapCache.get(galleryId);
  }

  function updateLoadMoreVisibility(state) {
    const loadMoreWrap = getLoadMoreWrap(state.id);
    if (!loadMoreWrap) return;

    if (state.visible >= state.total) {
      loadMoreWrap.classList.add("is-hidden");
    } else {
      loadMoreWrap.classList.remove("is-hidden");
    }
  }

  function renderGalleryBatch(state, fromIndex, batchSize, append) {
    const end = Math.min(fromIndex + batchSize, state.total);
    if (!state.grid || fromIndex >= end) return;

    ensureImageObserver();

    const fragment = document.createDocumentFragment();

    for (let i = fromIndex; i < end; i++) {
      const src = buildGalleryPath(state.folder, state.prefix, i + 1);
      const card = createGalleryCardShell(i, src, state.altPrefix, state.variant);
      fragment.appendChild(card);
      observeCardImage(card);
    }

    if (append) {
      state.grid.appendChild(fragment);
    } else {
      state.grid.replaceChildren(fragment);
    }

    state.visible = end;
    updateLoadMoreVisibility(state);
  }

  function initGallery(grid) {
    const galleryId = grid.getAttribute("data-gallery-id");
    const manifest = resolveManifest(galleryId);

    if (!galleryId || !manifest || !manifest.total) {
      const loadMoreWrap = getLoadMoreWrap(galleryId);
      if (loadMoreWrap) loadMoreWrap.classList.add("is-hidden");
      return;
    }

    const state = {
      id: galleryId,
      grid,
      folder: manifest.folder,
      prefix: manifest.prefix,
      total: manifest.total,
      visible: 0,
      perPage: parseInt(grid.getAttribute("data-gallery-per-page"), 10) || GALLERY_PER_PAGE,
      altPrefix: grid.getAttribute("data-gallery-alt") || "Görsel",
      variant: grid.getAttribute("data-gallery-variant") || "gallery"
    };

    galleryRegistry.set(galleryId, state);
    renderGalleryBatch(state, 0, state.perPage, false);
  }

  function initLoadMoreButtons() {
    document.querySelectorAll("[data-load-more-btn]").forEach((btn) => {
      if (btn.dataset.loadMoreBound === "true") return;
      btn.dataset.loadMoreBound = "true";

      btn.addEventListener("click", () => {
        const wrap = btn.closest("[data-load-more-for]");
        if (!wrap) return;

        const galleryId = wrap.getAttribute("data-load-more-for");
        const state = galleryRegistry.get(galleryId);
        if (!state) return;

        renderGalleryBatch(state, state.visible, state.perPage, true);
      });
    });
  }

  function initFeaturedShowcase() {
    const featuredJantGrid = document.querySelector("#featured-jant .showcase__grid");
    if (!featuredJantGrid) return;

    const manifest = GALLERY_MANIFEST.jantlar;
    const count = Math.min(4, manifest.total);
    const fragment = document.createDocumentFragment();
    const mediaTargets = [];

    for (let i = 0; i < count; i++) {
      const src = buildGalleryPath(manifest.folder, manifest.prefix, i + 1);
      const shell = createShowcaseCardShell(src, "Jant");
      fragment.appendChild(shell.card);
      mediaTargets.push({ media: shell.media, src: shell.src });
    }

    featuredJantGrid.replaceChildren(fragment);

    mediaTargets.forEach(({ media, src }) => {
      observeShowcaseMedia(media, src);
    });
  }

  function initGalleries() {
    initImageFallbackDelegation();
    initLoadMoreButtons();

    const grids = document.querySelectorAll("[data-gallery-id]");
    const deferredGrids = [];

    grids.forEach((grid) => {
      const section = grid.closest("section");
      const isAboveFold = section && section.classList.contains("jantlar--page");

      if (isAboveFold) {
        initGallery(grid);
      } else {
        deferredGrids.push(grid);
      }
    });

    if (deferredGrids.length) {
      runWhenIdle(() => {
        deferredGrids.forEach(initGallery);
      });
    }

    runWhenIdle(initFeaturedShowcase);
  }

  function boot() {
    initGalleries();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.MJLGallery = {
    getState: (galleryId) => galleryRegistry.get(galleryId),
    buildPath: buildGalleryPath,
    getSources: (galleryId) => {
      const state = galleryRegistry.get(galleryId);
      if (!state) return [];

      const sources = [];
      for (let i = 0; i < state.visible; i++) {
        sources.push(buildGalleryPath(state.folder, state.prefix, i + 1));
      }
      return sources;
    },
    SECTION_GALLERY_MAP: {
      jantlar: "jantlar",
      uygulamalar: "jant-applications",
      "lastik-applications": "lastik-applications",
      "home-applications": "home-applications"
    }
  };
})();
