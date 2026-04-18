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
    if (!Number.isInteger(correctCount) || correctCount < 0 || correctCount > 8) {
      return Response.json(
        { error: 'correctCount must be an integer between 0 and 8' },
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
    const calculatedScore = Math.round((correctCount / 8) * 100);
    const isPerfect = calculatedScore === 100;

    // Check if user already has a perfect submission for kabel-lan
    const previousPerfectSubmission = await prisma.hasilSimulasi.findFirst({
      where: {
        userId: authUser.id,
        idSimulasi: 'kabel-lan',
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
            type: "SIMULASI_KABEL_LAN_PERTAMA",
          }
        });
        expGained = gamificationResult.expGained;
        levelUp = gamificationResult.levelUp;
        unlockedAchievements = gamificationResult.unlockedAchievements;
      } catch (gamificationErr) {
        // Log the error but don't fail the entire submission
        console.error('Gamification error in kabel-lan submission:', gamificationErr);
        gamificationError = gamificationErr.message;
        // Still award the XP even if gamification fails
        expGained = 1000;
      }
    }

    // Save to database
    const result = await prisma.hasilSimulasi.create({
      data: {
        userId: authUser.id,
        idSimulasi: 'kabel-lan',
        skor: calculatedScore,
        waktuPenyelesaian: timeSpent || 0,
        status: isPerfect ? 'selesai' : 'parsial',
        correctConnections: correctCount,
        totalConnections: 8,
        isValid: isPerfect,
      },
    });

    return Response.json({
      success: true,
      result: {
        id: result.id,
        score: calculatedScore,
        correctCount: correctCount,
        isValid: isPerfect,
        expGained,
        levelUp,
        unlockedAchievements
      },
      ...(gamificationError && { warning: `Gamification error: ${gamificationError}` })
    });
  } catch (error) {
    console.error('Error in kabel-lan submission:', error);
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
