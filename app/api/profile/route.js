import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { mkdir, writeFile, unlink } from "fs/promises"
import path from "path"

const UPLOAD_SEGMENT = "uploads"
const PROFILE_DIR = "profile"
const MAX_BYTES = 2 * 1024 * 1024

async function getUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) throw new Error("Unauthorized")

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
}

function safePublicFilePath(relativeUrl) {
    if (!relativeUrl || typeof relativeUrl !== "string") return null
    if (!relativeUrl.startsWith(`/${UPLOAD_SEGMENT}/${PROFILE_DIR}/`)) return null
    const rel = relativeUrl.replace(/^\/+/, "")
    const full = path.join(process.cwd(), "public", rel)
    const pubRoot = path.join(process.cwd(), "public", UPLOAD_SEGMENT, PROFILE_DIR)
    if (!full.startsWith(pubRoot)) return null
    return full
}

function extFromMime(mime) {
    if (mime === "image/jpeg" || mime === "image/jpg") return "jpg"
    if (mime === "image/png") return "png"
    if (mime === "image/webp") return "webp"
    if (mime === "image/gif") return "gif"
    return null
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
                const ext = extFromMime(file.type)
                if (!ext) {
                    return Response.json(
                        { message: "Format gambar tidak didukung (gunakan JPG, PNG, WebP, atau GIF)", error: "Format tidak didukung" },
                        { status: 400 }
                    )
                }

                const dir = path.join(process.cwd(), "public", UPLOAD_SEGMENT, PROFILE_DIR)
                await mkdir(dir, { recursive: true })

                const filename = `${user.id}-${Date.now()}.${ext}`
                const buffer = Buffer.from(await file.arrayBuffer())
                const diskPath = path.join(dir, filename)
                await writeFile(diskPath, buffer)

                const oldPath = safePublicFilePath(existing.image)
                if (oldPath) {
                    try {
                        await unlink(oldPath)
                    } catch {
                        /* file lama mungkin sudah tidak ada */
                    }
                }

                nextImage = `/${UPLOAD_SEGMENT}/${PROFILE_DIR}/${filename}`
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
                        body.image.startsWith(`/${UPLOAD_SEGMENT}/`) ||
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
