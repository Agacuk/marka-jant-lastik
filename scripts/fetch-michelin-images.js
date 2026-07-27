/**
 * Fetch Michelin product image URLs from official pages
 */
"use strict";

const products = [
  { id: "pilot-sport-5", url: "https://www.michelin.co.uk/auto/tyres/michelin-pilot-sport-5" },
  { id: "primacy-5", url: "https://www.michelin.co.uk/auto/tyres/michelin-primacy-5" },
  { id: "crossclimate-2", url: "https://www.michelin.co.uk/auto/tyres/michelin-crossclimate-2" },
  { id: "latitude-sport-3", url: "https://www.michelin.co.uk/auto/tyres/michelin-latitude-sport-3" },
  { id: "pilot-alpin", url: "https://www.michelin.co.uk/auto/tyres/michelin-pilot-alpin-5" },
  { id: "e-primacy", url: "https://www.michelin.co.uk/auto/tyres/michelin-e-primacy" },
];

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(res.status + " " + url);
  return res.text();
}

function extractImages(html) {
  const urls = new Set();

  const patterns = [
    /https:\/\/assets\.michelin\.com[^"'\\s>]+\.(?:webp|jpg|jpeg|png)/gi,
    /https:\/\/[^"'\\s>]*michelin[^"'\\s>]*\.(?:webp|jpg|jpeg|png)/gi,
  ];

  patterns.forEach(function (re) {
    let m;
    while ((m = re.exec(html)) !== null) {
      let u = m[0];
      if (u.includes("logo") || u.includes("icon") || u.includes("favicon")) continue;
      urls.add(u.split("?")[0]);
    }
  });
  const escapedJson = html.match(/https:\\\/\\\/assets\.michelin\.com[^"\\]+/gi) || [];
  escapedJson.forEach(function (chunk) {
    urls.add(chunk.replace(/\\\//g, "/").split("?")[0]);
  });

  // og:image
  const og = html.match(/property="og:image"\s+content="([^"]+)"/i);
  if (og) urls.add(og[1].split("?")[0]);

  // JSON image fields
  const jsonImages = html.match(/"url"\s*:\s*"(https:[^"]+\.(?:webp|jpg|jpeg|png)[^"]*)"/gi) || [];
  jsonImages.forEach(function (chunk) {
    const u = chunk.match(/"(https:[^"]+)"/);
    if (u) urls.add(u[1].replace(/\\u002F/g, "/").split("?")[0]);
  });

  return [...urls];
}

async function main() {
  for (const p of products) {
    try {
      const html = await fetchHtml(p.url);
      const images = extractImages(html);
      console.log("\n=== " + p.id + " ===");
      console.log("URL:", p.url);
      images.slice(0, 15).forEach(function (u) {
        console.log(u);
      });
      if (!images.length) console.log("(no images found)");
    } catch (e) {
      console.log("\n=== " + p.id + " ERROR ===", e.message);
    }
  }
}

main();
