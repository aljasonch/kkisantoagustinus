/**
 * Jadwal rutin Komunitas Kerahiman Ilahi Paroki Karawaci.
 * Satu sumber data untuk Beranda dan halaman Devosi & Jadwal.
 */

export type JadwalRutin = {
  /** Sorotan waktu/frekuensi yang ditampilkan besar di kiri, mis. "14.00 WIB" */
  sorotan: string;
  kegiatan: string;
  keterangan: string;
};

export const jadwalRutinKomunitas: JadwalRutin[] = [
  {
    sorotan: "14.00 WIB",
    kegiatan: "Doa Koronka Satu Hati",
    keterangan: "Setiap hari \u00b7 WhatsApp grup KKI Karawaci",
  },
  {
    sorotan: "Kamis ke-2",
    kegiatan: "Doa Koronka via Zoom",
    keterangan: "Setiap Kamis kedua \u00b7 melalui Zoom (daring)",
  },
  {
    sorotan: "18.00 WIB",
    kegiatan: "Misa Kerahiman Ilahi",
    keterangan:
      "Setiap Kamis ketiga \u00b7 Gereja Santo Agustinus, didahului doa Koronka pukul 17.30",
  },
  {
    sorotan: "14.50 WIB",
    kegiatan: "Ibadat Kerahiman Ilahi",
    keterangan: "Setiap Kamis keempat \u00b7 Gereja Santo Agustinus",
  },
  {
    sorotan: "14.50 WIB",
    kegiatan: "Ibadat Kerahiman Ilahi Stasi Santo Petrus",
    keterangan:
      "Kamis keempat/pertama, dua bulan sekali \u00b7 Stasi Santo Petrus",
  },
];
