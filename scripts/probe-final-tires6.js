"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function tmImg(slug) {
  const html = await fetch("https://www.tiremart.com/" + slug, { headers: { "User-Agent": UA } }).then((r) => r.text());
  const m = html.match(/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
  return m ? m[0].replace(/&amp;/g, "&") : null;
}

(async () => {
  for (const slug of [
    "starmaxx-naturen-st542-195-55r16-87h-tire",
    "petlas-snow-master-2-195-60r15-88h-winter-tire",
  ]) console.log(slug, await tmImg(slug));

  const s = await fetch("https://www.tiremart.com/search.php?search_query=incurro+winter+w870", { headers: { "User-Agent": UA } }).then((r) => r.text());
  const links = [...new Set(s.match(/\/starmaxx[^\"'\s?]+tire[^\"'\s?]*/gi) || [])];
  console.log("\nW870 links:", links.slice(0, 10));
  for (const l of links.slice(0, 3)) {
    const slug = l.replace(/^\//, "");
    console.log(slug, await tmImg(slug));
  }

  for (const u of [
    "https://admin.lassa.com/Uploads/ERP/a44_1-1770808840768jpg_1.jpg",
    "https://admin.lassa.com/Uploads/ERP/a44_1-1649068054898jpg_8.jpg",
    "https://admin.lassa.com/Uploads/ERP/a44_2-1770808840768jpg.jpg",
  ]) {
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    console.log(u.split("/").pop(), r.status, r.ok ? (await r.arrayBuffer()).byteLength : 0);
  }

  const op = await fetch("https://www.oponeo.co.uk/tyre-model/lassa-competus-at2", { headers: { "User-Agent": UA } }).then((r) => r.text());
  const og = op.match(/property=\"og:image\" content=\"([^\"]+)\"/i);
  console.log("\nOPONEO competus og:", og && og[1]);
  const op2 = await fetch("https://www.oponeo.co.uk/tyre-model/lassa-snoways-4", { headers: { "User-Agent": UA } }).then((r) => r.text());
  const og2 = op2.match(/property=\"og:image\" content=\"([^\"]+)\"/i);
  console.log("OPONEO snoways og:", og2 && og2[1]);
})();
