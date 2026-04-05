/** Normalisasi kolom Json `opsi` dari DB agar aman untuk UI (objek key/value). */
export function normalizeOpsi(opsi) {
  if (opsi == null) return {};
  if (typeof opsi === "string") {
    try {
      const parsed = JSON.parse(opsi);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof opsi === "object") return { ...opsi };
  return {};
}

/** Siapkan quiz + daftar soal untuk halaman pengerjaan (client). */
export function normalizeQuizForPlayer(quiz) {
  if (!quiz) return null;
  return {
    id: quiz.id,
    judul: quiz.judul,
    deskripsi: quiz.deskripsi ?? "",
    durasi: quiz.durasi ?? 30,
    passingScore: quiz.passingScore ?? 70,
    soal: (quiz.soal ?? []).map((s) => ({
      id: s.id,
      nomorSoal: s.nomorSoal,
      pertanyaan: s.pertanyaan,
      opsi: normalizeOpsi(s.opsi),
      jawabanBenar: s.jawabanBenar,
      score: Number(s.score) || 0,
    })),
  };
}
