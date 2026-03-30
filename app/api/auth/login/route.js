import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req) {
  const body = await req.json()
  const { email, password } = body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return Response.json({ error: "User Tidak Ditemukan" }, { status: 404 })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return Response.json({ error: "Password Salah" }, { status: 401 })
  }

  const token = generateToken(user)

 const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // buat localhost
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 hari
  })

  return Response.json({
    message: "Login berhasil"
  })
}