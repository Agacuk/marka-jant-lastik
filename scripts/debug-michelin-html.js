"use strict";
const fs = require("fs");
fetch("https://www.michelin.co.uk/auto/tyres/michelin-pilot-sport-5", {
  headers: { "User-Agent": "Mozilla/5.0" },
})
  .then((r) => r.text())
  .then((t) => {
    fs.writeFileSync("michelin-ps5.html", t);
    console.log("len", t.length);
    console.log("assets.michelin", t.includes("assets.michelin"));
    const hits = t.match(/https:[^"'\s>]+/g) || [];
    hits
      .filter((u) => /michelin|tyre|tire|product|image|media|dam/i.test(u))
      .slice(0, 40)
      .forEach((u) => console.log(u));
  });
