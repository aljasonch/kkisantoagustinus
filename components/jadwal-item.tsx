import type { JadwalRutin } from "@/lib/jadwal";

/**
 * Satu baris jadwal rutin. Informasi "kapan" (hari ke-berapa/frekuensi) dan
 * "jam" dipisah jelas: lencana kecil untuk hari, teks besar untuk jam, lalu
 * nama kegiatan dan keterangan di sampingnya. Dipakai di Beranda dan halaman
 * Devosi & Jadwal agar tampilan konsisten.
 */
export function ItemJadwal({ jadwal }: { jadwal: JadwalRutin }) {
  return (
    <li className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:gap-8">
      <div className="w-40 shrink-0 space-y-1.5">
        <span className="inline-block rounded-md bg-emas-muda px-2.5 py-0.5 text-base font-medium text-emas-tua">
          {jadwal.kapan}
        </span>
        {jadwal.jam && (
          <p className="font-display text-2xl text-emas-tua">{jadwal.jam}</p>
        )}
      </div>
      <div>
        <p className="text-xl font-medium text-tinta">{jadwal.kegiatan}</p>
        <p className="text-tinta-muda">{jadwal.keterangan}</p>
      </div>
    </li>
  );
}
