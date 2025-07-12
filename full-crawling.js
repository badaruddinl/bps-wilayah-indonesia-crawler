const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const delayMs = 300;
const outputFileFull = "wilayah.json";
const outputFileSimplified = "result-wilayah.json";
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

  const fullOutput = { provinsi: result };
  fs.writeFileSync(outputFileFull, JSON.stringify(fullOutput, null, 2));
  console.log(`\nData lengkap berhasil disimpan ke ${outputFileFull}`);

  const simplifiedOutput = {
    provinsi: fullOutput.provinsi.map((prov) => ({
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

  fs.writeFileSync(
    outputFileSimplified,
    JSON.stringify(simplifiedOutput, null, 2)
  );
  console.log(`Data sederhana berhasil disimpan ke ${outputFileSimplified}`);
}

crawlAllWilayah();
