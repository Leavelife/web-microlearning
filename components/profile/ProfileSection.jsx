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
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="relative mx-auto lg:mx-0 h-28 w-28 rounded-full bg-slate-100 shadow-inner">
              <Image
                src={user.image || "/default-avatar.png"}
                alt="User avatar"
                className="absolute inset-0 h-full w-full rounded-full object-cover border-4 border-white shadow-xl"
                width={112}
                height={112}
              />
            </div>
            <div className="flex-1 min-w-0 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Profil Pengguna</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 truncate">{user.username}</h2>
              <p className="mt-2 text-sm text-slate-500">{user.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{user.wilayah || "Wilayah belum diatur"}</span>
              </div>
            </div>
            <div className="mx-auto lg:mx-0">
              <EditProfile user={user} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-linear-to-br from-slate-10 via-violet-100 to-purple-100 p-8 shadow-2xl text-white overflow-hidden">
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/10 p-6">
            <div className="absolute -left-8 top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -right-8 bottom-8 h-24 w-24 rounded-full bg-fuchsia-400/20 blur-2xl" />
            <div className="flex flex-col items-center gap-6">
              <div className="relative flex h-46 w-46 items-center justify-center rounded-full bg-transparent shadow-2xl">
                <Image
                  src={user.level?.urlGambar || "/default-avatar.png"}
                  alt={user.level?.nama || "Pemula"}
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
              <div className="space-y-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-900">Level Saat Ini</p>
                <h3 className="text-3xl font-semibold text-violet-800">{user.level?.nama || "Pemula"}</h3>
                <p className="text-sm text-violet-800">{user.totalExp ?? 0} EXP total</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Detail Level</p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Ranking Global</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{user.ranking ? `#${user.ranking}` : "-"}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Ranking Wilayah</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{user.rankingWilayah ? `#${user.rankingWilayah}` : "-"}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total EXP</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{user.totalExp ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Status Global</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Image
                    src={user.level?.urlGambar || "/default-avatar.png"}
                    alt={user.level?.nama || "Pemula"}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Level</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{user.level?.nama || "Pemula"}</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Peringkat Global</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{user.ranking ? `#${user.ranking}` : "-"}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Username</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 truncate">{user.username}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Statistik Tambahan</p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Achievement Unlocked</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">-</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Quiz Completed</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">-</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Learning Streak</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
