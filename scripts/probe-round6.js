"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  "https://tires.bridgestone.com/en-us/tires/automotive/potenza/sport",
  "https://tires.bridgestone.com/en-us/tires/automotive/turanza/t005",
  "https://tires.bridgestone.com/en-us/tires/automotive/blizzak/lm005",
  "https://tires.bridgestone.com/en-us/tires/automotive/alenza/001",
  "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/vector-4seasons-gen-3.html",
  "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/ultragrip-performance-3.html",
];

async function run() {
  for (const u of urls) {
    const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
    const h = await r.text();
    const d = h.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    console.log("\n", r.status, u.split("/").slice(-2).join("/"));
    const imgs = [...new Set(d.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /tire|tyre|product|potenza|turanza|blizzak|alenza|vector|ultragrip|scene7|content\/dam/i.test(x) && !/logo|icon|favicon|avatar|social|warranty|dealer|motorcycle/i.test(x))
      .slice(0, 8);
    imgs.forEach((i) => console.log(" ", i.slice(0, 150)));
    const rel = [...new Set(d.match(/\/content\/dam\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /tire|tyre|goodyear|vector|ultragrip|effigripp|consumer/i.test(x))
      .slice(0, 8);
    rel.forEach((i) => console.log(" rel:", i.slice(0, 150)));
    const codes = d.match(/[a-z0-9]{6,12}(?:front|side|normal)\.jpg/gi);
    if (codes) console.log(" codes:", [...new Set(codes)].slice(0, 6));
    const eff = d.match(/effigripp2|vector4|ultragrip|eaglf1|vect4|ultrgrip/gi);
    if (eff) console.log(" slug:", [...new Set(eff)]);
  }
}
run();
