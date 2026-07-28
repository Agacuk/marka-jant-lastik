"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  "https://www.goodyear.eu/en_gb/consumer/tires/efficientgrip_performance_2.EFFIGRIPP2.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/vector_4seasons_gen_3.VECTOR4SG3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultragrip_performance_3.ULTRGRIPP3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/eagle_f1_asymmetric_6.EAGLF1AS6.html",
  "https://www.bridgestone.com/en-us/consumer/tires/potenza-sport-as",
  "https://www.bridgestone.com/en-us/consumer/tires/potenza-sport-2",
  "https://www.hankooktire.com/global/en/product/detail/1010100.html",
  "https://www.kumhotire.com/en/product/detail.do?prdIdx=123",
];

async function run() {
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
      const h = await r.text();
      const d = h.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      console.log("\n", r.status, u.split("/").slice(-1)[0]);
      const imgs = [...new Set(d.match(/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
        .filter((x) => /product|tire|tyre|efficientgrip|vector|ultragrip|eagle|potenza|ventus|ecsta|design|consumer/i.test(x) && !/logo|icon|favicon|dealer|navigation|homepage|banner|test-|auto-bild/i.test(x))
        .slice(0, 10);
      imgs.forEach((i) => console.log(" ", i.slice(0, 140)));
      const design = d.match(/designKey=\"(\d+)\"/g);
      if (design) console.log(" designKey:", design.slice(0, 3));
    } catch (e) {
      console.log("\n ERR", u, e.message);
    }
  }
}
run();
