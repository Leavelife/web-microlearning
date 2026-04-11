import { prisma } from '@/lib/prisma';
import { calculateScore } from '@/lib/topology-validator';
import { NODE_LAYOUTS } from '@/lib/topology-types';
import { requireAuth } from '@/lib/auth-guard';

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
