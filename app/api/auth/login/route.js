import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

export async function POST(req) {
  const body = await req.json()
  const { email, password } = body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return Response.json({ error: "Wrong password" }, { status: 401 })
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  const cookie = serialize("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })

  return new Response(
    JSON.stringify({ message: "Login success" }),
    {
      headers: {
        "Set-Cookie": cookie
      }
    }
  )
}