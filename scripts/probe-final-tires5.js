"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
  const buf = Buffer.from(await r.arrayBuffer());
  return { status: r.status, len: buf.length, text: r.text ? await r.text() : "" };
}

(async () => {
  const imgs = [
    ["kolayoto-driveways", "https://cdn.shopify.com/s/files/1/0251/6146/5961/files/lassa-driveways-sport-plus_b4d24ca1-498f-4cd6-a63c-0f3ff1dd2fe2.jpg"],
    ["lassa-a59", "https://admin.lassa.com/Uploads/ERP/a59_1-1764666807613jpg_1.jpg"],
    ["lassa-a36", "https://admin.lassa.com/Uploads/ERP/a36_1-1770970578214jpg_1.jpg"],
    ["lassa-ch3", "https://admin.lassa.com/Uploads/ERP/ch3_1-1738248972759jpg_5.jpg"],
    ["lassa-r01", "https://admin.lassa.com/Uploads/ERP/r01_1-1704802724631jpg_5.jpg"],
    ["lassa-mw2", "https://admin.lassa.com/Uploads/ERP/mw2_1-1692258537056jpg_11.jpg"],
    ["bfg-carid", "https://images.carid.com/bfgoodrich/bfgoodrich-g-force-sport-comp-2.jpg"],
    ["bfg-carid-front", "https://images.carid.com/bfgoodrich/items/bfgoodrich-g-force-sport-comp-2-front.jpg"],
  ];
  for (const [n, u] of imgs) {
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    const len = r.ok ? (await r.arrayBuffer()).byteLength : 0;
    console.log(n, r.status, len);
  }

  for (const u of [
    "https://www.oponeo.co.uk/tyre-model/starmaxx-naturen-st542",
    "https://www.oponeo.co.uk/tyre-model/starmaxx-incurro-w870",
    "https://www.oponeo.co.uk/tyre-model/lassa-competus-at2",
  ]) {
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    const html = await r.text();
    console.log("\nOPONEO", u.split("/").pop(), r.status);
    [...new Set(html.match(/https:\/\/[^\"'\s]+\.(?:jpg|webp|png)/gi) || [])].slice(0, 20).forEach((i) => console.log(i));
    [...new Set(html.match(/data-src=\"([^\"]+)\"/gi) || [])].slice(0, 10).forEach((i) => console.log("DATA", i));
  }

  for (const slug of [
    "petlas-snow-master-2-195-60r15-88h-winter-tire",
    "starmaxx-naturen-st542-195-55r16-87h",
    "starmaxx-incurro-w870-205-55r16-91h",
  ]) {
    const r = await fetch("https://www.tiremart.com/search.php?search_query=" + slug.split("-")[0], { headers: { "User-Agent": UA } });
    const html = await r.text();
    const links = [...new Set(html.match(/\/starmaxx[^\"'\s]+|\/petlas-snow[^\"'\s]+/gi) || [])].slice(0, 5);
    console.log("\nTM search", slug, links);
  }

  const tm = await fetch("https://www.tiremart.com/search.php?search_query=starmaxx+naturen", { headers: { "User-Agent": UA } });
  const tmh = await tm.text();
  console.log("\nTM starmaxx links:");
  [...new Set(tmh.match(/\/starmaxx[^\"'\s?]+/gi) || [])].slice(0, 10).forEach((l) => console.log(l));

  const tm2 = await fetch("https://www.tiremart.com/search.php?search_query=starmaxx+incurro", { headers: { "User-Agent": UA } });
  const tmh2 = await tm2.text();
  [...new Set(tmh2.match(/\/starmaxx[^\"'\s?]+/gi) || [])].slice(0, 10).forEach((l) => console.log(l));
})();
