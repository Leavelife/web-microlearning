"use client";

import Link from "next/link";
import { useState } from "react";
import QuestionCard from "./QuestionCard";
import QuizResult from "./QuizResult";

export default function QuizContainer({ quiz }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [resultScore, setResultScore] = useState(null);

  const questions = quiz?.soal ?? [];

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
  };

  const next = () => {
    const q = questions[current];
    if (!q || !answers[q.id]) {
      alert("Pilih salah satu jawaban terlebih dahulu.");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setResultScore(computeScore());
      setFinished(true);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  if (!questions.length) {
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
    return (
      <QuizResult quiz={quiz} score={resultScore} />
    );
  }

  const active = questions[current];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-2">
          <Link
            href="/quiz"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Daftar quiz
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">{quiz.judul}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Soal {current + 1} / {questions.length}
          </p>
          <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-300"
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <QuestionCard
          data={active}
          selected={answers[active.id]}
          onAnswer={handleAnswer}
        />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={next}
            className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800"
          >
            {current === questions.length - 1 ? "Selesai" : "Berikutnya"}
          </button>
        </div>
      </div>
    </div>
  );
}
