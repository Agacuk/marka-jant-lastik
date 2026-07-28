"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  ["gy-ultra", "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3.ULTRGRIPPF3.html"],
  ["gy-ultra2", "https://www.goodyear.eu/en_gb/consumer/tires/ultragrip_performance_3.ULTRGRIPPF3.html"],
  ["gy-ultra3", "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance+3.ULTRGRIPPF3.html"],
  ["kumho-ps", "https://www.kumhotire.com/global/en/product/passenger/ecsta-ps71.html"],
  ["kumho-ps2", "https://www.kumhotire.com/eu/passenger/ecsta-ps71/"],
  ["yoko-us", "https://www.yokohamatire.com/tires/advan-sport-v105"],
  ["yoko-us2", "https://www.yokohamatire.com/tire/advan-sport-v105/"],
  ["lassa", "https://www.lassa.com.tr/en/product/revola"],
  ["lassa2", "https://www.lassa.com.tr/en/products/revola-4-seasons"],
  ["petlas", "https://www.petlas.com/en/products/velox-sport"],
  ["starmaxx", "https://www.starmaxx.com/en/product/starmaxx-x1"],
  ["bfg-fr", "https://www.bfgoodrich.fr/auto/pneus/bfgoodrich-g-force-pilot-sport-2"],
  ["nexen-ev", "https://www.nexentire.com/international/product/ev_root/nblue-ev/index.php"],
];

async function run() {
  for (const [n, u] of urls) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA, "Accept-Language": "en,tr" }, redirect: "follow" });
      const h = await r.text();
      console.log("\n", n, r.status, r.url.split("/").slice(-2).join("/"));
      const rel = [...new Set(h.match(/\/content\/dam\/[^"'\s]+\.(?:jpg|png|webp)|afieldfile[^"'\s]+\.(?:jpg|png|webp)|\/resources\/[^"'\s]+\.(?:jpg|png|webp)|dxm\.contentcenter[^"'\s]+\.webp/gi) || [])]
        .filter((x) => !/logo|icon|favicon|banner|navigation|language|test-result|sns_|marshal/i.test(x))
        .slice(0, 8);
      rel.forEach((x) => console.log(" ", x.slice(0, 140)));
    } catch (e) {
      console.log("\n ERR", n, e.message);
    }
  }

  // Goodyear ultragrip design slug brute
  const slugs = ["ULTRGRIPPF3", "ULTRGRIPP3", "ULTRGRIP3", "ULTRGRIPPERF3", "ULTRGRIPPERF", "ULTRGRIPPF"];
  for (const s of slugs) {
    const u = "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3." + s + ".html";
    const r = await fetch(u, { method: "HEAD", headers: { "User-Agent": UA } });
    if (r.ok) console.log("GY OK", s);
  }
}

run();
