import Image from "next/image"
import EditProfile from "./EditProfile"

export default function ProfileSection({ user }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">

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
            {user.topAchievements.map((a, i) => (
              <li key={i} className="text-sm">
                🏅 {a.nama}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  )
}