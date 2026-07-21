import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Muncul } from "@/components/muncul";
import { ambilArsipRenungan, formatTanggalPanjang } from "@/lib/renungan";

export const metadata: Metadata = {
  title: "Renungan Harian",
  description:
    "Arsip renungan harian Komunitas Kerahiman Ilahi Paroki Karawaci: ayat, refleksi, dan doa penutup untuk setiap hari.",
};

export const dynamic = "force-dynamic";

export default async function ArsipRenungan() {
  const arsip = await ambilArsipRenungan();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-5xl text-tinta">Renungan Harian</h1>
      <p className="mt-5 max-w-2xl text-tinta-muda">
        Renungan singkat setiap hari: ayat Kitab Suci, refleksi, dan doa penutup,
        teman perjalanan untuk menghidupi kerahiman Allah.
      </p>

      {arsip.length > 0 ? (
        <Muncul>
          <ul className="mt-10 divide-y divide-krem-tua">
            {arsip.map((r) => (
              <li key={r.tanggal}>
                <Link
                  href={`/renungan/${r.tanggal}`}
                  className="group flex gap-5 py-6 hover:bg-krem sm:rounded-lg sm:px-4 sm:-mx-4"
                >
                  {r.gambarUrl && (
                    <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-krem-tua bg-krem-tua">
                      <Image
                        src={r.gambarUrl}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-base text-abu">{formatTanggalPanjang(r.tanggal)}</p>
                    <p className="mt-1 font-display text-2xl text-tinta group-hover:text-emas-tua">
                      {r.judul || r.referensiAyat || formatTanggalPanjang(r.tanggal)}
                    </p>
                    {r.ayat && (
                      <p className="mt-1 line-clamp-2 text-tinta-muda">
                        &ldquo;{r.ayat}&rdquo;
                        {r.referensiAyat && <>, {r.referensiAyat}</>}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Muncul>
      ) : (
        <div className="mt-10 rounded-xl bg-krem px-6 py-10 text-center">
          <p className="text-tinta-muda">
            Belum ada renungan yang diterbitkan. Renungan harian akan mulai
            tayang di sini setelah situs diresmikan. Silakan kembali lagi.
          </p>
        </div>
      )}
    </div>
  );
}
