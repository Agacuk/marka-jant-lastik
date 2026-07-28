"use strict";

const pages = [
  "https://www.wheelsclinic.co.uk/alloy-wheel-refurbishment/",
  "https://www.wheelsclinic.co.uk/crack-repair/",
  "https://www.wheelsclinic.co.uk/buckle-repair/",
  "https://wheelrestore.com/products/wheel-straightener/",
  "https://wheelrestore.com/products/aluminium-spraying-machine/",
  "https://alloyrefurbcentre.co.uk/services/powder-coating/",
  "https://thewheelmedics.co.uk/service/welding-cracked-wheels/",
  "https://thewheelmedics.co.uk/service/straightening-bent-alloys/",
  "https://thewheelmedics.co.uk/service/car-detailing-polishing/",
];

async function main() {
  for (const url of pages) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const html = await res.text();
      const re = /(?:src|data-src|data-lazy-src|href)=["']([^"']+\.(?:jpg|jpeg|webp|png)[^"']*)["']/gi;
      const imgs = [];
      let m;
      while ((m = re.exec(html))) imgs.push(m[1]);
      console.log("\n=== " + url + " (" + res.status + ") ===");
      [...new Set(imgs)]
        .filter(function (i) {
          return !i.includes("logo") && !i.includes("favicon") && !i.includes("icon");
        })
        .slice(0, 25)
        .forEach(function (i) {
          console.log(i);
        });
    } catch (err) {
      console.log(url, err.message);
    }
  }
}

main();
