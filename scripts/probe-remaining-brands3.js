"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "tr,en" } });
  return { status: r.status, html: await r.text(), url: r.url };
}

async function head(url) {
  const r = await fetch(url, { method: "HEAD", headers: { "User-Agent": UA } });
  return r.status;
}

(async () => {
  // Kumho - parse list for all tires with 30_DEGREE images
  const list = await get("https://www.kumhotire.com/en/tire/list.do?menuCd=MN000014");
  const re = /href="([^"]*view\.do\?seq=(\d+)[^"]*)"[^>]*>[\s\S]*?alt="([^"]+)"[\s\S]*?src="(\/upload\/product\/[^"]+30_DEGREE[^"]+)"/gi;
  let m;
  const found = [];
  while ((m = re.exec(list.html))) {
    found.push({ seq: m[2], name: m[3], img: m[4] });
  }
  console.log("Kumho 30_DEGREE products:", found.length);
  found.slice(0, 30).forEach((x) => console.log(x.seq, x.name, x.img));

  // Also grep product names in catalog
  const names = ["PS71", "Solus", "Winter", "Crugen", "Ecowing", "HA32", "WS71", "HP71", "TA31"];
  for (const n of names) {
    const idx = list.html.indexOf(n);
    if (idx > -1) {
      const chunk = list.html.slice(Math.max(0, idx - 200), idx + 400);
      const img = (chunk.match(/\/upload\/product\/[^"']+\.(?:png|jpg)/i) || [])[0];
      const seq = (chunk.match(/seq=(\d+)/) || [])[1];
      console.log("match", n, "seq=" + seq, img);
    }
  }

  // Lassa - try lastik.com.tr search / azure larger images
  const lassaUrls = [
    "http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/800x800/R01_1-1704802724631.jpg",
    "http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/R01_1-1704802724631.jpg",
  ];
  for (const u of lassaUrls) console.log("lassa img", u, await head(u));

  // Lassa product listing
  const lassaList = await get("https://www.lassa.com.tr/desenler");
  const lassaImgs = [...new Set(lassaList.html.match(/medias89k[^"'\s]+\.(?:jpg|webp|png)/gi) || [])];
  console.log("\nLassa desenler imgs:", lassaImgs.slice(0, 20));

  // Petlas CDN guesses
  const petlasGuesses = [
    "https://www.petlas.com.tr/Content/images/products/velox-sport.png",
    "https://www.petlas.com.tr/Content/img/products/velox-sport.png",
    "https://cdn.petlas.com.tr/products/velox-sport.png",
    "https://www.petlas.com.tr/images/urunler/velox-sport.png",
    "https://www.starmaxx.com.tr/Content/images/products/starmaxx-x1.png",
    "https://www.starmaxx.com.tr/images/urunler/starmaxx-x1.png",
  ];
  for (const u of petlasGuesses) console.log("petlas guess", u, await head(u));

  // Yokohama EU
  const yokoEu = [
    "https://www.yokohama.eu/tyres/passenger-car/advan-sport-v105",
    "https://www.yokohama.eu/tyres/passenger-car/advan-db-v552",
    "https://www.yokohama.eu/tyres/passenger-car/blu-earth-es32",
    "https://www.yokohama.eu/tyres/suv-4x4/geolandar-g058",
  ];
  for (const u of yokoEu) {
    const r = await get(u);
    console.log("\nYokoEU", r.status, u);
    const imgs = [...new Set(r.html.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|png)/gi) || [])]
      .filter((x) => /yokohama|ytc|s3|product|tire|advan|geolandar|blu/i.test(x) && !/logo|icon|favicon/i.test(x));
    imgs.slice(0, 8).forEach((i) => console.log(" ", i.slice(0, 160)));
  }

  // Goodyear ultragrip - search design pages
  const gy = [
    "https://www.goodyear.eu/en_gb/consumer/tyres/goodyear-ultragrip-performance-3.html",
    "https://www.goodyear.eu/en_gb/consumer/tyres/goodyear-ultragrip-performance.html",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultrgripp3/ultrgripp3-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultrgripp/ultrgripp-front.jpg.transform/product-front/image.jpg",
  ];
  for (const u of gy) {
    console.log("\nGY", u, await head(u));
    if ((await head(u)) === 200 || u.endsWith(".jpg")) {
      const r = await get(u);
      const imgs = r.html.match(/content\/dam[^"'\s]+\.(?:jpg|webp)/gi);
      if (imgs) imgs.slice(0, 5).forEach((i) => console.log(" ", i));
    }
  }

  // BFG via Michelin CDN pattern search on working KO2 page
  const bfgPages = [
    "https://www.bfgoodrich.com/auto/tires/bfgoodrich-advantage-touring/",
    "https://www.bfgoodrich.com/auto/tires/bfgoodrich-g-force-winter-2/",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2-suv",
    "https://www.bfgoodrich.fr/auto/pneus/bfgoodrich-g-force-pilot-sport",
  ];
  for (const u of bfgPages) {
    const r = await get(u);
    console.log("\nBFG", r.status, u);
    const michelin = r.html.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s]+/gi);
    if (michelin) [...new Set(michelin)].slice(0, 3).forEach((x) => console.log(" ", x.slice(0, 180)));
  }

  // Nexen nblue ev - try direct product image paths
  const nexen = [
    "https://www.nexentire.com/international/product/passenger/__icsFiles/afieldfile/2023/03/15/product.png",
    "https://www.nexentire.com/international/product/passenger/__icsFiles/afieldfile/2023/06/20/product.png",
    "https://www.nexentire.com/international/product/ev/__icsFiles/afieldfile/2023/03/15/product.png",
  ];
  for (const u of nexen) console.log("nexen", u, await head(u));
})();
