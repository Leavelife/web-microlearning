import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

/** Menyimpan hasil quiz (memerlukan login). */
export async function POST(req) {
  try {
    const user = await requireAuth();
    const { quizId, score } = await req.json();
    const n = Number(score);
    if (!quizId || Number.isNaN(n)) {
      return Response.json(
        { error: "quizId dan score wajib" },
        { status: 400 }
      );
    }

    await prisma.hasilQuizUser.create({
      data: {
        userId: user.id,
        quizId,
        score: n,
      },
    });

    return Response.json({ ok: true });
  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(err);
    return Response.json({ error: "Gagal menyimpan" }, { status: 500 });
  }
}
