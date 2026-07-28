"use strict";
const fs = require("fs");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function decode(s) {
  return s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\\\//g, "/");
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  return { status: res.status, html: res.ok ? await res.text() : "" };
}

function extractMichelin(html) {
  const d = decode(html);
  const m = d.match(/https:\/\/dxm\.contentcenter\.michelin\.com[^"'\s\\]+tire_michelin[^"'\s\\]+_main_[^"'\s\\]+\.webp/gi);
  return m ? [...new Set(m.map((u) => u.split("?")[0]))][0] : null;
}

function extractContinental(html, base) {
  const d = decode(html);
  const re = /(?:https?:\/\/[^"'\s]+)?\/adobe\/dynamicmedia\/deliver\/[^"'\s]+(?:ProductPicture|productpicture|PremiumContact|SportContact|UltraContact|AllSeasonContact|EcoContact|CrossContact)[^"'\s]*\.(?:webp|png)(?:\.webp)?(?:\?[^"'\s]*)?/gi;
  const m = d.match(re) || [];
  const abs = m.map((u) => {
    if (u.startsWith("http")) return u.split("&amp;").join("&");
    return base + u.split("&amp;").join("&");
  });
  const product = abs.filter((u) => /productpicture|ProductPicture|30/i.test(u) && !/continental-tire\.png/i.test(u));
  return product[0] || abs[0] || null;
}

function extractGoodyear(html, base) {
  const d = decode(html);
  const patterns = [
    /\/content\/dam\/goodyear\/consumer\/common\/why-goodyear\/[^"']+product[^"']+\.jpg\.transform\/rendition-\d+\/image\.jpg/gi,
    /\/content\/dam\/common\/tires\/goodyear\/consumer\/[^"']+\.jpg\.transform\/[^"']+\/image\.jpg/gi,
    /\/content\/dam\/goodyear\/consumer\/[^"']+product[^"']+\.(?:jpg|png)(?:\.transform\/[^"']+)?/gi,
  ];
  for (const re of patterns) {
    const m = d.match(re);
    if (m && m.length) {
      const url = base + m[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/");
      return url.includes(".transform/") ? url : url + ".transform/rendition-900/image.jpg";
    }
  }
  return null;
}

function extractDynamicMedia(html, base) {
  const d = decode(html);
  const re = /https?:\/\/[^"'\s]+\/adobe\/dynamicmedia\/deliver\/[^"'\s]+(?:webp|png)(?:\.webp)?(?:\?[^"'\s]*)?/gi;
  const m = d.match(re) || [];
  const product = m.filter((u) => /product|tire|tyre|30/i.test(u) && !/logo|icon|favicon/i.test(u));
  return product[0] || m[0] || null;
}

function extractOgImage(html) {
  const d = decode(html);
  const m = d.match(/property="og:image"\s+content="([^"]+)"/i);
  return m ? m[1] : null;
}

function extractScene7(html) {
  const d = decode(html);
  const m = d.match(/https:\/\/s7[^"'\s]+\/is\/image\/[^"'\s]+/gi);
  return m ? m.find((u) => /tire|tyre|product/i.test(u)) || m[0] : null;
}

function extractPirelli(html) {
  const d = decode(html);
  const re = /https?:\/\/[^"'\s]*pirelli[^"'\s]*\/(?:content|dam|media)[^"'\s]+\.(?:webp|jpg|jpeg|png)/gi;
  const m = d.match(re) || [];
  const product = m.filter((u) => /product|tire|tyre|p-zero|pzero|cinturato|scorpion|powergy/i.test(u));
  return product[0] || null;
}

function extractGenericProductImg(html, base) {
  const d = decode(html);
  const re = /(?:src|content|data-tire-image|background-image:\s*url\(['"]?)([^"')]+\.(?:webp|jpg|jpeg|png))/gi;
  let m;
  const hits = [];
  while ((m = re.exec(d))) {
    let u = m[1].replace(/\\u002F/g, "/").replace(/\\\//g, "/");
    if (/logo|icon|favicon|banner|hero-bg|dealer|navigation|footer|social|apple-touch|sprite/i.test(u)) continue;
    if (/product|tire|tyre|ProductPicture|productpicture|_30|degree|main/i.test(u)) hits.push(u.startsWith("http") ? u : base + u);
  }
  return hits[0] || null;
}

const catalog = [
  { brand: "goodyear", id: "eagle-f1-asymmetric", url: "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/eagle-f1-asymmetric-6.html", base: "https://www.goodyear.co.uk", fn: extractGoodyear },
  { brand: "goodyear", id: "efficientgrip-performance", url: "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/efficientgrip-performance-2.html", base: "https://www.goodyear.co.uk", fn: extractGoodyear },
  { brand: "goodyear", id: "vector-4seasons-gen3", url: "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/vector-4seasons-gen-3.html", base: "https://www.goodyear.co.uk", fn: extractGoodyear },
  { brand: "goodyear", id: "ultragrip-performance", url: "https://www.goodyear.co.uk/en_gb/consumer/products/tyres/ultragrip-performance-3.html", base: "https://www.goodyear.co.uk", fn: extractGoodyear },

  { brand: "continental", id: "premiumcontact-7", url: "https://www.continental-tires.com/products/b2c/car/tires/premiumcontact-7/", base: "https://www.continental-tires.com", fn: extractContinental },
  { brand: "continental", id: "sportcontact-7", url: "https://www.continental-tires.com/products/b2c/car/tires/sportcontact-7/", base: "https://www.continental-tires.com", fn: extractContinental },
  { brand: "continental", id: "ecocontact-6", url: "https://www.continental-tires.com/products/b2c/car/tires/ecocontact-6/", base: "https://www.continental-tires.com", fn: extractContinental },
  { brand: "continental", id: "allseasoncontact", url: "https://www.continental-tires.com/products/b2c/car/tires/allseasoncontact-2/", base: "https://www.continental-tires.com", fn: extractContinental },

  { brand: "pirelli", id: "p-zero", url: "https://www.pirelli.com/tyres/en-ww/car/catalog/p-zero", base: "https://www.pirelli.com", fn: extractPirelli },
  { brand: "pirelli", id: "cinturato-p7", url: "https://www.pirelli.com/tyres/en-ww/car/catalog/cinturato-p7-c2", base: "https://www.pirelli.com", fn: extractPirelli },
  { brand: "pirelli", id: "scorpion-verde", url: "https://www.pirelli.com/tyres/en-ww/car/catalog/scorpion-verde-all-season", base: "https://www.pirelli.com", fn: extractPirelli },
  { brand: "pirelli", id: "powergy", url: "https://www.pirelli.com/tyres/en-ww/car/catalog/powergy", base: "https://www.pirelli.com", fn: extractPirelli },

  { brand: "bridgestone", id: "potenza-sport", url: "https://www.bridgestone.co.uk/tyres/car-tyres/potenza-sport", base: "https://www.bridgestone.co.uk", fn: extractGenericProductImg },
  { brand: "bridgestone", id: "turanza-t005", url: "https://www.bridgestone.co.uk/tyres/car-tyres/turanza-t005", base: "https://www.bridgestone.co.uk", fn: extractGenericProductImg },
  { brand: "bridgestone", id: "blizzak-lm005", url: "https://www.bridgestone.co.uk/tyres/car-tyres/blizzak-lm-005", base: "https://www.bridgestone.co.uk", fn: extractGenericProductImg },
  { brand: "bridgestone", id: "alenza-001", url: "https://www.bridgestone.co.uk/tyres/car-tyres/alenza-001", base: "https://www.bridgestone.co.uk", fn: extractGenericProductImg },

  { brand: "hankook", id: "ventus-s1-evo3", url: "https://www.hankooktire.com/global/en/tirelist/ventus-s1-evo3.html", base: "https://www.hankooktire.com", fn: extractGenericProductImg },
  { brand: "hankook", id: "kinergy-4s2", url: "https://www.hankooktire.com/global/en/tirelist/kinergy-4s2.html", base: "https://www.hankooktire.com", fn: extractGenericProductImg },
  { brand: "hankook", id: "dynapro", url: "https://www.hankooktire.com/global/en/tirelist/dynapro-hp2.html", base: "https://www.hankooktire.com", fn: extractGenericProductImg },
  { brand: "hankook", id: "winter-icept", url: "https://www.hankooktire.com/global/en/tirelist/winter-icept-evo3-w330.html", base: "https://www.hankooktire.com", fn: extractGenericProductImg },

  { brand: "kumho", id: "ecsta-ps71", url: "https://www.kumhotire.com/global/passenger/ecsta-ps71/", base: "https://www.kumhotire.com", fn: extractGenericProductImg },
  { brand: "kumho", id: "solus-4s", url: "https://www.kumhotire.com/global/passenger/solus-4s-ha32/", base: "https://www.kumhotire.com", fn: extractGenericProductImg },
  { brand: "kumho", id: "wintercraft", url: "https://www.kumhotire.com/global/passenger/wintercraft-wp52/", base: "https://www.kumhotire.com", fn: extractGenericProductImg },
  { brand: "kumho", id: "crugen-premium", url: "https://www.kumhotire.com/global/passenger/crugen-premium-kl33/", base: "https://www.kumhotire.com", fn: extractGenericProductImg },
  { brand: "kumho", id: "ecowing", url: "https://www.kumhotire.com/global/passenger/ecowing-es31/", base: "https://www.kumhotire.com", fn: extractGenericProductImg },

  { brand: "nexen", id: "nfera-sport", url: "https://www.nexentire.com/international/product/passenger/suv/nfera-sport/", base: "https://www.nexentire.com", fn: extractGenericProductImg },
  { brand: "nexen", id: "nblue-4season", url: "https://www.nexentire.com/international/product/passenger/suv/nblue-4season/", base: "https://www.nexentire.com", fn: extractGenericProductImg },
  { brand: "nexen", id: "winguard-winspike", url: "https://www.nexentire.com/international/product/passenger/suv/winguard-winspike-3/", base: "https://www.nexentire.com", fn: extractGenericProductImg },
  { brand: "nexen", id: "roadian-gtx", url: "https://www.nexentire.com/international/product/passenger/suv/roadian-gtx/", base: "https://www.nexentire.com", fn: extractGenericProductImg },
  { brand: "nexen", id: "nblue-ev", url: "https://www.nexentire.com/international/product/passenger/suv/nblue-ev/", base: "https://www.nexentire.com", fn: extractGenericProductImg },

  { brand: "yokohama", id: "advan-sport-v105", url: "https://www.yokohama.eu/eu-en/tyres/pattern/advan-sport-v105/", base: "https://www.yokohama.eu", fn: extractGenericProductImg },
  { brand: "yokohama", id: "bluearth", url: "https://www.yokohama.eu/eu-en/tyres/pattern/bluearth-es32/", base: "https://www.yokohama.eu", fn: extractGenericProductImg },
  { brand: "yokohama", id: "geolandar", url: "https://www.yokohama.eu/eu-en/tyres/pattern/geolandar-g055/", base: "https://www.yokohama.eu", fn: extractGenericProductImg },
  { brand: "yokohama", id: "iceguard", url: "https://www.yokohama.eu/eu-en/tyres/pattern/iceguard-ig70/", base: "https://www.yokohama.eu", fn: extractGenericProductImg },
  { brand: "yokohama", id: "advan-db-v552", url: "https://www.yokohama.eu/eu-en/tyres/pattern/advan-db-v552/", base: "https://www.yokohama.eu", fn: extractGenericProductImg },

  { brand: "bfgoodrich", id: "g-force-pilot-sport", url: "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-pilot-sport", base: "https://www.bfgoodrich.co.uk", fn: extractMichelin },
  { brand: "bfgoodrich", id: "advantage-touring", url: "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-advantage-touring", base: "https://www.bfgoodrich.co.uk", fn: extractMichelin },
  { brand: "bfgoodrich", id: "all-terrain-ko2", url: "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-all-terrain-t-a-ko2", base: "https://www.bfgoodrich.co.uk", fn: extractMichelin },
  { brand: "bfgoodrich", id: "g-force-winter", url: "https://www.bfgoodrich.co.uk/auto/tyres/bfgoodrich-g-force-winter-2", base: "https://www.bfgoodrich.co.uk", fn: extractMichelin },

  { brand: "lassa", id: "revola", url: "https://www.lassa.com.tr/urunler/revola", base: "https://www.lassa.com.tr", fn: extractGenericProductImg },
  { brand: "lassa", id: "driveways", url: "https://www.lassa.com.tr/urunler/driveways", base: "https://www.lassa.com.tr", fn: extractGenericProductImg },
  { brand: "lassa", id: "competus", url: "https://www.lassa.com.tr/urunler/competus-at-2", base: "https://www.lassa.com.tr", fn: extractGenericProductImg },
  { brand: "lassa", id: "snoways", url: "https://www.lassa.com.tr/urunler/snoways-4", base: "https://www.lassa.com.tr", fn: extractGenericProductImg },

  { brand: "petlas", id: "velox-sport", url: "https://www.petlas.com.tr/urun/velox-sport", base: "https://www.petlas.com.tr", fn: extractGenericProductImg },
  { brand: "petlas", id: "explero", url: "https://www.petlas.com.tr/urun/explero-h-p", base: "https://www.petlas.com.tr", fn: extractGenericProductImg },
  { brand: "petlas", id: "imperium", url: "https://www.petlas.com.tr/urun/imperium-pt515", base: "https://www.petlas.com.tr", fn: extractGenericProductImg },
  { brand: "petlas", id: "snowmaster", url: "https://www.petlas.com.tr/urun/snowmaster-w651", base: "https://www.petlas.com.tr", fn: extractGenericProductImg },

  { brand: "starmaxx", id: "starmaxx-x1", url: "https://www.starmaxx.com.tr/urunler/starmaxx-x1", base: "https://www.starmaxx.com.tr", fn: extractGenericProductImg },
  { brand: "starmaxx", id: "starmaxx-winter", url: "https://www.starmaxx.com.tr/urunler/starmaxx-winter", base: "https://www.starmaxx.com.tr", fn: extractGenericProductImg },
  { brand: "starmaxx", id: "starmaxx-suv", url: "https://www.starmaxx.com.tr/urunler/starmaxx-suv", base: "https://www.starmaxx.com.tr", fn: extractGenericProductImg },
  { brand: "starmaxx", id: "starmaxx-eco", url: "https://www.starmaxx.com.tr/urunler/starmaxx-eco", base: "https://www.starmaxx.com.tr", fn: extractGenericProductImg },
];

(async () => {
  const results = [];
  for (const item of catalog) {
    try {
      const { status, html } = await fetchHtml(item.url);
      let img = item.fn(html, item.base);
      if (!img) img = extractDynamicMedia(html, item.base);
      if (!img) img = extractOgImage(html);
      results.push({ ...item, status, img: img || null });
      console.log(item.brand + "/" + item.id, status, img ? "FOUND" : "MISS");
      if (img) console.log("  ", img.slice(0, 120));
    } catch (e) {
      results.push({ ...item, status: "ERR", img: null, error: e.message });
      console.log(item.brand + "/" + item.id, "ERR", e.message);
    }
  }
  fs.writeFileSync("probe-all-brands.json", JSON.stringify(results, null, 2));
})();
