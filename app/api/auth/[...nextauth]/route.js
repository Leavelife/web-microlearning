import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/auth"
import { cookies } from "next/headers"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async signIn({ user }) {
            let dbUser = await prisma.user.findUnique({
                where: { email: user.email },
            })

            if (!dbUser) {
                dbUser = await prisma.user.create({
                    data: {
                    username: user.name,
                    email: user.email,
                    role: "user",
                    },
                })
            }

            const token = generateToken(dbUser)

            const cookieStore = await cookies()
            cookieStore.set("token", token, {
                httpOnly: true,
                path: "/",
            })
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email
            }
            return token
        },
        
        async session({ session, token }) {
            session.user.email = token.email
            return session
        },
        async redirect({ url, baseUrl }) {
            // Redirect ke home page setelah sign in berhasil
            return baseUrl
        },
    }
})

export { handler as GET, handler as POST }