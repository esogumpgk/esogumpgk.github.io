/**
 * MPGK — Birim başvuru formlarını tek seferde kurar.
 *
 * NE YAPAR
 *   1. Tek bir Google E-Tablo açar: "MPGK - Üye Başvuruları"
 *   2. Her birim için AYRI bir Google Form oluşturur
 *   3. Dört formun yanıtlarını da aynı e-tabloya, ayrı sekmelere bağlar
 *   4. Sitenin index.html dosyasına yapıştıracağın formId + alanlar
 *      bloğunu hazır olarak yazdırır
 *
 * NASIL ÇALIŞTIRILIR
 *   1. Kulübün ORTAK Google hesabıyla giriş yap
 *   2. script.google.com > Yeni proje
 *   3. Bu dosyanın tamamını yapıştır, kaydet
 *   4. Üstteki fonksiyon listesinden "kur" seç > Çalıştır
 *   5. İlk çalıştırmada izin ister: Gelişmiş > (proje adı)'na git > İzin ver
 *   6. Alttaki "Yürütme günlüğü" panelindeki çıktıyı kopyala
 *
 * BİR DAHA ÇALIŞTIRMA — her çalıştırışta yeni formlar açar.
 */

var BIRIMLER = [
  { id: 'organizasyon',
    ad: 'Organizasyon Birimi',
    ekSoru: 'Daha önce etkinlik organizasyonunda yer aldın mı?' },
  { id: 'kurumsal',
    ad: 'Kurumsal İletişim ve Sponsorluk Birimi',
    ekSoru: 'Sunum, kurumsal yazışma veya görüşme deneyimin oldu mu?' },
  { id: 'medya',
    ad: 'Sosyal Medya ve İnovasyon Birimi',
    ekSoru: 'Hangi araçları kullanabiliyorsun? Portfolyon varsa bağlantısını ekle.' },
  { id: 'proje',
    ad: 'Proje ve Eğitim Birimi',
    ekSoru: 'Hangi teknik alanda çalışmak istiyorsun?' }
];

function kur() {
  var ss = SpreadsheetApp.create('MPGK - Üye Başvuruları');
  var cikti = [];
  var linkler = [];

  for (var i = 0; i < BIRIMLER.length; i++) {
    var b = BIRIMLER[i];
    var form = FormApp.create('MPGK Üye Başvurusu — ' + b.ad);
    form.setDescription(
      'Mühendislik Projeleri Geliştirme Kulübü · ' + b.ad + ' üye başvuru formu. ' +
      'Başvurular değerlendirildikten sonra e-posta veya telefon üzerinden dönüş yapılır.');
    form.setCollectEmail(false);
    form.setAllowResponseEdits(false);
    form.setLimitOneResponsePerUser(false);
    form.setProgressBar(false);
    form.setConfirmationMessage('Başvurun bize ulaştı. Değerlendirme sonrasında sana dönüş yapacağız.');
    try { form.setRequireLogin(false); } catch (e) {}   // kişisel hesaplarda yok sayılır

    // Sıra, sitedeki alan sırasıyla aynı.
    // Sınıf ve saat bilerek METİN alanı: siteden gelen değer neyse olduğu gibi kaydedilsin.
    var items = {
      ad:      form.addTextItem().setTitle('Ad Soyad').setRequired(true),
      eposta:  form.addTextItem().setTitle('E-posta').setRequired(true),
      telefon: form.addTextItem().setTitle('Telefon').setRequired(true),
      bolum:   form.addTextItem().setTitle('Bölüm').setRequired(true),
      sinif:   form.addTextItem().setTitle('Sınıf').setRequired(true),
      saat:    form.addTextItem().setTitle('Haftada ayırabileceği saat').setRequired(true),
      kendin:  form.addParagraphTextItem().setTitle('Kendinden kısaca bahset').setRequired(true),
      neden:   form.addParagraphTextItem().setTitle('Neden bu birimde yer almak istiyor?').setRequired(true),
      ekstra:  form.addParagraphTextItem().setTitle(b.ekSoru),
      deneyim: form.addParagraphTextItem().setTitle('Önceki kulüp, takım veya proje deneyimi')
    };

    // Yanıtlar ortak e-tabloya
    var oncekiSayfalar = ss.getSheets().length;
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    SpreadsheetApp.flush();
    var sayfalar = SpreadsheetApp.openById(ss.getId()).getSheets();
    if (sayfalar.length > oncekiSayfalar) {
      sayfalar[sayfalar.length - 1].setName(b.ad.replace(' Birimi', ''));
    }

    // entry.XXXX kimliklerini önceden doldurulmuş bağlantıdan oku
    var resp = form.createResponse();
    for (var k in items) resp = resp.withItemResponse(items[k].createResponse('##' + k));
    var url = resp.toPrefilledUrl();
    var alanlar = {};
    var parcalar = url.split('&');
    for (var j = 0; j < parcalar.length; j++) {
      var p = parcalar[j];
      var e = p.indexOf('entry.');
      if (e < 0) continue;
      var esit = p.indexOf('=', e);
      var anahtar = p.substring(e, esit);
      var deger = decodeURIComponent(p.substring(esit + 1)).replace('##', '');
      alanlar[deger] = anahtar;
    }

    var formId = form.getPublishedUrl().match(/\/e\/([^\/]+)\//)[1];
    try { form.setPublished(true); } catch (e2) {}   // eski sürümlerde yok

    var satirlar = [];
    for (var kk in alanlar) satirlar.push("      " + kk + ": '" + alanlar[kk] + "'");

    cikti.push(
      "  // " + b.ad + "\n" +
      "  {\n" +
      "    formId: '" + formId + "',\n" +
      "    alanlar: {\n" + satirlar.join(",\n") + "\n" +
      "    }\n" +
      "  }"
    );
    linkler.push(b.ad + "\n   Form  : " + form.getPublishedUrl() +
                       "\n   Düzenle: " + form.getEditUrl());
  }

  var rapor =
    "\n==================== 1) SİTEYE YAPIŞTIR ====================\n" +
    "index.html içindeki BIRIMLER listesinde her birimin formId ve alanlar\n" +
    "değerlerini aşağıdakilerle değiştir (sıra: " +
    BIRIMLER.map(function (x) { return x.id; }).join(', ') + ")\n\n" +
    cikti.join(",\n") +
    "\n\n==================== 2) BAĞLANTILAR ====================\n" +
    linkler.join("\n\n") +
    "\n\nYanıt tablosu: " + ss.getUrl() +
    "\n\n==================== 3) SON KONTROL ====================\n" +
    "· Her formu bir kez aç, sağ üstten Gönder > Bağlantı ile paylaşımın açık olduğunu doğrula.\n" +
    "· Siteden bir test başvurusu gönder, tabloya düştüğünü gör, sonra test satırını sil.\n";

  Logger.log(rapor);
  return rapor;
}
