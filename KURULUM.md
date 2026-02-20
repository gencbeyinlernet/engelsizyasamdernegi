# Engelsiz Kayıt Formu - Kurulum Rehberi

Bu rehber, kayıt formunuzu Google Sheets ile entegre etmek için adım adım talimatlar içerir.

## Adım 1: Google Sheets Oluşturma

1. [Google Sheets](https://sheets.google.com) adresine gidin
2. Yeni bir boş spreadsheet oluşturun
3. Dosyayı "Engelsiz Kayıtlar" gibi bir isimle kaydedin
4. İlk satıra başlıkları ekleyin (opsiyonel - script otomatik ekler):
   - TC
   - Ad Soyad
   - Cinsiyet
   - Doğum Tarihi
   - Çalışma Durumu
   - Telefon
   - Anne Adı
   - Baba Adı
   - Öğrenim Durumu
   - Engel Türü
   - Engel Oranı
   - Engel Oluşum Zamanı
   - Adres
   - Açıklama
   - Kayıt Tarihi

## Adım 2: Google Apps Script Kurulumu

1. Google Sheets dosyanızda **Araçlar** > **Komut dosyası düzenleyici**'ni açın
2. `google-apps-script-form.js` dosyasındaki tüm kodu kopyalayın
3. Script editörüne yapıştırın
4. Dosyayı kaydedin (Ctrl+S veya Cmd+S)
5. İlk kez çalıştırırken izin isteyecek, izin verin

## Adım 3: Web App Olarak Yayınlama

1. Script editöründe **Dağıt** (Deploy) > **Yeni dağıtım** (New deployment) tıklayın
2. **Tür seç** (Select type) kısmında **Web uygulaması** (Web app) seçin
3. Ayarları yapın:
   - **Açıklama:** Engelsiz Form Veri Toplama
   - **Yürüt:** Ben (your email)
   - **Erişimi olanlar:** Herkes (Anyone)
4. **Dağıt** (Deploy) butonuna tıklayın
5. İlk kez izin isteyecek:
   - **İzinleri gözden geçir** (Review permissions) tıklayın
   - Google hesabınızı seçin
   - **Gelişmiş** > **Engelsiz Kayıt Formu'na git** tıklayın
   - **İzin ver** (Allow) tıklayın
6. **Web uygulaması URL'si** (Web app URL) kopyalayın - Bu URL'yi kullanacağız!

## Adım 4: Web Sitesini Yapılandırma

1. `form-script.js` dosyasını açın
2. Satır 3'teki `WEB_APP_URL` değişkenini bulun
3. Kopyaladığınız Web App URL'sini yapıştırın:

```javascript
const WEB_APP_URL = 'BURAYA_WEB_APP_URL_YAPIŞTIRIN';
```

## Adım 5: Test Etme

1. `index.html` dosyasını bir web tarayıcısında açın
2. Formu doldurun ve gönderin
3. Google Sheets dosyanızı kontrol edin - veri eklendi mi?
4. Başarılı mesajı görüyor musunuz?

## Sorun Giderme

### Form gönderilmiyor
- `form-script.js` dosyasındaki `WEB_APP_URL` doğru mu?
- Google Apps Script Web App'in "Herkes" erişimine açık mı?
- Tarayıcı konsolunu açın (F12) ve hataları kontrol edin

### Veriler Sheets'e eklenmiyor
- Google Apps Script'te hata var mı? Script editöründe **Görüntüle** > **Günlükler** (Logs) kontrol edin
- Script'in doğru çalıştığından emin olun
- Web App'in tekrar deploy edilmesi gerekebilir

### CORS hatası
- `form-script.js` dosyasında `mode: 'no-cors'` kullanılıyor, bu normal
- Alternatif olarak Google Apps Script'te CORS ayarlarını kontrol edin

## Güvenlik Notları

- Web App URL'sini kimseyle paylaşmayın
- Google Sheets dosyanızı sadece güvendiğiniz kişilerle paylaşın
- Düzenli olarak verileri yedekleyin
- Gerekirse form'a CAPTCHA ekleyebilirsiniz

## Alternatif: Google Forms Kullanımı

Eğer Google Apps Script kullanmak istemiyorsanız:

1. Google Forms oluşturun
2. Formu `index.html` içine iframe ile embed edin:

```html
<iframe src="GOOGLE_FORMS_URL" width="100%" height="800" frameborder="0"></iframe>
```

Ancak bu yöntemle form tasarımınızı özelleştiremezsiniz.

## Destek

Sorularınız için lütfen GitHub Issues bölümünü kullanın.

