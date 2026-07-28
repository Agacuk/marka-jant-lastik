"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const BRANDS_DIR = path.join(ROOT, "assets", "images", "brands");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const WVL = "https://cdn.worldvectorlogo.com/logos";

const brandConfig = {
  michelin: {
    source: "local:brand-michelin.svg",
    clean: ["white-bg", "michelin-recolor"],
    note: "SVG Repo — arka plan kaldırıldı, beyaz Bibendum",
  },
  goodyear: {
    source: "local:brand-goodyear.svg",
    clean: ["white-bg"],
    note: "SVG Repo — beyaz kutu kaldırıldı",
  },
  pirelli: {
    source: "local:brand-pirelli.svg",
    clean: ["white-bg"],
    note: "SVG Repo — beyaz kutu kaldırıldı",
  },
  continental: {
    source: "local:brand-continental.svg",
    clean: ["continental-bg"],
    note: "SVG Repo — turuncu kare kaldırıldı",
  },
  bridgestone: {
    source: "local:brand-bridgestone.svg",
    clean: ["dark-to-light"],
    note: "Resmi vektör — koyu metin açık temaya uyarlandı",
  },
  hankook: {
    source: "url:https://asset.hankooktire.com/content/dam/hankooktire/local/svg/logo-white.svg",
    clean: [],
    note: "Resmi Hankook logo-white.svg",
  },
  yokohama: {
    source: "url:" + WVL + "/yokohama.svg",
    clean: ["white-bg"],
    note: "Resmi vektör — beyaz kutu kaldırıldı",
  },
  bfgoodrich: {
    source: "url:" + WVL + "/bfgoodrich-1.svg",
    clean: [],
    note: "Resmi vektör — şeffaf arka plan",
  },
  kumho: {
    source: "local:brand-kumho.svg",
    clean: ["kumho-wordmark"],
    note: "Marka kırmızısı wordmark — resmi SVG vektörü erişilemedi",
  },
  nexen: {
    source: "url:" + WVL + "/nexen-1.svg",
    clean: ["white-bg", "nexen-recolor"],
    note: "Resmi vektör — marka mavisi (#005BAC)",
  },
  lassa: {
    source: "local:lassa-seeklogo.svg",
    clean: ["lassa-recolor"],
    note: "Resmi vektör — Lassa kırmızısı (#E30613)",
  },
  petlas: {
    source: "local:brand-petlas.svg",
    clean: ["petlas-recolor"],
    note: "Resmi vektör — açık tema için beyaz",
  },
  starmaxx: {
    source: "local:brand-starmaxx.svg",
    clean: ["starmaxx-wordmark"],
    note: "Marka turuncusu wordmark — resmi SVG vektörü erişilemedi",
  },
};

async function loadSource(spec) {
  if (spec.startsWith("local:")) {
    const file = path.join(BRANDS_DIR, spec.slice(6));
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file, "utf8");
  }
  if (spec.startsWith("url:")) {
    const res = await fetch(spec.slice(4), { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const text = await res.text();
    return text.includes("<svg") ? text : null;
  }
  return null;
}

function removeWhiteBackground(svg) {
  return svg
    .replace(/<path[^>]*fill="#fff(?:fff)?"[^>]*d="M0 0h[^"]+"[^>]*\/>/gi, "")
    .replace(/<path[^>]*fill="#fff(?:fff)?"[^>]*d="M0 0[^"]+"[^>]*\/>/gi, "")
    .replace(/<path[^>]*d="M0 0h[^"]+"[^>]*fill="#fff(?:fff)?"[^>]*\/>/gi, "")
    .replace(/<path[^>]*d="M0 0[^"]+"[^>]*fill="#fff(?:fff)?"[^>]*\/>/gi, "");
}

function removeContinentalBg(svg) {
  return svg
    .replace(/<path[^>]*fill="#f90"[^>]*d="M8\.944[^"]+"[^>]*\/>/gi, "")
    .replace(/<path[^>]*d="M8\.944 8\.428[^"]+"[^>]*fill="#f90"[^>]*\/>/gi, "");
}

function darkToLight(svg) {
  return svg
    .replace(/fill="#231815"/gi, 'fill="#ffffff"')
    .replace(/style="fill:#231815/gi, 'style="fill:#ffffff');
}

function recolorLassa(svg) {
  return svg.replace(/fill="#000000"/gi, 'fill="#E30613"');
}

function recolorPetlas(svg) {
  return svg.replace(/fill="#000000"/gi, 'fill="#ffffff"');
}

function recolorNexen(svg) {
  let out = svg;
  out = out.replace(/<path(?![^>]*fill=)([^>]*d="[^"]+"[^>]*)\/>/gi, '<path fill="#005BAC"$1/>');
  out = out.replace(/<path d="/gi, '<path fill="#005BAC" d="');
  out = out.replace(/fill="#005BAC" fill="#005BAC"/gi, 'fill="#005BAC"');
  return out;
}

function recolorKumho(svg) {
  return svg
    .replace(/fill="#000000"/gi, 'fill="#E31937"')
    .replace(/fill="#231815"/gi, 'fill="#E31937"');
}

function kumhoWordmark() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 72" role="img" aria-label="Kumho">
  <text x="160" y="50" fill="#E31937" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" text-anchor="middle" letter-spacing="0.14em">KUMHO</text>
</svg>`;
}

function starmaxxWordmark() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" role="img" aria-label="Starmaxx">
  <text x="180" y="50" fill="#F5A623" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="800" text-anchor="middle" letter-spacing="0.08em">STARMAXX</text>
</svg>`;
}

function recolorStarmaxxPlaceholder(svg) {
  if (svg.includes("STARMAXX") && svg.includes("Montserrat")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80" role="img" aria-label="Starmaxx">
  <text x="180" y="54" fill="#F5A623" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" text-anchor="middle" letter-spacing="0.06em">STARMAXX</text>
</svg>`;
  }
  return svg.replace(/fill="#000000"/gi, 'fill="#F5A623"');
}

function recolorMichelin(svg) {
  return svg.replace(/<path(?![^>]*fill=)([^>]*)\/>/gi, '<path fill="#ffffff"$1/>');
}

function normalizeSvg(svg) {
  let out = svg.trim();
  if (!out.includes('xmlns="http://www.w3.org/2000/svg"')) {
    out = out.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  out = out.replace(/width="2500" height="2500"/g, "");
  out = out.replace(/width="800px" height="800px"/g, "");
  return out;
}

function processSvg(svg, cleanSteps) {
  let out = normalizeSvg(svg);
  for (const step of cleanSteps) {
    if (step === "white-bg") out = removeWhiteBackground(out);
    if (step === "continental-bg") out = removeContinentalBg(out);
    if (step === "dark-to-light") out = darkToLight(out);
    if (step === "michelin-recolor") out = recolorMichelin(out);
    if (step === "lassa-recolor") out = recolorLassa(out);
    if (step === "petlas-recolor") out = recolorPetlas(out);
    if (step === "nexen-recolor") out = recolorNexen(out);
    if (step === "kumho-wordmark") out = kumhoWordmark();
    if (step === "starmaxx-wordmark") out = starmaxxWordmark();
    if (step === "kumho-recolor") out = recolorKumho(out);
    if (step === "starmaxx-recolor") out = recolorStarmaxxPlaceholder(out);
  }
  return out;
}

async function buildBrand(id, config) {
  let svg = await loadSource(config.source);
  let sourceUsed = config.source;

  if (!svg && config.fallback) {
    svg = await loadSource(config.fallback);
    sourceUsed = config.fallback;
  }

  if (!svg) throw new Error("No source available");

  const processed = processSvg(svg, config.clean || []);
  const dest = path.join(BRANDS_DIR, "brand-" + id + ".svg");
  fs.writeFileSync(dest, processed, "utf8");
  return { dest, sourceUsed, note: config.note };
}

async function main() {
  const report = { success: [], failed: [], manual: [] };

  for (const [id, config] of Object.entries(brandConfig)) {
    process.stdout.write("brand-" + id + "... ");
    try {
      const result = await buildBrand(id, config);
      report.success.push({ id, ...result, note: config.note });
      console.log("OK");
    } catch (err) {
      report.failed.push({ id, reason: err.message });
      console.log("FAIL", err.message);
    }
  }

  fs.writeFileSync(path.join(BRANDS_DIR, "logo-build-report.json"), JSON.stringify(report, null, 2));
  console.log("\nBuilt:", report.success.length, "Failed:", report.failed.length);
}

main();
