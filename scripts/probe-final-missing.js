"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function head(url) {
  const r = await fetch(url, { method: "GET", headers: { "User-Agent": UA } });
  const len = (await r.arrayBuffer()).byteLength;
  return { status: r.status, len, type: r.headers.get("content-type") };
}

(async () => {
  const petlas = [
    "https://www.petlas.com/storage/app/media/product/velox-sport-pt741.png",
    "https://www.petlas.com/storage/app/media/product/PT741.png",
    "https://www.petlas.com/storage/app/media/products/velox-sport.png",
    "https://www.petlas.com/storage/app/media/2025/velox-sport-pt741.png",
    "https://www.petlas.com/storage/app/media/2024/PT741.png",
    "https://www.petlas.com/themes/petlas/assets/images/products/PT741.png",
    "https://www.petlas.com/storage/app/uploads/public/PT741.png",
  ];
  for (const u of petlas) {
    const r = await head(u);
    if (r.status === 200 && r.len > 3000) console.log("PETLAS OK", r.len, u);
    else console.log("PETLAS", r.status, r.len, u.split("/").pop());
  }

  // Lassa - try English or alternate slugs from sitemap
  for (const slug of [
    "r01-01-driveways", "r01-03-competus-at-2", "r01-04-snoways-4",
    "r01-01-driveways-sport", "driveways-sport", "competus-at2", "snoways4",
    "en/desen/r01-01-driveways", "desen/driveways",
  ]) {
    const u = "https://www.lassa.com.tr/" + slug.replace(/^en\//, "") + (slug.startsWith("en/") ? "" : "");
    const url = slug.startsWith("en/") ? "https://www.lassa.com.tr/" + slug : "https://www.lassa.com.tr/desen/" + slug;
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (r.status === 200) {
      const h = await r.text();
      const img = h.match(/medias89k[^"'\s]+\.(?:jpg|webp)/i);
      console.log("LASSA OK", slug, img?.[0]);
    } else console.log("LASSA", slug, r.status);
  }

  // Yokohama advan db - try variants
  for (const slug of ["advan-db-v552", "advan-db-v551", "advan-d-b-v552", "advan-db"]) {
    const r = await fetch("https://www.yokohamatire.com/tires/" + slug, { headers: { "User-Agent": UA } });
    console.log("YOKO", slug, r.status, r.url);
    if (r.ok) {
      const h = await r.text();
      const imgs = h.match(/ytc-bm[^"'\s]+(?:3QL|WHT|Image)[^"'\s]+/gi);
      if (imgs) imgs.slice(0, 3).forEach((i) => console.log(" ", i));
    }
  }
})();
