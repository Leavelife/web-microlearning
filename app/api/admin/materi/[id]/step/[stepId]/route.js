import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import { uploadAdminImage } from "@/lib/cloudinary-upload";

export async function PUT(req, { params }) {
  try {
    await requireRole("admin");

    const { id, stepId } = await params;
    const contentType = req.headers.get("content-type") || "";

    let judul, contents;

    if (contentType.includes("multipart/form-data")) {
      // Handle file uploads
      const formData = await req.formData();
      judul = formData.get("judul")?.toString().trim();

      // Parse contents array from form data
      const contentsData = [];
      const contentKeys = Array.from(formData.keys()).filter(key => key.startsWith("contents["));
      const contentIndices = [...new Set(contentKeys.map(key => key.match(/contents\[(\d+)\]/)[1]))];

      for (const index of contentIndices.sort((a, b) => parseInt(a) - parseInt(b))) {
        const tipe = formData.get(`contents[${index}][tipe]`)?.toString();
        const urutan = parseInt(formData.get(`contents[${index}][urutan]`)?.toString() || "1");
        const file = formData.get(`contents[${index}][file]`);
        const kontenText = formData.get(`contents[${index}][konten]`)?.toString() || "";

        let konten = kontenText;

        if (tipe === "image" && file && file.size > 0) {
          // Upload image to Cloudinary
          if (!file.type.startsWith("image/")) {
            return Response.json(
              { error: "File harus berupa gambar" },
              { status: 400 }
            );
          }

          if (file.size > 2 * 1024 * 1024) {
            return Response.json(
              { error: "Ukuran gambar maksimal 2MB" },
              { status: 400 }
            );
          }

          try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `step-${Date.now()}-${Math.random().toString(36).substring(2)}`;
            const result = await uploadAdminImage(buffer, filename, "step-content");
            konten = result.secure_url;
          } catch (error) {
            return Response.json(
              { error: "Gagal mengunggah gambar: " + error.message },
              { status: 500 }
            );
          }
        }

        contentsData.push({ tipe, konten, urutan });
      }

      contents = contentsData;
    } else {
      // Handle JSON
      const body = await req.json();
      judul = body.judul;
      contents = body.contents;
    }

    if (!judul || !Array.isArray(contents) || contents.length === 0) {
      return Response.json({ error: "judul dan contents wajib" }, { status: 400 });
    }

    const step = await prisma.materiStep.update({
      where: { id: stepId },
      data: {
        judul,
        contents: {
          deleteMany: {},
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