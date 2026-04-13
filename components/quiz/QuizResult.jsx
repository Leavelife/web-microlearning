"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function QuizResult({ quiz, score }) {
  const [submitState, setSubmitState] = useState("idle"); // idle | ok | auth | error
  const [gamification, setGamification] = useState(null);

  useEffect(() => {
    if (score == null || !quiz?.id) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            quizId: quiz.id,
            score,
          }),
        });

        const data = await res.json();
        if (cancelled) return;

        if (res.ok) {
          setSubmitState("ok");
          setGamification(data.gamification || null);
        } else if (res.status === 401) {
          setSubmitState("auth");
        } else {
          setSubmitState("error");
        }
      } catch {
        if (!cancelled) setSubmitState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [quiz?.id, score]);

  const passing = quiz?.passingScore ?? 70;
  const lulus = score >= passing;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Hasil Quiz
        </h1>

        <p className="text-xl mb-2 text-gray-800">
          Skor: <b>{score}</b>
        </p>

        <p
          className={`text-sm font-medium mb-2 ${
            lulus ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {lulus ? "Selamat, kamu lulus!" : "Belum mencapai passing score."}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Passing score: {passing}
        </p>

        {submitState === "auth" && (
          <p className="text-xs text-gray-500 mb-4 px-2">
            Login untuk menyimpan hasil ke akunmu. Skor di atas tetap valid di
            layar ini.
          </p>
        )}
        {submitState === "error" && (
          <p className="text-xs text-red-600 mb-4 px-2">
            Gagal menyimpan hasil ke server. Coba lagi nanti.
          </p>
        )}
        {submitState === "ok" && gamification && (
          <div className="mb-4 rounded-2xl border border-emerald-200/20 bg-emerald-500/10 p-4 text-left text-sm">
            <p className="mb-2 text-emerald-600">
              EXP diterima: {gamification.expGained}
            </p>
            {gamification.levelUp && (
              <p className="mb-2 text-emerald-600">
                Level up! Kamu naik ke: {gamification.levelUp.nama}
              </p>
            )}
            {gamification.unlockedAchievements?.length > 0 ? (
              <div className="space-y-1 text-emerald-100">
                <p className="font-semibold">Achievement baru:</p>
                <ul className="list-disc list-inside">
                  {gamification.unlockedAchievements.map((ach) => (
                    <li key={ach.id}>{ach.nama}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-emerald-600">Belum ada achievement baru.</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/quiz"
            className="inline-flex justify-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800"
          >
            Daftar quiz
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center px-6 py-3 border border-gray-300 text-gray-800 text-sm font-medium rounded-full hover:bg-gray-50"
          >
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
