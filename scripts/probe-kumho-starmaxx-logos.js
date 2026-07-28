"use strict";
const UA = "Mozilla/5.0";
const slugs = [
  "kumho-tire-2", "kumho-tire", "kumho-2", "kumho-3", "kumho-tires",
  "starmaxx-1", "starmaxx-2", "starmaxx-tire",
];
(async () => {
  for (const s of slugs) {
    const u = "https://cdn.worldvectorlogo.com/logos/" + s + ".svg";
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    const t = await r.text();
    console.log(s, r.status, t.includes("<svg") && !t.includes("404") ? t.length : "fail");
  }
  const k2 = await fetch("https://www.kumhotire.com/us/common/images/logo_w.png", { headers: { "User-Agent": UA } });
  console.log("kumho png", k2.status, k2.headers.get("content-type"));
})();
