"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function searchImg(q) {
  const html = await fetch("https://www.tiremart.com/search.php?search_query=" + encodeURIComponent(q), { headers: { "User-Agent": UA } }).then((r) => r.text());
  const links = [...new Set(html.match(/\/starmaxx[^\"'\s?]+tire[^\"'\s?]*/gi) || [])];
  for (const l of links.slice(0, 5)) {
    const slug = l.replace(/^\//, "").replace(/\/$/, "");
    const page = await fetch("https://www.tiremart.com/" + slug, { headers: { "User-Agent": UA } }).then((r) => r.text());
    const m = page.match(/https:\/\/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
    if (m) return { slug, url: m[0].replace(/&amp;/g, "&") };
  }
  return null;
}

(async () => {
  for (const q of ["sm-f20", "starmaxx sm f20", "starmaxx winter", "incurro w870", "starmaxx w870"]) {
    const r = await searchImg(q);
    console.log(q, r);
  }

  const pages = [
    "https://orenburg.4kolesa.co/tyres/starmaxx/snaturen-st542/185-60-r14-82h/",
    "https://orenburg.4kolesa.co/tyres/starmaxx/sw870/205-55-r16-91h/",
    "https://jaunasriepas.lv/en/lassa-snoways-4/",
    "https://jaunasriepas.lv/en/lassa-competus-at2/",
  ];
  for (const u of pages) {
    const html = await fetch(u, { headers: { "User-Agent": UA } }).then((r) => r.text());
    console.log("\n", u, html.length);
    [...new Set(html.match(/https?:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])]
      .filter((x) => !/logo|icon|banner|sprite|payment|social/i.test(x))
      .slice(0, 8)
      .forEach((i) => console.log(i));
  }
})();
