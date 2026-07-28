"use strict";
const fs = require("fs");
const path = require("path");
const UA = "Mozilla/5.0 (Windows NT 10.0; Av64; x64) AppleWebKit/537.36";

const urls = [
  ["michelin", "https://www.svgrepo.com/show/493552/michelin.svg"],
  ["goodyear", "https://www.svgrepo.com/show/493545/goodyear.svg"],
  ["pirelli", "https://www.svgrepo.com/show/493559/pirelli.svg"],
  ["continental", "https://www.svgrepo.com/show/493533/continental.svg"],
  ["bridgestone", "https://www.svgrepo.com/show/493526/bridgestone.svg"],
  ["hankook", "https://asset.hankooktire.com/content/dam/hankooktire/local/svg/logo-white.svg"],
  ["yokohama", "https://www.svgrepo.com/show/493574/yokohama.svg"],
  ["bfgoodrich", "https://www.svgrepo.com/show/493521/bfgoodrich.svg"],
  ["kumho", "https://www.svgrepo.com/show/493549/kumho.svg"],
  ["nexen", "https://www.svgrepo.com/show/493556/nexen.svg"],
  ["yokohama2", "https://cdn.worldvectorlogo.com/logos/yokohama-1.svg"],
  ["kumho2", "https://cdn.worldvectorlogo.com/logos/kumho-1.svg"],
  ["nexen2", "https://cdn.worldvectorlogo.com/logos/nexen-1.svg"],
  ["bfg2", "https://cdn.worldvectorlogo.com/logos/bfgoodrich-1.svg"],
  ["lassa2", "https://cdn.worldvectorlogo.com/logos/lassa-1.svg"],
  ["petlas2", "https://cdn.worldvectorlogo.com/logos/petlas-1.svg"],
  ["starmaxx2", "https://cdn.worldvectorlogo.com/logos/starmaxx.svg"],
];

(async () => {
  for (const [name, url] of urls) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      const t = await r.text();
      console.log(name, r.status, t.length, t.includes("<svg") ? "SVG" : "NO", url.split("/").pop());
    } catch (e) {
      console.log(name, "ERR", e.message);
    }
  }
})();
