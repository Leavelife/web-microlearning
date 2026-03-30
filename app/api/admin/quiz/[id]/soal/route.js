import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function POST(req, { params }) {
  try {
    await requireRole("admin")

    const { id: quizId } = await params
    const { pertanyaan, opsi, jawabanBenar, score } = await req.json()

    if (!pertanyaan || !opsi || !jawabanBenar) {
      return Response.json({
        error: "Data soal tidak lengkap"
      }, { status: 400 })
    }

    const soal = await prisma.soalQuiz.create({
      data: {
        quizId,
        pertanyaan,
        opsi, // JSON
        jawabanBenar,
        score: Number(score) || 10
      }
    })

    return Response.json({
      message: "Soal berhasil ditambahkan",
      soal
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}