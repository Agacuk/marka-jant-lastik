"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function kumhoSearch(keyword) {
  const url = "https://www.kumhotire.com/en/tire/list.do?menuCd=MN000014&schKeyword=" + encodeURIComponent(keyword);
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const h = await r.text();
  const links = [...new Set(h.match(/view\.do\?[^"'\s]+seq=\d+/gi) || [])].slice(0, 5);
  console.log("\n kumho search:", keyword, links);
  if (links[0]) {
    const page = await fetch("https://www.kumhotire.com/en/tire/" + links[0], { headers: { "User-Agent": UA } });
    const ph = await page.text();
    const imgs = [...new Set(ph.match(/imgViewer\.do\?fileName=[^"'\s]+/gi) || [])];
    console.log(" imgs:", imgs.slice(0, 3));
  }
}

async function yokoSearch(path) {
  const r = await fetch("https://www.yokohamatire.com" + path, { headers: { "User-Agent": UA } });
  const h = await r.text();
  console.log("\n yoko", path, r.status);
  const imgs = [...new Set(h.match(/https:\/\/[^"'\s]+\.(?:webp|jpg|png)/gi) || [])]
    .filter((x) => /ytc-bm|yokohama-prod|advan|bluearth|geolandar|iceguard|v105|v552|es32|g055|ig70/i.test(x) && !/logo|icon|favicon|CONS_0810/i.test(x))
    .slice(0, 10);
  imgs.forEach((i) => console.log(" ", i));
}

(async () => {
  for (const k of ["PS71", "Solus 4S", "WinterCraft", "Crugen", "Ecowing"]) await kumhoSearch(k);
  for (const p of ["/advan-sport-v105", "/advan-db-v552", "/bluearth-es32", "/geolandar-g055", "/iceguard-ig70", "/advan-tires/advan-sport-v105"]) await yokoSearch(p);
})();
