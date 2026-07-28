"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function probe(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "tr,en" } });
  const h = await r.text();
  console.log("\n", r.status, url);
  const imgs = [...new Set(h.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|png|jpeg)/gi) || [])]
    .filter((x) => !/logo|icon|favicon|banner|social|sprite|navigation|footer|dealer|language|category|og-image|apple-touch/i.test(x))
    .slice(0, 12);
  imgs.forEach((i) => console.log(" ", i.slice(0, 160)));
  const rel = [...new Set(h.match(/\/(?:upload|media|assets|content|images|lastik|desen|product|cdn|static)[^"'\s]+\.(?:webp|jpg|png|jpeg)/gi) || [])]
    .slice(0, 12);
  rel.forEach((i) => console.log(" rel:", i.slice(0, 160)));
}

async function kumhoList() {
  const r = await fetch("https://www.kumhotire.com/en/tire/list.do?menuCd=MN000014", { headers: { "User-Agent": UA } });
  const h = await r.text();
  const blocks = h.split("img-box");
  blocks.slice(1, 15).forEach((b, i) => {
    const name = ((b.match(/alt="([^"]+)"/) || [])[1] || "?").slice(0, 40);
    const img = (b.match(/src="([^"]+\.(?:jpg|png|webp))"/i) || [])[1];
    const seq = (b.match(/seq=(\d+)/) || [])[1];
    console.log("kumho", i + 1, name, img, "seq=" + seq);
  });
}

(async () => {
  await kumhoList();
  const urls = [
    "https://www.lassa.com.tr/desen/r01-02-revola",
    "https://www.lassa.com.tr/desen/r01-01-driveways",
    "https://www.lassa.com.tr/desen/r01-03-competus-at-2",
    "https://www.lassa.com.tr/desen/r01-04-snoways-4",
    "https://www.petlas.com.tr/desen/velox-sport",
    "https://www.petlas.com.tr/desen/explero-h-p",
    "https://www.starmaxx.com.tr/desen/starmaxx-x1",
    "https://www.yokohamatire.com/tires/advan-sport-v107",
    "https://www.goodyear.eu/en_gb/consumer/why-goodyear/goodyear-ultragrip-performance-3-2025.html",
  ];
  for (const u of urls) await probe(u);
})();
