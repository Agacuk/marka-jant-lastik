const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IMAGES_ROOT = path.join(ROOT, "assets", "images");

const TARGET_FILES = [
  "index.html",
  "jantlar.html",
  "lastikler.html",
  "balans.html",
  "jant-onarim.html",
  "lastik-degisimi.html",
  "lastik-oteli.html",
  "iletisim.html",
  "sss.html",
  path.join("assets", "css", "style.css"),
  path.join("assets", "js", "script.js"),
];

function collectWebpSet(dir, base = "") {
  const set = new Set();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectWebpSet(full, rel).forEach((v) => set.add(v));
    } else if (/\.webp$/i.test(entry.name)) {
      set.add(rel.replace(/\\/g, "/").replace(/\.webp$/i, "").toLowerCase());
    }
  }
  return set;
}

const webpKeys = collectWebpSet(IMAGES_ROOT);

function hasWebp(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/").replace(/\.(jpg|jpeg|png)$/i, "");
  return webpKeys.has(normalized.toLowerCase());
}

function resolveToImagesRelative(fullPath) {
  let p = fullPath.replace(/\\/g, "/");

  if (/^https?:\/\//i.test(p)) {
    const idx = p.indexOf("/assets/images/");
    if (idx === -1) return null;
    p = p.slice(idx + "/assets/images/".length);
  } else if (p.startsWith("assets/images/")) {
    p = p.slice("assets/images/".length);
  } else if (p.startsWith("../images/")) {
    p = p.slice("../images/".length);
  } else {
    return null;
  }

  return p;
}

function replaceExtensions(content) {
  const pattern =
    /((?:https?:\/\/[^\s"'<>]+?\/assets\/images\/|assets\/images\/|\.\.\/images\/)[^\s"'<>()]+?)\.(jpg|jpeg|png)\b/gi;

  const changes = [];
  const updated = content.replace(pattern, (full, prefix, ext) => {
    const relative = resolveToImagesRelative(`${prefix}.${ext}`);
    if (!relative || !hasWebp(relative)) {
      return full;
    }
    changes.push(`${prefix}.${ext} -> ${prefix}.webp`);
    return `${prefix}.webp`;
  });

  return { updated, changes };
}

const changedFiles = [];
const unchangedFiles = [];

for (const relFile of TARGET_FILES) {
  const filePath = path.join(ROOT, relFile);
  if (!fs.existsSync(filePath)) {
    console.error("Missing:", relFile);
    continue;
  }

  const original = fs.readFileSync(filePath, "utf8");
  const { updated, changes } = replaceExtensions(original);

  if (changes.length > 0) {
    fs.writeFileSync(filePath, updated, "utf8");
    changedFiles.push({ file: relFile.replace(/\\/g, "/"), changes });
  } else {
    unchangedFiles.push(relFile.replace(/\\/g, "/"));
  }
}

console.log("=== CHANGED FILES ===");
if (!changedFiles.length) {
  console.log("(none)");
} else {
  changedFiles.forEach(({ file, changes }) => {
    console.log(`\n${file} (${changes.length} refs)`);
    changes.forEach((c) => console.log(`  - ${c}`));
  });
}

console.log("\n=== ALREADY UP TO DATE ===");
unchangedFiles.forEach((f) => console.log(`  - ${f}`));

console.log(`\nTotal changed: ${changedFiles.length} / ${TARGET_FILES.length}`);
