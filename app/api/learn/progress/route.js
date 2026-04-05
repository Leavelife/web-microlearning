import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

/**
 * GET — ringkasan progres materi untuk user login (untuk LessonGrid).
 * Response: { byMateriId: { [materiId]: number } } nilai 0–100 (persen).
 * Tanpa auth: { byMateriId: {} }
 */
export async function GET() {
  try {
    const user = await requireAuth();

    const rows = await prisma.progressMateri.findMany({
      where: { userId: user.id },
      include: {
        materi: {
          include: {
            steps: {
              select: { urutan: true },
              orderBy: { urutan: "asc" },
            },
          },
        },
      },
    });

    const byMateriId = {};

    for (const p of rows) {
      const steps = p.materi?.steps ?? [];
      const total = steps.length;

      let percent = 0;
      if (p.selesai) {
        percent = 100;
      } else if (total === 0) {
        percent = 0;
      } else {
        const idx = steps.findIndex((s) => s.urutan === p.stepSekarang);
        if (idx >= 0) {
          percent = Math.round((idx / total) * 100);
        }
      }

      byMateriId[p.materiId] = percent;
    }

    return Response.json({ byMateriId });
  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return Response.json({ byMateriId: {} });
    }
    console.error(err);
    return Response.json({ error: "Gagal memuat progres" }, { status: 500 });
  }
}
