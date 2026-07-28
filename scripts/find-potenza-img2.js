"use strict";
const UA = "Mozilla/5.0";
const urls = [
  "https://tires.bridgestone.com/content/dam/consumer/bst/shared/tires/potenza-sport/tilted.jpg",
  "https://tires.bridgestone.com/content/dam/consumer/bst/shared/tires/potenza-sport/PotenzaSport_60_Hr.jpg",
  "https://www.bridgestone.com/content/dam/bridgestone/consumer/bst/tires/models/potenza-sport/PotenzaSport_60_Hr.jpg",
  "https://s7d1.scene7.com/is/image/bridgestone/potenza-sport",
  "https://s7d1.scene7.com/is/image/bridgestone/potenza-sport-60hr",
  "https://s7g10.scene7.com/is/image/bridgestoneeu/potenza-sport",
];

(async () => {
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
      const ct = r.headers.get("content-type") || "";
      console.log(r.status, ct.slice(0, 30), u);
    } catch (e) {
      console.log("ERR", u, e.message);
    }
  }
})();
