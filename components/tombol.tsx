import Link from "next/link";

/**
 * Satu-satunya gaya tombol di situs publik: besar, jelas, emas tua.
 * Aksi sekunder memakai tautan teks bergaris bawah, bukan tombol outline.
 */
export function TautanTombol({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-13 items-center justify-center rounded-lg bg-emas-tua px-8 py-3 text-lg font-medium text-putih hover:bg-tinta"
    >
      {children}
    </Link>
  );
}

export function TautanTeks({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-13 items-center text-lg font-medium text-emas-tua underline decoration-2 underline-offset-4 hover:text-tinta"
    >
      {children}
    </Link>
  );
}
