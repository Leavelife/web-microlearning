"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => signIn("google")}
        className="px-6 py-3 bg-red-500 text-white rounded-xl"
      >
        Login with Google
      </button>
    </div>
  )
}