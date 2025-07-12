# BPS Wilayah Crawler

Crawler untuk mengambil data wilayah administratif seluruh Indonesia dari API Bridging milik BPS (Badan Pusat Statistik), yang disinkronkan dengan data dari Kemendagri.

---

## Fitur

- Crawling data wilayah Indonesia berdasarkan periode tertentu
- Mendukung level: provinsi → kabupaten → kecamatan → desa
- Data bersumber dari API resmi BPS Bridging
- Output tersedia dalam dua format:

  - **Lengkap** (`wilayah.json`): berisi kode dan nama versi BPS & DAGRI
  - **Sederhana** (`result-wilayah.json`): hanya kode dan nama wilayah

- Sanitasi `kode_dagri` (menghapus titik)

---

## Prasyarat

- Node.js versi 18 atau lebih baru
- Koneksi internet

---

## Instalasi

Clone repository ini dan instal dependensi:

```bash
git clone https://github.com/badaruddinl/bps-wilayah-indonesia-crawler.git
cd bps-wilayah-indonesia-crawler
npm install
```

---

## Konfigurasi

Buat file `.env` berdasarkan `.env.example`:

```bash
cp .env.example .env
```

Isi `.env` dengan data seperti berikut:

```env
# Daftar periode tersedia di https://sig.bps.go.id/bridging-kode
PERIODE=2024_1.2025
WILAYAH_BRIDGING=https://sig.bps.go.id/rest-bridging/getwilayah
```

> Nilai `PERIODE` dapat dilihat di halaman: [https://sig.bps.go.id/bridging-kode](https://sig.bps.go.id/bridging-kode)

---

## Menjalankan

Terdapat 3 mode/script yang dapat dijalankan:

### 1. Full Crawling (lengkap + sederhana)

```bash
npm start
# atau
node full-crawling.js
```

- Menyimpan:

  - `wilayah.json` → data lengkap (BPS + DAGRI)
  - `result-wilayah.json` → data sederhana

### 2. Crawling Data Lengkap Saja

```bash
npm run crawl
# atau
node crawling.js
```

- Hanya menyimpan `wilayah.json`

### 3. Konversi ke Data Sederhana dari File yang Ada

```bash
npm run simplify
# atau
node simplify-crawling.js
```

- Membaca `wilayah.json` dan menghasilkan `result-wilayah.json`

---

## Contoh Output

### `wilayah.json` (lengkap):

```json
{
  "provinsi": [
    {
      "kode_bps": "11",
      "nama_bps": "ACEH",
      "kode_dagri": "11",
      "nama_dagri": "ACEH",
      "kabupaten": [
        {
          "kode_bps": "1101",
          "nama_bps": "KAB. SIMEULUE",
          "kode_dagri": "1101",
          "nama_dagri": "KAB. SIMEULUE",
          "kecamatan": [
            {
              "kode_bps": "1101010",
              "nama_bps": "TEUPAH SELATAN",
              "kode_dagri": "110907",
              "nama_dagri": "TEUPAH SELATAN",
              "desa": [
                {
                  "kode_bps": "1101010001",
                  "nama_bps": "LATIUNG",
                  "kode_dagri": "1109072008",
                  "nama_dagri": "LATIUNG"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### `result-wilayah.json` (sederhana):

```json
{
  "provinsi": [
    {
      "kode": "11",
      "provinsiName": "ACEH",
      "kabupaten": [
        {
          "kode": "1101",
          "kabupatenName": "KAB. SIMEULUE",
          "kecamatan": [
            {
              "kode": "1101010",
              "kecamatanName": "TEUPAH SELATAN",
              "desa": [
                {
                  "kode": "1101010001",
                  "desaName": "LATIUNG"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Catatan

- File `wilayah.json` dan `result-wilayah.json` akan ditimpa setiap kali proses dijalankan ulang.
- `kode_dagri` otomatis dibersihkan dari titik (`.`).
- Pastikan endpoint dan periode masih aktif saat crawling.

---

## Lisensi

Proyek ini menggunakan lisensi MIT. Bebas digunakan, disebarluaskan, dan dimodifikasi.

---

## Kontribusi

Pull request terbuka untuk perbaikan atau pengembangan tambahan seperti:

- Ekspor ke format lain (CSV, SQL, GeoJSON)
- Penambahan antarmuka pengguna (UI)
- Pembanding antar periode
