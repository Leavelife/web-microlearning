import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function PUT(req, { params }) {
  try {
    await requireRole("admin");

    const { id, stepId } = params;
    const { judul, tipe, konten } = await req.json();

    const step = await prisma.materiStep.update({
      where: { id: stepId },
      data: {
        judul,
        tipe,
        konten,
      },
    });

    return Response.json({
      message: "Step berhasil diupdate",
      step,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error update step" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireRole("admin");

    const { id, stepId } = params;

    await prisma.materiStep.delete({
      where: { id: stepId },
    });

    return Response.json({
      message: "Step berhasil dihapus",
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error delete step" }, { status: 500 });
  }
}