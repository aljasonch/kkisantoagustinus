# Website KKI Paroki Karawaci

Situs Komunitas Kerahiman Ilahi (KKI) Paroki Karawaci, Gereja Santo Agustinus,
Tangerang. Next.js (App Router) + Tailwind CSS v4 + Firebase.

Dokumen acuan:

- [`docs/spec-website-kki-karawaci.md`](docs/spec-website-kki-karawaci.md): spec & roadmap
- [`docs/design-guidelines-kki.md`](docs/design-guidelines-kki.md): panduan visual
- [`docs/setup-firebase.md`](docs/setup-firebase.md): setup Firebase (Auth + Firestore + rules)

## Menjalankan

```bash
npm install
# isi kredensial Firebase + Cloudinary di .env (lihat docs/setup-firebase.md)
npm run dev
```

Tanpa kredensial Firebase, situs tetap jalan: bagian renungan menampilkan pesan
"belum tersedia" dan `/admin` menampilkan petunjuk setup.

## Struktur

| Rute | Isi |
|---|---|
| `/` | Beranda: hero, Renungan Hari Ini, sambutan Ketua, kutipan Santa Faustina, jadwal rutin, galeri terbaru |
| `/tentang` | Sejarah devosi & KKI Karawaci, pengurus |
| `/devosi-jadwal` | 5 unsur devosi, teks Koronka penuh, jadwal rutin & tahunan |
| `/renungan` | Arsip renungan published (urut mundur) |
| `/renungan/[tanggal]` | Detail renungan per tanggal (`YYYY-MM-DD`) |
| `/galeri` | Galeri foto kegiatan komunitas (Cloudinary + Firestore) |
| `/kontak` | Kontak komunitas, alamat gereja + peta, tautan situs paroki |
| `/admin` | Panel pengurus: login Firebase Auth, daftar & hapus renungan |
| `/admin/editor` | Tulis/ubah renungan, Terbitkan atau Simpan sebagai Draft |
| `/admin/galeri` | Unggah/hapus foto galeri (upload ke Cloudinary) |

Teks yang masih menunggu isian dari Ketua ditandai `[ISI: ...]` (bergaris
bawah putus-putus emas di halaman); daftar lengkapnya ada di spec bagian 4.

## Status roadmap

1. ✅ Setup Next.js + Tailwind
2. ✅ Halaman statis dengan placeholder `[ISI: ...]`
3. ✅ Setup project Firebase di console (panduan: `docs/setup-firebase.md`) + Cloudinary
4. ✅ Admin panel `/admin` (login + CRUD renungan + galeri)
5. ✅ Renungan hari ini di Beranda + arsip
6. ✅ Galeri kegiatan, Instagram, logo, peta, jadwal rutin
7. ⬜ Review bareng Ketua, isi konten asli
8. ⬜ Sesi pengajaran admin panel
9. ⬜ Publish (Vercel)
