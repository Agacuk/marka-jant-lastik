"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

async function head(url) {
  const r = await fetch(url, { method: "HEAD", headers: { "User-Agent": UA } }).catch(() => null);
  return r ? { status: r.status, len: r.headers.get("content-length") } : { status: 0 };
}

async function yokoAu(name) {
  const u = "https://www.yokohama.com.au/-/media/images/tyres/tyreimages/" + name + ".png?h=800&w=800";
  const h = await head(u);
  console.log("YOKO", name, h);
}

(async () => {
  for (const n of ["advan-sport-v105", "geolandar-g058", "geolandar-cv-g058", "geolandar-h-t-g056", "geolandar-suv-ht-g055"]) await yokoAu(n);

  for (const u of [
    "https://asset.hankooktire.com/content/dam/hankooktire/global/product/ventus/ventus-s1-evo3/K127A_30_DEGREE.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/global/product/ventus/ventus-s1-evo3/K127_30_DEGREE.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/pcr/h750/H750_30_DEGREE.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/pcr/h750/H750A_30_DEGREE.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/global/product/dynapro/Dynapro-HT-RH12_30_DEGREE.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/global/product/dynapro/RH12_30_DEGREE.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/pcr/W330/W330_30_DEGREE.png",
    "https://asset.hankooktire.com/content/dam/hankooktire/eu/product/pcr/W330/W330A_30_DEGREE.png",
    "https://www.hankooktire.com/upload/product/K127A_30_DEGREE.png",
    "https://www.hankooktire.com/upload/product/H750_30_DEGREE.png",
    "https://www.hankooktire.com/upload/product/RH12_30_DEGREE.png",
    "https://www.hankooktire.com/upload/product/W330_30_DEGREE.png",
  ]) console.log("HK", u.split("/").slice(-1)[0], await head(u));

  for (const u of [
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/f1asym6/f1asym6-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/f1asym5/f1asym5-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/f1asym/f1asym-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/goodyear/consumer/common/why-goodyear/eagle-f1-asymmetric-6/goodyear-f1-as6-product-front.jpg.transform/product-front/image.jpg",
  ]) console.log("GY", await head(u), u.split("/").slice(-2)[0]);

  // Starmaxx winter - tiremart search
  const html = await fetch("https://www.tiremart.com/search.php?search_query=incurro+w870+winter", { headers: { "User-Agent": UA } }).then((r) => r.text());
  const links = [...new Set(html.match(/\/starmaxx[^\"'\s?]+tire[^\"'\s?]*/gi) || [])].filter((l) => /w870|winter|incurro/i.test(l));
  console.log("\nSTAR links", links.slice(0, 8));
  for (const l of links.slice(0, 3)) {
    const slug = l.replace(/^\//, "").replace(/\/$/, "");
    const page = await fetch("https://www.tiremart.com/" + slug, { headers: { "User-Agent": UA } }).then((r) => r.text());
    const m = page.match(/https:\/\/cdn11\.bigcommerce\.com[^\"'\s]+1280x1280[^\"'\s]+\.jpg[^\"'\s]*/i);
    if (m) console.log(slug, m[0].replace(/&amp;/g, "&"));
  }
})();
