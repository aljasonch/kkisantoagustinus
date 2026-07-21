import type { Metadata } from "next";
import { Muncul } from "@/components/muncul";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Komunitas Kerahiman Ilahi Paroki Karawaci, Gereja Santo Agustinus, Jl. Prambanan Raya No. 1, Perumnas Karawaci, Cibodas, Tangerang.",
};

export default function Kontak() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-5xl text-tinta">Kontak</h1>
      <p className="mt-5 max-w-2xl text-tinta-muda">
        Ingin ikut berdoa bersama, bertanya tentang jadwal, atau mengenal devosi
        Kerahiman Ilahi lebih dekat? Silakan hubungi kami, dengan senang
        hati kami menyambut Saudara/i.
      </p>

      <section aria-labelledby="judul-hubungi" className="mt-12">
        <Muncul>
          <h2 id="judul-hubungi" className="font-display text-3xl text-tinta">
            Hubungi Komunitas
          </h2>
          <dl className="mt-6 divide-y divide-krem-tua">
            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
              <dt className="w-48 shrink-0 font-medium text-tinta">WhatsApp</dt>
              <dd>
                <span className="text-tinta-muda">0896-3310-9614</span>
              </dd>
            </div>
            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
              <dt className="w-48 shrink-0 font-medium text-tinta">Email</dt>
              <dd>
                <span className="text-tinta-muda">TBA</span>
              </dd>
            </div>
          </dl>
        </Muncul>
      </section>

      <section aria-labelledby="judul-alamat" className="mt-12">
        <Muncul>
          <h2 id="judul-alamat" className="font-display text-3xl text-tinta">
            Alamat Gereja
          </h2>
          <address className="mt-5 not-italic text-tinta-muda">
            <p className="text-xl font-medium text-tinta">Gereja Santo Agustinus</p>
            <p className="mt-1">
              Jl. Prambanan Raya No. 1, Perumnas Karawaci,
              <br />
              Cibodas, Kota Tangerang, Banten
            </p>
          </address>
          <div className="mt-6 overflow-hidden rounded-xl border border-krem-tua shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.423107268536!2d106.6043768758536!3d-6.207789993780053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fe957a6930f9%3A0x653ba2114acdfd88!2sSaint%20Augustine%20Catholic%20Church%2C%20Karawaci!5e0!3m2!1sen!2sid!4v1784538106866!5m2!1sen!2sid"
              title="Peta lokasi Gereja Santo Agustinus, Karawaci di Google Maps"
              className="h-[380px] w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <p className="mt-4">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Gereja+Santo+Agustinus+Jl.+Prambanan+Raya+No.+1+Perumnas+Karawaci+Tangerang"
              className="font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
            >
              Buka lokasi di Google Maps
            </a>
          </p>
        </Muncul>
      </section>

      <section aria-labelledby="judul-paroki" className="mt-12 rounded-xl bg-krem px-6 py-8">
        <Muncul>
          <h2 id="judul-paroki" className="font-display text-2xl text-tinta">
            Situs Resmi Paroki
          </h2>
          <p className="mt-3 text-tinta-muda">
            Situs ini adalah situs komunitas. Informasi resmi paroki, jadwal
            misa, pelayanan, dan warta paroki, ada di situs Gereja Santo
            Agustinus:
          </p>
          <p className="mt-4">
            <a
              href="https://santoagustinus.id"
              className="font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
            >
              santoagustinus.id
            </a>
          </p>
        </Muncul>
      </section>
    </div>
  );
}
