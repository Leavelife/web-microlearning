import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function PUT(req, { params }) {
  try {
    await requireRole("admin")

    const { id } = await params
    const { judul } = await req.json()

    const quiz = await prisma.quiz.update({
      where: { id },
      data: { judul }
    })

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

    await prisma.quiz.delete({
      where: { id }
    })

    return Response.json({
      message: "Quiz berhasil dihapus"
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: "Error delete" }, { status: 500 })
  }
}