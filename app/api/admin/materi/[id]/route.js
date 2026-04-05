import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

// ✅ GET DETAIL (STEP + QUIZ)
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const materi = await prisma.materi.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { urutan: "asc" },
          include: {
            quiz: {
              include: {
                soal: true,
              },
            },
          },
        },
      },
    });

    if (!materi) {
      return Response.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    return Response.json({ materi });

  } catch (err) {
    return Response.json({ error: "Error get detail" }, { status: 500 });
  }
}

// ✅ UPDATE MATERI
export async function PUT(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params;
    const { judul, deskripsi, genre, thumbnail } = await req.json();

    const materi = await prisma.materi.update({
      where: { id },
      data: {
        judul,
        deskripsi,
        genre,
        thumbnail,
      },
    });

    return Response.json({
      message: "Materi berhasil diupdate",
      materi,
    });

  } catch (err) {
    return Response.json({ error: "Error update" }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params;

    await prisma.materi.delete({
      where: { id },
    });

    return Response.json({
      message: "Materi berhasil dihapus",
    });

  } catch (err) {
    return Response.json({ error: "Error delete" }, { status: 500 });
  }
}