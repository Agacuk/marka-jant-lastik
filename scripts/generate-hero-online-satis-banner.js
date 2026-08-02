/**
 * Online Satış hero banner — hero-online-satis-ref.png
 * Run: node scripts/generate-hero-online-satis-banner.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const REF = path.join(ROOT, "assets", "images", "hero", "hero-online-satis-ref.png");
const OUT_DESKTOP = path.join(ROOT, "assets", "images", "hero", "hero-sahibinden-banner.webp");
const OUT_MOBILE = path.join(ROOT, "assets", "images", "hero", "hero-sahibinden-banner-mobile.webp");

function coverCropRect(w, h, tw, th, fx, fy) {
  const targetAspect = tw / th;
  const sourceAspect = w / h;
  let cropW;
  let cropH;

  if (sourceAspect > targetAspect) {
    cropH = h;
    cropW = Math.round(h * targetAspect);
  } else {
    cropW = w;
    cropH = Math.round(w / targetAspect);
  }

  const left = Math.round(Math.max(0, Math.min(w - cropW, fx * w - cropW / 2)));
  const top = Math.round(Math.max(0, Math.min(h - cropH, fy * h - cropH / 2)));

  return { left, top, width: cropW, height: cropH };
}

async function processHero(buf, options) {
  const tw = options.width;
  const th = options.height;
  const focus = options.focus;
  const leftCut = options.leftCut || 0;

  const meta = await sharp(buf).metadata();
  const cropLeft = Math.round(meta.width * leftCut);
  const sliceW = meta.width - cropLeft;

  const sliced = await sharp(buf)
    .extract({ left: cropLeft, top: 0, width: sliceW, height: meta.height })
    .toBuffer();

  const sm = await sharp(sliced).metadata();
  const region = coverCropRect(sm.width, sm.height, tw, th, focus[0], focus[1]);

  const overlay = Buffer.from(
    `<svg width="${tw}" height="${th}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#06080f" stop-opacity="0.78"/>
          <stop offset="24%" stop-color="#080a12" stop-opacity="0.32"/>
          <stop offset="52%" stop-color="#080a12" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#06080f" stop-opacity="0"/>
          <stop offset="100%" stop-color="#090909" stop-opacity="0.4"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#l)"/>
      <rect width="100%" height="100%" fill="url(#b)"/>
    </svg>`
  );

  return sharp(sliced)
    .extract(region)
    .resize(tw, th)
    .modulate({ brightness: 0.92, saturation: 0.95 })
    .composite([{ input: overlay, blend: "multiply" }])
    .webp({ quality: 88, effort: 5 })
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(REF)) {
    console.error("Missing reference:", REF);
    process.exit(1);
  }

  const ref = fs.readFileSync(REF);
  const meta = await sharp(ref).metadata();

  const desktop = await processHero(ref, {
    width: 1920,
    height: 1080,
    leftCut: 0,
    focus: [0.58, 0.5],
  });

  const mobile = await processHero(ref, {
    width: 1080,
    height: 720,
    leftCut: 0.18,
    focus: [0.5, 0.52],
  });

  fs.writeFileSync(OUT_DESKTOP, desktop);
  fs.writeFileSync(OUT_MOBILE, mobile);

  console.log("Source:", path.relative(ROOT, REF), meta.width + "x" + meta.height);
  console.log("Written:", path.relative(ROOT, OUT_DESKTOP), "(" + desktop.length + " bytes)");
  console.log("Written:", path.relative(ROOT, OUT_MOBILE), "(" + mobile.length + " bytes)");
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
