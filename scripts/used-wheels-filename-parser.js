/**
 * 2. el jant dosya adı ayrıştırıcı — build + rapor için
 */
"use strict";

const BRAND_TOKENS = [
  "Mercedes AMG",
  "Mercedes-Benz",
  "Mercedes",
  "Land Rover",
  "Range Rover",
  "Volkswagen",
  "Škoda",
  "Skoda",
  "Peugeot-Citroën",
  "Peugeot",
  "Citroën",
  "Citroen",
  "BMW M763",
  "BMW",
  "Audi",
  "Honda",
  "Toyota",
  "Renault",
  "Opel",
  "Fiat",
  "Seat",
  "Vossen",
  "Babayaga",
  "BBS",
  "Crome",
];

const FINISH_TIERS = [
  { id: 1, label: "Krom", re: /\b(krom|chrome|crome)\b/i },
  { id: 2, label: "Forged", re: /\b(forged|vossen|babayaga|m763|amg)\b/i },
  { id: 3, label: "Diamond Cut", re: /\bdiamond[\s-]?cut\b/i },
  { id: 4, label: "Parlak Siyah", re: /\b(parlak\s*siyah|gloss\s*black|matte\s*black|\bsiyah\b|\bblack\b)\b/i },
  { id: 5, label: "Antrasit", re: /\b(antrasit|anthracite|gunmetal|graphite)\b/i },
  { id: 6, label: "Gümüş", re: /\b(gümüş|gumus|\bsilver\b|\boem\b)\b/i },
  { id: 7, label: "Çelik", re: /\b(çelik|celik|\bsteel\b)\b/i },
];

const INCH_WORD = "(?:\\u0130n\\u00E7|\\u0130nch|In\\u00E7|Inch|IN\\u00C7|inch|in\\u00E7|INCH)";

function normalizeBase(filename) {
  return filename
    .replace(/\.jpe?g$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractInch(text) {
  const m =
    text.match(new RegExp("\\b(\\d{2})\\s*" + INCH_WORD + "(?=\\s|[.\"]|$)", "i")) ||
    text.match(/\b(1[4-9]|2[0-2])\s+(?=\d{1,2}x\d)/i) ||
    text.match(/\b(1[4-9]|2[0-2])"\b/);
  return m ? m[1] : null;
}

function extractPcd(text) {
  const m = text.match(/\b(\d{1,2}x\d{2,3}(?:\.\d+)?(?:-\d{2,3})?)\b/i);
  return m ? m[1] : null;
}

function extractEt(text) {
  const m = text.match(/\bET\s?(\d{1,2})\b/i);
  return m ? "ET" + m[1] : null;
}

function extractType(text) {
  if (/\baftermarket\b/i.test(text)) return "Aftermarket";
  if (/\boem\b/i.test(text)) return "OEM";
  return null;
}

function detectTier(text) {
  for (const tier of FINISH_TIERS) {
    if (tier.re.test(text)) return { id: tier.id, label: tier.label };
  }

  const inch = extractInch(text);
  if (inch && Number(inch) >= 19 && /\bbmw\b|\bmercedes\b|\baudi\b|\bporsche\b/i.test(text)) {
    return { id: 2, label: "Forged" };
  }

  if (/\bjant tak/i.test(text) && !/\boem\b/i.test(text)) {
    return { id: 7, label: "Çelik" };
  }

  return { id: 6, label: "Gümüş" };
}

function stripTechnicalTokens(text) {
  return text
    .replace(new RegExp("\\b\\d{2}\\s*" + INCH_WORD + "(?=\\s|[.\"]|$)", "gi"), " ")
    .replace(/\b(1[4-9]|2[0-2])"\b/g, " ")
    .replace(/\b\d{1,2}x\d{2,3}(?:\.\d+)?(?:-\d{2,3})?\b/gi, " ")
    .replace(/\bET\s?\d{1,2}\b/gi, " ")
    .replace(/\b(OEM|Aftermarket|Forged|İstanbul|FR)\b/gi, " ")
    .replace(/\bJant(?:\s+Lastik)?\s+Tak[\u0131iİI]+m[\u0131iİI]*(?=\s|$)/gi, " ")
    .replace(/\b(krom|chrome|crome|forged|diamond cut|parlak siyah|antrasit|silver|steel|çelik|celik)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(raw) {
  if (!raw) return "";
  return raw
    .replace(/\s+(OEM|Aftermarket|Forged)$/i, "")
    .replace(/^(OEM|Aftermarket)\s+/i, "")
    .replace(/\s+Jant$/i, "")
    .replace(/\s+(İstanbul|FR)$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(text) {
  const oemBrand = text.match(
    new RegExp(
      "\\bOEM\\s+(" +
        BRAND_TOKENS.map(function (b) {
          return b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }).join("|") +
        ")",
      "i"
    )
  );
  if (oemBrand) return normalizeTitle(oemBrand[1]);

  for (const brand of BRAND_TOKENS.slice().sort(function (a, b) {
    return b.length - a.length;
  })) {
    const re = new RegExp("\\b" + brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    const m = text.match(re);
    if (!m) continue;

    const after = text.slice(m.index).trim();
    const brandPart = after.match(
      new RegExp(
        "^(" +
          brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
          "(?:\\s+(?!\\d{2}\\b|Jant\\b|OEM\\b|Aftermarket\\b)[A-ZÇĞİÖŞÜa-z][\\w-]*)?)",
        "i"
      )
    );
    if (brandPart) return normalizeTitle(brandPart[1]);
    return normalizeTitle(m[0]);
  }

  const cleaned = stripTechnicalTokens(text);
  if (cleaned && cleaned.length > 1 && !/^\d/.test(cleaned)) {
    return normalizeTitle(cleaned);
  }

  const generic = text.match(/\b([A-ZÇĞİÖŞÜ][\w-]+)\s+Jant\s+Tak[\u0131iİI]+m[\u0131iİI]*/i);
  if (generic) return normalizeTitle(generic[1]);

  return "";
}

function buildSpecs(parsed) {
  const specs = [];
  if (parsed.inch) specs.push({ key: "inch", label: parsed.inch + '"' });
  if (parsed.pcd) specs.push({ key: "pcd", label: parsed.pcd });
  if (parsed.et) specs.push({ key: "et", label: parsed.et });
  if (parsed.type) specs.push({ key: "type", label: parsed.type });
  return specs;
}

function parseFilename(filename) {
  const base = normalizeBase(filename);
  const inch = extractInch(base);
  const pcd = extractPcd(base);
  const et = extractEt(base);
  const type = extractType(base);
  const tier = detectTier(base);
  const title = extractTitle(base);
  const specs = buildSpecs({ inch: inch, pcd: pcd, et: et, type: type });

  return {
    filename: filename,
    title: title,
    specs: specs,
    tier: tier.id,
    tierLabel: tier.label,
    parsed: Boolean(title),
    parseDetails: { inch: inch, pcd: pcd, et: et, type: type },
  };
}

module.exports = {
  parseFilename: parseFilename,
  detectTierFromText: detectTier,
  FINISH_TIERS: FINISH_TIERS,
};
