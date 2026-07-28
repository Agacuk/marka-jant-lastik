"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function probe(name, url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  const h = await r.text();
  console.log("\n===", name, r.status, url);
  const imgs = [...new Set(h.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
    .filter((x) => /petlas|starmaxx|storage|media|product|tire|lastik|velox|explero|imperium|snow|x1|eco|suv|winter/i.test(x) && !/logo|icon|favicon|flag|social|sprite|banner|header|footer|label|brochure/i.test(x));
  imgs.slice(0, 15).forEach((i) => console.log(" ", i.slice(0, 180)));
  const rel = [...new Set(h.match(/\/storage\/[^"'\s]+\.(?:webp|jpg|png)/gi) || [])];
  rel.slice(0, 10).forEach((i) => console.log(" rel:", i));
}

(async () => {
  await probe("velox", "https://www.petlas.com/en/pcr-detail/velox-sport-pt741/");
  await probe("explero", "https://www.petlas.com/en/pcr-detail/explero-h-p-pt431/");
  await probe("imperium", "https://www.petlas.com/en/pcr-detail/imperium-pt535/");
  await probe("snowmaster", "https://www.petlas.com/en/pcr-detail/snowmaster-w651/");
  await probe("starmaxx", "https://www.starmaxx.com/en/");
  await probe("starmaxx-x1", "https://www.starmaxx.com/en/pcr-detail/starmaxx-x1/");
  await probe("yoko-bluearth", "https://www.yokohamatire.com/bluearth-tires");
  await probe("yoko-v552", "https://www.yokohamatire.com/tires/advan-db-v552");
})();
