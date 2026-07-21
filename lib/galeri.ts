import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firebaseSiap, getDb } from "./firebase";

export type StatusGaleri = "draft" | "published";

export type FotoGaleri = {
  id: string;
  /** URL gambar di Cloudinary */
  url: string;
  caption: string;
  /** Format YYYY-MM-DD: tanggal kegiatan, dipakai untuk mengurutkan */
  tanggal: string;
  status: StatusGaleri;
};

function keFotoGaleri(id: string, data: Record<string, unknown>): FotoGaleri {
  return {
    id,
    url: (data.url as string) ?? "",
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
