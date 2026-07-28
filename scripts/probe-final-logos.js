"use strict";
const https = require("https");
const fs = require("fs");
const path = require("path");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

function get(url, referer) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA, Accept: "*/*", Referer: referer || url } }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks), type: res.headers["content-type"] }));
    }).on("error", reject);
  });
}

function page(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA } }, (res) => {
      let html = "";
      res.on("data", (c) => (html += c));
      res.on("end", () => resolve(html));
    }).on("error", reject);
  });
}

(async () => {
  const out = path.join(__dirname, "..", "assets", "images", "brands");

  const tests = [
    ["conti-small", "https://www.continental-tires.com/content/dam/conti-tires-cms/sample-content/sample-images/logo_smaller.svg", "https://www.continental-tires.com/"],
    ["bfg-cloud", "https://adzktgbqdq.cloudimg.io/https://dgaddcosprod.blob.core.windows.net/cxf-multisite/p1cvdey47wu05u3uupp264bk/attachments/bqaijdrrn46bzb2yhe2isecm-f99zw1xls1vqokk8yiyv2g5i-66f971b8-db1f-4f26-8c65-23c6ab210c3f.full.png", "https://www.bfgoodrich.co.uk/"],
    ["gy-bfg", "https://www.goodyear.eu/content/dam/goodyear/consumer/common/navigation/bfgoodrich-logo.png", "https://www.goodyear.eu/"],
    ["gy-bfg2", "https://www.goodyear.eu/content/dam/goodyear/consumer/common/navigation/bfgoodrich-logo-transparent.png", "https://www.goodyear.eu/"],
  ];

  for (const [name, url, ref] of tests) {
    const r = await get(url, ref);
    const sample = r.buf.toString("utf8", 0, 400);
    console.log(name, r.status, r.type, r.buf.length);
    console.log(sample.replace(/\s+/g, " ").slice(0, 200));
    if (r.status === 200 && r.buf.length > 500) {
      fs.writeFileSync(path.join(out, `test-${name}.${sample.includes("<svg") ? "svg" : "png"}`), r.buf);
    }
  }

  const html = await page("https://www.bridgestone.com/corporate/brand/index.html");
  const logos = [...html.matchAll(/https?:\/\/[^"'\s<>\\]+\.(?:svg|png|jpg)/gi)].map((m) => m[0]).filter((u) => /logo|brand|bridgestone|identity/i.test(u));
  console.log("\nBridgestone brand page logos:");
  [...new Set(logos)].forEach((u) => console.log(u));

  const html2 = await page("https://www.bridgestone.com/corporate/brand/message/index.html");
  const logos2 = [...html2.matchAll(/https?:\/\/[^"'\s<>\\]+\.(?:svg|png|jpg|zip|pdf)/gi)].map((m) => m[0]).filter((u) => /logo|brand|bridgestone|download|asset|identity|guideline/i.test(u));
  console.log("\nBridgestone message page:");
  [...new Set(logos2)].slice(0, 30).forEach((u) => console.log(u));
})();
