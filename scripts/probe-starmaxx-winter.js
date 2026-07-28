"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

(async () => {
  for (const q of ["incurro winter", "starmaxx ice", "starmaxx snow", "w870 winter", "ultraforce winter"]) {
    const html = await fetch("https://www.tiremart.com/search.php?search_query=" + encodeURIComponent(q), { headers: { "User-Agent": UA } }).then((r) => r.text());
    const links = [...new Set(html.match(/\/starmaxx[^\"'\s?]+/gi) || [])].filter((l) => /tire|w870|winter|ice|snow|incurro/i.test(l)).slice(0, 8);
    console.log("\nQ:", q, links);
    for (const l of links) {
      const slug = l.replace(/^\//, "").replace(/\/$/, "");
      if (!slug.includes("tire") && !slug.endsWith("-tires/")) continue;
      const page = await fetch("https://www.tiremart.com/" + slug, { headers: { "User-Agent": UA } }).then((r) => r.text());
      const m = page.match(/https:\/\/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
      if (m) console.log(" ", slug, m[0].replace(/&amp;/g, "&").slice(0, 120));
    }
  }

  // Try cloudinary/simpletire patterns from existing x1 file - fetch common paths
  const guesses = [
    "https://images.simpletire.com/images/rr/starmaxx-incurro-winter-w870-sidetread.webp",
    "https://images.simpletire.com/images/rr/starmaxx-incurro-w870-sidetread.jpg",
    "https://images.simpletire.com/images/mm/starmaxx-incurro-w870-sidetread.jpg",
    "https://images.simpletire.com/images/rr/starmaxx-maxx-out-st582-sidetread.webp",
  ];
  for (const u of guesses) {
    const r = await fetch(u, { method: "HEAD", headers: { "User-Agent": UA } }).catch(() => null);
    console.log(u, r && r.status, r && r.headers.get("content-length"));
  }
})();
