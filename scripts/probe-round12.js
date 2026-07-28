"use strict";
const fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const pages = [
  ["kumho-ps71", "https://www.kumhotire.com/us/passenger/ecsta-ps71/"],
  ["yoko-advan", "https://www.yokohama.com.au/tyres/passenger-car/advan-sport-v105/"],
  ["yoko-blue", "https://www.yokohama.com.au/tyres/passenger-car/bluearth-es32/"],
  ["yoko-geolandar", "https://www.yokohama.com.au/tyres/suv-4x4/geolandar-g055/"],
  ["yoko-ice", "https://www.yokohama.com.au/tyres/passenger-car/iceguard-ig70/"],
  ["yoko-advan-db", "https://www.yokohama.com.au/tyres/passenger-car/advan-db-v552/"],
];

(async () => {
  for (const [n, u] of pages) {
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    const h = await r.text();
    fs.writeFileSync("probe-" + n + ".html", h.slice(0, 400000));
    console.log(n, r.status);
    const imgs = [...new Set(h.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /product|tire|tyre|pattern|advan|bluearth|geolandar|iceguard|ecsta|kumho|yokohama|uploads/i.test(x) && !/logo|icon|favicon|social|banner|footer|menu|sprite|avatar|woocommerce/i.test(x))
      .slice(0, 8);
    imgs.forEach((i) => console.log(" ", i.slice(0, 150)));
  }

  const codes = ["RH12", "HP2", "RA33", "RA43", "HPX", "Dynapro", "dynapro", "K127", "H750", "W330"];
  for (const c of codes) {
    const u = "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/" + c + "_normal.png";
    const r = await fetch(u, { method: "HEAD", headers: { "User-Agent": UA } });
    if (r.ok) console.log("HK OK", c, r.headers.get("content-length"));
  }
})();
