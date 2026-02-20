/**
 * Google Apps Script Kodu
 * 
 * Bu kodu Google Sheets'inizde Tools > Script Editor'a yapıştırın
 * Form verilerini otomatik olarak işlemek için kullanılır
 */

// Form gönderildiğinde çalışacak fonksiyon
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Verileri işle ve formatla
  // Bu kısım form yapınıza göre özelleştirilebilir
  
  Logger.log('Yeni form gönderildi: ' + JSON.stringify(data));
}

// Manuel olarak verileri temizleme ve formatlama fonksiyonu
function formatData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    Logger.log('İşlenecek veri yok');
    return;
  }
  
  // Verileri formatla (örnek: telefon numaralarını düzenle)
  const dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
  const values = dataRange.getValues();
  
  values.forEach((row, index) => {
    // Telefon numarası formatla (örnek)
    if (row[5]) { // Telefon sütunu
      let phone = row[5].toString().replace(/\D/g, '');
      if (phone.length === 10) {
        phone = '0' + phone;
      }
      row[5] = phone;
    }
    
    // Tarih formatla (örnek)
    if (row[3]) { // Doğum tarihi sütunu
      // Tarih formatını kontrol et ve düzenle
    }
  });
  
  dataRange.setValues(values);
  Logger.log('Veriler formatlandı');
}

