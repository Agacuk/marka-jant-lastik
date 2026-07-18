/**
 * Bayi Portalı — Demo istemci
 * Gerçek API entegrasyonu için DealerAPI metodlarını backend uç noktalarına bağlayın.
 */
(function () {
  "use strict";

  var SESSION_KEY = "dealer_demo_session";
  var REMEMBER_KEY = "dealer_demo_remember_user";

  /**
   * Gelecekte fetch() ile değiştirilecek API katmanı.
   * @type {DealerAPI}
   */
  var DealerAPI = {
    submitApplication: function (payload) {
      return Promise.resolve({
        success: true,
        message:
          "Başvurunuz başarıyla alınmıştır. Yetkili ekibimiz en kısa sürede sizinle iletişime geçecektir.",
        data: payload,
      });
    },

    login: function (username, password) {
      var config = window.DealerConfig || {};
      if (
        username === config.ADMIN_USERNAME &&
        password === config.ADMIN_PASSWORD
      ) {
        return Promise.resolve({
          success: true,
          user: { username: username, role: "dealer_demo" },
        });
      }
      return Promise.resolve({
        success: false,
        error: "Kullanıcı adı veya şifre hatalı.",
      });
    },

    searchDealer: function (query) {
      return Promise.resolve({
        success: true,
        found: false,
        message: "Bayi bulunamadı.",
        query: query,
      });
    },
  };

  var els = {};

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function cacheElements() {
    els.portalMain = $("#dealerPortalMain");
    els.portalPanel = $("#dealerPortalPanel");
    els.panelWelcome = $("#dealerPanelWelcome");
    els.logoutBtn = $("#dealerLogoutBtn");
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.body.classList.add("is-dealer-modal-open");
    var focusTarget = modal.querySelector("input, button, textarea, select");
    if (focusTarget) focusTarget.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("is-open");
    if (!$all(".dealer-modal.is-open").length) {
      document.body.classList.remove("is-dealer-modal-open");
    }
  }

  function closeAllModals() {
    $all(".dealer-modal.is-open").forEach(closeModal);
  }

  function showAlert(container, message, type) {
    if (!container) return;
    container.hidden = false;
    container.textContent = message;
    container.className = "dealer-form__alert dealer-form__alert--" + (type || "error");
  }

  function hideAlert(container) {
    if (!container) return;
    container.hidden = true;
    container.textContent = "";
  }

  function setPanelVisible(isLoggedIn, username) {
    if (!els.portalMain || !els.portalPanel) return;
    els.portalMain.hidden = isLoggedIn;
    els.portalPanel.hidden = !isLoggedIn;
    if (isLoggedIn && els.panelWelcome && username) {
      els.panelWelcome.textContent = "Hoş Geldiniz, " + username;
    }
  }

  function saveSession(user) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      /* sessionStorage kullanılamıyorsa demo yine çalışır */
    }
  }

  function loadSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  function bindModalTriggers() {
    document.addEventListener("click", function (event) {
      var openTrigger = event.target.closest("[data-dealer-modal-open]");
      if (openTrigger) {
        event.preventDefault();
        var modalId = openTrigger.getAttribute("data-dealer-modal-open");
        if (modalId) openModal(modalId);
        return;
      }

      var closeTrigger = event.target.closest("[data-dealer-modal-close]");
      if (closeTrigger) {
        event.preventDefault();
        closeModal(event.target.closest(".dealer-modal"));
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAllModals();
    });
  }

  function bindApplicationForm() {
    var form = $("#dealerApplyForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var alertBox = $("#dealerApplyAlert");
      hideAlert(alertBox);

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var payload = {
        fullName: form.fullName.value.trim(),
        companyName: form.companyName.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        city: form.city.value.trim(),
        district: form.district.value.trim(),
        address: form.address.value.trim(),
        taxOffice: form.taxOffice.value.trim(),
        taxNumber: form.taxNumber.value.trim(),
        notes: form.notes.value.trim(),
        kvkkAccepted: form.kvkk.checked,
      };

      if (!payload.kvkkAccepted) {
        showAlert(alertBox, "Devam etmek için KVKK onayını işaretleyin.", "error");
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      DealerAPI.submitApplication(payload).then(function (result) {
        if (submitBtn) submitBtn.disabled = false;
        if (!result.success) {
          showAlert(alertBox, result.message || "Başvuru gönderilemedi.", "error");
          return;
        }
        form.reset();
        closeModal($("#dealerModalApply"));
        openModal("dealerModalApplySuccess");
      });
    });
  }

  function bindLoginForm() {
    var form = $("#dealerLoginForm");
    if (!form) return;

    var remembered = localStorage.getItem(REMEMBER_KEY);
    if (remembered && form.username) {
      form.username.value = remembered;
      if (form.remember) form.remember.checked = true;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var alertBox = $("#dealerLoginAlert");
      hideAlert(alertBox);

      var username = form.username.value.trim();
      var password = form.password.value;

      if (!username || !password) {
        showAlert(alertBox, "Kullanıcı adı ve şifre hatalı.", "error");
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      DealerAPI.login(username, password).then(function (result) {
        if (submitBtn) submitBtn.disabled = false;
        if (!result.success) {
          showAlert(alertBox, result.error || "Kullanıcı adı veya şifre hatalı.", "error");
          return;
        }

        if (form.remember && form.remember.checked) {
          localStorage.setItem(REMEMBER_KEY, username);
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }

        saveSession(result.user);
        form.password.value = "";
        closeModal($("#dealerModalLogin"));
        setPanelVisible(true, result.user.username);
      });
    });
  }

  function bindSearchForm() {
    var form = $("#dealerSearchForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var alertBox = $("#dealerSearchAlert");
      hideAlert(alertBox);

      var city = form.city.value.trim();
      var dealerCode = form.dealerCode.value.trim();

      if (!city && !dealerCode) {
        showAlert(alertBox, "Lütfen şehir veya bayi kodu girin.", "error");
        return;
      }

      var query = { city: city, dealerCode: dealerCode };
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      DealerAPI.searchDealer(query).then(function (result) {
        if (submitBtn) submitBtn.disabled = false;
        showAlert(
          alertBox,
          result.found ? result.message : "Bayi bulunamadı.",
          result.found ? "success" : "info"
        );
      });
    });
  }

  function bindLogout() {
    if (!els.logoutBtn) return;
    els.logoutBtn.addEventListener("click", function () {
      clearSession();
      setPanelVisible(false);
    });
  }

  function init() {
    if (!document.body.classList.contains("dealer-page")) return;

    cacheElements();
    bindModalTriggers();
    bindApplicationForm();
    bindLoginForm();
    bindSearchForm();
    bindLogout();

    var session = loadSession();
    if (session && session.username) {
      setPanelVisible(true, session.username);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.DealerAPI = DealerAPI;
})();
