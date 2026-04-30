'use client'
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
  
function StatCard({ title, value }) {
  return (
    <div className="bg-white/5 backdrop-blur rounded-2xl p-4 shadow">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

function Sidebar({ currentView, onChangeView }) {
  const menu = [
    { label: "Dashboard", view: "dashboard" },
    { label: "Level", view: "level" },
    { label: "Achievement", view: "achievement" },
  ];
  return (
    <div className="fixed left-0 top-0 z-40 w-64 h-screen bg-black/40 backdrop-blur p-4">
      <Link href="/" className="text-xl font-bold mb-6">
        <Image src="/microlab.svg" alt="Logo" width={150} height={150} className="inline-block mr-2" />
      </Link>
      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => onChangeView(item.view)}
              className={`w-full text-left ${currentView === item.view ? "text-blue-400 font-semibold" : "hover:text-blue-400"}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Topbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b border-white/10">
      <input
        placeholder="Search..."
        className="bg-white/5 px-3 py-2 rounded-lg outline-none"
      />
      <div className="w-10 h-10 rounded-full bg-white/20" />
    </div>
  );
}

export default function DashboardClient({ stats, initialMateri, initialQuiz, initialAchievements, initialLevels, chartData }) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [selectedQuizForDetail, setSelectedQuizForDetail] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'steps', 'achievement'
  const [selectedMateriId, setSelectedMateriId] = useState(null);
  const [materiListVersion, setMateriListVersion] = useState(0);

  return (
    <div className="flex text-white min-h-screen bg-linear-to-br from-black via-gray-900 to-black">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <div className="ml-64 flex-1 min-w-0">
        <Topbar />

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            <StatCard title="Total User" value={stats?.totalUsers ?? "-"} />
            <StatCard title="Total Materi" value={stats?.totalMateri ?? "-"} />
            <StatCard title="Total Quiz" value={stats?.totalQuiz ?? "-"} />
            <StatCard title="Total Simulasi" value={stats?.totalSimulasi ?? "-"} />
            <StatCard title="Total Achievement" value={stats?.totalAchievements ?? "-"} />
            <StatCard title="Total Level" value={stats?.totalLevels ?? "-"} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl h-72">
                <ChartCard title="Activity Trend" data={chartData?.activityTrend || []} dataKey="total" />
            </div>
            <div className="bg-white/5 rounded-2xl h-72">
                <ChartCard title="Quiz Trend" data={chartData?.quizTrend || []} dataKey="score" />
            </div>
          </div>

          {currentView === 'dashboard' && (
            <>
              <TableMateri
                initialData={initialMateri}
                listVersion={materiListVersion}
                onManageSteps={(materiId) => {
                  setSelectedMateriId(materiId);
                  setCurrentView('steps');
                }}
              />

              {viewMode === 'list' ? (
                <TableQuiz
                  initialData={initialQuiz}
                  onEdit={(quiz) => {
                    setSelectedQuiz(quiz);
                    setIsQuizModalOpen(true);
                  }}
                  onAdd={() => {
                    setSelectedQuiz(null);
                    setIsQuizModalOpen(true);
                  }}
                  onViewSoal={(quiz) => {
                    setSelectedQuizForDetail(quiz);
                    setViewMode('detail');
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setViewMode('list')}
                    className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    ← Back to Quiz List
                  </button>
                  <DetailQuiz quiz={selectedQuizForDetail} />
                </div>
              )}
            </>
          )}

          {currentView === 'achievement' && (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <AchievementForm />
              <AchievementTable data={initialAchievements || []} />
            </div>
          )}

          {currentView === 'level' && (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <LevelForm />
              <LevelTable data={initialLevels || []} />
            </div>
          )}

          {currentView === 'steps' && (
            <TableStep
              materiId={selectedMateriId}
              onClose={() => {
                setCurrentView('dashboard');
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
        onSuccess={() => {
          // Reset selectedQuiz after operation
          setSelectedQuiz(null);
        }}
        materiList={initialMateri}
      />
    </div>
  );
}
