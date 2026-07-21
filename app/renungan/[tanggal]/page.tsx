import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ambilRenungan,
  formatTanggalPanjang,
  keParagraf,
} from "@/lib/renungan";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/renungan/[tanggal]">
): Promise<Metadata> {
  const { tanggal } = await props.params;
  const renungan = await ambilRenungan(tanggal);
  if (!renungan) return { title: "Renungan" };

  const judul = renungan.judul || renungan.referensiAyat || "Renungan";
  const tanggalPanjang = formatTanggalPanjang(renungan.tanggal);
  const judulLengkap = `${judul}, Renungan ${tanggalPanjang}`;

  // Deskripsi untuk preview sosial: pakai ayat bila ada, selain itu
  // penggalan paragraf pertama renungan.
  const paragrafPertama = keParagraf(renungan.isiRenungan)[0] ?? "";
  const deskripsi = renungan.ayat
    ? `\u201c${renungan.ayat}\u201d${
        renungan.referensiAyat ? ` (${renungan.referensiAyat})` : ""
      }`
    : paragrafPertama
      ? `${paragrafPertama.slice(0, 160)}\u2026`
      : `Renungan harian ${tanggalPanjang}.`;

  // Gambar renungan (Cloudinary) dipakai sebagai gambar preview; bila tidak
  // ada, mundur ke gambar bawaan situs.
  const gambar = renungan.gambarUrl || "/hero.jpg";

  return {
    title: judulLengkap,
    description: deskripsi,
    openGraph: {
      type: "article",
      locale: "id_ID",
      siteName: "Komunitas Kerahiman Ilahi Paroki Karawaci",
      title: judulLengkap,
      description: deskripsi,
      publishedTime: renungan.tanggal,
      images: [{ url: gambar, alt: judul }],
    },
    twitter: {
      card: "summary_large_image",
      title: judulLengkap,
      description: deskripsi,
      images: [gambar],
    },
  };
}

export default async function DetailRenungan(props: PageProps<"/renungan/[tanggal]">) {
  const { tanggal } = await props.params;
  const renungan = await ambilRenungan(tanggal);
  if (!renungan) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <p>
        <Link
          href="/renungan"
          className="font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
        >
          <span aria-hidden="true">&larr;</span> Semua renungan
        </Link>
      </p>

      <header className="mt-8 flex flex-col items-center text-center">
        <p className="text-abu">{formatTanggalPanjang(renungan.tanggal)}</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-tinta sm:text-5xl">
          {renungan.judul || renungan.referensiAyat || "Renungan"}
        </h1>
        {renungan.penulis && (
          <p className="mt-3 text-abu">
            oleh <span className="font-medium text-tinta-muda">{renungan.penulis}</span>
          </p>
        )}
      </header>

      {renungan.gambarUrl && (
        <div className="mt-10">
          <Image
            src={renungan.gambarUrl}
            alt={renungan.judul || "Gambar renungan"}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded-xl border border-krem-tua shadow-sm"
          />
        </div>
      )}

      {renungan.ayat && (
        <section aria-label="Ayat hari ini" className="mt-10">
          <blockquote className="rounded-xl bg-krem px-6 py-8 text-xl italic text-tinta sm:px-10">
            &ldquo;{renungan.ayat}&rdquo;
            {renungan.referensiAyat && (
              <cite className="mt-3 block text-lg not-italic font-medium text-merah">
                {renungan.referensiAyat} (Alkitab Terjemahan Baru)
              </cite>
            )}
          </blockquote>
        </section>
      )}

      {renungan.kutipanFaustina && (
        <section aria-label="Kutipan Santa Faustina" className="mt-10">
          <blockquote className="rounded-xl bg-tinta px-6 py-8 text-center sm:px-10">
            <p className="mx-auto max-w-2xl font-display text-lg leading-relaxed text-krem sm:text-xl">
              &ldquo;{renungan.kutipanFaustina}&rdquo;
            </p>
            <cite className="mt-4 block text-base not-italic uppercase tracking-widest text-emas-muda">
              Buku Harian Santa Faustina
            </cite>
          </blockquote>
        </section>
      )}

      <section aria-label="Renungan" className="mt-10 space-y-6 text-tinta-muda">
        {keParagraf(renungan.isiRenungan).map((paragraf, i) => (
          <p key={i}>{paragraf}</p>
        ))}
      </section>

      {renungan.doaPenutup && (
        <section aria-labelledby="judul-doa" className="mt-12">
          <h2 id="judul-doa" className="font-display text-2xl text-emas-tua">
            Doa Penutup
          </h2>
          <div className="mt-3 space-y-4 italic text-tinta">
            {keParagraf(renungan.doaPenutup).map((paragraf, i) => (
              <p key={i}>{paragraf}</p>
            ))}
          </div>
          <p className="mt-4 text-tinta">Amin.</p>
        </section>
      )}
    </article>
  );
}
