import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

//  CREATE MATERI
export async function POST(req) {
  try {
    await requireRole("admin");

    const { judul, deskripsi, genre, thumbnail } = await req.json();

    if (!judul || !deskripsi || !genre) {
      return Response.json(
        { error: "judul, deskripsi, genre wajib" },
        { status: 400 }
      );
    }

    const materi = await prisma.materi.create({
      data: {
        judul,
        deskripsi,
        genre,
        thumbnail,
      },
    });

    return Response.json({
      message: "Materi berhasil dibuat",
      materi,
    });

  } catch (err) {
    console.log(err);
    if (err.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (err.message === "FORBIDDEN") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET LIST (CARD VIEW)
export async function GET() {
  try {
    const materis = await prisma.materi.findMany({
      include: {
        steps: true,
        progresses: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const formatted = materis.map((m) => {
      const totalStep = m.steps.length;

      return {
        id: m.id,
        judul: m.judul,
        deskripsi: m.deskripsi,
        genre: m.genre,
        thumbnail: m.thumbnail,
        totalStep,
        tahap: 1, // Assuming all are level 1 for now
        tipe: m.genre, // Using genre as tipe
      };
    });

    return Response.json({ materis: formatted });

  } catch (err) {
    return Response.json({ error: "Error fetch materi" }, { status: 500 });
  }
}