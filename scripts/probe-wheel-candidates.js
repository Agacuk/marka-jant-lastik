"use strict";

const candidates = [
  ["jant-boyama", "https://upload.wikimedia.org/wikipedia/commons/3/3f/Rims_painted_%282967657525%29.jpg"],
  ["jant-boyama", "https://www.wheelsclinic.co.uk/wp-content/uploads/elementor/thumbs/powder_coat_img-rbuc8u1eop9vlgzup9ekppu8siwwu6ccmi49q1bgvc.webp"],
  ["jant-kaynagi", "https://www.wheelsclinic.co.uk/wp-content/uploads/elementor/thumbs/alloy_repair_img-rbuce13agqdxrvg5d09bzwmz07aydxyxo7xw83m4h4.webp"],
  ["cnc-diamond-cut", "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091647-1024x730.jpg"],
  ["cnc-diamond-cut", "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091646-1024x807.jpg"],
  ["jant-duzeltme", "https://www.wheelsclinic.co.uk/wp-content/uploads/elementor/thumbs/alloy_repair_img-rbuce13agqdxrvg5d09bzwmz07aydxyxo7xw83m4h4.webp"],
  ["jant-tornalama", "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091642-1024x767.jpg"],
  ["jant-kumlama", "https://wheelrestore.com/wp-content/uploads/2024/09/wheel-blasting-machine-filtration.webp"],
  ["jant-kumlama", "https://cdn-ileacla.nitrocdn.com/ilYDMmbypfLPYlshJKwsgiRqkLHbqLCq/assets/images/optimized/rev-8fad0f9/liontyres.uk/wp-content/uploads/2025/06/3-20.53.06.webp"],
  ["jant-polisaj", "https://wheelrestore.com/wp-content/uploads/2025/05/wr-diamond-cut-before-after.webp"],
  ["jant-polisaj", "https://prestigewheelcentre.co.uk/blog/wp-content/uploads/2013/03/P3091645-1024x734.jpg"],
  ["diger-hizmetler", "https://cdn-ileacla.nitrocdn.com/ilYDMmbypfLPYlshJKwsgiRqkLHbqLCq/assets/images/optimized/rev-8fad0f9/liontyres.uk/wp-content/uploads/2025/06/1-20.53.06.webp"],
  ["diger-hizmetler", "https://thewheelmedics.co.uk/wp-content/uploads/2023/02/image3-scaled.jpeg"],
];

async function main() {
  for (const [id, url] of candidates) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      console.log(id, res.status, res.headers.get("content-type"), res.headers.get("content-length"), url.slice(0, 90));
    } catch (e) {
      console.log(id, "ERR", e.message);
    }
  }
}

main();
