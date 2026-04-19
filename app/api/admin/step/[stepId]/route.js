import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

// UPDATE STEP
export async function PUT(req, { params }) {
  try {
    await requireRole("admin");

    const { stepId } = params;
    const { judul, contents } = await req.json();

    if (!judul || !Array.isArray(contents) || contents.length === 0) {
      return Response.json({ error: "judul dan contents wajib" }, { status: 400 });
    }

    const step = await prisma.materiStep.update({
      where: { id: stepId },
      data: {
        judul,
        contents: {
          deleteMany: {},
          create: contents.map((content, index) => ({
            tipe: content.tipe,
            konten: content.konten,
            urutan: content.urutan ?? index + 1,
          })),
        },
      },
      include: {
        contents: {
          orderBy: { urutan: "asc" },
        },
      },
    });

    return Response.json({
      message: "Step berhasil diupdate",
      step,
    });

  } catch (err) {
    return Response.json({ error: "Error update step" }, { status: 500 });
  }
}

// DELETE STEP
export async function DELETE(req, { params }) {
  try {
    await requireRole("admin");

    const { stepId } = params;

    await prisma.materiStep.delete({
      where: { id: stepId },
    });

    return Response.json({
      message: "Step berhasil dihapus",
    });

  } catch (err) {
    return Response.json({ error: "Error delete step" }, { status: 500 });
  }
}