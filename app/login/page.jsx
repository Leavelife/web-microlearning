"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid")
      return false
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login gagal")
      } else {
        window.location.href = "/"
      }
    } catch (err) {
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden flex">

        {/* LEFT SIDE (ILLUSTRATION) */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <Image
            src="/login.svg"
            alt="Login Illustration"
            className="w-full max-w-lg h-auto"
            width={400}
            height={400}
            loading="eager"
          />
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6">
            LOGIN <br /> KE MICROLAB
          </h2>

          {error && (
            <p className="text-red-500 mb-4 text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Masukkan Email Anda"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                className="w-full border-b border-gray-400 focus:border-purple-600 outline-none py-2 bg-transparent"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Masukkan Password Anda"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("")
                }}
                className="w-full border-b border-gray-400 focus:border-purple-600 outline-none py-2 bg-transparent"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-md shadow-md hover:opacity-90 transition"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* GOOGLE LOGIN */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Login Menggunakan
          </div>

          <button
            onClick={() => signIn("google")}
            className="w-full mt-3 bg-gray-100 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Google
          </button>

          {/* REGISTER */}
          <p className="text-center text-sm mt-6">
            Belum Memiliki Akun?{" "}
            <a href="/register" className="text-purple-600 font-medium">
              Register Disini
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}