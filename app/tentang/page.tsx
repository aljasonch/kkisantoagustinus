import type { Metadata } from "next";
import Image from "next/image";
import devosiImg from "@/public/devosi_kerahiman_ilahi.jpg";
import { Muncul } from "@/components/muncul";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Sejarah devosi Kerahiman Ilahi, Santa Faustina Kowalska, dan Komunitas Kerahiman Ilahi Paroki Karawaci, Gereja Santo Agustinus.",
};

const pengurus = [
  { jabatan: "Romo Pendamping / Moderator", nama: "Tarcisius Warhadi H., OSC" },
  { jabatan: "Ketua", nama: "B. Dwiyana Taurisia" },
  { jabatan: "Wakil Ketua", nama: "Katarina Teti" },
  { jabatan: "Sekretaris 1", nama: "Agustina Hernanto" },
  { jabatan: "Sekretaris 2", nama: "Oei Mey Hwa" },
  { jabatan: "Bendahara", nama: "Bernadetta Ayen" },
];

export default function Tentang() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-5xl text-tinta">Tentang Kami</h1>

      <section aria-labelledby="judul-devosi" className="mt-12">
        <Muncul>
          <h2 id="judul-devosi" className="font-display text-3xl text-tinta">
            Devosi Kerahiman Ilahi
          </h2>
          <div className="mt-5 space-y-5 text-tinta-muda after:clear-both after:block after:content-['']">
            <Image
              src={devosiImg}
              alt="Lukisan Yesus yang Maharahim, Yesus, Engkau Andalanku"
              width={183}
              height={276}
              className="mx-auto mb-6 w-56 rounded-lg border border-krem-tua shadow-sm sm:float-right sm:mx-0 sm:mb-4 sm:ml-6 sm:w-56 md:w-64"
            />
            <p>
              Devosi Kerahiman Ilahi bermula dari pengalaman rohani{" "}
              <strong className="font-medium text-tinta">Santa Faustina Kowalska</strong>{" "}
              (1905&ndash;1938), seorang biarawati sederhana dari Kongregasi Suster-Suster
              Bunda Maria Kerahiman di Polandia. Dalam serangkaian penampakan, Tuhan
              Yesus mempercayakan kepadanya pesan tentang kerahiman Allah yang tak
              terbatas bagi setiap orang, terutama para pendosa, dan memintanya
              mencatat semuanya dalam buku hariannya.
            </p>
            <p>
              Dari pesan itu lahirlah gambar &ldquo;Yesus, Engkau Andalanku&rdquo;
              dengan dua sinar merah dan pucat yang memancar dari hati Yesus,
              lambang darah dan air, sumber kehidupan dan pengudusan. Yesus juga
              meminta agar Minggu pertama sesudah Paskah dirayakan sebagai Pesta
              Kerahiman Ilahi.
            </p>
            <p>
              Santa Faustina dikanonisasi oleh Paus Yohanes Paulus II pada tahun
              2000, bersamaan dengan penetapan Minggu Kerahiman Ilahi bagi Gereja
              universal. Sejak itu devosi ini berkembang ke seluruh dunia, termasuk
              di paroki-paroki di Indonesia.
            </p>
          </div>
        </Muncul>
      </section>

      <section aria-labelledby="judul-kki" className="mt-14">
        <Muncul>
          <h2 id="judul-kki" className="font-display text-3xl text-tinta">
            KKI Paroki Karawaci
          </h2>
          <div className="mt-5 space-y-5 text-tinta-muda">
            <p>
              Komunitas Kerahiman Ilahi (KKI) Paroki Karawaci menghimpun umat
              Gereja Santo Agustinus, Tangerang, yang ingin menghidupi devosi ini
              bersama-sama melalui doa Koronka, Jam Kerahiman, dan karya
              kasih bagi sesama.
            </p>
            <p>
              Komunitas Kerahiman Ilahi Paroki Karawaci, Gereja Santo Agustinus,
              resmi berdiri pada{" "}
              <strong className="font-medium text-tinta">25 April 2022</strong>. Komunitas
              ini didirikan atas prakarsa{" "}
              <strong className="font-medium text-tinta">
                Pastor Tarsisius Warhadi Harjasemeru, OSC
              </strong>
              , yang sebelumnya pernah berkarya sebagai Moderator Kerahiman Ilahi di
              Keuskupan Bandung.
            </p>
            <p>
              Lahirnya komunitas ini juga tidak lepas dari kerinduan{" "}
              <strong className="font-medium text-tinta">
                Ibu Brigitta Dwiyana Taurisia (Ibu Memei)
              </strong>
              , Ketua Komunitas Kerahiman Ilahi Paroki Karawaci. Sebelum melayani di
              Paroki Karawaci, beliau telah berkarya selama dua periode sebagai
              Sekretaris Komunitas Kerahiman Ilahi di Paroki Tangerang.
            </p>
            <p>
              Sebelum komunitas ini terbentuk, sebenarnya telah banyak umat Paroki
              Karawaci yang memiliki devosi kepada Kerahiman Ilahi. Mereka bergabung
              dan bertumbuh bersama komunitas di Paroki Tangerang, Paroki Curug,
              maupun Paroki Kutabumi. Melihat kerinduan umat akan devosi ini, Ibu
              Memei memberanikan diri mengajukan permohonan kepada{" "}
              <strong className="font-medium text-tinta">Pastor Stefanus Suwarno, OSC</strong>
              , selaku Pastor Kepala Paroki Karawaci, agar Komunitas Kerahiman Ilahi
              dapat hadir di Paroki Karawaci. Berkat dukungan dan izin beliau,
              Komunitas Kerahiman Ilahi akhirnya resmi berdiri dan menjadi salah satu
              kategorial di Paroki Karawaci Gereja Santo Agustinus.
            </p>
            <p>
              Sejak saat itu, Komunitas Kerahiman Ilahi terus bertumbuh sebagai wadah
              pembinaan iman melalui doa, pendalaman spiritualitas Kerahiman Ilahi,
              serta karya belas kasih kepada sesama, sesuai pesan Tuhan Yesus kepada
              Santa Faustina:{" "}
              <em className="text-tinta">&ldquo;Jadilah rasul Kerahiman-Ku.&rdquo;</em>
            </p>
            <p>
              Harapan kami, semakin banyak umat yang tergerak untuk bergabung dan
              bersama-sama bertumbuh dalam kasih dan kerahiman Allah. Semoga setiap
              anggota menjadi pribadi yang semakin mengandalkan Tuhan, mengalami
              kasih-Nya, serta menjadi saluran rahmat dan saksi belas kasih-Nya di
              tengah keluarga, Gereja, dan masyarakat.
            </p>
            <p className="font-display text-xl italic text-emas-tua">
              &ldquo;Yesus, Engkaulah Andalan Kami.&rdquo;
            </p>
          </div>
        </Muncul>
      </section>

      <section aria-labelledby="judul-pengurus" className="mt-14">
        <Muncul>
          <h2 id="judul-pengurus" className="font-display text-3xl text-tinta">
            Pengurus Komunitas
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3">
            {pengurus.map((p) => (
              <li
                key={p.jabatan}
                className="group flex flex-col items-center text-center"
              >
                <div className="flex h-20 w-20 items-end justify-center overflow-hidden rounded-full border-2 border-emas-muda bg-krem shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emas group-hover:shadow-lg sm:h-28 sm:w-28">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-[82%] w-[82%] translate-y-[4%] text-emas-muda/80 transition-transform duration-500 group-hover:scale-105"
                  >
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z" />
                  </svg>
                </div>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-widest text-emas-tua sm:text-xs">
                  {p.jabatan}
                </p>
                <p className="mt-0.5 font-display text-sm leading-snug text-tinta sm:text-base">
                  {p.nama}
                </p>
              </li>
            ))}
          </ul>
        </Muncul>
      </section>
    </div>
  );
}
