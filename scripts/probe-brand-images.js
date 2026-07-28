"use strict";
const fs = require("fs");

async function dump(url, name) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();
  fs.writeFileSync("probe-" + name + ".txt", html.slice(0, 500000));
  const decoded = html.replace(/&quot;/g, '"').replace(/\\\//g, "/");
  const keys = ["dxm.contentcenter", "cloudimg", "dynamicmedia", "tire_", "tyre_", "productImage", "og:image", "wedia"];
  console.log(name, res.status, html.length);
  keys.forEach((k) => console.log(" ", k, decoded.includes(k)));
  const og = decoded.match(/property="og:image"\s+content="([^"]+)"/i);
  if (og) console.log(" og:", og[1]);
}

(async () => {
  await dump("https://www.goodyear.co.uk/en_gb/consumer/products/tyres/eagle-f1-asymmetric-6.html", "goodyear");
  await dump("https://www.continental-tires.com/products/b2c/car/tires/premiumcontact-7/", "continental");
  await dump("https://www.bridgestone.com/en-us/consumer/tires/potenza-sport", "bridgestone");
  await dump("https://www.hankook.co.uk/tyres/car-tyres/ventus-s1-evo3", "hankook");
  await dump("https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-pilot-sport", "bfg");
  await dump("https://www.pirelli.com/tyres/en-gb/car/catalog/p-zero", "pirelli");
})();
