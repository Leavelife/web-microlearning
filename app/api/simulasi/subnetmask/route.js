import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';
import { gamificationEngine } from '@/lib/gamification';

export async function GET(req) {
  try {
    const authUser = await requireAuth();

    // Get all perfect submissions for this user on subnetmask
    // Note: cidrValue may not exist in DB yet, so we don't select it
    // Just return empty array for now, will work better after migration
    const perfectSubmissions = await prisma.hasilSimulasi.findMany({
      where: {
        userId: authUser.id,
        idSimulasi: 'subnetmask',
        skor: 100,
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // TODO: After migration, update to select cidrValue and extract completed CIDRs
    // For now, just return count and empty array
    const completedCount = perfectSubmissions.length;
    const completedCidrs = []; // Will be populated after migration

    return Response.json({
      success: true,
      completedCidrs,
      completedCount,
      maxAttempts: 4,
    });
  } catch (error) {
    console.error('Error fetching subnetmask completion status:', error);
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authUser = await requireAuth();

    const body = await req.json();
    const { cidr, correctCount, totalCount, score, timeSpent } = body;

    // Validate required fields
    if (cidr === undefined || correctCount === undefined || score === undefined) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof cidr !== 'number' || typeof correctCount !== 'number' || typeof score !== 'number') {
      return Response.json(
        { error: 'Invalid data types' },
        { status: 400 }
      );
    }

    // Calculate if this is a perfect/correct attempt (score = 100)
    const isPerfect = score === 100;

    // Check how many CIDR this user has already completed perfectly (for XP limit of 4)
    const completedCidrs = await prisma.hasilSimulasi.findMany({
      where: {
        userId: authUser.id,
        idSimulasi: 'subnetmask',
        skor: 100,
      },
    });

    // Count how many times user has received XP for subnetmask (max 4 times = 1000 XP total)
    const xpEarnedCount = completedCidrs.length;
    const canEarnXp = isPerfect && xpEarnedCount < 4;

    // Determine gamification event and XP
    let expGained = 0;
    let levelUp = null;
    let unlockedAchievements = [];
    let gamificationError = null;

    if (canEarnXp) {
      try {
        const gamificationResult = await gamificationEngine({
          userId: authUser.id,
          event: {
            type: "SIMULASI_SUBNETMASK_SELESAI",
          }
        });
        expGained = gamificationResult.expGained;
        levelUp = gamificationResult.levelUp;
        unlockedAchievements = gamificationResult.unlockedAchievements;
      } catch (gamificationErr) {
        console.error('Gamification error in subnetmask submission:', gamificationErr);
        gamificationError = gamificationErr.message;
        if (isPerfect) {
          expGained = 250;
        }
      }
    }

    // Save to database
    const result = await prisma.hasilSimulasi.create({
      data: {
        userId: authUser.id,
        idSimulasi: 'subnetmask',
        skor: score,
        waktuPenyelesaian: timeSpent || 0,
        status: isPerfect ? 'selesai' : 'parsial',
        correctConnections: correctCount,
        totalConnections: totalCount,
        isValid: isPerfect,
      },
    });

    return Response.json({
      success: true,
      result: {
        id: result.id,
        score,
        correctCount,
        totalCount,
        timeSpent,
        isPerfect,
        expGained,
        levelUp,
        unlockedAchievements,
        xpEarnedCount: xpEarnedCount + (canEarnXp ? 1 : 0), // Updated count
      },
      warning: gamificationError ? `Gamification issue: ${gamificationError}. XP was still awarded.` : null,
    });
  } catch (err) {
    console.error('Subnetmask submission error:', err);
    return Response.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
