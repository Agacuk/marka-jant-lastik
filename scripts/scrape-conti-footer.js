"use strict";
const https = require("https");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

https.get("https://www.continental-tires.com/", { headers: { "User-Agent": UA } }, (res) => {
  let html = "";
  res.on("data", (c) => (html += c));
  res.on("end", () => {
    const matches = [...html.matchAll(/https:\/\/www\.continental-tires\.com[^"'\s]+\.(?:svg|png)/gi)].map((m) => m[0]);
    console.log([...new Set(matches)].filter((u) => /logo|footer|brand|coreimg/i.test(u)).join("\n"));
  });
});
