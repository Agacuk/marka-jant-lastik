"use strict";
const fs = require("fs");
const html = fs.readFileSync("probe-bfg.html", "utf8").replace(/&amp;/g, "&");
const all = [...html.matchAll(/tire_bfgoodrich[^"'\\]+\.webp/gi)].map((m) => m[0]);
const uniq = [...new Set(all)];
console.log(uniq.join("\n"));
