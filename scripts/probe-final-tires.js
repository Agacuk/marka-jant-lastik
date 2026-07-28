"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function get(url, referer) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Referer: referer || "" } });
  const text = await r.text();
  return { status: r.status, text };
}

async function head(url, referer) {
  const r = await fetch(url, { method: "HEAD", headers: { "User-Agent": UA, Referer: referer || "" } });
  return r.status;
}

(async () => {
  // Lassa desen pages
  for (const slug of [
    "r01-01-driveways-sport",
    "r01-03-competus-at2",
    "r01-04-snoways4",
    "r01-02-revola",
  ]) {
    const { status, text } = await get("https://www.lassa.com.tr/desen/" + slug);
    console.log("\n=== LASSA", slug, status, "===");
    const imgs = [...new Set(text.match(/medias89k[^"'\s]+\.(?:jpg|webp|png)/gi) || [])];
    imgs.forEach((i) => console.log(i));
    const dosya = [...new Set(text.match(/\/Dosyalar\/[^"'\s]+\.(?:jpg|webp|png)/gi) || [])];
    dosya.forEach((i) => console.log("DOSYA", i));
  }

  // Lassa urunler page
  const urunler = await get("https://www.lassa.com.tr/urunler");
  console.log("\n=== LASSA urunler imgs ===");
  [...new Set(urunler.text.match(/medias89k[^"'\s]+270x270[^"'\s]+\.(?:jpg|webp)/gi) || [])].forEach((i) => console.log(i));

  // Yokohama tire pages
  for (const p of [
    "/tires/advan-db-v552",
    "/tires/blu-earth-es32",
    "/tires/advan-db-v552-2",
    "/tires/blu-earth-es32-2",
  ]) {
    const { status, text } = await get("https://www.yokohamatire.com" + p);
    console.log("\n=== YOKO", p, status, "===");
    [...new Set(text.match(/https:\/\/[^"'\s]+\.(?:webp|png|jpg)/gi) || [])]
      .filter((x) => /ytc-bm|s3\.us-east|product|tire|advan|bluearth|v552|es32/i.test(x) && !/logo|icon|favicon|social/i.test(x))
      .slice(0, 8)
      .forEach((i) => console.log(i));
  }

  // Yokohama S3 guesses
  console.log("\n=== YOKO S3 ===");
  for (const g of [
    "BluEarth-ES32-3QL-Web.webp",
    "WEB-BLUEARTH-ES32-WHT.png",
    "ADVAN-dB-V552-3QL-Web.webp",
    "WEB-ADVAN-dB-V552-WHT.png",
    "ADVAN-dB-V552-White.png",
    "BluEarth-ES32-White.png",
    "BluEarth-XT-AE61-3QL-Web.webp",
  ]) {
    const u = "https://ytc-bm.s3.us-east-2.amazonaws.com/" + g;
    const s = await head(u, "https://www.yokohamatire.com/");
    if (s === 200) console.log("OK", g);
  }

  // BFG pages
  for (const slug of [
    "bfgoodrich-g-force-sport-comp-2",
    "bfgoodrich-g-force-phenom-t-a",
    "bfgoodrich-g-force-comp-2-as",
  ]) {
    const { status, text } = await get("https://www.bfgoodrich.co.uk/auto/tyres/" + slug);
    console.log("\n=== BFG", slug, status, "===");
    const m = text.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s]+tire_bfgoodrich[^"'\s]+_main_[^"'\s]+\.webp/gi);
    if (m) console.log(m[0].replace(/\\u002F/g, "/").split("?")[0]);
  }

  // Petlas - try retailers
  for (const u of [
    "https://www.oponeo.co.uk/tyre-model/petlas-explero-pt431",
    "https://www.oponeo.co.uk/tyre-model/petlas-imperium-pt515",
    "https://www.oponeo.co.uk/tyre-model/petlas-snowmaster-pt935",
    "https://www.tyreleader.co.uk/en/tyre/petlas/explero-pt431",
    "https://www.123tyres.co.uk/brands/petlas/explero-pt431",
    "https://www.reifendirekt.de/Reifen/Petlas-Explero-PT431.html",
  ]) {
    const { status, text } = await get(u);
    console.log("\n=== PETLAS", u, status, "===");
    const imgs = [...new Set(text.match(/https:\/\/[^"'\s]+\.(?:jpg|webp|png)/gi) || [])]
      .filter((x) => /petlas|explero|imperium|snowmaster|pt431|pt515|pt935|product|tyre|tire/i.test(x) && !/logo|icon|banner|flag|star/i.test(x))
      .slice(0, 5);
    imgs.forEach((i) => console.log(i));
  }

  // Starmaxx
  for (const u of [
    "https://www.starmaxx.com/en/products/naturen-st542",
    "https://www.starmaxx.com/en/products/incurro-winter-w870",
    "https://www.starmaxx.com/en/products/starmaxx-winter-ultra",
    "https://www.starmaxx.com/en/products/starmaxx-eco",
    "https://www.starmaxx.com.tr/en/products/naturen-st542",
  ]) {
    const { status, text } = await get(u);
    console.log("\n=== STARMAXX", u, status, "===");
    [...new Set(text.match(/https?:\/\/[^"'\s]+\.(?:jpg|webp|png)/gi) || [])]
      .filter((x) => /starmaxx|product|w870|st542|naturen|incurro|winter|eco/i.test(x) && !/logo|icon|banner|flag/i.test(x))
      .slice(0, 8)
      .forEach((i) => console.log(i));
  }

  // krainashin starmaxx
  for (const u of [
    "https://krainashin.com/product/starmaxx-naturen-st542/",
    "https://krainashin.com/product/starmaxx-incurro-winter-w870/",
  ]) {
    const s = await head(u);
    console.log("kraina", u, s);
  }
})();
