"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0";

async function get(url) {
  const r = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "tr-TR,tr;q=0.9" },
    redirect: "follow",
  });
  return { status: r.status, html: await r.text(), final: r.url };
}

async function head(url) {
  const r = await fetch(url, { method: "GET", headers: { "User-Agent": UA, Referer: "https://www.yokohamatire.com/" } });
  return { status: r.status, type: r.headers.get("content-type"), len: (await r.arrayBuffer()).byteLength };
}

(async () => {
  // Yokohama EU
  for (const u of [
    "https://www.yokohama.eu/eu/tyres/passenger-car/advan-sport-v105",
    "https://www.yokohama.eu/eu/tyres/passenger-car/advan-db-v552",
    "https://www.yokohama.eu/eu/tyres/passenger-car/blu-earth-es32",
    "https://www.yokohama.eu/eu/tyres/suv-4x4/geolandar-g058",
    "https://www.yokohama.eu/eu/tyres/passenger-car/advan-sport-v107",
  ]) {
    const r = await get(u);
    console.log("\nYokoEU", r.status, u.split("/").pop());
    const imgs = [...new Set(r.html.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|png)/gi) || [])]
      .filter((x) => !/logo|icon|favicon|flag|social|curve|dealer|reg-tire|footer|header/i.test(x));
    imgs.slice(0, 10).forEach((i) => console.log(" ", i.slice(0, 170)));
  }

  // Yokohama S3 with referer GET
  const s3 = [
    "https://ytc-bm.s3.us-east-2.amazonaws.com/Geolandar-White.png",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/iceGUARD-iG53-3QL-Web.webp",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/RS2300_1008_YTC_CONS_0810_YTC_CONS_ADVAN-0K.webp",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/2205_YTC_CONS_ADVAN-Sport-V107-Image_3QL-Web.webp",
  ];
  for (const u of s3) {
    const r = await head(u);
    console.log("S3", r.status, r.len, u.split("/").pop());
  }

  // Goodyear ultragrip full URLs
  for (const u of [
    "https://www.goodyear.eu/content/dam/goodyear/consumer/common/why-goodyear/ultragrip-performance-3/goodyear-ultragrip-performance-3-tyre.jpg",
    "https://www.goodyear.eu/content/dam/goodyear/consumer/common/why-goodyear/ultragrip-performance-3/goodyear-ultragrip-performance-3-side-full.jpg",
    "https://www.goodyear.co.uk/content/dam/goodyear/consumer/common/why-goodyear/ultragrip-performance-3/goodyear-ultragrip-performance-3-tyre.jpg",
  ]) {
    const r = await head(u);
    console.log("GY img", r.status, r.len, u.split("/").pop());
  }

  // Kumho verify mapping via view pages
  const kumho = [
    [831, "ecsta-ps71"],
    ["HA32", "solus-4s"],
    ["WP71", "wintercraft"],
    ["HP71", "crugen"],
    ["ES31", "ecowing"],
  ];
  for (const [key, label] of kumho) {
    if (typeof key === "number") {
      const r = await get("https://www.kumhotire.com/en/tire/view.do?seq=" + key);
      const title = (r.html.match(/<title>([^<]+)/) || [])[1];
      const img = (r.html.match(/\/upload\/product\/[^"']+30_DEGREE[^"']+/) || [])[0];
      console.log(label, title, img);
    } else {
      console.log(label, "direct", "/upload/product/" + key + "_30_DEGREE.png");
    }
  }

  // lastik.com.tr searches
  for (const q of [
    "lassa driveways", "lassa competus", "lassa snoways", "lassa revola",
    "petlas velox", "petlas explero", "petlas imperium", "petlas snowmaster",
    "starmaxx x1", "starmaxx winter", "starmaxx suv", "starmaxx eco",
  ]) {
    const r = await get("https://www.lastik.com.tr/arama?kelime=" + encodeURIComponent(q));
    console.log("\nlastik", q, r.status, r.final.slice(0, 80));
    const imgs = [...new Set(r.html.match(/https?:\/\/[^"'\s]*medias89k[^"'\s]+\.(?:jpg|webp|png)/gi) || [])];
    imgs.slice(0, 5).forEach((i) => console.log(" ", i.slice(0, 160)));
    const names = r.html.match(/Lassa [A-Za-z0-9]+|Petlas [A-Za-z0-9]+|Starmaxx [A-Za-z0-9]+/g);
    if (names) console.log(" names:", [...new Set(names)].slice(0, 6));
  }

  // BFG UK alternate slugs
  for (const u of [
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-advantage-touring-2",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-pilot-sport-2",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2-suv",
  ]) {
    const r = await get(u);
    console.log("\nBFG", r.status, u.split("/").pop());
    const m = r.html.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s]+tire_bfgoodrich[^"'\s]+/gi);
    if (m) [...new Set(m)].slice(0, 2).forEach((x) => console.log(" ", x.slice(0, 200)));
  }

  // Nexen nblue ev search
  const nexen = await get("https://www.nexentire.com/international/product/passenger/");
  const ev = nexen.html.match(/n[- ]?blue[- ]?ev[^"']*/gi);
  console.log("\nNexen EV mentions:", [...new Set(ev || [])].slice(0, 10));
  const imgs = nexen.html.match(/__icsFiles\/afieldfile\/[^"'\s]+product[^"'\s]*\.(?:png|jpg)/gi);
  console.log("product imgs:", [...new Set(imgs || [])].slice(0, 20));
})();
