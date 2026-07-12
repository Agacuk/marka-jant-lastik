const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));

const issues = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(ROOT, file), "utf8");

  if (content.includes("+90 (000)")) issues.push(`${file}: placeholder phone`);
  if (content.includes("info@markajantlastik.com")) issues.push(`${file}: old email`);
  if (content.includes("Adres bilgisi eklenecek")) issues.push(`${file}: placeholder address`);
  if (content.includes("hero-showroom")) issues.push(`${file}: missing hero image ref`);
  if (content.includes('href="#" class="hero__btn')) issues.push(`${file}: dead CTA`);
  if (content.includes('href="#" class="site-footer__contact-value"')) issues.push(`${file}: dead maps link`);

  const imgs = [...content.matchAll(/src="(assets\/images\/[^"]+)"/g)];
  for (const [, src] of imgs) {
    const full = path.join(ROOT, src.replace(/\//g, path.sep));
    if (!fs.existsSync(full)) issues.push(`${file}: missing image ${src}`);
  }
}

if (issues.length) {
  console.log("ISSUES:");
  issues.forEach((i) => console.log(" -", i));
  process.exit(1);
}

console.log("All checks passed for", htmlFiles.length, "pages");
