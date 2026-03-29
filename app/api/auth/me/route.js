import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get("token")?.value

  if (!token) {
    return Response.json({ user: null })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    return Response.json(user)
  } catch (err) {
    return Response.json({ user: null })
  }
}