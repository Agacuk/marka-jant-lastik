/**
 * Marka Jant Lastik — Production Gallery Engine
 * Layout anında tam render; IntersectionObserver yalnızca img lazy-load için.
 * PhotoSwipe 5 lightbox — tüm galeri sayfalarında ortak.
 */
import PhotoSwipeLightbox from "../vendor/photoswipe/photoswipe-lightbox.esm.js";
import PhotoSwipe from "../vendor/photoswipe/photoswipe.esm.js";

const GALLERY_PER_PAGE = 8;
const IMAGE_IO_ROOT_MARGIN = "280px 0px";
const IMAGE_IO_THRESHOLD = 0.01;
const DEFAULT_IMAGE_SIZE = 800;

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

let lazyImageObserver = null;
let imageFallbackBound = false;

const photoSwipeLightbox = new PhotoSwipeLightbox({
  pswpModule: PhotoSwipe,
  bgOpacity: 0.9,
  wheelToZoom: true,
  padding: { top: 24, bottom: 24, left: 16, right: 16 },
  showHideAnimationType: "zoom"
});

photoSwipeLightbox.init();

/* ── Utilities ─────────────────────────────────────────────────────────── */

function padImageNumber(num) {
  return String(num).padStart(3, "0");
}

function buildGalleryPath(folder, prefix, number) {
  const normalizedFolder = folder.endsWith("/") ? folder : folder + "/";
  return normalizedFolder + prefix + padImageNumber(number) + ".webp";
}

function resolveManifest(galleryId) {
  const manifestKey = GALLERY_ID_MAP[galleryId];
  return manifestKey ? GALLERY_MANIFEST[manifestKey] : null;
}

function resolveImageSrc(state, index) {
  const manifestSrc = buildGalleryPath(state.folder, state.prefix, index + 1);
  const card = state.cards[index];
  const img = card?.querySelector("img.jantlar__img");

  if (img?.src && img.dataset.lazyHydrated === "true" && img.classList.contains("is-loaded")) {
    return img.src;
  }

  return manifestSrc;
}

function buildPhotoSwipeDataSource(state) {
  const items = [];

  for (let i = 0; i < state.total; i++) {
    const card = state.cards[i];
    const img = card?.querySelector("img.jantlar__img");
    const width = img?.naturalWidth > 0 ? img.naturalWidth : DEFAULT_IMAGE_SIZE;
    const height = img?.naturalHeight > 0 ? img.naturalHeight : DEFAULT_IMAGE_SIZE;

    items.push({
      src: resolveImageSrc(state, i),
      width,
      height,
      alt: state.altPrefix + " " + (i + 1)
    });
  }

  return items;
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

  if (img.complete && img.src) {
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

/* ── IntersectionObserver: yalnızca img lazy-load ─────────────────────── */

function ensureLazyImageObserver() {
  if (lazyImageObserver) return lazyImageObserver;

  if (!("IntersectionObserver" in window)) {
    lazyImageObserver = null;
    return null;
  }

  lazyImageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateLazyImage(entry.target);
        lazyImageObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: IMAGE_IO_ROOT_MARGIN,
      threshold: IMAGE_IO_THRESHOLD
    }
  );

  return lazyImageObserver;
}

function hydrateLazyImage(img) {
  if (!(img instanceof HTMLImageElement)) return;
  if (img.dataset.lazyHydrated === "true") return;

  const src = img.dataset.src;
  if (!src) return;

  img.dataset.lazyHydrated = "true";
  img.src = src;
  bindImageFallback(img);
}

function observeLazyImage(img) {
  if (!img || img.dataset.lazyHydrated === "true") return;

  const observer = ensureLazyImageObserver();
  if (observer) {
    observer.observe(img);
    return;
  }

  hydrateLazyImage(img);
}

function observeLazyImagesIn(root) {
  if (!root) return;
  root.querySelectorAll("img.jantlar__img[data-src]").forEach(observeLazyImage);
}

function observeAllLazyImages() {
  document.querySelectorAll("img.jantlar__img[data-src]").forEach(observeLazyImage);
}

/* ── DOM factories ───────────────────────────────────────────────────── */

function createGalleryPlaceholder() {
  const placeholder = document.createElement("div");
  placeholder.className = "jantlar__placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  return placeholder;
}

function createLazyImage(src) {
  const img = document.createElement("img");
  img.className = "jantlar__img";
  img.dataset.src = src;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  img.width = DEFAULT_IMAGE_SIZE;
  img.height = DEFAULT_IMAGE_SIZE;
  return img;
}

function createGalleryCard(index, src, altPrefix, variant, concealed) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = variant === "instagram" ? "jantlar__item instagram-card" : "jantlar__item";
  if (concealed) {
    button.classList.add("jantlar__item--concealed");
  }
  button.dataset.index = String(index);
  button.setAttribute("aria-label", altPrefix + " görseli " + (index + 1) + ", büyüt");

  const media = document.createElement("div");
  media.className = "jantlar__media";
  media.appendChild(createGalleryPlaceholder());
  media.appendChild(createLazyImage(src));

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

function createShowcaseCard(src, label) {
  const card = document.createElement("article");
  card.className = "showcase__card";

  const media = document.createElement("div");
  media.className = "showcase__media";
  media.appendChild(createGalleryPlaceholder());
  media.appendChild(createLazyImage(src));

  const labelEl = document.createElement("span");
  labelEl.className = "showcase__label";
  labelEl.textContent = label;

  card.appendChild(media);
  card.appendChild(labelEl);

  return card;
}

/* ── PhotoSwipe ──────────────────────────────────────────────────────── */

function initPhotoSwipeForGrid(state) {
  if (state.variant === "instagram" || state.grid.dataset.pswpBound === "true") return;
  state.grid.dataset.pswpBound = "true";

  state.grid.addEventListener("click", (event) => {
    const item = event.target.closest(".jantlar__item:not(.instagram-card)");
    if (!item || !state.grid.contains(item)) return;

    const index = parseInt(item.dataset.index, 10) || 0;
    photoSwipeLightbox.loadAndOpen(index, {
      dataSource: buildPhotoSwipeDataSource(state)
    });
  });
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

  if (state.revealed >= state.total) {
    loadMoreWrap.classList.add("is-hidden");
  } else {
    loadMoreWrap.classList.remove("is-hidden");
  }
}

function renderFullGallery(state) {
  if (!state.grid || !state.total) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < state.total; i++) {
    const src = buildGalleryPath(state.folder, state.prefix, i + 1);
    const concealed = i >= state.revealed;
    fragment.appendChild(createGalleryCard(i, src, state.altPrefix, state.variant, concealed));
  }

  state.grid.replaceChildren(fragment);
  state.cards = [...state.grid.querySelectorAll(".jantlar__item")];
  observeLazyImagesIn(state.grid);
  updateLoadMoreVisibility(state);
  initPhotoSwipeForGrid(state);
}

function revealNextBatch(state) {
  const nextRevealed = Math.min(state.revealed + state.perPage, state.total);
  if (nextRevealed === state.revealed) return;

  for (let i = state.revealed; i < nextRevealed; i++) {
    const card = state.cards[i];
    if (!card) continue;
    card.classList.remove("jantlar__item--concealed");
  }

  state.revealed = nextRevealed;
  observeLazyImagesIn(state.grid);
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

  const perPage = parseInt(grid.getAttribute("data-gallery-per-page"), 10) || GALLERY_PER_PAGE;

  const state = {
    id: galleryId,
    grid,
    folder: manifest.folder,
    prefix: manifest.prefix,
    total: manifest.total,
    revealed: Math.min(perPage, manifest.total),
    perPage,
    altPrefix: grid.getAttribute("data-gallery-alt") || "Görsel",
    variant: grid.getAttribute("data-gallery-variant") || "gallery",
    cards: []
  };

  galleryRegistry.set(galleryId, state);
  renderFullGallery(state);
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

      revealNextBatch(state);
    });
  });
}

function initFeaturedShowcase() {
  const featuredJantGrid = document.querySelector("#featured-jant .showcase__grid");
  if (!featuredJantGrid) return;

  const manifest = GALLERY_MANIFEST.jantlar;
  const count = Math.min(4, manifest.total);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const src = buildGalleryPath(manifest.folder, manifest.prefix, i + 1);
    fragment.appendChild(createShowcaseCard(src, "Jant"));
  }

  featuredJantGrid.replaceChildren(fragment);
  observeLazyImagesIn(featuredJantGrid);
}

function initGalleries() {
  initImageFallbackDelegation();
  ensureLazyImageObserver();
  initLoadMoreButtons();

  document.querySelectorAll("[data-gallery-id]").forEach(initGallery);
  initFeaturedShowcase();
  observeAllLazyImages();
}

initGalleries();

window.MJLGallery = {
  getState: (galleryId) => galleryRegistry.get(galleryId),
  buildPath: buildGalleryPath,
  getSources: (galleryId) => {
    const state = galleryRegistry.get(galleryId);
    if (!state) return [];

    const sources = [];
    for (let i = 0; i < state.total; i++) {
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
