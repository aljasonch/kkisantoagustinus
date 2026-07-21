"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  GerbangPengurus,
  kelasInput,
  kelasTombolUtama,
} from "@/components/admin/gerbang-pengurus";
import {
  ambilSemuaPengguna,
  daftarAkunBaru,
  pesanGalatAkun,
  simpanNamaProfil,
  ubahPeran,
  type Peran,
  type Pengguna,
} from "@/lib/pengguna";

function lencanaPeran(role: Peran) {
  return role === "admin"
    ? "bg-emas-muda text-emas-tua"
    : "bg-krem-tua text-abu";
}

/** Bagian semua pengguna: ubah nama tampilan sendiri (penulis renungan). */
function ProfilSaya({ profil }: { profil: Pengguna }) {
  const [nama, setNama] = useState(profil.nama);
  const [menyimpan, setMenyimpan] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [sukses, setSukses] = useState(false);

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) {
      setGalat("Nama tampilan wajib diisi.");
      setSukses(false);
      return;
    }
    setGalat(null);
    setSukses(false);
    setMenyimpan(true);
    try {
      await simpanNamaProfil(profil.uid, profil.email, nama, profil.role);
      setSukses(true);
    } catch {
      setGalat("Nama gagal disimpan. Periksa koneksi internet, lalu coba lagi.");
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <section aria-labelledby="judul-profil" className="mt-8 rounded-xl bg-krem px-6 py-8">
      <h2 id="judul-profil" className="font-display text-2xl text-tinta">
        Profil Saya
      </h2>
      <p className="mt-2 text-tinta-muda">
        Nama tampilan ini akan dicantumkan sebagai penulis renungan yang Anda
        susun. Peran Anda:{" "}
        <span className={`rounded-md px-2 py-0.5 text-base font-medium ${lencanaPeran(profil.role)}`}>
          {profil.role === "admin" ? "Admin" : "User"}
        </span>
      </p>
      <form onSubmit={simpan} className="mt-6 space-y-5">
        <div>
          <label htmlFor="nama-saya" className="mb-2 block text-lg font-medium text-tinta">
            Nama tampilan
          </label>
          <input
            id="nama-saya"
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className={`${kelasInput} max-w-md`}
          />
          <p className="mt-2 text-base text-abu">Email: {profil.email}</p>
        </div>
        {galat && (
          <p role="alert" className="rounded-lg bg-merah-muda px-4 py-3 text-merah">
            {galat}
          </p>
        )}
        {sukses && (
          <p role="status" className="rounded-lg bg-emas-muda px-4 py-3 text-emas-tua">
            Nama tampilan berhasil disimpan.
          </p>
        )}
        <button type="submit" disabled={menyimpan} className={kelasTombolUtama}>
          {menyimpan ? "Menyimpan…" : "Simpan Nama"}
        </button>
      </form>
    </section>
  );
}

/** Bagian khusus admin: daftar akun, ubah peran, dan tambah akun baru. */
function KelolaPengguna({ profilSaya }: { profilSaya: Pengguna }) {
  const [daftar, setDaftar] = useState<Pengguna[] | null>(null);
  const [galat, setGalat] = useState<string | null>(null);

  const [emailBaru, setEmailBaru] = useState("");
  const [sandiBaru, setSandiBaru] = useState("");
  const [namaBaru, setNamaBaru] = useState("");
  const [peranBaru, setPeranBaru] = useState<Peran>("user");
  const [sedangMendaftar, setSedangMendaftar] = useState(false);
  const [galatAkun, setGalatAkun] = useState<string | null>(null);
  const [suksesAkun, setSuksesAkun] = useState<string | null>(null);

  const muatDaftar = useCallback(() => {
    ambilSemuaPengguna()
      .then(setDaftar)
      .catch(() =>
        setGalat("Daftar akun tidak bisa dimuat. Muat ulang halaman untuk mencoba lagi.")
      );
  }, []);

  useEffect(() => {
    muatDaftar();
  }, [muatDaftar]);

  async function gantiPeran(target: Pengguna, peran: Peran) {
    if (target.role === peran) return;
    if (target.uid === profilSaya.uid && peran !== "admin") {
      const yakin = window.confirm(
        "Anda akan menurunkan peran akun Anda sendiri dari Admin menjadi User. " +
          "Jika Anda satu-satunya admin, tidak akan ada lagi yang bisa mengelola akun. Lanjutkan?"
      );
      if (!yakin) {
        muatDaftar();
        return;
      }
    }
    setGalat(null);
    try {
      await ubahPeran(target.uid, peran);
      muatDaftar();
    } catch {
      setGalat("Peran gagal diubah. Coba lagi.");
    }
  }

  async function tambahAkun(e: React.FormEvent) {
    e.preventDefault();
    setGalatAkun(null);
    setSuksesAkun(null);
    if (!namaBaru.trim()) {
      setGalatAkun("Nama tampilan wajib diisi.");
      return;
    }
    setSedangMendaftar(true);
    try {
      const profil = await daftarAkunBaru({
        email: emailBaru,
        sandi: sandiBaru,
        nama: namaBaru,
        role: peranBaru,
      });
      setSuksesAkun(`Akun ${profil.nama} (${profil.email}) berhasil dibuat.`);
      setEmailBaru("");
      setSandiBaru("");
      setNamaBaru("");
      setPeranBaru("user");
      muatDaftar();
    } catch (err) {
      const kode =
        err && typeof err === "object" && "code" in err ? String(err.code) : "";
      setGalatAkun(pesanGalatAkun(kode));
    } finally {
      setSedangMendaftar(false);
    }
  }

  return (
    <>
      <section aria-labelledby="judul-daftar-akun" className="mt-12">
        <h2 id="judul-daftar-akun" className="font-display text-2xl text-tinta">
          Daftar Akun Pengurus
        </h2>
        {galat && (
          <p role="alert" className="mt-4 rounded-lg bg-merah-muda px-4 py-3 text-merah">
            {galat}
          </p>
        )}
        {daftar === null ? (
          <p className="mt-6 text-abu">Memuat daftar akun&hellip;</p>
        ) : (
          <ul className="mt-6 divide-y divide-krem-tua rounded-xl border border-krem-tua">
            {daftar.map((p) => (
              <li
                key={p.uid}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-lg font-medium text-tinta">
                    {p.nama || "(tanpa nama)"}
                    {p.uid === profilSaya.uid && (
                      <span className="ml-2 text-base font-normal text-abu">(Anda)</span>
                    )}
                  </p>
                  <p className="truncate text-base text-abu">{p.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label htmlFor={`peran-${p.uid}`} className="sr-only">
                    Peran untuk {p.nama || p.email}
                  </label>
                  <select
                    id={`peran-${p.uid}`}
                    value={p.role}
                    onChange={(e) => gantiPeran(p, e.target.value as Peran)}
                    className="rounded-lg border-2 border-krem-tua bg-putih px-3 py-2 text-base font-medium text-tinta focus:border-emas-tua focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="judul-tambah-akun" className="mt-12 rounded-xl bg-krem px-6 py-8">
        <h2 id="judul-tambah-akun" className="font-display text-2xl text-tinta">
          Tambah Akun Baru
        </h2>
        <p className="mt-2 text-tinta-muda">
          Buat akun login untuk pengurus baru. Mereka masuk dengan email dan kata
          sandi yang Anda tentukan di sini.
        </p>
        <form onSubmit={tambahAkun} className="mt-6 space-y-5">
          <div>
            <label htmlFor="nama-akun" className="mb-2 block text-lg font-medium text-tinta">
              Nama tampilan
            </label>
            <input
              id="nama-akun"
              type="text"
              required
              value={namaBaru}
              onChange={(e) => setNamaBaru(e.target.value)}
              placeholder="Contoh: Katarina Teti"
              className={kelasInput}
            />
          </div>
          <div>
            <label htmlFor="email-akun" className="mb-2 block text-lg font-medium text-tinta">
              Email
            </label>
            <input
              id="email-akun"
              type="email"
              autoComplete="off"
              required
              value={emailBaru}
              onChange={(e) => setEmailBaru(e.target.value)}
              placeholder="pengurus@contoh.com"
              className={kelasInput}
            />
          </div>
          <div>
            <label htmlFor="sandi-akun" className="mb-2 block text-lg font-medium text-tinta">
              Kata sandi
            </label>
            <input
              id="sandi-akun"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={sandiBaru}
              onChange={(e) => setSandiBaru(e.target.value)}
              className={kelasInput}
            />
            <p className="mt-2 text-base text-abu">Minimal 6 karakter.</p>
          </div>
          <div>
            <label htmlFor="peran-akun" className="mb-2 block text-lg font-medium text-tinta">
              Peran
            </label>
            <select
              id="peran-akun"
              value={peranBaru}
              onChange={(e) => setPeranBaru(e.target.value as Peran)}
              className={`${kelasInput} max-w-xs`}
            >
              <option value="user">User (menulis renungan)</option>
              <option value="admin">Admin (menulis renungan + kelola akun)</option>
            </select>
          </div>
          {galatAkun && (
            <p role="alert" className="rounded-lg bg-merah-muda px-4 py-3 text-merah">
              {galatAkun}
            </p>
          )}
          {suksesAkun && (
            <p role="status" className="rounded-lg bg-emas-muda px-4 py-3 text-emas-tua">
              {suksesAkun}
            </p>
          )}
          <button type="submit" disabled={sedangMendaftar} className={kelasTombolUtama}>
            {sedangMendaftar ? "Membuat akun…" : "Buat Akun"}
          </button>
        </form>
      </section>
    </>
  );
}

function HalamanAkun({ profil }: { profil: Pengguna }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-tinta">Kelola Akun</h1>
        <Link
          href="/admin"
          className="text-base font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
        >
          <span aria-hidden="true">&larr;</span> Kembali ke renungan
        </Link>
      </div>

      <ProfilSaya profil={profil} />
      {profil.role === "admin" ? (
        <KelolaPengguna profilSaya={profil} />
      ) : (
        <p className="mt-8 text-base text-abu">
          Hanya admin yang dapat melihat dan menambahkan akun pengurus. Hubungi
          admin komunitas bila Anda memerlukan peran admin.
        </p>
      )}
    </div>
  );
}

export default function HalamanAdminAkun() {
  return <GerbangPengurus>{(_user, profil) => <HalamanAkun profil={profil} />}</GerbangPengurus>;
}
