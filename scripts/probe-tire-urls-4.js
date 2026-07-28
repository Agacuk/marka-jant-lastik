"use strict";
const fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

(async () => {
  const bfg = fs.readFileSync("probe-bfg.html", "utf8");
  const urls = [...bfg.matchAll(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s\\]+tire_bfgoodrich[^"'\s\\]+\.webp/gi)].map((m) => m[0].split("?")[0].replace(/&amp;/g, "&"));
  const uniq = [...new Set(urls)];
  console.log("BFG URLs", uniq.length);
  uniq.filter((u) => /g-force|pilot|sport|winter|advantage|comp/i.test(u)).forEach((u) => console.log(u));

  const pages = [
    "https://www.tyreleader.ie/car-tyres/lassa/driveways/205-50-r16-87w-1576586",
    "https://mosautoshina.com/catalog/tyre/lassa/driveways/",
    "https://www.tiremart.com/petlas-explero-pt431",
    "https://www.tiremart.com/brands/petlas.html",
  ];
  for (const u of pages) {
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    const html = await r.text();
    const imgs = [...html.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|png|webp)/gi)].map((m) => m[0]).filter((x) => /tire|tyre|lastik|lassa|petlas|product|catalog|cdn/i.test(x) && !/logo|icon|banner|sprite|flag/i.test(x));
    console.log("\n", u, r.status);
    [...new Set(imgs)].slice(0, 12).forEach((x) => console.log(x));
  }
})();
