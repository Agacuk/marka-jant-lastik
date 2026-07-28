"use strict";
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets", "images", "brands");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" role="img" aria-label="Logo placeholder">
  <rect width="240" height="48" fill="none"/>
  <text x="120" y="30" text-anchor="middle" fill="#6b7280" font-family="system-ui,sans-serif" font-size="14">Logo</text>
</svg>`;

/** @type {Record<string, {url:string, source:string, referer?:string, theme?:string}>} */
const OFFICIAL = {
  michelin: {
    url: "https://www.michelinman.com/public/themes/michelin-commercial/assets/images/logos/svg/logo-brand-color.svg",
    source: "michelinman.com",
  },
  goodyear: {
    url: "https://www.goodyear.com/_next/static/media/primary-dark-brand-logo.2bpgmlh3ffhwu.svg",
    source: "goodyear.com (official dark theme)",
    theme: "dark",
  },
  continental: {
    url: "https://www.continental-tires.com/content/experience-fragments/conti-tires-cms/ww/en/site/footer/master/_jcr_content/root/container_bottom/image.coreimg.svg/1676361234567/continental-logo.svg",
    source: "continental-tires.com (official footer SVG, orange on transparent)",
    referer: "https://www.continental-tires.com/",
  },
  pirelli: {
    url: "https://binaries.pirelli.com/common/Logo_Pirelli150.png",
    source: "pirelli.com binaries CDN",
    referer: "https://www.pirelli.com/",
  },
  bridgestone: {
    url: "https://www.bridgestone.com/bwsc/assets/img/common/logo_header_en_m.png",
    source: "bridgestone.com (official corporate site asset)",
    referer: "https://www.bridgestone.com/",
  },
  hankook: {
    url: "https://asset.hankooktire.com/content/dam/hankooktire/local/svg/logo-white.svg",
    source: "hankooktire.com asset CDN (official white logo)",
    theme: "dark",
  },
  kumho: {
    url: "https://kumhotireusa.com/kumho-logo.png",
    source: "kumhotireusa.com",
    referer: "https://kumhotireusa.com/",
  },
  nexen: {
    url: "https://www.nexentire.com/international/assets/images/common/logo.png",
    source: "nexentire.com",
    referer: "https://www.nexentire.com/",
  },
  yokohama: {
    url: "https://ytc-bm.s3.us-east-2.amazonaws.com/YK-Logo-Wht.png",
    source: "yokohamatire.com official S3 (white logo)",
    referer: "https://www.yokohamatire.com/",
    theme: "dark",
  },
  lassa: {
    url: "https://www.lassa.com.tr/Dosyalar/content/lassa_logo_og.png",
    source: "lassa.com.tr",
    referer: "https://www.lassa.com.tr/",
  },
  bfgoodrich: {
    url: "https://adzktgbqdq.cloudimg.io/https://dgaddcosprod.blob.core.windows.net/cxf-multisite/p1cvdey47wu05u3uupp264bk/attachments/bqaijdrrn46bzb2yhe2isecm-f99zw1xls1vqokk8yiyv2g5i-66f971b8-db1f-4f26-8c65-23c6ab210c3f.full.png",
    source: "bfgoodrich.co.uk (official site CDN)",
    referer: "https://www.bfgoodrich.co.uk/",
  },
};

const BRAND_IDS = [
  "michelin", "continental", "goodyear", "pirelli", "bridgestone", "lassa", "petlas",
  "hankook", "kumho", "nexen", "yokohama", "bfgoodrich", "starmaxx",
];

function fetchBuffer(url, referer) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib.get(
      url,
      { headers: { "User-Agent": UA, Accept: "*/*", ...(referer ? { Referer: referer } : {}) } },
      (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
          fetchBuffer(new URL(res.headers.location, url).href, referer).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            type: res.headers["content-type"] || "",
            buf: Buffer.concat(chunks),
          })
        );
      }
    ).on("error", reject);
  });
}

function isSvg(buf) {
  const head = buf.toString("utf8", 0, 300);
  return head.includes("<svg") || (head.includes("<?xml") && head.includes("svg"));
}

function pngHasOpaqueRgb(buf) {
  if (buf.length < 26 || buf[0] !== 0x89) return false;
  const colorType = buf[25];
  return colorType === 2; // RGB without alpha
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const f of fs.readdirSync(OUT)) {
    const fp = path.join(OUT, f);
    if (fs.statSync(fp).isFile()) fs.unlinkSync(fp);
  }

  const report = { svg: [], darkLight: [], notFound: [], manual: [], details: {} };

  for (const id of BRAND_IDS) {
    const cfg = OFFICIAL[id];
    if (!cfg) {
      fs.writeFileSync(path.join(OUT, `brand-${id}.svg`), PLACEHOLDER_SVG);
      report.notFound.push(id);
      report.details[id] = { status: "placeholder", reason: "Resmi logo URL doğrulanamadı (site 403 veya asset bulunamadı)" };
      continue;
    }

    try {
      const r = await fetchBuffer(cfg.url, cfg.referer);
      if (r.status !== 200 || r.buf.length < 100 || r.type.includes("text/html")) {
        fs.writeFileSync(path.join(OUT, `brand-${id}.svg`), PLACEHOLDER_SVG);
        report.notFound.push(id);
        report.details[id] = { status: "placeholder", reason: `HTTP ${r.status}`, url: cfg.url };
        continue;
      }

      const svg = isSvg(r.buf);
      const ext = svg ? "svg" : "png";
      const fname = `brand-${id}.${ext}`;
      fs.writeFileSync(path.join(OUT, fname), r.buf);

      const whiteBox = !svg && pngHasOpaqueRgb(r.buf);
      report.details[id] = { file: fname, source: cfg.source, url: cfg.url, format: ext, theme: cfg.theme || null, whiteBox };

      if (svg) {
        report.svg.push(id);
      } else {
        report.darkLight.push(id);
      }

      if (whiteBox) {
        report.manual.push(id);
        report.details[id].note = "PNG opak arka planlı olabilir — manuel kontrol gerekli";
      }

      if (id === "lassa") {
        report.manual.push(id);
        report.details[id].note = "Resmi PNG; şeffaflık / koyu zemin uyumu manuel kontrol önerilir";
      }
    } catch (e) {
      fs.writeFileSync(path.join(OUT, `brand-${id}.svg`), PLACEHOLDER_SVG);
      report.notFound.push(id);
      report.details[id] = { status: "placeholder", reason: e.message, url: cfg.url };
    }
  }

  report.manual = [...new Set(report.manual)];
  fs.writeFileSync(path.join(OUT, "official-logo-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
