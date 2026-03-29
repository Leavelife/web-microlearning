import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req) {
  const body = await req.json()
  const { username, email, password } = body

  // cek email sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return Response.json({ error: "Email already used" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: "user",
      wilayah: ""
    }
  })

  return Response.json({ message: "Register success" })
}