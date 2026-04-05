import { prisma } from "@/lib/prisma";

/** Bentuk kartu materi sama seperti respons GET /api/admin/materi (untuk LessonGrid). */
export async function getMateriListFormatted() {
  const materis = await prisma.materi.findMany({
    include: { steps: true },
    orderBy: { createdAt: "asc" },
  });

  return materis.map((m) => {
    const totalStep = m.steps.length;
    return {
      id: m.id,
      judul: m.judul,
      deskripsi: m.deskripsi,
      genre: m.genre,
      thumbnail: m.thumbnail,
      totalStep,
      tahap: 1,
      tipe: m.genre,
    };
  });
}
