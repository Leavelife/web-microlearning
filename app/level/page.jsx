"use client"

import { useEffect, useRef, useState } from "react"
import LevelCard from "@/components/level/LevelCard"
import Navbar from "@/components/Navbar"

function LevelPage() {
  const [levels, setLevels] = useState([])
  const [currentLevelId, setCurrentLevelId] = useState(null)
  const [currentExp, setCurrentExp] = useState(0)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const trackRef = useRef(null)
  const levelRefs = useRef([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelRes, profileRes] = await Promise.all([
          fetch("/api/level", { cache: "no-store" }),
          fetch("/api/profile", { cache: "no-store" }),
        ])

        if (!levelRes.ok) {
          const errorText = await levelRes.text()
          throw new Error(errorText || "Gagal memuat level")
        }

        const levelData = await levelRes.json()
        setLevels(levelData)

        if (profileRes.ok) {
          const userData = await profileRes.json()
          setCurrentLevelId(userData.level?.id ?? null)
          setCurrentExp(userData.totalExp ?? 0)

          if (userData.level?.minExp !== undefined && userData.level?.maxExp !== undefined) {
            const progress = Math.round(
              Math.min(
                100,
                Math.max(0, ((userData.totalExp ?? 0) - userData.level.minExp) / (userData.level.maxExp - userData.level.minExp) * 100)
              )
            )
            setCurrentProgress(progress)
          }
        }
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat memuat level")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (loading || !currentLevelId || !levels.length) return

    const currentIndex = levels.findIndex((level) => level.id === currentLevelId)
    const targetElement = levelRefs.current[currentIndex]

    if (targetElement && trackRef.current) {
      const scrollTarget = Math.max(
        0,
        targetElement.offsetLeft - (trackRef.current.clientWidth - targetElement.clientWidth) / 2
      )
      trackRef.current.scrollTo({ left: scrollTarget, behavior: "smooth" })
    }
  }, [loading, levels, currentLevelId])

  const currentIndex = levels.findIndex((level) => level.id === currentLevelId)
  const fillPercent = currentIndex >= 0
    ? Math.min(100, ((currentIndex + currentProgress / 100) / Math.max(levels.length - 1, 1)) * 100)
    : 0

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-white via-violet-100 to-violet-500 p-10 mt-15">
        <div className="mx-auto max-w-6xl space-y-10">
          <section className="rounded-4xl border border-violet-200 bg-white/90 p-8 shadow-xl shadow-violet-200/30 backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-600">Level Progression</p>
                <h1 className="mt-4 text-4xl font-bold text-slate-900 tracking-tight">Jalur Level Kamu</h1>
                <p className="mt-4 text-base leading-7 text-slate-600">Nikmati pengalaman UX yang langsung membawa kamu ke level saat ini. Slider mirip Clash Royale membuat perjalanan leveling terasa seperti arena game.</p>
              </div>
              <div className="rounded-3xl bg-violet-50 px-5 py-4 text-center ring-1 ring-violet-100">
                <p className="text-xs uppercase tracking-[0.28em] text-violet-500">Level Saat Ini</p>
                <p className="mt-3 text-3xl font-semibold text-violet-900">{currentIndex >= 0 ? levels[currentIndex]?.nama : "Pemula"}</p>
                <p className="mt-1 text-sm text-violet-600">{currentExp.toLocaleString()} EXP</p>
              </div>
            </div>

            <div className="mt-10 space-y-5">
              <div className="rounded-full bg-violet-100 p-4 shadow-inner shadow-violet-100/70">
                <div className="relative h-3 overflow-hidden rounded-full bg-slate-200/70">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${fillPercent}%` }} />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-violet-600">
                  <span>{levels[0]?.nama || "Level 1"}</span>
                  <span>{levels[levels.length - 1]?.nama || "Max Level"}</span>
                </div>
              </div>

              <div className="relative rounded-full bg-white/90 p-4 shadow-sm border border-violet-100">
                <div className="absolute inset-y-0 left-0 w-full bg-violet-200/40 blur-2xl" />
                <div className="relative flex items-center justify-between gap-3 overflow-hidden px-2 py-2">
                  {levels.map((level, index) => {
                    const isActive = level.id === currentLevelId
                    return (
                      <div key={level.id} className="relative flex flex-col items-center gap-2 text-center w-24 shrink-0">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full border-4 ${isActive ? 'border-violet-500 bg-white text-violet-900 shadow-[0_0_0_6px_rgba(167,139,250,0.12)]' : 'border-violet-200 bg-violet-100 text-violet-700'}`}>
                          <span className="font-semibold">{index + 1}</span>
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] leading-tight text-slate-700">{level.nama}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Level board</h2>
                <p className="mt-2 text-sm text-slate-600">Scroll otomatis ke level kamu saat memuat halaman, plus detail setiap level di bawah.</p>
              </div>
              <div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">Current EXP {currentExp.toLocaleString()}</div>
            </div>

            <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4" ref={trackRef}>
              <div className="flex gap-6 w-max px-2">
                {levels.map((level, index) => (
                  <div key={level.id} ref={(el) => { levelRefs.current[index] = el }} className="snap-center">
                    <LevelCard level={level} isCurrent={level.id === currentLevelId} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default LevelPage