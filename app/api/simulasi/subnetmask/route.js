import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';
import { gamificationEngine } from '@/lib/gamification';

function parseStoredCidr(value) {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 32) return null;
  return parsed;
}

function extractCompletedCidrs(submissions) {
  const cidrSet = new Set();

  for (const submission of submissions) {
    const parsedCidr = parseStoredCidr(submission.topologyType);
    if (parsedCidr !== null) {
      cidrSet.add(parsedCidr);
    }
  }

  return Array.from(cidrSet).sort((a, b) => a - b);
}

export async function GET(req) {
  try {
    const authUser = await requireAuth();

    // Read perfect submissions for this user on subnetmask.
    // CIDR value is stored in topologyType for subnetmask attempts.
    const perfectSubmissions = await prisma.hasilSimulasi.findMany({
      where: {
        userId: authUser.id,
        idSimulasi: 'subnetmask',
        skor: 100,
      },
      select: {
        id: true,
        topologyType: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const completedCidrs = extractCompletedCidrs(perfectSubmissions);
    const completedCount = perfectSubmissions.length;

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

    if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) {
      return Response.json(
        { error: 'CIDR must be integer between 0 and 32' },
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
    let newTotalExp = null;
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
        newTotalExp = gamificationResult.newTotalExp;
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
        topologyType: String(cidr),
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
        newTotalExp,
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
