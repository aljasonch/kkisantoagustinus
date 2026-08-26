import {
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { firebaseSiap, getDb } from "./firebase";

export type StatusRenungan = "draft" | "published";

export type Renungan = {
  /** Format YYYY-MM-DD, juga dipakai sebagai document ID */
  tanggal: string;
  judul?: string;
  ayat: string;
  referensiAyat: string;
  /** URL gambar di Cloudinary (opsional) */
  gambarUrl?: string;
  /** Kutipan dari buku harian Santa Faustina (opsional) */
  kutipanFaustina?: string;
  isiRenungan: string;
  doaPenutup?: string;
  /** Nama penulis/pengurus yang menyusun renungan ini (opsional). */
  penulis?: string;
  status: StatusRenungan;
};

export const POLA_TANGGAL = /^\d{4}-\d{2}-\d{2}$/;

/** Tanggal hari ini dalam zona waktu WIB (Asia/Jakarta), format YYYY-MM-DD. */
export function tanggalHariIni(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

/** "2026-07-20" → "Senin, 20 Juli 2026" */
export function formatTanggalPanjang(tanggal: string): string {
  const [tahun, bulan, hari] = tanggal.split("-").map(Number);
  const utc = new Date(Date.UTC(tahun, bulan - 1, hari, 12));
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utc);
}

/** Pecah isi renungan menjadi paragraf (dipisah baris kosong). */
export function keParagraf(teks: string): string[] {
  return teks
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function keRenungan(id: string, data: Record<string, unknown>): Renungan {
  return {
    tanggal: (data.tanggal as string) ?? id,
    judul: data.judul as string | undefined,
    ayat: (data.ayat as string) ?? "",
    referensiAyat: (data.referensiAyat as string) ?? "",
    gambarUrl: data.gambarUrl as string | undefined,
    kutipanFaustina: data.kutipanFaustina as string | undefined,
    isiRenungan: (data.isiRenungan as string) ?? "",
    doaPenutup: data.doaPenutup as string | undefined,
    penulis: data.penulis as string | undefined,
    status: (data.status as StatusRenungan) ?? "draft",
  };
}

/**
 * Pilih kursor arsip dari query string yang sudah dibaca page.
 */
export function keKursorArsip(searchParams: {
  sampai?: string | string[];
  sebelum?: string | string[];
}): { cursor: string | undefined; arah: "berikutnya" | "sebelumnya" } {
  const sebelum = typeof searchParams.sebelum === "string" && POLA_TANGGAL.test(searchParams.sebelum)
    ? searchParams.sebelum
    : undefined;
  if (sebelum) return { cursor: sebelum, arah: "sebelumnya" };

  const sampai = typeof searchParams.sampai === "string" && POLA_TANGGAL.test(searchParams.sampai)
    ? searchParams.sampai
    : undefined;
  return { cursor: sampai, arah: "berikutnya" };
}

/**
 * Halaman renungan berstatus published sampai hari ini, urut tanggal terbaru.
 * Butuh composite index (status ASC, tanggal DESC); lihat firestore.indexes.json.
 */
export async function ambilArsipRenungan(
  sampai?: string,
  arah: "berikutnya" | "sebelumnya" = "berikutnya",
  jumlah = 10
): Promise<{ items: Renungan[]; sisa: boolean; adaSebelum: boolean }> {
  if (!firebaseSiap()) return { items: [], sisa: false, adaSebelum: false };
  try {
    const dasar = query(
      collection(getDb(), "renungan"),
      where("status", "==", "published"),
      where("tanggal", "<=", tanggalHariIni()),
      orderBy("tanggal", "desc")
    );
    const dibatasi = sampai
      ? query(
          dasar,
          arah === "sebelumnya"
            ? endBefore(sampai)
            : startAfter(sampai),
          arah === "sebelumnya" ? limitToLast(jumlah + 1) : limit(jumlah + 1)
        )
      : query(dasar, limit(jumlah + 1));
    const snap = await getDocs(dibatasi);
    const punyaLebih = snap.docs.length > jumlah;
    const docs = arah === "sebelumnya" && punyaLebih ? snap.docs.slice(1) : snap.docs.slice(0, jumlah);
    const items = docs.map((d) => keRenungan(d.id, d.data()));
    return {
      items,
      sisa: arah === "sebelumnya" ? Boolean(sampai) : punyaLebih,
      adaSebelum: arah === "sebelumnya" ? punyaLebih : Boolean(sampai),
    };
  } catch (err) {
    console.error("Gagal memuat arsip renungan:", err);
    return { items: [], sisa: false, adaSebelum: false };
  }
}

/**
 * Renungan untuk Beranda: dokumen bertanggal hari ini (WIB) yang sudah
 * published; bila belum ada, pakai renungan published terakhir.
 */
export async function ambilRenunganHariIni(): Promise<Renungan | null> {
  if (!firebaseSiap()) return null;
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "renungan"),
        where("status", "==", "published"),
        where("tanggal", "<=", tanggalHariIni()),
        orderBy("tanggal", "desc"),
        limit(1)
      )
    );
    const dok = snap.docs[0];
    return dok ? keRenungan(dok.id, dok.data()) : null;
  } catch (err) {
    console.error("Gagal memuat renungan hari ini:", err);
    return null;
  }
}

/** Satu renungan published berdasarkan tanggal; null bila tidak ada/draft. */
export async function ambilRenungan(tanggal: string): Promise<Renungan | null> {
  if (!firebaseSiap() || !POLA_TANGGAL.test(tanggal)) return null;
  try {
    const snap = await getDoc(doc(getDb(), "renungan", tanggal));
    if (!snap.exists()) return null;
    const renungan = keRenungan(snap.id, snap.data());
    return renungan.status === "published" ? renungan : null;
  } catch {
    return null;
  }
}
