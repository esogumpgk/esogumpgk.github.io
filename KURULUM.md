# MPGK sitesi — kurulum notları

Klasörde iki dosya var:

- `index.html` — sitenin tamamı. Görseller, stil ve kod tek dosyada gömülü; başka hiçbir dosyaya ihtiyaç duymaz.
- `kur.gs` — dört birimin Google Formunu tek seferde açan Apps Script.

---

## 1. Formları oluştur

Kulübün **ortak Google hesabıyla** giriş yap, `script.google.com` → yeni proje → `kur.gs` içeriğini yapıştır → `kur` fonksiyonunu çalıştır.

Script şunu yapar:

- `MPGK - Üye Başvuruları` adında **tek bir e-tablo** açar
- her birim için **ayrı bir Google Form** oluşturur
- dört formun yanıtlarını da o tek e-tabloya, birim adını taşıyan ayrı sekmelere bağlar
- siteye yapıştırılacak `formId` ve `alanlar` değerlerini günlüğe yazdırır

## 2. Değerleri siteye taşı

`index.html` içinde `BIRIMLER` listesini bul (dosyanın sonundaki `<script>` bloğunun en başında). Her birimin `formId: ''` ve `alanlar: {}` satırlarını scriptin bastığı değerlerle değiştir. Sıra: `organizasyon`, `kurumsal`, `medya`, `proje`.

Değer girilmeyen birimde gönder düğmesi kapalı kalır ve formun üstünde turuncu bir uyarı görünür — o uyarı sadece eksik yapılandırmayı hatırlatmak için var, değerleri girince kendiliğinden kaybolur.

## 3. Bir birimi aç / kapat

Aynı `BIRIMLER` listesinde:

```js
acik: true    // başvurular açık, formu görünür
acik: false   // "Alım şu an kapalı", kart pasif görünür
```

Şu an `kurumsal` ve `medya` açık; `organizasyon` ve `proje` kapalı. Hero'daki "2 birim başvuruya açık" rozeti bu değerlerden otomatik hesaplanıyor, elle güncellemek gerekmiyor.

Hepsi `false` olursa site otomatik olarak "şu anda açık üye alımı bulunmuyor" mesajına döner.

## 4. Yayına alma

`index.html` tek dosya olduğu için herhangi bir yere konabilir: GitHub Pages, Netlify, Vercel ya da üniversitenin sunucusu. Dosya adını `index.html` olarak bırak.

---

## Düzenlemesi kolay yerler

Hepsi dosyanın sonundaki `<script>` bloğunun başında, HTML'e dokunmadan değiştirilebilir:

| Ne | Nerede |
|---|---|
| Birim adı, açıklama, ek soru, açık/kapalı | `BIRIMLER` |
| Galeri fotoğrafları ve alt yazıları | `GALERI` |
| Sık sorulan sorular | `SSS` |

Form alanlarını değiştirirsen (`ad`, `eposta`, `telefon`, `bolum`, `sinif`, `saat`, `kendin`, `neden`, `ekstra`, `deneyim`) `kur.gs` içindeki `items` listesini de aynı anahtarlarla güncelle; site ile form bu anahtarlar üzerinden eşleşiyor.

## Gönderim engellenirse

Site başvuruyu doğrudan Google Formlar'a gönderir. Bazı tarayıcı veya barındırma ayarları bu isteği engelleyebilir; o durumda site kendiliğinden, alanları doldurulmuş bir Google Form bağlantısı gösterir — başvuran sadece formun altındaki Gönder düğmesine basar. Veri kaybı olmaz.
