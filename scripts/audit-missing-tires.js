"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const dataPath = path.join(ROOT, "assets", "js", "tire-brands-data.js");
const src = fs.readFileSync(dataPath, "utf8");
const brandRe = /id:\s*"([a-z0-9-]+)"[\s\S]*?products:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
const productRe = /product\(\s*"([^"]+)"\s*,\s*"([^"]+)"/g;

const missing = [];
const placeholders = [];
let total = 0;

let bm;
while ((bm = brandRe.exec(src)) !== null) {
  const brandId = bm[1];
  if (brandId === "all") continue;
  const block = bm[2];
  let pm;
  while ((pm = productRe.exec(block)) !== null) {
    const [, b, id] = pm;
    if (b !== brandId) continue;
    total++;
    const line = pm.input.slice(pm.index, pm.index + 220);
    const hasWebp = /,\s*"webp"\s*\)/.test(line);
    const webpPath = path.join(ROOT, "assets", "images", "tires", b, id + ".webp");
    const svgPath = path.join(ROOT, "assets", "images", "tires", b, id + ".svg");
    if (!hasWebp) missing.push(b + "/" + id + " (no webp flag)");
    if (!fs.existsSync(webpPath)) missing.push(b + "/" + id + " (no webp file)");
    if (fs.existsSync(svgPath) && fs.existsSync(webpPath)) placeholders.push(svgPath);
  }
}

for (const svg of placeholders) fs.unlinkSync(svg);
console.log("Total products:", total);
console.log("Issues:", missing.length ? missing.join("\n") : "none");
console.log("Removed placeholder SVGs:", placeholders.length);
