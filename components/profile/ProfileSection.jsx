'use client'

import Image from "next/image"
import EditProfile from "./EditProfile"

export default function ProfileSection({ user }) {
  const minExp = user.level?.minExp ?? 0
  const maxExp = user.level?.maxExp ?? (user.totalExp ?? 0)
  const progress = maxExp > minExp
    ? Math.min(100, Math.max(0, ((user.totalExp ?? 0) - minExp) / (maxExp - minExp) * 100))
    : 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Profil</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8">
          <Image
            src={user.image || "/default-avatar.png"}
            alt="User avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
            width={96}
            height={96}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {user.wilayah || "Wilayah belum diatur"}
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <EditProfile user={user} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="bg-white rounded-3xl border border-violet-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white border border-violet-200 shadow-sm">
              <Image
                src={user.level?.urlGambar || "/default-avatar.png"}
                alt={user.level?.nama || "Pemula"}
                width={72}
                height={72}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700/80">
                Level Saat Ini
              </p>
              <h3 className="mt-2 text-3xl font-bold text-violet-900">
                {user.level?.nama || "Pemula"}
              </h3>
              <p className="mt-2 text-sm text-violet-600">
                {user.totalExp ?? 0} EXP total
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-violet-50 p-4 border border-violet-100">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-violet-900">
              <span>{minExp.toLocaleString()} EXP</span>
              <span>{maxExp.toLocaleString()} EXP</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-violet-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-violet-600">
              {progress === 100 ? "Target level tercapai" : `${Math.max(0, Math.ceil(maxExp - (user.totalExp ?? 0)))} EXP lagi untuk level berikutnya`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em]">
            Detail Level
          </p>
          <div className="mt-5 space-y-4 text-sm text-gray-700">
            <div className="rounded-2xl bg-violet-50 p-4 border border-violet-100">
              <p className="text-xs text-violet-500 uppercase tracking-[0.18em]">Ranking</p>
              <p className="mt-2 text-lg font-semibold text-violet-900">{user.ranking ? `#${user.ranking}` : "-"}</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-4 border border-violet-100">
              <p className="text-xs text-violet-500 uppercase tracking-[0.18em]">Total EXP</p>
              <p className="mt-2 text-lg font-semibold text-violet-900">{user.totalExp ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-4 border border-violet-100">
              <p className="text-xs text-violet-500 uppercase tracking-[0.18em]">Level Badge</p>
              <p className="mt-2 text-lg font-semibold text-violet-900">{user.level?.nama ? `Level ${user.level.nama}` : "Pemula"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
