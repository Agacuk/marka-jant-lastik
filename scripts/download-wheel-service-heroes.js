"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
const WIDTH = 1280;
const HEIGHT = 800;

const SERVICES = [
  {
    id: "jant-boyama",
    title: "Jant Boyama",
    url: "https://plus.unsplash.com/premium_photo-1661750334379-2f2b4b1f6ef4?fm=jpg&q=85&w=1920",
    focus: [0.5, 0.45],
    note: "Sprey boya kabininde otomotiv parça boyama (Unsplash)",
  },
  {
    id: "jant-kaynagi",
    title: "Jant Kaynağı",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/TIG_welding.jpg",
    focus: [0.5, 0.45],
    note: "TIG kaynak işlemi (Wikimedia Commons)",
  },
  {
    id: "cnc-diamond-cut",
    title: "CNC Diamond Cut",
    url: "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091647-1024x730.jpg",
    focus: [0.52, 0.46],
    note: "CNC diamond cut tornalama — jant yüzey kesimi",
  },
  {
    id: "jant-duzeltme",
    title: "Jant Düzeltme",
    url: "https://wheelrestore.com/wp-content/uploads/2023/10/wr-install-001.webp",
    focus: [0.5, 0.48],
    note: "Jant düzeltme makinesi / atölye uygulaması",
  },
  {
    id: "jant-tornalama",
    title: "Jant Tornalama",
    url: "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091643-1024x986.jpg",
    focus: [0.55, 0.42],
    note: "CNC tornada jant profil işleme",
  },
  {
    id: "jant-kumlama",
    title: "Jant Kumlama",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Cabine_de_sablage_arena.JPG",
    focus: [0.5, 0.5],
    note: "Kumlama kabini — boya öncesi yüzey hazırlığı (Wikimedia Commons)",
  },
  {
    id: "jant-polisaj",
    title: "Jant Polisaj",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Jaguar_XF_Nevis_%2820%22%29_alloy_wheel.jpg",
    focus: [0.42, 0.52],
    note: "Parlatılmış premium jant yakın çekim (Wikimedia Commons)",
  },
  {
    id: "diger-hizmetler",
    title: "Diğer Hizmetler",
    url: "https://images.pexels.com/photos/32208774/pexels-photo-32208774.jpeg?auto=compress&cs=tinysrgb&w=1920",
    focus: [0.5, 0.42],
    note: "Atölyede lastik/jant onarımı (Pexels)",
  },
];

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function fetchBuf(url) {
  const headers = {
    "User-Agent": UA,
    Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  };
  if (url.includes("prestigewheelcentre.co.uk") || url.includes("wheelrestore.com")) {
    headers.Referer = "https://www.google.com/";
  }

  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(url, { headers, redirect: "follow" });
      if (res.status === 429) {
        await sleep(2500 * (attempt + 1));
        throw new Error("HTTP 429");
      }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 8000) throw new Error("too small (" + buf.length + " bytes)");
      return buf;
    } catch (err) {
      lastError = err;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw lastError;
}

function coverCropRect(w, h, focus) {
  const targetAspect = WIDTH / HEIGHT;
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

  const fx = focus && focus[0] != null ? focus[0] : 0.5;
  const fy = focus && focus[1] != null ? focus[1] : 0.5;
  const left = Math.round(Math.max(0, Math.min(w - cropW, fx * w - cropW / 2)));
  const top = Math.round(Math.max(0, Math.min(h - cropH, fy * h - cropH / 2)));

  return { left, top, width: cropW, height: cropH };
}

async function normalizeHero(buf, focus) {
  const rotated = sharp(buf).rotate();
  const meta = await rotated.metadata();
  const crop = coverCropRect(meta.width, meta.height, focus);

  const graded = await rotated
    .extract(crop)
    .resize(WIDTH, HEIGHT)
    .modulate({ brightness: 0.9, saturation: 0.88 })
    .linear(1.04, -8)
    .toBuffer();

  const overlay = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#09090f" stop-opacity="0.22"/>
        </radialGradient>
        <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#14141c" stop-opacity="0"/>
          <stop offset="100%" stop-color="#090909" stop-opacity="0.38"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
      <rect width="100%" height="100%" fill="url(#b)"/>
    </svg>`
  );

  return sharp(graded)
    .composite([{ input: overlay, blend: "multiply" }])
    .webp({ quality: 88, effort: 5 })
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
      report.push({
        id: service.id,
        status: "ok",
        bytes: webp.length,
        note: service.note,
        source: service.url,
      });
      console.log("OK  " + service.id + " -> hero.webp (" + webp.length + " bytes)");
    } catch (err) {
      report.push({ id: service.id, status: "error", error: err.message, source: service.url });
      console.error("ERR " + service.id + ": " + err.message);
    }

    await sleep(1200);
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
