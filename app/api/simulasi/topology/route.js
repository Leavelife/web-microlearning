import { prisma } from '@/lib/prisma';
import { calculateScore } from '@/lib/topology-validator';
import { NODE_LAYOUTS } from '@/lib/topology-types';
import { TOPOLOGY_CONFIG } from '@/lib/topology-config';
import { requireAuth } from '@/lib/auth-guard';
import { gamificationEngine } from '@/lib/gamification';

// Map topology type to difficulty level
function getTopologyDifficulty(topologyType) {
  const config = TOPOLOGY_CONFIG[topologyType];
  if (!config) return 'medium'; // default
  return config.difficulty; // 'easy', 'medium', 'hard'
}

// Map difficulty to event type
function getDifficultyEventType(difficulty) {
  const difficultyMap = {
    'easy': 'SIMULASI_TOPOLOGY_MUDAH',
    'medium': 'SIMULASI_TOPOLOGY_SEDANG',
    'hard': 'SIMULASI_TOPOLOGY_SULIT',
  };
  return difficultyMap[difficulty] || 'SIMULASI_TOPOLOGY_SEDANG';
}

export async function POST(req) {
  try {
    const authUser = await requireAuth();

    const body = await req.json();
    const { topologyType, nodes, edges, timeSpent } = body;

    // Validate input
    if (!topologyType || !nodes || !edges) {
      return Response.json(
        { error: 'Missing required fields: topologyType, nodes, edges' },
        { status: 400 }
      );
    }

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return Response.json(
        { error: 'nodes and edges must be arrays' },
        { status: 400 }
      );
    }

    // Get correct edges from topology layout
    const correctEdges = NODE_LAYOUTS[topologyType]?.correctEdges || [];

    // Calculate score and validate topology
    const scoreResult = calculateScore(nodes, edges, topologyType, correctEdges, timeSpent || 0);

    // Get user from auth
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Check BEFORE saving: has user completed this topology before?
    let isFirstCompletion = false;
    if (scoreResult.isValid) {
      const previousCompletion = await prisma.hasilSimulasi.findFirst({
        where: {
          userId: authUser.id,
          idSimulasi: `topology-${topologyType}`,
          isValid: true, // Only count valid/completed attempts
        },
      });
      isFirstCompletion = !previousCompletion;
    }

    // Save to database
    const result = await prisma.hasilSimulasi.create({
      data: {
        userId: user.id,
        idSimulasi: `topology-${topologyType}`,
        topologyType,
        skor: scoreResult.score,
        waktuPenyelesaian: timeSpent || 0,
        status: scoreResult.isValid ? 'selesai' : 'parsial',
        correctConnections: scoreResult.correctCount,
        totalConnections: edges.length,
        isValid: scoreResult.isValid,
      },
    });

    // Award XP if topology is valid AND first completion
    let expGained = 0;
    let levelUp = null;
    let unlockedAchievements = [];
    
    if (scoreResult.isValid && isFirstCompletion) {
      try {
        const difficulty = getTopologyDifficulty(topologyType);
        const eventType = getDifficultyEventType(difficulty);
        
        const gamificationResult = await gamificationEngine({
          userId: authUser.id,
          event: {
            type: eventType,
          }
        });
        
        expGained = gamificationResult.expGained;
        levelUp = gamificationResult.levelUp;
        unlockedAchievements = gamificationResult.unlockedAchievements;
      } catch (gamificationErr) {
        console.error('Gamification error in topology submission:', gamificationErr);
      }
    }

    return Response.json({
      success: true,
      result: {
        id: result.id,
        score: scoreResult.score,
        isValid: scoreResult.isValid,
        errors: scoreResult.errors,
        feedback: scoreResult.feedback,
        correctCount: scoreResult.correctCount,
        totalCorrect: scoreResult.totalCorrect,
        details: scoreResult.details,
        expGained,
        levelUp,
        unlockedAchievements,
      },
    });
  } catch (error) {
    console.error('Error in topology submission:', error);
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
