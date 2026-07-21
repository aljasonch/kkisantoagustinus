"use client";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { firebaseSiap, getAuthClient } from "@/lib/firebase";
import { ambilProfil, simpanNamaProfil, type Pengguna } from "@/lib/pengguna";

export const kelasInput =
  "w-full rounded-lg border-2 border-krem-tua bg-putih px-4 py-3 text-lg text-tinta focus:border-emas-tua focus:outline-none";

export const kelasTombolUtama =
  "inline-flex min-h-13 items-center justify-center rounded-lg bg-emas-tua px-8 py-3 text-lg font-medium text-putih hover:bg-tinta disabled:opacity-50";

function pesanGalatMasuk(kode: string): string {
  switch (kode) {
    case "auth/invalid-email":
      return "Alamat email tidak valid. Periksa kembali penulisannya.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email atau kata sandi salah. Silakan coba lagi.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi.";
    default:
      return "Tidak bisa masuk saat ini. Periksa koneksi internet, lalu coba lagi.";
  }
}

/**
 * Gerbang halaman pengurus: menampilkan formulir masuk bila belum login,
 * dan meneruskan ke isi halaman bila sudah. UI dibuat besar & sederhana
 * karena penggunanya non-teknis.
 */
export function GerbangPengurus({
  children,
}: {
  children: (user: User, profil: Pengguna) => React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [memuat, setMemuat] = useState(() => firebaseSiap());
  const [email, setEmail] = useState("");
  const [sandi, setSandi] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [sedangMasuk, setSedangMasuk] = useState(false);
  const [profil, setProfil] = useState<Pengguna | null>(null);
  const [memuatProfil, setMemuatProfil] = useState(false);
  const [namaBaru, setNamaBaru] = useState("");
  const [menyimpanProfil, setMenyimpanProfil] = useState(false);
  const [galatProfil, setGalatProfil] = useState<string | null>(null);

  // Dengarkan perubahan login; begitu user masuk, muat profilnya
  // (nama tampilan & peran). Semua setState dipanggil di dalam callback
  // langganan auth, bukan langsung di badan effect.
  useEffect(() => {
    if (!firebaseSiap()) return;
    return onAuthStateChanged(getAuthClient(), (u) => {
      setUser(u);
      setMemuat(false);
      if (!u) {
        setProfil(null);
        setMemuatProfil(false);
        return;
      }
      setMemuatProfil(true);
      ambilProfil(u.uid)
        .then((p) => setProfil(p))
        .finally(() => setMemuatProfil(false));
    });
  }, []);

  if (!firebaseSiap()) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20">
        <h1 className="font-display text-4xl text-tinta">Halaman Pengurus</h1>
        <p className="mt-4 text-tinta-muda">
          Firebase belum dikonfigurasi. Isi kredensial Firebase di{" "}
          <code>.env</code>, lihat panduan di{" "}
          <code>docs/setup-firebase.md</code>.
        </p>
      </div>
    );
  }

  if (memuat) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center text-abu">
        Memuat&hellip;
      </div>
    );
  }

  if (!user) {
    async function masuk(e: React.FormEvent) {
      e.preventDefault();
      setGalat(null);
      setSedangMasuk(true);
      try {
        await signInWithEmailAndPassword(getAuthClient(), email.trim(), sandi);
      } catch (err) {
        const kode =
          err && typeof err === "object" && "code" in err ? String(err.code) : "";
        setGalat(pesanGalatMasuk(kode));
      } finally {
        setSedangMasuk(false);
      }
    }

    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="font-display text-4xl text-tinta">Masuk Pengurus</h1>
        <p className="mt-3 text-tinta-muda">
          Halaman ini khusus pengurus komunitas untuk mengelola renungan harian.
        </p>
        <form onSubmit={masuk} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-lg font-medium text-tinta">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={kelasInput}
            />
          </div>
          <div>
            <label htmlFor="sandi" className="mb-2 block text-lg font-medium text-tinta">
              Kata sandi
            </label>
            <input
              id="sandi"
              type="password"
              autoComplete="current-password"
              required
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              className={kelasInput}
            />
          </div>
          {galat && (
            <p role="alert" className="rounded-lg bg-merah-muda px-4 py-3 text-merah">
              {galat}
            </p>
          )}
          <button type="submit" disabled={sedangMasuk} className={kelasTombolUtama}>
            {sedangMasuk ? "Sedang masuk…" : "Masuk"}
          </button>
        </form>
      </div>
    );
  }

  if (memuatProfil) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center text-abu">
        Memuat profil&hellip;
      </div>
    );
  }

  // Pertama kali login tanpa profil: wajib isi nama tampilan dulu.
  if (!profil) {
    const userAktif = user;
    async function aturNama(e: React.FormEvent) {
      e.preventDefault();
      if (!namaBaru.trim()) {
        setGalatProfil("Nama tampilan wajib diisi.");
        return;
      }
      setGalatProfil(null);
      setMenyimpanProfil(true);
      try {
        await simpanNamaProfil(userAktif.uid, userAktif.email ?? "", namaBaru, "user");
        setProfil({
          uid: userAktif.uid,
          email: userAktif.email ?? "",
          nama: namaBaru.trim(),
          role: "user",
        });
      } catch {
        setGalatProfil(
          "Nama gagal disimpan. Periksa koneksi internet, lalu coba lagi."
        );
        setMenyimpanProfil(false);
      }
    }

    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="font-display text-4xl text-tinta">Selamat datang</h1>
        <p className="mt-3 text-tinta-muda">
          Sebelum mulai, isi nama tampilan Anda. Nama ini akan tampil sebagai
          penulis renungan yang Anda susun.
        </p>
        <form onSubmit={aturNama} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="nama-tampilan"
              className="mb-2 block text-lg font-medium text-tinta"
            >
              Nama tampilan
            </label>
            <input
              id="nama-tampilan"
              type="text"
              required
              value={namaBaru}
              onChange={(e) => setNamaBaru(e.target.value)}
              placeholder="Contoh: Brigitta Dwiyana Taurisia"
              className={kelasInput}
            />
          </div>
          {galatProfil && (
            <p role="alert" className="rounded-lg bg-merah-muda px-4 py-3 text-merah">
              {galatProfil}
            </p>
          )}
          <button type="submit" disabled={menyimpanProfil} className={kelasTombolUtama}>
            {menyimpanProfil ? "Menyimpan…" : "Simpan & Lanjutkan"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-krem-tua pb-4">
        <p className="text-base text-abu">
          Masuk sebagai{" "}
          <span className="font-medium text-tinta">{profil.nama || user.email}</span>{" "}
          <span
            className={`ml-1 rounded-md px-2 py-0.5 text-sm font-medium ${
              profil.role === "admin"
                ? "bg-emas-muda text-emas-tua"
                : "bg-krem-tua text-abu"
            }`}
          >
            {profil.role === "admin" ? "Admin" : "User"}
          </span>
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="/admin/akun"
            className="text-base font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
          >
            Kelola Akun
          </Link>
          <Link
            href="/"
            className="text-base font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
          >
            Lihat situs
          </Link>
          <button
            type="button"
            onClick={() => signOut(getAuthClient())}
            className="text-base font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
          >
            Keluar
          </button>
        </div>
      </div>
      {children(user, profil)}
    </div>
  );
}
