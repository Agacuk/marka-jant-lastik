"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
const WIDTH = 1280;
const HEIGHT = 800;

/** Janta yakın çekim, başlığa uygun gerçek onarım süreci görselleri */
const SERVICES = [
  {
    id: "jant-boyama",
    title: "Jant Boyama",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Rims_painted_(2967657525).jpg",
    focus: "centre",
    note: "Jant sprey boya uygulaması (yakın çekim)",
  },
  {
    id: "jant-kaynagi",
    title: "Jant Kaynağı",
    url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkehMhoz4edcjV-H_lPAppPhSNVlQHxgdIdTcx8eUMsGmAlaepoDvV8qBQRfxPh3qQJ_SiA_sWDENb0C-ly_KXATdrApqKAq69SxlCFaUnKOzipTPCVMW7M4stPOiCgc93mtgDib-n-K6-/s1600/1471.JPG",
    focus: "centre",
    note: "Jant kenarı TIG kaynak onarımı",
  },
  {
    id: "cnc-diamond-cut",
    title: "CNC Diamond Cut",
    url: "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091647-1024x730.jpg",
    focus: "centre",
    note: "CNC diamond cut tornalama — jant yüzey kesimi",
  },
  {
    id: "jant-duzeltme",
    title: "Jant Düzeltme",
    url: "https://wheelrestore.com/wp-content/uploads/2023/10/wr-install-001.webp",
    focus: "centre",
    note: "Jant düzeltme makinesinde onarım",
  },
  {
    id: "jant-tornalama",
    title: "Jant Tornalama",
    url: "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091643-1024x986.jpg",
    focus: "centre",
    note: "CNC tornada jant profil tarama / tornalama",
  },
  {
    id: "jant-kumlama",
    title: "Jant Kumlama",
    url: "https://wheelrestore.com/wp-content/uploads/2024/09/wheel-blasting-machine-filtration.webp",
    focus: "centre",
    note: "Kumlama kabininde jant hazırlığı",
  },
  {
    id: "jant-polisaj",
    title: "Jant Polisaj",
    url: "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091646-1024x807.jpg",
    focus: "centre",
    note: "Parlatılmış jant yüzeyi yakın çekim",
  },
  {
    id: "diger-hizmetler",
    title: "Diğer Hizmetler",
    url: "https://thewheelmedics.co.uk/wp-content/uploads/2023/02/image12.jpg",
    focus: "centre",
    note: "Genel jant restorasyon ve onarım",
  },
];

async function fetchBuf(url) {
  const headers = {
    "User-Agent": UA,
    Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  };
  if (url.includes("wheelsclinic.co.uk")) {
    headers.Referer = "https://www.wheelsclinic.co.uk/";
  }
  const res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error("too small (" + buf.length + " bytes)");
  return buf;
}

async function normalizeHero(buf, focus) {
  const graded = await sharp(buf)
    .rotate()
    .resize(WIDTH, HEIGHT, { fit: "cover", position: focus || "centre" })
    .modulate({ brightness: 0.84, saturation: 0.72 })
    .linear(1.06, -14)
    .toBuffer();

  const overlay = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#09090f" stop-opacity="0.35"/>
        </radialGradient>
        <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#14141c" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#090909" stop-opacity="0.48"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#14141c" fill-opacity="0.1"/>
      <rect width="100%" height="100%" fill="url(#v)"/>
      <rect width="100%" height="100%" fill="url(#b)"/>
    </svg>`
  );

  return sharp(graded)
    .composite([{ input: overlay, blend: "multiply" }])
    .webp({ quality: 86, effort: 5 })
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
