"use strict";
const fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function decode(s) {
  return s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\\\//g, "/");
}

async function probe(name, url, base) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    const html = await res.text();
    const d = decode(html);
    const imgs = [];
    const patterns = [
      /https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi,
      /\/(?:content|dam|images|assets|media|uploads)[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi,
      /dxm\.contentcenter\.michelin\.com[^"'\s]+\.webp/gi,
      /dynamicmedia\/deliver[^"'\s]+/gi,
    ];
    patterns.forEach((re) => {
      const m = d.match(re) || [];
      m.forEach((u) => imgs.push(u.startsWith("http") ? u : base + u));
    });
    const product = [...new Set(imgs)].filter(
      (u) =>
        /product|tire|tyre|ProductPicture|productpicture|_30|degree|main|pattern/i.test(u) &&
        !/logo|icon|favicon|banner|og-image|social|sprite|avatar|footer|header|dealer|navigation|apple-touch|mstile|android-chrome|favicon|1024\.png/i.test(u)
    );
    console.log("\n===", name, res.status, url);
    product.slice(0, 5).forEach((u) => console.log(" ", u.slice(0, 140)));
    if (!product.length) {
      const og = d.match(/property="og:image"\s+content="([^"]+)"/i);
      if (og) console.log(" og:", og[1]);
    }
    return { name, status: res.status, imgs: product.slice(0, 8) };
  } catch (e) {
    console.log("\n===", name, "ERR", e.message);
    return { name, status: "ERR", imgs: [] };
  }
}

(async () => {
  const items = [
    ["gy-egp", "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/efficientgrip-performance-2.html", "https://www.goodyear.co.uk"],
    ["gy-v4s", "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/vector-4seasons-gen-3.html", "https://www.goodyear.co.uk"],
    ["gy-ug", "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/ultragrip-performance-3.html", "https://www.goodyear.co.uk"],
    ["bs-potenza", "https://www.bridgestone.eu/en-gb/consumer/tyres/potenza-sport", "https://www.bridgestone.eu"],
    ["bs-turanza", "https://www.bridgestone.eu/en-gb/consumer/tyres/turanza-t005", "https://www.bridgestone.eu"],
    ["bs-blizzak", "https://www.bridgestone.eu/en-gb/consumer/tyres/blizzak-lm005", "https://www.bridgestone.eu"],
    ["bs-alenza", "https://www.bridgestone.eu/en-gb/consumer/tyres/alenza-001", "https://www.bridgestone.eu"],
    ["kumho-ps71", "https://www.kumhotire.com/eu/passenger/ecsta-ps71/", "https://www.kumhotire.com"],
    ["kumho-solus", "https://www.kumhotire.com/eu/passenger/solus-4s-ha32/", "https://www.kumhotire.com"],
    ["hk-ventus", "https://www.hankooktire.com/global/en/product/ventus-s1-evo3.html", "https://www.hankooktire.com"],
    ["hk-kinergy", "https://www.hankooktire.com/global/en/product/kinergy-4s2.html", "https://www.hankooktire.com"],
    ["pirelli-pzero", "https://www.pirelli.com/tyres/en-ww/car/product/p-zero-tyre", "https://www.pirelli.com"],
    ["pirelli-pzero2", "https://www.pirelli.com/tyres/en-gb/car/product/p-zero", "https://www.pirelli.com"],
    ["pirelli-pzero3", "https://www.pirelli.com/tyres/en-ww/car/product/p-zero/", "https://www.pirelli.com"],
    ["yoko-advan", "https://www.yokohama.eu/eu-en/tyres/pattern/advan-sport-v105", "https://www.yokohama.eu"],
    ["yoko-advan2", "https://www.yokohama.eu/en/tyres/pattern/advan-sport-v105", "https://www.yokohama.eu"],
    ["bfg-ps", "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-pilot-sport", "https://www.bfgoodrich.co.uk"],
    ["bfg-at", "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-all-terrain-t-a-ko2", "https://www.bfgoodrich.co.uk"],
    ["lassa-revola", "https://www.lassa.com/en/products/revola", "https://www.lassa.com"],
    ["lassa-revola2", "https://www.lassa.com.tr/en/products/revola", "https://www.lassa.com.tr"],
    ["petlas-velox", "https://www.petlas.com/en/product/velox-sport", "https://www.petlas.com"],
    ["starmaxx-x1", "https://www.starmaxx.com/en/products/starmaxx-x1", "https://www.starmaxx.com"],
    ["nexen-nfera", "https://www.nexentire.com/international/product/passenger/suv/nfera-sport/", "https://www.nexentire.com"],
  ];
  const out = [];
  for (const [n, u, b] of items) out.push(await probe(n, u, b));
  fs.writeFileSync("probe-round2.json", JSON.stringify(out, null, 2));
})();
