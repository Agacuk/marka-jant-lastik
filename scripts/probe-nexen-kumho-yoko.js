"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  "https://www.nexentire.com/international/product/passenger/nfera-sport.php",
  "https://www.nexentire.com/international/product/suv/nfera-sport-suv.php",
  "https://www.nexentire.com/international/product/passenger/nblue-4season2.php",
  "https://www.nexentire.com/international/product/suv/roadian-gtx.php",
  "https://www.nexentire.com/international/product/winter/winguard-winspike3.php",
  "https://www.nexentire.com/international/product/passenger/nblue-ev.php",
  "https://www.kumhotire.com/eu/passenger/ecsta-ps71/",
  "https://www.kumhotire.com/eu/passenger/solus-4s-ha32/",
  "https://www.yokohama.com/product/advan-sport-v105/",
  "https://www.yokohama.com/product/advan-db-v552/",
];

async function run() {
  for (const u of urls) {
    const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
    const h = await r.text();
    console.log("\n", r.status, u);
    const imgs = [...new Set(h.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /product|tire|tyre|nfera|nblue|roadian|winguard|ecsta|solus|crugen|winter|ecowing|advan|bluearth|geolandar|iceguard|kumho|yokohama/i.test(x) && !/logo|icon|favicon|og-image|banner|social|share|sprite|navigation|footer|dealer/i.test(x))
      .slice(0, 8);
    imgs.forEach((i) => console.log(" ", i.slice(0, 150)));
    const rel = [...new Set(h.match(/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /afieldfile|product|tire|tyre|ecsta|solus|crugen|winter|ecowing|advan|bluearth|geolandar|iceguard|nfera|nblue|roadian|winguard/i.test(x) && !/logo|icon|banner|topbanner|popup|recommend|why_|service_|find_/i.test(x))
      .slice(0, 8);
    rel.forEach((i) => console.log(" rel:", i.slice(0, 150)));
  }
}
run();
