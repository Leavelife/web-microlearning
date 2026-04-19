import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { uploadProfileImage, deleteProfileImage } from "@/lib/cloudinary-upload"

const MAX_BYTES = 2 * 1024 * 1024

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
        const contentType = req.headers.get("content-type") || ""

        const existing = await prisma.user.findUnique({
            where: { id: user.id }
        })

        if (existing.editCount >= 3) {
            return Response.json(
                { message: "Batas edit sudah habis (max 3x)", error: "Batas edit sudah habis (max 3x)" },
                { status: 403 }
            )
        }

        let nextUsername = existing.username
        let nextWilayah = existing.wilayah
        let nextImage = existing.image

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData()
            const u = formData.get("username")
            const w = formData.get("wilayah")
            if (u !== null && u !== undefined) nextUsername = String(u).trim() || existing.username
            if (w !== null && w !== undefined) nextWilayah = String(w).trim() || null

            const file = formData.get("avatar")
            const isFile =
                file &&
                typeof file === "object" &&
                "arrayBuffer" in file &&
                typeof file.size === "number" &&
                file.size > 0

            if (isFile) {
                if (!file.type || !file.type.startsWith("image/")) {
                    return Response.json(
                        { message: "File harus berupa gambar", error: "File harus berupa gambar" },
                        { status: 400 }
                    )
                }
                if (file.size > MAX_BYTES) {
                    return Response.json(
                        { message: "Ukuran gambar maksimal 2MB", error: "Ukuran gambar maksimal 2MB" },
                        { status: 400 }
                    )
                }

                try {
                    const buffer = Buffer.from(await file.arrayBuffer())
                    const filename = `profile-${user.id}-${Date.now()}`
                    
                    // Upload to Cloudinary
                    const result = await uploadProfileImage(buffer, filename)
                    nextImage = result.secure_url

                    // Delete old image from Cloudinary if exists
                    if (existing.image && existing.image.includes("cloudinary")) {
                        const publicId = `web-microlearning/profiles/profile-${user.id}`
                        await deleteProfileImage(publicId)
                    }
                } catch (error) {
                    console.error("Cloudinary upload error:", error)
                    return Response.json(
                        { message: "Gagal mengunggah gambar ke Cloudinary", error: error.message },
                        { status: 500 }
                    )
                }
            }
        } else {
            const body = await req.json()
            if (body.username !== undefined) nextUsername = String(body.username).trim() || existing.username
            if (body.wilayah !== undefined) nextWilayah = body.wilayah === "" || body.wilayah === null ? null : String(body.wilayah)

            if (body.image !== undefined) {
                if (body.image === null || body.image === "") {
                    nextImage = null
                } else if (typeof body.image === "string") {
                    if (body.image.startsWith("data:")) {
                        return Response.json(
                            {
                                message: "Unggah foto lewat form edit profil; data base64 tidak lagi didukung.",
                                error: "Gunakan unggah file untuk foto profil",
                            },
                            { status: 400 }
                        )
                    }
                    if (
                        body.image.startsWith("/") ||
                        body.image.startsWith("http://") ||
                        body.image.startsWith("https://")
                    ) {
                        nextImage = body.image
                    } else {
                        return Response.json(
                            { message: "Format path gambar tidak valid", error: "Format path gambar tidak valid" },
                            { status: 400 }
                        )
                    }
                }
            }
        }

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                username: nextUsername,
                wilayah: nextWilayah,
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
        console.error(err)
        return Response.json(
            { message: err.message || "Terjadi kesalahan", error: err.message || "Terjadi kesalahan" },
            { status: 500 }
        )
    }
}
