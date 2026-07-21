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

export const metadata: Metadata = {
  title: {
    default: "Komunitas Kerahiman Ilahi | Paroki Karawaci",
    template: "%s | KKI Paroki Karawaci",
  },
  description:
    "Komunitas Kerahiman Ilahi (KKI) Paroki Karawaci, Gereja Santo Agustinus, Tangerang. Jadwal doa Koronka, renungan harian, dan devosi Kerahiman Ilahi. Yesus, Engkau Andalanku.",
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
