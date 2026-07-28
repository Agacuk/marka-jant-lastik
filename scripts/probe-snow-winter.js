"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function search(q) {
  const html = await fetch("https://www.tiremart.com/search.php?search_query=" + encodeURIComponent(q), { headers: { "User-Agent": UA } }).then((r) => r.text());
  return [...new Set(html.match(/\/(?:starmaxx|petlas)[^\"'\s?]+/gi) || [])].slice(0, 12);
}

async function img(slug) {
  const html = await fetch("https://www.tiremart.com/" + slug.replace(/^\//, ""), { headers: { "User-Agent": UA } }).then((r) => r.text());
  const m = html.match(/https:\/\/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
  return m ? m[0].replace(/&amp;/g, "&") : null;
}

(async () => {
  for (const q of ["starmaxx winter", "starmaxx sm-f20", "starmaxx w870", "starmaxx incurro winter", "petlas snow master 2", "petlas snowmaster", "lassa snoways"]) {
    const links = await search(q);
    console.log("\nQ:", q);
    for (const l of links.slice(0, 4)) {
      if (l.endsWith("-tires") || l.endsWith("-tires/")) continue;
      const slug = l.replace(/^\//, "").replace(/\/$/, "");
      if (!slug.includes("tire")) continue;
      const u = await img(slug);
      console.log(slug, u ? "OK" : "no img", u || "");
    }
  }
})();
