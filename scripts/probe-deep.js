"use strict";
const fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function html(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  return { status: r.status, text: await r.text(), url: r.url };
}

function save(name, text) {
  fs.writeFileSync("probe-" + name + ".html", text.slice(0, 800000));
}

(async () => {
  const pages = [
    ["bs-potenza", "https://www.bridgestone.eu/en-gb/consumer/tyres/potenza-sport"],
    ["gy-egp", "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/efficientgrip-performance-2.html"],
    ["kumho-ps71", "https://www.kumhotire.com/eu/passenger/ecsta-ps71/"],
    ["bfg-at", "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-all-terrain-t-a-ko2"],
    ["nexen-nfera", "https://www.nexentire.com/international/product/passenger/suv/nfera-sport/"],
    ["hk-ventus", "https://www.hankooktire.com/global/en/tires/ventus-s1-evo3.html"],
    ["yoko-advan", "https://www.yokohama.eu/eu-en/tyres/car-tyres/advan-sport-v105/"],
  ];
  for (const [n, u] of pages) {
    const { status, text } = await html(u);
    save(n, text);
    const d = text.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    console.log("\n", n, status);
    const scene7 = [...new Set(d.match(/https:\/\/s7[^"'\s]+/gi) || [])].slice(0, 8);
    scene7.forEach((s) => console.log(" s7:", s.slice(0, 120)));
    const design = d.match(/design[_-]?code["\s:=]+([A-Z0-9_-]+)/gi);
    if (design) console.log(" design:", design.slice(0, 3));
    const jsonLd = d.match(/application\/ld\+json[^>]+>([\s\S]{0,5000}?)<\//gi);
    if (jsonLd) console.log(" ld+json blocks:", jsonLd.length);
    const imgs = [...new Set(d.match(/[^"'\s]+\.(?:webp|png|jpg)/gi) || [])]
      .filter((x) => /ecsta|ventus|potenza|nfera|p-zero|product|tire|tyre|pattern/i.test(x) && !/logo|icon|favicon/i.test(x))
      .slice(0, 10);
    imgs.forEach((i) => console.log(" img:", i.slice(0, 120)));
  }
})();
