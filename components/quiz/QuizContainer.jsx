"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import QuestionCard from "./QuestionCard";
import QuizResult from "./QuizResult";

export default function QuizContainer({ quiz }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [resultScore, setResultScore] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const questions = quiz?.soal ?? [];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions ? ((current + 1) / totalQuestions) * 100 : 0;

  const computeScore = () => {
    let total = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.jawabanBenar) {
        total += Number(q.score) || 0;
      }
    });
    return total;
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setErrorMessage("");
  };

  const next = () => {
    const q = questions[current];
    if (!q || !answers[q.id]) {
      setErrorMessage("Pilih salah satu jawaban terlebih dahulu untuk melanjutkan.");
      return;
    }

    if (current < totalQuestions - 1) {
      setCurrent((c) => c + 1);
    } else {
      setResultScore(computeScore());
      setFinished(true);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setErrorMessage("");
    }
  };

  const active = questions[current];

  if (!totalQuestions) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-gray-500">Tidak ada soal untuk ditampilkan.</p>
        <Link href="/quiz" className="text-sm text-gray-900 underline">
          Kembali ke daftar quiz
        </Link>
      </div>
    );
  }

  if (finished && resultScore != null) {
    return <QuizResult quiz={quiz} score={resultScore} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Link href="/quiz" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            ← Kembali ke daftar quiz
          </Link>
          <div className="text-right text-xs uppercase tracking-[0.22em] text-slate-500">
            Quiz interaktif
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.2)] p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{quiz.judul}</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                Soal {current + 1} dari {totalQuestions}
              </h1>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p className="font-medium text-slate-900">Jawaban terisi</p>
              <p>{answeredCount} / {totalQuestions}</p>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="rounded-full bg-slate-100 overflow-hidden h-3">
              <div
                className="h-full bg-slate-900 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>{quiz.deskripsi ? quiz.deskripsi : "Jawab soal berikut dengan fokus untuk mendapatkan skor terbaik."}</span>
              <span className="font-medium text-slate-700">{Math.round(progressPercent)}% selesai</span>
            </div>
          </div>

          <QuestionCard
            data={active}
            selected={answers[active.id]}
            onAnswer={handleAnswer}
          />

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Klik opsi jawaban untuk memilih, lalu gunakan tombol di bawah.
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={current === 0}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {current === totalQuestions - 1 ? "Kirim jawaban" : "Lanjutkan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
