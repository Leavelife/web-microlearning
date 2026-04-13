"use client"

import { useGamification } from "./GamificationProvider"

export default function GamificationToast() {
  const { toast } = useGamification()

  if (!toast) return null

  return (
    <div className="fixed top-5 right-5 z-50 animate-slideIn">
      <div className="bg-[#0f172a] text-white px-4 py-3 rounded-xl shadow-lg border border-yellow-400/30 flex items-center gap-2">
        {toast.type === "EXP" && (
          <>
            <span className="text-yellow-400 font-bold">
              +{toast.value} EXP
            </span>
          </>
        )}
        {toast.type === "LEVEL" && (
          <span className="text-green-300 font-bold">
            Level up! {toast.value.nama}
          </span>
        )}
        {toast.type === "ACHIEVEMENT" && (
          <span className="text-purple-300 font-bold">
            Achievement unlocked: {toast.value.nama}
          </span>
        )}

      </div>
    </div>
  )
}