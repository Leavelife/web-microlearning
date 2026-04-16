import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req) {
  try {
    const authUser = await requireAuth();

    // Get all valid topology completions for this user
    const completions = await prisma.hasilSimulasi.findMany({
      where: {
        userId: authUser.id,
        idSimulasi: {
          startsWith: 'topology-',
        },
        isValid: true, // Only completed topologies
      },
      select: {
        idSimulasi: true,
      },
      distinct: ['idSimulasi'], // Get unique topology types
    });

    // Extract topology types from idSimulasi (e.g., "topology-star" -> "star")
    const completed = completions.map(c => 
      c.idSimulasi.replace('topology-', '')
    );

    return Response.json({
      success: true,
      completed,
    });
  } catch (error) {
    console.error('Error fetching completed topologies:', error);
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}
