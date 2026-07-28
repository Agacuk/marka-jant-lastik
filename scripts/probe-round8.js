"use strict";
const fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  ["gy-ultragrip", "https://www.goodyear.co.uk/en_gb/consumer/why-goodyear/goodyear-ultragrip-performance-3-2025.html"],
  ["hk-ventus", "https://www.hankooktire.com/uk/en/tire/ventus/s1evo3-k127.html"],
  ["hk-kinergy", "https://www.hankooktire.com/uk/en/tire/kinergy/4s2-h750.html"],
  ["hk-dynapro", "https://www.hankooktire.com/uk/en/tire/dynapro/hp2-rh12.html"],
  ["hk-winter", "https://www.hankooktire.com/uk/en/tire/winter/icept-evo3-w330.html"],
  ["nexen-nfera", "https://www.nexentire.com/international/product/passenger/suv/nfera-sport/index.php"],
  ["kumho-ps71", "https://www.kumhotire.com/en/tire/view.do?menuCd=MN000014&idx=PS71"],
  ["yoko-advan", "https://www.yokohama.eu/eu-en/tyres/car-tyres/advan-sport-v105"],
  ["bs-t005", "https://tires.bridgestone.com/en-us/tires/automotive/turanza/t005"],
  ["bs-alenza", "https://tires.bridgestone.com/en-us/tires/automotive/alenza/001"],
];

async function run() {
  for (const [n, u] of urls) {
    const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
    const h = await r.text();
    fs.writeFileSync("probe-" + n + ".html", h.slice(0, 600000));
    const d = h.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    console.log("\n", n, r.status);
    const imgs = [...new Set(d.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => !/logo|icon|favicon|social|share|sprite|banner|dealer|navigation|apple-touch|language|category|search_ico|close\.png|og-image|sns_|marshal|zetum/i.test(x))
      .slice(0, 12);
    imgs.forEach((i) => console.log(" ", i.slice(0, 150)));
    const rel = [...new Set(d.match(/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /product|tire|tyre|hankook|kumho|nexen|yokohama|goodyear|bridgestone|dam\/|resources\/|assets\/|uploads\//i.test(x) && !/logo|icon|favicon|language|category|search|close|sns_|marshal|zetum|favicon/i.test(x))
      .slice(0, 12);
    rel.forEach((i) => console.log(" rel:", i.slice(0, 150)));
  }
}
run();
