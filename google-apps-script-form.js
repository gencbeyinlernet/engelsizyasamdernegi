/**
 * Google Apps Script - Form Veri Toplama
 * 
 * Bu kodu Google Sheets'inizde Tools > Script Editor'a yapıştırın
 * Sonra Deploy > New Deployment > Web App olarak yayınlayın
 * 
 * ÖNEMLİ: 
 * - Execute as: Me (your email)
 * - Who has access: Anyone
 * - Web App URL'yi kopyalayıp form-script.js dosyasındaki WEB_APP_URL'e yapıştırın
 */

// Web App için POST handler
function doPost(e) {
  try {
    // Gelen JSON verisini parse et
    const data = JSON.parse(e.postData.contents);
    
    // Google Sheets'i aç
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Eğer başlık satırı yoksa ekle
    if (sheet.getLastRow() === 0) {
      const headers = [
        'TC', 'Ad Soyad', 'Cinsiyet', 'Doğum Tarihi', 'Çalışma Durumu',
        'Telefon', 'Anne Adı', 'Baba Adı', 'Öğrenim Durumu', 'Engel Türü',
        'Engel Oranı', 'Engel Oluşum Zamanı', 'Adres', 'Açıklama', 'Kayıt Tarihi'
      ];
      sheet.appendRow(headers);
    }
    
    // Veriyi satıra ekle
    const row = [
      data.tc || '',
      data.adSoyad || '',
      data.cinsiyet || '',
      data.dogumTarihi || '',
      data.calismaDurumu || '',
      data.telefon || '',
      data.anneAdi || '',
      data.babaAdi || '',
      data.ogrenimDurumu || '',
      data.engelTuru || '',
      data.engelOrani || '',
      data.engelOlusumZamani || '',
      data.adres || '',
      data.aciklama || '',
      new Date().toLocaleString('tr-TR') // Kayıt tarihi
    ];
    
    sheet.appendRow(row);
    
    // Başarılı yanıt döndür
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Kayıt başarıyla eklendi'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Hata durumunda
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// GET isteği için (test amaçlı)
function doGet(e) {
  return ContentService.createTextOutput('Form veri toplama servisi aktif. POST istekleri bekleniyor.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Test fonksiyonu
function testFormSubmission() {
  const testData = {
    tc: '12345678901',
    adSoyad: 'Test Kullanıcı',
    cinsiyet: 'Erkek',
    dogumTarihi: '1990-01-01',
    calismaDurumu: 'Çalışıyor',
    telefon: '05551234567',
    anneAdi: 'Test Anne',
    babaAdi: 'Test Baba',
    ogrenimDurumu: 'Üniversite',
    engelTuru: 'Görme Engeli',
    engelOrani: '40',
    engelOlusumZamani: 'Doğuştan',
    adres: 'Test Adres',
    aciklama: 'Test açıklama'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

