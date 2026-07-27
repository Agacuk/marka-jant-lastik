/**
 * Download official Michelin product images and save as .webp
 * Run: node scripts/download-michelin-product-images.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets", "images", "tires", "michelin");

const products = [
  {
    id: "pilot-sport-5",
    slug: "pilot-sport-5",
    url: "https://www.michelin.co.uk/auto/tyres/michelin-pilot-sport-5",
  },
  {
    id: "primacy-5",
    slug: "primacy-5",
    url: "https://www.michelin.co.uk/auto/tyres/michelin-primacy-5",
  },
  {
    id: "crossclimate-2",
    slug: "crossclimate-2",
    url: "https://www.michelin.co.uk/auto/tyres/michelin-crossclimate-2",
  },
  {
    id: "latitude-sport-3",
    slug: "latitude-sport-3",
    url: "https://www.michelin.co.uk/auto/tyres/michelin-latitude-sport-3",
  },
  {
    id: "pilot-alpin",
    slug: "pilot-alpin",
    pageSlug: "pilot-alpin-5",
    url: "https://www.michelin.co.uk/auto/tyres/michelin-pilot-alpin-5",
  },
  {
    id: "e-primacy",
    slug: "e-primacy",
    url: "https://www.michelin.co.uk/auto/tyres/michelin-e-primacy",
  },
];

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-GB,en;q=0.9",
    },
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.text();
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\\\//g, "/")
    .replace(/\\u002F/g, "/");
}

function pickProductImage(html, product) {
  const decoded = decodeHtmlEntities(html);
  const slug = product.pageSlug || product.slug;
  const regex =
    /https:\/\/dxm\.contentcenter\.michelin\.com\/api\/wedia\/dam\/transform\/[^"'\s\\]+tire_michelin_[^"'\s\\]+_main_[^"'\s\\]+\.webp/gi;

  const matches = [...new Set(decoded.match(regex) || [])];

  const normalized = matches.map(function (url) {
    return url.split("?")[0];
  });

  const preferred = normalized.filter(function (url) {
    const lower = url.toLowerCase();
    return (
      lower.includes("tire_michelin_" + slug) ||
      lower.includes("tire_michelin_" + slug.replace(/-/g, ""))
    );
  });

  const pool = preferred.length ? preferred : normalized.filter(function (url) {
    return url.toLowerCase().includes(slug.replace(/-/g, "-"));
  });

  if (!pool.length) return null;

  // Prefer nopad main hero image
  pool.sort(function (a, b) {
    const score = function (u) {
      let s = 0;
      if (u.includes("_main_1-30_nopad")) s += 100;
      if (u.includes("_main_1-30")) s += 80;
      if (u.includes("_main_1")) s += 60;
      if (u.includes("_main_")) s += 40;
      if (u.includes("_a_main")) s += 20;
      return s;
    };
    return score(b) - score(a);
  });

  return pool[0];
}

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.michelin.co.uk/",
    },
  });
  if (!res.ok) throw new Error("Download failed " + res.status);

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("File too small (" + buf.length + " bytes)");

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const report = {
    success: [],
    failed: [],
  };

  for (const product of products) {
    const dest = path.join(OUT_DIR, product.id + ".webp");
    process.stdout.write("Processing " + product.id + "... ");

    try {
      const html = await fetchHtml(product.url);
      const imageUrl = pickProductImage(html, product);

      if (!imageUrl) {
        report.failed.push({ id: product.id, reason: "No official product image URL found on page" });
        console.log("NOT FOUND");
        continue;
      }

      const bytes = await downloadFile(imageUrl, dest);
      report.success.push({ id: product.id, url: imageUrl, bytes: bytes, dest: dest });
      console.log("OK (" + Math.round(bytes / 1024) + " KB)");
    } catch (err) {
      report.failed.push({ id: product.id, reason: err.message });
      console.log("ERROR:", err.message);
    }
  }

  console.log("\n--- Report ---");
  console.log("Success:", report.success.length);
  report.success.forEach(function (item) {
    console.log("  ✓", item.id, "->", path.relative(ROOT, item.dest));
  });
  console.log("Failed:", report.failed.length);
  report.failed.forEach(function (item) {
    console.log("  ✗", item.id, "-", item.reason);
  });

  fs.writeFileSync(
    path.join(OUT_DIR, "download-report.json"),
    JSON.stringify(report, null, 2),
    "utf8"
  );
}

main();
