"use strict";
const https = require("https");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" } }, (res) => {
      let html = "";
      res.on("data", (c) => (html += c));
      res.on("end", () => resolve({ status: res.statusCode, html, url }));
    }).on("error", reject);
  });
}

function fetchAsset(url, referer) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA, Accept: "*/*", Referer: referer || url } }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        resolve({ status: res.statusCode, type: res.headers["content-type"], len: buf.length, isSvg: buf.toString("utf8", 0, 200).includes("<svg"), sample: buf.toString("utf8", 0, 300) });
      });
    }).on("error", reject);
  });
}

function extract(html, base) {
  const out = new Set();
  const re = /(?:src|href|content|data-src|srcset)=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    let u = m[1].split(" ")[0].split(",")[0];
    if (/logo|brand|header|footer|identity|svg|png/i.test(u) && !/social|facebook|twitter|instagram|youtube|sprite|favicon|icon-/i.test(u)) {
      if (!u.startsWith("http")) u = new URL(u, base).href;
      out.add(u);
    }
  }
  return [...out];
}

(async () => {
  const pages = [
    ["continental", "https://www.continental-tires.com/"],
    ["bridgestone-tires", "https://tires.bridgestone.com/en-us/index"],
    ["bridgestone-corp", "https://www.bridgestone.com/en/corporate"],
    ["bfg-uk", "https://www.bfgoodrich.co.uk/"],
    ["bfg-us", "https://www.bfgoodrich.com/"],
    ["goodyear-eu-bfg", "https://www.goodyear.eu/en_gb/consumer.html"],
  ];

  for (const [name, url] of pages) {
    const p = await fetchPage(url);
    const logos = extract(p.html, url).filter((u) => /\.(svg|png|webp)/i.test(u) || /logo|brand|coreimg/i.test(u));
    console.log("\n=== " + name + " ===");
    logos.slice(0, 25).forEach((u) => console.log(u));
  }

  // Test specific continental footer variants
  const contiTests = [
    "https://www.continental-tires.com/content/experience-fragments/conti-tires-cms/ww/en/site/footer/master/_jcr_content/root/container_bottom/image.coreimg.svg/1676361234567/continental-logo.svg",
    "https://www.continental-tires.com/content/dam/conti-tires-cms/sample-content/sample-images/logo_smaller.svg",
    "https://www.continental-tires.com/content/dam/conti-tires-cms/continental/brand/basics/Continental_Logo_Black.svg",
    "https://www.continental-tires.com/content/dam/conti-tires-cms/continental/brand/basics/Continental_Logo_White.svg",
    "https://www.continental-tires.com/content/dam/conti-tires-cms/continental/brand/basics/Continental_Logo_Inverted.svg",
  ];
  console.log("\n=== CONTI ASSET TEST ===");
  for (const u of contiTests) {
    const r = await fetchAsset(u, "https://www.continental-tires.com/");
    console.log(r.status, r.len, r.isSvg, u.split("/").pop());
    if (r.isSvg && r.len > 500) console.log(r.sample.replace(/\s+/g, " ").slice(0, 200));
  }
})();
