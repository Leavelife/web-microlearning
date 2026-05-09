"use client";
import { useEffect, useState } from "react";
import ChartCard from "./ChartCard";
import FormMateriModal from "@/components/admin/materi/FormMateriModal";
import TableMateri from "@/components/admin/materi/TableMateri";
import TableStep from "@/components/admin/materi/TableStep";
import TableQuiz from "@/components/admin/quiz/TableQuiz";
import FormQuizModal from "@/components/admin/quiz/FormQuizModal";
import DetailQuiz from "@/components/admin/quiz/DetailQuiz";
import AchievementForm from "@/components/admin/achievement/AchievementForm";
import AchievementTable from "@/components/admin/achievement/AchievementTable";
import LevelForm from "@/components/admin/level/LevelForm";
import LevelTable from "@/components/admin/level/LevelTable";
import Link from "next/link";
import Image from "next/image";

/* ─── Design tokens ─────────────────────────────────────────── */
const MENU = [
  {
    view: "dashboard",
    label: "Dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
      </svg>
    ),
  },
  {
    view: "level",
    label: "Level",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    view: "achievement",
    label: "Achievement",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.798 49.798 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const STAT_META = [
  {
    key: "totalUsers",
    label: "Total User",
    color: "from-violet-600 to-violet-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: "totalMateri",
    label: "Total Materi",
    color: "from-sky-600 to-sky-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
      </svg>
    ),
  },
  {
    key: "totalQuiz",
    label: "Total Quiz",
    color: "from-emerald-600 to-emerald-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
        <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
      </svg>
    ),
  },
  {
    key: "totalSimulasi",
    label: "Total Simulasi",
    color: "from-amber-600 to-amber-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
        <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
        <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
      </svg>
    ),
  },
  {
    key: "totalAchievements",
    label: "Achievement",
    color: "from-pink-600 to-pink-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.798 49.798 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: "totalLevels",
    label: "Total Level",
    color: "from-indigo-600 to-indigo-400",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

/* ─── Sub-components ─────────────────────────────────────────── */
function StatCard({ title, value, color, icon }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 border border-white/8"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}>
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-15 bg-gradient-to-br ${color}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value ?? "—"}</p>
        </div>
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} text-white`}>
          {icon}
        </span>
      </div>
    </div>
  );
}

function Sidebar({ currentView, onChangeView }) {
  return (
    <aside className="fixed left-0 top-0 z-40 w-60 h-screen flex flex-col border-r border-white/8"
      style={{ background: "rgba(10,10,20,0.85)", backdropFilter: "blur(16px)" }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/8">
        <Link href="/">
          <Image src="/microlab.svg" alt="Microlab" width={130} height={40} className="brightness-150" />
        </Link>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-semibold">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {MENU.map((item) => {
          const active = currentView === item.view || (currentView === "steps" && item.view === "dashboard");
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onChangeView(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left
                ${active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/6"
                }`}
            >
              {item.icon}
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/8">
        <Link href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-white hover:bg-white/6 transition-all duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </aside>
  );
}

const VIEW_TITLE = {
  dashboard: "Dashboard",
  level: "Manajemen Level",
  achievement: "Manajemen Achievement",
  steps: "Manajemen Steps",
};

function Topbar({ currentView }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/8"
      style={{ background: "rgba(10,10,22,0.8)", backdropFilter: "blur(12px)" }}>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Admin</p>
        <h1 className="text-base font-semibold text-white">{VIEW_TITLE[currentView] ?? "Dashboard"}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
          A
        </div>
      </div>
    </header>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */
export default function DashboardClient({ stats, initialMateri, initialQuiz, initialAchievements, initialLevels, chartData }) {
  const [selectedQuiz,           setSelectedQuiz]           = useState(null);
  const [isQuizModalOpen,        setIsQuizModalOpen]        = useState(false);
  const [viewMode,               setViewMode]               = useState("list");
  const [selectedQuizForDetail,  setSelectedQuizForDetail]  = useState(null);
  const [currentView,            setCurrentView]            = useState("dashboard");
  const [selectedMateriId,       setSelectedMateriId]       = useState(null);
  const [materiListVersion,      setMateriListVersion]      = useState(0);

  return (
    <div className="flex text-white min-h-screen"
      style={{ background: "linear-gradient(145deg, #0d0d1a 0%, #111827 60%, #0f172a 100%)" }}>
      <Sidebar currentView={currentView} onChangeView={(v) => { setCurrentView(v); setViewMode("list"); }} />

      <div className="ml-60 flex-1 min-w-0">
        <Topbar currentView={currentView} />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {STAT_META.map((s) => (
              <StatCard key={s.key} title={s.label} value={stats?.[s.key]} color={s.color} icon={s.icon} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <ChartCard title="Activity Trend (7 hari)" data={chartData?.activityTrend || []} dataKey="total" color="#6F27FF" />
            </div>
            <div className="rounded-2xl border border-white/8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <ChartCard title="Avg Quiz Score (7 hari)" data={chartData?.quizTrend || []} dataKey="score" color="#10b981" />
            </div>
          </div>

          {/* Views */}
          {currentView === "dashboard" && (
            <>
              <TableMateri
                initialData={initialMateri}
                listVersion={materiListVersion}
                onManageSteps={(materiId) => {
                  setSelectedMateriId(materiId);
                  setCurrentView("steps");
                }}
              />

              {viewMode === "list" ? (
                <TableQuiz
                  initialData={initialQuiz}
                  onEdit={(quiz) => { setSelectedQuiz(quiz); setIsQuizModalOpen(true); }}
                  onAdd={() => { setSelectedQuiz(null); setIsQuizModalOpen(true); }}
                  onViewSoal={(quiz) => { setSelectedQuizForDetail(quiz); setViewMode("detail"); }}
                />
              ) : (
                <div className="space-y-5">
                  <button
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-150"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Kembali ke Daftar Quiz
                  </button>
                  <DetailQuiz quiz={selectedQuizForDetail} />
                </div>
              )}
            </>
          )}

          {currentView === "achievement" && (
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              <AchievementForm />
              <AchievementTable data={initialAchievements || []} />
            </div>
          )}

          {currentView === "level" && (
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              <LevelForm />
              <LevelTable data={initialLevels || []} />
            </div>
          )}

          {currentView === "steps" && (
            <TableStep
              materiId={selectedMateriId}
              onClose={() => {
                setCurrentView("dashboard");
                setMateriListVersion((v) => v + 1);
              }}
            />
          )}
        </div>
      </div>

      <FormQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        initialData={selectedQuiz}
        onSuccess={() => setSelectedQuiz(null)}
        materiList={initialMateri}
      />
    </div>
  );
}
