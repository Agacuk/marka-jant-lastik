"use strict";
const https = require("https");
const fs = require("fs");
const path = require("path");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

function get(url, referer) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : require("http");
    mod.get(url, { headers: { "User-Agent": UA, Referer: referer || url } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        get(new URL(res.headers.location, url).href, referer).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, buf: Buffer.concat(chunks), type: res.headers["content-type"] }));
    }).on("error", reject);
  });
}

(async () => {
  const urls = [
    ["bs1", "https://www.bridgestone.com/bwsc/assets/img/common/logo_header_en.png", "https://www.bridgestone.com/"],
    ["bs2", "https://www.bridgestone.com/bwsc/assets/img/common/logo_header_en_m.png", "https://www.bridgestone.com/"],
    ["pirelli", "https://binaries.pirelli.com/common/Logo_Pirelli150.png", "https://www.pirelli.com/"],
    ["nexen", "https://www.nexentire.com/international/assets/images/common/logo.png", "https://www.nexentire.com/"],
    ["kumho", "https://kumhotireusa.com/kumho-logo.png", "https://kumhotireusa.com/"],
    ["lassa", "https://www.lassa.com.tr/Dosyalar/content/lassa_logo_og.png", "https://www.lassa.com.tr/"],
    ["conti-footer", "https://www.continental-tires.com/content/experience-fragments/conti-tires-cms/ww/en/site/footer/master/_jcr_content/root/container_bottom/image.coreimg.svg/1676361234567/continental-logo.svg", "https://www.continental-tires.com/"],
  ];
  const out = path.join(__dirname, "..", "assets", "images", "brands");
  for (const [name, url, ref] of urls) {
    const r = await get(url, ref);
    console.log(name, r.status, r.type, r.buf.length, r.buf[25] !== undefined ? "colorType=" + r.buf[25] : "");
    if (r.status === 200 && r.buf.length > 200) {
      const ext = r.buf.toString("utf8", 0, 100).includes("<svg") ? "svg" : "png";
      fs.writeFileSync(path.join(out, `verify-${name}.${ext}`), r.buf);
    }
  }
})();
