'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import EditProfile from "./EditProfile"

export default function ProfileSection({ user }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (res.ok) {
        router.push("/login")
      } else {
        alert("Logout gagal")
      }
    } catch (error) {
      alert("Terjadi kesalahan saat logout")
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-15">

      {/* LEFT: DATA DIRI */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-4">
          <Image
            src={user.image || "/default-avatar.png"}
            alt="User avatar"
            className="w-20 h-20 rounded-full"
            width={80}
            height={80}
          />

          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p>🌍 Wilayah: {user.wilayah || "-"}</p>
        </div>

        <EditProfile user={user} />

        {/* Tombol Logout */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT: PROGRESS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-bold mb-4">Progress Kamu</h3>

        <p>🏆 Level: {user.level?.nama}</p>
        <p>⚡ EXP: {user.totalExp}</p>
        <p>📊 Ranking: {user.ranking || "-"}</p>

        <div className="mt-4">
          <h4 className="font-semibold">Top Achievement</h4>
          <ul className="mt-2 space-y-2">
            {(user?.topAchievements || []).map((a, i) => (
              <li key={i} className="text-sm">
                🏅 {a?.nama || "-"}
              </li>
            ))}
          </ul>
          {(!user?.topAchievements || user.topAchievements.length === 0) && (
            <p className="text-sm text-gray-500">Belum ada achievement</p>
          )}
        </div>
      </div>
    </div>
  )
}