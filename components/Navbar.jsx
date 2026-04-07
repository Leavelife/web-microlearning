"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Navbar() {
  const [userExp, setUserExp] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
        setUserExp(data.user?.exp || 0)
      } catch (error) {
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <>
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-[#6F27FF] shadow-lg">
        
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-white">
          MICROLAB
        </Link>

        {/* ===== MENU (ONLY LG) ===== */}
        <div className="hidden lg:flex items-center gap-8 text-white">
          {isAdmin && <Link href="/admin/dashboard">Dashboard</Link>}
          <Link href="/">Home</Link>
          <Link href="/learn">Materi</Link>
          <Link href="/quiz">Quiz</Link>
          <Link href="/simulasi">Simulasi</Link>
        </div>

        {/* ===== RIGHT SECTION ===== */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* ===== EXP BAR (ONLY MD+) ===== */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-white font-semibold text-sm">{userExp} Exp</span>
            <div className="w-24 lg:w-32 h-2 bg-purple-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${(userExp / maxExp) * 100}%` }}
              />
            </div>
          </div>

          {/* ===== AUTH (ONLY LG) ===== */}
          <div className="hidden lg:block">
            {isLoggedIn === null ? null : isLoggedIn ? (
              <Link href="/profile" className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </Link>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-white text-purple-600 rounded-full">
                Login
              </Link>
            )}
          </div>

          {/* ===== HAMBURGER (MD DOWN) ===== */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ===== OVERLAY ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div className={`fixed top-17 right-0 h-1/2 w-full rounded-xl bg-white text-[#6F27FF] font-semibold z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        <div className="p-6 flex flex-col gap-6">
          <button onClick={() => setIsOpen(false)} className="self-end text-xl">
            ✕
          </button>

          {isAdmin && <Link href="/admin/dashboard">Dashboard</Link>}
          <Link href="/">Home</Link>
          <Link href="/learn">Materi</Link>
          <Link href="/quiz">Quiz</Link>
          <Link href="/simulasi">Simulasi</Link>

          <hr className="border-purple-400" />

          {isLoggedIn === null ? null : isLoggedIn ? (
            <Link href="/profile">Profile</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </>
  )
}