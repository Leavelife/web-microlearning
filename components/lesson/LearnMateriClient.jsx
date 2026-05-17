"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StepContent from "./StepContent";
import { useGamification } from "@/components/gamification/GamificationProvider";

export default function LearnMateriClient({
  materi,
  initialProgress,
  isLoggedIn,
}) {
  const { showGamification } = useGamification();
  const steps = materi.steps ?? [];
  const sorted = useMemo(
    () => [...steps].sort((a, b) => a.urutan - b.urutan),
    [steps]
  );

  const firstUrutan = sorted[0]?.urutan ?? 1;

  const [frontier, setFrontier] = useState(
    isLoggedIn && initialProgress
      ? initialProgress.stepSekarang
      : firstUrutan
  );
  const [selesai, setSelesai] = useState(
    isLoggedIn && initialProgress ? initialProgress.selesai : false
  );
  const [activeUrutan, setActiveUrutan] = useState(
    isLoggedIn && initialProgress
      ? initialProgress.stepSekarang
      : firstUrutan
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const activeStep = sorted.find((s) => s.urutan === activeUrutan) ?? null;

  const tabUnlocked = (urutan) => {
    if (!isLoggedIn) return true;
    if (selesai) return true;
    return urutan <= frontier;
  };

  const stepIndex = sorted.findIndex((s) => s.urutan === activeUrutan);
  const isLastStep = stepIndex >= 0 && stepIndex === sorted.length - 1;
  const hasNextTab = stepIndex >= 0 && stepIndex < sorted.length - 1;

  const goNextTab = () => {
    if (!hasNextTab) return;
    setActiveUrutan(sorted[stepIndex + 1].urutan);
  };

  const persistProgress = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/learn/${materi.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ urutan: activeUrutan }),
      });

      const data = await res.json().catch(() => ({}));

      if (data.gamification) {
        showGamification(data.gamification);
      }

      if (!res.ok) {
        if (data?.progress) {
          setFrontier(data.progress.stepSekarang);
          setSelesai(!!data.progress.selesai);
        }
        setError(data?.error || "Gagal menyimpan progres");
        return;
      }

      const p = data.progress;
      setFrontier(p.stepSekarang);
      setSelesai(!!p.selesai);

      if (!p.selesai) {
        setActiveUrutan(p.stepSekarang);
      }
    } catch {
      setError("Jaringan bermasalah. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrimary = async () => {
    setError(null);

    if (sorted.length === 0) return;

    if (selesai) {
      goNextTab();
      return;
    }

    if (!isLoggedIn) {
      if (hasNextTab) {
        goNextTab();
        return;
      }
      setError("Login agar progres tahap tersimpan di akunmu.");
      return;
    }

    if (activeUrutan < frontier) {
      goNextTab();
      return;
    }

    if (activeUrutan === frontier) {
      await persistProgress();
      return;
    }
  };

  const nextLabel = (() => {
    if (sorted.length === 0) return "Kembali";
    if (selesai) return hasNextTab ? "Berikutnya" : "Selesai";
    if (!isLoggedIn) return hasNextTab ? "Berikutnya" : "Selesai baca";
    if (activeUrutan < frontier) return hasNextTab ? "Berikutnya" : "Selesai";
    if (isLastStep) return selesai ? "Selesai" : "Selesai materi";
    return "Berikutnya";
  })();

  const primaryDisabled =
    saving ||
    (selesai && !hasNextTab) ||
    (!isLoggedIn && !hasNextTab && isLastStep);

  if (sorted.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-gray-500">
        <div className="text-center">
          <p className="mb-4">Materi ini belum memiliki tahap.</p>
          <Link href="/learn" className="text-purple-700 font-medium underline">
            Kembali ke daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <LearnMateriLayout
      sorted={sorted}
      activeUrutan={activeUrutan}
      setActiveUrutan={setActiveUrutan}
      tabUnlocked={tabUnlocked}
      isLoggedIn={isLoggedIn}
      selesai={selesai}
      frontier={frontier}
      activeStep={activeStep}
      materi={materi}
      error={error}
      saving={saving}
      primaryDisabled={primaryDisabled}
      nextLabel={nextLabel}
      handlePrimary={handlePrimary}
    />
  );
}

function LearnMateriLayout({
  sorted,
  activeUrutan,
  setActiveUrutan,
  tabUnlocked,
  isLoggedIn,
  selesai,
  frontier,
  activeStep,
  materi,
  error,
  saving,
  primaryDisabled,
  nextLabel,
  handlePrimary,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStepClick = (urutan, unlocked) => {
    if (!unlocked) return;
    setActiveUrutan(urutan);
    setSidebarOpen(false);
  };

  const activeTitle = sorted.find((s) => s.urutan === activeUrutan)?.judul ?? "";

  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── Mobile overlay backdrop ─────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      {/* Mobile: fixed off-canvas drawer (z-40, slides in/out)      */}
      {/* Desktop (lg+): sticky in-flow panel, no margin hack needed */}
      <aside
        className={[
          /* --- shared --- */
          "flex flex-col border-r border-gray-200 bg-gray-50/95 p-4",
          /* --- mobile: fixed off-canvas drawer --- */
          "fixed top-0 left-0 z-40 h-full w-72 max-w-[85vw] pt-16",
          "transition-transform duration-300 ease-in-out backdrop-blur-sm",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          /* --- desktop: in-flow sticky panel --- */
          /* page.jsx already has pt-16, so sticky top-0 = just below navbar */
          "lg:static lg:translate-x-0 lg:shadow-none lg:backdrop-blur-none",
          "lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-[calc(100vh-4rem)] lg:pt-4 lg:z-auto",
        ].join(" ")}
      >
        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup daftar tahap"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Tahap materi
        </p>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {sorted.map((s, i) => {
            const unlocked = tabUnlocked(s.urutan);
            const active = s.urutan === activeUrutan;
            return (
              <button
                key={s.id}
                type="button"
                disabled={!unlocked}
                onClick={() => handleStepClick(s.urutan, unlocked)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-purple-700 text-white shadow"
                    : unlocked
                      ? "text-gray-800 hover:bg-gray-200/80"
                      : "text-gray-400 cursor-not-allowed opacity-60"
                }`}
              >
                <span className="font-medium">{i + 1}.</span>{" "}
                <span className="line-clamp-2">{s.judul}</span>
              </button>
            );
          })}
        </nav>

        {isLoggedIn && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
            {selesai ? (
              <span className="text-emerald-600 font-medium">Materi selesai ✓</span>
            ) : (
              <>
                Tahap aktif: {frontier}
                <span className="text-gray-400"> · {sorted.length} total</span>
              </>
            )}
          </div>
        )}
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      {/* No ml-64 needed — sidebar is in-flow on desktop            */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Mobile top bar with sidebar toggle */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/80 lg:hidden sticky top-0 z-20">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka daftar tahap"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-100 active:scale-95 transition-all shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Tahap</span>
          </button>
          <span className="text-xs text-gray-500 truncate min-w-0">{activeTitle}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
          {error && (
            <div className="mb-4 rounded-lg bg-amber-50 text-amber-900 text-sm px-4 py-3 border border-amber-200">
              {error}
            </div>
          )}
          <StepContent step={activeStep} materiJudul={materi.judul} />
        </div>

        <footer className="shrink-0 border-t border-gray-100 px-4 sm:px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
          <Link
            href="/learn"
            className="text-sm text-gray-600 hover:text-gray-900 order-2 sm:order-1"
          >
            ← Daftar materi
          </Link>
          <button
            type="button"
            onClick={handlePrimary}
            disabled={primaryDisabled}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {saving ? "Menyimpan…" : nextLabel}
          </button>
        </footer>
      </main>
    </div>
  );
}
