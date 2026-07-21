"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/devosi-jadwal", label: "Devosi & Jadwal" },
  { href: "/renungan", label: "Renungan Harian" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [terbuka, setTerbuka] = useState(false);

  function aktif(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  // Kunci gulir halaman selama sidebar terbuka
  useEffect(() => {
    document.body.style.overflow = terbuka ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [terbuka]);

  // Tombol Esc menutup sidebar
  useEffect(() => {
    if (!terbuka) return;
    function tekanTombol(e: KeyboardEvent) {
      if (e.key === "Escape") setTerbuka(false);
    }
    window.addEventListener("keydown", tekanTombol);
    return () => window.removeEventListener("keydown", tekanTombol);
  }, [terbuka]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-krem-tua bg-putih shadow-[0_1px_12px_rgba(43,35,32,0.05)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link
          href="/"
          className="group flex items-center gap-3 leading-tight"
          onClick={() => setTerbuka(false)}
        >
          <Image
            src="/logo_kki.png"
            alt="Logo Komunitas Kerahiman Ilahi"
            width={716}
            height={919}
            className="h-12 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <span>
            <span className="block font-display text-2xl text-tinta group-hover:text-emas-tua">
              Kerahiman Ilahi
            </span>
            <span className="block text-sm tracking-wide text-abu">
              Komunitas &middot; Paroki Karawaci
            </span>
          </span>
        </Link>

        <nav aria-label="Menu utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={aktif(item.href) ? "page" : undefined}
                  className={`block rounded-md px-4 py-3 font-medium ${
                    aktif(item.href)
                      ? "text-emas-tua underline decoration-emas decoration-2 underline-offset-8"
                      : "text-tinta-muda hover:bg-krem hover:text-tinta"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="flex min-h-12 min-w-12 items-center justify-center rounded-md focus:border-2 border-emas-tua p-2 text-emas-tua transition-colors hover:bg-krem lg:hidden"
          aria-expanded={terbuka}
          aria-controls="menu-hp"
          aria-label={terbuka ? "Tutup menu" : "Buka menu"}
          onClick={() => setTerbuka((t) => !t)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`h-6 w-6 transition-transform duration-300 ${terbuka ? "rotate-90" : ""}`}
          >
            {terbuka ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>
    </header>

    <div
      className={`fixed inset-0 z-[60] lg:hidden ${terbuka ? "" : "pointer-events-none"}`}
      inert={!terbuka}
      aria-hidden={!terbuka}
    >
        <div
          onClick={() => setTerbuka(false)}
          className={`absolute inset-0 bg-tinta/50 transition-opacity duration-300 ${
            terbuka ? "opacity-100" : "opacity-0"
          }`}
        />

        <nav
          id="menu-hp"
          aria-label="Menu utama"
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-putih shadow-2xl transition-transform duration-300 ease-out ${
            terbuka ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end border-b border-krem-tua px-5 py-4">
            <button
              type="button"
              onClick={() => setTerbuka(false)}
              className="flex min-h-12 items-center gap-2 rounded-md px-4 py-2 font-medium text-emas-tua hover:bg-krem"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>

          <ul className="flex-1 overflow-y-auto px-3 py-4">
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={aktif(item.href) ? "page" : undefined}
                  onClick={() => setTerbuka(false)}
                  className={`mb-1 block rounded-lg px-4 py-4 text-xl font-medium transition-colors ${
                    aktif(item.href)
                      ? "bg-krem text-emas-tua"
                      : "text-tinta hover:bg-krem"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-krem-tua px-5 py-5 text-center">
            <p className="font-display text-lg text-emas-tua">
              &ldquo;Yesus, Engkau Andalanku&rdquo;
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
