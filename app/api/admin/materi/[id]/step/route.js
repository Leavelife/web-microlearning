import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params;

    const steps = await prisma.materiStep.findMany({
      where: { materiId: id },
      orderBy: { urutan: "asc" },
    });

    return Response.json({ steps });

  } catch (err) {
    return Response.json({ error: "Error fetch steps" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params;
    const { judul, tipe, konten } = await req.json();

    // cari urutan terakhir
    const lastStep = await prisma.materiStep.findFirst({
      where: { materiId: id },
      orderBy: { urutan: "desc" },
    });

    const urutan = lastStep ? lastStep.urutan + 1 : 1;

    const step = await prisma.materiStep.create({
      data: {
        materiId: id,
        urutan,
        judul,
        tipe,
        konten,
      },
    });

    return Response.json({
      message: "Step berhasil ditambahkan",
      step,
    });

  } catch (err) {
    return Response.json({ error: "Error create step" }, { status: 500 });
  }
}