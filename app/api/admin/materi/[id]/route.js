import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { uploadAdminImage } from "@/lib/cloudinary-upload";

// GET DETAIL (STEP + QUIZ)
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const materi = await prisma.materi.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { urutan: "asc" },
          include: {
            quiz: {
              include: {
                soal: true,
              },
            },
          },
        },
      },
    });

    if (!materi) {
      return Response.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    return Response.json({ materi });

  } catch (err) {
    return Response.json({ error: "Error get detail" }, { status: 500 });
  }
}

// UPDATE MATERI
export async function PUT(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params;
    const formData = await req.formData();

    const judul = formData.get('judul');
    const deskripsi = formData.get('deskripsi');
    const genre = formData.get('genre');
    const thumbnailFile = formData.get('thumbnail');

    const updateData = {
      judul,
      deskripsi,
      genre,
    };

    // Handle thumbnail upload if provided
    if (thumbnailFile && thumbnailFile.size > 0) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const filename = `materi-${id}-${Date.now()}`;
      const uploadResult = await uploadAdminImage(buffer, filename, 'materi');
      updateData.thumbnail = uploadResult.secure_url;
    }

    const materi = await prisma.materi.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/learn");

    return Response.json({
      message: "Materi berhasil diupdate",
      materi,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message || "Error update" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req, { params }) {
  try {
    await requireRole("admin");

    const { id } = await params;

    await prisma.$transaction(async (tx) => {
      const steps = await tx.materiStep.findMany({
        where: { materiId: id },
        include: { quiz: true },
      });

      for (const step of steps) {
        if (step.quiz) {
          const qid = step.quiz.id;
          await tx.hasilQuizUser.deleteMany({ where: { quizId: qid } });
          await tx.soalQuiz.deleteMany({ where: { quizId: qid } });
          await tx.quiz.delete({ where: { id: qid } });
        }
        await tx.stepContent.deleteMany({ where: { stepId: step.id } });
      }

      await tx.materiStep.deleteMany({ where: { materiId: id } });
      await tx.progressMateri.deleteMany({ where: { materiId: id } });
      await tx.materi.delete({ where: { id } });
    });

    revalidatePath("/learn");

    return Response.json({
      message: "Materi berhasil dihapus",
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error delete" }, { status: 500 });
  }
}