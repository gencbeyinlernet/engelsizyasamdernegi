# Adım Adım Kurulum Rehberi

## Bu Hata Ne Demek?

Form şu anda Google Sheets'e bağlı değil. Formu doldurup gönderdiğinizde verilerin nereye gönderileceğini bilmiyor. Bu yüzden bir bağlantı (URL) ayarlamamız gerekiyor.

---

## ADIM 1: Google Sheets Oluşturun

1. Tarayıcınızda [sheets.google.com](https://sheets.google.com) adresine gidin
2. **Boş** bir spreadsheet oluşturun (sağ üstteki "+" butonu)
3. Dosyaya bir isim verin (örnek: "Engelsiz Kayıtlar")
4. Dosyayı kaydedin

**✅ Bu adımı tamamladınız mı?** Devam edin...

---

## ADIM 2: Google Apps Script Ekleyin

1. Google Sheets dosyanızda **Araçlar** (Tools) menüsüne tıklayın
2. **Komut dosyası düzenleyici** (Script editor) seçeneğine tıklayın
3. Yeni bir sekme açılacak (Script Editor)
4. Bu sekmede zaten bazı kodlar olabilir, hepsini silin
5. `google-apps-script-form.js` dosyasını açın (proje klasörünüzde)
6. İçindeki **TÜM KODU** kopyalayın (Ctrl+A, sonra Ctrl+C)
7. Script Editor'a yapıştırın (Ctrl+V)
8. **Kaydet** butonuna tıklayın (Ctrl+S) veya disk simgesine tıklayın
9. Dosyaya bir isim verin (örnek: "Form Veri Toplama")

**✅ Bu adımı tamamladınız mı?** Devam edin...

---

## ADIM 3: İzinleri Verin (İlk Kez)

1. Script Editor'da üstteki **Çalıştır** (Run) butonuna tıklayın
2. Bir açılır pencere çıkacak - **İzinleri gözden geçir** (Review permissions) tıklayın
3. Google hesabınızı seçin
4. **Gelişmiş** (Advanced) linkine tıklayın
5. **Engelsiz Kayıt Formu'na git** (Go to Engelsiz...) linkine tıklayın
6. **İzin ver** (Allow) butonuna tıklayın

**✅ Bu adımı tamamladınız mı?** Devam edin...

---

## ADIM 4: Web App Olarak Yayınlayın (EN ÖNEMLİ ADIM!)

1. Script Editor'da üstteki **Dağıt** (Deploy) menüsüne tıklayın
2. **Yeni dağıtım** (New deployment) seçeneğine tıklayın
3. Sağ üstteki **⚙️** (Ayarlar) simgesine tıklayın
4. **Tür seç** (Select type) kısmında **Web uygulaması** (Web app) seçin
5. Şu ayarları yapın:
   - **Açıklama:** Engelsiz Form (herhangi bir şey yazabilirsiniz)
   - **Yürüt:** **Ben** (Me) seçin
   - **Erişimi olanlar:** **Herkes** (Anyone) seçin ⚠️ ÖNEMLİ!
6. **Dağıt** (Deploy) butonuna tıklayın
7. **İzinleri gözden geçir** (Review permissions) tekrar tıklayın ve izin verin
8. **Web uygulaması URL'si** (Web app URL) kısmında bir URL göreceksiniz
   - Örnek: `https://script.google.com/macros/s/AKfycby.../exec`
9. Bu URL'yi **KOPYALAYIN** (Ctrl+C)

**✅ URL'yi kopyaladınız mı?** Devam edin...

---

## ADIM 5: URL'yi Forma Ekleyin

1. Proje klasörünüzde `form-script.js` dosyasını açın
2. 3. satırı bulun:
   ```javascript
   const WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` kısmını silin
4. Kopyaladığınız URL'yi tırnak işaretleri arasına yapıştırın
5. Şöyle görünmeli:
   ```javascript
   const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
6. Dosyayı kaydedin (Ctrl+S)

**✅ URL'yi eklediniz mi?** Devam edin...

---

## ADIM 6: Test Edin!

1. `index.html` dosyasını tarayıcıda açın
2. Formu doldurun (test için herhangi bir veri girebilirsiniz)
3. **Kayıt Ol** butonuna tıklayın
4. Başarı mesajı görünmeli: "✓ Kayıt başarıyla gönderildi!"
5. Google Sheets dosyanızı kontrol edin - veri eklendi mi?

**✅ Form çalışıyor mu?** Tebrikler! 🎉

---

## Sorun Giderme

### "İzin ver" butonu görünmüyor
- Tarayıcınızın pop-up engelleyicisini kapatın
- Farklı bir tarayıcı deneyin

### URL kopyalanmıyor
- URL'nin tamamını seçin (çift tıklayın)
- Sağ tıklayıp "Kopyala" seçin

### Form hala çalışmıyor
- `form-script.js` dosyasını kontrol edin - URL tırnak işaretleri içinde mi?
- Tarayıcı konsolunu açın (F12) - hata var mı?
- Google Apps Script'te Web App'in "Herkes" erişimine açık olduğundan emin olun

### Veriler Sheets'e eklenmiyor
- Google Apps Script'te **Görüntüle** > **Günlükler** (Logs) kontrol edin
- Hata var mı?
- Web App'i tekrar deploy edin

---

## Özet

1. ✅ Google Sheets oluştur
2. ✅ Google Apps Script ekle
3. ✅ İzinleri ver
4. ✅ Web App olarak yayınla → **URL'yi kopyala**
5. ✅ `form-script.js` dosyasına URL'yi yapıştır
6. ✅ Test et!

Herhangi bir sorunuz varsa, hangi adımda takıldığınızı belirtin!

