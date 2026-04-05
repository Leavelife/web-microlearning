import Link from "next/link";
import QuizCard from "@/components/quiz/QuizCard";
import { getQuizzesForStep } from "@/lib/quiz-for-pages";

export default async function QuizListPage({ params }) {
  const { stepId } = await params;
  const quizzes = await getQuizzesForStep(stepId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/learn"
          className="text-sm text-gray-500 hover:text-gray-800 mb-4 inline-block"
        >
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Quiz untuk step ini
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Step ID: {stepId}
        </p>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-gray-500 text-center py-12 border border-dashed border-gray-200 rounded-2xl">
          Belum ada quiz pada step ini.
        </p>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
