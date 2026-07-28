/**
 * Download official tire product images for all catalog brands.
 * Run: node scripts/download-tire-product-images.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TIRES_DIR = path.join(ROOT, "assets", "images", "tires");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

let sharp;
try {
  sharp = require("sharp");
} catch (_) {
  sharp = null;
}

const products = [
  // Continental
  {
    brand: "continental",
    id: "premiumcontact-7",
    url: "https://www.continental-tires.com/adobe/dynamicmedia/deliver/dm-aid--a51ceec3-5ea0-462f-a050-fb9e1f597fe3/PremiumContact7_30_degree-AEM.png.webp?preferwebp=true&quality=85&width=800",
    referer: "https://www.continental-tires.com/",
  },
  {
    brand: "continental",
    id: "sportcontact-7",
    url: "https://www.continental-tires.com/adobe/dynamicmedia/deliver/dm-aid--b3fe69ec-259b-4741-bc76-feab12c76bb1/Continental__SportContact-7__ProductPicture__30.png.webp?preferwebp=true&quality=85&width=800",
    referer: "https://www.continental-tires.com/",
  },
  {
    brand: "continental",
    id: "ecocontact-6",
    url: "https://www.continental-tires.com/adobe/dynamicmedia/deliver/dm-aid--97c308d4-4939-4a80-8bc2-7f9458268515/Continental__EcoContact-6__ProductPicture__90.png.webp?preferwebp=true&quality=85&width=800",
    referer: "https://www.continental-tires.com/",
  },
  {
    brand: "continental",
    id: "allseasoncontact",
    url: "https://www.continental-tires.com/adobe/dynamicmedia/deliver/dm-aid--3a2c9086-b705-4f85-8023-c7ddb3dd537f/continental__allseasoncontact-2__productpicture__30.png.webp?preferwebp=true&quality=85&width=800",
    referer: "https://www.continental-tires.com/",
  },

  // Pirelli
  {
    brand: "pirelli",
    id: "p-zero",
    url: "https://tyre24.pirelli.com/dynamic_engine/assets/visori/3_4/pzero.png",
    referer: "https://www.pirelli.com/",
  },
  {
    brand: "pirelli",
    id: "cinturato-p7",
    url: "https://tyre24.pirelli.com/dynamic_engine/assets/visori/3_4/p7cint.png",
    referer: "https://www.pirelli.com/",
  },
  {
    brand: "pirelli",
    id: "scorpion-verde",
    url: "https://tyre24.pirelli.com/dynamic_engine/assets/visori/3_4/sveas.png",
    referer: "https://www.pirelli.com/",
  },
  {
    brand: "pirelli",
    id: "powergy",
    url: "https://tyre24.pirelli.com/dynamic_engine/assets/visori/3_4/pwrgy.png",
    referer: "https://www.pirelli.com/",
  },

  // Goodyear
  {
    brand: "goodyear",
    id: "eagle-f1-asymmetric",
    url: "https://www.goodyear.eu/content/dam/goodyear/consumer/common/why-goodyear/eagle-f1-asymmetric-6/goodyear-f1-as6-2026-product-828x1198px.jpg.transform/rendition-900/image.jpg",
    referer: "https://www.goodyear.eu/",
  },
  {
    brand: "goodyear",
    id: "efficientgrip-performance",
    url: "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/effigripp2/effigripp2-front.jpg.transform/product-front/image.jpg",
    referer: "https://www.goodyear.eu/",
  },
  {
    brand: "goodyear",
    id: "vector-4seasons-gen3",
    url: "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/vec4seasg3/vec4seasg3-front.jpg.transform/product-front/image.jpg",
    referer: "https://www.goodyear.eu/",
  },
  {
    brand: "goodyear",
    id: "ultragrip-performance",
    url: "https://www.goodyear.eu/content/dam/goodyear/consumer/common/why-goodyear/ultragrip-performance-3/goodyear-ultragrip-performance-3-tyre.jpg",
    referer: "https://www.goodyear.eu/",
  },

  // Lassa
  {
    brand: "lassa",
    id: "revola",
    url: "http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/R01_1-1704802724631.jpg",
    referer: "https://www.lassa.com.tr/",
  },

  // Kumho
  {
    brand: "kumho",
    id: "ecsta-ps71",
    url: "https://www.kumhotire.com/upload/product/PS71_30_DEGREE.png",
    referer: "https://www.kumhotire.com/",
  },
  {
    brand: "kumho",
    id: "solus-4s",
    url: "https://www.kumhotire.com/upload/product/HA32_30_DEGREE.png",
    referer: "https://www.kumhotire.com/",
  },
  {
    brand: "kumho",
    id: "wintercraft",
    url: "https://www.kumhotire.com/upload/product/WP71_30_DEGREE.png",
    referer: "https://www.kumhotire.com/",
  },
  {
    brand: "kumho",
    id: "crugen-premium",
    url: "https://www.kumhotire.com/upload/product/HP71_30_DEGREE.png",
    referer: "https://www.kumhotire.com/",
  },
  {
    brand: "kumho",
    id: "ecowing",
    url: "https://www.kumhotire.com/upload/product/ES31_30_DEGREE.png",
    referer: "https://www.kumhotire.com/",
  },

  // Yokohama
  {
    brand: "yokohama",
    id: "advan-sport-v105",
    url: "https://ytc-bm.s3.us-east-2.amazonaws.com/RS2300_1008_YTC_CONS_0810_YTC_CONS_ADVAN-0K.webp",
    referer: "https://www.yokohamatire.com/",
  },
  {
    brand: "yokohama",
    id: "geolandar",
    url: "https://ytc-bm.s3.us-east-2.amazonaws.com/Geolandar-White.png",
    referer: "https://www.yokohamatire.com/",
  },
  {
    brand: "yokohama",
    id: "iceguard",
    url: "https://ytc-bm.s3.us-east-2.amazonaws.com/iceGUARD-iG53-3QL-Web.webp",
    referer: "https://www.yokohamatire.com/",
  },

  // Bridgestone
  {
    brand: "bridgestone",
    id: "potenza-sport",
    url: "https://tires.bridgestone.com/content/dam/consumer/bst/shared/tires/potenza-sport/tilted.jpg",
    referer: "https://tires.bridgestone.com/",
  },
  {
    brand: "bridgestone",
    id: "turanza-t005",
    url: "https://tires.bridgestone.com/content/dam/consumer/bst/shared/tires/turanza-t005/tilted.jpg",
    referer: "https://tires.bridgestone.com/",
  },
  {
    brand: "bridgestone",
    id: "blizzak-lm005",
    url: "https://tires.bridgestone.com/content/dam/consumer/bst/shared/tires/blizzak-lm005/tilted.jpg",
    referer: "https://tires.bridgestone.com/",
  },
  {
    brand: "bridgestone",
    id: "alenza-001",
    url: "https://tires.bridgestone.com/content/dam/consumer/bst/shared/tires/alenza-001/tilted.jpg",
    referer: "https://tires.bridgestone.com/",
  },

  // Hankook
  {
    brand: "hankook",
    id: "ventus-s1-evo3",
    url: "https://asset.hankooktire.com/content/dam/hankooktire/local/img/product/ventus127/K127A-crop2_new.jpg",
    referer: "https://www.hankooktire.com/",
  },
  {
    brand: "hankook",
    id: "kinergy-4s2",
    url: "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/pcr/h750/1new.jpg",
    referer: "https://www.hankooktire.com/",
  },
  {
    brand: "hankook",
    id: "dynapro",
    url: "https://asset.hankooktire.com/content/dam/hankooktire/local/og-image/RH12_normal.jpg",
    referer: "https://www.hankooktire.com/",
  },
  {
    brand: "hankook",
    id: "winter-icept",
    url: "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/tire_list/pcr/W330_normal.png",
    referer: "https://www.hankooktire.com/",
  },

  // Nexen
  {
    brand: "nexen",
    id: "nfera-sport",
    url: "https://www.nexentire.com/international/product/passenger/__icsFiles/afieldfile/2019/01/18/product_1.png",
    referer: "https://www.nexentire.com/",
  },
  {
    brand: "nexen",
    id: "nblue-4season",
    url: "https://www.nexentire.com/international/product/passenger/__icsFiles/afieldfile/2022/08/11/product.png",
    referer: "https://www.nexentire.com/",
  },
  {
    brand: "nexen",
    id: "winguard-winspike",
    url: "https://www.nexentire.com/international/product/winter/__icsFiles/afieldfile/2020/09/23/product_1.png",
    referer: "https://www.nexentire.com/",
  },
  {
    brand: "nexen",
    id: "roadian-gtx",
    url: "https://www.nexentire.com/international/product/suv/__icsFiles/afieldfile/2020/12/04/roadian_gtx_product.png",
    referer: "https://www.nexentire.com/",
  },

  // BFGoodrich
  {
    brand: "bfgoodrich",
    id: "all-terrain-ko2",
    pageUrl: "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-all-terrain-t-a-ko2",
    referer: "https://www.bfgoodrich.co.uk/",
    extract: "michelin",
  },
  {
    brand: "bfgoodrich",
    id: "advantage-touring",
    url: "https://dxm.contentcenter.michelin.com/api/wedia/dam/transform/b98rpyxf61b4xgjqib1gz7srjo/4w-1601_3528701443621_tire_bfgoodrich_advantage-2_225-slash-45-r19-92w_a_main_1-30_nopad.webp",
    referer: "https://www.bfgoodrich.co.uk/",
  },
];

async function fetchBuffer(url, referer) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: referer || "",
    },
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error("File too small (" + buf.length + " bytes)");
  return buf;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.text();
}

function decodeHtml(str) {
  return str.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\\\//g, "/");
}

function extractMichelinTire(html) {
  const d = decodeHtml(html);
  const m = d.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s\\]+tire_bfgoodrich[^"'\s\\]+_main_[^"'\s\\]+\.webp/gi);
  if (!m) return null;
  const urls = [...new Set(m.map((u) => u.split("?")[0]))];
  urls.sort((a, b) => {
    const score = (u) =>
      (u.includes("_main_1-30_nopad") ? 100 : 0) +
      (u.includes("_main_1-30") ? 80 : 0) +
      (u.includes("_main_1") ? 60 : 0);
    return score(b) - score(a);
  });
  return urls[0];
}

async function toWebp(inputBuffer, dest) {
  if (!sharp) {
    fs.writeFileSync(dest, inputBuffer);
    return inputBuffer.length;
  }
  const out = await sharp(inputBuffer)
    .rotate()
    .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  fs.writeFileSync(dest, out);
  return out.length;
}

async function downloadProduct(item) {
  let imageUrl = item.url;
  if (item.pageUrl && item.extract === "michelin") {
    const html = await fetchHtml(item.pageUrl);
    imageUrl = extractMichelinTire(html);
    if (!imageUrl) throw new Error("No Michelin CDN image on page");
  }

  const input = await fetchBuffer(imageUrl, item.referer);
  const outDir = path.join(TIRES_DIR, item.brand);
  const dest = path.join(outDir, item.id + ".webp");
  fs.mkdirSync(outDir, { recursive: true });

  const bytes = await toWebp(input, dest);
  return { dest, bytes, sourceUrl: imageUrl };
}

async function main() {
  const report = { success: [], failed: [], skipped: [] };

  // Michelin already downloaded
  const michelinDir = path.join(TIRES_DIR, "michelin");
  if (fs.existsSync(michelinDir)) {
    fs.readdirSync(michelinDir)
      .filter((f) => f.endsWith(".webp"))
      .forEach((f) => {
        report.skipped.push({ brand: "michelin", id: f.replace(".webp", ""), reason: "Already present" });
      });
  }

  for (const item of products) {
    const dest = path.join(TIRES_DIR, item.brand, item.id + ".webp");
    if (fs.existsSync(dest)) {
      report.skipped.push({ brand: item.brand, id: item.id, reason: "Already present" });
      process.stdout.write(item.brand + "/" + item.id + "... skip\n");
      continue;
    }

    process.stdout.write(item.brand + "/" + item.id + "... ");
    try {
      const result = await downloadProduct(item);
      const svgPath = path.join(TIRES_DIR, item.brand, item.id + ".svg");
      if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
      report.success.push({
        brand: item.brand,
        id: item.id,
        dest: path.relative(ROOT, result.dest),
        bytes: result.bytes,
        sourceUrl: result.sourceUrl,
      });
      console.log("OK (" + Math.round(result.bytes / 1024) + " KB)");
    } catch (err) {
      report.failed.push({ brand: item.brand, id: item.id, reason: err.message });
      console.log("FAIL:", err.message);
    }
  }

  fs.writeFileSync(path.join(TIRES_DIR, "download-report.json"), JSON.stringify(report, null, 2), "utf8");

  console.log("\n--- Summary ---");
  console.log("Success:", report.success.length);
  console.log("Failed:", report.failed.length);
  console.log("Skipped (Michelin):", report.skipped.length);
}

main();
