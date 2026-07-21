import { createHash } from "node:crypto";

/**
 * Tanda tangan (signature) untuk upload Cloudinary mode signed.
 *
 * API secret TIDAK boleh keluar ke browser, jadi signature dihitung di sini
 * (server). Parameter yang ditandatangani harus sama persis dengan parameter
 * yang dikirim saat upload, kecuali file, api_key, signature, resource_type.
 *
 * Algoritma bawaan Cloudinary: urutkan parameter A→Z, gabungkan
 * "kunci=nilai" dengan "&", tempel API secret di ujung, lalu SHA-1 hex.
 * (Bila akun memakai SHA-256, terlihat di Security settings console,
 * ganti "sha1" di bawah menjadi "sha256".)
 */

const FOLDER_BAWAAN = "kki-karawaci/galeri";
/** Folder yang boleh diminta klien — di luar ini, kembali ke bawaan. */
const FOLDER_DIIZINKAN = new Set([FOLDER_BAWAAN, "kki-karawaci/renungan"]);

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  // Server-only lebih aman; fallback ke nama lama yang sudah terlanjur diset.
  const secret =
    process.env.CLOUDINARY_API_SECRET ??
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

  if (!apiKey || !secret) {
    return Response.json(
      {
        error:
          "Cloudinary belum dikonfigurasi di server. Isi CLOUDINARY_API_SECRET dan NEXT_PUBLIC_CLOUDINARY_API_KEY di .env.",
      },
      { status: 500 }
    );
  }

  let folderDiminta = FOLDER_BAWAAN;
  try {
    const body = (await request.json()) as { folder?: unknown };
    if (typeof body.folder === "string" && body.folder) {
      folderDiminta = body.folder;
    }
  } catch {
    // Badan kosong/bukan JSON: pakai folder bawaan.
  }
  const folder = FOLDER_DIIZINKAN.has(folderDiminta)
    ? folderDiminta
    : FOLDER_BAWAAN;

  const timestamp = Math.round(Date.now() / 1000);

  // Parameter yang ikut ditandatangani, harus dikirim apa adanya saat upload.
  const params: Record<string, string> = {
    folder,
    timestamp: String(timestamp),
  };
  // Bila memakai signed upload preset, preset ikut ditandatangani.
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (preset) params.upload_preset = preset;

  const untukDitandatangani = Object.keys(params)
    .sort()
    .map((kunci) => `${kunci}=${params[kunci]}`)
    .join("&");

  const signature = createHash("sha1")
    .update(untukDitandatangani + secret)
    .digest("hex");

  return Response.json({ signature, apiKey, params });
}
