"use client";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  GerbangPengurus,
  kelasTombolUtama,
} from "@/components/admin/gerbang-pengurus";
import { getDb } from "@/lib/firebase";
import { formatTanggalPanjang, type Renungan } from "@/lib/renungan";

function DaftarRenungan() {
  const [daftar, setDaftar] = useState<Renungan[] | null>(null);
  const [galat, setGalat] = useState<string | null>(null);

  const muatDaftar = useCallback(() => {
    getDocs(collection(getDb(), "renungan"))
      .then((snap) => {
        setDaftar(
          snap.docs
            .map((d) => ({ ...(d.data() as Renungan), tanggal: d.id }))
            .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
        );
      })
      .catch(() => {
        setGalat("Daftar renungan tidak bisa dimuat. Periksa koneksi internet, lalu muat ulang halaman.");
      });
  }, []);

  useEffect(() => {
    muatDaftar();
  }, [muatDaftar]);

  async function hapus(renungan: Renungan) {
    const yakin = window.confirm(
      `Hapus renungan tanggal ${formatTanggalPanjang(renungan.tanggal)}?\nTindakan ini tidak bisa dibatalkan.`
    );
    if (!yakin) return;
    try {
      await deleteDoc(doc(getDb(), "renungan", renungan.tanggal));
      muatDaftar();
    } catch {
      setGalat("Renungan gagal dihapus. Coba lagi.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-tinta">Renungan Harian</h1>
        <div className="flex flex-wrap items-center gap-5">
          <Link
            href="/admin/galeri"
            className="inline-flex min-h-13 items-center justify-center rounded-lg border-2 border-emas-tua px-6 py-3 text-lg font-medium text-emas-tua hover:bg-krem"
          >
            Kelola Galeri
          </Link>
          <Link href="/admin/editor" className={kelasTombolUtama}>
            + Tulis Renungan Baru
          </Link>
        </div>
      </div>

      {galat && (
        <p role="alert" className="mt-6 rounded-lg bg-merah-muda px-4 py-3 text-merah">
          {galat}
        </p>
      )}

      {daftar === null ? (
        <p className="mt-10 text-abu">Memuat daftar renungan&hellip;</p>
      ) : daftar.length === 0 ? (
        <div className="mt-10 rounded-xl bg-krem px-6 py-10 text-center text-tinta-muda">
          <p>Belum ada renungan.</p>
          <p className="mt-2">
            Tekan tombol <strong className="font-medium">+ Tulis Renungan Baru</strong>{" "}
            di atas untuk membuat renungan pertama.
          </p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-krem-tua">
          {daftar.map((r) => (
            <li
              key={r.tanggal}
              className="flex flex-wrap items-center justify-between gap-4 py-5"
            >
              <div className="flex items-center gap-4">
                {r.gambarUrl && (
                  <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-krem-tua">
                    <Image
                      src={r.gambarUrl}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                )}
                <div>
                  <p className="text-base text-abu">{formatTanggalPanjang(r.tanggal)}</p>
                  <p className="mt-0.5 text-xl font-medium text-tinta">
                    {r.judul || r.referensiAyat || "(tanpa judul)"}
                  </p>
                  <p
                    className={`mt-1 inline-block rounded-md px-2.5 py-0.5 text-base font-medium ${
                      r.status === "published"
                        ? "bg-emas-muda text-emas-tua"
                        : "bg-krem-tua text-abu"
                    }`}
                  >
                    {r.status === "published" ? "Tayang" : "Draft"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <Link
                  href={`/admin/editor?tanggal=${r.tanggal}`}
                  className="font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
                >
                  Ubah
                </Link>
                <button
                  type="button"
                  onClick={() => hapus(r)}
                  className="font-medium text-merah underline decoration-2 underline-offset-4 hover:text-tinta"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HalamanAdmin() {
  return <GerbangPengurus>{() => <DaftarRenungan />}</GerbangPengurus>;
}
