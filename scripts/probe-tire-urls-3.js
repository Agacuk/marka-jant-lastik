"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
const fs = require("fs");

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  return { status: r.status, text: await r.text() };
}

(async () => {
  const pages = {
    nexen: "https://www.nexentire.com/international/product/passenger/nblue-s.php",
    yoko1: "https://www.yokohama.com.au/our-range/tyres/BluEarth%20Es%20ES32",
    yoko2: "https://www.yokohama.com.au/our-range/tyres/Advan%20dB%20V552",
    bfg: "https://www.bfgoodrich.co.uk/auto/tyres",
  };
  for (const [k, u] of Object.entries(pages)) {
    const { status, text } = await get(u);
    fs.writeFileSync(`probe-${k}.html`, text.slice(0, 500000));
    const imgs = [...text.matchAll(/(?:https?:\/\/[^"'\s]+|\/?wp-content\/[^"'\s]+|\/?media\/[^"'\s]+)(?:[^"'\s]*\.(?:jpg|png|webp))/gi)].map((m) => m[0]);
    console.log(k, status, "imgs", [...new Set(imgs)].filter((x) => /tyre|tire|product|bluearth|advan|g-force|gforce|sport|winter|nexen|product/i.test(x)).slice(0, 15));
    if (k === "bfg") {
      const gf = [...text.matchAll(/g-force[^"'\s]{0,40}/gi)].map((m) => m[0]).slice(0, 20);
      console.log("g-force refs", gf);
      const urls = [...text.matchAll(/tire_bfgoodrich_g-force[^"'\s\\]+\.webp/gi)].map((m) => m[0]);
      console.log("gforce urls", [...new Set(urls)].slice(0, 10));
    }
  }

  // tire-reviews petlas images
  const tr = await get("https://www.tire-reviews.com/Tire/Petlas/Velox-Sport-PT741.htm/view_media/");
  const trImgs = [...tr.text.matchAll(/https:\/\/[^"'\s]+\.(?:jpg|png|webp)/gi)].map((m) => m[0]);
  console.log("tire-reviews petlas", trImgs.slice(0, 10));

  const tr2 = await get("https://www.tire-reviews.com/Tire/Petlas/Explero-PT431.htm/view_media/");
  console.log("tire-reviews explero", [...tr2.text.matchAll(/https:\/\/[^"'\s]+\.(?:jpg|png)/gi)].map((m) => m[0]).slice(0, 5));
})();
