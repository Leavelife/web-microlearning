"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// CREATE
export async function createLevel(formData) {
  const nama = formData.get("nama")?.trim()
  const minExp = Number(formData.get("minExp"))
  const maxExp = Number(formData.get("maxExp"))
  const urlGambar = formData.get("urlGambar")?.trim()

  // VALIDASI DASAR
  if (!nama || !urlGambar) {
    throw new Error("Nama dan gambar wajib diisi")
  }

  if (minExp < 0 || maxExp <= minExp) {
    throw new Error("Range EXP tidak valid")
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
}

// DELETE
export async function deleteLevel(id) {
  await prisma.level.delete({
    where: { id },
  })

  revalidatePath("/admin/dashboard")
}