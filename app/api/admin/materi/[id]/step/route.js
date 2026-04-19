import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export async function GET(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params;

    const steps = await prisma.materiStep.findMany({
      where: { materiId: id },
      orderBy: { urutan: "asc" },
      include: {
        contents: {
          orderBy: { urutan: "asc" },
        },
      },
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
    const { judul, contents } = await req.json();

    if (!judul || !Array.isArray(contents) || contents.length === 0) {
      return Response.json({ error: "judul dan contents wajib" }, { status: 400 });
    }

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
        contents: {
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
      message: "Step berhasil ditambahkan",
      step,
    });

  } catch (err) {
    console.error("POST materi step:", err);
    const msg =
      err?.code === "P2002"
        ? "Data bentrok (unik); cek urutan atau judul."
        : err?.message?.includes("konten") || err?.message?.includes("column")
          ? err.message
          : "Error create step";
    return Response.json({ error: msg }, { status: 500 });
  }
}