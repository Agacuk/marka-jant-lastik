"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const codes = [
  "RH12", "RH14", "HP2", "HPX", "RA33", "RA43", "RA54", "Dynapro_hp2", "Dynapro_HP2", "dynapro_hp2",
  "DynaproHP2", "HP2_RH12", "RH12A", "K135", "K127", "H750", "W330", "W320", "W452",
];

(async () => {
  for (const c of codes) {
    for (const base of [
      "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/",
      "https://asset.hankooktire.com/content/dam/hankooktire/local/og-image/",
      "https://www.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/",
    ]) {
      for (const suffix of ["_normal.png", "_hover.jpg", "_normal.jpg"]) {
        const u = base + c + suffix;
        try {
          const r = await fetch(u, { method: "HEAD", headers: { "User-Agent": UA } });
          if (r.ok) console.log("OK", u, r.headers.get("content-length"));
        } catch (_) {}
      }
    }
  }
})();
