import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function GET(req) {
  try {
    await requireRole("admin")

    const { searchParams } = new URL(req.url)
    const quizId = searchParams.get("quizId")

    if (!quizId) {
      return Response.json({ error: "quizId required" }, { status: 400 })
    }

    const soal = await prisma.soalQuiz.findMany({
      where: { quizId },
      orderBy: { nomorSoal: "asc" }
    })

    return Response.json({
      soal
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error fetch soal" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await requireRole("admin")

    const { quizId, pertanyaan, opsi, jawabanBenar, score, nomorSoal } = await req.json()

    // Get the next nomorSoal if not provided
    let finalNomorSoal = nomorSoal && !isNaN(Number(nomorSoal)) ? Number(nomorSoal) : 0;
    if (!nomorSoal || isNaN(Number(nomorSoal))) {
      const existingSoal = await prisma.soalQuiz.findMany({
        where: { quizId },
        orderBy: { nomorSoal: 'desc' },
        take: 1
      });
      finalNomorSoal = existingSoal.length > 0 ? existingSoal[0].nomorSoal + 1 : 1;
    }

    const soal = await prisma.soalQuiz.create({
      data: {
        quizId,
        nomorSoal: finalNomorSoal,
        pertanyaan,
        opsi,
        jawabanBenar,
        score: Number(score),
      }
    })

    return Response.json({
      message: "Soal berhasil dibuat",
      soal
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error create soal" }, { status: 500 })
  }
}