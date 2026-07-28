"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const guesses = [
  "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3.ULTRGRIP3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultragrip_performance_3.ULTRGRIP3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3.ULTRGRIPP3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultragrip_performance_3.ULTRGRIPP3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3.ULTRGRIPPF3.html",
  "https://tires.bridgestone.com/content/dam/bridgestone/consumer/bst/tires/models/turanza-t005/tilted.jpg",
  "https://tires.bridgestone.com/content/dam/bridgestone/consumer/bst/tires/models/turanza-t005/TuranzaT005_60_Hr.jpg",
  "https://tires.bridgestone.com/content/dam/consumer/bst/shared/tires/turanza-t005/tilted.jpg",
  "https://tires.bridgestone.com/content/dam/bridgestone/consumer/bst/tires/models/alenza-001/tilted.jpg",
  "https://tires.bridgestone.com/content/dam/consumer/bst/shared/tires/alenza-001/tilted.jpg",
  "https://www.hankooktire.com/uk/en/tire/dynapro/hp2.html",
  "https://www.hankooktire.com/uk/en/tire/dynapro/hp2-rh12a.html",
  "https://www.hankooktire.com/uk/en/tire/dynapro/hp2-rh12-suv.html",
  "https://www.hankooktire.com/uk/en/tire/winter/icept-evo3-w330a-suv.html",
  "https://www.hankooktire.com/uk/en/tire/winter/icept-evo3-w330a.html",
  "https://www.hankooktire.com/uk/en/tire/winter/icept-evo3-w330-suv.html",
];

async function head(url) {
  const r = await fetch(url, { method: "GET", headers: { "User-Agent": UA }, redirect: "follow" });
  const ct = r.headers.get("content-type") || "";
  if (ct.includes("html")) {
    const h = await r.text();
    const rel = [...new Set(h.match(/\/content\/dam\/[^"'\s]+\.(?:jpg|png|webp)/gi) || [])]
      .filter((x) => /ultrgrip|ultra|goodyear\/consumer\/common|turanza|alenza|dynapro|icept|w330|rh12|hp2/i.test(x))
      .slice(0, 5);
    console.log(r.status, url.split("/").slice(-2).join("/"), rel.length ? rel : "html");
    rel.forEach((x) => console.log(" ", x));
  } else {
    console.log(r.status, url.split("/").pop(), ct, r.headers.get("content-length"));
  }
}

(async () => {
  for (const u of guesses) await head(u);
})();
