import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// ambil user dari cookie (sama kayak route profile kamu)
async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) throw new Error("Unauthorized")

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  return decoded
}

const normalize = (val) => Math.min(100, Math.max(0, val))

const avg = (arr) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

export async function GET() {
  try {
    const user = await getUser()

    // ========================
    // Ambil data
    // ========================

    const quizResults = await prisma.hasilQuizUser.findMany({
      where: { userId: user.id },
      include: {
        quiz: {
          include: {
            materiStep: {
              include: {
                materi: true
              }
            }
          }
        }
      }
    })

    const simulasi = await prisma.hasilSimulasi.findMany({
      where: { userId: user.id }
    })

    const totalMateri = await prisma.materi.count()

    const selesaiMateri = await prisma.progressMateri.count({
      where: {
        userId: user.id,
        selesai: true
      }
    })

    // ========================
    // Hitung stat
    // ========================

    const networkingScores = quizResults
      .filter(q => q.quiz?.materiStep?.materi?.genre === "jaringan")
      .map(q => q.score)

    const hardwareScores = quizResults
      .filter(q => q.quiz?.materiStep?.materi?.genre === "hardware")
      .map(q => q.score)

    const allQuizScores = quizResults.map(q => q.score)

    const simulasiScores = simulasi.map(s => s.skor)

    const networking = normalize(avg(networkingScores))
    const hardware = normalize(avg(hardwareScores))
    const logic = normalize(avg(allQuizScores))
    const troubleshooting = normalize(avg(simulasiScores))

    const problemSolving = normalize(
      (logic * 0.5) + (troubleshooting * 0.5)
    )

    const consistency = normalize(
      (selesaiMateri / (totalMateri || 1)) * 100
    )

    // ========================
    // Return ke frontend
    // ========================

    const round = (val) => Math.round(val)

    return Response.json({
      networking : round(networking),
      hardware: round(hardware),
      logic: round(logic),
      troubleshooting: round(troubleshooting),
      problemSolving: round(problemSolving),
      consistency: round(consistency)
    })

  } catch (err) {
    console.error(err)
    return Response.json(
      { message: err.message || "Gagal mengambil stats" },
      { status: 500 }
    )
  }
}