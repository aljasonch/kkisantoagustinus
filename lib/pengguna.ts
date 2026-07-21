import { deleteApp, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firebaseSiap, getDb, getFirebaseConfig } from "./firebase";

/** Peran akun pengurus: admin boleh mengelola akun, user hanya menulis renungan. */
export type Peran = "admin" | "user";

/** Profil pengurus yang disimpan di koleksi `pengguna` (ID dokumen = UID Auth). */
export type Pengguna = {
  uid: string;
  email: string;
  /** Nama tampilan yang dipakai sebagai penulis renungan. */
  nama: string;
  role: Peran;
};

function kePengguna(uid: string, data: Record<string, unknown>): Pengguna {
  return {
    uid,
    email: (data.email as string) ?? "",
    nama: (data.nama as string) ?? "",
    role: (data.role as Peran) === "admin" ? "admin" : "user",
  };
}

/** Ambil profil pengurus berdasarkan UID; null bila belum punya profil. */
export async function ambilProfil(uid: string): Promise<Pengguna | null> {
  if (!firebaseSiap()) return null;
  try {
    const snap = await getDoc(doc(getDb(), "pengguna", uid));
    if (!snap.exists()) return null;
    return kePengguna(uid, snap.data());
  } catch (err) {
    console.error("Gagal memuat profil pengguna:", err);
    return null;
  }
}

/**
 * Simpan nama tampilan pengurus (dipakai saat pertama kali login atau ketika
 * mengubah nama). Peran bawaan "user"; admin pertama disiapkan manual lewat
 * Firestore console (lihat docs/setup-firebase.md).
 */
export async function simpanNamaProfil(
  uid: string,
  email: string,
  nama: string,
  role: Peran = "user"
): Promise<void> {
  await setDoc(
    doc(getDb(), "pengguna", uid),
    {
      uid,
      email,
      nama: nama.trim(),
      role,
      diperbaruiPada: serverTimestamp(),
    },
    { merge: true }
  );
}

/** Semua profil pengurus, urut nama. Hanya dipanggil oleh admin. */
export async function ambilSemuaPengguna(): Promise<Pengguna[]> {
  if (!firebaseSiap()) return [];
  try {
    const snap = await getDocs(collection(getDb(), "pengguna"));
    return snap.docs
      .map((d) => kePengguna(d.id, d.data()))
      .sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  } catch (err) {
    console.error("Gagal memuat daftar pengguna:", err);
    return [];
  }
}

/** Ubah peran sebuah akun (khusus admin). */
export async function ubahPeran(uid: string, role: Peran): Promise<void> {
  await updateDoc(doc(getDb(), "pengguna", uid), {
    role,
    diperbaruiPada: serverTimestamp(),
  });
}

export type InputAkunBaru = {
  email: string;
  sandi: string;
  nama: string;
  role: Peran;
};

/**
 * Daftarkan akun baru (khusus admin). Memakai instance app Firebase sekunder
 * supaya admin yang sedang login tidak ikut keluar/masuk ke akun baru.
 * Setelah akun Auth terbuat, profilnya langsung ditulis ke koleksi `pengguna`.
 */
export async function daftarAkunBaru(input: InputAkunBaru): Promise<Pengguna> {
  const namaApp = `sekunder-${Date.now()}`;
  const appSekunder = initializeApp(getFirebaseConfig(), namaApp);
  try {
    const authSekunder = getAuth(appSekunder);
    const kredensial = await createUserWithEmailAndPassword(
      authSekunder,
      input.email.trim(),
      input.sandi
    );
    const uid = kredensial.user.uid;
    const profil: Pengguna = {
      uid,
      email: input.email.trim(),
      nama: input.nama.trim(),
      role: input.role,
    };
    await setDoc(doc(getDb(), "pengguna", uid), {
      ...profil,
      dibuatPada: serverTimestamp(),
    });
    await signOut(authSekunder);
    return profil;
  } finally {
    await deleteApp(appSekunder);
  }
}

/** Terjemahkan kode galat pendaftaran akun menjadi pesan ramah. */
export function pesanGalatAkun(kode: string): string {
  switch (kode) {
    case "auth/email-already-in-use":
      return "Email ini sudah terdaftar. Pakai email lain atau ubah akun yang ada.";
    case "auth/invalid-email":
      return "Alamat email tidak valid. Periksa kembali penulisannya.";
    case "auth/weak-password":
      return "Kata sandi terlalu lemah. Gunakan minimal 6 karakter.";
    case "auth/operation-not-allowed":
      return "Metode email/kata sandi belum diaktifkan di Firebase console.";
    default:
      return "Akun gagal dibuat. Periksa koneksi internet, lalu coba lagi.";
  }
}
