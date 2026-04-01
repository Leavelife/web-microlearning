import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

async function getUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) throw new Error("Unauthorized")

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
}

export async function GET() {
    try {
        const user = await getUser()

        // ambil user + relasi penting
        const data = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                achievements: {
                    include: {
                        achievement: true
                    },
                    take: 3,
                    orderBy: {
                        tanggalDidapat: "desc"
                    }
                },
                levels: {
                    include: {
                        level: true
                    },
                    orderBy: {
                        tanggalDidapat: "desc"
                    },
                    take: 1 // ambil level terakhir
                }
            }
        })

        // hitung total EXP
        const totalExp = data.totalExp

        // ambil level sekarang
        const currentLevel = data.levels[0]?.level || null

        // ranking (jika ada wilayah)
        let ranking = null

        if (data.wilayah) {
            ranking = await prisma.user.count({
                where: {
                    wilayah: data.wilayah,
                    totalExp: {
                        gt: totalExp
                    }
                }
            }) + 1
        }

        return Response.json({
            username: data.username,
            email: data.email,
            wilayah: data.wilayah,
            totalExp,
            level: currentLevel,
            badge: currentLevel?.urlGambar || null,
            topAchievements: data.achievements.map(a => a.achievement),
            ranking
        })
    } catch (err) {
        return Response.json(
            { message: err.message },
            { status: 401 }
        )
    }
}

export async function PATCH(req) {
    try {
        const user = await getUser()
        const body = await req.json()

        const existing = await prisma.user.findUnique({
            where: { id: user.id }
        })

        // limit edit
        if (existing.editCount >= 2) {
            return Response.json(
                { message: "Batas edit sudah habis (max 2x)" },
                { status: 403 }
            )
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                username: body.username ?? existing.username,
                wilayah: body.wilayah ?? existing.wilayah,
                editCount: {
                increment: 1
                }
            }
        })

        return Response.json({
            message: "Profile berhasil diupdate",
            user: updated
        })
    } catch (err) {
        return Response.json(
            { message: err.message },
            { status: 500 }
        )
    }
}