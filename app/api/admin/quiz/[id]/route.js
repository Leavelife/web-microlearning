import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"
import { revalidatePath } from "next/cache"

export async function PUT(req, { params }) {
  try {
    await requireRole("admin")

    const { id } = await params
    const { materiStepId, judul, deskripsi, durasi, passingScore } = await req.json()

    const updateData = {
      judul
    };

    // Only update optional fields if provided
    if (materiStepId) updateData.materiStepId = materiStepId;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi;
    if (durasi !== undefined) updateData.durasi = Number(durasi);
    if (passingScore !== undefined) updateData.passingScore = Number(passingScore);

    const quiz = await prisma.quiz.update({
      where: { id },
      data: updateData
    })

    revalidatePath("/quiz");

    return Response.json({
      message: "Quiz berhasil diupdate",
      quiz
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error update" }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireRole("admin")

    const { id } = await params

    await prisma.$transaction([
      prisma.hasilQuizUser.deleteMany({ where: { quizId: id } }),
      prisma.soalQuiz.deleteMany({ where: { quizId: id } }),
      prisma.quiz.delete({ where: { id } }),
    ])

    revalidatePath("/quiz");

    return Response.json({
      message: "Quiz berhasil dihapus"
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error delete" }, { status: 500 })
  }
}

export async function GET(req, { params }) {

  const { id } = await params

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      soal: true,
    },
  });

  return Response.json({ quiz });
}