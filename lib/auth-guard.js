import { cookies } from "next/headers"
import { getUserFromToken } from "./auth"

export async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    throw new Error("UNAUTHORIZED")
  }

  const user = getUserFromToken(token)

  if (!user) {
    throw new Error("UNAUTHORIZED")
  }

  return user
}

export async function requireRole(role) {
  const user = await requireAuth()

  if (user.role !== role) {
    throw new Error("FORBIDDEN")
  }

  return user
}