"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const assetGuesses = [
  "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/RH12_normal.png",
  "https://www.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/RH12_normal.png",
  "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/HP2_normal.png",
  "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/W330_normal.png",
  "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/W330A_normal.png",
  "https://www.kumhotire.com/us/passenger/ecsta-ps71/",
  "https://www.kumhotire.com/us/passenger/solus-4s-ha32/",
  "https://www.yokohama.com.au/tyres/passenger-car/advan-sport-v105/",
  "https://www.yokohama.com.au/tyres/passenger-car/bluearth-es32/",
];

async function head(url) {
  try {
    const r = await fetch(url, { method: "GET", headers: { "User-Agent": UA }, redirect: "follow" });
    const ct = r.headers.get("content-type") || "";
    if (ct.includes("image")) {
      console.log("IMG", r.status, url.split("/").pop(), r.headers.get("content-length"));
      return;
    }
    const h = await r.text();
    console.log("HTML", r.status, url);
    const imgs = [...new Set(h.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /product|tire|tyre|ecsta|solus|crugen|winter|ecowing|advan|bluearth|geolandar|iceguard|kumho|yokohama|nblue|ev/i.test(x) && !/logo|icon|favicon|sns_|marshal|social|banner|dealer/i.test(x))
      .slice(0, 6);
    imgs.forEach((i) => console.log(" ", i.slice(0, 140)));
  } catch (e) {
    console.log("ERR", url, e.message);
  }
}

(async () => {
  for (const u of assetGuesses) await head(u);
  const r = await fetch("https://www.nexentire.com/international/product/passenger/nblue-ev.php", { headers: { "User-Agent": UA } });
  const h = await r.text();
  console.log("\n nblue-ev", r.status);
  const rel = [...new Set(h.match(/afieldfile[^"'\s]+\.(?:png|jpg|webp)/gi) || [])].slice(0, 10);
  rel.forEach((x) => console.log(" ", x));
})();
