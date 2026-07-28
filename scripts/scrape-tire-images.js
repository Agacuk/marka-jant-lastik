"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function scrape(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  const html = await r.text();
  const imgs = [...html.matchAll(/https?:\/\/[^"'\s<>\\]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  console.log("\n", url, r.status);
  [...new Set(imgs)].filter((u) => /media|image|upload|product|tire|lastik|hybris|azurefd|contentcenter|ytc-bm|kumho|nexentire|petlas|starmaxx|lassa/i.test(u)).slice(0, 20).forEach((u) => console.log(u));
}

(async () => {
  const urls = [
    "https://www.lassa.com.tr/lastik/219462-driveways-yaz-21545r16-90v",
    "https://www.lassa.com.tr/lastik/218414-impetus-revo-yaz-20555r15-88v",
    "https://www.nexentire.com/international/product/ev/",
    "https://www.nexentire.com/international/product/ev/nblue-ev.php",
    "https://www.yokohamatire.com/tire-search/advan-db-v552/",
    "https://www.yokohamatire.com/tire-search/bluearth-es32/",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-phenom-t-a",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-comp-2-a-s-plus",
    "https://www.petlas.com.tr/urunler/binek-lastikleri/velox-sport-pt741",
    "https://www.petlas.com.tr/urunler/binek-lastikleri/explero-pt431",
    "https://www.starmaxx.com/storage/app/media/PCR-downloads/",
  ];
  for (const u of urls) await scrape(u);
})();
