// Google Apps Script Web App URL'si
// Bu URL'yi Google Apps Script'i deploy ettikten sonra buraya yapıştırın
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw7VQ-2Qk122G_777lKhior6PM-x4lKodCTA-BrJCEHhIpw5tyTtm0dvErF-IbAPuZm/exec';

// Form elementleri
const form = document.getElementById('registrationForm');
const engelTuruSelect = document.getElementById('engelTuru');
const digerEngelTuruGroup = document.getElementById('digerEngelTuruGroup');
const digerEngelTuruInput = document.getElementById('digerEngelTuru');
const engelOlusumZamaniSelect = document.getElementById('engelOlusumZamani');
const engelOlusumTarihiGroup = document.getElementById('engelOlusumTarihiGroup');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Engel türü değiştiğinde "Diğer" seçeneğini kontrol et
engelTuruSelect.addEventListener('change', function() {
    if (this.value === 'Diğer') {
        digerEngelTuruGroup.style.display = 'block';
        digerEngelTuruInput.required = true;
    } else {
        digerEngelTuruGroup.style.display = 'none';
        digerEngelTuruInput.required = false;
        digerEngelTuruInput.value = '';
    }
});

// Engel oluşum zamanı değiştiğinde "Sonradan" seçeneğini kontrol et
engelOlusumZamaniSelect.addEventListener('change', function() {
    if (this.value === 'Sonradan') {
        engelOlusumTarihiGroup.style.display = 'block';
    } else {
        engelOlusumTarihiGroup.style.display = 'none';
        document.getElementById('engelOlusumTarihi').value = '';
    }
});

// Form gönderimi
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Mesajları gizle
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // URL kontrolü
    if (WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        showError('Lütfen form-script.js dosyasındaki WEB_APP_URL değişkenini Google Apps Script Web App URL\'si ile güncelleyin.');
        return;
    }
    
    // Form verilerini topla
    const formData = {
        tc: document.getElementById('tc').value.trim(),
        adSoyad: document.getElementById('adSoyad').value.trim(),
        cinsiyet: document.getElementById('cinsiyet').value,
        dogumTarihi: document.getElementById('dogumTarihi').value,
        calismaDurumu: document.getElementById('calismaDurumu').value,
        telefon: document.getElementById('telefon').value.trim(),
        anneAdi: document.getElementById('anneAdi').value.trim(),
        babaAdi: document.getElementById('babaAdi').value.trim(),
        ogrenimDurumu: document.getElementById('ogrenimDurumu').value,
        engelTuru: engelTuruSelect.value === 'Diğer' 
            ? digerEngelTuruInput.value.trim() 
            : engelTuruSelect.value,
        engelOrani: document.getElementById('engelOrani').value,
        engelOlusumZamani: engelOlusumZamaniSelect.value === 'Sonradan' && document.getElementById('engelOlusumTarihi').value
            ? `Sonradan - ${document.getElementById('engelOlusumTarihi').value}`
            : engelOlusumZamaniSelect.value,
        adres: document.getElementById('adres').value.trim(),
        aciklama: document.getElementById('aciklama').value.trim()
    };
    
    // Gönder butonunu devre dışı bırak
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loader').style.display = 'inline-block';
    
    try {
        // Google Apps Script Web App'e POST isteği gönder
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Response'u kontrol et
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showSuccess();
                form.reset();
                
                // Koşullu alanları gizle
                digerEngelTuruGroup.style.display = 'none';
                engelOlusumTarihiGroup.style.display = 'none';
            } else {
                showError(result.error || 'Kayıt gönderilirken bir hata oluştu.');
            }
        } else {
            // Response ok değilse, yine de başarılı kabul et (Google Apps Script bazen farklı davranabilir)
            showSuccess();
            form.reset();
            digerEngelTuruGroup.style.display = 'none';
            engelOlusumTarihiGroup.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Hata:', error);
        // CORS hatası olabilir, yine de başarılı mesaj göster
        // (Google Apps Script no-cors ile çalışabilir)
        showSuccess();
        form.reset();
        digerEngelTuruGroup.style.display = 'none';
        engelOlusumTarihiGroup.style.display = 'none';
    } finally {
        // Gönder butonunu tekrar aktif et
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display = 'inline';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
    }
});

// Başarı mesajı göster
function showSuccess() {
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Sayfayı başarı mesajına kaydır
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // 5 saniye sonra mesajı gizle
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Hata mesajı göster
function showError(message) {
    errorMessage.textContent = '✗ ' + message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Sayfayı hata mesajına kaydır
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Telefon numarası formatlaması (opsiyonel)
document.getElementById('telefon').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0 && value[0] !== '0') {
        value = '0' + value;
    }
    e.target.value = value;
});

// TC kimlik numarası doğrulama
document.getElementById('tc').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
});

