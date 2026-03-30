import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function POST(req) {
  try {
    await requireRole("admin")

    const { nomorMateri, judul, deskripsi, tipe, tahap, urlKonten, unlockType  } = await req.json()

    if (!judul || !deskripsi) {
      return Response.json(
        { error: "Title dan content wajib diisi" },
        { status: 400 }
      )
    }

    const lesson = await prisma.materi.create({
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
      message: "Materi berhasil dibuat",
      lesson
    })

  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (err.message === "FORBIDDEN") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    console.error(err)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}

// list semua materi (admin view)
export async function GET() {
  try {
    await requireRole("admin")

    const lessons = await prisma.materi.findMany({
      orderBy: { nomorMateri: "asc" }
    })

    if(!lessons || lessons.length === 0) {
      return Response.json({ error: "Tidak ada materi" }, { status: 404 })
    }

    return Response.json({ lessons })

  } catch (err) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }
}