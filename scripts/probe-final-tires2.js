"use strict";
const fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function scrape(label, url, filter) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const html = await r.text();
  console.log("\n===", label, r.status, url, "===");
  const imgs = [...new Set(html.match(/https?:\/\/[^"'\s\\]+\.(?:jpg|jpeg|png|webp)/gi) || [])]
    .filter((x) => !filter || filter(x))
    .slice(0, 15);
  imgs.forEach((i) => console.log(i));
  return imgs;
}

(async () => {
  await scrape("YOKO AU bluearth", "https://www.yokohama.com.au/our-range/tyres/BluEarth%20Es%20ES32", (x) => /tyre|tire|bluearth|es32|media/i.test(x) && !/logo|icon|footer|banner/i.test(x));
  await scrape("YOKO AU advan-db", "https://www.yokohama.com.au/our-range/tyres/Advan%20dB%20V552", (x) => /tyre|tire|advan|v552|media/i.test(x) && !/logo|icon|footer|banner/i.test(x));
  await scrape("YOKO tire blu-earth", "https://www.yokohamatire.com/tires/blu-earth-es32", (x) => /ytc-bm|s3\.|product|tire|bluearth/i.test(x) && !/logo|icon/i.test(x));
  await scrape("YOKO tire advan-db", "https://www.yokohamatire.com/tires/advan-db-v552", (x) => /ytc-bm|s3\.|product|tire|advan/i.test(x) && !/logo|icon/i.test(x));

  await scrape("LASSA mosauto driveways", "https://mosautoshina.com/catalog/tyre/lassa/driveways/", (x) => /lassa|driveways|tyre|tire|catalog|cdn|upload/i.test(x) && !/logo|icon|sprite/i.test(x));
  await scrape("LASSA tyreleader", "https://www.tyreleader.ie/car-tyres/lassa/driveways/205-50-r16-87w-1576586", (x) => /tyre|tire|lassa|cdn|image/i.test(x) && !/logo|icon|flag/i.test(x));
  await scrape("LASSA kolayoto", "https://kolayoto.com/products/lassa-driveways-sport-245-40r18-97y-xl-1", (x) => /cdn|shop|files|lassa|driveways/i.test(x));

  const bfg = await fetch("https://www.bfgoodrich.co.uk/auto/tyres", { headers: { "User-Agent": UA } }).then((r) => r.text());
  const bfgTires = [...new Set(bfg.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s\\]+tire_bfgoodrich[^"'\s\\]+_main_[^"'\s\\]+\.webp/gi) || [])]
    .map((u) => u.replace(/\\u002F/g, "/").split("?")[0].replace(/&quot;.*/, ""));
  console.log("\n=== BFG all main tires ===");
  bfgTires.filter((u) => /g-force|sport|comp|pilot|winter|phenom/i.test(u)).forEach((u) => console.log(u));

  for (const slug of [
    "petlas-explero-pt431-h-t-225-65r17-102h-performance-tire",
    "petlas-imperium-pt515-205-55r16-91v",
    "petlas-snowmaster-pt935-205-55r16-91h",
    "petlas-velox-sport-pt741-205-55r16-91v",
  ]) {
    await scrape("TM " + slug, "https://www.tiremart.com/" + slug, (x) => /bigcommerce|cdn11/i.test(x));
  }

  for (const u of [
    "https://www.oponeo.co.uk/tyre-model/petlas-imperium-pt515",
    "https://www.oponeo.co.uk/tyre-model/petlas-snowmaster-pt935",
    "https://www.prioritytire.com/by-brand/starmaxx-tires/naturen-st542",
    "https://www.prioritytire.com/by-brand/starmaxx-tires/incurro-winter-w870",
    "https://www.oponeo.co.uk/tyre-model/starmaxx-naturen-st542",
    "https://www.oponeo.co.uk/tyre-model/starmaxx-incurro-w870",
  ]) {
    await scrape("RETAIL " + u.split("/").slice(-2).join("/"), u, (x) => /tire|tyre|product|cdn|image|starmaxx|petlas|naturen|w870|imperium|snowmaster/i.test(x) && !/logo|icon|banner|star|rating|svg/i.test(x));
  }

  // Lassa desen alternate slugs
  for (const slug of ["dwt-02-driveways-sport-", "dww-02-driveways", "cmp-01-competus", "snw-01-snoways", "at2-01-competus-at2", "snw-04-snoways4"]) {
    const r = await fetch("https://www.lassa.com.tr/desen/" + slug, { headers: { "User-Agent": UA } });
    const html = await r.text();
    const imgs = [...new Set(html.match(/medias89k[^"'\s]+\.(?:jpg|webp|png)/gi) || [])];
    console.log("\nLASSA desen", slug, r.status, imgs.length);
    imgs.forEach((i) => console.log(i));
  }

  // Lassa global site
  for (const u of [
    "https://www.lassa.com/tyres/driveways-sport-",
    "https://www.lassa.com/tyres/competus-at-2",
    "https://www.lassa.com/tyres/snoways-4",
  ]) {
    await scrape("LASSA global " + u.split("/").pop(), u, (x) => /lassa|media|tyre|tire|cdn|jpg|webp|png/i.test(x) && !/logo|icon|flag|og/i.test(x));
  }
})();
