"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const BASE = "https://www.kumhotire.com";

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  return { status: r.status, html: await r.text() };
}

async function head(url) {
  try {
    const r = await fetch(url, { method: "HEAD", headers: { "User-Agent": UA } });
    return r.status;
  } catch (e) {
    return "ERR:" + e.message;
  }
}

(async () => {
  const list = await get(BASE + "/en/tire/list.do?menuCd=MN000014");
  const imgs = [...new Set(list.html.match(/\/upload\/product\/[^"'\s]+(?:30_DEGREE|LOGO)[^"'\s]*\.(?:png|jpg)/gi) || [])];
  console.log("Kumho product images on list:", imgs.length);
  for (const img of imgs) {
    const ctx = list.html.slice(list.html.indexOf(img) - 300, list.html.indexOf(img) + 300);
    const name = (ctx.match(/alt="([^"]+)"/) || ctx.match(/>([^<]{3,40})<\//) || ["", "?"])[1];
    console.log(name.trim(), img);
  }

  // Direct Kumho CDN guesses
  const kumhoFiles = [
    "PS71_30_DEGREE.png", "Solus_TA31_30_DEGREE.png", "Solus_TA51_30_DEGREE.png",
    "HA32_30_DEGREE.png", "WS71_30_DEGREE.png", "HP71_30_DEGREE.png",
    "Crugen_HP71_30_DEGREE.png", "Ecowing_ES31_30_DEGREE.png", "Ecsta_PS71_30_DEGREE.png",
    "Solus_4S_HA32_30_DEGREE.png", "WinterCraft_WP71_30_DEGREE.png", "Crugen_Premium_KL33_30_DEGREE.png",
    "Ecowing_KH27_30_DEGREE.png", "Solus_KH25_30_DEGREE.png", "Solus_TA31_30_DEGREE.png",
  ];
  console.log("\nKumho HEAD checks:");
  for (const f of kumhoFiles) {
    const u = BASE + "/upload/product/" + f;
    const s = await head(u);
    if (s === 200) console.log("OK", f);
  }

  // Parse view pages by searching list for keywords
  const keywords = {
    "ecsta-ps71": ["PS71", "Ecsta PS71"],
    "solus-4s": ["Solus 4S", "Solus4S", "HA32", "TA31"],
    "wintercraft": ["WinterCraft", "WP71", "WS71", "WI31"],
    "crugen-premium": ["Crugen Premium", "Crugen", "KL33", "HP71"],
    "ecowing": ["Ecowing", "ES31", "KH27"],
  };
  for (const [id, kws] of Object.entries(keywords)) {
    for (const kw of kws) {
      const i = list.html.indexOf(kw);
      if (i > -1) {
        const chunk = list.html.slice(i - 500, i + 800);
        const img = (chunk.match(/\/upload\/product\/[^"']+\.(?:png|jpg)/i) || [])[0];
        const seq = (chunk.match(/view\.do\?seq=(\d+)/) || [])[1];
        if (img) console.log(id, "via", kw, "seq=" + seq, img);
      }
    }
  }

  // Yokohama S3 direct guesses
  const yoko = [
    "https://ytc-bm.s3.us-east-2.amazonaws.com/WEB-ADVAN-SPORT-V105-WHT.png",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/2205_YTC_CONS_ADVAN-Sport-V105-Image_3QL-Web.webp",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/WEB-ADVAN-dB-V552-WHT.png",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/ADVAN-dB-V552-3QL-Web.webp",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/WEB-BLUEARTH-ES32-WHT.png",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/BluEarth-ES32-3QL-Web.webp",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/WEB-GEOLANDAR-G058-WHT.png",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/Geolandar-G058-3QL-Web.webp",
    "https://ytc-bm.s3.us-east-2.amazonaws.com/RS2300_1008_YTC_CONS_0810_YTC_CONS_ADVAN-0K.webp",
  ];
  console.log("\nYokohama S3:");
  for (const u of yoko) console.log(await head(u), u.split("/").pop());

  // Lassa - scrape revola page for related product image IDs
  const revola = await get("https://www.lassa.com.tr/desen/r01-02-revola");
  const allLassa = [...new Set(revola.html.match(/sys-master-hybris-image-prod\/images\/[^"'\s]+\.(?:jpg|webp|png)/gi) || [])];
  console.log("\nLassa revola images:", allLassa);

  // Lassa sitemap or desen list
  for (const slug of ["r01-01-driveways", "r01-03-competus-at-2", "r01-04-snoways-4", "driveways", "competus-at2", "snoways-4"]) {
    const r = await get("https://www.lassa.com.tr/desen/" + slug);
    if (r.status === 200) {
      const img = (r.html.match(/sys-master-hybris-image-prod\/images\/[^"'\s]+\.(?:jpg|webp)/i) || [])[0];
      console.log("lassa", slug, img);
    } else console.log("lassa", slug, r.status);
  }

  // Petlas - try lastik.com.tr or petlas global
  for (const u of [
    "https://www.petlas.com.tr/",
    "https://petlastire.com/products/velox-sport/",
    "https://www.petlas.com.tr/Content/Upload/Product/velox-sport.png",
    "https://www.petlas.com.tr/Content/Upload/Product/VeloxSport.png",
    "https://www.petlas.com.tr/Content/Upload/Product/PT741.png",
  ]) console.log("petlas", u, await head(u));

  // Starmaxx
  for (const u of [
    "https://www.starmaxx.com.tr/Content/Upload/Product/starmaxx-x1.png",
    "https://www.starmaxx.com.tr/Content/Upload/Product/X1.png",
  ]) console.log("starmaxx", u, await head(u));

  // Goodyear ultragrip direct DAM paths
  for (const u of [
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultrgripp3/ultrgripp3-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultrgrippf3/ultrgrippf3-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultrgripp2/ultrgripp2-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultrgripp/ultrgripp-front.jpg.transform/product-front/image.jpg",
    "https://www.goodyear.eu/content/dam/common/tires/goodyear/consumer/ultrgrippperf/ultrgrippperf-front.jpg.transform/product-front/image.jpg",
  ]) console.log("GY", await head(u), u.split("/").slice(-2).join("/"));
})();
