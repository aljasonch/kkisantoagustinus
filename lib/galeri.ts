import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firebaseSiap, getDb } from "./firebase";

export type StatusGaleri = "draft" | "published";

export type FotoGaleri = {
  id: string;
  /** URL foto sampul (foto pertama dalam item) */
  url: string;
  /** Semua URL foto dalam item ini: satu item bisa berisi banyak foto */
  fotoUrls: string[];
  caption: string;
  /** Format YYYY-MM-DD: tanggal kegiatan, dipakai untuk mengurutkan */
  tanggal: string;
  status: StatusGaleri;
};

function keFotoGaleri(id: string, data: Record<string, unknown>): FotoGaleri {
  const urlTunggal = (data.url as string) ?? "";
  // Dokumen lama hanya punya `url` (satu foto); dokumen baru punya `fotoUrls`.
  const fotoUrls =
    Array.isArray(data.fotoUrls) && data.fotoUrls.length > 0
      ? (data.fotoUrls as string[])
      : urlTunggal
        ? [urlTunggal]
        : [];
  return {
    id,
    url: urlTunggal || fotoUrls[0] || "",
    fotoUrls,
    caption: (data.caption as string) ?? "",
    tanggal: (data.tanggal as string) ?? "",
    status: (data.status as StatusGaleri) ?? "published",
  };
}

/**
 * Semua foto galeri yang sudah tayang, urut tanggal kegiatan terbaru.
 * Butuh composite index (status ASC, tanggal DESC); lihat firestore.indexes.json.
 */
export async function ambilGaleriPublik(): Promise<FotoGaleri[]> {
  if (!firebaseSiap()) return [];
  try {
    const snap = await getDocs(
      query(
        collection(getDb(), "galeri"),
        where("status", "==", "published"),
        orderBy("tanggal", "desc")
      )
    );
    return snap.docs.map((d) => keFotoGaleri(d.id, d.data()));
  } catch (err) {
    console.error("Gagal memuat galeri:", err);
    return [];
  }
}
