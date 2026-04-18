import { prisma } from "@/lib/prisma"

export async function GET() {
  const levels = await prisma.level.findMany({
    orderBy: {
      minExp: "asc",
    },
  })

  return Response.json(levels)
}