'use client'

import { useEffect, useState } from "react"
import Image from "next/image"

export default function LeaderboardPanel({ userWilayah }) {
  const [mode, setMode] = useState("global")
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true)
      setError(null)

      try {
        const query = new URLSearchParams({
          type: mode,
          limit: "10"
        })

        if (mode === "wilayah" && userWilayah) {
          query.set("wilayah", userWilayah)
        }

        const res = await fetch(`/api/leaderboard?${query.toString()}`, {
          cache: "no-store"
        })

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}))
          throw new Error(payload?.message || "Gagal memuat leaderboard")
        }

        const payload = await res.json()
        setLeaderboard(payload.data || [])
      } catch (err) {
        setError(err.message || "Terjadi kesalahan")
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [mode, userWilayah])

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Leaderboard
            </p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              Peringkat Player
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Lihat ranking teratas berdasarkan EXP global atau wilayah Anda.
            </p>
          </div>
          <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm">
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === "global"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-600 hover:bg-white/80"
              }`}
              onClick={() => setMode("global")}
            >
              Global
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === "wilayah"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-600 hover:bg-white/80"
              } ${!userWilayah ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => userWilayah && setMode("wilayah")}
              disabled={!userWilayah}
            >
              Wilayah
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-sm text-slate-600">
            {mode === "global"
              ? "Menampilkan leaderboard global berdasarkan total EXP."
              : userWilayah
                ? `Menampilkan leaderboard wilayah ${userWilayah}.`
                : "Masukkan wilayah di profil untuk melihat leaderboard regional."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-500">Memuat leaderboard...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-sm text-gray-500">Tidak ada data leaderboard untuk mode ini.</p>
        ) : (
          <ol className="space-y-3">
            {leaderboard.map((item, idx) => {
              const rank = item.rank || idx + 1;
              const isTop3 = rank <= 3;
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-4 rounded-3xl border border-gray-100 bg-gradient-to-r ${
                    isTop3
                      ? 'from-yellow-100 via-yellow-50 to-white' // highlight top 3
                      : 'from-slate-50 to-white'
                  } p-4 shadow-sm hover:scale-[1.01] transition-transform`}
                >
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl bg-white border border-yellow-200">
                    {isTop3 ? (
                      <Image
                        src="/badges/trophy.svg"
                        alt={`Trophy rank ${rank}`}
                        width={32}
                        height={32}
                        className="drop-shadow-md"
                      />
                    ) : (
                      <Image
                        src="/badges/medal.svg"
                        alt={`Medal rank ${rank}`}
                        width={32}
                        height={32}
                        className="drop-shadow-sm"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${isTop3 ? 'text-yellow-600' : 'text-blue-700'}`}>#{rank}</span>
                      <span className="text-sm font-semibold text-slate-900 truncate">{item.username}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 truncate">
                      {item.wilayah ? `Wilayah ${item.wilayah}` : "Global"}
                    </p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-base font-bold text-blue-900">{item.totalExp?.toLocaleString() ?? 0} <span className="text-xs font-medium text-slate-500">EXP</span></p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  )
}
