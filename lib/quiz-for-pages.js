import { prisma } from "@/lib/prisma";
import { normalizeQuizForPlayer } from "@/lib/quiz-normalize";

const listInclude = {
  materiStep: { include: { materi: true } },
  _count: { select: { soal: true } },
};

/** Daftar quiz untuk halaman browse (/quiz). */
export async function getQuizListForBrowse() {
  return prisma.quiz.findMany({
    include: listInclude,
    orderBy: { judul: "asc" },
  });
}

/** Quiz pada satu step materi (/step/[id]/quiz). */
export async function getQuizzesForStep(materiStepId) {
  return prisma.quiz.findMany({
    where: { materiStepId },
    include: listInclude,
    orderBy: { judul: "asc" },
  });
}

/** Satu quiz lengkap dengan soal terurut untuk dikerjakan. */
export async function getQuizForPlay(quizId) {
  const raw = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      soal: { orderBy: { nomorSoal: "asc" } },
    },
  });
  return normalizeQuizForPlayer(raw);
}
