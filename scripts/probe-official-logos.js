"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function get(url) {
  const r = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
  });
  return { status: r.status, url: r.url, html: await r.text() };
}

async function head(url, referer) {
  const headers = { "User-Agent": UA };
  if (referer) headers.Referer = referer;
  const r = await fetch(url, { method: "GET", headers });
  const buf = Buffer.from(await r.arrayBuffer());
  return { status: r.status, type: r.headers.get("content-type"), len: buf.length, isSvg: buf.toString("utf8", 0, 200).includes("<svg") };
}

function extractLogos(html, base) {
  const out = new Set();
  const patterns = [
    /https?:\/\/[^"'\s<>\\]+\.(?:svg|png|webp)/gi,
    /(?:src|href|content|data-src)="(\/[^"']+\.(?:svg|png|webp))"/gi,
    /url\(['"]?([^)'"]+\.(?:svg|png|webp))['"]?\)/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      const u = m[1] || m[0];
      if (/logo|brand|header|footer|identity|press|media|favicon/i.test(u) && !/social|facebook|twitter|instagram|youtube|apple-touch|favicon-16|sprite|icon-/i.test(u)) {
        out.add(u.startsWith("http") ? u : new URL(u, base).href);
      }
    }
  }
  return [...out];
}

const pages = [
  ["michelin", "https://www.michelin.com/en/", "https://www.michelinman.com/"],
  ["goodyear", "https://www.goodyear.eu/en_gb/consumer.html", "https://www.goodyear.com/"],
  ["continental", "https://www.continental-tires.com/", "https://www.continental.com/en/"],
  ["pirelli", "https://www.pirelli.com/tires/en-ww/car", "https://www.pirelli.com/"],
  ["bridgestone", "https://www.bridgestone.com/en-us", "https://tires.bridgestone.com/"],
  ["hankook", "https://www.hankooktire.com/global/en/home.html", "https://www.hankooktire.com/uk/en/home.html"],
  ["kumho", "https://www.kumhotire.com/", "https://www.kumhotire.com/us/"],
  ["nexen", "https://www.nexentire.com/international/", "https://www.nexentire.com/"],
  ["yokohama", "https://www.yokohama.eu/", "https://www.yokohamatire.com/"],
  ["bfgoodrich", "https://www.bfgoodrich.com/", "https://www.bfgoodrich.co.uk/"],
  ["lassa", "https://www.lassa.com.tr/", "https://www.lassa.com.tr/en"],
  ["petlas", "https://www.petlas.com/en/", "https://www.petlas.com/"],
  ["starmaxx", "https://www.starmaxx.com/en/", "https://www.starmaxx.com/"],
];

const directCandidates = [
  ["hankook-white", "https://asset.hankooktire.com/content/dam/hankooktire/local/svg/logo-white.svg", "https://www.hankooktire.com/"],
  ["hankook-logo", "https://asset.hankooktire.com/content/dam/hankooktire/global/logo/logo.svg", "https://www.hankooktire.com/"],
  ["michelin-dam", "https://www.michelin.com/content/dam/michelin/global/b2c/brand/logo-michelin.svg", "https://www.michelin.com/"],
  ["continental-dam", "https://www.continental-tires.com/etc.clientlibs/ctc/clientlibs/clientlib-site/resources/images/continental-logo-white.svg", "https://www.continental-tires.com/"],
  ["goodyear-dam", "https://www.goodyear.eu/content/dam/goodyear/consumer/common/logos/goodyear-logo.svg", "https://www.goodyear.eu/"],
  ["pirelli-dam", "https://www.pirelli.com/content/dam/pirelli/website/logo/pirelli-logo.svg", "https://www.pirelli.com/"],
  ["bridgestone-dam", "https://www.bridgestone.com/etc.clientlibs/bs-corporate/clientlibs/clientlib-site/resources/images/bridgestone-logo-white.svg", "https://www.bridgestone.com/"],
  ["yokohama-img", "https://www.yokohamatire.com/images/yokohama-logo.svg", "https://www.yokohamatire.com/"],
  ["nexen-assets", "https://www.nexentire.com/international/assets/images/common/logo.svg", "https://www.nexentire.com/"],
  ["kumho-logo", "https://www.kumhotire.com/images/common/logo_w.svg", "https://www.kumhotire.com/"],
  ["bfg-dam", "https://www.bfgoodrich.com/etc.clientlibs/bfg/clientlibs/clientlib-site/resources/images/bfgoodrich-logo.svg", "https://www.bfgoodrich.com/"],
  ["lassa-assets", "https://www.lassa.com.tr/Assets/Images/logo-white.svg", "https://www.lassa.com.tr/"],
  ["petlas-storage", "https://www.petlas.com/storage/app/media/logo.svg", "https://www.petlas.com/"],
  ["starmaxx-storage", "https://www.starmaxx.com/storage/app/media/logo.svg", "https://www.starmaxx.com/"],
];

(async () => {
  console.log("=== DIRECT CANDIDATES ===");
  for (const [name, url, ref] of directCandidates) {
    const r = await head(url, ref);
    console.log(name, r.status, r.len, r.isSvg ? "SVG" : r.type, url.split("/").slice(-2).join("/"));
  }

  console.log("\n=== PAGE SCRAPE ===");
  for (const [brand, ...urls] of pages) {
    console.log("\n#" + brand);
    for (const u of urls) {
      try {
        const r = await get(u);
        console.log(" page", r.status, r.url);
        const logos = extractLogos(r.html, r.url).filter((x) => /logo|brand/i.test(x));
        logos.slice(0, 12).forEach((l) => console.log("  ", l.slice(0, 160)));
      } catch (e) {
        console.log(" page ERR", u, e.message);
      }
    }
  }
})();
