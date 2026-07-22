"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Renungan } from "@/lib/renungan";
import { formatTanggalPanjang, keParagraf } from "@/lib/renungan";

interface TombolShareRenunganProps {
  renungan: Renungan;
  className?: string;
  label?: string;
  variasi?: "utama" | "sekunder" | "minimalis";
}

type FormatRasio = "persegi" | "story";

export function TombolShareRenungan({
  renungan,
  className = "",
  label = "Bagikan Renungan",
  variasi = "utama",
}: TombolShareRenunganProps) {
  const [modalBuka, setModalBuka] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalBuka(true)}
        className={
          className ||
          (variasi === "utama"
            ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emas-tua px-5 py-2.5 font-medium text-putih shadow-sm transition-colors hover:bg-tinta focus-visible:outline-2"
            : variasi === "sekunder"
            ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-emas-tua bg-putih px-4 py-2 font-medium text-emas-tua shadow-sm transition-colors hover:bg-krem focus-visible:outline-2"
            : "inline-flex items-center gap-1.5 font-medium text-emas-tua hover:text-tinta hover:underline")
        }
        aria-label={`Bagikan renungan ${renungan.tanggal}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>{label}</span>
      </button>

      {modalBuka && (
        <ModalShareRenungan
          renungan={renungan}
          onTutup={() => setModalBuka(false)}
        />
      )}
    </>
  );
}

function ModalShareRenungan({
  renungan,
  onTutup,
}: {
  renungan: Renungan;
  onTutup: () => void;
}) {
  const [rasio, setRasio] = useState<FormatRasio>("persegi");
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [statusTersalin, setStatusTersalin] = useState<string | null>(null);
  const [bisaBagikanWeb, setBisaBagikanWeb] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const tanggalPanjang = formatTanggalPanjang(renungan.tanggal);
  const judulRenungan = renungan.judul || renungan.referensiAyat || "Renungan Harian";
  const paragrafUtama = keParagraf(renungan.isiRenungan)[0] || "";

  // Cek apakah navigator.share mendukung pengiriman berkas
  useEffect(() => {
    if (typeof navigator !== "undefined" && !!navigator.share) {
      setBisaBagikanWeb(true);
    }
  }, []);

  // Kunci scroll saat modal terbuka & tutup via ESC
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onTutup();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onTutup]);

  // Fungsi menggambar ke HTML5 Canvas untuk ekspor gambar beresolusi tinggi
  const buatGambarCanvas = useCallback(async (): Promise<Blob | null> => {
    const isStory = rasio === "story";
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background Krem
    ctx.fillStyle = "#FAF6EE";
    ctx.fillRect(0, 0, width, height);

    // Bingkai Ganda Emas
    const pad = 40;
    ctx.strokeStyle = "#E6D9B4";
    ctx.lineWidth = 6;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    ctx.strokeStyle = "#8A6D1F";
    ctx.lineWidth = 3;
    ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2);

    // Muat Logo KKI
    const logo = new window.Image();
    logo.crossOrigin = "anonymous";
    await new Promise<void>((resolve) => {
      logo.onload = () => resolve();
      logo.onerror = () => resolve();
      logo.src = "/logo_kki.png";
    });

    let currentY = isStory ? 280 : 120;

    // Gambar Logo di tengah atas
    if (logo.complete && logo.naturalWidth > 0) {
      const logoH = 160;
      const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
      ctx.drawImage(logo, (width - logoW) / 2, currentY, logoW, logoH);
      currentY += logoH + (isStory ? 60 : 30);
    } else {
      currentY += isStory ? 80 : 40;
    }

    // Teks Komunitas Header
    ctx.textAlign = "center";
    ctx.fillStyle = "#8A6D1F";
    ctx.font = "bold 34px serif";
    ctx.fillText("KOMUNITAS KERAHIMAN ILAHI", width / 2, currentY);
    currentY += isStory ? 60 : 40;

    ctx.fillStyle = "#5C534E";
    ctx.font = "26px sans-serif";
    ctx.fillText("Paroki Karawaci · Gereja Santo Agustinus", width / 2, currentY);
    currentY += isStory ? 80 : 50;

    // Garis Pemisah Emas
    ctx.strokeStyle = "#B08D2E";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 160, currentY);
    ctx.lineTo(width / 2 + 160, currentY);
    ctx.stroke();
    currentY += isStory ? 90 : 60;

    // Tanggal
    ctx.fillStyle = "#5C534E";
    ctx.font = "italic 32px sans-serif";
    ctx.fillText(tanggalPanjang, width / 2, currentY);
    currentY += isStory ? 90 : 60;

    // Helper Wrap Text
    const wrapText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
      font: string,
      fillStyle: string
    ) => {
      ctx.font = font;
      ctx.fillStyle = fillStyle;
      const words = text.split(" ");
      let line = "";
      let lines: string[] = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * lineHeight);
      }
      return lines.length * lineHeight;
    };

    // Judul Renungan
    const maxTextWidth = width - 160;
    const heightJudul = wrapText(
      judulRenungan,
      width / 2,
      currentY,
      maxTextWidth,
      68,
      "bold 56px serif",
      "#2B2320"
    );
    currentY += heightJudul + (isStory ? 30 : 20);

    // Kutipan Ayat / Faustina / Paragraf utama
    if (renungan.ayat) {
      // Box Kutipan Ayat
      ctx.fillStyle = "#F3ECDD";
      const boxMargin = 80;
      const boxW = width - boxMargin * 2;
      
      // Ukur tinggi teks ayat lebih dulu
      const textAyat = `“${renungan.ayat}”`;
      ctx.font = "italic 40px serif";
      const words = textAyat.split(" ");
      let tempLine = "";
      let lineCount = 1;
      for (let w of words) {
        if (ctx.measureText(tempLine + w + " ").width > boxW - 100) {
          lineCount++;
          tempLine = w + " ";
        } else {
          tempLine += w + " ";
        }
      }
      const ayatTextHeight = lineCount * 56;
      const boxH = ayatTextHeight + (renungan.referensiAyat ? 100 : 70);

      // Gambar background box
      ctx.beginPath();
      ctx.roundRect((width - boxW) / 2, currentY, boxW, boxH, 20);
      ctx.fill();

      // Gambar teks ayat di dalam box
      let boxTextY = currentY + 65;
      wrapText(
        textAyat,
        width / 2,
        boxTextY,
        boxW - 100,
        56,
        "italic 40px serif",
        "#2B2320"
      );

      if (renungan.referensiAyat) {
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#9E3B33";
        ctx.fillText(renungan.referensiAyat, width / 2, boxTextY + ayatTextHeight + 5);
      }

      currentY += boxH + 40;
    } else if (renungan.kutipanFaustina) {
      // Box Faustina
      ctx.fillStyle = "#2B2320";
      const boxMargin = 80;
      const boxW = width - boxMargin * 2;
      const textKutipan = `“${renungan.kutipanFaustina}”`;
      
      ctx.font = "36px serif";
      const words = textKutipan.split(" ");
      let tempLine = "";
      let lineCount = 1;
      for (let w of words) {
        if (ctx.measureText(tempLine + w + " ").width > boxW - 100) {
          lineCount++;
          tempLine = w + " ";
        } else {
          tempLine += w + " ";
        }
      }
      const textH = lineCount * 52;
      const boxH = textH + 110;

      ctx.beginPath();
      ctx.roundRect((width - boxW) / 2, currentY, boxW, boxH, 20);
      ctx.fill();

      let boxTextY = currentY + 65;
      wrapText(
        textKutipan,
        width / 2,
        boxTextY,
        boxW - 100,
        52,
        "36px serif",
        "#FAF6EE"
      );

      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#E6D9B4";
      ctx.fillText("BUKU HARIAN SANTA FAUSTINA", width / 2, boxTextY + textH + 10);

      currentY += boxH + 40;
    } else if (paragrafUtama) {
      // Ringkasan paragraf jika tidak ada ayat/kutipan
      const dipotong = paragrafUtama.length > 250 ? paragrafUtama.slice(0, 250) + "…" : paragrafUtama;
      const heightPar = wrapText(
        dipotong,
        width / 2,
        currentY,
        maxTextWidth,
        48,
        "32px sans-serif",
        "#4A413C"
      );
      currentY += heightPar + 40;
    }

    // Footer Semboyan (di bagian paling bawah canvas)
    const footerY = height - (isStory ? 200 : 120);
    ctx.strokeStyle = "#E6D9B4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 220, footerY - 50);
    ctx.lineTo(width / 2 + 220, footerY - 50);
    ctx.stroke();

    ctx.fillStyle = "#9E3B33";
    ctx.font = "bold italic 38px serif";
    ctx.fillText("“Yesus, Engkau Andalanku”", width / 2, footerY);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
    });
  }, [rasio, renungan, tanggalPanjang, judulRenungan, paragrafUtama]);

  // Aksi Unduh Gambar
  async function unduhGambar() {
    setSedangMemproses(true);
    try {
      const blob = await buatGambarCanvas();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `renungan-kki-${renungan.tanggal}-${rasio}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      tampilPesan("Gambar berhasil diunduh!");
    } catch (e) {
      console.error(e);
      tampilPesan("Gagal mengunduh gambar.");
    } finally {
      setSedangMemproses(false);
    }
  }

  // Aksi Web Share API
  async function bagikanGambarWeb() {
    setSedangMemproses(true);
    try {
      const blob = await buatGambarCanvas();
      if (!blob) return;
      const file = new File([blob], `renungan-kki-${renungan.tanggal}.png`, {
        type: "image/png",
      });

      const url = window.location.href;
      const shareData: ShareData = {
        title: `Renungan ${tanggalPanjang}`,
        text: `Renungan Harian KKI Paroki Karawaci: "${judulRenungan}"`,
        url: url,
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          ...shareData,
          files: [file],
        });
      } else {
        await navigator.share(shareData);
      }
      tampilPesan("Berhasil dibagikan!");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setSedangMemproses(false);
    }
  }

  // Aksi Bagikan via WhatsApp
  function bagikanWhatsApp() {
    const url = window.location.href;
    let teks = `*Renungan Harian KKI Paroki Karawaci*\n`;
    teks += `📅 *${tanggalPanjang}*\n`;
    teks += `📖 *${judulRenungan}*\n\n`;

    if (renungan.ayat) {
      teks += `_"${renungan.ayat}"_\n`;
      if (renungan.referensiAyat) teks += `— *${renungan.referensiAyat}*\n\n`;
    }

    if (paragrafUtama) {
      teks += `${paragrafUtama.slice(0, 300)}...\n\n`;
    }

    teks += `*Yesus, Engkau Andalanku*\n`;
    teks += `Baca selengkapnya di: ${url}`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(teks)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  // Aksi Salin Tautan
  async function salinTautan() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      tampilPesan("Tautan berhasil disalin!");
    } catch {
      tampilPesan("Gagal menyalin tautan.");
    }
  }

  // Aksi Salin Teks Renungan
  async function salinTeks() {
    let teks = `Renungan Harian Komunitas Kerahiman Ilahi Paroki Karawaci\n`;
    teks += `${tanggalPanjang}\n\n`;
    teks += `${judulRenungan}\n\n`;
    if (renungan.ayat) {
      teks += `"${renungan.ayat}" (${renungan.referensiAyat})\n\n`;
    }
    teks += `${renungan.isiRenungan}\n\n`;
    if (renungan.doaPenutup) {
      teks += `Doa Penutup:\n${renungan.doaPenutup}\nAmin.\n\n`;
    }
    teks += `"Yesus, Engkau Andalanku"\n${window.location.href}`;

    try {
      await navigator.clipboard.writeText(teks);
      tampilPesan("Teks renungan berhasil disalin!");
    } catch {
      tampilPesan("Gagal menyalin teks.");
    }
  }

  function tampilPesan(msg: string) {
    setStatusTersalin(msg);
    setTimeout(() => setStatusTersalin(null), 3000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-tinta/60 p-4 backdrop-blur-xs">
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-krem-tua bg-putih shadow-2xl transition-all">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-krem-tua px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-7 shrink-0">
              <Image
                src="/logo_kki.png"
                alt="Logo KKI"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-tinta">
                Bagikan Renungan
              </h3>
              <p className="text-xs text-abu">
                Komunitas Kerahiman Ilahi Paroki Karawaci
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onTutup}
            className="rounded-lg p-2 text-abu hover:bg-krem hover:text-tinta focus:outline-none"
            aria-label="Tutup modal"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Isi Modal */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {/* Pilihan Rasio Pratinjau */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-tinta-muda">
              Format Gambar Kartu:
            </span>
            <div className="inline-flex rounded-lg border border-krem-tua bg-krem p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setRasio("persegi")}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  rasio === "persegi"
                    ? "bg-putih text-emas-tua shadow-xs font-semibold"
                    : "text-abu hover:text-tinta"
                }`}
              >
                Persegi (1:1)
              </button>
              <button
                type="button"
                onClick={() => setRasio("story")}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  rasio === "story"
                    ? "bg-putih text-emas-tua shadow-xs font-semibold"
                    : "text-abu hover:text-tinta"
                }`}
              >
                Story (9:16)
              </button>
            </div>
          </div>

          {/* Pratinjau Kartu Visual (HTML element dengan Logo KKI) */}
          <div className="flex justify-center bg-tinta/5 p-4 rounded-xl">
            <div
              className={`relative flex flex-col justify-between rounded-xl border-2 border-emas-muda bg-krem p-6 text-center shadow-md transition-all ${
                rasio === "story"
                  ? "w-[300px] min-h-[500px]"
                  : "w-[340px] aspect-square"
              }`}
            >
              {/* Bingkai Dalam */}
              <div className="pointer-events-none absolute inset-2 rounded-lg border border-emas-tua/40" />

              {/* Logo & Header */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2 h-14 w-12">
                  <Image
                    src="/logo_kki.png"
                    alt="Logo KKI"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <p className="font-display text-xs font-bold tracking-wider text-emas-tua uppercase">
                  Komunitas Kerahiman Ilahi
                </p>
                <p className="text-[10px] text-abu">
                  Paroki Karawaci · Gereja Santo Agustinus
                </p>
                <div className="my-2 h-[1px] w-24 bg-emas" />
                <p className="text-xs italic text-abu">{tanggalPanjang}</p>
              </div>

              {/* Teks Judul & Ayat */}
              <div className="my-auto py-2">
                <h4 className="font-display text-base font-bold text-tinta line-clamp-2">
                  {judulRenungan}
                </h4>
                {renungan.ayat && (
                  <div className="mt-2 rounded-lg bg-krem-tua/70 p-3 text-xs italic text-tinta-muda">
                    &ldquo;{renungan.ayat}&rdquo;
                    {renungan.referensiAyat && (
                      <p className="mt-1 font-sans text-[11px] font-semibold text-merah not-italic">
                        {renungan.referensiAyat}
                      </p>
                    )}
                  </div>
                )}
                {!renungan.ayat && renungan.kutipanFaustina && (
                  <div className="mt-2 rounded-lg bg-tinta p-3 text-xs text-krem">
                    &ldquo;{renungan.kutipanFaustina}&rdquo;
                    <p className="mt-1 text-[10px] uppercase text-emas-muda">
                      Buku Harian Santa Faustina
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Semboyan */}
              <div className="pt-2 border-t border-emas-muda/60">
                <p className="font-display text-xs font-bold italic text-merah">
                  &ldquo;Yesus, Engkau Andalanku&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Toast Notification Status */}
          {statusTersalin && (
            <div className="mt-3 rounded-lg bg-emas-tua p-2.5 text-center text-xs font-medium text-putih animate-fade-in">
              {statusTersalin}
            </div>
          )}

          {/* Opsi Tindakan Share */}
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={unduhGambar}
              disabled={sedangMemproses}
              className="flex items-center justify-center gap-2 rounded-xl bg-emas-tua px-4 py-3 font-medium text-putih shadow-sm hover:bg-tinta focus:outline-none disabled:opacity-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{sedangMemproses ? "Membuat..." : "Unduh Gambar (.png)"}</span>
            </button>

            {bisaBagikanWeb && (
              <button
                type="button"
                onClick={bagikanGambarWeb}
                disabled={sedangMemproses}
                className="flex items-center justify-center gap-2 rounded-xl bg-merah px-4 py-3 font-medium text-putih shadow-sm hover:opacity-90 focus:outline-none disabled:opacity-50"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Bagikan Gambar / Web</span>
              </button>
            )}

            <button
              type="button"
              onClick={bagikanWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-3 font-medium text-emerald-800 hover:bg-emerald-100 focus:outline-none"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-emerald-600"
              >
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.761.459 3.479 1.332 5.001l-1.417 5.176 5.297-1.389c1.474.803 3.137 1.226 4.773 1.227h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.667-1.037-5.176-2.922-7.062-1.885-1.885-4.394-2.922-7.066-2.922zm5.823 14.161c-.247.692-1.437 1.325-1.986 1.389-.517.06-1.189.096-3.418-.83-2.846-1.183-4.667-4.083-4.81-4.272-.142-.189-1.151-1.533-1.151-2.924 0-1.391.73-2.072.987-2.352.257-.281.56-.351.747-.351.188 0 .375.002.537.009.172.007.404-.065.632.483.235.568.795 1.942.865 2.083.07.142.117.308.023.497-.094.189-.141.307-.282.473-.142.166-.299.371-.427.498-.142.142-.29.297-.125.58.166.282.735 1.212 1.577 1.961 1.084.965 1.998 1.265 2.28 1.407.282.142.447.119.611-.071.165-.189.704-.82.892-1.102.188-.282.376-.235.633-.142.257.094 1.642.774 1.923.914.282.142.47.212.54.33.07.118.07.683-.177 1.375z" />
              </svg>
              <span>Bagikan ke WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={salinTautan}
              className="flex items-center justify-center gap-2 rounded-xl border border-krem-tua bg-krem px-4 py-3 font-medium text-tinta hover:bg-krem-tua focus:outline-none"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Salin Tautan</span>
            </button>

            <button
              type="button"
              onClick={salinTeks}
              className="flex items-center justify-center gap-2 rounded-xl border border-krem-tua bg-krem px-4 py-3 font-medium text-tinta hover:bg-krem-tua focus:outline-none sm:col-span-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Salin Teks Renungan Lengkap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
