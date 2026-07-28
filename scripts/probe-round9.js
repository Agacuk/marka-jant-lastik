"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/ultragrip-performance-3.html",
  "https://www.hankooktire.com/uk/en/tire/dynapro/hp2-rh12.html",
  "https://www.hankooktire.com/uk/en/tire/dynapro/hpx-rh12.html",
  "https://www.hankooktire.com/uk/en/tire/winter/icept-evo3-w330.html",
  "https://www.hankooktire.com/uk/en/tire/winter/icept-evo3-w330a.html",
  "https://tires.bridgestone.com/en-us/tires/automotive/turanza/t005-a",
  "https://tires.bridgestone.com/en-us/tires/automotive/alenza/alenza-001",
  "https://www.nexentire.com/international/product/passenger/suv/nfera-sport.php",
  "https://www.kumhotire.com/eu/passenger/ecsta-ps71/",
  "https://www.yokohama.eu/eu-en/tyres/pattern/advan-sport-v105/",
  "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-pilot-sport",
  "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-advantage-touring",
  "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2-suv",
];

async function run() {
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
      const h = await r.text();
      const d = h.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      console.log("\n", r.status, u.split("/").slice(-2).join("/"));
      const hits = [...new Set(d.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
        .filter((x) => /product|tire|tyre|potenza|turanza|blizzak|alenza|dynapro|icept|h750|k127|rh12|w330|nfera|ecsta|advan|bluearth|geolandar|bfg|dxm\.contentcenter|effigripp|vec4|ultrgrip|ultra/i.test(x) && !/logo|icon|favicon|social|share|sprite|banner|dealer|navigation|test-result|thumb[0-9]|ending|gra\.png|wet|handling|ride|snow[12]|awards|recommended|link_thumb/i.test(x))
        .slice(0, 6);
      hits.forEach((x) => console.log(" ", x.slice(0, 150)));
      const rel = [...new Set(d.match(/\/content\/dam\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
        .filter((x) => /turanza|alenza|ultrgrip|ultra|goodyear\/consumer|effigripp|vec4/i.test(x) && !/favicon|test-result|ev-ready/i.test(x))
        .slice(0, 6);
      rel.forEach((x) => console.log(" rel:", x.slice(0, 150)));
      const slug = d.match(/[A-Z0-9]{6,12}\.html|ultrgrip[a-z0-9]+|ULTR[A-Z0-9]+|effigripp2|vec4seasg3/gi);
      if (slug) console.log(" slug:", [...new Set(slug)].slice(0, 5));
      const dxm = d.match(/dxm\.contentcenter\.michelin\.com[^"'\s]+\.webp/gi);
      if (dxm) dxm.slice(0, 1).forEach((x) => console.log(" dxm:", x.slice(0, 130)));
    } catch (e) {
      console.log("\n ERR", u, e.message);
    }
  }
}
run();
