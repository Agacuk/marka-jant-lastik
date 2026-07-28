"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

(async () => {
  const html = await fetch("https://orenburg.4kolesa.co/tyres/starmaxx/sw870/205-55-r16-91h/", { headers: { "User-Agent": UA } }).then((r) => r.text());
  console.log("orenburg w870 imgs:");
  [...new Set(html.match(/<img[^>]+src=\"([^\"]+)\"/gi) || [])].slice(0, 15).forEach((i) => console.log(i));

  const html2 = await fetch("https://jaunasriepas.lv/en/lassa-snoways-4/", { headers: { "User-Agent": UA } }).then((r) => r.text());
  const product = html2.match(/class=\"product[^\"]*\"[^>]*>[\s\S]{0,2000}?<img[^>]+src=\"([^\"]+)\"/i);
  console.log("\njauna product img:", product && product[1]);
  [...new Set(html2.match(/cache\/images\/[^\"']+\.(?:jpg|png)/gi) || [])].slice(0, 5).forEach((i) => console.log(i));

  for (const u of [
    "https://jaunasriepas.lv/cache/images/051d6dd6931ee83f38781f784eb327d5.jpg",
    "https://jaunasriepas.lv/cache/images/73fd501b201b65e48fa752c3212626cb.jpg",
  ]) {
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    console.log(u.split("/").pop(), r.status, r.ok ? (await r.arrayBuffer()).byteLength : 0);
  }
})();
