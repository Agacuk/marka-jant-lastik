/**
 * Lastik Marka Vitrini — Statik katalog verisi
 * Görsel yolları: assets/images/tires/{marka}/{urun-id}.{svg|webp}
 * Gelecekte TireBrandAPI.getBrands() ile backend'den değiştirilebilir.
 */
(function (global) {
  "use strict";

  var PLACEHOLDER = "assets/images/tires/placeholder.svg";

  function tireImage(brandId, productId, ext) {
    return "assets/images/tires/" + brandId + "/" + productId + "." + (ext || "svg");
  }

  function product(brandId, id, name, category, description, tags, imageExt) {
    return {
      id: id,
      name: name,
      category: category,
      description: description,
      tags: tags,
      image: tireImage(brandId, id, imageExt),
    };
  }

  global.TireBrandsCatalog = {
    placeholderImage: PLACEHOLDER,
    contactUrl: "iletisim.html",
    whatsappUrl: "https://wa.me/905449483197",
    filters: [
      { id: "all", label: "Tümü" },
      { id: "yaz", label: "Yaz" },
      { id: "kis", label: "Kış" },
      { id: "4-mevsim", label: "4 Mevsim" },
      { id: "suv", label: "SUV" },
      { id: "performans", label: "Performans" },
      { id: "ev", label: "EV" },
    ],
    tagLabels: {
      yaz: "Yaz",
      kis: "Kış",
      "4-mevsim": "4 Mevsim",
      suv: "SUV",
      performans: "Performans",
      ev: "EV",
    },
    brands: [
      {
        id: "michelin",
        name: "Michelin",
        logo: "assets/images/brands/brand-michelin.svg",
        description:
          "Michelin'in binek, SUV, performans ve ticari araçlar için geliştirdiği premium lastik çözümleri.",
        products: [
          product("michelin", "pilot-sport-5", "Pilot Sport 5", "Performans Lastik", "Islak ve kuru zeminde üstün yol tutuş sunan ultra performans lastiği.", ["yaz", "performans"], "webp"),
          product("michelin", "primacy-5", "Primacy 5", "Konfor Lastiği", "Sessiz sürüş ve uzun ömür için optimize edilmiş premium tur lastiği.", ["yaz"], "webp"),
          product("michelin", "crossclimate-2", "CrossClimate 2", "4 Mevsim Lastik", "Yıl boyunca güvenli performans sunan çok mevsimli lastik teknolojisi.", ["4-mevsim"], "webp"),
          product("michelin", "latitude-sport-3", "Latitude Sport 3", "SUV Lastiği", "SUV ve crossover modeller için dengeli tutuş ve konfor.", ["suv", "yaz"], "webp"),
          product("michelin", "pilot-alpin", "Pilot Alpin", "Kış Lastiği", "Karlı ve buzlu yollarda güvenli sürüş için kış performansı.", ["kis", "performans"], "webp"),
          product("michelin", "e-primacy", "e.Primacy", "EV Lastiği", "Elektrikli araçlar için düşük yuvarlanma direnci ve yüksek menzil verimliliği.", ["ev", "yaz"], "webp"),
        ],
      },
      {
        id: "goodyear",
        name: "Goodyear",
        logo: "assets/images/brands/brand-goodyear.svg",
        description:
          "Goodyear'in performans, konfor ve güvenlik odaklı yaz, kış ve dört mevsim lastik portföyü.",
        products: [
          product("goodyear", "eagle-f1-asymmetric", "Eagle F1 Asymmetric", "Performans Lastik", "Yüksek hız stabilitesi ve keskin viraj tepkisi sunan spor lastik.", ["yaz", "performans"], "webp"),
          product("goodyear", "efficientgrip-performance", "EfficientGrip Performance", "Konfor Lastiği", "Yakıt verimliliği ve ıslak zemin fren mesafesi odaklı premium lastik.", ["yaz"], "webp"),
          product("goodyear", "vector-4seasons-gen3", "Vector 4Seasons Gen-3", "4 Mevsim Lastik", "Dört mevsim boyunca dengeli performans ve dayanıklılık.", ["4-mevsim"], "webp"),
          product("goodyear", "ultragrip-performance", "UltraGrip Performance", "Kış Lastiği", "Soğuk havalarda güçlü tutuş ve kısa fren mesafesi.", ["kis"], "webp"),
        ],
      },
      {
        id: "pirelli",
        name: "Pirelli",
        logo: "assets/images/brands/brand-pirelli.png",
        description:
          "Pirelli'nin performans, SUV ve premium segment araçlar için geliştirdiği lastik teknolojileri.",
        products: [
          product("pirelli", "p-zero", "P Zero", "Performans Lastik", "Spor otomobiller için maksimum yol tutuş ve hassas direksiyon tepkisi.", ["yaz", "performans"], "webp"),
          product("pirelli", "cinturato-p7", "Cinturato P7", "Konfor Lastiği", "Düşük gürültü seviyesi ve yakıt tasarrufu sunan premium tur lastiği.", ["yaz"], "webp"),
          product("pirelli", "scorpion-verde", "Scorpion Verde", "SUV Lastiği", "SUV modelleri için çevre dostu ve dengeli performans.", ["suv", "yaz"], "webp"),
          product("pirelli", "powergy", "Powergy", "4 Mevsim Lastik", "Günlük kullanımda konfor ve güvenlik odaklı çok yönlü lastik.", ["4-mevsim"], "webp"),
        ],
      },
      {
        id: "continental",
        name: "Continental",
        logo: "assets/images/brands/brand-continental.svg",
        description:
          "Continental'in binek ve SUV segmentinde güvenlik, konfor ve performans odaklı lastik çözümleri.",
        products: [
          product("continental", "premiumcontact-7", "PremiumContact 7", "Konfor Lastiği", "Premium sınıf konfor, güvenlik ve ıslak zemin performansı.", ["yaz"], "webp"),
          product("continental", "sportcontact-7", "SportContact 7", "Performans Lastik", "Dinamik sürüş için geliştirilmiş ultra yüksek performans lastiği.", ["yaz", "performans"], "webp"),
          product("continental", "ecocontact-6", "EcoContact 6", "Eco Lastik", "Düşük yuvarlanma direnci ile verimli sürüş deneyimi.", ["yaz", "ev"], "webp"),
          product("continental", "allseasoncontact", "AllSeasonContact", "4 Mevsim Lastik", "Dört mevsim güvenliği sunan çok amaçlı lastik.", ["4-mevsim"], "webp"),
        ],
      },
      {
        id: "bridgestone",
        name: "Bridgestone",
        logo: "assets/images/brands/brand-bridgestone.png",
        description:
          "Bridgestone'un performans, konfor ve SUV segmentlerinde sunduğu global lastik teknolojileri.",
        products: [
          product("bridgestone", "potenza-sport", "Potenza Sport", "Performans Lastik", "Sportif sürüş dinamikleri için geliştirilmiş yüksek tutuş lastiği.", ["yaz", "performans"], "webp"),
          product("bridgestone", "turanza-t005", "Turanza T005", "Konfor Lastiği", "Uzun yol konforu ve sessiz kabin deneyimi sunan premium lastik.", ["yaz"], "webp"),
          product("bridgestone", "blizzak-lm005", "Blizzak LM005", "Kış Lastiği", "Kış mevsiminde güvenilir frenleme ve yol tutuş performansı.", ["kis"], "webp"),
          product("bridgestone", "alenza-001", "Alenza 001", "SUV Lastiği", "SUV ve crossover araçlar için premium konfor ve dayanıklılık.", ["suv", "yaz"], "webp"),
        ],
      },
      {
        id: "lassa",
        name: "Lassa",
        logo: "assets/images/brands/brand-lassa.png",
        description:
          "Lassa'nın binek, SUV ve ticari segmentlerde sunduğu yerli üretim güvenilir lastik çözümleri.",
        products: [
          product("lassa", "revola", "Revola", "4 Mevsim Lastik", "Dört mevsim kullanım için dengeli performans sunan lastik.", ["4-mevsim"], "webp"),
          product("lassa", "driveways", "Driveways", "Konfor Lastiği", "Günlük kullanım için ekonomik ve konforlu tur lastiği.", ["yaz"]),
          product("lassa", "competus", "Competus", "SUV Lastiği", "SUV ve hafif ticari araçlar için dayanıklı lastik seçeneği.", ["suv"]),
          product("lassa", "snoways", "Snoways", "Kış Lastiği", "Kış koşullarında güvenli sürüş için özel kış deseni.", ["kis"]),
        ],
      },
      {
        id: "petlas",
        name: "Petlas",
        logo: "assets/images/brands/brand-petlas.svg",
        description:
          "Petlas'ın binek, SUV ve kış segmentlerinde sunduğu yerli üretim lastik portföyü.",
        products: [
          product("petlas", "velox-sport", "Velox Sport", "Performans Lastik", "Dinamik sürüş için sportif karakterli lastik.", ["yaz", "performans"]),
          product("petlas", "explero", "Explero", "SUV Lastiği", "SUV modelleri için güçlü yapı ve dengeli yol tutuşu.", ["suv", "yaz"]),
          product("petlas", "imperium", "Imperium", "Konfor Lastiği", "Konforlu sürüş ve uzun kilometre ömrü sunan tur lastiği.", ["yaz"]),
          product("petlas", "snowmaster", "Snowmaster", "Kış Lastiği", "Karlı ve buzlu yollarda güvenli kış performansı.", ["kis"]),
        ],
      },
      {
        id: "hankook",
        name: "Hankook",
        logo: "assets/images/brands/brand-hankook.svg",
        description:
          "Hankook'un performans, SUV ve dört mevsim segmentlerinde sunduğu global lastik teknolojileri.",
        products: [
          product("hankook", "ventus-s1-evo3", "Ventus S1 evo3", "Performans Lastik", "Yüksek hız stabilitesi ve sportif yol tutuşu.", ["yaz", "performans"], "webp"),
          product("hankook", "kinergy-4s2", "Kinergy 4S2", "4 Mevsim Lastik", "Dört mevsim güvenliği ve konfor odaklı lastik.", ["4-mevsim"], "webp"),
          product("hankook", "dynapro", "Dynapro", "SUV Lastiği", "SUV ve 4x4 araçlar için dayanıklı ve dengeli performans.", ["suv"], "webp"),
          product("hankook", "winter-icept", "Winter i*cept", "Kış Lastiği", "Soğuk havalarda güvenilir tutuş ve frenleme.", ["kis"], "webp"),
        ],
      },
      {
        id: "kumho",
        name: "Kumho",
        logo: "assets/images/brands/brand-kumho.png",
        description:
          "Kumho'nun performans, konfor ve SUV segmentlerinde sunduğu teknoloji odaklı lastik çözümleri.",
        products: [
          product("kumho", "ecsta-ps71", "Ecsta PS71", "Performans Lastik", "Sportif sürüş dinamikleri için geliştirilmiş lastik.", ["yaz", "performans"], "webp"),
          product("kumho", "solus-4s", "Solus 4S", "4 Mevsim Lastik", "Dört mevsim kullanım için dengeli performans.", ["4-mevsim"], "webp"),
          product("kumho", "wintercraft", "WinterCraft", "Kış Lastiği", "Kış koşullarında güvenli yol tutuşu.", ["kis"], "webp"),
          product("kumho", "crugen-premium", "Crugen Premium", "SUV Lastiği", "SUV modelleri için konfor ve dayanıklılık.", ["suv", "yaz"], "webp"),
          product("kumho", "ecowing", "Ecowing", "Eco Lastik", "Yakıt verimliliği odaklı çevre dostu lastik.", ["yaz", "ev"], "webp"),
        ],
      },
      {
        id: "nexen",
        name: "Nexen",
        logo: "assets/images/brands/brand-nexen.png",
        description:
          "Nexen'in binek ve SUV segmentlerinde sunduğu performans ve konfor odaklı lastik portföyü.",
        products: [
          product("nexen", "nfera-sport", "N'Fera Sport", "Performans Lastik", "Sportif karakter ve yüksek hız güvenliği.", ["yaz", "performans"], "webp"),
          product("nexen", "nblue-4season", "N'Blue 4Season", "4 Mevsim Lastik", "Yıl boyunca dengeli performans sunan lastik.", ["4-mevsim"], "webp"),
          product("nexen", "winguard-winspike", "Winguard Winspike", "Kış Lastiği", "Karlı yollarda güvenli sürüş için kış lastiği.", ["kis"], "webp"),
          product("nexen", "roadian-gtx", "Roadian GTX", "SUV Lastiği", "SUV ve crossover araçlar için premium konfor.", ["suv"], "webp"),
          product("nexen", "nblue-ev", "N'Blue EV", "EV Lastiği", "Elektrikli araçlar için verimli ve sessiz sürüş.", ["ev", "yaz"]),
        ],
      },
      {
        id: "yokohama",
        name: "Yokohama",
        logo: "assets/images/brands/brand-yokohama.png",
        description:
          "Yokohama'nın performans, SUV ve dört mevsim segmentlerinde sunduğu Japon mühendislik lastikleri.",
        products: [
          product("yokohama", "advan-sport-v105", "Advan Sport V105", "Performans Lastik", "Ultra yüksek performans ve hassas direksiyon kontrolü.", ["yaz", "performans"], "webp"),
          product("yokohama", "bluearth", "BluEarth", "Eco Lastik", "Düşük yuvarlanma direnci ile verimli sürüş.", ["yaz", "ev"]),
          product("yokohama", "geolandar", "Geolandar", "SUV Lastiği", "SUV ve 4x4 araçlar için çok yönlü performans.", ["suv"], "webp"),
          product("yokohama", "iceguard", "iceGuard", "Kış Lastiği", "Buzlu ve karlı yollarda güvenli kış performansı.", ["kis"], "webp"),
          product("yokohama", "advan-db-v552", "Advan dB V552", "Konfor Lastiği", "Sessiz sürüş ve konfor odaklı premium tur lastiği.", ["yaz"]),
        ],
      },
      {
        id: "bfgoodrich",
        name: "BFGoodrich",
        logo: "assets/images/brands/brand-bfgoodrich.png",
        description:
          "BFGoodrich'in performans, arazi ve SUV segmentlerinde sunduğu dayanıklı lastik teknolojileri.",
        products: [
          product("bfgoodrich", "g-force-pilot-sport", "g-Force Pilot Sport", "Performans Lastik", "Sportif sürüş için yüksek tutuş ve stabilite.", ["yaz", "performans"]),
          product("bfgoodrich", "advantage-touring", "Advantage Touring", "Konfor Lastiği", "Uzun ömür ve konforlu sürüş deneyimi.", ["yaz"], "webp"),
          product("bfgoodrich", "all-terrain-ko2", "All-Terrain T/A KO2", "SUV Lastiği", "Arazi ve şehir kullanımı için dayanıklı SUV lastiği.", ["suv", "4-mevsim"], "webp"),
          product("bfgoodrich", "g-force-winter", "g-Force Winter", "Kış Lastiği", "Kış koşullarında güvenilir performans.", ["kis"]),
        ],
      },
      {
        id: "starmaxx",
        name: "Starmaxx",
        logo: "assets/images/brands/brand-starmaxx.svg",
        description:
          "Starmaxx'ın ekonomik ve güvenilir binek, SUV ve ticari lastik çözümleri.",
        products: [
          product("starmaxx", "starmaxx-x1", "Starmaxx X1", "Konfor Lastiği", "Günlük kullanım için ekonomik tur lastiği.", ["yaz"]),
          product("starmaxx", "starmaxx-winter", "Starmaxx Winter", "Kış Lastiği", "Kış mevsiminde güvenli sürüş için kış lastiği.", ["kis"]),
          product("starmaxx", "starmaxx-suv", "Starmaxx SUV", "SUV Lastiği", "SUV modelleri için dayanıklı lastik seçeneği.", ["suv"]),
          product("starmaxx", "starmaxx-eco", "Starmaxx Eco", "Eco Lastik", "Yakıt verimliliği odaklı ekonomik lastik.", ["yaz"]),
        ],
      },
    ],
  };
})(window);
