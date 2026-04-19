"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createAchievement(formData) {
  const nama = formData.get("nama")?.trim()
  const deskripsi = formData.get("deskripsi")?.trim()
  const eventType = formData.get("eventType")?.trim()
  const eventKey = formData.get("eventKey")?.trim() || null
  const expReward = Number(formData.get("expReward"))
  const urlGambar = formData.get("urlGambar")?.trim()

  // VALIDASI SERVER
  if (!nama || !deskripsi || !eventType || !urlGambar) {
    throw new Error("Semua field wajib diisi")
  }

  if (!expReward || expReward <= 0) {
    throw new Error("XP tidak valid")
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