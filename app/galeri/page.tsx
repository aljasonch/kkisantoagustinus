import type { Metadata } from "next";
import { GaleriGrid } from "@/components/galeri-grid";
import { Muncul } from "@/components/muncul";
import { TautanTeks } from "@/components/tombol";
import { ambilGaleriPublik } from "@/lib/galeri";

export const metadata: Metadata = {
  title: "Galeri Kegiatan",
  description:
    "Dokumentasi perjalanan dan kegiatan Komunitas Kerahiman Ilahi Paroki Karawaci: doa bersama, misa, ibadat, dan karya kasih.",
};

export const dynamic = "force-dynamic";

export default async function Galeri() {
  const foto = await ambilGaleriPublik();

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <Muncul>
        <h1 className="font-display text-5xl text-tinta">Galeri Kegiatan</h1>
        <p className="mt-5 max-w-2xl text-tinta-muda">
          Perjalanan komunitas dari waktu ke waktu: doa bersama, misa,
          ibadat, dan momen kebersamaan KKI Paroki Karawaci. Klik foto untuk
          melihatnya lebih besar.
        </p>
      </Muncul>

      {foto.length > 0 ? (
        <Muncul>
          <GaleriGrid foto={foto} />
        </Muncul>
      ) : (
        <div className="mt-10 rounded-xl bg-krem px-6 py-10 text-center">
          <p className="mx-auto max-w-xl text-tinta-muda">
            Belum ada foto yang ditayangkan. Dokumentasi kegiatan komunitas
            akan mulai tampil di sini.
          </p>
          <div className="mt-4 flex justify-center">
            <TautanTeks href="/kontak">Hubungi komunitas</TautanTeks>
          </div>
        </div>
      )}
    </div>
  );
}
