"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  "https://www.goodyear.eu/en_gb/consumer/tires/vector_4seasons_gen-3.VEC4SEASG3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3.ULTRGRIPPF3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultragrip_performance_3.ULTRGRIPPF3.html",
  "https://tires.bridgestone.com/en-us/tires/automotive/turanza/t005",
  "https://tires.bridgestone.com/en-us/tires/automotive/alenza/001",
  "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-pilot-sport-2",
  "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-advantage-touring-2",
  "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2",
  "https://www.nexentire.com/international/product/passenger/suv/nfera-sport/index.php",
  "https://www.nexentire.com/international/product/passenger/nfera-sport/index.php",
  "https://www.hankooktire.com/global/en/tires/passenger/ventus-s1-evo3",
  "https://www.kumhotire.com/en/tire/view.do?menuCd=MN000014&idx=PS71",
];

async function run() {
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
      const h = await r.text();
      const d = h.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      console.log("\n", r.status, u);
      const rel = [...new Set(d.match(/\/content\/dam\/[^"'\s]+\.(?:jpg|png|webp)/gi) || [])]
        .filter((x) => /tire|tyre|goodyear|bridgestone|potenza|turanza|blizzak|alenza|effigripp|vec4|ultrgrip|ultra|bfg|nexen|hankook|kumho|ecsta|ventus|nfera/i.test(x) && !/favicon|icon|logo|ev-ready/i.test(x))
        .slice(0, 10);
      rel.forEach((x) => console.log(" ", x.slice(0, 150)));
      const dxm = d.match(/dxm\.contentcenter\.michelin\.com[^"'\s]+\.webp/gi);
      if (dxm) dxm.slice(0, 2).forEach((x) => console.log(" dxm:", x.slice(0, 130)));
    } catch (e) {
      console.log("\n ERR", u, e.message);
    }
  }
}
run();
