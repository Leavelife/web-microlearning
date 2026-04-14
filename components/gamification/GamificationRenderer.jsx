"use client"

import { useEffect } from "react"
import { useGamification } from "./GamificationProvider"

export default function GamificationRenderer() {
  const { current, next, animateExp } = useGamification()

  // trigger animasi hanya saat EXP muncul
  useEffect(() => {
    if (current?.type === "EXP") {
      animateExp(current.newTotalExp)
    }
  }, [current])

  if (!current) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0f172a] text-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn text-center">
        
        {/* EXP */}
        {current.type === "EXP" && (
          <>
            <h2 className="text-lg font-semibold mb-2">⚡ EXP Gained</h2>
            <p className="text-yellow-400 text-2xl font-bold">
              +{current.value}
            </p>

            <button
              onClick={next}
              className="w-full mt-4 bg-blue-500 py-2 rounded-xl"
            >
              OK
            </button>
          </>
        )}

        {/* LEVEL UP */}
        {current.type === "LEVEL" && (
          <>
            <h2 className="text-green-400 font-bold text-xl mb-2">
              LEVEL UP!
            </h2>
            <p className="text-lg">{current.value.nama}</p>

            <button
              onClick={next}
              className="w-full mt-4 bg-blue-500 py-2 rounded-xl"
            >
              Lanjut
            </button>
          </>
        )}

        {/* ACHIEVEMENT */}
        {current.type === "ACHIEVEMENT" && (
          <>
            <h2 className="text-purple-400 font-bold mb-2">
              Achievement Unlocked
            </h2>

            <img
              src={current.value.urlGambar}
              className="w-16 mx-auto my-3"
            />

            <p className="font-semibold">{current.value.nama}</p>
            <p className="text-sm text-gray-400">
              {current.value.deskripsi}
            </p>

            <button
              onClick={next}
              className="w-full mt-4 bg-blue-500 py-2 rounded-xl"
            >
              Lanjut
            </button>
          </>
        )}

      </div>
    </div>
  )
}