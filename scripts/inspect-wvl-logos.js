"use strict";
const fs = require("fs");
const path = require("path");
const UA = "Mozilla/5.0";

const OUT = path.join(__dirname, "..", "assets", "images", "brands");

(async () => {
  const items = [
    ["yokohama", "https://cdn.worldvectorlogo.com/logos/yokohama.svg"],
    ["nexen", "https://cdn.worldvectorlogo.com/logos/nexen-1.svg"],
    ["bfgoodrich", "https://cdn.worldvectorlogo.com/logos/bfgoodrich-1.svg"],
  ];
  for (const [n, u] of items) {
    const t = await (await fetch(u, { headers: { "User-Agent": UA } })).text();
    fs.writeFileSync(path.join(OUT, "_wvl_" + n + ".svg"), t);
    const fills = t.match(/fill="[^"]+"/g) || [];
    console.log(n, fills.slice(0, 10));
  }
})();
