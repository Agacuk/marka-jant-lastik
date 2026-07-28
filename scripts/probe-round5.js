"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const tests = [
  ["pirelli-c7", "https://www.pirelli.com/tyres/en-ww/car/catalogue/product/cinturato-p7"],
  ["bs-de-potenza", "https://www.bridgestone.de/de/consumer/reifen/potenza-sport"],
  ["bs-de-potenza2", "https://www.bridgestone.de/de/auto/reifen/potenza-sport"],
  ["hk-global", "https://www.hankooktire.com/global/en/tires/passenger/ventus-s1-evo3.html"],
  ["yoko-pattern", "https://www.yokohama.eu/eu-en/tyres/pattern/advan-sport-v105"],
  ["kumho-uk", "https://www.kumhotire.co.uk/tyres/ecsta-ps71/"],
  ["bfg-winter", "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2-suv"],
  ["bfg-adv", "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-advantage-touring"],
  ["lassa-tr", "https://www.lassa.com.tr/lastikler/revola"],
  ["petlas-tr", "https://www.petlas.com.tr/tr/urun/velox-sport"],
  ["nexen-nfera2", "https://www.nexentire.com/international/product/passenger/nfera-sport/"],
];

async function run() {
  for (const [n, u] of tests) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA, "Accept-Language": "en-GB,en;q=0.9,tr;q=0.8" }, redirect: "follow" });
      const h = await r.text();
      const d = h.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      console.log("\n", n, r.status, r.url);
      const visori = d.match(/tyre24\.pirelli\.com\/dynamic_engine\/assets\/visori\/3_4\/[^"'\s]+\.png/gi);
      if (visori) visori.forEach((v) => console.log(" pirelli:", v));
      const dxm = d.match(/dxm\.contentcenter\.michelin\.com[^"'\s]+\.webp/gi);
      if (dxm) dxm.slice(0, 2).forEach((v) => console.log(" dxm:", v.slice(0, 120)));
      const dm = d.match(/dynamicmedia\/deliver[^"'\s]+/gi);
      if (dm) dm.slice(0, 2).forEach((v) => console.log(" dm:", v.slice(0, 120)));
      const s7 = d.match(/s7[^"'\s]+scene7[^"'\s]+(?:potenza|turanza|blizzak|alenza|tyre|tire)[^"'\s]*/gi);
      if (s7) s7.slice(0, 3).forEach((v) => console.log(" s7:", v.slice(0, 120)));
      const imgs = [...new Set(d.match(/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
        .filter((x) => /product|tire|tyre|lastik|ecsta|ventus|revola|velox|nfera|potenza|advan|geolandar|iceguard|bluearth|imperium|explero|snowmaster|starmaxx/i.test(x) && !/logo|icon|favicon|flag|og-image|sns_|marshal|zetum|language|popup|banner|footer|navigation/i.test(x))
        .slice(0, 6);
      imgs.forEach((i) => console.log(" img:", i.slice(0, 130)));
    } catch (e) {
      console.log("\n", n, "ERR", e.message);
    }
  }

  // Goodyear design image guesses
  const gyCodes = [
    ["eagle-f1-asymmetric", "724535"],
    ["efficientgrip-performance", "581486"],
    ["vector-4seasons-gen3", "542449"],
    ["ultragrip-performance", "638901"],
  ];
  console.log("\n=== Goodyear DAM guesses ===");
  for (const [name, code] of gyCodes) {
    for (const type of ["profile", "front", "side"]) {
      const u = `https://www.goodyear.co.uk/content/dam/common/tires/goodyear/consumer/${code}/${code}-${type}.jpg.transform/rendition-900/image.jpg`;
      try {
        const r = await fetch(u, { method: "HEAD", headers: { "User-Agent": UA } });
        if (r.ok) console.log(" OK", name, type, code, r.headers.get("content-length"));
      } catch (_) {}
    }
  }
}
run();
