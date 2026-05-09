"use client"

import { useCallback, useEffect, useState } from "react"
import BadgeGrid from "@/components/achievement/BadgeGrid"
import Navbar from "@/components/Navbar"

const FILTERS = [
  { key: "SEMUA",       label: "Semua" },
  { key: "PROGRES",     label: "Progres" },
  { key: "SKILLS",      label: "Skills" },
  { key: "QUIZ",        label: "Quiz" },
  { key: "KONSISTENSI", label: "Konsistensi" },
  { key: "SPESIAL",     label: "Spesial" },
]

/* ── Stat pill ───────────────────────────────────────────────── */
function StatPill({ label, value, accent }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl px-6 py-4 text-center ${accent}`}>
      <span className="text-2xl font-bold leading-none">{value}</span>
      <span className="mt-1 text-xs font-medium uppercase tracking-widest opacity-70">{label}</span>
    </div>
  )
}

export default function AchievementPage() {
  const [data,    setData]    = useState([])
  const [filter,  setFilter]  = useState("SEMUA")
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchAchievements = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const query = filter === "SEMUA" ? "" : `?type=${encodeURIComponent(filter)}`
      const res = await fetch(`/api/achievement/user${query}`, {
        credentials: "include",
      })

      if (res.status === 401) {
        setData([])
        setError({
          status: 401,
          title: "Akses tidak tersedia",
          message: "Silakan masuk terlebih dahulu untuk melihat prestasi Anda.",
        })
        return
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        setData([])
        setError({
          status: res.status,
          title: "Gagal memuat prestasi",
          message: payload?.message || "Terjadi masalah saat mengambil data prestasi.",
        })
        return
      }

      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("FETCH_ACHIEVEMENTS_ERROR:", err)
      setData([])
      setError({
        status: 500,
        title: "Terjadi kesalahan",
        message: "Tidak dapat memuat data prestasi saat ini. Coba lagi nanti.",
      })
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  /* derived stats */
  const total    = data.length
  const unlocked = data.filter((d) => d.isUnlocked).length
  const locked   = total - unlocked
  const pct      = total > 0 ? Math.round((unlocked / total) * 100) : 0

  return (
    <>
      <Navbar />

      {/* ── Page wrapper ───────────────────────────────────────── */}
      <div
        className="min-h-screen pt-16"
        style={{ background: "white" }}
      >
        {/* ── Hero / header section ──────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/8 px-6 py-14 text-white">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 right-0 h-60 w-60 rounded-full bg-cyan-500/15 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400 mb-2">
              Galeri Prestasi
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-black">
              Achievement &amp; Badge
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Kumpulkan badge dengan menyelesaikan materi, kuis, dan tantangan.
              Setiap pencapaian mencerminkan perjalanan belajarmu.
            </p>

            {/* ── Stats row ───────────────────────────────────── */}
            {!loading && !error && (
              <div className="mt-8 flex flex-wrap gap-3">
                <StatPill
                  label="Total Badge"
                  value={total}
                  accent="bg-black/8 text-violet-800"
                />
                <StatPill
                  label="Dimiliki"
                  value={unlocked}
                  accent="bg-emerald-500/20 text-violet-800"
                />
                <StatPill
                  label="Terkunci"
                  value={locked}
                  accent="bg-slate-700/50 text-violet-800"
                />
                <StatPill
                  label="Progres"
                  value={`${pct}%`}
                  accent="bg-violet-500/20 text-violet-800"
                />
              </div>
            )}

            {/* ── Progress bar ──────────────────────────────── */}
            {!loading && !error && total > 0 && (
              <div className="mt-5 max-w-sm">
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  {unlocked} dari {total} badge terbuka
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-6 py-10">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-3xl border border-white/8 bg-white/4 p-5 h-72"
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-400">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">{error.title}</h2>
              <p className="max-w-sm text-sm text-slate-400">{error.message}</p>
              {error.status !== 401 && (
                <button
                  onClick={fetchAchievements}
                  className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  Coba Lagi
                </button>
              )}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && data.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-violet-400">
                  <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.798 49.798 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Belum ada badge di kategori ini</h2>
              <p className="max-w-sm text-sm text-slate-400">
                Selesaikan aktivitas belajar untuk membuka achievement baru.
              </p>
              {filter !== "SEMUA" && (
                <button
                  onClick={() => setFilter("SEMUA")}
                  className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm text-white hover:bg-white/10 transition"
                >
                  Lihat Semua Badge
                </button>
              )}
            </div>
          )}

          {/* Badge grid */}
          {!loading && !error && data.length > 0 && (
            <BadgeGrid data={data} />
          )}
        </div>
      </div>
    </>
  )
}