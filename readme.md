# BPS Wilayah Crawler

Crawler untuk mengambil data wilayah administratif seluruh Indonesia dari API Bridging milik BPS (Badan Pusat Statistik), yang disinkronkan dengan data dari Kemendagri.

Hasil crawling berupa file `wilayah.json` yang menyimpan struktur wilayah secara hierarkis dari provinsi hingga desa, beserta kode wilayah versi BPS dan Kemendagri (DAGRI).

---

## Fitur

- Crawling data wilayah Indonesia berdasarkan periode tertentu
- Mendukung level: provinsi → kabupaten → kecamatan → desa
- Data bersumber dari API resmi BPS Bridging
- Setiap entri menyimpan:
  - `kode_bps` dan `nama_bps`
  - `kode_dagri` dan `nama_dagri`
- Sanitasi `kode_dagri` (menghapus titik)

---

## Prasyarat

- Node.js versi 18 atau lebih baru
- Koneksi internet

---

## Instalasi

Clone repository ini dan jalankan instalasi dependensi:

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

Isi `.env` seperti berikut:

```env
# Bisa ambil nilai PERIODE dari bps di https://sig.bps.go.id/bridging-kode
# Contoh nilai PERIODE:
# 2019_1.2019
# 2020_1.2020
# 2023_1.2022
# 2024_1.2022
# 2024_1.2025

PERIODE=2024_1.2025
WILAYAH_BRIDGING=https://sig.bps.go.id/rest-bridging/getwilayah
```

> Nilai `PERIODE` dapat dilihat di halaman: https://sig.bps.go.id/bridging-kode

---

## Menjalankan

Jalankan script dengan perintah:

```bash
node crawling.js
```

atau

```bash
npm run start
```

Hasil akan disimpan sebagai file `wilayah.json` di root folder.

---

## Contoh Output

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

---

## Catatan

- File `wilayah.json` akan ditimpa setiap proses crawling baru selesai.
- Kode wilayah DAGRI (`kode_dagri`) disanitasi menjadi tanpa titik (`.`) agar konsisten dan mudah diproses.

---

## Lisensi

Proyek ini menggunakan lisensi MIT. Bebas digunakan, disebarluaskan, dan dimodifikasi.

---

## Kontribusi

Pull request terbuka untuk perbaikan atau pengembangan tambahan seperti:

- Format ekspor lain (CSV, SQL, dsb.)
- Penambahan antarmuka pengguna (UI)
- Pengolahan perubahan antar periode
