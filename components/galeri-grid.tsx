"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { FotoGaleri } from "@/lib/galeri";

/**
 * Galeri foto kegiatan: kisi-kisi yang membesar saat disorot, diklik untuk
 * membuka tampilan besar (lightbox). Tombol Tutup / klik latar / tombol Esc
 * menutup lightbox; gulir halaman dikunci selama terbuka.
 */
export function GaleriGrid({ foto }: { foto: FotoGaleri[] }) {
  const [terbuka, setTerbuka] = useState<FotoGaleri | null>(null);

  const tutup = useCallback(() => setTerbuka(null), []);

  useEffect(() => {
    if (!terbuka) return;
    function tekanTombol(e: KeyboardEvent) {
      if (e.key === "Escape") tutup();
    }
    window.addEventListener("keydown", tekanTombol);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tekanTombol);
      document.body.style.overflow = "";
    };
  }, [terbuka, tutup]);

  return (
    <>
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {foto.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => setTerbuka(f)}
              aria-label={
                f.caption ? `Perbesar foto: ${f.caption}` : "Perbesar foto"
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
                </span>
                <figcaption className="px-3 py-2.5 text-base leading-snug text-tinta-muda line-clamp-2">
                  {f.caption || "Kegiatan KKI Karawaci"}
                </figcaption>
              </figure>
            </button>
          </li>
        ))}
      </ul>

      {terbuka && (
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
          <figure
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-putih">
              <Image
                src={terbuka.url}
                alt={terbuka.caption || "Foto kegiatan KKI Karawaci"}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </span>
            {terbuka.caption && (
              <figcaption className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-krem">
                {terbuka.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
