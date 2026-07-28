"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const candidates = {
  michelin: [
    "https://www.michelin.com/etc/designs/michelincorp/clientlibs/images/michelin-logo-white.svg",
    "https://www.michelinman.com/etc/designs/michelin-man/clientlibs/images/logo.svg",
  ],
  goodyear: [
    "https://www.goodyear.eu/content/dam/goodyear/consumer/common/logos/goodyear-logo-white.svg",
    "https://www.goodyear.eu/etc.clientlibs/gyr/clientlibs/clientlib-site/resources/images/goodyear-logo.svg",
  ],
  hankook: [
    "https://asset.hankooktire.com/content/dam/hankooktire/local/svg/logo-white.svg",
    "https://asset.hankooktire.com/content/dam/hankooktire/global/logo/logo.svg",
  ],
  bridgestone: [
    "https://tires.bridgestone.com/etc.clientlibs/bridgestone-consumer/clientlibs/clientlib-site/resources/images/bridgestone-logo-white.svg",
    "https://www.bridgestone.com/content/dam/bridgestone/consumer/shared/logos/bridgestone-logo.svg",
  ],
  continental: [
    "https://www.continental-tires.com/etc.clientlibs/ctc/clientlibs/clientlib-site/resources/images/continental-logo-white.svg",
  ],
  pirelli: [
    "https://www.pirelli.com/content/dam/pirelli/website/logo/pirelli-logo.svg",
  ],
  kumho: [
    "https://www.kumhotire.com/images/common/logo.svg",
    "https://www.kumhotire.com/images/common/logo_w.svg",
  ],
  nexen: [
    "https://www.nexentire.com/assets/images/common/logo.svg",
    "https://www.nexentire.com/assets/images/common/logo_w.png",
  ],
  yokohama: [
    "https://www.yokohamatire.com/images/yokohama-logo.svg",
    "https://www.yokohama.eu/wp-content/themes/yokohama/assets/img/logo.svg",
  ],
  bfgoodrich: [
    "https://www.bfgoodrich.co.uk/etc.clientlibs/bfg/clientlibs/clientlib-site/resources/images/bfgoodrich-logo.svg",
  ],
  lassa: [
    "https://www.lassa.com.tr/Assets/Images/logo.svg",
    "https://www.lassa.com.tr/Assets/Images/logo-white.svg",
  ],
  petlas: [
    "https://www.petlas.com/storage/app/media/logo.svg",
  ],
  starmaxx: [
    "https://www.starmaxx.com/storage/app/media/logo.svg",
  ],
};

async function probe(id, urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      const ct = r.headers.get("content-type") || "";
      const buf = Buffer.from(await r.arrayBuffer());
      console.log(id, r.status, buf.length, ct.slice(0, 40), url.split("/").slice(-2).join("/"));
      if (r.ok && buf.length > 200 && (ct.includes("svg") || url.endsWith(".svg") || buf.toString("utf8", 0, 100).includes("<svg"))) {
        return { url, buf };
      }
    } catch (e) {
      console.log(id, "ERR", url, e.message);
    }
  }
  return null;
}

(async () => {
  for (const [id, urls] of Object.entries(candidates)) {
    await probe(id, urls);
  }
})();
