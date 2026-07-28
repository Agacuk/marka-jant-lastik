"use strict";

const pages = [
  "https://onyxalloys.co.uk/before-after-photos-alloy-wheel-crack-repairs-by-onyx-alloys/",
  "http://gmewelding.blogspot.com/2010/04/alloy-wheel-split-rim-repair.html",
  "https://www.prestigewheelcentre.co.uk/blog/2014/11/mercedes-c63-amg-alloy-wheel-refurbishment-back-to-oe-finish/",
  "https://thewheelmedics.co.uk/service/diamond-cutting/",
];

async function main() {
  for (const url of pages) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const html = await res.text();
      const re = /(?:src|data-src|href)=["']([^"']+\.(?:jpg|jpeg|webp|png)[^"']*)["']/gi;
      const imgs = [];
      let m;
      while ((m = re.exec(html))) imgs.push(m[1]);
      console.log("\n=== " + url + " (" + res.status + ") ===");
      [...new Set(imgs)]
        .filter(function (i) {
          return !i.includes("logo") && !i.includes("icon") && !i.includes("avatar");
        })
        .slice(0, 30)
        .forEach(function (i) {
          console.log(i);
        });
    } catch (err) {
      console.log(url, err.message);
    }
  }
}

main();
