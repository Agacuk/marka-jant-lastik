"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const TIRES = path.join(ROOT, "assets", "images", "tires");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

const ITEMS = [
  { brand: "lassa", id: "driveways", url: "https://cdn.shopify.com/s/files/1/0251/6146/5961/files/lassa-driveways-sport-plus_b4d24ca1-498f-4cd6-a63c-0f3ff1dd2fe2.jpg", referer: "https://www.lassa.com/" },
  { brand: "lassa", id: "competus", url: "https://admin.lassa.com/Uploads/ERP/a59_1-1764666807613jpg_1.jpg", referer: "https://www.lassa.com/" },
  { brand: "lassa", id: "snoways", url: "https://jaunasriepas.lv/cache/images/051d6dd6931ee83f38781f784eb327d5.jpg", referer: "https://jaunasriepas.lv/" },
  { brand: "petlas", id: "explero", url: "https://cdn11.bigcommerce.com/s-e8i94i2k1a/images/stencil/1280x1280/products/155813/1430239/petlas-explero-pt431-ht-b-baa-2__52292.1712243496.jpg?c=2", referer: "https://www.tiremart.com/" },
  { brand: "petlas", id: "imperium", url: "https://cdn11.bigcommerce.com/s-e8i94i2k1a/images/stencil/1280x1280/products/152195/1370993/petlas-imperium-pt515-b-aaa-2__13697.1712246649.jpg?c=2", referer: "https://www.tiremart.com/" },
  { brand: "petlas", id: "snowmaster", url: "https://cdn11.bigcommerce.com/s-e8i94i2k1a/images/stencil/1280x1280/products/191369/1564417/petlas-snow-master-2-sport-b-aab-1__02160.1775530718.jpg?c=2", referer: "https://www.tiremart.com/" },
  { brand: "yokohama", id: "bluearth", url: "https://www.yokohama.com.au/-/media/images/tyres/tyreimages/bluearth-es-es32.png?h=800&w=800", referer: "https://www.yokohama.com.au/" },
  { brand: "yokohama", id: "advan-db-v552", url: "https://www.yokohama.com.au/-/media/images/tyres/tyreimages/advan-db-v552.png?h=800&w=800", referer: "https://www.yokohama.com.au/" },
  { brand: "bfgoodrich", id: "g-force-pilot-sport", url: "https://images.carid.com/bfgoodrich/bfgoodrich-g-force-sport-comp-2.jpg", referer: "https://www.carid.com/" },
  { brand: "starmaxx", id: "starmaxx-winter", url: "https://images.simpletire.com/images/mm/starmaxx-incurro-winter-w870-sidetread.jpg", referer: "https://simpletire.com/" },
  { brand: "starmaxx", id: "starmaxx-eco", url: "https://cdn11.bigcommerce.com/s-e8i94i2k1a/images/stencil/1280x1280/products/194592/1582616/starmaxx-naturen-st542-b-aaa-1__61280.1775517493.jpg?c=2", referer: "https://www.tiremart.com/" },
];

async function fetchBuf(url, referer) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/*,*/*", Referer: referer || "" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error("too small (" + buf.length + " bytes)");
  return buf;
}

async function toWebp(buf, dest) {
  const out = await sharp(buf).rotate().resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  fs.writeFileSync(dest, out);
  return out.length;
}

async function main() {
  const report = { ok: [], fail: [], skipped: [] };
  for (const item of ITEMS) {
    const dest = path.join(TIRES, item.brand, item.id + ".webp");
    if (fs.existsSync(dest)) {
      report.skipped.push(item);
      process.stdout.write(item.brand + "/" + item.id + "... skip\n");
      continue;
    }
    process.stdout.write(item.brand + "/" + item.id + "... ");
    try {
      const buf = await fetchBuf(item.url, item.referer);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const bytes = await toWebp(buf, dest);
      const svg = path.join(TIRES, item.brand, item.id + ".svg");
      if (fs.existsSync(svg)) fs.unlinkSync(svg);
      report.ok.push({ brand: item.brand, id: item.id, bytes, sourceUrl: item.url });
      console.log("OK");
    } catch (e) {
      report.fail.push({ brand: item.brand, id: item.id, reason: e.message });
      console.log("FAIL", e.message);
    }
  }
  fs.writeFileSync(path.join(TIRES, "missing-download-report.json"), JSON.stringify(report, null, 2));
  console.log("\nOK", report.ok.length, "FAIL", report.fail.length, "SKIP", report.skipped.length);
}

main();
