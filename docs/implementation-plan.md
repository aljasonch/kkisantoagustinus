# Context

Repository masih berupa starter Next.js 16.2.10 + Tailwind 4, sedangkan `docs/spec-website-kki-karawaci.md` meminta microsite KKI Paroki Karawaci yang mobile-first, mudah dipakai devosan lansia, dan nantinya memiliki alur renungan harian yang dikelola Ketua melalui Firebase. `docs/design-guidelines-kki.md` menetapkan tampilan putih/emas/merah lembut yang adem dan khusyuk, serta secara eksplisit melarang pola visual generik SaaS/AI. Pengerjaan akan mengikuti urutan roadmap: fondasi dan halaman statis dahulu, kemudian layanan eksternal/admin, lalu integrasi renungan publik. Konten komunitas yang belum diberikan tidak akan direka; situs akan menampilkan placeholder `[ISI: ...]` yang jelas.

## 1. Fondasi aplikasi dan sistem visual

- Baca dan ikuti panduan Next.js 16 lokal yang relevan selama implementasi (App Router, metadata, async route params/search params, Server/Client Components, `next/image`, dan caching); pertahankan Server Components sebagai default dan buat Client Component sekecil mungkin hanya untuk menu mobile serta UI admin interaktif.
- Perbarui `app/layout.tsx` menjadi dokumen Indonesia (`lang="id"`), metadata KKI, font judul/body yang tenang dan mudah dibaca (Lora + Source Sans 3), skip link, header, area `main`, dan footer bersama.
- Ganti starter/dark-mode otomatis dalam `app/globals.css` dengan token semantik Tailwind 4 untuk putih hangat, permukaan ivory, teks cokelat-hitam berkontras tinggi, emas gelap, dan merah lembut. Tambahkan focus-visible, target sentuh minimal 44px, lebar baca nyaman, dan reduced-motion; hindari gradient, glow, pill, kartu/border tanpa fungsi, dan dekorasi kosong.
- Buat sumber navigasi tunggal di `lib/navigation.ts` dan komponen bersama di `components/layout/` serta `components/ui/` (`SiteHeader`, menu mobile, `SiteFooter`, `PageContainer`, `ActionLink`, `SectionHeading`, `ContentPlaceholder`, `EmptyState`).
- Bersihkan pemakaian aset/teks Create Next App; pertahankan aset starter yang belum dihapus sampai target diperiksa, lalu ganti favicon/branding saat aset resmi tersedia.

## 2. Halaman publik statis Fase 1

- Bangun `app/page.tsx` sebagai Beranda: hero sederhana dengan nama komunitas dan tagline "Yesus, Engkau Andalanku", sambutan Ketua berupa placeholder, slot renungan, slot kegiatan terdekat, dan CTA Kontak.
- Tambahkan `app/tentang-kami/page.tsx`: sejarah devosi yang ditulis orisinal dan ringkas, sejarah KKI Karawaci serta susunan pengurus dengan placeholder per data yang belum tersedia.
- Tambahkan `app/devosi-jadwal/page.tsx`: lima unsur devosi, struktur teks Koronka yang mudah dipindai, Jam Kerahiman pukul 15.00, jadwal rutin, dan kegiatan tahunan. Konten faktual komunitas tetap placeholder; jangan menyalin artikel pihak lain.
- Tambahkan `app/kontak/page.tsx`: alamat gereja dari spec, tautan eksternal ke `santoagustinus.id`, dan placeholder WhatsApp/email resmi; tidak membuat form kontak karena tidak diminta.
- Simpan konten statis terstruktur di `lib/content/` agar fakta komunitas, jadwal, dan copy dapat diganti tanpa membongkar JSX. Data jadwal tidak akan direka; bila kosong, tampilkan placeholder yang jujur.
- Tambahkan metadata per halaman, `app/not-found.tsx`, `app/sitemap.ts`, dan `app/robots.ts`; `/admin` tidak boleh diindeks. `metadataBase`/canonical final menunggu domain produksi.

## 3. Domain renungan dan tampilan publik

- Definisikan tipe dan validasi terpusat di `lib/renungan/` sesuai schema final: `tanggal`, `judul?`, `ayat`, `referensiAyat`, `isiRenungan`, `doaPenutup?`, `status`, dan timestamp. **Tidak ada field gambar (`gambarUrl`/`gambarAlt`) di fase 1** — lihat keputusan final di bagian 5. **Tidak ada field `terjemahanAyat` per dokumen** — terjemahan Kitab Suci ditulis sebagai keterangan tetap di UI, bukan bagian dari schema. UI tidak akan bergantung langsung pada Firestore snapshot/Timestamp.
- Tambahkan elemen keterangan tetap ("Kutipan Kitab Suci menggunakan Alkitab Terjemahan Baru (TB), Lembaga Alkitab Indonesia.") pada layout/halaman yang menampilkan renungan (Beranda dan arsip/detail Renungan), ditulis satu kali sebagai teks statis, bukan data per dokumen.
- Buat kontrak repository publik/admin terpisah agar halaman publik hanya dapat meminta dokumen `published`. Implementasi awal menggunakan repository lokal kosong/fixture yang jelas untuk memungkinkan UI dan test berjalan sebelum credential Firebase tersedia.
- Buat utilitas tanggal `Asia/Jakarta` dan fallback Beranda: published hari ini → published terakhir dengan tanggal tidak melebihi hari ini → empty state. Jika memakai fallback lama, label menjadi "Renungan Terbaru", bukan mengklaim "hari ini".
- Tambahkan `app/renungan/page.tsx` untuk arsip newest-first dengan pagination sederhana dan `app/renungan/[tanggal]/page.tsx` untuk detail. Dynamic `params` mengikuti API async Next.js 16; format tanggal divalidasi, draft/tanggal invalid memakai `notFound()`, dan isi teks dirender per paragraf tanpa `dangerouslySetInnerHTML`.
- Komponen reusable berada di `components/renungan/` dan `components/schedule/`; tanggal memakai elemen `<time>` dan layout artikel dibatasi untuk keterbacaan. Kartu/detail renungan dirancang tanpa slot gambar di fase 1.

## 4. Firebase, aturan keamanan, dan admin (setelah konfigurasi eksternal tersedia)

- Tambahkan Firebase Web SDK dan singleton config di `lib/firebase/`, dengan environment variables untuk project development/production. Jangan commit `.env`, service-account JSON, atau secret; akun Ketua dibuat manual dan self-sign-up tidak disediakan.
- Version-control `firebase/firestore.rules` dan `firebase/firestore.indexes.json`. Rules memisahkan public published-only dari admin read/write, memvalidasi field/type/status sesuai schema final di bagian 3 (tanpa field gambar, tanpa field terjemahan), memastikan document ID sama dengan `tanggal`, menolak field asing, dan memakai UID admin awal atau custom claim saat jumlah admin bertambah. Query arsip selalu menyertakan filter `status == published`; index minimum `status ASC, tanggal DESC`.
- Bangun `app/admin/` dengan login email/password, logout, daftar newest-first, create/edit/delete, serta form besar dan sederhana. Field form mengikuti schema final (tanggal, judul opsional, ayat, referensiAyat, isiRenungan, doaPenutup opsional, status) — **tidak ada field upload gambar atau pilihan terjemahan di form**; aksi eksplisit "Simpan sebagai Draf" dan "Terbitkan"; tanggal dikunci setelah dokumen dibuat; hapus/publish memakai konfirmasi; error mempertahankan input dan status sukses diumumkan secara aksesibel.
- Client-side auth guard hanya untuk UX; Firestore Rules tetap menjadi batas keamanan. Timestamp create/update menggunakan `serverTimestamp()` dan input dinormalisasi/dites pada boundary repository.
- Ganti repository lokal publik dengan implementasi Firestore setelah emulator dan rules lulus. Pilih dynamic read atau revalidation pendek berdasarkan API caching Next.js 16 yang terpasang agar publish cepat terlihat tanpa endpoint revalidation yang belum diamankan.

## 5. Keputusan schema yang sudah difinalkan, dan Cloudinary

- **Final — tidak ada gambar per renungan di fase 1.** Field `gambarUrl`/`gambarAlt` tidak ditambahkan ke schema, form admin, maupun tampilan publik. Alasan: mengurangi kompleksitas form untuk Ketua (pengguna non-teknis), dan Cloudinary belum siap dipakai (lihat di bawah). Jika kebutuhan gambar muncul nyata di kemudian hari, ini masuk sebagai pekerjaan fase 2 terpisah, bukan bagian dari rilis awal.
- **Final — terjemahan Kitab Suci bukan field, melainkan keterangan tetap.** Situs menggunakan Alkitab Terjemahan Baru (TB) untuk seluruh kutipan ayat, dinyatakan sekali sebagai teks statis di halaman yang relevan (lihat bagian 3). Tidak ada field `terjemahanAyat` di schema maupun form admin.
- **Karena kedua keputusan di atas, Cloudinary tidak dibutuhkan untuk rilis fase 1.** Cloudinary sepenuhnya ditunda; tidak ada pekerjaan integrasi (uploader, `images.remotePatterns`, environment config) di roadmap fase 1. Cloudinary hanya dipertimbangkan kembali jika fase 2 (galeri, kesaksian, atau gambar renungan) disepakati dan direncanakan ulang secara eksplisit — termasuk cloud name, unsigned preset terbatas, folder, batas MIME/ukuran, dan hak pakai gambar.
- Fase 2 (galeri dan kesaksian) tetap tidak dibuat atau ditautkan sampai materi dan requirement tersedia.

## 6. Urutan eksekusi praktis

1. Implementasikan fondasi visual, shell, seluruh halaman statis, placeholder, metadata, serta tampilan renungan berbasis repository lokal — sesuai schema final tanpa field gambar/terjemahan.
2. Jalankan lint, typecheck, build, dan pengujian UI; perbaiki responsive/accessibility sampai stabil.
3. Deploy preview skeleton ke Vercel hanya ketika pengguna mengizinkan tindakan eksternal dan sesi memiliki autentikasi Vercel.
4. Setelah pengguna menyediakan/menyiapkan Firebase project, admin UID, dan environment config, implementasikan rules/indexes, admin, dan Firestore repository lalu uji lewat Emulator.
5. Ganti seluruh `[ISI: ...]` bersama Ketua, lakukan uji pakai admin di perangkat Ketua, lalu publish final. (Langkah Cloudinary dihapus dari urutan fase 1 — lihat bagian 5.)

## Critical files

- Existing: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `next.config.ts`, `package.json`
- Public routes: `app/tentang-kami/page.tsx`, `app/devosi-jadwal/page.tsx`, `app/renungan/**`, `app/kontak/page.tsx`
- Shared UI/content: `components/layout/**`, `components/ui/**`, `components/renungan/**`, `lib/content/**`, `lib/navigation.ts`
- Data/backend: `lib/renungan/**`, `lib/dates/**`, `lib/firebase/**`, `firebase/firestore.rules`, `firebase/firestore.indexes.json`, `app/admin/**`

## Verification

- Static checks: `npm run lint`, `npx tsc --noEmit`, dan `npm run build`.
- Unit tests (tooling ditambahkan bersama domain logic): validasi tanggal, timezone Jakarta, fallback today/latest/empty, published-only behavior, validasi form sesuai schema final (tanpa field gambar/terjemahan), dan perhitungan kegiatan terdekat dengan clock yang dapat diinjeksi.
- Browser/E2E: seluruh navigasi desktop/mobile, menu keyboard, viewport 320/375/tablet/desktop, zoom 200%, tidak ada horizontal overflow, focus order, target sentuh, placeholder terlihat, empty state, fallback label, arsip/detail/not-found, metadata, dan audit aksesibilitas.
- Firebase Emulator: anonymous hanya membaca published; draft tidak bocor; anonymous/non-admin tidak menulis; admin dapat CRUD; payload/field/status/tanggal invalid ditolak (termasuk field asing seperti gambar/terjemahan yang seharusnya ditolak rules); query dan index arsip berfungsi.
- Alur admin end-to-end: login gagal/berhasil, buat draft, verifikasi tidak tampil publik, publish, edit, delete, refresh sesi, error jaringan, dan pencegahan double submit.
- Review final bersama Ketua: akurasi sejarah/nama/jadwal/kontak, kemudahan membuat serta menerbitkan renungan di perangkat nyata, dan memastikan tidak ada placeholder tersisa sebelum produksi.