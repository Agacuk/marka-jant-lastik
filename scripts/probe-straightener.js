"use strict";

const url = "https://wheelrestore.com/products/electro-hydraulic-wheel-straightener/";

async function main() {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  const re = /(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|webp|png)[^"']*)["']/gi;
  const imgs = [];
  let m;
  while ((m = re.exec(html))) imgs.push(m[1]);
  console.log("status", res.status);
  [...new Set(imgs)]
    .filter(function (i) {
      return !i.includes("flag") && !i.includes("logo") && !i.includes("icon");
    })
    .forEach(function (i) {
      console.log(i);
    });
}

main();
