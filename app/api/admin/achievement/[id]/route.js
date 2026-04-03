// app/api/admin/achievement/[id]
import {prisma} from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req, { params }) {
    const { id } = await params
    const achievement = await prisma.achievement.findUnique({
        where: { id },
    });

    return Response.json(achievement);
}

export async function PUT(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params
    const { nama, deskripsi, syaratExp, kondisi, urlGambar } = await req.json();

    const updated = await prisma.achievement.update({
      where: { id },
      data: {
        nama,
        deskripsi,
        syaratExp: Number(syaratExp),
        kondisi,
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
    await prisma.achievement.delete({
      where: { id },
    });

    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}