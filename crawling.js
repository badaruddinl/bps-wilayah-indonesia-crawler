const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const delayMs = 300;
const outputFile = "wilayah.json";
const periode_merge = process.env.PERIODE;
const url = process.env.WILAYAH_BRIDGING;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeKode(kode) {
  return kode?.replace(/\./g, "") ?? null;
}

async function fetchWilayah(level, parent = "") {
  try {
    const { data } = await axios.get(url, {
      params: { level, parent, periode_merge },
    });
    return data || [];
  } catch (err) {
    console.error(`Error fetching ${level} (${parent}): ${err.message}`);
    return [];
  }
}

async function crawlAllWilayah() {
  const result = [];

  const provinsiList = await fetchWilayah("provinsi", "0");
  if (!provinsiList.length) {
    console.error("Tidak ditemukan provinsi.");
    return;
  }

  console.log(`Ditemukan ${provinsiList.length} provinsi`);

  for (const prov of provinsiList) {
    console.log(prov.nama_bps);
    const kabupatenList = await fetchWilayah("kabupaten", prov.kode_bps);
    await sleep(delayMs);

    const kabupatenData = [];

    for (const kab of kabupatenList) {
      console.log(`  ${kab.nama_bps}`);
      const kecamatanList = await fetchWilayah("kecamatan", kab.kode_bps);
      await sleep(delayMs);

      const kecamatanData = [];

      for (const kec of kecamatanList) {
        console.log(`    ${kec.nama_bps}`);
        const desaList = await fetchWilayah("desa", kec.kode_bps);
        await sleep(delayMs);

        const desaData = desaList.map((desa) => ({
          kode_bps: desa.kode_bps,
          nama_bps: desa.nama_bps,
          kode_dagri: sanitizeKode(desa.kode_dagri),
          nama_dagri: desa.nama_dagri,
        }));

        kecamatanData.push({
          kode_bps: kec.kode_bps,
          nama_bps: kec.nama_bps,
          kode_dagri: sanitizeKode(kec.kode_dagri),
          nama_dagri: kec.nama_dagri,
          desa: desaData,
        });
      }

      kabupatenData.push({
        kode_bps: kab.kode_bps,
        nama_bps: kab.nama_bps,
        kode_dagri: sanitizeKode(kab.kode_dagri),
        nama_dagri: kab.nama_dagri,
        kecamatan: kecamatanData,
      });
    }

    result.push({
      kode_bps: prov.kode_bps,
      nama_bps: prov.nama_bps,
      kode_dagri: sanitizeKode(prov.kode_dagri),
      nama_dagri: prov.nama_dagri,
      kabupaten: kabupatenData,
    });
  }

  const output = { provinsi: result };
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`\nData berhasil disimpan ke ${outputFile}`);
}

crawlAllWilayah();
