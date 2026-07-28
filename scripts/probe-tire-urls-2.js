"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function html(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  return { status: r.status, text: await r.text() };
}

(async () => {
  const lassaPages = [
    "https://www.lassa.com.tr/lastik/219407-driveways-yaz-20550r16-87w",
    "https://www.lassa.com.tr/lastik/219789-driveways-sport-yaz-25540r20-101y",
    "https://www.lassa.com.tr/desen/dww-02-driveways",
  ];
  for (const u of lassaPages) {
    const { status, text } = await html(u);
    const all = [...text.matchAll(/(?:https?:)?\/\/[^"'\s<>]+(?:jpg|png|webp)/gi)].map((m) => m[0].replace(/^\/\//, "https://"));
    console.log("\nLASSA", u, status);
    [...new Set(all)].filter((x) => /hybris|azure|media|270x270|desen|driveways|competus|snoways|revola/i.test(x)).forEach((x) => console.log(x));
  }

  const bfgPages = [
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-sport-comp-2",
    "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2",
    "https://www.bfgoodrich.co.uk/auto/tyres",
  ];
  for (const u of bfgPages) {
    const { status, text } = await html(u);
    const m = text.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s\\]+tire_bfgoodrich[^"'\s\\]+/gi) || [];
    console.log("\nBFG", u, status, [...new Set(m)].slice(0, 5));
  }

  const yoko = [
    "https://www.yokohama.com.au/our-range/tyres/BluEarth%20Es%20ES32",
    "https://www.yokohama.com.au/our-range/tyres/Advan%20dB%20V552",
  ];
  for (const u of yoko) {
    const { status, text } = await html(u);
    const imgs = [...text.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|png|webp)/gi)].map((m) => m[0]).filter((x) => /tyre|tire|product|media|assets/i.test(x));
    console.log("\nYOKO AU", u, status);
    imgs.slice(0, 10).forEach((x) => console.log(x));
  }

  // EPREL petlas
  const eprel = await html("https://eprel.ec.europa.eu/screen/product/tyres/499304");
  const png = eprel.text.match(/\/api\/products\/tyres\/[^"']+\/labels[^"']*/);
  console.log("\nEPREL label api", png);

  // search nexen nblue ev
  const nx = await html("https://www.nexentire.com/international/product/passenger/");
  const links = [...nx.text.matchAll(/href="(\/international\/product\/[^"]+)"/gi)].map((m) => m[1]).filter((x) => /nblue|ev/i.test(x));
  console.log("\nNEXEN links", [...new Set(links)].slice(0, 20));
})();
