import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { gamificationEngine } from "@/lib/gamification";

/**
 * POST — selesaikan tahap saat ini (frontier) lalu maju ke urutan berikutnya
 * atau tandai materi selesai. Body: { urutan: number } harus sama dengan stepSekarang di DB.
 */
export async function POST(req, { params }) {
  try {
    const user = await requireAuth();
    const { materiId } = await params;
    const body = await req.json();
    const completedUrutan = Number(body?.urutan);

    if (!materiId || Number.isNaN(completedUrutan)) {
      return Response.json(
        { error: "materiId dan urutan wajib" },
        { status: 400 }
      );
    }

    const progress = await prisma.progressMateri.findFirst({
      where: { userId: user.id, materiId },
    });

    if (!progress) {
      return Response.json(
        { error: "Progress tidak ditemukan. Buka ulang halaman materi." },
        { status: 404 }
      );
    }

    if (progress.selesai) {
      return Response.json({
        progress: {
          stepSekarang: progress.stepSekarang,
          selesai: true,
        },
      });
    }

    if (completedUrutan !== progress.stepSekarang) {
      return Response.json(
        {
          error: "Urutan tidak sesuai tahap saat ini",
          progress: {
            stepSekarang: progress.stepSekarang,
            selesai: progress.selesai,
          },
        },
        { status: 409 }
      );
    }

    const steps = await prisma.materiStep.findMany({
      where: { materiId },
      orderBy: { urutan: "asc" },
    });

    if (steps.length === 0) {
      return Response.json({ error: "Materi tidak punya tahap" }, { status: 400 });
    }

    const idx = steps.findIndex((s) => s.urutan === progress.stepSekarang);
    if (idx === -1) {
      return Response.json({ error: "Tahap progress tidak valid" }, { status: 400 });
    }

    const isLast = idx === steps.length - 1;

    if (isLast) {
      const updated = await prisma.progressMateri.update({
        where: { id: progress.id },
        data: { selesai: true, updateAt: new Date() },
      });
        const result = await gamificationEngine({
          userId: user.id,
          event: {
            type: "MATERI_SELESAI",
            materiId: materiId,
          },
        })
      return Response.json({
        progress: {
          stepSekarang: updated.stepSekarang,
          selesai: updated.selesai,
        },
        gamification: result,
      });
    }

    const nextUrutan = steps[idx + 1].urutan;
    const updated = await prisma.progressMateri.update({
      where: { id: progress.id },
      data: { stepSekarang: nextUrutan, updateAt: new Date() },
    });

    return Response.json({
      progress: {
        stepSekarang: updated.stepSekarang,
        selesai: updated.selesai,
      },
    });
  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(err);
    return Response.json({ error: "Gagal memperbarui progres" }, { status: 500 });
  }
}
