"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Navbar() {
  const [userExp, setUserExp] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const maxExp = 1000

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")

        if (!response.ok) {
          setIsLoggedIn(false)
          setIsAdmin(false)
          return
        }

        const data = await response.json()
        setIsLoggedIn(true)
        setIsAdmin(data.user?.role === "admin")
      } catch (error) {
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-white">
        MICROLAB
      </Link>

      {/* Menu Items */}
      <div className="flex gap-8 text-white">
        {isAdmin && (
          <Link href="/admin/dashboard" className="hover:text-purple-200 transition font-medium">
            Dashboard
          </Link>
        )}
        <Link href="/" className="hover:text-purple-200 transition font-medium">
          Home
        </Link>
        <Link href="/learn" className="hover:text-purple-200 transition font-medium">
          Materi
        </Link>
        <Link href="/quiz" className="hover:text-purple-200 transition font-medium">
          Quiz
        </Link>
        <Link href="/simulasi" className="hover:text-purple-200 transition font-medium">
          Simulasi
        </Link>
      </div>

      {/* Experience Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{userExp} Exp</span>
          <div className="w-32 h-2 bg-purple-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${(userExp / maxExp) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-purple-400"></div>

        {/* User Profile / Login Button */}
        {isLoggedIn === null ? null : isLoggedIn ? (
          <Link href="/profile" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-purple-100 transition">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 24 24"
                >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
          </Link>
        ) : (
          <Link
            href="/login"
            className="px-6 py-2 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-100 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}