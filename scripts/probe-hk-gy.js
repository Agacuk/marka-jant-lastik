"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const urls = [
  "https://www.hankooktire.com/us/en/tire/dynapro/hp2-rh12.html",
  "https://www.hankooktire.com/us/en/tire/dynapro/hp2.html",
  "https://www.hankooktire.com/us/en/tire/winter/icept-evo3-w330.html",
  "https://www.hankooktire.com/us/en/tire/winter/icept-evo3-w330a.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3.ULTRGRIPPF3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultragrip_performance_3.ULTRGRIPPF3.html",
  "https://www.goodyear.eu/en_gb/consumer/tires/ultra_grip_performance_3.ULTRGRIPPERF3.html",
];

async function run() {
  for (const u of urls) {
    const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
    const h = await r.text();
    console.log("\n", r.status, u);
    const imgs = [...new Set(h.match(/https?:\/\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /product|tire|tyre|dynapro|icept|rh12|w330|hp2|ultrgrip|ultra|goodyear|effigripp|vec4/i.test(x) && !/logo|icon|favicon|thumb[0-9]|ending|gra\.png|wet|handling|ride|snow[12]|awards|recommended|link_thumb|test-result/i.test(x))
      .slice(0, 8);
    imgs.forEach((i) => console.log(" ", i.slice(0, 150)));
    const rel = [...new Set(h.match(/\/content\/dam\/[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi) || [])]
      .filter((x) => /ultrgrip|ultra|goodyear\/consumer|effigripp|vec4|dynapro|icept|w330|rh12|hp2|tire_list/i.test(x) && !/favicon|test-result|icon|navigation/i.test(x))
      .slice(0, 8);
    rel.forEach((i) => console.log(" rel:", i.slice(0, 150)));
  }
}
run();
