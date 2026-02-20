// Google Sheets API ayarları
// Bu URL'yi Google Sheets'i web'de yayınladıktan sonra güncelleyin
// JSON formatı için: https://spreadsheets.google.com/feeds/list/SPREADSHEET_ID/1/public/values?alt=json
// CSV formatı için: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=0
const SHEET_URL = 'YOUR_GOOGLE_SHEETS_URL_HERE';
const DATA_FORMAT = 'csv'; // 'json' veya 'csv' - CSV daha kolay ve güvenilir

let allData = [];
let filteredData = [];
let headers = [];

// Sayfa yüklendiğinde verileri çek
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // Arama ve filtreleme event listener'ları
    document.getElementById('searchInput').addEventListener('input', filterData);
    document.getElementById('filterEngelTuru').addEventListener('change', filterData);
    document.getElementById('filterCinsiyet').addEventListener('change', filterData);
    
    // Modal kapatma
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Google Sheets'ten veri çekme
async function loadData() {
    try {
        // Eğer SHEET_URL ayarlanmamışsa, kullanıcıya bilgi ver
        if (SHEET_URL === 'YOUR_GOOGLE_SHEETS_URL_HERE') {
            document.getElementById('tableBody').innerHTML = 
                '<tr><td colspan="15" class="empty">Lütfen script.js dosyasındaki SHEET_URL değişkenini Google Sheets URL\'si ile güncelleyin.<br><br>CSV için: Dosya > Paylaş > Herkesle paylaş yapın, sonra URL\'nin sonuna /export?format=csv&gid=0 ekleyin</td></tr>';
            return;
        }

        if (DATA_FORMAT === 'csv') {
            // CSV formatını kullan
            const response = await fetch(SHEET_URL);
            const csvText = await response.text();
            const parsed = parseCSV(csvText);
            headers = parsed.headers;
            allData = parsed.data;
        } else {
            // JSON formatını kullan
            const response = await fetch(SHEET_URL);
            const json = await response.json();
            
            // Google Sheets JSON formatını işle
            if (json.feed && json.feed.entry) {
                const parsed = parseSheetData(json.feed.entry);
                headers = parsed.headers;
                allData = parsed.data;
            } else if (json.table && json.table.rows) {
                // Modern Google Sheets JSON formatı
                const parsed = parseModernJSON(json);
                headers = parsed.headers;
                allData = parsed.data;
            } else if (Array.isArray(json)) {
                headers = Object.keys(json[0] || {});
                allData = json.slice(1); // İlk satır başlıklar
            } else {
                throw new Error('Beklenmeyen veri formatı');
            }
        }
        
        // Engel türü filtrelerini doldur
        populateEngelTuruFilter();
        
        // İstatistikleri güncelle
        updateStats();
        
        // Verileri göster
        filteredData = [...allData];
        displayData(filteredData);
        
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
        document.getElementById('tableBody').innerHTML = 
            '<tr><td colspan="15" class="empty">Veriler yüklenirken bir hata oluştu: ' + error.message + '<br><br>Lütfen Google Sheets URL\'sini ve paylaşım ayarlarını kontrol edin.</td></tr>';
    }
}

// CSV formatını parse etme
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], data: [] };
    
    // Başlık satırını al
    const headers = parseCSVLine(lines[0]);
    
    // Veri satırlarını işle
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === 0) continue;
        
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    
    return { headers, data };
}

// CSV satırını parse etme (virgül ve tırnak işaretlerini dikkate alarak)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // Çift tırnak karakterini atla
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    
    return result;
}

// Google Sheets eski JSON formatını parse etme
function parseSheetData(entries) {
    if (!entries || entries.length === 0) return { headers: [], data: [] };
    
    const headers = [];
    const data = [];
    
    entries.forEach((entry, index) => {
        const row = {};
        const entryKeys = Object.keys(entry).filter(key => key.startsWith('gsx$'));
        
        entryKeys.forEach((key, colIndex) => {
            const fieldName = key.replace('gsx$', '').toLowerCase().replace(/\s+/g, '');
            const value = entry[key].$t || '';
            
            if (index === 0) {
                headers.push(fieldName);
            } else {
                row[headers[colIndex]] = value;
            }
        });
        
        if (index > 0 && Object.keys(row).length > 0) {
            data.push(row);
        }
    });
    
    return { headers, data };
}

// Modern Google Sheets JSON formatını parse etme
function parseModernJSON(json) {
    if (!json.table || !json.table.rows) {
        return { headers: [], data: [] };
    }
    
    const rows = json.table.rows;
    if (rows.length === 0) return { headers: [], data: [] };
    
    // İlk satır başlıklar
    const headers = rows[0].c.map((cell, index) => {
        return cell ? (cell.v || `Column${index + 1}`) : `Column${index + 1}`;
    });
    
    // Veri satırları
    const data = [];
    for (let i = 1; i < rows.length; i++) {
        const row = {};
        rows[i].c.forEach((cell, index) => {
            row[headers[index]] = cell ? (cell.v || '') : '';
        });
        data.push(row);
    }
    
    return { headers, data };
}

// Sütun değerini güvenli şekilde alma
function getValue(row, ...keys) {
    for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
            return row[key];
        }
    }
    return '-';
}

// Verileri tabloda gösterme
function displayData(data) {
    const tbody = document.getElementById('tableBody');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15" class="empty">Kayıt bulunamadı.</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map((row, index) => {
        const tc = getValue(row, 'tc', 'TC', 'TC Kimlik No', 'tc kimlik no');
        const adSoyad = getValue(row, 'adisoyadi', 'Ad Soyad', 'ad soyad', 'Adı Soyadı', 'adı soyadı');
        const cinsiyet = getValue(row, 'cinsiyet', 'Cinsiyet');
        const dogumTarihi = getValue(row, 'dogumtarihi', 'Doğum Tarihi', 'doğum tarihi');
        const calismaDurumu = getValue(row, 'calismadurumu', 'Çalışma Durumu', 'çalışma durumu');
        const telefon = getValue(row, 'telefon', 'Telefon');
        const anneAdi = getValue(row, 'anneadi', 'Anne Adı', 'anne adı');
        const babaAdi = getValue(row, 'babaadi', 'Baba Adı', 'baba adı');
        const ogrenimDurumu = getValue(row, 'ogrenimdurumu', 'Öğrenim Durumu', 'öğrenim durumu');
        const engelTuru = getValue(row, 'engelturu', 'Engel Türü', 'engel türü');
        const engelOrani = getValue(row, 'engelorani', 'Engel Oranı', 'engel oranı');
        const engelOlusumZamani = getValue(row, 'engelolusumzamani', 'Engel Oluşum Zamanı', 'engel oluşum zamanı');
        const adres = getValue(row, 'adres', 'Adres');
        const aciklama = getValue(row, 'aciklama', 'Açıklama', 'açıklama', 'Not', 'not');
        
        return `
            <tr>
                <td>${tc}</td>
                <td>${adSoyad}</td>
                <td>${cinsiyet}</td>
                <td>${dogumTarihi}</td>
                <td>${calismaDurumu}</td>
                <td>${telefon}</td>
                <td>${anneAdi}</td>
                <td>${babaAdi}</td>
                <td>${ogrenimDurumu}</td>
                <td>${engelTuru}</td>
                <td>${engelOrani}</td>
                <td>${engelOlusumZamani}</td>
                <td>${adres.length > 50 ? adres.substring(0, 50) + '...' : adres}</td>
                <td>${aciklama.length > 50 ? aciklama.substring(0, 50) + '...' : aciklama}</td>
                <td>
                    <button class="action-btn view-btn" onclick="showDetails(${index})">Detay</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Detay modalını gösterme
function showDetails(index) {
    const row = filteredData[index];
    const modalBody = document.getElementById('modalBody');
    
    const details = [
        { label: 'TC Kimlik No', value: getValue(row, 'tc', 'TC', 'TC Kimlik No', 'tc kimlik no') },
        { label: 'Ad Soyad', value: getValue(row, 'adisoyadi', 'Ad Soyad', 'ad soyad', 'Adı Soyadı', 'adı soyadı') },
        { label: 'Cinsiyet', value: getValue(row, 'cinsiyet', 'Cinsiyet') },
        { label: 'Doğum Tarihi', value: getValue(row, 'dogumtarihi', 'Doğum Tarihi', 'doğum tarihi') },
        { label: 'Çalışma Durumu', value: getValue(row, 'calismadurumu', 'Çalışma Durumu', 'çalışma durumu') },
        { label: 'Telefon', value: getValue(row, 'telefon', 'Telefon') },
        { label: 'Anne Adı', value: getValue(row, 'anneadi', 'Anne Adı', 'anne adı') },
        { label: 'Baba Adı', value: getValue(row, 'babaadi', 'Baba Adı', 'baba adı') },
        { label: 'Öğrenim Durumu', value: getValue(row, 'ogrenimdurumu', 'Öğrenim Durumu', 'öğrenim durumu') },
        { label: 'Engel Türü', value: getValue(row, 'engelturu', 'Engel Türü', 'engel türü') },
        { label: 'Engel Oranı', value: getValue(row, 'engelorani', 'Engel Oranı', 'engel oranı') },
        { label: 'Engel Oluşum Zamanı', value: getValue(row, 'engelolusumzamani', 'Engel Oluşum Zamanı', 'engel oluşum zamanı') },
        { label: 'Adres', value: getValue(row, 'adres', 'Adres') },
        { label: 'Açıklama/Not', value: getValue(row, 'aciklama', 'Açıklama', 'açıklama', 'Not', 'not') }
    ];
    
    modalBody.innerHTML = details.map(detail => `
        <div class="detail-row">
            <div class="detail-label">${detail.label}:</div>
            <div class="detail-value">${detail.value}</div>
        </div>
    `).join('');
    
    document.getElementById('modal').style.display = 'block';
}

// Veri filtreleme
function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const engelTuru = document.getElementById('filterEngelTuru').value;
    const cinsiyet = document.getElementById('filterCinsiyet').value;
    
    filteredData = allData.filter(row => {
        const tc = getValue(row, 'tc', 'TC', 'TC Kimlik No', 'tc kimlik no').toString().toLowerCase();
        const adSoyad = getValue(row, 'adisoyadi', 'Ad Soyad', 'ad soyad', 'Adı Soyadı', 'adı soyadı').toLowerCase();
        const telefon = getValue(row, 'telefon', 'Telefon').toString().toLowerCase();
        
        const matchesSearch = !searchTerm || 
            tc.includes(searchTerm) || 
            adSoyad.includes(searchTerm) || 
            telefon.includes(searchTerm);
        
        const rowEngelTuru = getValue(row, 'engelturu', 'Engel Türü', 'engel türü');
        const matchesEngelTuru = !engelTuru || rowEngelTuru === engelTuru;
        
        const rowCinsiyet = getValue(row, 'cinsiyet', 'Cinsiyet');
        const matchesCinsiyet = !cinsiyet || rowCinsiyet === cinsiyet;
        
        return matchesSearch && matchesEngelTuru && matchesCinsiyet;
    });
    
    displayData(filteredData);
    updateStats();
}

// Engel türü filtrelerini doldurma
function populateEngelTuruFilter() {
    const engelTurleri = [...new Set(allData.map(row => 
        getValue(row, 'engelturu', 'Engel Türü', 'engel türü')
    ).filter(val => val !== '-'))];
    
    const select = document.getElementById('filterEngelTuru');
    engelTurleri.sort().forEach(tur => {
        const option = document.createElement('option');
        option.value = tur;
        option.textContent = tur;
        select.appendChild(option);
    });
}

// İstatistikleri güncelleme
function updateStats() {
    const total = filteredData.length;
    const male = filteredData.filter(row => {
        const cinsiyet = getValue(row, 'cinsiyet', 'Cinsiyet').toLowerCase();
        return cinsiyet.includes('erkek');
    }).length;
    const female = filteredData.filter(row => {
        const cinsiyet = getValue(row, 'cinsiyet', 'Cinsiyet').toLowerCase();
        return cinsiyet.includes('kadın') || cinsiyet.includes('kadin');
    }).length;
    const dogustan = filteredData.filter(row => {
        const zaman = getValue(row, 'engelolusumzamani', 'Engel Oluşum Zamanı', 'engel oluşum zamanı').toLowerCase();
        return zaman.includes('doğuştan') || zaman.includes('dogustan');
    }).length;
    const sonradan = filteredData.filter(row => {
        const zaman = getValue(row, 'engelolusumzamani', 'Engel Oluşum Zamanı', 'engel oluşum zamanı').toLowerCase();
        return zaman.includes('sonradan');
    }).length;
    
    document.getElementById('totalRecords').textContent = total;
    document.getElementById('maleCount').textContent = male;
    document.getElementById('femaleCount').textContent = female;
    document.getElementById('dogustanCount').textContent = dogustan;
    document.getElementById('sonradanCount').textContent = sonradan;
}

// Excel'e aktarma
function exportToExcel() {
    if (filteredData.length === 0) {
        alert('Aktarılacak veri bulunamadı.');
        return;
    }
    
    // CSV formatına dönüştür
    const exportHeaders = ['TC', 'Ad Soyad', 'Cinsiyet', 'Doğum Tarihi', 'Çalışma Durumu', 
                     'Telefon', 'Anne Adı', 'Baba Adı', 'Öğrenim Durumu', 'Engel Türü', 
                     'Engel Oranı', 'Engel Oluşum Zamanı', 'Adres', 'Açıklama'];
    
    const csvContent = [
        exportHeaders.join(','),
        ...filteredData.map(row => {
            const values = [
                getValue(row, 'tc', 'TC', 'TC Kimlik No', 'tc kimlik no'),
                getValue(row, 'adisoyadi', 'Ad Soyad', 'ad soyad', 'Adı Soyadı', 'adı soyadı'),
                getValue(row, 'cinsiyet', 'Cinsiyet'),
                getValue(row, 'dogumtarihi', 'Doğum Tarihi', 'doğum tarihi'),
                getValue(row, 'calismadurumu', 'Çalışma Durumu', 'çalışma durumu'),
                getValue(row, 'telefon', 'Telefon'),
                getValue(row, 'anneadi', 'Anne Adı', 'anne adı'),
                getValue(row, 'babaadi', 'Baba Adı', 'baba adı'),
                getValue(row, 'ogrenimdurumu', 'Öğrenim Durumu', 'öğrenim durumu'),
                getValue(row, 'engelturu', 'Engel Türü', 'engel türü'),
                getValue(row, 'engelorani', 'Engel Oranı', 'engel oranı'),
                getValue(row, 'engelolusumzamani', 'Engel Oluşum Zamanı', 'engel oluşum zamanı'),
                getValue(row, 'adres', 'Adres'),
                getValue(row, 'aciklama', 'Açıklama', 'açıklama', 'Not', 'not')
            ];
            return values.map(val => {
                if (val === '-') return '';
                // Virgül veya tırnak içeriyorsa tırnak içine al
                if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                    return `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            }).join(',');
        })
    ].join('\n');
    
    // BOM ekle (Türkçe karakterler için)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `engelsiz_veriler_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

