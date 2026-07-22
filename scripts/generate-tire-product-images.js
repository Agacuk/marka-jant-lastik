/**
 * Generates premium-style tire product SVG images per brand folder.
 * Run: node scripts/generate-tire-product-images.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "assets", "js", "tire-brands-data.js");

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function tireSvg(productId, productName, brandHue) {
  const seed = hashSeed(productId);
  const accent = brandHue || seed % 360;
  const treadCount = 8 + (seed % 6);
  const treadLines = [];

  for (let i = 0; i < treadCount; i += 1) {
    const angle = (i / treadCount) * Math.PI * 2;
    const x1 = 240 + Math.cos(angle) * 88;
    const y1 = 228 + Math.sin(angle) * 52;
    const x2 = 240 + Math.cos(angle) * 148;
    const y2 = 228 + Math.sin(angle) * 88;
    treadLines.push(
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="hsl(${accent}, 18%, 28%)" stroke-width="3" stroke-linecap="round"/>`
    );
  }

  const grooves = [];
  for (let g = 0; g < 5; g += 1) {
    const offset = -40 + g * 20 + (seed % 8);
    grooves.push(
      `<path d="M ${92 + offset} 228 Q 240 ${188 + (seed % 12)} ${388 - offset} 228" fill="none" stroke="hsl(${accent}, 12%, 22%)" stroke-width="2.5" opacity="0.85"/>`
    );
  }

  const label = productName.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480" fill="none">
  <defs>
    <linearGradient id="bg-${productId}" x1="0" y1="0" x2="480" y2="480" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#16161e"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </linearGradient>
    <radialGradient id="spot-${productId}" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="hsl(${accent}, 35%, 22%)" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="hsl(${accent}, 20%, 8%)" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rubber-${productId}" x1="120" y1="160" x2="360" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#2a2a34"/>
      <stop offset="45%" stop-color="#1a1a22"/>
      <stop offset="100%" stop-color="#121218"/>
    </linearGradient>
    <linearGradient id="shine-${productId}" x1="160" y1="140" x2="300" y2="260" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="480" height="480" fill="url(#bg-${productId})"/>
  <rect width="480" height="480" fill="url(#spot-${productId})"/>
  <ellipse cx="240" cy="248" rx="168" ry="108" fill="#08080c" opacity="0.55"/>
  <ellipse cx="240" cy="228" rx="156" ry="96" fill="url(#rubber-${productId})" stroke="#2e2e3a" stroke-width="2"/>
  <ellipse cx="240" cy="228" rx="132" ry="80" fill="none" stroke="hsl(${accent}, 22%, 32%)" stroke-width="1.5" opacity="0.6"/>
  ${grooves.join("\n  ")}
  ${treadLines.join("\n  ")}
  <ellipse cx="240" cy="228" rx="72" ry="44" fill="#0e0e14" stroke="#333340" stroke-width="2"/>
  <ellipse cx="240" cy="228" rx="48" ry="28" fill="#181820" stroke="hsl(${accent}, 30%, 38%)" stroke-width="1.5" opacity="0.7"/>
  <ellipse cx="240" cy="228" rx="156" ry="96" fill="url(#shine-${productId})"/>
  <text x="240" y="392" fill="rgba(255,255,255,0.42)" font-family="Montserrat, Arial, sans-serif" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="0.06em">${label}</text>
</svg>`;
}

function extractProductsFromData(source) {
  const brands = [];
  const brandBlocks = source.split(/\{\s*\n\s*id:\s*"/).slice(1);

  brandBlocks.forEach(function (block) {
    const idMatch = block.match(/^([^"]+)"/);
    if (!idMatch) return;

    const brandId = idMatch[1];
    const products = [];
    const productRegex = /product\(\s*"[^"]+"\s*,\s*"([^"]+)"\s*,\s*"((?:\\"|[^"])*)"/g;
    let productMatch;

    while ((productMatch = productRegex.exec(block)) !== null) {
      products.push({
        id: productMatch[1],
        name: productMatch[2].replace(/\\"/g, '"'),
      });
    }

    if (products.length) {
      brands.push({ brandId, products });
    }
  });

  return brands;
}

function main() {
  const source = fs.readFileSync(DATA_FILE, "utf8");
  const brands = extractProductsFromData(source);
  let created = 0;

  brands.forEach(function (brand, brandIndex) {
    const brandDir = path.join(ROOT, "assets", "images", "tires", brand.brandId);
    fs.mkdirSync(brandDir, { recursive: true });

    brand.products.forEach(function (product) {
      const filePath = path.join(brandDir, product.id + ".svg");
      const hue = (brandIndex * 47 + hashSeed(product.id)) % 360;
      fs.writeFileSync(filePath, tireSvg(product.id, product.name, hue), "utf8");
      created += 1;
    });
  });

  console.log("Created " + created + " tire product images across " + brands.length + " brands.");
}

main();
