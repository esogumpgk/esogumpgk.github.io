# MPGK — Mühendislik Projeleri Geliştirme Kulübü

Eskişehir Osmangazi Üniversitesi Mühendislik Projeleri Geliştirme Kulübü'nün tanıtım ve üye başvuru sitesi. Statik bir site; derleme adımı, paket kurulumu veya sunucu tarafı kod yok.

## Dosyalar

```
index.html      Sitenin tamamı — HTML, CSS ve JavaScript tek dosyada
assets/         Görseller (WebP)
kur.gs          Google Apps Script — dört birimin başvuru formunu tek seferde kurar
KURULUM.md      Form kurulumu ve düzenleme notları
```

`index.html` görselleri `assets/` klasöründen okur; iki dosya birlikte durmalı.

## Yayına alma (GitHub Pages)

1. Bu klasörün içeriğini deponun köküne yükle.
2. Depo ayarlarında **Settings → Pages** bölümüne gir.
3. **Source** olarak `Deploy from a branch`, branch olarak `main` ve klasör olarak `/ (root)` seç.
4. Birkaç dakika içinde site `https://<kullanıcı-adı>.github.io/<depo-adı>/` adresinde yayına girer.

Kendi alan adını bağlayacaksan Pages ayarlarındaki **Custom domain** alanını kullan; GitHub deponun köküne bir `CNAME` dosyası ekler.

## Başvuru formları

Her birimin ayrı bir Google Formu var, hepsi kulübün tek ortak Google hesabı altında duruyor ve yanıtlar tek bir e-tabloya, birim adını taşıyan ayrı sekmelere düşüyor. Kurulumun tamamı `KURULUM.md` içinde anlatılıyor; özeti:

1. `kur.gs` dosyasını kulübün ortak hesabında `script.google.com` üzerinde çalıştır.
2. Script'in bastığı `formId` ve `alanlar` değerlerini `index.html` içindeki `BIRIMLER` listesine yapıştır.

Değerler girilmeden önce gönder düğmesi kapalı kalır ve formun üstünde turuncu bir hatırlatma görünür.

## Düzenlenecek yerler

Tümü `index.html` dosyasının sonundaki `<script>` bloğunun başında, HTML'e dokunmadan:

| Ne | Değişken |
|---|---|
| Birim adı, açıklaması, ek sorusu, başvuruya açık olup olmadığı | `BIRIMLER` |
| Galeri fotoğrafları ve alt yazıları | `GALERI` |
| Sık sorulan sorular | `SSS` |

Bir birimi başvuruya açmak için o birimin `acik` değerini `true`, kapatmak için `false` yap. Hero bölümündeki "N birim başvuruya açık" rozeti bu değerlerden otomatik hesaplanır; hepsi `false` olduğunda site "şu anda açık üye alımı bulunmuyor" mesajına döner.

Yeni fotoğraf eklerken dosyayı `assets/` içine koy, `IMGS` listesine bir satır ekle ve `GALERI` dizisinde kullan.

## Teknik notlar

- Bağımlılık yok. Dışarıdan yalnızca Google Fonts (Montserrat, Inter) çekiliyor.
- Görseller WebP; toplam yaklaşık 1 MB.
- Mobil ve masaüstü için ayrı ayrı test edildi.
- `prefers-reduced-motion` ayarı açık olan cihazlarda animasyonlar devre dışı kalır.
- Başvuru doğrudan Google Formlar'a gönderilir; tarayıcı bu isteği engellerse site alanları doldurulmuş bir form bağlantısı gösterir.
