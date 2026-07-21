import { tanggalHariIni } from "./renungan";

/**
 * Kutipan-kutipan dari buku harian Santa Faustina Kowalska
 * ("Kerahiman Ilahi dalam Jiwaku"). Ditampilkan bergantian setiap hari di
 * Beranda; nomor entri buku harian disertakan sebagai rujukan sumber.
 */

export type KutipanFaustina = {
  teks: string;
  /** Rujukan entri buku harian, mis. "Buku Harian Santa Faustina, no. 699" */
  sumber: string;
};

export const kutipanFaustina: KutipanFaustina[] = [
  {
    teks: "Hendaklah tiada satu jiwa pun takut mendekati Aku, sekalipun dosa-dosanya merah seperti kirmizi.",
    sumber: "Buku Harian Santa Faustina, no. 699",
  },
  {
    teks: "Bejana untuk menimba rahmat dari sumber kerahiman hanyalah satu, yaitu kepercayaan; semakin jiwa percaya, semakin banyak yang diterimanya.",
    sumber: "Buku Harian Santa Faustina, no. 1578",
  },
  {
    teks: "Aku menghendaki seluruh dunia mengenal kerahiman-Ku; Aku menghendaki menganugerahkan rahmat yang tak terbayangkan kepada jiwa-jiwa yang percaya pada kerahiman-Ku.",
    sumber: "Buku Harian Santa Faustina, no. 687",
  },
  {
    teks: "Semakin besar pendosa, semakin besar pula haknya atas kerahiman-Ku.",
    sumber: "Buku Harian Santa Faustina, no. 723",
  },
  {
    teks: "Darah dan Air, yang terpancar dari Hati Yesus sebagai sumber kerahiman bagi kami. Yesus, Engkau Andalanku.",
    sumber: "Buku Harian Santa Faustina, no. 84",
  },
  {
    teks: "Dahulu Aku mengutus para nabi dengan guruh dan petir kepada umat-Ku; sekarang Aku mengutus engkau dengan kerahiman-Ku kepada seluruh umat manusia.",
    sumber: "Buku Harian Santa Faustina, no. 742",
  },
  {
    teks: "Umat manusia tidak akan beroleh damai sejahtera, sebelum berbalik kepada sumber kerahiman-Ku dengan penuh kepercayaan.",
    sumber: "Buku Harian Santa Faustina, no. 300",
  },
];

/** Kutipan "hari ini", berputar menurut hari dalam tahun (WIB). */
export function kutipanHariIni(): KutipanFaustina {
  const [tahun, bulan, hari] = tanggalHariIni().split("-").map(Number);
  const hariKeTahun = Math.floor(
    (Date.UTC(tahun, bulan - 1, hari) - Date.UTC(tahun, 0, 0)) / 86_400_000
  );
  return kutipanFaustina[hariKeTahun % kutipanFaustina.length];
}
