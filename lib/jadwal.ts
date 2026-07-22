/**
 * Jadwal rutin Komunitas Kerahiman Ilahi Paroki Karawaci.
 * Satu sumber data untuk Beranda dan halaman Devosi & Jadwal.
 */

export type JadwalRutin = {
  /** Kapan dilaksanakan: hari ke-berapa/frekuensi, mis. "Setiap hari", "Kamis ke-2" */
  kapan: string;
  /** Jam pelaksanaan, mis. "18.00 WIB". Dikosongkan bila tidak ditentukan. */
  jam?: string;
  kegiatan: string;
  keterangan: string;
};

export const jadwalRutinKomunitas: JadwalRutin[] = [
  {
    kapan: "Setiap hari",
    jam: "14.00 WIB",
    kegiatan: "Doa Koronka Satu Hati",
    keterangan: "WhatsApp grup KKI Karawaci",
  },
  {
    kapan: "Kamis ke-2",
    kegiatan: "Doa Koronka via Zoom",
    keterangan: "Melalui Zoom (daring)",
  },
  {
    kapan: "Kamis ke-3",
    jam: "18.00 WIB",
    kegiatan: "Misa Kerahiman Ilahi",
    keterangan:
      "Gereja Santo Agustinus, didahului doa Koronka pukul 17.30",
  },
  {
    kapan: "Kamis ke-4",
    jam: "14.50 WIB",
    kegiatan: "Ibadat Kerahiman Ilahi",
    keterangan: "Gereja Santo Agustinus",
  },
  {
    kapan: "Kamis ke-4 / ke-1",
    jam: "14.50 WIB",
    kegiatan: "Ibadat Kerahiman Ilahi Stasi Santo Petrus",
    keterangan: "Dua bulan sekali \u00b7 Stasi Santo Petrus",
  },
];
