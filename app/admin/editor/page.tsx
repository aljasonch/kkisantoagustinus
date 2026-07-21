"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  GerbangPengurus,
  kelasInput,
  kelasTombolUtama,
} from "@/components/admin/gerbang-pengurus";
import { unggahFotoKeCloudinary } from "@/lib/cloudinary";
import { getDb } from "@/lib/firebase";
import {
  POLA_TANGGAL,
  tanggalHariIni,
  type StatusRenungan,
} from "@/lib/renungan";

function EditorRenungan() {
  const router = useRouter();
  const paramTanggal = useSearchParams().get("tanggal");
  const sedangMengubah = Boolean(paramTanggal && POLA_TANGGAL.test(paramTanggal));

  const [tanggal, setTanggal] = useState(paramTanggal ?? tanggalHariIni());
  const [judul, setJudul] = useState("");
  const [ayat, setAyat] = useState("");
  const [referensiAyat, setReferensiAyat] = useState("");
  const [kutipanFaustina, setKutipanFaustina] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");
  const [berkasGambar, setBerkasGambar] = useState<File | null>(null);
  const [pratinjauGambar, setPratinjauGambar] = useState<string | null>(null);
  const [isiRenungan, setIsiRenungan] = useState("");
  const [doaPenutup, setDoaPenutup] = useState("");
  const [memuat, setMemuat] = useState(sedangMengubah);
  const [menyimpan, setMenyimpan] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  useEffect(() => {
    if (!sedangMengubah || !paramTanggal) return;
    getDoc(doc(getDb(), "renungan", paramTanggal))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setJudul(data.judul ?? "");
          setAyat(data.ayat ?? "");
          setReferensiAyat(data.referensiAyat ?? "");
          setKutipanFaustina(data.kutipanFaustina ?? "");
          setGambarUrl(data.gambarUrl ?? "");
          setIsiRenungan(data.isiRenungan ?? "");
          setDoaPenutup(data.doaPenutup ?? "");
        }
      })
      .catch(() => setGalat("Renungan tidak bisa dimuat. Muat ulang halaman untuk mencoba lagi."))
      .finally(() => setMemuat(false));
  }, [sedangMengubah, paramTanggal]);

  function pilihGambar(b: File | null) {
    setBerkasGambar(b);
    if (pratinjauGambar) URL.revokeObjectURL(pratinjauGambar);
    setPratinjauGambar(b ? URL.createObjectURL(b) : null);
  }

  function hapusGambar() {
    pilihGambar(null);
    setGambarUrl("");
  }

  async function simpan(status: StatusRenungan) {
    setGalat(null);
    if (!POLA_TANGGAL.test(tanggal)) {
      setGalat("Tanggal belum diisi dengan benar.");
      return;
    }
    if (!isiRenungan.trim()) {
      setGalat("Isi renungan wajib diisi.");
      return;
    }
    setMenyimpan(true);
    try {
      let urlGambar = gambarUrl;
      if (berkasGambar) {
        urlGambar = await unggahFotoKeCloudinary(
          berkasGambar,
          "kki-karawaci/renungan"
        );
      }
      const acuan = doc(getDb(), "renungan", tanggal);
      const sudahAda = sedangMengubah || (await getDoc(acuan)).exists();
      await setDoc(
        acuan,
        {
          tanggal,
          judul: judul.trim(),
          ayat: ayat.trim(),
          referensiAyat: referensiAyat.trim(),
          gambarUrl: urlGambar,
          kutipanFaustina: kutipanFaustina.trim(),
          isiRenungan: isiRenungan.trim(),
          doaPenutup: doaPenutup.trim(),
          status,
          diperbaruiPada: serverTimestamp(),
          ...(sudahAda ? {} : { dibuatPada: serverTimestamp() }),
        },
        { merge: true }
      );
      router.push("/admin");
    } catch {
      setGalat("Renungan gagal disimpan. Periksa koneksi internet, lalu coba lagi.");
      setMenyimpan(false);
    }
  }

  if (memuat) {
    return <p className="text-abu">Memuat renungan&hellip;</p>;
  }

  return (
    <div>
      <p>
        <Link
          href="/admin"
          className="font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
        >
          <span aria-hidden="true">&larr;</span> Kembali ke daftar
        </Link>
      </p>
      <h1 className="mt-4 font-display text-4xl text-tinta">
        {sedangMengubah ? "Ubah Renungan" : "Tulis Renungan Baru"}
      </h1>

      <form
        className="mt-8 space-y-7"
        onSubmit={(e) => {
          e.preventDefault();
          simpan("published");
        }}
      >
        <div>
          <label htmlFor="tanggal" className="mb-2 block text-lg font-medium text-tinta">
            Tanggal renungan
          </label>
          <input
            id="tanggal"
            type="date"
            required
            value={tanggal}
            disabled={sedangMengubah}
            onChange={(e) => setTanggal(e.target.value)}
            className={`${kelasInput} max-w-xs disabled:bg-krem disabled:text-abu`}
          />
          {sedangMengubah && (
            <p className="mt-2 text-base text-abu">
              Tanggal tidak bisa diubah. Untuk memindah tanggal, hapus renungan
              ini lalu buat yang baru.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="judul" className="mb-2 block text-lg font-medium text-tinta">
            Judul <span className="font-normal text-abu">(boleh dikosongkan)</span>
          </label>
          <input
            id="judul"
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Percaya di Tengah Badai"
            className={kelasInput}
          />
        </div>

        <div>
          <label htmlFor="ayat" className="mb-2 block text-lg font-medium text-tinta">
            Ayat hari ini <span className="font-normal text-abu">(boleh dikosongkan)</span>
          </label>
          <textarea
            id="ayat"
            rows={3}
            value={ayat}
            onChange={(e) => setAyat(e.target.value)}
            placeholder="Tulis kutipan ayat Kitab Suci di sini"
            className={kelasInput}
          />
        </div>

        <div>
          <label htmlFor="referensi" className="mb-2 block text-lg font-medium text-tinta">
            Referensi ayat <span className="font-normal text-abu">(boleh dikosongkan)</span>
          </label>
          <input
            id="referensi"
            type="text"
            value={referensiAyat}
            onChange={(e) => setReferensiAyat(e.target.value)}
            placeholder="Contoh: Yohanes 3:16"
            className={`${kelasInput} max-w-sm`}
          />
        </div>

        <div>
          <label htmlFor="gambar" className="mb-2 block text-lg font-medium text-tinta">
            Gambar renungan <span className="font-normal text-abu">(boleh dikosongkan)</span>
          </label>
          {(pratinjauGambar || gambarUrl) && (
            <div className="mb-4 flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau lokal (blob) atau URL Cloudinary sederhana */}
              <img
                src={pratinjauGambar ?? gambarUrl}
                alt="Pratinjau gambar renungan"
                className="h-36 w-36 rounded-lg border border-krem-tua bg-krem object-cover"
              />
              <button
                type="button"
                onClick={hapusGambar}
                className="font-medium text-merah underline decoration-2 underline-offset-4 hover:text-tinta"
              >
                Hapus gambar
              </button>
            </div>
          )}
          <input
            id="gambar"
            type="file"
            accept="image/*"
            onChange={(e) => pilihGambar(e.target.files?.[0] ?? null)}
            className={`${kelasInput} file:mr-4 file:rounded-md file:border-0 file:bg-emas-muda file:px-4 file:py-2 file:font-medium file:text-emas-tua`}
          />
          <p className="mt-2 text-base text-abu">
            Foto akan ditampilkan di halaman renungan dan di Beranda. Pilih
            foto baru untuk mengganti gambar yang lama.
          </p>
        </div>

        <div>
          <label htmlFor="kutipan" className="mb-2 block text-lg font-medium text-tinta">
            Kutipan Buku Harian Santa Faustina{" "}
            <span className="font-normal text-abu">(boleh dikosongkan)</span>
          </label>
          <textarea
            id="kutipan"
            rows={3}
            value={kutipanFaustina}
            onChange={(e) => setKutipanFaustina(e.target.value)}
            placeholder="Contoh: Hendaklah tiada satu jiwa pun takut mendekati Aku, sekalipun dosa-dosanya merah seperti kirmizi. (Buku Harian, no. 699)"
            className={kelasInput}
          />
          <p className="mt-2 text-base text-abu">
            Tulis kutipannya saja tanpa tanda kutip. Kutipan akan tampil
            menonjol di halaman renungan dengan label &ldquo;Buku Harian Santa
            Faustina&rdquo;.
          </p>
        </div>

        <div>
          <label htmlFor="isi" className="mb-2 block text-lg font-medium text-tinta">
            Isi renungan
          </label>
          <textarea
            id="isi"
            required
            rows={12}
            value={isiRenungan}
            onChange={(e) => setIsiRenungan(e.target.value)}
            placeholder="Tulis 2–3 paragraf refleksi. Pisahkan antar paragraf dengan satu baris kosong."
            className={kelasInput}
          />
          <p className="mt-2 text-base text-abu">
            Pisahkan antar paragraf dengan satu baris kosong (tekan Enter dua kali).
          </p>
        </div>

        <div>
          <label htmlFor="doa" className="mb-2 block text-lg font-medium text-tinta">
            Doa penutup <span className="font-normal text-abu">(boleh dikosongkan)</span>
          </label>
          <textarea
            id="doa"
            rows={4}
            value={doaPenutup}
            onChange={(e) => setDoaPenutup(e.target.value)}
            placeholder="Doa singkat penutup renungan. Kata “Amin” akan ditambahkan otomatis."
            className={kelasInput}
          />
        </div>

        {galat && (
          <p role="alert" className="rounded-lg bg-merah-muda px-4 py-3 text-merah">
            {galat}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 border-t border-krem-tua pt-7">
          <button type="submit" disabled={menyimpan} className={kelasTombolUtama}>
            {menyimpan ? "Menyimpan…" : "Terbitkan"}
          </button>
          <button
            type="button"
            disabled={menyimpan}
            onClick={() => simpan("draft")}
            className="inline-flex min-h-13 items-center justify-center rounded-lg border-2 border-emas-tua px-8 py-3 text-lg font-medium text-emas-tua hover:bg-krem disabled:opacity-50"
          >
            Simpan sebagai Draft
          </button>
        </div>
        <p className="text-base text-abu">
          <strong className="font-medium">Terbitkan</strong> = langsung tayang di
          situs pada tanggalnya. <strong className="font-medium">Draft</strong> =
          tersimpan tapi belum tayang, bisa diterbitkan nanti.
        </p>
      </form>
    </div>
  );
}

export default function HalamanEditor() {
  return (
    <GerbangPengurus>
      {() => (
        <Suspense fallback={<p className="text-abu">Memuat&hellip;</p>}>
          <EditorRenungan />
        </Suspense>
      )}
    </GerbangPengurus>
  );
}
