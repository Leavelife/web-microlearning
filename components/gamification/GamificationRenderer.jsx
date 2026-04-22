"use client"

import { useEffect, useState } from "react"
import { useGamification } from "./GamificationProvider"

// Particle component untuk confetti effect
function Particle({ delay }) {
  return (
    <div
      className="fixed pointer-events-none animate-pulse"
      style={{
        left: Math.random() * 100 + "%",
        top: "-10px",
        animation: `fall ${2 + Math.random()}s linear forwards`,
        animationDelay: delay + "ms",
        opacity: Math.random() * 0.7 + 0.3,
      }}
    >
      <span className="text-2xl">
        {["⭐", "✨", "🎉", "🏆", "💫", "🎊", "⚡"][Math.floor(Math.random() * 7)]}
      </span>
    </div>
  )
}

export default function GamificationRenderer() {
  const { current, next, animateExp } = useGamification()
  const [particles, setParticles] = useState([])

  // Generate particles untuk EXP
  useEffect(() => {
    if (current?.type === "EXP") {
      setParticles(Array.from({ length: 5 }, (_, i) => i * 150))
    } else if (current?.type === "LEVEL") {
      setParticles(Array.from({ length: 8 }, (_, i) => i * 100))
    } else if (current?.type === "ACHIEVEMENT") {
      setParticles(Array.from({ length: 6 }, (_, i) => i * 120))
    }
  }, [current?.type])

  // trigger animasi hanya saat EXP muncul
  useEffect(() => {
    if (current?.type === "EXP") {
      animateExp(current.targetExp)
    }
  }, [current?.type, current?.targetExp, animateExp])

  if (!current) return null

  return (
    <>
      {/* Particles Background */}
      {particles.map((delay, idx) => (
        <Particle key={idx} delay={delay} />
      ))}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
        <style>{`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotateZ(360deg);
              opacity: 0;
            }
          }
          @keyframes scaleInBounce {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes shine {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
          }
        `}</style>

        <div className="w-full max-w-sm">
          {/* EXP POPUP */}
          {current.type === "EXP" && (
            <div
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-yellow-400/30 text-center animate-scaleInBounce"
              style={{ animation: "scaleInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-4xl animate-bounce">
                    ⚡
                  </div>
                </div>
              </div>

              {/* Header */}
              <h2 className="text-2xl font-black uppercase tracking-widest mb-2 bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                EXP Gained!
              </h2>
              <p className="text-sm text-slate-400 mb-6">Selamat! Kamu mendapat pengalaman</p>

              {/* EXP Value */}
              <div className="mb-8 py-6 px-6 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-400/50">
                <p className="text-5xl font-black text-yellow-300 mb-2">
                  +{current.value}
                </p>
                <p className="text-sm text-slate-300">Experience Points</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600">
                  <p className="text-xs text-slate-400 uppercase">Total EXP</p>
                  <p className="text-xl font-bold text-blue-300">{current.targetExp}</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600">
                  <p className="text-xs text-slate-400 uppercase">Progress</p>
                  <p className="text-xl font-bold text-green-300">
                    {Math.floor((current.value / (current.targetExp || 1)) * 100)}%
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={next}
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Lanjutkan
              </button>
            </div>
          )}

          {/* LEVEL UP POPUP */}
          {current.type === "LEVEL" && (
            <div
              className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white rounded-3xl p-8 shadow-2xl border border-green-400/30 text-center"
              style={{ animation: "scaleInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-5xl" style={{ animation: "shine 2s infinite" }}>
                    🏆
                  </div>
                </div>
              </div>

              {/* Header */}
              <h2 className="text-4xl font-black uppercase tracking-widest mb-2 bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                Level UP!
              </h2>
              <p className="text-lg text-slate-200 mb-1">Selamat! 🎊</p>

              {/* Level Name */}
              <div className="mb-8 py-8 px-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/50">
                <p className="text-xs text-slate-300 uppercase tracking-wide mb-2">Level Baru</p>
                <p className="text-3xl font-black text-green-300">{current.value.nama}</p>
              </div>

              {/* Rewards Section */}
              <div className="mb-6">
                <p className="text-xs text-slate-400 uppercase mb-3">Reward</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600">
                    <p className="text-lg">⭐</p>
                    <p className="text-xs text-slate-300 mt-1">Badge</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600">
                    <p className="text-lg">🎁</p>
                    <p className="text-xs text-slate-300 mt-1">Reward</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600">
                    <p className="text-lg">✨</p>
                    <p className="text-xs text-slate-300 mt-1">XP Boost</p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={next}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Hebat! Lanjutkan
              </button>
            </div>
          )}

          {/* ACHIEVEMENT POPUP */}
          {current.type === "ACHIEVEMENT" && (
            <div
              className="bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 text-white rounded-3xl p-8 shadow-2xl border border-pink-400/30 text-center"
              style={{ animation: "scaleInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-5xl" style={{ animation: "spin 3s linear infinite" }}>
                    ⭐
                  </div>
                </div>
              </div>

              {/* Header */}
              <h2 className="text-3xl font-black uppercase tracking-widest mb-1 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Achievement
              </h2>
              <p className="text-sm text-slate-300 mb-6">Unlocked!</p>

              {/* Achievement Image */}
              {current.value.urlGambar && (
                <div className="mb-6 flex justify-center">
                  <div className="relative p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-pink-400/50">
                    <img
                      src={current.value.urlGambar}
                      alt={current.value.nama}
                      className="w-32 h-32 object-contain drop-shadow-xl"
                    />
                  </div>
                </div>
              )}

              {/* Achievement Name & Description */}
              <div className="mb-8 py-6 px-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-pink-400/50">
                <p className="text-2xl font-black text-pink-300 mb-2">{current.value.nama}</p>
                <p className="text-sm text-slate-300 italic">{current.value.deskripsi}</p>
              </div>

              {/* Rewards */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600">
                  <p className="text-lg">🎯</p>
                  <p className="text-xs text-slate-300 mt-1">Objective</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600">
                  <p className="text-lg">🎁</p>
                  <p className="text-xs text-slate-300 mt-1">Reward</p>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={next}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Awesome! Lanjutkan
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}