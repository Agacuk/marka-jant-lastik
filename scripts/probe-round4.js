"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  ["gy-why-egp", "https://www.goodyear.co.uk/en_gb/consumer/why-goodyear/efficientgrip-performance-2.html"],
  ["gy-why-v4s", "https://www.goodyear.co.uk/en_gb/consumer/why-goodyear/vector-4seasons-gen-3.html"],
  ["gy-why-ug", "https://www.goodyear.co.uk/en_gb/consumer/why-goodyear/ultragrip-performance-3.html"],
  ["bs-potenza", "https://www.bridgestone.co.uk/tyres/car-tyres/potenza-sport/"],
  ["bs-turanza", "https://www.bridgestone.co.uk/tyres/car-tyres/turanza-t005/"],
  ["bs-blizzak", "https://www.bridgestone.co.uk/tyres/car-tyres/blizzak-lm005/"],
  ["bs-alenza", "https://www.bridgestone.co.uk/tyres/car-tyres/alenza-001/"],
  ["kumho-api", "https://www.kumhotire.com/eu/api/product/ecsta-ps71"],
  ["nexen-nfera", "https://www.nexentire.com/international/product/passenger/suv/nfera-sport/"],
];

async function run() {
  for (const [n, u] of urls) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
      const ct = r.headers.get("content-type") || "";
      const body = await r.text();
      console.log("\n", n, r.status, r.url, ct.slice(0, 40));
      if (ct.includes("json")) {
        console.log(body.slice(0, 500));
        continue;
      }
      const d = body.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      const hits = [...new Set(d.match(/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
        .filter((x) => /product|tire|tyre|potenza|turanza|blizzak|alenza|efficientgrip|vector|ultragrip|nfera|ecsta|scene7|dynamicmedia|dxm\.contentcenter/i.test(x) && !/logo|icon|favicon|flag|country|navigation|dealer|homepage|banner/i.test(x))
        .slice(0, 8);
      hits.forEach((h) => console.log(" ", h.slice(0, 140)));
    } catch (e) {
      console.log("\n", n, "ERR", e.message);
    }
  }
}
run();
