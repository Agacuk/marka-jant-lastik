/**
 * Lastik Marka Vitrini — Statik katalog verisi
 * Gelecekte TireBrandAPI.getBrands() ile backend'den değiştirilebilir.
 */
(function (global) {
  "use strict";

  var PLACEHOLDER = "assets/images/tires/placeholder.svg";

  function product(id, name, category, description, tags, image) {
    return {
      id: id,
      name: name,
      category: category,
      description: description,
      tags: tags,
      image: image || PLACEHOLDER,
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
        displayName: "MICHELIN",
        logo: "assets/images/brands/brand-michelin.svg",
        description:
          "Michelin'in binek, SUV, performans ve ticari araçlar için geliştirdiği premium lastik çözümleri.",
        products: [
          product("pilot-sport-5", "Pilot Sport 5", "Performans Lastik", "Islak ve kuru zeminde üstün yol tutuş sunan ultra performans lastiği.", ["yaz", "performans"], "assets/images/tires/michelin/pilot-sport-5.webp"),
          product("primacy-5", "Primacy 5", "Konfor Lastiği", "Sessiz sürüş ve uzun ömür için optimize edilmiş premium tur lastiği.", ["yaz"], "assets/images/tires/michelin/primacy-5.webp"),
          product("crossclimate-2", "CrossClimate 2", "4 Mevsim Lastik", "Yıl boyunca güvenli performans sunan çok mevsimli lastik teknolojisi.", ["4-mevsim"], "assets/images/tires/michelin/crossclimate-2.webp"),
          product("latitude-sport-3", "Latitude Sport 3", "SUV Lastiği", "SUV ve crossover modeller için dengeli tutuş ve konfor.", ["suv", "yaz"], "assets/images/tires/michelin/latitude-sport-3.webp"),
          product("pilot-alpin", "Pilot Alpin", "Kış Lastiği", "Karlı ve buzlu yollarda güvenli sürüş için kış performansı.", ["kis", "performans"], "assets/images/tires/michelin/pilot-alpin.webp"),
          product("e-primacy", "e.Primacy", "EV Lastiği", "Elektrikli araçlar için düşük yuvarlanma direnci ve yüksek menzil verimliliği.", ["ev", "yaz"], "assets/images/tires/michelin/e-primacy.webp"),
        ],
      },
      {
        id: "goodyear",
        name: "Goodyear",
        displayName: "GOODYEAR",
        logo: null,
        description:
          "Goodyear'in performans, konfor ve güvenlik odaklı yaz, kış ve dört mevsim lastik portföyü.",
        products: [
          product("eagle-f1-asymmetric", "Eagle F1 Asymmetric", "Performans Lastik", "Yüksek hız stabilitesi ve keskin viraj tepkisi sunan spor lastik.", ["yaz", "performans"], "assets/images/tires/goodyear/eagle-f1-asymmetric.webp"),
          product("efficientgrip-performance", "EfficientGrip Performance", "Konfor Lastiği", "Yakıt verimliliği ve ıslak zemin fren mesafesi odaklı premium lastik.", ["yaz"], "assets/images/tires/goodyear/efficientgrip-performance.webp"),
          product("ultragrip-performance", "UltraGrip Performance", "Kış Lastiği", "Soğuk havalarda güçlü tutuş ve kısa fren mesafesi.", ["kis"], "assets/images/tires/goodyear/ultragrip-performance.webp"),
          product("vector-4seasons-gen3", "Vector 4Seasons Gen-3", "4 Mevsim Lastik", "Dört mevsim boyunca dengeli performans ve dayanıklılık.", ["4-mevsim"], "assets/images/tires/goodyear/vector-4seasons-gen3.webp"),
          product("ultragrip-ice", "UltraGrip Ice", "Kış Lastiği", "Buzlu yüzeylerde ekstra güvenlik sağlayan kış lastiği.", ["kis"], "assets/images/tires/goodyear/ultragrip-ice.webp"),
        ],
      },
      {
        id: "pirelli",
        name: "Pirelli",
        displayName: "PIRELLI",
        logo: "assets/images/brands/brand-pirelli.svg",
        description:
          "Pirelli'nin performans, SUV ve premium segment araçlar için geliştirdiği lastik teknolojileri.",
        products: [
          product("p-zero", "P Zero", "Performans Lastik", "Spor otomobiller için maksimum yol tutuş ve hassas direksiyon tepkisi.", ["yaz", "performans"], "assets/images/tires/pirelli/p-zero.webp"),
          product("cinturato-p7", "Cinturato P7", "Konfor Lastiği", "Düşük gürültü seviyesi ve yakıt tasarrufu sunan premium tur lastiği.", ["yaz"], "assets/images/tires/pirelli/cinturato-p7.webp"),
          product("scorpion-verde", "Scorpion Verde", "SUV Lastiği", "SUV modelleri için çevre dostu ve dengeli performans.", ["suv", "yaz"], "assets/images/tires/pirelli/scorpion-verde.webp"),
          product("powergy", "Powergy", "4 Mevsim Lastik", "Günlük kullanımda konfor ve güvenlik odaklı çok yönlü lastik.", ["4-mevsim"], "assets/images/tires/pirelli/powergy.webp"),
          product("winter-sottozero", "Winter Sottozero", "Kış Lastiği", "Premium segment kış koşulları için yüksek performans.", ["kis", "performans"], "assets/images/tires/pirelli/winter-sottozero.webp"),
        ],
      },
      {
        id: "continental",
        name: "Continental",
        displayName: "CONTINENTAL",
        logo: null,
        description:
          "Continental'in binek ve SUV segmentinde güvenlik, konfor ve performans odaklı lastik çözümleri.",
        products: [
          product("premiumcontact-7", "PremiumContact 7", "Konfor Lastiği", "Premium sınıf konfor, güvenlik ve ıslak zemin performansı.", ["yaz"], "assets/images/tires/continental/premiumcontact-7.webp"),
          product("sportcontact-7", "SportContact 7", "Performans Lastik", "Dinamik sürüş için geliştirilmiş ultra yüksek performans lastiği.", ["yaz", "performans"], "assets/images/tires/continental/sportcontact-7.webp"),
          product("ecocontact-6", "EcoContact 6", "Eco Lastik", "Düşük yuvarlanma direnci ile verimli sürüş deneyimi.", ["yaz", "ev"], "assets/images/tires/continental/ecocontact-6.webp"),
          product("allseasoncontact", "AllSeasonContact", "4 Mevsim Lastik", "Dört mevsim güvenliği sunan çok amaçlı lastik.", ["4-mevsim"], "assets/images/tires/continental/allseasoncontact.webp"),
          product("wintercontact-ts870", "WinterContact TS870", "Kış Lastiği", "Karlı ve ıslak kış yollarında üst düzey güvenlik.", ["kis"], "assets/images/tires/continental/wintercontact-ts870.webp"),
        ],
      },
      {
        id: "bridgestone",
        name: "Bridgestone",
        displayName: "BRIDGESTONE",
        logo: "assets/images/brands/brand-bridgestone.svg",
        description:
          "Bridgestone'un performans, konfor ve SUV segmentlerinde sunduğu global lastik teknolojileri.",
        products: [
          product("potenza-sport", "Potenza Sport", "Performans Lastik", "Spor sürüş dinamikleri için geliştirilmiş yüksek tutuş lastiği.", ["yaz", "performans"], "assets/images/tires/bridgestone/potenza-sport.webp"),
          product("turanza-t005", "Turanza T005", "Konfor Lastiği", "Uzun yol konforu ve sessiz kabin deneyimi sunan premium lastik.", ["yaz"], "assets/images/tires/bridgestone/turanza-t005.webp"),
          product("blizzak-lm005", "Blizzak LM005", "Kış Lastiği", "Kış mevsiminde güvenilir frenleme ve yol tutuş performansı.", ["kis"], "assets/images/tires/bridgestone/blizzak-lm005.webp"),
          product("alenza-001", "Alenza 001", "SUV Lastiği", "SUV ve crossover araçlar için premium konfor ve dayanıklılık.", ["suv", "yaz"], "assets/images/tires/bridgestone/alenza-001.webp"),
          product("turismo-er300", "Turismo ER300", "Eco Lastik", "Günlük kullanımda verimlilik ve güvenlik dengesi.", ["yaz", "ev"], "assets/images/tires/bridgestone/turismo-er300.webp"),
        ],
      },
      {
        id: "lassa",
        name: "Lassa",
        displayName: "LASSA",
        logo: "assets/images/brands/lassa-seeklogo.svg",
        description:
          "Lassa'nın binek, SUV ve ticari segmentlerde sunduğu yerli üretim güvenilir lastik çözümleri.",
        products: [
          product("driveways", "Driveways", "Konfor Lastiği", "Günlük kullanım için ekonomik ve konforlu tur lastiği.", ["yaz"], "assets/images/tires/lassa/driveways.webp"),
          product("revola", "Revola", "4 Mevsim Lastik", "Dört mevsim kullanım için dengeli performans sunan lastik.", ["4-mevsim"], "assets/images/tires/lassa/revola.webp"),
          product("competus", "Competus", "SUV Lastiği", "SUV ve hafif ticari araçlar için dayanıklı lastik seçeneği.", ["suv"], "assets/images/tires/lassa/competus.webp"),
          product("snoways", "Snoways", "Kış Lastiği", "Kış koşullarında güvenli sürüş için özel kış deseni.", ["kis"], "assets/images/tires/lassa/snoways.webp"),
          product("transway", "Transway", "Ticari Lastik", "Hafif ticari araçlar için uzun ömürlü kullanım.", ["yaz"], "assets/images/tires/lassa/transway.webp"),
        ],
      },
      {
        id: "petlas",
        name: "Petlas",
        displayName: "PETLAS",
        logo: "assets/images/brands/brand-petlas.svg",
        description:
          "Petlas'ın binek, SUV ve kış segmentlerinde sunduğu yerli üretim lastik portföyü.",
        products: [
          product("explero", "Explero", "SUV Lastiği", "SUV modelleri için güçlü yapı ve dengeli yol tutuşu.", ["suv", "yaz"], "assets/images/tires/petlas/explero.webp"),
          product("imperium", "Imperium", "Konfor Lastiği", "Konforlu sürüş ve uzun kilometre ömrü sunan tur lastiği.", ["yaz"], "assets/images/tires/petlas/imperium.webp"),
          product("velox-sport", "Velox Sport", "Performans Lastik", "Dinamik sürüş için sportif karakterli lastik.", ["yaz", "performans"], "assets/images/tires/petlas/velox-sport.webp"),
          product("snowmaster", "Snowmaster", "Kış Lastiği", "Karlı ve buzlu yollarda güvenli kış performansı.", ["kis"], "assets/images/tires/petlas/snowmaster.webp"),
          product("multaction", "Multaction", "4 Mevsim Lastik", "Yıl boyunca kullanım için çok mevsimli lastik.", ["4-mevsim"], "assets/images/tires/petlas/multaction.webp"),
        ],
      },
      {
        id: "hankook",
        name: "Hankook",
        displayName: "HANKOOK",
        logo: "assets/images/brands/brand-hankook.svg",
        description:
          "Hankook'un performans, SUV ve dört mevsim segmentlerinde sunduğu global lastik teknolojileri.",
        products: [
          product("ventus-s1-evo3", "Ventus S1 evo3", "Performans Lastik", "Yüksek hız stabilitesi ve sportif yol tutuşu.", ["yaz", "performans"], "assets/images/tires/hankook/ventus-s1-evo3.webp"),
          product("kinergy-4s2", "Kinergy 4S2", "4 Mevsim Lastik", "Dört mevsim güvenliği ve konfor odaklı lastik.", ["4-mevsim"], "assets/images/tires/hankook/kinergy-4s2.webp"),
          product("winter-icept", "Winter i*cept", "Kış Lastiği", "Soğuk havalarda güvenilir tutuş ve frenleme.", ["kis"], "assets/images/tires/hankook/winter-icept.webp"),
          product("dynapro", "Dynapro", "SUV Lastiği", "SUV ve 4x4 araçlar için dayanıklı ve dengeli performans.", ["suv"], "assets/images/tires/hankook/dynapro.webp"),
          product("ion-ev", "iON evo", "EV Lastiği", "Elektrikli araçlar için düşük gürültü ve verimlilik.", ["ev", "yaz"], "assets/images/tires/hankook/ion-ev.webp"),
        ],
      },
      {
        id: "kumho",
        name: "Kumho",
        displayName: "KUMHO",
        logo: null,
        description:
          "Kumho'nun performans, konfor ve SUV segmentlerinde sunduğu teknoloji odaklı lastik çözümleri.",
        products: [
          product("ecsta-ps71", "Ecsta PS71", "Performans Lastik", "Sportif sürüş dinamikleri için geliştirilmiş lastik.", ["yaz", "performans"], "assets/images/tires/kumho/ecsta-ps71.webp"),
          product("solus-4s", "Solus 4S", "4 Mevsim Lastik", "Dört mevsim kullanım için dengeli performans.", ["4-mevsim"], "assets/images/tires/kumho/solus-4s.webp"),
          product("wintercraft", "WinterCraft", "Kış Lastiği", "Kış koşullarında güvenli yol tutuşu.", ["kis"], "assets/images/tires/kumho/wintercraft.webp"),
          product("crugen-premium", "Crugen Premium", "SUV Lastiği", "SUV modelleri için konfor ve dayanıklılık.", ["suv", "yaz"], "assets/images/tires/kumho/crugen-premium.webp"),
          product("ecowing", "Ecowing", "Eco Lastik", "Yakıt verimliliği odaklı çevre dostu lastik.", ["yaz", "ev"], "assets/images/tires/kumho/ecowing.webp"),
        ],
      },
      {
        id: "nexen",
        name: "Nexen",
        displayName: "NEXEN",
        logo: null,
        description:
          "Nexen'in binek ve SUV segmentlerinde sunduğu performans ve konfor odaklı lastik portföyü.",
        products: [
          product("nfera-sport", "N'Fera Sport", "Performans Lastik", "Sportif karakter ve yüksek hız güvenliği.", ["yaz", "performans"], "assets/images/tires/nexen/nfera-sport.webp"),
          product("nblue-4season", "N'Blue 4Season", "4 Mevsim Lastik", "Yıl boyunca dengeli performans sunan lastik.", ["4-mevsim"], "assets/images/tires/nexen/nblue-4season.webp"),
          product("winguard-winspike", "Winguard Winspike", "Kış Lastiği", "Karlı yollarda güvenli sürüş için kış lastiği.", ["kis"], "assets/images/tires/nexen/winguard-winspike.webp"),
          product("roadian-gtx", "Roadian GTX", "SUV Lastiği", "SUV ve crossover araçlar için premium konfor.", ["suv"], "assets/images/tires/nexen/roadian-gtx.webp"),
          product("nblue-ev", "N'Blue EV", "EV Lastiği", "Elektrikli araçlar için verimli ve sessiz sürüş.", ["ev", "yaz"], "assets/images/tires/nexen/nblue-ev.webp"),
        ],
      },
      {
        id: "yokohama",
        name: "Yokohama",
        displayName: "YOKOHAMA",
        logo: null,
        description:
          "Yokohama'nın performans, SUV ve dört mevsim segmentlerinde sunduğu Japon mühendislik lastikleri.",
        products: [
          product("advan-sport-v105", "Advan Sport V105", "Performans Lastik", "Ultra yüksek performans ve hassas direksiyon kontrolü.", ["yaz", "performans"], "assets/images/tires/yokohama/advan-sport-v105.webp"),
          product("bluearth", "BluEarth", "Eco Lastik", "Düşük yuvarlanma direnci ile verimli sürüş.", ["yaz", "ev"], "assets/images/tires/yokohama/bluearth.webp"),
          product("geolandar", "Geolandar", "SUV Lastiği", "SUV ve 4x4 araçlar için çok yönlü performans.", ["suv"], "assets/images/tires/yokohama/geolandar.webp"),
          product("iceguard", "iceGuard", "Kış Lastiği", "Buzlu ve karlı yollarda güvenli kış performansı.", ["kis"], "assets/images/tires/yokohama/iceguard.webp"),
          product("advan-db-v552", "Advan dB V552", "Konfor Lastiği", "Sessiz sürüş ve konfor odaklı premium tur lastiği.", ["yaz"], "assets/images/tires/yokohama/advan-db-v552.webp"),
        ],
      },
      {
        id: "bfgoodrich",
        name: "BFGoodrich",
        displayName: "BFGOODRICH",
        logo: null,
        description:
          "BFGoodrich'in performans, arazi ve SUV segmentlerinde sunduğu dayanıklı lastik teknolojileri.",
        products: [
          product("g-force-pilot-sport", "g-Force Pilot Sport", "Performans Lastik", "Sportif sürüş için yüksek tutuş ve stabilite.", ["yaz", "performans"], "assets/images/tires/bfgoodrich/g-force-pilot-sport.webp"),
          product("advantage-touring", "Advantage Touring", "Konfor Lastiği", "Uzun ömür ve konforlu sürüş deneyimi.", ["yaz"], "assets/images/tires/bfgoodrich/advantage-touring.webp"),
          product("all-terrain-ko2", "All-Terrain T/A KO2", "SUV Lastiği", "Arazi ve şehir kullanımı için dayanıklı SUV lastiği.", ["suv", "4-mevsim"], "assets/images/tires/bfgoodrich/all-terrain-ko2.webp"),
          product("g-force-winter", "g-Force Winter", "Kış Lastiği", "Kış koşullarında güvenilir performans.", ["kis"], "assets/images/tires/bfgoodrich/g-force-winter.webp"),
          product("trail-terrain", "Trail-Terrain T/A", "SUV Lastiği", "Hafif arazi ve asfalt kullanımı için çok yönlü lastik.", ["suv"], "assets/images/tires/bfgoodrich/trail-terrain.webp"),
        ],
      },
      {
        id: "starmax",
        name: "Starmax",
        displayName: "STARMAX",
        logo: null,
        description:
          "Starmax'ın ekonomik ve güvenilir binek, SUV ve ticari lastik çözümleri.",
        products: [
          product("starmax-x1", "Starmax X1", "Konfor Lastiği", "Günlük kullanım için ekonomik tur lastiği.", ["yaz"], "assets/images/tires/starmax/starmax-x1.webp"),
          product("starmax-winter", "Starmax Winter", "Kış Lastiği", "Kış mevsiminde güvenli sürüş için kış lastiği.", ["kis"], "assets/images/tires/starmax/starmax-winter.webp"),
          product("starmax-suv", "Starmax SUV", "SUV Lastiği", "SUV modelleri için dayanıklı lastik seçeneği.", ["suv"], "assets/images/tires/starmax/starmax-suv.webp"),
          product("starmax-eco", "Starmax Eco", "Eco Lastik", "Yakıt verimliliği odaklı ekonomik lastik.", ["yaz"], "assets/images/tires/starmax/starmax-eco.webp"),
        ],
      },
    ],
  };
})(window);
