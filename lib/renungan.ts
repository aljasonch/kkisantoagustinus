import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
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
 * Semua renungan berstatus published sampai hari ini, urut tanggal terbaru.
 * Butuh composite index (status ASC, tanggal DESC); lihat firestore.indexes.json.
 */
export async function ambilArsipRenungan(): Promise<Renungan[]> {
  if (!firebaseSiap()) return [];
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "renungan"),
        where("status", "==", "published"),
        where("tanggal", "<=", tanggalHariIni()),
        orderBy("tanggal", "desc")
      )
    );
    return snap.docs.map((d) => keRenungan(d.id, d.data()));
  } catch (err) {
    console.error("Gagal memuat arsip renungan:", err);
    return [];
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
