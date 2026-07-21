import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-tinta text-krem">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-2xl">Kerahiman Ilahi</p>
            <p className="mt-1 text-krem/80">
              Komunitas Kerahiman Ilahi
              <br />
              Paroki Karawaci, Gereja Santo Agustinus
            </p>
            <p className="mt-4 font-display text-lg text-emas-muda">
              &ldquo;Yesus, Engkau Andalanku&rdquo;
            </p>

            <p className="mt-6 text-sm font-medium uppercase tracking-widest text-krem/60">
              Ikuti Kami
            </p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://www.youtube.com/@KKIKarawaci"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube KKI Karawaci"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-krem/25 text-krem/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-emas-muda hover:text-emas-muda"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/kki_karawaci/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram KKI Karawaci"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-krem/25 text-krem/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-emas-muda hover:text-emas-muda"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="font-display text-lg text-emas-muda">Alamat Gereja</p>
            <address className="mt-2 not-italic text-krem/80">
              Gereja Santo Agustinus
              <br />
              Jl. Prambanan Raya No. 1, Perumnas Karawaci,
              <br />
              Cibodas, Kota Tangerang
            </address>
          </div>

          <div>
            <p className="font-display text-lg text-emas-muda">Tautan</p>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/devosi-jadwal" className="text-krem/80 underline underline-offset-4 hover:text-putih">
                  Jadwal Doa
                </Link>
              </li>
              <li>
                <Link href="/renungan" className="text-krem/80 underline underline-offset-4 hover:text-putih">
                  Renungan Harian
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-krem/80 underline underline-offset-4 hover:text-putih">
                  Galeri Kegiatan
                </Link>
              </li>
              <li>
                <a
                  href="https://santoagustinus.id"
                  className="text-krem/80 underline underline-offset-4 hover:text-putih"
                >
                  Situs Paroki Santo Agustinus
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-krem/20 pt-6 text-center text-base text-krem/60">
          <p>
            &copy; {new Date().getFullYear()} Komunitas Kerahiman Ilahi Paroki Karawaci &middot;{" "}
            <Link href="/admin" className="underline underline-offset-4 hover:text-krem">
              Masuk Pengurus
            </Link>
          </p>
          <p className="text-sm text-krem/50">
            Dibuat oleh{" "}
            <a
              href="https://www.linkedin.com/in/aljasonch/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-krem/70 underline decoration-emas-muda/50 underline-offset-4 transition-colors hover:text-emas-muda"
            >
              Alfonsus Jason Christian (@aljasonch)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
