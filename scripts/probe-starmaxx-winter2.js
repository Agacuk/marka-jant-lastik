"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

(async () => {
  const html = await fetch("https://orenburg.4kolesa.co/tyres/starmaxx/sw870/205-55-r16-91h/", { headers: { "User-Agent": UA } }).then((r) => r.text());
  [...new Set(html.match(/https?:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])]
    .filter((x) => /4kolesa|tyre|tire|starmaxx|w870|catalog|product|upload/i.test(x) && !/logo|yandex|icon/i.test(x))
    .forEach((u) => console.log(u));
  [...new Set(html.match(/\/upload\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])].forEach((u) => console.log("UP", u));

  for (const q of ["starmaxx polaris", "starmaxx w637", "starmaxx ice", "starmaxx snow"]) {
    const s = await fetch("https://www.tiremart.com/search.php?search_query=" + encodeURIComponent(q), { headers: { "User-Agent": UA } }).then((r) => r.text());
    const links = [...new Set(s.match(/\/starmaxx[^\"'\s?]+tire[^\"'\s?]*/gi) || [])].slice(0, 4);
    console.log("\nQ", q, links);
    for (const l of links) {
      const slug = l.replace(/^\//, "").replace(/\/$/, "");
      const page = await fetch("https://www.tiremart.com/" + slug, { headers: { "User-Agent": UA } }).then((r) => r.text());
      const m = page.match(/https:\/\/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
      if (m) console.log(" IMG", slug, m[0].replace(/&amp;/g, "&"));
    }
  }
})();
