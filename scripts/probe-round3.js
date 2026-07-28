"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  ["p-zero", "https://www.pirelli.com/tyres/en-ww/car/catalogue/product/p-zero"],
  ["cinturato", "https://www.pirelli.com/tyres/en-ww/car/catalogue/product/cinturato-p7-c2"],
  ["scorpion", "https://www.pirelli.com/tyres/en-ww/car/catalogue/product/scorpion-verde-all-season"],
  ["powergy", "https://www.pirelli.com/tyres/en-ww/car/catalogue/product/powergy"],
  ["yoko-advan", "https://www.yokohama.eu/eu-en/tyres/car-tyres/advan-sport-v105/"],
  ["yoko-blue", "https://www.yokohama.eu/eu-en/tyres/car-tyres/bluearth-es32/"],
  ["hk-ventus", "https://www.hankook.co.uk/tyres/car-tyres/ventus-s1-evo3/"],
  ["hk-kinergy", "https://www.hankook.co.uk/tyres/car-tyres/kinergy-4s2/"],
];

async function run() {
  for (const [n, u] of urls) {
    const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
    const h = await r.text();
    const d = h.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const imgs = [...new Set(d.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => !/logo|icon|favicon|social|share|sprite|banner|hero-card/i.test(x));
    const rel = [...new Set(d.match(/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /product|tire|tyre|p-zero|cinturato|scorpion|powergy|advan|bluearth|ventus|kinergy/i.test(x));
    console.log("\n", n, r.status, r.url);
    imgs.slice(0, 5).forEach((i) => console.log(" abs:", i.slice(0, 130)));
    rel.slice(0, 5).forEach((i) => console.log(" rel:", i.slice(0, 130)));
    const og = d.match(/property="og:image"\s+content="([^"]+)"/i);
    if (og) console.log(" og:", og[1]);
  }
}
run();
