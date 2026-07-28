"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function probe(name, url, opts = {}) {
  const headers = {
    "User-Agent": UA,
    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
    Accept: "text/html,application/xhtml+xml",
  };
  if (opts.referer) headers.Referer = opts.referer;
  const r = await fetch(url, { headers, redirect: "follow" });
  const h = await r.text();
  console.log("\n===", name, r.status, url);
  const abs = [...new Set(h.match(/https?:\/\/[^"'\s<>\\]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
    .filter((x) => !/logo|icon|favicon|banner|social|sprite|navigation|footer|dealer|language|category|og-image|apple-touch|flag|curve-dots|find-dealer|reg-tire|promotion|owners-circle|about-us|tires-101|trial|youtube|ytimg/i.test(x));
  abs.slice(0, 15).forEach((i) => console.log(" ", i.slice(0, 180)));
  const rel = [...new Set(h.match(/\/(?:upload|media|assets|content|images|lastik|desen|product|cdn|static|sys-master)[^"'\s<>\\]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
    .filter((x) => !/logo|icon|flag|header|footer/i.test(x));
  rel.slice(0, 12).forEach((i) => console.log(" rel:", i.slice(0, 180)));
  const seq = h.match(/view\.do\?seq=(\d+)/g);
  if (seq) console.log(" seq:", [...new Set(seq)].slice(0, 8).join(", "));
  const imgViewer = h.match(/imgViewer\.do\?fileName=[^"'\s]+/g);
  if (imgViewer) console.log(" imgViewer:", [...new Set(imgViewer)].slice(0, 5).join("\n  "));
  return h;
}

async function kumhoSearch(keyword) {
  const url = "https://www.kumhotire.com/en/tire/list.do?menuCd=MN000014&keyword=" + encodeURIComponent(keyword);
  const h = await probe("kumho-search-" + keyword, url);
  const links = [...new Set(h.match(/view\.do\?seq=\d+/g) || [])];
  console.log(" links:", links.slice(0, 5));
  return links;
}

(async () => {
  // Lassa - try alternate slugs
  for (const u of [
    "https://www.lassa.com.tr/desen/r01-01-driveways-sport",
    "https://www.lassa.com.tr/desen/r01-03-competus-at2",
    "https://www.lassa.com.tr/desen/r01-04-snoways4",
    "https://www.lassa.com.tr/desen/r01-02-revola",
  ]) await probe("lassa", u);

  // Petlas / Starmaxx - try .com/en and international
  for (const u of [
    "https://www.petlas.com/en/products/velox-sport",
    "https://www.petlas.com/en/products/explero-h-p",
    "https://www.petlas.com/en/products/imperium-pt535",
    "https://www.petlas.com/en/products/snowmaster-w651",
    "https://www.starmaxx.com/en/products/starmaxx-x1",
    "https://www.starmaxx.com/en/products/starmaxx-winter-ultra",
    "https://www.starmaxx.com/en/products/starmaxx-sport-power",
    "https://www.starmaxx.com/en/products/starmaxx-eco",
  ]) await probe("petlas/starmaxx", u);

  // Kumho product pages
  for (const u of [
    "https://www.kumhotire.com/en/tire/view.do?seq=831",
    "https://www.kumhotire.com/en/tire/view.do?seq=832",
    "https://www.kumhotire.com/en/tire/view.do?seq=833",
    "https://www.kumhotire.com/en/tire/view.do?seq=834",
    "https://www.kumhotire.com/en/tire/view.do?seq=835",
  ]) await probe("kumho-seq", u);

  await kumhoSearch("PS71");
  await kumhoSearch("Solus");
  await kumhoSearch("WinterCraft");
  await kumhoSearch("Crugen");
  await kumhoSearch("Ecowing");

  // Yokohama US
  for (const u of [
    "https://www.yokohamatire.com/tires/advan-sport-v105",
    "https://www.yokohamatire.com/tires/advan-db-v552",
    "https://www.yokohamatire.com/tires/blu-earth-es32",
    "https://www.yokohamatire.com/tires/geolandar-g058",
    "https://www.yokohamatire.com/tires/iceguard-ig53",
  ]) await probe("yokohama", u);

  // Goodyear UltraGrip
  for (const u of [
    "https://www.goodyear.eu/en_gb/consumer/learn/discover-our-tyres/goodyear-ultragrip-performance-3.html",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultragripp3/ultragripp3-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultragrippf3/ultragrippf3-front.jpg.transform/product-front/image.jpg",
  ]) await probe("goodyear-ug", u);

  // BFG
  for (const u of [
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-pilot-sport",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-advantage-touring",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2",
    "https://www.bfgoodrich.com/auto/tires/bfgoodrich-g-force-pilot-sport/",
  ]) await probe("bfg", u);

  // Nexen EV
  await probe("nexen-ev", "https://www.nexentire.com/international/product/passenger/n-blue-ev/");
})();
