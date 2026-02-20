# Engelsiz Kayıt Formu

Bu proje, engelsiz bireylerin bilgilerini toplamak için modern bir web formu sağlar. Form verileri Google Sheets'e otomatik olarak kaydedilir.

## Özellikler

- ✅ Modern ve kullanıcı dostu kayıt formu
- ✅ Google Sheets ile otomatik veri kaydı
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Form validasyonu
- ✅ Koşullu alanlar (Diğer engel türü, Sonradan oluşum tarihi)
- ✅ Başarı/hata mesajları
- ✅ Ücretsiz ve kolay kurulum

## Hızlı Başlangıç

Detaylı kurulum talimatları için `KURULUM.md` dosyasına bakın.

### Temel Adımlar:

1. **Google Sheets oluşturun** - Verilerin kaydedileceği dosya
2. **Google Apps Script ekleyin** - `google-apps-script-form.js` kodunu ekleyin
3. **Web App olarak yayınlayın** - URL'yi alın
4. **Formu yapılandırın** - `form-script.js` dosyasındaki URL'yi güncelleyin
5. **Test edin** - Formu doldurup gönderin

## Eski Versiyon (Veri Görüntüleme)

Eğer veri görüntüleme özelliği istiyorsanız, eski dosyalar hala mevcut:
- `script.js` - Veri görüntüleme için
- `styles.css` - Dashboard tasarımı için

## Kurulum Adımları (Eski - Veri Görüntüleme)

### 1. Google Forms Oluşturma (Eski Versiyon)

1. [Google Forms](https://forms.google.com) adresine gidin
2. Yeni bir form oluşturun
3. Aşağıdaki soruları ekleyin (sırasıyla):

   - **TC Kimlik No** (Kısa cevap, Zorunlu)
   - **Ad Soyad** (Kısa cevap, Zorunlu)
   - **Cinsiyet** (Çoktan seçmeli: Erkek, Kadın)
   - **Doğum Tarihi** (Tarih seçici)
   - **Çalışma Durumu** (Çoktan seçmeli: Çalışıyor, Çalışmıyor, Emekli, vb.)
   - **Telefon** (Kısa cevap, Zorunlu)
   - **Anne Adı** (Kısa cevap)
   - **Baba Adı** (Kısa cevap)
   - **Öğrenim Durumu** (Çoktan seçmeli: İlkokul, Ortaokul, Lise, Üniversite, vb.)
   - **Engel Türü** (Çoktan seçmeli: Görme, İşitme, Ortopedik, Zihinsel, Diğer)
   - **Diğer Engel Türü** (Kısa cevap, "Diğer" seçildiğinde göster)
   - **Engel Oranı** (Kısa cevap: %0-100)
   - **Engel Oluşum Zamanı** (Çoktan seçmeli: Doğuştan, Sonradan)
   - **Engel Oluşum Tarihi** (Tarih seçici, "Sonradan" seçildiğinde göster)
   - **Adres** (Uzun cevap)
   - **Açıklama/Not** (Uzun cevap)

4. Form ayarlarında "Yanıtları topla" seçeneğini açın
5. Formu kaydedin

### 2. Google Sheets'i Hazırlama

1. Formunuzun yanıtlar sekmesine gidin (veya otomatik oluşturulan Sheets dosyasını açın)
2. Sheets dosyanızın başlık satırını kontrol edin ve gerekirse düzenleyin
3. Sheets dosyanızı **Web'de Yayınla**:
   - **Dosya** > **Yayınla** > **Web'de yayınla**
   - Veya **Dosya** > **Paylaş** > **Herkesle paylaş** (sadece görüntüleme)

### 3. Google Sheets URL'sini Alma (ÖNERİLEN: CSV Formatı)

**CSV Formatı (Önerilen - Daha Kolay ve Güvenilir):**

1. Google Sheets dosyanızı açın
2. **Dosya** > **Paylaş** > **Herkesle paylaş** (sadece görüntüleme) yapın
3. Sheets dosyanızın URL'sini kopyalayın (örnek: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`)
4. URL'nin sonundaki `/edit` kısmını silin ve yerine `/export?format=csv&gid=0` ekleyin
5. Son URL şu şekilde olacak:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=0
   ```
6. `script.js` dosyasında `DATA_FORMAT = 'csv'` olduğundan emin olun

**JSON Formatı (Alternatif):**

1. Sheets dosyanızın URL'sini kopyalayın
2. `SPREADSHEET_ID` kısmını çıkarın
3. JSON URL formatı:
   ```
   https://spreadsheets.google.com/feeds/list/SPREADSHEET_ID/1/public/values?alt=json
   ```
4. `script.js` dosyasında `DATA_FORMAT = 'json'` yapın

### 4. Web Sitesini Yapılandırma

1. `script.js` dosyasını açın
2. `SHEET_URL` değişkenini bulun (satır 4)
3. Yukarıda aldığınız CSV veya JSON URL'sini yapıştırın:

```javascript
const SHEET_URL = 'BURAYA_GOOGLE_SHEETS_URL_YAPIŞTIRIN';
```

4. Eğer CSV kullanıyorsanız (önerilen), `DATA_FORMAT` değişkeninin `'csv'` olduğundan emin olun (satır 5)
5. Eğer JSON kullanıyorsanız, `DATA_FORMAT` değişkenini `'json'` yapın

### 5. Google Apps Script (Opsiyonel)

Eğer verileri otomatik olarak işlemek isterseniz:

1. Google Sheets'te **Araçlar** > **Komut dosyası düzenleyici**'ni açın
2. `google-apps-script.js` dosyasındaki kodu yapıştırın
3. Kaydedin ve çalıştırın

## Kullanım

1. `index.html` dosyasını bir web tarayıcısında açın
2. Veriler otomatik olarak Google Sheets'ten yüklenecektir
3. Arama kutusunu kullanarak TC, Ad Soyad veya Telefon ile arama yapabilirsiniz
4. Filtrelerle engel türü ve cinsiyete göre filtreleme yapabilirsiniz
5. Herhangi bir kaydın yanındaki "Detay" butonuna tıklayarak detaylı bilgileri görebilirsiniz
6. "Excel'e Aktar" butonu ile filtrelenmiş verileri CSV formatında indirebilirsiniz

## Sütun Eşleştirme

Google Forms'dan gelen sütun isimleri farklı olabilir. `script.js` dosyasındaki `displayData` ve diğer fonksiyonlarda sütun eşleştirmelerini kontrol edin ve gerekirse güncelleyin.

Örnek sütun isimleri:
- `tc` veya `TC`
- `adisoyadi` veya `Ad Soyad`
- `cinsiyet` veya `Cinsiyet`
- vb.

## Sorun Giderme

### Veriler yüklenmiyor
- Google Sheets URL'sinin doğru olduğundan emin olun
- Sheets dosyasının herkesle paylaşıldığından emin olun
- Tarayıcı konsolunu açın (F12) ve hataları kontrol edin

### CORS hatası
- Google Sheets'in JSON formatında yayınlandığından emin olun
- Alternatif olarak, bir proxy servisi kullanabilirsiniz

### Türkçe karakter sorunları
- Excel'e aktarma işleminde BOM (Byte Order Mark) eklenmiştir
- CSV dosyasını Excel'de açarken UTF-8 kodlamasını seçin

## Lisans

Bu proje özgürce kullanılabilir.

## Destek

Sorularınız için lütfen GitHub Issues bölümünü kullanın.

