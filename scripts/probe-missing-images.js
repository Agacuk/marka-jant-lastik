"use strict";
const fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const probes = [
  ["gy-ultra", "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3.ULTRGRIPPERF3.html"],
  ["gy-ultra2", "https://www.goodyear.eu/en_gb/consumer/tires/ultragrip_performance_3.ULTRGRIPPERF3.html"],
  ["bfg-ps", "https://www.bfgoodrich.com/auto/tyres/bfgoodrich-g-force-pilot-sport-2"],
  ["bfg-adv", "https://www.bfgoodrich.com/auto/tyres/bfgoodrich-advantage-touring-2"],
  ["bfg-win", "https://www.bfgoodrich.com/auto/tyres/bfgoodrich-g-force-winter-2"],
  ["nexen-ev", "https://www.nexentire.com/international/product/passenger/nblue-nx1.php"],
  ["nexen-ev2", "https://www.nexentire.com/international/product/ev_root/nblue-ev.php"],
  ["kumho-ps71", "https://www.kumhotire.com/global/en/product/detail/PS71.html"],
  ["kumho-ps712", "https://www.kumhotire.co.kr/eng/product/product_view.do?prdCode=PS71"],
  ["yoko-advan", "https://www.yokohama.com/product/advan-sport-v105/"],
  ["yoko-advan2", "https://www.yokohama.eu/eu-en/tyres/pattern/advan-sport-v105/"],
  ["lassa-revola", "https://www.lassa.com.tr/tr/urunler/revola"],
  ["lassa-revola2", "https://www.lassa.com.tr/urun/revola"],
  ["petlas-velox", "https://www.petlas.com.tr/urun/velox-sport"],
  ["starmaxx-x1", "https://www.starmaxx.com.tr/urunler/starmaxx-x1"],
];

async function probe(name, url) {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8" },
      redirect: "follow",
    });
    const h = await r.text();
    console.log("\n", name, r.status, r.url);
    const imgs = [...new Set(h.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => !/logo|icon|favicon|banner|social|share|sprite|navigation|footer|dealer|language|category|og-image-en/i.test(x))
      .filter((x) => /product|tire|tyre|lastik|revola|velox|explero|imperium|snowmaster|starmaxx|ecsta|solus|crugen|winter|ecowing|advan|bluearth|geolandar|iceguard|nblue|ultrgrip|ultra|effigripp|vec4|dxm\.contentcenter|dynamicmedia|hankook|kumho|yokohama|lassa|petlas|afieldfile/i.test(x))
      .slice(0, 8);
    imgs.forEach((i) => console.log(" ", i.slice(0, 150)));
    const rel = [...new Set(h.match(/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /product|tire|tyre|lastik|revola|velox|explero|imperium|snowmaster|starmaxx|ecsta|solus|crugen|winter|ecowing|advan|bluearth|geolandar|iceguard|nblue|ultrgrip|afieldfile|content\/dam/i.test(x) && !/logo|icon|favicon|banner|navigation|language|category|popup|recommend|why_|service_|find_/i.test(x))
      .slice(0, 8);
    rel.forEach((i) => console.log(" rel:", i.slice(0, 150)));
    const dxm = h.match(/dxm\.contentcenter\.michelin\.com[^"'\s]+\.webp/gi);
    if (dxm) dxm.slice(0, 2).forEach((x) => console.log(" dxm:", x.slice(0, 130)));
  } catch (e) {
    console.log("\n ERR", name, e.message);
  }
}

(async () => {
  for (const [n, u] of probes) await probe(n, u);
})();
