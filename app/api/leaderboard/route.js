import { prisma } from "@/lib/prisma"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)

    const type = searchParams.get("type") || "global"
    const limit = parseInt(searchParams.get("limit")) || 10
    const page = parseInt(searchParams.get("page")) || 1

    const skip = (page - 1) * limit

    // filter wilayah (optional)
    let whereClause = {}

    if (type === "wilayah") {
      const wilayah = searchParams.get("wilayah")

      if (!wilayah) {
        return Response.json(
          { message: "Wilayah wajib untuk leaderboard wilayah" },
          { status: 400 }
        )
      }

      whereClause.wilayah = wilayah
    }

    // ambil leaderboard
    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        totalExp: "desc"
      },
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        wilayah: true,
        totalExp: true,
        image: true
      }
    })

    // tambahin ranking number
    const leaderboard = users.map((user, index) => ({
      rank: skip + index + 1,
      ...user
    }))

    return Response.json({
      page,
      limit,
      type,
      data: leaderboard
    })
  } catch (err) {
    console.error(err)
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}