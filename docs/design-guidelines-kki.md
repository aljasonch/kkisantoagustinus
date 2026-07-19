# Panduan Desain — Website KKI Paroki Karawaci
(Diringkas dari pols.dev anti-slop design law, disesuaikan untuk konteks situs devosional)

**Prinsip dasar**: hindari elemen "template AI" yang generik, tapi jangan sampai
over-designed jadi terkesan "startup/SaaS". Target mood: adem, khusyuk, hangat,
gampang dinavigasi (banyak pengguna lansia).

## Hindari (tell generik yang harus dihindari)

- **Warna**: gradient biru-ke-ungu, atau kombinasi warna yang sepintas terasa
  "default AI palette". Pakai palet yang sudah ditentukan (putih, emas, aksen
  merah lembut — sesuai warna lukisan Kerahiman Ilahi), konsisten di semua
  halaman, bukan warna sisa preset.
- **Font**: jangan pakai kombinasi default seperti Inter + Space Grotesk,
  Fraunces + Work Sans, atau font Google Fonts yang terlalu sering dipakai
  (Inter, Sora, Syne, Archivo, Cormorant, dll). Pilih 1 font utama (untuk
  judul) + 1 font netral (untuk body) yang terasa tenang dan mudah dibaca,
  bukan sekadar tren.
- **Tombol**: hindari tombol pill dengan glow/shadow blur di bawahnya, hindari
  pasangan "tombol solid + tombol outline" sebagai default. Cukup satu gaya
  tombol yang jelas dan konsisten.
- **Card/kotak**: hindari ikon besar di dalam kotak berwarna (icon-in-tile),
  hindari border tipis abu-abu generik di semua kotak tanpa alasan.
- **Hero section**: hindari layout "teks kiri + panel kanan" yang templated.
  Untuk situs ini, hero cukup sederhana: nama komunitas, tagline devosi,
  mungkin gambar/ilustrasi Kerahiman Ilahi yang halus — tidak perlu dua
  kolom rumit.
- **Testimoni/quote card**: kalau nanti ada testimoni (fase 2), hindari kartu
  quote dengan avatar inisial gradient dan ikon kutip besar generik.
- **Dekorasi kosong**: hindari elemen dekoratif yang tidak fungsional (badge
  pill kecil di atas headline, garis dekoratif tanpa makna, background grid
  teknikal ala startup).
- **Grid/pola background generik**: hindari pola grid tipis "graph paper" di
  belakang seluruh halaman — ini kesannya terlalu "teknikal", tidak cocok
  untuk situs devosional.

## Terapkan (prinsip yang tetap relevan)

- **Kontras & keterbacaan**: teks harus jelas kontras dari background — ini
  krusial karena banyak pengunjung lansia. Ukuran font jangan kekecilan.
- **Satu bahasa visual yang konsisten**: warna, jenis tombol, radius sudut,
  spacing — semua harus terasa satu sistem, bukan campuran gaya berbeda di
  tiap halaman.
- **Ruang/whitespace cukup**: jangan menjejalkan teks sampai mepet ke tepi
  layar atau kotak. Beri margin yang nyaman dibaca.
- **Elemen bermakna, bukan sekadar hiasan**: kalau ada garis pembatas, ikon,
  atau border — pastikan itu benar-benar membantu struktur/navigasi, bukan
  ditaruh cuma biar "terlihat didesain".
- **Konten dulu, baru hiasan**: prioritaskan kejelasan isi (jadwal, renungan,
  kontak) di atas efek visual yang rumit (glass effect, animasi berlebih).
  Halaman yang jujur dan jelas jauh lebih penting di sini daripada halaman
  yang "mewah" tapi susah dipakai orang tua.
- **Satu elemen visual yang jadi ciri khas (opsional, bukan wajib)**: misal
  ilustrasi/rendering halus dari lukisan "Yesus, Engkau Andalanku" yang
  dipakai konsisten sebagai identitas visual situs — bukan ikon generik dari
  icon pack.
- **Motion secukupnya**: transisi halus (fade, scroll reveal ringan) boleh,
  tapi jangan berlebihan atau jadi gimmick. Yang penting konten tetap selalu
  terlihat/terbaca — jangan sampai ada bagian yang "hilang" karena animasi
  gagal jalan (misal teks di-hide dulu lalu muncul via animasi — ini rawan
  gagal render dan bikin section kosong).

## Instruksi untuk Claude Code

Gunakan file ini sebagai pedoman visual utama, bukan file pols.dev yang penuh
(karena banyak bagian di sana ditujukan untuk situs SaaS/startup dan kurang
relevan di sini). Prioritas: kejelasan, kehangatan, dan kemudahan akses untuk
semua umur — bukan kesan "mewah/techy".