"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function get(url) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
    return { status: r.status, text: await r.text() };
  } catch (e) {
    return { status: 0, text: "", err: e.message };
  }
}

(async () => {
  // Yokohama AU - all img src
  for (const u of [
    "https://www.yokohama.com.au/our-range/tyres/BluEarth%20Es%20ES32",
    "https://www.yokohama.com.au/our-range/tyres/Advan%20dB%20V552",
  ]) {
    const { status, text } = await get(u);
    console.log("\nYOKO AU", status, u);
    [...new Set(text.match(/src=\"([^\"]+)\"/gi) || [])].slice(0, 30).forEach((s) => console.log(s));
    [...new Set(text.match(/\/media\/[^\"'\s]+/gi) || [])].forEach((s) => console.log("MEDIA", s));
    [...new Set(text.match(/background-image:[^;]+/gi) || [])].slice(0, 5).forEach((s) => console.log(s));
  }

  // S3 brute
  console.log("\n=== S3 brute ===");
  const guesses = [
    "BluEarth-ES32-3QL-Web.webp", "BluEarth-ES32-WHT.png", "BluEarth-ES-ES32-3QL-Web.webp",
    "WEB-BLUEARTH-ES32-WHT.png", "BluEarth-ES32.png", "bluearth-es32.png",
    "ADVAN-dB-V552-3QL-Web.webp", "ADVAN-dB-V552-WHT.png", "WEB-ADVAN-dB-V552-WHT.png",
    "Advan-dB-V552-3QL-Web.webp", "Advan-dB-V552-White.png", "ADVAN-DB-V552-3QL-Web.webp",
    "RS2300_1008_YTC_CONS_0810_YTC_CONS_BLUEARTH-0K.webp",
  ];
  for (const g of guesses) {
    const u = "https://ytc-bm.s3.us-east-2.amazonaws.com/" + g;
    const r = await fetch(u, { method: "HEAD", headers: { "User-Agent": UA } }).catch(() => null);
    if (r && r.ok) console.log("OK", g, r.headers.get("content-length"));
  }

  // Tiremart search pages
  for (const q of ["petlas-imperium", "petlas-snowmaster", "petlas-explero"]) {
    const { status, text } = await get("https://www.tiremart.com/search.php?search_query=" + q);
    console.log("\nTM search", q, status);
    const links = [...new Set(text.match(/\/petlas-[^\"'\s]+/gi) || [])].slice(0, 8);
    links.forEach((l) => console.log(l));
    if (links[0]) {
      const page = await get("https://www.tiremart.com" + links[0]);
      const img = page.text.match(/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
      if (img) console.log("IMG", img[0]);
    }
  }

  // Oponeo starmaxx
  for (const u of [
    "https://www.oponeo.co.uk/tyre-model/starmaxx-naturen-st542",
    "https://www.oponeo.co.uk/tyre-model/starmaxx-incurro-w870",
    "https://www.oponeo.co.uk/tyre-model/lassa-driveways",
    "https://www.oponeo.co.uk/tyre-model/lassa-competus-at2",
    "https://www.oponeo.co.uk/tyre-model/lassa-snoways-4",
  ]) {
    const { status, text } = await get(u);
    console.log("\nOPONEO", status, u.split("/").pop());
    const imgs = [...new Set(text.match(/https:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])]
      .filter((x) => /cdn|static|product|tyre|tire|model/i.test(x) && !/logo|icon|banner|star|rating|svg|social/i.test(x))
      .slice(0, 8);
    imgs.forEach((i) => console.log(i));
  }

  // BFG listing
  const bfg = await get("https://www.bfgoodrich.co.uk/auto/tyres");
  const tires = [...new Set(bfg.text.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^\"'\s\\]+tire_bfgoodrich[^\"'\s\\]+_main_[^\"'\s\\]+\.webp/gi) || [])]
    .map((u) => u.replace(/\\u002F/g, "/").split("?")[0]);
  console.log("\nBFG sport/winter:");
  tires.filter((t) => /sport|comp|winter|phenom|g-force/i.test(t)).forEach((t) => console.log(t));

  // Lassa kolayoto + global
  for (const u of [
    "https://kolayoto.com/products/lassa-driveways-sport-245-40r18-97y-xl-1",
    "https://www.lassa.com/tyres/driveways-sport-",
    "https://www.lassa.com/tyres/competus-at-2",
    "https://www.lassa.com/tyres/snoways-4",
    "https://mosautoshina.com/catalog/tyre/lassa/driveways/",
    "https://mosautoshina.com/catalog/tyre/lassa/competus-at2/",
    "https://mosautoshina.com/catalog/tyre/lassa/snoways-4/",
  ]) {
    const { status, text } = await get(u);
    console.log("\nLASSA src", status, u);
    [...new Set(text.match(/https?:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])]
      .filter((x) => /lassa|driveways|competus|snoways|tyre|tire|cdn|media|upload|azure|hybris/i.test(x) && !/logo|icon|banner|sprite|flag|og_/i.test(x))
      .slice(0, 10)
      .forEach((i) => console.log(i));
  }
})();
