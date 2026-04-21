import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { uploadAdminImage } from "@/lib/cloudinary-upload";
import { revalidatePath } from "next/cache";

//  CREATE MATERI
export async function POST(req) {
  try {
    await requireRole("admin");

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      const judul = formData.get("judul")?.toString().trim();
      const deskripsi = formData.get("deskripsi")?.toString().trim();
      const genre = formData.get("genre")?.toString().trim();
      const thumbnailFile = formData.get("thumbnail");

      if (!judul || !deskripsi || !genre) {
        return Response.json(
          { error: "judul, deskripsi, genre wajib" },
          { status: 400 }
        );
      }

      let thumbnail = null;

      // Handle file upload
      if (thumbnailFile && thumbnailFile.size > 0) {
        if (!thumbnailFile.type.startsWith("image/")) {
          return Response.json(
            { error: "File thumbnail harus berupa gambar" },
            { status: 400 }
          );
        }

        if (thumbnailFile.size > 2 * 1024 * 1024) {
          return Response.json(
            { error: "Ukuran gambar maksimal 2MB" },
            { status: 400 }
          );
        }

        try {
          const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
          const filename = `materi-${Date.now()}-${Math.random().toString(36).substring(2)}`;
          const result = await uploadAdminImage(buffer, filename, "materi");
          thumbnail = result.secure_url;
        } catch (error) {
          return Response.json(
            { error: "Gagal mengunggah thumbnail: " + error.message },
            { status: 500 }
          );
        }
      }

      const materi = await prisma.materi.create({
        data: {
          judul,
          deskripsi,
          genre,
          thumbnail,
        },
      });

      revalidatePath("/learn");

      return Response.json({
        message: "Materi berhasil dibuat",
        materi,
      });
    } else {
      // Handle JSON (legacy support)
      const { judul, deskripsi, genre, thumbnail } = await req.json();

      if (!judul || !deskripsi || !genre) {
        return Response.json(
          { error: "judul, deskripsi, genre wajib" },
          { status: 400 }
        );
      }

      const materi = await prisma.materi.create({
        data: {
          judul,
          deskripsi,
          genre,
          thumbnail,
        },
      });

      revalidatePath("/learn");

      return Response.json({
        message: "Materi berhasil dibuat",
        materi,
      });
    }

  } catch (err) {
    console.log(err);
    if (err.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (err.message === "FORBIDDEN") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET LIST (CARD VIEW)
export async function GET() {
  try {
    const materis = await prisma.materi.findMany({
      include: {
        steps: true,
        progresses: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const formatted = materis.map((m) => {
      const totalStep = m.steps.length;

      return {
        id: m.id,
        judul: m.judul,
        deskripsi: m.deskripsi,
        genre: m.genre,
        thumbnail: m.thumbnail,
        totalStep,
        tahap: 1, // Assuming all are level 1 for now
        tipe: m.genre, // Using genre as tipe
      };
    });

    return Response.json({ materis: formatted });

  } catch (err) {
    return Response.json({ error: "Error fetch materi" }, { status: 500 });
  }
}