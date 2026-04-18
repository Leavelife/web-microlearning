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
                level: true
            }
        })

        // hitung total EXP
        const totalExp = data.totalExp

        // ambil level sekarang
        const currentLevel = data.level || null

        const globalRanking = await prisma.user.count({
            where: {
                totalExp: {
                    gt: totalExp
                }
            }
        }) + 1

        let regionRanking = null

        if (data.wilayah) {
            regionRanking = await prisma.user.count({
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
            role: data.role,
            wilayah: data.wilayah,
            image: data.image,
            editCount: data.editCount,
            totalExp,
            level: currentLevel,
            badge: currentLevel?.urlGambar || null,
            topAchievements: data.achievements.map(a => ({
                ...a.achievement,
                tanggalDidapat: a.tanggalDidapat
            })),
            ranking: globalRanking,
            rankingWilayah: regionRanking
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
        if (existing.editCount >= 3) {
            return Response.json(
                { message: "Batas edit sudah habis (max 3x)" },
                { status: 403 }
            )
        }

        let nextImage = existing.image
        if (body.image !== undefined) {
            if (body.image === null || body.image === "") {
                nextImage = null
            } else if (typeof body.image === "string" && body.image.startsWith("data:image/")) {
                // Simpan data URL, batasi panjang string agar tidak berlebihan.
                if (body.image.length > 3 * 1024 * 1024) {
                    return Response.json(
                        { message: "Ukuran gambar terlalu besar" },
                        { status: 400 }
                    )
                }
                nextImage = body.image
            } else {
                return Response.json(
                    { message: "Format gambar tidak valid" },
                    { status: 400 }
                )
            }
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                username: body.username ?? existing.username,
                wilayah: body.wilayah ?? existing.wilayah,
                image: nextImage,
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