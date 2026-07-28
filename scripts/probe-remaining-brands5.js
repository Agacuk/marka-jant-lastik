"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0";

async function get(url) {
  const r = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
  });
  return { status: r.status, html: await r.text(), final: r.url };
}

function decode(s) {
  return s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\\\//g, "/");
}

function michelinImgs(html) {
  const d = decode(html);
  return [...new Set(d.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s]+tire_bfgoodrich[^"'\s]+_main_[^"'\s]+\.webp/gi) || [])]
    .map((u) => u.split("?")[0]);
}

(async () => {
  // Kumho - map list page product names to images
  const list = await get("https://www.kumhotire.com/en/tire/list.do?menuCd=MN000014");
  const blocks = list.html.split(/class="img-box"/);
  blocks.slice(1).forEach((b) => {
    const name = ((b.match(/alt="([^"]+)"/) || [])[1] || "").trim();
    const img = (b.match(/src="(\/upload\/product\/[^"]+)"/) || [])[1];
    const seq = (b.match(/seq=(\d+)/) || [])[1];
    if (name && img && /30_DEGREE|th_/.test(img)) console.log(seq, name, img);
  });

  // Yokohama - fetch product pages with full browser headers
  const yPages = [
    ["advan-sport-v105", "https://www.yokohamatire.com/tires/advan-sport-v105"],
    ["advan-db-v552", "https://www.yokohamatire.com/tires/advan-db-v552-2"],
    ["blu-earth", "https://www.yokohamatire.com/tires/blu-earth-es32-2"],
    ["geolandar", "https://www.yokohamatire.com/tires/geolandar-g058-2"],
    ["iceguard", "https://www.yokohamatire.com/tires/iceguard-ig53"],
    ["advan-v107", "https://www.yokohamatire.com/tires/advan-sport-v107"],
  ];
  for (const [id, url] of yPages) {
    const r = await get(url);
    console.log("\nYOKO", id, r.status, r.final);
    const imgs = [...new Set(r.html.match(/https:\/\/ytc-bm\.s3\.us-east-2\.amazonaws\.com\/[^"'\s]+/gi) || [])]
      .filter((x) => /WEB-|3QL|WHT|Hero|Image|Sport|Earth|Geolandar|iceGUARD|ADVAN/i.test(x) && !/Trial|About|Owners|Tires-101|Promotions|Robin|Challenger|News|Lee|Intro_2020|Size-Specs|Warranty|NEOVA|parada|Tornante|avid\.webp/i.test(x));
    imgs.forEach((i) => console.log(" ", i));
  }

  // Goodyear ultragrip pages
  const gyPages = [
    "https://www.goodyear.eu/en_gb/consumer/tyres/goodyear-ultragrip-performance-3.html",
    "https://www.goodyear.eu/en_gb/consumer/tyres/goodyear-ultragrip-performance.html",
    "https://www.goodyear.eu/en_gb/consumer/why-goodyear/goodyear-ultragrip-performance-3-2025.html",
    "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/ultragrip-performance-3.html",
    "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/ultragrip-performance.html",
  ];
  for (const u of gyPages) {
    const r = await get(u);
    console.log("\nGY", r.status, u.split("/").pop());
    const imgs = r.html.match(/content\/dam[^"'\s]+(?:ultr|winter|grip)[^"'\s]+\.(?:jpg|webp)/gi) ||
      r.html.match(/content\/dam\/common\/tires[^"'\s]+\.(?:jpg|webp)/gi);
    if (imgs) [...new Set(imgs)].slice(0, 6).forEach((i) => console.log(" ", i));
    const direct = r.html.match(/[^"'\s]*ultr[^"'\s]*front\.jpg[^"'\s]*/gi);
    if (direct) direct.slice(0, 3).forEach((i) => console.log(" d:", i));
  }

  // BFG pages - EU/FR
  const bfgPages = [
    "https://www.bfgoodrich.eu/en-gb/auto/tyres/bfgoodrich-g-force-pilot-sport",
    "https://www.bfgoodrich.eu/en-gb/auto/tyres/bfgoodrich-advantage-touring",
    "https://www.bfgoodrich.eu/en-gb/auto/tyres/bfgoodrich-g-force-winter-2",
    "https://www.bfgoodrich.fr/auto/pneus/bfgoodrich-g-force-pilot-sport",
    "https://www.bfgoodrich.fr/auto/pneus/bfgoodrich-advantage-touring",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2-suv",
  ];
  for (const u of bfgPages) {
    const r = await get(u);
    console.log("\nBFG", r.status, u);
    const imgs = michelinImgs(r.html);
    if (imgs.length) imgs.forEach((i) => console.log(" ", i.slice(0, 200)));
  }

  // Nexen EV - list all passenger products
  const nexen = await get("https://www.nexentire.com/international/product/passenger/");
  const evLinks = nexen.html.match(/href="([^"]*n-blue[^"]*)"/gi) || [];
  console.log("\nNexen EV links:", evLinks.slice(0, 10));
  const productImgs = nexen.html.match(/__icsFiles\/afieldfile[^"'\s]+\.(?:png|jpg)/gi) || [];
  console.log("Nexen imgs:", [...new Set(productImgs)].slice(0, 15));

  // Petlas via lastik.com.tr
  for (const q of ["petlas velox sport", "petlas explero", "starmaxx x1"]) {
    const r = await get("https://www.lastik.com.tr/arama?q=" + encodeURIComponent(q));
    console.log("\nlastik.com.tr", q, r.status);
    const imgs = r.html.match(/medias89k[^"'\s]+\.(?:jpg|webp|png)/gi) || r.html.match(/cdn[^"'\s]+petlas[^"'\s]+\.(?:jpg|webp)/gi);
    if (imgs) [...new Set(imgs)].slice(0, 5).forEach((i) => console.log(" ", i));
  }

  // Lassa via lastik.com.tr
  for (const q of ["lassa driveways", "lassa competus", "lassa snoways"]) {
    const r = await get("https://www.lastik.com.tr/arama?q=" + encodeURIComponent(q));
    console.log("\nlastik lassa", q, r.status);
    const imgs = r.html.match(/medias89k[^"'\s]+\.(?:jpg|webp|png)/gi);
    if (imgs) [...new Set(imgs)].slice(0, 8).forEach((i) => console.log(" ", i));
  }
})();
