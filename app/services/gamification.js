// services/gamification.js
export async function processGamification(userId, expGained) {
  // 1. tambah exp
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      totalExp: { increment: expGained },
    },
  });

  // 2. check level
  const newLevel = await checkLevelUp(user);

  // 3. check achievement
  const newAchievements = await checkAchievements(user);

  return {
    newLevel,
    newAchievements,
    totalExp: user.totalExp,
  };
}

async function checkLevelUp(user) {
  const levels = await prisma.level.findMany({
    orderBy: { minExp: "asc" },
  });

  const eligibleLevel = levels
    .reverse()
    .find((lvl) => user.totalExp >= lvl.minExp);

  if (!eligibleLevel) return null;

  const alreadyHas = await prisma.levelUser.findFirst({
    where: {
      userId: user.id,
      levelId: eligibleLevel.id,
    },
  });

  if (alreadyHas) return null;

  await prisma.levelUser.create({
    data: {
      userId: user.id,
      levelId: eligibleLevel.id,
    },
  });

  return eligibleLevel;
}

async function checkAchievements(user) {
  const achievements = await prisma.achievement.findMany();

  const unlocked = [];

  for (const ach of achievements) {
    // contoh kondisi EXP
    if (user.totalExp >= ach.syaratExp) {
      const already = await prisma.userAchievement.findFirst({
        where: {
          userId: user.id,
          achievementId: ach.id,
        },
      });

      if (!already) {
        const newAch = await prisma.userAchievement.create({
          data: {
            userId: user.id,
            achievementId: ach.id,
          },
        });

        unlocked.push(ach);
      }
    }
  }

  return unlocked;
}