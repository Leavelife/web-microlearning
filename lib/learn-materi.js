import { prisma } from "@/lib/prisma";

const stepInclude = {
  quiz: { select: { id: true, judul: true } },
  contents: {
    orderBy: { urutan: "asc" },
  },
};

export async function getMateriForLearn(materiId) {
  return prisma.materi.findUnique({
    where: { id: materiId },
    include: {
      steps: {
        orderBy: { urutan: "asc" },
        include: stepInclude,
      },
    },
  });
}

/**
 * Pastikan baris ProgressMateri ada untuk user (frontier = urutan step pertama).
 */
export async function ensureProgressMateri(userId, materiId, steps) {
  if (!steps?.length) return null;

  const existing = await prisma.progressMateri.findFirst({
    where: { userId, materiId },
  });
  if (existing) return existing;

  const firstUrutan = steps[0].urutan;
  return prisma.progressMateri.create({
    data: {
      userId,
      materiId,
      stepSekarang: firstUrutan,
      selesai: false,
    },
  });
}
