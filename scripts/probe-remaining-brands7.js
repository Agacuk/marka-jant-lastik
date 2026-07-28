"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "tr,en" } });
  return { status: r.status, html: await r.text() };
}

(async () => {
  // Lassa revola - extract all product image URLs from related links
  const revola = await get("https://www.lassa.com.tr/desen/r01-02-revola");
  const imgs = [...new Set(revola.html.match(/medias89k[^"'&]+\.(?:jpg|webp|png)/gi) || [])];
  console.log("Lassa revola all imgs:");
  imgs.forEach((i) => console.log(" ", decodeURIComponent(i)));

  const links = revola.html.match(/lastikcomtr-yonlendirme[^"']+/gi) || [];
  links.forEach((l) => {
    const name = decodeURIComponent(l);
    const img = (name.match(/i=([^&]+)/) || [])[1];
    const prod = (name.match(/u=([^&]+)/) || [])[1];
    console.log("related:", decodeURIComponent(prod || ""), decodeURIComponent(img || ""));
  });

  // Lassa desenler listing
  for (const u of ["https://www.lassa.com.tr/desenler", "https://www.lassa.com.tr/urunler", "https://www.lassa.com.tr/"]) {
    const r = await get(u);
    console.log("\nLassa page", u, r.status);
    const found = [...new Set(r.html.match(/medias89k[^"'\s]+\.(?:jpg|webp)/gi) || [])];
    found.slice(0, 20).forEach((i) => console.log(" ", i));
    const slugs = r.html.match(/\/desen\/[a-z0-9-]+/gi) || [];
    console.log(" slugs:", [...new Set(slugs)].slice(0, 15));
  }

  // Yokohama tire slug search
  for (const slug of [
    "blu-earth-es32", "blu-earth-es34", "blu-earth-gt380", "blu-earth-xt-ae61",
    "advan-db-v552", "advan-db-v551", "advan-sport-v105", "geolandar-g058", "geolandar-g055",
  ]) {
    const r = await get("https://www.yokohamatire.com/tires/" + slug);
    if (r.status === 200) {
      const imgs = [...new Set(r.html.match(/ytc-bm\.s3[^"'\s]+(?:3QL|WHT|Image|Hero)[^"'\s]+/gi) || [])];
      console.log("\nYOKO OK", slug, imgs.slice(0, 4));
    } else console.log("YOKO", slug, r.status);
  }

  // Petlas with browser-like headers
  const petlasHeaders = {
    "User-Agent": UA,
    Accept: "text/html,application/xhtml+xml",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
    Referer: "https://www.google.com/",
  };
  for (const u of [
    "https://www.petlas.com.tr/",
    "https://www.petlas.com.tr/urunler",
    "https://www.petlas.com.tr/desen/velox-sport",
    "https://www.starmaxx.com.tr/",
    "https://www.starmaxx.com.tr/urunler",
  ]) {
    const r = await fetch(u, { headers: petlasHeaders, redirect: "follow" });
    const h = await r.text();
    console.log("\nPetlas/Starmaxx", r.status, u);
    const imgs = [...new Set(h.match(/(?:Content|Upload|images|medias|cdn)[^"'\s]+\.(?:jpg|webp|png)/gi) || [])];
    imgs.slice(0, 10).forEach((i) => console.log(" ", i));
  }

  // BFG Michelin CDN pattern brute for product names
  const bfgSearch = [
    "https://www.bfgoodrich.co.uk/auto/tyres",
    "https://www.bfgoodrich.co.uk/auto/tyres?text=pilot",
    "https://www.bfgoodrich.co.uk/auto/tyres?text=advantage",
    "https://www.bfgoodrich.co.uk/auto/tyres?text=winter",
  ];
  for (const u of bfgSearch) {
    const r = await get(u);
    const m = r.html.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s]+tire_bfgoodrich[^"'\s]+/gi);
    if (m) {
      console.log("\nBFG list", u);
      [...new Set(m)].forEach((x) => console.log(" ", x.split("?")[0].slice(0, 220)));
    }
  }
})();
