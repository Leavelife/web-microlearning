import { prisma } from "@/lib/prisma"

export async function gamificationEngine({ userId, event }) {
  let expGained = 0
  let levelUp = null
  let unlockedAchievements = []

  // 1. EXP DARI EVENT
  if (event.type === "MATERI_SELESAI") {
    expGained = 50 // nanti bisa dinamis
  } else if (event.type === "QUIZ_SELESAI") {
    const score = Number(event.score ?? 0)
    expGained = Math.max(10, Math.min(100, Math.round(score * 0.5)))
  } else if (event.type === "SIMULASI_KABEL_LAN_PERTAMA") {
    expGained = 500
  } else if (event.type === "SIMULASI_PC_BUILDING_PERTAMA") {
    expGained = 500
  } else if (event.type === "SIMULASI_SUBNETMASK_SELESAI") {
    expGained = 125
  } else if (event.type === "SIMULASI_TOPOLOGY_MUDAH") {
    expGained = 60
  } else if (event.type === "SIMULASI_TOPOLOGY_SEDANG") {
    expGained = 80
  } else if (event.type === "SIMULASI_TOPOLOGY_SULIT") {
    expGained = 100
  } else if (event.type === "SIMULASI_SELESAI") {
    const score = Number(event.score ?? 0)
    expGained = Math.max(10, Math.min(100, Math.round(score * 0.5)))
  }

  // 2. TAMBAH EXP
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      totalExp: {
        increment: expGained,
      },
    },
  })

  const newExp = user.totalExp

  // 3. CEK LEVEL
  const level = await prisma.level.findFirst({
    where: {
      minExp: { lte: newExp },
      maxExp: { gte: newExp },
    },
  })

  if (level && level.id !== user.levelId) {
    await prisma.user.update({
      where: { id: userId },
      data: { levelId: level.id },
    })

    levelUp = level
  }

  // 4. CEK ACHIEVEMENT (EVENT BASED)
  const achievements = await prisma.achievement.findMany({
    where: {
      eventType: event.type,
      OR: [
        { eventKey: null },
        { eventKey: event.materiId ? String(event.materiId) : null },
        { eventKey: event.quizId ? String(event.quizId) : null },
      ],
    },
  })

  for (const ach of achievements) {
    const already = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: ach.id,
        },
      },
    })

    if (!already) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: ach.id,
        },
      })

      unlockedAchievements.push(ach)
    }
  }

  return {
    expGained,
    newTotalExp: newExp,
    levelUp,
    unlockedAchievements,
  }
}