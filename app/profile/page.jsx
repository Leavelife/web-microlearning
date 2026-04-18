import { cookies } from "next/headers"
import Link from "next/link"
import ProfileSection from "@/components/profile/ProfileSection"
import LeaderboardPanel from "@/components/profile/LeaderboardPanel"
import LogoutButton from "@/components/profile/LogoutButton"
import Navbar from "@/components/Navbar"
import LessonGrid from "@/components/lesson/LessonGrid"
import BadgeCard from "@/components/achievement/BadgeCard"
import { getMateriListFormatted } from "@/lib/materi-list";

async function getProfile() {
  const cookieStore = await cookies()

  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://web-microlearning.vercel.app' : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/profile`, {
    headers: {
      Cookie: `token=${cookieStore.get("token")?.value}`
    },
    cache: "no-store"
  })

  return res.json()
}

export default async function ProfilePage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab || 'profile';

  const lessons = await getMateriListFormatted();
  const user = await getProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="?tab=profile"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    tab === 'profile'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 font-medium'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Profil Saya
                </Link>

                <Link
                  href="?tab=progress"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    tab === 'progress'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 font-medium'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  Progress Materi
                </Link>

                <Link
                  href="?tab=leaderboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    tab === 'leaderboard'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 font-medium'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 13V9m-4 4H5a2 2 0 00-2 2v3a2 2 0 002 2h2m14-7h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2z"></path></svg>
                  Leaderboard
                </Link>
                
                <hr className="my-4 border-gray-100" />
                
                {/* Komponen Client untuk fungsi Logout */}
                <LogoutButton />
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 mt-5">
            
            {/* RENDER KONTEN PROFIL */}
            {tab === 'profile' && (
              <ProfileSection user={user} />
            )}

            {tab === 'leaderboard' && (
              <LeaderboardPanel userWilayah={user.wilayah} />
            )}

            {/* RENDER KONTEN PROGRESS */}
            {tab === 'progress' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Kartu Statistik */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                   <h2 className="text-2xl font-bold text-gray-800 mb-6">Pencapaian Belajar</h2>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-sm text-gray-500 font-medium mb-1">Level Saat Ini</p>
                       <p className="text-2xl font-bold text-blue-600">{user.level?.nama || "Pemula"}</p>
                     </div>
                     <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-sm text-gray-500 font-medium mb-1">Total EXP</p>
                       <p className="text-2xl font-bold text-yellow-500">⚡ {user.totalExp || 0}</p>
                     </div>
                     <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-sm text-gray-500 font-medium mb-1">Peringkat Global</p>
                       <p className="text-2xl font-bold text-purple-600">#{user.ranking || "-"}</p>
                     </div>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Achievement</h3>
                     {user?.topAchievements?.length > 0 ? (
                       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                         {user.topAchievements.map((a) => (
                           <BadgeCard
                             key={a.id}
                             nama={a.nama}
                             deskripsi={a.deskripsi}
                             image={a.urlGambar}
                             exp={a.expReward}
                             eventType={a.eventType}
                             tanggalDidapat={a.tanggalDidapat}
                             isUnlocked={true}
                           />
                         ))}
                       </div>
                     ) : (
                       <p className="text-sm text-gray-500 italic bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                         Belum ada achievement yang diraih.
                       </p>
                     )}
                   </div>
                </div>

                {/* Kartu Lesson Grid */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Materi Tersedia</h2>
                  <LessonGrid lessons={lessons} />
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  )
}