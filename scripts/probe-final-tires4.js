"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
  return { status: r.status, text: await r.text() };
}

(async () => {
  // Lassa competus - try TR and global product pages
  for (const u of [
    "https://www.lassa.com/tyres/competus-at-2",
    "https://www.lassa.com/tyres/competus-at-3",
    "https://www.lassa.com/tyres/competus-h-p-3",
    "https://www.lassa.com.tr/urunler/competus-at-2",
  ]) {
    const { status, text } = await get(u);
    console.log("\nLASSA", status, u);
    [...new Set(text.match(/https?:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])]
      .filter((x) => /admin\.lassa|medias89k|Uploads\/ERP/i.test(x) && !/logo|banner|cati-soylem|284x108|film-kapak|revola_kv/i.test(x))
      .forEach((i) => console.log(i));
  }

  // BFG pages US and UK
  for (const u of [
    "https://www.bfgoodrich.com/auto/tires/bfgoodrich-g-force-sport-comp-2/",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-sport-comp-2-as",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-comp-2-as",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-sport",
  ]) {
    const { status, text } = await get(u);
    console.log("\nBFG", status, u);
    const m = text.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^\"'\s\\]+tire_bfgoodrich[^\"'\s\\]+_main_[^\"'\s\\]+\.webp/gi);
    if (m) console.log(m[0].replace(/\\u002F/g, "/").split("?")[0]);
  }

  // Starmaxx retailers
  for (const u of [
    "https://www.discounttire.com/buy-tires/starmaxx-naturen-st542",
    "https://www.discounttire.com/buy-tires/starmaxx-incurro-winter-w870",
    "https://images.simpletire.com/images/rr/starmaxx-naturen-st542-sidetread.jpg",
    "https://images.simpletire.com/images/rr/starmaxx-incurro-winter-w870-sidetread.jpg",
    "https://www.starmaxx.com/en/pcr-detail/naturen-st542/",
    "https://www.starmaxx.com/en/pcr-detail/incurro-winter-w870/",
  ]) {
    const r = await fetch(u, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) }).catch((e) => ({ ok: false, status: 0, err: e.message }));
    if (r.ok) {
      const text = await r.text();
      console.log("\nSTAR", u, r.status);
      if (text.length < 5000 && /jpg|webp|png/i.test(text)) console.log(text.slice(0, 200));
      [...new Set(text.match(/https?:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])]
        .filter((x) => /starmaxx|simpletire|product|tire|naturen|w870|st542|sidetread/i.test(x) && !/logo|icon|banner/i.test(x))
        .slice(0, 8)
        .forEach((i) => console.log(i));
    } else console.log("STAR FAIL", u, r.status || r.err);
  }

  // Petlas pages direct
  for (const slug of [
    "petlas-explero-pt431-h-t-225-65r17-102h-performance-tire",
    "petlas-imperium-pt515-215-65r15-96v-performance-tire",
    "petlas-snow-master-2-195-55r16-87h-winter-tire",
  ]) {
    const { status, text } = await get("https://www.tiremart.com/" + slug);
    const img = text.match(/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
    console.log("\nTM", slug, status, img && img[0].replace(/&amp;/g, "&"));
  }

  // Test download URLs
  const tests = [
    ["yoko-bluearth", "https://www.yokohama.com.au/-/media/images/tyres/tyreimages/bluearth-es-es32.png?h=800&w=800"],
    ["yoko-advan", "https://www.yokohama.com.au/-/media/images/tyres/tyreimages/advan-db-v552.png?h=800&w=800"],
    ["lassa-driveways", "https://admin.lassa.com/Uploads/ERP/dwt_1-1770970578214jpg.jpg"],
    ["lassa-snoways", "https://admin.lassa.com/Uploads/ERP/a44_1-1770808840768jpg_1.jpg"],
  ];
  for (const [name, url] of tests) {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    const len = r.ok ? (await r.arrayBuffer()).byteLength : 0;
    console.log("TEST", name, r.status, len);
  }
})();
