"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  return r.text();
}

(async () => {
  const bfg = await get("https://www.bfgoodrich.co.uk/auto/tyres");
  const tires = [...new Set(bfg.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s]+tire_bfgoodrich[^"'\s]+_main_[^"'\s]+\.webp/gi) || [])]
    .map((u) => u.replace(/\\u002F/g, "/").split("?")[0].replace(/&quot;.*/, ""));
  console.log("BFG main tire images:", tires.length);
  tires.forEach((t) => console.log(t.match(/tire_bfgoodrich_[^/]+/)?.[0] || t.slice(-80)));

  const lassa = await get("https://www.lassa.com.tr/urunler");
  console.log("\nLassa urunler length", lassa.length);
  const imgs = [...new Set(lassa.match(/medias89k[^"'\s]+\.(?:jpg|webp|png)/gi) || [])];
  imgs.forEach((i) => console.log(i));
  const desenLinks = [...new Set(lassa.match(/href="(\/desen\/[^"]+)"/gi) || [])];
  desenLinks.slice(0, 20).forEach((l) => console.log(l));

  // Yokohama S3 blu-earth / advan-db guesses via GET
  const guesses = [
    "BluEarth-ES32-3QL-Web.webp", "WEB-BLUEARTH-ES32-WHT.png", "BluEarth-XT-AE61-3QL-Web.webp",
    "WEB-ADVAN-dB-V552-WHT.png", "ADVAN-dB-V552-3QL-Web.webp", "ADVAN-Sport-V105-3QL-Web.webp",
    "WEB-ADVAN-SPORT-V105-WHT.png", "2205_YTC_CONS_ADVAN-Sport-V105-Image_3QL-Web.webp",
    "bluearth-es32.png", "BluEarth-GT380-3QL-Web.webp",
  ];
  for (const g of guesses) {
    const u = "https://ytc-bm.s3.us-east-2.amazonaws.com/" + g;
    const r = await fetch(u, { headers: { "User-Agent": UA, Referer: "https://www.yokohamatire.com/" } });
    if (r.ok) {
      const len = (await r.arrayBuffer()).byteLength;
      if (len > 5000) console.log("YOKO OK", len, g);
    }
  }

  // Nexen nblue ev - try product detail URLs
  for (const u of [
    "https://www.nexentire.com/international/product/passenger/nblue-ev/",
    "https://www.nexentire.com/international/product/passenger/n-blue-ev/",
    "https://www.nexentire.com/international/product/ev/nblue-ev/",
  ]) {
    const html = await get(u);
    const imgs = html.match(/__icsFiles\/afieldfile[^"'\s]+\.(?:png|jpg)/gi);
    console.log("\nNexen", u.split("/").pop(), imgs?.slice(0, 5));
  }
})();
