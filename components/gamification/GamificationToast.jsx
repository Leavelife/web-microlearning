"use client"

import { useGamification } from "./GamificationProvider"

export default function GamificationToast() {
  const { toast } = useGamification()

  if (!toast) return null

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">
      {/* EXP Toast */}
      {toast.type === "EXP" && (
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-5 py-3 rounded-xl shadow-2xl border border-yellow-200/50 flex items-center gap-3 backdrop-blur-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 animate-bounce">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide">EXP Gained</p>
            <p className="text-2xl font-bold text-slate-950">+{toast.value}</p>
          </div>
        </div>
      )}

      {/* Level Up Toast */}
      {toast.type === "LEVEL" && (
        <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white px-5 py-3 rounded-xl shadow-2xl border border-green-200/50 flex items-center gap-3 backdrop-blur-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 animate-pulse">
            <span className="text-xl">🏆</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">Level Up!</p>
            <p className="text-lg font-bold">{toast.value.nama}</p>
          </div>
        </div>
      )}

      {/* Achievement Toast */}
      {toast.type === "ACHIEVEMENT" && (
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-5 py-3 rounded-xl shadow-2xl border border-pink-200/50 flex items-center gap-3 backdrop-blur-sm">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 animate-spin" style={{ animationDuration: "2s" }}>
            <span className="text-xl">⭐</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide">Achievement!</p>
            <p className="text-sm font-bold line-clamp-1">{toast.value.nama}</p>
          </div>
        </div>
      )}
    </div>
  )
}