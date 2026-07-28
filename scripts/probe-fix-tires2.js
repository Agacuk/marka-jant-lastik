"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function ok(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const len = r.ok ? (await r.arrayBuffer()).byteLength : 0;
  console.log(r.status, len, url.split("/").slice(-2).join("/"));
}

(async () => {
  for (const u of [
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/K127_normal.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/K127A_normal.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/H750_normal.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/RH12_normal.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/W330_normal.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/local/og-image/K127_normal.jpg",
    "https://asset.hankooktire.com/content/dam/hankooktire/local/og-image/H750_normal.jpg",
  ]) await ok(u);

  for (const u of [
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/f1asym6/f1asym6-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/f1asym5/f1asym5-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/f1asym6/f1asym6-front.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/f1asym5/f1asym5-front.jpg",
    "https://www.goodyear.eu/content/dam/goodyear/consumer/common/why-goodyear/eagle-f1-asymmetric-5/goodyear-f1-as5-product-front.jpg.transform/product-front/image.jpg",
  ]) await ok(u);

  // Starmaxx winter sources
  for (const q of ["starmaxx w870", "starmaxx incurro w870", "starmaxx winter tire"]) {
    const html = await fetch("https://www.tiremart.com/search.php?search_query=" + encodeURIComponent(q), { headers: { "User-Agent": UA } }).then((r) => r.text());
    console.log("\nQ", q);
    [...new Set(html.match(/\/starmaxx[^\"'\s?]+/gi) || [])].filter((l) => /w870|winter|incurro/i.test(l)).slice(0, 6).forEach((l) => console.log(l));
  }

  // Oponeo image scrape
  const op = await fetch("https://www.oponeo.co.uk/tyre-model/starmaxx-incurro-w870", { headers: { "User-Agent": UA } }).then((r) => r.text());
  const imgs = [...new Set(op.match(/https:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])];
  console.log("\nOPONEO imgs", imgs.length);
  imgs.slice(0, 15).forEach((i) => console.log(i));

  // simpletire pattern tests
  for (const u of [
    "https://images.simpletire.com/images/mm/starmaxx-incurro-w870-sidetread.jpg",
    "https://images.simpletire.com/images/ml/starmaxx-incurro-w870-sidetread.jpg",
    "https://images.simpletire.com/images/l/starmaxx-incurro-w870-sidetread.jpg",
    "https://images.simpletire.com/image/upload/starmaxx-incurro-w870-sidetread.jpg",
  ]) await ok(u);
})();
