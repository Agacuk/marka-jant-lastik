"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function imgFromPage(url) {
  const html = await fetch(url, { headers: { "User-Agent": UA } }).then((r) => r.text());
  return [...new Set(html.match(/https?:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])]
    .filter((x) => /cdn11|bigcommerce|snoways|w870|sm-f20|starmaxx|lassa|tyre|tire|product|upload|media/i.test(x) && !/logo|icon|banner|sprite|loading|flag|star|rating/i.test(x))
    .slice(0, 10);
}

(async () => {
  for (const u of [
    "https://www.tiremart.com/starmaxx/sm-f20-tires/",
    "https://mosautoshina.com/catalog/tyre/lassa/snoways-4/",
    "https://mosautoshina.com/catalog/tyre/starmaxx/",
    "https://www.prioritytire.com/by-brand/starmaxx-tires/incurro-winter-w870",
    "https://www.123tyres.co.uk/brands/starmaxx/incurro-w870",
    "https://www.reifendirekt.de/Reifen/Starmaxx-Incurro-W870.html",
  ]) {
    console.log("\n", u);
    try {
      (await imgFromPage(u)).forEach((i) => console.log(i));
    } catch (e) {
      console.log("ERR", e.message);
    }
  }

  // simpletire with full browser headers
  const st = await fetch("https://simpletire.com/brands/starmaxx-tires/incurro-winter-w870", {
    headers: {
      "User-Agent": UA,
      Accept: "text/html",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  console.log("\nSimpleTire w870", st.status);
  if (st.ok) {
    const h = await st.text();
    [...new Set(h.match(/https:\/\/images\.simpletire\.com[^\"'\s]+/gi) || [])].slice(0, 8).forEach((i) => console.log(i));
  }
})();
