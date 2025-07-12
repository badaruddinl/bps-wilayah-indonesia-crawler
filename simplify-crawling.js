const fs = require("fs");
const path = "./wilayah.json";

if (!fs.existsSync(path)) {
  console.error(
    "Error: File 'wilayah.json' tidak ditemukan. Jalankan dulu crawling.js atau full-crawling.js."
  );
  process.exit(1);
}

const data = require(path);

const output = {
  provinsi: data.provinsi.map((prov) => ({
    kode: prov.kode_bps,
    provinsiName: prov.nama_bps,
    kabupaten: prov.kabupaten.map((kab) => ({
      kode: kab.kode_bps,
      kabupatenName: kab.nama_bps,
      kecamatan: kab.kecamatan.map((kec) => ({
        kode: kec.kode_bps,
        kecamatanName: kec.nama_bps,
        desa: kec.desa.map((des) => ({
          kode: des.kode_bps,
          desaName: des.nama_bps,
        })),
      })),
    })),
  })),
};

fs.writeFileSync("result-wilayah.json", JSON.stringify(output, null, 2));
console.log("result-wilayah.json berhasil dibuat!");
