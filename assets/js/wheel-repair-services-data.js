/**
 * Jant Onarım alt hizmetleri — tek veri kaynağı
 * Yeni hizmet eklemek için services dizisine obje ekleyin ve
 * node scripts/generate-wheel-repair-pages.js çalıştırın.
 */
(function (global) {
  "use strict";

  var SITE = "https://markajantlastik.com";
  var PARENT = {
    title: "Jant Onarım & Düzeltme",
    url: "jant-onarim.html",
  };

  global.WheelRepairServices = {
    siteBase: SITE,
    parent: PARENT,
    contactUrl: "iletisim.html",
    whatsappUrl: "https://wa.me/905449483197",
    phoneUrl: "tel:+905449483197",
    imageBase: "assets/images/services",
    services: [
      {
        id: "jant-boyama",
        slug: "jant-boyama.html",
        title: "Jant Boyama",
        shortTitle: "Jant Boyama",
        icon: "bi-brush-fill",
        cardDesc: "Profesyonel elektrostatik ve fırın boya uygulamaları.",
        heroDesc:
          "Solma, çizik veya renk değişimi yaşayan jantlarınız için premium elektrostatik ve fırın boya uygulamaları.",
        metaDescription:
          "Samsun'da profesyonel jant boyama hizmeti. Elektrostatik ve fırın boya uygulamaları ile jantlarınıza fabrika çıkışı görünüm.",
        heroImage: "assets/images/services/jant-boyama/hero.webp",
        whatIs:
          "Jant boyama; hasarlı, solmuş veya estetik açıdan yıpranmış jant yüzeylerinin özel hazırlık süreçlerinden geçirilerek yeniden boyanmasıdır. Marka Jant Lastik'te alüminyum ve alaşımlı jantlarda dayanıklı, homojen ve uzun ömürlü boya katmanları uygulanır.",
        howItWorks: [
          "Jantın mevcut durumu ve boya uygunluğu detaylı incelenir.",
          "Eski boya kumlama veya kimyasal stripping ile temizlenir.",
          "Yüzey astar ve elektrostatik boya ile kaplanır.",
          "Fırın kurutma ile boya sertleştirilir.",
          "Son kontrol, balans ve teslim işlemleri yapılır.",
        ],
        advantages: [
          "Fabrika standartlarına yakın estetik sonuç",
          "UV ve korozyon direnci yüksek boya katmanı",
          "Orijinal veya özel renk seçenekleri",
          "Jant değişimine göre ekonomik çözüm",
        ],
        whenNeeded: [
          "Jant yüzeyinde solma veya renk bozulması",
          "Derin çizik ve kaplama hasarları",
          "Araç yenileme veya restorasyon projeleri",
          "Korozyon başlangıcı görülen jantlar",
        ],
        duration: "Ortalama 1–3 iş günü (jant sayısı ve hasara göre değişir).",
        faq: [
          {
            q: "Hangi jant tipleri boyanabilir?",
            a: "Alüminyum ve çoğu alaşımlı jant boyanabilir. Ön inceleme sonrası uygunluk netleştirilir.",
          },
          {
            q: "Orijinal renk tonu yakalanabilir mi?",
            a: "Evet, renk kodu veya numune ile uyumlu ton eşleştirmesi yapılabilir.",
          },
          {
            q: "Boya garantisi var mı?",
            a: "Uygulanan işçilik ve malzeme kalitemiz garanti kapsamındadır.",
          },
        ],
        galleryCount: 6,
      },
      {
        id: "jant-kaynagi",
        slug: "jant-kaynagi.html",
        title: "Jant Kaynağı",
        shortTitle: "Jant Kaynağı",
        icon: "bi-lightning-charge-fill",
        cardDesc: "Kırık ve çatlak jantlar için profesyonel kaynak işlemleri.",
        heroDesc:
          "Kırık, çatlak veya yapısal hasar görmüş jantlarda güvenli ve profesyonel TIG/argon kaynak çözümleri.",
        metaDescription:
          "Kırık ve çatlak jant kaynağı hizmeti. Profesyonel TIG kaynak ile jant yapısal bütünlüğünü güvenle restore ediyoruz.",
        heroImage: "assets/images/services/jant-kaynagi/hero.webp",
        whatIs:
          "Jant kaynağı, çatlak veya kırık bölgelerin özel alüminyum kaynak teknikleriyle onarılmasıdır. Doğru ısı kontrolü ve malzeme uyumu ile jantın güvenli sürüşe uygun hale getirilmesi hedeflenir.",
        howItWorks: [
          "Hasar bölgesi ve çatlak derinliği analiz edilir.",
          "Jant temizlenir ve kaynak bölgesi hazırlanır.",
          "TIG/argon kaynak ile birleştirme yapılır.",
          "Kaynak sonrası yüzey düzeltme ve kontrol uygulanır.",
          "Sızdırmazlık ve yapısal güvenlik testi yapılır.",
        ],
        advantages: [
          "Yeni jant maliyetine göre ekonomik onarım",
          "Yapısal dayanıklılık odaklı kaynak",
          "Deneyimli kaynak ustası kadrosu",
          "İşlem sonrası güvenlik kontrolü",
        ],
        whenNeeded: [
          "Jant kenarında veya yüzeyinde çatlak",
          "Darbe sonrası kırık veya yarık",
          "Uzun süreli kullanımda oluşan yorgunluk çatlakları",
          "Fabrika hatalı birleşim noktaları",
        ],
        duration: "Ortalama 1–2 iş günü (hasar boyutuna göre).",
        faq: [
          {
            q: "Her çatlak kaynakla onarılabilir mi?",
            a: "Her hasar farklıdır; güvenlik odaklı ön inceleme sonrası onarım uygunluğu belirlenir.",
          },
          {
            q: "Kaynak sonrası jant güvenli mi?",
            a: "Profesyonel kaynak ve sonrası kontrollerle güvenli kullanım hedeflenir.",
          },
          {
            q: "Kaynak bölgesi belli olur mu?",
            a: "Sonrasında düzeltme ve boya ile estetik bütünlük sağlanabilir.",
          },
        ],
        galleryCount: 6,
      },
      {
        id: "cnc-diamond-cut",
        slug: "cnc-diamond-cut.html",
        title: "CNC Diamond Cut",
        shortTitle: "CNC Diamond Cut",
        icon: "bi-cpu-fill",
        cardDesc: "Orijinal diamond cut yüzey yenileme işlemleri.",
        heroDesc:
          "Diamond cut jantlarda CNC destekli hassas tornalama ile orijinal parlak yüzey yenileme.",
        metaDescription:
          "CNC diamond cut jant yenileme. Orijinal parlak yüzeyi hassas CNC tornalama ile profesyonelce restore ediyoruz.",
        heroImage: "assets/images/services/cnc-diamond-cut/hero.webp",
        whatIs:
          "CNC Diamond Cut; parlak yüzeyli jantlarda torna benzeri kesim teknolojisiyle alüminyum yüzeyin yeniden işlenmesidir. Çizilmiş veya matlaşmış diamond cut bölgeleri orijinal görünüme kavuşturulur.",
        howItWorks: [
          "Jant ölçü ve diamond cut profili taranır.",
          "CNC makinede yüzey işleme programı oluşturulur.",
          "Parlak kesim yüzeyi hassas tornalanır.",
          "Koruyucu vernik veya clear coat uygulanır.",
          "Kalite kontrol ve parlaklık eşleştirmesi yapılır.",
        ],
        advantages: [
          "OEM görünüme yakın yüzey kalitesi",
          "Hassas CNC teknolojisi",
          "Çizik ve matlaşma giderme",
          "Premium jant değerini koruma",
        ],
        whenNeeded: [
          "Diamond cut yüzeyde çizik ve matlaşma",
          "Kaldırım darbesi sonrası yüzey hasarı",
          "Boya/kaplama sonrası kesim yenileme ihtiyacı",
          "Restorasyon veya satış öncesi estetik iyileştirme",
        ],
        duration: "Ortalama 2–4 iş günü (jant sayısı ve program süresine göre).",
        faq: [
          {
            q: "Tüm jantlara diamond cut uygulanır mı?",
            a: "Yalnızca diamond cut tasarımlı jantlarda uygulanır; ön inceleme şarttır.",
          },
          {
            q: "İşlem kaç kez tekrarlanabilir?",
            a: "Jant kalınlığına bağlıdır; her işlemde ölçüm yapılır.",
          },
          {
            q: "Parlaklık orijinale yakın olur mu?",
            a: "Doğru programlama ile yüksek estetik uyum sağlanır.",
          },
        ],
        galleryCount: 6,
      },
      {
        id: "jant-duzeltme",
        slug: "jant-duzeltme.html",
        title: "Jant Düzeltme",
        shortTitle: "Jant Düzeltme",
        icon: "bi-disc-fill",
        cardDesc: "Eğilmiş ve darbe almış jantların hassas düzeltilmesi.",
        heroDesc:
          "Bükülmüş, eğilmiş veya darbe almış jantlarda profesyonel düzeltme ve balans öncesi hazırlık.",
        metaDescription:
          "Eğilmiş jant düzeltme hizmeti. Darbe almış jantları hassas ekipmanlarla güvenli şekilde düzeltiyoruz.",
        heroImage: "assets/images/services/jant-duzeltme/hero.webp",
        whatIs:
          "Jant düzeltme; çarpma veya kaldırım darbesi sonucu eğilen jantların özel pres ve düzeltme makineleriyle şekillendirilmesidir. Amaç, jant geometrisini güvenli sürüşe uygun hale getirmektir.",
        howItWorks: [
          "Jant eğrilik ve çatlak analizi yapılır.",
          "Isıl işlem veya soğuk düzeltme yöntemi seçilir.",
          "Hidrolik/pres ekipmanla düzeltme uygulanır.",
          "Yuvarlaklık ve simetri kontrol edilir.",
          "Balans ve sızdırmazlık testi yapılır.",
        ],
        advantages: [
          "Titreşim ve direksiyon sarsıntısı azaltma",
          "Güvenli sürüşe dönüş odaklı onarım",
          "Profesyonel ölçüm ve kontrol",
          "Yeni janta göre ekonomik alternatif",
        ],
        whenNeeded: [
          "Kaldırım veya çukur darbesi sonrası eğilme",
          "Direksiyonda titreme ve balans alınamama",
          "Lastik kenarında düzensiz aşınma",
          "Hava kaçırma veya jant ovalleşmesi",
        ],
        duration: "Ortalama aynı gün veya 1 iş günü.",
        faq: [
          {
            q: "Her eğilmiş jant düzeltilebilir mi?",
            a: "Ciddi çatlak veya yapısal hasarlarda güvenlik nedeniyle değişim önerilebilir.",
          },
          {
            q: "Düzeltme sonrası balans gerekir mi?",
            a: "Evet, düzeltme sonrası balans kontrolü önerilir.",
          },
          {
            q: "Alüminyum jantlarda uygulanır mı?",
            a: "Evet, uygun hasarlarda alüminyum jant düzeltme yapılabilir.",
          },
        ],
        galleryCount: 6,
      },
      {
        id: "jant-tornalama",
        slug: "jant-tornalama.html",
        title: "Jant Tornalama",
        shortTitle: "Jant Tornalama",
        icon: "bi-arrow-repeat",
        cardDesc: "Yüzey düzeltme ve hassas tornalama işlemleri.",
        heroDesc:
          "Jant yüzeylerinde hassas tornalama ile düzeltme, profil yenileme ve boya öncesi hazırlık.",
        metaDescription:
          "Profesyonel jant tornalama hizmeti. Yüzey düzeltme ve hassas tornalama ile jantlarınızı yeniliyoruz.",
        heroImage: "assets/images/services/jant-tornalama/hero.webp",
        whatIs:
          "Jant tornalama; jant yüzeyinde biriken kaplama artıkları, pürüzler veya hasarlı bölgelerin torna tezgâhında işlenerek düzeltilmesidir. Özellikle diamond cut öncesi/sonrası ve restorasyon süreçlerinde kullanılır.",
        howItWorks: [
          "Jant torna merkezine sabitlenir.",
          "Yüzey profili ve hedef kalınlık belirlenir.",
          "Hassas tornalama ile düzeltme yapılır.",
          "Yüzey temizliği ve pürüzsüzlük kontrolü.",
          "Gerekirse vernik veya boya hazırlığı.",
        ],
        advantages: [
          "Mikron hassasiyetinde yüzey işleme",
          "Boya öncesi ideal zemin hazırlığı",
          "Diamond cut uyumlu profil yenileme",
          "Profesyonel atölye ekipmanı",
        ],
        whenNeeded: [
          "Yüzeyde dalgalanma ve pürüz",
          "Kaplama kalınlığı düzeltme ihtiyacı",
          "Restorasyon ve CNC öncesi hazırlık",
          "Boya tutunması için yüzey düzeltme",
        ],
        duration: "Ortalama 1–2 iş günü.",
        faq: [
          {
            q: "Tornalama jant kalınlığını azaltır mı?",
            a: "Kontrollü miktarda malzeme alınır; güvenlik limitleri aşılmaz.",
          },
          {
            q: "Hangi jantlarda uygulanır?",
            a: "Çoğunlukla alüminyum ve diamond cut jantlarda uygulanır.",
          },
          {
            q: "Sonrasında boya gerekir mi?",
            a: "İşlem tipine göre clear coat veya boya uygulaması önerilebilir.",
          },
        ],
        galleryCount: 6,
      },
      {
        id: "jant-kumlama",
        slug: "jant-kumlama.html",
        title: "Jant Kumlama",
        shortTitle: "Jant Kumlama",
        icon: "bi-cloud-haze2-fill",
        cardDesc: "Boya öncesi profesyonel yüzey hazırlığı.",
        heroDesc:
          "Eski boya, pas ve kaplama kalıntılarını gideren profesyonel kumlama ile boya öncesi yüzey hazırlığı.",
        metaDescription:
          "Jant kumlama hizmeti. Boya öncesi profesyonel yüzey hazırlığı ile uzun ömürlü ve homojen boya sonucu.",
        heroImage: "assets/images/services/jant-kumlama/hero.webp",
        whatIs:
          "Jant kumlama; yüksek basınçlı aşındırıcı malzeme ile jant yüzeyinin temizlenmesi ve boya tutunmasına uygun hale getirilmesidir. Eski boya, korozyon ve kir tabakaları etkili şekilde giderilir.",
        howItWorks: [
          "Jant temizlik ve maskeleme hazırlığı.",
          "Kumlama kabininde yüzey aşındırması.",
          "Toz ve kalıntı temizliği.",
          "Yüzey pürüzlülük kontrolü.",
          "Astar veya boya için hazır teslim.",
        ],
        advantages: [
          "Homojen ve temiz yüzey",
          "Boya yapışma kalitesini artırma",
          "Korozyon kalıntılarını giderme",
          "Profesyonel kabin ortamında işlem",
        ],
        whenNeeded: [
          "Boya yenileme öncesi eski kaplama temizliği",
          "Pas ve oksit tabakası bulunan jantlar",
          "Restorasyon projeleri",
          "Kaplama hatası sonrası yeniden hazırlık",
        ],
        duration: "Ortalama 1 iş günü (jant başına birkaç saat).",
        faq: [
          {
            q: "Kumlama janta zarar verir mi?",
            a: "Kontrollü basınç ve doğru aşındırıcı ile güvenli uygulama yapılır.",
          },
          {
            q: "Sonrasında hemen boya yapılır mı?",
            a: "Yüzey hazır hale getirildikten sonra astar/boya sürecine geçilir.",
          },
          {
            q: "Tüm jant tiplerinde uygulanır mı?",
            a: "Alüminyum ve çelik jantlarda yaygın olarak uygulanır.",
          },
        ],
        galleryCount: 6,
      },
      {
        id: "jant-polisaj",
        slug: "jant-polisaj.html",
        title: "Jant Polisaj",
        shortTitle: "Jant Polisaj",
        icon: "bi-stars",
        cardDesc: "Parlak yüzey ve estetik görünüm kazandırma.",
        heroDesc:
          "Matlaşmış veya çizilmiş jant yüzeylerine parlaklık kazandıran profesyonel polisaj uygulamaları.",
        metaDescription:
          "Jant polisaj hizmeti. Çizik giderme ve parlak yüzey restorasyonu ile jantlarınıza premium görünüm.",
        heroImage: "assets/images/services/jant-polisaj/hero.webp",
        whatIs:
          "Jant polisaj; jant yüzeyindeki hafif çizik, matlık ve oksidasyon tabakasının aşamalı polisaj pedleri ve bileşiklerle giderilerek parlaklığın geri kazandırılmasıdır.",
        howItWorks: [
          "Yüzey temizliği ve hasar değerlendirmesi.",
          "Kademeli polisaj pedleri ile aşındırma.",
          "Parlatma bileşiği uygulaması.",
          "Koruyucu sealant veya wax katmanı.",
          "Final parlaklık kontrolü.",
        ],
        advantages: [
          "Hızlı estetik iyileştirme",
          "Hafif çizik giderme",
          "Premium parlak görünüm",
          "Boya öncesi veya sonrası uygulanabilir",
        ],
        whenNeeded: [
          "Yüzey matlaşması ve solgunluk",
          "Hafif çizik ve sürtünme izleri",
          "Satış veya etkinlik öncesi görünüm iyileştirme",
          "Bakım sonrası parlaklık yenileme",
        ],
        duration: "Ortalama birkaç saat ile 1 iş günü.",
        faq: [
          {
            q: "Derin çizikler polisajla giderilir mi?",
            a: "Hafif çizikler giderilebilir; derin hasarlarda boya/tornalama gerekebilir.",
          },
          {
            q: "Parlaklık ne kadar sürer?",
            a: "Kullanım koşullarına bağlıdır; koruyucu uygulama ömrü uzatır.",
          },
          {
            q: "Her jant tipine uygulanır mı?",
            a: "Parlak yüzeyli jantlarda en iyi sonuç alınır.",
          },
        ],
        galleryCount: 6,
      },
      {
        id: "diger-hizmetler",
        slug: "diger-hizmetler.html",
        title: "Diğer Hizmetler",
        shortTitle: "Diğer Hizmetler",
        icon: "bi-gear-wide-connected",
        cardDesc: "Tüm özel jant onarım ve restorasyon çözümleri.",
        heroDesc:
          "Standart hizmetlerin ötesinde; özel restorasyon, kaplama, onarım ve danışmanlık çözümleri.",
        metaDescription:
          "Özel jant onarım ve restorasyon hizmetleri. Boya, kaynak, CNC, düzeltme ve daha fazlası tek çatı altında.",
        heroImage: "assets/images/services/diger-hizmetler/hero.webp",
        whatIs:
          "Diğer hizmetler kapsamında; standart onarım süreçlerinin dışında kalan özel talepler, restorasyon projeleri, kaplama alternatifleri ve kapsamlı jant yenileme paketleri sunulur.",
        howItWorks: [
          "Jant ve talep detaylı analiz edilir.",
          "Özel iş planı ve süre tahmini oluşturulur.",
          "Gerekli alt işlemler (kaynak, tornalama, boya vb.) uygulanır.",
          "Kalite kontrol ve test süreçleri tamamlanır.",
          "Teslim ve bakım önerileri paylaşılır.",
        ],
        advantages: [
          "Tek noktadan kapsamlı çözüm",
          "Kişiye özel iş planı",
          "Deneyimli teknik ekip",
          "Premium ve klasik jant restorasyonu",
        ],
        whenNeeded: [
          "Birden fazla işlem gerektiren hasarlar",
          "Klasik veya nadir jant restorasyonu",
          "Özel renk/kaplama talepleri",
          "Filomatik toplu onarım ihtiyaçları",
        ],
        duration: "Proje kapsamına göre değişir; ön görüşme sonrası netleştirilir.",
        faq: [
          {
            q: "Hangi özel talepleri karşılıyorsunuz?",
            a: "Restorasyon, kaplama, çoklu onarım ve danışmanlık taleplerini değerlendiriyoruz.",
          },
          {
            q: "Fiyatlandırma nasıl yapılır?",
            a: "Jant durumu ve işlem kapsamına göre teklif hazırlanır.",
          },
          {
            q: "Randevu nasıl alınır?",
            a: "Telefon, WhatsApp veya iletişim formu üzerinden ulaşabilirsiniz.",
          },
        ],
        galleryCount: 6,
      },
    ],
  };
})(window);
