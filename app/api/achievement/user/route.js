import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Ambil user dari JWT
async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return null
  }
}

// GET /api/achievement/user
export async function GET(req) {
  const user = await getUserFromToken()

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  const userId = user.id

  try {
    // ambil query param (optional filter)
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")

    const achievements = await prisma.achievement.findMany({
      where: type ? { eventType: type } : {},
      include: {
        userAchievements: {
          where: {
            userId: userId
          }
        }
      }
    })

    // transform data
    const result = achievements.map((a) => {
      const unlocked = a.userAchievements.length > 0

      return {
        id: a.id,
        nama: a.nama,
        deskripsi: a.deskripsi,
        image: a.urlGambar,
        exp: a.expReward,

        eventType: a.eventType,
        eventKey: a.eventKey,

        isUnlocked: unlocked,
        tanggalDidapat: unlocked
          ? a.userAchievements[0].tanggalDidapat
          : null
      }
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error("ACHIEVEMENT_API_ERROR:", error)

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}