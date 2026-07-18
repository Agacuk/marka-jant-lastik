/**
 * Bayi Portalı — Demo kimlik bilgileri
 * =====================================
 * UYARI: Bu dosya gerçek bir kimlik doğrulama sistemi DEĞİLDİR.
 * Bilgiler yalnızca istemci tarafında demo amaçlıdır.
 * Canlı ortamda mutlaka sunucu taraflı auth + veritabanı kullanın.
 *
 * Kullanıcı adı ve şifreyi aşağıdan güncelleyebilirsiniz.
 */
(function (global) {
  "use strict";

  /** Demo admin kullanıcı adı — sayfada görünmez, yalnızca kod içindedir. */
  const ADMIN_USERNAME = "bayi_admin";

  /** Demo admin şifresi — sayfada görünmez, yalnızca kod içindedir. */
  const ADMIN_PASSWORD = "Marka2026!";

  global.DealerConfig = {
    ADMIN_USERNAME: ADMIN_USERNAME,
    ADMIN_PASSWORD: ADMIN_PASSWORD,
  };
})(window);
