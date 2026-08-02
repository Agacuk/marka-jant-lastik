/**
 * Scans 2. el jant görselleri, kalite kontrolü + kategori sıralaması yapar,
 * WebP türetir ve used-wheels-data.js üretir.
 * Run: node scripts/build-used-wheels-manifest.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const OUT_JS = path.join(ROOT, "assets", "js", "used-wheels-data.js");
const REPORT = path.join(ROOT, "assets", "images", "used-wheels-build-report.json");

const SCAN_DIRS = [
  path.join(ROOT, "assets", "images", "2. el jantlar"),
  path.join(ROOT, "assets", "images", "jantlar", "2. El Jantlar"),
];

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const MIN_BYTES = 20 * 1024;

const TIERS = [
  {
    id: 1,
    label: "Krom / Forged / Premium",
    test: function (name) {
      return /krom|chrome|crome|forged|vossen|babayaga|premium|amg|m\s?performance/i.test(name);
    },
  },
  {
    id: 2,
    label: "Diamond Cut",
    test: function (name) {
      return /diamond[\s-]?cut|diamondcut/i.test(name);
    },
  },
  {
    id: 3,
    label: "Parlak Siyah",
    test: function (name) {
      return /parlak\s*siyah|matte\s*black|gloss\s*black|\bsiyah\b|\bblack\b/i.test(name);
    },
  },
  {
    id: 4,
    label: "Antrasit",
    test: function (name) {
      return /antrasit|anthracite|gunmetal|graphite|antrasi/i.test(name);
    },
  },
  {
    id: 6,
    label: "Çelik Jant",
    test: function (name) {
      return /çelik|celik|\bsteel\b|peugeot|citro[eë]n/i.test(name);
    },
  },
  {
    id: 5,
    label: "Gümüş",
    test: function (name) {
      return /gümüş|gumus|\bsilver\b|\boem\b|skoda|honda|toyota|renault|seat|fiat|opel|volkswagen|istanbul/i.test(name);
    },
  },
];

function toWebPath(absPath) {
  return absPath.replace(/\\/g, "/").split("/assets/").pop()
    ? "assets/" + absPath.replace(/\\/g, "/").split("/assets/").pop()
    : absPath.replace(/\\/g, "/");
}

function detectTier(filename) {
  const base = path.basename(filename, path.extname(filename));

  const inchMatch = base.match(/(\d{2})\s*(?:İnç|Inch|INÇ|inch)/i);
  const inch = inchMatch ? Number(inchMatch[1]) : 0;
  if (inch >= 19 && /bmw|mercedes|audi|porsche|land rover|range rover|amg/i.test(base)) {
    return { id: 1, label: "Krom / Forged / Premium" };
  }

  for (const tier of TIERS) {
    if (tier.test(base)) return { id: tier.id, label: tier.label };
  }

  if (/jant takım/i.test(base) && !/oem/i.test(base)) {
    return { id: 6, label: "Çelik Jant" };
  }

  return { id: 5, label: "Gümüş" };
}

function qualityScore(meta, bytes, tierId) {
  const minDim = Math.min(meta.width, meta.height);
  const megapixels = (meta.width * meta.height) / 1e6;
  const sizeKb = bytes / 1024;
  const tierBoost = (7 - tierId) * 12;
  return Math.round(minDim * 0.08 + megapixels * 40 + sizeKb * 0.35 + tierBoost);
}

function collectJpgFiles() {
  const map = new Map();

  SCAN_DIRS.forEach(function (dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(function (file) {
      if (!/\.jpe?g$/i.test(file)) return;
      const abs = path.join(dir, file);
      if (!map.has(file.toLowerCase())) map.set(file.toLowerCase(), abs);
    });
  });

  return [...map.values()];
}

async function analyzeImage(absPath) {
  const bytes = fs.statSync(absPath).size;
  if (bytes < MIN_BYTES) {
    return { rejected: true, reason: "file too small (" + bytes + " bytes)" };
  }

  let meta;
  try {
    meta = await sharp(absPath).metadata();
  } catch (err) {
    return { rejected: true, reason: "invalid image: " + err.message };
  }

  if (!meta.width || !meta.height) {
    return { rejected: true, reason: "missing dimensions" };
  }
  if (meta.width < MIN_WIDTH || meta.height < MIN_HEIGHT) {
    return {
      rejected: true,
      reason: "low resolution (" + meta.width + "x" + meta.height + ")",
    };
  }

  const filename = path.basename(absPath);
  const tier = detectTier(filename);
  const relJpg = toWebPath(absPath);
  const webpAbs = absPath.replace(/\.jpe?g$/i, ".webp");
  let webpPath = null;

  try {
    await sharp(absPath)
      .rotate()
      .webp({ quality: 84, effort: 4 })
      .toFile(webpAbs);
    webpPath = toWebPath(webpAbs);
  } catch (_err) {
    webpPath = null;
  }

  const alt = filename.replace(/\.jpe?g$/i, "").replace(/\s+/g, " ").trim();

  return {
    rejected: false,
    item: {
      jpg: relJpg,
      webp: webpPath,
      alt: alt,
      tier: tier.id,
      tierLabel: tier.label,
      quality: qualityScore(meta, bytes, tier.id),
      width: meta.width,
      height: meta.height,
      bytes: bytes,
    },
  };
}

async function main() {
  const files = collectJpgFiles();
  const accepted = [];
  const rejected = [];

  for (const file of files) {
    const result = await analyzeImage(file);
    if (result.rejected) {
      rejected.push({ file: toWebPath(file), reason: result.reason });
    } else {
      accepted.push(result.item);
    }
  }

  accepted.sort(function (a, b) {
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (b.quality !== a.quality) return b.quality - a.quality;
    return a.alt.localeCompare(b.alt, "tr");
  });

  const js =
    "/**\n * AUTO-GENERATED — node scripts/build-used-wheels-manifest.js\n */\n" +
    "(function (global) {\n" +
    '  "use strict";\n\n' +
    "  global.UsedWheelsCatalog = " +
    JSON.stringify(
      {
        whatsappUrl:
          "https://wa.me/905449483197?text=" +
          encodeURIComponent(
            "Merhaba, 2. el jantlar hakkında bilgi almak istiyorum."
          ),
        items: accepted,
      },
      null,
      2
    ) +
    ";\n})(window);\n";

  fs.writeFileSync(OUT_JS, js, "utf8");
  fs.writeFileSync(
    REPORT,
    JSON.stringify(
      {
        scannedDirs: SCAN_DIRS.map(function (d) {
          return toWebPath(d);
        }),
        totalFound: files.length,
        accepted: accepted.length,
        rejected: rejected,
        sortOrder: accepted.map(function (item) {
          return {
            alt: item.alt,
            tier: item.tier,
            tierLabel: item.tierLabel,
            quality: item.quality,
          };
        }),
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("Accepted: " + accepted.length + " / " + files.length);
  console.log("Written: assets/js/used-wheels-data.js");
  if (rejected.length) {
    console.log("Rejected: " + rejected.length);
    rejected.forEach(function (r) {
      console.log("  - " + r.file + ": " + r.reason);
    });
  }
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
