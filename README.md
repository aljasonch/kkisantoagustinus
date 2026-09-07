# Website KKI Paroki Karawaci

Situs resmi **Komunitas Kerahiman Ilahi (KKI) — Gereja Santo Agustinus, Paroki Karawaci, Tangerang** dengan semboyan _"Yesus, Engkau Andalanku"_.

Situs ini menjadi pusat informasi komunitas: jadwal doa, teks devosi Koronka, renungan harian, galeri kegiatan, dan kontak. Pengurus dapat memperbarui renungan dan galeri secara mandiri melalui panel admin.

## Gambaran

- **Beranda:** hero, Renungan Hari Ini, sambutan Ketua, kutipan harian dari Buku Harian Santa Faustina, jadwal doa bersama, galeri terbaru.
- **Tentang:** sejarah devosi Kerahiman Ilahi, profil KKI Karawaci, dan susunan pengurus.
- **Devosi & Jadwal:** 5 unsur devosi, teks doa Koronka lengkap, jadwal rutin dan tahunan.
- **Renungan:** arsip renungan harian + halaman detail per tanggal (`/renungan/[tanggal]`).
- **Galeri:** dokumentasi foto kegiatan komunitas.
- **Kontak:** alamat gereja + peta, kontak komunitas, tautan situs paroki.
- **Admin (`/admin`):** login pengurus, tulis/terbitkan renungan (draft & published), kelola foto galeri.

## Teknologi

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS v4** untuk styling
- **Firebase Auth + Firestore** untuk login admin dan data renungan/galeri
- **Cloudinary** untuk penyimpanan foto galeri

## Struktur halaman

| Rute | Isi |
|---|---|
| `/` | Beranda |
| `/tentang` | Sejarah, profil komunitas, pengurus |
| `/devosi-jadwal` | Unsur devosi, teks Koronka, jadwal |
| `/renungan` | Arsip renungan |
| `/renungan/[tanggal]` | Detail renungan harian |
| `/galeri` | Galeri kegiatan |
| `/kontak` | Kontak, alamat, peta |
| `/admin` | Panel pengurus (renungan + galeri) |
