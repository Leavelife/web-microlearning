import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function PUT(req, { params }) {
  try {
    await requireRole("admin")

    const { id } = await params
    const { pertanyaan, opsi, jawabanBenar, score } = await req.json()

    const soal = await prisma.soalQuiz.update({
      where: { id },
      data: {
        pertanyaan,
        opsi,
        jawabanBenar,
        score: Number(score)
      }
    })

    return Response.json({
      message: "Soal berhasil diupdate",
      soal
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

    await prisma.soalQuiz.delete({
      where: { id }
    })

    return Response.json({
      message: "Soal berhasil dihapus"
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error delete" }, { status: 500 })
  }
}