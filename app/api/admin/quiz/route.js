import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function POST(req) {
  try {
    await requireRole("admin")

    const { materiStepId, judul, deskripsi, durasi, passingScore } = await req.json()

    if (!materiStepId || !judul) {
      return Response.json({
        error: "materiStepId dan judul wajib"
      }, { status: 400 })
    }

    const quiz = await prisma.quiz.create({
      data: {
        materiStepId,
        judul,
        deskripsi: deskripsi || null,
        durasi: durasi ? Number(durasi) : 30,
        passingScore: passingScore ? Number(passingScore) : 70
      }
    })

    return Response.json({
      message: "Quiz berhasil dibuat",
      quiz
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        materiStep: {
          include: {
            materi: true,
          },
        },
        _count: {
          select: {
            soal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ quizzes });

  } catch (err) {
    return Response.json(
      { error: "Error fetch quiz" },
      { status: 500 }
    );
  }
}