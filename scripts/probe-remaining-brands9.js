"use strict";
const fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "tr,en" } });
  return { status: r.status, html: await r.text() };
}

(async () => {
  const lassa = await get("https://www.lassa.com.tr/urunler");
  fs.writeFileSync("probe-lassa-urunler.html", lassa.html.slice(0, 200000));
  for (const name of ["Revola", "Driveways", "Competus", "Snoways", "DRIVEWAYS", "COMPETUS", "SNOWAYS"]) {
    const i = lassa.html.indexOf(name);
    console.log(name, i > -1 ? "found at " + i : "not found");
    if (i > -1) {
      const chunk = lassa.html.slice(i - 400, i + 600);
      const img = chunk.match(/medias89k[^"'\s]+|\/Dosyalar\/[^"'\s]+\.(?:jpg|webp|png)/i);
      const link = chunk.match(/href="([^"]+)"/g);
      console.log(" img:", img?.[0]);
      console.log(" links:", link?.slice(0, 4));
    }
  }

  // Brisa / Petlas parent
  for (const u of [
    "https://www.brisa.com.tr/urunler/petlas",
    "https://www.brisa.com.tr/en/products/petlas",
    "https://www.petlas.com/",
  ]) {
    const r = await get(u);
    console.log("\nBrisa/Petlas", r.status, u);
    const imgs = r.html.match(/https?:\/\/[^"'\s]+\.(?:jpg|webp|png)/gi);
    if (imgs) [...new Set(imgs)].filter((x) => /petlas|starmaxx|velox|explero|product|lastik|tire/i.test(x)).slice(0, 8).forEach((i) => console.log(" ", i.slice(0, 160)));
  }

  // Yokohama sitemap or all tires page
  const tires = await get("https://www.yokohamatire.com/tires");
  const links = [...new Set(tires.html.match(/href="(\/tires\/[^"]+)"/gi) || [])];
  console.log("\nYokohama tire links:", links.filter((l) => /blu|earth|advan|geolandar|v552|v105|es32/i.test(l)).slice(0, 20));

  // BFG search API or sitemap for pilot sport winter
  const bfg = await get("https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2");
  const all = bfg.html.match(/tire_bfgoodrich[^"'\s]+/gi) || [];
  console.log("\nBFG winter page patterns:", [...new Set(all)].slice(0, 10));
})();
