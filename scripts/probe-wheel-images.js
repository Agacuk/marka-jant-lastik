"use strict";

const pages = [
  "https://www.wheelsclinic.co.uk/diamond-cut/",
  "https://thewheelmedics.co.uk/service/diamond-cutting/",
  "https://liontyres.uk/alloy-wheels-refurbishment/",
  "https://www.prestigewheelcentre.co.uk/blog/2013/03/aston-martin-alloy-wheel-diamond-cutting-refurbishment-at-prestige-wheel-centre-birmingham-uk/",
  "https://wheelrestore.com/products/diamond-cut-machine/",
  "https://wheelrestore.com/products/blast-cabinet-filtration/",
];

async function main() {
  for (const url of pages) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const html = await res.text();
      const re = /(?:src|data-src|data-lazy-src|content)=["']([^"']+\.(?:jpg|jpeg|webp|png)[^"']*)["']/gi;
      const imgs = [];
      let m;
      while ((m = re.exec(html))) imgs.push(m[1]);
      console.log("\n=== " + url + " (" + res.status + ") ===");
      [...new Set(imgs)].slice(0, 20).forEach(function (i) {
        console.log(i);
      });
    } catch (err) {
      console.log(url, err.message);
    }
  }
}

main();
