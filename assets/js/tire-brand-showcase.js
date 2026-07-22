/**
 * Lastik Marka Vitrini — Modal vitrin istemcisi
 * Gelecekte TireBrandAPI ile backend entegrasyonu için modüler yapı.
 */
(function () {
  "use strict";

  var catalog = window.TireBrandsCatalog;
  var modal = null;
  var gridEl = null;
  var filterContainer = null;
  var searchInput = null;
  var watermarkEl = null;
  var brandNameEl = null;
  var brandDescEl = null;
  var brandLogoEl = null;
  var activeBrand = null;
  var activeFilter = "all";
  var searchQuery = "";
  var isOpen = false;
  var savedScrollY = 0;

  /**
   * @type {TireBrandAPI}
   */
  var TireBrandAPI = {
    getCatalog: function () {
      return Promise.resolve(catalog);
    },

    getBrandById: function (brandId) {
      var brand = (catalog.brands || []).find(function (b) {
        return b.id === brandId;
      });
      return Promise.resolve(brand || null);
    },
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function lockBodyScroll() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("is-tire-modal-open");
    document.body.style.top = "-" + savedScrollY + "px";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  }

  function unlockBodyScroll() {
    document.body.classList.remove("is-tire-modal-open");
    document.body.style.top = "";
    document.body.style.position = "";
    document.body.style.width = "";
    window.scrollTo(0, savedScrollY);
  }

  function getTagLabel(tagId) {
    return (catalog.tagLabels && catalog.tagLabels[tagId]) || tagId;
  }

  function buildWhatsAppUrl(productName, brandName) {
    var message =
      "Merhaba, " +
      brandName +
      " " +
      productName +
      " lastiği hakkında teklif almak istiyorum.";
    return catalog.whatsappUrl + "?text=" + encodeURIComponent(message);
  }

  function renderBrandGrid(container) {
    if (!catalog || !container) return;

    container.innerHTML = catalog.brands
      .map(function (brand) {
        var logoHtml = brand.logo
          ? '<span class="brands__logo"><img src="' +
            escapeHtml(brand.logo) +
            '" alt="' +
            escapeHtml(brand.name) +
            '" loading="lazy" decoding="async"></span>'
          : "";

        return (
          '<button type="button" class="brands__card" data-tire-brand="' +
          escapeHtml(brand.id) +
          '" data-reveal-child aria-label="' +
          escapeHtml(brand.name) +
          " ürünlerini görüntüle" +
          '">' +
          logoHtml +
          '<span class="brands__name">' +
          escapeHtml(brand.displayName || brand.name.toUpperCase()) +
          "</span></button>"
        );
      })
      .join("");

    container.querySelectorAll("[data-reveal-child]").forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }

  function renderFilters() {
    if (!filterContainer || !catalog.filters) return;

    filterContainer.innerHTML = catalog.filters
      .map(function (filter) {
        var activeClass = filter.id === activeFilter ? " is-active" : "";
        return (
          '<button type="button" class="tire-modal__filter' +
          activeClass +
          '" data-tire-filter="' +
          escapeHtml(filter.id) +
          '">' +
          escapeHtml(filter.label) +
          "</button>"
        );
      })
      .join("");
  }

  function getFilteredProducts() {
    if (!activeBrand) return [];

    var query = searchQuery.trim().toLowerCase();

    return activeBrand.products.filter(function (product) {
      var matchesFilter =
        activeFilter === "all" ||
        (product.tags && product.tags.indexOf(activeFilter) !== -1);

      if (!matchesFilter) return false;

      if (!query) return true;

      var haystack = [
        product.name,
        product.category,
        product.description,
        (product.tags || []).map(getTagLabel).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.indexOf(query) !== -1;
    });
  }

  function renderProducts() {
    if (!gridEl || !activeBrand) return;

    var products = getFilteredProducts();

    if (!products.length) {
      gridEl.innerHTML =
        '<p class="tire-modal__empty">Aradığınız kriterlere uygun ürün bulunamadı.</p>';
      return;
    }

    gridEl.innerHTML = products
      .map(function (product) {
        var tagsHtml = (product.tags || [])
          .map(function (tag) {
            return (
              '<span class="tire-product__badge">' +
              escapeHtml(getTagLabel(tag)) +
              "</span>"
            );
          })
          .join("");

        var whatsappUrl = buildWhatsAppUrl(product.name, activeBrand.name);

        return (
          '<article class="tire-product">' +
          '<div class="tire-product__media">' +
          '<img src="' +
          escapeHtml(product.image) +
          '" alt="' +
          escapeHtml(product.name) +
          '" loading="lazy" decoding="async" data-tire-product-img>' +
          "</div>" +
          '<div class="tire-product__body">' +
          "<h3 class=\"tire-product__name\">" +
          escapeHtml(product.name) +
          "</h3>" +
          '<p class="tire-product__category">' +
          escapeHtml(product.category) +
          "</p>" +
          '<p class="tire-product__desc">' +
          escapeHtml(product.description) +
          "</p>" +
          '<div class="tire-product__tags">' +
          tagsHtml +
          "</div>" +
          '<div class="tire-product__actions">' +
          '<a href="' +
          escapeHtml(catalog.contactUrl) +
          '" class="hero__btn hero__btn--ghost">Bilgi Al</a>' +
          '<a href="' +
          escapeHtml(whatsappUrl) +
          '" class="hero__btn hero__btn--primary" target="_blank" rel="noopener noreferrer">WhatsApp ile Teklif Al</a>' +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    gridEl.querySelectorAll("[data-tire-product-img]").forEach(function (img) {
      img.addEventListener("error", function onError() {
        img.removeEventListener("error", onError);
        img.src = catalog.placeholderImage;
      });
    });
  }

  function updateBrandHeader(brand) {
    if (!brand) return;

    brandNameEl.textContent = brand.name;
    brandDescEl.textContent = brand.description;

    if (brand.logo) {
      brandLogoEl.className = "tire-modal__brand-logo";
      brandLogoEl.innerHTML =
        '<img src="' +
        escapeHtml(brand.logo) +
        '" alt="' +
        escapeHtml(brand.name) +
        '" decoding="async">';
      watermarkEl.style.backgroundImage = 'url("' + brand.logo + '")';
      watermarkEl.hidden = false;
    } else {
      brandLogoEl.className = "tire-modal__brand-logo tire-modal__brand-logo--text";
      brandLogoEl.textContent = brand.displayName || brand.name.toUpperCase();
      watermarkEl.style.backgroundImage = "none";
      watermarkEl.hidden = true;
    }
  }

  function openModal(brandId) {
    TireBrandAPI.getBrandById(brandId).then(function (brand) {
      if (!brand || !modal) return;

      activeBrand = brand;
      activeFilter = "all";
      searchQuery = "";
      if (searchInput) searchInput.value = "";

      updateBrandHeader(brand);
      renderFilters();
      renderProducts();

      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      isOpen = true;
      lockBodyScroll();

      var closeBtn = modal.querySelector(".tire-modal__close");
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    });
  }

  function closeModal() {
    if (!modal || !isOpen) return;

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("is-open");
    isOpen = false;
    activeBrand = null;
    unlockBodyScroll();
  }

  function bindEvents() {
    var gridContainer = $("#tyreBrandsGrid");
    if (gridContainer) {
      gridContainer.addEventListener("click", function (event) {
        var trigger = event.target.closest("[data-tire-brand]");
        if (!trigger) return;
        event.preventDefault();
        openModal(trigger.getAttribute("data-tire-brand"));
      });
    }

    if (modal) {
      modal.querySelectorAll("[data-tire-modal-close]").forEach(function (el) {
        el.addEventListener("click", function (event) {
          event.preventDefault();
          closeModal();
        });
      });
    }

    if (filterContainer) {
      filterContainer.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-tire-filter]");
        if (!btn) return;
        activeFilter = btn.getAttribute("data-tire-filter") || "all";
        renderFilters();
        renderProducts();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        searchQuery = searchInput.value;
        renderProducts();
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeModal();
      }
    });
  }

  function init() {
    if (!document.body.classList.contains("tire-brands-page") || !catalog) return;

    modal = $("#tireBrandModal");
    gridEl = $("#tireModalProducts");
    filterContainer = $("#tireModalFilters");
    searchInput = $("#tireModalSearch");
    watermarkEl = $("#tireModalWatermark");
    brandNameEl = $("#tireModalBrandName");
    brandDescEl = $("#tireModalBrandDesc");
    brandLogoEl = $("#tireModalBrandLogo");

    var gridContainer = $("#tyreBrandsGrid");
    renderBrandGrid(gridContainer);
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.TireBrandAPI = TireBrandAPI;
})();
