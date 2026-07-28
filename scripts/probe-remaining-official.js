"use strict";
const https = require("https");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

function get(url, referer) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA, Accept: "*/*", ...(referer ? { Referer: referer } : {}) } }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        resolve({ status: res.statusCode, type: res.headers["content-type"], len: buf.length, head: buf.toString("utf8", 0, 150), final: res.headers.location });
      });
    }).on("error", reject);
  });
}

async function page(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA, Accept: "text/html" } }, (res) => {
      let html = "";
      res.on("data", (c) => (html += c));
      res.on("end", () => resolve({ status: res.statusCode, html }));
    }).on("error", reject);
  });
}

(async () => {
  const urls = [
    ["bs1", "https://www.bridgestone.com/etc/images/logos/bridgestone-logo-set-en.svg", "https://www.bridgestone.com/"],
    ["bs2", "https://www.bridgestone.com/etc/images/logos/bridgestone-logo-set.svg", "https://www.bridgestone.com/"],
    ["bs3", "https://tires.bridgestone.com/etc/images/logos/bridgestone-logo-set-en.svg", "https://tires.bridgestone.com/"],
    ["bs4", "https://www.bridgestone.com/content/dam/bridgestone/common/logo/bridgestone-logo-white.svg", "https://www.bridgestone.com/"],
    ["bs5", "https://www.bridgestone.com/content/dam/bridgestone/consumer/common/logo/bridgestone-logo.svg", "https://www.bridgestone.com/"],
    ["bfg1", "https://www.bfgoodrich.com/etc.clientlibs/bfgoodrich/clientlibs/clientlib-site/resources/images/logo.svg", "https://www.bfgoodrich.com/"],
    ["bfg2", "https://www.bfgoodrich.co.uk/etc.clientlibs/bfgoodrich/clientlibs/clientlib-site/resources/images/logo.svg", "https://www.bfgoodrich.co.uk/"],
    ["bfg3", "https://www.bfgoodrich.com/content/dam/bfgoodrich/global/logo/bfgoodrich-logo.svg", "https://www.bfgoodrich.com/"],
    ["petlas1", "https://www.petlas.com.tr/", null],
    ["starmaxx1", "https://www.starmaxx.com.tr/", null],
    ["conti-footer", "https://www.continental-tires.com/content/experience-fragments/conti-tires-cms/ww/en/site/footer/master/_jcr_content/root/container_bottom/image.coreimg.svg/1676361234567/continental-logo.svg", "https://www.continental-tires.com/"],
  ];

  for (const [name, url, ref] of urls) {
    if (name === "petlas1" || name === "starmaxx1") {
      const p = await page(url);
      const logos = [...p.html.matchAll(/(?:src|href|content)=["']([^"']*(?:logo|brand)[^"']*\.(?:svg|png|webp))["']/gi)].map((m) => m[1]);
      console.log(name, p.status, url, "\n ", [...new Set(logos)].slice(0, 15).join("\n  "));
      continue;
    }
    const r = await get(url, ref);
    console.log(name, r.status, r.type, r.len, r.head.replace(/\s+/g, " ").slice(0, 80));
  }
})();
