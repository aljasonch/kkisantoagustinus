# Spec: Website Komunitas Kerahiman Ilahi (KKI) — Paroki Karawaci, Gereja Santo Agustinus

## 1. Konteks & Tujuan

Website mikro-site untuk **Komunitas Kerahiman Ilahi (KKI) Paroki Karawaci**, Gereja Santo Agustinus, Tangerang.

- **Bukan pengganti** website paroki utama (santoagustinus.id) — ini situs terpisah khusus komunitas.
- Ketua komunitas: ibu dari developer (akan mengisi konten & jadi sumber informasi utama).
- Developer (pembuat situs) akan mengelola sisi teknis dan mengajarkan ketua cara pakai admin panel.
- Referensi/pola serupa: KKI Gereja Regina Caeli (parokipik.org), KKI Paroki Kuta Bumi - St. Gregorius Agung.

## 2. Prinsip Desain

- **Mood**: adem, khusyuk, hangat — bukan korporat. Palet warna disarankan **putih & emas**, dengan aksen merah lembut (mengacu pada sinar merah-putih di lukisan Kerahiman Ilahi/"Jesus, I Trust in You").
- **Aksesibilitas**: banyak devosan berusia lanjut → ukuran font cukup besar, kontras tinggi, navigasi sederhana (hindari menu bertingkat yang rumit), tombol besar dan jelas.
- **Struktur**: single-purpose per halaman, jangan padat. Prioritaskan kejelasan atas dekorasi.
- Mobile-first (banyak umat akan akses dari HP).

## 3. Sitemap (Fase 1 — MVP)

1. **Beranda**
   - Hero: nama komunitas + tagline devosi ("Yesus, Engkau Andalanku")
   - Sambutan singkat dari Ketua (personal, hangat)
   - **Renungan Hari Ini** (highlight/card di beranda, auto-update sesuai tanggal — lihat bagian 5)
   - Highlight jadwal doa/kegiatan terdekat
   - CTA ke halaman Kontak

2. **Tentang Kami**
   - Sejarah devosi Kerahiman Ilahi secara umum (Santa Faustina Kowalska, wahyu, dasar teologis) — ringkas
   - Sejarah spesifik KKI Paroki Karawaci (diisi oleh Ketua)
   - Struktur pengurus: Romo Pendamping/Moderator, Ketua, Wakil, Sekretaris, Koordinator (jika ada)

3. **Devosi & Jadwal**
   - Penjelasan 5 unsur devosi Kerahiman Ilahi:
     1. Gambar Kerahiman Ilahi
     2. Pesta Kerahiman Ilahi
     3. Koronka Kerahiman Ilahi
     4. Jam Kerahiman Ilahi (pukul 15.00)
     5. Kerasulan Kerahiman Ilahi
   - Teks doa Koronka (boleh ditampilkan penuh — ini doa liturgis/devosional, bukan karya berhak cipta individu)
   - Jadwal rutin komunitas (hari, jam, lokasi — diisi Ketua)
   - Event tahunan (Novena menjelang Pesta Kerahiman Ilahi, dll)

4. **Renungan Harian** (halaman arsip, terpisah dari highlight di Beranda)
   - Daftar renungan per tanggal, bisa di-browse mundur (arsip)
   - Detail per renungan: Ayat Hari Ini, Renungan (2-3 paragraf), Doa Penutup

5. **Kontak**
   - Info kontak komunitas
   - Link balik ke situs resmi paroki: santoagustinus.id
   - Alamat Gereja Santo Agustinus, Jl. Prambanan Raya No. 1, Perumnas Karawaci, Cibodas, Tangerang

### Fase 2 (nanti, setelah materi terkumpul)
- Kesaksian/testimoni anggota
- Galeri foto kegiatan

## 4. Konten yang Perlu Dikumpulkan dari Ketua (belum tersedia publik)

Belum ada informasi berikut secara online — perlu diwawancara langsung dari Ketua sebelum halaman terkait bisa diisi:

- [ ] Sejarah KKI Paroki Karawaci: kapan mulai, siapa penggerak awal, perkembangan
- [ ] Nama Romo Pendamping/Moderator saat ini
- [ ] Susunan pengurus lengkap (nama, jabatan)
- [ ] Jadwal rutin doa (Koronka, Jam Kerahiman, Jalan Salib, dll — hari & jam & lokasi)
- [ ] Kontak resmi komunitas (nomor WA, email jika ada)
- [ ] Sambutan singkat dari Ketua untuk Beranda
- [ ] Foto (opsional untuk fase 1): logo/lambang komunitas jika ada, foto kegiatan

## 5. Fitur "Renungan Harian" — Detail Teknis

Ini satu-satunya bagian yang butuh **update rutin**, jadi perlu arsitektur terpisah dari konten statis.

### Kebutuhan
- Ketua (non-teknis) harus bisa menambah/edit renungan sendiri tanpa bantuan developer setiap hari.
- Developer (kamu) yang setup backend & admin panel, lalu mengajarkan cara pakai.

### Arsitektur: Firebase (data + auth) + Cloudinary (media)

**Pembagian tugas:**
- **Firebase (Firestore)**: menyimpan data renungan (teks) & autentikasi Ketua ke admin panel
- **Cloudinary**: menyimpan & optimasi gambar (foto Ketua di sambutan, logo/lambang komunitas, foto galeri fase 2, gambar Kerahiman Ilahi). Firestore hanya menyimpan URL Cloudinary-nya, bukan file gambarnya.

**Database (Firestore)**

Collection `renungan`, tiap dokumen:
| Field | Tipe | Keterangan |
|---|---|---|
| tanggal | string (`YYYY-MM-DD`) | dipakai juga sebagai document ID agar unik per tanggal |
| judul | string | opsional, judul singkat |
| ayat | string | kutipan ayat Kitab Suci |
| referensiAyat | string | mis. "Yohanes 3:16" |
| isiRenungan | string | 2-3 paragraf refleksi |
| doaPenutup | string | opsional |
| status | string (`draft` \| `published`) | agar bisa disiapkan H-1 tanpa langsung tayang |
| dibuatPada | timestamp | auto (serverTimestamp) |
| diperbaruiPada | timestamp | auto (serverTimestamp) |

**Auth**
- Firebase Authentication, metode Email/Password, 1 akun untuk Ketua (bisa ditambah akun lain nanti kalau perlu koordinator lain bantu isi).
- Firestore Security Rules: hanya user yang login yang boleh menulis ke collection `renungan`; siapa saja boleh membaca dokumen berstatus `published`.

**Admin Panel (`/admin`)**
- Halaman login (email + password via Firebase Auth)
- Form input renungan: tanggal, ayat + referensi, isi renungan, doa penutup, tombol Simpan sebagai Draft / Publish
- Upload gambar (jika ada) langsung ke Cloudinary lewat *unsigned upload preset* dari browser — hasil URL-nya disimpan ke field terkait di Firestore
- List renungan yang sudah dibuat (bisa edit/hapus), diurutkan tanggal terbaru
- UI form dibuat sederhana & besar — ingat pengguna adalah non-teknis, bukan developer

**Tampilan Publik**
- Beranda: tampilkan dokumen `renungan` dengan `tanggal = hari ini` dan `status = published` (fallback: renungan terakhir yang published jika hari ini belum diisi)
- Halaman "Renungan Harian": arsip semua renungan `published`, urut mundur (query Firestore `orderBy('tanggal', 'desc')`), bisa diklik untuk baca detail
- Gambar (galeri, foto sambutan, dll) di-render via Cloudinary URL, bisa pakai transformasi Cloudinary (resize/format otomatis) supaya ringan di HP

**Kenapa kombinasi ini cocok:**
- Firebase free tier (Spark plan) cukup untuk skala 1 komunitas paroki — jauh dari limit harian
- Cloudinary free tier menangani optimasi gambar otomatis (penting karena banyak devosan akses dari HP dengan koneksi terbatas)
- Firebase Auth + Firestore Security Rules cukup sederhana untuk 1 admin, tapi tetap aman
- Firebase SDK terintegrasi baik dengan Next.js, banyak contoh & dokumentasi

## 6. Tech Stack Usulan

- **Frontend**: Next.js (App Router) + Tailwind CSS
- **Data & Auth**: Firebase (Firestore + Firebase Authentication)
- **Media**: Cloudinary (upload & optimasi gambar)
- **Hosting**: Vercel (gratis untuk skala ini)
- **Domain**: subdomain terpisah, mis. `kki.santoagustinus.id` (perlu koordinasi dengan Komsos paroki) atau domain baru independen

## 7. Copyright & Konten Reminder

- Boleh menampilkan teks doa Koronka Kerahiman Ilahi secara penuh (doa devosional resmi, bukan karya berhak cipta individu/band/penulis).
- **Jangan** copy-paste utuh artikel/renungan dari situs lain (mis. dari situs paroki lain atau blog Katolik) — tulis ulang/parafrase, atau minta izin eksplisit dan sertakan sumber.
- Untuk kutipan Kitab Suci, sebutkan referensi ayat & terjemahan yang dipakai (mis. Alkitab Terjemahan Baru / TB).

## 8. Roadmap Pengerjaan (untuk Claude Code)

1. Setup project Next.js + Tailwind, deploy skeleton ke Vercel
2. Bangun halaman statis (Beranda, Tentang, Devosi & Jadwal, Kontak) dengan konten placeholder `[ISI: ...]` di bagian yang belum ada datanya
3. Setup Firebase project (Firestore + Authentication) + Cloudinary account (upload preset unsigned)
4. Bangun admin panel `/admin` (login + CRUD renungan)
5. Integrasikan renungan hari ini ke Beranda + halaman arsip Renungan Harian
6. Review bareng Ketua, isi konten asli, ganti placeholder
7. Sesi pengajaran admin panel ke Ketua
8. Publish