import type { Metadata } from "next";
import { Marcellus, Alegreya_Sans } from "next/font/google";
import "./globals.css";
import { GulirKeAtas } from "@/components/gulir-ke-atas";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const deskripsiSitus =
  "Komunitas Kerahiman Ilahi (KKI) Paroki Karawaci, Gereja Santo Agustinus, Tangerang. Jadwal doa Koronka, renungan harian, dan devosi Kerahiman Ilahi. Yesus, Engkau Andalanku.";

// Dipakai Next.js untuk mengubah URL relatif (mis. /hero.jpg) menjadi absolut
// pada tag Open Graph. Di Vercel otomatis memakai URL produksi bila variabel
// NEXT_PUBLIC_SITE_URL belum diisi.
const urlSitus =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(urlSitus),
  title: {
    default: "Komunitas Kerahiman Ilahi | Paroki Karawaci",
    template: "%s | KKI Paroki Karawaci",
  },
  description: deskripsiSitus,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Komunitas Kerahiman Ilahi Paroki Karawaci",
    title: "Komunitas Kerahiman Ilahi | Paroki Karawaci",
    description: deskripsiSitus,
    images: [{ url: "/hero.jpg", alt: "Komunitas Kerahiman Ilahi Paroki Karawaci" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Komunitas Kerahiman Ilahi | Paroki Karawaci",
    description: deskripsiSitus,
    images: ["/hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${marcellus.variable} ${alegreyaSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <GulirKeAtas />
        <SiteHeader />
        <main id="konten" className="flex-1 scroll-mt-24">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
