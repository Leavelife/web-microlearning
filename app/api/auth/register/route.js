import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req) {
  const { username, email, password } = await req.json()

  // cek email sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return Response.json({ error: "Email sudah digunakan" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "user",
      wilayah: ""
    }, 
  })
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
    message: "Register berhasil"
  })
}