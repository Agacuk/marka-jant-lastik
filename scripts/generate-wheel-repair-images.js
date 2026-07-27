/**
 * Generates placeholder hero & gallery SVGs for wheel repair sub-services.
 * Run: node scripts/generate-wheel-repair-images.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_PATH = path.join(ROOT, "assets", "js", "wheel-repair-services-data.js");

function loadServices() {
  const source = fs.readFileSync(DATA_PATH, "utf8");
  const services = [];
  const blocks = source.split(/\{\s*\n\s*id:\s*"/).slice(1);

  blocks.forEach(function (block) {
    const idMatch = block.match(/^([^"]+)"/);
    const titleMatch = block.match(/title:\s*"([^"]+)"/);
    const galleryMatch = block.match(/galleryCount:\s*(\d+)/);
    if (!idMatch || !titleMatch) return;
    services.push({
      id: idMatch[1],
      title: titleMatch[1],
      galleryCount: galleryMatch ? Number(galleryMatch[1]) : 6,
    });
  });

  return services;
}

function heroSvg(title, hue) {
  const safe = title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="640" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#14141c"/>
      <stop offset="100%" stop-color="#090909"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="hsl(${hue}, 45%, 38%)" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="hsl(${hue}, 30%, 12%)" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="400" fill="url(#bg)"/>
  <rect width="640" height="400" fill="url(#glow)"/>
  <ellipse cx="320" cy="210" rx="150" ry="92" fill="#101018" stroke="#2a3144" stroke-width="2"/>
  <ellipse cx="320" cy="210" rx="118" ry="72" fill="none" stroke="hsl(${hue}, 35%, 42%)" stroke-width="1.5" opacity="0.7"/>
  <ellipse cx="320" cy="210" rx="56" ry="34" fill="#0c0c12" stroke="#3a4258" stroke-width="2"/>
  <text x="320" y="352" fill="rgba(255,255,255,0.55)" font-family="Montserrat, Arial, sans-serif" font-size="16" font-weight="700" text-anchor="middle">${safe}</text>
</svg>`;
}

function gallerySvg(title, index, hue) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" fill="none">
  <rect width="480" height="360" fill="#101018"/>
  <rect x="24" y="24" width="432" height="312" rx="16" fill="#16161e" stroke="#2a3144" stroke-width="1"/>
  <ellipse cx="240" cy="168" rx="96" ry="58" fill="#0e0e14" stroke="hsl(${hue}, 30%, 38%)" stroke-width="1.5"/>
  <text x="240" y="300" fill="rgba(255,255,255,0.42)" font-family="Montserrat, Arial, sans-serif" font-size="12" font-weight="600" text-anchor="middle">${title} · ${index}</text>
</svg>`;
}

function main() {
  const services = loadServices();
  let count = 0;

  services.forEach(function (service, index) {
    const dir = path.join(ROOT, "assets", "images", "services", service.id);
    fs.mkdirSync(dir, { recursive: true });
    const hue = (index * 41 + 210) % 360;

    fs.writeFileSync(path.join(dir, "hero.svg"), heroSvg(service.title, hue), "utf8");
    count += 1;

    for (let i = 1; i <= service.galleryCount; i += 1) {
      const name = "gallery-" + String(i).padStart(2, "0") + ".svg";
      fs.writeFileSync(path.join(dir, name), gallerySvg(service.title, i, hue), "utf8");
      count += 1;
    }
  });

  console.log("Created " + count + " service images for " + services.length + " services.");
}

main();
