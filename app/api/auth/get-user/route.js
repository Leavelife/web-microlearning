import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-guard"

export async function GET() {
  try {
    // hanya admin
    await requireRole("admin")

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    })

    return Response.json({ users })

  } catch (err) {
    if (err.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (err.message === "FORBIDDEN") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}