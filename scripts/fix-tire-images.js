"use strict";
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const TIRES = path.join(ROOT, "assets", "images", "tires");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
const CANVAS = 900;
const FILL = 780;
const BG = { r: 14, g: 14, b: 20, alpha: 1 };

const ITEMS = [
  {
    brand: "starmaxx",
    id: "starmaxx-winter",
    url: "https://images.simpletire.com/images/q_auto/f_auto,q_auto,fl_lossy,h_3840/line-images/19808/19808-sidetread/starmaxx-incurro-w870.png",
    referer: "https://simpletire.com/",
  },
  {
    brand: "yokohama",
    id: "advan-sport-v105",
    url: "https://www.yokohama.com.au/-/media/images/tyres/tyreimages/advan-sport-v105.png?h=800&w=800",
    referer: "https://www.yokohama.com.au/",
  },
  {
    brand: "yokohama",
    id: "geolandar",
    url: "https://www.yokohama.com.au/-/media/images/tyres/tyreimages/geolandar-cv-g058.png?h=800&w=800",
    referer: "https://www.yokohama.com.au/",
  },
  {
    brand: "hankook",
    id: "ventus-s1-evo3",
    url: "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/K127_normal.png",
    referer: "https://www.hankooktire.com/",
  },
  {
    brand: "hankook",
    id: "kinergy-4s2",
    url: "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/H750_normal.png",
    referer: "https://www.hankooktire.com/",
  },
  {
    brand: "hankook",
    id: "dynapro",
    url: "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/suv/RH12_normal.png",
    referer: "https://www.hankooktire.com/",
  },
  {
    brand: "hankook",
    id: "winter-icept",
    url: "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/W330_normal.png",
    referer: "https://www.hankooktire.com/",
  },
  {
    brand: "goodyear",
    id: "eagle-f1-asymmetric",
    url: "https://content.presspage.com/uploads/2368/gyeaglef1a6std.png",
    referer: "https://news.goodyear.eu/",
  },
];

async function fetchBuf(url, referer) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*", Referer: referer || "" },
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) throw new Error("too small (" + buf.length + " bytes)");
  return buf;
}

async function normalizeTire(buf) {
  const meta = await sharp(buf).metadata();
  const flattenBg =
    meta.hasAlpha
      ? { r: 255, g: 255, b: 255 }
      : meta.channels === 1
        ? { r: 255, g: 255, b: 255 }
        : { r: 255, g: 255, b: 255 };

  let pipeline = sharp(buf).rotate().flatten({ background: flattenBg });

  let trimmed;
  try {
    trimmed = await pipeline.trim({ threshold: 18 }).toBuffer({ resolveWithObject: true });
  } catch (_) {
    trimmed = await sharp(buf).rotate().toBuffer({ resolveWithObject: true });
  }

  const maxDim = Math.max(trimmed.info.width, trimmed.info.height);
  const scale = FILL / maxDim;
  const w = Math.max(1, Math.round(trimmed.info.width * scale));
  const h = Math.max(1, Math.round(trimmed.info.height * scale));

  return sharp(trimmed.data)
    .resize(w, h, { fit: "inside", withoutEnlargement: false })
    .extend({
      top: Math.floor((CANVAS - h) / 2),
      bottom: Math.ceil((CANVAS - h) / 2),
      left: Math.floor((CANVAS - w) / 2),
      right: Math.ceil((CANVAS - w) / 2),
      background: BG,
    })
    .webp({ quality: 84, effort: 4 })
    .toBuffer();
}

async function main() {
  const report = { ok: [], fail: [] };
  for (const item of ITEMS) {
    process.stdout.write(item.brand + "/" + item.id + "... ");
    try {
      const input = await fetchBuf(item.url, item.referer);
      const out = await normalizeTire(input);
      const dir = path.join(TIRES, item.brand);
      fs.mkdirSync(dir, { recursive: true });
      const dest = path.join(dir, item.id + ".webp");
      fs.writeFileSync(dest, out);
      report.ok.push({ brand: item.brand, id: item.id, bytes: out.length, sourceUrl: item.url });
      console.log("OK (" + Math.round(out.length / 1024) + " KB)");
    } catch (e) {
      report.fail.push({ brand: item.brand, id: item.id, reason: e.message });
      console.log("FAIL", e.message);
    }
  }
  fs.writeFileSync(path.join(TIRES, "fix-tire-images-report.json"), JSON.stringify(report, null, 2));
  console.log("\nDone OK", report.ok.length, "FAIL", report.fail.length);
}

main();
