"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function QuizResult({ quiz, score }) {
  const [submitState, setSubmitState] = useState("idle"); // idle | ok | auth | error

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

        if (cancelled) return;

        if (res.ok) {
          setSubmitState("ok");
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
