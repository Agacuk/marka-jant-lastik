"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function ok(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const len = r.ok ? (await r.arrayBuffer()).byteLength : 0;
  console.log(r.status, len, url);
}

(async () => {
  for (const u of [
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/suv/RH12_normal.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/suv/HP2_normal.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/suv/RA33_normal.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/local/og-image/RH12_normal.jpg",
  ]) await ok(u);

  const gy = await fetch("https://news.goodyear.eu/goodyear-eagle-f1-asymmetric-6-wins-latest-summer-tire-tests/", { headers: { "User-Agent": UA } }).then((r) => r.text());
  [...new Set(gy.match(/https:\/\/news\.goodyear\.eu[^\"'\s]+\.(?:jpg|png|webp)/gi) || [])]
    .filter((x) => /asymmetric|f1|eagle|f1a/i.test(x))
    .slice(0, 10)
    .forEach((u) => console.log("GY", u));

  const op = await fetch("https://www.oponeo.co.uk/tyre-model/starmaxx-incurro-w870", { headers: { "User-Agent": UA } }).then((r) => r.text());
  console.log("\nOPONEO sample:", op.slice(0, 500));
  [...new Set(op.match(/\"(https?:[^\"]+\.(?:jpg|webp|png))\"/gi) || [])].slice(0, 10).forEach((x) => console.log(x));
  [...new Set(op.match(/\/images\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])].slice(0, 10).forEach((x) => console.log("rel", x));

  for (const u of [
    "https://www.tiremart.com/search.php?search_query=starmaxx+incurro+w870",
    "https://www.tiremart.com/search.php?search_query=starmaxx+polaris+w637",
  ]) {
    const html = await fetch(u, { headers: { "User-Agent": UA } }).then((r) => r.text());
    console.log("\nTM", u.split("=")[1]);
    [...new Set(html.match(/\/starmaxx[^\"'\s?]+/gi) || [])].filter((l) => /w870|w637|polaris|winter|snow/i.test(l)).slice(0, 8).forEach((l) => console.log(l));
  }
})();
