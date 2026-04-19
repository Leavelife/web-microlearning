"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { uploadAdminImage } from "@/lib/cloudinary-upload"

export async function createAchievement(formData) {
  const nama = formData.get("nama")?.trim()
  const deskripsi = formData.get("deskripsi")?.trim()
  const eventType = formData.get("eventType")?.trim()
  const eventKey = formData.get("eventKey")?.trim() || null
  const expReward = Number(formData.get("expReward"))
  const gambarFile = formData.get("gambar")

  // VALIDASI SERVER
  if (!nama || !deskripsi || !eventType) {
    throw new Error("Nama, deskripsi, dan jenis event wajib diisi")
  }

  if (!expReward || expReward <= 0) {
    throw new Error("XP tidak valid")
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
      const filename = `achievement-${Date.now()}-${Math.random().toString(36).substring(2)}`
      const result = await uploadAdminImage(buffer, filename, "achievements")
      urlGambar = result.secure_url
    } catch (error) {
      throw new Error("Gagal mengunggah gambar: " + error.message)
    }
  } else {
    throw new Error("Gambar wajib diunggah")
  }

  await prisma.achievement.create({
    data: {
      nama,
      deskripsi,
      eventType: eventType.toUpperCase(),
      eventKey,
      expReward,
      urlGambar,
    },
  })

  revalidatePath("/admin/dashboard")
}

// DELETE
export async function deleteAchievement(id) {
  await prisma.achievement.delete({
    where: { id },
  })

  revalidatePath("/admin/dashboard")
}