import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function POST(req) {
  try {
    await requireRole("admin")

    const { materiId, judul, deskripsi, durasi, passingScore } = await req.json()

    if (!materiId || !judul) {
      return Response.json({
        error: "materiId dan judul wajib"
      }, { status: 400 })
    }

    const quiz = await prisma.quiz.create({
      data: {
        materiId,
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
    await requireRole("admin")

    const quizzes = await prisma.quiz.findMany({
      include: {
        materi: true,
        soal: true
      }
    })

    return Response.json({ quizzes })

  } catch {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }
}