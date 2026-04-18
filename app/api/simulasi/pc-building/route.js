import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';
import { gamificationEngine } from '@/lib/gamification';

export async function POST(req) {
  try {
    const authUser = await requireAuth();

    const body = await req.json();
    const { correctCount, timeSpent } = body;

    // Validate required fields
    if (correctCount === undefined || timeSpent === undefined) {
      return Response.json(
        { error: 'Missing required fields: correctCount, timeSpent' },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof correctCount !== 'number' || typeof timeSpent !== 'number') {
      return Response.json(
        { error: 'correctCount and timeSpent must be numbers' },
        { status: 400 }
      );
    }

    // Validate ranges
    if (!Number.isInteger(correctCount) || correctCount < 0 || correctCount > 5) {
      return Response.json(
        { error: 'correctCount must be an integer between 0 and 5' },
        { status: 400 }
      );
    }

    if (timeSpent < 0) {
      return Response.json(
        { error: 'timeSpent cannot be negative' },
        { status: 400 }
      );
    }

    // Calculate score 0-100
    const calculatedScore = Math.round((correctCount / 5) * 100);
    const isPerfect = calculatedScore === 100;

    // Check if user already has a perfect submission for pc-building
    const previousPerfectSubmission = await prisma.hasilSimulasi.findFirst({
      where: {
        userId: authUser.id,
        idSimulasi: 'pc-building',
        skor: 100
      }
    });

    // Determine gamification event
    let expGained = 0;
    let levelUp = null;
    let unlockedAchievements = [];
    let gamificationError = null;

    // Award 1000 XP only if it's the very first perfect completion
    if (isPerfect && !previousPerfectSubmission) {
      try {
        const gamificationResult = await gamificationEngine({
          userId: authUser.id,
          event: {
            type: "SIMULASI_PC_BUILDING_PERTAMA",
          }
        });
        expGained = gamificationResult.expGained;
        levelUp = gamificationResult.levelUp;
        unlockedAchievements = gamificationResult.unlockedAchievements;
      } catch (gamificationErr) {
        // Log the error but don't fail the entire submission
        console.error('Gamification error in pc-building submission:', gamificationErr);
        gamificationError = gamificationErr.message;
        // Still award the XP even if gamification fails
        expGained = 1000;
      }
    }

    // Save to database
    const result = await prisma.hasilSimulasi.create({
      data: {
        userId: authUser.id,
        idSimulasi: 'pc-building',
        skor: calculatedScore,
        waktuPenyelesaian: timeSpent || 0,
        status: isPerfect ? 'selesai' : 'parsial',
        correctConnections: correctCount,
        totalConnections: 5,
        isValid: isPerfect,
      },
    });

    return Response.json({
      success: true,
      result: {
        id: result.id,
        score: calculatedScore,
        correctCount,
        totalConnections: 5,
        timeSpent,
        isPerfect,
        expGained,
        levelUp,
        unlockedAchievements,
      },
      warning: gamificationError ? `Gamification issue: ${gamificationError}. XP was still awarded.` : null,
    });
  } catch (err) {
    console.error('PC Building submission error:', err);
    return Response.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
