import Image from "next/image";
import Link from "next/link";
import heroImg from "@/public/hero.jpg";
import { Muncul } from "@/components/muncul";
import { TautanTeks, TautanTombol } from "@/components/tombol";
import { ambilGaleriPublik } from "@/lib/galeri";
import { jadwalRutinKomunitas } from "@/lib/jadwal";
import { kutipanHariIni } from "@/lib/kutipan";
import {
  ambilRenunganHariIni,
  formatTanggalPanjang,
  keParagraf,
  tanggalHariIni,
} from "@/lib/renungan";

export const dynamic = "force-dynamic";

export default async function Beranda() {
  const renungan = await ambilRenunganHariIni();
  const kutipan = kutipanHariIni();
  const galeriTerbaru = (await ambilGaleriPublik()).slice(0, 6);

  return (
    <>
      <section className="relative flex min-h-[94svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
        <Image
          src={heroImg}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="pointer-events-none absolute inset-0 -z-10 object-cover opacity-[0.18]"
        />
        <div className="anim-masuk">
          <p className="text-lg tracking-widest text-abu uppercase">
            Paroki Karawaci &middot; Gereja Santo Agustinus
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-tight text-tinta sm:text-6xl">
            Komunitas Kerahiman Ilahi
          </h1>
          <p className="mt-6 font-display text-2xl text-merah sm:text-3xl">
            &ldquo;Yesus, Engkau Andalanku&rdquo;
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-tinta-muda">
            Datanglah kepada Kerahiman-Nya. Alamilah kasih-Nya. Jadilah saksi belas kasih-Nya bagi dunia.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <TautanTombol href="/devosi-jadwal">Lihat Jadwal Doa</TautanTombol>
          </div>
        </div>

        <p
          aria-label="Gulir ke bawah"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-abu transition-colors hover:text-emas-tua"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="anim-gulir h-9 w-9"
          >
            <path d="m6 6 6 6 6-6" opacity="0.4" />
            <path d="m6 13 6 6 6-6" />
          </svg>
        </p>
      </section>

      {/* Renungan Hari Ini */}
      <section aria-labelledby="judul-renungan" className="bg-krem px-5 py-16">
        <Muncul className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <h2 id="judul-renungan" className="font-display text-4xl text-tinta">
              Renungan Hari Ini
            </h2>
            <p className="mt-2 text-abu">
              {formatTanggalPanjang(renungan?.tanggal ?? tanggalHariIni())}
            </p>
          </div>

          {renungan ? (
            <div className="mt-8">
              {renungan.gambarUrl && (
                <div className="mx-auto w-full max-w-md rounded-xl border border-krem-tua bg-putih p-2 shadow-sm">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={renungan.gambarUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 90vw, 448px"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              {renungan.judul && (
                <p className="mt-6 text-center font-display text-2xl text-emas-tua">
                  {renungan.judul}
                </p>
              )}
              {renungan.ayat && (
                <blockquote className="mx-auto mt-6 max-w-2xl border-l-4 border-emas pl-5 text-xl italic text-tinta-muda">
                  &ldquo;{renungan.ayat}&rdquo;
                  {renungan.referensiAyat && (
                    <cite className="mt-2 block text-lg not-italic font-medium text-merah">
                      {renungan.referensiAyat}
                    </cite>
                  )}
                </blockquote>
              )}
              <p className="mx-auto mt-6 line-clamp-3 max-w-2xl">
                {keParagraf(renungan.isiRenungan)[0]}
              </p>
              <div className="mt-6 text-center">
                <TautanTeks href={`/renungan/${renungan.tanggal}`}>
                  Baca renungan lengkap
                </TautanTeks>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <p className="mx-auto max-w-2xl text-tinta-muda">
                Renungan hari ini belum tersedia. Renungan harian akan mulai
                tayang di sini setelah situs diresmikan.
              </p>
              <div className="mt-4">
                <TautanTeks href="/renungan">Lihat arsip renungan</TautanTeks>
              </div>
            </div>
          )}
        </Muncul>
      </section>

      {/* Sambutan Ketua */}
      <section aria-labelledby="judul-sambutan" className="px-5 py-16">
        <Muncul className="mx-auto max-w-3xl">
          <h2 id="judul-sambutan" className="font-display text-4xl text-tinta">
            Sambutan Ketua
          </h2>
          <div className="mt-8 border-l-4 border-emas pl-6 sm:pl-8">
            <p className="font-display text-xl text-emas-tua">Salam Kerahiman.</p>
            <p className="mt-4 text-tinta-muda">
              Selamat datang di website Komunitas Kerahiman Ilahi Gereja Santo
              Agustinus Paroki Karawaci.
            </p>
            <p className="mt-4 text-tinta-muda">
              Di tengah dinamika kehidupan, kita dipanggil untuk kembali kepada
              sumber pengharapan sejati, Kerahiman Allah yang tak pernah
              habis. Semoga setiap pengunjung tidak hanya memperoleh informasi,
              tetapi juga mengalami sentuhan kasih Tuhan yang menguatkan dan
              memperbarui hati.
            </p>
            <p className="mt-4 text-tinta-muda">
              Mari kita terus hidup dalam kepercayaan kepada-Nya dan mewartakan
              Kerahiman-Nya melalui doa, pelayanan, dan belas kasih kepada
              sesama. Tuhan memberkati.
            </p>
          </div>
          <div className="mt-8">
            <p className="font-display text-2xl text-tinta">Brigitta Dwiyana Taurisia</p>
            <p className="mt-1 text-base text-abu">
              Ketua Komunitas Kerahiman Ilahi
              <br />
              Paroki Santo Agustinus Karawaci
            </p>
          </div>
        </Muncul>
      </section>

      {/* Kutipan Buku Harian Santa Faustina */}
      <section aria-labelledby="judul-kutipan" className="bg-tinta px-5 py-16">
        <Muncul className="mx-auto max-w-3xl text-center">
          <p id="judul-kutipan" className="text-sm tracking-widest text-krem/70 uppercase">
            Dari Buku Harian Santa Faustina
          </p>
          <blockquote className="mt-6 font-display text-2xl leading-relaxed text-krem sm:text-3xl">
            &ldquo;{kutipan.teks}&rdquo;
          </blockquote>
          <p className="mt-5 text-lg text-emas-muda">{kutipan.sumber}</p>
        </Muncul>
      </section>

      {/* Jadwal rutin komunitas */}
      <section aria-labelledby="judul-jadwal" className="bg-krem px-5 py-16">
        <Muncul className="mx-auto max-w-3xl">
          <h2 id="judul-jadwal" className="font-display text-4xl text-tinta">
            Jadwal Doa Bersama
          </h2>
          <ul className="mt-8 divide-y divide-krem-tua">
            {jadwalRutinKomunitas.map((j) => (
              <li
                key={j.kegiatan}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <p className="w-40 shrink-0 font-display text-2xl text-emas-tua">
                  {j.sorotan}
                </p>
                <div>
                  <p className="text-xl font-medium text-tinta">{j.kegiatan}</p>
                  <p className="text-tinta-muda">{j.keterangan}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <TautanTeks href="/devosi-jadwal">
              Jadwal lengkap &amp; teks doa Koronka
            </TautanTeks>
          </div>
        </Muncul>
      </section>

      {galeriTerbaru.length > 0 && (
        <section aria-labelledby="judul-galeri" className="bg-putih px-5 py-16">
          <Muncul className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <h2 id="judul-galeri" className="font-display text-4xl text-tinta">
                  Galeri Kegiatan
                </h2>
                <p className="mt-2 text-tinta-muda">
                  Momen terbaru dari perjalanan komunitas.
                </p>
              </div>
              <TautanTeks href="/galeri">Lihat semua</TautanTeks>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galeriTerbaru.map((f) => (
                <li key={f.id}>
                  <Link
                    href="/galeri"
                    aria-label={f.caption || "Buka galeri kegiatan"}
                    className="group relative block aspect-square overflow-hidden rounded-lg bg-krem-tua shadow-sm transition-shadow duration-300 hover:shadow-lg"
                  >
                    <Image
                      src={f.url}
                      alt={f.caption || "Foto kegiatan KKI Karawaci"}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Muncul>
        </section>
      )}
    </>
  );
}
