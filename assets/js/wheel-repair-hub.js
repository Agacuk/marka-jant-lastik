/**
 * Jant Onarım hub — alt hizmet kartlarını render eder
 */
(function () {
  "use strict";

  var data = window.WheelRepairServices;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCards(container) {
    if (!data || !container) return;

    container.innerHTML = data.services
      .map(function (service) {
        var imageSrc = service.heroImage;
        return (
          '<a href="' +
          escapeHtml(service.slug) +
          '" class="services__card wheel-repair-hub__card">' +
          '<div class="services__card-media">' +
          '<div class="services__card-placeholder" aria-hidden="true"></div>' +
          '<img src="' +
          escapeHtml(imageSrc) +
          '" alt="' +
          escapeHtml(service.title) +
          '" class="services__card-img" loading="lazy" decoding="async" width="640" height="400">' +
          '<span class="wheel-repair-hub__icon" aria-hidden="true"><i class="bi ' +
          escapeHtml(service.icon) +
          '"></i></span>' +
          "</div>" +
          '<div class="services__card-body">' +
          "<h3 class=\"services__card-title\">" +
          escapeHtml(service.title) +
          "</h3>" +
          '<p class="services__card-desc">' +
          escapeHtml(service.cardDesc) +
          "</p>" +
          '<span class="services__card-link">İncele <span aria-hidden="true">→</span></span>' +
          "</div></a>"
        );
      })
      .join("");

    container.querySelectorAll(".services__card-img").forEach(function (img) {
      function markLoaded() {
        img.classList.add("is-loaded");
      }

      function markError() {
        img.classList.add("is-error");
        img.removeAttribute("src");
      }

      if (img.complete && img.naturalWidth > 0) {
        markLoaded();
      } else {
        img.addEventListener("load", markLoaded, { once: true });
        img.addEventListener("error", markError, { once: true });
      }
    });
  }

  function init() {
    if (!document.body.classList.contains("wheel-repair-hub-page")) return;
    renderCards(document.getElementById("wheelRepairHubGrid"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
