"use strict";
const fs = require("fs");
const path = require("path");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets", "images", "brands");

const SI = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons";

const sources = {
  michelin: [`${SI}/michelin.svg`, "https://asset.hankooktire.com/content/dam/hankooktire/local/svg/logo-white.svg"],
  goodyear: [`${SI}/goodyear.svg`],
  pirelli: [`${SI}/pirelli.svg`],
  continental: [`${SI}/continental.svg`],
  bridgestone: [`${SI}/bridgestone.svg`],
  hankook: ["https://asset.hankooktire.com/content/dam/hankooktire/local/svg/logo-white.svg", `${SI}/hankook.svg`],
  yokohama: [`${SI}/yokohama.svg`],
  bfgoodrich: [`${SI}/bfgoodrich.svg`],
  kumho: [`${SI}/kumhotire.svg`, `${SI}/kumho.svg`],
  nexen: [`${SI}/nexen.svg`],
  lassa: [],
  petlas: [],
  starmaxx: [],
};

async function fetchUrl(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) return null;
  const t = await r.text();
  if (!t.includes("<svg")) return null;
  return t;
}

(async () => {
  for (const [brand, urls] of Object.entries(sources)) {
    for (const url of urls) {
      const svg = await fetchUrl(url);
      console.log(brand, url.split("/").pop(), svg ? svg.length + " ok" : "fail");
      if (svg) {
        fs.writeFileSync(path.join(OUT, `_test_${brand}.svg`), svg);
        break;
      }
    }
  }
})();
