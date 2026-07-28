"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function imgs(url, filter) {
  const html = await fetch(url, { headers: { "User-Agent": UA } }).then((r) => r.text());
  console.log("\n", url, html.length);
  return [...new Set(html.match(/https?:\/\/[^\"'\s]+\.(?:jpg|jpeg|png|webp)/gi) || [])]
    .filter((x) => !filter || filter(x))
    .slice(0, 12);
}

(async () => {
  const gy = await imgs("https://news.goodyear.eu/goodyear-eagle-f1-asymmetric-6-wins-latest-summer-tire-tests/", (x) => /goodyear|asymmetric|f1|eagle|image|media|upload|content/i.test(x) && !/logo|icon|banner|social/i.test(x));
  gy.forEach((u) => console.log("GY", u));

  for (const u of [
    "https://www.reifendirekt.de/Reifen/Starmaxx-Incurro-W870.html",
    "https://www.123tyres.co.uk/brands/starmaxx/incurro-w870",
    "https://www.blackcircles.com/tyres/brands/starmaxx/incurro-w870",
    "https://www.tyre-shopper.co.uk/starmaxx-incurro-w870",
    "https://www.mytyres.co.uk/Starmaxx/Incurro-W870/205-55-R16-91H.htm",
  ]) {
    try {
      (await imgs(u, (x) => /starmaxx|w870|incurro|tyre|tire|product|reifen|cdn|image|media/i.test(x) && !/logo|icon|banner|payment|flag|star/i.test(x))).forEach((i) => console.log(i));
    } catch (e) {
      console.log("ERR", u, e.message);
    }
  }

  // Goodyear tiremart
  const tm = await fetch("https://www.tiremart.com/search.php?search_query=goodyear+eagle+f1+asymmetric", { headers: { "User-Agent": UA } }).then((r) => r.text());
  const links = [...new Set(tm.match(/\/goodyear[^\"'\s?]+tire[^\"'\s?]*/gi) || [])].slice(0, 5);
  console.log("\nTM goodyear", links);
  for (const l of links.slice(0, 2)) {
    const slug = l.replace(/^\//, "").replace(/\/$/, "");
    const page = await fetch("https://www.tiremart.com/" + slug, { headers: { "User-Agent": UA } }).then((r) => r.text());
    const m = page.match(/https:\/\/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
    if (m) console.log(slug, m[0].replace(/&amp;/g, "&"));
  }
})();
