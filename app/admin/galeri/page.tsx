"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GerbangPengurus,
  kelasInput,
  kelasTombolUtama,
} from "@/components/admin/gerbang-pengurus";
import { cloudinarySiap, unggahFotoKeCloudinary } from "@/lib/cloudinary";
import { getDb } from "@/lib/firebase";
import {
  formatTanggalPanjang,
  POLA_TANGGAL,
  tanggalHariIni,
} from "@/lib/renungan";
import type { FotoGaleri, StatusGaleri } from "@/lib/galeri";

function KelolaGaleri() {
  const [daftar, setDaftar] = useState<FotoGaleri[] | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tanggal, setTanggal] = useState(tanggalHariIni());
  const [tayang, setTayang] = useState(true);
  const [berkas, setBerkas] = useState<File[]>([]);
  const [pratinjau, setPratinjau] = useState<string[]>([]);
  const [mengunggah, setMengunggah] = useState(false);
  const [progres, setProgres] = useState("");
  const inputBerkas = useRef<HTMLInputElement>(null);
  const [itemDiubah, setItemDiubah] = useState<FotoGaleri | null>(null);

  const muatDaftar = useCallback(() => {
    getDocs(collection(getDb(), "galeri"))
      .then((snap) => {
        setDaftar(
          snap.docs
            .map((d) => {
              const data = d.data();
              const urlTunggal = (data.url as string) ?? "";
              const fotoUrls =
                Array.isArray(data.fotoUrls) && data.fotoUrls.length > 0
                  ? (data.fotoUrls as string[])
                  : urlTunggal
                    ? [urlTunggal]
                    : [];
              return {
                id: d.id,
                url: urlTunggal || fotoUrls[0] || "",
                fotoUrls,
                caption: (data.caption as string) ?? "",
                tanggal: (data.tanggal as string) ?? "",
                status: (data.status as FotoGaleri["status"]) ?? "published",
              };
            })
            .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
        );
      })
      .catch(() => {
        setGalat(
          "Daftar foto tidak bisa dimuat. Periksa koneksi internet, lalu muat ulang halaman."
        );
      });
  }, []);

  useEffect(() => {
    muatDaftar();
  }, [muatDaftar]);

  function pilihBerkas(daftar: FileList | null) {
    const dipilih: File[] = daftar
      ? Array.from(daftar).filter((f) => f.type.startsWith("image/"))
      : [];
    setBerkas(dipilih);
    setPratinjau(dipilih.map((f) => URL.createObjectURL(f)));
  }

  // Buang object URL pratinjau saat pilihan berganti atau komponen dilepas.
  useEffect(() => {
    return () => pratinjau.forEach((u) => URL.revokeObjectURL(u));
  }, [pratinjau]);

  async function unggah(e: React.FormEvent) {
    e.preventDefault();
    setGalat(null);
    if (berkas.length === 0) {
      setGalat("Pilih minimal satu foto terlebih dahulu.");
      return;
    }
    if (!POLA_TANGGAL.test(tanggal)) {
      setGalat("Tanggal kegiatan belum diisi dengan benar.");
      return;
    }
    setMengunggah(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < berkas.length; i += 1) {
        setProgres(`Mengunggah foto ${i + 1} dari ${berkas.length}…`);
        urls.push(await unggahFotoKeCloudinary(berkas[i]));
      }
      await addDoc(collection(getDb(), "galeri"), {
        url: urls[0],
        fotoUrls: urls,
        caption: caption.trim(),
        tanggal,
        status: tayang ? "published" : "draft",
        dibuatPada: serverTimestamp(),
      });
      setCaption("");
      setTanggal(tanggalHariIni());
      setTayang(true);
      setBerkas([]);
      setPratinjau([]);
      if (inputBerkas.current) inputBerkas.current.value = "";
      muatDaftar();
    } catch (err) {
      setGalat(
        err instanceof Error
          ? err.message
          : "Foto gagal diunggah. Periksa koneksi internet, lalu coba lagi."
      );
    } finally {
      setMengunggah(false);
      setProgres("");
    }
  }

  async function hapus(foto: FotoGaleri) {
    const yakin = window.confirm(
      `Hapus item galeri${foto.caption ? ` "${foto.caption}"` : " ini"} (${foto.fotoUrls.length} foto) dari galeri?\nTindakan ini tidak bisa dibatalkan.`
    );
    if (!yakin) return;
    try {
      await deleteDoc(doc(getDb(), "galeri", foto.id));
      muatDaftar();
    } catch {
      setGalat("Foto gagal dihapus. Coba lagi.");
    }
  }

  const tutupUbah = useCallback(() => setItemDiubah(null), []);
  const selesaiUbah = useCallback(() => {
    setItemDiubah(null);
    muatDaftar();
  }, [muatDaftar]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-tinta">Galeri Kegiatan</h1>
        <Link
          href="/admin"
          className="text-base font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
        >
          <span aria-hidden="true">&larr;</span> Kembali ke renungan
        </Link>
      </div>

      {!cloudinarySiap() && (
        <p role="alert" className="mt-6 rounded-lg bg-merah-muda px-4 py-3 text-merah">
          Cloudinary belum dikonfigurasi. Isi{" "}
          <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> di <code>.env</code>{" "}
          agar foto bisa diunggah.
        </p>
      )}

      {/* Formulir unggah */}
      <form onSubmit={unggah} className="mt-8 space-y-6 rounded-xl bg-krem px-6 py-8">
        <h2 className="font-display text-2xl text-tinta">Unggah Foto Baru</h2>

        <div>
          <label htmlFor="foto" className="mb-2 block text-lg font-medium text-tinta">
            Pilih foto{" "}
            <span className="font-normal text-abu">(bisa lebih dari satu)</span>
          </label>
          <input
            id="foto"
            type="file"
            accept="image/*"
            multiple
            required
            ref={inputBerkas}
            onChange={(e) => pilihBerkas(e.target.files)}
            className={`${kelasInput} file:mr-4 file:rounded-md file:border-0 file:bg-emas-muda file:px-4 file:py-2 file:font-medium file:text-emas-tua`}
          />
          {pratinjau.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-base text-abu">
                {berkas.length} foto dipilih, foto pertama menjadi sampul.
              </p>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {pratinjau.map((src, i) => (
                  <li
                    key={src}
                    className="relative aspect-square overflow-hidden rounded-lg border border-krem-tua bg-krem"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau lokal sementara (blob), bukan konten situs */}
                    <img
                      src={src}
                      alt={`Pratinjau foto ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-tinta/70 px-1.5 py-0.5 text-xs font-medium text-putih">
                        Sampul
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="caption" className="mb-2 block text-lg font-medium text-tinta">
            Keterangan <span className="font-normal text-abu">(caption)</span>
          </label>
          <textarea
            id="caption"
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Contoh: Doa Koronka bersama di Gereja Santo Agustinus, April 2026"
            className={kelasInput}
          />
        </div>

        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label htmlFor="tanggal-foto" className="mb-2 block text-lg font-medium text-tinta">
              Tanggal kegiatan
            </label>
            <input
              id="tanggal-foto"
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={`${kelasInput} max-w-xs`}
            />
          </div>
          <label className="flex min-h-13 cursor-pointer items-center gap-3 text-lg font-medium text-tinta">
            <input
              type="checkbox"
              checked={tayang}
              onChange={(e) => setTayang(e.target.checked)}
              className="h-6 w-6 accent-emas-tua"
            />
            Tayangkan segera
          </label>
        </div>

        {galat && (
          <p role="alert" className="rounded-lg bg-merah-muda px-4 py-3 text-merah">
            {galat}
          </p>
        )}

        <button type="submit" disabled={mengunggah || !cloudinarySiap()} className={kelasTombolUtama}>
          {mengunggah ? progres || "Mengunggah…" : "Unggah Foto"}
        </button>
        <p className="text-base text-abu">
          Semua foto yang dipilih disimpan sebagai satu item di Cloudinary,
          keterangannya di Firestore. Hilangkan centang &ldquo;Tayangkan&rdquo;
          untuk menyimpan sebagai draft.
        </p>
      </form>

      {/* Daftar foto */}
      <h2 className="mt-12 font-display text-2xl text-tinta">
        Foto yang Sudah Ada
      </h2>

      {daftar === null ? (
        <p className="mt-6 text-abu">Memuat daftar foto&hellip;</p>
      ) : daftar.length === 0 ? (
        <div className="mt-6 rounded-xl bg-krem px-6 py-10 text-center text-tinta-muda">
          <p>Belum ada foto di galeri.</p>
          <p className="mt-2">Unggah foto pertama lewat formulir di atas.</p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {daftar.map((f) => (
            <li
              key={f.id}
              className="flex gap-4 rounded-xl border border-krem-tua bg-putih p-4"
            >
              <span className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-krem-tua">
                <Image
                  src={f.url}
                  alt={f.caption || "Foto galeri"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-medium text-tinta">
                  {f.caption || "(tanpa keterangan)"}
                </p>
                {f.tanggal && (
                  <p className="text-base text-abu">
                    {POLA_TANGGAL.test(f.tanggal)
                      ? formatTanggalPanjang(f.tanggal)
                      : f.tanggal}
                    {f.fotoUrls.length > 1 && (
                      <> &middot; {f.fotoUrls.length} foto</>
                    )}
                  </p>
                )}
                <p
                  className={`mt-1 inline-block rounded-md px-2.5 py-0.5 text-base font-medium ${
                    f.status === "published"
                      ? "bg-emas-muda text-emas-tua"
                      : "bg-krem-tua text-abu"
                  }`}
                >
                  {f.status === "published" ? "Tayang" : "Draft"}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <button
                    type="button"
                    onClick={() => setItemDiubah(f)}
                    className="font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
                  >
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => hapus(f)}
                    className="font-medium text-merah underline decoration-2 underline-offset-4 hover:text-tinta"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {itemDiubah && (
        <FormUbahGaleri
          key={itemDiubah.id}
          item={itemDiubah}
          onSelesai={selesaiUbah}
          onBatal={tutupUbah}
        />
      )}
    </div>
  );
}

export default function HalamanAdminGaleri() {
  return <GerbangPengurus>{() => <KelolaGaleri />}</GerbangPengurus>;
}

/**
 * Modal untuk mengubah item galeri yang sudah ada: mengubah keterangan,
 * tanggal, dan status tayang; menambah foto baru; menghapus foto; serta
 * memilih foto sampul. Foto baru diunggah ke Cloudinary saat disimpan.
 */
function FormUbahGaleri({
  item,
  onSelesai,
  onBatal,
}: {
  item: FotoGaleri;
  onSelesai: () => void;
  onBatal: () => void;
}) {
  const [caption, setCaption] = useState(item.caption);
  const [tanggal, setTanggal] = useState(item.tanggal);
  const [status, setStatus] = useState<StatusGaleri>(item.status);
  const [fotoUrls, setFotoUrls] = useState<string[]>(item.fotoUrls);
  const [berkasBaru, setBerkasBaru] = useState<File[]>([]);
  const [pratinjauBaru, setPratinjauBaru] = useState<string[]>([]);
  const [menyimpan, setMenyimpan] = useState(false);
  const [progres, setProgres] = useState("");
  const [galat, setGalat] = useState("");
  const inputBaru = useRef<HTMLInputElement>(null);
  const pratinjauBaruRef = useRef<string[]>([]);

  // Catat pratinjau terbaru, lalu bersihkan object URL saat komponen dilepas.
  useEffect(() => {
    pratinjauBaruRef.current = pratinjauBaru;
  }, [pratinjauBaru]);
  useEffect(() => {
    return () => pratinjauBaruRef.current.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  // Kunci gulir halaman; tombol Esc menutup modal.
  useEffect(() => {
    function tekanTombol(e: KeyboardEvent) {
      if (e.key === "Escape") onBatal();
    }
    window.addEventListener("keydown", tekanTombol);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tekanTombol);
      document.body.style.overflow = "";
    };
  }, [onBatal]);

  function tambahBerkas(daftar: FileList | null) {
    const dipilih: File[] = daftar
      ? Array.from(daftar).filter((f) => f.type.startsWith("image/"))
      : [];
    if (dipilih.length === 0) return;
    setBerkasBaru((prev) => [...prev, ...dipilih]);
    setPratinjauBaru((prev) => [
      ...prev,
      ...dipilih.map((f) => URL.createObjectURL(f)),
    ]);
    if (inputBaru.current) inputBaru.current.value = "";
  }

  function hapusBerkasBaru(i: number) {
    URL.revokeObjectURL(pratinjauBaru[i]);
    setBerkasBaru((prev) => prev.filter((_, idx) => idx !== i));
    setPratinjauBaru((prev) => prev.filter((_, idx) => idx !== i));
  }

  function hapusFoto(i: number) {
    setFotoUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  function jadikanSampul(i: number) {
    setFotoUrls((prev) => {
      const dipilih = prev[i];
      const sisanya = prev.filter((_, idx) => idx !== i);
      return [dipilih, ...sisanya];
    });
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setGalat("");
    if (fotoUrls.length === 0 && berkasBaru.length === 0) {
      setGalat("Item harus memiliki minimal satu foto.");
      return;
    }
    if (!POLA_TANGGAL.test(tanggal)) {
      setGalat("Tanggal kegiatan belum diisi dengan benar.");
      return;
    }
    setMenyimpan(true);
    try {
      const urlBaru: string[] = [];
      for (let i = 0; i < berkasBaru.length; i += 1) {
        setProgres(`Mengunggah foto ${i + 1} dari ${berkasBaru.length}…`);
        urlBaru.push(await unggahFotoKeCloudinary(berkasBaru[i]));
      }
      const semuaUrl = [...fotoUrls, ...urlBaru];
      await updateDoc(doc(getDb(), "galeri", item.id), {
        url: semuaUrl[0],
        fotoUrls: semuaUrl,
        caption: caption.trim(),
        tanggal,
        status,
      });
      onSelesai();
    } catch (err) {
      setGalat(
        err instanceof Error
          ? err.message
          : "Perubahan gagal disimpan. Periksa koneksi internet, lalu coba lagi."
      );
    } finally {
      setMenyimpan(false);
      setProgres("");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ubah item galeri"
      className="fixed inset-0 z-[80] overflow-y-auto bg-tinta/70 p-4 sm:p-8"
      onClick={onBatal}
    >
      <form
        onSubmit={simpan}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto my-4 w-full max-w-2xl space-y-6 rounded-2xl bg-putih p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-tinta">Ubah Item Galeri</h2>
          <button
            type="button"
            onClick={onBatal}
            aria-label="Tutup"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-krem text-2xl text-tinta hover:bg-krem-tua"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div>
          <p className="mb-2 text-lg font-medium text-tinta">
            Foto saat ini{" "}
            <span className="font-normal text-abu">({fotoUrls.length})</span>
          </p>
          {fotoUrls.length === 0 ? (
            <p className="rounded-lg bg-krem px-4 py-3 text-base text-abu">
              Semua foto dihapus. Tambahkan foto baru di bawah agar item tetap
              valid.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {fotoUrls.map((src, i) => (
                <li
                  key={src}
                  className="overflow-hidden rounded-lg border border-krem-tua bg-krem"
                >
                  <span className="relative block aspect-square">
                    <Image
                      src={src}
                      alt={`Foto galeri ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </span>
                  <div className="flex items-center justify-between gap-1 px-1.5 py-1">
                    {i === 0 ? (
                      <span className="text-xs font-medium text-emas-tua">
                        Sampul
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => jadikanSampul(i)}
                        className="text-xs font-medium text-emas-tua underline underline-offset-2 hover:text-tinta"
                      >
                        Jadikan sampul
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => hapusFoto(i)}
                      className="text-xs font-medium text-merah underline underline-offset-2 hover:text-tinta"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label
            htmlFor="foto-baru"
            className="mb-2 block text-lg font-medium text-tinta"
          >
            Tambah foto baru
          </label>
          <input
            id="foto-baru"
            type="file"
            accept="image/*"
            multiple
            ref={inputBaru}
            onChange={(e) => tambahBerkas(e.target.files)}
            disabled={!cloudinarySiap()}
            className={`${kelasInput} file:mr-4 file:rounded-md file:border-0 file:bg-emas-muda file:px-4 file:py-2 file:font-medium file:text-emas-tua`}
          />
          {pratinjauBaru.length > 0 && (
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {pratinjauBaru.map((src, i) => (
                <li
                  key={src}
                  className="overflow-hidden rounded-lg border border-krem-tua bg-krem"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau lokal sementara (blob), bukan konten situs */}
                  <img
                    src={src}
                    alt={`Foto baru ${i + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="px-1.5 py-1">
                    <button
                      type="button"
                      onClick={() => hapusBerkasBaru(i)}
                      className="text-xs font-medium text-merah underline underline-offset-2 hover:text-tinta"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label
            htmlFor="caption-ubah"
            className="mb-2 block text-lg font-medium text-tinta"
          >
            Keterangan <span className="font-normal text-abu">(caption)</span>
          </label>
          <textarea
            id="caption-ubah"
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className={kelasInput}
          />
        </div>

        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label
              htmlFor="tanggal-ubah"
              className="mb-2 block text-lg font-medium text-tinta"
            >
              Tanggal kegiatan
            </label>
            <input
              id="tanggal-ubah"
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className={`${kelasInput} max-w-xs`}
            />
          </div>
          <label className="flex min-h-13 cursor-pointer items-center gap-3 text-lg font-medium text-tinta">
            <input
              type="checkbox"
              checked={status === "published"}
              onChange={(e) =>
                setStatus(e.target.checked ? "published" : "draft")
              }
              className="h-6 w-6 accent-emas-tua"
            />
            Tayangkan
          </label>
        </div>

        {galat && (
          <p role="alert" className="rounded-lg bg-merah-muda px-4 py-3 text-merah">
            {galat}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={menyimpan}
            className={kelasTombolUtama}
          >
            {menyimpan ? progres || "Menyimpan…" : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={onBatal}
            disabled={menyimpan}
            className="rounded-lg bg-krem px-6 py-3 text-lg font-medium text-tinta hover:bg-krem-tua"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
