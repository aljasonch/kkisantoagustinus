/**
 * Upload gambar ke Cloudinary (mode signed), langsung dari browser.
 *
 * Alurnya dua langkah:
 * 1. Minta signature ke route handler `/api/cloudinary-signature`, di sana
 *    API secret dipakai di server, tidak pernah sampai ke browser.
 * 2. Upload berkas ke Cloudinary membawa api_key, timestamp, signature, dan
 *    parameter yang sama persis dengan yang ditandatangani.
 *
 * Firestore kemudian hanya menyimpan URL hasilnya.
 */

const namaCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** True bila konfigurasi sisi klien (cloud name) sudah diisi di .env. */
export function cloudinarySiap(): boolean {
  return Boolean(namaCloud);
}

type TandaTangan = {
  signature: string;
  apiKey: string;
  params: Record<string, string>;
};

async function mintaSignature(folder: string): Promise<TandaTangan> {
  const res = await fetch("/api/cloudinary-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!res.ok) {
    let pesan = "Tidak bisa meminta tanda tangan upload dari server.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) pesan = data.error;
    } catch {
      // badan respons bukan JSON, pakai pesan bawaan
    }
    throw new Error(pesan);
  }
  return (await res.json()) as TandaTangan;
}

/** Unggah satu berkas gambar; mengembalikan URL aman (https) hasilnya. */
export async function unggahFotoKeCloudinary(
  berkas: File,
  folder = "kki-karawaci/galeri"
): Promise<string> {
  if (!cloudinarySiap()) {
    throw new Error(
      "Cloudinary belum dikonfigurasi. Isi NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME di .env."
    );
  }

  const { signature, apiKey, params } = await mintaSignature(folder);

  const form = new FormData();
  form.append("file", berkas);
  form.append("api_key", apiKey);
  form.append("signature", signature);
  // Parameter yang ditandatangani (timestamp, folder, dst.) dikirim apa adanya.
  for (const [kunci, nilai] of Object.entries(params)) {
    form.append(kunci, nilai);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${namaCloud}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? "Signature Cloudinary ditolak. Periksa API key/secret di .env (dan algoritma signature di console)."
        : "Upload ke Cloudinary gagal. Coba lagi sebentar lagi."
    );
  }
  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("URL hasil upload tidak ditemukan. Coba unggah ulang.");
  }
  return data.secure_url;
}
