"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
const WIDTH = 1280;
const HEIGHT = 800;

/** Dark workshop theme — same color grade on every hero */
const SERVICES = [
  {
    id: "jant-boyama",
    title: "Jant Boyama",
    url: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1600",
    focus: "attention",
  },
  {
    id: "jant-kaynagi",
    title: "Jant Kaynağı",
    url: "https://images.pexels.com/photos/2726452/pexels-photo-2726452.jpeg?auto=compress&cs=tinysrgb&w=1600",
    focus: "centre",
  },
  {
    id: "cnc-diamond-cut",
    title: "CNC Diamond Cut",
    url: "https://images.pexels.com/photos/3845485/pexels-photo-3845485.jpeg?auto=compress&cs=tinysrgb&w=1600",
    focus: "centre",
  },
  {
    id: "jant-duzeltme",
    title: "Jant Düzeltme",
    url: "https://images.pexels.com/photos/32208774/pexels-photo-32208774.jpeg?auto=compress&cs=tinysrgb&w=1600",
    focus: "centre",
  },
  {
    id: "jant-tornalama",
    title: "Jant Tornalama",
    url: "https://images.pexels.com/photos/5846270/pexels-photo-5846270.jpeg?auto=compress&cs=tinysrgb&w=1600",
    focus: "centre",
  },
  {
    id: "jant-kumlama",
    title: "Jant Kumlama",
    url: "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=1600",
    focus: "centre",
  },
  {
    id: "jant-polisaj",
    title: "Jant Polisaj",
    url: "https://images.pexels.com/photos/3802517/pexels-photo-3802517.jpeg?auto=compress&cs=tinysrgb&w=1600",
    focus: "centre",
  },
  {
    id: "diger-hizmetler",
    title: "Diğer Hizmetler",
    url: "https://images.pexels.com/photos/4489708/pexels-photo-4489708.jpeg?auto=compress&cs=tinysrgb&w=1600",
    focus: "centre",
  },
];

async function fetchBuf(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*", Referer: "https://www.pexels.com/" },
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error("too small (" + buf.length + " bytes)");
  return buf;
}

async function normalizeHero(buf, focus) {
  const base = sharp(buf).rotate().resize(WIDTH, HEIGHT, {
    fit: "cover",
    position: focus || "centre",
  });

  const graded = await base
    .modulate({ brightness: 0.78, saturation: 0.62 })
    .linear(1.08, -18)
    .toBuffer();

  const overlay = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#09090f" stop-opacity="0.42"/>
        </radialGradient>
        <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#14141c" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#090909" stop-opacity="0.55"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#14141c" fill-opacity="0.12"/>
      <rect width="100%" height="100%" fill="url(#v)"/>
      <rect width="100%" height="100%" fill="url(#b)"/>
    </svg>`
  );

  return sharp(graded)
    .composite([{ input: overlay, blend: "multiply" }])
    .webp({ quality: 84, effort: 5 })
    .toBuffer();
}

async function main() {
  const report = [];

  for (const service of SERVICES) {
    const outDir = path.join(ROOT, "assets", "images", "services", service.id);
    const outPath = path.join(outDir, "hero.webp");
    fs.mkdirSync(outDir, { recursive: true });

    try {
      const raw = await fetchBuf(service.url);
      const webp = await normalizeHero(raw, service.focus);
      fs.writeFileSync(outPath, webp);
      report.push({ id: service.id, status: "ok", bytes: webp.length, path: outPath });
      console.log("OK  " + service.id + " -> hero.webp (" + webp.length + " bytes)");
    } catch (err) {
      report.push({ id: service.id, status: "error", error: err.message });
      console.error("ERR " + service.id + ": " + err.message);
    }
  }

  fs.writeFileSync(
    path.join(ROOT, "assets", "images", "services", "wheel-service-heroes-report.json"),
    JSON.stringify(report, null, 2),
    "utf8"
  );
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
