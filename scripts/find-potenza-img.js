"use strict";
const UA = "Mozilla/5.0";
fetch("https://tires.bridgestone.com/en-us/tires/automotive/potenza/sport", {
  headers: { "User-Agent": UA },
})
  .then((r) => r.text())
  .then((h) => {
    const m = [...new Set(h.match(/\/content\/dam\/[^"'\s]+\.(?:jpg|png|webp)/gi) || [])].filter((x) =>
      /potenza|sport|tilted|60_Hr/i.test(x)
    );
    console.log(m.join("\n"));
  });
