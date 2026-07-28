"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function probe(name, url) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
    const html = await r.text();
    const imgs = [...html.matchAll(/https?:\/\/[^"'\s<>\\]+\.(?:jpg|jpeg|png|webp)/gi)]
      .map((m) => m[0])
      .filter((u) => /product|tire|lastik|desen|upload|media|image|tyre|dam|content/i.test(u) && !/logo|icon|banner|sprite|favicon|social|flag|map|avatar/i.test(u));
    console.log("\n=== " + name + " " + r.status + " ===");
    [...new Set(imgs)].slice(0, 15).forEach((u) => console.log(u));
  } catch (e) {
    console.log(name, "ERR", e.message);
  }
}

const pages = [
  ["lassa-driveways", "https://www.lassa.com.tr/desen/dww-02-driveways"],
  ["lassa-competus", "https://www.lassa.com.tr/desen/cmp-01-competus"],
  ["lassa-snoways", "https://www.lassa.com.tr/desen/snw-01-snoways"],
  ["petlas-velox", "https://www.petlas.com.tr/velox-sport"],
  ["petlas-explero", "https://www.petlas.com.tr/explero"],
  ["petlas-imperium", "https://www.petlas.com.tr/imperium"],
  ["petlas-snowmaster", "https://www.petlas.com.tr/snowmaster"],
  ["nexen-nblue-ev", "https://www.nexentire.com/international/product/passenger/product/view.do?productIdx=1234"],
  ["yokohama-bluearth", "https://www.yokohama.eu/tyres/passenger-car/bluearth-es32/"],
  ["yokohama-advan-db", "https://www.yokohama.eu/tyres/passenger-car/advan-db-v552/"],
  ["bfg-pilot-sport", "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-pilot-sport"],
  ["bfg-winter", "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2"],
  ["starmaxx-ultra", "https://www.starmaxx.com/en/ultraforce-1/"],
  ["starmaxx-gforce", "https://www.starmaxx.com/en/gforce-max/"],
];

(async () => {
  for (const [n, u] of pages) await probe(n, u);
})();
