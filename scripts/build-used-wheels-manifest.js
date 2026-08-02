/**
 * Scans 2. el jant görselleri, dosya adı ayrıştırma, kalite + sıralama, WebP, manifest.
 * Run: node scripts/build-used-wheels-manifest.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { parseFilename } = require("./used-wheels-filename-parser");

const ROOT = path.join(__dirname, "..");
const OUT_JS = path.join(ROOT, "assets", "js", "used-wheels-data.js");
const OVERRIDES = path.join(ROOT, "assets", "js", "used-wheels-overrides.json");
const REPORT = path.join(ROOT, "assets", "images", "used-wheels-build-report.json");

const SCAN_DIRS = [
  path.join(ROOT, "assets", "images", "2. el jantlar"),
  path.join(ROOT, "assets", "images", "jantlar", "2. El Jantlar"),
];

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const MIN_BYTES = 20 * 1024;

function toWebPath(absPath) {
  const norm = absPath.replace(/\\/g, "/");
  const idx = norm.indexOf("/assets/");
  return idx >= 0 ? norm.slice(idx + 1) : norm;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.jpe?g$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function loadOverrides() {
  if (!fs.existsSync(OVERRIDES)) {
    return {
      defaultStatus: { label: "Stokta", icon: "🟢", tone: "in-stock" },
      phoneUrl: "tel:+905449483197",
      whatsappBase: "https://wa.me/905449483197",
      items: {},
    };
  }
  return JSON.parse(fs.readFileSync(OVERRIDES, "utf8"));
}

function qualityScore(meta, bytes, tierId) {
  const minDim = Math.min(meta.width, meta.height);
  const megapixels = (meta.width * meta.height) / 1e6;
  const sizeKb = bytes / 1024;
  const tierBoost = (8 - tierId) * 14;
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

function fallbackTitle(filename) {
  const base = path.basename(filename).replace(/\.jpe?g$/i, "").replace(/\s+/g, " ").trim();
  return base.replace(/\s*Jant\s+Takım.*$/i, "").replace(/\s*Lastik\s+Takım.*$/i, "").trim();
}

function whatsappForItem(base, title) {
  return (
    base +
    "?text=" +
    encodeURIComponent(
      "Merhaba, " + title + " (2. el jant) hakkında bilgi almak istiyorum."
    )
  );
}

async function analyzeImage(absPath, overrides) {
  const filename = path.basename(absPath);
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

  const parsed = parseFilename(filename);
  const relJpg = toWebPath(absPath);
  const webpAbs = absPath.replace(/\.jpe?g$/i, ".webp");
  let webpPath = null;

  try {
    await sharp(absPath).rotate().webp({ quality: 84, effort: 4 }).toFile(webpAbs);
    webpPath = toWebPath(webpAbs);
  } catch (_err) {
    webpPath = null;
  }

  const itemOverride = overrides.items[filename] || overrides.items[parsed.title] || {};
  const status = itemOverride.status || overrides.defaultStatus;
  const vehicles = itemOverride.vehicles || [];
  const extraImages = itemOverride.images || [];

  const images = [
    { jpg: relJpg, webp: webpPath, alt: parsed.title },
    ...extraImages,
  ];

  return {
    rejected: false,
    item: {
      id: slugify(filename),
      filename: filename,
      title: parsed.title || fallbackTitle(filename),
      specs: parsed.specs,
      tier: parsed.tier,
      tierLabel: parsed.tierLabel,
      parsed: parsed.parsed,
      quality: qualityScore(meta, bytes, parsed.tier),
      jpg: relJpg,
      webp: webpPath,
      width: meta.width,
      height: meta.height,
      bytes: bytes,
      images: images,
      status: status,
      vehicles: vehicles,
      whatsappUrl: whatsappForItem(overrides.whatsappBase, parsed.title || fallbackTitle(filename)),
    },
    parseMeta: parsed,
  };
}

async function main() {
  const overrides = loadOverrides();
  const files = collectJpgFiles();
  const accepted = [];
  const rejected = [];
  const parsedOk = [];
  const parsedFail = [];

  for (const file of files) {
    const result = await analyzeImage(file, overrides);
    if (result.rejected) {
      rejected.push({ file: toWebPath(file), reason: result.reason });
      continue;
    }
    accepted.push(result.item);
    if (result.parseMeta.parsed) {
      parsedOk.push(result.item.filename);
    } else {
      parsedFail.push({ file: result.item.filename, title: result.item.title });
    }
  }

  accepted.sort(function (a, b) {
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (b.quality !== a.quality) return b.quality - a.quality;
    return a.title.localeCompare(b.title, "tr");
  });

  const catalog = {
    defaultStatus: overrides.defaultStatus,
    phoneUrl: overrides.phoneUrl,
    whatsappUrl: whatsappForItem(overrides.whatsappBase, "Premium 2. El Jantlar"),
    items: accepted,
  };

  const js =
    "/**\n * AUTO-GENERATED — node scripts/build-used-wheels-manifest.js\n */\n" +
    "(function (global) {\n" +
    '  "use strict";\n\n' +
    "  global.UsedWheelsCatalog = " +
    JSON.stringify(catalog, null, 2) +
    ";\n})(window);\n";

  fs.writeFileSync(OUT_JS, js, "utf8");
  fs.writeFileSync(
    REPORT,
    JSON.stringify(
      {
        scannedDirs: SCAN_DIRS.map(toWebPath),
        totalFound: files.length,
        accepted: accepted.length,
        rejected: rejected,
        parsedOk: parsedOk,
        parsedFail: parsedFail,
        sortOrder: accepted.map(function (item) {
          return {
            title: item.title,
            filename: item.filename,
            tier: item.tier,
            tierLabel: item.tierLabel,
            specs: item.specs.map(function (s) {
              return s.label;
            }),
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
  console.log("Parsed OK: " + parsedOk.length);
  console.log("Parsed partial/fail: " + parsedFail.length);
  console.log("Written: assets/js/used-wheels-data.js");
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
