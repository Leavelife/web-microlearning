// app/api/admin/level/[id]
import {prisma} from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function PUT(req, { params }) {
  try {
    await requireRole( "admin");

    const { id } = await params
    const { nama, minExp, urlGambar } = await req.json();

    const updated = await prisma.level.update({
      where: { id },
      data: {
        nama,
        minExp: Number(minExp),
        urlGambar,
      },
    });

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params

    await prisma.level.delete({
      where: { id },
    });

    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}