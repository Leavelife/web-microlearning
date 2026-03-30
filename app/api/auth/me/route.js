import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-guard"

export async function GET() {
  try {
    const authUser = await requireAuth()

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    })

    return Response.json({ user })

  } catch (err) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
}