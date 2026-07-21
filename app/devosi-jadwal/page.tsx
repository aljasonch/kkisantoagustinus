import type { Metadata } from "next";
import { Muncul } from "@/components/muncul";
import { jadwalRutinKomunitas } from "@/lib/jadwal";

export const metadata: Metadata = {
  title: "Devosi & Jadwal",
  description:
    "Lima unsur devosi Kerahiman Ilahi, teks doa Koronka lengkap, dan jadwal doa bersama KKI Paroki Karawaci.",
};

const limaUnsur = [
  {
    nama: "Gambar Kerahiman Ilahi",
    isi: "Gambar Yesus dengan dua sinar, merah dan pucat, yang memancar dari hati-Nya, bertuliskan “Yesus, Engkau Andalanku”. Sinar itu melambangkan darah dan air yang mengalir dari lambung Yesus di salib. Menghormati gambar ini berarti menaruh seluruh kepercayaan kepada Yesus.",
  },
  {
    nama: "Pesta Kerahiman Ilahi",
    isi: "Dirayakan setiap Minggu pertama sesudah Paskah (Minggu Paskah II). Pada hari itu Gereja merayakan kerahiman Allah yang tak terbatas; Yesus menjanjikan rahmat berlimpah bagi yang menyambutnya dengan hati bertobat.",
  },
  {
    nama: "Koronka Kerahiman Ilahi",
    isi: "Doa yang didaraskan dengan rosario biasa, mempersembahkan sengsara Yesus kepada Bapa sebagai pendamaian bagi dosa seluruh dunia. Teks lengkapnya ada di bawah.",
  },
  {
    nama: "Jam Kerahiman (Pukul 15.00)",
    isi: "Saat Yesus wafat di salib, pukul tiga sore, adalah saat rahmat bagi dunia. Kita diundang berhenti sejenak, merenungkan sengsara-Nya, dan memohon belas kasih bagi kita dan seluruh dunia.",
  },
  {
    nama: "Kerasulan Kerahiman Ilahi",
    isi: "Devosi tidak berhenti pada doa: kita diutus mewartakan dan melakukan kerahiman kepada sesama, lewat perbuatan, perkataan, dan doa, sehingga kasih Allah terasa nyata bagi orang di sekitar kita.",
  },
];

const agendaTahunan = [
  {
    sorotan: "Jumat Agung",
    kegiatan: "Novena Kerahiman Ilahi",
    keterangan:
      "Sembilan hari doa dengan ujud yang berbeda setiap hari, berpuncak pada Pesta Kerahiman Ilahi.",
  },
  {
    sorotan: "Paskah II",
    kegiatan: "Pesta Kerahiman Ilahi",
    keterangan: "Dirayakan pada Minggu Paskah kedua sebagai puncak devosi.",
  },
  {
    sorotan: "Oktober",
    kegiatan: "Kunjungan ke Lapas",
    keterangan: "Karya belas kasih bagi para penghuni lembaga pemasyarakatan.",
  },
  {
    sorotan: "Berkala",
    kegiatan: "Bakti Sosial ke Panti",
    keterangan:
      "Kunjungan kasih ke panti werdha, panti anak, dan panti rehabilitasi mental.",
  },
];

export default function DevosiJadwal() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-5xl text-tinta">Devosi &amp; Jadwal</h1>

      {/* Lima unsur devosi */}
      <section aria-labelledby="judul-unsur" className="mt-12">
        <Muncul>
          <h2 id="judul-unsur" className="font-display text-3xl text-tinta">
            Lima Unsur Devosi Kerahiman Ilahi
          </h2>
          <ol className="mt-6 space-y-8">
            {limaUnsur.map((unsur, i) => (
              <li key={unsur.nama} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="font-display text-3xl leading-snug text-emas"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-medium text-tinta">{unsur.nama}</h3>
                  <p className="mt-1 text-tinta-muda">{unsur.isi}</p>
                </div>
              </li>
            ))}
          </ol>
        </Muncul>
      </section>

      {/* Teks Koronka */}
      <section aria-labelledby="judul-koronka" className="mt-16">
        <div className="rounded-xl bg-krem px-6 py-10 sm:px-10">
          <div className="flex flex-col items-center text-center">
            <h2 id="judul-koronka" className="font-display text-3xl text-tinta">
              Doa Koronka Kerahiman Ilahi
            </h2>
            <p className="mt-2 text-abu">Didaraskan dengan rosario biasa</p>
          </div>

          <dl className="mt-8 space-y-7">
            <div>
              <dt className="font-medium text-emas-tua">Pembukaan</dt>
              <dd className="mt-1 text-tinta-muda">
                Bapa Kami, Salam Maria, dan Aku Percaya (Syahadat Para Rasul).
              </dd>
            </div>
            <div>
              <dt className="font-medium text-emas-tua">
                Pada manik besar (sebelum setiap peristiwa)
              </dt>
              <dd className="mt-1 italic text-tinta">
                &ldquo;Bapa yang kekal, kupersembahkan kepada-Mu Tubuh dan Darah,
                Jiwa dan Ke-Allah-an Putra-Mu yang terkasih, Tuhan kami Yesus
                Kristus, sebagai pendamaian untuk dosa kami dan dosa seluruh
                dunia.&rdquo;
              </dd>
            </div>
            <div>
              <dt className="font-medium text-emas-tua">
                Pada sepuluh manik kecil (sepuluh kali)
              </dt>
              <dd className="mt-1 italic text-tinta">
                &ldquo;Demi sengsara Yesus yang pedih, tunjukkanlah belas kasih-Mu
                kepada kami dan seluruh dunia.&rdquo;
              </dd>
            </div>
            <div>
              <dt className="font-medium text-emas-tua">
                Penutup (tiga kali)
              </dt>
              <dd className="mt-1 italic text-tinta">
                &ldquo;Allah yang Kudus, Kudus dan berkuasa, Kudus dan kekal,
                kasihanilah kami dan seluruh dunia.&rdquo;
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Jadwal rutin */}
      <section aria-labelledby="judul-rutin" className="mt-16">
        <Muncul>
          <h2 id="judul-rutin" className="font-display text-3xl text-tinta">
            Jadwal Rutin Komunitas
          </h2>
          <ul className="mt-6 divide-y divide-krem-tua">
            <li className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
              <p className="w-40 shrink-0 font-display text-2xl text-emas-tua">15.00 WIB</p>
              <div>
                <p className="text-xl font-medium text-tinta">Jam Kerahiman</p>
                <p className="text-tinta-muda">
                  Setiap hari, secara pribadi di mana pun berada.
                </p>
              </div>
            </li>
            {jadwalRutinKomunitas.map((j) => (
              <li
                key={j.kegiatan}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <p className="w-40 shrink-0 font-display text-2xl text-emas-tua">
                  {j.sorotan}
                </p>
                <div>
                  <p className="text-xl font-medium text-tinta">{j.kegiatan}</p>
                  <p className="text-tinta-muda">{j.keterangan}</p>
                </div>
              </li>
            ))}
          </ul>
        </Muncul>
      </section>

      {/* Agenda tahunan */}
      <section aria-labelledby="judul-tahunan" className="mt-14">
        <Muncul>
          <h2 id="judul-tahunan" className="font-display text-3xl text-tinta">
            Agenda Tahunan
          </h2>
          <ul className="mt-6 divide-y divide-krem-tua">
            {agendaTahunan.map((a) => (
              <li
                key={a.kegiatan}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <p className="w-40 shrink-0 font-display text-2xl text-emas-tua">
                  {a.sorotan}
                </p>
                <div>
                  <p className="text-xl font-medium text-tinta">{a.kegiatan}</p>
                  <p className="text-tinta-muda">{a.keterangan}</p>
                </div>
              </li>
            ))}
          </ul>
        </Muncul>
      </section>
    </div>
  );
}
