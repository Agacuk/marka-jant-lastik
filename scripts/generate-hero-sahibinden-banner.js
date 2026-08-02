/**
 * hero-sahibinden-banner.svg -> webp (desktop + mobile)
 * Run: node scripts/generate-hero-sahibinden-banner.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SVG = path.join(ROOT, "assets", "images", "hero", "hero-sahibinden-banner.svg");
const OUT_DESKTOP = path.join(ROOT, "assets", "images", "hero", "hero-sahibinden-banner.webp");
const OUT_MOBILE = path.join(ROOT, "assets", "images", "hero", "hero-sahibinden-banner-mobile.webp");

async function main() {
  const svg = fs.readFileSync(SVG);

  await sharp(svg).resize(1920, 1080).webp({ quality: 86 }).toFile(OUT_DESKTOP);
  await sharp(svg).resize(1080, 720).webp({ quality: 84 }).toFile(OUT_MOBILE);

  console.log("Written:", path.relative(ROOT, OUT_DESKTOP));
  console.log("Written:", path.relative(ROOT, OUT_MOBILE));
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
