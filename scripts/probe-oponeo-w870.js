"use strict";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
(async () => {
  const html = await fetch("https://www.oponeo.co.uk/tyre-model/starmaxx-incurro-w870", { headers: { "User-Agent": UA } }).then((r) => r.text());
  console.log("len", html.length);
  [...new Set(html.match(/src=\"([^\"]+)\"/gi) || [])].filter((s) => /tyre|tire|product|model|cdn|static|image/i.test(s)).slice(0, 25).forEach((s) => console.log(s));
  [...new Set(html.match(/url\([^)]+\)/gi) || [])].slice(0, 15).forEach((s) => console.log("CSS", s));
})();
