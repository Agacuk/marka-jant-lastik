"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const kumhoPages = [
  ["ecsta-ps71", "https://www.kumhotire.com/en/tire/view.do?menuCd=MN000014&seq=831"],
  ["solus-4s", "https://www.kumhotire.com/en/tire/view.do?menuCd=MN000014&seq=832"],
  ["wintercraft", "https://www.kumhotire.com/en/tire/view.do?menuCd=MN000017&seq=1"],
  ["crugen", "https://www.kumhotire.com/en/tire/view.do?menuCd=MN000015&seq=1"],
  ["ecowing", "https://www.kumhotire.com/en/tire/view.do?menuCd=MN000014&seq=1"],
];

async function fetchPage(name, url) {
  const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  const h = await r.text();
  console.log("\n", name, r.status, r.url);
  const imgs = [...new Set(h.match(/imgViewer\.do\?fileName=[^"'\s]+/gi) || [])];
  imgs.slice(0, 5).forEach((i) => console.log(" ", i));
  const prod = [...new Set(h.match(/\/resources\/[^"'\s]+\.(?:jpg|png|webp)/gi) || [])]
    .filter((x) => /product|tire|pattern|ecsta|solus|crugen|winter|ecowing|de_images|eng_images/i.test(x) && !/sns_|marshal|language|search_size|arrow|close|quick_bg/i.test(x))
    .slice(0, 8);
  prod.forEach((p) => console.log(" res:", p));
}

(async () => {
  for (const [n, u] of kumhoPages) await fetchPage(n, u);

  // Yokohama US tire finder API or product pages
  const yoko = [
    "https://www.yokohamatire.com/our-range/tyres?cat=ADVAN%20Tyres",
    "https://www.yokohamatire.com/bluearth-tires",
  ];
  for (const u of yoko) {
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    const h = await r.text();
    console.log("\n yoko", r.status, u);
    const imgs = [...new Set(h.match(/https?:\/\/[^"'\s]+\.(?:jpg|png|webp)/gi) || [])]
      .filter((x) => /product|tire|tyre|advan|bluearth|geolandar|iceguard|uploads|media/i.test(x) && !/logo|icon|favicon|banner|footer|stewardship|tbone/i.test(x))
      .slice(0, 8);
    imgs.forEach((i) => console.log(" ", i.slice(0, 150)));
  }
})();
