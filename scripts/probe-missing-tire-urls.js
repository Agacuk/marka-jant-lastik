"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function head(url) {
  try {
    const r = await fetch(url, { method: "GET", headers: { "User-Agent": UA } });
    const buf = Buffer.from(await r.arrayBuffer());
    return { url, status: r.status, len: buf.length };
  } catch (e) {
    return { url, error: e.message };
  }
}

async function scrapeSimple(slug) {
  const url = "https://simpletire.com/brands/" + slug;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const html = await r.text();
  const imgs = [...html.matchAll(/https:\/\/images\.simpletire\.com\/images\/[^"'\s]+sidetread[^"'\s]+\.(?:jpg|webp)/gi)].map((m) => m[0]);
  return { url, status: r.status, imgs: [...new Set(imgs)].slice(0, 5) };
}

async function scrapeTiremart(slug) {
  const url = "https://www.tiremart.com/" + slug;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  const html = await r.text();
  const imgs = [...html.matchAll(/https:\/\/cdn11\.bigcommerce\.com[^"'\s]+1280x1280[^"'\s]+\.jpg[^"'\s]*/gi)].map((m) => m[0]);
  return { url, status: r.status, img: imgs[0] };
}

(async () => {
  const lassaCodes = ["DWW", "DWW02", "DWT", "CMP", "CMP01", "SNW", "SNW01", "B21", "R01", "C01", "S01"];
  const bases = [
    "http://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/images/270x270/",
    "http://medias89k.azureedge.net/sys-master-hybris-image-prod/images/270x270/",
  ];
  for (const base of bases) {
    for (const code of lassaCodes) {
      for (const n of ["1", "2"]) {
        const url = base + code + "_" + n + "-1704802724631.jpg";
        const r = await head(url);
        if (r.status === 200 && r.len > 5000) console.log("LASSA HIT", r);
      }
    }
  }

  const simple = [
    "petlas-tires/explero-pt431",
    "petlas-tires/imperium-pt515",
    "petlas-tires/snowmaster-pt935",
    "yokohama-tires/advan-db-v552",
    "yokohama-tires/bluearth-es32",
    "bfgoodrich-tires/g-force-sport-comp-2",
    "bfgoodrich-tires/g-force-winter-2",
    "starmaxx-tires/naturen-st542",
    "starmaxx-tires/incurro-winter-w870",
    "lassa-tires/driveways",
    "lassa-tires/competus-at2",
    "lassa-tires/snoways-4",
  ];
  for (const s of simple) {
    const r = await scrapeSimple(s);
    console.log("\nSIMPLE", s, r.status);
    r.imgs.forEach((u) => console.log(u));
  }

  const tm = [
    "petlas-explero-pt431-205-55r16",
    "petlas-imperium-pt515-205-55r16",
    "petlas-snowmaster-pt935-205-55r16",
  ];
  for (const s of tm) {
    const r = await scrapeTiremart(s);
    console.log("\nTM", s, r.status, r.img);
  }

  const nexenPages = [
    "https://www.nexentire.com/international/product/ev/nblue-s.php",
    "https://www.nexentire.com/international/product/passenger/nblue-hd-plus.php",
    "https://www.nexentire.com/international/product/ev/nfera-sport-ev.php",
  ];
  for (const u of nexenPages) {
    const r = await fetch(u, { headers: { "User-Agent": UA } });
    const html = await r.text();
    const imgs = [...html.matchAll(/\/international\/[^"'\s]+\.(?:png|jpg)/gi)].map((m) => m[0]).filter((x) => /product|file/i.test(x));
    console.log("\nNEXEN", u, r.status, imgs.slice(0, 8));
  }
})();
