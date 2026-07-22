"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { FotoGaleri } from "@/lib/galeri";

/**
 * Galeri foto kegiatan: tiap item bisa berisi satu atau beberapa foto.
 * Kisi-kisi menampilkan foto sampul (dengan lencana jumlah bila lebih dari
 * satu); diklik untuk membuka lightbox yang dapat menelusuri seluruh foto
 * dalam item tersebut lewat tombol panah atau kibor. Tombol Tutup / klik
 * latar / tombol Esc menutup lightbox; gulir halaman dikunci selama terbuka.
 */
export function GaleriGrid({ foto }: { foto: FotoGaleri[] }) {
  const [terbuka, setTerbuka] = useState<FotoGaleri | null>(null);
  const [indeks, setIndeks] = useState(0);

  const buka = useCallback((item: FotoGaleri) => {
    setTerbuka(item);
    setIndeks(0);
  }, []);
  const tutup = useCallback(() => setTerbuka(null), []);

  const fotoTerbuka = terbuka?.fotoUrls ?? [];
  const jumlah = fotoTerbuka.length;
  const urlAktif = fotoTerbuka[indeks];

  const sebelumnya = useCallback(() => {
    setIndeks((i) => (i - 1 + jumlah) % jumlah);
  }, [jumlah]);
  const berikutnya = useCallback(() => {
    setIndeks((i) => (i + 1) % jumlah);
  }, [jumlah]);

  useEffect(() => {
    if (!terbuka) return;
    function tekanTombol(e: KeyboardEvent) {
      if (e.key === "Escape") tutup();
      else if (e.key === "ArrowLeft" && jumlah > 1) sebelumnya();
      else if (e.key === "ArrowRight" && jumlah > 1) berikutnya();
    }
    window.addEventListener("keydown", tekanTombol);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tekanTombol);
      document.body.style.overflow = "";
    };
  }, [terbuka, tutup, jumlah, sebelumnya, berikutnya]);

  return (
    <>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {foto.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => buka(f)}
              aria-label={
                f.caption ? `Buka foto: ${f.caption}` : "Buka foto kegiatan"
              }
              className="group block w-full rounded-xl text-left transition-shadow duration-300 hover:shadow-lg"
            >
              <figure className="overflow-hidden rounded-xl border border-krem-tua bg-krem">
                <span className="relative block aspect-square overflow-hidden">
                  <Image
                    src={f.url}
                    alt={f.caption || "Foto kegiatan KKI Karawaci"}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {f.fotoUrls.length > 1 && (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-tinta/70 px-2.5 py-1 text-sm font-medium text-putih">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect x="3" y="7" width="14" height="13" rx="2" />
                        <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                      </svg>
                      {f.fotoUrls.length}
                    </span>
                  )}
                </span>
                <figcaption className="px-3 py-2.5 text-base leading-snug text-tinta-muda line-clamp-2">
                  {f.caption || "Kegiatan KKI Karawaci"}
                </figcaption>
              </figure>
            </button>
          </li>
        ))}
      </ul>

      {terbuka && urlAktif && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={terbuka.caption || "Foto galeri"}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-tinta/90 p-4 sm:p-8"
          onClick={tutup}
        >
          <button
            type="button"
            onClick={tutup}
            className="absolute right-4 top-4 inline-flex min-h-12 items-center gap-2 rounded-lg bg-krem px-5 py-2 text-lg font-medium text-tinta hover:bg-putih"
          >
            Tutup <span aria-hidden="true">&times;</span>
          </button>

          {jumlah > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sebelumnya();
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-krem/90 text-tinta hover:bg-putih sm:left-6"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  berikutnya();
                }}
                aria-label="Foto berikutnya"
                className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-krem/90 text-tinta hover:bg-putih sm:right-6"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}

          <figure
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-putih">
              <Image
                src={urlAktif}
                alt={terbuka.caption || "Foto kegiatan KKI Karawaci"}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </span>
            <figcaption className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-krem">
              {terbuka.caption}
              {jumlah > 1 && (
                <span className="mt-1 block text-base text-krem/70">
                  {indeks + 1} / {jumlah}
                </span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
