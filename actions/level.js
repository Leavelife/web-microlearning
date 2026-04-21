"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { uploadAdminImage } from "@/lib/cloudinary-upload"

// CREATE
export async function createLevel(formData) {
  const nama = formData.get("nama")?.trim()
  const minExp = Number(formData.get("minExp"))
  const maxExp = Number(formData.get("maxExp"))
  const gambarFile = formData.get("gambar")

  // VALIDASI DASAR
  if (!nama) {
    throw new Error("Nama wajib diisi")
  }

  if (minExp < 0 || maxExp <= minExp) {
    throw new Error("Range EXP tidak valid")
  }

  let urlGambar = null

  // Handle file upload
  if (gambarFile && gambarFile.size > 0) {
    if (!gambarFile.type.startsWith("image/")) {
      throw new Error("File harus berupa gambar")
    }

    if (gambarFile.size > 2 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 2MB")
    }

    try {
      const buffer = Buffer.from(await gambarFile.arrayBuffer())
      const filename = `level-${Date.now()}-${Math.random().toString(36).substring(2)}`
      const result = await uploadAdminImage(buffer, filename, "levels")
      urlGambar = result.secure_url
    } catch (error) {
      throw new Error("Gagal mengunggah gambar: " + error.message)
    }
  } else {
    throw new Error("Gambar wajib diunggah")
  }

  // CEK OVERLAP
  const overlap = await prisma.level.findFirst({
    where: {
      AND: [
        { minExp: { lte: maxExp } },
        { maxExp: { gte: minExp } },
      ],
    },
  })

  if (overlap) {
    throw new Error("Range EXP bertabrakan dengan level lain")
  }

  await prisma.level.create({
    data: {
      nama,
      minExp,
      maxExp,
      urlGambar,
    },
  })

  revalidatePath("/admin/dashboard")
  revalidatePath("/learn")
  revalidatePath("/quiz")
}

// DELETE
export async function deleteLevel(id) {
  await prisma.level.delete({
    where: { id },
  })

  revalidatePath("/admin/dashboard")
  revalidatePath("/learn")
  revalidatePath("/quiz")
}