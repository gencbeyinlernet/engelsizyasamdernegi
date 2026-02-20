# Google Forms Kurulum Rehberi

Bu rehber, engelsiz veri toplama formunuzu Google Forms'da nasıl oluşturacağınızı adım adım açıklar.

## Form Soruları ve Ayarları

### 1. TC Kimlik No
- **Tip:** Kısa cevap
- **Zorunlu:** Evet
- **Doğrulama:** Sayı, 11 haneli

### 2. Ad Soyad
- **Tip:** Kısa cevap
- **Zorunlu:** Evet

### 3. Cinsiyet
- **Tip:** Çoktan seçmeli
- **Zorunlu:** Evet
- **Seçenekler:**
  - Erkek
  - Kadın

### 4. Doğum Tarihi
- **Tip:** Tarih
- **Zorunlu:** Evet

### 5. Çalışma Durumu
- **Tip:** Çoktan seçmeli
- **Zorunlu:** Evet
- **Seçenekler:**
  - Çalışıyor
  - Çalışmıyor
  - Emekli
  - Öğrenci
  - Diğer

### 6. Telefon
- **Tip:** Kısa cevap
- **Zorunlu:** Evet
- **Doğrulama:** Telefon numarası

### 7. Anne Adı
- **Tip:** Kısa cevap
- **Zorunlu:** Hayır

### 8. Baba Adı
- **Tip:** Kısa cevap
- **Zorunlu:** Hayır

### 9. Öğrenim Durumu
- **Tip:** Çoktan seçmeli
- **Zorunlu:** Evet
- **Seçenekler:**
  - Okuma Yazma Bilmiyor
  - İlkokul
  - Ortaokul
  - Lise
  - Üniversite
  - Yüksek Lisans
  - Doktora

### 10. Engel Türü
- **Tip:** Çoktan seçmeli
- **Zorunlu:** Evet
- **Seçenekler:**
  - Görme Engeli
  - İşitme Engeli
  - Ortopedik Engeli
  - Zihinsel Engeli
  - Dil ve Konuşma Engeli
  - Diğer

### 11. Diğer Engel Türü (Koşullu)
- **Tip:** Kısa cevap
- **Zorunlu:** Hayır
- **Koşul:** "Engel Türü" sorusunda "Diğer" seçildiğinde göster

### 12. Engel Oranı
- **Tip:** Kısa cevap
- **Zorunlu:** Evet
- **Açıklama:** Örnek: %40, %60, %80
- **Doğrulama:** Sayı, 0-100 arası

### 13. Engel Oluşum Zamanı
- **Tip:** Çoktan seçmeli
- **Zorunlu:** Evet
- **Seçenekler:**
  - Doğuştan
  - Sonradan

### 14. Engel Oluşum Tarihi (Koşullu)
- **Tip:** Tarih
- **Zorunlu:** Hayır
- **Koşul:** "Engel Oluşum Zamanı" sorusunda "Sonradan" seçildiğinde göster

### 15. Adres
- **Tip:** Uzun cevap
- **Zorunlu:** Evet

### 16. Açıklama/Not
- **Tip:** Uzun cevap
- **Zorunlu:** Hayır

## Form Ayarları

1. **Yanıtları Topla:** Açık olmalı
2. **Yanıtları Gönderenlere E-posta Gönder:** İsteğe bağlı
3. **Yanıtları Düzenlenebilir Yap:** İsteğe bağlı
4. **Yanıtları Sınırla:** İsteğe bağlı (güvenlik için önerilir)

## Google Sheets Entegrasyonu

1. Formunuzu oluşturduktan sonra, **Yanıtlar** sekmesine gidin
2. **Google Sheets'e Bağla** butonuna tıklayın
3. Yeni bir Sheets dosyası oluşturun veya mevcut bir dosyaya bağlayın
4. Sheets dosyasında otomatik olarak sütun başlıkları oluşturulacaktır

## Önemli Notlar

- Form sorularının sırası önemlidir - yukarıdaki sırayı takip edin
- Sütun başlıkları Google Forms tarafından otomatik oluşturulur
- Web sitesi kodları farklı sütun isimlerini otomatik olarak algılar
- Formu test edin ve birkaç örnek veri girin
- Sheets dosyasını kontrol ederek sütun isimlerini not edin

## Sorun Giderme

### Sütun isimleri eşleşmiyor
- `script.js` dosyasındaki `getValue()` fonksiyonu farklı sütun isimlerini otomatik algılar
- Eğer hala sorun varsa, Sheets'teki gerçek sütun isimlerini kontrol edin ve `script.js` dosyasını güncelleyin

### Koşullu sorular çalışmıyor
- Google Forms'da koşullu soruları ayarlamak için soruya tıklayın ve "Koşullu soru" seçeneğini açın
- "Diğer Engel Türü" sadece "Diğer" seçildiğinde görünmeli
- "Engel Oluşum Tarihi" sadece "Sonradan" seçildiğinde görünmeli

