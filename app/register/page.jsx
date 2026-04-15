"use client"

import { useState } from "react"
import Image from "next/image"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const validateForm = () => {
    if (!username.trim()) {
      setError("Username tidak boleh kosong")
      return false
    }
    if (username.length < 3) {
      setError("Username minimal 3 karakter")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid")
      return false
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return false
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registrasi gagal")
      } else {
        setSuccess("Registrasi berhasil!.")
        // Reset form
        setUsername("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        // Auto login after registration
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      }
    } catch (err) {
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex">
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-bold mb-6">REGISTER <br /> KE MICROLAB</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Masukkan Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (error) setError("")
              }}
              minLength="3"
              required
              className="w-full border-b border-gray-400 focus:border-purple-600 outline-none py-2 bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Masukkan Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError("")
              }}
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              required
              className="w-full border-b border-gray-400 focus:border-purple-600 outline-none py-2 bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError("")
                }}
                minLength="6"
                required
                className="w-full border-b border-gray-400 focus:border-purple-600 outline-none py-2 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (error) setError("")
                }}
                minLength="6"
                required
                className="w-full border-b border-gray-400 focus:border-purple-600 outline-none py-2 bg-transparent"
                placeholder="Konfirmasi Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-md shadow-md hover:opacity-90 transition"
          >
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{" "}
              <a href="/login" className="text-indigo-600 hover:text-indigo-500">
                Login di sini
              </a>
            </p>
          </div>
        </form>
        <div className="hidden md:flex w-1/2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 items-center justify-center">
          <Image
            src="/register.svg"
            alt="Register Illustration"
            className="w-full max-w-lg h-auto"
            width={400}
            height={400}
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}
