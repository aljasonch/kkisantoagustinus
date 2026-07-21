import { TautanTeks } from "@/components/tombol";

export default function RenunganTidakDitemukan() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h1 className="font-display text-4xl text-tinta">Renungan tidak ditemukan</h1>
      <p className="mx-auto mt-4 max-w-xl text-tinta-muda">
        Renungan untuk tanggal ini belum tersedia atau belum diterbitkan.
      </p>
      <div className="mt-8 flex justify-center">
        <TautanTeks href="/renungan">Lihat semua renungan</TautanTeks>
      </div>
    </div>
  );
}
