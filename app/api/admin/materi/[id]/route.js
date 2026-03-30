import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function PUT(req, { params }) {
  try {
    await requireRole("admin")

    const { id } = await params
    const { nomorMateri, judul, deskripsi, tipe, tahap, urlKonten, unlockType } = await req.json()

    const lesson = await prisma.materi.update({
      where: { id },
      data: {
        nomorMateri: Number(nomorMateri),
        judul,
        deskripsi,
        tipe,
        tahap: Number(tahap),
        urlKonten,
        unlockType
      }
    })

    return Response.json({
      message: "Materi berhasil diupdate",
      lesson
    })

  } catch (err) {

    return Response.json({ error: "Error update" }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireRole("admin")

    const { id } = await params

    await prisma.materi.delete({
      where: { id }
    })

    return Response.json({
      message: "Materi berhasil dihapus"
    })

  } catch (err) {
    return Response.json({ error: "Error delete" }, { status: 500 })
  }
}