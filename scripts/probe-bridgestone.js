"use strict";
const https = require("https");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

function page(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": UA, Accept: "text/html" } }, (res) => {
      let html = "";
      res.on("data", (c) => (html += c));
      res.on("end", () => resolve(html));
    }).on("error", reject);
  });
}

(async () => {
  const urls = [
    "https://tires.bridgestone.com/en-us/index",
    "https://www.bridgestone.com/en/",
    "https://www.bridgestone.com/etc/designs/bridgestone/clientlibs/common/images/logo.svg",
    "https://www.bridgestone.com/content/dam/bridgestone/common/logo/bridgestone-logo.svg",
  ];
  const html = await page(urls[0]);
  // find all image/src/href with svg/png
  const all = [...html.matchAll(/(?:src|href|data-src|content)=["']([^"']+)["']/gi)].map((m) => m[1]);
  const filtered = all.filter((u) => /logo|brand|header|svg|png|webp/i.test(u) && !/social|icon-|sprite|favicon/i.test(u));
  console.log("tires.bridgestone filtered:");
  [...new Set(filtered)].slice(0, 40).forEach((u) => console.log(u));

  // search for bridgestone in inline styles/JS
  const inline = [...html.matchAll(/bridgestone[^"'\s]{0,80}\.(?:svg|png)/gi)].map((m) => m[0]);
  console.log("\ninline matches:", [...new Set(inline)]);

  const html2 = await page("https://www.bridgestone.com/en/");
  const all2 = [...html2.matchAll(/(?:src|href)=["']([^"']+)["']/gi)].map((m) => m[1]).filter((u) => /logo|brand|bridgestone.*\.(svg|png)/i.test(u));
  console.log("\nbridgestone.com/en:");
  [...new Set(all2)].slice(0, 30).forEach((u) => console.log(u));
})();
